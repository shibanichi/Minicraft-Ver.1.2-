// ================= 流体（水・マグマ）：流れ・バケツ・反応・スポンジ =================
const FQ=[new Map(),new Map()],FIV=[.25,.5],FAC=[0,0],SPW=(k)=>k===0?WA:LA,FLW=(k)=>k===0?WF:LF;
function fluidDirty(x,y,z,old,nw){const near=FL[(old||0)&255]||FL[(nw||0)&255]||D6.some(([dx,dy,dz])=>FL[getB(x+dx,y+dy,z+dz)&255]);if(!near)return;
 for(const[dx,dy,dz]of[[0,0,0],...D6]){const p=[x+dx,y+dy,z+dz],k=rk(p[0],p[1],p[2]);FQ[0].set(k,p);FQ[1].set(k,p)}}
function fblocked(k,nv,nx,y,nz){const bv=getB(nx,y-1,nz);if(solid(bv))return true;return (nv&255)===SPW(k)&&FL[bv&255]===k+1}
function fdesired(k,x,y,z){
 // 水平流だけを計算する。落下判定はfluidCell側で行う。
 let best=0;
 for(let f=0;f<4;f++){
  const nx=x+D4[f][0],nz=z+D4[f][2],nv=getB(nx,y,nz),nb=nv&255;
  if(FL[nb]!==k+1||!fblocked(k,nv,nx,y,nz))continue;
  const s=nv>>8;
  const sup=(nb===SPW(k))?1:s+1;
  // 8/8の落下流は水平流の起点にしない。
  if(sup<=7&&(best===0||sup<best))best=sup;
 }
 return best;
}
function spongeAbsorb(x,y,z){const ch=[];for(let dx=-3;dx<=3;dx++)for(let dy=-3;dy<=3;dy++)for(let dz=-3;dz<=3;dz++){if(dx*dx+dy*dy+dz*dz>10)continue;if(FL[getB(x+dx,y+dy,z+dz)&255]===1)ch.push([x+dx,y+dy,z+dz,0])}
 if(!ch.length)return false;ch.push([x,y,z,WSPG]);applyChanges(ch);return true}
function lavaReact(x,y,z,v,ch){const src=(v&255)===LA;
 if(FL[getB(x,y-1,z)&255]===1){ch.push([x,y-1,z,3]);return true}                      // 真上から溶岩が水に触れる → 水が石に
 if(D4.some(([dx,,dz])=>FL[getB(x+dx,y,z+dz)&255]===1)||FL[getB(x,y+1,z)&255]===1){ch.push([x,y,z,src?18:8]);return true}   // 溶岩源→黒曜石 / 溶岩流→丸石
 return false}
function fluidCell(k,x,y,z,ch){
 const v=getB(x,y,z),bs=v&255,fk=FL[bs];
 if(fk&&fk!==k+1)return;
 if(fk===k+1){
  if(k===0)for(const[dx,dy,dz]of D6)if((getB(x+dx,y+dy,z+dz)&255)===SPG){spongeAbsorb(x+dx,y+dy,z+dz);return}
  if(k===1&&lavaReact(x,y,z,v,ch))return;
  // 水源・マグマ源は落下口にあっても消したり流れブロックへ変換しない。
  // まず1マス下へ「落下流」を作り、元の源はそのまま維持する。
  if(bs===SPW(k)){
   const below=getB(x,y-1,z);
   if((below&255)===0)ch.push([x,y-1,z,FLW(k)|(8<<8)]);
   return;
  }
  // すでに落下流になっている液体も、真下が空気ならそのまま保持して下へ進ませる。
  const below=getB(x,y-1,z);
  if((below&255)===0){
   if((v>>8)!==8)ch.push([x,y,z,FLW(k)|(8<<8)]);
   ch.push([x,y-1,z,FLW(k)|(8<<8)]);
   return;
  }
  const d=fdesired(k,x,y,z);
  if(d===0)ch.push([x,y,z,0]);
  else if(d!==(v>>8))ch.push([x,y,z,FLW(k)|(d<<8)]);
 }else if(v===0){
  // 空セルは真上の同じ液体からだけ落下流を生成する。
  // 1マス落下の境目で横流れと競合しないよう、落下を最優先する。
  const above=getB(x,y+1,z),ab=above&255;
  if(FL[ab]===k+1){
   ch.push([x,y,z,FLW(k)|(8<<8)]);
   return;
  }
  const d=fdesired(k,x,y,z);
  if(d>0)ch.push([x,y,z,FLW(k)|(d<<8)]);
 }}
