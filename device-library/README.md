# 体测线背景资料库

## 目标

本资料库用于沉淀体测线多设备、多端口的结构化背景信息，优先服务以下场景：

- 后续新增设备端产品功能时，帮助 AI 和团队快速理解设备背景
- 梳理设备已有功能、交互方式、外围依赖和约束条件
- 为多设备、多端口扩展提供统一资料模板，避免不同对象文档结构不一致

本库不是说明书归档区，也不是研发接口文档库。重点是把后续产品设计和功能迭代最常用的信息整理成可检索、可维护、可持续补充的知识资产。

## 适用方式

- AI 检索：优先读取目标对象目录下的结构化文档
- 团队阅读：按设备或端口目录查看对应能力、流程、交互和依赖信息
- 后续补充：新增事实时更新对应专题文档，不在总览文档堆积所有信息

## 目录规则

本资料库将“背景对象”分为两类：

- `devices/`：物理设备，如体测镜、体脂秤、手持终端
- `clients/`：数字端口，如管理后台、H5、小程序、公众号、App

每个对象固定使用以下文档集合：

- `overview.md`
- `capabilities.md`
- `user-flow.md`
- `ui-interaction.md`
- `specs-and-dependencies.md`
- `open-questions.md`

推荐目录结构如下：

```text
device-library/
  README.md
  devices/
    README.md
    _template/
      overview.md
      capabilities.md
      user-flow.md
      ui-interaction.md
      specs-and-dependencies.md
      open-questions.md
    <device-id>/
      overview.md
      capabilities.md
      user-flow.md
      ui-interaction.md
      specs-and-dependencies.md
      open-questions.md
  clients/
    README.md
    _template/
      overview.md
      capabilities.md
      user-flow.md
      ui-interaction.md
      specs-and-dependencies.md
      open-questions.md
    <client-id>/
      overview.md
      capabilities.md
      user-flow.md
      ui-interaction.md
      specs-and-dependencies.md
      open-questions.md
```

## 文档释义

以下 6 份文档是固定骨架，新增设备或端口时都沿用：

- `overview.md`
  - 作用：回答“这是什么对象”
  - 放什么：产品定位、服务对象、核心价值、上下游关系、主要场景
  - 不放什么：过细的流程步骤、零散规格、未证实猜测
- `capabilities.md`
  - 作用：回答“它已经能做什么”
  - 放什么：功能清单、能力边界、功能分层、输出结果、开关或模式差异
  - 不放什么：实现方案、研发接口细节
- `user-flow.md`
  - 作用：回答“用户或运营人员怎么完成任务”
  - 放什么：关键任务流程、跨端协同链路、前置条件、流程分支
  - 不放什么：纯视觉描述、硬件参数表
- `ui-interaction.md`
  - 作用：回答“界面和交互是如何组织的”
  - 放什么：页面入口、导航结构、控件方式、操作模式、交互约束、风格线索
  - 不放什么：没有证据支撑的视觉细节猜测
- `specs-and-dependencies.md`
  - 作用：回答“有哪些环境、系统、硬件、账号或部署依赖”
  - 放什么：规格参数、联网要求、设备限制、外设依赖、账号依赖、第三方依赖
  - 不放什么：与依赖无关的普通功能说明
- `open-questions.md`
  - 作用：回答“还有哪些关键问题没搞清楚”
  - 放什么：待调研问题、风险点、需要实机或后台验证的事项
  - 不放什么：已经确认的事实结论

## 对象命名建议

- 设备使用稳定英文小写 id，如 `vapro7`、`visbody-s30`
- 端口使用稳定英文小写 id，如 `admin`、`wechat`、`h5-report`
- 一个对象一个目录，不把多个端口混写在同一个目录
- 如果某端口有多个版本或子系统，用更具体的 id，如 `admin-merchant`、`admin-ops`

## 文档接口约定

每份对象文档都应包含以下章节：

- `来源`
- `最后更新依据`
- `确定事实`
- `设计含义`
- `待补充`

其中：

- `来源`：说明当前文档的信息来源，如说明书、后台截图、实机录屏、研发访谈
- `最后更新依据`：记录最近一次补充该文档所基于的材料
- `确定事实`：只写能被材料直接支持的内容
- `设计含义`：说明这些事实对后续产品设计、功能扩展、交互方案的影响
- `待补充`：列出当前仍缺失但高频需要的信息

## 信息可信度分级

为避免把猜测写成事实，统一使用以下标签：

- `已确认`：材料直接给出，可明确引用
- `推断`：根据已确认信息整理出的合理判断，但材料未明确直述
- `待验证`：当前没有证据，只能作为待确认问题保留

建议写法示例：

- `已确认`：设备支持按键和手势两种交互方式
- `推断`：设备端设置页可能采用单层列表式入口组织
- `待验证`：首页是否展示品牌 logo 和欢迎语

## 更新规则

- 优先更新最贴近信息主题的专题文档
- 不把新信息只写在 `overview.md`，避免总览文档膨胀
- 若信息属于设备本体，写入 `devices/<device-id>/`
- 若信息属于后台、H5、公众号、小程序等端口，写入 `clients/<client-id>/`
- 若信息是跨设备、跨端共用规则，优先写入对应对象的 `open-questions.md` 标注，待后续确定是否抽成独立共享资料

## 维护方法

新增资料时，按下面规则执行：

1. 先判断资料属于哪个对象
   - 设备说明书、实机照片、安装要求，归 `devices/`
   - 后台页面、H5 页面、公众号功能，归 `clients/`
2. 再判断资料属于哪个专题文档
   - 定位类信息更新 `overview.md`
   - 功能清单更新 `capabilities.md`
   - 流程更新 `user-flow.md`
   - 页面和操作方式更新 `ui-interaction.md`
   - 规格和依赖更新 `specs-and-dependencies.md`
   - 未确认问题更新 `open-questions.md`
3. 每次更新都补 `最后更新依据`
4. 无法确认的内容不要写成结论，改写到 `待补充`

## 当前设备

- `vapro7`：首个已建档设备，对应 `Visbody-A Pro7`

## 当前端口

- 暂无正式建档端口，后续从 `clients/_template/` 复制创建

## 模板建议

新增设备时，可直接复制 `devices/_template/`。

新增端口时，可直接复制 `clients/_template/`。

保留章节结构，不沿用旧对象的具体结论。
