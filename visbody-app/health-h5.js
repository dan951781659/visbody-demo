/* 健康页：还原 WellnessHub H5 首页（http://127.0.0.1:4173 的 #/home）内容。
   文案、示例报告与统计逻辑来自 h5-data.js；视觉按 APP 配色规范 v5 适配。 */
(function(){
const D=window.H5_DATA,W=D.homeWords,I=D.interactionWords,MN=D.moduleNames;
const P={chev:'m9 5 7 7-7 7',down:'m6 9 6 6 6-6',flame:'M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z',person:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21v-2a8 8 0 0 1 16 0v2',target:'M12 12h.01M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',gauge:'m12 14 4-4M3.5 17a9 9 0 1 1 17 0',bar:'M5 20V10M12 20V4M19 20v-7',spark:'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z',clip:'M9 4h6v3H9zM7 5H5v16h14V5h-2M9 12h6M9 16h6',file:'M5 3h10l4 4v14H5zM9 11h6M9 15h6',check:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M8 12l3 3 5-6',info:'M12 16v-4M12 8h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',pause:'M8 5v14M16 5v14',play:'m9 5 11 7-11 7z',dumbbell:'M5 6v12M2 8v8M19 6v12M22 8v8M5 12h14'};
const ic=(n,c='')=>`<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n]}"/></svg>`;
const tile=(n,accent='')=>`<span class="h5-tile ${accent}">${ic(n)}</span>`;
const modIcon=id=>id==='composition'?'flame':id==='spine'?'target':id==='girth'?'bar':id==='balance'?'gauge':'person';
const SEV={good:0,attention:1,risk:2};
const ts=d=>Date.parse(d.replace(' ','T'));
const ORDER=['composition','posture','balance','neck','hip','spine','girth'];
const SPEC={score:{label:'综合评分',unit:'score'},fat:{label:'体脂率',unit:'%'},muscle:{label:'肌肉量',unit:'kg'},weight:{label:'体重',unit:'kg'}};
const ckey=r=>r.device+':'+(r.comparisonKey||'legacy-m60-v1');
function mval(r,id){if(id==='score')return Number.isFinite(r.score)?r.score:undefined;const m=r.modules.find(x=>x.id==='composition')?.metrics.find(x=>x.label===SPEC[id].label);if(!m)return;const g=m.value.trim().match(/^(-?\d+(?:\.\d+)?)\s*(kg|%)$/);if(!g||g[2]!==SPEC[id].unit)return;return Number(g[1])}
function overview(records){
 const reports=records.filter(r=>Number.isFinite(ts(r.date))).slice().sort((a,b)=>ts(b.date)-ts(a.date));
 const latest=reports[0],fam=latest&&ckey(latest);
 const stream=fam?reports.filter(r=>ckey(r)===fam):[];const win=stream.slice(0,7);
 const supported=latest?(/M60/i.test(latest.device)?ORDER:[...new Set(latest.modules.map(m=>m.id))]):[];
 const coverage=supported.map(id=>{const m=win.filter(r=>r.modules.some(x=>x.id===id));return{moduleId:id,count:m.length,latestAt:m[0]?.date}});
 const findings=supported.flatMap(id=>{
  const meas=win.flatMap(r=>{const m=r.modules.find(x=>x.id===id);return m?[{report:r,module:m}]:[]});const cur=meas[0];if(!cur)return[];
  const prev=meas[1]?.module,rs=meas.slice(0,3).map(x=>x.module.status),oc=meas.findIndex(x=>x.module.status==='good'),run=oc===-1?meas.length:oc,bi=win.findIndex(r=>r.id===cur.report.id);
  let state;
  if(bi>=2&&cur.module.status!=='good')state='stale';
  else if(prev&&SEV[cur.module.status]<SEV[prev.status])state='improved';
  else if(cur.module.status==='good'&&rs.length>=3&&rs.every(s=>s==='good'))state='good';
  else if(cur.module.status!=='good'&&prev?.status==='good')state='new';
  else if(cur.module.status!=='good'&&rs.length>=3&&rs.every(s=>s!=='good'))state='persistent';
  else state='latest';
  return[{module:cur.module,report:cur.report,previous:prev,state,count:cur.module.status==='good'?rs.filter(s=>s==='good').length:Math.max(1,run)}]});
 const pri={new:5,persistent:4,latest:3,stale:2,improved:1,good:0};
 const concernF=findings.filter(f=>['new','persistent','latest','stale'].includes(f.state)).sort((a,b)=>SEV[b.module.status]-SEV[a.module.status]||pri[b.state]-pri[a.state]||ts(b.report.date)-ts(a.report.date));
 const trends=Object.fromEntries(Object.keys(SPEC).map(id=>[id,stream.map(r=>({reportId:r.id,at:r.date,value:mval(r,id)})).filter(p=>p.value!==undefined).slice(0,7).reverse()]));
 return{reports,latest,win,supported,coverage,findings,concerns:concernF.slice(0,3),trends,improved:findings.filter(f=>f.state==='improved').length,persistent:findings.filter(f=>f.state==='persistent').length,newc:findings.filter(f=>f.state==='new').length};
}
const FT={persistent:f=>`${MN[f.module.id]}连续 ${f.count} 次需要关注`,new:f=>`${MN[f.module.id]}出现新的关注项`,latest:f=>`${MN[f.module.id]}当前结果需要关注`,improved:f=>`${MN[f.module.id]}较上次已有改善`,good:f=>`${MN[f.module.id]}连续保持良好`,stale:f=>`${MN[f.module.id]}上次存在关注项，近期未复测`};
function finding(m){
 if(m.id==='composition'){const v=m.metrics.find(x=>x.label==='内脏脂肪等级')?.value;if(v)return'内脏脂肪等级：'+v}
 if(m.id==='neck'){const c=m.metrics.filter(x=>x.tone==='risk'||x.tone==='warn').length;return c+' 项活动度测量被报告标记为需关注。'}
 if(m.id==='spine'){const a=m.metrics.find(x=>x.label==='重点区域')?.value;if(a==='胸椎')return'报告标记的重点区域：胸椎。'}
 return m.status==='risk'?W.findingRisk:W.findingAttention;
}
const stateLabel={persistent:W.persistentFinding,new:W.newFinding,latest:W.latestFinding,improved:W.improvedFinding,good:W.goodFinding,stale:W.staleFinding};
const cnt=n=>`最近 ${n} 次测量`,cnt2=n=>`最近 ${n} 次可比测量`;
const val=(v,id)=>id==='score'?v+' 分':SPEC[id].unit==='kg'?v.toFixed(1)+' kg':v.toFixed(1)+'%';
const S={cov:false,str:false,metric:'fat',sel:{},mode:'pair',view:0,paused:matchMedia('(prefers-reduced-motion: reduce)').matches,before:null,after:null,opacity:.45,stage:'all'};
let getReports=()=>[];
const ov=()=>overview(getReports());

/* ---------- 各区块 HTML ---------- */
function secHero(o){
 if(!o.latest)return`<section class="h5-empty" data-sec="0">${tile('file')}<h1>${W.noReport}</h1><p>${W.startHint}</p><button class="h5-link" data-act="reports">${W.records}${ic('chev')}</button></section>`;
 const covered=o.coverage.filter(c=>c.count>0).length,old=o.win.at(-1);
 return`<section class="key-card h5-hero shape-notch-bl has-model" data-sec="0" aria-labelledby="h5-t0"><span class="key-arcs" aria-hidden="true"></span>
 <div class="hero-split"><div class="hero-copy" data-h5="stage:all" role="button" tabindex="0">
 <div class="h5-heading"><h2 id="h5-t0">${W.statusOverview}</h2></div>
 <div class="h5-period on-key"><strong>${o.win.length===1?W.firstAssessment:`${old.date.slice(5,10)} — ${o.latest.date.slice(5,10)}`}<em class="h5-win">${o.win.length===1?'':`(近 ${o.win.length} 次)`}</em></strong><time>${old.date.slice(0,10)} — ${o.latest.date.slice(0,10)}</time><span>${o.latest.device}</span></div>
 <button class="h5-coverage key-cov inset" data-h5="cov" aria-expanded="${S.cov}"><span class="h5-covnum"><strong>${covered}</strong><small>/${o.supported.length}</small></span><span><b>${W.coverage}</b><small>${S.cov?W.coverageClose:W.coverageOpen}</small></span>${ic('down',S.cov?'flip':'')}</button>
 ${S.cov?`<div class="h5-covlist on-key">${o.coverage.map(c=>`<div><span>${tile(modIcon(c.moduleId))}<b>${MN[c.moduleId]}</b></span><span class="${c.count?'':'empty'}">${c.count?`${c.count}/${o.win.length} ${W.measuredTimes}`:W.neverMeasured}<small>${c.latestAt?.slice(0,10)||'—'}</small></span></div>`).join('')}</div>`:''}
 </div><div class="hero-model lit" aria-hidden="true"><div class="hero-model-canvas"></div></div></div>
 ${o.win.length>1?`<div class="h5-stats key-stats">${[['improved',o.improved,'已有改善'],['persistent',o.persistent,'持续关注'],['new',o.newc,'新增关注']].map(([k,n,t])=>`<button data-h5="stage:${k}" class="s-${k}"><strong>${n}</strong><small>${I.modules}<br>${t}</small>${ic('chev')}</button>`).join('')}</div>`:`<p class="h5-note on-key">${W.needNextMeasurement}</p>`}
 </section>`}
function secServices(){
 return`<section class="h5-sec" data-sec="1" aria-labelledby="h5-t1"><div class="h5-heading"><h2 id="h5-t1">${tile('clip','violet')}${W.services}</h2></div><p class="h5-sub">${W.servicesSub}</p>
 <div class="h5-deck">
  <article class="h5-svc ai plain"><div class="h5-svc-title"><span class="h5-aimark" aria-hidden="true"></span><h3>${W.ai}</h3><span class="h5-badge">${W.notGenerated}</span></div><p class="h5-svc-sum">${W.aiHint}</p><button class="h5-link" data-h5="svc:ai">免费查看解读预览${ic('chev')}</button></article>
  <article class="h5-svc train"><div class="h5-svc-title">${tile('dumbbell','indigo')}<h3>${W.training}</h3><span class="h5-badge">${W.notGenerated}</span></div><p class="h5-svc-sum">${W.trainingHint}</p><button class="h5-link" data-h5="svc:training">查看我的训练方向${ic('chev')}</button></article>
 </div></section>`}
function secFindings(o){
 if(!o.latest)return'';
 const pos=o.findings.filter(f=>f.state==='improved'||f.state==='good').slice(0,2);
 return`<section class="h5-sec" data-sec="1" aria-labelledby="h5-t2"><div class="h5-heading"><h2 id="h5-t2">${tile('target','orange')}${W.findingsTitle}</h2></div><p class="h5-sub">${W.findingsSub}</p>
 <div class="h5-concerns">${o.concerns.length===0?`<p class="h5-state">${W.noConcerns}</p>`:o.concerns.map(f=>{const m=f.module;return`<article class="h5-concern bar"><div class="h5-heading"><h3>${tile(modIcon(m.id))}${FT[f.state](f)}</h3><button class="h5-link" data-h5="mod:${f.report.id}:${m.id}">${W.details}${ic('chev')}</button></div><div class="h5-meta"><span class="h5-status ${m.status}">${stateLabel[f.state]}</span><time>${f.report.date.slice(0,10)}</time></div><p>${finding(m)}</p></article>`}).join('')}</div>
 <div class="h5-strengths"><button class="h5-strengths-toggle" data-h5="str" aria-expanded="${S.str}"><span>${ic('check')}${W.strengths}</span>${ic('down',S.str?'flip':'')}</button><p>${pos.length?W.strengthsSub:W.noStrengths}</p>
 ${S.str?`<div class="h5-strength-res">${pos.map(f=>`<button data-h5="mod:${f.report.id}:${f.module.id}"><span>${FT[f.state](f)}<small>${f.report.date.slice(0,10)}</small></span><strong>${f.state==='improved'?W.improvedFinding:W.goodFinding}${ic('chev')}</strong></button>`).join('')}</div>`:''}</div></section>`}
function secShape(o){
 if(!o.latest)return'';
 return`<section class="h5-sec" data-sec="2" aria-labelledby="h5-t3"><div class="h5-heading"><h2 id="h5-t3">${tile('person','violet')}${W.shapeChanges}</h2></div><p class="h5-sub">${W.shapeChangesSub}</p>${shapeHTML(o,false)}</section>`}
function extraHTML(rec,bi,ai){
 return`${S.mode==='overlay'?`<div class="shape-opacity"><span>${I.opacity}</span>${[.25,.45,.65].map(v=>`<button data-h5="op:${v}" aria-pressed="${S.opacity===v}">${Math.round(v*100)}%</button>`).join('')}</div>`:''}
 ${['before','after'].map(w=>`<div class="shape-picker" data-w="${w}"><h3>${I[w]}</h3><div class="h5-dates">${rec.map((r,i)=>`<button data-h5="pick:${w}:${r.id}" ${(w==='before'?i>=ai:i<=bi)?'disabled':''} aria-pressed="${(w==='before'?S.before:S.after)===r.id}">${r.date.slice(5,10)}</button>`).join('')}</div></div>`).join('')}`}
function shapeHTML(o,full){
 const rec=o.win.slice().reverse();
 if(rec.length<2)return`<div class="h5-card h5-shape-empty"><p>${I.shapeUnavailable}</p></div>`;
 if(!S.before||!rec.some(r=>r.id===S.before))S.before=rec[0].id;if(!S.after||!rec.some(r=>r.id===S.after))S.after=rec.at(-1).id;
 const bi=rec.findIndex(r=>r.id===S.before),ai=rec.findIndex(r=>r.id===S.after);
 return`<div class="h5-card shape-root ${full?'full':'compact'}" data-full="${full?1:0}">
 <div class="shape-toolbar"><span class="shape-tag">${I.simulated}</span><div class="seg" role="group">${['pair','overlay'].map(k=>`<button data-h5="mode:${k}" aria-pressed="${S.mode===k}">${I[k]}</button>`).join('')}</div></div>
 <div class="shape-stage"><div class="shape-canvas" role="img" aria-label="${I.shape}"></div><div class="shape-floor"></div><div class="shape-load" role="status"><span class="shape-loader"></span></div>
  <button class="shape-pause" data-h5="pause" aria-label="${S.paused?W.resumeRotation:W.pauseRotation}" aria-pressed="${S.paused}">${ic(S.paused?'play':'pause')}</button>
  <div class="shape-dates"><span class="b"><i></i>${I.before}<b data-d="before">${rec[bi].date.slice(0,10)}</b></span><span class="a"><i></i>${I.after}<b data-d="after">${rec[ai].date.slice(0,10)}</b></span></div></div>
 <div class="shape-views">${['front','side','rear'].map((k,i)=>`<button data-h5="view:${i}" aria-pressed="${S.view===i*Math.PI/2}">${I[k]}</button>`).join('')}</div>
 <p class="shape-hint">${I.drag}</p>
 ${full?`<div class="shape-extra">${extraHTML(rec,bi,ai)}</div>`:`<button class="h5-link shape-more" data-h5="shapefull">${I.compare}${ic('chev')}</button>`}
 </div>`}
function trendHTML(o){
 const ids=['score','fat','muscle','weight'];
 if(!o.trends[S.metric].length)S.metric=ids.find(i=>o.trends[i].length)||'score';
 const pts=o.trends[S.metric].slice(-7);
 if(!pts.length)return`<div class="h5-card h5-trend-empty">${ic('bar')}<p>${W.missing}</p></div>`;
 let sel=pts.findIndex(p=>p.reportId===S.sel[S.metric]);if(sel<0)sel=pts.length-1;
 const cur=pts[sel],prevI=o.trends[S.metric].findIndex(p=>p.reportId===cur.reportId)-1,prev=o.trends[S.metric][prevI];
 const delta=prev?cur.value-prev.value:undefined,stage=cur.value-pts[0].value;
 const mx=Math.max(...pts.map(p=>p.value)),mn=Math.min(...pts.map(p=>p.value));
 const co=pts.map((p,i)=>({x:26+(pts.length===1?124:i*248/(pts.length-1)),y:mx===mn?80:120-(p.value-mn)/(mx-mn)*80}));
 const line=co.map(c=>c.x+','+c.y).join(' '),sc=co[sel];
 const chg=v=>`${v>0?'+':v<0?'−':''}${S.metric==='fat'?Math.abs(v).toFixed(1)+' 个百分点':val(Math.abs(v),S.metric)}`;
 return`<div class="h5-card h5-trend" data-trend>
 <div class="h5-trend-head">${tile(S.metric==='score'?'gauge':S.metric==='fat'?'flame':S.metric==='muscle'?'dumbbell':'bar')}<div><h3>${W[S.metric]}</h3><time>${cur.at}</time></div><strong>${val(cur.value,S.metric)}</strong></div>
 ${pts.length>1?`<svg class="h5-trend-svg" viewBox="0 0 300 154" aria-hidden="true"><defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="currentColor" stop-opacity=".22"/><stop offset="100%" stop-color="currentColor" stop-opacity="0"/></linearGradient><linearGradient id="tgl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="currentColor" stop-opacity=".5"/><stop offset="100%" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs>
  ${[40,80,120].map(y=>`<line x1="26" x2="274" y1="${y}" y2="${y}" stroke="currentColor" stroke-opacity=".13" stroke-dasharray="3 5"/>`).join('')}
  <polygon points="26,140 ${line} 274,140" fill="url(#tg)"/><polyline points="${line}" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
  <rect x="${sc.x-14}" y="18" width="28" height="124" fill="url(#tgl)" rx="14"/><line x1="${sc.x}" x2="${sc.x}" y1="20" y2="140" stroke="currentColor" stroke-dasharray="3 4" stroke-opacity=".72" stroke-width="2"/>
  ${co.map((c,i)=>`<circle cx="${c.x}" cy="${c.y}" r="${sel===i?6:4}" fill="currentColor" stroke="var(--surface)" stroke-width="2"/>`).join('')}</svg>`:`<p class="h5-single">${W.single}</p>`}
 <div class="h5-dates" role="group" aria-label="${W.measured}">${pts.map((p,i)=>`<button data-h5="pt:${i}" aria-pressed="${sel===i}" aria-label="${p.at} · ${val(p.value,S.metric)}">${p.at.slice(5,10)}</button>`).join('')}</div>
 <div class="h5-trend-foot"><div class="h5-delta"><p>${W.sinceLastShort}<b>${delta===undefined?'—':chg(delta)}</b></p><p>${I.stageDelta}<b>${sel===0?'—':chg(stage)}</b></p></div><button class="h5-link" data-h5="rep:${cur.reportId}">${W.viewPoint}${ic('chev')}</button></div>
 <p class="h5-foot">${cnt2(pts.length)}</p></div>`}
function secTrends(o){
 const ids=['score','fat','muscle','weight'];
 return`<section class="h5-sec" data-sec="3" aria-labelledby="h5-t3"><div class="h5-heading"><h2 id="h5-t3">${tile('bar','cyan')}${I.trend}</h2><button class="h5-link" data-act="reports">${I.moreMetrics}${ic('chev')}</button></div><p class="h5-sub">${W.trendsSub} <span class="h5-badge brand">${cnt(o.win.length)}</span></p>
 <div class="h5-tabs" role="group" aria-label="${W.trends}">${ids.map(id=>`<button data-h5="metric:${id}" aria-pressed="${S.metric===id}">${W[id]}</button>`).join('')}</div><div data-trendbox>${trendHTML(o)}</div></section>`}
function secLatest(o){
 if(!o.latest)return'';
 return`<section class="h5-sec" data-sec="4" aria-labelledby="h5-t4"><div class="h5-heading"><h2 id="h5-t4">${tile('file','brand')}${W.recentReport}</h2></div>
 <div class="h5-card h5-latest"><div><time>${o.latest.date}</time><strong>${o.latest.device}</strong><span>${W.reportModules} · ${o.latest.modules.length}</span></div><button class="h5-link" data-h5="rep:${o.latest.id}">${W.viewRecentReport}${ic('chev')}</button></div>
 <button class="h5-secondary" data-act="reports">${W.allRecords}${ic('chev')}</button></section>`}
const SECS=['hero','findings','shape','trends','latest'];
function body(){
 const o=ov();
 return`<div class="h5-home">${secHero(o)}${secFindings(o)}${secShape(o)}${o.latest?secTrends(o):''}${secLatest(o)}<p class="h5-demo">${ic('info')}${W.demo}</p></div>`}

/* ---------- 弹层内容 ---------- */
const statusText=s=>s==='good'?W.good:s==='attention'?W.attention:W.risk;
const metricRows=m=>m.metrics.map(x=>`<div class="h5-mrow ${x.tone||''}"><span>${x.label}</span><b>${x.value}</b></div>`).join('');
function reportHTML(r,note=''){
 const aiReady=r.id===ov().latest?.id;
 return`${note}<p class="h5-rmeta">${r.date} · ${r.device}</p><div class="h5-rscore"><span>${W.reportScore}</span><strong>${r.score}<small>分</small></strong></div><p class="h5-rsum">${r.summary}</p>
 <div class="h5-rmods">${r.modules.map(m=>`<button data-h5="mod:${r.id}:${m.id}"><span class="h5-status ${m.status}">${statusText(m.status)}</span><b>${MN[m.id]}</b><small>${m.score} 分</small>${ic('chev')}</button>`).join('')}</div>
 <div class="h5-ai-block"><div class="h5-svc-title"><span class="h5-aimark" aria-hidden="true"></span><h3>${W.ai}</h3><span class="h5-badge">${aiReady?W.notGenerated:'尚未生成'}</span></div><p class="h5-svc-sum">${W.aiHint}</p><button class="h5-link" data-h5="svc:ai">免费查看解读预览${ic('chev')}</button></div>
 <p class="h5-rnote">${W.measuredOnly}</p>`}
function moduleHTML(r,m){
 return`<p class="h5-rmeta">${r.date} · ${r.device}</p><div class="h5-meta"><span class="h5-status ${m.status}">${statusText(m.status)}</span><span class="h5-mscore">${m.score} 分</span></div><p class="h5-rsum">${m.finding}</p><div class="h5-mrows">${metricRows(m)}</div><div class="h5-advice"><b>建议</b><p>${m.advice}</p></div><button class="choice" data-h5="rep:${r.id}">${I.original}<small>${r.date}</small></button>`}
function stageHTML(o,key){
 const active=['persistent','new','improved'].includes(key)?key:'all';S.stage=active;
 const ordered=o.findings.slice().sort((a,b)=>SEV[b.module.status]-SEV[a.module.status]),items=active==='all'?ordered:ordered.filter(f=>f.state===active),old=o.win.at(-1);
 return`<div class="h5-period slim"><strong>${cnt(o.win.length)}</strong><time>${old?.date.slice(0,10)} — ${o.latest?.date.slice(0,10)}</time></div>
 <div class="h5-tabs stage" role="group">${['all','persistent','new','improved'].map(k=>`<button data-h5="stage:${k}" aria-pressed="${active===k}">${I[k]} <b>${k==='all'?ordered.length:ordered.filter(f=>f.state===k).length}</b></button>`).join('')}</div>
 ${items.length===0?`<p class="h5-state">${I.noFinding}</p>`:items.map(f=>`<article class="h5-card h5-stage-card"><div class="h5-heading"><h2>${tile(modIcon(f.module.id))}${MN[f.module.id]}</h2><span class="h5-status ${f.module.status}">${I[f.state]}</span></div><h3>${FT[f.state](f)}</h3><p>${finding(f.module)}</p>${f.state==='improved'?`<p class="h5-improved">${I.improvedNote}</p>`:''}<h4>${I.evidence}</h4>
 <div class="h5-evidence">${o.win.slice().reverse().map(r=>{const m=r.modules.find(x=>x.id===f.module.id);const t=m?(m.status==='good'?I.normal:I[m.status]):I.notMeasured;return`<button ${m?'':'disabled'} class="${m?m.status:'unmeasured'}" data-h5="mod:${r.id}:${f.module.id}" aria-label="${r.date} · ${t}"><span class="node"></span><time>${r.date.slice(5,10)}</time><small>${t}</small></button>`}).join('')}</div>
 <button class="h5-link" data-h5="mod:${f.report.id}:${f.module.id}">${I.original}${ic('chev')}</button></article>`).join('')}`}
const AI={summary:'本次测量建议优先理解体脂与颈部活动度结果，并结合完整报告判断后续安排。',risks:['体脂相关指标在本次报告中被标记为需关注','部分颈部活动度测量需要进一步查看'],strengths:['平衡评估中的感官系统结果表现良好'],actions:['查看原始测量依据','结合自身情况咨询专业人员']};
const aiHTML=()=>`<p class="h5-rsum">${AI.summary}</p><h4 class="h5-h4">${W.concerns}</h4><ul class="h5-list risk">${AI.risks.map(x=>`<li>${x}</li>`).join('')}</ul><h4 class="h5-h4">${W.strengths}</h4><ul class="h5-list good">${AI.strengths.map(x=>`<li>${x}</li>`).join('')}</ul><h4 class="h5-h4">行动建议</h4><ul class="h5-list">${AI.actions.map(x=>`<li>${x}</li>`).join('')}</ul><p class="h5-rnote">${W.infoAI}</p>`;
const TR=[['呼吸与体态筑基','第 1 周'],['核心唤醒与下肢激活','第 2–3 周'],['整合收束与复测准备','第 4 周']];
const trainHTML=()=>`<p class="h5-rsum">已根据测量报告与示例健康档案生成四周训练大纲。</p><div class="h5-phases">${TR.map(([n,w],i)=>`<div><span>${i+1}</span><b>${n}</b><small>${w}</small></div>`).join('')}</div><p class="h5-rnote">${W.infoTraining}</p>`;

/* ---------- 3D 形态 ---------- */
let baseObj=null;
function ensureObj(){const{OBJLoader}=window.VB3D;if(!baseObj){baseObj=new OBJLoader().parse(window.VB_SKIN_OBJ);const T=window.VB3D.THREE;const size=new T.Box3().setFromObject(baseObj).getSize(new T.Vector3());baseObj.scale.setScalar(2.5/Math.max(size.x,size.y,size.z));baseObj.position.sub(new T.Box3().setFromObject(baseObj).getCenter(new T.Vector3()))}return baseObj}
function mountShape(root){
 const el=root.querySelector('.shape-canvas');if(!el||!window.VB3D)return;
 const{THREE,OrbitControls}=window.VB3D,o0=ov(),records=o0.win.slice().reverse();if(records.length<2)return;
 let renderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true})}catch{root.querySelector('.shape-load').innerHTML='<span class="h5-state">'+W.modelError+'</span>';return}
 let disposed=false,frame=0,visible=false,interacting=false,resumeAt=0,lastCmd=S._cmd||0,target;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,50);camera.position.set(0,0,4.8);
 const orbit=camera.clone();orbit.position.set(Math.sin(S.view)*4.8,0,Math.cos(S.view)*4.8);
 const controls=new OrbitControls(orbit,el);controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=3.3;controls.maxDistance=6;controls.minPolarAngle=Math.PI*.3;controls.maxPolarAngle=Math.PI*.7;controls.autoRotateSpeed=2;
 controls.addEventListener('start',()=>{interacting=true;target=undefined});controls.addEventListener('end',()=>{interacting=false;resumeAt=performance.now()+3000;S.viewAngle=controls.getAzimuthalAngle()});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));el.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xffffff,0x294973,2.6));const light=new THREE.DirectionalLight(0xc2efff,2.8);light.position.set(2,4,5);scene.add(light);
 const geos=new Set,mats=new Set,tints=[0x8a90f5,0x2f8cff];
 const models=[0,1].map(i=>{const g=new THREE.Group(),b=ensureObj().clone(true);b.traverse(n=>{if(n.isMesh){geos.add(n.geometry);const m=new THREE.MeshStandardMaterial({color:tints[i],roughness:.4,metalness:.12,transparent:true,opacity:1,depthWrite:true});n.material=m;mats.add(m)}});g.add(b);scene.add(g);return g});
 root.querySelector('.shape-load')?.remove();
 const obs=new IntersectionObserver(e=>{visible=e[0]?.isIntersecting??false},{threshold:.05});obs.observe(el);
 const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(w&&h){camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}};const ro=new ResizeObserver(resize);ro.observe(el);resize();
 const clock=new THREE.Clock();
 const dispose=()=>{disposed=true;cancelAnimationFrame(frame);obs.disconnect();ro.disconnect();controls.dispose();mats.forEach(m=>m.dispose());renderer.dispose();el.replaceChildren()};
 const run=()=>{
  frame=requestAnimationFrame(run);
  if(!root.isConnected){dispose();return}
  const dt=Math.min(clock.getDelta(),.05);if(!visible||document.hidden)return;
  if((S._cmd||0)!==lastCmd){lastCmd=S._cmd||0;target=S.view}
  if(target!==undefined){const ca=controls.getAzimuthalAngle(),df=Math.atan2(Math.sin(target-ca),Math.cos(target-ca)),nx=ca+df*Math.min(1,dt*13),d=orbit.position.length();orbit.position.set(Math.sin(nx)*d,THREE.MathUtils.damp(orbit.position.y,0,13,dt),Math.cos(nx)*d);if(Math.abs(df)<.005)target=undefined}
  controls.autoRotate=!S.paused&&!interacting&&target===undefined&&performance.now()>resumeAt;controls.update(dt);
  const az=controls.getAzimuthalAngle(),pl=controls.getPolarAngle()-Math.PI/2;camera.position.z=orbit.position.length();
  models.forEach((m,i)=>{
   const tx=S.mode==='overlay'?0:i===0?-.64:.64;m.position.x=THREE.MathUtils.damp(m.position.x,tx,10,dt);m.rotation.set(pl,az,0);
   const ri=Math.max(0,records.findIndex(r=>r.id===(i===0?S.before:S.after))),sc=1.07-ri/Math.max(1,records.length-1)*.07;
   m.scale.x=THREE.MathUtils.damp(m.scale.x,sc,8,dt);m.scale.z=THREE.MathUtils.damp(m.scale.z,sc,8,dt);
   m.traverse(n=>{if(n.isMesh){const t=S.mode==='overlay'?(i===0?S.opacity:.78):1;n.material.opacity=THREE.MathUtils.damp(n.material.opacity,t,10,dt);n.material.depthWrite=S.mode!=='overlay'}})});
  renderer.render(scene,camera)};run();
}

