# VAPro7 设备端流程优化 PRD

## 1. 页面目标

- 让 VAPro7 设备端保持清晰、可执行的测量主流程。
- 设备端只负责：测量入口展示、测量引导、结果展示、报告分发。
- 测量项目与报告显示配置统一放在 WellnessHub 门店后台，设备端不再提供项目配置入口。

## 2. 目标用户

- 现场测量用户
- 门店教练
- 门店运营 / 管理人员（仅通过后台配置，不在设备端编辑项目）

## 3. 范围说明

### 3.1 设备端保留

- 首页测量入口展示
- 测量准备、测量中、结果页、完成后下一步选择
- 报告页 / 扫码查看报告
- 打印与设备能力项（语音、亮度等）

### 3.2 设备端移除

- 测量项目配置入口
- 项目级开关配置
- 项目下报告显示配置
- 与门店运营绑定的项目排序、首页快捷入口等配置能力

### 3.3 后台承接

- 测量项目的启用 / 停用
- 每个项目下的报告显隐
- 门店默认与指定设备覆盖
- 设备端、后台、手机端 H5 展示同一份测量结果与对应报告

## 4. 核心流程

### 4.1 正向流程

1. 首页展示当前可用测量入口。
2. 用户进入测量准备页，按语音和屏幕提示完成姿势。
3. 姿势正确后进入倒计时和测量流程。
4. 测量完成后进入结果页或下一步选择页。
5. 用户根据结果页选择继续下一项、完成测量或重新测量。

### 4.2 重新测量

- 一个项目测量完成后，用户无需下转台也可以直接重新测量。
- 重新测量时保留当前站位状态，只重置本次测量结果。
- 重新测量必须在用户仍站在转台上时可完成，不能强制回首页。

### 4.3 异常流程

- 测量过程中检测到姿态不正确时，立即给出纠正提示。
- 姿态恢复正确后，自动或手动恢复测量流程。
- 手势识别不可用时，保留按键或点击兜底。
- 测量中用户移动导致偏移时，提示用户回到可测状态后继续。
- 结果页未生成或报告打不开时，需保留返回重试或稍后再看入口。

## 5. 交互规则

- 首页入口只展示后台已启用的测量项目。
- 设备端不再允许编辑项目开关或报告显示。
- 结果页要清晰区分：
  - 已完成结果
  - 下一步动作
  - 重新测量
- 重新测量为弱化动作，不抢占主动作。
- 手势、按键、触摸并存时，主路径必须有明确兜底。
- 长时间无手势时可进入兜底自动推进，但必须明确当前目标。

## 6. 页面与状态要求

- 首页
  - 只展示可用项目入口
  - 不展示项目配置
- 测量准备页
  - 提供简洁姿势引导
  - 支持异常姿态提示
- 测量中页面
  - 提供当前状态、进度、异常纠正反馈
- 结果页
  - 结果摘要区与下一步操作区分层展示
  - 继续下一项、完成测量、重新测量层级清晰

## 7. 异常与边界

- 姿势不正确
- 用户移动导致测量中断
- 用户不重新下转台直接发起重新测量
- 手势识别失败
- 报告未生成或无法打开
- 打印不可用

## 8. 测试重点

- 后台关闭项目后，设备端不再显示对应入口。
- 后台开启项目后，设备端入口恢复。
- 项目开启时，报告显隐与后台配置一致。
- 测量完成后可在转台上直接重新测量。
- 姿势异常时有明确提示，恢复后能继续。
- 用户在结果页能清楚区分“继续下一项 / 完成测量 / 重新测量”。
- 首页、测量页、结果页的文案不产生歧义。
- 设备端报告结果与后台/H5 展示结果一致。

## 9. 结论

- 测量项目与报告显示配置统一放在 WellnessHub 门店后台管理。
- VAPro7 设备端只消费配置，不负责编辑配置。
- 当前设备端 demo 应重点保留真实测量流程、异常流程与重测流程，不再承担项目运营配置。

## 11. 设备能力设置（设备端本地 vs Hub 下发）

与 §9 测量项目配置分离。**Hub 下发**（`vapro7-measurement-config` payload，设备不可在设置页修改）：`heightMeasurementEnabled`、`heightConfirmRequired`（推导规则见综合 PRD §7.4）、`weightStandaloneEnabled`。

**设备设置页本地持久化**（`localStorage['vapro7-demo-state']`）：

