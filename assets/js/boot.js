/* =========================================================
   BRAMBILLA QUEST — avvio, routing, cookie, PWA
   ========================================================= */
(function () {
  'use strict';
  const BQ = window.BQ, $ = BQ.$, $$ = BQ.$$, el = BQ.el, UI = BQ.ui;
  const SCREENS = { menu: 'screen-menu', adv: 'screen-adv', catalog: 'screen-catalog', arcade: 'screen-arcade', info: 'screen-info' };
  BQ.current = null;

  BQ.go = function (name, params) {
    if (!SCREENS[name]) name = 'menu';
    if (name === 'adv' && !(params && params.direct) && !BQ.adv.cur && !BQ.story.hasSave()) { BQ.story.newGame(); return; }
    const prev = BQ.current;
    BQ.current = name;
    $$('.screen').forEach((s) => s.classList.toggle('on', s.id === SCREENS[name]));
    $('#topnav').hidden = name === 'adv';
    $$('#topnav nav button').forEach((b) => b.classList.toggle('on', b.dataset.go === name));
    if (name === 'menu') BQ.screens.menu.show();
    else if (name === 'catalog') BQ.catalog.show(params);
    else if (name === 'arcade') BQ.screens.arcade.show();
    else if (name === 'info') BQ.screens.info.show(params);
    else if (name === 'adv') { BQ.adv.show(); if (prev !== 'adv' && BQ.adv.cur) BQ.adv.refresh(); }
    updateRotate();
    try { if (name !== 'catalog') history.replaceState(null, '', name === 'menu' ? location.pathname + location.search : '#/' + ({ adv: 'avventura', arcade: 'giochi', info: 'info' }[name])); } catch (e) { /* */ }
    if (name !== 'adv') UI.hideDlg();
    BQ.audio.music(true);
  };

  function updateRotate() {
    const portrait = window.innerHeight > window.innerWidth * 1.05 && window.innerWidth < 800;
    $('#rotate-hint').hidden = !(portrait && (BQ.current === 'adv' || BQ.mini.isActive()));
  }
  window.addEventListener('resize', updateRotate);
  window.addEventListener('orientationchange', updateRotate);

  /* ---------- cookie ---------- */
  function cookieBanner() {
    if (BQ.env.app) return;
    let v = null; try { v = localStorage.getItem('bq.ck'); } catch (e) { /* */ }
    if (v) return;
    const b = el('div', { class: 'cookie', role: 'dialog', 'aria-label': 'Informativa cookie' },
      el('p', { html: 'Questo sito usa solo dati tecnici del browser per salvare i tuoi progressi nel gioco. La mappa, se la carichi, usa i cookie di Google. <a href="cookies.html">Leggi di più</a>' }),
      el('div', { class: 'acts' },
        el('button', { class: 'btn sm red', text: 'Ok', on: { click: () => { try { localStorage.setItem('bq.ck', '1'); } catch (e) { /* */ } b.remove(); } } })));
    document.body.append(b);
  }

  /* ---------- PWA ---------- */
  function pwa() {
    window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); BQ.deferredInstall = e; });
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !BQ.env.app && location.hostname !== 'localhost' || (location.hostname === 'localhost' && location.search.includes('sw'))) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  function route() {
    const h = (location.hash || '').replace(/^#\/?/, '').split('/');
    if (h[0] === 'catalogo') { BQ.go('catalog', { item: h[1] }); return true; }
    if (h[0] === 'giochi') { BQ.go('arcade'); return true; }
    if (h[0] === 'info') { BQ.go('info', { sec: h[1] }); return true; }
    if (h[0] === 'avventura' && BQ.story.hasSave()) { BQ.story.resume(); return true; }
    return false;
  }

  function start() {
    const app = $('#app'); app.innerHTML = '';
    BQ.art.installDefs();
    BQ.screens.buildNav(document.body);
    BQ.screens.menu.init(app); BQ.catalog.init(app); BQ.screens.arcade.init(app); BQ.screens.info.init(app); BQ.adv.init(app);
    BQ.items.all.forEach(() => {});
    if (!route()) BQ.go('menu');
    cookieBanner(); pwa();
    window.addEventListener('hashchange', () => { if (!BQ.mini.isActive()) route(); });
    document.documentElement.classList.add('ready');
    BQ.bus.on('setting', (k) => { if (k === 'music' || k === 'sound') { const m = $('#tMusic'); if (m) m.classList.toggle('off', !BQ.save.setting('music')); } });
  }

  const ready = (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, BQ.sleep(1800)]) : Promise.resolve());
  const domReady = document.readyState === 'loading' ? new Promise((r) => document.addEventListener('DOMContentLoaded', r)) : Promise.resolve();
  Promise.all([ready, domReady]).then(start).catch((e) => { console.error(e); start(); });
})();
