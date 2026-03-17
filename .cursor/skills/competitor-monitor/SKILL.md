---
name: competitor-monitor
description: 搭建竞品信息自动收集与钉钉通知系统。监控竞品（如锐动科技、仙库）新发布内容，生成 AI 总结并推送至钉钉群。Use when the user wants to set up competitor monitoring, DingTalk notifications for competitor updates, or competitive intelligence collection.
---

# 竞品信息收集与钉钉通知

## 目标

当竞品发布新内容时，自动通知到钉钉群，通知包含：
1. **AI 总结**：对竞品发布内容做简明摘要
2. **原文链接**：携带可点击的原文地址
3. **竞品标识**：标明来源（如锐动科技、仙库）

## 实现架构

```
[数据源] → [采集脚本] → [AI 总结] → [钉钉 Webhook] → [群消息]
```

- **数据源**：竞品官网新闻、公众号 RSS、博客等
- **采集**：定时任务（cron / GitHub Actions）
- **总结**：调用 LLM API（OpenAI / DeepSeek 等）
- **通知**：钉钉自定义机器人 Webhook

## 快速开始

### 1. 钉钉机器人配置

1. 钉钉群 → 群设置 → 智能群助手 → 添加机器人 → 自定义
2. 安全设置：选择「加签」或「自定义关键词」（如：竞品、总结、原文）
3. 复制 Webhook 地址：`https://oapi.dingtalk.com/robot/send?access_token=XXX`

### 2. 配置竞品与密钥

复制 `config.example.json` 为 `config.json`，填写：

```json
{
  "dingtalk": {
    "webhook": "https://oapi.dingtalk.com/robot/send?access_token=YOUR_TOKEN",
    "secret": "YOUR_SECRET"
  },
  "llm": {
    "provider": "openai",
    "api_key": "sk-xxx",
    "base_url": "https://api.openai.com/v1"
  },
  "competitors": [
    {
      "name": "仙库",
      "channels": [
        {
          "url": "https://www.xianku.com/",
          "type": "scrape",
          "list_selector": "a[href*='newsinfo']",
          "link_attr": "href",
          "label": "官网"
        }
      ]
    },
    {
      "name": "锐动科技",
      "channels": [
        {
          "url": "http://rdwl.cc/",
          "type": "scrape",
          "list_selector": "a[href]",
          "link_attr": "href"
        }
      ]
    }
  ]
}
```

### 3. 运行脚本

```bash
cd .cursor/skills/competitor-monitor/scripts
pip install -r requirements.txt
python monitor.py
```

### 4. 定时执行（自动通知）

**方式 A：cron（服务器 / 本机）**

```bash
# 每天 9:00 和 18:00 各执行一次
0 9,18 * * * cd /path/to/competitor-monitor/scripts && python monitor.py
```

**方式 B：GitHub Actions**

在 `.github/workflows/competitor-monitor.yml` 中配置定时任务，将 `config.json` 作为 Secrets 存储。

## 竞品与渠道配置

每个竞品可配置多个 **channels**，每个 channel 独立监控：

| 字段 | 说明 |
|------|------|
| `url` | 数据源地址（必填） |
| `type` | `scrape` 网页爬取 / `rss` RSS 订阅 |
| `list_selector` | scrape 时使用的 CSS 选择器 |
| `link_attr` | 链接属性，默认 `href` |
| `label` | 可选，渠道标签（如「官网」「微博」），会显示在通知中 |

若竞品有 **RSS** 或 **公众号转 RSS**，在 channels 中新增一项，设置 `type: "rss"` 和 `feed_url`。

## 通知消息格式

钉钉消息示例：

```
【竞品动态】仙库

📌 总结：仙库 3D 体测接入 DeepSeek AI，推出个性化健康管理能力升级...

🔗 原文：https://www.xianku.com/newsinfo/8091771.html
```

## 故障排查

- **钉钉收不到**：检查 Webhook、加签/关键词是否配置正确
- **采集不到新内容**：竞品页面结构可能变化，需更新 `list_selector`
- **AI 总结失败**：检查 LLM API Key 与 base_url

## 相关文件

- 脚本与配置：`scripts/monitor.py`、`scripts/config.example.json`
- 部署说明：`reference.md`
