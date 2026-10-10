// ---- world ----
const C=new Map(),edits=new Map(),ck=(a,b)=>(a+512)*1024+(b+512);
const hAt=(x,z)=>Math.floor(26+(vn(x/220,z/220)-.5)*40+vn(x/70,z/70)*18+vn(x/22,z/22)*6+vn(x/7,z/7)*2);
function ore(x,y,z){const r=hs(x*1.7+y*7.3,z*2.9+y*3.1);
 if(y<7&&r<.012)return 14;if(y<9&&r<.025)return 13;if(r<.045)return 12;if(r<.08)return 11;if(hs(x*5.1+z*.7,y*2.3+z*4.9)<.03)return 15;return 3}
const cave=(x,y,z)=>{const a=vn3(x/22,y/14,z/22)-.5;if(a*a>.012)return false;const c=vn3(x/22+99,y/14+41,z/22+17)-.5;return a*a+c*c<.012};
// ---- バイオーム ----
const BI={PLAINS:0,FOREST:1,SAVANNA:2,COAST:3,SNOW:4};
const BID={
 spruceLog:nmid('トウヒの原木'),spruceLeaf:nmid('トウヒの葉'),
 birchLog:nmid('シラカバの原木'),birchLeaf:nmid('シラカバの葉'),
 acaciaLog:nmid('アカシアの原木'),acaciaLeaf:nmid('アカシアの葉'),
 snow:nmid('雪ブロック')
};
function biomeAt(x,z,h){
 const a=vn(x/150,z/150), b=vn(x/55+31,z/55+17);
 // 5種類だけ。海面付近を海岸、それ以外を大きめの自然な領域にする。
 if(h===undefined)h=hAt(x,z);
 if(h<=SL+2)return BI.COAST;
 if(a<.20)return BI.SAVANNA;
 if(a>.82)return BI.SNOW;
 if(b>.52)return BI.FOREST;
 return BI.PLAINS;
}
function biomeTree(x,z){
 const cX=Math.floor(x/4),cZ=Math.floor(z/4);
 if(x!==cX*4+Math.floor(hs(cX*19.17+7,cZ*31.73+11)*4)||z!==cZ*4+Math.floor(hs(cX*43.71+17,cZ*13.29+23)*4))return null;
 const r=hs(cX*71.13+5,cZ*37.91+9);if(r>.34)return null;
 const b=biomeAt(x,z);if(b===BI.COAST)return null;
 if(r>(b===BI.FOREST?.34:b===BI.SAVANNA?.18:b===BI.SNOW?.16:.10))return null;
 return b===BI.SAVANNA?['acacia',BID.acaciaLog,BID.acaciaLeaf]:b===BI.SNOW?['spruce',BID.spruceLog,BID.spruceLeaf]:['oak',4,5]}
