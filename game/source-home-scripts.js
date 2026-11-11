(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-home-script-data.js'),require('./original-motion.js'),require('./player-motion.js'));else root.SourceHomeScripts=factory(root.SourceHomeScriptData,root.OriginalMotion,root.PlayerMotion);})(typeof globalThis!=='undefined'?globalThis:this,function(data,motion,playerMotion){
'use strict';
// Independently authored finite interpretation of bank981 entries2/5 only.
// Scripts run before draw. Main-queue traversal runs after draw, once per
// normal callback: observers(0), movement streams(4), actors(5), effects(6).
// No elapsed-time accumulator, camera mutation, rendering or sound substitute.
const DIRECTIONS=['up','down','left','right'], DELTAS=[[0,-1],[0,1],[-1,0],[1,0]];
const OWNERS=new WeakMap(), NODES=new Map(data.nodes.map(n=>[n.offset,n]));
function fail(message){throw Error('SourceHomeScripts: '+message);}
function createController(options={}){
 const {player,mom,generation,story,playerName,rivalName,effects,hooks={}}=options;
 if(!player||!mom||player===mom)fail('explicit distinct player and Mom actors required');
 if(generation===undefined||generation===null)fail('explicit field generation required');
 if(!story?.vars||!story?.flags||story.flags instanceof Set)fail('shared plain story vars/flags required');
 if(!Number.isInteger(story.vars[data.variable])||story.vars[data.variable]<0||story.vars[data.variable]>2)fail('only story states0/1/2 admitted');
 if(!Number.isInteger(story.vars[0x410f]))fail('explicit other level condition variable0x410F required');
 if(typeof playerName!=='string'||!playerName||typeof rivalName!=='string'||!rivalName)fail('explicit playerName/rivalName required');
 for(const name of ['openMessage','isPrinterFinished','closeMessage','isOwnerCurrent'])if(typeof hooks[name]!=='function')fail('missing hook '+name);
 for(const name of ['beginTraversal','createCommand75','pollMovement','updateEffects','endTraversal'])if(typeof effects?.[name]!=='function')fail('missing effect adapter '+name);
 if(typeof effects.destroy!=='function'&&typeof effects.cancelOwner!=='function')fail('effect cleanup adapter required');
 const owner=Object.freeze({player,mom,generation});
 let active=false,cancelled=false,locked=false,scriptId=null,pc=null,native=null,message=null,environment=null;
 let advancing=false;
 let counter=0,scriptVisits=0,queueVisits=0,lastScriptId=-1,lastQueueId=-1,cancelReason=null;
 const streams=[],records=[{actor:player,eventId:255,selector:0,held:null},{actor:mom,eventId:0,selector:0,held:null}];
 const trace=[];
 const writes=new Map();
 function write(kind,key,value){const path=kind+':'+key;if(!writes.has(path))writes.set(path,{kind,key,had:Object.prototype.hasOwnProperty.call(story[kind],key),before:story[kind][key]});story[kind][key]=value;}
 function emit(type,details={}){const e={type,scriptVisits,queueVisits,...details};trace.push(e);if(trace.length>256)trace.shift();hooks.onEvent?.(e);}
 function current(){
  if(cancelled||player.active===false||mom.active===false||mom.header!==414)return false;
  const valid=hooks.isOwnerCurrent(owner)===true;
  // Ownership adapters may synchronously cancel or invalidate actors. Their
  // returned true cannot override changes made during that same query.
  return valid&&!cancelled&&player.active!==false&&mom.active!==false&&mom.header===414;
 }
 function ensureCurrent(){if(current())return true;if(!cancelled)cancel('stale-owner');return false;}
 function ownsField(){return active&&!cancelled;}
 function clearHeld(rec){if(OWNERS.get(rec.actor)!==owner)return;rec.actor.sourceFlags=(rec.actor.sourceFlags||0)&~0x30;rec.held=null;}
 function closeMessage(reason){if(message===null)return;const handle=message;message=null;hooks.closeMessage(handle,{reason,generation,scriptId});}
 function cancel(reason='cancelled'){
  if(cancelled)return false;
  cancelled=true;active=false;cancelReason=String(reason);native=null;environment=null;
  // Host cancellation transaction, not an invented original game reset path.
  // Completed End clears this journal. Partial source writes are rolled back.
  for(const w of writes.values()){if(w.had)story[w.kind][w.key]=w.before;else delete story[w.kind][w.key];}writes.clear();
  const errors=[];
  if(effects.cancelOwner){try{effects.cancelOwner(mom);}catch(e){errors.push(e);}}
  for(const rec of records){if(rec.held?.effect!=null){if(!effects.cancelOwner)try{effects.destroy(rec.held.effect,reason);}catch(e){errors.push(e);}rec.held.effect=null;}clearHeld(rec);if(OWNERS.get(rec.actor)===owner)OWNERS.delete(rec.actor);}
  streams.length=0;counter=0;
  try{closeMessage(reason);}catch(e){errors.push(e);}
  if(locked){locked=false;try{hooks.unlock?.({generation,scriptId,reason});}catch(e){errors.push(e);}}
  emit('cancel',{reason:cancelReason});
  if(errors.length)throw errors[0];return true;
 }
 function dispatchVisit(input={}){
  if(active||cancelled||input.eligible!==true||input.header!==414)return false;
  if(!ensureCurrent())return false;
  if(![0,1,2].includes(story.vars[data.variable]))fail('story state left finite0/1/2 profile');
  let id=null;
  if(!input.suppressLevel&&story.vars[data.variable]===0)id=2;
  else{
   if(!input.suppressLevel&&story.vars[0x410f]!==0)fail('unsupported later type1 condition: bounded profile requires0x410F=0');
   if(input.completedStep===true&&!input.stepPreempted&&story.vars[data.variable]===1&&input.x===6&&input.z===10)id=5;
  }
  if(id===null)return false;
  for(const rec of records){if(OWNERS.has(rec.actor))fail('actor already has a script owner');if(rec.actor.progress<1||rec.actor.playerMotion?.command)fail('profile dispatch requires settled actors');}
  for(const rec of records)OWNERS.set(rec.actor,owner);
  active=true;scriptId=id;pc=data.scriptEntries[id];native=null;
  environment={contextCount:1,messageFormat:true,strings:2,continuation:null,scratch:{[0x800c]:0}};
  writes.clear();
  emit('dispatch',{scriptId:id,pc});return true;
 }
 function face(actor,direction){if(!actor.facingSuppressed&&!((actor.sourceFlags||0)&0x80))actor.facing=DIRECTIONS[direction];}
 function graphics(rec,selector,phase='regular'){
  if(!ensureCurrent())return;
  const actor=rec.actor,allowed=hooks.actorCallbackAllowed?hooks.actorCallbackAllowed(actor)!==false:true;
  const eligible=!((actor.sourceFlags||0)&0x100)&&(hooks.actorAdvanceEligible?hooks.actorAdvanceEligible(actor)!==false:true);
  if(actor===player){playerMotion.attach(actor);playerMotion.gaitCallback(actor.playerMotion.gait,selector,actor.facing,{allowed,eligible});}
  else motion.gaitCallback(actor,selector,{callbackAllowed:allowed,advanceEligible:eligible});
  emit('graphics',{eventId:rec.eventId,selector,phase});
 }
 function installStream(eventId,offset){
  const rec=records.find(r=>r.eventId===eventId),source=data.streams[offset];
  if(!rec||!source||streams.some(s=>s.rec===rec&&!s.observed))fail('unsupported or overlapping movement stream');
  const stream={rec,source,index:0,repeat:0,state:0,done:false,observed:false};
  streams.push(stream);counter++;emit('apply-movement',{eventId,offset,activeMovementCounter:counter});
 }
 function setNative(kind,extra={}){native={kind,...extra};emit('native-install',{kind});}
 function button(input){
  const bits={A:1,B:2,UP:64,DOWN:128,LEFT:32,RIGHT:16,X:1024};
  const keys=Array.isArray(input.newKeys)?input.newKeys.reduce((mask,key)=>{if(!bits[key])fail('unsupported new key '+key);return mask|bits[key];},0):(input.newKeys||0);
  input={...input,pressedA:input.pressedA||!!(keys&1),pressedB:input.pressedB||!!(keys&2),pressedUp:input.pressedUp||!!(keys&64),pressedDown:input.pressedDown||!!(keys&128),pressedLeft:input.pressedLeft||!!(keys&32),pressedRight:input.pressedRight||!!(keys&16),pressedX:input.pressedX||!!(keys&1024)};
  if(input.pressedA||input.pressedB)return true;
  const dir=input.pressedUp?0:input.pressedDown?1:input.pressedLeft?2:input.pressedRight?3:-1;
  if(dir!==-1){face(player,dir);hooks.onWaitButtonDirection?.(dir);return true;}
  if(input.pressedX){
   // Original sub_02039460 writes env+A4 only. Native success yields;
   // message close, ReleaseAll, End and environment teardown still follow.
   if(typeof hooks.onDeferredMenu==='function'&&hooks.menuContinuationEligible?.({scriptId,generation})===true){
    if(!current()||!active||!environment)return false;
    environment.continuation='sub_020351A0';emit('defer-menu',{scriptId});return true;
   }
   // An unadmitted successor remains an explicit unfinished boundary.
   emit('unsupported-wait-button-x',{scriptId});
   hooks.onUnsupportedWaitButtonX?.({scriptId,generation});return false;
  }return false;
 }
 function scriptVisit(input={}){
  if(!active||cancelled)return false;
  const callbackId=input.callbackId??lastScriptId+1;
  if(!Number.isSafeInteger(callbackId)||callbackId<0)fail('invalid script callback ID');
  if(callbackId<=lastScriptId)return false;lastScriptId=callbackId;
  if(!ensureCurrent())return false;scriptVisits++;
  if(native){
   let done=false;
   if(native.kind==='movement')done=counter===0;
   else if(native.kind==='printer')done=hooks.isPrinterFinished(message)===true;
   else if(native.kind==='timer'){environment.scratch[native.variable]=(environment.scratch[native.variable]-1)&0xffff;done=environment.scratch[native.variable]===0;}
   else if(native.kind==='button')done=button(input);
   if(!ensureCurrent()||!active)return false;
   if(done){const kind=native.kind;native=null;emit('native-success',{kind});}
   // RunScriptCommand always returns after its native visit, including success.
   return true;
  }
  for(let guard=0;guard<32&&active;guard++){
   if(!ensureCurrent())return false;
   const n=NODES.get(pc);if(!n)fail('unadmitted instruction at '+pc);
   pc+=n.size;emit('opcode',{offset:n.offset,opcode:n.opcode,name:n.name});
   if(!ensureCurrent()||!active)return false;
   switch(n.opcode){
    case 0x60: locked=true;hooks.lock?.({generation,scriptId,lastInteracted:null});return true;
    case 0x61: locked=false;hooks.unlock?.({generation,scriptId,reason:'release-all'});return true;
    case 0x5e: installStream(n.args[0],n.target);break;
    case 0x5f: setNative('movement');return true;
    case 0x1e: write('flags',n.args[0],true);break;
    case 0xcd: case 0xce: break; // Fixed explicit name bindings below preserve slot roles.
    case 0x16: pc=n.target;break;
    case 0x28: write('vars',n.args[0],n.args[1]);break;
    case 0x2c: {
     const m=data.messages[n.args[0]],bindings=scriptId===2?{0:playerName,1:rivalName}:{0:playerName};
     const handle=hooks.openMessage({bank:501,index:m.index,tokens:m.tokens,bindings,waitButton:false,scriptId,generation});
     // A hook may synchronously cancel/replace the field. Do not install stale work.
     if(!current()||!active){if(handle!=null)hooks.closeMessage(handle,{reason:'cancelled-during-open',generation,scriptId});if(!cancelled)cancel('stale-open');return false;}
     if(handle==null)fail('openMessage must return an owned printer handle');message=handle;setNative('printer');return true;
    }
    case 0x34: closeMessage('source-close');break;
    case 0x03: environment.scratch[n.args[1]]=n.args[0];setNative('timer',{variable:n.args[1]});return true;
    case 0x31: setNative('button');return true;
    case 0x02:
     if(counter!==0||message!==null||locked)fail('End with unreleased resources');active=false;writes.clear();
     for(const rec of records)if(OWNERS.get(rec.actor)===owner)OWNERS.delete(rec.actor);
     emit('end',{scriptId});
     // RunScriptCommand sees StopScript's null pointer in this same visit.
     // The outer runner destroys all contexts/buffers/environment BEFORE its
     // captured continuation. No actor or freed environment escapes the hook.
     if(environment){
      const ending=environment,continuation=ending.continuation;environment=null;ending.contextCount=0;emit('context-delete');
      ending.messageFormat=false;emit('message-format-delete');
      ending.strings=0;emit('strings-delete',{count:2});emit('environment-free');
      if(continuation&&current()){emit('deferred-menu-call',{continuation});if(current())hooks.onDeferredMenu({scriptId,generation,continuation,callbackId});}
     }
     return true;
    default: fail('unadmitted opcode '+n.opcode);
   }
  }
  if(active)fail('bounded opcode iteration exceeded');return true;
 }
 function ready(rec){return rec.actor.active!==false&&!((rec.actor.sourceFlags||0)&2)&&(!rec.held||rec.held.finished);}
 function streamTick(s){
  if(s.observed||s.done)return;
  if(s.state===0){s.repeat=0;s.state=1;}
  if(s.state===3){if(s.rec.held&&!s.rec.held.finished)return;s.state=4;}
  if(s.state===4){
   s.repeat++;
   if(s.repeat<s.source.pairs[s.index][1])s.state=1;
   else{s.index++;if(s.source.pairs[s.index][0]===0xfe){s.done=true;s.state=5;emit('stream-done',{eventId:s.rec.eventId,offset:s.source.offset});return;}s.repeat=0;s.state=1;}
  }
  if(s.state===1){if(!ready(s.rec))return;s.state=2;}
  if(s.state===2){
   const code=s.source.pairs[s.index][0];
   s.rec.held={code,initialized:false,finished:false,elapsed:0,remaining:null,effect:null};
   s.rec.actor.sourceFlags=((s.rec.actor.sourceFlags||0)|0x10)&~0x20;s.state=3;
   emit('held-install',{eventId:s.rec.eventId,code,repeat:s.repeat,offset:s.source.offset+s.index*4});
  }
 }
 function finish(rec){rec.held.finished=true;rec.actor.sourceFlags=(rec.actor.sourceFlags||0)|0x20;emit('held-finished',{eventId:rec.eventId,code:rec.held.code,elapsed:rec.held.elapsed});}
 function actorTick(rec){
  if(!ensureCurrent())return;
  const actor=rec.actor,h=rec.held;
  if(actor.active===false||((actor.sourceFlags||0)&2))return;
  if(h&&!h.finished){
   h.elapsed++;
   if(!h.initialized){
    h.initialized=true;
    if(h.code>=12&&h.code<=15){
     const direction=h.code-12,[dx,dy]=DELTAS[direction];face(actor,direction);
     actor.fromX=actor.x;actor.fromY=actor.y;actor.toX=actor.x+dx;actor.toY=actor.y+dy;
     actor.x=actor.toX;actor.y=actor.toY;actor.progress=0;actor.step=(actor.step||0)+1;rec.selector=3;h.remaining=8;
    }else if(h.code===32||h.code===33){face(actor,h.code-32);rec.selector=3;h.remaining=9;}
    else if(h.code===62||h.code===63)h.remaining=h.code===62?4:8;
    else if(h.code===75){
     h.effect=effects.createCommand75(actor);
     if(!ensureCurrent()||!active){if(h.effect!=null){if(effects.cancelOwner)effects.cancelOwner(actor);else effects.destroy(h.effect,'cancelled-during-create');}return;}
     emit('effect-create',{eventId:rec.eventId});graphics(rec,rec.selector);return;
    }else fail('unsupported movement command '+h.code);
   }
   if(h.code>=12&&h.code<=15){
    h.remaining--;actor.progress=(8-h.remaining)/8;
    if(h.remaining===0){
     actor.fromX=actor.x;actor.fromY=actor.y;
     // sub_020586A0 dispatches moving graphics BEFORE selector is reset to0.
     graphics(rec,3,'final-movement');if(!ensureCurrent()||!active)return;
     rec.selector=0;finish(rec);
    }
   }else if(h.code===32||h.code===33){if(--h.remaining===0){rec.selector=0;finish(rec);}}
   else if(h.code===62||h.code===63){if(h.remaining===0)finish(rec);else h.remaining--;}
   else if(h.code===75){
    const result=effects.pollMovement(h.effect,actor);
    if(!ensureCurrent()||!active)return;
    if(result?.movementFinished){h.effect=null;finish(rec);emit('effect-observed',{eventId:rec.eventId});}
   }
  }
  graphics(rec,rec.selector);
 }
 function mainQueueVisit(input={}){
  if(!active||cancelled)return false;
  const callbackId=typeof input==='number'?input:(input.callbackId??lastQueueId+1);
  if(!Number.isSafeInteger(callbackId)||callbackId<0)fail('invalid main-queue callback ID');
  if(callbackId<=lastQueueId)return false;lastQueueId=callbackId;
  if(!ensureCurrent())return false;queueVisits++;
  effects.beginTraversal();
  try{
   // Snapshot iteration preserves task creation order and separates observer
   // completion from stream completion from actor completion by queue visits.
   for(const s of streams){if(!ensureCurrent()||!active)return false;if(s.done&&!s.observed){clearHeld(s.rec);s.observed=true;counter--;emit('observer-finished',{eventId:s.rec.eventId,activeMovementCounter:counter});}}
   for(const s of streams){if(!ensureCurrent()||!active)return false;streamTick(s);}
   for(const rec of records){if(!ensureCurrent()||!active)return false;const observed=rec.actor===player&&typeof hooks.beforePlayerCallback==='function',facts=()=>({held:rec.held?{code:rec.held.code,initialized:rec.held.initialized,finished:rec.held.finished}:null,movementAllowed:rec.actor.active!==false&&!((rec.actor.sourceFlags||0)&2)}),visit=observed?hooks.beforePlayerCallback(player,facts()):null;actorTick(rec);if(observed)hooks.afterPlayerCallback(player,visit,{...facts(),current:current()&&active});}
   if(!ensureCurrent()||!active)return false;effects.updateEffects();
  }finally{effects.endTraversal();}
  return true;
 }
 function snapshot(){return{generation,active:ownsField(),cancelled,cancelReason,locked,scriptId,pc,native:native?{...native}:null,activeMovementCounter:counter,scriptVisits,queueVisits,messageOpen:message!==null,environment:environment?{...environment,scratch:{...environment.scratch}}:null,storyState:story.vars[data.variable],flag87:!!story.flags[data.flag],streams:streams.map(s=>({eventId:s.rec.eventId,offset:s.source.offset,index:s.index,repeat:s.repeat,state:s.state,done:s.done,observed:s.observed,held:!s.observed&&s.rec.held?{code:s.rec.held.code,initialized:s.rec.held.initialized,finished:s.rec.held.finished,elapsed:s.rec.held.elapsed,remaining:s.rec.held.remaining,hasEffect:s.rec.held.effect!==null}:null})),trace:trace.map(e=>({...e}))};}
 // Host adapters may synchronously cancel, but may not nest field/script/main
 // callbacks or replace the context during End teardown. One original callback
 // finishes before any next callback can consume its ID or install an owner.
 function advance(fn,input){if(advancing)return false;advancing=true;try{return fn(input);}finally{advancing=false;}}
 return{dispatch:input=>advance(dispatchVisit,input),tickScript:input=>advance(scriptVisit,input),tickMainQueue:input=>advance(mainQueueVisit,input),cancel,snapshot,ownsField,isLocked:()=>locked&&!cancelled};
}
return Object.freeze({data,createController});
});
