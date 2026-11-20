const names={home:'首页',health:'健康',train:'训练',mine:'我的'};
const icons={devices:'M6 3h12v18H6z M9 6h6v6H9z M9 18h6',health:'M3 12h4l3-7 4 14 3-7h4',train:'M5 6v12M2 8v8M19 6v12M22 8v8M5 12h14',mine:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21v-2a8 8 0 0 1 16 0v2',scan:'M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5M7 12h10',plus:'M12 4v16M4 12h16',next:'m9 5 7 7-7 7',down:'m6 9 6 6 6-6',building:'M4 21V4h12v17M16 10h4v11M8 8h4M8 12h4M8 16h4M2 21h20',clock:'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',file:'M5 3h10l4 4v14H5z M9 11h6M9 15h6',calendar:'M4 5h16v16H4zM8 3v4M16 3v4M4 10h16M8 14h2M14 14h2M8 18h2',book:'M3 4c3-1 6 0 9 2 3-2 6-3 9-2v16c-3-1-6 0-9 2-3-2-6-3-9-2zM12 6v16',heart:'M12 21 3 12C-2 5 7-1 12 6c5-7 14-1 9 6z',shield:'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6z M8 12l3 3 5-6',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2',help:'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 3M12 17h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',star:'m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',wifi:'M3 8a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0M9 16a4 4 0 0 1 6 0M12 20h.01',signal:'M4 20v-3M9 20v-7M14 20V9M19 20V4',play:'m9 5 11 7-11 7z',pilates:'M12 5h.01M8 10l4-2 4 2M12 8v7M4 17l8-2 8 2M8 11l-4 3M16 11l4 3',edit:'m16 3 5 5-12 12-6 1 1-6zM13 6l5 5',arrow:'M5 12h14m-6-6 6 6-6 6',back:'m15 5-7 7 7 7',search:'M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12M21 21l-4.3-4.3',flame:'M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z',scale:'M12 3v18M5 7h14M7 7l-2 4h4zm10 0l-2 4h4z',gauge:'m12 14 4-4M3.5 17a9 9 0 1 1 17 0',dumbbell:'M5 6v12M2 8v8M19 6v12M22 8v8M5 12h14',target:'M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12M12 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4',check:'m5 12 5 5 9-10',sliders:'M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4',spark:'M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8'};
icons.home='M3 11 12 3l9 8M5 10v11h5v-7h4v7h5V10';
const ic=n=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[n]||icons.file}"/></svg>`;
const PHOTO=n=>`assets/photos/${n}.webp`;
const PROFILE=H5_DATA.profile;
const state={theme:'light',scenario:'both',scope:'org',source:'all',target:null,connected:false,joined:false,loggedIn:true,pending:false,day:2,homeTab:'sport',trainTab:'plans',mealDays:{},sub:null,scheme:'none',meals:[],mineTab:'sport',lib:{tab:'moves',cat:'all',part:'all',equip:'all',q:'',more:false}};
const fixtures=H5_DATA.seed.map(r=>({...structuredClone(r),scope:'org'}));
const scanReport=(()=>{const r=structuredClone(H5_DATA.seed[0]);r.id='m60-20261116';r.date='2026-11-16 10:28';r.score=84;r.summary='本次测量体脂与体重继续下降，颈部活动度和脊柱仍需关注。';const set={'体重':'72.4 kg','去脂体重':'42.3 kg','体脂肪':'30.1 kg','肌肉量':'40.0 kg','体脂率':'41.6%','BMI':'24.5 kg/m²'};r.modules[0].metrics.forEach(m=>{if(set[m.label])m.value=set[m.label]});r.scope='org';return r})();
let reports=[];let storageFailed=false;
const KEY='visbody-report-demo-v3-';
const BASE_WEEK_PLANS={0:[{id:'p-full',title:'全身力量入门',meta:'6 个动作 · 30 分钟',cat:'strength',img:'strength',motion:true,moves:['深蹲','坐姿划船','肩推','核心卷腹','臀桥','侧平举']}],2:[{id:'p-core',title:'核心稳定',meta:'5 个动作 · 25 分钟',cat:'strength',img:'core',motion:true,moves:['核心卷腹','臀桥','侧平举','普拉提百次','高位下拉']}],3:[{id:'p-stretch',title:'居家拉伸放松',meta:'4 个动作 · 20 分钟',cat:'pilates',img:'pilates',motion:false,moves:['髋屈肌拉伸','胸椎旋转','腘绳肌拉伸','肩胛放松']}],4:[{id:'p-leg',title:'下肢力量',meta:'6 个动作 · 35 分钟',cat:'strength',img:'lunge',motion:true,moves:['深蹲','弓步','臀桥','硬拉','侧平举','核心卷腹']}]};
const SCHEME_WEEK_PLANS={0:[{id:'s-full',title:'全身力量入门',meta:'6 个动作 · 30 分钟',cat:'strength',img:'strength',motion:true,src:'scheme',moves:['深蹲','坐姿划船','肩推','核心卷腹','臀桥','侧平举']}],2:[{id:'s-core',title:'核心稳定',meta:'5 个动作 · 25 分钟',cat:'strength',img:'core',motion:true,src:'scheme',moves:['核心卷腹','臀桥','侧平举','普拉提百次','高位下拉']}],3:[{id:'s-stretch',title:'居家拉伸放松',meta:'4 个动作 · 20 分钟',cat:'pilates',img:'pilates',motion:false,src:'scheme',moves:['髋屈肌拉伸','胸椎旋转','腘绳肌拉伸','肩胛放松']}],4:[{id:'s-leg',title:'下肢力量',meta:'6 个动作 · 35 分钟',cat:'strength',img:'lunge',motion:true,src:'scheme',moves:['深蹲','弓步','臀桥','硬拉','侧平举','核心卷腹']}]};
let WEEK_PLANS=structuredClone(BASE_WEEK_PLANS);
const MEAL_PRESETS=[
 {name:'燕麦酸奶碗',img:'pilates',kcal:320,protein:18,carb:42,fat:8},
 {name:'鸡胸沙拉',img:'strength',kcal:420,protein:38,carb:22,fat:14},
 {name:'香蕉加餐',img:'cardio',kcal:110,protein:1,carb:27,fat:0},
 {name:'三文鱼配时蔬',img:'deadlift',kcal:480,protein:34,carb:18,fat:28},
 {name:'豆腐蔬菜汤',img:'core',kcal:180,protein:12,carb:16,fat:6}
];
const RECENT_TRAIN=[{title:'全身力量入门 · 力量训练',time:'11-16 18:20',mins:30,kcal:240},{title:'自由训练 · 力量训练',time:'11-14 19:05',mins:28,kcal:210},{title:'核心稳定 · 力量训练',time:'11-12 07:40',mins:25,kcal:180}];
function resetWeekPlans(){WEEK_PLANS=structuredClone(state.scheme==='generated'?SCHEME_WEEK_PLANS:BASE_WEEK_PLANS)}
function dietDone(){return state.meals.length}
function mealTotals(){return state.meals.reduce((a,m)=>({kcal:a.kcal+m.kcal,protein:a.protein+m.protein,carb:a.carb+m.carb,fat:a.fat+m.fat}),{kcal:0,protein:0,carb:0,fat:0})}
function saveMealsDay(){state.mealDays[state.day]=structuredClone(state.meals)}
function loadMealsDay(d){state.meals=structuredClone(state.mealDays[d]||[])}


