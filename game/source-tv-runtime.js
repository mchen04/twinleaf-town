/* Explicit TV-origin scenario owner, not the unimplemented Intro109/save bootstrap.
 * The existing renderer/lifecycle is a prepared application consumer. After TV,
 * source type2 volume precedes fresh actor admission; its readiness and source
 * fade gate precede type1 script982:3 and subsequent ordinary field input.
 * No worklet/output subscriber, recorded-loop substitution, or hardware-time claim. */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f(require('./source-intro-tv.js'),require('./source-tv-script.js'),require('./source-tv-sound.js'),require('./source-warp.js'));else r.SourceTvRuntime=f(r.SourceIntroTv,r.SourceTvScript,r.SourceTvSound,r.SourceWarp);})(typeof globalThis!=='undefined'?globalThis:this,function(Tv,Script,Sound,Warp){
'use strict';
const need=(v,m)=>{if(!v)throw Error('SourceTvRuntime: '+m);};
function create({owner,isOwnerCurrent,epoch,story,glyphs,art,effectData,hooks,defaultMusic=false,captureAudio=false,rivalStory=false,fieldMusic=false}){
 need(owner&&typeof isOwnerCurrent==='function'&&story?.vars,'scenario owner');
 for(const name of ['admitActors','fieldReady','lock','unlock','openMessage','closeMessage','readTextDelay','defaultBgm','printerEvent'])need(typeof hooks?.[name]==='function','hook '+name);
 need(typeof defaultMusic==='boolean'&&(!defaultMusic||typeof hooks.fieldSelection==='function'),'explicit default-music field selection');
 need(typeof captureAudio==='boolean'&&(!captureAudio||defaultMusic),'explicit capture-capable music owner');
 need(typeof rivalStory==='boolean'&&(!rivalStory||defaultMusic),'explicit rival story owner');
 need(typeof fieldMusic==='boolean'&&(!fieldMusic||rivalStory),'explicit bounded field music capability');
 let captureToken=null,captureSink=null,captureFailed=false,captureFailureValue=undefined,delivering=false,captureDelivered=0;
 let fieldSelectionRecorded=false;
 let retired=false,phase='tv',lastVisit=-1,pending=false,script=null,actors=null,actorsAdmitted=false,visitPhase=null;
 const sound=(rivalStory?(captureAudio?Sound.createRivalStoryCapture:Sound.createRivalStory):captureAudio?Sound.createDefaultMusicCapture:defaultMusic?Sound.createDefaultMusic:Sound.create)(effectData,{owner,isOwnerCurrent:()=>current(),epoch,soundMode:0,fieldMusic}),fade=new Warp.Fade();
 const scene=Tv.create({owner,isOwnerCurrent:()=>current(),sound,art});
 const trace=[];function emit(type){trace.push({visit:lastVisit,type,phase});if(trace.length>256)trace.shift();}
 function current(){if(retired)return false;const ok=isOwnerCurrent(owner)===true;return ok&&!retired;}
 function check(){need(current(),'owner replaced');}
 function preflight(){check();if(captureFailed)throw captureFailureValue;need(!delivering,'capture sink reentered');if(captureAudio)need(!sound.captureStatus().pending,'undrained capture before whole callback');}
 function beginCapture(sink){preflight();need(captureAudio&&!pending&&!captureToken&&typeof sink==='function','capture begins between whole callbacks');const token=sound.beginCapture();captureSink=sink;captureToken=token;captureDelivered=0;return token;}
 function endCapture(token){preflight();need(!pending&&token===captureToken&&captureToken!==null,'exact capture end boundary');const result=sound.endCapture(token);captureToken=null;captureSink=null;return result;}
 function captureStatus(){return {capable:captureAudio,active:!!captureToken,delivering,deliveredFrames:captureDelivered,faulted:captureFailed,source:captureAudio?sound.captureStatus():null};}
 function deliverCapture(){if(!captureToken)return;const block=sound.takeCapture(captureToken);delivering=true;try{const acknowledgement=captureSink(block);need(acknowledgement===true,'synchronous capture sink acknowledgement');check();captureDelivered+=block.frames;}catch(error){captureFailed=true;captureFailureValue=error;throw error;}finally{delivering=false;}}
 function playEffect(id){preflight();sound.playEffect(id);return true;}
 function continueMap(value){check();need(!delivering&&!captureFailed,'capture continuation boundary');if(phase!=='ordinary'||!defaultMusic)return false;return sound.continueMap(value);}
 function fieldCall(name,...args){preflight();need(fieldMusic&&phase==='ordinary','ordinary field music boundary');return sound[name](...args);}
 function storyCall(name,...args){preflight();need(rivalStory&&phase==='ordinary','ordinary rival script boundary');return sound[name](...args);}
 function begin(visit,input){preflight();need(!pending&&Number.isSafeInteger(visit)&&visit>lastVisit&&Number.isInteger(input?.newMask),'ordered input visit');lastVisit=visit;pending=true;visitPhase=phase;
  switch(phase){
   case 'tv':scene.tick(visit,input.newMask);return true;
   case 'field-admission':
    // The source level912 type2 script5's only reached effect at40F9=0.
    need(Object.getOwnPropertyDescriptor(story.vars,0x40F9)?.value===0,'fresh native TV variable');sound.setBroadcastVolume(50);check();
    actors=hooks.admitActors();check();need(Array.isArray(actors)&&actors.length&&new Set(actors).size===actors.length,'fresh actor consumer');actorsAdmitted=true;
    script=Script.create({owner,story,actors,sound,glyphs,hooks:{isOwnerCurrent:()=>current(),lock:hooks.lock,unlock:hooks.unlock,openMessage:hooks.openMessage,closeMessage:hooks.closeMessage,readTextDelay:hooks.readTextDelay,defaultBgm:hooks.defaultBgm}});
    phase='field-ready';emit('type2-volume50-before-actors');return true;
   case 'field-ready':if(defaultMusic&&!fieldSelectionRecorded){sound.recordFieldSelection(hooks.fieldSelection());check();fieldSelectionRecorded=true;}if(hooks.fieldReady()===true){check();fade.begin({pattern:0,top:1,bottom:1,color:0,duration:6,framesPer:1});phase='field-fade';emit('source-field-fade');}return true;
   case 'field-fade':if(fade.snapshot().finished){phase='level-dispatch';emit('field-fade-finished-and-task-return');}return true; // Completed child and parent pop in this same task pump; type1 waits for next input visit.
   case 'level-dispatch':need(hooks.fieldReady()===true,'field readiness lost');check();need(script.dispatch({header:415,eligible:true}),'initial type1 admission');script.visit(visit);phase='script';emit('type1-before-input');return true;
   case 'script':script.visit(visit);if(!script.ownsField()){phase='ordinary';emit('script-task-return');}return true; // End cannot release this already sampled input visit.
   case 'ordinary':return false;
   default:throw Error('SourceTvRuntime: phase');
  }
 }
 function printers(input){check();need(pending,'printer phase');if(!script?.ownsField()||!script.snapshot().messageOpen)return;
  for(let pass=0;pass<2;pass++){const value=script.printerVisit(lastVisit,pass,input);check();for(const event of value?.events||[]){hooks.printerEvent(event);check();}if(!value||value.printerFinished||value.finished)break;}
 }
 function finish(visit){check();need(pending&&visit===lastVisit,'finish phase');
  if(visitPhase==='tv'){scene.pump(visit);scene.publish(visit);if(scene.snapshot().done){phase='field-admission';emit('TV-complete-bootstrap-gap');}}
  if(fade.type!=='none')fade.pump();
  sound.main(visit);check();pending=false;deliverCapture();return snapshot();
 }
 function snapshot(){return {boundary:'declared-TV-origin-scenario',phase,retired,lastVisit,pending,actorsAdmitted,inputOwned:phase!=='ordinary',scene:scene.snapshot(),script:script?.snapshot()||null,fieldBrightness:actorsAdmitted?(fade.type==='none'?-16:fade.snapshot().brightness):-16,sound:sound.status(),...(captureAudio?{capture:captureStatus()}:{}),precedingIntroAndSaveImplemented:false,nativeBootstrapImplemented:false,sourceOrderedFieldConsumer:true,outputImplemented:false};}
 function renderTv(){check();need(!pending&&!actorsAdmitted,'published TV presentation');const s=scene.snapshot();return s.resources?{native:scene.render(),brightness:s.brightness}:null;}
 function retire(reason='host-retire'){if(retired)return false;let first=null;const attempt=fn=>{try{fn();}catch(e){if(!first)first=e;}};
  // Script cancellation still sees its owning host; sound/scene retire separately.
  attempt(()=>script?.cancel(reason));attempt(()=>scene.retire());attempt(()=>sound.retire());retired=true;pending=false;captureSink=null;captureToken=null;phase='retired';if(first)throw first;return true;
 }
 return Object.freeze({...(fieldMusic?{prepareFieldTransition:v=>fieldCall('prepareFieldTransition',v),fieldFadeFinished:t=>fieldCall('fieldFadeFinished',t),loadFieldTransition:(t,to)=>fieldCall('loadFieldTransition',t,to),finishFieldTransition:(t,v)=>fieldCall('finishFieldTransition',t,v)}:{}),... (rivalStory?{stopStoryBgm:()=>storyCall('stopStoryBgm'),startRivalMusic:()=>storyCall('startRivalMusic'),beginStoryFade:value=>storyCall('beginStoryFade',value),storyFadeFinished:token=>storyCall('storyFadeFinished',token),restartFieldDefault:value=>storyCall('restartFieldDefault',value)}:{}),preflight,beginCapture,endCapture,captureStatus,playEffect,continueMap,begin,printers,finish,snapshot,renderTv,retire,ownsField:()=>!retired&&phase!=='ordinary',isOverlay:()=>!retired&&!actorsAdmitted,drainTrace:()=>trace.splice(0)});
}
return Object.freeze({create});
});
