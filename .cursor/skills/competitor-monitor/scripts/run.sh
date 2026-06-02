#!/bin/bash
# 竞品监控 - 一键运行
cd "$(dirname "$0")"

# 使用 venv（若存在）
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d ".venv" ]; then
    source .venv/bin/activate
fi

# 检查依赖
python3 -c "import requests, bs4" 2>/dev/null || {
    echo "正在安装依赖..."
    pip3 install -q requests beautifulsoup4 feedparser
}

# 运行（传参透传）
python3 monitor.py "$@"
