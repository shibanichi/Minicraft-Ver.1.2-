// ---- テクスチャパック読み込み（Java版リソースパック .zip / ブロックPNG） ----
const FM={};
(function(){
 ['grass_block_top#g|grass_top#g','grass_block_side#s','dirt','stone','oak_log|log_oak','oak_log_top|log_oak_top','oak_leaves#l|leaves_oak#l','sand','oak_planks|planks_oak','cobblestone','bricks|brick','bedrock','coal_ore','iron_ore','gold_ore','diamond_ore','gravel','sandstone|sandstone_normal','glass','obsidian','white_wool|wool_colored_white','red_wool|wool_colored_red','blue_wool|wool_colored_blue','glowstone','stone_bricks|stonebrick','water_still#w','lava_still'].forEach((f,t)=>FM[t]=f);
 const ent=(jp,a,b,c)=>{const id=nmid(jp);if(!id||!BT[id])return;const q=BT[id];FM[q[0]]=a;FM[q[1]]=b||a;FM[q[2]]=c||a};
 `安山岩 andesite
磨かれた安山岩 polished_andesite
閃緑岩 diorite
磨かれた閃緑岩 polished_diorite
花こう岩 granite
磨かれた花こう岩 polished_granite
深層岩 deepslate_top,deepslate
深層岩の丸石 cobbled_deepslate
磨かれた深層岩 polished_deepslate
深層岩レンガ deepslate_bricks
凝灰岩 tuff
方解石 calcite
鍾乳石 dripstone_block
滑らかな玄武岩 smooth_basalt
ブラックストーン blackstone_top,blackstone
磨かれたブラックストーン polished_blackstone
磨かれたブラックストーンレンガ polished_blackstone_bricks
ネザーラック netherrack
ソウルサンド soul_sand
ネザーレンガ nether_bricks
赤いネザーレンガ red_nether_bricks
クォーツブロック quartz_block_top,quartz_block_side,quartz_block_bottom
マグマブロック magma
ネザーウォートブロック nether_wart_block
歪んだウォートブロック warped_wart_block
真紅の板材 crimson_planks
歪んだ板材 warped_planks
真紅の幹 crimson_stem_top,crimson_stem
歪んだ幹 warped_stem_top,warped_stem
エンドストーン end_stone
エンドストーンレンガ end_stone_bricks
プルプァブロック purpur_block
泣く黒曜石 crying_obsidian
赤い砂 red_sand
赤い砂岩 red_sandstone_top,red_sandstone
滑らかな砂岩 sandstone_top
きめ細かい砂岩 cut_sandstone
滑らかな赤い砂岩 red_sandstone_top
粘土 clay
泥 mud
泥レンガ mud_bricks
固めた泥 packed_mud
苔ブロック moss_block
雪ブロック snow
氷 ice
氷塊 packed_ice
青氷 blue_ice
ポドゾル podzol_top,podzol_side,dirt
菌糸 mycelium_top,mycelium_side,dirt
粗い土 coarse_dirt
根付いた土 rooted_dirt
苔むした石レンガ mossy_stone_bricks
ひび割れた石レンガ cracked_stone_bricks
模様入り石レンガ chiseled_stone_bricks
苔むした丸石 mossy_cobblestone
プリズマリン prismarine
プリズマリンレンガ prismarine_bricks
ダークプリズマリン dark_prismarine
シーランタン sea_lantern
鉄ブロック iron_block
金ブロック gold_block
ダイヤモンドブロック diamond_block
エメラルドブロック emerald_block
ネザライトブロック netherite_block
銅ブロック copper_block
風化した銅ブロック exposed_copper
錆びた銅ブロック weathered_copper
酸化した銅ブロック oxidized_copper
切り込み入り銅 cut_copper
ラピスラズリブロック lapis_block
レッドストーンブロック redstone_block
石炭ブロック coal_block
アメジストブロック amethyst_block
鉄の原石ブロック raw_iron_block
金の原石ブロック raw_gold_block
銅の原石ブロック raw_copper_block
ラピスラズリ鉱石 lapis_ore
レッドストーン鉱石 redstone_ore
エメラルド鉱石 emerald_ore
銅鉱石 copper_ore
深層岩の石炭鉱石 deepslate_coal_ore
深層岩の鉄鉱石 deepslate_iron_ore
深層岩の金鉱石 deepslate_gold_ore
深層岩のダイヤモンド鉱石 deepslate_diamond_ore
深層岩のレッドストーン鉱石 deepslate_redstone_ore
深層岩のラピスラズリ鉱石 deepslate_lapis_ore
深層岩のエメラルド鉱石 deepslate_emerald_ore
深層岩の銅鉱石 deepslate_copper_ore
ネザーの金鉱石 nether_gold_ore
ネザークォーツ鉱石 nether_quartz_ore
古代の残骸 ancient_debris_top,ancient_debris_side
竹の板材 bamboo_planks
竹ブロック bamboo_block_top,bamboo_block
テラコッタ terracotta
本棚 oak_planks,bookshelf
TNT tnt_top,tnt_side,tnt_bottom
カボチャ pumpkin_top,pumpkin_side
スイカ melon_top,melon_side
干し草の俵 hay_block_top,hay_block_side
作業台 crafting_table_top,crafting_table_front,oak_planks
かまど furnace_top,furnace_front,furnace_top
スポンジ sponge
骨ブロック bone_block_top,bone_block_side
スライムブロック slime_block
ハチミツブロック honey_block_top,honey_block_side,honey_block_bottom
サボテン cactus_top,cactus_side,cactus_bottom
シュルームライト shroomlight
レッドストーンランプ redstone_lamp
レッドストーンダスト redstone_dust_dot
レッドストーントーチ redstone_torch
リピーター repeater
レバー lever
石のボタン stone
石の感圧板 stone
ピストン piston_top,piston_side,piston_bottom
粘着ピストン piston_top_sticky,piston_side,piston_bottom
オブザーバー observer_top,observer_side,observer_back
ディスペンサー furnace_top,dispenser_front
コンパレーター comparator
ドロッパー furnace_top,dropper_front
ホッパー hopper_top,hopper_outside
ターゲット target_top,target_side
レール rail
パワードレール powered_rail
検知レール detector_rail
アクティベーターレール activator_rail`.split('\n').forEach(l=>{const[jp,f]=l.trim().split(' ');if(jp)ent(jp,...f.split(','))});
 [['トウヒ','spruce','p'],['シラカバ','birch','b'],['ジャングル','jungle','l'],['アカシア','acacia','l'],['ダークオーク','dark_oak','l'],['マングローブ','mangrove','l'],['サクラ','cherry','']].forEach(([j,e,t])=>{ent(j+'の板材',e+'_planks');ent(j+'の原木',e+'_log_top',e+'_log');ent(j+'の葉',e+'_leaves'+(t?'#'+t:''))});
 [['白','white'],['橙','orange'],['赤紫','magenta'],['空色','light_blue'],['黄','yellow'],['黄緑','lime'],['桃','pink'],['灰','gray'],['薄灰','light_gray'],['青緑','cyan'],['紫','purple'],['青','blue'],['茶','brown'],['緑','green'],['赤','red'],['黒','black']].forEach(([j,e])=>{ent(j+'色の羊毛',e+'_wool');ent(j+'色のコンクリート',e+'_concrete');ent(j+'色のテラコッタ',e+'_terracotta');ent(j+'色の色付きガラス',e+'_stained_glass')});
 [['オーク','oak'],['トウヒ','spruce'],['シラカバ','birch'],['ジャングル','jungle'],['アカシア','acacia'],['ダークオーク','dark_oak'],['マングローブ','mangrove'],['サクラ','cherry'],['竹','bamboo'],['真紅','crimson'],['歪んだ','warped'],['鉄','iron']].forEach(([j,e])=>ent(j+'のトラップドア',e+'_trapdoor'));
})();
const TINT={g:[145,189,89],l:[119,171,47],p:[97,153,97],b:[128,167,85],w:[63,118,228]},PK='minicraft_pack';
const FILES=new Set(['grass_block_side_overlay']);Object.values(FM).forEach(s=>s.split('|').forEach(x=>FILES.add(x.split('#')[0])));
async function readZip(buf){const dv=new DataView(buf),u8=new Uint8Array(buf);let e=u8.length-22;while(e>=0&&dv.getUint32(e,true)!==0x06054b50)e--;if(e<0)throw new Error('zip');
 const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);const out=new Map();
 for(let i=0;i<n;i++){if(dv.getUint32(p,true)!==0x02014b50)break;
  const meth=dv.getUint16(p+10,true),csz=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true),name=new TextDecoder().decode(u8.subarray(p+46,p+46+nl));p+=46+nl+xl+cl;
  const m=name.match(/textures\/block\/([^\/]+)\.png$/i);if(!m)continue;
  const st=lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true),raw=u8.subarray(st,st+csz);let data=raw;
  if(meth===8)data=new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());else if(meth!==0)continue;
  out.set(m[1].toLowerCase(),data)}
 return out}