const SVG_FALLBACK=`<svg viewBox="0 0 120 220" class="hero-fallback" aria-hidden="true"><ellipse cx="60" cy="28" rx="18" ry="22" fill="currentColor" opacity=".85"/><path d="M35 58c8-6 42-6 50 0l10 78c2 14-6 22-18 22h-34c-12 0-20-8-18-22z" fill="currentColor" opacity=".75"/><path d="M28 70c-12 18-16 42-10 58M92 70c12 18 16 42 10 58M48 158l-8 52M72 158l8 52" stroke="currentColor" stroke-width="10" stroke-linecap="round" fill="none" opacity=".7"/></svg>`;
let heroDispose=null;
function mountHeroModel(el){
 if(heroDispose){try{heroDispose()}catch{}heroDispose=null}
 const host=el.querySelector('.hero-model-canvas');if(!host)return;
 host.replaceChildren();
 if(!window.VB3D){host.innerHTML=SVG_FALLBACK;return}
 const{THREE}=window.VB3D;
 let renderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true})}catch{host.innerHTML=SVG_FALLBACK;return}
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(28,1,.1,50);camera.position.set(0,.05,4.2);
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));host.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xffffff,0x294973,2.4));const light=new THREE.DirectionalLight(0xc2efff,2.2);light.position.set(2,4,5);scene.add(light);
 const g=new THREE.Group(),b=ensureObj().clone(true);b.traverse(n=>{if(n.isMesh){n.material=new THREE.MeshStandardMaterial({color:0x7fb2ff,roughness:.45,metalness:.08,transparent:true,opacity:.92})}});g.add(b);scene.add(g);
 let disposed=false,frame=0,visible=true;
 const obs=new IntersectionObserver(e=>{visible=e[0]?.isIntersecting??false},{threshold:.05});obs.observe(host);
 const resize=()=>{const w=host.clientWidth||140,h=host.clientHeight||200;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};
 const ro=new ResizeObserver(resize);ro.observe(host);resize();
 const run=()=>{frame=requestAnimationFrame(run);if(!host.isConnected){dispose();return}if(!visible||document.hidden)return;g.rotation.y+=.008;renderer.render(scene,camera)};
 const dispose=()=>{if(disposed)return;disposed=true;cancelAnimationFrame(frame);obs.disconnect();ro.disconnect();renderer.dispose();host.replaceChildren()};
 heroDispose=dispose;run();
}

