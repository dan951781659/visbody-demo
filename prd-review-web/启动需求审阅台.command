#!/bin/zsh
cd "${0:A:h}"
if /usr/bin/curl -fsS http://127.0.0.1:8765/api/status >/dev/null 2>&1; then
  open http://127.0.0.1:8765/
  exit 0
fi
/usr/bin/python3 server.py &
review_pid=$!
trap 'kill "$review_pid" 2>/dev/null' EXIT INT TERM
for attempt in {1..30}; do
  if /usr/bin/curl -fsS http://127.0.0.1:8765/api/status >/dev/null 2>&1; then
    open http://127.0.0.1:8765/
    echo '需求审阅台已启动。使用期间请保留此终端窗口。'
    wait "$review_pid"
    exit $?
  fi
  sleep 0.2
done
echo '启动失败，请检查上方错误信息。'
wait "$review_pid"
