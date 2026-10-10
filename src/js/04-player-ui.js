// ---- player / save ----
const P={x:0,y:0,z:0,vx:0,vy:0,vz:0,yaw:0,pitch:0,ground:false},R=.3,HT=1.8;
const HONEY=nmid('ハチミツブロック'), SLIME=nmid('スライムブロック');
function honeyContact(x,y,z){const bx=Math.floor(x),bz=Math.floor(z),by=Math.floor(y-.08);if((getB(bx,by,bz)&255)===HONEY)return true;for(const yy of [Math.floor(y+.05),Math.floor(y+.4),Math.floor(y+1),Math.floor(y+1.4)]){if((getB(bx-1,yy,bz)&255)===HONEY||(getB(bx+1,yy,bz)&255)===HONEY||(getB(bx,yy,bz-1)&255)===HONEY||(getB(bx,yy,bz+1)&255)===HONEY)return true}return false;}
function slimeUnder(x,y,z,r=0){const ys=[Math.floor(y-.02),Math.floor(y-.08),Math.floor(y-.15)];for(const yy of ys){if((getB(Math.floor(x),yy,Math.floor(z))&255)===SLIME)return true;if(r>0){for(const [dx,dz] of [[-r,-r],[-r,r],[r,-r],[r,r]])if((getB(Math.floor(x+dx),yy,Math.floor(z+dz))&255)===SLIME)return true}}return false;}
let SX=0,SZ=0;for(let i=0;i<400;i++){if(hAt(i*9,0)>SL+3){SX=i*9;break}}
function surfY(x,z){for(let y=H-1;y>0;y--)if(solid(getB(x,y,z)))return y+1;return H}
function respawn(){P.x=SX+.5;P.z=SZ+.5;P.y=surfY(SX,SZ)+.1;P.vy=0;hp=20;hunger=10;hungerTimer=0;updateHp()}
const SK='minicraft_v2',toastEl=document.getElementById('toast');let tt;
function toast(t){toastEl.textContent=t;toastEl.style.opacity=1;clearTimeout(tt);tt=setTimeout(()=>toastEl.style.opacity=0,1800)}
const chests={},RS=new Map();let noSave=false;function save(man){if(noSave)return;try{const e={};edits.forEach((m,k)=>{const a=[];m.forEach((b,i)=>a.push(i,b));e[k]=a});
 localStorage.setItem(SK,JSON.stringify({p:[P.x,P.y,P.z,P.yaw,P.pitch],hot,sel,e,invCount,equipped,ch:chests,hunger,hungerTimer}));if(typeof refreshSaveInfo==='function')refreshSaveInfo();if(man)toast('セーブしました')}catch(x){if(man)toast('セーブに失敗しました')}}
function load(){try{const j=JSON.parse(localStorage.getItem(SK));if(!j)return false;
 for(const k in j.e){const m=new Map(),a=j.e[k];for(let i=0;i<a.length;i+=2)m.set(a[i],a[i+1]);edits.set(+k,m)}
 [P.x,P.y,P.z,P.yaw,P.pitch]=j.p;if(j.hot&&j.hot.length==9)j.hot.forEach((v,i)=>hot[i]=(v===24||v===25)?1:v);sel=j.sel||0;if(j.invCount)Object.assign(invCount,j.invCount);if(j.equipped)Object.assign(equipped,j.equipped);if(j.ch)Object.assign(chests,j.ch);if(Number.isFinite(j.hunger))hunger=Math.max(0,Math.min(10,j.hunger));if(Number.isFinite(j.hungerTimer))hungerTimer=Math.max(0,j.hungerTimer%300);return true}catch(x){return false}}
