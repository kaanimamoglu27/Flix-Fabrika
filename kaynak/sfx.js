// Soft synthesized sounds + generative ambient music (WebAudio, no files).
let ctx = null, master = null, musicBus = null, musicOn = false, musicTimer = null;
const PENT = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
const hz = (n) => 440 * Math.pow(2, (n - 9) / 12); // n semitones from C4-ish
function ensure() {
  if (ctx) return ctx; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
  ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.8;
  const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
  // simple reverb
  const len = ctx.sampleRate * 2.2, ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
  const rev = ctx.createConvolver(); rev.buffer = ir; const wet = ctx.createGain(); wet.gain.value = 0.35; rev.connect(wet); wet.connect(master);
  SFX._rev = rev; musicBus = ctx.createGain(); musicBus.gain.value = 0.0; musicBus.connect(master); musicBus.connect(rev);
  return ctx;
}
// 2.6: voices are released when they end (nodes disconnected), each sound has a voice cap, and the same sound asked for twice
// in one frame plays once. Before this a long session left tens of thousands of nodes connected to the graph.
const MAXV = 3, SAME = 0.03; const voices = {}; let curV = null, live = 0, noiseBuf = null;
function begin(name) { // false: drop this trigger
  const t = ctx.currentTime, v = voices[name] || (voices[name] = { last: -1, ends: [] });
  if (t - v.last < SAME) return false;
  if (v.ends.length) v.ends = v.ends.filter(e => e > t); if (v.ends.length >= MAXV) return false;
  v.last = t; v.ends.push(t); curV = v; return true;
}
function track(src, end, nodes) {
  if (curV) { const e = curV.ends; if (end > e[e.length - 1]) e[e.length - 1] = end; }
  live++; src.onended = () => { src.onended = null; live--; for (const n of nodes) { try { n.disconnect(); } catch (e) {} } };
}
function tone(f, t0, dur, { type = 'sine', vol = 0.2, attack = 0.005, rev = 0.5, dest } = {}) {
  const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f; const nodes = [o, g];
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + attack); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(dest || master); if (rev && !dest) { const s = ctx.createGain(); s.gain.value = rev; g.connect(s); s.connect(SFX._rev); nodes.push(s); }
  o.start(t0); o.stop(t0 + dur + 0.05); track(o, t0 + dur + 0.05, nodes);
}
function noise(t0, dur, { vol = 0.15, f = 800, q = 1, type = 'bandpass', sweep } = {}) {
  if (!noiseBuf) { noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; } // one shared buffer
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t0); if (sweep) fl.frequency.exponentialRampToValueAtTime(sweep, t0 + dur); fl.Q.value = q;
  const g = ctx.createGain(); g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + dur * 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  s.connect(fl); fl.connect(g); g.connect(master); s.start(t0, Math.random() * Math.max(0, 2 - dur), dur); track(s, t0 + dur, [s, fl, g]);
}
let stepI = 0;
export const SFX = {
  enabled: true,
  unlock() { if (!this.enabled) return; ensure(); if (ctx && ctx.state === 'suspended') ctx.resume(); if (!musicOn) this.setMusic(true); },
  suspend(h) { if (!ctx) return; if (h) ctx.suspend(); else if (this.enabled) ctx.resume(); },
  ok(name) { return !!(this.enabled && ensure() && ctx.state === 'running' && (!name || begin(name))); },
  stats() { return { live, voices: Object.fromEntries(Object.entries(voices).map(([k, v]) => [k, v.ends.length])) }; },
  step() { if (!this.ok('step')) return; const t = ctx.currentTime; const n = PENT[(stepI++ * 3) % 6] + 12; tone(hz(n), t, 0.35, { type: 'triangle', vol: 0.06, rev: 0.3 }); noise(t, 0.05, { vol: 0.05, f: 2400, q: 2 }); },
  click() { if (!this.ok('click')) return; const t = ctx.currentTime; tone(1200, t, 0.06, { type: 'square', vol: 0.03, rev: 0 }); tone(hz(19), t, 0.25, { vol: 0.05 }); },
  nope() { if (!this.ok('nope')) return; const t = ctx.currentTime; tone(220, t, 0.18, { type: 'triangle', vol: 0.08, rev: 0.1 }); tone(196, t + 0.09, 0.2, { type: 'triangle', vol: 0.07, rev: 0.1 }); },
  rotate() { if (!this.ok('rotate')) return; const t = ctx.currentTime; for (let i = 0; i < 9; i++) noise(t + i * 0.08, 0.04, { vol: 0.07, f: 3000 - i * 120, q: 6 }); noise(t, 0.9, { vol: 0.08, f: 300, sweep: 900, q: 0.7 }); tone(hz(-12), t, 1.0, { type: 'sine', vol: 0.12, attack: 0.2, rev: 0.6 }); },
  slide() { if (!this.ok('slide')) return; const t = ctx.currentTime; noise(t, 0.8, { vol: 0.09, f: 200, sweep: 600, q: 0.8, type: 'lowpass' }); tone(hz(-5), t, 0.8, { vol: 0.08, attack: 0.15 }); },
  thunk() { if (!this.ok('thunk')) return; const t = ctx.currentTime; tone(110, t, 0.3, { vol: 0.18, rev: 0.2 }); noise(t, 0.08, { vol: 0.08, f: 500 }); tone(hz(7), t + 0.05, 0.6, { vol: 0.05 }); },
  chime(i = 0) { if (!this.ok('chime')) return; const t = ctx.currentTime; [12, 16, 19].forEach((n, k) => tone(hz(n + i), t + k * 0.07, 1.0, { vol: 0.06 })); },
  feather() { if (!this.ok('feather')) return; const t = ctx.currentTime; [0, 4, 7, 12, 16, 19, 24].forEach((n, k) => tone(hz(n + 12), t + k * 0.09, 1.6, { vol: 0.07, type: k % 2 ? 'sine' : 'triangle' })); noise(t, 1.5, { vol: 0.05, f: 6000, q: 0.5, type: 'highpass' }); },
  stamp() { if (!this.ok('stamp')) return; const t = ctx.currentTime; tone(90, t, 0.15, { vol: 0.08, rev: 0.1 }); noise(t, 0.05, { vol: 0.04, f: 1200, q: 3 }); },
  truck() { if (!this.ok('truck')) return; const t = ctx.currentTime; noise(t, 1.4, { vol: 0.08, f: 120, sweep: 400, q: 0.7, type: 'lowpass' }); tone(hz(7), t, 0.18, { type: 'square', vol: 0.03, rev: 0.2 }); tone(hz(7), t + 0.22, 0.18, { type: 'square', vol: 0.03, rev: 0.2 }); },
  buy() { if (!this.ok('buy')) return; const t = ctx.currentTime; tone(hz(12), t, 0.2, { type: 'triangle', vol: 0.07 }); tone(hz(19), t + 0.06, 0.3, { type: 'triangle', vol: 0.06 }); },
  coin() { if (!this.ok('coin')) return; const t = ctx.currentTime; tone(hz(24), t, 0.12, { type: 'square', vol: 0.025, rev: 0.2 }); tone(hz(31), t + 0.07, 0.3, { type: 'square', vol: 0.025, rev: 0.3 }); },
  milestone() { if (!this.ok('milestone')) return; const t = ctx.currentTime; [0, 4, 7, 12, 16].forEach((n, k) => tone(hz(n + 12), t + k * 0.07, 0.9, { vol: 0.07, type: 'triangle' })); },
  pick() { if (!this.ok('pick')) return; const t = ctx.currentTime; tone(hz(19 + (stepI++ % 5)), t, 0.09, { type: 'triangle', vol: 0.05, rev: 0.1 }); },
  drop() { if (!this.ok('drop')) return; const t = ctx.currentTime; tone(hz(12 - (stepI++ % 3)), t, 0.1, { type: 'triangle', vol: 0.05, rev: 0.1 }); noise(t, 0.04, { vol: 0.03, f: 1800, q: 2 }); },
  pop() { if (!this.ok('pop')) return; const t = ctx.currentTime; tone(hz(16), t, 0.12, { type: 'sine', vol: 0.07, rev: 0.2 }); tone(hz(23), t + 0.05, 0.2, { type: 'sine', vol: 0.05, rev: 0.3 }); },
  tick() { if (!this.ok('tick')) return; const t = ctx.currentTime; tone(1800, t, 0.03, { type: 'square', vol: 0.012, rev: 0 }); },
  setMusic(on) {
    if (!ensure()) return; musicOn = on && this.enabled; const t = ctx.currentTime;
    musicBus.gain.cancelScheduledValues(t); musicBus.gain.linearRampToValueAtTime(musicOn ? 0.5 : 0, t + 1.5);
    if (musicOn && !musicTimer) {
      const chords = [[0, 4, 7, 9], [5, 9, 12, 14], [-3, 0, 4, 7], [7, 11, 14, 17]]; let bar = 0;
      const tick = () => { if (!musicOn) { musicTimer = null; return; } curV = null; if (ctx.state !== 'running') { musicTimer = setTimeout(tick, 400); return; } const t0 = ctx.currentTime + 0.05, ch = chords[bar % 4];
        ch.forEach(n => tone(hz(n - 12), t0, 4.4, { type: 'sine', vol: 0.035, attack: 1.2, dest: musicBus }));
        for (let i = 0; i < 4; i++) if (Math.random() < 0.55) tone(hz(ch[Math.floor(Math.random() * 4)] + 12 + (Math.random() < 0.3 ? 12 : 0)), t0 + i * 1.1 + Math.random() * 0.2, 2.2, { type: 'triangle', vol: 0.025, dest: musicBus });
        bar++; musicTimer = setTimeout(tick, 4400); };
      tick();
    }
  },
};