| 设置项 | 状态键 | 默认 | 行为 |
|--------|--------|------|------|
| 显示测量准备页 | `bodyCompositionPrepEnabled` | 开 | 关：综合测量跳过准备清单，直达转台站姿 |
| 语音播报 | `voiceEnabled` | 开 | 关：关闭测量引导及相关页面的语音播报 |

**持久化（Demo）**：设备本地键写入 `vapro7-demo-state`；Hub 项目键以 `vapro7-measurement-config` 为准，二者在 `loadState` 合并。URL 查询参数可用于分享初始状态，但**用户已在设备上改过的本地键以 localStorage 为准**。

**测量中体重**：体成分/体态/体围/综合流程内仅 Toast「体重测量已完成」，数值进后台用于成分计算，不在流程页展示。

**独立体重**：用户从**项目选择页**入口进入三态体重测量页（站上转台 → 表盘准备 → 表盘读数），**自动**进入结果页；结果页展示体重与测量时间；**20 秒无操作**或手动返回 → **项目选择页**（`home.html`）。**不参与**测量循环池（综合 PRD §6.2）。

**转台身高/体重**：转台站姿页（`standard-bodycomp-prep`）在站姿识别通过后**自动**播放身高/体重 Toast（受 Hub `heightMeasurementEnabled` 影响），随后进入扶手准备；不再依赖同页两次点击「下一步/继续测量」。转台测量中可播放循环环境音效（与语音开关独立）。其他 Demo 页仍可按 `?demoAuto=1` 控制部分环节的自动演示差异。

**延后身高确认**：出现在测量完成页（`standard-next-step`）之前；可输入 cm 或用 ± 微调；主按钮「确认设置」；**20 秒无操作**自动进入完成页。页面标题为「身高确认」。

**统一完成页（量产目标）**：所有测量类型完成后均进入「测量已完成」页（举手引导 + 继续下一项 / 完成测量）；环形末项规则见综合 PRD **§6**。

## 12. 待机与测量项目选择

- **待机**（`standby.html`）：设备默认首页；长按按键进入设置/报告（文案示意）；全屏透明链接触达测量项目选择；无首页项目时显示 WellnessHub 提示条；页脚可「返回 Demo 总览」；**status-bar 右侧**可进入设置。
- **测量项目选择**（`home.html`）：从待机唤醒；topbar **仅**「← 首页」，**无**设置入口；大卡展示**当前运行模式**下已启用项目；手势静止仅播报「识别通过」，**须点击卡片**进入测量（点击项为本轮循环起点，见综合 PRD §6.2）。**快速测量**与**身体成分单项**均经 `standard-user-prep.html`（五项准备，含足底对准转台脚印）→ `standard-bodycomp-prep.html`（转台自动采高体重）→ `standard-grip-prep.html`（语音结束后约 3 秒进 45°）→ `standard-position.html` → 后续倒计时与测量中。**独立体重**入口仅在项目选择页（`weightStandalone`），待机页不展示。**无**「N 秒返回待机」倒计时或自动跳转。
- **Demo 页跳转约定**：**综合主链路**（准备 → 转台 → 扶手 → 45°）在 Demo 中已实现自动推进（见 [`PRD-综合测量与WellnessHub配置.md`](./PRD-综合测量与WellnessHub配置.md) §5.3）；**其余 HTML 页**默认不自动跳转，便于讲解。细节见 `shared.js` 与页面 `data-*`（附录 A）。
- **Demo 总览往返**：`index.html` 入口链携带 `returnTo=./index.html` 时，设备设置页顶栏「← 首页」返回总览；否则返回待机。

### 9.1 测量项目配置契约（WellnessHub ↔ 设备 Demo）

以下为门店后台「测量项目与报告配置」与 VAPro7 静态 Demo 之间的约定，便于联调与后续接入真实 API。

**配置入口信息架构（设备配置 Tab）**

- **二级 Tab**（同一「设备配置」页内）：
  - **设备样式配置**：Logo / 待机视频、体成分标准、围度展示数量（9/14，仅 APro7；门店级字段，**无型号切换条**）。
  - **测量项目/报告配置**（默认进入）：顶部**型号切换条** + **门店运行模式**（快速 / 专业，单选卡片二选一）+ 当前模式下的测量项目开关（含列表末尾**体重测量**；专业模式身体成分开启时嵌套**身高是否需要确认**）+ 报告聚合 + **设备端项目选择页**缩略预览；二级 Tab 下提示「保存后需重启设备生效」；首页入口顺序在预览区旁用 ↑/↓ 调整。另一模式配置单独存档，切换运行模式后可编辑。
