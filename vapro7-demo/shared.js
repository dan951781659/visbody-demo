const STORAGE_KEY = "vapro7-demo-state";
const MEASUREMENT_CONFIG_KEY = "vapro7-measurement-config";

/** Device-side toggles (PRD §11): localStorage wins over stale URL query. Hub 下发项不在此集合。 */
const DEVICE_PERSISTED_KEYS = new Set([
  "voiceEnabled",
  "bodyCompositionPrepEnabled"
]);

let __vapro7DemoStateMemory = null;
const REPORT_URL = "./report-scan-login.html";
const DEMO_VERSION_FALLBACK = "1.9.4";
const DYNAMIC_LAB_SELECT_HREF = "./single-select.html";

const HOME_TILE_KEYS = [
  "standard",
  "pro",
  "bodyCompSingle",
  "circumferenceSingle",
  "bodycompGirth",
  "girthOnly",
  "dynamicLab",
  "balance",
  "weightStandalone"
];

const RUNTIME_MODE_QUICK = "quick";
const RUNTIME_MODE_PROFESSIONAL = "professional";

const SINGLE_FLOW_PLACEHOLDER_HREF = "./single-flow-placeholder.html";
const LEGACY_BODYCOMP_GIRTH_HREF = "./legacy-bodycomp-girth-prep.html";
const LEGACY_GIRTH_ONLY_HREF = "./legacy-girth-prep.html";

const NEXT_RECOMMEND_DESC = {
  standard: "一圈综合采集",
  pro: "IPose 体态专项",
  bodycompGirth: "一次转台 · 体成分与体围",
  girthOnly: "单体围流程",
  bodyCompSingle: "单项体成分",
  circumferenceSingle: "单体围流程",
  balance: "平衡专项",
  dynamicLab: "动态实验室",
  singleShoulder: "肩部专项",
  singleNeck: "颈部专项"
};

const HOME_SELECT_ILLUSTRATIONS = {
  posture: "./assets/home-select/posture-standing.svg",
  bodyComp: "./assets/home-select/bodycomp-torso.svg",
  generic: "./assets/home-select/generic-measure.svg"
};

const HOME_TILE_META = {
  standard: {
    title: "快速测量",
    displayTitle: "快速测量",
    desc: "体重、体成分、围度、身高一次出结果",
    descLong: "快速测量：体重、体成分、围度、身高、体态一次出结果，适合首次到店用户。",
    benefitDesc: "体重、体成分、围度、身高、体态一次完成",
    gestureHint: "请自然站立 / 保持静止 2 秒",
    illustration: HOME_SELECT_ILLUSTRATIONS.posture,
    recommended: true,
    measurementMode: "standard",
    startSession: true,
    standardFlowEntry: true
  },
  pro: {
    title: "体态测量",
    displayTitle: "体态评估",
    desc: "双手自然垂放，体态结果更准",
    descLong: "IPose 体态专项：双手自然垂放，减少上肢代偿与遮挡，体态评估更准确。",
    benefitDesc: "了解您的头前引、高低肩、腿型等",
    gestureHint: "请自然站立 / 保持静止 2 秒",
    illustration: HOME_SELECT_ILLUSTRATIONS.posture,
    measurementMode: "pro",
    startSession: true
  },
  bodyCompSingle: {
    title: "身体成分测量",
    displayTitle: "身体成分",
    desc: "单项体成分测量流程",
    descLong: "专注体成分单项采集，流程更短，适合只需成分数据的场景。",
    benefitDesc: "了解您的体重、体脂率、肌肉量、身体围度等",
    gestureHint: "先确认准备事项，再站上转台采集",
    illustration: HOME_SELECT_ILLUSTRATIONS.bodyComp,
    measurementMode: "bodyCompSingle",
    startSession: true
  },
  circumferenceSingle: {
    title: "体围测量",
    displayTitle: "体围测量",
    desc: "单项体围采集流程",
    descLong: "专注体围维度单项采集，流程更短，适合只需围度数据的场景。",
    benefitDesc: "了解您的腰围、臀围、四肢围度等",
    gestureHint: "请自然站立 / 保持静止 2 秒",
    illustration: HOME_SELECT_ILLUSTRATIONS.generic,
    measurementMode: "circumferenceSingle",
    startSession: true,
    statefulLink: true
  },
  bodycompGirth: {
    title: "体成分 + 体围",
    displayTitle: "体成分 + 体围",
    desc: "一次转台完成体成分与体围",
    descLong: "一次转台同步完成体成分与体围采集，适合经典分体测量流程。",
    benefitDesc: "一次转台同步完成体成分与体围采集",
    gestureHint: "请握紧扶手 / 双臂展开 45°",
    illustration: HOME_SELECT_ILLUSTRATIONS.bodyComp,
    measurementMode: "bodycompGirth",
    startSession: true
  },
  girthOnly: {
    title: "体围测量",
    displayTitle: "体围测量",
    desc: "单体围采集流程",
    descLong: "专注体围维度采集，流程更短，适合只需围度数据的场景。",
    benefitDesc: "了解您的腰围、臀围、四肢围度等",
    gestureHint: "请自然站立 / 保持静止 2 秒",
    illustration: HOME_SELECT_ILLUSTRATIONS.generic,
    measurementMode: "girthOnly",
    startSession: true
  },
  dynamicLab: {
    title: "动态实验室",
    displayTitle: "动态实验室",
    desc: "肩 · 颈活动度测量",
    descLong: "动态实验室：肩、颈活动度专项评估，可按部位分别测量。",
    benefitDesc: "肩、颈活动度专项评估",
    gestureHint: "请按图示完成肩部或颈部动作",
    illustration: HOME_SELECT_ILLUSTRATIONS.generic,
    measurementMode: "dynamicLab",
    startSession: true
  },
  balance: {
    title: "平衡测量",
    displayTitle: "平衡评估",
    desc: "站稳保持平衡，完成稳定性评估",
    descLong: "站稳转台保持平衡，完成稳定性评估并查看专项结果。",
    benefitDesc: "了解您的平衡稳定性与重心分布",
    gestureHint: "请单脚站立 / 保持平衡 2 秒",
    illustration: HOME_SELECT_ILLUSTRATIONS.generic,
    measurementMode: "balance",
    startSession: true,
    statefulLink: true
  },
  weightStandalone: {
    title: "体重测量",
    displayTitle: "体重测量",
    desc: "独立体重测量流程",
    descLong: "从项目选择页进入的独立体重测量。",
    benefitDesc: "了解您的体重与测量时间",
    gestureHint: "请站上转台完成体重采集",
    illustration: HOME_SELECT_ILLUSTRATIONS.bodyComp,
    measurementMode: "weightStandalone",
    startSession: true,
    statefulLink: true
  }
};

const HOME_SPARSE_TILE_THRESHOLD = 2;

const HOME_TILE_GLYPH = {
  standard: "综合",
  pro: "体态",
  bodyCompSingle: "成分",
  circumferenceSingle: "体围",
  bodycompGirth: "体测",
  girthOnly: "体围",
  dynamicLab: "动态",
  balance: "平衡"
};

const MEASUREMENT_ITEMS = {
  standard: { key: "standard", title: "快速测量", href: "./standard-user-prep.html", group: "standard" },
  pro: { key: "pro", title: "体态测量", href: "./pro-prepare.html", group: "pro" },
  bodyCompSingle: {
    key: "bodyCompSingle",
    title: "身体成分测量",
    href: "./standard-user-prep.html",
    group: "bodyCompSingle"
  },
  circumferenceSingle: {
    key: "circumferenceSingle",
    title: "体围测量",
    href: LEGACY_GIRTH_ONLY_HREF,
    group: "circumferenceSingle"
  },
  bodycompGirth: { key: "bodycompGirth", title: "体成分 + 体围", href: LEGACY_BODYCOMP_GIRTH_HREF, group: "bodycompGirth" },
  girthOnly: { key: "girthOnly", title: "体围测量", href: LEGACY_GIRTH_ONLY_HREF, group: "girthOnly" },
  dynamicLab: { key: "dynamicLab", title: "动态实验室", href: DYNAMIC_LAB_SELECT_HREF, group: "dynamicLab" },
  balance: { key: "balance", title: "平衡测量", href: "./single-prepare-balance.html", group: "balance" },
  weightStandalone: {
    key: "weightStandalone",
    title: "体重测量",
    href: "./weight-standalone-measuring.html",
    group: "weightStandalone"
  },
  singleShoulder: { key: "singleShoulder", title: "肩部测量", href: "./single-prepare-shoulder.html", group: "single" },
  singleNeck: { key: "singleNeck", title: "颈部测量", href: "./single-prepare-neck.html", group: "single" }
};

const ORDER_PRESET_KEYS = {
  "standard-pro-shoulder": ["standard", "pro", "singleShoulder"],
  "legacy-split": ["pro", "bodycompGirth", "girthOnly", "balance"],
  "shoulder-standard-pro": ["singleShoulder", "standard", "pro"],
  "pro-shoulder-standard": ["pro", "singleShoulder", "standard"]
};

const DEFAULT_ORDER_KEYS = ORDER_PRESET_KEYS["standard-pro-shoulder"];

const REPORT_METRIC_VALUES = {
  体重: "56.8 kg",
  身高: "168.2 cm",
  体成分: "体脂率 24.8%",
  体围: "已生成",
  腰腹围度: "腰围 72 cm",
  体态评估: "轻度圆肩",
  脊柱报告: "已分析",
  臀型报告: "已分析",
  体态报告: "轻度圆肩",
  青少年成长报告: "已生成",
  综合评分: "82 分"
};

const DEFAULT_REPORT_VISIBILITY = {
  bodyCompReport: true,
  youthGrowthReport: true,
  postureReport: true,
  spine: true,
  hip: false,
  circumferenceReport: true,
  waistAbdomenReport: true,
  balanceReport: true,
  shoulderReport: true,
  neckReport: true
};

function toBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return undefined;
}

function isWarningMode() {
  return new URLSearchParams(window.location.search).get("autoDetectMode") === "warning";
}

function getMeasurementRuntimeMode(state) {
  const mode = state?.measurementRuntimeMode;
  return mode === RUNTIME_MODE_PROFESSIONAL ? RUNTIME_MODE_PROFESSIONAL : RUNTIME_MODE_QUICK;
}

/** 与 Hub §7.4 一致：快速模式随快速测量、专业模式随身体成分推导是否采高。 */
function deriveHeightMeasurementEnabled(state) {
  if (getMeasurementRuntimeMode(state) === RUNTIME_MODE_PROFESSIONAL) {
    return !!state.bodyCompSingleEnabled;
  }
  return !!state.comprehensiveEnabled;
}

function defaultState() {
  return {
    measurementProfile: "custom",
    measurementRuntimeMode: RUNTIME_MODE_QUICK,
    comprehensiveEnabled: true,
    postureModeEnabled: true,
    bodyCompSingleEnabled: false,
    circumferenceSingleEnabled: false,
    bodycompGirthModeEnabled: false,
    girthOnlyModeEnabled: false,
    balanceModeEnabled: false,
    dynamicLabEnabled: true,
    singleShoulderEnabled: true,
    singleNeckEnabled: true,
    showProEntryAfterStandard: false,
    showSingleEntryAfterStandard: true,
    measurementOrderPreset: "standard-pro-shoulder",
    measurementOrderKeys: [...DEFAULT_ORDER_KEYS],
    homepageQuickSingleItem: "none",
    homeMeasurementOrderKeys: null,
    reportExternalUrl: "",
    voiceEnabled: true,
    bodyCompositionPrepEnabled: true,
    heightMeasurementEnabled: false,
    heightConfirmRequired: false,
    heightResultVisible: true,
    weightStandaloneEnabled: false,
    sessionHeightCm: 165,
    sessionWeightKg: 56.8,
    heightConfirmed: false,
    lastStandaloneWeightAt: null,
    reportVisibility: { ...DEFAULT_REPORT_VISIBILITY },
    currentSessionId: null,
    currentMeasurementMode: "standard",
    completedGroups: {
      standard: false,
      pro: false,
      bodyCompSingle: false,
      circumferenceSingle: false,
      bodycompGirth: false,
      girthOnly: false,
      balance: false,
      singleShoulder: false,
      singleNeck: false
    }
  };
}

function sanitizeHomeOrderKeys(keys) {
  const allowed = new Set(HOME_TILE_KEYS);
  const out = [];
  const seen = new Set();
  (Array.isArray(keys) ? keys : []).forEach((k) => {
    if (!allowed.has(k) || seen.has(k)) return;
    seen.add(k);
    out.push(k);
  });
  return out;
}

function sanitizeOrderKeys(keys) {
  const valid = new Set(Object.keys(MEASUREMENT_ITEMS));
  const list = Array.isArray(keys) ? keys.filter((key) => valid.has(key)) : [];
  return list.length ? list : [...DEFAULT_ORDER_KEYS];
}

function resolveOrderKeys(state) {
  if (state?.measurementOrderKeys?.length) {
    return sanitizeOrderKeys(state.measurementOrderKeys);
  }
  const preset = state?.measurementOrderPreset;
  if (preset && ORDER_PRESET_KEYS[preset]) {
    return [...ORDER_PRESET_KEYS[preset]];
  }
  return [...DEFAULT_ORDER_KEYS];
}

function normalizeState(state) {
  const base = defaultState();
  const merged = { ...base, ...(state || {}) };
  delete merged.autoAdvanceToNextMeasurement;
  delete merged.soundEffectsEnabled;
  if (typeof merged.voiceEnabled !== "boolean") merged.voiceEnabled = true;
  if (typeof merged.bodyCompositionPrepEnabled !== "boolean") merged.bodyCompositionPrepEnabled = true;
  if (typeof merged.heightMeasurementEnabled !== "boolean") merged.heightMeasurementEnabled = false;
  if (typeof merged.heightConfirmRequired !== "boolean") merged.heightConfirmRequired = false;
  merged.heightResultVisible = true;
  if (typeof merged.weightStandaloneEnabled !== "boolean") merged.weightStandaloneEnabled = false;
  if (typeof merged.heightConfirmed !== "boolean") merged.heightConfirmed = false;
  const heightCm = Number(merged.sessionHeightCm);
  merged.sessionHeightCm = Number.isFinite(heightCm) ? Math.min(200, Math.max(130, Math.round(heightCm))) : 165;
  const weightKg = Number(merged.sessionWeightKg);
  merged.sessionWeightKg = Number.isFinite(weightKg) ? Math.round(weightKg * 10) / 10 : 56.8;
  if (merged.lastStandaloneWeightAt != null && typeof merged.lastStandaloneWeightAt !== "string") {
    merged.lastStandaloneWeightAt = null;
  }
  if (typeof merged.measurementProfile !== "string" || !merged.measurementProfile) {
    merged.measurementProfile = "custom";
  }
  merged.measurementRuntimeMode = getMeasurementRuntimeMode(merged);
  if (typeof merged.comprehensiveEnabled !== "boolean") merged.comprehensiveEnabled = true;
  if (typeof merged.postureModeEnabled !== "boolean") {
    merged.postureModeEnabled =
      typeof merged.proModeEnabled === "boolean" ? merged.proModeEnabled : true;
  }
  if (typeof merged.bodycompGirthModeEnabled !== "boolean") merged.bodycompGirthModeEnabled = false;
  if (typeof merged.girthOnlyModeEnabled !== "boolean") merged.girthOnlyModeEnabled = false;
  if (typeof merged.balanceModeEnabled !== "boolean") {
    merged.balanceModeEnabled =
      typeof merged.singleBalanceEnabled === "boolean" ? merged.singleBalanceEnabled : false;
  }
  if (typeof merged.dynamicLabEnabled !== "boolean") {
    merged.dynamicLabEnabled = !!(merged.singleShoulderEnabled || merged.singleNeckEnabled);
  }
  delete merged.proModeEnabled;
  delete merged.singleBalanceEnabled;
  const legacySingle =
    typeof merged.singleModeEnabled === "boolean" ? merged.singleModeEnabled : true;
  if (typeof merged.singleShoulderEnabled !== "boolean") {
    merged.singleShoulderEnabled = legacySingle;
  }
  if (typeof merged.singleNeckEnabled !== "boolean") {
    merged.singleNeckEnabled = legacySingle;
  }
  delete merged.singleModeEnabled;
  if (!ORDER_PRESET_KEYS[merged.measurementOrderPreset]) {
    merged.measurementOrderPreset = "standard-pro-shoulder";
  }
  if (merged.homepageQuickSingleItem === "singleNeck") merged.homepageQuickSingleItem = "neck";
  if (merged.homepageQuickSingleItem === "singleBalance") merged.homepageQuickSingleItem = "balance";
  const validQuick = ["none", "shoulder", "neck", "balance"];
  if (!validQuick.includes(merged.homepageQuickSingleItem)) {
    merged.homepageQuickSingleItem = "none";
  }
  const orderKeys = resolveOrderKeys(merged).map((key) => (key === "singleBalance" ? "balance" : key));
  const uniqOrderKeys = [...new Set(orderKeys)];
  const completedGroups = {
    ...base.completedGroups,
    ...((state && state.completedGroups) || {})
  };
  if (completedGroups.singleBalance && !completedGroups.balance) {
    completedGroups.balance = true;
  }
  delete completedGroups.singleBalance;
  merged.reportVisibility = { ...DEFAULT_REPORT_VISIBILITY, ...(merged.reportVisibility || {}) };
  if (merged.measurementRuntimeMode === RUNTIME_MODE_QUICK) {
    if (merged.comprehensiveEnabled) {
      merged.bodyCompSingleEnabled = false;
      merged.circumferenceSingleEnabled = false;
      merged.postureModeEnabled = false;
      merged.bodycompGirthModeEnabled = false;
      merged.girthOnlyModeEnabled = false;
    }
  } else {
    merged.comprehensiveEnabled = false;
    const anyCoreSingle =
      merged.bodyCompSingleEnabled ||
      merged.circumferenceSingleEnabled ||
      merged.postureModeEnabled ||
      merged.bodycompGirthModeEnabled ||
      merged.girthOnlyModeEnabled;
    if (!anyCoreSingle && merged.postureModeEnabled === undefined) {
      merged.postureModeEnabled = true;
    }
  }
  let homeOrder = null;
  if (Array.isArray(merged.homeMeasurementOrderKeys) && merged.homeMeasurementOrderKeys.length) {
    homeOrder = sanitizeHomeOrderKeys(merged.homeMeasurementOrderKeys);
  }
  if (!homeOrder || !homeOrder.length) homeOrder = null;
  merged.heightMeasurementEnabled = deriveHeightMeasurementEnabled(merged);
  if (getMeasurementRuntimeMode(merged) === RUNTIME_MODE_QUICK) {
    merged.heightConfirmRequired = false;
  } else if (!merged.heightMeasurementEnabled) {
    merged.heightConfirmRequired = false;
  }
  return {
    ...merged,
    measurementOrderKeys: sanitizeOrderKeys(uniqOrderKeys),
    homeMeasurementOrderKeys: homeOrder,
    completedGroups
  };
}