// Lighting cache must exist before initial world/chunk generation.
let blockLightCache=new Map(),blockLightDirty=true,lightSystemReady=false;const lightMeshDirty=new Set();
function genChunk(cx,cz){
 const d=new Uint16Array(256*H),X0=cx*16,Z0=cz*16;let top=1;
 for(let lz=0;lz<16;lz++)for(let lx=0;lx<16;lx++){
  const x=X0+lx,z=Z0+lz,h=hAt(x,z),sd=h<=SL+1,m=Math.max(h,SL),bio=biomeAt(x,z,h);
  for(let y=0;y<=m;y++){
   let surface=sd?6:1,fill=sd?16:2;
   if(!sd){
    if(bio===BI.COAST){surface=6;fill=16}
    else if(bio===BI.SNOW){surface=BID.snow;fill=2}
   }
   let b=y>h?WA:y==h?surface:y>h-4?fill:ore(x,y,z);
   if(y>4&&y<h&&cave(x,y,z))b=y<=11?LA:0;
   d[lx+16*(lz+16*y)]=b}
  d[lx+16*lz]=10;
  for(let y=1;y<5;y++)if(hs(x*3.1+y,z*2.7+y*5)<.8-y*.2)d[lx+16*(lz+16*y)]=10;
  if(m+1>top)top=m+1}
 const set=(x,y,z,b,soft)=>{const lx=x-X0,lz=z-Z0;if(lx<0||lz<0||lx>15||lz>15)return;const i=idx(lx,y,lz);if(soft&&d[i])return;d[i]=b;if(y+1>top)top=y+1};
 for(let tz=Z0-1;tz<Z0+17;tz++)for(let tx=X0-1;tx<X0+17;tx++){
  const tr=biomeTree(tx,tz);if(!tr)continue;
  const h=hAt(tx,tz),bio=biomeAt(tx,tz);if(h<=SL+2||h>H-10)continue;
  // 海岸・急斜面・砂漠には木を置かず、陸地のまとまりにだけ生成する。
  if(bio===BI.COAST||h<=SL+3)continue;
  const kind=tr[0],log=tr[1],leaf=tr[2];
  const tall=kind==='spruce'?6:kind==='acacia'?5:4;
  for(let y=1;y<=tall;y++)set(tx,h+y,tz,log);
  if(kind==='acacia'){
   // アカシアは横に広がった樹冠にし、最上部まで葉で覆って上から幹が見えないようにする。
   for(let dy=3;dy<=6;dy++){
    const rad=dy===3?1:dy===4?3:dy===5?3:2;
    for(let dx=-rad;dx<=rad;dx++)for(let dz=-rad;dz<=rad;dz++){
     const edge=Math.abs(dx)+Math.abs(dz);
     const wobble=hs((tx+dx)*5.7+dy*11,(tz+dz)*4.3-dy*7);
     const limit=dy===6?3:dy===5?4:dy===4?4:2;
     if(edge<=limit && wobble>.08)set(tx+dx,h+dy,tz+dz,leaf,false);
    }
   }
  }else if(kind==='spruce'){
   for(let dy=2;dy<=tall+1;dy++){const rad=Math.max(0,Math.min(2,Math.floor((tall+1-dy)/2)+1));for(let dx=-rad;dx<=rad;dx++)for(let dz=-rad;dz<=rad;dz++)if(Math.abs(dx)+Math.abs(dz)<=rad+1)set(tx+dx,h+dy,tz+dz,leaf,true)}
  }else if(kind==='jungle'){
   for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=4;dy<=7;dy++)if(Math.abs(dx)+Math.abs(dz)+(dy-4)*.45<4.2)set(tx+dx,h+dy,tz+dz,leaf,true);
  }else{
   // オーク/シラカバ：円形ではなく少し崩した自然な樹冠。
   for(let dy=tall-2;dy<=tall+1;dy++){
    const rad=dy===tall+1?1:dy===tall?2:2;
    for(let dx=-rad;dx<=rad;dx++)for(let dz=-rad;dz<=rad;dz++){
     const edge=Math.abs(dx)+Math.abs(dz);
     const wobble=hs((tx+dx)*4.1+dy*7,(tz+dz)*3.7-dy*5);
     if(edge<=rad+(wobble>.72?1:0) && !(Math.abs(dx)===rad&&Math.abs(dz)===rad&&wobble<.55))set(tx+dx,h+dy,tz+dz,leaf,true);
    }
   }
  }}
 const key=ck(cx,cz),e=edits.get(key);
 if(e)e.forEach((b,i)=>{d[i]=b;const y=(i>>8);if(b&&y+1>top)top=y+1});
 return{d,top,cx,cz,v:false,m:null,wm:null}}
function getC(cx,cz){if(cx<-LIM||cx>=LIM||cz<-LIM||cz>=LIM)return null;const k=ck(cx,cz);let c=C.get(k);if(!c){c=genChunk(cx,cz);C.set(k,c);try{blockLightDirty=true}catch(_e){}}return c}
let _ck=-1,_cc=null;
function getB(x,y,z){if(y<0)return 10;if(y>=H)return 0;const cx=x>>4,cz=z>>4,k=ck(cx,cz);let c;if(k===_ck)c=_cc;else{c=getC(cx,cz);_ck=k;_cc=c}return c?c.d[idx(x&15,y,z&15)]:10}
const solid=b=>b&&!FL[b&255];
function drop(c){for(const m of[c.m,c.wm,c.gm])if(m){scene.remove(m);m.geometry.dispose()}c.m=c.wm=c.gm=null}

