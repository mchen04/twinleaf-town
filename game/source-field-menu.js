(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SourceFieldMenu=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
// Independently authored, finite ordinary fresh-save menu interpreter.
// OPTIONS uses the retained field/application parent states2/3/12/14.
// BAG, trainer and SAVE remain explicit unsupported applications.
const KEYS=Object.freeze({A:1,B:2,RIGHT:16,LEFT:32,UP:64,DOWN:128,X:1024});
const OPTION_IDS=Object.freeze([2,3,4,5,6]);
const SOURCE=Object.freeze({commit:'b623abef1b4dfe204ca50aab42447ac00c134290',menuSha256:'79070e1ec361f05c353bf353209ba4489cce29ca9992fbb9532faca564cdc279',hiddenMask:0x183});
function fail(message){throw Error('SourceFieldMenu: '+message);}
function callbackId(value){if(value!==undefined&&(!Number.isSafeInteger(value)||value<0))fail('callbackId must be a nonnegative safe integer');return value;}
function createController(options={}){
 const {profile:input,generation:initialGeneration,art,assets,hooks={}}=options;let generation=initialGeneration;
 if(!input||!Number.isInteger(input.header)||input.header<411||input.header>417||input.normalFieldMode!==0||input.bagUnlocked!==true||input.starter!==0||input.sinnohDex!==false||input.safari!==false||input.palPark!==false||input.amitySquare!==false)fail('explicit ordinary fresh Twinleaf profile required');
 if(typeof input.playerName!=='string'||input.playerName.length===0||![0,1].includes(input.gender))fail('explicit player name and source gender required');
 if(generation===undefined||generation===null)fail('explicit field generation required');
 for(const name of ['isOwnerCurrent','pauseActors','resumeActors','requestSound','onUnsupportedAction'])if(typeof hooks[name]!=='function')fail('missing hook '+name);
 for(const name of ['createCursorAnimation','createIconAnimation','setIconPhase','resolveSelectedTransition','tickAnimation','render'])if(typeof art?.[name]!=='function')fail('missing art adapter '+name);
 if(!assets)fail('explicit authenticated art assets required');
 const profile=Object.freeze({...input}),labels=Object.freeze(['BAG',profile.playerName,'SAVE','OPTIONS','EXIT']);
 let remembered=options.rememberedOptionId===undefined?0:options.rememberedOptionId;
 if(!Number.isInteger(remembered)||remembered<0||remembered>8)fail('rememberedOptionId must be an original option ID');
 let active=false,cancelled=false,busy=false,paused=false,state=null,owner=null,entry=null,epoch=0,sessionId=0;
 let selectedRow=0,icons=[],cursor=null,resources=null,unsupportedAction=null,cancelReason=null,closeReason=null;
 let visits=0,animationVisits=0,lastCallbackId=-1,entryCallbackId=null,sessionVisits=0;
 const trace=[];
 const applicationHooks=['beginApplicationFade','applicationFadeFinished','launchOptions','applicationRunning','restoreAfterOptions','fieldReady','acceptGenerationRebind'];
 if(applicationHooks.some(k=>hooks[k]!==undefined)&&!applicationHooks.every(k=>typeof hooks[k]==='function'))fail('complete Options application hooks required');
 const optionsSupported=applicationHooks.every(k=>typeof hooks[k]==='function');
 function live(token){return active&&!cancelled&&epoch===token;}
 function event(type,detail={}){const record=Object.freeze({type,sessionId,visits,sessionVisits,state,...detail});trace.push(record);if(trace.length>256)trace.shift();hooks.onEvent?.(record);}
 function current(token){if(!live(token))return false;const valid=hooks.isOwnerCurrent(owner)===true;if(!live(token))return false;if(!valid){cancel('stale-owner');return false;}return true;}
 function animationSnapshot(animation){if(!animation)return null;const copy={};for(const key of ['kind','optionId','gender','phase','sequenceIndex','frameIndex','elapsedFx','running','base','paletteBank'])if(animation[key]!==undefined)copy[key]=animation[key];return copy;}
 function snapshot(){return {active,cancelled,state,entry,owner,paused,generation,profile,hiddenMask:SOURCE.hiddenMask,optionIds:OPTION_IDS.slice(),labels:labels.slice(),selectedRow,selectedOptionId:OPTION_IDS[selectedRow],rememberedOptionId:remembered,unsupportedAction:unsupportedAction?{...unsupportedAction}:null,cancelReason,closeReason,visits,sessionVisits,animationVisits,lastCallbackId,entryCallbackId,resourcesLive:!!resources,resourceCounts:resources?{environment:1,window:resources.window?1:0,list:resources.list?1:0,menu:resources.menu?1:0,spriteSet:resources.spriteSet?1:0,cursor:cursor?1:0,icons:icons.length}:{environment:0,window:0,list:0,menu:0,spriteSet:0,cursor:0,icons:0},animations:{cursor:animationSnapshot(cursor),icons:icons.map(animationSnapshot)},trace:trace.slice()};}
 function release(reason,terminal){
  const oldOwner=owner,oldResources=resources,wasPaused=paused,errors=[];
  // Detach ownership and every resource before calling out. Reentrant cleanup
  // cannot double-free, unpause twice, or replay a sound after this point.
  active=false;epoch++;if(terminal)cancelled=true;
  resources=null;icons=[];cursor=null;paused=false;state=null;
  if(oldResources){try{hooks.onResourcesDestroyed?.({owner:oldOwner,reason,resources:{...oldResources}});}catch(error){errors.push(error);}}
  if(wasPaused){try{hooks.resumeActors(oldOwner,{reason});}catch(error){errors.push(error);}}
  try{event(terminal?'cancel':'closed',{reason});}catch(error){errors.push(error);}
  if(errors.length)throw errors[0];
 }
 function cancel(reason='cancelled'){
  if(cancelled)return false;
  const previousBusy=busy;busy=true;cancelReason=String(reason);
  try{release(cancelReason,true);return true;}finally{busy=previousBusy;}
 }
 function guarded(action){
  if(busy)return false;busy=true;
  try{return action();}catch(error){if(!cancelled){try{cancel('adapter-error');}catch(cleanupError){if(error&&typeof error==='object')error.cleanupError=cleanupError;}}throw error;}finally{busy=false;}
 }
 function sound(id,token,reason){if(!current(token))return false;hooks.requestSound(id,{owner,entry,reason,callbackId:id===1533?entryCallbackId:lastCallbackId,visits,sessionVisits});return current(token);}
 function remember(token){remembered=OPTION_IDS[selectedRow];hooks.rememberOption?.(remembered,owner);return current(token);}
 function begin(spec={}){
  if(active||cancelled||busy)return false;
  if(!['normal','script-continuation'].includes(spec.entry))fail('entry must be normal or script-continuation');
  const id=callbackId(spec.callbackId);
  if(id!==undefined&&id<=lastCallbackId)return false;
  return guarded(()=>{
   entry=spec.entry;entryCallbackId=id===undefined?null:id;sessionVisits=0;sessionId++;epoch++;
   owner=Object.freeze({generation,header:profile.header,sessionId});active=true;state=0;closeReason=null;unsupportedAction=null;
   const token=epoch;
   if(!current(token))return false;
   // Normal: dispatcher PlaySE precedes CreateTask. Deferred: sub_020351A0
   // PlaySE precedes TaskManager_Jump, after the old script environment is gone.
   if(!sound(1533,token,entry==='normal'?'input-dispatcher':'script-continuation'))return false;
   resources={environment:true,window:false,list:false,menu:false,spriteSet:false};
   // sub_02035080 resets an eligible player after allocation, before task
   // creation. sub_020351A0 (script continuation) deliberately does not.
   if(entry==='normal'&&hooks.resetPlayerForNormalEntry){hooks.resetPlayerForNormalEntry(owner);if(!current(token))return false;}
   event('begin',{entry,entryCallbackId});return current(token);
  });
 }
 function construct(token){
  paused=true;hooks.pauseActors(owner);if(!current(token))return false;
  event('actors-paused');if(!current(token))return false;
  resources.window=true;resources.list=true;resources.menu=true;
  const found=OPTION_IDS.indexOf(remembered);selectedRow=found<0?0:found;
  if(!remember(token))return false;
  resources.spriteSet=true;
  const createdCursor=art.createCursorAnimation(assets);if(!current(token))return false;cursor=createdCursor;
  for(const optionId of OPTION_IDS){const icon=art.createIconAnimation(assets,optionId,profile.gender,0);if(!current(token))return false;icons.push(icon);}
  art.setIconPhase(icons[selectedRow],2);if(!current(token))return false;
  hooks.onResourcesCreated?.({owner,optionIds:OPTION_IDS.slice(),labels:labels.slice(),selectedRow,resources:{...resources}});if(!current(token))return false;
  state=1;event('constructed',{selectedRow,optionId:OPTION_IDS[selectedRow]});return current(token);
 }
 function processInput(keys,token){
  const oldRow=selectedRow;let action=null,nextRow=oldRow;
  // sub_02001D2C reads only newKeys. Never consult held/repeat/touch state.
  if(keys&KEYS.A){if(!sound(1500,token,'activate'))return false;action='activate';}
  else if(keys&(KEYS.B|KEYS.X)){if(!sound(1500,token,'cancel'))return false;action='cancel';}
  else if(keys&KEYS.UP)nextRow=(oldRow+OPTION_IDS.length-1)%OPTION_IDS.length;
  else if(keys&KEYS.DOWN)nextRow=(oldRow+1)%OPTION_IDS.length;
  // Left/Right are intentionally no-ops for the source one-column list.
  if(nextRow!==oldRow){
   // Native list updates its row, then PlaySE1504, before the outer menu
   // consumer changes cursor/icons and field+0x8C option-ID memory.
   selectedRow=nextRow;
   if(!sound(1504,token,'navigation'))return false;
   art.setIconPhase(icons[oldRow],0);if(!current(token))return false;
   art.setIconPhase(icons[selectedRow],1);if(!current(token))return false;
   if(!remember(token))return false;
   unsupportedAction=null;event('selection',{oldRow,selectedRow,optionId:OPTION_IDS[selectedRow]});if(!current(token))return false;
  }
  // sub_02035C78 runs AFTER input/selection, BEFORE action dispatch/tail.
  art.resolveSelectedTransition(icons[selectedRow]);if(!current(token))return false;
  if(action==='cancel'||action==='activate'&&OPTION_IDS[selectedRow]===6){state=13;closeReason=action==='cancel'?'cancel-input':'exit';event('close-selected',{reason:closeReason});}
  else if(action==='activate'&&OPTION_IDS[selectedRow]===5&&optionsSupported){hooks.beginApplicationFade(false,owner);if(!current(token))return false;state=2;event('options-selected');}
  else if(action==='activate'){
   unsupportedAction=Object.freeze({optionId:OPTION_IDS[selectedRow],label:labels[selectedRow],status:'unfinished',message:labels[selectedRow]+' application is not implemented in this finite source menu.'});
   hooks.onUnsupportedAction({...unsupportedAction,owner});if(!current(token))return false;
   event('unsupported-action',unsupportedAction);
  }
  return current(token);
 }
 function animationTail(token){
  // Source sprite array order: cursor, then row icons. All advance once by
  // FX32_ONE on construction/input/close-selection, never after release.
  for(const animation of [cursor,...icons]){if(!current(token))return false;art.tickAnimation(animation,4096);if(!current(token))return false;}
  animationVisits++;event('animation-tail');return current(token);
 }
 function disposePresentation(token){const old=resources;resources={environment:true,window:false,list:false,menu:false,spriteSet:false};icons=[];cursor=null;if(old)hooks.onResourcesDestroyed?.({owner,reason:'options-launch',resources:{...old}});return current(token);}
 function rebindGeneration(expected,next){
  if(busy||!active||cancelled||state!==12||generation!==expected||!Number.isSafeInteger(next)||next<=expected)fail('retained generation rebind boundary');
  const token=epoch;return guarded(()=>{if(!hooks.acceptGenerationRebind(owner,expected,next))fail('unaccepted retained generation');if(!live(token))fail('retired during generation rebind');generation=next;event('retained-generation-rebound',{previous:expected,generation:next});return current(token);});
 }
 function tick(input={}){
  if(!active||cancelled||busy)return false;
  const id=callbackId(input.callbackId),keys=input.newKeys===undefined?0:input.newKeys;
  if(!Number.isSafeInteger(keys)||keys<0||keys>0xffff)fail('newKeys must be a DS key bitmask');
  return guarded(()=>{
   const token=epoch;if(!current(token))return false;
   if(input.eligible!==true)return false;
   if(id!==undefined&&(id<=lastCallbackId||entryCallbackId!==null&&(id<entryCallbackId||entry==='script-continuation'&&id===entryCallbackId)))return false;
   if(id!==undefined)lastCallbackId=id;
   visits++;sessionVisits++;
   if(state===13){release(closeReason||'exit',false);return true;}
   if(state===0){if(!construct(token))return false;}
   else if(state===1){if(!processInput(keys,token))return false;}
   else if(state===2){if(hooks.applicationFadeFinished(owner)){if(!current(token)||!disposePresentation(token))return false;hooks.launchOptions(owner);if(!current(token))return false;state=3;event('options-launched');}}
   else if(state===3){if(!hooks.applicationRunning(owner)){if(!current(token))return false;hooks.restoreAfterOptions(owner);if(!current(token))return false;state=12;event('field-restore-requested');}}
   else if(state===12){if(hooks.fieldReady(owner)){if(!current(token)||!construct(token))return false;hooks.beginApplicationFade(true,owner);if(!current(token))return false;state=14;event('menu-return-fade');}}
   else if(state===14){if(hooks.applicationFadeFinished(owner)){if(!current(token))return false;state=1;event('options-returned');}}
   else fail('unsupported task state');
   if(!current(token))return false;return cursor&&icons.length?animationTail(token):true;
  });
 }
 function render(){
  if(!active||cancelled||busy||!cursor||icons.length!==OPTION_IDS.length)return null;
  let output=null;
  const ok=guarded(()=>{const token=epoch;if(!current(token))return false;output=art.render(assets,{optionIds:OPTION_IDS.slice(),playerName:profile.playerName,selectedRow,icons:icons.slice(),cursor});return current(token);});
  return ok?output:null;
 }
 return Object.freeze({begin,tick,ownsField:()=>active&&!cancelled,isPaused:()=>paused,snapshot,cancel,render,rebindGeneration});
}
return Object.freeze({createController,KEYS,OPTION_IDS,SOURCE});
});
