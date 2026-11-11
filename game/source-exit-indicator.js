/* Source h_exit projection and component-only accepted-render transactions.
 * Caller snapshots are not authenticated cameras. Host preset4 admission is pending. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-native-player-cache.js'),require('./source-exit-indicator-data.js'),require('./source-native-bytes.js'));else root.SourceExitIndicator=factory(root.SourceNativePlayerCache,root.SourceExitIndicatorData,root.SourceNativeBytes);})(typeof globalThis!=='undefined'?globalThis:this,function(Player,Data,Bytes){
'use strict';
const managers=new WeakMap(),descriptors=new WeakMap(),expectations=new WeakMap(),DELTA=[[0,-1],[0,1],[-1,0],[1,0]],ORIGIN=[1048576,0,1048576],HISTORY_LIMIT=64,VIEW_SCOPE='component-only-caller-snapshot-not-authenticated-camera';
function check(v,m){if(!v)throw Error('h_exit: '+m);}
function integer(v,m,min=Number.MIN_SAFE_INTEGER,max=Number.MAX_SAFE_INTEGER){check(Number.isSafeInteger(v)&&!Object.is(v,-0)&&v>=min&&v<=max,m);return v;}
function dense(v,n,m,min=-2147483648,max=2147483647){check(Array.isArray(v)&&v.length===n,m);const out=[];for(let i=0;i<n;i++){const d=Object.getOwnPropertyDescriptor(v,String(i));check(d&&Object.hasOwn(d,'value'),m+' dense data');out.push(integer(d.value,m,min,max));}return out;}
function header(h){integer(h,'resident header',0,65535);check(Object.hasOwn(Data.terrain,h),'unadmitted resident header');return h;}
function direction(behavior){integer(behavior,'behavior byte',0,255);return ({100:0,101:1,99:2,98:3})[behavior]??-1;}
function initial(){return {direction:-1,hidden:0,counter:0,phase:0,behavior:0,positionFx12:[0,0,0],destroyed:false};}
function copyState(p){check(p&&typeof p==='object','state');check(typeof p.destroyed==='boolean','destroyed state');const s={direction:integer(p.direction,'state direction',-1,3),hidden:integer(p.hidden,'hidden state',0,1),counter:integer(p.counter,'draw counter',0,15),phase:integer(p.phase,'draw phase',0,1),positionFx12:dense(p.positionFx12,3,'state position'),destroyed:p.destroyed};if(Object.hasOwn(p,'behavior'))s.behavior=integer(p.behavior,'state behavior',0,255);return s;}
function sourceUpdate(previous,actor,captured){
 const s=copyState(previous);if(!Player.sourceIdentityMatches(actor,captured)){s.destroyed=true;return Bytes.freeze(s);}
 s.behavior=integer(actor.currentBehavior,'cached u16',0,65535)&255;s.destroyed=false;s.direction=direction(s.behavior);s.hidden=0;integer(actor.facing,'current facing',0,3);
 if(s.direction===-1||s.direction!==actor.facing){s.hidden=1;s.counter=0;s.phase=0;return Bytes.freeze(s);}
 if(previous.direction!==s.direction){s.counter=0;s.phase=0;}
 const current=dense(actor.current,2,'logical current'),position=dense(actor.positionFx12,3,'actor position'),delta=DELTA[s.direction];s.positionFx12=[integer((current[0]+delta[0])*65536+32768,'position X overflow',-2147483648,2147483647),position[1],integer((current[1]+delta[1])*65536+32768,'position Z overflow',-2147483648,2147483647)];return Bytes.freeze(s);
}
function sourceDraw(previous,advance){check(typeof advance==='boolean','explicit advance');const s=copyState(previous);if(!s.destroyed&&!s.hidden&&s.direction!==-1&&advance){s.counter++;if(s.counter>15){s.counter=0;s.phase=(s.phase+1)%2;}}return Bytes.freeze(s);}
// This schema binds caller data only. It does not mint trusted renderer authority.
const VIEW_KEYS=['header','preset','rendererGeneration','viewGeneration','targetFx12','viewFx12','projectionFx12','effectsProjectionFx12'];
function snapshotView(input,h){check(input&&typeof input==='object'&&!Array.isArray(input),'explicit component view snapshot');check(Object.keys(input).length===VIEW_KEYS.length&&VIEW_KEYS.every(k=>Object.hasOwn(input,k)),'exact view fields');const data={};for(const k of VIEW_KEYS){const d=Object.getOwnPropertyDescriptor(input,k);check(d&&Object.hasOwn(d,'value'),'view data properties');data[k]=d.value;}check(header(data.header)===h,'view header');integer(data.preset,'view preset',0,65535);integer(data.rendererGeneration,'renderer generation',1);integer(data.viewGeneration,'view generation',1);data.targetFx12=dense(data.targetFx12,3,'view target');for(const k of ['viewFx12','projectionFx12','effectsProjectionFx12'])data[k]=dense(data[k],16,k);return Bytes.freeze(data);}
function sameView(a,b){return VIEW_KEYS.every(k=>Array.isArray(a[k])?a[k].every((v,i)=>v===b[k][i]):a[k]===b[k]);}
function create(options){
 function load(){Object.keys(Data.pins).forEach(n=>Data.authenticate(n,Data.read(n)));return Object.freeze({asset:Data.asset,model:80});}
 let resource=load(),owner=Player.createFresh({...options,stage:'bootstrap'}),h=header(options.header),generation=integer(options.generation,'generation',1),stage='main',task=true,state=initial(),revision=0,pending=null,accepted=null,stopRequested=false,invalidated=false,bootstrapRevision=null,bootstrapOwnerRevision=null,destination=null,eventTotal=0;
 const manager=Object.freeze({}),records=new WeakMap(),events=[];
 function live(){check(!invalidated,'invalidated field effect');}
 function idle(){live();check(pending===null,'pending transaction');}
 function ownerStamp(){return owner?owner.snapshot().revision:null;}
 function room(n){integer(revision+n,'revision capacity',0);integer(eventTotal+n,'diagnostic capacity',0);}
 function event(kind,fields={}){room(1);events.push(Object.freeze({kind,...fields}));if(events.length>HISTORY_LIMIT)events.shift();eventTotal++;revision++;}
 function update(){idle();check(['main','exit0','init2','init3'].includes(stage),'task queue outside admitted stage');if(!task)return snapshot();room(1);const v=owner.snapshot();if(!Player.sourceIdentityMatches(v.source,{id:255,mapId:1})){task=false;state={...copyState(state),destroyed:true};event('source-invalid-owner-destroys-task');return snapshot();}Player.verifyOwner(owner);check(!v.callbackOpen,'priority7 follows completed priority5 callback');const next=sourceUpdate(state,{...v.source,currentBehavior:v.currentBehavior,current:v.current,positionFx12:v.positionFx12,facing:v.facing},{id:255,mapId:1});state=next;event('priority7-update');return snapshot();}
 function snapshot(){return Bytes.freeze({header:h,generation,stage,revision,task,resourceLoaded:resource!==null,invalidated,stopRequested,owner:owner?owner.snapshot():null,state:copyState(state),events:events.map(x=>({...x})),eventTotal,eventDropped:eventTotal-events.length,historyLimit:HISTORY_LIMIT,hasAcceptedDraw:accepted!==null,pendingKind:pending?.kind??null,viewScope:VIEW_SCOPE});}
 function outstanding(token){live();const r=records.get(token);check(r&&pending===token&&r.status==='pending','forged or closed outstanding transaction');return r;}
 function current(r){live();check(r.revision===revision&&r.owner===owner&&r.ownerStamp===ownerStamp(),'stale field or owner transaction');if(r.kind==='draw'){check(sameView(snapshotView(r.viewInput,h),r.viewSnapshot),'changed caller view snapshot');}}
 function record(token){const r=outstanding(token);current(r);return r;}
 function published(token,r){current(r);check((r.status==='pending'&&pending===token)||(r.status==='accepted'&&accepted===token),'aborted, revoked or superseded draw');}
 function newRecord(kind,priv){return {kind,status:'pending',revision,owner,ownerStamp:ownerStamp(),...priv};}
 function publish(kind,data,r){const token=Object.freeze({kind,header:h,generation,revision,...data});records.set(token,r);pending=token;return token;}
 function preflightStop(){idle();check(stage==='main'&&!stopRequested,'stop boundary');room(1);return true;}
 function requestStop(){preflightStop();stopRequested=true;event('request-stop');return snapshot();}
 function descriptorData(s){
  if(!task||s.destroyed||s.hidden||s.direction===-1)return null;check([412,414,416,417].includes(h),'visible h_exit limited to audited preset4 ground floors');
  const pos=s.positionFx12.slice(),d=DELTA[s.direction];pos[0]=integer(pos[0]+d[0]*s.phase*8192,'phase X',-2147483648,2147483647);pos[2]=integer(pos[2]+d[1]*s.phase*8192,'phase Z',-2147483648,2147483647);
  return Bytes.freeze({kind:'source-h-exit-native16',header:h,generation,handle:owner.snapshot().lifetime,model:80,priority:7,direction:s.direction,counter:s.counter,phase:s.phase,sourcePositionFx12:pos,positionFx12:pos.map((n,i)=>integer(n-ORIGIN[i],'relative source position',-2147483648,2147483647)),originFx12:ORIGIN.slice(),projectionPass:'effects',billboard:false,sourcePositionScaleAlreadyApplied:2,assetSha256:Data.pins['h-exit.asset.json'],viewScope:VIEW_SCOPE});
 }
 function prepareDraw({advance,view}){
  idle();check(stage==='main'&&typeof advance==='boolean','draw stage and advance mode');const viewSnapshot=snapshotView(view,h);let next,label;
  if(!advance&&accepted){const a=records.get(accepted);published(accepted,a);check(a.viewInput===view&&sameView(a.viewSnapshot,viewSnapshot),'nonadvancing replay requires unchanged accepted owner/cache/view');next=a.next;label='accepted-read-only-replay';}
  else{next=sourceDraw(state,advance);label=advance?'source-advancing-draw':'fresh-bootstrap-zero-phase-preview';if(!advance)check(state.counter===0&&state.phase===0&&revision===bootstrapRevision&&ownerStamp()===bootstrapOwnerRevision,'fresh zero-phase preview only');}
  // All rejecting data work precedes publishing a pending token.
  const value=descriptorData(next),heldResource=resource,r=newRecord('draw',{viewInput:view,viewSnapshot,next,descriptor:value});
  const token=Object.freeze({kind:'draw',header:h,generation,revision,advance,label}),expected=Object.freeze({kind:'expected-h-exit-draw',scope:VIEW_SCOPE});r.expected=expected;
  const validate=()=>{published(token,r);check(task&&resource===heldResource,'stale field resource');return resource;};
  expectations.set(expected,{manager,token,record:r,descriptor:value,validate});if(value)descriptors.set(value,{manager,token,record:r,validate});records.set(token,r);pending=token;return token;
 }
 function prepareHiddenField(advance){
  idle();check(stage==='main'&&h===411&&typeof advance==='boolean','explicit hidden town field');
  check(!task||state.destroyed||state.hidden===1||state.direction===-1,'visible town field is not admitted');
  const next=sourceDraw(state,advance);return publish('hidden-field',{advance,label:'source-hidden-no-submission'},newRecord('hidden-field',{next}));
 }
 function drawDescriptor(token){const r=record(token);check(r.kind==='draw','draw token');return r.descriptor;}
 function expectedDraw(token,view){const r=record(token);check(r.kind==='draw'&&view===r.viewInput,'caller expected draw/view identity');return r.expected;}
 function validate(token){record(token);return true;}
 function drawRecord(token){const r=record(token);check(r.kind==='draw'||r.kind==='hidden-field','draw commit');if(r.kind==='hidden-field')check(h===411&&(!task||state.destroyed||state.hidden===1||state.direction===-1),'visible town field is not admitted');return r;}
 function commit(token){const r=drawRecord(token);if(accepted)records.get(accepted).status='superseded';if(token.advance)state=r.next;accepted=token;r.status='accepted';pending=null;if(token.advance&&stopRequested)stage='exit0';return snapshot();}
 function discard(token,r,status){r.status=status;if(r.nextOwner){r.nextOwner.invalidate();r.nextOwner=null;}r.nextResource=null;if(pending===token)pending=null;}
 function abort(token){const r=outstanding(token);discard(token,r,'aborted');return snapshot();}
 const nextStage={exit0:'exit1',exit1:'exit2',exit2:'absent',location0:'location1',location1:'location2',location2:'location-ready',restore:'init0','application-restore':'init0',init0:'init1',init1:'init2',init2:'init3',init3:'main'};
 function prepareLifecycle(kind,input={}){
  idle();const expected=(kind==='location0'||kind==='application-restore')?'absent':kind==='restore'?'location-ready':kind;check(stage===expected&&Object.hasOwn(nextStage,kind),'lifecycle stage '+kind+' from '+stage);const priv={input:{},nextOwner:null,nextResource:null};
  try{
   if(kind==='location1'){priv.input={header:header(input.header),tile:dense(input.tile,2,'destination tile',0,31)};Bytes.freeze(priv.input);}
   if(kind==='application-restore'){const tile=dense(input.tile,2,'retained actual tile',0,31),v=owner?.snapshot(),origin=Data.terrain[h].origin;check(header(input.header)===h&&v&&v.alive&&v.frozen&&!v.callbackOpen&&tile.every((n,i)=>n+origin[i]===v.current[i]),'retained application owner/location');priv.input=Bytes.freeze({header:h,tile});}
   if(kind==='location2'){const local=dense(input.tile,2,'actual destination tile',0,31);check(destination&&local.every((n,i)=>n===destination[i]),'location2 actual destination tile');const position=dense(input.positionFx12,3,'location2 position'),dir=integer(input.facing,'location2 facing',0,3);const actor=input.actor;check(actor&&typeof actor==='object','location2 actor');priv.nextOwner=Player.createFresh({actor,tile:local,positionFx12:position,facing:dir,header:h,generation,stage:'location2'});}
   if(kind==='init1'){const g=integer(input.generation,'init1 generation',1);check(g>generation&&owner&&owner.snapshot().frozen,'fresh init1 generation/owner');priv.input=Object.freeze({generation:g});priv.nextResource=load();}
   return publish('lifecycle',{operation:kind,nextStage:nextStage[kind]},newRecord('lifecycle',priv));
  }catch(error){if(priv.nextOwner)priv.nextOwner.invalidate();throw error;}
 }
 function lifecycleRecord(token){const r=record(token);check(r.kind==='lifecycle','lifecycle commit');const k=token.operation;room(4);
  // Validate owner-side operations before changing field state.
  if(k==='exit0'||k==='location0')check(owner&&!owner.snapshot().callbackOpen,'lifecycle owner callback still open');
  if(k==='init1')check(owner&&owner.snapshot().frozen&&!owner.snapshot().callbackOpen&&r.input.generation>owner.snapshot().generation,'init1 owner no longer eligible');
  if((k==='exit0'||k==='location0')&&owner.snapshot().alive)owner.preflightLifecycle(k==='exit0'?'freeze':'retire');
  if(k==='application-restore'){const v=owner?.snapshot(),origin=Data.terrain[h].origin;check(v&&v.alive&&v.frozen&&!v.callbackOpen&&r.input.tile.every((n,i)=>n+origin[i]===v.current[i]),'retained restore changed before acceptance');}
  if(k==='init1')owner.preflightLifecycle('bindGeneration',r.input.generation);
  return r;
 }
 function preflightCommit(token){const r=token?.kind==='lifecycle'?lifecycleRecord(token):drawRecord(token),k=token.kind==='lifecycle'?token.operation:'field';return Bytes.freeze({operation:k,header:h,generation,nextStage:k==='field'?(token.advance&&stopRequested?'exit0':stage):token.nextStage,nextHeader:k==='location1'?r.input.header:h,nextGeneration:k==='init1'?r.input.generation:generation,destinationTile:(k==='location1'||k==='application-restore')?r.input.tile:null,stopRequested});}
 function commitLifecycle(token){const r=lifecycleRecord(token),k=token.operation;
  if(k==='exit0'){if(owner.snapshot().alive)owner.freeze();task=false;event('destroy-task-before-resource');resource=null;event('release-model80');if(accepted)records.get(accepted).status='revoked';accepted=null;}
  if(k==='location0'){if(owner.snapshot().alive)owner.retire();owner=null;event('retire-native-player');}
  if(k==='location1'){h=r.input.header;destination=r.input.tile.slice();}
  if(k==='location2'){owner=r.nextOwner;r.nextOwner=null;event('create-native-player-frozen');}
  if(k==='init1'){owner.bindGeneration(r.input.generation);generation=r.input.generation;resource=r.nextResource;r.nextResource=null;task=true;state=initial();event('init1-attach-priority7');}
  if(k==='init3')stopRequested=false;r.status='committed';stage=token.nextStage;pending=null;event(k);return snapshot();
 }
 function player(){live();check(owner,'no native player between location0 and2');return owner;}
 function invalidate(){if(invalidated)return snapshot();room(3);if(pending){const t=pending;discard(t,records.get(t),'revoked');}if(accepted)records.get(accepted).status='revoked';accepted=null;if(task){task=false;event('host-destroy-task');}resource=null;if(owner&&owner.snapshot().alive)owner.invalidate();invalidated=true;event('host-invalidate');return snapshot();}
 event('load-model80');event('attach-task',{priority:7,initialDirection:-1});update();bootstrapRevision=revision;bootstrapOwnerRevision=ownerStamp();const api=Object.freeze({player,update,snapshot,preflightStop,requestStop,preflightCommit,prepareHiddenField,prepareDraw,drawDescriptor,expectedDraw,validate,commit,abort,prepareLifecycle,commitLifecycle,invalidate});managers.set(api,live);return api;
}
function verifyDescriptor(value,expected){const d=descriptors.get(value),e=expectations.get(expected);check(d&&e&&d.manager===e.manager&&d.token===e.token&&d.record===e.record&&e.descriptor===value,'unadmitted descriptor or crossed expected manager/draw');e.validate();return d.validate();}
function verifyManager(manager){const live=managers.get(manager);check(live,'unadmitted field effect manager');live();return true;}
return Object.freeze({create,verifyManager,sourceUpdate,sourceDraw,verifyDescriptor,direction,viewScope:VIEW_SCOPE,historyLimit:HISTORY_LIMIT});
});
