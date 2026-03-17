#!/usr/bin/env python3
"""
竞品信息监控脚本
- 采集竞品新发布内容
- 调用 LLM 生成总结
- 推送至钉钉群
"""

import json
import time
import hmac
import hashlib
import base64
import urllib.parse
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# 脚本所在目录
SCRIPT_DIR = Path(__file__).resolve().parent
CONFIG_PATH = SCRIPT_DIR / "config.json"
STATE_PATH = SCRIPT_DIR / "state.json"


def load_config():
    """加载配置"""
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(
            f"请复制 config.example.json 为 config.json 并填写配置。路径: {CONFIG_PATH}"
        )
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def load_state():
    """加载已处理记录"""
    if not STATE_PATH.exists():
        return {}
    with open(STATE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def save_state(state):
    """保存已处理记录"""
    with open(STATE_PATH, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)


def fetch_page(url, timeout=15):
    """获取网页内容"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    r = requests.get(url, headers=headers, timeout=timeout)
    r.raise_for_status()
    r.encoding = r.apparent_encoding or "utf-8"
    return r.text


def _should_skip_url(url, channel):
    """过滤易 404 或无实质内容的链接（导航、备案等）"""
    skip_patterns = channel.get("exclude_patterns", [
        "/contact", "/about", "beian.miit.gov.cn", "/login", "/register", "/#"
    ])
    url_lower = url.lower()
    for p in skip_patterns:
        if p in url_lower:
            return True
    return False


def scrape_links(competitor):
    """从网页爬取文章链接"""
    url = competitor["url"]
    html = fetch_page(url)
    soup = BeautifulSoup(html, "html.parser")

    selector = competitor.get("list_selector", "a[href]")
    link_attr = competitor.get("link_attr", "href")

    links = []
    for a in soup.select(selector):
        href = a.get(link_attr) or a.get("href")
        if not href or href.startswith("#") or href.startswith("javascript:"):
            continue
        full_url = urllib.parse.urljoin(url, href)
        if _should_skip_url(full_url, competitor):
            continue
        title = (a.get_text(strip=True) or "").strip()[:100]
        if full_url not in [x["url"] for x in links]:
            links.append({"url": full_url, "title": title or full_url})
    return links[:20]  # 限制数量


def fetch_rss(competitor):
    """从 RSS 获取文章"""
    try:
        import feedparser
    except ImportError:
        raise ImportError("RSS 支持需要安装 feedparser: pip install feedparser")

    url = competitor.get("feed_url") or competitor["url"]
    feed = feedparser.parse(url)
    links = []
    for e in feed.entries[:20]:
        link = e.get("link", "")
        title = (e.get("title") or "").strip()[:100]
        if link:
            links.append({"url": link, "title": title or link})
    return links


def fetch_article_content(url):
    """获取文章正文（简化版：取主要文本）"""
    try:
        html = fetch_page(url)
        soup = BeautifulSoup(html, "html.parser")
        for tag in ["article", ".content", ".article-content", ".news-detail", "main"]:
            el = soup.select_one(tag)
            if el:
                text = el.get_text(separator="\n", strip=True)
                if len(text) > 200:
                    return text[:3000]  # 限制长度
        return soup.get_text(separator="\n", strip=True)[:3000]
    except Exception:
        return ""


def summarize_with_llm(content, competitor_name, url, config):
    """调用 LLM 生成总结"""
    llm = config.get("llm", {})
    provider = llm.get("provider", "openai")
    api_key = llm.get("api_key", "")
    base_url = llm.get("base_url", "https://api.openai.com/v1").rstrip("/")

    if not api_key:
        return f"【{competitor_name}】新内容：{content[:200]}..." if len(content) > 200 else content

    prompt = f"""请用 1-3 句话总结以下竞品「{competitor_name}」发布的内容，突出关键信息。保持客观、简洁。

原文摘要：
{content[:2500]}

请直接输出总结，不要加引号或前缀。"""

    try:
        headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
        payload = {
            "model": llm.get("model", "gpt-4o-mini"),
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 300,
        }
        r = requests.post(
            f"{base_url}/chat/completions",
            headers=headers,
            json=payload,
            timeout=30,
        )
        r.raise_for_status()
        data = r.json()
        summary = data["choices"][0]["message"]["content"].strip()
        return summary
    except Exception as e:
        return f"（总结生成失败: {e}）\n原文摘要：{content[:300]}..."


def send_dingtalk(message, config):
    """发送钉钉消息"""
    ding = config.get("dingtalk", {})
    webhook = ding.get("webhook", "")
    secret = ding.get("secret", "")

    if not webhook:
        print("未配置钉钉 webhook，跳过发送")
        return

    url = webhook
    if secret:
        ts = str(round(time.time() * 1000))
        secret_enc = secret.encode("utf-8")
        string_to_sign = f"{ts}\n{secret}"
        sign = urllib.parse.quote_plus(
            base64.b64encode(
                hmac.new(secret_enc, string_to_sign.encode("utf-8"), hashlib.sha256).digest()
            )
        )
        sep = "&" if "?" in url else "?"
        url = f"{url}{sep}timestamp={ts}&sign={sign}"

    payload = {
        "msgtype": "markdown",
        "markdown": {
            "title": "竞品动态",
            "text": message,
        },
    }
    r = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=10)
    r.raise_for_status()
    res = r.json()
    if res.get("errcode") != 0:
        raise RuntimeError(f"钉钉返回错误: {res}")


def _normalize_competitors(config):
    """将旧格式（单 url）转为新格式（channels 数组）"""
    result = []
    for comp in config.get("competitors", []):
        name = comp.get("name", "未知")
        channels = comp.get("channels", [])
        if not channels and (comp.get("url") or comp.get("feed_url")):
            # 兼容旧格式：单 url/feed_url 视为一个 channel
            ch = {"type": comp.get("type", "scrape")}
            if comp.get("feed_url"):
                ch["feed_url"] = comp["feed_url"]
            else:
                ch["url"] = comp["url"]
                ch["list_selector"] = comp.get("list_selector", "a[href]")
                ch["link_attr"] = comp.get("link_attr", "href")
            channels = [ch]
        if channels:
            result.append({"name": name, "channels": channels})
    return result


def main():
    config = load_config()
    state = load_state()
    competitors = _normalize_competitors(config)

    for comp in competitors:
        name = comp.get("name", "未知")
        for ch in comp.get("channels", []):
            channel_url = ch.get("url") or ch.get("feed_url", "")
            key = f"{name}_{channel_url}"
            ctype = ch.get("type", "scrape")

            try:
                if ctype == "rss":
                    items = fetch_rss(ch)
                else:
                    items = scrape_links(ch)
            except Exception as e:
                print(f"[{name}] {channel_url} 采集失败: {e}")
                continue

            seen = set(state.get(key, []))

            for item in items:
                url = item["url"]
                if url in seen:
                    continue

                content = fetch_article_content(url)
                if not content or len(content) < 50:
                    content = item.get("title", url)

                summary = summarize_with_llm(content, name, url, config)
                channel_label = ch.get("label", "")
                source_tag = f"（{channel_label}）" if channel_label else ""

                msg = f"""## 【竞品分析】{name}{source_tag}

**📌 总结：** {summary}

**🔗 原文：** [{url}]({url})
"""
                try:
                    send_dingtalk(msg, config)
                    seen.add(url)
                    print(f"[{name}] 已推送: {url}")
                except Exception as e:
                    print(f"[{name}] 推送失败: {e}")

                time.sleep(1)  # 避免频率限制

            state[key] = list(seen)[-100:]  # 保留最近 100 条

    save_state(state)
    print("监控完成")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        config = load_config()
        webhook = config.get("dingtalk", {}).get("webhook", "")
        if not webhook:
            print("请在 config.json 的 dingtalk.webhook 中填入钉钉机器人地址")
            sys.exit(1)
        msg = "## 【竞品分析】测试\n\n**📌 总结：** 钉钉推送配置成功。\n\n**🔗 原文：** [测试链接](https://example.com)"
        send_dingtalk(msg, config)
        print("✓ 测试消息已发送，请检查钉钉群")
    else:
        main()
