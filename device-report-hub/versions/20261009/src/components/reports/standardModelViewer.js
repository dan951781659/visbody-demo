(function(root){
  root.mountMercuryModel = function(host) {
    host.innerHTML = '<div style="position:relative;border:1px solid #dfe7ef;border-radius:14px;overflow:hidden;background:#f8fafc"><div style="position:absolute;bottom:24px;left:30%;width:40%;height:35px;border:1px solid #bac8d3;border-radius:50%;background:#e7edf2"></div><canvas aria-label="可拖动旋转的男性标准三维模型" style="position:relative;display:block;width:100%;height:360px;touch-action:pan-y;background:linear-gradient(0deg,#e8eff5 0%,transparent 24%),repeating-linear-gradient(0deg,transparent 0 35px,#dae2e9 35px 36px),repeating-linear-gradient(90deg,transparent 0 35px,#dae2e9 35px 36px)"></canvas><button type="button" style="position:absolute;right:12px;bottom:12px;background:white;color:#0284c7;border:1px solid #bae6fd;border-radius:20px;padding:7px 14px">暂停旋转</button><div style="position:absolute;left:12px;top:12px;font-size:11px;color:#64748b">标准模型示意，非本次用户扫描模型</div></div>';
    const canvas=host.querySelector('canvas'),button=host.querySelector('button');
    let gl,program,buffer,nBuffer,frame=0,visible=true,paused=false,drag=false,angle=0,last=0,x=0,observer;
    const cleanup=()=>{cancelAnimationFrame(frame);observer?.disconnect();document.removeEventListener('visibilitychange',visibility);if(gl){gl.deleteBuffer(buffer);gl.deleteBuffer(nBuffer);gl.deleteProgram(program);}};
    const visibility=()=>{last=0;};
    try {
      gl=canvas.getContext('webgl',{antialias:true,alpha:true});
      if(!gl||!root.MercuryModelGeometry)throw Error('模型资源不可用');
      const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('渲染器初始化失败');return s;};
      const vs=shader(gl.VERTEX_SHADER,'attribute vec3 p;attribute vec3 n;uniform float angle;uniform float aspect;varying float light;void main(){float c=cos(angle),s=sin(angle);mat3 r=mat3(c,0.,-s,0.,1.,0.,s,0.,c);vec3 v=r*p;vec3 normal=r*n;light=.72+.28*max(dot(normal,normalize(vec3(-.5,.8,1.))),0.);gl_Position=vec4(v.x*.9/aspect,v.y*.9,-v.z*.4,1.);}');
      const fs=shader(gl.FRAGMENT_SHADER,'precision mediump float;varying float light;void main(){gl_FragColor=vec4(vec3(.78,.8,.82)*light,1.);}');
      program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('渲染失败');gl.deleteShader(vs);gl.deleteShader(fs);gl.useProgram(program);
      const decode=s=>{const b=atob(s);const a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return new Float32Array(a.buffer);};
      const positions=decode(root.MercuryModelGeometry.positions);
      const bind=(name,data)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);return b;};
      buffer=bind('p',positions);nBuffer=bind('n',decode(root.MercuryModelGeometry.normals));gl.enable(gl.DEPTH_TEST);
      const aLoc=gl.getUniformLocation(program,'angle'),aspectLoc=gl.getUniformLocation(program,'aspect');
      function draw(t){frame=requestAnimationFrame(draw);const active=visible&&!document.hidden&&host.getClientRects().length>0;if(!active){last=0;return;}if(last&&!paused&&!drag)angle+=(t-last)*Math.PI/10000;last=t;const d=Math.min(devicePixelRatio||1,2),w=Math.round(canvas.clientWidth*d),h=Math.round(canvas.clientHeight*d);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(aLoc,angle);gl.uniform1f(aspectLoc,w/h);gl.drawArrays(gl.TRIANGLES,0,positions.length/3);}
      observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;});observer.observe(host);document.addEventListener('visibilitychange',visibility);
      button.onclick=()=>{paused=!paused;button.textContent=paused?'继续旋转':'暂停旋转';button.setAttribute('aria-pressed',String(paused));};
      canvas.onpointerdown=e=>{drag=true;x=e.clientX;canvas.setPointerCapture(e.pointerId);};canvas.onpointermove=e=>{if(drag){angle+=(e.clientX-x)*.012;x=e.clientX;}};canvas.onpointerup=canvas.onpointercancel=()=>{drag=false;last=0;};
      canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cleanup();host.textContent='模型显示中断，请刷新页面重试。';});
      frame=requestAnimationFrame(draw);
    } catch(e){cleanup();host.innerHTML='<div style="padding:40px;text-align:center;color:#64748b">三维模型暂时无法显示，请刷新页面或使用支持 WebGL 的浏览器。</div>';}
    return cleanup;
  };
})(globalThis);
