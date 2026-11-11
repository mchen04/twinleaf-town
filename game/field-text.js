(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./field-ui-data.js'));else root.FieldText=factory(root.FieldUIData);})(typeof globalThis!=='undefined'?globalThis:this,function(data){
'use strict';
// Source-derived glyph metrics. Canvas fallback only; DOM/ARIA retains plain text.
function normalize(text){return Array.from(String(text).replace(/'/g,'’').replace(/"/g,'”')).map(c=>c==='\n'||data.glyphs[c]?c:'?').join('');}
function measure(text){return Array.from(normalize(text)).reduce((sum,c)=>sum+(data.glyphs[c]?.advance||0),0);}
function lines(text,width=216){
 const result=[];for(const paragraph of normalize(text).split('\n')){
  let line='';for(const word of paragraph.split(/\s+/).filter(Boolean)){
   if(measure(word)>width){if(line){result.push(line);line='';}for(const c of word){if(line&&measure(line+c)>width){result.push(line);line='';}line+=c;}}
   else if(line&&measure(line+' '+word)>width){result.push(line);line=word;}else line+=(line?' ':'')+word;
  }
  result.push(line);
 }
 return result.length?result:[''];
}
function pages(text,width=216,rows=2){const wrapped=lines(text,width),result=[];for(let i=0;i<wrapped.length;i+=rows)result.push(wrapped.slice(i,i+rows).join('\n'));return result;}
function draw(ctx,atlas,text,x,y,scale=2){let pen=x;for(const c of normalize(text)){const glyph=data.glyphs[c];if(!glyph)continue;ctx.drawImage(atlas,glyph.x,glyph.y,glyph.width,glyph.height,pen,y,glyph.width*scale,glyph.height*scale);pen+=glyph.advance*scale;}return pen;}
return{normalize,measure,lines,pages,draw,data};
});