function fluidTick(dt){for(let k=0;k<2;k++){FAC[k]+=dt;if(FAC[k]<FIV[k])continue;FAC[k]=FAC[k]>FIV[k]*2?0:FAC[k]-FIV[k];
  const cells=[...FQ[k].values()];FQ[k].clear();if(!cells.length)continue;
  const run=cells.slice(0,1800);for(const p of cells.slice(1800))FQ[k].set(rk(p[0],p[1],p[2]),p);
  const ch=[];for(const[x,y,z]of run)fluidCell(k,x,y,z,ch);if(ch.length)applyChanges(ch)}}
// ---- バケツ ----
function rayFluid(){const dir=rdir.set(0,0,-1).applyEuler(cam.rotation),o=cam.position;let prev=null;
 for(let t=0;t<5;t+=.04){const x=Math.floor(o.x+dir.x*t),y=Math.floor(o.y+dir.y*t),z=Math.floor(o.z+dir.z*t),v=getB(x,y,z);
  if(solid(v)||FL[v&255])return{x,y,z,v,prev};if(!prev||prev[0]!=x||prev[1]!=y||prev[2]!=z)prev=[x,y,z]}return null}
function rayPlaceBlock(){
 const dir=rdir.set(0,0,-1).applyEuler(cam.rotation),o=cam.position;
 let prev=null;
 for(let t=0;t<6;t+=.04){
  const x=Math.floor(o.x+dir.x*t),y=Math.floor(o.y+dir.y*t),z=Math.floor(o.z+dir.z*t),v=getB(x,y,z);
  if(solid(v))return{x,y,z,v,prev};
  if(!prev||prev[0]!==x||prev[1]!==y||prev[2]!==z)prev=[x,y,z];
 }
 return null;
}
function bucketUse(id){
 // ホットバーで選択中のバケツを「持っている」ものとして扱う。
 // 旧セーブやインベントリ表示とのIDずれで所持数だけ0になる場合でも、
 // バケツの操作自体が止まらないようにする。使用後は通常どおり所持数を更新する。
 if(!(invCount[id]>0)){
   if(hot[sel]===id){invCount[id]=1;draw();if(typeof refreshSaveInfo==='function')refreshSaveInfo();}
   else return;
 }
 // 空バケツは、視線の先の水源・マグマ源を直接すくう。
 if(id===I.bucket){
  const r=rayFluid();if(!r)return;
  const fk=FL[r.v&255];if(!fk)return;
  if((r.v&255)===WA||(r.v&255)===LA){
   setB(r.x,r.y,r.z,0);take(I.bucket,1);give(fk===1?I.waterBucket:I.lavaBucket,1);
   toast(fk===1?'水を汲んだ':'マグマを汲んだ');
  }else toast('流れている'+(fk===1?'水':'マグマ')+'は汲めません（水源・溶岩源のみ）');
  return;
 }
 // 水入り/マグマ入りバケツは、視線の先の「固体ブロック」に当たった面の1マス先へ源を設置する。
 const r=rayPlaceBlock();if(!r||!r.prev)return;
 const [px,py,pz]=r.prev;
 if(py<0||py>=H)return;
 const cv=getB(px,py,pz);
 // 空気または同じ液体以外の流体でない場所だけに設置。
 if(cv!==0 && !FL[cv&255]){toast('そこには置けません');return}
 const src=id===I.waterBucket?WA:LA;
 if((cv&255)===src){toast('そこはすでに液体の源です');return}
 // 別の流体がある場所への直接上書きは防ぐ。
 if(FL[cv&255] && (cv&255)!==src){toast('そこには置けません');return}
 setB(px,py,pz,src);
 take(id,1);give(I.bucket,1);
 toast(id===I.waterBucket?'水を置いた':'マグマを置いた');
}
function bucketImg(liq){const cv=document.createElement('canvas');cv.width=cv.height=16;const c=cv.getContext('2d'),im=c.createImageData(16,16),px=(x,y,col)=>{const i=(y*16+x)*4;im.data[i]=col[0];im.data[i+1]=col[1];im.data[i+2]=col[2];im.data[i+3]=255};
 const O=[70,70,76],M=[168,168,176],Lt=[205,205,212],Dk=[118,118,126];
 [[4,3],[4,2],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,2],[11,3]].forEach(([x,y])=>px(x,y,Dk));
 for(let y=4;y<=14;y++){const l=3+Math.floor((y-4)/4),r=12-Math.floor((y-4)/4);for(let x=l;x<=r;x++)px(x,y,(x===l||x===r||y===14)?O:y===4?Lt:x<l+2?Lt:x>r-2?Dk:M)}
 if(liq){const lc=liq==='w'?[[64,120,230],[120,170,255],[40,85,190]]:[[240,120,20],[255,210,70],[200,70,10]];
  for(let y=5;y<=7;y++){const l=4+Math.floor((y-4)/4),r=11-Math.floor((y-4)/4);for(let x=l;x<=r;x++)px(x,y,y===5?lc[1]:y===7?lc[2]:lc[0])}}
 c.putImageData(im,0,0);return cv.toDataURL()}