function mountAll(el){el.querySelectorAll('.shape-root').forEach(mountShape)}

/* ---------- 交互 ---------- */
function setPressed(root,sel,fn){root.querySelectorAll(sel).forEach(b=>b.setAttribute('aria-pressed',String(fn(b))))}
function refreshShapeUI(el){
 const o=ov(),rec=o.win.slice().reverse();
 el.querySelectorAll('.shape-root').forEach(root=>{
  setPressed(root,'.seg button',b=>b.dataset.h5==='mode:'+S.mode);setPressed(root,'.shape-views button',b=>b.dataset.h5==='view:'+Math.round(S.view/(Math.PI/2)));
  const p=root.querySelector('.shape-pause');p.setAttribute('aria-pressed',String(S.paused));p.innerHTML=ic(S.paused?'play':'pause');p.setAttribute('aria-label',S.paused?W.resumeRotation:W.pauseRotation);
  const bi=rec.findIndex(r=>r.id===S.before),ai=rec.findIndex(r=>r.id===S.after);root.querySelector('[data-d=before]').textContent=rec[bi].date.slice(0,10);root.querySelector('[data-d=after]').textContent=rec[ai].date.slice(0,10);
  if(root.dataset.full==='1')root.querySelector('.shape-extra').innerHTML=extraHTML(rec,bi,ai);
 });
}
function updateTrend(el){const box=el.querySelector('[data-trendbox]');if(!box)return;box.innerHTML=trendHTML(ov());bindTrend(el)}
function bindTrend(el){
 const svg=el.querySelector('.h5-trend-svg');if(!svg)return;
 const snap=x=>{const pts=ov().trends[S.metric].slice(-7),r=svg.getBoundingClientRect(),i=Math.round(Math.max(0,Math.min(1,(x-r.left)/r.width))*(pts.length-1));S.sel[S.metric]=pts[i].reportId;updateTrend(el)};
 let drag=false;svg.addEventListener('pointerdown',e=>{drag=true;svg.setPointerCapture?.(e.pointerId);snap(e.clientX)});
 svg.addEventListener('pointermove',e=>{if(drag)snap(e.clientX)});svg.addEventListener('pointerup',()=>drag=false);svg.addEventListener('pointercancel',()=>drag=false);
}
function replaceSec(el,name){const i=SECS.indexOf(name),node=el.querySelector(`[data-sec="${i}"]`);if(!node)return;const o=ov(),tmp=document.createElement('div');tmp.innerHTML={hero:secHero,findings:secFindings,trends:secTrends,latest:secLatest}[name](o);node.replaceWith(tmp.firstElementChild);if(name==='hero')mountHeroModel(el)}
function bindRail(el){
 const c=el.querySelector('.content'),secs=[...el.querySelectorAll('[data-sec]')];if(!c||secs.length<2)return;
 const rail=document.createElement('div');rail.className='h5-rail';rail.setAttribute('aria-label',W.statusOverview);
 const labels=[W.statusOverview,W.findingsTitle,W.shapeChanges,I.trend,W.recentReport];
 rail.innerHTML=secs.map(s=>`<button data-h5="rail:${s.dataset.sec}" aria-label="${labels[s.dataset.sec]}"><span></span></button>`).join('');el.appendChild(rail);
 const upd=()=>{const top=c.getBoundingClientRect().top+90;let cur=0;secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<=top)cur=i});rail.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',i===cur))};
 c.addEventListener('scroll',upd,{passive:true});upd();
}
let ctx={sheet:()=>{}};
function handle(el,v){
 const [k,a,b]=v.split(':');
 switch(k){
  case'cov':S.cov=!S.cov;replaceSec(el,'hero');break;
  case'str':S.str=!S.str;replaceSec(el,'findings');break;
  case'metric':S.metric=a;replaceSec(el,'trends');bindTrend(el);break;
  case'pt':{const pts=ov().trends[S.metric].slice(-7);S.sel[S.metric]=pts[+a].reportId;updateTrend(el);break}
  case'mode':S.mode=a;refreshShapeUI(el);break;
  case'view':S.view=+a*Math.PI/2;S._cmd=(S._cmd||0)+1;S.paused=true;refreshShapeUI(el);break;
  case'pause':S.paused=!S.paused;refreshShapeUI(el);break;
  case'op':S.opacity=+a;refreshShapeUI(el);break;
  case'pick':{const rec=ov().win.slice().reverse(),i=rec.findIndex(r=>r.id===b),bi=rec.findIndex(r=>r.id===S.before),ai=rec.findIndex(r=>r.id===S.after);if(a==='before'&&i<ai)S.before=b;if(a==='after'&&i>bi)S.after=b;refreshShapeUI(el);break}
  case'shapefull':{ctx.sheet(el,I.shape,shapeHTML(ov(),true));mountAll(el.querySelector('.modal'));break}
  case'stage':{ctx.sheet(el,I.stage,stageHTML(ov(),a));break}
  case'mod':{const r=getReports().find(x=>x.id===a),m=r?.modules.find(x=>x.id===b);if(r&&m)ctx.sheet(el,MN[m.id],moduleHTML(r,m));break}
  case'rep':{const r=getReports().find(x=>x.id===a);if(r)ctx.sheet(el,r.device+' '+W.reportTitle,reportHTML(r));break}
  case'svc':ctx.sheet(el,a==='ai'?W.ai+' · 预览':W.training,a==='ai'?aiHTML():trainHTML());break;
  case'rail':{const n=el.querySelector(`[data-sec="${a}"]`),c=el.querySelector('.content');if(n&&c)c.scrollTo({top:c.scrollTop+n.getBoundingClientRect().top-c.getBoundingClientRect().top-16,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});break}
 }
}
window.H5Home={
 init(opts){getReports=opts.reports;ctx.sheet=opts.sheet},
 html:body,
 mount(el){mountAll(el);mountHeroModel(el);bindTrend(el);bindRail(el)},
 handle,overview:()=>ov(),reportHTML,
 reportList:()=>{const rs=ov().reports,latest=ov().latest?.id;return `<div class="report-cards">`+rs.map(r=>{const mods=r.modules.slice(0,4).map(m=>`<span class="mod-chip">${MN[m.id]}</span>`).join('');const ai=r.id===latest?'AI 解读 · 未生成':'AI 解读 · 未生成';return`<button class="report-card-item" data-h5="rep:${r.id}"><div class="rc-top"><time>${r.date}</time><strong>${r.device}</strong></div><div class="mod-chips">${mods}</div><div class="rc-foot"><span class="ai-chip">${ai}</span><span>查看报告${ic('chev')}</span></div></button>`}).join('')+`</div>`},
 moduleNames:MN,
 metric:(r,label)=>r.modules.find(m=>m.id==='composition')?.metrics.find(m=>m.label===label)?.value
};
})();
