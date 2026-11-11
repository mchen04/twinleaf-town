/* Bounded overlay19 BG0 consumer. Source PNG indices + committed NSCR/NCLR,
 * not original generated NCGR bytes, a captured frame, or an emulator runtime.
 * render consumes a signed accepted MASTER_BRIGHT snapshot; it advances no clock.
 */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./native-lower-screen-data.js'));
 else root.NativeLowerScreen=factory(root.NativeLowerScreenData);
})(typeof globalThis!=='undefined'?globalThis:this,function(Data){
'use strict';

const WIDTH=256,HEIGHT=192,TILES=64;
const CONTRACT=Object.freeze({schema:'source-no-poketch-4bpp-v1',width:WIDTH,height:HEIGHT,
 bgMapWidth:256,bgMapHeight:256,bgMapBufferBytes:2048,tileCount:TILES,
 mapPayloadBytes:1536,palettePhysicalBytes:32,paletteDeclaredBytes:480,
 paletteDataOffset:40,paletteBlockEnd:72});
const INFO=Object.freeze({...CONTRACT,mapEntries:768,bg:0,engine:'sub',priority:0,
 sourceKind:'indexed-source-translation',generatedNcgrByteParity:false,
 paletteBanks:Object.freeze([0]),brightnessRange:Object.freeze([-16,0]),
 limitations:Object.freeze(['Only ordinary no-Poketch static field background.',
  'Source indices translated without running the original NCGR/LZ converters.',
  'Only the physical 32-byte palette and visible 1536-byte NSCR payload are consumed.',
  'No acquired Poketch, native menu, hardware timing or video-color parity claim.'])});

function hexBytes(value,length,label){
 if(typeof value!=='string'||value.length!==length*2||!/^[0-9a-f]+$/.test(value)){
  throw new TypeError(label+' must encode exactly '+length+' bytes in lowercase hex');
 }
 const out=new Uint8Array(length);
 for(let i=0;i<length;i++)out[i]=parseInt(value.slice(i*2,i*2+2),16);
 return out;
}
function create(data=Data){
 if(!data||typeof data!=='object')throw new TypeError('Missing no-Poketch source data');
 for(const key of Object.keys(CONTRACT)){
  if(data[key]!==CONTRACT[key])throw new TypeError('Unsupported no-Poketch '+key);
 }
 const tiles=hexBytes(data.tilesHex,TILES*32,'Source 4bpp tiles');
 const map=hexBytes(data.mapHex,1536,'Visible NSCR payload');
 const palette=hexBytes(data.paletteHex,32,'Physical NCLR palette');
 const rgb6=new Uint8Array(16*3);
 for(let i=0;i<16;i++){
  const word=palette[i*2]|(palette[i*2+1]<<8);
  // Pinned source has bit 15 clear. Reject unsupported palette metadata rather
  // than silently dropping that bit (the supplied 2D consumer uses it in green).
  if(word&0x8000)throw new RangeError('Unsupported NCLR palette bit 15');
  rgb6[i*3]=(word&31)<<1;
  rgb6[i*3+1]=((word>>5)&31)<<1;
  rgb6[i*3+2]=((word>>10)&31)<<1;
 }
 const indices=new Uint8Array(WIDTH*HEIGHT);
 for(let cell=0;cell<768;cell++){
  const entry=map[cell*2]|(map[cell*2+1]<<8),tile=entry&1023;
  if(entry>>12)throw new RangeError('Uninitialized no-Poketch palette bank');
  if(tile>=TILES)throw new RangeError('No-Poketch tile reference outside source data');
  const tx=(cell%32)*8,ty=Math.floor(cell/32)*8;
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){
   const sx=(entry&0x400)?7-x:x,sy=(entry&0x800)?7-y:y;
   const pair=tiles[tile*32+sy*4+(sx>>1)];
   const index=(pair>>((sx&1)*4))&15;
   // Index 0 leaves the only remaining plane: sub BG palette 0 backdrop. It is
   // retained as palette 0 with opaque display output, not alpha 0.
   indices[(ty+y)*WIDTH+tx+x]=index;
  }
 }
 function render(brightness=0){
  if(!Number.isInteger(brightness)||brightness< -16||brightness>0){
   throw new RangeError('No-Poketch brightness must be a signed integer from -16 to 0');
  }
  const factor=-brightness,colors=new Uint8Array(16*3);
  for(let i=0;i<rgb6.length;i++){
   const c=rgb6[i],d=c-((c*factor+15)>>4);
   colors[i]=(d<<2)|(d>>4);
  }
  const rgba=new Uint8ClampedArray(WIDTH*HEIGHT*4);
  for(let i=0;i<indices.length;i++){
   const color=indices[i]*3,p=i*4;
   rgba[p]=colors[color];rgba[p+1]=colors[color+1];rgba[p+2]=colors[color+2];rgba[p+3]=255;
  }
  return Object.freeze({width:WIDTH,height:HEIGHT,rgba});
 }
 return Object.freeze({render,inspect:()=>INFO});
}
// Pin the shipped decoded source payload independently of its own metadata.
// CRC checks detect transfer/data corruption; they are not a security boundary.
function crc32(bytes){
 let c=0xffffffff;
 for(const byte of bytes){c^=byte;for(let bit=0;bit<8;bit++)c=(c>>>1)^((c&1)?0xedb88320:0);}
 return (c^0xffffffff)>>>0;
}
let initial;
try{
 initial=create();
 const checks=[['tilesHex',2048,0xb7ea40fa],['mapHex',1536,0xe87138af],['paletteHex',32,0x1346d751]];
 for(const [key,size,expected]of checks){
  if(crc32(hexBytes(Data[key],size,key))!==expected)throw new Error('Source payload checksum mismatch: '+key);
 }
}catch(error){throw new Error('Invalid or missing NativeLowerScreenData: '+error.message);}
return Object.freeze({create,render:initial.render,inspect:initial.inspect});
});
