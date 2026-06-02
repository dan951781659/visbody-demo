# AI 报告解读 - 综合结论规则库

> **编制说明**：本文档为《AI报告解读模块-产品需求文档》的独立配置文档，定义指标组合→综合结论的匹配规则、优先级与去重逻辑。  
> **维护方**：产品 + 康复/运动医学专家联合维护。  
> **关联文档**：《AI报告解读-综合结论规则库-完整版.csv》（108 条规则）

---

## 一、规则库概述

### 1.1 定位

综合结论规则库用于将**多个异常指标的组合**映射为**综合征/体态类型**等综合结论，如：
- BMI 正常 + 腰臀比超标 → **中心性肥胖**
- 双侧圆肩 + 头前引 → **上交叉综合征**

### 1.2 规则类型与输出层级

| 类型 | 说明 | 输出形式 | 优先级 |
|------|------|----------|--------|
| **异常综合结论** | 多指标组合命中规则，输出综合征/体态类型 | 「中心性肥胖」「上交叉综合征」等 | 4～98 |
| **异常单指标兜底** | 未参与综合结论的异常指标 | 「体脂率偏高」「髋外展受限」等 | 52～98 |
| **正常结论** | 某维度已测指标均正常时的激励输出 | 「体成分表现良好」「体态表现良好」等 | 200 |

### 1.3 规则结构说明

每条规则包含：规则ID、综合结论名称、所属维度、必要/可选/排除条件、优先级、覆盖指标、结论模板等。完整规则以 CSV 为准，见《AI报告解读-综合结论规则库-完整版.csv》。

---

## 二、规则结构定义

### 2.1 单条规则字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `rule_id` | string | 是 | 唯一标识，如 `OBESITY_CENTRAL_001` |
| `name` | string | 是 | 综合结论名称，如「中心性肥胖」 |
| `dimensions` | string[] | 是 | 所属维度：health / aesthetic / sport |
| `priority` | int | 是 | 优先级，数值越小优先级越高（1 最高） |
| `required` | condition[] | 是 | 必要条件，全部满足才命中 |
| `optional` | condition[] | 否 | 可选强化条件，满足可增强可信度 |
| `exclude` | condition[] | 否 | 排除条件，满足则本规则不触发 |
| `override_rules` | string[] | 否 | 本规则命中时，被覆盖的规则 ID 列表 |
| `evidence_indicators` | string[] | 是 | 参与证据组装的指标 ID 列表 |
| `template` | string | 是 | 结论描述模板，支持变量占位；须符合医疗用词规范（见 PRD 8.4） |
| `suggestions` | string[] | 否 | 建议模板列表 |
| `conclusion_type` | enum | 否 | abnormal（默认）/ normal，正常结论为 normal |

### 2.2 条件（condition）结构

| 字段 | 类型 | 说明 |
|------|------|------|
| `indicator` | string | 指标 ID |
| `condition` | enum | `abnormal` / `in_range` / `exceed` / `below` / `bilateral_abnormal` 等 |
| `params` | object | 如 `range: [18.5, 24.9]`、`threshold: 0.9`、`gender_based: true` |

### 2.3 组合逻辑类型

| 类型 | 说明 | 示例 |
|------|------|------|
| **AND** | 同一 `required` 内所有条件均需满足 | BMI 正常 AND 腰臀比超标 |
| **OR** | 同一组内满足任一即可（通过多条 rule 或 condition 实现） | 左圆肩异常 OR 右圆肩异常 |
| **bilateral** | 双侧均异常 | 左圆肩 AND 右圆肩 均异常 |
| **count** | 满足 N 个中的 M 个 | 颈椎 6 项活动中至少 3 项受限 |

---

## 三、规则列表

### 3.1 体成分类

#### R001 - 中心性肥胖

| 字段 | 值 |
|------|-----|
| rule_id | OBESITY_CENTRAL_001 |
| name | 中心性肥胖 |
| dimensions | health, aesthetic |
| priority | 10 |
| required | BMI 在 [18.5, 24.9]（男）/ [18.5, 24.9]（女）；腰臀比 > 0.9（男）/ > 0.85（女） |
| optional | 腰围超标、内脏脂肪面积偏高 |
| exclude | BMI < 18.5 |
| override_rules | [] |
| evidence_indicators | [BC_15, BC_12] |
| template | 体型呈中心性肥胖特征，腰臀比{{腰臀比}}超标而 BMI 在正常范围，提示腹部及内脏脂肪偏多，建议控制精制碳水、增加有氧与核心训练。 |

