/* Shared byte-PC primitives derived from the retained silent command interpreter.
 * Exact TV admission is default; optional source music keeps sequence-specific key tables.
 * No scheduler, output clock or audio ownership is created here. */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f(require('./source-tv-data.js'),require('./source-default-music-data.js'),require('./source-rival-audio-data.js'));else r.SourceTvStream=f(r.SourceTvData,r.SourceDefaultMusicData,r.SourceRivalAudioData);})(typeof globalThis!=='undefined'?globalThis:this,function(Source,Music,Rival){
'use strict';
function build(music=false,rival=false){
 if(rival&&(!music||Rival?.schema!=='exact-rival-story-audio-v1'))throw Error('SourceTvStream: exact rival dependency');
 if(music&&(!Music||Music.schema!=='exact-default-music-input-v1'))throw Error('SourceTvStream: exact default-music dependency');
 const Data=music?{sequences:{...Source.sequences,...Music.sequences,...(rival?Rival.sequences:{})},waves:{...Source.waves,...Music.waves,...(rival?Rival.waves:{})}}:Source;
 const ids=Object.freeze(rival?[1030,1154,1004,1033,1139,1538]:music?[1030,1154,1004,1033]:[1030,1154]),clone=x=>JSON.parse(JSON.stringify(x));
function need(ok,m){if(!ok)throw Error('SourceTvStream: '+m);}
function has(id){return ids.includes(id);}
function bytes(hex){need(typeof hex==='string'&&hex.length%2===0&&/^[0-9a-f]+$/.test(hex),'source hex');return Uint8Array.from(hex.match(/../g),x=>parseInt(x,16));}
const sources=Object.fromEntries(ids.map(id=>[id,bytes(Data.sequences[id].hex)]));
function metadata(id){need(has(id),'sequence');const m=Data.sequences[id];return {...clone(m),tv:true,tracks:Object.fromEntries(Object.entries(m.track_starts).map(([k,start])=>[k,{start}]))};}
function instruction(id,offset){
 need(has(id),'sequence');const b=sources[id],start=offset;let p=offset;
 const read=n=>{need(Number.isInteger(p)&&p>=28&&p+n<=b.length,'source bounds');let v=0;for(let i=0;i<n;i++)v+=b[p++]*2**(8*i);return v;};
 const vlv=()=>{let v=0;for(let i=0;i<4;i++){const x=read(1);v=v*128+(x&127);if(!(x&128))return v;}throw Error('SourceTvStream: VLV');};
 const op=read(1),e={offset:start,relative_offset:start-28,opcode:op};
 if(op<128){e.command='note';e.key=op;e.velocity=read(1);e.length=vlv();need(e.velocity<=127&&e.length>0,'note');}
 else if(op===0x80||op===0x81){e.command=op===0x80?'rest':'program';e.value=vlv();}
 else if(op===0x93){e.command='open_track';e.value=read(1);e.destination=read(3);}
 else if(op===0x94||op===0x95){e.command=op===0x94?'jump':'call';e.destination=read(3);}
 else if([0xc0,0xc1,0xc4,0xc5,0xc7,0xca,0xcb,0xcd].includes(op)){
  e.command=({192:'pan',193:'volume',196:'pitch_bend',197:'bend_range',199:'note_wait',202:'mod_depth',203:'mod_speed',205:'mod_range'})[op];e.value=read(1);
  if(op===0xc0)e.value-=64;else if(op===0xc4&&e.value>=128)e.value-=256;
 }else if(op===0xe1){e.command='tempo';e.value=read(2);}
 else if(op===0xfd)e.command='return';else if(op===0xff)e.command='end';else throw Error('SourceTvStream: unsupported opcode '+op);
 e.next=p;e.bytes_hex=Array.from(b.subarray(start,p),x=>x.toString(16).padStart(2,'0')).join('');
 if(e.destination!==undefined)need(28+e.destination>=31&&28+e.destination<b.length,'branch bounds');
 return e;
}
const MUSIC_KEYS={"1004":{"1":[36,43,45,61,62,63,64,81],"11":[67,68,69,70,71,72,73,74,76,77,79,80,81,84],"12":[48,53,56,60,65,67,72,73,74,76,77,78,79,80,81,82,83,84,85,86,88,89,91,92,93,96,98],"14":[68,72,76,77,79,80,84,86,88,91],"2":[55,57,59,60,62,64,65,69,71],"32":[35,36,37,38,39,40,41,42,43,44,45,46,48,53,55],"4":[48,51,52,54,55,57,60,65,67,69,70,71,72,74,75,76,77,79,81,83,84,86,87],"46":[53,54,55,56,57,59,60,62,65,67,69,70,72,74,76,77,79,81,84,86,88],"48":[48,53,55,56,57,59,60,61,62,64,65,66,67,68,69,72,74,76,77],"5":[53,57,60,62,63,64,65,66,67,69,70,71,72,74,75,76,77,79,81,84,86,87],"71":[65,67,68,69,70,71,72,73,74,75,76,77]},"1033":{"1":[36,43,45,61,62,63,64,81],"11":[67,68,69,70,71,72,73,74,76,77,79,80,81,84],"12":[48,53,55,56,57,59,60,61,62,64,65,67,72,73,74,76,77,78,79,80,81,82,83,84,85,86,88,89,91,92,93,96,98],"14":[68,72,76,77,79,80,84,86,88,91],"2":[55,57,59,60,62,64,65,69,71],"32":[35,36,37,38,39,40,41,42,43,44,45,46,48,53,55],"4":[48,51,52,54,55,57,60,65,67,69,70,71,72,74,75,76,77,79,81,83,84,86,87],"46":[54,55,56,59,60,62,63,64,65,66,67,69,70,72,74,75,76,77,79,81,84,86,88,89,91,93],"48":[48,53,55,57,59,60,61,62,64,65,66,67,68,69],"5":[53,57,60,62,64,65,67,68,69,70,71,72,74,75,76,77,79,80,84,86,87],"71":[48,50,52,54,55,56,57,60,62,65,67,68,69,70,71,72,73,74,75,76,77]}};
function instrument(id,program,key){
 need(has(id)&&Number.isInteger(program)&&Number.isInteger(key),'instrument domain');const bank=Data.sequences[id].bank_id;
 if(music&&[1004,1033].includes(id))need(MUSIC_KEYS[id][program]?.includes(key),'unreached native music key');
 const table=rival&&[1139,1538].includes(id)?Rival.instruments:music&&[1004,1033].includes(id)?Music.instruments:Source.instruments;
 const rec=Object.values(table).find(x=>x.bank_id===bank&&x.program===program&&x.selected_keys.includes(key)&&x.sequence_ids.includes(id));need(rec,'unreached native instrument');
 const {selected_keys,sequence_ids,wave_key,...fields}=rec;
 if(rec.type!==1)return {...clone(fields),key};
 const {raw_base64,...wave}=Data.waves[wave_key];return {...clone(fields),key,wave:clone(wave)};
}
function equal(a,b){if(a===b)return true;if(!a||!b||typeof a!=='object'||typeof b!=='object')return false;const ka=Object.keys(a).sort(),kb=Object.keys(b).sort();return ka.length===kb.length&&ka.every((k,i)=>k===kb[i]&&equal(a[k],b[k]));}
function validateInstrument(id,value){need(value&&equal(value,instrument(id,value.program,value.key)),'instrument/header/region differs from source');return true;}
return Object.freeze({ids,has,metadata,instruction,instrument,validateInstrument,isDefaultMusic:id=>music&&[1004,1033].includes(id),withDefaultMusic:()=>build(true),withRivalStory:()=>build(true,true)});
}
return build();
});
