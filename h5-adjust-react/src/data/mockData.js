export const homeMock = {
  dataQuality: {
    hasConflict: true,
    conflictNotes: ["腰臀比原始值与 AI 文案冲突", "臀型分类口径不一致，已隐藏冲突文案"],
  },
  user: {
    id: "u-1001",
    name: "李若希",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop",
    height: "181cm",
    age: 37,
    latestAssessmentTime: "2026-03-21 19:20",
  },
  latestReport: {
    reportId: "r-9981",
    title: "最新评估结果",
    headline: "体态表现整体可控，但代谢风险和下肢稳定仍需优先处理",
    oneLineConclusion: "打开首页先看到模型、评分和最关键的 3 条结果，再决定往下看哪一部分。",
    priorityAdvice: "先做下肢稳定训练与恢复管理，再持续推进减脂与核心控制。",
    summary:
      "本次综合评分 82 分，体态控制优于上次，但核心稳定性和膝关节负荷仍有中等风险，建议优先进行下肢稳定训练与恢复管理。",
    score: 82,
    bodyCompositionScore: 73,
    postureScore: 84,
<<<<<<< HEAD
=======
    sectionScores: [
      { label: "体态", score: 84 },
      { label: "成分", score: 73 },
      { label: "脊柱", score: 57 },
      { label: "平衡", score: 84 },
      { label: "臀型", score: 78 },
    ],
>>>>>>> f1ef4b3 (Update HTML structure and styles for PRO权益与积分 page; remove unused CSS and optimize layout. Update .DS_Store files.)
    riskLevel: "medium",
    conclusionShort: "您目前体成分状况一般，体脂率偏高，体重正常。体态状况良好，但存在头前引、头侧歪、高低肩风险。",
    quickMetrics: [
      { icon: "⚖", label: "体重", value: "82.8 kg" },
      { icon: "◔", label: "体脂率", value: "24 %" },
      { icon: "💪", label: "肌肉量", value: "59.9 kg" },
    ],
    coreResultsText: [
      "头前引异常（9.2°），建议优先进行颈肩放松与姿态纠正。",
      "内脏脂肪偏高，需结合有氧与抗阻训练做减脂干预。",
      "下肢稳定能力下降，建议增加核心与单腿控制训练。",
    ],
    coreResults: [
      { id: "cr-1", label: "体态评分", value: "92 分", tone: "good", note: "较上次更稳" },
      { id: "cr-2", label: "内脏脂肪", value: "偏高", tone: "danger", note: "腹部围度仍高" },
      { id: "cr-3", label: "膝关节负荷", value: "中风险", tone: "warning", note: "优先稳髋膝链" },
    ],
    fullReportUrl: "/report/full/r-9981",
  },
  model3d: {
    hasModel: true,
    coverImage: "/assets/body-model.png",
    modelUrl: "/model/r-9981",
    focusLabel: "三维结果总览",
    caption: "三维模型作为首页主视觉，先看整体结果，再进入具体分项。",
  },
  highlights: {
    issues: [
      {
        id: "i-1",
        title: "内脏脂肪偏高",
        summary: "腰臀比 0.95、腰围 98cm、臀围 100.8cm、体脂率 28.6%。提示腹部脂肪堆积与代谢风险上升。",
        targetReportId: "body",
      },
      {
        id: "i-2",
        title: "关键解决点（来自报告）",
        summary: "需要通过纠正不良姿势改善核心稳定性；结合高强度间歇训练与抗阻训练降低腹部脂肪；重点强化深层肌群以缓解代谢负担。",
        targetReportId: "body",
      },
    ],
    strengths: [
      {
        id: "s-1",
<<<<<<< HEAD
        title: "训练可执行性高",
        summary: "给出了明确的有氧频次、抗阻与核心动作建议，适合直接进入训练计划执行。",
        targetReportId: "training",
=======
        title: "肌肉量处于正常区间",
        summary: "肌肉量 59.9kg，基础代谢维持能力较好，建议继续保持每周 2 次抗阻训练。",
        targetReportId: "full-report",
      },
      {
        id: "s-2",
        title: "平衡能力具备良好基础",
        summary: "闭眼静态平衡评估等级为 A，神经-肌肉协同基础不错，建议继续巩固。",
        targetReportId: "full-report",
      },
      {
        id: "s-3",
        title: "脊柱胸腰段整体可控",
        summary: "胸椎轻度偏移、腰椎维持正常，说明姿势问题可通过训练持续改善。",
        targetReportId: "full-report",
>>>>>>> f1ef4b3 (Update HTML structure and styles for PRO权益与积分 page; remove unused CSS and optimize layout. Update .DS_Store files.)
      },
    ],
  },
  subReports: [
    {
      id: "sr-1",
      name: "体态评估",
      status: "warning",
      summary: "头前引异常，骨盆前移需关注",
      url: "/report/posture",
      detail: {
        score: 92,
        modelImage: "/assets/posture-detail.png",
        findings: [
          { name: "头前引", value: "9.2", status: "danger", note: "异常" },
          { name: "头侧屈", value: "1.1", status: "normal", note: "正常" },
          { name: "骨盆前/后移", value: "3.0", status: "warning", note: "骨盆前移" },
          { name: "髋/膝角度", value: "L 180.8° · R 184.4°", status: "warning", note: "轻度不对称" },
        ],
        conclusion: "您的体态状况良好，但存在头前引与骨盆前移的可能代偿。",
        suggestion: "请优先进行颈肩放松与核心稳定训练，配合髋屈肌拉伸与臀中肌激活。",
      },
    },
    {
      id: "sr-2",
      name: "身体成分",
      status: "danger",
      summary: "内脏脂肪偏高，需重点干预",
      url: "/report/body",
      detail: {
        heroImage: "/assets/report-detail.png",
        keyMetrics: [
          { label: "腰臀比", value: "0.95", status: "danger" },
          { label: "中腰围", value: "98cm", status: "danger" },
          { label: "高腰围", value: "100.8cm", status: "danger" },
          { label: "体脂率", value: "28.6%", status: "danger" },
        ],
        conclusion: "内脏脂肪偏高，与腹部脂肪堆积和代谢风险提升密切相关。",
        suggestion: "建议每周 5 次中等强度有氧（40 分钟），结合抗阻训练与核心训练，连续 4 周进行阶段复测。",
      },
    },
    {
      id: "sr-3",
      name: "关节功能",
      status: "warning",
      summary: "下肢稳定性需加强，注意负荷管理",
      url: "/report/joint",
      detail: {
        keyMetrics: [
          { label: "单腿稳定", value: "下降 12%", status: "warning" },
          { label: "膝部负荷", value: "中风险", status: "warning" },
          { label: "髋控制", value: "待提升", status: "warning" },
        ],
        conclusion: "膝关节稳定性偏弱，建议以髋-膝-踝联动为核心进行强化。",
        suggestion: "优先臀中肌与腘绳肌激活，控制训练量，避免连续高冲击动作。",
      },
    },
    {
      id: "sr-4",
      name: "脊柱评估",
      status: "normal",
      summary: "生理曲度整体可控，建议维持",
      url: "/report/spine",
      detail: {
        keyMetrics: [
          { label: "颈椎前凸", value: "正常", status: "normal" },
          { label: "胸椎后凸", value: "轻度", status: "warning" },
          { label: "腰椎前凸", value: "稳定", status: "normal" },
        ],
        conclusion: "脊柱整体曲度基本稳定，可通过核心训练维持。",
        suggestion: "每周 3 次稳定性训练，并减少久坐姿势维持时间。",
      },
    },
    {
      id: "sr-5",
      name: "平衡能力",
      status: "warning",
      summary: "静态平衡下降，建议纳入周计划",
      url: "/report/balance",
      detail: {
        keyMetrics: [
          { label: "单腿站立", value: "26s", status: "warning" },
          { label: "动态平衡", value: "中等", status: "warning" },
          { label: "左右差异", value: "偏高", status: "warning" },
        ],
        conclusion: "平衡能力对下肢稳定影响明显，建议优先处理。",
        suggestion: "每周增加 2 次平衡专项，包含单腿控制与核心抗旋训练。",
      },
    },
    {
      id: "sr-6",
      name: "围度与臀型",
      status: "danger",
      summary: "腹部围度偏高，需持续减脂管理",
      url: "/report/hip-shape",
      detail: {
        keyMetrics: [
          { label: "腰围", value: "98cm", status: "danger" },
          { label: "臀围", value: "100.8cm", status: "warning" },
          { label: "臀腰差", value: "2.8cm", status: "warning" },
        ],
        conclusion: "腹部围度异常是当前核心风险，需减脂与姿态协同管理。",
        suggestion: "优先有氧+抗阻组合，并 2 周复测围度变化。",
      },
    },
  ],
  trends: [
<<<<<<< HEAD
    { metricName: "综合评分", currentValue: "82", previousValue: "77", trend: "up" },
    { metricName: "体脂率", currentValue: "22.9%", previousValue: "24.6%", trend: "down" },
    { metricName: "骨盆前倾角", currentValue: "14.3°", previousValue: "15.8°", trend: "down" },
=======
    { metricName: "综合评分", currentValue: "82", previousValue: "77", trend: "up", points: [71, 74, 77, 80, 82] },
    { metricName: "体脂率", currentValue: "22.9%", previousValue: "24.6%", trend: "down", points: [27.1, 26.2, 25.4, 24.6, 22.9] },
    { metricName: "骨盆前倾角", currentValue: "14.3°", previousValue: "15.8°", trend: "down", points: [17.2, 16.5, 16.1, 15.8, 14.3] },
>>>>>>> f1ef4b3 (Update HTML structure and styles for PRO权益与积分 page; remove unused CSS and optimize layout. Update .DS_Store files.)
  ],
  nextActions: [
    { id: "na-1", type: "training", title: "查看训练大纲详情", summary: "先理解阶段目标与周度路线，再进入训练计划执行。", url: "/training/outline/latest" },
    { id: "na-2", type: "diet", title: "控制日摄入结构", summary: "每日蛋白优先，减少高糖零食和夜宵摄入。", url: "/tips/diet" },
    { id: "na-3", type: "retest", title: "建议 2 周后复测", summary: "用于验证关节功能阶段性改善情况。", url: "/retest" },
  ],
  trainingEntry: {
    status: "outline_only",
    planId: "plan-202603",
    stageName: "训练大纲已生成",
    progressText: "先看目标与路线，再开始执行",
    entryText: "查看训练大纲",
    url: "/training/outline/latest",
  },
};

