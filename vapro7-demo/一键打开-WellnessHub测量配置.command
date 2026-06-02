#!/bin/bash
cd "$(dirname "$0")"
TARGET="$(pwd)/wellnesshub-measurement-config-demo.html"
if [[ ! -f "$TARGET" ]]; then
  echo "未找到: wellnesshub-measurement-config-demo.html"
  exit 1
fi
open "$TARGET"
