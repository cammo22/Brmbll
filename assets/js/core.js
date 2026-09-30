/* =========================================================
   BRAMBILLA QUEST — core: utilità, salvataggio, eventi
   ========================================================= */
(function () {
  'use strict';
  const BQ = (window.BQ = window.BQ || {});
  BQ.version = '1.0.0';
  BQ.scenes = {};
  BQ.minis = {};

  /* ---------- DOM ---------- */
  BQ.$ = (s, r) => (r || document).querySelector(s);
  BQ.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  BQ.el = function (tag, props, ...kids) {
    const e = document.createElement(tag);
    if (props) {
      for (const k in props) {
        const v = props[k];
        if (v == null || v === false) continue;
        if (k === 'class') e.className = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k === 'text') e.textContent = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
        else if (k === 'on') for (const ev in v) e.addEventListener(ev, v[ev]);
        else if (k === 'data') for (const d in v) e.dataset[d] = v[d];
        else e.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const c of kids.flat()) {
      if (c == null || c === false) continue;
      e.append(c.nodeType ? c : document.createTextNode(c));
    }
    return e;
  };

  /* ---------- matematica ---------- */
  BQ.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  BQ.lerp = (a, b, t) => a + (b - a) * t;
  BQ.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  BQ.hash = function (s) {
    let h = 2166136261;
    s = String(s);
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  BQ.rng = function (seed) {
    let a = (seed >>> 0) || 1;
    const f = function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    f.int = (a2, b2) => Math.floor(a2 + f() * (b2 - a2 + 1));
    f.pick = (arr) => arr[Math.floor(f() * arr.length)];
    f.shuffle = (arr) => { arr = arr.slice(); for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(f() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
    return f;
  };
  BQ.shuffle = (arr) => BQ.rng(Date.now() & 0xffffff).shuffle(arr);
  BQ.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  BQ.ease = {
    out: (t) => 1 - Math.pow(1 - t, 3),
    inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    back: (t) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
    bounce: (t) => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375; return n * (t -= 2.625 / d) * t + 0.984375; },
  };
  BQ.fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  BQ.eur = (c) => '€ ' + (c / 100).toFixed(2).replace('.', ',');

  /* ---------- eventi ---------- */
  const handlers = {};
  BQ.bus = {
    on(ev, fn) { (handlers[ev] = handlers[ev] || []).push(fn); return () => BQ.bus.off(ev, fn); },
    off(ev, fn) { handlers[ev] = (handlers[ev] || []).filter((f) => f !== fn); },
    emit(ev, a, b) { (handlers[ev] || []).slice().forEach((f) => { try { f(a, b); } catch (e) { console.error(e); } }); },
  };

  /* ---------- ambiente ---------- */
  const ua = navigator.userAgent || '';
  BQ.env = {
    electron: /Electron\//.test(ua),
    capacitor: !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()),
    android: /Android/i.test(ua),
    windows: /Windows/i.test(ua),
    touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  };
  BQ.env.app = BQ.env.electron || BQ.env.capacitor;
  // nelle app i PDF (12 MB) non sono inclusi: si aprono dal sito online
  BQ.pdf = (f) => (BQ.env.app ? 'https://cammo22.github.io/Brmbll/assets/pdf/' : 'assets/pdf/') + f;

  /* ---------- salvataggio ---------- */
  const KEY = 'bq.save.v1';
  const fresh = () => ({
    v: 1, name: '', avatar: 0, chapter: 0, scene: null,
    flags: {}, inv: [], stars: {}, best: {}, seen: {}, plays: 0,
    settings: { sound: true, music: true, vib: true, hints: true },
  });
  let mem = null;
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const d = JSON.parse(raw); return Object.assign(fresh(), d, { settings: Object.assign(fresh().settings, d.settings || {}) }); }
    } catch (e) { /* storage non disponibile */ }
    return fresh();
  }
  mem = load();
  let saveTimer = 0;
  BQ.save = {
    get data() { return mem; },
    commit() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* */ } }, 120);
    },
    reset() { mem = fresh(); try { localStorage.removeItem(KEY); } catch (e) { /* */ } BQ.bus.emit('save'); },
    flag(k, v) { if (v === undefined) return !!mem.flags[k]; mem.flags[k] = v; BQ.save.commit(); BQ.bus.emit('save'); },
    has(item) { return mem.inv.includes(item); },
    give(item) { if (!mem.inv.includes(item)) { mem.inv.push(item); BQ.save.commit(); BQ.bus.emit('inv', item); } },
    take(item) { mem.inv = mem.inv.filter((i) => i !== item); BQ.save.commit(); BQ.bus.emit('inv'); },
    stars(id) { return mem.stars[id] || 0; },
    setStars(id, n, score) {
      const old = mem.stars[id] || 0;
      if (n > old) mem.stars[id] = n;
      if (score != null && score > (mem.best[id] || 0)) mem.best[id] = score;
      mem.plays++;
      BQ.save.commit(); BQ.bus.emit('save');
      return n > old;
    },
    totalStars() { let t = 0; for (const k in mem.stars) t += mem.stars[k]; return t; },
    setting(k, v) { if (v === undefined) return mem.settings[k]; mem.settings[k] = v; BQ.save.commit(); BQ.bus.emit('setting', k); },
  };

  const RANKS = [[0, 'Garzone'], [8, 'Apprendista'], [25, 'Bottegaio'], [60, 'Affettatore'], [120, 'Mastro di Bottega'], [220, 'Leggenda di Agrate']];
  BQ.rank = function () {
    const t = BQ.save.totalStars();
    let r = RANKS[0], next = null;
    for (let i = 0; i < RANKS.length; i++) if (t >= RANKS[i][0]) { r = RANKS[i]; next = RANKS[i + 1] || null; }
    return { title: r[1], stars: t, next: next ? next[0] : null, nextTitle: next ? next[1] : null, from: r[0] };
  };

  BQ.vibrate = function (ms) { if (BQ.save.setting('vib') && navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) { /* */ } } };
})();
