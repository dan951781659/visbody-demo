import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/roboto/latin-500.css';
import '../src/styles.css';
import Prototype, { homeSampleReports, homeSampleOutlines } from '../src/Prototype';
import { MobileRuntime } from '../src/mobile';
import { useMobileDevice } from '../src/mobile/Device';

// A separate origin is mandatory. Never seed the user's 4173 storage.
if (location.hostname !== '127.0.0.1' || location.port !== '4176') throw new Error('QA fixture requires isolated origin http://127.0.0.1:4176');
const q = new URLSearchParams(location.search);
const locale=q.get('locale')||'zh', theme=q.get('theme')||'light', scenario=q.get('scenario')||'none';
const width = [320,375,390,393,423,427].includes(Number(q.get('width'))) ? Number(q.get('width')) : 393;
const records=structuredClone(homeSampleReports);
const locales=['zh','en','de','ar'] as const;
const localized=<T,>(fn:(locale:typeof locales[number])=>T)=>Object.fromEntries(locales.map(l=>[l,fn(l)]));
const reportId=scenario==='historical'?records[1].id:records[0].id;
const ai={id:'qa-ai-'+reportId,reportId,type:'ai',generatedAt:'2026-08-10 17:00',summary:localized(()=> 'QA · '+reportId),ai:localized(l=>({summary:'QA · '+reportId,risks:[],strengths:[],actions:[]}))};
const training={id:'qa-training-'+reportId,reportId,type:'training',generatedAt:'2026-08-10 17:30',summary:localized(()=> 'QA · '+reportId),training:localized(l=>({...homeSampleOutlines[l],title:'QA · '+reportId,heroDesc:'QA · '+reportId}))};
let services:unknown[]=[];
if(['both','historical','ai-only'].includes(scenario))services.push(ai);
if(['both','historical','training-only'].includes(scenario))services.push(training);
let data=records;
if(scenario==='empty')data=[];
if(scenario==='single')data=[records[0]];
if(scenario==='missing'){records[0].modelAsset=null;records[0].modules=[];}
if(scenario==='different')records[1].device='VISBODY M30';
if(scenario==='unlinked'){services=[{...ai,reportId:'unrelated-report'}];}
localStorage.setItem('wellnesshub.consent.v1','true');
localStorage.setItem('wellnesshub.session.v1','true');
localStorage.setItem('wellnesshub.session.role','user');
localStorage.setItem('wellnesshub.locale',locale);
localStorage.setItem('wellnesshub.theme',theme);
localStorage.setItem('wellnesshub.units',q.get('units')||'metric');
localStorage.setItem('wellnesshub.reports.v1',JSON.stringify(data));
localStorage.setItem('wellnesshub.profile',JSON.stringify({nickname:'QA',gender:'female',heightCm:168,weightKg:999,birthday:'1992-06-18'}));
localStorage.setItem('wellnesshub.home-services.v1',scenario==='error'?'invalid-json':JSON.stringify(services));
if(!location.hash)location.hash='/home';

function Fixture(){
  const {setDeviceId}=useMobileDevice();
  useEffect(()=>setDeviceId(q.get('device')==='iphone'?'iphone':'pixel-10'),[]);
  return <><style>{'.wh-app { width:'+width+'px; right:auto; }'}</style><Prototype/></>;
}
const root=createRoot(document.getElementById('root')!);
root.render(<MobileRuntime><Fixture/></MobileRuntime>);
if(import.meta.hot)import.meta.hot.dispose(()=>root.unmount());
