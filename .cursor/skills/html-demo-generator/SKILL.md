---
name: html-demo-generator
description: Generate local HTML demos from PRDs and run them on a local static server with a localhost link. Use when the user wants a web demo or prototype and will decide later when to push it to GitHub (via the separate push-github skill).
---

# HTML Demo Generator

## Instructions

当用户希望「基于某个需求 / PRD 生成可演示的 HTML Demo」时，按下面规则执行。**本 Skill 只负责本地生成 + 本地预览，不再强制推送到 GitHub。远程部署统一交给独立的 `push-github` Skill。**

### 必做流程（缺一不可）
1. **生成**：在工作区写出 Demo 文件（如 `index.html` 或指定文件名），路径遵循「槽位 / 子目录」规范（见 2.1）。  
2. **本地静态服务**：在 Demo 所在目录（通常为 `visbody-demo/` 或其子目录）启动一个本地静态服务器（例如：`python3 -m http.server 4173` 或 `npx serve -l 4173`），并在回复中给出本地访问链接 `http://localhost:4173/...`。  
   - 若 Demo 在子目录（如 `visbody-demo/report-export/index.html`），本地链接示例：`http://localhost:4173/report-export/`。  
   - 服务启动后，不要立刻杀进程，让用户可以在浏览器中多轮调试。  
3. **输出本地调试信息**：在回复中简要说明：  
   - 本地预览地址（含完整路径）；  
   - 当前 Demo 所在的相对路径（便于之后由 `push-github` Skill 精确推送）；  
   - 如已存在同路径 Demo，被覆盖更新的说明（方便用户知道自己更新了哪一个槽位）。

> 说明：当用户明确表示「现在就需要线上可分享链接」时，**不要在本 Skill 里直接推 GitHub**，而是建议随后调用 `push-github` Skill，对当前仓库执行远程推送并生成 GitHub Pages 链接。

---

### 生成规范

1. **目标与范围**  
   - 目标：产出一个可直接运行的前端 Demo，适合部署到 GitHub Pages，用于演示核心流程与界面结构。  
   - 范围：突出核心用户流程和关键界面，不追求完整真实后端，仅用前端假数据或本地状态模拟。

2. **技术栈与文件组织**  
   - 默认使用：原生 `HTML + CSS + JavaScript`，不依赖构建工具。  
   - 尽量使用单个 `index.html` 文件（如果需要图片、图标，可用在线链接或简单 SVG）。  
   - 如确有必要使用框架（React/Vue），必须通过 CDN 方式引入，并确保仍然是单页可部署的静态文件。

2.1 **路径与覆盖规则（避免同内容多地址 / 覆盖历史）**  
   - **同一「槽位」、同一路径**：若本次 Demo 对应的是已有路径（例如用户说「更新报告导出」或 PRD 明确是报告导出），则**必须**把生成的文件写到该路径并覆盖原文件，这样始终只有一个分享地址。  
     - 约定槽位与路径对应关系示例：报告导出 → `report-export/index.html`，分享链接固定为 `https://dan951781659.github.io/visbody-demo/report-export/`。  
   - **新 Demo、新路径**：若本次是全新主题（与已有 report-export、body-report、header-collapse 等均不同），则**必须**使用新路径（新建目录或新文件名，例如 `新名称/index.html` 或 `新名称.html`），不得覆盖根目录或其他已有 Demo 的文件，避免历史资料被覆盖。  
   - 根目录 `index.html` 保留为**入口页**（列出各 Demo 的链接），具体 Demo 内容放在子路径下（如 `report-export/`、`body-report.html` 等）。

3. **页面设计基本要求**  
   - 样式：简洁现代，尽量使用浅色背景、清晰层级（头部导航 / 主区域 / 侧栏或弹窗）。  
   - 布局：移动端和桌面端都可用，推荐使用弹性布局（flex）和最大宽度限制。  
   - 文案：使用和 PRD 一致的中文文案，按钮和提示语要清晰表达动作目的。

4. **交互与数据**  
   - 使用前端本地状态（如简单对象、数组）或浏览器内存变量来模拟数据操作。  
   - 实现与需求最相关的 1–3 条核心操作流程，例如：创建/编辑/删除、筛选、状态切换等。  
   - 必要时加入提示区（如右侧或底部）展示「当前选中项详情」或「操作反馈」。

5. **代码质量与可读性**  
   - 使用清晰的函数名和模块化结构（即便在一个文件中，也用注释分块：结构 / 样式 / 脚本）。  
   - 避免复杂工程化，优先简单直接的实现。  
   - 在脚本中适度添加对产品含义有帮助的注释（仅解释业务语义，不要解释语法本身）。

6. **与 GitHub Pages 兼容**  
   - 不使用需要服务器端支持的特性（如本地 Node API、后端模板渲染）。  
   - 所有资源路径尽量相对或使用绝对 URL，以避免在 `https://username.github.io/repo/` 下路径错误。  
   - 虽然本 Skill 只负责本地运行，但代码仍要保持与 GitHub Pages 兼容，以便后续 `push-github` 直接复用。

## Examples

- 示例 1：从 PRD 生成 OKR 管理 Demo  
  - 输入：一份描述 OKR 创建、列表展示、进度更新的 PRD。  
  - 行为：生成一个带顶部导航、左侧 OKR 列表、右侧详情与编辑区域的单页应用，支持：  
    - 新建目标与关键结果（存储在内存数组中）  
    - 切换查看不同 OKR 的详情  
    - 通过下拉或滑动条更新进度

- 示例 2：简单表单流程 Demo  
  - 输入：用户希望演示「提交需求工单」的流程。  
  - 行为：生成带多步表单的页面，通过 JS 管理当前步骤与校验结果，并在提交后展示「工单预览」或「提交成功」提示。
