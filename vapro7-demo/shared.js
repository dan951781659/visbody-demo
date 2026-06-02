const STORAGE_KEY = "vapro7-demo-state";
const REPORT_URL = "./report-detail.html";
const DEMO_VERSION_FALLBACK = "1.5.5";

const SINGLE_FLOW_PLACEHOLDER_HREF = "./single-flow-placeholder.html";

const NEXT_RECOMMEND_DESC = {
  standard: "一圈综合采集",
  pro: "IPose 体态专项",
  singleShoulder: "肩部专项",
  singleNeck: "颈部占位演示",
  singleBalance: "平衡占位演示"
};

const MEASUREMENT_ITEMS = {
  standard: { key: "standard", title: "综合测量", href: "./standard-bodycomp-prep.html", group: "standard" },
  pro: { key: "pro", title: "专业测量", href: "./pro-prepare.html", group: "pro" },
  singleShoulder: { key: "singleShoulder", title: "肩部测量", href: "./single-prepare-shoulder.html", group: "single" },
  singleNeck: { key: "singleNeck", title: "颈部测量", href: `${SINGLE_FLOW_PLACEHOLDER_HREF}?item=neck`, group: "single" },
  singleBalance: { key: "singleBalance", title: "平衡测量", href: `${SINGLE_FLOW_PLACEHOLDER_HREF}?item=balance`, group: "single" }
};

const ORDER_PRESET_KEYS = {
  "standard-pro-shoulder": ["standard", "pro", "singleShoulder"],
  "shoulder-standard-pro": ["singleShoulder", "standard", "pro"],
  "pro-shoulder-standard": ["pro", "singleShoulder", "standard"]
};

const DEFAULT_ORDER_KEYS = ORDER_PRESET_KEYS["standard-pro-shoulder"];