function hubConfigBool(value) {
  if (typeof value === "boolean") return value;
  return toBoolean(value);
}

function mapMeasurementConfigFromWellnessHubDemo() {
  try {
    const raw = localStorage.getItem(MEASUREMENT_CONFIG_KEY);
    if (!raw) return {};
    const cfg = JSON.parse(raw);
    if (!cfg || (cfg.version !== 1 && cfg.version !== 2)) return {};
    const out = {};
    const runtime = cfg.measurementRuntimeMode;
    if (runtime === RUNTIME_MODE_QUICK || runtime === RUNTIME_MODE_PROFESSIONAL) {
      out.measurementRuntimeMode = runtime;
    } else if (cfg.version === 2) {
      out.measurementRuntimeMode = RUNTIME_MODE_QUICK;
    }
    const heightMeas = hubConfigBool(cfg.heightMeasurementEnabled);
    if (typeof heightMeas === "boolean") out.heightMeasurementEnabled = heightMeas;
    const heightConfirm = hubConfigBool(cfg.heightConfirmRequired);
    if (typeof heightConfirm === "boolean") out.heightConfirmRequired = heightConfirm;
    const weightStandalone = hubConfigBool(cfg.weightStandaloneEnabled);
    if (typeof weightStandalone === "boolean") out.weightStandaloneEnabled = weightStandalone;
    const comp = hubConfigBool(cfg.comprehensiveEnabled);
    if (typeof comp === "boolean") out.comprehensiveEnabled = comp;
    const bcs = hubConfigBool(cfg.bodyCompSingleEnabled);
    if (typeof bcs === "boolean") out.bodyCompSingleEnabled = bcs;
    const pos = hubConfigBool(cfg.postureModeEnabled);
    if (typeof pos === "boolean") out.postureModeEnabled = pos;
    const circ = hubConfigBool(cfg.circumferenceSingleEnabled);
    if (typeof circ === "boolean") out.circumferenceSingleEnabled = circ;
    const bal = hubConfigBool(cfg.balanceModeEnabled);
    if (typeof bal === "boolean") out.balanceModeEnabled = bal;
    const sh = hubConfigBool(cfg.singleShoulderEnabled);
    if (typeof sh === "boolean") out.singleShoulderEnabled = sh;
    const nk = hubConfigBool(cfg.singleNeckEnabled);
    if (typeof nk === "boolean") out.singleNeckEnabled = nk;
    if (Object.prototype.hasOwnProperty.call(cfg, 'homeMeasurementOrderKeys')) {
      if (cfg.homeMeasurementOrderKeys === null) {
        out.homeMeasurementOrderKeys = null;
      } else if (Array.isArray(cfg.homeMeasurementOrderKeys) && cfg.homeMeasurementOrderKeys.length) {
        const ho = sanitizeHomeOrderKeys(cfg.homeMeasurementOrderKeys);
        if (ho.length) out.homeMeasurementOrderKeys = ho;
      }
    }
    if (cfg.reportVisibility && typeof cfg.reportVisibility === "object") {
      out.reportVisibility = { ...DEFAULT_REPORT_VISIBILITY, ...cfg.reportVisibility };
    }
    return out;
  } catch {
    return {};
  }
}

function getQueryOverrides() {
  const params = new URLSearchParams(window.location.search);
  const overrides = {};
  const profile = params.get("profile");
  const comprehensive = toBoolean(params.get("comprehensive"));
  const posture = toBoolean(params.get("posture"));
  const bodycompGirth = toBoolean(params.get("bodycompGirth"));
  const girthOnly = toBoolean(params.get("girthOnly"));
  const balance = toBoolean(params.get("balance"));
  const dynamicLab = toBoolean(params.get("dynamicLab"));
  const bodyCompSingle = toBoolean(params.get("bodyCompSingle"));
  const circumferenceSingle = toBoolean(params.get("circumferenceSingle"));
  const quick = params.get("quick");
  const pro = toBoolean(params.get("pro"));
  const single = toBoolean(params.get("single"));
  const singleShoulder = toBoolean(params.get("singleShoulder"));
  const singleNeck = toBoolean(params.get("singleNeck"));
  const singleBalance = toBoolean(params.get("singleBalance"));
  const showProAfterStandard = toBoolean(params.get("showProAfterStandard"));
  const showSingleAfterStandard = toBoolean(params.get("showSingleAfterStandard"));
  const order = params.get("order");
  const voice = toBoolean(params.get("voice"));
  const bodyCompPrep = toBoolean(params.get("bodyCompPrep"));
  const heightMeas = toBoolean(params.get("heightMeas"));
  const heightConfirm = toBoolean(params.get("heightConfirm"));
  const heightVisible = toBoolean(params.get("heightVisible"));
  const weightStandalone = toBoolean(params.get("weightStandalone"));
  const runtimeMode = params.get("runtimeMode");

  if (profile) {
    overrides.measurementProfile = profile;
  }
  if (typeof comprehensive === "boolean") overrides.comprehensiveEnabled = comprehensive;
  if (typeof posture === "boolean") overrides.postureModeEnabled = posture;
  if (typeof bodycompGirth === "boolean") overrides.bodycompGirthModeEnabled = bodycompGirth;
  if (typeof girthOnly === "boolean") overrides.girthOnlyModeEnabled = girthOnly;
  if (typeof balance === "boolean") overrides.balanceModeEnabled = balance;
  if (typeof dynamicLab === "boolean") overrides.dynamicLabEnabled = dynamicLab;
  if (typeof bodyCompSingle === "boolean") overrides.bodyCompSingleEnabled = bodyCompSingle;
  if (typeof circumferenceSingle === "boolean") overrides.circumferenceSingleEnabled = circumferenceSingle;

  if (quick && ["none", "shoulder", "neck", "balance"].includes(quick)) {
    overrides.homepageQuickSingleItem = quick;
  }
  if (typeof pro === "boolean") {
    overrides.postureModeEnabled = pro;
  }
  if (typeof single === "boolean") {
    overrides.singleShoulderEnabled = single;
    overrides.singleNeckEnabled = single;
  }
  if (typeof singleShoulder === "boolean") overrides.singleShoulderEnabled = singleShoulder;
  if (typeof singleNeck === "boolean") overrides.singleNeckEnabled = singleNeck;
  if (typeof singleBalance === "boolean") overrides.balanceModeEnabled = singleBalance;
  if (typeof showProAfterStandard === "boolean") {
    overrides.showProEntryAfterStandard = showProAfterStandard;
  }
  if (typeof showSingleAfterStandard === "boolean") {
    overrides.showSingleEntryAfterStandard = showSingleAfterStandard;
  }
  if (typeof voice === "boolean") {
    overrides.voiceEnabled = voice;
  }
  if (typeof bodyCompPrep === "boolean") {
    overrides.bodyCompositionPrepEnabled = bodyCompPrep;
  }
  if (typeof heightMeas === "boolean") overrides.heightMeasurementEnabled = heightMeas;
  if (typeof heightConfirm === "boolean") overrides.heightConfirmRequired = heightConfirm;
  if (typeof heightVisible === "boolean") overrides.heightResultVisible = heightVisible;
  if (typeof weightStandalone === "boolean") overrides.weightStandaloneEnabled = weightStandalone;
  if (runtimeMode === RUNTIME_MODE_QUICK || runtimeMode === RUNTIME_MODE_PROFESSIONAL) {
    overrides.measurementRuntimeMode = runtimeMode;
  }
  if (order) {
    if (ORDER_PRESET_KEYS[order]) {
      overrides.measurementOrderPreset = order;
      overrides.measurementOrderKeys = [...ORDER_PRESET_KEYS[order]];
    } else if (order.includes(",")) {
      overrides.measurementOrderKeys = sanitizeOrderKeys(order.split(",").map((s) => s.trim()));
    }
  }
  return overrides;
}

function parseSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return __vapro7DemoStateMemory;
    return JSON.parse(raw);
  } catch {
    return __vapro7DemoStateMemory;
  }
}

function applyDevicePersistedFromSaved(merged, saved) {
  if (!saved || typeof saved !== "object") return;
  DEVICE_PERSISTED_KEYS.forEach((key) => {
    if (typeof saved[key] === "boolean") merged[key] = saved[key];
  });
}

function loadState() {
  const fallback = defaultState();
  const hub = mapMeasurementConfigFromWellnessHubDemo();
  const saved = parseSavedState();
  const merged = {
    ...fallback,
    ...(saved && typeof saved === "object" ? saved : {}),
    ...hub,
    ...getQueryOverrides()
  };
  applyDevicePersistedFromSaved(merged, saved && typeof saved === "object" ? saved : null);
  return normalizeState(merged);
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    __vapro7DemoStateMemory = null;
  } catch {
    __vapro7DemoStateMemory = state;
  }
}

function patchTouchesDevicePersisted(patch) {
  return Object.keys(patch).some((k) => DEVICE_PERSISTED_KEYS.has(k));
}

function syncBrowserUrlWithState(state) {
  if (typeof history === "undefined" || !history.replaceState) return;
  try {
    const url = new URL(window.location.href);
    const qs = buildStateQuery(state);
    new URLSearchParams(qs).forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  } catch (_) {
    /* ignore file:// or opaque origins */
  }
}

function patchState(patch) {
  const current = loadState();
  const next = normalizeState({
    ...current,
    ...patch,
    completedGroups: {
      ...current.completedGroups,
      ...(patch.completedGroups || {})
    }
  });
  saveState(next);
  if (patchTouchesDevicePersisted(patch)) {
    syncBrowserUrlWithState(next);
  }
  renderState(next);
  return next;
}

function generateSessionId() {
  return `VP7-${Date.now().toString().slice(-6)}`;
}

function startSession() {
  return patchState({
    currentSessionId: generateSessionId(),
    completedGroups: defaultState().completedGroups
  });
}

function completeGroup(groupKey) {
  const current = loadState();
  return patchState({
    currentSessionId: current.currentSessionId || generateSessionId(),
    completedGroups: {
      ...current.completedGroups,
      [groupKey]: true
    }
  });
}

function isPrimaryItemEnabled(state, itemKey) {
  const s = state || loadState();
  const mode = getMeasurementRuntimeMode(s);
  const comp = !!s.comprehensiveEnabled;
  if (itemKey === "weightStandalone") return !!s.weightStandaloneEnabled;
  if (mode === RUNTIME_MODE_QUICK) {
    if (itemKey === "standard") return comp;
    if (itemKey === "pro" || itemKey === "bodyCompSingle" || itemKey === "circumferenceSingle") {
      return false;
    }
    if (itemKey === "bodycompGirth" || itemKey === "girthOnly") return false;
  } else {
    if (itemKey === "standard" || itemKey === "bodycompGirth" || itemKey === "girthOnly") return false;
    if (itemKey === "pro") return !!s.postureModeEnabled;
    if (itemKey === "bodyCompSingle") return !!s.bodyCompSingleEnabled;
    if (itemKey === "circumferenceSingle") return !!s.circumferenceSingleEnabled;
  }
  if (itemKey === "balance") return !!s.balanceModeEnabled;
  if (itemKey === "dynamicLab") return isDynamicLabVisible(s);
  return false;
}

function isDynamicLabVisible(state) {
  const s = state || loadState();
  if (typeof s.dynamicLabEnabled === "boolean" && !s.dynamicLabEnabled) return false;
  return !!(s.singleShoulderEnabled || s.singleNeckEnabled);
}

function getDynamicLabSubtitle(state) {
  const shoulder = !!state.singleShoulderEnabled;
  const neck = !!state.singleNeckEnabled;
  if (shoulder && neck) return "肩 · 颈活动度专项；进入后请先选择测量部位";
  if (shoulder) return "将直接进入肩部专项测量流程";
  if (neck) return "将直接进入颈部专项测量流程";
  return "活动度测量";
}

function resolveDynamicLabEntryHref(state) {
  const s = state || loadState();
  if (s.singleShoulderEnabled && !s.singleNeckEnabled) return "./single-prepare-shoulder.html";
  if (s.singleNeckEnabled && !s.singleShoulderEnabled) return "./single-prepare-neck.html";
  return DYNAMIC_LAB_SELECT_HREF;
}

function isHomeTileAvailable(state, key) {
  if (key === "dynamicLab") return isDynamicLabVisible(state);
  return isPrimaryItemEnabled(state, key);
}

function getHomeTileHref(key, state) {
  if (key === "standard") return getStandardFlowEntryHref(state);
  if (key === "bodyCompSingle") return "./standard-user-prep.html";
  if (key === "weightStandalone") return "./weight-standalone-measuring.html";
  if (key === "dynamicLab") return resolveDynamicLabEntryHref(state);
  return MEASUREMENT_ITEMS[key]?.href || "#";
}

function getHomeMeasurementTileKeys(state) {
  const s = state || loadState();
  const useHubHomeOrder = Array.isArray(s.homeMeasurementOrderKeys) && s.homeMeasurementOrderKeys.length > 0;
  const order = useHubHomeOrder ? sanitizeHomeOrderKeys(s.homeMeasurementOrderKeys) : resolveOrderKeys(s);
  const tiles = [];
  const seen = new Set();

  function pushTile(key) {
    if (seen.has(key) || !HOME_TILE_KEYS.includes(key)) return;
    if (!isHomeTileAvailable(s, key)) return;
    seen.add(key);
    tiles.push(key);
  }

  order.forEach((key) => {
    if (key === "singleShoulder" || key === "singleNeck") {
      pushTile("dynamicLab");
      return;
    }
    pushTile(key);
  });

  HOME_TILE_KEYS.forEach((key) => pushTile(key));
  return tiles;
}

