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
