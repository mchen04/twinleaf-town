(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SourceBoardData=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
// Bounded original board identities. No helper names, demo-name defaults, art, or sound.
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
};
const common = {
  headerId: 411, eventBank: 389, scriptBank: 978, messageBank: 498,
  resultVariable: 0x800c, commonScriptId: 2000, heightFx32: 0,
  movement: 0, objectType: 0, hideFlag: 0,
  fontId: 1, printSpeed: 0, paletteSlot: 9, textBaseTile: 813,
  outerFrame: { x: 0, y: 144, width: 256, height: 48 },
};
const records = [
  { key: '411:4', eventId: 4, graphicsId: 91, objectOffset: 0x9c,
    localTile: { x:16,z:14 }, globalTile:{ x:112,z:878 },
    param0:1, scriptId:7, scriptEntry:0x628, messageIndex:12,
    raw:'Twinleaf Town\\nFresh and Free!', nameRole:null, frameType:0,
    tokens:[{type:'text',text:'Twinleaf Town'}, {type:'newline',codepoint:0xe000,source_token:'\\n'}, {type:'text',text:'Fresh and Free!'}],
    window:{ x:72,y:152,width:160,height:32 },
    createArgs:[12,0,0,0x800c], pictureMember:34,
  },
  { key: '411:5', eventId: 5, graphicsId: 92, objectOffset: 0xbc,
    localTile:{ x:18,z:21 }, globalTile:{ x:114,z:885 },
    param0:0, scriptId:8, scriptEntry:0x63f, messageIndex:13,
    raw:'{STRVAR_1 3, 0}’s House', nameRole:'playerName', frameType:2,
    tokens:[{type:'source_control_macro',raw:'{STRVAR_1 3, 0}'},{type:'text',text:'’s House'}],
    window:{ x:16,y:152,width:216,height:32 },
    createArgs:[13,2,0,0x800c], pictureMember:null,
  },
  { key: '411:6', eventId: 6, graphicsId: 92, objectOffset: 0xdc,
    localTile:{ x:13,z:11 }, globalTile:{ x:109,z:875 },
    param0:0, scriptId:9, scriptEntry:0x659, messageIndex:14,
    raw:'{STRVAR_1 3, 0}’s House', nameRole:'rivalName', frameType:2,
    tokens:[{type:'source_control_macro',raw:'{STRVAR_1 3, 0}'},{type:'text',text:'’s House'}],
    window:{ x:16,y:152,width:216,height:32 },
    createArgs:[14,2,0,0x800c], pictureMember:null,
  },
].map(record => freeze({...common,...record}));
const notice=freeze({...common,key:'415:bg2',headerId:415,eventBank:393,scriptBank:982,messageBank:502,eventId:2,eventType:1,direction:0,localTile:{x:7,z:3},scriptId:4,scriptEntry:114,messageIndex:4,frameType:3,param0:0,graphicsId:null,nameRole:null,timed:true,window:{x:16,y:152,width:216,height:32},raw:'The X Button\\nopens the menu!',tokens:[{type:'text',text:'The X Button'},{type:'newline',codepoint:0xe000,source_token:'\\n'},{type:'text',text:'opens the menu!'}]});
function get(key) {
  if(key===notice.key)return notice;
  const record = records.find(item => item.key === key);
  if (!record) throw new Error('SourceBoard: unsupported board ' + key);
  return record;
}
const provenance = freeze({
  commit:'b623abef1b4dfe204ca50aab42447ac00c134290',
  mapCell:{x:3,z:27}, localOrigin:{x:96,z:864}, localBounds:{width:32,height:32},
  sourceFiles:{
    events:{path:'files/fielddata/eventdata/zone_event_release/narc_0389.bin',sha256:'1c74649b245b8437645c65e2d8e33b1c2c57d5db7919ad4da0472064d943121f'},
    scripts:{path:'files/fielddata/script/scr_seq_release/narc_0978.bin',sha256:'43601fe68460a2b6f87614167ebf268d05aaa6b036a2b36ab2df826a8569824d'},
    messages:{path:'files/msgdata/msg/narc_0498.gmm',sha256:'180f6ba8f8896cd50b568a2257d6ed109966784f512fa86377479e2ea2d47e95'},
  },
  assets:{archive:'graphic/field_board.narc',narcId:36,baseMember:0,paletteMember:1,townPictureMember:34,status:'not supplied by this unbound module'},
});
return { notice, records:freeze(records), get, provenance, freeze };
});
