const STORAGE_KEY = "vapro7-demo-state";
const REPORT_URL = "/Users/kean/维塑/cursor/h5-adjust-react/index.html";

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
    singleModeEnabled: true,
    showProEntryAfterStandard: true,
    showSingleEntryAfterStandard: true,
    autoAdvanceToNextMeasurement: true,
    measurementOrderPreset: "standard-pro-shoulder-balance-neck",
    homepageQuickSingleItem: "none",
    voiceEnabled: true,
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

function normalizeState(state) {
  const base = defaultState();
  return {
    ...base,
    ...state,
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
  const showProAfterStandard = toBoolean(params.get("showProAfterStandard"));
  const showSingleAfterStandard = toBoolean(params.get("showSingleAfterStandard"));
  const autoNext = toBoolean(params.get("autoNext"));
  const order = params.get("order");
  const voice = toBoolean(params.get("voice"));

  if (quick && ["none", "shoulder", "neck", "balance"].includes(quick)) {
    overrides.homepageQuickSingleItem = quick;
  }
  if (typeof pro === "boolean") {
    overrides.proModeEnabled = pro;
  }
  if (typeof single === "boolean") {
    overrides.singleModeEnabled = single;
  }
  if (typeof showProAfterStandard === "boolean") {
    overrides.showProEntryAfterStandard = showProAfterStandard;
  }
  if (typeof showSingleAfterStandard === "boolean") {
    overrides.showSingleEntryAfterStandard = showSingleAfterStandard;
  }
  if (typeof autoNext === "boolean") {
    overrides.autoAdvanceToNextMeasurement = autoNext;
  }
  if (
    order &&
    [
      "standard-pro-shoulder-balance-neck",
      "shoulder-balance-neck-standard-pro",
      "pro-shoulder-balance-neck-standard",
      "balance-neck-standard-pro-shoulder"
    ].includes(order)
  ) {
    overrides.measurementOrderPreset = order;
  }
  if (typeof voice === "boolean") {
    overrides.voiceEnabled = voice;
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

function getQuickItemMeta(value) {
  const map = {
    none: null,
    shoulder: { title: "肩部测量", desc: "抬手完成肩部活动测量", href: "./single-prepare-shoulder.html" },
    neck: { title: "颈部测量", desc: "面向屏幕完成颈部测量", href: "./single-prepare-neck.html" },
    balance: { title: "平衡测量", desc: "站稳完成平衡能力测量", href: "./single-prepare-balance.html" }
  };
  return map[value] || null;
}

function getMeasurementOrder(state) {
  const items = {
    standard: { key: "standard", title: "完整测量", href: "./standard-position.html", group: "standard" },
    pro: { key: "pro", title: "体态精测", href: "./pro-prepare.html", group: "pro" },
    singleShoulder: { key: "singleShoulder", title: "肩部测量", href: "./single-prepare-shoulder.html", group: "single" },
    singleBalance: { key: "singleBalance", title: "平衡测量", href: "./single-prepare-balance.html", group: "single" },
    singleNeck: { key: "singleNeck", title: "颈部测量", href: "./single-prepare-neck.html", group: "single" }
  };
  const presets = {
    "standard-pro-shoulder-balance-neck": ["standard", "pro", "singleShoulder", "singleBalance", "singleNeck"],
    "shoulder-balance-neck-standard-pro": ["singleShoulder", "singleBalance", "singleNeck", "standard", "pro"],
    "pro-shoulder-balance-neck-standard": ["pro", "singleShoulder", "singleBalance", "singleNeck", "standard"],
    "balance-neck-standard-pro-shoulder": ["singleBalance", "singleNeck", "standard", "pro", "singleShoulder"]
  };
  const preset = presets[state?.measurementOrderPreset] || presets["standard-pro-shoulder-balance-neck"];
  return preset.map((key) => items[key]);
}

function isMeasurementAvailable(item, state, flow) {
  if (!item) return false;
  if (item.key === "pro") {
    if (!state.proModeEnabled) return false;
    if (flow === "standard" && !state.showProEntryAfterStandard) return false;
  }
  if (item.group === "single") {
    if (!state.singleModeEnabled) return false;
    if (flow === "standard" && !state.showSingleEntryAfterStandard) return false;
  }
  return true;
}

function getNextMeasurementRecommendation(currentKey, flow, state) {
  const order = getMeasurementOrder(state);
  const currentIndex = order.findIndex((item) => item.key === currentKey);
  if (currentIndex === -1) return null;

  for (let step = 1; step <= order.length; step += 1) {
    const item = order[(currentIndex + step) % order.length];
    if (!isMeasurementAvailable(item, state, flow)) continue;
    if (state.completedGroups[item.key]) continue;
    return item;
  }
  return null;
}

function buildStateQuery(state) {
  const params = new URLSearchParams();
  params.set("quick", state.homepageQuickSingleItem || "none");
  params.set("pro", state.proModeEnabled ? "1" : "0");
  params.set("single", state.singleModeEnabled ? "1" : "0");
  params.set("showProAfterStandard", state.showProEntryAfterStandard ? "1" : "0");
  params.set("showSingleAfterStandard", state.showSingleEntryAfterStandard ? "1" : "0");
  params.set("autoNext", state.autoAdvanceToNextMeasurement ? "1" : "0");
  params.set("order", state.measurementOrderPreset || "standard-pro-shoulder-balance-neck");
  params.set("voice", state.voiceEnabled ? "1" : "0");
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
    el.addEventListener("change", () => {
      const value = el.type === "checkbox" ? el.checked : el.value;
      patchState({ [key]: value });
    });
  });
}

function navigateToTarget(target) {
  if (!target || target === "#") return;
  window.location.href = target;
}

function openReport() {
  window.location.href = REPORT_URL;
}

function speakText(text) {
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
  const state = loadState();
  if (!state.voiceEnabled) return;
  const source =
    document.querySelector("[data-voice-text]")?.dataset.voiceText ||
    document.querySelector("[data-live-voice]")?.textContent?.trim() ||
    document.querySelector(".screen-title")?.textContent?.trim();
  if (source) speakText(source);
}

function setupGuideSequence() {
  const stage = document.querySelector("[data-guide-sequence]");
  if (!stage) return;

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
  const state = loadState();
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
    if (shouldSpeak && state.voiceEnabled) speakText(step.voice);
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
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");

    function trigger() {
      navigateToTarget(withStateQuery(target, loadState()));
    }

    el.addEventListener("click", trigger);
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        trigger();
      }
    });
  });
}

