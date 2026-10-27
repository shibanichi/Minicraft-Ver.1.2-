// ---- mobs ----
const rdir=new THREE.Vector3(),mobs=[];
const ambientLight=new THREE.AmbientLight(0xffffff,.8);scene.add(ambientLight);
const dl=new THREE.DirectionalLight(0xffffff,.5);dl.position.set(.4,1,.6);scene.add(dl);
// ---- ブロック光：6方向への減衰伝播 + 頂点のスムースライティング + ブロック隅のAO ----
const shroomId=nmid('シュルームライト'), glowstoneId=nmid('グロウストーン'), lampLightSprites=new Map();
let lampGlowClock=0;
function isLightSource(v){const id=v&255;return id===shroomId||id===glowstoneId||(id===RED_LAMP&&v>255);}
function lightKey(x,y,z){return x+','+y+','+z}
function rebuildBlockLight(){
 blockLightCache=new Map();const q=[];
 // Scan loaded world chunks for emissive blocks, seed at level 15.
 for(const c of C.values()){if(!c||!c.d)continue;
  for(let y=0;y<c.top;y++)for(let z=0;z<16;z++)for(let x=0;x<16;x++){
   const v=c.d[x+16*(z+16*y)];if(!isLightSource(v))continue;
   const gx=c.cx*16+x,gz=c.cz*16+z,k=lightKey(gx,y,gz);
   if((blockLightCache.get(k)||0)<15){blockLightCache.set(k,15);q.push([gx,y,gz,15])}
  }
 }
 // Breadth-first propagation through the six axis-adjacent cells. Opaque
 // boundary blocks stop propagation; the strongest route wins.
 for(let head=0;head<q.length;head++){
  const [x,y,z,l]=q[head];if(l<=1)continue;
  for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
   const nx=x+dx,ny=y+dy,nz=z+dz;if(ny<0||ny>=H)continue;
   const nc=C.get(ck(nx>>4,nz>>4));const v=nc?nc.d[idx(nx&15,ny,nz&15)]:0;if(v&&occl(v))continue;
   const nl=l-1,k=lightKey(nx,ny,nz);if(nl<=(blockLightCache.get(k)||0))continue;
   blockLightCache.set(k,nl);q.push([nx,ny,nz,nl]);
  }
 }
 blockLightDirty=false;
}
function blockLightAt(x,y,z){if(!lightSystemReady)return 0;return (blockLightCache.get(lightKey(Math.floor(x),Math.floor(y),Math.floor(z)))||0)/15}
function blockAO(x,y,z,nx,ny,nz){
 // Approximate corner occlusion from the two side-neighbours and their corner.
 const ax=x+nx,ay=y+ny,az=z+nz;
 const occ=(dx,dy,dz)=>occl(getB(ax+dx,ay+dy,az+dz))?1:0;
 return 1-(occ(0,0,0)*.18);
}
function updateBlockGlows(dt){
 lightSystemReady=true;lampGlowClock-=dt;if(!blockLightDirty&&lampGlowClock>0)return;lampGlowClock=.3;
 if(blockLightDirty){
  rebuildBlockLight();
  // 光源を直接変更した周辺チャンクだけを再メッシュする。全チャンクの
  // 一括再生成はFPS低下の原因になるため避ける。
  const refresh=[...lightMeshDirty];lightMeshDirty.clear();
  for(const key of refresh){const c=C.get(key);if(c&&c.v)mesh(c)}
 }
 // No point sprites/particles: the world mesh itself receives the light field.
 for(const [key,light] of lampLightSprites){scene.remove(light);if(light.dispose)light.dispose();lampLightSprites.delete(key)}
}
const GC={},MC={},bxm=(w,h,d,c)=>new THREE.Mesh(GC[w+','+h+','+d]||(GC[w+','+h+','+d]=new THREE.BoxGeometry(w,h,d)),MC[c]||(MC[c]=new THREE.MeshStandardMaterial({color:c,roughness:1,metalness:0,emissive:0x000000,emissiveIntensity:0})));
const at=(m,x,y,z)=>{m.position.set(x,y,z);return m};
function leg(g,x,y,z,w,h,d,c){const p=new THREE.Group();p.position.set(x,y,z);p.add(at(bxm(w,h,d,c),0,-h/2,0));g.add(p);return p}
const four=(g,x,y,z,w,h,c)=>[[x,z],[x,-z],[-x,z],[-x,-z]].map(([a,b])=>leg(g,a,y,b,w,h,w,c));
const MT={
 pig:{w:.8,h:.9,hp:10,sp:1.6,drops:[[I.pork,1,1]],b(g){g.add(at(bxm(.62,.5,.9,0xf0a0aa),0,.62,0),at(bxm(.5,.45,.45,0xf0a0aa),0,.72,.62),at(bxm(.26,.18,.1,0xdc828c),0,.66,.88));return four(g,.2,.37,.3,.2,.37,0xe08f99)}},
 cow:{w:.9,h:1.4,hp:10,sp:1.3,drops:[[I.beef,1,1],[I.leather,1,.5]],b(g){g.add(at(bxm(.7,.6,1.1,0x5a3d2b),0,1,0),at(bxm(.72,.3,.5,0xe8e8e8),0,1.05,-.2),at(bxm(.5,.5,.4,0x5a3d2b),0,1.25,.75),at(bxm(.34,.22,.1,0xd8c4b0),0,1.15,.97),at(bxm(.08,.15,.08,0xeeeeee),.22,1.55,.7),at(bxm(.08,.15,.08,0xeeeeee),-.22,1.55,.7));return four(g,.22,.7,.4,.22,.7,0x4a3222)}},
 sheep:{w:.9,h:1.3,hp:8,sp:1.3,drops:[[I.mutton,1,1],[I.leather,1,.4]],b(g){g.add(at(bxm(.8,.7,1,0xeeeeee),0,1,0),at(bxm(.4,.4,.45,0xcdb08c),0,1.2,.7));return four(g,.22,.65,.3,.2,.65,0xcdb08c)}},
 chicken:{w:.4,h:.7,hp:4,sp:1.4,drops:[[I.chicken,1,1],[I.feather,1,.5]],b(g){g.add(at(bxm(.35,.35,.5,0xffffff),0,.45,0),at(bxm(.2,.3,.2,0xffffff),0,.75,.25),at(bxm(.12,.08,.12,0xf0b020),0,.7,.4),at(bxm(.06,.1,.06,0xd02020),0,.62,.38));return[leg(g,.1,.28,0,.05,.28,.05,0xf0b020),leg(g,-.1,.28,0,.05,.28,.05,0xf0b020)]}},
 zombie:{w:.6,h:1.95,hp:20,sp:2.2,host:1,drops:[[I.rotten,1,.7]],b(g){const sk=0x5a9a46;g.add(at(bxm(.52,.75,.26,0x2aa0b0),0,1.12,0),at(bxm(.5,.5,.5,sk),0,1.75,0),at(bxm(.1,.08,.02,0x101040),.12,1.78,.26),at(bxm(.1,.08,.02,0x101040),-.12,1.78,.26));
  for(const sx of[.39,-.39]){const a=new THREE.Group();a.position.set(sx,1.45,0);a.rotation.x=-1.45;a.add(at(bxm(.26,.75,.26,sk),0,-.375,0));g.add(a)}
  return[leg(g,.14,.75,0,.26,.75,.26,0x2f3a82),leg(g,-.14,.75,0,.26,.75,.26,0x2f3a82)]}},
 creeper:{w:.6,h:1.7,hp:20,sp:1.9,host:1,cr:1,drops:[[I.gunpowder,1,.7]],b(g){const c=0x4cae3c;g.add(at(bxm(.5,.75,.3,c),0,.85,0),at(bxm(.5,.5,.5,c),0,1.45,0),at(bxm(.12,.12,.02,0x101010),.13,1.52,.26),at(bxm(.12,.12,.02,0x101010),-.13,1.52,.26),at(bxm(.1,.2,.02,0x101010),0,1.35,.26));return four(g,.15,.475,.2,.22,.475,0x3d9030)}},
 skeleton:{w:.6,h:1.95,hp:20,sp:2.0,host:1,rng:1,drops:[[I.bone,1,.9],[I.arrow,1,.7]],b(g){const bn=0xdcdccc,sd=0xb4b4a2,dk=0x151515;
  g.add(at(bxm(.1,.72,.1,sd),0,1.12,0),at(bxm(.3,.1,.14,bn),0,.78,0));
  for(const y of[1.42,1.28,1.14,1.0])g.add(at(bxm(.46,.06,.2,bn),0,y,0));
  g.add(at(bxm(.5,.5,.5,bn),0,1.75,0),at(bxm(.13,.13,.02,dk),.13,1.8,.26),at(bxm(.13,.13,.02,dk),-.13,1.8,.26),at(bxm(.06,.08,.02,dk),0,1.7,.26),at(bxm(.3,.06,.02,dk),0,1.6,.26));
  for(const x of[-.1,0,.1])g.add(at(bxm(.05,.05,.025,bn),x,1.6,.265));
  for(const sx of[.3,-.3]){const a=new THREE.Group();a.position.set(sx,1.45,0);a.rotation.x=-1.45;a.add(at(bxm(.12,.7,.12,bn),0,-.35,0));g.add(a)}
  g.add(at(bxm(.04,.8,.06,0x6b4a22),.3,1.5,.75),at(bxm(.01,.75,.01,0xdddddd),.3,1.5,.72));
  return[leg(g,.1,.75,0,.12,.75,.12,bn),leg(g,-.1,.75,0,.12,.75,.12,sd)]}}};
