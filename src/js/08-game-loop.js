// ---- loop ----
let shieldUp=false,shieldFlash=0;
const shieldEl=document.createElement('div');shieldEl.id='shieldView';shieldEl.style.cssText='position:fixed;right:-8vw;bottom:-9vh;width:36vw;height:48vh;pointer-events:none;z-index:4;background:#79502f;border:3px solid #4a2d1a;box-shadow:inset 0 0 0 5px #8b6038,inset 0 0 0 8px #5a3922;transform-origin:center;transition:transform .12s ease-out;transform:translateY(130%) rotate(-20deg)';document.body.appendChild(shieldEl);
// 盾の正面判定。正面を向いて構えている間は近接攻撃を防ぐ。
function shieldFaces(x,z){const dx=x-P.x,dz=z-P.z,l=Math.hypot(dx,dz)||1;return ((-Math.sin(P.yaw))*dx+(-Math.cos(P.yaw))*dz)/l>.5}
// 前方(±60°)から飛んでくる矢だけ防ぐ
function shieldBlocks(a){const l=Math.hypot(a.vx,a.vz)||1;return -(a.vx*-Math.sin(P.yaw)+a.vz*-Math.cos(P.yaw))/l>.5}
let last=performance.now(),fr=0,fps=60,uw=false;const hud=document.getElementById('hud'),uwOverlay=document.getElementById('uwOverlay'),UWC=new THREE.Color(0x1d4a8c),uwTmp=new THREE.Color();
let circuitOn=false,circuitT=0;
function crouchHasSupport(x,y,z){const yy=Math.floor(y-.08),r=.27;return [[x-r,z-r],[x+r,z-r],[x-r,z+r],[x+r,z+r],[x,z]].some(([px,pz])=>solid(getB(Math.floor(px),yy,Math.floor(pz))));}

