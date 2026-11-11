(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SourceOptions=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
// Overlay 60, commit b623abef. No touch handler, elapsed-time clock or disk-save operation.
const NAMES=Object.freeze(['textSpeed','battleScene','battleStyle','soundMethod','buttonMode','frame']);
const COUNTS=Object.freeze([3,2,2,2,3,20]);
const DEFAULTS=Object.freeze({textSpeed:1,battleScene:0,battleStyle:0,soundMethod:0,buttonMode:0,frame:0});
const KEYS=Object.freeze({A:1,B:2,SELECT:4,START:8,RIGHT:16,LEFT:32,UP:64,DOWN:128,R:256,L:512,X:1024,Y:2048});
function check(ok,m){if(!ok)throw Error('SourceOptions: '+m);}
function settings(input){check(input&&typeof input==='object','explicit saved options');const out={};for(let i=0;i<NAMES.length;i++){const k=NAMES[i],d=Object.getOwnPropertyDescriptor(input,k);check(d&&Object.hasOwn(d,'value')&&Number.isInteger(d.value)&&d.value>=0&&d.value<COUNTS[i],'invalid '+k);out[k]=d.value;}return Object.freeze(out);}
function textDelay(input){return [8,4,1][settings(input).textSpeed];}
function remap(mask,mode){check(Number.isInteger(mask)&&mask>=0&&mask<=0xffff,'raw key mask');check(Number.isInteger(mode)&&mode>=0&&mode<=2,'saved button mode');if(mode===1&&mask&KEYS.START)mask|=KEYS.X;if(mode===2){if(mask&KEYS.L)mask|=KEYS.A;mask&=~(KEYS.L|KEYS.R);}return mask;}
class PhysicalInput {
 constructor(mode){check(typeof mode==='function','live button mode provider');this.mode=mode;this.physical=new Map();this.pending=0;}
 keyDown(id,key,{repeat=false}={}){check(Object.hasOwn(KEYS,key),'raw key');if(repeat||this.physical.has(id))return false;const already=Array.from(this.physical.values()).includes(key);this.physical.set(id,key);if(!already)this.pending|=KEYS[key];return !already;}
 keyUp(id){return this.physical.delete(id);}
 pulse(key){check(Object.hasOwn(KEYS,key),'pulse key');if(!Array.from(this.physical.values()).includes(key))this.pending|=KEYS[key];}
 reset(){this.physical.clear();this.pending=0;}
 sample(){let held=0;for(const key of this.physical.values())held|=KEYS[key];const mode=this.mode(),fresh=this.pending;this.pending=0;const newMask=remap(fresh,mode),heldMask=remap(held,mode);return {newKeys:Object.keys(KEYS).filter(k=>newMask&KEYS[k]),heldKeys:Object.keys(KEYS).filter(k=>heldMask&KEYS[k]),rawNewKeys:fresh,rawHeldKeys:held,newMask,heldMask};}
}
function createController({saved,hooks}){
 const initial=settings(saved);check(hooks&&typeof hooks==='object','hooks');
 for(const k of ['isOwnerCurrent','setup','teardown','beginFade','fadeFinished','setSoundMethod','setButtonMode','commit','requestSound','publish'])check(typeof hooks[k]==='function','missing '+k);
 const draft={...initial};let stage='init',state=0,setup=0,teardown=0,selectedRow=0,result=0,frameDirty=false,cursorDirty=false,displayFrame=initial.frame,displayRow=0,resources=false,busy=false,retired=false,lastCallback=-1,visits=0;
 function current(){return !retired&&hooks.isOwnerCurrent()===true;}
 function invoke(k,...args){check(current(),'stale application owner');const answer=hooks[k](...args);check(current(),'owner changed in '+k);return answer;}
 function snapshot(){return {stage,state,setup,teardown,selectedRow,result,initial:{...initial},draft:{...draft},displayFrame,displayRow,frameDirty,cursorDirty,resources,retired,lastCallback,visits};}
 function cancel(reason='cancelled'){
  if(retired)return false;const restore=current()&&stage!=='done';retired=true;stage='cancelled';resources=false;
  // Recovery is host policy, not a native overlay exit. Never let a retired
  // application write live settings into its replacement owner.
  if(restore){const failures=[];for(const [k,v] of [['setSoundMethod',initial.soundMethod],['setButtonMode',initial.buttonMode]]){if(hooks.isOwnerCurrent()!==true)break;try{hooks[k](v,{recovery:true,reason});}catch(e){failures.push(e);}}if(failures.length)throw failures[0];}return true;
 }
 function tick({callbackId,newKeys=0}={}){
  check(Number.isSafeInteger(callbackId)&&callbackId>=0,'callback identity');check(Number.isInteger(newKeys)&&newKeys>=0&&newKeys<=0xffff,'remapped newKeys');
  if(retired||busy||callbackId<=lastCallback)return false;
  busy=true;try{check(current(),'stale application owner');lastCallback=callbackId;visits++;
   if(stage==='init'){stage='main';return true;}
   if(stage==='exit'){
    if(result===1)invoke('commit',settings(draft));
    else if(result===2){invoke('setSoundMethod',initial.soundMethod);invoke('setButtonMode',initial.buttonMode);}
    else check(false,'overlay exit without result');
    stage='done';resources=false;return true;
   }
   if(stage==='done')return false;
   if(state===0){invoke('setup',setup,settings(draft));if(setup===2){resources=true;invoke('setSoundMethod',draft.soundMethod);invoke('setButtonMode',draft.buttonMode);frameDirty=true;cursorDirty=true;invoke('beginFade',{pattern:3,in:true,color:0,duration:6,framesPer:1});state=1;setup=0;}else setup++;}
   else if(state===1){if(invoke('fadeFinished'))state=2;}
   else if(state===2){
    if(newKeys&KEYS.A&&selectedRow===6){invoke('requestSound',1563);result=1;}
    else if(newKeys&KEYS.B)result=2;
    if(result){invoke('beginFade',{pattern:3,in:false,color:0,duration:6,framesPer:1});state=3;}
    else{
     if(selectedRow<6&&(newKeys&(KEYS.RIGHT|KEYS.LEFT))){const name=NAMES[selectedRow],n=COUNTS[selectedRow];draft[name]=(draft[name]+(newKeys&KEYS.RIGHT?1:n-1))%n;if(selectedRow===3)invoke('setSoundMethod',draft.soundMethod);if(selectedRow===4)invoke('setButtonMode',draft.buttonMode);if(selectedRow===5)frameDirty=true;}
     if(newKeys&KEYS.UP){selectedRow=(selectedRow+6)%7;cursorDirty=true;}else if(newKeys&KEYS.DOWN){selectedRow=(selectedRow+1)%7;cursorDirty=true;}
    }
   }else if(state===3){if(invoke('fadeFinished'))state=4;}
   else if(state===4){invoke('teardown',teardown);if(teardown===1){resources=false;stage='exit';teardown=0;}else teardown++;}
   else check(false,'main state');return true;
  }finally{busy=false;}
 }
 function publish(){if(retired||busy||!resources)return false;busy=true;try{check(current(),'stale publication owner');if(!frameDirty&&!cursorDirty)return false;const update={frame:frameDirty?draft.frame:null,row:cursorDirty?selectedRow:null};invoke('publish',update);if(frameDirty)displayFrame=draft.frame;if(cursorDirty)displayRow=selectedRow;frameDirty=cursorDirty=false;return true;}finally{busy=false;}}
 return Object.freeze({tick,publish,snapshot,cancel,isDone:()=>stage==='done',ownsApplication:()=>!retired&&stage!=='done'});
}
// Effects0/1 use the existing exact scalar recurrence. Pattern3 activates only
// main; the sub brightness register retains the preceding parent pattern0 result.
function createDisplayFade(ScalarFade){check(typeof ScalarFade==='function','source scalar fade');const scalar=new ScalarFade();let pattern=0,top=0,bottom=0,lastCallback=-1;
 function begin(spec){check(spec&&[0,3].includes(spec.pattern)&&typeof spec.in==='boolean'&&spec.color===0&&spec.duration===6&&spec.framesPer===1,'ordinary screen fade');check(scalar.snapshot().finished,'unfinished screen fade');pattern=spec.pattern;const kind=spec.in?1:0;scalar.begin({pattern:0,top:kind,bottom:kind,color:0,duration:6,framesPer:1});top=scalar.snapshot().brightness;if(pattern===0)bottom=top;return snapshot();}
 function pump(callbackId){check(Number.isSafeInteger(callbackId)&&callbackId>=0,'fade callback');if(callbackId<=lastCallback)return false;lastCallback=callbackId;scalar.pump();top=scalar.snapshot().brightness;if(pattern===0)bottom=top;return true;}
 function snapshot(){return {pattern,topBrightness:top,bottomBrightness:bottom,lastCallback,scalar:scalar.snapshot(),finished:scalar.snapshot().finished};}
 return Object.freeze({begin,pump,snapshot});
}
return Object.freeze({NAMES,COUNTS,DEFAULTS,KEYS,settings,textDelay,remap,PhysicalInput,createController,createDisplayFade});
});
