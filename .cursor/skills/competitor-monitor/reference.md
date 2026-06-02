# 竞品监控 - 部署与配置参考

## 一、钉钉机器人配置

1. **创建群**：至少 3 人
2. **添加机器人**：群设置 → 智能群助手 → 添加机器人 → 自定义
3. **安全设置**（必选其一）：
   - **加签**：复制 SEC 开头的 secret，脚本会自动计算签名
   - **自定义关键词**：消息中需包含如「竞品」「总结」「原文」等
4. **复制 Webhook**：`https://oapi.dingtalk.com/robot/send?access_token=XXX`

## 二、LLM 配置（AI 总结）

支持 OpenAI 兼容 API，可选用：

| 服务 | base_url | 说明 |
|------|----------|------|
| OpenAI | https://api.openai.com/v1 | 默认 |
| DeepSeek | https://api.deepseek.com/v1 | 国内可用 |
| 通义千问 | 按官方文档 | 阿里云 |
| 本地/代理 | 自填 | 任意兼容接口 |

示例（DeepSeek）：

```json
"llm": {
  "provider": "deepseek",
  "api_key": "sk-xxx",
  "base_url": "https://api.deepseek.com/v1",
  "model": "deepseek-chat"
}
```

若不需要 AI 总结，可将 `api_key` 留空，脚本会直接截取原文前 200 字。

## 三、竞品数据源配置

### 网页爬取 (type: scrape)

需根据实际页面结构调整 `list_selector`：

- **仙库**：官网新闻通常在 `/newsinfo/` 路径下，可用 `a[href*='newsinfo']`
- **锐动科技**：若官网无新闻列表，可改为监控首页链接变化，或补充其公众号/博客地址

### 多渠道配置

每个竞品可配置多个 `channels`，每个渠道独立监控：

```json
{
  "name": "仙库",
  "channels": [
    {
      "url": "https://www.xianku.com/",
      "type": "scrape",
      "list_selector": "a[href*='newsinfo']",
      "label": "官网"
    },
    {
      "type": "rss",
      "feed_url": "https://xxx.com/feed.xml",
      "label": "公众号"
    }
  ]
}
```

### RSS (type: rss)

在 channels 中新增一项，设置 `type: "rss"` 和 `feed_url`。**公众号转 RSS**：可使用 [Wechat2RSS](https://wechat2rss.xlab.app) 等工具。

## 四、定时执行

### 方式 A：本机 cron

```bash
crontab -e
# 每天 9:00、14:00、18:00 执行
0 9,14,18 * * * cd /path/to/competitor-monitor/scripts && /usr/bin/python3 monitor.py >> /tmp/competitor-monitor.log 2>&1
```

### 方式 B：GitHub Actions

1. 在仓库创建 `.github/workflows/competitor-monitor.yml`：

```yaml
name: Competitor Monitor
on:
  schedule:
    - cron: '0 1,9,17 * * *'  # UTC 1:00/9:00/17:00 ≈ 北京 9:00/17:00/01:00
  workflow_dispatch:
jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r .cursor/skills/competitor-monitor/scripts/requirements.txt
      - name: Run monitor
        env:
          CONFIG_JSON: ${{ secrets.COMPETITOR_MONITOR_CONFIG }}
        run: |
          echo "$CONFIG_JSON" > .cursor/skills/competitor-monitor/scripts/config.json
          python .cursor/skills/competitor-monitor/scripts/monitor.py
```

2. 在仓库 Settings → Secrets 中新增 `COMPETITOR_MONITOR_CONFIG`，值为 `config.json` 的完整内容（注意不要泄露到代码库）。

### 方式 C：云函数（腾讯云 / 阿里云）

将脚本打包为云函数，配置定时触发器，按文档配置环境变量（webhook、api_key 等）。

## 五、常见问题

| 问题 | 处理 |
|------|------|
| 钉钉收不到 | 检查 webhook、加签/关键词；确认网络可访问 oapi.dingtalk.com |
| 采集不到新内容 | 用浏览器开发者工具查看页面结构，更新 `list_selector` |
| 总结为空或报错 | 检查 LLM api_key、base_url；可暂时留空 api_key 使用原文摘要 |
| 重复推送 | 检查 `state.json` 是否被正确读写；首次运行会推送历史链接，可清空 state 后只保留 cron 定时 |
