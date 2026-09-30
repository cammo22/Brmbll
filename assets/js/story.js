/* =========================================================
   BRAMBILLA QUEST — la storia: "Il Mistero della Lama d'Oro"
   Personaggi di fantasia. Tutti i prodotti e i servizi sono quelli veri.
   ========================================================= */
(function () {
  'use strict';
  const BQ = window.BQ, UI = BQ.ui, Adv = BQ.adv, A = BQ.art;
  const S = () => BQ.save.data;
  const say = (w, t, o) => UI.say(w, t, o);
  const flag = (k, v) => BQ.save.flag(k, v);
  const story = (BQ.story = {});

  const item = (id, rep) => BQ.items.byId[id] || BQ.items.REPS.find((r) => r.id === rep).items[0];

  /* =========================================================
     I SEI CAPITOLI (uno per reparto)
     ========================================================= */
  const CH = {
    1: {
      rep: 'registratori', npc: 'giulia', title: 'Il conto che non torna',
      proofs: [
        { label: 'Dai il resto', spot: 'Registratore', game: 'change', variant: 'cassa', item: 'registratori-3', after: 'Resto giusto, cliente contento. Così si fa!' },
        { label: 'Scontrino lampo', spot: 'Tastierino', game: 'keypad', variant: 'prezzi', item: 'registratori-1', after: 'Che velocità! Sembri nato dietro un banco.' },
        { label: 'Il codice del cassetto', spot: 'Cassetto rendiresto', game: 'simon', variant: 'cassetto', item: 'registratori-5', after: 'Il codice dev\'essere questo… sento uno scatto!' },
      ],
      async intro() {
        await say('giulia', 'Finalmente, un aiuto! Sono Giulia, sto alle casse. Stanotte qualcuno ha armeggiato col registratore: sono spariti 12,50 € e è uscito uno scontrino firmato «O.T.».', { mood: 'worried' });
        await say('tu', 'Forse qualcuno ha manomesso il registratore telematico…');
        await say('giulia', 'Forse. Ma intanto i clienti fanno la fila. Dai il resto come si deve, batti i prezzi a mille all\'ora e poi proviamo a riaprire il cassetto: ha un codice strano.');
      },
      async outro() {
        await say('giulia', 'Il cassetto si è aperto! Dentro c\'è uno scontrino strappato, battuto alle 03:14 di notte… e guarda: un pezzo di metallo dorato!', { mood: 'surprised', pose: 'wave' });
        await BQ.story.give('clue1', 'Indizio trovato!', 'Uno scontrino strappato firmato «O.T.». Chi batte scontrini alle tre di notte?');
        await BQ.story.give('frag1', 'Frammento della Lama d\'Oro!', 'Uno dei sei pezzi della lama. Ne mancano cinque.');
        await say('tu', 'È un frammento della Lama d\'Oro!');
        await say('giulia', 'Gli altri saranno nascosti negli altri reparti. Vai dalle bilance: lì da una settimana i conti sono tutti sballati.', { mood: 'happy' });
      },
      call: [
        ['telefono', 'Pronto? Sono… un cliente. Un cliente molto interessato al vostro cassetto. Bravi, avete battuto qualche scontrino.', 'sly'],
        ['telefono', 'Ma le bilance, ah, le bilance non mentono mai. Io sì. Ahahah!', 'sly'],
        ['tu', 'Chi parla? Aspetti!'],
        ['narr', 'Clic. La linea è caduta.'],
      ],
    },
    2: {
      rep: 'bilance', npc: 'angelo', title: 'Il peso della verità',
      proofs: [
        { label: 'Pesa giusto', spot: 'Bilancia elettronica', game: 'pour', variant: 'bilancia', item: 'bilance-2', after: 'Un chilo è un chilo. Ecco perché le bilance si verificano!' },
        { label: 'Il peso falso', spot: 'Pesi campione', game: 'fakeweight', variant: 'nove', item: 'bilance-3', after: 'Bravo, hai un occhio da ispettore!' },
        { label: 'Taratura', spot: 'Display', game: 'needle', variant: 'taratura', item: 'bilance-1', after: 'Tarata a regola d\'arte.' },
      ],
      async intro() {
        await say('angelo', 'Le mie bilance! Da una settimana pesano «a modo loro»: un chilo di farina ne segna novecento grammi. Così si rovina il commercio di tutta la Brianza.', { mood: 'angry' });
        await say('tu', 'Bisogna ritarare tutto!');
        await say('angelo', 'E trovare il peso truccato. Tra i pesi campione ce n\'è uno di piombo, ne sono sicuro: è più pesante degli altri. Lo troverai con la bilancia a due piatti.');
      },
      async outro() {
        await say('angelo', 'Eccolo! Il peso di piombo! Sul fondo è inciso «T & F»… e nella base della bilancia c\'è un altro frammento!', { mood: 'surprised', pose: 'wave' });
        await BQ.story.give('clue2', 'Indizio trovato!', 'Un peso di piombo truccato, inciso «T & F».');
        await BQ.story.give('frag2', 'Frammento della Lama d\'Oro!', 'Secondo pezzo della lama.');
        await say('angelo', '«T & F»… conosco quelle iniziali, ma non mi viene in mente dove. Con l\'età la memoria pesa meno del piombo. Vai da Marco: affettatrici!', { mood: 'worried' });
      },
      call: [
        ['telefono', 'Pronto, pronto. Sì, lo so chi sei. Un garzone! Mi ha sempre commosso chi si dà da fare.', 'sly'],
        ['telefono', 'Peccato che il tuo peso di piombo non dimostri niente. Tutti hanno un peso di piombo in cantina.', 'sly'],
        ['tu', 'Noi invece le bilance le verifichiamo davvero!'],
        ['telefono', 'Ah, ah. Vedremo quanto taglia… la vostra affettatrice. Clic.', 'sly'],
      ],
    },
    3: {
      rep: 'affettatrici', npc: 'marco', title: 'Il cuore della bottega',
      proofs: [
        { label: 'Prosciutto crudo!', spot: 'Prosciutto crudo', game: 'slice', variant: 'crudo', item: 'affettatrici-1', after: 'Questo sì che è crudo tagliato a regola d\'arte!' },
        { label: 'Il volano', spot: 'Affettatrice a volano', game: 'flywheel', variant: 'base', item: 'affettatrici-13', after: 'Ritmo perfetto. Il volano è contento.' },
        { label: 'Affilatura', spot: 'Lama da affilare', game: 'sharpen', variant: 'affettatrice', item: 'supermercati-3', after: 'Ora taglia un pelo a mezz\'aria!' },
      ],
      async intro() {
        await say('marco', 'Sono Marco, il mio regno è l\'affettatrice! Stanotte il volano si è bloccato e la lama di riserva è smussata. Senza affettati, la festa è un disastro.', { mood: 'worried' });
        await say('tu', 'Cosa dobbiamo fare?');
        await say('marco', 'Tre cose: servire il crudo come si deve, far girare il volano, affilare la lama. Il solito, insomma. Attento alle fette strappate: ritmo!', { pose: 'wave' });
      },
      async outro() {
        await say('marco', 'Un momento… sotto il volano c\'è qualcosa di dorato! Un frammento! E questo… un guanto giallo, dimenticato da chi ha scassinato.', { mood: 'surprised' });
        await BQ.story.give('clue3', 'Indizio trovato!', 'Un guanto giallo da lavoro.');
        await BQ.story.give('frag3', 'Frammento della Lama d\'Oro!', 'Terzo pezzo della lama.');
        await say('marco', 'Mi sa che chi è venuto qui porta guanti gialli. Da Pina, al bar, hanno visto qualcosa. Corri!', { mood: 'happy' });
      },
      call: [
        ['telefono', 'Tre frammenti, eh? Bravo, bravo. Sapete, il prosciutto non mi è mai piaciuto: troppo… giusto.', 'sly'],
        ['tu', 'Lei non capisce niente di prosciutto!'],
        ['telefono', 'Capisco di grammi, ragazzo. Di grammi che «non tornano». Clic.', 'sly'],
      ],
    },
    4: {
      rep: 'bar', npc: 'pina', title: 'Il retrobottega',
      proofs: [
        { label: 'Frutta alla centrifuga', spot: 'Centrifuga', game: 'ninja', variant: 'frutta', item: 'bar-1', after: 'Una spremuta da applausi, tesoro!' },
        { label: 'La torre di pentole', spot: 'Pentolame', game: 'stack', variant: 'pentole', item: 'accessori-66', after: 'Stabile come una roccia. Anzi, come una pentola!' },
        { label: 'Coppie in cucina', spot: 'Cassa di frutta', game: 'memory', variant: 'reparto', item: 'bar-13', after: 'Che memoria! Io dimentico dove metto gli occhiali.' },
      ],
      async intro() {
        await say('pina', 'Tesoro! Finalmente qualcuno! Sono Pina, regina del bar e della cucina. La centrifuga è impazzita, le pentole sono crollate e qualcuno mi ha portato via il caffè!', { mood: 'surprised', pose: 'wave' });
        await say('tu', 'Un ladro di caffè?');
        await say('pina', 'Un ladro di TUTTO, caro. Ha lasciato solo un tovagliolo con una macchia. Aiutami a rimettere ordine e lo analizziamo insieme!', { mood: 'angry' });
      },
      async outro() {
        await say('pina', 'Ecco il tovagliolo! Macchia di caffè e una scritta: «Bar Trucco — il caffè che pesa giusto». E dietro la centrifuga… luccica qualcosa!', { mood: 'surprised' });
        await BQ.story.give('clue4', 'Indizio trovato!', 'Un tovagliolo: «Bar Trucco — il caffè che pesa giusto».');
        await BQ.story.give('frag4', 'Frammento della Lama d\'Oro!', 'Quarto pezzo della lama.');
        await say('pina', 'Trucco… Trucco… «T & F»! Dai, che ci sei quasi. Vai da Marco nel retro: macelleria!', { mood: 'happy' });
      },
      call: [
        ['telefono', 'Il caffè della signora Pina era eccellente. Quasi quanto il mio. Quasi.', 'sly'],
        ['tu', 'Lo ammette!'],
        ['telefono', 'Non ammetto niente. Ho solo un ottimo gusto. E un ottimo udito: sento che ne avete già quattro, di frammenti. Clic.', 'sly'],
      ],
    },
    5: {
      rep: 'supermercati', npc: 'marco', title: 'Carne, ossa e sottovuoto',
      proofs: [
        { label: 'Tritacarne sicuro', spot: 'Tritacarne', game: 'grind', variant: 'carne', item: 'supermercati-76', after: 'Niente intrusi nella carne. Igiene prima di tutto.' },
        { label: 'Il segaosso', spot: 'Segaosso', game: 'trace', variant: 'osso', item: 'supermercati-58', after: 'Un taglio pulito come un bisturi!' },
        { label: 'Sottovuoto', spot: 'Macchina sottovuoto', game: 'pour', variant: 'sottovuoto', item: 'supermercati-60', after: 'Busta sigillata a regola d\'arte.' },
      ],
      async intro() {
        await say('marco', 'Siamo nel retro, reparto carni. Qui ci sono tritacarne, segaossa e sottovuoto. Qualcuno ha nascosto un pezzo di lama in una di queste macchine, ci scommetto.', { mood: 'worried' });
        await say('tu', 'E come lo troviamo?');
        await say('marco', 'Rimettendo in funzione tutto. Attento agli intrusi nel tritacarne: forchette, guanti, sassi… la sicurezza alimentare è sacra!');
      },
      async outro() {
        await say('marco', 'Trovato! Il frammento era incastrato nell\'osso accanto al segaosso. E guarda i segni: li riconosco, sono di una lama «Segheria Trucco».', { mood: 'surprised' });
        await BQ.story.give('clue5', 'Indizio trovato!', 'Un osso con segni di sega: «Segheria Trucco».');
        await BQ.story.give('frag5', 'Frammento della Lama d\'Oro!', 'Quinto pezzo della lama.');
        await say('marco', 'Ne manca uno solo. Il papà dice che sarà negli accessori: coltelli e pentolame, il suo regno.', { mood: 'happy' });
      },
      call: [
        ['telefono', 'Cinque su sei. Devo ammettere che siete più in gamba di quel che pensassi.', 'sly'],
        ['telefono', 'Ma l\'ultimo frammento è nel posto più confuso di tutta la bottega. Buona fortuna a trovarlo. Clic.', 'sly'],
      ],
    },
    6: {
      rep: 'accessori', npc: 'angelo', title: 'Le lame minori',
      proofs: [
        { label: 'Affila il coltello', spot: 'Coltelli', game: 'sharpen', variant: 'coltello', item: 'accessori-15', after: 'Un coltello così taglia anche i pensieri.' },
        { label: 'Lucida l\'inox', spot: 'Pentolame', game: 'polish', variant: 'pentolame', item: 'accessori-66', after: 'Si specchia dentro! Brillante!' },
        { label: 'Il giusto utensile', spot: 'Scatola dei pezzi', game: 'quiz', variant: 'scheda', item: 'accessori-18', after: 'Conosci gli utensili meglio di me!' },
      ],
      async intro() {
        await say('angelo', 'Gli accessori! Coltelleria, pentolame, contenitori, rotoli… Qui ho più roba che memoria. L\'ultimo frammento dev\'essere da queste parti.', { mood: 'happy' });
        await say('tu', 'Da dove cominciamo?');
        await say('angelo', 'Dalle lame: un coltello affilato è un coltello sicuro. Poi lucidiamo l\'inox e ripassiamo le schede tecniche. Conoscere i prodotti è il mestiere.');
      },
      async outro() {
        await say('angelo', 'Un guanto di maglia d\'acciaio… con un nome ricamato: «O. Trucco»! E qui, nascosto sotto le pentole, l\'ultimo frammento!', { mood: 'surprised', pose: 'wave' });
        await BQ.story.give('clue6', 'Indizio trovato!', 'Un guanto d\'acciaio con il nome ricamato: «O. Trucco».');
        await BQ.story.give('frag6', 'Frammento della Lama d\'Oro!', 'Sesto e ultimo pezzo della lama!');
        await say('angelo', 'Sei frammenti e sei indizi. Andiamo in archivio a mettere in ordine le idee: stasera c\'è la festa e dobbiamo sapere chi è stato!', { mood: 'angry' });
      },
      call: [],
    },
  };
  story.CH = CH;

  /* ---------- premi ---------- */
  story.give = async function (id, title, text) {
    BQ.save.give(id);
    const d = BQ.INV[id];
    await UI.reward({ title, name: d.name, text, sprite: d.spr, spriteOpts: d.sprOpts });
  };

  const done = (k, i) => flag('p_' + k + '_' + i);
  const allDone = (k) => CH[k].proofs.every((p, i) => done(k, i));

  /* ---------- una prova ---------- */
  async function doProof(k, i) {
    const ch = CH[k], p = ch.proofs[i], it = item(p.item, ch.rep);
    const c = await UI.choose([`Affronta la prova: ${p.label}`, 'Guarda nel catalogo', 'Lascia stare'], { who: 'narr', text: `${p.spot}. ${it.title}.` });
    if (c === 1) { BQ.go('catalog', { item: it.id, back: 'adv' }); return; }
    if (c !== 0) return;
    UI.hideDlg();
    const pool = it.rep.items.filter((x) => x.img);
    const r = await BQ.mini.play(p.game, p.variant, { seed: 11 + k * 7 + i, item: it, pool, photo: it.img, title: p.label, saveId: `story:${k}:${i}`, continueLabel: 'Continua' });
    if (r.quit) return;
    if (r.stars >= 1) {
      const first = !done(k, i); flag('p_' + k + '_' + i, true);
      Adv.refresh();
      if (allDone(k)) { await BQ.sleep(200); await runOutro(k); }
      else if (first) await say(ch.npc, p.after, { mood: 'happy' });
    } else await say(ch.npc, 'Non importa, riprova: ci vuole pratica!', { mood: 'neutral' });
  }

  async function runOutro(k) {
    const ch = CH[k];
    await ch.outro();
    flag('ch' + k + '_done', true);
    if (k < 6) flag('call' + k, true);
    S().chapter = Math.max(S().chapter, k + 1); BQ.save.commit();
    if (k === 6) { await Adv.goto('archivio'); return; }
    await Adv.goto('bottega');
  }

  /* =========================================================
     SCENE
     ========================================================= */
  const SC = BQ.scenes;

  // --- strada ---
  SC.strada = {
    title: 'Via Lecco 16, Agrate Brianza',
    kicker: () => (flag('ended') ? 'Epilogo' : S().chapter >= 7 ? 'Finale' : 'Prologo'),
    artOpts: () => ({ mood: flag('deduced') ? 'dusk' : 'dawn' }),
    chars() {
      const l = [];
      if (flag('deduced') && !flag('chased')) l.push({ id: 'angelo', fx: 820, fy: 790, h: 420, mood: 'angry', pose: 'point' });
      else if (!flag('deduced')) l.push({ id: 'angelo', fx: 820, fy: 790, h: 420, mood: flag('prologue') ? 'happy' : 'worried', pose: flag('prologue') ? 'wave' : 'idle' });
      if (flag('chased') && !flag('blade')) l.push({ id: 'ottavio', fx: 1020, fy: 790, h: 430, mood: 'sly' });
      l.push({ id: 'fetta', cat: true, fx: 560, fy: 790, h: 120, mood: 'neutral' });
      return l;
    },
    spots() {
      return [
        { x: 920, y: 420, w: 190, h: 290, label: 'Entra in bottega', g: '→', act: () => enterShop() },
        { x: 1140, y: 430, w: 180, h: 240, label: 'Manifesto della festa', g: '?', act: () => say('narr', 'Il manifesto dice: «OGGI FESTA — 50 ANNI di bilance, affettatrici e registratori di cassa! Brindisi a mezzanotte con il taglio del prosciutto».') },
        { x: 290, y: 420, w: 560, h: 250, label: 'Vetrina offerte', g: '€', act: async () => { await say('narr', 'In vetrina: affettatrici a volano, bilance revisionate e pentolame scontato. Prodotti nuovi con garanzia 1 anno e usati garantiti.'); BQ.go('info', { sec: 'offerte' }); } },
        { x: 1330, y: 380, w: 240, h: 130, label: 'Cartello del casello', g: '⌖', act: async () => { await say('narr', 'Il cartello indica il casello dell\'A4 Agrate Brianza: la bottega è a pochi metri dall\'uscita.'); BQ.go('info', { sec: 'dove-siamo' }); } },
        { x: 965, y: 470, w: 100, h: 110, label: 'Biglietto sulla porta', g: '✉', cond: () => !flag('prologue'), act: () => readNote() },
        { x: 1120, y: 628, w: 420, h: 200, label: 'Il furgone', g: '🚐', cond: () => flag('deduced') && !flag('blade'), act: () => chase() },
        { x: 480, y: 690, w: 160, h: 110, label: 'Fetta', g: '♥', act: () => say('fetta', 'Miao. (Tradotto: ho fame. Di prosciutto.)', { mood: 'happy' }) },
        { x: 720, y: 420, w: 210, h: 380, label: 'Angelo', g: '…', cond: () => !flag('deduced'), act: () => talkAngelo() },
      ];
    },
    async enter(o) {
      if (!flag('prologue')) await prologue();
      else if (flag('deduced') && !flag('chased')) { await say('angelo', 'Il furgone è qui fuori! Il magazzino di Ottavio è vicino al casello: sbrigati o la Lama sparisce per sempre!', { mood: 'angry' }); }
    },
  };

  async function readNote() {
    await say('narr', 'Un biglietto, inchiodato alla porta con un punteruolo da macellaio:');
    await say('narr', '«IL PESO GIUSTO NON ESISTE. PESATEVI QUESTA. — O.T.»');
    await say('tu', 'O.T.… e chi sarà mai?', { mood: 'worried' });
    flag('note', true);
  }

  async function enterShop() {
    if (!flag('prologue')) { await say('angelo', 'Un attimo! Prima guarda il biglietto sulla porta: è importante.', { mood: 'worried' }); return; }
    await Adv.goto('bottega');
  }

  async function talkAngelo() {
    if (flag('ended')) { await say('angelo', 'Cinquant\'anni e non sentirli! Entra, la festa continua!', { mood: 'happy' }); return; }
    if (!flag('prologue')) { await say('angelo', 'Guarda il biglietto sulla porta, {nome}. Poi ne parliamo.', { mood: 'worried' }); return; }
    await say('angelo', 'Dai, dentro! Ogni reparto ha un frammento della Lama d\'Oro. Se ti perdi, tocca Fetta.', { mood: 'happy' });
  }

  async function chooseIdentity() {
    return new Promise((res) => {
      let av = S().avatar || 0;
      const node = BQ.el('div', null,
        BQ.el('p', { text: 'Scegli come sei vestito e dì come ti chiami:' }),
        (() => { const w = BQ.el('div', { class: 'avatars' }); [0, 1, 2].forEach((i) => { const b = BQ.el('button', { class: i === av ? 'sel' : '', 'aria-label': 'Avatar ' + (i + 1), html: A.char('p' + i, { portrait: true, mood: 'happy' }), on: { click: () => { av = i; BQ.$$('.avatars button', w).forEach((x, k) => x.classList.toggle('sel', k === i)); BQ.audio.sfx('click'); } } }); w.append(b); }); return w; })(),
        BQ.el('input', { type: 'text', id: 'nameInp', maxlength: '14', placeholder: 'Il tuo nome', value: S().name || '' }));
      UI.modal({ title: 'Nuovo garzone', node, closable: false, actions: [{ label: 'Comincia!', cls: 'red', value: 'ok', onclick: () => { const v = BQ.$('#nameInp').value.trim() || 'Garzone'; S().name = v.slice(0, 14); S().avatar = av; BQ.save.commit(); } }] }).then(res);
    });
  }

  async function prologue() {
    Adv.cinema(true);
    await say('narr', 'Agrate Brianza, Via Lecco 16. Sono le sei e mezza del mattino e dalla nebbia spunta una bottega che sa di caffè, di ferro e di prosciutto.');
    await say('narr', 'Oggi è il tuo primo giorno da garzone alla Brambilla Angelo s.r.l.: da oltre 50 anni bilance, affettatrici e registratori di cassa.');
    Adv.cinema(false);
    await chooseIdentity();
    await say('angelo', 'Ah, eccoti! Tu sei il nuovo garzone, {nome}! Io sono Angelo, il fondatore. Sì, quello coi baffi. Non ridere.', { mood: 'happy', pose: 'wave' });
    await say('tu', 'Buongiorno! Sono pronto a lavorare!', { mood: 'happy' });
    await say('angelo', 'Magari! Stanotte è successo un disastro: è sparita la Lama d\'Oro!', { mood: 'worried' });
    await say('tu', 'La Lama d\'Oro?');
    await say('angelo', 'La prima lama che montai sulla mia prima affettatrice, cinquant\'anni fa. Non ha mai smesso di tagliare. Stasera c\'è la festa e a mezzanotte, con lei, si taglia il prosciutto del brindisi!', { mood: 'worried' });
    await say('angelo', 'E sulla porta hanno lasciato un biglietto. Guardalo, per favore.', { mood: 'angry', pose: 'point' });
    // il giocatore deve toccare il biglietto
    UI.hideDlg();
    flag('promptNote', true);
    Adv.$stage().classList.add('hints');
    await new Promise((res) => { const off = BQ.bus.on('save', () => { if (flag('note')) { off(); res(); } }); setTimeout(() => { if (!flag('note')) UI.toast('Tocca il biglietto sulla porta ✉', { sprite: 'i_receipt' }); }, 600); });
  }

  // il prologo prosegue dopo la lettura del biglietto
  BQ.bus.on('save', () => { if (flag('note') && !flag('prologue') && BQ.current === 'adv' && !story._pro) { story._pro = true; setTimeout(continuePrologue, 400); } });
  async function continuePrologue() {
    Adv.$stage().classList.remove('hints');
    while (Adv.busy) await BQ.sleep(150);
    await Adv.run(async () => {
      await say('angelo', 'O.T.… Non so chi sia. Ma le bilance di mezza Brianza sbagliano i conti da una settimana. Io ti aiuto con le prove, tu aiuti me con la bottega. Affare fatto?', { mood: 'worried' });
      const c = await UI.choose(['Affare fatto!', 'Posso prima fare colazione?'], { who: 'tu', text: '' });
      if (c === 1) await say('angelo', 'Colazione? Ah, i giovani d\'oggi! Dopo, dopo. Intanto… ecco il grembiule!', { mood: 'angry' });
      else await say('angelo', 'Così mi piace! Ecco il tuo grembiule.', { mood: 'happy' });
      BQ.save.give('apron');
      await UI.reward({ title: 'Nuovo oggetto!', name: 'Grembiule Brambilla', text: 'Da oggi sei ufficialmente uno di famiglia.', sprite: 'i_apron' });
      await say('angelo', 'E questo è il Catalogo: sfogliarlo ti allena. Ogni oggetto della bottega ha le sue sfide e i suoi minigiochi.', { pose: 'wave', mood: 'happy' });
      BQ.save.give('book');
      await UI.reward({ title: 'Nuovo oggetto!', name: 'Il Catalogo', text: 'Lo trovi sempre in basso a sinistra, oppure con il tasto del libro.', sprite: 'i_book' });
      BQ.audio.sfx('meow');
      await say('fetta', 'Miao.', { mood: 'happy' });
      await say('angelo', 'Lei è Fetta, la gatta di bottega. Se ti perdi, toccala: ti dà un consiglio. Di solito sbagliato, ma con affetto.', { mood: 'happy' });
      await say('angelo', 'Adesso entra: Marco ti aspetta. C\'è un cliente che vuole cento grammi di crudo. Va\'!', { pose: 'point', mood: 'happy' });
      flag('prologue', true);
      await Adv.goto('bottega');
    });
  }

  // --- bottega (hub) ---
  const DOORS = [
    { x: 80, name: 'Casse e registratori' }, { x: 330, name: 'Bilance' }, { x: 580, name: 'Affettatrici' },
    { x: 830, name: 'Bar e ristorazione' }, { x: 1080, name: 'Supermercati e alimentari' }, { x: 1330, name: 'Accessori vari' },
  ];
  SC.bottega = {
    title: 'La bottega',
    kicker: () => (flag('ended') ? 'Festa dei 50 anni' : S().chapter ? 'Capitolo ' + Math.min(6, S().chapter) : 'Benvenuto'),
    artOpts: () => ({ party: flag('ended') }),
    chars() {
      const l = [];
      if (flag('ended')) {
        l.push({ id: 'giulia', fx: 280, fy: 760, h: 420, mood: 'happy', pose: 'wave' }, { id: 'pina', fx: 1180, fy: 760, h: 420, mood: 'happy', pose: 'wave' }, { id: 'marco', fx: 430, fy: 760, h: 440, mood: 'happy' }, { id: 'ottavio', fx: 1330, fy: 760, h: 420, mood: 'happy' });
      } else if (flag('prologue') && !flag('tutorial')) l.push({ id: 'marco', fx: 420, fy: 760, h: 440, mood: 'happy', pose: 'wave' });
      l.push({ id: 'angelo', fx: 780, fy: 760, h: 430, mood: flag('ended') ? 'happy' : 'neutral', pose: flag('ended') ? 'wave' : 'idle' });
      l.push({ id: 'fetta', cat: true, fx: 1020, fy: 706, h: 130 });
      return l;
    },
    spots() {
      const sp = DOORS.map((d, i) => {
        const k = i + 1, lockd = S().chapter < k;
        return { x: d.x, y: 170, w: 200, h: 390, label: d.name, g: String(k), locked: lockd, done: flag('ch' + k + '_done'), act: async () => {
          if (!flag('tutorial')) { await say('marco', 'Ehi, garzone! Prima il cliente: cento grammi di crudo!', { mood: 'angry' }); return; }
          if (lockd) { await say('narr', 'La porta è chiusa a chiave. Prima completa il reparto precedente: nella storia si va in ordine!'); return; }
          await Adv.goto('rep' + k);
        } };
      });
      sp.push(
        { x: 190, y: 560, w: 170, h: 150, label: 'Telefono', g: '☎', act: () => phone() },
        { x: 600, y: 790, w: 400, h: 100, label: 'Banco informazioni', g: 'i', act: async () => { await say('narr', 'Il banco informazioni della bottega vera: servizi, marchi, consegne, dove siamo e contatti.'); BQ.go('info'); } },
        { x: 1040, y: 575, w: 130, h: 120, label: 'Il Catalogo', g: '📖', act: () => BQ.go('catalog') },
        { x: 1280, y: 560, w: 200, h: 170, label: 'Registratore di cassa', g: '€', act: () => say('giulia', 'Non toccare la cassa, garzone! Se hai bisogno di resto, chiedi.', { mood: 'angry' }) },
        { x: 680, y: 380, w: 210, h: 400, label: 'Angelo', g: '…', act: () => talkHub('angelo') },
        { x: 330, y: 360, w: 180, h: 420, label: 'Marco', g: '…', cond: () => (flag('prologue') && !flag('tutorial')) || flag('ended'), act: () => (flag('ended') ? talkHub('marco') : tutorial()) },
        { x: 960, y: 590, w: 120, h: 120, label: 'Fetta', g: '♥', act: () => { BQ.audio.sfx('meow'); return say('fetta', 'Miao! (Mi fai le coccole? Ti aiuto in cambio!)', { mood: 'happy' }); } },
      );
      return sp;
    },
    async enter(o) {
      if (flag('ended')) return;
      if (flag('prologue') && !flag('tutorial')) { await tutorial(); return; }
      // telefonate in sospeso
      for (let k = 1; k <= 5; k++) if (flag('call' + k) && !flag('called' + k)) { await phone(k); break; }
    },
  };

  async function tutorial() {
    if (!flag('intro_tut')) {
      flag('intro_tut', true);
      await say('marco', 'Tu sei il nuovo! Sono Marco, il mio regno è l\'affettatrice. Vedi quel signore? Vuole 100 grammi di prosciutto crudo.', { mood: 'happy', pose: 'wave' });
      await say('marco', 'Regola d\'oro: ritmo costante, fette sottili e occhio alla bilancia. Trascina il carrello avanti e indietro. Provaci!');
    } else await say('marco', 'Allora, il cliente aspetta i suoi cento grammi di crudo!', { mood: 'neutral' });
    UI.hideDlg();
    const r = await BQ.mini.play('slice', 'tutorial', { seed: 5, photo: null, title: 'Il primo cliente', saveId: 'story:tutorial', continueLabel: 'Continua' });
    if (r.quit) return;
    if (r.stars < 1) { await say('marco', 'Ahi. Fette troppo irregolari: riprova, il cliente non scappa.', { mood: 'worried' }); return; }
    await say('marco', r.stars >= 3 ? 'Cento grammi precisi! Ma tu sei nato per questo!' : 'Non male! Sei assunto… per oggi almeno.', { mood: 'happy' });
    flag('tutorial', true); S().chapter = Math.max(1, S().chapter); BQ.save.commit();
    await say('giulia', 'Ragazzi, problema! Alla cassa i conti non tornano da stanotte. Garzone, vieni a darmi una mano!', { mood: 'worried' });
    Adv.cinema(false);
    await BQ.sleep(100);
    await say('narr', 'Si è aperta la porta n.1: Casse e registratori. Da qui in poi ogni reparto nasconde un frammento della Lama d\'Oro.');
  }

  async function phone(forceK) {
    let k = forceK;
    if (!k) for (let i = 1; i <= 5; i++) if (flag('call' + i) && !flag('called' + i)) { k = i; break; }
    if (!k) {
      const c = await UI.choose(['Chiama il negozio vero (039650938)', 'Lascia stare'], { who: 'narr', text: 'Il vecchio telefono rosso a disco. Nessuna chiamata in arrivo.' });
      if (c === 0) { BQ.audio.sfx('click'); window.location.href = 'tel:039650938'; }
      return;
    }
    BQ.audio.sfx('ding');
    await say('narr', 'DRIIIN! Il vecchio telefono della bottega squilla.');
    await UI.choose(['Rispondi'], { who: 'tu', text: '' });
    for (const l of CH[k].call) await say(l[0], l[1], { mood: l[2] });
    flag('called' + k, true);
    BQ.audio.sfx('buzz');
  }

  async function talkHub(who) {
    if (flag('ended')) { await say(who, who === 'angelo' ? 'Cinquant\'anni e oltre! Vieni a trovarci davvero: Via Lecco 16, Agrate Brianza. Ti aspettiamo!' : 'Ah, che festa! Quasi quasi affetto un altro crudo.', { mood: 'happy' }); return; }
    const c = S().chapter;
    if (!flag('tutorial')) { await say('angelo', 'Marco ti aspetta, {nome}: un cliente vuole cento grammi di crudo!', { mood: 'happy' }); return; }
    if (c >= 7 && !flag('deduced')) {
      await say('angelo', 'Sei frammenti e sei indizi. Andiamo in archivio a capire chi è stato!', { mood: 'angry' });
      await Adv.goto('archivio'); return;
    }
    if (flag('deduced')) { await say('angelo', 'Il furgone è fuori, {nome}! Corri da Ottavio!', { mood: 'angry', pose: 'point' }); await Adv.goto('strada'); return; }
    await say('angelo', `Il prossimo reparto è il numero ${c}: ${DOORS[c - 1].name}. La porta è aperta!`, { mood: 'happy', pose: 'point' });
  }

  // --- reparti ---
  Object.keys(CH).forEach((kk) => {
    const k = +kk, ch = CH[k], rep = A.REP[ch.rep];
    const xs = [330, 720, 1110];
    SC['rep' + k] = {
      art: ch.rep, back: 'bottega', title: BQ.items.repById[ch.rep].name,
      kicker: () => 'Capitolo ' + k + ' · ' + ch.title,
      chars: () => [{ id: ch.npc, fx: 1350, fy: 720, h: 470, mood: allDone(k) ? 'happy' : 'neutral', pose: 'idle' }],
      spots() {
        const sp = ch.proofs.map((p, i) => ({ x: xs[i] - 160, y: 330, w: 320, h: 340, label: p.label, g: String(i + 1), done: done(k, i), act: () => doProof(k, i) }));
        sp.push({ x: 1230, y: 250, w: 240, h: 420, label: BQ.CHARS[ch.npc].name, g: '…', act: async () => {
          const left = ch.proofs.filter((p, i) => !done(k, i));
          if (!left.length) await say(ch.npc, 'Qui abbiamo finito! Torna in bottega, il prossimo reparto ti aspetta.', { mood: 'happy' });
          else await say(ch.npc, `Ti mancano ancora: ${left.map((p) => p.label).join(', ')}. Tocca gli oggetti sul banco per provare!`, { mood: 'neutral' });
        } });
        return sp;
      },
      async enter() {
        if (!flag('intro' + k)) { flag('intro' + k, true); await ch.intro(); }
        else if (allDone(k) && !flag('ch' + k + '_done')) await runOutro(k);
      },
    };
  });

  // --- archivio: la lavagna degli indizi ---
  SC.archivio = {
    title: 'L\'archivio', back: 'bottega', kicker: () => 'Finale · La lavagna degli indizi',
    chars: () => [{ id: 'angelo', fx: 240, fy: 880, h: 500, mood: 'worried' }, { id: 'fetta', cat: true, fx: 1450, fy: 850, h: 150 }],
    spots() { return [{ x: 420, y: 100, w: 1000, h: 640, label: 'Lavagna degli indizi', g: '?', act: () => deduction() }]; },
    async enter() {
      if (flag('deduced')) return;
      if (!flag('introArch')) { flag('introArch', true); await say('angelo', 'Ecco la lavagna dei misteri. Sei indizi, quattro sospettati. Un\'unica persona può aver fatto tutto questo.', { mood: 'worried' }); await say('angelo', 'Tocca la lavagna, leggi bene gli indizi e dimmi chi è il colpevole.', { mood: 'neutral' }); }
      await deduction();
    },
  };

  const SUSPECTS = [
    { id: 'ottavio', name: 'Ottavio Trucco', char: 'ottavio', text: 'Ex grossista, trench e guanti gialli. Ha un bar, una segheria e vende pesi «Trucco & Figli». Firma sempre O.T.' },
    { id: 'pina', name: 'Zia Pina', char: 'pina', text: 'Golosa di dolci e di pettegolezzi. Non ha mai toccato una bilancia in vita sua.' },
    { id: 'sindaco', name: 'Il Sindaco', char: 'marco', text: 'Ama tagliare i nastri, non il prosciutto. A quell\'ora dormiva.' },
    { id: 'fetta', name: 'Fetta, la gatta', char: null, text: 'Ruba solo la mortadella, ma non sa usare i guanti.' },
  ];
  async function deduction() {
    while (true) {
      const node = BQ.el('div', { style: { textAlign: 'left' } });
      node.append(BQ.el('p', { html: '<b>Gli indizi raccolti:</b>' }));
      const g = BQ.el('div', { class: 'cards', style: { gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', marginBottom: '14px' } });
      for (let i = 1; i <= 6; i++) { const d = BQ.INV['clue' + i]; g.append(BQ.el('div', { class: 'icard', html: `<div style="width:52px;height:52px;float:left;margin-right:8px">${A.sprite(d.spr)}</div><b style="font-size:.95rem">${d.name}</b><span style="font-size:.78rem">${d.desc}</span>` })); }
      node.append(g);
      node.append(BQ.el('p', { html: '<b>Chi è il colpevole?</b>' }));
      const choice = await new Promise((res) => {
        const w = BQ.el('div', { class: 'varlist' });
        SUSPECTS.forEach((s) => w.append(BQ.el('button', { class: 'mgc', style: { width: '100%' }, html: `<div class="ic2" style="background:#DCEEFF">${s.char ? A.char(s.char, { portrait: true }) : A.cat()}</div><div><b>${s.name}</b><small>${s.text}</small></div>`, on: { click: () => { BQ.audio.sfx('click'); res(s.id); } } })));
        node.append(w);
        UI.modal({ title: 'Lavagna degli indizi', node, wide: true, closable: true, closeValue: null }).then((v) => { if (v === null) res(null); });
      });
      UI.hideDlg(); BQ.$('#layer-modal').hidden = true; BQ.$('#layer-modal').innerHTML = '';
      if (choice === null) return;
      if (choice === 'ottavio') break;
      BQ.audio.sfx('bad');
      await say('angelo', choice === 'fetta' ? 'Fetta?! Miao… nessun guanto, nessuna firma. Riguarda gli indizi: quei nomi tornano sempre uguali.' : 'No, no, ricontrolla: O.T., T & F, Bar Trucco, Segheria Trucco, «O. Trucco»… chi ha tutte queste iniziali?', { mood: 'worried' });
    }
    BQ.audio.sfx('fanfare');
    flag('deduced', true);
    await say('angelo', 'Ottavio Trucco! Lo sapevo! Il suo magazzino è vicino al casello dell\'A4. Ha rubato la lama per eliminare l\'unica cosa che taglia sempre giusto.', { mood: 'angry', pose: 'point' });
    await say('fetta', 'MIAO!', { mood: 'surprised' });
    await say('angelo', 'Prendi il furgone! Fetta viene con te. Alla festa manca poco: la lama deve tornare!', { mood: 'angry' });
    await Adv.goto('strada');
  }

  // --- finale: inseguimento, duello, lama ---
  async function chase() {
    await say('tu', 'Andiamo a riprenderci la Lama d\'Oro!', { mood: 'angry' });
    while (true) {
      UI.hideDlg();
      const r = await BQ.mini.play('runner', 'inseguimento', { seed: 77, photo: null, title: 'Inseguimento', saveId: 'story:chase', continueLabel: 'Continua' });
      if (r.quit) return;
      if (r.stars >= 1) break;
      await say('fetta', 'Miao… (Ottavio è ancora lontano. Riprova!)', { mood: 'worried' });
    }
    flag('chased', true);
    Adv.refresh();
    Adv.cinema(true);
    await say('narr', 'Il furgone inchioda davanti al magazzino vicino al casello. Sul piazzale, un trench giallo controluce…');
    await say('ottavio', 'Complimenti, garzone. Hai guidato come un vero fattorino… di quelli bravi. Purtroppo per te sono sceso a salutare.', { mood: 'sly' });
    await say('tu', 'Ridacci la Lama d\'Oro, Ottavio Trucco!', { mood: 'angry' });
    await say('ottavio', 'Una lama che taglia sempre giusto è una minaccia per chi, come me, vive di pesate truccate. Da cinquant\'anni i Brambilla servono tutta la Brianza senza fregature. Io ne ho abbastanza!', { mood: 'angry' });
    await say('tu', 'Allora sfidami. Una fetta giusta vale più di mille pesi truccati: duello di affettatura!');
    await say('ottavio', 'Duello? Ahahah! Ho un\'affettatrice nel bagagliaio. Accetto.', { mood: 'sly' });
    Adv.cinema(false);
    while (true) {
      UI.hideDlg();
      const r = await BQ.mini.play('slice', 'duello', { seed: 99, title: 'Duello con Ottavio', saveId: 'story:duel', continueLabel: 'Continua' });
      if (r.quit) { await say('ottavio', 'Che c\'è, scappi? Ahahah!', { mood: 'sly' }); return; }
      if (r.stars >= 1) break;
      await say('ottavio', 'Ahahah! Troppo lento, garzone. Di nuovo?', { mood: 'sly' });
    }
    await say('ottavio', 'Ma… ma come hai fatto?! I grammi erano giusti! Esattamente giusti!', { mood: 'surprised' });
    await say('tu', 'Il peso giusto esiste, Ottavio. Basta volerlo.', { mood: 'happy' });
    await say('ottavio', 'Va bene, va bene… ecco il manico. E i frammenti li hai già tu, vedo. Ricomponila, se ci riesci.', { mood: 'worried' });
    while (true) {
      UI.hideDlg();
      const r = await BQ.mini.play('assemble', 'lama', { seed: 12, title: 'La Lama d\'Oro', saveId: 'story:blade', continueLabel: 'Continua' });
      if (r.quit) { await say('fetta', 'Miao. (Non lasciarla a metà!)', { mood: 'worried' }); continue; }
      if (r.stars >= 1) break;
    }
    for (let i = 1; i <= 6; i++) BQ.save.take('frag' + i);
    BQ.save.give('blade'); flag('blade', true);
    await UI.reward({ title: 'La Lama d\'Oro è tornata!', name: 'Lama d\'Oro', text: 'Sei frammenti, un solo taglio: la lama è di nuovo intera.', sprite: 'goldblade', button: 'Evviva!' });
    await say('ottavio', 'Forse… forse è ora che metta a posto anche le mie bilance. Dove si fa la verifica periodica?', { mood: 'worried' });
    await say('fetta', 'Miao miao!', { mood: 'happy' });
    await say('tu', 'Dice che al laboratorio certificato ISO 9001 di Agrate Brianza la fanno anche per te: verifica periodica di bilance e registratori telematici, con monitoraggio gratuito della scadenza.', { mood: 'happy' });
    await say('ottavio', 'Il monitoraggio gratuito della scadenza? Ci sto. Affare fatto.', { mood: 'happy' });
    await say('tu', 'E adesso torniamo alla festa!', { mood: 'happy' });
    await epilogue();
  }

  async function epilogue() {
    flag('ended', true);
    await Adv.goto('bottega', { silent: true });
    UI.confetti(80); BQ.audio.sfx('fanfare');
    await UI.banner('Festa dei 50 anni', 'Brindisi di mezzanotte', 3000);
    await say('angelo', 'Cinquant\'anni e oltre… e una lama che taglia sempre giusto. Grazie, {nome}!', { mood: 'happy', pose: 'wave' });
    await say('giulia', 'E i conti tornano! Fino all\'ultimo centesimo!', { mood: 'happy', pose: 'wave' });
    await say('marco', 'Ora tocca a te il taglio di mezzanotte. Con la Lama d\'Oro!', { mood: 'happy' });
    await say('pina', 'E io porto il caffè! Quello giusto, tesoro!', { mood: 'happy' });
    await say('ottavio', 'Per la cronaca: la verifica periodica è fissata per lunedì.', { mood: 'happy' });
    UI.hideDlg();
    const r = await BQ.mini.play('slice', 'festa', { seed: 1, title: 'Il taglio di mezzanotte', saveId: 'story:festa', continueLabel: 'Continua' });
    await credits();
  }

  async function credits() {
    const rk = BQ.rank();
    const html = `<p style="font-size:1.05rem"><b>Hai ritrovato la Lama d'Oro, ${UI.playerName()}!</b></p>
      <p>Grado: <b>${rk.title}</b> · ${rk.stars} stelle</p>
      <p>Questa storia è inventata, ma la bottega è vera: <b>Brambilla Angelo s.r.l.</b>, da oltre 50 anni vendita e assistenza di bilance, affettatrici, registratori di cassa, macchinari e accessori per negozi.</p>
      <p><b>Via Lecco n. 16 — Agrate Brianza (MB)</b><br>Tel. 039650938 · brambilla.srl@virgilio.it</p>
      <p style="font-size:.8rem;opacity:.75">Personaggi di fantasia. Nessuna bilancia è stata truccata durante la realizzazione di questo gioco.</p>`;
    const v = await UI.modal({ title: 'Fine… o quasi!', html, cls: 'reward', closable: true, actions: [
      { label: 'Chiamaci', cls: 'red', value: 'tel' }, { label: 'Info e contatti', cls: 'blue', value: 'info' }, { label: 'Continua a giocare', cls: 'gold', value: 'go' }] });
    if (v === 'tel') window.location.href = 'tel:039650938'; else if (v === 'info') BQ.go('info');
  }

  /* ---------- consigli di Fetta ---------- */
  story.hintText = function () {
    const c = S().chapter;
    if (!flag('prologue')) return 'Tocca il biglietto sulla porta, poi parla con Angelo!';
    if (!flag('tutorial')) return 'Marco ti aspetta dentro: tocca il cliente al banco e affetta 100 grammi di crudo.';
    if (flag('ended')) return 'Hai vinto! Ora puoi sfogliare il catalogo e giocare i minigiochi di tutti i 251 articoli.';
    if (flag('deduced') && !flag('blade')) return 'Il furgone è fuori, in strada: corri da Ottavio!';
    if (c >= 7) return 'Vai dall\'Angelo: in archivio c\'è la lavagna degli indizi.';
    const cur = BQ.adv.cur;
    if (/^rep(\d)$/.test(cur)) { const k = +cur.slice(3); const left = CH[k].proofs.map((p, i) => [p, i]).filter(([p, i]) => !done(k, i)); if (left.length) return `Prova ad affrontare: ${left[0][0].label}. Tocca l'oggetto sul banco!`; return 'Qui hai finito: torna in bottega con la freccia in alto.'; }
    return `Entra nel reparto ${c}: ${DOORS[c - 1].name}. Le porte con il lucchetto si aprono in ordine.`;
  };

  /* ---------- avvio / ripresa ---------- */
  story.newGame = async function () {
    BQ.save.reset(); BQ.audio.sfx('click'); story._pro = false;
    BQ.go('adv', { direct: true }); await Adv.goto('strada');
  };
  story.resume = async function () {
    BQ.go('adv', { direct: true });
    if (!flag('prologue')) { story._pro = false; BQ.save.flag('note', false); S().scene = null; await Adv.goto('strada'); return; }
    let sc = S().scene || 'bottega';
    if (!BQ.scenes[sc]) sc = 'bottega';
    if (sc === 'archivio' && flag('deduced')) sc = 'strada';
    await Adv.goto(sc, { silent: sc === 'strada' && flag('ended') });
  };
  story.hasSave = () => flag('prologue') || flag('note');
})();
