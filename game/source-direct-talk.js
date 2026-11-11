(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./dialogue-data.js'));else root.SourceDirectTalk=factory(root.OriginalDialogueData);})(typeof globalThis!=='undefined'?globalThis:this,function(data){
'use strict';
// Finite profile-only interpretation of the admitted 2C -> 31,34,61,02 tails.
// The host has already performed PlaySE1500, LockAll's native yield and FacePlayer.
// Printer callbacks and field/script callbacks remain separate schedules.
const KEYS=Object.freeze({A:1,B:2,UP:64,DOWN:128,LEFT:32,RIGHT:16,X:1024});
const DIRECTIONS=Object.freeze(['up','down','left','right']);
const OWN=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
function fail(message){throw Error('SourceDirectTalk: '+message);}
function readKeys(input){
 const keys=input.newKeys??0;
 if(Array.isArray(keys))return keys.reduce((mask,key)=>{if(!OWN(KEYS,key))fail('unsupported fresh key '+key);return mask|KEYS[key];},0);
 if(!Number.isSafeInteger(keys)||keys<0||keys>0xffff)fail('invalid fresh key mask');
 return keys;
}
function createController(options={}){
 const {player,actor,generation,story,hooks={}}=options, supplied=options.selected;
 if(!player||!actor||player===actor)fail('explicit distinct player and actor required');
 if(generation===undefined||generation===null)fail('explicit field generation required');
 if(!story?.vars||!story?.flags||story.flags instanceof Set)fail('shared story vars/flags required');
 const sourceActor=data.metadata.actors.find(a=>a.key===supplied?.actorKey);
 const route=sourceActor?.routes_in_source_precedence.find(r=>r.id===supplied?.routeId);
 if(!route||route.unsupported_scene||route.wait_button!==true)fail('unadmitted direct-talk route');
 if(supplied.headerId!==sourceActor.header_id||supplied.recordIndex!==sourceActor.record_index||supplied.messageBank!==sourceActor.message_bank||supplied.messageIndex!==route.message_index||supplied.waitButton!==true||supplied.provenance?.messageOffset!==route.script_offset)fail('selected route identity mismatch');
 const effects=route.state_effects.map(e=>Object.freeze({...e}));
 if(!Array.isArray(supplied.sourceEffects)||supplied.sourceEffects.length!==effects.length||effects.some((e,i)=>['type','flag','script_offset','timing'].some(k=>supplied.sourceEffects[i]?.[k]!==e[k])))fail('selected source effects mismatch');
 if(effects.some(e=>e.type!=='set_flag'||e.timing!=='before_message'||!Number.isInteger(e.flag)))fail('unadmitted source write');
 if(actor.header!==sourceActor.header_id)fail('actor header does not match selected route');
 if(actor.eventId!==undefined&&actor.eventId!==sourceActor.event_id)fail('actor event does not match selected route');
 if(actor.eventIndex!==undefined&&actor.eventIndex!==sourceActor.record_index)fail('actor event index does not match selected route');
 for(const name of ['isOwnerCurrent','openMessage','isPrinterFinished','closeMessage','releaseMovement','setFacing'])if(typeof hooks[name]!=='function')fail('missing hook '+name);
 const selected=Object.freeze({...supplied,sourceEffects:Object.freeze(effects),bindings:Object.freeze({...supplied.bindings}),slotRoles:Object.freeze({...supplied.slotRoles})});
 const identityKeys=['id','header','eventId','eventIndex','recordIndex'];
 const identities=[player,actor].map(object=>({object,values:identityKeys.map(key=>object[key])}));
 const owner=Object.freeze({player,actor,generation,actorKey:selected.actorKey,routeId:selected.routeId});
 const flags=story.flags,writes=new Map(),trace=[];
 let active=false,begun=false,cancelled=false,locked=false,advancing=false,phase='ready';
 let message=null,environment=null,native=null,lastCallbackId=-1,scriptVisits=0,cancelReason=null,committed=false;
 function details(extra={}){return{owner,generation,actorKey:selected.actorKey,routeId:selected.routeId,callbackId:lastCallbackId,...extra};}
 function emit(type,extra={}){const e=Object.freeze({type,callbackId:lastCallbackId,scriptVisits,...extra});trace.push(e);if(trace.length>256)trace.shift();hooks.onEvent?.(e);}
 function localCurrent(){return !cancelled&&player.active!==false&&actor.active!==false&&identities.every(({object,values})=>identityKeys.every((key,i)=>object[key]===values[i]));}
 function current(){
  if(!localCurrent())return false;
  const valid=hooks.isOwnerCurrent(owner)===true;
  // A returned true never revives cancellation or identities changed in this hook.
  return valid&&localCurrent();
 }
 function ensureCurrent(){if(current())return true;if(!cancelled)cancel('stale-owner');return false;}
 function event(type,extra={}){emit(type,extra);return ensureCurrent();}
 function closeOwned(reason){if(message===null)return;const handle=message;message=null;hooks.closeMessage(handle,details({reason}));}
 function releaseOwned(reason){if(!locked)return;locked=false;hooks.releaseMovement(details({reason}));}
 function discardEnvironment(){if(!environment)return;environment.continuation=null;environment.contextCount=0;environment.messageFormat=false;environment.strings=0;environment=null;}
 function cancel(reason='cancelled'){
  if(cancelled)return false;
  cancelled=true;active=false;phase='cancelled';cancelReason=String(reason);native=null;
  discardEnvironment();
  // Host recovery adaptation only: original writes are visible before Message.
  // Never touch a replacement story object or commit a partial script on cancel.
  for(const w of writes.values()){if(w.had)flags[w.flag]=w.before;else delete flags[w.flag];}writes.clear();
  const errors=[];
  try{closeOwned(cancelReason);}catch(error){errors.push(error);}
  try{releaseOwned(cancelReason);}catch(error){errors.push(error);}
  try{emit('cancel',{reason:cancelReason});}catch(error){errors.push(error);}
  if(errors.length)throw errors[0];return true;
 }
 function acceptCallback(input){
  const id=input?.callbackId;
  if(!Number.isSafeInteger(id)||id<0)fail('explicit nonnegative callback ID required');
  if(id<=lastCallbackId)return false;
  lastCallbackId=id;return true;
 }
 function beginVisit(input={}){
  if(begun||cancelled||!acceptCallback(input))return false;
  // Once accepted, this owner inherits the movement lock, including cleanup if
  // the first ownership query invalidates it before its message is opened.
  begun=true;active=true;locked=true;phase='opening';
  environment={contextCount:1,messageFormat:true,strings:2,continuation:null};
  if(!ensureCurrent())return false;
  for(const effect of effects){
   if(!event('opcode',{opcode:0x1e,offset:effect.script_offset,name:'SetFlag'}))return false;
   if(!writes.has(effect.flag))writes.set(effect.flag,{flag:effect.flag,had:OWN(flags,effect.flag),before:flags[effect.flag]});
   flags[effect.flag]=true;
   if(!event('set-flag',{flag:effect.flag,timing:'before_message'}))return false;
  }
  if(!event('opcode',{opcode:0x2c,offset:route.script_offset,name:'Message'}))return false;
  const handle=hooks.openMessage(details({selected,waitButton:false}));
  // openMessage can cancel synchronously before it returns its new handle.
  // That handle is still ours, never a replacement host message/environment.
  // Register it before querying external ownership: that query may throw or
  // cancel, and every cleanup path must see the returned resource exactly once.
  message=handle??null;
  if(!current()||!active){
   try{closeOwned('cancelled-during-open');}
   finally{if(!cancelled)cancel('stale-open');}
   return false;
  }
  if(handle==null)fail('openMessage must return an owned printer handle');
  phase='printer';native='printer';
  return event('native-install',{kind:'printer'});
 }
 function button(input){
  const keys=readKeys(input);
  if(keys&3)return true;
  const direction=keys&64?0:keys&128?1:keys&32?2:keys&16?3:-1;
  if(direction!==-1){
   if(!ensureCurrent())return false;
   hooks.setFacing(direction,details({direction:DIRECTIONS[direction]}));
   return ensureCurrent();
  }
  if(keys&1024){
   const eligible=hooks.menuContinuationEligible?.(details())===true;
   if(!ensureCurrent())return false;
   if(eligible){
    if(typeof hooks.onDeferredMenu!=='function')fail('eligible continuation requires onDeferredMenu');
    environment.continuation='sub_020351A0';
    if(!event('defer-menu',{continuation:'sub_020351A0'}))return false;
   }
   // The source X predicate succeeds even when eligibility installs no callback.
   return true;
  }
  return false;
 }
 function scriptVisit(input={}){
  if(!active||cancelled||!acceptCallback(input))return false;
  readKeys(input); // Validate even on non-button visits; never queue their edges.
  if(!ensureCurrent())return false;scriptVisits++;
  if(native){
   const kind=native;
   const done=kind==='printer'?hooks.isPrinterFinished(message)===true:button(input);
   if(!ensureCurrent())return false;
   if(done){native=null;phase=kind==='printer'?'wait-button-install':'close-release';if(!event('native-success',{kind}))return false;}
   return true; // Native success always yields before later bytecode.
  }
  if(phase==='wait-button-install'){
   if(!event('opcode',{opcode:0x31,offset:route.wait_button_script_offset,name:'WaitButton'}))return false;
   native='button';phase='button';return event('native-install',{kind:'button'});
  }
  if(phase==='close-release'){
   if(!event('opcode',{opcode:0x34,offset:route.wait_button_script_offset+2,name:'CloseMessageBox'}))return false;
   closeOwned('source-close');if(!ensureCurrent())return false;
   if(!event('opcode',{opcode:0x61,offset:route.wait_button_script_offset+4,name:'ReleaseAllEvents'}))return false;
   releaseOwned('release-all');if(!ensureCurrent())return false;
   phase='end';return true; // Release yields; task still owns input, actors do not pause.
  }
  if(phase==='end'){
   if(message!==null||locked||!environment)fail('End with missing or unreleased resources');
   if(!event('opcode',{opcode:0x02,offset:route.wait_button_script_offset+6,name:'End'}))return false;
   committed=true;writes.clear();phase='ending';
   if(!event('end'))return false;
   // No dispatch/begin can replace this environment during teardown. Cancel is
   // explicitly allowed and clears remaining resources without invoking a hook.
   const ending=environment,continuation=ending.continuation;ending.continuation=null;
   ending.contextCount=0;if(!event('context-delete'))return false;
   ending.messageFormat=false;if(!event('message-format-delete'))return false;
   ending.strings=0;if(!event('strings-delete',{count:2}))return false;
   environment=null;active=false;phase='complete';
   if(!event('environment-free'))return false;
   if(continuation){
    if(!event('deferred-menu-call',{continuation}))return false;
    // event() rechecks AFTER its external observer and isOwnerCurrent checks its
    // own postconditions. No callback may override a cancellation with true.
    hooks.onDeferredMenu(details({continuation}));
    // This is the last effect. A successful hook may replace the host's task
    // owner, which is expected, not a stale cancellation of the new task.
    return !cancelled;
   }
   return true;
  }
  fail('unexpected finite phase '+phase);
 }
 function advance(fn,input){
  if(advancing)return false;advancing=true;
  try{return fn(input);}catch(error){if(!cancelled)try{cancel('hook-or-contract-error');}catch(_){}throw error;}finally{advancing=false;}
 }
 function snapshot(){return{generation,actorKey:selected.actorKey,routeId:selected.routeId,active:active&&!cancelled,begun,cancelled,cancelReason,committed,locked:locked&&!cancelled,phase,native:native?{kind:native}:null,messageOpen:message!==null,environment:environment?{...environment}:null,lastCallbackId,scriptVisits,pendingWrites:writes.size,trace:trace.map(e=>({...e}))};}
 return Object.freeze({begin:input=>advance(beginVisit,input),dispatch:input=>advance(beginVisit,input),tickScript:input=>advance(scriptVisit,input),cancel,snapshot,ownsField:()=>active&&!cancelled,isLocked:()=>locked&&!cancelled});
}
return Object.freeze({KEYS,DIRECTIONS,createController});
});
