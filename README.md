# Brambilla Angelo s.r.l. — sito web

<p align="center">
  <a href="https://cammo22.github.io/Brmbll/">
    <img src="https://img.shields.io/badge/%E2%96%B6%20APRI%20IL%20SITO-cammo22.github.io%2FBrmbll-E11D2E?style=for-the-badge&labelColor=0A1B3F" alt="Apri il sito">
  </a>
</p>

<p align="center">
  <img src=".github/preview.png" alt="Anteprima della home page" width="900">
</p>

Rework completo del sito di **Brambilla Angelo s.r.l.** — vendita e assistenza di bilance,
affettatrici, registratori di cassa, macchinari e accessori per negozi.
Via Lecco n. 16 — 20864 Agrate Brianza (MB).

Sito statico: solo HTML, CSS e JavaScript, nessun framework e nessuna dipendenza
a parte i font di Google Fonts.

---

## Contenuti

Tutti i testi provengono dal sito originale (`brambillaangelosrl.it`): chi siamo, i sette
servizi, i marchi trattati, le consegne a domicilio, le didascalie della vetrina offerte,
i recapiti, i dati societari, l'informativa privacy e quella sui cookie.
Insieme ai testi sono state recuperate le foto del negozio e i sei cataloghi prodotto.

I **cataloghi PDF sono stati rifatti**: i 251 articoli dei file originali — foto, nome e
scheda tecnica — sono stati estratti e reimpaginati nello stile del sito, con copertina,
testatina e piè di pagina con i recapiti. Le foto dei prodotti a catalogo compaiono anche
nelle gallerie del sito.

Una sola pagina che scorre — hero, chi siamo, i sei reparti prodotto uno dietro l'altro,
servizi, marchi, consegne, offerte, dove siamo, contatti — più due pagine di testo legale.

## Animazioni

Il tema visivo è l'officina: acciaio, lame, display delle bilance.

- **intro** — la pagina viene tagliata a metà da una lama e le due metà scorrono via
- **titolo affettato** — il nome è composto da fette orizzontali che entrano alternate
- **lama sui divisori** — una lama d'acciaio corre lungo la linea di taglio mentre si scorre
- **HUD bilancia** — un display LCD pesa la pagina in kg durante lo scorrimento, con
  il LED che passa a «stabile» quando ci si ferma
- **quadrante** — in «Chi siamo» la lancetta si ferma su «oltre 50 anni nel settore»

Tutte le animazioni rispettano `prefers-reduced-motion`.

## Interazioni

- **tutte le foto si aprono a schermo intero** — lightbox con frecce, contatore,
  didascalia, tastiera (`←` `→` `Esc`) e swipe da telefono
- **chi siamo** — le voci «Bilance elettroniche», «Affettatrici», «Registratori di cassa»,
  «Tritacarne» e «Segaossa» aprono la foto del prodotto corrispondente
- **prodotti** — ogni reparto ha una galleria con miniature, frecce, contatore e didascalia;
  la foto grande si apre a schermo intero
- **servizi** — la lista dei sette servizi comanda il pannello fotografico accanto
- **marchi trattati** — slideshow automatico dei tre gruppi, con frecce, indicatori,
  barra di avanzamento e nastro scorrevole di tutti i marchi

## Struttura

```
index.html                 home (tutte le sezioni)
informativa-privacy.html   informativa privacy completa
cookies.html               informativa cookie completa
assets/css/style.css       stile
assets/js/main.js          interazioni
assets/img/                foto del negozio e dei prodotti
assets/pdf/                i sei cataloghi prodotto
```

## Sviluppo in locale

Basta aprire `index.html` nel browser. Per servirlo via HTTP:

```bash
python -m http.server 8123
```

## Nota sul form contatti

Il modulo di contatto apre il client di posta predefinito con i campi già compilati
(`mailto:` verso `brambilla.srl@virgilio.it`): un sito statico non ha un backend che
possa inviare le email da solo. Per un invio automatico serve un servizio esterno
(es. Formspree) oppure un hosting con PHP.