// ワールド読込はインベントリ・装備・回路関数の初期化後に実行する（TDZによる起動失敗を防止）
let loaded=false;
setInterval(()=>save(false),20000);addEventListener('pagehide',()=>save(false));document.addEventListener('visibilitychange',()=>{if(document.hidden)save(false)});
// ---- UI ----
const bar=document.getElementById('bar'),AU=ac.toDataURL();
const NM={1:'草ブロック',2:'土',3:'石',4:'原木',5:'葉',6:'砂',7:'板材',8:'丸石',9:'レンガ',11:'石炭鉱石',12:'鉄鉱石',13:'金鉱石',14:'ダイヤ鉱石',15:'砂利',16:'砂岩',17:'ガラス',18:'黒曜石',19:'白の羊毛',20:'赤の羊毛',21:'青の羊毛',23:'石レンガ',24:'水',25:'溶岩'};Object.assign(NM,NMS);for(const [id,name] of Object.entries(NM)){if(name==='ブロック'){delete NM[id];const ix=PL.indexOf(+id);if(ix>=0)PL.splice(ix,1)}}
// ---- アイテム / 装備 / クラフト ----
const ITEMS={};let nextItem=1000;
function item(name,type,damage,icon){const id=nextItem++;ITEMS[id]={id,name,type,damage:damage||0,icon:icon||'◆',dur: type==='armor'?80: type==='tool'?120:1};return id}
const I={
 woodSword:item('木の剣','weapon',4,'🗡'),stoneSword:item('石の剣','weapon',5,'🗡'),ironSword:item('鉄の剣','weapon',7,'⚔'),diamondSword:item('ダイヤモンドの剣','weapon',9,'⚔'),netheriteSword:item('ネザライトの剣','weapon',10,'⚔'),
 woodPick:item('木のツルハシ','tool',2,'⛏'),stonePick:item('石のツルハシ','tool',3,'⛏'),ironPick:item('鉄のツルハシ','tool',4,'⛏'),diamondPick:item('ダイヤモンドのツルハシ','tool',5,'⛏'),netheritePick:item('ネザライトのツルハシ','tool',6,'⛏'),
 woodAxe:item('木の斧','tool',3,'🪓'),ironAxe:item('鉄の斧','tool',5,'🪓'),diamondAxe:item('ダイヤモンドの斧','tool',7,'🪓'),
 ironHelmet:item('鉄のヘルメット','armor',2,'⛑'),ironChest:item('鉄のチェストプレート','armor',6,'🛡'),ironLegs:item('鉄のレギンス','armor',5,'🛡'),ironBoots:item('鉄のブーツ','armor',2,'🥾'),
 diamondHelmet:item('ダイヤモンドのヘルメット','armor',3,'⛑'),diamondChest:item('ダイヤモンドのチェストプレート','armor',8,'🛡'),diamondLegs:item('ダイヤモンドのレギンス','armor',6,'🛡'),diamondBoots:item('ダイヤモンドのブーツ','armor',3,'🥾'),
 netheriteHelmet:item('ネザライトのヘルメット','armor',4,'⛑'),netheriteChest:item('ネザライトのチェストプレート','armor',9,'🛡'),netheriteLegs:item('ネザライトのレギンス','armor',7,'🛡'),netheriteBoots:item('ネザライトのブーツ','armor',4,'🥾'),
 redstone:item('レッドストーン','material',0,'◆'),iron:item('鉄インゴット','material',0,'⬜'),diamond:item('ダイヤモンド','material',0,'◇'),stick:item('棒','material',0,'│')};
