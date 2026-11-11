/* App-implemented source-triangle rasterizer for environments without WebGL.
 * Uses actual geometry every frame, never a warped/cropped scene raster.
 * Floating-point CPU rasterization and integer lighting inputs retain explicit matrix/raster limitations.
 * RGB6 pixel arithmetic and edge metadata/final pass adapted from melonDS (Copyright2016-2026 melonDS team),
 * GPL-3.0-or-later; see assets/ds-lighting/reference/LICENSE and pinned source below. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-renderer.js'),require('./source-lighting.js'),require('./source-native-ortho.js'),undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,require('./source-exclamation-native.js'),require('./source-exit-indicator.js'),require('./source-native-field-lifecycle.js'),require('./source-exit-indicator-native.js'));
 else root.SourceCpuRenderer=factory(root.SourceRenderer,root.SourceLighting,root.SourceNativeOrtho,root.SourceNativeActorAudit,root.SourceNativePerspectiveAudit,root.SourceNativePondAudit,root.SourceNativeBytes,root.SourceNativeAnimationAudit,root.SourceNativeNeighborAudit,root.SourceNativeSeaAudit,root.SourceNativeNeighborLoader,root.SourceExclamationNative,root.SourceExitIndicator,root.SourceNativeFieldLifecycle,root.SourceExitIndicatorNative);
})(typeof globalThis!=='undefined'?globalThis:this,function(Core,Lighting,Native,BrowserActorAudit,BrowserPerspectiveAudit,BrowserPondAudit,BrowserBytes,BrowserAnimationAudit,BrowserNeighborAudit,BrowserSeaAudit,BrowserNeighborLoader,Exclamation,ExitCore,Fields,ExitNative){
 'use strict';
 var W=256,H=192,M=Core&&Core.math,NativeActorAudit=null,NativePerspectiveAudit=null,NativePondAudit=null,NativeBytes=BrowserBytes||null,NativeAnimationAudit=null,NativeNeighborAudit=null,NativeSeaAudit=null,NativeNeighborLoader=null;
 var LIMITS=Object.freeze([
  'CPU source-triangle rendering at256x192, not a flat scene-image substitute or DS GPU emulation.',
  'Floating-point clip/depth/interpolation and top-left coverage remain different from original hardware; RGB6 modulation/alpha5 blending are a separately source-derived stage.',
  'Source-gated edge marking uses recovered original polygon perimeters, opaque IDs, strict cardinal depth tests and marked-edge RGB6 AA; float boundary flags are not DS integer slope coverage.',
  'Unmarked slope AA, fog, shadow-stencil rasterization, exact DS depth/scanline interpolation and DS2D alpha composition remain unimplemented. Canvas2D output stays opaque; source alpha5 is retained internally.',
  'Transparent batches use far-to-near centroid ordering, not the source-requested DS automatic polygon ordering.',
  'Pinned integer DS lighting reference with specular/RGB5 stages; position-matrix and downstream raster limits remain.',
  'Performance is device-dependent and unmeasured in the managed browser until integration QA. Lower presentation rate may be required.',
  'Only exact building-0067 door poses, fourteen source door-camera projections/follow hold and explicit texture replacement are supported; scheduling belongs to the caller. Other model animation/runtime offsets/Pokemon geometry remain unproven.'
 ]);
 function assert(ok,msg){if(!ok)throw new Error('SourceCpuRenderer: '+msg);}
 function finite3(v,label){assert(v&&v.length===3&&Array.from(v).every(Number.isFinite),label+' must be finiteXYZ');}

 // Frame authority is minted only inside an actual renderer invocation.
 // Public inspection validates an existing private pair; it cannot mint one.
 const exitFrames=new WeakMap(),exitExpectations=new WeakMap(),fieldRenderers=new WeakMap();let rendererSequence=0;
 function verifyExitIndicatorFrame(frame,expected){
  const r=exitFrames.get(frame);assert(r&&exitExpectations.get(expected)===r,'foreign/copied preset4 frame or crossed expected invocation');
  r.validate();return r.publicRecord;
 }
 function cameraArray(value,n,label){
  assert(Array.isArray(value)&&value.length===n,label+' dense array');const out=[];
  for(let i=0;i<n;i++){const d=Object.getOwnPropertyDescriptor(value,String(i));assert(d&&Object.hasOwn(d,'value')&&Number.isFinite(d.value),label+' dense finite data');out.push(d.value);}
  return Object.freeze(out);
 }
 const cameraArrayKeys={target:3,eye:3,view:16,projection:16,spriteProjection:16,viewProjection:16};
 function snapshotEffectiveCamera(camera){
  const out={};for(const [k,n]of Object.entries(cameraArrayKeys)){const d=Object.getOwnPropertyDescriptor(camera,k);assert(d&&Object.hasOwn(d,'value'),'effective camera data '+k);out[k]=cameraArray(d.value,n,k);}
  for(const k of ['preset','perspectiveAngleU16']){const d=Object.getOwnPropertyDescriptor(camera,k);assert(d&&Object.hasOwn(d,'value'),'effective camera data '+k);out[k]=d.value;}
  return Object.freeze(out);
 }
 function sameEffectiveCamera(a,b){return !!a&&!!b&&Object.keys(cameraArrayKeys).every(k=>a[k].every((x,i)=>x===b[k][i]))&&a.preset===b.preset&&a.perspectiveAngleU16===b.perspectiveAngleU16;}

 // Clip vertex: x,y,z,w,s,t,r,g,b. Attribute interpolation occurs before perspective divide.
 function planeDistance(v,p){switch(p){case 0:return v[3]+v[0];case 1:return v[3]-v[0];case 2:return v[3]+v[1];case 3:return v[3]-v[1];case 4:return v[3]+v[2];default:return v[3]-v[2];}}
 function clipCode(v){var code=0;for(var p=0;p<6;p++)if(planeDistance(v,p)<0)code|=1<<p;return code;}
 function clipTriangle(a,b,c){
  var ca=clipCode(a),cb=clipCode(b),cc=clipCode(c);if(ca&cb&cc)return [];if(!(ca|cb|cc))return [[a,b,c]];
  var polygon=[a,b,c];
  for(var p=0;p<6&&polygon.length;p++){
   var output=[],prev=polygon[polygon.length-1],pd=planeDistance(prev,p);
   for(var i=0;i<polygon.length;i++){
    var cur=polygon[i],cd=planeDistance(cur,p),pi=pd>=0,ci=cd>=0;
    if(pi!==ci){var t=pd/(pd-cd),v=new Array(9);for(var k=0;k<9;k++)v[k]=prev[k]+t*(cur[k]-prev[k]);output.push(v);}
    if(ci)output.push(cur);prev=cur;pd=cd;
   }polygon=output;
  }
  var out=[];for(var i=1;i<polygon.length-1;i++)out.push([polygon[0],polygon[i],polygon[i+1]]);return out;
 }
 function screenVertex(v,width,height){var iw=1/v[3];return {x:(v[0]*iw+1)*width/2,y:(1-v[1]*iw)*height/2,z:v[2]*iw,iw:iw,s:v[4]*iw,t:v[5]*iw,r:v[6]*iw,g:v[7]*iw,b:v[8]*iw};}
 function edge(a,b,x,y){return (b.x-a.x)*(y-a.y)-(b.y-a.y)*(x-a.x);}
 function topLeft(a,b){var dy=b.y-a.y,dx=b.x-a.x;return dy<0||(dy===0&&dx>0);}
 function address(p,size,repeat,flip){p=Math.floor(p);if(!repeat)return p<0?0:p>=size?size-1:p;var period=flip?size*2:size;p=((p%period)+period)%period;return flip&&p>=size?period-1-p:p;}
 // Source pixel arithmetic: pinned GPU3D.cpp1244-1249 expands RGB5 to
 // final-color9; GPU3D_Soft.cpp1150-1157 supplies color9>>3,495-535
 // modulates RGB6/alpha5,430-455 blends RGB6 using alpha5+1. The existing
 // float clip/perspective interpolator is NOT the native integer scanline
 // interpolator. Converting original vertex endpoints before that stage
 // preserves exact constant-color cases, not all interpolated pixels.
 function sourceColor9(normalized){var c=Math.max(0,Math.min(31,Math.round(normalized*31)));return c?c*16+15:0;}
 function color9To6(value){return Math.max(0,Math.min(63,Math.floor(value/8)));}
 function color5To6(value){return value?value*2+1:0;}
 function color6To8(value){return (value<<2)|(value>>>4);}
 function modulate6(texture6,vertex6){return ((texture6+1)*(vertex6+1)-1)>>>6;}
 function modulateAlpha5(texture5,polygon5){return ((texture5+1)*(polygon5+1)-1)>>>5;}
 function blend6(source6,dest6,alpha5,destAlpha5,enabled){return !destAlpha5||!enabled?source6:(source6*(alpha5+1)+dest6*(31-alpha5))>>>5;}
 function textureAlpha5(alpha8){return Math.round(alpha8*31/255);}
 function sourceFragment(red,green,blue,textureRGBA,polygonAlpha5){
  var rgb=[color9To6(red),color9To6(green),color9To6(blue)],a=polygonAlpha5;
  if(textureRGBA){for(var i=0;i<3;i++)rgb[i]=modulate6(color5To6(textureRGBA[i]>>>3),rgb[i]);a=modulateAlpha5(textureAlpha5(textureRGBA[3]),a);}
  return {rgb:rgb,alpha5:a};
 }
 function createTarget(width,height){return {width:width,height:height,color:new Uint8ClampedArray(width*height*4),depth:new Float64Array(width*height),alpha5:new Uint8Array(width*height)};}
 function clearTarget(target,rgba,edgeState){for(var i=0;i<target.color.length;i+=4){target.color[i]=rgba[0];target.color[i+1]=rgba[1];target.color[i+2]=rgba[2];target.color[i+3]=rgba[3];}target.depth.fill(1);target.alpha5.fill(Math.round(rgba[3]*31/255));initializeEdgeBuffers(target,edgeState||null);}
 function rasterizeTriangle(target,tri,material,texture,frame,stats){
  // Public synthetic-fixture entry point. tri is already homogeneously clipped.
  if(tri.some(function(v){return !(v[3]>0)||!v.every(Number.isFinite);}))return;
  var v0=screenVertex(tri[0],target.width,target.height),v1=screenVertex(tri[1],target.width,target.height),v2=screenVertex(tri[2],target.width,target.height);
  var area=edge(v0,v1,v2.x,v2.y);if(!Number.isFinite(area)||area===0)return;
  var front=area<0;if((material.cull==='back'&&!front)||(material.cull==='front'&&front)||material.cull==='both')return;
  if(area<0){var swap=v1;v1=v2;v2=swap;area=-area;}
  var minX=Math.max(0,Math.ceil(Math.min(v0.x,v1.x,v2.x)-.5)),maxX=Math.min(target.width-1,Math.floor(Math.max(v0.x,v1.x,v2.x)-.5));
  var minY=Math.max(0,Math.ceil(Math.min(v0.y,v1.y,v2.y)-.5)),maxY=Math.min(target.height-1,Math.floor(Math.max(v0.y,v1.y,v2.y)-.5));
  if(minX>maxX||minY>maxY)return;
  if(stats)stats.rasterizedTriangles++;
  var tl0=topLeft(v1,v2),tl1=topLeft(v2,v0),tl2=topLeft(v0,v1),invArea=1/area;
  var ex0=-(v2.y-v1.y),ey0=v2.x-v1.x,ex1=-(v0.y-v2.y),ey1=v0.x-v2.x,ex2=-(v1.y-v0.y),ey2=v1.x-v0.x;
  var row0=edge(v1,v2,minX+.5,minY+.5),row1=edge(v2,v0,minX+.5,minY+.5),row2=edge(v0,v1,minX+.5,minY+.5);
  var sizeX=frame?32:texture?texture.width:1,sizeY=frame?32:texture?texture.height:1,ox=frame?frame.x:0,oy=frame?frame.y:0;
  var rs=frame?false:material.repeatS,rt=frame?false:material.repeatT,fs=material.flipS,ft=material.flipT;
  for(var y=minY;y<=maxY;y++){
   var e0=row0,e1=row1,e2=row2;
   for(var x=minX;x<=maxX;x++,e0+=ex0,e1+=ex1,e2+=ex2){
    if(e0<0||(e0===0&&!tl0)||e1<0||(e1===0&&!tl1)||e2<0||(e2===0&&!tl2))continue;
    if(stats)stats.testedPixels++;
    var a=e0*invArea,b=e1*invArea,c=e2*invArea,depth=(a*v0.z+b*v1.z+c*v2.z+1)*.5,index=y*target.width+x;
    if(depth<0||depth>1)continue;
    var lower=false,edgeData=target.edge;
    if(material.depthEqual?depth!==target.depth[index]:depth>=target.depth[index]){
     if(edgeData&&target.edgeState.antiAlias&&edgeData.top.boundary[index]&&!(material.depthEqual?depth!==edgeData.bottomDepth[index]:depth>=edgeData.bottomDepth[index]))lower=true;
     else {if(stats)stats.depthRejectedPixels++;continue;}
    }
    var iw=a*v0.iw+b*v1.iw+c*v2.iw;if(!(iw>0))continue;
    var invW=1/iw,red=(a*v0.r+b*v1.r+c*v2.r)*invW,green=(a*v0.g+b*v1.g+c*v2.g)*invW,blue=(a*v0.b+b*v1.b+c*v2.b)*invW;
    var tr=255,tg=255,tb=255,ta=255;
    if(texture){
     var s=(a*v0.s+b*v1.s+c*v2.s)*invW,t=(a*v0.t+b*v1.t+c*v2.t)*invW;
     var tx=ox+address(s,sizeX,rs,fs),ty=oy+address(t,sizeY,rt,ft),ti=(ty*texture.width+tx)*4;
     tr=texture.data[ti];tg=texture.data[ti+1];tb=texture.data[ti+2];ta=texture.data[ti+3];
    }
    var integerPixels=material.pixelPipeline==='rgb6-reference',fragment=integerPixels?sourceFragment(red,green,blue,texture?[tr,tg,tb,ta]:null,Math.round(material.alpha*31)):null;
    var alpha=integerPixels?fragment.alpha5/31:material.alpha*ta/255;if(alpha<=0)continue;
    var pi=index*4;
    if(edgeData){
     var boundary=material.polygonBoundary?polygonBoundaryFlags(material.polygonBoundary,x,y):0;
     var wasBoundary=edgeData.top.boundary[index];
     writeEdgePixel(target,index,lower,material,boundary,depth,alpha,integerPixels?fragment.rgb:[tr*red,tg*green,tb*blue],stats);
     if(alpha<1&&!lower&&wasBoundary)writeEdgePixel(target,index,true,material,boundary,depth,alpha,integerPixels?fragment.rgb:[tr*red,tg*green,tb*blue],stats);
     continue;
    }
    if(integerPixels){
     for(var channel=0;channel<3;channel++)target.color[pi+channel]=color6To8(fragment.alpha5===31?fragment.rgb[channel]:blend6(fragment.rgb[channel],target.color[pi+channel]>>>2,fragment.alpha5,target.alpha5[index],true));
     target.alpha5[index]=Math.max(target.alpha5[index],fragment.alpha5);
    }else if(material.translucent){var remain=1-alpha;target.color[pi]=tr*red*alpha+target.color[pi]*remain;target.color[pi+1]=tg*green*alpha+target.color[pi+1]*remain;target.color[pi+2]=tb*blue*alpha+target.color[pi+2]*remain;}
    else {target.color[pi]=tr*red;target.color[pi+1]=tg*green;target.color[pi+2]=tb*blue;}
    target.color[pi+3]=255;if(material.depthWrite)target.depth[index]=depth;if(stats)stats.drawnPixels++;
   }row0+=ey0;row1+=ey1;row2+=ey2;
  }
 }
 // Edge metadata and final pass adapted from melonDS GPU3D_Soft.cpp, revision
 // 497aa6cdd26f45f8064b78916b00a773eab4ded7, SHA256
 // 337565413062b6a19488d816d3fb95ec334e69968511e98f659a961d57f1ef4f.
 // Copyright 2016-2026 melonDS team; GPL-3.0-or-later.
 // See assets/ds-lighting/reference/LICENSE. Source lines565-602 preserve opaque
 // ID/boundary through translucency;1110-1390 keep two layers;1453-1619 mark
 // edges then AA;1623-1713 initialize clear/border IDs and depth.
 // Deliberate approximation: original polygon perimeter + float cardinal-sample
 // boundary flags replace DS integer slope coverage. Only marked-edge AA is
 // implemented; unmarked slope AA, fog, DS fixed-point depth and shadow stencil
 // remain unsupported. RGB6 fragment arithmetic is separate from those limits.
 function clipPolygon(polygon){
  for(var p=0;p<6&&polygon.length;p++){
   var output=[],prev=polygon[polygon.length-1],pd=planeDistance(prev,p);
   for(var i=0;i<polygon.length;i++){
    var cur=polygon[i],cd=planeDistance(cur,p),pi=pd>=0,ci=cd>=0;
    if(pi!==ci){var f=pd/(pd-cd),v=new Array(9);for(var k=0;k<9;k++)v[k]=prev[k]+f*(cur[k]-prev[k]);output.push(v);}
    if(ci)output.push(cur);prev=cur;pd=cd;
   }polygon=output;
  }return polygon;
 }
 function preparePolygonBoundary(vertices,width,height){
  var clipped=clipPolygon(vertices);if(clipped.length<3||clipped.some(function(v){return !(v[3]>0);}))return [];
  var ps=clipped.map(function(v){return screenVertex(v,width,height);}),area=0;
  ps.forEach(function(a,i){var b=ps[(i+1)%ps.length];area+=a.x*b.y-a.y*b.x;});if(!area)return [];
  var sign=area<0?-1:1;
  return ps.map(function(a,i){var b=ps[(i+1)%ps.length],dx=b.x-a.x,dy=b.y-a.y;return {x:a.x,y:a.y,dx:dx*sign,dy:dy*sign,topLeft:dy*sign<0||(dy===0&&dx*sign>0)};});
 }
 function polygonBoundaryFlags(edges,x,y){
  var flags=0;x+=.5;y+=.5;
  // These flags belong to the original polygon, never a raster triangle or
  // alpha cutout. A cardinal sample across any original perimeter marks it.
  for(var k=0;k<edges.length;k++){
   var e=edges[k],d=e.dx*(y-e.y)-e.dy*(x-e.x);
   if(d+e.dy<0||(d+e.dy===0&&!e.topLeft))flags|=1;if(d-e.dy<0||(d-e.dy===0&&!e.topLeft))flags|=2;
   if(d-e.dx<0||(d-e.dx===0&&!e.topLeft))flags|=4;if(d+e.dx<0||(d+e.dx===0&&!e.topLeft))flags|=8;
  }return flags;
 }
 function validateEdgeAudit(data){
  if(!data.edgeMarking||!data.edgeTopology)return null;
  var audit=data.edgeMarking,top=data.edgeTopology;
  assert(audit.format===1&&top.format===1,'unsupported edge audit format');
  assert(top.source_mesh_sha256===data.provenance.mesh_sha256,'edge topology mesh mismatch');
  var s=audit.initial_field_state,c=audit.clear;
  assert(s&&typeof s.anti_aliasing==='boolean'&&typeof s.alpha_blend==='boolean'&&typeof s.edge_marking_after_area_load==='boolean','unverified field edge enable state');
  assert(c&&Array.isArray(c.rgb5)&&c.rgb5.length===3&&c.rgb5.every(function(v){return Number.isInteger(v)&&v>=0&&v<=31;})&&Number.isInteger(c.alpha5)&&c.alpha5>=0&&c.alpha5<=31&&Number.isInteger(c.depth15)&&c.depth15>=0&&c.depth15<=32767&&Number.isInteger(c.opaque_polygon_id)&&c.opaque_polygon_id>=0&&c.opaque_polygon_id<=63,'invalid edge clear state');
  var headers={};audit.headers.forEach(function(h){assert(Number.isInteger(h.header)&&!headers[h.header]&&Array.isArray(h.edge_rgb555)&&h.edge_rgb555.length===8&&h.edge_rgb555.every(function(v){return Number.isInteger(v)&&v>=0&&v<=32767;}),'invalid edge table');headers[h.header]=h;});
  data.mesh.headers.forEach(function(h){assert(headers[h.header],'missing header edge table');});
  Object.keys(data.mesh.models).forEach(function(key){var ms=data.mesh.models[key],ts=top.models[key];assert(ts&&ts.length===ms.length,'edge model mismatch '+key);ms.forEach(function(m,mi){assert(ts[mi].batches.length===m.draw_batches.length,'edge batch mismatch');m.draw_batches.forEach(function(b,bi){
   var t=ts[mi].batches[bi],n=b.vertex_count/3;assert(t.triangle_polygon_indices.length===n&&t.triangle_boundary_masks.length===n,'edge triangle count mismatch');var used=new Uint8Array(n);
   t.original_polygons.forEach(function(p,pi){assert(Number.isInteger(p.first_triangle)&&Number.isInteger(p.triangle_count)&&p.triangle_count>0&&p.first_triangle>=0&&p.first_triangle+p.triangle_count<=n&&Array.isArray(p.boundary_vertices)&&p.boundary_vertices.length>=3&&p.boundary_vertices.every(function(v){return Number.isInteger(v)&&v>=0&&v<b.vertex_count;}),'invalid original polygon');
    for(var i=p.first_triangle;i<p.first_triangle+p.triangle_count;i++){assert(!used[i]&&t.triangle_polygon_indices[i]===pi,'edge polygon coverage mismatch');used[i]=1;assert(Number.isInteger(t.triangle_boundary_masks[i])&&t.triangle_boundary_masks[i]>=0&&t.triangle_boundary_masks[i]<=7,'invalid edge mask');}
   });assert(used.every(function(v){return v===1;}),'incomplete original topology');
  });});});return {headers:headers,state:s,clear:c,topology:top};
 }
 function edgeStateFor(audit,header,mode){
  assert(mode==='source'||mode==='off','edgeMarking must be source or off');if(!audit)return null;
  return {enabled:mode!=='off'&&audit.state.edge_marking_after_area_load,antiAlias:audit.state.anti_aliasing,alphaBlend:audit.state.alpha_blend,table:audit.headers[header].edge_rgb555,clear:audit.clear,clearDepth:((audit.clear.depth15*512)+511)/16777215};
 }
 function initializeEdgeBuffers(target,state){
  target.edgeState=state;if(!state){target.edge=null;return;}
  var n=target.width*target.height,e=target.edgeCache;
  if(!e){function layer(){return {id:new Uint8Array(n),boundary:new Uint8Array(n),alpha:new Uint8Array(n),translucentId:new Int16Array(n)};}
   e=target.edgeCache={top:layer(),bottom:layer(),bottomColor:new Uint8ClampedArray(n*4),bottomDepth:new Float64Array(n),marked:new Uint8Array(n)};
  }target.edge=e;
  [e.top,e.bottom].forEach(function(l){l.id.fill(state.clear.opaque_polygon_id);l.boundary.fill(0);l.alpha.fill(state.clear.alpha5);l.translucentId.fill(-1);});
  e.bottomColor.set(target.color);e.bottomDepth.fill(state.clearDepth);e.marked.fill(0);target.depth.fill(state.clearDepth);
 }
 function copyPixelToBottom(target,i){
  var e=target.edge,p=i*4;for(var c=0;c<4;c++)e.bottomColor[p+c]=target.color[p+c];e.bottomDepth[i]=target.depth[i];
  ['id','boundary','alpha','translucentId'].forEach(function(k){e.bottom[k][i]=e.top[k][i];});
 }
 function writeEdgePixel(target,index,lower,material,boundary,depth,alpha,rgb,stats){
  var e=target.edge,l=lower?e.bottom:e.top,color=lower?e.bottomColor:target.color,depths=lower?e.bottomDepth:target.depth,pi=index*4,id=material.polygonId;
  var opaque=alpha>=1,integerPixels=material.pixelPipeline==='rgb6-reference',alpha5=Math.round(alpha*31);
  if(!opaque){
   // PlotTranslucentPixel retains dst opaque ID and boundary, including shade
   // polygons. A true shadow's mask/stencil construction is NOT implemented.
   if(l.translucentId[index]===id||(material.shadow&&l.translucentId[index]<0&&l.id[index]===id))return;
   var remain=1-alpha;for(var c=0;c<3;c++)color[pi+c]=integerPixels?color6To8(blend6(rgb[c],color[pi+c]>>>2,alpha5,l.alpha[index],target.edgeState.alphaBlend)):rgb[c]*alpha+color[pi+c]*remain;
   l.alpha[index]=Math.max(l.alpha[index],Math.round(alpha*31));l.translucentId[index]=id;
   if(material.depthWrite)depths[index]=depth;
  }else{
   if(!lower&&boundary&&target.edgeState.antiAlias)copyPixelToBottom(target,index);
   for(var c=0;c<3;c++)color[pi+c]=integerPixels?color6To8(rgb[c]):rgb[c];l.id[index]=id;l.boundary[index]=boundary;l.alpha[index]=31;l.translucentId[index]=-1;depths[index]=depth;
  }
  // The existing opaque Canvas2D presentation is retained. Source alpha5 is
  // tracked separately for AA; this does not emulate the DS2D compositor.
  color[pi+3]=255;if(stats){stats.drawnPixels++;if(lower)stats.edgeLowerLayerPixels++;}
 }
 function applyEdgeMarking(target,stats){
  var e=target.edge,s=target.edgeState;if(!e||!s.enabled)return 0;
  var w=target.width,h=target.height,count=0;
  function qualifies(i,n){return e.top.id[i]!== (n<0?s.clear.opaque_polygon_id:e.top.id[n])&&target.depth[i]<(n<0?s.clearDepth:target.depth[n]);}
  for(var y=0;y<h;y++)for(var x=0;x<w;x++){
   var i=y*w+x;if(!e.top.boundary[i])continue;if(stats)stats.edgeBoundaryPixels++;
   if(!qualifies(i,x?i-1:-1)&&!qualifies(i,x+1<w?i+1:-1)&&!qualifies(i,y?i-w:-1)&&!qualifies(i,y+1<h?i+w:-1))continue;
   var packed=s.table[e.top.id[i]>>>3],p=i*4;
   for(var c=0;c<3;c++){
    var v=(packed>>>(5*c))&31,top=v?2*v+1:0;
    if(s.antiAlias&&e.bottom.alpha[i]>0)top=(top*17+(e.bottomColor[p+c]>>>2)*15)>>>5;
    target.color[p+c]=(top<<2)|(top>>>4);
   }
   if(s.antiAlias)e.top.alpha[i]=(e.top.alpha[i]*17+e.bottom.alpha[i]*15)>>>5;
   e.marked[i]=1;count++;
  }if(stats)stats.edgeMarkedPixels=count;return count;
 }

 function dimensions(image){return [image.naturalWidth||image.videoWidth||image.width,image.naturalHeight||image.videoHeight||image.height];}
 function pixelsFromImage(image){
  var sz=dimensions(image);assert(Number.isInteger(sz[0])&&sz[0]>0&&Number.isInteger(sz[1])&&sz[1]>0,'decoded image required');
  var pixels;
  if(image.data&&image.data.length===sz[0]*sz[1]*4)pixels=image.data;
  else {
   var c=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(sz[0],sz[1]):typeof document!=='undefined'?document.createElement('canvas'):null;
   assert(c,'image readback requires Canvas2D; use createWithPixels in Node');c.width=sz[0];c.height=sz[1];var ctx=c.getContext('2d',{willReadFrequently:true});assert(ctx,'Canvas2D unavailable');
   ctx.imageSmoothingEnabled=false;ctx.drawImage(image,0,0);pixels=ctx.getImageData(0,0,sz[0],sz[1]).data;
  }
  var partial=false,cutout=false;for(var i=3;i<pixels.length;i+=4){if(pixels[i]===0)cutout=true;else if(pixels[i]!==255)partial=true;}
  return {width:sz[0],height:sz[1],data:pixels,translucent:partial,cutout:cutout};
 }
 function createWithPixels(canvas,data,texturePixels,spriteImages,options){
  options=options||{};spriteImages=spriteImages||{};assert(Core&&Lighting,'load source-lighting.js and source-renderer.js before CPU renderer');
  var neighborGraph=!!data.nativeNeighborGraph;
  if(neighborGraph){
   if(typeof module==='object'&&module.exports&&typeof require==='function'){if(!NativeBytes)NativeBytes=require('./source-native-bytes.js');if(!NativeNeighborAudit)NativeNeighborAudit=require('./source-native-neighbor-audit.js');if(!NativeSeaAudit)NativeSeaAudit=require('./source-native-sea-audit.js');}
   else{assert(BrowserBytes&&BrowserNeighborAudit&&typeof BrowserNeighborAudit.snapshotData==='function'&&BrowserSeaAudit&&typeof BrowserSeaAudit.verify==='function','native neighbor source gates are not loaded');NativeBytes=BrowserBytes;NativeNeighborAudit=BrowserNeighborAudit;NativeSeaAudit=BrowserSeaAudit;}
   assert(typeof NativeNeighborAudit.snapshotData==='function','native neighbor graph snapshot gate is not loaded');data=NativeNeighborAudit.snapshotData(data);
  }
  var edgeAudit=validateEdgeAudit(data);
  var summary=Core.validateData(data),lightingSummary=Lighting.validateAudit(data),mesh=data.mesh,tables=Lighting.normalizeAuditTables(data.lighting);
  assert(canvas&&typeof canvas.getContext==='function','dedicated Canvas2D output required');canvas.width=W;canvas.height=H;var ctx=canvas.getContext('2d',{alpha:false});assert(ctx,'Canvas2D unavailable');
  var imageData=ctx.createImageData(W,H),target=createTarget(W,H);target.color=imageData.data;
  var textureMap={},atlasCache=new Map(),resources={},scenes={},overrides={},textureReplacements=0,textureReplacementKeys=new Set(),textureReplacementStorage=new Map();
  Object.keys(mesh.textures).forEach(function(k){var p=pixelsFromImage(texturePixels[k]),d=mesh.textures[k];assert(p.width===d.width&&p.height===d.height,'texture dimensions differ');textureMap[k]=p;});
  data.sceneInstanceProjectionOverrides.forEach(function(o){overrides[o.model]=o.projection_pass;});
  Object.keys(mesh.models).forEach(function(key){resources[key]=[];mesh.models[key].forEach(function(model,mi){model.draw_batches.forEach(function(batch,bi){
   var centroid=[0,0,0];for(var i=0;i<batch.vertices.length;i+=11)for(var n=0;n<3;n++)centroid[n]+=batch.vertices[i+n]/batch.vertex_count;
   var captured=neighborGraph?Native.captureSourceGeometry(batch.vertices,edgeAudit.topology.models[key][mi].batches[bi]):null;
   var lm=data.lighting.models[key][mi];resources[key].push({nativeKey:key,nativeModel:mi,nativeBatch:bi,nativeScale:model.source_position_scale_already_applied,edgeTopology:captured?captured.topology:edgeAudit&&edgeAudit.topology.models[key][mi].batches[bi],vertices:captured?captured.vertices:batch.vertices,count:batch.vertex_count,material:model.materials[batch.material],colorSource:lm.batches[bi].color_source,lightingMaterial:lm.materials[batch.material],billboard:model.billboard,centroid:centroid,shadingKey:null,shaded:null});
  });});});
  Object.keys(mesh.scenes).forEach(function(k){scenes[k]=[];mesh.scenes[k].instances.forEach(function(inst,instanceIndex){var matrix=M.instanceMatrix(inst);resources[inst.model].forEach(function(batch){scenes[k].push({instanceIndex:instanceIndex,batch:batch,matrix:matrix,center:M.transform(matrix,batch.centroid).slice(0,3),projectionPass:overrides[inst.model]||'world'});});});});
  var disposed=false,history=null,lastHeader=null,lastFrame=null,lastCamera=null,lastStats=null,followHeld=false,lastPerspectiveAngle=null,lightSelection=null,lastLightHeader=null,lastLightFrame=null,lightState=null;

  const rendererIdentity=Object.freeze({}),rendererGeneration=++rendererSequence,exitBindings=new WeakMap(),completedFields=new WeakMap();let effectiveCamera=null,exitFrame=null,renderSequence=0,fieldEpoch=0;
  function revokeExitFrame(){assert(Number.isSafeInteger(++fieldEpoch),'renderer field epoch capacity');if(exitFrame){exitFrame.status='revoked';exitFrame=null;}}
  function bindExitIndicator(bridge,manager){
   assert(!disposed&&Fields&&ExitCore&&ExitNative,'field effect dependencies/renderer required');Fields.verifyBridge(bridge);ExitCore.verifyManager(manager);
   const a=bridge.snapshot(),b=manager.snapshot();assert(a.header===b.header&&a.generation===b.generation,'field/effect lifetime mismatch');
   const binding=Object.freeze({kind:'renderer-owned-field-effect-binding'});exitBindings.set(binding,{rendererIdentity,bridge,manager,active:true});return binding;
  }
  function bindingRecord(binding){const r=exitBindings.get(binding);assert(r&&r.active&&r.rendererIdentity===rendererIdentity&&!disposed,'foreign, copied or revoked renderer binding');Fields.verifyBridge(r.bridge);ExitCore.verifyManager(r.manager);return r;}
  function revokeExitIndicatorBinding(binding){const r=bindingRecord(binding);r.active=false;revokeExitFrame();return true;}
  function renderField(input,binding,fieldToken,advance){
   assert(typeof advance==='boolean','explicit field advance mode required');const b=bindingRecord(binding);Fields.verifyPreparedField(b.bridge,fieldToken);
   const s=b.manager.snapshot();assert(fieldToken.header===input.header&&s.header===input.header&&s.generation===fieldToken.generation,'caller field/header/generation mismatch');
   assert(s.pendingKind===null,'field effect transaction must be settled before another render');
   return renderTransaction(input,{binding,b,fieldToken,advance,drawToken:null,frameRecord:null});
  }
  function prepareExitFrame(input,request,preset,nativeActors,nativePerspective){
   if(!request)return null;
   const b=bindingRecord(request.binding);assert(b===request.b,'changed field binding');Fields.verifyPreparedField(b.bridge,request.fieldToken);
   if(input.header===411&&nativeActors&&nativePerspective&&preset.index===0&&input.rasterPipeline==='native-perspective-streamed-neighbor-sea'){
    assert(options.history!==false&&effectiveCamera&&sameEffectiveCamera(snapshotEffectiveCamera(lastCamera),effectiveCamera),'hidden town requires canonical source camera');
    const token=b.manager.prepareHiddenField(request.advance),sequence=renderSequence,camera=effectiveCamera;request.drawToken=token;
    const r={status:'rendering',frame:null,expected:null,validate(){assert(r.status==='rendering'&&exitFrame===r&&renderSequence===sequence&&effectiveCamera===camera,'stale or revoked hidden field frame');assert(bindingRecord(request.binding)===b,'crossed hidden renderer field');Fields.verifyPreparedField(b.bridge,request.fieldToken);b.manager.preflightCommit(token);assert(sameEffectiveCamera(snapshotEffectiveCamera(lastCamera),camera),'mutated hidden camera during frame');},publicRecord:Object.freeze({view:null,descriptor:null,expectedDraw:null,drawToken:token})};request.frameRecord=r;exitFrame=r;r.validate();return r;
   }
   assert(nativeActors&&!nativePerspective&&preset.index===4&&[412,413,414,415,416,417].includes(input.header),'field effect requires native preset4 interior actor pipeline');
   assert(options.history!==false,'field effect requires the source follow history');
   assert(effectiveCamera&&sameEffectiveCamera(snapshotEffectiveCamera(lastCamera),effectiveCamera),'changed effective renderer camera');
   const targetFx12=effectiveCamera.target.map(x=>x*4096),viewFx12=Native.math.view(effectiveCamera.target,false),projectionFx12=effectiveCamera.projection.map(x=>x*4096),effectsProjectionFx12=effectiveCamera.spriteProjection.map(x=>x*4096);
   const view=Object.freeze({header:input.header,preset:4,rendererGeneration,viewGeneration:renderSequence,targetFx12:Object.freeze(targetFx12),viewFx12:Object.freeze(viewFx12),projectionFx12:Object.freeze(projectionFx12),effectsProjectionFx12:Object.freeze(effectsProjectionFx12)});
   const token=b.manager.prepareDraw({advance:request.advance,view});request.drawToken=token;
   const descriptor=b.manager.drawDescriptor(token),expectedDraw=b.manager.expectedDraw(token,view),frame=Object.freeze({kind:'renderer-owned-preset4-frame'}),expected=Object.freeze({kind:'expected-renderer-field-draw'}),sequence=renderSequence,camera=effectiveCamera;
   const r={status:'rendering',frame,expected,validate(){
    assert(r.status==='rendering'&&exitFrame===r&&renderSequence===sequence&&effectiveCamera===camera,'stale, closed or revoked preset4 frame');
    assert(bindingRecord(request.binding)===b,'crossed renderer field');Fields.verifyPreparedField(b.bridge,request.fieldToken);b.manager.validate(token);
    assert(sameEffectiveCamera(snapshotEffectiveCamera(lastCamera),camera),'mutated live camera during frame');
    if(descriptor)ExitCore.verifyDescriptor(descriptor,expectedDraw);
   },publicRecord:Object.freeze({view,descriptor,expectedDraw,drawToken:token})};
   exitFrames.set(frame,r);exitExpectations.set(expected,r);request.frameRecord=r;exitFrame=r;r.validate();return r;
  }

  function resetCamera(header,position){revokeExitFrame();effectiveCamera=null;M.resolveScene(mesh,header);history=M.createHistory(position);lastHeader=Number(header);lastFrame=null;lastCamera=null;followHeld=false;lastPerspectiveAngle=null;}
  function advanceCamera(input){
   revokeExitFrame();assert(!disposed,'renderer disposed');finite3(input.target,'target');assert(Number.isSafeInteger(input.frameIndex),'frameIndex must be a safe integer');
   var selected=M.resolveScene(mesh,input.header),preset=mesh.camera.presets.find(function(p){return p.index===selected.scene.camera_preset;});assert(preset,'missing source preset');
   var override=M.resolveCameraOverride(mesh,input.header,preset,input.cameraOverride),reset=lastHeader!==Number(input.header)||!history||input.resetCamera;
   if(override&&override.holdFollow)assert(!reset&&lastCamera,'holdFollow requires an existing camera lookAt; initialize before holding');
   assert(reset||lastFrame===null||input.frameIndex>=lastFrame,'frameIndex went backwards; resetCamera first');
   if(reset)resetCamera(input.header,input.target);
   if(override){if(override.holdFollow)followHeld=true;lastPerspectiveAngle=override.perspectiveAngleU16;}
   if(lastFrame!==input.frameIndex){if(!followHeld){lastCamera=M.camera(preset,options.history===false?input.target:history.update(input.target));effectiveCamera=snapshotEffectiveCamera(lastCamera);}lastFrame=input.frameIndex;}
   if(lastPerspectiveAngle!==null){
    const trusted=effectiveCamera&&sameEffectiveCamera(snapshotEffectiveCamera(lastCamera),effectiveCamera);
    lastCamera=M.cameraWithDoorProjection(lastCamera,lastPerspectiveAngle);
    if(trusted)effectiveCamera=snapshotEffectiveCamera(lastCamera);
   }
   // Reusing an exposed same-frame object is not a new canonical derivation.
   return lastCamera;
  }
  function replaceTexturePixels(key,pixels){
   assert(!disposed,'renderer disposed');
   if(!NativeBytes&&typeof module==='object'&&module.exports&&typeof require==='function')NativeBytes=require('./source-native-bytes.js');
   var width=pixels&&pixels.width,height=pixels&&pixels.height,raw=pixels&&pixels.data,admitted=!!(NativeBytes&&NativeBytes.isBytes(raw));
   var p=M.validateTexturePixels(mesh,key,{width:width,height:height,data:admitted?NativeBytes.copy(raw):raw});
   textureMap[key]=p;textureReplacementStorage.set(key,admitted);textureReplacements++;textureReplacementKeys.add(key);
   return {key:key,width:p.width,height:p.height,translucent:p.translucent,cutout:p.cutout,revision:textureReplacements};
  }
  function resolveAtlas(image,recheckPixels){var cached=atlasCache.get(image),pixelBacked='data' in image||!!(cached&&cached.pixelBacked);if(!cached||recheckPixels&&pixelBacked){cached={pixels:pixelsFromImage(image),pixelBacked:pixelBacked};atlasCache.set(image,cached);}return cached.pixels;}
  function snapshotPixels(texture){var width=texture.width,height=texture.height,pixels=NativeBytes.copy(texture.data);assert(pixels.length===width*height*4,'native source bytes dimensions differ');return pixelsFromImage({width:width,height:height,data:pixels});}
  function render(input){return renderTransaction(input,null);}
  function renderTransaction(input,request){
   revokeExitFrame();assert(Number.isSafeInteger(++renderSequence),'renderer invocation capacity');
   if(request&&lastCamera)assert(sameEffectiveCamera(snapshotEffectiveCamera(lastCamera),effectiveCamera),'changed stored effective renderer camera');
   var saved={effectiveCamera,history:history,lastHeader:lastHeader,lastFrame:lastFrame,lastCamera:lastCamera,lastStats:lastStats,followHeld:followHeld,lastPerspectiveAngle:lastPerspectiveAngle,
    lightSelection:lightSelection,lastLightHeader:lastLightHeader,lastLightFrame:lastLightFrame,lightState:lightState,atlasCache:atlasCache};
   try{
    history=history&&history.fork();lightSelection=lightSelection&&lightSelection.fork();atlasCache=new Map(atlasCache);
    const result=renderFrame(input,request);
    if(request){const r=request.frameRecord;assert(r,'preset4 frame was not prepared');r.validate();result.exitIndicator=Object.freeze({binding:request.binding,fieldToken:request.fieldToken,drawToken:request.drawToken,frame:r.frame,expected:r.expected,view:r.publicRecord.view,descriptor:r.publicRecord.descriptor});r.status='completed';exitFrame=null;completedFields.set(result,{request,epoch:fieldEpoch,sequence:renderSequence,camera:effectiveCamera});}
    return result;
   }catch(error){
    effectiveCamera=saved.effectiveCamera;revokeExitFrame();history=saved.history;lastHeader=saved.lastHeader;lastFrame=saved.lastFrame;lastCamera=saved.lastCamera;lastStats=saved.lastStats;followHeld=saved.followHeld;lastPerspectiveAngle=saved.lastPerspectiveAngle;
    lightSelection=saved.lightSelection;lastLightHeader=saved.lastLightHeader;lastLightFrame=saved.lastLightFrame;lightState=saved.lightState;atlasCache=saved.atlasCache;
    if(request&&request.drawToken){try{request.b.manager.abort(request.drawToken);}catch(cleanup){throw new AggregateError([error,cleanup],'Field render failed; exact draw cleanup also rejected');}}
    throw error;
   }
  }
  function NativePondAuditKey(){return NativePondAudit.key;}
  function verifyNeighborTexture(texture,key){if(key===NativeSeaAudit.key)return NativeSeaAudit.verify(texture,key);return NativePerspectiveAudit.records.some(function(record){return record.key===key;})?NativeAnimationAudit.verify(texture,key):NativeNeighborAudit.verify(texture,key);}
  function renderFrame(input,request){
   assert(!disposed,'renderer disposed');finite3(input.target,'target');assert(Number.isSafeInteger(input.frameIndex),'frameIndex must be a safe integer');
   var selected=M.resolveScene(mesh,input.header),preset=mesh.camera.presets.find(function(p){return p.index===selected.scene.camera_preset;});assert(preset,'missing source preset');
   var rasterPipeline=input.rasterPipeline||options.rasterPipeline||'legacy-float-triangles',renderTextures=textureMap;
   var renderTextureAudits=new Map();
   function auditedNeighborTexture(texture,key){var old=renderTextureAudits.get(texture);if(old&&old.key===key)return old.result;var result=verifyNeighborTexture(texture,key);renderTextureAudits.set(texture,{key:key,result:result});return result;}
   assert(rasterPipeline==='legacy-float-triangles'||rasterPipeline==='native-ortho-static-diagnostic'||rasterPipeline==='native-ortho-actor-diagnostic'||rasterPipeline==='native-perspective-scene-diagnostic'||rasterPipeline==='native-perspective-door-diagnostic'||rasterPipeline==='native-perspective-pond-diagnostic'||rasterPipeline==='native-perspective-door-camera-diagnostic'||rasterPipeline==='native-perspective-door-camera-pond-diagnostic'||rasterPipeline==='native-perspective-animation-diagnostic'||rasterPipeline==='native-ortho-animation-diagnostic'||rasterPipeline==='native-perspective-door-camera-animation-diagnostic'||rasterPipeline==='native-perspective-neighbor-sea-diagnostic'||rasterPipeline==='native-ortho-neighbor-sea-diagnostic'||rasterPipeline==='native-perspective-streamed-neighbor-sea','unsupported rasterPipeline');
   var nativeStreamedNeighbor=rasterPipeline==='native-perspective-streamed-neighbor-sea',nativeNeighborPerspective=nativeStreamedNeighbor||rasterPipeline==='native-perspective-neighbor-sea-diagnostic',nativeNeighbor=nativeNeighborPerspective||rasterPipeline==='native-ortho-neighbor-sea-diagnostic',neighborSelection=null,neighborSubmission=null,neighborGeneration=null;
   assert(nativeNeighbor===neighborGraph,'neighbor graph requires its explicit native mode');
   if(nativeStreamedNeighbor){
    assert(input.neighborSelection===undefined,'streamed neighbor mode rejects stationary selection');
    if(typeof module==='object'&&module.exports&&typeof require==='function'){if(!NativeNeighborLoader)NativeNeighborLoader=require('./source-native-neighbor-loader.js');}
    else{assert(BrowserNeighborLoader&&typeof BrowserNeighborLoader.describeSubmission==='function'&&typeof BrowserNeighborLoader.verifySubmission==='function','native neighbor loader source gate is not loaded');NativeNeighborLoader=BrowserNeighborLoader;}
    assert(NativeNeighborLoader&&typeof NativeNeighborLoader.describeSubmission==='function'&&typeof NativeNeighborLoader.verifySubmission==='function','native neighbor loader source gate is not loaded');
    neighborGeneration=input.neighborGeneration;neighborSubmission=NativeNeighborLoader.describeSubmission(input.neighborSubmission,neighborGeneration);
   }else{
    assert(input.neighborSubmission===undefined&&input.neighborGeneration===undefined,'streamed neighbor submission requires its explicit native mode');
    if(nativeNeighborPerspective)neighborSelection=NativeNeighborAudit.resolveSelection(input.neighborSelection);else assert(input.neighborSelection===undefined,'neighbor selection requires the explicit town neighbor mode');
   }
   var nativeCameraAnimation=nativeNeighborPerspective||rasterPipeline==='native-perspective-door-camera-animation-diagnostic',nativeAnimation=nativeNeighbor||nativeCameraAnimation||rasterPipeline==='native-perspective-animation-diagnostic'||rasterPipeline==='native-ortho-animation-diagnostic',animationState=null,nativeCameraPond=rasterPipeline==='native-perspective-door-camera-pond-diagnostic',nativeCamera=nativeCameraAnimation||nativeCameraPond||rasterPipeline==='native-perspective-door-camera-diagnostic',nativeCameraContext,nativePond=nativeCameraPond||rasterPipeline==='native-perspective-pond-diagnostic',pondFrame=null,nativeDoors=rasterPipeline==='native-perspective-animation-diagnostic'||nativeCamera||nativePond||rasterPipeline==='native-perspective-door-diagnostic',nativePerspective=nativeDoors||rasterPipeline==='native-perspective-scene-diagnostic',nativeActors=nativeAnimation||nativePerspective||rasterPipeline==='native-ortho-actor-diagnostic',nativeMode=nativeActors||rasterPipeline==='native-ortho-static-diagnostic',nativeEntries=[],nativeResult=null;
   var effects=input.effects===undefined?[]:input.effects;assert(Array.isArray(effects),'scene effects array required');
   if(effects.length){assert(nativeActors&&Exclamation&&((!nativePerspective&&[413,414].includes(Number(input.header)))||(nativePerspective&&Number(input.header)===411)),'command75 effects require the exact admitted native scene pipeline');effects.forEach(function(effect){Exclamation.verifyDescriptor(effect,Number(input.header));});}
   if(nativeMode){
    assert(Native,'load source-native-ortho.js for explicit diagnostic use');
    if(nativePerspective){assert(Number(input.header)===411&&preset.index===0&&preset.projection_type===0,'native perspective diagnostic requires town preset0');assert(JSON.stringify(preset.eye_minus_target_fx32)==='[0,2340897,1404538]'&&preset.eye_minus_target.every(function(v,i){return v===preset.eye_minus_target_fx32[i]/4096;})&&JSON.stringify(preset.angle_u16)==='[54786,0,0]','native perspective requires exact audited preset0 view');}
    else {assert(preset.index===4&&preset.projection_type===1,'native diagnostic requires orthographic preset4');
    assert(JSON.stringify(preset.eye_minus_target_fx32)==='[0,4906382,4108977]'&&preset.eye_minus_target.every(function(v,i){return v===preset.eye_minus_target_fx32[i]/4096;})&&JSON.stringify(preset.angle_u16)==='[56418,0,0]','native diagnostic requires exact audited preset4 view');}
    if(!nativeActors)assert(!(input.actors&&input.actors.length),'native diagnostic rejects actors, including hidden actors');
    else {
     if(typeof module==='object'&&module.exports&&typeof require==='function'){
      if(!NativeBytes)NativeBytes=require('./source-native-bytes.js');if(!NativeActorAudit)NativeActorAudit=require('./source-native-actor-audit.js');if((nativePerspective||nativeAnimation)&&!NativePerspectiveAudit)NativePerspectiveAudit=require('./source-native-perspective-audit.js');if((nativePond||nativeNeighbor)&&!NativePondAudit)NativePondAudit=require('./source-native-pond-audit.js');if(nativeAnimation&&!NativeAnimationAudit)NativeAnimationAudit=require('./source-native-animation-audit.js');
     }else{
      assert(options.nativeBrowserDiagnostic==='source-bytes-v1','native actor byte verification is an offline Node diagnostic unless the bounded source-bytes-v1 browser fixture is explicitly selected; normal host integration is not enabled');
      assert(BrowserActorAudit&&typeof BrowserActorAudit.verify==='function','native actor source-byte gate is not loaded');
      if(nativePerspective||nativeAnimation)assert(BrowserPerspectiveAudit&&typeof BrowserPerspectiveAudit.verify==='function','native perspective source-byte gate is not loaded');
      if(nativePond||nativeNeighbor)assert(BrowserPondAudit&&typeof BrowserPondAudit.verify==='function'&&typeof BrowserPondAudit.verifyTextures==='function','native pond source-byte gate is not loaded');
      if(nativeAnimation)assert(BrowserAnimationAudit&&typeof BrowserAnimationAudit.verify==='function'&&typeof BrowserAnimationAudit.verifyTextures==='function','native animation source-byte gate is not loaded');
      assert(BrowserBytes&&typeof BrowserBytes.copy==='function','native portable byte verifier is not loaded');
      NativeActorAudit=BrowserActorAudit;NativePerspectiveAudit=BrowserPerspectiveAudit;NativePondAudit=BrowserPondAudit;NativeBytes=BrowserBytes;NativeAnimationAudit=BrowserAnimationAudit;
     }
    }
    if(nativeCamera)assert(options.history!==false,'native camera diagnostic requires source follow history');
    assert((nativeCamera||input.cameraOverride===undefined)&&(nativeDoors||input.instanceOverrides===undefined),'native diagnostic rejects camera/animation overrides');
    assert(options.clearColor===undefined,'native diagnostic requires source clear state');
    textureReplacementStorage.forEach(function(admitted){assert(admitted,'native texture replacement requires unshared RGBA8 byte storage');});
    if(nativePerspective||nativeAnimation){renderTextures={};Object.keys(textureMap).forEach(function(key){renderTextures[key]=snapshotPixels(textureMap[key]);});}
    if(nativeNeighbor){
     assert(Object.keys(renderTextures).length===Object.keys(mesh.textures).length&&Object.keys(mesh.textures).every(function(key){return Object.hasOwn(renderTextures,key);}), 'native neighbor exact source texture set');
     textureReplacementKeys.forEach(function(key){assert(key===NativeAnimationAudit.key||key===NativePondAuditKey()||key===NativeSeaAudit.key,'native neighbor rejects unsupported replacement target');});
     Object.keys(mesh.textures).forEach(function(key){auditedNeighborTexture(renderTextures[key],key);});
     animationState={pondFrame:auditedNeighborTexture(renderTextures[NativePondAuditKey()],NativePondAuditKey()).pondFrame,tvFrame:auditedNeighborTexture(renderTextures[NativeAnimationAudit.key],NativeAnimationAudit.key).tvFrame,seaFrame:auditedNeighborTexture(renderTextures[NativeSeaAudit.key],NativeSeaAudit.key).seaFrame};
    }else if(nativeAnimation)animationState=NativeAnimationAudit.verifyTextures(renderTextures,textureReplacementKeys,mesh);else if(nativePond)pondFrame=NativePondAudit.verifyTextures(renderTextures,textureReplacementKeys);else assert(textureReplacements===0,'native diagnostic rejects texture replacements without source format audit');
    Native.validateState(input.nativeState||options.nativeState);
   }
   var instanceOverrides=M.resolveInstanceOverrides(selected.scene,input.instanceOverrides);
   var pixelPipeline=input.pixelPipeline||options.pixelPipeline||'rgb6-reference';assert(pixelPipeline==='rgb6-reference'||pixelPipeline==='legacy-float','unsupported pixelPipeline');
   var edgeMode=input.edgeMarking||options.edgeMarking||'source',edgeState=edgeStateFor(edgeAudit,Number(input.header),edgeMode);
   if(nativeMode)assert(pixelPipeline==='rgb6-reference'&&edgeState,'native diagnostic requires RGB6/source edge audit');
   var mode=input.lightingMode||options.lightingMode||'integer-ds-reference';assert(mode==='unlit'||mode==='integer-ds-reference','unsupported lighting mode');
   var seconds=input.lightingSecondsOfDay===undefined?options.lightingSecondsOfDay:input.lightingSecondsOfDay;
   if(mode!=='unlit')assert(Number.isSafeInteger(seconds)&&seconds>=0&&seconds<86400,'explicit lightingSecondsOfDay0..86399 required');
   if(nativeActors)(input.actors||[]).forEach(function(a){assert(Object.keys(a).every(function(k){return ['id','atlas','atlasKey','nativeTexture','model','position','facingVector','offset2','offset3','frame','hidden'].includes(k);}), 'native actor unsupported runtime field');});
   var actors=(input.actors||[]).filter(function(a){return !a.hidden;}).map(function(a,actorIndex){
    var image=a.atlas||spriteImages[a.atlasKey||a.id];assert(image,'missing actor atlas');var texture=resolveAtlas(image,nativeActors),sourceFrame=a.frame||{x:0,y:0},frame=nativeActors?{x:sourceFrame.x,y:sourceFrame.y}:sourceFrame;if(nativeActors)texture=snapshotPixels(texture);assert(Number.isInteger(frame.x)&&Number.isInteger(frame.y)&&frame.x>=0&&frame.y>=0&&frame.x+32<=texture.width&&frame.y+32<=texture.height,'actor frame must fit32x32 within atlas');
    var key=a.model||mesh.character.model;assert(resources[key]&&resources[key].every(function(b){return b.billboard==='full';}),'unverified actor model');var audit=nativeActors?NativeActorAudit.verify(texture,a.nativeTexture,frame):null;return {actor:a,actorIndex:actorIndex,texture:texture,frame:frame,key:key,audit:audit,position:nativeActors?Native.actorPosition(a).map(function(x){return x/4096;}):M.actorPosition(a)};
   });
   advanceCamera(input);
   if(nativeMode){
    var admittedProjection=M.projection(preset),admittedEffects=M.characterProjection(admittedProjection);
    if(nativeCamera){
     var expectedCamera=M.camera(preset,lastCamera.target),expectedViewProjection=M.multiply(lastCamera.projection,expectedCamera.view);
     assert(lastCamera.preset===preset.index&&lastCamera.eye.length===3&&expectedCamera.eye.every(function(v,i){return v===lastCamera.eye[i];})&&lastCamera.view.length===16&&expectedCamera.view.every(function(v,i){return v===lastCamera.view[i];})&&lastCamera.viewProjection.length===16&&expectedViewProjection.every(function(v,i){return v===lastCamera.viewProjection[i];}),'native camera diagnostic rejects corrupted effective view state');
     nativeCameraContext=Native.admitCamera({header:Number(input.header),preset:lastCamera.preset,perspectiveAngleU16:lastCamera.perspectiveAngleU16,holdFollow:followHeld,target:lastCamera.target,projectionFx12:lastCamera.projection.map(function(x){return x*4096;}),effectsProjectionFx12:lastCamera.spriteProjection.map(function(x){return x*4096;})});
    }else assert(!followHeld&&lastCamera.perspectiveAngleU16===(nativePerspective?1473:null)&&lastCamera.projection.length===admittedProjection.length&&lastCamera.spriteProjection.length===admittedEffects.length&&lastCamera.projection.every(function(v,i){return v===admittedProjection[i];})&&lastCamera.spriteProjection.every(function(v,i){return v===admittedEffects[i];}),'native diagnostic rejects effective stored camera override or held follow; resetCamera to the admitted preset');
   }
   var admittedExitFrame=prepareExitFrame(input,request,preset,nativeActors,nativePerspective);
   if(mode==='unlit'){lightSelection=null;lightState=null;lastLightFrame=null;lastLightHeader=null;}
   else if(!lightSelection||lastLightHeader!==Number(input.header)||input.resetLighting){lightSelection=Lighting.createSelection(tables,data.lighting.header_groups[String(input.header)],seconds);lightState=lightSelection.current();lastLightHeader=Number(input.header);lastLightFrame=input.frameIndex;}
   else if(lastLightFrame!==input.frameIndex){lightState=lightSelection.update(seconds);lastLightFrame=input.frameIndex;}
   var started=typeof performance!=='undefined'?performance.now():Date.now(),cam=lastCamera,opaque=[],transparent=[],stagedShades=new Map();
   var stats={pixelPipeline:pixelPipeline,edgeMarking:edgeState?(edgeState.enabled?'source':'off'):'unavailable',edgeBoundaryModel:'original-polygon/float-cardinal-sample',edgeMarkedPixels:0,edgeBoundaryPixels:0,edgeLowerLayerPixels:0,backend:'cpu-source-mesh',header:Number(input.header),scene:selected.key,cameraPreset:preset.index,perspectiveAngleU16:cam.perspectiveAngleU16,cameraFollowHeld:followHeld,frameIndex:input.frameIndex,drawCalls:0,triangles:0,rasterizedTriangles:0,clippedInputTriangles:0,transparentDraws:0,untexturedDraws:0,effectPassDraws:0,actors:actors.length,testedPixels:0,drawnPixels:0,depthRejectedPixels:0,litNormalVertices:0,explicitColorVertices:0,lighting:lightState?Lighting.mode:'unlit',lightingGroup:lightState?lightState.group:null,lightingRecord:lightState?lightState.index:null,lightingSecondsOfDay:lightState?lightState.secondsOfDay:null,specular:'integer reference implemented',instanceOverrides:Object.keys(instanceOverrides).length,textureReplacements:textureReplacements};
   function enqueue(call){call.state=Core.math.materialState(call.batch.material,call.texture);call.depth=nativeMode?0:-M.transform(cam.view,call.center)[2];call.order=opaque.length+transparent.length;(call.state.translucent?transparent:opaque).push(call);}
   function enqueueScene(c,neighborSource){var o=instanceOverrides[c.instanceIndex],matrix=o?o.matrix:c.matrix;enqueue({instanceIndex:c.instanceIndex,batch:c.batch,matrix:matrix,worldFx12:o&&o.worldFx12,center:o?M.transform(matrix,c.batch.centroid).slice(0,3):c.center,projectionPass:c.projectionPass,texture:renderTextures[c.batch.material.texture],frame:null,neighborSource:neighborSource});}
   if(nativeNeighborPerspective){
    (nativeStreamedNeighbor?neighborSubmission.entries:neighborSelection.slots).forEach(function(slot){var translation=nativeStreamedNeighbor?slot.translationFx12.map(function(v){return v/4096;}):slot.translation_relative_town,source={slot:slot.slot,matrixIndex:slot.index,matrixCell:[slot.x,slot.z],land:slot.land,translation:translation};
     if(nativeStreamedNeighbor){source.bufferId=slot.bufferId;source.bufferIdentity=slot.bufferIdentity;source.materialPhase=slot.materialPhase;source.materialFlags=slot.materialFlags;source.modelKey=slot.modelKey;}
     if(slot.land===0){scenes[selected.key].filter(function(c){return c.instanceIndex<=8;}).forEach(function(c){enqueueScene(c,Object.assign({},source,{kind:c.instanceIndex===0?'land':'building',canonicalInstanceIndex:c.instanceIndex}));});}
     else{var matrix=M.instanceMatrix({translation:translation});resources[nativeStreamedNeighbor?slot.modelKey:'land-'+String(slot.land).padStart(4,'0')].forEach(function(batch){enqueueScene({instanceIndex:12+slot.index,batch:batch,matrix:matrix,center:M.transform(matrix,batch.centroid).slice(0,3),projectionPass:'world'},Object.assign({},source,{kind:'land',canonicalInstanceIndex:null}));});}
    });
    scenes[selected.key].filter(function(c){return c.instanceIndex>=9;}).forEach(function(c){enqueueScene(c,{kind:'effect',canonicalInstanceIndex:c.instanceIndex});});
   }else scenes[selected.key].forEach(function(c){enqueueScene(c);});
   actors.forEach(function(a){var matrix=nativeActors?M.identity():M.billboardMatrix(cam.view,a.position);if(nativeActors)matrix.splice(12,3,...a.position);resources[a.key].forEach(function(b){enqueue({actor:nativeActors,actorIndex:a.actorIndex,actorPositionFx12:nativeActors?a.position.map(function(x){return x*4096;}):null,textureFormat:a.audit&&a.audit.format,batch:b,matrix:matrix,center:M.transform(matrix,b.centroid).slice(0,3),projectionPass:'effects',texture:a.texture,frame:a.frame});});});
   var clear=options.clearColor||[0,0,0,1];clearTarget(target,clear.map(function(x){return Math.round(x*255);}),edgeState);
   function draw(call){
    var batch=call.batch,state=call.state;if((nativePerspective||nativeAnimation)&&!call.actor&&call.texture)call.textureFormat=(nativeNeighbor?auditedNeighborTexture(call.texture,batch.material.texture):(nativeAnimation?NativeAnimationAudit:nativePond?NativePondAudit:NativePerspectiveAudit).verify(call.texture,batch.material.texture)).format;if(state.cull==='both'&&!nativeMode)return;
    var vertices=batch.vertices,materialPhase=call.neighborSource&&call.neighborSource.materialPhase;
    if(materialPhase&&call.neighborSource.kind==='land')assert(Lighting.flagsFromRaw(batch.material)===0x1fce&&batch.lightingMaterial.raw_flags===0x1fce&&batch.lightingMaterial.runtime_flags===0x190e&&call.neighborSource.modelKey===batch.nativeKey&&((materialPhase==='raw_local_rgb'&&call.neighborSource.materialFlags===0x1fce)||(materialPhase==='global_rgb'&&call.neighborSource.materialFlags===0x190e)),'streamed neighbor source material flags differ');
    if(lightState&&batch.colorSource==='normal'){
     var key=preset.index+':'+lightState.group+':'+lightState.index+':'+[0,1,2,4,5,6,8,9,10].map(function(i){return call.matrix[i];}).join(',')+(materialPhase?':'+call.neighborSource.bufferIdentity+':'+materialPhase:'');
     var cached=stagedShades.get(batch)||batch;
     if(cached.shadingKey!==key){cached={shadingKey:key,shaded:Lighting.shadeVertices(vertices,'normal',materialPhase==='raw_local_rgb'?Lighting.resolveMaterial(batch.material,lightState.record,'embedded'):Lighting.resolveAuditedMaterial(batch.lightingMaterial,lightState.record),lightState.record,call.matrix,{viewFx12:Lighting.sourceViewFx12(preset.index),worldFx12:call.worldFx12,normalMatrixFx12:batch.billboard==='full'?Lighting.identityFx12():undefined})};stagedShades.set(batch,cached);}
     vertices=cached.shaded;stats.litNormalVertices+=batch.count;
    }else if(batch.colorSource==='color')stats.explicitColorVertices+=batch.count;
    var projection=call.projectionPass==='effects'?cam.spriteProjection:cam.projection,mvp=nativeMode?null:M.multiply(projection,M.multiply(cam.view,call.matrix));
    var mat={pixelPipeline:pixelPipeline,polygonId:(batch.material.polygon_attributes>>>24)&63,alpha:state.alpha,translucent:state.translucent,depthWrite:state.depthWrite,depthEqual:state.depthEqual,cull:state.cull,repeatS:batch.material.repeat_s,repeatT:batch.material.repeat_t,flipS:batch.material.flip_s,flipT:batch.material.flip_t};
    stats.drawCalls++;stats.triangles+=batch.count/3;if(state.translucent)stats.transparentDraws++;if(!call.texture)stats.untexturedDraws++;if(call.projectionPass==='effects')stats.effectPassDraws++;
    function transformedVertex(k){var x=vertices[k],y=vertices[k+1],z=vertices[k+2];return [mvp[0]*x+mvp[4]*y+mvp[8]*z+mvp[12],mvp[1]*x+mvp[5]*y+mvp[9]*z+mvp[13],mvp[2]*x+mvp[6]*y+mvp[10]*z+mvp[14],mvp[3]*x+mvp[7]*y+mvp[11]*z+mvp[15],vertices[k+3],vertices[k+4],pixelPipeline==='rgb6-reference'?sourceColor9(vertices[k+8]):vertices[k+8],pixelPipeline==='rgb6-reference'?sourceColor9(vertices[k+9]):vertices[k+9],pixelPipeline==='rgb6-reference'?sourceColor9(vertices[k+10]):vertices[k+10]];}
    if(nativeMode){const nativeEntry={actor:call.actor,actorIndex:call.actorIndex,actorPositionFx12:call.actorPositionFx12,textureFormat:call.textureFormat,frame:call.frame,key:batch.nativeKey,mi:batch.nativeModel,bi:batch.nativeBatch,scale:batch.nativeScale,instanceIndex:call.instanceIndex,neighborSource:call.neighborSource,originalOrder:call.order,matrix:call.matrix,worldFx12:call.worldFx12,projectionPass:call.projectionPass,billboard:batch.billboard,vertices:vertices,geometryVertices:batch.vertices,material:call.actor?Object.assign({},batch.material,{polygon_attributes:batch.material.polygon_attributes|32768}):batch.material,texture:call.texture,topology:batch.edgeTopology};nativeEntries.push(neighborGraph?Native.captureSourceEntry(nativeEntry):nativeEntry);return;}
    var boundaries=edgeState?batch.edgeTopology.original_polygons.map(function(p){return preparePolygonBoundary(p.boundary_vertices.map(function(v){return transformedVertex(v*11);}),W,H);}):null;
    for(var i=0;i<vertices.length;i+=33){
     mat.polygonBoundary=boundaries&&boundaries[batch.edgeTopology.triangle_polygon_indices[i/33]];
     var tri=[];for(var v=0;v<3;v++)tri.push(transformedVertex(i+v*11));
     var code=clipCode(tri[0])|clipCode(tri[1])|clipCode(tri[2]);if(code)stats.clippedInputTriangles++;
     var clipped=clipTriangle(tri[0],tri[1],tri[2]);for(var t=0;t<clipped.length;t++)rasterizeTriangle(target,clipped[t],mat,call.texture,call.frame,stats);
    }
   }
   opaque.forEach(draw);transparent.sort(function(a,b){return b.depth-a.depth||a.order-b.order;}).forEach(draw);
   if(nativeMode){
    var effectOrder=nativeEntries.reduce(function(n,e){return Math.max(n,e.originalOrder+1);},0);
    if(admittedExitFrame&&admittedExitFrame.publicRecord.descriptor){admittedExitFrame.validate();nativeEntries.push(ExitNative.nativeEntry(admittedExitFrame.publicRecord.descriptor,admittedExitFrame.publicRecord.expectedDraw,effectOrder++));stats.drawCalls++;stats.triangles+=2;stats.explicitColorVertices+=6;stats.effectPassDraws++;}
    effects.forEach(function(effect,i){nativeEntries.push(Exclamation.nativeEntry(effect,Number(input.header),effectOrder+i));stats.drawCalls++;stats.triangles+=2;stats.explicitColorVertices+=6;stats.effectPassDraws++;});
    if(nativeStreamedNeighbor)NativeNeighborLoader.verifySubmission(neighborSubmission,neighborGeneration);
    nativeResult=Native.render(cam.target,nativeEntries,edgeState,input.nativeState||options.nativeState,stats,nativeActors,nativePerspective,nativeDoors,nativeCameraContext,admittedExitFrame&&admittedExitFrame.frame,admittedExitFrame&&admittedExitFrame.expected);
    if(nativeAnimation){nativeResult.limits=nativeCameraAnimation?Native.cameraAnimationLimits:NativeAnimationAudit.limits;nativeResult.pondFrame=animationState.pondFrame;nativeResult.tvFrame=animationState.tvFrame;stats.pondFrame=animationState.pondFrame;stats.tvFrame=animationState.tvFrame;}
    if(nativeNeighbor){nativeResult.limits=NativeNeighborAudit.limits;nativeResult.seaFrame=animationState.seaFrame;stats.seaFrame=animationState.seaFrame;nativeResult.neighborSelection=neighborSelection;stats.neighborQuadrant=neighborSelection?neighborSelection.quadrant:null;if(nativeStreamedNeighbor){nativeResult.limits=Object.freeze(Native.cameraAnimationLimits.concat(NativeNeighborLoader.limits));nativeResult.neighborSubmission=neighborSubmission;stats.neighborQuadrant=neighborSubmission.quadrant;stats.neighborGeneration=neighborSubmission.generation;stats.neighborFieldIteration=neighborSubmission.fieldIteration;}}
    if(nativePond){nativeResult.limits=nativeCameraPond?Native.cameraPondLimits:NativePondAudit.limits;nativeResult.pondFrame=pondFrame;stats.pondFrame=pondFrame;}
    if(admittedExitFrame&&admittedExitFrame.publicRecord.descriptor)nativeResult.limits=Object.freeze(Array.from(new Set(nativeResult.limits.concat(Native.exitIndicatorLimits))));
    target.color.set(nativeResult.rgba);stats.rasterPipeline=rasterPipeline;stats.backend='cpu-'+rasterPipeline;stats.edgeBoundaryModel='original-polygon/native-FX18-span';
   }else applyEdgeMarking(target,stats);
   if(nativeStreamedNeighbor)NativeNeighborLoader.verifySubmission(neighborSubmission,neighborGeneration);
   if(admittedExitFrame)admittedExitFrame.validate();
   ctx.putImageData(imageData,0,0);stats.renderMs=(typeof performance!=='undefined'?performance.now():Date.now())-started;
   stagedShades.forEach(function(cached,batch){batch.shadingKey=cached.shadingKey;batch.shaded=cached.shaded;});
   lastStats=stats;return nativeMode?{canvas:canvas,camera:cam,stats:Object.assign({},stats),native:nativeResult}:{canvas:canvas,camera:cam,stats:Object.assign({},stats)};
  }
  function dispose(){if(disposed)return;revokeExitFrame();effectiveCamera=null;disposed=true;atlasCache.clear();textureMap={};resources={};scenes={};}
  const api={canvas:canvas,render:render,bindExitIndicator,renderField,revokeExitIndicatorBinding,advanceCamera:advanceCamera,replaceTexturePixels:replaceTexturePixels,resetCamera:resetCamera,dispose:dispose,summary:summary,lightingSummary:lightingSummary,limits:LIMITS,
   getDiagnostics:function(){return {edgeMarkingAvailable:!!edgeAudit,edgeMarking:lastStats&&lastStats.edgeMarking,backend:'cpu-source-mesh',disposed:disposed,textureReplacements:textureReplacements,cameraOverride:{perspectiveAngleU16:lastCamera&&lastCamera.perspectiveAngleU16,holdFollow:followHeld},stats:lastStats&&Object.assign({},lastStats),camera:lastCamera,history:history&&history.snapshot(),lightingState:lightState,lightingLimits:Lighting.limits,limits:LIMITS};},
   project:function(p,biased){assert(!(lastStats&&/^native-(?:ortho|perspective)-/.test(lastStats.rasterPipeline)),'legacy float project helper is unavailable for native diagnostic');assert(lastCamera,'render first');return M.project(lastCamera,p,!!biased);}};
  fieldRenderers.set(api,{renderField,revokeBinding:revokeExitIndicatorBinding,verify(result,binding,fieldToken,manager){const c=completedFields.get(result);assert(c&&c.epoch===fieldEpoch&&c.sequence===renderSequence&&c.camera===effectiveCamera,'foreign, stale or revoked completed field result');const q=c.request,b=bindingRecord(binding);assert(q.binding===binding&&q.b===b&&q.fieldToken===fieldToken&&b.manager===manager,'crossed completed field result');Fields.verifyPreparedField(b.bridge,fieldToken);b.manager.preflightCommit(q.drawToken);assert(sameEffectiveCamera(snapshotEffectiveCamera(lastCamera),c.camera),'mutated completed field camera');return q.drawToken;}});return api;
 }
 function createWithImages(canvas,data,images,sprites,options){var pixels={};Object.keys(images).forEach(function(k){pixels[k]=pixelsFromImage(images[k]);});return createWithPixels(canvas,data,pixels,sprites,options);}
 function decodeRGBA(item){var binary=atob(item.rgba_base64),pixels=new Uint8ClampedArray(binary.length);for(var i=0;i<binary.length;i++)pixels[i]=binary.charCodeAt(i);assert(pixels.length===item.width*item.height*4,'invalid embeddedRGBA size');return {width:item.width,height:item.height,data:pixels};}
 function create(canvas,data,sprites,options){
  if(data.textureRGBA)return Promise.resolve().then(function(){var pixels={};Object.keys(data.textureRGBA).forEach(function(k){pixels[k]=decodeRGBA(data.textureRGBA[k]);});return createWithPixels(canvas,data,pixels,sprites,options);});
  return Core.loadTextures(data).then(function(images){return createWithImages(canvas,data,images,sprites,options);});
 }
 function verifyFieldRenderer(renderer){assert(fieldRenderers.has(renderer),'unadmitted field renderer');return true;}
 function revokeOwnedFieldBinding(renderer,binding){verifyFieldRenderer(renderer);return fieldRenderers.get(renderer).revokeBinding(binding);}
 function renderOwnedField(renderer,input,binding,fieldToken,advance){verifyFieldRenderer(renderer);return fieldRenderers.get(renderer).renderField(input,binding,fieldToken,advance);}
 function verifyCompletedField(renderer,result,binding,fieldToken,manager){verifyFieldRenderer(renderer);return fieldRenderers.get(renderer).verify(result,binding,fieldToken,manager);}
 return {verifyFieldRenderer,verifyCompletedField,renderOwnedField,revokeOwnedFieldBinding,create:create,createWithImages:createWithImages,createWithPixels:createWithPixels,verifyExitIndicatorFrame,limits:LIMITS,backend:'cpu-source-mesh',
  math:M,pixels:{sourceColor9:sourceColor9,color9To6:color9To6,color5To6:color5To6,color6To8:color6To8,modulate6:modulate6,modulateAlpha5:modulateAlpha5,blend6:blend6,textureAlpha5:textureAlpha5,sourceFragment:sourceFragment},raster:{createTarget:createTarget,clearTarget:clearTarget,clipTriangle:clipTriangle,clipCode:clipCode,screenVertex:screenVertex,rasterizeTriangle:rasterizeTriangle,address:address,pixelsFromImage:pixelsFromImage,decodeRGBA:decodeRGBA,clipPolygon:clipPolygon,preparePolygonBoundary:preparePolygonBoundary,polygonBoundaryFlags:polygonBoundaryFlags,validateEdgeAudit:validateEdgeAudit,edgeStateFor:edgeStateFor,applyEdgeMarking:applyEdgeMarking}};
});
