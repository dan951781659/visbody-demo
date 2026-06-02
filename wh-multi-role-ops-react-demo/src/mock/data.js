export const hqStoreRows = [
  {
    id: "s1",
    name: "静安旗舰店",
    group: "华东",
    newGrowth: "+16%",
    activeGrowth: "+11%",
    retestRate: "22.8%",
    unassignedRatio: "4.1%",
    riskRatio: "8.2%",
    retestDue: 34,
    archive: "91%",
    pendingBind: 4,
    aiCoverage: "64%",
    outlineRate: "52%",
    status: "标杆门店",
    tone: "green",
    note: "复测推进和 AI 使用都领先，适合做复制模板。"
  },
  {
    id: "s2",
    name: "海淀大学店",
    group: "华北",
    newGrowth: "-4%",
    activeGrowth: "-7%",
    retestRate: "10.4%",
    unassignedRatio: "13.9%",
    riskRatio: "18.4%",
    retestDue: 51,
    archive: "76%",
    pendingBind: 11,
    aiCoverage: "28%",
    outlineRate: "19%",
    status: "高风险门店",
    tone: "red",
    note: "承接和复测均偏弱，风险占比高，需要总部介入。"
  },
  {
    id: "s3",
    name: "天河店",
    group: "华南",
    newGrowth: "+9%",
    activeGrowth: "+6%",
    retestRate: "17.2%",
    unassignedRatio: "6.2%",
    riskRatio: "11.3%",
    retestDue: 26,
    archive: "88%",
    pendingBind: 5,
    aiCoverage: "49%",
    outlineRate: "37%",
    status: "稳态增长",
    tone: "blue",
    note: "整体稳定，复测与 AI 渗透仍有提升空间。"
  },
  {
    id: "s4",
    name: "高新店",
    group: "西南",
    newGrowth: "+13%",
    activeGrowth: "+9%",
    retestRate: "15.6%",
    unassignedRatio: "9.8%",
    riskRatio: "9.6%",
    retestDue: 29,
    archive: "84%",
    pendingBind: 7,
    aiCoverage: "41%",
    outlineRate: "34%",
    status: "承接偏弱",
    tone: "orange",
    note: "增长不错，但待分配和待绑定偏高，承接链路有断点。"
  }
];

export const ownerActionRows = [
  {
    id: "o1",
    user: "李梦瑶",
    coach: "陈教练",
    tag: "待复测",
    reason: "距上次测评 28 天，已执行 3 周",
    action: "安排复测",
    tone: "orange",
    latest: "2026-03-14",
    proNote: "训练大纲执行中"
  },
  {
    id: "o2",
    user: "王哲",
    coach: "李教练",
    tag: "流失风险",
    reason: "46 天无行为，AI 解读后未跟进",
    action: "优先唤醒",
    tone: "red",
    latest: "2026-02-24",
    proNote: "AI 解读已生成"
  },
  {
    id: "o3",
    user: "陈可欣",
    coach: "陈教练",
    tag: "高潜转化",
    reason: "近 10 天测评完成，尚未进入执行中大纲",
    action: "推进转化",
    tone: "blue",
    latest: "2026-04-05",
    proNote: "尚未生成训练大纲"
  },
  {
    id: "o4",
    user: "赵晨",
    coach: "王教练",
    tag: "档案缺失",
    reason: "健康档案缺运动目标和饮食偏好",
    action: "补档",
    tone: "gray",
    latest: "2026-04-07",
    proNote: "可提升大纲可用性"
  }
];

export const coachMembers = [
  {
    id: "c1",
    name: "李梦瑶",
    goal: "减脂塑形",
    status: "待复测",
    tone: "orange",
    latest: "2026-03-14",
    risk: "低",
    ai: "已解读",
    outline: "执行中",
    note: "本周适合推进复测，腰围已连续下降。"
  },
  {
    id: "c2",
    name: "王哲",
    goal: "健康管理",
    status: "流失风险",
    tone: "red",
    latest: "2026-02-24",
    risk: "高",
    ai: "已解读",
    outline: "未执行",
    note: "46 天未活跃，建议优先唤醒。"
  },
  {
    id: "c3",
    name: "陈可欣",
    goal: "体态改善",
    status: "高潜转化",
    tone: "blue",
    latest: "2026-04-05",
    risk: "中",
    ai: "未解读",
    outline: "未生成",
    note: "近 10 天新测评用户，转化窗口最佳。"
  },
  {
    id: "c4",
    name: "赵晨",
    goal: "增肌",
    status: "持续改善",
    tone: "green",
    latest: "2026-03-30",
    risk: "低",
    ai: "已解读",
    outline: "执行中",
    note: "同类报告连续改善 2 次，可沉淀为案例。"
  }
];

export const initialState = {
  role: "hq",
  page: "overview",
  tier: "pro",
  date: "30d",
  search: "",
  group: "全部门店组",
  coach: "全部教练",
  tag: "全部状态",
  selectedStore: "s2",
  selectedOwner: "o2",
  selectedCoach: "c2"
};
