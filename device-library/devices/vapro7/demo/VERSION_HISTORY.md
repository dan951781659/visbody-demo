# VAPro7 Demo 版本修改记录

按**时间倒序**记录本目录（`demo/`）及相关评审页面的**每一次功能性修改**摘要，便于追溯「改过什么、何时改的」。  
发行版级别的聚合说明仍以 [`CHANGELOG.md`](CHANGELOG.md) 与 [`version.json`](version.json) 为准。

---

## 维护约定

1. **每次改完合并前**：在本文件**最上方**新增一节（日期 + 可选版本号 + 要点列表）。  
2. **版本号**：若本次改了 `version.json`，在记录里写明 `vX.Y.Z`。  
3. **粒度**：写清「哪些页面 / `shared.js` / `shared.css` / 资源」动了，避免只写「修了 bug」。  
4. **与 CHANGELOG 分工**：本文件偏「流水账」；发版时可把多条记录收敛进 `CHANGELOG.md` 某一版本。

---

## 2026-05-16 · 文档与仓库

- 新增本文档 `VERSION_HISTORY.md`，约定后续每次修改都登记。
- 在工作区根目录执行 `git init`（若此前无仓库），便于后续版本管理。

---

## 2026-05-16 · v1.5.0（计划：设置收口 · 转台 10s · 单项与肩部六屏）

依据计划「肩部流程与转台_demo」落地：

- **`settings-modes.html`**：移除语音 / 音效 / 自动下一项三个开关；文案说明默认行为。
- **`shared.js`**：状态收口（剔除 `voiceEnabled`、`soundEffectsEnabled`、`autoAdvanceToNextMeasurement` 持久字段）；URL 参数不再携带 `voice`、`sound`、`autoNext`；语音与倒计时播报默认开启；**`setupFinishAutoAdvance`** 去掉「演示倒计时自动进入下一项」（保留方案 A/B **idle 默认下一项**）；**`setupMeasuringTurntable`** 重写为 10s、全程可打断、`audio` 循环 + WebAudio 回退、减弱动画下静音、`prefers-reduced-motion` 适配。
- **`standard-measuring.html`**：时长 10s、嵌入 `assets/turntable-loop.wav`、底部打断文案与样式调整。
- **`shared.css`**：转台 10s 动画、`measuring-footer-*`、`turntable-audio` 隐藏、肩部测量卡片与 `order-preview-line` 等。
- **`home.html` / `single-select.html`**：移除手势 `hint-panel`。
- **`standard-result.html`**：去掉完成页演示倒计时相关标记与角标。
- **单项完成页** `single-result-shoulder.html`、`single-result-balance.html`、`single-result-neck.html`：对齐 `standard-result` 结构（摘要 + 二维码 + 报告｜下一项｜完成）。
- **`pro-result.html`**：同上简化。
- **肩部六屏**：`single-prepare-shoulder.html` → 新建 `single-countdown-shoulder.html`、`single-measuring-shoulder-left.html`、`single-measuring-shoulder-right.html` → `single-result-shoulder.html`；右手页 `data-complete-group="singleShoulder"`。
- **资源**：新增 `assets/turntable-loop.wav`（短循环示意音频）。
- **`结果方案三.html`**：去掉过时「演示倒计时」按钮与交互，与当前完成页逻辑一致。
- **`version.json` / 页面徽标 / `DEMO_VERSION_FALLBACK`**：升至 **v1.5.0**；`CHANGELOG.md` 增加 v1.5.0 节。
- **`index.html`**：评审说明里补充肩部链路与运营设置描述。

---

## 2026-05-16 · v1.4.0（沟通迭代：测量完成页 A/B + 手势 Demo）

- **`standard-next-step.html`**：方案 A（取景区分左右 Demo、`L`/`R`、toast、去掉大手势岛、idle 默认下一项等）。
- **新建 `standard-next-step-touch.html`**：方案 B（触控主轴、小窗预览、脚注）。
- **`shared.js`**：`NEXT_RECOMMEND_DESC` 文案、`setupFinishAutoAdvance`（`withStateQuery`、idle 与自动倒计时互斥）、**`setupSchemeThreeGestureDemo`**。
- **`shared.css`**：手势引导区、模拟区、toast、idle 底部、`live-status` 层级等。
- **`index.html`**：测量完成 A/B 入口；**`standard-measuring.html`**：脚注链 B；**`home.html`**：`data-order-preview` 预设顺序行。

---

## 2026-05-16 · 版本号对齐 v1.4.0

- 仓库内无独立 `v1.4.0` 快照时，将 demo 根目录**展示版本**统一为 **1.4.0**（流程基线来自 `versions/v1.3.1/`）；新建 `versions/v1.4.0/` 快照目录。

---

## 2026-05-16 · 回滚尝试（自 v1.3.1 归档）

- 自 **`versions/v1.3.1/`** 覆盖恢复根目录 `shared.js`、`shared.css`、多页 HTML；**`home.html`** 曾用 `v1.2.0-post-full-optimize` 首页样式；删除实验性触控对照页（后又按沟通恢复 A/B）。

---

（更早发行说明见 [`CHANGELOG.md`](CHANGELOG.md) 中 v1.3.1 / v1.3.0 / 快照目录说明。）
