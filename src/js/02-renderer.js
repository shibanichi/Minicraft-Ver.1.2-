// ---- テクスチャ生成（16x16・タイル可能・バニラ風ピクセルアート） ----
const hh=(a,b,s)=>{let n=Math.imul(a+1013,374761393)^Math.imul(b+7919,668265263)^Math.imul(s+101,1274126177);n=Math.imul(n^(n>>>13),1103515245);return((n^(n>>>16))>>>0)/4294967296};
const wr=(v,p)=>((v%p)+p)%p,fn=(k,x,y)=>hh(x,y,k);
function tn(s,x,y,cs){const g=16/cs,fx=x/cs,fy=y/cs,xi=Math.floor(fx),yi=Math.floor(fy),u=fx-xi,v=fy-yi,a=u*u*(3-2*u),b=v*v*(3-2*v),l=(i,j)=>hh(wr(xi+i,g),wr(yi+j,g),s);
 return(l(0,0)*(1-a)+l(1,0)*a)*(1-b)+(l(0,1)*(1-a)+l(1,1)*a)*b}
function vor(s,x,y,cs){const g=16/cs,cx=Math.floor(x/cs),cy=Math.floor(y/cs);let d1=9e9,d2=9e9,id=0;
 for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const gx=cx+i,gy=cy+j,wx=wr(gx,g),wy=wr(gy,g),
  d=Math.hypot(x+.5-(gx+hh(wx,wy,s))*cs,y+.5-(gy+hh(wx,wy,s+7))*cs);
  if(d<d1){d2=d1;d1=d;id=hh(wx,wy,s+13)}else if(d<d2)d2=d}
 return{id,e:d2-d1,d:d1}}
