(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-board-data.js'),require('./source-board-consumer.js'),require('./source-board-text.js'),require('./source-board-input.js'));else root.SourceBoardController=factory(root.SourceBoardData,root.SourceBoardConsumer,root.SourceBoardText,root.SourceBoardInput);})(typeof globalThis!=='undefined'?globalThis:this,function(Data,Consumer,Text,Input){
'use strict';
function fail(message){throw new Error('SourceBoardController: '+message);}
function context(pc){return {pc,mode:'bytecode',native:null};}
/** Bounded source scripts7/8/9 + common2000, never a general script interpreter.
 * stepScripts() == one sub_02038D48 context-loop invocation.
 * consumeField() == one ordinary ov05_021E8158 invocation.
 * Ordinary field ordering is supplied by board-field-sequence.js; no dt/render API.
 */
class Controller {
  constructor({fontData,compile,createPrinter,textDelay}) {
    if(!fontData||typeof compile!=='function')fail('explicit font metrics and strict compiler dependencies required');
    this.fontData=fontData;this.compile=compile;this.createPrinter=createPrinter;this.textDelay=textDelay;this.printer=null;
    this.state=Data.freeze({board:Consumer.initial(),printedText:null,session:null,scriptCalls:0,fieldConsumerCalls:0,events:[]});
  }
  begin(key,names={}) { return this._begin(key,names,false); }
  beginNormalA(key,names={}) { return this._begin(key,names,true); }
  _begin(key,names,normalA) {
    if(this.state.board.disposed)fail('disposed controller');
    if(this.state.session?.active)fail('script already active; repeated requests do not replace it');
    const record=Data.get(key);
    // Validate fully before assigning any state; no partial text or stale name fallback.
    const removed=normalA?Consumer.consume(Consumer.request(this.state.board,4)):null;
    const board=removed?removed.state:this.state.board;
    const geometry=board.allocation||record.window;
    const text=Text.layout(key,names,this.fontData,this.compile,geometry);
    this.printer=null;
    this.state=Data.freeze({...this.state,board,printedText:normalA?null:this.state.printedText,session:{key,text,active:true,local:context('create'),common:null,
      parentWaitFlag:0,result:null,facing:null,menuStatus:'none'},events:[...(normalA?[{type:'normal_a_cleanup_state4'},...removed.effects]:[]),{type:'script_begin',key}]});
    return this.snapshot();
  }
  consumeField() {
    const {state:board,effects}=Consumer.consume(this.state.board);
    this.state=Data.freeze({...this.state,board,printedText:board.drawing?this.state.printedText:null,fieldConsumerCalls:this.state.fieldConsumerCalls+1,events:effects});
    return this.snapshot();
  }
  stepScripts(input={}) {
    if(this.state.board.disposed)fail('disposed controller');
    // Validate even when input cannot yet be consumed; never queue it.
    const read=Input.readNewKeys(input);
    const previous=this.state;
    let board=previous.board,printedText=previous.printedText;
    if(!previous.session?.active){this.state=Data.freeze({...previous,events:[]});return this.snapshot();}
    const session={...previous.session,local:previous.session.local?{...previous.session.local}:null,
      common:previous.session.common?{...previous.session.common}:null};
    const events=[];
    const req=value=>{board=Consumer.request(board,value);events.push({type:'board_request',value});};
    const install=(ctx,native)=>{ctx.mode='native';ctx.native=native;events.push({type:'install_native',native});};
    const run=(slot)=>{
      const ctx=session[slot];if(!ctx)return;
      if(ctx.mode==='native') {
        let done=false;
        if(ctx.native==='notice_printer') {
          // 003A native: completion precedes directions and X; A/B only speed text.
          if(this.printer.printerFinished){session.result=2;done=true;}
          else {const directional=Input.readNewKeys({newKeys:(input.newKeys||[]).filter(k=>k!=='A'&&k!=='B')});if(directional){session.result=directional.result;session.facing=directional.facing;done=true;this.printer=null;if(directional.facing!==null)events.push({type:'set_player_facing',facing:directional.facing});}}
        }
        else if(ctx.native==='wait_board_idle')done=board.request===0;
        else if(ctx.native==='wait_parent_flag')done=session.parentWaitFlag===0;
        else if(ctx.native==='input') {
          if(read){session.result=read.result;session.facing=read.facing;done=true;
            events.push({type:'input_result',...read});if(read.facing!==null)events.push({type:'set_player_facing',facing:read.facing});}
        } else fail('unsupported native');
        if(done){events.push({type:'native_complete',native:ctx.native});ctx.mode='bytecode';ctx.native=null;}
        return; // Source RunScriptCommand NEVER executes bytecode on native completion.
      }
      for(let guard=0;guard<12;guard++) {
        switch(ctx.pc) {
          case 'create': {
            board=Consumer.configure(board,session.key);req(1);
            if(Data.get(session.key).timed){printedText={...session.text,glyphs:[],visibleGlyphs:[],text:''};ctx.pc='show';return;}
            const consumed=Consumer.consume(board);board=consumed.state;events.push(...consumed.effects);
            // Immediate full font1 text becomes available in the same create invocation.
            printedText=session.text;
            events.push({type:'print_immediate',key:session.key,glyphCount:session.text.glyphs.length,speed:0});
            ctx.pc='show';return;
          }
          case 'show':req(3);ctx.pc='wait_open';return;
          case 'wait_open':ctx.pc='install_input';if(board.request!==0){install(ctx,'wait_board_idle');return;}break;
          case 'install_input':
            ctx.pc='run_common';
            if(Data.get(session.key).timed){if(typeof this.createPrinter!=='function'||typeof this.textDelay!=='function')fail('notice printer dependencies required');this.printer=this.createPrinter(Data.get(session.key).tokens,{glyphs:this.fontData.glyphs,bindings:{},lineHeight:this.fontData.line_height,waitButton:false,frameDelay:this.textDelay()});install(ctx,'notice_printer');}
            else install(ctx,'input');return;
          case 'run_common':
            session.parentWaitFlag=1;session.common=context('common_select');ctx.pc='end';install(ctx,'wait_parent_flag');return;
          case 'common_select':
            if(session.result===2){ctx.pc='common_after_input';install(ctx,'input');return;}
            if(session.result!==0&&session.result!==1)fail('bounded input result0/1 required');
            if(session.result===0){req(2);ctx.pc='release';return;}
            req(4);session.menuStatus='awaiting_board_removal';ctx.pc='wait_remove';return;
          case 'common_after_input':ctx.pc='common_select';break;
          case 'wait_remove':ctx.pc='menu';if(board.request!==0){install(ctx,'wait_board_idle');return;}break;
          case 'menu':
            if(typeof input.menuEligible!=='boolean')fail('explicit source menu-eligibility result required at Menu opcode');
            session.menuStatus=input.menuEligible?'registered_for_cleanup':'not_registered';
            events.push({type:'menu_registration',registered:input.menuEligible});ctx.pc='release';break;
          case 'release':session.parentWaitFlag=0;events.push({type:'parent_script_released'});ctx.pc='end';break;
          case 'end':session[slot]=null;events.push({type:'script_context_end',slot});return;
          default:fail('unsupported script position');
        }
      }
      fail('bounded script loop exceeded');
    };
    run('local');run('common'); // Live slot1 created by slot0 participates immediately.
    if(!session.local&&!session.common) {
      this.printer=null;session.active=false;events.push({type:'script_task_cleanup'});
      if(session.menuStatus==='registered_for_cleanup') {
        session.menuStatus='startup_callback_due';events.push({type:'menu_startup_callback_due'});
      }
    }
    this.state=Data.freeze({board,printedText,session,scriptCalls:previous.scriptCalls+1,fieldConsumerCalls:previous.fieldConsumerCalls,events});
    return this.snapshot();
  }
  /** Explicit host interruption, not an extra source script opcode. Uses state4's
   * proven remove operation; cancels pending script/menu adapter state atomically.
   */
  tickPrinter(input){
    if(!this.printer||!this.state.session?.active||this.printer.printerFinished)return false;
    this.printer.tick(input);const glyphs=this.printer.snapshot().publishedText.visibleGlyphs;
    this.state=Data.freeze({...this.state,printedText:{...this.state.session.text,glyphs,visibleGlyphs:glyphs,text:glyphs.map(g=>g.char).join('')}});return !this.printer.printerFinished;
  }
  reset() {
    this.printer=null;
    if(this.state.board.disposed)fail('disposed controller');
    const removed=Consumer.consume(Consumer.request(this.state.board,4));
    this.state=Data.freeze({...this.state,board:removed.state,printedText:null,session:null,
      events:[...removed.effects,{type:'host_cancel_script_and_pending_menu'}]});
    return this.snapshot();
  }
  destroy() {
    this.printer=null;
    const result=Consumer.destroy(this.state.board);
    this.state=Data.freeze({...this.state,board:result.state,printedText:null,session:null,events:result.effects});return this.snapshot();
  }
  snapshot() {
    const state=this.state;
    const session=state.session;
    return Data.freeze({...state,scriptActive:!!session?.active,
      inputReady:[session?.local,session?.common].some(ctx=>ctx?.mode==='native'&&['input','notice_printer'].includes(ctx.native)),
      noticePrinter:this.printer?.snapshot()||null,
      parentReleaseSignalled:!!session&&session.result!==null&&session.parentWaitFlag===0&&session.local?.pc==='end',
      text:state.board.drawing?state.printedText:null,
      overlayPresent:!!state.board.drawing,
      menuPending:session?.menuStatus==='awaiting_board_removal'||session?.menuStatus==='registered_for_cleanup',
    });
  }
}
return {Controller};
});
