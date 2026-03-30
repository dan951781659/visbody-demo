#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
匈牙利语翻译压缩脚本

对「变长」且超出 UI 场景字符上限的条目，调用 LLM API 生成精简后的匈牙利语译文，
保持语法准确性的同时缩短文案长度，最终输出供研发直接替换的新 CSV。

用法：
  pip install openai
  export OPENAI_API_KEY=sk-...
  python scripts/i18n-compress-translation.py [输入CSV] [输出CSV]

  # 仅预览（不调用 API，不消耗费用）：
  python scripts/i18n-compress-translation.py [输入CSV] --dry-run

环境变量：
  OPENAI_API_KEY     必填
  OPENAI_BASE_URL    选填（兼容 Azure / 本地 OpenAI 协议接口，如 LM Studio）
  OPENAI_MODEL       选填，默认 gpt-4o
  OPENAI_RPM         选填，每分钟请求数上限，默认 60
"""

import csv
import os
import sys
import time
from pathlib import Path


# =========================================================
# 场景分类规则
# =========================================================
# 规则按优先级从高到低匹配，返回 (类别名, 字符上限)
# 字符上限基于 PC 端后台常见 UI 约束制定
def classify(key: str) -> tuple[str, int]:
    k = key.lower()
    segs = k.split(".")
    last = segs[-1] if segs else k

    # --- 按钮 ---
    # key 末段或中间段包含 btn/button
    if last in ("btn", "button") or any(s in ("btn", "button") for s in segs):
        return "按钮", 15

    # --- 标题 / 标签 ---
    if last in ("title", "label", "header", "name"):
        return "标题/标签", 25

    # --- 占位提示（placeholder）---
    if "placeholder" in k:
        return "占位提示", 45

    # --- 错误 / 校验消息 ---
    if "error" in k or last == "err" or k.endswith("err"):
        return "错误消息", 65

    # --- 简短提示（tip / tips / tips1 ...）---
    # last 以 tip 开头，或 key 末段去掉数字后为 tip/tips
    stripped = last.rstrip("0123456789")
    if stripped in ("tip", "tips") or last == "tip":
        return "提示", 80

    # --- 字段描述（desc）---
    if last in ("desc", "description"):
        return "描述", 120

    # --- 其余长文本（弹窗正文、警告说明、帮助文案等）---
    return "说明文本", 200


# =========================================================
# LLM 压缩
# =========================================================
_SYSTEM = """\
你是一名资深软件产品本地化专家，专注于【匈牙利语】本地化，
译文直接用于正式上线的 Web 产品后台页面。

翻译规范：
1. 专业准确：严格遵循软件行业术语规范，功能含义无歧义。
2. 简洁专业：使用匈牙利语母语用户习惯的简练表达，删除冗余修饰词。
3. 风格统一：同一功能概念使用同一译法，风格保持正式、简洁。
4. 输出格式：只输出译文本身，不加引号、括号、解释或任何前缀。"""


def _prompt(key: str, old_hu: str, new_hu: str,
            category: str, max_len: int, is_retry: bool) -> str:
    retry_note = (
        f"\n\n【重要】上次输出仍超过 {max_len} 字符，请进一步精简，"
        f"必须严格在 {max_len} 字符内。"
        if is_retry else ""
    )
    return f"""\
任务：将以下匈牙利语 UI 文案精简至 **{max_len} 字符以内**。

- UI 场景：{category}（字符上限 {max_len}）
- i18n Key：{key}
- 旧版译文（语法存在问题，但长度符合要求，{len(old_hu)} 字符）：
  {old_hu}
- 新版译文（语法正确但过长，{len(new_hu)} 字符）：
  {new_hu}

