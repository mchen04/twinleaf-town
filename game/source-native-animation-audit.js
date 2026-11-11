(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-native-bytes.js'),require('./source-native-perspective-audit.js'),require('./source-native-pond-audit.js'));
 else root.SourceNativeAnimationAudit=factory(root.SourceNativeBytes,root.SourceNativePerspectiveAudit,root.SourceNativePondAudit);
})(typeof globalThis!=='undefined'?globalThis:this,function(Bytes,World,Pond){
 'use strict';
 const perspectiveMode='native-perspective-animation-diagnostic',orthoMode='native-ortho-animation-diagnostic',key='9555eb0a476369f1dd67',frames=[{"index":0,"texture_key":"9555eb0a476369f1dd67","source":{"path":"verify-diamond-packet-jyti2bav/extracted/pokediamond/files/fielddata/build_model/build_model/narc_0082.bin","bytes":2640,"sha256":"5304733cf76347f8d417bb32f46bc49f6bfa07f7e317b0024a1e1c10ddf55e8b","git_blob_sha1":"6c4d690f44168d6590a5dc201e978cfc58071698"},"texture":"tv01.1","palette":"tv01","format":3,"width":32,"height":32,"rgba_sha256":"a8cc7696dedf5e9f75e663f9f90e80be70eca706b8793bdf44a6a23bb12350bc","png_sha256":"9555eb0a476369f1dd67e06da0943e1fdcdf9377ebbd5b20c92549d0ba928486","pixels_offset":1552,"pixels_bytes":512,"pixels_sha256":"bed9d19086d922d76a710ceae7dfd99b61903c46791f76cc2b439760456589f2","palette_offset":2576,"palette_bytes":32,"palette_sha256":"7d0411452bcc2c9f607e9f68c9a9f13d99e92011e9d0506d2a0bcc1d5c6c589f","texture_entry_offset":1440,"texture_entry_hex":"0000200d20000180","palette_entry_offset":1512,"palette_entry_hex":"00000000"},{"index":1,"texture_key":"9555eb0a476369f1dd67","source":{"path":"verify-diamond-packet-jyti2bav/extracted/pokediamond/files/fielddata/build_model/build_model/narc_0082.bin","bytes":2640,"sha256":"5304733cf76347f8d417bb32f46bc49f6bfa07f7e317b0024a1e1c10ddf55e8b","git_blob_sha1":"6c4d690f44168d6590a5dc201e978cfc58071698"},"texture":"tv01.2","palette":"tv01.2_pl","format":3,"width":32,"height":32,"rgba_sha256":"b3fddd8abdc4fe69dc53d4b49b45d19d894ff117ff4f9739b02aacf16589d184","png_sha256":"1b82922488190895cf593d5fdd0f38196b9547cfdd98261eb9e84eb6c67cfd91","pixels_offset":2064,"pixels_bytes":512,"pixels_sha256":"346fe4a0f061ae88e0edbfc5bbdc419cac5923f59be9170f4c7736f44776279b","palette_offset":2608,"palette_bytes":32,"palette_sha256":"145361e49eba82f3c638ba74a96280f060489c37b92aea9e165b5dcac51109f6","texture_entry_offset":1448,"texture_entry_hex":"4000200d20000180","palette_entry_offset":1516,"palette_entry_hex":"04000000"}];
 const limits=Object.freeze(['Exactly two model82 material1 tv01_mat source texture/palette pairs plus four original pond frames; all51 decoded world texture payloads and persistent replacement keys are checked in town and every source interior.','TV phases0/1 select pair0, phases2/3 select pair1; caller advances one shared phase once per enabled source logic update. Renderer does not advance or reset animation.','Original source UVs, material repeat/flip and shade material0 are unchanged. PC animation, arbitrary replacements, materials or geometry, camera overrides, fog/W-buffer/nonzero alphaRef remain unsupported.','Seven source scenes use admitted preset0/preset4 only. No browser, gameplay timing, hardware parity or original display composition acceptance.']);
 function check(ok,message){if(!ok)throw Error('Native animation unsupported: '+message);}
 function target(){
  check(Bytes&&typeof Bytes.sha256==='function'&&typeof Bytes.copy==='function'&&World&&typeof World.verify==='function'&&Pond&&typeof Pond.verify==='function','source byte gates are not loaded');
  const t=World.records.find(t=>t.key===key);
  check(t&&t.format===3&&t.width===32&&t.height===32&&t.rgba_sha256===frames[0].rgba_sha256&&t.sources[0].sha256===frames[0].source.sha256&&t.uses.length===1&&t.uses[0].model==='building-0082'&&t.uses[0].material_index===1&&t.uses[0].material==='tv01_mat','TV source target metadata');return t;
 }
 function verify(texture,k){
  if(k!==key)return Pond.verify(texture,k);
  const t=target();check(texture&&texture.width===32&&texture.height===32&&Bytes.isBytes(texture.data)&&texture.data.length===4096,'TV dimensions/bytes');
  const hash=Bytes.sha256(texture.data),frame=frames.find(f=>f.rgba_sha256===hash);check(frame,'TV pixels are not an exact source texture/palette pair');return Object.freeze({...t,tvFrame:frame.index});
 }
 function verifyBindings(mesh){
  target();check(mesh&&mesh.models&&Object.keys(mesh.models).length===35,'source model graph');
  const models=mesh.models['building-0082'],uses=[];
  check(models&&models.length===1&&models[0].name==='tv01'&&models[0].materials.length===2,'TV model binding');
  const expected=[{"name":"shade","raw_record_hex":"00002c0048b500000000000080000c00fff81f3f00000000ffffffff0000ce1f000000000010000000100000","texture_name":null,"palette_name":null,"polygon_attributes":786560,"texture_parameters":0,"alpha_5bit":12,"light_mask":0,"polygon_mode":0,"render_back":false,"render_front":true,"repeat_s":false,"repeat_t":false,"flip_s":false,"flip_t":false,"diffuse_ambient_raw":46408,"specular_emission_raw":0,"texture":null},{"name":"tv01_mat","raw_record_hex":"00002c000080ff7f0000000080001f14fff81f3f00000300ffffffff0000ce1f200020000010000000100000","texture_name":"tv01.1","palette_name":"tv01","polygon_attributes":337576064,"texture_parameters":196608,"alpha_5bit":31,"light_mask":0,"polygon_mode":0,"render_back":false,"render_front":true,"repeat_s":true,"repeat_t":true,"flip_s":false,"flip_t":false,"diffuse_ambient_raw":2147450880,"specular_emission_raw":0,"texture":"9555eb0a476369f1dd67"}];
  models[0].materials.forEach((m,i)=>check(m&&Object.keys(m).length===Object.keys(expected[i]).length&&Object.keys(expected[i]).every(k=>m[k]===expected[i][k]),'TV source material '+i+' changed'));
  for(const [model,ms] of Object.entries(mesh.models))ms.forEach((m,mi)=>m.materials.forEach((material,index)=>{if(material.texture===key)uses.push([model,mi,index]);}));
  check(JSON.stringify(uses)==='[["building-0082",0,1]]','TV texture key is not uniquely bound to material1');
 }
 function verifyTextures(textures,replacementKeys,mesh){
  verifyBindings(mesh);check(replacementKeys&&typeof replacementKeys[Symbol.iterator]==='function'&&[...replacementKeys].every(k=>k===key||k===Pond.key),'only the exact pond and TV targets may be replaced');
  check(textures&&Object.keys(textures).length===World.records.length&&World.records.every(t=>Object.hasOwn(textures,t.key)),'source texture set');
  for(const t of World.records)verify(textures[t.key],t.key);
  return Object.freeze({pondFrame:verify(textures[Pond.key],Pond.key).pondFrame,tvFrame:verify(textures[key],key).tvFrame});
 }
 Bytes.freeze(frames);return Object.freeze({perspectiveMode,orthoMode,key,frames,limits,verify,verifyBindings,verifyTextures});
});
