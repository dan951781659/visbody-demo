#!/usr/bin/env node
/**
 * 局域网 Web 预览：打包静态站 → 本机 0.0.0.0 起服 → 终端打印二维码
 * 扫码人用手机浏览器打开即可，无需 Expo Go。手机与电脑需同一 Wi‑Fi。
 *
 * 用法：
 *   npm run share:lan          # 重新打包并起服
 *   npm run share:lan:serve    # 仅起服（使用已有 dist-web）
 */
import { networkInterfaces } from "node:os";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "dist-web");
const port = Number(process.env.SHARE_PORT || 4173);
const skipExport = process.argv.includes("--serve-only");

function getLanIps() {
  const nets = networkInterfaces();
  const ips = [];
  for (const entries of Object.values(nets)) {
    if (!entries) continue;
    for (const net of entries) {
      if (net.family === "IPv4" && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return ips;
}

function pickLanIp(ips) {
  const preferred = ips.find(
    (ip) =>
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
  return preferred || ips[0] || null;
}

function printQr(url) {
  const result = spawnSync(
    "npx",
    ["--yes", "qrcode-terminal", url],
    { cwd: root, encoding: "utf8", env: process.env }
  );
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.status !== 0) {
    console.warn("\n（二维码生成失败，请手动在手机浏览器打开上方链接）\n");
    if (result.stderr) process.stderr.write(result.stderr);
  }
}

/** single 导出不会吃 app/+html.tsx，打包后补丁视口，避免底部 Tab 被裁切 */
function patchWebIndexHtml() {
  const indexPath = join(outDir, "index.html");
  if (!existsSync(indexPath)) return;

  let html = readFileSync(indexPath, "utf8");
  html = html.replace(
    /<meta name="viewport"[^>]*>/,
    '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />'
  );
  html = html.replace(
    /<style id="expo-reset">[\s\S]*?<\/style>/,
    `<style id="expo-reset">
      html, body, #root {
        height: 100%;
        height: 100dvh;
        max-height: 100dvh;
        margin: 0;
        background-color: #000;
      }
      body { overflow: hidden; }
      #root {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
      }
    </style>`
  );
  writeFileSync(indexPath, html);
  console.log("已适配手机浏览器视口（viewport-fit + 100dvh）");
}

if (!skipExport) {
  console.log("\n📦 正在打包 Web 静态站 → dist-web/\n");
  const exportResult = spawnSync(
    "npx",
    ["expo", "export", "--platform", "web", "--output-dir", "dist-web"],
    { cwd: root, stdio: "inherit", env: process.env }
  );
  if (exportResult.status !== 0) {
    console.error("打包失败，已中止。");
    process.exit(exportResult.status ?? 1);
  }
} else if (!existsSync(join(outDir, "index.html"))) {
  console.error("未找到 dist-web/index.html，请先执行：npm run export:web");
  process.exit(1);
}

patchWebIndexHtml();

const ips = getLanIps();
const lanIp = pickLanIp(ips);
const localUrl = `http://localhost:${port}`;
const lanUrl = lanIp ? `http://${lanIp}:${port}` : null;

console.log("\n========================================");
console.log("  MotionStation 局域网预览（无需 Expo Go）");
console.log("========================================");
console.log(`  本机：  ${localUrl}`);
if (lanUrl) {
  console.log(`  局域网：${lanUrl}`);
} else {
  console.log("  未检测到局域网 IP，请确认 Wi‑Fi 已连接");
}
if (ips.length > 1) {
  console.log(`  其他网卡：${ips.filter((ip) => ip !== lanIp).join(", ")}`);
}
console.log("----------------------------------------");
console.log("  手机与电脑连同一 Wi‑Fi，扫下方二维码");
console.log("  用 Safari / Chrome 打开即可");
console.log("  Ctrl+C 结束服务");
console.log("========================================\n");

if (lanUrl) {
  printQr(lanUrl);
  console.log(`\n预览地址：${lanUrl}\n`);
}

const child = spawn(
  "npx",
  ["--yes", "serve", "dist-web", "-s", "-l", `tcp://0.0.0.0:${port}`],
  { cwd: root, stdio: "inherit", env: process.env }
);

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});

process.on("SIGINT", () => {
  child.kill("SIGINT");
});
process.on("SIGTERM", () => {
  child.kill("SIGTERM");
});
