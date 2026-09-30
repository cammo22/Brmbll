/* =========================================================
   BRAMBILLA QUEST — personaggi SVG parametrici
   viewBox 300x520 · ritratto = ritaglio testa+spalle
   ========================================================= */
(function () {
  'use strict';
  const BQ = window.BQ;
  const O = '#0A1B3F';
  const SW = 'stroke="' + O + '" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';

  const SKIN = ['#F5CFA8', '#EBB88E', '#D49B72', '#9A6440', '#6E4229'];
  const HAIRC = { black: '#1E1A1F', brown: '#5A3A22', chestnut: '#7B4A2A', blond: '#E7BE5A', white: '#ECEEF2', grey: '#A9AEB8', red: '#B5462B' };

  const CH = {
    angelo: { name: 'Angelo', skin: 0, hair: 'white', style: 'bald', beard: 'mustache', beardC: 'white', glasses: true, shirt: '#F4F2EC', apron: '#E11D2E', pants: '#2A3A63', hat: 'none', build: 1.05, brow: 'white' },
    giulia: { name: 'Giulia', skin: 1, hair: 'black', style: 'bun', beard: 'none', glasses: false, shirt: '#215FD6', apron: null, pants: '#0A1B3F', hat: 'none', lanyard: true, lip: '#E11D2E' },
    marco: { name: 'Marco', skin: 2, hair: 'brown', style: 'short', beard: 'stubble', glasses: false, shirt: '#F4F2EC', apron: '#F4F2EC', stripes: true, pants: '#2A3A63', hat: 'paper', build: 1.12 },
    pina: { name: 'Pina', skin: 0, hair: 'blond', style: 'curly', beard: 'none', glasses: false, shirt: '#FF3B4A', apron: '#F4F2EC', pants: '#0A1B3F', hat: 'bandana', lip: '#E11D2E', earrings: true },
    ottavio: { name: 'Ottavio Trucco', skin: 1, hair: 'black', style: 'slick', beard: 'pencil', beardC: 'black', glasses: 'shades', shirt: '#E7C23A', apron: null, coat: '#C79A1F', pants: '#3B3342', hat: 'fedora', gloves: '#FFD83A', build: 1.0, brow: 'black' },
    p0: { name: 'Tu', skin: 1, hair: 'brown', style: 'short', beard: 'none', glasses: false, shirt: '#F4F2EC', apron: '#E11D2E', pants: '#2A3A63', hat: 'cap', capC: '#E11D2E' },
    p1: { name: 'Tu', skin: 3, hair: 'black', style: 'pony', beard: 'none', glasses: false, shirt: '#F4F2EC', apron: '#E11D2E', pants: '#2A3A63', hat: 'cap', capC: '#215FD6' },
    p2: { name: 'Tu', skin: 0, hair: 'red', style: 'curly', beard: 'none', glasses: false, shirt: '#F4F2EC', apron: '#E11D2E', pants: '#2A3A63', hat: 'bandana', bandC: '#E7C23A' },
  };
  BQ.CHARS = CH;

  function hairBack(c, hc) {
    switch (c.style) {
      case 'bun': return `<circle cx="150" cy="40" r="26" fill="${hc}" ${SW}/>`;
      case 'pony': return `<path d="M210 95q48 18 34 92q-12 24-30 16q10-40-10-72z" fill="${hc}" ${SW}/>`;
      case 'curly': return [60, 100, 150, 200, 240].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 60 : 95}" r="${i % 2 ? 34 : 30}" fill="${hc}" ${SW}/>`).join('');
      default: return '';
    }
  }
  function hairFront(c, hc) {
    switch (c.style) {
      case 'bald': return `<path d="M86 100q-6-34 6-48l-4 50z M214 100q6-34-6-48l4 50z" fill="${hc}" ${SW}/>`;
      case 'short': return `<path d="M84 108q-10-70 66-72q76 2 66 72q-8-30-30-38q-34 16-72 2q-22 10-30 36z" fill="${hc}" ${SW}/>`;
      case 'slick': return `<path d="M84 104q-8-64 66-68q74 4 66 68q-14-34-40-42q-40 10-80 6q-8 12-12 36z" fill="${hc}" ${SW}/><path d="M112 66q30-10 62 2" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>`;
      case 'bun': return `<path d="M84 110q-12-72 66-74q78 2 66 74q-6-34-30-44q-40 14-74 0q-22 12-28 44z" fill="${hc}" ${SW}/>`;
      case 'pony': return `<path d="M84 110q-12-72 66-74q78 2 66 74q-6-34-30-44q-40 14-74 0q-22 12-28 44z" fill="${hc}" ${SW}/>`;
      case 'curly': return `<path d="M86 104q10-40 64-40q56 0 64 40q-20-18-64-16q-44-2-64 16z" fill="${hc}" ${SW}/>`;
      default: return '';
    }
  }
  function hat(c) {
    switch (c.hat) {
      case 'paper': return `<path d="M88 78q-6-52 62-56q68 4 62 56z" fill="#fff" ${SW}/><path d="M88 78q62 12 124 0" fill="none" ${SW}/><path d="M112 40q8 10 6 30M150 30q2 14 0 40M188 40q-8 10-6 30" fill="none" stroke="${O}" stroke-opacity=".18" stroke-width="3"/>`;
      case 'cap': return `<path d="M84 92q-2-56 66-58q68 2 66 58z" fill="${c.capC || '#E11D2E'}" ${SW}/><path d="M204 88q44 4 54 22q-30 6-60-2z" fill="${c.capC || '#E11D2E'}" ${SW}/><circle cx="150" cy="40" r="6" fill="#fff" ${SW}/>`;
      case 'bandana': return `<path d="M84 98q-6-50 66-52q72 2 66 52q-30-16-66-16t-66 16z" fill="${c.bandC || '#E11D2E'}" ${SW}/><circle cx="120" cy="78" r="4" fill="#fff"/><circle cx="150" cy="70" r="4" fill="#fff"/><circle cx="180" cy="78" r="4" fill="#fff"/><path d="M212 96l26 -14l-4 30z" fill="${c.bandC || '#E11D2E'}" ${SW}/>`;
      case 'fedora': return `<ellipse cx="150" cy="82" rx="104" ry="20" fill="#3B3342" ${SW}/><path d="M96 82q-10-58 54-60q64 2 54 60z" fill="#4A4052" ${SW}/><path d="M97 70q53 14 106 0v12q-53 14-106 0z" fill="#E11D2E" ${SW}/>`;
      default: return '';
    }
  }
  function mustache(c) {
    const bc = HAIRC[c.beardC || c.hair] || HAIRC.brown;
    switch (c.beard) {
      case 'mustache': return `<path d="M150 148q-14-14-46-6q-10 6 2 16q22 6 44-6q22 12 44 6q12-10 2-16q-32-8-46 6z" fill="${bc}" ${SW}/>`;
      case 'pencil': return `<path d="M112 152q38-14 76 0q-38-4-76 0z" fill="${bc}" ${SW}/>`;
      case 'stubble': return `<path d="M96 138q2 52 54 58q52-6 54-58q-10 30-54 32q-44-2-54-32z" fill="${bc}" fill-opacity=".38"/>`;
      default: return '';
    }
  }
  function brows(mood, col) {
    const p = {
      neutral: ['M104 94l32-3', 'M164 91l32 3'],
      happy: ['M104 90q16-10 32-3', 'M164 87q16-7 32 3'],
      worried: ['M104 98l32-12', 'M164 86l32 12'],
      angry: ['M104 86l32 10', 'M164 96l32-10'],
      surprised: ['M104 82q16-10 32-2', 'M164 80q16-8 32 2'],
      sly: ['M104 94l32-5', 'M164 84l32 12'],
    }[mood] || ['M104 94l32-3', 'M164 91l32 3'];
    return p.map((d) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round"/>`).join('');
  }
  function eyes(mood, glasses) {
    if (glasses === 'shades')
      return `<g class="eyes"><path d="M96 104h46q4 0 4 6v10q-2 14-24 14q-24 0-28-14z M154 110q0-6 4-6h46l-2 26q-4 8-28 8q-20 0-20-14z" fill="#16161D" ${SW}/><path d="M146 108h8" ${SW}/><path d="M104 110l14 -2M162 110l14 -2" stroke="#fff" stroke-opacity=".5" stroke-width="3"/></g>`;
    const big = mood === 'surprised' ? 1.2 : 1;
    const lid = mood === 'sly' ? `<path d="M104 108h32M164 108h32" stroke="${O}" stroke-width="6" stroke-linecap="round"/>` : '';
    const eye = (cx) => `<g class="eye"><ellipse cx="${cx}" cy="122" rx="${13 * big}" ry="${(mood === 'sly' ? 9 : 15) * big}" fill="#fff" ${SW.replace('5', '4')}/><circle cx="${cx + 1}" cy="${mood === 'sly' ? 124 : 123}" r="${7 * big}" fill="${O}"/><circle cx="${cx + 4}" cy="119" r="2.6" fill="#fff"/></g>`;
    return `<g class="eyes">${eye(120)}${eye(180)}${lid}</g>`;
  }
  function glasses() {
    return `<g fill="rgba(200,230,255,.25)" ${SW.replace('5', '4')}><circle cx="120" cy="122" r="22"/><circle cx="180" cy="122" r="22"/><path d="M142 120h16"/></g>`;
  }
  function mouth(mood, lip) {
    const lc = lip || '#8A3A36';
    const closed = {
      neutral: `<path d="M134 168q16 10 32 0" fill="none" stroke="${O}" stroke-width="5" stroke-linecap="round"/>`,
      happy: `<path d="M126 164q24 28 48 0z" fill="#fff" ${SW.replace('5', '4')}/>`,
      worried: `<path d="M134 174q16-12 32 0" fill="none" stroke="${O}" stroke-width="5" stroke-linecap="round"/>`,
      angry: `<path d="M132 176q18-14 36 0" fill="none" stroke="${O}" stroke-width="6" stroke-linecap="round"/>`,
      surprised: `<ellipse cx="150" cy="172" rx="11" ry="14" fill="#5A1420" ${SW.replace('5', '4')}/>`,
      sly: `<path d="M130 168q22 8 44-8" fill="none" stroke="${O}" stroke-width="5" stroke-linecap="round"/>`,
    }[mood] || '';
    const open = `<g><ellipse cx="150" cy="170" rx="17" ry="13" fill="#5A1420" ${SW.replace('5', '4')}/><ellipse cx="150" cy="177" rx="10" ry="5" fill="#E8626F"/></g>`;
    return `<g class="m-closed">${closed}</g><g class="m-open" display="none">${open}</g>`;
  }

  function body(c, pose) {
    const sk = SKIN[c.skin];
    const b = c.build || 1;
    const sh = c.shirt, ap = c.apron, pants = c.pants;
    const sleeveC = c.coat || sh;
    const armL = `<path d="M${92 - (b - 1) * 50} 238q-38 40-30 118" fill="none" stroke="${O}" stroke-width="40" stroke-linecap="round"/><path d="M${92 - (b - 1) * 50} 238q-38 40-30 118" fill="none" stroke="${sleeveC}" stroke-width="30" stroke-linecap="round"/><circle cx="${62 - (b - 1) * 50}" cy="362" r="18" fill="${c.gloves || sk}" ${SW}/>`;
    let armR;
    if (pose === 'wave')
      armR = `<g class="wave"><path d="M208 238q56 -10 62 -90" fill="none" stroke="${O}" stroke-width="40" stroke-linecap="round"/><path d="M208 238q56 -10 62 -90" fill="none" stroke="${sleeveC}" stroke-width="30" stroke-linecap="round"/><circle cx="270" cy="136" r="19" fill="${c.gloves || sk}" ${SW}/></g>`;
    else if (pose === 'point')
      armR = `<path d="M208 238q60 10 78 -20" fill="none" stroke="${O}" stroke-width="40" stroke-linecap="round"/><path d="M208 238q60 10 78 -20" fill="none" stroke="${sleeveC}" stroke-width="30" stroke-linecap="round"/><circle cx="290" cy="214" r="18" fill="${c.gloves || sk}" ${SW}/>`;
    else if (pose === 'think')
      armR = `<path d="M208 238q30 50 -18 76" fill="none" stroke="${O}" stroke-width="40" stroke-linecap="round"/><path d="M208 238q30 50 -18 76" fill="none" stroke="${sleeveC}" stroke-width="30" stroke-linecap="round"/><circle cx="176" cy="196" r="17" fill="${c.gloves || sk}" ${SW}/>`;
    else
      armR = `<path d="M${208 + (b - 1) * 50} 238q38 40 30 118" fill="none" stroke="${O}" stroke-width="40" stroke-linecap="round"/><path d="M${208 + (b - 1) * 50} 238q38 40 30 118" fill="none" stroke="${sleeveC}" stroke-width="30" stroke-linecap="round"/><circle cx="${238 + (b - 1) * 50}" cy="362" r="18" fill="${c.gloves || sk}" ${SW}/>`;
    const w = 66 * b;
    const torso = `<path d="M${150 - w - 2} 222q-2 94 2 188h${2 * w}q4 -94 2 -188q-${w} -24 ${-(2 * w)} 0z" fill="${c.coat || sh}" ${SW}/>`;
    let ap_ = '';
    if (ap) {
      ap_ = `<path d="M${150 - w * 0.68} 246h${w * 1.36}l6 168h-${w * 1.36 + 12}z" fill="${ap}" ${SW}/>` +
        `<path d="M${150 - w * 0.68} 246l12 -34M${150 + w * 0.68} 246l-12 -34" fill="none" stroke="${O}" stroke-width="5" stroke-linecap="round"/>` +
        (c.stripes ? [0, 1, 2, 3, 4, 5].map((i) => `<path d="M${150 - w * 0.68 + 6 + i * w * 0.27} 250l${-i * 0.4} 158" stroke="#E11D2E" stroke-width="6" opacity=".9"/>`).join('') : '') +
        `<rect x="${150 - 26}" y="318" width="52" height="34" rx="6" fill="rgba(10,27,63,.10)" ${SW.replace('5', '3')}/>` +
        (!c.stripes ? `<circle cx="${150}" cy="280" r="15" fill="#fff" ${SW.replace('5', '3')}/><text x="150" y="286" text-anchor="middle" font-family="Anton,Impact" font-size="17" fill="#E11D2E">AB</text>` : '');
    } else if (c.coat) {
      ap_ = `<path d="M${150 - 26} 214l26 70l26 -70z" fill="${sh}" ${SW}/><path d="M${150 - 14} 214l14 30l14 -30z" fill="#fff" ${SW.replace('5', '3')}/><path d="M150 244l-9 44l9 10l9 -10z" fill="#B0183A" ${SW.replace('5', '3')}/><path d="M150 214v196" stroke="${O}" stroke-width="4"/><path d="M${150 - w - 2} 222l24 -14l14 12z M${150 + w + 2} 222l-24 -14l-14 12z" fill="${c.coat}" ${SW}/>` + [300, 340, 378].map((y) => `<circle cx="${140}" cy="${y}" r="4" fill="${O}"/>`).join('');
    } else {
      ap_ = `<path d="M${150 - 22} 214q22 26 44 0" fill="none" stroke="${O}" stroke-width="5"/>` + (c.lanyard ? `<path d="M124 214l26 90l26 -90" fill="none" stroke="#E11D2E" stroke-width="6"/><rect x="138" y="300" width="24" height="32" rx="4" fill="#fff" ${SW.replace('5', '3')}/><circle cx="150" cy="312" r="5" fill="#215FD6"/>` : '') + `<circle cx="${150 + 40}" cy="264" r="11" fill="#fff" ${SW.replace('5', '3')}/><text x="${190}" y="269" text-anchor="middle" font-family="Anton,Impact" font-size="12" fill="#E11D2E">AB</text>`;
    }
    const legs = `<path d="M122 408h26v82h-26z M152 408h26v82h-26z" fill="${pants}" ${SW}/><path d="M${c.coat ? 110 : 116} 486h36v20h-44q-2-14 8-20z M152 486h36q10 6 8 20h-44z" fill="#2B2230" ${SW}/>`;
    const neck = `<rect x="130" y="186" width="40" height="34" fill="${sk}" ${SW}/>`;
    return { back: armL + legs + torso + neck, front: ap_ + armR };
  }

  /** SVG completo di un personaggio. o: {mood, pose, talk, flip, portrait, cls} */
  function char(id, o) {
    o = o || {};
    const c = CH[id] || CH.p0;
    const sk = SKIN[c.skin], hc = HAIRC[c.hair] || HAIRC.brown;
    const mood = o.mood || 'neutral';
    const bd = body(c, o.pose || 'idle');
    const face = `
      <circle cx="86" cy="128" r="15" fill="${sk}" ${SW}/><circle cx="214" cy="128" r="15" fill="${sk}" ${SW}/>
      ${c.earrings ? '<circle cx="84" cy="150" r="6" fill="#E7C23A" stroke="' + O + '" stroke-width="3"/><circle cx="216" cy="150" r="6" fill="#E7C23A" stroke="' + O + '" stroke-width="3"/>' : ''}
      ${hairBack(c, hc)}
      <ellipse cx="150" cy="120" rx="66" ry="72" fill="${sk}" ${SW}/>
      <ellipse cx="108" cy="150" rx="15" ry="9" fill="#E8626F" opacity=".3"/><ellipse cx="192" cy="150" rx="15" ry="9" fill="#E8626F" opacity=".3"/>
      ${hairFront(c, hc)}
      ${brows(mood, HAIRC[c.brow || c.hair] || O)}
      ${eyes(mood, c.glasses)}
      ${c.glasses === true ? glasses() : ''}
      <path d="M144 136q6 12 12 0" fill="none" stroke="${O}" stroke-opacity=".55" stroke-width="4" stroke-linecap="round"/>
      ${c.lip ? `<path d="M132 166q18 12 36 0q-18 -6 -36 0z" fill="${c.lip}" opacity=".55"/>` : ''}
      ${mouth(mood, c.lip)}
      ${mustache(c)}
      ${hat(c)}`;
    const vb = o.portrait ? '46 14 208 240' : '0 0 300 520';
    return `<svg class="char ${o.talk ? 'talk' : ''} ${o.cls || ''}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${c.name}" ${o.flip ? 'style="transform:scaleX(-1)"' : ''}>
      ${o.portrait ? '' : '<ellipse cx="150" cy="506" rx="92" ry="11" fill="#0A1B3F" opacity=".22"/>'}
      <g class="c-rig">${bd.back}${bd.front}<g class="c-head">${face}</g></g></svg>`;
  }

  /** Cliente generico (per i minigiochi): seed -> faccia casuale */
  function customer(seed, o) {
    const r = BQ.rng(seed * 7919 + 13);
    const c = {
      name: 'Cliente', skin: r.int(0, 4), hair: r.pick(['black', 'brown', 'chestnut', 'blond', 'grey', 'white', 'red']),
      style: r.pick(['short', 'bun', 'curly', 'pony', 'slick', 'bald']), beard: r.pick(['none', 'none', 'stubble', 'mustache']),
      beardC: r.pick(['brown', 'black', 'grey']), glasses: r.pick([false, false, true]), shirt: r.pick(['#8EC5FF', '#FFB3B8', '#B9E2A5', '#FFD98A', '#C9B8FF', '#F4F2EC']),
      apron: null, pants: '#2A3A63', hat: r.pick(['none', 'none', 'none', 'cap', 'bandana']), capC: r.pick(['#215FD6', '#E7C23A', '#3FA06A']), bandC: r.pick(['#E11D2E', '#215FD6']),
      lip: r.pick([null, '#E11D2E']), lanyard: false,
    };
    if (c.style === 'bald' && c.beard === 'none') c.beard = 'stubble';
    CH['cust' + seed] = c;
    return char('cust' + seed, Object.assign({ portrait: true }, o));
  }

  /* ---------- Fetta, il gatto di bottega ---------- */
  function cat(o) {
    o = o || {};
    const mood = o.mood || 'neutral';
    const eyeC = mood === 'happy' ? `<path d="M96 96q10-12 20 0M144 96q10-12 20 0" fill="none" stroke="${O}" stroke-width="5" stroke-linecap="round"/>` :
      `<g class="eyes"><ellipse cx="106" cy="98" rx="10" ry="${mood === 'surprised' ? 14 : 12}" fill="#CFE86A" ${SW.replace('5', '3.5')}/><ellipse cx="154" cy="98" rx="10" ry="${mood === 'surprised' ? 14 : 12}" fill="#CFE86A" ${SW.replace('5', '3.5')}/><ellipse cx="106" cy="98" rx="3.5" ry="9" fill="${O}"/><ellipse cx="154" cy="98" rx="3.5" ry="9" fill="${O}"/></g>`;
    return `<svg class="char cat ${o.cls || ''}" viewBox="0 0 260 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fetta, il gatto">
      <ellipse cx="130" cy="228" rx="84" ry="9" fill="#0A1B3F" opacity=".2"/>
      <path class="tail" d="M196 190q60 4 52-56q-2-16-14-10q8 34-38 44z" fill="#F29A3C" ${SW}/>
      <path d="M62 224q-14-70 20-96q48-22 96 0q34 26 20 96z" fill="#F29A3C" ${SW}/>
      <path d="M86 226q-4-44 12-62q30 18 64 0q16 18 12 62z" fill="#FFF3DD" ${SW.replace('5', '3.5')}/>
      <path d="M94 228v-16M110 228v-12M150 228v-12M166 228v-16" stroke="${O}" stroke-width="4" stroke-linecap="round"/>
      <path d="M62 62l12 -40l34 26z M198 62l-12 -40l-34 26z" fill="#F29A3C" ${SW}/><path d="M72 52l6 -16l14 10z M188 52l-6 -16l-14 10z" fill="#FFB3B8"/>
      <ellipse cx="130" cy="100" rx="74" ry="62" fill="#F29A3C" ${SW}/>
      <path d="M130 40q-10 20 0 34q10 -14 0 -34z M90 50q-2 16 10 24q2 -14 -10 -24z M170 50q2 16 -10 24q-2 -14 10 -24z" fill="#C46A1A" opacity=".7"/>
      <ellipse cx="130" cy="124" rx="36" ry="26" fill="#FFF3DD" ${SW.replace('5', '3.5')}/>
      ${eyeC}
      <path d="M122 112q8 8 16 0z" fill="#E8626F" ${SW.replace('5', '3')}/>
      <path d="M130 118v8q-8 8 -16 2M130 126q8 8 16 2" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M60 116h-34M62 126l-32 10M200 116h34M198 126l32 10" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
      <rect x="92" y="150" width="76" height="14" rx="7" fill="#E11D2E" ${SW.replace('5', '3.5')}/><circle cx="130" cy="170" r="9" fill="#E7C23A" ${SW.replace('5', '3.5')}/>
    </svg>`;
  }

  BQ.art = BQ.art || {};
  Object.assign(BQ.art, { char, customer, cat, O, SW, SKIN, HAIRC });
})();
