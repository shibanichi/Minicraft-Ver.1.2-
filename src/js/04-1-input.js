// ---- input ----
const keys={};addEventListener('keydown',e=>{if(pauseMenuOpen){if(e.code==='Escape')e.preventDefault();return}keys[e.code]=1;if(e.code=='Escape'&&!e.repeat&&gameStarted){e.preventDefault();inv=false;invEl.style.display='none';chestKey=null;chestUI.style.display='none';save(false);pauseMenuOpen=true;Object.keys(keys).forEach(k=>keys[k]=0);foodRightHeld=false;clearTimeout(foodEatTimer);leftBreakHeld=false;clearInterval(leftBreakTimer);rightPlaceHeld=false;clearInterval(rightPlaceTimer);drag=false;pauseMenu.style.display='flex';pauseMenu.setAttribute('aria-hidden','false');if(document.pointerLockElement)document.exitPointerLock();return;}if(e.code>='Digit1'&&e.code<='Digit9')setSel(+e.code[5]-1);
 if(e.code=='KeyE'&&!e.repeat&&msg.style.display=='none'&&!pauseMenuOpen)toggleInv();if(e.code=='KeyC'&&!e.repeat&&msg.style.display=='none'){if(!inv)toggleInv();invPage='inventory'}if(e.code=='KeyP'&&!e.repeat)save(true);if(e.code=='KeyQ'&&!e.repeat&&!inv&&msg.style.display=='none')dropSelected();if(e.code=='Space'){e.preventDefault();if(!e.repeat){const tn=performance.now();if(tn-lastSp<300&&msg.style.display=='none'&&!inv){flying=!flying;P.vy=0;toast(flying?'飛行モード ON（Space:上昇 / Shift:下降）':'飛行モード OFF')}lastSp=tn}}});
addEventListener('keyup',e=>keys[e.code]=0);
addEventListener('wheel',e=>{if(!inv&&!pauseMenuOpen)setSel(sel+(e.deltaY>0?1:-1))});
const msg=document.getElementById('msg');let locked=false,fallback=false,drag=false;


let gameStarted=false;
const startBtn=document.getElementById('startBtn');
const pauseMenu=document.getElementById('pauseMenu'),resumeBtn=document.getElementById('resumeBtn'),resetWorldBtn=document.getElementById('resetWorldBtn');let pauseMenuOpen=false;if(resumeBtn)resumeBtn.addEventListener('click',()=>{pauseMenuOpen=false;pauseMenu.style.display='none';pauseMenu.setAttribute('aria-hidden','true');try{cv.requestPointerLock()}catch(e){}});if(resetWorldBtn)resetWorldBtn.addEventListener('click',()=>{if(!resetWorldBtn._c){resetWorldBtn._c=1;resetWorldBtn.textContent='もう一度押すと本当に削除';return}noSave=true;try{localStorage.removeItem(SK)}catch(e){}location.reload()});
function startGame(){
  if(gameStarted)return;
  gameStarted=true;
  msg.style.display='none';
  fallback=true;
  const guide=document.getElementById('startGuide');if(guide)guide.style.display='flex';
  try{resize()}catch(e){}
  try{if(cv.requestPointerLock)cv.requestPointerLock()}catch(e){}
  try{ren.render(scene,cam)}catch(e){console.error('初回描画エラー',e);toast('描画に失敗しました。ブラウザのWebGL設定を確認してください')}
}
if(startBtn){
  startBtn.addEventListener('click',function(e){
    e.preventDefault(); e.stopPropagation(); startGame();
  },false);
}
const closeGuide=document.getElementById('closeGuide');if(closeGuide)closeGuide.addEventListener('click',()=>{document.getElementById('startGuide').style.display='none';try{cv.requestPointerLock()}catch(e){}});
document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===cv;if(gameStarted&&!locked&&!fallback&&!inv)msg.style.display='none'});
document.addEventListener('pointerlockerror',()=>{fallback=true;});
addEventListener('mousemove',e=>{if(!pauseMenuOpen&&(locked||(fallback&&drag))){P.yaw-=e.movementX*.0015*sensMul;P.pitch=Math.max(-1.55,Math.min(1.55,P.pitch-e.movementY*.0015*sensMul))}});
addEventListener('contextmenu',e=>e.preventDefault());
function hit(x,y,z,r=R,h=HT){const jy=Math.floor(y);
 for(let i=Math.floor(x-r);i<=Math.floor(x+r);i++)for(let j=jy-1;j<=Math.floor(y+h);j++)for(let k=Math.floor(z-r);k<=Math.floor(z+r);k++){
  const v=getB(i,j,k);if(!solid(v)||NC[v&255])continue;
  if(v<256&&!THIN[v]){if(j>=jy)return true;continue}
  for(const b of boxes(v,i,j,k,false))if(x-r<i+b[3]&&x+r>i+b[0]&&y<j+b[4]&&y+h>j+b[1]&&z-r<k+b[5]&&z+r>k+b[2])return true}
 return false}
