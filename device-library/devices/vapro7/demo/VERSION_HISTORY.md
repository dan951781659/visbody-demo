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

## 2026-06-03 · v1.9.2（WellnessHub Demo：配置须重启提示 · PRD v1.3.4）

- **`wellnesshub-measurement-config-demo.html`**：页头 `restart-hint`；保存 Toast 文案含「量产请重启设备 / Demo 请刷新设备端页」。
- **`shared.js`**：`DEMO_VERSION_FALLBACK` **1.9.2**。
- **文档**：`PRD-综合测量与WellnessHub配置.md` v1.3.4（§7.7.2 生效时机、§7.9 Demo 差异、`PRD.md` §9.1 一条）。

---

## 2026-06-02 · v1.9.1（完成页空闲 20s · 下一项与首页顺序对齐）

- **`standard-next-step.html`** / **`standard-next-step-touch.html`**：空闲默认下一项 **20 秒**；主链路补 idle 底栏与 `data-idle-*`。
- **`shared.js`**：`resolveFinishOrderKeys`、`getMeasurementOrder` 与 `homeMeasurementOrderKeys` 对齐；`DEMO_VERSION_FALLBACK` 1.9.1。
- **文档**：综合 PRD v1.3.3、`PRD.md` §9.1。

---

## 2026-06-01 · v1.9.0（结束测量支路 · B1 互斥 · 扫码页）

- **新页**：`report-scan-login.html`（扫码登录/绑定 → 链到模型生成）。
- **链路**：`standard-next-step.html`、`standard-next-step-touch.html`、`结果方案三.html`「结束测量」→ 扫码页；`standard-generating.html` 顶栏返回扫码页；`report-detail.html` 无重复二维码。
- **`shared.js`**：`REPORT_URL` → `report-scan-login.html`；综合 + 体态可并存；综合仍关身体成分/体围单项。
- **`wellnesshub-measurement-config-demo.html`**：`COMPREHENSIVE_EXCLUSIVE_SINGLE_IDS`、互斥与 `toDevicePayload` / 预览文案与 B1 一致；预览底部增加结束测量顺序说明。
- **文档**：`PRD-综合测量与WellnessHub配置.md` v1.2、`PRD.md`；`CHANGELOG.md`、`version.json` **v1.9.0**；`LOCAL-DEMO.md` 联调页列举。

---

## 2026-05-31 · v1.8.1（交互链路 · 设置合并 · Demo 往返）

- **`shared.js`**：`DEVICE_PERSISTED_KEYS`、`loadState` 设备键覆盖 URL；`saveState` try/catch + 内存兜底；`patchState` 同步 `history.replaceState`；`appendReturnToFromPage`、`resolveDemoBackHref`、`data-back-link`；`navigateToTarget` 附加 `returnTo`；`setupMeasurementWarningState` 空节点保护。
- **`standby.html` / `shared.css`**：全屏 `standby-home-hit` + `standby-tap-zone__surface` 点击穿透；Hub 无项目提示；页脚「返回 Demo 总览」。
- **`settings.html`**：合并原 `settings-modes`（准备页、语音）；分组「测量能力 / 测量流程 / 系统」；`data-back-link`。
- **`settings-height.html`**：返回链 `data-back-link` + `returnTo` 透传。
- **`settings-modes.html`**：跳转 `settings.html#measurement-flow`。
- **`index.html`**：`returnTo=./index.html` 与 `data-stateful-link`；移除独立「演示选项」入口。
- **文档**：`PRD.md` §11/§12、`CHANGELOG.md`、`version.json`。

---

## 2026-05-29 · v1.7.0（首页 IA · 动态实验室 · 准备页 · 倒计时文案）

- **`home.html`**：改为动态 `#home-measure-grid`；移除 VAPro7、单项测量、快捷嵌套卡。
- **`shared.js`**：`dynamicLab` 主项目、`renderHomeMeasurementEntries`、`resolveDynamicLabEntryHref`；`setupPrepGestureAdvance` 识别后自动跳转；`completeStageDemo` 去掉结束提示文案；**`DEMO_VERSION_FALLBACK` 1.7.0**。
- **`shared.css`**：`.home-measure-grid`、`.choice-card--compact`、`.prep-checklist-grid`。
- **`single-select.html`**：改版为「动态实验室 · 请选择测量部位」。
- **`standard-user-prep.html`**：2×2 图文准备网格 + 左右手手势说明 + 识别状态 chip。
- **资源**：`assets/prep/*.svg`（4 项准备示意）。
- **倒计时页**：`standard-countdown`、`pro-countdown`、`single-countdown-*` 移除 `section-label`。
- **`index.html`** / **`version.json`**：导航与版本 **v1.7.0**。

---

## 2026-05-27 · v1.6.1（站姿页 · 脚印对准电极片示意图）