**条件配置示例（YAML）：**
```yaml
required:
  - indicator: BC_15  # BMI
    condition: in_range
    params: { male: [18.5, 24.9], female: [18.5, 24.9] }
  - indicator: BC_12  # 腰臀比
    condition: exceed
    params: { male: 0.9, female: 0.85 }
```

---

#### R002 - 隐性肥胖

| 字段 | 值 |
|------|-----|
| rule_id | OBESITY_LATENT_001 |
| name | 隐性肥胖 |
| dimensions | health, aesthetic |
| priority | 15 |
| required | BMI 在正常范围；体脂率 > 20%（男）/ > 28%（女）；肌肉量不足或偏低 |
| exclude | BMI 超标 |
| override_rules | [] |
| evidence_indicators | [BC_15, BC_05, BC_03] |
| template | 体型偏瘦但体脂率偏高、肌肉量不足，属于隐性肥胖，易被忽视。建议增肌减脂并重，适当力量训练。 |

---

#### R003 - 肌肉型肥胖

| 字段 | 值 |
|------|-----|
| rule_id | OBESITY_MUSCULAR_001 |
| name | 肌肉型肥胖 |
| dimensions | health, aesthetic, sport |
| priority | 20 |
| required | 体脂率偏高；肌肉量充足或超标（在参考范围中上部或以上） |
| exclude | 肌肉量不足 |
| override_rules | [] |
| evidence_indicators | [BC_05, BC_03, BC_06] |
| template | 体脂率偏高但肌肉量充足，属于肌肉型体型。建议在保持力量训练基础上，适度增加有氧与饮食控制以降低体脂。 |

---

### 3.2 体态综合征类

#### R004 - 上交叉综合征

| 字段 | 值 |
|------|-----|
| rule_id | SYNDROME_UPPER_CROSS_001 |
| name | 上交叉综合征 |
| dimensions | health, aesthetic, sport |
| priority | 5 |
| required | 头前引异常；且（左圆肩异常 或 右圆肩异常）；若双侧圆肩均异常则结论更强 |
| optional | 胸椎曲度异常、颈椎活动度受限、圆背 |
| exclude | [] |
| override_rules | [PT_HEAD_FWD_001, PT_ROUND_SHOULDER_001] |
| evidence_indicators | [PT_01, PT_04, PT_05] |
| template | 头颈前移伴圆肩，符合上交叉综合征表现，提示颈深屈肌、下斜方肌偏弱，上斜方肌、胸大肌偏紧。建议加强颈部深层肌群与下斜方肌，并拉伸胸大肌、上斜方肌。 |

**条件配置示例：**
```yaml
required:
  - indicator: PT_01  # 头前引
    condition: abnormal
  - indicator: PT_04  # 左圆肩
    condition: abnormal
  - indicator: PT_05  # 右圆肩
    condition: abnormal
# 实际实现时可定义为：头前引 AND (左圆肩 OR 右圆肩)，至少一侧圆肩异常
```

---

#### R005 - 下交叉综合征

| 字段 | 值 |
|------|-----|
| rule_id | SYNDROME_LOWER_CROSS_001 |
| name | 下交叉综合征 |
| dimensions | health, aesthetic, sport |
| priority | 6 |
| required | 骨盆前倾 或 骨盆前移明显；且（腰椎过伸/曲度异常 或 髋屈肌紧张 或 臀型异常如塌臀） |
| optional | 膝超伸、腹肌薄弱 |
| exclude | [] |
| override_rules | [PT_PELVIS_001] |
| evidence_indicators | [PT_06, PT_07, SP_05, BT_01] |
| template | 骨盆前倾伴腰曲过大，符合下交叉综合征特征，提示髂腰肌、竖脊肌偏紧，臀肌、腹肌偏弱。建议加强臀肌与核心，并拉伸髂腰肌、竖脊肌。 |

---

#### R006 - 头前引（单一体态问题，低优先级）

| 字段 | 值 |
|------|-----|
| rule_id | PT_HEAD_FWD_001 |
| name | 头前引 |
| dimensions | health, aesthetic, sport |
| priority | 50 |
| required | 头前引异常 |
| exclude | 若已命中 R004 上交叉综合征则排除 |
| override_rules | [] |
| evidence_indicators | [PT_01] |
| template | 存在头前引倾向，易导致颈肩酸痛、颈椎负荷增加。建议改善日常姿势并加强颈深屈肌。 |

---

