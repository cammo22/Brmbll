/* =========================================================
   BRAMBILLA QUEST — guscio dei minigiochi + utilità di disegno
   Area logica 1280x720, scalata a tutto schermo (touch/mouse/tastiera)
   ========================================================= */
(function () {
  'use strict';
  const BQ = window.BQ, $ = BQ.$, el = BQ.el, A = BQ.art;
  const NAVY = '#0A1B3F';

  /* ---------- helper di disegno (canvas) ---------- */
  const G = (BQ.g = {});
  G.NAVY = NAVY;
  G.rr = function (c, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  };
  G.box = function (c, x, y, w, h, r, fill, lw) { G.rr(c, x, y, w, h, r); c.fillStyle = fill; c.fill(); if (lw !== 0) { c.lineWidth = lw || 5; c.strokeStyle = NAVY; c.stroke(); } };
  G.circ = function (c, x, y, r, fill, lw) { c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fillStyle = fill; c.fill(); if (lw !== 0) { c.lineWidth = lw || 5; c.strokeStyle = NAVY; c.stroke(); } };
  G.ell = function (c, x, y, rx, ry, fill, lw, rot) { c.beginPath(); c.ellipse(x, y, rx, ry, rot || 0, 0, 6.2832); c.fillStyle = fill; c.fill(); if (lw !== 0) { c.lineWidth = lw || 5; c.strokeStyle = NAVY; c.stroke(); } };
  G.lin = function (c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach((s, i) => g.addColorStop(s[0] != null && typeof s[0] === 'number' ? s[0] : i / (stops.length - 1), s[1] || s)); return g; };
  G.text = function (c, t, x, y, o) {
    o = o || {};
    c.save(); c.font = (o.weight || '800') + ' ' + (o.size || 36) + 'px ' + (o.font || 'Archivo, sans-serif'); c.textAlign = o.align || 'center'; c.textBaseline = o.base || 'middle';
    if (o.stroke !== false) { c.lineWidth = o.lw || (o.size || 36) / 5; c.strokeStyle = o.strokeC || NAVY; c.lineJoin = 'round'; c.strokeText(t, x, y); }
    c.fillStyle = o.color || '#fff'; c.fillText(t, x, y); c.restore();
  };
  G.disp = (c, t, x, y, o) => G.text(c, t, x, y, Object.assign({ font: 'Anton, Impact, sans-serif', weight: '400' }, o));
  G.mono = (c, t, x, y, o) => G.text(c, t, x, y, Object.assign({ font: 'JetBrains Mono, monospace', weight: '700', stroke: false }, o));
  G.steel = (c, x0, y0, x1, y1) => G.lin(c, x0, y0, x1, y1, [[0, '#F8FAFC'], [0.3, '#C3CDD9'], [0.55, '#F1F5F9'], [0.8, '#8E9BAB'], [1, '#C9D2DD']]);
  G.shadow = (c, x, y, rx, ry, a) => { c.save(); c.globalAlpha = a == null ? 0.25 : a; G.ell(c, x, y, rx, ry, NAVY, 0); c.restore(); };
  G.lcd = function (c, x, y, w, h, t, size) {
    G.box(c, x, y, w, h, 12, '#1B2109', 5);
    c.save(); c.shadowColor = 'rgba(217,232,47,.7)'; c.shadowBlur = 14;
    G.mono(c, t, x + w - 14, y + h / 2 + 2, { size: size || h * 0.62, align: 'right', color: '#D9E82F' }); c.restore();
  };
  G.star = function (c, x, y, r, fill) {
    c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fillStyle = fill; c.fill(); c.lineWidth = 4; c.strokeStyle = NAVY; c.lineJoin = 'round'; c.stroke();
  };
  // immagini in cache (foto catalogo, sprite SVG)
  const imgCache = {};
  G.img = function (src) {
    if (imgCache[src]) return imgCache[src];
    const im = new Image(); im.decoding = 'async'; im.src = src; imgCache[src] = im; return im;
  };
  G.svgImg = function (svg, w, h) {
    const key = svg.length + ':' + BQ.hash(svg) + ':' + w + 'x' + h;
    if (imgCache[key]) return imgCache[key];
    // le sprite usano gradienti globali: li inlineiamo
    const s = svg.replace(/ xmlns="[^"]*"/g, '').replace(/^<svg/, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"`).replace(/^(<svg[^>]*>)/, '$1' + INLINE_DEFS);
    const im = new Image(); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); imgCache[key] = im; return im;
  };
  const INLINE_DEFS = A.DEFS.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  G.drawImgFit = function (c, im, x, y, w, h) {
    if (!im || !im.complete || !im.naturalWidth) return;
    const k = Math.min(w / im.naturalWidth, h / im.naturalHeight), iw = im.naturalWidth * k, ih = im.naturalHeight * k;
    c.drawImage(im, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  };

  /* particelle */
  G.Particles = function () {
    const ps = [];
    return {
      burst(x, y, n, o) {
        o = o || {};
        for (let i = 0; i < n; i++) {
          const a = (o.angle != null ? o.angle : Math.random() * 6.28) + (Math.random() - 0.5) * (o.spread == null ? 6.28 : o.spread), sp = (o.speed || 300) * (0.3 + Math.random() * 0.9);
          ps.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: (o.life || 0.7) * (0.6 + Math.random() * 0.6), col: Array.isArray(o.col) ? o.col[i % o.col.length] : (o.col || '#FFE58A'), s: (o.size || 8) * (0.5 + Math.random()), g: o.g == null ? 600 : o.g, sq: o.square });
        }
      },
      text(x, y, t, col, size) { ps.push({ x, y, vx: 0, vy: -90, life: 0, max: 0.95, txt: t, col: col || '#fff', s: size || 44, g: 0 }); },
      update(dt) { for (let i = ps.length - 1; i >= 0; i--) { const p = ps[i]; p.life += dt; if (p.life > p.max) { ps.splice(i, 1); continue; } p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; } },
      draw(c) {
        for (const p of ps) {
          const a = 1 - p.life / p.max; c.globalAlpha = Math.max(0, Math.min(1, a * 1.4));
          if (p.txt) G.disp(c, p.txt, p.x, p.y, { size: p.s, color: p.col });
          else if (p.sq) { c.fillStyle = p.col; c.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s); }
          else { c.fillStyle = p.col; c.beginPath(); c.arc(p.x, p.y, p.s * a + 1, 0, 6.28); c.fill(); }
        }
        c.globalAlpha = 1;
      },
      get n() { return ps.length; },
    };
  };

  /* ---------- guscio ---------- */
  const M = (BQ.mini = { games: {} });
  M.register = function (id, def) { def.id = id; M.games[id] = def; };

  const isTouch = () => BQ.env.touch;
  let active = null;

  M.play = function (id, variant, opts) {
    opts = opts || {};
    const def = M.games[id];
    if (!def) return Promise.resolve({ stars: 0, quit: true });
    if (active) return Promise.resolve({ stars: 0, quit: true });
    let v = typeof variant === 'string' ? Object.assign({ key: variant }, def.variants && def.variants[variant]) : Object.assign({}, variant);
    if (def.variants && v.key && typeof variant !== 'string') v = Object.assign({}, def.variants[v.key] || {}, v);
    return new Promise((resolve) => {
      const layer = $('#layer-mini');
      layer.hidden = false; layer.innerHTML = '';
      BQ.audio.duck(true);
      const seed = opts.seed != null ? opts.seed : (Date.now() & 0xffff);
      const root = el('div', { class: 'mg' });
      const wrap = el('div', { class: 'mg-stagewrap' });
      const stage = el('div', { class: 'mg-stage' });
      const canvas = el('canvas', { width: 1280, height: 720 });
      const dom = el('div', { class: 'mg-dom' });
      stage.append(canvas, dom);
      const scaler = el('div', { style: { position: 'relative', flex: 'none' } }, stage); wrap.append(scaler);
      const hudTitle = el('div', { class: 'mg-title', text: opts.title || def.name });
      const hudStats = el('div', { class: 'mg-stats' });
      const btnPause = el('button', { class: 'iconbtn', 'aria-label': 'Pausa', html: A.ico('pause') });
      const btnClose = el('button', { class: 'iconbtn', 'aria-label': 'Esci', html: A.ico('close') });
      const hud = el('div', { class: 'mg-hud' }, hudTitle, hudStats, btnPause, btnClose);
      root.append(wrap, hud); layer.append(root);

      const ctx = canvas.getContext('2d');
      let k = 1, scale = 1, inst = null, raf = 0, last = 0, running = false, paused = false, finished = false, startT = 0, elapsed = 0, over = null;
      const stats = {};
      const unfit = BQ.ui.fit(wrap, stage, 1280, 720, (kk) => {
        k = kk; scale = Math.min(2.5, Math.max(1, (window.devicePixelRatio || 1) * kk));
        canvas.width = Math.round(1280 * scale); canvas.height = Math.round(720 * scale);
      });

      const api = {
        W: 1280, H: 720, canvas, ctx, dom, v, opts, seed, rng: BQ.rng(seed), def,
        get time() { return elapsed; },
        sfx: BQ.audio.sfx, vib: BQ.vibrate, g: G,
        hud(key, val, cls) {
          let s = stats[key];
          if (!s) { s = stats[key] = el('div', { class: 'mg-stat' }, el('span', { class: 'v' }), el('small', { text: key })); hudStats.append(s); }
          s.firstChild.textContent = val; s.classList.toggle('bad', cls === 'bad');
        },
        hudClear() { hudStats.innerHTML = ''; for (const kk in stats) delete stats[kk]; },
        finish(res) { endGame(res); },
        img: G.img,
      };

      function pt(e) { const r = stage.getBoundingClientRect(); return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k, id: e.pointerId, e }; }
      const onDown = (e) => { if (!running || paused) return; if (e.target.closest('.g-btn,button,input,a')) return; const p = pt(e); try { stage.setPointerCapture(e.pointerId); } catch (x) { /* */ } inst && inst.down && inst.down(p.x, p.y, p); };
      const onMove = (e) => { if (!running || paused) return; const p = pt(e); inst && inst.move && inst.move(p.x, p.y, p); };
      const onUp = (e) => { if (!running || paused) return; const p = pt(e); inst && inst.up && inst.up(p.x, p.y, p); };
      stage.addEventListener('pointerdown', onDown); stage.addEventListener('pointermove', onMove); stage.addEventListener('pointerup', onUp); stage.addEventListener('pointercancel', onUp);
      stage.addEventListener('contextmenu', (e) => e.preventDefault());
      const onKey = (e) => {
        if (e.key === 'Escape') { e.preventDefault(); if (running && !finished) togglePause(); return; }
        if (!running || paused) return;
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault();
        inst && inst.key && inst.key(e.key, e.type === 'keydown', e);
      };
      document.addEventListener('keydown', onKey); document.addEventListener('keyup', onKey);
      const onVis = () => { if (document.hidden && running && !finished && !paused) togglePause(); };
      document.addEventListener('visibilitychange', onVis);

      function frame(t) {
        raf = requestAnimationFrame(frame);
        if (!running || paused) { last = t; return; }
        const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t; elapsed += dt;
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        if (inst.update) inst.update(dt);
        if (!inst.noclear) ctx.clearRect(0, 0, 1280, 720);
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        if (inst.draw) inst.draw(ctx);
      }

      function cleanup(result) {
        cancelAnimationFrame(raf); running = false;
        unfit(); if (inst && inst.destroy) { try { inst.destroy(); } catch (e) { /* */ } }
        document.removeEventListener('keydown', onKey); document.removeEventListener('keyup', onKey); document.removeEventListener('visibilitychange', onVis);
        layer.hidden = true; layer.innerHTML = ''; active = null; BQ.audio.duck(false);
        resolve(result);
      }

      function card(html, cls) {
        if (over) over.remove();
        over = el('div', { class: 'mg-over' }, el('div', { class: 'mg-card ' + (cls || ''), html }));
        wrap.append(over); return over;
      }

      function thumbHtml() {
        if (opts.photo) return `<div class="thumb"><img src="${opts.photo}" alt=""></div>`;
        if (def.icon) return `<div class="thumb">${A.sprite(def.icon)}</div>`;
        return '';
      }

      function showIntro() {
        running = false;
        const how = (typeof def.howto === 'function' ? def.howto(v) : def.howto) || [];
        const c = card(`<div class="kick">Minigioco${v.label ? ' · ' + v.label : ''}</div><h2>${opts.title || def.name}</h2>${thumbHtml()}
          <p class="det">${v.brief || def.blurb || ''}</p>
          <ul class="howto">${how.map((h) => `<li><b>${h[0]}</b><span>${h[1]}</span></li>`).join('')}</ul>
          <div class="acts"><button class="btn red" data-a="go">Gioca!</button><button class="btn" data-a="quit">Esci</button></div>`);
        c.addEventListener('click', (e) => { const a = e.target.closest('[data-a]'); if (!a) return; BQ.audio.sfx('click'); if (a.dataset.a === 'go') begin(); else cleanup({ stars: 0, quit: true }); });
        const kd = (e) => { if (e.key === 'Enter' || e.key === ' ') { if (!running && !finished && over && !paused) { document.removeEventListener('keydown', kd); begin(); } } };
        document.addEventListener('keydown', kd);
        c._kd = kd;
      }

      function begin() {
        if (over) { document.removeEventListener('keydown', over._kd || (() => {})); over.remove(); over = null; }
        api.hudClear(); ctx.setTransform(scale, 0, 0, scale, 0, 0); ctx.clearRect(0, 0, 1280, 720); dom.innerHTML = ''; api.rng = BQ.rng(seed + (attempt++) * 101);
        finished = false; elapsed = 0; paused = false;
        inst = def.create(api, v);
        running = true; last = performance.now();
        if (!raf) raf = requestAnimationFrame(frame);
      }
      let attempt = 0;

      function togglePause() {
        if (finished) return;
        paused = !paused;
        btnPause.innerHTML = A.ico(paused ? 'play' : 'pause');
        if (paused) {
          const c = card(`<h2>Pausa</h2><p class="det">${opts.title || def.name}</p><div class="acts"><button class="btn green" data-a="res">Riprendi</button><button class="btn" data-a="re">Ricomincia</button><button class="btn red" data-a="quit">Esci</button></div>`);
          c.addEventListener('click', (e) => { const a = e.target.closest('[data-a]'); if (!a) return; BQ.audio.sfx('click'); if (a.dataset.a === 'res') togglePause(); else if (a.dataset.a === 're') { paused = false; btnPause.innerHTML = A.ico('pause'); if (inst && inst.destroy) inst.destroy(); begin(); } else cleanup({ stars: 0, quit: true }); });
        } else if (over) { over.remove(); over = null; last = performance.now(); }
      }
      btnPause.addEventListener('click', () => { BQ.audio.sfx('click'); togglePause(); });
      btnClose.addEventListener('click', () => { BQ.audio.sfx('click'); if (finished) cleanup({ stars: 0, quit: true }); else if (!running) cleanup({ stars: 0, quit: true }); else if (!paused) togglePause(); else cleanup({ stars: 0, quit: true }); });

      function endGame(res) {
        if (finished) return;
        finished = true; running = false;
        res = res || {}; const stars = BQ.clamp(Math.round(res.stars || 0), 0, 3), score = Math.round(res.score || 0);
        if (opts.saveId) { BQ.save.setStars(opts.saveId, stars, score); }
        BQ.bus.emit('mini:end', { id, stars, score, opts });
        setTimeout(() => {
          BQ.audio.sfx(stars > 0 ? 'win' : 'lose');
          const c = card(`<div class="kick">${stars > 0 ? (res.kicker || 'Ben fatto!') : (res.kicker || 'Quasi!')}</div><h2>${res.title || (stars >= 3 ? 'Perfetto!' : stars > 0 ? 'Bravo!' : 'Riprova!')}</h2>
            <div class="rs">${[0, 1, 2].map((i) => `<svg viewBox="0 0 24 24" class="${i < stars ? 'on' : ''}" style="animation-delay:${0.25 + i * 0.3}s"><path d="M12 2l3 6.6 7.2.7-5.4 4.8 1.6 7.1L12 17.4 5.6 21.2l1.6-7.1L1.8 9.3 9 8.6z" fill="currentColor" stroke="#0A1B3F" stroke-width="1.2" stroke-linejoin="round"/></svg>`).join('')}</div>
            <div class="sc">${BQ.fmt(score)} pt</div><p class="det">${res.detail || ''}</p>
            <div class="acts"><button class="btn gold" data-a="again">Rigioca</button><button class="btn ${stars > 0 ? 'red' : ''}" data-a="ok">${opts.continueLabel || (stars > 0 ? 'Continua' : 'Chiudi')}</button></div>`);
          for (let i = 0; i < stars; i++) setTimeout(() => BQ.audio.sfx('star', i), 250 + i * 300);
          if (stars >= 2) BQ.ui.confetti(stars * 18);
          c.addEventListener('click', (e) => { const a = e.target.closest('[data-a]'); if (!a) return; BQ.audio.sfx('click'); if (a.dataset.a === 'again') { if (inst && inst.destroy) inst.destroy(); begin(); } else cleanup({ stars, score, played: true, win: stars > 0 }); });
        }, res.delay == null ? 700 : res.delay);
      }

      active = { cleanup };
      $('#rotate-hint').hidden = true;
      showIntro();
    });
  };

  M.isActive = () => !!active;
})();