const PART_LABEL={chest:'胸',back:'背',legs:'腿',core:'核心',shoulder:'肩',glutes:'臀',full:'全身'};
const EQUIPS=['杠铃','哑铃','划船机','高位下拉器','阻力器','自重'];
const MOVES=[
 {id:'m1',name:'坐姿划船',cat:'strength',part:'back',equip:'划船机',muscles:'背阔肌、斜方肌、肱二头肌',intro:'坐姿拉动手柄向腹部靠拢，挺胸收紧肩胛，随后缓慢控制回放。',img:'row',ai:false},
 {id:'m2',name:'高位下拉',cat:'strength',part:'back',equip:'高位下拉器',muscles:'背阔肌、大圆肌、肱二头肌',intro:'双手宽握横杆，沉肩下拉至锁骨前方，稳定躯干，避免借力后仰。',img:'pulldown',ai:false},
 {id:'m3',name:'深蹲',cat:'strength',part:'legs',equip:'杠铃',muscles:'股四头肌、臀大肌、腘绳肌',intro:'双脚与肩同宽，屈髋屈膝下蹲至大腿接近平行，膝盖与脚尖同向。',img:'squat',ai:false},
 {id:'m4',name:'弓步',cat:'strength',part:'legs',equip:'哑铃',muscles:'股四头肌、臀大肌',intro:'向前跨步下蹲，前膝不超过脚尖，躯干保持直立后蹬腿回位。',img:'lunge',ai:false},
 {id:'m5',name:'肩推',cat:'strength',part:'shoulder',equip:'哑铃',muscles:'三角肌、肱三头肌',intro:'双手持铃于肩侧向上推起，核心收紧，避免腰部过度反弓。',img:'shoulder',ai:false},
 {id:'m6',name:'核心卷腹',cat:'strength',part:'core',equip:'自重',muscles:'腹直肌、腹斜肌',intro:'仰卧屈膝，卷起上背部而非拉扯颈部，呼气收腹、吸气缓慢还原。',img:'core',ai:false},
 {id:'m7',name:'卧推',cat:'strength',part:'chest',equip:'杠铃',muscles:'胸大肌、肱三头肌、三角肌前束',intro:'仰卧稳定肩胛，杠铃下放至胸部中线再推起，手腕保持中立。',img:'press',ai:false},
 {id:'m8',name:'硬拉',cat:'strength',part:'back',equip:'杠铃',muscles:'竖脊肌、臀大肌、腘绳肌',intro:'以髋部为轴向后送髋，背部保持中立，杠铃贴腿拉起至站直。',img:'deadlift',ai:false},
 {id:'m9',name:'臀桥',cat:'strength',part:'glutes',equip:'自重',muscles:'臀大肌、腘绳肌',intro:'仰卧屈膝，脚跟发力抬髋至肩髋膝成一线，顶端收紧臀部。',img:'core',ai:false},
 {id:'m10',name:'侧平举',cat:'strength',part:'shoulder',equip:'哑铃',muscles:'三角肌中束',intro:'双臂微屈向两侧抬至与肩同高，控制下放，避免耸肩。',img:'shoulder',ai:false},
 {id:'m11',name:'AI 划船跟练',cat:'strength',part:'back',equip:'划船机',muscles:'背阔肌、斜方肌、肱二头肌',intro:'AI 实时识别动作节奏与幅度，提示肩胛收紧与回放速度。',img:'row',ai:true},
 {id:'m12',name:'AI 深蹲跟练',cat:'strength',part:'legs',equip:'杠铃',muscles:'股四头肌、臀大肌、腘绳肌',intro:'AI 实时识别下蹲深度与膝盖轨迹，及时提示姿势偏差。',img:'squat',ai:true},
 {id:'m13',name:'AI 肩推跟练',cat:'strength',part:'shoulder',equip:'哑铃',muscles:'三角肌、肱三头肌',intro:'AI 实时识别推举轨迹与对称性，提示核心稳定与发力节奏。',img:'shoulder',ai:true},
 {id:'m14',name:'普拉提侧踢',cat:'pilates',part:'glutes',equip:'自重',muscles:'臀中肌、腹斜肌',intro:'侧卧稳定骨盆，向前后控制性踢腿，保持躯干不晃动。',img:'pilates',ai:false},
 {id:'m15',name:'普拉提百次',cat:'pilates',part:'core',equip:'自重',muscles:'腹直肌、腹横肌',intro:'仰卧抬起上背与双腿，双臂上下小幅拍打，配合五吸五呼的节奏。',img:'pilates',ai:false},
 {id:'m16',name:'阻力有氧间歇',cat:'cardio',part:'full',equip:'阻力器',muscles:'全身大肌群',intro:'以高低强度交替完成阻力有氧循环，保持动作连贯与呼吸节奏。',img:'cardio',ai:false}
];
const PLANS=[
 {id:'pl1',name:'四周基础力量',weeks:'4 周',freq:'每周 3 次',goal:'力量提升',cat:'strength',img:'squat',hot:true},
 {id:'pl2',name:'核心与体态',weeks:'3 周',freq:'每周 4 次',goal:'核心稳定',cat:'pilates',img:'pilates',hot:false},
 {id:'pl3',name:'阻力有氧入门',weeks:'2 周',freq:'每周 3 次',goal:'心肺提升',cat:'cardio',img:'cardio',hot:true},
 {id:'pl4',name:'全身力量进阶',weeks:'6 周',freq:'每周 4 次',goal:'力量提升',cat:'strength',img:'deadlift',hot:false},
 {id:'pl5',name:'下肢力量专项',weeks:'4 周',freq:'每周 3 次',goal:'下肢力量',cat:'strength',img:'lunge',hot:true},
 {id:'pl6',name:'普拉提塑形',weeks:'4 周',freq:'每周 3 次',goal:'体态改善',cat:'pilates',img:'pilates',hot:false}
];
const SCENES=[{id:'strength',name:'力量训练',count:'24 个动作',img:'press'},{id:'pilates',name:'普拉提',count:'12 个动作',img:'pilates'},{id:'cardio',name:'阻力有氧',count:'10 个动作',img:'cardio'}];
const CAT_LABEL={strength:'力量训练',pilates:'普拉提',cardio:'阻力有氧'};
const MODULE_NAME={composition:'体成分',posture:'体态',balance:'平衡',neck:'颈椎活动度',hip:'臀型',spine:'脊柱',girth:'体围'};
const MODULE_ICON={composition:'scale',posture:'mine',balance:'target',neck:'spark',hip:'gauge',spine:'health',girth:'scale'};
const LABEL_ICON={'体重':'scale','体脂率':'flame','肌肉量':'dumbbell','BMI':'gauge'};
const DEFAULT_PICK=['composition|体脂率','composition|体重','composition|肌肉量','composition|BMI'];
const PICK_KEY='visbody-body-pick-v1',PICK_MAX=4;
function loadPick(){try{const v=JSON.parse(localStorage.getItem(PICK_KEY));if(Array.isArray(v)&&v.length&&v.length<=PICK_MAX&&v.every(x=>typeof x==='string'))return v}catch{}return[...DEFAULT_PICK]}
let bodyPick=loadPick(),bodyDraft=[];
function savePick(){try{if(bodyPick.join()===DEFAULT_PICK.join())localStorage.removeItem(PICK_KEY);else localStorage.setItem(PICK_KEY,JSON.stringify(bodyPick))}catch{}}
const findMetric=(r,key)=>{const[mod,label]=key.split('|');return r.modules.find(m=>m.id===mod)?.metrics.find(m=>m.label===label)};
const parseVal=v=>{const m=String(v).trim().match(/^(-?\d+(?:\.\d+)?)\s*(.*)$/);return m?{num:parseFloat(m[1]),raw:m[1],unit:m[2]}:null};
const metricIcon=key=>LABEL_ICON[key.split('|')[1]]||MODULE_ICON[key.split('|')[0]]||'file';

