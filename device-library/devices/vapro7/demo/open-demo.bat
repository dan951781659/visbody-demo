@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 Node.js。请先安装 https://nodejs.org/ 并重新打开本窗口。
  pause
  exit /b 1
)

echo 正在启动静态服务 http://127.0.0.1:5173 ...
echo 关闭本窗口即停止服务。
start "VAPro7-static-5173" cmd /k "npx --yes serve . -l 5173"

REM 等待几秒让服务起来后再打开浏览器（无 timeout 时用 ping 代替）
ping 127.0.0.1 -n 5 >nul

start "" "http://127.0.0.1:5173/index.html"
start "" "http://127.0.0.1:5173/wellnesshub-measurement-config-demo.html"

echo 已在浏览器打开 index 与 WellnessHub 测量配置页。若页面空白，请稍等再刷新。
pause
