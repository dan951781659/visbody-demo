@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "DEMO=%~dp0wellnesshub-measurement-config-demo.html"
if not exist "%DEMO%" (
  echo 未找到文件: wellnesshub-measurement-config-demo.html
  pause
  exit /b 1
)
start "" "%DEMO%"
