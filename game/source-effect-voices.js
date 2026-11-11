/* SourceEffectVoices: silent bounded SND_exChannel / SND_seq model.
 * Original Diamond b623abef1b4dfe204ca50aab42447ac00c134290.
 * ARM9 carried lookup profile, NOT verified ARM7 BIOS table equivalence.
 * No sample decoding, output device, clock, or audio API lives in this module.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./source-tv-stream.js'));
  else root.SourceEffectVoices = factory(root.SourceTvStream);
}(typeof globalThis !== 'undefined' ? globalThis : this, function (BaseTv) {
  'use strict';
  const ENV = Object.freeze({ ATTACK: 0, DECAY: 1, SUSTAIN: 2, RELEASE: 3 });
  const FLAGS = Object.freeze({ START: 1, STOP: 2, TIMER: 4, VOLUME: 8, PAN: 16 });
  const MASK = 0xd800, SHIFTS = [0, 1, 2, 4];
  const ORDER = [4, 5, 6, 7, 2, 0, 3, 1, 8, 9, 10, 11, 14, 12, 15, 13];
  const ATTACK = [0, 1, 5, 14, 26, 38, 51, 63, 73, 84, 92, 100, 109, 116, 123, 127, 132, 137, 143];
  const EFFECTS = { 1563: ['1500:4','1500:93'], 1500: ['1000:5'], 1501: ['1000:32'], 1504: ['1000:5'], 1533: ['1000:69'], 1537: ['1500:87'], 1539: ['1500:125', '1500:101'], 1541: ['1500:114', '1500:95'], 1543: ['1500:117', '1500:95'] };
  // [type, root_key, attack, decay, sustain, release, pan, wave_id, timer, wave_arc_slot]
  const INSTRUMENTS = {
    '1500:4': [1,72,127,100,0,125,64,44,757,0],
    '1500:93': [2,60,126,100,50,118,64,3,8006,0],
    '1000:69': [3,60,125,100,0,120,64,0,8006,0],
    '1000:32': [1,50,127,60,1,120,64,153,1043,0],
    '1000:5': [1,72,127,80,0,116,64,42,758,0],
    '1500:87': [2,60,125,90,0,127,64,3,8006,0],
    '1500:114': [1,60,125,127,127,120,64,6,1252,1],
    '1500:95': [2,60,124,100,80,120,64,0,8006,0],
    '1500:117': [1,60,125,10,0,120,64,7,1247,1],
    '1500:125': [3,60,50,127,80,118,64,0,8006,0],
    '1500:101': [1,60,99,99,99,110,64,23,1519,1]
  };
  // SDAT INFO bank links consumed by SND_NoteOn: wave[1] selects the
  // bank's archive link, then wave[0] selects its member. Membership in
  // the five-wave bundle alone does not authorize crossing those links.
  const WAVE_ARCHIVES = { '1000': {0:1000}, '1500': {0:1000,1:1500} };
  const WAVE_HASHES = {
    '1000:44': 'da99121459bd098ab04b8a2c25c95efecbd40c4fc6acad088da67fb5bf5a367d',
    '1000:153': '11f66c40a2746fcd600dd77826bd09bfc25412f82630c05ac9ac0104fab60157',
    '1000:42': '1eeeefbbac90d64c3ef38322465039d3aa7a2b237e1af01a8e7cb1c37175a519',
    '1500:6': 'd94fb150e13df4072b5ef34bee3b43e582309a560dd689dcf43023527584e2ff',
    '1500:7': 'b3a822752cc8b6f10b78a8dbc9b79f82e9d89933e9b4636d4acdcbf780d6fef0',
    '1500:23': 'aa6f4efc3d234b14c75a262155ea0fa1794106b4c4470f44e9ff400960f89989'
  };
  const TABLE_HASH = '3212178f0e70e8a08dc3ac2d986c882977b7d173364718477a7673296be94076';
  const WAVE_FIELDS = {
    '1000:44': [2,true,394,169,2264,22131,757],
    '1000:153': [2,true,222,151,1504,16053,1043],
    '1000:42': [2,true,902,496,5604,22083,758], '1500:6': [2,false,1,663,2668,13379,1252],
    '1500:7': [2,true,202,152,1428,13434,1247], '1500:23': [2,false,1,221,900,11025,1519]
  };
  // Synchronous SHA-256 over ASCII canonical table JSON. Works without Node,
  // browser crypto, IO or a mutable injected implementation.
  function sha256Ascii(text) {
    const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    const h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const bytes=Array.from(text,c=>c.charCodeAt(0)), length=bytes.length;
    bytes.push(128);while(bytes.length%64!==56)bytes.push(0);
    bytes.push(0,0,0,0,(length>>>21)&255,(length>>>13)&255,(length>>>5)&255,(length<<3)&255);
    const rotr=(x,n)=>(x>>>n)|(x<<(32-n));
    for(let off=0;off<bytes.length;off+=64) {
      const w=new Array(64);
      for(let i=0;i<16;i++)w[i]=(bytes[off+i*4]<<24)|(bytes[off+i*4+1]<<16)|(bytes[off+i*4+2]<<8)|bytes[off+i*4+3];
      for(let i=16;i<64;i++) {
        const a=w[i-15],b=w[i-2],s0=rotr(a,7)^rotr(a,18)^(a>>>3),s1=rotr(b,17)^rotr(b,19)^(b>>>10);
        w[i]=(w[i-16]+s0+w[i-7]+s1)|0;
      }
      let [a,b,c,d,e,f,g,hh]=h;
      for(let i=0;i<64;i++) {
        const s1=rotr(e,6)^rotr(e,11)^rotr(e,25),choice=(e&f)^(~e&g);
        const t1=(hh+s1+choice+k[i]+w[i])|0,s0=rotr(a,2)^rotr(a,13)^rotr(a,22),majority=(a&b)^(a&c)^(b&c),t2=(s0+majority)|0;
        hh=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;
      }
      [a,b,c,d,e,f,g,hh].forEach((v,i)=>{h[i]=(h[i]+v)|0;});
    }
    return h.map(x=>(x>>>0).toString(16).padStart(8,'0')).join('');
  }
  const clone = x => x == null ? x : JSON.parse(JSON.stringify(x));
  const integer = (x, lo, hi, name) => {
    if (!Number.isSafeInteger(x) || x < lo || x > hi) throw new RangeError(name + ' outside bounded source range');
    return x;
  };
  // Own a bounded plain-data tree before admission. Descriptor reads avoid
  // getters and JSON hooks; the same snapshot is validated and retained.
  // This is an input-data boundary, not a sandbox for arbitrary Proxy traps.
  function dataSnapshot(input, name) {
    const ancestors=new Set();let nodes=0,chars=0;
    const fail=()=>{throw new TypeError(name+' must contain bounded plain data');};
    function copy(value,depth) {
      if (++nodes>4096 || depth>16) fail();
      if (value===null || typeof value==='boolean') return value;
      if (typeof value==='number') {if (!Number.isFinite(value)) fail();return value;}
      if (typeof value==='string') {chars+=value.length;if(chars>65536)fail();return value;}
      if (typeof value!=='object' || ancestors.has(value)) fail();
      const array=Array.isArray(value),proto=Object.getPrototypeOf(value);
      // Accept ordinary records across realms, but not boxed/exotic objects.
      if (!array && proto!==null && Object.getPrototypeOf(proto)!==null) fail();
      const keys=Reflect.ownKeys(value);if(keys.length>4096)fail();
      const descriptors=Object.getOwnPropertyDescriptors(value);
      let result;
      if (array) {
        const length=descriptors.length;
        if (!length || !('value' in length) || !Number.isSafeInteger(length.value) || length.value<0 || length.value>4096) fail();
        result=new Array(length.value);
        if (keys.length!==length.value+1) fail();
      } else result=Object.create(null);
      ancestors.add(value);
      for(const key of keys) {
        if(typeof key!=='string')fail();
        const d=descriptors[key];
        if (!d || !('value' in d)) fail();
        if(array && key==='length')continue;
        if(!d.enumerable || (array && (!/^(0|[1-9][0-9]*)$/.test(key) || Number(key)>=result.length)))fail();
        chars+=key.length;if(chars>65536)fail();
        Object.defineProperty(result,key,{value:copy(d.value,depth+1),enumerable:true});
      }
      ancestors.delete(value);return Object.freeze(result);
    }
    return copy(input,0);
  }
  const get = (o, k, fallback) => o[k] === undefined ? fallback : o[k];
  const s16 = x => (x << 16) >> 16;
  const s8 = x => (x << 24) >> 24;
  function attackCoefficient(v, table) { integer(v,0,127,'attack'); return v < 109 ? 255-v : (table || ATTACK)[127-v]; }
  function rateCoefficient(v) { integer(v,0,127,'decay/release'); return v===127 ? 65535 : v===126 ? 15360 : v<50 ? v*2+1 : Math.trunc(7680/(126-v)); }
  function rawLoudness(v) { integer(v,0,0x37f,'volume register'); if ((v & 255)>127) throw new RangeError('volume register'); return ((v&255)<<4)>>SHIFTS[v>>8]; }
  function envelopeStep(c, periodic, square) {
    if (periodic) {
      switch (c.envStatus) {
        case ENV.ATTACK:
          c.envAttenuation = -((-c.envAttenuation*c.envAttack)>>8);
          if (c.envAttenuation === 0) c.envStatus = ENV.DECAY;
          break;
        case ENV.DECAY: {
          const sustain = square[c.envSustain]<<7;
          c.envAttenuation = (c.envAttenuation-c.envDecay)|0;
          if (c.envAttenuation <= sustain) { c.envAttenuation=sustain; c.envStatus=ENV.SUSTAIN; }
          break;
        }
        case ENV.SUSTAIN: break;
        case ENV.RELEASE: c.envAttenuation=(c.envAttenuation-c.envRelease)|0; break;
        default: throw new Error('Unsupported envelope state');
      }
    }
    return c.envAttenuation>>7;
  }
  function volumeRegister(value, table) {
    integer(value,-0x80000000,0x7fffffff,'attenuation');
    value=Math.max(-723,Math.min(0,value));
    return table[value+723] | ((value < -240 ? 3 : value < -120 ? 2 : value < -60 ? 1 : 0)<<8);
  }
  function pitchTimer(timer, pitch, table) {
    integer(timer,1,65535,'base timer'); integer(pitch,-65536,65535,'pitch');
    // Source uses unsigned 64-bit product and shifts, not floating exponentiation.
    const normalized=-pitch, octave=Math.floor(normalized/768), index=normalized-octave*768;
    let result=BigInt(table[index]+65536)*BigInt(timer);
    const shift=octave-16;
    if (shift<=0) result >>= BigInt(-shift);
    else if (shift<32) {
      if ((result & ((0xffffffffffffffffn << BigInt(32-shift)) & 0xffffffffffffffffn))!==0n) return 65535;
      result <<= BigInt(shift);
    } else return 65535;
    return result<16n ? 16 : result>65535n ? 65535 : Number(result);
  }
  function ownerKey(owner, tv=false, stream=BaseTv) {
    if (!owner) throw new Error('Only eight pinned effect owners are supported');
    integer(owner.effectId,0,65535,'effectId');
    if (!EFFECTS[owner.effectId] && !(tv && stream && stream.has(owner.effectId))) throw new Error('Only eight pinned effect owners are supported');
    integer(owner.sequenceGeneration,1,Number.MAX_SAFE_INTEGER,'sequenceGeneration');
    integer(owner.driverSlot,0,15,'driverSlot');
    integer(owner.trackIndex,0,15,'trackIndex');
    integer(owner.trackGeneration,1,Number.MAX_SAFE_INTEGER,'trackGeneration');
    return [owner.effectId,owner.sequenceGeneration,owner.driverSlot,owner.trackIndex,owner.trackGeneration].join(':');
  }
  function modulation(input, tv=false, music=false) {
    const m=Object.assign({target:0,depth:0,range:1,speed:16,delay:0},input || {});
    if ((m.depth!==0&&!(music&&[5,6,7,8,9,10,11,12,13,14,15,16,19].includes(m.depth))) || m.target!==0 || (!tv && m.range!==1) || (!tv && m.speed!==16) || (tv && ![1,2,3].includes(m.range)) || (tv && ![13,16,18].includes(m.speed)) || m.delay!==0) throw new Error('Non-default LFO outside verified nine-effect subset');
    if (music && (![16,18].includes(m.speed) || ![1,3].includes(m.range))) throw new Error('Default-music LFO controls outside reached source values');
    return m;
  }
  function rejectUnsupported(o,tv=false,music=false) {
    if (o.tie || o.portamento || (o.portamentoTime !== undefined && o.portamentoTime!==0) || (o.sweepPitch !== undefined && o.sweepPitch!==0)) throw new Error('Tie, portamento or nonzero sweep outside verified subset');
    if (o.mod) modulation(o.mod,tv,music);
    if (o.lfo) modulation(o.lfo.param || o.lfo,tv,music);
    for (const field of ['envAttack','envDecay','envSustain','envRelease']) {
      if (o[field] !== undefined && o[field] !== 255) throw new Error('Sequence ADSR override outside verified subset');
    }
  }
  function validateInstrument(owner, inst, tv=false, stream=BaseTv) {
    if (!inst) throw new Error('Source instrument required');
    inst=dataSnapshot(inst,'instrument');
    if(tv && stream.has(owner.effectId)){stream.validateInstrument(owner.effectId,inst);return inst;}
    const bank=integer(inst.bank_id,0,65535,'instrument bank_id');
    const program=integer(inst.program,0,65535,'instrument program');
    const id=bank+':'+program, pin=INSTRUMENTS[id];
    if (!pin || !EFFECTS[owner.effectId].includes(id)) throw new Error('Instrument outside selected effect');
    if (id==='1000:32' && (!inst.region || inst.region.low_key!==48 || inst.region.high_key!==127 || !Number.isInteger(inst.key) || inst.key<48 || inst.key>127 || inst.record_offset!==2274 || inst.record_hex!=='99000000327f3c017840')) throw new Error('DECIDE instrument differs from pinned split region');
    if (owner.effectId === 1504 && !(inst.record_offset === 2594 && inst.record_hex === "2a000000487f50007440" && Number.isInteger(inst.key) && inst.key >= 56 && inst.key <= 127 && inst.bank_file && inst.bank_file.file_id === 1305 && inst.bank_file.archive_offset === 1624352 && inst.bank_file.bytes === 3720 && inst.bank_file.sha256 === "4a6e42405078a53046a63f3fbe30df85b31f690bf79774f1a77e509ee42caab7" && inst.region && inst.region.low_key === 56 && inst.region.high_key === 127 && inst.wave && inst.wave.archive_member_offset === 119244 && inst.wave.archive_file && inst.wave.archive_file.file_id === 1822 && inst.wave.archive_file.archive_offset === 6573184 && inst.wave.archive_file.bytes === 458564 && inst.wave.archive_file.sha256 === "1bf3ab6785a1b6bfdcbeff6568b187488cb50db56774b99ce2844d9e22a86364")) throw new Error('Menu instrument differs from original record 1504');
    if (owner.effectId === 1533 && !(inst.record_offset === 666 && inst.record_hex === "000000003c7d64007840" && Number.isInteger(inst.key) && inst.key >= 0 && inst.key <= 127 && inst.bank_file && inst.bank_file.file_id === 1305 && inst.bank_file.archive_offset === 1624352 && inst.bank_file.bytes === 3720 && inst.bank_file.sha256 === "4a6e42405078a53046a63f3fbe30df85b31f690bf79774f1a77e509ee42caab7" && inst.region === null && inst.wave === undefined && inst.psg_duty === undefined)) throw new Error('Menu instrument differs from original record 1533');
    if(owner.effectId===1563){
      if(![59,64,71,84,96].includes(inst.key)||!inst.bank_file||inst.bank_file.file_id!==1310||inst.bank_file.archive_offset!==1643904||inst.bank_file.bytes!==4368||inst.bank_file.sha256!=='bd090d700aba2652150d3b2603401911a131733cc8999c16f33608b7958e5e7d')throw Error('Options sound bank/key differs');
      if(program===4){if(inst.record_offset!==3208||inst.record_hex!=='2c000000487f64007d40'||inst.region?.low_key!==55||inst.region?.high_key!==127||inst.wave?.archive_member_offset!==127648||inst.wave?.archive_file?.file_id!==1822||inst.wave?.archive_file?.archive_offset!==6573184||inst.wave?.archive_file?.bytes!==458564||inst.wave?.archive_file?.sha256!=='1bf3ab6785a1b6bfdcbeff6568b187488cb50db56774b99ce2844d9e22a86364')throw Error('Options sound sampled region differs');}
      else if(program!==93||inst.record_offset!==1012||inst.record_hex!=='030000003c7e64327640'||inst.region!==null||inst.wave!==undefined)throw Error('Options sound PSG record differs');
    }
    const values=[inst.type,inst.root_key,inst.attack,inst.decay,inst.sustain,inst.release,inst.pan,inst.wave_id,inst.type===1 && inst.wave ? inst.wave.timer : 8006,inst.wave_arc_slot];
    if (values.some((v,i)=>v!==pin[i])) throw new Error('Instrument source fields differ from pinned record');
    if (inst.type===2 && inst.psg_duty!==pin[7]) throw new Error('PSG duty differs from pinned record');
    if (inst.type===1) {
      const wave=inst.wave;
      if (wave) {integer(wave.archive_id,0,65535,'wave archive_id');integer(wave.wave_id,0,65535,'wave wave_id');}
      if (!wave || wave.archive_id!==WAVE_ARCHIVES[bank][inst.wave_arc_slot] || wave.wave_id!==inst.wave_id) throw new Error('Wave archive/member differs from pinned instrument binding');
      const waveId=wave.archive_id+':'+wave.wave_id;
      if (!wave || wave.format!==2 || WAVE_HASHES[waveId]!==wave.sha256) throw new Error('Wave identity outside pinned ADPCM subset');
      const actual=[wave.format,wave.loop,wave.loop_start_words,wave.loop_length_words,wave.bytes,wave.sample_rate,wave.timer];
      if (actual.some((v,i)=>v!==WAVE_FIELDS[waveId][i])) throw new Error('Wave header differs from pinned record');
    }
    return inst;
  }
  function controls(track,player,tables,tv=false,music=false) {
    track=track || {}; player=player || {}; rejectUnsupported(track,tv,music);
    const t={};
    for (const name of ['volume','expression','panRange']) t[name]=integer(get(track,name,127),0,127,'track '+name);
    t.pan=integer(get(track,'pan',0),-128,127,'track pan');
    t.extPan=integer(get(track,'extPan',0),-128,127,'track extPan');
    t.pitchBend=integer(get(track,'pitchBend',0),-128,127,'pitchBend');
    t.bendRange=integer(get(track,'bendRange',2),0,127,'bendRange');
    t.extPitch=integer(get(track,'extPitch',0),-32768,32767,'extPitch');
    t.extFader=integer(get(track,'extFader',0),-32768,32767,'track extFader');
    const pv=integer(get(player,'volume',127),0,127,'player volume');
    const pf=integer(get(player,'extFader',0),-32768,32767,'player extFader');
    const volume=Math.max(-32768,tables.decibel_square[t.volume]+tables.decibel_square[t.expression]+tables.decibel_square[pv]);
    const fader=s16(Math.max(-32768,t.extFader+pf));
    const pitch=s16(((t.pitchBend*(t.bendRange<<6))>>7)+t.extPitch);
    let pan=t.pan;
    if (t.panRange!==127) pan=(pan*t.panRange+64)>>7;
    pan=Math.max(-128,Math.min(127,pan+t.extPan));
    return {userDecay:s16(volume),userDecay2:fader,userPitch:pitch,userPan:s8(pan),panRange:t.panRange,mod:modulation(track.mod,tv,music)};
  }
  // Original SND_SinIdx / ExChannelLfoUpdate: integer quadrant table,
  // get before periodic step, arithmetic signed shift (not truncation to zero).
  const LFO_SINE=Object.freeze([0,6,12,19,25,31,37,43,49,54,60,65,71,76,81,85,90,94,98,102,106,109,112,115,117,120,122,123,125,126,126,127,127]);
  function pitchLfo(lfo){const x=lfo.counter>>>8,s=x<32?LFO_SINE[x]:x<64?LFO_SINE[64-x]:x<96?-LFO_SINE[x-64]:-LFO_SINE[128-x];return ((s*lfo.param.depth*lfo.param.range)<<6)>>14;}
  function create(data,options) {
    options=options || {};
    const tv=options.tv===true,music=options.defaultMusic===true;if(music&&!tv)throw Error('Default music requires native TV owner');const rival=options.rivalStory===true;if(rival&&!music)throw Error('Rival story requires default music');const Tv=rival?BaseTv.withRivalStory():music?BaseTv.withDefaultMusic():BaseTv;if(tv&&!Tv)throw Error('TV source dependency missing');
    const tables=clone(data && data.tables);
    if (!tables) throw new Error('Verified source table bundle required');
    for (const [key,count,min,max] of [['attack',19,0,255],['decibel_square',128,-32768,0],['decibel_linear',128,-32768,0],['volume',724,0,127],['pitch',768,0,65535],['allocation_order',16,0,15]]) {
      if (!Array.isArray(tables[key]) || tables[key].length!==count) throw new Error('Missing/bad source table '+key);
      tables[key].forEach(v=>integer(v,min,max,key));
    }
    if (tables.attack.some((v,i)=>v!==ATTACK[i]) || tables.allocation_order.some((v,i)=>v!==ORDER[i])) throw new Error('Source attack/allocation table differs from pin');
    if (sha256Ascii(JSON.stringify(['attack','decibel_square','decibel_linear','volume','pitch','allocation_order'].map(k=>tables[k])))!==TABLE_HASH) throw new Error('Source lookup tables differ from pinned ARM9 approximation profile');
    const profile=clone(data.tableProfile || data.table_profile || data.profile || {name:'ARM9-carried-volume-and-commented-pitch',arm7_bios_tables_verified:false});
    let strongLockMask=integer(get(options,'strongLockMask',0),0,65535,'strongLockMask');
    let weakLockMask=integer(get(options,'weakLockMask',0),0,65535,'weakLockMask');
    let generation=0, eventOrdinal=0, wake=0;
    const events=[];
    const channels=Array.from({length:16},(_,id)=>({id,generation:0,active:false,start:false,foreign:false,priority:0,volume:0,timer:0,pan:0,pendingFlags:0,owner:null,ownerKey:null,origin:null,applied:{active:false,generation:0,volume:0,timer:0,pan:0,carrierEpoch:0}}));
    const emit=(type,fields)=>{const e=Object.assign({type,ordinal:++eventOrdinal,wake},clone(fields));events.push(e);return e;};
    const token=c=>({channelId:c.id,voiceGeneration:c.generation});
    const voiceFields=c=>Object.assign(token(c),{owner:clone(c.owner),origin:clone(c.origin)});
    function attached(owner) { const key=ownerKey(dataSnapshot(owner,'owner'),tv,Tv); return channels.filter(c=>c.active && !c.foreign && c.ownerKey===key).sort((a,b)=>b.generation-a.generation); }
    function complete(c,reason) {
      const fields=voiceFields(c);
      c.active=false;c.start=false;c.priority=0;c.volume=0;c.owner=null;c.ownerKey=null;
      emit('voice-complete',Object.assign(fields,{reason,status:1}));
    }
    // Explicit fixture/foreign occupancy input, not a claim that unrelated game sounds are modeled.
    for (const item of options.occupiedChannels || []) {
      const id=integer(get(item,'channel',item.channelId),0,15,'occupied channel');
      if (channels[id].foreign) throw new Error('Duplicate occupied channel');
      channels[id].foreign=true;channels[id].active=true;
      channels[id].priority=integer(item.priority,0,255,'occupied priority');
      channels[id].volume=integer(item.volume,0,0x37f,'occupied volume');rawLoudness(item.volume);
      channels[id].applied.active=true;channels[id].applied.volume=item.volume;
    }
    const api={
      noteOn(spec) {
        if (!spec) throw new Error('noteOn specification required');
        const owner=dataSnapshot(spec.owner,'owner'), key=ownerKey(owner,tv,Tv); rejectUnsupported(spec,tv && Tv.has(owner.effectId),music&&Tv.isDefaultMusic(owner.effectId));
        const instrument=validateInstrument(owner,spec.instrument,tv,Tv);
        const midiKey=integer(spec.key,0,127,'key'), velocity=integer(spec.velocity,0,127,'velocity'), length=integer(spec.length,1,0x7fffffff,'length');
        if (([1004,1033,1030,1154,1501,1504,1533,1563].includes(owner.effectId)||(rival&&[1139,1538].includes(owner.effectId))) && midiKey!==instrument.key) throw new Error('Source note key differs from validated instrument');
        const priority=integer(spec.priority,0,255,'priority');
        const channelMask=integer(get(spec,'channelMask',MASK),0,65535,'channelMask');
        if ((channelMask & ~(tv && Tv.has(owner.effectId)?Tv.metadata(owner.effectId).channel_mask:MASK))!==0) throw new Error('Channel mask exceeds selected player pool');
        const explicit=spec.explicitMask!==false;
        let eligible=channelMask & (instrument.type===1 ? 0xffff : instrument.type===2 ? 0x3f00 : 0xc000) & ~strongLockMask;
        if (!explicit) eligible &= ~weakLockMask;
        let c=null;
        for (const id of ORDER) {
          if (!(eligible&(1<<id))) continue;
          const candidate=channels[id];
          if (!c || candidate.priority<c.priority || (candidate.priority===c.priority && rawLoudness(candidate.volume)<rawLoudness(c.volume))) c=candidate;
        }
        if (!c || priority<c.priority) { emit('note-rejected',{owner,priority,eligibleMask:eligible & 65535,reason:c?'priority':'mask'});return null; }
        if (c.active || c.owner) emit('voice-stolen',Object.assign(voiceFields(c),{status:0,replacementOwner:owner}));
        // ExChannelSetup deliberately retains old timer and pan. Applied state is separate.
        Object.assign(c,{generation:++generation,active:true,start:true,foreign:false,priority,volume:127,pendingFlags:FLAGS.STOP,owner,ownerKey:key,origin:clone(owner),instrument,type:instrument.type-1,midiKey,rootMidiKey:instrument.root_key,velocity,length,initPan:s8(instrument.pan-64),userDecay:0,userDecay2:0,userPitch:0,userPan:0,panRange:127,envStatus:ENV.ATTACK,envAttenuation:-92544,envAttack:attackCoefficient(instrument.attack,tables.attack),envDecay:rateCoefficient(instrument.decay),envSustain:instrument.sustain,envRelease:rateCoefficient(instrument.release),sweepPitch:0,sweepCounter:0,sweepLength:length,autoSweep:false,lfo:{param:modulation(),counter:0,delayCounter:0},totalAttenuation:null,pitch:0,hardwareCompletionReason:null});
        emit('note-on',Object.assign(voiceFields(c),{key:midiKey,velocity,length,priority,rawLoudness:2032,instrumentId:instrument.bank_id+':'+instrument.program}));
        return token(c);
      },
      tickTrack(owner) {
        for (const c of attached(owner)) {
          if (c.length>0)c.length--;
          if (!c.autoSweep && c.sweepCounter<c.sweepLength)c.sweepCounter++;
        }
      },
      updateTrack(owner,track,player,opts) {
        opts=opts || {};const ctl=controls(track,player,tables,tv && Tv.has(owner.effectId),music&&Tv.isDefaultMusic(owner.effectId));
        for (const c of attached(owner)) {
          c.userDecay2=ctl.userDecay2;
          if (c.envStatus===ENV.RELEASE) continue;
          for (const name of ['userDecay','userPitch','userPan','panRange'])c[name]=ctl[name];
          c.lfo.param=clone(ctl.mod);
          if (c.length===0 && opts.allowLengthRelease!==false) {c.priority=1;c.envStatus=ENV.RELEASE;emit('voice-release',Object.assign(voiceFields(c),{reason:'length',envAttenuation:c.envAttenuation,releaseCoefficient:c.envRelease}));}
        }
      },
      releaseTrack(owner,track,player,opts) {
        opts=Object.assign({detach:true,release:-1},opts || {});
        if (opts.release!==-1 && opts.release!==127) throw new Error('Release override outside stop/pause source contract');
        api.updateTrack(owner,track,player,{allowLengthRelease:false});
        for (const c of attached(owner)) {
          if (opts.release>=0)c.envRelease=rateCoefficient(opts.release);
          c.priority=1;c.envStatus=ENV.RELEASE;
          emit('voice-release',Object.assign(voiceFields(c),{reason:opts.detach?'track-stop':'release',envAttenuation:c.envAttenuation,releaseCoefficient:c.envRelease}));
          if (opts.detach) {emit('voice-detached',voiceFields(c));c.owner=null;c.ownerKey=null;}
        }
      },
      releaseVoice(channelId,voiceGeneration) {
        const c=channels[integer(channelId,0,15,'channelId')];
        if (!c.active || c.foreign || c.generation!==voiceGeneration) return false;
        c.priority=1;c.envStatus=ENV.RELEASE;emit('voice-release',Object.assign(voiceFields(c),{reason:'explicit-note-off',envAttenuation:c.envAttenuation,releaseCoefficient:c.envRelease}));return true;
      },
      flush() {
        const out=[];
        const reg=(type,c,gen,fields)=>{
          const e=Object.assign({type,channel:c.id,channelId:c.id,generation:gen,voiceGeneration:gen,flags:c.pendingFlags},fields);
          out.push(clone(e));emit('register-applied',{register:e});
        };
        // Source first writes setup/updates across all channels, then enables starts.
        // The inert returned batch advances no carrier time between these events.
        for (const c of channels) {
          const flags=c.pendingFlags;
          if (!flags)continue;
          if (flags&FLAGS.STOP) {reg('stop',c,c.applied.generation,{});c.applied.active=false;}
          if (flags&FLAGS.START) {
            c.applied={active:true,generation:c.generation,volume:c.volume,timer:c.timer,pan:c.pan,carrierEpoch:c.applied.carrierEpoch+1};
            reg('start',c,c.generation,{volume:c.volume,timer:c.timer,pan:c.pan,instrument:clone(c.instrument),wave:clone(c.instrument.wave),key:c.midiKey,rootKey:c.rootMidiKey,velocity:c.velocity,owner:clone(c.origin)});
          } else if (flags&(FLAGS.TIMER|FLAGS.VOLUME|FLAGS.PAN)) {
            if (flags&FLAGS.TIMER)c.applied.timer=c.timer;
            if (flags&FLAGS.VOLUME)c.applied.volume=c.volume;
            if (flags&FLAGS.PAN)c.applied.pan=c.pan;
            reg('update',c,c.applied.generation,{volume:c.applied.volume,timer:c.applied.timer,pan:c.applied.pan});
          }
          c.pendingFlags=0;
        }
        wake++;return out;
      },
      step(periodic) {
        if (typeof periodic!=='boolean') throw new TypeError('Explicit periodic boolean required');
        const start=events.length;
        for (const c of channels) {
          if (!c.active || c.foreign)continue;
          if (c.start) {c.pendingFlags|=FLAGS.START;c.start=false;}
          else if (!c.applied.active || c.applied.generation!==c.generation) {complete(c,c.hardwareCompletionReason || 'hardware-inactive');continue;}
          let volume=tables.decibel_square[c.velocity]+envelopeStep(c,periodic,tables.decibel_square)+c.userDecay+c.userDecay2;
          const modulationPitch=pitchLfo(c.lfo); // Attached release retains params; detached tails continue their own phase.
          if (periodic)c.lfo.counter=(c.lfo.counter+(c.lfo.param.speed<<6))&0x7fff;
          const pitch=(c.midiKey-c.rootMidiKey)*64+c.userPitch+modulationPitch;
          let pan=c.initPan;
          if (c.panRange!==127)pan=(pan*c.panRange+64)>>7;
          pan=Math.max(0,Math.min(127,pan+c.userPan+64));
          c.totalAttenuation=volume;c.pitch=pitch;
          if (c.envStatus===ENV.RELEASE && volume<=-723) {
            c.pendingFlags=FLAGS.STOP;complete(c,'envelope');continue;
          }
          const nextVolume=volumeRegister(volume,tables.volume);
          let nextTimer=pitchTimer(c.type===0?c.instrument.wave.timer:8006,pitch,tables.pitch);
          if (c.type===1)nextTimer &= 0xfffc;
          if (nextVolume!==c.volume) {c.volume=nextVolume;c.pendingFlags|=FLAGS.VOLUME;}
          if (nextTimer!==c.timer) {c.timer=nextTimer;c.pendingFlags|=FLAGS.TIMER;}
          if (pan!==c.pan) {c.pan=pan;c.pendingFlags|=FLAGS.PAN;}
        }
        return clone(events.slice(start));
      },
      hardwareComplete(channelId,voiceGeneration,reason) {
        const c=channels[integer(channelId,0,15,'channelId')];
        if (!c.active || c.foreign || c.generation!==voiceGeneration || c.applied.generation!==voiceGeneration || !c.applied.active)return false;
        if (c.type!==0 || c.instrument.wave.loop) throw new Error('Natural completion is only valid for pinned one-shot PCM');
        c.applied.active=false;c.hardwareCompletionReason=reason || 'pcm-end';
        emit('hardware-complete',voiceFields(c));return true;
      },
      setLocks(strong,weak) {
        // Occupancy destruction by SND_LockChannel is outside this input setter.
        strongLockMask=integer(strong,0,65535,'strongLockMask');weakLockMask=integer(weak,0,65535,'weakLockMask');
      },
      snapshot() {return clone({profile,limits:{eightEffectsOnly:!tv,globalChannelCount:16,selectedMask:tv?0xdfff:MASK,arm7BiosTablesVerified:false,unrelatedSounds:options.occupiedChannels?'explicit occupancy only':'absent',carrierClock:'external; no sample or phase synthesis'},wake,strongLockMask,weakLockMask,channels});},
      drainEvents() {return events.splice(0,events.length).map(clone);}
    };
    return Object.freeze(api);
  }
  return Object.freeze({create,ENV,FLAGS,attackCoefficient,rateCoefficient,rawLoudness,envelopeStep,volumeRegister,pitchTimer});
}));
