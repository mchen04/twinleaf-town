(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-board-data.js'),require('./source-board-consumer.js'),require('./source-board-controller.js'),require('./source-board-field-sequence.js'),require('./source-board-input.js'));else root.SourceBoardEntry=factory(root.SourceBoardData,root.SourceBoardConsumer,root.SourceBoardController,root.SourceBoardFieldSequence,root.SourceBoardInput);})(typeof globalThis!=='undefined'?globalThis:this,function(Data,Consumer,Controllers,Sequence,Input){
'use strict';
function fail(message){throw Error('SourceBoardEntry: '+message);}
const reasons=Object.freeze(['completion_pulse','held_direction','fresh_a']);
/** Exact bounded sub_02055A38 recurrence. avatarState10 and status14 are
 * DIFFERENT source fields. Call only at an eligible normal field-input scan.
 * Movement flags and specialMode are supplied explicitly, not inferred from UI.
 */
function refresh({previousStatus14,avatarState10,active,singleMovement,heldMovement,finished,commandCode,specialMode}){
 if(![0,1,2,3].includes(previousStatus14)||![0,1,2].includes(avatarState10))fail('separate bounded avatar fields required');
 for(const v of[active,singleMovement,heldMovement,finished])if(typeof v!=='boolean')fail('explicit movement flags required');
 if(!Number.isInteger(commandCode)||commandCode<0||commandCode>255||!Number.isInteger(specialMode)||specialMode<0||specialMode>5)fail('bounded source command and special mode required');
 if(specialMode!==0&&specialMode!==5)return 2;
 const ready=active&&!singleMovement&&(!heldMovement||finished);
 if(!ready){
  if(avatarState10===1){if(commandCode>=0x1c&&commandCode<=0x1f)return 0;return previousStatus14===0||previousStatus14===3?1:2;}
  return avatarState10===2?2:0;
 }
 if(!heldMovement||finished)return avatarState10===1||avatarState10===2?(previousStatus14===0||previousStatus14===3?0:3):0;
 return 0;
}
/** Adapter for the already-supported ordinary PM command lifecycle only.
 * No single movements, cycling/surfing/terrain modes, forced door/stair walks,
 * inactive player objects, or unreconstructed flags are silently admitted.
 */
function fromMotion(previousStatus14,motion){
 if(!motion||![0,1,2].includes(motion.avatarState))fail('ordinary PM avatarState10 required');
 const c=motion.command;
 if(c){const kinds={walk:[0x0c,8],run:[0x58,4],turn:[0x28,3],collision:[0x1c,17],face:[0,1]},k=kinds[c.kind];
  if(!k||!Number.isInteger(c.direction)||c.direction<0||c.direction>3||c.code!==k[0]+c.direction||c.total!==k[1]||!Number.isInteger(c.elapsed)||c.elapsed<0||c.elapsed>=c.total||typeof c.initialized!=='boolean'||(c.forced&&c.kind!=='face'))fail('unsupported PM command lifecycle');
 }
 // PM drops command at its terminal callback. Source no-held and finished-held
 // branches have the same recurrence here, so no completion pulse is fabricated.
 return refresh({previousStatus14,avatarState10:motion.avatarState,active:true,singleMovement:false,heldMovement:!!c,finished:!c,commandCode:c?c.code:255,specialMode:0});
}
/** Bounded normal dispatch AFTER caller-proven earlier event checks. The bit1
 * completion path and held-direction bit4 path precede generic fresh A.
 */
function admit({normalFieldMain,earlierEventsExcluded,status14,facing,selectedDirection,heldKeys,newKeys,board}){
 if(normalFieldMain!==true||earlierEventsExcluded!==true)fail('explicit ordinary field and preemption contract required');
 if(![0,1,2,3].includes(status14)||![0,1,2,3].includes(facing)||![-1,0,1,2,3].includes(selectedDirection)||!Array.isArray(heldKeys)||!Array.isArray(newKeys))fail('bounded parsed input required');
 Input.readNewKeys({newKeys});for(const k of heldKeys)if(!Input.KEYS.includes(k))fail('unsupported held key');
 if(status14!==0&&status14!==3)return null;
 if(!board)return null;const record=Data.get(board.key);
 const special=facing===0&&record.graphicsId>=91&&record.graphicsId<=96;
 let reason=null;
 if(special&&status14===3)reason='completion_pulse';
 else if(special&&heldKeys.some(k=>['UP','DOWN','LEFT','RIGHT'].includes(k))&&selectedDirection===facing)reason='held_direction';
 else if(newKeys.includes('A'))reason='fresh_a';
 return reason?Data.freeze({key:record.key,reason,status14,facing,selectedDirection}):null;
}
/** Typed accepted-input cleanup, preserving the old reviewed Controller body.
 * A temporary controller performs validation before publishing any state. No A
 * event or A-only API is fabricated for the two special input paths.
 */
function beginAccepted(controller,entry,names){
 if(!entry||!reasons.includes(entry.reason))fail('typed accepted board reason required');
 const old=controller.state,removed=Consumer.consume(Consumer.request(old.board,4));
 const pending=new Controllers.Controller({fontData:controller.fontData,compile:controller.compile});
 pending.state=Data.freeze({...old,board:removed.state,printedText:null});
 pending.begin(entry.key,names);
 controller.state=Data.freeze({...pending.state,events:[{type:'normal_accepted_board_cleanup_state4',reason:entry.reason},...removed.effects,...pending.state.events]});
 return controller.snapshot();
}
function step(controller,input={},options={}){
 if(options.normalFieldMain!==true)fail('explicit normal field main required');
 Input.readNewKeys(input); // Validate before any accepted-state publication.
 const stages=[];
 if(options.acceptedEntry){
  const e=options.acceptedEntry;
  const checked=admit({normalFieldMain:true,earlierEventsExcluded:true,status14:e.status14,facing:e.facing,selectedDirection:e.selectedDirection,heldKeys:input.heldKeys||[],newKeys:input.newKeys||[],board:Data.get(e.key)});
  if(!checked||checked.reason!==e.reason)fail('accepted reason does not match actual parsed input');
  if(e.reason==='fresh_a'&&(!input.newKeys?.includes('A')||input.repeat===true))fail('fresh-A entry requires actual new A');
  stages.push({stage:'input',snapshot:beginAccepted(controller,e,options.names)});
 }
 const result=Sequence.step(controller,input,{normalFieldMain:true});
 return Data.freeze({...result,stages:[...stages,...result.stages]});
}
/** Browser input adapter. Semantic edges are drained every update; physical
 * aliases and held state survive board opening/closing until up or explicit blur.
 */
class PhysicalInput extends Input.KeyEdges{
 constructor(){super();this.physical=new Map();}
 keyDown(id,key,{repeat=false}={}){if(!Input.KEYS.includes(key))fail('supported physical key required');if(repeat||this.physical.has(id))return;this.physical.set(id,key);super.down(key);}
 keyUp(id){const key=this.physical.get(id);this.physical.delete(id);if(key&&![...this.physical.values()].includes(key))super.up(key);}
 pulse(key){if(!Input.KEYS.includes(key))fail('supported pulse required');if(!this.held.has(key))this.pending.add(key);}
 reset(){super.reset();this.physical.clear();}
}
return Object.freeze({refresh,fromMotion,admit,beginAccepted,step,PhysicalInput,reasons});
});
