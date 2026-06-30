# 2026-06-25 VAPro7 UI 改造记录

## 参考规范来源

- 蓝湖导出代码：`/Users/kean/Downloads/LanhuProject/`
- 仅提取 UI 规范，不提取其中静态业务结构

## 本轮改造范围

- 快速测量链路
  - `home.html`
  - `standard-user-prep.html`
  - `standard-bodycomp-prep.html`
  - `standard-grip-prep.html`
  - `standard-position.html`
  - `standard-countdown.html`
  - `standard-measuring.html`
  - `standard-next-step.html`
- 专业模式中的体成分测量链路
  - `pro-user-prep.html`
  - `pro-prepare.html`
  - `pro-countdown.html`
  - `pro-measuring.html`
  - `pro-result.html` 及其统一完成页落点

## 未触碰范围

- `shared.js` 内的业务逻辑与状态驱动
- 现有 query 参数行为
- 历史版本目录：`vapro7-demo/versions/`
- 现有 `version.json` 版本语义
- 已有新增业务流程、模式分支、结果联动

## 主要改动文件

- `vapro7-demo/shared.css`
- `device-library/devices/vapro7/demo/shared.css`
- `device-library/devices/vapro7/ui-style-spec.md`
- `device-library/devices/vapro7/ui-interaction.md`
- `device-library/devices/vapro7/open-questions.md`

## 回滚方式

- 如需回滚本轮 UI 改造，优先恢复上面列出的改动文件
- 不需要恢复 `versions/` 目录内容，因为本轮未覆盖历史版本
- 若只回滚视觉层，避免同时回退 `shared.js`，以免影响现有业务流程
