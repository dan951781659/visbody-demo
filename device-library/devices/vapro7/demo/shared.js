const STORAGE_KEY = "vapro7-demo-state";
const MEASUREMENT_CONFIG_KEY = "vapro7-measurement-config";

/** Device-side toggles (PRD §11): localStorage wins over stale URL query. Hub 下发项不在此集合。 */
const DEVICE_PERSISTED_KEYS = new Set([
  "voiceEnabled",
  "bodyCompositionPrepEnabled",
  "deviceLanguage"
]);

function t(key, fallback, params) {
  if (typeof window.Vapro7I18n?.t === "function") {
    return window.Vapro7I18n.t(key, fallback, params);
  }
  return fallback ?? key;
}

function getSpeechLang() {
  const lang = window.Vapro7I18n?.getDeviceLanguage?.(loadState()) || "zh";
  return lang === "de" ? "de-DE" : "zh-CN";
}

/** WellnessHub 下发项：只存 vapro7-measurement-config，不写回 vapro7-demo-state。 */
const HUB_MANAGED_STATE_KEYS = [
  "measurementRuntimeMode",
  "comprehensiveEnabled",
  "postureModeEnabled",
  "bodyCompSingleEnabled",
  "circumferenceSingleEnabled",
  "bodycompGirthModeEnabled",
  "girthOnlyModeEnabled",
  "balanceModeEnabled",
  "singleShoulderEnabled",
  "singleNeckEnabled",
  "dynamicLabEnabled",
  "heightMeasurementEnabled",
  "heightConfirmRequired",
  "weightStandaloneEnabled",
  "homeMeasurementOrderKeys",
  "reportVisibility"
];

function stripHubManagedState(state) {
  if (!state || typeof state !== "object") return state;
  const out = { ...state };
  HUB_MANAGED_STATE_KEYS.forEach((key) => {
    delete out[key];
  });
  return out;
}

let __vapro7DemoStateMemory = null;
const REPORT_URL = "./report-scan-login.html";
const DEMO_VERSION_FALLBACK = "1.9.7";
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
  bodycompGirth: "一圈综合采集",
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
    gestureHint: "请站上转台，握紧扶手",
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
    gestureHint: "",
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
    gestureHint: "请站上转台，握紧扶手",
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
    gestureHint: "",
    illustration: HOME_SELECT_ILLUSTRATIONS.generic,
    measurementMode: "circumferenceSingle",
    startSession: true,
    statefulLink: true
  },
  bodycompGirth: {
    title: "身体成分",
    displayTitle: "身体成分",
    desc: "体重、体成分、围度、身高一次出结果",
    descLong: "快速测量：体重、体成分、围度、身高、体态一次出结果，适合首次到店用户。",
    benefitDesc: "体重、体成分、围度、身高、体态一次完成",
    gestureHint: "请站上转台，握紧扶手",
    illustration: HOME_SELECT_ILLUSTRATIONS.posture,
    measurementMode: "bodycompGirth",
    startSession: true,
    standardFlowEntry: true
  },
  girthOnly: {
    title: "体围测量",
    displayTitle: "体围测量",
    desc: "单体围采集流程",
    descLong: "专注体围维度采集，流程更短，适合只需围度数据的场景。",
    benefitDesc: "了解您的腰围、臀围、四肢围度等",
    gestureHint: "",
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
    gestureHint: "",
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
    gestureHint: "",
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
    gestureHint: "",
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
  bodycompGirth: "成分",
  girthOnly: "体围",
  dynamicLab: "动态",
  balance: "平衡"
};

const MEASUREMENT_ITEMS = {
  standard: { key: "standard", title: "快速测量", href: "./standard-user-prep.html", group: "standard" },
  pro: { key: "pro", title: "体态测量", href: "./pro-user-prep.html", group: "pro" },
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
  bodycompGirth: { key: "bodycompGirth", title: "身体成分", href: "./standard-user-prep.html", group: "bodycompGirth" },
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
    return !!(state.bodyCompSingleEnabled || state.bodycompGirthModeEnabled);
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
    weightStandaloneEnabled: false,
    sessionCycleStartKey: null,
    sessionHeightCm: 165,
    sessionWeightKg: 56.8,
    heightConfirmed: false,
    lastStandaloneWeightAt: null,
    reportVisibility: { ...DEFAULT_REPORT_VISIBILITY },
    deviceLanguage: "zh",
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
  if (merged.deviceLanguage !== "zh" && merged.deviceLanguage !== "de") merged.deviceLanguage = "zh";
  if (typeof merged.heightMeasurementEnabled !== "boolean") merged.heightMeasurementEnabled = false;
  if (typeof merged.heightConfirmRequired !== "boolean") merged.heightConfirmRequired = false;
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
    const bgh = hubConfigBool(cfg.bodycompGirthModeEnabled);
    if (typeof bgh === "boolean") out.bodycompGirthModeEnabled = bgh;
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
    if (
      out.measurementRuntimeMode === RUNTIME_MODE_PROFESSIONAL &&
      out.bodyCompSingleEnabled &&
      out.circumferenceSingleEnabled &&
      !Object.prototype.hasOwnProperty.call(cfg, "bodycompGirthModeEnabled")
    ) {
      out.bodycompGirthModeEnabled = true;
      out.bodyCompSingleEnabled = false;
      out.circumferenceSingleEnabled = false;
    }
    if (out.bodycompGirthModeEnabled) {
      out.bodyCompSingleEnabled = false;
      out.circumferenceSingleEnabled = false;
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
    if (key === "deviceLanguage") {
      if (saved.deviceLanguage === "zh" || saved.deviceLanguage === "de") {
        merged.deviceLanguage = saved.deviceLanguage;
      }
    } else if (typeof saved[key] === "boolean") {
      merged[key] = saved[key];
    }
  });
}

function loadState() {
  const fallback = defaultState();
  const hub = mapMeasurementConfigFromWellnessHubDemo();
  const rawSaved = parseSavedState();
  const savedSession =
    rawSaved && typeof rawSaved === "object" ? stripHubManagedState(rawSaved) : null;
  const merged = {
    ...fallback,
    ...(savedSession || {}),
    ...getQueryOverrides(),
    ...hub
  };
  applyDevicePersistedFromSaved(merged, rawSaved && typeof rawSaved === "object" ? rawSaved : null);
  return normalizeState(merged);
}

