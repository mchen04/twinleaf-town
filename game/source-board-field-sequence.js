(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-board-data.js'));else root.SourceBoardFieldSequence=factory(root.SourceBoardData);})(typeof globalThis!=='undefined'?globalThis:this,function(Data){
'use strict';
/** Source sub_02037524 sequence, only under its normal active-field main-phase
 * preconditions. This is NOT the whole input dispatcher, scheduler, or game loop.
 * acceptedBoardKey must already be resolved/admitted by the source field guards
 * and facing resolver, with higher-priority events excluded by the caller.
 * No browser, sounds, global movement locks, or menu implementation is supplied.
 */
function step(controller,input={},options={}) {
  if(options.normalFieldMain!==true)throw new Error('SourceBoardField: explicit normal active-field main-phase precondition required');
  const stages=[];
  if(options.acceptedBoardKey!==undefined) {
    if(input.repeat===true||!Array.isArray(input.newKeys)||!input.newKeys.includes('A'))throw new Error('SourceBoardField: accepted normal A requires fresh A');
    stages.push({stage:'input',snapshot:controller.beginNormalA(options.acceptedBoardKey,options.names)});
  }
  const task=controller.stepScripts(input);stages.push({stage:'script_task',snapshot:task});
  // Menu startup is an external callback capable of replacing tasks/overlay. Stop
  // before assuming it leaves this field main phase unchanged.
  if(task.events.some(e=>e.type==='menu_startup_callback_due')) {
    return Data.freeze({snapshot:task,stages,needsMenuCallback:true,ordinaryConsumerRun:false});
  }
  const after=controller.consumeField();stages.push({stage:'field_consumer',snapshot:after});
  return Data.freeze({snapshot:after,stages,needsMenuCallback:false,ordinaryConsumerRun:true});
}
return {step};
});
