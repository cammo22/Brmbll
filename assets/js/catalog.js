/* =========================================================
   BRAMBILLA QUEST — il catalogo sfogliabile
   251 articoli dei PDF, ognuno con i suoi minigiochi
   ========================================================= */
(function () {
  'use strict';
  const BQ = window.BQ, $ = BQ.$, el = BQ.el, A = BQ.art, UI = BQ.ui;
  const Cat = (BQ.catalog = {});
  let scr, book, tabs, posEl, pages = [], cur = 0, from = null, narrow = false, searchBox, results, busy = false;

  function buildPages() {
    pages = [{ type: 'front' }];
    BQ.items.REPS.forEach((r) => { pages.push({ type: 'cover', rep: r }); r.items.forEach((it) => pages.push({ type: 'item', item: it, rep: r })); });
  }

  Cat.init = function (container) {
    buildPages();
    scr = el('section', { class: 'screen cat-screen', id: 'screen-catalog' });
    const wrap = el('div', { class: 'cat-wrap' });
    tabs = el('div', { class: 'cat-tabs', role: 'tablist' });
    book = el('div', { class: 'book' });
    posEl = el('div', { class: 'info' });
    searchBox = el('input', { type: 'search', placeholder: 'Cerca un prodotto…', 'aria-label': 'Cerca nel catalogo', autocomplete: 'off' });
    results = el('div', { class: 'cat-results', hidden: true });
    const search = el('div', { class: 'cat-search' }, el('span', { html: A.ico('search') }), searchBox, results);
    const bar = el('div', { class: 'cat-bar' },
      el('button', { class: 'iconbtn', id: 'cPrev', 'aria-label': 'Pagina precedente', html: A.ico('back'), on: { click: () => go(cur - 1) } }),
      search, el('div', { class: 'sp' }), posEl, el('div', { class: 'sp' }),
      el('button', { class: 'btn sm blue', id: 'cBack', style: { display: 'none' }, text: 'Torna all\'avventura', on: { click: () => BQ.go('adv') } }),
      el('button', { class: 'iconbtn', id: 'cNext', 'aria-label': 'Pagina successiva', html: A.ico('next'), on: { click: () => go(cur + 1) } }));
    wrap.append(tabs, book, bar);
    scr.append(wrap); container.append(scr);
    BQ.items.REPS.forEach((r) => tabs.append(el('button', { class: 'tc' + r.tc, role: 'tab', data: { rep: r.id }, html: `${r.short}<small>${r.items.length}</small>`, on: { click: () => { BQ.audio.sfx('page'); go(pages.findIndex((p) => p.type === 'cover' && p.rep === r)); } } })));
    // ricerca
    searchBox.addEventListener('input', () => {
      const q = searchBox.value; results.innerHTML = '';
      if (q.trim().length < 2) { results.hidden = true; return; }
      const list = BQ.items.search(q);
      results.hidden = false;
      if (!list.length) results.append(el('button', { text: 'Nessun prodotto trovato' }));
      list.forEach((it) => results.append(el('button', { html: `${it.img ? `<img src="${it.img}" alt="">` : ''}<span>${it.title}<small>${it.rep.short} · n.${it.n}</small></span>`, on: { click: () => { results.hidden = true; searchBox.value = ''; BQ.audio.sfx('page'); go(pages.findIndex((p) => p.item === it)); } } })));
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('.cat-search')) results.hidden = true; });
    // tastiera + swipe
    document.addEventListener('keydown', (e) => { if (BQ.current !== 'catalog' || BQ.mini.isActive() || e.target === searchBox || !$('#layer-modal').hidden) return; if (e.key === 'ArrowRight') go(cur + 1); else if (e.key === 'ArrowLeft') go(cur - 1); });
    let sx = null, sy = 0;
    book.addEventListener('pointerdown', (e) => { if (e.target.closest('button,a,img')) { sx = null; return; } sx = e.clientX; sy = e.clientY; });
    book.addEventListener('pointerup', (e) => { if (sx == null) return; const dx = e.clientX - sx, dy = e.clientY - sy; sx = null; if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 1.5) go(cur + (dx < 0 ? 1 : -1)); });
    const mq = window.matchMedia('(max-width:900px)'); narrow = mq.matches;
    mq.addEventListener('change', () => { narrow = mq.matches; render(); });
  };

  function go(i, noAnim) {
    i = BQ.clamp(i, 0, pages.length - 1);
    if (i === cur || busy) return;
    const dir = i > cur ? 1 : -1;
    if (!noAnim && !narrow && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
      busy = true; BQ.audio.sfx('page');
      const src = $(dir > 0 ? '.page.r' : '.page.l', book);
      const sheet = el('div', { class: 'sheet ' + (dir > 0 ? 'next' : 'prev'), html: src ? src.innerHTML : '' });
      book.append(sheet);
      cur = i; render();
      setTimeout(() => { sheet.remove(); busy = false; }, 640);
    } else { BQ.audio.sfx('page'); cur = i; render(); }
  }
  Cat.go = go;

  const pageEl = (cls, inner) => el('div', { class: 'page ' + cls }, el('div', { class: 'page-in' }, ...inner));

  function specHtml(it) {
    let s = it.spec || '';
    if (!s) return '<p class="pg-spec"><i>Scheda tecnica sul catalogo PDF.</i></p>';
    s = s.replace(/\s(Optional:|Versione|Dim\.|Dimensioni|Port\.|port\.|Alimentazione)/g, '<br><b>$1</b>').replace(/<b>(\w+\.?:?)<\/b>/g, '<b>$1</b>');
    return `<p class="pg-spec">${s}</p>`;
  }

  function render() {
    const pg = pages[cur];
    book.className = 'book' + (pg.rep ? ' tc' + pg.rep.tc : '');
    $$('button', tabs).forEach((b) => b.classList.toggle('on', !!pg.rep && b.dataset.rep === pg.rep.id));
    [...book.querySelectorAll('.page')].forEach((n) => n.remove());
    let L = [], R = [];
    if (pg.type === 'front') {
      const tot = BQ.items.all.length;
      L = [el('div', { class: 'cover', html: `<div class="stk">${A.sprite('i_book')}</div><h2>Catalogo<br>giocabile</h2><p><b>${tot}</b> prodotti dei cataloghi Brambilla Angelo s.r.l.<br>ognuno con i suoi minigiochi.</p><p class="pg-spec">Sfoglia con le frecce, con i tasti ← → o con uno swipe.<br>Tocca un minigioco per giocare e guadagnare stelle!</p>` })];
      R = [el('h3', { class: 'pg-h', text: 'Indice dei reparti' }), el('div', { class: 'toc' }, ...BQ.items.REPS.map((r) => el('button', { class: 'tc' + r.tc, html: `${r.name}<small>${r.items.length} articoli</small>`, on: { click: () => go(pages.findIndex((p) => p.type === 'cover' && p.rep === r)) } })))];
    } else if (pg.type === 'cover') {
      const r = pg.rep, stars = r.items.reduce((a, it) => a + BQ.items.itemStars(it), 0);
      L = [el('div', { class: 'cover', html: `<div class="stk">${A.sprite(r.icon)}</div><span class="pg-rep">Reparto</span><h2>${r.name}</h2><p>${r.blurb}</p><p><b>${r.items.length}</b> articoli · ${stars} ★ guadagnate</p><p><a class="btn sm" href="assets/pdf/${r.pdf}" target="_blank" rel="noopener">Catalogo PDF completo</a></p>` })];
      R = [el('h3', { class: 'pg-h', text: 'Tutti gli articoli' }), el('div', { class: 'varlist' }, ...r.items.map((it) => el('button', { class: 'mgc', html: `<div class="ic2">${it.img ? `<img src="${it.img}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:contain">` : ''}</div><div><b style="font-size:.9rem">${it.title}</b><small>n. ${it.n} · ${BQ.items.playsFor(it).length} minigiochi</small></div><div class="go">${UI.stars(Math.min(3, Math.floor(BQ.items.itemStars(it) / 3)))}</div>`, on: { click: () => go(pages.findIndex((p) => p.item === it)) } })))];
    } else {
      const it = pg.item, plays = BQ.items.playsFor(it);
      L = [el('div', { class: 'pg-num', text: String(it.n).padStart(3, '0') }),
        el('span', { class: 'pg-rep', html: it.rep.name }),
        el('h2', { class: 'pg-title', text: it.title }),
        el('div', { class: 'pg-photo' }, el('div', { class: 'im' }, it.img ? el('img', { src: it.img, alt: it.title, on: { click: () => zoom(it) } }) : null)),
        el('div', { html: specHtml(it) }),
        el('p', { html: `<a class="btn sm" href="assets/pdf/${it.rep.pdf}" target="_blank" rel="noopener">Apri il catalogo PDF</a> <a class="btn sm gold" href="tel:039650938">Chiedi info · 039650938</a>` })];
      R = [el('h3', { class: 'pg-h', text: 'Minigiochi di questo articolo' }),
        el('div', { class: 'mgcards' }, ...plays.map((p) => el('button', { class: 'mgc', html: `<div class="ic2">${p.icon ? A.sprite(p.icon) : ''}</div><div><b>${p.game_name}</b><small>${p.name}${p.blurb ? ' — ' + p.blurb : ''}</small></div><div class="go">${UI.stars(BQ.save.stars(p.id))}<span class="p">${A.ico('play')}</span></div>`, on: { click: () => play(it, p) } }))),
        el('p', { class: 'pg-spec', style: { marginTop: '16px' }, html: `Stelle su questo articolo: <b>${BQ.items.itemStars(it)}</b> / ${plays.length * 3}` })];
    }
    if (narrow) { book.append(pageEl('r', [...L, ...R])); } else { book.append(pageEl('l', L), pageEl('r', R)); }
    book.querySelectorAll('.page-in').forEach((p) => { p.scrollTop = 0; });
    const bk = $('#cBack'); if (bk) bk.style.display = from === 'adv' ? '' : 'none';
    posEl.textContent = pg.type === 'item' ? `${pg.rep.short} · ${pg.item.n}/${pg.rep.items.length}` : pg.type === 'cover' ? pg.rep.short : 'Copertina';
    $('#cPrev').style.opacity = cur === 0 ? 0.4 : 1; $('#cNext').style.opacity = cur === pages.length - 1 ? 0.4 : 1;
    try { history.replaceState(null, '', pg.type === 'item' ? '#/catalogo/' + pg.item.id : '#/catalogo'); } catch (e) { /* */ }
  }
  const $$ = BQ.$$;

  async function play(it, p) {
    BQ.audio.sfx('click');
    await BQ.items.play(it, p);
    render();
  }

  function zoom(it) {
    const z = el('div', { class: 'zoom', on: { click: () => z.remove() } }, el('img', { src: it.img, alt: it.title }));
    document.body.append(z); BQ.audio.sfx('click');
  }

  Cat.show = function (o) {
    o = o || {};
    from = o.back || null;
    if (o.item) { const i = pages.findIndex((p) => p.item && p.item.id === o.item); if (i >= 0) { cur = i; } }
    else if (o.rep) { const i = pages.findIndex((p) => p.type === 'cover' && p.rep.id === o.rep); if (i >= 0) cur = i; }
    render();
  };
})();