const FULL=[[0,0,0,1,1,1]],HEADB=[[0,0,.75,1,1,1],[.375,.375,0,.625,.625,.75]];
function orient(L,f){return L.map(([x0,y0,z0,x1,y1,z1])=>f==2?[x0,y0,z0,x1,y1,z1]:f==0?[1-x1,y0,1-z1,1-x0,y1,1-z0]:f==1?[z0,y0,1-x1,z1,y1,1-x0]:f==3?[1-z1,y0,x0,1-z0,y1,x1]:f==4?[x0,z0,1-y1,x1,z1,1-y0]:[x0,1-z1,y0,x1,1-z0,y1])}
function dustConn(n,f){const bs=n&255;if(bs===RED_DUST||bs===RED_TORCH||bs===LEVER||bs===STONE_BUTTON||bs===PRESSURE||bs===RBLK||bs===TARGET)return true;
 if(bs===REPEATER||bs===COMPARATOR||bs===OBSERVER)return((n>>8)&1)===(f&1)||(((n>>8)&3)&1)===(f&1);return false}
function dustBoxes(x,y,z){const l=[0,0,0,0];for(let f=0;f<4;f++)l[f]=dustConn(getB(x+D4[f][0],y,z+D4[f][2]),f)?1:0;
 const ax=l[1]||l[3],az=l[0]||l[2];if(ax&&!az)l[1]=l[3]=1;else if(az&&!ax)l[0]=l[2]=1;
 const o=[[.375,0,.375,.625,.0625,.625]];if(l[1])o.push([.625,0,.4375,1,.0625,.5625]);if(l[3])o.push([0,0,.4375,.375,.0625,.5625]);if(l[2])o.push([.4375,0,.625,.5625,.0625,1]);if(l[0])o.push([.4375,0,0,.5625,.0625,.375]);return o}
function hopBoxes(s){const f=s-1,sp=s===0?[.375,0,.375,.625,.25,.625]:f==0?[.375,.25,0,.625,.5,.25]:f==1?[.75,.25,.375,1,.5,.625]:f==2?[.375,.25,.75,.625,.5,1]:[0,.25,.375,.25,.5,.625];return[[0,.625,0,1,1,1],[.25,.25,.25,.75,.625,.75],sp]}
const D4=[[0,0,-1],[1,0,0],[0,0,1],[-1,0,0]];
function boxes(v,x,y,z,rd){const s=v>>8,bs=v&255;
 if(THIN[bs]){const t=THIN[bs];if(t===4)return s?LEVON:LEVOFF;if(bs===RED_DUST)return dustBoxes(x,y,z);if(bs===HOPPER)return hopBoxes(s);return THINB[t]}
 if(RSF[bs]){if(bs===PISTON||bs===STICKY_PISTON)return(s&8)?orient([[0,0,0,1,1,.75]],s&7):FULL;if(bs===PHEAD)return orient(HEADB,s&7);return FULL}
 if(AXB[bs])return FULL;
 if(!s)return FULL;
 if(s>=29&&s<=32)return CHESTB;
 if(s<9){const f=(s-1)&3,top=(s-1)>>2,y0=top?0:.5,y1=top?.5:1;
  return[top?[0,.5,0,1,1,1]:[0,0,0,1,.5,1],f==0?[0,y0,0,1,y1,.5]:f==1?[.5,y0,0,1,y1,1]:f==2?[0,y0,.5,1,y1,1]:[0,y0,0,.5,y1,1]]}
 if(s<11)return[s==9?[0,0,0,1,.5,1]:[0,.5,0,1,1,1]];
 if(s<13){const w=s==12,a=w?.25:.375,b=1-a,ph=rd?1:1.5,ah=rd?.875:1.5,t=w?.3125:.4375,u=1-t,o=[[a,0,a,b,ph,b]];
  const k=(dx,dz)=>{const n=getB(x+dx,y,z+dz);return n&&((n>>8)==11||(n>>8)==12||(n<256&&solid(n)&&!TR.has(n)))};
  const arm=(x0,z0,x1,z1)=>{if(rd&&!w){o.push([x0,.375,z0,x1,.5625,z1],[x0,.75,z0,x1,.9375,z1])}else o.push([x0,0,z0,x1,ah,z1])};
  if(k(1,0))arm(b,t,1,u);if(k(-1,0))arm(0,t,a,u);if(k(0,1))arm(t,b,u,1);if(k(0,-1))arm(t,0,u,a);return o}
 const t=s-13,f=t&3,op=(t>>2)&1,top=(t>>3)&1;
 if(!op)return[top?[0,.8125,0,1,1,1]:[0,0,0,1,.1875,1]];
 return[f==0?[0,0,0,1,1,.1875]:f==1?[.8125,0,0,1,1,1]:f==2?[0,0,.8125,1,1,1]:[0,0,0,.1875,1,1]]}
