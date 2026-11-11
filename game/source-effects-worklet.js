import './source-effect-data.js';
import './source-effect-voices.js';
import './source-effect-sequence.js';
import './source-effect-carriers.js';
import './source-effect-renderer.js';
/* Only this processor's output is connected, by FieldEffects, to the existing
 * capture-only master gain. It has no access to a speaker destination. */
class SourceEffectsProcessor extends AudioWorkletProcessor {
 constructor(){
  super();this.epoch=0;this.failed=false;
  try{this.renderer=globalThis.SourceEffectRenderer.create(globalThis.SourceEffectData,{sampleRate});}
  catch(error){this.fail(error);return;}
  this.port.onmessage=event=>{
   if(this.failed)return;
   try{
    const m=event.data;if(!m||!Number.isSafeInteger(m.epoch)||m.epoch<0)throw new Error('Invalid source effect message');
    if(m.type==='reset'){
     if(m.epoch<this.epoch)return;
     this.epoch=m.epoch;this.renderer.reset();return;
    }
    if(m.epoch!==this.epoch)return;
    if(m.type==='play')this.renderer.enqueue({type:'start',id:m.id});
    else if(m.type==='mono')this.renderer.enqueue({type:'mono',mono:m.mono});
    else if(m.type==='frame')this.renderer.enqueue({type:'main'});
    else if(m.type==='inspect')this.port.postMessage({type:'state',epoch:this.epoch,request:m.request,stats:this.renderer.stats()});
    else throw new Error('Unknown source effect message');
   }catch(error){this.fail(error);}
  };
  this.port.postMessage({type:'ready',schema:'twinleaf-source-effects-v1',commit:globalThis.SourceEffectData.commit,ids:Object.keys(globalThis.SourceEffectData.sequences).map(Number)});
 }
 fail(error){this.failed=true;this.port.postMessage({type:'fatal',message:String(error&&error.message||error)});}
 process(inputs,outputs){
  const stereo=outputs[0];if(!stereo||stereo.length!==2)return false;
  if(this.failed){stereo[0].fill(0);stereo[1].fill(0);return false;}
  try{const block=this.renderer.render(stereo[0].length);stereo[0].set(block.left);stereo[1].set(block.right);return true;}
  catch(error){stereo[0].fill(0);stereo[1].fill(0);this.fail(error);return false;}
 }
}
registerProcessor('twinleaf-source-effects-v1',SourceEffectsProcessor);
