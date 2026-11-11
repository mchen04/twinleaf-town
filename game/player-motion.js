(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.PlayerMotion=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';

/* Independently authored bounded translation of Diamond b623abef ordinary
 * on-foot movement and player graphics selectors 0/3/4/5/9. Source evidence:
 * movement-fade-evidence/{REPORT.md,timing.json,player-gait.json},
 * gait_contract.py and tick_contract.py; preserved assembly functions
 * sub_02056244, sub_020562A8, sub_02057060, sub_0205B124/16C/408/43C,
 * ov05_021F0DB4/0E28/0F0C/0FB4/11E0.
 *
 * request() belongs to field input, before the scene snapshot. tick() belongs
 * to the subsequent main queue and is called once per logic iteration, NOT
 * per render or elapsed second. The first tick initializes and displaces.
 * At a linear step's final tick, the explicit moving graphics callback is
 * followed by the regular idle callback. A turn's final tick has only idle.
 *
 * Host adaptation: x/y stay at the completed cell until step completion;
 * fromX/fromY/toX/toY/progress reserve and display the in-flight step. Source
 * map-object logical coordinates reserve the destination at initialization.
 * Positions still advance exactly 2 or 4 world units per tick (16 per tile).
 * Collision selection is supplied by the host. Blocked requests face their
 * direction but use idle graphics; source collision command 0x1C and its
 * animation are deliberately NOT emulated by this ordinary-gait contract.
 * Terrain exceptions, story/save grants and browser key bindings are outside
 * this module. Running Shoes default false; B is an explicit dispatch input.
 */

const DIRECTIONS=Object.freeze(['up','down','left','right']);
const DELTAS=Object.freeze([[0,-1],[0,1],[-1,0],[1,0]].map(Object.freeze));
const KEYS=Object.freeze({B:0x2,RIGHT:0x10,LEFT:0x20,UP:0x40,DOWN:0x80});
const SELECTORS=Object.freeze({IDLE:0,WALK:3,TURN:5,RUN:9});
// Member394 sample order is numeric pose order, NOT dictionary storage order.
const TEXTURE_DICTIONARY_INDICES=Object.freeze([0,11,22,26,27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19,20,21,23,24,25]);

function directionCode(direction){
 const value=typeof direction==='number'?direction:DIRECTIONS.indexOf(direction);
 if(!Number.isInteger(value)||value<0||value>3)throw new RangeError('Player direction must be one cardinal direction');
 return value;
}
function integer(value,min,max,label){if(!Number.isInteger(value)||value<min||value>max)throw new RangeError('Invalid '+label);return value;}

// Pure held-key selection. Save returned axis choices only after input is
// accepted; a busy command must not overwrite the previous accepted choices.
function selectDirection(mask,{horizontal=-1,vertical=-1,queuedFacing=-1}={}){
 integer(mask,0,0xffff,'held-key mask');
 if(![-1,2,3].includes(horizontal)||![-1,0,1].includes(vertical))throw new RangeError('Invalid previous axis choice');
 integer(queuedFacing,-1,3,'queued facing');
 const h=mask&KEYS.LEFT?2:mask&KEYS.RIGHT?3:-1;
 const v=mask&KEYS.UP?0:mask&KEYS.DOWN?1:-1;
 let direction;
 if(h===-1)direction=v;
 else if(v===-1)direction=h;
 else if(queuedFacing===-1)direction=v;
 else if(h===horizontal&&v===vertical)direction=queuedFacing;
 else if(v!==vertical)direction=v;
 else direction=h;
 return{direction,horizontal:h,vertical:v};
}

function createGait({sequence=0,relativeFrame=0,previousDirection=0,previousSelector=0,pendingRunIdle=false}={}){
 integer(sequence,0,7,'gait sequence');integer(relativeFrame,0,15,'relative frame');
 previousDirection=directionCode(previousDirection);
 if(![0,3,4,5,9].includes(previousSelector))throw new RangeError('Unsupported previous player selector');
 return{sequence,relativeFrame,previousDirection,previousSelector,pendingRunIdle:!!pendingRunIdle};
}
function gaitSnapshot(gait){
 const numberedTexture=gait.sequence*4+Math.floor(gait.relativeFrame/4)+1;
 return{sequence:gait.sequence,relativeFrame:gait.relativeFrame,absoluteFrame:gait.sequence*16+gait.relativeFrame,
  numberedTexture,dictionaryIndex:TEXTURE_DICTIONARY_INDICES[numberedTexture-1],
  previousDirection:gait.previousDirection,previousSelector:gait.previousSelector,pendingRunIdle:gait.pendingRunIdle};
}
function gaitCallback(gait,selector,direction,{eligible=true,allowed=true}={}){
 direction=directionCode(direction);
 if(![0,3,4,5,9].includes(selector))throw new RangeError('Unsupported ordinary player selector');
 // allowed is the outer resource/object callback gate. eligible is the inner
 // animation-advance gate: alignment/direction bookkeeping can still occur.
 if(!allowed)return gaitSnapshot(gait);
 const changed=direction!==gait.previousDirection;
 const align=quantum=>{gait.relativeFrame-=gait.relativeFrame%quantum;};
 const advance=amount=>{const next=gait.relativeFrame+amount;gait.relativeFrame=next>15?0:next;};
 if(selector===SELECTORS.IDLE){
  if(changed){gait.sequence=direction;gait.relativeFrame=0;gait.pendingRunIdle=false;}
  else if(gait.previousSelector===SELECTORS.RUN)gait.pendingRunIdle=true;
  else if(gait.pendingRunIdle){align(8);gait.sequence=direction;gait.pendingRunIdle=false;}
  else align(8);
 }else if(selector===SELECTORS.WALK||selector===4||selector===SELECTORS.TURN){
  if(changed){gait.sequence=direction;gait.relativeFrame=0;}
  else if(gait.previousSelector===SELECTORS.RUN){align(8);gait.sequence=direction;}
  if(eligible)advance(selector===SELECTORS.WALK?1:selector===4?2:4);
 }else{
  if(changed){gait.sequence=direction+4;gait.relativeFrame=0;}
  else if(gait.previousSelector!==SELECTORS.RUN){align(4);gait.sequence=direction+4;}
  if(eligible)advance(1);
 }
 gait.previousDirection=direction;gait.previousSelector=selector;
 return gaitSnapshot(gait);
}

function slowGaitCallback(gait,direction,{eligible=true,allowed=true}={}){
 direction=directionCode(direction);
 if(direction!==2&&direction!==3)throw new RangeError('Only horizontal source staircase gait is admitted');
 integer(gait.sequence,0,7,'stair gait sequence');integer(gait.relativeFrame*2,0,30,'stair half frame');
 if(![0,2,3,5,9].includes(gait.previousSelector))throw new RangeError('Unsupported previous staircase selector');
 if(!allowed)return gaitSnapshot(gait);
 if(direction!==gait.previousDirection){gait.sequence=direction;gait.relativeFrame=0;}
 else if(gait.previousSelector===9){gait.pendingRunIdle=true;gait.previousDirection=direction;gait.previousSelector=2;return gaitSnapshot(gait);}
 else if(gait.pendingRunIdle){gait.relativeFrame-=gait.relativeFrame%8;gait.sequence=direction;gait.pendingRunIdle=false;}
 if(eligible){const next=gait.relativeFrame+.5;gait.relativeFrame=next>15?0:next;}
 gait.previousDirection=direction;gait.previousSelector=2;return gaitSnapshot(gait);
}

function attach(actor,{gait,avatarState=0}={}){
 if(actor.playerMotion)return actor;
 const direction=directionCode(actor.facing);
 integer(avatarState,0,2,'avatar movement state');
 actor.playerMotion={gait:createGait(gait||{sequence:direction,previousDirection:direction}),
  avatarState,command:null,blockedDirection:null,lastCommand:null};
 return actor;
}
function isBusy(actor){return !!attach(actor).playerMotion.command;}
// Reservation visibility precedes main-queue initialization. A queued step is
// not yet displaced or drawn at its target, but autonomous planning must not
// claim that target in the same logical iteration.
function reserves(actor,x,y){
 if(actor.x===x&&actor.y===y)return true;
 if(actor.progress<1&&((actor.fromX===x&&actor.fromY===y)||(actor.toX===x&&actor.toY===y)))return true;
 const command=actor.playerMotion?.command;
 if(command&&!command.initialized&&command.kind!=='turn'){
  const [dx,dy]=DELTAS[command.direction];return actor.x+dx===x&&actor.y+dy===y;
 }
 return false;
}
function commandSnapshot(command){return command?{...command}:null;}
function snapshot(actor){
 const state=attach(actor).playerMotion;
 return{avatarState:state.avatarState,busy:!!state.command,command:commandSnapshot(state.command),
  lastCommand:commandSnapshot(state.lastCommand),gait:gaitSnapshot(state.gait)};
}
function queue(actor,direction,kind,forced=false){
 const state=attach(actor).playerMotion;
 const run=kind==='run',turn=kind==='turn',slow=kind==='slow';
 state.blockedDirection=null;
 state.command={kind,direction,code:(turn?0x28:run?0x58:slow?8:0x0c)+direction,
  selector:turn?5:run?9:slow?2:3,total:turn?3:run?4:slow?16:8,elapsed:0,
  deltaFx32:turn?0:run?0x4000:slow?0x1000:0x2000,initialized:false,forced};
 return{kind,accepted:true,command:commandSnapshot(state.command)};
}
function request(actor,direction,{heldB=false,ownsRunningShoes=false,blocked=false}={}){
 const state=attach(actor).playerMotion;
 if(state.command)return{kind:'busy',accepted:false,command:commandSnapshot(state.command)};
 if(direction==null||direction===-1){state.avatarState=0;state.blockedDirection=null;return{kind:'idle',accepted:true,command:null};}
 direction=directionCode(direction);
 // sub_02056244 chooses the turn BEFORE the collision/run branch.
 if(direction!==directionCode(actor.facing)&&state.avatarState!==1){
  state.avatarState=2;return queue(actor,direction,'turn');
 }
 state.avatarState=1;
 if(blocked){state.blockedDirection=direction;return{kind:'blocked',accepted:true,command:null};}
 return queue(actor,direction,heldB===true&&ownsRunningShoes===true?'run':'walk');
}
function forceWalk(actor,direction){
 const state=attach(actor).playerMotion;
 if(state.command)return{kind:'busy',accepted:false,command:commandSnapshot(state.command)};
 direction=directionCode(direction);
 // A scripted door command is always walk 0x0C+direction, even with held B.
 return queue(actor,direction,'walk',true);
}
function forceSlowWalk(actor,direction){
 direction=directionCode(direction);if(direction!==2&&direction!==3)throw new RangeError('Only horizontal source staircase movement is admitted');
 const state=attach(actor).playerMotion;if(state.command)return{kind:'busy',accepted:false,command:commandSnapshot(state.command)};
 return queue(actor,direction,'slow',true);
}
function tick(actor,{paused=false,callbackAllowed=true,advanceEligible=true}={}){
 const state=attach(actor).playerMotion,callbacks=[];
 const callback=(selector,phase)=>{
  if(callbackAllowed){const gait=selector===2?slowGaitCallback(state.gait,actor.facing,{eligible:advanceEligible}):gaitCallback(state.gait,selector,actor.facing,{eligible:advanceEligible});callbacks.push({selector,phase,gait});}
 };
 const result=(command,complete,kind)=>({kind,command:command?command.code:null,
  elapsed:command?command.elapsed:0,total:command?command.total:0,complete,
  displacementFx32:command?command.elapsed*command.deltaFx32:0,
  callbacks,gait:gaitSnapshot(state.gait)});
 if(paused)return result(state.command,!state.command,'paused');
 const command=state.command;
 if(!command){
  const blocked=state.blockedDirection!==null;
  if(blocked){actor.facing=DIRECTIONS[state.blockedDirection];state.blockedDirection=null;}
  callback(0,'regular');return result(null,true,blocked?'blocked':'idle');
 }
 if(!command.initialized){
  actor.facing=DIRECTIONS[command.direction];
  if(command.kind!=='turn'){
   const[dx,dy]=DELTAS[command.direction];
   actor.fromX=actor.x;actor.fromY=actor.y;actor.toX=actor.x+dx;actor.toY=actor.y+dy;
   actor.progress=0;actor.step=(actor.step||0)+1;
  }
  command.initialized=true;
 }
 command.elapsed++;
 const complete=command.elapsed===command.total;
 if(command.kind!=='turn'){
  actor.progress=command.elapsed/command.total;
  if(complete){actor.x=actor.toX;actor.y=actor.toY;actor.fromX=actor.x;actor.fromY=actor.y;}
  callback(command.selector,complete?'final-movement':'regular');
  if(complete)callback(0,'regular');
 }else callback(complete?0:5,'regular');
 if(complete){state.lastCommand=commandSnapshot(command);state.command=null;}
 return result(command,complete,command.kind);
}
function frame(actor,atlasFrames){
 const gait=attach(actor).playerMotion.gait,numberedTexture=gaitSnapshot(gait).numberedTexture;
 const selected=atlasFrames.find(candidate=>candidate.suffix_number===numberedTexture);
 if(!selected)throw new Error('Player atlas is missing numbered source texture '+numberedTexture);
 return selected;
}

return Object.freeze({DIRECTIONS,DELTAS,KEYS,SELECTORS,TEXTURE_DICTIONARY_INDICES,
 directionCode,selectDirection,createGait,gaitSnapshot,gaitCallback,attach,isBusy,reserves,snapshot,request,forceWalk,slowGaitCallback,forceSlowWalk,tick,frame});
});