const shd=(c,k)=>c.map(v=>v*k);
const PAT={
 n:(c,o,x,y,k)=>shd(c,1+((tn(k,x,y,4)-.5)*.7+(fn(k,x,y)-.5)*1.3)*(o||.15)),
 sm:(c,o,x,y,k)=>shd(c,1+(tn(k,x,y,8)-.5)*.08+(fn(k,x,y)-.5)*.05),
 st:(c,o,x,y,k)=>{const v=tn(k,x,y,4)*.45+tn(k+3,x,y,2)*.3+fn(k+5,x,y)*.25,q=fn(k+9,x,y);let m=.86+v*.3*((o||.2)/.2);if(q>.93)m*=1.14;else if(q<.06)m*=.84;return shd(c,m)},
 gr:(c,o,x,y,k)=>{const v=vor(k,x,y,2);let m=.8+tn(k,x,y,4)*.3+(fn(k,x,y)-.5)*.2;if(v.id>.7)m*=1.12;else if(v.id<.25)m*=.82;return shd(c,m)},
 dirt:(c,o,x,y,k)=>{const v=vor(k,x,y,4);let m=.85+tn(k,x,y,4)*.2+(fn(k+1,x,y)-.5)*.2;if(v.id>.72&&v.d<1.1)m*=1.18;else if(v.id<.2&&v.d<1.2)m*=.78;return shd(c,m)},
 gs:(c,o,x,y,k)=>{const f=2+Math.floor(hh(x,0,k)*2.99)+(fn(k+1,x,0)>.7?1:0);return y<f?PAT.n(c,.4,x,y,k+2):PAT.dirt([134,96,67],0,x,y,k+4)},
 sd:(c,o,x,y,k)=>shd(c,.95+(fn(k,x,y)-.5)*.1+(tn(k,x,y,4)-.5)*.08-(fn(k+1,x,y)>.94?.07:0)),
 gv:(c,o,x,y,k)=>{const v=vor(k,x,y,4);let m=.7+v.id*.5;if(v.e<.6)m*=.7;return shd(c,m*(.95+fn(k,x,y)*.1))},
 cb:(c,o,x,y,k)=>{const v=vor(k,x,y,4);let m=.72+v.id*.5;if(v.e<.55)m*=.6;else if(v.e<1)m*=.9;return shd(c,m*(.94+fn(k,x,y)*.12))},
 bed:(c,o,x,y,k)=>{const v=vor(k,x,y,4);let m=.5+tn(k,x,y,2)*.7;if(v.id>.6)m*=.6;if(fn(k,x,y)>.88)m*=1.35;return shd([85,85,85],m)},
 ox:(c,o,x,y,k)=>{const q=fn(k,x,y);if(q>.93)return[110,70,170];if(q<.05)return[10,5,20];return shd(c,.7+tn(k,x,y,4)*.5)},
 wl:(c,o,x,y,k)=>shd(c,(.9+tn(k,x,y,2)*.18)*(((x+y)&1)?1:.93)*(.96+fn(k,x,y)*.08)),
 gw:(c,o,x,y,k)=>{const v=vor(k,x,y,4);let m=.8+v.id*.4;if(v.e<.7)m*=.75;if(fn(k,x,y)>.85)m*=1.2;return shd(c,m)},
 sb:(c,o,x,y,k)=>{const row=y>>3,bx=wr(x+(row&1)*8,16);if((y&7)==7||(bx&15)==15)return shd(c,.62);return shd(PAT.st(c,.2,x,y,k),((y&7)==0||(bx&15)==0)?1.1:1)},
 wt:(c,o,x,y,k)=>{let m=.8+tn(k,x,y,4)*.3+(tn(k+2,x,y,8)>.6?.12:0);if(fn(k,x,y)>.92)m+=.2;return shd(c,m)},
 lv:(c,o,x,y,k)=>{const v=vor(k,x,y,4),t=tn(k,x,y,4);let col=t>.62?[255,215,70]:t>.4?[250,130,20]:[205,70,10];if(v.e<.6)col=shd(col,.75);return shd(col,.92+fn(k,x,y)*.16)},
 mg:(c,o,x,y,k)=>{const v=vor(k,x,y,4);return v.e<.8?[255,160+fn(k,x,y)*60,40]:shd([60,22,14],.8+fn(k,x,y)*.5)},
 br:(c,o,x,y,k)=>{const row=y>>2,bx=wr(x+(row&1)*4,16);if((y&3)==3||(bx&7)==7)return shd(o,.92+fn(k,x,y)*.16);
  return shd(c,(.88+hh(bx>>3,row,k)*.22+(fn(k+2,x,y)-.5)*.1)*((y&3)?1:1.08))},
 tl:(c,o,x,y,k)=>{let m=.97+(tn(k,x,y,8)-.5)*.1+(fn(k,x,y)-.5)*.05;if(x==0||y==0)m=1.12;else if(x==15||y==15)m=.82;return shd(c,m)},
 pk:(c,o,x,y,k)=>{const row=y>>2,ex=Math.floor(hh(row,0,k)*16);if((y&3)==3)return shd(c,.7);if(((x+ex)&15)==0)return shd(c,.76);
  return shd(c,.9+hh(row,1,k)*.16+(hh(row,(x+ex)>>2,k+2)-.5)*.1+(fn(k,x,y)-.5)*.06+((y&3)==0?.05:0))},
 lg:(c,o,x,y,k)=>shd(c,.75+hh(x,0,k)*.3+(tn(k,x,y,4)-.5)*.25+(fn(k+1,x,y)-.5)*.1),
 lt:(c,o,x,y,k)=>{const d=Math.max(Math.abs(x-7.5),Math.abs(y-7.5));if(d>6.5)return PAT.lg(o,0,x,y,k+1);
  const ring=Math.floor(d+(tn(k,x,y,4)-.5)*1.6);return shd(ring%2?c:shd(c,.8),.96+(fn(k,x,y)-.5)*.1)},
 lf:(c,o,x,y,k)=>{const v=vor(k,x,y,4);let m=.62+v.id*.55+(tn(k,x,y,2)-.5)*.3;if(v.e<.7)m*=.8;if(fn(k+3,x,y)<.22)m*=.55;return shd(c,m)},
 ob:(c,o,x,y,k)=>{const v=vor(k+1,x,y,4);
  if(v.id>.62&&v.d<1.35){let t=v.d<.8?1.12:.95;if(((x+y)%5)<1)t*=1.2;return shd(c,t*(.88+fn(k+4,x,y)*.24))}
  return PAT.st(o,.28,x,y,k)},
 gl:(c,o,x,y)=>(x==0||y==0||x==15||y==15||(x==y&&x>2&&x<7)||(x==y-1&&x>2&&x<6)||(x==12&&y==4)||(x==11&&y==5))?c:[0,0,0,0],
 bd:(c,o,x,y,k)=>shd(c,(((y&7)==0||((y&7)==1&&fn(k,x,y)>.5))?.86:1)*(.94+tn(k,x,y,4)*.1+(fn(k,x,y)-.5)*.06)),
 bks:(c,o,x,y,k)=>y<2||y>13?PAT.pk([162,130,78],0,x,y,k):y==7||y==8?shd([110,80,40],.9+fn(k,x,y)*.2):shd([[150,40,40],[40,80,150],[60,130,60],[170,140,50],[110,60,140]][((x>>1)+(y>7?3:0))%5],.8+fn(k,x,y)*.35),
 tnt:(c,o,x,y,k)=>y>=5&&y<=10?(y==5||y==10?shd([60,60,60],.9+fn(k,x,y)*.2):shd([235,235,235],.96+fn(k,x,y)*.06)):shd([200,40,30],.9+fn(k,x,y)*.2),
 pum:(c,o,x,y,k)=>shd(c,(x%4==0?.82:x%4==1?1.06:.98)*(.95+fn(k,x,y)*.1)),
 mel:(c,o,x,y,k)=>shd(c,(x%4<2?.78:1)*(.94+fn(k,x,y)*.12)),
 hay:(c,o,x,y,k)=>shd(c,(y%5==2?.55:.95+(x%3==0?.08:0))*(.94+fn(k,x,y)*.12)),
 crt:(c,o,x,y,k)=>(x%8==0||y%8==0)?shd([100,70,35],.9+fn(k,x,y)*.2):PAT.pk(c,0,x,y,k),
 td:(c,o,x,y,k)=>(x<2||x>13||y<2||y>13)?shd(c,.8+fn(k,x,y)*.1):((x+1)%4<2&&(y+1)%4<2)?shd(c,.5):shd(c,.95+fn(k,x,y)*.1),
 fur:(c,o,x,y,k)=>x>3&&x<12&&y>5&&y<12?shd([40,40,40],.8+fn(k,x,y)*.4):PAT.st(c,.2,x,y,k)};