function persist(){try{localStorage.setItem(KEY+state.scenario,JSON.stringify(reports));storageFailed=false}catch{storageFailed=true}}
function loadScenario(value){state.scenario=value;state.scope='org';state.source='all';state.target=null;state.joined=false;state.pending=false;state.loggedIn=true;state.day=2;state.sub=null;state.scheme='none';state.meals=[];state.mealDays={};state.homeTab='sport';state.trainTab='plans';state.mineTab='sport';state.lib={tab:'moves',cat:'all',part:'all',equip:'all',q:'',more:false};resetWeekPlans();let saved;try{saved=JSON.parse(localStorage.getItem(KEY+value))}catch{}reports=Array.isArray(saved)?saved.filter(r=>[...fixtures,scanReport].some(f=>f.id===r.id&&f.scope===r.scope)):['both','body'].includes(value)?structuredClone(fixtures):[];syncMotionToggle()}
const hasMotion=()=>['both','motion'].includes(state.scenario);
const availableReports=()=>reports.filter(r=>r.scope===state.scope);
const filteredReports=()=>availableReports();
const hasBody=()=>availableReports().length>0;
const hasPlan=()=>hasMotion()||state.joined;
const hasScheme=()=>['both','body'].includes(state.scenario)&&state.scope==='org';
const scopeName=()=>state.scope==='org'?'维塑健康中心 · 滨江店':'维塑健康中心 · 西湖店';
const md=d=>`${d.slice(5,7)}月${d.slice(8,10)}日`;
const num=v=>v?parseFloat(v):'';
const section=(title,link='',act='',icon='book',linkIcon='next')=>`<div class="section"><h3><span class="sec-ico">${ic(icon)}</span>${title}</h3>${link?`<button class="textbtn" data-act="${act}">${link}${ic(linkIcon)}</button>`:''}</div>`;
const head=(title,subtitle,extra='')=>`<div class="head"><div>${subtitle?`<div class="eyebrow">${subtitle}</div>`:''}<h2>${title}</h2></div>${extra}</div>`;
const tbIco=(act,icon,aria,cls='')=>`<button class="tb-ico ${cls}" data-act="${act}" aria-label="${aria}">${ic(icon)}</button>`;
function topbar(p){
 if(p==='train'&&state.sub==='library')return`<div class="topbar"><div class="tb-left">${tbIco('closeSub','back','返回')}<b class="tb-title">动作库</b></div><div class="tb-right">${tbIco('scan','scan','扫一扫')}</div></div>`;
 const title=p==='home'?`早上好，${PROFILE.name}。`:names[p];
 let right=tbIco('scan','scan','扫一扫');
 if(p==='home'||p==='train')right+=`<button class="tb-ico ${state.connected?'on':''}" data-act="deviceChip" aria-label="${state.connected?'已连接设备':'连接设备'}">${ic('devices')}</button>`;
 if(p==='mine')right+=tbIco('settings','settings','设置');
 return`<div class="topbar"><div class="tb-left"><b class="tb-title">${title}</b></div><div class="tb-right">${right}</div></div>`;
}
function pageHero(p){
 if(p==='train'&&state.sub==='library')return'';
 if(p==='home')return`<div class="page-hero"><h1>早上好，${PROFILE.name}。</h1><p>从了解身体，到更好的每一次训练。</p></div>`;
 return`<div class="page-hero"><h1>${names[p]}</h1></div>`;
}
const row=(icon,title,sub,act,tone='blue')=>`<button class="listrow" data-act="${act}"><span class="row-ico t-${tone}">${ic(icon)}</span><span>${title}</span>${sub?`<small>${sub}</small>`:''}${ic('next')}</button>`;
const icf=n=>`<svg class="i filled" viewBox="0 0 24 24" aria-hidden="true"><path d="${FILLED[n]}"/></svg>`;
const FILLED={dumbbell:'M2.5 9h2v6h-2zM5.5 6.5h2.5v11H5.5zM8 11h8v2H8zM16 6.5h2.5v11H16zM19.5 9h2v6h-2z'};
const empty=(title,text,button,act)=>`<div class="empty"><div class="tile-icon">${ic('file')}</div><h3>${title}</h3><p>${text}</p><button data-act="${act}">${button}</button></div>`;
const photo=(img,cls,attrs,inner,cat)=>`<button class="photo-card shape-notch-br ${cls}" ${attrs} style="--cat:var(--category-${cat})"><img src="${PHOTO(img)}" alt="" loading="lazy"><div class="pc-body">${inner}</div></button>`;
const weekDots=()=>`<div class="wk-days">${['一','二','三','四','五','六','日'].map((v,i)=>`<span class="${[0,2,4].includes(i)?'on':''}"><i></i>${v}</span>`).join('')}</div>`;
const weekBars=()=>`<div class="wk-bars" aria-hidden="true">${[22,38,14,42,28,10,8].map((h,i)=>`<i class="${[0,2,4].includes(i)?'on':''}" style="height:${h}px"></i>`).join('')}</div>`;
const arcs=()=>`<span class="key-arcs" aria-hidden="true"></span>`;
const pill=(label,act)=>`<span class="key-pill">${label}${ic('next')}</span>`;
function syncMotionToggle(){const on=!!state.connected;document.querySelector('#motionOn')?.setAttribute('aria-pressed',String(on));document.querySelector('#motionOff')?.setAttribute('aria-pressed',String(!on))}
function deviceChip(){return`<button class="device-chip ${state.connected?'on':''}" data-act="deviceChip" aria-label="Motion 设备状态">${ic('devices')}<span>${state.connected?'已连接 · MS-1024':'未连接'}</span></button>`}
function stageTrack(){return`<div class="stage-track" aria-hidden="true">${[1,2,3,4].map(n=>`<i class="${n<2?'done':n===2?'current':''}"></i>`).join('')}</div>`}
function navTabs(p){const tabs=Object.entries(names).filter(([k])=>k!=='health'||hasBody());return tabs.map(([k,n])=>`<button class="${k===p?'active':''}" data-page="${k}" ${k===p?'aria-current="page"':''}>${ic(k)}${n}</button>`).join('')}

function sparkline(values){
 if(!values.length)return'';
 const w=168,h=40,pad=3;
 const min=Math.min(...values),max=Math.max(...values),span=max-min||1;
 const pts=values.map((v,i)=>{const x=pad+i*((w-pad*2)/Math.max(values.length-1,1));const y=h-pad-((v-min)/span)*(h-pad*2);return`${x},${y}`}).join(' ');
 const dots=values.map((v,i)=>{const x=pad+i*((w-pad*2)/Math.max(values.length-1,1));const y=h-pad-((v-min)/span)*(h-pad*2);return`<circle cx="${x}" cy="${y}" r="2.2" fill="currentColor"/>`}).join('');
 return`<svg class="spark wide" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" points="${pts}"/>${dots}</svg>`}
function bodyCards(r){
 const hist=availableReports().slice().sort((a,b)=>a.date.localeCompare(b.date));
 const items=bodyPick.map(key=>{const m=findMetric(r,key);return m?{key,label:key.split('|')[1],m}:null}).filter(Boolean);
 const info=it=>{
  const cur=parseVal(it.m.value);
  const series=hist.map(x=>{const mm=findMetric(x,it.key);const v=mm&&parseVal(mm.value);return v?v.num:null}).filter(v=>v!==null).slice(-7);
  const prevReport=hist.length>1?hist[hist.length-2]:null;const prevM=prevReport&&findMetric(prevReport,it.key);const prev=prevM&&parseVal(prevM.value);
  const delta=cur&&prev?cur.num-prev.num:null;
  const unit=cur&&cur.unit&&cur.unit.length<=3?cur.unit:'';
  const deltaTxt=delta===null||Math.abs(delta)<0.05?'':`${delta>0?'+':delta<0?'−':''}${Math.abs(delta).toFixed(1)}${unit}`;
  const big=cur?`${cur.raw}<em>${cur.unit}</em>`:`<span class="txt">${it.m.value}</span>`;
  return{series,deltaTxt,big,icon:metricIcon(it.key),label:it.label};
 };
 if(!items.length)return'';
 const h=info(items[0]);
 const hero=`<button class="bx-hero is-key shape-trend" data-report="${r.id}"><span class="bg-mark">${ic(h.icon)}</span><div class="bh-left"><div class="bh-head"><span class="bg-ico">${ic(h.icon)}</span><small>${h.label}</small></div><div class="bh-main"><strong>${h.big}</strong></div><span class="bh-foot">${md(r.date)} · M60</span></div><div class="bh-trend" aria-hidden="true">${h.deltaTxt?`<em class="bh-delta">${h.deltaTxt}</em>`:''}${h.series.length>1?sparkline(h.series):''}<small>近 7 次</small></div></button>`;
 const rest=items.slice(1).map(it=>{const i=info(it);return`<button class="bx-mini" data-report="${r.id}"><span class="bg-mark">${ic(i.icon)}</span><span class="bg-ico">${ic(i.icon)}</span><small>${i.label}</small><strong>${i.big}</strong>${i.deltaTxt?`<span class="bg-delta">${i.deltaTxt}</span>`:''}</button>`}).join('');
 return`<div class="bodyx">${hero}${rest?`<div class="bx-row n${items.length-1}">${rest}</div>`:''}</div>`}