function getHomeMeasurementTiles(state) {
  const s = state || loadState();
  return getHomeMeasurementTileKeys(s).map((key, index) => {
    const meta = HOME_TILE_META[key] || {};
    const href = getHomeTileHref(key, s);
    const descBase = key === "dynamicLab" ? getDynamicLabSubtitle(s) : meta.desc || "";
    const benefitDesc =
      key === "dynamicLab" ? getDynamicLabSubtitle(s) : meta.benefitDesc || meta.descLong || descBase;
    let gestureHint = meta.gestureHint || "请按图示动作进入测量";
    if (key === "dynamicLab") {
      if (s.singleShoulderEnabled && !s.singleNeckEnabled) {
        gestureHint = "请按图示完成肩部活动度测量";
      } else if (s.singleNeckEnabled && !s.singleShoulderEnabled) {
        gestureHint = "请按图示完成颈部活动度测量";
      }
    }
    return {
      key,
      title: meta.title || MEASUREMENT_ITEMS[key]?.title || key,
      displayTitle: meta.displayTitle || meta.title || MEASUREMENT_ITEMS[key]?.title || key,
      desc: descBase,
      benefitDesc,
      gestureHint,
      illustration: meta.illustration || HOME_SELECT_ILLUSTRATIONS.generic,
      glyph: HOME_TILE_GLYPH[key] || meta.title?.slice(0, 2) || "测量",
      href,
      recommended: !!meta.recommended || index === 0,
      primaryCard: index === 0,
      measurementMode: meta.measurementMode,
      startSession: !!meta.startSession,
      standardFlowEntry: !!meta.standardFlowEntry,
      statefulLink: !!meta.statefulLink
    };
  });
}

function buildMeasureSelectCard(tile, state) {
  const link = document.createElement("a");
  link.className = "measure-select-card";
  link.classList.toggle("measure-select-card--primary", tile.primaryCard);
  link.href = withStateQuery(tile.href, state);
  link.dataset.choiceItem = "";
  link.dataset.choiceLabel = tile.displayTitle || tile.title;
  link.dataset.homeTile = tile.key;
  link.dataset.measureSelectCard = tile.key;

  if (tile.startSession) {
    link.dataset.actionLink = "start-session";
    link.dataset.measurementMode = tile.measurementMode || tile.key;
  }
  if (tile.standardFlowEntry) link.dataset.standardFlowEntry = "";
  if (tile.statefulLink) link.dataset.statefulLink = tile.href;

  const body = document.createElement("div");
  body.className = "measure-select-card__body";

  const copy = document.createElement("div");
  copy.className = "measure-select-card__copy";

  const title = document.createElement("div");
  title.className = "measure-select-card__title";
  title.textContent = tile.displayTitle || tile.title;

  const benefit = document.createElement("div");
  benefit.className = "measure-select-card__benefit";
  benefit.textContent = tile.benefitDesc || tile.desc;

  const hint = document.createElement("div");
  hint.className = "measure-select-card__hint";
  hint.textContent = tile.gestureHint;

  copy.appendChild(title);
  copy.appendChild(benefit);
  copy.appendChild(hint);

  const figure = document.createElement("div");
  figure.className = "measure-select-card__figure";
  const img = document.createElement("img");
  img.src = tile.illustration;
  img.alt = "";
  img.width = 120;
  img.height = 160;
  figure.appendChild(img);

  body.appendChild(copy);
  body.appendChild(figure);
  link.appendChild(body);
  return link;
}

function appendHomeTileContent(link, tile) {
  if (tile.recommended) {
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.textContent = "推荐";
    link.appendChild(tag);
  }

  const title = document.createElement("div");
  title.className = "card-title";
  title.textContent = tile.title;
  link.appendChild(title);

  if (tile.desc) {
    const desc = document.createElement("div");
    desc.className = "card-desc";
    desc.textContent = tile.desc;
    link.appendChild(desc);
  }
}

function isAnyHomeMeasurementEnabled(state) {
  return getHomeMeasurementTileKeys(state || loadState()).length > 0;
}

function isAnyPrimaryEnabled(state) {
  return isAnyHomeMeasurementEnabled(state);
}

function isAnySingleEnabled(state) {
  const s = state || loadState();
  return !!(s.singleShoulderEnabled || s.singleNeckEnabled);
}

function isSingleItemEnabled(state, itemKey) {
  const s = state || loadState();
  if (itemKey === "singleShoulder") return !!s.singleShoulderEnabled;
  if (itemKey === "singleNeck") return !!s.singleNeckEnabled;
  return false;
}

function isQuickSingleAvailable(state, quick) {
  if (!quick || quick === "none") return true;
  if (quick === "shoulder") return !!state.singleShoulderEnabled;
  if (quick === "neck") return !!state.singleNeckEnabled;
  if (quick === "balance") return !!state.balanceModeEnabled;
  return false;
}

function getQuickItemMeta(value) {
  const state = loadState();
  if (!isQuickSingleAvailable(state, value)) return null;
  const map = {
    none: null,
    shoulder: { title: "肩部测量", desc: "抬手完成肩部活动测量", href: "./single-prepare-shoulder.html" },
    neck: { title: "颈部测量", desc: "缓慢转头完成颈部活动测量", href: "./single-prepare-neck.html" },
    balance: { title: "平衡测量", desc: "站稳保持平衡并完成评估", href: "./single-prepare-balance.html" }
  };
  return map[value] || null;
}

function homeTileKeysToFinishOrderKeys(tileKeys, state) {
  const s = state;
  const out = [];
  const seen = new Set();
  (tileKeys || []).forEach((tileKey) => {
    if (tileKey === "dynamicLab") {
      if (s.singleShoulderEnabled && !seen.has("singleShoulder")) {
        seen.add("singleShoulder");
        out.push("singleShoulder");
      }
      if (s.singleNeckEnabled && !seen.has("singleNeck")) {
        seen.add("singleNeck");
        out.push("singleNeck");
      }
      return;
    }
    if (!seen.has(tileKey)) {
      seen.add(tileKey);
      out.push(tileKey);
    }
  });
  return out;
}

function resolveFinishOrderKeys(state) {
  const s = state || loadState();
  if (Array.isArray(s.homeMeasurementOrderKeys) && s.homeMeasurementOrderKeys.length > 0) {
    return homeTileKeysToFinishOrderKeys(getHomeMeasurementTileKeys(s), s);
  }
  return resolveOrderKeys(s);
}

function getMeasurementOrder(state) {
  const s = state || loadState();
  return resolveFinishOrderKeys(s).map((key) => MEASUREMENT_ITEMS[key]).filter(Boolean);
}

function formatOrderPreview(state) {
  return getMeasurementOrder(state)
    .map((item) => item.title)
    .join(" → ");
}

function isMeasurementAvailable(item, state) {
  if (!item) return false;
  const mode = getMeasurementRuntimeMode(state);
  const comp = !!state.comprehensiveEnabled;
  if (item.key === "weightStandalone") return !!state.weightStandaloneEnabled;
  if (mode === RUNTIME_MODE_QUICK) {
    if (item.key === "standard") return comp;
    if (item.key === "pro" || item.key === "bodyCompSingle" || item.key === "circumferenceSingle") {
      return false;
    }
    if (item.key === "bodycompGirth" || item.key === "girthOnly") return false;
  } else {
    if (item.key === "standard" || item.key === "bodycompGirth" || item.key === "girthOnly") return false;
    if (item.key === "pro") return !!state.postureModeEnabled;
    if (item.key === "bodyCompSingle") return !!state.bodyCompSingleEnabled;
    if (item.key === "circumferenceSingle") return !!state.circumferenceSingleEnabled;
  }
  if (item.key === "balance") return !!state.balanceModeEnabled;
  if (item.key === "dynamicLab") return isDynamicLabVisible(state);
  if (item.key === "singleShoulder") return !!state.singleShoulderEnabled;
  if (item.key === "singleNeck") return !!state.singleNeckEnabled;
  return true;
}

function getNextMeasurementRecommendation(currentKey, flow, state) {
  const order = getMeasurementOrder(state);
  const currentIndex = order.findIndex((item) => item.key === currentKey);
  if (currentIndex === -1) return null;

  for (let i = currentIndex + 1; i < order.length; i += 1) {
    const item = order[i];
    if (!isMeasurementAvailable(item, state)) continue;
    if (state.completedGroups[item.key]) continue;
    return item;
  }
  return null;
}

function measurementModeToFinishKey(mode) {
  const key = mode || "standard";
  if (key === "pro") return "pro";
  return key;
}

function finishKeyDisplayName(finishKey) {
  const meta = HOME_TILE_META[finishKey];
  if (meta?.displayTitle) return meta.displayTitle;
  return MEASUREMENT_ITEMS[finishKey]?.title || finishKey;
}

function getRemeasureHref(finishKey, state) {
  if (finishKey === "pro") return "./pro-prepare.html";
  if (finishKey === "circumferenceSingle") return LEGACY_GIRTH_ONLY_HREF;
  if (finishKey === "bodycompGirth") return LEGACY_BODYCOMP_GIRTH_HREF;
  if (finishKey === "balance") return "./single-prepare-balance.html";
  if (finishKey === "singleShoulder") return "./single-prepare-shoulder.html";
  if (finishKey === "singleNeck") return "./single-prepare-neck.html";
  if (finishKey === "bodyCompSingle" || finishKey === "standard") {
    return getStandardFlowEntryHref(state);
  }
  return getHomeTileHref(finishKey, state);
}

function getFinishSummaryRows(state) {
  const finishKey = measurementModeToFinishKey(state.currentMeasurementMode);
  const isPro = getMeasurementRuntimeMode(state) === RUNTIME_MODE_PROFESSIONAL;

  if (isPro) {
    if (finishKey === "bodyCompSingle") {
      const rows = [{ name: "体成分", detail: "已测完" }];
      if (deriveHeightMeasurementEnabled(state)) {
        rows.push({ name: "身高", detail: formatSessionHeight(state) });
      }
      rows.push({ name: "体重", detail: formatSessionWeight(state) });
      return rows;
    }
    if (finishKey === "pro") return [{ name: "体态", detail: "已测完" }];
    if (finishKey === "circumferenceSingle") return [{ name: "体围", detail: "已测完" }];
    if (finishKey === "balance") return [{ name: "平衡", detail: "已测完" }];
    if (finishKey === "singleShoulder") return [{ name: "肩部", detail: "已测完" }];
    if (finishKey === "singleNeck") return [{ name: "颈部", detail: "已测完" }];
  }

  if (finishKey === "standard") {
    const rows = [
      { name: "体成分", detail: "已测完" },
      { name: "体重", detail: formatSessionWeight(state) },
    ];
    if (deriveHeightMeasurementEnabled(state)) {
      rows.push({ name: "身高", detail: formatSessionHeight(state) });
    }
    rows.push({ name: "体态", detail: "已测完" }, { name: "体围", detail: "已测完" });
    return rows;
  }

  return [{ name: finishKeyDisplayName(finishKey), detail: "已测完" }];
}

function renderFinishSummary(container, state) {
  if (!container) return;
  const rows = getFinishSummaryRows(state);
  container.innerHTML = rows
    .map(
      (row) => `
    <div class="summary-check-row">
      <div class="summary-check-main">
        <span class="summary-check-name">${row.name}</span>
        <span class="summary-check-detail">${row.detail || "已测完"}</span>
      </div>
      <span class="summary-check-mark" aria-hidden="true">✓</span>
    </div>`
    )
    .join("");
}

function setupFinishCompletionPage() {
  document.querySelectorAll("[data-gesture-finish-page]").forEach((root) => {
    let state = loadState();
    const finishKey = measurementModeToFinishKey(state.currentMeasurementMode);
    if (finishKey && !state.completedGroups[finishKey]) {
      completeGroup(finishKey);
      state = loadState();
    }

    renderFinishSummary(root.querySelector("[data-finish-summary]"), state);

    const finishGroup = root.querySelector("[data-finish-group]");
    if (finishGroup) {
      finishGroup.dataset.finishCurrent = finishKey;
      finishGroup.dataset.finishFlow =
        getMeasurementRuntimeMode(state) === RUNTIME_MODE_PROFESSIONAL ? "pro" : "standard";
    }

    const recommendation = getNextMeasurementRecommendation(
      finishKey,
      finishGroup?.dataset.finishFlow || "",
      state
    );
    const subtitle = root.querySelector(".screen-subtitle");
    if (subtitle) {
      subtitle.textContent = recommendation
        ? `本次${finishKeyDisplayName(finishKey)}已完成。请举手选择：结束并查看报告，或继续${recommendation.title}。`
        : "请举手选择下一步，或直接点击上方选项进入对应流程。";
    }

    const remeasure = root.querySelector("[data-finish-remeasure]");
    if (remeasure) {
      const href = getRemeasureHref(finishKey, state);
      remeasure.dataset.finishRemeasureKey = finishKey;
      remeasure.setAttribute("href", appendReturnToFromPage(withStateQuery(href, state)));
      remeasure.textContent = `重新测量${finishKeyDisplayName(finishKey)}`;
      if (!remeasure.dataset.finishRemeasureBound) {
        remeasure.dataset.finishRemeasureBound = "1";
        remeasure.addEventListener("click", (event) => {
          event.preventDefault();
          const key = remeasure.dataset.finishRemeasureKey;
          const current = loadState();
          patchState({
            completedGroups: {
              ...current.completedGroups,
              [key]: false
            }
          });
          navigateToTarget(remeasure.getAttribute("href"));
        });
      }
    }
  });

  document.querySelectorAll("[data-measuring-next]").forEach((el) => {
    if (el.dataset.measuringCompleteBound) return;
    el.dataset.measuringCompleteBound = "1";
    el.addEventListener("click", () => {
      const state = loadState();
      const finishKey = measurementModeToFinishKey(state.currentMeasurementMode);
      if (finishKey && !state.completedGroups[finishKey]) {
        completeGroup(finishKey);
      }
    });
  });
}

function getStandardFlowEntryHref(state) {
  const s = state || loadState();
  return s.bodyCompositionPrepEnabled ? "./standard-user-prep.html" : "./standard-bodycomp-prep.html";
}

function buildStateQuery(state) {
  const params = new URLSearchParams();
  params.set("profile", state.measurementProfile || "custom");
  params.set("runtimeMode", getMeasurementRuntimeMode(state));
  params.set("comprehensive", state.comprehensiveEnabled ? "1" : "0");
  params.set("posture", state.postureModeEnabled ? "1" : "0");
  params.set("bodycompGirth", state.bodycompGirthModeEnabled ? "1" : "0");
  params.set("girthOnly", state.girthOnlyModeEnabled ? "1" : "0");
  params.set("balance", state.balanceModeEnabled ? "1" : "0");
  params.set("dynamicLab", state.dynamicLabEnabled ? "1" : "0");
  params.set("bodyCompSingle", state.bodyCompSingleEnabled ? "1" : "0");
  params.set("circumferenceSingle", state.circumferenceSingleEnabled ? "1" : "0");
  params.set("quick", "none");
  params.set("pro", state.postureModeEnabled ? "1" : "0");
  params.set("singleShoulder", state.singleShoulderEnabled ? "1" : "0");
  params.set("singleNeck", state.singleNeckEnabled ? "1" : "0");
  params.set("showProAfterStandard", state.showProEntryAfterStandard ? "1" : "0");
  params.set("showSingleAfterStandard", state.showSingleEntryAfterStandard ? "1" : "0");
  params.set("voice", state.voiceEnabled ? "1" : "0");
  params.set("bodyCompPrep", state.bodyCompositionPrepEnabled ? "1" : "0");
  params.set("heightMeas", state.heightMeasurementEnabled ? "1" : "0");
  params.set("heightConfirm", state.heightConfirmRequired ? "1" : "0");
  params.set("heightVisible", state.heightResultVisible ? "1" : "0");
  params.set("weightStandalone", state.weightStandaloneEnabled ? "1" : "0");
  params.set("order", (state.measurementOrderKeys || DEFAULT_ORDER_KEYS).join(","));
  return params.toString();
}

function resolvePostMeasuringHref(state) {
  const s = state || loadState();
  if (s.heightMeasurementEnabled && s.heightConfirmRequired) {
    return "./height-confirm.html";
  }
  return "./standard-next-step.html";
}

