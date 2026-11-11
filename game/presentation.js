(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.TownPresentation=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VIEW={worldWidth:384,worldHeight:288,screenWidth:512,screenHeight:384,totalHeight:768};
function cameraFor(x,y,worldWidth=768,worldHeight=624){return{x:Math.max(0,Math.min(worldWidth-VIEW.worldWidth,x-VIEW.worldWidth/2)),y:Math.max(0,Math.min(worldHeight-VIEW.worldHeight,y-VIEW.worldHeight/2))};}
function pages(text,max=145){const words=String(text).split(/\s+/),result=[];let line='';for(const word of words){if(line.length+word.length+1>max&&line){result.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)result.push(line);return result.length?result:[''];}
const TRANSITION={fadeOut:.16,blackHold:1.52,fadeIn:.22};
function transitionOpacity(elapsed){if(elapsed>=TRANSITION.fadeOut+TRANSITION.blackHold+TRANSITION.fadeIn)return 0;if(elapsed<TRANSITION.fadeOut)return elapsed/TRANSITION.fadeOut;if(elapsed<TRANSITION.fadeOut+TRANSITION.blackHold)return 1;return Math.max(0,1-(elapsed-TRANSITION.fadeOut-TRANSITION.blackHold)/TRANSITION.fadeIn);}
return {VIEW,cameraFor,pages,TRANSITION,transitionOpacity};
});
