// ================= レッドストーン回路エンジン（10Hz = 0.1秒/tick） =================
const D6=[...D4,[0,1,0],[0,-1,0]];function rk(x,y,z){return x+','+y+','+z}
let DL=new Map(),EM=new Map(),rsAcc=0;const primed=[],anims=[],fxs=[];
function rsReg(x,y,z,old,nw){const k=rk(x,y,z);if(nw&&RSB.has(nw&255)){if(!RS.has(k))RS.set(k,{x,y,z})}else RS.delete(k)}
function scanRS(){edits.forEach((m,k)=>{const cx=Math.floor(k/1024)-512,cz=k%1024-512;m.forEach((v,i)=>{if(v&&RSB.has(v&255)){const x=cx*16+(i&15),z=cz*16+((i>>4)&15),y=i>>8;RS.set(rk(x,y,z),{x,y,z})}})})}
// セーブ復元は必要な状態・関数の宣言後に行う。読み込み失敗時は新規ワールドで開始。
loaded=load();
for(let i=0;i<hot.length;i++)if(hot[i]===22)hot[i]=1;
delete invCount[22]; blockLightDirty=true;
if(loaded){try{scanRS()}catch(e){console.warn('scanRS',e)}}else{respawn();give(4,12);give(8,24);give(I.stick,12);give(I.iron,8);give(I.diamond,4);give(I.redstone,16);give(1,16);give(3,16);give(I.shield,1)}
function applyChanges(ch){const sc=new Set();
 for(const[x,y,z,v]of ch){const cx=x>>4,cz=z>>4,c=getC(cx,cz);if(!c||y<0||y>=H)continue;const lx=x&15,lz=z&15,i=idx(lx,y,lz),old=c.d[i];if(old===v)continue;
  c.d[i]=v;blockLightDirty=true;if(typeof isLightSource==='function'&&(isLightSource(old)||isLightSource(v))){for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)lightMeshDirty.add(ck(cx+dx,cz+dz))}if(v&&y+1>c.top)c.top=y+1;let e=edits.get(ck(cx,cz));if(!e)edits.set(ck(cx,cz),e=new Map());e.set(i,v);rsReg(x,y,z,old,v);fluidDirty(x,y,z,old,v);sc.add(c);
  if(lx==0)sc.add(getC(cx-1,cz));if(lx==15)sc.add(getC(cx+1,cz));if(lz==0)sc.add(getC(cx,cz-1));if(lz==15)sc.add(getC(cx,cz+1))}
 sc.forEach(c=>{if(c&&c.v)mesh(c)})}
const contAt=(x,y,z)=>{const bs=getB(x,y,z)&255;if(!CONTB.has(bs))return null;const k=rk(x,y,z);return chests[k]||(chests[k]=Array(CONTB.get(bs)).fill(null))};
function contInsert(a,id,n){let left=n;for(const sl of a)if(sl&&sl[0]===id&&sl[1]<64&&left){const m=Math.min(64-sl[1],left);sl[1]+=m;left-=m}
 for(let i=0;i<a.length&&left;i++)if(!a[i]){const m=Math.min(64,left);a[i]=[id,m];left-=m}return left===0}
function contLevel(x,y,z){const bs=getB(x,y,z)&255;if(!CONTB.has(bs))return-1;const a=chests[rk(x,y,z)];if(!a)return 0;let sum=0,any=0;for(const sl of a)if(sl){any=1;sum+=sl[1]/64}return any?Math.floor(sum/a.length*14)+1:0}
function outAt(x,y,z,tx,tz){const v=getB(x,y,z),bs=v&255,s=v>>8,c=RS.get(rk(x,y,z));
 switch(bs){case RED_DUST:return DL.get(rk(x,y,z))||0;case RBLK:case RED_TORCH:return 15;case LEVER:return s&1?15:0;
  case STONE_BUTTON:return c&&c.tm>0?15:0;case PRESSURE:return c&&c.on?15:0;case TARGET:return c&&c.tm>0?c.lvl:0;
  case OBSERVER:{const f=s&3;return c&&c.pulse>0&&x-D4[f][0]===tx&&z-D4[f][2]===tz?15:0}
  case REPEATER:{const f=s&3;return(s&16)&&x+D4[f][0]===tx&&z+D4[f][2]===tz?15:0}
  case COMPARATOR:{const f=s&3;return c&&c.out>0&&x+D4[f][0]===tx&&z+D4[f][2]===tz?c.out:0}}return 0}