function setupStageAdvance() {
  document.querySelectorAll("[data-stage-next]").forEach((el) => {
    const target = el.dataset.stageNext;
    if (!target) return;

    const delay = Number(el.dataset.stageDelay || 3000);
    const completeKey = el.dataset.stageCompleteGroup;
    const requiresClick = el.hasAttribute("data-demo-countdown-target");
    const secondsEl = el.querySelector("[data-stage-seconds]");
    const state = loadState();
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
      if (delay <= 0) {
        finishStage();
        return;
      }
      timer = window.setInterval(() => {
        remainingSeconds -= 1;
        if (secondsEl) {
          secondsEl.textContent = String(Math.max(remainingSeconds, 0));
        }
        if (remainingSeconds <= 0) {
          finishStage();
        }
      }, 1000);
    }

    if (requiresClick) {
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.classList.add("demo-click-zone");
      el.addEventListener("click", startStage);
      el.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          startStage();
        }
      });
      return;
    }

    window.setTimeout(finishStage, delay);
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
    const context = group.closest("section") || group.parentElement;
    const countdownStart = group.dataset.countdownStart || "auto";
    const flow = group.dataset.finishFlow || "";
    const current = group.dataset.finishCurrent || "";
    const items = [...group.querySelectorAll("[data-choice-item]")].filter((item) => !item.hidden);
    if (!items.length) return;

    const recommendation = getNextMeasurementRecommendation(current, flow, state);
    const nextOption = group.querySelector("[data-finish-option='next']");
    const reportOption = group.querySelector("[data-finish-option='report']");
    const labelEls = [...context.querySelectorAll("[data-auto-label]")];
    const countdownEls = [...context.querySelectorAll("[data-auto-countdown]")];

    if (nextOption) {
      if (recommendation && recommendation.href) {
        nextOption.hidden = false;
        nextOption.setAttribute("href", recommendation.href);
        nextOption.dataset.choiceLabel = `继续${recommendation.title}`;
        const title = nextOption.querySelector("[data-next-title]");
        if (title) title.textContent = `继续${recommendation.title}`;
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

    let seconds = Number(group.dataset.countdown || 3);
    let timer = null;
    let manualCountdownStarted = countdownStart !== "manual";

    function syncUI() {
      visibleItems.forEach((item) => {
        item.classList.toggle("is-active", item === activeItem);
      });
      labelEls.forEach((el) => {
        el.textContent = activeItem.dataset.choiceLabel || activeItem.textContent.trim();
      });
      context.querySelectorAll("[data-auto-prefix]").forEach((el) => {
        if (!state.autoAdvanceToNextMeasurement) {
          el.textContent = "下一步：";
          return;
        }
        if (countdownStart === "manual" && !manualCountdownStarted) {
          el.textContent = group.dataset.countdownIdlePrefix || "点击后开始演示倒计时";
          return;
        }
        el.textContent = "3 秒后自动进入";
      });
      countdownEls.forEach((el) => {
        if (!state.autoAdvanceToNextMeasurement) {
          el.hidden = true;
          return;
        }
        if (countdownStart === "manual" && !manualCountdownStarted) {
          el.hidden = true;
          return;
        }
        el.hidden = false;
        el.textContent = String(seconds);
      });
    }

    function clearTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function triggerActive() {
      clearTimer();
      activeItem.click();
    }

    function startManualCountdown() {
      if (countdownStart !== "manual" || manualCountdownStarted || !state.autoAdvanceToNextMeasurement) {
        return;
      }
      manualCountdownStarted = true;
      seconds = Number(group.dataset.countdown || 3);
      syncUI();
      clearTimer();
      timer = window.setInterval(() => {
        seconds -= 1;
        syncUI();
        if (seconds <= 0) {
          triggerActive();
        }
      }, 1000);
    }

    syncUI();

    context.querySelectorAll("[data-finish-countdown-start]").forEach((btn) => {
      btn.addEventListener("click", () => startManualCountdown());
    });

    context.querySelectorAll("[data-auto-hint-click]").forEach((hint) => {
      function onActivate(event) {
        if (
          countdownStart === "manual" &&
          state.autoAdvanceToNextMeasurement &&
          !manualCountdownStarted
        ) {
          event.preventDefault();
          startManualCountdown();
          return;
        }
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

    if (!state.autoAdvanceToNextMeasurement) return;
    if (countdownStart === "manual") return;

    timer = window.setInterval(() => {
      seconds -= 1;
      syncUI();
      if (seconds <= 0) {
        triggerActive();
      }
    }, 1000);
  });
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
    el.setAttribute("href", quickMeta.href);
    el.dataset.choiceLabel = quickMeta.title;
  });

  document.querySelectorAll("[data-show-if-pro-entry]").forEach((el) => {
    el.hidden = !(state.proModeEnabled && state.showProEntryAfterStandard);
  });
  document.querySelectorAll("[data-show-if-single-entry]").forEach((el) => {
    el.hidden = !(state.singleModeEnabled && state.showSingleEntryAfterStandard);
  });

  document.querySelectorAll("[data-stateful-link]").forEach((el) => {
    const target = el.dataset.statefulLink;
    el.setAttribute("href", withStateQuery(target, state));
  });

  const orderLabelMap = {
    "standard-pro-shoulder-balance-neck": "完整测量 → 体态精测 → 肩部 → 平衡 → 颈部",
    "shoulder-balance-neck-standard-pro": "肩部 → 平衡 → 颈部 → 完整测量 → 体态精测",
    "pro-shoulder-balance-neck-standard": "体态精测 → 肩部 → 平衡 → 颈部 → 完整测量",
    "balance-neck-standard-pro-shoulder": "平衡 → 颈部 → 完整测量 → 体态精测 → 肩部"
  };
  document.querySelectorAll("[data-order-preview]").forEach((el) => {
    el.textContent = orderLabelMap[state.measurementOrderPreset] || orderLabelMap["standard-pro-shoulder-balance-neck"];
  });

  document.querySelectorAll("[data-result-summary='standard']").forEach((el) => {
    el.textContent = state.completedGroups.standard ? "已完成" : "未测量";
  });
  document.querySelectorAll("[data-result-summary='pro']").forEach((el) => {
    el.textContent = state.completedGroups.pro ? "已完成" : "未测量";
  });
  document.querySelectorAll("[data-result-summary='single']").forEach((el) => {
    const list = [];
    if (state.completedGroups.singleShoulder) list.push("肩部");
    if (state.completedGroups.singleNeck) list.push("颈部");
    if (state.completedGroups.singleBalance) list.push("平衡");
    el.textContent = list.length ? list.join(" / ") : "未测量";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindConfigControls();
  bindActionLinks();
  renderState();
  setupChoiceHighlight();
  setupFinishAutoAdvance();
  setupGuideSequence();
  setupDemoAdvance();
  setupStageAdvance();
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
  withStateQuery
};
