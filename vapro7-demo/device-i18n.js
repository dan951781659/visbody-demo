(function () {
  const STORAGE_KEY = "vapro7-demo-state";

  const DEVICE_LOCALES = {
    zh: {
      "common.backHome": "← 首页",
      "common.back": "← 返回",
      "common.backSettings": "← 设置",
      "common.settings": "设置",
      "common.done": "完成",
      "common.returnHome": "← 返回首页",
      "common.viewResult": "请查看结果",
      "common.measuredDone": "已测完",
      "common.generated": "已生成",
      "common.exitMeasure": "退出测量",
      "common.nextStep": "进入下一步",
      "common.returnMeasureList": "返回测量项目",
      "common.gestureConfirm": "请举手确认下方操作。",
      "common.gestureHold": "*请保持当前动作",
      "common.clickOptions": "请点击上方选项",
      "common.idleDefault": "空闲默认：",
      "common.recognitionPass": "识别通过",
      "common.recognizing": "正在识别...",
      "common.measure": "测量",
      "common.proMode": "专业测量",
      "common.quickMode": "快速测量",
      "lang.zh": "中文",
      "lang.de": "Deutsch",
      "settings.title": "设备设置",
      "settings.language": "语言",
      "settings.languageTitle": "语言",
      "settings.measureFlow": "测量流程",
      "settings.showPrepPage": "显示测量准备页",
      "settings.showPrepHint": "快速测量前引导",
      "settings.voiceBroadcast": "语音播报",
      "settings.voiceDemoHint": "仅供 Demo 演示",
      "settings.voiceGuide": "测量引导语音",
      "settings.system": "系统",
      "settings.sound": "声音设置",
      "settings.brightness": "屏幕亮度",
      "settings.gesture": "手势识别",
      "settings.print": "打印设置",
      "settings.keyGuide": "按键指引",
      "settings.network": "网络设置",
      "settings.reportDelivery": "报告获取方式",
      "settings.footHeat": "脚部加热设置",
      "settings.lockScreen": "锁屏设置",
      "settings.on": "已开启",
      "standby.settings": "设置",
      "standby.enterHome": "进入测量项目选择",
      "standby.startHint": "点击屏幕开始测量",
      "standby.weightEntry": "体重测量",
      "home.status": "请站上转台",
      "home.title": "请按图示动作进入测量项目",
      "home.emptyHint": "当前未开启任何测量项目，请联系门店工作人员。",
      "home.gestureHint": "请按图示动作进入测量",
      "home.gesturePass": "识别通过，请点击「{label}」进入。",
      "singleSelect.status": "动态实验室",
      "singleSelect.pickPart": "请选择测量部位",
      "singleSelect.title": "请选择测量部位",
      "singleSelect.hint": "肩部与颈部专项均在「动态实验室」下进行，可按需分别测量。",
      "singleSelect.emptyHint": "当前未开启任何部位，请联系门店工作人员。",
      "singleSelect.shoulderTitle": "肩部测量",
      "singleSelect.shoulderDesc": "外展上举双侧采集，生成肩部活动度结果。",
      "singleSelect.neckTitle": "颈部测量",
      "singleSelect.neckDesc": "缓慢转头采集颈部活动度，生成颈部专项结果。",
      "prep.title": "测量准备",
      "prep.subtitle": "请按下方清单逐项完成准备，确认无误后再举手选择操作。",
      "prep.voice": "请按清单逐项准备好。举右手进入下一步，举左手退出测量。",
      "prep.nextHint": "站上转台，开始身高与体重采集",
      "prep.tipsTitle": "测量注意事项",
      "prep.item.fittedClothing": "穿着贴身衣物",
      "prep.item.hairTied": "扎起长发，露出头颈",
      "prep.item.barefootElectrode": "赤脚，贴合电极",
      "prep.item.naturalStance": "自然站姿即可",
      "prep.item.barefoot": "保持赤脚",
      "prep.item.footElectrode": "足底贴合电极",
      "prep.item.noExercise": "避免剧烈运动与大量饮食",
      "tip.still": "请保持身体静止",
      "tip.naturalStance": "保持自然站姿，不要刻意挺胸或收腹",
      "tip.breath": "保持自然呼吸，请勿憋气",
      "tip.lookForward": "请目视前方，避免低头或转头",
      "tip.feetContact": "双脚与电极充分接触",
      "tip.noChest": "请勿吸气收腹或刻意挺胸",
      "finish.title": "测量完成",
      "finish.subtitle": "请扫码查看详细报告。",
      "finish.scanReport": "扫码查看详细报告",
      "finish.scanPhone": "手机扫码打开报告",
      "finish.continueNext": "继续下一项测量",
      "finish.continueOrder": "按测量顺序推荐",
      "finish.completeMeasure": "完成测量",
      "finish.scanReportShort": "扫码查看报告",
      "finish.continueItem": "继续{title}",
      "finish.remeasure": "重新测量",
      "finish.gestureLast": "请举手确认完成测量。",
      "finish.gestureNext": "请举手确认下方操作。",
      "finish.voiceLast": "测量已完成。请举手确认完成测量。",
      "finish.voiceNext": "测量已完成。请举手确认下一步操作。",
      "finish.idleClick": "点击空白处后启动空闲倒计时（演示）",
      "finish.idleCountdown": "{sec} 秒无操作将默认进入：{label}",
      "finish.gestureDone": "已识别：完成测量",
      "finish.gestureContinue": "已识别：举右手 · 继续下一项",
      "generating.progress": "模型生成中 {pct}%",
      "generating.done": "模型生成完成",
      "generating.voice": "正在生成三维模型，请稍候。",
      "voice.poseDetect": "正在识别姿态，请保持不动。",
      "voice.recognitionPass": "识别通过。",
      "metric.weight": "体重",
      "metric.height": "身高",
      "metric.bodyComp": "体成分",
      "metric.girth": "体围",
      "metric.posture": "体态",
      "metric.balance": "平衡",
      "metric.girthPosture": "围度 / 体态",
      "metric.neckFlex": "颈部屈伸",
      "metric.neckSide": "颈部侧屈",
      "metric.neckRotate": "颈部旋转",
      "metric.shoulderAbduction": "外展上举",
      "metric.shoulderFlexion": "前屈上举",
      "recommend.standard": "一圈综合采集",
      "recommend.pro": "IPose 体态专项",
      "recommend.bodycompGirth": "一圈综合采集",
      "recommend.girthOnly": "单体围流程",
      "recommend.bodyCompSingle": "单项体成分",
      "recommend.circumferenceSingle": "单体围流程",
      "recommend.balance": "平衡专项",
      "recommend.dynamicLab": "动态实验室",
      "recommend.singleShoulder": "肩部专项",
      "recommend.singleNeck": "颈部专项",
      "dynamicLab.both": "肩 · 颈活动度专项；进入后请先选择测量部位",
      "dynamicLab.shoulder": "将直接进入肩部专项测量流程",
      "dynamicLab.neck": "将直接进入颈部专项测量流程",
      "dynamicLab.generic": "活动度测量",
      "quick.shoulderTitle": "肩部测量",
      "quick.shoulderDesc": "抬手完成肩部活动测量",
      "quick.neckTitle": "颈部测量",
      "quick.neckDesc": "缓慢转头完成颈部活动测量",
      "quick.balanceTitle": "平衡测量",
      "quick.balanceDesc": "站稳保持平衡并完成评估",
      "glyph.standard": "综合",
      "glyph.pro": "体态",
      "glyph.bodyCompSingle": "成分",
      "glyph.circumferenceSingle": "体围",
      "glyph.bodycompGirth": "成分",
      "glyph.girthOnly": "体围",
      "glyph.dynamicLab": "动态",
      "glyph.balance": "平衡",
      "tile.standard.title": "快速测量",
      "tile.standard.displayTitle": "快速测量",
      "tile.standard.desc": "体重、体成分、围度、身高一次出结果",
      "tile.standard.benefitDesc": "体重、体成分、围度、身高、体态一次完成",
      "tile.standard.gestureHint": "请站上转台，握紧扶手",
      "tile.pro.title": "体态测量",
      "tile.pro.displayTitle": "体态评估",
      "tile.pro.desc": "双手自然垂放，体态结果更准",
      "tile.pro.benefitDesc": "了解您的头前引、高低肩、腿型等",
      "tile.bodyCompSingle.title": "身体成分测量",
      "tile.bodyCompSingle.displayTitle": "身体成分",
      "tile.bodyCompSingle.desc": "单项体成分测量流程",
      "tile.bodyCompSingle.benefitDesc": "了解您的体重、体脂率、肌肉量、身体围度等",
      "tile.bodyCompSingle.gestureHint": "请站上转台，握紧扶手",
      "tile.circumferenceSingle.title": "体围测量",
      "tile.circumferenceSingle.displayTitle": "体围测量",
      "tile.circumferenceSingle.desc": "单项体围采集流程",
      "tile.circumferenceSingle.benefitDesc": "了解您的腰围、臀围、四肢围度等",
      "tile.bodycompGirth.title": "身体成分",
      "tile.bodycompGirth.displayTitle": "身体成分",
      "tile.bodycompGirth.desc": "体重、体成分、围度、身高一次出结果",
      "tile.bodycompGirth.benefitDesc": "体重、体成分、围度、身高、体态一次完成",
      "tile.bodycompGirth.gestureHint": "请站上转台，握紧扶手",
      "tile.girthOnly.title": "体围测量",
      "tile.girthOnly.displayTitle": "体围测量",
      "tile.girthOnly.desc": "单体围采集流程",
      "tile.girthOnly.benefitDesc": "了解您的腰围、臀围、四肢围度等",
      "tile.dynamicLab.title": "动态实验室",
      "tile.dynamicLab.displayTitle": "动态实验室",
      "tile.dynamicLab.desc": "肩 · 颈活动度测量",
      "tile.dynamicLab.benefitDesc": "肩、颈活动度专项评估",
      "tile.balance.title": "平衡测量",
      "tile.balance.displayTitle": "平衡评估",
      "tile.balance.desc": "站稳保持平衡，完成稳定性评估",
      "tile.balance.benefitDesc": "了解您的平衡稳定性与重心分布",
      "tile.weightStandalone.title": "体重测量",
      "tile.weightStandalone.displayTitle": "体重测量",
      "tile.weightStandalone.desc": "独立体重测量流程",
      "tile.weightStandalone.benefitDesc": "了解您的体重与测量时间",
      "item.standard.title": "快速测量",
      "item.pro.title": "体态测量",
      "item.bodyCompSingle.title": "身体成分测量",
      "item.circumferenceSingle.title": "体围测量",
      "item.bodycompGirth.title": "身体成分",
      "item.girthOnly.title": "体围测量",
      "item.dynamicLab.title": "动态实验室",
      "item.balance.title": "平衡测量",
      "item.weightStandalone.title": "体重测量",
      "item.singleShoulder.title": "肩部测量",
      "item.singleNeck.title": "颈部测量"
    },
    de: {
      "common.backHome": "← Start",
      "common.back": "← Zurück",
      "common.backSettings": "← Einstellungen",
      "common.settings": "Einstellungen",
      "common.done": "Fertig",
      "common.returnHome": "← Zur Startseite",
      "common.viewResult": "Ergebnis ansehen",
      "common.measuredDone": "Abgeschlossen",
      "common.generated": "Erstellt",
      "common.exitMeasure": "Messung beenden",
      "common.nextStep": "Weiter",
      "common.returnMeasureList": "Zur Messauswahl",
      "common.gestureConfirm": "Bitte heben Sie die Hand zur Bestätigung.",
      "common.gestureHold": "*Bitte Pose halten",
      "common.clickOptions": "Bitte oben eine Option wählen",
      "common.idleDefault": "Leerlauf-Standard:",
      "common.recognitionPass": "Erkannt",
      "common.recognizing": "Erkennung läuft…",
      "common.measure": "Messung",
      "common.proMode": "Profimessung",
      "common.quickMode": "Schnellmessung",
      "lang.zh": "中文",
      "lang.de": "Deutsch",
      "settings.title": "Geräteeinstellungen",
      "settings.language": "Sprache",
      "settings.languageTitle": "Sprache",
      "settings.measureFlow": "Messablauf",
      "settings.showPrepPage": "Vorbereitungsseite anzeigen",
      "settings.showPrepHint": "Vor Schnellmessung",
      "settings.voiceBroadcast": "Sprachausgabe",
      "settings.voiceDemoHint": "Nur Demo",
      "settings.voiceGuide": "Messanleitung per Sprache",
      "settings.system": "System",
      "settings.sound": "Ton",
      "settings.brightness": "Helligkeit",
      "settings.gesture": "Gestenerkennung",
      "settings.print": "Druckeinstellungen",
      "settings.keyGuide": "Tastenführung",
      "settings.network": "Netzwerk",
      "settings.reportDelivery": "Berichtabruf",
      "settings.footHeat": "Fußheizung",
      "settings.lockScreen": "Sperre",
      "settings.on": "Ein",
      "standby.settings": "Einstellungen",
      "standby.enterHome": "Zur Messauswahl",
      "standby.startHint": "Tippen zum Starten",
      "standby.weightEntry": "Gewichtsmessung",
      "home.status": "Auf Drehteller stehen",
      "home.title": "Bitte Pose gemäß Abbildung einnehmen",
      "home.emptyHint": "Keine Messung aktiv. Bitte Mitarbeiter kontaktieren.",
      "home.gestureHint": "Pose gemäß Abbildung einnehmen",
      "home.gesturePass": "Erkannt. Bitte „{label}“ antippen.",
      "singleSelect.status": "Dynamiklabor",
      "singleSelect.pickPart": "Messbereich wählen",
      "singleSelect.title": "Messbereich wählen",
      "singleSelect.hint": "Schulter- und Nackenmessungen im Dynamiklabor, jeweils separat.",
      "singleSelect.emptyHint": "Kein Bereich aktiv. Bitte Mitarbeiter kontaktieren.",
      "singleSelect.shoulderTitle": "Schultermessung",
      "singleSelect.shoulderDesc": "Abduktion beidseits, Schulterbeweglichkeit.",
      "singleSelect.neckTitle": "Nackenmessung",
      "singleSelect.neckDesc": "Langsame Kopfdrehung, Nackenbeweglichkeit.",
      "prep.title": "Messvorbereitung",
      "prep.subtitle": "Checkliste abarbeiten, dann per Geste bestätigen.",
      "prep.voice": "Bitte Checkliste abarbeiten. Rechte Hand: weiter. Linke Hand: beenden.",
      "prep.nextHint": "Auf Drehteller stehen, Größe und Gewicht erfassen",
      "prep.tipsTitle": "Hinweise zur Messung",
      "prep.item.fittedClothing": "Eng anliegende Kleidung",
      "prep.item.hairTied": "Haare binden, Nacken frei",
      "prep.item.barefootElectrode": "Barfuß, Elektroden berühren",
      "prep.item.naturalStance": "Natürliche Standposition",
      "prep.item.barefoot": "Barfuß bleiben",
      "prep.item.footElectrode": "Füße auf Elektroden",
      "prep.item.noExercise": "Kein Sport oder große Mahlzeit",
      "tip.still": "Bitte ruhig stehen",
      "tip.naturalStance": "Natürliche Haltung, nicht anspannen",
      "tip.breath": "Normal atmen, nicht die Luft anhalten",
      "tip.lookForward": "Nach vorne schauen, Kopf nicht drehen",
      "tip.feetContact": "Füße vollständig auf Elektroden",
      "tip.noChest": "Nicht einatmen oder Brust herausstrecken",
      "finish.title": "Messung abgeschlossen",
      "finish.subtitle": "QR-Code scannen für den Bericht.",
      "finish.scanReport": "Bericht per QR-Code",
      "finish.scanPhone": "Bericht am Telefon öffnen",
      "finish.continueNext": "Nächste Messung",
      "finish.continueOrder": "Empfohlene Reihenfolge",
      "finish.completeMeasure": "Messung abschließen",
      "finish.scanReportShort": "Bericht per QR",
      "finish.continueItem": "{title} fortsetzen",
      "finish.remeasure": "Erneut messen",
      "finish.gestureLast": "Bitte Hand heben zum Abschluss.",
      "finish.gestureNext": "Bitte Hand heben zur Bestätigung.",
      "finish.voiceLast": "Messung abgeschlossen. Bitte Hand heben.",
      "finish.voiceNext": "Messung abgeschlossen. Bitte nächsten Schritt bestätigen.",
      "finish.idleClick": "Leerlauf-Countdown nach Klick (Demo)",
      "finish.idleCountdown": "{sec} s bis Standard: {label}",
      "finish.gestureDone": "Erkannt: Abschluss",
      "finish.gestureContinue": "Erkannt: Weiter",
      "generating.progress": "Modell {pct}%",
      "generating.done": "Modell fertig",
      "generating.voice": "3D-Modell wird erstellt, bitte warten.",
      "voice.poseDetect": "Pose wird erkannt, bitte stillhalten.",
      "voice.recognitionPass": "Erkannt.",
      "metric.weight": "Gewicht",
      "metric.height": "Größe",
      "metric.bodyComp": "Körperzusammensetzung",
      "metric.girth": "Umfang",
      "metric.posture": "Haltung",
      "metric.balance": "Balance",
      "metric.girthPosture": "Umfang / Haltung",
      "metric.neckFlex": "Nackenbeugung",
      "metric.neckSide": "Nackenseitbeugung",
      "metric.neckRotate": "Nackendrehung",
      "metric.shoulderAbduction": "Schulterabduktion",
      "metric.shoulderFlexion": "Schulterflexion",
      "recommend.standard": "Umfassende Erfassung",
      "recommend.pro": "IPose Haltungsanalyse",
      "recommend.bodycompGirth": "Umfassende Erfassung",
      "recommend.girthOnly": "Einzel-Umfang",
      "recommend.bodyCompSingle": "Einzel Körperzusammensetzung",
      "recommend.circumferenceSingle": "Einzel-Umfang",
      "recommend.balance": "Balance-Spezial",
      "recommend.dynamicLab": "Dynamiklabor",
      "recommend.singleShoulder": "Schulter-Spezial",
      "recommend.singleNeck": "Nacken-Spezial",
      "dynamicLab.both": "Schulter · Nacken; Bereich nach dem Start wählen",
      "dynamicLab.shoulder": "Direkt zur Schultermessung",
      "dynamicLab.neck": "Direkt zur Nackenmessung",
      "dynamicLab.generic": "Beweglichkeitsmessung",
      "quick.shoulderTitle": "Schultermessung",
      "quick.shoulderDesc": "Arm heben, Schulterbeweglichkeit",
      "quick.neckTitle": "Nackenmessung",
      "quick.neckDesc": "Kopf langsam drehen",
      "quick.balanceTitle": "Balancemessung",
      "quick.balanceDesc": "Balance halten und bewerten",
      "glyph.standard": "Mix",
      "glyph.pro": "Haltung",
      "glyph.bodyCompSingle": "KZ",
      "glyph.circumferenceSingle": "Umfang",
      "glyph.bodycompGirth": "KZ",
      "glyph.girthOnly": "Umfang",
      "glyph.dynamicLab": "Dynamik",
      "glyph.balance": "Balance",
      "tile.standard.title": "Schnellmessung",
      "tile.standard.displayTitle": "Schnellmessung",
      "tile.standard.desc": "Gewicht, KZ, Umfang, Größe in einem Durchgang",
      "tile.standard.benefitDesc": "Gewicht, KZ, Umfang, Größe, Haltung",
      "tile.standard.gestureHint": "Auf Drehteller stehen, Griff halten",
      "tile.pro.title": "Haltungsmessung",
      "tile.pro.displayTitle": "Haltungsanalyse",
      "tile.pro.desc": "Arme locker, genauere Haltung",
      "tile.pro.benefitDesc": "Kopfhaltung, Schultern, Beinachse",
      "tile.bodyCompSingle.title": "Körperzusammensetzung",
      "tile.bodyCompSingle.displayTitle": "Körperzusammensetzung",
      "tile.bodyCompSingle.desc": "Einzelmessung Körperzusammensetzung",
      "tile.bodyCompSingle.benefitDesc": "Gewicht, Fett, Muskelmasse, Umfang",
      "tile.bodyCompSingle.gestureHint": "Auf Drehteller stehen, Griff halten",
      "tile.circumferenceSingle.title": "Umfangsmessung",
      "tile.circumferenceSingle.displayTitle": "Umfangsmessung",
      "tile.circumferenceSingle.desc": "Einzel-Umfangsmessung",
      "tile.circumferenceSingle.benefitDesc": "Taille, Hüfte, Gliedmaßenumfang",
      "tile.bodycompGirth.title": "Körperzusammensetzung",
      "tile.bodycompGirth.displayTitle": "Körperzusammensetzung",
      "tile.bodycompGirth.desc": "Gewicht, KZ, Umfang, Größe in einem Durchgang",
      "tile.bodycompGirth.benefitDesc": "Gewicht, KZ, Umfang, Größe, Haltung",
      "tile.bodycompGirth.gestureHint": "Auf Drehteller stehen, Griff halten",
      "tile.girthOnly.title": "Umfangsmessung",
      "tile.girthOnly.displayTitle": "Umfangsmessung",
      "tile.girthOnly.desc": "Einzel-Umfangsmessung",
      "tile.girthOnly.benefitDesc": "Taille, Hüfte, Gliedmaßenumfang",
      "tile.dynamicLab.title": "Dynamiklabor",
      "tile.dynamicLab.displayTitle": "Dynamiklabor",
      "tile.dynamicLab.desc": "Schulter · Nacken Beweglichkeit",
      "tile.dynamicLab.benefitDesc": "Schulter- und Nackenbeweglichkeit",
      "tile.balance.title": "Balancemessung",
      "tile.balance.displayTitle": "Balanceanalyse",
      "tile.balance.desc": "Balance halten, Stabilität prüfen",
      "tile.balance.benefitDesc": "Stabilität und Schwerpunkt",
      "tile.weightStandalone.title": "Gewichtsmessung",
      "tile.weightStandalone.displayTitle": "Gewichtsmessung",
      "tile.weightStandalone.desc": "Eigenständige Gewichtsmessung",
      "tile.weightStandalone.benefitDesc": "Gewicht und Messzeit",
      "item.standard.title": "Schnellmessung",
      "item.pro.title": "Haltungsmessung",
      "item.bodyCompSingle.title": "Körperzusammensetzung",
      "item.circumferenceSingle.title": "Umfangsmessung",
      "item.bodycompGirth.title": "Körperzusammensetzung",
      "item.girthOnly.title": "Umfangsmessung",
      "item.dynamicLab.title": "Dynamiklabor",
      "item.balance.title": "Balancemessung",
      "item.weightStandalone.title": "Gewichtsmessung",
      "item.singleShoulder.title": "Schultermessung",
      "item.singleNeck.title": "Nackenmessung"
    }
  };

  const PAGE_TITLE_KEYS = {
    "standby.html": "standby.enterHome",
    "home.html": "home.title",
    "settings.html": "settings.title",
    "settings-language.html": "settings.languageTitle",
    "standard-user-prep.html": "prep.title",
    "pro-user-prep.html": "prep.title",
    "standard-result.html": "finish.title",
    "pro-result.html": "finish.title",
    "single-select.html": "singleSelect.title"
  };

  function parseSavedLanguage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      if (saved?.deviceLanguage === "zh" || saved?.deviceLanguage === "de") {
        return saved.deviceLanguage;
      }
    } catch {
      /* ignore */
    }
    return null;
  }

  function getDeviceLanguage(state) {
    const lang = state?.deviceLanguage || parseSavedLanguage();
    return lang === "de" ? "de" : "zh";
  }

  function t(key, fallback, params) {
    const lang = getDeviceLanguage();
    const dict = DEVICE_LOCALES[lang] || DEVICE_LOCALES.zh;
    let str = dict[key] ?? DEVICE_LOCALES.zh[key] ?? fallback ?? key;
    if (params && typeof params === "object") {
      Object.keys(params).forEach((k) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(params[k]));
      });
    }
    return str;
  }

  function setElText(el, key, fallback, params) {
    if (!el) return;
    el.textContent = t(key, fallback, params);
  }

  function applyBinding(binding, root) {
    const el = root.querySelector(binding.sel);
    if (!el) return;
    const text = t(binding.key, binding.fallback);
    if (binding.attr === "aria-label") {
      el.setAttribute("aria-label", text);
    } else if (binding.attr === "title") {
      el.setAttribute("title", text);
    } else {
      el.textContent = text;
    }
  }

  function applyPageBindings(state) {
    const page = (window.location.pathname.split("/").pop() || "").toLowerCase();
    const root = document;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (!key) return;
      const fb = el.dataset.i18nFallback || el.textContent;
      el.textContent = t(key, fb);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (!key) return;
      el.setAttribute("placeholder", t(key, el.getAttribute("placeholder")));
    });

    document.querySelectorAll("[data-i18n-voice]").forEach((el) => {
      const key = el.dataset.i18nVoice;
      if (!key) return;
      el.dataset.voiceText = t(key, el.dataset.voiceText);
    });

    const lang = getDeviceLanguage(state);
    document.documentElement.lang = lang === "de" ? "de" : "zh-CN";

    const titleKey = PAGE_TITLE_KEYS[page];
    if (titleKey) {
      document.title = t(titleKey);
    }

    document.querySelectorAll("[data-lang-indicator]").forEach((el) => {
      el.hidden = el.dataset.langIndicator !== state.deviceLanguage;
    });

    if (page === "standby.html") {
      applyBinding({ sel: "[data-standby-no-nav].standby-settings-link", key: "standby.settings" }, root);
      applyBinding({ sel: ".standby-home-hit__label", key: "standby.enterHome" }, root);
      applyBinding({ sel: ".standby-start-hint", key: "standby.startHint" }, root);
      applyBinding({ sel: ".standby-weight-entry__label", key: "standby.weightEntry" }, root);
    }

    if (page === "home.html") {
      applyBinding({ sel: ".status-bar span:last-child", key: "home.status" }, root);
      applyBinding({ sel: ".back-link", key: "common.backHome" }, root);
      applyBinding({ sel: ".screen-title", key: "home.title" }, root);
      applyBinding({ sel: "[data-show-if-no-home-tiles]", key: "home.emptyHint" }, root);
    }

    if (page === "settings.html") {
      applyBinding({ sel: ".status-bar span:last-child", key: "common.settings" }, root);
      applyBinding({ sel: ".back-link", key: "common.backHome" }, root);
      applyBinding({ sel: ".screen-title", key: "settings.title" }, root);
      applyBinding({ sel: "#settings-group-measure-flow", key: "settings.measureFlow" }, root);
      applyBinding({ sel: "#settings-group-system", key: "settings.system" }, root);
      const settingsLabels = [
        ["[data-config-key='bodyCompositionPrepEnabled']", "settings.showPrepPage", ".settings-row__label"],
        ["", "settings.showPrepHint", ".settings-row__value--hint"],
        ["", "settings.voiceBroadcast", ".settings-row:nth-child(2) .settings-row__label"],
        ["", "settings.voiceDemoHint", ".settings-row__subhint"],
        ["", "settings.voiceGuide", ".settings-row:nth-child(2) .settings-row__value--hint"]
      ];
      const measureRows = root.querySelectorAll("#measurement-flow .settings-row");
      if (measureRows[0]) {
        const label = measureRows[0].querySelector(".settings-row__label");
        const hint = measureRows[0].querySelector(".settings-row__value--hint");
        if (label) label.textContent = t("settings.showPrepPage");
        if (hint) hint.textContent = t("settings.showPrepHint");
      }
      if (measureRows[1]) {
        const label = measureRows[1].querySelector(".settings-row__label");
        const sub = measureRows[1].querySelector(".settings-row__subhint");
        const hint = measureRows[1].querySelector(".settings-row__value--hint");
        if (label) label.textContent = t("settings.voiceBroadcast");
        if (sub) sub.textContent = t("settings.voiceDemoHint");
        if (hint) hint.textContent = t("settings.voiceGuide");
      }
      const systemRows = root.querySelectorAll(".settings-group:not(#measurement-flow) .settings-row__label");
      const systemKeys = [
        "settings.sound",
        "settings.brightness",
        "settings.gesture",
        "settings.print",
        "settings.keyGuide",
        "settings.network",
        "settings.language",
        "settings.reportDelivery",
        "settings.footHeat",
        "settings.lockScreen"
      ];
      systemRows.forEach((el, i) => {
        if (systemKeys[i]) el.textContent = t(systemKeys[i]);
      });
      root.querySelectorAll(".settings-row__value").forEach((el) => {
        if (el.textContent.trim() === "已开启") el.textContent = t("settings.on");
      });
    }

    if (page === "single-select.html") {
      applyBinding({ sel: ".status-bar span:last-child", key: "singleSelect.status" }, root);
      applyBinding({ sel: ".text-link", key: "singleSelect.pickPart" }, root);
      applyBinding({ sel: ".screen-title", key: "singleSelect.title" }, root);
      applyBinding({ sel: ".dynamic-lab-scope-hint", key: "singleSelect.hint" }, root);
      applyBinding({ sel: "[data-show-if-no-single]", key: "singleSelect.emptyHint" }, root);
      applyBinding({ sel: "[data-show-if-single-key='singleShoulder'] .card-title", key: "singleSelect.shoulderTitle" }, root);
      applyBinding({ sel: "[data-show-if-single-key='singleShoulder'] .card-desc", key: "singleSelect.shoulderDesc" }, root);
      applyBinding({ sel: "[data-show-if-single-key='singleNeck'] .card-title", key: "singleSelect.neckTitle" }, root);
      applyBinding({ sel: "[data-show-if-single-key='singleNeck'] .card-desc", key: "singleSelect.neckDesc" }, root);
    }

    if (page === "standard-user-prep.html" || page === "pro-user-prep.html") {
      applyBinding({ sel: ".status-bar span:last-child", key: "prep.title" }, root);
      applyBinding({ sel: ".text-link", key: "prep.title" }, root);
      applyBinding({ sel: ".screen-title", key: "prep.title" }, root);
      applyBinding({ sel: ".screen-subtitle", key: "prep.subtitle" }, root);
      applyBinding({ sel: "[data-gesture-bubble]", key: "common.gestureConfirm" }, root);
      applyBinding({ sel: "[data-gesture-hold-hint]", key: "common.gestureHold" }, root);
      applyBinding({ sel: "[data-prep-option='exit'] strong", key: "common.exitMeasure" }, root);
      applyBinding({ sel: "[data-prep-option='exit'] span", key: "common.returnMeasureList" }, root);
      applyBinding({ sel: "[data-prep-option='next'] strong", key: "common.nextStep" }, root);
      applyBinding({ sel: "[data-prep-option='next'] span", key: "prep.nextHint" }, root);
      const prepRoot = root.querySelector("[data-prep-gesture-advance], [data-prep-exit]");
      if (prepRoot?.dataset) {
        prepRoot.dataset.voiceText = t("prep.voice", prepRoot.dataset.voiceText);
      }
    }

    if (page.endsWith("-result.html") || page === "standard-result.html" || page === "pro-result.html") {
      applyBinding({ sel: ".status-bar span:last-child", key: "finish.title" }, root);
      applyBinding({ sel: ".back-link", key: "common.returnHome" }, root);
      applyBinding({ sel: ".text-link", key: "common.viewResult" }, root);
      applyBinding({ sel: ".screen-title", key: "finish.title" }, root);
      root.querySelectorAll(".screen-subtitle").forEach((el) => {
        el.textContent = t("finish.subtitle");
      });
      applyBinding({ sel: "[data-finish-option='report'] strong", key: "finish.scanReport" }, root);
      applyBinding({ sel: "[data-finish-option='report'] span", key: "finish.scanPhone" }, root);
      applyBinding({ sel: "[data-next-title]", key: "finish.continueNext" }, root);
      applyBinding({ sel: "[data-next-desc]", key: "finish.continueOrder" }, root);
      applyBinding({ sel: ".scheme-one-weak a", key: "common.done" }, root);
    }
  }

  function applyDeviceI18n(state) {
    applyPageBindings(state || { deviceLanguage: getDeviceLanguage() });
  }

  window.Vapro7I18n = {
    DEVICE_LOCALES,
    getDeviceLanguage,
    t,
    applyDeviceI18n
  };
})();
