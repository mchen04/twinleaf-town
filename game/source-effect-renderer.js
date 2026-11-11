/* Bounded numerical adapter. ARM9 main wakes are explicit game-loop messages;
 * ARM7 timer time is rational source time. Browser delivery phase and carrier
 * conventions are declared approximations, not measured original latency. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-effect-sequence.js'),require('./source-effect-carriers.js'));
 else root.SourceEffectRenderer=factory(root.SourceEffectSequence,root.SourceEffectCarriers);
})(typeof globalThis!=='undefined'?globalThis:this,function(Sequence,Carriers){
'use strict';
const CLOCK=33514000,INTERVAL=174592,MAX_QUEUE=1024;
function need(ok,message){if(!ok)throw new Error('SourceEffectRenderer: '+message);}
function create(data,options){
 options=options||{};const rate=options.sampleRate===undefined?48000:options.sampleRate;
 need(Number.isInteger(rate)&&rate>=8000&&rate<=192000,'unsupported sample rate');
 need(data&&data.profile&&data.profile.control_clock_hz===CLOCK&&data.profile.control_interval_clocks===INTERVAL&&data.profile.carrier_clock_hz===16756991&&data.profile.headroom===.25,'unsupported input profile');
 const traceLimit=options.traceLimit||0;need(Number.isInteger(traceLimit)&&traceLimit>=0&&traceLimit<=200000,'trace limit');
 const makeSequence=options.sequenceFactory||Sequence.create,makeCarriers=options.carrierFactory||Carriers.create;
 let engine,carrier,queue,completions,remaining,frame,periodicPasses,commandPasses,notes,epoch=0,trace,counts,masterPan=-1;
 function initialize(){engine=makeSequence(data);carrier=makeCarriers({waves:data.waves,sampleRate:rate});if(masterPan!==-1)carrier.setMasterPan(masterPan);queue=[];completions=[];remaining=0;frame=0;periodicPasses=0;commandPasses=0;notes=0;trace=[];counts={};}
 initialize();
 function collect(){for(const event of engine.drainEvents()){counts[event.type]=(counts[event.type]||0)+1;if(event.type==='note')notes++;if(traceLimit){need(trace.length<traceLimit,'trace capacity exceeded');trace.push({outputFrame:frame,epoch,...event});}}}
 function pass(periodic){const result=engine.arm7Pass({periodic,hardwareCompletions:completions});completions=[];carrier.applyAll(result.appliedRegisters);for(const command of result.masterPanCommands||[]){masterPan=command.value;carrier.setMasterPan(masterPan);}if(periodic)periodicPasses++;else commandPasses++;collect();}
 function enqueue(action){need(action&&typeof action==='object','action required');need(queue.length<MAX_QUEUE,'pending action capacity exceeded');if(action.type==='start'){need(Number.isInteger(action.id)&&Sequence.supportedIds.includes(action.id),'unsupported effect');queue.push({type:'start',id:action.id});}else if(action.type==='mono'){need(typeof action.mono==='boolean','explicit mono setting');queue.push({type:'mono',mono:action.mono});}else{need(action.type==='main','unsupported action');queue.push({type:'main'});}return true;}
 function consume(){const actions=queue;queue=[];for(const action of actions){if(action.type==='start')engine.requestStart(action.id);else if(action.type==='mono')engine.requestMasterPan(action.mono?64:-1);else if(engine.arm9Main())pass(false);}collect();}
 function render(frames){
  need(Number.isInteger(frames)&&frames>=0&&frames<=rate,'render duration must be at most one second');need(Number.isSafeInteger(frame+frames),'output frame overflow');
  const left=new Float32Array(frames),right=new Float32Array(frames),firstFrame=frame;consume();let offset=0;
  while(offset<frames){
   if(remaining<=0){pass(true);remaining+=INTERVAL*rate;}
   const count=Math.min(frames-offset,Math.ceil(remaining/CLOCK));need(count>0,'nonadvancing control clock');
   const block=carrier.render(count);need(block.left.length===count&&block.right.length===count,'carrier frame count');
   left.set(block.left,offset);right.set(block.right,offset);for(const completion of block.completions)completions.push(completion);
   offset+=count;frame+=count;remaining-=count*CLOCK;
  }
  return{left,right,frames,firstFrame,epoch};
 }
 function reset(){epoch++;initialize();return epoch;}
 function snapshot(){return{profile:'explicit-game-main-source-timer-pinned-carrier-v1',sampleRate:rate,epoch,masterPan,outputFrame:frame,controlRemainingNumerator:remaining,periodicPasses,commandPasses,notes,pendingActions:queue.slice(),pendingCompletions:completions.slice(),eventCounts:{...counts},engine:engine.snapshot(),carrier:carrier.snapshot()};}
 function stats(){return{epoch,outputFrame:frame,sampleRate:rate,periodicPasses,commandPasses,notes,pendingActions:queue.length,pendingCompletions:completions.length,eventCounts:{...counts}};}
 return Object.freeze({enqueue,render,reset,snapshot,stats,drainTrace:()=>trace.splice(0)});
}
return Object.freeze({create,CLOCK,INTERVAL,MAX_QUEUE});
});
