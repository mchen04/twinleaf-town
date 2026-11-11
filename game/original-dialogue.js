(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.OriginalDialogue = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
'use strict';
const OWN = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const BREAKS = { newline: [0xe000, '\\n'], page_clear: [0x25bc, '\\r'], line_scroll: [0x25bd, '\\f'] };
const MAX_COMMANDS = 16384;
const textBuffers = new WeakMap();
function fail(message) { throw new Error('OriginalDialogue: ' + message); }
function integer(value, name, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) fail('invalid ' + name);
  return value;
}
/** Compile the bounded supported token subset before revealing any part of a message.
 * STRVAR names require explicit bindings. SIZE 100/200 use the source row-copy mask,
 * not horizontal scaling; larger out-of-window copies are deliberately unadmitted.
 * Glyph metrics are required: no font normalization, wrapping, fallback, or name inference.
 */
function compile(tokens, options = {}) {
  if (!Array.isArray(tokens) || tokens.length > MAX_COMMANDS) fail('invalid/bounded token array');
  const glyphs = options.glyphs;
  if (!glyphs || typeof glyphs !== 'object') fail('explicit glyph metrics required');
  const bindings = options.bindings || {};
  const commands = [];
  function push(command) {
    if (commands.length >= MAX_COMMANDS) fail('expanded message exceeds command limit');
    commands.push(Object.freeze(command));
  }
  function text(value, tokenIndex, slot) {
    if (typeof value !== 'string' || !value.length || value.length > MAX_COMMANDS) fail('invalid text/binding at token ' + tokenIndex);
    for (const char of value) {
      // Source controls belong to dedicated tokens, never strings or caller names.
      if (/[\u0000-\u001f\u007f{}\\\ue000\u25bc\u25bd\ufffe\uffff]/u.test(char)) fail('control/markup embedded in text at token ' + tokenIndex);
      if (!OWN(glyphs, char)) fail('unavailable source glyph ' + JSON.stringify(char));
      const g = glyphs[char];
      integer(g.advance, 'glyph advance', 0, 64);
      integer(g.width, 'glyph width', 0, 64);
      integer(g.height, 'glyph height', 1, 64);
      push({ type: 'glyph', char, advance: g.advance, width: g.width, height: g.height, tokenIndex, ...(slot === undefined ? {} : {slot}) });
    }
  }
  tokens.forEach((t, i) => {
    if (!t || typeof t !== 'object') fail('invalid token ' + i);
    if (t.type === 'text') text(t.text, i);
    else if (OWN(BREAKS, t.type)) {
      const [codepoint, sourceToken] = BREAKS[t.type];
      if (t.codepoint !== codepoint || t.source_token !== sourceToken) fail('mismatched authored control at token ' + i);
      push({ type: t.type, codepoint, tokenIndex: i });
    } else if (t.type === 'source_control_macro') {
      const size = /^\{SIZE (100|200)\}$/.exec(t.raw);
      if (size) { push({ type: 'size', rowCopyMask: size[1] === '200' ? 0xfffc : 0, tokenIndex: i }); return; }
      const match = /^\{STRVAR_1 3, (0|[1-9]\d*)\}$/.exec(t.raw);
      if (!match) fail('unsupported source macro ' + JSON.stringify(t.raw));
      const slot = integer(Number(match[1]), 'buffer slot', 0, 255);
      if (!OWN(bindings, slot)) fail('missing explicit binding for slot ' + slot);
      text(bindings[slot], i, slot);
    } else fail('unsupported token type ' + JSON.stringify(t.type));
  });
  return Object.freeze(commands);
}
class Controller {
  constructor(tokens, options = {}) {
    this.commands = compile(tokens, options);
    this.startX = integer(options.x ?? 0, 'x', 0, 255);
    this.startY = integer(options.y ?? 0, 'y', 0, 255);
    this.lineHeight = integer(options.lineHeight ?? 16, 'lineHeight', 1, 255);
    this.width = integer(options.width ?? 216, 'width', 1, 4096);
    this.height = integer(options.height ?? 32, 'height', 1, 4096);
    // Options_Init uses 1 => 4-frame period; AddTextPrinter subtracts one.
    this.frameDelay = integer(2, 'frameDelay', 1, 128);
    // The source stores currentX/currentY in u8 fields. This bounded controller
    // rejects layouts requiring arithmetic wrap instead of inventing its behavior.
    // Validate the entire layout now, before any partial message can appear.
    let checkX = this.startX, checkY = this.startY, checkMask = 0, pagePainted = false, sizePage = false;
    for (const command of this.commands) {
      if (command.type === 'size') {
        if (command.rowCopyMask) {
          if (pagePainted || sizePage || checkY !== this.startY) fail('SIZE200 requires a blank same-row page');
          sizePage = true;
        }
        checkMask = command.rowCopyMask;
      }
      if (sizePage && (command.type === 'newline' || command.type === 'line_scroll')) fail('SIZE page cannot change row origin');
      if (command.type === 'glyph') {
        if (sizePage && !checkMask) fail('normal glyph after SIZE100 requires page clear');
        pagePainted = true;
        if (checkMask) {
          const sourceRows = Math.min(command.height, this.height - checkY);
          if (sourceRows < 0 || command.height > 16) fail('SIZE copy outside bounded source glyph');
          let copiedRows = sourceRows;
          for (let row = 0; row < sourceRows; row++) copiedRows += (checkMask >>> row) & 1;
          if (checkY + copiedRows > this.height) fail('SIZE expanded copy exceeds admitted window');
        }
        checkX += command.advance;
      }
      else if (command.type === 'newline') { checkX = this.startX; checkY += this.lineHeight; }
      else if (command.type === 'page_clear') { checkX = this.startX; checkY = this.startY; pagePainted = false; sizePage = checkMask !== 0; }
      else if (command.type === 'line_scroll') checkX = this.startX;
      if (checkX > 255 || checkY > 255) fail('layout exceeds bounded source u8 cursor range');
    }
    this.canABSpeedUp = options.canABSpeedUp !== false;
    this.waitButton = options.waitButton === true;
    this.state = 'printing';
    this.index = 0;
    this.delay = 0;
    this.spedUp = false;
    this.cursorX = this.startX;
    this.cursorY = this.startY;
    this.rowCopyMask = 0;
    this.scrollOffset = 0;
    this.scrollRemaining = 0;
    this.glyphs = [];
    textBuffers.set(this, []);
    this.publishedText = { revision: 0, clip: { x: 0, y: 0, width: this.width, height: this.height }, visibleGlyphs: [] };
    this.printerFinished = false;
    this.finished = false;
    this.frame = 0;
    this.accumulator = 0;
    this.pendingPress = false;
    this.arrowIndex = 0;
    this.arrowDelay = 0;
    this.arrowFrame = null;
    this.lastEvents = [];
  }
  requestAdvance() { if (!this.finished) this.pendingPress = true; }
  beginWait(state) {
    this.state = state;
    this.arrowIndex = 0;
    this.arrowDelay = 0;
    this.arrowFrame = null; // Arrow is first drawn on the following wait-state tick.
  }
  animateArrow() {
    if (this.arrowDelay) { this.arrowDelay--; return; }
    this.arrowFrame = [0, 1, 2, 1][this.arrowIndex];
    this.arrowIndex = (this.arrowIndex + 1) & 3;
    this.arrowDelay = 8;
  }
  /** One nominal source frame. A held key alone does not start speedup or advance a wait. */
  tick(input = {}) {
    if (typeof input === 'boolean') input = { heldA: input };
    const pressed = this.pendingPress || !!(input.pressedA || input.pressedB);
    const held = !!(input.heldA || input.heldB);
    this.pendingPress = false;
    this.lastEvents = [];
    if (this.finished) return this.snapshot();
    this.frame++;
    if (this.state === 'wait_page' || this.state === 'wait_scroll') {
      this.animateArrow();
      if (pressed) {
        this.lastEvents.push({ type: 'continue', control: this.state === 'wait_page' ? 'page_clear' : 'line_scroll' });
        this.arrowFrame = null;
        if (this.state === 'wait_page') {
          this.glyphs = [];
          textBuffers.set(this, []);
          this.cursorX = this.startX;
          this.cursorY = this.startY;
          this.scrollOffset = 0;
          this.state = 'printing';
        } else {
          this.cursorX = this.startX;
          this.scrollRemaining = this.lineHeight;
          this.state = 'scrolling';
        }
      }
      return this.snapshot(); // Source never prints in the wait/clear/scroll-setup tick.
    }
    if (this.state === 'scrolling') {
      if (this.scrollRemaining) {
        const amount = Math.min(4, this.scrollRemaining);
        this.scrollRemaining -= amount;
        this.scrollOffset += amount;
        this.glyphs = this.glyphs.filter(g => g.y - (this.scrollOffset - g.scrollAtDraw) + g.height > 0);
        this.lastEvents.push({ type: 'scroll', pixels: amount });
        textBuffers.set(this, textBuffers.get(this).flatMap(g => {
          const y = g.y - amount, removed = Math.max(0, -y);
          if (removed >= g.copyHeight) return [];
          return [{ ...g, y: Math.max(0, y), sourceY: g.sourceY + removed, copyHeight: g.copyHeight - removed }];
        }));
        this.publishText();
      } else this.state = 'printing'; // Separate transition tick, as in RenderText state 4.
      return this.snapshot();
    }
    if (this.state === 'wait_button') {
      // Script WaitButton also accepts direction/X. The host handles their external side effects.
      if (pressed || input.scriptContinue) {
        this.finished = true;
        this.state = 'finished';
        this.lastEvents.push({ type: 'script_continue' });
      }
      return this.snapshot();
    }
    // RenderFont immediately reenters on LF. It rechecks delay and held/new keys.
    for (let guard = 0; guard <= this.commands.length; guard++) {
      if (held && this.spedUp) this.delay = 0;
      if (this.delay) {
        this.delay--;
        if (this.canABSpeedUp && pressed) { this.spedUp = true; this.delay = 0; }
        return this.snapshot();
      }
      this.delay = this.frameDelay - 1;
      if (this.index === this.commands.length) {
        this.printerFinished = true;
        this.state = this.waitButton ? 'wait_button' : 'finished';
        this.finished = !this.waitButton;
        this.lastEvents.push({ type: 'end_of_message' });
        return this.snapshot();
      }
      const command = this.commands[this.index++];
      if (command.type === 'size') { this.rowCopyMask = command.rowCopyMask; continue; }
      if (command.type === 'glyph') {
        const copyWidth = Math.min(command.width, this.width - this.cursorX);
        const copyHeight = Math.min(command.height, this.height - this.cursorY);
        if (this.rowCopyMask) {
          let outputRow = 0;
          for (let row = 0; row < copyHeight; row++) {
            const repeats = 1 + ((this.rowCopyMask >>> row) & 1);
            for (let repeat = 0; repeat < repeats; repeat++, outputRow++) {
              if (copyWidth > 0) textBuffers.get(this).push({
                ...command, x: this.cursorX, y: this.cursorY + outputRow,
                sourceX: 0, sourceY: row, copyWidth, copyHeight: 1
              });
            }
          }
          this.glyphs.push({ ...command, height: outputRow, rowCopyMask: this.rowCopyMask, x: this.cursorX, y: this.cursorY, scrollAtDraw: this.scrollOffset });
        } else {
          this.glyphs.push({ ...command, x: this.cursorX, y: this.cursorY, scrollAtDraw: this.scrollOffset });
          if (copyWidth > 0 && copyHeight > 0) textBuffers.get(this).push({
            ...command, x: this.cursorX, y: this.cursorY,
            sourceX: 0, sourceY: 0, copyWidth, copyHeight
          });
        }
        this.cursorX += command.advance;
        this.publishText();
        return this.snapshot();
      }
      if (command.type === 'newline') {
        this.cursorX = this.startX;
        this.cursorY += this.lineHeight;
        continue;
      }
      this.beginWait(command.type === 'page_clear' ? 'wait_page' : 'wait_scroll');
      return this.snapshot();
    }
    fail('internal control loop bound reached');
  }
  /** Fixed 60 Hz adapter. No lost time, maximum 600 source frames per call.
   * A fresh press is queued until the first processed frame, never replayed every frame.
   * For exact input-frame timing prefer tick().
   */
  advance(seconds, input = {}) {
    if (!Number.isFinite(seconds) || seconds < 0 || seconds > 10) fail('advance requires 0..10 seconds');
    if (typeof input === 'boolean') input = { heldA: input };
    if (input.pressedA || input.pressedB) this.requestAdvance();
    this.accumulator += seconds * 60;
    let first = true;
    const events = [];
    while (this.accumulator + 1e-10 >= 1 && !this.finished) {
      this.accumulator = Math.max(0, this.accumulator - 1);
      this.tick({ ...input, pressedA: false, pressedB: false, scriptContinue: first && input.scriptContinue });
      events.push(...this.lastEvents);
      first = false;
    }
    if (this.finished) this.accumulator = 0;
    this.lastEvents = events;
    return this.snapshot();
  }
  logicalGlyphs() {
    return this.glyphs.map(g => ({ ...g, y: g.y - (this.scrollOffset - g.scrollAtDraw) }))
      .filter(g => g.y < this.height && g.y + g.height > 0 && g.x < this.width && g.x + g.width > 0);
  }
  publishText() {
    this.publishedText = {
      revision: this.publishedText.revision + 1,
      clip: { x: 0, y: 0, width: this.width, height: this.height },
      visibleGlyphs: textBuffers.get(this).map(g => ({ ...g }))
    };
  }
  snapshot() {
    const visibleGlyphs = this.logicalGlyphs();
    const runs = [];
    for (const g of visibleGlyphs) {
      const run = runs[runs.length - 1];
      if (run && run.y === g.y && run.x + run.advance === g.x) { run.text += g.char; run.advance += g.advance; }
      else runs.push({ text: g.char, x: g.x, y: g.y, advance: g.advance });
    }
    return {
      state: this.state, waiting: this.state === 'wait_page' ? 'page_clear' : this.state === 'wait_scroll' ? 'line_scroll' : this.state === 'wait_button' ? 'script_wait_button' : null,
      printerFinished: this.printerFinished, finished: this.finished,
      frame: this.frame, commandIndex: this.index, delayCounter: this.delay, spedUp: this.spedUp,
      cursor: { x: this.cursorX, y: this.cursorY }, scrollOffset: this.scrollOffset, scrollRemaining: this.scrollRemaining,
      clip: { x: 0, y: 0, width: this.width, height: this.height },
      publishedText: {
        revision: this.publishedText.revision,
        clip: { ...this.publishedText.clip },
        visibleGlyphs: this.publishedText.visibleGlyphs.map(g => ({ ...g }))
      },
      visibleGlyphs, runs, arrowFrame: this.arrowFrame, events: this.lastEvents.map(e => ({ ...e }))
    };
  }
}
return { compile, Controller, create: (tokens, options) => new Controller(tokens, options) };
});
