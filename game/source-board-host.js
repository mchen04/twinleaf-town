(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-board-selector.js'),require('./source-board-raster.js'),require('./field-ui-data.js'));else root.SourceBoardHost=factory(root.SourceBoardSelector,root.SourceBoardRaster,root.FieldUIData);})(typeof globalThis!=='undefined'?globalThis:this,function(Selector,Raster,Font){
'use strict';
// Explicit browser-host boundary, not a replacement original map-object manager.
function integerY(yFx12){
 if(!Number.isInteger(yFx12)||yFx12<-2147483648||yFx12>2147483647)throw Error('SourceBoardHost: signed32 runtime Y required');
 // map_object.c MapObject_GetPositionVectorYCoordUInt: signed >>3, C division,
 // then u32 return. Do not substitute raw initial event Y for runtime position.
 return Math.trunc((yFx12>>3)/4096)>>>0;
}
function resolve({headerId,player,playerYFx12,objects,permissionRows}){
 if(!Array.isArray(objects))throw Error('SourceBoardHost: ordered runtime objects required');
 return Selector.select({headerId,x:player.x,z:player.y,facing:player.facing,integerY:integerY(playerYFx12),
  getMetatileBehavior:(x,z)=>{const word=permissionRows?.[z]?.[x];if(!Number.isInteger(word)||word<0||word>65535)throw Error('SourceBoardHost: source permission word required');return word&255;},
  firstObjectAt:(x,z)=>objects.find(o=>o.x===x&&o.z===z)||null});
}
// The strict compiler returns authored characters/metrics, not numeric font
// slots. Bind each exact character back to the pinned font1 table at the adapter
// boundary. No normalization, substitute glyph, or precolored atlas is used.
function rasterGlyphs(text){
 if(!text||text.fontId!==1||!Array.isArray(text.glyphs)||Font.font_id!==1)throw Error('SourceBoardHost: strict font1 layout required');
 return text.glyphs.map(g=>{if(typeof g.char!=='string'||[...g.char].length!==1)throw Error('SourceBoardHost: exact authored character required');const metric=Font.glyphs[g.char];
  if(!metric||!Number.isInteger(metric.code)||metric.code<1||metric.code>509||g.width!==metric.width||g.height!==metric.height||g.advance!==metric.advance)throw Error('SourceBoardHost: exact font1 character metrics required');
  return {code:metric.code,x:g.x,y:g.y,width:g.width};
 });
}
/** Pure upper-display composition. Source BG3 scroll offset is SUBTRACTED from
 * tilemap Y. Clip in native 256x192 before the host applies brightness/mask/2x.
 * No mutable cache, script/task update, DOM, helper UI, or audio belongs here.
 */
function composite(snapshot,rgba){
 if(!snapshot?.overlayPresent)return rgba;
 if(!rgba||rgba.length!==256*192*4)throw Error('SourceBoardHost: native upper RGBA required');
 const b=snapshot.board,t=snapshot.text;
 if(!b?.drawing||!b.allocation||!t||![-48,-32,-16,0].includes(b.yOffset))throw Error('SourceBoardHost: complete supported board state required');
 const picture=Raster.render({frameType:b.drawing.frameType,window:b.allocation,glyphs:rasterGlyphs(t)}),out=new Uint8ClampedArray(rgba),top=picture.sourceY-b.yOffset;
 for(let sy=0;sy<picture.height;sy++){
  const dy=top+sy;if(dy<0||dy>=192)continue;
  for(let x=0;x<256;x++){
   const s=(sy*256+x)*4,d=(dy*256+x)*4,a=picture.rgba[s+3];
   if(a===255)out.set(picture.rgba.subarray(s,s+4),d);
   else if(a!==0)throw Error('SourceBoardHost: original indexed pixels must be opaque or transparent');
  }
 }
 return out;
}
return Object.freeze({integerY,resolve,rasterGlyphs,composite});
});