- **`standard-bodycomp-prep.html`**：移除 2×2 四宫格，改为与扶手/45° 页一致的单主视觉布局。
- **资源**：`scripts/generate-footprint-turntable-svg.py` → `assets/bodycomp-prep/footprint-turntable-alignment.svg`。
- **`shared.css`**：`.bodycomp-prep-scene`、识别完成 `.is-aligned` 脉冲高亮。
- **`shared.js`**：`setupAutoDetectAdvance` 识别完成时添加 `is-aligned`；`version.json` **v1.6.1**。

---

## 2026-05-27 · v1.6.0（综合测量流程重构 · 测量准备页）

- **新页面**：`standard-user-prep.html`（测量准备页）、`standard-grip-prep.html`（扶手接触识别）。
- **流程改造**：`standard-bodycomp-prep`（站姿）、`standard-position`（45°）、`standard-countdown`、`standard-measuring`、`standard-next-step`。
- **`shared.js`**：`getStandardFlowEntryHref`、`setupAutoDetectAdvance`、`setupTipCarousel`、倒计时 `data-stage-auto-start`。
- **设置/入口**：`settings-modes.html`、`index.html` 文案同步；`version.json` **v1.6.0**。

---

## 2026-05-18 · v1.5.5（信息架构 · 倒计时姿势示意 · 体成分举手）

- **体成分准备**：四宫格完成后 **举右手** 进入扶手（`setupPrepGestureAdvance`）；Demo 模拟键与弱链兜底。
- **倒计时页**：`standard-countdown` / `pro-countdown` / `single-countdown-shoulder` 增加 **上示意、下倒计时** 布局（人偶与上一准备页一致）。
- **首页**：专业测量降为 `tag--tier`，主标题「体态测量」；单项与快捷肩部收入 `home-entry-group--single` 嵌套展示。
- **测量设置**：肩/颈/平衡开关收入「单项测量」`settings-subgroup`；专业测量描述同步。
- **`shared.css`**：`.device--countdown`、`.home-entry-group`、`.prep-gesture-block` 等。
- **`version.json`**：**v1.5.5**。

---

## 2026-05-27 · v1.6.0（综合测量流程重构 · 测量准备页）

- **新页面**：`standard-user-prep.html`（测量准备页）、`standard-grip-prep.html`（扶手接触识别）。
- **流程改造**：`standard-bodycomp-prep`（站姿）、`standard-position`（45°）、`standard-countdown`、`standard-measuring`、`standard-next-step`。
- **`shared.js`**：`getStandardFlowEntryHref`、`setupAutoDetectAdvance`、`setupTipCarousel`、倒计时 `data-stage-auto-start`。
- **设置/入口**：`settings-modes.html`、`index.html` 文案同步；`version.json` **v1.6.0**。

---

## 2026-05-18 · v1.5.4（设置分组 · 单项独立显隐 · 准备流程串联）

- **`settings-modes.html`**：去掉冗余 `section-label`；按 **首页入口 / 顺序 / 快捷 / 综合准备 / 播报报告** 分组；肩部、颈部、平衡各自开关（替代「显示单项测量」总开关）。
- **`shared.js`**：`singleShoulderEnabled` / `singleNeckEnabled` / `singleBalanceEnabled`；`isAnySingleEnabled`；快捷项与顺序池联动；**`DEMO_VERSION_FALLBACK` 1.5.4**。
- **`standard-bodycomp-prep.html`**：完成四宫格后进入 **`standard-position.html`**（扶手），再进倒计时。
- **`home.html` / `single-select.html`**：单项入口与分项卡片随开关显隐。

---

## 2026-05-27 · v1.6.0（综合测量流程重构 · 测量准备页）

- **新页面**：`standard-user-prep.html`（测量准备页）、`standard-grip-prep.html`（扶手接触识别）。
- **流程改造**：`standard-bodycomp-prep`（站姿）、`standard-position`（45°）、`standard-countdown`、`standard-measuring`、`standard-next-step`。
- **`shared.js`**：`getStandardFlowEntryHref`、`setupAutoDetectAdvance`、`setupTipCarousel`、倒计时 `data-stage-auto-start`。
- **设置/入口**：`settings-modes.html`、`index.html` 文案同步；`version.json` **v1.6.0**。

---

## 2026-05-18 · v1.5.3（测量设置 · 体成分四宫格 · 综合/专业测量文案）

- **`shared.js`**：恢复 **`voiceEnabled`**、**`bodyCompositionPrepEnabled`**（默认开）；**`speakText`** 总闸；**`getStandardFlowEntryHref`** + **`renderState`** 写 **`[data-standard-flow-entry]`**；URL **`voice` / `bodyCompPrep`**；**`MEASUREMENT_ITEMS`**：`standard` → 综合测量 + 体成分准备入口，`pro` → 专业测量；**`DEMO_VERSION_FALLBACK` 1.5.3**。
- **`settings-modes.html`**：更名 **测量设置**；卡片顺序：显隐 → 顺序池 → 快捷单项 → 外链 → **语音播报** → **体成分测量准备引导**；顺序池 **+ 综合测量 / + 专业测量**。
- **`standard-bodycomp-prep.html`**（新）：2×2 四宫格准备 → **`standard-countdown.html`**；资源 **`assets/bodycomp-prep/grid-reference.png`**。
- **`standard-position.html`**：关闭体成分准备时仅 **扶手阶段**（`data-guide-initial-phase="2"`）。
- **`home.html`**：综合测量 / 专业测量 · 体态测量文案；**`device--home`** + 底部运营位 + **`home-promo-schematic.png`**；去掉顺序预览行；**`data-standard-flow-entry`**。
- **`shared.css`**：**`.device--home`**、**`.home-promo-block`**、**`.card-subtitle`**、**`.bodycomp-prep-grid`** 等。
- **文案扫尾**：`index.html`、`pro-*`、`report-detail`；综合测量链路 **`section-label`**；运营设置 → 测量设置。
- **`version.json`**：**v1.5.3**。