const REPORT_METRIC_VALUES = {
  体重: "56.8 kg",
  身高: "168.2 cm",
  体成分: "体脂率 24.8%",
  体围: "已生成",
  体态评估: "轻度圆肩",
  综合评分: "82 分"
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

function defaultState() {
  return {
    proModeEnabled: true,
    singleShoulderEnabled: true,
    singleNeckEnabled: true,
    singleBalanceEnabled: true,
    showProEntryAfterStandard: true,
    showSingleEntryAfterStandard: true,
    measurementOrderPreset: "standard-pro-shoulder",
    measurementOrderKeys: [...DEFAULT_ORDER_KEYS],
    homepageQuickSingleItem: "none",
    reportExternalUrl: "",
    voiceEnabled: true,
    bodyCompositionPrepEnabled: true,
    currentSessionId: null,
    completedGroups: {
      standard: false,
      pro: false,
      singleShoulder: false,
      singleNeck: false,
      singleBalance: false
    }
  };
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
  const legacySingle =
    typeof merged.singleModeEnabled === "boolean" ? merged.singleModeEnabled : true;
  if (typeof merged.singleShoulderEnabled !== "boolean") {
    merged.singleShoulderEnabled = legacySingle;
  }
  if (typeof merged.singleNeckEnabled !== "boolean") {
    merged.singleNeckEnabled = legacySingle;
  }
  if (typeof merged.singleBalanceEnabled !== "boolean") {
    merged.singleBalanceEnabled = legacySingle;
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
  const orderKeys = resolveOrderKeys(merged);
  return {
    ...merged,
    measurementOrderKeys: orderKeys,
    completedGroups: {
      ...base.completedGroups,
      ...((state && state.completedGroups) || {})
    }
  };
}

function getQueryOverrides() {
  const params = new URLSearchParams(window.location.search);
  const overrides = {};
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

  if (quick && ["none", "shoulder", "neck", "balance"].includes(quick)) {
    overrides.homepageQuickSingleItem = quick;
  }
  if (typeof pro === "boolean") {
    overrides.proModeEnabled = pro;
  }
  if (typeof single === "boolean") {
    overrides.singleShoulderEnabled = single;
    overrides.singleNeckEnabled = single;
    overrides.singleBalanceEnabled = single;
  }
  if (typeof singleShoulder === "boolean") overrides.singleShoulderEnabled = singleShoulder;
  if (typeof singleNeck === "boolean") overrides.singleNeckEnabled = singleNeck;
  if (typeof singleBalance === "boolean") overrides.singleBalanceEnabled = singleBalance;
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

function loadState() {
  const fallback = defaultState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return normalizeState({
      ...fallback,
      ...(saved || {}),
      ...getQueryOverrides()
    });
  } catch {
    return normalizeState({
      ...fallback,
      ...getQueryOverrides()
    });
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

function isAnySingleEnabled(state) {
  const s = state || loadState();
  return !!(s.singleShoulderEnabled || s.singleNeckEnabled || s.singleBalanceEnabled);
}

function isSingleItemEnabled(state, itemKey) {
  const s = state || loadState();
  if (itemKey === "singleShoulder") return !!s.singleShoulderEnabled;
  if (itemKey === "singleNeck") return !!s.singleNeckEnabled;
  if (itemKey === "singleBalance") return !!s.singleBalanceEnabled;
  return false;
}

function isQuickSingleAvailable(state, quick) {
  if (!quick || quick === "none") return true;
  if (quick === "shoulder") return !!state.singleShoulderEnabled;
  if (quick === "neck") return !!state.singleNeckEnabled;
  if (quick === "balance") return !!state.singleBalanceEnabled;
  return false;
}

function getQuickItemMeta(value) {
  const state = loadState();
  if (!isQuickSingleAvailable(state, value)) return null;
  const map = {
    none: null,
    shoulder: { title: "肩部测量", desc: "抬手完成肩部活动测量", href: "./single-prepare-shoulder.html" },
    neck: { title: "颈部测量", desc: "演示占位，未接入流程", href: `${SINGLE_FLOW_PLACEHOLDER_HREF}?item=neck` },
    balance: { title: "平衡测量", desc: "演示占位，未接入流程", href: `${SINGLE_FLOW_PLACEHOLDER_HREF}?item=balance` }
  };
  return map[value] || null;
}

function getMeasurementOrder(state) {
  return resolveOrderKeys(state).map((key) => MEASUREMENT_ITEMS[key]).filter(Boolean);
}

function formatOrderPreview(state) {
  return getMeasurementOrder(state)
    .map((item) => item.title)
    .join(" → ");
}

function isMeasurementAvailable(item, state) {
  if (!item) return false;
  if (item.key === "pro") {
    if (!state.proModeEnabled) return false;
  }
  if (item.key === "singleShoulder") return !!state.singleShoulderEnabled;
  if (item.key === "singleNeck") return !!state.singleNeckEnabled;
  if (item.key === "singleBalance") return !!state.singleBalanceEnabled;
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

function getStandardFlowEntryHref(state) {
  const s = state || loadState();
  return s.bodyCompositionPrepEnabled ? "./standard-bodycomp-prep.html" : "./standard-position.html";
}

function buildStateQuery(state) {
  const params = new URLSearchParams();
  params.set("quick", state.homepageQuickSingleItem || "none");
  params.set("pro", state.proModeEnabled ? "1" : "0");
  params.set("singleShoulder", state.singleShoulderEnabled ? "1" : "0");
  params.set("singleNeck", state.singleNeckEnabled ? "1" : "0");
  params.set("singleBalance", state.singleBalanceEnabled ? "1" : "0");
  params.set("showProAfterStandard", state.showProEntryAfterStandard ? "1" : "0");
  params.set("showSingleAfterStandard", state.showSingleEntryAfterStandard ? "1" : "0");
  params.set("voice", state.voiceEnabled ? "1" : "0");
  params.set("bodyCompPrep", state.bodyCompositionPrepEnabled ? "1" : "0");
  params.set("order", (state.measurementOrderKeys || DEFAULT_ORDER_KEYS).join(","));
  return params.toString();
}

function withStateQuery(target, state) {
  if (!target || target === "#") return target;
  const [path, hash = ""] = target.split("#");
  const [basePath, currentQuery = ""] = path.split("?");
  const params = new URLSearchParams(currentQuery);
  const stateParams = new URLSearchParams(buildStateQuery(state));
  stateParams.forEach((value, key) => params.set(key, value));
  const query = params.toString();
  return `${basePath}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

function bindConfigControls() {
  document.querySelectorAll("[data-config-key]").forEach((el) => {
    const key = el.getAttribute("data-config-key");
    function onChange() {
      const value = el.type === "checkbox" ? el.checked : el.value;
      patchState({ [key]: value });
    }
    el.addEventListener("change", onChange);
    if (el.tagName === "INPUT" && el.type !== "checkbox") {
      el.addEventListener("input", onChange);
    }
  });
}

function navigateToTarget(target) {
  if (!target || target === "#") return;
  window.location.href = target;
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

function setupVoice() {
  if (document.querySelector("[data-guide-sequence]")) return;
  if (document.querySelector("[data-measuring-flow]")) return;
  if (document.querySelector("[data-generating-flow]")) return;
  if (document.querySelector("[data-demo-countdown-target]")) return;
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

function setupDemoAdvance() {
  document.querySelectorAll("[data-demo-next]").forEach((el) => {
    const target = el.dataset.demoNext;
    if (!target) return;

    function trigger(event) {
      if (el.disabled) return;
      if (event) event.preventDefault();
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
    const secondsEl = el.querySelector("[data-stage-seconds]");
    let timer = null;
    let hasStarted = false;
    let remainingSeconds = Number(el.dataset.stageSecondsStart || secondsEl?.textContent || Math.ceil(delay / 1000));

    function finishStage() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
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
          finishStage();
        }
      }, 1000);
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

      if (action === "reset-demo") {
        saveState(defaultState());
        renderState();
      }

      if (action === "start-session") {
        startSession();
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

function setupChoiceHighlight() {
  document.querySelectorAll("[data-choice-group]").forEach((group) => {
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
      if (idleLabelEl) idleLabelEl.textContent = "点击下方区域或选项后开始倒计时";
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

    function onIdleUserActivity() {
      if (!idleEnabled) return;
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

function setupPrepGestureAdvance() {
  const root = document.querySelector("[data-prep-gesture-advance]");
  if (!root) return;

  const target = root.dataset.prepGestureAdvance || "./standard-position.html";
  const toast = root.querySelector("[data-gesture-toast]");
  const figure = root.querySelector("[data-prep-gesture-figure]");
  let toastTimer = null;
  let advancing = false;

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
    if (!figure) return;
    figure.classList.remove("is-gesture-pulse");
    void figure.offsetWidth;
    figure.classList.add("is-gesture-pulse");
    window.setTimeout(() => figure.classList.remove("is-gesture-pulse"), 600);
  }

  function advance() {
    if (advancing) return;
    advancing = true;
    const state = loadState();
    showToast("已识别 · 进入扶手准备");
    pulseGestureTarget();
    window.setTimeout(() => {
      navigateToTarget(withStateQuery(target, state));
    }, 320);
  }

  root.querySelectorAll("[data-gesture-simulate]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      advance();
    });
  });

  root.addEventListener(
    "keydown",
    (event) => {
      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        advance();
      }
    },
    true
  );
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
    if (chipA) chipA.textContent = "Demo";
    if (chipB) {
      chipB.textContent = option === "report" ? "已识别 · 结束测量" : "已识别 · 举右手";
    }
    showToast(
      option === "report" ? "Demo：模拟识别为「结束测量」" : "Demo：模拟识别为「举右手 · 继续下一项」"
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
    el.hidden = !state.proModeEnabled;
  });
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
    el.setAttribute("href", withStateQuery(target, state));
  });

  document.querySelectorAll("[data-standard-flow-entry]").forEach((el) => {
    el.setAttribute("href", withStateQuery(getStandardFlowEntryHref(state), state));
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
  root.querySelectorAll("[data-report-metric]").forEach((card) => {
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
          (key === "singleNeck" && !state.singleNeckEnabled) ||
          (key === "singleBalance" && !state.singleBalanceEnabled);
        btn.hidden = inList || singleDisabled;
        btn.disabled = inList || singleDisabled;
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

  const durationMs = Number(root.dataset.measuringDuration || 10000);
  const nextTarget = root.dataset.measuringNext || "./standard-next-step.html";
  const progressFill = root.querySelector("[data-measuring-progress]");
  const focusEl = root.querySelector("[data-measuring-focus]");
  const chipEl = root.querySelector("[data-measuring-chip]");
  const footer = root.querySelector("[data-measuring-footer]");
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
      o.type = "triangle";
      o.frequency.value = 280;
      const g = motorCtx.createGain();
      const t = motorCtx.currentTime;
      g.gain.setValueAtTime(0.055, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      o.connect(g);
      g.connect(motorCtx.destination);
      o.start(t);
      o.stop(t + 0.09);
    } catch {
      /* noop */
    }
  }

  function startOscillatorFallback() {
    if (reducedMotion || motorCtx) return;
    try {
      motorCtx = new AudioContext();
      motorOsc = motorCtx.createOscillator();
      motorOsc.type = "sawtooth";
      motorOsc.frequency.value = 54;
      motorGain = motorCtx.createGain();
      motorGain.gain.value = 0.032;
      motorOsc.connect(motorGain);
      motorGain.connect(motorCtx.destination);
      motorOsc.start();
      tickTimer = window.setInterval(playTickBurst, 1850);
      playTickBurst();
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

  function goMeasuringNext() {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    stopSound();
    navigateToTarget(withStateQuery(nextTarget, loadState()));
  }

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
    if (focusEl) focusEl.textContent = "转台已停，可进入下一步";
    if (chipEl) chipEl.textContent = "转台已停";
  }

  rafId = window.requestAnimationFrame(tick);

  if (footer) {
    footer.addEventListener("click", goMeasuringNext);
    footer.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goMeasuringNext();
      }
    });
  }

  window.addEventListener("beforeunload", stopSound);
}

document.addEventListener("DOMContentLoaded", () => {
  bindConfigControls();
  bindDemoPlaceholders();
  bindActionLinks();
  renderState();
  setupVersionDisplay();
  setupChoiceHighlight();
  setupFinishAutoAdvance();
  setupSchemeThreeGestureDemo();
  setupPrepGestureAdvance();
  setupGuideSequence();
  setupDemoAdvance();
  setupStageAdvance();
  setupGeneratingFlow();
  setupReportDetail();
  setupOrderSortList();
  setupMeasuringTurntable();
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
  isAnySingleEnabled,
  isSingleItemEnabled,
  isQuickSingleAvailable,
  withStateQuery,
  MEASUREMENT_ITEMS,
  sanitizeOrderKeys,
  formatOrderPreview
};