Object.assign(I,{gold:item('金インゴット','material',0,'🟨'),apple:item('リンゴ','food',0,'🍎'),bread:item('パン','food',0,'🍞'),beef:item('生の牛肉','food',0,'🥩'),pork:item('生の豚肉','food',0,'🥩'),mutton:item('生の羊肉','food',0,'🍖'),chicken:item('生の鶏肉','food',0,'🍗'),rotten:item('腐った肉','food',0,'🟫'),leather:item('革','material',0,'▰'),feather:item('羽根','material',0,'🪶'),bone:item('骨','material',0,'🦴'),string:item('糸','material',0,'〰'),gunpowder:item('火薬','material',0,'▪'),arrow:item('矢','material',0,'➶'),rail:item('レール','block',0,'▤'),poweredRail:item('パワードレール','block',0,'▥'),detectorRail:item('検知レール','block',0,'▦'),activatorRail:item('アクティベーターレール','block',0,'▧'),minecart:item('トロッコ','transport',0,'▣')});
Object.assign(I,{bucket:item('バケツ','material',0,'🪣'),waterBucket:item('水入りバケツ','material',0,'🪣'),lavaBucket:item('マグマ入りバケツ','material',0,'🪣'),shield:item('盾','shield',0,'🛡')});
for(const [k,h] of Object.entries({apple:4,bread:5,beef:3,pork:3,mutton:3,chicken:2,rotten:2}))ITEMS[I[k]].heal=h;
const invCount={};
function refreshSaveInfo(){
 const el=document.getElementById('saveInfo');if(!el)return;
 const ids=Object.keys(invCount).map(Number).filter(id=>invCount[id]>0);
 const invText=ids.length?ids.map(id=>`${ITEMS[id]?.name||NM[id]||'アイテム'}×${invCount[id]}`).join(' / '):'空';
 const editsCount=[...edits.values()].reduce((n,m)=>n+m.size,0), chestCount=Object.keys(chests).length;
 el.innerHTML=`<b>保存ワールド情報</b><br>座標：X ${P.x.toFixed(1)} / Y ${P.y.toFixed(1)} / Z ${P.z.toFixed(1)}<br>変更ブロック：${editsCount.toLocaleString()} / チェスト：${chestCount}<br><b>インベントリ：</b>${invText}`;
}
refreshSaveInfo();
function give(i,n=1){invCount[i]=(invCount[i]||0)+n;draw();if(typeof refreshSaveInfo==='function')refreshSaveInfo();if(inv&&typeof renderInventory==='function')renderInventory()}function take(i,n=1){if((invCount[i]||0)<n)return false;invCount[i]-=n;draw();if(typeof refreshSaveInfo==='function')refreshSaveInfo();return true}
const equipped={weapon:null,helmet:null,chest:null,legs:null,boots:null,shield:null};
function isItem(id){return ITEMS[id]}
function itemIcon(id){const q=ITEMS[id];if(q.img)return `<i style="background:#333 url(${q.img}) center/100% 100% no-repeat;image-rendering:pixelated"></i><u>${invCount[id]||0}</u>`;return `<i style="display:flex;align-items:center;justify-content:center;font-size:22px;background:#333;color:#fff">${q.icon}</i><u>${invCount[id]||0}</u>`}
const recipes=[
 [I.stick,'棒',[4,2]], [I.woodSword,'木の剣',[4,2,I.stick,1]], [I.stoneSword,'石の剣',[8,2,I.stick,1]], [I.ironSword,'鉄の剣',[I.iron,2,I.stick,1]], [I.diamondSword,'ダイヤモンドの剣',[I.diamond,2,I.stick,1]],
 [I.woodPick,'木のツルハシ',[4,3,I.stick,2]], [I.stonePick,'石のツルハシ',[8,3,I.stick,2]], [I.ironPick,'鉄のツルハシ',[I.iron,3,I.stick,2]], [I.diamondPick,'ダイヤモンドのツルハシ',[I.diamond,3,I.stick,2]],
 [I.ironHelmet,'鉄のヘルメット',[I.iron,5]], [I.ironChest,'鉄のチェストプレート',[I.iron,8]], [I.ironLegs,'鉄のレギンス',[I.iron,7]], [I.ironBoots,'鉄のブーツ',[I.iron,4]],
 [I.diamondHelmet,'ダイヤモンドのヘルメット',[I.diamond,5]], [I.diamondChest,'ダイヤモンドのチェストプレート',[I.diamond,8]], [I.diamondLegs,'ダイヤモンドのレギンス',[I.diamond,7]], [I.diamondBoots,'ダイヤモンドのブーツ',[I.diamond,4]],
 [I.netheriteSword,'ネザライトの剣',[I.diamondSword,1,I.iron,1]], [I.netheritePick,'ネザライトのツルハシ',[I.diamondPick,1,I.iron,1]], [I.netheriteHelmet,'ネザライトのヘルメット',[I.diamondHelmet,1,I.iron,1]], [I.netheriteChest,'ネザライトのチェストプレート',[I.diamondChest,1,I.iron,1]], [I.netheriteLegs,'ネザライトのレギンス',[I.diamondLegs,1,I.iron,1]], [I.netheriteBoots,'ネザライトのブーツ',[I.diamondBoots,1,I.iron,1]],
 [RED_DUST,'レッドストーンダスト',[I.redstone,1]], [RED_TORCH,'レッドストーントーチ',[I.redstone,1,I.stick,1]], [REPEATER,'リピーター',[I.redstone,2,3,1,I.stick,1]], [LEVER,'レバー',[I.stick,1,8,1]], [STONE_BUTTON,'石のボタン',[3,2]], [PRESSURE,'石の感圧板',[3,2]], [PISTON,'ピストン',[7,3,I.iron,1,I.redstone,1,I.stick,4]], [STICKY_PISTON,'粘着ピストン',[PISTON,1,5,1]], [OBSERVER,'オブザーバー',[3,6,I.redstone,2]], [DISPENSER,'ディスペンサー',[3,7,I.redstone,1]], [COMPARATOR,'コンパレーター',[I.redstone,3,3,3,8,1]], [DROPPER,'ドロッパー',[3,7,I.redstone,1]], [HOPPER,'ホッパー',[I.iron,5,3,1]], [RED_LAMP,'レッドストーンランプ',[I.redstone,4,3,1]], [TARGET,'ターゲット',[7,1,4,4]],
 [I.apple,'リンゴ',[4,1]], [I.bread,'パン',[7,3]],
 [I.rail,'レール',[I.iron,6,I.stick,1]], [I.poweredRail,'パワードレール',[I.gold,6,I.stick,1,I.redstone,1]],
 [I.detectorRail,'検知レール',[I.iron,6,3,1,I.redstone,1]], [I.activatorRail,'アクティベーターレール',[I.iron,6,I.stick,2,I.redstone,1]], [I.minecart,'トロッコ',[I.iron,5]], [CHEST,'チェスト',[7,4]], [I.bucket,'バケツ',[I.iron,3]], [I.shield,'盾',[7,3,I.iron,1]]
];
function canCraft(r){const a=r[2];for(let i=0;i<a.length;i+=2)if((invCount[a[i]]||0)<a[i+1])return false;return true}
function craft(r){if(!canCraft(r))return toast('材料が足りません');const a=r[2];for(let i=0;i<a.length;i+=2)take(a[i],a[i+1]);give(r[0]);if(!isItem(r[0])||ITEMS[r[0]].type==='block'||ITEMS[r[0]].type==='transport')hot[sel]=r[0];toast(r[1]+'を作成しました')}
let craftCat='all';
const CATS=[['all','すべて'],['redstone','⚡レッドストーン'],['food','🍖食料'],['block','🧱ブロック'],['transport','🚋輸送'],['weapon','⚔武器'],['tool','⛏ツール'],['armor','🛡防具'],['material','素材']];
function recipeCat(r){const id=r[0],q=ITEMS[id];if(id===RED_DUST||id===RED_TORCH||id===REPEATER||id===LEVER||id===STONE_BUTTON||id===PRESSURE||id===PISTON||id===STICKY_PISTON||id===OBSERVER||id===DISPENSER||id===COMPARATOR||id===DROPPER||id===HOPPER||id===RED_LAMP||id===TARGET)return 'redstone';if([RAIL,POWERED_RAIL,DETECTOR_RAIL,ACTIVATOR_RAIL].includes(id)||q?.type==='transport')return 'transport';if(q?.type==='food')return 'food';if(q?.type==='weapon')return 'weapon';if(q?.type==='tool')return 'tool';if(q?.type==='armor')return 'armor';if(q?.type==='material')return 'material';if(q?.type==='block')return 'block';return 'block'}
function drawCraft(){let t=document.getElementById('tabs'),c=document.getElementById('craft');if(!t||!c)return;t.innerHTML='';CATS.forEach(([id,n])=>{const b=document.createElement('button');b.textContent=n;b.className=craftCat===id?'on':'';b.onclick=()=>{craftCat=id;drawCraft()};t.appendChild(b)});c.innerHTML='';recipes.filter(r=>craftCat==='all'||recipeCat(r)===craftCat).forEach(r=>{const b=document.createElement('button');b.textContent=(isItem(r[0])?ITEMS[r[0]].icon+' ':'')+r[1];b.disabled=!canCraft(r);b.onclick=()=>craft(r);c.appendChild(b)})}