function pickHTML(r){
 const n=bodyDraft.length;
 const sel=bodyDraft.map((k,i)=>`<button class="pick-sel" data-act="bodyToggle" data-key="${k}"><b>${i+1}</b>${k.split('|')[1]}${i===0?'<em class="pick-main">重点</em>':''}<span aria-hidden="true">×</span></button>`).join('');
 const groups=r.modules.filter(m=>m.metrics.length).map(m=>`<div class="pick-group"><h4>${MODULE_NAME[m.id]||m.id}</h4><div class="pick-grid">${m.metrics.map(x=>{const key=m.id+'|'+x.label,on=bodyDraft.includes(key),dis=!on&&n>=PICK_MAX;return`<button class="pick-item ${x.tone||''}" data-act="bodyToggle" data-key="${key}" aria-pressed="${on}" ${dis?'disabled':''}><small>${x.label}</small><b>${x.value}</b>${on?`<i class="pick-check">${ic('check')}</i>`:''}</button>`}).join('')}</div></div>`).join('');
 return`<p class="pick-hint">从最新体测报告（${md(r.date)} · M60）中选择，首页最多展示 ${PICK_MAX} 项；第 1 项作为重点大卡，其余横排展示。</p><div class="pick-bar"><span class="pick-count"><b>${n}</b> / ${PICK_MAX}</span><button class="textbtn" data-act="bodyDefault">恢复默认</button></div>${n?`<div class="pick-selected">${sel}</div>`:'<p class="pick-empty">至少选择 1 项。</p>'}${groups}<div class="pick-foot"><button class="pick-cancel" data-close>取消</button><button class="pick-save" data-act="bodySave" ${n?'':'disabled'}>保存</button></div>`}
function editBodySheet(el,fresh=true){
 const r=H5Home.overview().latest;if(!r)return;
 if(fresh){bodyDraft=[...bodyPick];return sheet(el,'编辑关键身体数据',`<div class="pick-root">${pickHTML(r)}</div>`,{noClose:true})}
 const root=el.querySelector('.pick-root');if(root)root.innerHTML=pickHTML(r)}

function dietPanel(){
 const tot=mealTotals();
 const rows=state.meals.map(m=>`<div class="meal-row"><img src="${PHOTO(m.img)}" alt=""><div><b>${m.name}</b><small>${m.kcal} kcal · 蛋白 ${m.protein}g</small></div><button class="meal-del" data-act="dietRemove" data-id="${m.id}" aria-label="删除">${ic('plus')}</button></div>`).join('')||'<p class="note meal-empty">还没有记录，先添加一餐吧</p>';
 return`<div class="daily-diet"><div class="diet-tot"><div><small>今日摄入</small><b>${tot.kcal}<em>kcal</em></b></div><div class="diet-macros"><span>蛋白 ${tot.protein}g</span><span>碳水 ${tot.carb}g</span><span>脂肪 ${tot.fat}g</span></div></div><div class="meal-list">${rows}</div><button class="whitebutton solid" data-act="dietUpload">添加一餐</button></div>`;
}
function home(){
 const r=hasBody()?H5Home.overview().latest:null;
 const body=r?section('身体数据','编辑','editBody','health','edit')+bodyCards(r):'';
 const today=section('每日安排','','','calendar')+weekCalendar()+`<div class="seg-tabs schedule-tabs"><button data-act="homeTab" data-tab="sport" aria-pressed="${state.homeTab!=='diet'}">运动</button><button data-act="homeTab" data-tab="diet" aria-pressed="${state.homeTab==='diet'}">饮食</button></div>`+(state.homeTab==='diet'?dietPanel():dayPlanBlock());
 const week=hasPlan()?`<button class="week-card flat" data-act="records"><div class="wk-head"><span>本周训练</span><span class="blue">↗ 查看记录</span></div><div class="wk-nums"><b>3<small>次</small></b><b>95<small>分钟</small></b></div>${weekBars()}${weekDots()}</button>`:'';
 const rec=section('为下一次训练准备','更多','library','spark')+`<div class="recommend-grid">${photo('squat','rec-card','data-act="libraryTab" data-tab="plans"','<span class="cat-tag"><i></i>训练计划</span><div class="pc-main"><h3>四周基础力量</h3><p>循序渐进 · Motion</p></div>','strength')}${photo('row','rec-card','data-act="libraryTab" data-tab="moves"','<span class="cat-tag"><i></i>动作</span><div class="pc-main"><h3>站姿划船</h3><p>背部激活 · 入门</p></div>','strength')}</div>`;
 return pageHero('home')+today+week+body+rec
}

function health(){return pageHero('health')+H5Home.html()}

function dayPlans(){return WEEK_PLANS[state.day]||[]}
function dayPlanBlock(){
 if(!hasPlan())return`<div class="guide-card"><div><b>还没有训练计划</b><p>去动作库挑选适合你的计划</p></div><button class="whitebutton solid" data-act="libraryTab" data-tab="plans">去添加</button></div>`;
 const list=dayPlans();
 if(!list.length)return`<div class="quiet-empty">当天暂无安排<button class="textbtn blue" data-act="libraryTab" data-tab="plans">去计划库 ›</button></div>`;
 return`<div class="day-plans">${list.map(p=>`<div class="day-plan" style="--cat:var(--category-${p.cat})"><img src="${PHOTO(p.img)}" alt=""><div><span class="cat-dot">${CAT_LABEL[p.cat]}</span>${p.src==='scheme'?'<span class="src-tag">个性化方案</span>':''}<b>${p.title}</b><small>${p.meta}</small><span class="exec-tag ${p.motion?'is-motion':'is-self'}">${p.motion?'Motion 联动':'自主训练'}</span></div><button class="whitebutton solid" data-act="taskDetail" data-plan="${p.id}" data-motion="${p.motion?'1':'0'}">查看动作${ic('play')}</button></div>`).join('')}</div>`
}
function schemeBlock(){
 if(!hasScheme())return'';
 if(state.scheme!=='generated'){
  return`<div class="shape-wrap scheme-wrap"><button class="key-card scheme-guide shape-notch-tr" data-act="genScheme">${arcs()}<div class="ai-label"><span class="ai-mark" aria-hidden="true"></span>个性化训练方案</div><h2>基于体测生成<br>运动与饮食方案。</h2><p>运动方案加入计划后可每日执行；饮食方案按餐次灵活记录。</p><div class="key-bottom"><span>生成个性化训练方案</span></div></button><span class="notch-btn" aria-hidden="true">${ic('arrow')}</span></div>`;
 }
 return`<div class="scheme-card slim"><div class="sc-head"><span class="ai-mark" aria-hidden="true"></span><b>我的方案</b><button class="textbtn" data-act="leaveScheme">退出</button></div><div class="sc-cols"><button data-act="schemeDetail"><small>运动方案</small><b>第 2 / 4 阶段</b><span>已加入我的计划</span></button><button data-act="dietPlan"><small>饮食方案</small><b>营养与饮食建议</b><span>查看目标与安排</span></button></div></div>`;
}

function sceneExplore(){return section('按场景探索','','','target')+`<div class="scene-rail">${SCENES.map(s=>`<button class="scene-card" data-act="scene" data-cat="${s.id}" style="--cat:var(--category-${s.id})"><img src="${PHOTO(s.img)}" alt=""><div><span class="cat-dot">${CAT_LABEL[s.id]}</span><b>${s.name}</b><small>${s.count}</small></div></button>`).join('')}</div>`}
function freeTraining(){return section('自由训练','','','train')+`<div class="freegrid">${[['deadlift','strength','力量训练'],['pilates','pilates','普拉提'],['cardio','cardio','阻力有氧']].map(([img,cat,t])=>`<button class="photo-card free-card ${cat}" data-act="prepare" style="--cat:var(--category-${cat})"><img src="${PHOTO(img)}" alt="" loading="lazy"><div class="pc-body"><span class="cat-tag"><i></i>${t}</span><span class="pc-go">${ic('arrow')}</span></div></button>`).join('')}</div>`}
function planBigCard(p,cls=''){return`<article class="plan-big shape-notch-br ${cls}" style="--cat:var(--category-${p.cat})"><img src="${PHOTO(p.img)}" alt=""><span class="cat-tag"><i></i>${CAT_LABEL[p.cat]}</span>${p.hot?'<span class="hot">HOT</span>':''}<div class="pb-body"><b>${p.name}</b><div class="pb-foot"><small>${p.weeks} · ${p.freq} · ${p.goal}</small><button class="join" data-act="planDetail" data-id="${p.id}">加入</button></div></div></article>`}
function recommendedPlans(){
 const list=PLANS.filter(p=>p.hot).concat(PLANS.filter(p=>!p.hot)).slice(0,4);
 return section('推荐计划','全部','libraryTab','star')+`<div class="rec-plan-rail">${list.map(p=>planBigCard(p)).join('')}</div>`}

