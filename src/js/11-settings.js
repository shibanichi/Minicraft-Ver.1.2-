// ---- 設定：視野角（標準75°・±50）と感度（標準100%・±50） ----
const FOV_DEF=75,FOV_MIN=25,FOV_MAX=125,SENS_DEF=100,SENS_MIN=50,SENS_MAX=150,SETK='minicraft_settings';
let sensMul=1;
const RD_MIN=Math.max(1,RD_BASE-5),RD_MAX=RD_BASE+5;
const cfg={fov:FOV_DEF,sens:SENS_DEF,bright:100,sprintFov:true,drawDist:RD_BASE};
try{const j=JSON.parse(localStorage.getItem(SETK)||'null');if(j){cfg.fov=Math.max(FOV_MIN,Math.min(FOV_MAX,+j.fov||FOV_DEF));cfg.sens=Math.max(SENS_MIN,Math.min(SENS_MAX,+j.sens||SENS_DEF));cfg.bright=Math.max(50,Math.min(150,+j.bright||100));cfg.sprintFov=j.sprintFov!==false;cfg.drawDist=Math.max(RD_MIN,Math.min(RD_MAX,Number.isFinite(+j.drawDist)?+j.drawDist:RD_BASE))}}catch(e){}
function applyCfg(){cam.fov=cfg.fov;cam.updateProjectionMatrix();sensMul=cfg.sens/100;brightMul=cfg.bright/100;RD=Math.max(RD_MIN,Math.min(RD_MAX,cfg.drawDist|0));const far=Math.max(16,RD*16-10);scene.fog.near=Math.min(35,far-1);scene.fog.far=far;try{localStorage.setItem(SETK,JSON.stringify(cfg))}catch(e){}}
{const box=document.querySelector('#pauseMenu .pauseBox'),before=document.getElementById('resumeBtn'),settingsBtn=document.getElementById('settingsBtn');
 if(box&&before&&settingsBtn){const p=document.createElement('div');p.id='settingsPanel';p.style.cssText='display:none;margin:10px 0;padding:8px 12px;background:rgba(0,0,0,.28);border-radius:6px;text-align:left;font-size:13px;max-height:55vh;overflow:auto';
  const menuButtons=[...box.querySelectorAll('button')];
  const row=(label,key,min,max,def,unit)=>{const w=document.createElement('div');w.style.cssText='margin:6px 0';
   const t=document.createElement('div');t.style.cssText='display:flex;justify-content:space-between;gap:10px;margin-bottom:2px';
   const l=document.createElement('span'),v=document.createElement('b');t.append(l,v);
   const r=document.createElement('input');r.type='range';r.id='rng_'+key;r.min=min;r.max=max;r.step=1;r.value=cfg[key];r.style.cssText='width:100%';
   const show=()=>{l.textContent=label+'（標準 '+def+unit+'　範囲 '+min+'〜'+max+unit+'）';v.textContent=cfg[key]+unit};
   r.addEventListener('input',()=>{cfg[key]=+r.value;show();applyCfg()});
   const rs=document.createElement('button');rs.type='button';rs.textContent='標準に戻す';rs.style.cssText='margin-top:3px;padding:3px 8px;font-size:12px';
   rs.onclick=e=>{e.stopPropagation();cfg[key]=def;r.value=def;show();applyCfg()};
   w.append(t,r,rs);show();return w};
  p.append(row('視野角','fov',FOV_MIN,FOV_MAX,FOV_DEF,'°'),row('感度','sens',SENS_MIN,SENS_MAX,SENS_DEF,'%'),row('明るさ','bright',50,150,100,'%'),row('描画距離','drawDist',RD_MIN,RD_MAX,RD_BASE,'チャンク'));
  {const cb=document.createElement('label');cb.style.cssText='display:flex;align-items:center;gap:6px;margin:8px 0 2px;font-size:13px;cursor:pointer';
   const ci=document.createElement('input');ci.type='checkbox';ci.id='chk_sprintfov';ci.checked=cfg.sprintFov;ci.onchange=()=>{cfg.sprintFov=ci.checked;applyCfg()};
   cb.append(ci,document.createTextNode('ダッシュ中は視野角を広げる（+12°）'));p.append(cb)}
  const back=document.createElement('button');back.type='button';back.textContent='ゲームメニューに戻る';back.onclick=e=>{e.stopPropagation();p.style.display='none';menuButtons.forEach(b=>b.style.display='');};p.append(back);
  box.insertBefore(p,before);
  settingsBtn.addEventListener('click',e=>{e.stopPropagation();p.style.display='block';menuButtons.forEach(b=>b.style.display='none');p.scrollTop=0;});
 }}
applyCfg();