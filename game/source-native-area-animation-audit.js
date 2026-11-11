(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-native-bytes.js'),require('./source-native-area-animation-data.js'),require('./source-native-sea-audit.js'),require('./source-native-pond-audit.js'));
 else root.SourceNativeAreaAnimationAudit=factory(root.SourceNativeBytes,root.SourceNativeAreaAnimationData,root.SourceNativeSeaAudit,root.SourceNativePondAudit);
})(typeof globalThis!=='undefined'?globalThis:this,function(Bytes,Data,Sea,Pond){
 'use strict';
 const metadataSHA256='967c6e8924c38259d026d545d558670c1eb591d09dd812743023a2f8e3d9bdcc';
 const own=Object.getOwnPropertyDescriptor,keys=Reflect.ownKeys,prototype=Object.getPrototypeOf,functionSource=Function.prototype.toString,apply=Reflect.apply;
 const prototypeSnapshots=new WeakMap();
 function capturePrototype(p){const names=keys(p),descriptors=names.map(name=>own(p,name));return{names,descriptors};}
 prototypeSnapshots.set(Uint8Array.prototype,capturePrototype(Uint8Array.prototype));
 prototypeSnapshots.set(Uint8ClampedArray.prototype,capturePrototype(Uint8ClampedArray.prototype));
 const typed=prototype(Uint8Array.prototype),byteLength=own(typed,'byteLength').get;
 function check(ok,message){if(!ok)throw Error('Native area animation unsupported: '+message);}
 function field(value,name){
  check(value&&typeof value==='object','explicit object');
  const d=own(value,name);check(d&&Object.hasOwn(d,'value'),'missing field or accessor '+String(name));return d.value;
 }
 function exact(value,allowed){
  check(value&&typeof value==='object'&&!Array.isArray(value),'explicit descriptor');
  const names=keys(value);check(names.length===allowed.length&&names.every(n=>allowed.includes(n)),'exact descriptor fields');
  const result=Object.create(null);for(const name of allowed)result[name]=field(value,name);return result;
 }
 function snapshot(value,depth){
  check(depth<24,'metadata nesting');
  if(value===null||typeof value==='string'||typeof value==='boolean')return value;
  if(typeof value==='number'){check(Number.isFinite(value),'metadata number');return value;}
  check(value&&typeof value==='object','metadata value');
  const array=Array.isArray(value),result=array?[]:Object.create(null),names=keys(value);
  check(names.length<256,'metadata width');
  for(const name of names){
   if(array&&name==='length')continue;
   check(typeof name==='string'&&name!=='toJSON','metadata key');
   if(array)check(name===String(result.length),'dense source array');
   result[name]=snapshot(field(value,name),depth+1);
  }
  if(array)check(field(value,'length')===result.length,'array length');
  return result;
 }
 function ascii(text){const result=new Uint8Array(text.length);for(let i=0;i<text.length;i++){const c=text.charCodeAt(i);check(c<128,'ASCII metadata');result[i]=c;}return result;}
 check(Bytes&&typeof Bytes.isBytes==='function'&&typeof Bytes.copy==='function'&&typeof Bytes.sha256==='function'&&typeof Bytes.freeze==='function','portable byte verifier');
 const metadata=snapshot(field(Data,'metadata'),0);
 check(Bytes.sha256(ascii(JSON.stringify(metadata)))===metadataSHA256,'metadata identity');Bytes.freeze(metadata);
 const targets=metadata.targets,privateFrames=[],privateRGBA=[],privatePalettes=[];
 function bytes(value,size){
  check(Bytes.isBytes(value),'unshared intrinsic byte storage');
  check(byteLength.call(value)===size,'exact payload byte count');
  const names=keys(value);check(names.length===size&&names.every((n,i)=>n===String(i)),'overridden byte storage or hooks');
  const p=prototype(value),properties=p&&keys(p),extensions=['toBase64','setFromBase64','toHex','setFromHex'];
  check(properties&&properties.includes('constructor')&&properties.includes('BYTES_PER_ELEMENT')&&properties.every(name=>name==='constructor'||name==='BYTES_PER_ELEMENT'||extensions.includes(name))&&field(p,'BYTES_PER_ELEMENT')===1,'overridden byte prototype or hooks');
  const ctor=field(p,'constructor');check(typeof ctor==='function'&&/^function Uint8(?:Clamped)?Array\(\) \{ \[native code\] \}$/.test(functionSource.call(ctor)),'overridden byte constructor');
  const binding=own(ctor,'prototype');check(binding&&Object.hasOwn(binding,'value')&&binding.value===p,'overridden byte constructor');
  for(const name of properties){
   if(!extensions.includes(name))continue;
   const descriptor=own(p,name),method=field(p,name);
   check(functionSource.call(ctor)==='function Uint8Array() { [native code] }'&&typeof method==='function'&&functionSource.call(method)==='function '+name+'() { [native code] }'&&descriptor.writable===true&&descriptor.enumerable===false&&descriptor.configurable===true,'overridden byte prototype or hooks');
  }
  const known=prototypeSnapshots.get(p);
  if(known){
   check(known.names.length===properties.length&&known.names.every((name,index)=>name===properties[index]),'byte prototype changed after trusted snapshot');
   for(let i=0;i<properties.length;i++){
    const before=known.descriptors[i],after=own(p,properties[i]);
    check(after&&before.value===after.value&&before.get===after.get&&before.set===after.set&&before.writable===after.writable&&before.enumerable===after.enumerable&&before.configurable===after.configurable,'byte prototype changed after trusted snapshot');
   }
  }
  if(!known||!known.realmChecked){
   let constructorError=null;
   try{apply(ctor,null,[]);}catch(error){constructorError=error;}
   check(constructorError&&typeof constructorError==='object','native constructor realm probe');
   const errorPrototype=prototype(constructorError);
   for(const name of properties){
    if(!extensions.includes(name))continue;
    let methodError=null;
    try{apply(field(p,name),null,[]);}catch(error){methodError=error;}
    check(methodError&&typeof methodError==='object'&&prototype(methodError)===errorPrototype,'native byte method belongs to another realm');
   }
   const admitted=known||capturePrototype(p);admitted.realmChecked=true;prototypeSnapshots.set(p,admitted);
  }
  return Bytes.copy(value);
 }
 function hex(text,size,hash){
  check(typeof text==='string'&&text.length===size*2&&/^[0-9a-f]+$/.test(text),'source hexadecimal payload');
  const data=new Uint8Array(size);for(let i=0;i<size;i++)data[i]=parseInt(text.slice(i*2,i*2+2),16);
  const copy=bytes(data,size);check(Bytes.sha256(copy)===hash,'source payload identity');return copy;
 }
 function array(value,length){check(Array.isArray(value)&&field(value,'length')===length&&keys(value).length===length+1,'source payload inventory');return value;}
 const encoded=array(field(Data,'encoded'),6);
 for(let i=0;i<targets.length;i++){
  const t=targets[i],e=exact(field(encoded,String(i)),['paletteHex','rawHex','rgbaHex']);
  privatePalettes.push(hex(e.paletteHex,t.retainedPaletteBytes,t.retainedPaletteSHA256));
  array(e.rawHex,t.frames.length);array(e.rgbaHex,t.frames.length);
  privateFrames.push(t.frames.map(f=>hex(field(e.rawHex,String(f.index)),t.transferBytes,f.rawSHA256)));
  privateRGBA.push(t.frames.map(f=>t.runtimeTextureKey?hex(field(e.rgbaHex,String(f.index)),t.width*t.height*4,f.rgbaSHA256):(check(field(e.rgbaHex,String(f.index))===null,'no unseen native RGBA payload'),null)));
 }
 function target(selector,index){
  check(Number.isInteger(selector),'source selector');const t=targets.find(t=>t.selector===selector);check(t,'unregistered selector');
  if(arguments.length===2)check(Number.isInteger(index)&&t.selectedSourceIndices.includes(index),'selected source index');return t;
 }
 const descriptorFields=['managerSlot','selector','targetIdentifier','runtimeTextureKey','targetBankSHA256','targetTextureIndex','width','height','format','transferType','transferBytes','destinationByteOffset','retainedPaletteSHA256','sourceTextureIndex','data'];
 function descriptor(t,index,data){
  const result={};for(const name of descriptorFields)if(name!=='sourceTextureIndex'&&name!=='data')result[name]=t[name];
  result.sourceTextureIndex=index;result.data=data;return Object.freeze(result);
 }
 function transferDescriptor(selector,index){check(arguments.length===2,'transferDescriptor selector and index');const t=target(selector,index);return descriptor(t,index,Bytes.copy(privateFrames[t.managerSlot][index]));}
 function copyTransfer(input){
  check(arguments.length===1,'copyTransfer exact descriptor');const d=exact(input,descriptorFields),t=target(d.selector,d.sourceTextureIndex);
  for(const name of descriptorFields)if(name!=='sourceTextureIndex'&&name!=='data')check(d[name]===t[name],'target metadata '+name);
  const data=bytes(d.data,t.transferBytes);check(Bytes.sha256(data)===t.frames[d.sourceTextureIndex].rawSHA256,'actual raw source bytes');return descriptor(t,d.sourceTextureIndex,data);
 }
 function verifyTransfer(input){check(arguments.length===1,'verifyTransfer exact descriptor');const d=copyTransfer(input),t=target(d.selector);return Object.freeze({managerSlot:t.managerSlot,selector:t.selector,targetIdentifier:t.targetIdentifier,sourceTextureIndex:d.sourceTextureIndex,rawSHA256:t.frames[d.sourceTextureIndex].rawSHA256});}
 function paletteDescriptor(selector){check(arguments.length===1,'paletteDescriptor selector');const t=target(selector);return Object.freeze({selector,targetIdentifier:t.targetIdentifier,retainedPaletteSHA256:t.retainedPaletteSHA256,data:Bytes.copy(privatePalettes[t.managerSlot])});}
 function renderDescriptor(selector,index){
  check(arguments.length===2,'renderDescriptor selector and index');const t=target(selector,index);check(t.runtimeTextureKey!==null,'no native material or key for raw-only target');
  const data=Bytes.copy(privateRGBA[t.managerSlot][index]);
  if(selector===0){const d=Object.freeze({width:t.width,height:t.height,format:t.format,key:t.runtimeTextureKey,seaFrame:index,palette_sha256:t.retainedPaletteSHA256,data});Sea.verify(d,t.runtimeTextureKey);return d;}
  const d=Object.freeze({width:t.width,height:t.height,format:t.format,key:t.runtimeTextureKey,pondFrame:index,palette_sha256:t.retainedPaletteSHA256,data});Pond.verify(d,t.runtimeTextureKey);return d;
 }
 check(Sea&&typeof Sea.verify==='function'&&Pond&&typeof Pond.verify==='function','unchanged sea and pond gates');
 for(const selector of [0,10]){
  const t=target(selector),old=selector===0?Sea:Pond;check(old.key===t.runtimeTextureKey,'existing native key');
  for(const index of t.selectedSourceIndices){
   const f=old.frames[index];check(f&&f.index===index&&f.rgba_sha256===t.frames[index].rgbaSHA256,'existing RGBA frame binding');
   check((f.raw_sha256||f.pixels_sha256)===t.frames[index].rawSHA256,'existing raw frame binding');renderDescriptor(selector,index);
  }
 }
 const limits=Object.freeze(['Six source selectors retain raw identities and palettes independent of visibility or material use.','Only sea and lakep.1 have previously admitted native material/runtime keys.','Source request phase and app-owned post-draw bank commit are a host sequencing contract, not physical VRAM, queue-acceptance or displayed-fetch timing.']);
 return Object.freeze({metadata,metadataSHA256,targets,limits,transferDescriptor,copyTransfer,verifyTransfer,paletteDescriptor,renderDescriptor});
});
