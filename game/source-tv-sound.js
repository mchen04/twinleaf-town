/* Host-owned native TV state. Explicit30Hz logical grants are an adapter clock,
 * not browser/source wall-clock parity. No TV worklet or PCM subscriber exists.
 * Output readiness/mute never owns or advances players. Existing effect worklet
 * groups3/4 remain separate, masksd800 disjoint from TV07ff/07f5. Max coexistence:
 * TV17 + effects3 =20 logical tracks;2+2=4 drivers, within32/16. No general
 * cross-instance logical allocator/global arbitration is claimed. */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f(require('./source-effect-sequence.js'),require('./source-effect-carriers.js'),require('./source-tv-data.js'),require('./source-default-music-data.js'),require('./source-rival-audio-data.js'));else r.SourceTvSound=f(r.SourceEffectSequence,r.SourceEffectCarriers,r.SourceTvData,r.SourceDefaultMusicData,r.SourceRivalAudioData);})(typeof globalThis!=='undefined'?globalThis:this,function(Sequence,Carriers,Data,MusicData,RivalData){
'use strict';
const CLOCK=33514000,PERIOD=174592,CARRIER=16756991;
const clone=x=>JSON.parse(JSON.stringify(x));
function need(ok,m){if(!ok)throw Error('SourceTvSound: '+m);}
function create(data,options={},captureCapable=false,musicCapable=false,rivalCapable=false){
 need(!rivalCapable||(musicCapable&&RivalData?.schema==='exact-rival-story-audio-v1'),'rival story dependencies');
 need(options.owner&&typeof options.isOwnerCurrent==='function','concrete owner required');
 const owner=options.owner,epoch=options.epoch;need(Number.isSafeInteger(epoch)&&epoch>0,'epoch');
 // Explicit no-volume-override source domain; source PlaySE/Sound mode1 divides
 // volume by5 and is not silently treated as the ordinary mode0 context.
 need(options.soundMode===0,'ordinary sound mode0 required');
 const fieldMusic=options.fieldMusic===true;need(!fieldMusic||rivalCapable,'field music requires rival/default owner');
 const engine=Sequence.create(data,{tv:true,defaultMusic:musicCapable,rivalStory:rivalCapable,fieldMusic});
 const carrier=Carriers.create({waves:{...data.waves,...Data.waves,...(musicCapable?MusicData.waves:{}),...(rivalCapable?RivalData.waves:{})},tv:true,defaultMusic:musicCapable,rivalStory:rivalCapable,sampleRate:48000});
 let retired=false,fault=null,mainVisit=-1,clock30=0,controlRemaining=0,carrierRemainder=0,periodic=0,commandPasses=0,completions=[];
 let selectedState31=null,fieldSelection=null;
 let storyPhase='default',storySerial=0,storyFade=null,storyFadeRemaining=0;
 let fieldTransition=null,fieldTransitionSerial=0,fieldFadeRemaining=0,lastFieldTransition=null;
 let bgm=null,fanfare=null,defaultRequest=null,broadcastStopping=null,waitPolls=0,waitSerial=0,waitDone=false,heapSaved=false,outputIntent={enabled:false,ready:false};
 // Capture is a pull-only observation of this same service, never a clock owner.
 // The existing carrier render() samples AFTER advance. Preserve its grid exactly:
 // sample ordinal j is observed at floor(j*CARRIER/48000) carrier cycles. The
 // source control pass keeps its original boundary, not the worklet renderer's
 // output-frame-quantized boundary. This is not native DAC/resampler equivalence.
 const CAPTURE_RATE=48000,CAPTURE_MAX_FRAMES=1601;
 let observedCycles=0,observedFrames=0,captureSerial=0,captureToken=null,pendingCapture=null,buildingCapture=null;
 function captureState(){return {capable:captureCapable,rate:CAPTURE_RATE,format:'interleaved-float32',clockOwner:'existing-host-main',liveOutput:false,enabled:!!captureToken,serial:captureSerial,observedCycles,observedFrames,pending:pendingCapture&&{visit:pendingCapture.visit,firstFrame:pendingCapture.firstFrame,frames:pendingCapture.frames,complete:pendingCapture.complete},retired};}
 function captureCurrent(t){need(captureCapable&&current(),'capture owner replaced');need(t===captureToken&&t!==null,'exact capture token');}
 function beginCapture(){check();need(captureCapable&&!captureToken&&!pendingCapture,'capture lifetime');captureToken=Object.freeze({epoch,serial:++captureSerial,firstFrame:observedFrames,sampleRate:CAPTURE_RATE});return captureToken;}
 function takeCapture(t){captureCurrent(t);need(pendingCapture!==null,'no undrained capture block');const b=pendingCapture;pendingCapture=null;return Object.freeze({epoch,serial:t.serial,visit:b.visit,firstFrame:b.firstFrame,frames:b.frames,sampleRate:CAPTURE_RATE,channels:2,format:'interleaved-float32',complete:b.complete,samples:b.samples.subarray(0,b.frames*2)});}
 function endCapture(t){check();captureCurrent(t);need(!pendingCapture,'undrained capture block');captureToken=null;return captureState();}
 function advanceCarrier(cycles){
  if(!captureCapable){completions.push(...carrier.advanceCycles(cycles));return;}
  const end=observedCycles+cycles;need(Number.isSafeInteger(end)&&Number.isSafeInteger((end+1)*CAPTURE_RATE),'capture clock bound');
  if(!buildingCapture){completions.push(...carrier.advanceCycles(cycles));observedCycles=end;observedFrames=Math.floor(((end+1)*CAPTURE_RATE-1)/CARRIER);return;}
  while(observedCycles<end){
   const next=Math.floor((observedFrames+1)*CARRIER/CAPTURE_RATE);need(next>observedCycles,'capture sample grid');
   const part=Math.min(end,next)-observedCycles;completions.push(...carrier.advanceCycles(part));observedCycles+=part;
   if(observedCycles===next){const mixed=carrier.sample();need(mixed.length===2&&mixed.every(Number.isFinite),'finite stereo observation');need(buildingCapture.frames<CAPTURE_MAX_FRAMES,'capture block capacity');const n=buildingCapture.frames*2;buildingCapture.samples[n]=mixed[0];buildingCapture.samples[n+1]=mixed[1];buildingCapture.frames++;observedFrames++;}
  }
 }
 const trace=[];function emit(type,details={}){const e={type,epoch,mainVisit,...details};trace.push(e);if(trace.length>256)trace.shift();}
 function current(){if(retired)return false;const ok=options.isOwnerCurrent(owner)===true;return ok&&!retired;}
 function check(){need(!fault,'faulted');need(current(),'owner replaced');}
 function tokenStatus(t){need(t&&t.epoch===epoch,'status epoch');const status=engine.status(t.native);need(!status.pending||status.admitted,'invalid pending status');return status;}
 function pass(p){const x=engine.arm7Pass({periodic:p,hardwareCompletions:completions});completions=[];carrier.applyAll(x.appliedRegisters);for(const c of x.masterPanCommands)carrier.setMasterPan(c.value);if(p)periodic++;else commandPasses++;engine.drainEvents();return x;}
 function accepted(id,handle){const t=engine.requestStart(id,{handle});need(t.accepted,'source admission refused');return Object.freeze({epoch,native:Object.freeze(t)});}
 const EFFECT_IDS=Object.freeze([1500,1501,1504,1533,1537,1539,1541,1543,1563]);
 let effectRequests=0,effectSerial=0,fieldMapId=null,mapContinuations=0;
 function playEffect(id){
  check();need(Number.isSafeInteger(id)&&(EFFECT_IDS.includes(id)||(rivalCapable&&id===1538)),'supported ordinary effect ID');
  need(effectRequests<16,'effect requests per main grant');
  const native=engine.requestStart(id);need(native.accepted,'source effect admission');effectRequests++;effectSerial++;
  emit('effect-admitted',{id,serial:effectSerial,handle:native.handle,group:native.group,sequenceGeneration:native.sequenceGeneration,driverSlot:native.driverSlot});
  return Object.freeze({epoch,native:Object.freeze(native)});
 }
 function continueMap(value){
  check();need(musicCapable,'native default-music continuation');
  const d=Object.getOwnPropertyDescriptors(value||{});
  need(Object.keys(d).sort().join(',')==='fromMapId,rtcHour,scope,toMapId'&&Object.values(d).every(x=>Object.hasOwn(x,'value')),'own map-continuation data');
  const from=d.fromMapId.value,to=d.toMapId.value,hour=d.rtcHour.value;
  need(d.scope.value==='source-same-music-map'&&Number.isSafeInteger(from)&&Number.isSafeInteger(to)&&Number.isSafeInteger(hour)&&hour>=0&&hour<24,'bounded map-continuation context');
  const id=hour>=20||hour<4?1033:1004;
  if(!((from===415&&to===414)||(from===414&&to===411)||(rivalCapable&&((from===411&&to===412)||(from===412&&to===413)||(from===413&&to===412)||(from===412&&to===411))))||(rivalCapable&&storyPhase!=='default')||fieldMapId!==from||!defaultRequest||!waitDone||selectedState31!==id||defaultRequest.id!==id||!bgm)return false;
  const status=tokenStatus(bgm);need(status.matching&&status.active&&!status.pending&&status.token.effectId===id,'continuing native BGM owner');
  fieldMapId=to;mapContinuations++;emit('same-music-map-continued',{from,to,id,selectedState31,sequenceGeneration:bgm.native.sequenceGeneration});return true;
 }
 // Closed ordinary branch: fanfare has resumed, no native pause/heap branch,
 // suppression5 or resource15/16 producer exists in this optional service.
 // These APIs do not accept arbitrary native state or claim flag11=1 support.
 const FIELD_LINKS=Object.freeze(['415:414','414:415','414:411','411:414','411:412','412:411','412:413','413:412','411:416','416:411','411:417','417:411']);
 function fieldReady(){check();need(fieldMusic&&waitDone&&!heapSaved&&defaultRequest&&fieldSelection&&storyPhase==='default'&&bgm,'normal unpaused field music branch');activeBgm(defaultRequest.id);}
 function fieldContext(value){
  const d=Object.getOwnPropertyDescriptors(value||{});need(Object.keys(d).sort().join(',')==='fromMapId,rtcHour,scope,toMapId'&&Object.values(d).every(x=>Object.hasOwn(x,'value')),'own field transition data');
  const from=d.fromMapId.value,to=d.toMapId.value,hour=d.rtcHour.value;need(d.scope.value==='source-field-music-transition'&&Number.isSafeInteger(from)&&Number.isSafeInteger(to)&&FIELD_LINKS.includes(from+':'+to)&&Number.isSafeInteger(hour)&&hour>=0&&hour<24,'exact field link and RTC');
  return {from,to,hour,id:hour>=20||hour<4?1033:1004};
 }
 function fieldToken(token){fieldReady();need(fieldTransition&&token===fieldTransition.token,'exact field transition owner');return fieldTransition;}
 function prepareFieldTransition(value){
  fieldReady();need(!fieldTransition,'one field transition');const c=fieldContext(value);need(fieldMapId===c.from,'field departure map');
  const prior=bgm,fade=prior.native.effectId!==c.id;need(fieldFadeRemaining===0,'no preceding field fade');
  if(fade)need(engine.requestFieldFade(prior.native),'source destination fade');
  const token=Object.freeze({epoch,serial:++fieldTransitionSerial,from:c.from,to:c.to});
  fieldFadeRemaining=fade?40:0;fieldTransition={token,from:c.from,to:c.to,preparedId:c.id,preparedHour:c.hour,prior:prior.native,fade,loaded:false};
  emit('field-music-prepared',{...fieldTransition,remaining:fieldFadeRemaining});return token;
 }
 function fieldFadeFinished(token){fieldToken(token);return fieldFadeRemaining===0;}
 function loadFieldTransition(token,to){
  const x=fieldToken(token);need(!x.loaded&&to===x.to&&fieldMapId===x.from,'exact field location handoff');x.loaded=true;fieldMapId=to;emit('field-music-location',{serial:token.serial,from:x.from,to});return true;
 }
 function finishFieldTransition(token,value){
  const x=fieldToken(token),d=Object.getOwnPropertyDescriptors(value||{});
  need(x.loaded&&fieldMapId===x.to&&fieldFadeRemaining===0,'destination waits real field fade');
  need(Object.keys(d).sort().join(',')==='mapId,rtcHour,scope'&&Object.values(d).every(v=>Object.hasOwn(v,'value')),'own destination selection');
  const hour=d.rtcHour.value;need(d.scope.value==='source-destination-mode4'&&d.mapId.value===x.to&&Number.isSafeInteger(hour)&&hour>=0&&hour<24,'fresh destination RTC');
  const id=hour>=20||hour<4?1033:1004,prior=bgm,same=prior.native.effectId===id;
  need(MusicData.sequences[id].bank_id===1001,'destination selected bank');selectedState31=id;
  // Native AD8C clears mode selector, writes31, then mode4. Same-ID/unpaused
  // returns before stops, including when an earlier fade has reached zero.
  emit('field-mode4-selected',{selectedState31,mode20:4,mode21:0,resource13:0,player7Mask:0x07ff,reverb:0,scope:'closed ordinary subset; outer mode4 writes precede inner same-ID return'});
  if(!same){
   engine.requestStop('group:7');for(const group of [3,4])engine.requestStop('group:'+group);
   need(engine.requestPause(prior.native,false),'source unpause before StopSeqAll');engine.stopAll();
   bgm=accepted(id,'tv-bgm');
  }
  defaultRequest={...defaultRequest,id,selectedState31,bankOverride:1001,requestContext:{mapId:x.to,rtcHour:hour,scope:'source-destination-mode4',id}};
  lastFieldTransition={...clone(x),arrivedId:id,arrivedHour:hour,same,sequenceGeneration:bgm.native.sequenceGeneration,remaining:fieldFadeRemaining,scope:'normal state5=0/flag11=0/resource15=16=0; no pending1152'};
  fieldTransition=null;emit('field-music-arrived',lastFieldTransition);return bgm;
 }
 function startBroadcast(){check();need(!bgm&&!fanfare,'broadcast lifetime');bgm=accepted(1030,'tv-bgm');if(musicCapable)selectedState31=1030;emit('broadcast-admitted');return bgm;}
 function setBroadcastVolume(value){check();need(value===50&&bgm,'level912 volume50');const status=tokenStatus(bgm);need(status.matching&&status.active&&!status.pending,'source broadcast already running');need(engine.requestVolume(bgm.native,value),'BGM owner');emit('broadcast-volume',{value});}
 function playFanfare(){check();need(bgm&&!fanfare,'fanfare lifetime');const s=tokenStatus(bgm);need(s.matching&&s.active&&!s.pending,'broadcast must have started');
  // Native PlaySound pauses then saves heap then starts player2. All fixed
  // input/capacity validation already completed at construction.
  need(engine.requestPause(bgm.native,true),'pause owner');heapSaved=true;fanfare=accepted(1154,'tv-fanfare');waitPolls=15;waitDone=false;emit('fanfare-admitted',{waitPolls});return fanfare;
 }
 function pollFanfare(t){check();need(t===fanfare&&!waitDone,'owned wait token');waitSerial++;const status=tokenStatus(t);
  if(status.pending||status.active||status.admitted){emit('wait-player2',{waitSerial,status});return true;}
  need(status.matching,'player2 generation replaced');if(waitPolls){waitPolls--;emit('wait-tail-poll',{waitSerial,remaining:waitPolls});return true;}
  engine.requestStop(t.native);need(heapSaved,'saved sound heap lifetime');heapSaved=false;need(engine.requestPause(bgm.native,false),'resume owner');waitDone=true;emit('wait-complete',{waitSerial});return false;
 }
 function context(value,scope){
  need(value&&typeof value==='object','explicit field/RTC context');const d=Object.getOwnPropertyDescriptors(value);need(Object.keys(d).sort().join(',')==='mapId,rtcHour,scope'&&Object.values(d).every(x=>Object.hasOwn(x,'value')),'own field/RTC data');
  const c={mapId:d.mapId.value,rtcHour:d.rtcHour.value,scope:d.scope.value};need(c.scope===scope&&c.mapId===415&&Number.isSafeInteger(c.rtcHour)&&c.rtcHour>=0&&c.rtcHour<24,'bounded map415/RTC context');return {...c,id:c.rtcHour>=20||c.rtcHour<4?1033:1004};
 }
 function recordFieldSelection(value){check();need(musicCapable&&selectedState31===1030&&!fieldSelection&&bgm&&!fanfare,'field mode4 selection lifetime');const c=context(value,'source-field-mode4-selection'),s=tokenStatus(bgm);need(s.matching&&s.active&&s.token.effectId===1030,'preserved broadcast required');selectedState31=c.id;fieldSelection=c;fieldMapId=415;emit('field-mode4-selected',{selectedState31,playing:1030,bank:1001});return clone(c);}
 function startDefault(request){
  need(waitDone&&!defaultRequest&&fieldSelection&&[1004,1033].includes(selectedState31),'field-selection provenance before default');
  const d=Object.getOwnPropertyDescriptors(request||{});need(Object.keys(d).sort().join(',')==='context,id,scope'&&Object.values(d).every(x=>Object.hasOwn(x,'value')),'own default request data');
  const c=context(d.context.value,'source-script-default'),id=d.id.value;need(d.scope.value==='source-default-request'&&Number.isSafeInteger(id)&&id===c.id,'source requested music/RTC');
  // State31 is written at field init before mode4 equality short-circuits.
  // Opcode0052 recomputes requested ID without changing state31. Rollover may
  // differ; both exact INFO records select bank1001. Same group1/handle0 owner
  // performs equal-priority replacement, with INFO125/90 and no invented fade.
  need(MusicData.sequences[selectedState31].bank_id===1001&&MusicData.sequences[id].bank_id===1001,'selected INFO bank');
  const prior=bgm,next=accepted(id,'tv-bgm');broadcastStopping=prior;bgm=next;defaultRequest={id,selectedState31,bankOverride:1001,fieldSelection:clone(fieldSelection),requestContext:c,accepted:true,nativePlayerImplemented:true,sourceCarrierImplemented:true,outputImplemented:false};emit('default-bgm-native',{...defaultRequest});return true;
 }
 function defaultBgm(request){check();if(musicCapable)return startDefault(request);need(waitDone&&!defaultRequest&&request&&[1004,1033].includes(request.id)&&request.scope==='source-default-request'&&typeof request.commit==='function','explicit source-selected default BGM handoff');
  // The existing recorded loop is not relabeled as native1004/1033. Caller must
  // supply the source RTC-selected consumer; this adapter never invents one.
  const acceptedHandoff=request.commit({id:request.id,owner,epoch});check();need(acceptedHandoff===true,'default BGM consumer did not accept');need(engine.requestStop(bgm.native)||!tokenStatus(bgm).active,'broadcast stop');broadcastStopping=bgm;bgm=null;defaultRequest={id:request.id,accepted:true,nativePlayerImplemented:false,outputImplemented:false};emit('default-bgm-handoff',{...defaultRequest});return true;
 }
 function storyReady(){check();need(!fieldTransition,'field transition owns music');need(rivalCapable&&waitDone&&fieldSelection&&defaultRequest&&[411,412,413].includes(fieldMapId),'rival ordinary field lifetime');}
 function activeBgm(id){need(bgm,'recorded BGM required');const s=tokenStatus(bgm);need(s.matching&&s.active&&!s.pending&&s.token.effectId===id,'active recorded BGM generation');return s;}
 function stopStoryBgm(){
  storyReady();need(storyPhase==='default'||(storyPhase==='rival'&&storyFade&&storyFadeRemaining===0),'source story StopBgm order');
  activeBgm(storyPhase==='default'?defaultRequest.id:1139);const prior=bgm;need(engine.requestStop(prior.native),'recorded BGM stop');
  bgm=null;storyPhase=storyPhase==='default'?'stopped-default':'stopped-rival';emit('story-bgm-stopped',{id:prior.native.effectId,sequenceGeneration:prior.native.sequenceGeneration,phase:storyPhase});return true;
 }
 function startRivalMusic(){
  storyReady();need(storyPhase==='stopped-default'&&!bgm,'source 2042 stop before player7');
  bgm=accepted(1139,'group:7');storyPhase='rival';storySerial++;storyFade=null;storyFadeRemaining=0;
  emit('rival-music-admitted',{nativeHandle:7,bank:1000,id:1139,sequenceGeneration:bgm.native.sequenceGeneration,storySerial});return bgm;
 }
 function beginStoryFade(value){
  storyReady();const d=Object.getOwnPropertyDescriptors(value||{});need(Object.keys(d).sort().join(',')==='duration,target'&&Object.values(d).every(x=>Object.hasOwn(x,'value'))&&d.target.value===0&&d.duration.value===30,'source 2043 fade operands');
  need(storyPhase==='rival'&&!storyFade,'one source fade per rival owner');activeBgm(1139);
  need(engine.requestMoveVolume(bgm.native,0,30),'rival SDK fader');storyFadeRemaining=30;storyFade=Object.freeze({epoch,storySerial,native:bgm.native});
  emit('story-fade-started',{duration:30,target:0,storySerial,sequenceGeneration:bgm.native.sequenceGeneration});return storyFade;
 }
 function storyFadeFinished(token){storyReady();need(token===storyFade&&token!==null&&storyPhase==='rival','exact source fade token');activeBgm(1139);return storyFadeRemaining===0;}
 function restartFieldDefault(value){
  storyReady();need(storyPhase==='stopped-rival'&&!bgm&&storyFade&&storyFadeRemaining===0,'source 2043 explicit stop before default');
  const d=Object.getOwnPropertyDescriptors(value||{});need(Object.keys(d).sort().join(',')==='mapId,rtcHour,scope'&&Object.values(d).every(x=>Object.hasOwn(x,'value')),'own story default context');
  const hour=d.rtcHour.value,map=d.mapId.value;need(d.scope.value==='source-story-default'&&map===fieldMapId&&[411,413].includes(map)&&Number.isSafeInteger(hour)&&hour>=0&&hour<24,'source story field/RTC');
  const id=hour>=20||hour<4?1033:1004;need([1004,1033].includes(selectedState31)&&MusicData.sequences[selectedState31].bank_id===1001&&MusicData.sequences[id].bank_id===1001,'retained selected bank for fresh default');
  bgm=accepted(id,'tv-bgm');defaultRequest={...defaultRequest,id,selectedState31,bankOverride:1001,requestContext:{mapId:map,rtcHour:hour,scope:'source-story-default',id},storySerial};storyPhase='default';
  emit('story-default-restarted',{id,selectedState31,bankOverride:1001,storySerial,sequenceGeneration:bgm.native.sequenceGeneration});return bgm;
 }
 function setMono(value){check();need(typeof value==='boolean','mono boolean');engine.requestMasterPan(value?64:-1);emit('mono-intent',{value});}
 function setOutputIntent(value){check();need(value&&typeof value.enabled==='boolean'&&typeof value.ready==='boolean','explicit output intent');outputIntent={enabled:value.enabled,ready:value.ready};return clone(outputIntent);}
 function main(visit){check();need(Number.isSafeInteger(visit)&&visit>mainVisit,'unique monotonic main visit');
  // Backpressure and bounded allocation precede consumption of the caller grant.
  if(captureCapable){need(!pendingCapture,'undrained capture block');buildingCapture=captureToken?{visit,firstFrame:observedFrames,frames:0,complete:false,samples:new Float32Array(CAPTURE_MAX_FRAMES*2)}:null;}
  mainVisit=visit;
  try{
   if(fieldMusic&&fieldFadeRemaining>0){need(waitDone&&!heapSaved,'source field fade player2 gate');fieldFadeRemaining--;}
   if(rivalCapable&&storyFadeRemaining>0){need(waitDone,'source fade player2 gate');storyFadeRemaining--;}
   if(engine.arm9Main())pass(false);
   // Integer rational grants retain phase across every mute/readiness change.
   clock30+=CLOCK;const clocks=Math.floor(clock30/30);clock30%=30;let left=clocks;
   while(left>0){if(controlRemaining===0){pass(true);controlRemaining=PERIOD;}const n=Math.min(left,controlRemaining);carrierRemainder+=n*CARRIER;const cycles=Math.floor(carrierRemainder/CLOCK);carrierRemainder%=CLOCK;if(cycles)advanceCarrier(cycles);controlRemaining-=n;left-=n;}
   if(buildingCapture){buildingCapture.complete=true;pendingCapture=buildingCapture;buildingCapture=null;}
   effectRequests=0;emit('main',{periodic,commandPasses});return status();
  }catch(e){if(buildingCapture){pendingCapture=buildingCapture;buildingCapture=null;}fault={name:e.name,message:e.message,mainVisit};throw e;}
 }
 function status(){return clone({...(fieldMusic?{fieldMusicCapable:true,fieldTransition,fieldFadeRemaining,lastFieldTransition}:{}),epoch,retired,fault,mainVisit,periodic,commandPasses,controlRemaining,clock30,carrierRemainder,waitPolls,waitSerial,waitDone,heapSaved,outputIntent,tvOutputSubscriber:false,defaultRequest,broadcastStopping:broadcastStopping&&tokenStatus(broadcastStopping),bgm:bgm&&tokenStatus(bgm),fanfare:fanfare&&tokenStatus(fanfare),effectRequests,effectSerial,...(rivalCapable?{rivalStoryCapable:true,storyPhase,storySerial,storyFadeRemaining,storyFade}:{}),...(musicCapable?{defaultMusicCapable:true,selectedState31,fieldSelection,fieldMapId,mapContinuations}: {})});}
 function snapshot(){return {status:status(),engine:engine.snapshot(),carrier:carrier.snapshot(),pendingHardwareCompletions:clone(completions)};}
 function retire(){if(retired)return false;retired=true;captureToken=null;fieldTransition=null;fieldFadeRemaining=0;engine.stopAll();engine.arm9Main();pass(false);bgm=null;fanfare=null;heapSaved=false;emit('retired');return true;}
 const api={playEffect,startBroadcast,setBroadcastVolume,playFanfare,pollFanfare,defaultBgm,setMono,setOutputIntent,main,status,snapshot,retire,drainTrace:()=>trace.splice(0)};
 if(fieldMusic)Object.assign(api,{prepareFieldTransition,fieldFadeFinished,loadFieldTransition,finishFieldTransition});
 if(musicCapable)Object.assign(api,{recordFieldSelection,continueMap});
 if(rivalCapable)Object.assign(api,{stopStoryBgm,startRivalMusic,beginStoryFade,storyFadeFinished,restartFieldDefault});
 if(captureCapable)Object.assign(api,{beginCapture,takeCapture,endCapture,captureStatus:captureState});return Object.freeze(api);
}
return Object.freeze({create,createCapture:(data,options)=>create(data,options,true),createDefaultMusic:(data,options)=>create(data,options,false,true),createDefaultMusicCapture:(data,options)=>create(data,options,true,true),createRivalStory:(data,options)=>create(data,options,false,true,true),createRivalStoryCapture:(data,options)=>create(data,options,true,true,true),CLOCK,PERIOD,CARRIER});
});
