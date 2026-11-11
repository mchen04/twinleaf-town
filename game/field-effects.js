(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(root);else root.FieldEffects=factory(root);})(typeof globalThis!=='undefined'?globalThis:this,function(root){
'use strict';
const IDS=[1500,1501,1504,1533,1537,1539,1541,1543,1563],COMMIT='b623abef1b4dfe204ca50aab42447ac00c134290';
function create(context,output,enabled,data,options){
 options=options||{};
 if(!context||!output||typeof enabled!=='function'||!data||data.schema!=='twinleaf-source-effects-v1'||data.commit!==COMMIT||Object.keys(data.sequences||{}).map(Number).join(',')!==IDS.join(','))throw new Error('Verified source effect inputs are required');
 let loading=null,node=null,ready=false,epoch=0,attemptSerial=0,lastError=null,mono=false;
 const schedule=options.setTimeout||root.setTimeout.bind(root),cancel=options.clearTimeout||root.clearTimeout.bind(root);
 function dispose(target){if(!target)return;try{target.port.onmessage=null;target.port.close?.();}catch(_){}try{target.onprocessorerror=null;target.disconnect();}catch(_){}}
 function runtimeFailure(target,error){if(node!==target)return;node=null;ready=false;loading=null;lastError=String(error&&error.message||error);dispose(target);if(typeof options.onFault==='function')options.onFault(new Error(lastError));}
 function load(){
  if(loading)return loading;
  const serial=++attemptSerial;
  const attempt=(async()=>{
   if(!context.audioWorklet||typeof context.audioWorklet.addModule!=='function')throw new Error('AudioWorklet is required for source-derived effects');
   await context.audioWorklet.addModule(options.moduleUrl||'source-effects-worklet.js');
   const make=options.createNode||((ctx,name,config)=>new root.AudioWorkletNode(ctx,name,config));
   let candidate=null,timeout=null;
   try{
    candidate=make(context,'twinleaf-source-effects-v1',{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2],channelCount:2});
    await new Promise((resolve,reject)=>{
     timeout=schedule(()=>reject(new Error('Source effect processor did not become ready')),12000);
     candidate.onprocessorerror=()=>reject(new Error('Source effect processor startup failed'));
     candidate.port.onmessage=event=>{
      const message=event.data||{};
      if(message.type==='fatal')reject(new Error('Source effects failed: '+message.message));
      else if(message.type==='ready'){
       if(message.schema!=='twinleaf-source-effects-v1'||message.commit!==COMMIT||!Array.isArray(message.ids)||message.ids.join(',')!==IDS.join(','))reject(new Error('Source effect processor identity mismatch'));
       else resolve();
      }
     };
     candidate.port.start?.();
    });
    cancel(timeout);timeout=null;
    if(serial!==attemptSerial)throw new Error('Stale source effect initialization');
    candidate.connect(output);
    node=candidate;ready=true;lastError=null;
    candidate.port.onmessage=event=>{const message=event.data||{};if(message.type==='fatal')runtimeFailure(candidate,new Error('Source effects failed: '+message.message));};
    candidate.onprocessorerror=()=>runtimeFailure(candidate,new Error('Source effect processor failed'));
    candidate.port.postMessage({type:'reset',epoch});candidate.port.postMessage({type:'mono',epoch,mono});
   }catch(error){if(timeout!==null)cancel(timeout);if(node===candidate){node=null;ready=false;}dispose(candidate);throw error;}
  })().catch(error=>{if(loading===attempt)loading=null;lastError=String(error&&error.message||error);throw error;});
  loading=attempt;return attempt;
 }
 function send(type,extra){if(!ready||!node||!enabled()||context.state!=='running')return false;try{node.port.postMessage({type,epoch,...extra});return true;}catch(error){runtimeFailure(node,error);return false;}}
 function play(id){return IDS.includes(id)&&send('play',{id});}
 function frame(){return send('frame',{});}
 function stopAll(){epoch++;if(!node)return;try{node.port.postMessage({type:'reset',epoch});node.port.postMessage({type:'mono',epoch,mono});}catch(error){runtimeFailure(node,error);}}
 function setMono(value){if(typeof value!=='boolean')throw Error('Explicit mono intent required');mono=value;if(!ready||!node)return false;try{node.port.postMessage({type:'mono',epoch,mono});return true;}catch(error){runtimeFailure(node,error);return false;}}
 function inspect(){return{ready,epoch,mono,loading:!!loading,lastError,profile:'stateful-source-effects-capture-only'};}
 return{load,play,frame,stopAll,inspect,setMono};
}
return Object.freeze({create});
});