const cbase=(k,x,y)=>shd([158,158,158],.9+fn(k,x,y)*.14+(tn(k,x,y,4)-.5)*.12);
const ctorch=(L,x,y)=>{for(const[tx,ty,on]of L){if(x>=tx&&x<=tx+1&&y>=ty&&y<=ty+1)return on?((x+y)&1?[225,70,55]:[175,28,20]):[105,32,26];if(x>=tx-1&&x<=tx+2&&y>=ty-1&&y<=ty+2)return[80,80,80]}return null};
Object.assign(PAT,{
 rdust:(c,o,x,y,k)=>{const cen=x>=6&&x<=9&&y>=6&&y<=9,arm=(x==7||x==8)||(y==7||y==8);if(!cen&&!arm)return[0,0,0,0];return shd(c,(cen?1.1:.85)+(fn(k,x,y)-.5)*.35)},
 rtorch:(c,o,x,y,k)=>{if(x<7||x>8||y<6)return[0,0,0,0];if(y<8)return(x+y)&1?[255,92,70]:[205,38,28];return x==7?[170,140,85]:[128,100,58]},
 rrep:(c,o,x,y,k)=>{if(x<1||y<1||x>14||y>14)return shd(cbase(k,x,y),.72);return ctorch([[7,2,0],[7,11,0]],x,y)||(y==7&&x>=3&&x<=12?[95,95,95]:cbase(k,x,y))},
 rrepOn:(c,o,x,y,k)=>{if(x<1||y<1||x>14||y>14)return shd(cbase(k,x,y),.72);return ctorch([[7,2,1],[7,11,1]],x,y)||(y==7&&x>=3&&x<=12?[95,95,95]:cbase(k,x,y))},
 rcmp:(c,o,x,y,k)=>{if(x<1||y<1||x>14||y>14)return shd(cbase(k,x,y),.72);return ctorch([[7,11,0],[3,2,0],[11,2,0]],x,y)||cbase(k,x,y)},
 rcmp2:(c,o,x,y,k)=>{if(x<1||y<1||x>14||y>14)return shd(cbase(k,x,y),.72);return ctorch([[7,11,0],[3,2,1],[11,2,1]],x,y)||cbase(k,x,y)},
 lampOn:(c,o,x,y,k)=>(x%8==0||y%8==0)?shd([200,140,60],.9+fn(k,x,y)*.2):shd([255,226,140],.9+vor(k,x,y,4).id*.2+(fn(k,x,y)-.5)*.1),
 obsB:(c,o,x,y,k)=>{const d=Math.hypot(x-7.5,y-7.5);return d<2.2?(d<1.2?[230,50,40]:[150,30,25]):PAT.st([105,105,105],.15,x,y,k)},
 pistP:(c,o,x,y,k)=>PAT.cb([128,128,128],0,x,y,k),
 pistT:(c,o,x,y,k)=>{const e=Math.min(x,y,15-x,15-y);if(e==0)return shd(c,.6);if(e==1)return shd(c,.85);return shd(c,.95+fn(k,x,y)*.1+(tn(k,x,y,4)-.5)*.1)},
 pistS:(c,o,x,y,k)=>y<4?PAT.pk(c,0,x,y,k):y==4?[85,85,85]:PAT.cb([128,128,128],0,x,y,k),
 pistB:(c,o,x,y,k)=>Math.hypot(x-7.5,y-7.5)<2.2?shd([60,60,60],.8+fn(k,x,y)*.3):PAT.cb([120,120,120],0,x,y,k),
 obsT:(c,o,x,y,k)=>((Math.abs(x-7.5)<=.5&&y>=6&&y<=12)||(y>=3&&y<=6&&Math.abs(x-7.5)<=(y-3)+.5))?[55,55,55]:PAT.st([105,105,105],.15,x,y,k),
 obsF:(c,o,x,y,k)=>{if(x<2||y<2||x>13||y>13)return PAT.st([105,105,105],.15,x,y,k);
  if((x>=4&&x<=6||x>=9&&x<=11)&&y>=5&&y<=7)return[48,48,52];if(y==10&&x>=5&&x<=10)return[48,48,52];return shd([150,150,152],.9+fn(k,x,y)*.15)},
 dispF:(c,o,x,y,k)=>{const m=o?5:4,M=o?10:11;if(x>=m&&x<=M&&y>=m&&y<=M)return(x==m||x==M||y==m||y==M)?[35,35,35]:shd([62,62,62],.9+fn(k,x,y)*.3);return PAT.cb(c,0,x,y,k)},
 hopT:(c,o,x,y,k)=>{const e=Math.min(x,y,15-x,15-y);if(e==0)return[55,55,60];if(e<3)return shd([95,95,102],.9+fn(k,x,y)*.2);return Math.hypot(x-7.5,y-7.5)<2.6?[18,18,20]:shd([48,48,54],.9+fn(k,x,y)*.2)},
 hopO:(c,o,x,y,k)=>shd([72,72,78],(y%8<2?1.3:y%8==7?.7:1)*(.92+fn(k,x,y)*.16)),
 lamp:(c,o,x,y,k)=>(x%8==0||y%8==0)?shd([70,48,30],.9+fn(k,x,y)*.2):shd([150,108,66],.8+vor(k,x,y,4).id*.35+(fn(k,x,y)-.5)*.1),
 tgt:(c,o,x,y,k)=>shd(Math.floor(Math.max(Math.abs(x-7.5),Math.abs(y-7.5))/1.7)%2?[238,232,222]:[200,60,50],.93+fn(k,x,y)*.12),
 rsb:(c,o,x,y,k)=>{const v=vor(k,x,y,4);let m=.78+v.id*.4;if(v.e<.7)m*=.85;return shd(c,m*(.95+fn(k,x,y)*.1))},
 stick:(c,o,x,y,k)=>shd([143,110,62],.8+hh(x,0,k)*.3+(fn(k,x,y)-.5)*.12),
 rail:(c,o,x,y,k)=>{const rl=(x>=2&&x<=3)||(x>=12&&x<=13),tie=(y%4==1||y%4==2)&&x>=1&&x<=14,rc=o==1?[205,172,45]:o==3?[110,82,72]:[150,150,155];
  if(o==2&&x>=5&&x<=10&&y>=5&&y<=10)return(x==5||x==10||y==5||y==10)?[70,70,75]:shd([125,125,130],.9+fn(k,x,y)*.2);
  if(rl)return shd(rc,.85+fn(k,x,y)*.3);
  if((o==1||o==3)&&x>=7&&x<=8&&y%4!=0)return o==1?shd([150,25,15],.8+fn(k,x,y)*.4):shd([160,40,30],.8+fn(k,x,y)*.4);
  if(tie)return shd([121,86,52],.8+hh(x,y>>2,k)*.3+fn(k,x,y)*.15);return[0,0,0,0]},
 chT:(c,o,x,y,k)=>{const e=Math.min(x-1,y-1,14-x,14-y);if(e<=0)return shd([105,72,34],.9+fn(k,x,y)*.1);return shd([158,112,58],(e==1?.84:1)*(.92+((y%4==0)?-.06:0)+fn(k,x,y)*.1))},
 chS:(c,o,x,y,k)=>{if(x==1||x==14||y==15)return shd([100,68,32],.9+fn(k,x,y)*.1);if(y==6||y==7)return[85,58,28];return shd([158,112,58],(y<6?1.06:.95)*(.88+fn(k,x,y)*.14+(((y+1)%4==0)?-.05:0)))},
 chF:(c,o,x,y,k)=>{if(x>=7&&x<=8&&y>=4&&y<=9)return(x==7&&y==8)?[30,28,28]:shd([205,205,210],.82+fn(k,x,y)*.2);return PAT.chS(c,o,x,y,k)},
 chB:(c,o,x,y,k)=>shd([95,66,32],.85+fn(k,x,y)*.2),
 spg:(c,o,x,y,k)=>{const v=vor(k,x,y,4);let m=.85+v.id*.3;if(v.d<1.2&&v.id>.4)m*=.38;return shd(c,m*(.92+fn(k,x,y)*.16))},
 spgW:(c,o,x,y,k)=>{const v=vor(k,x,y,4);let m=.8+v.id*.25;if(v.d<1.2&&v.id>.4)m*=.35;return shd(c,m*(.92+fn(k,x,y)*.16))}});