function equip(id){const q=ITEMS[id];if(!q)return;if(q.type==='food'){const n=q.heal||3;if((invCount[id]||0)>0&&(hp<20||hunger<10)){take(id,1);const oldHp=hp,oldHunger=hunger;hp=Math.min(20,hp+n);hunger=Math.min(10,hunger+2);updateHp();toast(q.name+'を食べた'+(hp>oldHp?'（HP +'+(hp-oldHp)+'）':'')+(hunger>oldHunger?'（満腹度 +'+(hunger-oldHunger)+'）':''))}else if(hunger>=10&&hp>=20)toast('満腹です');return}if(q.type==='block'||q.type==='transport'||q.type==='material'){hot[sel]=id;draw();return}let k=q.type==='shield'?'shield':q.type==='weapon'?'weapon':q.name.includes('ヘルメット')?'helmet':q.name.includes('チェスト')?'chest':q.name.includes('レギンス')?'legs':'boots';equipped[k]=id;toast(q.name+'を装備しました');draw()}

const atlasStyle=Object.assign(document.createElement('style'),{textContent:`.ic{background-image:url(${AU});image-rendering:pixelated}`});document.head.appendChild(atlasStyle);
const ICT=id=>(id&255)===CHEST?BT[CHEST][3]:BT[id&255][1];
const icon=id=>`<i class="ic" style="background-position:${(ICT(id)%CO)*100/(CO-1)}% ${RW>1?Math.floor(ICT(id)/CO)*100/(RW-1):0}%;background-size:${CO*100}% ${RW*100}%"></i>${id>255?`<u>${shL(id>>8)}</u>`:''}`;
const slots=[],nmEl=document.getElementById('nm'),invEl=document.getElementById('inv');
for(let i=0;i<9;i++){const e=document.createElement('div');e.className='s';e.onclick=()=>setSel(i);bar.appendChild(e);slots.push(e)}
function draw(){slots.forEach((e,k)=>{const id=hot[k];e.innerHTML=`<b>${k+1}</b>`+(isItem(id)?itemIcon(id):icon(id));e.classList.toggle('on',k==sel)});if(nmEl)nmEl.textContent='選択中: '+(isItem(hot[sel])?ITEMS[hot[sel]].name:(NM[hot[sel]]||'なし'));const q=document.getElementById('equip');if(q)q.textContent='装備: 武器='+(equipped.weapon?ITEMS[equipped.weapon].name:'なし')+' / 防具='+[equipped.helmet,equipped.chest,equipped.legs,equipped.boots].filter(Boolean).length+'/4'}
function setSel(i){sel=(i+9)%9;draw()}
const grid=document.getElementById('grid');
// 初期化時は旧インベントリUIのgridを参照しない。新インベントリはrenderInventory()で描画する。
function toggleInv(){inv=!inv;invEl.style.display=inv?'flex':'none';
 if(inv){if(document.pointerLockElement)document.exitPointerLock();requestAnimationFrame(()=>{if(inv)renderInventory()})}else{try{cv.requestPointerLock()}catch(e){}}}

