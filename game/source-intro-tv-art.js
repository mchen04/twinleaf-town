/* overlay59 TV assets/registers are original. Numeric BG tie order, RGB6
 * arithmetic and RGB8 expansion are the declared native2D software convention,
 * not an independently measured DS display/DAC or screenshot color match. */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f(require('./source-menu-art.js'));else r.SourceIntroTvArt=f(r.SourceMenuArt);})(typeof globalThis!=='undefined'?globalThis:this,function(Menu){
'use strict';
function need(v,m){if(!v)throw Error('SourceIntroTvArt: '+m);}
function bytes(s){need(typeof s==='string'&&s.length%4===0,'base64');const b=typeof atob==='function'?atob(s):Buffer.from(s,'base64').toString('binary');return Uint8Array.from(b,c=>c.charCodeAt(0));}
function block(a,magic,tag){const d=new DataView(a.buffer,a.byteOffset,a.byteLength),txt=p=>String.fromCharCode(...a.slice(p,p+4));need(a.length>=16&&txt(0)===magic&&d.getUint16(4,true)===0xfeff&&d.getUint32(8,true)===a.length&&d.getUint16(12,true)===16,'Nitro header');let q=16,out=null;for(let i=0;i<d.getUint16(14,true);i++){need(q+8<=a.length,'block header');const n=d.getUint32(q+4,true);need(n>=8&&q+n<=a.length,'block extent');if(txt(q)===tag){need(out===null,'duplicate block');out={d,p:q+8,end:q+n};}q+=n;}need(q===a.length&&out,'block set');return out;}
function load(data,fontData){
 need(Menu&&data?.schema==='source-intro-tv-v1'&&fontData?.schema==='source-options-native2d-v1','bound data');
 const get=i=>{const r=data.assets[i],b=bytes(r.base64);need(b.length===r.bytes,'asset length');return b;};
 const tiles=[0,1,2].map((i)=>{const a=get(i),b=block(a,'RGCN','RAHC'),fmt=b.d.getUint32(b.p+4,true),n=b.d.getUint32(b.p+16,true),off=b.d.getUint32(b.p+20,true);need(fmt===(i===0?4:3)&&b.d.getUint32(b.p+12,true)===0&&n===[49152,1024,32][i]&&off>=24&&b.p+off+n===b.end,'character layout');return a.slice(b.p+off,b.p+off+n);});
 const maps=[3,4,5].map(i=>{const a=get(i),b=block(a,'RCSN','NRCS');need(b.d.getUint16(b.p,true)===256&&b.d.getUint16(b.p+2,true)===256&&b.d.getUint32(b.p+4,true)===(i===3?1:0)&&b.d.getUint32(b.p+8,true)===2048&&b.p+12+2048===b.end,'screen layout');return Array.from({length:1024},(_,j)=>b.d.getUint16(b.p+12+j*2,true));});
 const p=get(6),pb=block(p,'RLCN','TTLP'),po=pb.p+pb.d.getUint32(pb.p+12,true);need(pb.d.getUint32(pb.p+8,true)===512&&po+512===pb.end,'full 256-color palette');const palette=Array.from({length:256},(_,i)=>pb.d.getUint16(po+i*2,true));
 const fp=bytes(fontData.assets.fontPalette0.base64),fb=block(fp,'RLCN','TTLP'),fo=fb.p+fb.d.getUint32(fb.p+12,true);need(fo+32<=fb.end,'explicit font palette upload');for(let i=0;i<16;i++)palette[16+i]=fb.d.getUint16(fo+i*2,true);palette[0]=0; // BG_SetMaskColor, both engines.
 const font=Menu.parseFont(bytes(fontData.assets.font0.base64)),codes=data.codes.map(line=>line.slice());need(codes.length===6,'six report lines');for(const line of codes)for(const c of line)need(Number.isInteger(c)&&c>=1&&c<=font.count,'font code');
 for(let i=0;i<3;i++)for(const e of maps[i])need((e&1023)<tiles[i].length/(i===0?64:32)&&(i!==0||(e>>>12)===0),'tile reference');
 const widths=codes.map(line=>line.reduce((n,c)=>n+font.widths[c-1],0)),x=Math.floor((256-Math.max(...widths))/2);need(x>=0,'multiline block width');
 const text=new Uint16Array(256*192);for(let row=0;row<codes.length;row++){let dx=x;for(const c of codes[row]){const w=font.widths[c-1];for(let y=0;y<16;y++)for(let xx=0;xx<w;xx++){const at=16+(c-1)*64+((y>>>3)*2+(xx>>>3))*16+(y&7)*2,v=(font.bytes[at]|font.bytes[at+1]<<8)>>>(14-2*(xx&7))&3,index=[0,15,2,0][v];if(index)text[(48+row*16+y)*256+dx+xx]=16+index;}dx+=w;}}
 function sample(layer,x,y){const i=layer===3?0:layer===0?1:2,e=maps[i][(y>>>3)*32+(x>>>3)],xx=e&1024?7-(x&7):x&7,yy=e&2048?7-(y&7):y&7,t=e&1023;let p;if(i===0)p=tiles[i][t*64+yy*8+xx];else p=tiles[i][t*32+yy*4+(xx>>>1)]>>>((xx&1)*4)&15;return p?(i===0?p:(e>>>12)*16+p):0;}
 function rgb(index){return Menu.paletteWordToNative(palette[index]);}
 function blend(a,b){let p=0xff000000;for(let c=0;c<3;c++)p|=Math.min(63,(((a>>>(c*8)&63)*4+(b>>>(c*8)&63)*12)>>>4))<<(c*8);return p>>>0;}
 function render(s){need(s&&s.resources&&Number.isSafeInteger(s.scrollY)&&typeof s.textVisible==='boolean','live scene');const main=new Uint32Array(256*192),sub=new Uint32Array(256*192);sub.fill(0xff000000);const counts={bg0:0,bg1:0,bg2:0,bg3:0,backdrop:0,blended:0};
  for(let y=0;y<192;y++)for(let x=0;x<256;x++){const layers=[[0,sample(0,x,y)],[1,sample(1,x,(y+s.scrollY)&255)],[2,s.textVisible?text[y*256+x]:0],[3,sample(3,x,y)]].filter(v=>v[1]);let v=0xff000000;if(layers.length){const [id,index]=layers[0];counts['bg'+id]++;v=rgb(index);if(id===1&&layers.length>1&&(layers[1][0]===2||layers[1][0]===3)){v=blend(v,rgb(layers[1][1]));counts.blended++;}}else counts.backdrop++;main[y*256+x]=v;}
  return {width:256,height:192,format:'R6_G6_B6_A8_le32',main,sub,counts,text:{x,y:48,widths:widths.slice(),lineHeight:16},brightnessApplied:false,pipeline:'native2D-software-convention'};
 }
 function rgba(result,brightness){need(Number.isInteger(brightness)&&brightness>=-16&&brightness<=0,'master brightness');const out=new Uint8Array(256*384*4);for(let i=0;i<256*384;i++){const p=i<49152?result.main[i]:result.sub[i-49152];for(let c=0;c<3;c++){let v=p>>>(c*8)&255;need(v<=63,'RGB6');v-=Math.floor((v*(-brightness)+15)/16);out[i*4+c]=(v<<2)|(v>>>4);}out[i*4+3]=255;}return out;}
 return Object.freeze({render,rgba,metadata:()=>({widths:widths.slice(),textX:x,paletteWords:palette.slice(),characterBytes:tiles.map(t=>t.length),bgPriority:[1,1,1,1],blend:{first:1,second:[2,3],eva:4,evb:12},colorParity:'not established'})});
}
return Object.freeze({load});
});