const BASE=[['gr',[95,160,60]],['gs',[95,160,60]],['dirt',[134,96,67]],['st',[125,125,125]],['lg',[102,81,50]],['lt',[170,135,85],[102,81,50]],['lf',[60,130,40]],['sd',[219,207,142]],['pk',[162,130,78]],['cb',[125,125,125]],['br',[150,80,65],[190,185,175]],
['bed'],['ob',[25,25,25],[125,125,125]],['ob',[216,175,147],[125,125,125]],['ob',[250,220,60],[125,125,125]],['ob',[90,230,220],[125,125,125]],['gv',[131,126,124]],['bd',[218,205,150]],['gl',[225,242,248]],['ox',[25,15,40]],
['wl',[235,235,235]],['wl',[160,45,40]],['wl',[50,60,160]],['gw',[240,200,110]],['sb',[125,125,125]],['wt',[55,100,210]],['lv',[225,95,15]]];
for(let t=0;t<N;t++){const[p,c,o]=t<27?BASE[t]:TS[t-27];
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){const q=PAT[p](c,o,x,y,t*7+3),i=((Math.floor(t/CO)*16+y)*16*CO+(t%CO)*16+x)*4;
  im.data[i]=q[0];im.data[i+1]=q[1];im.data[i+2]=q[2];im.data[i+3]=q[3]===undefined?255:q[3]}}