// 面ごとのUV: 側面は外から見て左→右にu、下→上にv。上面は北(-z)が画面の上。
function uvOf(d,px,py,pz){return d[1]>0?[px,1-pz]:d[1]<0?[px,pz]:d[0]>0?[1-pz,py]:d[0]<0?[pz,py]:d[2]>0?[px,py]:[1-px,py]}
// 丸太などの「軸ブロック」：置いた面(壁)の向きに合わせて回転する
const AXB=new Uint8Array(256);for(const k in NMS){const n=NMS[k];if(n.endsWith('の原木')||n.endsWith('幹')||n==='竹ブロック'||n==='干し草の俵'||n==='骨ブロック')AXB[k]=1}AXB[4]=1;
for(let i=1;i<256;i++)if(AXB[i])FULLO.add(i);
const di=d=>d[2]<0?0:d[0]>0?1:d[2]>0?2:d[0]<0?3:d[1]>0?4:5;
function occl(nb){return nb&&!FL[nb&255]&&!TR.has(nb)&&!THIN[nb&255]&&(nb<256?(!RSF[nb]||FULLO.has(nb)):FULLO.has(nb&255))}
function pickTile(v,d,bt,alt){const bs=v&255,s=v>>8,k=di(d);if(alt)return bt[3];
 if(AXB[bs]&&s>0&&s<3)return d[s===1?0:2]!==0?bt[0]:bt[1];
 if(bs===CHEST&&s>=29&&!d[1]&&k===s-29)return bt[3];
 if(bs===OBSERVER){const f=s&3;if(k===f)return bt[1];if(k===((f+2)&3))return bt[3];return d[1]?bt[0]:bt[2]}
 if(bs===DISPENSER||bs===DROPPER)return k===(s&3)?bt[1]:bt[0];
 if(bs===PISTON||bs===STICKY_PISTON){const f=s&7,opp=f<4?(f+2)&3:f^1;if(k===f)return(s&8)?bt[2]:bt[0];if(k===opp)return bt[2];return f>=4?bt[1]:bt[3]}
 if(bs===PHEAD){const f=s&7;return k===f?((s&8)?bt[3]:bt[0]):bt[1]}
 if(bs===RED_LAMP&&(s&1))return bt[3];
 if(bs===REPEATER&&(s&16)&&d[1]>0)return bt[3];
 if(bs===COMPARATOR&&(s&4)&&d[1]>0)return bt[3];
 return d[1]>0?bt[0]:d[1]<0?bt[2]:bt[1]}
function shapeFaces(S,c,g,x,y,z,v,bt,j){
 const bs=v&255,s=v>>8,rp=(bs===REPEATER||bs===COMPARATOR),dk=bs===RED_DUST?.5+.7*(s/15):1;
 for(const[x0,y0,z0,x1,y1,z1,alt]of boxes(v,c.cx*16+x,y,c.cz*16+z,true)){
  for(const[d,cq,sh]of F){
   if((d[0]==1&&x1==1)||(d[0]==-1&&x0==0)||(d[1]==1&&y1==1)||(d[1]==-1&&y0==0)||(d[2]==1&&z1==1)||(d[2]==-1&&z0==0)){
    if(occl(g(x+d[0],y+d[1],z+d[2])))continue}
   const t=pickTile(v,d,bt,alt),k=sh*j*dk;
   for(const q of cq){const px=q[0]?x1:x0,py=q[1]?y1:y0,pz=q[2]?z1:z0;S.p.push(x+px,y+py,z+pz);S.c.push(k,k,k);
    let[u,w]=uvOf(d,px,py,pz);
    if(rp&&d[1]>0){const f=s&3;if(f==1)[u,w]=[pz,px];else if(f==2)[u,w]=[1-px,pz];else if(f==3)[u,w]=[1-pz,1-px]}
    if(AXB[bs]&&s>0&&s<3&&d[s===1?0:2]===0){if(s===1)[u,w]=d[2]?[py,px]:[pz,px];else[u,w]=d[0]?[py,pz]:[px,pz]}
    S.u.push(((t%CO)+.01+u*.98)/CO,(RW-1-Math.floor(t/CO)+.01+w*.98)/RW)}
   S.i.push(S.n,S.n+1,S.n+2,S.n,S.n+2,S.n+3);S.n+=4}}}