function addMob(type,x,y,z){const T=MT[type],g=new THREE.Group(),legs=T.b(g);scene.add(g);mobs.push({T,g,legs,x,y,z,vy:0,yaw:Math.random()*6.28,hp:T.hp,t:0,wp:0,turn:0,go:false,kx:0,kz:0,fleeT:0,fuse:0,atk:.5,sh:1.5,ground:false})}
function rmMob(m){scene.remove(m.g);mobs.splice(mobs.indexOf(m),1)}
function updateHp(){const e=document.getElementById('hp');if(!e)return;const h=Math.max(0,Math.min(10,Math.ceil(hp/2)));e.innerHTML='<span class="hearts" aria-label="HP">'+Array.from({length:10},(_,i)=>'<span class="'+(i<h?'':'empty')+'">'+(i<h?'♥':'♡')+'</span>').join('')+'</span><span class="meats" aria-label="満腹度">'+Array.from({length:10},(_,i)=>'<span class="'+(i<hunger?'':'empty')+'">🍖</span>').join('')+'</span>'}
function hurt(d){const ar=[equipped.helmet,equipped.chest,equipped.legs,equipped.boots].filter(Boolean).reduce((a,id)=>a+ITEMS[id].damage,0);d=Math.max(1,Math.round(d*(1-Math.min(.7,ar/40))));hp-=d;if(hp<=0){toast('やられた！ リスポーンします');respawn();for(const m of mobs.slice())if(m.T.host)rmMob(m)}updateHp()}
function explode(m){const cx=Math.floor(m.x),cy=Math.floor(m.y+.5),cz=Math.floor(m.z),ch=new Set();
 for(let dx=-3;dx<=3;dx++)for(let dy=-3;dy<=3;dy++)for(let dz=-3;dz<=3;dz++){if(dx*dx+dy*dy+dz*dz>10)continue;
  const x=cx+dx,y=cy+dy,z=cz+dz;if(y<1||y>=H)continue;const v=getB(x,y,z);if(!v||v==10||FL[v&255])continue;
  const c=getC(x>>4,z>>4);if(!c)continue;const i=idx(x&15,y,z&15),k=ck(x>>4,z>>4);c.d[i]=0;
  let e=edits.get(k);if(!e)edits.set(k,e=new Map());e.set(i,0);ch.add(c)}
 const all=new Set();ch.forEach(c=>{for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const o=C.get(ck(c.cx+a,c.cz+b));if(o&&o.v)all.add(o)}});all.forEach(c=>mesh(c));
 const d=Math.hypot(P.x-m.x,P.y-m.y,P.z-m.z);if(d<6){let dmg=Math.round((6-d)*3);if(shieldUp&&shieldFaces(m.x,m.z)){dmg=Math.round(dmg*.2);shieldFlash=.25}if(dmg>0)hurt(dmg)}rmMob(m)}