function saveState(state) {
  const persisted = stripHubManagedState(state);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    __vapro7DemoStateMemory = null;
  } catch {
    __vapro7DemoStateMemory = persisted;
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

function startSession(cycleStartKey) {
  const meta = cycleStartKey ? HOME_TILE_META[cycleStartKey] : null;
  const modeFromTile =
    cycleStartKey === "weightStandalone"
      ? "weightStandalone"
      : meta?.measurementMode || cycleStartKey || defaultState().currentMeasurementMode;
  return patchState({
    currentSessionId: generateSessionId(),
    sessionCycleStartKey: cycleStartKey || null,
    completedGroups: defaultState().completedGroups,
    currentMeasurementMode: modeFromTile
  });
}

function finishKeyFromHomeTile(tileKey, state) {
  const s = state || loadState();
  if (tileKey === "dynamicLab") {
    if (s.singleShoulderEnabled) return "singleShoulder";
    if (s.singleNeckEnabled) return "singleNeck";
    return "dynamicLab";
  }
  return tileKey;
}

/** 测量循环池：常规测量项顺序，不含独立体重（PRD §6.2） */
function getMeasurementCycleKeys(state) {
  const s = state || loadState();
  return resolveFinishOrderKeys(s).filter((key) => {
    if (key === "weightStandalone") return false;
    const item = MEASUREMENT_ITEMS[key];
    return item && isMeasurementAvailable(item, s);
  });
}

function resolveSessionCycleStartKey(state) {
  const s = state || loadState();
  const cycle = getMeasurementCycleKeys(s);
  if (!cycle.length) return null;
  let start = finishKeyFromHomeTile(s.sessionCycleStartKey, s);
  if (start && cycle.includes(start)) return start;
  return cycle[0];
}

function buildCycleVisitOrder(state) {
  const s = state || loadState();
  const cycle = getMeasurementCycleKeys(s);
  const startKey = resolveSessionCycleStartKey(s);
  const startIdx = cycle.indexOf(startKey);
  if (startIdx === -1) return [...cycle];
  const visitOrder = [];
  for (let i = 0; i < cycle.length; i += 1) {
    visitOrder.push(cycle[(startIdx + i) % cycle.length]);
  }
  return visitOrder;
}

function isLastItemInCycle(currentKey, state) {
  return !getNextMeasurementRecommendation(currentKey, "", state);
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
    if (itemKey === "standard" || itemKey === "girthOnly") return false;
    if (itemKey === "bodycompGirth") return !!s.bodycompGirthModeEnabled;
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
  if (shoulder && neck) return t("dynamicLab.both");
  if (shoulder) return t("dynamicLab.shoulder");
  if (neck) return t("dynamicLab.neck");
  return t("dynamicLab.generic");
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
  if (key === "pro") return getProFlowEntryHref(state);
  if (key === "bodyCompSingle") return "./standard-user-prep.html";
  if (key === "bodycompGirth") return getStandardFlowEntryHref(state);
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
    let gestureHint = "";
    if (Object.prototype.hasOwnProperty.call(meta, "gestureHint")) {
      gestureHint = meta.gestureHint ? t(`tile.${key}.gestureHint`, meta.gestureHint) : "";
    } else {
      gestureHint = t("home.gestureHint");
    }
    return {
      key,
      title: t(`tile.${key}.title`, meta.title || MEASUREMENT_ITEMS[key]?.title || key),
      displayTitle: t(
        `tile.${key}.displayTitle`,
        meta.displayTitle || meta.title || MEASUREMENT_ITEMS[key]?.title || key
      ),
      desc: key === "dynamicLab" ? getDynamicLabSubtitle(s) : t(`tile.${key}.desc`, descBase),
      benefitDesc:
        key === "dynamicLab"
          ? getDynamicLabSubtitle(s)
          : t(`tile.${key}.benefitDesc`, meta.benefitDesc || meta.descLong || descBase),
      gestureHint,
      illustration: meta.illustration || HOME_SELECT_ILLUSTRATIONS.generic,
      glyph: t(`glyph.${key}`, HOME_TILE_GLYPH[key] || meta.title?.slice(0, 2) || "测量"),
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
    link.dataset.cycleStartKey = tile.key;
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

  copy.appendChild(title);
  copy.appendChild(benefit);
  if (tile.gestureHint) {
    const hint = document.createElement("div");
    hint.className = "measure-select-card__hint";
    hint.textContent = tile.gestureHint;
    copy.appendChild(hint);
  }

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
    tag.textContent = t("common.recommended");
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
    shoulder: {
      title: t("quick.shoulderTitle"),
      desc: t("quick.shoulderDesc"),
      href: "./single-prepare-shoulder.html"
    },
    neck: {
      title: t("quick.neckTitle"),
      desc: t("quick.neckDesc"),
      href: "./single-prepare-neck.html"
    },
    balance: {
      title: t("quick.balanceTitle"),
      desc: t("quick.balanceDesc"),
      href: "./single-prepare-balance.html"
    }
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
  const tileKeys = getHomeMeasurementTileKeys(s).filter((key) => key !== "weightStandalone");
  return homeTileKeysToFinishOrderKeys(tileKeys, s);
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
    if (item.key === "standard" || item.key === "girthOnly") return false;
    if (item.key === "bodycompGirth") return !!state.bodycompGirthModeEnabled;
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
  const s = state || loadState();
  const visitOrder = buildCycleVisitOrder(s);
  if (!visitOrder.length || !currentKey) return null;

  const currentIdx = visitOrder.indexOf(currentKey);
  if (currentIdx === -1) return null;

  for (let i = currentIdx + 1; i < visitOrder.length; i += 1) {
    const key = visitOrder[i];
    if (s.completedGroups[key]) continue;
    const item = MEASUREMENT_ITEMS[key];
    if (item && isMeasurementAvailable(item, s)) {
      return { ...item, href: getHomeTileHref(key, s) };
    }
  }
  for (let i = 0; i < currentIdx; i += 1) {
    const key = visitOrder[i];
    if (s.completedGroups[key]) continue;
    const item = MEASUREMENT_ITEMS[key];
    if (item && isMeasurementAvailable(item, s)) {
      return { ...item, href: getHomeTileHref(key, s) };
    }
  }
  return null;
}

function normalizeFinishKey(key, state) {
  if (key === "girthOnly") return "circumferenceSingle";
  return key;
}

function measurementModeToFinishKey(mode, state) {
  const s = state || loadState();
  const key = String(mode || s.currentMeasurementMode || "standard");
  if (key === "dynamicLab") {
    if (s.singleShoulderEnabled && !s.completedGroups.singleShoulder) return "singleShoulder";
    if (s.singleNeckEnabled && !s.completedGroups.singleNeck) return "singleNeck";
    if (s.singleShoulderEnabled) return "singleShoulder";
    if (s.singleNeckEnabled) return "singleNeck";
  }
  return normalizeFinishKey(key, s);
}

function hasAnyCompletedGroup(state) {
  const s = state || loadState();
  return Object.values(s.completedGroups || {}).some(Boolean);
}

/** 完成页用：纠正首页动态卡片未绑定 action 时残留的 currentMeasurementMode */
function resolveFinishKeyForPage(state) {
  const s = state || loadState();
  const modeKey = measurementModeToFinishKey(s.currentMeasurementMode, s);
  const startTile = s.sessionCycleStartKey;
  if (!startTile) return modeKey;
  const startKey = finishKeyFromHomeTile(startTile, s);
  const cycle = getMeasurementCycleKeys(s);
  if (!cycle.length || !startKey || !cycle.includes(startKey)) return modeKey;
  if (!hasAnyCompletedGroup(s) && modeKey !== startKey && cycle.includes(modeKey)) {
    return startKey;
  }
  return modeKey;
}

function finishKeyDisplayName(finishKey) {
  const key = normalizeFinishKey(finishKey, loadState());
  const itemKey = `item.${key}.title`;
  const meta = HOME_TILE_META[key];
  const fallback = meta?.displayTitle || meta?.title || MEASUREMENT_ITEMS[key]?.title || key;
  return t(itemKey, fallback);
}

function finishKeyShortLabel(finishKey) {
  const key = normalizeFinishKey(finishKey, loadState());
  if (HOME_TILE_GLYPH[key]) return HOME_TILE_GLYPH[key];
  return finishKeyDisplayName(key).replace(/测量$/, "");
}

const MEASUREMENT_PREP_COPY = {
  withPosture: [
    {
      labelKey: "prep.item.fittedClothing",
      label: "穿着贴身衣物",
      visual: "arms"
    },
    {
      labelKey: "prep.item.noExercise",
      label: "测前避免剧烈运动",
      visual: "still"
    },
    {
      labelKey: "prep.item.barefoot",
      label: "赤脚测量",
      visual: "feet"
    },
    {
      labelKey: "prep.item.footElectrode",
      label: "足底贴合电极片",
      visual: "electrode"
    }
  ],
  bodycompGirthOnly: [
    {
      labelKey: "prep.item.fittedClothing",
      label: "穿着贴身衣物",
      visual: "arms"
    },
    {
      labelKey: "prep.item.noExercise",
      label: "测前避免剧烈运动",
      visual: "still"
    },
    {
      labelKey: "prep.item.barefoot",
      label: "赤脚测量",
      visual: "feet"
    },
    {
      labelKey: "prep.item.footElectrode",
      label: "足底贴合电极片",
      visual: "electrode"
    }
  ]
};

const MEASUREMENT_TIPS_COPY = {
  withPosture: ["tip.still", "tip.naturalStance", "tip.breath", "tip.lookForward"],
  bodycompGirthOnly: ["tip.still", "tip.feetContact", "tip.breath", "tip.noChest"]
};

function resolveMeasurementModeKey(state) {
  const s = state || loadState();
  return normalizeFinishKey(s.currentMeasurementMode || resolveFinishKeyForPage(s), s);
}

function sessionIncludesPosture(state) {
  const s = state || loadState();
  const mode = resolveMeasurementModeKey(s);
  if (mode === "pro") return true;
  if (["bodyCompSingle", "bodycompGirth", "girthOnly", "circumferenceSingle"].includes(mode)) {
    return false;
  }
  if (mode === "standard") return !!s.postureModeEnabled;
  return !!s.postureModeEnabled;
}

function sessionIncludesBodyComp(state) {
  const s = state || loadState();
  const mode = resolveMeasurementModeKey(s);
  if (mode === "pro") return false;
  if (["bodyCompSingle", "bodycompGirth", "standard"].includes(mode)) return true;
  if (mode === "girthOnly" || mode === "circumferenceSingle") return false;
  return !!s.comprehensiveEnabled || !!s.bodyCompSingleEnabled || !!s.bodycompGirthModeEnabled;
}

function resolvePrepCopyProfile(state) {
  return sessionIncludesPosture(state) ? "withPosture" : "bodycompGirthOnly";
}

function getPrepChecklistItems(state) {
  const profile = resolvePrepCopyProfile(state);
  const items = MEASUREMENT_PREP_COPY[profile] || [];
  if (profile !== "withPosture") return items;
  return items.filter((item) => !item.requiresBodyComp || sessionIncludesBodyComp(state));
}

function getMeasurementTipLines(state) {
  const profile = resolvePrepCopyProfile(state);
  return MEASUREMENT_TIPS_COPY[profile] || MEASUREMENT_TIPS_COPY.withPosture;
}

const PREP_VISUAL_KEYS = ["feet", "electrode", "arms", "still"];

function renderPrepChecklist(container, state) {
  if (!container) return;
  const items = getPrepChecklistItems(state);
  container.classList.add("bodycomp-prep-grid");
  container.classList.remove("prep-checklist-grid");
  container.innerHTML = items
    .map((item, index) => {
      const visualKey = item.visual || PREP_VISUAL_KEYS[index] || "still";
      const highlight = index === 0 ? " is-highlight" : "";
      const speaker =
        index === 0
          ? '<img class="bodycomp-prep-speaker" src="./assets/lanhu/prep-speaker.png" alt="" />'
          : "";
      return `<div class="bodycomp-prep-cell${highlight}">
        <div class="bodycomp-prep-visual bodycomp-prep-visual--${visualKey}">${speaker}</div>
        <p class="bodycomp-prep-caption">${t(item.labelKey, item.label)}</p>
      </div>`;
    })
    .join("");
}

function renderMeasurementTips(container, state) {
  if (!container || container.hasAttribute("data-tip-static")) return;
  const lines = getMeasurementTipLines(state);
  const noIndex = container.hasAttribute("data-tip-no-index");
  const titleEl = container.querySelector(".measurement-tips-title");
  const externalTitle = container.closest(".device-tips-carousel-section")?.querySelector(".countdown-tips-heading");
  const titleHtml =
    noIndex || externalTitle
      ? ""
      : titleEl
        ? titleEl.outerHTML
        : `<p class="measurement-tips-title">${t("prep.tipsTitle")}</p>`;
  container.innerHTML =
    titleHtml +
    lines
      .map((lineKey, index) => {
        const line = typeof lineKey === "string" && lineKey.startsWith("tip.")
          ? t(lineKey)
          : lineKey;
        return `<p class="measurement-tip-item${index === 0 ? " is-active" : ""}" data-tip-item>${line}</p>`;
      })
      .join("");
}

function setupMeasurementCopyPages() {
  const state = loadState();
  document.querySelectorAll("[data-prep-checklist]").forEach((el) => {
    renderPrepChecklist(el, state);
  });
  document.querySelectorAll("[data-tip-carousel]").forEach((el) => {
    renderMeasurementTips(el, state);
  });
  mountAllTipCarousels();
}

const tipCarouselTimers = new WeakMap();

function mountTipCarousel(root) {
  const existing = tipCarouselTimers.get(root);
  if (existing) {
    window.clearInterval(existing);
    tipCarouselTimers.delete(root);
  }

  const items = [...root.querySelectorAll("[data-tip-item]")];
  if (items.length < 2) return;

  let idx = 0;
  const intervalMs = Number(root.dataset.tipInterval || 2600);
  const noIndex = root.hasAttribute("data-tip-no-index");
  let indexEl = root.querySelector(".measurement-tips-index");

  if (!noIndex) {
    if (!indexEl) {
      indexEl = document.createElement("p");
      indexEl.className = "measurement-tips-index";
      indexEl.setAttribute("aria-live", "polite");
      const section = root.closest(".device-tips-carousel-section");
      const titleEl =
        section?.querySelector(".countdown-tips-heading") ||
        root.querySelector(".measurement-tips-title");
      if (titleEl) titleEl.insertAdjacentElement("afterend", indexEl);
      else root.prepend(indexEl);
    }
  } else if (indexEl) {
    indexEl.remove();
    indexEl = null;
  }

  function render() {
    items.forEach((item, i) => {
      item.classList.toggle("is-active", i === idx);
    });
    if (indexEl) indexEl.textContent = `${idx + 1}/${items.length}`;
  }

  render();
  const timerId = window.setInterval(() => {
    idx = (idx + 1) % items.length;
    render();
  }, intervalMs);
  tipCarouselTimers.set(root, timerId);
}

function mountAllTipCarousels() {
  document.querySelectorAll("[data-tip-carousel]").forEach((root) => {
    mountTipCarousel(root);
  });
}

function getProFlowEntryHref(state) {
  const s = state || loadState();
  return withStateQuery("./pro-user-prep.html", s);
}

/** 完成页摘要：与刚完成项目一致（PRD §6.1）；身高/体重在 getFinishSummaryRows 中按开关插入 */
const FINISH_SUMMARY_BASE_ROWS = {
  standard: [
    { nameKey: "metric.bodyComp", name: "体成分", detailKey: "common.measuredDone", detail: "已测完" },
    { nameKey: "metric.posture", name: "体态", detailKey: "common.measuredDone", detail: "已测完" },
    { nameKey: "metric.girth", name: "体围", detailKey: "common.measuredDone", detail: "已测完" }
  ],
  bodyCompSingle: [
    { nameKey: "metric.bodyComp", name: "体成分", detailKey: "common.measuredDone", detail: "已测完" }
  ],
  pro: [{ nameKey: "metric.posture", name: "体态", detailKey: "common.measuredDone", detail: "已测完" }],
  circumferenceSingle: [
    { nameKey: "metric.girth", name: "体围", detailKey: "common.measuredDone", detail: "已测完" }
  ],
  balance: [{ nameKey: "metric.balance", name: "平衡", detailKey: "common.measuredDone", detail: "已测完" }],
  singleNeck: [
    { nameKey: "metric.neckFlex", name: "颈部屈伸", detailKey: "common.measuredDone", detail: "已测完" },
    { nameKey: "metric.neckSide", name: "颈部侧屈", detailKey: "common.measuredDone", detail: "已测完" },
    { nameKey: "metric.neckRotate", name: "颈部旋转", detailKey: "common.measuredDone", detail: "已测完" }
  ],
  singleShoulder: [
    { nameKey: "metric.shoulderAbduction", name: "外展上举", detailKey: "common.measuredDone", detail: "已测完" },
    { nameKey: "metric.shoulderFlexion", name: "前屈上举", detailKey: "common.measuredDone", detail: "已测完" }
  ],
  bodycompGirth: [
    { nameKey: "metric.bodyComp", name: "体成分", detailKey: "common.measuredDone", detail: "已测完" },
    { nameKey: "metric.girth", name: "体围", detailKey: "common.measuredDone", detail: "已测完" }
  ]
};

function localizeSummaryRow(row) {
  return {
    name: t(row.nameKey, row.name),
    detail: row.detailKey ? t(row.detailKey, row.detail) : row.detail
  };
}

function getRemeasureHref(finishKey, state) {
  if (finishKey === "pro") return getProFlowEntryHref(state);
  if (finishKey === "circumferenceSingle") return LEGACY_GIRTH_ONLY_HREF;
  if (finishKey === "bodycompGirth") return getStandardFlowEntryHref(state);
  if (finishKey === "balance") return "./single-prepare-balance.html";
  if (finishKey === "singleShoulder") return "./single-prepare-shoulder.html";
  if (finishKey === "singleNeck") return "./single-prepare-neck.html";
  if (finishKey === "bodyCompSingle" || finishKey === "standard") {
    return getStandardFlowEntryHref(state);
  }
  return getHomeTileHref(finishKey, state);
}

function getFinishSummaryRows(state) {
  const s = state || loadState();
  const finishKey = resolveFinishKeyForPage(s);
  const base = FINISH_SUMMARY_BASE_ROWS[finishKey];
  if (base) {
    const rows = base.map((r) => localizeSummaryRow(r));
    if (finishKey === "bodyCompSingle") {
      if (deriveHeightMeasurementEnabled(s)) {
        rows.push({ name: t("metric.height"), detail: formatSessionHeight(s) });
      }
      rows.push({ name: t("metric.weight"), detail: formatSessionWeight(s) });
      return rows;
    }
    if (finishKey === "bodycompGirth") {
      if (deriveHeightMeasurementEnabled(s)) {
        rows.splice(2, 0, { name: t("metric.height"), detail: formatSessionHeight(s) });
      }
      rows.push({ name: t("metric.weight"), detail: formatSessionWeight(s) });
      return rows;
    }
    if (finishKey === "standard") {
      if (deriveHeightMeasurementEnabled(s)) {
        rows.splice(3, 0, { name: t("metric.height"), detail: formatSessionHeight(s) });
      }
      rows.push({ name: t("metric.weight"), detail: formatSessionWeight(s) });
      return rows;
    }
    return rows;
  }

  return [{ name: finishKeyDisplayName(finishKey), detail: t("common.measuredDone") }];
}

function renderFinishSummary(container, state) {
  if (!container) return;
  const rows = getFinishSummaryRows(state);
  container.classList.toggle("is-single-summary", rows.length === 1);
  container.innerHTML = rows
    .map(
      (row) => `
    <div class="summary-check-row">
      <div class="summary-check-main">
        <span class="summary-check-name">${row.name}</span>
        <span class="summary-check-detail">${row.detail || t("common.measuredDone")}</span>
      </div>
      <span class="summary-check-mark" aria-hidden="true">✓</span>
    </div>`
    )
    .join("");
}

function renderFinishPageHeadings(root, finishKey, state) {
  const isPro = getMeasurementRuntimeMode(state) === RUNTIME_MODE_PROFESSIONAL;
  const modeLabel = isPro ? t("common.proMode") : t("common.quickMode");
  const sectionEl = root.querySelector("[data-finish-section]");
  if (sectionEl) {
    sectionEl.textContent = `${modeLabel} · ${finishKeyDisplayName(finishKey)}`;
    sectionEl.hidden = false;
  }
}

function syncFinishGroupActions(group, state) {
  const s = state || loadState();
  const flow = group.dataset.finishFlow || "";
  const finishKey = resolveFinishKeyForPage(s);
  group.dataset.finishCurrent = finishKey || group.dataset.finishCurrent || "";

  const recommendation = getNextMeasurementRecommendation(group.dataset.finishCurrent, flow, s);
  const isLast = !recommendation;
  const nextOption = group.querySelector("[data-finish-option='next']");
  const reportOption = group.querySelector("[data-finish-option='report']");

  if (reportOption) {
    const href = reportOption.getAttribute("href");
    const reportHref = href && href !== "#" ? href : REPORT_URL;
    reportOption.setAttribute("href", withStateQuery(reportHref, s));
    reportOption.dataset.choiceLabel = t("finish.completeMeasure");
    const reportStrong = reportOption.querySelector("strong");
    if (reportStrong) reportStrong.textContent = t("finish.completeMeasure");
    const reportSpan = reportOption.querySelector("span:not(strong)");
    if (reportSpan) reportSpan.textContent = t("finish.scanReportShort");
  }

  if (nextOption) {
    if (recommendation && recommendation.href) {
      nextOption.hidden = false;
      nextOption.setAttribute("href", withStateQuery(recommendation.href, s));
      const recTitle = finishKeyDisplayName(recommendation.key);
      const continueLabel = t("finish.continueItem", `继续${recTitle}`, { title: recTitle });
      nextOption.dataset.choiceLabel = continueLabel;
      nextOption.dataset.nextMeasurementKey = recommendation.key;
      const title = nextOption.querySelector("[data-next-title]");
      if (title) title.textContent = continueLabel;
      const desc = nextOption.querySelector("[data-next-desc]");
      if (desc)
        desc.textContent = t(`recommend.${recommendation.key}`, NEXT_RECOMMEND_DESC[recommendation.key] || "");
      if (!nextOption.dataset.finishNextBound) {
        nextOption.dataset.finishNextBound = "1";
        nextOption.addEventListener("click", () => {
          const key = nextOption.dataset.nextMeasurementKey;
          if (key) patchState({ currentMeasurementMode: key });
        });
      }
    } else {
      nextOption.hidden = true;
    }
  }

  return { recommendation, isLast, finishKey: group.dataset.finishCurrent, nextOption, reportOption };
}

function applyFinishPageUi(root, state) {
  let s = state || loadState();
  let finishKey = resolveFinishKeyForPage(s);
  const modeDerived = measurementModeToFinishKey(s.currentMeasurementMode, s);
  if (finishKey !== modeDerived) {
    patchState({ currentMeasurementMode: finishKey });
    s = loadState();
    finishKey = resolveFinishKeyForPage(s);
  }
  if (finishKey && !s.completedGroups[finishKey]) {
    completeGroup(finishKey);
    s = loadState();
  }

  renderFinishPageHeadings(root, finishKey, s);
  renderFinishSummary(root.querySelector("[data-finish-summary]"), s);

  const finishGroup = root.querySelector("[data-finish-group]");
  let recommendation = null;
  let isLast = true;
  if (finishGroup) {
    finishGroup.dataset.finishFlow =
      getMeasurementRuntimeMode(s) === RUNTIME_MODE_PROFESSIONAL ? "pro" : "standard";
    ({ recommendation, isLast } = syncFinishGroupActions(finishGroup, s));
    finishGroup.classList.toggle("is-single-action", isLast);
  }

  root.querySelectorAll(".screen-subtitle").forEach((el) => {
    el.remove();
  });

  root.querySelectorAll("[data-gesture-bubble]").forEach((el) => {
    el.textContent = isLast ? t("finish.gestureLast") : t("finish.gestureNext");
  });

  const voiceRoot = root.closest("[data-voice-text]") || root;
  if (voiceRoot.dataset) {
    voiceRoot.dataset.voiceText = isLast ? t("finish.voiceLast") : t("finish.voiceNext");
  }

  const remeasure = root.querySelector("[data-finish-remeasure]");
  if (remeasure) {
    const href = getRemeasureHref(finishKey, s);
    remeasure.dataset.finishRemeasureKey = finishKey;
    remeasure.setAttribute("href", appendReturnToFromPage(withStateQuery(href, s)));
    remeasure.textContent = t("finish.remeasure");
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

  return { finishKey, recommendation, isLast, state: s };
}

function setupFinishCompletionPage() {
  document.querySelectorAll("[data-gesture-finish-page]").forEach((root) => {
    applyFinishPageUi(root, loadState());
  });

  document.querySelectorAll("[data-measuring-next]").forEach((el) => {
    if (el.dataset.measuringCompleteBound) return;
    el.dataset.measuringCompleteBound = "1";
    el.addEventListener("click", () => {
      const state = loadState();
      const finishKey = resolveFinishKeyForPage(state);
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
  params.set("weightStandalone", state.weightStandaloneEnabled ? "1" : "0");
  params.set("order", (state.measurementOrderKeys || DEFAULT_ORDER_KEYS).join(","));
  return params.toString();
}

function resolvePostMeasuringHref(state) {
  const s = state || loadState();
  if (!s.heightMeasurementEnabled || !s.heightConfirmRequired) {
    return "./standard-next-step.html";
  }
  const finishKey = resolveFinishKeyForPage(s);
  if (["standard", "bodyCompSingle", "bodycompGirth"].includes(finishKey)) {
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

/** 瞬时识别/采集状态：Toast + 可选语音，不写 panel。 */
function notifyDeviceStatus(messageKey, { speakKey = null, durationMs = 2400 } = {}) {
  showDeviceToast(t(messageKey), durationMs);
  if (speakKey) speakText(t(speakKey));
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
  utterance.lang = getSpeechLang();
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
  utterance.lang = getSpeechLang();
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
      labelKey: "guide.phase1.label",
      voiceKey: "guide.phase1.voice",
      subtitleKey: "guide.phase1.subtitle",
      focusKey: "guide.phase1.focus",
      chipAKey: "guide.phase1.chipA",
      titleKey: "guide.phase1.title",
      pose: "pose-boarding",
      sceneClass: "phase-stage-boarding",
      showFeet: true,
      points: [
        { titleKey: "guide.phase1.point1.title", bodyKey: "guide.phase1.point1.body" },
        { titleKey: "guide.phase1.point2.title", bodyKey: "guide.phase1.point2.body" }
      ]
    },
    {
      id: 2,
      labelKey: "guide.phase2.label",
      voiceKey: "guide.phase2.voice",
      subtitleKey: "guide.phase2.subtitle",
      focusKey: "guide.phase2.focus",
      chipAKey: "guide.phase2.chipA",
      titleKey: "guide.phase2.title",
      pose: "pose-hold",
      sceneClass: "phase-stage-rails",
      showFeet: false,
      points: [
        { titleKey: "guide.phase2.point1.title", bodyKey: "guide.phase2.point1.body" },
        { titleKey: "guide.phase2.point2.title", bodyKey: "guide.phase2.point2.body" }
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
    if (!phase?.voiceKey) return;
    speakText(t(phase.voiceKey));
  }

  function renderPhase(phaseId, shouldSpeak = false) {
    const phase = phases.find((item) => item.id === phaseId);
    if (!phase) return;
    currentPhase = phaseId;

    if (phaseLabelEl) phaseLabelEl.textContent = t(phase.labelKey);
    if (titleEl) titleEl.textContent = t(phase.titleKey);
    if (subtitleEl) subtitleEl.textContent = t(phase.subtitleKey);
    if (focusEl) focusEl.textContent = t(phase.focusKey);
    if (chipAEl) chipAEl.textContent = t(phase.chipAKey);
    if (titleAEl) titleAEl.textContent = t(phase.points[0]?.titleKey || "");
    if (bodyAEl) bodyAEl.textContent = t(phase.points[0]?.bodyKey || "");
    if (titleBEl) titleBEl.textContent = t(phase.points[1]?.titleKey || "");
    if (bodyBEl) bodyBEl.textContent = t(phase.points[1]?.bodyKey || "");
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
    stage.dataset.voiceText = t(phase.voiceKey);

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
      indexKey: "guide.legacy1.index",
      titleKey: "guide.legacy1.title",
      bodyKey: "guide.legacy1.body",
      focusKey: "guide.legacy1.focus",
      subtitleKey: "guide.legacy1.subtitle",
      voiceKey: "guide.legacy1.voice"
    },
    {
      indexKey: "guide.legacy2.index",
      titleKey: "guide.legacy2.title",
      bodyKey: "guide.legacy2.body",
      focusKey: "guide.legacy2.focus",
      subtitleKey: "guide.legacy2.subtitle",
      voiceKey: "guide.legacy2.voice"
    },
    {
      indexKey: "guide.legacy3.index",
      titleKey: "guide.legacy3.title",
      bodyKey: "guide.legacy3.body",
      focusKey: "guide.legacy3.focus",
      subtitleKey: "guide.legacy3.subtitle",
      voiceKey: "guide.legacy3.voice"
    },
    {
      indexKey: "guide.legacy4.index",
      titleKey: "guide.legacy4.title",
      bodyKey: "guide.legacy4.body",
      focusKey: "guide.legacy4.focus",
      subtitleKey: "guide.legacy4.subtitle",
      voiceKey: "guide.legacy4.voice"
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
    if (indexEl) indexEl.textContent = t(step.indexKey);
    if (titleEl) titleEl.textContent = t(step.titleKey);
    if (bodyEl) bodyEl.textContent = t(step.bodyKey);
    if (focusEl) focusEl.textContent = t(step.focusKey);
    if (subtitleEl) subtitleEl.textContent = t(step.subtitleKey);
    stage.dataset.voiceText = t(step.voiceKey);
    if (shouldSpeak) speakText(t(step.voiceKey));
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
  const spoken = { 3: t("countdown.digit3"), 2: t("countdown.digit2"), 1: t("countdown.digit1") };
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
  if (document.documentElement.dataset.vapro7ActionLinksBound === "1") return;
  document.documentElement.dataset.vapro7ActionLinksBound = "1";
  document.addEventListener(
    "click",
    (event) => {
      const el = event.target.closest("[data-action-link]");
      if (!el) return;

      const action = el.dataset.actionLink;
      const target = el.getAttribute("href") || el.dataset.next;
      const complete = el.dataset.completeGroup;
      const measurementMode = el.dataset.measurementMode;

      if (action === "reset-demo") {
        saveState(defaultState());
        renderState();
      }

      if (action === "start-session") {
        const cycleKey = el.dataset.cycleStartKey || null;
        if (cycleKey === "weightStandalone") {
          patchState({ currentMeasurementMode: "weightStandalone" });
        } else {
          startSession(cycleKey);
        }
      }
      if (measurementMode) {
        patchState({ currentMeasurementMode: measurementMode });
      }

      if (action === "set-language") {
        event.preventDefault();
        const lang = el.dataset.lang;
        if (lang === "zh" || lang === "de") {
          patchState({ deviceLanguage: lang });
        }
        return;
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
    },
    true
  );
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
    const idleEnabled = group.dataset.idleDefaultNext !== "off";
    const idleSecondsTotal = Number(group.dataset.idleSeconds || 20);
    const idleStartOnFirstClick = group.dataset.idleStart === "on-first-click";
    const idleFooter = group.querySelector(".scheme-three-idle-footer");
    const labelEls = [...section.querySelectorAll("[data-auto-label]")];

    const { recommendation, isLast, nextOption, reportOption } = syncFinishGroupActions(group, state);

    const visibleItems = [...group.querySelectorAll("[data-choice-item]")].filter((item) => !item.hidden);
    if (!visibleItems.length) return;

    const defaultIndex = Number(group.dataset.defaultIndex || 0);
    let activeItem = visibleItems[defaultIndex] || visibleItems[0];
    if (
      idleEnabled &&
      !isLast &&
      recommendation &&
      nextOption &&
      !nextOption.hidden
    ) {
      activeItem = nextOption;
    }

    let idleTimer = null;
    let idleCountdownStarted = !idleEnabled || !idleStartOnFirstClick;

    function syncUI() {
      visibleItems.forEach((item) => {
        item.classList.toggle("is-active", item === activeItem);
      });
      const activeLabel = activeItem.dataset.choiceLabel || activeItem.textContent.trim();
      labelEls.forEach((el) => {
        el.textContent = activeLabel;
      });
      section.querySelectorAll("[data-auto-prefix]").forEach((el) => {
        el.textContent = idleEnabled ? t("common.idleDefault") : t("common.clickOptions");
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
      if (idleLabelEl) idleLabelEl.textContent = t("finish.idleClick");
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
        idleLabelEl.textContent = t("finish.idleCountdown", null, { sec: remain, label });
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
  const prepExitLabel = prepDualHand ? finishOptionShortLabel(prepExitEl) : t("common.exitMeasure");
  const prepNextLabel = prepDualHand ? finishOptionShortLabel(prepNextEl) : t("common.nextStep");

  if (context === "finish" && finishPlan?.neither) return;

  let idleBubbleText =
    (module.dataset.gestureIdleHint && module.dataset.gestureIdleHint.trim()) ||
    (context === "finish"
      ? finishPlan.both
        ? `${t("gesture.leftHand", null, { label: reportLabel })} ${t("gesture.rightHand", null, { label: nextLabel })}`
        : finishPlan.onlyNext
          ? t("gesture.rightHandHold", null, { label: nextLabel })
          : finishPlan.onlyReport
            ? t("gesture.rightHandHold", null, { label: reportLabel })
            : ""
      : prepDualHand
        ? `${t("gesture.leftHand", null, { label: prepExitLabel })} ${t("gesture.rightHand", null, { label: prepNextLabel })}`
        : t("gesture.rightHandOnly"));

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
      flashFinishHint(t("gesture.raiseRightContinue"));
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
        flashFinishHint(t("gesture.raiseRightFor", { label: nextLabel }));
        return;
      }
      beginHold("right");
      return;
    }
    if (finishPlan.onlyReport) {
      if (hand === "left") {
        flashFinishHint(t("gesture.raiseRightFor", { label: reportLabel }));
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
        return hand === "left"
          ? t("gesture.raiseLeftHold", { label: prepExitLabel })
          : t("gesture.raiseRightHold", { label: prepNextLabel });
      }
      return t("gesture.raiseRightContinueShort");
    }
    if (finishPlan.both) {
      return hand === "left"
        ? t("gesture.raiseLeftHold", { label: reportLabel })
        : t("gesture.raiseRightHold", { label: nextLabel });
    }
    if (finishPlan.onlyNext) return t("gesture.raiseRightHold", { label: nextLabel });
    if (finishPlan.onlyReport) return t("gesture.raiseRightHold", { label: reportLabel });
    return t("gesture.keepStill");
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
        bubble.textContent = t("common.recognitionPass");
      }
      speakText(t("voice.recognitionPass"));
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
      bubble.textContent = t("common.recognitionPass");
    }
    speakText(t("voice.recognitionPass"));
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
    if (bubble) bubble.textContent = t("gesture.wrongHand");
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
        ? t("finishDone.voice")
        : prepDualHand
          ? t("prep.voice")
          : t("gesture.raiseRightNext"))
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
    const subtitleEl = root.closest("section")?.querySelector(".screen-subtitle");
    const warningMode = new URLSearchParams(window.location.search).get("autoDetectMode") === "warning";
    const voiceAdvanceNext = root.dataset.voiceAdvanceNext;
    const voiceAdvanceAfterMs = Number(root.dataset.voiceAdvanceAfterMs || 3000);
    let demoTimer = null;
    let navigateTimer = null;

    if (warningMode) {
      notifyDeviceStatus("pose.abnormal", { speakKey: "pose.detectAbnormal" });
      root.classList.add("is-warning");
      if (subtitleEl) subtitleEl.textContent = t("pose.abnormalSubtitle");
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
      if (!skipRecognizedSpeak) {
        notifyDeviceStatus("common.recognitionPass", { speakKey: "voice.recognitionPass" });
      } else {
        notifyDeviceStatus("common.recognitionPass", { speakKey: null });
      }
    }

    if (voiceAdvanceNext) {
      const autoHint = root.querySelector("[data-voice-auto-hint]");
      if (autoHint) autoHint.hidden = false;
      const voiceLine = root.dataset.voiceText || t("voice.poseDetect");
      speakTextThen(voiceLine, () => {
        navigateTimer = window.setTimeout(() => {
          navigateToTarget(withStateQuery(voiceAdvanceNext, loadState()));
        }, voiceAdvanceAfterMs);
      });
      setActivePageDemo({ cancel: cancelDemo });
      return;
    }

    notifyDeviceStatus("common.recognizing");
    speakText(root.dataset.voiceText || t("voice.poseDetect"));

    demoTimer = window.setTimeout(() => completeDemo(false), delay);
    setActivePageDemo({ cancel: cancelDemo });
  });
}

function setupTipCarousel() {
  mountAllTipCarousels();
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
    if (chipA) chipA.textContent = t("gesture.gestureLabel");
    if (chipB) {
      chipB.textContent =
        option === "report" ? t("gesture.recognizedDone") : t("gesture.recognizedRight");
    }
    showToast(
      option === "report" ? t("finish.gestureDone") : t("finish.gestureContinue")
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
    el.textContent = state.completedGroups.standard ? t("common.completed") : t("common.notMeasured");
  });
  document.querySelectorAll("[data-result-summary='pro']").forEach((el) => {
    el.textContent = state.completedGroups.pro ? t("common.completed") : t("common.notMeasured");
  });
  document.querySelectorAll("[data-result-summary='single']").forEach((el) => {
    el.textContent = state.completedGroups.singleShoulder ? t("common.shoulderShort") : t("common.notMeasured");
  });

  document.querySelectorAll("[data-show-if-weight-standalone]").forEach((el) => {
    const onStandby = !!el.closest("[data-standby-page]");
    el.hidden = onStandby || !state.weightStandaloneEnabled;
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
  if (typeof window.Vapro7I18n?.applyDeviceI18n === "function") {
    window.Vapro7I18n.applyDeviceI18n(state);
  }
  document.querySelectorAll("[data-prep-checklist]").forEach((el) => {
    renderPrepChecklist(el, state);
  });
  document.querySelectorAll("[data-tip-carousel]").forEach((el) => {
    renderMeasurementTips(el, state);
  });
  mountAllTipCarousels();
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

  const particleStage = root.querySelector("[data-generating-particle-stage]");
  const particleCanvas = root.querySelector("[data-generating-particle-canvas]");
  let started = false;

  const runGeneratingFlow = (body3dRenderer) => {
    if (started) return;
    started = true;
    const target = root.dataset.generatingNext || "./report-detail.html";
    const delay = Number(root.dataset.generatingDelay || 3000);
    const voice = root.dataset.voiceText || t("generating.voice");
    speakText(voice);
    const fill = root.querySelector("[data-generating-progress]");
    const label = root.querySelector("[data-generating-label]");
    const panel = root.querySelector("[data-generating-panel]");
    const flowStarted = performance.now();

    const tick = () => {
      const elapsed = performance.now() - flowStarted;
      const pct = Math.min(100, Math.round((elapsed / delay) * 100));
      if (fill) fill.style.width = `${pct}%`;
      body3dRenderer?.setProgress(pct / 100);
      if (label && pct < 100) label.textContent = t("generating.progress", null, { pct });
      if (elapsed >= delay) {
        if (label) label.textContent = t("generating.done");
        body3dRenderer?.setProgress(1);
        panel?.classList.add("is-generating-complete");
        window.setTimeout(() => {
          navigateToTarget(withStateQuery(target, loadState()));
        }, 2000);
        return;
      }
      window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };

  const tryAttachRenderer = () => {
    const body3dRenderer = window.createGeneratingBody3DRenderer?.(particleStage, particleCanvas);
    if (body3dRenderer) {
      runGeneratingFlow(body3dRenderer);
      return true;
    }
    return false;
  };

  if (tryAttachRenderer()) return;

  window.addEventListener("generating-body3d-ready", () => {
    tryAttachRenderer();
  }, { once: true });

  let attempts = 0;
  const poll = window.setInterval(() => {
    if (tryAttachRenderer() || attempts >= 80) window.clearInterval(poll);
    attempts += 1;
  }, 50);
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
    if (titleEl) titleEl.textContent = t("pose.adjust");
    if (subtitle) subtitle.textContent = t("pose.abnormalSubtitle");
    if (focusEl) focusEl.textContent = t("pose.adjust");
    if (chipEl) chipEl.textContent = t("pose.abnormal");
    if (tipEl) tipEl.textContent = t("pose.abnormalTip");
    speakText(t("pose.detectAbnormal"));
    setActivePageDemo({ cancel: () => {} });
    return;
  }

  const durationMs = Number(root.dataset.measuringDuration || 10000);
  const isPostureMeasuring = resolveMeasurementModeKey(loadState()) === "pro";
  const progressFill = root.querySelector("[data-measuring-progress]");
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

  const measuringVoiceIntro =
    root.dataset.voiceText?.trim() ||
    root.querySelector("[data-live-voice]")?.textContent?.trim() ||
    t("measuring.voice");
  speakText(measuringVoiceIntro);

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
    if (remaining <= finaleThresholdMs && remaining > 0) {
      if (chipEl) chipEl.textContent = t("measuring.almostDoneChip");
      if (!finaleSpoken) {
        finaleSpoken = true;
        notifyDeviceStatus("measuring.almostDone", { speakKey: "measuring.completeSoonVoice" });
      }
    }
    if (elapsed < durationMs) {
      rafId = window.requestAnimationFrame(tick);
      return;
    }
    spinComplete = true;
    stopSound();
    if (progressFill) progressFill.style.width = "100%";
    if (chipEl) {
      chipEl.textContent = isPostureMeasuring
        ? t("measuring.collectionDone")
        : t("measuring.turntableRotating");
    }
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
      speakText(t("home.gesturePass", null, { label: card.dataset.choiceLabel || t("common.measure") }));
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
  const delay = Number(root.dataset.autoDetectDelay || 2600);
  const btn = root.querySelector("[data-anthropometry-next-btn]");
  const warningMode = new URLSearchParams(window.location.search).get("autoDetectMode") === "warning";

  function goNext() {
    navigateToTarget(withStateQuery(nextHref, loadState()));
  }

  if (warningMode) {
    root.classList.add("is-warning");
    notifyDeviceStatus("pose.abnormal", { speakKey: "pose.detectAbnormal" });
    return;
  }

  const skipAnthropometry =
    root.dataset.anthropometrySkip === "1" || root.dataset.anthropometrySkip === "true";

  if (skipAnthropometry) {
    function completePostureDetectionVisual() {
      root.classList.add("is-aligned");
      const scene = root.querySelector(".bodycomp-prep-scene");
      if (scene) scene.classList.add("is-aligned");
      notifyDeviceStatus("common.recognitionPass", { speakKey: "voice.recognitionPass" });
      if (btn) {
        btn.removeAttribute("disabled");
        btn.setAttribute("aria-disabled", "false");
      }
    }

    if (!isDemoManualAdvance()) {
      notifyDeviceStatus("common.recognizing");
      speakText(root.dataset.voiceText || t("boarding.voiceStill"));
      const detectTimer = window.setTimeout(() => {
        completePostureDetectionVisual();
        notifyDeviceStatus("pose.enteringCountdown");
        window.setTimeout(goNext, 700);
      }, delay);
      setActivePageDemo({ cancel: () => window.clearTimeout(detectTimer) });
      return;
    }

    let detectionComplete = false;
    if (btn) {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        if (!detectionComplete) return;
        goNext();
      });
      btn.setAttribute("disabled", "disabled");
      btn.setAttribute("aria-disabled", "true");
      btn.textContent = t("common.nextButton");
    }
    notifyDeviceStatus("common.recognizing");
    speakText(root.dataset.voiceText || t("boarding.voiceStill"));
    const detectTimer = window.setTimeout(() => {
      detectionComplete = true;
      completePostureDetectionVisual();
      notifyDeviceStatus("pose.passNext");
      if (btn) btn.textContent = t("common.nextButton");
    }, delay);
    setActivePageDemo({ cancel: () => window.clearTimeout(detectTimer) });
    return;
  }

  function runAnthropometryToastsAndMaybeNavigate(autoNavigate) {
    const state = loadState();
    const steps = [];
    let at = 0;

    if (state.heightMeasurementEnabled) {
      steps.push([at, () => {
        showDeviceToast(t("height.measuring"), 2000);
        speakText(t("height.measuringVoice"));
      }]);
      at += 1600;
      steps.push([at, () => {
        patchState({ sessionHeightCm: state.sessionHeightCm || 165 });
        showDeviceToast(t("height.doneToast"));
        speakText(t("height.doneVoice"));
      }]);
      at += 900;
    }

    steps.push([at, () => {
      showDeviceToast(t("weight.measuring"), 2000);
      speakText(t("weight.measuringVoice"));
    }]);
    at += 1400;
    steps.push([at, () => {
      patchState({ sessionWeightKg: state.sessionWeightKg || 56.8 });
      showDeviceToast(t("weight.doneToast"));
      speakText(t("weight.doneVoice"));
      if (autoNavigate) {
        notifyDeviceStatus("boarding.enterGripPrep");
        window.setTimeout(goNext, 700);
      } else {
        notifyDeviceStatus("boarding.tapContinueMeasure");
      }
    }]);

    steps.forEach(([ms, fn]) => window.setTimeout(fn, ms));
  }

  function completeDetectionVisual() {
    root.classList.add("is-aligned");
    const scene = root.querySelector(".bodycomp-prep-scene");
    if (scene) scene.classList.add("is-aligned");
    notifyDeviceStatus("common.recognitionPass", { speakKey: "voice.recognitionPass" });
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
    notifyDeviceStatus("common.recognizing");
    speakText(root.dataset.voiceText || t("boarding.voiceFoot"));
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
      setBtnLabel(t("common.collecting"));
      runAnthropometryToastsAndMaybeNavigate(false);
      const s = loadState();
      const toastEndMs = s.heightMeasurementEnabled ? 2500 + 1400 : 1400;
      const doneId = window.setTimeout(() => {
        toastsDone = true;
        btn.disabled = false;
        setBtnLabel(t("common.continueMeasure"));
        notifyDeviceStatus("pose.passNext");
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
    setBtnLabel(t("common.nextButton"));
  }

  notifyDeviceStatus("common.recognizing");
  speakText(root.dataset.voiceText || t("boarding.voiceFoot"));

  const detectTimer = window.setTimeout(() => {
    detectionComplete = true;
    completeDetectionVisual();
    setBtnLabel(t("common.nextButton"));
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
    if (editableWrap) editableWrap.hidden = false;
    if (minusBtn) {
      minusBtn.disabled = false;
      minusBtn.setAttribute("aria-disabled", "false");
    }
    if (plusBtn) {
      plusBtn.disabled = false;
      plusBtn.setAttribute("aria-disabled", "false");
    }
    if (heightInput) {
      heightInput.value = String(state.sessionHeightCm);
      heightInput.disabled = false;
    }
    if (hintEl) hintEl.hidden = false;
  }

  function adjustHeight(delta) {
    const state = loadState();
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

    speakText(t("weight.voicePrep"));

    timers.push(
      window.setTimeout(() => {
        setPhase("gauge-idle");
        speakText(t("weight.voiceStand"));
      }, 2200)
    );

    timers.push(
      window.setTimeout(() => {
        setPhase("gauge-measuring");
        speakText(t("weight.voiceReading"));
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
    if (labelEl) labelEl.textContent = t("weight.idleReturnSec", { sec: remain });
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
  if (statusEl) statusEl.textContent = t("pose.abnormal");
  if (stepsEl) {
    stepsEl.innerHTML = `<span class="is-current">${t("pose.abnormal")}</span><span class="single-shoulder-progress-sep">››</span><span class="is-next">${t("shoulder.warningAdjust")}</span>`;
  }
  if (infoList) {
    infoList.innerHTML = `<li>${t("shoulder.warningTip1")}</li><li>${t("shoulder.warningTip2")}</li>`;
  }
  if (liveStage) liveStage.classList.add("is-warning");
  speakText(t("pose.detectAbnormal"));
}

function syncPageMeasurementMode() {
  const el = document.querySelector("[data-set-measurement-mode]");
  if (!el) return;
  const mode = el.dataset.setMeasurementMode;
  if (mode) patchState({ currentMeasurementMode: mode });
}

function redirectLegacyFinishPages() {
  const mode = document.body?.dataset.legacyFinishRedirect;
  if (!mode) return;
  patchState({ currentMeasurementMode: mode });
  navigateToTarget(withStateQuery("./standard-next-step.html", loadState()));
}

function setupMeasurementConfigSync() {
  window.addEventListener("storage", (event) => {
    if (event.key !== MEASUREMENT_CONFIG_KEY) return;
    renderState(loadState());
  });
  window.addEventListener("pageshow", () => {
    renderState(loadState());
  });
}

let __deviceCanvasResizeTimer = null;

function readForcedDeviceCanvas() {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("canvas") || params.get("deviceCanvas");
    if (fromQuery === "1080" || fromQuery === "native") return "1080";
    if (fromQuery === "540" || fromQuery === "preview") return "540";
    const fromStorage = localStorage.getItem("vapro7-device-canvas");
    if (fromStorage === "1080" || fromStorage === "540") return fromStorage;
  } catch {
    /* ignore */
  }
  return null;
}

function getDeviceViewportMetrics() {
  const vw = Math.round(window.visualViewport?.width || window.innerWidth || document.documentElement.clientWidth || 0);
  const vh = Math.round(window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight || 0);
  const sw = Math.round(window.screen?.width || 0);
  const sh = Math.round(window.screen?.height || 0);
  const dpr = window.devicePixelRatio || 1;
  return {
    vw,
    vh,
    sw,
    sh,
    dpr,
    maxInner: Math.max(vw, vh),
    minInner: Math.min(vw, vh),
    maxScreen: Math.max(sw, sh),
    minScreen: Math.min(sw, sh)
  };
}

function detectNativeCanvas() {
  const forced = readForcedDeviceCanvas();
  if (forced) return forced === "1080";

  const { vw, vh, maxInner, minInner, maxScreen, minScreen } = getDeviceViewportMetrics();

  // CSS 视口即 1080×1920 竖屏面板
  if (vw >= 999 && vh >= 1700) return true;
  if (maxInner >= 1700 && minInner >= 999) return true;

  // screen 为 1080p 竖屏，CSS 视口为全宽（部分 WebView 仍报 1080 宽）
  if (maxScreen >= 1700 && minScreen >= 999 && vw >= 900 && vh >= 1600) return true;

  return false;
}

function applyDeviceCanvasScale() {
  if (document.documentElement.dataset.deviceCanvas !== "1080") return;

  const { vw, vh } = getDeviceViewportMetrics();
  const scale = Math.min(vw / 1080, vh / 1920);
  if (scale > 0 && scale < 0.999) {
    document.documentElement.style.setProperty("--device-preview-scale", String(scale));
  } else {
    document.documentElement.style.setProperty("--device-preview-scale", "1");
  }
}

function applyDeviceCanvas() {
  const use1080 = detectNativeCanvas();
  document.documentElement.dataset.deviceCanvas = use1080 ? "1080" : "540";
  if (use1080) applyDeviceCanvasScale();
  else document.documentElement.style.removeProperty("--device-preview-scale");
}

function ensureDeviceViewportMeta() {
  let meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "viewport";
    document.head.appendChild(meta);
  }
  const desired = "width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover";
  if (meta.getAttribute("content") !== desired) meta.setAttribute("content", desired);
}

function setupDeviceCanvas() {
  ensureDeviceViewportMeta();
  applyDeviceCanvas();
  if (setupDeviceCanvas.__bound) return;
  setupDeviceCanvas.__bound = true;
  const onResize = () => {
    if (__deviceCanvasResizeTimer) window.clearTimeout(__deviceCanvasResizeTimer);
    __deviceCanvasResizeTimer = window.setTimeout(() => {
      applyDeviceCanvas();
    }, 150);
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);
  window.visualViewport?.addEventListener("resize", onResize);
}

applyDeviceCanvas();

const STATUS_BAR_ICONS_HTML = `<span class="status-icons" aria-hidden="true">
  <span class="status-icon status-icon--wifi"></span>
  <span class="status-icon status-icon--signal"></span>
  <span class="status-icon status-icon--gesture"></span>
  <span class="status-icon status-icon--printer status-icon--ok"></span>
  <span class="status-icon status-icon--mute"></span>
</span>`;

function setupDeviceStatusBars() {
  document.querySelectorAll(".status-bar").forEach((bar) => {
    bar.querySelector(".status-bar__context")?.remove();

    if (bar.dataset.statusBarEnhanced === "true") return;

    const isSettingsBar = bar.classList.contains("status-bar--device-settings");
    if (isSettingsBar) {
      if (bar.querySelector(".status-bar__row")) {
        bar.dataset.statusBarEnhanced = "true";
        return;
      }
      const timeText = bar.querySelector(":scope > .status-bar__time, :scope > span:first-child")?.textContent?.trim() || "18:32";
      const icons = bar.querySelector(".status-icons");
      bar.classList.add("status-bar--device");
      bar.innerHTML = "";
      const row = document.createElement("div");
      row.className = "status-bar__row";
      const timeEl = document.createElement("span");
      timeEl.className = "status-bar__time";
      timeEl.textContent = timeText;
      row.appendChild(timeEl);
      if (icons) row.appendChild(icons);
      else row.insertAdjacentHTML("beforeend", STATUS_BAR_ICONS_HTML);
      bar.appendChild(row);
      bar.dataset.statusBarEnhanced = "true";
      return;
    }

    if (bar.querySelector(".status-bar__row")) {
      bar.dataset.statusBarEnhanced = "true";
      return;
    }

    const badge = bar.querySelector(":scope > .demo-version-badge");
    const spans = [...bar.querySelectorAll(":scope > span:not(.demo-version-badge)")];
    const timeText = spans[0]?.textContent?.trim() || "18:32";

    bar.classList.add("status-bar--device");
    bar.innerHTML = "";

    const row = document.createElement("div");
    row.className = "status-bar__row";
    const timeEl = document.createElement("span");
    timeEl.className = "status-bar__time";
    timeEl.textContent = timeText;
    row.appendChild(timeEl);
    row.insertAdjacentHTML("beforeend", STATUS_BAR_ICONS_HTML);
    bar.appendChild(row);

    if (badge) bar.appendChild(badge);
    bar.dataset.statusBarEnhanced = "true";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupDeviceStatusBars();
  setupDeviceCanvas();
  bindConfigControls();
  bindDemoPlaceholders();
  bindActionLinks();
  syncPageMeasurementMode();
  if (document.body?.dataset.legacyFinishRedirect) {
    redirectLegacyFinishPages();
    return;
  }
  renderState();
  setupMeasurementConfigSync();
  setupVersionDisplay();
  setupChoiceHighlight();
  setupFinishCompletionPage();
  setupFinishAutoAdvance();
  setupFinishGesturePage();
  setupSchemeThreeGestureDemo();
  setupPrepGestureAdvance();
  setupAutoDetectAdvance();
  setupMeasurementCopyPages();
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
  getProFlowEntryHref,
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