function tintCanvas(cv,t){const c=cv.getContext('2d'),d=c.getImageData(0,0,cv.width,cv.height),a=d.data;for(let i=0;i<a.length;i+=4){a[i]=a[i]*t[0]/255;a[i+1]=a[i+1]*t[1]/255;a[i+2]=a[i+2]*t[2]/255}c.putImageData(d,0,0)}
function refreshAtlas(){tex.dispose();tex.needsUpdate=true;atlasStyle.textContent=`.ic{background-image:url(${ac.toDataURL()});image-rendering:pixelated}`}
async function applyPack(map){
 const bm={};for(const[k,v]of map){if(!FILES.has(k))continue;try{bm[k]=await createImageBitmap(new Blob([v],{type:'image/png'}))}catch(e){}}
 const hits=[];for(let t=0;t<N;t++){const sp=FM[t];if(!sp)continue;for(const nm of sp.split('|')){const[f,fl]=nm.split('#');if(bm[f]){hits.push([t,bm[f],fl||'',f]);break}}}
 if(!hits.length)return 0;
 let T=16;hits.forEach(h=>T=Math.max(T,Math.min(128,Math.min(h[1].width,h[1].height))));
 const base=document.createElement('canvas');base.width=16*CO;base.height=16*RW;base.getContext('2d').putImageData(im,0,0);
 ac.width=T*CO;ac.height=T*RW;const g=ac.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(base,0,0,ac.width,ac.height);
 const tc=document.createElement('canvas');tc.width=tc.height=T;const x2=tc.getContext('2d');
 const draw=(b,fl)=>{const sw=Math.min(b.width,b.height);x2.clearRect(0,0,T,T);x2.imageSmoothingEnabled=false;x2.drawImage(b,0,0,sw,sw,0,0,T,T);if(TINT[fl])tintCanvas(tc,TINT[fl])};
 for(const[t,b,fl,f]of hits){const cx=(t%CO)*T,cy=Math.floor(t/CO)*T;if(f.includes('glass'))g.clearRect(cx,cy,T,T);
  draw(b,fl==='s'?'':fl);g.drawImage(tc,cx,cy);
  if(fl==='s'&&bm.grass_block_side_overlay){draw(bm.grass_block_side_overlay,'g');g.drawImage(tc,cx,cy)}}
 refreshAtlas();
 try{localStorage.setItem(PK,JSON.stringify({n:N,d:ac.toDataURL('image/png')}))}catch(e){toast('※容量の都合で、次回起動時は標準テクスチャに戻ります')}
 return hits.length}