function stepMob(m,dt){const T=m.T,dx=P.x-m.x,dz=P.z-m.z,dist=Math.hypot(dx,dz);let mv=0;m.t+=dt;
 if(T.host&&dist<20&&Math.abs(P.y-m.y)<8){m.yaw=Math.atan2(dx,dz);mv=T.sp;
  if(T.cr){if(dist<2.6){mv=0;if(!m.fuse)m.fuse=1.4}else if(dist>4.5)m.fuse=0}
  else if(T.rng){if(dist<5)mv=-T.sp*.8;else if(dist<11)mv=0;m.sh-=dt;if(m.sh<=0&&dist<17){m.sh=1.6+Math.random()*.8;shoot(m)}}
  else if(dist<1.2&&Math.abs(P.y-m.y)<1.7){mv=0;m.atk-=dt;if(m.atk<=0){m.atk=1;if(shieldUp&&shieldFaces(m.x,m.z)){shieldFlash=.15}else hurt(3)}}}
 else{m.turn-=dt;if(m.turn<=0){m.turn=2+Math.random()*4;m.go=Math.random()<.6;m.yaw=Math.random()*6.283}
  mv=m.fleeT>0?T.sp*2:m.go?T.sp*.6:0;m.fleeT-=dt}
 if(m.fuse>0){m.fuse-=dt;m.g.scale.setScalar(1+Math.sin(m.fuse*30)*.08);if(m.fuse<=0){explode(m);return}}
 const r=T.w/2,h=T.h,iw=isW(getB(Math.floor(m.x),Math.floor(m.y+.3),Math.floor(m.z)));
 if(iw)m.vy=Math.min(m.vy+30*dt,2.5);else m.vy-=26*dt;if(m.vy<-30)m.vy=-30;
 updFlow(m,Math.floor(m.x),[m.y+.3,m.y+.9],Math.floor(m.z),dt);const vx=Math.sin(m.yaw)*mv+m.kx+m.fx,vz=Math.cos(m.yaw)*mv+m.kz+m.fz;m.kx*=Math.max(0,1-5*dt);m.kz*=Math.max(0,1-5*dt);
 let bl=false;const nx=m.x+vx*dt;if(!hit(nx,m.y,m.z,r,h))m.x=nx;else bl=true;
 const nz=m.z+vz*dt;if(!hit(m.x,m.y,nz,r,h))m.z=nz;else bl=true;
 if(bl&&m.ground&&mv>0)m.vy=8.5;
 m.ground=false;const ny=m.y+m.vy*dt;if(!hit(m.x,ny,m.z,r,h))m.y=ny;else{if(m.vy<0){const impact=-m.vy;m.ground=true;if(slimeUnder(m.x,m.y,m.z,r))m.vy=impact*Math.SQRT1_2;else m.vy=0}else m.vy=0}
 if(m.y<1){rmMob(m);return}
 m.wp+=mv*dt*5;m.legs.forEach((l,i)=>l.rotation.x=mv?Math.sin(m.wp)*.8*((i==0||i==3)?1:-1):0);
 m.g.position.set(m.x,m.y,m.z);m.g.rotation.y=m.yaw}