function weekCalendar(){return `<div class="calendar">${['一','二','三','四','五','六','日'].map((v,i)=>`<button class="day ${i===state.day?'active':''} ${i===2?'is-today':''}" data-act="pickDay" data-day="${i}"><span>${v}</span><b>${16+i}</b>${i===2?'<em class="today-tag">今日</em>':''}<i class="mark" style="opacity:${WEEK_PLANS[i]?1:0}"></i></button>`).join('')}</div>`}
function trainMain(){return `<div class="seg-tabs"><button data-act="trainTab" data-tab="plans" aria-pressed="${state.trainTab!=='discover'}">我的计划</button><button data-act="trainTab" data-tab="discover" aria-pressed="${state.trainTab==='discover'}">发现</button></div>`+(state.trainTab==='discover'?`<button class="library lib-entry" data-act="library"><span class="lib-thumbs" aria-hidden="true"><img src="${PHOTO('squat')}" alt=""><img src="${PHOTO('row')}" alt=""><img src="${PHOTO('press')}" alt=""></span><span class="lib-copy"><b>动作与课程库</b><small>搜索动作 · AI 动作 · 训练计划</small></span>${ic('next')}</button>`+recommendedPlans()+freeTraining()+sceneExplore():`<p class="note">管理长期目标与安排，每日执行请前往首页。</p>`+schemeBlock()+section('运动计划','查看安排','viewSchedule','calendar')+(hasPlan()?`<button class="long-plan" data-act="viewSchedule"><img src="${PHOTO('strength')}" alt=""><div><small>进行中 · 4 周</small><h3>基础力量与身体控制</h3><p>每周 3 次 · Motion / 自主训练</p><span>查看每日安排 →</span></div></button>`:`<div class="quiet-empty">暂无运动计划<button class="textbtn" data-act="libraryTab" data-tab="plans">选择计划</button></div>`)+section('饮食计划','','','flame')+`<button class="long-plan diet-plan" data-act="dietPlan"><div><small>${state.scheme==='generated'?'个性化饮食建议':'尚未制定'}</small><h3>让饮食配合你的目标</h3><p>查看饮食原则与长期目标</p><span>查看计划 →</span></div>${ic('flame')}</button>`)}

function libActiveCount(){const l=state.lib;return(l.cat!=='all'?1:0)+(l.tab==='plans'?0:(l.part!=='all'?1:0)+(l.equip!=='all'?1:0))}
function filteredLibItems(){
 const {tab,cat,part,equip,q}=state.lib;
 const qn=(q||'').trim().toLowerCase();
 if(tab==='plans')return PLANS.filter(p=>(cat==='all'||p.cat===cat)&&(!qn||p.name.toLowerCase().includes(qn)||p.goal.toLowerCase().includes(qn)));
 return MOVES.filter(m=>(tab==='ai'?m.ai:!m.ai)&&(cat==='all'||m.cat===cat)&&(part==='all'||m.part===part)&&(equip==='all'||m.equip===equip)&&(!qn||m.name.toLowerCase().includes(qn)||m.equip.toLowerCase().includes(qn)||m.muscles.toLowerCase().includes(qn)))}
function moveRow(m){
 return`<button class="move-row" data-act="moveDetail" data-id="${m.id}" style="--cat:var(--category-${m.cat})"><span class="thumb"><img src="${PHOTO(m.img)}" alt=""></span><div class="mr-body"><b>${m.ai?`<span class="ai-inline"><span class="ai-mark" aria-hidden="true"></span>${m.name}</span>`:m.name}</b><div class="mr-meta"><span><i>部位</i>${PART_LABEL[m.part]}</span><span><i>器械</i>${m.equip}</span></div><div class="mr-meta mr-muscle"><span><i>肌群</i>${m.muscles}</span></div></div><span class="mr-go">${ic('next')}</span></button>`}
function planRails(items,showAll){
 return['strength','pilates','cardio'].map(cat=>{
  const list=items.filter(p=>p.cat===cat);
  if(!list.length)return'';
  return section(CAT_LABEL[cat],'','','train')+`<div class="plan-rail">${list.map(p=>planBigCard(p)).join('')}</div>`;
 }).join('')||'<p class="note">暂无匹配计划</p>'}
function plansLibrary(items){
 const filtering=state.lib.q.trim()||state.lib.cat!=='all';
 if(filtering)return planRails(items);
 const hero=PLANS.find(p=>p.hot)||PLANS[0];
 const mine=state.joined?PLANS.slice(0,2):[];
 const mineRow=mine.length
  ?`<div class="my-plans">${mine.map(p=>`<button class="mp-card" data-act="planDetail" data-id="${p.id}"><img src="${PHOTO(p.img)}" alt=""><b>${p.name}</b><small>${p.weeks}</small></button>`).join('')}</div>`
  :`<div class="my-plans"><div class="mp-empty"><span>还没有加入计划</span><button class="textbtn" data-act="noop">去添加 ›</button></div></div>`;
 return`<article class="plan-hero-lib" style="--cat:var(--category-${hero.cat})"><img src="${PHOTO(hero.img)}" alt=""><div class="pc-body"><div><span class="cat-tag"><i></i>推荐计划</span><h3>${hero.name}</h3><div class="pills"><span>${hero.weeks}</span><span>${hero.freq}</span></div></div><button class="whitebutton" data-act="planDetail" data-id="${hero.id}">加入</button></div></article>${section('我的计划','','','calendar')}${mineRow}${planRails(PLANS)}`}
function filterPanel(){
 const {tab,cat,part,equip}=state.lib;
 const group=(title,act,key,cur,opts)=>`<div class="fp-group"><h4>${title}</h4><div class="fp-chips">${[['all','全部'],...opts].map(([k,n])=>`<button data-act="${act}" data-v="${k}" aria-pressed="${cur===k}">${n}</button>`).join('')}</div></div>`;
 const cats=Object.entries(CAT_LABEL);
 const n=libActiveCount();
 return`<div class="filter-panel">${group('训练类型','libCat','cat',cat,cats)}${tab==='plans'?'':group('训练部位','libPart','part',part,Object.entries(PART_LABEL))+group('使用器械','libEquip','equip',equip,EQUIPS.map(x=>[x,x]))}<div class="fp-foot"><button class="textbtn" data-act="libClear" ${n?'':'disabled'}>清除筛选</button></div></div>`}
function libraryPage(){
 const {tab,q,more}=state.lib;
 const tabs=[['moves','动作'],['ai','AI'],['plans','计划']];
 const items=filteredLibItems();
 const n=libActiveCount();
 const placeholder=tab==='plans'?'搜索计划名称或目标':'搜索动作、器械或肌群';
 const search=`<div class="lib-searchrow"><label class="lib-search">${ic('search')}<input type="search" placeholder="${placeholder}" value="${q||''}" data-lib-search aria-label="搜索"></label><button class="lib-more ${more||n?'on':''}" data-act="libMore" aria-expanded="${!!more}" aria-label="更多筛选">${ic('sliders')}${n?`<i class="lib-badge">${n}</i>`:''}</button></div>${more?filterPanel():''}`;
 const list=tab==='plans'
  ?plansLibrary(items)
  :`<div class="move-list dense">${items.map(m=>moveRow(m)).join('')||'<p class="note" style="padding:14px">暂无匹配动作</p>'}</div>`;
 return`<div class="lib-tabs" role="tablist">${tabs.map(([k,n])=>`<button data-act="libTab" data-tab="${k}" aria-pressed="${tab===k}">${n}</button>`).join('')}</div>${search}${list}`}
function train(){return state.sub==='library'?libraryPage():pageHero('train')+trainMain()}

function mineSport(){
 const stats=[['clock','近 7 日时长','95','分钟'],['flame','消耗热量','860','kcal'],['train','训练次数','3','次']];
 return`<div class="ud-block sport-metrics">${stats.map(([i,l,v,u])=>`<div class="ud-stat"><span class="ud-ico">${ic(i)}</span><small>${l}</small><b>${v}<em>${u}</em></b></div>`).join('')}</div><div class="ud-block ud-recent"><div class="ud-list-h"><b>最近训练</b><button class="textbtn" data-act="records">全部记录${ic('next')}</button></div>${RECENT_TRAIN.slice(0,2).map(x=>`<button class="ud-row" data-act="records"><span class="ud-ico">${ic('dumbbell')}</span><div><b>${x.title.split(' · ')[0]}</b><small>${x.time} · ${x.mins} 分钟</small></div><span class="ud-val">${x.kcal}<em>kcal</em></span></button>`).join('')}</div>`}