function cpow(x,y,z){let m=EM.get(rk(x,y,z))||0;for(const[dx,,dz]of D4){const l=DL.get(rk(x+dx,y,z+dz));if(l>m)m=l}const u=DL.get(rk(x,y+1,z));return u>m?u:m}
const standing=(x,y,z)=>{const t=(px,py,pz)=>Math.floor(px)===x&&Math.floor(pz)===z&&py>=y-.1&&py<y+.5;return t(P.x,P.y,P.z)||mobs.some(m=>t(m.x,m.y,m.z))};
function sideLvl(x,y,z,tx,tz){const bs=getB(x,y,z)&255;return(bs===RED_DUST||bs===REPEATER||bs===COMPARATOR||bs===RBLK)?outAt(x,y,z,tx,tz):0}
function targetHit(x,y,z,a){const c=RS.get(rk(x,y,z));if(!c)return;const o=[a.x-x-.5,a.y-y-.5,a.z-z-.5].map(Math.abs).sort((p,q)=>q-p);c.lvl=Math.max(1,15-Math.floor(Math.max(o[1],o[2])*2*15));c.tm=10}
function shootArrow(x,y,z,vx,vy,vz){const g=new THREE.Mesh(AG,AM);scene.add(g);arrows.push({g,x,y,z,vx,vy,vz,life:6,own:true})}
function fireCont(c){const arr=contAt(c.x,c.y,c.z);if(!arr)return;const f=c.s&3,dr=D4[f],i=arr.findIndex(Boolean);if(i<0)return;const sl=arr[i],id=sl[0],fx=c.x+.5+dr[0]*.6,fz=c.z+.5+dr[2]*.6,fy=c.y+.5;
 if(c.bs===DROPPER){const tg=contAt(c.x+dr[0],c.y,c.z+dr[2]);if(tg){if(!contInsert(tg,id,1))return}else spawnDrop(id,1,fx,fy,fz,dr[0]*1.5,dr[2]*1.5,1.2)}
 else{if(id===I.arrow)shootArrow(fx,fy,fz,dr[0]*22,2,dr[2]*22);else spawnDrop(id,1,fx,fy,fz,dr[0]*7,dr[2]*7,2.5)}
 sl[1]--;if(sl[1]<=0)arr[i]=null}
function hopperStep(c){const arr=contAt(c.x,c.y,c.z),f=c.s===0?5:c.s-1,dr=f===5?D6[5]:D4[f];if(!arr)return;
 const tg=contAt(c.x+dr[0],c.y+dr[1],c.z+dr[2]);
 for(let i=0;i<arr.length;i++){const sl=arr[i];if(sl&&tg&&contInsert(tg,sl[0],1)){sl[1]--;if(sl[1]<=0)arr[i]=null;break}}
 const up=contAt(c.x,c.y+1,c.z);
 if(up){for(let i=0;i<up.length;i++){const sl=up[i];if(sl&&contInsert(arr,sl[0],1)){sl[1]--;if(sl[1]<=0)up[i]=null;return}}}
 else for(let i=droppedItems.length-1;i>=0;i--){const d=droppedItems[i];if(Math.abs(d.x-c.x-.5)<.6&&Math.abs(d.z-c.z-.5)<.6&&d.y>c.y+.5&&d.y<c.y+3.2&&contInsert(arr,d.id,1)){d.n--;if(d.n<=0){scene.remove(d.g);droppedItems.splice(i,1)}return}}}
