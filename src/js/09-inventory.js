// ---- 改良版インベントリUI ----
const invBody=document.getElementById('invBody'), invTabs=document.getElementById('invTabs');
let invPage='all', craftSlots=Array.isArray(pendingCraftSlots)?Array.from({length:4},(_,i)=>Number.isInteger(pendingCraftSlots[i])&&pendingCraftSlots[i]>0?pendingCraftSlots[i]:null):[null,null,null,null];
const INV_CATS=[['all','すべて'],['building','建材系'],['circuit','回路系'],['func','機能系'],['food','食料系'],['transport','輸送系'],['combat','戦闘・防御系'],['other','その他'],['inventory','インベントリ'],['world','ワールド']];
const CIRCUIT=new Set([RED_DUST,RED_TORCH,REPEATER,LEVER,STONE_BUTTON,PRESSURE,PISTON,STICKY_PISTON,OBSERVER,DISPENSER,COMPARATOR,DROPPER,HOPPER,RED_LAMP,TARGET,nmid('レッドストーンブロック'),nmid('TNT'),I.redstone]),FUNC=new Set([CHEST,nmid('作業台'),nmid('かまど'),nmid('本棚'),I.bucket,I.waterBucket,I.lavaBucket,nmid('スポンジ')]);
function itemCategory(id){
  if(new Set([RAIL,POWERED_RAIL,DETECTOR_RAIL,ACTIVATOR_RAIL,I.rail,I.poweredRail,I.detectorRail,I.activatorRail,I.minecart]).has(id))return 'transport';
  if(CIRCUIT.has(id))return 'circuit';
  const q=ITEMS[id];
  if(FUNC.has(id))return 'func';if(!q)return 'building';
  if(q.type==='food')return 'food';
  if(q.type==='weapon'||q.type==='armor'||q.type==='shield')return 'combat';
  if(q.type==='transport')return 'transport';
  if(q.type==='block')return 'building';
  return 'other';
}
const RAIL_ITEM_IDS=new Set([I.rail,I.poweredRail,I.detectorRail,I.activatorRail]);
function allAvailableIds(){return [...new Set([...PL,...Object.keys(ITEMS).map(Number)])].filter(id=>id!=null&&!RAIL_ITEM_IDS.has(id))}
function invIcon(id){return isItem(id)?itemIcon(id):icon(id)}
function selectInvItem(id){
  if(isItem(id)){equip(id)}else{hot[sel]=id;draw();toast((NM[id]||'不明なアイテム')+'をホットバーに追加')}
  if(invPage!=='inventory')renderInventory();
}
function renderTabs(){invTabs.innerHTML='';INV_CATS.forEach(([id,n])=>{const b=document.createElement('button');b.textContent=n;b.className=invPage===id?'on':'';b.onclick=()=>{invPage=id;renderInventory()};invTabs.appendChild(b)})}
function makeItemGrid(ids){const g=document.createElement('div');g.className='catGrid';ids.forEach(id=>{const e=document.createElement('div');e.className='it';e.title=isItem(id)?ITEMS[id].name:(NM[id]||'不明なアイテム');e.innerHTML=invIcon(id)+(isItem(id)?'':`<u>${invCount[id]||0}</u>`);e.onclick=()=>selectInvItem(id);g.appendChild(e)});return g}
function renderInventory(){
 renderTabs();invBody.innerHTML='';
 if(invPage==='world'){renderWorldInfo();return}
 if(invPage==='inventory'){renderPlayerInventory();return}
 let ids=allAvailableIds().filter(id=>invPage==='all'||itemCategory(id)===invPage);
 invBody.appendChild(makeItemGrid(ids));
}
function renderWorldInfo(){
 const d=document.createElement('div');d.className='equipPanel';
 const editsCount=[...edits.values()].reduce((n,m)=>n+m.size,0), chestCount=Object.keys(chests).length;
 d.innerHTML=`<div class="invTitle">ワールド情報</div><div>座標：X ${P.x.toFixed(1)} / Y ${P.y.toFixed(1)} / Z ${P.z.toFixed(1)}</div><div>ワールド変更ブロック：${editsCount.toLocaleString()}個</div><div>チェスト：${chestCount}個</div><div>セーブキー：${SK}</div>`;
 invBody.appendChild(d);
 const title=document.createElement('div');title.className='invTitle';title.textContent='インベントリ内容';invBody.appendChild(title);
 const rows=document.createElement('div');rows.className='catGrid';
 const ids=Object.keys(invCount).map(Number).filter(id=>invCount[id]>0).sort((a,b)=>a-b);
 if(!ids.length){rows.textContent='インベントリは空です';invBody.appendChild(rows);return}
 rows.style.gridTemplateColumns='repeat(auto-fill,minmax(120px,1fr))';
 ids.forEach(id=>{const e=document.createElement('div');e.className='it';e.style.aspectRatio='auto';e.style.minHeight='58px';e.innerHTML=invIcon(id)+`<span style="position:absolute;left:4px;right:4px;bottom:3px;font-size:10px;color:#fff;text-shadow:1px 1px #000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${ITEMS[id]?.name||NM[id]||'アイテム'} × ${invCount[id]}</span>`;e.onclick=()=>selectInvItem(id);rows.appendChild(e)});
 invBody.appendChild(rows);
}
function renderPlayerInventory(){
  const ep=document.createElement('div');ep.className='equipPanel';ep.innerHTML='<div class="invTitle">装備</div>';
  const names=[['weapon','武器'],['shield','盾（Shiftで構える）'],['helmet','ヘルメット'],['chest','チェストプレート'],['legs','レギンス'],['boots','ブーツ']];
  names.forEach(([k,n])=>{const id=equipped[k];const d=document.createElement('div');d.textContent=n+'：'+(id?ITEMS[id].name:'なし');ep.appendChild(d)});invBody.appendChild(ep);

  const title=document.createElement('div');title.className='invTitle';title.textContent='インベントリ（3×9・27スロット）';invBody.appendChild(title);
  const pg=document.createElement('div');pg.className='playerInvGrid';
  const owned=Object.keys(invCount).map(Number).filter(id=>invCount[id]>0);
  for(let i=0;i<27;i++){
    const id=owned[i]||null;const d=document.createElement('div');d.className='slot';d.title=id?(ITEMS[id]?.name||NM[id]||'アイテム'):'空きスロット';
    if(id)d.innerHTML=invIcon(id);
    d.onclick=()=>{if(id)selectInvItem(id)};
    pg.appendChild(d);
  }
  invBody.appendChild(pg);

  const hbTitle=document.createElement('div');hbTitle.className='invTitle';hbTitle.textContent='ホットバー（プレイ中も使用）';invBody.appendChild(hbTitle);
  const hb=document.createElement('div');hb.className='inventoryHotbar';
  for(let i=0;i<9;i++){
    const id=hot[i];const d=document.createElement('div');d.className='slot hotSlot'+(i===sel?' selected':'');d.innerHTML=`<b>${i+1}</b>`+(id!=null?(isItem(id)?itemIcon(id):icon(id)):'');d.onclick=()=>{setSel(i);renderInventory()};hb.appendChild(d);
  }
  invBody.appendChild(hb);

  const ct=document.createElement('div');ct.className='invTitle';ct.textContent='2×2 クラフト';invBody.appendChild(ct);
  const cg=document.createElement('div');cg.className='craft2';craftSlots.forEach((id,i)=>{const d=document.createElement('div');d.className='slot';d.innerHTML=id?invIcon(id):'';d.title=id?'クリックで取り出す':'空き';d.onclick=()=>{if(id){give(id,1);craftSlots[i]=null;renderInventory()}};cg.appendChild(d)});invBody.appendChild(cg);
  const out=document.createElement('div');out.className='craftOut';const result=document.createElement('div');result.className='slot';const r=find2x2Recipe();if(r)result.innerHTML=invIcon(r[0]);result.onclick=()=>{if(r){consumeCraftSlots(r[1]);give(r[0]);craftSlots=[null,null,null,null];toast(ITEMS[r[0]]?.name||NM[r[0]]+'を作成しました');renderInventory()}};out.appendChild(result);const tx=document.createElement('span');tx.textContent=r?'→ '+(ITEMS[r[0]]?.name||NM[r[0]]):'→ レシピなし';out.appendChild(tx);invBody.appendChild(out);
  // クラフト欄の下にはレシピ一覧を表示しない。材料を2×2に入れて完成品だけを作れる仕様。

}
function consumeCraftSlots(need){for(const [id,n] of need){let left=n;for(let i=0;i<4&&left;i++)if(craftSlots[i]===id){craftSlots[i]=null;left--}}}
function find2x2Recipe(){
  const a=craftSlots.filter(Boolean); if(!a.length)return null;
  for(const r of recipes){const req=[];for(let i=0;i<r[2].length;i+=2)req.push([r[2][i],r[2][i+1]]);const total=req.reduce((s,x)=>s+x[1],0);if(total!==a.length)continue;const aa={};a.forEach(x=>aa[x]=(aa[x]||0)+1);if(req.every(x=>(aa[x[0]]||0)===x[1]))return [r[0],req]}
  return null;
}
// 2x2クラフトへアイテムを投入する補助：インベントリ内アイテムをShiftクリック相当で追加
function putInCraft(id){const q=ITEMS[id];if(!q||!(invCount[id]>0))return;const i=craftSlots.findIndex(x=>x===null);if(i<0)return toast('クラフト欄がいっぱいです');take(id,1);craftSlots[i]=id;renderInventory()}
// インベントリのアイテムクリックは装備/使用を優先。空き2x2へ入れたい場合は右クリック。
function renderPlayerInventoryOld(){return}
const _equip=equip;equip=function(id){if(invPage==='inventory'&&ITEMS[id]&&ITEMS[id].type!=='food'&&ITEMS[id].type!=='weapon'&&ITEMS[id].type!=='armor'&&ITEMS[id].type!=='shield'&&craftSlots.length){putInCraft(id);return}return _equip(id)};
const _toggleInv=toggleInv;toggleInv=function(){if(chestKey){closeChest();return}inv=!inv;invEl.style.display=inv?'flex':'none';if(inv){if(document.pointerLockElement)document.exitPointerLock();requestAnimationFrame(()=>{if(inv)renderInventory()})}else{try{cv.requestPointerLock()}catch(e){}}};
// Eで開閉。死亡時は必ず閉じる。
const _respawn=respawn;respawn=function(){inv=false;invEl.style.display='none';chestKey=null;chestUI.style.display='none';_respawn()};

window.addEventListener('error',function(e){
 const m=document.getElementById('msg');
 const b=document.getElementById('startBtn');
 if(m&&b&&!gameStarted){m.style.display='flex';b.disabled=false;b.textContent='ゲームスタート';}
});
