/* Source-derived native assets with documented diagnostic rendering and mock tasks. */
(function () {
'use strict';
// Check every required module before any dependency dereference or listener setup.
if(!window.TwinleafBoot){const status=document.getElementById('boot-status');if(status)status.textContent='Startup blocked: startup diagnostics did not load. Reload this page. Cause not established.';const record=document.getElementById('record-button');if(record)record.disabled=true;return;}
if(!window.TwinleafBoot.begin([
 ['BoundedRecording',x=>x&&typeof x.create==='function'&&x.limits?.maxBytes===4194304],
 ['SourceRivalScripts',x=>x&&typeof x.createController==='function'],['SourceRivalScriptData',x=>x&&x.schema==='source-rival-scenes-v1'],
 ['SourceTvRuntime',x=>x&&typeof x.create==='function'],['SourceIntroTvArt',x=>x&&typeof x.load==='function'],['SourceIntroTvData',x=>x&&typeof x==='object'],
 ['SourceWorldData',x=>x&&Array.isArray(x.headers)&&x.scenes&&x.headers.some(h=>h.header===411)],['OriginalDialogue',x=>x&&typeof x.create==='function'],
 ['SourceOptions',x=>x&&typeof x.createController==='function'&&typeof x.createDisplayFade==='function'],['SourceOptionsArt',x=>x&&typeof x.render==='function'],['SourceOptionsArtData',x=>x&&x.schema==='source-options-native2d-v1'],
 ['SourceExitIndicator',x=>x&&typeof x.create==='function'],['SourceFieldEffectTransaction',x=>x&&typeof x.create==='function'],['SourceNativePlayerCache',x=>x&&typeof x.createFresh==='function'], ['SourceFieldMenu',x=>x&&typeof x.createController==='function'],['SourceMenuArt',x=>x&&typeof x.loadAssets==='function'&&typeof x.render==='function'],['SourceMenuArtData',x=>x&&x.format==='source-menu-native2d-v1'&&x.commit==='b623abef1b4dfe204ca50aab42447ac00c134290'],
 ['SourceReferenceDialogueData',x=>x&&x.schema==='source-reference-dialogue-frame-v1'&&x.commit==='b623abef1b4dfe204ca50aab42447ac00c134290'&&x.frameId===17&&x.frame?.width===256&&x.frame?.height===48&&x.arrows?.length===3&&x.arrows.every((a,i)=>a.phase===i&&a.width===16&&a.height===16)],['SourceDirectTalk',x=>x&&typeof x.createController==='function'],['SourceHomeScripts',x=>x&&typeof x.createController==='function'],['SourceExclamationNative',x=>x&&typeof x.createManager==='function'],
 ['TownWorld',x=>x&&typeof x.createNPCs==='function'],['TownPresentation',x=>x&&typeof x.transitionOpacity==='function'],
 ['FieldText',x=>x&&x.data&&x.data.images&&typeof x.pages==='function'],['TextReveal',x=>x&&typeof x.create==='function'],
 ['SourceBoardEntry',x=>x&&typeof x.step==='function'&&typeof x.fromMotion==='function'&&typeof x.PhysicalInput==='function'],
 ['SourceBoardHost',x=>x&&typeof x.composite==='function'&&typeof x.resolve==='function'],['SourceBoardController',x=>x&&typeof x.Controller==='function'],['SourceBoardInput',x=>x&&typeof x.KeyEdges==='function'],['SourceBoardFieldSequence',x=>x&&typeof x.step==='function'],['SourceBoardData',x=>x&&x.records&&x.records.length===3],['SourceBoardSelector',x=>x&&typeof x.select==='function'],['SourceBoardText',x=>x&&typeof x.layout==='function'],['SourceBoardConsumer',x=>x&&typeof x.consume==='function'],['SourceBoardRaster',x=>x&&typeof x.render==='function'],['SourceBoardAssets',x=>x&&x.schema==='source-board-assets-v1'],
 ['SourceMapNamePopup',x=>x&&typeof x.create==='function'],['SourceMapNamePopupData',x=>x&&x.headers&&x.panels&&x.panels['1']&&x.panels['1'].rgba.length===96*24*4],
 ['LightingPreview',x=>x&&typeof x.create==='function'&&typeof x.parse==='function'],['PlayerCollision',x=>x&&typeof x.inputReady==='function'&&typeof x.hasCollision==='function'&&typeof x.objectTalk==='function'],['PlayerMotion',x=>x&&typeof x.request==='function'&&typeof x.tick==='function'&&typeof x.frame==='function'&&typeof x.reserves==='function'&&typeof x.forceSlowWalk==='function'],['SourceWarpPhases',x=>x&&typeof x.FieldTaskStack==='function'],['SourceWarp',x=>x&&typeof x.create==='function'],['SourceStaircaseData',x=>Array.isArray(x)&&x.length===4],['SourceStaircase',x=>x&&typeof x.create==='function'&&typeof x.admit==='function'],['SourceStaircaseHeightData',x=>x&&x.profile&&x.lands&&x.cases],['SourceStaircaseHeight',x=>x&&typeof x.sample==='function'],['WorldAnimationData',x=>x&&x.doors&&x.pond&&x.tv],['WorldAnimation',x=>x&&typeof x.create==='function'],['OriginalMotion',x=>x&&typeof x.createController==='function'],['OriginalPeople',x=>x&&x.data&&x.data.sprites&&typeof x.create==='function'&&typeof x.createMotion==='function'&&typeof x.targetAt==='function'&&typeof x.frame==='function'],['OriginalDialogueIntegration',x=>x&&x.metadata&&x.metadata.preview_profile&&typeof x.create==='function'],
 ['NativeSpriteData',x=>x&&x.player&&Array.isArray(x.player.frames)],['SourceImageData',x=>x&&typeof x==='object'],
 ['NativeLowerScreenData',x=>x&&x.schema==='source-no-poketch-4bpp-v1'&&x.width===256&&x.height===192],
 ['NativeLowerScreen',x=>x&&typeof x.render==='function'&&typeof x.inspect==='function'],
 ['ResidentCards',x=>x&&typeof x.createStableResidentCards==='function'],['TwinleafReferenceAudio',x=>x&&typeof x.base64==='string'],
 ['FieldEffects',x=>x&&typeof x.create==='function'],['FieldEffectData',x=>x&&x[1500]&&x[1539]],['SourceEffectData',x=>x&&x.schema==='twinleaf-source-effects-v1'&&x.sequences&&x.sequences[1500]&&x.sequences[1539]],
 ['TwinleafSourceData',x=>x&&x.mesh&&x.textureRGBA&&x.lighting&&x.edgeTopology&&x.edgeMarking],['SourceCpuRenderer',x=>x&&typeof x.create==='function'],
 ['SourceRenderer',x=>x&&x.math],['SourceLighting',x=>x&&typeof x.normalizeAuditTables==='function'],
 ['SourceNativeOrtho',x=>x&&typeof x.render==='function'&&typeof x.admitCamera==='function'],['SourceNativeBytes',x=>x&&typeof x.copy==='function'&&typeof x.sha256==='function'],
 ['SourceNativeActorAudit',x=>x&&x.records&&typeof x.verify==='function'],['SourceNativePerspectiveAudit',x=>x&&Array.isArray(x.records)&&typeof x.verify==='function'],['SourceNativePondAudit',x=>x&&typeof x.verifyTextures==='function'],['SourceNativeAnimationAudit',x=>x&&typeof x.verifyTextures==='function'],
 ['SourceNativeNeighborData',x=>x&&x.models&&x.selectionFixtures],['SourceNativeNeighborAudit',x=>x&&typeof x.create==='function'&&typeof x.snapshotData==='function'],['SourceNativeSeaData',x=>x&&x.metadata],['SourceNativeSeaAudit',x=>x&&typeof x.verify==='function'&&typeof x.copyDescriptor==='function'],['SourceNativeNeighborLoader',x=>x&&typeof x.create==='function'&&typeof x.describeSubmission==='function'],['SourceNativeAreaAnimationData',x=>x&&x.metadata],['SourceNativeAreaAnimationAudit',x=>x&&typeof x.copyTransfer==='function'],['SourceNativeAreaAnimation',x=>x&&typeof x.create==='function'],['SourceNativeFieldLifecycle',x=>x&&typeof x.create==='function'],
 ['SourceNativeBrowserAssets',x=>x&&x['member-0091']&&x['member-0069']],['SourceNativeHost',x=>x&&typeof x.actorKey==='function'&&typeof x.createAtlases==='function'&&typeof x.frameState==='function']
]))return;
const W = window.TownWorld, T = W.TILE, PM=window.PlayerCollision;
const canvas = document.getElementById('game'), screen = canvas.getContext('2d');
const meshSurface=document.createElement('canvas');meshSurface.width=256;meshSurface.height=192;
const P=window.TownPresentation,F=window.FieldText,R=window.TextReveal,O=window.OriginalPeople,DI=window.OriginalDialogueIntegration;
let lightingPreview=window.LightingPreview.create();
let mapNamePopup=window.SourceMapNamePopup.create(window.SourceMapNamePopupData);
let nativeRenderer=null,suspendedNativeRenderer=null,nativeRecoveryNeedsDraw=false,nativeRenderReady=false,rendererError=null,cameraFrame=0,rendererInitPromise=null,rendererReadyWaiter=null,rendererInitOwner=null,rendererInitGeneration=0;
screen.imageSmoothingEnabled=false;
const nativeAtlases={};
for(const [id,info] of Object.entries(window.NativeSpriteData)){const image=new Image();image.src=window.SourceImageData[info.file.split('/').pop()];nativeAtlases[id]=image;}
for(const [id,info]of Object.entries(O.data.sprites)){const image=new Image();image.src=info.data;nativeAtlases[id]=image;}
const fieldImages={};for(const [name,data]of Object.entries(F.data.images)){const image=new Image();image.src=data;fieldImages[name]=image;}
const referenceDialogueImages={frame:new Image(),arrows:window.SourceReferenceDialogueData.arrows.map(a=>{const image=new Image();image.src=a.dataUrl;return image;})};referenceDialogueImages.frame.src=window.SourceReferenceDialogueData.frame.dataUrl;
let menuOpen=false,dialogHitAreas=[],recorder=null,recordingPhase='idle',recordingAbort=null,recordingStartToken=null,frameScheduleFailed=false;
const $ = id => document.getElementById(id);
const dialogHeldKeys=new Set();let ignoreNextTextClick=false;
const sourceBoard=new window.SourceBoardController.Controller({fontData:F.data,compile:window.OriginalDialogue.compile,createPrinter:window.OriginalDialogue.create,textDelay:()=>window.SourceOptions.textDelay(openingProfile.options)}),sourceBoardEdges=new window.SourceBoardEntry.PhysicalInput();
let pendingSourceBoard=null,sourceBoardPreviousFocus=null,sourceBoardCancelReason=null;
const keys = new Set(), dirs = {up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
const keyDir = {ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};
let worldAnimation=window.WorldAnimation.create({areaManaged:true}),originalMotion=O.createMotion({seed:0}),logicAccumulator=0,resetPresentationPending=false,resetElapsedCaptured=false;
let sceneSnapshot=null,nativeFieldLifecycle=null,fieldGeneration=0,fieldView=null,lastNativeFrame=null,areaTextureHashes=Object.create(null),nativePlayerHeight=null,nativeHeightProfile=null;
let state, lastTime = 0, toastUntil = 0, previousFocus = null;
const defaultCanvasDescription=canvas.getAttribute('aria-label');
let openingProfile=null, savedDefaultProfile=null, profileSwitchPending=false, profileSwitchToken=null, openingInput=null, openingDispatching=false;
let liveSoundMethod=0,liveButtonMode=0,recordedMusicMatrix=null;
let audioIntent=0; // Shared latest intent across Audio, mute, and recording startup.
let audioContext=null,musicEnabled=false,musicBuffer=null,musicSource=null,audioGain=null,audioCapture=null,effectPlayer=null;
function freshState() {
  return {sourceInputStatus14:0,sourceBoardLastEntry:null,sourceBoardInputContract:'ordinary active non-single on-foot player; normal field dispatch; earlier story/encounter/action events excluded in this preview',boardObjects:window.SourceBoardData.records.map(b=>({key:b.key,eventIndex:b.eventId,x:b.localTile.x,z:b.localTile.z,positionYFx12:Math.round(W.heightAt(411,b.localTile.x,b.localTile.z)*4096),flag19Disabled:true})),scene:'town',houseId:null,roomHeader:null,warpLock:null,ownsRunningShoes:false,playerInput:{horizontal:-1,vertical:-1,queuedFacing:-1},player:{x:20,y:22,fromX:20,fromY:22,toX:20,toY:22,progress:1,facing:'up',step:0},npcs:W.createNPCs(),originals:O.create(),visited:new Set(),met:new Set(),tasks:[],dialog:null,clock:0,taskCompleted:false,transition:null,exitReservation:null,pendingOriginalId:null,pendingOriginalSession:null,originalFieldTaskCallback:0,playerHidden:false,cachedPlayerHidden:false,forcedWalk:null,dialogPage:0,bumpDirection:null,textPrinter:null,originalPrinter:null,originalScriptContinue:false,originalStory:{...JSON.parse(JSON.stringify(DI.metadata.preview_profile.state)),gender:1}};
}
function reset() {
 assertCaptureHostIdle();
  if(openingProfile){restartOpeningProfile();return;}
  // Public Reset cancels a pending entry using the existing token/UI boundary.
  if(profileSwitchPending)returnFromOpeningProfile();
  // An explicit ordinary reset may retain only the current initial-boot work.
  // Faulted/retrying/profile owners remain retired; this never starts a retry.
  const startupOwner=rendererInitOwner,boot=window.TwinleafBoot.snapshot();
  // Return's retained-default restoration is not an asset/factory Retry.
  const rebindRetained=!!startupOwner&&!profileSwitchPending&&rendererError===null&&boot.phase==='initializing'&&boot.retrying&&startupOwner.intent==='retained-default'&&startupOwner.profile===null&&startupOwner.generation===rendererInitGeneration&&startupOwner.state===state&&startupOwner.fieldGeneration===fieldGeneration&&!!startupOwner.retainedRenderer&&startupOwner.retainedRenderer===nativeRenderer;
  // A superseded asset Retry must release its gate without old work settling.
  // An already accepted first frame remains ready, even before retry finally runs.
  if(!profileSwitchPending&&boot.phase==='initializing'&&boot.retrying&&!rebindRetained)failRenderedFrame(new Error('Recovery cancelled by Reset'));
  const rebindStartup=!!startupOwner&&!profileSwitchPending&&rendererError===null&&boot.phase==='initializing'&&!boot.retrying&&startupOwner.profile===null&&startupOwner.generation===rendererInitGeneration&&startupOwner.state===state&&startupOwner.fieldGeneration===fieldGeneration;
  cancelSourceBoard('reset');mapNamePopup.cancel();
  if(suspendedNativeRenderer){suspendedNativeRenderer.dispose();suspendedNativeRenderer=null;}nativeRecoveryNeedsDraw=false;
  nativePlayerHeight=null;nativeHeightProfile=Object.freeze({heightDispatch:0,ignoreHeights:false,dynamicRegistryActive:false});
  const nextState=freshState(),nextField=window.SourceNativeFieldLifecycle?window.SourceNativeFieldLifecycle.create({header:411,tile:[nextState.player.x,nextState.player.y],generation:fieldGeneration+1,profile:'ordinary-no-poketch'}):null;if(nextField){if(nativeFieldLifecycle)nativeFieldLifecycle.invalidate();nativeFieldLifecycle=nextField;fieldGeneration++;fieldView=null;lastNativeFrame=null;areaTextureHashes=Object.create(null);}worldAnimation.reset(411);originalMotion=O.createMotion({seed:0});logicAccumulator=0;resetPresentationPending=true;resetElapsedCaptured=!nativeRenderer;state=nextState;sceneSnapshot=null;cameraFrame=0;if(nativeRenderer)nativeRenderer.resetCamera(411,worldPosition(state.player));keys.clear();closeDialog();updateUI();
  $('location-name').textContent='Twinleaf Town'; $('location-note').textContent='A place to begin';
  $('scene-tag').innerHTML='TWINLEAF TOWN <span>4 Fable 5.2 helpers · 8 Fable 5.2 residents</span>';
  if((rebindStartup||rebindRetained)&&rendererInitOwner===startupOwner&&rendererInitGeneration===startupOwner.generation){startupOwner.state=state;startupOwner.fieldGeneration=fieldGeneration;}
  showToast('A fresh morning. Walk up to a door or a neighbor and press E.');
}
// Explicit ordinary-UI scenario boundary. Default objects and native view are
// retained privately, never stamped into the fresh scenario's object lifetime.
function openingOwnsField(){return !!(profileSwitchPending||openingProfile?.faulted||openingProfile?.tvRuntime?.ownsField()||openingProfile?.controller?.ownsField()||openingProfile?.direct?.ownsField()||openingProfile&&state?.pendingOriginalSession||openingProfile?.menu?.ownsField());}
function updateOpeningProfileUI(){
 const active=!!openingProfile,owned=openingOwnsField();
 $('opening-profile-start').disabled=active||profileSwitchPending;
 $('tv-origin-start').disabled=active||profileSwitchPending||musicEnabled;
 $('record-button').disabled=!nativeRenderer||!nativeRenderReady||recordingPhase==='starting'||recordingPhase==='stopping';
 $('opening-profile-return').hidden=!active&&!profileSwitchPending;
 $('opening-profile-restart').hidden=!active;
 $('opening-profile-restart').disabled=!!openingProfile?.recovering;
 $('opening-profile-return').disabled=!!openingProfile?.recovering;
 $('opening-profile-status').textContent=profileSwitchPending?'Preparing a separate local scenario…':active?(openingProfile.recovering?'Rebuilding fresh upstairs415 actors at the post-TV reference point. Waiting for its first accepted frame; cancelled scene progress will not resume.':openingProfile.faulted?'Scenario stopped after a render or ownership fault. Restart or Retry loading rebuilds the post-TV upstairs415 boundary; Return restores the preserved default visit.':'Original-opening scenario · fresh upstairs415 actors at the observed post-TV point(7,4), face east · source-derived40F9=1, not recovered save data. The zero-state TV introduction remains unfinished. Walk east onto the real staircase. After Mom returns, walk south7 then west4 to the warning. Home scripts2/5 and source menu from idle X, home-scene5, signs and supported direct-talk WaitButton X. Default direct-talk preview remains unchanged. Observed-video name LPA☺; initial MID/ON/SHIFT/STEREO/NORMAL/TYPE18 settings are observed scenario inputs, not recovered saved Options/name state. Rival Barry, girl, fresh bag flag and other state are explicit assumptions; starter/Dex absent. Fixed lighting, original RTC unknown. Menu navigation, B/X and EXIT work. OPTIONS commits only in-memory scenario settings; no disk save. Battle settings are retained, with no battle simulation; source-effect mono and recorded-loop downmix are qualified separately. Q/R map L/R and Backspace maps START; these are keyboard adapters, not native touch. BAG, trainer and SAVE applications are not implemented and do not save or open substitutes. Full fidelity unverified.'):'Default preview selected. Starting the separate scenario preserves this visit’s progress and view in memory. Return restores it; mock task deadlines still use real elapsed time. Switching is unavailable during an active dialogue, move, warp, recording or recovery.';
 if(openingProfile?.tvOrigin)$('opening-profile-status').textContent='TV-origin scenario · '+(openingProfile.recovering?'recovering':openingProfile.faulted?'stopped':openingProfile.tvRuntime?.snapshot().phase)+' · original TV component, then declared fresh-field consumer at415(4,6), north,40F9=0. Preceding Intro/name/shrink/save initialization and native bootstrap are not reproduced. New-save Options defaults (medium4,TYPE1); LPA☺,girl,Barry,RNGseed0 and the pre-entry Lighting Apply clock are explicit scenario inputs, not recovered reference identity. Real982:3 precedes field input. One native1030/1154/default1004-or1033 owner supports bounded STEREO PCM capture and source effects; Record captures native PCM at wall-clock arrival, with silence gaps if source rendering falls behind. Live speakers remain muted; real-time and heard fidelity are unverified. Ordinary recorded-music Start remains separate.';
 for(const id of ['music-button','lighting-time','lighting-apply','lighting-noon'])$(id).disabled=owned||!!openingProfile?.tvOrigin;
 $('menu-button').disabled=!!(profileSwitchPending||openingProfile?.faulted||openingProfile?.recovering||active&&state.dialog&&!state.dialog.homeScene&&!state.dialog.profileDirect||active&&owned&&!openingProfile.menu?.ownsField()&&openingProfile.controller?.snapshot().native?.kind!=='button'&&openingProfile.direct?.snapshot().native?.kind!=='button');
 const menu=openingProfile?.menu?.snapshot();$('opening-menu-controls').hidden=!menu?.active;
 $('opening-menu-state').textContent=menu?.active?(menu.unsupportedAction?'Original '+menu.unsupportedAction.label+' application is not implemented. No action or save occurred. B/X or EXIT closes this menu.':(openingProfile.optionsSession?'Options application · '+openingProfile.optionsSession.snapshot().phase:'Original menu · '+(menu.resourcesLive?menu.labels[menu.selectedRow]:'opening'))+' · keyboard adapters below. BAG, trainer and SAVE applications are unfinished. OPTIONS implements all six settings with confirm/cancel and retained field return.') : '';
 $('menu-button').setAttribute('aria-expanded',String(active?!!menu?.active:menuOpen));
 $('reset-button').textContent=active?'Restart opening scenario':'Reset visit';$('menu-button').textContent=active?'X · Original menu':'X · Task menu';
 $('original-close').hidden=!!state?.dialog?.homeScene;
 $('source-board-menu').textContent=active?'Open original field menu':'Open custom task menu';
 canvas.setAttribute('aria-label',active?'Original-opening scenario. Move with arrows or WASD. E or Z interacts; A/B adapters continue original text. X opens the original field menu when its source input permits. Escape or Close cancels the direct-talk preview. BAG, trainer and SAVE applications are unfinished. OPTIONS implements all six settings with confirm/cancel and retained field return.':defaultCanvasDescription);
}
function clearOpeningText(handle){
 if(!state?.dialog?.homeScene||handle&&state.originalPrinter!==handle)return;
 retireOpeningPrinter(state.originalPrinter);
 state.dialog=null;state.originalPrinter=null;state.originalScriptContinue=false;state.textPrinter=null;
 $('dialog').hidden=true;$('original-controls').hidden=true;$('dialog-close').hidden=false;$('dialog-text').textContent='';
 keys.clear();dialogHeldKeys.clear();ignoreNextTextClick=false;
}
function cancelOpeningScene(reason,nextMapId=null){
 if(!openingProfile)return;
 cancelSourceBoard(reason);
 const p=openingProfile;if(p.tvRuntime){const music=state.transition?.fieldMusic;const keep=reason==='map-replacement'&&(music?openingFieldMusicLoad(state.transition,nextMapId):p.tvRuntime.continueMap({fromMapId:state.scene==='town'?411:state.roomHeader,toMapId:nextMapId,rtcHour:tvScenarioClock().hour,scope:'source-same-music-map'}));if(!keep){p.tvRuntime.retire(reason);p.lastTvRuntime=p.tvRuntime.snapshot();p.tvRuntime=null;}}p.optionsSession?.cancel(reason);p.lastOptionsSession=p.optionsSession?.snapshot()||p.lastOptionsSession||null;p.optionsSession=null;retireOpeningPrinter();cancelOpeningDirectTalk(reason);p.lastDirect=p.direct?.snapshot()||p.lastDirect||null;p.direct=null;p.directTaskVisited=false;p.controller?.cancel(reason);p.controller=null;p.menu?.cancel(reason);p.lastMenu=p.menu?.snapshot()||null;p.menu=null;p.menuPaused=false;p.menuTaskVisited=false;
 if(p.effects){p.lastEffects=p.effects.snapshot();p.effects.reset(p.effects.snapshot().generation+1);p.lastEffects=p.effects.snapshot();p.effects=null;}
 if(p.sourceMom)p.sourceMom.active=false;p.sourceMom=null;
 if(p.rivalEffectActors){for(const source of p.rivalEffectActors.values())source.active=false;p.rivalEffectActors.clear();p.rivalEffectActors=null;}
 clearOpeningText();if(sourceBoard.snapshot().session?.key==='415:bg2')cancelSourceBoard(reason);p.edges.reset();sourceBoardEdges.reset();keys.clear();dialogHeldKeys.clear();p.completedStep=false;
 if(effectPlayer&&['render-fault','profile-return','scenario-restart'].includes(reason))effectPlayer.stopAll();
}
function clearOpeningDirectText(handle){
 if(!state?.dialog?.profileDirect||handle&&state.originalPrinter!==handle)return;
 retireOpeningPrinter(state.originalPrinter);
 state.dialog=null;state.originalPrinter=null;state.originalScriptContinue=false;state.textPrinter=null;
 $('dialog').hidden=true;$('original-controls').hidden=true;$('dialog-close').hidden=false;$('dialog-text').textContent='';
 dialogHeldKeys.clear();ignoreNextTextClick=false;
 if(previousFocus&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});else canvas.focus({preventScroll:true});previousFocus=null;
}
function cancelOpeningDirectTalk(reason='preview-cancel'){
 const p=openingProfile;if(!p)return false;
 const had=!!(p.direct?.ownsField()||state.pendingOriginalSession);
 if(p.direct?.ownsField())p.direct.cancel(reason);
 if(state.pendingOriginalSession){originalMotion.releaseDialog();state.pendingOriginalSession=null;state.pendingOriginalId=null;}
 clearOpeningDirectText();
 // Drain semantic edges without forgetting physically held aliases. A held X
 // cannot turn into a new press at the next script or menu owner.
 p.edges.sample();sourceBoardEdges.sample();keys.clear();dialogHeldKeys.clear();updateOpeningProfileUI();
 return had;
}
function beginOpeningDirectTalk(request){
 const p=openingProfile,actor=request.actor,player=request.player,generation=fieldGeneration,lifetime=p.actorLifetime,actors=state.originals,motion=originalMotion,selected=request.session.selected;
 let owner=null;const actorId=actor.id,eventIndex=actor.eventIndex;
 const current=()=>openingProfile===p&&p.direct===owner&&!p.faulted&&!p.recovering&&!profileSwitchPending&&fieldGeneration===generation&&p.actorLifetime===lifetime&&state.originals===actors&&actors.includes(actor)&&actor.active!==false&&actor.id===actorId&&actor.eventIndex===eventIndex&&actor.openingLifetime===lifetime&&actor.header===(state.scene==='town'?411:state.roomHeader)&&state.player===player&&originalMotion===motion;
 const hooks={isOwnerCurrent:current,
  openMessage(){
   if(!current())throw Error('Direct-talk message owner replaced');
   const printer=request.session.printer;state.originalPrinter=printer;state.originalScriptContinue=false;state.textPrinter=null;state.dialogPage=0;
   previousFocus=document.activeElement;dialogHeldKeys.clear();ignoreNextTextClick=false;
   state.dialog={type:'original',profileDirect:true,dialogueFrameId:p.dialogueFrameId,id:request.id,actorKey:selected.actorKey,messageBank:selected.messageBank,messageIndex:selected.messageIndex,routeId:selected.routeId};
   registerOpeningPrinter('direct',printer,owner,current);
   $('dialog-name').textContent=actor.name;$('dialog-role').textContent='ORIGINAL DIRECT TALK · observed-video name LPA☺ / frame TYPE'+(p.dialogueFrameId+1)+' · ASSUMED RIVAL BARRY';
   $('dialog-text').textContent=printer.commands.map(c=>c.type==='glyph'?c.char:c.type==='page_clear'?'\n\n':'\n').join('');$('dialog-text').style.whiteSpace='pre-line';
   $('portrait').textContent='';$('original-controls').hidden=false;$('original-close').hidden=false;$('dialog-close').hidden=true;$('dialog-actions').replaceChildren();$('dialog-actions').hidden=true;$('dialog').hidden=false;$('interaction-hint').hidden=true;$('original-continue').focus({preventScroll:true});return printer;
  },isPrinterFinished:handle=>current()&&state.originalPrinter===handle&&handle.printerFinished,
  closeMessage:clearOpeningDirectText,
  releaseMovement(){if(motion.dialogTarget()===actor)motion.releaseDialog();},
  setFacing(direction){if(current())player.facing=['up','down','left','right'][direction];},
  menuContinuationEligible:()=>current()&&(state.scene==='town'?411:state.roomHeader)>=411&&(state.scene==='town'?411:state.roomHeader)<=417,
  onDeferredMenu(){if(current()&&!beginOpeningMenu('script-continuation'))throw Error('Direct-talk deferred menu admission failed');},
  onEvent(event){p.directEvents.push({...event,fieldCallback:p.fieldCallback});if(p.directEvents.length>256)p.directEvents.shift();}
 };
 p.direct=window.SourceDirectTalk.createController({player,actor,generation,selected,story:state.originalStory,hooks});owner=p.direct;
 state.pendingOriginalId=null;state.pendingOriginalSession=null;
 p.direct.begin({callbackId:p.fieldCallback});updateOpeningProfileUI();return true;
}
// Finite fresh-object projection for411/416/417 and the explicit TV-origin413 rival staircase lifetime.
// The three accepted initialization phases each admit one existing object queue visit.
const openingTownInitQueue=(()=>{
 const records=new WeakMap(),visits=new WeakMap(),arrivalRecords=new WeakMap(),arrivalVisits=new WeakMap();
 const domains=Object.freeze({
  411:Object.freeze({eventFile:'files/fielddata/eventdata/zone_event_release/narc_0389.bin',eventHash:'1c74649b245b8437645c65e2d8e33b1c2c57d5db7919ad4da0472064d943121f',kind:'exit',rows:Object.freeze([
   Object.freeze({event:0,offset:28,sprite:'human-12',movement:3,type:0,x:23,z:14,initialY:65536,facing:'left',direction:2,xRange:1,zRange:0,script:6,permission:0,height:16}),
   Object.freeze({event:1,offset:60,sprite:'human-19',movement:2,type:0,x:12,z:25,initialY:65536,facing:'up',direction:0,xRange:0,zRange:2,script:5,permission:0,height:16}),
   Object.freeze({event:3,offset:124,sprite:'human-10',movement:12,type:0,x:12,z:5,initialY:0,facing:'left',direction:2,xRange:0,zRange:0,script:3,permission:0,height:16})])}),
  413:Object.freeze({eventFile:'files/fielddata/eventdata/zone_event_release/narc_0391.bin',eventHash:'79b07aa00506009ef94dacd24d31d38b8452cc1b4ca7bcee109b1f85492c10da',kind:'stairs',rows:Object.freeze([
   Object.freeze({event:0,offset:48,sprite:'human-148',movement:14,type:0,x:9,z:5,initialY:0,facing:'up',direction:0,xRange:0,zRange:0,script:0,hideFlag:528,permission:0,height:0})])}),
  416:Object.freeze({eventFile:'files/fielddata/eventdata/zone_event_release/narc_0394.bin',eventHash:'d55f91c3102432781b884014a836666bb45ee282af7ff7e953cacb04bf95f233',kind:'entry',rows:Object.freeze([
   Object.freeze({event:0,offset:8,sprite:'human-10',movement:3,type:0,x:8,z:6,initialY:0,facing:'down',direction:1,xRange:1,zRange:1,script:1,permission:0,height:0})])}),
  417:Object.freeze({eventFile:'files/fielddata/eventdata/zone_event_release/narc_0395.bin',eventHash:'5dae013dac32d9f8b0b3b547b46dbeafcaa4b99c9cbc22d16608e24649b42823',kind:'entry',rows:Object.freeze([
   Object.freeze({event:0,offset:8,sprite:'human-18',movement:0,type:0,x:5,z:5,initialY:0,facing:'down',direction:1,xRange:0,zRange:0,script:1,permission:0,height:0}),
   Object.freeze({event:1,offset:40,sprite:'human-2',movement:3,type:0,x:8,z:6,initialY:0,facing:'down',direction:1,xRange:1,zRange:2,script:2,permission:0,height:0})])})
 });
 const check=(ok,label)=>{if(!ok)throw Error('Opening fresh init queue: '+label);};
 function domainFor(header){return header===413&&(!openingProfile?.tvOrigin||state.originalStory.flags[528]===true&&!records.has(state.originals))?null:domains[header];}
 function plain(value,depth=0){
  check(depth<=5,'bounded actor data');
  if(value===null||['string','boolean'].includes(typeof value)||typeof value==='number'&&Number.isFinite(value))return;
  check(value&&typeof value==='object','literal actor data');
  check(Object.getPrototypeOf(value)===(Array.isArray(value)?Array.prototype:Object.prototype),'plain actor prototype');
  const keys=Reflect.ownKeys(value);check(keys.length<=40,'bounded actor fields');
  for(const key of keys){const d=Object.getOwnPropertyDescriptor(value,key);check(typeof key==='string'&&Object.hasOwn(d,'value')&&(d.enumerable||Array.isArray(value)&&key==='length'),'plain actor fields');plain(d.value,depth+1);}
 }
 function shape(r,completed){
  const actors=r.actors,rows=r.domain.rows;plain(actors);
  check(Array.isArray(actors)&&actors.length===rows.length,'complete fresh actor set');
  const scene=W.getScene(r.header);
  for(let i=0;i<rows.length;i++){
   const a=actors[i],row=rows[i],m=a?.originalMotion,g=a?.originalGait,source=a?.source;
   check(a&&a.id==='original-'+r.header+'-'+row.event&&a.header===r.header&&a.eventId===row.event&&a.eventIndex===row.event&&a.spriteKey===row.sprite&&a.movement===row.movement&&a.hideFlag===(row.hideFlag||0)&&a.scriptId===row.script&&a.sourceYFixed===row.initialY&&a.xRange===row.xRange&&a.zRange===row.zRange,'source event projection');
   check(source?.root==='packet'&&source.path===r.domain.eventFile&&source.file_sha256===r.domain.eventHash&&source.offset===row.offset&&source.length===32,'source event provenance');
   check(a.active!==false&&a.x===row.x&&a.y===row.z&&a.fromX===row.x&&a.fromY===row.z&&a.toX===row.x&&a.toY===row.z&&a.progress===1&&a.step===0&&a.facing===row.facing,'initialization actor position');
   const expectedState=row.movement===3?Math.min(completed,2):0;
   const waitOk=row.movement===2||row.movement===12?m?.wait===r.creationWaits[i]-completed:row.movement===3&&completed>=2?(completed===2?[15,31,47,63].includes(m?.wait):m?.wait===r.walkWaits[i]-1):m?.wait===0;
   check(m&&m.type===row.movement&&m.initialX===row.x&&m.initialY===row.z&&m.state===expectedState&&m.stepTicks===0&&m.stepTotal===0&&m.initialized===true&&m.oneTimeDone===(row.movement===14&&completed>0)&&waitOk,'phase movement state');
   check(g&&g.previousDirection===row.direction&&g.relativeFrame===0,'initialization gait state');
   check(scene.permission_u16_rows[row.z][row.x]===row.permission&&W.heightAt(r.header,row.x,row.z)===row.height,'source terrain readiness projection');
  }
  return JSON.stringify(actors);
 }
 function fieldSnapshot(r){
  check(r.field.bridge===r.bridge&&r.field.renderer===r.renderer&&r.field.effect===r.effect,'original field references');
  return r.bridge.snapshot();
 }
 function owner(r,generation,stage,revision,arrival=false,finished=false){
  const p=r.profile,s=r.field,t=r.transition,b=fieldSnapshot(r),current=arrival?arrivalShape(r):shape(r,r.completed);
  for(let i=0;i<r.domain.rows.length;i++){const a=r.actors[i],ref=r.actorRefs[i];check(a===ref.actor&&a.originalMotion===ref.motion&&a.originalGait===ref.gait,'original actor references');check(a.openingLifetime===r.lifetime,'original actor lifetime');}
  check(openingProfile===p&&state===r.state&&openingExitCurrent(s)&&state.originals===r.actors&&originalMotion===r.motion&&p.actorLifetime===r.lifetime&&state.player===r.player,'fresh lifetime owner');
  check(!profileSwitchPending&&!p.faulted&&!p.recovering&&state.scene===r.scene&&state.roomHeader===r.roomHeader&&state.houseId===r.stateHouseId&&state.transition===(finished?null:t)&&state.exitReservation===(finished?null:r.reservation)&&t.exitReservation===r.reservation&&t.driver===r.driver&&t.kind===r.domain.kind&&t.houseId===r.houseId&&W.getHouse(t.houseId)===r.house&&t.nativeDestination===r.destination&&t.nativeDestination.header===r.header&&t.nativeDestination.tile[0]===r.tile[0]&&t.nativeDestination.tile[1]===r.tile[1],'arrival owner');
  if(r.domain.kind==='stairs')check(p.tvOrigin&&state.originalStory.flags[528]===false&&r.header===413&&r.house.id==='scout'&&t.staircase===r.driver.case&&t.staircase.id==='412-1-to-413-0'&&t.staircase.header===412&&t.staircase.target_header===413&&t.staircase.target_warp===0&&W.roomWarp(413,0)===r.warp&&r.tile[0]===3&&r.tile[1]===4,'exact fresh rival stair lifetime');
  if(r.domain.kind==='entry')check(r.house.header===r.header&&W.roomWarp(r.header,0)===r.warp&&r.warp.local_x===4&&r.warp.local_z===8&&r.tile[0]===4&&r.tile[1]===8,'entry house and warp');
  check(!p.controller&&!p.direct&&!p.menu&&!p.menuPaused&&!state.dialog&&!state.pendingOriginalId&&!state.pendingOriginalSession&&r.motion.isDialogLocked()===false,'unowned fresh actors');
  check(nativeHeightProfile?.heightDispatch===0&&nativeHeightProfile.ignoreHeights===false&&nativeHeightProfile.dynamicRegistryActive===false,'ordinary height domain');
  check(b.profile==='ordinary-no-poketch'&&b.header===r.header&&!b.invalidated&&b.stage===stage&&b.generation===generation&&b.revision===revision&&fieldGeneration===generation&&b.tile[0]===r.tile[0]&&b.tile[1]===r.tile[1],'accepted lifecycle identity');
  check(current===r.checkpoint,'unchanged complete phase set');
 }
 function created(header){
  const domain=domainFor(header);if(!domain)return;
  const p=openingProfile,s=p?.exitField,t=state.transition,b=s?.bridge.snapshot(),town=header===411;
  check(p&&s&&openingExitCurrent(s)&&b.stage==='location2'&&b.header===header&&t?.driver&&t.kind===domain.kind&&t.nativeDestination?.header===header&&state.exitReservation===t.exitReservation&&state.scene===(town?'town':'interior')&&state.roomHeader===(town?null:header),'genuine fresh map load');
  const r={header,domain,profile:p,state,field:s,bridge:s.bridge,renderer:s.renderer,effect:s.effect,pair:s.pair,transition:t,reservation:t.exitReservation,driver:t.driver,destination:t.nativeDestination,tile:t.nativeDestination.tile.slice(),houseId:t.houseId,house:W.getHouse(t.houseId),warp:town?null:W.roomWarp(header,0),scene:state.scene,roomHeader:state.roomHeader,stateHouseId:state.houseId,actors:state.originals,motion:originalMotion,player:state.player,lifetime:p.actorLifetime,generation:fieldGeneration,loadRevision:b.revision,phase:'fresh',completed:0,walkWaits:[]};
  plain(r.actors);check(Array.isArray(r.actors)&&r.actors.length===domain.rows.length,'complete fresh actor set');
  r.creationWaits=r.actors.map(a=>a.originalMotion?.wait);for(let i=0;i<domain.rows.length;i++)if([2,12].includes(domain.rows[i].movement))check([16,32,48,64].includes(r.creationWaits[i]),'creation wait');
  r.checkpoint=shape(r,0);r.actorRefs=Object.freeze(r.actors.map(actor=>Object.freeze({actor,motion:actor.originalMotion,gait:actor.originalGait})));
  owner(r,r.generation,'location2',r.loadRevision);records.set(r.actors,r);arrivalRecords.set(t,r);r.driverTask=r.driver.task;r.driverSnapshot=r.driver.snapshot;r.driverFade=r.driver.pumpFade;r.finish=t.onFinish;
 }
 function prepare(s,t,b,pair,token){
  if(!domainFor(b.header))return null;
  const n={init1:1,init2:2,init3:3}[b.stage],r=records.get(state.originals);
  check(n&&r&&r.phase==='fresh'&&r.completed===n-1&&r.field===s&&r.transition===t&&r.header===b.header,'next fresh initialization phase');
  const generation=r.generation+(n===1?0:1),nextGeneration=r.generation+1,nextStage=['init2','init3','main'][n-1];
  owner(r,generation,b.stage,r.loadRevision+n+2);check(t.loaded===true&&t.nativeRestoreRequested===true&&s.pair===pair&&pair===r.pair,'restored fresh arrival');
  const proof=pair.preflight(token);check(token.operation===b.stage&&proof.bridge.operation===b.stage&&proof.effect.operation===b.stage&&proof.bridge.nextStage===nextStage&&proof.effect.nextStage===nextStage&&proof.bridge.nextGeneration===nextGeneration&&proof.effect.nextGeneration===nextGeneration,'genuine paired initialization');
  const visit=Object.freeze({});r.phase='prepared';visits.set(visit,{r,n,pair,token,beforeRevision:b.revision,nextGeneration,nextStage,rebound:n!==1});return visit;
 }
 function accepted(visit,pair,token){
  if(visit===null)return;
  const v=visits.get(visit);check(v&&v.r.phase==='prepared'&&v.pair===pair&&v.token===token&&v.r.field.pair===pair,'original committed initialization');
  const b=fieldSnapshot(v.r);check(b.stage===v.nextStage&&b.revision===v.beforeRevision+1&&b.generation===v.nextGeneration&&b.pendingKind===null,'committed initialization result');v.r.phase='accepted';
 }
 function rebound(visit,oldPair,newPair){
  if(visit===null)return;
  const v=visits.get(visit);check(v&&v.n===1&&!v.rebound&&v.r.phase==='accepted'&&v.pair===oldPair&&v.r.pair===oldPair&&newPair===v.r.field.pair&&newPair!==oldPair,'original init1 pair rebind');
  v.r.pair=newPair;v.rebound=true;
 }
 function preflight(visit){
  if(visit===null)return;
  const v=visits.get(visit);check(v&&v.r.phase==='accepted'&&v.rebound&&v.r.completed===v.n-1,'unconsumed accepted phase');
  check(v.r.field.pair===v.r.pair,'original phase pair');owner(v.r,v.nextGeneration,v.nextStage,v.beforeRevision+1);
 }
 function dispatch(visit){
  if(visit===null)return;
  preflight(visit);const v=visits.get(visit),r=v.r;r.phase='consumed';
  // Full-set preflight precedes the call. A partial failure stays consumed.
  r.motion.tick(r.actors,{header:r.header,isBlocked:originalMotionBlocked,paused:false});
  const checkpoint=shape(r,v.n),prior=JSON.parse(r.checkpoint),after=JSON.parse(checkpoint);
  for(let i=0;i<after.length;i++){prior[i].originalMotion.state=after[i].originalMotion.state;prior[i].originalMotion.wait=after[i].originalMotion.wait;if(r.header===413)prior[i].originalMotion.oneTimeDone=after[i].originalMotion.oneTimeDone;}
  check(JSON.stringify(prior)===checkpoint,'only admitted phase state/wait or413 one-time facing changed');
  if(v.n===2)r.walkWaits=r.actors.map(a=>a.originalMotion.wait);
  r.completed=v.n;r.checkpoint=checkpoint;r.phase=v.n===3?'complete':'fresh';
 }
 // Active arrival service is a continuation of this genuine fresh lifetime,
 // not a general transition-unpause policy or a native duration/RNG emulator.
 function fixedArrivalData(text){
  const actors=JSON.parse(text);
  for(const a of actors){for(const k of ['x','y','fromX','fromY','toX','toY','progress','step','facing'])delete a[k];for(const k of ['state','wait','stepTicks','stepTotal'])delete a.originalMotion[k];for(const k of ['previousDirection','relativeFrame'])delete a.originalGait[k];}
  return JSON.stringify(actors);
 }
 function arrivalShape(r){
  const actors=r.actors;plain(actors);check(Array.isArray(actors)&&actors.length===r.domain.rows.length,'complete arrival actor set');
  const text=JSON.stringify(actors);check(fixedArrivalData(text)===r.arrivalFixed,'unchanged arrival source data');
  const scene=W.getScene(r.header);
  for(let i=0;i<actors.length;i++){
   const a=actors[i],row=r.domain.rows[i],m=a.originalMotion,g=a.originalGait,d=['up','down','left','right'].indexOf(a.facing);
   check(d>=0&&Number.isSafeInteger(a.step)&&a.step>=0&&Number.isInteger(g.relativeFrame)&&g.relativeFrame>=0&&g.relativeFrame<=15&&g.previousDirection===d,'arrival facing and gait');
   for(const [x,z]of [[a.x,a.y],[a.fromX,a.fromY],[a.toX,a.toY]])check(Number.isInteger(x)&&Number.isInteger(z)&&Math.abs(x-row.x)<=(row.movement===3?row.xRange:0)&&Math.abs(z-row.z)<=(row.movement===3?row.zRange:0)&&scene.permission_u16_rows[z]?.[x]===0&&W.heightAt(r.header,x,z)===row.height,'resident arrival footprint');
   check(a.x===a.toX&&a.y===a.toY&&Number.isInteger(m.wait)&&m.wait>=0&&m.wait<=64,'arrival logical destination');
   if(row.movement===3){
    check([0,1,2,4].includes(m.state)&&[0,8].includes(m.stepTotal)&&Number.isInteger(m.stepTicks)&&m.stepTicks>=0&&m.stepTicks<=m.stepTotal,'arrival walker state');
    if(m.state===4)check(m.stepTotal===8&&m.stepTicks>=1&&m.stepTicks<8&&a.progress===m.stepTicks/8&&Math.abs(a.x-a.fromX)+Math.abs(a.y-a.fromY)===1&&m.wait===0,'arrival in-flight step');
    else check(a.progress===1&&a.fromX===a.x&&a.fromY===a.y&&(m.stepTicks===0||m.stepTicks===8)&&(m.state===2?m.wait>0:m.wait===0),'arrival resting step');
   }else{
    check(a.progress===1&&a.step===0&&m.state===0&&m.stepTicks===0&&m.stepTotal===0&&g.relativeFrame===0,'arrival stationary actor');
    check(row.movement===0||row.movement===14?m.wait===0&&d===row.direction&&(row.movement!==14||m.oneTimeDone===true):m.wait>0&&(row.movement!==12||[0,2,3].includes(d)),'arrival stationary movement');
   }
  }
  return text;
 }
 function arrivalDriver(r,allowRestore=false){
  check(r.driver===r.transition.driver&&r.driver.task===r.driverTask&&r.driver.snapshot===r.driverSnapshot&&r.driver.pumpFade===r.driverFade&&r.transition.onFinish===r.finish,'original arrival driver');
  const d=r.driver.snapshot();plain(d);check(d.kind===r.domain.kind&&Number.isSafeInteger(d.taskPumps)&&d.taskPumps>=0,'arrival driver identity');
  const names=d.stack.map(f=>f.name).join('/');
  if(d.done){check(r.driver.done===true&&d.rootState===6&&names==='','completed arrival stack');if(r.domain.kind==='stairs')check(r.playerTransferred===true&&state.player.x===3&&state.player.y===4&&state.player.progress===1&&state.player.facing==='right','completed rival stair destination');return d;}
  check(r.driver.done===false,'live arrival stack');
  if(r.domain.kind==='stairs'){
   check(d.mode===3&&d.caseId==='412-1-to-413-0'&&d.cameraOverride===null,'exact source stair driver');
   if(allowRestore&&d.rootState===4){check(names==='restore_overworld/warp'&&!r.playerTransferred,'stair restore waiter');return d;}
   check(r.playerTransferred===true,'source postload player transferred');
   if(d.rootState===5){check(names==='warp','stair music wait');return d;}
   check(d.rootState===6&&names==='stairs_arrival/warp','source stair arrival stack');
   check(d.stack.length===2&&[0,1,2,3].includes(d.stack[0].state)&&d.stack[1].state===6,'source stair arrival states');return d;
  }
  if(allowRestore&&d.rootState===4){check(names==='restore_overworld/warp','restore waiter stack');return d;}
  if(d.rootState===5){check(names==='warp','arrival music wait');return d;}
  check(d.rootState===6,'post-restore arrival root');
  const allowed=r.domain.kind==='exit'?['arrival_select_door_or_generic/warp','field_fade/arrival_select_door_or_generic/warp']:['arrival_select_door_or_room/warp','room_arrival/arrival_select_door_or_room/warp','field_fade/room_arrival/arrival_select_door_or_room/warp'];
  check(allowed.includes(names),'ordinary arrival child stack');
  for(const f of d.stack){const states=f.name==='warp'?[6]:f.name==='field_fade'?[0,1]:f.name==='arrival_select_door_or_generic'?[0,1,2]:f.name==='arrival_select_door_or_room'?[0,1]:[0,3];check(states.includes(f.state),'ordinary arrival child state');}
  if(r.domain.kind==='exit')check(d.door&&d.door.kind==='emergence'&&Number.isInteger(d.door.state)&&d.door.state>=0&&d.door.state<=5,'ordinary emergence state');
  return d;
 }
 function arrivalStart(){
  const t=state.transition;if(!t?.driver)return null;
  const r=records.get(state.originals)||arrivalRecords.get(t);if(!r||r.completed!==3)return null;
  if(r.phase==='retired'){check(t!==r.transition&&t.driver!==r.driver&&t.loaded===false,'retired arrival transition');return null;}
  check(['complete','arrival-ready'].includes(r.phase),'unconsumed arrival visit');
  if(r.phase==='complete'){
   // Derive authority only from the last validated init3 result, never current data.
   r.arrivalFixed=fixedArrivalData(r.checkpoint);r.arrivalRevision=r.loadRevision+6;
  }
  owner(r,r.generation+1,'main',r.arrivalRevision,true);
  check(r.field.pair===r.pair&&r.transition.loaded===true&&r.transition.nativeRestoreRequested===true,'accepted arrival lifetime');
  const d=arrivalDriver(r,r.phase==='complete');check(!d.done&&(r.arrivalTaskPumps===undefined||d.taskPumps===r.arrivalTaskPumps),'next arrival task visit');
  const visit=Object.freeze({});r.phase='arrival-prepared';arrivalVisits.set(visit,{r,revision:r.arrivalRevision,beforeView:r.bridge.acceptedView(),pumps:d.taskPumps,terminal:false,afterTask:null,consumed:false});return visit;
 }
 function arrivalAfterTask(visit){
  if(visit===null)return;
  const v=arrivalVisits.get(visit);check(v&&v.r.phase==='arrival-prepared'&&!v.afterTask,'original arrival task');const r=v.r,d=arrivalDriver(r);
  check(d.taskPumps===v.pumps+1,'one arrival task pump');v.terminal=d.done;
  owner(r,r.generation+1,'main',v.revision,true,v.terminal);
  if(v.terminal)check(state.forcedWalk===null&&state.playerHidden===false,'completed arrival handoff');
  v.afterTask=JSON.stringify(d);r.phase='arrival-draw';
 }
 function arrivalPreflight(visit){
  const v=arrivalVisits.get(visit);check(v&&!v.consumed&&v.r.phase==='arrival-draw','unconsumed arrival draw');const r=v.r;
  owner(r,r.generation+1,'main',v.revision+1,true,v.terminal);
  check(r.field.pair===r.pair&&JSON.stringify(arrivalDriver(r))===v.afterTask,'unchanged arrival phase');
  const b=r.bridge.snapshot(),view=r.bridge.acceptedView(),e=r.effect.snapshot();
  check(!b.stopRequested&&b.pendingKind===null&&b.canDraw&&view&&view===fieldView&&view!==v.beforeView&&view.kind==='field'&&view.revision===v.revision&&view.header===r.header&&view.generation===r.generation+1,'accepted arrival main commit');
  check(!e.invalidated&&!e.stopRequested&&e.pendingKind===null&&e.stage==='main'&&e.header===r.header&&e.generation===r.generation+1&&e.hasAcceptedDraw,'accepted arrival effect context');
  return v;
 }
 function arrivalDeferred(visit){
  if(visit===null)return null;
  arrivalPreflight(visit);
  return ()=>{
   const v=arrivalPreflight(visit),r=v.r;v.consumed=true;r.phase='arrival-consumed';
   // Partial failure stays consumed. Completion uses the existing ordinary call.
   if(v.terminal)updateOriginalMotion();else r.motion.tick(r.actors,{header:r.header,isBlocked:originalMotionBlocked,paused:false});
   r.checkpoint=arrivalShape(r);r.arrivalRevision=v.revision+1;r.arrivalTaskPumps=v.pumps+1;r.phase=v.terminal?'retired':'arrival-ready';
  };
 }
 function transferred(t,oldPlayer,newPlayer,event){
  const r=arrivalRecords.get(t);if(!r||r.header!==413)return false;
  check(r.domain.kind==='stairs'&&r.phase==='arrival-prepared'&&!r.playerTransferred&&r.player===oldPlayer&&state.player===newPlayer&&newPlayer!==oldPlayer&&openingProfile===r.profile&&state.originals===r.actors&&fieldGeneration===r.generation+1,'owned source stair player replacement');
  check(t===state.transition&&t.driver===r.driver&&t.exitReservation===r.reservation&&t.staircase===r.driver.case&&event.type==='postload_stair'&&event.caseId==='412-1-to-413-0'&&event.header===413&&event.warp===0&&event.direction===3&&event.tile[0]===2&&event.tile[1]===4&&event.deltaFx32[0]===-65536&&event.deltaFx32[1]===0&&event.deltaFx32[2]===0,'exact source postload event');
  check(oldPlayer.x===3&&oldPlayer.y===4&&oldPlayer.progress===1&&newPlayer.x===2&&newPlayer.y===4&&newPlayer.fromX===2&&newPlayer.fromY===4&&newPlayer.toX===2&&newPlayer.toY===4&&newPlayer.progress===1&&newPlayer.facing==='right'&&!newPlayer.playerMotion?.command,'source postload player state');
  const d=r.driver.snapshot();check(d.kind==='stairs'&&d.caseId===event.caseId&&d.rootState===5&&d.stack.length===1&&d.stack[0].name==='warp'&&d.stack[0].state===5,'returned source postload task');
  r.player=newPlayer;r.playerTransferred=true;return true;
 }
 return Object.freeze({created,prepare,accepted,rebound,preflight,dispatch,arrivalStart,arrivalAfterTask,arrivalDeferred,transferred});
})();

function loadOpeningActors(header){
 const p=openingProfile;if(!p)return;
 for(const a of state.originals||[])a.active=false;
 // New records are allocated at location load, before field/sprite initialization.
 // Unconditional preview actors remain unchanged. The TV-origin413 rival is
 // the exact flag-gated event record, created before the real init callbacks.
 state.originals=O.create().filter(a=>a.header===header);p.actorLifetime++;
 if(p.tvOrigin&&header===413){
  const record=window.SourceRivalScriptData.scenes[413].rival;if(typeof state.originalStory.flags[528]!=='boolean')throw Error('Explicit413 rival hide flag required');
  if(state.originalStory.flags[528]===false)state.originals.push(window.OriginalMotion.attach({...record,location:'interior',roomHeader:413,fromX:record.x,fromY:record.y,toX:record.x,toY:record.y,progress:1,step:0,active:true,openingLifetime:p.actorLifetime}));
 }
 for(const a of state.originals)a.openingLifetime=p.actorLifetime;
 originalMotion=O.createMotion({random16:p.npcRandom});originalMotion.initializeCreatedActors(state.originals);p.completedStep=false;
 openingTownInitQueue.created(header);
}
function openingSourceMom(mom){
 const p=openingProfile,position=worldPosition(mom),origin=W.getHeader(414).events.origin;
 const raw=[(position[0]+origin[0]*16+256)*4096,position[1]*4096,(position[2]+origin[1]*16+256)*4096];
 if(!raw.every(x=>Number.isInteger(x)&&x>=-2147483648&&x<=2147483647))throw Error('Opening Mom position must be exact signed32 FX12');
 if(!p.sourceMom)p.sourceMom={id:0,mapId:414,generation:fieldGeneration,active:true,flag25:false,priority:5,positionFx12:raw,facingVectorFx12:[0,0,0],offset58BA4Fx12:[0,0,0],offset58BC4Fx12:[0,0,0]};
 p.sourceMom.positionFx12=raw;p.sourceMom.active=state.originals.includes(mom)&&mom.openingLifetime===p.actorLifetime;
 return p.sourceMom;
}
function openingMenuEligible(){
 const header=state.scene==='town'?411:state.roomHeader;
 return !!openingProfile&&!openingProfile.faulted&&!openingProfile.recovering&&!profileSwitchPending&&header>=411&&header<=417&&!state.transition&&!state.dialog&&!state.pendingOriginalId&&nativeFieldLifecycle?.snapshot().stage==='main';
}
function beginOpeningMenu(entry='normal'){
 const p=openingProfile;if(!openingMenuEligible()||p.menu?.ownsField())return false;
 if(!p.menu){
  const generation=fieldGeneration,lifetime=p.actorLifetime,player=state.player,actors=state.originals,header=state.scene==='town'?411:state.roomHeader,menuContext={generation};
  const current=()=>openingProfile===p&&!p.faulted&&!p.recovering&&fieldGeneration===menuContext.generation&&p.actorLifetime===lifetime&&state.player===player&&state.originals===actors;
  if(!p.menuAssets)p.menuAssets=window.SourceMenuArt.loadAssets(window.SourceMenuArtData);
  p.menu=window.SourceFieldMenu.createController({generation,rememberedOptionId:p.menuRememberedOptionId,art:window.SourceMenuArt,assets:p.menuAssets,
   profile:{header,normalFieldMode:0,bagUnlocked:state.originalStory.flags[0x960]===true,starter:state.originalStory.vars[0x4030],sinnohDex:false,safari:false,palPark:false,amitySquare:false,playerName:p.playerName,gender:1},
   hooks:{isOwnerCurrent:current,pauseActors(owner){if(!current())return;p.menuPauseOwner=owner;p.menuPaused=true;},resumeActors(owner){if(p.menuPauseOwner===owner){p.menuPauseOwner=null;p.menuPaused=false;}},rememberOption(id){p.menuRememberedOptionId=id;},
    resetPlayerForNormalEntry(){if(!current())return;if(!PM.resetForFieldTask(player))throw Error('Normal menu player reset was not source-eligible');openingExitResetPlayer(player,true);state.sourceInputStatus14=0;},
    requestSound(id,details){if(!current())return;p.soundRequests.push({sourceSequenceId:id,kind:'field-menu',reason:details.reason,generation,callbackId:p.fieldCallback});playEffect(id);},
    beginApplicationFade(enter){if(!current())throw Error('Options menu owner lost');if(!enter){if(p.optionsSession)throw Error('Options application already owned');p.optionsSession=createOpeningOptionsSession(menuContext);}p.optionsSession.beginFade(enter);},
    applicationFadeFinished(){if(!current())throw Error('Options fade owner lost');return p.optionsSession.snapshot().fade.finished;},
    launchOptions(){if(!current())throw Error('Options launch owner lost');return p.optionsSession.launch();},
    applicationRunning(){if(!current())throw Error('Options application owner lost');return p.optionsSession.running();},
    restoreAfterOptions(){if(!current())throw Error('Options return owner lost');return p.optionsSession.restore();},
    fieldReady(){if(!current())throw Error('Options readiness owner lost');return p.optionsSession.ready();},
    acceptGenerationRebind(owner,old,next){return p.optionsSession.acceptRebind(owner,old,next);},
    onUnsupportedAction(action){if(current()){showToast('Original '+action.label+' application is not implemented. No action or save occurred. B/X or EXIT closes this menu.');updateOpeningProfileUI();}},
    onEvent(event){if(event.type==='options-returned')p.optionsSession.finish();p.menuEvents.push({...event,fieldCallback:p.fieldCallback});if(p.menuEvents.length>128)p.menuEvents.shift();}
   }});
 }
 const began=p.menu.begin({entry,callbackId:p.fieldCallback});if(began){mapNamePopup.cancel();updateOpeningProfileUI();}return began;
}
function tickOpeningMenu(){
 const p=openingProfile;if(!p?.menu?.ownsField())return false;
 const bits={A:1,B:2,RIGHT:16,LEFT:32,UP:64,DOWN:128,X:1024};
 p.menuTaskVisited=p.menu.tick({callbackId:p.fieldCallback,eligible:!p.faulted&&!p.recovering&&!state.transition&&(!!p.optionsSession||nativeFieldLifecycle?.snapshot().stage==='main'),newKeys:(openingInput?.newKeys||[]).reduce((mask,key)=>mask|(bits[key]||0),0)});
 updateOpeningProfileUI();return true;
}
// Retained field/application boundary. CPU asset storage is retained; native field
// presentation/loader resources follow exit0..2 and init0..3, with no fresh actors.
function optionsArtAssets(){const p=openingProfile;if(!p)throw Error('Options profile unavailable');return p.optionsAssets||(p.optionsAssets=window.SourceOptionsArt.loadAssets(window.SourceOptionsArtData));}
function createOpeningOptionsSession(menuContext){
 const p=openingProfile,st=state,s=p?.exitField,player=st.player,actors=st.originals,motion=originalMotion,lifetime=p.actorLifetime,header=st.scene==='town'?411:st.roomHeader,scene=st.scene,room=st.roomHeader,house=st.houseId,bridge=s?.bridge,effect=s?.effect,renderer=s?.renderer;
 const refs=actors.map(actor=>({actor,motion:actor.originalMotion,gait:actor.originalGait})),checkpoint=JSON.stringify(actors),random=p.npcRandom,randomState=random.state();
 let generation=fieldGeneration,pair=s.pair,phase='parent-fade-out',app=null,retired=false,rebound=false,restored=false,restoreRequest=null,retainedTile=null;
 const fade=window.SourceOptions.createDisplayFade(window.SourceWarp.Fade);
 function base(){return !retired&&openingProfile===p&&state===st&&p.exitField===s&&!profileSwitchPending&&!p.faulted&&!p.recovering&&st.player===player&&st.originals===actors&&originalMotion===motion&&p.actorLifetime===lifetime&&p.npcRandom===random&&st.scene===scene&&st.roomHeader===room&&st.houseId===house&&!st.transition&&!st.forcedWalk&&!st.dialog&&!st.pendingOriginalId&&!st.pendingOriginalSession&&p.menuPaused&&s.bridge===bridge&&s.effect===effect&&s.renderer===renderer&&nativeFieldLifecycle===bridge&&nativeRenderer===renderer;}
 function check(allowGeneration=false,allowPending=false){
  if(!base()||(!allowGeneration&&(generation!==fieldGeneration||s.generation!==generation||menuContext.generation!==generation))||s.pair!==pair)throw Error('Options retained field owner changed');
  if(actors.length!==refs.length||refs.some((r,i)=>actors[i]!==r.actor||r.actor.originalMotion!==r.motion||r.actor.originalGait!==r.gait)||JSON.stringify(actors)!==checkpoint||random.state()!==randomState)throw Error('Options retained NPC state changed');
  const b=bridge.snapshot();if(b.header!==header||b.invalidated||!allowPending&&b.pendingKind!==null)throw Error('Options retained lifecycle changed');return b;
 }
 function beginFade(enter){check();fade.begin({pattern:0,in:enter,color:0,duration:6,framesPer:1});phase=enter?'parent-fade-in':'parent-fade-out';}
 function launch(){
  const b=check();if(phase!=='parent-fade-out'||!fade.snapshot().finished||b.stage!=='main'||b.stopRequested||!p.menu?.ownsField())throw Error('Options launch boundary');
  if(p.controller?.ownsField()||p.direct?.ownsField())throw Error('Options overlaps script ownership');
  // Finished script adapters carry presentation-generation guards. Retire only
  // these inactive host adapters, never their actors/story/private movement.
  p.controller?.cancel('options-application');p.controller=null;p.direct?.cancel('options-application');p.direct=null;
  if(p.effects){p.effects.reset(p.effects.snapshot().generation+1);p.effects=null;}if(p.sourceMom)p.sourceMom.active=false;p.sourceMom=null;
  app=window.SourceOptions.createController({saved:p.options,hooks:{isOwnerCurrent:()=>base()&&p.optionsSession===api,
   setup(){check();optionsArtAssets();},teardown(){check();},beginFade(spec){check();fade.begin(spec);},fadeFinished(){check();return fade.snapshot().finished;},
   setSoundMethod(value){check();setOpeningSoundMethod(value);},setButtonMode(value){check();liveButtonMode=value;},
   commit(value){check();p.options=window.SourceOptions.settings(value);p.dialogueFrameId=p.options.frame;},
   requestSound(id){check();p.soundRequests.push({sourceSequenceId:id,kind:'options-confirm',generation,callbackId:p.fieldCallback});playEffect(id);},publish(){check();}
  }});
  pair.requestStop();phase='unloading';return true;
 }
 function running(){check();return !app||!app.isDone();}
 function child(previousStage){
  check();if(previousStage!=='absent'||!['unloading','application'].includes(phase))return false;
  phase='application';return app.tick({callbackId:p.fieldCallback,newKeys:openingInput?.newMask??0});
 }
 function restore(){
  const b=check();if(phase!=='application'||!app?.isDone()||b.stage!=='absent'||restoreRequest)throw Error('Options restore boundary');
  if(player.progress!==1)throw Error('Options retained player moved while absent');
  retainedTile=[player.x,player.y];const token=pair.prepareLifecycle('application-restore',{header,tile:retainedTile});restoreRequest=token;
  try{check(false,true);pair.commit(token);}catch(error){if(bridge.snapshot().pendingKind==='application-restore')pair.abort(token);throw error;}
  phase='restoring';return true;
 }
 function lifecycleBefore(operation){const b=check();if(!['unloading','restoring'].includes(phase)||!['exit0','exit1','exit2','init0','init1','init2','init3'].includes(operation))throw Error('Options lifecycle operation');if(operation==='exit0')retainedTile=[player.x,player.y];if(operation.startsWith('init')&&(!restoreRequest||!retainedTile||player.x!==retainedTile[0]||player.y!==retainedTile[1]))throw Error('Options retained live tile changed');return {operation,revision:b.revision,generation,beforePair:pair};}
 function lifecycleAfter(visit,oldPair){
  if(!visit||visit.beforePair!==oldPair||visit.generation!==generation)throw Error('Options lifecycle visit replaced');
  const b=bridge.snapshot();if(b.revision!==visit.revision+1||b.pendingKind!==null)throw Error('Options lifecycle not accepted');
  if(visit.operation==='exit0'){pair=s.pair;check();}
  else if(visit.operation==='init1'){pair=s.pair;if(rebound||b.stage!=='init2'||b.generation!==generation+1)throw Error('Options init1 generation');p.menu.rebindGeneration(generation,b.generation);rebound=true;check();}
  else check();
  if(visit.operation==='init3'){if(!rebound||b.stage!=='main'||!b.ready)throw Error('Options restore not ready');restored=true;}
 }
 function acceptRebind(owner,old,next){
  check(true);const b=bridge.snapshot();if(phase!=='restoring'||rebound||old!==generation||next!==old+1||b.stage!=='init2'||b.generation!==next||fieldGeneration!==next||s.generation!==next||p.menuPauseOwner!==owner)throw Error('Options menu generation rebind');generation=next;menuContext.generation=next;return true;
 }
 function initQueue(){check();if(!['init2','init3','main'].includes(bridge.snapshot().stage)||phase!=='restoring')throw Error('Options init queue boundary');if(player.playerMotion?.command&&!PM.hasStationaryCommand(player))throw Error('Options retained nonstationary player command');if(PM.hasStationaryCommand(player))tickOpeningExitPlayer(()=>PM.tick(player),true,true);else tickOpeningExitPlayer(null,true,false);check();updateOpeningExitField();}
 function ready(){check();return restored&&bridge.snapshot().ready;}
 function pump(){check();app?.publish();fade.pump(p.fieldCallback);}
 function finish(){check();if(phase!=='parent-fade-in'||!restored||!fade.snapshot().finished)throw Error('Options parent handoff');retired=true;phase='returned';p.lastOptionsSession=snapshot();p.optionsSession=null;}
 function cancel(reason){if(retired)return false;let error=null;try{app?.cancel(reason);}catch(e){error=e;}retired=true;phase='cancelled';if(error)throw error;return true;}
 function snapshot(){return {phase,header,generation,lifetime,retainedTile:retainedTile?.slice()||null,rebound,restored,retired,fade:fade.snapshot(),app:app?.snapshot()||null,npcRandomState:randomState};}
 const api=Object.freeze({beginFade,launch,running,child,restore,lifecycleBefore,lifecycleAfter,acceptRebind,initQueue,ready,pump,finish,cancel,snapshot});check();return api;
}
function setOpeningSoundMethod(value){if(value!==0&&value!==1)throw Error('Invalid source sound method');if(value!==0&&openingProfile?.tvRuntime?.captureStatus().active)throw Error('Active native capture requires STEREO');liveSoundMethod=value;effectPlayer?.setMono(value===1);setRecordedMusicMono(value===1);}
function optionsNativeSurface(words,width,height,brightness=0){
 if(!(words instanceof Uint32Array)||words.length!==width*height||!Number.isInteger(brightness)||brightness>0||brightness< -16)throw Error('Options native surface');
 const surface=document.createElement('canvas');surface.width=width;surface.height=height;const context=surface.getContext('2d'),image=context.createImageData(width,height),factor=-brightness;
 for(let i=0;i<words.length;i++){const pixel=words[i];for(let c=0;c<3;c++){let v=pixel>>>(c*8)&255;if(v>63)throw Error('Options non-native color');v-=Math.floor((v*factor+15)/16);image.data[i*4+c]=(v<<2)|(v>>>4);}image.data[i*4+3]=pixel>>>24;}
 context.putImageData(image,0,0);return surface;
}
function renderOpeningOptions(){
 const p=openingProfile,a=p?.optionsSession;if(!a)return false;const snap=a.snapshot();if(!['unloading','application','restoring'].includes(snap.phase))return false;
 const b=nativeFieldLifecycle.snapshot();if(b.stage==='main'||['exit0','exit1','exit2'].includes(b.stage))return false;
 if(snap.app?.resources){const native=window.SourceOptionsArt.render(optionsArtAssets(),snap.app),fade=snap.fade;screen.drawImage(optionsNativeSurface(native.main,256,192,fade.topBrightness),0,0,512,384);screen.drawImage(optionsNativeSurface(native.sub,256,192,fade.bottomBrightness),0,384,512,384);}
 else{screen.fillStyle='#000';screen.fillRect(0,0,512,768);} // Both engines are source-faded at allocation/teardown, not a sampled recording fill.
 return true;
}

// The reference reaches ordinary upstairs input after bank982:3 writes40F9=1.
// This is the declared post-TV scenario boundary, not a new-game save or TV replay.
function requireOpeningPostTvBoundary(){
 const vars=state.originalStory?.vars,value=vars&&Object.getOwnPropertyDescriptor(vars,0x40F9);
 if(!value||!Object.hasOwn(value,'value')||value.value!==1)throw Error('Opening post-TV boundary requires own numeric40F9=1; native TV script982:3 is unfinished');
}
function initializeOpeningStory(){state.originalStory.vars[0x40F9]=1;state.originalStory.vars[0x40A4]=0;state.originalStory.vars[0x410F]=0;state.originalStory.flags[0x87]=false;state.originalStory.flags[0x960]=true;state.originalStory.vars[0x4030]=0;}
function initializeTvOriginStory(){
 state.originalStory={vars:{[0x40F9]:0,[0x40A4]:0,[0x410F]:0,[0x4030]:0,[0x4070]:1,[0x40e6]:0,[0x40a3]:0},flags:{[0x960]:true,402:true,528:false},gender:1}; // Explicit fresh post9600 NW boundary, not an inferred reference save.
}
// Normal source ReleaseAll drains semantic edges, but does not release physical
// keyboard/touch owners. Only their currently held raw directions refill the
// movement cache; A/B/X and the raw run modifier are not synthesized.
function releaseOpeningInput(p,reason,ownerCurrent){
 keys.clear();dialogHeldKeys.clear();
 if(reason==='release-all'&&ownerCurrent&&openingProfile===p&&!profileSwitchPending&&!p.faulted&&!p.recovering){
  p.edges.sample();sourceBoardEdges.sample();
  for(const [id,mapped] of p.edges.physical){
   const raw=/^(?:keyboard|touch):(.+)$/.exec(id)?.[1];
   if(raw&&Object.hasOwn(keyDir,raw)&&sourceBoardKey(raw)===mapped)keys.add(raw);
  }
 }else{p.edges.reset();sourceBoardEdges.reset();}
}
// Explicit scenario input selected through the existing Lighting Apply UI.
// This is not a recovered RTC or a clock advanced by presentation.
// This barrier prevents owner replacement during the synchronous capture sink.
// It is not a sandbox for arbitrary callback code or a live audio output path.
let nativeCaptureHostDelivery=false,nativeRecordingLast=null;
function assertCaptureHostIdle(){if(nativeCaptureHostDelivery)throw Error('Capture sink cannot replace gameplay ownership');}
function beginTvCapture(sink){assertCaptureHostIdle();if(typeof sink!=='function')throw Error('Synchronous capture sink required');const route=currentTvCaptureRuntime();return route.beginCapture(block=>{assertCaptureHostIdle();nativeCaptureHostDelivery=true;try{return sink(block);}finally{nativeCaptureHostDelivery=false;}});}
function tvScenarioClock(){const seconds=lightingPreview.snapshot().secondsOfDay;if(!Number.isSafeInteger(seconds)||seconds<0||seconds>=86400)throw Error('Controlled TV scenario seconds');return {seconds,hour:Math.floor(seconds/3600)};}
function currentTvCaptureRuntime(){const p=openingProfile;if(!p?.tvOrigin||!p.tvRuntime||p.faulted||p.recovering||profileSwitchPending||liveSoundMethod!==0)throw Error('Current STEREO TV capture owner required');return p.tvRuntime;}
function bindTvOriginRuntime(){
 const p=openingProfile,ownedState=state,generation=fieldGeneration;if(!p?.tvOrigin||p.tvRuntime)throw Error('TV-origin owner admission');
 const current=()=>openingProfile===p&&state===ownedState&&!profileSwitchPending&&(!p.tvRuntime||!p.tvRuntime.ownsField()||fieldGeneration===generation);
 const messageHandle={profile:p,generation};
 p.tvRuntime=window.SourceTvRuntime.create({owner:p,isOwnerCurrent:current,epoch:++p.tvEpoch,story:state.originalStory,glyphs:F.data.glyphs,effectData:window.SourceEffectData,defaultMusic:true,captureAudio:true,rivalStory:true,fieldMusic:true,art:window.SourceIntroTvArt.load(window.SourceIntroTvData,window.SourceOptionsArtData),hooks:{
  admitActors(){if(!current()||state.originals.length||p.exitField)throw Error('TV-origin fresh actor admission');loadOpeningActors(415);window.PlayerMotion.attach(state.player);installOpeningExitField();return [state.player,...state.originals];},
  fieldReady(){return current()&&!!nativeRenderer&&nativeFieldLifecycle?.snapshot().stage==='main'&&nativeFieldLifecycle.snapshot().canDraw&&!!p.exitField;},
  lock(){if(!current())throw Error('TV lock owner');p.menuPaused=true;keys.clear();dialogHeldKeys.clear();},
  unlock({reason}){if(!current())throw Error('TV unlock owner');p.menuPaused=false;releaseOpeningInput(p,reason,current());},
  openMessage(message){if(!current())throw Error('TV message owner');state.originalPrinter=message.printer;state.dialog={type:'original',homeScene:true,tvScene:true,dialogueFrameId:p.dialogueFrameId,messageBank:502,messageIndex:message.index};state.textPrinter=null;
   $('dialog-name').textContent=p.playerName;$('dialog-role').textContent='TV-ORIGIN SCENARIO · SOURCE BANK502 · EXPLICIT NAME/OPTIONS';$('dialog-text').textContent=message.printer.commands.map(c=>c.type==='glyph'?c.char:c.type==='page_clear'?'\n\n':'\n').join('');$('original-controls').hidden=false;$('original-close').hidden=true;$('dialog-close').hidden=true;$('dialog-actions').replaceChildren();$('dialog-actions').hidden=true;$('dialog').hidden=false;$('original-continue').focus({preventScroll:true});return messageHandle;},
  closeMessage(handle){if(handle!==messageHandle||!current())throw Error('TV window owner');clearOpeningText();},
  readTextDelay:()=>window.SourceOptions.textDelay(p.options),
  printerEvent(event){if(event.type==='continue')playEffect(1500);},
  fieldSelection(){if(!current())throw Error('TV field selection owner');return {mapId:415,rtcHour:tvScenarioClock().hour,scope:'source-field-mode4-selection'};},
  defaultBgm(){if(!current())throw Error('TV default request owner');const hour=tvScenarioClock().hour;return {id:hour>=20||hour<4?1033:1004,scope:'source-default-request',context:{mapId:415,rtcHour:hour,scope:'source-script-default'}};}
 }});
}
function renderTvOrigin(){
 const p=openingProfile,route=p?.tvRuntime;if(!route?.isOverlay())return false;
 const frame=route.renderTv();screen.imageSmoothingEnabled=false;
 if(frame){screen.drawImage(optionsNativeSurface(frame.native.main,256,192,frame.brightness),0,0,512,384);screen.drawImage(optionsNativeSurface(frame.native.sub,256,192,frame.brightness),0,384,512,384);}else{screen.fillStyle='#000';screen.fillRect(0,0,512,768);}
 $('interaction-status').hidden=true;$('toast-status').hidden=true;
 // Retry can accept this actual source TV presentation before any field raster.
 if(!nativeRenderReady&&!nativeRecoveryNeedsDraw&&nativeRenderer&&rendererReadyWaiter&&rendererReadyWaiter.owner===rendererInitOwner){if(!window.TwinleafBoot.ready())throw Error('TV recovery presentation refused');nativeRenderReady=true;if(rendererReadyWaiter&&rendererReadyWaiter.owner===rendererInitOwner){const waiter=rendererReadyWaiter;rendererReadyWaiter=null;waiter.resolve();}}
 return true;
}
function tvOriginFieldFade(){const s=openingProfile?.tvRuntime?.snapshot();return s?.actorsAdmitted?{topBrightness:s.fieldBrightness,bottomBrightness:s.fieldBrightness,windowAttached:false}:null;}
// NW source scene hooks. Inserted in game.js; no standalone entry or fake actor state.
function openingRivalSourceActor(actor,header){
 const p=openingProfile;if(!p||![411,413].includes(header)||actor.header!==header||actor.openingLifetime!==p.actorLifetime||!state.originals.includes(actor))throw Error('Rival effect actor lifetime');
 const position=worldPosition(actor),origin=W.getHeader(header).events.origin,raw=[(position[0]+origin[0]*16+256)*4096,position[1]*4096,(position[2]+origin[1]*16+256)*4096];
 if(!raw.every(x=>Number.isSafeInteger(x)&&x>=-2147483648&&x<=2147483647))throw Error('Rival effect raw signed32 position');
 if(!p.rivalEffectActors)p.rivalEffectActors=new Map();
 let source=p.rivalEffectActors.get(actor);if(!source){source={id:actor.eventId,mapId:header,generation:fieldGeneration,active:true,flag25:false,priority:5,positionFx12:raw,facingVectorFx12:[0,0,0],offset58BA4Fx12:[0,0,0],offset58BC4Fx12:[0,0,0]};p.rivalEffectActors.set(actor,source);}
 source.positionFx12=raw;source.active=actor.active!==false;return source;
}
function createOpeningRivalActor(record){
 const p=openingProfile,header=state.scene==='town'?411:state.roomHeader;
 if(!p?.tvOrigin||record!==window.SourceRivalScriptData.scenes[header]?.rival||state.originalStory.flags[record.hideFlag]!==false||state.originals.some(a=>a.id===record.id&&a.active!==false))throw Error('Rival source event creation');
 const actor=window.OriginalMotion.attach({...record,location:header===411?'town':'interior',roomHeader:header===411?null:header,fromX:record.x,fromY:record.y,toX:record.x,toY:record.y,progress:1,step:0,active:true,openingLifetime:p.actorLifetime});
 originalMotion.initializeCreatedActors([actor]);state.originals.push(actor);return actor;
}
function bindOpeningRivalController(){
 const p=openingProfile,header=state.scene==='town'?411:state.roomHeader;
 // Both scenes require their genuine loaded actor/player lifetimes; no scene
 // is bound at location load or while a staircase still owns the field.
 if(!p?.tvOrigin||p.controller||p.faulted||![411,413].includes(header)||state.transition||nativeFieldLifecycle?.snapshot().stage!=='main'||state.originalStory.vars[header===411?0x40e6:0x40a3]!==0)return;
 const rival=header===413?state.originals.find(a=>a.id==='original-413-0'):null;
 if(header===413&&(!rival||state.originalStory.flags[528]!==false||rival.openingLifetime!==p.actorLifetime||rival.originalMotion?.oneTimeDone!==true||rival.x!==9||rival.y!==5||rival.progress!==1||rival.facing!=='up'||state.player.x!==3||state.player.y!==4||state.player.facing!=='right'||state.player.progress!==1||state.player.playerMotion?.command))throw Error('Fresh413 initialization and completed source arrival required');
 const player=state.player,generation=fieldGeneration,lifetime=p.actorLifetime,actors=state.originals,runtime=p.tvRuntime,animation=worldAnimation;
 if(!runtime||runtime.ownsField())throw Error('Rival requires continuing ordinary native audio owner');
 const current=()=>openingProfile===p&&fieldGeneration===generation&&state.scene===(header===411?'town':'interior')&&state.roomHeader===(header===411?null:413)&&state.player===player&&state.originals===actors&&p.actorLifetime===lifetime&&p.tvRuntime===runtime&&worldAnimation===animation;
 const manager=window.SourceExclamationNative.createManager({generation,header,originFx12:window.SourceExclamationNative.originsFx12[header]});p.effects=manager;
 const effects={beginTraversal:()=>manager.beginTraversal(),endTraversal:()=>manager.endTraversal(),
  createCommand75(actor){if(!current())throw Error('Rival effect owner changed');const handle=manager.createCommand75(openingRivalSourceActor(actor,header));for(const request of manager.takeProposedSoundRequests()){p.soundRequests.push({...request});playEffect(request.sourceSequenceId);}return handle;},
  pollMovement(handle,actor){if(!current())throw Error('Rival effect owner changed');return manager.pollMovement(handle,openingRivalSourceActor(actor,header));},
  updateEffects(){if(!current())throw Error('Rival effects update owner');for(const actor of p.rivalEffectActors?.keys()||[])openingRivalSourceActor(actor,header);manager.updateEffects();},
  cancelOwner(actor){const source=p.rivalEffectActors?.get(actor);return source?manager.cancelOwner(source):false;}};
 let doorLease=null;
 function door(value){if(!current()||value!==doorLease||!doorLease)throw Error('Rival door owner changed');return value;}
 const hooks={isOwnerCurrent:current,beforePlayerCallback:beforeOpeningHomePlayer,afterPlayerCallback:afterOpeningHomePlayer,
  lock(){if(!current())throw Error('Rival lock owner');mapNamePopup.cancel();keys.clear();dialogHeldKeys.clear();sourceBoardEdges.sample();updateOpeningProfileUI();},
  unlock({reason}){releaseOpeningInput(p,reason,current());updateOpeningProfileUI();},
  addRival:record=>{if(!current())throw Error('Rival AddEvent owner');return createOpeningRivalActor(record);},
  removeRival(actor){if(!actors.includes(actor)||actor.openingLifetime!==lifetime)throw Error('Rival RemoveEvent identity');const source=p.rivalEffectActors?.get(actor);if(source){manager.cancelOwner(source);source.active=false;p.rivalEffectActors.delete(actor);}actor.active=false;},
  prepareDoor(value){if(!current()||doorLease||animation.snapshot().door||value.matrixX!==3||value.matrixZ!==27||value.x!==9||value.z!==11||value.id!==77||W.getHouse('scout').doorX!==9||W.getHouse('scout').doorY!==11||animation.data.door_instances.scout!==2)throw Error('Rival exact model67 door77 admission');doorLease=Object.freeze({owner:p,generation,id:77});return doorLease;},
  openDoor(value){door(value);animation.bindDoor('scout',7);playEffect(1541);},
  closeDoor(value){door(value);animation.bindDoor('scout',8);playEffect(1543);},
  doorFinished:value=>{door(value);return animation.doorComplete();},
  freeDoor(value){if(value!==doorLease||!doorLease)throw Error('Rival exact door release');animation.clearDoor();doorLease=null;},
  playEffect:id=>{if(!current())throw Error('Rival effect request owner');return playEffect(id);},
  stopBgm:()=>runtime.stopStoryBgm(),startRivalMusic:()=>runtime.startRivalMusic(),beginBgmFade:value=>runtime.beginStoryFade(value),bgmFadeFinished:token=>runtime.storyFadeFinished(token),
  startDefaultMusic:()=>runtime.restartFieldDefault({mapId:header,rtcHour:tvScenarioClock().hour,scope:'source-story-default'}),
  openMessage(message){
   if(!current())throw Error('Rival message owner changed');
   const printer=window.OriginalDialogue.create(message.tokens,{glyphs:F.data.glyphs,bindings:message.bindings,lineHeight:F.data.line_height,waitButton:false,frameDelay:window.SourceOptions.textDelay(p.options)});
   state.originalPrinter=printer;state.dialog={type:'original',homeScene:true,rivalScene:true,dialogueFrameId:p.dialogueFrameId,messageBank:message.bank,messageIndex:message.index};state.textPrinter=null;registerOpeningPrinter('home',printer,p.controller,current);
   $('dialog-name').textContent=p.rivalName;$('dialog-role').textContent='SOURCE RIVAL SCENE · explicit names, clock and Options';$('dialog-text').textContent=printer.commands.map(c=>c.type==='glyph'?c.char:c.type==='page_clear'?'\n\n':'\n').join('');
   $('original-controls').hidden=false;$('original-close').hidden=true;$('dialog-close').hidden=true;$('dialog-actions').replaceChildren();$('dialog-actions').hidden=true;$('dialog').hidden=false;$('original-continue').focus({preventScroll:true});return printer;
  },isPrinterFinished:handle=>current()&&state.originalPrinter===handle&&handle.printerFinished,closeMessage:clearOpeningText};
 p.controller=window.SourceRivalScripts.createController({header,generation,player,rival,story:state.originalStory,playerName:p.playerName,rivalName:p.rivalName,effects,hooks});
}

function bindOpeningController(){
 bindOpeningRivalController();
 const p=openingProfile;if(!p||p.controller||p.faulted||state.roomHeader!==414||state.transition||nativeFieldLifecycle?.snapshot().stage!=='main')return;
 const mom=state.originals.find(a=>a.header===414&&a.eventIndex===0),player=state.player,generation=fieldGeneration,lifetime=p.actorLifetime;
 if(!mom||mom.openingLifetime!==lifetime||mom.x!==7||mom.y!==8||W.heightAt(414,7,8)!==0)throw Error('Opening fresh Mom lifetime/settled floor unavailable');
 const manager=window.SourceExclamationNative.createManager({generation,header:414,originFx12:[1048576,0,1048576]});p.effects=manager;
 const current=()=>openingProfile===p&&fieldGeneration===generation&&state.roomHeader===414&&state.player===player&&state.originals.includes(mom)&&p.actorLifetime===lifetime;
 const effects={destroy:(handle,reason)=>manager.destroy(handle,reason),beginTraversal:()=>manager.beginTraversal(),createCommand75(actor){if(actor!==mom||!current())throw Error('Opening effect owner replaced');const handle=manager.createCommand75(openingSourceMom(mom));for(const request of manager.takeProposedSoundRequests()){p.soundRequests.push({...request});playEffect(request.sourceSequenceId);}return handle;},pollMovement(handle,actor){if(actor!==mom||!current())throw Error('Opening effect owner replaced');return manager.pollMovement(handle,openingSourceMom(mom));},updateEffects(){openingSourceMom(mom);manager.updateEffects();},endTraversal:()=>manager.endTraversal(),cancelOwner(actor){if(actor===mom&&p.sourceMom)return manager.cancelOwner(p.sourceMom);return false;}};
 const hooks={isOwnerCurrent:current,beforePlayerCallback:beforeOpeningHomePlayer,afterPlayerCallback:afterOpeningHomePlayer,menuContinuationEligible:()=>current()&&state.roomHeader===414,onDeferredMenu(){if(current()&&!beginOpeningMenu('script-continuation'))throw Error('Original deferred menu admission failed');},lock(){mapNamePopup.cancel();keys.clear();dialogHeldKeys.clear();sourceBoardEdges.sample();updateOpeningProfileUI();},unlock({reason}){releaseOpeningInput(p,reason,current());updateOpeningProfileUI();},
 openMessage(message){
  if(!current())throw Error('Opening message owner replaced');
  const printer=window.OriginalDialogue.create(message.tokens,{glyphs:F.data.glyphs,bindings:message.bindings,lineHeight:F.data.line_height,waitButton:false,frameDelay:window.SourceOptions.textDelay(p.options)});
  state.originalPrinter=printer;state.dialog={type:'original',homeScene:true,dialogueFrameId:p.dialogueFrameId,messageBank:501,messageIndex:message.index};state.textPrinter=null;
  registerOpeningPrinter('home',printer,p.controller,current);
  $('dialog-name').textContent='Mom';$('dialog-role').textContent='ORIGINAL OPENING · observed-video name LPA☺ / frame TYPE'+(p.dialogueFrameId+1)+' · ASSUMED RIVAL BARRY';$('dialog-text').textContent=printer.commands.map(c=>c.type==='glyph'?c.char:c.type==='page_clear'?'\n\n':'\n').join('');
  $('original-controls').hidden=false;$('original-close').hidden=true;$('dialog-close').hidden=true;$('dialog-actions').replaceChildren();$('dialog-actions').hidden=true;$('dialog').hidden=false;$('original-continue').focus({preventScroll:true});return printer;
 },isPrinterFinished:handle=>current()&&state.originalPrinter===handle&&handle.printerFinished,closeMessage:clearOpeningText};
 p.controller=window.SourceHomeScripts.createController({player,mom,generation,story:state.originalStory,playerName:p.playerName,rivalName:p.rivalName,effects,hooks});
}
function advanceOpeningProfile(){
 if(!openingProfile)return false;
 const p=openingProfile;p.fieldCallback++;p.menuTaskVisited=false;p.directTaskVisited=false;openingInput=p.edges.sample();openingInput.newKeys=openingInput.newKeys.filter(k=>['A','B','UP','DOWN','LEFT','RIGHT','X'].includes(k));openingInput.heldKeys=openingInput.heldKeys.filter(k=>['A','B','UP','DOWN','LEFT','RIGHT','X'].includes(k));
 if(p.faulted){sourceBoardEdges.sample();return true;}
 if(p.tvRuntime?.begin(p.fieldCallback,openingInput)){sourceBoardEdges.sample();p.completedStep=false;return true;}
 if(p.menu?.ownsField()){tickOpeningMenu();sourceBoardEdges.sample();p.completedStep=false;return true;}
 if(p.direct?.ownsField()){if(!state.transition&&nativeFieldLifecycle?.snapshot().stage==='main'){p.directTaskVisited=true;p.direct.tickScript({...openingInput,callbackId:p.fieldCallback});}sourceBoardEdges.sample();p.completedStep=false;updateOpeningProfileUI();return true;}
 bindOpeningController();
 const before=!!p.controller?.ownsField(),eligible=!state.dialog&&!state.pendingOriginalId&&!state.transition&&!menuOpen&&nativeFieldLifecycle?.snapshot().stage==='main';
 // Native level-type1 precedes interactions, X, warps and a new player move.
 // Task/transition-owned callbacks do not admit a new field-level event.
 if(eligible&&!before&&!state.pendingOriginalSession&&state.scene==='interior'&&state.roomHeader===415)requireOpeningPostTvBoundary();
 const completedStep=p.completedStep;p.completedStep=false;
 if(eligible)p.controller?.dispatch({header:state.scene==='town'?411:state.roomHeader,eligible:true,completedStep,x:state.player.x,z:state.player.y,suppressLevel:false});
 if(p.controller?.ownsField())p.controller.tickScript({...openingInput,callbackId:p.fieldCallback});
 const blocked=before||!!p.controller?.ownsField()||!!p.menu?.ownsField();
 if(blocked){sourceBoardEdges.sample();updateOpeningProfileUI();return true;}
 if(eligible&&!sourceBoardBusy()&&openingInput.newKeys.includes('A')){openingDispatching=true;try{interact();}finally{openingDispatching=false;}}
 return false;
}
function retireOpeningPrinter(handle){
 const p=openingProfile,task=p?.printerTask;
 if(task&&(!handle||task.printer===handle)){task.retired=true;p.printerTask=null;}
}
function registerOpeningPrinter(kind,printer,owner,isOwnerCurrent){
 // Only the existing asynchronous callback-null field consumers are admitted.
 // Their native AddTextPrinter starts with global pause and Unk29 cleared;
 // this does not add a custom-callback or arbitrary pause API.
 if(!openingProfile||!owner||!['home','direct'].includes(kind)||typeof isOwnerCurrent!=='function')throw Error('Opening printer owner unavailable');
 retireOpeningPrinter();
 openingProfile.printerTask={kind,printer,owner,isOwnerCurrent,profile:openingProfile,state,dialog:state.dialog,generation:fieldGeneration,lifetime:openingProfile.actorLifetime,retired:false};
}
function openingPrinterCurrent(task){
 const p=openingProfile;
 const local=()=>!!task&&!task.retired&&p===task.profile&&openingProfile===p&&p.printerTask===task&&state===task.state&&state.dialog===task.dialog&&state.originalPrinter===task.printer&&fieldGeneration===task.generation&&p.actorLifetime===task.lifetime&&!profileSwitchPending&&!p.faulted&&!p.recovering&&(task.kind==='home'?p.controller===task.owner&&state.dialog?.homeScene:p.direct===task.owner&&state.dialog?.profileDirect)&&task.owner.ownsField();
 return local()&&task.isOwnerCurrent()===true&&local();
}
function visitOpeningPrinter(task,input){
 if(!openingPrinterCurrent(task)){if(task?.profile.printerTask===task){task.retired=true;task.profile.printerTask=null;}return false;}
 if(task.printer.printerFinished||task.printer.finished){retireOpeningPrinter(task.printer);return false;}
 const snapshot=task.printer.tick(input);
 if(!openingPrinterCurrent(task))return false;
 for(const event of snapshot.events){if(!openingPrinterCurrent(task))return false;if(event.type==='continue')playEffect(1500);}
 if(!openingPrinterCurrent(task))return false;
 if(task.printer.printerFinished||task.printer.finished){retireOpeningPrinter(task.printer);return false;}
 return true;
}
function serviceOpeningPrinters(){
 if(openingProfile&&!profileSwitchPending&&!openingProfile.faulted&&!openingProfile.recovering&&sourceBoard.snapshot().session?.key==='415:bg2'){
  const sample=openingInput||{newKeys:[],heldKeys:[]},input={pressedA:sample.newKeys.includes('A'),pressedB:sample.newKeys.includes('B'),heldA:sample.heldKeys.includes('A'),heldB:sample.heldKeys.includes('B')};
  if(sourceBoard.tickPrinter(input))sourceBoard.tickPrinter(input);
 }

 const route=openingProfile?.tvRuntime;
 if(route&&state.dialog?.tvScene){const sample=openingInput||{newKeys:[],heldKeys:[]};route.printers(Object.freeze({pressedA:sample.newKeys.includes('A'),pressedB:sample.newKeys.includes('B'),heldA:sample.heldKeys.includes('A')||dialogHeldKeys.has('pointer'),heldB:sample.heldKeys.includes('B')}));return;}
 const task=openingProfile?.printerTask;
 if(!nativeRenderer||profileSwitchPending||openingProfile?.faulted||openingProfile?.recovering||!task)return;
 const sample=openingInput||{newKeys:[],heldKeys:[]};
 const input=Object.freeze({pressedA:sample.newKeys.includes('A'),pressedB:sample.newKeys.includes('B'),heldA:sample.heldKeys.includes('A')||dialogHeldKeys.has('pointer'),heldB:sample.heldKeys.includes('B')});
 // Queue24 A and B share one already sampled input. These are logical visits,
 // not a second field update, an elapsed-time multiplier or an emulated IRQ.
 if(!visitOpeningPrinter(task,input))return; // A; EOS unlinks before B.
 visitOpeningPrinter(task,input); // B; never adopt a replacement created at A.
}
function handleOpeningKey(event){
 const key=event.key.length===1?event.key.toLowerCase():event.key,target=event.target;
 // Native UI retains its browser default. Only the existing dialogue and sign
 // keyboard adapters consume activation keys instead of a native click.
 const dialogueAdapter=!!state.dialog&&(target===$('original-continue')||target===$('original-close')||target===$('dialog-close')||$('dialog-actions').contains(target));
 const signAdapter=sourceBoardBusy()&&(target===$('source-board-close')||target===$('source-board-menu'));
 if(W.usesNativeKey(target?.tagName,key,target?.isContentEditable)&&!dialogueAdapter&&!signAdapter)return true;
 if(profileSwitchPending){if(sourceBoardKey(event.key))event.preventDefault();return !!sourceBoardKey(event.key);}
 if(!openingProfile)return false;
 if(state.dialog?.homeScene&&event.key==='Tab'){event.preventDefault();$('original-continue').focus({preventScroll:true});return true;}
 if(state.dialog?.type==='original'&&!state.dialog.homeScene&&!state.dialog.profileDirect)return false;
 if((openingProfile.direct?.ownsField()||state.pendingOriginalSession)&&key==='Escape'){event.preventDefault();if(!event.repeat){playEffect(1500);cancelOpeningDirectTalk('preview-escape');}return true;}
 if(state.dialog?.profileDirect&&['e','z',' ','Enter'].includes(key)&&document.activeElement===$('original-close')){event.preventDefault();if(!event.repeat){playEffect(1500);cancelOpeningDirectTalk('preview-close-button');}return true;}
 if(W.usesNativeKey(event.target?.tagName,key,event.target?.isContentEditable)&&!openingOwnsField())return false;
 const mapped=({Backspace:'START',q:'L',r:'R'})[key]||sourceBoardKey(key);if(!mapped)return false;
 openingProfile.edges.keyDown('keyboard:'+key,mapped,{repeat:event.repeat===true});
 if(!['START','L','R'].includes(mapped))sourceBoardEdges.keyDown('keyboard:'+key,mapped,{repeat:event.repeat===true});
 if(keyDir[key]||key==='b')keys.add(key);
 event.preventDefault();return true;
}
function retainDefaultProfile(){
 return {liveSoundMethod,liveButtonMode,state,nativeRenderer,nativeFieldLifecycle,fieldGeneration,fieldView,lastNativeFrame,areaTextureHashes,nativePlayerHeight,nativeHeightProfile,worldAnimation,originalMotion,mapNamePopup,lightingPreview,sceneSnapshot,cameraFrame,logicAccumulator,resetPresentationPending,resetElapsedCaptured,menuOpen,toastUntil,locationName:$('location-name').textContent,locationNote:$('location-note').textContent,sceneTag:$('scene-tag').innerHTML};
}
function restoreDefaultProfile(saved){
 liveButtonMode=saved.liveButtonMode;setOpeningSoundMethod(saved.liveSoundMethod);
 ({state,nativeRenderer,nativeFieldLifecycle,fieldGeneration,fieldView,lastNativeFrame,areaTextureHashes,nativePlayerHeight,nativeHeightProfile,worldAnimation,originalMotion,mapNamePopup,lightingPreview,sceneSnapshot,cameraFrame,logicAccumulator,resetPresentationPending,resetElapsedCaptured,menuOpen,toastUntil}=saved);
 nativeRenderReady=true;nativeRecoveryNeedsDraw=false;rendererError=null;suspendedNativeRenderer=null;
 $('location-name').textContent=saved.locationName;$('location-note').textContent=saved.locationNote;
 $('scene-tag').innerHTML='TWINLEAF TOWN <span>4 Fable 5.2 helpers · 8 Fable 5.2 residents</span>';
 $('notebook-panel').hidden=!menuOpen;$('menu-button').setAttribute('aria-expanded',String(menuOpen));$('lighting-time').value=lightingPreview.snapshot().value;
 keys.clear();sourceBoardEdges.reset();dialogHeldKeys.clear();updateUI();
}
function openingExitCurrent(s){return !!s&&openingProfile===s.profile&&s.profile.exitField===s&&state===s.state&&nativeFieldLifecycle===s.bridge&&nativeRenderer===s.renderer&&fieldGeneration===s.generation;}
function installOpeningExitField(){
 const p=openingProfile;if(!p)return;if(p.exitField)throw Error('Opening exit field already installed');
 const bridge=nativeFieldLifecycle,b=bridge?.snapshot(),player=state.player,raw=nativeRawPlayer();
 if(!nativeRenderer||!b||b.stage!=='main'||b.generation!==fieldGeneration)throw Error('Opening exit bootstrap is not current');
 const effect=window.SourceExitIndicator.create({actor:player,header:b.header,tile:[player.x,player.y],generation:fieldGeneration,positionFx12:[raw.x,raw.y,raw.z],facing:PM.directionCode(player.facing)});
 const s={profile:p,state,bridge,renderer:nativeRenderer,generation:fieldGeneration,effect,pair:null,lifecycleToken:null};
 try{s.pair=window.SourceFieldEffectTransaction.create({bridge,effect,renderer:nativeRenderer});p.exitField=s;}catch(error){effect.invalidate();throw error;}
}
function retireOpeningExitField(reason){
 const p=openingProfile,s=p?.exitField;if(!s)return;const errors=[];
 const attempt=fn=>{try{fn();}catch(error){errors.push(error.message||String(error));}};
 attempt(()=>p.optionsSession?.cancel(reason));p.exitField=null;
 if(s.lifecycleToken)attempt(()=>{s.pair.abort(s.lifecycleToken);s.lifecycleToken=null;});
 attempt(()=>s.pair.retire());attempt(()=>s.effect.invalidate());
 p.lastExitField={reason,snapshot:s.effect.snapshot(),cleanupErrors:errors};
}
function openingExitDrawGuard(s,player,transition,advance){
 return ()=>{if(!openingExitCurrent(s)||state.player!==player||state.transition!==transition||profileSwitchPending)return false;
  if(!s.profile.faulted&&!s.profile.recovering)return true;
  const o=rendererInitOwner;return !advance&&s.profile.recovering&&o?.profile===s.profile&&o.state===state&&o.fieldGeneration===fieldGeneration&&o.intent==='assets'&&o.generation===rendererInitGeneration;
 };
}
function openingExitClearHeld(player,hadCollision,result){
 const s=openingProfile?.exitField;if(!s)return;
 if(hadCollision&&result?.accepted&&result.kind!=='busy'){if(!openingExitCurrent(s)||player!==state.player)throw Error('Opening collision clear owner changed');s.effect.player().clearHeldMovement(player,fieldGeneration);}
}
function openingExitResetPlayer(player,normal){
 const s=openingProfile?.exitField;if(!s)return;
 if(!openingExitCurrent(s)||player!==state.player)throw Error('Opening reset owner changed');
 if(normal)s.effect.player().resetForFieldTask(player,fieldGeneration,{facing:PM.directionCode(player.facing)});
 else s.effect.player().clearHeldMovement(player,fieldGeneration);
}
function beginOpeningExitCallback(player,command,willMove=true,paused=false,held=false){
 const s=openingProfile?.exitField;if(!s)return null;
 if(!openingExitCurrent(s)||player!==state.player)throw Error('Opening player callback owner changed');
 const owner=s.effect.player(),token=owner.beginActor(player,fieldGeneration,{paused,held}),visit={s,owner,token,player,command:command?{...command}:null};
 if(command&&!command.initialized&&willMove){
  let family=command.family||command.kind;if(family==='slow')family='horizontal-slow';else if(family==='walk'&&command.forced)family='forced-walk';
  const direction=command.direction??PM.directionCode(player.facing),moving=['walk','run','forced-walk','horizontal-slow'].includes(family),delta=[[0,-1],[0,1],[-1,0],[1,0]][direction];
  const current=owner.snapshot().current,destination=moving?current.map((n,i)=>n+delta[i]):undefined;
  owner.initializeMovement(token,{family,facing:direction,...(moving?{destination}:{})});
 }
 return visit;
}
function endOpeningExitCallback(visit,result){
 if(!visit)return;const {s,owner,token,player,command}=visit;
 if(!openingExitCurrent(s)||state.player!==player||s.effect.player()!==owner){retireOpeningExitField('player-callback-owner-lost');throw Error('Opening player callback lost its owner');}
 if(command&&result?.complete&&owner.snapshot().command)owner.completeMovement(token);
 const raw=nativeRawPlayer();owner.endActor(token,{positionFx12:[raw.x,raw.y,raw.z],facing:PM.directionCode(player.facing)});
}
function tickOpeningExitPlayer(run,paused=false,held=false){
 if(!openingProfile?.exitField)return run?run():undefined;
 const player=state.player,command=player.playerMotion?.command?{...player.playerMotion.command}:null,visit=beginOpeningExitCallback(player,command,!!run,paused,held);
 const result=run?run():undefined;endOpeningExitCallback(visit,result);return result;
}
function beforeOpeningHomePlayer(player,info){
 const h=info.held,code=h?.code;let command=null;
 if(h&&!h.finished){let family,direction=PM.directionCode(player.facing);
  if(code>=12&&code<=19){family='forced-walk';direction=code-(code>=16?16:12);}else if(code>=32&&code<=39){family='turn';direction=code-(code>=36?36:32);}else if(code===0){family='face';direction=0;}else if(code===62||code===63||code===71||code===72)family='wait';else if(code===75)family='command75';else throw Error('Opening player source command is unsupported');
  command={family,direction,initialized:h.initialized};
 }
 return beginOpeningExitCallback(player,command,info.movementAllowed,false,!!command);
}
function afterOpeningHomePlayer(player,visit,info){if(!info.current){retireOpeningExitField('home-callback-owner-lost');throw Error('Opening home callback owner lost');}endOpeningExitCallback(visit,{complete:!!info.held?.finished});}
function updateOpeningExitField(){const s=openingProfile?.exitField;if(!s)return;if(!openingExitCurrent(s))throw Error('Opening priority7 field owner changed');s.effect.update();}
function visitOpeningExitInitQueue(npcVisit=null){
 const s=openingProfile?.exitField;if(!s)return;if(state.player.playerMotion?.command)throw Error('Unexpected movement during opening field initialization');
 openingTownInitQueue.preflight(npcVisit);tickOpeningExitPlayer(null);openingTownInitQueue.dispatch(npcVisit);updateOpeningExitField();
}

async function enterOpeningProfile(mode='post-tv'){
 assertCaptureHostIdle();
 if(!['post-tv','tv-origin'].includes(mode))throw Error('Unknown opening scenario');const tvOrigin=mode==='tv-origin';
 if(tvOrigin&&musicEnabled){showToast('Turn recorded music off before the silent TV-origin scenario. TV audio output is not joined.');return false;}
 if(openingProfile||profileSwitchPending)return false;
 if(!nativeRenderer||!nativeRenderReady||rendererInitPromise||state.transition||state.dialog||state.pendingOriginalId||sourceBoardBusy()||state.player.progress!==1||!PM.inputReady(state.player)||recordingPhase!=='idle'){
  showToast('Finish the current move, dialogue, transition, recording or recovery before starting the separate scenario.');return false;
 }
 const tvEntrySeconds=tvOrigin?tvScenarioClock().seconds:null;
 if(tvOrigin)++audioIntent; // Retire any pending default-recording audio enable, never start town music for TV.
 profileSwitchPending=true;const token={};profileSwitchToken=token;updateOpeningProfileUI();const saved=retainDefaultProfile();let renderer=null,installedProfile=null;
 try{
  // Returning a healthy default renderer does not certify reference-only
  // images after a failed scenario Retry. Every entry owns a fresh image gate.
  refreshReferenceDialogueImages();
  await Promise.all([referenceDialogueImages.frame,...referenceDialogueImages.arrows].map(image=>image.decode()));
  if(!profileSwitchPending||profileSwitchToken!==token||nativeRenderer!==saved.nativeRenderer||!nativeRenderReady||state!==saved.state||fieldGeneration!==saved.fieldGeneration)return false;
  const atlases=window.SourceNativeHost.createAtlases(window.SourceCpuRenderer,window.SourceNativeBrowserAssets,window.SourceNativeActorAudit,Object.keys(nativeAtlases));
  renderer=await window.SourceCpuRenderer.create(meshSurface,window.SourceNativeNeighborAudit.createShared(window.TwinleafSourceData),atlases,{lightingSecondsOfDay:tvOrigin?tvEntrySeconds:lightingPreview.snapshot().secondsOfDay,nativeBrowserDiagnostic:'source-bytes-v1'});
  if(!profileSwitchPending||profileSwitchToken!==token||nativeRenderer!==saved.nativeRenderer||!nativeRenderReady||state!==saved.state||fieldGeneration!==saved.fieldGeneration){renderer.dispose();return false;}
  savedDefaultProfile=saved;openingProfile=installedProfile={tvOrigin,tvEpoch:0,tvRuntime:null,tvDefaultRequest:null,npcRandom:window.OriginalMotion.lcg(0),options:window.SourceOptions.settings({...window.SourceOptions.DEFAULTS,frame:tvOrigin?0:17}),edges:new window.SourceOptions.PhysicalInput(()=>liveButtonMode),optionsSession:null,controller:null,direct:null,directEvents:[],lastDirect:null,playerName:'LPA☺',rivalName:'Barry',dialogueFrameId:tvOrigin?0:17,effects:null,sourceMom:null,actorLifetime:0,completedStep:false,soundRequests:[],faulted:false,fieldCallback:0,menu:null,menuPaused:false,menuRememberedOptionId:0,menuEvents:[]};
  liveButtonMode=0;setOpeningSoundMethod(0);state=freshState();state.scene='interior';state.houseId='home';state.roomHeader=415;state.npcs=[];state.originals=[];
  if(tvOrigin){setPlayer(4,6,'up');initializeTvOriginStory();}else{setPlayer(7,4,'right');loadOpeningActors(415);initializeOpeningStory();}
  nativeRenderer=renderer;fieldGeneration=saved.fieldGeneration+1;nativeFieldLifecycle=window.SourceNativeFieldLifecycle.create({header:415,tile:tvOrigin?[4,6]:[7,4],generation:fieldGeneration,profile:'ordinary-no-poketch'});
  nativePlayerHeight=null;nativeHeightProfile=Object.freeze({heightDispatch:0,ignoreHeights:false,dynamicRegistryActive:false});fieldView=null;lastNativeFrame=null;areaTextureHashes=Object.create(null);sceneSnapshot=null;cameraFrame=0;logicAccumulator=0;
  worldAnimation=window.WorldAnimation.create({areaManaged:true});worldAnimation.reset(415);mapNamePopup=window.SourceMapNamePopup.create(window.SourceMapNamePopupData);lightingPreview=window.LightingPreview.create(tvOrigin?tvEntrySeconds:saved.lightingPreview.snapshot().secondsOfDay);
  nativeRenderer.resetCamera(415,worldPosition(state.player));if(!tvOrigin)installOpeningExitField();nativeRenderReady=true;resetPresentationPending=true;resetElapsedCaptured=true;menuOpen=false;$('notebook-panel').hidden=true;$('menu-button').setAttribute('aria-expanded','false');
  if(effectPlayer)effectPlayer.stopAll();sourceBoardEdges.reset();keys.clear();dialogHeldKeys.clear();profileSwitchPending=false;profileSwitchToken=null;if(tvOrigin)bindTvOriginRuntime();
  $('location-name').textContent='Original opening · upstairs415';$('location-note').textContent='Explicit post-TV reference scenario';$('scene-tag').innerHTML='ORIGINAL OPENING <span>Bounded source scenario · full fidelity unverified</span>';updateUI();updateOpeningProfileUI();canvas.focus({preventScroll:true});return true;
 }catch(error){const ownsInstalled=!!installedProfile&&openingProfile===installedProfile&&nativeRenderer===renderer;if(ownsInstalled){installedProfile.tvRuntime?.retire('entry-failed');if(installedProfile.exitField?.renderer===renderer)retireOpeningExitField('entry-failed');}if(renderer)renderer.dispose();if(profileSwitchToken!==token&&!ownsInstalled)return false;profileSwitchToken=null;profileSwitchPending=false;openingProfile=null;savedDefaultProfile=null;restoreDefaultProfile(saved);updateOpeningProfileUI();showToast('Opening scenario could not start: '+error.message);return false;}
}
function returnFromOpeningProfile(){
 assertCaptureHostIdle();
 if(profileSwitchPending){profileSwitchPending=false;profileSwitchToken=null;updateOpeningProfileUI();return true;}
 if(!openingProfile||!savedDefaultProfile)return false;
 if(recordingPhase!=='idle'){showToast('Stop recording before switching profiles.');return false;}
 if(openingProfile.recovering){showToast('Wait for this recovery attempt to finish before returning.');return false;}
 invalidateNativeInitialization();window.TwinleafBoot.cancelRecovery();
 retireOpeningExitField('profile-return');cancelOpeningScene('profile-return');if(state.transition?.onCancel)state.transition.onCancel();nativeFieldLifecycle?.invalidate();nativeRenderer?.dispose();suspendedNativeRenderer?.dispose();
 const saved=savedDefaultProfile;openingProfile=null;savedDefaultProfile=null;restoreDefaultProfile(saved);
 if(window.TwinleafBoot.snapshot().phase==='blocked'){
  // Recovery UI state is restored through its supported explicit retry path.
  window.TwinleafBoot.setRecovery(()=>{window.TwinleafBoot.setRecovery(initializeNativeRenderer);return initializeNativeRenderer(true);});
  void window.TwinleafBoot.retry();
 }
 updateOpeningProfileUI();showToast('Returned to your preserved default visit. Mock task deadlines still follow real elapsed time.');return true;
}
function prepareOpeningRestart(recovering=false){
 assertCaptureHostIdle();
 // Explicit local reset for this scenario only. Never resume a cancelled owner.
 retireOpeningExitField('scenario-restart');cancelOpeningScene('scenario-restart');if(state.transition?.onCancel)state.transition.onCancel();nativeFieldLifecycle?.invalidate();
 if(suspendedNativeRenderer){suspendedNativeRenderer.dispose();suspendedNativeRenderer=null;}nativeRecoveryNeedsDraw=false;
 const tvOrigin=!!openingProfile.tvOrigin;openingProfile.tvDefaultRequest=null;
 openingProfile.options=window.SourceOptions.settings({...window.SourceOptions.DEFAULTS,frame:tvOrigin?0:17});openingProfile.dialogueFrameId=tvOrigin?0:17;liveButtonMode=0;setOpeningSoundMethod(0);
 openingProfile.npcRandom=window.OriginalMotion.lcg(0);openingProfile.faulted=recovering;openingProfile.recovering=recovering;openingProfile.soundRequests=[];openingProfile.fieldCallback=0;openingProfile.menuRememberedOptionId=0;openingProfile.menuEvents=[];openingProfile.directEvents=[];openingProfile.lastDirect=null;
 state=freshState();state.scene='interior';state.houseId='home';state.roomHeader=415;state.npcs=[];state.originals=[];if(tvOrigin){initializeTvOriginStory();setPlayer(4,6,'up');}else{initializeOpeningStory();setPlayer(7,4,'right');loadOpeningActors(415);}
 fieldGeneration++;nativeFieldLifecycle=window.SourceNativeFieldLifecycle.create({header:415,tile:tvOrigin?[4,6]:[7,4],generation:fieldGeneration,profile:'ordinary-no-poketch'});nativePlayerHeight=null;fieldView=null;lastNativeFrame=null;sceneSnapshot=null;areaTextureHashes=Object.create(null);cameraFrame=0;logicAccumulator=0;worldAnimation.reset(415);mapNamePopup.cancel();
 menuOpen=false;$('notebook-panel').hidden=true;$('menu-button').setAttribute('aria-expanded','false');
 if(nativeRenderer)nativeRenderer.resetCamera(415,worldPosition(state.player));if(tvOrigin)bindTvOriginRuntime();else if(!recovering)installOpeningExitField();resetPresentationPending=true;resetElapsedCaptured=true;
 $('location-name').textContent='Original opening · upstairs415';$('location-note').textContent=recovering?'Rebuilding source renderer':'Explicit bounded fresh scenario';updateUI();updateOpeningProfileUI();
}
function restartOpeningProfile(){
 assertCaptureHostIdle();
 if(!openingProfile||profileSwitchPending)return false;
 if(recordingPhase!=='idle'){showToast('Stop recording before restarting the scenario.');return false;}
 if(openingProfile.recovering||rendererInitPromise){showToast('A renderer recovery is already in progress.');return false;}
 if(openingProfile.faulted||!nativeRenderer||window.TwinleafBoot.snapshot().phase==='blocked'){
  // Restart is explicit approval to rebuild, using the same guarded recovery
  // path as Retry loading. Keep the stopped state until an accepted first draw.
  if(window.TwinleafBoot.snapshot().phase!=='blocked')window.TwinleafBoot.failed('Opening scenario requires a fresh renderer');
  void window.TwinleafBoot.retry();return true;
 }
 prepareOpeningRestart(false);return true;
}
$('opening-profile-start').addEventListener('click',()=>{void enterOpeningProfile();});
$('tv-origin-start').addEventListener('click',()=>{void enterOpeningProfile('tv-origin');});
$('opening-profile-return').addEventListener('click',returnFromOpeningProfile);
$('opening-profile-restart').addEventListener('click',restartOpeningProfile);

function actorHeader(a){return a.id?(a.location==='town'?411:a.roomHeader||W.getHouse(a.houseId).header):(state.scene==='town'?411:state.roomHeader);}
function worldPosition(a){const p=Math.min(1,a.progress),header=actorHeader(a),x=a.fromX+(a.toX-a.fromX)*p,z=a.fromY+(a.toY-a.fromY)*p,y0=W.heightAt(header,a.fromX,a.fromY),y1=W.heightAt(header,a.toX,a.toY);return[16*x-248,a===state.player&&nativePlayerHeight!==null?nativePlayerHeight.yFx12/4096:y0+(y1-y0)*p,16*z-248];}
function helperRenderPosition(a){
 if(!['scout','maker','keeper','home'].includes(a.id))throw Error('Mock helper render actor is not admitted');
 return worldPosition(a).map(value=>{
  if(typeof value!=='number'||!Number.isFinite(value))throw Error('Mock helper render component must be finite');
  const word=Math.round(value*4096);
  if(!Number.isSafeInteger(word)||word<-2147483648||word>2147483647)throw Error('Mock helper render signed32 FX12 overflow');
  return word===0?0:word/4096;
 });
}
function nativeRawPlayer(){
 const header=state.scene==='town'?411:state.roomHeader,position=worldPosition(state.player),origin=W.getHeader(header).events.origin;
 const words=[(position[0]+origin[0]*16+256)*4096,position[1]*4096,(position[2]+origin[1]*16+256)*4096];
 if(!words.every(value=>Number.isInteger(value)&&value>=-2147483648&&value<=2147483647))throw Error('Native field raw player must remain exact signed32 FX12');
 return{x:words[0]===0?0:words[0],y:words[1]===0?0:words[1],z:words[2]===0?0:words[2]};
}
function drawOpeningNativeField(advance){
 const s=openingProfile.exitField,player=state.player,transition=state.transition;if(!openingExitCurrent(s))throw Error('Opening draw context replaced');
 const token=s.bridge.prepareField(nativeRawPlayer());
 try{
  if(advance){worldAnimation.tick(token.header,s.renderer,token.header!==411);worldAnimation.tickDoor();}else worldAnimation.sync(s.renderer);
  const descriptors=s.bridge.renderDescriptors(token);
  for(const[key,value]of Object.entries(descriptors)){const hash=window.SourceNativeBytes.sha256(value.data);if(areaTextureHashes[key]!==hash){s.renderer.replaceTexturePixels(key,value);areaTextureHashes[key]=hash;}}
  const view=lightingPreview.apply(captureSceneSnapshot(false,token));if(window.TwinleafFrameFault)window.TwinleafFrameFault.check('native');
  const frame=s.pair.renderField(view,token,advance,openingExitDrawGuard(s,player,transition,advance));
  fieldView=advance?token:null;sceneSnapshot=view;lastNativeFrame=frame;nativeRecoveryNeedsDraw=false;lightingPreview.markRendered(view);return frame;
 }catch(error){if(s.bridge.snapshot().pendingKind==='field')s.bridge.abort(token);throw error;}
}
function advanceOpeningNativeLifecycle(){
 const s=openingProfile.exitField,t=state.transition,b=s.bridge.snapshot();if(!openingExitCurrent(s))throw Error('Opening lifecycle context replaced');
 let operation=null,input={};
 if(b.stage==='main')return;
 if(b.stage==='exit0'){operation='exit0';input.position=nativeRawPlayer();}
 else if(b.stage==='exit1'||b.stage==='exit2')operation=b.stage;
 else if(b.stage==='absent'&&t?.nativeLocationRequested)operation='location0';
 else if(b.stage==='location1'){
  if(!t?.driver||state.exitReservation!==t.exitReservation)throw Error('Native source location reservation was lost');
  const house=W.getHouse(t.houseId),warp=W.roomWarp(house.header,0);t.nativeDestination=t.kind==='stairs'?{header:t.staircase.target_header,tile:t.staircase.destination_tile.slice()}:t.kind==='entry'?{header:house.header,tile:[warp.local_x,warp.local_z]}:{header:411,tile:[house.doorX,house.doorY]};operation='location1';input=t.nativeDestination;
 }else if(b.stage==='location2'){
  if(!t?.driver||state.exitReservation!==t.exitReservation)throw Error('Native source location reservation was lost');
  if(t.kind==='stairs'){enterRoomImmediate(t.staircase.target_header,t.staircase.target_warp);nativeHeightProfile=Object.freeze({heightDispatch:0,ignoreHeights:false,dynamicRegistryActive:false});nativePlayerHeight=staircaseHeight(t,'loaded_warp',0,[state.player.x*65536+32768,0,state.player.y*65536+32768]);}else if(t.kind==='entry')enterHouseImmediate(t.houseId);else if(leaveHouseImmediate()===false)throw Error('Reserved exit destination changed unexpectedly');
  const raw=nativeRawPlayer();operation='location2';input={actor:state.player,tile:[state.player.x,state.player.y],positionFx12:[raw.x,raw.y,raw.z],facing:PM.directionCode(state.player.facing)};
  t.loaded=true;state.playerHidden=t.kind==='exit';state.cachedPlayerHidden=state.playerHidden;worldAnimation.reset(state.scene==='town'?411:state.roomHeader);sceneSnapshot=null;
 }else if(b.stage==='location-ready'&&t?.nativeRestoreRequested)operation='restore';
 else if(b.stage==='init0'||b.stage==='init2'||b.stage==='init3')operation=b.stage;
 else if(b.stage==='init1'){operation='init1';input={generation:fieldGeneration+1};}
 if(!operation)return;
 const application=openingProfile.optionsSession,applicationVisit=application?application.lifecycleBefore(operation):null,pair=s.pair,token=pair.prepareLifecycle(operation,input);s.lifecycleToken=token;let npcVisit=null;
 try{if(!openingExitCurrent(s)||state.transition!==t||t?.driver&&state.exitReservation!==t.exitReservation)throw Error('Opening lifecycle owner changed before acceptance');if(!application&&['init1','init2','init3'].includes(operation))npcVisit=openingTownInitQueue.prepare(s,t,b,pair,token);pair.commit(token);s.lifecycleToken=null;}
 catch(error){if(s.lifecycleToken===token){pair.abort(token);s.lifecycleToken=null;}throw error;}
 if(['init1','init2','init3'].includes(operation))openingTownInitQueue.accepted(npcVisit,pair,token);
 if(operation==='exit0'){fieldView=null;pair.retire();s.pair=window.SourceFieldEffectTransaction.create({bridge:s.bridge,effect:s.effect});}
 if(operation==='init1'){fieldGeneration=s.bridge.snapshot().generation;s.generation=fieldGeneration;areaTextureHashes=Object.create(null);pair.retire();s.pair=window.SourceFieldEffectTransaction.create({bridge:s.bridge,effect:s.effect,renderer:s.renderer});openingTownInitQueue.rebound(npcVisit,pair,s.pair);}
 if(application)application.lifecycleAfter(applicationVisit,pair);
 if(['init1','init2','init3'].includes(operation)){if(application)application.initQueue();else visitOpeningExitInitQueue(npcVisit);}
}

function drawNativeField(advance=true){
 if(openingProfile?.exitField)return drawOpeningNativeField(advance);
 const token=nativeFieldLifecycle.prepareField(nativeRawPlayer());
 try{
  if(advance){worldAnimation.tick(token.header,nativeRenderer,token.header!==411);worldAnimation.tickDoor();}else worldAnimation.sync(nativeRenderer);
  const descriptors=nativeFieldLifecycle.renderDescriptors(token);
  for(const[key,value]of Object.entries(descriptors)){const hash=window.SourceNativeBytes.sha256(value.data);if(areaTextureHashes[key]!==hash){nativeRenderer.replaceTexturePixels(key,value);areaTextureHashes[key]=hash;}}
  const view=lightingPreview.apply(captureSceneSnapshot(false,token));
  if(window.TwinleafFrameFault)window.TwinleafFrameFault.check('native');
  const frame=nativeRenderer.render(view);if(advance)nativeFieldLifecycle.commit(token);else nativeFieldLifecycle.abort(token);fieldView=advance?token:null;sceneSnapshot=view;lastNativeFrame=frame;nativeRecoveryNeedsDraw=false;lightingPreview.markRendered(view);return frame;
 }catch(error){if(nativeFieldLifecycle.snapshot().pendingKind==='field')nativeFieldLifecycle.abort(token);throw error;}
}
function advanceNativeLifecycle(){
 if(openingProfile?.exitField)return advanceOpeningNativeLifecycle();
 const t=state.transition,s=nativeFieldLifecycle.snapshot();let token=null;
 if(s.stage==='main')return;
 if(s.stage==='exit0')token=nativeFieldLifecycle.prepareExit0(nativeRawPlayer());
 else if(s.stage==='exit1')token=nativeFieldLifecycle.prepareExit1();
 else if(s.stage==='exit2')token=nativeFieldLifecycle.prepareExit2();
 else if(s.stage==='absent'&&t?.nativeLocationRequested)token=nativeFieldLifecycle.prepareLocation0();
 else if(s.stage==='location1'){
  if(!t?.driver||state.exitReservation!==t.exitReservation)throw Error('Native source location reservation was lost');
  const house=W.getHouse(t.houseId),warp=W.roomWarp(house.header,0);t.nativeDestination=t.kind==='stairs'?{header:t.staircase.target_header,tile:t.staircase.destination_tile.slice()}:t.kind==='entry'?{header:house.header,tile:[warp.local_x,warp.local_z]}:{header:411,tile:[house.doorX,house.doorY]};
  token=nativeFieldLifecycle.prepareLocation1(t.nativeDestination);
 }else if(s.stage==='location2'){
  if(!t?.driver||state.exitReservation!==t.exitReservation)throw Error('Native source location reservation was lost');
  if(t.kind==='stairs'){enterRoomImmediate(t.staircase.target_header,t.staircase.target_warp);nativeHeightProfile=Object.freeze({heightDispatch:0,ignoreHeights:false,dynamicRegistryActive:false});nativePlayerHeight=staircaseHeight(t,'loaded_warp',0,[state.player.x*65536+32768,0,state.player.y*65536+32768]);}else if(t.kind==='entry')enterHouseImmediate(t.houseId);else if(leaveHouseImmediate()===false)throw Error('Reserved exit destination changed unexpectedly');
  token=nativeFieldLifecycle.prepareLocation2();t.loaded=true;state.playerHidden=t.kind==='exit';state.cachedPlayerHidden=state.playerHidden;worldAnimation.reset(state.scene==='town'?411:state.roomHeader);sceneSnapshot=null;
 }else if(s.stage==='location-ready'&&t?.nativeRestoreRequested)token=nativeFieldLifecycle.prepareRestore();
 else if(s.stage==='init0')token=nativeFieldLifecycle.prepareInit0();
 else if(s.stage==='init1')token=nativeFieldLifecycle.prepareInit1({generation:fieldGeneration+1});
 else if(s.stage==='init2')token=nativeFieldLifecycle.prepareInit2();
 else if(s.stage==='init3')token=nativeFieldLifecycle.prepareInit3();
 if(token){nativeFieldLifecycle.commit(token);if(token.kind==='init1'){fieldGeneration=token.createdGeneration;areaTextureHashes=Object.create(null);}if(token.kind==='exit0')fieldView=null;}
}
function creaturePortrait(id){const c=document.createElement('canvas');c.width=40;c.height=40;const pc=c.getContext('2d');pc.imageSmoothingEnabled=false;const img=nativeAtlases[id],frame=window.NativeSpriteData[id].frames.find(f=>f.direction==='down'&&f.phase===0);const draw=()=>{pc.clearRect(0,0,40,40);pc.drawImage(img,frame.x,frame.y,32,32,4,4,32,32);};if(img.complete&&img.naturalWidth)draw();else img.addEventListener('load',draw,{once:true});c.style.width='36px';c.style.height='36px';c.style.imageRendering='pixelated';c.setAttribute('aria-hidden','true');return c;}
function nativeFrame(id,a){if(id==='player')return PM.frame(a,window.NativeSpriteData.player.frames);if(O.data.sprites[id])return O.frame(a,O.data.sprites[id].frames);const info=window.NativeSpriteData[id]||O.data.sprites[id],moving=a.progress<1,action='walk',phase=moving?((a.step%2)*2+Math.floor(a.progress*2))%4:0;return info.frames.find(f=>f.direction===a.facing&&f.action===action&&f.phase===phase)||info.frames.find(f=>f.direction===a.facing&&f.action==='walk'&&f.phase===0);}
function screenText(text,x,y,size=18,color='#27313e'){screen.font=size+'px monospace';screen.fillStyle=color;screen.textAlign='left';screen.fillText(text,x,y);}
function wrapScreen(text,width,font=18){screen.font=font+'px monospace';const lines=[];let line='';for(const word of String(text).split(/\s+/)){const next=line?line+' '+word:word;if(screen.measureText(next).width>width&&line){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;}
function fieldText(text,x,y){const atlas=fieldImages['font-1-rgba.png'];if(atlas.complete&&atlas.naturalWidth)F.draw(screen,atlas,text,x,y,2);}
function fieldMenu(x,y,w,h){
 const image=fieldImages['menu-frame-tiles.png'];if(!image.complete||!image.naturalWidth)return;
 // Nine source 8x8 tiles. Repeat border/interior tiles without scaling pixels.
 for(let row=0;row<h;row+=16)for(let col=0;col<w;col+=16){const sx=col===0?0:col>=w-16?16:8,sy=row===0?0:row>=h-16?16:8;screen.drawImage(image,sx,sy,8,8,x+col,y+row,16,16);}
}
function originalDialogueFrameAssets(frameId){
 if(frameId===0)return{frame:fieldImages['frame-0-dialogue-256x48.png'],arrows:[0,1,2].map(i=>fieldImages['default-frame-continuation-arrow-'+i+'.png'])};
 if(frameId===17)return referenceDialogueImages;
 if(!openingProfile)throw Error('Unadmitted default dialogue frame option '+frameId);
 const cache=openingProfile.frameAssets||(openingProfile.frameAssets=new Map());if(!cache.has(frameId)){const frame=window.SourceOptionsArt.fieldFrame(optionsArtAssets(),frameId);cache.set(frameId,{frame:optionsNativeSurface(frame.frame,256,48),arrows:frame.arrows.map(a=>optionsNativeSurface(a,16,16))});}return cache.get(frameId);
}
function drawOriginalCanvasDialog(){
 const snapshot=state.originalPrinter.snapshot(),assets=originalDialogueFrameAssets(state.dialog.dialogueFrameId??0),frame=assets.frame,atlas=fieldImages['font-1-rgba.png'];
 if(frame instanceof HTMLCanvasElement||frame.complete&&frame.naturalWidth)screen.drawImage(frame,0,288,512,96);
 if(atlas.complete&&atlas.naturalWidth)DI.draw(screen,atlas,F.data,snapshot.publishedText,32,304,2);
 if(snapshot.arrowFrame!==null){const arrow=assets.arrows[snapshot.arrowFrame];if(arrow instanceof HTMLCanvasElement||arrow.complete&&arrow.naturalWidth)screen.drawImage(arrow,480,336,32,32);}
 dialogHitAreas.push({x:0,y:288,w:512,h:96,advance:true});

}
function advanceOriginalDialog(){if(state.dialog?.homeScene||state.dialog?.profileDirect){openingProfile.edges.pulse('A');return;}if(state.dialog?.type==='original'&&state.originalPrinter)state.originalPrinter.requestAdvance();}
function updateOriginalDialog(dt){
 const printer=state.originalPrinter,before=printer.frame;
 const snapshot=printer.advance(dt,{heldA:['e','z',' ','Enter','pointer'].some(k=>dialogHeldKeys.has(k)),heldB:dialogHeldKeys.has('b'),scriptContinue:state.originalScriptContinue});
 if(printer.frame!==before)state.originalScriptContinue=false;
 for(const event of snapshot.events)if(event.type==='continue')playEffect(1500);
 if(snapshot.finished)closeDialog();
}
function handleOriginalDialogKey(event,key){
 if(key==='Escape'){event.preventDefault();if(!event.repeat){playEffect(1500);closeDialog();}return;}
 if(key==='Tab'){event.preventDefault();(document.activeElement===$('original-close')?$('original-continue'):$('original-close')).focus();return;}
 if(['e','z',' ','Enter','b'].includes(key)){
  event.preventDefault();dialogHeldKeys.add(key);if(event.repeat)return;
  if(key!=='b'&&document.activeElement===$('original-close')){playEffect(1500);closeDialog();return;}
  advanceOriginalDialog();return;
 }
 if(!event.repeat&&state.originalPrinter.state==='wait_button'&&(keyDir[key]||key==='x')){
  event.preventDefault();if(keyDir[key])state.player.facing=keyDir[key];state.originalScriptContinue=true;return;
 }
 // Original dialogue never invokes the added mock menu or player movement.
 if(keyDir[key]||key==='x')event.preventDefault();
}
function drawCanvasDialog(){
 dialogHitAreas=[];if(!state.dialog)return;if(state.dialog.type==='original'){drawOriginalCanvasDialog();return;}
 const allPages=F.pages($('dialog-text').textContent),page=Math.min(state.dialogPage,allPages.length-1),ready=dialogPageReady(),last=page===allPages.length-1&&ready;
 const frame=fieldImages['frame-0-dialogue-256x48.png'];if(frame instanceof HTMLCanvasElement||frame.complete&&frame.naturalWidth)screen.drawImage(frame,0,288,512,96);
 (state.textPrinter?R.visible(state.textPrinter):allPages[page]).split('\n').forEach((line,i)=>fieldText(line,32,304+i*32));
 if(!last&&ready){const sequence=[0,1,2,1],arrow=fieldImages['default-frame-continuation-arrow-'+(state.textPrinter?R.arrowFrame(state.textPrinter):sequence[0])+'.png'];if(arrow instanceof HTMLCanvasElement||arrow.complete&&arrow.naturalWidth)screen.drawImage(arrow,480,336,32,32);}
 if(!last)dialogHitAreas.push({x:0,y:288,w:512,h:96,advance:true});
 const buttons=last?Array.from($('dialog-actions').querySelectorAll('button')):[];buttons.push($('dialog-close'));
 const title=$('dialog-name').textContent,rawWidth=Math.max(F.measure(title),...buttons.map(b=>F.measure(b.textContent)+12))+16,width=Math.min(480,Math.max(160,Math.ceil(rawWidth*2/16)*16));
 const height=(buttons.length+1)*32+32,x=512-width-8,y=280-height;fieldMenu(x,y,width,height);fieldText(title,x+16,y+16);
 buttons.forEach((button,i)=>{const by=y+48+i*32,active=document.activeElement===button;screen.save();if(button.disabled)screen.globalAlpha=.45;fieldText((active?'→ ':'  ')+button.textContent,x+16,by);screen.restore();dialogHitAreas.push({x:x+8,y:by,w:width-16,h:32,button});});
}
function dialogPageReady(){if(state.dialog?.type==='original')return !!state.originalPrinter.snapshot().waiting;return !state.textPrinter||state.textPrinter.done;}
function preferredDialogChoice(actions){
 const buttons=Array.from(actions.querySelectorAll('button')),preferred=buttons[state.dialog?.preferredChoiceIndex];
 return preferred&&!preferred.disabled?preferred:actions.querySelector('button:not(:disabled)');
}
function focusDialogChoice(preferred){
 if(state.dialog?.type==='original'){$('dialog-actions').hidden=true;(preferred===$('original-close')?preferred:$('original-continue')).focus();return;}
 const actions=$('dialog-actions'),buttons=Array.from(actions.querySelectorAll('button')),index=buttons.indexOf(preferred),last=state.dialogPage>=F.pages($('dialog-text').textContent).length-1&&dialogPageReady();actions.hidden=!last;
 // A requested action may not be visible until the final text page. Preserve
 // that logical preference without focusing an invisible native control.
 if(state.dialog&&index>=0&&!preferred.disabled)state.dialog.preferredChoiceIndex=index;
 const visible=preferred===$('dialog-close')||last&&actions.contains(preferred)&&!preferred.disabled;
 const target=visible?preferred:last?preferredDialogChoice(actions)||$('dialog-close'):$('dialog');target.focus({preventScroll:true});
}
function advanceDialogPage(){if(!dialogPageReady())return false;const pages=F.pages($('dialog-text').textContent);if(state.dialogPage>=pages.length-1)return false;state.dialogPage++;state.textPrinter=R.create(pages[state.dialogPage],state.textPrinter);focusDialogChoice(document.activeElement);return true;}
function advanceDialog(){if(!state.dialog)return;if(state.dialog.type==='original'){if(document.activeElement===$('original-close')){playEffect(1500);closeDialog();}else advanceOriginalDialog();return;}const actions=$('dialog-actions'),focused=document.activeElement;if(focused===$('dialog-close')){playEffect(1500);closeDialog();return;}if(!dialogPageReady()){R.request(state.textPrinter);return;}playEffect(1500);if(advanceDialogPage())return;const button=focused&&!focused.disabled&&actions.contains(focused)?focused:preferredDialogChoice(actions);if(button)button.click();else closeDialog();}
function drawLowerScreen(){
 const fade=openingProfile?.optionsSession?.snapshot().fade||state.transition?.driver?.snapshot().fade||tvOriginFieldFade(),brightness=fade?.bottomBrightness??0;
 let cached=drawLowerScreen.nativeSurface;
 if(!cached||cached.brightness!==brightness){
  // A failed update must never retain a brightness tag for a partially written surface.
  drawLowerScreen.nativeSurface=null;
  const native=window.NativeLowerScreen.render(brightness);
  if(native.width!==256||native.height!==192||native.rgba.length!==256*192*4)throw Error('Native lower display source framebuffer is unavailable');
  const surface=cached?cached.surface:document.createElement('canvas');if(!cached){surface.width=256;surface.height=192;}
  const context=surface.getContext('2d'),image=context.createImageData(256,192);image.data.set(native.rgba);context.putImageData(image,0,0);
  cached={brightness,surface};drawLowerScreen.nativeSurface=cached;
 }
 screen.drawImage(cached.surface,0,384,512,384);
 if(menuOpen){
  screen.fillStyle='#e7edf1';screen.fillRect(10,397,492,357);screen.fillStyle='#344760';screen.fillRect(14,401,484,27);screenText('FABLE 5.2 SESSIONS',25,420,15,'#fff');
  screenText('Houses '+state.visited.size+'/4   Sessions met '+state.met.size+'/4',25,450,14,'#506077');
  W.houses.forEach((h,i)=>{const task=state.tasks.find(t=>t.id===h.id),status=task?task.status:state.npcs.find(n=>n.id===h.id).location==='interior'?'idle · indoors':'idle · on a walk';screenText(h.resident+'  '+status,25,476+i*24,16);});
  const task=state.tasks[state.tasks.length-1];if(task){const h=W.getHouse(task.id);screenText(h.task,25,584,15,'#33475b');const content=task.status==='ready'?h.result:'Fable 5.2 session: '+task.status;wrapScreen(content,455,14).slice(0,7).forEach((line,i)=>screenText(line,25,609+i*19,14));}
  screenText('X: close · four sessions, zero meetings',25,743,11,'#67768b');
 }
}
// Source MASTER_BRIGHT darkening applies to native RGB6 before display expansion.
function sourceMasterBrightness6(rgba,factor){
 if(!Number.isInteger(factor)||factor<0||factor>16||!rgba||!Number.isInteger(rgba.length)||rgba.length%4)throw Error('Invalid native master-brightness input');
 const out=new Uint8ClampedArray(rgba.length);
 for(let i=0;i<rgba.length;i+=4){
  for(let k=0;k<3;k++){const value=rgba[i+k],c=value>>2;if(value!==((c<<2)|(c>>4)))throw Error('Native master-brightness requires canonical RGB6');const d=c-((c*factor+15)>>4);out[i+k]=(d<<2)|(d>>4);}
  out[i+3]=rgba[i+3];
 }
 return out;
}
function nativeUpperSurface(frame){
 const fade=openingProfile?.optionsSession?.snapshot().fade||state.transition?.driver?.snapshot().fade||tvOriginFieldFade();
 const factor=fade&&!fade.windowAttached&&fade.topBrightness<0?-fade.topBrightness:0;
 const popup=mapNamePopup,menu=openingProfile?.menu?.render();
 if(!menu&&!factor&&!popup.snapshot().active&&!sourceBoard.snapshot().overlayPresent)return frame.canvas;
 if(!frame.native?.rgba||frame.native.rgba.length!==256*192*4)throw Error('Native upper display source framebuffer is unavailable');
 let composed=window.SourceBoardHost.composite(sourceBoard.snapshot(),popup.composite(frame.native.rgba));
 if(menu){
  if(menu.composite?.length!==256*192)throw Error('Original menu native framebuffer is invalid');
  composed=new Uint8ClampedArray(composed);
  for(let i=0;i<menu.composite.length;i++){const pixel=menu.composite[i];if(!pixel)continue;const at=i*4;for(let c=0;c<3;c++){const value=(pixel>>>(c*8))&255;if(value>63)throw Error('Original menu color is not RGB6');composed[at+c]=(value<<2)|(value>>4);}composed[at+3]=255;}
 }
 if(!factor&&composed===frame.native.rgba)return frame.canvas;
 let surface=nativeUpperSurface.surface;
 if(!surface){surface=document.createElement('canvas');surface.width=256;surface.height=192;nativeUpperSurface.surface=surface;}
 const context=surface.getContext('2d'),image=context.createImageData(256,192);
 image.data.set(factor?sourceMasterBrightness6(composed,factor):composed);context.putImageData(image,0,0);return surface;
}
function render(time){
 try{
 if(window.TwinleafFrameFault)window.TwinleafFrameFault.check('clear');
 screen.clearRect(0,0,512,768);
 if(renderTvOrigin())return true;
 if(renderOpeningOptions()){$('interaction-status').hidden=true;$('toast-status').hidden=true;return true;}
 $('interaction-status').hidden=!!(!nativeRenderer||menuOpen||state.transition||state.dialog||sourceBoardBusy());
 $('toast-status').hidden=!!(!nativeRenderer||state.transition);
 if(!nativeRenderer){screen.fillStyle='#080a10';screen.fillRect(0,0,512,384);screenText(rendererError?'Source renderer unavailable':'Loading original source geometry…',20,175,16,'#eef2f5');if(rendererError)wrapScreen(rendererError,460,13).slice(0,4).forEach((line,i)=>screenText(line,20,204+i*18,13,'#f4c9c9'));drawLowerScreen();return;}
  let frame;
  if(nativeFieldLifecycle){if(!lastNativeFrame){if(!nativeFieldLifecycle.snapshot().canDraw)throw Error('Native field has no accepted picture during lifecycle transition');drawNativeField(false);}frame=lastNativeFrame;}
  else{worldAnimation.sync(nativeRenderer);const view=lightingPreview.apply(sceneSnapshot||captureSceneSnapshot(false));if(window.TwinleafFrameFault)window.TwinleafFrameFault.check('native');frame=nativeRenderer.render(view);lightingPreview.markRendered(view);}
  updateLightingStatus(frame.stats);screen.imageSmoothingEnabled=false;screen.drawImage(nativeUpperSurface(frame),0,0,512,384);



 if(window.TwinleafFrameFault)window.TwinleafFrameFault.check('lower');
 drawLowerScreen();
 if(state.transition){if(window.TwinleafFrameFault)window.TwinleafFrameFault.check('transition');drawTransitionFade();}
 else if(state.dialog){if(window.TwinleafFrameFault)window.TwinleafFrameFault.check('dialogue');drawCanvasDialog();}
 if(!$('toast').hidden&&!state.transition&&window.TwinleafFrameFault)window.TwinleafFrameFault.check('toast');
  if(!nativeRenderReady&&!nativeRecoveryNeedsDraw){if(!window.TwinleafBoot.ready())throw new Error('Startup state did not accept the first rendered frame');nativeRenderReady=true;$('location-note').textContent='CPU source mesh · ready';$('record-button').disabled=false;if(rendererReadyWaiter&&rendererReadyWaiter.owner===rendererInitOwner){const waiter=rendererReadyWaiter;rendererReadyWaiter=null;waiter.resolve();}}
  return true;
 }catch(error){failRenderedFrame(error);}
}
function failRenderedFrame(error){
 invalidateNativeInitialization();window.TwinleafBoot.cancelRecovery();
 // A pending profile owns only its construction promise, not the default
 // renderer after a fault. A late resolve may dispose itself but never install.
 if(profileSwitchPending){profileSwitchPending=false;profileSwitchToken=null;updateOpeningProfileUI();}
 if(openingProfile){retireOpeningExitField('render-fault');cancelOpeningScene('render-fault');openingProfile.faulted=true;openingProfile.recovering=false;updateOpeningProfileUI();}
 if(resetPresentationPending)resetElapsedCaptured=true;
 rendererError=error&&error.message?error.message:String(error);const failed=nativeRenderer,retainSource=!!(nativeFieldLifecycle&&state.transition?.driver);nativeRenderer=null;nativeRenderReady=false;if(retainSource&&failed)suspendedNativeRenderer=failed;
 // Every cleanup step is attempted independently: a failed drawing/disposal/UI sink
 // must not strand a recorder or prevent the next recovery-capable frame.
 const attempt=fn=>{try{fn();}catch(_){}};
 attempt(()=>cancelSourceBoard('render-failure'));
 attempt(()=>{originalMotion.releaseDialog();state.pendingOriginalId=null;state.pendingOriginalSession=null;});
 attempt(()=>{if(state.dialog?.type==='original')closeDialog();});
 attempt(()=>{if(!retainSource){if(state.transition&&state.transition.onCancel)state.transition.onCancel();state.transition=null;state.exitReservation=null;}});
 attempt(()=>{if(failed&&!retainSource)failed.dispose();});
 attempt(()=>{if(rendererReadyWaiter){const waiter=rendererReadyWaiter;rendererReadyWaiter=null;waiter.reject(error);}});
 attempt(()=>{if(recordingAbort)recordingAbort('Source renderer failed: '+rendererError);});
 attempt(()=>{$('record-button').disabled=true;});
 attempt(()=>{window.TwinleafBoot.failed(rendererError);});
 attempt(()=>{$('location-note').textContent='Renderer blocked: '+rendererError;});
}

function canMove(x,y,actor){
 if(O.at(state.originals,state.scene==='town'?411:state.roomHeader,x,y))return false;
 if(state.scene==='interior')return !W.interiorBlocked(x,y,state.roomHeader)&&!state.npcs.some(n=>n.location==='interior'&&n.roomHeader===state.roomHeader&&n.x===x&&n.y===y);
 if(W.townBlocked(x,y))return false;
 return !state.npcs.some(n=>n.location==='town'&&n.id!==actor&&((n.x===x&&n.y===y)||(n.toX===x&&n.toY===y&&n.progress<1)));
}
function townNPCBlocked(x,y,n){
 const lease=state.exitReservation;if(lease&&((lease.x===x&&lease.y===y)||(lease.cells||[]).some(c=>c.x===x&&c.y===y)))return true;
 if(W.townBlocked(x,y)||O.at(state.originals||[],411,x,y))return true;
 if(state.scene==='town'&&PM.reserves(state.player,x,y))return true;
 return state.npcs.some(o=>o.id!==n.id&&o.location==='town'&&((o.x===x&&o.y===y)||(o.progress<1&&o.toX===x&&o.toY===y)));
}
function tryDoorYield(n,target){
 const passage=W.houses.find(h=>n.x===h.doorX&&n.y===h.doorY+1);if(!passage)return false;target=passage;
 const exiting=state.npcs.find(o=>o.id!==n.id&&o.location==='town'&&o.x===target.doorX&&o.y===target.doorY&&o.targetHouse!==target.id);
 if(!exiting)return false;
 // The approach agent yields one legal cell. The exiting agent cannot move
 // sideways from the one-cell doorway, so it has priority over a new visit.
 for(const dir of ['left','right','down']){
  const [dx,dy]=dirs[dir],x=n.x+dx,y=n.y+dy;if(townNPCBlocked(x,y,n))continue;
  n.facing=dir;n.fromX=n.x;n.fromY=n.y;n.toX=x;n.toY=y;n.progress=0;n.step++;
  n.yieldFor=exiting.id;n.yieldDoor={x:target.doorX,y:target.doorY};n.yieldRemaining=2.4;n.yieldCount=(n.yieldCount||0)+1;n.wait=.1;
  return true;
 }
 return false;
}
function tryDoorQueueYield(n){
 // A full approach queue can trap the approach agent even though the side
 // blockers have free escape cells. A stationary side blocker moves per call,
 // away from the doorway, while preserving every actor reservation.
 for(const house of W.houses){
  if(n.y!==house.doorY+1||Math.abs(n.x-house.doorX)!==1)continue;
  const exiting=state.npcs.find(o=>o.id!==n.id&&o.location==='town'&&o.x===house.doorX&&o.y===house.doorY&&o.targetHouse!==house.id);
  const approach=state.npcs.find(o=>o.id!==n.id&&o.location==='town'&&o.x===house.doorX&&o.y===house.doorY+1&&o.progress===1);
  if(!exiting||!approach)continue;
  // If the approach already has a free escape, let it resolve the queue.
  if(['left','right','down'].some(dir=>{const [dx,dy]=dirs[dir];return !townNPCBlocked(approach.x+dx,approach.y+dy,approach);}))continue;
  const outward=n.x<house.doorX?'left':'right';
  for(const dir of [outward,'down','up']){
   const [dx,dy]=dirs[dir],x=n.x+dx,y=n.y+dy;if(townNPCBlocked(x,y,n))continue;
   n.facing=dir;n.fromX=n.x;n.fromY=n.y;n.toX=x;n.toY=y;n.progress=0;n.step++;
   n.yieldFor=exiting.id;n.yieldDoor={x:house.doorX,y:house.doorY};n.yieldRemaining=2.4;n.yieldCount=(n.yieldCount||0)+1;n.queueYieldCount=(n.queueYieldCount||0)+1;n.wait=.1;
   return true;
  }
 }
 return false;
}
function tryClearDoorway(n){
 const house=W.houses.find(h=>n.targetHouse!==h.id&&n.x===h.doorX&&(n.y===h.doorY||n.y===h.doorY+1));
 if(!house)return false;
 const choices=n.y===house.doorY?['down']:['left','right','down'];
 for(const dir of choices){const [dx,dy]=dirs[dir],x=n.x+dx,y=n.y+dy;if(townNPCBlocked(x,y,n))continue;n.facing=dir;n.fromX=n.x;n.fromY=n.y;n.toX=x;n.toY=y;n.progress=0;n.step++;n.wait=.12;n.doorClearCount=(n.doorClearCount||0)+1;return true;}
 return false;
}
function pickVisitingSpot(header,index){
 for(let i=0;i<12;i++){const spot=W.pickRoomSpot(header,index+i),x=spot.x,y=spot.y;if(O.at(state.originals||[],header,x,y))continue;if(state.npcs.some(o=>o.location==='interior'&&o.roomHeader===header&&W.tileReserved(o,x,y)))continue;if(state.scene==='interior'&&state.roomHeader===header&&PM.reserves(state.player,x,y))continue;return spot;}return null;
}
function updateNPC(n,dt){
 const index=W.houses.findIndex(h=>h.id===n.id);
 if(n.location==='interior'){
  n.indoorTime-=dt;
  if(n.indoorTime<=0){
   const h=W.getHouse(n.houseId);
   if(townNPCBlocked(h.doorX,h.doorY,n)){n.indoorTime=.6;return;}
   n.location='town';n.houseId=null;n.roomHeader=null;n.x=n.fromX=n.toX=h.doorX;n.y=n.fromY=n.toY=h.doorY;n.progress=1;n.facing='down';n.wait=.7;
   n.visitIndex=(n.visitIndex+1)%W.houses.length;n.targetHouse=W.houses[n.visitIndex].id;updateUI();
  }
  return;
 }
 advanceActor(n,dt,.28);if(n.progress<1)return;
 if(n.yieldFor){const exiting=state.npcs.find(o=>o.id===n.yieldFor),door=n.yieldDoor;n.yieldRemaining-=dt;const passageBusy=exiting&&exiting.location==='town'&&(W.tileReserved(exiting,door.x,door.y)||W.tileReserved(exiting,door.x,door.y+1));if(passageBusy&&n.yieldRemaining>0)return;n.yieldFor=null;n.yieldDoor=null;}
 n.wait-=dt;if(n.wait>0)return;
 const target=W.getHouse(n.targetHouse);
 if(n.x===target.doorX&&n.y===target.doorY){
  const spot=pickVisitingSpot(target.header,index);if(!spot){n.wait=.6;return;}const tx=spot.x,ty=spot.y;
  if(state.scene==='interior'&&state.roomHeader===target.header&&PM.reserves(state.player,tx,ty)){n.wait=.6;return;}
  n.location='interior';n.houseId=target.id;n.roomHeader=target.header;n.x=n.fromX=n.toX=tx;n.y=n.fromY=n.toY=ty;n.progress=1;n.facing='down';n.indoorTime=8+index*2;updateUI();return;
 }
 const path=W.findPath(n,{x:target.doorX,y:target.doorY},(x,y)=>townNPCBlocked(x,y,n));
 if(!path||!path.length){if(tryDoorYield(n,target)||tryDoorQueueYield(n)||tryClearDoorway(n))return;n.wait=.8;return;}
 const dir=path[0],[dx,dy]=dirs[dir];n.facing=dir;n.fromX=n.x;n.fromY=n.y;n.toX=n.x+dx;n.toY=n.y+dy;n.progress=0;n.step++;n.wait=.12;
}
// Bounded opening-profile sound request gate, not collision/warp emulation.
// Destination bit15 establishes the native terrain-collision branch. Keep
// actor-only/diagnostic-mask blockage unchanged; preserve 56D58 fall-through.
function openingTerrainBumpSilent(actor,dir){
 if(!openingProfile||actor!==state.player)return false;
 const rows=W.getScene(state.scene==='town'?411:state.roomHeader).permission_u16_rows;
 const d=PM.directionCode(dir),[dx,dy]=dirs[dir],current=rows[actor.y]?.[actor.x],target=rows[actor.y+dy]?.[actor.x+dx];
 if(!Number.isInteger(current)||current<0||current>65535||!Number.isInteger(target)||target<0||target>65535||!(target&0x8000))return false;
 const behavior=current&255;
 return d===0&&behavior===0x64||d<=1&&behavior===0x65||d<=2&&behavior===0x63||behavior===0x62||(target&255)===0x69;
}
function beginStep(a,dir,isPlayer,selection=null){
 if(openingOwnsField()||profileSwitchPending)return false;
 if(isPlayer&&(state.transition||state.pendingOriginalId||!PM.inputReady(a)))return false;
 const [dx,dy]=dirs[dir],nx=a.x+dx,ny=a.y+dy;
 const ordinaryDoor=isPlayer&&state.scene==='town'?W.houses.find(h=>h.doorX===nx&&h.doorY===ny):null;
 if(isPlayer&&state.scene==='town'&&dir==='up'&&a.facing===dir){const house=W.houses.find(h=>h.doorX===nx&&h.doorY===ny);if(house){enterHouse(house.id);return !!state.transition;}}
 // Source0x8069 retains bit15 collision; only the door task's forced walk bypasses it.
 const blocked=!!ordinaryDoor||!canMove(nx,ny,isPlayer?'player':a.id);
 if(isPlayer){const hadCollision=PM.hasCollision(a),result=PM.request(a,dir,{heldB:keys.has('b'),ownsRunningShoes:state.ownsRunningShoes,blocked});openingExitClearHeld(a,hadCollision,result);if(result.accepted&&selection)state.playerInput={horizontal:selection.horizontal,vertical:selection.vertical,queuedFacing:selection.direction};if(result.kind==='blocked'){if(!ordinaryDoor&&!openingTerrainBumpSilent(a,dir))playEffect(1537);state.bumpDirection=dir;return false;}state.bumpDirection=null;return result.kind!=='busy';}
 a.facing=dir;if(blocked)return false;a.fromX=a.x;a.fromY=a.y;a.toX=nx;a.toY=ny;a.progress=0;a.step++;return true;
}
function advanceActor(a,dt,duration){if(a.progress<1){a.progress=Math.min(1,a.progress+dt/duration);if(a.progress===1){a.x=a.toX;a.y=a.toY;a.fromX=a.x;a.fromY=a.y;}}}
function setPlayer(x,y,facing='up'){sceneSnapshot=null;nativePlayerHeight=null;state.playerInput={horizontal:-1,vertical:-1,queuedFacing:-1};state.player={x,y,fromX:x,fromY:y,toX:x,toY:y,progress:1,facing,step:0};keys.clear();}
function enterRoomImmediate(header,warpIndex=0){if(openingProfile)cancelOpeningScene('map-replacement',header);state.scene='interior';state.roomHeader=header;const warp=W.roomWarp(header,warpIndex);setPlayer(warp.local_x,warp.local_z);if(openingProfile)loadOpeningActors(header);state.warpLock=header+':'+warp.local_x+','+warp.local_z;$('location-name').textContent='House · source map '+header;$('location-note').textContent='Original room geometry';updateUI();}
function enterHouseImmediate(id){const h=W.getHouse(id);state.houseId=id;state.visited.add(id);enterRoomImmediate(h.header,0);}
function leaveHouseImmediate(){const h=W.getHouse(state.houseId);if(state.npcs.some(n=>n.location==='town'&&W.tileReserved(n,h.doorX,h.doorY))||(state.originals||[]).some(n=>n.header===411&&O.tileReserved(n,h.doorX,h.doorY))){showToast('A neighbor is in the doorway. Please try again.');return false;}if(openingProfile)cancelOpeningScene('map-replacement',411);state.scene='town';state.houseId=null;state.roomHeader=null;setPlayer(h.doorX,h.doorY,'down');if(openingProfile)loadOpeningActors(411);state.warpLock=null;$('location-name').textContent='Twinleaf Town';$('location-note').textContent='Source-derived scene';}
function startTransition(apply){if(typeof nativeFieldLifecycle!=='undefined'&&nativeFieldLifecycle){showToast('Source staircase transition is not admitted yet.');return false;}if(state.transition)return;cancelSourceBoard('transition');keys.clear();state.transition={elapsed:0,applied:false,apply};}
function destinationBusy(header,x,y){return state.npcs.some(n=>actorHeader(n)===header&&W.tileReserved(n,x,y))||(state.originals||[]).some(n=>n.header===header&&O.tileReserved(n,x,y));}
function beginSourceWarp(kind,h){
 if(openingOwnsField()||profileSwitchPending)return false;
 if(state.transition||state.exitReservation)return false;
 const p=state.player;if(p.progress<1||!PM.inputReady(p))return false;
 if(kind==='entry'&&(state.scene!=='town'||p.x!==h.doorX||p.y!==h.doorY+1))return false;
 if(kind==='exit'&&(state.scene!=='interior'||!W.getHeader(state.roomHeader).events.warps.some(w=>w.target_header===411&&w.local_x===p.x&&w.local_z===p.y)))return false;
 const roomWarp=W.roomWarp(h.header,0),cells=[{x:h.doorX,y:h.doorY},{x:h.doorX,y:h.doorY+1}];
 if(kind==='entry'?(destinationBusy(411,h.doorX,h.doorY)||destinationBusy(h.header,roomWarp.local_x,roomWarp.local_z)):cells.some(c=>destinationBusy(411,c.x,c.y))){showToast('A neighbor is in the doorway. Please try again.');return false;}
 const lease=Object.freeze({houseId:h.id,x:h.doorX,y:h.doorY,cells:Object.freeze(cells.map(c=>Object.freeze(c)))});state.exitReservation=lease;
 const originalPlayer=JSON.parse(JSON.stringify(p)),originalHidden=state.playerHidden;
 const release=()=>{if(state.exitReservation===lease)state.exitReservation=null;};
 try{
  const driver=window.SourceWarp.create({kind,startTile:[p.x,p.y]});keys.clear();p.facing=kind==='entry'?'up':'down';
  const t={kind,houseId:h.id,driver,elapsed:0,loaded:false,exitReservation:lease,ready:{unloadComplete:false,loadComplete:false,restoreComplete:false},onFinish(){state.playerHidden=false;state.cachedPlayerHidden=false;state.forcedWalk=null;worldAnimation.clearDoor();release();},onCancel(){state.forcedWalk=null;worldAnimation.clearDoor();if(!t.loaded){state.player={...originalPlayer};state.playerHidden=originalHidden;state.cachedPlayerHidden=originalHidden;}else{const current=state.player;setPlayer(current.x,current.y,current.facing);state.playerHidden=false;state.cachedPlayerHidden=false;}sceneSnapshot=null;release();}};
  cancelSourceBoard('source-warp');state.transition=t;mapNamePopup.cancel();return true;
 }catch(error){release();throw error;}
}
function staircaseHeight(t,phase,index,raw){
 try{const header=state.scene==='town'?411:state.roomHeader,c=W.getHeader(header).cells;
 if(!nativeHeightProfile||c.length!==1||c[0].x!==0||c[0].z!==0||c[0].altitude!==0||c[0].header!==header)throw Error('Source staircase height profile or resident cell is unsupported');
 return window.SourceStaircaseHeight.sample({caseId:t.staircase.id,phase,index,header,land:c[0].land,rawFx12:raw,...nativeHeightProfile});}catch(error){if(state.transition===t)t.sourceAdmissionError=error.message;throw error;}
}
function beginSourceStaircase(warp){
 if(openingOwnsField()||profileSwitchPending)return false;
 if(!nativeFieldLifecycle||state.transition||state.exitReservation||state.dialog||state.pendingOriginalId)return false;
 const p=state.player;if(p.progress!==1||!PM.inputReady(p))return false;
 const facing=PM.directionCode(p.facing),heldMask=[...keys].reduce((mask,key)=>mask|({up:0x40,down:0x80,left:0x20,right:0x10}[keyDir[key]]||0),0),scene=W.getScene(state.roomHeader),permission=scene.permission_u16_rows[p.y][p.x],front=dirs[p.facing],frontPermission=scene.permission_u16_rows[p.y+front[1]]?.[p.x+front[0]];
 const source=window.SourceStaircase.cases.find(c=>c.header===state.roomHeader&&c.warp_index===warp.index&&c.facing===facing&&(heldMask&c.held_mask));if(!source)return false;
 const input={header:state.roomHeader,warpIndex:warp.index,tile:[p.x,p.y],behavior:permission&255,facing,heldMask,frontPermission,targetHeader:warp.target_header,targetWarp:warp.target_warp,inputEligible:true},staircase=window.SourceStaircase.admit(input),probe={staircase},raw=nativeRawPlayer(),height=staircaseHeight(probe,'start',0,[raw.x,raw.y,raw.z]);
 const cells=[{header:staircase.header,x:staircase.front_tile[0],y:staircase.front_tile[1]},{header:staircase.target_header,x:staircase.destination_tile[0],y:staircase.destination_tile[1]},{header:staircase.target_header,x:staircase.postload_tile[0],y:staircase.postload_tile[1]}];
 if(cells.some(c=>destinationBusy(c.header,c.x,c.y))){showToast('A neighbor is on the stairs. Please try again.');return false;}
 const lease=Object.freeze({houseId:state.houseId,header:staircase.header,cells:Object.freeze(cells.map(c=>Object.freeze(c)))}),driver=window.SourceStaircase.create(input),originalPlayer=JSON.parse(JSON.stringify(p));
 const release=()=>{if(state.exitReservation===lease)state.exitReservation=null;};
 const t={kind:'stairs',houseId:state.houseId,driver,staircase,elapsed:0,loaded:false,exitReservation:lease,ready:{unloadComplete:false,loadComplete:false,restoreComplete:false},onFinish(){if(nativePlayerHeight?.yFx12!==0)throw Error('Source staircase final height did not return to source zero');nativePlayerHeight=null;state.forcedWalk=null;state.playerHidden=false;state.cachedPlayerHidden=false;release();},onCancel(){state.forcedWalk=null;if(!t.loaded){state.player=originalPlayer;nativePlayerHeight=null;}state.playerHidden=false;state.cachedPlayerHidden=false;sceneSnapshot=null;release();}};
 cancelSourceBoard('source-staircase');nativePlayerHeight=height;state.exitReservation=lease;state.transition=t;keys.clear();mapNamePopup.cancel();return true;
}
function enterHouse(id){const h=W.getHouse(id);if(h)beginSourceWarp('entry',h);}
function leaveHouse(){if(state.transition)return;const h=W.getHouse(state.houseId);if(h)beginSourceWarp('exit',h);}
// Field music stays on the existing TV runtime; map-script cleanup does not
// replace its clock. Ordinary recorded/post-TV profiles keep their old routing.
function openingFieldMusicOwner(t){
 const p=openingProfile,m=t?.fieldMusic;
 if(!p?.tvOrigin)return null;
 if(!m||state.transition!==t||m.profile!==p||m.runtime!==p.tvRuntime||p.faulted||p.recovering||profileSwitchPending)throw Error('Field music transition owner changed');
 return m;
}
function openingFieldMusicLoad(t,to){const m=openingFieldMusicOwner(t);if(!m)throw Error('Field music location requires native owner');return m.runtime.loadFieldTransition(m.token,to);}
function openingFieldMusicTimer(t){
 if(!openingProfile?.tvOrigin)return true;
 if(!t.fieldMusic){if(t.fieldMusicFinished)return true;if(t.driver.snapshot().rootState>0)throw Error('Missing field music preparation');return true;}
 const m=openingFieldMusicOwner(t);return m.runtime.fieldFadeFinished(m.token);
}
function openingFieldMusicEvent(t,event){
 const p=openingProfile;if(!p?.tvOrigin)return false;
 if(event.type==='prepare_destination_music'){
  if(state.transition!==t||t.fieldMusic||!p.tvRuntime||p.faulted||p.recovering||profileSwitchPending)throw Error('Field music preparation owner');
  const external=effectPlayer?.inspect();if(external&&(external.ready||external.loading||external.lastError))throw Error('Field music requires no live/pending external worklet; reset acknowledgement is not available');
  const from=state.scene==='town'?411:state.roomHeader,to=t.kind==='stairs'?t.staircase.target_header:t.kind==='entry'?W.getHouse(t.houseId).header:411;
  const runtime=p.tvRuntime,token=runtime.prepareFieldTransition({fromMapId:from,toMapId:to,rtcHour:tvScenarioClock().hour,scope:'source-field-music-transition'});
  t.fieldMusic=Object.freeze({profile:p,runtime,token});return true;
 }
 if(event.type==='destination_music_and_field_hook'){
  const m=openingFieldMusicOwner(t),header=state.scene==='town'?411:state.roomHeader;
  m.runtime.finishFieldTransition(m.token,{mapId:header,rtcHour:tvScenarioClock().hour,scope:'source-destination-mode4'});t.fieldMusic=null;t.fieldMusicFinished=true;return true;
 }
 return false;
}
function sourceWarpTask(){
 const t=state.transition;if(!t||!t.driver)return;if(t.sourceAdmissionError)throw Error(t.sourceAdmissionError);
 const sourceField=typeof nativeFieldLifecycle!=='undefined'&&nativeFieldLifecycle;if(sourceField){const lifecycle=sourceField.snapshot();t.ready.unloadComplete=lifecycle.unloadComplete;t.ready.loadComplete=lifecycle.locationComplete;t.ready.restoreComplete=lifecycle.restoreComplete;}
 const signals={...t.ready,moveComplete:!state.forcedWalk,musicFadeTimerZero:openingFieldMusicTimer(t)};if(t.kind!=='stairs'){signals.openComplete=worldAnimation.doorComplete();signals.closeComplete=worldAnimation.doorComplete();}const events=t.driver.task(signals);
 for(const event of events){
  if(event.type==='prepare_destination_music')openingFieldMusicEvent(t,event);
  else if(event.type==='play_clip'){worldAnimation.bindDoor(t.houseId,event.member);playEffect(event.sound);}
  else if(event.type==='play_sound')playEffect(event.sound);
  else if(event.type==='force_walk'){const dir=['up','down','left','right'][event.direction];const hadCollision=PM.hasCollision(state.player),result=PM.forceWalk(state.player,dir);openingExitClearHeld(state.player,hadCollision,result);state.forcedWalk={ticks:0,updates:event.updates};}
  else if(event.type==='force_slow_walk'){const hadCollision=PM.hasCollision(state.player),result=PM.forceSlowWalk(state.player,event.direction);openingExitClearHeld(state.player,hadCollision,result);if(!result.accepted)throw Error('Source staircase held movement was not accepted');state.forcedWalk={ticks:0,updates:event.updates,stairPhase:event.phase==='stairs_departure'?'departures':'arrivals',direction:event.direction};}
  else if(event.type==='postload_stair'){const raw=nativeRawPlayer(),shifted=[raw.x+event.deltaFx32[0],raw.y+event.deltaFx32[1],raw.z+event.deltaFx32[2]],height=staircaseHeight(t,'postload',0,shifted);if(shifted[0]!==event.tile[0]*65536+32768||shifted[2]!==event.tile[1]*65536+32768)throw Error('Source staircase postload tile mismatch');const oldPlayer=state.player,exit=openingProfile?.exitField;setPlayer(event.tile[0],event.tile[1],['up','down','left','right'][event.direction]);nativePlayerHeight=height;if(exit){if(!openingExitCurrent(exit))throw Error('Opening stair owner changed');const position=nativeRawPlayer();exit.effect.player().transfer(oldPlayer,state.player,fieldGeneration,{tile:event.tile.slice(),positionFx12:[position.x,position.y,position.z],facing:event.direction,reason:'stair-postload'});}nativeRenderer.resetCamera(event.header,worldPosition(state.player));openingTownInitQueue.transferred(t,oldPlayer,state.player,event);}
  else if(event.type==='hide_player')state.playerHidden=true;
  else if(event.type==='show_player')state.playerHidden=false;
  else if(event.type==='release_door')worldAnimation.clearDoor();
  else if(event.type==='unload_overworld'){mapNamePopup.cancel();if(openingProfile?.exitField)openingProfile.exitField.pair.requestStop();else if(sourceField)sourceField.requestStop();else t.ready.unloadComplete=true;}
  else if(event.type==='destination_music_and_field_hook'){openingFieldMusicEvent(t,event);const header=state.scene==='town'?411:state.roomHeader,meta=window.SourceMapNamePopupData.headers[header];if(!meta)throw Error('Map-name popup header metadata is unavailable: '+header);if(meta.mapType!==4&&meta.mapType!==5)mapNamePopup.request(meta.mapSection);}
  else if(event.type==='change_location_and_load'){
   if(sourceField){t.nativeLocationRequested=true;continue;}
   if(state.exitReservation!==t.exitReservation)throw Error('Transition destination reservation was lost');
   if(t.kind==='entry')enterHouseImmediate(t.houseId);else if(leaveHouseImmediate()===false)throw Error('Reserved exit destination changed unexpectedly');
   t.loaded=true;state.playerHidden=t.kind==='exit';state.cachedPlayerHidden=state.playerHidden;worldAnimation.reset(state.scene==='town'?411:state.roomHeader);sceneSnapshot=null;t.ready.loadComplete=true;
  }else if(event.type==='restore_overworld'){if(sourceField)t.nativeRestoreRequested=true;else t.ready.restoreComplete=true;}
 }
 if(t.driver.done){state.transition=null;t.onFinish();}
}
function advanceForcedWalk(){const f=state.forcedWalk;if(!f)return;let height=null;if(f.stairPhase){const raw=nativeRawPlayer();height=staircaseHeight(state.transition,f.stairPhase,f.ticks,[raw.x+(f.direction===3?4096:-4096),raw.y,raw.z]);}const result=PM.tick(state.player);if(height){if(result.kind!=='slow'||result.elapsed!==f.ticks+1||result.total!==16)throw Error('Source staircase displacement phase mismatch');nativePlayerHeight=height;}f.ticks++;if(!PM.isBusy(state.player))state.forcedWalk=null;return result;}
function captureSceneSnapshot(sampleCamera=true,sourceView){
 const header=state.scene==='town'?411:state.roomHeader,actors=state.npcs.filter(n=>actorHeader(n)===header).map(n=>({id:n.id,nativeTexture:window.SourceNativeHost.actorKey(n.id),position:helperRenderPosition(n),frame:nativeFrame(n.id,n)}));
 for(const a of state.originals.filter(o=>o.header===header&&o.active!==false&&!o.sourceGraphicsHidden))actors.push({id:a.id,atlasKey:a.spriteKey,nativeTexture:window.SourceNativeHost.actorKey(a.spriteKey),position:worldPosition(a),frame:nativeFrame(a.spriteKey,a)});
 if(!state.cachedPlayerHidden)actors.push({id:'player',nativeTexture:window.SourceNativeHost.actorKey('player'),position:worldPosition(state.player),frame:nativeFrame('player',state.player)});
 const view={header,target:worldPosition(state.player),frameIndex:cameraFrame,actors,...window.SourceNativeHost.frameState(header)};
 if(openingProfile?.effects&&[411,413,414].includes(header))view.effects=openingProfile.effects.descriptors();
 if(header===411)view.instanceOverrides=worldAnimation.overrides(header);
 if(header===411&&state.transition?.driver){const override=state.transition.driver.snapshot().cameraOverride;if(override)view.cameraOverride=override;}
 if(sourceView){if(sourceView.header!==header)throw Error('Native field view header mismatch');view.rasterPipeline=header===411?'native-perspective-streamed-neighbor-sea':'native-ortho-neighbor-sea-diagnostic';if(header===411){view.neighborSubmission=sourceView.neighborSubmission;view.neighborGeneration=sourceView.generation;}}else if(sampleCamera)nativeRenderer.advanceCamera(view);return view;
}
function drawTransitionFade(){
 const t=state.transition;if(!t.driver){screen.fillStyle='rgba(0,0,0,'+P.transitionOpacity(t.elapsed)+')';screen.fillRect(0,0,512,384);return;}
 const fade=t.driver.snapshot().fade;if(!fade)return;
 screen.fillStyle='black';
 if(fade.windowAttached&&fade.windowBounds){const [top,bottom]=fade.windowBounds;screen.fillRect(0,0,512,top*2);screen.fillRect(0,bottom*2,512,384-bottom*2);}
 // Both native displays apply MASTER_BRIGHT before scaling. Only the upper
 // engine receives the source window mask; the lower background has no mask.
}
// Original board host adapter. The source object scripts do not enter the added
// dialogue UI, timed NPC printer, or NPC-facing/movement-lock controller.
function sourceBoardObjects(){
 const actors=(state.originals||[]).filter(a=>a.header===411).map(a=>({key:a.header+':'+a.eventIndex,eventIndex:a.eventIndex,x:a.x,z:a.y,integerY:window.SourceBoardHost.integerY(Math.round(worldPosition(a)[1]*4096)),flag19Disabled:a.flag19Disabled!==false}));
 const boards=state.boardObjects.map(o=>({...o,integerY:window.SourceBoardHost.integerY(o.positionYFx12)}));
 const originals=[...actors,...boards].sort((a,b)=>a.eventIndex-b.eventIndex);
 // Added helpers are explicitly outside the original object manager; they never
 // replace earlier source objects. Preserve their separate existing route.
 return originals.concat(state.npcs.filter(n=>n.location==='town').map(n=>({key:'mock:'+n.id,x:n.x,z:n.y})));
}
function sourceBoardTarget(){
 if(openingProfile&&state.scene==='interior'&&state.roomHeader===415&&state.player.progress===1&&PM.inputReady(state.player)&&state.player.x===7&&state.player.y===4&&state.player.facing==='up')return window.SourceBoardData.notice;
 if(state.scene!=='town'||state.player.progress!==1||!PM.inputReady(state.player))return null;
 return window.SourceBoardHost.resolve({headerId:411,player:{...state.player,facing:PM.directionCode(state.player.facing)},playerYFx12:Math.round(worldPosition(state.player)[1]*4096),objects:sourceBoardObjects(),permissionRows:W.getScene(411).permission_u16_rows});
}
function sourceBoardBusy(){const s=sourceBoard.snapshot();return !!pendingSourceBoard||s.scriptActive||s.overlayPresent;}
function sourceBoardPulse(key){(openingProfile?openingProfile.edges:sourceBoardEdges).pulse(key);}
function sourceBoardKey(key){if(['e','z',' ','Enter'].includes(key))return 'A';if(key==='b'||key==='Escape')return 'B';if(key==='x')return 'X';return {up:'UP',down:'DOWN',left:'LEFT',right:'RIGHT'}[keyDir[key]]||null;}
function finishSourceBoardControls(){
 const focused=$('source-board-controls').contains(document.activeElement);$('source-board-controls').hidden=true;$('source-board-text').textContent='';
 if(focused){if(sourceBoardPreviousFocus?.isConnected)sourceBoardPreviousFocus.focus({preventScroll:true});else canvas.focus({preventScroll:true});}sourceBoardPreviousFocus=null;
}
function cancelSourceBoard(reason){
 const active=sourceBoardBusy();sourceBoard.reset();pendingSourceBoard=null;sourceBoardEdges.reset();sourceBoardCancelReason=reason;if(state)state.sourceInputStatus14=0;
 if(active||!$('source-board-controls').hidden)finishSourceBoardControls();
}
function queueSourceBoard(key,event){
 if(sourceBoardBusy()||menuOpen||state.dialog||state.transition)return false;
 pendingSourceBoard=key;
 if(event?.type!=='keydown'&&(!openingProfile||event))sourceBoardPulse('A');
 return true;
}
function updateSourceBoardControls(){
 const snapshot=sourceBoard.snapshot(),controls=$('source-board-controls');
 if(!snapshot.scriptActive&&!snapshot.overlayPresent){if(!controls.hidden)finishSourceBoardControls();return;}
 const opening=controls.hidden,wasReady=!$('source-board-close').disabled;
 if(opening){sourceBoardPreviousFocus=document.activeElement;controls.hidden=false;controls.focus({preventScroll:true});}
 $('source-board-text').textContent=snapshot.text?.text||'';
 $('source-board-close').disabled=!snapshot.inputReady;$('source-board-menu').disabled=!snapshot.inputReady;
 if(snapshot.inputReady&&!wasReady&&controls.contains(document.activeElement))$('source-board-close').focus({preventScroll:true});
}
function advanceSourceBoard(){
 // New keys are drained even while input dispatch is task-disabled. Physical
 // held keys survive the task and are removed only by release/blur/reset.
 const physicalBoardInput=sourceBoardEdges.sample(),input=openingProfile?openingInput:physicalBoardInput,before=sourceBoard.snapshot(),wasLocked=!!pendingSourceBoard||before.scriptActive;
 // Keyboard X is an added-menu request only after this scan's source board
 // admission. Board-owned X stays on the original script/cleanup callback path.
 const keyboardMenuRequested=!openingProfile&&input.newKeys.includes('X')&&!before.scriptActive&&!before.overlayPresent&&!state.dialog&&!state.pendingOriginalId;
 const normalFieldMain=!!nativeRenderer&&!state.transition&&(!nativeFieldLifecycle||nativeFieldLifecycle.snapshot().stage==='main');
 if(!normalFieldMain||!(state.scene==='town'||openingProfile&&state.scene==='interior'&&state.roomHeader===415)||state.dialog){if(sourceBoardBusy())cancelSourceBoard('field-interruption');if(keyboardMenuRequested)toggleMenu();return wasLocked;}
 let acceptedEntry;
 if(!before.scriptActive&&!(before.overlayPresent&&before.session?.key==='415:bg2')&&!menuOpen&&!state.pendingOriginalId){
  PM.attach(state.player);
  // Bounded host profile: active, non-single ordinary on-foot player and normal
  // dispatcher. Earlier story/encounter/action handlers are explicitly excluded
  // by this preview, not reconstructed or claimed never to fire in the source.
  const behavior=W.getScene(state.scene==='town'?411:state.roomHeader).permission_u16_rows[state.player.y]?.[state.player.x]&255;
  if([0x20,0xd7,0xd8,0xd9,0xda].includes(behavior))state.sourceInputStatus14=2;
  else{
   state.sourceInputStatus14=window.SourceBoardEntry.fromMotion(state.sourceInputStatus14,state.player.playerMotion);
   acceptedEntry=window.SourceBoardEntry.admit({normalFieldMain:true,earlierEventsExcluded:true,status14:state.sourceInputStatus14,facing:PM.directionCode(state.player.facing),selectedDirection:playerInputSelection().direction,heldKeys:input.heldKeys,newKeys:input.newKeys,board:sourceBoardTarget()});
  }
  pendingSourceBoard=null;
  if(acceptedEntry){
   // Only the generic A branch replaces movement with the base face command.
   // Shared 55B14 reset does not replace the special-path collision command.
   if(acceptedEntry.reason==='fresh_a'){if(!PM.objectTalk(state.player))acceptedEntry=null;else openingExitResetPlayer(state.player,false);}
   if(acceptedEntry){state.player.playerMotion.avatarState=0;state.sourceInputStatus14=0;state.sourceBoardLastEntry=acceptedEntry;mapNamePopup.cancel();}
  }
 }
 const result=window.SourceBoardEntry.step(sourceBoard,{...input,menuEligible:!menuOpen&&!state.dialog&&!state.transition},{normalFieldMain:true,...(acceptedEntry?{acceptedEntry,names:openingProfile?{playerName:openingProfile.playerName,rivalName:openingProfile.rivalName}:{playerName:'Dawn',rivalName:'Barry'}}:{})});
 for(const stage of result.stages)for(const event of stage.snapshot.events)if(event.type==='set_player_facing')state.player.facing=['up','down','left','right'][event.facing];
 updateSourceBoardControls();
 if(result.needsMenuCallback){cancelSourceBoard('custom-menu-callback');if(openingProfile)beginOpeningMenu('script-continuation');else if(!menuOpen)toggleMenu();}
 else if(keyboardMenuRequested&&!acceptedEntry)toggleMenu();
 return wasLocked||!!acceptedEntry;
}

function handleSourceBoardKey(event,key){
 if(!sourceBoardBusy())return false;
 if(key==='Tab'){
  event.preventDefault();const choices=[$('source-board-close'),$('source-board-menu')].filter(b=>!b.disabled),i=choices.indexOf(document.activeElement);
  if($('source-board-controls').hidden)canvas.focus({preventScroll:true});else if(!choices.length)$('source-board-controls').focus({preventScroll:true});else choices[(i+(event.shiftKey?-1:1)+choices.length)%choices.length].focus({preventScroll:true});return true;
 }
 const mapped=sourceBoardKey(key);if(mapped)event.preventDefault();
 return true;
}

function nearby(){
 const p=state.player;if(p.progress<1||!PM.inputReady(p))return null;const [dx,dy]=dirs[p.facing],front={x:p.x+dx,y:p.y+dy};const original=O.targetAt(state.originals,state.scene==='town'?411:state.roomHeader,front.x,front.y);if(original)return{type:'original',id:original.id,label:'Talk to '+original.name};
 const board=sourceBoardTarget();if(board)return{type:'source-board',key:board.key,label:'Read sign'};
 if(state.scene==='interior'){
  const resident=state.npcs.find(n=>n.location==='interior'&&n.roomHeader===state.roomHeader&&n.x===front.x&&n.y===front.y);
  if(resident)return{type:'resident',id:resident.id,label:'Talk to '+W.getHouse(resident.id).resident};
  const warp=W.getHeader(state.roomHeader).events.warps.find(w=>Math.abs(p.x-w.local_x)+Math.abs(p.y-w.local_z)<=1);
  if(warp&&(warp.target_header!==411||p.x===warp.local_x&&p.y===warp.local_z))return{type:warp.target_header===411?'exit':'stairs',warp,label:warp.target_header===411?'Step outside':'Use stairs'};return null;
 }
 const n=state.npcs.filter(n=>n.location==='town'&&n.progress===1&&n.x===front.x&&n.y===front.y).sort((a,b)=>(a.x===front.x&&a.y===front.y?-1:1));
 if(n.length)return{type:'resident',id:n[0].id,label:'Talk to '+W.getHouse(n[0].id).resident};
 for(const h of W.houses)if(p.x===h.doorX&&p.y===h.doorY+1&&p.facing==='up')return{type:'door',id:h.id,label:'Enter '+h.name};
 if(p.y<=1&&p.x>=12&&p.x<=19)return{type:'route',label:'Look toward Route 201'};
 return null;
}
function interact(event){if(openingProfile&&!openingDispatching){openingProfile.edges.pulse('A');return;}if(openingOwnsField()||profileSwitchPending)return;if(!nativeRenderer||state.transition||state.pendingOriginalId)return;if(sourceBoardBusy()){sourceBoardPulse('A');return;}if(!state.dialog&&!menuOpen)mapNamePopup.cancel();if(state.dialog){if(state.dialog.type==='original')advanceOriginalDialog();else advanceDialog();return;}const near=nearby();if(!near)return;if(near.type==='source-board'){queueSourceBoard(near.key,event);return;}if(near.type==='original')openOriginal(near.id);else if(near.type==='door')enterHouse(near.id);else if(near.type==='exit')leaveHouse();else if(near.type==='stairs'){if(nativeFieldLifecycle)showToast('Stand on the stair tile and hold toward the staircase.');else startTransition(()=>enterRoomImmediate(near.warp.target_header,near.warp.target_warp));}else if(near.type==='resident')openResident(near.id);else if(near.type==='route')openInfo('The road ahead','Route 201 is outside this small prototype. For now, let’s get to know the neighborhood.');}
function showToast(text){$('toast').textContent=text;$('toast').hidden=false;toastUntil=state.clock+5;}
function openDialog(name,role,text,initial,color){
 if(openingOwnsField()||profileSwitchPending)return false;
 cancelSourceBoard('dialogue-replacement');
 $('original-controls').hidden=true;$('dialog-close').hidden=false;
 originalMotion.releaseDialog();state.pendingOriginalId=null;state.pendingOriginalSession=null;if(state.dialog)state.dialog.preferredChoiceIndex=null;
 keys.clear();dialogHeldKeys.clear();ignoreNextTextClick=false;state.originalPrinter=null;state.originalScriptContinue=false;state.dialogPage=0;state.textPrinter=R.create(F.pages(text)[0]);previousFocus=document.activeElement;$('dialog-name').textContent=name;$('dialog-role').textContent=role;$('dialog-text').textContent=text;$('portrait').textContent=initial;$('portrait').style.color=color||'#658555';$('dialog-actions').replaceChildren();$('dialog').hidden=false;$('interaction-hint').hidden=true;
}
function action(text,fn){const b=document.createElement('button');b.textContent=text;b.onclick=fn;$('dialog-actions').append(b);return b;}
function closeDialog(){if(openingProfile&&(openingProfile.direct?.ownsField()||state.pendingOriginalSession))return cancelOpeningDirectTalk('preview-close');if(openingOwnsField())return false;if(!state)return;originalMotion.releaseDialog();state.pendingOriginalId=null;state.pendingOriginalSession=null;$('dialog-text').style.whiteSpace='pre-line';state.dialog=null;state.textPrinter=null;state.originalPrinter=null;state.originalScriptContinue=false;$('dialog').hidden=true;$('original-controls').hidden=true;$('dialog-close').hidden=false;keys.clear();dialogHeldKeys.clear();if(previousFocus&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});else canvas.focus({preventScroll:true});previousFocus=null;}
function openInfo(title,text){if(openingOwnsField()||profileSwitchPending)return false;state.dialog={type:'info'};openDialog(title,'TOWN NOTE',text,'✦');focusDialogChoice(action('Keep exploring',closeDialog));}
function openOriginal(id){
 if(openingOwnsField()||profileSwitchPending)return false;
 const actor=state.originals.find(o=>o.id===id);if(!actor||state.dialog||state.pendingOriginalId||state.pendingOriginalSession||state.player.progress<1||!PM.inputReady(state.player))return false;
 PM.objectTalk(state.player);openingExitResetPlayer(state.player,false);keys.clear();sourceBoardEdges.sample();
 let session;try{if(openingProfile){const selected=DI.select(actor.header+':'+actor.eventIndex,state.originalStory,{playerName:openingProfile.playerName,rivalName:openingProfile.rivalName});if(F.data.font_id!==1||F.data.line_height!==16||F.data.letter_spacing!==0)throw Error('Source field font1 metrics required');session={selected,printer:window.OriginalDialogue.create(selected.tokens,{glyphs:F.data.glyphs,bindings:selected.bindings,lineHeight:F.data.line_height,waitButton:false,frameDelay:window.SourceOptions.textDelay(openingProfile.options)})};}else session=DI.create(actor.header+':'+actor.eventIndex,state.originalStory,{playerName:'Dawn',rivalName:'Barry'},F.data);}catch(error){showToast('Original dialogue unavailable: '+error.message);return false;}
 for(const effect of session.selected.sourceEffects)if(effect.type!=='set_flag'||effect.timing!=='before_message'){showToast('Original dialogue has unsupported state effects.');return false;}
 // App input admits/binds a task; it does not execute source opcodes. The
 // next eligible field-task phase can start it in the same field iteration.
 const request={id,actor,player:state.player,session,phase:'installed',lastCallback:state.originalFieldTaskCallback};
 state.pendingOriginalId=id;state.pendingOriginalSession=request;if(openingProfile)updateOpeningProfileUI();
 return true;
}
function advanceOriginalScript(request,callback){
 if(!request||state.pendingOriginalSession!==request||state.pendingOriginalId!==request.id||request.actor!==state.originals.find(o=>o.id===request.id)||request.player!==state.player)return false;
 if(!nativeRenderer||state.transition||state.dialog||nativeFieldLifecycle&&nativeFieldLifecycle.snapshot().stage!=='main')return false;
 // One dispatch per eligible field-task callback, never per DOM event, draw,
 // motion update or repeated/stale invocation of this same callback token.
 if(!Number.isSafeInteger(callback)||callback!==state.originalFieldTaskCallback||callback<=request.lastCallback)return false;
 request.lastCallback=callback;
 if(request.phase==='installed'){
  request.phase='native_wait';
  playEffect(1500); // Consumed once, before LockAllEvents, even with audio off.
  if(state.pendingOriginalSession!==request)return true;
  originalMotion.requestDialog(request.actor,request.player,{deferFacing:true});
  return true; // LockAllEvents always yields after installing its native wait.
 }
 if(request.phase==='native_wait'){
  if(originalMotion.dialogTarget()===request.actor&&originalMotion.dialogReady()&&!PM.isBusy(request.player)){
   request.phase='bytecode';request.nativeCompletedCallback=callback;
  }
  return true; // RunScriptCommand native success returns; no opcodes this call.
 }
 if(request.phase==='bytecode')return beginOriginal(request.id,request,callback);
 return false;
}
function beginOriginal(id,request,callback){
 const actor=state.originals.find(o=>o.id===id);
 if(!request||state.pendingOriginalSession!==request||state.pendingOriginalId!==id||request.actor!==actor||request.player!==state.player||request.id!==id||request.phase!=='bytecode'||callback!==state.originalFieldTaskCallback||callback!==request.lastCallback||!(callback>request.nativeCompletedCallback)||originalMotion.dialogTarget()!==actor||!originalMotion.dialogReady()||PM.isBusy(state.player))return false;
 if(!originalMotion.faceDialog())return false;
 request.phase='message';
 if(openingProfile)return beginOpeningDirectTalk(request);
 const session=request.session;state.pendingOriginalId=null;state.pendingOriginalSession=null;
 // Apply the preflighted direct-script writes only at the pre-message boundary.
 for(const effect of session.selected.sourceEffects)state.originalStory.flags[effect.flag]=true;
 // FacePlayer ran above, in this resumed bytecode callback, before message effects.
 keys.clear();dialogHeldKeys.clear();ignoreNextTextClick=false;state.dialogPage=0;state.textPrinter=null;state.originalPrinter=session.printer;state.originalScriptContinue=false;previousFocus=document.activeElement;
 state.dialog={type:'original',id,actorKey:session.selected.actorKey,messageBank:session.selected.messageBank,messageIndex:session.selected.messageIndex,routeId:session.selected.routeId};
 $('dialog-name').textContent=actor.name;$('dialog-role').textContent='ORIGINAL DIALOGUE PREVIEW · DEMO NAMES DAWN / BARRY';
 // Accessible plain text only. Rendering exclusively consumes original tokens, never these paragraphs.
 $('dialog-text').textContent=session.printer.commands.map(c=>c.type==='glyph'?c.char:c.type==='page_clear'?'\n\n':'\n').join('');$('dialog-text').style.whiteSpace='pre-line';
 $('original-controls').hidden=false;$('dialog-close').hidden=true;
 $('portrait').textContent='';$('dialog-actions').replaceChildren();$('dialog-actions').hidden=true;$('dialog').hidden=false;$('interaction-hint').hidden=true;focusDialogChoice(null);
 return true;
}
function openResident(id){
 if(openingProfile||profileSwitchPending)return false;
 PM.objectTalk(state.player);const h=W.getHouse(id);state.met.add(id);state.dialog={type:'resident',id};const n=state.npcs.find(n=>n.id===id);if(n){const dx=state.player.x-n.x,dy=state.player.y-n.y;n.facing=Math.abs(dx)>Math.abs(dy)?dx<0?'left':'right':dy<0?'up':'down';}
 const task=state.tasks.find(t=>t.id===id);
 let text=h.text;if(task)text=W.taskDialogView(task.status).text;
 openDialog(h.resident,h.role.toUpperCase(),text,h.resident[0],h.color);
 if(!task)action(h.task+' →',()=>startTask(id));else{const view=W.taskDialogView(task.status);const b=action(view.label,view.action==='result'?()=>showResult(id):()=>{});b.disabled=view.disabled;}
 action('Just saying hello',closeDialog);updateUI();const first=$('dialog-actions').querySelector('button:not(:disabled)');focusDialogChoice(first);
}
function refreshOpenTaskDialog(){
 if(!state.dialog||state.dialog.type!=='resident')return;
 const id=state.dialog.id,task=state.tasks.find(t=>t.id===id);if(!task)return;
 const view=W.taskDialogView(task.status),button=$('dialog-actions').querySelector('button');
 if($('dialog-text').textContent!==view.text){$('dialog-text').textContent=view.text;state.dialogPage=0;state.textPrinter=R.create(F.pages(view.text)[0]);}
 if(button){button.textContent=view.label;button.disabled=view.disabled;button.onclick=view.action==='result'?()=>showResult(id):()=>{};}focusDialogChoice(document.activeElement);
}
function startTask(id){
 if(openingProfile||profileSwitchPending)return false;
 if(state.tasks.some(t=>t.id===id))return;state.tasks.push({id,start:Date.now(),status:'queued'});state.dialog=null;closeDialog();updateUI();showToast(W.getHouse(id).resident+' started a Fable 5.2 session.');
}
function showResult(id){if(openingProfile||profileSwitchPending)return false;const h=W.getHouse(id);state.dialog={type:'result',id};openDialog(h.task,'FABLE 5.2 REPORT · '+h.resident.toUpperCase(),h.result,h.resident[0],h.color);$('dialog-text').style.whiteSpace='pre-line';focusDialogChoice(action('Back to exploring',()=>{$('dialog-text').style.whiteSpace='normal';closeDialog();}));}
function createResidentCard(h){
 const card=document.createElement('button');
 card.className='resident-card';
 card.style.setProperty('--resident-color',h.color);
 card.setAttribute('aria-label','Check '+h.resident+' location, '+h.role);
 card.innerHTML='<span class="resident-portrait"></span><span class="resident-description"><strong></strong><small></small></span><span class="resident-status"></span><span class="resident-arrow">↗</span>';
 card.querySelector('.resident-portrait').append(creaturePortrait(h.id));
 card.querySelector('strong').textContent=h.resident;
 card.querySelector('small').textContent=h.role;
 card.addEventListener('click',()=>{
  if(openingProfile||profileSwitchPending)return;
  const agent=state.npcs.find(n=>n.id===h.id);
  showToast(h.resident+(agent.location==='interior'?' is visiting '+W.getHouse(agent.houseId).name+'.':' is walking toward '+W.getHouse(agent.targetHouse).name+'.'));
  canvas.focus({preventScroll:true});
 });
 return card;
}
function updateResidentCard(card,h){
 const task=state.tasks.find(t=>t.id===h.id);
 card.querySelector('.resident-status').textContent=task?task.status==='ready'?'Ready':'Busy':state.met.has(h.id)?'Met':openingProfile?'Not in this scenario':state.npcs.find(n=>n.id===h.id).location==='interior'?'Visiting':'Walking';
 card.querySelector('.resident-portrait').classList.toggle('busy',Boolean(task&&task.status!=='ready'));
}
const renderResidentCards=window.ResidentCards.createStableResidentCards($('resident-list'),createResidentCard,updateResidentCard);
function updateUI(){
 const done=[state.visited.size===4,state.met.size===4,state.tasks.some(t=>t.status==='ready')];const count=done.filter(Boolean).length;
 $('house-count').textContent=state.visited.size+'/4';$('meet-count').textContent=state.met.size+'/4';$('task-count').textContent=(done[2]?1:0)+'/1';$('progress-count').textContent=count+' / 3';$('progress-bar').style.width=count/3*100+'%';
 ['goal-houses','goal-meet','goal-task'].forEach((id,i)=>$(id).classList.toggle('complete',done[i]));
 renderResidentCards(W.houses);
 $('task-total').textContent=state.tasks.length+' '+(state.tasks.length===1?'NOTE':'NOTES');
 if(state.tasks.length){$('task-list').replaceChildren();for(const task of state.tasks.slice().reverse()){const h=W.getHouse(task.id),note=document.createElement('article');note.className='task-note';const top=document.createElement('div');top.className='note-top';top.textContent=h.resident+' · '+(task.status==='ready'?'Sample ready':task.status==='working'?'Thinking…':'Queued');const title=document.createElement('h3');title.textContent=h.task;const content=document.createElement('p');content.textContent=task.status==='ready'?h.result:'An entirely local, timed sample. No real work is happening outside this page.';const foot=document.createElement('small');foot.textContent='MOCK TASK · NO EXTERNAL ACTION';note.append(top,title,content,foot);$('task-list').append(note);}}
 else $('task-list').innerHTML='<div class="empty-notebook"><span>✎</span><p>Something on your mind?</p><small>Talk to a resident to try a sample task.</small></div>';
 if(count===3&&!state.taskCompleted){state.taskCompleted=true;showToast('A lovely first morning. You’ve met everyone and explored every home.');}
}
function originalMotionBlocked(x,y,actor){const header=actor.header;if(header===411){const lease=state.exitReservation;if(lease&&((lease.x===x&&lease.y===y)||(lease.cells||[]).some(c=>c.x===x&&c.y===y)))return true;if(W.townBlocked(x,y))return true;}else if(W.interiorBlocked(x,y,header))return true;const current=state.scene==='town'?411:state.roomHeader;if(current===header&&PM.reserves(state.player,x,y))return true;return state.npcs.some(n=>actorHeader(n)===header&&W.tileReserved(n,x,y));}
function updateOpeningRivalBystanders(controller){
 const p=openingProfile,header=state.scene==='town'?411:state.roomHeader;
 if(!p?.tvOrigin||p.controller!==controller||!controller.ownsField()||controller.isLocked()||![411,413].includes(header))return false;
 const view=controller.snapshot(),data=window.SourceRivalScriptData.scenes[header];
 if(view.header!==header||view.scriptId!==data.scriptId||view.activeMovementCounter!==0)throw Error('Rival ReleaseAll bystander boundary');
 // Input remains owned through End. Only unrelated, already-live objects resume
 // their ordinary priority5 callback on this unlocked main-queue visit.
 originalMotion.tick(state.originals,{header,isBlocked:originalMotionBlocked,eligible:actor=>actor.eventId!==data.rival.eventId,paused:!!state.transition||!!state.dialog});return true;
}
function updateOriginalMotion(){originalMotion.tick(state.originals,{header:state.scene==='town'?411:state.roomHeader,isBlocked:originalMotionBlocked,paused:!!state.transition||!!state.dialog});}
function playerInputSelection(){
 let mask=keys.has('b')?2:0;for(const key of keys){const dir=keyDir[key];if(dir)mask|={up:0x40,down:0x80,left:0x20,right:0x10}[dir];}
 return PM.selectDirection(mask,state.playerInput);
}
function playerInputDirection(){const selected=playerInputSelection();return selected.direction<0?null:['up','down','left','right'][selected.direction];}
// Reorder one existing admitted call in the clear-owner reference town or rooms 416/417.
// This is not an extra native callback or a new terrain/flag admission adapter.
function openingTownPlayerFirstVisit(boardInputBlocked,homeOwned){
 const p=openingProfile,st=state,s=p?.exitField;
 const header=st.scene==='town'&&st.roomHeader===null?411:st.scene==='interior'&&[416,417].includes(st.roomHeader)?st.roomHeader:null,houseId=st.houseId,house=p&&header!==null&&header!==411?W.getHouse(houseId):null;
 const inMap=()=>header===411?st.scene==='town'&&st.roomHeader===null:header!==null&&st.scene==='interior'&&st.roomHeader===header&&st.houseId===houseId&&W.getHouse(houseId)===house&&house?.header===header;
 const fail=message=>Error((header===411?'Opening town main queue: ':'Opening room main queue: ')+message);
 const unowned=()=>!profileSwitchPending&&!p.faulted&&!p.recovering&&inMap()&&!st.transition&&!st.forcedWalk&&!st.dialog&&!st.pendingOriginalId&&!st.pendingOriginalSession&&!p.menuPaused&&!p.menuTaskVisited&&!p.directTaskVisited&&!p.controller?.ownsField()&&!p.menu?.ownsField()&&!p.direct?.ownsField()&&!originalMotion.isDialogLocked();
 if(!p||homeOwned||boardInputBlocked||!s||!unowned())return null;
 const player=st.player,actors=st.originals,motion=originalMotion,lifetime=p.actorLifetime,generation=fieldGeneration,bridge=s.bridge,renderer=s.renderer,effect=s.effect,pair=s.pair;
 const actorRefs=actors.map(actor=>({actor,motion:actor.originalMotion,gait:actor.originalGait}));
 const current=()=>{
  if(openingProfile!==p||state!==st||p.exitField!==s||st.player!==player||st.originals!==actors||originalMotion!==motion||p.actorLifetime!==lifetime||fieldGeneration!==generation||s.bridge!==bridge||s.renderer!==renderer||s.effect!==effect||s.pair!==pair||!openingExitCurrent(s))throw fail('owner changed');
  if(actors.length!==actorRefs.length||actorRefs.some((ref,i)=>actors[i]!==ref.actor||ref.actor.originalMotion!==ref.motion||ref.actor.originalGait!==ref.gait||ref.actor.openingLifetime!==lifetime))throw fail('actor owner changed');
  if(!unowned())throw fail('field ownership changed');
  const b=bridge.snapshot();
  if(b.invalidated||b.stage!=='main'||!b.canDraw||b.header!==header||b.generation!==generation||b.pendingKind!==null)throw fail('lifecycle changed');
  return b.revision;
 };
 const revision=current();
 // Decide the branch once. A lost owner fails closed, never ticks a replacement
 // or falls back to the earlier order. Ordinary player progress may change.
 return ()=>{if(current()!==revision)throw fail('revision changed');updateOriginalMotion();};
}

function update(dt){
 if((!nativeRenderer&&!openingProfile?.optionsSession)||profileSwitchPending||openingProfile?.faulted||openingProfile?.recovering)return;openingProfile?.tvRuntime?.preflight();cameraFrame++;state.clock+=dt;
 let changed=false;for(const task of state.tasks){const status=W.taskState(task.start,Date.now());if(status!==task.status){task.status=status;changed=true;if(status==='ready')showToast(W.getHouse(task.id).resident+' finished. Fable 5.2 verified it.');}}if(changed){updateUI();refreshOpenTaskDialog();}
 if(state.clock>toastUntil)$('toast').hidden=true;
 // Field input and field-task callbacks precede model animation and scene draw.
 const tvOverlay=openingProfile?.tvRuntime?.isOverlay();
 const homeInputBlocked=advanceOpeningProfile();
 if(tvOverlay&&openingProfile?.tvRuntime?.isOverlay()){openingProfile.tvRuntime.finish(openingProfile.fieldCallback);updateOpeningProfileUI();return;}
 let boardInputBlocked=homeInputBlocked?true:advanceSourceBoard();
 if(openingProfile?.menu?.ownsField())boardInputBlocked=true;
 if(!boardInputBlocked&&!state.dialog&&!state.transition&&!state.pendingOriginalId&&state.player.progress===1&&PM.inputReady(state.player)){
  const p=state.player,selection=playerInputSelection(),dir=selection.direction<0?null:['up','down','left','right'][selection.direction],facingHeld=[...keys].some(k=>keyDir[k]===p.facing);
  if(state.scene==='town'&&p.facing==='up'&&facingHeld){const door=W.houses.find(h=>p.x===h.doorX&&p.y===h.doorY+1);if(door)enterHouse(door.id);}
  if(state.scene==='interior'){
   const tile=state.roomHeader+':'+p.x+','+p.y;if(state.warpLock&&state.warpLock!==tile)state.warpLock=null;
   const warp=W.getHeader(state.roomHeader).events.warps.find(w=>w.local_x===p.x&&w.local_z===p.y);
   if(warp&&warp.target_header===411&&p.facing==='down'&&facingHeld)leaveHouse();
   else if(warp&&warp.target_header!==411){if(nativeFieldLifecycle)beginSourceStaircase(warp);else if(!state.warpLock)startTransition(()=>enterRoomImmediate(warp.target_header,warp.target_warp));}
  }
  // Original X dispatch follows earlier step/A/held-warp handlers, before a new walk.
  if(openingProfile&&!state.transition&&openingInput?.newKeys.includes('X')&&beginOpeningMenu('normal')){tickOpeningMenu();sourceBoardEdges.sample();boardInputBlocked=true;}
  if(!boardInputBlocked&&dir&&!state.transition)beginStep(p,dir,true,selection);else if(!boardInputBlocked&&!dir&&!state.transition){const result=PM.request(p,null);if(result.accepted)state.playerInput={horizontal:selection.horizontal,vertical:selection.vertical,queuedFacing:state.playerInput.queuedFacing};}
 }
 // Original task dispatch precedes field draw; object movement remains after it.
 if(state.pendingOriginalSession&&!state.transition&&!state.dialog&&(!nativeFieldLifecycle||nativeFieldLifecycle.snapshot().stage==='main'))advanceOriginalScript(state.pendingOriginalSession,++state.originalFieldTaskCallback);
 const arrivalVisit=openingTownInitQueue.arrivalStart();
 if(state.transition?.driver)sourceWarpTask();
 else if(state.transition){const t=state.transition;t.elapsed+=dt;if(!t.applied&&t.elapsed>=P.TRANSITION.fadeOut){if(t.apply()===false){state.transition=null;if(t.onCancel)t.onCancel();}else t.applied=true;}if(state.transition===t&&t.elapsed>=P.TRANSITION.fadeOut+P.TRANSITION.blackHold+P.TRANSITION.fadeIn){state.transition=null;if(t.onFinish)t.onFinish();}}
 openingTownInitQueue.arrivalAfterTask(arrivalVisit);
 const sourceField=typeof nativeFieldLifecycle!=='undefined'&&nativeFieldLifecycle,activeField=!sourceField||sourceField.snapshot().canDraw;
 const previousFieldStage=sourceField?.snapshot().stage;
 if(sourceField){if(activeField)drawNativeField();else advanceNativeLifecycle();}
 else{worldAnimation.tick(state.scene==='town'?411:state.roomHeader,nativeRenderer,state.scene!=='town');worldAnimation.tickDoor();
 // Freeze this draw state before main-queue displacement/visibility cache updates.
 sceneSnapshot=captureSceneSnapshot();}
 if(openingProfile?.optionsSession)openingProfile.optionsSession.child(previousFieldStage);
 if(activeField){const homeOwned=!!openingProfile?.controller?.ownsField(),townPlayerFirst=openingTownInitQueue.arrivalDeferred(arrivalVisit)||openingTownPlayerFirstVisit(boardInputBlocked,homeOwned);if(homeOwned){const controller=openingProfile.controller;controller.tickMainQueue({callbackId:openingProfile.fieldCallback});updateOpeningRivalBystanders(controller);}else if(!openingProfile?.menuPaused&&!townPlayerFirst)updateOriginalMotion();
 if(homeOwned){}else if(openingProfile?.menuPaused){
  // Source held flag4 commands precede the ordinary pause test. Menu input
  // admission permits a replaceable stationary collision, not a new walk.
  if(PM.hasStationaryCommand(state.player))tickOpeningExitPlayer(()=>PM.tick(state.player),true,true);else tickOpeningExitPlayer(null,true,false);
 }else if(openingProfile&&(openingProfile.menu?.ownsField()||openingProfile.menuTaskVisited||openingProfile.directTaskVisited&&!openingProfile.direct?.snapshot().cancelled&&!openingProfile.direct?.isLocked())){
  // Task input ownership is not an actor pause. Deferred entry and teardown
  // retain the unpaused player callback, without requesting a new command.
  tickOpeningExitPlayer(()=>PM.tick(state.player));
 }else if(state.forcedWalk)tickOpeningExitPlayer(advanceForcedWalk);
 else if(PM.hasStationaryCommand(state.player)||!boardInputBlocked&&!state.dialog&&!state.transition&&!state.pendingOriginalId){const result=tickOpeningExitPlayer(()=>PM.tick(state.player));if(openingProfile&&result.complete&&result.kind==='walk')openingProfile.completedStep=true;}else tickOpeningExitPlayer(null,true,false);
 if(townPlayerFirst)townPlayerFirst();
 if(!homeOwned&&!openingProfile?.menuPaused&&!state.dialog&&!state.transition&&!state.pendingOriginalId)for(const n of state.npcs)updateNPC(n,dt);
 state.cachedPlayerHidden=!!state.playerHidden;updateOpeningExitField();}
 if(state.dialog?.type==='original'&&!state.dialog.homeScene&&!state.dialog.profileDirect&&state.originalPrinter)updateOriginalDialog(dt);
 if(state.dialog&&state.textPrinter){const wasReady=state.textPrinter.done;R.advance(state.textPrinter,dt,dialogHeldKeys.size>0);if(!wasReady&&state.textPrinter.done)focusDialogChoice(document.activeElement);}
 // Source main-queue UI callback follows field work; presentation never advances it.
 mapNamePopup.tick();
 // Original queue18 popup service precedes queue24 A/B; late fade follows B.
 serviceOpeningPrinters();
 if(state.transition?.driver)state.transition.driver.pumpFade();
 openingProfile?.optionsSession?.pump();
 if(openingProfile?.tvRuntime){openingProfile.tvRuntime.finish(openingProfile.fieldCallback);updateOpeningProfileUI();}
 const near=openingOwnsField()||state.dialog||state.transition||state.pendingOriginalId||sourceBoardBusy()?null:nearby();$('interaction-hint').hidden=!near;if(near)$('interaction-hint').querySelector('span').textContent=near.label;
}
function frame(now){try{const dt=Math.min(.1,Math.max(0,(now-lastTime)/1000||0));lastTime=now;if(resetPresentationPending){if(nativeRenderer&&!resetElapsedCaptured){logicAccumulator+=dt;resetElapsedCaptured=true;}if(render(now/1000)===true)resetPresentationPending=false;}else{if(nativeRenderer||openingProfile?.optionsSession){logicAccumulator+=dt;let updates=0;while(logicAccumulator+1e-12>=1/30&&updates<3){logicAccumulator-=1/30;updates++;update(1/30);if(effectPlayer)effectPlayer.frame();}}render(now/1000);}}catch(error){if(!resetPresentationPending)logicAccumulator=0;failRenderedFrame(error);}finally{try{if(window.TwinleafFrameFault)window.TwinleafFrameFault.check('schedule');requestAnimationFrame(frame);frameScheduleFailed=false;}catch(error){frameScheduleFailed=true;failRenderedFrame(error);}}}
function handleKey(event){
 if(handleOpeningKey(event))return;
 const boardKey=event.key.length===1?event.key.toLowerCase():event.key;
 if(sourceBoardBusy()||!state.dialog&&!state.pendingOriginalId&&!W.usesNativeKey(event.target?.tagName,boardKey,event.target?.isContentEditable)){
  let mapped=sourceBoardKey(boardKey);if(sourceBoardBusy()&&(boardKey==='Enter'||boardKey===' ')){if(document.activeElement===$('source-board-menu'))mapped='X';else if(document.activeElement===$('source-board-close'))mapped='B';}
  if(mapped)sourceBoardEdges.keyDown('keyboard:'+boardKey,mapped,{repeat:event.repeat===true});if(keyDir[boardKey]||boardKey==='b')keys.add(boardKey);
 }
 if(handleSourceBoardKey(event,boardKey))return;
 if(state.pendingOriginalId){if(event.key==='Escape')closeDialog();event.preventDefault();return;}
 const key=event.key.length===1?event.key.toLowerCase():event.key;
 if(state.dialog?.type==='original'){handleOriginalDialogKey(event,key);return;}
 if(state.dialog&&['e','z',' ','Enter','b'].includes(key))dialogHeldKeys.add(key);
 if(state.dialog&&!dialogPageReady()&&['e','z',' ','Enter','b'].includes(key)&&document.activeElement!==$('dialog-close')){event.preventDefault();if(!event.repeat)R.request(state.textPrinter);return;}
 if(state.dialog&&['e','z',' ','Enter'].includes(key)&&!event.repeat&&state.dialogPage<F.pages($('dialog-text').textContent).length-1){event.preventDefault();advanceDialog();return;}
 if(W.usesNativeKey(event.target?.tagName,key,event.target?.isContentEditable))return;
 if(state.dialog){
  if((key==='e'||key==='z'||key===' '||key==='Enter')&&!event.repeat){event.preventDefault();advanceDialog();return;}
  if(key==='Escape'||key==='b'){event.preventDefault();playEffect(1500);closeDialog();return;}
  if(key==='Tab'){const focusable=[$('dialog-close'),...($('dialog-actions').hidden?[]:Array.from($('dialog-actions').querySelectorAll('button:not(:disabled)')))];const index=focusable.indexOf(document.activeElement);let target;if(event.shiftKey&&index<=0)target=focusable[focusable.length-1];else if(!event.shiftKey&&index===focusable.length-1)target=focusable[0];if(target){event.preventDefault();target.focus();}return;}
  return;
 }
 if(keyDir[key]||key==='b'){event.preventDefault();keys.add(key);}
 else if((key==='e'||key===' '||key==='Enter'||key==='z')&&!event.repeat){if(event.target.tagName==='BUTTON'&&key==='Enter')return;event.preventDefault();interact(event);}
 else if(key==='x'&&!event.repeat){event.preventDefault();} // Deferred to the field input scan.
}
window.addEventListener('keydown',handleKey);window.addEventListener('keyup',e=>{const key=e.key.length===1?e.key.toLowerCase():e.key;openingProfile?.edges.keyUp('keyboard:'+key);sourceBoardEdges.keyUp('keyboard:'+key);if(!(openingProfile?.edges||sourceBoardEdges).physical.has('touch:'+key))keys.delete(key);dialogHeldKeys.delete(key);if(keyDir[key]===state.bumpDirection)state.bumpDirection=null;});window.addEventListener('blur',()=>{keys.clear();dialogHeldKeys.clear();sourceBoardEdges.reset();openingProfile?.edges.reset();});document.addEventListener('visibilitychange',()=>{keys.clear();dialogHeldKeys.clear();sourceBoardEdges.reset();openingProfile?.edges.reset();if(document.hidden&&audioContext&&recorder?.state!=='recording')audioContext.suspend();else if(musicEnabled&&audioContext)audioContext.resume();});
canvas.addEventListener('pointerdown',event=>{if(state.dialog?.type==='original'){const box=canvas.getBoundingClientRect(),x=(event.clientX-box.left)*canvas.width/box.width,y=(event.clientY-box.top)*canvas.height/box.height;if(x>=0&&x<=512&&y>=288&&y<=384){event.preventDefault();dialogHeldKeys.add('pointer');advanceOriginalDialog();ignoreNextTextClick=true;}return;}if(!state.dialog||dialogPageReady())return;const box=canvas.getBoundingClientRect(),x=(event.clientX-box.left)*canvas.width/box.width,y=(event.clientY-box.top)*canvas.height/box.height;if(x>=0&&x<=512&&y>=288&&y<=384){dialogHeldKeys.add('pointer');R.request(state.textPrinter);ignoreNextTextClick=true;}});window.addEventListener('pointercancel',()=>{dialogHeldKeys.delete('pointer');ignoreNextTextClick=false;});window.addEventListener('pointerup',event=>{dialogHeldKeys.delete('pointer');const box=canvas.getBoundingClientRect(),x=(event.clientX-box.left)*canvas.width/box.width,y=(event.clientY-box.top)*canvas.height/box.height;if(x<0||x>512||y<288||y>384)ignoreNextTextClick=false;});
canvas.addEventListener('click',event=>{if(state.dialog){const box=canvas.getBoundingClientRect(),x=(event.clientX-box.left)*canvas.width/box.width,y=(event.clientY-box.top)*canvas.height/box.height;const hit=dialogHitAreas.find(a=>x>=a.x&&x<=a.x+a.w&&y>=a.y&&y<=a.y+a.h);if(hit?.advance){if(ignoreNextTextClick){ignoreNextTextClick=false;return;}if(state.dialog.type==='original'){advanceOriginalDialog();return;}if(!dialogPageReady()){R.request(state.textPrinter);return;}playEffect(1500);advanceDialogPage();}else if(hit?.button&&!hit.button.disabled)hit.button.click();return;}canvas.focus({preventScroll:true});});$('dialog-close').addEventListener('click',()=>{if(openingOwnsField())return;playEffect(1500);closeDialog();});$('touch-interact').addEventListener('click',interact);$('original-continue').addEventListener('click',advanceOriginalDialog);$('original-close').addEventListener('click',()=>{if(state.dialog?.homeScene)return;if(state.dialog?.type==='original'){playEffect(1500);closeDialog();}});
$('source-board-close').addEventListener('click',()=>{if(sourceBoard.snapshot().inputReady)sourceBoardPulse('B');});
$('source-board-menu').addEventListener('click',()=>{if(sourceBoard.snapshot().inputReady)sourceBoardPulse('X');});
$('reset-button').addEventListener('click',()=>{if(openingProfile){restartOpeningProfile();return;}if(profileSwitchPending)return;state.dialog={type:'reset'};openDialog('A fresh morning?','RESET THIS VISIT','This will clear the houses you’ve visited, neighbors you’ve met, and sample tasks. Your progress is only kept for this page session.','↺');action('Reset this visit',reset);focusDialogChoice(action('Keep exploring',closeDialog));});
for(const b of document.querySelectorAll('[data-key]')){b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);const key=sourceBoardKey(b.dataset.key);if(key)(openingProfile?openingProfile.edges:sourceBoardEdges).keyDown('touch:'+b.dataset.key,key);keys.add(b.dataset.key);});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>{openingProfile?.edges.keyUp('touch:'+b.dataset.key);sourceBoardEdges.keyUp('touch:'+b.dataset.key);if(!(openingProfile?.edges||sourceBoardEdges).physical.has('keyboard:'+b.dataset.key))keys.delete(b.dataset.key);if(keyDir[b.dataset.key]===state.bumpDirection)state.bumpDirection=null;});}
let lightingValidation='';
function updateLightingStatus(stats){
 const value=lightingPreview.snapshot().value,detail=stats&&stats.lightingRecord!=null?' · source '+stats.lightingGroup+' record '+stats.lightingRecord:'';
 const text=lightingValidation||value+' fixed preview'+detail+' · original reference clock unknown';
 const status=$('lighting-status');if(status.textContent!==text)status.textContent=text;
}
function chooseLighting(value){
 if(openingOwnsField()||profileSwitchPending)return false;
 if(!lightingPreview.choose(value)){lightingValidation='Use a 24-hour time from 00:00 through 23:59. Current preview was not changed.';updateLightingStatus(null);return false;}
 lightingValidation='';
 $('lighting-time').value=lightingPreview.snapshot().value;updateLightingStatus(null);return true;
}
$('lighting-apply').addEventListener('click',()=>chooseLighting($('lighting-time').value));
$('lighting-noon').addEventListener('click',()=>chooseLighting('12:00'));
updateLightingStatus(null);

