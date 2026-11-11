/* Diagnostic native source-scene polygon raster prototype.
 * Preserves the bounded orthographic modes; preset0 is separately opted in.
 * Raster/matrix arithmetic adapted from melonDS, Copyright 2016-2026 melonDS team.
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Pinned source 497aa6cdd26f45f8064b78916b00a773eab4ded7; see
 * native-span-provenance/README.md, source-snippets.json and LICENSE.melonDS.
 * Independently authored JS; never executes upstream code. Not hardware parity.
 */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-exclamation-native.js'),require('./source-exit-indicator-native.js'),()=>require('./source-cpu-renderer.js'));
 else root.SourceNativeOrtho=factory(root.SourceExclamationNative,root.SourceExitIndicatorNative,()=>root.SourceCpuRenderer);
})(typeof globalThis!=='undefined'?globalThis:this,function(Exclamation,ExitNative,getCPU){
 'use strict';
 // Capture objects only; later method/property reads remain dynamic. Global object replacement is outside this optional intact-realm contract.
 const Math=globalThis.Math,Number=globalThis.Number;
 const MODE='native-ortho-static-diagnostic', ACTOR_MODE='native-ortho-actor-diagnostic', W=256,H=192,N=W*H;
 const P=[32,0,0,0,0,43,0,0,0,0,-5,0,0,0,-4871,4096];
 const PERSPECTIVE_MODE='native-perspective-scene-diagnostic', P0=[21628,0,0,0,0,28836,0,0,0,0,-5734,-4096,0,0,-1474560,0];
 const DOOR_MODE='native-perspective-door-diagnostic', CAMERA_MODE='native-perspective-door-camera-diagnostic', CAMERA_POND_MODE='native-perspective-door-camera-pond-diagnostic', CAMERA_ANIMATION_MODE='native-perspective-door-camera-animation-diagnostic';
 const CAMERA_PROJECTIONS={"1365":{"world":[23407,0,0,0,0,31208,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[23407,0,0,0,0,31208,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1377":{"world":[23141,0,0,0,0,30853,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[23141,0,0,0,0,30853,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1389":{"world":[23141,0,0,0,0,30853,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[23141,0,0,0,0,30853,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1393":{"world":[22886,0,0,0,0,30513,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22886,0,0,0,0,30513,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1401":{"world":[22886,0,0,0,0,30513,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22886,0,0,0,0,30513,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1409":{"world":[22632,0,0,0,0,30174,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22632,0,0,0,0,30174,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1413":{"world":[22632,0,0,0,0,30174,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22632,0,0,0,0,30174,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1425":{"world":[22382,0,0,0,0,29841,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22382,0,0,0,0,29841,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1437":{"world":[22382,0,0,0,0,29841,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22382,0,0,0,0,29841,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1441":{"world":[22099,0,0,0,0,29464,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22099,0,0,0,0,29464,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1449":{"world":[22099,0,0,0,0,29464,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[22099,0,0,0,0,29464,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1457":{"world":[21861,0,0,0,0,29146,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[21861,0,0,0,0,29146,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1461":{"world":[21861,0,0,0,0,29146,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[21861,0,0,0,0,29146,0,0,0,0,-5734,-4096,0,0,-1497496,0]},"1473":{"world":[21628,0,0,0,0,28836,0,0,0,0,-5734,-4096,0,0,-1474560,0],"effects":[21628,0,0,0,0,28836,0,0,0,0,-5734,-4096,0,0,-1497496,0]}};
 const CAMERA_CONTEXTS=new WeakSet();
 const EXIT_INDICATOR_LIMITS=Object.freeze(['Exact model80 ground quad with renderer-owned preset4 field/draw/frame authority, source cardinal rotations and POSSCALE2.','Partial renderer admission only; application lifecycle integration, browser, timing and visual fidelity are not accepted.']);
 const CAMERA_ANIMATION_LIMITS=Object.freeze(['Explicit header411/preset0 finite source door-camera, ordinary seven-entry Y history or latched hold, and exact door/ordinary actor geometry.','Four source pond states and two source model82 material1 texture/palette pairs; persistent replacement history and all51 texture payloads are verified on private render snapshots.','One internally derived integer view and exact world/effects pair drives every native geometry branch. Normal lighting is independent of perspective angle.','No arbitrary replacement/material/camera, fitting, same-camera reattach, history:false, source callback/display cadence, browser or hardware acceptance.']);
 const CAMERA_POND_LIMITS=Object.freeze(['Explicit header411/preset0 finite door-camera plus four exact source pond states, all native geometry sharing selected world/effects projections and Z depth.','Ordinary seven-entry Y history or latched hold, exact original door samples and source-audited ordinary actors only.','Per-render private byte snapshots precede source-byte admission and native sampling. Only the exact pond target may be replaced.','No TV, arbitrary replacement, reattach, history:false, camera fitting, task/fade/display cadence, normal-host activation, browser or hardware acceptance.']);
 const CAMERA_LIMITS=Object.freeze(['Explicit header411/preset0 fourteen-angle source door-camera diagnostic, ordinary seven-entry Y history or latched follow hold.','One immutable effective target/view and exact world/effects pair is shared by all native branches; full256x192 viewport.','No reattach, debug history:false, camera fitting, arbitrary matrices, texture replacements, task/fade scheduler, normal-host activation, hardware or browser acceptance.']);
 const DOOR_PAIRS=[[4096,0],[3993,911],[3690,1777],[3202,2554],[2554,3202],[1777,3690],[911,3993],[0,4096],[3896,1266],[3314,2408],[2408,3314],[1266,3896]];
 const DOOR_TRANSLATIONS=Object.freeze({2:[-385913,68082,-307109],4:[334493,69334,344594],6:[335850,70205,-307920],8:[-319509,70205,347439]});
 const DOOR_LIMITS=Object.freeze(['Explicit preset0 exact model67 integer clip-pose diagnostic; source instances2/4/6/8 only, Rlocal then original instance translation, POSSCALE4 recovered once.','Animated doors, ordinary model376 actors and source event91/92 share the same native Z24, W interpolation, alpha/ID/two-layer pipeline.','Source integer normal lighting receives node rotation only, without translation or position scale. Camera overrides and task/fade timing integration remain unsupported.','Effective alphaRef0/fog-off/Z/auto-Y with explicit zero-dot state and neutral unblended RGB expansion; no browser/gameplay/hardware acceptance.','No arbitrary transforms/materials, texture replacement, unverified Pokemon admission, other effects, W-buffer/fog or original full-screen display composition.']);
 const PERSPECTIVE_LIMITS=Object.freeze(['Explicit preset0 source-scene diagnostic; variable-W native viewport, per-polygon W normalization and perspective attribute factors; Z-buffer only.','Source-audited static world/effect geometry and model376 actors share one integer depth/raster pipeline.','Effective alphaRef0, fog off, auto-Y sort, neutral unblended RGB expansion are explicit state conditions, not original-screen or hardware parity.','Animated transforms, texture replacements, camera overrides, arbitrary runtime materials, unverified Pokemon geometry, normal-host integration and display composition remain unsupported.']);
 // Exact raw TEXIMAGE_PARAM bits, independently verified; see provenance JSON.
 const TEXTURE_FORMATS=Object.freeze({"1a4ec23a09cdae94c307":2,"1b22902f20564013832d":3,"1cebe9923b3c37f6625c":3,"206dcd203714966b7c34":3,"274f09fe0ebb4a96a5d2":3,"280254025867fdc067f5":3,"408ddea3db10fa22e9fa":2,"433142c8307cbeceff99":3,"4cde06fe75fa6f050d6c":3,"5fddfdec17660a48df7c":2,"636c122a22cded37a3ae":3,"685175b35ec9376890d7":3,"781ccd9646e13584dc03":3,"7e006e1265775c1f9654":3,"7e9729a3268d8d3fa757":2,"7efc3521d6e2fe0668f3":2,"882a20006ec4b3e30b60":2,"8f49ccffff53abd9561a":2,"91e0b7c8690c579a182e":3,"92dcb7d9c69568806ffa":3,"9555eb0a476369f1dd67":3,"a29a28e210d722a62911":3,"a2b98149f82579c89be4":2,"af5a041bf33d7c043726":2,"c052b53e7c7308587c02":2,"c3f4b052d3974d8d3674":2,"c53aff18d30b78fcd51f":3,"c84266e5b29b404b9923":3,"e66c36c647540d2622b2":2,"f69df8ba0985acdee247":2,"f95cfc95872339a01399":2});
 const LIMITS=Object.freeze([
  'Diagnostic only: fixed preset4, full256x192 viewport, static identity-rotation/scale instances, constant W4096, Z-buffer and auto-Y sort.',
  'No actor/billboard/effects pass, animated transform, perspective, W-buffer, wireframe, fog, shadow, or nonzero alpha reference.',
  'Original polygon ordering is reconstructed from supplied scene/batch/topology order, not a captured runtime FIFO.',
  'Exact emulator-source arithmetic within the supported contract, not original hardware, browser, footage or global scene parity.',
  'RGB6-to-RGB8 is the existing reversible app display convention; Canvas output stays opaque and is not DS2D composition.'
 ]);
 const ACTOR_LIMITS=Object.freeze([
  'Explicit preset4 diagnostic: identity model376 human/player and four exact ordinary Pokemon bindings, source-audited atlas bytes and frame origins; bounded Node/classic-script fixture, not a gameplay path.',
  'Same native static/actor FX12 clipping, Z24, interpolation, alpha, IDs, two-layer edge/AA pipeline. Ordinary actor material attr0x001f8081; frame-local32x32 repeated texture addressing.',
  'Effective alphaRef0, fog-disabled, Z-buffer, auto-sort, neutral unblended app RGB expansion; no original-frame display-state or hardware claim.',
  'Runtime nonidentity transforms, animated nodes, arbitrary material changes, unverified Pokemon geometry, perspective, camera overrides and normal-host activation remain unsupported.',
  'Original submission order reconstructed from scene plus supplied actor order, not a captured original runtime FIFO. No movement/gait scheduling changes.'
 ]);
 function fail(ok,why){if(!ok)throw new Error('SourceNativeOrtho unsupported: '+why);}
 function safe(x,label){fail(Number.isSafeInteger(x),label+' exceeds exact integer arithmetic');return x;}
 function word(x,label){fail(Number.isSafeInteger(x)&&x>=-2147483648&&x<=2147483647,label+' signed32 storage overflow');return x;}
 function floorShift(x,b){return Math.floor(safe(x,'shift input')/2**b);}
 function div(a,b){fail(Number.isInteger(b)&&b!==0,'division by zero/noninteger');return Math.trunc(safe(a,'division input')/b);}
 function fx(x,label){const n=Math.round(x*4096);fail(Number.isSafeInteger(n)&&n>=-2147483648&&n<=2147483647&&Math.abs(n/4096-x)<1e-9,label+' is not FX12');return n;}
 function matrixMultiply(a,b){a.forEach(x=>word(x,'matrix input'));b.forEach(x=>word(x,'matrix input'));return Array.from({length:16},(_,i)=>{const c=i>>2,r=i&3;let sum=0;for(let k=0;k<4;k++)sum=safe(sum+safe(a[k*4+r]*b[c*4+k],'matrix product'),'matrix sum');return word(floorShift(sum,12),'matrix output');});}
 function transform(m,v){m.forEach(x=>word(x,'vertex matrix input'));v.forEach(x=>word(x,'vertex input'));return [0,1,2,3].map(r=>word(floorShift(v.reduce((s,x,k)=>safe(s+safe(x*m[k*4+r],'vertex product'),'vertex sum'),0),12),'vertex output'));}
 function view(target,perspective=false){
  fail(Array.isArray(target)&&target.length===3,'target XYZ required');
  const m=perspective?[4096,0,0,0,0,2107,3512,0,0,-3512,2107,0,0,0,0,4096]:[4096,0,0,0,0,2629,3140,0,0,-3140,2629,0,0,0,0,4096];
  const offset=perspective?[0,2340897,1404538]:[0,4906382,4108977],eye=target.map((v,i)=>word(fx(v,'camera target')+offset[i],'camera eye'));
  for(let r=0;r<3;r++)m[12+r]=word(-floorShift(eye.reduce((s,x,k)=>safe(s+x*m[k*4+r],'LookAt sum'),2048),12),'LookAt translation');
  return m;
 }
 function admitCamera(input){
  fail(input&&Object.keys(input).every(k=>['header','preset','perspectiveAngleU16','holdFollow','target','projectionFx12','effectsProjectionFx12'].includes(k)),'unknown camera context field');
  fail(input.header===411&&input.preset===0&&typeof input.holdFollow==='boolean','camera header/preset/hold state');
  const p=Number.isInteger(input.perspectiveAngleU16)&&CAMERA_PROJECTIONS[input.perspectiveAngleU16];fail(p,'unknown source door camera angle');
  for(const [key,expected] of [['projectionFx12',p.world],['effectsProjectionFx12',p.effects]])fail(Array.isArray(input[key])&&input[key].length===16&&expected.every((v,i)=>Number.isSafeInteger(input[key][i])&&input[key][i]===v),'camera '+key+' differs from source angle');
  fail(Array.isArray(input.target)&&input.target.length===3,'camera target XYZ required');
  const target=Array.from(input.target);fail(target.every(x=>Number.isSafeInteger(x*4096)),'camera target is not exact FX12');
  const targetFx12=target.map(x=>word(x*4096,'camera target')),v=view(target,true),context=Object.freeze({header:411,preset:0,perspectiveAngleU16:input.perspectiveAngleU16,holdFollow:input.holdFollow,targetFx12:Object.freeze(targetFx12),viewFx12:Object.freeze(v),projectionFx12:Object.freeze(p.world.slice()),effectsProjectionFx12:Object.freeze(p.effects.slice())});
  CAMERA_CONTEXTS.add(context);return context;
 }
 function cameraContext(target,perspective,context){
  if(context===undefined)return null;
  fail(perspective===true&&context&&CAMERA_CONTEXTS.has(context),'unadmitted native camera context');
  fail(Array.isArray(target)&&target.length===3&&context.targetFx12.every((x,i)=>Number.isSafeInteger(target[i]*4096)&&target[i]*4096===x),'camera context target mismatch');return context;
 }
 function clipMatrix(target,entry,perspective=false,context){
  const c=cameraContext(target,perspective,context);
  const a=entry.matrix;
  fail(a&&a.length===16&&a.every(Number.isFinite),'instance matrix');
  fail(a.every((x,i)=>i===12||i===13||i===14||x===((i%5===0)?1:0)),'nonidentity static rotation/scale');
  fail(!entry.billboard&&(entry.projectionPass==='world'||perspective&&entry.projectionPass==='effects'&&['event-0091','event-0092'].includes(entry.key)),'non-world/billboard geometry');
  fail(Number.isSafeInteger(entry.scale)&&entry.scale>0&&entry.scale<=256,'source position scale');
  const pos=matrixMultiply(c?c.viewFx12:view(target,perspective),a.map(x=>fx(x,'instance matrix')));
  for(let i=0;i<12;i++)pos[i]=word(safe(pos[i]*entry.scale,'POSSCALE'),'POSSCALE');
  const projection=c?(entry.projectionPass==='effects'?c.effectsProjectionFx12:c.projectionFx12).slice():(perspective?P0:P).slice();if(!c&&entry.projectionPass==='effects')projection[14]=word(projection[14]+floorShift(projection[10]*16384+2048,12),'effects projection');
  return matrixMultiply(projection,pos);
 }
 function doorClipMatrix(target,e,context){
  const c=cameraContext(target,true,context);
  fail(e.key==='building-0067'&&e.mi===0&&e.bi===0&&e.scale===4&&e.projectionPass==='world'&&!e.billboard&&!e.actor,'audited model67 node0 shape required');
  const t=DOOR_TRANSLATIONS[e.instanceIndex],r=e.worldFx12,a=e.matrix;
  fail(t&&Number.isInteger(e.instanceIndex),'source exterior door instance binding');
  fail(Array.isArray(r)&&r.length===16&&r.every(Number.isSafeInteger),'source door node FX12 matrix');
  const expected=[r[0],0,r[2],0,0,4096,0,0,-r[2],0,r[0],0,0,0,0,4096];
  fail(DOOR_PAIRS.some(p=>r[0]===p[0]&&r[2]===p[1])&&r.every((v,i)=>v===expected[i]),'node rotation is not an exact source door sample');
  fail(a&&a.length===16&&a.every((v,i)=>v===(i>=12&&i<=14?t[i-12]/4096:r[i]/4096)),'door matrix differs from exact source node/placement');
  const instance=[4096,0,0,0,0,4096,0,0,0,0,4096,0,...t,4096],v=c?c.viewFx12.slice():view(target,true),preNode=matrixMultiply(v,instance),postNode=matrixMultiply(preNode,r),position=postNode.slice();
  for(let i=0;i<12;i++)position[i]=word(safe(position[i]*4,'door POSSCALE'),'door POSSCALE');
  const projection=c?c.projectionFx12.slice():P0.slice();return {view:v,instance,node:r.slice(),preNode,postNode,position,projection,clip:matrixMultiply(projection,position)};
 }
 // Ordinary FlushP reloads view, MULT43(I,T), SCALE(I), then SBC BB.
 // BB LOAD43(I,readback translation) replaces the matrix, never view*inverse.
 function actorPosition(actor){
  let p=[0,0,0];for(const key of ['position','facingVector','offset2','offset3']){
   const v=actor[key];if(v===undefined&&key!=='position')continue;
   fail(v&&v.length===3,'actor '+key+' XYZ required');
   p=p.map((x,i)=>(x+fx(v[i],'actor '+key))|0);
  }p[2]=(p[2]+24576)|0;return p;
 }
 function isqrt(n){fail(Number.isSafeInteger(n)&&n>=0,'integer square root');let r=Math.floor(Math.sqrt(n));while((r+1)*(r+1)<=n)r++;while(r*r>n)r--;return r;}
 function billboardClipMatrix(target,e,perspective=false,context){
  const c=cameraContext(target,perspective,context);
  fail(e.billboard==='full'&&e.projectionPass==='effects'&&e.key==='character-billboard-0376'&&e.scale===8,'audited model376 full billboard required');
  fail(e.actorPositionFx12&&e.actorPositionFx12.length===3&&e.actorPositionFx12.every(x=>Number.isInteger(x)&&x>=-2147483648&&x<=2147483647),'actor raw position required');
  const v=c?c.viewFx12:view(target,perspective),translation=[0,1,2].map(j=>word(floorShift(e.actorPositionFx12.reduce((sum,t,k)=>safe(sum+t*v[k*4+j],'actor position'),4096*v[12+j]),12),'actor BB translation'));
  const lengths=[0,4,8].map(k=>Math.floor((isqrt(4*(v[k]*v[k]+v[k+1]*v[k+1]+v[k+2]*v[k+2]))+1)/2));
  const pos=[lengths[0]*8,0,0,0,0,lengths[1]*8,0,0,0,0,lengths[2]*8,0,...translation,4096];
  pos.forEach(x=>word(x,'actor BB/POSSCALE position'));
  const projection=c?c.effectsProjectionFx12.slice():(perspective?P0:P).slice();if(!c)projection[14]=(projection[14]+floorShift(projection[10]*16384+2048,12))|0;
  return {clip:matrixMultiply(projection,pos),position:pos,translation,lengths,projection};
 }
 // Command75 model85 uses the same full-billboard ABI, but native16 geometry,
 // POSSCALE4, its own material and no ordinary actor +6Z translation.
 function effectBillboardClipMatrix(target,e,perspective=false,context){
  fail(Exclamation&&Exclamation.verifyEntry(e),'command75 admission required');
  const header=e.effect.header;
  fail([413,414].includes(header)?perspective===false&&context===undefined:header===411&&perspective===true&&context!==undefined,'command75 requires the matching admitted scene camera');
  const c=cameraContext(target,perspective,context);
  fail(e.billboard==='full'&&e.projectionPass==='effects'&&e.key==='fldeff-0085-selector0'&&e.scale===4&&!e.actor,'exact command75 billboard');
  const v=c?c.viewFx12:view(target,false),translation=[0,1,2].map(j=>word(floorShift(e.effectPositionFx12.reduce((sum,t,k)=>safe(sum+t*v[k*4+j],'effect position'),4096*v[12+j]),12),'effect BB translation'));
  const lengths=[0,4,8].map(k=>Math.floor((isqrt(4*(v[k]*v[k]+v[k+1]*v[k+1]+v[k+2]*v[k+2]))+1)/2));
  const pos=[lengths[0]*4,0,0,0,0,lengths[1]*4,0,0,0,0,lengths[2]*4,0,...translation,4096];
  pos.forEach(x=>word(x,'effect BB/POSSCALE position'));
  const projection=c?c.effectsProjectionFx12.slice():P.slice();if(!c)projection[14]=word(projection[14]+floorShift(projection[10]*16384+2048,12),'effects projection');
  return {clip:matrixMultiply(projection,pos),position:pos,translation,lengths,projection};
 }
 function viewport(v,perspective=false){
  if(!perspective)fail(v[3]===4096,'nonconstant W4096');
  const w=v[3]&0xffffff;if(!w)return [0,0];let x=(v[0]+w)>>>0,y=(-v[1]+w)>>>0,den=w;
  if(w>65535){x>>>=1;y>>>=1;den>>>=1;}den*=2;
  return [div((x*256)>>>0,den)&511,div((y*192)>>>0,den)&255];
 }
 function depth(v){if(!v[3])return 0x7ffe00;return Math.max(0,Math.min(0xffffff,(div(v[2]*0x4000,v[3])+0x3fff)*512));}
 function facing(vs){
  const [a,b,c]=vs.map(v=>v.clip),u=[0,1,3].map(i=>BigInt(a[i]-b[i])),v=[0,1,3].map(i=>BigInt(c[i]-b[i]));
  let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  while(n.some(x=>x<-(1n<<31n)||x>=(1n<<31n)))n=n.map(x=>x>>4n);
  return [0,1,3].reduce((s,k,j)=>s+BigInt(b[k])*n[j],0n);
 }
 // Exact-number determinant for renderer-owned ordinary numeric vertices.
 // Every product and accumulation is checked before it can lose integer bits;
 // unsupported magnitudes retain the existing arbitrary-precision path.
 const facingBigInt=BigInt;
 function facingOwned(vs){
  if(globalThis.BigInt!==facingBigInt)return facing(vs);
  const a=vs[0].clip,b=vs[1].clip,c=vs[2].clip;
  const u=[a[0]-b[0],a[1]-b[1],a[3]-b[3]],v=[c[0]-b[0],c[1]-b[1],c[3]-b[3]];
  const n=[];
  for(let j=0;j<3;j++){
   const k=(j+1)%3,l=(j+2)%3,x=u[k]*v[l],y=u[l]*v[k];
   if(!Number.isSafeInteger(x)||!Number.isSafeInteger(y)||Math.abs(x)+Math.abs(y)>9007199254740991)return facing(vs);
   n[j]=x-y;
  }
  while(n[0]<-2147483648||n[0]>=2147483648||n[1]<-2147483648||n[1]>=2147483648||n[2]<-2147483648||n[2]>=2147483648){n[0]=Math.floor(n[0]/16);n[1]=Math.floor(n[1]/16);n[2]=Math.floor(n[2]/16);}
  let sum=0;
  for(let j=0;j<3;j++){const x=b[j===2?3:j]*n[j];if(!Number.isSafeInteger(x)||Math.abs(sum)+Math.abs(x)>9007199254740991)return facing(vs);sum+=x;}
  return facingBigInt(sum);
 }
 function cloneVertex(v){return {clip:v.clip.slice(),uv:v.uv.slice(),colorRaw:v.colorRaw.slice(),sourceIndex:v.sourceIndex,clipped:!!v.clipped};}
 function clipVertices(input,attr,clipstart=0){
  let vs=input.map(cloneVertex);
  for(const axis of [2,1,0]){
   for(const sign of [1,-1]){
    const out=vs.slice(0,clipstart);
    for(let i=clipstart;i<vs.length;i++){
     const v=vs[i];
     if(sign*v.clip[axis]>v.clip[3]){
      if(axis===2&&sign===1&&!(attr&4096))return [];
      for(const j of [(i+vs.length-1)%vs.length,(i+1)%vs.length]){
       const b=vs[j];if(sign*b.clip[axis]>b.clip[3])continue;
       const num=v.clip[3]-sign*v.clip[axis],den=num-(b.clip[3]-sign*b.clip[axis]);
       const q={clipped:true,sourceIndex:null};
       for(const k of ['clip','uv','colorRaw'])q[k]=v[k].map((a,n)=>a+div((b[k][n]-a)*num,den));
       q.clip[axis]=sign*q.clip[3];out.push(q);
      }
     }else out.push(v);
    }
    vs=out;fail(vs.length<=10,'clip vertex RAM overflow');
   }
   for(const v of vs)v.colorRaw=v.colorRaw.map(c=>floorShift(c,12)*4096+4095);
  }
  return vs;
 }

 // Ownership certificates contain immutable source data, never transformed values.
 // Only the neighbor renderer uses these explicit source snapshots.
 // Private successful static geometry decode. Geometry is an immutable numeric
 // snapshot; admission is repeated before use, so callback-bearing intrinsics
 // and public/unowned input always retain the original path. Values are copied
 // into fresh public raw records; no cached record escapes. At most eight
 // scale maps are retained per immutable geometry; further scales take the
 // uncached original path. Admission saturates without eviction or input changes.
 const staticGeometry=new WeakMap(),StaticMap=Map,staticGet=Map.prototype.get,staticSet=Map.prototype.set,staticWeakGet=WeakMap.prototype.get,staticWeakSet=WeakMap.prototype.set;
 function staticLookup(g,scale,vi){const state=applyCaptured(staticWeakGet,staticGeometry,[g]);if(!state)return null;const vertices=applyCaptured(staticGet,state.scales,[scale]);return vertices?applyCaptured(staticGet,vertices,[vi]):null;}
 function staticRemember(g,scale,vi,local,uv){let state=applyCaptured(staticWeakGet,staticGeometry,[g]);if(!state){state={scales:new StaticMap(),count:0};applyCaptured(staticWeakSet,staticGeometry,[g,state]);}let vertices=applyCaptured(staticGet,state.scales,[scale]);if(!vertices){if(state.count>=8)return;vertices=new StaticMap();applyCaptured(staticSet,state.scales,[scale,vertices]);state.count++;}applyCaptured(staticSet,vertices,[vi,{x:local[0],y:local[1],z:local[2],u:uv[0],v:uv[1]}]);}
 const ownedGeometry=new WeakSet(),ownedBoundaries=new WeakSet(),ownedTopologies=new WeakSet(),ownedEntries=new WeakSet();
 const decoderGlobals={Array,Math,Number,Object,Float32Array,Float64Array,Symbol},decoderGlobalNames=['Array','Math','Number','Object','Float32Array','Float64Array','Symbol'];
 const decoderIntrinsics={from:Array.from,slice:Array.prototype.slice,map:Array.prototype.map,every:Array.prototype.every,forEach:Array.prototype.forEach,reduce:Array.prototype.reduce,concat:Array.prototype.concat,iterator:Array.prototype[Symbol.iterator],round:Math.round,abs:Math.abs,floor:Math.floor,isSafeInteger:Number.isSafeInteger,arrayToString:Array.prototype.toString,arrayJoin:Array.prototype.join,arraySpread:Object.getOwnPropertyDescriptor(Array.prototype,Symbol.isConcatSpreadable),objectSpread:Object.getOwnPropertyDescriptor(Object.prototype,Symbol.isConcatSpreadable),arrayPrimitive:Object.getOwnPropertyDescriptor(Array.prototype,Symbol.toPrimitive),objectPrimitive:Object.getOwnPropertyDescriptor(Object.prototype,Symbol.toPrimitive),arrayConstructor:Array.prototype.constructor,arraySpecies:Object.getOwnPropertyDescriptor(Array,Symbol.species).get,typedSlice:Float32Array.prototype.slice,typedIterator:Float32Array.prototype[Symbol.iterator],typedConstructor:Object.getPrototypeOf(Float32Array),typedSpecies:Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Float32Array),Symbol.species).get};
 const ownDescriptor=Object.getOwnPropertyDescriptor,prototypeOf=Object.getPrototypeOf,isView=ArrayBuffer.isView,bufferByteLength=ownDescriptor(ArrayBuffer.prototype,'byteLength').get,bufferResizable=ownDescriptor(ArrayBuffer.prototype,'resizable'),typedPrototype=prototypeOf(Float32Array.prototype),typedBuffer=ownDescriptor(typedPrototype,'buffer').get,typedLength=ownDescriptor(typedPrototype,'length').get,applyCaptured=Reflect.apply,freezeCaptured=Object.freeze,fromCaptured=Array.from,isIntegerCaptured=Number.isInteger,isSafeIntegerCaptured=Number.isSafeInteger,defineCaptured=Object.defineProperty,weakAdd=WeakSet.prototype.add,weakHas=WeakSet.prototype.has;
 function addOwned(set,value){applyCaptured(weakAdd,set,[value]);}
 function hasOwned(set,value){return applyCaptured(weakHas,set,[value]);}
 function captureSourceGeometry(vertices,topology){
  const copy=freezeCaptured(applyCaptured(fromCaptured,undefined,[vertices]));let numeric=true;for(let i=0;i<copy.length;i++)if(typeof copy[i]!=='number')numeric=false;if(numeric)addOwned(ownedGeometry,copy);
  const sourcePolygons=applyCaptured(fromCaptured,undefined,[topology.original_polygons]),polygons=[];
  for(let i=0;i<sourcePolygons.length;i++){
   const t=sourcePolygons[i],b=freezeCaptured(applyCaptured(fromCaptured,undefined,[t.boundary_vertices])),sv=freezeCaptured(applyCaptured(fromCaptured,undefined,[t.source_vertices]));let valid=sv.length===b.length;
   for(let j=0;j<b.length;j++)if(!isSafeIntegerCaptured(b[j])||b[j]<0||b[j]*11+11>copy.length)valid=false;
   for(let j=0;j<sv.length;j++)if(!isIntegerCaptured(sv[j]))valid=false;
   if(valid)addOwned(ownedBoundaries,b);const result=freezeCaptured({...t,boundary_vertices:b,source_vertices:sv});addOwned(ownedTopologies,result);
   // Captured definition bypasses prototype numeric setters installed by an input callback.
   defineCaptured(polygons,i,{value:result,writable:true,enumerable:true,configurable:true});
  }
  return freezeCaptured({vertices:copy,topology:freezeCaptured({...topology,original_polygons:freezeCaptured(polygons)})});
 }
 function decoderUnmodified(){
  for(let i=0;i<decoderGlobalNames.length;i++){const k=decoderGlobalNames[i];if(ownDescriptor(globalThis,k)?.value!==decoderGlobals[k])return false;}
  const d=decoderIntrinsics,A=decoderGlobals.Array,M=decoderGlobals.Math,N=decoderGlobals.Number,O=decoderGlobals.Object,P=A.prototype;
  function value(o,k,v){return ownDescriptor(o,k)?.value===v;}
  return prototypeOf(P)===O.prototype&&prototypeOf(O.prototype)===null&&ownDescriptor(P,Symbol.isConcatSpreadable)===d.arraySpread&&ownDescriptor(O.prototype,Symbol.isConcatSpreadable)===d.objectSpread&&value(P,'toString',d.arrayToString)&&value(P,'join',d.arrayJoin)&&ownDescriptor(P,Symbol.toPrimitive)===d.arrayPrimitive&&ownDescriptor(O.prototype,Symbol.toPrimitive)===d.objectPrimitive&&value(A,'from',d.from)&&value(P,'slice',d.slice)&&value(P,'map',d.map)&&value(P,'every',d.every)&&value(P,'forEach',d.forEach)&&value(P,'reduce',d.reduce)&&value(P,'concat',d.concat)&&value(P,Symbol.iterator,d.iterator)&&value(P,'constructor',d.arrayConstructor)&&ownDescriptor(A,Symbol.species)?.get===d.arraySpecies&&value(M,'round',d.round)&&value(M,'abs',d.abs)&&value(M,'floor',d.floor)&&value(N,'isSafeInteger',d.isSafeInteger);
 }
 function captureSourceEntry(entry){const copy={...entry};addOwned(ownedEntries,copy);return copy;}
 function decoderEligible(e,t){
  if(!hasOwned(ownedEntries,e)||!decoderUnmodified()||!hasOwned(ownedTopologies,t)||!hasOwned(ownedBoundaries,t.boundary_vertices))return false;
  const gd=ownDescriptor(e,'geometryVertices'),vd=ownDescriptor(e,'vertices'),sd=ownDescriptor(e,'scale'),kd=ownDescriptor(e,'key');
  if(!kd||!('value'in kd)||(typeof kd.value!=='string'&&typeof kd.value!=='number')||!gd||!('value'in gd)||!vd||!('value'in vd)||!sd||!('value'in sd)||typeof sd.value!=='number'||!hasOwned(ownedGeometry,gd.value))return false;
  const v=vd.value;if(hasOwned(ownedGeometry,v))return v.length===gd.value.length;
  if(!isView(v)||(prototypeOf(v)!==Float32Array.prototype&&prototypeOf(v)!==Float64Array.prototype)||ownDescriptor(v,'constructor')||ownDescriptor(v,'slice')||ownDescriptor(v,Symbol.iterator))return false;
  const ctor=prototypeOf(v)===Float32Array.prototype?Float32Array:Float64Array,d=decoderIntrinsics;
  const proto=prototypeOf(v);if(ownDescriptor(ctor,Symbol.species)||ownDescriptor(proto,'constructor')?.value!==ctor||ownDescriptor(proto,'slice')||ownDescriptor(proto,Symbol.iterator)||prototypeOf(proto)!==typedPrototype||ownDescriptor(typedPrototype,'slice')?.value!==d.typedSlice||ownDescriptor(typedPrototype,Symbol.iterator)?.value!==d.typedIterator||prototypeOf(ctor)!==d.typedConstructor||ownDescriptor(d.typedConstructor,Symbol.species)?.get!==d.typedSpecies)return false;
  try{if(applyCaptured(bufferByteLength,applyCaptured(typedBuffer,v,[]),[])===0||(bufferResizable&&applyCaptured(bufferResizable.get,applyCaptured(typedBuffer,v,[]),[]))||applyCaptured(typedLength,v,[])!==gd.value.length)return false;}catch(_){return false;}
  return true;
 }
 function makePolygon(target,e,topology,pi,matrix,perspective=false){return makePolygonCore(target,e,topology,pi,matrix,perspective,false);}
 function makePolygonCore(target,e,topology,pi,matrix,perspective=false,owned=false){
  const attr=e.material.polygon_attributes>>>0;
  if(e.actor)fail(attr===0x001f8081&&e.material.repeat_s&&e.material.repeat_t&&!e.material.flip_s&&!e.material.flip_t,'ordinary source actor material state');
  fail(e.material.polygon_mode===0&&!(attr&0x30),'polygon mode/shadow');
  fail(e.material.alpha_5bit>0&&e.material.alpha_5bit===((attr>>>16)&31),'wireframe/inconsistent alpha');
  fail(e.actor?!!e.texture:!!e.material.texture===!!e.texture,'missing texture binding');
  const format=e.actor||e.effect?e.textureFormat:perspective?e.textureFormat:TEXTURE_FORMATS[e.material.texture];
  fail(!e.texture||(perspective?[1,2,3].includes(format):[2,3].includes(format)),'texture format not source-audited format2/3 or perspective format1');
  fail(!e.texture||format===1||!e.texture.translucent,'source format2/3 cannot contain partial alpha');
  const scalar=owned&&decoderEligible(e,topology);
  const raw=topology.boundary_vertices.map((vi,i)=>{
   const k=vi*11,cached=scalar?staticLookup(e.geometryVertices,e.scale,vi):null;let v,shaded,local;if(scalar){const g=e.geometryVertices,c=e.vertices;v=[g[k],g[k+1],g[k+2],g[k+3],g[k+4]];shaded=[c[k+8],c[k+9],c[k+10]];local=cached?[cached.x,cached.y,cached.z]:[Math.round(v[0]*4096/e.scale),Math.round(v[1]*4096/e.scale),Math.round(v[2]*4096/e.scale)];}else{v=Array.from((e.geometryVertices||e.vertices).slice(k,k+11));shaded=Array.from(e.vertices.slice(k,k+11));local=v.slice(0,3).map(x=>Math.round(x*4096/e.scale));}
   if(scalar){if(!cached&&!local.every((x,i)=>Math.abs(x*e.scale/4096-v[i])<5.1e-7))fail(false,'mesh position not recoverable as source FX12: '+e.key+' vertex '+vi+' scale '+e.scale+' position '+v.slice(0,3));}else{fail(local.every((x,i)=>Math.abs(x*e.scale/4096-v[i])<5.1e-7),'mesh position not recoverable as source FX12: '+e.key+' vertex '+vi+' scale '+e.scale+' position '+v.slice(0,3));}
   const uv=cached?[cached.u,cached.v]:v.slice(3,5).map(x=>Math.round(x*16));if(!cached)fail(uv.every((x,i)=>Math.abs(x/16-v[3+i])<5.1e-7&&x>=-32768&&x<=32767),'source UV not signed FX4');if(scalar&&!cached)staticRemember(e.geometryVertices,e.scale,vi,local,uv);
   const rgb=scalar?[Math.round(shaded[0]*31),Math.round(shaded[1]*31),Math.round(shaded[2]*31)]:shaded.slice(8,11).map(x=>Math.round(x*31));fail(rgb.every((x,i)=>x>=0&&x<=31&&Math.abs(x/31-shaded[(scalar?0:8)+i])<5.1e-7),'source RGB5');
   return {clip:transform(matrix,local.concat(4096)),uv,colorRaw:rgb.map(x=>x*4096+4095),sourceIndex:topology.source_vertices[i],clipped:false};
  });
  fail(raw.length===3||raw.length===4,'original polygon must be triangle/quad');
  if(!perspective)fail(raw.every(v=>v.clip[3]===4096),'nonconstant W4096');
  // Private source-built geometric rejection: all vertex decoding/validation
  // above still executes. A convex triangle/quad wholly beyond one clip plane
  // cannot survive clipping, independent of facing. Public makePolygon remains
  // on its exact generic path. No cache, frame omission, or gate bypass.
  let outside=false;
  if(scalar){for(let axis=2;axis>=0&&!outside;axis--){
   let plus=true,minus=true;
   for(let i=0;i<raw.length;i++){const c=raw[i].clip;if(c[axis]<=c[3])plus=false;if(-c[axis]<=c[3])minus=false;}
   outside=plus||minus;
  }}
  const dot=outside?0n:scalar?facingOwned(raw):facing(raw),culled=outside||(dot<0n&&!(attr&128))||(dot>0n&&!(attr&64));
  return {entry:e,attr,raw,topology,pi,textureFormat:format,perspective,translucent:format===1||e.material.alpha_5bit<31,front:dot<=0n,culled,id:(e.effect?'effect'+e.effect.handle+'/':e.actor?'actor'+e.actorIndex+'/':'')+e.key+'/m'+e.mi+'/b'+e.bi+'/p'+pi,instanceIndex:e.instanceIndex};
 }
 function bbCopy(b){return Object.fromEntries(Object.entries(b).map(([k,v])=>[k,v.slice()]));}
 function prepare(p,previous,state,ram){
  if(p.culled)return null;
  let raw=p.raw,clipstart=0,t=p.topology;
  // GPU3D.cpp1006-1047: only original un-clipped shared endpoints may
  // be reused. Attempt ordinal includes culled and otherwise rejected polygons.
  if(t.primitive_mode>=2&&previous&&previous.topology.primitive_run===t.primitive_run&&previous.vertices.length===(t.primitive_mode===2?3:4)){
   const slots=t.primitive_mode===3?[3,2]:(p.runOrdinal&1)?[2,1]:[0,2];
   const shared=slots.map(i=>previous.vertices[i]);
   if(shared.every(v=>!v.clipped)){
    fail(shared.every((v,i)=>v.sourceIndex===raw[i].sourceIndex),'source strip endpoint topology mismatch');
    raw=[cloneVertex(shared[0]),cloneVertex(shared[1]),...raw.slice(2)];clipstart=2;
   }
  }
  const vertices=clipVertices(raw,p.attr,clipstart);if(!vertices.length)return null;
  // GPU3D.cpp1077: admission charges the full clipped polygon BEFORE strip
  // endpoint reuse savings, viewport/zero-dot rejection, and actual allocation.
  if(ram){fail(ram.polygons<2048,'polygon RAM admission limit');fail(ram.vertices+vertices.length<=6144,'vertex RAM admission before strip savings');}
  for(const v of vertices){v.clip[3]&=0xffffff;v.screen=viewport(v.clip,!!p.perspective);v.z=depth(v.clip);v.color9=v.colorRaw.map(c=>{const n=floorShift(c,12);return n?n*16+15:0;});}
  if(vertices.every(v=>v.screen[0]===vertices[0].screen[0]&&v.screen[1]===vertices[0].screen[1])&&!(p.attr&8192)){
   fail(Number.isInteger(state.zeroDotWLimit),'zero-dot polygon needs explicit zeroDotWLimit');
   if(vertices.every(v=>v.clip[3]>state.zeroDotWLimit))return null;
  }
  let vtop=0,vbottom=0,ytop=192,ybottom=0,xbot=0;
  vertices.forEach((v,i)=>{if(v.screen[1]<ytop){vtop=i;ytop=v.screen[1];}if(v.screen[1]>ybottom||(v.screen[1]===ybottom&&v.screen[0]>xbot)){vbottom=i;ybottom=v.screen[1];xbot=v.screen[0];}});
  let wsize=0;for(const v of vertices)while(Math.floor(v.clip[3]/2**wsize)&&wsize<32)wsize+=4;
  for(const v of vertices)v.w=wsize<16?v.clip[3]*2**(16-wsize):floorShift(v.clip[3],wsize-16);
  const degenerate=ybottom>192||vertices.some(v=>v.clip[3]===0);
  return Object.assign(p,{allocatedVertices:vertices.length-(clipstart===2&&previous&&vertices.length===previous.vertices.length?2:0),vertices,vtop,vbottom,ytop,ybottom,clipstart,degenerate,wsize,sortkey:((p.translucent?1:0)<<16)|(ybottom<<8)|ytop});
 }
 class Lerp{
  constructor(a,b,x,axis,w0=4096,w1=4096){this.n=b-a;this.x=x-a;this.axis=axis;fail(this.n>=0,'negative interpolation length');
   fail([w0,w1].every(w=>Number.isInteger(w)&&w>=0&&w<=65535),'normalized W16 required');
   this.linear=w0===w1&&!(w0&(axis?126:127));this.shift=axis?9:8;this.factor=0;
   if(this.n&&!this.linear){const wn=axis?w0>>>1:w0,wd=axis?(w0+((w0&~w1)&1))>>>1:w0,we=axis?w1>>>1:w1,num=(this.x*wn*2**this.shift)>>>0,den=(this.x*wd+(this.n-this.x)*we)>>>0;this.factor=den?Math.floor(num/den):0;}
  }
  at(a,b){if(!this.n||a===b)return a;if(!this.linear)return Math.min(a,b)+floorShift(safe(Math.abs(b-a)*(a<b?this.factor:2**this.shift-this.factor),'perspective attribute'),this.shift);return Math.min(a,b)+div(Math.abs(b-a)*(a<b?this.x:this.n-this.x),this.n);}
  z(a,b){if(!this.n||a===b)return a;let d=Math.abs(b-a),f=a<b?this.x:this.n-this.x,recip=Math.floor(4194304/this.n),shift=0;
   if(!this.axis)return Math.min(a,b)+floorShift(Math.floor(d/512)*f*recip,13);
   while(d>1023){d=Math.floor(d/2);shift++;}return Math.min(a,b)+floorShift(d*f*recip,22)*2**shift;
  }
 }
 class Edge{
  constructor(a,b,y,side,dummy=false){
   this.a=a;this.b=b;this.side=side;const [x0,y0]=a.screen,[x1,y1]=b.screen;this.neg=x1<x0;
   if(dummy){this.x=x0;this.inc=0;this.major=false;this.lerp=new Lerp(0,0,0,1);this.dx=0;return;}
   this.xlen=Math.max(1,Math.abs(x1-x0));this.ylen=y1-y0;fail(this.ylen>=0,'non-monotone source edge');
   this.inc=!this.ylen?0:this.ylen===this.xlen&&this.xlen!==1?262144:Math.abs((x1-x0)*Math.floor(262144/this.ylen));
   this.major=this.inc>262144;
   const start=this.major?(side?(this.neg?393216:this.inc-131072):(this.neg?this.inc+131072:131072)):(this.neg&&this.inc?262144:0);
   this.dx=start+(y-y0)*this.inc;
   this.x=Math.max(Math.min(x0,x1),Math.min(Math.max(x0,x1)-(x0!==x1?1:0),x0+(this.neg?-1:1)*floorShift(this.dx,18)));
   const offset=this.inc>=262144&&(!!side!==this.neg)?1:0;this.lerp=new Lerp(y0-offset,y1-offset,y,1,a.w===undefined?4096:a.w,b.w===undefined?4096:b.w);
  }
  params(swapped){
   if(!this.major){if(!this.inc)return {length:1,coverage:swapped?0:31};let cov=floorShift(floorShift(this.dx,9)+floorShift(this.inc,10),4);if(floorShift(cov,5)!==floorShift(this.dx,18))cov=31;cov&=31;if((!!this.side!==this.neg)===swapped)cov=31-cov;return {length:1,coverage:cov};}
   let length=1;
   // Source initializes swapped-left length only implicitly; it is not used
   // by side0 startcov, and the final swapped length is always1.
   if(!swapped||this.side)length=(!!this.side!==this.neg)?floorShift(this.dx,18)-floorShift(this.dx-this.inc,18):floorShift(this.dx+this.inc,18)-floorShift(this.dx,18);
   let start=floorShift(this.dx,18);if(this.neg)start=this.xlen-start;if(this.side)start-=length-1;
   const cov=div((start*1024+511)*this.ylen,this.xlen)&1023;
   return {length:swapped?1:length,major:true,coverage:cov===1023?0:cov,increment:div(this.ylen*1024,this.xlen)&1023};
  }
  values(k){return this.a[k].map((v,i)=>this.lerp.at(v,this.b[k][i]));}
  z(){return this.lerp.z(this.a.z,this.b.z);}
  w(){return this.lerp.at(this.a.w===undefined?4096:this.a.w,this.b.w===undefined?4096:this.b.w);}
 }
 function span(p,y){
  if(!(y>=p.ytop&&y<p.ybottom||y===p.ytop&&y===p.ybottom))return null;
  const vs=p.vertices,n=vs.length,edges=[];
  if(p.ytop===p.ybottom){let l=0,r=0;for(const i of [1,n-1]){if(vs[i].screen[0]<vs[l].screen[0])l=i;if(vs[i].screen[0]>vs[r].screen[0])r=i;}edges.push(new Edge(vs[l],vs[l],y,0,true),new Edge(vs[r],vs[r],y,1,true));}
  else for(let side=0;side<2;side++){const dir=p.front!==!!side?1:-1;let cur=p.vtop,next=(cur+dir+n)%n,steps=0;while(y>=vs[next].screen[1]&&cur!==p.vbottom){cur=next;next=(cur+dir+n)%n;fail(++steps<=n,'edge traversal loop');}edges.push(new Edge(vs[cur],vs[next],y,side));}
  let [l,r]=edges,x0=l.x,x1=r.x;if(!r.inc&&(l.inc||x0!==x1)&&x1!==0)x1--;
  const swapped=x0>x1;if(swapped){[x0,x1]=[x1,x0];[l,r]=[r,l];}
  const lp=l.params(swapped),rp=r.params(swapped),a=Math.min(x0+lp.length,x1+1,256),b=Math.min(x1-rp.length+1,x1+1,256);
  return {x0,x1,a,b,lp,rp,w0:l.w(),w1:r.w(),z0:l.z(),z1:r.z(),uv0:l.values('uv'),uv1:r.values('uv'),c0:l.values('color9'),c1:r.values('color9'),yedge:y===p.ytop?4:y===p.ybottom-1?8:0,swapped};
 }
 function address(x,size,repeat,flip){let n=Math.floor(x/16);if(!repeat)return Math.max(0,Math.min(size-1,n));const period=size*(flip?2:1);n=((n%period)+period)%period;return flip&&n>=size?period-1-n:n;}
 function sample(p,uv,color9){const m=p.entry.material,t=p.entry.texture;let rgb=color9.map(x=>floorShift(x,3)),alpha=m.alpha_5bit;
  if(t){const f=p.entry.frame,x=address(uv[0],f?32:t.width,m.repeat_s,m.flip_s)+(f?f.x:0),y=address(uv[1],f?32:t.height,m.repeat_t,m.flip_t)+(f?f.y:0),i=(y*t.width+x)*4;
   rgb=rgb.map((v,c)=>{let n=t.data[i+c]>>>3;n=n?2*n+1:0;return ((n+1)*(v+1)-1)>>>6;});alpha=((Math.round(t.data[i+3]*31/255)+1)*(alpha+1)-1)>>>5;
  }return {rgb,alpha};
 }
 // Per-raster scratch only: never escapes, caches pixels or crosses invocations.
 function sampleInto(p,uv,color9,out){const m=p.entry.material,t=p.entry.texture,rgb=out.rgb;
  rgb[0]=floorShift(color9[0],3);rgb[1]=floorShift(color9[1],3);rgb[2]=floorShift(color9[2],3);let alpha=m.alpha_5bit;
  if(t){const f=p.entry.frame,x=address(uv[0],f?32:t.width,m.repeat_s,m.flip_s)+(f?f.x:0),y=address(uv[1],f?32:t.height,m.repeat_t,m.flip_t)+(f?f.y:0),i=(y*t.width+x)*4;
   let n=t.data[i]>>>3;n=n?2*n+1:0;rgb[0]=((n+1)*(rgb[0]+1)-1)>>>6;
   n=t.data[i+1]>>>3;n=n?2*n+1:0;rgb[1]=((n+1)*(rgb[1]+1)-1)>>>6;
   n=t.data[i+2]>>>3;n=n?2*n+1:0;rgb[2]=((n+1)*(rgb[2]+1)-1)>>>6;alpha=((Math.round(t.data[i+3]*31/255)+1)*(alpha+1)-1)>>>5;
  }out.alpha=alpha;return out;
 }
 function validateState(state){
  fail(state&&state.wBuffer===false&&state.fogEnabled===false&&state.alphaRef===0&&state.sortMode==='auto-y','explicit nativeState {wBuffer:false,fogEnabled:false,alphaRef:0,sortMode:"auto-y"} required');
  fail(Object.keys(state).every(k=>['wBuffer','fogEnabled','alphaRef','sortMode','zeroDotWLimit'].includes(k)),'unknown nativeState field');
  if(state.zeroDotWLimit!==undefined)fail(Number.isInteger(state.zeroDotWLimit)&&state.zeroDotWLimit>=0&&state.zeroDotWLimit<=0xffffff,'zeroDotWLimit');
 }

 // Ground model80 uses the same native raster path, not the billboard ABI.
 function exitFrameContext(frame,expected){
  fail(frame&&expected&&getCPU,'explicit renderer-owned field/frame expectation required');
  const cpu=getCPU();fail(cpu&&typeof cpu.verifyExitIndicatorFrame==='function','renderer frame verifier required');return cpu.verifyExitIndicatorFrame(frame,expected);
 }
 function exitGroundClipMatrix(target,e,perspective,context,frame,expected){
  const c=exitFrameContext(frame,expected),v=c.view;
  fail(!perspective&&context===undefined&&v.preset===4,'h_exit requires authentic preset4 ground view');
  fail(target.length===3&&v.targetFx12.every((n,i)=>target[i]*4096===n),'h_exit effective camera target mismatch');
  fail(ExitNative&&ExitNative.verifyEntry(e,c.expectedDraw)&&e.effect===c.descriptor,'crossed field effect entry');
  fail(e.key==='fldeff-0080-h-exit'&&e.scale===2&&!e.billboard&&!e.actor&&e.projectionPass==='effects','original model80 ground contract');
  const instance=e.matrixFx12.slice(),position=matrixMultiply(v.viewFx12,instance);
  for(let i=0;i<12;i++)position[i]=word(safe(position[i]*2,'h_exit POSSCALE'),'h_exit POSSCALE');
  const projection=P.slice();projection[14]=word(projection[14]+floorShift(projection[10]*16384+2048,12),'h_exit effects projection');
  fail(v.projectionFx12.every((n,i)=>n===P[i])&&v.effectsProjectionFx12.every((n,i)=>n===projection[i]),'h_exit source projection pair');
  return {view:v.viewFx12.slice(),instance,position,projection,clip:matrixMultiply(projection,position)};
 }

 function build(target,entries,state,actorMode=false,perspective=false,doorMode=false,context,exitFrame,exitExpected){validateState(state);if(exitFrame||exitExpected)exitFrameContext(exitFrame,exitExpected);cameraContext(target,perspective,context);if(context!==undefined)fail(actorMode===true&&doorMode===true,'camera context requires explicit door/actor mode');const polys=[],ram={polygons:0,vertices:0};let order=0;
  for(const e of entries.slice().sort((a,b)=>a.originalOrder-b.originalOrder)){
   fail(e.topology&&Array.isArray(e.topology.original_polygons),'original polygon topology missing');
   fail(!e.actor||actorMode,'actor requires separate actor diagnostic');
   const isExit=!!(e.effect&&e.effect.kind==='source-h-exit-native16');
   if(e.effect)fail(actorMode&&(isExit?ExitNative&&exitFrame&&exitExpected:Exclamation&&Exclamation.verifyEntry(e)),'effect requires native actor mode and exact kind admission');
   fail(!e.worldFx12||doorMode&&perspective,'animated node requires separate door diagnostic');
   const ground=isExit?exitGroundClipMatrix(target,e,perspective,context,exitFrame,exitExpected):null,door=e.worldFx12?doorClipMatrix(target,e,context):null,billboard=e.effect&&!isExit?effectBillboardClipMatrix(target,e,perspective,context):e.actor?billboardClipMatrix(target,e,perspective,context):null,matrix=ground?ground.clip:door?door.clip:billboard?billboard.clip:clipMatrix(target,e,perspective,context);let previous=null,lastRun=null,ordinal=0;
   e.topology.original_polygons.forEach((t,pi)=>{
    if(t.primitive_run!==lastRun){ordinal=0;previous=null;lastRun=t.primitive_run;}
    const p=makePolygonCore(target,e,t,pi,matrix,perspective,true);p.runOrdinal=ordinal++;if(ground)p.exitGround=bbCopy(ground);if(billboard)p.billboard=bbCopy(billboard);if(door)p.doorTransform=bbCopy(door);
    const q=prepare(p,previous,state,ram);previous=q;if(q){ram.polygons++;ram.vertices+=q.allocatedVertices;q.order=order++;polys.push(q);}
   });
  }
  fail(polys.length<=2048,'polygon RAM limit');fail(polys.reduce((n,p)=>n+p.allocatedVertices,0)<=6144,'vertex RAM limit');return polys.sort((a,b)=>a.sortkey-b.sortkey||a.order-b.order);
 }
 function render(target,entries,edgeState,state,stats={},actorMode=false,perspective=false,doorMode=false,context,exitFrame,exitExpected){
  validateState(state);fail(edgeState&&edgeState.antiAlias&&edgeState.alphaBlend,'AA and alpha blending must be enabled');fail(!edgeState.clear.fog,'clear fog');
  const c=cameraContext(target,perspective,context),polys=build(target,entries,state,actorMode,perspective,doorMode,context,exitFrame,exitExpected),result=rasterPolygons(polys,edgeState,stats);result.viewFx12=c?c.viewFx12.slice():view(target,perspective);result.projectionFx12=c?c.projectionFx12.slice():(perspective?P0:P).slice();if(c)result.cameraContext=c;result.limits=c?CAMERA_LIMITS:doorMode?DOOR_LIMITS:perspective?PERSPECTIVE_LIMITS:actorMode?ACTOR_LIMITS:LIMITS;if(actorMode){result.effectsProjectionFx12=c?c.effectsProjectionFx12.slice():result.projectionFx12.map((v,i)=>i===14?v+4*result.projectionFx12[10]:v);result.actorState='ordinary FlushP, identity instance and node, model376, effective attr0x001f8081; audited source frame';}if(entries.some(e=>e.effect&&e.effect.kind==='source-command75-native16')){result.limits=Object.freeze(result.limits.concat(Exclamation.limits));result.effectState='command75 model85 full billboard, POSSCALE4, native16x16 texture4 frame0, attr0x001f8080; live source owner';}if(entries.some(e=>e.effect&&e.effect.kind==='source-h-exit-native16')){result.limits=Object.freeze(result.limits.concat(EXIT_INDICATOR_LIMITS));result.exitIndicatorState='model80 ground quad, POSSCALE2, cardinal Y rotation, exact preset4 renderer/frame authority; host lifecycle not integrated';}return result;
 }
 function rasterPolygons(polys,edgeState,stats={}){
  const clear=edgeState.clear,zClear=clear.depth15*512+511;
  function layer(){const rgb=new Uint8Array(N*3),z=new Uint32Array(N),attr=new Uint32Array(N),alpha=new Uint8Array(N),owner=new Int32Array(N);z.fill(zClear);attr.fill(clear.opaque_polygon_id<<24);alpha.fill(clear.alpha5);owner.fill(-1);for(let i=0;i<N;i++)for(let c=0;c<3;c++)rgb[i*3+c]=clear.rgb5[c]?clear.rgb5[c]*2+1:0;return {rgb,z,attr,alpha,owner};}
  const uvScratch=[0,0],colorScratch=[0,0,0],sampleScratch={rgb:[0,0,0],alpha:0};
  const top=layer(),bottom=layer();stats.nativePolygons=polys.length;stats.nativeClippedPolygons=polys.filter(p=>p.vertices.some(v=>v.clipped)).length;stats.nativeFragments=0;stats.nativeAlphaRejected=0;stats.nativeDepthRejected=0;
  function passes(p,z,d,i){return p.attr&16384?Math.abs(d.z[i]-z)<=512:p.front&&(d.attr[i]&0x400010)===16?z<=d.z[i]:z<d.z[i];}
  function copy(dst,src,i){dst.z[i]=src.z[i];dst.attr[i]=src.attr[i];dst.alpha[i]=src.alpha[i];dst.owner[i]=src.owner[i];const j=i*3;dst.rgb[j]=src.rgb[j];dst.rgb[j+1]=src.rgb[j+1];dst.rgb[j+2]=src.rgb[j+2];}
  function translucent(p,d,i,z,f,pa){let attr=(pa&0xe0f0)|((pa>>>8)&0xff0000)|0x400000|(d.attr[i]&0xff001f0f);if((d.attr[i]&0x7f0000)===(attr&0x7f0000))return;if(!(d.attr[i]&0x8000))attr&=~0x8000;
   for(let c=0;c<3;c++)d.rgb[i*3+c]=d.alpha[i]?(f.rgb[c]*(f.alpha+1)+d.rgb[i*3+c]*(31-f.alpha))>>>5:f.rgb[c];d.alpha[i]=Math.max(f.alpha,d.alpha[i]);d.attr[i]=attr;if(p.attr&2048)d.z[i]=z;
  }
  polys.forEach((p,owner)=>{if(p.degenerate)return;const pa=(p.attr&0x3f008000)|(p.front?0:16);
   for(let y=p.ytop;y<Math.min(H,p.ybottom===p.ytop?p.ytop+1:p.ybottom);y++){
    const s=span(p,y);if(!s)continue;const lc=s.lp,rc=s.rp;let lcov=lc.coverage,rcov=rc.coverage;
    const firstX=Math.max(0,s.x0),endX=Math.min(256,s.x1+1);
    if(firstX>=endX)continue; // Empty clipped spans must not construct a horizontal interpolator.
    let lerp;
    for(let x=firstX;x<endX;x++){
     stats.nativeFragments++;
     // Scanline-local object only; first-pixel construction retains failure/stat ordering.
     if(x===firstX)lerp=new Lerp(s.x0,s.x1+1,x,0,s.w0,s.w1);
     else{lerp.x=x-s.x0;
      if(lerp.n&&!lerp.linear){const num=(lerp.x*s.w0*2**lerp.shift)>>>0,den=(lerp.x*s.w0+(lerp.n-lerp.x)*s.w1)>>>0;lerp.factor=den?Math.floor(num/den):0;}}
     const i=y*W+x,z=lerp.z(s.z0,s.z1);let d=top;
     if(!passes(p,z,d,i)){if(!(d.attr[i]&15)||!passes(p,z,bottom,i)){stats.nativeDepthRejected++;continue;}d=bottom;}
     const uv=uvScratch;uv[0]=lerp.at(s.uv0[0],s.uv1[0]);uv[1]=lerp.at(s.uv0[1],s.uv1[1]);fail(uv[0]>=-32768&&uv[0]<=32767&&uv[1]>=-32768&&uv[1]<=32767,'interpolated UV exceeds signed16');
     for(let c=0;c<3;c++)colorScratch[c]=lerp.at(s.c0[c],s.c1[c]);
     const f=sampleInto(p,uv,colorScratch,sampleScratch);if(!f.alpha){stats.nativeAlphaRejected++;continue;}
     const left=x<s.a,right=!left&&x>=s.b,edge=s.yedge|(left?1:right?2:0);
     if(f.alpha===31){let cov=31;if(left){cov=lc.major?Math.min(31,lcov>>5):lc.coverage;if(lc.major)lcov+=lc.increment;}else if(right){cov=rc.major?Math.max(0,31-(rcov>>5)):rc.coverage;if(rc.major)rcov+=rc.increment;}
      if(edge&&d===top)copy(bottom,top,i);d.z[i]=z;d.attr[i]=pa|edge|(edge?cov<<8:0);d.alpha[i]=31;d.owner[i]=owner;const j=i*3;d.rgb[j]=f.rgb[0];d.rgb[j+1]=f.rgb[1];d.rgb[j+2]=f.rgb[2];
     }else{const was=!!(d.attr[i]&15);translucent(p,d,i,z,f,pa);if(was&&d===top)translucent(p,bottom,i,z,f,pa);}
    }
   }
  });
  const rgba=new Uint8ClampedArray(N*4),finalAlpha=new Uint8Array(top.alpha),finalAttr=new Uint32Array(top.attr),marked=new Uint8Array(N),finalRgb=new Uint8Array(top.rgb);stats.nativeEdgeMarkedPixels=0;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
   const i=y*W+x;if(!(top.attr[i]&15))continue;let cov=(top.attr[i]>>>8)&31;
   const neighbors=[x?i-1:-1,x+1<W?i+1:-1,y?i-W:-1,y+1<H?i+W:-1];
   if(edgeState.enabled&&neighbors.some(n=>(top.attr[i]>>>24)!==(n<0?clear.opaque_polygon_id:top.attr[n]>>>24)&&top.z[i]<(n<0?zClear:top.z[n]))){const color=edgeState.table[(top.attr[i]>>>24)>>>3];for(let c=0;c<3;c++){const n=(color>>>(c*5))&31;finalRgb[i*3+c]=n?2*n+1:0;}cov=16;finalAttr[i]=(finalAttr[i]&0xffffe0ff)|0x1000;marked[i]=1;stats.nativeEdgeMarkedPixels++;}
   if(cov===31)continue;
   if(cov===0){const j=i*3;finalRgb[j]=bottom.rgb[j];finalRgb[j+1]=bottom.rgb[j+1];finalRgb[j+2]=bottom.rgb[j+2];finalAlpha[i]=bottom.alpha[i];}
   else{if(bottom.alpha[i])for(let c=0;c<3;c++)finalRgb[i*3+c]=(finalRgb[i*3+c]*(cov+1)+bottom.rgb[i*3+c]*(31-cov))>>>5;finalAlpha[i]=(top.alpha[i]*(cov+1)+bottom.alpha[i]*(31-cov))>>>5;}
  }
  for(let i=0;i<N;i++){for(let c=0;c<3;c++){const n=finalRgb[i*3+c];rgba[i*4+c]=(n<<2)|(n>>>4);}rgba[i*4+3]=255;}
  return {rgba,top,bottom,finalAlpha,finalAttr,marked,metadataStage:"top/bottom pre-final; finalAttr/finalAlpha post-final",polygons:polys,stats};
 }
 return {captureSourceGeometry,captureSourceEntry,exitIndicatorLimits:EXIT_INDICATOR_LIMITS,cameraAnimationMode:CAMERA_ANIMATION_MODE,cameraAnimationLimits:CAMERA_ANIMATION_LIMITS,cameraPondMode:CAMERA_POND_MODE,cameraPondLimits:CAMERA_POND_LIMITS,cameraMode:CAMERA_MODE,cameraLimits:CAMERA_LIMITS,admitCamera,mode:MODE,actorMode:ACTOR_MODE,perspectiveMode:PERSPECTIVE_MODE,perspectiveLimits:PERSPECTIVE_LIMITS,doorMode:DOOR_MODE,doorLimits:DOOR_LIMITS,actorPosition,limits:LIMITS,actorLimits:ACTOR_LIMITS,render,build,validateState,math:{rasterPolygons,div,floorShift,word,matrixMultiply,transform,view,clipMatrix,doorClipMatrix,billboardClipMatrix,effectBillboardClipMatrix,isqrt,viewport,depth,facing,clipVertices,Lerp,Edge,span,sample,makePolygon,prepare}};
});