#### R007 - 高低肩伴脊柱侧弯风险

| 字段 | 值 |
|------|-----|
| rule_id | PT_SCOLIOSIS_RISK_001 |
| name | 高低肩伴脊柱侧弯风险 |
| dimensions | health, aesthetic, sport |
| priority | 12 |
| required | 高低肩异常；且（头侧歪 或 身体倾斜 或 脊柱侧弯风险评分异常） |
| optional | 骨盆倾斜、长短腿 |
| override_rules | [PT_HIGH_LOW_001] |
| evidence_indicators | [PT_03, PT_02, PT_12, SP_10] |
| template | 高低肩伴有头侧歪或身体倾斜，提示可能存在脊柱侧弯风险，建议专业筛查。 |

---

### 3.3 运动能力类

#### R008 - 髋关节活动度受限综合征

| 字段 | 值 |
|------|-----|
| rule_id | JOINT_HIP_LIMITED_001 |
| name | 髋关节活动度受限 |
| dimensions | sport, health |
| priority | 25 |
| required | 左髋外展受限 或 右髋外展受限 或 左髋内收受限 或 右髋内收受限（至少 2 项受限） |
| optional | 骨盆不稳、FMS 深蹲/跨栏步异常 |
| override_rules | [] |
| evidence_indicators | [HP_01, HP_02, HP_03, HP_04] |
| template | 髋关节多方向活动度受限，可能影响深蹲、步态及下肢动力链。建议进行髋关节灵活性与稳定性训练。 |

---

#### R009 - 颈椎活动度受限

| 字段 | 值 |
|------|-----|
| rule_id | JOINT_CERVICAL_LIMITED_001 |
| name | 颈椎活动度受限 |
| dimensions | sport, health |
| priority | 30 |
| required | 颈椎 6 项活动中至少 3 项受限或异常 |
| optional | 头前引、上交叉综合征 |
| override_rules | [] |
| evidence_indicators | [NC_01, NC_02, NC_03, NC_04, NC_05, NC_06] |
| template | 颈椎多方向活动度受限，可能影响日常转头、运动表现及颈肩舒适度。建议加强颈部柔韧性与深层稳定。 |

---

### 3.4 风险类

#### R010 - 跌倒风险偏高

| 字段 | 值 |
|------|-----|
| rule_id | RISK_FALL_001 |
| name | 跌倒风险偏高 |
| dimensions | health, sport |
| priority | 8 |
| required | 闭眼静态平衡差（C/D 级或 COP 轨迹面积/速度异常）；且（年龄≥60 或 有跌倒史，若数据中有） |
| optional | 睁眼平衡也较差、动态平衡异常 |
| override_rules | [] |
| evidence_indicators | [BL_03, BL_04, BL_05] |
| template | 闭眼平衡能力偏弱，提示本体感觉与稳定性不足，存在一定跌倒风险。建议进行平衡训练并注意日常防跌倒。 |

---

#### R011 - 内脏脂肪风险

| 字段 | 值 |
|------|-----|
| rule_id | RISK_VISCERAL_FAT_001 |
| name | 内脏脂肪风险 |
| dimensions | health |
| priority | 14 |
| required | 内脏脂肪等级 > 10 或 内脏脂肪面积超标 |
| exclude | 腰臀比、体脂率均在正常范围且无其他代谢风险 |
| override_rules | [] |
| evidence_indicators | [BC_16, BC_17] |
| template | 内脏脂肪偏高，与代谢负荷、心血管相关指标需关注相关。建议控制腹部脂肪，增加有氧与核心训练。 |

---

### 3.5 规则汇总表（节选，完整 108 条见 CSV）

**综合征与高风险（priority 4～14）**

| rule_id | 综合结论 | 优先级 | override 对象 |
|---------|----------|--------|---------------|
| SYNDROME_UPPER_LOWER_001 | 上下交叉综合征 | 4 | SYNDROME_UPPER_CROSS_001, SYNDROME_LOWER_CROSS_001 |
| SYNDROME_UPPER_CROSS_001 | 上交叉综合征 | 5 | PT_HEAD_FWD_001, PT_ROUND_SHOULDER_001 |
| SYNDROME_LOWER_CROSS_001 | 下交叉综合征 | 6 | PT_PELVIS_001 |
| TEEN_SCOLIOSIS_RISK_001 | 青少年脊柱侧弯风险 | 7 | - |
| RISK_FALL_001 | 跌倒风险偏高 | 8 | - |
| SPINE_PAIN_RISK_001 | 脊柱负荷风险 | 9 | - |
| OBESITY_CENTRAL_001 | 中心性肥胖 | 10 | - |
| PT_SCOLIOSIS_RISK_001 | 高低肩伴脊柱侧弯风险 | 12 | PT_HIGH_LOW_001 |
| RISK_VISCERAL_FAT_001 | 内脏脂肪风险 | 14 | - |

