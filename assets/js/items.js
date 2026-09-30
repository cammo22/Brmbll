/* =========================================================
   BRAMBILLA QUEST — catalogo: articoli, reparti e minigiochi per articolo
   ========================================================= */
(function () {
  'use strict';
  const BQ = window.BQ;

  const REPS = [
    { id: 'registratori', name: 'Registratori di cassa', short: 'Casse', tc: 0, icon: 'register', pdf: 'catalogo-registratori-di-cassa.pdf', blurb: 'Registratori telematici, cassetti rendiresto e tutto per battere lo scontrino in regola.' },
    { id: 'bilance', name: 'Bilance', short: 'Bilance', tc: 1, icon: 'scale', pdf: 'catalogo-bilance.pdf', blurb: 'Bilance elettroniche Omega e Italiana Macchi, da banco e da incasso.' },
    { id: 'affettatrici', name: 'Affettatrici', short: 'Affettatrici', tc: 2, icon: 'slicer', pdf: 'catalogo-affettatrici.pdf', blurb: 'Kolossal, Fac, OMS, Fama… domestiche, professionali e a volano.' },
    { id: 'bar', name: 'Attrezzature bar e ristorazione', short: 'Bar & cucina', tc: 3, icon: 'juicer', pdf: 'catalogo-bar-ristorazione.pdf', blurb: 'Dalla centrifuga al forno, dalle vetrine ai lavelli in acciaio inox.' },
    { id: 'supermercati', name: 'Attrezzature supermercati e alimentari', short: 'Super & alimentari', tc: 4, icon: 'grinder', pdf: 'catalogo-supermercati-alimentari.pdf', blurb: 'Tritacarne, segaossa, sottovuoto, affilacoltelli e molto altro.' },
    { id: 'accessori', name: 'Accessori vari', short: 'Accessori', tc: 5, icon: 'knives', pdf: 'catalogo-accessori-vari.pdf', blurb: 'Coltelleria, pentolame, contenitori, rotoli e mille utensili.' },
  ];
  const repById = {}; REPS.forEach((r) => (repById[r.id] = r));

  const items = (window.BQ_ITEMS || []).map((x, idx) => {
    const it = Object.assign({}, x, { id: x.r + '-' + x.n, idx, title: x.t, spec: x.s, img: x.i ? 'assets/cat/' + x.i : null, rep: repById[x.r] });
    it.h = BQ.hash(it.id);
    return it;
  });
  const byId = {}; items.forEach((i) => (byId[i.id] = i));
  items.forEach((it) => { it.t = it.title; it.s = it.spec; });
  REPS.forEach((r) => { r.items = items.filter((i) => i.r === r.id); });

  /* ---- regole: nome articolo -> minigiochi ---- */
  const FOOD_BY = ['crudo', 'cotto', 'speck', 'salame', 'mortadella', 'bresaola', 'formaggio'];
  const RULES = [
    [/morsa per prosciutto/, () => [['slice', 'crudo'], ['trace', 'prosciutto'], ['sharpen', 'coltello']]],
    [/volano/, (it) => [['flywheel', it.h % 2 ? 'base' : 'fiore'], ['slice', 'crudo'], ['sharpen', 'affettatrice']]],
    [/affettatric/, (it) => [['slice', FOOD_BY[it.h % 7]], ['sharpen', 'affettatrice'], ['polish', 'affettatrice']]],
    [/registrator|rendiresto|controlla valute|eliminacode|prezzatric/, (it) => [['change', ['cassa', 'cassetto', 'fiscale'][it.h % 3]], ['keypad', 'prezzi'], ['simon', 'tastiera']]],
    [/bilanc|bilichetto/, (it) => [['pour', 'bilancia'], ['fakeweight', ['nove', 'sei', 'dodici'][it.h % 3]], ['needle', 'taratura'], ['keypad', 'peso']].slice(0, 3 + (it.h % 2))],
    [/rotoli|etichett|targhe|segnaprezzi|lavagn|spill|clip per|punte /, (it) => [['keypad', 'prezzi'], ['stack', 'casse']]],
    [/segaosso|lame per segaosso/, () => [['trace', 'osso'], ['polish', 'tritacarne'], ['sharpen', 'coltello']]],
    [/affilacoltell/, () => [['sharpen', 'coltello'], ['needle', 'temperatura']]],
    [/coltell|falcetta|seghetto|trinciapollo|batticarne|rotella/, (it) => [['sharpen', 'coltello'], ['trace', ['pane', 'pizza', 'prosciutto'][it.h % 3]]]],
    [/tritacarne|hamburgatrice|insaccatrice|cutter|pelapatate|pulisci cozze|grattugia|piastre in acciaio/, (it) => [['grind', /grattugia/.test(it.t.toLowerCase()) ? 'grattugia' : /pelapatate/.test(it.t.toLowerCase()) ? 'patate' : it.h % 2 ? 'carne' : 'hamburger'], ['sharpen', 'tritacarne'], ['assemble', 'tritacarne']]],
    [/tagliaverdure|tagliamozzarella|mixer|frullator|tagliapasta/, (it) => [['ninja', it.h % 2 ? 'verdure' : 'frutta'], ['polish', 'lavello']]],
    [/sottovuoto|termosigill|buste|nypol|imball|confezion|dispenser/, () => [['pour', 'sottovuoto'], ['needle', 'sigillo']]],
    [/centrifuga|spremiagrumi|estrattore/, () => [['ninja', 'frutta'], ['pour', 'bricco'], ['polish', 'lavello']]],
    [/ghiaccio/, () => [['ninja', 'ghiaccio'], ['pour', 'ghiaccio']]],
    [/forn|friggi|fry|cuocipasta|piastra|tostiera|crepiere|cucina|girarrost|cioccolat|bagnomaria|abbattitor|termometr/, () => [['needle', 'temperatura'], ['simon', 'forno'], ['polish', 'forno']]],
    [/lavastoviglie|lavabicchieri|lavello|lavamani|lavaoggetti|sterilizz|sterminat|cappa|cappe/, () => [['polish', 'lavello'], ['simon', 'forno']]],
    [/sifone|shaker|caraffe|olio/, () => [['pour', 'bricco'], ['ninja', 'frutta']]],
    [/pentol|schiumar|mestol|cucchia|spatol|fruste|colino|piatti|pirofile|molle|stencil|bocchette|sessole|anelli/, () => [['stack', 'pentole'], ['polish', 'pentolame'], ['pour', 'bricco']]],
    [/carrell|bancal|bacinell|contenitor|cassett|pattumier|armadi|scaffal|vetrin|espositor|cella|tavol|grembiul|guanti|rete elastica|dischi|pensili|lievitazione|spogliatoio/, (it) => [['stack', ['carrelli', 'casse', 'bacinelle'][it.h % 3]], ['runner', 'consegne'], ['polish', 'carrello']]],
  ];
  const GAME_NAMES = { slice: 'Affetta!', flywheel: 'Gira il volano', sharpen: 'Affila la lama', pour: 'Tieni e rilascia', needle: 'Ferma la lancetta', ninja: 'Taglia al volo', change: 'Dai il resto', keypad: 'Scontrino lampo', simon: 'Ripeti la sequenza', fakeweight: 'Il peso falso', stack: 'Impila al volo', memory: 'Coppie del catalogo', trace: 'Taglia sulla linea', grind: 'Tritacarne sicuro', polish: 'Lucida l\'inox', runner: 'Consegna a domicilio', quiz: 'Scheda tecnica', assemble: 'Monta i pezzi' };

  function playsFor(it) {
    if (it._plays) return it._plays;
    const low = it.title.toLowerCase();
    let specific = null;
    for (const r of RULES) { if (r[0].test(low)) { specific = r[1](it); break; } }
    if (!specific) specific = [['stack', 'casse'], ['runner', 'consegne']];
    const list = specific.slice(0, 3).map((p) => ({ game: p[0], variant: p[1] }));
    list.push({ game: 'quiz', variant: 'scheda' });
    list.push({ game: 'memory', variant: 'reparto' });
    if (it.img) list.push({ game: 'quiz', variant: 'foto' });
    list.forEach((p) => {
      const def = BQ.mini.games[p.game], v = def && def.variants && def.variants[p.variant];
      p.id = 'item:' + it.id + ':' + p.game + ':' + p.variant;
      p.name = v && v.label ? v.label : (def ? def.name : p.game);
      p.game_name = GAME_NAMES[p.game] || p.game;
      p.blurb = (v && v.brief) || (def && def.blurb) || '';
      p.icon = def && def.icon;
      p.stars = BQ.save.stars(p.id);
    });
    it._plays = list;
    return list;
  }

  function play(it, p) {
    const pool = it.rep.items.filter((x) => x.img);
    return BQ.mini.play(p.game, p.variant, { seed: it.h + (BQ.save.data.plays || 0), item: it, pool, photo: it.img, title: p.game_name + ' · ' + p.name, saveId: p.id, continueLabel: 'Torna al catalogo' }).then((r) => { p.stars = BQ.save.stars(p.id); return r; });
  }

  function itemStars(it) { return playsFor(it).reduce((a, p) => a + BQ.save.stars(p.id), 0); }
  function search(q) {
    q = q.trim().toLowerCase(); if (!q) return [];
    const words = q.split(/\s+/);
    return items.filter((it) => { const hay = (it.title + ' ' + it.spec + ' ' + it.rep.name).toLowerCase(); return words.every((w) => hay.includes(w)); }).slice(0, 40);
  }

  BQ.items = { all: items, byId, REPS, repById, playsFor, play, itemStars, search, GAME_NAMES };
  BQ.REPS = REPS;

  // anche i minigiochi "di storia" possono richiamare un articolo a caso del reparto
  BQ.items.random = (rep, seed) => { const l = repById[rep].items.filter((x) => x.img); return l[seed % l.length]; };
})();
