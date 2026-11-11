(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.OriginalMotion=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
// Independently authored interpretation of the pinned Diamond callbacks.
// One tick is one eligible main-queue update, never one requestAnimationFrame.
const DIRECTIONS=['up','down','left','right'];
const DELTAS=[[0,-1],[0,1],[-1,0],[1,0]],WAITS=[16,32,48,64],OPPOSITE=[1,0,3,2];
function directionCode(facing){const n=typeof facing==='number'?facing:DIRECTIONS.indexOf(facing);if(!Number.isInteger(n)||n<0||n>3)throw new Error('Invalid original facing: '+facing);return n;}
function lcg(seed=0){let value=seed>>>0;const random=()=>{value=(Math.imul(value,0x41c64e6d)+0x6073)>>>0;return value>>>16;};random.state=()=>value;return random;}
function attach(actor){
 if(!actor.originalGait)actor.originalGait={previousDirection:directionCode(actor.facing),relativeFrame:0};
 if(actor.originalMotion)return actor;
 if(![0,2,3,12,14,15].includes(actor.movement))throw new Error('Unsupported autonomous original movement type '+actor.movement);
 actor.originalMotion={type:actor.movement,initialX:actor.x,initialY:actor.y,state:0,wait:0,stepTicks:0,stepTotal:0,initialized:false,oneTimeDone:false};
 return actor;
}
function isActive(actor){return actor.active!==false;}
function tileReserved(actor,x,y){
 if(!isActive(actor))return false;
 return actor.x===x&&actor.y===y||actor.progress<1&&((actor.fromX===x&&actor.fromY===y)||(actor.toX===x&&actor.toY===y));
}
function at(actors,header,x,y,excludeId){return actors.find(a=>a.id!==excludeId&&a.header===header&&tileReserved(a,x,y));}
function targetAt(actors,header,x,y){return actors.find(a=>isActive(a)&&a.header===header&&a.x===x&&a.y===y);}
function inBounds(actor,x,y){const m=attach(actor).originalMotion,rx=actor.xRange??0,ry=actor.zRange??0;return(rx===-1||Math.abs(x-m.initialX)<=rx)&&(ry===-1||Math.abs(y-m.initialY)<=ry);}
function face(actor,direction){if(actor.facingSuppressed||((actor.sourceFlags||0)&0x80))return false;actor.facing=DIRECTIONS[directionCode(direction)];return true;}
// Normal-human sequence393: inclusive16-frame ranges, texture samples every4.
// This is a bounded selector0/3/4 adapter, not the player or added helper gait.
function gaitCallback(actor,selector,{callbackAllowed=true,advanceEligible=true}={}){
 const gait=attach(actor).originalGait,direction=directionCode(actor.facing);
 if(![0,3,4].includes(selector))throw new Error('Unsupported original human animation selector '+selector);
 if(!callbackAllowed)return {...gait};
 if(direction!==gait.previousDirection)gait.relativeFrame=0;
 else if(selector===0)gait.relativeFrame=Math.floor(gait.relativeFrame/8)*8;
 if((selector===3||selector===4)&&advanceEligible&&!(actor.sourceFlags&0x100)){const next=gait.relativeFrame+(selector===4?2:1);gait.relativeFrame=next>15?0:next;}
 gait.previousDirection=direction;
 return {...gait};
}
function frame(actor,atlasFrames){
 const gait=attach(actor).originalGait,direction=DIRECTIONS[gait.previousDirection],phase=Math.floor(gait.relativeFrame/4);
 const selected=atlasFrames.find(f=>f.direction===direction&&f.action==='walk'&&f.phase===phase);
 if(!selected)throw new Error('Original human atlas is missing '+direction+' phase '+phase);
 return selected;
}
function graphicsAfterMotion(actor,before){
 const advanced=actor.step!==before.step||(before.progress<1&&actor.progress>before.progress);
 if(advanced){gaitCallback(actor,3);if(actor.progress===1)gaitCallback(actor,0);}
 else gaitCallback(actor,0);
}
// Ordinary dialogue calls this only after target displacement has completed.
// Source FacePlayer dispatches the sprite callback even if facing bit0x80 blocks turning.
function facePlayer(actor,playerFacing){const changed=face(actor,OPPOSITE[directionCode(playerFacing)]);gaitCallback(actor,0);return changed;}
function choose(random16,values){const r=random16();if(!Number.isInteger(r)||r<0||r>65535)throw new Error('random16 must return an unsigned16-bit integer');return values[r%values.length];}
function initialize(actor,random16){const m=attach(actor).originalMotion;if(m.initialized)return;m.initialized=true;if(m.type===2||m.type===12)m.wait=choose(random16,WAITS);}
function beginStep(actor,direction,total=8){
 const m=attach(actor).originalMotion,[dx,dy]=DELTAS[directionCode(direction)];
 actor.fromX=actor.x;actor.fromY=actor.y;actor.toX=actor.x+dx;actor.toY=actor.y+dy;
 // The source reserves logical destination at initialization, before displacement.
 actor.x=actor.toX;actor.y=actor.toY;actor.progress=0;actor.step=(actor.step||0)+1;
 m.stepTicks=0;m.stepTotal=total;m.state=4;
}
function advanceStep(actor){
 const m=attach(actor).originalMotion;if(m.state!==4||actor.progress>=1)return false;
 m.stepTicks++;actor.progress=m.stepTicks/m.stepTotal;
 if(m.stepTicks===m.stepTotal){actor.progress=1;actor.fromX=actor.x;actor.fromY=actor.y;m.state=0;}
 return true;
}
function moveActor(actor,{random16,isBlocked=()=>false,paused=false}={}){
 if(!isActive(actor)||paused)return;
 if(typeof random16!=='function')throw new Error('Original motion requires shared random16');
 initialize(actor,random16);const m=actor.originalMotion;
 if(m.type===0)return;
 if(m.type===14||m.type===15){if(!m.oneTimeDone){face(actor,m.type===14?0:1);m.oneTimeDone=true;}return;}
 if(m.type===2||m.type===12){
  m.wait--;if(m.wait<=0){m.wait=choose(random16,WAITS);face(actor,choose(random16,m.type===12?[0,2,3]:[0,1,2,3]));}return;
 }
 if(m.state===0){m.state=1;return;}
 if(m.state===1){m.wait=choose(random16,WAITS);m.state=2;}
 if(m.state===2){m.wait--;if(m.wait!==0)return;m.state=3;}
 if(m.state===3){
  const direction=choose(random16,[0,1,2,3]),[dx,dy]=DELTAS[direction],x=actor.x+dx,y=actor.y+dy;
  face(actor,direction); // Facing changes even when the attempted step is rejected.
  if(!inBounds(actor,x,y)||isBlocked(x,y,actor)){m.state=0;return;}
  beginStep(actor,direction,8);
 }
 if(m.state===4)advanceStep(actor); // Includes the first displacement on initialization.
}
function tickActor(actor,options={}){
 if(!isActive(actor)||options.paused)return;
 const before={step:actor.step,progress:actor.progress};
 moveActor(actor,options);graphicsAfterMotion(actor,before);
}
function createController({seed=0,random16=lcg(seed)}={}){
 if(typeof random16!=='function')throw new Error('random16 must be a function');
 let dialog=null;
 function initializeCreatedActors(actors){for(const actor of actors)if(isActive(actor))initialize(actor,random16);}
 function dialogReady(){
  if(!dialog)return false;
  if(!dialog.ready&&dialog.target.progress>=1&&dialog.player.progress>=1){dialog.ready=true;if(!dialog.deferFacing){facePlayer(dialog.target,dialog.player.facing);dialog.faced=true;}}
  return dialog.ready;
 }
 function faceDialog(){
  if(!dialogReady())return false;
  if(!dialog.faced){facePlayer(dialog.target,dialog.player.facing);dialog.faced=true;}
  return true;
 }
 // Legacy direct-helper callers retain immediate facing. Production script
 // locks defer it to their later, source-eligible FacePlayer opcode callback.
 function requestDialog(target,player,{deferFacing=false}={}){
  if(!target||!player)throw new Error('Dialogue lock requires target and player');
  if(dialog){if(dialog.target!==target)throw new Error('Another original dialogue is locked');return dialogReady();}
  attach(target);dialog={target,player,ready:false,faced:false,deferFacing};return dialogReady();
 }
 function tick(actors,{header,isBlocked=()=>false,eligible=()=>true,paused=false}={}){
  if(paused)return;
  for(const actor of actors){
   if(!isActive(actor)||(header!=null&&actor.header!==header)||!eligible(actor))continue;
   if(dialog){if(actor===dialog.target&&actor.progress<1){const before={step:actor.step,progress:actor.progress};advanceStep(actor);graphicsAfterMotion(actor,before);}continue;}
   tickActor(actor,{random16,isBlocked:(x,y,a)=>!!at(actors,a.header,x,y,a.id)||isBlocked(x,y,a)});
  }
  dialogReady();
 }
 function releaseDialog(){dialog=null;} // No position/facing/countdown reset.
 return{initializeCreatedActors,tick,requestDialog,dialogReady,faceDialog,releaseDialog,isDialogLocked:()=>dialog!==null,dialogTarget:()=>dialog?.target||null,randomState:()=>typeof random16.state==='function'?random16.state():null};
}
return{DIRECTIONS,DELTAS,WAITS,OPPOSITE,lcg,attach,gaitCallback,frame,isActive,tileReserved,at,targetAt,inBounds,facePlayer,tickActor,createController};
});
