/* =========================================================
   BRAMBILLA QUEST — schermate: menu, sala giochi, info bottega
   ========================================================= */
(function () {
  'use strict';
  const BQ = window.BQ, $ = BQ.$, $$ = BQ.$$, el = BQ.el, A = BQ.art, UI = BQ.ui;
  const Scr = (BQ.screens = {});
  const REL = 'https://github.com/cammo22/Brmbll/releases/latest/download/';
  const DL = { android: REL + 'Brambilla-Quest-Android.apk', windows: REL + 'Brambilla-Quest-Windows-Portable.exe', page: 'https://github.com/cammo22/Brmbll/releases/latest' };

  /* ---------------- barra di navigazione ---------------- */
  Scr.buildNav = function (container) {
    const nav = el('header', { class: 'topnav', id: 'topnav' },
      el('button', { class: 'brand', 'aria-label': 'Menu principale', on: { click: () => BQ.go('menu') }, html: '<img src="assets/img/logo-ab.png" alt=""><span><b>Brambilla Quest</b><small>Agrate Brianza · dal 1970 circa</small></span>' }),
      el('nav', { 'aria-label': 'Sezioni' },
        ...[['adv', 'Avventura', 'play'], ['catalog', 'Catalogo', 'book'], ['arcade', 'Sala giochi', 'game'], ['info', 'La bottega', 'info']].map((b) => el('button', { data: { go: b[0] }, html: `${A.ico(b[2])}<span>${b[1]}</span>`, on: { click: () => { BQ.audio.sfx('click'); if (b[0] === 'adv') BQ.story.hasSave() ? BQ.story.resume() : BQ.story.newGame(); else BQ.go(b[0]); } } }))),
      el('div', { class: 'tools' },
        el('button', { class: 'iconbtn', id: 'tMusic', 'aria-label': 'Musica', html: A.ico('music'), on: { click: () => { BQ.save.setting('music', !BQ.save.setting('music')); syncTools(); BQ.audio.sfx('click'); } } }),
        el('button', { class: 'iconbtn', id: 'tSound', 'aria-label': 'Effetti sonori', html: A.ico('sound'), on: { click: () => { BQ.save.setting('sound', !BQ.save.setting('sound')); syncTools(); BQ.audio.sfx('click'); } } }),
        el('button', { class: 'iconbtn', id: 'tFs', 'aria-label': 'Schermo intero', html: A.ico('fs'), on: { click: () => UI.fullscreen() } })));
    container.append(nav);
    syncTools();
  };
  function syncTools() {
    const m = $('#tMusic'), s = $('#tSound'); if (!m) return;
    m.classList.toggle('off', !BQ.save.setting('music')); s.classList.toggle('off', !BQ.save.setting('sound'));
    s.innerHTML = A.ico(BQ.save.setting('sound') ? 'sound' : 'mute');
  }

  /* ---------------- menu principale ---------------- */
  function posterSvg() {
    const sc = A.scene('strada', { mood: 'dawn' });
    const ch = (id, x, y, h, o) => A.char(id, o).replace('<svg ', `<svg x="${x - h * 300 / 520 / 2}" y="${y - h}" width="${h * 300 / 520}" height="${h}" style="width:${h * 300 / 520}px;height:${h}px" `).replace(/ style="transform:scaleX\(-1\)"/, '');
    const cat = A.cat().replace('<svg ', '<svg x="560" y="672" width="130" height="120" style="width:130px;height:120px" ');
    return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label="La bottega Brambilla Angelo all'alba">${sc.back}
      <g style="filter:brightness(.18) saturate(.5)" opacity=".9">${ch('ottavio', 1490, 740, 330, { mood: 'sly' })}</g>
      ${ch('marco', 830, 800, 400, { mood: 'happy', pose: 'wave' })}${ch('angelo', 1010, 800, 430, { mood: 'happy' })}${ch('giulia', 1180, 800, 410, { mood: 'happy', pose: 'wave' })}${ch('p0', 690, 800, 380, { mood: 'happy' })}${cat}${sc.front}</svg>`;
  }
  Scr.menu = {
    init(container) {
      const s = el('section', { class: 'screen menu', id: 'screen-menu' });
      s.append(el('div', { class: 'menu-art', html: posterSvg() }), el('div', { class: 'menu-shade' }));
      const body = el('div', { class: 'menu-body' });
      body.append(
        el('span', { class: 'logo-kicker', text: 'Brambilla Angelo s.r.l. presenta' }),
        el('h1', { class: 'logo-title', html: 'Brambilla<br><em>Quest</em>' }),
        el('span', { class: 'logo-sub', text: 'Il mistero della Lama d\'Oro' }),
        el('p', { class: 'menu-tag', text: 'Un\'avventura grafica nella vera bottega di Agrate Brianza: bilance, affettatrici e registratori di cassa. 251 prodotti da sfogliare, oltre 700 minigiochi — sì, anche affettare il prosciutto crudo!' }),
        el('div', { class: 'menu-btns', id: 'menuBtns' }));
      s.append(body, el('div', { class: 'menu-rank', id: 'menuRank' }));
      s.append(el('div', { class: 'menu-foot', html: '<span>© <span data-y></span> Brambilla Angelo s.r.l. — Personaggi di fantasia, prodotti veri.</span><span><a href="informativa-privacy.html">Privacy</a> · <a href="cookies.html">Cookies</a> · <a href="tel:039650938">Tel. 039650938</a></span>' }));
      container.append(s);
      $('[data-y]', s).textContent = new Date().getFullYear();
    },
    show() {
      const b = $('#menuBtns'); b.innerHTML = '';
      const has = BQ.story.hasSave();
      const add = (txt, cls, fn, icon) => b.append(el('button', { class: 'btn ' + cls, html: (icon ? A.ico(icon) : '') + txt, on: { click: () => { BQ.audio.init(); BQ.audio.sfx('click'); fn(); } } }));
      if (has) {
        const c = Math.min(6, BQ.save.data.chapter || 1);
        add(`Continua<small style="display:block;font-family:var(--sans);font-size:.6em;letter-spacing:.1em">${BQ.save.flag('ended') ? 'Epilogo' : 'Capitolo ' + c} · ${BQ.rank().title}</small>`, 'red big', () => BQ.story.resume(), 'play');
        add('Nuova avventura', '', async () => { const v = await UI.modal({ title: 'Ricominciare?', html: '<p>I progressi dell\'avventura e le stelle salvate verranno cancellati.</p>', actions: [{ label: 'Annulla', value: false }, { label: 'Ricomincia', cls: 'red', value: true }] }); if (v) BQ.story.newGame(); });
      } else add('Inizia l\'avventura', 'red big', () => BQ.story.newGame(), 'play');
      add('Catalogo giocabile', 'gold', () => BQ.go('catalog'), 'book');
      add('Sala giochi', 'blue', () => BQ.go('arcade'), 'game');
      add('La bottega vera', 'navy', () => BQ.go('info'), 'info');
      if (!BQ.env.app) add('Scarica l\'app', 'green', () => BQ.go('info', { sec: 'scarica' }), 'download');
      const rk = BQ.rank();
      $('#menuRank').innerHTML = `<b>${rk.title}</b><small>${rk.stars} ★ ${rk.next ? '· prossimo grado a ' + rk.next : ''}</small>`;
    },
  };

  /* ---------------- sala giochi ---------------- */
  const TINT = { slice: '#F6D5D5', flywheel: '#F6D5D5', sharpen: '#E2DAF5', pour: '#D9EFDD', needle: '#D9EFDD', ninja: '#FBE2C4', change: '#CFE0F5', keypad: '#CFE0F5', simon: '#CFE0F5', fakeweight: '#D9EFDD', stack: '#FBE2C4', memory: '#E2DAF5', trace: '#CFE9E5', grind: '#CFE9E5', polish: '#CFE0F5', runner: '#FBE2C4', quiz: '#E2DAF5', assemble: '#FFF0C2' };
  const ARC_ICON = { slice: 'ham', flywheel: 'flywheel', sharpen: 'knives', pour: 'scale', needle: 'scale', ninja: 'juicer', change: 'register', keypad: 'register', simon: 'phone', fakeweight: 'i_weight', stack: 'pots', memory: 'i_book', trace: 'bonesaw', grind: 'grinder', polish: 'pots', runner: 'van', quiz: 'i_star', assemble: 'goldblade' };
  Scr.arcade = {
    init(container) {
      const s = el('section', { class: 'screen', id: 'screen-arcade', style: { background: 'radial-gradient(circle at 50% 0,#1d3a78,#071129 75%)' } });
      s.append(el('div', { class: 'scroll' }, el('div', { class: 'wrapc', id: 'arcBody' })));
      container.append(s);
    },
    show() {
      const body = $('#arcBody'); body.innerHTML = '';
      const rk = BQ.rank(), pct = rk.next ? BQ.clamp((rk.stars - rk.from) / (rk.next - rk.from), 0, 1) : 1;
      body.append(el('h2', { class: 'h-title', html: 'Sala <em>giochi</em>' }), el('p', { class: 'h-lede', text: '18 minigiochi, più di 50 varianti. Tutti quelli che trovi nel catalogo, qui in un colpo solo. Guadagna stelle per salire di grado!' }));
      body.append(el('div', { class: 'rankcard', html: `<div><small style="font-weight:800;letter-spacing:.14em;color:#9E0D1A">IL TUO GRADO</small><div class="rk">${rk.title}</div></div><div class="bar"><i style="width:${pct * 100}%"></i></div><div><b style="font-family:var(--mono)">${rk.stars} ★</b>${rk.next ? `<br><small>prossimo: ${rk.nextTitle} a ${rk.next} ★</small>` : '<br><small>grado massimo!</small>'}</div>` }));
      // sfida del giorno
      const d = new Date(), key = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
      const all = BQ.items.all.filter((x) => x.img), it = all[key % all.length], plays = BQ.items.playsFor(it), p = plays[key % Math.min(3, plays.length)];
      const done = BQ.save.stars('daily:' + key + ':' + p.id);
      body.append(el('div', { class: 'daily', html: `<div class="im"><img src="${it.img}" alt=""></div><div style="flex:1;min-width:200px"><small style="letter-spacing:.16em;font-weight:800">SFIDA DEL GIORNO</small><h3>${p.game_name}</h3><div style="font-weight:600">${it.title}</div></div><div>${UI.stars(done)}</div>` }));
      const dbtn = el('button', { class: 'btn gold', html: A.ico('play') + ' Gioca la sfida', on: { click: async () => { await BQ.items.play(it, Object.assign({}, p, { id: 'daily:' + key + ':' + p.id })); Scr.arcade.show(); } } });
      $('.daily', body).append(dbtn);
      // griglia
      body.append(el('h3', { class: 'h-title', style: { fontSize: '1.8rem', marginTop: '1em' }, text: 'Tutti i minigiochi' }));
      const grid = el('div', { class: 'arc-grid' });
      Object.keys(BQ.mini.games).forEach((id) => {
        const g = BQ.mini.games[id], vs = Object.keys(g.variants || { base: 1 });
        const stars = vs.reduce((a, v) => a + BQ.save.stars('arcade:' + id + ':' + v), 0);
        grid.append(el('button', { class: 'arc-card', style: { '--tc': TINT[id] || '#DCEEFF' }, html: `<div class="th">${A.sprite(ARC_ICON[id] || g.icon || 'i_star')}</div><h3>${BQ.items.GAME_NAMES[id] || g.name}</h3><p>${g.blurb}</p><div class="row"><span class="pill">${vs.length} ${vs.length > 1 ? 'varianti' : 'variante'}</span>${UI.stars(Math.min(3, Math.floor(stars / vs.length)))}</div>`, on: { click: () => { BQ.audio.sfx('click'); pickVariant(id); } } }));
      });
      body.append(grid);
    },
  };
  async function pickVariant(id) {
    const g = BQ.mini.games[id];
    const vs = Object.keys(g.variants || { base: {} });
    const node = el('div', { class: 'varlist', style: { textAlign: 'left' } });
    const v = await new Promise((res) => {
      vs.forEach((k) => { const vv = (g.variants && g.variants[k]) || {}; node.append(el('button', { class: 'mgc', style: { width: '100%' }, html: `<div class="ic2">${A.sprite(ARC_ICON[id] || 'i_star')}</div><div><b>${vv.label || g.name}</b><small>${vv.brief || g.blurb}</small></div><div class="go">${UI.stars(BQ.save.stars('arcade:' + id + ':' + k))}<span class="p">${A.ico('play')}</span></div>`, on: { click: () => { BQ.audio.sfx('click'); res(k); } } })); });
      UI.modal({ title: BQ.items.GAME_NAMES[id] || g.name, node, wide: true, closeValue: null }).then((x) => { if (x === null) res(null); });
    });
    if (v) { const m = $('#layer-modal'); m.hidden = true; m.innerHTML = ''; await BQ.mini.play(id, v, { seed: Date.now() & 0xfff, pool: BQ.items.all.filter((x) => x.img && x.r === BQ.pick(BQ.items.REPS).id), item: BQ.pick(BQ.items.all.filter((x) => x.img)), title: g.variants ? g.variants[v].label : g.name, saveId: 'arcade:' + id + ':' + v, continueLabel: 'Chiudi' }); Scr.arcade.show(); }
  }

  /* ---------------- info: la bottega vera ---------------- */
  const SERV = [
    'Vendita e assistenza post vendita.', 'Teleassistenza/supporto tecnico', 'Laboratorio certificato ISO 9001 abilitato alla verifica periodica di registratori telematici.',
    'A tutti i nostri clienti offriamo un servizio di monitoraggio gratuito riguardante la scadenza della verifica periodica del registratore telematico\\bilancia.',
    'Verificazione periodica di strumenti per pesare in collaborazione con un organismo di ispezione.', 'Prodotti nuovi con garanzia 1 anno, affiancati anche da prodotti usati garantiti e revisionati.', 'Accurata ricostruzione affettatrici a volano e bilance d\'epoca.'];
  const OFFERS = [['affettatrice-kolossal.jpg', 'Affettatrice verticale Kolossal ricondizionata', 'Offerta'], ['bilancia-omega-slam-eco.jpg', 'Bilancia Omega slam eco ricondizionata', 'Offerta'], ['bilancia-omega-slam-eco-new.jpg', 'Bilancia Omega Slam Eco New ricondizionata', 'Offerta'], ['pentolame-1.jpg', 'Pentolame in acciaio inox scontato del 50%', '-50%'], ['pentolame-2.jpg', 'Pentolame in acciaio inox scontato del 50%', '-50%'], ['bar-3.jpg', 'Pentolame in acciaio inox scontato del 50%', '-50%']];
  const BRANDS = { 'Bilance': ['Omega Bilance', 'Italiana Macchi', 'Wunder'], 'Affettatrici e tritacarne': ['Kolossal Manconi', 'Fac', 'OMS', 'Minerva Omega Group', 'Fama'], 'Ristorazione': ['MBM', 'Angelo Po', 'Paderno', 'CB', 'Valko', 'Elframo'] };
  const PRODBRANDS = { registratori: ['Laboratorio certificato ISO 9001', 'Verifica periodica registratori telematici'], bilance: ['Omega Bilance', 'Italiana Macchi', 'Wunder'], affettatrici: ['Kolossal Manconi', 'Fac', 'OMS', 'Minerva Omega Group', 'Fama'], bar: ['MBM', 'Angelo Po', 'Paderno', 'CB', 'Valko', 'Elframo'], supermercati: ['Tritacarne', 'Segaossa', 'Confezionatrici'], accessori: ['Coltelleria', 'Pentolame in acciaio inox', 'Utensili'] };

  Scr.info = {
    init(container) {
      const s = el('section', { class: 'screen info-screen', id: 'screen-info' });
      const sc = el('div', { class: 'scroll', id: 'infoScroll' });
      const w = el('div', { class: 'wrapc' });
      const sub = el('nav', { class: 'info-sub' }, ...[['chi-siamo', 'Chi siamo'], ['prodotti', 'Prodotti'], ['servizi', 'Servizi'], ['marchi', 'Marchi'], ['consegne', 'Consegne'], ['offerte', 'Offerte'], ['dove-siamo', 'Dove siamo'], ['contatti', 'Contatti'], ['scarica', 'Scarica']].map((x) => el('a', { href: '#', text: x[1], on: { click: (e) => { e.preventDefault(); scrollTo(x[0]); } } })));
      w.append(sub);
      w.insertAdjacentHTML('beforeend', `
      <section class="isec" id="i-chi-siamo"><p class="k">Chi siamo</p><h2>Da padre<br><em>in figli</em></h2>
        <p style="max-width:46em;font-weight:600">Azienda costituita dal padre Angelo e tramandata ai figli, che opera nel settore da <b>ben oltre 50 anni</b>. Si occupa principalmente di vendita e assistenza tecnica di: bilance elettroniche, affettatrici, registratori di cassa, tritacarne, segaossa, ampio assortimento di attrezzature e accessori per negozi e ristorazione.</p>
        <p style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn red" href="tel:039650938">${A.ico('phone')} Chiama 039650938</a><a class="btn" href="mailto:brambilla.srl@virgilio.it">${A.ico('mail')} Scrivici</a><a class="btn gold" href="#" data-go-cat>${A.ico('book')} Sfoglia il catalogo</a></p>
        <div class="gal3" data-zoom>${['azienda-1', 'interni', 'azienda-2', 'azienda-3'].map((n, i) => `<img src="assets/img/${n}.jpg" alt="Il punto vendita Brambilla Angelo — foto ${i + 1}" loading="lazy">`).join('')}</div></section>
      <section class="isec" id="i-prodotti"><p class="k">Prodotti</p><h2>Tutto quello<br><em>che trattiamo</em></h2>
        <div class="cards">${BQ.items.REPS.map((r, i) => `<div class="icard"><span class="n">0${i + 1}</span><b>${r.name}</b><p style="margin:.2em 0 .6em">${r.blurb}</p><div class="brandchips" style="margin-bottom:10px">${PRODBRANDS[r.id].map((b) => `<span style="font-size:.78rem;padding:.15em .6em">${b}</span>`).join('')}</div><p style="display:flex;gap:8px;flex-wrap:wrap;margin:0"><button class="btn sm gold" data-rep="${r.id}">Sfoglia (${r.items.length})</button><a class="btn sm" href="assets/pdf/${r.pdf}" target="_blank" rel="noopener">PDF</a></p></div>`).join('')}</div></section>
      <section class="isec" id="i-servizi"><p class="k">Servizi</p><h2>Prima, durante<br><em>e dopo la vendita</em></h2><div class="cards">${SERV.map((t, i) => `<div class="icard"><span class="n">0${i + 1}</span>${t}</div>`).join('')}</div></section>
      <section class="isec" id="i-marchi"><p class="k">Marchi trattati</p><h2>I marchi<br><em>che trattiamo</em></h2>${Object.keys(BRANDS).map((g) => `<p><b>${g}</b></p><div class="brandchips" style="margin-bottom:14px">${BRANDS[g].map((b) => `<span>${b}</span>`).join('')}</div>`).join('')}</section>
      <section class="isec" id="i-consegne"><p class="k">Consegne a domicilio</p><h2>Te lo<br><em>portiamo noi</em></h2><div class="cards" style="align-items:center"><p style="font-weight:600;font-size:1.05rem">Consegnamo il tuo ordine direttamente presso il tuo punto vendita/domicilio, senza addebito di spese trasporto nella provincia di Monza e Brianza e con un piccolo contributo anche nelle altre località.</p><img src="assets/img/consegne.jpg" alt="Furgone per le consegne a domicilio" style="border:4px solid var(--navy);border-radius:16px;box-shadow:0 6px 0 var(--navy);width:100%" loading="lazy"></div></section>
      <section class="isec" id="i-offerte"><p class="k">Vetrina delle offerte</p><h2><em>Offerte</em></h2><p style="font-weight:600">Prodotti nuovi con garanzia 1 anno, affiancati anche da prodotti usati garantiti e revisionati.</p><div class="offers" data-zoom>${OFFERS.map((o) => `<figure class="offer" style="margin:0"><span class="rb">${o[2]}</span><img src="assets/img/${o[0]}" alt="${o[1]}" loading="lazy"><p>${o[1]}</p></figure>`).join('')}</div></section>
      <section class="isec" id="i-dove-siamo"><p class="k">Dove siamo</p><h2>A pochi metri<br><em>dal casello</em></h2><div class="cards" style="align-items:start">
        <div class="mapbox" id="mapBox"><div style="padding:16px"><p style="font-weight:800;margin:0 0 8px">A pochi metri dall'uscita del casello autostrada di Agrate Brianza A4 (MI-VE)</p><button class="btn red" id="mapLoad">${A.ico('map')} Carica la mappa</button><p style="font-size:.72rem;margin:8px 0 0;opacity:.75">Caricando la mappa accetti i cookie di Google Maps.</p></div></div>
        <div class="icard"><b>Indirizzo</b>Via Lecco n. 16 — 20864 Agrate Brianza (MB)<br><br><b>Come arrivare</b>A pochi metri dall'uscita del casello autostrada di Agrate Brianza A4 (MI-VE)<br><br><b>Zona di consegna</b>Senza addebito di spese trasporto nella provincia di Monza e Brianza e con un piccolo contributo anche nelle altre località<br><br><a class="btn sm" href="https://www.google.com/maps/search/?api=1&query=Brambilla+Angelo+S.R.L.+Via+Lecco+16+Agrate+Brianza" target="_blank" rel="noopener">Apri in Google Maps</a></div></div></section>
      <section class="isec" id="i-contatti"><p class="k">Contatti</p><h2>Scrivici<br><em>o passa a trovarci</em></h2><div class="cards" style="align-items:start">
        <div class="icard"><b>Brambilla Angelo S.R.L.</b><p style="margin:.5em 0">${A.ico('map')} Via Lecco n. 16<br>20864 Agrate Brianza (MB)</p><p style="margin:.5em 0">${A.ico('phone')} Telefono: <a href="tel:039650938"><b>039650938</b></a></p><p style="margin:.5em 0">${A.ico('phone')} Fax: 039650950</p><p style="margin:.5em 0">${A.ico('mail')} <a href="mailto:brambilla.srl@virgilio.it">brambilla.srl@virgilio.it</a></p><p style="margin:.5em 0">P.IVA 00878450964</p></div>
        <form class="icard cform" id="cForm" style="grid-column:span 1">
          <div><label for="f-rag">Ragione sociale *</label><input id="f-rag" name="ragione" required></div><div><label for="f-nome">Nome e Cognome *</label><input id="f-nome" name="nome" required></div>
          <div><label for="f-mail">Email *</label><input id="f-mail" name="email" type="email" required></div><div><label for="f-tel">Telefono *</label><input id="f-tel" name="telefono" type="tel" required></div>
          <div class="full"><label for="f-ogg">Oggetto</label><input id="f-ogg" name="oggetto"></div><div class="full"><label for="f-msg">Il tuo messaggio</label><textarea id="f-msg" name="messaggio"></textarea></div>
          <label class="consent full"><input type="checkbox" required><span>Autorizzo al trattamento dei dati — <a href="informativa-privacy.html">Informativa Privacy</a></span></label>
          <div class="full"><button class="btn red" type="submit">Invia ${A.ico('next')}</button></div></form></div></section>
      <section class="isec" id="i-scarica"><p class="k">Scarica</p><h2>Porta la bottega<br><em>sempre con te</em></h2><p style="font-weight:600">Brambilla Quest funziona anche offline, senza installare niente dal browser. Oppure scarica l'app per Android o la versione portatile per Windows (non richiede installazione).</p>
        <div class="dl-cards"><a class="dl" href="${DL.android}"><span class="th">${A.ico('download')}</span><span><b>Android</b><small>File .apk — installa e gioca</small></span></a><a class="dl" href="${DL.windows}"><span class="th">${A.ico('download')}</span><span><b>Windows portatile</b><small>File .exe — nessuna installazione</small></span></a><a class="dl" href="#" id="pwaInstall"><span class="th">${A.ico('download')}</span><span><b>Installa dal browser</b><small>Chrome, Edge, Safari: aggiungi alla schermata Home</small></span></a></div>
        <p style="font-size:.8rem;font-weight:600;color:#4a5b80">Su Android potrebbe servire consentire «Installa app sconosciute» per il browser. Tutte le release: <a href="${DL.page}" target="_blank" rel="noopener">github.com/cammo22/Brmbll/releases</a></p></section>
      <div class="legal"><b>Brambilla Angelo s.r.l.</b> — Sede legale Via Lecco 16 Agrate Brianza (MB) · C.F. 07925920154 · P.I. 00878450964 · Registro imprese n. 07925920154 · R.E.A. MB-1191079 CCIAA di Milano Monza Brianza Lodi · Cap. soc. € 60.000,00 i.v.<br><a href="informativa-privacy.html">Informativa Privacy</a> · <a href="cookies.html">Cookies</a></div>`);
      sc.append(w); s.append(sc); container.append(s);
      // interazioni
      w.addEventListener('click', (e) => {
        const r = e.target.closest('[data-rep]'); if (r) { BQ.audio.sfx('click'); BQ.go('catalog', { rep: r.dataset.rep }); return; }
        if (e.target.closest('[data-go-cat]')) { e.preventDefault(); BQ.go('catalog'); return; }
        const img = e.target.closest('[data-zoom] img'); if (img) { const z = el('div', { class: 'zoom', on: { click: () => z.remove() } }, el('img', { src: img.src, alt: img.alt })); document.body.append(z); }
      });
      $('#mapLoad', w).addEventListener('click', () => { const m = $('#mapBox', w); m.innerHTML = '<iframe title="Mappa: Brambilla Angelo S.R.L., Via Lecco 16, Agrate Brianza" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2792.850257827607!2d9.352890415879253!3d45.573449779102404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786b71ebce34a3d%3A0x3e9c7088dd80711a!2sBrambilla+Angelo+S.R.L.!5e0!3m2!1sit!2sit!4v1499157156585" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>'; });
      $('#cForm', w).addEventListener('submit', (e) => {
        e.preventDefault(); const f = e.target, v = (n) => f.elements[n].value.trim();
        const body = `Ragione sociale: ${v('ragione')}\nNome e Cognome: ${v('nome')}\nEmail: ${v('email')}\nTelefono: ${v('telefono')}\n\n${v('messaggio')}`;
        window.location.href = 'mailto:brambilla.srl@virgilio.it?subject=' + encodeURIComponent(v('oggetto') || 'Richiesta dal sito Brambilla Quest') + '&body=' + encodeURIComponent(body);
      });
      $('#pwaInstall', w).addEventListener('click', async (e) => { e.preventDefault(); if (BQ.deferredInstall) { BQ.deferredInstall.prompt(); BQ.deferredInstall = null; } else UI.modal({ title: 'Installa dal browser', html: '<p>Su Chrome/Edge: menu ⋮ → «Installa app». Su Safari (iPhone): Condividi → «Aggiungi alla schermata Home».</p>', actions: [{ label: 'Ok', cls: 'gold', value: 1 }] }); });
      if (BQ.env.app) { $('#i-scarica', w).remove(); $$('.info-sub a', w).pop().remove(); }
    },
    show(o) { const sec = o && o.sec; if (sec) setTimeout(() => scrollTo(sec), 80); else $('#infoScroll').scrollTop = 0; },
  };
  function scrollTo(id) { const t = $('#i-' + id); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
})();
