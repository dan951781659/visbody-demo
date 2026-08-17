import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const file = join(
  process.cwd(),
  "node_modules/expo/node_modules/@expo/cli/build/src/start/server/middleware/CorsMiddleware.js",
);

const marker = "isCursorPreviewOrigin";
const source = readFileSync(file, "utf8");

if (source.includes(marker)) {
  process.exit(0);
}

const needle = `return (req, res, next)=>{
        if (typeof req.headers.origin === 'string') {
            const { host, hostname } = new URL(req.headers.origin);
            const isSameOrigin = host === req.headers.host;
            const isLocalhost = _isLocalHostname(hostname);
            const isAllowedHost = allowedHosts.includes(host) || isLocalhost;`;

if (!source.includes("if (typeof req.headers.origin === 'string')")) {
  console.warn("未找到 Expo CORS 校验片段，跳过 Cursor 预览补丁。");
  process.exit(0);
}

const helper = `function isCursorPreviewOrigin(origin) {
    return origin.startsWith('vscode-file:') || origin.startsWith('vscode-webview:') || origin.startsWith('vscode-app:') || origin.startsWith('cursor-webview:');
}
`;

let patched = source;
if (!patched.includes("function isCursorPreviewOrigin")) {
  patched = patched.replace(
    "function createCorsMiddleware(exp) {",
    `${helper}function createCorsMiddleware(exp) {`,
  );
}

if (patched.includes(needle)) {
  patched = patched.replace(
    needle,
    `return (req, res, next)=>{
        if (typeof req.headers.origin === 'string') {
            const isCursorPreview = isCursorPreviewOrigin(req.headers.origin);
            if (isCursorPreview) {
                res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
                maybePreventMetroResetCorsHeader(req, res);
                res.setHeader('X-Content-Type-Options', 'nosniff');
                next();
                return;
            }
            const { host, hostname } = new URL(req.headers.origin);
            const isSameOrigin = host === req.headers.host;
            const isLocalhost = _isLocalHostname(hostname);
            const isAllowedHost = allowedHosts.includes(host) || isLocalhost;`,
  );
} else {
  // Remove weak previous patch if present, then inject early allow.
  patched = patched.replace(
    /\s*const isCursorPreview = req\.headers\.origin\.startsWith\('vscode-file:'\)[\s\S]*?const isAllowedHost = allowedHosts\.includes\(host\) \|\| isLocalhost \|\| isCursorPreview;/,
    `
            const isAllowedHost = allowedHosts.includes(host) || isLocalhost;`,
  );
  patched = patched.replace(
    `if (typeof req.headers.origin === 'string') {
            const { host, hostname } = new URL(req.headers.origin);`,
    `if (typeof req.headers.origin === 'string') {
            const isCursorPreview = isCursorPreviewOrigin(req.headers.origin);
            if (isCursorPreview) {
                res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
                maybePreventMetroResetCorsHeader(req, res);
                res.setHeader('X-Content-Type-Options', 'nosniff');
                next();
                return;
            }
            const { host, hostname } = new URL(req.headers.origin);`,
  );
}

if (!patched.includes(marker)) {
  console.warn("未成功写入 Cursor 预览 CORS 补丁。");
  process.exit(0);
}

writeFileSync(file, patched);
console.log("已应用 Cursor 预览 CORS 补丁。");