function hitSwim(x,y,z){
 const r=.28,h=.72,base=y+.18,jy=Math.floor(base);
 for(let i=Math.floor(x-r);i<=Math.floor(x+r);i++)for(let j=jy-1;j<=Math.floor(base+h);j++)for(let k=Math.floor(z-r);k<=Math.floor(z+r);k++){
  const v=getB(i,j,k);if(!solid(v)||NC[v&255])continue;
  if(v<256&&!THIN[v]){if(j>=jy)return true;continue}
  for(const b of boxes(v,i,j,k,false))if(x-r<i+b[3]&&x+r>i+b[0]&&base<j+b[4]&&base+h>j+b[1]&&z-r<k+b[5]&&z+r>k+b[2])return true
 }
 return false}
const hl=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.01,1.01,1.01)),new THREE.LineBasicMaterial({color:0}));hl.visible=false;scene.add(hl);
let target=null;
function ray(){const dir=rdir.set(0,0,-1).applyEuler(cam.rotation),o=cam.position;let prev=null;
 for(let t=0;t<6;t+=.04){const x=Math.floor(o.x+dir.x*t),y=Math.floor(o.y+dir.y*t),z=Math.floor(o.z+dir.z*t);
  if(solid(getB(x,y,z)))return{x,y,z,prev,t,hy:o.y+dir.y*t-y};
  if(!prev||prev[0]!=x||prev[1]!=y||prev[2]!=z)prev=[x,y,z]}return null}
let foodRightHeld=false,foodEatTimer=0;
addEventListener('mousedown',e=>{
 if(pauseMenuOpen||msg.style.display!='none'||document.getElementById('startGuide')?.style.display==='flex'||inv||(e.target.closest&&e.target.closest('#bar')))return;drag=true;if(!(locked||fallback))return;
 if(e.button==0){const mh=pickMob();if(mh&&(!target||mh.t<target.t)){attack(mh.m);return}}
 if(e.button==2){const hid=hot[sel];if(isItem(hid)&&ITEMS[hid]?.type==='food'){e.preventDefault();if((invCount[hid]||0)>0){foodRightHeld=true;clearTimeout(foodEatTimer);foodEatTimer=setTimeout(function eatHeldFood(){if(!foodRightHeld)return;const before=invCount[hid]||0;equip(hid);if(foodRightHeld&&(invCount[hid]||0)>0&&((hp<20)||(hunger<10)))foodEatTimer=setTimeout(eatHeldFood,1000);else foodRightHeld=false},1000)}return}if(hid===I.bucket||hid===I.waterBucket||hid===I.lavaBucket){bucketUse(hid);return}}
 if(!target)return;const{x,y,z,prev,hy}=target;
 if(e.button==0){if(getB(x,y,z)==10)return;let broken=getB(x,y,z);setB(x,y,z,0);if(broken>255&&AXB[broken&255])broken&=255;if(RSB.has(broken&255)||(broken&255)===CHEST)breakRS(x,y,z,broken);else if(broken&&broken<256){if(broken===RED_DUST)give(I.redstone,1);else if(broken===12||broken===13)give(I.iron,1);else if(broken===14)give(I.diamond,1);else give(broken,1);if(broken===5&&Math.random()<.10)spawnDrop(I.apple,1,x+.5,y+.7,z+.5)}}
 else if(e.button==2){const tv=getB(x,y,z);if(!(keys.ShiftLeft||keys.ShiftRight)){if(CONTB.has(tv&255)&&((tv&255)!==CHEST||tv>255)){openChest(x,y,z);return}if(rsUse(tv,x,y,z))return}
  if((tv&255)===LEVER){const on=(tv>>8)!==1;setB(x,y,z,LEVER|(on?256:0));toast(on?'レバー ON':'レバー OFF');return}
  if((tv&255)===STONE_BUTTON|| (tv&255)===PRESSURE){toast('レッドストーン信号を発生！');return}
  if((tv>>8)>=13&&(tv>>8)<29){setB(x,y,z,(tv&255)|((13+((tv>>8)-13^4))<<8));return}
  if(!prev)return;const[a,b,c]=prev;let id=hot[sel];if(isItem(id)){if(id===I.redstone){if(take(I.redstone,1))setB(a,b,c,RED_DUST);return}const bm={[I.rail]:RAIL,[I.poweredRail]:POWERED_RAIL,[I.detectorRail]:DETECTOR_RAIL,[I.activatorRail]:ACTIVATOR_RAIL};if(bm[id]&&take(id,1)){setB(a,b,c,bm[id]);return}toast(ITEMS[id].name+'はここには置けません');return}if(b<0||b>=H)return;
  const base=id&255,sh=id>>8,dyn=b-y,half=dyn<0?1:dyn>0?0:(hy>.5?1:0),pf=((Math.round(-P.yaw/(Math.PI/2))%4)+4)%4;
  if(base===CHEST&&sh===0)id=CHEST|((29+((pf+2)&3))<<8);else if(RSB.has(base)&&sh===0)id=rsPlace(base,pf,a,b,c,x,y,z);else if(AXB[base]&&sh===0)id=(a!==x)?base|(1<<8):(c!==z)?base|(2<<8):base;else if(sh>=1&&sh<=8)id=base|((1+pf+4*half)<<8);
  else if(sh==9||sh==10){if((tv&255)==base&&((tv>>8)==9&&dyn>0||(tv>>8)==10&&dyn<0)){setB(x,y,z,base);return}id=base|((9+half)<<8)}
  else if(sh>=13)id=base|((13+pf+8*half)<<8);
  if(solid(id)&&!NC[id&255]&&a<P.x+R&&a+1>P.x-R&&b<P.y+HT&&b+1>P.y&&c<P.z+R&&c+1>P.z-R)return;setB(a,b,c,id);if(id===SPG)spongeAbsorb(a,b,c)}});
