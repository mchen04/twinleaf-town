/* Finite source978:2 /980:1 scene consumer. Native queue order, not an elapsed clock.
 * This module requires real source-bound actor, door, printer and audio consumers.
 * It does not create renderers, replace input, infer saves or synthesize audio. */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f(require('./source-rival-script-data.js'),require('./original-motion.js'),require('./player-motion.js'));else r.SourceRivalScripts=f(r.SourceRivalScriptData,r.OriginalMotion,r.PlayerMotion);})(typeof globalThis!=='undefined'?globalThis:this,function(Data,Motion,Player){
'use strict';
const owners=new WeakMap(),dirs=['up','down','left','right'],delta=[[0,-1],[0,1],[-1,0],[1,0]],own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
function need(ok,m){if(!ok)throw Error('SourceRivalScripts: '+m);}
function createController({header,generation,player,rival=null,story,playerName,rivalName,effects,hooks={}}={}){
 const data=Data.scenes[header];need(data&&[411,413].includes(header),'bounded source header');
 need(player&&generation!==undefined&&generation!==null,'explicit player/generation');
 need(story?.vars&&story?.flags&&!(story.flags instanceof Set),'plain shared story');
 for(const k of [0x4070,0x40e6,0x40a3])need(own(story.vars,k)&&Number.isInteger(story.vars[k])&&story.vars[k]>=0&&story.vars[k]<=65535,'explicit story variable '+k);
 for(const k of [402,528])need(own(story.flags,k)&&typeof story.flags[k]==='boolean','explicit story flag '+k);
 need(typeof playerName==='string'&&playerName.length&&typeof rivalName==='string'&&rivalName.length,'explicit names');
 for(const k of ['isOwnerCurrent','lock','unlock','openMessage','isPrinterFinished','closeMessage','addRival','removeRival','playEffect','stopBgm','startRivalMusic','beginBgmFade','bgmFadeFinished','startDefaultMusic'])need(typeof hooks[k]==='function','consumer '+k);
 if(header===411)for(const k of ['prepareDoor','openDoor','doorFinished','closeDoor','freeDoor'])need(typeof hooks[k]==='function','door consumer '+k);
 for(const k of ['beginTraversal','createCommand75','pollMovement','updateEffects','endTraversal','cancelOwner'])need(typeof effects?.[k]==='function','effect consumer '+k);
 need(header!==411||rival===null,'outdoor rival is created only by AddEvent');
 need(header!==413||(rival&&rival!==player&&rival.header===413&&rival.eventId===0&&rival.active!==false&&!story.flags[528]),'fresh visible upstairs rival');
 const owner=Object.freeze({header,generation,player}),nodes=new Map(data.nodes.map(n=>[n.offset,n]));
 const records=[{actor:player,eventId:255,selector:0,held:null,removed:false}],streams=[],writes=new Map(),trace=[];
 if(rival)records.push({actor:rival,eventId:data.rival.eventId,selector:0,held:null,removed:false});
 let active=false,cancelled=false,locked=false,pc=data.entry,native=null,child=null,message=null,door=null,advancing=false,rivalCreated=false,committed=false;
 let scriptVisits=0,queueVisits=0,lastScript=-1,lastQueue=-1,counter=0,cancelReason=null,environment=null;
 function emit(type,extra={}){const e={type,header,scriptVisits,queueVisits,...extra};trace.push(e);if(trace.length>256)trace.shift();hooks.onEvent?.(e);}
 function current(){if(cancelled||player.active===false)return false;const ok=hooks.isOwnerCurrent(owner)===true;return ok&&!cancelled&&player.active!==false;}
 function ensure(){if(current())return true;if(!cancelled)cancel('stale-owner');return false;}
 function write(kind,key,value){const k=kind+':'+key;if(!writes.has(k))writes.set(k,{kind,key,had:own(story[kind],key),before:story[kind][key]});story[kind][key]=value;emit('state-write',{kind,key,value});}
 function close(reason){if(message===null)return;const h=message;message=null;hooks.closeMessage(h,{reason,header,generation});}
 function clearHeld(rec){if(owners.get(rec.actor)!==owner)return;rec.actor.sourceFlags=(rec.actor.sourceFlags||0)&~0x30;rec.held=null;}
 function cancel(reason='cancelled'){
  if(cancelled||committed)return false;cancelled=true;active=false;cancelReason=String(reason);native=null;child=null;environment=null;
  const errors=[];
  for(const rec of records){try{effects.cancelOwner(rec.actor);}catch(e){errors.push(e);}clearHeld(rec);if(owners.get(rec.actor)===owner)owners.delete(rec.actor);}
  if(rivalCreated){const rec=records.find(r=>r.actor===rival);if(rec&&!rec.removed){rec.removed=true;try{hooks.removeRival(rival,{reason:cancelReason});}catch(e){errors.push(e);}}}
  streams.length=0;counter=0;
  if(door!==null){const d=door;door=null;try{hooks.freeDoor(d,{reason:cancelReason});}catch(e){errors.push(e);}}
  try{close(cancelReason);}catch(e){errors.push(e);}
  for(const w of writes.values()){if(w.had)story[w.kind][w.key]=w.before;else delete story[w.kind][w.key];}writes.clear();
  if(locked){locked=false;try{hooks.unlock({header,generation,reason:cancelReason});}catch(e){errors.push(e);}}
  emit('cancel',{reason:cancelReason});if(errors.length)throw new AggregateError(errors,'Rival cancellation');return true;
 }
 function dispatch(input={}){
  if(active||cancelled||committed||input.eligible!==true||input.header!==header||!ensure())return false;
  if(story.vars[data.trigger.variable]!==data.trigger.value)return false;
  if(header===411&&(!input.completedStep||input.stepPreempted||input.x!==9||input.z!==12))return false;
  if(header===413&&input.suppressLevel)return false;
  need(player.progress===1&&!player.playerMotion?.command,'settled source trigger player');
  if(header===411)need(story.flags[402]===true,'hidden outdoor rival before source ClearFlag');
  for(const rec of records)need(!owners.has(rec.actor)&&rec.actor.progress===1,'settled unowned scene actor');
  for(const rec of records)owners.set(rec.actor,owner);
  active=true;locked=false;pc=data.entry;native=null;writes.clear();environment={contexts:1,childWait:0,bindings:{},scratch:{}};
  emit('dispatch',{scriptId:data.scriptId,pc});return true;
 }
 function face(actor,d){if(!actor.facingSuppressed&&!((actor.sourceFlags||0)&0x80))actor.facing=dirs[d];}
 function graphics(rec,phase='regular'){
  if(!ensure()||rec.removed)return;const actor=rec.actor,allowed=hooks.actorCallbackAllowed?hooks.actorCallbackAllowed(actor)!==false:true;
  const eligible=!((actor.sourceFlags||0)&0x100)&&(hooks.actorAdvanceEligible?hooks.actorAdvanceEligible(actor)!==false:true);
  if(actor===player){Player.attach(actor);Player.gaitCallback(actor.playerMotion.gait,rec.selector,actor.facing,{allowed,eligible});}
  else Motion.gaitCallback(actor,rec.selector,{callbackAllowed:allowed,advanceEligible:eligible});
  if(allowed)actor.sourceGraphicsHidden=!!((actor.sourceFlags||0)&0x200);
  emit('graphics',{eventId:rec.eventId,selector:rec.selector,phase});
 }
 function install(eventId,offset){const rec=records.find(r=>r.eventId===eventId&&!r.removed),source=data.streams[offset];need(rec&&source&&!streams.some(s=>s.rec===rec&&!s.observed),'owned nonoverlapping source movement');streams.push({rec,source,index:0,repeat:0,state:0,done:false,observed:false});counter++;emit('apply-movement',{eventId,offset,counter});}
 function setNative(kind,extra={}){native={kind,...extra};emit('native-install',{kind});}
 function runChild(){
  if(!child||!active||!ensure())return;const c=child;
  if(c.waiting){if(hooks.bgmFadeFinished(c.fade)===true){c.waiting=false;emit('child-native-success',{id:c.id});}return;}
  if(c.id===2042){hooks.stopBgm();if(!ensure())return;hooks.startRivalMusic();if(!ensure())return;}
  else if(c.phase===0){c.fade=hooks.beginBgmFade({target:0,duration:30});need(c.fade!=null,'owned fade wait');c.phase=1;c.waiting=true;emit('child-fade',{id:c.id,duration:30});return;}
  else{hooks.stopBgm();if(!ensure())return;hooks.startDefaultMusic();if(!ensure())return;}
  environment.childWait=0;environment.contexts--;emit('child-ack',{id:c.id});child=null;emit('child-end',{id:c.id});
 }
 function script(input={}){
  if(!active||cancelled)return false;const visit=input.callbackId??lastScript+1;need(Number.isSafeInteger(visit)&&visit>=0,'callback ID');if(visit<=lastScript)return false;lastScript=visit;if(!ensure())return false;scriptVisits++;
  if(native){const waitingKind=native.kind;let done=false;
   if(native.kind==='movement')done=counter===0;
   else if(native.kind==='printer')done=hooks.isPrinterFinished(message)===true;
   else if(native.kind==='door')done=hooks.doorFinished(door)===true;
   else if(native.kind==='child')done=environment.childWait===0;
   else if(native.kind==='timer'){environment.scratch[native.variable]=(environment.scratch[native.variable]-1)&65535;emit('environment-write',{variable:native.variable,value:environment.scratch[native.variable]});done=environment.scratch[native.variable]===0;}
   if(!ensure()||!active)return false;
   if(done){const kind=native.kind;native=null;emit('native-success',{kind});}
   // Door wait is a TaskManager child: its successful pop immediately visits
   // the parent in the same task pass. ScriptContext native polls still yield.
   if(waitingKind!=='door'||!done){runChild();return true;}
  }
  for(let guard=0;guard<32&&active;guard++){
   if(!ensure())return false;const n=nodes.get(pc);need(n,'admitted source PC');pc+=n.size;emit('opcode',{offset:n.offset,opcode:n.opcode});if(!ensure()||!active)return false;
   switch(n.opcode){
    case 0x60:locked=true;hooks.lock({header,generation});return true;
    case 0x61:locked=false;hooks.unlock({header,generation,reason:'release-all'});return true;
    case 0x1e:write('flags',n.args[0],true);break;
    case 0x1f:write('flags',n.args[0],false);break;
    case 0x28:write('vars',n.args[0],n.args[1]);break;
    case 0xcd:environment.bindings[n.args[0]]=playerName;break;
    case 0xce:environment.bindings[n.args[0]]=rivalName;break;
    case 0x168:need(door===null,'one door lease');door=hooks.prepareDoor({matrixX:n.args[0],matrixZ:n.args[1],x:n.args[2],z:n.args[3],id:n.args[4]});need(door!=null,'owned door handle');break;
    case 0x16b:need(door!==null,'prepared door');hooks.openDoor(door);break;
    case 0x16c:need(door!==null,'prepared door');hooks.closeDoor(door);break;
    case 0x169:need(door!==null,'prepared door');setNative('door');return true;
    case 0x16a:{need(door!==null,'prepared door');const d=door;door=null;hooks.freeDoor(d,{reason:'source-free'});break;}
    case 0x64:{need(header===411&&n.args[0]===2&&!rival&&!story.flags[402],'source outdoor AddEvent');const a=hooks.addRival(data.rival);need(a&&a!==player&&a.header===411&&a.eventId===2&&!owners.has(a),'fresh exact rival actor');if(!ensure()||!active){hooks.removeRival(a,{reason:'stale-add'});return false;}rival=a;rivalCreated=true;owners.set(a,owner);records.push({actor:a,eventId:2,selector:0,held:null,removed:false});emit('actor-added',{id:a.id});break;}
    case 0x65:{const rec=records.find(r=>r.eventId===n.args[0]&&r.actor!==player&&!r.removed);need(rec&&counter===0,'settled remove actor');effects.cancelOwner(rec.actor);clearHeld(rec);owners.delete(rec.actor);rec.removed=true;hooks.removeRival(rec.actor,{reason:'source-remove'});if(!ensure()||!active)return false;write('flags',data.rival.hideFlag,true);emit('actor-removed',{id:rec.actor.id});break;}
    case 0x5e:install(n.args[0],n.target);break;
    case 0x5f:setNative('movement');return true;
    case 0x49:hooks.playEffect(n.args[0]);break;
    case 0x2c:{const m=data.messages[n.args[0]],h=hooks.openMessage({bank:data.messageBank,index:m.index,tokens:m.tokens,bindings:{...environment.bindings},waitButton:false,header,generation});if(!current()||!active){if(h!=null)hooks.closeMessage(h,{reason:'stale-open',header,generation});if(!cancelled)cancel('stale-open');return false;}need(h!=null,'owned printer');message=h;setNative('printer');return true;}
    case 0x34:close('source-close');break;
    case 0x03:need(n.args[1]===0x800c&&[15,30].includes(n.args[0]),'source environment wait operand');environment.scratch[n.args[1]]=n.args[0];emit('environment-write',{variable:n.args[1],value:n.args[0]});setNative('timer',{variable:n.args[1]});return true;
    case 0x14:need(!child&&[2042,2043].includes(n.args[0]),'one supported child');child={id:n.args[0],phase:0,waiting:false,fade:null};environment.childWait=1;environment.contexts++;setNative('child');runChild();return true;
    case 0x02:need(!locked&&counter===0&&message===null&&door===null&&!child&&environment.contexts===1,'clean source End');active=false;committed=true;writes.clear();for(const rec of records)if(owners.get(rec.actor)===owner)owners.delete(rec.actor);environment=null;emit('end',{scriptId:data.scriptId});return true;
    default:need(false,'unsupported source opcode '+n.opcode);
   }
  }
  need(!active,'bounded source opcode loop');return true;
 }
 function streamTick(s){
  if(s.observed||s.done)return;if(s.state===0){s.repeat=0;s.state=1;}
  if(s.state===3){if(s.rec.held&&!s.rec.held.finished)return;s.state=4;}
  if(s.state===4){s.repeat++;if(s.repeat<s.source.pairs[s.index][1])s.state=1;else{s.index++;if(s.source.pairs[s.index][0]===0xfe){s.done=true;s.state=5;emit('stream-done',{eventId:s.rec.eventId,offset:s.source.offset});return;}s.repeat=0;s.state=1;}}
  if(s.state===1){if(s.rec.actor.active===false||((s.rec.actor.sourceFlags||0)&2)||(s.rec.held&&!s.rec.held.finished))return;s.state=2;}
  if(s.state===2){const code=s.source.pairs[s.index][0];s.rec.held={code,initialized:false,finished:false,elapsed:0,remaining:null,effect:null};s.rec.actor.sourceFlags=((s.rec.actor.sourceFlags||0)|0x10)&~0x20;s.state=3;emit('held-install',{eventId:s.rec.eventId,code,repeat:s.repeat});}
 }
 function finish(rec){rec.held.finished=true;rec.actor.sourceFlags=(rec.actor.sourceFlags||0)|0x20;emit('held-finished',{eventId:rec.eventId,code:rec.held.code,elapsed:rec.held.elapsed});}
 function actorTick(rec){
  if(!ensure()||rec.removed)return;const a=rec.actor,h=rec.held;if(a.active===false||((a.sourceFlags||0)&2))return;
  if(h&&!h.finished){h.elapsed++;
   if(!h.initialized){h.initialized=true;const c=h.code;
    if(c>=12&&c<=19){const fast=c>=16,d=c-(fast?16:12),[dx,dy]=delta[d];face(a,d);a.fromX=a.x;a.fromY=a.y;a.toX=a.x+dx;a.toY=a.y+dy;a.x=a.toX;a.y=a.toY;a.progress=0;a.step=(a.step||0)+1;rec.selector=fast?4:3;h.total=h.remaining=fast?4:8;}
    else if(c>=32&&c<=39){const fast=c>=36;face(a,c-(fast?36:32));rec.selector=fast?4:3;h.remaining=fast?5:9;}
    else if(c===62||c===63)h.remaining=c===62?4:8;
    else if(c===0){face(a,0);finish(rec);}
    else if(c===69||c===71||c===72){a.sourceFlags=c===72?(a.sourceFlags||0)&~0x80:(a.sourceFlags||0)|(c===69?0x200:0x80);finish(rec);}
    else if(c===75){h.effect=effects.createCommand75(a);if(!ensure()||!active){effects.cancelOwner(a);return;}emit('effect-create',{eventId:rec.eventId});graphics(rec);return;}
    else need(false,'unsupported held command '+c);
   }
   if(h.code>=12&&h.code<=19){h.remaining--;a.progress=(h.total-h.remaining)/h.total;if(h.remaining===0){a.fromX=a.x;a.fromY=a.y;graphics(rec,'final-movement');if(!ensure()||!active)return;rec.selector=0;finish(rec);}}
   else if(h.code>=32&&h.code<=39){if(--h.remaining===0){rec.selector=0;finish(rec);}}
   else if(h.code===62||h.code===63){if(h.remaining===0)finish(rec);else h.remaining--;}
   else if(h.code===75){const result=effects.pollMovement(h.effect,a);if(!ensure()||!active)return;if(result?.movementFinished){h.effect=null;finish(rec);emit('effect-observed',{eventId:rec.eventId});}}
  }
  graphics(rec);
 }
 function queue(input={}){
  if(!active||cancelled)return false;const visit=input.callbackId??lastQueue+1;need(Number.isSafeInteger(visit)&&visit>=0,'queue callback ID');if(visit<=lastQueue)return false;lastQueue=visit;if(!ensure())return false;queueVisits++;
  effects.beginTraversal();try{
   for(const s of streams){if(!ensure()||!active)return false;if(s.done&&!s.observed){clearHeld(s.rec);s.observed=true;counter--;emit('observer-finished',{eventId:s.rec.eventId,counter});}}
   for(const s of streams){if(!ensure()||!active)return false;streamTick(s);}
   for(const rec of records){if(!ensure()||!active)return false;if(rec.removed)continue;const facts=()=>({held:rec.held?{code:rec.held.code,initialized:rec.held.initialized,finished:rec.held.finished}:null,movementAllowed:rec.actor.active!==false&&!((rec.actor.sourceFlags||0)&2)}),observed=rec.actor===player&&typeof hooks.beforePlayerCallback==='function',v=observed?hooks.beforePlayerCallback(player,facts()):null;actorTick(rec);if(observed)hooks.afterPlayerCallback(player,v,{...facts(),current:current()&&active});}
   if(!ensure()||!active)return false;effects.updateEffects();
  }finally{effects.endTraversal();}return true;
 }
 function snapshot(){return{header,generation,active:active&&!cancelled,committed,cancelled,cancelReason,locked,scriptId:data.scriptId,pc,native:native?{...native}:null,child:child?{id:child.id,phase:child.phase,waiting:child.waiting}:null,scriptVisits,queueVisits,activeMovementCounter:counter,messageOpen:message!==null,doorOwned:door!==null,environment:environment?{contexts:environment.contexts,childWait:environment.childWait,bindings:{...environment.bindings},scratch:{...environment.scratch}}:null,streams:streams.map(s=>({eventId:s.rec.eventId,offset:s.source.offset,index:s.index,repeat:s.repeat,state:s.state,done:s.done,observed:s.observed,held:!s.observed&&s.rec.held?{code:s.rec.held.code,initialized:s.rec.held.initialized,finished:s.rec.held.finished,elapsed:s.rec.held.elapsed,remaining:s.rec.held.remaining}:null})),trace:trace.map(e=>({...e}))};}
 function advance(fn,value){if(advancing)return false;advancing=true;try{return fn(value);}finally{advancing=false;}}
 return Object.freeze({dispatch:v=>advance(dispatch,v),tickScript:v=>advance(script,v),tickMainQueue:v=>advance(queue,v),cancel,snapshot,ownsField:()=>active&&!cancelled,isLocked:()=>locked&&!cancelled});
}
return Object.freeze({data:Data,createController});
});
