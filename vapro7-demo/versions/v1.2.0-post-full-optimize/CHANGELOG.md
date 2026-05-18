# VAPro7 Demo 变更记录

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
