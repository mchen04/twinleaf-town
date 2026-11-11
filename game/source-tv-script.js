/* Genuine finite bank982:3 adapter, not a fullscreen TV producer or a Start path.
 * Queue24 printer calls and post-script sound main grants remain caller-owned.
 * Message/page waits and native successful polls always yield their visit. */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f(require('./source-tv-script-data.js'),require('./original-dialogue.js'));else r.SourceTvScript=f(r.SourceTvScriptData,r.OriginalDialogue);})(typeof globalThis!=='undefined'?globalThis:this,function(Data,Dialogue){
'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
function need(ok,m){if(!ok)throw Error('SourceTvScript: '+m);}
function create(options){
 const {owner,story,actors,sound,glyphs,hooks}=options;need(owner&&story?.vars&&Array.isArray(actors)&&actors.length&&new Set(actors).size===actors.length,'complete owner/story/actor set');
 for(const name of ['isOwnerCurrent','lock','unlock','openMessage','closeMessage','readTextDelay','defaultBgm'])need(typeof hooks?.[name]==='function','hook '+name);
 for(const name of ['setBroadcastVolume','playFanfare','pollFanfare','defaultBgm'])need(typeof sound?.[name]==='function','sound '+name);
 // Complete printer compilation is a no-side-effect preflight of both originals.
 for(const m of Object.values(Data.messages))Dialogue.compile(m.tokens,{glyphs});
 const originalActors=actors.slice(),vars=story.vars;let active=false,retired=false,locked=false,pc=null,native=null,message=null,printer=null,fanfare=null,lastVisit=-1,lastPrinterVisit=-1,lastPrinterPass=-1;
 let previousVar=null,trace=[];
 function emit(type,details={}){trace.push({type,visit:lastVisit,...details});if(trace.length>256)trace.shift();}
 function ownerMatches(){const ok=hooks.isOwnerCurrent(owner)===true;return ok&&story.vars===vars&&actors.length===originalActors.length&&actors.every((a,i)=>a===originalActors[i]);}
 function current(){return !retired&&ownerMatches()&&!retired;}
 function check(){need(current(),'field owner replaced');}
 function boundary(){const d=Object.getOwnPropertyDescriptor(vars,Data.variable);need(d&&Object.hasOwn(d,'value')&&Number.isInteger(d.value)&&d.value>=0&&d.value<=65535,'own native u16 variable');return d.value;}
 function dispatch(input){check();if(active||input?.header!==415||input?.eligible!==true)return false;if(boundary()!==0)return false;previousVar=0;active=true;pc=49;emit('dispatch',{pc});return true;}
 function levelLoad(input){check();need(!active&&input?.header===415&&input?.type===2,'level912 type2 boundary');if(boundary()===0){sound.setBroadcastVolume(50);emit('source-volume50');return true;}return false;}
 function close(reason){if(message===null)return;const handle=message;message=null;printer=null;hooks.closeMessage(handle,{owner,reason});}
 function visit(id){check();need(Number.isSafeInteger(id)&&id>lastVisit,'script visit');lastVisit=id;if(!active)return false;
  if(native){let done=false;if(native==='printer')done=printer.printerFinished;else if(native==='sound')done=!sound.pollFanfare(fanfare);else throw Error('SourceTvScript: native state');check();if(done){emit('native-success',{kind:native});native=null;}return true;}
  for(let n=0;n<16&&active;n++){
   check();const offset=pc;emit('opcode',{offset});
   switch(offset){
    case 49:pc=51;locked=true;hooks.lock({owner,lastInteracted:null,actors});check();return true;
    case 51:need(boundary()===0,'SetVar owner/value');vars[Data.variable]=1;pc=57;break;
    case 57:case 64:{const index=offset===57?1:2,m=Data.messages[index],delay=hooks.readTextDelay();check();need([8,4,1].includes(delay),'source Options delay');const next=new Dialogue.Controller(m.tokens,{glyphs,frameDelay:delay,waitButton:false,lineHeight:16});
     const handle=hooks.openMessage({owner,bank:502,index,printer:next,tokens:m.tokens,waitButton:false});check();need(handle!==null&&handle!==undefined,'owned message handle');need(message===null||message===handle,'retained source window identity');message=handle;printer=next;pc=offset===57?60:67;native='printer';emit('message',{index,delay});return true;}
    case 60:fanfare=sound.playFanfare();pc=64;break;
    case 67:pc=69;native='sound';return true;
    case 69:close('source-close');check();pc=71;break;
    case 71:{const request=hooks.defaultBgm();check();sound.defaultBgm(request);pc=73;break;}
    case 73:pc=75;locked=false;hooks.unlock({owner,actors,reason:'release-all'});check();return true;
    case 75:need(message===null&&!locked,'End resources');active=false;previousVar=null;pc=null;emit('end');return true;
    default:throw Error('SourceTvScript: unsupported PC '+pc);
   }
  }need(!active,'opcode budget');return true;
 }
 function printerVisit(id,pass,input){check();need(active&&Number.isSafeInteger(id)&&id>=lastPrinterVisit&&(pass===0||pass===1),'queue24 visit');need(id>lastPrinterVisit?pass===0:pass===lastPrinterPass+1,'queue24 A/B order');lastPrinterVisit=id;lastPrinterPass=pass;if(!printer)return null;return printer.tick(input);}
 function cancel(reason='host-cancel'){if(retired)return false;const valid=current();retired=true;active=false;native=null;if(valid){if(previousVar!==null&&vars[Data.variable]===1)vars[Data.variable]=previousVar;close(reason);if(locked&&ownerMatches()){locked=false;hooks.unlock({owner,actors,reason});}}message=null;printer=null;emit('cancel',{reason});return true;}
 function snapshot(){return {active,retired,locked,pc,native,messageOpen:message!==null,lastVisit,lastPrinterVisit,lastPrinterPass,variable:Object.getOwnPropertyDescriptor(vars,Data.variable)?.value,printer:printer?.snapshot()||null};}
 return Object.freeze({dispatch,levelLoad,visit,printerVisit,cancel,snapshot,ownsField:()=>active&&!retired,drainTrace:()=>trace.splice(0)});
}
return Object.freeze({create});
});
