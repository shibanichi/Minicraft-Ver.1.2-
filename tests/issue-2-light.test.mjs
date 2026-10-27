import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

test('batch world updates invalidate lighting on lamp transitions (#2)', () => {
  const src=readFileSync('src/js/06-circuits.js','utf8');
  const code=src.slice(src.indexOf('function applyChanges(ch){'),src.indexOf('const contAt='));
  assert.ok(code.startsWith('function applyChanges(ch){'));
  const data=new Uint16Array(16*80*16),c={cx:0,cz:0,top:6,v:true,d:data};
  const dirty=new Set();
  const ctx={H:80,Math,Set,Map,blockLightDirty:false,lightMeshDirty:dirty,
    idx:(x,y,z)=>x+16*(z+16*y),ck:(x,z)=>x+','+z,
    getC:(x,z)=>x===0&&z===0?c:null,
    edits:new Map(),rsReg:()=>{},fluidDirty:()=>{},mesh:()=>{},
    isLightSource:v=>v===257};
  vm.runInNewContext(code,ctx);
  ctx.applyChanges([[3,4,5,257]]);
  assert.equal(ctx.blockLightDirty,true);
  assert.ok(dirty.has('0,0'));
  assert.equal(data[3+16*(5+16*4)],257);
  ctx.blockLightDirty=false;dirty.clear();
  ctx.applyChanges([[3,4,5,0]]);
  assert.equal(ctx.blockLightDirty,true);
  assert.ok(dirty.has('0,0'));
});
