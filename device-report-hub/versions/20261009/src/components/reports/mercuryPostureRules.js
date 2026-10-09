// Shared by the file:// demo and React. Product display index, not a medical score.
(function (root) {
  const rules = [
    { label: '颈椎前伸', normal: 0.2, possible: 0.72, min: -100, max: 100, absolute: false, range: '≤0.2 cm' },
    { label: '颈椎侧偏', normal: 0.1, possible: 1.54, min: -90, max: 90, absolute: true, range: '−0.1°～0.1°' },
    { label: '右肩内收度', normal: 0.2, possible: 1.2, min: -100, max: 100, absolute: false, range: '≤0.2 cm' },
    { label: '左肩内收度', normal: 0.2, possible: 1.2, min: -100, max: 100, absolute: false, range: '≤0.2 cm' },
    { label: '肩部平衡', normal: 0.5, possible: 3, min: -180, max: 180, absolute: true, range: '−0.5°～0.5°' },
    { label: '骨盆位置', normal: 4, possible: 5, min: -100, max: 100, absolute: false, range: '≤4 cm' },
  ];
  const values = [6.2, 4.9, 0.3, -1.6, -5.1, 5.4]; // Final measurements: no repeated pelvis compensation.
  function classify(index, value) {
    const r = rules[index];
    if (!r || typeof value !== 'number' || !Number.isFinite(value) || value < r.min || value > r.max) return null;
    const x = r.absolute ? Math.abs(value) : value;
    return x <= r.normal ? 0 : x <= r.possible ? 1 : 2;
  }
  function combine(a, b) {
    if (![0, 1, 2].includes(a) || ![0, 1, 2].includes(b)) return { score: null, level: null, label: '数据不完整' };
    const score = (a + b) * 25;
    return { score, level: score === 0 ? 0 : score === 100 ? 3 : 1, label: score === 0 ? '正常' : score === 100 ? '重度异常' : '轻度异常' };
  }
  const groups = ['头颈姿态', '肩背姿态', '躯干平衡'].map((title, i) => ({ title, ...combine(classify(i * 2, values[i * 2]), classify(i * 2 + 1, values[i * 2 + 1])) }));
  const overallScore = groups.every(g => g.score !== null) ? Math.max(...groups.map(g => g.score)) : null;
  const overall = { score: overallScore, label: overallScore === null ? '数据不完整' : overallScore === 0 ? '正常' : overallScore === 100 ? '重度异常' : '轻度异常' };
  const formula = '颈椎、胸椎和腰椎分别评分，整体分数取其中最高的一项，帮助您关注最需要留意的部位。\n\n0分为正常，25／50／75分为轻度异常，100分为重度异常。具体表现可查看下方分项说明。';
  const disclaimer = '分数为姿态状态组合的展示指数，不代表疾病严重程度或风险百分比，不作为医学诊断。';
  function overallCopy(score) {
    if (score == null) return '部分测量数据不完整，暂无法进行整体评估。';
    return '根据头颈、肩背和躯干的测量结果，帮助您了解当前姿态。分数越高，表示姿态偏离标准范围的情况越明显，并非分数越高越好。';
  }
  const summary = overallCopy(overallScore);
  function statusCopy(index, value) {
    const state = classify(index, value);
    if (state == null) return '数据不完整';
    if (state === 0) return '正常';
    const posture = ['前伸', value > 0 ? '右倾' : '左倾', '圆肩', '圆肩', value > 0 ? '右高左低' : '左高右低', '前移'][index];
    return (state === 1 ? '轻度' : '重度') + posture;
  }
  function conclusion(index, level) {
    const areas = ['头颈前后位置及左右平衡', '左右肩部内收表现', '肩部平衡及骨盆位置'];
    if (level == null) return '测量数据不完整，暂无法进行本项评估。';
    const inputs = ['颈椎前伸与颈椎侧偏', '左右肩内收度', '肩部平衡与骨盆前移'];
    const label = level === 0 ? '正常' : level === 3 ? '重度异常' : '轻度异常';
    const deviation = level === 0 ? '处于参考范围' : level === 3 ? '与参考范围偏离较多' : '与参考范围存在一定偏离';
    return `结合${inputs[index]}，本次评估处于${label}区间，提示${areas[index]}${deviation}。`;
  }
  const dailyCopies = [
    ['日常继续保持屏幕与视线平齐，避免长时间低头或固定向一侧转头。', '日常注意减少长时间低头和单侧转头，保持屏幕与视线平齐；如持续出现颈肩不适，建议咨询专业人员。', '日常注意减少长时间低头和单侧转头，保持屏幕与视线平齐；如持续出现颈肩疼痛或活动不适，建议咨询专业人员。'],
    ['日常继续保持双肩放松和左右用力均衡，避免长时间含胸、伏案或单侧负重。', '日常注意双肩放松和左右用力均衡，减少长时间含胸、伏案或单侧负重；建议在相同测量条件下复测观察。', '日常注意双肩放松和左右用力均衡，减少长时间含胸、伏案或单侧负重；如持续出现肩背不适，建议咨询专业人员。'],
    ['日常继续保持坐姿、站姿重心均衡，避免长时间久坐，并适当活动腰背。', '日常注意减少久坐，保持坐姿、站姿重心均衡，并适当活动腰背；如有持续不适，建议咨询专业人员。', '日常注意减少久坐，保持坐姿、站姿重心均衡，并适当活动腰背；如持续出现腰背疼痛或活动不适，建议咨询专业人员。'],
  ];
  function daily(index, level) { return level == null ? '' : dailyCopies[index][level === 0 ? 0 : level === 3 ? 2 : 1]; }
  root.MercuryPostureRules = { rules, values, classify, combine, groups, overall, formula, disclaimer, summary, conclusion, daily, overallCopy, statusCopy };
})(globalThis);
