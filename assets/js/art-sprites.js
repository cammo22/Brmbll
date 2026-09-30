/* =========================================================
   BRAMBILLA QUEST — sprite di oggetti (SVG inline, stile "sticker")
   ========================================================= */
(function () {
  'use strict';
  const BQ = window.BQ;
  const O = '#0A1B3F';
  const K = `stroke="${O}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
  const K3 = `stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

  const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <linearGradient id="g-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F8FAFC"/><stop offset=".3" stop-color="#C3CDD9"/><stop offset=".55" stop-color="#F1F5F9"/><stop offset=".8" stop-color="#8E9BAB"/><stop offset="1" stop-color="#C9D2DD"/></linearGradient>
    <linearGradient id="g-steelv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8FAFC"/><stop offset=".5" stop-color="#C3CDD9"/><stop offset="1" stop-color="#8E9BAB"/></linearGradient>
    <linearGradient id="g-red" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF4A58"/><stop offset=".6" stop-color="#E11D2E"/><stop offset="1" stop-color="#A80F1E"/></linearGradient>
    <linearGradient id="g-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6BF"/><stop offset=".35" stop-color="#F2C340"/><stop offset=".65" stop-color="#FFE58A"/><stop offset="1" stop-color="#B88418"/></linearGradient>
    <linearGradient id="g-navy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1F3A7A"/><stop offset="1" stop-color="#0A1B3F"/></linearGradient>
    <linearGradient id="g-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9A566"/><stop offset="1" stop-color="#A9703A"/></linearGradient>
    <linearGradient id="g-ham" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C25A4A"/><stop offset=".6" stop-color="#8E2F2B"/><stop offset="1" stop-color="#6B1D1F"/></linearGradient>
    <radialGradient id="g-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6BF" stop-opacity=".95"/><stop offset="1" stop-color="#FFF6BF" stop-opacity="0"/></radialGradient>
  </defs></svg>`;

  const P = {}; // nome -> function(o) => svg
  const svg = (vb, inner, cls) => `<svg class="spr ${cls || ''}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
  const lcd = (x, y, w, h, t, fs) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#1B2109" ${K3}/><text x="${x + w - 6}" y="${y + h - 6}" text-anchor="end" font-family="JetBrains Mono,monospace" font-weight="700" font-size="${fs || 16}" fill="#D9E82F">${t}</text>`;

  P.register = (o) => svg('0 0 200 200', `
    <ellipse cx="100" cy="184" rx="84" ry="9" fill="${O}" opacity=".2"/>
    <rect x="18" y="138" width="164" height="42" rx="9" fill="url(#g-navy)" ${K}/>
    <rect x="70" y="152" width="60" height="9" rx="4.5" fill="url(#g-steelv)" ${K3}/>
    <path d="M30 138l12-52h116l12 52z" fill="url(#g-steel)" ${K}/>
    <path d="M60 86l-6-40q-2-8 8-8h76q10 0 8 8l-6 40z" fill="url(#g-navy)" ${K}/>
    ${lcd(66, 46, 68, 30, o && o.txt || '12,50', 18)}
    ${[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${52 + c * 26}" y="${96 + r * 12}" width="20" height="9" rx="3" fill="${(r === 2 && c === 3) ? '#E11D2E' : '#fff'}" ${K3}/>`).join('')).join('')}
    <path d="M132 40l12-28q4-6 10 0l10 26z" fill="#fff" ${K3}/><path d="M138 26h22M140 32h20" stroke="#AEBAC8" stroke-width="2"/>`);

  P.scale = (o) => svg('0 0 200 200', `
    <ellipse cx="100" cy="186" rx="86" ry="9" fill="${O}" opacity=".2"/>
    <path d="M14 136l18-28h84l12 28z" fill="url(#g-steel)" ${K}/>
    <rect x="12" y="136" width="124" height="24" rx="6" fill="url(#g-steelv)" ${K}/>
    <rect x="130" y="128" width="58" height="54" rx="10" fill="url(#g-red)" ${K}/>
    <rect x="122" y="40" width="68" height="92" rx="12" fill="url(#g-navy)" ${K}/>
    ${lcd(130, 50, 52, 30, o && o.txt || '0.350', 15)}
    <circle cx="140" cy="100" r="6" fill="#E11D2E" ${K3}/><circle cx="156" cy="100" r="6" fill="#fff" ${K3}/><circle cx="172" cy="100" r="6" fill="#D9E82F" ${K3}/>
    <path d="M122 120h68" stroke="#fff" stroke-opacity=".3" stroke-width="3"/>`);

  P.slicer = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="186" rx="90" ry="9" fill="${O}" opacity=".2"/>
    <path d="M26 176l16-46h124l18 46z" fill="url(#g-red)" ${K}/>
    <rect x="98" y="126" width="84" height="16" rx="6" fill="url(#g-steelv)" ${K}/>
    <path d="M104 126v-44l40 0 18 44z" fill="url(#g-steel)" ${K3}/>
    <circle cx="84" cy="88" r="56" fill="url(#g-steel)" ${K}/>
    <circle cx="84" cy="88" r="46" fill="none" stroke="${O}" stroke-opacity=".22" stroke-width="2"/><circle cx="84" cy="88" r="33" fill="none" stroke="${O}" stroke-opacity=".18" stroke-width="2"/>
    <circle cx="84" cy="88" r="15" fill="url(#g-red)" ${K}/><circle cx="84" cy="88" r="5" fill="${O}"/>
    <path d="M40 60a52 52 0 0 1 36-22" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".8"/>
    <circle cx="44" cy="152" r="9" fill="#fff" ${K3}/><rect x="146" y="98" width="30" height="16" rx="6" fill="url(#g-steelv)" ${K3}/>`);

  P.flywheel = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="186" rx="90" ry="9" fill="${O}" opacity=".2"/>
    <path d="M46 176l14-40h110l14 40z" fill="url(#g-red)" ${K}/>
    <rect x="90" y="124" width="92" height="16" rx="6" fill="url(#g-steelv)" ${K}/>
    <circle cx="116" cy="82" r="50" fill="url(#g-steel)" ${K}/>
    <circle cx="116" cy="82" r="38" fill="none" stroke="${O}" stroke-opacity=".2" stroke-width="2"/>
    <circle cx="116" cy="82" r="11" fill="url(#g-red)" ${K}/>
    <circle cx="44" cy="100" r="40" fill="url(#g-red)" ${K}/>
    <circle cx="44" cy="100" r="31" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3"/>
    ${[0, 60, 120, 180, 240, 300].map((a) => `<ellipse cx="${44 + Math.cos(a * Math.PI / 180) * 20}" cy="${100 + Math.sin(a * Math.PI / 180) * 20}" rx="9" ry="6" transform="rotate(${a} ${44 + Math.cos(a * Math.PI / 180) * 20} ${100 + Math.sin(a * Math.PI / 180) * 20})" fill="#fff" ${K3}/>`).join('')}
    <circle cx="44" cy="100" r="9" fill="url(#g-steel)" ${K3}/><circle cx="64" cy="70" r="6" fill="#0A1B3F"/><path d="M64 70l-12 -2" ${K3}/>`);

  P.ham = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="188" rx="80" ry="8" fill="${O}" opacity=".2"/>
    <rect x="34" y="172" width="132" height="12" rx="5" fill="url(#g-wood)" ${K}/>
    <rect x="80" y="156" width="40" height="18" rx="4" fill="url(#g-wood)" ${K}/>
    <path d="M138 14q10-4 14 4l-2 10q-10 4-16 0z" fill="#3A2418" ${K3}/>
    <path d="M140 28q-2 26 12 48q26 22 20 62q-8 26-48 30q-46-2-68-32q-16-30 0-56q20-26 52-32q18-6 32-20z" fill="url(#g-ham)" ${K}/>
    <path d="M66 68q28-22 60-26M150 84q16 22 14 46" fill="none" stroke="#F4D4C7" stroke-width="9" stroke-linecap="round" opacity=".9"/>
    <ellipse cx="74" cy="128" rx="34" ry="30" fill="#F2A8A0" ${K}/><ellipse cx="74" cy="128" rx="22" ry="19" fill="#E0736F"/><path d="M60 122q14-10 28 2M62 138q12 8 26 0" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/><circle cx="74" cy="130" r="6" fill="#F4F2EC" ${K3}/>`);

  P.grinder = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="186" rx="86" ry="9" fill="${O}" opacity=".2"/>
    <path d="M40 176v-50q0-14 14-14h86q14 0 14 14v50z" fill="url(#g-steel)" ${K}/>
    <path d="M44 62l112 0l-18 52h-76z" fill="url(#g-steelv)" ${K}/>
    <path d="M52 62h96v-12h-96z" fill="url(#g-steel)" ${K}/>
    <path d="M150 128h26q10 0 10 10v12q0 10-10 10h-26z" fill="url(#g-steel)" ${K}/>
    <circle cx="178" cy="144" r="22" fill="#fff" stroke="${O}" stroke-width="4" transform="translate(0 0)" opacity="0"/>
    <circle cx="78" cy="144" r="14" fill="url(#g-red)" ${K}/><circle cx="78" cy="144" r="5" fill="#fff"/>
    <path d="M120 130h16M120 142h16M120 154h16" stroke="${O}" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="100" cy="80" rx="26" ry="10" fill="#C25A4A" ${K3}/><path d="M78 76q22 10 44 0" fill="none" stroke="#F4D4C7" stroke-width="5" stroke-linecap="round"/>`);

  P.bonesaw = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="186" rx="80" ry="9" fill="${O}" opacity=".2"/>
    <rect x="44" y="170" width="112" height="12" rx="5" fill="url(#g-steelv)" ${K}/>
    <rect x="86" y="42" width="28" height="130" rx="8" fill="url(#g-steel)" ${K}/>
    <path d="M60 36q0-18 20-18h40q20 0 20 18v14h-80z" fill="url(#g-red)" ${K}/>
    <rect x="50" y="114" width="100" height="14" rx="4" fill="url(#g-steelv)" ${K}/>
    <path d="M70 60v120" stroke="#fff" stroke-opacity=".7" stroke-width="5" stroke-dasharray="3 5"/>
    <circle cx="130" cy="36" r="6" fill="#fff" ${K3}/>
    <path d="M122 96q10-16 28-6q12 14 -2 24q-18 6 -26 -18z" fill="#F4F2EC" ${K3}/>`);

  P.vacuum = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="188" rx="86" ry="9" fill="${O}" opacity=".2"/>
    <rect x="20" y="104" width="160" height="76" rx="12" fill="url(#g-steel)" ${K}/>
    <path d="M14 106q0-44 86-44t86 44z" fill="url(#g-navy)" ${K}/>
    <path d="M34 98q10-28 40-30" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="5" stroke-linecap="round"/>
    <circle cx="146" cy="142" r="22" fill="#fff" ${K}/><path d="M146 142l12-10" stroke="#E11D2E" stroke-width="5" stroke-linecap="round"/>
    ${[0, 1, 2, 3, 4].map((i) => `<path d="M${128 + i * 9} ${162 - 0}l-2 -4" stroke="${O}" stroke-width="2"/>`).join('')}
    <rect x="34" y="132" width="54" height="10" rx="5" fill="#E11D2E" ${K3}/><rect x="34" y="150" width="30" height="14" rx="5" fill="#D9E82F" ${K3}/>`);

  P.juicer = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="188" rx="76" ry="9" fill="${O}" opacity=".2"/>
    <path d="M40 180v-50q0-20 20-20h80q20 0 20 20v50z" fill="url(#g-red)" ${K}/>
    <path d="M52 110l8-28h80l8 28z" fill="url(#g-steel)" ${K}/>
    <path d="M70 82v-34q0-14 14-14h32q14 0 14 14v34z" fill="url(#g-steelv)" ${K}/>
    <circle cx="100" cy="56" r="17" fill="#6B1D1F" opacity="0"/>
    <circle cx="100" cy="52" r="13" fill="#FF8A1E" ${K3}/><path d="M100 39q4-10 12-8" stroke="#3FA06A" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M150 150h26q10 0 10 14v6q0 12-12 12h-24z" fill="#FFE9B0" ${K}/><path d="M154 158h24" stroke="#FF8A1E" stroke-width="8" stroke-linecap="round"/>
    <circle cx="80" cy="148" r="10" fill="#fff" ${K3}/><circle cx="112" cy="148" r="10" fill="#fff" ${K3}/>`);

  P.pots = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="188" rx="84" ry="9" fill="${O}" opacity=".2"/>
    <path d="M24 180v-42q0-10 10-10h84q10 0 10 10v42z" fill="url(#g-steelv)" ${K}/><path d="M22 146h-14M138 146h14" ${K}/>
    <path d="M34 128v-36q0-10 10-10h64q10 0 10 10v36z" fill="url(#g-steel)" ${K}/><path d="M32 100h-10M122 100h10" ${K}/>
    <path d="M44 82v-30q0-10 10-10h44q10 0 10 10v30z" fill="url(#g-steelv)" ${K}/>
    <path d="M70 42q0-12 12-12t12 12z" fill="url(#g-steel)" ${K3}/><circle cx="82" cy="28" r="5" fill="#E11D2E" ${K3}/>
    <path d="M150 180v-70q0-8 8-8h20q8 0 8 8v70z" fill="url(#g-steel)" ${K}/><path d="M150 120h36" stroke="${O}" stroke-width="4"/>
    <path d="M40 160q30 6 60 0" stroke="#fff" stroke-opacity=".7" stroke-width="5" fill="none" stroke-linecap="round"/>`);

  P.knives = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="188" rx="74" ry="9" fill="${O}" opacity=".2"/>
    <path d="M38 180v-64l62-16l62 16v64z" fill="url(#g-wood)" ${K}/><path d="M38 116l62 -16l62 16" fill="none" stroke="#FFE2B0" stroke-width="3" opacity=".7"/>
    <g transform="rotate(-14 66 100)"><rect x="56" y="36" width="20" height="62" rx="6" fill="#0A1B3F" ${K3}/><circle cx="66" cy="50" r="3" fill="#fff"/><circle cx="66" cy="68" r="3" fill="#fff"/></g>
    <rect x="90" y="22" width="22" height="80" rx="6" fill="#E11D2E" ${K3}/><circle cx="101" cy="40" r="3" fill="#fff"/><circle cx="101" cy="60" r="3" fill="#fff"/>
    <g transform="rotate(14 136 100)"><rect x="126" y="36" width="20" height="62" rx="6" fill="#0A1B3F" ${K3}/><circle cx="136" cy="50" r="3" fill="#fff"/><circle cx="136" cy="68" r="3" fill="#fff"/></g>
    <path d="M60 136h80M60 156h80" stroke="${O}" stroke-opacity=".22" stroke-width="3"/>`);

  P.van = () => svg('0 0 320 200', `
    <ellipse cx="160" cy="184" rx="138" ry="10" fill="${O}" opacity=".22"/>
    <path d="M20 162v-82q0-16 16-16h146q10 0 16 10l40 42q10 10 10 22v24z" fill="#fff" ${K}/>
    <path d="M192 76l40 40h-40z" fill="#9BD1F5" ${K3}/><path d="M198 84l26 26h-26z" fill="#fff" opacity=".4"/>
    <rect x="20" y="126" width="282" height="16" fill="url(#g-red)" ${K3}/>
    <circle cx="96" cy="100" r="30" fill="#E11D2E" ${K}/><circle cx="96" cy="100" r="24" fill="none" stroke="#fff" stroke-width="3"/>
    <text x="96" y="112" text-anchor="middle" font-family="Anton,Impact" font-size="34" fill="#fff">AB</text>
    <text x="132" y="96" font-family="Anton,Impact" font-size="15" fill="${O}">BRAMBILLA</text><text x="132" y="110" font-family="Archivo,sans-serif" font-weight="800" font-size="8" fill="#E11D2E">CONSEGNE A DOMICILIO</text>
    <path d="M300 146h12v12h-12z" fill="#FFD83A" ${K3}/>
    ${[78, 246].map((x) => `<circle cx="${x}" cy="164" r="22" fill="${O}" ${K}/><circle cx="${x}" cy="164" r="10" fill="url(#g-steel)" ${K3}/>`).join('')}`);

  P.goldblade = (o) => svg('0 0 200 200', `
    <circle cx="100" cy="100" r="96" fill="url(#g-glow)"/>
    <circle cx="100" cy="100" r="74" fill="url(#g-gold)" ${K}/>
    <circle cx="100" cy="100" r="62" fill="none" stroke="#9A6B12" stroke-opacity=".45" stroke-width="2.5"/><circle cx="100" cy="100" r="48" fill="none" stroke="#9A6B12" stroke-opacity=".35" stroke-width="2.5"/>
    <path d="M40 72a64 64 0 0 1 48-34" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".85"/>
    <circle cx="100" cy="100" r="22" fill="url(#g-red)" ${K}/><circle cx="100" cy="100" r="7" fill="${O}"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => { const a = (i * 60 - 90) * Math.PI / 180; return `<circle cx="${100 + Math.cos(a) * 34}" cy="${100 + Math.sin(a) * 34}" r="3.2" fill="${O}" opacity=".6"/>`; }).join('')}
    ${o && o.cracks ? '<path d="M100 26l-8 30l14 20l-14 24l12 20l-6 30" fill="none" stroke="#0A1B3F" stroke-width="4" stroke-linejoin="round"/>' : ''}`);

  // frammento: settore della lama (i = 0..5)
  P.fragment = (o) => {
    const i = (o && o.i) || 0, a0 = (i * 60 - 90) * Math.PI / 180, a1 = ((i + 1) * 60 - 90) * Math.PI / 180;
    const x0 = 100 + Math.cos(a0) * 78, y0 = 100 + Math.sin(a0) * 78, x1 = 100 + Math.cos(a1) * 78, y1 = 100 + Math.sin(a1) * 78;
    return svg('0 0 200 200', `<g transform="translate(${-Math.cos((a0 + a1) / 2) * 8} ${-Math.sin((a0 + a1) / 2) * 8}) rotate(${(o && o.rot) || 0} 100 100)"><path d="M100 100L${x0} ${y0}A78 78 0 0 1 ${x1} ${y1}z" fill="url(#g-gold)" ${K}/><path d="M${100 + Math.cos((a0 + a1) / 2) * 50} ${100 + Math.sin((a0 + a1) / 2) * 50}l6 -6" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`);
  };

  P.phone = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="184" rx="70" ry="8" fill="${O}" opacity=".2"/>
    <path d="M30 176v-30q0-18 18-22h104q18 4 18 22v30z" fill="url(#g-red)" ${K}/>
    <circle cx="100" cy="146" r="30" fill="#fff" ${K}/><circle cx="100" cy="146" r="9" fill="${O}"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i * 34 - 60) * Math.PI / 180; return `<circle cx="${100 + Math.cos(a) * 21}" cy="${146 + Math.sin(a) * 21}" r="4.4" fill="#E11D2E" ${K3.replace('3', '2')}/>`; }).join('')}
    <path d="M28 104q0-22 30-22h84q30 0 30 22q0 14-22 12l-16-6h-68l-16 6q-22 2-22-12z" fill="url(#g-navy)" ${K}/>`);

  P.crate = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="186" rx="80" ry="8" fill="${O}" opacity=".2"/>
    <path d="M24 176v-70h152v70z" fill="url(#g-wood)" ${K}/><path d="M24 126h152M24 150h152" stroke="${O}" stroke-width="4"/>
    <circle cx="62" cy="96" r="22" fill="#E11D2E" ${K}/><path d="M62 76q4-12 14-10" stroke="#3FA06A" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="104" cy="92" r="22" fill="#FF8A1E" ${K}/><circle cx="144" cy="98" r="20" fill="#F2D84A" ${K}/>`);

  P.box = () => svg('0 0 200 200', `
    <ellipse cx="100" cy="184" rx="70" ry="8" fill="${O}" opacity=".2"/>
    <path d="M30 172v-84l70-26l70 26v84l-70 18z" fill="#D9A566" ${K}/><path d="M30 88l70 24l70-24M100 112v78" fill="none" ${K}/>
    <path d="M78 70l22 8l22-8v24l-22 8l-22-8z" fill="#fff" ${K3}/><path d="M86 86h28" stroke="#E11D2E" stroke-width="4"/>`);

  // icone inventario (viewBox 100)
  const I = (inner) => svg('0 0 100 100', inner, 'ico');
  P.i_apron = () => I(`<path d="M30 14h40l-6 16h-28z" fill="#fff" ${K3}/><path d="M28 30h44l8 60h-60z" fill="#E11D2E" ${K}/><circle cx="50" cy="56" r="10" fill="#fff" ${K3}/><text x="50" y="61" text-anchor="middle" font-family="Anton" font-size="12" fill="#E11D2E">AB</text>`);
  P.i_book = () => I(`<path d="M14 18h34q6 0 6 6v58q0-6-6-6h-34z M86 18h-34q-6 0-6 6v58q0-6 6-6h34z" fill="#F4F2EC" ${K}/><path d="M22 32h22M22 42h22M22 52h22M62 32h16M62 42h16" stroke="#E11D2E" stroke-width="3" stroke-linecap="round"/>`);
  P.i_receipt = () => I(`<path d="M26 10h48v74l-8-6l-8 6l-8-6l-8 6l-8-6l-8 6z" fill="#fff" ${K}/><path d="M34 26h32M34 38h32M34 50h20" stroke="${O}" stroke-width="3" stroke-linecap="round"/><path d="M62 80l12 10" stroke="#E11D2E" stroke-width="5"/><text x="60" y="66" font-family="JetBrains Mono" font-weight="700" font-size="13" fill="#E11D2E">O.T.</text>`);
  P.i_weight = () => I(`<path d="M36 28h28l22 54q2 8-6 8h-60q-8 0-6-8z" fill="url(#g-steelv)" ${K}/><circle cx="50" cy="24" r="9" fill="none" ${K}/><text x="50" y="76" text-anchor="middle" font-family="Anton" font-size="18" fill="${O}">1Kg</text><path d="M30 86h40" stroke="#6B1D1F" stroke-width="3"/>`);
  P.i_glove = () => I(`<path d="M34 90q-10-30-2-46l6-2q2 8 6 10l-2-34q2-6 8-4l4 28l2-32q2-6 8-4l2 34l6-26q4-6 8-2l-4 38l8-12q6-4 8 2q-2 14-14 34q-6 22-14 18z" fill="#FFD83A" ${K}/>`);
  P.i_napkin = () => I(`<path d="M14 24l60-10l12 56l-60 16z" fill="#fff" ${K}/><circle cx="46" cy="50" r="12" fill="#7B4A2A" opacity=".75"/><circle cx="60" cy="58" r="6" fill="#7B4A2A" opacity=".6"/><path d="M26 30l40-7" stroke="#E11D2E" stroke-width="3"/>`);
  P.i_bone = () => I(`<g transform="rotate(-35 50 50)"><rect x="20" y="42" width="60" height="16" rx="6" fill="#F4F2EC" ${K}/>${[[20,42],[20,58],[80,42],[80,58]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="10" fill="#F4F2EC" ${K}/>`).join('')}<rect x="22" y="43" width="56" height="14" fill="#F4F2EC"/></g>`);
  P.i_key = () => I(`<circle cx="30" cy="36" r="18" fill="url(#g-gold)" ${K}/><circle cx="30" cy="36" r="6" fill="${O}"/><path d="M44 48l40 40M70 74l10-10M60 84l10-10" fill="none" stroke="#C99A2A" stroke-width="10" stroke-linecap="round"/><path d="M44 48l40 40M70 74l10-10M60 84l10-10" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round" opacity=".35"/>`);
  P.i_pass = () => I(`<rect x="16" y="26" width="68" height="48" rx="8" fill="#fff" ${K}/><rect x="16" y="26" width="68" height="14" fill="#215FD6" ${K}/><circle cx="36" cy="56" r="8" fill="#F5CFA8" ${K3}/><path d="M50 52h26M50 62h20" stroke="${O}" stroke-width="3"/>`);
  P.i_star = () => I(`<path d="M50 8l13 28l30 4l-22 21l6 30l-27-15l-27 15l6-30l-22-21l30-4z" fill="url(#g-gold)" ${K}/>`);
  P.i_lock = () => I(`<path d="M30 46v-14q0-20 20-20t20 20v14" fill="none" stroke="${O}" stroke-width="8" stroke-linecap="round"/><rect x="22" y="44" width="56" height="44" rx="9" fill="url(#g-gold)" ${K}/><circle cx="50" cy="62" r="6" fill="${O}"/><path d="M50 62v14" stroke="${O}" stroke-width="5" stroke-linecap="round"/>`);
  P.i_cat = () => I(`<path d="M20 34l8-22l18 12h8l18-12l8 22q10 26-8 40q-14 10-36 0q-18-14-8-40z" fill="#F29A3C" ${K}/><circle cx="38" cy="46" r="4" fill="${O}"/><circle cx="62" cy="46" r="4" fill="${O}"/><path d="M46 58q4 4 8 0" stroke="${O}" stroke-width="3" fill="none"/>`);
  P.i_coin = () => I(`<circle cx="50" cy="50" r="38" fill="url(#g-gold)" ${K}/><circle cx="50" cy="50" r="28" fill="none" stroke="#9A6B12" stroke-width="3"/><text x="50" y="62" text-anchor="middle" font-family="Anton" font-size="34" fill="#9A6B12">€</text>`);
  P.i_fragment = (o) => P.fragment(o);

  P.sparkle = () => svg('0 0 40 40', `<path d="M20 2q2 16 18 18q-16 2 -18 18q-2 -16 -18 -18q16 -2 18 -18z" fill="#FFF6BF" stroke="#E7B93A" stroke-width="2"/>`);

  /* icone UI (24x24, currentColor) */
  const UI = {
    play: 'M8 5v14l11-7z', pause: 'M7 5h4v14H7zm6 0h4v14h-4z', book: 'M4 5q4-2 8 1q4-3 8-1v14q-4-2-8 1q-4-3-8-1z', game: 'M7 9h2v2h2v2H9v2H7v-2H5v-2h2zm9 1a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4m3 3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4M6 6h12a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-1.5l-2-2h-5l-2 2H6a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4z',
    info: 'M11 10h2v7h-2zm0-3h2v2h-2zM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', map: 'M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5',
    sound: 'M3 10v4h4l5 4V6L7 10zm13.5 2a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z', mute: 'M3 10v4h4l5 4V6L7 10zm12.6 .4L17 11.8l1.4-1.4 1.4 1.4-1.4 1.4 1.4 1.4-1.4 1.4-1.4-1.4L15.6 15l-1.4-1.4 1.4-1.4z',
    music: 'M9 18V6l10-2v12a3 3 0 1 1-2-2.8V7.5L11 8.6V18a3 3 0 1 1-2-2.8z', close: 'M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4l5.6 5.6L5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6z',
    back: 'M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z', next: 'm13.2 5-1.4 1.4L16.4 11H4v2h12.4l-4.6 4.6L13.2 19l7-7z', phone: 'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.6a1 1 0 0 1-.25 1z',
    mail: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 4-8 5-8-5V6l8 5 8-5z', download: 'M12 16 7 11l1.4-1.4 2.6 2.6V4h2v8.2l2.6-2.6L17 11zM5 18h14v2H5z', star: 'M12 2l3 6.6 7.2.7-5.4 4.8 1.6 7.1L12 17.4 5.6 21.2l1.6-7.1L1.8 9.3 9 8.6z',
    bag: 'M6 7V6a6 6 0 0 1 12 0v1h3l-1 14H4L3 7zm2 0h8V6a4 4 0 0 0-8 0z', fs: 'M5 5h5v2H7v3H5zm9 0h5v5h-2V7h-3zM5 14h2v3h3v2H5zm12 0h2v5h-5v-2h3z', cat: 'M4 3l4 3h8l4-3v9a8 8 0 0 1-16 0zm5 8a1.3 1.3 0 1 0 0 .01zm6 0a1.3 1.3 0 1 0 0 .01z', zoom: 'M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12m0-2a8 8 0 1 0 4.9 14.3l4.9 4.9 1.4-1.4-4.9-4.9A8 8 0 0 0 10 2',
    search: 'M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12m0-2a8 8 0 1 0 4.9 14.3l4.9 4.9 1.4-1.4-4.9-4.9A8 8 0 0 0 10 2', lock: 'M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9zm-8 0V7a3 3 0 0 1 6 0v2z', check: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z', home: 'M12 3 2 12h3v8h5v-6h4v6h5v-8h3z', cart: 'M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4m10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4M1 2v2h2l3.6 7.6L5.2 14A2 2 0 0 0 7 17h12v-2H7.4l1-2h7.5a2 2 0 0 0 1.8-1l3.6-6.5A1 1 0 0 0 20.4 4H5.2l-.9-2z',
  };
  const ico = (n, cls) => `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="${UI[n] || ''}" fill="currentColor"/></svg>`;

  function sprite(name, o) { const f = P[name]; return f ? f(o || {}) : ''; }
  BQ.art = BQ.art || {};
  Object.assign(BQ.art, { sprite, ico, DEFS, K, K3, lcd, svg });
  BQ.art.installDefs = function () { if (!document.getElementById('g-steel')) document.body.insertAdjacentHTML('afterbegin', DEFS); };
  BQ.art.spriteNames = Object.keys(P);
})();
