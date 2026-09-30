/* =========================================================
   BRAMBILLA QUEST — componenti UI: dialoghi, toast, modali
   ========================================================= */
(function () {
  'use strict';
  const BQ = window.BQ, $ = BQ.$, el = BQ.el, A = BQ.art;
  const UI = (BQ.ui = {});

  UI.stars = (n, max) => {
    max = max || 3;
    let s = '<span class="stars" aria-label="' + n + ' stelle su ' + max + '">';
    for (let i = 0; i < max; i++) s += `<svg viewBox="0 0 24 24" class="${i < n ? 'on' : ''}"><path d="${'M12 2l3 6.6 7.2.7-5.4 4.8 1.6 7.1L12 17.4 5.6 21.2l1.6-7.1L1.8 9.3 9 8.6z'}" fill="currentColor"/></svg>`;
    return s + '</span>';
  };
  UI.playerName = () => BQ.save.data.name || 'Garzone';
  UI.subst = (t) => String(t).replace(/\{nome\}/g, UI.playerName());

  /* ---------- adattamento 16:9 ---------- */
  UI.fit = function (box, inner, W, H, onk) {
    const f = () => {
      const r = box.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const k = Math.min(r.width / W, r.height / H);
      inner.style.transform = `scale(${k})`;
      if (inner.parentElement !== box) { inner.parentElement.style.width = W * k + 'px'; inner.parentElement.style.height = H * k + 'px'; }
      if (onk) onk(k);
    };
    f();
    const ro = new ResizeObserver(f); ro.observe(box);
    return () => ro.disconnect();
  };

  /* ---------- toast ---------- */
  UI.toast = function (text, o) {
    o = o || {};
    const t = el('div', { class: 'toast', role: 'status' }, o.sprite ? el('span', { class: 'ti', html: A.sprite(o.sprite, o.spriteOpts) }) : null, el('span', { text }));
    $('#layer-toast').append(t);
    setTimeout(() => t.remove(), 3500);
  };

  /* ---------- modale ---------- */
  UI.modal = function (o) {
    return new Promise((res) => {
      const layer = $('#layer-modal');
      layer.hidden = false;
      const card = el('div', { class: 'modal ' + (o.cls || '') + (o.wide ? ' wide' : ''), role: 'dialog', 'aria-modal': 'true' });
      if (o.title) card.append(el('h2', { text: o.title }));
      if (o.html) card.insertAdjacentHTML('beforeend', o.html);
      if (o.node) card.append(o.node);
      const done = (v) => { layer.hidden = true; layer.innerHTML = ''; document.removeEventListener('keydown', onKey); res(v); };
      if (o.closable !== false && !(o.actions && o.actions.length === 1 && o.noX)) {
        card.append(el('button', { class: 'iconbtn x', 'aria-label': 'Chiudi', html: A.ico('close'), on: { click: () => { BQ.audio.sfx('click'); done(o.closeValue); } } }));
      }
      if (o.actions) {
        const acts = el('div', { class: 'acts' });
        o.actions.forEach((a) => acts.append(el('button', { class: 'btn ' + (a.cls || ''), html: a.label, on: { click: () => { BQ.audio.sfx('click'); if (a.onclick && a.onclick(card) === false) return; done(a.value); } } })));
        card.append(acts);
      }
      const onKey = (e) => { if (e.key === 'Escape' && o.closable !== false) done(o.closeValue); };
      document.addEventListener('keydown', onKey);
      layer.innerHTML = ''; layer.append(card);
      if (o.onopen) o.onopen(card, done);
      const f = card.querySelector('input,button.btn'); if (f && !BQ.env.touch) f.focus();
    });
  };

  UI.reward = function (o) {
    BQ.audio.sfx('fanfare'); UI.confetti(40);
    return UI.modal({
      cls: 'reward', title: o.title,
      html: `<div class="big">${A.sprite(o.sprite, o.spriteOpts)}</div><p><b>${o.name || ''}</b></p><p>${o.text || ''}</p>`,
      actions: [{ label: o.button || 'Continua', cls: 'gold', value: true }], closable: false,
    });
  };

  UI.banner = function (kicker, title, ms) {
    return new Promise((res) => {
      const b = el('div', { class: 'banner' }, el('div', null, el('small', { text: kicker }), el('b', { text: title })));
      document.body.append(b); BQ.audio.sfx('whoosh');
      setTimeout(() => { b.remove(); res(); }, ms || 3000);
    });
  };

  UI.confetti = function (n) {
    const c = el('div', { class: 'confetti' });
    const cols = ['#E11D2E', '#F2C340', '#215FD6', '#fff', '#3FA06A', '#FF8A1E'];
    for (let i = 0; i < (n || 50); i++) {
      const p = el('i', { style: { left: Math.random() * 100 + '%', background: cols[i % cols.length], animationDuration: 1.8 + Math.random() * 2 + 's', animationDelay: Math.random() * 0.6 + 's', width: 8 + Math.random() * 8 + 'px' } });
      c.append(p);
    }
    document.body.append(c); setTimeout(() => c.remove(), 4800);
  };

  /* ---------- dialoghi ---------- */
  let dlgEl = null, typing = null, waitNext = null, hideT = 0;
  UI.who = function (id) {
    if (id === 'tu') return { char: 'p' + (BQ.save.data.avatar || 0), name: UI.playerName(), right: true };
    if (id === 'narr') return { narr: true };
    if (id === 'fetta') return { cat: true, name: 'Fetta' };
    if (id === 'telefono') return { char: 'ottavio', name: 'Voce al telefono', phone: true };
    const c = BQ.CHARS[id];
    return { char: id, name: c ? c.name : id };
  };
  function ensureDlg() {
    const layer = $('#layer-dlg');
    layer.hidden = false; layer.classList.add('blk');
    clearTimeout(hideT);
    if (!dlgEl) { dlgEl = el('div', { class: 'dlg' }); layer.append(dlgEl); }
    return dlgEl;
  }
  UI.hideDlg = function () {
    const layer = $('#layer-dlg');
    layer.hidden = true; layer.classList.remove('blk'); layer.innerHTML = ''; dlgEl = null;
  };
  function softHide() { clearTimeout(hideT); hideT = setTimeout(UI.hideDlg, 140); }

  function render(w, opts) {
    const d = ensureDlg();
    const portrait = w.narr ? '' : (w.cat ? A.cat({ mood: opts.mood }) : A.char(w.char, { portrait: true, mood: opts.mood || 'neutral', talk: true }));
    d.innerHTML = `<div class="dlg-box ${w.narr ? 'narr' : ''} ${w.right ? 'right' : ''}">
      <div class="dlg-portrait ${w.narr ? 'narr' : ''}">${portrait}</div>
      <div class="dlg-main"><div class="dlg-name">${opts.name || w.name || ''}</div><div class="dlg-text"></div><div class="dlg-choices"></div></div>
      <div class="dlg-next" hidden>▼</div></div>`;
    return d;
  }

  UI.say = function (who, text, opts) {
    opts = opts || {};
    const w = UI.who(who);
    text = UI.subst(text);
    const d = render(w, opts);
    const tx = d.querySelector('.dlg-text'), nx = d.querySelector('.dlg-next'), port = d.querySelector('.char'), box = d.querySelector('.dlg-box');
    return new Promise((res) => {
      let i = 0; const step = text.length > 140 ? 2 : 1;
      const finish = () => {
        clearInterval(typing); typing = null; tx.textContent = text; nx.hidden = false;
        if (port) port.classList.remove('talk');
      };
      clearInterval(typing);
      typing = setInterval(() => {
        i += step; tx.textContent = text.slice(0, i);
        if (i % 3 === 0 && text[i - 1] !== ' ') BQ.audio.blip(w.narr ? 0.5 : (w.cat ? 1.6 : (w.right ? 0.9 : (BQ.hash(w.char) % 7) / 10 + 0.6)));
        if (i >= text.length) finish();
      }, 26);
      const adv = () => {
        if (typing) { finish(); return; }
        d.removeEventListener('click', adv); document.removeEventListener('keydown', key);
        waitNext = null; res(); softHide();
      };
      const key = (e) => { if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); adv(); } };
      d.addEventListener('click', adv); document.addEventListener('keydown', key);
      waitNext = adv;
    });
  };

  UI.choose = function (options, o) {
    o = o || {};
    const w = UI.who(o.who || 'tu');
    const d = render(w, { mood: o.mood });
    const tx = d.querySelector('.dlg-text'), ch = d.querySelector('.dlg-choices'), port = d.querySelector('.char');
    if (port) port.classList.remove('talk');
    tx.textContent = o.text ? UI.subst(o.text) : '';
    if (!o.text) tx.style.minHeight = '0';
    return new Promise((res) => {
      options.forEach((opt, i) => {
        const b = el('button', { class: 'btn ' + (opt.cls || ''), text: UI.subst(typeof opt === 'string' ? opt : opt.text), on: { click: () => { BQ.audio.sfx('click'); res(i); softHide(); } } });
        ch.append(b);
      });
    });
  };

  UI.skipDlg = function () { if (waitNext) waitNext(); };

  /* ---------- schermo intero ---------- */
  UI.fullscreen = function () {
    const d = document, e = d.documentElement;
    try {
      if (BQ.env.electron && window.bqNative && window.bqNative.toggleFullscreen) return window.bqNative.toggleFullscreen();
      if (!d.fullscreenElement) { (e.requestFullscreen || e.webkitRequestFullscreen || function () {}).call(e); if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {}); }
      else (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    } catch (err) { /* */ }
  };
})();
