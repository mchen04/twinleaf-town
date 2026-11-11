(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-board-data.js'));else root.SourceBoardConsumer=factory(root.SourceBoardData);})(typeof globalThis!=='undefined'?globalThis:this,function(Data){
'use strict';
function fail(message) { throw new Error('SourceBoardConsumer: '+message); }
function initial() { return Data.freeze({request:0,yOffset:0,allocation:null,drawing:null,configuredKey:null,disposed:false,allocationSerial:0}); }
function configure(state,key) {
  if(state.disposed) fail('disposed consumer');
  Data.get(key);return Data.freeze({...state,configuredKey:key});
}
function request(state,value) {
  if(state.disposed) fail('disposed consumer');
  // The original masks to 7 bits and ignores states above4; this bounded API rejects
  // unsupported states, rather than presenting them as supported script behavior.
  if(!Number.isInteger(value)||value<0||value>4) fail('supported state0..4 required');
  return Data.freeze({...state,request:value});
}
/** One ov05_021E8158 call, not a render tick, a text tick, or elapsed milliseconds.
 * Effects describe external graphics operations; no such operations run here.
 */
function consume(state) {
  if(state.disposed) fail('disposed consumer');
  let next={...state};const effects=[];
  const offset=value=>{next.yOffset=value;effects.push({type:'set_bg3_y',value});};
  const clear=()=>{next.drawing=null;effects.push({type:'clear_bg3_tile_rect',x:0,y:18,width:32,height:6,palette:16},{type:'commit_bg3_tilemap'});};
  switch(state.request) {
    case 0:break;
    case 1:{
      if(!state.configuredKey) fail('state1 requires configured board');
      const board=Data.get(state.configuredKey);offset(-48);
      if(!state.allocation) {
        next.allocationSerial++;
        next.allocation={id:next.allocationSerial,frameType:board.frameType,...board.window};
        effects.push({type:'allocate_window',allocation:next.allocation});
      }
      next.drawing={key:board.key,frameType:board.frameType,map:board.param0};
      effects.push({type:'load_board_frame_palette',frameType:board.frameType,map:board.param0},
        {type:'fill_window',colorIndex:15},{type:'draw_frame_and_window3',frameType:board.frameType,allocation:next.allocation});
      next.request=0;break;
    }
    case 3:
      if(state.yOffset===0) next.request=0;
      else { let y=state.yOffset;if(y<=-48 || y>=0) {y=-48;offset(y);}offset(y+16); }
      break;
    case 2:
      if(state.yOffset===-48) {clear();offset(0);next.request=0;}
      else {let y=state.yOffset;if(y<=-48 || y>=0) {y=0;offset(y);}offset(y-16);}
      break;
    case 4:
      if(state.allocation) {
        effects.push({type:'remove_window',allocationId:state.allocation.id});
        next.allocation=null;clear();offset(0);
      }
      next.request=0;break;
    default:fail('unsupported internal request');
  }
  return Data.freeze({state:next,effects});
}
/** ov05_021E8110: free allocation then structure, without source clear/offset writes. */
function destroy(state) {
  if(state.disposed) return Data.freeze({state,effects:[]});
  const effects=state.allocation?[{type:'remove_window',allocationId:state.allocation.id}]:[];
  effects.push({type:'free_board_structure'});
  return Data.freeze({state:{...state,allocation:null,disposed:true},effects});
}
return {initial,configure,request,consume,destroy};
});
