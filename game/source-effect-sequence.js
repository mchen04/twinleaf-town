/* Silent source-derived bounded SSEQ/admission contract. No audio or wall clock.
 * Original: pokediamond b623abef1b4dfe204ca50aab42447ac00c134290,
 * ARM9 NNS_SND_player.s; ARM7 SND_seq.c and SND_main.c.
 * Generations and pass serials are implementation safeguards, not hardware fields.
 * Explicit pass boundaries model software order, not measured command latency.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./source-effect-voices.js'),require('./source-tv-stream.js'));
  else root.SourceEffectSequence = factory(root.SourceEffectVoices,root.SourceTvStream);
}(typeof globalThis !== 'undefined' ? globalThis : this, function (VoiceModule,BaseTv) {
  'use strict';
  const IDS = [1500, 1501, 1504, 1533, 1537, 1539, 1541, 1543, 1563];
  const SOURCE_COMMIT = 'b623abef1b4dfe204ca50aab42447ac00c134290';
  const CONTROL_INTERVAL_SECONDS = 2728 * 64 / 33514000;
  const PINNED = {"1563":{"sha256":"446f1df286ea013e0adf3b6432722c5fc918bc4c1b068afd386c811e019f8eff","hex":"53534551fffe0001780000001000010044415441680000001c000000fe03009301340000c700e196008104c17fc502c422405f0580063b5f058006405f058006475f058006545f0b800c605f308030ffc700815dc17f40640580063b640580064064058006476405800654640b800c6064308030ffff0000","group":3,"priority":104,"volume":85},"1504":{"sha256":"e7fb2bdf84c76ac35e9e35530245ee6f8aa75c1756ec94c41d9d66990cc23752","hex":"53534551fffe0001740000001000010044415441640000001c000000c700e12c018105c17fc502e30000c41b5b440580065d7f1280125d1e06e30000800bc15380015d32068005c15c80075d1e0cc1458005c1508006c1358006c1418006c1268006c1318006c1198006c1228006c10cffff0000","group":4,"priority":104,"volume":120},"1533":{"sha256":"17359dc73c5f8f8bd85dd1c521f6b6bb4f0ad7b5ec8e1abb7f5389e70cd1add0","hex":"53534551fffe0001400000001000010044415441300000001c000000c700e1dc008145c17f487f048007c13580016d751b8001c17f8015c1658006ffff000000","group":3,"priority":104,"volume":38},"1501":{"sha256":"8184d810e5ceea8f9e49f204880e05ebe1cfa3a5e843c518201355666a45216a","hex":"53534551fffe0001440000001000010044415441340000001c000000c700e164008120c17f537f04c50cc40080055f6e0680075f160580065f2d0580065f16058005ffff","group":4,"priority":104,"volume":80},"1500":{"sha256":"6c0b968da59ebf13b55f2c1c186a72d1a30977dff9b2773d5aad4fbfdf3005ab","hex":"53534551fffe0001780000001000010044415441680000001c000000c700e12c018105c17fc502e30000e30000c41b5e44058006677f05c13c8001c15dc17f8005674405c140c15a8001c17f8005c1406768058001c153c17f8005c13d8001c15ac17f800ac1538006c15c8003c1328002c11affff000000","group":4,"priority":104,"volume":52},"1537":{"sha256":"df1a5e1351f305fdef4a8d491f3bb8f1de11e4a0b99a929412d2969f17bd8a58","hex":"53534551fffe0001980000001000010044415441880000001c000000c700e1dc008157c17fc508287f248009c4008001c4fe8004c4fc8001c4fa8001c4f88001c4f6c4f4c4f28001c4f0c4ee8001c4ecc4ea8001c4e6c4e48001c4e0c4dc8001c4dac4d68001c4d4c4d08001c4ccc4cac4c68001c4c2c4bcc4b88001c4b2c4acc4aa8001c4a6c4a0c49a8001c48ec486c4828008ffff0000","group":4,"priority":64,"volume":30},"1539":{"sha256":"b89d7609f1dfe7d66cf0d419e91e65c61a24e6e95f4537f74c524fa127082577","hex":"53534551fffe0001d00000001000010044415441c00000001c000000fe030093015f0000c700e17800817dc17fc17f394c0480043c7f0480044c4c048010394c0480043c6c0480044c4c04801039290480043c3d0480044c29048010391f0480043c340480044c1f04801039150480043c1f0480044c15048004ffc7008165c17f394c0480043c7f0480044c4c048010394c0480043c6c0480044c4c04801039290480043c3d0480044c29048010391f0480043c340480044c1f04801039150480043c1f0480044c15048004ffff0000","group":3,"priority":104,"volume":127},"1541":{"sha256":"13befa25955b121a5e0f7b986d2a30facd307a327586df096711ae6b02b70539","hex":"53534551fffe0001a40000001000010044415441940000001c000000fe03009301260000c700e16d008172c17f2e7506800c3a5410800cc1708006c1458006c157ffc700815fc14bc50cc4008008c483c48c5f3c158001c496c49c8004c4a68001c4b98001c4d38001c4e38001c4fc8001c416c4238001c42c8002c4398001c4438001c4538001c460c1418001c46ac1398001c46e8001c4788003c47fc134c12bffff00","group":3,"priority":104,"volume":115},"1543":{"sha256":"1fb7d678f073bc7cff3a42d33d566758f09b2bf8f71013fd2aa0d3acacbcca85","hex":"53534551fffe0001a40000001000010044415441940000001c000000fe03009301260000c700e159008175c17f364b06800c364d10800cc1708006c1458006c157ffc700815fc137c50cc4008008c483c48c5f33158001c496c49c8004c4a68001c4b98001c4d38001c4e38001c4fc8001c416c4238001c42c8002c4398001c4438001c4538001c460c12d8001c46ac1258001c46e8001c4788003c47fc120c117ffff00","group":3,"priority":104,"volume":115}};
  const copy = value => JSON.parse(JSON.stringify(value));
  function assert(condition, message) { if (!condition) throw new Error('SourceEffectSequence: ' + message); }
  function decode(bytes) {
    const tracks = {}, queue = [[0, 28]];
    const u16 = p => bytes[p] | bytes[p + 1] << 8;
    while (queue.length) {
      const [index, start] = queue.shift();
      assert(!tracks[index], 'duplicate track');
      let p = start, tick = 0, program = 0, noteWait = true;
      const events = [];
      const vlv = () => { let value = 0; for (let n = 0; n < 4; n++) { const b = bytes[p++]; value = value * 128 + (b & 127); if (b < 128) return value; } throw new Error('unbounded VLV'); };
      for (let ordinal = 0; ordinal < 512; ordinal++) {
        const begin = p, op = bytes[p++];
        const event = {offset: begin, relative_offset: begin - 28, track: index, tick, opcode: op};
        if (op < 128) {
          const velocity = bytes[p++], length = vlv();
          Object.assign(event, {command: 'note', key: op, encoded_key: op, velocity, length, program});
          assert(length > 0 && velocity <= 127, 'unsupported note');
          if (noteWait) tick += length;
        } else if (op === 0x80 || op === 0x81) {
          event.command = op === 0x80 ? 'rest' : 'program'; event.value = vlv();
          if (op === 0x80) tick += event.value; else program = event.value;
        } else if (op === 0x93) {
          event.command = 'open_track'; event.value = bytes[p++];
          event.destination = bytes[p] | bytes[p + 1] << 8 | bytes[p + 2] << 16; p += 3;
          assert(index === 0 && tick === 0 && event.value === 1, 'unsupported open track');
          queue.push([event.value, event.destination + 28]);
        } else if ([0xc1, 0xc4, 0xc5, 0xc7].includes(op)) {
          event.command = ({193: 'volume', 196: 'pitch_bend', 197: 'bend_range', 199: 'note_wait'})[op];
          event.value = bytes[p++]; if (op === 0xc4 && event.value >= 128) event.value -= 256;
          if (op === 0xc7) { assert(event.value === 0 || event.value === 1, 'bad note wait'); noteWait = !!event.value; }
        } else if ([0xe1, 0xe3, 0xfe].includes(op)) {
          event.command = ({225: 'tempo', 227: 'sweep_pitch', 254: 'allocate_tracks'})[op];
          event.value = u16(p); p += 2;
          if (op === 0xe3) assert(event.value === 0, 'nonzero sweep unsupported');
          if (op === 0xfe) assert(index === 0 && begin === 28 && event.value === 3, 'unsupported allocation');
        } else if (op === 0xff) event.command = 'end';
        else throw new Error('SourceEffectSequence: unsupported opcode ' + op);
        event.bytes_hex = bytes.slice(begin, p).map(b => b.toString(16).padStart(2, '0')).join('');
        events.push(event);
        if (op === 0xff) break;
      }
      assert(events[events.length - 1].command === 'end', 'missing bounded end');
      tracks[index] = {start_tick: 0, end_tick: tick, events};
    }
    return tracks;
  }
  function verifyInputs(data) {
    assert(data && data.tables && data.sequences && data.rawSequences && data.playerGroups, 'complete verified input bundle required');
    assert(Array.isArray(data.tables.decibel_linear) && data.tables.decibel_linear.length === 128, 'linear dB table required');
    const result = {};
    for (const id of IDS) {
      const seq = data.sequences[id], bytes = data.rawSequences[id], pin = PINNED[id];
      assert(seq && seq.id === id && seq.sha256 === pin.sha256, 'wrong sequence identity ' + id);
      assert(Array.isArray(bytes) && bytes.every(b => Number.isInteger(b) && b >= 0 && b <= 255), 'invalid raw bytes ' + id);
      assert(bytes.map(b => b.toString(16).padStart(2, '0')).join('') === pin.hex, 'changed original SSEQ bytes ' + id);
      assert(seq.player_id === pin.group && seq.player_priority === 64 && seq.channel_priority === pin.priority && seq.volume === pin.volume, 'changed INFO metadata ' + id);
      if (id === 1501) assert(seq.bank_id === 1000 && seq.file_id === 190 && seq.archive_offset === 1450752 && seq.bytes === 68 && seq.symbol === 'SEQ_SE_DP_DECIDE', 'changed DECIDE source mapping');
      if (id === 1504) assert(seq.file_id === 193 && seq.archive_offset === 1451072 && seq.bytes === 116 && seq.sha256 === "e7fb2bdf84c76ac35e9e35530245ee6f8aa75c1756ec94c41d9d66990cc23752" && seq.bank_id === 1000 && seq.symbol === "SEQ_SE_DP_SELECT78", 'changed menu source mapping 1504');
      if (id === 1533) assert(seq.file_id === 220 && seq.archive_offset === 1456640 && seq.bytes === 64 && seq.sha256 === "17359dc73c5f8f8bd85dd1c521f6b6bb4f0ad7b5ec8e1abb7f5389e70cd1add0" && seq.bank_id === 1000 && seq.symbol === "SEQ_SE_DP_WIN_OPEN", 'changed menu source mapping 1533');
      if(id===1563)assert(seq.bank_id===1500&&seq.file_id===250&&seq.archive_offset===1461536&&seq.bytes===120&&seq.symbol==='SEQ_SE_DP_SAVE','changed Options sound source mapping');
      const group = data.playerGroups[seq.player_id];
      assert(group && group.cap === 1 && group.channel_mask === 0xd800, 'exact group cap and mask required');
      if (id === 1504 || id === 1533) assert(group.id === seq.player_id && group.heap_bytes === 2000 && group.sequence_count === 1 && group.raw_hex === '010000d8d0070000' && group.absolute_offset === (id === 1533 ? 86728 : 86736) && Array.isArray(group.channel_ids) && group.channel_ids.length === 4 && [0,1,2,3].every(i => group.channel_ids[i] === [11,12,14,15][i]), 'changed menu player mapping');
      const decoded = decode(bytes);
      assert(Object.keys(seq.tracks).join(',') === Object.keys(decoded).join(','), 'changed track allocation ' + id);
      for (const index of Object.keys(decoded)) {
        const source = decoded[index], manifest = seq.tracks[index];
        assert(manifest.start_tick === source.start_tick && manifest.end_tick === source.end_tick && manifest.events.length === source.events.length, 'changed track structure ' + id);
        source.events.forEach((event, ordinal) => {
          const item = manifest.events[ordinal];
          for (const key of Object.keys(event)) assert(item[key] === event[key], 'changed event ' + id + '/' + index + '/' + ordinal + '/' + key);
          if (event.command === 'note') {
            assert(item.instrument && item.instrument.program === event.program && item.instrument.key === event.key, 'missing note instrument');
            event.instrument = copy(item.instrument);
          }
        });
      }
      result[id] = Object.assign({}, copy(seq), {tracks: decoded});
    }
    return result;
  }
  function create(data, options) {
    options = options || {};
    const tv=options.tv===true,music=options.defaultMusic===true;assert(!music||tv,'default music requires native TV owner');const rival=options.rivalStory===true;assert(!rival||music,'rival story requires native default music');const fieldMusic=options.fieldMusic===true;assert(!fieldMusic||rival,'field music requires rival/default owner');const Tv=rival?BaseTv.withRivalStory():music?BaseTv.withDefaultMusic():BaseTv;assert(!tv||Tv,'TV dependency');
    const sequences = verifyInputs(data);if(tv)for(const id of Tv.ids)sequences[id]=Tv.metadata(id);
    const voices = options.voices || VoiceModule.create(data, {strongLockMask: options.strongLockMask || 0, weakLockMask: options.weakLockMask || 0,tv,defaultMusic:music,rivalStory:rival});
    for (const name of ['noteOn', 'tickTrack', 'updateTrack', 'releaseTrack', 'flush', 'step', 'hardwareComplete', 'snapshot', 'drainEvents']) assert(typeof voices[name] === 'function', 'voice API missing ' + name);
    let generation = 0, passSerial = 0, periodicFrame = -1, commandSerial = 0, currentTag = 1, finishedTag = 0, arm9FinishedTag = 0, lastAckPass = 0;
    const freeSlots = Array.from({length: 16}, (_, i) => i), groups = rival?{1:[],2:[],3:[],4:[],7:[]}:tv?{1:[],2:[],3:[],4:[]}:{3: [], 4: []}, handles = new Map(), admitted = new Map(), drivers = Array(16).fill(null);
    const logicalTracks=Array(32).fill(null);
    const reserved = [], batches = [], events = [];let masterPanCommands=[];
    let acknowledgement = {passSerial: 0, finishedTag: 0, playerStatus: 0, slots: Array.from({length: 16}, (_, driverSlot) => ({driverSlot, sequenceGeneration: 0, active: false}))};
    function emit(type, fields) { const e = Object.assign({passSerial, periodicFrame}, fields || {}, {type}); events.push(e); return e; }
    function identity(instance) { return {effectId: instance.effectId, sequenceGeneration: instance.sequenceGeneration, driverSlot: instance.driverSlot}; }
    function queue(type, instance, value) {
      const command = Object.assign({type, serial: ++commandSerial, tag: currentTag}, identity(instance));
      if (value !== undefined) command.value = value;
      reserved.push(command); emit('command-queued', Object.assign(copy(command), {commandType: command.type})); return command;
    }
    function requestMasterPan(value){assert(value===-1||value===64,'ordinary master pan');assert(reserved.length<4096,'command capacity');const command={type:'master-pan',serial:++commandSerial,tag:currentTag,value};reserved.push(command);emit('command-queued',Object.assign(copy(command),{commandType:command.type}));return copy(command);}
    function orderedAdmissions() { return [...admitted.values()].sort((a, b) => a.sequencePriority - b.sequencePriority || a.sequenceGeneration - b.sequenceGeneration); }
    function releaseHandle(handle) {
      const token = handles.get(handle); if (!token) return false;
      const prior = admitted.get(token.sequenceGeneration);
      if (prior && prior.handle === handle) prior.handle = null;
      handles.delete(handle); emit('handle-detached', {handle, sequenceGeneration: token.sequenceGeneration}); return true;
    }
    function shutdown(instance, reason) {
      if (!admitted.has(instance.sequenceGeneration)) return false;
      if (instance.handle && handles.get(instance.handle)?.sequenceGeneration === instance.sequenceGeneration) handles.delete(instance.handle);
      groups[instance.group] = groups[instance.group].filter(g => g !== instance.sequenceGeneration);
      admitted.delete(instance.sequenceGeneration); freeSlots.push(instance.driverSlot);
      emit('admission-ended', Object.assign(identity(instance), {group: instance.group, reason})); return true;
    }
    function forceStop(instance, reason) { queue('stop', instance); shutdown(instance, reason); }
    function requestStart(id, request) {
      request = request || {};
      const seq = sequences[id];
      if (!seq || (!IDS.includes(id)&&!(tv&&Tv.has(id)))) return {accepted: false, reason: 'unsupported-effect', effectId: id};
      const priority = request.syntheticPriority === undefined ? seq.player_priority : request.syntheticPriority;
      assert(request.syntheticPriority === undefined || options.allowSyntheticPriorityTests === true, 'synthetic priority disabled');
      assert(Number.isInteger(priority) && priority >= 0 && priority <= 127, 'invalid priority');
      const handle = request.handle === undefined ? 'group:' + seq.player_id : request.handle;
      assert(typeof handle === 'string' && handle.length > 0, 'handle must be a nonempty string');
      // Bounded TV profile preflights complete logical capacity before mutation.
      if(tv){const used=orderedAdmissions().filter(x=>x.group!==seq.player_id).reduce((n,x)=>n+Object.keys(sequences[x.effectId].tracks).length,0);assert(used+Object.keys(seq.tracks).length<=32,'logical track capacity');}
      releaseHandle(handle); // Source releases before checking admission priority.
      const members = groups[seq.player_id].map(g => admitted.get(g)).sort((a, b) => a.sequencePriority - b.sequencePriority || a.sequenceGeneration - b.sequenceGeneration);
      if (members.length >= 1) {
        if (priority < members[0].sequencePriority) { emit('admission-rejected', {effectId: id, group: seq.player_id, handle, reason: 'group-priority'}); return {accepted: false, reason: 'group-priority', handle}; }
        forceStop(members[0], 'group-replacement');
      }
      if (!freeSlots.length) {
        const victim = orderedAdmissions()[0];
        if (priority < victim.sequencePriority) return {accepted: false, reason: 'global-priority', handle};
        forceStop(victim, 'global-replacement');
      }
      const instance = {effectId: id, sequenceGeneration: ++generation, driverSlot: freeSlots.shift(), group: seq.player_id, sequencePriority: priority, handle, pendingStart: true, preparationTag: currentTag, preparationAcknowledged: false, status: 'prepare-pending'};
      if(rival&&(id===1139||(fieldMusic&&[1004,1033].includes(id))))instance.moveVolume={start:127*256,target:127*256,duration:0,counter:0,last:data.tables.decibel_linear[seq.volume]};
      admitted.set(generation, instance); groups[instance.group].push(generation); handles.set(handle, identity(instance));
      emit('admitted', Object.assign(identity(instance), {group: instance.group, handle, sequencePriority: priority}));
      queue('prepare', instance); queue('channel-mask', instance, seq.channel_mask===undefined?0xd800:seq.channel_mask); queue('channel-priority', instance, seq.channel_priority);
      return Object.assign({accepted: true, handle, group: instance.group}, identity(instance));
    }
    function resolve(token) {
      if (typeof token === 'string') token = handles.get(token);
      return token && admitted.get(token.sequenceGeneration)?.driverSlot === token.driverSlot ? admitted.get(token.sequenceGeneration) : null;
    }
    function requestPause(token,value){assert(typeof value==='boolean','pause boolean');const x=resolve(token);if(!x)return false;queue('pause',x,value);return true;}
    function requestVolume(token,value){assert(Number.isInteger(value)&&value>=0&&value<=127,'initial volume');const x=resolve(token);if(!x)return false;queue('player-fader',x,data.tables.decibel_linear[value]);return true;}
    function faderValue(f){return f.counter>=f.duration?f.target:f.start+Math.trunc((f.target-f.start)*f.counter/f.duration);}
    function requestMoveVolume(token,value,duration){
      assert(rival&&value===0&&duration===30,'bounded rival MoveVolume');const x=resolve(token);assert(x&&x.effectId===1139&&x.moveVolume&&!x.pendingStart&&x.status==='executing'&&drivers[x.driverSlot]?.active&&drivers[x.driverSlot]?.prepared&&drivers[x.driverSlot]?.sequenceGeneration===x.sequenceGeneration,'active started rival fader owner');
      const f=x.moveVolume;f.start=faderValue(f);f.target=value*256;f.duration=duration;f.counter=0;emit('move-volume',Object.assign(identity(x),{value,duration,start:f.start}));return true;
    }
    function requestFieldFade(token){
      assert(fieldMusic,'field music capability');const x=resolve(token);assert(x&&[1004,1033].includes(x.effectId)&&x.moveVolume&&!x.pendingStart&&x.status==='executing'&&drivers[x.driverSlot]?.active&&drivers[x.driverSlot]?.prepared&&drivers[x.driverSlot]?.sequenceGeneration===x.sequenceGeneration,'active started field fader owner');
      const f=x.moveVolume;f.start=faderValue(f);f.target=0;f.duration=40;f.counter=0;emit('move-volume',Object.assign(identity(x),{value:0,duration:40,start:f.start}));return true;
    }
    function status(token){assert(token&&Number.isSafeInteger(token.sequenceGeneration)&&Number.isInteger(token.driverSlot),'status token');const slot=acknowledgement.slots[token.driverSlot];return copy({token,acknowledgementPass:acknowledgement.passSerial,finishedTag:acknowledgement.finishedTag,matching:!!slot&&slot.sequenceGeneration===token.sequenceGeneration,active:!!slot&&slot.sequenceGeneration===token.sequenceGeneration&&slot.active,admitted:!!resolve(token),pending:!!resolve(token)&&(!slot||slot.sequenceGeneration!==token.sequenceGeneration)});}
    function requestStop(token) { const instance = resolve(token); if (!instance) return false; forceStop(instance, 'explicit-stop'); return true; }
    function stopAll() { for (const instance of orderedAdmissions()) forceStop(instance, 'stop-all'); }
    function flush() {
      if (!reserved.length) return null;
      const batch = {tag: currentTag++, commands: reserved.splice(0)}; batches.push(batch);
      emit('command-flushed', {tag: batch.tag, commands: batch.commands.map(c => c.serial)}); return copy(batch);
    }
    function arm9Main(config) {
      config = config || {};
      const ack = config.acknowledgement || acknowledgement;
      // A snapshot cannot release a different generation reusing the same driver slot.
      if (ack.passSerial >= lastAckPass && ack.finishedTag <= finishedTag) {
        lastAckPass = ack.passSerial; arm9FinishedTag = Math.max(arm9FinishedTag, ack.finishedTag);
        for (const instance of orderedAdmissions()) {
          if (arm9FinishedTag >= instance.preparationTag) instance.preparationAcknowledged = true;
          const slot = ack.slots[instance.driverSlot];
          if (instance.preparationAcknowledged && slot && slot.sequenceGeneration === instance.sequenceGeneration && !slot.active) shutdown(instance, 'natural-acknowledgement');
        }
      } else emit('stale-acknowledgement', {acknowledgementPass: ack.passSerial});
      for (const instance of orderedAdmissions()) {
        if (instance.pendingStart) {
          queue('player-fader', instance, data.tables.decibel_linear[sequences[instance.effectId].volume]);
          queue('start', instance); instance.pendingStart = false; instance.status = 'start-pending';
        }
      }
      if(rival)for(const instance of orderedAdmissions())if(instance.moveVolume){
        const f=instance.moveVolume;if(f.counter<f.duration)f.counter++;
        const index=faderValue(f)>>8;assert(index>=0&&index<=127,'fader table index');
        const volume=Math.max(-32768,Math.min(32767,data.tables.decibel_linear[sequences[instance.effectId].volume]+data.tables.decibel_linear[index]));
        if(volume!==f.last){queue('player-fader',instance,volume);f.last=volume;}
      }
      return config.flush === false ? null : flush();
    }
    function trackOwner(player, index) { return Object.assign(identity(player), {trackIndex: index, trackGeneration: player.tracks[index].generation}); }
    function createTrack(index, body, started) {
      return {index, generation: 1, started, ended: false, cursor: 0, wait: 0, tick: -1, noteWait: true, program: 0, priority: 64, volume: 127, expression: 127, extFader: 0, pan: 0, extPan: 0, pitchBend: 0, extPitch: 0, panRange: 127, bendRange: 2, sweepPitch: 0, channelMask: 0xffff, explicitMask: false, mod: {target: 0, speed: 16, depth: 0, range: 1, delay: 0}, body};
    }
    function traceEvent(player, track, event, ordinal, phase) {
      const fields = Object.assign(identity(player), {track: track.index, tick: event.tick, control_frame: phase === 'prepare' ? null : player.controlFrame, track_ordinal: ordinal, phase}, copy(event));
      delete fields.instrument; emit('sequence-event', fields);
    }
    function stopTrack(player, track, reason) {
      if (track.ended) return;
      voices.releaseTrack(trackOwner(player, track.index), track, player, {detach: true, release: -1});
      track.ended = true; track.started = false;if(track.logicalSlot!==undefined)logicalTracks[track.logicalSlot]=null;
      emit('track-ended', Object.assign(identity(player), {track: track.index, tick: player.tick, control_frame: player.controlFrame, reason}));
    }
    function stopDriver(player, reason) {
      if (!player || !player.active) return;
      for (const track of player.tracks) if (track && !track.ended) stopTrack(player, track, reason);
      player.active = false; emit('driver-ended', Object.assign(identity(player), {reason, control_frame: player.controlFrame, tick: player.tick}));
    }
    function consume(command) {
      emit('command-consumed', Object.assign(copy(command), {commandType: command.type}));
      if(command.type==='master-pan'){masterPanCommands.push({serial:command.serial,value:command.value});return;}
      let player = drivers[command.driverSlot];
      if (command.type === 'prepare') {
        if (player?.active) stopDriver(player, 'prepare-replacement');
        const seq = sequences[command.effectId];
        player = Object.assign(identity(command), {active: true, prepared: false, paused: false, tempo: 120, tempoRatio: 256, tempoCounter: 240, tick: -1, controlFrame: -1, volume: 127, extFader: 0, prio: 64, tracks: []});
        for (const index of Object.keys(seq.tracks).map(Number).sort((a, b) => a - b)){const tr=createTrack(index,seq.tracks[index],index===0);if(tv){const slot=logicalTracks.indexOf(null);assert(slot>=0,'logical pool full');logicalTracks[slot]={driverSlot:player.driverSlot,sequenceGeneration:player.sequenceGeneration,index};tr.logicalSlot=slot;}if(seq.tv){tr.pc=seq.tracks[index].start;tr.stack=[];tr.portamentoKey=60;}player.tracks[index]=tr;}
        player.tv=!!seq.tv;
        drivers[command.driverSlot] = player;
        const first = player.tv?{command:'allocate_tracks',offset:28,opcode:254,value:seq.allocation_mask}:player.tracks[0].body.events[0];
        if (first.command === 'allocate_tracks' && seq.has_allocation_command!==false) { traceEvent(player, player.tracks[0], first, 0, 'prepare'); player.tracks[0].cursor = 1; }
        return;
      }
      if (!player || player.sequenceGeneration !== command.sequenceGeneration) { emit('stale-command', Object.assign(copy(command), {commandType: command.type})); return; }
      if (command.type === 'stop') stopDriver(player, 'queued-stop');
      else if(command.type==='pause'){player.paused=command.value;if(command.value)for(const track of player.tracks)if(track&&!track.ended)voices.releaseTrack(trackOwner(player,track.index),track,player,{detach:true,release:127});}
      else if (command.type === 'channel-mask') { for (const track of player.tracks) if (track) { track.channelMask = command.value; track.explicitMask = true; } }
      else if (command.type === 'channel-priority') player.prio = command.value;
      else if (command.type === 'player-fader') player.extFader = command.value;
      else if (command.type === 'start') { player.prepared = true; const admission = admitted.get(player.sequenceGeneration); if (admission) admission.status = 'executing'; }
      else throw new Error('SourceEffectSequence: unknown queued command');
    }
    function stepTrack(player, track) {
      voices.tickTrack(trackOwner(player, track.index)); track.tick++;
      if (track.wait > 0 && --track.wait > 0) return;
      let limit = 0;
      while (track.wait === 0 && !track.ended) {
        assert(++limit <= 512, 'bounded track exhausted');
        const ordinal=track.cursor++,event=player.tv?Tv.instruction(player.effectId,track.pc):track.body.events[ordinal];
        if(player.tv){event.tick=track.tick;track.pc=event.next;if(event.command==='note'){event.program=track.program;event.instrument=Tv.instrument(player.effectId,track.program,event.key);}}
        assert(event && event.tick === track.tick, 'event cursor/tick mismatch'); traceEvent(player, track, event, ordinal, 'tick');
        switch (event.command) {
          case 'note': {
            const token = voices.noteOn({owner: trackOwner(player, track.index), instrument: event.instrument, key: event.key, velocity: event.velocity, length: event.length, priority: player.prio + track.priority, channelMask: track.channelMask, explicitMask: track.explicitMask});
            emit('note', Object.assign(identity(player), {track: track.index, tick: track.tick, control_frame: player.controlFrame, key: event.key, velocity: event.velocity, length: event.length, program: track.program, voice: token}));
            if(player.tv)track.portamentoKey=event.key;
            if (track.noteWait) track.wait = event.length; break;
          }
          case 'rest': track.wait = event.value; break;
          case 'program': track.program = event.value; break;
          case 'note_wait': track.noteWait = !!event.value; break;
          case 'tempo': player.tempo = event.value; break;
          case 'volume': track.volume = event.value; break;
          case 'pitch_bend': track.pitchBend = event.value; break;
          case 'bend_range': track.bendRange = event.value; break;
          case 'sweep_pitch': track.sweepPitch = event.value; break;
          case 'open_track': { const child = player.tracks[event.value]; assert(child && !child.started, 'invalid track open');if(player.tv){assert(player.tick===0&&track.index===0,'TV child open phase');child.pc=28+event.destination;} child.started = true; break; }
          case 'jump':case 'call':assert(player.tv,'TV flow only');if(event.command==='call'){assert(track.stack.length<3,'call stack');track.stack.push(track.pc);}track.pc=28+event.destination;break;
          case 'return':assert(player.tv&&track.stack.length,'return stack');track.pc=track.stack.pop();break;
          case 'pan':track.pan=event.value;break;
          case 'mod_depth':assert(event.value===0||(music&&Tv.isDefaultMusic(player.effectId)&&[5,6,7,8,9,10,11,12,13,14,15,16,19].includes(event.value)),'nonzero modulation unsupported');track.mod.depth=event.value;break;
          case 'mod_speed':track.mod.speed=event.value;break;
          case 'mod_range':track.mod.range=event.value;break;
          case 'end': stopTrack(player, track, 'natural-end'); break;
          default: throw new Error('SourceEffectSequence: unimplemented runtime command ' + event.command);
        }
      }
    }
    function stepPlayer(player) {
      player.controlFrame++;
      const ticks = Math.floor(player.tempoCounter / 240); player.tempoCounter %= 240;
      for (let n = 0; n < ticks; n++) {
        player.tick++; emit('sequence-tick', Object.assign(identity(player), {tick: player.tick, control_frame: player.controlFrame}));
        for (const track of player.tracks) if (track && track.started && !track.ended) stepTrack(player, track);
        if (!player.tracks.some(t => t && t.started && !t.ended)) { stopDriver(player, 'natural-end'); break; }
      }
      player.tempoCounter += player.tempo * player.tempoRatio >> 8;
    }
    function arm7Pass(config) {
      if (typeof config === 'boolean') config = {periodic: config};
      config = config || {}; const periodic = config.periodic === true;
      passSerial++; if (periodic) periodicFrame++;
      for (const completion of config.hardwareCompletions || []) voices.hardwareComplete(completion.channelId ?? completion.channel, completion.voiceGeneration ?? completion.generation);
      const appliedRegisters = voices.flush();masterPanCommands=[];
      while (batches.length) { const batch = batches.shift(); for (const command of batch.commands) consume(command); finishedTag = batch.tag; }
      for (const player of drivers) {
        if (!player || !player.active || !player.prepared) continue;
        if (periodic && !player.paused) stepPlayer(player);
        for (const track of player.tracks) if (track && !track.ended) voices.updateTrack(trackOwner(player, track.index), track, player, {allowLengthRelease: true});
      }
      voices.step(periodic);
      const voiceEvents = voices.drainEvents();
      for (const event of voiceEvents) emit('voice-event', {event});
      let status = 0;
      const slots = drivers.map((player, driverSlot) => { if (player?.active) status |= 1 << driverSlot; return {driverSlot, sequenceGeneration: player?.sequenceGeneration || 0, active: !!player?.active}; });
      acknowledgement = {passSerial, finishedTag, playerStatus: status, slots};
      emit('arm7-pass', {periodic, finishedTag, playerStatus: status});
      return {passSerial, periodicFrame, periodic, appliedRegisters, masterPanCommands:copy(masterPanCommands), voiceEvents, acknowledgement: copy(acknowledgement)};
    }
    function snapshot() {
      return copy({sourceCommit: SOURCE_COMMIT, profile: 'bounded-nine-effects-explicit-phases', periodicFrame, passSerial, currentTag, finishedTag, arm9FinishedTag, groups, handles: Object.fromEntries(handles), freeSlots, admitted: orderedAdmissions(), drivers: drivers.map(p => p && Object.assign({}, p, {tracks: p.tracks.map(t => t && Object.assign({}, t, {body: undefined}))})), pendingCommands: reserved, flushedBatches: batches, acknowledgement, logicalTracks:tv?logicalTracks:undefined, voices: voices.snapshot()});
    }
    return {requestStart, requestStop, requestPause,requestVolume,requestMoveVolume,...(fieldMusic?{requestFieldFade}:{}),status, requestMasterPan, stopAll, releaseHandle, arm9Main, flush, arm7Pass, hardwareComplete: (channelId, voiceGeneration) => voices.hardwareComplete(channelId, voiceGeneration), snapshot, drainEvents: () => events.splice(0), voices};
  }
  return Object.freeze({create, supportedIds: Object.freeze(IDS.slice()), sourceCommit: SOURCE_COMMIT, controlIntervalSeconds: CONTROL_INTERVAL_SECONDS});
}));