**异常兜底与单指标（priority 52～98）**

| rule_id | 综合结论 | 说明 |
|---------|----------|------|
| BC_02_SINGLE_001 | 去脂体重异常 | BC_02 单独异常兜底 |
| BC_07_SINGLE_001 | 蛋白质异常 | BC_07 单独异常兜底 |
| BC_08_SINGLE_001 | 无机盐异常 | BC_08 单独异常兜底 |
| BC_19_SINGLE_001 | 节段脂肪分布异常 | BC_19 单独异常兜底 |

**正常结论（priority 200）**

| rule_id | 综合结论 | 触发条件 |
|---------|----------|----------|
| NORM_BC_001 | 体成分表现良好 | 体成分模块已测且均正常 |
| NORM_PT_001 | 体态表现良好 | 体态模块已测且均正常 |
| NORM_BW_001 | 体围比例良好 | 体围模块已测且均正常 |
| NORM_JOINT_001 | 关节活动度良好 | 肩/髋/颈功能已测且均正常 |
| NORM_SPINE_001 | 脊柱状态良好 | 脊柱模块已测且均正常 |
| NORM_FMS_001 | FMS 动作模式良好 | FMS 已测项目均正常 |
| NORM_FT_001 | 体适能表现良好 | 体适能已测项目均正常 |
| NORM_BALANCE_001 | 平衡能力良好 | 平衡模块已测且均正常 |
| NORM_BUTTOCK_001 | 臀型理想 | BT_01 为蜜桃臀或圆形臀 |
| NORM_FULL_001 | 整体表现优秀 | 所有已测模块均无异常 |

---

## 四、优先级逻辑

### 4.1 优先级数值规则

- **4～14**：综合征/高风险结论，优先输出
- **15～50**：体成分、体态、关节等综合结论
- **51～98**：单一体态/单指标兜底
- **200**：正常结论（仅在某维度无异常时触发）

### 4.2 匹配时的优先级处理

1. 按 `priority` 升序遍历规则
2. 若规则 A 命中，且 `override_rules` 包含规则 B，则**后续**规则 B 不再参与输出（其涉及指标视为已被 A 覆盖）
3. 同一指标可参与多个综合结论，但若被高优先级结论覆盖，则不再单独输出

### 4.3 正常结论触发逻辑

1. 先执行异常规则匹配（priority 4～98）
2. 若某维度（如体成分、体态、运动能力）**无任何异常结论命中**，且该维度有已测指标
3. 则输出对应的 NORM_* 正常结论（priority=200）
4. 若所有维度均无异常，可输出 NORM_FULL_001「整体表现优秀」

### 4.4 示例

- 用户数据：头前引异常 + 左圆肩异常 + 右圆肩异常  
- 命中：R004 上交叉综合征（priority=5），override_rules 含 PT_HEAD_FWD_001  
- 结果：输出「上交叉综合征」，不再单独输出「头前引」

---

## 五、去重逻辑

### 5.1 指标覆盖去重

| 场景 | 处理 |
|------|------|
| 指标 A 参与综合结论 X | A 不再进入单指标兜底池 |
| 指标 A 参与综合结论 X、Y | 正常，A 可为多个结论提供证据，但单指标池仅保留一份 |
| 结论 X override 结论 Y，且 Y 的指标与 X 重叠 | Y 不输出，重叠指标视为被 X 覆盖 |

### 5.2 结论去重

| 场景 | 处理 |
|------|------|
| 同一规则多次命中 | 只输出一次 |
| 多规则命中且无 override 关系 | 按 priority 排序后均输出 |
| 多规则命中且有 override 关系 | 仅输出高优先级结论，被 override 的不输出 |

### 5.3 维度内排序

同一维度内多个综合结论的展示顺序：
1. 按 `priority` 升序
2. 同优先级时，按 `dimensions` 中该维度首次出现顺序
3. 健康问题 > 形体美学 > 运动能力（默认）

---

## 六、配置存储建议

### 6.1 存储格式（YAML 示例）

