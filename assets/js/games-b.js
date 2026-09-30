/* =========================================================
   MINIGIOCHI B — taglia al volo, resto, scontrino, memoria, peso falso
   ========================================================= */
(function () {
  'use strict';
  const BQ = window.BQ, G = BQ.g, A = BQ.art, M = BQ.mini;
  const NAVY = '#0A1B3F', TAU = Math.PI * 2;

  /* =========================================================
     TAGLIA AL VOLO (frutta ninja)
     ========================================================= */
  const SETS = {
    frutta: [
      { n: 'mela', o: '#E11D2E', i: '#FFF3C4', r: 46, seeds: 1, leaf: 1 }, { n: 'arancia', o: '#FF8A1E', i: '#FFC35C', r: 50, seg: 1 }, { n: 'limone', o: '#F2D84A', i: '#FFF6B0', r: 44, oval: 1, seg: 1 },
      { n: 'kiwi', o: '#8C6B3A', i: '#8FD14F', r: 44, seeds: 2 }, { n: 'anguria', o: '#3FA06A', i: '#FF5A6A', r: 62, seeds: 3, stripes: 1 },
    ],
    verdure: [
      { n: 'pomodoro', o: '#E11D2E', i: '#FF8A93', r: 46, seeds: 1, leaf: 1 }, { n: 'zucchina', o: '#3FA06A', i: '#D5F0A5', r: 40, oval: 2 }, { n: 'cipolla', o: '#B44C7A', i: '#F6E3EE', r: 46, rings: 1 },
      { n: 'peperone', o: '#F2B31E', i: '#FFF1BA', r: 48, leaf: 1 }, { n: 'carota', o: '#FF7A1E', i: '#FFB46A', r: 38, oval: 2 },
    ],
    ghiaccio: [{ n: 'cubetto', o: '#9ED8F5', i: '#E6F7FF', r: 48, cube: 1 }, { n: 'cubetto', o: '#B6E3FA', i: '#F2FBFF', r: 42, cube: 1 }, { n: 'scaglia', o: '#8CCBEB', i: '#DFF4FF', r: 52, cube: 1 }],
    salumi: [{ n: 'salame', o: '#B94A3F', i: '#E58580', r: 48, dots: 1 }, { n: 'formaggio', o: '#E9B93C', i: '#FFE793', r: 54, holes: 1 }, { n: 'mortadella', o: '#E8A7A3', i: '#F8D5D2', r: 52, cubes: 1 }, { n: 'prosciutto', o: '#8E2F2B', i: '#E58580', r: 52, seeds: 0 }],
  };
  function drawItem(c, t, x, y, r, rot, half, cutA, side) {
    c.save(); c.translate(x, y); c.rotate(rot);
    const rx = t.oval === 2 ? r * 0.55 : r, ry = t.oval === 2 ? r * 1.25 : t.oval ? r * 0.85 : r;
    if (half) { c.beginPath(); c.rect(side > 0 ? 0 : -200, -200, 200, 400); c.save(); c.rotate(-rot + cutA); c.restore(); }
    // taglio: clip su semipiano ruotato
    if (half) { c.save(); c.rotate(cutA - rot); c.beginPath(); c.rect(side > 0 ? 0 : -300, -300, 300, 600); c.restore(); c.save(); c.rotate(cutA - rot); c.beginPath(); c.rect(side > 0 ? 0 : -300, -300, 300, 600); c.clip(); c.rotate(rot - cutA); }
    // buccia
    if (t.cube) { G.rr(c, -rx, -ry, rx * 2, ry * 2, 12); c.fillStyle = 'rgba(200,235,255,.9)'; c.fill(); c.lineWidth = 5; c.strokeStyle = NAVY; c.stroke(); c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(-rx + 8, -ry + 8, rx * 0.6, 10); }
    else {
      const g = c.createRadialGradient(-rx * 0.3, -ry * 0.35, 4, 0, 0, Math.max(rx, ry));
      g.addColorStop(0, t.o); g.addColorStop(1, shade(t.o, -0.25));
      c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, TAU); c.fillStyle = g; c.fill(); c.lineWidth = 5; c.strokeStyle = NAVY; c.stroke();
      if (t.stripes) { c.save(); c.clip(); c.strokeStyle = 'rgba(10,27,63,.22)'; c.lineWidth = 6; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(i * 20, -ry); c.quadraticCurveTo(i * 26, 0, i * 20, ry); c.stroke(); } c.restore(); }
      if (!half) { c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(-rx * 0.35, -ry * 0.45, rx * 0.22, ry * 0.12, -0.6, 0, TAU); c.fill(); }
      if (t.leaf && !half) { c.fillStyle = '#3FA06A'; c.beginPath(); c.ellipse(6, -ry - 4, 16, 8, -0.5, 0, TAU); c.fill(); c.lineWidth = 3; c.stroke(); c.strokeStyle = '#6B4A2A'; c.lineWidth = 5; c.beginPath(); c.moveTo(0, -ry + 6); c.lineTo(-2, -ry - 12); c.stroke(); }
    }
    if (half) { // polpa
      if (!t.cube) { c.beginPath(); c.ellipse(0, 0, rx - 7, ry - 7, 0, 0, TAU); c.fillStyle = t.i; c.fill(); }
      else { c.fillStyle = t.i; c.fillRect(-rx + 6, -ry + 6, rx * 2 - 12, ry * 2 - 12); }
      c.strokeStyle = 'rgba(10,27,63,.25)'; c.lineWidth = 3;
      if (t.seg) { for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(i * TAU / 8) * (rx - 10), Math.sin(i * TAU / 8) * (ry - 10)); c.stroke(); } }
      if (t.rings) { for (const k of [0.3, 0.55, 0.8]) { c.beginPath(); c.ellipse(0, 0, rx * k, ry * k, 0, 0, TAU); c.stroke(); } }
      if (t.seeds) { c.fillStyle = '#2a1a12'; for (let i = 0; i < 6 + t.seeds * 3; i++) { const a = i * 2.4, d = (t.seeds === 2 ? 0.2 : 0.4) + (i % 3) * 0.12; c.beginPath(); c.ellipse(Math.cos(a) * rx * d, Math.sin(a) * ry * d, 3, 5, a, 0, TAU); c.fill(); } }
      if (t.dots) { c.fillStyle = '#F4E3D8'; for (let i = 0; i < 12; i++) { c.beginPath(); c.arc(Math.cos(i * 2.3) * rx * 0.6 * ((i % 3 + 1) / 3), Math.sin(i * 2.3) * ry * 0.6 * ((i % 3 + 1) / 3), 4, 0, TAU); c.fill(); } }
      if (t.holes) { c.fillStyle = '#E0A724'; for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(Math.cos(i * 2.5) * rx * 0.5, Math.sin(i * 2.5) * ry * 0.5, 6 + (i % 2) * 4, 0, TAU); c.fill(); } }
      if (t.cubes) { c.fillStyle = '#fff'; for (let i = 0; i < 6; i++) c.fillRect(Math.cos(i * 2.2) * rx * 0.5 - 4, Math.sin(i * 2.2) * ry * 0.5 - 4, 9, 9); }
    }
    if (half) c.restore();
    c.restore();
  }
  function shade(hex, k) { const n = parseInt(hex.slice(1), 16); let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; const f = (v) => Math.max(0, Math.min(255, Math.round(v + 255 * k * (k < 0 ? 1 : 1)))); return `rgb(${f(r)},${f(g)},${f(b)})`; }
  function drawBomb(c, x, y, r, rot, t) {
    c.save(); c.translate(x, y); c.rotate(rot);
    G.circ(c, 0, 0, r, G.lin(c, -r, -r, r, r, [[0, '#4A4F66'], [1, '#14161F']]), 5);
    c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(-r * 0.35, -r * 0.4, r * 0.22, r * 0.12, -0.6, 0, TAU); c.fill();
    c.strokeStyle = '#B8A07A'; c.lineWidth = 6; c.beginPath(); c.moveTo(0, -r); c.quadraticCurveTo(10, -r - 18, 22, -r - 14); c.stroke();
    const f = 0.6 + Math.sin(t * 25) * 0.4; G.circ(c, 24, -r - 16, 7 + f * 4, '#FFB13B', 0); G.circ(c, 24, -r - 16, 3, '#fff', 0);
    G.text(c, '✖', 0, 4, { size: r * 0.9, color: '#E11D2E', stroke: false });
    c.restore();
  }

  M.register('ninja', {
    name: 'Taglia al volo', icon: 'juicer', tint: '#FBE2C4',
    blurb: 'Gli ingredienti volano in aria: affettali con un colpo di lama prima che cadano!',
    howto: [['Taglia', 'striscia col dito (o trascina il mouse) sopra gli ingredienti'], ['Combo', 'più pezzi in un colpo solo = punti extra'], ['Bombe', 'evita quelle nere con la ✖: costano una vita!']],
    variants: {
      frutta: { label: 'Centrifuga: frutta', set: 'frutta', goal: 22, time: 45, brief: 'Prepara la spremuta: affetta la frutta per la centrifuga!' },
      verdure: { label: 'Tagliaverdure', set: 'verdure', goal: 22, time: 45, brief: 'Affetta le verdure per il minestrone!' },
      ghiaccio: { label: 'Tritaghiaccio', set: 'ghiaccio', goal: 24, time: 40, brief: 'Spezza tutto il ghiaccio per i cocktail!' },
      salumi: { label: 'Salumi volanti', set: 'salumi', goal: 20, time: 45, brief: 'Salumi e formaggi in volo: taglia tutto!' },
    },
    create(api, v) {
      const set = SETS[v.set] || SETS.frutta, rng = api.rng, P = G.Particles();
      const S = { items: [], halves: [], trail: [], score: 0, cut: 0, lives: 3, t: 0, spawn: 0.4, combo: 0, comboT: 0, msg: '', msgT: 0, down: false, swipeHits: 0 };
      api.hud('tagliati', `0/${v.goal}`); api.hud('vite', '♥♥♥'); api.hud('tempo', v.time);
      function launch() {
        const bomb = rng() < 0.14 + Math.min(0.08, S.t / 400);
        const t = set[Math.floor(rng() * set.length)];
        const x = 180 + rng() * 920, dir = x < 640 ? 1 : -1;
        S.items.push({ t, bomb, x, y: 760, vx: dir * (40 + rng() * 210), vy: -(820 + rng() * 260), rot: 0, vr: (rng() - 0.5) * 6, r: bomb ? 42 : t.r, id: Math.random() });
      }
      function sliceItem(it, ang) {
        if (it.bomb) { S.lives--; api.sfx('zap'); api.vib(120); P.burst(it.x, it.y, 30, { col: ['#FFB13B', '#E11D2E', '#555'], speed: 520, life: 0.8 }); S.msg = 'BOOM! -1 vita'; S.msgT = 1; S.combo = 0; api.hud('vite', '♥'.repeat(Math.max(0, S.lives)) + '♡'.repeat(3 - Math.max(0, S.lives)), 'bad'); it.dead = true; if (S.lives <= 0) finish(true); return; }
        it.dead = true; S.cut++; S.swipeHits++;
        const pts = 10 + Math.min(S.combo, 6) * 2; S.score += pts; S.combo++; S.comboT = 0.7;
        S.halves.push({ t: it.t, x: it.x, y: it.y, vx: it.vx - 120, vy: it.vy - 60, rot: it.rot, vr: -2 - rng() * 3, r: it.r, a: ang, side: 1, life: 0 }, { t: it.t, x: it.x, y: it.y, vx: it.vx + 120, vy: it.vy - 60, rot: it.rot, vr: 2 + rng() * 3, r: it.r, a: ang, side: -1, life: 0 });
        P.burst(it.x, it.y, 14, { col: [it.t.i, it.t.o, '#fff'], speed: 380, life: 0.6, size: 7 }); P.text(it.x, it.y - 30, '+' + pts, '#FFE58A', 40);
        api.sfx(v.set === 'ghiaccio' ? 'spark' : 'slice', 0.9); api.vib(8);
        api.hud('tagliati', `${S.cut}/${v.goal}`);
      }
      function finish(dead) {
        const st = dead ? (S.cut >= v.goal * 0.5 ? 1 : 0) : (S.cut >= v.goal * 1.5 ? 3 : S.cut >= v.goal ? 2 : S.cut >= v.goal * 0.6 ? 1 : 0);
        api.finish({ stars: st, score: S.score, detail: `${S.cut} pezzi tagliati${dead ? ' — troppe bombe!' : ''}`, title: dead ? 'Ahi, le bombe!' : undefined });
      }
      let prev = null;
      return {
        down(x, y) { S.down = true; prev = { x, y }; S.trail = [{ x, y, t: S.t }]; S.swipeHits = 0; },
        move(x, y) {
          if (!S.down) return; S.trail.push({ x, y, t: S.t }); if (S.trail.length > 12) S.trail.shift();
          const p = prev || { x, y }; const dx = x - p.x, dy = y - p.y, L = Math.hypot(dx, dy);
          if (L > 8) {
            for (const it of S.items) {
              if (it.dead) continue;
              const t = BQ.clamp(((it.x - p.x) * dx + (it.y - p.y) * dy) / (L * L), 0, 1), cx = p.x + dx * t, cy = p.y + dy * t;
              if (Math.hypot(it.x - cx, it.y - cy) < it.r + 6) sliceItem(it, Math.atan2(dy, dx));
            }
            prev = { x, y };
          }
        },
        up() { S.down = false; prev = null; if (S.swipeHits >= 3) { const b = S.swipeHits * 10; S.score += b; S.msg = `COMBO x${S.swipeHits}! +${b}`; S.msgT = 1; api.sfx('ding'); } },
        update(dt) {
          S.t += dt; P.update(dt); if (S.msgT > 0) S.msgT -= dt; if (S.comboT > 0) { S.comboT -= dt; if (S.comboT <= 0) S.combo = 0; }
          S.spawn -= dt; if (S.spawn <= 0) { const n = rng() < 0.3 ? 2 + (rng() < 0.3 ? 1 : 0) : 1; for (let i = 0; i < n; i++) launch(); S.spawn = 0.55 + rng() * 0.6 - Math.min(0.25, S.t / 120); }
          for (const it of S.items) { it.vy += 1250 * dt; it.x += it.vx * dt; it.y += it.vy * dt; it.rot += it.vr * dt; }
          S.items = S.items.filter((it) => !it.dead && it.y < 820);
          for (const h of S.halves) { h.vy += 1250 * dt; h.x += h.vx * dt; h.y += h.vy * dt; h.rot += h.vr * dt; h.life += dt; }
          S.halves = S.halves.filter((h) => h.y < 820);
          S.trail = S.trail.filter((p) => S.t - p.t < 0.22);
          api.hud('tempo', Math.max(0, Math.ceil(v.time - S.t)), v.time - S.t < 8 ? 'bad' : '');
          if (S.t >= v.time) finish(false);
        },
        draw(c) {
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#FFE2B8'], [1, '#F6B97A']]); c.fillRect(0, 0, 1280, 720);
          c.fillStyle = 'rgba(255,255,255,.35)'; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(80 + i * 150, 620, 110, Math.PI, 0); c.fill(); }
          c.fillStyle = '#8A5A34'; c.fillRect(0, 640, 1280, 80); c.fillStyle = '#6B4020'; c.fillRect(0, 640, 1280, 10);
          for (const h of S.halves) drawItem(c, h.t, h.x, h.y, h.r, h.rot, true, h.a, h.side);
          for (const it of S.items) { if (it.bomb) drawBomb(c, it.x, it.y, it.r, it.rot, S.t); else drawItem(c, it.t, it.x, it.y, it.r, it.rot); }
          // scia lama
          if (S.trail.length > 1) { c.lineCap = 'round'; for (let i = 1; i < S.trail.length; i++) { const a = S.trail[i - 1], b = S.trail[i], k = i / S.trail.length; c.strokeStyle = `rgba(255,255,255,${k})`; c.lineWidth = 4 + k * 14; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); c.strokeStyle = `rgba(160,200,255,${k * 0.7})`; c.lineWidth = 2 + k * 6; c.stroke(); } }
          P.draw(c);
          if (S.msgT > 0) G.disp(c, S.msg, 640, 250, { size: 64, color: '#FFE58A' });
          if (S.t < 3) G.disp(c, 'STRISCIA PER TAGLIARE!', 640, 130, { size: 52 });
          G.box(c, 480, 18, 320, 26, 13, '#fff', 4); G.box(c, 484, 22, Math.max(0, 312 * BQ.clamp(S.cut / v.goal, 0, 1)), 18, 9, '#3FA06A', 0);
        },
      };
    },
  });

  /* =========================================================
     RESTO — registratore di cassa
     ========================================================= */
  const DEN = [[5, '5c', 'c'], [10, '10c', 'c'], [20, '20c', 'c'], [50, '50c', 'c'], [100, '1€', 'c2'], [200, '2€', 'c2'], [500, '5€', 'b'], [1000, '10€', 'b'], [2000, '20€', 'b']];
  M.register('change', {
    name: 'Dai il resto', icon: 'register', tint: '#CFE0F5',
    blurb: 'Il cliente paga: calcola il resto e componilo con monete e banconote, in fretta!',
    howto: [['Tocca', 'le monete e le banconote per comporre il resto'], ['Conferma', 'premi CONSEGNA (o Invio) quando il totale è giusto'], ['Correggi', 'con ANNULLA puoi ricominciare']],
    variants: {
      cassa: { label: 'Alla cassa', customers: 5, time: 28, maxPrice: 1800, pay: [1000, 2000, 500] },
      cassetto: { label: 'Cassetto rendiresto', customers: 6, time: 24, maxPrice: 1200, pay: [500, 1000, 2000] },
      fiscale: { label: 'Turno fiscale', customers: 7, time: 22, maxPrice: 2600, pay: [2000, 5000 / 1, 1000], hard: 1 },
    },
    create(api, v) {
      const rng = api.rng, P = G.Particles();
      const S = { i: 0, tray: [], price: 0, given: 0, t: 0, score: 0, ok: 0, phase: 'play', phaseT: 0, msg: '', custImg: null, cash: 0 };
      const dens = DEN.filter((d) => d[0] <= (v.hard ? 2000 : 1000) || true);
      function newCustomer() {
        S.tray = []; S.t = 0; S.phase = 'play';
        const max = v.maxPrice, pay = v.pay[Math.floor(rng() * v.pay.length)];
        let price = Math.round((100 + rng() * (max - 100)) / 5) * 5; if (price >= pay) price = pay - 5 - Math.round(rng() * 10) * 5; if (price < 30) price = 35;
        S.price = price; S.given = pay; S.custImg = G.svgImg(A.customer(40 + S.i * 7 + (api.seed % 30), { mood: 'neutral' }), 200, 230);
        api.hud('cliente', `${S.i + 1}/${v.customers}`);
      }
      newCustomer(); api.hud('punti', 0);
      const sum = () => S.tray.reduce((a, b) => a + b, 0);
      const due = () => S.given - S.price;
      const btnY = 560, bw = 130, bx0 = 50;
      const slotRect = (i) => [bx0 + i * (bw + 8), btnY, bw, 120];
      const inR = (r, x, y) => x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3];
      const B_DELIVER = [930, 410, 300, 80], B_CLEAR = [930, 500, 300, 50];
      function deliver() {
        if (S.phase !== 'play') return;
        const ok = sum() === due();
        S.phase = 'res'; S.phaseT = 0;
        if (ok) { S.ok++; const b = Math.round(Math.max(0, (v.time - S.t)) * 3); S.score += 100 + b; S.msg = 'Resto esatto!'; api.sfx('cash'); P.burst(1000, 300, 26, { col: ['#FFE58A', '#fff'], speed: 400 }); }
        else { S.msg = sum() > due() ? `Troppo! Era ${BQ.eur(due())}` : `Poco! Era ${BQ.eur(due())}`; api.sfx('bad'); }
        S.custImg = G.svgImg(A.customer(40 + S.i * 7 + (api.seed % 30), { mood: ok ? 'happy' : 'angry' }), 200, 230);
        api.hud('punti', S.score);
      }
      function advance() {
        if (S.i + 1 < v.customers) { S.i++; newCustomer(); } else {
          const ratio = S.ok / v.customers; api.finish({ stars: ratio >= 0.99 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.4 ? 1 : 0, score: S.score, detail: `${S.ok} resti giusti su ${v.customers}` });
        }
      }
      return {
        down(x, y) {
          if (S.phase === 'res') { if (S.phaseT > 0.7) advance(); return; }
          dens.forEach((d, i) => { if (inR(slotRect(i), x, y)) { if (S.tray.length < 30) { S.tray.push(d[0]); api.sfx(d[2] === 'b' ? 'page' : 'coin'); api.vib(6); } } });
          if (inR(B_DELIVER, x, y)) deliver();
          if (inR(B_CLEAR, x, y)) { S.tray = []; api.sfx('click'); }
        },
        key(k, dn) { if (!dn) return; if (k === 'Enter') { if (S.phase === 'res') { if (S.phaseT > 0.7) advance(); } else deliver(); } else if (k === 'Backspace' || k === 'Escape') S.tray = []; },
        update(dt) {
          S.t += dt; S.phaseT += dt; P.update(dt);
          if (S.phase === 'play') { const left = v.time - S.t; api.hud('tempo', Math.max(0, Math.ceil(left)), left < 8 ? 'bad' : ''); if (left <= 0) { S.tray = []; S.phase = 'res'; S.phaseT = 0; S.msg = 'Troppo lento!'; api.sfx('bad'); } }
        },
        draw(c) {
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#CFE0F5'], [1, '#9DB9E6']]); c.fillRect(0, 0, 1280, 720);
          c.fillStyle = 'rgba(255,255,255,.4)'; for (let x = 0; x < 1280; x += 90) c.fillRect(x, 0, 3, 380);
          // cliente
          G.box(c, 40, 30, 210, 214, 22, '#fff', 5); if (S.custImg) G.drawImgFit(c, S.custImg, 40, 30, 210, 214);
          G.box(c, 270, 44, 470, 150, 26, '#fff', 5);
          G.text(c, 'CONTO', 300, 78, { size: 22, align: 'left', color: '#E11D2E', stroke: false });
          G.disp(c, BQ.eur(S.price), 300, 122, { size: 54, align: 'left', color: NAVY, stroke: false });
          G.text(c, 'PAGA CON', 560, 78, { size: 22, align: 'left', color: '#E11D2E', stroke: false });
          G.disp(c, BQ.eur(S.given), 560, 122, { size: 54, align: 'left', color: '#3FA06A', stroke: false });
          G.text(c, 'Quanto è il resto?', 300, 168, { size: 26, align: 'left', color: '#3a4a6b', stroke: false });
          // tempo
          const tl = BQ.clamp(1 - S.t / v.time, 0, 1); G.box(c, 270, 206, 470, 20, 10, '#fff', 4); G.box(c, 273, 209, Math.max(0, 464 * tl), 14, 7, tl < 0.3 ? '#E11D2E' : '#3FA06A', 0);
          // registratore grande
          c.save(); c.translate(840, 40); c.scale(1.4, 1.4); G.drawImgFit(c, G.svgImg(A.sprite('register', { txt: BQ.eur(sum()).replace('€ ', '') }), 200, 200), 0, 0, 200, 200); c.restore();
          // vassoio del resto
          G.box(c, 40, 280, 850, 250, 26, '#fff', 5);
          G.text(c, 'RESTO', 70, 312, { size: 22, align: 'left', color: '#E11D2E', stroke: false });
          G.lcd(c, 690, 292, 180, 52, BQ.eur(sum()).replace('€ ', '') + ' €', 34);
          let px = 76, py = 420, row = 0;
          S.tray.forEach((d, i) => { const info = DEN.find((q) => q[0] === d); drawMoney(c, info, px, py + row * 0, 1); px += info[2] === 'b' ? 96 : 54; if (px > 840) { px = 76; py += 60; } });
          // pulsanti denominazioni
          dens.forEach((d, i) => { const r = slotRect(i); G.box(c, r[0], r[1], r[2], r[3], 18, '#fff', 5); drawMoney(c, d, r[0] + r[2] / 2 - (d[2] === 'b' ? 40 : 22), r[1] + 50, 1.3, true); });
          // CONSEGNA / ANNULLA
          const dis = S.phase !== 'play'; c.globalAlpha = dis ? 0.5 : 1;
          G.box(c, ...B_DELIVER, 20, '#3FA06A', 6); G.disp(c, 'CONSEGNA', 1080, 450, { size: 44 }); G.box(c, ...B_CLEAR, 14, '#FFE58A', 5); G.disp(c, 'ANNULLA', 1080, 526, { size: 30, color: NAVY, stroke: false }); c.globalAlpha = 1;
          if (S.phase === 'res') { G.disp(c, S.msg, 640, 360, { size: 70, color: S.msg.includes('esatto') ? '#8EF08E' : '#FF8A93' }); if (S.phaseT > 0.7) { c.globalAlpha = 0.6 + Math.sin(S.t * 6) * 0.4; G.disp(c, 'Tocca per continuare', 640, 470, { size: 36 }); c.globalAlpha = 1; } }
          P.draw(c);
        },
      };
    },
  });
  function drawMoney(c, d, x, y, k, lbl) {
    c.save(); c.translate(x, y); c.scale(k || 1, k || 1);
    if (d[2] === 'b') {
      G.box(c, 0, -22, 80, 44, 6, d[0] === 500 ? '#9FCFA8' : d[0] === 1000 ? '#F5B9B9' : '#9DC0F2', 4); G.circ(c, 40, 0, 12, 'rgba(255,255,255,.6)', 2);
      G.disp(c, d[1], 40, 1, { size: 24, color: NAVY, stroke: false });
    } else {
      const gold = d[2] === 'c2' ? d[0] === 100 : d[0] < 100 && d[0] >= 10;
      G.circ(c, 22, 0, 22 + (d[0] >= 100 ? 3 : 0), d[0] >= 100 ? G.lin(c, 0, -24, 44, 24, [[0, '#F5F0E0'], [0.5, '#E7C23A'], [1, '#F5F0E0']]) : (d[0] === 5 ? '#D08B4E' : '#F2C340'), 4);
      G.disp(c, d[1], 22, 1, { size: d[1].length > 2 ? 17 : 20, color: NAVY, stroke: false });
    }
    c.restore();
  }

  /* =========================================================
     SCONTRINO LAMPO — tastierino
     ========================================================= */
  M.register('keypad', {
    name: 'Scontrino lampo', icon: 'register', tint: '#CFE0F5',
    blurb: 'Batti i prezzi sul tastierino più in fretta che puoi!',
    howto: [['Digita', 'il numero richiesto sul tastierino (anche da tastiera)'], ['Virgola', 'usa , o . per i centesimi'], ['Invio', 'conferma: più sei veloce, più punti fai']],
    variants: {
      prezzi: { label: 'Batti i prezzi', mode: 'price', n: 10, time: 60 },
      totale: { label: 'Somma lo scontrino', mode: 'sum', n: 7, time: 70 },
      peso: { label: 'Prezzo al chilo', mode: 'kg', n: 8, time: 70, brief: 'Peso × prezzo al kg: quanto fa? (aiutati col display!)' },
    },
    create(api, v) {
      const rng = api.rng, P = G.Particles();
      const S = { i: 0, buf: '', score: 0, ok: 0, q: null, t: 0, tq: 0, msg: '', msgT: 0, flash: 0 };
      function mk() {
        if (v.mode === 'price') { const cents = (Math.round((50 + rng() * 2450) / 5) * 5); S.q = { text: 'Batti il prezzo', ans: cents, shown: BQ.eur(cents) }; }
        else if (v.mode === 'sum') { const n = 3, arr = []; for (let k = 0; k < n; k++) arr.push(Math.round((80 + rng() * 620) / 10) * 10); S.q = { text: 'Quanto fa il totale?', ans: arr.reduce((a, b) => a + b, 0), list: arr }; }
        else { const kg = [0.5, 1, 1.5, 2, 2.5, 3][Math.floor(rng() * 6)], ppk = [4, 6, 8, 10, 12, 14, 16][Math.floor(rng() * 7)]; S.q = { text: `${kg.toString().replace('.', ',')} kg a ${ppk},00 € al kg`, ans: Math.round(kg * ppk * 100), kg, ppk }; }
        S.buf = ''; S.tq = 0; api.hud('scontrino', `${S.i + 1}/${v.n}`);
      }
      mk(); api.hud('punti', 0);
      const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', 'C', '0', ','];
      const KX = 860, KY = 130, KW = 120, KH = 96, GAP = 10;
      const kr = (i) => [KX + (i % 3) * (KW + GAP), KY + Math.floor(i / 3) * (KH + GAP), KW, KH];
      const OK = [KX, KY + 4 * (KH + GAP), 3 * KW + 2 * GAP, 84];
      const inR = (r, x, y) => x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3];
      function press(k) {
        if (k === 'C') { S.buf = ''; api.sfx('click'); return; }
        if (k === 'OK') return submit();
        if (k === '⌫') { S.buf = S.buf.slice(0, -1); return; }
        if (k === ',') { if (S.buf.includes(',') || S.buf === '') S.buf = S.buf === '' ? '0,' : S.buf; else S.buf += ','; api.sfx('tap'); return; }
        if (S.buf.length < 8) { const p = S.buf.split(',')[1]; if (p && p.length >= 2) return; S.buf += k; api.sfx('tap'); api.vib(5); }
      }
      function parse() { if (!S.buf) return -1; const [a, b] = S.buf.split(','); return parseInt(a || '0', 10) * 100 + (b ? parseInt((b + '0').slice(0, 2), 10) : 0); }
      function submit() {
        const ok = parse() === S.q.ans;
        if (ok) { S.ok++; const b = Math.max(0, Math.round((8 - S.tq) * 10)); S.score += 100 + b; S.msg = '+' + (100 + b); api.sfx('cash'); P.burst(430, 330, 18, { col: ['#FFE58A', '#fff'], speed: 350 }); S.flash = 0.3; } else { S.msg = 'Era ' + BQ.eur(S.q.ans); api.sfx('bad'); }
        S.msgT = 0.9; api.hud('punti', S.score);
        S.i++; if (S.i >= v.n) { finish(); return; } mk();
      }
      function finish() { const r = S.ok / v.n; api.finish({ stars: r >= 0.95 ? 3 : r >= 0.7 ? 2 : r >= 0.4 ? 1 : 0, score: S.score, detail: `${S.ok} su ${v.n} corretti` }); }
      return {
        down(x, y) { keys.forEach((k, i) => { if (inR(kr(i), x, y)) press(k); }); if (inR(OK, x, y)) press('OK'); },
        key(k, dn) { if (!dn) return; if (/^[0-9]$/.test(k)) press(k); else if (k === ',' || k === '.') press(','); else if (k === 'Enter') press('OK'); else if (k === 'Backspace') press('⌫'); },
        update(dt) { S.t += dt; S.tq += dt; P.update(dt); if (S.msgT > 0) S.msgT -= dt; if (S.flash > 0) S.flash -= dt; const left = v.time - S.t; api.hud('tempo', Math.max(0, Math.ceil(left)), left < 10 ? 'bad' : ''); if (left <= 0) finish(); },
        draw(c) {
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#CFE0F5'], [1, '#8FAEE0']]); c.fillRect(0, 0, 1280, 720);
          // scontrino
          c.save(); c.translate(80, 20); c.rotate(-0.02);
          c.beginPath(); c.moveTo(0, 0); c.lineTo(660, 0); c.lineTo(660, 640); for (let i = 0; i < 22; i++) c.lineTo(660 - i * 30 - 15, i % 2 ? 640 : 664); c.lineTo(0, 640); c.closePath(); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 5; c.strokeStyle = NAVY; c.stroke();
          G.text(c, 'BRAMBILLA ANGELO S.R.L.', 330, 40, { size: 26, color: NAVY, stroke: false, font: 'JetBrains Mono, monospace' });
          G.text(c, 'Via Lecco 16 · Agrate Brianza', 330, 70, { size: 18, color: '#657', stroke: false, font: 'JetBrains Mono, monospace' });
          c.setLineDash([8, 6]); c.strokeStyle = '#99a'; c.lineWidth = 2; c.beginPath(); c.moveTo(30, 96); c.lineTo(630, 96); c.stroke(); c.setLineDash([]);
          G.text(c, S.q.text, 330, 150, { size: 34, color: '#E11D2E', stroke: false });
          if (S.q.list) S.q.list.forEach((p, i) => { G.text(c, 'ARTICOLO ' + (i + 1), 60, 230 + i * 56, { size: 26, align: 'left', color: NAVY, stroke: false, font: 'JetBrains Mono, monospace' }); G.text(c, BQ.eur(p), 620, 230 + i * 56, { size: 30, align: 'right', color: NAVY, stroke: false, font: 'JetBrains Mono, monospace' }); });
          else if (S.q.shown) G.disp(c, S.q.shown, 330, 270, { size: 120, color: NAVY, stroke: false });
          else { G.disp(c, S.q.kg.toString().replace('.', ',') + ' kg', 330, 260, { size: 100, color: NAVY, stroke: false }); G.text(c, '× ' + S.q.ppk + ',00 €/kg', 330, 340, { size: 36, color: '#3a4a6b', stroke: false }); }
          G.text(c, 'BATTI:', 60, 480, { size: 26, align: 'left', color: '#657', stroke: false });
          G.lcd(c, 60, 500, 540, 100, (S.buf || '0') + ' €', 64);
          c.restore();
          // tastierino
          G.box(c, KX - 20, KY - 20, 3 * KW + 2 * GAP + 40, 4 * (KH + GAP) + 84 + 50, 26, '#0A1B3F', 6);
          keys.forEach((k, i) => { const r = kr(i); G.box(c, r[0], r[1], r[2], r[3], 18, k === 'C' ? '#FF9CA4' : '#fff', 5); G.disp(c, k, r[0] + r[2] / 2, r[1] + r[3] / 2 + 3, { size: 52, color: NAVY, stroke: false }); });
          G.box(c, ...OK, 20, '#3FA06A', 6); G.disp(c, 'INVIO', OK[0] + OK[2] / 2, OK[1] + OK[3] / 2 + 3, { size: 46 });
          const tl = BQ.clamp(1 - S.tq / 8, 0, 1); G.box(c, 80, 690, 660, 14, 7, '#fff', 3); G.box(c, 82, 692, 656 * tl, 10, 5, '#F2C340', 0);
          if (S.msgT > 0) G.disp(c, S.msg, 420, 430, { size: 60, color: S.msg[0] === '+' ? '#3FA06A' : '#E11D2E' });
          P.draw(c);
        },
      };
    },
  });

  /* =========================================================
     MEMORIA DI SEQUENZA
     ========================================================= */
  M.register('simon', {
    name: 'Ripeti la sequenza', icon: 'register', tint: '#CFE0F5',
    blurb: 'Guarda la sequenza di tasti e ripetila a memoria, sempre più lunga!',
    howto: [['Guarda', 'i tasti che si illuminano'], ['Ripeti', 'toccali nello stesso ordine (o usa i tasti 1-4)'], ['Record', 'più arrivi lontano, più stelle prendi']],
    variants: {
      tastiera: { label: 'Tasti della cassa', names: ['1', '2', '3', '4'], goal: [5, 7, 9], cols: ['#E11D2E', '#215FD6', '#F2C340', '#3FA06A'] },
      forno: { label: 'Programma del forno', names: ['♨', '❄', '☀', '⏱'], goal: [5, 7, 9], cols: ['#FF8A1E', '#4E8BFF', '#F2C340', '#E11D2E'] },
      cassetto: { label: 'Codice del cassetto', names: ['A', 'B', 'C', 'D'], goal: [6, 8, 10], cols: ['#7A5CD0', '#1D8F8A', '#E11D2E', '#FF8A1E'] },
    },
    create(api, v) {
      const rng = api.rng, P = G.Particles();
      const S = { seq: [rng.int(0, 3)], ph: 'show', idx: 0, lit: -1, litT: 0, t: 0, pi: 0, score: 0, press: -1 };
      const tones = [392, 523, 659, 784];
      const pads = [[200, 130], [680, 130], [200, 400], [680, 400]].map((p) => ({ x: p[0], y: p[1], w: 400, h: 230 }));
      api.hud('livello', 1); api.hud('record', 0);
      S.showT = 0.8;
      function light(i, d) { S.lit = i; S.litT = d || 0.4; api.sfx('ding'); }
      const inR = (r, x, y) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
      function tap(i) {
        if (S.ph !== 'in') return; light(i, 0.25); api.vib(10);
        if (i !== S.seq[S.pi]) { S.ph = 'fail'; S.t0 = S.t; api.sfx('bad'); const L = S.seq.length - 1; const st = L >= v.goal[2] ? 3 : L >= v.goal[1] ? 2 : L >= v.goal[0] ? 1 : 0; setTimeout(() => api.finish({ stars: st, score: L * 100, detail: `Sequenza più lunga: ${L}` }), 500); return; }
        S.pi++;
        if (S.pi >= S.seq.length) { S.score += S.seq.length * 10; api.hud('record', S.seq.length); api.sfx('coin'); if (S.seq.length >= v.goal[2] + 1) { api.finish({ stars: 3, score: S.seq.length * 100, detail: `Sequenza da ${S.seq.length}!` }); return; } S.seq.push(rng.int(0, 3)); S.ph = 'show'; S.idx = 0; S.showT = 0.9; api.hud('livello', S.seq.length); }
      }
      return {
        down(x, y) { pads.forEach((p, i) => { if (inR(p, x, y)) tap(i); }); },
        key(k, dn) { if (dn && '1234'.includes(k) && k) tap(+k - 1); },
        update(dt) {
          S.t += dt; P.update(dt); if (S.litT > 0) { S.litT -= dt; if (S.litT <= 0) S.lit = -1; }
          if (S.ph === 'show') { S.showT -= dt; if (S.showT <= 0) { if (S.idx < S.seq.length) { light(S.seq[S.idx], 0.45); S.idx++; S.showT = Math.max(0.35, 0.75 - S.seq.length * 0.03); } else { S.ph = 'in'; S.pi = 0; } } }
        },
        draw(c) {
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#2A3A63'], [1, '#0A1B3F']]); c.fillRect(0, 0, 1280, 720);
          G.box(c, 150, 90, 980, 590, 40, '#14306B', 6);
          pads.forEach((p, i) => { const on = S.lit === i; G.box(c, p.x, p.y, p.w, p.h, 34, on ? '#fff' : v.cols[i], 6); if (!on) { c.fillStyle = 'rgba(0,0,0,.25)'; G.rr(c, p.x, p.y, p.w, p.h, 34); c.fill(); } if (on) { c.save(); c.globalAlpha = 0.5; G.box(c, p.x - 10, p.y - 10, p.w + 20, p.h + 20, 40, v.cols[i], 0); c.restore(); G.box(c, p.x, p.y, p.w, p.h, 34, v.cols[i], 6); } G.disp(c, v.names[i], p.x + p.w / 2, p.y + p.h / 2 + 4, { size: 120, color: '#fff' }); G.text(c, String(i + 1), p.x + 26, p.y + 28, { size: 26, color: '#fff', stroke: false }); });
          G.disp(c, S.ph === 'show' ? 'GUARDA…' : S.ph === 'in' ? 'TOCCA A TE!' : 'ERRORE!', 640, 50, { size: 52 });
          for (let i = 0; i < S.seq.length; i++) G.circ(c, 640 - (S.seq.length - 1) * 14 + i * 28, 700, 8, i < S.pi ? '#8EF08E' : '#fff', 2);
          P.draw(c);
        },
      };
    },
  });

  /* =========================================================
     IL PESO FALSO — bilancia a due piatti
     ========================================================= */
  M.register('fakeweight', {
    name: 'Il peso falso', icon: 'i_weight', tint: '#D9EFDD',
    blurb: 'Un peso è più pesante degli altri: trovalo con la bilancia a due piatti usando il minor numero di pesate!',
    howto: [['Tocca un peso', 'per spostarlo: panchina → piatto sinistro → destro'], ['PESA', 'la bilancia si inclina verso il lato più pesante'], ['Indovina', 'premi È QUESTO! e tocca il peso falso (2 pesate = 3 stelle)']],
    variants: { nove: { label: '9 pesi', n: 9, brief: 'Ottavio ha nascosto un peso truccato tra i nove campioni!' }, sei: { label: '6 pesi', n: 6, brief: 'Sei pesi, uno truccato.' }, dodici: { label: '12 pesi', n: 12, brief: 'Dodici pesi… il truccato è più pesante!' } },
    create(api, v) {
      const rng = api.rng, P = G.Particles(), N = v.n;
      const fake = rng.int(0, N - 1);
      const S = { pos: new Array(N).fill(0), beam: 0, beamT: 0, weighs: 0, mode: 'weigh', t: 0, msg: 'Metti i pesi sui piatti', found: false, sel: -1, hist: [] };
      api.hud('pesate', 0);
      const maxW = 4 + (N > 9 ? 2 : 0);
      const wx = (i) => 640 - (N - 1) * 52 + i * 104;
      const inR = (r, x, y) => x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3];
      const B_W = [60, 590, 250, 92], B_G = [970, 590, 250, 92];
      function weigh() {
        const L = [], R = []; S.pos.forEach((p, i) => { if (p === 1) L.push(i); if (p === 2) R.push(i); });
        if (!L.length || L.length !== R.length) { S.msg = 'Stesso numero di pesi su ogni piatto!'; api.sfx('bad'); return; }
        const wl = L.length + (L.includes(fake) ? 0.3 : 0), wr = R.length + (R.includes(fake) ? 0.3 : 0);
        S.beamTarget = wl > wr ? -1 : wl < wr ? 1 : 0; S.weighs++; api.hud('pesate', S.weighs); api.sfx('thunk');
        S.msg = S.beamTarget === 0 ? 'Equilibrio: il falso è fuori!' : S.beamTarget < 0 ? 'Il sinistro pesa di più' : 'Il destro pesa di più';
        S.hist.push(`${L.map((x) => x + 1).join('+')} ${S.beamTarget < 0 ? '>' : S.beamTarget > 0 ? '<' : '='} ${R.map((x) => x + 1).join('+')}`); if (S.hist.length > 3) S.hist.shift();
      }
      function guess(i) {
        const ok = i === fake; S.found = true;
        api.sfx(ok ? 'fanfare' : 'bad');
        const st = !ok ? 0 : S.weighs <= 2 ? 3 : S.weighs === 3 ? 2 : 1;
        S.sel = i; S.msg = ok ? 'TROVATO!' : 'Non era lui…';
        if (ok) P.burst(wx(i), 560, 30, { col: ['#FFE58A', '#fff'], speed: 420 });
        setTimeout(() => api.finish({ stars: st, score: ok ? Math.max(100, 1000 - S.weighs * 150) : 0, detail: ok ? `Trovato in ${S.weighs} pesate` : `Il peso falso era il n°${fake + 1}` }), 900);
      }
      return {
        down(x, y) {
          if (S.found) return;
          if (inR(B_W, x, y)) return weigh();
          if (inR(B_G, x, y)) { S.mode = S.mode === 'guess' ? 'weigh' : 'guess'; S.msg = S.mode === 'guess' ? 'Tocca il peso che credi falso' : 'Modalità pesata'; api.sfx('click'); return; }
          for (let i = 0; i < N; i++) {
            const cx = wx(i), cy = 560;
            if (S.pos[i] === 0 && Math.hypot(x - cx, y - cy) < 48) { if (S.mode === 'guess') return guess(i); const l = S.pos.filter((p) => p === 1).length, r = S.pos.filter((p) => p === 2).length; if (l <= r && l < maxW) S.pos[i] = 1; else if (r < maxW) S.pos[i] = 2; else S.pos[i] = 1; api.sfx('tap'); return; }
          }
          // peso sui piatti -> torna in panchina (o, in modalità guess, selezione)
          for (let i = 0; i < N; i++) { const p = S.pos[i]; if (!p) continue; const pl = plateW(i, p); if (Math.hypot(x - pl.x, y - pl.y) < 40) { if (S.mode === 'guess') return guess(i); S.pos[i] = 0; api.sfx('tap'); return; } }
        },
        key() {},
        update(dt) { S.t += dt; P.update(dt); if (S.beamTarget != null) { S.beam += (S.beamTarget - S.beam) * Math.min(1, dt * 4); } },
        draw(c) {
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#D9EFDD'], [1, '#9BCBAA']]); c.fillRect(0, 0, 1280, 720);
          c.fillStyle = 'rgba(255,255,255,.4)'; for (let x = 0; x < 1280; x += 90) c.fillRect(x, 0, 3, 480);
          const cx = 640, cy = 170, ang = S.beam * 0.17, len = 360;
          // colonna e base
          G.box(c, cx - 150, 480, 300, 40, 14, G.steel(c, 0, 480, 0, 520), 5); G.box(c, cx - 26, cy, 52, 320, 12, G.steel(c, cx - 26, 0, cx + 26, 0), 5);
          // giogo
          c.save(); c.translate(cx, cy); c.rotate(ang); G.box(c, -len, -16, len * 2, 32, 16, G.steel(c, 0, -16, 0, 16), 5); G.circ(c, -len, 0, 10, '#E11D2E', 3); G.circ(c, len, 0, 10, '#E11D2E', 3); c.restore();
          G.circ(c, cx, cy, 26, '#E11D2E', 5);
          for (const side of [-1, 1]) {
            const ex = cx + Math.cos(ang) * len * side, ey = cy + Math.sin(ang) * len * side;
            c.strokeStyle = NAVY; c.lineWidth = 4; c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex - 120, ey + 210); c.moveTo(ex, ey); c.lineTo(ex + 120, ey + 210); c.stroke();
            G.ell(c, ex, ey + 215, 140, 22, G.steel(c, ex - 140, 0, ex + 140, 0), 5);
          }
          // pesi
          const drawW = (i, x, y, s) => { const f = S.found && i === fake; G.circ(c, x, y, 40 * s, G.lin(c, x - 40, y - 40, x + 40, y + 40, [[0, f ? '#FFF6BF' : '#F2F5FA'], [1, f ? '#E7B93A' : '#93A0B0']]), 5); G.disp(c, String(i + 1), x, y + 3, { size: 36 * s, color: NAVY, stroke: false }); };
          S.pos.forEach((p, i) => { if (p === 0) { const ex = wx(i), ey = 560 + (S.mode === 'guess' ? Math.sin(S.t * 6 + i) * 4 : 0); G.shadow(c, ex, ey + 40, 34, 8, 0.25); drawW(i, ex, ey, 1); } else { const q = plateW(i, p); drawW(i, q.x, q.y, 0.78); } });
          // bottoni
          G.box(c, ...B_W, 22, '#3FA06A', 6); G.disp(c, 'PESA', B_W[0] + B_W[2] / 2, B_W[1] + 48, { size: 48 });
          G.box(c, ...B_G, 22, S.mode === 'guess' ? '#F2C340' : '#fff', 6); G.disp(c, 'È QUESTO!', B_G[0] + B_G[2] / 2, B_G[1] + 48, { size: 40, color: NAVY, stroke: false });
          G.box(c, 340, 590, 600, 92, 20, '#fff', 5); G.text(c, S.msg, 640, 620, { size: 26, color: NAVY, stroke: false });
          G.text(c, S.hist.length ? S.hist.join('   ·   ') : 'Nessuna pesata', 640, 658, { size: 22, color: '#3a4a6b', stroke: false, font: 'JetBrains Mono, monospace' });
          P.draw(c);
        },
      };
      function plateW(i, p) {
        const arr = []; S.pos.forEach((q, k) => { if (q === p) arr.push(k); }); const idx = arr.indexOf(i), n = arr.length;
        const ang = S.beam * 0.17, sx = p === 1 ? -1 : 1, ex = 640 + Math.cos(ang) * 360 * sx, ey = 170 + Math.sin(ang) * 360 * sx + 215;
        return { x: ex + (idx - (n - 1) / 2) * 62, y: ey - 30 };
      }
    },
  });
})();