ITEMS[I.bucket].img=bucketImg(null);ITEMS[I.waterBucket].img=bucketImg('w');ITEMS[I.lavaBucket].img=bucketImg('l');ITEMS[I.shield].img=shieldImg();
function shieldImg(){const cv=document.createElement('canvas');cv.width=cv.height=16;const c=cv.getContext('2d'),im=c.createImageData(16,16),px=(x,y,col)=>{const i=(y*16+x)*4;im.data[i]=col[0];im.data[i+1]=col[1];im.data[i+2]=col[2];im.data[i+3]=255};
 const hw=y=>y<=10?6:y===11?5:y===12?4:y===13?3:y===14?2:1;
 for(let y=0;y<=15;y++){const w=hw(y);for(let x=8-w;x<8+w;x++){const l=x===8-w,r=x===7+w,edge=l||r||y===0||y===15||(y>=11&&(x===8-w+1&&false));
   let col=edge?(y===0||l?[132,134,146]:[84,86,96]):[164,120,64];
   if(!edge){if((x%3)===1)col=[146,106,54];if(y===4||y===5)col=[176,178,190];if(y===1)col=[190,150,86];
    const d=Math.hypot(x-7.5,y-8);if(d<2.4)col=d<1.4?[222,224,232]:[150,152,164]}
   px(x,y,col)}}
 c.putImageData(im,0,0);return cv.toDataURL()}
// ---- 流体メッシュ（水位に応じた高さ） ----
// ---- 流体メッシュ：1マス流れるごとに上面が1/8ブロックずつ下がる「斜面」（段差なし） ----
function fHt(v){const s=v>>8;return s>=8?1:s<=0?1:(8-s)/8}
function fCorner(g,k,x,y,z,i,j){let sum=0,n=0;for(let dx=i-1;dx<=i;dx++)for(let dz=j-1;dz<=j;dz++){const v=g(x+dx,y,z+dz);if(FL[v&255]!==k)continue;if(FL[g(x+dx,y+1,z+dz)&255]===k)return 1;sum+=fHt(v);n++}return n?sum/n:1}
function fluidFaces(S,g,x,y,z,b,bt){const k=FL[b&255],t0=bt[0],hc=[[fCorner(g,k,x,y,z,0,0),fCorner(g,k,x,y,z,0,1)],[fCorner(g,k,x,y,z,1,0),fCorner(g,k,x,y,z,1,1)]];
 for(const[d,cq,sh]of F){const nb=g(x+d[0],y+d[1],z+d[2]);
  if(d[1]>0){if(FL[nb&255]===k)continue}else if(d[1]<0){if(nb)continue}else if(FL[nb&255]===k||occl(nb))continue;
  const kk=k===2?1:sh;
  for(const q of cq){const py=q[1]?hc[q[0]][q[2]]:0;S.p.push(x+q[0],y+py,z+q[2]);S.c.push(kk,kk,kk);
   const[u,v]=uvOf(d,q[0],py,q[2]);S.u.push(((t0%CO)+(u?.99:.01))/CO,(RW-1-Math.floor(t0/CO)+(v?.99:.01))/RW)}
  S.i.push(S.n,S.n+1,S.n+2,S.n,S.n+2,S.n+3);S.n+=4}}
// ---- 流れ：上面が低くなる方向へ毎秒1ブロック。流れの端(これ以上低い液体がない所)で止まる ----
function flowVec(x,y,z){const v=getB(x,y,z),k=FL[v&255];if(!k)return null;
 if((v>>8)>=8&&!solid(getB(x,y-1,z)))return null;
 const h=fHt(v);let fx=0,fz=0;
 for(let f=0;f<4;f++){const nx=x+D4[f][0],nz=z+D4[f][2],nv=getB(nx,y,nz);let dh=0;
  if(FL[nv&255]===k){dh=FL[getB(nx,y+1,nz)&255]===k?0:h-fHt(nv)}
  else if(!solid(nv)&&FL[nv&255]===0){if(!solid(getB(nx,y-1,nz)))dh=h}
  if(dh>0){fx+=D4[f][0]*dh;fz+=D4[f][2]*dh}}   // 低い隣・段差の縁へだけ流す（行き止まりのマスは0＝端で止まる）
 const m=Math.hypot(fx,fz);return m>1e-6?[fx/m,fz/m]:[0,0]}
function updFlow(e,x,ys,z,dt){let t=null;for(const o of ys){const fv=flowVec(x,Math.floor(o),z);if(fv){t=fv;break}}
 const tx=t?t[0]:0,tz=t?t[1]:0,r=Math.min(1,6*dt);e.fx=(e.fx||0)+(tx-(e.fx||0))*r;e.fz=(e.fz||0)+(tz-(e.fz||0))*r}
