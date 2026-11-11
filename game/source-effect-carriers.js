/* Independent bounded software carrier model; no audio device or WebAudio APIs.
 * Profile: pinned melonDS functional observations (497aa6c...), not copied code.
 * Its 16756991 Hz carrier clock is distinct from the original 33514000 Hz
 * control scheduler. Source ARM9 register tables are supplied by the voice
 * core; their identity with ARM7 BIOS services is unverified. Output is held
 * sample observation, linear register gain/pan, fixed 0.25 headroom, not a
 * hardware DAC/filter/mixer/resampler or a claim of listening parity.
 * Source asset and GPL reference rights remain separate; see carrier REPORT.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./source-tv-data.js'),require('./source-default-music-data.js'),require('./source-rival-audio-data.js'));
  else root.SourceEffectCarriers = factory(root.SourceTvData,root.SourceDefaultMusicData,root.SourceRivalAudioData);
}(typeof globalThis !== 'undefined' ? globalThis : this, function (TvData,MusicData,RivalData) {
  'use strict';
  const CLOCK_HZ = 16756991;
  const PROFILE = Object.freeze({
    id: 'source-control-pinned-carrier-approximation-v1',
    carrierClockHz: CLOCK_HZ, controlClockHz: 33514000, controlPeriodClocks: 174592,
    headroom: 0.25, biosIdentityVerified: false, hardwareParityVerified: false,
    sampleObservation: 'right-edge held sample, no interpolation or final DAC filtering',
    referenceCommit: '497aa6cdd26f45f8064b78916b00a773eab4ded7'
  });
  const DIAGNOSTIC_PROFILE = Object.freeze(Object.assign({}, PROFILE, {
    id: 'diagnostic-carriers-unrestricted-records-v1', production: false
  }));
  const PINNED_WAVES = Object.freeze({
    '1000:44': {"bytes":2264,"sha256":"da99121459bd098ab04b8a2c25c95efecbd40c4fc6acad088da67fb5bf5a367d","archive_id":1000,"wave_id":44,"format":2,"loop":true,"sample_rate":22131,"timer":757,"loop_start_words":394,"loop_length_words":169,"crc32":663824931},
    '1000:153': {"bytes":1504,"sha256":"11f66c40a2746fcd600dd77826bd09bfc25412f82630c05ac9ac0104fab60157","archive_id":1000,"wave_id":153,"format":2,"loop":true,"sample_rate":16053,"timer":1043,"loop_start_words":222,"loop_length_words":151,"crc32":997137727,"raw_base64":"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"},
    '1000:42': {bytes:5604,crc32:0xf0f6422d,sha256:'1eeeefbbac90d64c3ef38322465039d3aa7a2b237e1af01a8e7cb1c37175a519',archive_id:1000,wave_id:42,format:2,loop:true,sample_rate:22083,timer:758,loop_start_words:902,loop_length_words:496},
    '1500:6': {bytes:2668,crc32:0x9d3daa1a,sha256:'d94fb150e13df4072b5ef34bee3b43e582309a560dd689dcf43023527584e2ff',archive_id:1500,wave_id:6,format:2,loop:false,sample_rate:13379,timer:1252,loop_start_words:1,loop_length_words:663},
    '1500:7': {bytes:1428,crc32:0x5fa6b94b,sha256:'b3a822752cc8b6f10b78a8dbc9b79f82e9d89933e9b4636d4acdcbf780d6fef0',archive_id:1500,wave_id:7,format:2,loop:true,sample_rate:13434,timer:1247,loop_start_words:202,loop_length_words:152},
    '1500:23': {bytes:900,crc32:0xe162141e,sha256:'aa6f4efc3d234b14c75a262155ea0fa1794106b4c4470f44e9ff400960f89989',archive_id:1500,wave_id:23,format:2,loop:false,sample_rate:11025,timer:1519,loop_start_words:1,loop_length_words:221}
  });
  const CHANNELS = Object.freeze([11, 12, 14, 15]);
  const DIVISORS = [1, 2, 4, 16];
  const MAX_WAVE_BYTES = 65536;
  const MAX_EVENTS = 64;
  // Standard IMA ADPCM quantization constants, expressed as numeric facts.
  const IMA_STEPS = [7,8,9,10,11,12,13,14,16,17,19,21,23,25,28,31,
    34,37,41,45,50,55,60,66,73,80,88,97,107,118,130,143,157,173,190,
    209,230,253,279,307,337,371,408,449,494,544,598,658,724,796,876,
    963,1060,1166,1282,1411,1552,1707,1878,2066,2272,2499,2749,3024,
    3327,3660,4026,4428,4871,5358,5894,6484,7132,7845,8630,9493,
    10442,11487,12635,13899,15289,16818,18500,20350,22385,24623,
    27086,29794,32767];
  function requireValue(ok, detail) { if (!ok) throw new RangeError('SourceEffectCarriers: ' + detail); }
  function integer(value, low, high, name) {
    requireValue(Number.isSafeInteger(value) && value >= low && value <= high, name);
    return value;
  }
  function byteArray(input) {
    if (input instanceof Uint8Array) {
      requireValue(input.byteLength <= MAX_WAVE_BYTES, 'wave byte budget');
      return new Uint8Array(input);
    }
    if (input instanceof ArrayBuffer) {
      requireValue(input.byteLength <= MAX_WAVE_BYTES, 'wave byte budget');
      return new Uint8Array(input.slice(0));
    }
    if (Array.isArray(input)) {
      requireValue(input.length <= MAX_WAVE_BYTES, 'wave byte budget');
      for (const value of input) integer(value, 0, 255, 'byte');
      return Uint8Array.from(input);
    }
    if (typeof input === 'string') {
      requireValue(input.length <= Math.ceil(MAX_WAVE_BYTES / 3) * 4 && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(input), 'canonical base64 required');
      // AudioWorkletGlobalScope need not provide Buffer or atob. Decode using
      // only ECMAScript primitives, with bounded allocation and canonical pad bits.
      const padding = input.endsWith('==') ? 2 : input.endsWith('=') ? 1 : 0;
      const length = input.length / 4 * 3 - padding;
      requireValue(length <= MAX_WAVE_BYTES, 'wave byte budget');
      function sextet(code) {
        if (code >= 65 && code <= 90) return code - 65;
        if (code >= 97 && code <= 122) return code - 71;
        if (code >= 48 && code <= 57) return code + 4;
        return code === 43 ? 62 : 63; // Alphabet already validated above.
      }
      if (padding) requireValue(sextet(input.charCodeAt(input.length - padding - 1)) % (padding === 2 ? 16 : 4) === 0, 'canonical base64 padding bits required');
      const bytes = new Uint8Array(length);
      let output = 0;
      for (let i = 0; i < input.length; i += 4) {
        const first = sextet(input.charCodeAt(i)), second = sextet(input.charCodeAt(i + 1));
        const third = input[i + 2] === '=' ? 0 : sextet(input.charCodeAt(i + 2));
        const fourth = input[i + 3] === '=' ? 0 : sextet(input.charCodeAt(i + 3));
        bytes[output++] = first * 4 + Math.floor(second / 16);
        if (output < length) bytes[output++] = (second % 16) * 16 + Math.floor(third / 4);
        if (output < length) bytes[output++] = (third % 4) * 64 + fourth;
      }
      return bytes;
    }
    throw new TypeError('SourceEffectCarriers: complete raw wave record required');
  }
  function signed16(value) { return value >= 32768 ? value - 65536 : value; }
  function decodeNibble(predictor, index, nibble) {
    const size = IMA_STEPS[index];
    const magnitude = nibble % 8;
    const delta = Math.floor(size / 8) + (magnitude % 2) * Math.floor(size / 4)
      + (Math.floor(magnitude / 2) % 2) * Math.floor(size / 2) + Math.floor(magnitude / 4) * size;
    const next = nibble >= 8 ? Math.max(-32767, predictor - delta) : Math.min(32767, predictor + delta);
    const adjustment = magnitude < 4 ? -1 : 2 * (magnitude - 3);
    return [next, Math.max(0, Math.min(88, index + adjustment))];
  }
  function parseWaveRecord(record) {
    const raw = byteArray(record && (record.raw_base64 || record.raw) || record);
    integer(raw.length, 28, MAX_WAVE_BYTES, 'wave size must be 28..65536 bytes');
    const view = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);
    const format = integer(raw[0], 0, 2, 'PCM8, PCM16 or ADPCM format required');
    integer(raw[1], 0, 1, 'loop flag');
    const loop = raw[1] === 1, sample_rate = view.getUint16(2, true), timer = view.getUint16(4, true);
    const loop_start_words = view.getUint16(6, true), loop_length_words = view.getUint32(8, true);
    integer(timer, 16, 65535, 'wave base timer');
    integer(loop_length_words, 1, MAX_WAVE_BYTES / 4, 'nonempty loop/length');
    const byteCount = 4 * (loop_start_words + loop_length_words);
    requireValue(byteCount + 12 === raw.length, 'wave header length disagrees with record');
    if (format === 2) requireValue(loop_start_words >= 1, 'ADPCM loop/start must skip predictor header');
    // Fail closed when a bundle's stated header differs from the carried bytes.
    const metadata = {format, loop, timer, sample_rate, loop_start_words, loop_length_words, bytes: raw.length};
    if (record && typeof record === 'object' && !(record instanceof Uint8Array) && !(record instanceof ArrayBuffer) && !Array.isArray(record)) {
      for (const field of Object.keys(metadata)) {
        if (record[field] !== undefined) requireValue(record[field] === metadata[field], 'wave metadata mismatch: ' + field);
      }
    }
    const data = raw.subarray(12);
    const firstPosition = format === 2 ? 8 : 0;
    const endPosition = format === 1 ? byteCount / 2 : format === 2 ? byteCount * 2 : byteCount;
    const loopPosition = loop_start_words * (format === 1 ? 2 : format === 2 ? 8 : 4);
    const samples = new Int16Array(endPosition - firstPosition);
    const indices = format === 2 ? new Uint8Array(samples.length) : null;
    let initialPredictor = null, initialIndex = null;
    if (format === 2) {
      initialPredictor = signed16(data[0] + 256 * data[1]);
      initialIndex = Math.min(88, data[2] % 128);
      let predictor = initialPredictor, index = initialIndex;
      for (let i = 0; i < samples.length; i++) {
        const packed = data[4 + Math.floor(i / 2)];
        const nibble = i % 2 ? Math.floor(packed / 16) : packed % 16;
        [predictor, index] = decodeNibble(predictor, index, nibble);
        samples[i] = predictor; indices[i] = index;
      }
    } else {
      for (let i = 0; i < samples.length; i++) {
        samples[i] = format === 0 ? (data[i] >= 128 ? data[i] - 256 : data[i]) * 256 : signed16(data[2*i] + 256*data[2*i+1]);
      }
    }
    const loopIndex = loopPosition - firstPosition;
    return Object.freeze(Object.assign(metadata, {
      firstPosition, endPosition, loopPosition, initialPredictor, initialIndex,
      loopPredictor: format === 2 ? samples[loopIndex] : null,
      loopIndex: format === 2 ? indices[loopIndex] : null,
      // No envelope or pitch timeline is baked into these immutable-in-use samples.
      samples, indices
    }));
  }
  function noiseTransition(state) {
    integer(state, 1, 32767, 'nonzero 15-bit noise state');
    const outgoing = state % 2;
    const bit13 = (Math.floor(state / 16384) + outgoing) % 2;
    return {state: (Math.floor(state / 2) % 8192) + 8192 * bit13 + 16384 * outgoing,
      sample: 32767 * (1 - 2 * outgoing)};
  }
  function psgSample(duty, phase) {
    integer(duty, 0, 7, 'PSG duty'); integer(phase, 0, 7, 'PSG phase');
    return phase < (duty === 7 ? 8 : 7 - duty) ? -32767 : 32767;
  }
  function effectiveSevenBit(value) { integer(value, 0, 127, 'seven-bit register'); return value === 127 ? 128 : value; }
  function registerGains(volume, pan) {
    integer(volume, 0, 895, 'encoded volume');
    const divider = Math.floor(volume / 256), level = volume % 256;
    integer(divider, 0, 3, 'divider'); integer(level, 0, 127, 'volume');
    const gain = PROFILE.headroom * effectiveSevenBit(level) / (128 * DIVISORS[divider]);
    const right = effectiveSevenBit(pan) / 128;
    return [gain * (1 - right), gain * right];
  }
  function crc32(bytes) {
    let value = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
      value ^= bytes[i];
      for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0);
    }
    return (value ^ 0xffffffff) >>> 0;
  }
  function build(options, diagnostic) {
    options = options || {};
    const tv=options.tv===true,music=options.defaultMusic===true;requireValue(!music||(tv&&MusicData?.schema==='exact-default-music-input-v1'),'default-music native input dependency');requireValue(!tv||(!diagnostic&&TvData),'TV native input dependency');
    const rival=options.rivalStory===true;requireValue(!rival||(music&&RivalData?.schema==='exact-rival-story-audio-v1'),'rival native input dependency');
    const admittedWaves=tv?Object.assign({},PINNED_WAVES,TvData.waves,music?MusicData.waves:{},rival?RivalData.waves:{}):PINNED_WAVES;
    const pool=tv?[0,1,2,3,4,5,6,7,8,9,10,11,12,14,15]:CHANNELS;
    const activeProfile = diagnostic ? DIAGNOSTIC_PROFILE : PROFILE;
    const sampleRate = integer(options.sampleRate === undefined ? 48000 : options.sampleRate, 8000, 192000, 'integer sample rate 8000..192000');
    if (options.profile !== undefined) requireValue(options.profile === activeProfile.id || (options.profile && (options.profile.id === activeProfile.id || options.profile.name === activeProfile.id)), 'unsupported profile');
    if (options.clockHz !== undefined) requireValue(options.clockHz === CLOCK_HZ, 'profile carrier clock cannot change');
    const waveInputs = options.waves || {};
    requireValue(waveInputs && typeof waveInputs === 'object' && Object.keys(waveInputs).length <= (rival?66:music?46:tv?21:16), 'wave dictionary bound');
    const waves = Object.create(null);
    const keys = Object.keys(waveInputs).sort();
    if (!diagnostic) requireValue(keys.join('|') === Object.keys(admittedWaves).sort().join('|'), 'exact six pinned wave identities required');
    for (const id of keys) {
      const record = waveInputs[id];
      if (!diagnostic) {
        const expected = admittedWaves[id];
        requireValue(record && typeof record === 'object' && typeof record.raw_base64 === 'string', 'pinned raw wave record and metadata required');
        for (const field of Object.keys(expected)) {
          if (field !== 'crc32') requireValue(record[field] === expected[field], 'pinned wave metadata mismatch: ' + id + ' ' + field);
        }
        const bytes = byteArray(record.raw_base64);
        requireValue(bytes.length === expected.bytes && crc32(bytes) === expected.crc32, 'pinned wave byte integrity mismatch: ' + id);
      }
      waves[id] = parseWaveRecord(record);
    }
    const voices = new Map(), lastGenerations = new Map();
    let clock = 0, frame = 0, sampleRemainder = 0, masterPan = -1;
    function normalize(event) {
      requireValue(event && typeof event === 'object', 'event required');
      const type = event.type;
      requireValue(type === 'start' || type === 'stop' || type === 'update', 'start/stop/update event required');
      const channel = event.channel === undefined ? event.channelId : event.channel;
      const generation = event.generation === undefined ? event.voiceGeneration : event.generation;
      requireValue(pool.includes(channel), 'channel outside bounded pool 0xd800');
      integer(generation, type === 'stop' ? 0 : 1, Number.MAX_SAFE_INTEGER, 'positive generation (zero permitted only for inert initial stop)');
      if (event.channelId !== undefined) requireValue(event.channelId === channel, 'channel aliases disagree');
      if (event.voiceGeneration !== undefined) requireValue(event.voiceGeneration === generation, 'generation aliases disagree');
      const value = {type, channel, generation};
      if (type === 'stop') return value;
      value.timer = integer(event.timer, 16, 65535, 'positive source timer period');
      value.volume = event.volume; value.pan = event.pan;
      integer(value.pan,0,127,'submitted pan');value.gains = registerGains(value.volume,masterPan>=0?masterPan:value.pan);
      if (type === 'start') {
        const instrument = event.instrument;
        requireValue(instrument && (instrument.type === 1 || instrument.type === 2 || instrument.type === 3), 'supported source instrument required');
        value.kind = instrument.type;
        if (value.kind === 1) {
          const ref = event.wave === undefined ? instrument.wave : event.wave;
          requireValue(ref !== undefined && ref !== null, 'sampled instrument wave required');
          value.waveId = typeof ref === 'string' ? ref : ref.archive_id + ':' + ref.wave_id;
          value.wave = waves[value.waveId];
          requireValue(value.wave !== undefined, 'wave not in input bundle: ' + value.waveId);
        } else if (value.kind === 2) {
          requireValue(channel === 11 || channel === 12, 'PSG channel restriction');
          value.duty = integer(instrument.psg_duty, 0, 7, 'instrument PSG duty');
          requireValue(value.duty === 0 || value.duty === 3, 'PSG duty outside selected instruments');
          requireValue(value.timer % 4 === 0, 'source PSG timer masking required');
        } else requireValue(channel === 14 || channel === 15, 'noise channel restriction');
      }
      return value;
    }
    function applyAll(events) {
      requireValue(Array.isArray(events) && events.length <= MAX_EVENTS, 'event batch bound');
      const prepared = events.map(normalize); // Validate entire batch before changing state.
      // Preflight state-dependent checks too, so malformed batches are atomic.
      const preview = new Map(), previewGenerations = new Map(lastGenerations);
      for (const [channel, voice] of voices) preview.set(channel, {kind: voice.kind, generation: voice.generation, active: voice.active});
      for (const event of prepared) {
        const current = preview.get(event.channel);
        if (event.type === 'start' && event.generation > (previewGenerations.get(event.channel) || 0)) {
          preview.set(event.channel, {kind: event.kind, generation: event.generation, active: true});
          previewGenerations.set(event.channel, event.generation);
        } else if (event.type !== 'start' && current && current.active && current.generation === event.generation) {
          if (event.type === 'stop') current.active = false;
          else requireValue(current.kind !== 2 || event.timer % 4 === 0, 'source PSG timer masking required');
        }
      }
      const accepted = [];
      for (const event of prepared) {
        const current = voices.get(event.channel);
        if (event.type === 'start') {
          if (event.generation <= (lastGenerations.get(event.channel) || 0)) continue;
          lastGenerations.set(event.channel, event.generation);
          voices.set(event.channel, Object.assign({}, event, {active: true, pendingStart: true, sample: 0,
            position: event.kind === 1 ? -3 : -1, remaining: event.timer,
            noiseState: 32767, advances: 0, loops: 0, startedAt: clock}));
        } else {
          if (!current || !current.active || current.generation !== event.generation) continue;
          if (event.type === 'stop') { current.active = false; current.sample = 0; }
          else {
            requireValue(current.kind !== 2 || event.timer % 4 === 0, 'source PSG timer masking required');
            // Reload is future-only. remaining, position, decoder and noise phase survive.
            current.timer = event.timer; current.volume = event.volume;
            current.pan = event.pan; current.gains = event.gains;
          }
        }
        accepted.push({type: event.type, channel: event.channel, generation: event.generation});
      }
      return accepted;
    }
    function next(voice) {
      voice.advances++;
      if (voice.kind === 3) {
        const outgoing = voice.noiseState % 2;
        const bit13 = (Math.floor(voice.noiseState / 16384) + outgoing) % 2;
        voice.noiseState = Math.floor(voice.noiseState / 2) % 8192 + 8192 * bit13 + 16384 * outgoing;
        voice.sample = 32767 * (1 - 2 * outgoing); return false;
      }
      if (voice.kind === 2) {
        voice.position = (voice.position + 1) % 8;
        voice.sample = psgSample(voice.duty, voice.position); return false;
      }
      voice.position++;
      const wave = voice.wave;
      if (voice.position < wave.firstPosition) return false;
      if (voice.position >= wave.endPosition) {
        if (!wave.loop) { voice.active = false; voice.sample = 0; return true; }
        voice.position = wave.loopPosition; voice.loops++;
      }
      voice.sample = wave.samples[voice.position - wave.firstPosition];
      return false;
    }
    function advanceInto(cycles, completions) {
      for (let slot = 0; slot < pool.length; slot++) {
        const channel = pool[slot];
        const voice = voices.get(channel);
        if (!voice || !voice.active) continue;
        if (voice.pendingStart) {
          // The reference enable edge latches a start; first active advance uses
          // the latest registers. This is distinct from an in-flight reload.
          voice.pendingStart = false;
          voice.remaining = voice.timer;
        }
        let pending = cycles, elapsed = 0;
        // timer >= 16 and <= 4 channels bounds this to <= 4,189,248 steps/call.
        while (pending >= voice.remaining) {
          pending -= voice.remaining; elapsed += voice.remaining;
          voice.remaining = voice.timer;
          if (next(voice)) {
            completions.push({type: 'complete', reason: 'sample-exhausted', channel,
              channelId: channel, generation: voice.generation, voiceGeneration: voice.generation,
              clock: clock + elapsed});
            break;
          }
        }
        if (voice.active) voice.remaining -= pending;
      }
      clock += cycles;
    }
    function completionOrder(a, b) { return a.clock - b.clock || a.channel - b.channel; }
    function advanceCycles(cycles) {
      integer(cycles, 0, CLOCK_HZ, 'advance call must be <= one carrier second');
      integer(clock + cycles, 0, Number.MAX_SAFE_INTEGER, 'clock overflow');
      const completions = [];
      advanceInto(cycles, completions);
      return completions.sort(completionOrder);
    }
    function sample() {
      let left = 0, right = 0;
      for (const channel of pool) {
        const voice = voices.get(channel);
        if (!voice || !voice.active) continue;
        const amplitude = voice.sample / 32768;
        left += amplitude * voice.gains[0]; right += amplitude * voice.gains[1];
      }
      return [left, right];
    }
    function render(frames) {
      integer(frames, 0, sampleRate, 'render call must be <= one output second');
      integer(frame + frames, 0, Number.MAX_SAFE_INTEGER, 'frame overflow');
      integer(clock + Math.ceil(frames * CLOCK_HZ / sampleRate), 0, Number.MAX_SAFE_INTEGER, 'clock overflow');
      const left = new Float32Array(frames), right = new Float32Array(frames), completions = [];
      const firstFrame = frame, clockStart = clock;
      for (let i = 0; i < frames; i++) {
        sampleRemainder += CLOCK_HZ;
        const cycles = Math.floor(sampleRemainder / sampleRate);
        sampleRemainder %= sampleRate;
        advanceInto(cycles, completions);
        let mixedLeft = 0, mixedRight = 0;
        for (let j = 0; j < pool.length; j++) {
          const voice = voices.get(pool[j]);
          if (!voice || !voice.active) continue;
          const amplitude = voice.sample / 32768;
          mixedLeft += amplitude * voice.gains[0]; mixedRight += amplitude * voice.gains[1];
        }
        left[i] = mixedLeft; right[i] = mixedRight;
      }
      frame += frames;
      completions.sort(completionOrder);
      return {left, right, completions, firstFrame, frames, clockStart, clockEnd: clock};
    }
    // sOrgPan is the last submitted register pan, not future ExChannel state.
    function setMasterPan(value){requireValue(value===-1||value===64,'ordinary master pan');masterPan=value;for(const voice of voices.values())voice.gains=registerGains(voice.volume,masterPan>=0?masterPan:voice.pan);return masterPan;}
    function snapshot() {
      return {profile: activeProfile.id, clock, frame, sampleRate, sampleRemainder, masterPan,
        channels: pool.map(function (channel) {
          const voice = voices.get(channel);
          if (!voice) return {channel, active: false, generation: lastGenerations.get(channel) || 0};
          const at = voice.wave ? voice.position - voice.wave.firstPosition : -1;
          return {channel, generation: voice.generation, active: voice.active, kind: voice.kind,
            pendingStart: voice.pendingStart, waveId: voice.waveId || null, timer: voice.timer, remaining: voice.remaining,
            volume: voice.volume, pan: voice.pan, effectivePan: masterPan>=0?masterPan:voice.pan, sample: voice.sample, position: voice.position,
            duty: voice.duty === undefined ? null : voice.duty, noiseState: voice.noiseState,
            decoderIndex: voice.wave && voice.wave.indices && at >= 0 && at < voice.wave.indices.length ? voice.wave.indices[at] : null,
            advances: voice.advances, loops: voice.loops, startedAt: voice.startedAt};
        })};
    }
    function reset() { voices.clear(); lastGenerations.clear(); clock = 0; frame = 0; sampleRemainder = 0; }
    return Object.freeze({reset,setMasterPan, apply: function (event) { return applyAll([event]); }, applyAll,
      advanceCycles, sample, render, snapshot, profile: activeProfile});
  }
  function create(options) { return build(options, false); }
  function createDiagnostic(options) { return build(options, true); }
  return Object.freeze({create, createDiagnostic, parseWaveRecord, noiseTransition, psgSample, registerGains,
    PROFILE, DIAGNOSTIC_PROFILE, CLOCK_HZ, CHANNELS, MAX_WAVE_BYTES, MAX_EVENTS});
}));
