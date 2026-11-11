(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-native-area-animation.js'),require('./source-native-neighbor-loader.js'));else root.SourceNativeFieldLifecycle=factory(root.SourceNativeAreaAnimation,root.SourceNativeNeighborLoader);})(typeof globalThis!=='undefined'?globalThis:this,function(Manager,Loader){
'use strict';
function check(ok,message){if(!ok)throw Error('Native field lifecycle unsupported: '+message);}
check(Manager&&typeof Manager.create==='function'&&Loader&&typeof Loader.create==='function','manager and loader dependencies');
const bridges=new WeakMap();
const own=Object.getOwnPropertyDescriptor;
function fields(value,names,label){check(value&&typeof value==='object'&&!Array.isArray(value),label+' explicit fields');const actual=Reflect.ownKeys(value);check(actual.length===names.length&&actual.every(n=>names.includes(n)),label+' exact fields');const out={};for(const name of names){const d=own(value,name);check(d&&Object.hasOwn(d,'value')&&d.enumerable,label+' accessor or hidden field');out[name]=d.value;}return out;}
function freeze(value){if(value&&typeof value==='object'){for(const child of Object.values(value))freeze(child);Object.freeze(value);}return value;}
function signed(value){return Number.isInteger(value)&&value>=-2147483648&&value<=2147483647&&!Object.is(value,-0);}
function raw(value){const p=fields(value,['x','y','z'],'raw player position');check(Object.values(p).every(signed),'raw player position requires signed32 FX12');return p;}
function generation(value){check(Number.isSafeInteger(value)&&value>0,'positive safe lifetime generation');return value;}
function location(value){const c=fields(value,['header','tile'],'location');check(Number.isInteger(c.header)&&c.header>=411&&c.header<=417,'only source headers411..417');check(Array.isArray(c.tile)&&c.tile.length===2&&Reflect.ownKeys(c.tile).length===3,'exact local tile pair');const tile=[0,1].map(i=>{const d=own(c.tile,String(i));check(d&&Object.hasOwn(d,'value')&&d.enumerable,'dense tile without accessors');check(Number.isInteger(d.value)&&d.value>=0&&d.value<32&&!Object.is(d.value,-0),'local tile0..31');return d.value;});return freeze({header:c.header,tile,areaId:c.header===411?6:20});}
function configuration(value){const c=fields(value,['header','tile','generation','profile'],'bootstrap');check(c.profile==='ordinary-no-poketch','explicit ordinary-no-poketch preview profile required');return {location:location({header:c.header,tile:c.tile}),generation:generation(c.generation),profile:c.profile};}
function resources(loc,gen){let manager=null;try{manager=Manager.create({areaId:loc.areaId,generation:gen});const loader=loc.header===411?Loader.create({header:411,tile:loc.tile,generation:gen}):null;return {manager,loader};}catch(error){if(manager)manager.destroy({generation:gen});throw error;}}
function create(options){
 check(arguments.length===1,'explicit bootstrap options');const config=configuration(options);let loc=config.location,gen=config.generation,stage='main',revision=0,stopRequested=false,invalidated=false,pending=null,accepted=null;
 let initial=resources(loc,gen),manager=initial.manager,loader=initial.loader;initial=null;
 const records=new WeakMap();
 function live(){check(!invalidated,'invalidated app-owned bridge');}
 function idle(expected){live();check(pending===null,'callback already pending');check(stage===expected,'expected '+expected+', actual '+stage);check(revision<Number.MAX_SAFE_INTEGER,'callback revision exhausted');}
 function snapshot(){check(arguments.length===0,'snapshot arity');return freeze({profile:config.profile,header:loc.header,tile:loc.tile,areaId:loc.areaId,generation:gen,revision,stage,invalidated,stopRequested,overlayExists:!invalidated&&!['absent','location1','location2','location-ready'].includes(stage),ready:!invalidated&&stage==='main'&&!stopRequested,canDraw:!invalidated&&stage==='main',unloadComplete:!invalidated&&['absent','location1','location2','location-ready'].includes(stage),locationComplete:!invalidated&&stage==='location-ready',restoreComplete:!invalidated&&stage==='main'&&!stopRequested,manager:manager?manager.state():null,loader:loader?loader.snapshot():null,pendingKind:pending?pending.kind:null,hasAcceptedView:accepted!==null});}
 function make(kind,nextStage,data,privateData){const token=freeze(Object.assign({kind,header:loc.header,areaId:loc.areaId,generation:gen,revision,draw:false,nextStage,rawPosition:null,neighborSubmission:null,managerSnapshot:null,requests:[],sourceEvents:[],loaderFieldEvents:[],loaderMainqueueEvents:[],loaderBeforeMainqueue:null,loaderAfter:null,managerNextState:null},data||{}));records.set(token,Object.assign({status:'pending',nextStage,managerTransaction:null,loaderTransaction:null,nextResources:null,nextLocation:null,nextGeneration:null},privateData||{}));pending=token;return token;}
 function record(token){live();const r=records.get(token);check(r&&r.status==='pending'&&pending===token&&token.revision===revision&&token.generation===gen,'stale, foreign, forged or closed callback');return r;}
 function viewRecord(view){live();const r=records.get(view);check(r&&view.kind==='field'&&((r.status==='pending'&&pending===view)||(r.status==='accepted'&&accepted===view))&&view.generation===gen,'stale, foreign, forged or closed field view');check(manager!==null,'no live manager for field view');if(view.neighborSubmission)Loader.verifySubmission(view.neighborSubmission,gen);return r;}
 function prepareField(position){
  check(arguments.length===1,'field requires actual raw player position');idle('main');const p=raw(position);let mt=null,lt=null;
  try{mt=manager.beginField({generation:gen,enabled:true});if(loader)lt=loader.prepareField(p);return make('field',stopRequested?'exit0':'main',{draw:true,rawPosition:p,neighborSubmission:lt?lt.submission:null,managerSnapshot:mt.renderSnapshot,requests:mt.requests,sourceEvents:['area_animation_update','neighbor_loader_update','scene_draw','post_draw_mainqueue'],loaderFieldEvents:lt?lt.fieldEvents:[],loaderMainqueueEvents:lt?lt.mainqueueEvents:[],loaderBeforeMainqueue:lt?lt.beforeMainqueue:null,loaderAfter:lt?lt.after:null,managerNextState:mt.nextState},{managerTransaction:mt,loaderTransaction:lt});}
  catch(error){if(lt)loader.abort(lt);if(mt)manager.abort(mt);throw error;}
 }
 function preflightStop(){check(arguments.length===0,'stop request arity');idle('main');check(!stopRequested,'stop already requested');return true;}
 function requestStop(){preflightStop.apply(null,arguments);stopRequested=true;return snapshot();}
 function prepareExit0(position){check(arguments.length===1,'exit0 requires actual raw player position');idle('exit0');const p=raw(position),lt=loader?loader.prepareExit0(p):null;return make('exit0','exit1',{rawPosition:p,sourceEvents:['neighbor_loader_update','clear_raw_pointer','cancel_loader_jobs','free_neighbor_slots','destroy_animation_manager'],loaderFieldEvents:lt?lt.fieldEvents:[],loaderMainqueueEvents:lt?lt.mainqueueEvents:[],loaderBeforeMainqueue:lt?lt.beforeMainqueue:null,loaderAfter:lt?lt.after:null},{loaderTransaction:lt});}
 function prepareExit1(){check(arguments.length===0,'exit1 arity');idle('exit1');const lt=loader?loader.prepareExit1():null;return make('exit1','exit2',{sourceEvents:['neighbor_loader_drain','verify_loader_quiescence','destroy_loader_narc','ordinary_no_poketch_teardown'],loaderFieldEvents:lt?lt.fieldEvents:[],loaderMainqueueEvents:lt?lt.mainqueueEvents:[],loaderBeforeMainqueue:lt?lt.beforeMainqueue:null,loaderAfter:lt?lt.after:null},{loaderTransaction:lt});}
 function prepareExit2(){check(arguments.length===0,'exit2 arity');idle('exit2');return make('exit2','absent',{sourceEvents:['ordinary_no_poketch_completion_true','unload_overlay19','finish_field_overlay_exit']});}
 function prepareLocation0(){check(arguments.length===0,'location0 arity');idle('absent');return make('location0','location1',{sourceEvents:['sub_02048B34','sub_02048C2C']});}
 function prepareLocation1(options){check(arguments.length===1,'location1 requires destination');idle('location1');const nextLocation=location(options);return make('location1','location2',{destination:nextLocation,sourceEvents:['set_location','load_map_data']},{nextLocation});}
 function prepareLocation2(){check(arguments.length===0,'location2 arity');idle('location2');return make('location2','location-ready',{sourceEvents:['setup_map_object_manager_and_player','complete_location_child']});}
 function prepareRestore(){check(arguments.length===0,'restore arity');idle('location-ready');return make('restore','init0',{sourceEvents:['FieldSystem_LoadFieldOverlay','wait_for_overlay_ready']});}
 function prepareApplicationRestore(options){check(arguments.length===1,'application restore requires live location');idle('absent');const nextLocation=location(options);check(nextLocation.header===loc.header,'retained application header');return make('application-restore','init0',{destination:nextLocation,sourceEvents:['retained_FieldSystem_LoadFieldOverlay','restore_live_player_location','preserve_map_objects_and_movement']},{nextLocation});}
 function prepareInit0(){check(arguments.length===0,'init0 arity');idle('init0');return make('init0','init1',{sourceEvents:['field_overlay_init0']});}
 function prepareInit1(options){check(arguments.length===1,'init1 requires fresh generation');idle('init1');const c=fields(options,['generation'],'init1'),nextGeneration=generation(c.generation);check(nextGeneration>gen,'init1 generation must be strictly newer');const nextResources=resources(loc,nextGeneration);return make('init1','init2',{createdGeneration:nextGeneration,sourceEvents:['create_neighbor_loader','create_area_animation_manager']},{nextResources,nextGeneration});}
 function prepareInit2(){check(arguments.length===0,'init2 arity');idle('init2');return make('init2','init3',{sourceEvents:['ordinary_no_poketch_init']});}
 function prepareInit3(){check(arguments.length===0,'init3 arity');idle('init3');return make('init3','main',{sourceEvents:['null_init_completion_returns_true','set_field_ready']});}
 function preflightCommit(token){
  check(arguments.length===1,'commit original callback');const r=record(token);
  if(r.loaderTransaction)loader.preflightCommit(r.loaderTransaction);
  if(r.managerTransaction)manager.preflightCommit(r.managerTransaction);
  if(token.kind==='exit0')manager.preflightDestroy({generation:gen});
  if(token.kind==='exit2'&&loader)loader.preflightInvalidate();
  if(r.nextResources){check(r.nextResources.manager.state().generation===r.nextGeneration,'staged resource generation');if(r.nextResources.loader)check(r.nextResources.loader.snapshot().generation===r.nextGeneration,'staged loader generation');}
  return freeze({operation:token.kind,header:loc.header,generation:gen,nextStage:r.nextStage,nextHeader:r.nextLocation?r.nextLocation.header:loc.header,nextGeneration:r.nextGeneration??gen,destinationTile:r.nextLocation?r.nextLocation.tile:null,stopRequested});
 }
 function commit(token){
  preflightCommit.apply(null,arguments);const r=record(token);
  if(r.loaderTransaction)loader.commit(r.loaderTransaction);
  if(r.managerTransaction)manager.commit(r.managerTransaction);
  if(token.kind==='field'){if(accepted)records.get(accepted).status='superseded';accepted=token;r.status='accepted';}
  else r.status='committed';
  if(token.kind==='exit0'){manager.destroy({generation:gen});manager=null;if(accepted)records.get(accepted).status='revoked';accepted=null;}
  if(token.kind==='exit2'){if(loader)loader.invalidate();loader=null;}
  if(r.nextLocation)loc=r.nextLocation;
  if(r.nextResources){manager=r.nextResources.manager;loader=r.nextResources.loader;gen=r.nextGeneration;r.nextResources=null;}
  if(token.kind==='init3')stopRequested=false;
  stage=r.nextStage;revision++;pending=null;return snapshot();
 }
 function abort(token){check(arguments.length===1,'abort original callback');const r=record(token);if(r.loaderTransaction)loader.abort(r.loaderTransaction);if(r.managerTransaction)manager.abort(r.managerTransaction);if(r.nextResources){if(r.nextResources.loader)r.nextResources.loader.invalidate();r.nextResources.manager.destroy({generation:r.nextGeneration});r.nextResources=null;}r.status='aborted';pending=null;return snapshot();}
 function renderDescriptors(view){check(arguments.length===1,'renderDescriptors authenticated view');viewRecord(view);return manager.renderDescriptors(view.managerSnapshot);}
 function acceptedView(){check(arguments.length===0,'acceptedView arity');live();if(accepted)viewRecord(accepted);return accepted;}
 function invalidate(){check(arguments.length===0,'invalidate arity');live();check(pending===null,'invalidate requires no pending callback');if(loader)loader.invalidate();if(manager)manager.destroy({generation:gen});manager=null;loader=null;if(accepted)records.get(accepted).status='revoked';accepted=null;invalidated=true;return snapshot();}
 const api=Object.freeze({prepareField,preflightStop,requestStop,preflightCommit,prepareExit0,prepareExit1,prepareExit2,prepareLocation0,prepareLocation1,prepareLocation2,prepareRestore,prepareApplicationRestore,prepareInit0,prepareInit1,prepareInit2,prepareInit3,commit,abort,renderDescriptors,acceptedView,snapshot,invalidate});bridges.set(api,{live,verify(token){record(token);check(token.kind==='field','prepared field callback required');viewRecord(token);return token;}});return api;
}
const limits=freeze(['Only explicit ordinary-no-poketch standalone preview profile, ordinary field mode0, dispatch mode1/index0. Active-Poketch and alternate modes are not admitted.','Town header411 uses the existing finite same-cell raw-player loader; headers412..417 use area20 empty animation managers and existing static interior rendering, not a new interior loader emulation.','Creation is app bootstrap already initialized. Invalidate is explicit app reset/recovery replacement policy, not a source-game reset implementation. Caller supplies strictly increasing lifetime generations across bridge replacements.','Every active callback uses full field mask15. No fade, camera, visibility or quadrant clock/reset is accepted. A stop request still requires one accepted final active draw.','Prepared source operations and pre-request snapshots commit only after accepted rendering. Abort preserves bridge/manager/loader state but cannot reverse side effects in an external renderer.','Source task callbacks and location/init stages have no assigned elapsed duration. No scene draw occurs in exit, absent location or restore/init; a host may display its cached accepted native frame there.','No source program execution, graphics transfer acceptance, original display fetch, hardware timing, Poketch UI or lower-screen rendering claim.']);
function verifyBridge(bridge){const r=bridges.get(bridge);check(r,'unadmitted bridge object');r.live();return true;}
function verifyPreparedField(bridge,token){verifyBridge(bridge);return bridges.get(bridge).verify(token);}
return Object.freeze({create,verifyBridge,verifyPreparedField,limits,profile:'ordinary-no-poketch'});
});
