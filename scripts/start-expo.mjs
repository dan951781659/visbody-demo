#!/usr/bin/env node
/**
 * 启动 Expo Go 局域网预览，自动避开 VPN 虚拟网卡（如 198.18.x.x）。
 */
import { networkInterfaces } from "node:os";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const extraArgs = process.argv.slice(2);

function getLanIp() {
  if (process.env.REACT_NATIVE_PACKAGER_HOSTNAME) {
    return process.env.REACT_NATIVE_PACKAGER_HOSTNAME;
  }
  const ips = [];
  for (const entries of Object.values(networkInterfaces())) {
    if (!entries) continue;
    for (const net of entries) {
      if (net.family === "IPv4" && !net.internal) ips.push(net.address);
    }
  }
  const preferred = ips.find(
    (ip) =>
      !ip.startsWith("198.18.") &&
      (ip.startsWith("192.168.") ||
        ip.startsWith("10.") ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip))
  );
  return preferred || ips[0] || null;
}

const lanIp = getLanIp();
if (!lanIp) {
  console.error("未检测到局域网 IP，请确认已连接 Wi‑Fi。");
  process.exit(1);
}

const url = `exp://${lanIp}:8081`;
console.log("\n========================================");
console.log("  Expo Go 局域网预览");
console.log("========================================");
console.log(`  地址：${url}`);
console.log("  请用 Expo Go 扫码，或在 App 内手动输入上方地址");
console.log("  若连不上：关掉 VPN / Clash，手机与电脑同一 Wi‑Fi");
console.log("========================================\n");

const child = spawn(
  "npx",
  ["expo", "start", "--lan", "--port", "8081", ...extraArgs],
  {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      REACT_NATIVE_PACKAGER_HOSTNAME: lanIp,
    },
  }
);

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