// ---- ピストン ----
const IMM=v=>{const bs=v&255;return bs===10||bs===18||bs===PHEAD||CONTB.has(bs)||((bs===PISTON||bs===STICKY_PISTON)&&((v>>8)&8))};
const PLG=new THREE.BoxGeometry(1,1,.25),SHG=new THREE.BoxGeometry(.25,.25,1),mOch=new THREE.MeshLambertMaterial({color:0xb8924a}),mGrn=new THREE.MeshLambertMaterial({color:0x7cc46a}),mWd=new THREE.MeshLambertMaterial({color:0x9c7a45});
function pistonTick(c,want){const s=c.s,f=s&7,ext=!!(s&8);if(c.busy)return;const D=f<4?D4[f]:D6[f];
 if(want&&!ext){const line=[];let x=c.x+D[0],y=c.y+D[1],z=c.z+D[2];
  for(let i=0;i<14;i++){const v=getB(x,y,z);if(!v||FL[v&255])break;if(IMM(v)||y<=0||y>=H-1)return;line.push([x,y,z,v]);if(line.length>12)return;x+=D[0];y+=D[1];z+=D[2]}
  if(y<1||y>=H)return;startAnim(c,'ext',D,line)}
 else if(!want&&ext)startAnim(c,'ret',D,null)}
function startAnim(c,type,D,line){c.busy=true;const g=new THREE.Group(),pl=new THREE.Mesh(PLG,(c.bs===STICKY_PISTON)?mGrn:mOch),sh=new THREE.Mesh(SHG,mWd);g.add(pl,sh);g.position.set(c.x+.5,c.y+.5,c.z+.5);g.lookAt(new THREE.Vector3(c.x+.5+D[0],c.y+.5+D[1],c.z+.5+D[2]));scene.add(g);anims.push({c,type,D,line,t:0,g,pl,sh})}
function pushEnt(cells,D){for(const[cx,cy,cz]of cells){const inC=(x,y,z)=>Math.floor(x)===cx&&Math.floor(z)===cz&&y>cy-1&&y<cy+1;
  if(inC(P.x,P.y,P.z)){P.x+=D[0];P.y+=D[1];P.z+=D[2]}for(const m of mobs)if(inC(m.x,m.y,m.z)){m.x+=D[0];m.y+=D[1];m.z+=D[2]}}}
function animTick(dt){for(let i=anims.length-1;i>=0;i--){const a=anims[i];a.t+=dt;const p=Math.min(1,a.t/.1),q=a.type==='ext'?p:1-p;
  a.pl.position.z=.375+q;a.sh.position.z=.25+q/2;a.sh.scale.z=Math.max(q,.001);
  if(a.t<.1)continue;const c=a.c,s=c.s,f=s&7,D=a.D,sticky=c.bs===STICKY_PISTON,fin=new Map(),put=(x,y,z,v)=>fin.set(rk(x,y,z),[x,y,z,v]);
  const fx=c.x+D[0],fy=c.y+D[1],fz=c.z+D[2];
  if(a.type==='ext'){for(const[x,y,z]of a.line)put(x,y,z,0);for(const[x,y,z,v]of a.line)put(x+D[0],y+D[1],z+D[2],v);
   put(fx,fy,fz,PHEAD|((f|(sticky?8:0))<<8));put(c.x,c.y,c.z,c.bs|((f|8)<<8));
   pushEnt([[fx,fy,fz],...a.line.map(([x,y,z])=>[x+D[0],y+D[1],z+D[2]])],D)}
  else{put(c.x,c.y,c.z,c.bs|((f&7)<<8));put(fx,fy,fz,0);
   if(sticky){const bx=fx+D[0],by=fy+D[1],bz=fz+D[2],v=getB(bx,by,bz);if(v&&!FL[v&255]&&!IMM(v)){put(bx,by,bz,0);put(fx,fy,fz,v)}}}
  applyChanges([...fin.values()]);c.busy=false;scene.remove(a.g);anims.splice(i,1)}}
