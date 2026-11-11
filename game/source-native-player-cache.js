/* Finite fresh-player cache projection, not a complete native flag emulator.
 * Actual movement/scheduler/graphics callbacks remain with the host. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-exit-indicator-data.js'),require('./source-native-bytes.js'));else root.SourceNativePlayerCache=factory(root.SourceExitIndicatorData,root.SourceNativeBytes);})(typeof globalThis!=='undefined'?globalThis:this,function(Data,Bytes){
'use strict';
const owners=new WeakMap(),views=new WeakMap(),DELTA=[[0,-1],[0,1],[-1,0],[1,0]],MOVING=['walk','run','forced-walk','horizontal-slow'],STATIONARY=['face','turn','collision'],PASSIVE=['wait','command75'],HISTORY_LIMIT=64;let nextLifetime=0;
const FLAG_SCOPE=Object.freeze({kind:'finite-cache-and-terminal-event-projection',modeledMask:0x82c,terminalBitIsEventProjection:true,heldAndSingleMovementBits:false,completeNativeWord:false});
function check(v,m){if(!v)throw Error('Native player cache: '+m);}
function integer(v,m,min=Number.MIN_SAFE_INTEGER,max=Number.MAX_SAFE_INTEGER){check(Number.isSafeInteger(v)&&!Object.is(v,-0)&&v>=min&&v<=max,m);return v;}
function direction(v){return integer(v,'cardinal facing',0,3);}
function dense(v,n,label,min,max){check(Array.isArray(v)&&v.length===n,label);const out=[];for(let i=0;i<n;i++){const d=Object.getOwnPropertyDescriptor(v,String(i));check(d&&Object.hasOwn(d,'value'),label+' dense own numeric components');out.push(integer(d.value,label,min,max));}return out;}
function vector(v,label){return dense(v,3,label,-2147483648,2147483647);}
function tile(v){return dense(v,2,'logical tile',-2147483648,2147483647);}
function residentTile(v){return dense(v,2,'resident local tile',0,31);}
function header(v){integer(v,'resident header',0,65535);check(Object.hasOwn(Data.terrain,v),'unadmitted resident header');return v;}
function sourceIdentityMatches(actor,captured){return !!actor&&actor.active===true&&actor.id===captured.id&&(actor.mapId===captured.mapId||(actor.flag25===true&&actor.secondaryMapId===captured.mapId));}
function lookup(h,p){header(h);const q=tile(p),t=Data.terrain[h],x=q[0]-t.origin[0],z=q[1]-t.origin[1];return x>=0&&z>=0&&x<32&&z<32?t.permission_u16_rows[z][x]&255:255;}
// Pure unsigned-word cache projection. Other bits pass through without emulation.
function cachePass(input,pass,query){
 check(pass==='pre'||pass==='post','cache pass');check(typeof query==='function','explicit behavior lookup');
 const s={flags:integer(input.flags,'unsigned flags',0,0xffffffff),previous:tile(input.previous),current:tile(input.current),previousBehavior:integer(input.previousBehavior,'previous behavior byte',0,255),currentBehavior:integer(input.currentBehavior,'current behavior byte',0,255)},events=[];
 function refresh(site){const a=integer(query(s.previous.slice()),'previous behavior byte',0,255),b=integer(query(s.current.slice()),'current behavior byte',0,255);s.previousBehavior=a;s.currentBehavior=b;s.flags=(b===255?s.flags|0x800:s.flags&~0x800)>>>0;events.push(site);return b!==255;}
 if(pass==='pre'){
  if(s.flags&0x1000)events.push('height-before-cache');
  if(s.flags&0x800){if(refresh('retry-0x800'))s.flags=(s.flags|4)>>>0;}
  if(s.flags&4)refresh('pre-0x4');s.flags=(s.flags&~0x10004)>>>0;
 }else{
  if(s.flags&0x10000)refresh('post-0x10000');else if(s.flags&4)refresh('post-0x4');s.flags=(s.flags&~0x10004)>>>0;
  if(s.flags&0x20000)refresh('post-0x20000');else if(s.flags&8)refresh('post-0x8');s.flags=(s.flags&~0x20008)>>>0;
 }
 return Bytes.freeze({...s,events});
}
function createFresh(options){
 const {actor,generation,stage}=options,h=header(options.header);check(actor&&typeof actor==='object','actual actor');check(stage==='bootstrap'||stage==='location2','explicit creation stage');integer(generation,'positive generation',1);
 const local=residentTile(options.tile),position=vector(options.positionFx12,'position FX12'),dir=direction(options.facing),origin=Data.terrain[h].origin,current=local.map((n,i)=>n+origin[i]);integer(nextLifetime+1,'lifetime capacity',1);
 const s={actor,header:h,generation,lifetime:++nextLifetime,alive:true,frozen:stage==='location2',revision:0,current,previous:current.slice(),positionFx12:position,facing:dir,flags:4,currentBehavior:255,previousBehavior:255,command:null,callback:null,events:[],eventTotal:0,source:{id:255,mapId:1,type:0,movement:1,active:true,flag25:false,priority:5}};
 function live(){check(s.alive,'retired native owner');}
 function external(a,g){live();check(a&&typeof a==='object'&&a===s.actor,'required current host actor (foreign/replaced or missing)');integer(g,'required positive bridge generation',1);check(g===s.generation,'stale bridge generation');}
 function room(n){integer(s.revision+n,'revision capacity',0);integer(s.eventTotal+n,'diagnostic capacity',0);}
 function record(kind,fields={}){room(1);const item={kind,...fields};if(item.sites)item.sites=item.sites.slice();s.events.push(Bytes.freeze(item));if(s.events.length>HISTORY_LIMIT)s.events.shift();s.eventTotal++;s.revision++;}
 function applyPass(next,which){for(const k of ['flags','currentBehavior','previousBehavior'])s[k]=next[k];record('cache-'+which,{sites:next.events});}
 function pass(which){applyPass(cachePass(s,which,p=>lookup(s.header,p)),which);}
 function snapshot(){return Bytes.freeze({header:s.header,generation:s.generation,lifetime:s.lifetime,alive:s.alive,frozen:s.frozen,revision:s.revision,source:{...s.source},current:s.current.slice(),previous:s.previous.slice(),positionFx12:s.positionFx12.slice(),facing:s.facing,flags:s.flags,flagScope:FLAG_SCOPE,currentBehavior:s.currentBehavior,previousBehavior:s.previousBehavior,command:s.command?{...s.command}:null,callbackOpen:s.callback!==null,events:s.events.map(x=>({...x,...(x.sites?{sites:x.sites.slice()}:{})})),eventTotal:s.eventTotal,eventDropped:s.eventTotal-s.events.length,historyLimit:HISTORY_LIMIT});}
 function beginActor(a,g,{paused=false,held=false}={}){external(a,g);check(s.callback===null,'nested actor callback');check(typeof paused==='boolean'&&typeof held==='boolean','movement pause/held');room(2);const token=Object.freeze({kind:'native-player-callback',lifetime:s.lifetime,revision:s.revision,skipped:s.frozen});const c={token,actor:a,generation:g,paused,held,skipped:s.frozen};if(!s.frozen)pass('pre');s.callback=c;return token;}
 function callback(token,allowSkipped=false){live();const c=s.callback;check(c&&c.token===token&&c.actor===s.actor&&c.generation===s.generation&&(allowSkipped||!c.skipped),'inactive or foreign actor callback');return c;}
 function initializeMovement(token,{family,facing:dir,destination}){
  const c=callback(token);check((!c.paused||c.held)&&!s.command,'paused without held command or overlapping movement');direction(dir);check([...MOVING,...STATIONARY,...PASSIVE].includes(family),'unadmitted movement family');room(1);let dest=null;
  if(MOVING.includes(family)){check(family!=='horizontal-slow'||dir===2||dir===3,'horizontal slow only');dest=tile(destination);const expected=s.current.map((n,i)=>integer(n+DELTA[dir][i],'adjacent logical coordinate',-2147483648,2147483647));check(dest.every((n,i)=>n===expected[i]),'actual adjacent initialized destination');}
  else check(destination===undefined,'stationary destination forbidden');
  if(dest){s.previous=s.current.slice();s.current=dest;s.flags|=4;}else if(STATIONARY.includes(family))s.previous=s.current.slice();
  if(!PASSIVE.includes(family))s.facing=dir;s.command={family};record('movement-init',{family});
 }
 function completeMovement(token){const c=callback(token);check(!c.paused||c.held,'paused without held command');check(s.command,'no initialized movement');room(1);const family=s.command.family;if(MOVING.includes(family)){s.flags|=0x28;s.previous=s.current.slice();}else s.flags|=0x20;s.command=null;record('movement-complete',{family});}
 function endActor(token,{positionFx12:position,facing:dir}){const c=callback(token,true),p=vector(position,'position FX12');direction(dir);room(2);const post=c.skipped?null:cachePass(s,'post',q=>lookup(s.header,q));if(post){s.positionFx12=p;s.facing=dir;applyPass(post,'post');}s.callback=null;record('actor-end');return snapshot();}
 function resetForFieldTask(a,g,{facing:dir}){external(a,g);check(!s.callback&&!s.frozen,'field reset boundary');direction(dir);room(1);s.previous=s.current.slice();s.command=null;s.facing=dir;record('normal-field-task-reset');return snapshot();}
 function transfer(a,replacement,g,{tile:localTile,positionFx12:position,facing:dir,reason}){external(a,g);check(!s.callback&&!s.frozen&&reason==='stair-postload','authorized same-owner staircase boundary');check(replacement&&typeof replacement==='object'&&replacement!==s.actor,'fresh replacement host actor');const local=residentTile(localTile),p=vector(position,'reposition FX12');direction(dir);room(1);s.actor=replacement;s.current=local.map((n,i)=>n+Data.terrain[s.header].origin[i]);s.previous=s.current.slice();s.positionFx12=p;s.facing=dir;s.command=null;s.flags=(s.flags|4)&~8;record('same-owner-stair-transfer');return snapshot();}
 function preflightLifecycle(operation,g){live();check(['bindGeneration','freeze','retire'].includes(operation),'unknown owner lifecycle operation');if(operation==='bindGeneration'){check(s.frozen&&!s.callback,'bind only frozen location2 owner');integer(g,'generation',1);check(g>s.generation,'strictly newer bridge generation');}else check(!s.callback,operation+' during actor callback');room(1);return true;}
 function bindGeneration(g){preflightLifecycle('bindGeneration',g);s.generation=g;s.frozen=false;record('init1-bind-generation');}
 function freeze(){preflightLifecycle('freeze');s.frozen=true;record('manager-freeze');}
 function retire(){preflightLifecycle('retire');s.alive=false;s.source.active=false;record('native-owner-retired');}
 // MapObject_ClearHeldMovement: no coordinate copy, facing change or cache pass.
 function clearHeldMovement(a,g){external(a,g);check(!s.callback&&!s.frozen,'clear held movement outside active/frozen callback');room(1);s.flags=(s.flags&~0x10)|0x20;s.command=null;record('clear-held-movement');return snapshot();}
 // Capability teardown, not an actor callback: revoke without executing postpass.
 function invalidate(){if(!s.alive)return snapshot();room(1);s.callback=null;s.command=null;s.alive=false;s.source.active=false;record('native-owner-invalidated');return snapshot();}
 function view(){live();const v=snapshot();views.set(v,{api,revision:s.revision,actor:s.actor,generation:s.generation});return v;}
 const api=Object.freeze({beginActor,initializeMovement,completeMovement,endActor,resetForFieldTask,clearHeldMovement,transfer,preflightLifecycle,bindGeneration,freeze,retire,invalidate,snapshot,view});owners.set(api,s);
 if(stage==='bootstrap'){room(2);pass('pre');record('explicit-initialized-bootstrap');}return api;
}
function verifyView(value){const r=views.get(value);check(r,'unadmitted/copy owner view');const s=owners.get(r.api);check(s.alive&&s.revision===r.revision&&s.actor===r.actor&&s.generation===r.generation,'stale owner/cache view');return true;}
function verifyOwner(value){check(owners.has(value)&&owners.get(value).alive,'unadmitted/retired native owner');return true;}
return Object.freeze({createFresh,sourceIdentityMatches,lookup,cachePass,verifyView,verifyOwner,flagScope:FLAG_SCOPE,historyLimit:HISTORY_LIMIT});
});
