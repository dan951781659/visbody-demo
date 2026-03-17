# -*- coding: utf-8 -*-
"""
视频语音提取与中文翻译脚本
从视频文件中提取语音，转写为文字，并翻译成中文
"""
import os
import sys

# 视频文件路径
VIDEO_PATHS = [
    r"c:\Users\95178\Desktop\林美惠分享的视频.mp4",
    r"c:\Users\95178\Desktop\林美惠分享的视频 -s20.mp4",
]

# 输出目录
OUTPUT_DIR = r"c:\Users\95178\Desktop\cursor\PMokr"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "视频语音转写与翻译结果.md")


def check_dependencies():
    """检查并导入依赖"""
    missing = []
    try:
        import whisper
    except ImportError:
        missing.append("openai-whisper")
    try:
        from deep_translator import GoogleTranslator
    except ImportError:
        missing.append("deep-translator")
    
    if missing:
        print(f"请先安装依赖: pip install {' '.join(missing)}")
        print("注意: Whisper 需要 ffmpeg，请确保已安装 ffmpeg 并添加到系统 PATH")
        return False, None, None
    
    return True, __import__("whisper"), __import__("deep_translator").GoogleTranslator


def is_chinese(text):
    """粗略判断文本是否主要为中文"""
    if not text or not text.strip():
        return False
    chinese_chars = sum(1 for c in text if '\u4e00' <= c <= '\u9fff')
    return chinese_chars / max(len(text.strip()), 1) > 0.3


def translate_to_chinese(text, translator_class, max_chunk=4500):
    """将文本翻译成中文（长文本分段翻译）"""
    if not text or not text.strip():
        return ""
    if is_chinese(text):
        return text  # 已是中文则直接返回
    try:
        translator = translator_class(source='auto', target='zh-CN')
        if len(text) <= max_chunk:
            result = translator.translate(text)
            return result or text
        # 长文本按段落分段
        parts = []
        for para in text.split("\n\n"):
            if len(para) <= max_chunk:
                parts.append(translator.translate(para) if para.strip() else para)
            else:
                for sent in para.replace(". ", ".\n").split("\n"):
                    if sent.strip():
                        parts.append(translator.translate(sent[:max_chunk]))
        return "\n\n".join(parts) if parts else text
    except Exception as e:
        print(f"  翻译失败: {e}")
        return text


def process_video(video_path, model, translator_class):
    """处理单个视频：提取语音、转写、翻译"""
    if not os.path.exists(video_path):
        return None, f"文件不存在: {video_path}"
    
    print(f"\n正在处理: {os.path.basename(video_path)}")
    print("  - 加载模型并转写语音...")
    
    try:
        # Whisper 转写（会自动检测语言）
        result = model.transcribe(video_path, language=None, task="transcribe")
        original_text = result["text"].strip()
        
        if not original_text:
            return {"original": "", "chinese": "", "language": "unknown"}, None
        
        detected_lang = result.get("language", "unknown")
        print(f"  - 检测到语言: {detected_lang}")
        print(f"  - 原文长度: {len(original_text)} 字符")
        
        # 翻译成中文（如非中文）
        if is_chinese(original_text):
            chinese_text = original_text
            print("  - 原文已是中文，无需翻译")
        else:
            print("  - 正在翻译成中文...")
            chinese_text = translate_to_chinese(original_text, translator_class)
        
        return {
            "original": original_text,
            "chinese": chinese_text,
            "language": detected_lang,
        }, None
    except Exception as e:
        return None, str(e)


def main():
    print("=" * 60)
    print("视频语音提取与中文翻译")
    print("=" * 60)
    
    ok, whisper_mod, GoogleTranslator = check_dependencies()
    if not ok:
        sys.exit(1)
    
    print("\n加载 Whisper 模型（首次运行会下载，请耐心等待）...")
    model = whisper_mod.load_model("base")  # base/medium/large 可选，base 较快
    
    results = []
    for path in VIDEO_PATHS:
        data, err = process_video(path, model, GoogleTranslator)
        if err:
            print(f"  错误: {err}")
            results.append({"file": path, "error": err})
        else:
            results.append({"file": path, "data": data})
    
    # 写入结果文件
    print(f"\n正在写入结果到: {OUTPUT_FILE}")
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("# 视频语音转写与翻译结果\n\n")
        for i, r in enumerate(results, 1):
            f.write(f"## 视频 {i}: {os.path.basename(r['file'])}\n\n")
            if "error" in r:
                f.write(f"**处理失败**: {r['error']}\n\n")
                continue
            d = r["data"]
            f.write(f"**检测语言**: {d['language']}\n\n")
            f.write("### 原文\n\n")
            f.write(d["original"] + "\n\n")
            f.write("### 中文翻译\n\n")
            f.write(d["chinese"] + "\n\n")
            f.write("---\n\n")
    
    print("完成！")
    print(f"结果已保存至: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