function pickMob(){const o=cam.position;let best=null;
 for(const m of mobs){const vx=m.x-o.x,vy=m.y+m.T.h/2-o.y,vz=m.z-o.z,t=vx*rdir.x+vy*rdir.y+vz*rdir.z;if(t<0||t>4.5)continue;
  const d2=vx*vx+vy*vy+vz*vz-t*t,rr=Math.max(m.T.w,m.T.h*.6)/2+.1;if(d2<rr*rr&&(!best||t<best.t))best={m,t}}return best}
function attack(m){const wi=equipped.weapon,damage=wi?ITEMS[wi].damage:5;m.hp-=damage;m.kx=-Math.sin(P.yaw)*(wi?9:7);m.kz=-Math.cos(P.yaw)*(wi?9:7);m.vy=5;if(wi&&ITEMS[wi].dur>0)ITEMS[wi].dur--;if(!m.T.host){m.fleeT=3;m.yaw=P.yaw+Math.PI}if(m.hp<=0){const drops=m.T.drops||[];const mx=m.x,my=m.y+0.8,mz=m.z;rmMob(m);for(const d of drops){if(Math.random()<=d[2])spawnDrop(d[0],d[1]||1,mx,my,mz)}}}
function spawnMob(){if(mobs.length>=10)return;const a=Math.random()*6.283,d=22+Math.random()*22,x=Math.floor(P.x+Math.cos(a)*d),z=Math.floor(P.z+Math.sin(a)*d);
 if(Math.abs(x)>7990||Math.abs(z)>7990)return;const y=surfY(x,z);if(getB(x,y,z)||getB(x,y+1,z))return;const gb=getB(x,y-1,z);
 const host=Math.random()<.4;
 const monsterGround=(gb===1||NMS[gb]==='雪ブロック'||NMS[gb]==='草ブロック');
 // 敵MOBは夜（昼の10分が終わった後の10分間）だけスポーンする。
 // 昼・朝・夕方には敵を新しく出さず、動物MOBだけ通常どおりスポーンさせる。
 const phase=worldClock/TOTAL_CYCLE;
 const isNight=phase>=.5;
 if(host){if(!isNight)return;if(!monsterGround)return;if(mobs.filter(m=>m.T.host).length>=3)return;addMob(['zombie','creeper','skeleton'][Math.floor(Math.random()*3)],x+.5,y,z+.5)}
 else{if(gb!=1)return;addMob(['pig','cow','sheep','chicken'][Math.floor(Math.random()*4)],x+.5,y,z+.5)}}
