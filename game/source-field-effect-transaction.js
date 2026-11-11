/* Synchronous paired source-state acceptance. This is not GPU or DOM rollback. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-native-field-lifecycle.js'),require('./source-exit-indicator.js'),require('./source-cpu-renderer.js'));else root.SourceFieldEffectTransaction=factory(root.SourceNativeFieldLifecycle,root.SourceExitIndicator,root.SourceCpuRenderer);})(typeof globalThis!=='undefined'?globalThis:this,function(Fields,Effects,CPU){
'use strict';
function check(ok,message){if(!ok)throw Error('Field/effect transaction: '+message);}
function create({bridge,effect,renderer=null}){
 Fields.verifyBridge(bridge);Effects.verifyManager(effect);if(renderer)CPU.verifyFieldRenderer(renderer);
 const records=new WeakMap();let closed=false,rendering=false,pending=null,binding=renderer?renderer.bindExitIndicator(bridge,effect):null;
 function live(){check(!closed,'retired paired coordinator');}
 function coherent(){live();Fields.verifyBridge(bridge);Effects.verifyManager(effect);const a=bridge.snapshot(),b=effect.snapshot();check(a.header===b.header&&a.generation===b.generation&&a.stage===b.stage&&a.stopRequested===b.stopRequested,'field/effect context mismatch');return a;}
 function idle(){check(!rendering,'paired render is active');check(pending===null,'paired lifecycle is pending');coherent();}
 function record(token){live();const r=records.get(token);check(r&&pending===token&&r.status==='pending','foreign, copied or closed pair');return r;}
 function paired(bt,et,preview=false){const a=bridge.preflightCommit(bt),b=effect.preflightCommit(et);for(const key of ['operation','header','generation','nextHeader','nextGeneration','stopRequested'])check(a[key]===b[key],'crossed pair '+key);if(!preview)check(a.nextStage===b.nextStage,'crossed pair nextStage');check(JSON.stringify(a.destinationTile)===JSON.stringify(b.destinationTile),'crossed pair destination');return Object.freeze({bridge:a,effect:b});}
 function requestStop(){idle();bridge.preflightStop();effect.preflightStop();bridge.requestStop();effect.requestStop();return coherent();}
 function prepareLifecycle(operation,input={}){
  idle();let bt=null,et=null;
  try{
   switch(operation){
    case 'exit0':bt=bridge.prepareExit0(input.position);break;
    case 'exit1':bt=bridge.prepareExit1();break;
    case 'exit2':bt=bridge.prepareExit2();break;
    case 'location0':bt=bridge.prepareLocation0();break;
    case 'location1':bt=bridge.prepareLocation1({header:input.header,tile:input.tile});break;
    case 'location2':bt=bridge.prepareLocation2();break;
    case 'application-restore':bt=bridge.prepareApplicationRestore({header:input.header,tile:input.tile});break;
    case 'restore':bt=bridge.prepareRestore();break;
    case 'init0':bt=bridge.prepareInit0();break;
    case 'init1':bt=bridge.prepareInit1({generation:input.generation});break;
    case 'init2':bt=bridge.prepareInit2();break;
    case 'init3':bt=bridge.prepareInit3();break;
    default:check(false,'unknown lifecycle operation');
   }
   et=effect.prepareLifecycle(operation,input);paired(bt,et);
   const token=Object.freeze({kind:'paired-field-effect-lifecycle',operation});records.set(token,{bt,et,status:'pending'});pending=token;return token;
  }catch(error){const errors=[error];if(et)try{effect.abort(et);}catch(e){errors.push(e);}if(bt)try{bridge.abort(bt);}catch(e){errors.push(e);}if(errors.length>1)throw new AggregateError(errors,'Lifecycle preparation and exact cleanup failed');throw error;}
 }
 function preflight(token){const r=record(token);return paired(r.bt,r.et);}
 function commit(token){const r=record(token);paired(r.bt,r.et);bridge.commit(r.bt);effect.commitLifecycle(r.et);r.status='committed';pending=null;return coherent();}
 function abort(token){const r=record(token),errors=[];try{effect.abort(r.et);}catch(error){errors.push(error);}try{bridge.abort(r.bt);}catch(error){errors.push(error);}r.status='aborted';pending=null;if(errors.length)throw new AggregateError(errors,'Exact paired abort failed');return coherent();}
 function renderField(input,fieldToken,advance,isHostCurrent=null){
  idle();check(renderer&&typeof advance==='boolean','actual renderer and explicit advance required');check(isHostCurrent===null||typeof isHostCurrent==='function','host denial guard');Fields.verifyPreparedField(bridge,fieldToken);let et=null,bridgeCommitted=false,effectCommitted=false;rendering=true;
  try{
   const result=CPU.renderOwnedField(renderer,input,binding,fieldToken,advance);et=CPU.verifyCompletedField(renderer,result,binding,fieldToken,effect);if(isHostCurrent)check(isHostCurrent()===true,'host field owner replaced before acceptance');paired(fieldToken,et,!advance);
   // No caller hook, await, DOM operation or asset parsing between these writes.
   if(advance){bridge.commit(fieldToken);bridgeCommitted=true;effect.commit(et);effectCommitted=true;}else{bridge.abort(fieldToken);bridgeCommitted=true;effect.abort(et);effectCommitted=true;}
   return result;
  }catch(error){const errors=[error];if(et&&!effectCommitted)try{effect.abort(et);}catch(e){errors.push(e);}if(!bridgeCommitted)try{bridge.abort(fieldToken);}catch(e){errors.push(e);}if(errors.length>1)throw new AggregateError(errors,'Field acceptance failed; cleanup is not rollback of accepted state');throw error;}finally{rendering=false;}
 }
 function retire(){if(closed)return false;check(!rendering,'retire requires quiescent render');check(pending===null,'retire requires settled paired lifecycle');closed=true;const old=binding;binding=null;if(old)CPU.revokeOwnedFieldBinding(renderer,old);return true;}
 coherent();return Object.freeze({requestStop,prepareLifecycle,preflight,commit,abort,renderField,retire});
}
return Object.freeze({create});
});
