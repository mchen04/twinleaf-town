(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.TextReveal=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
// Source default Options textSpeed=1 ->4 frame delay. Browser clock is nominal60Hz.
function create(text,previous){return{text:Array.from(String(text)),index:0,delay:0,accumulator:0,spedUp:!!previous?.spedUp,newPress:false,done:false,waitFrames:0};}
function request(printer){if(!printer.done)printer.newPress=true;}
function tick(p,held){
 if(p.done)return;const pressed=p.newPress;p.newPress=false;
 // RenderFont immediately re-enters after LF; that control still sets delay.
 while(!p.done){
  if(held&&p.spedUp)p.delay=0;
  if(p.delay){p.delay--;if(pressed){p.spedUp=true;p.delay=0;}return;}
  p.delay=1;
  if(p.index>=p.text.length){p.done=true;return;}
  const char=p.text[p.index++];if(char!=='\n')return;
 }
}
function advance(p,dt,held=false){if(p.done){p.waitFrames+=Math.max(0,dt)*60;return;} p.accumulator+=Math.max(0,dt)*60;while(p.accumulator>=1){p.accumulator-=1;tick(p,held);if(p.done){p.accumulator=0;break;}}}
function visible(p){return p.text.slice(0,p.index).join('');}
function arrowFrame(p){return[0,1,2,1][Math.floor(p.waitFrames/9)%4];}
return{create,request,tick,advance,visible,arrowFrame};
});