```yaml
version: "1.0"
rules:
  - rule_id: OBESITY_CENTRAL_001
    name: 中心性肥胖
    dimensions: [health, aesthetic]
    priority: 10
    required:
      - indicator: BC_15
        condition: in_range
        params: { male: [18.5, 24.9], female: [18.5, 24.9] }
      - indicator: BC_12
        condition: exceed
        params: { male: 0.9, female: 0.85 }
    exclude: []
    override_rules: []
    evidence_indicators: [BC_15, BC_12]
    template: "体型呈中心性肥胖特征..."

  - rule_id: SYNDROME_UPPER_CROSS_001
    name: 上交叉综合征
    dimensions: [health, aesthetic, sport]
    priority: 5
    required:
      - indicator: PT_01
        condition: abnormal
      - indicator_group: round_shoulder  # 自定义组：左圆肩 OR 右圆肩 至少一侧异常
        condition: any_abnormal
    override_rules: [PT_HEAD_FWD_001, PT_ROUND_SHOULDER_001]
    evidence_indicators: [PT_01, PT_04, PT_05]
    template: "头颈前移伴圆肩，符合上交叉综合征表现..."
```

### 6.2 版本与审计

- 规则库支持版本号（如 1.0、1.1）
- 每次解读请求记录使用的规则版本
- 规则变更需评审，必要时 A/B 测试

---

## 七、扩展指南

### 7.1 新增综合结论

1. 确定结论名称、所属维度、必要/可选/排除条件
2. 设定 priority，并明确 override_rules（若有）
3. 编写 template 与 evidence_indicators
4. 加入规则库，回归测试

### 7.2 新增指标参与规则

1. 在 `Indicator_Base` 中确保指标已定义
2. 在相应规则的 required/optional/evidence_indicators 中引用
3. 注意与现有规则的优先级与覆盖关系

### 7.3 规则冲突排查

- 当两个规则的必要条件有重叠时，通过 priority 与 override_rules 明确先后
- 若新规则与现有规则逻辑冲突，需同步调整 override_rules 或 priority

### 7.4 医疗用词规范

公司无医疗资质，结论模板须避免：诊断、确诊、治疗、物理治疗、咨询医生、疾病、病症等。完整禁用词表与表述原则见 PRD 8.4。

### 7.5 无法输出结论的场景

当报告无数据、指标不在规则库、规则无匹配等场景时，系统不输出解读结论，而是返回固定兜底话术。完整场景清单、处理流程与兜底话术见 PRD 8.3。

---

## 八、附录

### 8.1 condition 枚举说明

| condition | 说明 | params 示例 |
|-----------|------|-------------|
| abnormal | 该指标判定为异常 | - |
| in_range | 在参考范围内 | `range: [min, max]` 或 `gender_based` |
| exceed | 超过阈值 | `threshold: 0.9` 或 `gender_based` |
| below | 低于阈值 | 同上 |
| bilateral_abnormal | 双侧均异常（如左右圆肩） | - |
| any_abnormal | 同组指标中至少一个异常 | `group: [id1, id2]` |
| count_abnormal | N 个中至少 M 个异常 | `total: 6, min: 3` |

### 8.2 规则类型标识（conclusion_type）

| 值 | 说明 |
|----|------|
| abnormal | 异常结论（默认，priority 4～98） |
| normal | 正常结论（priority 200） |

匹配逻辑：先匹配 abnormal，若无命中则匹配 normal；若两者均无且为「无法输出」场景，则返回 PRD 8.3 中的兜底话术。

### 8.3 指标覆盖度参考

| 模块 | 指标 | 覆盖规则 |
|------|------|----------|
| 体成分 | BC_01~BC_19 | 多数有综合或单指标规则；BC_02/07/08/19 有单独兜底 |
| 体态 | PT_01~PT_13 | 全项覆盖 |
| 体围/腰腹 | BW_01~BW_14, WA_01~WA_12 | 全项覆盖 |
| 肩/髋/颈 | SH_01~04, HP_01~04, NC_01~06 | 全项覆盖 |
| 脊柱/臀型/营养 | SP, BT, NU | 全项覆盖 |
| FMS/体适能/平衡 | FMS_01~10, FT_01~10, BL_01~28 | 全项覆盖 |

---

**版本记录**

| 版本 | 日期 | 说明 |
|------|------|------|
| V1.0 | 2026-02-04 | 初稿，含 11 条规则 |
| V1.1 | 2026-02-04 | 完整 108 条规则：医疗用词修正、异常兜底(BC_02/07/08/19)、正常结论(NORM_*) |