function formatSessionHeight(state) {
  const s = state || loadState();
  return `${s.sessionHeightCm} cm`;
}

function formatSessionWeight(state) {
  const s = state || loadState();
  return `${s.sessionWeightKg} kg`;
}

function showDeviceToast(message, durationMs = 2200) {
  const stage = document.querySelector(".device-stage") || document.body;
  let toast = stage.querySelector("[data-device-toast]");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "device-toast";
    toast.dataset.deviceToast = "";
    toast.setAttribute("role", "status");
    stage.appendChild(toast);
  }
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.add("is-visible");
  if (showDeviceToast._timer) window.clearTimeout(showDeviceToast._timer);
  showDeviceToast._timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.hidden = true;
  }, durationMs);
}

function withStateQuery(target, state) {
  if (!target || target === "#") return target;
  const [path, hash = ""] = target.split("#");
  const [basePath, currentQuery = ""] = path.split("?");
  const params = new URLSearchParams(currentQuery);
  const stateParams = new URLSearchParams(buildStateQuery(state));
  stateParams.forEach((value, key) => params.set(key, value));
  const pageQs = new URLSearchParams(window.location.search);
  if (pageQs.get("demoAuto") === "1") params.set("demoAuto", "1");
  const query = params.toString();
  return `${basePath}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

/** Preserve `returnTo` when navigating between device pages (Demo 总览往返). */
function appendReturnToFromPage(href) {
  if (!href || typeof href !== "string") return href;
  if (/^https?:\/\//i.test(href.trim())) return href;
  const rt = new URLSearchParams(window.location.search).get("returnTo");
  if (!rt || (!rt.startsWith("./") && !rt.startsWith("../"))) return href;
  if (/[?&]returnTo=/.test(href)) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}returnTo=${encodeURIComponent(rt)}`;
}

function resolveDemoBackHref(defaultHref) {
  const rt = new URLSearchParams(window.location.search).get("returnTo");
  if (rt && (rt.startsWith("./") || rt.startsWith("../"))) return rt;
  return defaultHref;
}

function applyMeasurementProfile(profileId) {
  const profiles = {
    "comprehensive-default": {
      comprehensiveEnabled: true,
      postureModeEnabled: true,
      bodycompGirthModeEnabled: false,
      girthOnlyModeEnabled: false,
      balanceModeEnabled: false
    },
    "legacy-split": {
      comprehensiveEnabled: false,
      postureModeEnabled: true,
      bodycompGirthModeEnabled: true,
      girthOnlyModeEnabled: true,
      balanceModeEnabled: true
    },
    "comprehensive-posture": {
      comprehensiveEnabled: true,
      postureModeEnabled: true,
      bodycompGirthModeEnabled: false,
      girthOnlyModeEnabled: false,
      balanceModeEnabled: false
    },
    custom: null
  };
  const profile = profiles[profileId];
  if (!profile) return patchState({ measurementProfile: "custom" });
  return patchState({
    measurementProfile: profileId,
    ...profile
  });
}

function bindConfigControls() {
  document.querySelectorAll("[data-config-key]").forEach((el) => {
    const key = el.getAttribute("data-config-key");
    function onChange() {
      const value = el.type === "checkbox" ? el.checked : el.value;
      if (key === "measurementProfile") {
        applyMeasurementProfile(value);
        return;
      }
      patchState({ [key]: value, measurementProfile: "custom" });
    }
    el.addEventListener("change", onChange);
    if (el.tagName === "INPUT" && el.type !== "checkbox") {
      el.addEventListener("input", onChange);
    }
  });
}

function navigateToTarget(target) {
  if (!target || target === "#") return;
  window.location.href = appendReturnToFromPage(target);
}

/** Demo 默认需手动点击才换页；仅 ?demoAuto=1 时恢复自动跳转（联调用）。 */
function isDemoManualAdvance() {
  return new URLSearchParams(window.location.search).get("demoAuto") !== "1";
}

function isValidReportUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("./") || trimmed.startsWith("../") || trimmed.startsWith("/")) return true;
  return /^https?:\/\//i.test(trimmed);
}

function openReport() {
  const state = loadState();
  const external = state.reportExternalUrl?.trim();
  const target = isValidReportUrl(external) ? external : REPORT_URL;
  navigateToTarget(withStateQuery(target, state));
}

function speakText(text) {
  if (!loadState().voiceEnabled) return;
  if (!text || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 1;
  utterance.pitch = 1;
  window.setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, 180);
}

/** 播完主文案后回调（语音关闭时用估算时长兜底，避免永远不跳转）。 */
function speakTextThen(text, onDone) {
  if (typeof onDone !== "function") return;
  const trimmed = (text || "").trim();
  if (!trimmed) {
    window.requestAnimationFrame(() => {
      onDone();
    });
    return;
  }
  if (!loadState().voiceEnabled || !("speechSynthesis" in window)) {
    const approxMs = Math.min(9000, 900 + trimmed.length * 85);
    window.setTimeout(onDone, approxMs);
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(trimmed);
  utterance.lang = "zh-CN";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.onend = () => {
    window.setTimeout(onDone, 0);
  };
  utterance.onerror = () => {
    window.setTimeout(onDone, 0);
  };
  window.setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, 180);
}

function setupVoice() {
  if (document.querySelector("[data-guide-sequence]")) return;
  if (document.querySelector("[data-measuring-flow]")) return;
  if (document.querySelector("[data-generating-flow]")) return;
  if (document.querySelector("[data-demo-countdown-target]")) return;
  if (document.querySelector("[data-weight-standalone-measuring]")) return;
  if (document.querySelector("[data-auto-detect-next]")) return;
  if (document.querySelector("[data-turntable-anthropometry]")) return;
  const source =
    document.querySelector("[data-voice-text]")?.dataset.voiceText ||
    document.querySelector("[data-live-voice]")?.textContent?.trim() ||
    document.querySelector(".screen-title")?.textContent?.trim();
  if (source) speakText(source);
}

function setupGuideSequence() {
  const stage = document.querySelector("[data-guide-sequence]");
  if (!stage) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get("guideLoop") === "1") {
    setupGuideSequenceLegacyLoop(stage);
    return;
  }

  const phases = [
    {
      id: 1,
      label: "阶段 1/2",
      voice: "请先脱鞋脱袜，并将双脚站稳在脚印位置。",
      subtitle: "站上转台，双脚对准脚印与电机片位置。",
      focus: "请站上转台并对准脚印",
      chipA: "阶段一 · 上台前",
      pose: "pose-boarding",
      sceneClass: "phase-stage-boarding",
      showFeet: true,
      points: [
        { title: "脱鞋脱袜", body: "保持足底可完整接触转台。" },
        { title: "双脚接触脚印", body: "双脚站稳，足底与脚印充分接触。" }
      ]
    },
    {
      id: 2,
      label: "阶段 2/2",
      voice: "请双手握住扶手，双臂展开约四十五度并保持静止。",
      subtitle: "先握扶手，再将双臂展开至约 45°。",
      focus: "请握住扶手并展开双臂",
      chipA: "阶段二 · 扶手姿势",
      pose: "pose-hold",
      sceneClass: "phase-stage-rails",
      showFeet: false,
      points: [
        { title: "双手握住扶手", body: "双手握住扶手，保持手掌充分接触。" },
        { title: "双臂展开 45°", body: "面向屏幕，双臂展开并保持静止。" }
      ]
    }
  ];

  const section = stage.closest("section") || document;
  const subtitleEl = document.querySelector("[data-guide-subtitle]");
  const titleEl = document.querySelector("[data-guide-title]");
  const phaseLabelEl = stage.querySelector("[data-guide-phase-label]");
  const focusEl = stage.querySelector("[data-guide-focus]");
  const humanEl = stage.querySelector("[data-guide-human]");
  const feetEl = stage.querySelector("[data-guide-feet]");
  const circleEl = stage.querySelector("[data-guide-circle]");
  const chipAEl = stage.querySelector("[data-guide-chip-a]");
  const titleAEl = stage.querySelector("[data-guide-point-title-a]");
  const titleBEl = stage.querySelector("[data-guide-point-title-b]");
  const bodyAEl = stage.querySelector("[data-guide-point-body-a]");
  const bodyBEl = stage.querySelector("[data-guide-point-body-b]");
  const sceneWrap = stage.querySelector("[data-guide-scene]") || stage;
  const armHintEl = stage.querySelector("[data-guide-arm-hint]");
  const phaseTabs = [...section.querySelectorAll("[data-guide-phase-tab]")];
  const confirmBtn = section.querySelector("[data-guide-phase-confirm]");
  const nextBtn = section.querySelector("[data-guide-phase-next]");
  const replayBtn = section.querySelector("[data-guide-replay]");
  const spotlightEl = stage.querySelector(".guide-spotlight");
  const autoPhase = stage.hasAttribute("data-guide-auto-phase");
  const initialPhase = Number(stage.dataset.guideInitialPhase || 1);
  let currentPhase = initialPhase === 2 ? 2 : 1;
  let phaseTwoUnlocked = initialPhase === 2;

  function speakPhase(phase) {
    if (!phase?.voice) return;
    speakText(phase.voice);
  }

  function renderPhase(phaseId, shouldSpeak = false) {
    const phase = phases.find((item) => item.id === phaseId);
    if (!phase) return;
    currentPhase = phaseId;

    if (phaseLabelEl) phaseLabelEl.textContent = phase.label;
    if (titleEl) titleEl.textContent = phaseId === 1 ? "上台前准备" : "扶手与手臂姿势";
    if (subtitleEl) subtitleEl.textContent = phase.subtitle;
    if (focusEl) focusEl.textContent = phase.focus;
    if (chipAEl) chipAEl.textContent = phase.chipA;
    if (titleAEl) titleAEl.textContent = phase.points[0]?.title || "";
    if (bodyAEl) bodyAEl.textContent = phase.points[0]?.body || "";
    if (titleBEl) titleBEl.textContent = phase.points[1]?.title || "";
    if (bodyBEl) bodyBEl.textContent = phase.points[1]?.body || "";
    stage.querySelectorAll("[data-guide-points] li").forEach((item) => {
      item.classList.add("is-active");
    });
    sceneWrap.classList.remove("phase-stage-boarding", "phase-stage-rails", "phase-arm-warning");
    if (phase.sceneClass) sceneWrap.classList.add(phase.sceneClass);
    if (humanEl) {
      humanEl.classList.remove("pose-down", "pose-hold", "pose-boarding");
      humanEl.classList.add(phase.pose);
    }
    if (feetEl) feetEl.hidden = !phase.showFeet;
    if (spotlightEl) spotlightEl.hidden = true;
    if (armHintEl) armHintEl.hidden = phaseId !== 2;
    const railHint = stage.querySelector("[data-guide-rail-hint]");
    if (railHint) railHint.hidden = phaseId !== 2;
    const boardingHints = stage.querySelector("[data-guide-boarding-hints]");
    if (boardingHints) boardingHints.hidden = phaseId !== 1;
    if (circleEl) circleEl.hidden = false;
    stage.dataset.voiceText = phase.voice;

    phaseTabs.forEach((tab) => {
      const tabPhase = Number(tab.dataset.guidePhaseTab);
      const isActive = tabPhase === phaseId;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      if (tabPhase === 2) {
        tab.disabled = !phaseTwoUnlocked;
      }
    });

    if (confirmBtn) {
      confirmBtn.hidden = phaseId !== 1 || autoPhase;
      confirmBtn.disabled = phaseTwoUnlocked;
    }
    if (nextBtn) {
      nextBtn.hidden = phaseId !== 2;
    }

    if (shouldSpeak) speakPhase(phase);
  }

  function unlockPhaseTwo(shouldSpeak = true) {
    if (phaseTwoUnlocked) return;
    phaseTwoUnlocked = true;
    renderPhase(2, shouldSpeak);
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => unlockPhaseTwo(true));
  }

  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      const phase = phases.find((item) => item.id === currentPhase);
      speakPhase(phase);
    });
  }

  if (autoPhase) {
    window.setTimeout(() => unlockPhaseTwo(true), 3200);
  }

  if (initialPhase === 2) {
    renderPhase(2, false);
    window.setTimeout(() => speakPhase(phases[1]), 320);
  } else {
    renderPhase(1, false);
    window.setTimeout(() => speakPhase(phases[0]), 320);
  }
}

function setupGuideSequenceLegacyLoop(stage) {
  const steps = [
    {
      index: "1/4",
      title: "脱鞋脱袜",
      body: "保持足底可完整接触转台。",
      focus: "请脱鞋脱袜",
      subtitle: "请先脱鞋脱袜。",
      voice: "请先脱鞋脱袜。"
    },
    {
      index: "2/4",
      title: "双脚接触脚印",
      body: "双脚站稳，足底与脚印充分接触。",
      focus: "请双脚充分接触脚印",
      subtitle: "请双脚站稳并充分接触脚印。",
      voice: "请双脚站稳，足底与脚印充分接触。"
    },
    {
      index: "3/4",
      title: "双手握住扶手",
      body: "双手握住扶手，保持手掌与金属充分接触。",
      focus: "请双手握住扶手",
      subtitle: "请双手握住扶手。",
      voice: "请双手握住扶手，并保持接触。"
    },
    {
      index: "4/4",
      title: "双臂展开 45°",
      body: "面向屏幕，双臂展开并保持静止。",
      focus: "请双臂展开 45°",
      subtitle: "请面向屏幕，双臂展开四十五度。",
      voice: "请面向屏幕，双臂展开四十五度并保持静止。"
    }
  ];

  const indexEl = stage.querySelector("[data-guide-step-index]");
  const titleEl = stage.querySelector("[data-guide-step-title]");
  const bodyEl = stage.querySelector("[data-guide-step-body]");
  const focusEl = stage.querySelector("[data-guide-focus]");
  const subtitleEl = document.querySelector("[data-guide-subtitle]");
  let currentIndex = 0;
  let timer = null;

  function renderStep(stepIndex, shouldSpeak = false) {
    const step = steps[stepIndex];
    if (!step) return;
    currentIndex = stepIndex;
    if (indexEl) indexEl.textContent = step.index;
    if (titleEl) titleEl.textContent = step.title;
    if (bodyEl) bodyEl.textContent = step.body;
    if (focusEl) focusEl.textContent = step.focus;
    if (subtitleEl) subtitleEl.textContent = step.subtitle;
    stage.dataset.voiceText = step.voice;
    if (shouldSpeak) speakText(step.voice);
  }

  function advanceStep() {
    const nextIndex = (currentIndex + 1) % steps.length;
    renderStep(nextIndex, true);
  }

  renderStep(0, false);
  timer = window.setInterval(advanceStep, 1800);
  window.addEventListener("beforeunload", () => {
    if (timer) window.clearInterval(timer);
  });
}

let activePageDemo = null;

function setActivePageDemo(controller) {
  activePageDemo = controller || null;
}

function cancelActivePageDemo() {
  if (activePageDemo?.cancel) activePageDemo.cancel();
}

function setupDemoAdvance() {
  document.querySelectorAll("[data-demo-next]").forEach((el) => {
    const target = el.dataset.demoNext;
    if (!target) return;
    if (el.hasAttribute("data-anthropometry-next-btn")) return;

    function trigger(event) {
      if (el.disabled) return;
      if (event) event.preventDefault();
      cancelActivePageDemo();
      navigateToTarget(withStateQuery(target, loadState()));
    }

    if (el.tagName === "A") {
      el.addEventListener("click", trigger);
      return;
    }

    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.addEventListener("click", trigger);
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        trigger(event);
      }
    });
  });
}

function speakCountdownDigit(seconds) {
  const spoken = { 3: "三", 2: "二", 1: "一" };
  if (spoken[seconds]) speakText(spoken[seconds]);
}