// Adapter for the opaque recorded stereo track only. Effects use source master
// pan. This L+R/2 duplicated matrix is not native per-voice BGM equivalence.
function createRecordedMusicMatrix(context,output){
 const nodes=[];let mono=false;const make=(method,...args)=>{const node=context[method](...args);nodes.push(node);return node;};
 try{const input=make('createGain'),stereo=make('createGain'),split=make('createChannelSplitter',2),left=make('createGain'),right=make('createGain'),merge=make('createChannelMerger',2),mixed=make('createGain');
  input.channelCount=2;input.channelCountMode='explicit';input.channelInterpretation='speakers';
  left.gain.value=right.gain.value=.5;stereo.gain.value=1;mixed.gain.value=0;
  input.connect(stereo);stereo.connect(output);input.connect(split);split.connect(left,0);split.connect(right,1);left.connect(merge,0,0);left.connect(merge,0,1);right.connect(merge,0,0);right.connect(merge,0,1);merge.connect(mixed);mixed.connect(output);
  return Object.freeze({input,setMono(value){if(typeof value!=='boolean')throw Error('Recorded-track mono intent');mono=value;stereo.gain.value=value?0:1;mixed.gain.value=value?1:0;},snapshot:()=>({mono,scope:'recorded-stereo-matrix-not-native-voices',left:[mono?.5:1,mono?.5:0],right:[mono?.5:0,mono?.5:1]}),dispose(){for(const node of nodes)node.disconnect();}});
 }catch(error){for(const node of nodes)try{node.disconnect();}catch(_){}throw error;}
}
function setRecordedMusicMono(value){if(typeof value!=='boolean')throw Error('Recorded-track mono intent');recordedMusicMatrix?.setMono(value);}

