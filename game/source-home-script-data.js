(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SourceHomeScriptData=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
// Finite source-data extraction. Not executable original game code.
const data={
  "revision": "b623abef1b4dfe204ca50aab42447ac00c134290",
  "header": 414,
  "scriptBank": 981,
  "levelBank": 911,
  "eventBank": 392,
  "messageBank": 501,
  "variable": 16548,
  "flag": 135,
  "scriptEntries": {
    "2": 100,
    "5": 2084
  },
  "sourceHashes": {
    "files/fielddata/script/scr_seq_release/narc_0981.bin": "4f712b8348cc54755d0701c56fcafa7e37303793d985e59d00d7147d3930068a",
    "files/fielddata/script/scr_seq_release/narc_0911.bin": "b0fa65249564fd3601379fefcdad90b682a316d27b6c5418e0e96b41328635ba",
    "files/fielddata/eventdata/zone_event_release/narc_0392.bin": "bdc205697d2d72e56ca7a830b00ddf0f818630585223d5a30938a74640706627",
    "files/msgdata/msg/narc_0501.gmm": "d322e03a0f8c0efb67741817d45c1a7d5cac0575f57e4a62ba1ec69bf148c9b5"
  },
  "level": {
    "type": 1,
    "variable": 16548,
    "value": 0,
    "script": 2
  },
  "coordinate": {
    "x": 6,
    "z": 10,
    "width": 1,
    "height": 1,
    "storedY": 0,
    "variable": 16548,
    "value": 1,
    "script": 5,
    "ignoresY": true
  },
  "nodes": [
    {
      "offset": 100,
      "opcode": 96,
      "name": "ScrCmd_LockAllEvents",
      "args": [],
      "size": 2,
      "raw_hex": "6000"
    },
    {
      "offset": 102,
      "opcode": 94,
      "name": "ScrCmd_Unk005E",
      "args": [
        255,
        54
      ],
      "size": 8,
      "raw_hex": "5e00ff0036000000",
      "target": 164
    },
    {
      "offset": 110,
      "opcode": 94,
      "name": "ScrCmd_Unk005E",
      "args": [
        0,
        58
      ],
      "size": 8,
      "raw_hex": "5e0000003a000000",
      "target": 176
    },
    {
      "offset": 118,
      "opcode": 95,
      "name": "ScrCmd_WaitForMovement",
      "args": [],
      "size": 2,
      "raw_hex": "5f00"
    },
    {
      "offset": 120,
      "opcode": 30,
      "name": "ScrCmd_SetFlag",
      "args": [
        135
      ],
      "size": 4,
      "raw_hex": "1e008700"
    },
    {
      "offset": 124,
      "opcode": 205,
      "name": "ScrCmd_GetPlayerName",
      "args": [
        0
      ],
      "size": 3,
      "raw_hex": "cd0000"
    },
    {
      "offset": 127,
      "opcode": 206,
      "name": "ScrCmd_GetRivalName",
      "args": [
        1
      ],
      "size": 3,
      "raw_hex": "ce0001"
    },
    {
      "offset": 130,
      "opcode": 44,
      "name": "ScrCmd_Unk002C",
      "args": [
        0
      ],
      "size": 3,
      "raw_hex": "2c0000"
    },
    {
      "offset": 133,
      "opcode": 52,
      "name": "ScrCmd_CloseMessageBox",
      "args": [],
      "size": 2,
      "raw_hex": "3400"
    },
    {
      "offset": 135,
      "opcode": 3,
      "name": "ScrCmd_Wait",
      "args": [
        15,
        32780
      ],
      "size": 6,
      "raw_hex": "03000f000c80"
    },
    {
      "offset": 141,
      "opcode": 94,
      "name": "ScrCmd_Unk005E",
      "args": [
        0,
        55
      ],
      "size": 8,
      "raw_hex": "5e00000037000000",
      "target": 204
    },
    {
      "offset": 149,
      "opcode": 95,
      "name": "ScrCmd_WaitForMovement",
      "args": [],
      "size": 2,
      "raw_hex": "5f00"
    },
    {
      "offset": 151,
      "opcode": 40,
      "name": "ScrCmd_SetVar",
      "args": [
        16548,
        1
      ],
      "size": 6,
      "raw_hex": "2800a4400100"
    },
    {
      "offset": 157,
      "opcode": 97,
      "name": "ScrCmd_ReleaseAllEvents",
      "args": [],
      "size": 2,
      "raw_hex": "6100"
    },
    {
      "offset": 159,
      "opcode": 2,
      "name": "ScrCmd_End",
      "args": [],
      "size": 2,
      "raw_hex": "0200"
    },
    {
      "offset": 2084,
      "opcode": 96,
      "name": "ScrCmd_LockAllEvents",
      "args": [],
      "size": 2,
      "raw_hex": "6000"
    },
    {
      "offset": 2086,
      "opcode": 22,
      "name": "ScrCmd_GoTo",
      "args": [
        2
      ],
      "size": 6,
      "raw_hex": "160002000000",
      "target": 2094
    },
    {
      "offset": 2094,
      "opcode": 94,
      "name": "ScrCmd_Unk005E",
      "args": [
        255,
        38
      ],
      "size": 8,
      "raw_hex": "5e00ff0026000000",
      "target": 2140
    },
    {
      "offset": 2102,
      "opcode": 94,
      "name": "ScrCmd_Unk005E",
      "args": [
        0,
        54
      ],
      "size": 8,
      "raw_hex": "5e00000036000000",
      "target": 2164
    },
    {
      "offset": 2110,
      "opcode": 95,
      "name": "ScrCmd_WaitForMovement",
      "args": [],
      "size": 2,
      "raw_hex": "5f00"
    },
    {
      "offset": 2112,
      "opcode": 22,
      "name": "ScrCmd_GoTo",
      "args": [
        2
      ],
      "size": 6,
      "raw_hex": "160002000000",
      "target": 2120
    },
    {
      "offset": 2120,
      "opcode": 40,
      "name": "ScrCmd_SetVar",
      "args": [
        16548,
        2
      ],
      "size": 6,
      "raw_hex": "2800a4400200"
    },
    {
      "offset": 2126,
      "opcode": 205,
      "name": "ScrCmd_GetPlayerName",
      "args": [
        0
      ],
      "size": 3,
      "raw_hex": "cd0000"
    },
    {
      "offset": 2129,
      "opcode": 44,
      "name": "ScrCmd_Unk002C",
      "args": [
        4
      ],
      "size": 3,
      "raw_hex": "2c0004"
    },
    {
      "offset": 2132,
      "opcode": 49,
      "name": "ScrCmd_WaitButton",
      "args": [],
      "size": 2,
      "raw_hex": "3100"
    },
    {
      "offset": 2134,
      "opcode": 52,
      "name": "ScrCmd_CloseMessageBox",
      "args": [],
      "size": 2,
      "raw_hex": "3400"
    },
    {
      "offset": 2136,
      "opcode": 97,
      "name": "ScrCmd_ReleaseAllEvents",
      "args": [],
      "size": 2,
      "raw_hex": "6100"
    },
    {
      "offset": 2138,
      "opcode": 2,
      "name": "ScrCmd_End",
      "args": [],
      "size": 2,
      "raw_hex": "0200"
    }
  ],
  "streams": {
    "164": {
      "offset": 164,
      "pairs": [
        [
          62,
          1
        ],
        [
          33,
          1
        ],
        [
          254,
          0
        ]
      ],
      "rawHex": "3e00010021000100fe000000"
    },
    "176": {
      "offset": 176,
      "pairs": [
        [
          32,
          1
        ],
        [
          75,
          1
        ],
        [
          63,
          1
        ],
        [
          12,
          1
        ],
        [
          15,
          3
        ],
        [
          12,
          3
        ],
        [
          254,
          0
        ]
      ],
      "rawHex": "200001004b0001003f0001000c0001000f0003000c000300fe000000"
    },
    "204": {
      "offset": 204,
      "pairs": [
        [
          13,
          2
        ],
        [
          14,
          3
        ],
        [
          13,
          2
        ],
        [
          32,
          1
        ],
        [
          254,
          0
        ]
      ],
      "rawHex": "0d0002000e0003000d00020020000100fe000000"
    },
    "2140": {
      "offset": 2140,
      "pairs": [
        [
          63,
          2
        ],
        [
          32,
          1
        ],
        [
          254,
          0
        ]
      ],
      "rawHex": "3f00020020000100fe000000"
    },
    "2164": {
      "offset": 2164,
      "pairs": [
        [
          33,
          1
        ],
        [
          254,
          0
        ]
      ],
      "rawHex": "21000100fe000000"
    }
  },
  "messages": {
    "0": {
      "bank": 501,
      "index": 0,
      "text": "Mom: {STRVAR_1 3, 0}!\\r{STRVAR_1 3, 1} came calling for you\\na little while ago.\\rI don’t know what it was about, but\\nhe said it was an emergency.\\r",
      "tokens": [
        {
          "type": "text",
          "text": "Mom: "
        },
        {
          "type": "source_control_macro",
          "raw": "{STRVAR_1 3, 0}"
        },
        {
          "type": "text",
          "text": "!"
        },
        {
          "type": "page_clear",
          "codepoint": 9660,
          "source_token": "\\r"
        },
        {
          "type": "source_control_macro",
          "raw": "{STRVAR_1 3, 1}"
        },
        {
          "type": "text",
          "text": " came calling for you"
        },
        {
          "type": "newline",
          "codepoint": 57344,
          "source_token": "\\n"
        },
        {
          "type": "text",
          "text": "a little while ago."
        },
        {
          "type": "page_clear",
          "codepoint": 9660,
          "source_token": "\\r"
        },
        {
          "type": "text",
          "text": "I don’t know what it was about, but"
        },
        {
          "type": "newline",
          "codepoint": 57344,
          "source_token": "\\n"
        },
        {
          "type": "text",
          "text": "he said it was an emergency."
        },
        {
          "type": "page_clear",
          "codepoint": 9660,
          "source_token": "\\r"
        }
      ],
      "roles": {
        "0": "player",
        "1": "rival"
      },
      "explicitWaitButton": false
    },
    "4": {
      "bank": 501,
      "index": 4,
      "text": "Mom: Oh, yes!\\n{STRVAR_1 3, 0}!\\rDon’t go into the tall grass.\\nWild Pokémon might attack you.\\rIt would be OK if you had your own\\nPokémon, but you don’t, so...",
      "tokens": [
        {
          "type": "text",
          "text": "Mom: Oh, yes!"
        },
        {
          "type": "newline",
          "codepoint": 57344,
          "source_token": "\\n"
        },
        {
          "type": "source_control_macro",
          "raw": "{STRVAR_1 3, 0}"
        },
        {
          "type": "text",
          "text": "!"
        },
        {
          "type": "page_clear",
          "codepoint": 9660,
          "source_token": "\\r"
        },
        {
          "type": "text",
          "text": "Don’t go into the tall grass."
        },
        {
          "type": "newline",
          "codepoint": 57344,
          "source_token": "\\n"
        },
        {
          "type": "text",
          "text": "Wild Pokémon might attack you."
        },
        {
          "type": "page_clear",
          "codepoint": 9660,
          "source_token": "\\r"
        },
        {
          "type": "text",
          "text": "It would be OK if you had your own"
        },
        {
          "type": "newline",
          "codepoint": 57344,
          "source_token": "\\n"
        },
        {
          "type": "text",
          "text": "Pokémon, but you don’t, so..."
        }
      ],
      "roles": {
        "0": "player"
      },
      "explicitWaitButton": true
    }
  }
};
function freeze(o){if(o&&typeof o==='object'){Object.values(o).forEach(freeze);Object.freeze(o);}return o;}
return freeze(data);
});