for(const[dx,dz]of[[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const c=getC((Math.floor(P.x)>>4)+dx,(Math.floor(P.z)>>4)+dz);if(c&&!c.v)mesh(c)}
function loop(now){
 const dt=Math.min(.05,(now-last)/1000);last=now;fps+=(1/Math.max(dt,.001)-fps)*.05;
 const f=inv?0:(keys.KeyW?1:0)-(keys.KeyS?1:0),s=inv?0:(keys.KeyD?1:0)-(keys.KeyA?1:0);
 const sn=Math.sin(P.yaw),cs=Math.cos(P.yaw),ix=Math.floor(P.x),iz=Math.floor(P.z);
 const mid=getB(ix,Math.floor(P.y+.4),iz);
 if(isL(mid)||isL(getB(ix,Math.floor(P.y+1.4),iz))||isL(getB(ix,Math.floor(P.y+.05),iz))){toast('溶岩で死んだ！ リスポーンします');respawn()}
 const crouching=!flying&&!inv&&(keys.ShiftLeft||keys.ShiftRight);
 shieldUp=!!(crouching&&equipped.shield);if(shieldFlash>0)shieldFlash-=dt;shieldEl.style.transform=(shieldUp?'translateY(3%)':'translateY(130%)')+' rotate(-20deg)'+(shieldFlash>0?' scale(1.08)':'');
 const dashing=!flying&&!inv&&keys.KeyW&&keys.KeyR&&hunger>3;sprintAmt+=((dashing?1:0)-sprintAmt)*Math.min(1,8*dt);
 if(gameStarted&&!pauseMenuOpen&&msg.style.display==='none'&&hunger>0){hungerTimer+=dt;if(hungerTimer>=300){const lost=Math.floor(hungerTimer/300);hunger=Math.max(0,hunger-lost);hungerTimer%=300;updateHp();save(false)}}
 const inWater=isW(mid)||[-.35,.05,.45,1.2].some(o=>isW(getB(ix,Math.floor(P.y+o),iz)));
 const onHoney=!flying&&honeyContact(P.x,P.y,P.z);
 const iw=inWater&&!flying,swimDash=iw&&dashing,sp=flying?12:(dashing?9:(crouching?2.2:4.5))*(iw?.55:1)*(onHoney?.4:1);
 const bodyHit=swimDash?hitSwim:hit;
 if(swimDash){const cp=Math.cos(P.pitch),dx=-Math.sin(P.yaw)*cp,dy=-Math.sin(P.pitch),dz=-Math.cos(P.yaw)*cp;P.vx=dx*9;P.vy=dy*9;P.vz=dz*9}else{P.vx=(-sn*f+cs*s)*sp;P.vz=(-cs*f-sn*s)*sp;
 if(!flying){updFlow(P,Math.floor(P.x),[P.y+.4,P.y+.05,P.y+1.0],Math.floor(P.z),dt);P.vx+=P.fx;P.vz+=P.fz}else{P.fx=P.fz=0}}
 if(flying)P.vy=((keys.Space&&!inv?1:0)-((keys.ShiftLeft||keys.ShiftRight)&&!inv?1:0))*9;else if(swimDash){}else{P.vy-=(iw?9:26)*dt;
 if(iw){P.vy*=1-2.5*dt;if(keys.Space&&!inv)P.vy=Math.min(P.vy+25*dt,3.5)}else if(keys.Space&&P.ground&&!inv){const under=getB(Math.floor(P.x),Math.floor(P.y-.08),Math.floor(P.z))&255;P.vy=under===HONEY?Math.sqrt(2*26*.3):8.5}}
 if(P.vy<-40)P.vy=-40;const gnd=P.ground;P.ground=false;
 let bl=false;const nx=P.x+P.vx*dt;if(!bodyHit(nx,P.y,P.z) && !(crouching&&gnd&&!crouchHasSupport(nx,P.y,P.z)))P.x=nx;else{bl=true;if(gnd&&!crouching&&!bodyHit(nx,P.y+.6,P.z)){P.x=nx;P.y+=.6}}
 const nz=P.z+P.vz*dt;if(!bodyHit(P.x,P.y,nz) && !(crouching&&gnd&&!crouchHasSupport(P.x,P.y,nz)))P.z=nz;else{bl=true;if(gnd&&!crouching&&!bodyHit(P.x,P.y+.6,nz)){P.z=nz;P.y+=.6}}
 if(bl&&iw&&!swimDash&&(f||s)&&!hit(P.x+Math.sign(P.vx)*.4,P.y+1.1,P.z+Math.sign(P.vz)*.4))P.vy=Math.max(P.vy,7);
 const ny=P.y+P.vy*dt;if(!bodyHit(P.x,ny,P.z))P.y=ny;else{if(P.vy<0){const impact=-P.vy;P.ground=true;if(!flying&&slimeUnder(P.x,P.y,P.z,R))P.vy=impact*Math.SQRT1_2;else P.vy=0;if(flying){flying=false;toast('飛行モード OFF')}}else P.vy=0}
 cam.position.set(P.x,P.y+1.6,P.z);{const tf=cfg.fov+(cfg.sprintFov?12*sprintAmt:0);if(Math.abs(cam.fov-tf)>.01){cam.fov=tf;cam.updateProjectionMatrix()}}cam.rotation.set(P.pitch,P.yaw,0);
 const nu=isW(getB(Math.floor(P.x),Math.floor(P.y+1.6),Math.floor(P.z)));
 if(nu!=uw){uw=nu;uwOverlay.style.opacity=uw?1:0;if(CLD.m)CLD.m.visible=!uw;const c=uw?0x1d4a8c:0x87ceeb;scene.fog.color.set(c);scene.background.set(c);scene.fog.near=uw?.1:Math.min(35,Math.max(16,RD*16-10)-1);scene.fog.far=uw?24:Math.max(16,RD*16-10)}
 target=ray();if(target){hl.visible=true;hl.position.set(target.x+.5,target.y+.5,target.z+.5)}else hl.visible=false;
 updateDayNight(dt); updateBlockGlows(dt); circuitTick(dt);mobTick(dt);arrowTick(dt);cloudTick(dt);dropTick(dt);stream();
 if(++fr%15==0)hud.textContent=(flying?'✈飛行中  ':swimDash?'泳ぎ中  ':crouching?(shieldUp?'盾を構え中  ':'しゃがみ中  '):dashing?'ダッシュ  ':(keys.KeyW&&keys.KeyR&&hunger<=3?'空腹でダッシュ不可  ':''))+`X:${ix} Y:${Math.floor(P.y)} Z:${iz}  FPS:${fps|0}  チャンク:${C.size}  装備:${equipped.weapon?ITEMS[equipped.weapon].name:'素手'}  回路:${circuitOn?'ON':'OFF'}`;
 ren.render(scene,cam);requestAnimationFrame(loop)}
requestAnimationFrame(loop);


