# VAPro7 Demo 变更记录

## v1.9.7（完成页摘要与首页入口绑定 · 单按钮布局）

- **`shared.js`**：`bindActionLinks` 改为 document 级事件委托，首页动态生成的测量卡片可正确触发 `start-session` 与 `currentMeasurementMode`；`startSession` 同步写入 `currentMeasurementMode`；新增 `resolveFinishKeyForPage` 在无已完成项时与会话起点对齐，避免旧 localStorage 残留模式；`FINISH_SUMMARY_BASE_ROWS` 统一摘要（肩/颈子项文案）；末项时完成区 `is-single-action`、摘要区 `is-single-summary` / `is-sparse-summary`。
- **`shared.css`**：单摘要行与仅「完成测量」时摘要栅格与操作区单列居中、`max-width` 约束。

---

## v1.9.6（完成页摘要与「继续下一项」修复）

- **`shared.js`**：循环池 `resolveFinishOrderKeys` 与首页卡片 `getHomeMeasurementTileKeys` 同源；`normalizeFinishKey` 统一 `girthOnly` → `circumferenceSingle`；抽取 `syncFinishGroupActions` 供完成页 UI 与 idle 倒计时共用；快速测量摘要顺序调整为体成分→体态→体围→身高→体重；完成页增加 `data-finish-section` 项目标签与进度副标题。
- **`standard-next-step.html`**：增加 `[data-finish-section]` 占位。
- **`legacy-girth-prep.html`**：修正体围入口为「开始测量」+ `circumferenceSingle` 模式与会话起点。

---

## v1.9.5（PRD §6.2 环形下一项 · 统一完成页）

- **`shared.js`**：实现 `sessionCycleStartKey`、环形 `getNextMeasurementRecommendation`、体重不进循环池；末项隐藏「继续下一项」且 20s idle 默认「完成测量」；删除 `heightResultVisible`；独立体重点击不重置测量循环。
- **`standard-next-step.html`**：「结束测量」改为「完成测量」。
- **测量完成收敛**：体态/肩/颈/平衡测量结束统一进入 `standard-next-step.html`；`pro-result.html`、`single-result-*.html` 改为 legacy 重定向。
- **`settings-height.html`**：重定向文案与 Hub 职责一致。

---

## v1.9.4（综合测量 / 体成分四步准备链路）

- **`standard-user-prep.html`**：准备清单增加通栏「足底对准转台脚印」项；进入下一步副文案改为站上转台采集。
- **`standard-bodycomp-prep.html`**：改为站转台 + 双手下垂主视觉（`turntable-figure.svg`）；`data-anthropometry-auto="1"` 固定自动采身高/体重并跳转；底部手动按钮隐藏。
- **`shared.js`**：`setupTurntableAnthropometryCapture` 支持 `anthropometryAuto`；`speakTextThen`；`setupAutoDetectAdvance` 支持 `data-voice-advance-next` / `data-voice-advance-after-ms`（扶手页语音结束 +3s 进 45°）；`setupVoice` 避免与自动识别页重复播报；`DEMO_VERSION_FALLBACK` **1.9.4**。
- **`standard-grip-prep.html`** / **`standard-position.html`**：握持特写 `hand-grip-metal.svg`；45° 页增加握持参照区；扶手页底部改为自动跳转说明。
- **`shared.css`**：`.prep-check-cell--wide`、`.guide-grip-*`、`.guide-dual-visual` 等。
- **文档**：`PRD.md` §12、`PRD-综合测量与WellnessHub配置.md` v1.3.6（§5、附录 A）；`VERSION_HISTORY.md`；`index.html` 注释说明主链路；`standard-weight.html` 入口文案。

---

## v1.9.3（青少年成长报告 · reportVisibility）

- **`wellnesshub-measurement-config-demo.html`**：综合测量 / 身体成分分组增加「青少年成长报告」开关（`youthGrowthReport`，与身体成分报告同属 `bodyComp` 组）。
- **`shared.js`**：`DEFAULT_REPORT_VISIBILITY`、`REPORT_METRIC_VALUES` 增加 `youthGrowthReport`；`DEMO_VERSION_FALLBACK` **1.9.3**。
- **`report-detail.html`**：按显隐展示「青少年成长报告」卡片。
- **文档**：`PRD-综合测量与WellnessHub配置.md` v1.3.5 §7.5、`PRD.md` §9.1。