setSel(sel);
if(typeof refreshSaveInfo==='function')refreshSaveInfo();
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
const chestUI=document.getElementById('chestUI'),chestBody=document.getElementById('chestBody');let chestKey=null;
function openChest(x,y,z){chestKey=x+','+y+','+z;const bsx=getB(x,y,z)&255;if(!chests[chestKey])chests[chestKey]=Array(CONTB.get(bsx)||27).fill(null);chestUI.querySelector('h2').textContent=NMS[bsx]||'チェスト';inv=true;invEl.style.display='none';chestUI.style.display='flex';if(document.pointerLockElement)document.exitPointerLock();renderChest()}
function closeChest(){chestKey=null;chestUI.style.display='none';inv=false;try{cv.requestPointerLock()}catch(e){}}
function breakChest(x,y,z){const k=x+','+y+','+z,ch=chests[k];if(ch)for(const sl of ch)if(sl)spawnDrop(sl[0],sl[1],x+.5,y+.7,z+.5);delete chests[k];give(CHEST,1)}
function chestPut(id,all){const ch=chests[chestKey];if(!ch||!(invCount[id]>0))return;let n=all?Math.min(invCount[id],64):1,moved=0;
 for(const sl of ch)if(sl&&sl[0]===id&&sl[1]<64&&n>moved){const m=Math.min(64-sl[1],n-moved);sl[1]+=m;moved+=m}
 for(let i=0;i<ch.length&&moved<n;i++)if(!ch[i]){const m=Math.min(64,n-moved);ch[i]=[id,m];moved+=m}
 if(!moved)return toast('チェストがいっぱいです');take(id,moved);renderChest()}
