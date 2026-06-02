#!/bin/bash
# 在本目录启动静态服务（5173），并打开联调总览 + WellnessHub Demo + 设备入口
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "未检测到 Node.js，请先安装 https://nodejs.org/"
  exit 1
fi

if lsof -iTCP:5173 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "端口 5173 已有服务在监听，跳过启动。若需重启请先结束占用进程。"
else
  echo "正在启动 http://127.0.0.1:5173 …（关闭终端窗口即停止）"
  npx --yes serve . -l 5173 &
  SERVE_PID=$!
  sleep 3
fi

open "http://127.0.0.1:5173/local-demo-hub.html" 2>/dev/null || true
open "http://127.0.0.1:5173/wellnesshub-measurement-config-demo.html" 2>/dev/null || true
open "http://127.0.0.1:5173/standby.html" 2>/dev/null || true

echo "已在浏览器打开联调页。本终端可保留以查看 serve 日志；若本脚本启动了 serve，勿关闭本窗口。"