---

## 2026-05-16 · v1.5.2（方案 A 手势与完成页对齐 · 颈/平衡占位 · 首页运营位）

- **`standard-next-step.html` / `standard-next-step-touch.html`**：手势/触控页 Demo 预期写清；缩短 **`scheme-three-gesture-panel`**（方案 A）；触控页去掉长篇对照副标题。
- **`shared.js`**：恢复 **`singleNeck` / `singleBalance`**（`MEASUREMENT_ITEMS`、`NEXT_RECOMMEND_DESC`、`completedGroups`）；首页快捷项 **`neck` / `balance`** 指向 **`single-flow-placeholder.html?item=`**；**`setupChoiceHighlight`** 跳过 **`[data-finish-group]`**；**`bindDemoPlaceholders`**；快捷卡 **`href`** 经 **`withStateQuery`**；**`DEMO_VERSION_FALLBACK` 1.5.2**。
- **`standard-result.html` / `single-result-shoulder.html` / `pro-result.html`**：footer 改为 **`scheme-three-flow`** 双 **`scheme-three-action-card`** + 「完成」弱链接；去掉与二维码重复的副标题。
- **`single-select.html`**：肩 / 颈 / 平衡并列；颈、平衡 **`data-demo-placeholder`**。
- **`single-flow-placeholder.html`**：颈、平衡占位中转页（Query **`item=neck|balance`**）。
- **`settings-modes.html`**：`+ 颈部` `+ 平衡`；快捷下拉含颈、平衡；顶栏长副标题移除（说明下沉至卡片）。
- **`home.html`**：**`home-promo-slot`** + **`assets/home-promo.png`**（**`data-demo-placeholder`** 防止 `#` 跳转）；去掉重复副标题。
- **`shared.css`**：**`.scheme-three-gesture-panel*`** 收紧；**`.scheme-three-flow--result-completion`** / **`.home-promo-slot`**。
- **其它**：`report-detail`、`standard-weight`、`standard-prepare`、`结果方案三` 等去掉解释性 **`screen-subtitle`**。
- **`version.json`**：**v1.5.2**。

---

## 2026-05-16 · v1.5.1（Demo 收口 UX：肩页规范 · idle 点击开始 · 颈/平衡下架 · 体态倒计时）

- **`shared.js`**：`MEASUREMENT_ITEMS` / 顺序预设收口为「完整测量 → 体态精测 → 肩部」；`normalizeState` 迁移旧预设与快捷项 `neck`/`balance`；**`setupFinishAutoAdvance`** 支持 `data-idle-start="on-first-click"`（先点后倒计时）；`DEMO_VERSION_FALLBACK` **1.5.1**。
- **`shared.css`**：肩部采集页 `.device--shoulder-measure` / `.single-shoulder-*`（顶进度卡、黑底取景叠层、底说明卡）；**`.scheme-three-idle-footer`** 分层与等待点击态 **`.is-idle-waiting-click`**；**`.scheme-three-gesture-panel`** 手势合一模块样式。
- **`single-measuring-shoulder-left/right.html`**：按规范纵向重排（外展上举示意文案与角度叠层）。
- **`standard-next-step.html`**：手势指引收敛为 **`scheme-three-gesture-panel`**；方案 A/B 完成流增加 **`data-idle-start="on-first-click"`**。
- **下架 Demo 内颈部、平衡**：删除 `single-prepare-neck.html`、`single-measuring-neck.html`、`single-result-neck.html`、`single-prepare-balance.html`、`single-measuring-balance.html`、`single-result-balance.html`；**`single-select.html`** 仅肩部入口；**`home.html` / `index.html` / `settings-modes.html`** 文案与控件同步。
- **体态链路**：新建 **`pro-countdown.html`**（比照 `standard-countdown`）；**`pro-prepare.html`** 跳转改为 **`pro-countdown.html`**。
- **`single-result-shoulder.html`**：与 **`standard-result.html`** footer 结构对齐（去掉额外弱链接段落）。
- **`version.json`**：**v1.5.1**。

---

## 2026-05-16 · Git 首次提交

- 仓库根目录：`体测线`。已添加根目录 `.gitignore`（忽略 `.DS_Store`）。
- 首次提交包含整个 `device-library/`（含 VAPro7 `demo/` v1.5.0、`VERSION_HISTORY.md`、`CHANGELOG`、`assets`、历史 `versions/` 快照等）。

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
