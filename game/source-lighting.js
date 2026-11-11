/* Source parameters plus integer lighting adapted from melonDS GPU3D.cpp.
 * Copyright2016-2026 melonDS team; GPL-3.0-or-later, see assets/ds-lighting/reference/LICENSE.
 * Not original-hardware acceptance. Matrix/raster limitations remain documented. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SourceLighting=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  var MODE='source-parameters/melonDS-integer-RGB5';
  var LIMITS=Object.freeze([
    'Integer NORMAL/light transformation, per-product truncation, signed packing, diffuse/specular/shininess arithmetic and RGB5 saturation follow the supplied pinned melonDS reference.',
    'Static selected instances use source-derived exact SDK preset view rotations. Full billboards use the traced FlushP/default SBC_BB LOAD identity normal basis; their position raster remains approximate.',
    'All current source materials disable the shininess table; explicit128-byte tables are supported and required if enabled.',
    'Explicit COLOR-command RGB remains unchanged. Geometry, pixel interpolation, texture modulation, alpha/depth precision remain separate approximations.',
    'No emulator source execution, original-hardware capture or browser acceptance is implied.'
  ]);
  function assert(ok,message){if(!ok)throw new Error('SourceLighting: '+message);}
  function integer(x,label){assert(Number.isSafeInteger(x),label+' must be a safe integer');return x;}
  function rgb5(value){return [value&31,(value>>>5)&31,(value>>>10)&31];}
  function rgbUnit(value){return rgb5(value).map(function(x){return x/31;});}
  function packRGB(c){assert(c.length===3&&c.every(function(x){return Number.isInteger(x)&&x>=0&&x<=31;}),'invalid RGB5');return c[0]|(c[1]<<5)|(c[2]<<10);}
  function signed10(x){x&=1023;return x&512?x-1024:x;}
  function packDirectionComponent(raw){integer(raw,'raw light component');raw=(raw<<16)>>16;raw=Math.max(-4096,Math.min(4096,raw));return signed10((raw>>3)&1023)/512;}
  function packDirection(v){assert(v.length===3,'light direction needsXYZ');return v.map(packDirectionComponent);}
  function parseText(text){
    var lines=text.replace(/\r/g,'').split('\n').map(function(x){return x.trim();}).filter(Boolean),records=[],i=0;
    function row(n){assert(i<lines.length,'unexpected lightingEOF');var line=lines[i++];assert(line!=='EOF','unexpected lightingEOF');var parts=line.split(',').filter(function(x){return x!=='';}).map(function(x){assert(/^-?\d+$/.test(x),'invalid integer token');return Number(x);});assert(parts.length===n,'lighting row length expected'+n);return parts;}
    while(i<lines.length&&lines[i]!=='EOF'){
      var endpoint=row(1)[0],lights=[],enabledMask=0;
      for(var slot=0;slot<4;slot++){
        var p=row(7);assert(p[0]===0||p[0]===1,'invalid light enable flag');if(!p[0])p=[0,0,0,0,0,0,0];packRGB(p.slice(1,4));
        if(p[0])enabledMask|=1<<slot;
        lights.push({slot:slot,enabled:!!p[0],rgb5:p.slice(1,4),rgb:p.slice(1,4).map(function(x){return x/31;}),direction_fx12:p.slice(4),direction:packDirection(p.slice(4))});
      }
      var diffuse=row(3),ambient=row(3),specular=row(3),emission=row(3);[diffuse,ambient,specular,emission].forEach(packRGB);
      records.push({endHalfSeconds:endpoint,enabledMask:enabledMask,lights:lights,material:{diffuse:diffuse,ambient:ambient,specular:specular,emission:emission,setVertexColor:false,shininessTable:false}});
    }
    assert(lines[i]==='EOF'&&i===lines.length-1,'expected final EOF marker');assert(records.length>0,'empty lighting table');
    records.forEach(function(r,k){assert(r.endHalfSeconds>=0&&r.endHalfSeconds<=43200,'endpoint out of day range');if(k)assert(records[k-1].endHalfSeconds<r.endHalfSeconds,'endpoints must increase');});
    return records;
  }
  function halfSeconds(seconds){integer(seconds,'secondsOfDay');assert(seconds>=0&&seconds<86400,'secondsOfDay must be0..86399');return Math.floor(seconds/2);}
  function selectInitial(records,seconds){var t=halfSeconds(seconds);for(var i=0;i<records.length;i++)if(records[i].endHalfSeconds>t)return i;return 0;}
  function tickSelection(records,index,seconds){integer(index,'record index');assert(index>=0&&index<records.length,'record index out of range');var t=halfSeconds(seconds),start=index>0?records[index-1].endHalfSeconds:0,end=records[index].endHalfSeconds;return records.length>1&&(t>=end||t<start)?(index+1)%records.length:index;}
  function tableForHeader(mesh,header){var h=mesh.headers.find(function(h){return h.header===Number(header);});assert(h,'unknown header');return h.area_raw_u16[3]===0?'interior':'outdoor';}
  function createSelection(tables,group,seconds){
    var selection=selectionFromState(tables);selection.reset(group,seconds);return selection;
  }
  function selectionFromState(tables,state){
    function reset(nextGroup,nextSeconds){assert(tables[nextGroup],'missing light group');state={group:String(nextGroup),index:selectInitial(tables[nextGroup],nextSeconds),secondsOfDay:nextSeconds,updates:0};return current();}
    function current(){return {group:state.group,index:state.index,secondsOfDay:state.secondsOfDay,updates:state.updates,record:tables[state.group][state.index]};}
    function update(nextSeconds){state.index=tickSelection(tables[state.group],state.index,nextSeconds);state.secondsOfDay=nextSeconds;state.updates++;return current();}
    return {reset:reset,update:update,current:current,fork:function(){return selectionFromState(tables,Object.assign({},state));}};
  }
  function flagsFromRaw(material){var hex=material.raw_record_hex;assert(typeof hex==='string'&&hex.length>=64,'raw material record missing');return parseInt(hex.slice(60,62),16)|(parseInt(hex.slice(62,64),16)<<8);}
  function packedGlobal(record){var m=record.material;return {diffuseAmbient:(packRGB(m.diffuse)|(packRGB(m.ambient)<<16)|(m.setVertexColor?32768:0))>>>0,specularEmission:(packRGB(m.specular)|(packRGB(m.emission)<<16)|(m.shininessTable?32768:0))>>>0};}
  function selectedPacked(local,global,flags,shift){
    var mask=0;if(flags&(1<<shift))mask|=0x7fff;if(flags&(1<<(shift+1)))mask|=0x7fff0000;if(flags&(1<<(shift+2)))mask|=0x8000;
    return ((local&mask)|(global&~mask))>>>0;
  }
  function resolveMaterial(material,record,policy){
    var flags=flagsFromRaw(material),localDA=material.diffuse_ambient_raw>>>0,localSE=material.specular_emission_raw>>>0,global=packedGlobal(record);
    assert(['global_selectors','global_rgb_copy','embedded'].indexOf(policy)>=0,'unknown material routing policy');
    if(policy==='global_selectors')flags&=~(0x40|0x80|0x200|0x400);
    if(policy==='global_rgb_copy'){
      // SetDiff/Amb/Spec/EmiAll replace RGB fields; bit15 keeps source's local flag.
      localDA=((global.diffuseAmbient&0x7fff7fff)|(localDA&0x80008000))>>>0;
      localSE=((global.specularEmission&0x7fff7fff)|(localSE&0x80008000))>>>0;
    }
    var da=selectedPacked(localDA,global.diffuseAmbient,flags,6),se=selectedPacked(localSE,global.specularEmission,flags,9);
    return {policy:policy,flags:flags,diffuseAmbient:da,specularEmission:se,diffuse:rgbUnit(da),ambient:rgbUnit(da>>>16),specular:rgbUnit(se),emission:rgbUnit(se>>>16),setVertexColor:!!(da&32768),shininessTable:!!(se&32768),lightMask:material.light_mask};
  }
  function normalizeAuditTables(audit){
    var out={};Object.keys(audit.groups).forEach(function(group){out[group]=audit.groups[group].records.map(function(r){
      var m=r.material;return {endHalfSeconds:r.end_half_seconds,enabledMask:r.enabled_mask,
        lights:r.lights.map(function(l){return {slot:l.index,enabled:l.enabled,rgb5:l.rgb5.slice(),rgb:l.rgb5.map(function(x){return x/31;}),direction_fx12:l.direction_text_fx12.slice(),direction:l.direction_effective.slice()};}),
        material:{diffuse:m.diffuse.rgb5.slice(),ambient:m.ambient.rgb5.slice(),specular:m.specular.rgb5.slice(),emission:m.emission.rgb5.slice(),setVertexColor:r.global_diffuse_set_vertex_color,shininessTable:r.global_specular_use_shininess_table}};
    });});return out;
  }
  function resolveAuditedMaterial(meta,record){
    var out={flags:meta.runtime_flags,lightMask:meta.light_mask,setVertexColor:meta.diffuse_set_vertex_color,shininessTable:meta.specular_use_shininess_table,overrideReason:meta.override_reason};
    ['diffuse','ambient','specular','emission'].forEach(function(k){var f=meta.rgb_fields[k];assert(f&&(f.source==='record'||f.source==='embedded'),'unverified material RGB routing');var rgb=f.source==='record'?record.material[k]:f.embedded_rgb5;packRGB(rgb);out[k]=rgb.map(function(x){return x/31;});});
    return out;
  }
  function validateAudit(data){
    var mesh=data.mesh,audit=data.lighting;assert(audit&&audit.format===1,'lighting audit missing');assert(audit.source_mesh_sha256===data.provenance.mesh_sha256,'lighting audit belongs to a different mesh');
    var counts={normal:0,color:0,batches:0};
    Object.keys(mesh.models).forEach(function(key){var ms=mesh.models[key],ls=audit.models[key];assert(ls&&ls.length===ms.length,'lighting model mismatch '+key);ms.forEach(function(m,mi){var lm=ls[mi];assert(m.name===lm.name&&m.materials.length===lm.materials.length&&m.draw_batches.length===lm.batches.length,'lighting model layout mismatch '+key);
      m.materials.forEach(function(mat,i){assert(mat.name===lm.materials[i].name&&mat.light_mask===lm.materials[i].light_mask,'lighting material mismatch');assert(flagsFromRaw(mat)===lm.materials[i].raw_flags,'lighting material flags mismatch');});
      m.draw_batches.forEach(function(b,bi){var lb=lm.batches[bi],n=lb.color_source==='normal'?1:0;assert(lb.name===b.name&&lb.material===b.material,'lighting batch mismatch');assert(lb.color_source==='normal'||lb.color_source==='color','unsupported mixed source batch');assert(lb.vertices_before_color_or_normal===0,'unresolved initial GPU color state');assert(lb.color_source_per_vertex.length===b.vertex_count&&lb.color_source_per_vertex.every(function(x){return x===n;}),'lighting vertex selector mismatch');counts[lb.color_source]+=b.vertex_count;counts.batches++;});
    });});
    assert(counts.normal===audit.vertex_selector_counts.normal&&counts.color===audit.vertex_selector_counts.color,'lighting selector counts mismatch');return counts;
  }
  function transformDirection(matrix,n){return [matrix[0]*n[0]+matrix[4]*n[1]+matrix[8]*n[2],matrix[1]*n[0]+matrix[5]*n[1]+matrix[9]*n[2],matrix[2]*n[0]+matrix[6]*n[1]+matrix[10]*n[2]];}
  function shadeDiffuseApprox(normal,material,record){
    // Chosen conventional diagnostic, NOT an assertion about DS hardware math.
    // Source vector lengths, quantized packed directions and normal magnitudes are retained.
    var color=material.emission.slice();
    record.lights.forEach(function(light,slot){
      if(!light.enabled||!(material.lightMask&(1<<slot)))return;
      var d=Math.max(0,Math.min(1,-(normal[0]*light.direction[0]+normal[1]*light.direction[1]+normal[2]*light.direction[2])));
      for(var c=0;c<3;c++)color[c]+=light.rgb[c]*(material.ambient[c]+material.diffuse[c]*d);
    });
    return color.map(function(x){return Math.max(0,Math.min(1,x));});
  }
  // Adapted from melonDS GPU3D.cpp, revision497aa6c, GPL-3.0-or-later.
  // Copyright2016-2026 melonDS team. Source/license and exact line provenance retained.
  function fx12Rotation(matrix){assert(matrix&&matrix.length===16,'16-component matrix required');return matrix.map(function(x){assert(Number.isFinite(x),'nonfinite matrix');return Math.round(x*4096)|0;});}
  function identityFx12(){return [4096,0,0,0,0,4096,0,0,0,0,4096,0,0,0,0,4096];}
  function sourceViewFx12(preset){
    var yz=preset===0?[2107,3512]:preset===4?[2629,3140]:null;assert(yz,'only verified camera presets0/4');
    return [4096,0,0,0,0,yz[0],yz[1],0,0,-yz[1],yz[0],0,0,0,0,4096];
  }
  function multiplyRotationFx12(a,b){
    var out=identityFx12();for(var column=0;column<3;column++)for(var row=0;row<3;row++){
      var sum=0;for(var k=0;k<3;k++)sum+=a[k*4+row]*b[column*4+k];
      assert(Number.isSafeInteger(sum),'matrix sum outside safe integer range');out[column*4+row]=Math.floor(sum/4096)|0;
    }return out;
  }
  function dotMatrixRaw(v,m,row){var n=v[0]*m[row]+v[1]*m[4+row]+v[2]*m[8+row];assert(Number.isSafeInteger(n),'unsafe fixed dot');return n|0;}
  function transformedNormal(raw,matrix){assert(raw.length===3&&raw.every(function(x){return Number.isInteger(x)&&x>=-512&&x<=511;}),'NORMAL must be raw signed10');return [0,1,2].map(function(row){return (dotMatrixRaw(raw,matrix,row)<<9)>>21;});}
  function prepareIntegerLights(record,viewFx12){
    return record.lights.map(function(light){
      var raw=light.direction.map(function(x){var n=x*512;assert(Number.isInteger(n)&&n>=-512&&n<=511,'LIGHT_VECTOR must be raw signed10');return n;});
      var sums=[0,1,2].map(function(row){return dotMatrixRaw(raw,viewFx12,row);});
      var vector=sums.map(function(n){return (- (n>>12)<<21)>>21;}),den=-((sums[2]<<9)>>21)+512;
      return {vector:vector,reciprocal:den===0?0:Math.trunc(262144/den),rgb5:light.rgb5.slice()};
    });
  }
  function materialRGB5(material){var out={lightMask:material.lightMask,shininessTable:!!material.shininessTable};['diffuse','ambient','specular','emission'].forEach(function(k){out[k]=material[k].map(function(v){var n=Math.round(v*31);assert(n>=0&&n<=31&&Math.abs(v*31-n)<1e-8,'material must derive from RGB5');return n;});});return out;}
  function integerLighting(rawNormal,normalMatrixFx12,lights,material,shininess){
    var normal=transformedNormal(rawNormal,normalMatrixFx12),acc=material.emission.map(function(c){return c<<14;}),trace=[];
    if(material.shininessTable)assert(shininess&&shininess.length===128&&Array.from(shininess).every(function(x){return Number.isInteger(x)&&x>=0&&x<=255;}),'explicit128-byte shininess table required');
    for(var i=0;i<4;i++){
      if(!(material.lightMask&(1<<i)))continue;var light=lights[i];assert(light,'missing selected light');
      // Truncate each product before summing, preserving signed11/14 and20-bit stages.
      var dot=((light.vector[0]*normal[0])>>9)+((light.vector[1]*normal[1])>>9)+((light.vector[2]*normal[2])>>9),initialDot=dot,shine=0,diffdot=null;
      if(dot>0){
        diffdot=(dot<<21)>>21;
        for(var c=0;c<3;c++)acc[c]=(acc[c]+((material.diffuse[c]*light.rgb5[c]*diffdot)&0xFFFFF))>>>0;
        dot+=normal[2];dot=(dot<<21)>>21;dot=((dot*dot)>>10)&0x3FF;
        shine=((dot*light.reciprocal)>>8)-512;
        if(shine<0)shine=0;else{shine=(shine<<18)>>18;if(shine<0)shine=0;else if(shine>511)shine=511;}
      }
      if(material.shininessTable)shine=shininess[shine>>2]<<1;
      for(var channel=0;channel<3;channel++)acc[channel]=(acc[channel]+((material.specular[channel]*shine)+(material.ambient[channel]<<9))*light.rgb5[channel])>>>0;
      trace.push({slot:i,dot:initialDot,diffdot:diffdot,shine:shine});
    }
    return {rgb5:acc.map(function(c){return Math.min(31,c>>>14);}),normal:normal,accumulator:acc,lights:trace};
  }
  function shadeVertices(vertices,colorSource,material,record,worldMatrix,options){
    assert(vertices.length%11===0,'invalid11-component vertex buffer');assert(colorSource==='normal'||colorSource==='color','unverified vertex color source');
    var output=new Float32Array(vertices);if(colorSource==='color')return output;options=options||{};
    var view=options.viewFx12||identityFx12(),world=options.worldFx12||fx12Rotation(worldMatrix),normalMatrix=options.normalMatrixFx12||multiplyRotationFx12(view,world),lights=prepareIntegerLights(record,view),mat=materialRGB5(material);
    for(var i=0;i<vertices.length;i+=11){var raw=vertices.slice(i+5,i+8).map(function(v){var n=v*512;assert(Number.isInteger(n),'source normal is not exactFX9');return n;}),result=integerLighting(raw,normalMatrix,lights,mat,options.shininessTable);for(var c=0;c<3;c++)output[i+8+c]=result.rgb5[c]/31;}
    return output;
  }
  return {mode:MODE,limits:LIMITS,fx12Rotation:fx12Rotation,identityFx12:identityFx12,sourceViewFx12:sourceViewFx12,multiplyRotationFx12:multiplyRotationFx12,transformedNormal:transformedNormal,prepareIntegerLights:prepareIntegerLights,materialRGB5:materialRGB5,integerLighting:integerLighting,parseText:parseText,packRGB:packRGB,rgb5:rgb5,packDirection:packDirection,packDirectionComponent:packDirectionComponent,selectInitial:selectInitial,tickSelection:tickSelection,tableForHeader:tableForHeader,createSelection:createSelection,flagsFromRaw:flagsFromRaw,resolveMaterial:resolveMaterial,transformDirection:transformDirection,shadeDiffuseApprox:shadeDiffuseApprox,shadeVertices:shadeVertices,normalizeAuditTables:normalizeAuditTables,resolveAuditedMaterial:resolveAuditedMaterial,validateAudit:validateAudit};
});