- **保存行为**：样式子 Tab 点「确定」直接保存门店级字段；测量子 Tab 点「确定」后在弹层中选择**该型号门店内全部 SN** 或**该型号下指定 SN** 后落库。

**WellnessHub Demo 持久化（v7）**

- 浏览器键名：`localStorage['wellnesshub_measurement_config_demo_v7']`。
- 顶层包含：`activeModelId`、`activeConfigSubTab`（`style` | `measurement`）、`storeLegacySettings`、`modelGirthDisplayCount`（如 APro7 围度 9/14）、`modelStoreDefaults`（按型号：`measurementRuntimeMode`、`quickModeConfig`、`professionalModeConfig`、`weightStandaloneEnabled`）、`modelDeviceOverrides`（按型号再按 `unitId` 存同结构覆盖桶）。旧版仅含 `projects` 的桶在加载时自动迁移为双桶。
- **自 v6 迁移**：若存在 `wellnesshub_measurement_config_demo_v6`，首次加载时将其 `store` 与 `deviceOverrides` 映射为 **`visbody-apro7`** 型号下的默认与覆盖；读入后仍以 v7 键保存（不自动删除 v6 键，便于回滚对照）。

**运行模式与互斥（方案 A，废止 B1）**

| 测量项目 id | 说明 | 可见模式 |
|-------------|------|----------|
| `comprehensive` | 快速测量（含身体成分、体态、体围） | 仅 **快速模式** |
| `bodyComp` | 身体成分（单项） | 仅 **专业模式** |
| `posture` | 体态（单项） | 仅 **专业模式**；**不可**与快速测量并存 |
| `circumference` | 体围（单项） | 仅 **专业模式** |
| `balance` | 平衡评估 | 两模式均可 |
| `shoulder` / `neck` | 肩部 / 颈部 | 两模式均可 |

快速模式开启快速测量时，**强制关闭**身体成分、体围、体态单项。专业模式无快速测量项。`weightStandaloneEnabled` 为型号级全局项，在测量项目列表末尾配置，设备端入口在项目选择页。

**身高 payload 推导（写入设备键时）**

| 字段 | 快速模式 | 专业模式 |
|------|----------|----------|
| `heightMeasurementEnabled` | `comprehensive.enabled` | `bodyComp.enabled` |
| `heightConfirmRequired` | 恒 `false` | 仅 bodyComp 开时取配置，否则 `false` |

**报告 id（`reportVisibility` 键）**

| 键 | 说明 |
|----|------|
| `bodyCompReport` | 身体成分报告 |
| `youthGrowthReport` | 青少年成长报告 |
| `postureReport` | 体态报告 |
| `spine` | 脊柱报告 |
| `hip` | 臀型报告 |
| `circumferenceReport` | 体围报告 |
| `waistAbdomenReport` | 腰腹维度报告 |
| `balanceReport` | 平衡报告 |
| `shoulderReport` | 肩部报告 |
| `neckReport` | 颈部报告 |

快速模式开启快速测量时，设备端结果页以 `comprehensive` 下各报告显隐为准。专业模式合并各**已开启**单项项目下的报告开关。各模式 `projects.*.reports` **分桶存储**于 `quickModeConfig` / `professionalModeConfig`，切换运行模式不互相覆盖。

**报告显示配置规则**

| 测量方式 | 配置入口（后台 Demo） | 可单独配置的报告 |
|----------|----------------------|------------------|
| 快速模式 · 快速测量开启 | 右侧聚合区「快速测量」分组 | 体态、脊柱、臀型、身体成分、青少年成长、体围、腰腹维度（写入 `quickModeConfig.projects.comprehensive.reports`） |
| 专业模式 · 体态单项开启 | 右侧聚合区「体态」分组 | 体态报告、脊柱报告、臀型报告 |
| 专业模式 · 体围单项开启 | 右侧聚合区「体围」分组 | 体围报告、腰腹维度报告 |
| 专业模式 · 身体成分单项开启 | 右侧聚合区「身体成分」分组 | 身体成分报告、青少年成长报告 |

**本地演示同步（无 API 时）**