// ---- TNT ----
const TNTG=new THREE.BoxGeometry(1,1,1),TBG=new THREE.BoxGeometry(1.01,.3,1.01),tMatR=new THREE.MeshLambertMaterial({color:0xc83020}),tMatW=new THREE.MeshLambertMaterial({color:0xffffff,emissive:0xffffff}),tMatB=new THREE.MeshLambertMaterial({color:0xe8e8e8});
function spawnPrimed(x,y,z,fuse){const g=new THREE.Group(),m=new THREE.Mesh(TNTG,tMatR),b=new THREE.Mesh(TBG,tMatB);m.position.y=.5;b.position.y=.5;g.add(m,b);g.position.set(x,y,z);scene.add(g);primed.push({g,m,b,x,y,z,t:fuse,vy:3.5})}
function ignite(x,y,z,fuse){applyChanges([[x,y,z,0]]);spawnPrimed(x+.5,y,z+.5,fuse)}
const FXG=new THREE.SphereGeometry(1,10,8);
function blast(cx,cy,cz){const R=4,ch=[],tn=[],bx=Math.floor(cx),by=Math.floor(cy),bz=Math.floor(cz);
 for(let dx=-R;dx<=R;dx++)for(let dy=-R;dy<=R;dy++)for(let dz=-R;dz<=R;dz++){const d=Math.hypot(dx,dy,dz);if(d>R+.3)continue;const x=bx+dx,y=by+dy,z=bz+dz;if(y<1||y>=H)continue;
  const v=getB(x,y,z),bs=v&255;if(!v||bs===10||bs===18)continue;if(d>2.6&&hh(x,z,y+7)>.72)continue;
  if(bs===TNTB){tn.push([x,y,z]);ch.push([x,y,z,0]);continue}
  if(CONTB.has(bs)){const a=chests[rk(x,y,z)];if(a){for(const sl of a)if(sl)spawnDrop(sl[0],sl[1],x+.5,y+.5,z+.5);delete chests[rk(x,y,z)]}}
  ch.push([x,y,z,0])}
 applyChanges(ch);for(const[x,y,z]of tn)spawnPrimed(x+.5,y,z+.5,.4+Math.random()*.6);
 for(const p of primed)if(Math.hypot(p.x-cx,p.y-cy,p.z-cz)<R+1)p.t=Math.min(p.t,.4+Math.random()*.5);
 const pd=Math.hypot(P.x-cx,P.y+.9-cy,P.z-cz);if(pd<7)hurt(Math.max(1,Math.round((7-pd)*3)));
 for(const m of mobs.slice()){const d=Math.hypot(m.x-cx,m.y+.9-cy,m.z-cz);if(d<7){m.hp-=Math.round((7-d)*3);m.kx=(m.x-cx)/(d+.1)*8;m.kz=(m.z-cz)/(d+.1)*8;m.vy=5;if(m.hp<=0)rmMob(m)}}
 const g=new THREE.Mesh(FXG,new THREE.MeshBasicMaterial({color:0xfff2c0,transparent:true,opacity:.8}));g.position.set(cx,cy,cz);scene.add(g);fxs.push({g,t:0})}
