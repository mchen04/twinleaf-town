/* Synchronous host adapter for the verified model67 first-floor warp phases.
 *
 * API: SourceWarp.create({kind:'entry'|'exit', startTile:[x,z],
 *     cameraAngleU16:1473, arrivalDirection:0}).
 * task(signals) returns ordered host events; stepTask is the same function.
 * Signals: openComplete, closeComplete, moveComplete, musicFadeTimerZero,
 *     unloadComplete, loadComplete, restoreComplete. All default to false.
 * Optional destinationTile is captured by the emergence wrapper for diagnostics.
 * Native readiness is explicit: the corresponding operation event is emitted
 * once, then a later task pump must observe its host completion predicate.
 * A synchronous asset-ready app can set that predicate immediately after handling
 * the event. This does not assert original loader/music timing or emulate it.
 *
 * Apply events in order. play_clip means bind resource, play its sound, unpause.
 * The host owns clip ticks and all eight forced-walk displacement updates.
 * Run task, textures/door animation, SCENE SNAPSHOT, actor main queue, pumpFade.
 * Visibility events mutate logical visibility, not the prior cached draw state.
 * pumpFade advances independently and never resumes a task itself. Its snapshots
 * distinguish visible endpoint, window detach and global finished predicates.
 * No timer, render frame or wall-clock second advances any source phase.
 */
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-warp-phases.js'));
  else root.SourceWarp=factory(root.SourceWarpPhases);
})(typeof globalThis!=='undefined'?globalThis:this,function(P){
'use strict';
if(!P||!P.FieldTaskStack||!P.WarpTask)throw Error('SourceWarp requires SourceWarpPhases');

const TO_BLACK=[0,-2,-5,-7,-10,-13,-16];
const FROM_BLACK=[-16,-13,-10,-8,-5,-2,0];

// Bounded translations of effects0/1/9; exact six-step source arithmetic.
class Fade {
  constructor(){this.type='none';this.pumps=0;this.finished=true;this.spec=null;}
  begin(spec){
    if(!spec||spec.duration!==6||spec.framesPer!==1||spec.pattern!==0||spec.color!==0||
      !((spec.top===0&&spec.bottom===0)||(spec.top===1&&spec.bottom===1)||(spec.top===9&&spec.bottom===1)))
      throw Error('Unsupported source fade');
    if(!this.finished)throw Error('Cannot replace an unfinished source fade');
    this.spec={...spec};this.type=spec.top===9?'center_out':spec.top===0?'to_black':'from_black';
    this.pumps=0;this.finished=false;return this.snapshot();
  }
  pump(){
    if(this.type!=='none'&&!this.finished){
      this.pumps++;
      this.finished=this.pumps===(this.type==='center_out'?8:7);
    }
    return this.snapshot();
  }
  snapshot(){
    const j=Math.min(6,this.pumps),windowed=this.type==='center_out';
    const brightness=this.type==='to_black'?TO_BLACK[j]:this.type==='from_black'?FROM_BLACK[j]:0;
    return {type:this.type,pumps:this.pumps,visualStep:j,finished:this.finished,
      brightness,topBrightness:brightness,bottomBrightness:windowed?FROM_BLACK[j]:brightness,
      blackAlpha:-brightness/16,windowBounds:windowed?[96-16*j,96+16*j]:null,
      windowAttached:windowed&&this.pumps<7,visibleComplete:this.type==='none'||this.pumps>=6,
      topFinished:this.finished,bottomFinished:windowed?this.pumps>=7:this.finished,
      stage:this.type==='none'?'idle':this.finished?'finished':windowed&&this.pumps===7?'cleanup_pending':this.pumps===6?'visible_endpoint':'progress'};
  }
}

function create(options){
  options=options||{};
  if(options.kind!=='entry'&&options.kind!=='exit')throw Error('SourceWarp kind must be entry or exit');
  if(!Array.isArray(options.startTile)||options.startTile.length!==2||!options.startTile.every(Number.isSafeInteger))
    throw Error('SourceWarp requires an integer startTile [x,z]');
  const kind=options.kind,startTile=options.startTile.slice(),baseAngle=options.cameraAngleU16===undefined?1473:options.cameraAngleU16;
  if(!Number.isInteger(baseAngle)||baseAngle<0||baseAngle>65535)throw Error('Bad cameraAngleU16');
  const direction=options.arrivalDirection===undefined?0:options.arrivalDirection;
  if(![0,1,2,3].includes(direction))throw Error('Bad arrivalDirection');
  const fade=new Fade(),stack=new P.FieldTaskStack();
  const camera={angle:baseAngle,count:0,helperCalls:0,holdFollow:false,savedAngle:null,restored:false,active:false};
  const rootPhase=new P.WarpTask(kind==='entry'?1:0);
  let signals={},events=[],done=false,taskPumps=0,lastInvoked=[],activeDoor=null;

  // sub_0204C6D4 states0/1/2 are intentionally separate callbacks. DoorPhase
  // is an inline routine, not a task child; its fade child blocks this wrapper.
  function emergence(){
    const door=new P.DoorPhase('emergence');activeDoor=door;
    return {state:0,done:false,step(s){
      if(this.state===0){this.state=1;return [{type:'hide_player'}];}
      if(this.state===1){this.state=2;return [{type:'capture_emergence_tile',tile:Array.isArray(s.destinationTile)?s.destinationTile.slice():null}];}
      const e=door.step(s);
      if(door.done){e.pop();e.push({type:'free_door_state'},{type:'show_player'},{type:'complete'});this.done=true;}
      return e;
    }};
  }

  // Non-door branch of sub_0204C7A0: create RoomArrival child, then return
  // after that child actually completes. Do not inline its first callback.
  function roomSelector(){
    return {state:0,done:false,step(){
      if(this.state===0){this.state=1;return [{type:'push_child',name:'room_arrival'}];}
      this.done=true;return [{type:'complete'}];
    }};
  }

  function phaseFor(name,detail){
    switch(name){
      case 'entry_departure': {const phase=new P.EntryDeparture(startTile);activeDoor=phase.door;return phase;}
      case 'room_departure':return new P.RoomDeparture();
      case 'field_fade':return new P.FieldFadeChild(detail.fade);
      case 'wait_plain_fade':return {done:false,step(s){this.done=!!s.fadeFinished;return this.done?[{type:'complete'}]:[];}};
      case 'arrival_select_door_or_generic':return emergence();
      case 'arrival_select_door_or_room':return roomSelector();
      case 'room_arrival':return new P.RoomArrival(direction);
      default:throw Error('Unsupported warp child '+name);
    }
  }

  function accept(e,frame){
    if(e.type==='complete')return;
    // The camera helper's own guarded count is not its callback count.
    if(e.type==='clear_fixed_camera_target'){camera.holdFollow=true;camera.active=true;}
    if(e.type==='save_camera_angle'){
      camera.savedAngle=camera.angle;camera.count=0;camera.helperCalls=0;camera.active=true;
      camera.restored=true;
    }
    if(e.type==='adjust_camera_angle'){
      camera.angle=(camera.angle+e.delta)&0xffff;camera.active=true;
      camera.restored=camera.angle===camera.savedAngle;
    }
    if(e.type==='camera_helper_call'){
      const next=P.stepDoorCamera(e.symbol==='ov05_021DA9E8'?'entry':'emergence',camera);
      camera.count=next.count;camera.angle=next.angle;camera.helperCalls++;camera.active=true;
      camera.restored=camera.savedAngle!==null&&camera.angle===camera.savedAngle;
      e={...e,angle:camera.angle,count:camera.count,adjusted:next.adjusted};
    }
    if(e.type==='begin_fade')fade.begin(e.fade);
    events.push({...e,phase:frame.name});
    if(e.type==='push_child')push(e.name,e,frame);
  }

  function completeFrame(frame){
    if(frame.parent)frame.parent.childReturned=true;
    else done=true;
    events.push({type:frame.parent?'phase_complete':'complete',name:frame.name,phase:frame.name});
    return true;
  }

  function push(name,detail,parent,phase){
    const frame={name,parent,childReturned:false,started:false};
    const readyKey={unload_overworld:'unloadComplete',change_location_and_load:'loadComplete',restore_overworld:'restoreComplete'}[name];
    if(!readyKey)frame.phase=phase||phaseFor(name,detail||{});
    stack.push(name,()=>{
      if(readyKey){
        if(!frame.started){
          frame.started=true;
          if(name==='change_location_and_load'){
            camera.active=false;camera.holdFollow=false;camera.angle=baseAngle;camera.count=0;
            camera.helperCalls=0;camera.savedAngle=null;camera.restored=false;activeDoor=null;
          }
          events.push({type:name,kind,phase:name});return false;
        }
        return signals[readyKey]===true?completeFrame(frame):false;
      }
      const input={...signals,childReturned:frame.childReturned,fadeFinished:fade.finished,
        cameraRestored:camera.savedAngle!==null&&camera.angle===camera.savedAngle};
      frame.childReturned=false;
      const emitted=frame.phase.step(input);
      for(const e of emitted)accept(e,frame);
      return frame.phase.done?completeFrame(frame):false;
    });
    // Diagnostic reference only, never used to alter the source stack runner.
    stack.top.frame=frame;
  }

  push('warp',{},null,rootPhase);
  function task(nextSignals){
    if(done)return [];
    signals=nextSignals||{};events=[];taskPumps++;
    lastInvoked=stack.pump();
    return events.slice();
  }
  function snapshot(){
    const frames=[];
    for(let current=stack.top;current;current=current.prev)frames.push({name:current.name,state:current.frame.phase?current.frame.phase.state:null});
    return {kind,done,taskPumps,startTile:startTile.slice(),stack:frames,lastInvoked:lastInvoked.slice(),
      rootState:rootPhase.state,door:activeDoor?{kind:activeDoor.kind,state:activeDoor.state,done:activeDoor.done,blockedChild:activeDoor.blockedChild}:null,
      fade:fade.snapshot(),camera:{...camera},
      cameraOverride:camera.active?{perspectiveAngleU16:camera.angle,holdFollow:camera.holdFollow}:null};
  }
  return {task,stepTask:task,pumpFade:()=>fade.pump(),snapshot,get done(){return done;}};
}

return {create,Fade,ordinaryIteration:P.ordinaryIteration};
});
