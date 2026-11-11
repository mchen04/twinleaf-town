/* Locally authored source-state helper; unchanged source module and provenance in assets/animations/door-phases. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SourceWarpPhases=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
// Locally authored source-state translation, model67 first-floor doors only.
// A call is one allowed parent callback, NOT a frame/RAF/elapsed second.
// Run clip/movement/fade pumps independently. Supply completion predicates.
// childReturned means the actual field-task child has returned, not merely that
// its visible fade endpoint was reached. A blocked parent emits nothing.

const CONSTANTS = Object.freeze({
  walkUpdates:8, walkDeltaFx32:8192, normalVblanksPerLogicUpdate:2,
  plainFade:{top:0,bottom:0,duration:6,framesPer:1,visiblePumps:6,finishedPumps:7},
  emergenceFade:{top:9,bottom:1,duration:6,framesPer:1,visiblePumps:6,finishedPumps:8},
  arrivalFade:{top:1,bottom:1,duration:6,framesPer:1,visiblePumps:6,finishedPumps:7},
  clips:{7:{frames:8,advancingUpdates:7},8:{frames:8,advancingUpdates:7},
         9:{frames:6,advancingUpdates:5},10:{frames:6,advancingUpdates:5}},
});
const event=(type,detail={})=>({type,...detail});
const move=direction=>event('force_walk',{direction,command:12+direction,updates:8,deltaFx32:8192});
const fade=(spec)=>({...spec,pattern:0,color:0});

class BasePhase {
  constructor(){this.state=0;this.blockedChild=null;this.done=false;}
  enter(signals){
    if(this.done)return false;
    if(this.blockedChild){
      if(!signals.childReturned)return false;
      this.blockedChild=null;
    }
    return true;
  }
  child(name,events,detail={}){this.blockedChild=name;events.push(event('push_child',{name,...detail}));}
  finish(events){this.done=true;events.push(event('complete'));return events;}
}

// Direct ov05_021DA5D8 / ov05_021DA7B4 state machines. Emergence wrapper
// must already have hidden the player at the exact destination warp tile.
class DoorPhase extends BasePhase {
  constructor(kind){
    super();if(!['entry','emergence'].includes(kind))throw Error('Unknown door kind');
    this.kind=kind;this.cameraActive=false;this.cameraCallbackCount=0;
  }
  step(s={}){
    if(!this.enter(s))return [];
    const e=[];
    if(this.kind==='entry'){
      switch(this.state){
        case 0:e.push(event('prepare_door',{model:67}));this.state=1;break;
        case 1:
          e.push(event('clear_fixed_camera_target'));this.cameraActive=true;
          e.push(event('play_clip',{member:7,slot:0,sound:1541}));this.state=2;break;
        case 2:if(s.openComplete)this.state=3;break;
        case 3:e.push(move(0));this.state=4;break;
        case 4:
          if(s.moveComplete){
            e.push(event('clear_held_movement'),event('hide_player'),event('play_clip',{member:8,slot:1,sound:1543}));
            this.state=5;
          }break;
        case 5:if(s.closeComplete){e.push(event('release_door'));return this.finish(e);}break;
      }
    }else{
      switch(this.state){
        case 0:
          e.push(event('prepare_door',{model:67}),event('save_camera_angle'),event('adjust_camera_angle',{delta:-96}));
          this.state=1;break;
        case 1:
          this.child('field_fade',e,{fade:fade(CONSTANTS.emergenceFade)});
          this.cameraActive=true;
          e.push(event('play_clip',{member:9,slot:2,sound:1541}));this.state=2;break;
        case 2:if(s.openComplete){e.push(event('show_player'));this.state=3;}break;
        case 3:e.push(move(1));this.state=4;break;
        case 4:
          if(s.moveComplete){e.push(event('clear_held_movement'),event('play_clip',{member:10,slot:3,sound:1543}));this.state=5;}
          break;
        case 5:
          if(s.closeComplete&&s.fadeFinished&&s.cameraRestored){e.push(event('release_door'));return this.finish(e);}break;
      }
    }
    if(this.cameraActive){
      // This is a CALL to the source helper, not a guaranteed angle change.
      // Source helper's own count/zero-angle guards still apply.
      this.cameraCallbackCount++;
      e.push(event('camera_helper_call',{symbol:this.kind==='entry'?'ov05_021DA9E8':'ov05_021DAA2C',
        call:this.cameraCallbackCount,nominalDelta:this.kind==='entry'?-12:16,
        maximumAdjustingCalls:this.kind==='entry'?9:6}));
    }
    return e;
  }
}

// sub_0204C1B4 pushes this child; setup is deferred until its own state0.
class FieldFadeChild extends BasePhase {
  constructor(spec){super();this.spec=spec;}
  step(s={}){
    if(!this.enter(s))return [];
    if(this.state===0){this.state=1;return [event('before_fade_hook'),event('begin_fade',{fade:fade(this.spec)})];}
    if(s.fadeFinished)return this.finish([event('after_fade_hook')]);
    return [];
  }
}

// sub_0204C4A4: outer entry departure. Starting tile is south approach,
// captured before forced north movement. Fade begins only after door cleanup.
class EntryDeparture extends BasePhase {
  constructor(startTile){super();this.startTile=[...startTile];this.door=new DoorPhase('entry');}
  step(s={}){
    if(!this.enter(s))return [];
    const e=[];
    switch(this.state){
      case 0:e.push(event('capture_entry_tile',{tile:this.startTile}));this.state=1;break;
      case 1:e.push(...this.door.step(s));if(this.door.done){this.state=2;e.pop();e.push(event('free_door_state'));}break;
      case 2:
        e.push(event('begin_fade',{fade:fade(CONSTANTS.plainFade)}));
        this.child('wait_plain_fade',e);this.state=3;break;
      case 3:return this.finish(e);
    }return e;
  }
}

// sub_0204C468: current indoor exit mat, facing/held south. No forced step.
class RoomDeparture extends BasePhase {
  step(s={}){
    if(!this.enter(s))return [];
    if(this.state===0){
      this.state=1;const e=[event('play_sound',{sound:1539}),event('begin_fade',{fade:fade(CONSTANTS.plainFade)})];
      this.child('wait_plain_fade',e);return e;
    }return this.finish([]);
  }
}

// ov05_021DB380 non-door arrival. North/East/West stay at warp coordinates;
// south hides during fade child, then reveals and takes one south walk step.
class RoomArrival extends BasePhase {
  constructor(direction){super();if(![0,1,2,3].includes(direction))throw Error('Bad direction');this.direction=direction;}
  step(s={}){
    if(!this.enter(s))return [];
    const e=[];
    switch(this.state){
      case 0:
        e.push(event(this.direction===1?'hide_player':'show_player'));
        this.state=this.direction===1?1:3;
        this.child('field_fade',e,{fade:fade(CONSTANTS.arrivalFade)});break;
      case 1:e.push(event('show_player'),move(1));this.state=2;break;
      case 2:if(s.moveComplete){e.push(event('clear_held_movement'));this.state=3;}break;
      case 3:if(s.fadeFinished)return this.finish(e);break;
    }return e;
  }
}

// sub_0204C380 high-level task. All load/restore durations are caller predicates.
class WarpTask extends BasePhase {
  constructor(mode){super();if(![0,1].includes(mode))throw Error('Only normal door modes0/1');this.mode=mode;}
  step(s={}){
    if(!this.enter(s))return [];
    const e=[];
    switch(this.state){
      case 0:e.push(event('prepare_destination_music'));this.child(this.mode===1?'entry_departure':'room_departure',e);this.state=1;break;
      case 1:this.child('unload_overworld',e);this.state=2;break;
      case 2:this.child('change_location_and_load',e);this.state=3;break;
      case 3:this.child('restore_overworld',e);this.state=4;break;
      case 4:this.state=5;break; // post-load table entries0/1 are NULL
      case 5:
        if(s.musicFadeTimerZero){
          e.push(event('destination_music_and_field_hook'));
          this.child(this.mode===0?'arrival_select_door_or_generic':'arrival_select_door_or_room',e);this.state=6;
        }break;
      case 6:return this.finish(e);
    }return e;
  }
}

const fieldInputDirection=(facing,held)=>(held&[0x40,0x80,0x20,0x10][facing])?facing:-1;
const roomExitEligible=({behavior,facing,held,hasWarp,inputEligible=true})=>
  inputEligible&&hasWarp&&behavior===0x65&&fieldInputDirection(facing,held)===1;
const doorCoordinates=(outdoorWarp,indoorWarp)=>({
  entryStart:[outdoorWarp[0],outdoorWarp[1]+1],entryAfterForcedWalk:[...outdoorWarp],
  normalIndoorArrival:[...indoorWarp],indoorExitTrigger:[...indoorWarp],
  outdoorArrivalHidden:[...outdoorWarp],outdoorArrivalAfterForcedWalk:[outdoorWarp[0],outdoorWarp[1]+1],
});

// ov05_021DA9E8 uses strict >96; counts0..8 can subtract12 (nine calls).
// ov05_021DAA2C uses >=96; counts0..5 can add16 (six calls).
// Both increment count even when a wrapped zero result suppresses the change.
function stepDoorCamera(kind,{count,angle}){
  if(!['entry','emergence'].includes(kind))throw Error('Unknown door kind');
  const stop=kind==='entry'?count*12>96:count*16>=96;
  if(stop)return {count,angle,adjusted:false};
  const delta=kind==='entry'?-12:16;
  const candidate=(angle+delta)&0xffff;
  return {count:(count+1)&0xff,angle:candidate===0?angle:candidate,adjusted:candidate!==0};
}

// Relevant ordered stages within one ordinary logic iteration. Omitted OS
// waits, unrelated effects/queues and hardware execution retain their own timing.
// sceneDraw must capture state at this point, not reread post-mainQueue state.
function ordinaryIteration(hooks){
  const order=['fieldInput','fieldTasks','waterAnimation','doorAnimation',
    'sceneDraw','mainQueue','swapBufferRequest','paletteFade','graphicsTransfer'];
  for(const name of order)hooks[name]?.();
  return order;
}

// Minimal TaskManager_Call + top-task runner semantics for ordering tests/hosts.
// A pushed child starts on the next pump when its creating callback returnsfalse.
// A completed child pops and the parent can resume in the SAME pump.
class FieldTaskStack {
  constructor(){this.top=null;}
  push(name,callback){this.top={name,callback,prev:this.top};}
  pump(){
    const invoked=[];
    while(this.top){
      const running=this.top;invoked.push(running.name);
      const done=running.callback(this);
      if(done!==true)break;
      if(this.top!==running)throw Error('Unsupported push-and-return-true callback');
      this.top=running.prev;
    }
    return invoked;
  }
}

return {CONSTANTS,DoorPhase,FieldFadeChild,EntryDeparture,RoomDeparture,RoomArrival,WarpTask,fieldInputDirection,roomExitEligible,doorCoordinates,stepDoorCamera,ordinaryIteration,FieldTaskStack};
});
