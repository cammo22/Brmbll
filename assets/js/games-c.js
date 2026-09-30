/* =========================================================
   MINIGIOCHI C — torre, coppie, segaossa, tritacarne, lucida,
   consegne, quiz tecnico, montaggio
   ========================================================= */
(function () {
  'use strict';
  const BQ = window.BQ, G = BQ.g, A = BQ.art, M = BQ.mini;
  const NAVY = '#0A1B3F', TAU = Math.PI * 2;
  const PHOTO = (it) => 'assets/cat/' + it.i;

  /* =========================================================
     TORRE — impila
     ========================================================= */
  M.register('stack', {
    name: 'Impila al volo', icon: 'pots', tint: '#FBE2C4',
    blurb: 'Fai scorrere il pezzo e tocca per lasciarlo cadere: quello che sporge viene tagliato!',
    howto: [['Tocca', 'lo schermo (o spazio) per far cadere il pezzo'], ['Precisione', 'la parte che sporge si stacca e la torre si restringe'], ['Altezza', 'arriva più in alto che puoi']],
    variants: {
      pentole: { label: 'Torre di pentole', kind: 'pot', goal: [8, 14, 20] },
      casse: { label: 'Pila di casse', kind: 'crate', goal: [8, 14, 20] },
      carrelli: { label: 'Piani del carrello', kind: 'tray', goal: [8, 14, 20] },
      bacinelle: { label: 'Bacinelle', kind: 'tub', goal: [8, 14, 20] },
    },
    create(api, v) {
      const rng = api.rng, P = G.Particles();
      const H = 54;
      const S = { layers: [{ x: 440, w: 400 }], cur: null, dir: 1, sp: 340, t: 0, h: 1, over: false, cam: 0, cuts: [], perfect: 0 };
      function spawn() { const top = S.layers[S.layers.length - 1]; S.cur = { x: rng() < 0.5 ? -top.w : 1280, w: top.w }; S.dir = S.cur.x < 0 ? 1 : -1; S.sp = 330 + Math.min(260, S.layers.length * 14); }
      spawn(); api.hud('piani', 1);
      const cols = { pot: ['#C8D0DA', '#E11D2E', '#F2C340', '#3FA06A'], crate: ['#D9A566', '#C58B4E', '#E2B47A'], tray: ['#C8D0DA', '#FF8A1E', '#4E8BFF'], tub: ['#fff', '#CFE0F5', '#FFE58A'] }[v.kind];
      function drop() {
        if (S.over) return;
        const top = S.layers[S.layers.length - 1], c = S.cur;
        const l = Math.max(c.x, top.x), r = Math.min(c.x + c.w, top.x + top.w), w = r - l;
        if (w <= 6) { S.over = true; S.cuts.push({ x: c.x, w: c.w, y: 0, vy: 0, life: 0 }); api.sfx('bad'); end(); return; }
        const perfect = Math.abs(c.x - top.x) < 8;
        if (perfect) { S.perfect++; S.layers.push({ x: top.x, w: top.w + (S.perfect % 3 === 0 ? 14 : 0) }); api.sfx('ding'); P.burst(640, 600 - S.cam, 12, { col: ['#FFE58A', '#fff'], speed: 300 }); P.text(640, 520, 'PERFETTO', '#FFE58A', 40); }
        else { S.layers.push({ x: l, w }); if (c.x < top.x) S.cuts.push({ x: c.x, w: top.x - c.x, y: 0, vy: 0, life: 0, h: S.layers.length }); else if (c.x + c.w > top.x + top.w) S.cuts.push({ x: top.x + top.w, w: c.x + c.w - (top.x + top.w), y: 0, vy: 0, life: 0, h: S.layers.length }); api.sfx('thunk'); api.vib(10); }
        S.h = S.layers.length; api.hud('piani', S.h);
        spawn();
      }
      function end() { const n = S.layers.length; const st = n >= v.goal[2] ? 3 : n >= v.goal[1] ? 2 : n >= v.goal[0] ? 1 : 0; setTimeout(() => api.finish({ stars: st, score: n * 100 + S.perfect * 50, detail: `Torre di ${n} piani (${S.perfect} perfetti)` }), 600); }
      return {
        down() { drop(); }, key(k, dn) { if (dn && (k === ' ' || k === 'Enter')) drop(); },
        update(dt) {
          S.t += dt; P.update(dt);
          if (!S.over && S.cur) { S.cur.x += S.dir * S.sp * dt; if (S.cur.x + S.cur.w > 1290) S.dir = -1; if (S.cur.x < -10) S.dir = 1; }
          const tgt = Math.max(0, (S.layers.length - 7) * H); S.cam += (tgt - S.cam) * Math.min(1, dt * 4);
          for (const k of S.cuts) { k.vy += 1400 * dt; k.y += k.vy * dt; k.life += dt; }
        },
        draw(c) {
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#FFE2B8'], [1, '#F6B97A']]); c.fillRect(0, 0, 1280, 720);
          c.fillStyle = '#8A5A34'; c.fillRect(0, 660 + S.cam, 1280, 200);
          const blk = (x, y, w, i) => {
            const col = cols[i % cols.length];
            if (v.kind === 'pot') { G.box(c, x, y, w, H - 4, 10, G.steel(c, x, y, x, y + H), 4); G.box(c, x - 12, y + 10, 16, 14, 6, '#0A1B3F', 3); G.box(c, x + w - 4, y + 10, 16, 14, 6, '#0A1B3F', 3); c.fillStyle = col; c.fillRect(x + 8, y + 18, w - 16, 8); }
            else if (v.kind === 'crate') { G.box(c, x, y, w, H - 4, 6, col, 4); c.strokeStyle = 'rgba(10,27,63,.35)'; c.lineWidth = 4; for (let k = 1; k < 3; k++) { c.beginPath(); c.moveTo(x, y + k * 16); c.lineTo(x + w, y + k * 16); c.stroke(); } }
            else if (v.kind === 'tray') { G.box(c, x, y + 10, w, H - 20, 8, col === '#C8D0DA' ? G.steel(c, x, y, x, y + H) : col, 4); G.box(c, x + w / 2 - 12, y - 6, 24, 18, 6, '#0A1B3F', 3); }
            else { G.box(c, x, y, w, H - 4, 12, col, 4); G.box(c, x + 10, y + 8, w - 20, 10, 5, 'rgba(10,27,63,.15)', 0); }
          };
          S.layers.forEach((L, i) => blk(L.x, 660 + S.cam - (i + 1) * H, L.w, i));
          if (S.cur && !S.over) blk(S.cur.x, 660 + S.cam - (S.layers.length + 1) * H - 4, S.cur.w, S.layers.length);
          for (const k of S.cuts) { c.save(); c.globalAlpha = Math.max(0, 1 - k.life); blk(k.x, 660 + S.cam - (k.h || S.layers.length + 1) * H + k.y, k.w, 2); c.restore(); }
          P.draw(c);
          G.disp(c, String(S.layers.length), 1180, 110, { size: 110, color: '#fff' });
          if (S.t < 3) G.disp(c, 'TOCCA PER LASCIARE CADERE', 640, 200, { size: 48 });
        },
      };
    },
  });

  /* =========================================================
     MEMORY — coppie con le foto del catalogo
     ========================================================= */
  M.register('memory', {
    name: 'Coppie del catalogo', icon: 'i_book', tint: '#E2DAF5',
    blurb: 'Trova le coppie di prodotti uguali: le foto sono quelle del catalogo!',
    howto: [['Tocca', 'due carte per girarle'], ['Coppia', 'se sono uguali restano scoperte'], ['Mosse', 'meno mosse = più stelle']],
    variants: {
      reparto: { label: 'Coppie del reparto', pairs: 6, goal: [14, 18, 24] },
      grande: { label: 'Coppie: sfida grande', pairs: 8, goal: [18, 24, 32] },
    },
    create(api, v) {
      const rng = api.rng, P = G.Particles();
      const pool = (api.opts.pool && api.opts.pool.length >= v.pairs ? api.opts.pool : BQ_ITEMS_ALL().slice(0, 40)).filter((x) => x.i);
      const pick = rng.shuffle(pool).slice(0, v.pairs);
      const cards = rng.shuffle(pick.concat(pick).map((it, i) => ({ it, flip: 0, tgt: 0, done: false, id: i })));
      const cols = v.pairs === 8 ? 8 : 4, rows = v.pairs === 8 ? 4 : 3;
      const cw = v.pairs === 8 ? 128 : 170, ch = v.pairs === 8 ? 150 : 190, gx = v.pairs === 8 ? 14 : 22, gy = 18;
      const ox = (1280 - (cols * cw + (cols - 1) * gx)) / 2, oy = 80;
      const S = { sel: [], moves: 0, t: 0, lock: 0, found: 0 };
      api.hud('mosse', 0); api.hud('coppie', `0/${v.pairs}`);
      cards.forEach((cd, i) => { cd.x = ox + (i % cols) * (cw + gx); cd.y = oy + Math.floor(i / cols) * (ch + gy); G.img(PHOTO(cd.it)); });
      return {
        down(x, y) {
          if (S.lock > 0) return;
          for (const cd of cards) if (!cd.done && cd.tgt === 0 && x >= cd.x && x <= cd.x + cw && y >= cd.y && y <= cd.y + ch) {
            cd.tgt = 1; S.sel.push(cd); api.sfx('page'); api.vib(6);
            if (S.sel.length === 2) {
              S.moves++; api.hud('mosse', S.moves);
              const [a, b] = S.sel;
              if (a.it === b.it) { a.done = b.done = true; S.sel = []; S.found++; api.sfx('ding'); P.burst(a.x + cw / 2, a.y + ch / 2, 14, { col: ['#FFE58A', '#fff'], speed: 300 }); P.burst(b.x + cw / 2, b.y + ch / 2, 14, { col: ['#FFE58A', '#fff'], speed: 300 }); api.hud('coppie', `${S.found}/${v.pairs}`); if (S.found === v.pairs) { const st = S.moves <= v.goal[0] ? 3 : S.moves <= v.goal[1] ? 2 : 1; setTimeout(() => api.finish({ stars: st, score: Math.max(100, 1500 - S.moves * 40 - Math.round(S.t * 3)), detail: `${S.moves} mosse in ${Math.round(S.t)} s` }), 500); } }
              else S.lock = 0.9;
            }
            break;
          }
        },
        update(dt) {
          S.t += dt; P.update(dt);
          if (S.lock > 0) { S.lock -= dt; if (S.lock <= 0) { S.sel.forEach((cd) => { cd.tgt = 0; }); S.sel = []; api.sfx('tick'); } }
          cards.forEach((cd) => { cd.flip += (cd.tgt - cd.flip) * Math.min(1, dt * 12); });
        },
        draw(c) {
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#E2DAF5'], [1, '#B9A9E6']]); c.fillRect(0, 0, 1280, 720);
          cards.forEach((cd) => {
            const k = Math.abs(Math.cos(cd.flip * Math.PI)), front = cd.flip > 0.5;
            c.save(); c.translate(cd.x + cw / 2, cd.y + ch / 2); c.scale(Math.max(0.03, k), 1);
            if (front) { G.box(c, -cw / 2, -ch / 2, cw, ch, 16, '#fff', 5); G.drawImgFit(c, G.img(PHOTO(cd.it)), -cw / 2 + 8, -ch / 2 + 8, cw - 16, ch - 40); G.text(c, cd.it.t.replace(/^(\S+\s+\S+).*$/, '$1').slice(0, 18), 0, ch / 2 - 18, { size: 15, color: NAVY, stroke: false }); if (cd.done) { c.fillStyle = 'rgba(155,231,181,.35)'; G.rr(c, -cw / 2, -ch / 2, cw, ch, 16); c.fill(); } }
            else { G.box(c, -cw / 2, -ch / 2, cw, ch, 16, G.lin(c, 0, -ch / 2, 0, ch / 2, [[0, '#E11D2E'], [1, '#9E0D1A']]), 5); c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 3; G.rr(c, -cw / 2 + 10, -ch / 2 + 10, cw - 20, ch - 20, 10); c.stroke(); G.disp(c, 'AB', 0, 4, { size: 54, color: '#fff' }); }
            c.restore();
          });
          P.draw(c);
        },
      };
    },
  });
  function BQ_ITEMS_ALL() { return ((BQ.items && BQ.items.all) || window.BQ_ITEMS || []).filter((x) => x.i); }

  /* =========================================================
     SEGUI LA LINEA — segaosso / coltello
     ========================================================= */
  M.register('trace', {
    name: 'Taglia sulla linea', icon: 'bonesaw', tint: '#CFE9E5',
    blurb: 'Guida la lama lungo la linea tratteggiata senza uscire dal bordo!',
    howto: [['Parti', 'dal cerchio verde a sinistra e tieni premuto'], ['Segui', 'la linea fino alla fine, restando nella fascia'], ['Attenzione', 'fuori dalla fascia la lama si inceppa!']],
    variants: {
      osso: { label: 'Segaosso', obj: 'osso', tol: 34, amp: 110, brief: 'Seziona la costata lungo la linea con il segaosso.' },
      prosciutto: { label: 'Disossa il prosciutto', obj: 'ham', tol: 30, amp: 120, brief: 'Segui l\'osso con il coltello da disosso.' },
      pane: { label: 'Coltello da pane', obj: 'pane', tol: 38, amp: 80, brief: 'Affetta il pane seghettato dritto e regolare.' },
      pizza: { label: 'Rotella taglia pizza', obj: 'pizza', tol: 36, amp: 100, brief: 'Taglia la pizza seguendo il tracciato.' },
    },
    create(api, v) {
      const rng = api.rng, P = G.Particles();
      const ph = rng() * 6, k1 = 0.9 + rng() * 0.6, pts = [];
      for (let i = 0; i <= 120; i++) { const t = i / 120, x = 130 + t * 1020; pts.push({ x, y: 380 + Math.sin(t * TAU * k1 + ph) * v.amp * 0.7 + Math.sin(t * TAU * 2.3 + ph * 1.7) * v.amp * 0.3 }); }
      const S = { on: false, prog: 0, off: 0, offNow: false, t: 0, px: 0, py: 0, done: false, time0: 0, msg: '' };
      api.hud('progresso', '0%'); api.hud('fuori', '0.0 s');
      function near(x, y, from) { let best = 1e9, bi = from; for (let i = Math.max(0, from - 3); i < Math.min(pts.length, from + 14); i++) { const d = Math.hypot(pts[i].x - x, pts[i].y - y); if (d < best) { best = d; bi = i; } } return { d: best, i: bi }; }
      return {
        down(x, y) { if (Math.hypot(x - pts[0].x, y - pts[0].y) < 70) { S.on = true; S.px = x; S.py = y; api.sfx('engine'); } },
        move(x, y) {
          if (!S.on || S.done) return; S.px = x; S.py = y;
          const n = near(x, y, S.prog); S.offNow = n.d > v.tol;
          if (!S.offNow && n.i > S.prog) { S.prog = n.i; if (Math.random() < 0.5) P.burst(x, y, 2, { col: ['#FFE58A', '#fff'], speed: 220, life: 0.3, size: 4 }); }
          if (n.d > v.tol * 3) { S.on = false; S.msg = 'Lama uscita! Ricomincia dal bordo'; api.sfx('bad'); }
        },
        up() { S.on = false; },
        update(dt) {
          S.t += dt; P.update(dt);
          if (S.on && S.offNow) { S.off += dt; if (Math.random() < 0.25) api.sfx('buzz'); api.vib(10); }
          api.hud('progresso', Math.round(S.prog / 120 * 100) + '%'); api.hud('fuori', S.off.toFixed(1) + ' s', S.off > 2 ? 'bad' : '');
          if (S.prog >= 118 && !S.done) { S.done = true; const st = S.off < 1.2 ? 3 : S.off < 3.2 ? 2 : 1; api.sfx('fanfare'); api.finish({ stars: st, score: Math.max(100, Math.round(1500 - S.off * 200 - S.t * 10)), detail: `Fuori linea per ${S.off.toFixed(1)} s · ${S.t.toFixed(0)} s totali` }); }
        },
        draw(c) {
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#CFE9E5'], [1, '#95C8C1']]); c.fillRect(0, 0, 1280, 720);
          c.fillStyle = G.steel(c, 0, 560, 0, 720); c.fillRect(0, 560, 1280, 160); c.fillStyle = NAVY; c.fillRect(0, 552, 1280, 10);
          // oggetto da tagliare
          if (v.obj === 'pizza') { G.circ(c, 640, 380, 300, '#F2C96A', 6); G.circ(c, 640, 380, 250, '#E85D4A', 0); c.fillStyle = '#FFF3C4'; for (let i = 0; i < 26; i++) { c.beginPath(); c.arc(640 + Math.cos(i * 2.4) * (40 + (i * 37) % 210), 380 + Math.sin(i * 2.4) * (40 + (i * 37) % 210), 18, 0, TAU); c.fill(); } }
          else if (v.obj === 'pane') { G.box(c, 100, 240, 1080, 280, 140, G.lin(c, 0, 240, 0, 520, [[0, '#E7B26A'], [1, '#B47A3A']]), 6); c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 8; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(240 + i * 150, 290); c.lineTo(290 + i * 150, 340); c.stroke(); } }
          else if (v.obj === 'ham') { G.box(c, 100, 250, 1080, 260, 130, G.lin(c, 0, 250, 0, 510, [[0, '#C25A4A'], [1, '#7A2A26']]), 6); G.circ(c, 1040, 380, 26, '#F4F2EC', 4); }
          else { G.box(c, 100, 240, 1080, 290, 60, G.lin(c, 0, 240, 0, 530, [[0, '#E58580'], [1, '#B8403F']]), 6); G.ell(c, 1070, 380, 90, 70, '#F4F2EC', 5); G.circ(c, 1070, 380, 26, '#E7D8C4', 3); c.strokeStyle = 'rgba(255,240,235,.6)'; c.lineWidth = 6; c.beginPath(); c.moveTo(200, 300); c.quadraticCurveTo(500, 260, 800, 310); c.stroke(); }
          // fascia tolleranza + linea
          c.lineCap = 'round'; c.lineJoin = 'round';
          c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = v.tol * 2; c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.stroke();
          c.strokeStyle = NAVY; c.lineWidth = 5; c.setLineDash([14, 12]); c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.stroke(); c.setLineDash([]);
          // parte già tagliata
          c.strokeStyle = '#3FA06A'; c.lineWidth = 12; c.beginPath(); for (let i = 0; i <= S.prog; i++) (i ? c.lineTo(pts[i].x, pts[i].y) : c.moveTo(pts[i].x, pts[i].y)); c.stroke();
          G.circ(c, pts[0].x, pts[0].y, 30, '#8EF08E', 5); G.disp(c, 'VIA', pts[0].x, pts[0].y + 2, { size: 22, color: NAVY, stroke: false });
          G.circ(c, pts[120].x, pts[120].y, 30, '#F2C340', 5); G.disp(c, 'FINE', pts[120].x, pts[120].y + 2, { size: 20, color: NAVY, stroke: false });
          // lama
          const tx = S.on ? S.px : pts[S.prog].x, ty = S.on ? S.py : pts[S.prog].y;
          c.save(); c.translate(tx, ty); c.rotate(S.on ? Math.sin(S.t * 40) * 0.05 : 0);
          if (v.obj === 'osso' || v.obj === 'ham') { G.box(c, -6, -70, 12, 110, 4, G.steel(c, -6, 0, 6, 0), 4); for (let i = 0; i < 6; i++) { c.fillStyle = NAVY; c.beginPath(); c.moveTo(6, -62 + i * 16); c.lineTo(14, -56 + i * 16); c.lineTo(6, -50 + i * 16); c.fill(); } G.box(c, -22, -130, 44, 60, 10, '#E11D2E', 4); }
          else { c.beginPath(); c.moveTo(-6, -80); c.lineTo(10, 0); c.lineTo(-6, 0); c.closePath(); c.fillStyle = G.steel(c, -6, -80, 10, 0); c.fill(); c.lineWidth = 4; c.strokeStyle = NAVY; c.stroke(); G.box(c, -14, -130, 28, 54, 8, '#0A1B3F', 4); }
          if (S.offNow && S.on) { G.circ(c, 0, 0, 24, 'rgba(225,29,46,.5)', 0); }
          c.restore();
          P.draw(c);
          if (S.msg && S.t % 6 < 3) G.disp(c, S.msg, 640, 640, { size: 34, color: '#FFE58A' });
          if (S.prog === 0 && !S.on) { c.globalAlpha = 0.6 + Math.sin(S.t * 5) * 0.4; G.disp(c, 'PARTI DAL CERCHIO VERDE', 640, 110, { size: 46 }); c.globalAlpha = 1; }
        },
      };
    },
  });

  /* =========================================================
     TRITACARNE — separa i corpi estranei
     ========================================================= */
  M.register('grind', {
    name: 'Tritacarne sicuro', icon: 'grinder', tint: '#CFE9E5',
    blurb: 'Sul nastro passano ingredienti buoni e corpi estranei: togli gli intrusi prima che finiscano nella macchina!',
    howto: [['Tocca', 'gli intrusi (forchette, guanti, sassi…) per toglierli dal nastro'], ['Non toccare', 'gli ingredienti buoni: vanno nella macchina'], ['Vite', 'ogni intruso che entra costa una vita']],
    variants: {
      carne: { label: 'Tritacarne', good: ['carne', 'carne', 'carne'], bad: ['forchetta', 'guanto', 'osso'], goal: 24, time: 45 },
      hamburger: { label: 'Hamburgatrice', good: ['carne'], bad: ['guanto', 'forchetta', 'sasso'], goal: 26, time: 45 },
      patate: { label: 'Pelapatate', good: ['patata'], bad: ['sasso', 'sasso', 'guanto'], goal: 26, time: 45 },
      grattugia: { label: 'Grattugia', good: ['formaggio'], bad: ['guanto', 'sasso', 'forchetta'], goal: 24, time: 45 },
    },
    create(api, v) {
      const rng = api.rng, P = G.Particles();
      const S = { items: [], t: 0, sp: 240, spawn: 0.3, lives: 3, good: 0, score: 0, combo: 0 };
      api.hud('lavorati', `0/${v.goal}`); api.hud('vite', '♥♥♥');
      function mk() {
        const bad = rng() < 0.36, name = bad ? rng.pick(v.bad) : rng.pick(v.good);
        S.items.push({ x: -60, y: 400 + (rng() - 0.5) * 50, name, bad, r: 44, rot: (rng() - 0.5) * 0.5, gone: 0, vx: 0, vy: 0, vr: 0 });
      }
      function drawIt(c, it) {
        c.save(); c.translate(it.x, it.y); c.rotate(it.rot);
        if (it.name === 'carne') { G.ell(c, 0, 0, 52, 38, '#E58580', 4); c.strokeStyle = '#F6DDD2'; c.lineWidth = 6; c.beginPath(); c.arc(-6, 0, 18, 0.3, 2.6); c.stroke(); }
        else if (it.name === 'patata') { G.ell(c, 0, 0, 50, 38, '#C89B5E', 4); c.fillStyle = '#9A7040'; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(-20 + i * 14, -8 + (i % 2) * 16, 3, 0, TAU); c.fill(); } }
        else if (it.name === 'formaggio') { c.beginPath(); c.moveTo(-46, 28); c.lineTo(46, 28); c.lineTo(46, -6); c.lineTo(-46, -34); c.closePath(); c.fillStyle = '#F5C94A'; c.fill(); c.lineWidth = 4; c.strokeStyle = NAVY; c.stroke(); G.circ(c, -10, 8, 8, '#E0A724', 2); G.circ(c, 20, 12, 6, '#E0A724', 2); }
        else if (it.name === 'forchetta') { c.strokeStyle = NAVY; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(-44, 0); c.lineTo(20, 0); c.stroke(); c.strokeStyle = '#C8D0DA'; c.lineWidth = 6; c.stroke(); for (const dy of [-14, -5, 5, 14]) { c.strokeStyle = NAVY; c.lineWidth = 8; c.beginPath(); c.moveTo(20, dy); c.lineTo(50, dy); c.stroke(); c.strokeStyle = '#C8D0DA'; c.lineWidth = 3; c.stroke(); } }
        else if (it.name === 'guanto') { c.save(); c.scale(0.55, 0.55); c.translate(-50, -55); c.drawImage(G.svgImg(A.sprite('i_glove'), 100, 100), 0, 0, 100, 100); c.restore(); }
        else if (it.name === 'osso') { G.box(c, -44, -8, 88, 16, 8, '#F4F2EC', 4); G.circ(c, -44, -10, 12, '#F4F2EC', 4); G.circ(c, -44, 10, 12, '#F4F2EC', 4); G.circ(c, 44, -10, 12, '#F4F2EC', 4); G.circ(c, 44, 10, 12, '#F4F2EC', 4); G.box(c, -40, -7, 80, 14, 6, '#F4F2EC', 0); }
        else if (it.name === 'sasso') { c.beginPath(); c.moveTo(-40, 20); c.lineTo(-30, -24); c.lineTo(10, -34); c.lineTo(42, -6); c.lineTo(34, 26); c.closePath(); c.fillStyle = '#8D95A3'; c.fill(); c.lineWidth = 4; c.strokeStyle = NAVY; c.stroke(); }
        c.restore();
      }
      return {
        down(x, y) {
          for (const it of S.items) if (!it.gone && Math.hypot(it.x - x, it.y - y) < 62) {
            if (it.bad) { it.gone = 1; it.vx = (x < it.x ? 1 : -1) * 500; it.vy = -700; it.vr = 8; S.score += 15; S.combo++; api.sfx('pop'); P.text(it.x, it.y - 50, '+15', '#8EF08E', 40); }
            else { S.lives--; it.gone = 1; it.vy = -400; api.sfx('bad'); api.vib(80); P.text(it.x, it.y - 50, 'Era buono!', '#FF8A93', 36); api.hud('vite', '♥'.repeat(Math.max(0, S.lives)) + '♡'.repeat(3 - Math.max(0, S.lives)), 'bad'); S.combo = 0; if (S.lives <= 0) fin(true); }
            break;
          }
        },
        update(dt) {
          S.t += dt; P.update(dt); S.sp = 230 + Math.min(200, S.t * 5);
          S.spawn -= dt; if (S.spawn <= 0) { mk(); S.spawn = Math.max(0.42, 1.05 - S.t / 70) + rng() * 0.25; }
          for (const it of S.items) {
            if (it.gone) { it.x += it.vx * dt; it.y += it.vy * dt; it.vy += 1600 * dt; it.rot += it.vr * dt; continue; }
            it.x += S.sp * dt;
            if (it.x > 1004) {
              it.gone = 2;
              if (it.bad) { S.lives--; api.sfx('zap'); api.vib(120); P.burst(1040, 400, 18, { col: ['#E11D2E', '#555'], speed: 360 }); P.text(1040, 330, 'INTRUSO!', '#FF8A93', 40); api.hud('vite', '♥'.repeat(Math.max(0, S.lives)) + '♡'.repeat(3 - Math.max(0, S.lives)), 'bad'); if (S.lives <= 0) fin(true); }
              else { S.good++; S.score += 10; api.sfx('thunk'); P.burst(1070, 400, 8, { col: ['#E58580', '#F6DDD2'], speed: 260, life: 0.5 }); api.hud('lavorati', `${S.good}/${v.goal}`); if (S.good >= v.goal) fin(false); }
            }
          }
          S.items = S.items.filter((it) => it.gone === 0 || (it.gone === 1 && it.y < 820));
          api.hud('tempo', Math.max(0, Math.ceil(v.time - S.t)), v.time - S.t < 8 ? 'bad' : ''); if (S.t >= v.time) fin(S.good < v.goal * 0.4);
        },
        draw(c) {
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#CFE9E5'], [1, '#95C8C1']]); c.fillRect(0, 0, 1280, 720);
          // nastro
          G.box(c, -20, 440, 1100, 70, 20, '#3A4870', 5); c.save(); c.beginPath(); c.rect(0, 448, 1080, 54); c.clip(); c.fillStyle = '#23305A'; c.fillRect(0, 448, 1080, 54); c.fillStyle = '#3A4870'; for (let x = -((S.t * S.sp) % 60); x < 1100; x += 60) c.fillRect(x, 448, 28, 54); c.restore();
          G.box(c, -20, 510, 1100, 20, 8, G.steel(c, 0, 510, 0, 530), 4);
          for (const x of [120, 500, 900]) { G.box(c, x, 530, 30, 120, 6, G.steel(c, x, 0, x + 30, 0), 4); }
          // macchina
          c.save(); c.translate(1020, 160); c.scale(1.7, 1.7); G.drawImgFit(c, G.svgImg(A.sprite('grinder'), 200, 200), 0, 0, 200, 200); c.restore();
          G.box(c, 1000, 360, 60, 90, 10, '#0A1B3F', 0);
          for (const it of S.items) if (!it.gone || it.gone === 1) drawIt(c, it);
          P.draw(c);
          G.box(c, 480, 18, 320, 26, 13, '#fff', 4); G.box(c, 484, 22, Math.max(0, 312 * BQ.clamp(S.good / v.goal, 0, 1)), 18, 9, '#3FA06A', 0);
          if (S.t < 3.5) G.disp(c, 'TOCCA GLI INTRUSI!', 640, 200, { size: 54 });
        },
      };
      function fin(dead) { const st = dead ? (S.good >= v.goal * 0.5 ? 1 : 0) : (S.lives === 3 && S.good >= v.goal ? 3 : S.good >= v.goal ? 2 : S.good >= v.goal * 0.6 ? 1 : 0); api.finish({ stars: st, score: S.score, detail: `${S.good} pezzi lavorati${dead ? ' — troppi intrusi!' : ''}`, title: dead ? 'Macchina bloccata!' : undefined }); }
    },
  });

  /* =========================================================
     LUCIDA — gratta via lo sporco
     ========================================================= */
  M.register('polish', {
    name: 'Lucida l\'inox', icon: 'pots', tint: '#CFE0F5',
    blurb: 'L\'acciaio inox deve brillare! Strofina la spugna per togliere lo sporco.',
    howto: [['Strofina', 'col dito o col mouse per pulire'], ['Tutto', 'togli almeno il 92% dello sporco prima che scada il tempo'], ['Macchie dure', 'quelle scure richiedono più passate']],
    variants: {
      pentolame: { label: 'Pentolame', spr: 'pots', time: 35 }, lavello: { label: 'Lavello e cappa', spr: 'juicer', time: 35 }, affettatrice: { label: 'Pulizia affettatrice', spr: 'slicer', time: 32, hard: 1 },
      forno: { label: 'Forno e friggitrice', spr: 'vacuum', time: 35 }, tritacarne: { label: 'Tritacarne', spr: 'grinder', time: 35 }, carrello: { label: 'Carrello inox', spr: 'crate', time: 35 },
    },
    create(api, v) {
      const rng = api.rng, P = G.Particles();
      const DW = 320, DH = 180, dc = document.createElement('canvas'); dc.width = DW; dc.height = DH; const dx = dc.getContext('2d');
      dx.fillStyle = '#7A6A3E'; dx.globalAlpha = 0.9; dx.fillRect(0, 0, DW, DH);
      for (let i = 0; i < 60; i++) { dx.globalAlpha = 0.25 + rng() * 0.35; dx.fillStyle = rng() < 0.5 ? '#5A4A2A' : '#9A8A52'; dx.beginPath(); dx.ellipse(rng() * DW, rng() * DH, 10 + rng() * 34, 6 + rng() * 20, rng() * 3, 0, TAU); dx.fill(); }
      for (let i = 0; i < 9; i++) { dx.globalAlpha = 0.9; dx.fillStyle = '#3C2E16'; dx.beginPath(); dx.ellipse(40 + rng() * 240, 30 + rng() * 120, 12 + rng() * 14, 9 + rng() * 10, rng() * 3, 0, TAU); dx.fill(); }
      dx.globalAlpha = 1;
      const S = { t: 0, pct: 0, last: null, on: false, chk: 0, sx: 640, sy: 360 };
      api.hud('pulito', '0%'); api.hud('tempo', v.time);
      function scrub(x, y) {
        const px = x / 4, py = y / 4; dx.globalCompositeOperation = 'destination-out';
        if (S.last) { dx.lineCap = 'round'; dx.lineWidth = v.hard ? 16 : 20; dx.strokeStyle = 'rgba(0,0,0,0.45)'; dx.beginPath(); dx.moveTo(S.last.x, S.last.y); dx.lineTo(px, py); dx.stroke(); }
        dx.globalCompositeOperation = 'source-over'; S.last = { x: px, y: py }; S.sx = x; S.sy = y;
        if (Math.random() < 0.4) P.burst(x, y, 1, { col: ['#fff', '#CFE0F5'], speed: 100, life: 0.7, size: 9, g: -80 });
        if (Math.random() < 0.15) api.sfx('tick');
      }
      function measure() { const d = dx.getImageData(0, 0, DW, DH).data; let n = 0, tot = 0; for (let i = 3; i < d.length; i += 16) { tot++; if (d[i] < 60) n++; } S.pct = n / tot; api.hud('pulito', Math.round(S.pct * 100) + '%'); }
      return {
        down(x, y) { S.on = true; S.last = null; scrub(x, y); }, move(x, y) { if (S.on) scrub(x, y); }, up() { S.on = false; S.last = null; },
        update(dt) { S.t += dt; P.update(dt); S.chk += dt; if (S.chk > 0.25) { S.chk = 0; measure(); if (S.pct >= 0.92) { api.sfx('fanfare'); const st = S.t < v.time * 0.55 ? 3 : S.t < v.time * 0.8 ? 2 : 1; api.finish({ stars: st, score: Math.round(1200 - S.t * 20 + S.pct * 300), detail: `Brillante in ${S.t.toFixed(1)} s` }); S.chk = -99; } } api.hud('tempo', Math.max(0, Math.ceil(v.time - S.t)), v.time - S.t < 8 ? 'bad' : ''); if (S.t >= v.time && S.chk > -90) { S.chk = -99; api.finish({ stars: S.pct > 0.75 ? 1 : 0, score: Math.round(S.pct * 600), detail: `Pulito al ${Math.round(S.pct * 100)}%` }); } },
        draw(c) {
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#CFE0F5'], [1, '#9DB9E6']]); c.fillRect(0, 0, 1280, 720);
          G.box(c, 140, 60, 1000, 600, 40, G.steel(c, 140, 60, 1140, 660), 6);
          c.save(); G.rr(c, 140, 60, 1000, 600, 40); c.clip();
          c.fillStyle = G.lin(c, 140, 60, 1140, 660, [[0, '#F8FAFC'], [0.4, '#C3CDD9'], [0.7, '#F1F5F9'], [1, '#A9B5C4']]); c.fillRect(140, 60, 1000, 600);
          G.drawImgFit(c, G.svgImg(A.sprite(v.spr), 400, 400), 290, 110, 700, 500);
          c.globalAlpha = 0.5; c.fillStyle = '#fff'; c.beginPath(); c.moveTo(200, 60); c.lineTo(420, 60); c.lineTo(260, 660); c.lineTo(140, 660); c.fill(); c.globalAlpha = 1;
          c.imageSmoothingEnabled = true; c.drawImage(dc, 140, 60, 1000, 600);
          c.restore(); c.lineWidth = 6; c.strokeStyle = NAVY; G.rr(c, 140, 60, 1000, 600, 40); c.stroke();
          // spugna
          if (S.on || S.t < 99) { c.save(); c.translate(S.sx, S.sy); c.rotate(-0.2); G.box(c, -50, -28, 100, 56, 14, '#F2C340', 5); c.fillStyle = '#3FA06A'; c.fillRect(-46, 2, 92, 22); G.circ(c, -20, -12, 3, '#C99A1E', 0); G.circ(c, 14, -8, 4, '#C99A1E', 0); G.circ(c, 26, -16, 3, '#C99A1E', 0); c.restore(); }
          P.draw(c);
          if (S.t < 3.5 && S.pct < 0.05) G.disp(c, 'STROFINA PER PULIRE!', 640, 360, { size: 60 });
          G.box(c, 480, 676, 320, 24, 12, '#fff', 4); G.box(c, 484, 680, Math.max(0, 312 * BQ.clamp(S.pct / 0.92, 0, 1)), 16, 8, '#3FA06A', 0);
        },
      };
    },
  });

  /* =========================================================
     CONSEGNE — corsa in furgone
     ========================================================= */
  M.register('runner', {
    name: 'Consegna a domicilio', icon: 'van', tint: '#FBE2C4',
    blurb: 'Guida il furgone Brambilla per le strade della Brianza: raccogli i pacchi e schiva il traffico!',
    howto: [['Cambia corsia', 'scorri a destra/sinistra (o tasti ← →)'], ['Pacchi', 'raccoglili per completare le consegne'], ['Evita', 'auto, coni e cantieri: hai 3 vite']],
    variants: {
      consegne: { label: 'Giro di consegne', goal: 12, time: 45, brief: 'Consegna 12 pacchi ai clienti di Monza e Brianza.' },
      inseguimento: { label: 'Inseguimento!', goal: 14, time: 50, chase: 1, brief: 'Ottavio Trucco scappa con la Lama d\'Oro! Raccogli i turbo e raggiungilo prima del casello.' },
    },
    create(api, v) {
      const rng = api.rng, P = G.Particles();
      const lanes = [480, 640, 800];
      const S = { lane: 1, x: 640, t: 0, items: [], spawn: 0.3, lives: 3, boxes: 0, sp: 480, off: 0, score: 0, inv: 0, gap: 620, sx: null, rx: 640 };
      api.hud('pacchi', `0/${v.goal}`); api.hud('vite', '♥♥♥');
      function mk() {
        const r = rng(), lane = rng.int(0, 2);
        const type = r < 0.42 ? 'box' : r < 0.52 ? 'turbo' : r < 0.78 ? 'car' : r < 0.9 ? 'cone' : 'work';
        S.items.push({ type, lane, y: -120, col: rng.pick(['#3FA06A', '#215FD6', '#F2C340', '#7A5CD0', '#FF8A1E']), done: false });
      }
      function move(d) { S.lane = BQ.clamp(S.lane + d, 0, 2); api.sfx('whoosh'); }
      let sx = null;
      return {
        down(x) { sx = x; }, move(x) { if (sx != null && Math.abs(x - sx) > 60) { move(x > sx ? 1 : -1); sx = x; } }, up(x, y, e) { if (sx != null && Math.abs(x - sx) <= 60) { move(x > 640 ? 1 : -1); } sx = null; },
        key(k, dn) { if (!dn) return; if (k === 'ArrowLeft' || k === 'a') move(-1); else if (k === 'ArrowRight' || k === 'd') move(1); },
        update(dt) {
          S.t += dt; S.off += S.sp * dt; P.update(dt); if (S.inv > 0) S.inv -= dt;
          S.sp = 460 + Math.min(260, S.t * 6) + (S.turbo > 0 ? 200 : 0); if (S.turbo > 0) S.turbo -= dt;
          S.x += (lanes[S.lane] - S.x) * Math.min(1, dt * 14);
          S.spawn -= dt; if (S.spawn <= 0) { mk(); S.spawn = Math.max(0.32, 0.8 - S.t / 100); }
          for (const it of S.items) {
            it.y += S.sp * dt;
            if (it.done) continue;
            if (Math.abs(lanes[it.lane] - S.x) < 70 && Math.abs(it.y - 580) < 70) {
              it.done = true;
              if (it.type === 'box') { S.boxes++; S.score += 20; api.sfx('coin'); P.text(S.x, 520, '+1', '#FFE58A', 44); api.hud('pacchi', `${S.boxes}/${v.goal}`); if (v.chase) S.gap = Math.max(0, S.gap - 600 / v.goal); }
              else if (it.type === 'turbo') { S.turbo = 2; S.score += 15; api.sfx('whoosh'); if (v.chase) S.gap = Math.max(0, S.gap - 120); }
              else if (S.inv <= 0) { S.lives--; S.inv = 1.2; api.sfx('thunk'); api.vib(150); P.burst(S.x, 580, 20, { col: ['#fff', '#F2C340', '#888'], speed: 400 }); api.hud('vite', '♥'.repeat(Math.max(0, S.lives)) + '♡'.repeat(3 - Math.max(0, S.lives)), 'bad'); if (v.chase) S.gap += 90; if (S.lives <= 0) return end(true); }
            }
          }
          S.items = S.items.filter((it) => it.y < 860);
          if (v.chase) { S.gap -= dt * 8; S.gap = BQ.clamp(S.gap, 0, 900); }
          api.hud('tempo', Math.max(0, Math.ceil(v.time - S.t)), v.time - S.t < 8 ? 'bad' : '');
          if ((v.chase ? S.gap <= 0 : S.boxes >= v.goal)) return end(false, true);
          if (S.t >= v.time) end(false);
        },
        draw(c) {
          c.fillStyle = '#4E9A5C'; c.fillRect(0, 0, 1280, 720);
          c.fillStyle = '#3F8850'; for (let i = 0; i < 12; i++) { const y = ((i * 130 + S.off * 0.6) % 820) - 60; G.circ(c, 200 + (i % 2) * 40, y, 40, '#3F8850', 0); G.circ(c, 1080 - (i % 2) * 30, y + 40, 46, '#3F8850', 0); }
          c.fillStyle = '#4A5160'; c.fillRect(380, 0, 520, 720); c.fillStyle = '#E6E0D0'; c.fillRect(372, 0, 10, 720); c.fillRect(898, 0, 10, 720);
          c.fillStyle = '#F2E7B8'; for (const lx of [560, 720]) for (let y = -80 + (S.off % 160); y < 740; y += 160) c.fillRect(lx - 4, y, 8, 80);
          for (const it of S.items) {
            const x = lanes[it.lane], y = it.y;
            if (it.type === 'box') { if (!it.done) { G.shadow(c, x, y + 30, 40, 10, 0.3); G.box(c, x - 36, y - 32, 72, 64, 8, '#D9A566', 5); c.strokeStyle = NAVY; c.lineWidth = 4; c.beginPath(); c.moveTo(x, y - 32); c.lineTo(x, y + 32); c.stroke(); G.box(c, x - 14, y - 10, 28, 20, 4, '#fff', 3); } }
            else if (it.type === 'turbo') { if (!it.done) { G.circ(c, x, y, 34, '#FFE58A', 5); G.disp(c, '⚡', x, y + 2, { size: 40, color: '#E11D2E', stroke: false }); } }
            else if (it.type === 'car') { G.box(c, x - 40, y - 70, 80, 140, 18, it.col, 5); G.box(c, x - 30, y - 40, 60, 34, 8, '#BFE0F5', 3); G.box(c, x - 30, y + 14, 60, 26, 8, '#BFE0F5', 3); }
            else if (it.type === 'cone') { c.beginPath(); c.moveTo(x - 26, y + 30); c.lineTo(x + 26, y + 30); c.lineTo(x + 8, y - 34); c.lineTo(x - 8, y - 34); c.closePath(); c.fillStyle = '#FF8A1E'; c.fill(); c.lineWidth = 4; c.strokeStyle = NAVY; c.stroke(); c.fillStyle = '#fff'; c.fillRect(x - 15, y - 6, 30, 10); }
            else { G.box(c, x - 60, y - 24, 120, 48, 8, '#F2C340', 5); c.fillStyle = NAVY; for (let i = 0; i < 4; i++) c.fillRect(x - 54 + i * 30, y - 20, 14, 40); }
          }
          // ottavio (inseguimento)
          if (v.chase) { const gy = 580 - BQ.clamp(S.gap, 0, 900) * 0.95 - 20; if (gy > -80) { G.box(c, S.x - 40 + Math.sin(S.t * 3) * 40, gy - 70, 80, 140, 18, '#C79A1F', 5); G.box(c, S.x - 30 + Math.sin(S.t * 3) * 40, gy - 40, 60, 34, 8, '#3B3342', 3); G.disp(c, 'O.T.', S.x + Math.sin(S.t * 3) * 40, gy + 34, { size: 24, color: NAVY, stroke: false }); } }
          // furgone
          if (S.inv <= 0 || Math.floor(S.t * 12) % 2) {
            if (S.turbo > 0) { c.fillStyle = 'rgba(255,200,80,.8)'; c.beginPath(); c.moveTo(S.x - 26, 660); c.lineTo(S.x, 740 + Math.random() * 30); c.lineTo(S.x + 26, 660); c.fill(); }
            G.shadow(c, S.x, 650, 50, 12, 0.3); G.box(c, S.x - 42, 500, 84, 160, 16, '#fff', 5); G.box(c, S.x - 34, 512, 68, 34, 8, '#9BD1F5', 3); c.fillStyle = '#E11D2E'; c.fillRect(S.x - 42, 590, 84, 16); G.circ(c, S.x, 560, 14, '#E11D2E', 3); G.disp(c, 'AB', S.x, 562, { size: 16, stroke: false });
          }
          P.draw(c);
          if (v.chase) { G.box(c, 960, 100, 290, 30, 15, '#fff', 4); G.box(c, 964, 104, Math.max(0, 282 * (1 - S.gap / 620)), 22, 11, '#E11D2E', 0); G.text(c, 'DISTANZA DA OTTAVIO', 1105, 150, { size: 18 }); }
          if (S.t < 3) G.disp(c, 'SCORRI PER CAMBIARE CORSIA', 640, 200, { size: 48 });
        },
      };
      function end(dead, win) {
        const g = v.chase ? (win ? 3 : 0) : (S.boxes >= v.goal ? (S.lives === 3 ? 3 : S.lives === 2 ? 2 : 2) : S.boxes >= v.goal * 0.6 ? 1 : 0);
        const st = v.chase ? (win ? (S.lives >= 2 ? 3 : 2) : (S.gap < 200 ? 1 : 0)) : g;
        api.finish({ stars: dead ? (S.boxes >= v.goal * 0.5 && !v.chase ? 1 : 0) : st, score: S.score + S.lives * 50, detail: v.chase ? (win ? 'Hai raggiunto Ottavio!' : 'Ottavio è sfuggito…') : `${S.boxes} consegne`, title: dead ? 'Furgone ammaccato!' : undefined });
      }
    },
  });

  /* =========================================================
     QUIZ — scheda tecnica / indovina la foto (dai dati del catalogo)
     ========================================================= */
  M.register('quiz', {
    name: 'Scheda tecnica', icon: 'i_book', tint: '#E2DAF5',
    blurb: 'Conosci davvero i nostri prodotti? Abbina la scheda giusta (o la foto giusta) a ogni articolo.',
    howto: [['Leggi', 'il nome del prodotto'], ['Scegli', 'la risposta giusta tra tre'], ['Serie', 'più risposte di fila = più punti']],
    variants: { scheda: { label: 'Abbina la scheda', mode: 'spec', n: 5 }, foto: { label: 'Indovina la foto', mode: 'photo', n: 5 } },
    create(api, v) {
      const rng = api.rng, P = G.Particles();
      const all = BQ_ITEMS_ALL(); const subj = api.opts.item || all[0];
      const same = all.filter((x) => x.r === subj.r && x !== subj && (v.mode === 'photo' || (x.s && x.s.length > 12 && x.s !== subj.s)));
      const specOK = (x) => x.s && x.s.length > 12;
      let qs = [];
      const cand = rng.shuffle(all.filter((x) => x.r === subj.r && (v.mode === 'photo' || specOK(x)))); if (!cand.includes(subj) && (v.mode === 'photo' || specOK(subj))) cand.unshift(subj); else if (cand.includes(subj)) { cand.splice(cand.indexOf(subj), 1); cand.unshift(subj); }
      const pool = all.filter((x) => v.mode === 'photo' || specOK(x));
      for (const it of cand.slice(0, v.n)) {
        const others = rng.shuffle(pool.filter((x) => x !== it && (v.mode === 'photo' ? x.i !== it.i : x.s !== it.s))).slice(0, 2);
        const opts = rng.shuffle([it].concat(others)); qs.push({ it, opts, ans: opts.indexOf(it) });
      }
      while (qs.length < 3) qs.push(qs[0]);
      const S = { i: 0, score: 0, ok: 0, streak: 0, sel: -1, t: 0, lock: 0 };
      api.hud('domanda', `1/${qs.length}`); api.hud('punti', 0);
      const short = (s) => { s = s.replace(/\s+/g, ' '); return s.length > 120 ? s.slice(0, 118).replace(/\s\S*$/, '') + '…' : s; };
      const rects = v.mode === 'spec' ? [0, 1, 2].map((i) => [70, 330 + i * 120, 1140, 104]) : [0, 1, 2].map((i) => [90 + i * 380, 330, 340, 300]);
      qs.forEach((q) => q.opts.forEach((o) => G.img(PHOTO(o))));
      const inR = (r, x, y) => x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3];
      function pick(i) {
        if (S.sel >= 0) return; S.sel = i; const q = qs[S.i], ok = i === q.ans; S.lock = 1.1;
        if (ok) { S.ok++; S.streak++; S.score += 100 + S.streak * 20; api.sfx('ding'); P.burst(rects[i][0] + rects[i][2] / 2, rects[i][1] + rects[i][3] / 2, 16, { col: ['#8EF08E', '#fff'], speed: 320 }); } else { S.streak = 0; api.sfx('bad'); }
        api.hud('punti', S.score);
      }
      return {
        down(x, y) { if (S.sel >= 0) return; rects.forEach((r, i) => { if (inR(r, x, y)) pick(i); }); },
        key(k, dn) { if (dn && '123'.includes(k) && k) pick(+k - 1); },
        update(dt) { S.t += dt; P.update(dt); if (S.sel >= 0) { S.lock -= dt; if (S.lock <= 0) { S.i++; S.sel = -1; if (S.i >= qs.length) { const r = S.ok / qs.length; api.finish({ stars: r >= 0.99 ? 3 : r >= 0.6 ? 2 : r >= 0.4 ? 1 : 0, score: S.score, detail: `${S.ok} risposte giuste su ${qs.length}` }); S.i = qs.length - 1; S.sel = 99; } else api.hud('domanda', `${S.i + 1}/${qs.length}`); } } },
        draw(c) {
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#E2DAF5'], [1, '#B9A9E6']]); c.fillRect(0, 0, 1280, 720);
          const q = qs[Math.min(S.i, qs.length - 1)];
          G.box(c, 70, 24, 1140, v.mode === 'spec' ? 290 : 280, 26, '#fff', 5);
          if (v.mode === 'spec') { G.box(c, 100, 50, 240, 240, 16, '#fff', 4); G.drawImgFit(c, G.img(PHOTO(q.it)), 108, 58, 224, 224); G.text(c, 'QUALE SCHEDA TECNICA È GIUSTA?', 370, 74, { size: 24, align: 'left', color: '#E11D2E', stroke: false }); G.wrapText(c, q.it.t, 370, 160, 800, 46, NAVY); }
          else { G.text(c, 'QUALE FOTO È…', 640, 70, { size: 26, color: '#E11D2E', stroke: false }); G.wrapText(c, q.it.t, 640, 160, 1000, 52, NAVY); c.textAlign = 'center'; }
          q.opts.forEach((o, i) => {
            const r = rects[i]; const chosen = S.sel === i, right = i === q.ans, show = S.sel >= 0;
            G.box(c, r[0], r[1], r[2], r[3], 20, show ? (right ? '#9BE7B5' : chosen ? '#FF9CA4' : '#fff') : '#fff', 5);
            if (v.mode === 'spec') { G.disp(c, String(i + 1), r[0] + 40, r[1] + r[3] / 2, { size: 50, color: '#E11D2E', stroke: false }); c.textAlign = 'left'; G.wrapText(c, short(o.s), r[0] + 86, r[1] + r[3] / 2, r[2] - 110, 30, NAVY); }
            else { G.drawImgFit(c, G.img(PHOTO(o)), r[0] + 14, r[1] + 14, r[2] - 28, r[3] - 28); G.disp(c, String(i + 1), r[0] + 30, r[1] + 34, { size: 40, color: '#E11D2E' }); }
          });
          P.draw(c);
        },
      };
    },
  });

  /* =========================================================
     MONTAGGIO — trascina i pezzi
     ========================================================= */
  M.register('assemble', {
    name: 'Monta i pezzi', icon: 'goldblade', tint: '#FFF0C2',
    blurb: 'Trascina ogni pezzo al suo posto: il puzzle va completato senza errori!',
    howto: [['Trascina', 'il pezzo verso il suo spazio vuoto'], ['Aggancio', 'se è vicino e giusto, scatta al suo posto'], ['Tempo', 'completa il puzzle il più in fretta possibile']],
    variants: {
      lama: { label: 'La Lama d\'Oro', kind: 'blade', time: 60, brief: 'Ricomponi la Lama d\'Oro con i sei frammenti!' },
      tritacarne: { label: 'Monta il tritacarne', kind: 'grinder', time: 45, brief: 'Monta i pezzi nell\'ordine: vite, coltello, piastra, ghiera.' },
      bilancia: { label: 'Bilancia d\'epoca', kind: 'scale', time: 50, brief: 'Rimonta la bilancia d\'epoca pezzo dopo pezzo.' },
    },
    create(api, v) {
      const rng = api.rng, P = G.Particles();
      const S = { t: 0, placed: 0, drag: null, errors: 0, pieces: [], done: false };
      const cx = 520, cy = 380, R = 250;
      if (v.kind === 'blade') {
        for (let i = 0; i < 6; i++) { S.pieces.push({ i, tx: cx, ty: cy, x: 960 + (i % 2) * 200 + rng() * 30, y: 140 + Math.floor(i / 2) * 190 + rng() * 30, rot: 0, placed: false }); }
      } else {
        const names = { grinder: ['vite', 'coltello', 'piastra', 'ghiera'], scale: ['base', 'colonna', 'piatto', 'display'] }[v.kind];
        names.forEach((nm, i) => S.pieces.push({ i, nm, tx: cx, ty: 150 + i * 120 + 40, x: 900 + rng() * 180, y: 130 + ((i * 3) % 4) * 130, placed: false, w: 240, h: 92 }));
        S.order = true;
      }
      api.hud('pezzi', `0/${S.pieces.length}`); api.hud('errori', 0);
      const nextIdx = () => S.pieces.findIndex((p) => !p.placed);
      function dist(p) { return Math.hypot(p.x - p.tx, p.y - p.ty); }
      return {
        down(x, y) { if (S.done) return; for (let k = S.pieces.length - 1; k >= 0; k--) { const p = S.pieces[k]; if (p.placed) continue; const hit = v.kind === 'blade' ? Math.hypot(x - p.x, y - p.y) < 80 : (Math.abs(x - p.x) < p.w / 2 && Math.abs(y - p.y) < p.h / 2); if (hit) { S.drag = { p, ox: p.x - x, oy: p.y - y }; api.sfx('tap'); break; } } },
        move(x, y) { if (S.drag) { S.drag.p.x = x + S.drag.ox; S.drag.p.y = y + S.drag.oy; } },
        up() {
          const d = S.drag; S.drag = null; if (!d) return; const p = d.p;
          if (v.kind === 'blade') { const home = pieceHome(p); if (Math.hypot(p.x - home.x, p.y - home.y) < 90) { p.placed = true; p.x = home.x; p.y = home.y; S.placed++; api.sfx('ding'); P.burst(home.x, home.y, 12, { col: ['#FFE58A', '#fff'], speed: 280 }); } else if (Math.hypot(p.x - cx, p.y - cy) < R) { S.errors++; api.hud('errori', S.errors); api.sfx('bad'); } }
          else { if (Math.abs(p.y - p.ty) < 55 && Math.abs(p.x - p.tx) < 120) { if (p.i === nextIdx()) { p.placed = true; p.x = p.tx; p.y = p.ty; S.placed++; api.sfx('thunk'); } else { S.errors++; api.hud('errori', S.errors); api.sfx('bad'); } } }
          api.hud('pezzi', `${S.placed}/${S.pieces.length}`);
          if (S.placed >= S.pieces.length) { S.done = true; api.sfx('fanfare'); const st = S.errors === 0 && S.t < v.time * 0.7 ? 3 : S.errors <= 2 ? 2 : 1; setTimeout(() => api.finish({ stars: st, score: Math.max(200, Math.round(1500 - S.t * 12 - S.errors * 80)), detail: `${S.errors} errori · ${S.t.toFixed(0)} s` }), 600); }
        },
        update(dt) { S.t += dt; P.update(dt); api.hud('tempo', Math.max(0, Math.ceil(v.time - S.t)), v.time - S.t < 10 ? 'bad' : ''); if (S.t >= v.time && !S.done) { S.done = true; api.finish({ stars: S.placed >= S.pieces.length * 0.6 ? 1 : 0, score: S.placed * 100, detail: `${S.placed} pezzi su ${S.pieces.length}` }); } },
        draw(c) {
          c.fillStyle = G.lin(c, 0, 0, 0, 720, [[0, '#FFF0C2'], [1, '#F0CE77']]); c.fillRect(0, 0, 1280, 720);
          if (v.kind === 'blade') {
            G.circ(c, cx, cy, R, 'rgba(10,27,63,.12)', 0); c.setLineDash([18, 12]); c.strokeStyle = 'rgba(10,27,63,.4)'; c.lineWidth = 5; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke(); c.setLineDash([]);
            for (const p of S.pieces) { const h = pieceHome(p); c.save(); place(c, p.i, h.x, h.y, 1); drawPiece(c, p.i, 0.3, true); c.restore(); }
            for (const p of S.pieces) { const h = pieceHome(p); const sc = p.placed ? 1 : BQ.clamp(0.5 + (1 - Math.min(1, Math.hypot(p.x - h.x, p.y - h.y) / 380)) * 0.5, 0.5, 1); c.save(); place(c, p.i, p.x, p.y, sc); drawPiece(c, p.i, 1, false, p.placed); c.restore(); }
            G.circ(c, cx, cy, 34, '#E11D2E', 5); G.circ(c, cx, cy, 10, NAVY, 0);
          } else {
            for (const p of S.pieces) { G.box(c, p.tx - p.w / 2, p.ty - p.h / 2, p.w, p.h, 16, p.i === nextIdx() ? 'rgba(255,255,255,.7)' : 'rgba(10,27,63,.1)', 4); G.text(c, String(p.i + 1), p.tx - p.w / 2 - 30, p.ty, { size: 36, color: NAVY, stroke: false }); }
            for (const p of S.pieces) { const k = S.drag && S.drag.p === p ? 1.06 : 1; G.box(c, p.x - p.w / 2 * k, p.y - p.h / 2 * k, p.w * k, p.h * k, 16, p.placed ? '#9BE7B5' : G.steel(c, 0, p.y - 40, 0, p.y + 40), 5); G.disp(c, p.nm.toUpperCase(), p.x, p.y + 3, { size: 38, color: NAVY, stroke: false }); }
          }
          P.draw(c);
          if (S.t < 4) G.disp(c, 'TRASCINA I PEZZI', 640, 40, { size: 40, color: NAVY, stroke: false });
        },
      };
      function pieceHome(p) { const a = ((p.i * 60 + 30) - 90) * Math.PI / 180; return { x: cx + Math.cos(a) * 130, y: cy + Math.sin(a) * 130 }; }
      function place(c, i, x, y, sc) { const a = ((i * 60 + 30) - 90) * Math.PI / 180; c.translate(x - Math.cos(a) * 130 * sc, y - Math.sin(a) * 130 * sc); c.scale(sc, sc); }
      function drawPiece(c, i, alpha, ghost, placed) {
        const a0 = (i * 60 - 90) * Math.PI / 180, a1 = ((i + 1) * 60 - 90) * Math.PI / 180;
        c.save(); c.globalAlpha = alpha; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, R - 8, a0, a1); c.closePath();
        c.fillStyle = ghost ? '#fff' : G.lin(c, -R, -R, R, R, [[0, '#FFF6BF'], [0.4, '#F2C340'], [0.7, '#FFE58A'], [1, '#B88418']]); c.fill(); c.lineWidth = 5; c.strokeStyle = NAVY; c.stroke();
        if (!ghost) { c.strokeStyle = 'rgba(154,107,18,.45)'; c.lineWidth = 3; for (const k of [0.5, 0.72, 0.9]) { c.beginPath(); c.arc(0, 0, (R - 8) * k, a0, a1); c.stroke(); } }
        c.restore();
      }
    },
  });
})();
