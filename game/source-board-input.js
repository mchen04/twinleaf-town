(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SourceBoardInput=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const KEYS=Object.freeze(['A','B','UP','DOWN','LEFT','RIGHT','X']);
function check(key) { if(!KEYS.includes(key)) throw new Error('SourceBoardInput: unsupported key '+key); }
/** sub_0203AA0C's branch priority. Only this invocation's newKeys are inspected. */
function readNewKeys(input={}) {
  const keys=input.newKeys===undefined?[]:input.newKeys;
  if(!Array.isArray(keys)) throw new Error('SourceBoardInput: newKeys array required');
  keys.forEach(check);
  if(input.repeat===true) return null; // Explicit host repeat event is never a fresh source key.
  if(keys.includes('A')||keys.includes('B')) return {result:0,facing:null};
  for(const [facing,key] of ['UP','DOWN','LEFT','RIGHT'].entries()) {
    if(keys.includes(key)) return {result:0,facing};
  }
  return keys.includes('X')?{result:1,facing:null}:null;
}
/** Optional host edge adapter, not a claim about original input scan timing.
 * Call sample() at EVERY input acquisition boundary, even while scripts are opening.
 * Never retain a sample for a later input-native invocation.
 */
class KeyEdges {
  constructor(){this.held=new Set();this.pending=new Set();}
  down(key,{repeat=false}={}){check(key);if(repeat||this.held.has(key))return;this.held.add(key);this.pending.add(key);}
  up(key){check(key);this.held.delete(key);}
  sample(){const input={newKeys:[...this.pending],heldKeys:[...this.held]};this.pending.clear();return input;}
  reset(){this.held.clear();this.pending.clear();}
}
return {KEYS,readNewKeys,KeyEdges};
});
