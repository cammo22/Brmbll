/* =========================================================
   BRAMBILLA QUEST — audio sintetizzato (WebAudio, nessun file)
   ========================================================= */
(function () {
  'use strict';
  const BQ = window.BQ;
  let ac = null, master = null, sfxBus = null, musBus = null, noiseBuf = null;
  let musicOn = false, musicTimer = 0, step = 0, nextT = 0;

  function init() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      ac = new AC();
      master = ac.createGain(); master.gain.value = 0.9; master.connect(ac.destination);
      sfxBus = ac.createGain(); sfxBus.gain.value = 0.7; sfxBus.connect(master);
      musBus = ac.createGain(); musBus.gain.value = 0.22; musBus.connect(master);
      const len = ac.sampleRate * 1;
      noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { ac = null; return false; }
    return true;
  }

  function tone(freq, dur, o) {
    if (!ac) return;
    o = o || {};
    const t0 = ac.currentTime + (o.delay || 0);
    const osc = ac.createOscillator(), g = ac.createGain();
    osc.type = o.type || 'square';
    osc.frequency.setValueAtTime(freq, t0);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.to), t0 + dur);
    const v = (o.vol == null ? 0.25 : o.vol);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + (o.att || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(o.bus || sfxBus);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }
  function noise(dur, o) {
    if (!ac) return;
    o = o || {};
    const t0 = ac.currentTime + (o.delay || 0);
    const src = ac.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
    const f = ac.createBiquadFilter(); f.type = o.filter || 'bandpass';
    f.frequency.setValueAtTime(o.f || 2000, t0);
    if (o.to) f.frequency.exponentialRampToValueAtTime(Math.max(40, o.to), t0 + dur);
    f.Q.value = o.q || 1;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(o.vol == null ? 0.3 : o.vol, t0 + (o.att || 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(sfxBus);
    src.start(t0, Math.random() * 0.5); src.stop(t0 + dur + 0.05);
  }

  const S = {
    click() { tone(660, 0.06, { type: 'triangle', vol: 0.2 }); },
    tap() { tone(440, 0.05, { type: 'triangle', vol: 0.15 }); },
    ok() { tone(523, 0.09, { type: 'triangle' }); tone(784, 0.14, { type: 'triangle', delay: 0.08 }); },
    bad() { tone(200, 0.18, { type: 'sawtooth', to: 120, vol: 0.22 }); tone(150, 0.22, { type: 'sawtooth', to: 90, delay: 0.1, vol: 0.2 }); },
    coin() { tone(988, 0.07, { type: 'square', vol: 0.16 }); tone(1319, 0.22, { type: 'square', vol: 0.16, delay: 0.07 }); },
    cash() { noise(0.05, { f: 5000, vol: 0.25 }); tone(1568, 0.5, { type: 'sine', vol: 0.18, delay: 0.05 }); tone(2093, 0.6, { type: 'sine', vol: 0.12, delay: 0.05 }); },
    slice(speed) { const k = BQ.clamp(speed || 0.6, 0.2, 1.2); noise(0.16 + 0.1 / k, { f: 4200 * k + 1200, to: 900, q: 0.8, vol: 0.32 }); tone(120, 0.05, { type: 'sine', vol: 0.25 }); },
    whoosh() { noise(0.28, { f: 400, to: 3200, q: 0.6, vol: 0.25, att: 0.1 }); },
    pop() { tone(300, 0.09, { type: 'sine', to: 700, vol: 0.3 }); },
    thunk() { tone(110, 0.14, { type: 'sine', to: 60, vol: 0.4 }); noise(0.05, { f: 600, vol: 0.2 }); },
    tick() { tone(1800, 0.025, { type: 'square', vol: 0.08 }); },
    buzz() { tone(110, 0.3, { type: 'sawtooth', vol: 0.2 }); },
    ding() { tone(1175, 0.5, { type: 'sine', vol: 0.25 }); tone(1760, 0.6, { type: 'sine', vol: 0.12 }); },
    splash() { noise(0.3, { f: 1800, to: 500, q: 0.5, vol: 0.3 }); },
    spark() { noise(0.08, { f: 7000, filter: 'highpass', vol: 0.18 }); },
    sizzle() { noise(0.4, { f: 6000, filter: 'highpass', vol: 0.12 }); },
    page() { noise(0.22, { f: 1500, to: 3500, q: 0.4, vol: 0.2, att: 0.05 }); },
    star(i) { const n = [659, 784, 988][i || 0] || 659; tone(n, 0.25, { type: 'triangle', vol: 0.28 }); tone(n * 2, 0.3, { type: 'sine', vol: 0.1, delay: 0.02 }); },
    win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, { type: 'triangle', delay: i * 0.1, vol: 0.26 })); },
    fanfare() { [392, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i > 5 ? 0.6 : 0.18, { type: 'square', delay: i * 0.13, vol: 0.18 })); },
    lose() { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.25, { type: 'triangle', delay: i * 0.14, vol: 0.25 })); },
    engine() { tone(70, 0.3, { type: 'sawtooth', to: 55, vol: 0.12 }); },
    zap() { tone(900, 0.2, { type: 'sawtooth', to: 120, vol: 0.2 }); },
    blip(p) { tone(300 + (p || 1) * 380 * (0.85 + Math.random() * 0.3), 0.045, { type: 'square', vol: 0.07 }); },
    mew() { tone(700, 0.25, { type: 'triangle', to: 1000, vol: 0.12 }); tone(1000, 0.25, { type: 'triangle', to: 600, delay: 0.2, vol: 0.12 }); },
    meow() { S.mew(); },
  };

  /* ---------- musica: tarantella in 6/8, procedurale ---------- */
  const N = (n) => 440 * Math.pow(2, (n - 69) / 12);
  // progressione: Am | Dm | E | Am   (2 battute ciascuna, 6 crome a battuta)
  const CHORDS = [[57, 60, 64], [62, 65, 69], [64, 68, 71], [57, 60, 64], [57, 60, 64], [65, 69, 72], [64, 68, 71], [57, 60, 64]];
  const MEL = [
    [76, 0, 72, 76, 0, 79, 77, 0, 76, 74, 0, 72],
    [74, 0, 77, 81, 0, 77, 74, 0, 72, 74, 0, 77],
    [76, 0, 80, 83, 0, 80, 76, 0, 71, 74, 76, 80],
    [81, 0, 79, 76, 0, 72, 76, 0, 0, 0, 0, 0],
    [76, 0, 72, 76, 0, 79, 81, 0, 79, 77, 0, 76],
    [77, 0, 81, 84, 0, 81, 77, 0, 74, 77, 0, 81],
    [80, 0, 83, 80, 0, 76, 80, 0, 83, 88, 0, 83],
    [81, 0, 79, 76, 0, 72, 69, 0, 0, 0, 0, 0],
  ];
  function schedule() {
    if (!musicOn || !ac) return;
    const dt = 0.17; // croma
    while (nextT < ac.currentTime + 0.4) {
      const bar = Math.floor(step / 6) % 8, pos = step % 6;
      const ch = CHORDS[bar];
      const t = Math.max(0, nextT - ac.currentTime);
      if (pos === 0) tone(N(ch[0] - 12), 0.32, { type: 'triangle', vol: 0.5, delay: t, bus: musBus });
      if (pos === 3) tone(N(ch[2] - 12), 0.22, { type: 'triangle', vol: 0.35, delay: t, bus: musBus });
      if (pos === 1 || pos === 2 || pos === 4 || pos === 5) tone(N(ch[(pos) % 3] + 0), 0.09, { type: 'square', vol: 0.09, delay: t, bus: musBus });
      const m = MEL[bar][(step % 12)];
      if (m) tone(N(m), 0.22, { type: 'triangle', vol: 0.42, delay: t, att: 0.015, bus: musBus });
      nextT += dt; step++;
    }
  }

  BQ.audio = {
    init,
    get ready() { return !!ac; },
    sfx(name, a) {
      if (!BQ.save.setting('sound')) return;
      if (!ac && !init()) return;
      try { if (S[name]) S[name](a); } catch (e) { /* */ }
    },
    blip(p) { BQ.audio.sfx('blip', p); },
    music(on) {
      if (on === undefined) on = BQ.save.setting('music');
      if (on && BQ.save.setting('music')) {
        if (!ac && !init()) return;
        if (musicOn) return;
        musicOn = true; step = 0; nextT = ac.currentTime + 0.1;
        clearInterval(musicTimer); musicTimer = setInterval(schedule, 120);
      } else { musicOn = false; clearInterval(musicTimer); }
    },
    duck(on) { if (musBus && ac) musBus.gain.linearRampToValueAtTime(on ? 0.07 : 0.22, ac.currentTime + 0.3); },
  };
  BQ.bus.on('setting', (k) => { if (k === 'music') BQ.audio.music(BQ.save.setting('music')); });
  // sblocco audio al primo gesto (policy dei browser)
  const unlock = () => { init(); if (BQ.save.setting('music')) BQ.audio.music(true); window.removeEventListener('pointerdown', unlock, true); window.removeEventListener('keydown', unlock, true); };
  window.addEventListener('pointerdown', unlock, true);
  window.addEventListener('keydown', unlock, true);
  document.addEventListener('visibilitychange', () => { if (ac) { if (document.hidden) ac.suspend(); else ac.resume(); } });
})();
