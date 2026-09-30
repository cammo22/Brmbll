/* =========================================================
   MINIGIOCHI A — affettatrice (prosciutto crudo!), volano, affilatura,
   versa/pesa/sottovuoto, taratura
   ========================================================= */
(function () {
  'use strict';
  const BQ = window.BQ, G = BQ.g, A = BQ.art, M = BQ.mini;
  const NAVY = '#0A1B3F';
  const TAU = Math.PI * 2;

  /* =========================================================
     1. AFFETTA! — prosciutto crudo & compagnia
     ========================================================= */
  const FOODS = {
    crudo: { name: 'prosciutto crudo', art: 'il crudo', face: ['#E58580', '#B8403F'], rind: '#F6DDD2', shape: 'leg', gpm: 6.5, skin: ['#9A3A33', '#6B1D1F'], bone: true, marble: true },
    cotto: { name: 'prosciutto cotto', art: 'il cotto', face: ['#F8C2BC', '#EE9C99'], rind: '#FFF0E0', shape: 'leg', gpm: 7.5, skin: ['#D9A288', '#B97A60'], marble: true },
    speck: { name: 'speck', art: 'lo speck', face: ['#D25A49', '#A53A33'], rind: '#F2E4CF', shape: 'leg', gpm: 6, skin: ['#A9704A', '#7A4A2E'], marble: true },
    salame: { name: 'salame', art: 'il salame', face: ['#C8504A', '#9B2D2B'], rind: '#E9DCCB', shape: 'cyl', gpm: 5.5, skin: ['#E3D4BE', '#B9A386'], dots: true },
    mortadella: { name: 'mortadella', art: 'la mortadella', face: ['#F4B2B3', '#E58E92'], rind: '#F8DDD2', shape: 'cyl', gpm: 8, skin: ['#EDBFB6', '#D69A92'], cubes: true },
    bresaola: { name: 'bresaola', art: 'la bresaola', face: ['#9A323F', '#66192A'], rind: '#7A2A37', shape: 'cyl', gpm: 5.2, skin: ['#6A3A3E', '#46252A'] },
    formaggio: { name: 'formaggio', art: 'il formaggio', face: ['#FFE793', '#F5C94A'], rind: '#E9B93C', shape: 'cyl', gpm: 9, skin: ['#E9B93C', '#C99A1E'], holes: true },
  };
  BQ.FOODS = FOODS;

  function drawFace(c, f, x, y, rx, ry, seed, alpha, torn) {
    const r = BQ.rng(seed);
    c.save(); c.globalAlpha = alpha == null ? 1 : alpha;
    G.ell(c, x, y, rx + 10, ry + 10, f.rind, 5);
    const g = c.createRadialGradient(x - rx * 0.2, y - ry * 0.25, 4, x, y, ry);
    g.addColorStop(0, f.face[0]); g.addColorStop(1, f.face[1]);
    c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fillStyle = g; c.fill();
    c.save(); c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.clip();
    c.lineCap = 'round';
    if (f.marble) { c.strokeStyle = 'rgba(255,240,235,.55)'; c.lineWidth = 4; for (let i = 0; i < 6; i++) { const a = r() * TAU, d = r() * 0.6; c.beginPath(); c.arc(x + Math.cos(a) * rx * d, y + Math.sin(a) * ry * d, 10 + r() * 22, r() * 6, r() * 6 + 1.6); c.stroke(); } }
    if (f.dots) { for (let i = 0; i < 26; i++) { c.fillStyle = r() < 0.6 ? '#F4E3D8' : '#7A1E21'; c.beginPath(); c.arc(x + (r() - 0.5) * rx * 1.8, y + (r() - 0.5) * ry * 1.8, 3 + r() * 5, 0, TAU); c.fill(); } }
    if (f.cubes) { for (let i = 0; i < 14; i++) { c.fillStyle = '#FFF6EC'; c.fillRect(x + (r() - 0.5) * rx * 1.6, y + (r() - 0.5) * ry * 1.6, 9, 9); } for (let i = 0; i < 8; i++) { c.fillStyle = '#8CBF5A'; c.beginPath(); c.arc(x + (r() - 0.5) * rx * 1.6, y + (r() - 0.5) * ry * 1.6, 3, 0, TAU); c.fill(); } }
    if (f.holes) { for (let i = 0; i < 7; i++) { const hx = x + (r() - 0.5) * rx * 1.4, hy = y + (r() - 0.5) * ry * 1.4; G.ell(c, hx, hy, 6 + r() * 8, 6 + r() * 8, '#E0A724', 2); } }
    c.restore();
    c.lineWidth = 5; c.strokeStyle = NAVY; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.stroke();
    if (f.bone) G.circ(c, x + rx * 0.25, y + ry * 0.05, 9, '#F4F2EC', 3);
    if (torn) { c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 3; c.setLineDash([6, 8]); c.beginPath(); c.ellipse(x, y, rx - 6, ry - 6, 0, 0, TAU); c.stroke(); c.setLineDash([]); }
    c.restore();
  }

  function drawBody(c, f, hx, hy, L) {
    const sk = c.createLinearGradient(0, hy - 120, 0, hy + 130);
    sk.addColorStop(0, f.skin[0]); sk.addColorStop(1, f.skin[1]);
    c.save(); c.fillStyle = sk; c.strokeStyle = NAVY; c.lineWidth = 5; c.lineJoin = 'round';
    if (f.shape === 'leg') {
      c.beginPath();
      c.moveTo(hx, hy - 112);
      c.bezierCurveTo(hx - 120, hy - 150, hx - 270 * L, hy - 130, hx - 370 * L, hy - 74);
      c.bezierCurveTo(hx - 420 * L, hy - 52, hx - 450 * L, hy - 40, hx - 490 * L, hy - 30);
      c.lineTo(hx - 500 * L, hy - 4);
      c.bezierCurveTo(hx - 455 * L, hy + 30, hx - 410 * L, hy + 50, hx - 360 * L, hy + 88);
      c.bezierCurveTo(hx - 260 * L, hy + 160, hx - 120, hy + 160, hx, hy + 112);
      c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = f.rind; c.lineWidth = 9; c.globalAlpha = 0.85; c.beginPath();
      c.moveTo(hx - 12, hy - 104); c.bezierCurveTo(hx - 120, hy - 140, hx - 260 * L, hy - 122, hx - 350 * L, hy - 72); c.stroke(); c.globalAlpha = 1;
      G.ell(c, hx - 505 * L, hy - 18, 18, 14, '#3A2418', 4);
      c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.ellipse(hx - 150, hy - 70, 120 * L + 30, 14, -0.12, 0, TAU); c.fill();
    } else {
      const len = 420 * L, ry = 100;
      G.rr(c, hx - len, hy - ry, len, ry * 2, 34); c.fill(); c.stroke();
      c.strokeStyle = 'rgba(10,27,63,.35)'; c.lineWidth = 4;
      for (let i = 1; i < 6; i++) { const xx = hx - len * i / 6; c.beginPath(); c.moveTo(xx, hy - ry + 6); c.quadraticCurveTo(xx + 14, hy, xx, hy + ry - 6); c.stroke(); }
      c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(hx - len + 30, hy - ry + 14, len - 60, 12);
      c.strokeStyle = '#B5462B'; c.lineWidth = 7; c.beginPath(); c.moveTo(hx - len + 6, hy - ry + 18); c.lineTo(hx - len + 6, hy + ry - 18); c.stroke();
    }
    c.restore();
  }

  function drawBlade(c, cx, cy, R, rot) {
    c.save();
    G.circ(c, cx, cy, R + 6, 'rgba(10,27,63,.18)', 0);
    c.beginPath(); c.arc(cx, cy, R, 0, TAU);
    c.fillStyle = G.steel(c, cx - R, cy - R, cx + R, cy + R); c.fill(); c.lineWidth = 6; c.strokeStyle = NAVY; c.stroke();
    c.strokeStyle = 'rgba(10,27,63,.2)'; c.lineWidth = 2;
    for (const rr of [0.84, 0.66, 0.48]) { c.beginPath(); c.arc(cx, cy, R * rr, 0, TAU); c.stroke(); }
    // riflessi rotanti
    c.lineCap = 'round';
    for (let i = 0; i < 3; i++) { const a = rot + i * 2.09; c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = 9; c.beginPath(); c.arc(cx, cy, R * 0.9, a, a + 0.28); c.stroke(); c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 5; c.beginPath(); c.arc(cx, cy, R * 0.6, a + 0.6, a + 0.76); c.stroke(); }
    c.beginPath(); c.arc(cx, cy, R - 3, 0, TAU); c.lineWidth = 3; c.strokeStyle = 'rgba(255,255,255,.9)'; c.stroke();
    G.circ(c, cx, cy, 40, '#0A1B3F', 5); G.circ(c, cx, cy, 30, G.lin(c, cx - 30, cy - 30, cx + 30, cy + 30, [[0, '#FF6A76'], [1, '#B0121F']]), 4);
    for (let i = 0; i < 6; i++) { const a = rot * 0.5 + i * TAU / 6; G.circ(c, cx + Math.cos(a) * 18, cy + Math.sin(a) * 18, 3, NAVY, 0); }
    c.restore();
  }

  M.register('slice', {
    name: 'Affetta!', icon: 'slicer', tint: '#F6D5D5',
    blurb: 'Il cliente al banco vuole i grammi giusti. Muovi il carrello avanti e indietro: ogni passata è una fetta.',
    howto: [
      ['Trascina', 'il carrello a destra e sinistra (o tasti ← →): a destra la lama taglia'],
      ['Spessore', 'con − / + (o ↑ ↓) scegli quanto sono sottili le fette'],
      ['Ritmo', 'passata troppo lenta = fetta strappata; ritmo costante = fetta perfetta'],
      ['Servi', 'premi SERVI quando la bilancia segna i grammi richiesti (o Invio)'],
    ],
    variants: {
      tutorial: { label: 'Prova al banco', food: 'crudo', orders: [{ g: 100, max: 4, time: 90, tol: [6, 14, 26] }], brief: 'Il tuo primo cliente: 100 grammi di prosciutto crudo. Calma e ritmo!' },
      crudo: { label: 'Prosciutto crudo', food: 'crudo', orders: [{ g: 100, max: 2, time: 60, tol: [4, 9, 16] }, { g: 150, max: 2, time: 60, tol: [4, 9, 16] }, { g: 80, max: 1, time: 55, tol: [3, 7, 13] }], brief: 'Tre clienti, tre ordini di crudo: fette sottili e grammi precisi.' },
      cotto: { label: 'Prosciutto cotto', food: 'cotto', orders: [{ g: 120, max: 3, time: 60, tol: [5, 10, 18] }, { g: 200, max: 3, time: 60, tol: [5, 10, 18] }], brief: 'Due ordini di cotto, fette più generose.' },
      speck: { label: 'Speck', food: 'speck', orders: [{ g: 90, max: 2, time: 55, tol: [4, 9, 16] }, { g: 130, max: 2, time: 55, tol: [4, 9, 16] }], brief: 'Lo speck va tagliato sottile!' },
      salame: { label: 'Salame', food: 'salame', orders: [{ g: 110, max: 3, time: 60, tol: [5, 10, 18] }, { g: 160, max: 4, time: 60, tol: [5, 10, 18] }], brief: 'Salame a fette regolari.' },
      mortadella: { label: 'Mortadella', food: 'mortadella', orders: [{ g: 140, max: 4, time: 60, tol: [6, 12, 20] }, { g: 220, max: 4, time: 60, tol: [6, 12, 20] }], brief: 'Mortadella: fette larghe e pesanti.' },
      bresaola: { label: 'Bresaola', food: 'bresaola', orders: [{ g: 70, max: 1, time: 55, tol: [3, 7, 12] }, { g: 100, max: 1.5, time: 55, tol: [3, 7, 12] }], brief: 'La bresaola si taglia quasi trasparente.' },
      formaggio: { label: 'Formaggio', food: 'formaggio', orders: [{ g: 150, max: 4, time: 60, tol: [6, 12, 22] }, { g: 250, max: 4, time: 60, tol: [6, 12, 22] }], brief: 'Formaggio a fette spesse.' },
      duello: { label: 'Duello finale', food: 'crudo', rival: true, orders: [{ g: 120, max: 2, time: 40, tol: [4, 9, 16] }, { g: 90, max: 1.5, time: 35, tol: [3, 8, 14] }, { g: 160, max: 2, time: 40, tol: [4, 9, 16] }], brief: 'Duello di affettatura contro Ottavio Trucco! Sii più preciso di lui.' },
      festa: { label: 'Il taglio della festa', food: 'crudo', orders: [{ g: 200, max: 2.5, time: 75, tol: [6, 12, 22] }], brief: 'Il taglio di mezzanotte con la Lama d\'Oro!' },
    },
    create(api, v) {
      const c = api.ctx, rng = api.rng;
      const food = FOODS[v.food || 'crudo'];
      const orders = v.orders || [{ g: 100, max: 3, time: 60, tol: [5, 10, 18] }];
      const THICK = [0.5, 1, 1.5, 2, 3, 4];
      const S = { ci: 0, cpos: 0, armed: true, knob: 2, slices: [], pile: [], weight: 0, cuts: 0, thickViol: 0, perfect: 0, combo: 0, score: 0, res: [], t: 0, rot: 0, drag: null, hist: [], served: false, phase: 'order', phaseT: 0, len: 1, lastCut: -9, msg: '', msgT: 0, kb: 0, hintOn: true, tornN: 0 };
      const P = G.Particles();
      const BL = { x: 880, y: 312, R: 150 };
      const R0 = 500, R1 = 900; // range del centro faccia
      const CUT = 0.56;
      const cust = () => A.customer(4 + (S.ci + (api.seed % 50)) * 3, { mood: 'happy' });
      let custImg = null, custMood = 'neutral';
      function loadCust(mood) { const id = 4 + (S.ci + (api.seed % 50)) * 3; custImg = G.svgImg(A.customer(id, { mood: mood || 'neutral' }), 200, 230); custMood = mood; }
      const order = () => orders[S.ci];
      function bubbleText() {
        const o = order(), thin = o.max <= 1 ? ' sottilissimo' : o.max <= 2 ? ' sottile' : '';
        return `Mi dà ${o.g} grammi di ${food.name}${thin}, per favore!`;
      }
      let rivalT = 0, rivalServed = false, rivalDiff = 0;
      function startOrder() {
        const o = order();
        S.weight = 0; S.cuts = 0; S.slices.length = 0; S.pile.length = 0; S.cpos = 0; S.armed = true; S.served = false; S.t = 0; S.thickViol = 0; S.perfect = 0; S.combo = 0; S.tornN = 0; S.phase = 'play'; S.len = Math.max(0.55, S.len);
        loadCust('neutral');
        rivalT = 0; rivalServed = false; rivalDiff = 0;
        if (v.rival) { rivalDiff = 2 + Math.round(rng() * 4); }
        api.hud('ordine', `${S.ci + 1}/${orders.length}`);
      }
      startOrder();
      api.hud('punti', 0);

      function setC(x) { S.cpos = BQ.clamp(x, 0, 1); }
      function thick() { return THICK[S.knob]; }
      function cut(speed) {
        const mm = thick();
        let q = 'ok', gk = 1;
        if (speed < 0.75) { q = 'torn'; gk = 0.65; } else if (speed >= 1.3 && speed <= 3.4) { q = 'perfect'; }
        const g = mm * food.gpm * (0.92 + rng() * 0.16) * gk * (0.85 + 0.15 * S.len);
        S.weight += g; S.cuts++; S.lastCut = S.t; S.len = Math.max(0.35, S.len - 0.006 - mm * 0.0012);
        const o = order();
        if (mm > o.max) { S.thickViol++; S.msg = 'Troppo spessa!'; }
        if (q === 'perfect') { S.perfect++; S.combo++; if (S.combo > 1) S.msg = `Combo x${S.combo}!`; else S.msg = 'Perfetta!'; P.burst(1000, 380, 10, { col: ['#fff', '#FFE58A'], speed: 240, life: 0.5, size: 6 }); S.score += 4 + S.combo; }
        else if (q === 'torn') { S.combo = 0; S.tornN++; S.msg = 'Strappata! Più ritmo'; api.sfx('buzz'); }
        else { S.combo = 0; S.msg = ''; }
        S.msgT = 0.9;
        api.sfx('slice', speed / 2.5); api.vib(12);
        S.slices.push({ x: 990, y: 350, vx: 70 + rng() * 40, vy: 40, t: 0, rot: (rng() - 0.5) * 0.5, vr: (rng() - 0.5) * 2, mm, torn: q === 'torn', seed: Math.floor(rng() * 1e6), ry0: 104, done: false });
      }
      function landSlice(s) {
        const n = S.pile.length;
        S.pile.push({ x: 1090 + (rng() - 0.5) * 70, y: 574 - Math.min(n, 30) * 1.6 + (rng() - 0.5) * 18, rot: (rng() - 0.5) * 0.8, seed: s.seed, mm: s.mm, torn: s.torn });
        api.sfx('tick');
      }
      function serve(auto) {
        if (S.served) return;
        S.served = true; S.phase = 'served';
        const o = order(), diff = Math.abs(S.weight - o.g);
        let st = 0;
        if (diff <= o.tol[0]) st = 3; else if (diff <= o.tol[1]) st = 2; else if (diff <= o.tol[2]) st = 1;
        if (S.thickViol > Math.max(1, S.cuts * 0.25)) st = Math.max(0, st - 1);
        if (S.weight < 5) st = 0;
        let rivalWin = false;
        if (v.rival) { const rs = rivalDiff <= 3 ? 3 : rivalDiff <= 6 ? 2 : 1; if (rivalServed && rs >= st && (S.t > rivalT)) rivalWin = true; if (rivalWin && st > 0) st = Math.max(0, st - 1); }
        const bonus = Math.max(0, Math.round((o.time - S.t) * 1.5));
        const pts = st > 0 ? Math.round(Math.max(0, 100 - diff * 4) + bonus + S.perfect * 5) : 0;
        S.score += pts; S.res.push(st);
        S.phaseT = 0;
        loadCust(st >= 2 ? 'happy' : st === 1 ? 'neutral' : 'angry');
        S.msg = st >= 3 ? 'Esattamente!' : st === 2 ? 'Quasi giusto!' : st === 1 ? 'Va bene così' : (S.weight > o.g ? 'Troppo!' : 'Troppo poco!'); S.msgT = 2;
        S.detail = `${Math.round(S.weight)} g su ${o.g} g · ${S.cuts} fette`;
        api.sfx(st > 0 ? 'cash' : 'bad');
        if (st > 0) P.burst(1090, 500, 24, { col: ['#FFE58A', '#fff', '#E11D2E'], speed: 420, life: 0.9 });
        api.hud('punti', S.score);
        if (rivalWin) S.msg = 'Ottavio è stato più veloce!';
      }

      const rect = (x, y, w, h, px, py) => px >= x && px <= x + w && py >= y && py <= y + h;
      const BTN = { minus: [40, 628, 70, 62], plus: [300, 628, 70, 62], serve: [1000, 628, 250, 70] };
      function setKnob(d) { const n = BQ.clamp(S.knob + d, 0, 5); if (n !== S.knob) { S.knob = n; api.sfx('click'); } }
      const inst = {
        down(x, y) {
          if (S.phase !== 'play') { if (S.phase === 'served' && S.phaseT > 1.2) next(); return; }
          if (rect(...BTN.minus, x, y)) return setKnob(-1);
          if (rect(...BTN.plus, x, y)) return setKnob(1);
          if (rect(...BTN.serve, x, y)) return serve();
          if (y > 200 && y < 600) { S.drag = { off: S.cpos - (x - 20) / 1240 / 0.62 }; S.drag.x0 = x; S.drag.c0 = S.cpos; S.hintOn = false; }
        },
        move(x) { if (S.drag && S.phase === 'play') { setC(S.drag.c0 + (x - S.drag.x0) / (R1 - R0) * 1.0); } },
        up() { S.drag = null; },
        key(k, dn) {
          if (S.phase !== 'play') { if (dn && (k === 'Enter' || k === ' ') && S.phase === 'served' && S.phaseT > 1.2) next(); return; }
          if (k === 'ArrowRight') S.kb = dn ? 1 : (S.kb === 1 ? 0 : S.kb); else if (k === 'ArrowLeft') S.kb = dn ? -1 : (S.kb === -1 ? 0 : S.kb);
          else if (dn && k === 'ArrowUp') setKnob(1); else if (dn && k === 'ArrowDown') setKnob(-1); else if (dn && (k === 'Enter')) serve();
          if (dn && (k === 'ArrowRight' || k === 'ArrowLeft')) S.hintOn = false;
        },
        update(dt) {
          S.t += dt; S.rot += dt * 9; S.phaseT += dt; if (S.msgT > 0) S.msgT -= dt;
          P.update(dt);
          if (S.phase === 'play') {
            if (S.kb) { S.kbv = (S.kbv || 0) + S.kb * dt * 7; S.kbv = BQ.clamp(S.kbv, -2.6, 2.6); setC(S.cpos + S.kbv * dt); } else S.kbv = 0;
            S.hist.push([S.t, S.cpos]); while (S.hist.length > 2 && S.t - S.hist[0][0] > 0.14) S.hist.shift();
            const h0 = S.hist[0]; const vel = S.hist.length > 1 ? (S.cpos - h0[1]) / Math.max(0.03, S.t - h0[0]) : 0;
            S.vel = vel;
            if (S.cpos < 0.22) S.armed = true;
            if (S.armed && S.cpos >= CUT && vel > 0.25) { S.armed = false; cut(vel); }
            const o = order();
            const left = o.time - S.t;
            api.hud('tempo', Math.max(0, Math.ceil(left)), left < 10 ? 'bad' : '');
            if (left <= 0) { serve(true); }
            if (v.rival) { rivalT = o.time * 0.62; if (!rivalServed && S.t >= rivalT) { rivalServed = true; S.msg = 'Ottavio ha servito!'; S.msgT = 1.4; api.sfx('buzz'); } }
          }
          for (const s of S.slices) {
            s.t += dt; s.vy += 820 * dt; s.x += (s.vx + Math.sin(s.t * 9) * 40) * dt; s.y += s.vy * dt * 0.75; s.rot += s.vr * dt; s.ry0 = Math.max(24, 104 - s.t * 240);
            if (s.y > 550 + Math.min(S.pile.length, 30) * -1.6 && !s.done) { s.done = true; landSlice(s); }
          }
          S.slices = S.slices.filter((s) => !s.done);
        },
        draw(c) {
          // parete e banco
          c.fillStyle = G.lin(c, 0, 0, 0, 500, [[0, '#FBEAE2'], [1, '#F1CFC6']]); c.fillRect(0, 0, 1280, 500);
          c.fillStyle = '#fff'; c.fillRect(0, 380, 1280, 150);
          c.strokeStyle = 'rgba(10,27,63,.14)'; c.lineWidth = 2; for (let x = 0; x < 1280; x += 64) { c.beginPath(); c.moveTo(x, 380); c.lineTo(x, 530); c.stroke(); } for (let y = 380; y < 530; y += 38) { c.beginPath(); c.moveTo(0, y); c.lineTo(1280, y); c.stroke(); }
          c.fillStyle = '#E11D2E'; c.fillRect(0, 372, 1280, 12);
          c.fillStyle = G.lin(c, 0, 0, 0, 1, [['#fff'], ['#fff']]);
          c.fillStyle = G.steel(c, 0, 530, 0, 720); c.fillRect(0, 530, 1280, 190); c.fillStyle = 'rgba(10,27,63,.85)'; c.fillRect(0, 524, 1280, 10);
          // macchina: corpo
          G.box(c, 780, 230, 250, 290, 34, G.lin(c, 0, 230, 0, 520, [[0, '#FF4A58'], [1, '#B0121F']]), 6);
          G.box(c, 360, 505, 700, 34, 12, G.steel(c, 360, 505, 360, 540), 5);
          G.box(c, 330, 535, 780, 26, 10, '#0A1B3F', 0);
          // prosciutto + carrello
          const hx = R0 + S.cpos * (R1 - R0), hy = 372;
          G.shadow(c, hx - 130, 530, 330, 14, 0.22);
          G.box(c, hx - 420 * S.len + 10, 486, 420 * S.len + 70, 26, 10, G.steel(c, 0, 486, 0, 514), 5);
          drawBody(c, food, hx, hy, S.len);
          drawFace(c, food, hx, hy, food.shape === 'leg' ? 64 : 54, food.shape === 'leg' ? 112 : 100, api.seed, 1);
          // maniglia carrello
          G.box(c, hx - 420 * S.len + 2, 430, 34, 82, 12, G.lin(c, 0, 430, 0, 512, [[0, '#FF4A58'], [1, '#B0121F']]), 5);
          // lama
          drawBlade(c, BL.x, BL.y, BL.R, S.rot);
          // fette in volo
          for (const s of S.slices) {
            c.save(); c.translate(s.x, s.y); c.rotate(s.rot);
            drawFace(c, food, 0, 0, (food.shape === 'leg' ? 64 : 54) * 0.8, s.ry0 * 0.8, s.seed, 0.45 + 0.55 * BQ.clamp(s.mm / 2, 0, 1), s.torn);
            c.restore();
          }
          // piatto
          G.shadow(c, 1090, 588, 168, 30, 0.25);
          G.ell(c, 1090, 572, 160, 46, '#fff', 5); G.ell(c, 1090, 572, 120, 32, '#EEF2F8', 2);
          for (const p of S.pile) { c.save(); c.translate(p.x, p.y); c.rotate(p.rot * 0.3); drawFace(c, food, 0, 0, 62, 20, p.seed, 0.6 + 0.4 * BQ.clamp(p.mm / 2, 0, 1), p.torn); c.restore(); }
          // cliente
          G.box(c, 18, 18, 210, 214, 22, '#fff', 5);
          if (custImg) G.drawImgFit(c, custImg, 18, 18, 210, 214);
          G.box(c, 244, 34, 520, 120, 26, '#fff', 5);
          c.beginPath(); c.moveTo(244, 100); c.lineTo(216, 116); c.lineTo(244, 124); c.fillStyle = '#fff'; c.fill(); c.strokeStyle = NAVY; c.lineWidth = 5; c.stroke();
          c.fillStyle = '#fff'; c.fillRect(242, 100, 6, 24);
          wrapText(c, S.phase === 'served' ? (S.msg || '') : bubbleText(), 272, 94, 470, 35, '#0A1B3F');
          const o = order();
          // tempo
          const tl = BQ.clamp(1 - S.t / o.time, 0, 1);
          G.box(c, 244, 168, 520, 22, 11, '#fff', 4); G.box(c, 248, 172, Math.max(0, 512 * tl), 14, 7, tl < 0.25 ? '#E11D2E' : '#3FA06A', 0);
          // LCD peso
          G.lcd(c, 930, 24, 330, 90, Math.round(S.weight) + ' g', 58);
          c.save(); G.text(c, 'PESO', 946, 40, { size: 15, align: 'left', color: '#8C9A1E', stroke: false, weight: '800' }); c.restore();
          const stable = S.t - S.lastCut > 0.7;
          G.circ(c, 948, 98, 7, stable ? '#8EF08E' : '#2a4a2a', 2); G.text(c, 'STABILE', 962, 99, { size: 13, align: 'left', color: '#8C9A1E', stroke: false });
          // ticket ordine
          G.box(c, 930, 124, 330, 64, 10, '#fff', 4);
          G.text(c, `ORDINE: ${o.g} g`, 945, 146, { size: 24, align: 'left', color: NAVY, stroke: false });
          G.text(c, `fette max ${o.max} mm`, 945, 172, { size: 18, align: 'left', color: '#E11D2E', stroke: false });
          // controlli spessore
          G.box(c, 22, 560, 372, 144, 22, '#fff', 5);
          G.text(c, 'SPESSORE FETTA', 208, 584, { size: 20, color: NAVY, stroke: false });
          G.box(c, ...BTN.minus, 16, '#FFE58A', 5); G.text(c, '−', 75, 660, { size: 50, color: NAVY, stroke: false });
          G.box(c, ...BTN.plus, 16, '#FFE58A', 5); G.text(c, '+', 335, 660, { size: 46, color: NAVY, stroke: false });
          G.lcd(c, 122, 620, 166, 54, THICK[S.knob].toString().replace('.', ',') + ' mm', 34);
          for (let i = 0; i < 6; i++) G.circ(c, 138 + i * 28, 692, i === S.knob ? 8 : 5, i === S.knob ? '#E11D2E' : '#C8D0DA', 2);
          // servi
          const bo = S.phase === 'play' ? 1 : 0.4;
          c.globalAlpha = bo; G.box(c, ...BTN.serve, 20, S.weight > 0 ? '#3FA06A' : '#8FB8A0', 6); G.disp(c, 'SERVI', 1125, 665, { size: 42 }); c.globalAlpha = 1;
          // suggerimento
          if (S.hintOn && S.phase === 'play') { c.save(); c.globalAlpha = 0.6 + Math.sin(S.t * 4) * 0.3; G.disp(c, '◀  trascina il carrello  ▶', 520, 452, { size: 32, color: '#fff' }); c.restore(); }
          // velocità
          if (S.phase === 'play') {
            const vel = Math.abs(S.vel || 0); const w = BQ.clamp(vel / 4, 0, 1);
            G.box(c, 430, 676, 300, 18, 9, '#fff', 3); G.box(c, 430 + 300 * 0.3, 676, 300 * 0.26, 18, 9, 'rgba(63,160,106,.45)', 0);
            G.box(c, 433, 679, Math.max(0, 294 * w), 12, 6, vel < 0.75 ? '#E11D2E' : vel < 3.4 ? '#3FA06A' : '#F2C340', 0);
            G.text(c, 'RITMO', 580, 660, { size: 16, color: NAVY, stroke: false });
          }
          if (S.msgT > 0 && S.msg) { c.save(); c.globalAlpha = BQ.clamp(S.msgT * 2, 0, 1); G.disp(c, S.msg, 640, 280 - (1 - BQ.clamp(S.msgT, 0, 1)) * 30, { size: 56, color: '#FFE58A' }); c.restore(); }
          P.draw(c);
          if (S.phase === 'served' && S.phaseT > 1.2) { c.save(); c.globalAlpha = 0.6 + Math.sin(S.t * 6) * 0.4; G.disp(c, S.ci + 1 < orders.length ? 'Tocca per il prossimo cliente' : 'Tocca per finire', 640, 420, { size: 40, color: '#fff' }); c.restore(); }
        },
      };
      function next() {
        if (S.ci + 1 < orders.length) { S.ci++; startOrder(); return; }
        const avg = S.res.reduce((a, b) => a + b, 0) / S.res.length;
        const stars = avg >= 2.5 ? 3 : avg >= 1.5 ? 2 : avg >= 0.6 ? 1 : 0;
        api.finish({ stars, score: S.score, detail: `Media clienti: ${avg.toFixed(1)} su 3`, title: stars === 3 ? 'Maestro affettatore!' : stars ? 'Bel lavoro!' : 'I clienti non sono contenti…' });
      }
      return inst;
    },
  });

  function wrapText(c, text, x, y, maxW, lh, color, align) {
    c.save(); c.font = '800 ' + (lh - 4) + 'px Archivo, sans-serif'; c.fillStyle = color; c.textBaseline = 'middle'; c.textAlign = align || 'left';
    const words = String(text).split(' '); let line = '', yy = y - (words.join(' ').length > 40 ? lh * 0.5 : 0); const lines = [];
    for (const w of words) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
    lines.push(line);
    const y0 = y - (lines.length - 1) * lh / 2;
    lines.forEach((l, i) => c.fillText(l, x, y0 + i * lh)); c.restore();
  }
  G.wrapText = wrapText;

  /* =========================================================
     2. VOLANO — gira la manovella
     ========================================================= */
  M.register('flywheel', {
    name: 'Gira il volano', icon: 'flywheel', tint: '#F6D5D5',
    blurb: 'Le affettatrici a volano si azionano a mano: mantieni il giusto ritmo!',
    howto: [['Ruota', 'trascina il dito (o il mouse) in cerchio sul volano'], ['Ritmo', 'tieni la lancetta nella fascia verde per riempire la barra'], ['Tastiera', 'alterna ← e → per girare']],
    variants: { base: { label: 'Volano a mano', goal: 100, time: 40 }, fiore: { label: 'Volano a fiore', goal: 120, time: 38, hard: 1 } },
    create(api, v) {
      const P = G.Particles();
      const S = { ang: 0, w: 0, prog: 0, t: 0, last: null, good: 0, kb: 0, slices: 0, acc: 0 };
      const cx = 420, cy = 380, R = 210;
      let dragging = false;
      const band = v.hard ? [2.4, 4.2] : [2.0, 4.6];
      api.hud('tempo', v.time); api.hud('fette', 0);
      const inst = {
        down(x, y) { dragging = true; S.last = Math.atan2(y - cy, x - cx); },
        move(x, y) {
          if (!dragging) return; const a = Math.atan2(y - cy, x - cx); let d = a - S.last; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; S.last = a;
          if (d > 0) { S.ang += d; S.w += d * 1.6; S.acc += d; }
        },
        up() { dragging = false; },
        key(k, dn) { if (!dn) return; if ((k === 'ArrowRight' && S.kb !== 1) || (k === 'ArrowLeft' && S.kb !== -1)) { S.kb = k === 'ArrowRight' ? 1 : -1; S.ang += 0.9; S.w += 1.4; S.acc += 0.9; } },
        update(dt) {
          S.t += dt; P.update(dt);
          S.w = Math.max(0, S.w - dt * 2.4); S.w = Math.min(S.w, 7);
          const sp = S.w; // rad/s stimato
          S.ang += sp * dt * 0.0; // l'angolo avanza dal gesto
          const inBand = sp >= band[0] && sp <= band[1];
          if (inBand) { S.prog += dt * (v.goal / 14); S.good += dt; if (Math.random() < 0.3) P.burst(cx + 280, cy - 40, 1, { col: '#8EF08E', speed: 120, angle: -1.2, spread: 1, life: 0.6 }); }
          else S.prog = Math.max(0, S.prog - dt * 3);
          if (S.prog >= S.slices * 12 + 12) { S.slices++; api.sfx('slice', 1); P.burst(900, 440, 14, { col: ['#E58580', '#F6DDD2'], speed: 260, life: 0.7 }); api.hud('fette', S.slices); }
          api.hud('tempo', Math.max(0, Math.ceil(v.time - S.t)), v.time - S.t < 8 ? 'bad' : '');
          if (S.prog >= v.goal) api.finish({ stars: S.t < v.time * 0.6 ? 3 : S.t < v.time * 0.85 ? 2 : 1, score: Math.round(1000 - S.t * 10 + S.slices * 20), detail: `${S.slices} fette al volo in ${S.t.toFixed(1)} s` });
          else if (S.t >= v.time) api.finish({ stars: S.prog > v.goal * 0.6 ? 1 : 0, score: Math.round(S.prog * 5), detail: 'Tempo scaduto' });
        },
        draw(c) {
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#FBEAE2'], [1, '#F1CFC6']]); c.fillRect(0, 0, 1280, 720);
          c.fillStyle = '#E11D2E'; c.fillRect(0, 560, 1280, 160);
          G.shadow(c, cx, 610, 260, 26, 0.3);
          // volano
          c.save(); c.translate(cx, cy); c.rotate(S.ang);
          G.circ(c, 0, 0, R, G.lin(c, -R, -R, R, R, [[0, '#FF4A58'], [1, '#A80F1E']]), 8);
          G.circ(c, 0, 0, R - 34, 'rgba(255,255,255,.14)', 0);
          for (let i = 0; i < 6; i++) { c.save(); c.rotate(i * TAU / 6); G.ell(c, R * 0.58, 0, 52, 34, '#fff', 6); c.restore(); }
          G.circ(c, 0, 0, 46, G.steel(c, -46, -46, 46, 46), 6); G.circ(c, 0, 0, 14, NAVY, 0);
          G.circ(c, R - 26, 0, 22, G.steel(c, 0, -20, 0, 20), 5);
          c.restore();
          // lama + fette
          drawBlade(c, 900, 360, 150, S.ang * 0.8);
          G.box(c, 760, 500, 330, 30, 12, G.steel(c, 0, 500, 0, 530), 5);
          // indicatore ritmo
          G.box(c, 720, 190, 480, 54, 27, '#fff', 5);
          const x0 = 730, x1 = 1190, sc = (x1 - x0) / 7;
          G.box(c, x0 + band[0] * sc, 198, (band[1] - band[0]) * sc, 38, 19, 'rgba(63,160,106,.6)', 0);
          G.circ(c, x0 + BQ.clamp(S.w, 0, 7) * sc, 217, 18, '#E11D2E', 5);
          G.text(c, 'RITMO', 960, 170, { size: 26, color: '#fff' });
          // barra progresso
          G.box(c, 720, 590, 480, 46, 23, '#fff', 5); G.box(c, 726, 596, Math.max(0, 468 * BQ.clamp(S.prog / v.goal, 0, 1)), 34, 17, '#F2C340', 0);
          G.text(c, 'FETTE PRONTE', 960, 660, { size: 24, color: '#fff' });
          if (S.t < 3.5) { c.globalAlpha = 0.85; G.disp(c, 'GIRA IN CERCHIO!', cx, 640, { size: 42 }); c.globalAlpha = 1; }
          P.draw(c);
        },
      };
      return inst;
    },
  });

  /* =========================================================
     3. AFFILA — passa la lama sulla cote
     ========================================================= */
  M.register('sharpen', {
    name: 'Affila la lama', icon: 'knives', tint: '#E2DAF5',
    blurb: 'Una lama affilata taglia meglio e con meno fatica. Passa la lama sulla mola!',
    howto: [['Strisciata', 'trascina la lama lungo la mola da sinistra a destra'], ['Angolo', 'mantieni la linea nella fascia verde mentre scorri'], ['Scintille', 'ogni passata pulita affila di più']],
    variants: { coltello: { label: 'Coltello da cuoco', passes: 6 }, affettatrice: { label: 'Lama affettatrice', passes: 8, hard: 1 }, tritacarne: { label: 'Coltello tritacarne', passes: 7 } },
    create(api, v) {
      const P = G.Particles();
      const S = { sharp: 0, stroke: null, passes: 0, t: 0, good: 0, total: 0, msg: '', msgT: 0 };
      const mx = 160, mw = 960, my = 300, mh = 120;
      const need = v.passes || 6;
      const tol = v.hard ? 34 : 50;
      api.hud('affilatura', '0%');
      let knife = { x: 640, y: 520 };
      return {
        down(x, y) { if (y > 250 && y < 620) S.stroke = { pts: [], dev: 0, n: 0, x0: x, startT: S.t }; },
        move(x, y) {
          knife.x = x; knife.y = y;
          if (!S.stroke) return;
          const inBand = x > mx && x < mx + mw;
          const dev = Math.abs(y - (my + mh / 2 + 24));
          S.stroke.n++; S.stroke.dev += dev; S.stroke.pts.push(x);
          if (inBand) { if (dev < tol) { if (Math.random() < 0.6) P.burst(x, my + mh / 2, 2, { col: ['#FFE58A', '#fff', '#FF8A1E'], speed: 380, angle: -1.2, spread: 1.4, life: 0.35, size: 4 }); if (Math.random() < 0.12) api.sfx('spark'); } }
        },
        up(x) {
          const s = S.stroke; S.stroke = null; if (!s || s.n < 5) return;
          const len = Math.abs(s.pts[s.pts.length - 1] - s.x0); const avg = s.dev / s.n;
          if (len < 500) { S.msg = 'Passata troppo corta'; S.msgT = 1; api.sfx('bad'); return; }
          S.total++;
          if (avg < tol) { S.sharp += 100 / need; S.passes++; S.good++; S.msg = 'Passata pulita!'; api.sfx('ok'); } else { S.sharp += 100 / need * 0.3; S.msg = 'Angolo storto!'; api.sfx('bad'); }
          S.msgT = 1; api.hud('affilatura', Math.min(100, Math.round(S.sharp)) + '%');
          if (S.sharp >= 99.5) api.finish({ stars: S.total <= need ? 3 : S.total <= need + 2 ? 2 : 1, score: Math.round(1000 - (S.total - need) * 80), detail: `${S.good} passate pulite su ${S.total}` });
        },
        key() {},
        update(dt) { S.t += dt; if (S.msgT > 0) S.msgT -= dt; P.update(dt); },
        draw(c) {
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#2A3A63'], [1, '#0A1B3F']]); c.fillRect(0, 0, 1280, 720);
          G.box(c, mx - 20, my - 30, mw + 40, mh + 60, 26, '#3A4870', 6);
          G.box(c, mx, my, mw, mh, 18, G.lin(c, 0, my, 0, my + mh, [[0, '#E4D3B7'], [1, '#B9A27E']]), 6);
          c.fillStyle = 'rgba(10,27,63,.15)'; for (let i = 0; i < 40; i++) c.fillRect(mx + 20 + (i * 97) % (mw - 40), my + 10 + (i * 53) % (mh - 20), 10, 3);
          // fascia guida
          G.box(c, mx, my + mh / 2 + 24 - tol, mw, tol * 2, 10, 'rgba(63,160,106,.35)', 0);
          c.setLineDash([16, 12]); c.strokeStyle = '#3FA06A'; c.lineWidth = 4; c.beginPath(); c.moveTo(mx, my + mh / 2 + 24); c.lineTo(mx + mw, my + mh / 2 + 24); c.stroke(); c.setLineDash([]);
          // lama seguita
          const kx = S.stroke ? knife.x : 640, ky = S.stroke ? knife.y : 500;
          c.save(); c.translate(kx, ky);
          c.beginPath(); c.moveTo(-200, 14); c.lineTo(160, 14); c.quadraticCurveTo(230, 10, 250, -18); c.lineTo(-200, -34); c.closePath();
          c.fillStyle = G.steel(c, -200, -30, 200, 20); c.fill(); c.lineWidth = 5; c.strokeStyle = NAVY; c.stroke();
          G.box(c, -330, -34, 138, 48, 12, '#0A1B3F', 5); G.circ(c, -300, -10, 5, '#fff', 0); G.circ(c, -255, -10, 5, '#fff', 0);
          c.restore();
          // barra affilatura
          G.box(c, 160, 600, 960, 40, 20, '#fff', 5); G.box(c, 166, 606, Math.max(0, 948 * BQ.clamp(S.sharp / 100, 0, 1)), 28, 14, G.lin(c, 166, 0, 1114, 0, [[0, '#8EA0C0'], [1, '#FFE58A']]), 0);
          G.text(c, 'AFFILATURA', 640, 666, { size: 24 });
          if (S.msgT > 0) G.disp(c, S.msg, 640, 200, { size: 50, color: S.msg.includes('pulita') ? '#8EF08E' : '#FF8A93' });
          if (S.t < 4) G.disp(c, 'Trascina la lama sulla mola →', 640, 130, { size: 40 });
          P.draw(c);
        },
      };
    },
  });

  /* =========================================================
     4. VERSA / PESA / SOTTOVUOTO — tieni premuto, rilascia sul bersaglio
     ========================================================= */
  M.register('pour', {
    name: 'Tieni e rilascia', icon: 'scale', tint: '#D9EFDD',
    blurb: 'Tieni premuto per riempire e rilascia quando arrivi al valore giusto.',
    howto: [['Tieni', 'premuto (dito, mouse o barra spaziatrice) per versare'], ['Rilascia', 'quando il display segna il valore richiesto'], ['Precisione', 'più sei vicino, più stelle prendi']],
    variants: {
      bilancia: { label: 'Pesa giusto', unit: 'g', rounds: [{ t: 250, tol: [4, 12, 25] }, { t: 480, tol: [5, 14, 30] }, { t: 125, tol: [3, 9, 20] }], rate: 210, item: 'farina', scene: 'scale', brief: 'Versa sulla bilancia esattamente i grammi richiesti!' },
      bricco: { label: 'Versa nel bricco', unit: 'cl', rounds: [{ t: 40, tol: [2, 5, 9] }, { t: 75, tol: [2, 5, 9] }, { t: 20, tol: [1, 3, 6] }], rate: 34, item: 'succo', scene: 'jug', brief: 'Riempi il bricco fino alla tacca giusta.' },
      sottovuoto: { label: 'Sottovuoto', unit: '%', rounds: [{ t: 85, tol: [2, 5, 9] }, { t: 92, tol: [1.5, 4, 7] }, { t: 78, tol: [2, 5, 9] }], rate: 32, item: 'aria', scene: 'vac', brief: 'Aspira l\'aria fino alla pressione giusta, poi rilascia per sigillare.' },
      ghiaccio: { label: 'Fabbricatore di ghiaccio', unit: 'kg', rounds: [{ t: 5, tol: [0.3, 0.8, 1.6] }, { t: 8, tol: [0.3, 0.8, 1.6] }, { t: 3, tol: [0.2, 0.6, 1.2] }], rate: 2.2, item: 'ghiaccio', scene: 'scale', brief: 'Riempi la vaschetta con i kg di ghiaccio giusti.' },
      olio: { label: 'Olio a filo', unit: 'cl', rounds: [{ t: 30, tol: [1.5, 4, 8] }, { t: 55, tol: [2, 5, 9] }, { t: 15, tol: [1, 3, 6] }], rate: 28, item: 'olio', scene: 'jug', brief: 'Un filo d\'olio… ma non uno di più!' },
    },
    create(api, v) {
      const P = G.Particles();
      const rounds = v.rounds.map((r) => Object.assign({}, r, { rate: v.rate }));
      const S = { i: 0, val: 0, hold: false, phase: 'play', t: 0, res: [], score: 0, phaseT: 0, cur: null, vol: 0, shake: 0 };
      const col = { farina: '#F7F0DC', succo: '#FF9E1F', aria: '#BFE0F5', ghiaccio: '#CFEFFF', olio: '#E8C63A' }[v.item] || '#fff';
      function setHold(h) {
        if (S.phase !== 'play') { if (S.phase === 'done' && S.phaseT > 0.9) nextRound(); return; }
        if (h && !S.hold) S.hold = true;
        if (!h && S.hold) { S.hold = false; if (S.val > 0) release(); }
      }
      function release() {
        const r = rounds[S.i], diff = Math.abs(S.val - r.t);
        let st = diff <= r.tol[0] ? 3 : diff <= r.tol[1] ? 2 : diff <= r.tol[2] ? 1 : 0;
        S.res.push(st); S.score += Math.round(Math.max(0, 200 - diff / r.t * 600)); S.phase = 'done'; S.phaseT = 0;
        S.msg = st === 3 ? 'PERFETTO!' : st === 2 ? 'Quasi!' : st === 1 ? 'Ci siamo vicini' : (S.val > r.t ? 'Troppo!' : 'Troppo poco!');
        api.sfx(st > 0 ? 'cash' : 'bad'); if (st > 0) P.burst(640, 360, 26, { col: ['#FFE58A', '#fff'], speed: 380 });
        api.hud('punti', S.score);
      }
      function nextRound() {
        if (S.i + 1 < rounds.length) { S.i++; S.val = 0; S.phase = 'play'; S.vol = 0; }
        else { const avg = S.res.reduce((a, b) => a + b, 0) / S.res.length; api.finish({ stars: avg >= 2.5 ? 3 : avg >= 1.6 ? 2 : avg >= 0.6 ? 1 : 0, score: S.score, detail: `Precisione media: ${avg.toFixed(1)} / 3` }); }
      }
      api.hud('punti', 0);
      let tick = 0;
      return {
        down() { setHold(true); }, up() { setHold(false); },
        key(k, dn) { if (k === ' ' || k === 'Enter' || k === 'ArrowDown') setHold(dn); },
        update(dt) {
          S.t += dt; S.phaseT += dt; P.update(dt);
          api.hud('prova', `${S.i + 1}/${rounds.length}`);
          if (S.phase === 'play' && S.hold) {
            const r = rounds[S.i]; const acc = 0.4 + Math.min(1, S.t * 0.2) * 0.6;
            S.val += r.rate * dt * (0.75 + 0.25 * Math.sin(S.t * 3.1)) * (S.val < r.t * 0.6 ? 1.3 : 0.8);
            tick += dt; if (tick > 0.09) { tick = 0; api.sfx(v.item === 'succo' || v.item === 'olio' ? 'splash' : 'tick'); }
            if (Math.random() < 0.7) P.burst(640 + (Math.random() - 0.5) * 20, 210, 1, { col, speed: 80, angle: 1.57, spread: 0.3, life: 0.5, size: 6, g: 900 });
          }
          if (S.val > rounds[S.i].t * 2.2 && S.phase === 'play') { S.hold = false; release(); }
        },
        draw(c) {
          const r = rounds[S.i];
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#D9EFDD'], [1, '#A9D6B6']]); c.fillRect(0, 0, 1280, 720);
          c.fillStyle = 'rgba(255,255,255,.5)'; for (let x = 0; x < 1280; x += 80) c.fillRect(x, 0, 2, 480);
          c.fillStyle = G.steel(c, 0, 560, 0, 720); c.fillRect(0, 560, 1280, 160); c.fillStyle = NAVY; c.fillRect(0, 552, 1280, 10);
          // erogatore
          G.box(c, 580, 60, 120, 120, 18, G.steel(c, 580, 60, 700, 180), 5); G.box(c, 620, 170, 40, 48, 8, '#8E9BAB', 5);
          // scena
          const fill = BQ.clamp(S.val / (r.t * 1.6), 0, 1);
          if (v.scene === 'jug') {
            G.shadow(c, 640, 560, 150, 18, 0.3);
            c.save(); c.beginPath(); c.moveTo(540, 250); c.lineTo(740, 250); c.lineTo(720, 550); c.lineTo(560, 550); c.closePath(); c.fillStyle = 'rgba(255,255,255,.55)'; c.fill(); c.clip();
            c.fillStyle = col; c.fillRect(520, 550 - 300 * fill, 240, 300 * fill + 4); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(520, 550 - 300 * fill, 240, 8); c.restore();
            c.beginPath(); c.moveTo(540, 250); c.lineTo(740, 250); c.lineTo(720, 550); c.lineTo(560, 550); c.closePath(); c.lineWidth = 6; c.strokeStyle = NAVY; c.stroke();
            const ty = 550 - 300 * (r.t / (r.t * 1.6)); // tacca bersaglio
            c.strokeStyle = '#E11D2E'; c.lineWidth = 6; c.setLineDash([14, 8]); c.beginPath(); c.moveTo(500, ty); c.lineTo(780, ty); c.stroke(); c.setLineDash([]);
            G.disp(c, 'TACCA', 870, ty, { size: 36, color: '#fff' });
          } else if (v.scene === 'vac') {
            G.shadow(c, 640, 560, 260, 20, 0.3);
            G.box(c, 420, 340, 440, 200, 26, G.steel(c, 420, 340, 860, 540), 6);             G.box(c, 400, 290, 480, 80, 30, G.lin(c, 0, 290, 0, 370, [[0, '#1F3A7A'], [1, '#0A1B3F']]), 6);
            // busta che si stringe
            const sq = 1 - fill * 0.5; G.box(c, 500, 390, 280, 120, 30, '#F4F2EC', 5); c.save(); c.translate(640, 450); c.scale(1, sq); G.ell(c, 0, 0, 100, 40, '#E58580', 5); c.restore();
            // manometro
            G.circ(c, 950, 360, 110, '#fff', 6);
            for (let i = 0; i <= 10; i++) { const a = Math.PI * 0.8 + i * (Math.PI * 1.4) / 10; c.strokeStyle = NAVY; c.lineWidth = 4; c.beginPath(); c.moveTo(950 + Math.cos(a) * 88, 360 + Math.sin(a) * 88); c.lineTo(950 + Math.cos(a) * 100, 360 + Math.sin(a) * 100); c.stroke(); }
            const ta = Math.PI * 0.8 + (r.t / 100) * Math.PI * 1.4; c.strokeStyle = '#3FA06A'; c.lineWidth = 16; c.beginPath(); c.arc(950, 360, 70, ta - 0.1, ta + 0.1); c.stroke();
            const na = Math.PI * 0.8 + BQ.clamp(S.val / 100, 0, 1.05) * Math.PI * 1.4; c.strokeStyle = '#E11D2E'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(950, 360); c.lineTo(950 + Math.cos(na) * 84, 360 + Math.sin(na) * 84); c.stroke(); G.circ(c, 950, 360, 12, NAVY, 0);
          } else {
            G.shadow(c, 640, 560, 240, 20, 0.3);
            G.box(c, 430, 500, 420, 54, 14, G.steel(c, 430, 500, 850, 554), 6);
            G.box(c, 560, 360, 160, 150, 20, '#F4F2EC', 5);
            c.save(); c.beginPath(); c.rect(560, 360, 160, 150); c.clip(); c.fillStyle = col; c.fillRect(560, 510 - 150 * fill, 160, 150 * fill + 4); c.restore(); c.strokeStyle = NAVY; c.lineWidth = 5; G.rr(c, 560, 360, 160, 150, 20); c.stroke();
            // piccolo display bilancia
            G.box(c, 920, 380, 230, 160, 18, G.lin(c, 0, 380, 0, 540, [[0, '#1F3A7A'], [1, '#0A1B3F']]), 6);
          }
          // display valore e bersaglio
          G.lcd(c, 920, 150, 320, 92, (v.unit === 'kg' ? S.val.toFixed(1) : Math.round(S.val)) + ' ' + v.unit, 54);
          G.box(c, 40, 40, 400, 96, 22, '#fff', 5);
          G.text(c, 'OBIETTIVO', 240, 66, { size: 20, color: '#E11D2E', stroke: false });
          G.disp(c, r.t + ' ' + v.unit, 240, 108, { size: 50, color: NAVY, stroke: false });
          if (S.phase === 'done') { G.disp(c, S.msg, 640, 380, { size: 72, color: '#FFE58A' }); if (S.phaseT > 0.9) { c.globalAlpha = 0.6 + Math.sin(S.t * 6) * 0.4; G.disp(c, 'Tocca per continuare', 640, 640, { size: 38 }); c.globalAlpha = 1; } }
          else if (S.val === 0) { c.globalAlpha = 0.6 + Math.sin(S.t * 5) * 0.4; G.disp(c, 'TIENI PREMUTO', 640, 640, { size: 48 }); c.globalAlpha = 1; }
          P.draw(c);
        },
      };
    },
  });

  /* =========================================================
     5. TARATURA — ferma la lancetta
     ========================================================= */
  M.register('needle', {
    name: 'Ferma la lancetta', icon: 'scale', tint: '#D9EFDD',
    blurb: 'Tocca al momento giusto per fermare la lancetta nella zona verde.',
    howto: [['Tocca', 'lo schermo (o premi spazio) per fermare la lancetta'], ['Zona verde', 'più è piccola, più punti fai'], ['Tre tentativi', 'ogni giro è più veloce']],
    variants: {
      taratura: { label: 'Taratura bilancia', dial: 'Kg', min: 0, max: 12, labels: [0, 2, 4, 6, 8, 10, 12], unit: 'kg' },
      sigillo: { label: 'Barra saldante', dial: 'sec', min: 0, max: 10, labels: [0, 2, 4, 6, 8, 10], unit: 's', brief: 'Fermati al momento giusto per sigillare la busta senza bruciarla.' },
      temperatura: { label: 'Temperatura del forno', dial: '°C', min: 100, max: 300, labels: [100, 150, 200, 250, 300], unit: '°C', brief: 'Ferma la lancetta sulla temperatura di cottura!' },
      cottura: { label: 'Cottura al punto', dial: 'min', min: 0, max: 20, labels: [0, 5, 10, 15, 20], unit: 'min', brief: 'Tira giù dal fuoco al minuto giusto!' },
    },
    create(api, v) {
      const P = G.Particles();
      const rounds = 4, S = { i: 0, pos: 0, dir: 1, sp: 0.8, stop: false, res: [], phase: 'run', t: 0, pt: 0, tgt: 0, w: 0.16, score: 0, msg: '' };
      function nextTarget() { const r = api.rng; S.tgt = 0.18 + r() * 0.64; S.w = 0.17 - S.i * 0.028; S.sp = 0.85 + S.i * 0.35; S.pos = r() < 0.5 ? 0 : 1; S.dir = S.pos === 0 ? 1 : -1; S.phase = 'run'; }
      nextTarget(); api.hud('giro', `1/${rounds}`);
      function hit() {
        if (S.phase !== 'run') { if (S.phase === 'res' && S.pt > 0.8) next(); return; }
        const d = Math.abs(S.pos - S.tgt); S.phase = 'res'; S.pt = 0;
        const st = d <= S.w * 0.22 ? 3 : d <= S.w * 0.55 ? 2 : d <= S.w ? 1 : 0;
        S.res.push(st); S.score += st * 100 + Math.round((1 - Math.min(1, d)) * 50);
        S.msg = st === 3 ? 'CENTRO!' : st === 2 ? 'Ottimo' : st === 1 ? 'Nella zona' : 'Fuori!';
        api.sfx(st ? 'ding' : 'bad'); if (st) P.burst(640, 380, 20, { col: ['#8EF08E', '#fff', '#FFE58A'], speed: 360 }); api.hud('punti', S.score);
      }
      function next() { if (S.i + 1 < rounds) { S.i++; nextTarget(); api.hud('giro', `${S.i + 1}/${rounds}`); } else { const a = S.res.reduce((x, y) => x + y, 0) / S.res.length; api.finish({ stars: a >= 2.4 ? 3 : a >= 1.5 ? 2 : a >= 0.7 ? 1 : 0, score: S.score, detail: `Precisione ${a.toFixed(1)} / 3` }); } }
      api.hud('punti', 0);
      return {
        down() { hit(); }, key(k, dn) { if (dn && (k === ' ' || k === 'Enter')) hit(); },
        update(dt) {
          S.t += dt; S.pt += dt; P.update(dt);
          if (S.phase === 'run') { S.pos += S.dir * S.sp * dt; if (S.pos > 1) { S.pos = 1; S.dir = -1; } if (S.pos < 0) { S.pos = 0; S.dir = 1; } }
        },
        draw(c) {
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#D9EFDD'], [1, '#9BCBAA']]); c.fillRect(0, 0, 1280, 720);
          const cx = 640, cy = 540, R = 380, a0 = Math.PI * 1.08, a1 = Math.PI * 1.92;
          G.shadow(c, cx, 650, 320, 22, 0.25);
          G.box(c, cx - 440, 380, 880, 280, 60, G.steel(c, 0, 380, 0, 660), 6);
          c.save(); c.beginPath(); c.arc(cx, cy, R, Math.PI, 0); c.lineTo(cx + R, cy); c.lineTo(cx - R, cy); c.closePath(); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 7; c.strokeStyle = NAVY; c.stroke(); c.restore();
          const ang = (p) => a0 + p * (a1 - a0);
          // zona verde
          c.lineWidth = 50; c.lineCap = 'butt'; c.strokeStyle = 'rgba(63,160,106,.75)'; c.beginPath(); c.arc(cx, cy, R - 60, ang(S.tgt - S.w), ang(S.tgt + S.w)); c.stroke();
          c.strokeStyle = 'rgba(242,195,64,.9)'; c.lineWidth = 50; c.beginPath(); c.arc(cx, cy, R - 60, ang(S.tgt - S.w * 0.22), ang(S.tgt + S.w * 0.22)); c.stroke();
          // tacche
          for (let i = 0; i <= 40; i++) { const a = ang(i / 40), big = i % 5 === 0; c.strokeStyle = NAVY; c.lineWidth = big ? 5 : 2.5; c.beginPath(); c.moveTo(cx + Math.cos(a) * (R - 20), cy + Math.sin(a) * (R - 20)); c.lineTo(cx + Math.cos(a) * (R - (big ? 50 : 36)), cy + Math.sin(a) * (R - (big ? 50 : 36))); c.stroke(); }
          v.labels.forEach((l, i) => { const a = ang(i / (v.labels.length - 1)); G.text(c, String(l), cx + Math.cos(a) * (R - 100), cy + Math.sin(a) * (R - 100), { size: 30, color: NAVY, stroke: false }); });
          G.disp(c, v.dial, cx, cy - 120, { size: 44, color: '#E11D2E', stroke: false });
          const a = ang(S.pos); c.strokeStyle = NAVY; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * (R - 40), cy + Math.sin(a) * (R - 40)); c.stroke();
          c.strokeStyle = '#E11D2E'; c.lineWidth = 7; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * (R - 44), cy + Math.sin(a) * (R - 44)); c.stroke(); G.circ(c, cx, cy, 24, NAVY, 0); G.circ(c, cx, cy, 10, '#fff', 0);
          const val = v.min + (v.max - v.min) * S.pos; G.lcd(c, 500, 590, 280, 70, (v.unit === 'kg' || v.unit === 's' ? val.toFixed(1) : Math.round(val)) + ' ' + v.unit, 42);
          if (S.phase === 'res') { G.disp(c, S.msg, 640, 200, { size: 80, color: '#FFE58A' }); if (S.pt > 0.8) { c.globalAlpha = 0.6 + Math.sin(S.t * 6) * 0.4; G.disp(c, 'Tocca per continuare', 640, 280, { size: 36 }); c.globalAlpha = 1; } }
          else { c.globalAlpha = 0.5 + Math.sin(S.t * 5) * 0.4; G.disp(c, 'TOCCA PER FERMARE', 640, 130, { size: 46 }); c.globalAlpha = 1; }
          P.draw(c);
        },
      };
    },
  });
})();
