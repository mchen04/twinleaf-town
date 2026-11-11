(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-board-data.js'));else root.SourceBoardText=factory(root.SourceBoardData);})(typeof globalThis!=='undefined'?globalThis:this,function(Data){
'use strict';
function fail(message) { throw new Error('SourceBoardText: ' + message); }
/** Uses ONLY the existing strict compiler, never its timed Controller/create().
 * No art, RGBA colors, wrapping, normalization, paging, or glyph fallback.
 * Geometry can be the consumer's cached allocation, which source state1 reuses.
 */
function layout(key,names,fontData,compile,geometry=Data.get(key).window) {
  const board = Data.get(key);
  if (!fontData || fontData.font_id!==1 || fontData.line_height!==16 || fontData.letter_spacing!==0) fail('source font1 metrics required');
  if (typeof compile!=='function') fail('strict compile dependency required');
  const bindings = {};
  if (board.nameRole) {
    if (!names || !Object.prototype.hasOwnProperty.call(names,board.nameRole) || typeof names[board.nameRole]!=='string' || !names[board.nameRole].length) fail('explicit '+board.nameRole+' required');
    bindings[0]=names[board.nameRole];
  }
  if (!geometry || ![160,216].includes(geometry.width) || geometry.height!==32) fail('verified board window geometry required');
  const commands=compile(board.tokens,{glyphs:fontData.glyphs,bindings});
  // speed0's RenderFont loop is capped at 0x400 calls, including EOS.
  if (commands.filter(c=>c.type==='glyph').length+1>0x400) fail('source immediate print limit exceeded');
  let x=0,y=0;
  const glyphs=[],runs=[];
  for (const command of commands) {
    if (command.type==='newline') { x=0;y+=16; }
    else if (command.type==='glyph') {
      glyphs.push({...command,x,y}); x+=command.advance;
    } else fail('only authored glyphs and LF are supported for these boards');
    if (x>255 || y>255) fail('layout exceeds bounded source u8 cursor range');
  }
  for (const glyph of glyphs) {
    const run = runs[runs.length-1];
    if (run && run.y===glyph.y && run.x+run.advance===glyph.x) { run.text+=glyph.char;run.advance+=glyph.advance; }
    else runs.push({text:glyph.char,x:glyph.x,y:glyph.y,advance:glyph.advance});
  }
  return Data.freeze({key,messageBank:board.messageBank,messageIndex:board.messageIndex,bindings,
    fontId:1,speed:0,printerFinished:true,arrow:null,commands,glyphs,runs,
    text:runs.map(run=>run.text).join('\n'),cursor:{x,y},
    clip:{x:0,y:0,width:geometry.width,height:geometry.height},
    visibleGlyphs:glyphs.filter(g=>g.x<geometry.width && g.y<geometry.height && g.x+g.width>0 && g.y+g.height>0),
    colorIndices:{foreground:1,background:15,shadow:2},paletteSlot:9,
  });
}
return {layout};
});