function chestGet(i,all){const ch=chests[chestKey],sl=ch&&ch[i];if(!sl)return;const n=all?sl[1]:1;give(sl[0],n);sl[1]-=n;if(sl[1]<=0)ch[i]=null;renderChest()}
function renderChest(){const ch=chests[chestKey];if(!ch)return;chestBody.innerHTML='';
 const t1=document.createElement('div');t1.className='invTitle';t1.textContent='チェストの中身';chestBody.appendChild(t1);
 const g1=document.createElement('div');g1.className='chGrid';
 ch.forEach((sl,i)=>{const e=document.createElement('div');e.className='it';if(sl){e.title=ITEMS[sl[0]]?ITEMS[sl[0]].name:(NM[sl[0]]||'');e.innerHTML=invIcon(sl[0]).replace(/<u>.*?<\/u>/,'')+`<u>${sl[1]}</u>`}
  e.onclick=()=>chestGet(i,true);e.oncontextmenu=ev=>{ev.preventDefault();chestGet(i,false)};g1.appendChild(e)});chestBody.appendChild(g1);
 const t2=document.createElement('div');t2.className='invTitle';t2.textContent='持ち物（クリックでチェストへ）';chestBody.appendChild(t2);
 const g2=document.createElement('div');g2.className='chGrid';
 Object.keys(invCount).map(Number).filter(id=>invCount[id]>0).forEach(id=>{const e=document.createElement('div');e.className='it';e.title=ITEMS[id]?ITEMS[id].name:(NM[id]||'');e.innerHTML=invIcon(id).replace(/<u>.*?<\/u>/,'')+`<u>${invCount[id]}</u>`;
  e.onclick=()=>chestPut(id,true);e.oncontextmenu=ev=>{ev.preventDefault();chestPut(id,false)};g2.appendChild(e)});chestBody.appendChild(g2)}
// ---- dropped items ----
const droppedItems=[],DG=new THREE.BoxGeometry(.22,.22,.22),DMs={},dropMat=c=>DMs[c]||(DMs[c]=new THREE.MeshLambertMaterial({color:c}));
const dropColors={};
function itemColor(id){
 const q=ITEMS[id];
 if(q?.type==='food')return 0xc88a3a;
 if(q?.type==='weapon')return 0xaaaaaa;
 if(q?.type==='tool')return 0x777777;
 if(q?.type==='armor')return 0x888888;
 if(q?.type==='material')return 0xb050d0;
 return 0x8b8b8b;
}
function spawnDrop(id,n,x,y,z,vx=0,vz=0,vy0=1.8){
 if(!n)return;
 const g=new THREE.Group();
 const m=new THREE.Mesh(DG,dropMat(itemColor(id)));
 g.add(m);scene.add(g);
 droppedItems.push({id,n,g,x,y,z,vy:vy0,vx,vz,t:Math.random()*6.28,spin:1.6,gt:0,gy:y,age:0});
}
function dropSelected(){
 const id=hot[sel];
 if(id==null)return;
 if(!ITEMS[id] && !(invCount[id]>0)){toast('落とせるアイテムがありません');return}
 if(!take(id,1))return;
 spawnDrop(id,1,P.x+Math.sin(P.yaw)*.8,P.y+1.0,P.z+Math.cos(P.yaw)*.8);
 toast((ITEMS[id]?.name||'アイテム')+'を落としました');
}
function dropTick(dt){
 for(let i=droppedItems.length-1;i>=0;i--){
  const d=droppedItems[i];d.t+=dt*d.spin;if((d.age+=dt)>240){scene.remove(d.g);droppedItems.splice(i,1);continue}
  if((d.gt-=dt)<=0){d.gt=.5;d.gy=surfY(Math.floor(d.x),Math.floor(d.z))+1.05}const gy=d.gy;
  d.y+=d.vy*dt;d.vy-=12*dt;if(d.vx||d.vz){d.x+=d.vx*dt;d.z+=d.vz*dt;const fr=Math.max(0,1-3*dt);d.vx*=fr;d.vz*=fr}
  if(d.y<gy){d.y=gy;d.vy=0}
  updFlow(d,Math.floor(d.x),[d.y-.2,d.y-1.1,d.y-1.9],Math.floor(d.z),dt);if(d.fx||d.fz){const nx=d.x+d.fx*dt,nz=d.z+d.fz*dt,fy=Math.floor(d.y-.5);if(!solid(getB(Math.floor(nx),fy,Math.floor(d.z))))d.x=nx;if(!solid(getB(Math.floor(d.x),fy,Math.floor(nz))))d.z=nz}
  d.g.position.set(d.x,d.y+.12*Math.sin(d.t*2),d.z);d.g.rotation.y=d.t;
  if(Math.hypot(d.x-P.x,d.y-P.y,d.z-P.z)<1.45){give(d.id,d.n);scene.remove(d.g);droppedItems.splice(i,1);toast((ITEMS[d.id]?.name||'アイテム')+'を拾った')}
 }
}
