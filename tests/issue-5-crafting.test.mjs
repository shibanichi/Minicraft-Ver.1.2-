import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

test('items placed in 2x2 crafting slots persist across a reload (#5)', () => {
 const src=readFileSync('src/js/04-player-ui.js','utf8');
 const inv=readFileSync('src/js/09-inventory.js','utf8');
 const funcs=src.slice(src.indexOf('function save(man){'),src.indexOf('// ワールド読込は'));
 const decl=inv.split('\n').find(line=>line.includes("let invPage='all'"));
 assert.ok(decl);
 const store=new Map();
 const sandbox={localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},
   SK:'minicraft_v2',noSave:false,edits:new Map(),chests:{},P:{x:0,y:30,z:0,yaw:0,pitch:0},
   hot:[1,2,3,4,5,6,7,8,9],sel:0,invCount:{1001:2},equipped:{},
   hunger:10,hungerTimer:0,refreshSaveInfo:()=>{},toast:()=>{},pendingCraftSlots:null,
   Math,JSON,Map,Object
 };
 vm.createContext(sandbox);
 vm.runInContext(funcs,sandbox);
 vm.runInContext("let craftSlots=[1001,null,1001,null];",sandbox);
 sandbox.save(false);
 assert.deepEqual(JSON.parse(store.get(sandbox.SK)).craftSlots,[1001,null,1001,null]);
 vm.runInContext("craftSlots=[null,null,null,null]; pendingCraftSlots=null;",sandbox);
 assert.equal(sandbox.load(),true);
 vm.runInContext(decl.replace("let invPage=","invPage="),sandbox);
 const restored=vm.runInContext("Array.from(craftSlots)",sandbox);
 assert.deepEqual(restored,[1001,null,1001,null]);
 assert.equal(sandbox.invCount[1001],2);
});
