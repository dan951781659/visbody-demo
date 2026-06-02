# VAPro7 Demo 变更记录

## v1.3.1（测量体验与下一项推荐）

- **测量中**：转台音效增强（低频电机底噪 + 周期性短脉冲）；底部仅在转满一圈后可点，点击后直接跳转下一步（无二次倒计时）；焦点文案不再重复「请点击下方」。
- **倒计时**：3 / 2 / 1 数字语音播报；`setupVoice` 跳过带 `[data-demo-countdown-target]` 的页面，避免与倒计时语音重叠。
- **测量准备**：阶段一增加脱鞋脱袜与脚印提示区；顶部状态条仅保留单 chip。
- **运营设置**：「当前循环顺序」预览移至测量顺序卡片底部；移除「完整测量后显示体态/单项」两项；新增「语音播报」开关。
- **完成与下一项**：`getNextMeasurementRecommendation` 仅向后线性扫描、不回绕；体态/单项入口显隐仅依赖模式总开关；`standard-result` / `standard-next-step` 收敛为报告 + 单一「下一项」+ 完成；报告详情次要按钮为「重新测量」并回首页。
- **快照**：[`versions/v1.3.1/`](versions/v1.3.1/)

---

## v1.3.0（报告链路 + 顺序配置 + 流程/UI 增强）

- **版本展示**：[`version.json`](version.json) + 页面 `[data-demo-version]`；发版时递增 `version` 并复制快照到 `versions/v1.3.0/`。
- **报告**：新建 [`report-detail.html`](report-detail.html)；`openReport()` 默认跳转站内报告页；运营设置可配置外链；修复原绝对路径 404。
- **测量顺序**：`measurementOrderKeys` 数组 + 设置页 HTML5 拖拽排序。
- **生成页**：[`standard-generating.html`](standard-generating.html) 仅模型进度，完成后自动进报告详情。
- **测量准备**：场景化两阶段示意（上台 / 扶手），精简重复文案。
- **测量中**：42s 转台动效 + 可选音效 + 尾声提示；仅底部点击启动倒计时后进完成页。
- **完成页**：摘要「项目名 + ✓」；去掉打印/完成按钮；默认无自动倒计时跳转。

---

## v1.2.0-post-full-optimize（完整优化后快照）

- **日期**：测量准备两阶段 + 全局点击跳转 + UI 升级完成后。
- **说明**：`setupGuideSequence` 改为两阶段状态机（无 1.8s 循环）；`standard-position.html` 阶段条与门禁按钮；`autoAdvanceToNextMeasurement` 默认关闭；`setupStageAdvance` 默认点击跳转；首页移除方案预览卡；评审入口去重；`shared.css` 阶段条与视觉令牌升级。
- **快照路径**：[`versions/v1.2.0-post-full-optimize/`](versions/v1.2.0-post-full-optimize/)
- **包含文件**：`shared.js`、`shared.css`、`standard-position.html`、`home.html`、`index.html`、`standard-measuring.html`、`standard-generating.html`、`pro-prepare.html`、`CHANGELOG.md`

---

## v1.2.0-pre-full-optimize（优化前快照）

- **日期**：完整优化实施前备份。
- **说明**：两阶段测量准备与全局手动跳转改动前的状态。
- **快照路径**：[`versions/v1.2.0-pre-full-optimize/`](versions/v1.2.0-pre-full-optimize/)

---

## 回滚说明

将 `versions/<版本号>/` 下对应文件复制回 [`demo/`](.) 根目录即可恢复该快照。若同时修改了 [`一圈出结果-单项补测-三模式方案.md`](../一圈出结果-单项补测-三模式方案.md)，需单独从 Git 或备份恢复。

---

## v1.1.0-post-merge（合并后快照）

- **日期**：测量完成页主流程合并完成后。
- **说明**：方案三布局 + 方案二文案并入 `standard-next-step.html`；方案一保留为 `结果方案二.html`；`结果方案三.html` 改为跳转；导航与 `CHANGELOG` 已更新。
- **快照路径**：[`versions/v1.1.0-post-merge/`](versions/v1.1.0-post-merge/)
- **包含文件**：`standard-next-step.html`、`结果方案二.html`、`结果方案三.html`、`shared.css`、`index.html`、`home.html`、`CHANGELOG.md`（快照时刻版本）

---

## v1.0.0-pre-merge（基线快照）

- **日期**：整合前备份。
- **说明**：合并「方案三布局入主流程 + 方案二文案」之前的文件状态。
- **快照路径**：[`versions/v1.0.0-pre-merge/`](versions/v1.0.0-pre-merge/)
- **包含文件**：`standard-next-step.html`、`结果方案二.html`、`结果方案三.html`、`shared.css`、`index.html`、`home.html`
