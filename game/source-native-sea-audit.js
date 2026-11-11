(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-native-bytes.js'),require('./source-native-sea-data.js'));
 else root.SourceNativeSeaAudit=factory(root.SourceNativeBytes,root.SourceNativeSeaData);
})(typeof globalThis!=='undefined'?globalThis:this,function(Bytes,Data){
 'use strict';
 const key='4f12cd322cbad92cdd0d',metadataSHA256='37e3452e4fd1e23b8e0ceb7d6790e815efaadd66852868033d8ba6a2147f5bf4';
 const typed=Object.getPrototypeOf(Uint8Array.prototype),byteLength=Object.getOwnPropertyDescriptor(typed,'byteLength').get;
 const own=Object.getOwnPropertyDescriptor,keys=Reflect.ownKeys,getPrototype=Object.getPrototypeOf,functionSource=Function.prototype.toString,apply=Reflect.apply;
 const prototypeSnapshots=new WeakMap();
 function capturePrototype(prototype){const names=keys(prototype),descriptors=names.map(name=>own(prototype,name));return{names,descriptors};}
 prototypeSnapshots.set(Uint8Array.prototype,capturePrototype(Uint8Array.prototype));
 prototypeSnapshots.set(Uint8ClampedArray.prototype,capturePrototype(Uint8ClampedArray.prototype));
 const limits=Object.freeze([
  'Only target4f12cd322cbad92cdd0d,16x16 opaque format3, retained area6 sea palette and eight exact source RGBA frames are admitted.',
  'Byte admission and fresh private descriptors only; graph, material, UV, camera, loader membership and source-area lifecycle admission are separate.',
  'The pure copied SourceSeaAnimation helper generates requests on active calls10 through80, independent of sea visibility; no render clock or quadrant reset is implied.',
  'Transfer requests do not certify transfer queue admission, display-fetch phase, original hardware output or real-browser acceptance.'
 ]);
 function check(condition,message){if(!condition)throw Error('Native sea unsupported: '+message);}
 function field(value,name,required){
  const descriptor=own(value,name);
  check(!required||descriptor,'missing '+String(name));
  check(!descriptor||Object.hasOwn(descriptor,'value'),'descriptor accessors are not admitted');
  return descriptor&&descriptor.value;
 }
 function snapshot(value,depth){
  check(depth<24,'source metadata nesting');
  if(value===null||typeof value==='string'||typeof value==='boolean')return value;
  if(typeof value==='number'){check(Number.isFinite(value),'nonfinite source metadata');return value;}
  check(value&&typeof value==='object','source metadata value');
  const array=Array.isArray(value),out=array?[]:Object.create(null),names=keys(value);
  check(names.length<256,'source metadata width');
  for(const name of names){
   if(array&&name==='length')continue;
   check(typeof name==='string'&&name!=='toJSON','source metadata field');
   if(array)check(/^(0|[1-9][0-9]*)$/.test(name)&&Number(name)===out.length,'source metadata array');
   out[name]=snapshot(field(value,name,true),depth+1);
  }
  if(array)check(field(value,'length',true)===out.length,'source metadata array length');
  return out;
 }
 function ascii(text){
  const result=new Uint8Array(text.length);
  for(let i=0;i<text.length;i++){const code=text.charCodeAt(i);check(code<128,'source metadata encoding');result[i]=code;}
  return result;
 }
 check(Bytes&&typeof Bytes.copy==='function'&&typeof Bytes.sha256==='function'&&typeof Bytes.isBytes==='function'&&typeof Bytes.freeze==='function','portable byte verifier is not loaded');
 check(Data&&typeof Data==='object','portable source data is not loaded');
 const metadata=snapshot(field(Data,'metadata',true),0);
 check(Bytes.sha256(ascii(JSON.stringify(metadata)))===metadataSHA256,'source metadata identity');
 Bytes.freeze(metadata);
 const records=metadata.records,frames=metadata.frames,record=records[0],paletteSHA256=metadata.retained_palette.sha256;
 const encoded=field(Data,'rgbaHex',true);
 check(Array.isArray(encoded)&&field(encoded,'length',true)===8&&keys(encoded).length===9,'source frame data inventory');
 const privateFrames=[];
 for(let index=0;index<8;index++){
  const text=field(encoded,String(index),true);
  check(typeof text==='string'&&text.length===2048&&/^[0-9a-f]+$/.test(text),'source frame encoding');
  const pixels=new Uint8Array(1024);
  for(let i=0;i<1024;i++)pixels[i]=parseInt(text.slice(i*2,i*2+2),16);
  check(Bytes.sha256(pixels)===frames[index].rgba_sha256,'source frame bytes differ');
  privateFrames.push(Bytes.copy(pixels));
 }
 function bytes(value){
  check(Bytes.isBytes(value),'requires unshared RGBA8 byte storage');
  check(byteLength.call(value)===1024,'exact RGBA byte count');
  const names=keys(value);
  check(names.length===1024&&names.every((name,index)=>name===String(index)),'overridden byte storage or hooks');
  const prototype=getPrototype(value),properties=prototype&&keys(prototype);
  const extensions=['toBase64','setFromBase64','toHex','setFromHex'];
  check(properties&&properties.includes('constructor')&&properties.includes('BYTES_PER_ELEMENT')&&properties.every(name=>name==='constructor'||name==='BYTES_PER_ELEMENT'||extensions.includes(name))&&field(prototype,'BYTES_PER_ELEMENT',true)===1,'overridden byte prototype or hooks');
  const constructor=field(prototype,'constructor',true);
  check(typeof constructor==='function'&&/^function Uint8(?:Clamped)?Array\(\) \{ \[native code\] \}$/.test(functionSource.call(constructor))&&field(constructor,'prototype',true)===prototype,'overridden byte constructor');
  for(const name of properties){
   if(!extensions.includes(name))continue;
   const descriptor=own(prototype,name),method=field(prototype,name,true);
   check(functionSource.call(constructor)==='function Uint8Array() { [native code] }'&&typeof method==='function'&&functionSource.call(method)==='function '+name+'() { [native code] }'&&descriptor.writable===true&&descriptor.enumerable===false&&descriptor.configurable===true,'overridden byte prototype or hooks');
  }
  const known=prototypeSnapshots.get(prototype);
  if(known){
   check(known.names.length===properties.length&&known.names.every((name,index)=>name===properties[index]),'byte prototype changed after trusted snapshot');
   for(let i=0;i<properties.length;i++){
    const before=known.descriptors[i],after=own(prototype,properties[i]);
    check(after&&before.value===after.value&&before.get===after.get&&before.set===after.set&&before.writable===after.writable&&before.enumerable===after.enumerable&&before.configurable===after.configurable,'byte prototype changed after trusted snapshot');
   }
  }
  if(!known||!known.realmChecked){
   let constructorError=null;
   try{apply(constructor,null,[]);}catch(error){constructorError=error;}
   check(constructorError&&typeof constructorError==='object','native constructor realm probe');
   const errorPrototype=getPrototype(constructorError);
   for(const name of properties){
    if(!extensions.includes(name))continue;
    let methodError=null;
    try{apply(field(prototype,name,true),null,[]);}catch(error){methodError=error;}
    check(methodError&&typeof methodError==='object'&&getPrototype(methodError)===errorPrototype,'native byte method belongs to another realm');
   }
   const admitted=known||capturePrototype(prototype);admitted.realmChecked=true;prototypeSnapshots.set(prototype,admitted);
  }
  return Bytes.copy(value);
 }
 function intake(texture,k){
  check(k===key,'exact source texture key');
  check(texture&&typeof texture==='object'&&!Array.isArray(texture),'explicit texture descriptor');
  const allowed=['width','height','data','format','key','texture_key','palette_sha256','retained_palette_sha256','seaFrame','rgba_sha256','translucent','cutout'];
  const names=keys(texture);
  check(names.length>=3&&names.length<=allowed.length&&names.every(name=>allowed.includes(name)),'unsupported texture fields');
  const values=Object.create(null);
  for(const name of names)values[name]=field(texture,name,true);
  check(values.width===16&&values.height===16&&Object.hasOwn(values,'data'),'source dimensions/data');
  if(Object.hasOwn(values,'format'))check(values.format===3,'source format');
  for(const name of ['key','texture_key'])if(Object.hasOwn(values,name))check(values[name]===key,'source key claim');
  for(const name of ['palette_sha256','retained_palette_sha256'])if(Object.hasOwn(values,name))check(values[name]===paletteSHA256,'retained source palette');
  for(const name of ['translucent','cutout'])if(Object.hasOwn(values,name))check(values[name]===false,'opaque source metadata');
  const data=bytes(values.data),hash=Bytes.sha256(data),index=frames.findIndex(frame=>frame.rgba_sha256===hash);
  check(index>=0,'pixels are not an exact source sea frame');
  if(Object.hasOwn(values,'seaFrame'))check(values.seaFrame===index,'source frame claim');
  if(Object.hasOwn(values,'rgba_sha256'))check(values.rgba_sha256===hash,'source RGBA claim');
  return {index,data};
 }
 function verify(texture,k){
  check(arguments.length===2,'verify requires texture and key');
  const admitted=intake(texture,k);
  return Object.freeze({...record,seaFrame:admitted.index});
 }
 function frameDescriptor(index){
  check(arguments.length===1&&Number.isInteger(index)&&index>=0&&index<8,'source frame index');
  return Object.freeze({width:16,height:16,data:Bytes.copy(privateFrames[index]),format:3,key,seaFrame:index,palette_sha256:paletteSHA256});
 }
 function copyDescriptor(texture,k){
  check(arguments.length===2,'copyDescriptor requires texture and key');
  const admitted=intake(texture,k);
  return Object.freeze({width:16,height:16,data:admitted.data,format:3,key,seaFrame:admitted.index,palette_sha256:paletteSHA256});
 }
 return Object.freeze({key,records,frames,limits,metadata,metadataSHA256,verify,frameDescriptor,copyDescriptor});
});