addEventListener('mouseup',()=>{foodRightHeld=false;clearTimeout(foodEatTimer);foodEatTimer=0;drag=false;rightPlaceHeld=false;clearInterval(rightPlaceTimer);rightPlaceTimer=0;leftBreakHeld=false;clearInterval(leftBreakTimer);leftBreakTimer=0});
// 左ボタン長押し中は、狙っているブロックの破壊操作を一定間隔で繰り返す
let leftBreakHeld=false,leftBreakTimer=0;
addEventListener('mousedown',e=>{
 if(pauseMenuOpen||e.button!==0||msg.style.display!=='none'||inv||!(locked||fallback)||(e.target.closest&&e.target.closest('#bar')))return;
 leftBreakHeld=true;clearInterval(leftBreakTimer);
 leftBreakTimer=setInterval(()=>{
  if(pauseMenuOpen||!leftBreakHeld||msg.style.display!=='none'||inv||!(locked||fallback)||!target)return;
  const mh=pickMob();if(mh&&(!target||mh.t<target.t))return;
  const ev=new MouseEvent('mousedown',{button:0,bubbles:true,cancelable:true});dispatchEvent(ev);
 },180);
});
// 右ボタン長押し中は、通常ブロックへの設置操作だけを一定間隔で繰り返す
let rightPlaceHeld=false,rightPlaceTimer=0;
addEventListener('mousedown',e=>{
 if(pauseMenuOpen||e.button!==2||msg.style.display!=='none'||document.getElementById('startGuide')?.style.display==='flex'||inv||!(locked||fallback))return;
 const selectedId=hot[sel];if(isItem(selectedId)&&ITEMS[selectedId]?.type==='food')return;
 rightPlaceHeld=true;clearInterval(rightPlaceTimer);
 rightPlaceTimer=setInterval(()=>{
  if(pauseMenuOpen||!rightPlaceHeld||msg.style.display!=='none'||inv||!(locked||fallback)||!target)return;
  const tv=getB(target.x,target.y,target.z)&255;
  if(CONTB.has(tv)||tv===LEVER||tv===STONE_BUTTON||tv===PRESSURE||tv===RED_DUST||tv===REPEATER||tv===COMPARATOR||tv===OBSERVER||tv===DISPENSER||tv===DROPPER)return;
  const ev=new MouseEvent('mousedown',{button:2,bubbles:true,cancelable:true});dispatchEvent(ev);
 },180);
});

// ---- チェスト（27スロット・スタック上限64・セーブ対応） ----