function mineBody(){
 const list=filteredReports();
 if(!list.length)return '<p class="note">暂无体测数据</p>';
 const rows=list.slice(0,3).map(r=>`<button class="ud-row measure-row" data-report="${r.id}"><span class="ud-date"><b>${r.date.slice(8,10)}</b><small>${+r.date.slice(5,7)}月</small></span><div><b>${r.device}</b><small>${r.modules.slice(0,4).map(m=>MODULE_NAME[m.id]||m.id).join(' · ')}</small></div>${ic('next')}</button>`).join('');
 return`<div class="ud-block ud-recent"><div class="ud-list-h"><b>最近测量</b><button class="textbtn all-reports" data-act="reports">全部 ${list.length} 条${ic('next')}</button></div>${rows}</div>`
}
function mine(){
 const showSport=hasPlan()||hasMotion();
 const showBody=hasBody();
 if(showSport&&!showBody)state.mineTab='sport';
 if(!showSport&&showBody)state.mineTab='body';
 const tabs=(showSport&&showBody)?`<div class="seg-tabs mine-seg" role="tablist"><button data-act="mineTab" data-tab="sport" aria-pressed="${state.mineTab==='sport'}">运动数据</button><button data-act="mineTab" data-tab="body" aria-pressed="${state.mineTab==='body'}">体测数据</button></div>`:'';
 const panel=state.mineTab==='body'&&showBody?mineBody():(showSport?mineSport():`<p class="note">暂无用户数据</p>`);
 return pageHero('mine')+`<div class="shape-wrap"><button class="key-card profile-hero compact shape-avatar-left" data-act="profile">${arcs()}<div class="ph-row"><img class="avatar" src="assets/avatar.webp" alt=""><div class="ph-copy"><h3>${PROFILE.name}</h3><p>会员 · ${state.scope==='org'?'滨江店':'西湖店'}</p></div><span class="key-pill">编辑${ic('next')}</span></div></button></div><div class="quick4"><button data-act="plans">${ic('calendar')}我的计划</button><button data-act="bodyArchive">${ic('file')}身体档案</button><button data-act="favorites">${ic('star')}我的收藏</button><button data-act="records">${ic('clock')}训练记录</button></div><div class="userdata-card">${section('用户数据','','','gauge')}${tabs}<div class="ud-panel">${panel}</div></div>`+section('账号与服务','','','mine')+`<div class="listgroup">${row('mine','个人资料','','profile','blue')}${row('shield','账号与安全','','security','green')}${row('building','关联机构',scopeName().replace('维塑健康中心 · ',''),'scope','indigo')}${row('file','服务与权益','','rights','purple')}</div>`+section('偏好与支持','','','settings')+`<div class="listgroup">${row('settings','外观、语言与单位',state.theme==='light'?'浅色 · 公制':'深色 · 公制','settings','orange')}${row('shield','隐私与应用权限','','privacy','green')}${row('help','帮助与反馈','','help','blue')}${row('file','关于 Visbody','','about','indigo')}</div>`
}

function interactiveFrames(){return document.querySelectorAll('.frame[data-original]')}
function syncFrames(){
 interactiveFrames().forEach(f=>{
  const p=f.dataset.original;
  if(p==='health')f.hidden=!hasBody();
 });
}
function render(el,p){
 if(p==='health'&&!hasBody())p='home';
 el.dataset.page=p;el.dataset.theme=state.theme;el.querySelector('.h5-rail')?.remove();
 const content=({home,health,train,mine})[p]();
 el.innerHTML=`<div class="statusbar"><span>9:41</span><div class="statusicons">${ic('signal')}${ic('wifi')}<span class="battery"></span></div></div>${topbar(p)}<div class="content">${content}</div><nav class="tabs" aria-label="主导航">${navTabs(p==='train'&&state.sub==='library'?'train':p)}</nav><div class="homeindicator"></div>`;
 const sc=el.querySelector('.content');
 const syncScroll=()=>{const c=sc.scrollTop>28;el.classList.toggle('is-scrolled',c);el.classList.toggle('is-collapsed',c)};
 sc.addEventListener('scroll',syncScroll,{passive:true});syncScroll();
 if(p==='health')H5Home.mount(el);
}
function refresh(){syncFrames();interactiveFrames().forEach(f=>{const el=f.querySelector('.phone'),original=f.dataset.original;if(!el)return;render(el,original==='health'&&!hasBody()?'home':original)})}
function sheet(el,title,body,opts={}){el.querySelector('.modal')?.remove();el.insertAdjacentHTML('beforeend',`<div class="modal" role="dialog" aria-modal="true" aria-label="${title}"><div class="sheet"><div class="handle"></div><h3>${title}</h3>${body}${opts.noClose?'':'<button class="close" data-close>返回</button>'}</div></div>`);el.querySelector('.modal button')?.focus()}
H5Home.init({reports:availableReports,sheet});
const choice=(title,sub,attrs)=>`<button class="choice" ${attrs}>${title}<small>${sub}</small></button>`;
function showReport(el,id,scanned=false){const r=availableReports().find(r=>r.id===id);if(!r)return sheet(el,'无法查看报告','<p>该报告不在当前机构的授权范围内。</p>');sheet(el,r.device+' 测量报告',H5Home.reportHTML(r,scanned?`<div class="success-note">${storageFailed?'已打开报告，当前浏览器无法保存；请稍后重试保存。':'报告已留存在健康 · 最近报告'}</div>`:'')+choice('查看报告列表','返回当前机构的本人测量记录','data-act="reports"')+(storageFailed?choice('重试保存','保留当前报告内容','data-act="retrySave"'):''))}
function completeScan(el){if(!state.loggedIn){state.pending=true;return sheet(el,'登录后查看本人报告','<p>验证身份后继续打开刚才扫描的报告。</p>'+choice('登录并继续','演示本人身份校验','data-act="loginContinue"'))}state.scope='org';state.source='all';if(!reports.some(r=>r.id===scanReport.id&&r.scope===scanReport.scope))reports.unshift(structuredClone(scanReport));persist();refresh();showReport(el,scanReport.id,true)}
function scan(el){sheet(el,'扫码查看报告',`<div class="scan-window">${ic('scan')}<b>对准设备屏幕上的报告二维码</b></div><p>请在设备上完成测量后扫码。</p>${choice('模拟识别二维码','演示结果由画板上方的“扫码结果”选择','data-act="scanResult"')}`)}
function scanResult(el){const result=document.querySelector('#scanResult').value;if(result==='ready')return completeScan(el);if(result==='login'){state.loggedIn=false;return completeScan(el)}const errors={pending:['报告正在生成','测量已完成，报告仍在处理。可稍后重新查询。','重新查询','scanReady'],expired:['二维码已失效','请返回设备屏幕，获取本次测量的新二维码。','重新扫码','scan'],denied:['无法查看这份报告','当前账号没有该报告的访问权限。请核对测量账号或联系机构。','返回扫码','scan'],network:['网络连接失败','尚未获取报告，请检查网络后重试。','重试','scanReady']};const [t,d,b,a]=errors[result];sheet(el,t,`<div class="result-icon ${result==='pending'?'is-warning':'is-danger'}">${ic(result==='pending'?'clock':'help')}</div><p>${d}</p>${choice(b,'',`data-act="${a}"`)}`)}

function openLibrary(el,opts={}){state.sub='library';if(opts.tab)state.lib.tab=opts.tab;if(opts.cat)state.lib.cat=opts.cat;if(opts.part)state.lib.part=opts.part;render(el,'train')}
function controlSheet(el,title='训练控制'){sheet(el,title,`<div class="train-control"><div class="tc-status">${ic('devices')}<div><b>MotionStation · MS-1024</b><small>已连接 · 可控制设备训练</small></div></div><p>当前可在手机端控制训练节奏、暂停与结束。此预览不调用真实设备协议。</p>${choice('暂停训练','演示控制指令','data-act="noop"')}${choice('结束训练','断开本次控制会话','data-act="endTrain"')}`)}
function searchingSheet(el){sheet(el,'搜索附近设备',`<div class="searching"><span class="spin"></span><b>正在搜索附近可用 Motion…</b><p>请确保设备已开机并处于可发现状态。</p></div>${choice('模拟发现 MS-1024','滨江店训练区 · 信号强','data-act="foundDevice"')}`)}
function foundSheet(el){sheet(el,'发现可用设备',choice('MotionStation · MS-1024','滨江店训练区 · 未连接','data-act="connectTrain"')+choice('重新搜索','继续扫描附近设备','data-act="searchDevices"'))}
function startTrain(el){if(state.connected){state.target='motion';return controlSheet(el)}return searchingSheet(el)}