- 后台 Demo 保存后写入 `localStorage['vapro7-measurement-config']`，值为 **`version: 2`** 的 JSON，字段包括：`measurementRuntimeMode`（`quick` | `professional`）、`comprehensiveEnabled`、`bodyCompSingleEnabled`、`postureModeEnabled`、`circumferenceSingleEnabled`、`balanceModeEnabled`、`singleShoulderEnabled`、`singleNeckEnabled`、`heightMeasurementEnabled`、`heightConfirmRequired`、`weightStandaloneEnabled`、`reportVisibility`；若配置了首页卡片顺序，另含 **`homeMeasurementOrderKeys`**（与设备端 `HOME_TILE_KEYS` 对齐；**完成页环形循环池不含** `weightStandalone`，见综合 PRD §6.2）。设备 `shared.js` 同时兼容 `version: 1`（缺省运行模式为快速）。详见 [`PRD-综合测量与WellnessHub配置.md`](./PRD-综合测量与WellnessHub配置.md) §6.3、§7.4。
- 后台 Demo 在每次 `render()`（如切换型号或项目开关）后也会将**当前型号编辑区预览**写入同一键，便于与设备端同开调试；WellnessHub 演示状态本身的持久化仍以弹层内点击「保存」为准。
- 设备 Demo 在 `loadState` 时读取该键并合并进归一化状态；URL 查询参数用于流程态与分享；**WellnessHub 项目键以该 payload 为准**；设备端能力键（§11）以 `vapro7-demo-state` 持久化为准，见 §11。
- 该型号门店默认与指定 SN 覆盖在后台 Demo 内通过 `modelStoreDefaults` / `modelDeviceOverrides` 维护；保存弹层内**仅列出当前型号 SN**。写入设备演示键时仍按**当前选中型号 + 编辑区预览**生成单份 payload（真实多终端需设备上报 SN 后拉取各自型号与覆盖）。交互与生效规则见 [`PRD-综合测量与WellnessHub配置.md`](./PRD-综合测量与WellnessHub配置.md) **§7.7**。
- **量产**：后台保存并成功下发后，设备端新配置须在**重启设备**后完整生效（非运行中即时切换）；WellnessHub 须在配置保存等节点展示「保存后请重启对应体测设备」类固定提示，详见综合 PRD **§7.7.2**。同源浏览器 Demo 以刷新设备端页模拟读配置，**不**代表量产即时生效。

**动态实验室与肩/颈配置映射**

- 后台 `shoulder` / `neck` 项目开关 → 设备 `singleShoulderEnabled` / `singleNeckEnabled`；报告仍分项配置。
- WellnessHub 配置 Demo 左侧项目列表中，**肩部与颈部统一归属一级「动态实验室」分组**（子项可分别开关与配置报告）。
- 设备端首页仅 **一张**「动态实验室」卡片（`dynamicLab`）；肩/颈至少开启一项时该卡片出现。
- 后台 `homeMeasurementOrderKeys` 中的 `dynamicLab` 表示该卡片在首页的排序位置，不是肩/颈分开排序。

## 10. 当前 Demo 审查结论

> 设备流程与 WellnessHub 配置以 [`PRD-综合测量与WellnessHub配置.md`](./PRD-综合测量与WellnessHub配置.md)（当前 **v1.3.7**）为准；静态 Demo 发行版本见 `demo/version.json`（当前 **v1.9.4**）。

- 已完成：
  - 后台配置入口从设备端移除
  - 原地重测、姿态异常、手势兜底已补齐
  - 设备端 / 后台 / H5 的主链路关系已统一
  - 首页与设备设置页已收口，不再暴露评审入口 / 运营位示意
  - 综合准备五项、转台自动采高体重、扶手语音后自动进 45°（v1.9.4）
  - 完成页环形下一项、末项「完成测量」、统一完成页（Demo **v1.9.5**）
  - WellnessHub 按型号 + SN 配置（v7）、重启生效提示、青少年成长报告显隐（v1.9.2–v1.9.3）
- **设备端「完成测量」主链路**（与 [`PRD-综合测量与WellnessHub配置.md`](./PRD-综合测量与WellnessHub配置.md) §9 对齐）：测量已完成 → **扫码登录/绑定**（`report-scan-login.html`，不可跳过）→ **人体三维模型生成**（`standard-generating.html`）→ **报告详情**（`report-detail.html`，不重复展示与扫码页相同的报告二维码）。`shared.js` 中 `openReport` 的默认内置落地为扫码页。
- `standard-next-step-touch.html`、`结果方案三.html` 中「完成测量」亦指向扫码页，便于与主链路对照；`single-flow-placeholder.html` 等仍为隔离预览。
- 仍需优化：
  - 当前 demo 仍缺一次完整浏览器级视觉 QA
- 上线判断：
  - 目前不建议直接判断为“可直接上线给用户使用”
  - 需先做全链路验收与文案复核，再决定是否直接交付