function primedTick(dt){for(let i=primed.length-1;i>=0;i--){const p=primed[i];p.t-=dt;
  const fl=Math.floor(p.t*(p.t<1?8:4))%2===0;p.m.material=fl?tMatW:tMatR;p.b.material=fl?tMatW:tMatB;p.g.scale.setScalar(fl?1.06:1);
  p.vy-=12*dt;const ny=p.y+p.vy*dt;if(p.vy<0&&solid(getB(Math.floor(p.x),Math.floor(ny),Math.floor(p.z)))){p.y=Math.floor(ny)+1;p.vy=0}else p.y=ny;
  p.g.position.set(p.x,p.y,p.z);if(p.t<=0){scene.remove(p.g);primed.splice(i,1);blast(p.x,p.y+.5,p.z)}}
 for(let i=fxs.length-1;i>=0;i--){const f=fxs[i];f.t+=dt;f.g.scale.setScalar(.5+f.t*12);f.g.material.opacity=Math.max(0,.8-f.t*2.4);if(f.t>.35){scene.remove(f.g);fxs.splice(i,1)}}}
// ---- メインtick ----
function rsTick(){const list=[];
 RS.forEach((c,k)=>{if(Math.abs(c.x-P.x)>56||Math.abs(c.z-P.z)>56)return;const v=getB(c.x,c.y,c.z);if(!RSB.has(v&255)){RS.delete(k);return}c.v=v;c.bs=v&255;c.s=v>>8;list.push(c)});
 EM=new Map();const E=(x,y,z,l)=>{const k=rk(x,y,z);if((EM.get(k)||0)<l)EM.set(k,l)},adj=(c,l)=>{for(const[dx,dy,dz]of D6)E(c.x+dx,c.y+dy,c.z+dz,l)};
 for(const c of list){const bs=c.bs,s=c.s;
  if((bs===STONE_BUTTON||bs===TARGET)&&c.tm>0)c.tm--;if(bs===OBSERVER&&c.pulse>0)c.pulse--;if(bs===PRESSURE)c.on=standing(c.x,c.y,c.z);
  switch(bs){case RBLK:case RED_TORCH:adj(c,15);break;case LEVER:if(s&1)adj(c,15);break;case STONE_BUTTON:if(c.tm>0)adj(c,15);break;case PRESSURE:if(c.on)adj(c,15);break;case TARGET:if(c.tm>0)adj(c,c.lvl);break;
   case OBSERVER:if(c.pulse>0){const f=s&3;E(c.x-D4[f][0],c.y,c.z-D4[f][2],15)}break;
   case REPEATER:if(s&16){const f=s&3;E(c.x+D4[f][0],c.y,c.z+D4[f][2],15)}break;
   case COMPARATOR:if(c.out>0){const f=s&3;E(c.x+D4[f][0],c.y,c.z+D4[f][2],c.out)}break}}
 const dust=list.filter(c=>c.bs===RED_DUST),nd=new Map();for(const c of dust)nd.set(rk(c.x,c.y,c.z),EM.get(rk(c.x,c.y,c.z))||0);
 for(let it=0;it<16;it++){let chg=false;for(const c of dust){const l=nd.get(rk(c.x,c.y,c.z));if(l<=1)continue;for(const[dx,,dz]of D4){const kk=rk(c.x+dx,c.y,c.z+dz);if(nd.has(kk)&&nd.get(kk)<l-1){nd.set(kk,l-1);chg=true}}}if(!chg)break}
 DL=nd;const ch=[];
 for(const c of dust){const l=nd.get(rk(c.x,c.y,c.z));if(l!==c.s)ch.push([c.x,c.y,c.z,RED_DUST|(l<<8)])}
 for(const c of list){const x=c.x,y=c.y,z=c.z,s=c.s;
  switch(c.bs){
   case RED_LAMP:{const on=cpow(x,y,z)>0;if(on!==!!(s&1))ch.push([x,y,z,on?RED_LAMP|256:RED_LAMP])}break;
   case TNTB:if(cpow(x,y,z)>0)ignite(x,y,z,4);break;
   case REPEATER:{const f=s&3,d=((s>>2)&3)+1,want=outAt(x-D4[f][0],y,z-D4[f][2],x,z)>0;if(c.on===undefined)c.on=!!(s&16);
    if(want!==c.on){if(c.pv===want){if(--c.tm<=0){c.on=want;c.pv=undefined;ch.push([x,y,z,REPEATER|(((s&~16)|(want?16:0))<<8)])}}else{c.pv=want;c.tm=d}}else c.pv=undefined;break}
   case COMPARATOR:{const f=s&3,bx=x-D4[f][0],bz=z-D4[f][2];let B=contLevel(bx,y,bz);if(B<0)B=outAt(bx,y,bz,x,z);
    const A=Math.max(sideLvl(x+D4[(f+1)&3][0],y,z+D4[(f+1)&3][2],x,z),sideLvl(x+D4[(f+3)&3][0],y,z+D4[(f+3)&3][2],x,z));
    c.out=(s&4)?Math.max(B-A,0):(A>B?0:B);break}
   case OBSERVER:{const f=s&3,cur=getB(x+D4[f][0],y,z+D4[f][2]);if(c.last===undefined)c.last=cur;else if(cur!==c.last){c.last=cur;c.pulse=2}break}
   case PISTON:case STICKY_PISTON:pistonTick(c,cpow(x,y,z)>0);break;
   case DISPENSER:case DROPPER:{const p=cpow(x,y,z)>0;if(p&&!c.pw)fireCont(c);c.pw=p;break}
   case HOPPER:c.ht=(c.ht||0)+1;if(c.ht>=4){c.ht=0;hopperStep(c)}break}}
 if(ch.length)applyChanges(ch);circuitOn=EM.size>0}