function setupStageAdvance() {
  document.querySelectorAll("[data-stage-next]").forEach((el) => {
    const target = el.dataset.stageNext;
    if (!target) return;

    const delay = Number(el.dataset.stageDelay || 3000);
    const completeKey = el.dataset.stageCompleteGroup;
    const requiresClick = el.hasAttribute("data-demo-countdown-target");
    const manualNext = el.hasAttribute("data-stage-manual-next");
    const secondsEl = el.querySelector("[data-stage-seconds]");
    const doneHintEl = el.querySelector("[data-stage-done-hint]");
    let timer = null;
    let hasStarted = false;
    let remainingSeconds = Number(el.dataset.stageSecondsStart || secondsEl?.textContent || Math.ceil(delay / 1000));

    function clearStageTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function completeStageDemo() {
      clearStageTimer();
      if (secondsEl) secondsEl.textContent = "0";
      if (doneHintEl) doneHintEl.hidden = true;
    }

    function finishStage() {
      clearStageTimer();
      if (completeKey) {
        completeGroup(completeKey);
      }
      navigateToTarget(withStateQuery(target, loadState()));
    }

    function startStage() {
      if (hasStarted) return;
      hasStarted = true;
      if (secondsEl) {
        secondsEl.textContent = String(remainingSeconds);
      }
      speakCountdownDigit(remainingSeconds);
      if (delay <= 0) {
        if (manualNext) {
          completeStageDemo();
          return;
        }
        finishStage();
        return;
      }
      timer = window.setInterval(() => {
        remainingSeconds -= 1;
        if (secondsEl) {
          secondsEl.textContent = String(Math.max(remainingSeconds, 0));
        }
        if (remainingSeconds > 0) {
          speakCountdownDigit(remainingSeconds);
        }
        if (remainingSeconds <= 0) {
          if (manualNext) {
            completeStageDemo();
            return;
          }
          finishStage();
        }
      }, 1000);
    }

    if (manualNext) {
      setActivePageDemo({ cancel: clearStageTimer });
      if (el.hasAttribute("data-stage-auto-start") && secondsEl) {
        window.setTimeout(() => startStage(), 420);
      }
      return;
    }

    const autoAdvance = el.hasAttribute("data-stage-auto");

    if (requiresClick || !autoAdvance) {
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.classList.add("demo-click-zone");
      el.addEventListener("click", () => {
        if (requiresClick) {
          startStage();
          return;
        }
        finishStage();
      });
      el.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (requiresClick) {
            startStage();
            return;
          }
          finishStage();
        }
      });
      if (el.hasAttribute("data-stage-auto-start") && secondsEl) {
        window.setTimeout(() => startStage(), 420);
      }
      return;
    }

    window.setTimeout(finishStage, delay);
  });
}

function bindDemoPlaceholders() {
  document.querySelectorAll("[data-demo-placeholder]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });
}

function bindActionLinks() {
  document.querySelectorAll("[data-action-link]").forEach((el) => {
    el.addEventListener("click", (event) => {
      const action = el.dataset.actionLink;
      const target = el.getAttribute("href") || el.dataset.next;
      const complete = el.dataset.completeGroup;
      const measurementMode = el.dataset.measurementMode;

      if (action === "reset-demo") {
        saveState(defaultState());
        renderState();
      }

      if (action === "start-session") {
        startSession();
      }
      if (measurementMode) {
        patchState({ currentMeasurementMode: measurementMode });
      }

      if (action === "open-report") {
        event.preventDefault();
        openReport();
        return;
      }

      if (complete) {
        completeGroup(complete);
      }

      if (target && target !== "#") {
        event.preventDefault();
        navigateToTarget(target);
      }
    });
  });
}

function initChoiceGroup(group) {
  if (group.closest("[data-finish-group]")) return;
  const items = [...group.querySelectorAll("[data-choice-item]")].filter((item) => !item.hidden);
  if (!items.length) return;

  let activeIndex = Number(group.dataset.defaultIndex || 0);
  if (!Number.isFinite(activeIndex) || activeIndex < 0) activeIndex = 0;
  if (activeIndex >= items.length) activeIndex = 0;

  function syncUI() {
    items.forEach((item, index) => {
      item.classList.toggle("is-active", index === activeIndex);
    });
  }

  items.forEach((item, index) => {
    item.addEventListener("mouseenter", () => {
      activeIndex = index;
      syncUI();
    });
    item.addEventListener("focus", () => {
      activeIndex = index;
      syncUI();
    });
  });

  syncUI();
}

function renderHomeMeasurementEntries(state) {
  const grid = document.querySelector("[data-home-measure-grid]");
  if (!grid) return;

  const tiles = getHomeMeasurementTiles(state);
  const count = tiles.length;
  const section = grid.closest(".device--home, .device--measure-select");
  if (section) {
    section
      .querySelectorAll("footer.measure-select-idle, [data-measure-select-idle-footer]")
      .forEach((el) => el.remove());
  }

  grid.innerHTML = "";
  grid.className = "measure-select-stack";
  if (count >= 5) grid.classList.add("measure-select-stack--dense");
  if (section) {
    section.classList.toggle("device--measure-select-empty", count === 0);
  }

  if (count === 0) {
    document.querySelectorAll("[data-home-sparse-tip]").forEach((el) => {
      el.hidden = true;
    });
    return;
  }

  document.querySelectorAll("[data-home-sparse-tip]").forEach((el) => {
    el.hidden = true;
  });

  tiles.forEach((tile) => {
    grid.appendChild(buildMeasureSelectCard(tile, state));
  });

  initChoiceGroup(grid);
  setupMeasureSelectGesture(grid);
}

function setupChoiceHighlight() {
  document.querySelectorAll("[data-choice-group]").forEach((group) => {
    initChoiceGroup(group);
  });
}

function setupFinishAutoAdvance() {
  document.querySelectorAll("[data-finish-group]").forEach((group) => {
    const state = loadState();
    const section = group.closest("section") || document.body;
    const flow = group.dataset.finishFlow || "";
    const current = group.dataset.finishCurrent || "";
    const idleEnabled = group.dataset.idleDefaultNext === "1";
    const idleSecondsTotal = Number(group.dataset.idleSeconds || 18);
    const idleStartOnFirstClick = group.dataset.idleStart === "on-first-click";
    const idleFooter = group.querySelector(".scheme-three-idle-footer");
    const items = [...group.querySelectorAll("[data-choice-item]")].filter((item) => !item.hidden);
    if (!items.length) return;

    const recommendation = getNextMeasurementRecommendation(current, flow, state);
    const nextOption = group.querySelector("[data-finish-option='next']");
    const reportOption = group.querySelector("[data-finish-option='report']");
    const labelEls = [...section.querySelectorAll("[data-auto-label]")];

    if (reportOption) {
      const href = reportOption.getAttribute("href");
      if (href && href !== "#") {
        reportOption.setAttribute("href", withStateQuery(href, state));
      }
    }

    if (nextOption) {
      if (recommendation && recommendation.href) {
        nextOption.hidden = false;
        nextOption.setAttribute("href", withStateQuery(recommendation.href, state));
        nextOption.dataset.choiceLabel = `继续${recommendation.title}`;
        const title = nextOption.querySelector("[data-next-title]");
        if (title) title.textContent = `继续${recommendation.title}`;
        const desc = nextOption.querySelector("[data-next-desc]");
        if (desc) desc.textContent = NEXT_RECOMMEND_DESC[recommendation.key] || "";
      } else {
        nextOption.hidden = true;
      }
    }

    const visibleItems = [...group.querySelectorAll("[data-choice-item]")].filter((item) => !item.hidden);
    if (!visibleItems.length) return;

    let activeItem = reportOption && !reportOption.hidden ? reportOption : visibleItems[0];
    if (recommendation && nextOption && !nextOption.hidden) {
      activeItem = nextOption;
    }

    let idleTimer = null;
    let idleCountdownStarted = !idleEnabled || !idleStartOnFirstClick;

    function syncUI() {
      visibleItems.forEach((item) => {
        item.classList.toggle("is-active", item === activeItem);
      });
      labelEls.forEach((el) => {
        el.textContent = activeItem.dataset.choiceLabel || activeItem.textContent.trim();
      });
      section.querySelectorAll("[data-auto-prefix]").forEach((el) => {
        el.textContent = idleEnabled ? "空闲默认：" : "请点击上方选项";
      });
      section.querySelectorAll("[data-auto-countdown]").forEach((el) => {
        el.hidden = true;
      });
    }

    function clearIdleTimer() {
      if (idleTimer) {
        window.clearInterval(idleTimer);
        idleTimer = null;
      }
    }

    function triggerActive() {
      clearIdleTimer();
      activeItem.click();
    }

    function syncIdlePendingHint() {
      const idleLabelEl = section.querySelector("[data-idle-label]");
      const idleCountEl = section.querySelector("[data-idle-countdown]");
      if (idleLabelEl) idleLabelEl.textContent = "点击空白处后启动空闲倒计时（演示）";
      if (idleCountEl) {
        idleCountEl.textContent = "";
        idleCountEl.hidden = true;
      }
      idleFooter?.classList.add("is-idle-waiting-click");
    }

    function syncIdleLabel(remain) {
      const label = activeItem.dataset.choiceLabel || activeItem.textContent.trim();
      const idleLabelEl = section.querySelector("[data-idle-label]");
      const idleCountEl = section.querySelector("[data-idle-countdown]");
      if (idleLabelEl) {
        idleLabelEl.textContent = `${remain} 秒无操作将默认进入：${label}`;
      }
      if (idleCountEl) {
        idleCountEl.hidden = false;
        idleCountEl.textContent = String(remain);
      }
      idleFooter?.classList.remove("is-idle-waiting-click");
    }

    function startIdleCountdown() {
      clearIdleTimer();
      let remain = idleSecondsTotal;
      syncIdleLabel(remain);
      idleTimer = window.setInterval(() => {
        remain -= 1;
        syncIdleLabel(Math.max(remain, 0));
        if (remain <= 0) {
          triggerActive();
        }
      }, 1000);
    }

    function resetIdleFromUser() {
      if (!idleEnabled) return;
      startIdleCountdown();
    }

    function onIdleUserActivity(event) {
      if (!idleEnabled) return;
      const t = event?.target;
      if (t?.closest?.("[data-choice-item], [data-finish-option]")) {
        return;
      }
      if (event?.type === "keydown") {
        const ae = document.activeElement;
        if (ae?.closest?.("[data-choice-item], [data-finish-option]")) {
          return;
        }
      }
      if (idleStartOnFirstClick && !idleCountdownStarted) {
        idleCountdownStarted = true;
        startIdleCountdown();
        return;
      }
      resetIdleFromUser();
    }

    syncUI();

    if (idleEnabled) {
      if (idleStartOnFirstClick) {
        syncIdlePendingHint();
      } else {
        startIdleCountdown();
      }
      section.addEventListener("pointerdown", onIdleUserActivity, true);
      section.addEventListener("keydown", onIdleUserActivity, true);
      return;
    }

    section.querySelectorAll("[data-auto-hint-click]").forEach((hint) => {
      function onActivate(event) {
        event.preventDefault();
        triggerActive();
      }
      hint.addEventListener("click", onActivate);
      hint.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onActivate(event);
        }
      });
    });
  });
}

