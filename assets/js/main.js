/* =========================================================
   BRAMBILLA ANGELO s.r.l. — interazioni
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------------------------------------------------
     1. INTRO — la pagina viene tagliata a metà
     --------------------------------------------------- */
  var intro = $('#intro');
  if (intro) {
    if (reduce || sessionStorage.getItem('ba-intro') === '1') {
      intro.classList.add('gone');
    } else {
      document.documentElement.style.overflow = 'hidden';
      setTimeout(function () { intro.classList.add('done'); }, 780);
      setTimeout(function () {
        intro.classList.add('gone');
        document.documentElement.style.overflow = '';
        sessionStorage.setItem('ba-intro', '1');
        startHero();
      }, 1750);
    }
    if (intro.classList.contains('gone')) { setTimeout(startHero, 60); }
  } else {
    setTimeout(startHero, 60);
  }

  /* ---------------------------------------------------
     2. TITOLO AFFETTATO
     --------------------------------------------------- */
  function buildSliced(el) {
    var txt = el.getAttribute('data-text') || el.textContent;
    var n = parseInt(el.getAttribute('data-slices') || '7', 10);
    el.textContent = '';
    var ghost = document.createElement('span');
    ghost.className = 'ghost';
    ghost.textContent = txt;
    el.appendChild(ghost);
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = 'slice';
      s.textContent = txt;
      s.setAttribute('aria-hidden', 'true');
      var top = (i * 100 / n).toFixed(4);
      var bot = ((n - 1 - i) * 100 / n).toFixed(4);
      s.style.clipPath = 'inset(' + top + '% 0 ' + bot + '% 0)';
      s.style.webkitClipPath = 'inset(' + top + '% 0 ' + bot + '% 0)';
      var dir = (i % 2) ? 1 : -1;
      s.style.setProperty('--x', (dir * (34 + i * 8)) + 'px');
      s.style.setProperty('--hx', (dir * (5 + i * 2.5)) + 'px');
      s.style.transitionDelay = (i * 0.055) + 's';
      el.appendChild(s);
    }
  }

  var slicedEls = $$('.sliced');
  slicedEls.forEach(function (el) {
    if (!el.getAttribute('data-text')) el.setAttribute('data-text', el.textContent.trim());
    if (!reduce) buildSliced(el);
  });

  function startHero() {
    if (reduce) return;
    slicedEls.forEach(function (el) {
      $$('.slice', el).forEach(function (s) { s.classList.add('go'); });
    });
  }

  /* ---------------------------------------------------
     3. HEADER, menu mobile, scrollspy
     --------------------------------------------------- */
  var header = $('.site-header');
  var burger = $('.burger');
  var nav = $('#nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.classList.remove('open');
      });
    });
  }

  var navLinks = nav ? $$('a[href^="#"]', nav) : [];
  var sections = navLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------------------------------
     4. REVEAL "a taglio"
     --------------------------------------------------- */
  var toReveal = $$('.rv');

  function revealVisible() {
    if (!toReveal.length) return;
    var rest = [];
    for (var i = 0; i < toReveal.length; i++) {
      var el = toReveal[i];
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) el.classList.add('in');
      else rest.push(el);
    }
    toReveal = rest;
  }

  function revealAll() {
    toReveal.forEach(function (el) { el.classList.add('in'); });
    toReveal = [];
  }

  if (reduce || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var ioSeen = false;
    var rvObs = new IntersectionObserver(function (entries, obs) {
      ioSeen = true;
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
          var k = toReveal.indexOf(e.target);
          if (k > -1) toReveal.splice(k, 1);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    toReveal.forEach(function (el) { rvObs.observe(el); });

    /* reti di sicurezza: se l'observer non consegna nulla il contenuto
       deve comparire lo stesso, prima a scorrimento e poi in blocco */
    setTimeout(function () { if (!ioSeen) revealVisible(); }, 2500);
    setTimeout(function () { if (!ioSeen) revealAll(); }, 8000);
  }

  /* ---------------------------------------------------
     5. FOTO A SCHERMO INTERO (lightbox)
     --------------------------------------------------- */
  var gruppi = {};

  function aggiungi(nome, src, cap) {
    if (!nome || !src) return -1;
    if (!gruppi[nome]) gruppi[nome] = [];
    gruppi[nome].push({ src: src, cap: cap || '' });
    return gruppi[nome].length - 1;
  }

  /* gallerie prodotto */
  $$('.gal[data-gal]').forEach(function (g) {
    var nome = g.getAttribute('data-gal');
    var th = $$('.gal-thumbs button', g);
    if (th.length) {
      th.forEach(function (b) { aggiungi(nome, b.getAttribute('data-src'), b.getAttribute('data-cap')); });
    } else {
      var im = $('.gal-img', g);
      if (im) aggiungi(nome, im.getAttribute('src'), im.getAttribute('alt'));
    }
  });

  /* foto del negozio */
  $$('.about-shots[data-gal]').forEach(function (c) {
    var nome = c.getAttribute('data-gal');
    $$('figure', c).forEach(function (f, i) {
      var im = $('img', f);
      if (!im) return;
      aggiungi(nome, im.getAttribute('src'), im.getAttribute('alt'));
      f.addEventListener('click', function () { apri(nome, i); });
    });
  });

  /* voci cliccabili di "chi siamo" */
  $$('.about-tags .tag[data-gal]').forEach(function (b) {
    var nome = b.getAttribute('data-gal');
    var i = aggiungi(nome, b.getAttribute('data-src'), b.getAttribute('data-cap'));
    b.addEventListener('click', function () { apri(nome, i); });
  });

  /* vetrina offerte */
  $$('.off-grid[data-gal]').forEach(function (c) {
    var nome = c.getAttribute('data-gal');
    $$('.off', c).forEach(function (off, i) {
      var im = $('img', off);
      var fc = $('figcaption', off);
      if (!im) return;
      aggiungi(nome, im.getAttribute('src'), fc ? fc.textContent.trim() : im.getAttribute('alt'));
      var ph = $('.ph', off) || off;
      ph.addEventListener('click', function () { apri(nome, i); });
    });
  });

  /* consegne */
  $$('.deliv-media[data-gal]').forEach(function (c) {
    var nome = c.getAttribute('data-gal');
    var im = $('img', c);
    if (!im) return;
    aggiungi(nome, im.getAttribute('src'), im.getAttribute('alt'));
    c.addEventListener('click', function () { apri(nome, 0); });
  });

  /* servizi */
  var servMedia = $('.serv-media[data-gal]');
  if (servMedia) {
    var nomeServ = servMedia.getAttribute('data-gal');
    $$('.serv-foto', servMedia).forEach(function (f) {
      var im = $('img', f);
      var fc = $('figcaption', f);
      if (!im) return;
      var testo = fc ? fc.textContent.replace(/^\s*\d+\s*/, '').trim() : im.getAttribute('alt');
      aggiungi(nomeServ, im.getAttribute('src'), testo);
    });
    servMedia.addEventListener('click', function () {
      var on = $('.serv-foto.on', servMedia);
      apri(nomeServ, on ? parseInt(on.getAttribute('data-i'), 10) : 0);
    });
  }

  var lb = $('#lightbox');
  var lbImg = $('#lbImg');
  var lbCap = $('#lbCap');
  var lbCount = $('#lbCount');
  var lbGruppo = null, lbIdx = 0, lbUltimoFocus = null;

  function mostra(i) {
    var lista = gruppi[lbGruppo];
    if (!lista || !lista.length) return;
    lbIdx = (i + lista.length) % lista.length;
    var it = lista[lbIdx];
    lb.classList.add('swap');
    var tmp = new Image();
    tmp.onload = tmp.onerror = function () {
      lbImg.src = it.src;
      lbImg.alt = it.cap;
      lbCap.textContent = it.cap;
      lbCount.textContent = (lbIdx + 1) + ' / ' + lista.length;
      lb.classList.remove('swap');
      [lbIdx + 1, lbIdx - 1].forEach(function (k) {
        var v = lista[(k + lista.length) % lista.length];
        if (v) { var p = new Image(); p.src = v.src; }
      });
    };
    tmp.src = it.src;
  }

  function apri(nome, i) {
    if (!lb || !gruppi[nome] || !gruppi[nome].length) return;
    lbGruppo = nome;
    lbUltimoFocus = document.activeElement;
    lb.hidden = false;
    lb.classList.toggle('solo', gruppi[nome].length < 2);
    document.body.classList.add('lb-aperto');
    mostra(i || 0);
    requestAnimationFrame(function () { lb.classList.add('open'); });
    var c = $('.lb-close', lb);
    if (c) c.focus();
  }

  function chiudi() {
    if (!lb || lb.hidden) return;
    lb.classList.remove('open');
    document.body.classList.remove('lb-aperto');
    setTimeout(function () { lb.hidden = true; }, 260);
    if (lbUltimoFocus && lbUltimoFocus.focus) lbUltimoFocus.focus();
  }

  if (lb) {
    $('.lb-close', lb).addEventListener('click', chiudi);
    $('.lb-bg', lb).addEventListener('click', chiudi);
    $('.lb-prev', lb).addEventListener('click', function () { mostra(lbIdx - 1); });
    $('.lb-next', lb).addEventListener('click', function () { mostra(lbIdx + 1); });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') chiudi();
      else if (e.key === 'ArrowRight') mostra(lbIdx + 1);
      else if (e.key === 'ArrowLeft') mostra(lbIdx - 1);
    });

    var tx = 0;
    lb.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var d = e.changedTouches[0].clientX - tx;
      if (Math.abs(d) > 55) mostra(lbIdx + (d < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ---------------------------------------------------
     6. GALLERIE PRODOTTO
     --------------------------------------------------- */
  $$('.gal[data-gal]').forEach(function (g) {
    var nome = g.getAttribute('data-gal');
    var stage = $('.gal-stage', g);
    var img = $('.gal-img', g);
    var cap = $('.gal-cap', g);
    var num = $('.gal-count b', g);
    var thumbs = $$('.gal-thumbs button', g);
    var idx = 0;

    function vai(i) {
      var lista = gruppi[nome] || [];
      if (!lista.length) return;
      idx = (i + lista.length) % lista.length;
      var it = lista[idx];
      stage.classList.add('swap');
      var tmp = new Image();
      tmp.onload = tmp.onerror = function () {
        img.src = it.src;
        img.alt = it.cap;
        if (cap) cap.textContent = it.cap;
        if (num) num.textContent = idx + 1;
        stage.classList.remove('swap');
      };
      tmp.src = it.src;
      thumbs.forEach(function (b, k) { b.classList.toggle('on', k === idx); });
    }

    thumbs.forEach(function (b, k) {
      b.addEventListener('click', function () { vai(k); });
    });
    var prev = $('.gal-nav.prev', g), next = $('.gal-nav.next', g);
    if (prev) prev.addEventListener('click', function (e) { e.stopPropagation(); vai(idx - 1); });
    if (next) next.addEventListener('click', function (e) { e.stopPropagation(); vai(idx + 1); });
    if (thumbs.length < 2) {
      if (prev) prev.style.display = 'none';
      if (next) next.style.display = 'none';
    }
    if (stage) {
      stage.addEventListener('click', function () { apri(nome, idx); });
      var sx = 0;
      stage.addEventListener('touchstart', function (e) { sx = e.changedTouches[0].clientX; }, { passive: true });
      stage.addEventListener('touchend', function (e) {
        var d = e.changedTouches[0].clientX - sx;
        if (Math.abs(d) > 45) vai(idx + (d < 0 ? 1 : -1));
      }, { passive: true });
    }
  });

  /* ---------------------------------------------------
     7. SERVIZI — lista + foto
     --------------------------------------------------- */
  var voci = $$('.serv-voce');
  var foto = $$('.serv-foto');
  if (voci.length && foto.length) {
    var attiva = function (i) {
      voci.forEach(function (v, k) { v.classList.toggle('on', k === i); });
      foto.forEach(function (f, k) { f.classList.toggle('on', k === i); });
    };
    voci.forEach(function (v, i) {
      v.addEventListener('click', function () { attiva(i); });
      v.addEventListener('mouseenter', function () { attiva(i); });
      v.addEventListener('focus', function () { attiva(i); });
    });
  }

  /* ---------------------------------------------------
     8. MARCHI — slideshow
     --------------------------------------------------- */
  var ms = $('.ms');
  if (ms) {
    var slides = $$('.ms-slide', ms);
    var dots = $$('.ms-dots button', ms);
    var bar = $('.ms-bar i', ms);
    var durata = parseInt(ms.getAttribute('data-auto') || '5200', 10);
    var cur = 0, t0 = 0, fermo = false;

    var vaiSlide = function (i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('on', k === cur); });
      dots.forEach(function (d, k) { d.classList.toggle('on', k === cur); });
      t0 = performance.now();
    };

    var tick = function (now) {
      if (fermo) {
        t0 = now - (bar ? parseFloat(bar.style.width || '0') / 100 * durata : 0);
      } else {
        var p = clamp((now - t0) / durata, 0, 1);
        if (bar) bar.style.width = (p * 100).toFixed(1) + '%';
        if (p >= 1) vaiSlide(cur + 1);
      }
      requestAnimationFrame(tick);
    };

    /* il palco prende l'altezza della slide piu' alta: niente vuoti */
    var palco = $('.ms-stage', ms);
    function misura() {
      if (!palco) return;
      palco.classList.add('misuro');
      var h = 0;
      slides.forEach(function (sl) { h = Math.max(h, sl.offsetHeight); });
      palco.classList.remove('misuro');
      if (h) palco.style.setProperty('--ms-h', Math.ceil(h) + 'px');
    }
    misura();
    window.addEventListener('resize', misura);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(misura);
    setTimeout(misura, 1200);

    dots.forEach(function (d, k) { d.addEventListener('click', function () { vaiSlide(k); }); });
    var mp = $('.ms-prev', ms), mn = $('.ms-next', ms);
    if (mp) mp.addEventListener('click', function () { vaiSlide(cur - 1); });
    if (mn) mn.addEventListener('click', function () { vaiSlide(cur + 1); });
    ms.addEventListener('mouseenter', function () { fermo = true; });
    ms.addEventListener('mouseleave', function () { fermo = false; });

    vaiSlide(0);
    if (!reduce) requestAnimationFrame(tick);
    else if (bar) bar.style.width = '100%';
  }

  /* ---------------------------------------------------
     9. HUD BILANCIA + barra di avanzamento + lama
     --------------------------------------------------- */
  var dividers = $$('.cut-divider');
  var hud = $('#scaleHud');
  var kgEl = $('#hudKg');
  var barEl = $('#hudBar');
  var progEl = $('#progBar');
  var PESO = 8.640; /* kg */
  var stableT;

  function onScroll() {
    var h = document.documentElement;
    var max = (h.scrollHeight - h.clientHeight) || 1;
    var p = clamp(h.scrollTop / max, 0, 1);

    if (progEl) progEl.style.width = (p * 100).toFixed(2) + '%';

    if (hud) {
      hud.classList.toggle('show', h.scrollTop > 260);
      hud.classList.remove('stable');
      var jitter = (Math.random() - 0.5) * 0.012;
      var val = Math.max(0, PESO * p + (p > 0 && p < 1 ? jitter : 0));
      if (kgEl) kgEl.textContent = val.toFixed(3);
      if (barEl) barEl.style.width = (p * 100).toFixed(1) + '%';
      clearTimeout(stableT);
      stableT = setTimeout(function () {
        hud.classList.add('stable');
        if (kgEl) kgEl.textContent = (PESO * p).toFixed(3);
      }, 420);
    }

    dividers.forEach(function (d) {
      var blade = $('.blade-run', d);
      if (!blade) return;
      var r = d.getBoundingClientRect();
      var t = clamp((window.innerHeight - r.top) / (window.innerHeight + r.height), 0, 1);
      blade.style.transform = 'translateX(' + (t * r.width) + 'px)';
    });

    if (header) header.classList.toggle('scrolled', h.scrollTop > 20);

    revealVisible();
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------------------------------------------------
     10. QUADRANTE BILANCIA (chi siamo)
     --------------------------------------------------- */
  var gauge = $('#gauge');
  if (gauge) {
    var ticks = $('#gaugeTicks');
    if (ticks) {
      var svgns = 'http://www.w3.org/2000/svg';
      for (var i = 0; i <= 30; i++) {
        var ang = (-90 + i * 6) * Math.PI / 180;
        var maj = i % 5 === 0;
        var r1 = maj ? 78 : 84, r2 = 92;
        var l = document.createElementNS(svgns, 'line');
        l.setAttribute('x1', (100 + Math.sin(ang) * r1).toFixed(2));
        l.setAttribute('y1', (104 - Math.cos(ang) * r1).toFixed(2));
        l.setAttribute('x2', (100 + Math.sin(ang) * r2).toFixed(2));
        l.setAttribute('y2', (104 - Math.cos(ang) * r2).toFixed(2));
        l.setAttribute('stroke', maj ? '#0A1B3F' : '#93A0B0');
        l.setAttribute('stroke-width', maj ? '2.4' : '1.2');
        l.setAttribute('stroke-linecap', 'round');
        ticks.appendChild(l);
        if (maj) {
          var tx2 = document.createElementNS(svgns, 'text');
          tx2.setAttribute('x', (100 + Math.sin(ang) * 64).toFixed(2));
          tx2.setAttribute('y', (104 - Math.cos(ang) * 64 + 4).toFixed(2));
          tx2.setAttribute('text-anchor', 'middle');
          tx2.setAttribute('font-size', '11');
          tx2.setAttribute('font-family', 'JetBrains Mono, monospace');
          tx2.setAttribute('fill', '#5C6877');
          tx2.textContent = String(i * 2);
          ticks.appendChild(tx2);
        }
      }
    }
    var needle = $('#needle', gauge);
    if (needle && 'IntersectionObserver' in window) {
      var go = new IntersectionObserver(function (e, o) {
        if (e[0].isIntersecting) {
          needle.style.transform = 'rotate(' + (-90 + 50 / 60 * 180) + 'deg)';
          o.disconnect();
        }
      }, { threshold: 0.4 });
      go.observe(gauge);
    } else if (needle) {
      needle.style.transform = 'rotate(60deg)';
    }
  }

  /* ---------------------------------------------------
     11. TICKER — duplica il contenuto per il loop
     --------------------------------------------------- */
  $$('.ticker-track').forEach(function (t) { t.innerHTML += t.innerHTML; });

  /* ---------------------------------------------------
     12. COOKIE
     --------------------------------------------------- */
  var ck = $('#cookie');
  function altezzaCookie() {
    var h = (ck && ck.classList.contains('show')) ? ck.offsetHeight + 14 : 0;
    document.documentElement.style.setProperty('--ck-h', h + 'px');
  }
  if (ck) {
    if (!localStorage.getItem('ba-cookie')) {
      setTimeout(function () { ck.classList.add('show'); altezzaCookie(); }, 1900);
    }
    $$('[data-ck]', ck).forEach(function (b) {
      b.addEventListener('click', function () {
        localStorage.setItem('ba-cookie', b.getAttribute('data-ck'));
        ck.classList.remove('show');
        altezzaCookie();
      });
    });
    window.addEventListener('resize', altezzaCookie);
    altezzaCookie();
  }

  /* ---------------------------------------------------
     13. FORM CONTATTI -> email
     --------------------------------------------------- */
  var form = $('#formContatti');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var g = function (k) { return (d.get(k) || '').toString().trim(); };
      var body = [
        'Ragione sociale: ' + g('ragione'),
        'Nome e Cognome: ' + g('nome'),
        'Email: ' + g('email'),
        'Telefono: ' + g('telefono'),
        '',
        g('messaggio')
      ].join('\n');
      var sub = g('oggetto') || 'Richiesta dal sito';
      window.location.href = 'mailto:brambilla.srl@virgilio.it?subject=' +
        encodeURIComponent(sub) + '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------------------------------------------------
     14. anno corrente nel footer
     --------------------------------------------------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
