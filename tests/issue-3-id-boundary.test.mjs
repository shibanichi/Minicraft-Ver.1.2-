import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

test('the largest registered base block ID stays within the existing 8-bit encoding (#3 investigation)',()=>{
 const src=readFileSync('src/js/01-block-registry.js','utf8');
 const iconSrc=readFileSync('src/js/04-0-player-ui.js','utf8');
 const ctx={THREE:{},innerWidth:1024,document:{createElement:()=>({getContext:()=>({createImageData:()=>({data:new Uint8ClampedArray(1024)})})})}};
 vm.createContext(ctx);vm.runInContext(src,ctx);
 assert.equal(vm.runInContext("nmid('鉄のトラップドア')",ctx),255);
 assert.equal(vm.runInContext('BT.length-1',ctx),255);
 assert.equal(vm.runInContext('PL.every(v=>BT[v&255]!=null)',ctx),true);
 assert.equal(vm.runInContext("PL.find(v=>(v&255)===255&&(v>>8)>=13)",ctx),255|(13<<8));
 vm.runInContext(iconSrc.slice(iconSrc.indexOf('const ICT='),iconSrc.indexOf('const slots=')),ctx);
 assert.match(vm.runInContext("icon(255|(13<<8))",ctx),/class="ic"/);
});