export const myMock = {
  user: {
    name: "李若希",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop",
    phone: "138****1792",
    memberLevel: "Pro Member",
  },
  training: {
    outlineUrl: "/training/outline",
    planUrl: "/training/plan-202603",
    progressSummary: "已生成 8 周训练大纲，计划执行进度 57%",
  },
  reports: { historyUrl: "/reports/history", latestCount: 32 },
  tools: [
    { name: "健康档案", url: "/profile/health" },
    { name: "设置", url: "/settings" },
    { name: "测试帮助", url: "/help/test" },
    { name: "意见反馈", url: "/feedback" },
  ],
};

export const outlineMock = {
  outline: {
    periodWeeks: 8,
    frequencyPerWeek: 3,
    currentWeek: 3,
    coreGoal: "降低内脏脂肪与腹部围度，提升核心稳定",
    expectedChange: "4~8 周可见围度与体态改善",
    targets: [
      { id: "tg1", type: "health", title: "降低内脏脂肪风险", value: "体脂率 28.6% → 25.5%" },
      { id: "tg2", type: "posture", title: "改善头前引/骨盆前移", value: "体态评分 92 → 95+" },
      { id: "tg3", type: "fitness", title: "提升下肢稳定能力", value: "单腿稳定 +20%" },
    ],
    phases: [
      { id: "p1", name: "阶段1 适应激活", weeks: "第1-2周", goal: "建立活动习惯与基础控制", benefit: "减少代偿，提升可执行性", gate: "每周完成≥2次训练" },
      { id: "p2", name: "阶段2 减脂强化", weeks: "第3-6周", goal: "有氧+抗阻协同减脂", benefit: "围度下降与代谢改善", gate: "核心动作稳定且疲劳可控" },
      { id: "p3", name: "阶段3 巩固定型", weeks: "第7-8周", goal: "稳定体态与维持成果", benefit: "减少反弹并形成长期习惯", gate: "关键指标持续改善" },
    ],
    weekSummaries: [
      { week: 1, focus: "动作学习与节奏建立", expected: "可完成基础动作流程", retestHint: "无需复测" },
      { week: 2, focus: "核心激活+拉伸", expected: "腰背紧张下降", retestHint: "可记录主观疲劳" },
      { week: 3, focus: "有氧耐力提升", expected: "心肺耐受上升", retestHint: "记录心率恢复" },
      { week: 4, focus: "抗阻训练增加", expected: "围度开始变化", retestHint: "建议围度复测" },
      { week: 5, focus: "核心稳定强化", expected: "平衡性改善", retestHint: "观察单腿稳定" },
      { week: 6, focus: "下肢控制提升", expected: "膝部负荷下降", retestHint: "建议功能复测" },
      { week: 7, focus: "巩固动作质量", expected: "代偿减少", retestHint: "复盘动作完成率" },
      { week: 8, focus: "形成长期计划", expected: "稳定维持阶段", retestHint: "建议综合复测" },
    ],
    disclaimer: "该方案基于当前评估结果自动生成，仅作训练建议，不替代医疗诊疗。",
  },
};

