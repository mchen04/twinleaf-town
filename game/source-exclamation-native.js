/* Finite command75 native admission. No clocks, sound execution or camera mutation.
 * Fresh ordinary home actor inputs and queue ownership are supplied by the host. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-exclamation.js'),require('./source-exclamation-data.js'),require('./source-native-bytes.js'));
 else root.SourceExclamationNative=factory(root.SourceExclamation,root.SourceExclamationData,root.SourceNativeBytes);
})(typeof globalThis!=='undefined'?globalThis:this,function(Component,Data,Bytes){
 'use strict';
 function check(ok,message){if(!ok)throw Error('Command75 native: '+message);}
 check(Component&&Data&&Bytes,'component, exact assets and byte verifier required');
 const FX=4096,ORIGIN=Object.freeze([1048576,0,1048576]),descriptors=new WeakMap(),entries=new WeakMap();
 const ORIGINS=Object.freeze({411:Object.freeze([7340032,0,57671680]),413:ORIGIN,414:ORIGIN});
 const asset=Data.asset;
 function equal(a,b){return Array.isArray(a)&&a.length===b.length&&a.every((x,i)=>x===b[i]);}
 function sourceActor(actor,header){
  check(actor&&ORIGINS[header]&&actor.mapId===header,'exact scene effect owner required');
  for(const k of ['positionFx12','facingVectorFx12','offset58BA4Fx12','offset58BC4Fx12'])check(Array.isArray(actor[k])&&actor[k].length===3&&actor[k].every(n=>Number.isSafeInteger(n)&&n>=-2147483648&&n<=2147483647),'explicit signed FX12 '+k+' required');
  return JSON.stringify([actor.id,actor.mapId,actor.generation,actor.active,actor.flag25,actor.secondaryMapId,actor.priority,actor.positionFx12,actor.facingVectorFx12,actor.offset58BA4Fx12,actor.offset58BC4Fx12]);
 }
 function resources(){
  Object.keys(Data.pins).forEach(name=>Data.authenticate(name,Data.read(name)));
  check(asset.resource.model_member===85&&asset.resource.lookup_member===117&&asset.resource.texture_member===4&&asset.sbc.billboard==='full'&&asset.model.scale===4,'source asset binding');
  const vertices=asset.model.shapes[0].triangles.flat().flatMap(v=>[...v.p,...v.uv,...v.n,...v.c]);
  const material={...asset.effective_material,texture:'source-exclamation-0004'};
  // Exact one-quad perimeter, using the six triangulated vertex slots.
  const topology={original_polygons:[{boundary_vertices:[0,1,2,5],source_vertices:[0,1,2,3],primitive_mode:1,primitive_run:0}],triangle_polygon_indices:[0,0]};
  return Bytes.freeze({vertices,material,topology,texture:{width:16,height:16,data:Data.rgba.slice(),translucent:false,cutout:true}});
 }
 function createManager(options){
  check(options&&Object.keys(options).every(k=>['generation','header','originFx12'].includes(k)),'unknown manager option');
  const header=options.header,origin=ORIGINS[header];
  check(origin&&equal(options.originFx12,origin),'exact admitted absolute-to-centered origin required');
  const core=Component.createStage({mode:'isolated-staging-only',generation:options.generation});
  const live=new Map(),models=new Map(),tasks=new Map(),lifecycle=[];
  let resource=null,eventIndex=0,revision=0;
  function sync(){
   const all=core.snapshot().events;
   for(;eventIndex<all.length;eventIndex++){
    const e=all[eventIndex];
    if(e.kind==='load-selector0-resources'){check(resource===null,'duplicate resource acquisition');resource=resources();}
    else if(e.kind==='create-model-instance'){check(resource&&!models.has(e.handle),'missing resource or duplicate model');models.set(e.handle,{resource,positionFx12:e.positionFx12.slice()});}
    else if(e.kind==='create-effect-task'){check(!tasks.has(e.handle),'duplicate task');tasks.set(e.handle,{priority:6,createdTraversal:e.traversal});}
    else if(e.kind==='remove-model-instance'){
     check(models.delete(e.handle),'missing model during teardown');
     for(const [h]of live)if(h.id===e.handle)live.delete(h);
    }else if(e.kind==='unload-selector0-resources'){check(models.size===0&&resource,'resource unload before final model removal');resource=null;}
    else if(e.kind==='destroy-effect-task')check(tasks.delete(e.handle),'missing effect task during teardown');
    lifecycle.push(e);
   }
   check(models.size===core.snapshot().selector0References&&tasks.size===models.size,'resource/model/task ownership disagreement');
  }
  function mutation(fn){const result=fn();sync();revision++;return result;}
  function current(handle){check(live.has(handle),'stale, foreign or destroyed handle');return live.get(handle);}
  function beginTraversal(){return mutation(()=>core.beginTraversal());}
  function createCommand75(actor){sourceActor(actor,header);return mutation(()=>{const h=core.createCommand75(actor);live.set(h,actor);return h;});}
  function pollMovement(handle,actor){check(current(handle)===actor,'foreign movement owner');return mutation(()=>core.pollMovement(handle,actor));}
  function updateEffects(){for(const actor of live.values())sourceActor(actor,header);return mutation(()=>core.updateEffects());}
  function endTraversal(){return mutation(()=>core.endTraversal());}
  function cancelOwner(actor){return mutation(()=>core.cancelOwner(actor));}
  function destroy(handle,reason){check(typeof reason==='string'&&reason.length>0,'host teardown reason required');if(!live.has(handle))return false;return cancelOwner(live.get(handle));}
  function reset(generation){return mutation(()=>core.reset(generation));}
  function describe(handle){
   const actor=current(handle),actorStamp=sourceActor(actor,header),raw=core.drawInstance(handle),stamp=revision;
   const descriptor=Bytes.freeze({kind:'source-command75-native16',header,generation:actor.generation,handle:handle.id,
    model:85,lookup:117,texture:4,selector:0,positionFx12:raw.positionFx12.map((n,i)=>n-origin[i]),
    sourcePositionFx12:raw.positionFx12.slice(),originFx12:origin.slice(),textureFrameFx12:0,textureIndex:0,paletteIndex:0,
    projectionPass:'effects',billboard:'full',sourcePositionScaleAlreadyApplied:4,assetSha256:Data.pins['exclamation.asset.json']});
   descriptors.set(descriptor,{validate(){
    check(stamp===revision&&current(handle)===actor,'stale effect descriptor traversal/owner');
    check(sourceActor(actor,header)===actorStamp,'stale source anchor vectors or owner');
    const fresh=core.drawInstance(handle);check(equal(fresh.positionFx12,raw.positionFx12),'stale effect position');
    check(resource&&models.get(handle.id).resource===resource&&tasks.has(handle.id),'released effect resources');
    return resource;
   }});return descriptor;
  }
  return Object.freeze({beginTraversal,createCommand75,pollMovement,updateEffects,endTraversal,cancelOwner,destroy,reset,
   descriptors(){return Object.freeze(Array.from(live.keys(),describe));},
   inspect(handle){current(handle);return core.inspect(handle);},
   takeProposedSoundRequests(){return core.takeProposedSoundRequests();},
   snapshot(){return Bytes.freeze({...core.snapshot(),native:{liveModels:models.size,liveTasks:tasks.size,resourcesLoaded:resource!==null,revision,events:lifecycle.slice()}});}
  });
 }
 function verifyDescriptor(descriptor,header){
  check(ORIGINS[header]&&descriptor&&descriptor.header===header&&descriptors.has(descriptor),'unadmitted effect descriptor/header');
  check(descriptor.textureFrameFx12===0&&descriptor.textureIndex===0&&descriptor.paletteIndex===0,'nonzero lookup frame');
  return descriptors.get(descriptor).validate();
 }
 function nativeEntry(descriptor,header,originalOrder){
  const r=verifyDescriptor(descriptor,header);
  check(Number.isSafeInteger(originalOrder)&&originalOrder>=0,'source submission order required');
  const position=descriptor.positionFx12;
  const entry=Object.freeze({effect:descriptor,actor:false,key:'fldeff-0085-selector0',mi:0,bi:0,scale:4,
   originalOrder,projectionPass:'effects',billboard:'full',effectPositionFx12:position,
   matrix:Object.freeze([1,0,0,0,0,1,0,0,0,0,1,0,...position.map(n=>n/FX),1]),
   vertices:r.vertices,geometryVertices:r.vertices,texture:r.texture,textureFormat:3,frame:null,material:r.material,topology:r.topology});
  entries.set(entry,descriptor);return entry;
 }
 function verifyEntry(entry){
  check(entry&&entries.has(entry)&&entries.get(entry)===entry.effect,'unadmitted or copied native effect entry');
  const r=verifyDescriptor(entry.effect,entry.effect.header);
  check(entry.texture===r.texture&&entry.vertices===r.vertices&&entry.geometryVertices===r.vertices&&entry.material===r.material&&entry.topology===r.topology&&entry.frame===null,'effect asset/frame binding differs');
  check(entry.texture.width===16&&entry.texture.height===16&&entry.textureFormat===3,'native16 texture contract');
  Data.authenticate('texture4.rgba',Uint8Array.from(entry.texture.data));return true;
 }
 return Object.freeze({createManager,verifyDescriptor,nativeEntry,verifyEntry,originFx12:ORIGIN,originsFx12:ORIGINS,
  limits:Object.freeze(['Only authenticated live command75 model85, lookup117 frame0 and texture4 full billboards in exact headers411/413/414 and their bound source origins.','Exact source native16x16 geometry, quad topology and effects projection; source queue lifetime is explicit.','No browser, hardware, audio or full visual fidelity acceptance.'])});
});
