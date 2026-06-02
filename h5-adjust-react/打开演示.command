#!/bin/bash
# 双击本文件即可在浏览器打开 Demo（勿直接双击 index.html）
cd "$(dirname "$0")"
PORT="${PORT:-8765}"
URL="http://127.0.0.1:${PORT}/"

echo ""
echo "  H5 调整方案 Demo"
echo "  ─────────────────────────────"
echo "  正在启动本地服务: ${URL}"
echo "  关闭此终端窗口即停止服务"
echo ""

if command -v open >/dev/null 2>&1; then
  (sleep 0.8 && open "${URL}") &
fi

exec python3 -m http.server "${PORT}"