---

## v1.9.2（WellnessHub 配置 Demo：重启后生效提示）

- **`wellnesshub-measurement-config-demo.html`**：页头常驻说明「量产须重启体测设备后生效」；保存成功 Toast 补充量产与本 Demo 的差异提示。
- **综合 PRD v1.3.4**：§7.7.2 设备侧生效时机、后台必带提示文案；§7.9 / §16 / §17 / §15.3 同步；删除「清除覆盖」二次确认建议。

---

## v1.9.1（完成页空闲 20s · 下一项顺序与首页一致）

- **`standard-next-step.html`**：主链路完成页增加「首次点击后 **20 秒**无操作默认继续下一项」空闲底栏（`data-idle-default-next` 等，与 `setupFinishAutoAdvance` 一致）。
- **`standard-next-step-touch.html`**：空闲倒计时统一为 **20** 秒。
- **`shared.js`**：`resolveFinishOrderKeys` / `homeTileKeysToFinishOrderKeys`；有 `homeMeasurementOrderKeys` 时「继续下一项」顺序与首页卡片顺序一致；`DEMO_VERSION_FALLBACK` **1.9.1**。
- **文档**：`PRD-综合测量与WellnessHub配置.md` v1.3.3、`PRD.md` §9.1 首页顺序说明。

---

## v1.9.0（结束测量支路 · B1 互斥 · 扫码页）

- **结束测量主链路**：`standard-next-step.html`（及触控版、结果方案三）「结束测量」→ `report-scan-login.html`（扫码绑定，不可跳过）→ `standard-generating.html`（人体三维模型）→ `report-detail.html`（报告详情，**无**与扫码页重复的报告二维码）。
- **`shared.js`**：`REPORT_URL` 默认改为 `./report-scan-login.html`（`openReport` 内置落地）；综合开启时**不再**与体态单项互斥（路 B / B1）；互斥仍约束综合与身体成分、体围单项。
- **WellnessHub 测量配置 Demo**：互斥与首页/下发 payload 与 B1 一致；预览区增加设备端结束测量顺序说明。
- **文档**：`PRD-综合测量与WellnessHub配置.md` v1.2、`PRD.md` §9.1 / §10。

---

## v1.8.6（设备页 section-label）

- **设备 Demo**：凡位于 `section.device` 内的 `.section-label` 一律隐藏（如「专业测量 · 体态测量」「完整测量」等）；`index.html` 总览等非设备区仍保留顶注样式。

---

## v1.8.5（项目选择无 idle 回待机）

- **测量项目选择**：移除 `setupMeasureSelectIdle` 及 `data-measure-select-idle` 等属性；不再出现「N 秒后返回首页」底栏，也不再静默定时跳转待机。

---

## v1.8.4（首页卡 · 身体成分入口 · 身高确认 · 去掉返回倒计时文案）

- **测量项目选择**：去掉顶栏「手势或点击选择」；大卡文案区顶对齐、压缩留白，插图区改为上对齐。
- **身体成分单项**：首页入口改为先进 `standard-user-prep.html`（测量准备），再进 `standard-bodycomp-prep.html`。
- **身高确认**（`height-confirm.html`）：主按钮「确认设置」；cm 输入与 ±；**20 秒无操作**自动进入 `standard-next-step`；去掉「N 秒无操作返回首页」提示；标题与状态栏为「身高确认」；读数区下方提示输入方式。
- **全局**：去掉项目选择底栏、体重结果页等处的「N 秒（无操作）返回首页」**文案与进度条**；体重结果页改为仅手动「立即返回」。（项目选择的静默回待机已在 v1.8.5 完全移除。）

---

## v1.8.3（待机体重全自动 · 结果精简）

- **待机体重测量**：三态仍按时间线自动切换，无需底部按钮与「N 秒后将结束测量」会话条；读数动画结束后自动进结果页。
- **体重结果页**：仅保留体重数值与测量时间；移除测量方式、数据说明、与上次对比及副文案；顶栏去掉「身体成分围度测量」链。

