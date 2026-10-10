import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';

test('HP and world time survive save/load, including legacy fallback (#7)', () => {
 const src = readFileSync('src/js/04-0-player-ui.js','utf8');
 const code = src.slice(src.indexOf('function save(man){'),src.indexOf('// ワールド読込は'));
 assert.ok(code.startsWith('function save(man){'));
 const state = new Map();
 const ctx = {
  SK:'minicraft_v2', localStorage:{getItem:k=>state.get(k)||null,setItem:(k,v)=>state.set(k,v)},
  noSave:false, edits:new Map(), chests:{}, RS:new Map(), invCount:{},
  equipped:{}, hot:[1,2,3,4,5,6,7,8,9], sel:0, hunger:7,hungerTimer:12,
  hp:6,worldClock:950,TOTAL_CYCLE:1200,craftSlots:[null,null,null,null],pendingCraftSlots:null,
  P:{x:1,y:40,z:2,yaw:0,pitch:0},
  refreshSaveInfo:()=>{},toast:()=>{},Number,Math,JSON,Map,Object
 };
 runInNewContext(code,ctx);
 ctx.save(false);
 ctx.hp=20;ctx.worldClock=0;
 assert.equal(ctx.load(),true);
 assert.equal(ctx.hp,6);assert.equal(ctx.worldClock,950);
 const legacy=JSON.parse(state.get(ctx.SK));
 delete legacy.hp;delete legacy.worldClock;
 state.set(ctx.SK,JSON.stringify(legacy));
 ctx.hp=3;ctx.worldClock=55;
 assert.equal(ctx.load(),true);
 assert.equal(ctx.hp,20);assert.equal(ctx.worldClock,0);
});
