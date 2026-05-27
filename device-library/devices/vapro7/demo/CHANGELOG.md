# VAPro7 Demo 变更记录

## v1.6.0（综合测量流程重构 · 测量准备页 · 真实用户文案）

- **综合测量流程**：测量准备页 → 站姿识别 → 扶手接触 → 手臂 45° → 倒计时 → 测量 → 完成页（每步自动识别，底部保留跳步兜底）。
- **测量准备页开关**：`bodyCompositionPrepEnabled` 语义改为显示/跳过测量准备页。
- **注意事项轮播**：倒计时页与测量中页增加测量注意事项轮播提示。
- **文案清理**：移除方案 A/B、Demo 快捷键等评审化文案；完成页支持结束/继续/重测。
- **经典分体兼容**：保留主测量目录扩展（体态/体成分+体围/体围/平衡），平衡移出专项列表。

---

## v1.5.5（信息架构 · 倒计时姿势示意 · 体成分举手）

- **体成分四宫格**：看完引导后举右手进入扶手准备（`R` / Demo 模拟 / 弱链兜底）。
- **倒计时**：综合 / 体态 / 肩部三页增加保持姿势人偶示意，避免倒计时阶段动作走形。
- **首页**：体态测量为主标题，「专业测量」为小标签；快捷肩部嵌套在「单项测量」组内。
- **测量设置**：单项肩/颈/平衡收入「单项测量」二级分组。

---

## v1.5.4（设置分组 · 单项独立显隐 · 准备两步串联）

- **测量设置**：去掉与一级标题重复的小标签；同类配置分组展示；肩部 / 颈部 / 平衡可分别控制首页与顺序池。
- **综合测量流程（准备引导开启）**：体成分四宫格 → 扶手准备 → 倒计时 → 测量。
- **首页**：至少开启一项单项时才显示「单项测量」入口；快捷单项仅可选已开启项。

---

## v1.5.3（测量设置 · 体成分准备四宫格 · 综合/专业测量命名）

- **测量设置**：`settings-modes.html` 更名并重排；恢复 **语音播报**、新增 **体成分测量准备引导**（关则综合测量跳过四宫格，仅扶手准备）。
- **综合测量入口**：`getStandardFlowEntryHref` → `standard-bodycomp-prep.html` 或 `standard-position.html`；首页与「重新测量」经 **`data-standard-flow-entry`** 同步。
- **体成分准备页**：新建 `standard-bodycomp-prep.html`（2×2 宫格 + `grid-reference.png` 裁切背景）。
- **首页**：综合测量 / 专业测量 · 体态测量文案；`card-subtitle`；底部运营位贴底 + 示意图 `home-promo-schematic.png`。
- **命名**：完整测量 → **综合测量**（链路标签）；体态精测 → **专业测量** / **体态测量**；运营设置 → **测量设置**。

---

## v1.5.2（手势页 Demo 标注 · 完成页 scheme-three footer · 颈/平衡占位恢复 · 首页运营位）

- **手势页**：`standard-next-step` 缩短手势面板与语音文案；叠层分区标注「点击模拟」；取景芯片标注 Demo。
- **方案 B 触控页**：去掉对照说明类副标题，脚注收敛为一行。
- **完成页**：`standard-result`、`single-result-shoulder`、`pro-result` 底部改为 **`scheme-three-action-row` 双卡 + 「完成」弱链接**，与方案 A 决策区一致。
- **脚本**：`setupChoiceHighlight` 跳过带 **`data-finish-group`** 的容器，避免与 `setupFinishAutoAdvance` 争抢 `is-active`。
- **单项 / 运营**：恢复 **`singleNeck` / `singleBalance`**（`MEASUREMENT_ITEMS`、`NEXT_RECOMMEND_DESC`、顺序池、「首页快捷单项」颈/平衡）；新建 **`single-flow-placeholder.html`**；`single-select` 三项并列（颈/平衡占位卡 **`data-demo-placeholder`**）。
- **首页**：底部 **`home-promo-slot`** + **`assets/home-promo.png`**（客户可替换该静态资源）。
- **文案**：剔除多页解释性 **`screen-subtitle`**（保留测量指令 / `data-live-voice` 等例外）。
- **样式**：手势面板更紧凑；完成页内 footer 间距；运营位样式。

---

## v1.5.1（Demo 收口：肩部规范布局 · idle 点击后开始 · 体态倒计时 · 移除颈/平衡）

- **肩部采集**：`single-measuring-shoulder-left/right` 改为顶蓝框进度卡 + 黑底取景区（角度 / 弧线 / 对钩叠层）+ 底栏橙色要点说明卡（`shared.css` `.single-shoulder-*`）。
- **方案 A/B 完成页**：`data-idle-start="on-first-click"`，空闲倒计时在用户首次点击/按键后开始；idle 区样式分层。
- **手势页**：`standard-next-step` 使用单一 `scheme-three-gesture-panel`，精简副文案。
- **流程收口**：`shared.js` 测量顺序仅保留完整测量 / 体态精测 / 肩部；移除颈部、平衡页面文件与设置项；`single-select` 仅肩部。
- **体态精测**：新增 `pro-countdown.html`，`pro-prepare` → 倒计时 → `pro-measuring`。
- **结果页**：`single-result-shoulder` 与 `standard-result` footer 结构对齐。

---

## v1.5.0（设置收口 · 转台 10s · 单项与肩部六屏）

- **运营设置**：移除「音效 / 语音播报 / 自动下一项」开关；Demo 中文案固定为默认开启语音与音效、完成页仅手动点选；`buildStateQuery` / URL 不再携带 `voice`、`sound`、`autoNext`。
- **完整测量转台**：`standard-measuring` 演示时长 **10s**；底部 **全程可点** 打断并进入下一步；尾声提示改为剩余 **≤3s**；隐藏 `<audio loop>` 播放 [`assets/turntable-loop.wav`](assets/turntable-loop.wav)，失败时回退 WebAudio；`prefers-reduced-motion` 下不播放；首帧自动播放受限时在页面首次手势后重试。
- **导航**：去掉 [`home.html`](home.html)、[`single-select.html`](single-select.html) 中手势 `hint-panel`。
- **单项完成页**：肩 / 平衡 / 颈 三页与 [`standard-result.html`](standard-result.html) 同构（摘要 + 二维码 + 报告｜下一项｜完成）；[`pro-result.html`](pro-result.html) 同步简化。
- **肩部流程**：准备 → [`single-countdown-shoulder.html`](single-countdown-shoulder.html) → [`single-measuring-shoulder-left.html`](single-measuring-shoulder-left.html) → [`single-measuring-shoulder-right.html`](single-measuring-shoulder-right.html) → [`single-result-shoulder.html`](single-result-shoulder.html)。
- **`setupFinishAutoAdvance`**：移除「演示倒计时自动进入下一项」逻辑（idle 默认下一项仍用于方案 A/B 完成页）。

---

## v1.4.0（版本号对齐）

- **说明**：工作区内此前未保留 `v1.4.0` 独立快照；当前 demo 根目录在 **v1.3.1 流程基线**（两阶段准备、测量体验与下一项推荐等）上，将 **`version.json` / 页面徽标 / `DEMO_VERSION_FALLBACK` 统一为 v1.4.0**，避免评审入口与页面版本展示不一致。
- **快照**：[`versions/v1.4.0/`](versions/v1.4.0/)

---

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
