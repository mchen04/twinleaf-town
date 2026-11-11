(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./player-motion.js'));else root.PlayerCollision=factory(root.PlayerMotion);})(typeof globalThis!=='undefined'?globalThis:this,function(Base){
'use strict';
// Own bounded source translation. The unchanged ordinary gait module remains
// independently oracle-tested. Commands 1C..1F use selector2 and no translation.
// Source excerpts and the independent FX12 oracle accompany collision-provenance.
if(!Base||typeof Base.request!=='function')throw new Error('PlayerCollision needs PlayerMotion');
const hasCollision=actor=>actor.playerMotion?.command?.kind==='collision';
const hasStationaryCommand=actor=>['collision','face'].includes(actor.playerMotion?.command?.kind);
const inputReady=actor=>!Base.isBusy(actor)||hasCollision(actor);
function collisionGait(gait,direction,{eligible=true,allowed=true}={}){
 direction=Base.directionCode(direction);
 if(!allowed)return Base.gaitSnapshot(gait);
 const changed=direction!==gait.previousDirection;
 if(changed){gait.sequence=direction;gait.relativeFrame=0;}
 else if(gait.previousSelector===9){gait.pendingRunIdle=true;gait.previousDirection=direction;gait.previousSelector=2;return Base.gaitSnapshot(gait);}
 else if(gait.pendingRunIdle){gait.relativeFrame-=gait.relativeFrame%8;gait.sequence=direction;gait.pendingRunIdle=false;}
 // Half units are exactly representable. Original animator range ends at15,
 // so15 + .5 wraps to0 rather than retaining15.5 or applying modulo16.
 if(eligible){const next=gait.relativeFrame+.5;gait.relativeFrame=gait.relativeFrame<0||gait.relativeFrame>15||next>15?0:next;}
 gait.previousDirection=direction;gait.previousSelector=2;
 return Base.gaitSnapshot(gait);
}
function request(actor,direction,options={}){
 const state=Base.attach(actor).playerMotion;
 if(hasCollision(actor)){
  // sub_020558A0: unfinished collision is replaceable only by a real direction
  // whose ordinary collision result is zero. Neutral/blocked input keeps time.
  if(direction==null||direction===-1||options.blocked)return{kind:'busy',accepted:false,command:{...state.command}};
  state.lastCommand={...state.command,interrupted:true};state.command=null;
 }
 const result=Base.request(actor,direction,options);
 if(result.kind==='idle'){queueFace(actor);return{kind:'idle',accepted:true,command:{...state.command}};}
 if(result.kind!=='blocked')return result;
 const d=Base.directionCode(direction);state.blockedDirection=null;
 state.command={kind:'collision',direction:d,code:0x1c+d,selector:2,total:17,elapsed:0,deltaFx32:0,initialized:false,forced:false};
 return{kind:'blocked',accepted:true,command:{...state.command}};
}
function tick(actor,options={}){
 if(!hasStationaryCommand(actor))return Base.tick(actor,options);
 const state=actor.playerMotion,command=state.command,callbacks=[];
 if(options.paused)return{kind:'paused',command:command.code,elapsed:command.elapsed,total:command.total,complete:false,displacementFx32:0,callbacks,gait:Base.gaitSnapshot(state.gait)};
 if(!command.initialized){actor.facing=Base.DIRECTIONS[command.direction];actor.fromX=actor.x;actor.fromY=actor.y;actor.toX=actor.x;actor.toY=actor.y;actor.progress=1;if(command.kind==='face')actor.step=(actor.step||0)+1;command.initialized=true;}
 command.elapsed++;
 const complete=command.elapsed===command.total,selector=complete?0:2;
 if(options.callbackAllowed!==false){const gait=complete?Base.gaitCallback(state.gait,0,actor.facing,{eligible:options.advanceEligible!==false}):collisionGait(state.gait,actor.facing,{eligible:options.advanceEligible!==false});callbacks.push({selector,phase:'regular',gait});}
 if(complete){state.lastCommand={...command};state.command=null;}
 return{kind:command.kind,command:command.code,elapsed:command.elapsed,total:command.total,complete,displacementFx32:0,callbacks,gait:Base.gaitSnapshot(state.gait)};
}
function reserves(actor,x,y){return hasStationaryCommand(actor)?actor.x===x&&actor.y===y:Base.reserves(actor,x,y);}
function forceWalk(actor,direction){if(hasCollision(actor)){const s=actor.playerMotion;s.lastCommand={...s.command,interrupted:true};s.command=null;}return Base.forceWalk(actor,direction);}
function forceSlowWalk(actor,direction){direction=Base.directionCode(direction);if(direction!==2&&direction!==3)throw new RangeError('Only horizontal source staircase movement is admitted');if(hasCollision(actor)){const s=actor.playerMotion;s.lastCommand={...s.command,interrupted:true};s.command=null;}return Base.forceSlowWalk(actor,direction);}
function queueFace(actor){
 const state=Base.attach(actor).playerMotion,d=Base.directionCode(actor.facing);
 if(state.command)state.lastCommand={...state.command,interrupted:true};
 state.avatarState=0;state.blockedDirection=null;
 // sub_02055B8C replaces held collision with direction base0. Its initializer
 // and terminal run in one main-queue invocation; only the regular idle gait.
 state.command={kind:'face',direction:d,code:d,selector:0,total:1,elapsed:0,deltaFx32:0,initialized:false,forced:true};
}
function objectTalk(actor){
 if(!inputReady(actor))return false;
 queueFace(actor);
 return true;
}
function resetForFieldTask(actor){
 if(!objectTalk(actor))return false;
 // Source current XYZ is copied to previous XYZ before the task is created.
 // The queued face initializer/regular idle gait still runs on the main queue.
 actor.fromX=actor.toX=actor.x;actor.fromY=actor.toY=actor.y;actor.progress=1;
 return true;
}
return Object.freeze({...Base,resetForFieldTask,hasCollision,hasStationaryCommand,inputReady,collisionGait,request,tick,reserves,forceWalk,forceSlowWalk,objectTalk});
});
