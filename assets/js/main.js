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
     5. CARD CHE SI AFFETTA COL MOUSE
     --------------------------------------------------- */
  $$('.slice-media').forEach(function (box) {
    var top = $('.layer.top', box), bot = $('.layer.bot', box), line = $('.cutline', box);
    if (!top || !bot) return;

    function setCut(pct) {
      top.style.clipPath = 'inset(0 0 ' + (100 - pct) + '% 0)';
      top.style.webkitClipPath = 'inset(0 0 ' + (100 - pct) + '% 0)';
      bot.style.clipPath = 'inset(' + pct + '% 0 0 0)';
      bot.style.webkitClipPath = 'inset(' + pct + '% 0 0 0)';
      if (line) line.style.top = pct + '%';
    }
    box.addEventListener('mouseenter', function () {
      top.style.transform = 'translate(-10px,-7px) rotate(-.45deg)';
      bot.style.transform = 'translate(10px,7px) rotate(.45deg)';
    });
    box.addEventListener('mousemove', function (e) {
      var r = box.getBoundingClientRect();
      setCut(clamp((e.clientY - r.top) / r.height * 100, 7, 93));
    });
    box.addEventListener('mouseleave', function () {
      top.style.transform = '';
      bot.style.transform = '';
      setCut(50);
    });

    /* miniature */
    var wrapId = box.getAttribute('data-thumbs');
    if (wrapId) {
      var thumbs = $$('#' + wrapId + ' button');
      thumbs.forEach(function (b) {
        b.addEventListener('click', function () {
          var src = b.getAttribute('data-src');
          var alt = b.getAttribute('data-alt') || '';
          $$('img', box).forEach(function (im) { im.src = src; im.alt = alt; });
          thumbs.forEach(function (o) { o.classList.remove('on'); });
          b.classList.add('on');
        });
      });
    }
  });

  /* ---------------------------------------------------
     6. LAMA CHE CORRE SUI DIVISORI
     --------------------------------------------------- */
  var dividers = $$('.cut-divider');

  /* ---------------------------------------------------
     7. HUD BILANCIA + barra di avanzamento
     --------------------------------------------------- */
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
     8. QUADRANTE BILANCIA (chi siamo)
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
          var tx = document.createElementNS(svgns, 'text');
          tx.setAttribute('x', (100 + Math.sin(ang) * 64).toFixed(2));
          tx.setAttribute('y', (104 - Math.cos(ang) * 64 + 4).toFixed(2));
          tx.setAttribute('text-anchor', 'middle');
          tx.setAttribute('font-size', '11');
          tx.setAttribute('font-family', 'JetBrains Mono, monospace');
          tx.setAttribute('fill', '#5C6877');
          tx.textContent = String(i * 2);
          ticks.appendChild(tx);
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
     9. TICKER — duplica il contenuto per il loop
     --------------------------------------------------- */
  $$('.ticker-track').forEach(function (t) { t.innerHTML += t.innerHTML; });

  /* ---------------------------------------------------
     10. COOKIE
     --------------------------------------------------- */
  var ck = $('#cookie');
  if (ck) {
    if (!localStorage.getItem('ba-cookie')) {
      setTimeout(function () { ck.classList.add('show'); }, 1900);
    }
    $$('[data-ck]', ck).forEach(function (b) {
      b.addEventListener('click', function () {
        localStorage.setItem('ba-cookie', b.getAttribute('data-ck'));
        ck.classList.remove('show');
      });
    });
  }

  /* ---------------------------------------------------
     11. FORM CONTATTI -> email
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
     12. anno corrente nel footer
     --------------------------------------------------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
