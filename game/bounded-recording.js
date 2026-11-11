/* Finite canvas/audio export. This bounds accepted file bytes, not browser storage. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BoundedRecording=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const LIMITS=Object.freeze({maxBytes:4194304,softBytes:3145728,stopMs:170000,deadlineMs:180000,timesliceMs:1000});
function create(options){
 const {recorder,fileHandle,emptyFile,Blob:BlobType,now,setTimer,clearTimer,onState,onTerminal}=options;
 if(!recorder||typeof recorder.start!=='function'||typeof recorder.stop!=='function'||recorder.state!=='inactive')throw new TypeError('Inactive recorder required');
 if(!fileHandle||typeof fileHandle.getFile!=='function'||typeof fileHandle.createWritable!=='function'||!emptyFile||emptyFile.size!==0||!Number.isFinite(emptyFile.lastModified))throw new TypeError('A newly selected empty file is required');
 if(typeof BlobType!=='function'||typeof now!=='function'||typeof setTimer!=='function'||typeof clearTimer!=='function'||typeof onState!=='function'||typeof onTerminal!=='function')throw new TypeError('Recorder boundary collaborators required');
 const tracks=recorder.stream?.getTracks?.();
 if(!Array.isArray(tracks)||!tracks.some(t=>t.kind==='video')||!tracks.some(t=>t.kind==='audio')||tracks.some(t=>t.readyState!=='live'||typeof t.addEventListener!=='function'||typeof t.removeEventListener!=='function'))throw new Error('Live video and audio tracks required');
 let phase='new',startedAt=null,receivedBytes=0,retainedBytes=0,unretainedBytes=0,discardedBytes=0,bufferedBytes=0,chunks=[],chunkCount=0,stopRequested=false,terminalSeen=false,saveStarted=false,saveClosed=false,terminalCalled=false,uncertain=false,notifying=false;
 let softTimer=null,hardTimer=null,writable=null,closeAttempted=false;
 const endedHandlers=[];
 const failures=[];
 function copyError(error,seen=new WeakSet()){if(error===null||typeof error!=='object')return{name:'Error',message:String(error),stack:null};if(seen.has(error))return{circular:true};seen.add(error);const out={name:error.name||'Error',message:error.message||String(error),stack:error.stack||null};if(error.cause!==undefined)out.cause=copyError(error.cause,seen);if(Array.isArray(error.errors))out.errors=Array.from(error.errors,e=>copyError(e,seen));return out;}
 const errorRecord=(stage,error)=>({stage,...copyError(error)});
 function snapshot(){return {phase,receivedBytes,retainedBytes,unretainedBytes,discardedBytes,bufferedBytes,chunkCount,stopRequested,terminalSeen,saveStarted,closeAttempted,saveClosed,fileMayContainBytes:closeAttempted,uncertain,failures:JSON.parse(JSON.stringify(failures)),limits:{...LIMITS},scope:'Complete exported-file bound only; browser temporary storage is not bounded. discardedBytes means released in-memory chunks, not proof that file bytes were never written.'};}
 function remember(stage,error){failures.push(errorRecord(stage,error));if(closeAttempted)uncertain=true;}
 function notify(){if(notifying)return;notifying=true;let bad=false;try{onState(snapshot());}catch(error){remember('status callback',error);bad=true;}finally{notifying=false;}if(bad){if(terminalSeen)phase=uncertain?'uncertain':'failed';else requestStop('status failure');}}
 function clearTimers(){for(const timer of [softTimer,hardTimer])if(timer!==null)try{clearTimer(timer);}catch(error){remember('clear timer',error);}softTimer=hardTimer=null;}
 function elapsed(){const t=now();if(!Number.isFinite(t)||t<startedAt)throw new Error('Recording clock is invalid or moved backwards');return t-startedAt;}
 function finish(){
  clearTimers();if(failures.length)discardedBytes+=bufferedBytes;bufferedBytes=0;chunks.length=0;for(const [track,handler]of endedHandlers.splice(0))try{track.removeEventListener('ended',handler);}catch(error){remember('track listener cleanup',error);}phase=uncertain?'uncertain':failures.length?'failed':'saved';notify();
  if(!terminalCalled){terminalCalled=true;try{onTerminal(snapshot());}catch(error){remember('terminal callback',error);uncertain=true;phase='uncertain';notify();}}
 }
 function requestStop(reason){
  if(terminalSeen||stopRequested||phase==='new')return false;
  stopRequested=true;phase='stopping';notify();
  try{if(recorder.state!=='inactive')recorder.stop();}catch(error){remember('stop '+reason,error);uncertain=true;phase='uncertain';notify();}
  return true;
 }
 function abort(reason){
  remember('abort',reason!==null&&typeof reason==='object'?reason:new Error(String(reason)));
  discardedBytes+=bufferedBytes;bufferedBytes=0;chunks.length=0;
  if(phase==='new'){terminalSeen=true;finish();return;}
  if(terminalSeen){if(uncertain)phase='uncertain';else if(saveClosed)phase='failed';notify();return;}
  requestStop('abort');notify();
 }
 recorder.ondataavailable=event=>{
  const data=event?.data;
  if(!(data instanceof BlobType)||!Number.isSafeInteger(data.size)||data.size<0){abort(new Error('Invalid recording chunk'));return;}
  if(!data.size)return;
  chunkCount++;
  if(!Number.isSafeInteger(receivedBytes+data.size)){abort(new Error('Recording byte counter overflow'));return;}
  receivedBytes+=data.size;
  if(phase==='new'){unretainedBytes+=data.size;abort(new Error('Data arrived before recording start'));return;}
  if(terminalSeen||failures.length){unretainedBytes+=data.size;if(terminalSeen)abort(new Error('Late data after terminal stop'));notify();return;}
  if(retainedBytes+data.size>LIMITS.maxBytes){unretainedBytes+=data.size;abort(new Error('Recording exceeded the complete 4 MiB export limit; no prefix is accepted'));notify();return;}
  chunks.push(data);retainedBytes+=data.size;bufferedBytes+=data.size;
  if(retainedBytes>=LIMITS.softBytes)requestStop('soft byte limit');
  notify();
 };
 recorder.onerror=event=>abort(event?.error||new Error('Unknown MediaRecorder error'));
 async function finalize(){
  try{
   if(elapsed()>LIMITS.deadlineMs)throw new Error('Final recording exceeded the 180 second wall envelope');
   if(failures.length)return;
   if(!chunks.length)throw new Error('No recording data was produced');
   const blob=new BlobType(chunks,{type:recorder.mimeType||'video/webm'});
   if(blob.size!==retainedBytes||blob.size>LIMITS.maxBytes)throw new Error('Final complete Blob size mismatch');
   const current=await fileHandle.getFile();
   if(current.size!==0||current.lastModified!==emptyFile.lastModified)throw new Error('Selected file changed during recording; no overwrite attempted');
   if(failures.length)return;
   phase='writing';saveStarted=true;notify();
   writable=await fileHandle.createWritable({keepExistingData:false});
   if(failures.length)return;
   await writable.write(blob);
   if(failures.length)return;
   closeAttempted=true;await writable.close();saveClosed=true;
   if(failures.length)return;
   const saved=await fileHandle.getFile();
   if(saved.size!==blob.size)throw new Error('Saved file size does not match the complete Blob');
  }catch(error){remember(closeAttempted?'file close or verification':'finalization',error);if(closeAttempted)uncertain=true;}
  finally{
   if(writable&&!closeAttempted)try{await writable.abort();}catch(error){remember('file abort',error);uncertain=true;}
   finish();
  }
 }
 recorder.onstop=()=>{
  if(terminalSeen){abort(new Error('Duplicate terminal stop event'));return;}
  if(!stopRequested)remember('stop event',new Error('Recorder stopped without a requested finite stop'));
  terminalSeen=true;phase='stopping';clearTimers();notify();void finalize();
 };
 for(const track of tracks){const handler=()=>{if(!terminalSeen)abort(new Error('Capture '+track.kind+' track ended before terminal stop'));};track.addEventListener('ended',handler);endedHandlers.push([track,handler]);}
 function start(){
  if(phase!=='new')throw new Error('Recording session already used');
  startedAt=now();if(!Number.isFinite(startedAt))throw new Error('Invalid recording clock');
  phase='recording';notify();
  try{
   if(failures.length)throw new Error('Recording status initialization failed');
   softTimer=setTimer(()=>requestStop('soft time limit'),LIMITS.stopMs);
   hardTimer=setTimer(()=>abort(new Error('Recording terminal deadline exceeded')),LIMITS.deadlineMs);
   recorder.start(LIMITS.timesliceMs);
  }catch(error){remember('start',error);if(recorder.state==='inactive'){terminalSeen=true;finish();}else requestStop('start failure');}
  return snapshot();
 }
 return Object.freeze({start,stop:()=>requestStop('user'),abort,snapshot});
}
return Object.freeze({create,limits:LIMITS});
});
