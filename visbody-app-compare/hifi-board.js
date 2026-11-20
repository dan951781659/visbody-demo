/* Compare board: 清爽卡片 + 渐变毛玻璃 */
(function(){
const GLASS_BLURB={home:'渐变底与磨砂卡',health:'通透统计与趋势',train:'磨砂计划卡',mine:'半透明档案'};

function mountFilter(){
  const controls=document.querySelector('.controls');
  if(!controls||document.querySelector('.scheme-filter'))return;
  const box=document.createElement('div');
  box.className='scheme-filter';
  box.setAttribute('role','group');
  box.setAttribute('aria-label','风格对比');
  box.innerHTML=`<button data-scheme-filter="all" aria-pressed="true">全部方案</button><button data-scheme-filter="cards" aria-pressed="false">卡片</button><button data-scheme-filter="glass" aria-pressed="false">毛玻璃</button>`;
  controls.prepend(box);
  box.addEventListener('click',e=>{
    const b=e.target.closest('[data-scheme-filter]');if(!b)return;
    const v=b.dataset.schemeFilter;
    box.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    document.body.dataset.scheme=v==='all'?'':v;
  });
}

function mountCompare(){
  const cardsBoard=document.querySelector('.board');
  if(!cardsBoard||cardsBoard.dataset.hifiWrapped)return;
  cardsBoard.dataset.hifiWrapped='1';

  const cardsRow=document.createElement('section');
  cardsRow.className='scheme-row';
  cardsRow.dataset.scheme='cards';
  cardsRow.innerHTML=`<div class="scheme-title"><h2>清爽卡片</h2><p>可交互 · 实心分层卡片与产品化组件</p></div>`;
  cardsBoard.parentNode.insertBefore(cardsRow,cardsBoard);
  cardsRow.appendChild(cardsBoard);

  const glassRow=document.createElement('section');
  glassRow.className='scheme-row';
  glassRow.dataset.scheme='glass';
  glassRow.innerHTML=`<div class="scheme-title"><h2>渐变毛玻璃</h2><p>可交互 · 磨砂半透明控件 · 浅/深色随顶部开关</p></div><div class="board" id="board-glass"></div>`;
  cardsRow.parentNode.appendChild(glassRow);
  const glassBoard=glassRow.querySelector('#board-glass');
  if(window.AppBoard){
    window.AppBoard.mountFrames(glassBoard,{skin:'glass',blurbMap:GLASS_BLURB});
    window.AppBoard.bindBoard(glassBoard);
  }

  mountFilter();
}

function mountStandalone(){
  const root=document.querySelector('[data-hifi-root]');
  if(!root)return;
  root.innerHTML=`
    <header class="hero">
      <small>VISBODY · HI-FI STYLE · BRAND BLUE #0066E7</small>
      <h1>两方案对比请打开主画板</h1>
      <p>清爽卡片与渐变毛玻璃同源可交互（含浅/深色）。请使用 <a href="index.html">index.html</a> 查看。</p>
    </header>
    <aside class="note"><strong>说明</strong>：影像沉浸已下线，避免与两套主风格撞车。</aside>`;
}

window.HifiBoard={mountCompare,mountStandalone};

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
function boot(){
  if(document.querySelector('[data-hifi-root]'))mountStandalone();
  else requestAnimationFrame(()=>setTimeout(mountCompare,0));
}
})();