/** 手势圆环：prep（测量准备举手前进）与 finish（完成页左右手选操作）。 */
function setupGestureRingModule(prepRoot) {
  const module = prepRoot.querySelector("[data-gesture-ring]");
  if (!module) return;

  const context = module.dataset.gestureContext === "finish" ? "finish" : "prep";
  const section = prepRoot.closest("section") || prepRoot;
  const stage = module.querySelector("[data-gesture-stage]");
  const human = module.querySelector("[data-gesture-human]");
  const ring = module.querySelector("[data-gesture-ring-progress]");
  const holdHint = module.querySelector("[data-gesture-hold-hint]");
  const bubble = module.querySelector("[data-gesture-bubble]");
  const holdMs = Math.max(400, Number(prepRoot.dataset.prepHoldMs || 2000));
  const qs = new URLSearchParams(window.location.search);
  const autoAdvance =
    context === "prep" &&
    (qs.get("prepAutoAdvance") === "1" ||
      prepRoot.dataset.prepAutoAdvance === "1" ||
      prepRoot.dataset.prepAutoAdvance === "true");

  const rawAuto = prepRoot.dataset.prepAutoDelay;
  const skipAutoTimer =
    context === "finish" || rawAuto === "off" || rawAuto === "false" || rawAuto === "0";
  const autoDelayNum = skipAutoTimer ? 0 : Math.max(0, Number(rawAuto ?? 2600));

  const finishGroup = context === "finish" ? prepRoot.querySelector("[data-finish-group]") : null;
  const prepChoiceGroup = context === "prep" ? prepRoot.querySelector("[data-prep-choice-group]") : null;
  const reportEl = finishGroup?.querySelector('[data-finish-option="report"]');
  const nextEl = finishGroup?.querySelector('[data-finish-option="next"]');
  const prepExitEl = prepChoiceGroup?.querySelector('[data-prep-option="exit"]');
  const prepNextEl = prepChoiceGroup?.querySelector('[data-prep-option="next"]');
  const reportOk = !!(reportEl && !reportEl.hidden);
  const nextOk = !!(nextEl && !nextEl.hidden);
  const prepDualHand = context === "prep" && !!(prepExitEl && prepNextEl);
  const finishPlan =
    context === "finish"
      ? {
          both: reportOk && nextOk,
          onlyNext: nextOk && !reportOk,
          onlyReport: reportOk && !nextOk,
          neither: !reportOk && !nextOk
        }
      : null;

  function finishOptionShortLabel(el) {
    if (!el) return "";
    const fromData = el.dataset.choiceLabel?.trim();
    if (fromData) return fromData;
    const strong = el.querySelector("strong");
    return strong?.textContent?.trim() || "";
  }

  const reportLabel = context === "finish" ? finishOptionShortLabel(reportEl) : "";
  const nextLabel = context === "finish" ? finishOptionShortLabel(nextEl) : "";
  const prepExitLabel = prepDualHand ? finishOptionShortLabel(prepExitEl) : "退出测量";
  const prepNextLabel = prepDualHand ? finishOptionShortLabel(prepNextEl) : "进入下一步";

  if (context === "finish" && finishPlan?.neither) return;

  let idleBubbleText =
    (module.dataset.gestureIdleHint && module.dataset.gestureIdleHint.trim()) ||
    (context === "finish"
      ? finishPlan.both
        ? `举左手：${reportLabel}。举右手：${nextLabel}。`
        : finishPlan.onlyNext
          ? `请举起右手并保持，以${nextLabel}。`
          : finishPlan.onlyReport
            ? `请举起右手并保持，以${reportLabel}。`
            : ""
      : prepDualHand
        ? `举左手：${prepExitLabel}。举右手：${prepNextLabel}。`
        : "请举起右手");

  let complete = false;
  let isRaised = false;
  /** @type {"left"|"right"|null} */
  let activeHand = null;
  let rafId = null;
  let holdStartedAt = 0;
  let demoTimer = null;
  let wrongHandTimer = null;
  let finishHintTimer = null;

  const ringLen = ring && typeof ring.getTotalLength === "function" ? ring.getTotalLength() : 238.76;
  if (ring) {
    ring.style.strokeDasharray = String(ringLen);
    ring.style.strokeDashoffset = String(ringLen);
  }

  function setHumanPoseForHand(hand) {
    if (!human) return;
    human.classList.remove("pose-down", "pose-shoulder-right", "pose-shoulder-left");
    if (hand === "right") human.classList.add("pose-shoulder-right");
    else if (hand === "left") human.classList.add("pose-shoulder-left");
    else human.classList.add("pose-down");
  }

  function setRingProgress(p) {
    if (!ring) return;
    const t = Math.min(1, Math.max(0, p));
    ring.style.strokeDashoffset = String(ringLen * (1 - t));
  }

  function stopTick() {
    if (rafId != null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function tick() {
    if (!isRaised || complete) return;
    const elapsed = performance.now() - holdStartedAt;
    const p = elapsed / holdMs;
    if (p >= 1) {
      stopTick();
      onGestureComplete();
      return;
    }
    setRingProgress(p);
    rafId = window.requestAnimationFrame(tick);
  }

  function beginHold(hand) {
    if (complete || isRaised) return;
    isRaised = true;
    activeHand = hand;
    module.classList.add("is-gesture-holding");
    setHumanPoseForHand(hand);
    if (holdHint) holdHint.hidden = false;
    if (bubble) bubble.textContent = holdingBubbleFor(hand);
    holdStartedAt = performance.now();
    setRingProgress(0);
    stopTick();
    rafId = window.requestAnimationFrame(tick);
  }

  function tryStartPrep(hand) {
    if (prepDualHand) {
      beginHold(hand);
      return;
    }
    if (hand === "left") {
      flashFinishHint("请举起右手以继续。");
      return;
    }
    beginHold("right");
  }

  function tryStartFinish(hand) {
    if (finishPlan.both) {
      beginHold(hand);
      return;
    }
    if (finishPlan.onlyNext) {
      if (hand === "left") {
        flashFinishHint(`请举起右手以${nextLabel}。`);
        return;
      }
      beginHold("right");
      return;
    }
    if (finishPlan.onlyReport) {
      if (hand === "left") {
        flashFinishHint(`请举起右手以${reportLabel}。`);
        return;
      }
      beginHold("right");
    }
  }

  function flashFinishHint(msg) {
    if (!bubble || complete) return;
    if (finishHintTimer) window.clearTimeout(finishHintTimer);
    bubble.textContent = msg;
    module.classList.add("is-gesture-wrong");
    finishHintTimer = window.setTimeout(() => {
      finishHintTimer = null;
      module.classList.remove("is-gesture-wrong");
      if (!isRaised && !complete && bubble) bubble.textContent = idleBubbleText;
    }, 1600);
  }

  /** @param {"left"|"right"|undefined} handOpt */
  function gestureStart(handOpt) {
    if (complete) return;
    if (context === "prep") {
      tryStartPrep(handOpt || "right");
      return;
    }
    tryStartFinish(handOpt || "right");
  }

  function gestureRelease() {
    if (complete || !isRaised) return;
    stopTick();
    isRaised = false;
    activeHand = null;
    module.classList.remove("is-gesture-holding");
    setHumanPoseForHand(null);
    if (holdHint) holdHint.hidden = true;
    if (bubble) bubble.textContent = idleBubbleText;
    setRingProgress(0);
  }

  function holdingBubbleFor(hand) {
    if (context === "prep") {
      if (prepDualHand) {
        return hand === "left" ? `举起左手 · ${prepExitLabel}` : `举起右手 · ${prepNextLabel}`;
      }
      return "举起右手 · 继续";
    }
    if (finishPlan.both) {
      return hand === "left" ? `举起左手 · ${reportLabel}` : `举起右手 · ${nextLabel}`;
    }
    if (finishPlan.onlyNext) return `举起右手 · ${nextLabel}`;
    if (finishPlan.onlyReport) return `举起右手 · ${reportLabel}`;
    return "请保持";
  }

  function prepTargetKey(hand) {
    return hand === "left" ? "exit" : "next";
  }

  function finishTargetKey() {
    if (!finishPlan) return null;
    if (finishPlan.onlyReport) return "report";
    if (finishPlan.onlyNext) return "next";
    return activeHand === "left" ? "report" : "next";
  }

  function onGestureComplete() {
    if (complete) return;
    const poseHand = activeHand;
    const finishKey = context === "finish" && finishPlan ? finishTargetKey() : null;
    const prepKey = context === "prep" && prepDualHand && poseHand ? prepTargetKey(poseHand) : null;
    complete = true;
    stopTick();
    isRaised = false;
    activeHand = null;
    module.classList.add("is-gesture-complete");
    module.classList.remove("is-gesture-holding");
    section.classList.add("is-gesture-recognized");
    setRingProgress(1);
    if (ring) ring.classList.add("is-gesture-ring-done");
    if (holdHint) holdHint.hidden = true;

    if (context === "prep") {
      setHumanPoseForHand(prepDualHand && poseHand ? poseHand : "right");
      if (bubble) {
        bubble.textContent = "识别通过";
      }
      speakText("识别通过。");
      if (prepDualHand && prepChoiceGroup) {
        const card = prepChoiceGroup.querySelector(`[data-prep-option="${prepKey}"]`);
        prepChoiceGroup.querySelectorAll("[data-prep-option]").forEach((el) => {
          el.classList.toggle("is-active", el === card);
          el.classList.toggle("is-gesture-selected", el === card);
        });
      }
      if (autoAdvance) {
        const state = loadState();
        const exitTarget =
          prepRoot.dataset.prepExit || prepExitEl?.getAttribute("href") || "./home.html";
        const nextTarget =
          prepRoot.dataset.prepGestureAdvance || prepNextEl?.getAttribute("href") || "";
        const target = prepKey === "exit" ? exitTarget : nextTarget;
        navigateToTarget(withStateQuery(target, state));
      }
      return;
    }

    const key = finishKey;
    const card = key ? finishGroup?.querySelector(`[data-finish-option="${key}"]`) : null;
    setHumanPoseForHand(poseHand === "left" ? "left" : "right");
    if (bubble) {
      bubble.textContent = "识别通过";
    }
    speakText("识别通过。");
    if (finishGroup) {
      finishGroup.querySelectorAll("[data-finish-option]").forEach((el) => {
        el.classList.toggle("is-active", el === card);
        el.classList.toggle("is-gesture-selected", el === card);
      });
    }
  }

  function showWrongHand() {
    if (complete || context !== "prep") return;
    if (wrongHandTimer) window.clearTimeout(wrongHandTimer);
    if (bubble) bubble.textContent = "请举起右手，左手无效";
    module.classList.add("is-gesture-wrong");
    wrongHandTimer = window.setTimeout(() => {
      module.classList.remove("is-gesture-wrong");
      wrongHandTimer = null;
      if (!isRaised && !complete && bubble) bubble.textContent = idleBubbleText;
    }, 1600);
  }

  function onStageClick() {
    if (complete) return;
    if (isRaised) gestureRelease();
    else if (context === "prep") tryStartPrep("right");
    else if (context === "finish") tryStartFinish("right");
    else gestureStart();
  }

  function onKeyDown(e) {
    if (complete) return;
    if (e.defaultPrevented) return;
    if (e.target.closest?.("input, textarea, select, [contenteditable='true']")) return;
    const k = e.key.toLowerCase();
    if (context === "prep" && prepDualHand) {
      if (k === "l") {
        e.preventDefault();
        if (isRaised) gestureRelease();
        else tryStartPrep("left");
      } else if (k === "r") {
        e.preventDefault();
        if (isRaised) gestureRelease();
        else tryStartPrep("right");
      }
      return;
    }
    if (context === "prep") {
      if (k === "l") {
        e.preventDefault();
        if (isRaised) gestureRelease();
        showWrongHand();
      } else if (k === "r") {
        e.preventDefault();
        if (isRaised) gestureRelease();
        else gestureStart();
      }
      return;
    }
    if (k === "l") {
      e.preventDefault();
      if (isRaised) gestureRelease();
      else tryStartFinish("left");
    } else if (k === "r") {
      e.preventDefault();
      if (isRaised) gestureRelease();
      else tryStartFinish("right");
    }
  }

  function cancelDemo() {
    if (demoTimer) {
      window.clearTimeout(demoTimer);
      demoTimer = null;
    }
    if (wrongHandTimer) {
      window.clearTimeout(wrongHandTimer);
      wrongHandTimer = null;
    }
    if (finishHintTimer) {
      window.clearTimeout(finishHintTimer);
      finishHintTimer = null;
    }
    stopTick();
    window.removeEventListener("keydown", onKeyDown, true);
    if (stage) stage.removeEventListener("click", onStageClick);
  }

  setHumanPoseForHand(null);
  setRingProgress(0);
  if (bubble) bubble.textContent = idleBubbleText;
  if (stage) stage.addEventListener("click", onStageClick);
  window.addEventListener("keydown", onKeyDown, true);

  speakText(
    prepRoot.dataset.voiceText ||
      (context === "finish"
        ? "测量已完成。请举手确认下一步操作。"
        : prepDualHand
          ? "请按清单准备好后举手：右手进入下一步，左手退出测量。"
          : "请举右手进入下一步。")
  );

  if (context === "prep" && autoDelayNum > 0) {
    demoTimer = window.setTimeout(() => {
      if (!complete && !isRaised) tryStartPrep("right");
    }, autoDelayNum);
  }

  setActivePageDemo({ cancel: cancelDemo });
}

function setupFinishGesturePage() {
  document.querySelectorAll("[data-gesture-finish-page]").forEach((root) => {
    setupGestureRingModule(root);
  });
}

function setupPrepGestureAdvance() {
  const root = document.querySelector("[data-prep-gesture-advance]");
  if (!root) return;
  setupGestureRingModule(root);
}


function setupAutoDetectAdvance() {
  document.querySelectorAll("[data-auto-detect-next]").forEach((root) => {
    if (root.hasAttribute("data-turntable-anthropometry")) return;
    const delay = Number(root.dataset.autoDetectDelay || 2600);
    const statusEl = root.querySelector("[data-auto-detect-status]");
    const subtitleEl = root.closest("section")?.querySelector(".screen-subtitle");
    const focusEl = root.querySelector(".live-focus");
    const warningMode = new URLSearchParams(window.location.search).get("autoDetectMode") === "warning";
    const voiceAdvanceNext = root.dataset.voiceAdvanceNext;
    const voiceAdvanceAfterMs = Number(root.dataset.voiceAdvanceAfterMs || 3000);
    let demoTimer = null;
    let navigateTimer = null;

    if (warningMode) {
      if (statusEl) statusEl.textContent = "正在识别...";
      speakText("检测到姿态异常，请先调整姿势。");
      root.classList.add("is-warning");
      if (subtitleEl) subtitleEl.textContent = "检测到姿态异常，请先调整姿势后再继续。";
      if (focusEl) focusEl.textContent = "请调整姿势";
      if (statusEl) statusEl.textContent = "姿势异常";
      return;
    }

    function cancelDemo() {
      if (demoTimer) {
        window.clearTimeout(demoTimer);
        demoTimer = null;
      }
      if (navigateTimer) {
        window.clearTimeout(navigateTimer);
        navigateTimer = null;
      }
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    }

    function completeDemo(skipRecognizedSpeak) {
      root.classList.add("is-aligned");
      const scene = root.querySelector(".bodycomp-prep-scene");
      if (scene) scene.classList.add("is-aligned");
      if (statusEl) statusEl.textContent = "识别通过";
      if (!skipRecognizedSpeak) speakText("识别通过。");
    }

    if (voiceAdvanceNext && !isDemoManualAdvance()) {
      const autoHint = root.querySelector("[data-voice-auto-hint]");
      if (autoHint) autoHint.hidden = false;
      if (statusEl) statusEl.textContent = "正在识别...";
      const voiceLine =
        root.dataset.voiceText || "正在识别姿态，请保持不动。";
      speakTextThen(voiceLine, () => {
        navigateTimer = window.setTimeout(() => {
          navigateToTarget(withStateQuery(voiceAdvanceNext, loadState()));
        }, voiceAdvanceAfterMs);
      });
      demoTimer = window.setTimeout(() => completeDemo(true), delay);
      setActivePageDemo({ cancel: cancelDemo });
      return;
    }

    if (statusEl) statusEl.textContent = "正在识别...";
    speakText(root.dataset.voiceText || "正在识别姿态，请保持不动。");

    demoTimer = window.setTimeout(() => completeDemo(false), delay);
    setActivePageDemo({ cancel: cancelDemo });
  });
}

function setupTipCarousel() {
  document.querySelectorAll("[data-tip-carousel]").forEach((root) => {
    const items = [...root.querySelectorAll("[data-tip-item]")];
    if (items.length < 2) return;
    let idx = 0;
    const intervalMs = Number(root.dataset.tipInterval || 2600);

    function render() {
      items.forEach((item, i) => {
        item.classList.toggle("is-active", i === idx);
      });
    }

    render();
    window.setInterval(() => {
      idx = (idx + 1) % items.length;
      render();
    }, intervalMs);
  });
}

function setupSchemeThreeGestureDemo() {
  const root = document.querySelector("[data-gesture-demo-a]");
  if (!root) return;

  const toast = root.querySelector("[data-gesture-toast]");
  const figure = root.querySelector("[data-scheme-three-figure]");
  const cam = root.querySelector("[data-scheme-three-live]");
  const chipA = root.querySelector("[data-scheme-chip-a]");
  const chipB = root.querySelector("[data-scheme-chip-b]");
  const group = root.querySelector("[data-finish-group]");
  if (!group) return;

  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add("is-visible");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      toast.hidden = true;
    }, 2200);
  }

  function pulseGestureTarget() {
    const target = figure || cam;
    if (!target) return;
    target.classList.remove("is-gesture-pulse");
    void target.offsetWidth;
    target.classList.add("is-gesture-pulse");
    window.setTimeout(() => target.classList.remove("is-gesture-pulse"), 600);
  }

  function simulate(option) {
    const card = group.querySelector(`[data-finish-option="${option}"]`);
    if (!card || card.hidden) return;
    if (chipA) chipA.textContent = "手势";
    if (chipB) {
      chipB.textContent = option === "report" ? "已识别 · 结束测量" : "已识别 · 举右手";
    }
    showToast(
      option === "report" ? "已识别：结束测量" : "已识别：举右手 · 继续下一项"
    );
    pulseGestureTarget();
    window.setTimeout(() => card.click(), 280);
  }

  root.querySelectorAll("[data-gesture-simulate]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      simulate(btn.getAttribute("data-gesture-simulate"));
    });
  });

  root.addEventListener(
    "keydown",
    (event) => {
      const k = event.key.toLowerCase();
      if (k === "l") {
        event.preventDefault();
        simulate("report");
      }
      if (k === "r") {
        event.preventDefault();
        simulate("next");
      }
    },
    true
  );
}