// User-supplied original music, decoded candidate loop. No synthesized replacement tune.
async function ensureAudio({nativeOnly=false}={}){
 if(!audioContext){let context=null,gain=null,capture=null;try{context=new(window.AudioContext||window.webkitAudioContext)();gain=context.createGain();gain.gain.value=.8;capture=context.createMediaStreamDestination();gain.connect(capture);audioContext=context;audioGain=gain;audioCapture=capture;}catch(error){try{gain?.disconnect();}catch(_){}try{capture?.disconnect();}catch(_){}try{for(const track of capture?.stream.getTracks?.()||capture?.stream.getAudioTracks()||[])track.stop();}catch(_){}try{context?.close()?.catch(()=>{});}catch(_){}throw error;}}
 if(nativeOnly){await audioContext.resume();return;}
 if(!recordedMusicMatrix)recordedMusicMatrix=createRecordedMusicMatrix(audioContext,audioGain);recordedMusicMatrix.setMono(liveSoundMethod===1);
 await audioContext.resume();
 if(!musicBuffer){const binary=atob(window.TwinleafReferenceAudio.base64),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);musicBuffer=await audioContext.decodeAudioData(bytes.buffer);}
 if(!effectPlayer)effectPlayer=window.FieldEffects.create(audioContext,audioGain,()=>musicEnabled,window.SourceEffectData,{onFault:handleEffectFault});effectPlayer.setMono(liveSoundMethod===1);await effectPlayer.load();
}
function handleEffectFault(error){const message='Source effects failed: '+error.message;if(recordingAbort)recordingAbort(message);stopMusic();showToast(message+' Audio was stopped; use Audio: on to retry.');}
function playEffect(id){if(openingProfile?.tvRuntime)return openingProfile.tvRuntime.playEffect(id);return effectPlayer?effectPlayer.play(id):false;}
async function startMusic(stillWanted=()=>true,intent=++audioIntent){await ensureAudio();if(intent!==audioIntent||!stillWanted())return;if(!musicSource){let source=null;try{source=audioContext.createBufferSource();source.buffer=musicBuffer;source.loop=true;source.loopStart=0;source.loopEnd=musicBuffer.duration;source.connect(recordedMusicMatrix.input);source.start();musicSource=source;}catch(error){try{source?.stop();}catch(_){}try{source?.disconnect();}catch(_){}throw error;}}musicEnabled=true;$('music-button').setAttribute('aria-pressed','true');$('music-button').textContent='Audio: on';}
function stopMusic(){++audioIntent;if(musicSource){musicSource.stop();musicSource.disconnect();musicSource=null;}musicEnabled=false;if(effectPlayer)effectPlayer.stopAll();$('music-button').setAttribute('aria-pressed','false');$('music-button').textContent='Audio: off';}
$('music-button').addEventListener('click',async()=>{if(openingOwnsField()||profileSwitchPending||openingProfile?.tvOrigin)return;const intent=++audioIntent;try{if(musicEnabled)stopMusic();else{await startMusic(()=>true,intent);if(intent!==audioIntent)return;showToast('Recording audio enabled: original reference music plus source-derived effects. Live speakers remain muted; audible parity is unverified.');}}catch(error){if(intent!==audioIntent)return;stopMusic();showToast('Audio could not start: '+error.message);}});
$('record-button').addEventListener('click',async()=>{
 if(profileSwitchPending)return;
 const nativeTvRecording=!!openingProfile?.tvOrigin;
 const safeUI=fn=>{try{fn();}catch(_){}};
 if(recordingPhase==='starting'||recordingPhase==='stopping')return;
 if(recordingPhase==='recording'&&recorder){recordingStartToken.stop();return;}
 if(!nativeRenderer||!nativeRenderReady){$('record-status').textContent='Recording unavailable: source renderer is not ready.';return;}
 recordingPhase='starting';safeUI(()=>{$('record-button').disabled=true;});
 const token={cancelled:false};recordingStartToken=token;
 const cancelStartup=reason=>{token.cancelled=true;if(recordingStartToken!==token)return;recordingPhase='idle';if(recordingAbort===cancelStartup)recordingAbort=null;safeUI(()=>{$('record-status').textContent='Recording not started: '+reason;$('record-button').disabled=!nativeRenderer||!nativeRenderReady;});};recordingAbort=cancelStartup;
 let stream=null,controller=null,nativeBridge=null,nativeOwner=null,nativeToken=null;const ownedTracks=[];
 const releaseCapture=()=>{const errors=[];if(nativeToken){try{nativeOwner.endCapture(nativeToken);}catch(e){errors.push(e);}nativeToken=null;}if(nativeBridge){nativeRecordingLast=nativeBridge.snapshot();try{nativeBridge.dispose();}catch(e){errors.push(e);}nativeBridge=null;}for(const track of ownedTracks.splice(0))try{track.stop();}catch(error){errors.push(error);}if(errors.length)throw new AggregateError(errors,'Capture track cleanup failed');};
 try{
  const browserTarget=$('record-destination').value==='browser';
  if(!browserTarget&&(!window.isSecureContext||typeof window.showSaveFilePicker!=='function'))throw new Error('A secure browser with Save File picker support is required. Select the explicit review-buffer destination for browser download.');
  if(!window.MediaRecorder||!canvas.captureStream)throw new Error('Canvas recording is not supported by this browser.');
  const mime=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(type=>MediaRecorder.isTypeSupported(type));
  if(!mime)throw new Error('This browser does not support WebM recording.');
  // This is the first awaited operation, preserving the Record click's user activation.
  const handle=browserTarget?window.BrowserRecordingTarget.create($('record-download')):await window.showSaveFilePicker({suggestedName:'twinleaf-bounded-walkthrough.webm',types:[{description:'WebM canvas and in-game audio',accept:{'video/webm':['.webm']}}],excludeAcceptAllOption:true});
  if(token.cancelled||recordingStartToken!==token)return;
  const file=await handle.getFile();if(file.size!==0)throw new Error('Choose a NEW empty file; existing nonempty files are refused.');
  if(token.cancelled||recordingStartToken!==token)return;
  const emptyFile={size:file.size,lastModified:file.lastModified};
  token.audioIntent=++audioIntent;
  if(nativeTvRecording){await ensureAudio({nativeOnly:true});if(musicSource)throw Error('Recorded-loop source must be absent for native TV capture');nativeOwner=currentTvCaptureRuntime();nativeBridge=window.NativeRecordingBridge.create(audioContext,audioGain);}else await startMusic(()=>!token.cancelled&&recordingStartToken===token,token.audioIntent);
  if(token.cancelled||recordingStartToken!==token)return;
  if(token.audioIntent!==audioIntent){cancelStartup('Audio selection changed during startup.');return;}
  if(!nativeRenderer||!nativeRenderReady)throw new Error('Source renderer became unavailable during recording startup.');
  stream=canvas.captureStream(30);ownedTracks.push(...stream.getTracks());for(const track of audioCapture.stream.getAudioTracks()){const clone=track.clone();ownedTracks.push(clone);stream.addTrack(clone);}
  const activeRecorder=new MediaRecorder(stream,{mimeType:mime});recorder=activeRecorder;
  const ownsUI=()=>recordingStartToken===token;
  controller=window.BoundedRecording.create({recorder:activeRecorder,fileHandle:handle,emptyFile,Blob:window.Blob,now:()=>performance.now(),setTimer:(fn,ms)=>setTimeout(fn,ms),clearTimer:id=>clearTimeout(id),
   onState(value){if(!ownsUI())return;const active=value.phase==='recording';if(active)recordingPhase='recording';else if(value.phase!=='new')recordingPhase='stopping';safeUI(()=>{$('record-button').disabled=!active;$('record-button').textContent=active?'Stop & save bounded recording':'Finalizing bounded recording';$('record-status').textContent=value.failures.length?'Recording not accepted: '+value.failures.map(e=>e.stage+': '+e.message).join('; '):value.phase==='writing'?'Writing complete '+value.retainedBytes+'-byte WebM to the chosen file.':value.phase==='saved'?'Saved complete '+value.retainedBytes+'-byte WebM to '+handle.name+'. Verify playback/audio separately; live speakers stayed muted.':'Bounded capture: '+value.retainedBytes+' / 4194304 accepted bytes. Automatic stop by 170 seconds or 3 MiB; final export must fit 4 MiB. Live speakers remain muted.';});},
   onTerminal(value){releaseCapture();token.stop=null;if(recordingAbort===abortSession)recordingAbort=null;if(recorder===activeRecorder)recorder=null;if(!ownsUI())return;recordingPhase=value.uncertain?'stopping':'idle';safeUI(()=>{$('record-button').disabled=value.uncertain||!nativeRenderer||!nativeRenderReady;$('record-button').textContent=value.uncertain?'Recording outcome uncertain; reload required':'Record bounded walkthrough';if(browserTarget&&value.phase==='saved'){try{handle.publish();$('record-status').textContent='Accepted complete '+value.retainedBytes+'-byte WebM in review buffer. Click Download accepted WebM explicitly. Browser download completion is not tracked here; verify the file and playback separately.';}catch(error){$('record-status').textContent='Recording buffer accepted but download link publication failed: '+error.message+'. This recording was not exported; any previous download link is retained.';}}if(value.uncertain)$('record-status').textContent+=(value.fileMayContainBytes?' The selected file may contain bytes; inspect it before any later attempt.':'')+' No retry or overwrite was attempted.';});}
  });
  const abortSession=reason=>controller.abort(reason);recordingAbort=abortSession;token.stop=()=>controller.stop();if(nativeBridge)nativeToken=beginTvCapture(nativeBridge.accept);controller.start();
 }catch(error){
  if(controller){controller.abort(error);return;}
  let cleanupError=null;try{releaseCapture();}catch(e){cleanupError=e;}
  if(token.cancelled||recordingStartToken!==token)return;
  token.cancelled=true;recorder=null;recordingAbort=null;recordingPhase=cleanupError?'stopping':'idle';safeUI(()=>{$('record-button').disabled=!!cleanupError||!nativeRenderer||!nativeRenderReady;$('record-status').textContent='Recording unavailable: '+(error.name==='AbortError'?'file selection cancelled':error.message)+(cleanupError?'; '+cleanupError.message:'')+'. No recording was exported.';});
 }
});

