(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SourceNativeHost=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const bindings=Object.freeze({player:'member-0091',scout:'member-0069',maker:'member-0072',keeper:'member-0371',home:'member-0373'});
 function actorKey(key){if(Object.hasOwn(bindings,key))return bindings[key];if(/^human-\d+$/.test(key))return key;throw Error('Native host unknown actor binding: '+key);}
 function createAtlases(cpu,assets,audit,keys){
  if(!cpu||!cpu.raster||typeof cpu.raster.decodeRGBA!=='function'||!assets||!audit||typeof audit.verify!=='function'||!Array.isArray(keys))throw Error('Native host source atlas dependencies missing');
  const output={};for(const key of keys){const source=actorKey(key),record=audit.records[source],item=assets[source];if(!record||!item||item.width!==record.width||item.height!==record.height||item.rgba_sha256!==record.rgba_sha256)throw Error('Native host source atlas metadata mismatch: '+key);const pixels=cpu.raster.decodeRGBA(item);audit.verify(pixels,source,{x:record.frames[0].x,y:record.frames[0].y});output[key]=pixels;}return output;
 }
 function frameState(header){if(!Number.isInteger(header)||header<411||header>417)throw Error('Native host unsupported source header');return{rasterPipeline:header===411?'native-perspective-door-camera-animation-diagnostic':'native-ortho-animation-diagnostic',nativeState:{wBuffer:false,fogEnabled:false,alphaRef:0,sortMode:'auto-y',zeroDotWLimit:0}};}
 return Object.freeze({actorKey,createAtlases,frameState,bindings});
});
