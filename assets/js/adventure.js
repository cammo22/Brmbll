/* =========================================================
   BRAMBILLA QUEST — motore dell'avventura grafica (point & click)
   ========================================================= */
(function () {
  'use strict';
  const BQ = window.BQ, $ = BQ.$, el = BQ.el, A = BQ.art, UI = BQ.ui;

  /* oggetti d'inventario */
  const INV = {
    apron: { name: 'Grembiule Brambilla', spr: 'i_apron', desc: 'Il tuo grembiule da garzone, con il logo AB. Profuma di detersivo e di prosciutto.' },
    book: { name: 'Il Catalogo', spr: 'i_book', desc: 'Il catalogo della bottega: ogni oggetto ha le sue sfide. Toccalo per sfogliarlo.', open: 'catalog' },
    clue1: { name: 'Scontrino strappato', spr: 'i_receipt', desc: 'Uno scontrino firmato «O.T.», battuto alle 03:14 di notte.' },
    clue2: { name: 'Peso di piombo', spr: 'i_weight', desc: 'Un peso campione truccato. Sul fondo è inciso «T & F».' },
    clue3: { name: 'Guanto giallo', spr: 'i_glove', desc: 'Un guanto giallo da lavoro, dimenticato sotto il volano.' },
    clue4: { name: 'Tovagliolo macchiato', spr: 'i_napkin', desc: 'Macchia di caffè e scritta: «Bar Trucco — il caffè che pesa giusto».' },
    clue5: { name: 'Osso con segni di sega', spr: 'i_bone', desc: 'Tagli netti, da segaossa professionale. Stampigliato: «Segheria Trucco».' },
    clue6: { name: 'Guanto d\'acciaio', spr: 'i_glove', desc: 'Guanto di maglia d\'acciaio con il nome ricamato: «O. Trucco».' },
  };
  for (let i = 1; i <= 6; i++) INV['frag' + i] = { name: 'Frammento della Lama n.' + i, spr: 'fragment', sprOpts: { i: i - 1 }, desc: 'Un pezzo della Lama d\'Oro. Ne servono sei.' };
  INV.blade = { name: 'Lama d\'Oro', spr: 'goldblade', desc: 'La Lama d\'Oro, di nuovo intera. Non ha mai smesso di tagliare.' };
  BQ.INV = INV;

  const Adv = (BQ.adv = { cur: null, busy: false, sel: null });
  let scr, box, stage, scene, bgEl, charsEl, frontEl, spotsEl, invbar, chip, fade, lbox, killFit = null, hintT = 0;

  Adv.init = function (container) {
    scr = el('section', { class: 'screen adv', id: 'screen-adv' });
    box = el('div', { class: 'stagebox' });
    stage = el('div', { class: 'stage' });
    scene = el('div', { class: 'scene' });
    bgEl = el('div', { class: 'bgl' }); charsEl = el('div', { class: 'chars' }); frontEl = el('div', { class: 'frontl' }); spotsEl = el('div', { class: 'spots' });
    [bgEl, frontEl].forEach((e) => { e.style.cssText = 'position:absolute;inset:0'; });
    scene.append(bgEl, charsEl, frontEl, spotsEl);
    lbox = el('div', { class: 'letterbox' });
    fade = el('div', { class: 'fade on' });
    stage.append(scene, lbox, fade);
    box.append(stage);
    const hudL = el('div', { class: 'hud l' },
      el('button', { class: 'iconbtn', 'aria-label': 'Menu principale', html: A.ico('home'), on: { click: () => { BQ.audio.sfx('click'); BQ.go('menu'); } } }),
      chip = el('div', { class: 'chip' }));
    const fragEl = el('div', { class: 'frags', id: 'fragBar', title: 'Frammenti della Lama d\'Oro' });
    for (let i = 0; i < 6; i++) fragEl.append(el('i'));
    const hudR = el('div', { class: 'hud r' }, fragEl,
      el('button', { class: 'iconbtn', id: 'btnHint', 'aria-label': 'Chiedi un consiglio a Fetta', html: A.ico('cat'), on: { click: () => Adv.hint() } }),
      el('button', { class: 'iconbtn', 'aria-label': 'Catalogo', html: A.ico('book'), on: { click: () => { BQ.audio.sfx('click'); BQ.go('catalog'); } } }),
      el('button', { class: 'iconbtn', id: 'btnBack', 'aria-label': 'Torna in bottega', html: A.ico('back'), on: { click: () => Adv.back() } }));
    invbar = el('div', { class: 'invbar' });
    scr.append(box, hudL, hudR, invbar);
    container.append(scr);
    const resize = () => {
      const r = box.getBoundingClientRect(); if (!r.width) return;
      const k = Math.min(r.width / 1600, r.height / 900);
      stage.style.width = 1600 * k + 'px'; stage.style.height = 900 * k + 'px';
      scene.style.transform = `scale(${k})`; Adv.k = k;
    };
    new ResizeObserver(resize).observe(box); resize();
    BQ.bus.on('inv', renderInv); BQ.bus.on('save', () => { renderInv(); renderFrags(); });
    BQ.$('#screen-adv').addEventListener('click', (e) => { if (!e.target.closest('.slot') && Adv.sel && !e.target.closest('.spot')) { Adv.sel = null; renderInv(); } });
  };

  function renderFrags() {
    const f = $('#fragBar'); if (!f) return;
    $$('i', f).forEach((i, n) => i.classList.toggle('on', BQ.save.has('frag' + (n + 1))));
  }
  const $$ = BQ.$$;

  function renderInv() {
    if (!invbar) return;
    invbar.innerHTML = '';
    BQ.save.data.inv.filter((k) => !/^frag/.test(k)).forEach((k) => {
      const d = INV[k]; if (!d) return;
      const b = el('button', { class: 'slot' + (Adv.sel === k ? ' sel' : ''), 'aria-label': d.name, html: A.sprite(d.spr, d.sprOpts) + `<span class="tip">${d.name}</span>` });
      b.addEventListener('click', (e) => {
        e.stopPropagation(); BQ.audio.sfx('click');
        if (Adv.busy) return;
        if (d.open) { BQ.go(d.open); return; }
        if (Adv.sel === k) { Adv.sel = null; renderInv(); Adv.run(() => UI.say('narr', d.name + ' — ' + d.desc)); return; }
        Adv.sel = k; renderInv(); UI.toast('Scegli dove usare: ' + d.name, { sprite: d.spr, spriteOpts: d.sprOpts });
        stage.classList.add('usemode');
      });
      invbar.append(b);
    });
    if (!Adv.sel) stage && stage.classList.remove('usemode');
    renderFrags();
  }
  Adv.renderInv = renderInv;

  /* ---------- scene ---------- */
  function render() {
    const def = BQ.scenes[Adv.cur]; if (!def) return;
    const art = A.scene(def.art || Adv.cur, def.artOpts ? def.artOpts() : {});
    bgEl.innerHTML = `<svg viewBox="0 0 1600 900" style="width:1600px;height:900px;display:block">${art.back}</svg>`;
    frontEl.innerHTML = `<svg viewBox="0 0 1600 900" style="width:1600px;height:900px;display:block;position:absolute;inset:0">${art.front || ''}</svg>`;
    charsEl.innerHTML = '';
    (def.chars ? def.chars() : []).forEach((c) => {
      const cat = c.cat, h = c.h || 430, w = cat ? h * 260 / 240 : h * 300 / 520;
      const d = el('div', { class: 'ch' + (c.cls ? ' ' + c.cls : ''), style: { left: c.fx - w / 2 + 'px', top: c.fy - h + 'px', width: w + 'px', height: h + 'px' }, data: { id: c.id }, html: cat ? A.cat({ mood: c.mood }) : A.char(c.id, { pose: c.pose || 'idle', mood: c.mood || 'neutral', flip: c.flip }) });
      charsEl.append(d);
    });
    spotsEl.innerHTML = '';
    (def.spots ? def.spots() : []).forEach((s) => {
      if (s.cond && !s.cond()) return;
      const b = el('button', { class: 'spot' + (s.done ? ' done' : '') + (s.locked ? ' lockd' : ''), 'aria-label': s.label, style: { left: s.x + 'px', top: s.y + 'px', width: s.w + 'px', height: s.h + 'px' }, data: { g: s.g || '!' }, html: `<span class="lbl">${s.label}</span>` });
      b.addEventListener('click', () => onSpot(s));
      spotsEl.append(b);
    });
    chip.innerHTML = `<small>${def.kicker ? def.kicker() : 'Brambilla Quest'}</small>${def.title}`;
    $('#btnBack').style.display = def.back ? '' : 'none';
    renderInv();
    BQ.save.data.scene = Adv.cur; BQ.save.commit();
  }
  Adv.refresh = render;

  async function onSpot(s) {
    if (Adv.busy) return;
    BQ.audio.sfx('click');
    const used = Adv.sel; Adv.sel = null; stage.classList.remove('usemode'); renderInv();
    await Adv.run(async () => {
      if (used) {
        if (s.use && s.use[used]) await s.use[used]();
        else await UI.say('narr', 'Non sembra funzionare… qui non serve ' + (INV[used] ? INV[used].name.toLowerCase() : 'quello') + '.');
      } else if (s.act) await s.act();
    });
  }

  Adv.run = async function (fn) {
    if (Adv.busy) return;
    Adv.busy = true; stage.classList.add('busy');
    try { await fn(); } catch (e) { console.error(e); }
    Adv.busy = false; stage.classList.remove('busy');
    UI.hideDlg();
    if (BQ.current === 'adv') render();
  };

  Adv.fadeOut = () => { fade.classList.add('on'); return BQ.sleep(420); };
  Adv.fadeIn = () => { fade.classList.remove('on'); return BQ.sleep(420); };
  Adv.cinema = (on) => lbox.classList.toggle('on', on);

  /** cambia scena con dissolvenza */
  Adv.goto = async function (id, opts) {
    opts = opts || {};
    if (Adv.cur) await Adv.fadeOut();
    Adv.cur = id; render();
    const def = BQ.scenes[id];
    await BQ.sleep(60); await Adv.fadeIn();
    if (def && def.enter && !opts.silent) await def.enter(opts);
    if (def && def.onShow) def.onShow();
  };

  Adv.back = function () { if (Adv.busy) return; const def = BQ.scenes[Adv.cur]; if (def && def.back) Adv.run(() => Adv.goto(def.back)); };

  Adv.hint = function () {
    if (Adv.busy) return;
    BQ.audio.sfx('meow');
    stage.classList.add('hints'); clearTimeout(hintT); hintT = setTimeout(() => stage.classList.remove('hints'), 7000);
    const t = BQ.story && BQ.story.hintText ? BQ.story.hintText() : 'Tocca i punti luminosi!';
    Adv.run(() => UI.say('fetta', t, { mood: 'happy' }));
  };

  /** entra nello schermo avventura */
  Adv.show = async function () {
    if (!scr) Adv.init($('#app'));
    renderInv();
  };

  Adv.$stage = () => stage;
})();