let spT=-4,hpT=0;
function mobTick(dt){spT+=dt;if(spT>2){spT=0;spawnMob()}
 hpT+=dt;if(hpT>4&&hp<20){hp++;hpT=0;updateHp()}
 for(const m of mobs.slice()){if(Math.hypot(m.x-P.x,m.z-P.z)>60){rmMob(m);continue}stepMob(m,dt)}}
updateHp();
// ---- 矢 ----
const arrows=[],AG=new THREE.BoxGeometry(.05,.05,.7),AM=new THREE.MeshLambertMaterial({color:0x8a6a3a});
function shoot(m){const x=m.x,y=m.y+1.5,z=m.z,dx=P.x-x,dy=P.y+1.2-y,dz=P.z-z,d=Math.hypot(dx,dy,dz),t=d/18,r=()=>(Math.random()-.5)*1.2;
 const g=new THREE.Mesh(AG,AM);scene.add(g);arrows.push({g,x,y,z,vx:dx/t+r(),vy:dy/t+5*t+r(),vz:dz/t+r(),life:6})}
function arrowTick(dt){for(let i=arrows.length-1;i>=0;i--){const a=arrows[i];a.life-=dt;a.vy-=10*dt;a.x+=a.vx*dt;a.y+=a.vy*dt;a.z+=a.vz*dt;
 const bx0=Math.floor(a.x),by0=Math.floor(a.y),bz0=Math.floor(a.z),bv0=getB(bx0,by0,bz0);let dead=a.life<=0||solid(bv0);if(dead&&(bv0&255)===TARGET)targetHit(bx0,by0,bz0,a);if(!dead&&a.own)for(const m of mobs)if(Math.abs(m.x-a.x)<m.T.w/2+.25&&Math.abs(m.z-a.z)<m.T.w/2+.25&&a.y>m.y&&a.y<m.y+m.T.h){m.hp-=5;if(m.hp<=0)rmMob(m);dead=true;break}
 if(!dead&&!a.own&&Math.abs(a.x-P.x)<.45&&Math.abs(a.z-P.z)<.45&&a.y>P.y&&a.y<P.y+1.9){if(shieldUp&&shieldBlocks(a))shieldFlash=.15;else hurt(2+Math.round(Math.random()*2));dead=true}
 if(dead){scene.remove(a.g);arrows.splice(i,1);continue}
 a.g.position.set(a.x,a.y,a.z);a.g.lookAt(a.x+a.vx,a.y+a.vy,a.z+a.vz)}}