function mesh(c){
 const nbc=(a,b)=>{const o=C.get(ck(a,b));return o||((a<-LIM||a>=LIM||b<-LIM||b>=LIM)?null:0)};   // 未生成の隣=0(空気扱い) / ワールド外=null(壁)
 const cs=[nbc(c.cx-1,c.cz-1),nbc(c.cx,c.cz-1),nbc(c.cx+1,c.cz-1),nbc(c.cx-1,c.cz),c,nbc(c.cx+1,c.cz),nbc(c.cx-1,c.cz+1),nbc(c.cx,c.cz+1),nbc(c.cx+1,c.cz+1)];
 c.miss=(cs[1]===0?1:0)|(cs[5]===0?2:0)|(cs[7]===0?4:0)|(cs[3]===0?8:0);const firstMesh=!c.v;
 const g=(x,y,z)=>{if(y<0)return 10;if(y>=H)return 0;const o=cs[(z<0?0:z>15?2:1)*3+(x<0?0:x>15?2:1)];return o?o.d[(x&15)+16*((z&15)+16*y)]:(o===0?(y<=hAt(c.cx*16+x,c.cz*16+z)?3:y<=SL?WA:0):10)};   // 未生成の隣は地形の高さから推定(不要な境界面を作らない)
 const SS={p:[],c:[],u:[],i:[],n:0},WS={p:[],c:[],u:[],i:[],n:0},GS={p:[],c:[],i:[],n:0};
 const addGrass=(x,y,z,seed)=>{
 const X=x+c.cx*16,Z=z+c.cz*16,base=hh(X,Z,seed);
 if(base>.48)return;
 const flowerRoll=hh(X+91,Z-37,seed+71);
 const flower=flowerRoll<.055?"daisy":flowerRoll<.105?"dandelion":flowerRoll<.145?"poppy":flowerRoll<.165?"rosebush":"grass";
 const quad=(a,b,d,e,f,g,h,i,j,k,l,m,cols)=>{
  GS.p.push(a,b,d,e,f,g,h,i,j,k,l,m);
  for(let q=0;q<4;q++)GS.c.push(cols[0],cols[1],cols[2]);
  GS.i.push(GS.n,GS.n+1,GS.n+2,GS.n,GS.n+2,GS.n+3);GS.n+=4;
 };
 const stem=(cx,cz,h,w,lean,shade)=>{
  const x0=x+cx-w,x1=x+cx+w,z0=z+cz-w,z1=z+cz+w,y0=y+.98,y1=y+.98+h;
  const green=[.18+.28*shade,.48+.30*shade,.05+.16*shade];
  quad(x0,y0,z0,x1,y0,z1,x1+lean,y1,z1,x0+lean,y1,z0,green);
  quad(x0,y0,z1,x1,y0,z0,x1-lean,y1,z0,x0-lean,y1,z1,[green[0]*.92,green[1]*.92,green[2]*.92]);
 };
 if(flower==="grass"){
  const blades=1+(hh(X+17,Z+29,seed+3)>.38?1:0)+(hh(X+41,Z+7,seed+5)>.72?1:0);
  for(let n=0;n<blades;n++){
   const seed2=seed+n*19+Math.floor(hh(X+n,Z-n,seed+31)*999);
   const ox=.08+hh(X+17+n*7,Z+29,seed2+3)*.76,oz=.08+hh(X+41,Z+7+n*11,seed2+5)*.76;
   const h=.30+hh(X+13+n*5,Z+19,seed2+9)*.46,w=.045+hh(X+31,Z+11+n*3,seed2+11)*.055;
   const lean=(hh(X+n*13,Z-n*9,seed2+15)-.5)*.24,col=.60+hh(X,Z,seed2+17)*.40;
   stem(ox,oz,h,w,lean,col);
  }
  return;
 }
 const ox=.22+hh(X+17,Z+29,seed+3)*.56,oz=.22+hh(X+41,Z+7,seed+5)*.56;
 if(flower==="daisy" || flower==="dandelion" || flower==="poppy"){
  const h=.38+hh(X+13,Z+19,seed+9)*.16,w=.055+hh(X+31,Z+11,seed+11)*.025;
  stem(ox,oz,h,w,(hh(X,Z,seed+15)-.5)*.08,.75);
  const fx=x+ox,fz=z+oz,fy=y+.98+h-.015,s=.075+hh(X+63,Z+23,seed+21)*.025;
  const fc=flower==="daisy"?[.90,.90,.78]:flower==="dandelion"?[.95,.78,.08]:[.78,.10,.08];
  quad(fx-s,fy,fz,fx+s,fy,fz,fx+s,fy+s*.72,fz,fx-s,fy+s*.72,fz,fc);
  quad(fx,fy,fz-s,fx,fy,fz+s,fx,fy+s*.72,fz+s,fx,fy+s*.72,fz-s,fc);
  quad(fx-s*.72,fy,fz-s*.72,fx+s*.72,fy,fz+s*.72,fx+s*.72,fy+s*.50,fz+s*.72,fx-s*.72,fy+s*.50,fz-s*.72,fc);
  return;
 }
 const bushH=.62+hh(X+13,Z+19,seed+9)*.18;
 const green1=[.13,.42,.07],green2=[.18,.50,.08];
 const centers=[[-.13,-.07,.00],[.13,.06,.04],[.00,.13,.10]];
 for(let q=0;q<centers.length;q++){
  const [dx,dz,dh]=centers[q],bw=.13,cx=x+ox+dx,cz=z+oz+dz,by=y+.98+bushH*.45+dh;
  quad(cx-bw,by,cz,cx+bw,by,cz,cx+bw,by+.12,cz,cx-bw,by+.12,cz,q%2?green1:green2);
  quad(cx,by,cz-bw,cx,by,cz+bw,cx,by+.12,cz+bw,cx,by+.12,cz-bw,q%2?green2:green1);
 }
 for(let q=0;q<3;q++){
  const rx=x+ox+[-.14,.13,.02][q],rz=z+oz+[-.03,.05,.15][q],ry=y+.98+bushH+[.02,.06,.10][q],rs=.10;
  const red=q===1?[.62,.06,.05]:[.78,.08,.06];
  quad(rx-rs,ry,rz,rx+rs,ry,rz,rx+rs,ry+rs*.65,rz,rx-rs,ry+rs*.65,rz,red);
  quad(rx,ry,rz-rs,rx,ry,rz+rs,rx,ry+rs*.65,rz+rs,rx,ry+rs*.65,rz-rs,red);
 }
};;
 for(let y=0;y<c.top;y++)for(let z=0;z<16;z++)for(let x=0;x<16;x++){
  const b=c.d[x+16*(z+16*y)];if(!b)continue;const fk=FL[b&255];if(fk){fluidFaces(fk===1?WS:SS,g,x,y,z,b,BT[b&255]);continue}const fl=false,S=fl?WS:SS,bt=BT[b&255],j=.94+hh(x+c.cx*16,z+c.cz*16,y)*.1;if(b===1 && y+1<c.top && !g(x,y+1,z) && hh(x+c.cx*16,z+c.cz*16,101)<.48)addGrass(x,y,z,101);if(b>255||THIN[b]||RSF[b]){shapeFaces(SS,c,g,x,y,z,b,bt,j);continue}
  for(const[d,cq,sh]of F){const nb=g(x+d[0],y+d[1],z+d[2]);
   if(fl){if(nb)continue}else if(occl(nb)||nb==b)continue;
   const t=d[1]>0?bt[0]:d[1]<0?bt[2]:bt[1],k=sh*j;
   for(const q of cq){const vx=x+q[0],vy=y+q[1]-(fl&&d[1]>0?.1:0),vz=z+q[2];S.p.push(vx,vy,vz);const bl=blockLightAt(c.cx*16+vx+d[0]*.01,vy+d[1]*.01,c.cz*16+vz+d[2]*.01);const cornerAO=(occl(g(x+(q[0]>.5?1:-1),y,z))?0.08:0)+(occl(g(x,y+(q[1]>.5?1:-1),z))?0.08:0)+(occl(g(x,y,z+(q[2]>.5?1:-1)))?0.08:0);const shade=Math.min(1.8,1+bl*1.0)*Math.max(.72,1-cornerAO);S.c.push(k*shade,k*shade,k*shade);
    const[u,v]=uvOf(d,q[0],q[1],q[2]);
    S.u.push(((t%CO)+(u?.99:.01))/CO,(RW-1-Math.floor(t/CO)+(v?.99:.01))/RW)}
   S.i.push(S.n,S.n+1,S.n+2,S.n,S.n+2,S.n+3);S.n+=4}}
 const mk=(S,mt)=>{if(!S.n)return null;const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(S.p,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(S.c,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(S.u,2));geo.setIndex(S.i);
  const m=new THREE.Mesh(geo,mt);m.position.set(c.cx*16,0,c.cz*16);scene.add(m);return m};
 const mkGrass=S=>{if(!S.n)return null;const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(S.p,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(S.c,3));geo.setIndex(S.i);const m=new THREE.Mesh(geo,grassMat);m.position.set(c.cx*16,0,c.cz*16);scene.add(m);return m};
 drop(c);c.m=mk(SS,mat);c.wm=mk(WS,wmat);c.gm=mkGrass(GS);c.v=true;if(firstMesh)remeshNb(c)}
// このチャンクが出来たことで、境界の面が不要になった(または必要になった)隣を作り直す
function remeshNb(c){for(const[dx,dz,bit]of[[-1,0,2],[1,0,8],[0,-1,4],[0,1,1]]){const o=C.get(ck(c.cx+dx,c.cz+dz));if(o&&o.v&&(o.miss&bit))mesh(o)}}
function setB(x,y,z,b){const cx=x>>4,cz=z>>4,c=getC(cx,cz);if(!c||y<0||y>=H)return;const lx=x&15,lz=z&15,i=idx(lx,y,lz);
 const old0=c.d[i];c.d[i]=b;blockLightDirty=true;if((typeof isLightSource==='function')&&(isLightSource(old0)||isLightSource(b))){for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)lightMeshDirty.add(ck(cx+dx,cz+dz))}if(b&&y+1>c.top)c.top=y+1;rsReg(x,y,z,old0,b);fluidDirty(x,y,z,old0,b);
 let e=edits.get(ck(cx,cz));if(!e)edits.set(ck(cx,cz),e=new Map());e.set(i,b);
 mesh(c);const nn=(a,q)=>{const o=C.get(ck(a,q));if(o&&o.v)mesh(o)};
 if(lx==0)nn(cx-1,cz);if(lx==15)nn(cx+1,cz);if(lz==0)nn(cx,cz-1);if(lz==15)nn(cx,cz+1)}