function selfTrainSheet(el,plan){
 const moves=(plan?.moves||['拉伸','核心激活','放松']).map((n,i)=>`<div class="self-move"><b>${i+1}. ${n}</b><small>3 组 · 按自身节奏</small></div>`).join('');
 sheet(el,plan?.title||'自主训练',`<p class="note">该计划动作不在 Motion 动作库中，可在健身房或居家完成。</p><div class="self-scene">${choice('健身房','使用场馆器械完成','data-act="noop"')}${choice('居家','徒手或简易器械','data-act="noop"')}</div><div class="self-list">${moves}</div>${choice('完成打卡','记录本次自主训练','data-act="selfDone"')}`)
}
function dietSheet(el){
 const presets=MEAL_PRESETS.map((m,i)=>`<button class="diet-preset" data-act="dietAdd" data-i="${i}"><img src="${PHOTO(m.img)}" alt=""><span><b>${m.name}</b><small>${m.kcal} kcal · P${m.protein} C${m.carb} F${m.fat}</small></span></button>`).join('');
 sheet(el,'添加一餐',`<p class="note">选择示例餐次，或自定义名称写入演示营养。</p><div class="diet-presets">${presets}</div><div class="diet-custom"><input type="text" placeholder="自定义餐名，如加餐坚果" data-meal-name><button data-act="dietCustom">添加自定义</button></div>`)
}