function circuitTick(dt){fluidTick(dt);rsAcc+=dt;let n=0;while(rsAcc>=.1&&n<3){rsAcc-=.1;n++;rsTick()}if(rsAcc>.3)rsAcc=0;primedTick(dt);animTick(dt)}
function breakRS(x,y,z,v){const bs=v&255;
 if(CONTB.has(bs)){const k=rk(x,y,z),a=chests[k];if(a)for(const sl of a)if(sl)spawnDrop(sl[0],sl[1],x+.5,y+.7,z+.5);delete chests[k];give(bs,1)}
 else if(bs===RED_DUST)give(I.redstone,1);
 else if(bs===PHEAD){const f=(v>>8)&7,D=f<4?D4[f]:D6[f],bx=x-D[0],by=y-D[1],bz=z-D[2],bv=getB(bx,by,bz);if(((bv&255)===PISTON||(bv&255)===STICKY_PISTON)&&((bv>>8)&8))applyChanges([[bx,by,bz,(bv&255)|(((bv>>8)&7)<<8)]])}
 else give(bs,1)}
function rsPlace(base,pf,a,b,c,x,y,z){
 if(base===REPEATER||base===COMPARATOR)return base|(pf<<8);
 if(base===OBSERVER||base===DISPENSER||base===DROPPER)return base|(((pf+2)&3)<<8);
 if(base===PISTON||base===STICKY_PISTON){const pt=P.pitch;return base|((pt<-.9?4:pt>.9?5:((pf+2)&3))<<8)}
 if(base===HOPPER){if(b!==y)return base;const dx=x-a,dz=z-c;return base|((1+(dz<0?0:dx>0?1:dz>0?2:3))<<8)}
 return base}
function rsUse(tv,x,y,z){const bs=tv&255,s=tv>>8;
 if(bs===REPEATER){const d=(((s>>2)&3)+1)&3;setB(x,y,z,REPEATER|(((s&~12)|(d<<2))<<8));toast('リピーターの遅延 '+((d+1)/10).toFixed(1)+'秒');return true}
 if(bs===COMPARATOR){const m=(s&4)?0:1;setB(x,y,z,COMPARATOR|(((s&~4)|(m?4:0))<<8));toast(m?'コンパレーター：減算モード':'コンパレーター：比較モード');return true}
 if(bs===STONE_BUTTON){const c=RS.get(rk(x,y,z));if(c)c.tm=10;toast('ボタンを押した（1秒間 信号ON）');return true}
 return false}