async function packFiles(files){toast('テクスチャパックを読み込み中…');const map=new Map();
 try{for(const f of files){const n=f.name.toLowerCase();if(n.endsWith('.zip'))(await readZip(await f.arrayBuffer())).forEach((v,k)=>map.set(k,v));else if(n.endsWith('.png'))map.set(n.replace(/\.png$/,''),new Uint8Array(await f.arrayBuffer()))}}
 catch(e){return toast('読み込みに失敗しました（zipが壊れているか未対応の形式です）')}
 const c=await applyPack(map);toast(c?c+'種類のテクスチャを適用しました':'対応するブロックテクスチャが見つかりません（assets/minecraft/textures/block/ のPNGが必要です）')}
function resetPack(){try{localStorage.removeItem(PK)}catch(e){}ac.width=16*CO;ac.height=16*RW;ac.getContext('2d').putImageData(im,0,0);refreshAtlas();toast('標準テクスチャに戻しました')}
try{const sp=JSON.parse(localStorage.getItem(PK)||'null');if(sp&&sp.n===N){const i2=new Image();i2.onload=()=>{ac.width=i2.width;ac.height=i2.height;const g=ac.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(i2,0,0);refreshAtlas()};i2.src=sp.d}}catch(e){}
{const fi=Object.assign(document.createElement('input'),{type:'file',accept:'.zip,.png,image/png,application/zip',multiple:true});fi.style.display='none';document.body.appendChild(fi);
 fi.onchange=()=>{if(fi.files.length)packFiles([...fi.files]);fi.value=''};
 const mk=(t,fn,st)=>{const b=document.createElement('button');b.type='button';b.textContent=t;if(st)b.style.cssText=st;b.onclick=e=>{e.stopPropagation();fn()};return b};
 if(resetWorldBtn&&resetWorldBtn.parentNode){resetWorldBtn.parentNode.insertBefore(mk('🎨 テクスチャパックを読み込む',()=>fi.click()),resetWorldBtn);resetWorldBtn.parentNode.insertBefore(mk('標準テクスチャに戻す',resetPack),resetWorldBtn)}
 const w=document.createElement('div');w.style.cssText='margin-top:12px;font-size:12px';w.append(mk('🎨 テクスチャパックを読み込む',()=>fi.click(),'margin:2px'),mk('標準に戻す',resetPack,'margin:2px'),Object.assign(document.createElement('div'),{textContent:'Java版リソースパック(.zip)・ブロックPNG対応／画面へのドラッグ&ドロップも可',style:'margin-top:4px;opacity:.8'}));msg.appendChild(w);
 addEventListener('dragover',e=>e.preventDefault());addEventListener('drop',e=>{e.preventDefault();if(e.dataTransfer&&e.dataTransfer.files.length)packFiles([...e.dataTransfer.files])})}