---

## v1.8.2（手动跳页 · 体重三态 · 结果页）

- **Demo 默认手动换页**：`isDemoManualAdvance()`；URL `?demoAuto=1` 时站姿页恢复全自动 Toast 并跳转。
- **站上转台**（`standard-bodycomp-prep.html`）：识别通过后需第一次点「下一步」播放身高/体重 Toast，第二次点「继续测量」进扶手；`data-anthropometry-next-btn` 替代 `data-demo-next`。
- **测量项目选择**：手势静止不再自动 `click` 卡片，须手动点击。
- **待机体重测量**：三态 UI（站转台 / 表盘 / 读数动画）；会话与手动进结果在 v1.8.3 改为全自动并去掉底部会话条。
- **体重结果页**：大号数值 + 多信息卡（v1.8.3 起仅体重与测量时间）。
- **状态**：`lastStandaloneWeightAt`（ISO 时间戳）。

---

## v1.8.1（交互链路 · 设置合并 · Demo 往返）

- **待机 → 项目选择**：透明全屏 `<a>` 兜底 + 可点击层叠；无项目时待机提示。
- **设备设置持久化**：`height*` / `weightStandalone` / `voice` / `bodyCompositionPrep` 以 localStorage 覆盖陈旧 URL；`patchState` 同步 `replaceState`；`localStorage` 不可用时内存兜底。
- **统一设置页**：`settings.html` 分组（测量能力 / 测量流程 / 系统）；`settings-modes.html` 跳转至 `settings.html#measurement-flow`。
- **Demo 总览**：`returnTo=./index.html`、顶栏 `data-back-link`、`navigateToTarget` 保留 `returnTo`。

---

## v1.8.0（待机 · 测量项目大卡 · 身高/体重 · 设备设置）

- **待机页** `standby.html`：VISBODY 风格；时钟；可选「体重测量」入口（`weightStandaloneEnabled`）。
- **测量项目选择** `home.html`：真机风大卡（标题/利益描述/动作提示/剪影）；手势静止 2 秒或点击；60 秒无操作回待机。
- **转台采集**：`standard-bodycomp-prep.html` 识别通过后 Toast「身高测量完成」「体重测量已完成」，**手动点击**进入下一步（`?demoAuto=1` 时全自动）。
- **身高延后确认**：设置 `heightConfirmRequired` 开启时，测量结束先进 `height-confirm.html` 再进完成页。
- **设备设置**：`settings.html` 分页壳 + `settings-height.html`（身高测量/确认/显示）+ 体重待机入口开关。
- **独立体重**：`weight-standalone-measuring.html` → 结果页 30 秒回待机。
- **状态键**：`heightMeasurementEnabled`、`heightConfirmRequired`、`heightResultVisible`、`weightStandaloneEnabled`、`sessionHeightCm`、`sessionWeightKg`。

---

## v1.7.0（首页 IA · 动态实验室 · 准备页 · 倒计时）

- **首页**：同级平铺主项目（综合、体态、体成分体围、体围、动态实验室、平衡）；移除单项测量与快捷嵌套卡；2 列紧凑网格。
- **动态实验室**：肩+颈合并为 1 个主入口；子项可分别启用，仅一项时直达准备页，两项时进分项页。
- **测量准备页**：2×2 图文准备网格；手势左右手说明；识别通过后自动跳转。
- **倒计时页**：移除 section-label 与「倒计时结束请点击下一步」提示文案。

---

## v1.6.1（站姿页 · 脚印对准电极片示意图）

- **站姿识别页**：`standard-bodycomp-prep.html` 由失效四宫格改为单主视觉 `live-stage`，展示转台脚印与电极片对准示意。
- **资源**：新增 `scripts/generate-footprint-turntable-svg.py` 与 `assets/bodycomp-prep/footprint-turntable-alignment.svg`（等距透视 SVG，可重复生成）。
- **样式/交互**：`shared.css` 增加 `.bodycomp-prep-scene`；识别通过后 `is-aligned` 高亮；保留手动「下一步」跳转。

---

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
