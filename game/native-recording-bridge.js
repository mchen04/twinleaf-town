/* Capture-only PCM output adapter. Source main remains the clock owner.
 * Underruns remain silence; no resampling, time stretching or substituted BGM.
 * Wall scheduling is explicitly not source/hardware clock parity. */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.NativeRecordingBridge=f();})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function create(context,output){
 const need=(x,m)=>{if(!x)throw Error('NativeRecordingBridge: '+m);};
 need(context&&typeof context.createBuffer==='function'&&typeof context.createBufferSource==='function'&&output,'audio consumers');
 let closed=false,first=null,nextFrame=null,epoch=null,serial=null,nextTime=0,blocks=0,frames=0,gaps=0,gapSeconds=0,maxQueued=0;const nodes=new Set();
 function accept(b){need(!closed,'closed');need(b&&b.sampleRate===48000&&b.channels===2&&b.format==='interleaved-float32'&&b.complete===true,'PCM format');need(Number.isSafeInteger(b.frames)&&b.frames>0&&b.frames<=1601&&Number.isSafeInteger(b.firstFrame)&&b.firstFrame>=0,'PCM bounds');need(b.samples instanceof Float32Array&&b.samples.length===b.frames*2,'PCM storage');need(b.samples.every(Number.isFinite),'finite PCM');
  if(first===null){first=b.firstFrame;nextFrame=first;epoch=b.epoch;serial=b.serial;}
  need(b.epoch===epoch&&b.serial===serial&&b.firstFrame===nextFrame,'contiguous source ownership');need(frames+b.frames<=48000*171,'bounded total');need(nodes.size<120,'bounded pending nodes');
  const now=context.currentTime;need(Number.isFinite(now)&&now>=0,'audio clock');const earliest=now+.02;let at=nextTime;if(at<earliest){if(blocks){gaps++;gapSeconds+=earliest-at;}at=earliest;}need(at-now<=2,'bounded scheduling lead');
  const buffer=context.createBuffer(2,b.frames,48000);for(let c=0;c<2;c++){const d=buffer.getChannelData(c);for(let i=0;i<b.frames;i++)d[i]=b.samples[i*2+c];}
  const node=context.createBufferSource();try{node.buffer=buffer;node.connect(output);nodes.add(node);node.onended=()=>{nodes.delete(node);try{node.disconnect();}catch(_){}};node.start(at);}catch(e){nodes.delete(node);try{node.disconnect();}catch(_){}throw e;}
  nextTime=at+b.frames/48000;nextFrame+=b.frames;blocks++;frames+=b.frames;maxQueued=Math.max(maxQueued,nodes.size);return true;
 }
 function snapshot(){return {scope:'native-PCM-observation-scheduled-at-wall-arrival-not-hardware-timing',closed,blocks,frames,rate:48000,firstFrame:first,nextFrame,epoch,serial,underruns:gaps,underrunSeconds:gapSeconds,maxQueued,pending:nodes.size,nextAudioTime:nextTime};}
 function dispose(){if(closed)return snapshot();closed=true;const errors=[];for(const n of nodes){try{n.stop();}catch(e){errors.push(e);}try{n.disconnect();}catch(e){errors.push(e);}}nodes.clear();if(errors.length)throw new AggregateError(errors,'Native PCM bridge cleanup');return snapshot();}
 return Object.freeze({accept,snapshot,dispose});
}return Object.freeze({create});});
