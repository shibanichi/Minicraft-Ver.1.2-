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