export const trainingMock = {
  plan: {
    id: "plan-202603",
    name: "核心稳定与体态强化计划",
    goal: "降低膝关节负荷，改善骨盆前倾，提升综合稳定性",
    duration: "8 周",
    currentStage: "第 2 阶段 · 减脂强化",
    progress: 0.57,
    status: "in_progress",
  },
  weeks: ["第1周", "第2周", "第3周", "第4周", "第5周", "第6周", "第7周", "第8周"],
  days: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  dayTypeMap: {
    周一: "power",
    周二: "cardio",
    周三: "recovery",
    周四: "power",
    周五: "cardio",
    周六: "mobility",
    周日: "rest",
  },
  trainingTabs: {
    train: [
      { id: "t-1", name: "臀桥激活", sets: "4 组 x 12 次", duration: "12 分钟", status: "pending", equip: "弹力带", tips: "保持骨盆中立，避免腰部塌陷" },
      { id: "t-2", name: "单腿平衡控制", sets: "3 组 x 45 秒", duration: "10 分钟", status: "done", equip: "无", tips: "膝盖与脚尖同向，避免内扣" },
      { id: "t-3", name: "侧向弹力带行走", sets: "3 组 x 15 步", duration: "8 分钟", status: "pending", equip: "弹力带", tips: "重心稳定，不耸肩" },
    ],
    diet: {
      kcal: 1850,
      macro: { protein: 120, carb: 180, fat: 60 },
      water: "2000ml",
      meals: [
        { id: "m1", name: "早餐", desc: "鸡蛋 + 燕麦 + 无糖酸奶", kcal: 420 },
        { id: "m2", name: "午餐", desc: "鸡胸肉 + 糙米 + 西兰花", kcal: 620 },
        { id: "m3", name: "晚餐", desc: "三文鱼 + 南瓜 + 菠菜", kcal: 530 },
      ],
      disclaimer: "饮食目标为推荐值，不代表实际摄入记录。",
    },
    review: {
      expected: "围度有机会下降 0.5~1.5cm，心肺耐受改善",
      normalFluctuation: "体重短期波动属于正常现象，重点看围度和动作质量",
      retestTime: "建议第4周末进行阶段复测",
      focusMetrics: "体脂率、腰围、单腿稳定时间、头前引角度",
    },
  },
};
