/* Source-backed sampled door rotations and pond/TV texture replacement.
 * No UV scrolling, interpolation, renderer clock, or external operations. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./world-animation-data.js'));else root.WorldAnimation=factory(root.WorldAnimationData);})(typeof globalThis!=='undefined'?globalThis:this,function(data){
'use strict';
if(!data||data.format!=='twinleaf-world-animation-data-v1')throw Error('WorldAnimation requires verified animation data');
function pixels(frame){const text=atob(frame.rgba_base64),out=new Uint8ClampedArray(text.length);for(let i=0;i<out.length;i++)out[i]=text.charCodeAt(i);if(out.length!==frame.width*frame.height*4)throw Error('Animation RGBA size mismatch');return{width:frame.width,height:frame.height,data:out};}
function create(options){
 if(options!==undefined&&(!options||typeof options!=='object'||Array.isArray(options)||Reflect.ownKeys(options).length!==1||options.areaManaged!==true))throw Error('WorldAnimation unsupported area manager options');
 const areaManaged=options!==undefined;
 const pondFrames=data.pond.frames.map(pixels),tvFrames=data.tv.frames.map(pixels);let header=null,pondIndex=0,pondSequence=0,pondCounter=0,tvPhase=0,tvIndex=0,door=null,dirty=true,updates=0;
 function reset(nextHeader){header=nextHeader;pondIndex=0;pondSequence=0;pondCounter=0;tvPhase=0;tvIndex=0;door=null;dirty=true;updates=0;}
 function sync(renderer,force){if(!dirty&&!force)return;if(!areaManaged||header!==411)renderer.replaceTexturePixels(data.pond.target.texture_key,pondFrames[pondIndex]);renderer.replaceTexturePixels(data.tv.target.original_texture_key,tvFrames[tvIndex]);dirty=false;}
 function tick(nextHeader,renderer,hasTV){if(header!==nextHeader)reset(nextHeader);updates++;
  if(header===411&&!areaManaged){const entry=data.pond.descriptor.frames[pondSequence];if(entry.dwell_threshold>pondCounter)pondCounter++;else{pondCounter=0;pondSequence=(pondSequence+1)%data.pond.descriptor.frames.length;pondIndex=data.pond.descriptor.frames[pondSequence].texture_index_raw&255;dirty=true;}}
  else if(header!==411&&hasTV){tvPhase=(tvPhase+1)%data.tv.contract.num_frames;const next=data.tv.contract.texture_index_sequence[tvPhase];if(next!==tvIndex){tvIndex=next;dirty=true;}}
  if(renderer)sync(renderer);
 }
 function bindDoor(houseId,memberId){const index=data.door_instances[houseId],clip=data.doors.clips.find(c=>c.member_id===memberId);if(!Number.isInteger(index)||!clip)throw Error('Unknown source door binding');door={houseId,index,memberId,frame:0,playing:true};}
 function tickDoor(){if(!door||!door.playing)return;const clip=data.doors.clips.find(c=>c.member_id===door.memberId);door.frame=Math.min(clip.num_frames-1,door.frame+1);door.playing=door.frame<clip.num_frames-1;}
 function overrides(currentHeader){if(currentHeader!==411||!door)return{};const clip=data.doors.clips.find(c=>c.member_id===door.memberId);return{[door.index]:{model:'building-0067',rotationFx12:clip.samples[door.frame].rotation_fx12.slice()}};}
 return{reset,tick,sync,bindDoor,tickDoor,doorComplete:()=>!!door&&!door.playing,clearDoor:()=>{door=null;},overrides,snapshot:()=>({header,pondIndex,pondCounter,pondSequence,tvPhase,tvIndex,updates,door:door?{...door}:null}),data};
}
return{create,data,pixels};
});