function act(el,a,btn){
 if(a==='homeTab'){state.homeTab=btn.dataset.tab;return render(el,'home')}
 if(a==='trainTab'){state.trainTab=btn.dataset.tab;return render(el,'train')}
 if(a==='viewSchedule'){state.sub=null;return render(el,'home')}
 if(a==='dietPlan')return sheet(el,'饮食计划',`<p>饮食建议与目标在此管理，餐次记录请前往首页的每日安排。</p>${choice('查看饮食安排','按日期查看并记录餐次','data-act="viewDiet"')}`);
 if(a==='viewDiet'){state.homeTab='diet';return render(el,'home')}
 if(a==='taskDetail'){const p=dayPlans().find(x=>x.id===btn.dataset.plan);if(!p)return;return sheet(el,p.title,`<p class="note">11月${16+state.day}日 · ${p.src==='scheme'?'个性化计划':'系统计划'} · ${p.meta}</p><div class="task-moves">${p.moves.map((m,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><b>${m}</b><small>${p.motion?'Motion 联动':'自主训练'}</small></div>`).join('')}</div>${choice('开始执行',p.motion?'连接 Motion 后进入训练':'逐动作记录训练结果',`data-act="prepare" data-plan="${p.id}" data-motion="${p.motion?'1':'0'}"`)}`)}

 if(a==='scan')return scan(el);if(a==='scanResult')return scanResult(el);if(a==='scanReady')return completeScan(el);
 if(a==='loginContinue'){state.loggedIn=true;state.pending=false;return completeScan(el)}
 if(a==='retrySave'){persist();return showReport(el,scanReport.id,true)}
 if(a==='scope')return sheet(el,'选择机构',choice('维塑健康中心 · 滨江店','本人已授权的报告与服务','data-scope="org"')+choice('维塑健康中心 · 西湖店','独立机构范围 · 暂无报告','data-scope="other"'));
 if(a==='reports')return sheet(el,'测量记录',filteredReports().length?H5Home.reportList():empty('暂无测量报告','完成测量后扫描设备端报告二维码。','扫码查看报告','scan'));
 if(a==='editBody')return editBodySheet(el,true);
 if(a==='bodyToggle'){const k=btn.dataset.key,i=bodyDraft.indexOf(k);if(i>=0)bodyDraft.splice(i,1);else if(bodyDraft.length<PICK_MAX)bodyDraft.push(k);return editBodySheet(el,false)}
 if(a==='bodyDefault'){bodyDraft=[...DEFAULT_PICK];return editBodySheet(el,false)}
 if(a==='bodySave'){if(!bodyDraft.length)return;bodyPick=[...bodyDraft];savePick();refresh();return}
 if(a==='goTrain'){state.sub=null;return render(el,'train')}
 if(a==='library')return openLibrary(el,{tab:'moves'});
 if(a==='libraryTab')return openLibrary(el,{tab:btn?.dataset.tab||'plans'});
 if(a==='scene'){Object.assign(state.lib,{tab:'moves',cat:btn?.dataset.cat||'all',part:'all',equip:'all',q:'',more:false});return openLibrary(el)}
 if(a==='closeSub'){state.sub=null;return render(el,'train')}
 if(a==='libTab'){state.lib.tab=btn.dataset.tab;state.lib.more=false;return render(el,'train')}
 if(a==='libMore'){state.lib.more=!state.lib.more;return render(el,'train')}
 if(a==='libCat'){state.lib.cat=btn.dataset.v;return render(el,'train')}
 if(a==='libPart'){state.lib.part=btn.dataset.v;return render(el,'train')}
 if(a==='libEquip'){state.lib.equip=btn.dataset.v;return render(el,'train')}
 if(a==='libClear'){Object.assign(state.lib,{cat:'all',part:'all',equip:'all'});return render(el,'train')}
 if(a==='pickDay'){saveMealsDay();state.day=+btn.dataset.day;loadMealsDay(state.day);return render(el,'home')}
 if(a==='deviceChip'){if(state.connected)return sheet(el,'MotionStation · MS-1024',`<p>滨江店训练区<br>已连接 · 演示会话</p>`+choice('断开连接','结束设备控制会话','data-act="disconnect"')+choice('训练记录','查看本人历史训练','data-act="records"'));return searchingSheet(el)}
 if(a==='searchDevices')return searchingSheet(el);
 if(a==='foundDevice')return foundSheet(el);
 if(a==='connectTrain'){state.connected=true;state.target='motion';syncMotionToggle();refresh();return controlSheet(el,'已连接 · 开始训练')}
 if(a==='connect'){state.connected=true;state.target='motion';syncMotionToggle();refresh();return act(el,'deviceChip')}
 if(a==='disconnect'){state.connected=false;syncMotionToggle();refresh();return sheet(el,'已断开','<p>设备已断开。未连接时只能查看训练内容；开始训练时会再次搜索附近设备。</p>')}
 if(a==='endTrain'){el.querySelector('.modal')?.remove();return}
 if(a==='noop')return;
 if(a==='prepare'){const planId=btn?.dataset.plan;const plan=planId?Object.values(WEEK_PLANS).flat().find(p=>p.id===planId):null;if((plan&&plan.motion===false)||btn?.dataset.motion==='0')return selfTrainSheet(el,plan||{title:'自主训练',moves:['拉伸','核心激活'],meta:'自主训练'});return startTrain(el)}
 if(a==='selfDone'){refresh();return sheet(el,'已完成打卡','<p>本次自主训练已记录。可在「训练记录」中查看。</p>')}
 if(a==='genScheme')return sheet(el,'生成个性化训练方案',`<p class="note">将基于最新体测报告生成运动方案与饮食方案。</p><div class="card scheme-preview"><b>运动方案 · 4 周</b><p>第 1 周呼吸与体态筑基<br>第 2–3 周核心唤醒与下肢激活<br>第 4 周整合收束与复测准备</p></div><div class="card scheme-preview"><b>饮食方案 · 按餐记录</b><p>灵活添加餐次并查看当日营养汇总，用于方案执行跟踪。</p></div>${choice('生成并加入计划','运动方案自动进入我的计划','data-act="genConfirm"')}`)
 if(a==='genConfirm'){state.scheme='generated';state.joined=true;state.meals=[];state.mealDays={};resetWeekPlans();refresh();return sheet(el,'方案已生成','<p>运动方案已加入我的计划。饮食方案可按需添加餐次并查看营养。</p>')}
 if(a==='leaveScheme'){state.scheme='none';state.joined=hasMotion();state.meals=[];state.mealDays={};resetWeekPlans();refresh();return}
 if(a==='schemeDetail')return sheet(el,'运动方案',`<p class="note">第 2 阶段 / 共 4 阶段 · 已加入我的计划</p><div class="h5-phases"><div><span>1</span><b>呼吸与体态筑基</b><small>第 1 周</small></div><div><span>2</span><b>核心唤醒与下肢激活</b><small>第 2–3 周</small></div><div><span>3</span><b>整合收束与复测准备</b><small>第 4 周</small></div></div>`)
 if(a==='dietUpload')return dietSheet(el)
 if(a==='dietAdd'){const p=MEAL_PRESETS[+btn.dataset.i];if(!p)return;state.meals.push({id:'m'+Date.now()+Math.random().toString(16).slice(2),...p});saveMealsDay();refresh();return dietSheet(el)}
 if(a==='dietCustom'){const input=el.querySelector('[data-meal-name]');const name=(input?.value||'').trim()||'自定义餐次';state.meals.push({id:'m'+Date.now()+Math.random().toString(16).slice(2),name,img:'core',kcal:260,protein:14,carb:28,fat:9});saveMealsDay();refresh();return dietSheet(el)}
 if(a==='dietRemove'){state.meals=state.meals.filter(m=>m.id!==btn.dataset.id);saveMealsDay();return render(el,'home')}
 if(a==='bodyArchive'){
  const list=filteredReports(),r=list[0];
  const kv=(k,v)=>`<div><i>${k}</i><b>${v}</b></div>`;
  const latest=r?['体重','体脂率','肌肉量','BMI'].map(l=>{const m=findMetric(r,'composition|'+l);return m?kv(l,m.value):''}).join(''):'';
  return sheet(el,'身体档案',`<p class="note">本人基础信息与体测概览，用于生成训练与饮食建议。</p><div class="detail-fields">${kv('昵称',PROFILE.name)}${kv('性别','女')}${kv('出生日期','1995-06-18')}${kv('身高','163 cm')}${kv('训练目标','减脂 · 体态改善')}</div>${r?`<div class="detail-fields">${kv('最近测量',md(r.date)+' · '+r.device)}${latest}</div>`:'<p class="note">暂无体测记录，完成测量后自动补充档案。</p>'}${list.length?choice('查看全部测量记录','共 '+list.length+' 条','data-act="reports"'):''}`)
 }
 if(a==='mineTab'){state.mineTab=btn.dataset.tab;return render(el,'mine')}
 if(a==='moveDetail'){const m=MOVES.find(x=>x.id===btn.dataset.id);if(!m)return;return sheet(el,m.name,`<img class="detail-cover" src="${PHOTO(m.img)}" alt=""><div class="detail-fields"><div><i>训练部位</i><b>${PART_LABEL[m.part]}</b></div><div><i>使用器械</i><b>${m.equip}</b></div><div><i>训练肌群</i><b>${m.muscles}</b></div><div><i>动作介绍</i><p>${m.intro}</p></div></div>${choice('开始训练','未连接时将搜索附近设备','data-act="prepare"')}`)}
 if(a==='planDetail'){const p=PLANS.find(x=>x.id===btn.dataset.id);if(!p)return;return sheet(el,p.name,`<img class="detail-cover" src="${PHOTO(p.img)}" alt=""><p class="note">${p.weeks} · ${p.freq} · ${p.goal}</p><p>计划说明：循序渐进安排动作负荷，适合当前阶段目标。</p>${choice('加入计划','加入后可在我的计划中查看','data-act="joinPlan"')}`)}
 if(a==='joinPlan'){state.joined=true;refresh();return sheet(el,'已加入计划','<p>计划已加入日程，可在「我的 · 我的计划」中查看。</p>')}
const info={profile:['个人资料','昵称、出生日期、性别、身高、体重与训练目标。'],security:['账号与安全','登录身份、手机号、邮箱和密码管理。'],rights:['服务与权益','当前机构已开放的健康档案、报告解读与训练指导。'],settings:['偏好设置','主题、语言与公英制单位。画板顶部可切换深浅主题。'],privacy:['隐私与应用权限','应用权限、个人信息清单、第三方共享说明与隐私政策。'],help:['帮助与反馈','联系所属机构或查看 Motion 使用帮助。'],about:['关于 Visbody','你的测量报告、训练记录与健康服务。'],favorites:['我的收藏','普通动作、AI 动作和计划收藏。'],plans:['我的计划',hasPlan()?'全身力量入门 · 进行中；查看、跳过、改期与退出。':'暂无训练计划。'],records:['训练记录','按周、月查看统计，按类型和日期筛选本人记录。'],day:['训练日程','查看当天训练任务；在具体计划中改期或跳过。'],motionAdd:['添加 Motion','通过扫码或手动 SN 添加 Motion。此预览不执行真实绑定。'],moves:['动作库','查看动作说明、媒体、要点和设备要求。']};const [t,d]=info[a]||['服务','查看当前机构授权服务。'];sheet(el,t,`<p>${d}</p>`)
}

const PAGE_BLURB={home:'扫码与今日摘要',health:'身体状态总览与报告',train:'Motion 与训练内容',mine:'账号与机构服务'};
function mountFrames(board,{skin='',blurbMap=PAGE_BLURB}={}){
 if(!board)return;
 for(const [p,name] of Object.entries(names)){
  const frame=document.createElement('div');
  frame.className='frame';
  frame.dataset.original=p;
  const tip=blurbMap[p]||PAGE_BLURB[p];
  frame.innerHTML=`<div class="page-label"><b>${name}</b><span>${tip}</span></div><article class="phone" data-page="${p}"${skin?` data-skin="${skin}"`:''}></article>`;
  board.append(frame);
  render(frame.querySelector('.phone'),p);
 }
}
function bindBoard(board){
 if(!board||board.dataset.bound==='1')return;
 board.dataset.bound='1';
 board.addEventListener('click',e=>{const el=e.target.closest('.phone'),b=e.target.closest('button,[data-h5]');if(!el||!b)return;const x=b.dataset;if('close'in x){el.querySelector('.modal')?.remove();return}if(x.h5)return H5Home.handle(el,x.h5);if(x.page){state.sub=null;return render(el,x.page)}if(x.act)return act(el,x.act,b);if(x.report)return showReport(el,x.report);if(x.scope){state.scope=x.scope;state.source='all';return refresh()}if(x.source){state.source=x.source;return refresh()}if(x.target){state.target=x.target;refresh();return act(el,'deviceChip')}});
 board.addEventListener('input',e=>{const input=e.target.closest('[data-lib-search]');if(!input)return;const el=e.target.closest('.phone');if(!el)return;state.lib.q=input.value;render(el,'train');const again=el.querySelector('[data-lib-search]');if(again){again.focus();const len=again.value.length;again.setSelectionRange(len,len)}});
 board.addEventListener('keydown',e=>{const modal=e.target.closest('.modal');if(e.key==='Escape')modal?.remove();if(e.key==='Tab'&&modal){const buttons=[...modal.querySelectorAll('button')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&e.target===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&e.target===last){e.preventDefault();first.focus()}}});
}
window.AppBoard={mountFrames,bindBoard,refresh,getTheme:()=>state.theme};

loadScenario('both');
const mainBoard=document.querySelector('.board');
mountFrames(mainBoard);
bindBoard(mainBoard);
syncFrames();
function theme(t){state.theme=t;for(const x of ['light','dark'])document.querySelector('#'+x).setAttribute('aria-pressed',String(x===t));refresh()}
document.querySelector('#light').onclick=()=>theme('light');document.querySelector('#dark').onclick=()=>theme('dark');
document.querySelector('#scenario').onchange=e=>{loadScenario(e.target.value);refresh()};
document.querySelector('#motionOn').onclick=()=>{state.connected=true;state.target='motion';syncMotionToggle();refresh()};
document.querySelector('#motionOff').onclick=()=>{state.connected=false;syncMotionToggle();refresh()};
document.querySelector('#reset').onclick=()=>{try{for(const s of ['both','body','motion'])localStorage.removeItem(KEY+s);localStorage.removeItem(PICK_KEY)}catch{}bodyPick=[...DEFAULT_PICK];loadScenario(state.scenario);refresh()};
const params=new URLSearchParams(location.search);if(params.get('theme')==='dark')theme('dark');if(['both','body','motion'].includes(params.get('scenario'))){loadScenario(params.get('scenario'));document.querySelector('#scenario').value=state.scenario;refresh()}if(params.get('connected')==='1'){state.connected=true;state.target='motion';syncMotionToggle();refresh()}if(params.has('export'))document.body.classList.add('export');if(params.has('page')){document.body.classList.add('single');const page=names[params.get('page')]?params.get('page'):'home';document.querySelector(`.frame[data-original="${page}"]`)?.classList.add('chosen')}