要求：
1. 以新版译文为基准，保留其准确含义和正确语法。
2. 不超过 {max_len} 字符。
3. 符合匈牙利语母语用户的自然表达习惯。
4. 只输出译文，不要解释。{retry_note}"""


def compress_one(client, key: str, old_hu: str, new_hu: str,
                 category: str, max_len: int, model: str) -> tuple[str, bool]:
    """
    返回 (压缩后译文, 是否在字符上限内)。
    最多重试一次以确保长度合规。
    """
    for is_retry in (False, True):
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": _SYSTEM},
                {"role": "user", "content": _prompt(key, old_hu, new_hu, category, max_len, is_retry)},
            ],
            max_tokens=400,
            temperature=0.1,
        )
        text = resp.choices[0].message.content.strip().strip('"\'')
        if len(text) <= max_len:
            return text, True
    return text, False


# =========================================================
# 主流程
# =========================================================
def main() -> None:
    # ---------- 参数 ----------
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    flags = [a for a in sys.argv[1:] if a.startswith("-")]
    dry_run = "--dry-run" in flags or "-n" in flags

    csv_in = Path(args[0]) if args else Path.home() / "Desktop" / "工作簿1.csv"
    csv_out = (
        Path(args[1]) if len(args) > 1
        else csv_in.parent / "翻译压缩稿.csv"
    )

    if not csv_in.exists():
        sys.exit(f"[错误] 输入文件不存在: {csv_in}")

    if not dry_run:
        api_key = os.environ.get("OPENAI_API_KEY", "")
        if not api_key:
            sys.exit("[错误] 请设置环境变量 OPENAI_API_KEY")
        base_url = os.environ.get("OPENAI_BASE_URL") or None
        model = os.environ.get("OPENAI_MODEL", "gpt-4o")
        rpm = int(os.environ.get("OPENAI_RPM", "60"))
        delay = 60.0 / rpm

        try:
            from openai import OpenAI
        except ImportError:
            sys.exit("[错误] 缺少依赖，请执行：pip install openai")

        client = OpenAI(api_key=api_key, **({"base_url": base_url} if base_url else {}))
    else:
        model = os.environ.get("OPENAI_MODEL", "gpt-4o")
        client = None
        delay = 0.0

    # ---------- 读取 CSV ----------
    with open(csv_in, "r", encoding="utf-8") as f:
        rows = list(csv.reader(f))

    data = []
    for r in rows[1:]:
        if len(r) < 3:
            continue
        key    = r[0].strip()
        old_hu = r[1].strip()
        new_hu = r[2].strip()
        status = r[3].strip() if len(r) > 3 else ""

        cat, max_len = classify(key)
        cur_len = len(new_hu)
        # 只压缩「变长」且超过场景字符上限的条目
        needs = (status == "变长") and bool(new_hu) and cur_len > max_len

        data.append(dict(
            key=key, old_hu=old_hu, new_hu=new_hu, status=status,
            cat=cat, max_len=max_len, cur_len=cur_len, needs=needs,
            result="", within_limit=True,
        ))

    total_need = sum(1 for d in data if d["needs"])

    # ---------- 预览统计 ----------
    print(f"输入文件 : {csv_in}")
    print(f"总条目   : {len(data)}")
    print(f"变长条目 : {sum(1 for d in data if d['status'] == '变长')}")
    print(f"需压缩   : {total_need}（变长 且 超出场景字符上限）")
    if not dry_run:
        print(f"使用模型 : {model}")
        print(f"预计消耗 : 约 {total_need} 次 API 请求\n")
    else:
        print("\n[DRY-RUN 模式] 以下为需压缩的条目预览：\n")
        print(f"{'Key':55} {'类型':10} {'限制':5} {'当前':5} {'超出':5}")
        print("-" * 85)
        for d in data:
            if d["needs"]:
                over = d["cur_len"] - d["max_len"]
                print(f"{d['key'][:55]:55} {d['cat']:10} {d['max_len']:5} {d['cur_len']:5} +{over:<4}")
        print(f"\n共 {total_need} 条需压缩。")
        return

    # ---------- 压缩 ----------
    done = 0
    over_limit_count = 0

    for item in data:
        if not item["needs"]:
            item["result"] = item["new_hu"]
            continue

        done += 1
        label = f"[{done}/{total_need}]"
        print(f"{label:10} {item['key'][:52]:52} {item['cur_len']:3}→{item['max_len']:3}", end="  ", flush=True)

        try:
            compressed, ok = compress_one(
                client, item["key"], item["old_hu"], item["new_hu"],
                item["cat"], item["max_len"], model,
            )
            item["result"] = compressed
            item["within_limit"] = ok
            flag = "OK" if ok else "OVER!"
            if not ok:
                over_limit_count += 1
            print(f"{flag} ({len(compressed)}字符) {compressed[:45]}")
        except Exception as e:
            item["result"] = item["new_hu"]  # fallback: 保留新译文
            item["within_limit"] = False
            over_limit_count += 1
            print(f"ERROR: {e}", file=sys.stderr)

        if delay:
            time.sleep(delay)

    # ---------- 写出 CSV ----------
    out_headers = [
        "key",
        "旧译文(B列)",
        "新译文(C列)",
        "变长状态",
        "场景类型",
        "字符上限",
        "当前字符数",
        "需压缩(Y/N)",
        "是否达标(Y/N)",
        "压缩后译文[最终使用]",
    ]
    with open(csv_out, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(out_headers)
        for item in data:
            w.writerow([
                item["key"],
                item["old_hu"],
                item["new_hu"],
                item["status"],
                item["cat"],
                item["max_len"],
                item["cur_len"],
                "Y" if item["needs"] else "N",
                "Y" if item["within_limit"] else "N",
                item["result"],
            ])

    print(f"\n完成。")
    print(f"输出文件 : {csv_out}")
    print(f"压缩成功 : {done - over_limit_count} 条")
    if over_limit_count:
        print(f"仍超限   : {over_limit_count} 条（建议人工复核，搜索「是否达标」列为 N 的行）")


if __name__ == "__main__":
    main()
