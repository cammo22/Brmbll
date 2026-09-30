/* =========================================================
   BRAMBILLA QUEST — sfondi delle scene (SVG 1600x900)
   ogni scena = { back, front }: il personaggio sta in mezzo
   ========================================================= */
(function () {
  'use strict';
  const BQ = window.BQ, A = BQ.art;
  const O = '#0A1B3F';
  const K = `stroke="${O}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
  const place = (name, cx, bottom, w, o) => {
    const h = w; // sprite quadrati 200x200
    return `<g transform="translate(${cx - w / 2} ${bottom - h * 0.93})"><g transform="scale(${w / 200})">${A.sprite(name, o).replace('<svg class="spr " viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">', '').replace(/<\/svg>$/, '')}</g></g>`;
  };
  // sprite non quadrati (furgone 320x200)
  const placeVB = (name, x, y, w, vbw, vbh, o) => `<g transform="translate(${x} ${y}) scale(${w / vbw})">${A.sprite(name, o).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>`;

  function shelf(x, y, w, seed, rows) {
    const r = BQ.rng(seed);
    let out = '';
    const cols = ['#E11D2E', '#215FD6', '#F4F2EC', '#E7C23A', '#3FA06A', '#FF8A1E', '#9AA7B6'];
    for (let k = 0; k < (rows || 1); k++) {
      const yy = y + k * 96;
      let cx = x + 12;
      while (cx < x + w - 50) {
        const bw = 26 + r() * 30, bh = 34 + r() * 40;
        const col = r.pick(cols);
        out += `<rect x="${cx}" y="${yy - bh}" width="${bw}" height="${bh}" rx="6" fill="${col}" ${K}/><rect x="${cx + 4}" y="${yy - bh + 10}" width="${bw - 8}" height="10" rx="3" fill="#fff" opacity=".55"/>`;
        cx += bw + 10 + r() * 10;
      }
      out += `<rect x="${x}" y="${yy}" width="${w}" height="14" rx="4" fill="url(#g-wood)" ${K}/>`;
    }
    return out;
  }
  function lamp(x, len) {
    return `<path d="M${x} 0V${len}" stroke="${O}" stroke-width="4"/><circle cx="${x}" cy="${len + 40}" r="110" fill="url(#g-glow)" opacity=".75"/><path d="M${x - 44} ${len + 40}q0-44 44-44t44 44z" fill="url(#g-red)" ${K}/><circle cx="${x}" cy="${len + 44}" r="9" fill="#FFF6BF" ${K}/>`;
  }
  function windowSvg(x, y, w, h) {
    return `<rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 16}" rx="10" fill="#F4F2EC" ${K}/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="url(#sky-day)"/>
      <circle cx="${x + w * 0.72}" cy="${y + h * 0.3}" r="${w * 0.12}" fill="#FFF6BF"/><path d="M${x} ${y + h}q${w * 0.2}-${h * 0.3} ${w * 0.4}-${h * 0.12}t${w * 0.6}-${h * 0.2}v${h * 0.32}z" fill="#7FBF8A"/>
      <path d="M${x + w / 2} ${y}v${h}M${x} ${y + h / 2}h${w}" stroke="#F4F2EC" stroke-width="8"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="none" ${K}/><path d="M${x + 12} ${y + 10}l${w * 0.22} 0l-${w * 0.1} ${h * 0.3}z" fill="#fff" opacity=".35"/>`;
  }

  const SKY = `<linearGradient id="sky-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FC2F5"/><stop offset="1" stop-color="#DCEEFF"/></linearGradient>
    <linearGradient id="sky-dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E8FE0"/><stop offset=".55" stop-color="#F7B58E"/><stop offset="1" stop-color="#FFE0A8"/></linearGradient>
    <linearGradient id="sky-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B2E7A"/><stop offset=".6" stop-color="#E5637A"/><stop offset="1" stop-color="#FFB25E"/></linearGradient>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1B3F" stop-opacity="0"/><stop offset="1" stop-color="#0A1B3F" stop-opacity=".38"/></linearGradient>
    <pattern id="tile" width="64" height="40" patternUnits="userSpaceOnUse"><rect width="64" height="40" fill="#fff"/><path d="M0 .5H64M0 20.5H64M32 20V40M0 0V20" stroke="#0A1B3F" stroke-opacity=".16" stroke-width="2" fill="none"/></pattern>`;

  A.DEFS = A.DEFS.replace('</defs></svg>', SKY + `<linearGradient id="road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A6577"/><stop offset="1" stop-color="#39424F"/></linearGradient>
    <pattern id="cork" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#C99B62"/><circle cx="8" cy="10" r="3" fill="#A97A45"/><circle cx="26" cy="26" r="4" fill="#B98A52"/><circle cx="34" cy="8" r="2" fill="#A97A45"/></pattern></defs></svg>`);

  /** interno generico */
  function room(id, t) {
    const fa = t.floorA || '#F4F2EC', fb = t.floorB || '#D0D7E2';
    const back = `<defs>
      <linearGradient id="wall-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.wall2 || t.wall}"/><stop offset="1" stop-color="${t.wall}"/></linearGradient>
      <pattern id="fl-${id}" width="160" height="80" patternUnits="userSpaceOnUse"><rect width="160" height="80" fill="${fa}"/><rect width="80" height="40" fill="${fb}"/><rect x="80" y="40" width="80" height="40" fill="${fb}"/></pattern></defs>
      <rect width="1600" height="900" fill="url(#wall-${id})"/>
      <rect y="0" width="1600" height="40" fill="${t.trim || '#0A1B3F'}"/><path d="M0 40h1600" stroke="#fff" stroke-opacity=".3" stroke-width="4"/>
      <rect y="470" width="1600" height="190" fill="url(#tile)"/><rect y="462" width="1600" height="14" fill="${t.accent || '#E11D2E'}" ${K}/>
      <path d="M0 660h1600V900H0z" fill="url(#fl-${id})"/><rect y="660" width="1600" height="240" fill="url(#shade)"/>
      <rect y="648" width="1600" height="16" fill="${t.trim || '#0A1B3F'}" ${K}/>
      ${t.extra ? t.extra : ''}${t.nolamp ? '' : lamp(200, 70) + lamp(1400, 70)}`;
    return back;
  }
  /** banco frontale */
  function counter(x, w, top) {
    return `<g><rect x="${x}" y="${top + 26}" width="${w}" height="${900 - top - 26}" fill="url(#g-navy)" ${K}/>
      <rect x="${x}" y="${top + 26}" width="${w}" height="16" fill="#E11D2E" ${K}/>
      <path d="M${x + 30} ${top + 70}h${w - 60}" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>
      <circle cx="${x + w / 2}" cy="${top + 120}" r="38" fill="#E11D2E" ${K}/><circle cx="${x + w / 2}" cy="${top + 120}" r="30" fill="none" stroke="#fff" stroke-width="3"/><text x="${x + w / 2}" y="${top + 136}" text-anchor="middle" font-family="Anton,Impact" font-size="42" fill="#fff">AB</text>
      <rect x="${x - 14}" y="${top}" width="${w + 28}" height="30" rx="8" fill="url(#g-steelv)" ${K}/></g>`;
  }
  const sign = (x, y, w, txt, col) => `<g><rect x="${x}" y="${y}" width="${w}" height="64" rx="10" fill="${col || '#0A1B3F'}" ${K}/><text x="${x + w / 2}" y="${y + 45}" text-anchor="middle" font-family="Anton,Impact" font-size="34" letter-spacing="2" fill="#fff">${txt}</text></g>`;
  const poster = (x, y, w, h, inner, col) => `<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="6" fill="${col || '#fff'}" ${K}/>${inner}</g>`;
  const sticker = (spr, x, y, w, o) => `<g transform="rotate(${o || 0} ${x + w / 2} ${y + w / 2})">${placeVB(spr, x, y, w, 200, 200)}</g>`;

  /* ------------------------------------------------------------ */
  const S = {};

  // ---- strada (esterno) ----
  S.strada = (o) => {
    const night = o && o.mood === 'dusk';
    const sky = night ? 'sky-dusk' : 'sky-dawn';
    const back = `<rect width="1600" height="900" fill="url(#${sky})"/>
      <circle cx="${night ? 1320 : 260}" cy="${night ? 330 : 300}" r="240" fill="url(#g-glow)" opacity=".8"/><circle cx="${night ? 1320 : 260}" cy="${night ? 330 : 300}" r="62" fill="#FFF6BF"/>
      <g fill="#fff" opacity=".85"><ellipse cx="520" cy="130" rx="110" ry="30"/><ellipse cx="590" cy="110" rx="70" ry="28"/><ellipse cx="1180" cy="190" rx="130" ry="30"/><ellipse cx="1250" cy="168" rx="80" ry="26"/></g>
      <path d="M0 470q160-90 330-40t320-30q180-70 330 10t320-20q180-60 300 30v200H0z" fill="#8FB8C9"/><path d="M0 520q200-70 380-20t340-20q220-50 400 10t480-40v190H0z" fill="#6FA58A"/>
      <g><rect x="1180" y="440" width="420" height="36" fill="#9AA7B6" ${K}/><rect x="1240" y="476" width="30" height="110" fill="#9AA7B6" ${K}/><rect x="1500" y="476" width="30" height="110" fill="#9AA7B6" ${K}/>
        <rect x="1290" y="392" width="170" height="48" rx="6" fill="#1F7A4D" ${K}/><text x="1375" y="424" text-anchor="middle" font-family="Archivo,sans-serif" font-weight="800" font-size="20" fill="#fff">A4 · AGRATE</text></g>
      <path d="M0 780q0-10 12-10h1576q12 0 12 10v120H0z" fill="url(#road)"/><path d="M0 700h1600v80H0z" fill="#C9C2B4" ${K}/><path d="M0 700h1600" stroke="#fff" stroke-width="6" opacity=".6"/>
      <g stroke="#FFE7A3" stroke-width="10" stroke-dasharray="70 60" opacity=".9"><path d="M0 850h1600"/></g>
      <g><rect x="250" y="190" width="1100" height="520" fill="#F4E7D0" ${K}/>
        <rect x="250" y="600" width="1100" height="110" fill="#B5462B" ${K}/><path d="M250 600h1100" stroke="#fff" stroke-opacity=".4" stroke-width="3"/>
        ${Array.from({ length: 10 }, (_, i) => `<path d="M${250 + i * 110} 600v110" stroke="#0A1B3F" stroke-opacity=".25" stroke-width="3"/>`).join('')}
        <rect x="250" y="172" width="1100" height="34" fill="#0A1B3F" ${K}/>
        <rect x="350" y="214" width="900" height="110" rx="14" fill="url(#g-navy)" ${K}/>
        <circle cx="440" cy="269" r="44" fill="#E11D2E" ${K}/><circle cx="440" cy="269" r="36" fill="none" stroke="#fff" stroke-width="4"/><text x="440" y="287" text-anchor="middle" font-family="Anton,Impact" font-size="52" fill="#fff">AB</text>
        <text x="520" y="272" font-family="Anton,Impact" font-size="60" letter-spacing="3" fill="#fff">BRAMBILLA ANGELO</text><text x="522" y="308" font-family="Archivo,sans-serif" font-weight="800" font-size="24" letter-spacing="6" fill="#FF8A93">S.R.L. · VENDITA E ASSISTENZA</text>
        <path d="M240 342h1120v58q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0q-28 26-56 0z" fill="#fff" ${K}/>
        ${Array.from({ length: 10 }, (_, i) => `<path d="M${240 + i * 112} 342h56v${58 + 0}q-28 26-56 0z" fill="#E11D2E" ${K}/>`).join('')}
        <rect x="290" y="420" width="560" height="250" rx="10" fill="#BFE0F5" ${K}/><rect x="290" y="420" width="560" height="250" rx="10" fill="url(#sky-day)" opacity=".5"/>
        <path d="M290 600h560" stroke="${O}" stroke-width="4"/><rect x="290" y="590" width="560" height="14" fill="url(#g-wood)" ${K}/>
        ${placeVB('scale', 316, 470, 150, 200, 200)}${placeVB('slicer', 480, 454, 180, 200, 200)}${placeVB('register', 664, 470, 150, 200, 200)}
        <path d="M300 430l80 -6M300 640l60 -40" stroke="#fff" stroke-width="10" opacity=".3" stroke-linecap="round"/>
        <rect x="920" y="420" width="190" height="290" rx="10" fill="#8A4B2A" ${K}/><rect x="936" y="436" width="158" height="200" rx="6" fill="#BFE0F5" ${K}/><path d="M936 560l158 -80" stroke="#fff" stroke-width="10" opacity=".4"/>
        <circle cx="1084" cy="590" r="9" fill="#F2C340" ${K}/><g transform="rotate(-6 1010 530)"><rect x="978" y="490" width="66" height="84" fill="#fff" ${K.replace('4','3')}/><path d="M988 508h46M988 522h40M988 536h46" stroke="#AEBAC8" stroke-width="3"/><text x="1011" y="566" text-anchor="middle" font-family="Anton,Impact" font-size="20" fill="#E11D2E">O.T.</text><circle cx="1011" cy="490" r="5" fill="#E11D2E" ${K.replace('4','2')}/></g><rect x="948" y="650" width="134" height="40" rx="4" fill="#6E3B1E" ${K}/>
        <rect x="960" y="448" width="110" height="30" rx="6" fill="#E11D2E" ${K}/><text x="1015" y="470" text-anchor="middle" font-family="Anton,Impact" font-size="22" fill="#fff">APERTO</text>
        <rect x="1150" y="430" width="160" height="240" rx="10" fill="#0A1B3F" ${K}/><text x="1230" y="500" text-anchor="middle" font-family="Anton,Impact" font-size="36" fill="#FFF6BF">OGGI</text><text x="1230" y="548" text-anchor="middle" font-family="Anton,Impact" font-size="54" fill="#fff">FESTA</text><text x="1230" y="590" text-anchor="middle" font-family="Anton,Impact" font-size="30" fill="#E11D2E">50 ANNI!</text>
        <path d="M1160 660h140" stroke="#E11D2E" stroke-width="8"/>
        <text x="900" y="700" font-family="Anton" font-size="0"></text></g>
      <g><path d="M60 720v-200" stroke="#6B4A2A" stroke-width="22" stroke-linecap="round"/><circle cx="60" cy="470" r="90" fill="#4E9A5C" ${K}/><circle cx="10" cy="520" r="60" fill="#5FB06C" ${K}/><circle cx="110" cy="520" r="60" fill="#3F8850" ${K}/></g>
      <g><rect x="1563" y="380" width="14" height="330" fill="#3B4252" ${K}/><path d="M1570 386q0-40-50-40" fill="none" stroke="#3B4252" stroke-width="12"/><ellipse cx="1516" cy="350" rx="36" ry="14" fill="#FFF6BF" ${K}/></g>
      <rect y="0" width="1600" height="900" fill="${night ? '#E5637A' : '#FFD9A0'}" opacity="${night ? 0.12 : 0.12}"/>`;
    const front = `<g>${placeVB('van', 1120, 628, 420, 320, 200)}</g>`;
    return { back, front };
  };

  // ---- bottega (hub) ----
  S.bottega = (o) => {
    const party = o && o.party;
    const doors = [
      { x: 80, t: 'CASSE', c: '#215FD6', i: 'register' }, { x: 330, t: 'BILANCE', c: '#3FA06A', i: 'scale' }, { x: 580, t: 'AFFETTATRICI', c: '#E11D2E', i: 'slicer' },
      { x: 830, t: 'BAR', c: '#FF8A1E', i: 'juicer' }, { x: 1080, t: 'SUPER', c: '#1D8F8A', i: 'grinder' }, { x: 1330, t: 'ACCESSORI', c: '#7A5CD0', i: 'knives' },
    ];
    const extra = doors.map((d, i) => `<g><path d="M${d.x} 560V250q0-80 100-80t100 80v310z" fill="${d.c}" ${K}/><path d="M${d.x + 18} 560V262q0-60 82-60t82 60v298z" fill="#0A1B3F" opacity=".92"/>
        <path d="M${d.x + 18} 560V262q0-60 82-60t82 60v298z" fill="url(#g-glow)" opacity=".5"/>
        ${sign(d.x - 4, 110, 208, d.t, d.c).replace('font-size="34"', 'font-size="' + (d.t.length > 8 ? 26 : 32) + '"')}
        <g transform="translate(${d.x + 36} 300) scale(.64)">${A.sprite(d.i).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>
        <circle cx="${d.x + 100}" cy="196" r="16" fill="#FFF6BF" ${K}/><text x="${d.x + 100}" y="203" text-anchor="middle" font-family="Anton" font-size="20" fill="#0A1B3F">${i + 1}</text></g>`).join('');
    const bunting = party ? `<path d="M0 60q400 90 800 40t800 50" fill="none" stroke="${O}" stroke-width="3"/>` + Array.from({ length: 22 }, (_, i) => { const x = 40 + i * 72; const y = 60 + Math.sin(i / 3.5) * 50 + 40; return `<path d="M${x} ${y}l30 0l-15 38z" fill="${['#E11D2E', '#fff', '#215FD6', '#F2C340'][i % 4]}" ${K.replace('4', '3')}/>`; }).join('') : '';
    const back = room('hub', { wall: '#F4E7D0', wall2: '#FBF3E3', accent: '#E11D2E', extra, nolamp: true }) + bunting +
      '';
    const front = counter(60, 1480, 690) + `<g>${placeVB('register', 1290, 560, 190, 200, 200)}${placeVB('phone', 200, 590, 150, 200, 200)}${placeVB('scale', 850, 570, 170, 200, 200)}</g>`;
    return { back, front };
  };

  // ---- reparti ----
  const REP = {
    registratori: { wall: '#CFE0F5', wall2: '#E6F0FC', accent: '#215FD6', items: ['register', 'register', 'register'], title: 'CASSE & REGISTRATORI', deco: 'i_receipt' },
    bilance: { wall: '#D9EFDD', wall2: '#EEF9F0', accent: '#3FA06A', items: ['scale', 'scale', 'scale'], title: 'BILANCE', deco: 'i_weight' },
    affettatrici: { wall: '#F6D5D5', wall2: '#FDEAEA', accent: '#E11D2E', items: ['ham', 'flywheel', 'slicer'], title: 'AFFETTATRICI', deco: 'i_star' },
    bar: { wall: '#FBE2C4', wall2: '#FFF1DE', accent: '#FF8A1E', items: ['juicer', 'pots', 'crate'], title: 'BAR & RISTORAZIONE', deco: 'i_coin' },
    supermercati: { wall: '#CFE9E5', wall2: '#E7F6F3', accent: '#1D8F8A', items: ['grinder', 'bonesaw', 'vacuum'], title: 'SUPERMERCATI & ALIMENTARI', deco: 'i_bone' },
    accessori: { wall: '#E2DAF5', wall2: '#F1ECFC', accent: '#7A5CD0', items: ['knives', 'pots', 'box'], title: 'ACCESSORI VARI', deco: 'i_key' },
  };
  Object.keys(REP).forEach((k) => {
    const r = REP[k];
    S[k] = () => {
      const extra = shelf(70, 330, 360, BQ.hash(k), 2) + shelf(1170, 330, 360, BQ.hash(k) + 7, 2) +
        windowSvg(640, 150, 320, 240) + sign(480, 70, 640, r.title, r.accent) +
        poster(1010, 140, 110, 150, `<g transform="translate(14 22) scale(.82)">${A.sprite(r.deco).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g><rect x="14" y="116" width="82" height="8" rx="3" fill="${r.accent}"/>`) +
        poster(470, 140, 110, 150, `<g transform="translate(14 22) scale(.82)">${A.sprite('i_star').replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g><rect x="14" y="116" width="82" height="8" rx="3" fill="${r.accent}"/>`);
      const back = room('r-' + k, { wall: r.wall, wall2: r.wall2, accent: r.accent, extra });
      const xs = [330, 720, 1110];
      const front = counter(90, 1420, 690) + `<g>${r.items.map((it, i) => place(it, xs[i], 672, 330, { txt: ['12,50', '7,80', '3,20'][i] })).join('')}</g>`;
      return { back, front };
    };
  });

  // ---- archivio/lavagna (sfondo scuro per gli indizi) ----
  S.archivio = () => {
    const back = `<rect width="1600" height="900" fill="#1C2A4F"/><rect x="120" y="70" width="1360" height="700" rx="18" fill="url(#cork)" ${K}/><rect x="110" y="60" width="1380" height="720" rx="22" fill="none" stroke="#6B4A2A" stroke-width="22"/>
      ${lamp(800, 10)}<rect y="800" width="1600" height="100" fill="#0A1B3F"/>`;
    return { back, front: '' };
  };

  S.vuota = () => ({ back: `<rect width="1600" height="900" fill="#0A1B3F"/>`, front: '' });

  A.scene = function (id, o) { const f = S[id]; return f ? f(o || {}) : S.vuota(); };
  A.REP = REP;
})();
