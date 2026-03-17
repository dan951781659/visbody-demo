# Fittrix FX5 竞品分析

> 编制说明：本文档与《Moti Physio-竞品分析》采用同一框架与颗粒度，便于双产品对比。**图文结合，并给出参考内容链接。**

---

## 1. 竞品基础信息（必填）

| 字段 | 内容 |
| --- | --- |
| 竞品名称 | Fittrix FX5（OUTBODY® CHECKUP） |
| 公司名称 | Fittrix（韩国） |
| 产品形态 | 智能硬件 + 软件（43 寸竖屏触控一体机 + 云端体测与会员管理） |
| 主打场景 | 健身 / 普拉提 / 医疗 / 养老 / 酒店 / 企业 |
| 核心客户 | B 端 / B2B2C（健身中心、普拉提馆、医疗机构、养老中心、酒店、企业/学校） |
| 定价模式 | 硬件 + 订阅（SaaS 云端服务） |
| 当前版本 | FX5（产品线含 FX2、FX5、FX7） |
| 最近更新时间 | 2024–2025 年（[Fittrix 官网](https://fittrix-en.imweb.me/) 持续更新） |
| 相关地址 | [Fittrix 全球官网](https://fittrix-en.imweb.me/)<br/>[FX5 产品页](https://fittrix-en.imweb.me/productInfoFx5)<br/>[FX2 产品页](https://fittrix-en.imweb.me/productInfoFx2)<br/>[FX7 产品页](https://fittrix-en.imweb.me/productInfoFx7)<br/>[About us](https://fittrix-en.imweb.me/27) |

---

## 2. 产品定位与核心卖点（必填）

**一句话定位**：基于 OUTBODY® CHECKUP 的智能体测一体机，约 2 分钟自助完成 70+ 指标，覆盖体态、肌肉、体能，并提供课前/课中/课后全流程 AI 服务与机构会员管理。

**官方主打卖点（Top3）**：

1. **自助体测**：用户可独立完成全流程，2 分钟 70+ 精准指标，无需专人协助
2. **3D 可视化与 OUTBODY® AGE**：360° 体态展示、身体年龄评估，数据直观易理解
3. **全流程服务**：课前筛查 → 课中实时动作分析（OUTBODY®）→ 课后 AI 健康报告与运动视频，提升会员留存

**核心价值**：

+ ☐ 测得准：无公开学术验证，准确性依赖官网宣传
+ ☑ 说得清：3D 可视化、OUTBODY® AGE 等概念易懂，普通人可理解
+ ☑ 用得起来（训练 / 干预）：AI 健康报告、运动视频、课中实时反馈
+ ☑ 机构效率提升：自助测量、云端会员管理、24/7 无人值守、OUTBODY® Kiosk 可兼作数字广告屏

---

## 3. 硬件能力（必填）

| 维度 | 内容 |
| --- | --- |
| 硬件形态 | 43 寸竖屏触控一体机（OUTBODY® Kiosk），固定点位，可兼作数字广告屏 |
| 测量方式 | 视觉 + 深度（3D 体测传感器，官网未披露具体技术参数） |
| 支持测量项目 | 体态 / 肌肉平衡 / 体能 / 70+ 指标（含 OUTBODY® AGE 身体年龄） |
| 单次测量耗时 | 约 2 分钟 |
| 环境要求 | 固定安装，需一定测量空间，支持 24/7 无人值守；光线与距离要求官网未明确披露 |
| 是否形成硬件门槛 | 是（一体机形态 + 云端体系；技术细节未公开） |

![Fittrix FX5 一体机外观（43 寸竖屏触控 OUTBODY® Kiosk）](https://placehold.co/800x420/0f172a/94a3b8?text=Fittrix+FX5+OUTBODY+Kiosk&font=inter)

*图：FX5 产品形态示意。实际产品图见 [FX5 产品页](https://fittrix-en.imweb.me/productInfoFx5)。*

---

## 4. 算法与决策能力（必填）

**核心算法能力**：

+ ☑ 体态识别
+ ☑ 脊柱 / 关节分析（推测，基于 3D 体测与 70+ 指标）
+ ☑ 多维数据综合判断（体态、肌肉、体能、身体年龄）

**结论生成方式**：

+ ☐ 单指标规则
+ ☑ 多指标决策树（推测）
+ ☑ AI 模型（AI 健康报告、动作分析、OUTBODY® 实时反馈）

**结论输出形式**：

+ ☑ 异常判断（体态、肌肉、体能）
+ ☑ 风险等级（OUTBODY® AGE 等综合指标）
+ ☑ 行为 / 训练建议（个性化运动视频、健康习惯建议）

---

## 5. 软件功能结构

### 5.1 软件功能架构（一/二/三级功能）

| 一级功能 | 二级功能 | 三级功能 |
| --- | --- | --- |
| **测量与建模** | 自助测量 | 用户独立操作、触控引导、约 2 分钟完成 |
|  | 3D 建模 | 全身 3D 体形重建、360° 展示 |
|  | 指标输出 | 70+ 指标（体态、肌肉平衡、体能）、OUTBODY® AGE |
| **体态与结果展示** | 结果入口 | 3D 可视化、OUTBODY® AGE、70+ 指标分层展示 |
|  | 体态视图 | 360° 体态与体形、前后对比视图 |
|  | 报告内容 | 量化指标、AI 健康报告、个性化运动视频 |
| **课中实时分析（OUTBODY®）** | 实时反馈 | 姿态、关节角度、平衡、动作模式分析 |
|  | AI 指导 | 基于动作数据的个性化运动指导 |
| **报告生成与导出** | 报告内容 | 3D 报告、OUTBODY® AGE、改善建议、运动视频 |
|  | 导出方式 | 打印、手机查看、KakaoTalk 等即时通讯推送 |
|  | 前后对比 | 历史数据对比、改善进度追踪 |
| **历史数据与用户管理** | 历史数据 | 测量记录、前后对比、体态/体能变化追踪 |
|  | 用户管理 | 云端会员管理、数据沉淀、复测与留存 |
| **教练/机构工具** | 报告呈现 | 3D 数据咨询、品牌展示 |
|  | 运营与展示 | OUTBODY® Kiosk 广告屏、机构活动/课程信息展示 |

### 5.2 软件功能分析

**评估类型**

| 检测类型 | 用途 | 测量方式 |
| --- | --- | --- |
| OUTBODY® CHECKUP 体测 | 体态、肌肉平衡、体能等 70+ 指标及 OUTBODY® AGE 身体年龄 | 用户在一体机前自助完成，触控按屏引导执行，全程约 2 分钟 |
| 课中 OUTBODY® | 训练/课程中的实时动作与姿态分析，用于即时反馈与指导 | 在普拉提、健身等课程中配合使用，设备实时采集动作并给出 AI 反馈 |

整体流程分为 **进入 Kiosk → 身份/访客选择 → 检测前引导 → 执行 OUTBODY® CHECKUP 测量 → 查看报告 → 导出/分享**。

---

#### 自助体测流程（OUTBODY® CHECKUP）

##### 环境与设备

- **硬件**：FX5 为 43 寸竖屏触控一体机（OUTBODY® Kiosk），固定安装于测量区域；机身内含 3D 体测传感器（具体型号与原理官网未披露），非接触式采集。
- **待机与复用**：无用户测量时，Kiosk 可展示机构广告、课程信息或品牌内容，提升场地利用与商业价值。
- **值守**：设计为无人值守，支持 24/7 开放，适合健身中心、酒店、企业等高流量场景。

![自助体测环境与设备示意](https://placehold.co/800x380/1e293b/cbd5e1?text=Self-Service+Measurement+Setup&font=inter)

*图：一体机安装与用户站位示意。详见 [FX5 产品页](https://fittrix-en.imweb.me/productInfoFx5)。*

##### 检测前准备

- **身份**：用户通过触控选择会员登录或访客模式；会员与云端账号关联，便于历史对比与机构管理。
- **引导**：屏幕显示站位与姿势要求（如站立位置、面向设备等），具体着装细则（紧身/脱鞋等）以设备当前提示为准，Fittrix 官网未像部分竞品那样单独列出详细清单。
- **全程自助**：无需教练或工作人员在场，用户按屏显步骤即可完成准备与测量。

**参考**：自助测量流程与界面见 [FX5 产品页](https://fittrix-en.imweb.me/productInfoFx5)、[官网首页](https://fittrix-en.imweb.me/)。

##### 测量中

- **步骤**：用户确认开始后，按屏幕提示保持或切换姿态，3D 体测传感器在约 2 分钟内完成多角度/多姿态数据采集（具体动作顺序与阶段数以产品实际为准，官网未逐项公开）。
- **反馈**：测量过程中屏幕应有进度或状态提示，便于用户配合；若存在异常（如超出范围、遮挡等），需依赖设备提示或重测逻辑（官网未详述）。
- **结束**：采集完成后自动进入结果计算与报告展示，无需手动提交。

![自助测量中界面示意](https://placehold.co/800x400/1e3a5f/e2e8f0?text=Measurement+Screen+%7C+Touch+Guide&font=inter)

*图：测量中触控引导界面。3D 演示见 [FX5 产品页](https://fittrix-en.imweb.me/productInfoFx5) 内「View 3D Results Demo」。*

##### 报告查看

###### 结果入口与 3D 可视化

- **首屏**：结果页以 360° 全身 3D 体形/体态模型为主视觉，用户可旋转查看当前身体形态，形成直观第一印象。
- **OUTBODY® AGE**：作为 Fittrix 的核心概念之一，身体年龄在结果中突出展示，用于综合反映体态、肌肉、体能等维度的「老化」程度，便于非专业用户理解「好不好、老不老」。
- **70+ 指标**：体态、肌肉平衡、体能等细项以分类或列表形式呈现，重要或异常项可被突出（如高亮、排序），方便用户与教练快速抓住重点。

![3D 体态与 OUTBODY® AGE 结果示意](https://placehold.co/800x400/0c4a6e/f0f9ff?text=3D+Body+%26+OUTBODY+AGE&font=inter)

*图：360° 3D 体态与身体年龄（OUTBODY® AGE）展示。详见 [官网首页](https://fittrix-en.imweb.me/)、[FX5 产品页](https://fittrix-en.imweb.me/productInfoFx5)。*

###### 报告内容与解读

- **量化指标**：各维度给出数值或等级（如体态偏差、肌肉平衡、体能相关指标），便于与标准或历史对比。
- **AI 健康报告**：系统根据 70+ 指标生成文字与图示解读，包含简要结论与改善建议，面向 C 端可读性设计，降低对专业教练的依赖。
- **个性化运动视频**：与测量结果挂钩，推荐或推送针对性的运动/拉伸视频，帮助用户「课后跟练」，形成「测—读—练」闭环。

![报告内容与 AI 健康报告示意](https://placehold.co/800x380/1e293b/94a3b8?text=70%2B+Metrics+%26+AI+Report&font=inter)

*图：70+ 指标与 AI 健康报告样式。详见 [FX5 产品页](https://fittrix-en.imweb.me/productInfoFx5)、[About us](https://fittrix-en.imweb.me/27)。*

###### 前后对比

- 会员可在同一设备或云端账户内选择历史测量日期，与本次结果进行对比。
- 对比维度通常包含体态、体能、OUTBODY® AGE 等，用于观察一段时间内的改善或变化，提升复测意愿与会员留存。
- 机构端（教练/管理后台）可查看会员的历次数据与趋势，用于课程推荐与效果沟通。

**参考**：前后对比功能见官网产品介绍及 [竞品分析-Moti Physio与Fittrix FX5](c:\Users\95178\Desktop\cursor\PMokr\竞品分析-Moti Physio与Fittrix FX5.md)。

###### 导出与分享

- **打印**：支持在一体机或机构内打印机输出报告，便于现场交给用户或存档。
- **手机/云端**：用户可通过扫码、链接或账号同步在手机端查看报告，部分区域支持通过 KakaoTalk 等即时通讯推送报告或链接（以当地版本为准）。
- **机构露出**：导出或分享内容可带机构 Logo、名称等，增强品牌露出与归属感；具体配置以产品实际功能为准。

**参考**：导出与分享见 [FX5 产品页](https://fittrix-en.imweb.me/productInfoFx5)、[单一竞品跟踪-Fittrix FX5](c:\Users\95178\Desktop\cursor\PMokr\单一竞品跟踪-Fittrix FX5.md)。

#### 课中 OUTBODY®（训练中实时分析）

- **使用场景**：在普拉提馆、健身中心等场所，用户上课或训练时使用 OUTBODY® 进行实时动作采集与分析，与「课前 OUTBODY® CHECKUP 体测」形成搭配。
- **反馈内容**：系统对姿态、关节角度、平衡、动作模式等进行实时分析，并在课程中通过屏幕或设备给出反馈，便于教练与用户即时调整。
- **AI 指导**：基于实时动作数据提供个性化提示或建议，与课后 AI 健康报告、运动视频一起，构成「课前筛查 — 课中纠偏 — 课后巩固」的全流程服务，提升会员粘性与复购。

![课中 OUTBODY® 实时分析示意](https://placehold.co/800x360/312e81/c4b5fd?text=OUTBODY+Real-time+Analysis&font=inter)

*图：课中实时动作分析与 AI 指导示意。详见 [官网](https://fittrix-en.imweb.me/)、[竞品分析-Moti Physio与Fittrix FX5](c:\Users\95178\Desktop\cursor\PMokr\竞品分析-Moti Physio与Fittrix FX5.md) 第二节 2.2.4。*

### 5.3 报告界面参考素材

| 类型 | 说明 | 链接 |
| --- | --- | --- |
| 产品与 3D 结果 | FX5 一体机外观、3D 体测结果、OUTBODY® AGE | [FX5 产品页](https://fittrix-en.imweb.me/productInfoFx5) |
| 自助测量流程 | 用户操作界面、测量步骤 | [FX5 产品页](https://fittrix-en.imweb.me/productInfoFx5)、[官网首页](https://fittrix-en.imweb.me/) |
| 结果与报告 | 70+ 指标、AI 健康报告、运动视频、前后对比 | [FX5 产品页](https://fittrix-en.imweb.me/productInfoFx5) |
| Kiosk 与场景 | 测量 + 广告屏双用途、多场景应用 | [官网首页](https://fittrix-en.imweb.me/)、[About us](https://fittrix-en.imweb.me/27) |
| 客户案例 | 健身房、酒店、企业等应用场景 | 官网 "Fittrix Members" 或 [竞品分析-Moti Physio与Fittrix FX5](c:\Users\95178\Desktop\cursor\PMokr\竞品分析-Moti Physio与Fittrix FX5.md) 第八节 |

![多场景应用示意（健身/酒店/企业）](https://placehold.co/800x320/134e4a/d1fae5?text=Fittrix+Members+%7C+Gym+Hotel+Enterprise&font=inter)

*图：FX5 在健身中心、酒店、企业等场景的应用。详见官网 Fittrix Members。*

### 5.4 测量流程与报告结果页视频/图片资源（全网检索）

以下为测量流程、报告结果页相关的视频/图片检索结果与建议搜索方式，便于补充竞品素材。

#### 报告结果页参考（我方对标样式）

下图为一款体态/体测类产品的**报告结果页参考**（OUTBODY REPORT 风格）：含 OUTBODY Age / Insights / **3D View** / BODY MBTI 等 Tab，3D View 下可选 Posture、Flexibility、Strength、Balance 等评估类型，按身体部位（Neck、Shoulder、Lumbo-Pelvic、Knee、Foot）查看；左侧为具体体态项目（Forward head、Head tilt、Round Shoulder 等）及角度、NORMAL/CAUTION/DANGER 等级；右侧为 3D 骨骼/肌肉视图，红=紧张、蓝=无力、绿=正常，支持 Photo / Skeleton / Muscle / Fat 切换。可作为 Fittrix FX5 报告页对标与设计参考。

![报告结果页参考：OUTBODY REPORT 3D View（体态+肌肉状态）](assets/c__Users_95178_AppData_Roaming_Cursor_User_workspaceStorage_d470b0471618d510c34bfa59ee270de1_images_image-1943fdb3-5964-4308-8ce9-cf9b04c39eef.png)

*图：报告结果页参考（3D View、体态项+等级+3D 肌肉编码）。*

#### 测量流程 / 报告结果页 视频·图片 来源

| 类型 | 平台/来源 | 链接或搜索建议 | 说明 |
| --- | --- | --- | --- |
| **官网** | Fittrix 全球站 | [FX5 产品页](https://fittrix-en.imweb.me/productInfoFx5) | 产品图、内嵌「View 3D Results Demo」等，可能有测量/报告示意 |
| **官网** | Fittrix 韩文站 | [fittrix.io About](https://fittrix.io/aboutUs) | 公司及产品介绍，可能有宣传视频 |
| **YouTube** | 搜索关键词 | 建议搜索：`Fittrix FX5`、`Fittrix OUTBODY`、`Fittrix OUTBODY CHECKUP`、`Fittrix body scan` | 未检索到官方频道或明确标题的测量/报告视频，需在 YouTube 内直接搜索 |
| **FIBO 2025** | YouTube | [FIBO 2025: Live from the Show Floor!](https://www.youtube.com/watch?v=AUsIkZj9Ayg)、[Experience the future of fitness assessment at FIBO 2025](https://www.youtube.com/watch?v=7GcRUZqRYD8) | Fittrix 在 FIBO 2025 参展，上述展会视频中可能出现 Fittrix 展位或演示，可快进查找 |
| **Facebook** | 搜索 | 在 Facebook 搜索「Fittrix」或「Fittrix OUTBODY」 | 需登录后查看是否有品牌主页、广告或用户上传的测量/报告视频 |
| **韩媒报道** | 文字+配图 | [스포츠경향 - 피트릭스 아웃바디](https://sports.khan.co.kr/article/202304250742003)、[내외경제TV - FIBO 2025 아웃바디](https://www.nbntv.co.kr/news/articleView.html?idxno=3036891) | 含 FX 产品描述与测量流程文字、配图，无直接视频链接 |
| **其他** | LinkedIn / Instagram | 搜索「Fittrix」「Fittrix OUTBODY」 | 可查找公司账号或员工/客户发布的演示、报告截图 |

**检索结论**：Fittrix 官方未在公开渠道提供独立的「测量流程教学视频」或「报告结果页完整演示视频」链接；官网产品页与 FIBO 展会视频为最接近的一手素材。建议在 YouTube、Facebook、Instagram 用上述关键词二次搜索，或向 Fittrix 询价/合作时索取官方 demo 视频与报告截图。

---

## 6. 商业模式与定价（必填）

| 项目 | 内容 |
| --- | --- |
| 硬件售价 | 官网询价，未公开 |
| 软件收费 | 有（SaaS 云端服务、会员管理、AI 报告等） |
| 是否强绑定订阅 | 是（云端、报告、会员管理依赖订阅） |
| 锁客方式 | 数据 / 账号 / 硬件（云端数据与会员体系强绑定，迁移成本高） |

**参考**：[竞品分析-Moti Physio与Fittrix FX5](c:\Users\95178\Desktop\cursor\PMokr\竞品分析-Moti Physio与Fittrix FX5.md) 第七节。

---

## 7. 附录：客户案例与视频资料（选填）

### 7.1 机构端客户案例（参考）

| 机构类型 | 代表客户 | 主要评价/用途 |
| --- | --- | --- |
| 健身中心 | Spo Gym、Habit Fitness、Seoul City Crew | 自助体测提升运营效率、会员注册率与信任感 |
| 普拉提馆 | Eve Pilates | 会员更理解体态，增强对普拉提价值的认同 |
| 运动/学院 | 镇川运动员村 | 运动前状态评估与损伤预防 |
| 酒店 | DoubleTree by Hilton | 无人值守维持高端服务，降低运营成本 |
| 企业 | Samsung Biologics、现代摩比斯 | 24/7 使用、定制运动视频与复测激励 |
| 高校 | 庆熙大学 | 数据支持研究与运动处方 |
| 医院 | 嘉佐延世骨科 | 3D 可视化帮助患者理解病情，提升沟通效果 |

**参考**：[竞品分析-Moti Physio与Fittrix FX5](c:\Users\95178\Desktop\cursor\PMokr\竞品分析-Moti Physio与Fittrix FX5.md) 第八节 8.2（Fittrix FX5 机构端反馈）。

### 7.2 视频与视觉资料

| 类型 | 说明 | 链接 |
| --- | --- | --- |
| 3D 演示 | View 3D Results Demo | [FX5 产品页](https://fittrix-en.imweb.me/productInfoFx5) 内嵌 |
| 公司/产品介绍 | Fittrix - Company Introduction | 官网 / LinkonBiz、[About us](https://fittrix-en.imweb.me/27) |
| 产品详情 | FX5 产品页（含可能演示视频） | [FX5 产品页](https://fittrix-en.imweb.me/productInfoFx5) |

---

## 8. 优劣势与结论（必填）

### 明显优势

1. **自助化与运营效率**：约 2 分钟自助完成，24/7 无人值守，降低人力成本，适合高流量场景（健身中心、酒店、企业等）。
2. **全流程覆盖**：课前筛查 + 课中 OUTBODY® 实时分析 + 课后 AI 报告与运动视频，会员留存与复购提升。
3. **机构增值**：云端会员管理、OUTBODY® Kiosk 广告屏、多场景适配（健身/医疗/养老/酒店/企业）。

### 明显短板

1. **准确性无公开背书**：无学术论文或临床验证，专业信任度不及有医学背书的竞品（如 Moti Physio）。
2. **测量耗时较长**：约 2 分钟，不及 30 秒级竞品。
3. **理论可解释性弱**：官网未披露 Janda、解剖列车等理论，专业深度不足。

### 对我方的直接启示

Fittrix FX5 的启示应结合其真实优劣势来看，而非套用通用结论：

- **从优势可学**：FX5 验证了「自助体测 + 云端会员 + 课中实时反馈 + 课后 AI 报告」在健身/酒店/企业等多场景的可行性，机构端更看重运营效率与会员留存。若我方做 B 端，自助化与「课前—课中—课后」闭环是值得优先投入的方向；Kiosk 形态与广告屏复用对场地价值提升有参考意义。
- **从短板可差异化**：FX5 未提供医学级验证与理论可解释性（如肌肉为何紧张/无力、与何种症候群相关），专业端（康复、医疗）信任度依赖机构口碑而非产品背书。若我方具备或可补齐准确性验证与理论依据（如 Janda、解剖链等），可打「专业版自助体测」或「医学级 + 自助」的差异化定位。
- **从产品形态可借鉴**：一体机 + 云端锁客的模式使迁移成本高，我方在架构设计时可考虑数据与账号体系的粘性；同时 FX5 的 2 分钟与 70+ 指标说明「指标数量与身体年龄」对 C 端感知有价值，我方可在保证准确性的前提下，在报告可读性与指标设计上做对应取舍。

**参考**：[单一竞品跟踪-Fittrix FX5](c:\Users\95178\Desktop\cursor\PMokr\单一竞品跟踪-Fittrix FX5.md)、[竞品分析-Moti Physio与Fittrix FX5](c:\Users\95178\Desktop\cursor\PMokr\竞品分析-Moti Physio与Fittrix FX5.md) 第十一节。

---

## 9. 动态追踪（选填｜长期）

| 时间 | 变化点 | 影响判断 |
| --- | --- | --- |
| （待补充） |  |  |

---

**参考资料**

- Fittrix 全球官网（英文）：https://fittrix-en.imweb.me/
- FX5 产品页：https://fittrix-en.imweb.me/productInfoFx5
- 工作区《单一竞品跟踪-Fittrix FX5》《竞品分析-Moti Physio与Fittrix FX5》

---

*文档版本：v1.0 | 更新日期：2026 年 1 月 | 框架对齐《Moti Physio-竞品分析》*
