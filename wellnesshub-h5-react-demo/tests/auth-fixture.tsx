import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/roboto/latin-500.css';
import '../src/styles.css';
import Prototype from '../src/Prototype';
import { MobileRuntime } from '../src/mobile';
import { useMobileDevice } from '../src/mobile/Device';

if(location.hostname!=='127.0.0.1'||location.port!=='4177')throw new Error('Auth QA requires isolated port 4177');
const q=new URLSearchParams(location.search);
const width=Number(q.get('width'))||393;
localStorage.setItem('wellnesshub.consent.v1','true');
localStorage.setItem('wellnesshub.session.v1','false');
localStorage.setItem('wellnesshub.locale',q.get('locale')||'zh');
localStorage.setItem('wellnesshub.theme',q.get('theme')||'light');
function Fixture(){
  const {setDeviceId}=useMobileDevice();
  useEffect(()=>setDeviceId(q.get('device')==='pixel'?'pixel-10':'iphone'),[]);
  return <><style>{'.wh-app {width:'+width+'px;right:auto;}'}</style><Prototype/></>;
}
const root=createRoot(document.getElementById('root')!);
root.render(<MobileRuntime><Fixture/></MobileRuntime>);
if(import.meta.hot)import.meta.hot.dispose(()=>root.unmount());