let queue=[],lcx=1e9,lcz=1e9,lastStreamRD=RD;
function stream(force){
 const pcx=Math.floor(P.x)>>4,pcz=Math.floor(P.z)>>4;
 if(pcx!=lcx||pcz!=lcz||RD!==lastStreamRD){lcx=pcx;lcz=pcz;lastStreamRD=RD;queue=[];
  for(let dz=-RD;dz<=RD;dz++)for(let dx=-RD;dx<=RD;dx++){const d2=dx*dx+dz*dz;if(d2>RD*RD+RD)continue;
   const c=C.get(ck(pcx+dx,pcz+dz));if(!c||!c.v)queue.push([d2,pcx+dx,pcz+dz])}
  queue.sort((a,b)=>a[0]-b[0]);
  for(const[k,c]of C){const dd=Math.max(Math.abs(c.cx-pcx),Math.abs(c.cz-pcz));
   if(dd>RD+3){drop(c);C.delete(k);_ck=-1}else if(dd>RD+1&&c.v){drop(c);c.v=false}}}
 const t0=performance.now();
 let qi=0;while(qi<queue.length){const[,cx,cz]=queue[qi++],c=getC(cx,cz);if(c&&!c.v)mesh(c);if(!force&&performance.now()-t0>4)break}if(qi)queue=queue.slice(qi)}
