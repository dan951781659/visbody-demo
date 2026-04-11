export const roles = {
  hq: {
    label: "总部端 PC",
    principle: "总部看对比和风险",
    pages: [
      { key: "overview", label: "经营总览", subtitle: "多门店规模、闭环与风险一屏判断" },
      { key: "stores", label: "门店分析", subtitle: "看下级门店增长、承接和风险差异" }
    ]
  },
  owner: {
    label: "馆主端 PC",
    principle: "馆主看承接和复测",
    pages: [
      { key: "overview", label: "经营总览", subtitle: "看承接缺口、复测推进和重点动作" },
      { key: "analysis", label: "经营分析", subtitle: "看重点人群、教练差异和数据质量" }
    ]
  },
  coach: {
    label: "教练端 PC",
    principle: "教练看待办和转化",
    pages: [
      { key: "workbench", label: "工作台", subtitle: "看今日跟进、复测和流失预警" },
      { key: "member", label: "会员工作", subtitle: "围绕负责会员做复测和转化推进" }
    ]
  }
};

export const dateOptions = [
  { key: "7d", label: "近 7 天" },
  { key: "30d", label: "近 30 天" },
  { key: "90d", label: "近 90 天" },
  { key: "all", label: "累计" }
];

export const groupOptions = ["全部门店组", "华东", "华北", "华南", "西南"];
export const coachOptions = ["全部教练", "陈教练", "李教练", "王教练", "未分配"];
