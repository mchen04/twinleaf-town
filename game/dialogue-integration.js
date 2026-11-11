(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./original-dialogue.js'), require('./dialogue-data.js'));
  else root.OriginalDialogueIntegration = factory(root.OriginalDialogue, root.OriginalDialogueData);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Dialogue, data) {
'use strict';
const own = (o,k) => o && Object.prototype.hasOwnProperty.call(o,k);
function fail(message) { throw new Error('OriginalDialogueIntegration: ' + message); }
function condition(c,state) {
  const group = c.kind === 'flag' ? state.flags : c.kind === 'var' ? state.vars : state;
  const key = c.kind === 'gender' ? 'gender' : c.key;
  if (!own(group,key)) fail('missing explicit ' + c.kind + ' ' + key);
  const v = group[key];
  if (c.kind === 'flag' ? typeof v !== 'boolean' : !Number.isInteger(v) || v < 0 || v > 65535) fail('invalid explicit state ' + key);
  if (c.kind === 'gender' && v !== 0 && v !== 1) fail('unsupported source gender value');
  return c.op === 'eq' ? v === c.value : c.op === 'gte' ? v >= c.value : fail('unknown condition');
}
/** Select by an explicit story snapshot, never by a globally inferred name-slot map.
 * Does not mutate story state. Apply returned sourceEffects at the stated phase if the
 * host implements stateful direct interactions. Unsupported scenes fail closed.
 */
function select(actorKey,state,names) {
  const actor = data.metadata.actors.find(a => a.key === actorKey);
  if (!actor) fail('unsupported/gated actor ' + actorKey);
  if (!state || typeof state !== 'object') fail('explicit state required');
  const route = actor.routes_in_source_precedence.find(r => r.when.every(c => condition(c,state)));
  if (!route) fail('no supported source branch');
  if (route.unsupported_scene) fail('source scene requires unimplemented effects: ' + route.unsupported_scene);
  const bindings = {};
  for (const [slot,role] of Object.entries(route.slot_roles)) {
    if (!own(names,role) || typeof names[role] !== 'string' || !names[role].length) fail('explicit ' + role + ' required');
    bindings[slot] = names[role];
  }
  const message = data.messages.find(m => m.message_bank === actor.message_bank && m.message_index === route.message_index);
  if (!message) fail('missing verified message');
  return {
    actorKey, namespace: actor.namespace, headerId: actor.header_id, recordIndex: actor.record_index,
    messageBank: actor.message_bank, messageIndex: route.message_index, routeId: route.id,
    tokens: message.tokens, raw: message.raw, bindings, slotRoles: {...route.slot_roles},
    waitButton: route.wait_button, sourceEffects: route.state_effects.map(e => ({...e})),
    provenance: { message: message.source, object: actor.object_source, script: actor.script_source, messageOffset: route.script_offset, bufferWrites: route.buffer_writes }
  };
}
function create(actorKey,state,names,fontData,options = {}) {
  if (!fontData || fontData.font_id !== 1 || fontData.line_height !== 16 || fontData.letter_spacing !== 0) fail('source field font1 metrics required');
  const selected = select(actorKey,state,names);
  const printer = Dialogue.create(selected.tokens, {
    ...options, glyphs:fontData.glyphs, bindings:selected.bindings,
    lineHeight:fontData.line_height, waitButton:selected.waitButton
  });
  return { selected, printer };
}
/** Optional host-canvas adapter. Text-only pixels; caller owns frame, arrow, input/audio,
 * accessible text, and overlay lifetime. Uses exact atlas coordinates, not FieldText.pages.
 */
function draw(ctx,atlas,fontData,snapshot,x,y,scale=1) {
  if (!Number.isFinite(scale) || scale <= 0) fail('invalid scale');
  ctx.save();
  try {
    ctx.imageSmoothingEnabled = false;
    ctx.beginPath();
    ctx.rect(x,y,snapshot.clip.width*scale,snapshot.clip.height*scale);
    ctx.clip();
    for (const g of snapshot.visibleGlyphs) {
      const metric = fontData.glyphs[g.char];
      if (!metric) fail('missing glyph while drawing');
      if (own(g, 'sourceX') || own(g, 'sourceY') || own(g, 'copyWidth') || own(g, 'copyHeight')) {
        if (![g.sourceX,g.sourceY,g.copyWidth,g.copyHeight].every(Number.isInteger) ||
            g.sourceX < 0 || g.sourceY < 0 || g.copyWidth <= 0 || g.copyHeight <= 0 ||
            g.sourceX + g.copyWidth > metric.width || g.sourceY + g.copyHeight > metric.height) fail('invalid published glyph crop');
        ctx.drawImage(atlas,metric.x+g.sourceX,metric.y+g.sourceY,g.copyWidth,g.copyHeight,x+g.x*scale,y+g.y*scale,g.copyWidth*scale,g.copyHeight*scale);
      } else {
        ctx.drawImage(atlas,metric.x,metric.y,metric.width,metric.height,x+g.x*scale,y+g.y*scale,metric.width*scale,metric.height*scale);
      }
    }
  } finally { ctx.restore(); }
}
return { select, create, draw, metadata:data.metadata };
});
