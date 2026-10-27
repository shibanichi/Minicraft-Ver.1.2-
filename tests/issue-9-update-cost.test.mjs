import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

test('reapplying unchanged block state does not remesh or trigger work (#9)',()=>{
 const world=readFileSync('src/js/03-world.js','utf8');
 const code=world.slice(world.indexOf('function setB('),world.indexOf('let queue=[]'));
 assert.ok(code.startsWith('function setB('));
 const chunk={cx:0,cz:0,top:4,v:true,d:new Uint16Array(16*80*16)};
 let meshCount=0,rsCount=0,fluidCount=0;
 const ctx={H:80,Set,Map,C:new Map(),edits:new Map(),blockLightDirty:false,lightMeshDirty:new Set(),
  ck:(cx,cz)=>cx+','+cz,getC:(cx,cz)=>cx===0&&cz===0?chunk:null,
  idx:(x,y,z)=>x+16*(z+16*y),rsReg:()=>rsCount++,fluidDirty:()=>fluidCount++,
  mesh:()=>meshCount++};
 vm.runInNewContext(code,ctx);
 ctx.setB(2,3,4,1);
 assert.equal(meshCount,1);
 for(let i=0;i<100;i++)ctx.setB(2,3,4,1);
 assert.equal(meshCount,1);
 assert.equal(rsCount,1);
 assert.equal(fluidCount,1);
 assert.equal(chunk.d[2+16*(4+16*3)],1);
 ctx.setB(2,3,4,2);
 assert.equal(meshCount,2);
 assert.equal(rsCount,2);
});
