(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-native-bytes.js'),require('./source-native-area-animation-audit.js'));
 else root.SourceNativeAreaAnimation=factory(root.SourceNativeBytes,root.SourceNativeAreaAnimationAudit);
})(typeof globalThis!=='undefined'?globalThis:this,function(Bytes,Audit){
 'use strict';
 const own=Object.getOwnPropertyDescriptor,keys=Reflect.ownKeys;
 function check(ok,message){if(!ok)throw Error('Native area animation manager unsupported: '+message);}
 function exact(value,names){
  check(value&&typeof value==='object'&&!Array.isArray(value),'explicit options/state');
  const actual=keys(value);check(actual.length===names.length&&actual.every(n=>names.includes(n)),'exact options/state fields');
  const result=Object.create(null);for(const name of names){const d=own(value,name);check(d&&Object.hasOwn(d,'value'),'state/options accessor');result[name]=d.value;}return result;
 }
 function generation(value){check(Number.isSafeInteger(value)&&value>0,'positive safe generation');return value;}
 function area(value){check(value===6||value===20,'only source areas6 and20');return value;}
 function stateSnapshot(areaId,gen,revision,slots){return Bytes.freeze({areaId,generation:gen,revision,slots:slots.map(s=>({selector:s.selector,sequenceIndex:s.sequenceIndex,counter:s.counter}))});}
 check(Bytes&&typeof Bytes.copy==='function'&&typeof Bytes.freeze==='function'&&Audit&&typeof Audit.copyTransfer==='function','source byte gate dependencies');
 function validateState(input){
  const s=exact(input,['areaId','generation','revision','slots']);area(s.areaId);generation(s.generation);check(Number.isSafeInteger(s.revision)&&s.revision>=0,'safe nonnegative revision');
  check(Array.isArray(s.slots),'slot array');const length=own(s.slots,'length');
  const count=s.areaId===6?6:0;check(length&&length.value===count&&keys(s.slots).length===count+1,'complete compact slot inventory');
  const slots=[];
  for(let i=0;i<count;i++){
   const d=own(s.slots,String(i));check(d&&Object.hasOwn(d,'value'),'dense slot array without accessors');
   const slot=exact(d.value,['selector','sequenceIndex','counter']),t=Audit.targets[i];
   check(slot.selector===t.selector,'source slot order');
   check(Number.isInteger(slot.sequenceIndex)&&slot.sequenceIndex>=0&&slot.sequenceIndex<t.sequence.length,'source sequence index');
   check(Number.isInteger(slot.counter)&&slot.counter>=0&&slot.counter<=t.thresholds[slot.sequenceIndex],'source counter');slots.push(slot);
  }
  return stateSnapshot(s.areaId,s.generation,s.revision,slots);
 }
 function create(options){
  check(arguments.length===1,'explicit create options');const config=exact(options,['areaId','generation']),areaId=area(config.areaId),gen=generation(config.generation);
  let state=stateSnapshot(areaId,gen,0,areaId===6?Audit.targets.map(t=>({selector:t.selector,sequenceIndex:0,counter:0})):[]);
  let bank=areaId===6?Audit.targets.map(t=>({transfer:Audit.copyTransfer(Audit.transferDescriptor(t.selector,0)),palette:Audit.paletteDescriptor(t.selector)})):[];
  let alive=true,epoch=0,lastCommittedSnapshot=null;
  const transactions=new WeakMap(),snapshots=new WeakMap();
  function live(){check(alive,'destroyed generation');}
  function current(expected){live();check(generation(expected)===gen,'stale generation');}
  function renderSnapshot(){
   check(arguments.length===0,'renderSnapshot takes no options');live();
   const textures=bank.filter(b=>b.transfer.runtimeTextureKey!==null).map(b=>{
    const d=b.transfer,t=Audit.targets[d.managerSlot],f=t.frames[d.sourceTextureIndex];
    return {selector:d.selector,key:d.runtimeTextureKey,sourceTextureIndex:d.sourceTextureIndex,width:d.width,height:d.height,format:d.format,rgbaSHA256:f.rgbaSHA256,retainedPaletteSHA256:d.retainedPaletteSHA256};
   });
   const result=Bytes.freeze({areaId,generation:gen,revision:state.revision,seaFrame:areaId===6?bank[0].transfer.sourceTextureIndex:null,pondFrame:areaId===6?bank[5].transfer.sourceTextureIndex:null,textures});
   snapshots.set(result,{epoch,status:'open'});return result;
  }
  function renderDescriptors(snapshot){
   check(arguments.length===1,'renderDescriptors takes authenticated snapshot');live();const record=snapshots.get(snapshot);
   check(record&&((record.status==='open'&&record.epoch===epoch)||(record.status==='committed'&&snapshot===lastCommittedSnapshot)),'stale or unauthenticated render snapshot');
   const result=Object.create(null);for(const t of snapshot.textures)result[t.key]=Audit.renderDescriptor(t.selector,t.sourceTextureIndex);return Object.freeze(result);
  }
  function beginField(options){
   check(arguments.length===1,'explicit field options');const opts=exact(options,['generation','enabled']);current(opts.generation);check(typeof opts.enabled==='boolean','boolean field mask');
   check(!opts.enabled||state.revision<Number.MAX_SAFE_INTEGER,'field revision exhausted');
   const requests=[],changes=[];
   const slots=state.slots.map((slot,i)=>{
    const t=Audit.targets[i];let sequenceIndex=slot.sequenceIndex,counter=slot.counter;
    if(opts.enabled){
     if(t.thresholds[sequenceIndex]>counter)counter++;
     else{
      counter=0;sequenceIndex=(sequenceIndex+1)%t.sequence.length;
      const sourceTextureIndex=t.sequence[sequenceIndex];
      requests.push({managerSlot:i,selector:t.selector,targetIdentifier:t.targetIdentifier,sourceTextureIndex,transferType:0,transferBytes:t.transferBytes});
      changes.push(Audit.copyTransfer(Audit.transferDescriptor(t.selector,sourceTextureIndex)));
     }
    }
    return {selector:t.selector,sequenceIndex,counter};
   });
   const nextState=stateSnapshot(areaId,gen,state.revision+(opts.enabled?1:0),slots),render=renderSnapshot();
   const transaction=Bytes.freeze({areaId,generation:gen,revision:state.revision,enabled:opts.enabled,requests,renderSnapshot:render,nextState});
   transactions.set(transaction,{epoch,status:'open',nextState,changes,render});return transaction;
  }
  function pending(transaction){
   live();const p=transactions.get(transaction);check(p&&p.status==='open'&&p.epoch===epoch,'stale, foreign or closed field transaction');return p;
  }
  function preflightCommit(transaction){check(arguments.length===1,'commit takes original transaction');pending(transaction);return true;}
  function commit(transaction){
   preflightCommit.apply(null,arguments);const p=pending(transaction),nextBank=bank.slice();
   for(const transfer of p.changes)nextBank[transfer.managerSlot]={transfer,palette:bank[transfer.managerSlot].palette};
   bank=nextBank;state=p.nextState;p.status='committed';snapshots.get(p.render).status='committed';lastCommittedSnapshot=p.render;epoch++;return state;
  }
  function abort(transaction){
   check(arguments.length===1,'abort takes original transaction');const p=pending(transaction);p.status='aborted';snapshots.get(p.render).status='aborted';return state;
  }
  function preflightDestroy(options){check(arguments.length===1,'destroy requires generation');const opts=exact(options,['generation']);current(opts.generation);return true;}
  function destroy(options){
   preflightDestroy.apply(null,arguments);alive=false;epoch++;bank=[];return Object.freeze({areaId,generation:gen,destroyed:true});
  }
  function readState(){check(arguments.length===0,'state takes no options');live();return state;}
  function bankSnapshot(){
   check(arguments.length===0,'bankSnapshot takes no options');live();
   return Object.freeze({areaId,generation:gen,revision:state.revision,targets:Object.freeze(bank.map(b=>Object.freeze({transfer:Audit.copyTransfer(b.transfer),palette:Object.freeze({selector:b.palette.selector,targetIdentifier:b.palette.targetIdentifier,retainedPaletteSHA256:b.palette.retainedPaletteSHA256,data:Bytes.copy(b.palette.data)})})))});
  }
  return Object.freeze({beginField,preflightCommit,preflightDestroy,commit,abort,destroy,state:readState,bankSnapshot,renderSnapshot,renderDescriptors});
 }
 const limits=Object.freeze(['Explicit app-owned lifetime generation; caller issues the stop callback, then destroy at exit0, and creates at init1 without ticking init2/init3.','beginField captures the current bank for draw and stages source requests without changing source state; commit applies requests to the private bank after accepted draw.','This host sequencing contract does not establish physical VRAM timing, queue acceptance or display fetch; renderer changes already committed elsewhere are not rolled back by abort.','No reset from visibility, quadrant, camera, fade or header identity; no implicit renderer synchronization.']);
 return Object.freeze({create,validateState,limits});
});