actx.putImageData(im,0,0);
const tex=new THREE.CanvasTexture(ac);tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;
// ================= 昼夜サイクル：昼10分・夜10分 =================
const DAY_LENGTH=600, NIGHT_LENGTH=600, TOTAL_CYCLE=DAY_LENGTH+NIGHT_LENGTH;
let worldClock=0;
const DAY_BRIGHT=15, NIGHT_BRIGHT=4;
const daySky=new THREE.Color(0x87ceeb), orangeSky=new THREE.Color(0xff8a32), nightSky=new THREE.Color(0x111827), skyCol=new THREE.Color();
const scene=new THREE.Scene();scene.background=skyCol;scene.fog=new THREE.Fog(skyCol,35,RD*16-10);
const cv=document.getElementById('c'),ren=new THREE.WebGLRenderer({canvas:cv,powerPreference:'high-performance'});
ren.setPixelRatio(Math.min(devicePixelRatio||1,0.9));
const cam=new THREE.PerspectiveCamera(75,1,.1,330);cam.rotation.order='YXZ';
// 白い正方形の太陽と月。東(+X)から西(-X)へ半円を描いて移動する。
const celestialMat=(c)=>new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide,fog:false});
const sunMesh=new THREE.Mesh(new THREE.BoxGeometry(7,7,.35),celestialMat(0xffffff));
const moonMesh=new THREE.Mesh(new THREE.BoxGeometry(5.5,5.5,.3),celestialMat(0xe8edf5));
scene.add(sunMesh,moonMesh);
const SUN_DIST=150;
function smoothstep(a,b,x){x=Math.max(0,Math.min(1,(x-a)/(b-a)));return x*x*(3-2*x)}
function updateDayNight(dt){
 worldClock=(worldClock+dt)%TOTAL_CYCLE;
 const phase=worldClock/TOTAL_CYCLE;
 const day=phase<.5;
 const half=day?phase/.5:0;
 // 昼：太陽は東(+X)から西(-X)。夜：月も東(+X)から西(-X)。
 const a=half*Math.PI;
 const sx=Math.cos(a)*SUN_DIST, sy=Math.sin(a)*SUN_DIST+18;
 const mx=Math.cos(a)*SUN_DIST, my=Math.sin(a)*SUN_DIST+18;
 sunMesh.position.set(P.x+sx, P.y+sy, P.z);
 moonMesh.position.set(P.x+mx, P.y+my, P.z);
 sunMesh.visible=day; moonMesh.visible=!day;
 // 昼の開始2分＝朝、終了2分＝夕方。夜は地面の明るさ4で安定させる。
 let level;
 if(day){
   const t=phase/.5;
   if(t<.2) level=NIGHT_BRIGHT+(DAY_BRIGHT-NIGHT_BRIGHT)*smoothstep(0,.2,t);
   else if(t>.8) level=NIGHT_BRIGHT+(DAY_BRIGHT-NIGHT_BRIGHT)*(1-smoothstep(.8,1,t));
   else level=DAY_BRIGHT;
   if(t<.2) skyCol.copy(orangeSky).lerp(daySky,smoothstep(.04,.2,t));
   else if(t>.8) skyCol.copy(daySky).lerp(orangeSky,smoothstep(.8,1,t));
   else skyCol.copy(daySky);
 }else{
   level=NIGHT_BRIGHT;
   skyCol.copy(nightSky);
 }
 // 地面の明るさを「昼15・夜4」として比例変換。MeshBasicMaterialなので材質倍率で直接反映する。
 const mul=level/DAY_BRIGHT;
 // MOBはブロックの色倍率では暗くならないため、シーン照明も昼夜に合わせて調整する。
 if(typeof ambientLight!=='undefined') ambientLight.intensity=.8*mul*brightMul;
 if(typeof dl!=='undefined') dl.intensity=.5*mul*brightMul;
 mat.color.setScalar(mul*brightMul); wmat.color.setScalar(mul*brightMul); grassMat.color.setScalar(mul*brightMul);
 if(uw){uwTmp.copy(UWC).multiplyScalar(Math.max(.3,mul));scene.background.copy(uwTmp);scene.fog.color.copy(uwTmp)}else{scene.background.copy(skyCol);scene.fog.color.copy(skyCol)}
 scene.fog.near=uw?.1:Math.min(35,Math.max(16,RD*16-10)-1); scene.fog.far=uw?28:Math.max(16,RD*16-10);
}
function resize(){ren.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
const mat=new THREE.MeshBasicMaterial({map:tex,vertexColors:true,fog:true,alphaTest:.5});
const wmat=new THREE.MeshBasicMaterial({map:tex,vertexColors:true,fog:true,transparent:true,opacity:.65,depthWrite:false});
const grassMat=new THREE.MeshBasicMaterial({color:0x4f9f35,vertexColors:true,fog:true,transparent:true,opacity:.98,side:THREE.DoubleSide,depthWrite:false});