function toggleMenu(){if(openingProfile){if(openingProfile.faulted||openingProfile.recovering)return false;openingProfile.edges.pulse('X');return true;}if(openingOwnsField()||profileSwitchPending)return false;if(sourceBoardBusy()){sourceBoardPulse('X');return;}menuOpen=!menuOpen;if(menuOpen&&nativeRenderer&&!state.transition&&!state.dialog&&!state.pendingOriginalId&&state.player.progress===1&&PM.inputReady(state.player))mapNamePopup.cancel();$('notebook-panel').hidden=!menuOpen;$('menu-button').setAttribute('aria-expanded',String(menuOpen));}
$('menu-button').addEventListener('click',toggleMenu);
for(const [id,key] of [['opening-menu-up','UP'],['opening-menu-down','DOWN'],['opening-menu-a','A'],['opening-menu-b','B']])$(id).addEventListener('click',()=>{if(openingProfile?.menu?.ownsField())openingProfile.edges.pulse(key);});
// Small deterministic QA surface; no services, persistence, or remote access.
window.__TOWN_DEMO__={
 nativeAudioCapture:Object.freeze({begin:sink=>beginTvCapture(sink),end:token=>currentTvCaptureRuntime().endCapture(token),status:()=>currentTvCaptureRuntime().captureStatus()}),
 snapshot:()=>({openingProfile:openingProfile?{id:openingProfile.tvOrigin?'source-TV-origin-scenario-v1':'ordinary-original-opening-v1',tvRuntime:openingProfile.tvRuntime?.snapshot()||null,lastTvRuntime:openingProfile.lastTvRuntime||null,tvDefaultRequest:openingProfile.tvDefaultRequest||null,playerName:openingProfile.playerName,rivalName:openingProfile.rivalName,dialogueFrameId:openingProfile.dialogueFrameId,faulted:openingProfile.faulted,recovering:!!openingProfile.recovering,actorLifetime:openingProfile.actorLifetime,options:{...openingProfile.options},optionsSession:openingProfile.optionsSession?.snapshot()||null,lastOptionsSession:openingProfile.lastOptionsSession||null,controller:openingProfile.controller?.snapshot()||null,direct:openingProfile.direct?.snapshot()||null,lastDirect:openingProfile.lastDirect||null,directTaskVisited:!!openingProfile.directTaskVisited,directEvents:openingProfile.directEvents.slice(),effects:openingProfile.effects?.snapshot()||null,exitIndicator:openingProfile.exitField?.effect.snapshot()||null,lastExitIndicator:openingProfile.lastExitField||null,soundRequests:openingProfile.soundRequests.slice(),fieldCallback:openingProfile.fieldCallback,menu:openingProfile.menu?.snapshot()||null,lastMenu:openingProfile.lastMenu||null,menuPaused:openingProfile.menuPaused,menuTaskVisited:!!openingProfile.menuTaskVisited,menuEvents:openingProfile.menuEvents.slice()}:null,profileSwitchPending,sourceInputStatus14:state.sourceInputStatus14,sourceBoardLastEntry:state.sourceBoardLastEntry,sourceBoardInputContract:state.sourceBoardInputContract,sourceBoard:sourceBoard.snapshot(),sourceBoardObjects:JSON.parse(JSON.stringify(state.boardObjects)),sourceBoardPending:pendingSourceBoard,sourceBoardCancelReason,scene:state.scene,houseId:state.houseId,player:{...state.player},visited:[...state.visited],met:[...state.met],tasks:state.tasks.map(t=>({...t})),dialog:state.dialog?{...state.dialog}:null,originalDialogue:state.originalPrinter?.snapshot()||null,originalStory:JSON.parse(JSON.stringify(state.originalStory)),npcs:state.npcs.map(n=>({...n})),originals:JSON.parse(JSON.stringify(state.originals)),ownsRunningShoes:state.ownsRunningShoes,mapNamePopup:mapNamePopup.snapshot(),playerMotion:openingProfile?.tvRuntime?.isOverlay()&&!state.player.playerMotion?null:PM.snapshot(state.player),musicEnabled,soundMethod:liveSoundMethod,buttonMode:liveButtonMode,recordedMusicMatrix:recordedMusicMatrix?.snapshot()||null,lightingPreview:lightingPreview.snapshot(),roomHeader:state.roomHeader,camera:nativeRenderer?.getDiagnostics()||null,rendererError,transition:state.transition?{elapsed:state.transition.elapsed,applied:state.transition.applied,kind:state.transition.kind,source:state.transition.driver?.snapshot()||null}:null,animation:worldAnimation.snapshot(),sourceField:nativeFieldLifecycle?.snapshot()||null,sourceFieldView:fieldView?JSON.parse(JSON.stringify(fieldView)):null,staircaseHeight:nativePlayerHeight?{...nativePlayerHeight}:null,staircaseHeightProfile:nativeHeightProfile?{...nativeHeightProfile}:null,drawSnapshot:sceneSnapshot?JSON.parse(JSON.stringify(sceneSnapshot)):null,nativeRecordingLast,recording:recorder?.state||'inactive',audioDuration:musicBuffer?.duration||null}),
 teleport:(x,y,facing='up')=>{if(nativeFieldLifecycle)throw Error('Native source loader does not admit debug teleport');if(state.transition||state.pendingOriginalId)return false;sceneSnapshot=null;state.player={x,y,fromX:x,fromY:y,toX:x,toY:y,progress:1,facing,step:0};nativeRenderer?.resetCamera(state.scene==='town'?411:state.roomHeader,worldPosition(state.player));},
 interact, enterHouse, leaveHouse, startTask, closeDialog, reset,
 canMove:(x,y)=>canMove(x,y,'player'),
 advanceTasks:()=>{state.tasks.forEach(t=>t.start-=5000);update(.01);},
 step:(dir)=>{if(state.transition||state.pendingOriginalId)return false;return beginStep(state.player,dir,true);},
 render:()=>render(state.clock)
};
reset();updateOpeningProfileUI();$('record-button').disabled=true;try{requestAnimationFrame(frame);}catch(error){frameScheduleFailed=true;failRenderedFrame(error);}
function refreshReferenceDialogueImages(){
 referenceDialogueImages.frame.src=window.SourceReferenceDialogueData.frame.dataUrl;
 referenceDialogueImages.arrows.forEach((image,i)=>{image.src=window.SourceReferenceDialogueData.arrows[i].dataUrl;});
}
function refreshRuntimeImages(){
 for(const[id,info]of Object.entries(window.NativeSpriteData)){const url=window.SourceImageData[info.file.split('/').pop()];if(typeof url!=='string')throw new Error('Missing embedded sprite image: '+id);nativeAtlases[id].src=url;}
 for(const[id,info]of Object.entries(O.data.sprites)){if(typeof info.data!=='string')throw new Error('Missing original human image: '+id);nativeAtlases[id].src=info.data;}
 for(const[name,url]of Object.entries(F.data.images)){if(typeof url!=='string')throw new Error('Missing field image: '+name);fieldImages[name].src=url;}
 refreshReferenceDialogueImages();
}
function invalidateNativeInitialization(){
 // Retire exposed work immediately; an uncancellable decode may settle later.
 const owner=rendererInitOwner;rendererInitGeneration++;rendererInitOwner=null;rendererInitPromise=null;
 if(rendererReadyWaiter&&rendererReadyWaiter.owner===owner){const waiter=rendererReadyWaiter;rendererReadyWaiter=null;waiter.resolve();}
 owner?.cancel();
}
function initializeNativeRenderer(retainRenderer=false){
 assertCaptureHostIdle();
 if(rendererInitPromise)return rendererInitPromise;
 const profile=openingProfile,recoveryProfile=!retainRenderer&&profile?.faulted?profile:null;
 const owner={generation:++rendererInitGeneration,profile,state,fieldGeneration,intent:retainRenderer?'retained-default':'assets',retainedRenderer:retainRenderer?nativeRenderer:null,cancel:null};rendererInitOwner=owner;
 const owns=()=>rendererInitOwner===owner&&rendererInitGeneration===owner.generation&&openingProfile===profile&&state===owner.state&&fieldGeneration===owner.fieldGeneration&&(!retainRenderer||nativeRenderer===owner.retainedRenderer);
 const cancelled=new Promise(resolve=>{owner.cancel=resolve;});
 const work=Promise.resolve().then(async()=>{
  if(!owns())return;
  if(recoveryProfile){prepareOpeningRestart(true);owner.state=state;owner.fieldGeneration=fieldGeneration;}
  nativeRenderReady=false;rendererError=null;$('record-button').disabled=true;if(state.transition?.sourceAdmissionError)throw Error(state.transition.sourceAdmissionError);
  if(!retainRenderer){
   if(nativeRenderer){nativeRenderer.dispose();nativeRenderer=null;}
   refreshRuntimeImages();
   await Promise.all(Object.values(nativeAtlases).map(image=>image.decode()));
   if(!owns())return;
   await Promise.all([...Object.values(fieldImages),referenceDialogueImages.frame,...referenceDialogueImages.arrows].map(image=>image.decode()));
   if(!owns())return;
   let renderer=suspendedNativeRenderer;
   if(renderer){suspendedNativeRenderer=null;nativeRecoveryNeedsDraw=true;}else{
    const sourceAtlases=window.SourceNativeHost.createAtlases(window.SourceCpuRenderer,window.SourceNativeBrowserAssets,window.SourceNativeActorAudit,Object.keys(nativeAtlases));
    renderer=await window.SourceCpuRenderer.create(meshSurface,window.SourceNativeNeighborAudit.createShared(window.TwinleafSourceData),sourceAtlases,{lightingSecondsOfDay:lightingPreview.snapshot().secondsOfDay,nativeBrowserDiagnostic:'source-bytes-v1'});
    if(!owns()){renderer.dispose();return;}
    lastNativeFrame=null;nativeRecoveryNeedsDraw=false;renderer.resetCamera(state.scene==='town'?411:state.roomHeader,worldPosition(state.player));
   }
   if(!owns()){renderer.dispose();return;}
   nativeRenderer=renderer;areaTextureHashes=Object.create(null);worldAnimation.sync(renderer,true);if(recoveryProfile&&!recoveryProfile.tvOrigin)installOpeningExitField();
  }else if(!nativeRenderer)throw Error('Retained default renderer is unavailable');
  if(!owns())return;
  $('location-note').textContent='CPU source mesh · awaiting first frame';
  await new Promise((resolve,reject)=>{rendererReadyWaiter={owner,resolve,reject};if(frameScheduleFailed){try{requestAnimationFrame(frame);frameScheduleFailed=false;}catch(error){frameScheduleFailed=true;failRenderedFrame(error);}}});
  if(!owns())return;
  if(recoveryProfile){recoveryProfile.faulted=false;recoveryProfile.recovering=false;keys.clear();sourceBoardEdges.reset();recoveryProfile.edges.reset();updateOpeningProfileUI();}
 }).catch(error=>{if(!owns())return;failRenderedFrame(error);throw error;});
 const attempt=Promise.race([work,cancelled]).finally(()=>{if(rendererInitOwner===owner)rendererInitOwner=null;if(rendererInitPromise===attempt)rendererInitPromise=null;});
 rendererInitPromise=attempt;return attempt;
}
window.TwinleafBoot.setRecovery(initializeNativeRenderer);
if(!frameScheduleFailed)initializeNativeRenderer().catch(()=>{});

})();
