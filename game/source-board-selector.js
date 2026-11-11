(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-board-data.js'));else root.SourceBoardSelector=factory(root.SourceBoardData);})(typeof globalThis!=='undefined'?globalThis:this,function(Data){
'use strict';
const directions = Object.freeze([[0,-1],[0,1],[-1,0],[1,0]].map(Object.freeze));
function fail(message) { throw new Error('SourceBoardSelector: ' + message); }
function inBounds(x,z) { return Number.isInteger(x) && Number.isInteger(z) && x>=0 && z>=0 && x<32 && z<32; }
/** Bounded local-cell version of sub_02036FA4 / FieldSystem_GetFacingObject /
 * sub_02037090. Host must supply its FIRST object at a tile, not a board-only list.
 * Runtime Y and flag19 are explicit; record height is not a substitute for runtime Y.
 * The single counter skip is generic source behavior, not a distance admission rule.
 * Bounds are the verified 32x32 cell for map411; no cross-cell/route inference.
 */
function select({headerId,x,z,facing,integerY,getMetatileBehavior,firstObjectAt}) {
  if (headerId !== 411 || !inBounds(x,z)) return null;
  if (!Number.isInteger(facing) || facing<0 || facing>3) fail('source direction 0..3 required');
  if (!Number.isInteger(integerY)) fail('explicit integer player Y required');
  if (typeof getMetatileBehavior!=='function' || typeof firstObjectAt!=='function') fail('explicit source tile/object resolvers required');
  const [dx,dz] = directions[facing]; let tx=x+dx,tz=z+dz;
  if (!inBounds(tx,tz)) return null;
  const behavior = getMetatileBehavior(tx,tz);
  if (!Number.isInteger(behavior) || behavior<0 || behavior>255) fail('source metatile behavior byte required');
  if (behavior===0x80) { tx+=dx;tz+=dz; }
  if (!inBounds(tx,tz)) return null;
  const object = firstObjectAt(tx,tz);
  if (object===null || object===undefined) return null;
  const board = Data.records.find(item=>item.key===object.key);
  if (!board) return null; // Preserve original manager precedence, including non-board objects.
  if (object.x!==tx || object.z!==tz || board.localTile.x!==tx || board.localTile.z!==tz) fail('board object identity/position mismatch');
  if (typeof object.flag19Disabled!=='boolean' || !Number.isInteger(object.integerY)) fail('explicit runtime object flag19 and integer Y required');
  if (!object.flag19Disabled || object.integerY!==integerY) return null;
  return board;
}
return {select,inBounds,directions};
});