// ---- 雲（高度 y=100〜104・ゆっくり流れる） ----
const CLD={cs:12,y:100,h:4,R:22,ci:1e9,cj:1e9,m:null,off:0},cloudMat=new THREE.MeshBasicMaterial({color:0xffffff,vertexColors:true,transparent:true,opacity:.9,fog:false,depthWrite:false});
const cloudAt=(i,j)=>vn(i/3.5+21.7,j/3.5+9.3)>.54||hs(i*.7,j*1.3)>.985;
function buildClouds(ci,cj){const R=CLD.R,w=2*R+3,on=new Uint8Array(w*w),at=(i,j)=>on[(j+R+1)*w+(i+R+1)];
 for(let j=-R-1;j<=R+1;j++)for(let i=-R-1;i<=R+1;i++)on[(j+R+1)*w+(i+R+1)]=cloudAt(ci+i,cj+j)?1:0;
 const p=[],c=[],ix=[];let k=0;const cs=CLD.cs;
 const quad=(a,sh)=>{for(const q of a){p.push(q[0],q[1],q[2]);c.push(sh,sh,sh)}ix.push(k,k+1,k+2,k,k+2,k+3);k+=4};
 for(let j=-R;j<=R;j++)for(let i=-R;i<=R;i++){if(!at(i,j))continue;const x0=(ci+i)*cs,x1=x0+cs,z0=(cj+j)*cs,z1=z0+cs,y0=CLD.y,y1=y0+CLD.h;
  quad([[x0,y1,z0],[x0,y1,z1],[x1,y1,z1],[x1,y1,z0]],1);quad([[x0,y0,z1],[x0,y0,z0],[x1,y0,z0],[x1,y0,z1]],.72);
  if(!at(i+1,j))quad([[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]],.86);
  if(!at(i-1,j))quad([[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],[x0,y0,z0]],.86);
  if(!at(i,j+1))quad([[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],[x0,y0,z1]],.8);
  if(!at(i,j-1))quad([[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],[x1,y0,z0]],.8)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));g.setIndex(ix);
 if(CLD.m){scene.remove(CLD.m);CLD.m.geometry.dispose()}
 const m=new THREE.Mesh(g,cloudMat);m.position.x=CLD.off;m.frustumCulled=false;m.renderOrder=2;scene.add(m);CLD.m=m;m.visible=!uw}
function cloudTick(dt){CLD.off+=dt*1.5;const ci=Math.floor((P.x-CLD.off)/CLD.cs),cj=Math.floor(P.z/CLD.cs);
 if(!CLD.m||Math.abs(ci-CLD.ci)>5||Math.abs(cj-CLD.cj)>5){CLD.ci=ci;CLD.cj=cj;buildClouds(ci,cj)}else CLD.m.position.x=CLD.off}
