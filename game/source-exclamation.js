/* Browser-port wrapper of reviewed stage v2. The source lifecycle core remains staging-shaped;
 * source-exclamation-native.js separately owns finite native/runtime admission. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-exclamation-data.js'));
 else root.SourceExclamation=factory(root.SourceExclamationData);
})(typeof globalThis!=='undefined'?globalThis:this,function(Verified){
 'use strict';
 if(!Verified)throw Error('Command75: exact data module required');
// Finite command75 selector0 component. This is intentionally not product code.
// Source task traversals are explicit; there are no clocks, scheduled timers,
// browser APIs, audio calls, story triggers, camera updates, or renderer writes.
const {asset} = Verified;
const FX = 4096;
const instances = new WeakSet();
function check(ok, message) { if (!ok) throw new Error('Command75 stage: ' + message); }
function int(v, name) { check(Number.isSafeInteger(v) && v >= 0, name + ' must be a nonnegative integer'); return v; }
function vector(v, name) {
  check(Array.isArray(v) && v.length === 3 && v.every(n => Number.isSafeInteger(n) && n >= -2147483648 && n <= 2147483647), name + ' must be three signed FX12 integers');
  return v.slice();
}
function freeze(v) { if (v && typeof v === 'object' && !Object.isFrozen(v)) { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
function sum32(...vectors) { return [0,1,2].map(i => vectors.reduce((n,v) => (n+v[i])|0, 0)); }
function record(actor) {
  check(actor && typeof actor === 'object', 'actor reference required');
  int(actor.id,'object ID'); int(actor.mapId,'map ID'); int(actor.generation,'generation');
  check(typeof actor.active === 'boolean' && typeof actor.flag25 === 'boolean', 'explicit active/flag25 values required');
  if (actor.flag25) int(actor.secondaryMapId,'sub_02058750 map ID');
  check(actor.priority === 5, 'only the normal manager-priority5 profile is staged');
  return {position:vector(actor.positionFx12,'positionVector'), facing:vector(actor.facingVectorFx12,'facingVector'),
    offset2:vector(actor.offset58BA4Fx12,'unk88 / sub_02058BA4'), offset3:vector(actor.offset58BC4Fx12,'unk94 / sub_02058BC4')};
}
function sourceIdentityMatches(actor, captured) {
  return actor.active === true && actor.id === captured.id &&
    (actor.mapId === captured.mapId || (actor.flag25 === true && actor.secondaryMapId === captured.mapId));
}
function anchor(actor) {
  const v = record(actor);
  return sum32(v.position,v.facing,v.offset2,v.offset3,[0,32*FX,FX]);
}
function createStage(options) {
  check(options && options.mode === 'isolated-staging-only', 'explicit isolated staging mode required; runtime integration is blocked');
  check(Object.keys(options).every(k=>k==='mode'||k==='generation'),'unsupported option; timers and runtime callbacks are not admitted');
  let generation=int(options.generation,'generation'), traversal=-1, phase='closed', nextId=0, refs=0;
  const live=new Map(), byActor=new Map(), proposedSounds=[], events=[];
  function event(kind, fields={}) { events.push(freeze({kind,traversal,generation,...fields})); }
  function get(handle) { const s=live.get(handle); check(s,'unknown, stale, destroyed, or foreign handle'); return s; }
  function validate(s, actor=s.actor) {
    record(actor);
    check(actor===s.actor && actor.generation===generation && s.generation===generation, 'stale owner/generation');
    check(sourceIdentityMatches(actor,s),'source owner is inactive or object/map identity changed');
  }
  function actorPhase() { check(phase==='actors','actor-priority5 phase required'); }
  function remove(handle, reason) {
    const s=get(handle); live.delete(handle); byActor.delete(s.actor);
    event('remove-model-instance',{handle:handle.id,reason}); refs--;
    check(refs>=0,'negative selector resource reference count');
    if (refs===0) event('unload-selector0-resources',{model:85,lookup:117,texture:4,descriptor:1});
    event('destroy-effect-task',{handle:handle.id,priority:6,reason});
  }
  function beginTraversal() {
    check(phase==='closed','previous traversal not closed');
    traversal++; phase='actors'; return traversal;
  }
  function createCommand75(actor) {
    actorPhase(); const v=record(actor);
    check(actor.generation===generation && actor.active,'stale/inactive constructor owner');
    check(!byActor.has(actor),'one command75 effect per movement owner');
    const handle=Object.freeze({kind:'isolated-command75-handle',id:++nextId});
    const s={actor,id:actor.id,mapId:actor.mapId,generation,createdTraversal:traversal,lastPoll:-1,
      phase:0,hold:0,done:false,y:0,velocity:6*FX,updates:0,base:v.position};
    if (refs===0) event('load-selector0-resources',{model:85,lookup:117,texture:4,descriptor:1});
    refs++; live.set(handle,s); byActor.set(actor,handle);
    event('create-model-instance',{handle:handle.id,positionFx12:s.base.slice(),frameFx12:0});
    event('create-effect-task',{handle:handle.id,priority:6,skipCreationTraversal:true});
    event('movement-initializer-yields',{handle:handle.id,movementStepAdvance:1,returnValue:0});
    // Deliberately not the engine's play request shape. Nothing can play here.
    proposedSounds.push(freeze({kind:'proposed-source-sound-request',sourceSequenceId:1501,
      status:'blocked-exact-audio-admission',execution:'none',sourceConsumer:'ov05_021E7B08',
      handle:handle.id,ownerObjectId:s.id,ownerMapId:s.mapId,generation,traversal}));
    return handle;
  }
  function pollMovement(handle, actor) {
    actorPhase(); const s=get(handle); validate(s,actor);
    check(traversal>s.createdTraversal,'initializer yielded; no same-traversal movement poll');
    check(s.lastPoll!==traversal,'duplicate actor callback in this traversal');
    s.lastPoll=traversal;
    if (!s.done) return freeze({returnValue:0,movementFinished:false,movementStepAdvance:0,setObjectFlagsBits:0});
    remove(handle,'source-movement-consumer');
    // sub_0205BBB4 returns1, allowing the movement dispatcher to visit
    // sub_0205B0C8 in the same actor callback. No next stream task runs here.
    return freeze({returnValue:1,movementFinished:true,movementStepAdvance:1,setObjectFlagsBits:0x20});
  }
  function updateEffects() {
    actorPhase();
    // Staging fail-closed safeguard: validate all owners before mutating any.
    for (const s of live.values()) validate(s);
    phase='effects';
    for (const [handle,s] of live) {
      if (s.createdTraversal===traversal) { event('skip-new-effect-task',{handle:handle.id}); continue; }
      s.base=anchor(s.actor); s.updates++;
      if (s.phase===0) {
        s.y=(s.y+s.velocity)|0;
        if (s.y===0) { s.velocity=0; s.phase=1; } else s.velocity=(s.velocity-2*FX)|0;
      } else if (s.phase===1) {
        s.hold++;
        if (s.hold>=30) { s.phase=2; s.hold=0; s.done=true; event('effect-completion-flag',{handle:handle.id,updates:s.updates}); }
      }
      // Completion never destroys the handle. Further callbacks remain valid.
    }
  }
  function endTraversal() { check(phase==='effects','effect phase must be visited once before closing'); phase='closed'; }
  function drawInstance(handle) {
    const s=get(handle); validate(s);
    const instance=freeze({kind:'isolated-source-effect-instance',runtimeAdmitted:false,modelKey:asset.model_key,
      handle:handle.id,selector:0,positionFx12:sum32(s.base,[0,s.y,0]),
      rotationFx12:asset.instance.rotation_fx12.slice(),scaleFx12:asset.instance.scale_fx12.slice(),
      billboard:'full',projectionPass:'effects',textureFrameFx12:0,textureIndex:0,paletteIndex:0,
      sourcePositionScaleAlreadyApplied:4,assetSha256:Verified.pins['exclamation.asset.json']});
    instances.add(instance); return instance;
  }
  function inspect(handle) {
    const s=get(handle);
    return freeze({traversal,createdTraversal:s.createdTraversal,phase:s.phase,hold:s.hold,done:s.done,
      yFx12:s.y,velocityFx12:s.velocity,updates:s.updates,baseFx12:s.base.slice(),generation:s.generation});
  }
  function cancelOwner(actor) {
    // Explicit host safety operation, not a claim about original reset behavior.
    const h=byActor.get(actor); if (!h) return false;
    remove(h,'host-owner-cancellation');
    for(let i=proposedSounds.length-1;i>=0;i--) if(proposedSounds[i].handle===h.id) proposedSounds.splice(i,1);
    return true;
  }
  function reset(nextGeneration) {
    int(nextGeneration,'next generation'); check(nextGeneration>generation,'reset must increase generation');
    for (const h of Array.from(live.keys())) remove(h,'host-generation-reset');
    proposedSounds.length=0; generation=nextGeneration; phase='closed';
  }
  return Object.freeze({beginTraversal,createCommand75,pollMovement,updateEffects,endTraversal,drawInstance,inspect,cancelOwner,reset,
    takeProposedSoundRequests(){return proposedSounds.splice(0);},
    snapshot(){return freeze({generation,traversal,phase,liveEffects:live.size,selector0References:refs,events:events.slice()});}});
}
// Read-only float transform probe, NOT native-raster admission or a draw call.
// Caller supplies the established scene origin and unchanged effects projection.
function transformProbe(instance,camera,originFx12,math) {
  check(instances.has(instance),'authenticated immutable source effect descriptor required');
  const origin=vector(originFx12,'explicit source scene origin');
  const position=vector(instance.positionFx12,'source position').map((n,i)=>(n-origin[i])/FX);
  const matrix=math.billboardMatrix(camera.view,position);
  const mvp=math.multiply(camera.spriteProjection,math.multiply(camera.view,matrix));
  const clip=asset.model.shapes[0].triangles.map(tri=>tri.map(v=>math.transform(mvp,v.p)));
  return freeze({scope:'unchanged-effects-pass-float-probe-only',projectionPass:'effects',position,matrix,mvp,clip});
}
return Object.freeze({createStage,sourceIdentityMatches,anchor,transformProbe});

});
