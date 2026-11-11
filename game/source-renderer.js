/* Separate source-lighting candidate. Integer lighting reference with explicit matrix/raster limits. Not DS GPU emulation.
 * No fetch, dependency, DOM insertion, animation loop, or game-state mutation.
 * Browser: SourceRenderer. Node: require('./source-renderer.js'). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./source-lighting.js'));
  else root.SourceRenderer = factory(root.SourceLighting);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Lighting) {
  'use strict';
  var WIDTH = 256, HEIGHT = 192, ASPECT = 5461 / 4096, STRIDE = 11;
  var LIMITS = Object.freeze([
    'Integer lighting arithmetic follows supplied melonDS reference, including specular; position matrix and pixel pipeline limits remain. No hardware color-parity claim.',
    'WebGL geometry, texture modulation and pixel interpolation are not DS fixed-point GPU emulation.',
    'Transparent batches use stable far-to-near center sorting, not the source-requested DS automatic polygon ordering.',
    'Only exact building-0067 door poses, fourteen source door-camera projections/follow hold and explicit texture replacement are supported; scheduling belongs to the caller.',
    'The common 32-unit billboard is proven for male walking; Pokemon-specific geometry is not established.',
    'Caller must supply facingVector and two runtime offsets when active state requires them.',
    'Caller must supply terrain Y and native 32x32 sprite-frame coordinates.',
    'GPU winding, alpha/depth, foot registration, seams and recording still require browser acceptance.'
  ]);
  function assert(ok, message) { if (!ok) throw new Error('SourceRenderer: ' + message); }
  function vec3(v, name) { assert(v && v.length === 3 && Array.from(v).every(Number.isFinite), name + ' must be a finite XYZ vector'); return v; }
  function add(a, b) { return [a[0]+b[0], a[1]+b[1], a[2]+b[2]]; }
  function sub(a, b) { return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]; }
  function dot(a, b) { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }
  function cross(a, b) { return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
  function normalize(v) { var n=Math.hypot(v[0],v[1],v[2]); assert(n>0,'zero basis vector'); return v.map(function(x){return x/n;}); }
  function identity() { return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; }
  // All matrices use WebGL column-major storage; multiply(a,b) transforms by b then a.
  function multiply(a, b) {
    var out=new Array(16).fill(0);
    for(var c=0;c<4;c++) for(var r=0;r<4;r++) for(var k=0;k<4;k++) out[c*4+r]+=a[k*4+r]*b[c*4+k];
    return out;
  }
  function transform(m, p) {
    var w=p.length>3?p[3]:1;
    return [0,1,2,3].map(function(r){return m[r]*p[0]+m[4+r]*p[1]+m[8+r]*p[2]+m[12+r]*w;});
  }
  function lookAt(eye, target) {
    var z=normalize(sub(eye,target)), x=normalize(cross([0,1,0],z)), y=cross(z,x);
    return [x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0, -dot(x,eye),-dot(y,eye),-dot(z,eye),1];
  }
  function idealProjection(preset) {
    var n=preset.near, f=preset.far, cot=preset.trig_fov_cos_fx12/preset.trig_fov_sin_fx12;
    assert(n>0 && f>n && Number.isFinite(cot), 'invalid camera preset');
    if(preset.projection_type===0) return [cot/ASPECT,0,0,0, 0,cot,0,0, 0,0,-(f+n)/(f-n),-1, 0,0,-2*f*n/(f-n),0];
    assert(preset.projection_type===1, 'unsupported projection type');
    var halfY=preset.distance/cot, halfX=halfY*ASPECT;
    return [1/halfX,0,0,0, 0,1/halfY,0,0, 0,0,-2/(f-n),0, 0,0,-(f+n)/(f-n),1];
  }
  // Verified SDK fixed-point outputs, derived without executing upstream code.
  // Full source arithmetic/excerpts are in provenance/renderer-audit.json.
  var SDK_PROJECTIONS = {
    0: {distance_fx32:2731713,sin:576,cos:4055,near:150,far:900,type:0,
      raw:[21628,0,0,0, 0,28836,0,0, 0,0,-5734,-4096, 0,0,-1474560,0]},
    4: {distance_fx32:6404251,sin:251,cos:4088,near:150,far:1735,type:1,
      raw:[32,0,0,0, 0,43,0,0, 0,0,-5,0, 0,0,-4871,4096]}
  };
  function projection(preset) {
    var known=SDK_PROJECTIONS[preset.index];
    assert(known,'only verified scene camera presets 0 and 4 are supported');
    assert(preset.distance_fx32===known.distance_fx32 && preset.trig_fov_sin_fx12===known.sin && preset.trig_fov_cos_fx12===known.cos && preset.near===known.near && preset.far===known.far && preset.projection_type===known.type,
      'camera preset changed; derive and verify its SDK projection first');
    return known.raw.map(function(x){return x/4096;});
  }
  // Exact finite door-camera fixtures, no runtime angle interpolation or trigonometry.
  // door-camera.json SHA256 66104c088934ac0799b1399a94f5338bd0a22901eb9326b49ba3be44629344ef. Only town preset0/model67 transitions are audited.
  var DOOR_PROJECTIONS_FX12 = {"1365":{"world":[23407,0,0,0,0,31208,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[23407,0,0,0,0,31208,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1377":{"world":[23141,0,0,0,0,30853,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[23141,0,0,0,0,30853,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1389":{"world":[23141,0,0,0,0,30853,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[23141,0,0,0,0,30853,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1393":{"world":[22886,0,0,0,0,30513,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22886,0,0,0,0,30513,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1401":{"world":[22886,0,0,0,0,30513,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22886,0,0,0,0,30513,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1409":{"world":[22632,0,0,0,0,30174,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22632,0,0,0,0,30174,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1413":{"world":[22632,0,0,0,0,30174,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22632,0,0,0,0,30174,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1425":{"world":[22382,0,0,0,0,29841,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22382,0,0,0,0,29841,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1437":{"world":[22382,0,0,0,0,29841,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22382,0,0,0,0,29841,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1441":{"world":[22099,0,0,0,0,29464,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22099,0,0,0,0,29464,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1449":{"world":[22099,0,0,0,0,29464,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22099,0,0,0,0,29464,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1457":{"world":[21861,0,0,0,0,29146,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[21861,0,0,0,0,29146,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1461":{"world":[21861,0,0,0,0,29146,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[21861,0,0,0,0,29146,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1473":{"world":[21628,0,0,0,0,28836,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[21628,0,0,0,0,28836,0,0,0,0,-5734,-4096,0,0,-1497496,0]}};
  function resolveCameraOverride(mesh,header,preset,raw) {
    if(raw===undefined)return null;
    assert(raw&&typeof raw==='object'&&!Array.isArray(raw)&&Object.keys(raw).every(function(k){return k==='perspectiveAngleU16'||k==='holdFollow';}),'unsupported camera override');
    assert(Number(header)===411&&preset.index===0&&resolveScene(mesh,header).scene.instances.some(function(i){return i.model==='building-0067';}),'door camera override is verified only for town header411/preset0/model67');
    var angle=raw.perspectiveAngleU16===undefined?1473:raw.perspectiveAngleU16;
    assert(Number.isSafeInteger(angle)&&Object.prototype.hasOwnProperty.call(DOOR_PROJECTIONS_FX12,angle),'unknown source door perspective angle');
    assert(raw.holdFollow===undefined||typeof raw.holdFollow==='boolean','holdFollow must be boolean');
    projection(preset); // Reject a changed underlying preset before selecting a bounded fixture.
    return {perspectiveAngleU16:angle,holdFollow:!!raw.holdFollow};
  }
  function cameraWithDoorProjection(state,angle) {
    assert(state.preset===0&&Number.isSafeInteger(angle)&&Object.prototype.hasOwnProperty.call(DOOR_PROJECTIONS_FX12,angle),'unknown source door camera projection');
    if(state.perspectiveAngleU16===angle)return state;
    var f=DOOR_PROJECTIONS_FX12[angle],p=f.world.map(function(x){return x/4096;}),effects=f.effects.map(function(x){return x/4096;});
    return Object.assign({},state,{projection:p,spriteProjection:effects,viewProjection:multiply(p,state.view),perspectiveAngleU16:angle});
  }
  function characterProjection(p) { var out=p.slice(); out[14]+=4*out[10]; return out; }
  function camera(preset,target) {
    vec3(target,'camera target'); var eye=add(target,preset.eye_minus_target), view=lookAt(eye,target), proj=projection(preset);
    return {eye:eye,target:Array.from(target),view:view,projection:proj,viewProjection:multiply(proj,view),spriteProjection:characterProjection(proj),preset:preset.index,perspectiveAngleU16:preset.index===0?1473:null};
  }
  function project(cameraState, position, sprite) {
    var m=multiply(sprite?cameraState.spriteProjection:cameraState.projection,cameraState.view), v=transform(m,position);
    return {x:(v[0]/v[3]+1)*WIDTH/2, y:(1-v[1]/v[3])*HEIGHT/2, depth:(v[2]/v[3]+1)/2, w:v[3], clip:v};
  }
  function instanceMatrix(instance) {
    var t=vec3(instance.translation||[0,0,0],'instance translation'), r=vec3(instance.rotation||[0,0,0],'instance rotation'), s=vec3(instance.scale||[1,1,1],'instance scale');
    // Every verified packet instance has zero rotation; do not invent rotation units/order.
    assert(r.every(function(v){return v===0;}),'nonzero instance rotation needs a verified source convention');
    assert(s.every(function(v){return v>0;}),'non-positive instance scale is unsupported');
    return [s[0],0,0,0, 0,s[1],0,0, 0,0,s[2],0, t[0],t[1],t[2],1];
  }
  // Door v2 original samples: building-0067 node0 only. Existing mesh already includes positionScale4.
  // door-animations.json SHA256 2d57be7d01dd3d23bf4687a5d8d82634d7aa0e9c4e2d996f4f2f73c9d4a774c0; all other animation transforms fail closed.
  var DOOR_ROTATION_PAIRS = [[4096,0],[3993,911],[3690,1777],[3202,2554],[2554,3202],[1777,3690],[911,3993],[0,4096],[3896,1266],[3314,2408],[2408,3314],[1266,3896]];
  function resolveInstanceOverrides(scene, raw) {
    var out=Object.create(null); if(raw===undefined)return out;
    assert(raw&&typeof raw==='object'&&!Array.isArray(raw),'instanceOverrides must be keyed by scene instance index');
    Object.keys(raw).forEach(function(key){
      assert(/^(0|[1-9][0-9]*)$/.test(key),'instance override index must be canonical nonnegative integer');
      var index=Number(key),inst=scene.instances[index],o=raw[key];
      assert(Number.isSafeInteger(index)&&inst,'unknown scene instance index '+key);
      assert(o&&typeof o==='object'&&Object.keys(o).every(function(k){return k==='model'||k==='rotationFx12';}),'unsupported instance override field');
      assert(o.model==='building-0067'&&inst.model===o.model,'only verified building-0067 node rotation may be overridden');
      assert(inst.rotation.every(function(x){return x===0;})&&inst.scale.every(function(x){return x===1;}),'door source instance must have identity rotation/scale');
      var r=o.rotationFx12;assert(r&&r.length===9&&Array.from(r).every(Number.isSafeInteger),'rotationFx12 must contain nine integers');
      assert(r[1]===0&&r[3]===0&&r[4]===4096&&r[5]===0&&r[7]===0&&r[6]===-r[2]&&r[8]===r[0]&&DOOR_ROTATION_PAIRS.some(function(p){return p[0]===r[0]&&p[1]===r[2];}),'rotation is not an exact verified door sample');
      var fx=[r[0],r[1],r[2],0,r[3],r[4],r[5],0,r[6],r[7],r[8],0,0,0,0,4096];
      out[key]={matrix:multiply(instanceMatrix(inst),fx.map(function(x){return x/4096;})),worldFx12:fx};
    });return out;
  }
  function validateTexturePixels(mesh,key,pixels) {
    assert(typeof key==='string'&&Object.prototype.hasOwnProperty.call(mesh.textures,key),'unknown texture key '+key);
    var desc=mesh.textures[key];assert(pixels&&pixels.width===desc.width&&pixels.height===desc.height,'replacement texture dimensions must match source');
    assert((pixels.data instanceof Uint8Array||pixels.data instanceof Uint8ClampedArray)&&pixels.data.length===desc.width*desc.height*4,'replacement texture requires exact RGBA8 bytes');
    var bytes=new Uint8Array(pixels.data),partial=false,cutout=false;
    for(var i=3;i<bytes.length;i+=4){if(bytes[i]===0)cutout=true;else if(bytes[i]!==255)partial=true;}
    return {width:desc.width,height:desc.height,data:bytes,translucent:partial,cutout:cutout};
  }
  function actorPosition(actor) {
    var p=Array.from(vec3(actor.position,'actor position'));
    ['facingVector','offset2','offset3'].forEach(function(k){if(actor[k])p=add(p,vec3(actor[k],k));});
    return add(p,[0,0,6]);
  }
  function billboardMatrix(view, position) {
    // Transpose of view rotation is its inverse. Full billboard, not world-upright.
    return [view[0],view[4],view[8],0, view[1],view[5],view[9],0, view[2],view[6],view[10],0, position[0],position[1],position[2],1];
  }
  function pixelIndex(value, size, repeat, flip) {
    assert(Number.isFinite(value) && Number.isInteger(size) && size>0,'invalid texture coordinate');
    var p=Math.floor(value); if(!repeat)return Math.max(0,Math.min(size-1,p));
    var period=size*(flip?2:1); p=((p%period)+period)%period; return flip&&p>=size?period-1-p:p;
  }
  function cellToWorld(x,z,y) { assert([x,z,y].every(Number.isFinite),'invalid cell position'); return [16*x-248,y,16*z-248]; }
  // Exact source algorithm: delay Y *deltas*, not absolute target Y. First seven updates bypass history.
  function createHistory(initial) {
    var history=historyFromState();history.reset(initial);return history;
  }
  function historyFromState(state) {
    function reset(target) { vec3(target,'history target'); state={last:Array.from(target),target:Array.from(target),values:new Array(7).fill(0),read:0,write:6,enabled:false,updates:0}; return state.target.slice(); }
    function update(target) {
      vec3(target,'history target'); var delta=sub(target,state.last), dy;
      if(!state.enabled) { dy=delta[1]; if(state.read===6)state.enabled=true; } else dy=state.values[state.read];
      state.read=(state.read+1)%7; state.values[state.write]=delta[1]; state.write=(state.write+1)%7;
      state.target=add(state.target,[delta[0],dy,delta[2]]); state.last=Array.from(target); state.updates++;
      return state.target.slice();
    }
    function snapshot(){return JSON.parse(JSON.stringify(state));}
    return {reset:reset,update:update,snapshot:snapshot,fork:function(){return historyFromState({last:state.last.slice(),target:state.target.slice(),values:state.values.slice(),read:state.read,write:state.write,enabled:state.enabled,updates:state.updates});}};
  }
  function materialState(mat, textureMeta) {
    assert(mat.polygon_mode===0,'unsupported polygon mode '+mat.polygon_mode);
    assert(mat.alpha_5bit>0 && mat.alpha_5bit<=31,'wireframe alpha=0 is not implemented');
    var translucent=mat.alpha_5bit<31 || !!(textureMeta&&textureMeta.translucent);
    return {alpha:mat.alpha_5bit/31,translucent:translucent,depthWrite:!translucent||!!(mat.polygon_attributes&(1<<11)),
      depthEqual:!!(mat.polygon_attributes&(1<<14)),cull:mat.render_front?(mat.render_back?'none':'back'):(mat.render_back?'front':'both')};
  }
  function resolveScene(mesh, header) {
    var h=mesh.headers.find(function(h){return h.header===Number(header);}); assert(h,'unknown header '+header);
    assert(h.cells.length===1,'multiple map cells require explicit scene selection'); var key=String(h.cells[0].land);
    assert(mesh.scenes[key],'missing scene '+key); return {key:key,scene:mesh.scenes[key],header:h};
  }
  function validateData(data) {
    var mesh=data.mesh||data;
    assert(mesh.format===1&&mesh.vertex_stride===STRIDE,'unsupported source packet format');
    assert(mesh.camera&&mesh.character,'camera/character source data missing');
    assert(data.textureMeta,'verified texture alpha metadata required; use bundled source-data.js');
    Object.keys(mesh.textures).forEach(function(k){assert(data.textureMeta[k]&&typeof data.textureMeta[k].translucent==='boolean','missing texture alpha metadata '+k);});
    assert(Array.isArray(data.sceneInstanceProjectionOverrides),'verified event projection-pass metadata missing');
    ['event-0091','event-0092'].forEach(function(key){if(mesh.models[key])assert(data.sceneInstanceProjectionOverrides.some(function(o){return o.model===key&&o.projection_pass==='effects'&&!o.billboard&&o.additional_translation.every(function(x){return x===0;});}),'missing static event effects pass '+key);});
    var vertices=0,batches=0,untextured=0;
    Object.keys(mesh.models).forEach(function(key){
      assert(Array.isArray(mesh.models[key]),'invalid model resource '+key);
      mesh.models[key].forEach(function(m){
        m.draw_batches.forEach(function(b){
          assert(b.vertex_count%3===0&&b.vertices.length===b.vertex_count*STRIDE,'invalid triangle buffer '+key+'/'+b.name);
          assert(b.vertices.every(Number.isFinite),'non-finite geometry '+key+'/'+b.name);
          var mat=m.materials[b.material]; assert(mat,'missing material');
          if(mat.texture)assert(mesh.textures[mat.texture],'missing texture descriptor');
          materialState(mat,data.textureMeta&&data.textureMeta[mat.texture]);
          if(!mat.texture&&!mat.dynamic_character_texture)untextured++;
          vertices+=b.vertex_count;batches++;
        });
      });
    });
    Object.keys(mesh.scenes).forEach(function(k){mesh.scenes[k].instances.forEach(function(inst){assert(mesh.models[inst.model],'missing instance model');instanceMatrix(inst);});});
    return {models:Object.keys(mesh.models).length,textures:Object.keys(mesh.textures).length,scenes:Object.keys(mesh.scenes).length,triangles:vertices/3,batches:batches,untexturedBatches:untextured};
  }
  var VERTEX_SHADER = [
    'attribute vec3 aPosition;', 'attribute vec2 aUV;', 'attribute vec3 aColor;',
    'uniform mat4 uMVP;', 'varying vec2 vUV;', 'varying vec3 vColor;',
    'void main(){ gl_Position=uMVP*vec4(aPosition,1.0); vUV=aUV; vColor=aColor; }'
  ].join('\n');
  var FRAGMENT_SHADER = [
    'precision highp float;', 'varying vec2 vUV;', 'varying vec3 vColor;',
    'uniform sampler2D uTexture;', 'uniform vec2 uTextureSize;', 'uniform vec2 uRepeat;', 'uniform vec2 uFlip;',
    'uniform vec2 uFrameOrigin;', 'uniform vec2 uFrameSize;', 'uniform float uHasTexture;', 'uniform float uAlpha;',
    'float address(float p,float size,float repeatFlag,float flipFlag){',
    ' p=floor(p); if(repeatFlag<0.5)return clamp(p,0.0,size-1.0);',
    ' float period=size*(flipFlag>0.5?2.0:1.0); p=mod(p,period);',
    ' return flipFlag>0.5&&p>=size?period-1.0-p:p;', '}',
    'void main(){', ' vec4 texel=vec4(1.0);', ' if(uHasTexture>0.5){',
    '  vec2 pixel=vec2(address(vUV.x,uFrameSize.x,uRepeat.x,uFlip.x),address(vUV.y,uFrameSize.y,uRepeat.y,uFlip.y));',
    '  texel=texture2D(uTexture,(uFrameOrigin+pixel+vec2(0.5))/uTextureSize);', ' }',
    ' float alpha=texel.a*uAlpha;', ' if(alpha<=0.0)discard;',
    ' gl_FragColor=vec4(texel.rgb*vColor,alpha);', '}'
  ].join('\n');
  function imageSize(image) { return [image.naturalWidth||image.videoWidth||image.width,image.naturalHeight||image.videoHeight||image.height]; }
  function loadImage(uri) {
    assert(typeof uri==='string'&&uri.indexOf('data:image/png;base64,')===0,'texture loader accepts embedded PNG data URIs only');
    assert(typeof Image!=='undefined','browser Image constructor unavailable');
    return new Promise(function(resolve,reject){var image=new Image();image.onload=function(){resolve(image);};image.onerror=function(){reject(new Error('Embedded PNG decode failed'));};image.src=uri;});
  }
  function loadTextures(data) {
    assert(data.textureData,'embedded textureData missing; use generated source-data.js');
    var keys=Object.keys(data.mesh.textures), output={};
    return Promise.all(keys.map(function(key){return loadImage(data.textureData[key]).then(function(image){
      var size=imageSize(image), desc=data.mesh.textures[key]; assert(size[0]===desc.width&&size[1]===desc.height,'decoded texture dimensions differ: '+key); output[key]=image;
    });})).then(function(){return output;});
  }
  function compileShader(gl,type,source) {
    var s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){var reason=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error('SourceRenderer shader compilation: '+reason);} return s;
  }
  function createProgram(gl) {
    var vs=compileShader(gl,gl.VERTEX_SHADER,VERTEX_SHADER), fs;
    try {fs=compileShader(gl,gl.FRAGMENT_SHADER,FRAGMENT_SHADER);}catch(error){gl.deleteShader(vs);throw error;}
    var program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){var reason=gl.getProgramInfoLog(program);gl.deleteProgram(program);throw new Error('SourceRenderer program link: '+reason);}return program;
  }
  // Synchronous constructor for predecoded, origin-clean texture images, including test doubles.
  function createWithImages(canvas,data,textureImages,spriteImages,options) {
    options=options||{};spriteImages=spriteImages||{};assert(Lighting,'load source-lighting.js before source-renderer.js');var mesh=data.mesh||data,summary=validateData(data),disposed=false,lost=false;
    assert(canvas&&typeof canvas.getContext==='function','a dedicated canvas/OffscreenCanvas is required');
    canvas.width=WIDTH;canvas.height=HEIGHT;
    var lightingSummary=Lighting.validateAudit(data),lightingTables=Lighting.normalizeAuditTables(data.lighting);
    var gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:true,stencil:false,premultipliedAlpha:false,preserveDrawingBuffer:true});
    assert(gl,'WebGL1 unavailable; no flat-raster fallback is substituted');
    var program=createProgram(gl), attrs={}, uniforms={}, buffers=[], textures=[], imageTextures=new Map(), modelBuffers={},sceneDraws={};
    ['Position','UV','Color'].forEach(function(n){attrs[n]=gl.getAttribLocation(program,'a'+n);assert(attrs[n]>=0,'missing attribute '+n);});
    ['MVP','Texture','TextureSize','Repeat','Flip','FrameOrigin','FrameSize','HasTexture','Alpha'].forEach(function(n){uniforms[n]=gl.getUniformLocation(program,'u'+n);});
    function upload(image) {
      if(imageTextures.has(image))return imageTextures.get(image);
      var size=imageSize(image);assert(size[0]>0&&size[1]>0,'image is not decoded');
      var tex=gl.createTexture();textures.push(tex);gl.bindTexture(gl.TEXTURE_2D,tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
      if(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL!==undefined)gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
      // Shader performs repeat/mirror per source pixel; CLAMP also supports NPOT atlases in WebGL1.
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
      var item={texture:tex,width:size[0],height:size[1]};imageTextures.set(image,item);return item;
    }
    var staticTextures={},staticTextureMeta=Object.assign({},data.textureMeta),projectionOverrides={},textureReplacements=0;
    (data.sceneInstanceProjectionOverrides||[]).forEach(function(o){assert(o.projection_pass==='effects'&&o.billboard===false,'unsupported source instance pass override');projectionOverrides[o.model]=o.projection_pass;});
    function cleanup(){buffers.forEach(function(b){gl.deleteBuffer(b);});textures.forEach(function(t){gl.deleteTexture(t);});gl.deleteProgram(program);}
    try {
      Object.keys(mesh.textures).forEach(function(k){assert(textureImages[k],'missing decoded texture '+k);var sz=imageSize(textureImages[k]),desc=mesh.textures[k];assert(sz[0]===desc.width&&sz[1]===desc.height,'decoded texture dimensions differ: '+k);staticTextures[k]=upload(textureImages[k]);});
      Object.keys(mesh.models).forEach(function(key){modelBuffers[key]=[];mesh.models[key].forEach(function(model,modelIndex){model.draw_batches.forEach(function(batch,batchIndex){
        var buffer=gl.createBuffer();buffers.push(buffer);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(batch.vertices),gl.STATIC_DRAW);
        var centroid=[0,0,0];for(var i=0;i<batch.vertices.length;i+=STRIDE)for(var a=0;a<3;a++)centroid[a]+=batch.vertices[i+a]/batch.vertex_count;
        modelBuffers[key].push({buffer:buffer,count:batch.vertex_count,material:model.materials[batch.material],centroid:centroid,name:batch.name,billboard:model.billboard,baseVertices:batch.vertices,lightingMaterial:data.lighting.models[key][modelIndex].materials[batch.material],colorSource:data.lighting.models[key][modelIndex].batches[batchIndex].color_source,lightingBufferKey:'unlit'});
      });});});
      Object.keys(mesh.scenes).forEach(function(key){var list=[];mesh.scenes[key].instances.forEach(function(inst,instanceIndex){var matrix=instanceMatrix(inst);modelBuffers[inst.model].forEach(function(batch){assert(!batch.billboard,'scene billboards require runtime handling');list.push({instanceIndex:instanceIndex,batch:batch,matrix:matrix,center:transform(matrix,batch.centroid).slice(0,3),projectionPass:projectionOverrides[inst.model]||'world',order:list.length});});});sceneDraws[key]=list;});
    } catch(error) {cleanup();throw error;}
    var history=null,lastHeader=null,lastFrame=null,lastCamera=null,lastStats=null,followHeld=false,lastPerspectiveAngle=null;
    var lightSelection=null,lastLightingHeader=null,lastLightingFrame=null,lastLightingState=null;
    function contextLost(event){if(event&&event.preventDefault)event.preventDefault();lost=true;}
    if(canvas.addEventListener)canvas.addEventListener('webglcontextlost',contextLost);
    function resetCamera(header,target) {resolveScene(mesh,header);history=createHistory(target);lastHeader=Number(header);lastFrame=null;lastCamera=null;followHeld=false;lastPerspectiveAngle=null;}
    function advanceCamera(input) {
      assert(!disposed,'renderer disposed');vec3(input.target,'target');assert(Number.isSafeInteger(input.frameIndex),'frameIndex must be a safe integer simulation-update counter');
      var selected=resolveScene(mesh,input.header),preset=mesh.camera.presets.find(function(p){return p.index===selected.scene.camera_preset;});assert(preset,'missing camera preset');
      var override=resolveCameraOverride(mesh,input.header,preset,input.cameraOverride),reset=lastHeader!==Number(input.header)||input.resetCamera||!history;
      if(override&&override.holdFollow)assert(!reset&&lastCamera,'holdFollow requires an existing camera lookAt; initialize before holding');
      assert(reset||lastFrame===null||input.frameIndex>=lastFrame,'frameIndex went backwards; call resetCamera on replay/teleport');
      if(reset)resetCamera(input.header,input.target);
      if(override){if(override.holdFollow)followHeld=true;lastPerspectiveAngle=override.perspectiveAngleU16;}
      if(lastFrame!==input.frameIndex){
        // Camera_ClearFixedTarget skips the complete delta/history update, including queued Y deltas.
        if(!followHeld)lastCamera=camera(preset,options.history===false?Array.from(input.target):history.update(input.target));
        lastFrame=input.frameIndex;
      }
      if(lastPerspectiveAngle!==null)lastCamera=cameraWithDoorProjection(lastCamera,lastPerspectiveAngle);
      return lastCamera;
    }
    function replaceTexturePixels(key,pixels) {
      assert(!disposed,'renderer disposed');assert(!lost&&!(gl.isContextLost&&gl.isContextLost()),'WebGL context lost; recreate renderer');
      var p=validateTexturePixels(mesh,key,pixels),item=staticTextures[key];
      gl.bindTexture(gl.TEXTURE_2D,item.texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
      if(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL!==undefined)gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,p.width,p.height,0,gl.RGBA,gl.UNSIGNED_BYTE,p.data);
      staticTextureMeta[key]={translucent:p.translucent,cutout:p.cutout};textureReplacements++;
      return {key:key,width:p.width,height:p.height,translucent:p.translucent,cutout:p.cutout,revision:textureReplacements};
    }
    function draw(call,cam,stats) {
      var batch=call.batch, mat=batch.material, state=materialState(mat,call.textureMeta), texture=call.texture;
      if(state.cull==='both')return;
      gl.bindBuffer(gl.ARRAY_BUFFER,batch.buffer);
      if(batch.colorSource==='normal'){
        var bufferKey=call.lightingState?stats.cameraPreset+':'+call.lightingState.group+':'+call.lightingState.index+':'+[0,1,2,4,5,6,8,9,10].map(function(i){return call.matrix[i];}).join(','):'unlit';
        if(bufferKey!==batch.lightingBufferKey){
          var vertexData=call.lightingState?Lighting.shadeVertices(batch.baseVertices,batch.colorSource,Lighting.resolveAuditedMaterial(batch.lightingMaterial,call.lightingState.record),call.lightingState.record,call.matrix,{viewFx12:Lighting.sourceViewFx12(stats.cameraPreset),worldFx12:call.worldFx12,normalMatrixFx12:batch.billboard==='full'?Lighting.identityFx12():undefined}):new Float32Array(batch.baseVertices);
          gl.bufferData(gl.ARRAY_BUFFER,vertexData,gl.DYNAMIC_DRAW);batch.lightingBufferKey=bufferKey;stats.lightingBufferUpdates++;
        }
        if(call.lightingState)stats.litNormalVertices+=batch.count;
      }else stats.explicitColorVertices+=batch.count;
      [['Position',3,0],['UV',2,3],['Color',3,8]].forEach(function(a){gl.enableVertexAttribArray(attrs[a[0]]);gl.vertexAttribPointer(attrs[a[0]],a[1],gl.FLOAT,false,STRIDE*4,a[2]*4);});
      gl.uniformMatrix4fv(uniforms.MVP,false,new Float32Array(multiply(call.projectionPass==='effects'?cam.spriteProjection:cam.projection,multiply(cam.view,call.matrix))));
      gl.uniform1f(uniforms.Alpha,state.alpha);gl.uniform1f(uniforms.HasTexture,texture?1:0);
      if(texture){gl.bindTexture(gl.TEXTURE_2D,texture.texture);gl.uniform2f(uniforms.TextureSize,texture.width,texture.height);}
      var origin=call.frame?[call.frame.x,call.frame.y]:[0,0], size=call.frame?[32,32]:texture?[texture.width,texture.height]:[1,1];
      gl.uniform2f(uniforms.FrameOrigin,origin[0],origin[1]);gl.uniform2f(uniforms.FrameSize,size[0],size[1]);
      gl.uniform2f(uniforms.Repeat,call.sprite?0:+mat.repeat_s,call.sprite?0:+mat.repeat_t);gl.uniform2f(uniforms.Flip,+mat.flip_s,+mat.flip_t);
      if(state.cull==='none')gl.disable(gl.CULL_FACE);else {gl.enable(gl.CULL_FACE);gl.cullFace(state.cull==='back'?gl.BACK:gl.FRONT);}
      gl.depthFunc(state.depthEqual?gl.EQUAL:gl.LESS);gl.depthMask(state.depthWrite);
      if(state.translucent)gl.enable(gl.BLEND);else gl.disable(gl.BLEND);
      gl.drawArrays(gl.TRIANGLES,0,batch.count);stats.drawCalls++;stats.triangles+=batch.count/3;if(call.projectionPass==='effects')stats.effectPassDraws++;
      if(state.translucent)stats.transparentDraws++;if(!texture)stats.untexturedDraws++;
    }
    function render(input) {
      assert(!disposed,'renderer disposed');assert(!lost&&!(gl.isContextLost&&gl.isContextLost()),'WebGL context lost; recreate renderer');
      vec3(input.target,'target');assert(Number.isSafeInteger(input.frameIndex),'frameIndex must be a safe integer simulation-update counter');
      var selected=resolveScene(mesh,input.header),preset=mesh.camera.presets.find(function(p){return p.index===selected.scene.camera_preset;});assert(preset,'missing camera preset');
      var instanceOverrides=resolveInstanceOverrides(selected.scene,input.instanceOverrides);
      // Validate actors before consuming a camera update, so malformed input is retryable.
      var preparedActors=(input.actors||[]).filter(function(actor){return !actor.hidden;}).map(function(actor){
        var image=actor.atlas||spriteImages[actor.atlasKey||actor.id];assert(image,'missing sprite atlas for '+actor.id);
        var size=imageSize(image),frame=actor.frame||{x:0,y:0};assert(Number.isInteger(frame.x)&&Number.isInteger(frame.y)&&frame.x>=0&&frame.y>=0&&frame.x+32<=size[0]&&frame.y+32<=size[1],'sprite frame must be a 32x32 rectangle within the atlas');
        var pos=actorPosition(actor),key=actor.model||mesh.character.model;assert(modelBuffers[key],'unknown actor model');
        modelBuffers[key].forEach(function(batch){assert(batch.billboard==='full','actor model must have verified full billboard');});
        return {actor:actor,image:image,frame:frame,position:pos,key:key};
      });
      var lightingMode=input.lightingMode||options.lightingMode||'integer-ds-reference';
      assert(lightingMode==='unlit'||lightingMode==='integer-ds-reference','unsupported lighting mode');
      var lightingSeconds=input.lightingSecondsOfDay===undefined?options.lightingSecondsOfDay:input.lightingSecondsOfDay;
      if(lightingMode!=='unlit')assert(Number.isSafeInteger(lightingSeconds)&&lightingSeconds>=0&&lightingSeconds<86400,'explicit lightingSecondsOfDay0..86399 required; no browser wall clock is inferred');
      advanceCamera(input);
      if(lightingMode==='unlit'){lastLightingState=null;lightSelection=null;lastLightingHeader=null;lastLightingFrame=null;}
      else if(!lightSelection||lastLightingHeader!==Number(input.header)||input.resetLighting){
        var group=data.lighting.header_groups[String(input.header)];assert(group,'lighting header not audited');
        lightSelection=Lighting.createSelection(lightingTables,group,lightingSeconds);lastLightingState=lightSelection.current();lastLightingHeader=Number(input.header);lastLightingFrame=input.frameIndex;
      }else if(lastLightingFrame!==input.frameIndex){lastLightingState=lightSelection.update(lightingSeconds);lastLightingFrame=input.frameIndex;}
      var cam=lastCamera, opaque=[], transparent=[],stats={header:Number(input.header),scene:selected.key,cameraPreset:preset.index,perspectiveAngleU16:cam.perspectiveAngleU16,cameraFollowHeld:followHeld,frameIndex:input.frameIndex,drawCalls:0,triangles:0,transparentDraws:0,untexturedDraws:0,effectPassDraws:0,actors:0,lighting:lastLightingState?Lighting.mode:'unlit',lightingSecondsOfDay:lastLightingState?lastLightingState.secondsOfDay:null,lightingGroup:lastLightingState?lastLightingState.group:null,lightingRecord:lastLightingState?lastLightingState.index:null,lightingBufferUpdates:0,litNormalVertices:0,explicitColorVertices:0,specular:'integer reference implemented',instanceOverrides:Object.keys(instanceOverrides).length,textureReplacements:textureReplacements};
      function enqueue(call) {call.lightingState=lastLightingState;var state=materialState(call.batch.material,call.textureMeta);call.depth=-transform(cam.view,call.center)[2];call.order=opaque.length+transparent.length;(state.translucent?transparent:opaque).push(call);}
      sceneDraws[selected.key].forEach(function(item){var k=item.batch.material.texture,o=instanceOverrides[item.instanceIndex],matrix=o?o.matrix:item.matrix;enqueue({batch:item.batch,matrix:matrix,worldFx12:o&&o.worldFx12,center:o?transform(matrix,item.batch.centroid).slice(0,3):item.center,texture:staticTextures[k],textureMeta:staticTextureMeta[k],projectionPass:item.projectionPass,sprite:false});});
      preparedActors.forEach(function(item){
        var tex=upload(item.image),matrix=billboardMatrix(cam.view,item.position);
        modelBuffers[item.key].forEach(function(batch){enqueue({batch:batch,matrix:matrix,center:transform(matrix,batch.centroid).slice(0,3),texture:tex,textureMeta:{translucent:!!item.actor.translucent},frame:item.frame,projectionPass:'effects',sprite:true});});stats.actors++;
      });
      gl.viewport(0,0,WIDTH,HEIGHT);gl.disable(gl.DITHER);gl.enable(gl.DEPTH_TEST);gl.depthMask(true);gl.clearDepth(1);
      var clear=options.clearColor||[0,0,0,1];gl.clearColor(clear[0],clear[1],clear[2],clear[3]);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);gl.activeTexture(gl.TEXTURE0);gl.uniform1i(uniforms.Texture,0);gl.frontFace(gl.CCW);
      gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
      opaque.forEach(function(c){draw(c,cam,stats);});
      transparent.sort(function(a,b){return b.depth-a.depth||a.order-b.order;});transparent.forEach(function(c){draw(c,cam,stats);});
      gl.depthMask(true);gl.disable(gl.BLEND);gl.flush();lastStats=stats;
      return {canvas:canvas,camera:cam,stats:Object.assign({},stats)};
    }
    function dispose(){if(disposed)return;disposed=true;if(canvas.removeEventListener)canvas.removeEventListener('webglcontextlost',contextLost);cleanup();imageTextures.clear();}
    return {canvas:canvas,render:render,advanceCamera:advanceCamera,replaceTexturePixels:replaceTexturePixels,resetCamera:resetCamera,dispose:dispose,limits:LIMITS,summary:summary,lightingSummary:lightingSummary,
      getDiagnostics:function(){return {disposed:disposed,contextLost:lost,textureReplacements:textureReplacements,cameraOverride:{perspectiveAngleU16:lastCamera&&lastCamera.perspectiveAngleU16,holdFollow:followHeld},stats:lastStats&&Object.assign({},lastStats),camera:lastCamera,history:history&&history.snapshot(),lighting:lastLightingState?Lighting.mode:'unlit',lightingState:lastLightingState,lightingLimits:Lighting.limits,limits:LIMITS};},
      project:function(position,sprite){assert(lastCamera,'render first');return project(lastCamera,position,!!sprite);}};
  }
  function create(canvas,data,spriteImages,options) {validateData(data);return loadTextures(data).then(function(images){return createWithImages(canvas,data,images,spriteImages,options);});}
  return {create:create,createWithImages:createWithImages,loadTextures:loadTextures,validateData:validateData,limits:LIMITS,
    constants:Object.freeze({width:WIDTH,height:HEIGHT,aspect:ASPECT,aspect_fx12:5461,vertexStride:STRIDE}),
    math:{identity:identity,multiply:multiply,transform:transform,lookAt:lookAt,projection:projection,idealProjection:idealProjection,characterProjection:characterProjection,resolveCameraOverride:resolveCameraOverride,cameraWithDoorProjection:cameraWithDoorProjection,camera:camera,project:project,instanceMatrix:instanceMatrix,resolveInstanceOverrides:resolveInstanceOverrides,validateTexturePixels:validateTexturePixels,actorPosition:actorPosition,billboardMatrix:billboardMatrix,pixelIndex:pixelIndex,cellToWorld:cellToWorld,createHistory:createHistory,materialState:materialState,resolveScene:resolveScene},
    shaders:{vertex:VERTEX_SHADER,fragment:FRAGMENT_SHADER}};
});
