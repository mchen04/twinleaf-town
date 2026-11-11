(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-staircase-data.js'),require('./source-warp-phases.js'),require('./source-warp.js'),require('./source-native-bytes.js'));else root.SourceStaircase=factory(root.SourceStaircaseData,root.SourceWarpPhases,root.SourceWarp,root.SourceNativeBytes);})(typeof globalThis!=='undefined'?globalThis:this,function(Data,P,Warp,Bytes){
'use strict';
function check(ok,message){if(!ok)throw Error('Source staircase unsupported: '+message);}
check(Array.isArray(Data)&&Data.length===4&&P&&P.FieldTaskStack&&Warp&&Warp.Fade&&Bytes&&Bytes.sha256,'finite data and phase dependencies');
function freeze(value){if(value&&typeof value==='object'){for(const v of Object.values(value))freeze(v);Object.freeze(value);}return value;}
function capture(value){if(value===null)return null;if(typeof value!=='object'){check(typeof value==='string'||typeof value==='boolean'||typeof value==='number'&&Number.isFinite(value),'metadata scalar');return value;}const array=Array.isArray(value),out=array?[]:Object.create(null);if(array)check(Reflect.ownKeys(value).every(k=>k==='length'||typeof k==='string'&&/^(0|[1-9][0-9]*)$/.test(k)&&Number(k)<value.length),'array metadata fields');for(const k of Reflect.ownKeys(value)){check(typeof k==='string','symbol metadata');if(Array.isArray(value)&&k==='length')continue;const d=Object.getOwnPropertyDescriptor(value,k);check(d&&Object.hasOwn(d,'value')&&d.enumerable,'metadata accessor or hidden field');out[k]=capture(d.value);}return out;}
const metadata=capture(Data),serialized=JSON.stringify(metadata),bytes=new Uint8Array(serialized.length);for(let i=0;i<bytes.length;i++){check(serialized.charCodeAt(i)<128,'metadata encoding');bytes[i]=serialized.charCodeAt(i);}check(Bytes.sha256(bytes)==='cdff14bf581e43266289ef09412a4bcda3ec59ed86a38ba75e5fa7c217f30f57','finite source metadata identity');
const cases=freeze(metadata),keys=['header','warpIndex','tile','behavior','facing','heldMask','frontPermission','targetHeader','targetWarp','inputEligible'];
function vector(value,length){check(Array.isArray(value),'array vector');const keys=Reflect.ownKeys(value);check(keys.length===length+1&&keys.every(k=>k==='length'||typeof k==='string'&&/^(0|[1-9][0-9]*)$/.test(k)&&Number(k)<length),'vector fields');const ld=Object.getOwnPropertyDescriptor(value,'length');check(ld&&Object.hasOwn(ld,'value')&&ld.value===length,'vector length');return Array.from({length},(_,i)=>{const d=Object.getOwnPropertyDescriptor(value,String(i));check(d&&Object.hasOwn(d,'value')&&d.enumerable,'vector accessor');return d.value;});}
function fields(value,names){check(value&&typeof value==='object'&&!Array.isArray(value),'explicit record');const actual=Reflect.ownKeys(value);check(actual.length===names.length&&actual.every(k=>names.includes(k)),'exact fields');const out={};for(const k of names){const d=Object.getOwnPropertyDescriptor(value,k);check(d&&Object.hasOwn(d,'value')&&d.enumerable,'accessor or hidden field');out[k]=d.value;}return out;}
function admit(value){
 const s=fields(value,keys);s.tile=vector(s.tile,2);for(const k of ['header','warpIndex','behavior','facing','heldMask','frontPermission','targetHeader','targetWarp'])check(Number.isInteger(s[k])&&s[k]>=0&&s[k]<=65535,k);
 check(Array.isArray(s.tile)&&s.tile.length===2&&s.tile.every(x=>Number.isInteger(x)&&x>=0&&x<32),'tile');check(s.inputEligible===true,'ordinary input eligibility');
 const c=cases.find(c=>c.header===s.header&&c.warp_index===s.warpIndex&&c.tile[0]===s.tile[0]&&c.tile[1]===s.tile[1]&&c.behavior===s.behavior&&c.facing===s.facing&&(s.heldMask&c.held_mask)!==0&&c.front_permission===s.frontPermission&&c.target_header===s.targetHeader&&c.target_warp===s.targetWarp);
 check(c,'finite current-tile facing held-key permission and warp binding');return c;
}
const event=(type,detail={})=>({type,...detail});
const move=direction=>event('force_slow_walk',{direction,command:8+direction,updates:16,deltaFx32:4096,selector:2});
const fade=top=>({pattern:0,top,bottom:top,color:0,duration:6,framesPer:1,heap:4});
class Departure{
 constructor(direction){check(direction===2||direction===3,'departure direction');this.direction=direction;this.state=0;this.done=false;}
 step(s){if(this.done)return[];if(this.state===0){this.state=1;return[move(this.direction)];}if(this.state===1){if(s.moveComplete){this.state=2;return[event('clear_held_movement')];}return[];}if(this.state===2){this.state=3;return[event('play_sound',{sound:1539}),event('begin_fade',{fade:fade(0)})];}if(s.fadeFinished){this.done=true;return[event('complete')];}return[];}
}
class Arrival{
 constructor(direction){check(direction===2||direction===3,'arrival direction');this.direction=direction;this.state=0;this.done=false;}
 step(s){if(this.done)return[];if(this.state===0){this.state=1;return[event('begin_fade',{fade:fade(1)}),move(this.direction)];}if(this.state===1){if(s.moveComplete){this.state=2;return[event('clear_held_movement')];}return[];}if(this.state===2){if(s.fadeFinished)this.state=3;return[];}this.done=true;return[event('complete')];}
}
class Root{
 constructor(c){this.c=c;this.state=0;this.done=false;this.blocked=null;}
 child(name,e){this.blocked=name;e.push(event('push_child',{name}));return e;}
 step(s){if(this.done)return[];if(this.blocked){if(!s.childReturned)return[];this.blocked=null;}const e=[];if(this.state===0){this.state=1;return this.child('stairs_departure',[event('prepare_destination_music')]);}if(this.state<=3){const name=['','unload_overworld','change_location_and_load','restore_overworld'][this.state++];return this.child(name,e);}if(this.state===4){this.state=5;return[event('postload_stair',{caseId:this.c.id,header:this.c.target_header,warp:this.c.target_warp,tile:this.c.postload_tile.slice(),deltaFx32:this.c.postload_offset_fx32.slice(),direction:this.c.arrival_facing,operations:['shift_player_x','query_height','set_player_vector_and_direction','camera_look_at_target_recalc','camera_fixed_target_follow_xyz']})];}if(this.state===5){if(!s.musicFadeTimerZero)return[];this.state=6;return this.child('stairs_arrival',[event('destination_music_and_field_hook')]);}this.done=true;return[event('free_warp_environment'),event('complete')];}
}
function create(input){
 const c=admit(input),fader=new Warp.Fade(),stack=new P.FieldTaskStack(),root=new Root(c);let done=false,events=[],signals={},lastInvoked=[],taskPumps=0;
 function push(name,parent,phase){const frame={name,parent,phase,childReturned:false,started:false},ready={unload_overworld:'unloadComplete',change_location_and_load:'loadComplete',restore_overworld:'restoreComplete'}[name];if(!ready&&!phase)frame.phase=name==='stairs_departure'?new Departure(c.facing):name==='stairs_arrival'?new Arrival(c.arrival_facing):null;check(ready||frame.phase,'phase '+name);
  stack.push(name,()=>{if(ready){if(!frame.started){frame.started=true;events.push(event(name,{kind:'stairs',phase:name}));return false;}if(signals[ready]!==true)return false;}else{const emitted=frame.phase.step({...signals,childReturned:frame.childReturned,fadeFinished:fader.finished});frame.childReturned=false;for(const e of emitted){if(e.type==='begin_fade')fader.begin(e.fade);if(e.type!=='complete')events.push({...e,phase:name});if(e.type==='push_child')push(e.name,frame);}if(!frame.phase.done)return false;}
   if(parent)parent.childReturned=true;else done=true;events.push(event(parent?'phase_complete':'complete',{name,phase:name}));return true;});stack.top.frame=frame;
 }
 push('warp',null,root);
 function task(value={}){check(value&&typeof value==='object'&&!Array.isArray(value),'signals');const names=['moveComplete','unloadComplete','loadComplete','restoreComplete','musicFadeTimerZero'];for(const k of Reflect.ownKeys(value)){check(names.includes(k),'signal '+String(k));const d=Object.getOwnPropertyDescriptor(value,k);check(d&&Object.hasOwn(d,'value')&&typeof d.value==='boolean','signal value');}if(done)return[];signals={...value};events=[];taskPumps++;lastInvoked=stack.pump();return events.slice();}
 function snapshot(){const frames=[];for(let current=stack.top;current;current=current.prev)frames.push({name:current.name,state:current.frame.phase?current.frame.phase.state:null});return{kind:'stairs',mode:3,caseId:c.id,done,taskPumps,rootState:root.state,stack:frames,lastInvoked:lastInvoked.slice(),fade:fader.snapshot(),cameraOverride:null};}
 return{task,stepTask:task,pumpFade:()=>fader.pump(),snapshot,get done(){return done;},case:c};
}
return Object.freeze({admit,create,cases});
});
