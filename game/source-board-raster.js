(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-board-assets.js'));
  else root.SourceBoardRaster=factory(root.SourceBoardAssets);
})(typeof globalThis!=='undefined'?globalThis:this,function(Data){
  'use strict';
  function fail(s){throw new Error('SourceBoardRaster: '+s);}
  function bytes(s){
    if(typeof Buffer!=='undefined')return Uint8Array.from(Buffer.from(s,'base64'));
    return Uint8Array.from(atob(s),c=>c.charCodeAt(0));
  }
  const tiles=bytes(Data.tileIndicesBase64),font=bytes(Data.font.indicesBase64);
  function geometry(w){
    if(!w||![16,72].includes(w.x)||w.y!==152||![160,216].includes(w.width)||w.height!==32||((w.x===16)!==(w.width===216)))fail('source cached allocation required');
    return w;
  }
  /** Pure source tilemap operations. No draw, lifecycle tick, audio, DOM, or timing. */
  function tilemap(frameType,window,priorTilemap){
    if(![0,2,3].includes(frameType))fail('supported frame type 0 or 2 required');
    geometry(window);
    if(priorTilemap && (priorTilemap.length!==192 || !Array.from(priorTilemap).every(t=>Number.isInteger(t)&&t>=-2&&t<54)))fail('192 source tile references required');
    const map=priorTilemap?Int16Array.from(priorTilemap):new Int16Array(192).fill(-1);
    const x=window.x/8,y=window.y/8,w=window.width/8,h=window.height/8;
    function fill(t,xx,yy,ww,hh){
      // FillBgTilemapRect's u8 arguments then screenWidth/Height bounds.
      xx&=255;yy&=255;ww&=255;hh&=255;
      for(let sy=yy;sy<Math.min(yy+hh,32);sy++)for(let sx=xx;sx<Math.min(xx+ww,32);sx++)if(sy>=18&&sy<24)map[(sy-18)*32+sx]=t;
    }
    const left=frameType===0?9:2,middle=w+(frameType===0?7:0);
    for(const [yy,offset] of [[y-1,0],[y+h,12]])for(const [t,xx,ww] of [[0,x-left,1],[1,x-left+1,1],[2,x-left+2,middle],[3,x+w,1],[4,x+w+1,1],[5,x+w+2,1]])fill(t+offset,xx,yy,ww,1);
    for(const [t,xx] of [[6,x-left],[7,x-left+1],[9,x+w],[10,x+w+1],[11,x+w+2]])fill(t,xx,y,1,h);
    if(frameType===0){
      fill(8,x-1,y,1,h);
      for(let i=0;i<4;i++)for(let j=0;j<6;j++)fill(30+i*6+j,x-7+j,y+i,1,1);
    }
    fill(-2,x,y,w,h); // CopyWindowToVram after border and picture.
    return map;
  }
  function glyphIndex(code,x,y){
    if(!Number.isInteger(code)||code<1||code>509||!Number.isInteger(x)||x<0||x>15||!Number.isInteger(y)||y<0||y>15)fail('font1 code and cell coordinates required');
    return font[(code-1)*256+y*16+x];
  }
  function render(options){
    if(!options)fail('render options required');
    const {frameType,window,glyphs=[],priorTilemap}=options,map=tilemap(frameType,window,priorTilemap),indices=new Uint8Array(256*48);
    for(let y=0;y<48;y++)for(let x=0;x<256;x++){
      const t=map[(y>>3)*32+(x>>3)];indices[y*256+x]=t===-2?15:t===-1?0:tiles[t*64+(y&7)*8+(x&7)];
    }
    for(const g of glyphs){
      if(!g||!Number.isInteger(g.code)||g.code<1||g.code>509||!Number.isInteger(g.x)||g.x<0||g.x>255||!Number.isInteger(g.y)||g.y<0||g.y>255)fail('strict numeric source glyph layout required');
      const width=Data.font.widths[g.code-1];
      if(g.width!==undefined&&g.width!==width)fail('glyph width differs from source font1');
      for(let y=0;y<16;y++)for(let x=0;x<width;x++){
        const dx=g.x+x,dy=g.y+y,ax=window.x+dx,ay=window.y-144+dy,i=font[(g.code-1)*256+y*16+x];
        if(i && dx<window.width && dy<window.height && ax<256 && ay<48)indices[ay*256+ax]=i;
      }
    }
    const palette=Data.palettes[String(frameType)].rgba,rgba=new Uint8ClampedArray(indices.length*4);
    for(let i=0;i<indices.length;i++)rgba.set(palette[indices[i]],i*4);
    return {width:256,height:48,sourceY:144,indices,rgba,tilemap:map};
  }
  return Object.freeze({render,tilemap,glyphIndex});
});