function renderState(nextState) {
  const state = nextState || loadState();

  document.querySelectorAll("[data-show-if]").forEach((el) => {
    const key = el.dataset.showIf;
    el.hidden = !state[key];
  });

  document.querySelectorAll("[data-config-key]").forEach((el) => {
    const key = el.dataset.configKey;
    if (el.type === "checkbox") {
      el.checked = !!state[key];
    } else {
      el.value = state[key];
    }
  });

  const quickMeta = getQuickItemMeta(state.homepageQuickSingleItem);
  document.querySelectorAll("[data-quick-item]").forEach((el) => {
    el.hidden = !quickMeta;
    if (!quickMeta) return;
    const title = el.querySelector("[data-quick-title]");
    const desc = el.querySelector("[data-quick-desc]");
    if (title) title.textContent = quickMeta.title;
    if (desc) desc.textContent = quickMeta.desc;
    el.setAttribute("href", withStateQuery(quickMeta.href, state));
    el.dataset.choiceLabel = quickMeta.title;
  });

  document.querySelectorAll("[data-show-if-pro-entry]").forEach((el) => {
    el.hidden = !state.postureModeEnabled;
  });
  document.querySelectorAll("[data-show-if-any-primary]").forEach((el) => {
    el.hidden = !isAnyHomeMeasurementEnabled(state);
  });
  document.querySelectorAll("[data-show-if-no-primary]").forEach((el) => {
    el.hidden = isAnyHomeMeasurementEnabled(state);
  });
  document.querySelectorAll("[data-show-if-no-home-tiles]").forEach((el) => {
    el.hidden = isAnyHomeMeasurementEnabled(state);
  });

  renderHomeMeasurementEntries(state);
  document.querySelectorAll("[data-show-if-any-single]").forEach((el) => {
    el.hidden = !isAnySingleEnabled(state);
  });
  document.querySelectorAll("[data-show-if-no-single]").forEach((el) => {
    el.hidden = isAnySingleEnabled(state);
  });

  document.querySelectorAll("[data-show-if-single-key]").forEach((el) => {
    const itemKey = el.dataset.showIfSingleKey;
    el.hidden = !isSingleItemEnabled(state, itemKey);
  });

  document.querySelectorAll('[data-config-key="homepageQuickSingleItem"] option').forEach((opt) => {
    if (opt.value === "none") return;
    opt.hidden = !isQuickSingleAvailable(state, opt.value);
    opt.disabled = !isQuickSingleAvailable(state, opt.value);
  });

  if (
    state.homepageQuickSingleItem !== "none" &&
    !isQuickSingleAvailable(state, state.homepageQuickSingleItem)
  ) {
    patchState({ homepageQuickSingleItem: "none" });
    return;
  }

  document.querySelectorAll("[data-stateful-link]").forEach((el) => {
    const target = el.dataset.statefulLink;
    el.setAttribute("href", appendReturnToFromPage(withStateQuery(target, state)));
  });

  document.querySelectorAll("[data-back-link]").forEach((el) => {
    const defaultHref = el.getAttribute("data-back-default") || "./standby.html";
    const mode = el.dataset.backMode || "demo-or-standby";
    let target = defaultHref;
    if (mode === "demo-or-standby") {
      target = resolveDemoBackHref(defaultHref);
    }
    el.setAttribute("href", appendReturnToFromPage(withStateQuery(target, state)));
  });

  document.querySelectorAll("[data-dynamic-lab-back]").forEach((el) => {
    const backHref =
      state.singleShoulderEnabled && state.singleNeckEnabled
        ? DYNAMIC_LAB_SELECT_HREF
        : "./home.html";
    el.setAttribute("href", appendReturnToFromPage(withStateQuery(backHref, state)));
  });

  document.querySelectorAll("[data-standard-flow-entry]").forEach((el) => {
    el.setAttribute("href", appendReturnToFromPage(withStateQuery(getStandardFlowEntryHref(state), state)));
  });

  document.querySelectorAll("[data-order-preview]").forEach((el) => {
    el.textContent = formatOrderPreview(state);
  });

  if (typeof window.__refreshOrderList === "function") {
    window.__refreshOrderList();
  }

  document.querySelectorAll("[data-result-summary='standard']").forEach((el) => {
    el.textContent = state.completedGroups.standard ? "已完成" : "未测量";
  });
  document.querySelectorAll("[data-result-summary='pro']").forEach((el) => {
    el.textContent = state.completedGroups.pro ? "已完成" : "未测量";
  });
  document.querySelectorAll("[data-result-summary='single']").forEach((el) => {
    el.textContent = state.completedGroups.singleShoulder ? "肩部" : "未测量";
  });

  document.querySelectorAll("[data-show-if-weight-standalone]").forEach((el) => {
    const onStandby = !!el.closest("[data-standby-page]");
    el.hidden = onStandby || !state.weightStandaloneEnabled;
  });

  document.querySelectorAll("[data-show-if-height-hidden]").forEach((el) => {
    el.hidden = state.heightResultVisible;
  });

  document.querySelectorAll("[data-show-if-height-visible]").forEach((el) => {
    el.hidden = !state.heightResultVisible;
  });

  document.querySelectorAll("[data-session-height]").forEach((el) => {
    el.textContent = formatSessionHeight(state);
  });
  document.querySelectorAll("[data-session-weight]").forEach((el) => {
    el.textContent = formatSessionWeight(state);
  });
  document.querySelectorAll("[data-session-weight-value]").forEach((el) => {
    el.textContent = String(state.sessionWeightKg);
  });
  document.querySelectorAll("[data-last-standalone-weight-at]").forEach((el) => {
    const raw = state.lastStandaloneWeightAt;
    if (!raw) {
      el.textContent = "—";
      return;
    }
    const d = new Date(raw);
    el.textContent = Number.isNaN(d.getTime())
      ? String(raw)
      : d.toLocaleString("zh-CN", {
          hour12: false,
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        });
  });

  const postMeasuringHref = resolvePostMeasuringHref(state);
  document.querySelectorAll("[data-measuring-next]").forEach((el) => {
    el.setAttribute("href", appendReturnToFromPage(withStateQuery(postMeasuringHref, state)));
    if (el.dataset.demoNext !== undefined) {
      el.dataset.demoNext = postMeasuringHref;
    }
    if (el.dataset.statefulLink !== undefined) {
      el.dataset.statefulLink = postMeasuringHref;
    }
  });
  document.querySelectorAll("[data-measuring-flow]").forEach((el) => {
    el.dataset.measuringNext = postMeasuringHref;
  });

  renderStandbyPage(state);
}

function setupVersionDisplay() {
  const fallback = DEMO_VERSION_FALLBACK;
  document.querySelectorAll("[data-demo-version]").forEach((el) => {
    el.textContent = `v${fallback}`;
  });
  fetch("./version.json")
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!data?.version) return;
      document.querySelectorAll("[data-demo-version]").forEach((el) => {
        el.textContent = `v${data.version}`;
        if (data.updated) el.setAttribute("title", `更新于 ${data.updated}`);
      });
    })
    .catch(() => {});
}

function setupGeneratingFlow() {
  const root = document.querySelector("[data-generating-flow]");
  if (!root) return;
  const target = root.dataset.generatingNext || "./report-detail.html";
  const delay = Number(root.dataset.generatingDelay || 3000);
  const voice = root.dataset.voiceText || "正在生成三维模型，请稍候。";
  speakText(voice);
  const fill = root.querySelector("[data-generating-progress]");
  const label = root.querySelector("[data-generating-label]");
  const started = performance.now();

  const tick = () => {
    const elapsed = performance.now() - started;
    const pct = Math.min(100, Math.round((elapsed / delay) * 100));
    if (fill) fill.style.width = `${pct}%`;
    if (label && pct < 100) label.textContent = `模型生成中 ${pct}%`;
    if (elapsed >= delay) {
      if (label) label.textContent = "模型生成完成";
      window.setTimeout(() => {
        navigateToTarget(withStateQuery(target, loadState()));
      }, 400);
      return;
    }
    window.requestAnimationFrame(tick);
  };
  window.requestAnimationFrame(tick);
}

function setupReportDetail() {
  const root = document.querySelector("[data-report-detail]");
  if (!root) return;
  const state = loadState();
  const rv = { ...DEFAULT_REPORT_VISIBILITY, ...(state.reportVisibility || {}) };
  root.querySelectorAll("[data-report-metric]").forEach((card) => {
    const reportKey = card.dataset.reportKey;
    const always = card.dataset.reportAlways === "1";
    if (!always && reportKey && rv[reportKey] === false) {
      card.hidden = true;
      return;
    }
    const delay = Number(card.dataset.delay || 500);
    const title = card.querySelector("strong")?.textContent?.trim();
    const valueEl = card.querySelector("[data-report-value]");
    window.setTimeout(() => {
      card.classList.remove("is-loading");
      if (valueEl && title && REPORT_METRIC_VALUES[title]) {
        valueEl.textContent = REPORT_METRIC_VALUES[title];
      } else if (valueEl) {
        valueEl.textContent = "—";
      }
    }, delay);
  });
}

function setupOrderSortList() {
  const list = document.querySelector("[data-order-sort-list]");
  if (!list) return;

  const pool = document.querySelector("[data-order-pool]");
  let dragKey = null;

  function render() {
    const state = loadState();
    const keys = [...state.measurementOrderKeys];
    list.innerHTML = "";
    keys.forEach((key, index) => {
      const item = MEASUREMENT_ITEMS[key];
      if (!item) return;
      const li = document.createElement("li");
      li.className = "order-sort-item";
      li.draggable = true;
      li.dataset.orderKey = key;
      li.innerHTML = `<span class="order-sort-handle" aria-hidden="true">⋮⋮</span><span class="order-sort-label">${index + 1}. ${item.title}</span><button type="button" class="order-sort-remove" data-order-remove="${key}">移除</button>`;
      list.appendChild(li);
    });

    if (pool) {
      pool.querySelectorAll("[data-order-add]").forEach((btn) => {
        const key = btn.dataset.orderAdd;
        const inList = keys.includes(key);
        const singleDisabled =
          (key === "singleShoulder" && !state.singleShoulderEnabled) ||
          (key === "singleNeck" && !state.singleNeckEnabled);
        const primaryDisabled =
          (key === "standard" && !state.comprehensiveEnabled) ||
          (key === "pro" && !state.postureModeEnabled) ||
          (key === "bodyCompSingle" && (!state.bodyCompSingleEnabled || state.comprehensiveEnabled)) ||
          (key === "circumferenceSingle" && (!state.circumferenceSingleEnabled || state.comprehensiveEnabled)) ||
          (key === "bodycompGirth" && (!state.bodycompGirthModeEnabled || state.comprehensiveEnabled)) ||
          (key === "girthOnly" && (!state.girthOnlyModeEnabled || state.comprehensiveEnabled)) ||
          (key === "balance" && !state.balanceModeEnabled) ||
          (key === "dynamicLab" && !isDynamicLabVisible(state));
        btn.hidden = inList || singleDisabled || primaryDisabled;
        btn.disabled = inList || singleDisabled || primaryDisabled;
      });
    }
  }

  list.addEventListener("dragstart", (event) => {
    const item = event.target.closest("[data-order-key]");
    if (!item) return;
    dragKey = item.dataset.orderKey;
    item.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
  });

  list.addEventListener("dragend", (event) => {
    event.target.closest("[data-order-key]")?.classList.remove("is-dragging");
    dragKey = null;
  });

  list.addEventListener("dragover", (event) => {
    event.preventDefault();
    const over = event.target.closest("[data-order-key]");
    const dragging = list.querySelector(".is-dragging");
    if (!over || !dragging || over === dragging) return;
    const rect = over.getBoundingClientRect();
    const after = event.clientY > rect.top + rect.height / 2;
    list.insertBefore(dragging, after ? over.nextSibling : over);
  });

  list.addEventListener("drop", (event) => {
    event.preventDefault();
    const keys = [...list.querySelectorAll("[data-order-key]")].map((el) => el.dataset.orderKey);
    patchState({ measurementOrderKeys: sanitizeOrderKeys(keys) });
    render();
  });

  list.addEventListener("click", (event) => {
    const removeBtn = event.target.closest("[data-order-remove]");
    if (!removeBtn) return;
    const key = removeBtn.dataset.orderRemove;
    const state = loadState();
    const next = state.measurementOrderKeys.filter((k) => k !== key);
    if (!next.length) return;
    patchState({ measurementOrderKeys: next });
    render();
  });

  if (pool) {
    pool.addEventListener("click", (event) => {
      const addBtn = event.target.closest("[data-order-add]");
      if (!addBtn) return;
      const key = addBtn.dataset.orderAdd;
      const state = loadState();
      if (state.measurementOrderKeys.includes(key)) return;
      patchState({ measurementOrderKeys: [...state.measurementOrderKeys, key] });
      render();
    });
  }

  render();
  window.__refreshOrderList = render;
}

function setupMeasuringTurntable() {
  const root = document.querySelector("[data-measuring-flow]");
  if (!root) return;
  if (isWarningMode()) {
    root.classList.add("is-warning");
    const subtitle = root.querySelector(".screen-subtitle");
    const focusEl = root.querySelector("[data-measuring-focus]");
    const chipEl = root.querySelector("[data-measuring-chip]");
    const titleEl = root.querySelector(".screen-title");
    const tipEl = root.querySelector("[data-live-voice]");
    if (titleEl) titleEl.textContent = "请调整姿势";
    if (subtitle) subtitle.textContent = "检测到姿态异常，请先调整姿势后再继续。";
    if (focusEl) focusEl.textContent = "请调整姿势";
    if (chipEl) chipEl.textContent = "姿势异常";
    if (tipEl) tipEl.textContent = "姿势异常时请先调整后再继续测量。";
    speakText("检测到姿态异常，请先调整姿势。");
    setActivePageDemo({ cancel: () => {} });
    return;
  }

  const durationMs = Number(root.dataset.measuringDuration || 10000);
  const progressFill = root.querySelector("[data-measuring-progress]");
  const focusEl = root.querySelector("[data-measuring-focus]");
  const chipEl = root.querySelector("[data-measuring-chip]");
  const audioEl = root.querySelector("[data-turntable-audio]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let finaleSpoken = false;
  let spinComplete = false;
  let rafId = null;
  const started = performance.now();

  let motorCtx = null;
  let motorOsc = null;
  let motorGain = null;
  let tickTimer = null;

  function stopSound() {
    if (audioEl) {
      try {
        audioEl.pause();
        audioEl.currentTime = 0;
      } catch {
        /* noop */
      }
    }
    if (tickTimer) {
      window.clearInterval(tickTimer);
      tickTimer = null;
    }
    if (motorOsc) {
      try {
        motorOsc.stop();
      } catch {
        /* noop */
      }
      motorOsc = null;
    }
    if (motorCtx) {
      motorCtx.close().catch(() => {});
      motorCtx = null;
    }
  }

  function playTickBurst() {
    if (!motorCtx || reducedMotion) return;
    try {
      const o = motorCtx.createOscillator();
      o.type = "sine";
      o.frequency.value = 392;
      const g = motorCtx.createGain();
      const t = motorCtx.currentTime;
      g.gain.setValueAtTime(0.012, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.connect(g);
      g.connect(motorCtx.destination);
      o.start(t);
      o.stop(t + 0.38);
    } catch {
      /* noop */
    }
  }

  function startOscillatorFallback() {
    if (reducedMotion || motorCtx) return;
    try {
      motorCtx = new AudioContext();
      motorOsc = motorCtx.createOscillator();
      motorOsc.type = "sine";
      motorOsc.frequency.value = 130.81;
      motorGain = motorCtx.createGain();
      motorGain.gain.value = 0.018;
      motorOsc.connect(motorGain);
      motorGain.connect(motorCtx.destination);
      motorOsc.start();
      tickTimer = window.setInterval(playTickBurst, 4200);
    } catch {
      stopSound();
    }
  }

  function tryPlayLoopAudio() {
    if (reducedMotion) return;
    if (!audioEl) {
      startOscillatorFallback();
      return;
    }
    audioEl.loop = true;
    audioEl.volume = 0.72;
    const p = audioEl.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        startOscillatorFallback();
      });
    }
  }

  let gestureUnlockDone = false;
  function onFirstGestureUnlock() {
    if (gestureUnlockDone) return;
    gestureUnlockDone = true;
    if (audioEl && audioEl.paused && !reducedMotion) {
      tryPlayLoopAudio();
    } else if (!audioEl && !motorCtx && !reducedMotion) {
      startOscillatorFallback();
    }
  }

  tryPlayLoopAudio();
  root.addEventListener("pointerdown", onFirstGestureUnlock, { once: true });
  root.addEventListener("click", onFirstGestureUnlock, { once: true });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && audioEl && audioEl.paused && !reducedMotion && !spinComplete) {
      tryPlayLoopAudio();
    }
  });

  speakText("测量中，请保持静止，不要移动。");

  const finaleThresholdMs = Math.min(3000, durationMs * 0.35);

  function cancelMeasuringDemo() {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    stopSound();
    spinComplete = true;
  }

  setActivePageDemo({ cancel: cancelMeasuringDemo });

  function tick() {
    const elapsed = performance.now() - started;
    const pct = Math.min(100, (elapsed / durationMs) * 100);
    if (progressFill) progressFill.style.width = `${pct.toFixed(1)}%`;
    const remaining = Math.max(0, durationMs - elapsed);
    if (remaining <= finaleThresholdMs && remaining > 0 && focusEl) {
      focusEl.textContent = "即将完成，请保持静止";
      if (chipEl) chipEl.textContent = "即将完成";
      if (!finaleSpoken) {
        finaleSpoken = true;
        speakText("即将完成，请继续保持静止。");
      }
    }
    if (elapsed < durationMs) {
      rafId = window.requestAnimationFrame(tick);
      return;
    }
    spinComplete = true;
    stopSound();
    if (progressFill) progressFill.style.width = "100%";
    if (focusEl) focusEl.textContent = "转台已停，请点击「下一步」";
    if (chipEl) chipEl.textContent = "转台已停";
    speakText("测量完成，请点击下一步。");
  }

  rafId = window.requestAnimationFrame(tick);

  window.addEventListener("beforeunload", stopSound);
}

function renderStandbyPage(state) {
  const root = document.querySelector("[data-standby-page]");
  if (!root) return;
  const clockEl = root.querySelector("[data-standby-clock]");
  if (clockEl && !clockEl.dataset.standbyClockInit) {
    clockEl.dataset.standbyClockInit = "1";
    function tickClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      clockEl.textContent = `${h} : ${m} : ${s}`;
    }
    tickClock();
    window.setInterval(tickClock, 1000);
  }
}

function setupStandbyPage() {
  const root = document.querySelector("[data-standby-page]");
  if (!root || root.dataset.standbyInit === "1") return;
  root.dataset.standbyInit = "1";

  const homeHref = root.dataset.standbyHome || "./home.html";
  const tapZone = root.querySelector("[data-standby-tap-zone]");

  function goHome() {
    navigateToTarget(withStateQuery(homeHref, loadState()));
  }

  if (tapZone) {
    tapZone.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.target.closest("[data-standby-no-nav]")) return;
      event.preventDefault();
      goHome();
    });
  }
}

