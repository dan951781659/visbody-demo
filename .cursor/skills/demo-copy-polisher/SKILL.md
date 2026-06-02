---
name: demo-copy-polisher
description: Polish and adapt text, labels, and messaging inside demos or prototypes. Use when the user wants to improve Chinese UX copy for buttons, placeholders, tooltips, and on-page descriptions in HTML or design specs.
---

# Demo Copy Polisher

## Instructions

当用户希望「优化 Demo / 原型里的文案、按钮名称、说明文字」时，按照下面步骤执行：

1. **识别上下文与受众**  
   - 判断这是面向：内部同事、最终用户、管理层汇报，还是评审会演示。  
   - 根据受众调整语气：  
     - 对最终用户：简洁、直接、友好，避免专业术语。  
     - 对内部 / 管理层：适度保留产品/业务术语，突出价值与状态。

2. **优化界面文案**  
   - 重点关注：按钮、表单占位符、字段标签、气泡提示、错误提示、空状态文案等。  
   - 避免含糊或技术化表述，如「提交」、「执行」等，尽量改为「提交需求」、「保存设置」等具体动作。  
   - 错误提示要包含：发生了什么 + 用户可以做什么。

3. **保持与 PRD 概念一致**  
   - 若对接 `prd-writer` / `prd-refiner` / `html-demo-generator` 生成的内容，确保名词、状态名称在文档和界面上一致。  
   - 避免同一概念多种叫法（例如：OKR/目标/任务混用）。

4. **格式化输出方式**  
   - 当用户给出 HTML 代码片段：  
     - 直接在代码中替换文本内容，保持原有结构与 class/id 不变。  
   - 当用户仅给出文案列表：  
     - 输出表格或列表形式：「原文 → 建议文案 → 说明（可选）」。

5. **为演示场景做轻度包装**  
   - 如果 Demo 主要用于向别人介绍产品，可以适当增加：  
     - 页面顶部的简短说明句（1–2 句，说明这是一个什么工具，能解决什么问题）。  
     - 关键操作附近的简短提示，帮助第一次使用的人快速理解流程。

## Examples

- 示例 1：优化 HTML 按钮与提示语  
  - 输入：带有一组按钮和表单字段的 HTML 片段，文案较为生硬或技术化。  
  - 行为：在保持标签结构不变的情况下，直接修改中文文本，使其更符合产品体验。

- 示例 2：演示稿用文案打磨  
  - 输入：一份功能清单或 Demo 页面的文字说明草稿。  
  - 行为：输出适合在评审会或路演中口头讲解的版本，并给出可以直接放在页面顶部或侧边的简介文案。
