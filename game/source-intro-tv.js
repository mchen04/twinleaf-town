/* Exact overlay59 TV main/text state ordering at an explicit component boundary.
 * No preceding intro/save state or field handoff is invented. Existing post-TV
 * Start is unchanged. Caller owns sound.main, after this overlay/fade visit.
 * Normal completion does not stop the global 1030 broadcast. */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f(require('./source-warp.js'));else r.SourceIntroTv=f(r.SourceWarp);})(typeof globalThis!=='undefined'?globalThis:this,function(Warp){
'use strict';
function need(v,m){if(!v)throw Error('SourceIntroTv: '+m);}
function create({owner,isOwnerCurrent,sound,art}){
 need(owner&&typeof isOwnerCurrent==='function'&&typeof sound?.startBroadcast==='function'&&typeof art?.render==='function'&&typeof art?.rgba==='function','complete component consumers');
 const fade=new Warp.Fade();let state=0,timer=0,textState=0,textTimer=0,scroll=0,resources=false,textVisible=false,brightness=-16,done=false,retired=false,lastVisit=-1,phase='ready',broadcast=null;
 function current(){if(retired)return false;const ok=isOwnerCurrent(owner)===true;return ok&&!retired;}
 function check(){need(current(),'owner replaced');}
 function snapshot(){return {boundary:'isolated-overlay59-TV',state,timer,textState,textTimer,scrollAccumulator:scroll,scrollY:scroll>>>4,resources,textVisible,brightness,done,retired,lastVisit,phase,broadcastRequested:broadcast!==null,fade:fade.snapshot(),precedingIntroImplemented:false,fieldHandoffImplemented:false};}
 function begin(inward){fade.begin({pattern:0,top:inward?1:0,bottom:inward?1:0,color:0,duration:6,framesPer:1});brightness=fade.snapshot().brightness;}
 function tick(visit,newKeys=0){check();need(!done&&phase==='ready'&&Number.isSafeInteger(visit)&&visit>lastVisit&&Number.isInteger(newKeys)&&newKeys>=0&&newKeys<=65535,'ordered overlay callback');lastVisit=visit;phase='ticked';
  switch(state){
   case 0:resources=true;brightness=-16;timer=60;state=1;break;
   case 1:if(timer){timer--;break;}broadcast=sound.startBroadcast();check();need(broadcast!==null&&broadcast!==undefined,'broadcast admission');timer=90;state=2;break;
   case 2:if(timer){timer--;break;}begin(true);state=3;break;
   case 3:scroll+=4;if(fade.snapshot().finished)state=4;break;
   case 4:scroll+=4;switch(textState){case 0:textVisible=true;textTimer=240;textState=1;break;case 1:if(textTimer)textTimer--;else textState=2;break;case 2:if(newKeys&3)textState=3;break;case 3:textVisible=false;textState=0;begin(false);state=5;break;default:throw Error('SourceIntroTv: text state');}break;
   case 5:scroll+=4;if(fade.snapshot().finished){resources=false;textVisible=false;done=true;}break;
   default:throw Error('SourceIntroTv: overlay state');
  }return snapshot();
 }
 function pump(visit){check();need(visit===lastVisit&&phase==='ticked','ordered fade pump');if(fade.type!=='none'){fade.pump();brightness=fade.snapshot().brightness;}phase='pumped';return snapshot();}
 function publish(visit){check();need(visit===lastVisit&&phase==='pumped','ordered VBlank publication');phase='ready';return snapshot();}
 function render(){check();need(phase==='ready'&&resources,'published live presentation');return art.render(snapshot());}
 function rgba(){const v=render();return art.rgba(v,brightness);}
 function retire(){if(retired)return false;retired=true;resources=false;textVisible=false;phase='retired';return true;} // Owner separately retires its global sound service, if applicable.
 return Object.freeze({tick,pump,publish,snapshot,render,rgba,retire});
}
return Object.freeze({create});
});
