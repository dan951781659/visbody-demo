(function () {
  const A = 'assets/';
  const P = {
    home: '<path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/>',
    dumb: '<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>',
    user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.2-3.6 4-5.2 7.5-5.2s6.3 1.6 7.5 5.2"/>',
    bt: '<path d="m7 7.5 10 9-5 4.5V3l5 4.5-10 9"/>',
    chev: '<path d="m9.5 6 6 6-6 6"/>',
    down: '<path d="m6 9.5 6 6 6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="m14.5 6-6 6 6 6"/>',
    swap: '<path d="M7 8h12l-3.5-3.5M17 16H5l3.5 3.5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    filter: '<path d="M4 7h16M7 12h10M10 17h4"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>',
    pause: '<rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" stroke="none"/><rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" stroke="none"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    spark: '<path d="M12 4l1.8 4.7 4.7 1.8-4.7 1.8L12 17l-1.8-4.7-4.7-1.8 4.7-1.8z"/>',
    cal: '<rect x="4" y="5.5" width="16" height="14" rx="3"/><path d="M8 3.5v4M16 3.5v4M4 10h16"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 2"/>',
    flame: '<path d="M12 3.5c.8 3.2 5 5.2 5 9.8a5 5 0 0 1-10 0c0-2 .9-3.4 2-4.4.3 1.4 1 2.3 2 2.3 0-3 .2-5.4 1-7.7z"/>',
    kb: '<path d="M9 8.5a3 3 0 0 1 6 0"/><path d="M6.8 10h10.4l1.6 9.5H5.2z"/>',
    acct: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="10" r="2.8"/><path d="M7.2 17.6c1-2 2.7-3 4.8-3s3.8 1 4.8 3"/>',
    help: '<circle cx="12" cy="12" r="8"/><path d="M9.7 9.6a2.4 2.4 0 1 1 3.3 2.2c-.7.3-1 .8-1 1.5v.4M12 16.6v.2"/>',
    wifi: '<path d="M3.5 9.5a12 12 0 0 1 17 0M6.5 12.6a7.6 7.6 0 0 1 11 0M9.4 15.6a3.4 3.4 0 0 1 5.2 0"/><circle cx="12" cy="18.4" r=".9" fill="currentColor"/>',
    sig: '<path d="M5 18v-2M9 18v-5M13 18v-8M17 18V7"/>'
  };
  const ic = (n, s = 11, w = 1.9) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;
  const icFree = (s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5.6" cy="12" r="3.7"/>
    <circle cx="18.4" cy="12" r="3.7"/>
    <rect x="8.4" y="10.35" width="7.2" height="3.3" rx="1.65"/>
    <circle cx="5.6" cy="12" r="1.45" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.2"/>
    <circle cx="18.4" cy="12" r="1.45" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.2"/>
  </svg>`;

  let LANG = 'zh';
  const I18N = {
    zh: {
      connect: '连接设备', navHome: '首页', navFree: '自由训练', navAll: '全部训练', navMe: '我的',
      kindS: '力量训练', kindP: '普拉提训练', kindC: '阻力有氧',
      typeS: '力量', typeP: '普拉提', typeC: '阻力有氧',
      time: '时长', reps: '次数', resist: '总阻力', energy: '输出能量', cal: '卡路里',
      uRep: '次', running: '训练中', chart: '幅度和功率', range: '幅度', power: '功率',
      leftL: '左 L', rightR: '右 R', avg: '平均 62.4',
      wMode: '重量模式', spring: '弹簧', standard: '标准', ecc: '离心', iso: '等速',
      gear: '器械', bar: '杠铃', noBar: '非杠铃', motor: '电机', motL: '左电机', motR: '右电机',
      factor: '系数', step: '步进', end: '结束', pause: '暂停',
      goal: '目标', burn: '消耗', sess: '频次', uMin: '分',
      date: '11 月 12 日 周四 · 下午好，Alex',
      todayPlan: '今日计划', planTitle: '全身力量训练计划', planMeta: '第 1 周 第 2 天 · 3 个动作',
      startToday: '开始今日训练', start: '开始',
      free: '自由训练', freeQuick: '自由训练 · 快速开始', freeSub: '力量 / 普拉提 / 阻力有氧',
      rec: '为你推荐', all: '全部训练', featured: '精选', plans: '计划', moves: '动作', aiMoves: 'AI 动作',
      plan: '计划', move: '动作', aiMove: 'AI 动作',
      p1: '全身力量入门', p1m: '4 周 · 每周 3 次',
      p2: '普拉提柔韧进阶', p2m: '6 周 · 每周 2 次',
      p3: '阻力有氧燃脂入门', p3m: '4 周 · 每周 3 次',
      a1: '站姿推举', a1m: '入门 · 肩部', a2: '坐姿划船', a2m: '进阶 · 背部',
      a3: '仰卧外展内收', a3m: '入门 · 全身',
      act1: '站姿推举', act2: '坐姿划船', act3: '深蹲',
      footnote: '页面数字为示意 · 400×711 逻辑单位 · 1080×1920 导出',
      days: '累计训练', uDay: '天', logout: '退出登录',
      last7: '近 7 天', records: '训练记录', volume: '容量',
      myTrain: '我的训练', myPlan: '我的训练计划', next: '安排下一次训练',
      recent: '最近训练', seeAll: '查看全部',
      r1: '全身力量入门', r1d: '11 月 12 日', r1m: '36 分钟',
      r2: 'AI · 坐姿推举', r2d: '11 月 10 日', r2m: '24 分钟',
      settings: '设备与设置', device: '设备设置', account: '账户设置', help: '帮助与反馈',
      libTitle: '全部训练', libCnt: '动作 14 项', libSum: '全部类型 · 全部部位',
      l0: '跪姿拥抱大树', l0m: '入门 · 上肢', l1: '仰卧外展内收', l1m: '入门 · 全身',
      l2: '站姿推举', l2m: '入门 · 肩部', l3: '坐姿划船', l3m: '进阶 · 背部',
      l4: '直臂划船', l4m: '入门 · 上肢', l5: '站姿深蹲', l5m: '进阶 · 下肢',
      l6: '弓步推蹬', l6m: '进阶 · 下肢', l7: '前屈伸展', l7m: '入门 · 柔韧',
      l8: '绳索下拉', l8m: '入门 · 背部', l9: '核心卷腹', l9m: '进阶 · 核心'
    },
    en: {
      connect: 'Connect', navHome: 'Home', navFree: 'Free', navAll: 'All', navMe: 'Me',
      kindS: 'Strength', kindP: 'Pilates', kindC: 'Cardio',
      typeS: 'Strength', typeP: 'Pilates', typeC: 'Cardio',
      time: 'Time', reps: 'Reps', resist: 'Load', energy: 'Energy', cal: 'Calories',
      uRep: 'x', running: 'Live', chart: 'Range & Power', range: 'Range', power: 'Power',
      leftL: 'Left L', rightR: 'Right R', avg: 'Avg 62.4',
      wMode: 'Mode', spring: 'Spring', standard: 'Std', ecc: 'Ecc', iso: 'Iso',
      gear: 'Gear', bar: 'Bar', noBar: 'Other', motor: 'Motor', motL: 'Left', motR: 'Right',
      factor: 'Factor', step: 'Step', end: 'End', pause: 'Pause',
      goal: 'Goal', burn: 'Burn', sess: 'Sessions', uMin: 'min',
      date: 'Thu, Nov 12 · Good afternoon, Alex',
      todayPlan: "Today's Plan", planTitle: 'Full-body Strength Plan', planMeta: 'Week 1 · Day 2 · 3 moves',
      startToday: 'Start today', start: 'Start',
      free: 'Free Training', freeQuick: 'Free Training · Quick start', freeSub: 'Strength / Pilates / Cardio',
      rec: 'For you', all: 'See all', featured: 'Picks', plans: 'Plans', moves: 'Moves', aiMoves: 'AI Moves',
      plan: 'Plan', move: 'Move', aiMove: 'AI Move',
      p1: 'Full-body Strength', p1m: '4 wk · 3×/wk',
      p2: 'Pilates Mobility', p2m: '6 wk · 2×/wk',
      p3: 'Cardio Burn', p3m: '4 wk · 3×/wk',
      a1: 'Standing Press', a1m: 'Beginner · Shoulders', a2: 'Seated Row', a2m: 'Advanced · Back',
      a3: 'Supine Adduct', a3m: 'Beginner · Full body',
      act1: 'Standing Press', act2: 'Seated Row', act3: 'Squat',
      footnote: 'Figures are illustrative · 400×711 logical · 1080×1920 export',
      days: 'Streak', uDay: 'd', logout: 'Log out',
      last7: 'Last 7 days', records: 'History', volume: 'Volume',
      myTrain: 'My training', myPlan: 'My training plan', next: 'Schedule next session',
      recent: 'Recent', seeAll: 'See all',
      r1: 'Full-body Strength', r1d: 'Nov 12', r1m: '36 min',
      r2: 'AI · Seated Press', r2d: 'Nov 10', r2m: '24 min',
      settings: 'Device & settings', device: 'Device', account: 'Account', help: 'Help & feedback',
      libTitle: 'All training', libCnt: '14 moves', libSum: 'All types · All body',
      l0: 'Kneeling Tree Hug', l0m: 'Beginner · Upper', l1: 'Supine Adduct', l1m: 'Beginner · Full body',
      l2: 'Standing Press', l2m: 'Beginner · Shoulders', l3: 'Seated Row', l3m: 'Advanced · Back',
      l4: 'Straight-arm Row', l4m: 'Beginner · Upper', l5: 'Standing Squat', l5m: 'Advanced · Lower',
      l6: 'Lunge Press', l6m: 'Advanced · Lower', l7: 'Forward Fold', l7m: 'Beginner · Mobility',
      l8: 'Cable Pulldown', l8m: 'Beginner · Back', l9: 'Core Crunch', l9m: 'Advanced · Core'
    }
  };
  const t = k => I18N[LANG][k];

  function ring(p, size, sw) {
    const r = (size - sw) / 2, c = 2 * Math.PI * r, h = size / 2;
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${h}" cy="${h}" r="${r}" fill="none" stroke="var(--ring-track)" stroke-width="${sw}"/><circle cx="${h}" cy="${h}" r="${r}" fill="none" stroke="var(--ring)" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${(c * p).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${h} ${h})"/></svg>`;
  }
  function dialTick(v, unit, p, size) {
    const S = 200, h = 100, n = 48, from = 135, sweep = 270;
    let ticks = '';
    for (let i = 0; i <= n; i++) {
      const a = (from + sweep * i / n) * Math.PI / 180, on = i / n <= p, big = i % 8 === 0;
      const r1 = 96, r2 = big ? 82 : 88;
      ticks += `<line x1="${(h + r1 * Math.cos(a)).toFixed(1)}" y1="${(h + r1 * Math.sin(a)).toFixed(1)}" x2="${(h + r2 * Math.cos(a)).toFixed(1)}" y2="${(h + r2 * Math.sin(a)).toFixed(1)}" stroke="${on ? 'var(--d-on)' : 'var(--d-off)'}" stroke-width="${big ? 3 : 2}" stroke-linecap="round"/>`;
    }
    const ka = (from + sweep * p) * Math.PI / 180;
    return `<div class="dial" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 ${S} ${S}"><circle cx="${h}" cy="${h}" r="70" fill="var(--d-disc)"/>${ticks}<circle cx="${(h + 66 * Math.cos(ka)).toFixed(1)}" cy="${(h + 66 * Math.sin(ka)).toFixed(1)}" r="6" fill="var(--d-on)"/></svg><div class="c"><b class="num">${v}</b><span>${unit}</span></div></div>`;
  }
  function dialArc(v, unit, p, size) {
    const S = 200, h = 100, r = 80, C = 2 * Math.PI * r, sweep = C * .75;
    let ticks = '';
    for (let i = 0; i <= 48; i++) {
      const a = (135 + 270 * i / 48) * Math.PI / 180, big = i % 8 === 0;
      const r1 = 98, r2 = big ? 90 : 93.5;
      ticks += `<line x1="${(h + r1 * Math.cos(a)).toFixed(1)}" y1="${(h + r1 * Math.sin(a)).toFixed(1)}" x2="${(h + r2 * Math.cos(a)).toFixed(1)}" y2="${(h + r2 * Math.sin(a)).toFixed(1)}" stroke="var(--d-off)" stroke-width="${big ? 2.4 : 1.6}" stroke-linecap="round"/>`;
    }
    const ka = (135 + 270 * p) * Math.PI / 180;
    return `<div class="dial" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 ${S} ${S}">${ticks}
      <circle cx="${h}" cy="${h}" r="${r}" fill="none" stroke="var(--d-disc)" stroke-width="11" stroke-linecap="round" stroke-dasharray="${sweep.toFixed(1)} ${C.toFixed(1)}" transform="rotate(135 ${h} ${h})"/>
      <circle cx="${h}" cy="${h}" r="${r}" fill="none" stroke="var(--d-on)" stroke-width="11" stroke-linecap="round" stroke-dasharray="${(sweep * p).toFixed(1)} ${C.toFixed(1)}" transform="rotate(135 ${h} ${h})"/>
      <circle cx="${(h + r * Math.cos(ka)).toFixed(1)}" cy="${(h + r * Math.sin(ka)).toFixed(1)}" r="6.5" fill="#fff" stroke="var(--d-on)" stroke-width="3"/></svg>
      <div class="cdisc"></div><div class="c"><b class="num">${v}</b><span>${unit}</span></div></div>`;
  }
  const rnd = s => { s = Math.sin(s * 127.1 + 31.7) * 43758.5453; return s - Math.floor(s); };
  function wavePath(seed, scale, W, H, reps, shift) {
    const per = 14, pts = [];
    const widths = Array.from({ length: reps }, (_, r) => 0.82 + 0.4 * rnd(seed * 5 + r));
    const total = widths.reduce((a, b) => a + b, 0);
    let x0 = shift * 2;
    for (let r = 0; r < reps; r++) {
      const a = (0.5 + 0.42 * rnd(seed + r * 1.7)) * scale;
      const w = widths[r] / total * (W - shift * 2);
      const hold = 0.03 + 0.08 * rnd(seed * 3 + r);
      for (let k = 0; k < per; k++) {
        const tt = k / per;
        const y = a * (0.5 - 0.5 * Math.cos(2 * Math.PI * Math.min(1, tt / (1 - hold))));
        pts.push([x0 + tt * w, H - 5 - y * (H - 14)]);
      }
      x0 += w;
    }
    pts.push([W, H - 5]);
    return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  }
  let gid = 0;
  function curves() {
    const W = 340, H = 100, id = 'gl' + (++gid);
    const l = wavePath(3, 1, W, H, 8, 0), r = wavePath(11, .9, W, H, 8, 4);
    const st = 'fill="none" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"';
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" width="100%" height="100%"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--acc-ink);stop-opacity:.14"/><stop offset="1" style="stop-color:var(--acc-ink);stop-opacity:0"/></linearGradient></defs>
      <path d="${l} L${W} ${H} L0 ${H} Z" fill="url(#${id})" stroke="none"/>
      <path class="gw" d="${r}" ${st} stroke="var(--amb)" stroke-width="4" style="stroke-opacity:var(--glow-b)"/>
      <path d="${r}" ${st} stroke="var(--amb)" stroke-width="2.8"/>
      <path class="gw" d="${l}" ${st} stroke="var(--acc-ink)" stroke-width="4" style="stroke-opacity:var(--glow-a)"/>
      <path d="${l}" ${st} stroke="var(--acc-ink)" stroke-width="2.8"/></svg>`;
  }

  const status = () => `<div class="sb num"><span>22:56</span><span class="sb-r">${ic('sig', 9, 2.2)}${ic('wifi', 9, 2)}<i class="bat"></i></span></div>`;
  const connect = () => `<span class="pill">${ic('bt', 9)}${t('connect')}</span>`;
  const brandHd = () => `<div class="hd"><b class="logo big">MOTION</b>${connect()}</div>`;
  const seg = (items, on, cls = '') => `<span class="seg ${cls}">${items.map((x, i) => `<i class="${i === on ? 'on' : ''}">${x}</i>`).join('')}</span>`;
  const secH = (title, more) => `<div class="sec-h"><h3>${title}</h3>${more ? `<a>${more}${ic('chev', 8)}</a>` : ''}</div>`;
  const tabs = (v, on) => {
    const items = [['home', t('navHome')], ['dumb', t('navFree')], ['grid', t('navAll')], ['user', t('navMe')]];
    const h = items.map(([i, label], k) => `<div class="${k === on ? 'on' : ''}">${ic(i, v === 'v3' ? 15 : 17, k === on ? 2.2 : 1.8)}<span>${label}</span></div>`).join('');
    return `<div class="${v === 'v3' ? 'navf' : 'tabs'}">${h}</div>`;
  };

  const KIND = {
    strength: { tk: 'kindS', m: ['12:36', '24', '3.0', '1.8', '12'], on: 0, k: 'k-s' },
    pilates: { tk: 'kindP', m: ['12:36', '24', '6.0', '2.4', '15'], on: 1, k: 'k-p' },
    cardio: { tk: 'kindC', m: ['12:36', '36', '3.0', '2.1', '18'], on: 2, k: 'k-c' }
  };
  const metrics = kind => {
    const m = KIND[kind].m;
    return [[t('time'), m[0], ''], [t('reps'), m[1], t('uRep')], [t('resist'), m[2], 'kg'], [t('energy'), m[3], 'kJ'], [t('cal'), m[4], 'kcal']];
  };
  const m5 = (kind, cls) => `<div class="${cls} num">${metrics(kind).map(([l, v, u]) => `<div><span>${l}</span><b>${v}${u ? `<i>${u}</i>` : ''}</b></div>`).join('')}</div>`;
  const hero = kind => { const M = metrics(kind); return `<div class="hero num"><div class="main"><span>${t('time')}</span><b>${M[0][1]}</b></div><div class="g4">${M.slice(1).map(([l, v, u]) => `<div><span>${l}</span><b>${v}<i>${u}</i></b></div>`).join('')}</div></div>`; };
  const m3 = kind => { const M = metrics(kind); return `<div class="m3 num"><div class="t"><span>${t('time')}</span><b>${M[0][1]}</b></div><div class="r4">${M.slice(1).map(([l, v, u]) => `<div><span>${l}</span><b>${v}<i>${u}</i></b></div>`).join('')}</div></div>`; };
  const header = kind => `<div class="hd"><b class="logo">MOTION</b><h2><i class="tdot"></i>${t(KIND[kind].tk)}</h2><span class="conn"><i></i>${t('running')}</span></div>`;
  const chart = flat => `<div class="chart ${flat ? 'flat' : 'card'}"><div class="h"><b>${t('chart')}</b>${seg([t('range'), t('power')], 0, 'sm')}</div>
    <div class="lg"><span><i class="sw-l"></i>${t('leftL')}</span><span><i class="sw-r"></i>${t('rightR')}</span><em class="num">${t('avg')}</em></div>
    <div class="plot">${curves()}</div></div>`;

  const SPR = [['ic_green_spring.webp', '6.0'], ['ic_yellow_spring.webp', '6.5'], ['ic_yellow_spring_2.webp', '6.5'], ['ic_red_spring.webp', '13.5'], ['ic_red_spring_2.webp', '13.5']];
  const springs = () => `<div class="springs num">${SPR.map(([s, w], i) => `<div class="${i === 0 ? 'on' : ''}"><img src="${A}${s}" alt=""><b>${w}</b></div>`).join('')}</div>`;
  const rowsLiHtml = () => `<div class="r"><span>${t('wMode')}</span>${seg([t('spring'), t('standard'), t('ecc'), t('iso')], 0)}</div>
    <div class="r"><span>${t('gear')}</span>${seg([t('bar'), t('noBar')], 1)}</div>
    <div class="r"><span>${t('motor')}</span>${seg([t('motL'), t('motR')], 0)}</div>`;
  const sld = () => `<div class="sld"><span>${t('factor')}</span><span class="tr"><i></i><em></em></span><b class="num">5</b></div>`;
  const dialRow = (d, step) => `<div class="dialrow"><span class="ib">${ic('minus', 13, 2)}</span>${d}<span class="ib">${ic('plus', 13, 2)}</span></div><p class="step">${t('step')} ${step} kg</p>`;
  const types = on => `<div class="types dis">${[t('typeS'), t('typeP'), t('typeC')].map((x, i) => `<i class="${i === on ? 'on' : ''}">${x}</i>`).join('')}</div>`;
  const acts = start => `<div class="act"><span class="ib">${ic('back', 12)}</span><span class="ib">${ic('swap', 12)}</span><button class="end">${t('end')}</button>${start}</div>`;

  function train(v, kind) {
    const K = KIND[kind], pil = kind === 'pilates';
    const dsz = v === 'v3' ? (pil ? 142 : 150) : (pil ? 150 : 162);
    const dial = v === 'v3' ? dialArc : dialTick;
    let cfg;
    if (pil) cfg = `${springs()}<div class="r"><span>${t('wMode')}</span>${seg([t('standard'), t('spring'), t('ecc')], 1)}</div>${dialRow(dial('6.0', 'kg', .3, dsz), '1.0')}`;
    else cfg = `${rowsLiHtml()}${dialRow(dial('3.0', 'kg', .2, dsz), '0.5')}${sld()}`;
    let body;
    if (v === 'v1') body = `${m5(kind, 'card m5')}${chart(false)}<div class="card cfg">${cfg}</div>`;
    else if (v === 'v2') body = `${hero(kind)}${chart(false)}<div class="card cfg">${cfg}</div>`;
    else body = `${m3(kind)}${chart(true)}<div class="cfg">${cfg}</div>`;
    const pauseBtn = v === 'v3'
      ? `<button class="start"><span class="tx">${t('pause')}</span><span class="ar">${ic('pause', 13)}</span></button>`
      : `<button class="start">${ic('pause', 11)}${t('pause')}</button>`;
    const bottom = v === 'v3'
      ? `<div class="dock">${types(K.on)}${acts(pauseBtn)}</div>`
      : `<div class="foot">${types(K.on)}${acts(pauseBtn)}</div>`;
    return `${status()}${header(kind)}<div class="body">${body}</div>${bottom}`;
  }

  const TC = () => ({ s: t('typeS'), p: t('typeP'), c: t('typeC') });
  const REC = () => [
    ['plan', 'plan_full.webp', 's', t('plan'), t('p1'), t('p1m'), 0],
    ['plan', 'plan_flex.webp', 'p', t('plan'), t('p2'), t('p2m'), 0],
    ['plan', 'plan_core.webp', 'c', t('plan'), t('p3'), t('p3m'), 0],
    ['act', 'sport_press.jpg', 's', t('move'), t('a1'), t('a1m'), 0],
    ['act', 'sport_row.jpg', 's', t('move'), t('a2'), t('a2m'), 1],
    ['act', 'action_supine.webp', 'p', t('move'), t('a3'), t('a3m'), 0]
  ];
  const tag = (kind, isAi) => isAi
    ? `<span class="tag ai">${ic('spark', 8, 2.4)}${t('aiMove')}</span>`
    : `<span class="tag ${kind === 'plan' ? 'pl' : 'ac'}">${kind === 'plan' ? t('plan') : t('move')}</span>`;
  const rec = ([kind, img, k, , name, meta, isAi]) => `<div class="rc"><img src="${A}${img}" alt="">${tag(kind, isAi)}<div class="tx"><b>${name}</b><span>${TC()[k]} · ${meta}</span></div></div>`;
  const chips = () => `<div class="chips"><b class="on">${t('featured')}</b><b>${t('plans')}</b><b>${t('moves')}</b><b class="aic">${ic('spark', 8)}${t('aiMoves')}</b></div>`;

  function rings3(size, sw, gap, vals, cols) {
    const h = size / 2; let o = '';
    vals.forEach((p, i) => {
      const r = h - sw / 2 - i * (sw + gap), c = 2 * Math.PI * r;
      o += `<circle cx="${h}" cy="${h}" r="${r}" fill="none" stroke="var(--ring-track)" stroke-width="${sw}"/><circle cx="${h}" cy="${h}" r="${r}" fill="none" stroke="${cols[i]}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${(c * p).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${h} ${h})"/>`;
    });
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${o}</svg>`;
  }
  const rw = (size, inner) => `<div class="ringw" style="width:${size}px;height:${size}px">${inner}<div class="c"><b class="num">65%</b><span>${t('goal')}</span></div></div>`;
  const GM = () => [['amb', t('burn'), '186', 'kcal'], ['grn', t('time'), '20.5', t('uMin')], ['acc', t('sess'), '4', t('uRep')]];
  function goal(v) {
    const gm = GM();
    if (v === 'v1') {
      return `<div class="goal g1 card">${rw(90, rings3(90, 6.5, 2.5, [.65, .8, .5], ['var(--amb)', 'var(--grn)', 'var(--acc-ink)']))}
        <div class="gm num">${gm.map(([c, l, n, u]) => `<div><b>${n}<i>${u}</i></b><span class="lb"><i class="dot" style="background:var(--${c === 'acc' ? 'acc-ink' : c})"></i>${l}</span></div>`).join('')}</div></div>`;
    }
    if (v === 'v2') {
      return `<div class="goal g2"><div class="cols num">${gm.map(([c, l, n, u]) => `<div><b>${n}<i>${u}</i></b><span>${l}</span></div>`).join('')}</div>${rw(80, ring(.65, 80, 8))}</div>`;
    }
    return `<div class="goal g3"><div class="disc">${rw(86, ring(.65, 86, 9))}</div>
      <div class="bd num">${gm.map(([c, l, n, u], i) => `<div class="b${i + 1}" style="--c:var(--${c}-ink);--cs:var(--${c}-soft)"><b>${n}<i>${u}</i></b><span>${l}</span></div>`).join('')}</div></div>`;
  }
  const PLAN = () => [[t('act1'), '3×12'], [t('act2'), '3×12'], [t('act3'), '3×12']];
  const planCard = v => `<div class="plancard ${v}"><div class="ph"><img src="${A}sport_press.jpg" alt=""></div><div class="px"><span class="k">${t('todayPlan')}</span><b>${t('planTitle')}</b><em>${t('planMeta')}</em><ul>${PLAN().map(([a, b], i) => `<li><span><i class="n num">${i + 1}</i>${a}</span><em>${b}</em></li>`).join('')}</ul><button class="cta">${ic('play', 10)}${t('startToday')}</button></div></div>`;
  const freeRow = v => {
    const title = v === 'v1' ? t('free') : t('freeQuick');
    const go = (v === 'v1' || v === 'v2')
      ? `<span class="go">${t('start')}${ic('arrow', 9, 2.2)}</span>`
      : `<span class="go">${ic('arrow', 12, 2.2)}</span>`;
    return `<button class="free ${v}"><span class="tile">${icFree(18)}</span><span class="tx"><b>${title}</b><span>${t('freeSub')}</span></span>${go}</button>`;
  };
  const dateLn = () => `<p class="date">${t('date')}</p>`;

  function home(v) {
    const sec = `<div class="sec">${secH(t('rec'), t('all'))}${chips()}<div class="g2c">${REC().map(rec).join('')}</div></div>
      <p class="foot-note">${t('footnote')}</p>`;
    if (v === 'v2') {
      return `<div class="hero2">${status()}${brandHd()}${dateLn()}${goal(v)}</div>
        <div class="body">${planCard(v)}${freeRow(v)}${sec}</div>${tabs(v, 0)}`;
    }
    return `${status()}<div class="body">${brandHd()}${dateLn()}${goal(v)}${planCard(v)}${freeRow(v)}${sec}</div>${tabs(v, 0)}`;
  }

  const WK = () => [['pur', 'cal', t('sess'), '9', t('uRep')], ['grn', 'clock', t('time'), '120', t('uMin')], ['amb', 'flame', t('burn'), '860', 'kcal'], ['acc', 'kb', t('volume'), '5.2', 'k']];
  const wkItem = ([c, i, l, n, u]) => `<div style="--c:var(--${c}-ink);--cs:var(--${c === 'acc' ? 'acc' : c}-soft)"><span class="lb"><i class="ico">${ic(i, 9, 2)}</i>${l}</span><b>${n}<i>${u}</i></b></div>`;
  const RECENT = () => [['dumb', 'acc', t('r1'), t('r1d'), t('r1m')], ['spark', 'pur', t('r2'), t('r2d'), t('r2m')]];
  const recentLi = ([i, c, title, d, m]) => `<li style="--c:var(--${c}-ink);--cs:var(--${c}-soft)"><i class="ri">${ic(i, 11, 2)}</i><div><b>${title}</b><span>${d}</span></div><em class="num">${m}</em></li>`;
  const myplan = v => `<div class="myplan ${v}"><span class="cal">${ic('cal', 16, 2)}</span><span class="t2"><b>${t('myPlan')}</b><span class="s">${t('next')}</span></span><span class="go">${ic('arrow', 10)}</span></div>`;
  const myTrain = v => `<div class="blk">${secH(t('myTrain'))}${myplan(v)}<div class="rh"><b>${t('recent')}</b><em>${t('seeAll')}</em></div><ul class="recent ${v === 'v3' ? 'caps' : 'card'}">${RECENT().map(recentLi).join('')}</ul></div>`;
  const row = (i, label) => `<div><i class="lt">${ic(i, 12)}</i><span>${label}</span>${ic('chev', 10)}</div>`;
  const myList = v => `<div class="blk">${secH(t('settings'))}<div class="list ${v === 'v3' ? 'caps' : 'card'}">${row('bt', t('device'))}${row('acct', t('account'))}${row('help', t('help'))}</div></div>`;
  const daysHtml = () => `<div class="days"><span>${t('days')}</span><b class="num">42<i>${t('uDay')}</i></b></div>`;
  const identL = () => `<span class="ava">A</span><span class="nm"><b>Alex</b><a>${t('logout')}</a></span>`;

  function me(v) {
    if (v === 'v1') {
      return `${status()}<div class="body me"><div class="grp">${brandHd()}<div class="ident">${identL()}${daysHtml()}</div></div>
        <div class="blk">${secH(t('last7'), t('records'))}<div class="wk num card">${WK().map(wkItem).join('')}</div></div>
        ${myTrain(v)}${myList(v)}</div>${tabs(v, 3)}`;
    }
    if (v === 'v2') {
      return `<div class="hero2 me2">${status()}${brandHd()}<div class="ident">${identL()}${daysHtml()}</div>
        <div class="wkw">${secH(t('last7'), t('records'))}<div class="wk num glass">${WK().map(wkItem).join('')}</div></div></div>
        <div class="body me">${myTrain(v)}${myList(v)}</div>${tabs(v, 3)}`;
    }
    const dring = `<div class="dring"><span class="rg">${ring(.72, 80, 7)}</span><span class="t"><span>${t('days')}</span><b class="num">42<i>${t('uDay')}</i></b></span></div>`;
    return `${status()}<div class="body me"><div class="grp">${brandHd()}<div class="ident">${identL()}${dring}</div></div>
      <div class="blk">${secH(t('last7'), t('records'))}<div class="wk4 num">${WK().map(wkItem).join('')}</div></div>
      ${myTrain(v)}${myList(v)}</div>${tabs(v, 3)}`;
  }

  const LIB = () => [
    ['action_hug.webp', 'p', t('l0'), t('l0m'), 0],
    ['action_supine.webp', 'p', t('l1'), t('l1m'), 0],
    ['sport_press.jpg', 's', t('l2'), t('l2m'), 0],
    ['sport_row.jpg', 's', t('l3'), t('l3m'), 1],
    ['action_row.webp', 'p', t('l4'), t('l4m'), 0],
    ['sport_squat.jpg', 's', t('l5'), t('l5m'), 0],
    ['plan_full.webp', 'p', t('l6'), t('l6m'), 0],
    ['plan_flex.webp', 'p', t('l7'), t('l7m'), 0],
    ['sport_core.jpg', 'c', t('l8'), t('l8m'), 0],
    ['sport_pilates.webp', 'p', t('l9'), t('l9m'), 0]
  ];
  const libCard = ([img, k, name, meta, isAi]) => `<div class="rc lib"><img src="${A}${img}" alt="">${tag('act', isAi)}<div class="tx"><b>${name}</b><span>${TC()[k]} · ${meta}</span></div></div>`;
  function library(v) {
    const tb = `<div class="tb">${seg([t('moves'), t('aiMoves'), t('plans')], 0, 'tbseg')}<span class="ib">${ic('search', 12)}</span><span class="ib dotted">${ic('filter', 12)}<i></i></span></div>`;
    return `${status()}<div class="body libp">${brandHd()}
      <div class="lh"><h1>${t('libTitle')}</h1><span class="cnt num">${t('libCnt')}</span><span class="sum">${t('libSum')}</span></div>
      <div class="g2c lib">${LIB().map(libCard).join('')}</div></div>
      <div class="fade"></div>${v === 'v3' ? `<div class="tbf">${tb}</div>` : `<div class="tbw">${tb}</div>`}${tabs(v, 2)}`;
  }

  const SCREENS = { strength: v => train(v, 'strength'), pilates: v => train(v, 'pilates'), cardio: v => train(v, 'cardio'), home, me, library };

  function mount(el) {
    LANG = el.dataset.lang === 'en' ? 'en' : 'zh';
    const { theme, dir, screen = 'strength' } = el.dataset;
    const kcls = KIND[screen] ? KIND[screen].k : '';
    const wasView = el.classList.contains('view');
    el.className = `phone t-${theme} ${dir} ${kcls} s-${screen}${el.hasAttribute('data-long') ? ' long' : ''}${wasView ? ' view' : ''}${LANG === 'en' ? ' en' : ''}`;
    el.innerHTML = SCREENS[screen](dir);
  }
  window.MotionV3 = { mountAll(root = document) { root.querySelectorAll('[data-dir]').forEach(mount); }, mount, SCREENS: Object.keys(SCREENS) };
})();