function setupMeasureSelectGesture(grid) {
  if (!grid || grid.dataset.gestureSelectInit === "1") return;
  grid.dataset.gestureSelectInit = "1";
  const cards = [...grid.querySelectorAll(".measure-select-card")];
  if (!cards.length) return;
  const holdMs = Number(grid.dataset.gestureHoldMs || 2000);
  let activeIndex = 0;
  let holdTimer = null;

  function setActive(index) {
    activeIndex = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      card.classList.toggle("is-active", i === activeIndex);
      card.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
    });
  }

  function clearHold() {
    if (holdTimer) {
      window.clearTimeout(holdTimer);
      holdTimer = null;
    }
    cards.forEach((card) => card.classList.remove("is-entering"));
  }

  function startHold() {
    clearHold();
    const card = cards[activeIndex];
    if (!card) return;
    card.classList.add("is-entering");
    holdTimer = window.setTimeout(() => {
      speakText(`识别通过，请点击「${card.dataset.choiceLabel || "测量"}」进入。`);
      cards.forEach((c) => c.classList.remove("is-entering"));
    }, holdMs);
  }

  setActive(0);
  startHold();

  cards.forEach((card, index) => {
    card.addEventListener("mouseenter", () => {
      setActive(index);
      startHold();
    });
    card.addEventListener("focus", () => {
      setActive(index);
      startHold();
    });
    card.addEventListener("click", clearHold);
  });

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        setActive(activeIndex + 1);
        startHold();
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        setActive(activeIndex - 1);
        startHold();
      }
    },
    true
  );
}

function setupTurntableAnthropometryCapture() {
  const root = document.querySelector("[data-turntable-anthropometry]");
  if (!root || root.dataset.anthropometryInit === "1") return;
  root.dataset.anthropometryInit = "1";

  const nextHref = root.dataset.anthropometryNext || "./standard-grip-prep.html";
  const statusEl = root.querySelector("[data-auto-detect-status]");
  const subtitleEl = root.closest("section")?.querySelector(".screen-subtitle");
  const focusEl = root.querySelector(".live-focus");
  const delay = Number(root.dataset.autoDetectDelay || 2600);
  const btn = root.querySelector("[data-anthropometry-next-btn]");
  const warningMode = new URLSearchParams(window.location.search).get("autoDetectMode") === "warning";

  function goNext() {
    navigateToTarget(withStateQuery(nextHref, loadState()));
  }

  if (warningMode) {
    root.classList.add("is-warning");
    if (subtitleEl) subtitleEl.textContent = "检测到姿态异常，请先调整姿势后再继续。";
    if (focusEl) focusEl.textContent = "请调整姿势";
    if (statusEl) statusEl.textContent = "姿势异常";
    speakText("检测到姿态异常，请先调整姿势。");
    return;
  }

  function runAnthropometryToastsAndMaybeNavigate(autoNavigate) {
    const state = loadState();
    const steps = [];
    let at = 0;

    if (state.heightMeasurementEnabled) {
      steps.push([at, () => {
        if (statusEl) statusEl.textContent = "身高测量中…";
        speakText("正在测量身高，请保持不动。");
      }]);
      at += 1600;
      steps.push([at, () => {
        patchState({ sessionHeightCm: state.sessionHeightCm || 165 });
        showDeviceToast("身高测量已完成");
        speakText("身高测量已完成。");
      }]);
      at += 900;
    }

    steps.push([at, () => {
      if (statusEl) statusEl.textContent = "体重测量中…";
      speakText("正在测量体重，请保持不动。");
    }]);
    at += 1400;
    steps.push([at, () => {
      patchState({ sessionWeightKg: state.sessionWeightKg || 56.8 });
      showDeviceToast("体重测量已完成");
      speakText("体重测量已完成。");
      if (statusEl) statusEl.textContent = autoNavigate ? "即将进入扶手准备" : "请点击「继续测量」进入下一步";
      if (autoNavigate) window.setTimeout(goNext, 700);
    }]);

    steps.forEach(([ms, fn]) => window.setTimeout(fn, ms));
  }

  function completeDetectionVisual() {
    root.classList.add("is-aligned");
    const scene = root.querySelector(".bodycomp-prep-scene");
    if (scene) scene.classList.add("is-aligned");
    if (statusEl) statusEl.textContent = "识别通过";
    speakText("识别通过。");
    if (btn) {
      btn.removeAttribute("disabled");
      btn.setAttribute("aria-disabled", "false");
    }
  }

  if (!isDemoManualAdvance()) {
    let autoStarted = false;
    function runAnthropometrySequenceAuto() {
      if (autoStarted) return;
      autoStarted = true;
      completeDetectionVisual();
      runAnthropometryToastsAndMaybeNavigate(true);
    }
    if (statusEl) statusEl.textContent = "正在识别…";
    speakText(root.dataset.voiceText || "请站上转台，并确保足底与金属脚印充分接触。");
    window.setTimeout(runAnthropometrySequenceAuto, delay);
    return;
  }

  let detectionComplete = false;
  let toastsDone = false;
  let toastTimers = [];

  function clearToastTimers() {
    toastTimers.forEach((id) => window.clearTimeout(id));
    toastTimers = [];
  }

  function setBtnLabel(text) {
    if (btn) btn.textContent = text;
  }

  function onAnthropometryBtnClick(event) {
    event.preventDefault();
    if (!detectionComplete) return;
    if (!toastsDone) {
      btn.disabled = true;
      setBtnLabel("采集中…");
      runAnthropometryToastsAndMaybeNavigate(false);
      const s = loadState();
      const toastEndMs = s.heightMeasurementEnabled ? 2500 + 1400 : 1400;
      const doneId = window.setTimeout(() => {
        toastsDone = true;
        btn.disabled = false;
        setBtnLabel("继续测量");
        if (statusEl) statusEl.textContent = "识别通过，可进入下一步";
      }, toastEndMs + 200);
      toastTimers.push(doneId);
      return;
    }
    goNext();
  }

  if (btn) {
    btn.addEventListener("click", onAnthropometryBtnClick);
    btn.setAttribute("disabled", "disabled");
    btn.setAttribute("aria-disabled", "true");
    setBtnLabel("下一步");
  }

  if (statusEl) statusEl.textContent = "正在识别…";
  speakText(root.dataset.voiceText || "请站上转台，并确保足底与金属脚印充分接触。");

  const detectTimer = window.setTimeout(() => {
    detectionComplete = true;
    completeDetectionVisual();
    setBtnLabel("下一步");
  }, delay);

  setActivePageDemo({
    cancel: () => {
      window.clearTimeout(detectTimer);
      clearToastTimers();
    }
  });
}

function setupHeightConfirmPage() {
  const root = document.querySelector("[data-height-confirm-page]");
  if (!root) return;
  const editableWrap = root.querySelector("[data-height-editable-wrap]");
  const minusBtn = root.querySelector("[data-height-minus]");
  const plusBtn = root.querySelector("[data-height-plus]");
  const heightInput = root.querySelector("[data-height-input]");
  const confirmBtn = root.querySelector("[data-height-confirm]");
  const hintEl = root.querySelector("#height-input-hint");
  const advanceSecs = Number(root.dataset.autoAdvanceSeconds || 20);
  let autoTimer = null;

  function clearAutoAdvance() {
    if (autoTimer) {
      window.clearTimeout(autoTimer);
      autoTimer = null;
    }
  }

  function scheduleAutoAdvance() {
    clearAutoAdvance();
    autoTimer = window.setTimeout(() => {
      goNext();
    }, advanceSecs * 1000);
  }

  function goNext() {
    clearAutoAdvance();
    patchState({ heightConfirmed: true });
    navigateToTarget(withStateQuery("./standard-next-step.html", loadState()));
  }

  function renderHeight() {
    const state = loadState();
    const visible = !!state.heightResultVisible;
    if (editableWrap) editableWrap.hidden = !visible;
    if (minusBtn) {
      minusBtn.disabled = !visible;
      minusBtn.setAttribute("aria-disabled", visible ? "false" : "true");
    }
    if (plusBtn) {
      plusBtn.disabled = !visible;
      plusBtn.setAttribute("aria-disabled", visible ? "false" : "true");
    }
    if (heightInput) {
      heightInput.value = visible ? String(state.sessionHeightCm) : "";
      heightInput.disabled = !visible;
    }
    if (hintEl) hintEl.hidden = !visible;
  }

  function adjustHeight(delta) {
    const state = loadState();
    if (!state.heightResultVisible) return;
    const next = Math.min(200, Math.max(130, state.sessionHeightCm + delta));
    patchState({ sessionHeightCm: next, heightConfirmed: false });
    renderHeight();
    scheduleAutoAdvance();
  }

  minusBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    adjustHeight(-1);
  });
  plusBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    adjustHeight(1);
  });

  heightInput?.addEventListener("change", () => {
    if (heightInput.disabled) return;
    const raw = Number(heightInput.value);
    if (!Number.isFinite(raw)) return;
    const next = Math.min(200, Math.max(130, Math.round(raw)));
    patchState({ sessionHeightCm: next, heightConfirmed: false });
    renderHeight();
    scheduleAutoAdvance();
  });
  heightInput?.addEventListener("input", () => {
    if (heightInput.disabled) return;
    scheduleAutoAdvance();
  });
  heightInput?.addEventListener("focus", () => {
    if (heightInput.disabled) return;
    scheduleAutoAdvance();
  });

  confirmBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    goNext();
  });

  renderHeight();
  scheduleAutoAdvance();
  setActivePageDemo({ cancel: clearAutoAdvance });
}

function setupWeightStandaloneFlow() {
  const measuringRoot = document.querySelector("[data-weight-standalone-measuring]");
  if (measuringRoot && measuringRoot.dataset.weightFlowInit !== "1") {
    measuringRoot.dataset.weightFlowInit = "1";
    const nextHref = measuringRoot.dataset.weightNext || "./weight-standalone-result.html";
    const panels = {
      stand: measuringRoot.querySelector('[data-weight-phase-panel="stand"]'),
      "gauge-idle": measuringRoot.querySelector('[data-weight-phase-panel="gauge-idle"]'),
      "gauge-measuring": measuringRoot.querySelector('[data-weight-phase-panel="gauge-measuring"]')
    };
    const timers = [];

    function clearTimers() {
      timers.forEach((id) => window.clearTimeout(id));
      timers.length = 0;
    }

    function setPhase(next) {
      measuringRoot.dataset.weightPhase = next;
      Object.entries(panels).forEach(([key, el]) => {
        if (el) el.hidden = key !== next;
      });
    }

    function goToResult() {
      const w = 54 + Math.random() * 6;
      patchState({
        sessionWeightKg: Math.round(w * 10) / 10,
        lastStandaloneWeightAt: new Date().toISOString()
      });
      navigateToTarget(withStateQuery(nextHref, loadState()));
    }

    function startGaugeAnimationThenResult() {
      const fill = panels["gauge-measuring"]?.querySelector(".weight-gauge-fill--animate");
      let done = false;
      function finish() {
        if (done) return;
        done = true;
        goToResult();
      }
      if (fill) {
        fill.classList.remove("is-running");
        void fill.offsetWidth;
        fill.classList.add("is-running");
        fill.addEventListener("animationend", finish, { once: true });
        timers.push(window.setTimeout(finish, 2800));
      } else {
        timers.push(window.setTimeout(finish, 2200));
      }
    }

    speakText("请站上转台，双手自然下垂，准备测量体重。");

    timers.push(
      window.setTimeout(() => {
        setPhase("gauge-idle");
        speakText("请站在转台上，双手垂放，自然站立，保持静止。");
      }, 2200)
    );

    timers.push(
      window.setTimeout(() => {
        setPhase("gauge-measuring");
        speakText("正在读取体重，请保持不动。");
        startGaugeAnimationThenResult();
      }, 4500)
    );

    setActivePageDemo({ cancel: clearTimers });
  }

  const resultRoot = document.querySelector("[data-weight-standalone-result]");
  if (!resultRoot) return;
  const returnHref = resultRoot.dataset.resultReturn || "./standby.html";
  const idleSecondsTotal = Number(resultRoot.dataset.idleSeconds || 20);
  let remain = idleSecondsTotal;
  let idleInterval = null;

  function clearIdleCountdown() {
    if (idleInterval) {
      window.clearInterval(idleInterval);
      idleInterval = null;
    }
  }

  function syncIdleHint() {
    const labelEl = resultRoot.querySelector("[data-weight-idle-label]");
    const countEl = resultRoot.querySelector("[data-weight-idle-countdown]");
    if (labelEl) labelEl.textContent = `${remain} 秒无操作将返回项目选择`;
    if (countEl) countEl.textContent = String(remain);
  }

  function returnHome() {
    clearIdleCountdown();
    navigateToTarget(withStateQuery(returnHref, loadState()));
  }

  function startIdleCountdown() {
    clearIdleCountdown();
    remain = idleSecondsTotal;
    syncIdleHint();
    idleInterval = window.setInterval(() => {
      remain -= 1;
      if (remain <= 0) {
        returnHome();
        return;
      }
      syncIdleHint();
    }, 1000);
  }

  resultRoot.querySelectorAll("[data-weight-return-now]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      returnHome();
    });
  });

  startIdleCountdown();
  setActivePageDemo({ cancel: clearIdleCountdown });
}

function setupMeasurementWarningState() {
  if (!isWarningMode()) return;

  const shoulderRoot = document.querySelector(".device--shoulder-measure");
  if (!shoulderRoot) return;
  shoulderRoot.classList.add("is-warning");
  const statusEl = shoulderRoot.querySelector(".single-shoulder-progress-status");
  const stepsEl = shoulderRoot.querySelector(".single-shoulder-progress-steps");
  const infoList = shoulderRoot.querySelector(".single-shoulder-info-list");
  const liveStage = shoulderRoot.querySelector(".single-shoulder-live");
  if (statusEl) statusEl.textContent = "姿势异常";
  if (stepsEl) {
    stepsEl.innerHTML = '<span class="is-current">姿势异常</span><span class="single-shoulder-progress-sep">››</span><span class="is-next">请先调整</span>';
  }
  if (infoList) {
    infoList.innerHTML = '<li>检测到姿势异常，请先调整后再继续。</li><li>恢复稳定姿态后，可重新开始当前动作。</li>';
  }
  if (liveStage) liveStage.classList.add("is-warning");
  speakText("检测到姿势异常，请先调整姿势。");
}

document.addEventListener("DOMContentLoaded", () => {
  bindConfigControls();
  bindDemoPlaceholders();
  bindActionLinks();
  renderState();
  setupVersionDisplay();
  setupChoiceHighlight();
  setupFinishCompletionPage();
  setupFinishAutoAdvance();
  setupFinishGesturePage();
  setupSchemeThreeGestureDemo();
  setupPrepGestureAdvance();
  setupAutoDetectAdvance();
  setupTipCarousel();
  setupGuideSequence();
  setupDemoAdvance();
  setupStageAdvance();
  setupGeneratingFlow();
  setupReportDetail();
  setupOrderSortList();
  setupMeasurementWarningState();
  setupMeasuringTurntable();
  setupTurntableAnthropometryCapture();
  setupHeightConfirmPage();
  setupWeightStandaloneFlow();
  setupStandbyPage();
  setupVoice();
});

window.VAProDemo = {
  defaultState,
  loadState,
  saveState,
  patchState,
  startSession,
  completeGroup,
  getQuickItemMeta,
  getStandardFlowEntryHref,
  isAnyPrimaryEnabled,
  isAnyHomeMeasurementEnabled,
  isDynamicLabVisible,
  resolveDynamicLabEntryHref,
  getHomeMeasurementTiles,
  isAnySingleEnabled,
  isSingleItemEnabled,
  isQuickSingleAvailable,
  withStateQuery,
  resolvePostMeasuringHref,
  showDeviceToast,
  formatSessionHeight,
  formatSessionWeight,
  isDemoManualAdvance,
  MEASUREMENT_ITEMS,
  sanitizeOrderKeys,
  formatOrderPreview,
  mapMeasurementConfigFromWellnessHubDemo,
  DEFAULT_REPORT_VISIBILITY
};
