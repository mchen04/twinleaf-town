(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-native-bytes.js'),require('./source-native-neighbor-data.js'),{"format":1,"baseFileSHA256":"6d7df39bd9c1b7294dffc89fa9d4b5dba745fe2316858a8638d59abca443eaf7","contractFileSHA256":"dbe3fda1fb05fa9ed65486f677333c667d68c8de2f78deb59ca9cdf3fcd0b545","baseDataSHA256":"527d03b9159e5dc284db4f569863f5895c36ffcd0b7ea00ec642ee9ee2bf8386","bundleSHA256":"a6c56bd49f22907feff8cfebc68c19ca93fbeec07407d7822cfad0e4dfbf41a5","expectedGraphSHA256":"21dba2f230b361a3f69abb25ed2e61f4f1d8ab84bd9c0ba183ac54ddbf76515a","modelCount":40,"textureCount":57,"selectionCases":1024,"activeHeader":411,"activeArea":6,"packetManifests":{"loader-contract-v2":"19c7bca5bc1be19d04201618d37736199ce64473aa5c16e9ac4ce9562516ba0a","material-binding-addendum-v1":"23c14161d61c9e48898ef09536453109a9f9d99b36da8c19db34912cd65c5d04","neighbor-native-metadata-audit-v1":"7988d61f12852741dd089e085b86a7d493fb7dbff41303c6369ef714fef9a224"}});else root.SourceNativeNeighborAudit=factory(root.SourceNativeBytes,root.SourceNativeNeighborData,{"format":1,"baseFileSHA256":"6d7df39bd9c1b7294dffc89fa9d4b5dba745fe2316858a8638d59abca443eaf7","contractFileSHA256":"dbe3fda1fb05fa9ed65486f677333c667d68c8de2f78deb59ca9cdf3fcd0b545","baseDataSHA256":"527d03b9159e5dc284db4f569863f5895c36ffcd0b7ea00ec642ee9ee2bf8386","bundleSHA256":"a6c56bd49f22907feff8cfebc68c19ca93fbeec07407d7822cfad0e4dfbf41a5","expectedGraphSHA256":"21dba2f230b361a3f69abb25ed2e61f4f1d8ab84bd9c0ba183ac54ddbf76515a","modelCount":40,"textureCount":57,"selectionCases":1024,"activeHeader":411,"activeArea":6,"packetManifests":{"loader-contract-v2":"19c7bca5bc1be19d04201618d37736199ce64473aa5c16e9ac4ce9562516ba0a","material-binding-addendum-v1":"23c14161d61c9e48898ef09536453109a9f9d99b36da8c19db34912cd65c5d04","neighbor-native-metadata-audit-v1":"7988d61f12852741dd089e085b86a7d493fb7dbff41303c6369ef714fef9a224"}});})(typeof globalThis!=='undefined'?globalThis:this,function runtimeFactory(Bytes, supplied, expected) {
 'use strict';
 const hop = Function.call.bind(Object.prototype.hasOwnProperty);
 function check(ok, message) { if (!ok) throw Error('Native neighbor unsupported: ' + message); }
 check(Bytes && typeof Bytes.copy === 'function' && typeof Bytes.sha256 === 'function', 'source byte gate is not loaded');
 function plain(value) {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
 }
 function capture(value, seen, budget) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') { check(Number.isFinite(value) && !Object.is(value, -0), 'graph contains a nonfinite or negative-zero number'); return value; }
  check(typeof value === 'object' && (Array.isArray(value) || plain(value)), 'graph requires plain source data');
  check(!seen.has(value) && ++budget.nodes <= 1000000, 'graph is cyclic or unbounded');
  seen.add(value);
  const keys = Reflect.ownKeys(value), array = Array.isArray(value), out = array ? [] : {};
  if (array) check(keys.length === value.length + 1 && keys.every(key => key === 'length' || typeof key === 'string' && /^(0|[1-9][0-9]*)$/.test(key) && Number(key) < value.length), 'graph array fields changed');
  for (const key of keys) {
   if (array && key === 'length') continue;
   check(typeof key === 'string', 'graph symbol fields unsupported');
   const d = Object.getOwnPropertyDescriptor(value, key);
   check(d && hop(d, 'value') && d.enumerable, 'graph accessors or hidden fields unsupported');
   Object.defineProperty(out, key, {value: capture(d.value, seen, budget), enumerable: true, writable: true, configurable: true});
  }
  seen.delete(value);
  return out;
 }
 function snapshot(value) { return capture(value, new Set(), {nodes: 0}); }
 function stable(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  return Array.isArray(value) ? '[' + value.map(stable).join(',') + ']' : '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + stable(value[key])).join(',') + '}';
 }
 function utf8(text) {
  const result = [];
  for (let i = 0; i < text.length; i++) {
   let c = text.charCodeAt(i);
   if (c >= 0xd800 && c <= 0xdbff && i + 1 < text.length) { const low = text.charCodeAt(i + 1); if (low >= 0xdc00 && low <= 0xdfff) { c = 0x10000 + (c - 0xd800) * 1024 + low - 0xdc00; i++; } }
   if (c < 128) result.push(c);
   else if (c < 2048) result.push(192 | (c >> 6), 128 | (c & 63));
   else if (c < 65536) result.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
   else result.push(240 | (c >> 18), 128 | ((c >> 12) & 63), 128 | ((c >> 6) & 63), 128 | (c & 63));
  }
  return new Uint8Array(result);
 }
 function digest(value) { return Bytes.sha256(utf8(stable(value))); }
 function freeze(value) { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; }
 const bundle = snapshot(supplied);
 check(digest(bundle) === expected.bundleSHA256, 'sealed resource bundle mismatch');
 freeze(bundle); freeze(expected);
 const records = bundle.records, addedRecords = records.filter(record => !bundle.oldKeys.includes(record.key));
 const lookup = new Map(records.map(record => [record.key, record]));
 const fixtureMap = new Map(bundle.selectionFixtures.map(fixture => [fixture.local_tile.join(','), fixture]));
 const trusted = new WeakSet();
 const limits = Object.freeze(['Exact base35 models/51 textures plus sealed neighbor5 models/6 new textures; original scenes, headers, camera, material masks and old modes remain unchanged.', 'Only header411 area6 stationary-initial tile0..31 selections are source-admitted. Raw source tile is independent of effective camera; no dynamic/live/script membership claim.', 'Neighbor textures are exact static source frame0 RGBA bytes. Sea animation requires its separate gate; no animation-manager, transfer-fetch phase or missing-resource claim is made here.', 'Offline graph and selection certificate only; no host activation, dynamic loader, browser, hardware parity or original display-composition acceptance.']);
 check(fixtureMap.size === 1024 && records.length === 14 && addedRecords.length === 6, 'finite source scope mismatch');
 function verifyData(data) {
  check(arguments.length === 1, 'graph verification takes one exact graph');
  if (trusted.has(data)) return true;
  check(digest(snapshot(data)) === expected.expectedGraphSHA256, 'actual merged graph identity mismatch');
  return true;
 }
 function snapshotData(data) {
  check(arguments.length === 1, 'graph snapshot takes one exact graph');
  if (trusted.has(data)) return data;
  const captured = snapshot(data);
  check(digest(captured) === expected.expectedGraphSHA256, 'actual merged graph identity mismatch');
  freeze(captured); trusted.add(captured); return captured;
 }
 function create(baseData) {
  check(arguments.length === 1, 'creation takes the exact base source graph');
  const data = snapshot(baseData);
  check(digest(data) === expected.baseDataSHA256, 'actual base graph identity mismatch');
  for (const key of Object.keys(bundle.models)) {
   check(!hop(data.mesh.models, key), 'duplicate model identity');
   data.mesh.models[key] = snapshot(bundle.models[key]);
   data.edgeTopology.models[key] = snapshot(bundle.topologyModels[key]);
   data.lighting.models[key] = snapshot(bundle.lightingModels[key]);
  }
  for (const key of Object.keys(bundle.textures)) {
   if (hop(data.mesh.textures, key)) {
    check(digest(data.mesh.textures[key]) === digest(bundle.textures[key]) && digest(data.textureRGBA[key]) === digest(bundle.textureRGBA[key]) && digest(data.textureMeta[key]) === digest(bundle.textureMeta[key]) && data.textureData[key] === bundle.textureData[key], 'deduplicated texture differs');
   } else {
    data.mesh.textures[key] = snapshot(bundle.textures[key]);
    data.textureRGBA[key] = snapshot(bundle.textureRGBA[key]);
    data.textureMeta[key] = snapshot(bundle.textureMeta[key]);
    data.textureData[key] = bundle.textureData[key];
   }
  }
  data.lighting.vertex_selector_counts = snapshot(bundle.selectorCounts);
  data.nativeNeighborGraph = snapshot(bundle.graphMarker);
  verifyData(data);
  freeze(data); trusted.add(data); return data;
 }
 // The cache is module-private and keyed by the exact source object. A cache
 // hit still validates a fresh descriptor-safe source snapshot, so mutation of
 // a previously admitted mutable source cannot silently reuse an old graph.
 // Only create's fully validated, recursively frozen trusted graph is published.
 const sharedGraphs = new WeakMap();
 function createShared(baseData) {
  check(arguments.length === 1, 'shared creation takes the exact base source graph');
  const prior = baseData && typeof baseData === 'object' ? sharedGraphs.get(baseData) : undefined;
  if (prior) {
   check(digest(snapshot(baseData)) === expected.baseDataSHA256, 'actual base graph identity mismatch');
   return snapshotData(prior);
  }
  const graph = create(baseData);
  sharedGraphs.set(baseData, graph);
  return graph;
 }
 function decode64(encoded) {
  check(typeof encoded === 'string' && encoded.length % 4 === 0 && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded), 'invalid source RGBA encoding');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', n = encoded.length / 4 * 3 - (encoded.endsWith('==') ? 2 : encoded.endsWith('=') ? 1 : 0), data = new Uint8Array(n);
  let offset = 0;
  for (let i = 0; i < encoded.length; i += 4) { const bits = (alphabet.indexOf(encoded[i]) << 18) | (alphabet.indexOf(encoded[i + 1]) << 12) | ((alphabet.indexOf(encoded[i + 2]) & 63) << 6) | (alphabet.indexOf(encoded[i + 3]) & 63); if (offset < n) data[offset++] = bits >>> 16; if (offset < n) data[offset++] = bits >>> 8; if (offset < n) data[offset++] = bits; }
  return data;
 }
 function verify(texture, key) {
  check(arguments.length === 2 && typeof key === 'string' && lookup.has(key), 'unknown static neighbor texture or extra claim');
  check(plain(texture), 'texture requires an explicit descriptor');
  const keys = Reflect.ownKeys(texture), allowed = ['width', 'height', 'data', 'format', 'translucent', 'cutout'];
  check(keys.every(k => allowed.includes(k)) && ['width', 'height', 'data'].every(k => hop(texture, k)), 'texture fields or claims unsupported');
  const width = texture.width, height = texture.height, suppliedPixels = texture.data, format = texture.format, translucent = texture.translucent, cutout = texture.cutout, record = lookup.get(key);
  check(width === record.width && height === record.height && (format === undefined || format === record.format) && (translucent === undefined || translucent === record.translucent) && (cutout === undefined || cutout === record.cutout), 'static texture descriptor mismatch');
  const pixels = Bytes.copy(suppliedPixels);
  check(pixels.length === width * height * 4 && Bytes.sha256(pixels) === record.rgba_sha256, 'static texture RGBA identity mismatch');
  return record;
 }
 function getTexture(key) {
  check(arguments.length === 1 && typeof key === 'string' && lookup.has(key), 'unknown static neighbor texture or extra claim');
  const record = lookup.get(key), texture = {width: record.width, height: record.height, data: decode64(bundle.textureRGBA[key].rgba_base64), format: record.format};
  verify(texture, key); return texture;
 }
 function resolveSelection(request) {
  check(arguments.length === 1 && plain(request), 'stationary-initial selection requires exact fields');
  const keys = Reflect.ownKeys(request);
  check(keys.length === 3 && ['header', 'tile', 'state'].every(k => hop(request, k)), 'stationary-initial selection requires exact fields');
  const header = request.header, tile = request.tile, state = request.state;
  check(header === 411 && state === 'stationary-initial', 'only header411 stationary-initial state; dynamic/live/camera/script membership unsupported');
  check(Array.isArray(tile) && tile.length === 2 && Reflect.ownKeys(tile).length === 3 && hop(tile, '0') && hop(tile, '1'), 'tile must be an exact pair');
  const x = tile[0], z = tile[1];
  check(Number.isInteger(x) && Number.isInteger(z) && x >= 0 && x < 32 && z >= 0 && z < 32, 'tile outside finite 0..31 domain');
  const fixture = fixtureMap.get(x + ',' + z);
  return freeze({header, tile: [x, z], state, quadrant: fixture.quadrant, globalTile: snapshot(fixture.global_tile), slots: fixture.slots.map(slot => ({...snapshot(slot), modelKey: 'land-' + String(slot.land).padStart(4, '0'), translationFx12: slot.translation_relative_town.map(value => value * 4096)})), evidence: 'static-resource-snapshot', sourcePosition: 'initial FieldSystem location tile', dynamicLoaderAdmission: false, seaAnimationAdmission: false});
 }
 function getSourceSubmissionMetadata() { check(arguments.length === 0, 'source metadata takes no claims'); return bundle.sourceSubmissionMetadata; }
 return Object.freeze({create, createShared, verifyData, snapshotData, verify, getTexture, records, addedRecords: freeze(addedRecords), oldKeys: bundle.oldKeys, resolveSelection, getSourceSubmissionMetadata, limits, certificate: expected});
});
