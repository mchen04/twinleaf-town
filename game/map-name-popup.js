/* Source-state translation of ov05_021E2E88.s; artwork is supplied separately. */
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory();
  else root.SourceMapNamePopup=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';

// One tick is one ov05_021E3124 main-queue callback. Presentation never ticks.
// Source state numbers: 0 idle, 1 entering, 2 exiting, 3 holding.
const CONSTANTS=Object.freeze({width:256,height:192,windowHeight:24,
  hiddenOffset:38,step:4,holdCallbacks:60});
const PHASES=Object.freeze(['idle','entering','exiting','holding']);
const own=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);

function isByteView(value){
  const tag=Object.prototype.toString.call(value);
  return ArrayBuffer.isView(value)&&
    (tag==='[object Uint8Array]'||tag==='[object Uint8ClampedArray]');
}
function validateBytes(value,length,label){
  if((!isByteView(value)&&!Array.isArray(value))||value.length!==length){
    throw new TypeError(label+' must contain exactly '+length+' RGBA bytes');
  }
  // Typed byte views already enforce this range. Do not silently clamp arrays.
  if(Array.isArray(value))for(let i=0;i<value.length;i++){
    if(!Number.isInteger(value[i])||value[i]<0||value[i]>255){
      throw new TypeError(label+' contains an invalid byte at '+i);
    }
  }
}
function validSection(section){
  return Number.isInteger(section)&&section>=0&&section<=0xffffffff;
}
function copyPanels(input){
  if(!input||typeof input!=='object'||Array.isArray(input)||
      Object.keys(input).length===0){
    throw new TypeError('Map-name popup requires nonempty panels keyed by map section');
  }
  const panels=Object.create(null);
  for(const key of Object.keys(input)){
    const section=Number(key),panel=input[key];
    if(!validSection(section)||String(section)!==key){
      throw new TypeError('Invalid map-name popup panel section '+key);
    }
    if(!panel||!Number.isInteger(panel.width)||panel.width<1||panel.width>CONSTANTS.width||
        !Number.isInteger(panel.height)||panel.height<1||panel.height>CONSTANTS.windowHeight){
      throw new TypeError('Invalid map-name popup panel dimensions for section '+key);
    }
    validateBytes(panel.rgba,panel.width*panel.height*4,'Map-name popup panel '+key);
    for(let i=3;i<panel.rgba.length;i+=4){
      if(panel.rgba[i]!==0&&panel.rgba[i]!==255){
        throw new TypeError('Map-name popup supports only source index transparency (alpha 0 or 255)');
      }
    }
    // Keep an owned immutable-by-contract copy, independent of caller mutation.
    panels[key]={width:panel.width,height:panel.height,rgba:new Uint8ClampedArray(panel.rgba)};
  }
  return panels;
}

function create(options){
  const panels=copyPanels(options&&options.panels);
  let active=false,state=0,offset=0,holdTicks=0;
  let section=null,requestedSection=null,pendingSection=null;

  function snapshot(){
    return Object.freeze({active,state,phase:PHASES[state],offset,holdTicks,
      section,requestedSection,pendingSection});
  }

  // ov05_021E32F0: destroy task, clear window, reset BG position and manager.
  // Public section fields use null for the cleared/unallocated panel.
  function cancel(){
    active=false;state=0;offset=0;holdTicks=0;
    section=null;requestedSection=null;pendingSection=null;
    return snapshot();
  }

  // ov05_021E3270: preserve the currently drawn panel until the exit endpoint.
  // The latest request wins; even a same-section request queues a restart.
  function request(nextSection){
    if(!validSection(nextSection)||!own(panels,nextSection)){
      throw new RangeError('Unsupported map-name popup section '+String(nextSection));
    }
    requestedSection=nextSection;
    if(!active){
      active=true;state=1;offset=CONSTANTS.hiddenOffset;
      section=nextSection;
    }else{
      if(state===1||state===3){state=2;holdTicks=0;}
      pendingSection=nextSection;
    }
    return snapshot();
  }

  // ov05_021E3124: one switch arm per callback, with no endpoint fallthrough.
  function tick(){
    if(!active)return snapshot();
    switch(state){
      case 1:
        offset=Math.max(0,offset-CONSTANTS.step);
        if(offset===0){holdTicks=0;state=3;}
        break;
      case 3:
        holdTicks++;
        if(holdTicks>=CONSTANTS.holdCallbacks){holdTicks=0;state=2;}
        break;
      case 2:
        offset=Math.min(CONSTANTS.hiddenOffset,offset+CONSTANTS.step);
        if(offset===CONSTANTS.hiddenOffset){
          if(pendingSection!==null){
            section=pendingSection;pendingSection=null;state=1;
          }else return cancel();
        }
        break;
      default:throw new Error('Invalid active map-name popup source state');
    }
    return snapshot();
  }

  // BG3 rest origin (0,0), BG_POS_OP_SET_Y: screenY = panelY - offset.
  // Compose before shared upper-screen brightness/window effects. Index zero is
  // represented by alpha zero; other pixels replace BG below, with no blending.
  // Return the original native frame if nothing opaque reaches the screen.
  function composite(nativeRGBA){
    validateBytes(nativeRGBA,CONSTANTS.width*CONSTANTS.height*4,'Native popup framebuffer');
    if(!active)return nativeRGBA;
    const panel=panels[section];
    let output=nativeRGBA;
    const firstY=Math.max(0,offset),lastY=Math.min(panel.height,CONSTANTS.height+offset);
    for(let panelY=firstY;panelY<lastY;panelY++){
      for(let x=0;x<panel.width;x++){
        const sourceAt=(panelY*panel.width+x)*4;
        if(panel.rgba[sourceAt+3]===0)continue;
        if(output===nativeRGBA)output=new Uint8ClampedArray(nativeRGBA);
        const targetAt=((panelY-offset)*CONSTANTS.width+x)*4;
        output[targetAt]=panel.rgba[sourceAt];
        output[targetAt+1]=panel.rgba[sourceAt+1];
        output[targetAt+2]=panel.rgba[sourceAt+2];
        output[targetAt+3]=panel.rgba[sourceAt+3];
      }
    }
    return output;
  }

  return Object.freeze({request,tick,cancel,snapshot,composite});
}
return Object.freeze({create,CONSTANTS});
});
