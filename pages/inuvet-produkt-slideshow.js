/* ═══════════════════════════════════════════════════════
   inuvet-produkt-slideshow.js
   Automatic 16:9 product slideshow. Data: inuvet-produkt-slideshow-data.js
   Order: logo intro · brand hero · benefits · products · vet practice trio.
   Per product: 1 packshot scene + 1 scene per dosage form (video or animated image).
   Brand scenes use Lottie animations (lottie-web, svg renderer).
   URL params: ?cat=stress,blase (filter, hides brand scenes) · ?start=hepax-produktfamilie
               ?speed=1.5 · ?brand=0 (products only)
               ?products=manukalind-produktfamilie,ibedex – fixed selection and order (or <body data-products>,
               see Inuvet-Produkt-Slideshow-Big6.html)
               ?edition=inhaltsstoffe – version with ingredient scenes and practice dividers
               (also set by <body data-edition="inhaltsstoffe">, see Inuvet-Produkt-Slideshow-Inhaltsstoffe.html;
               single switches: ?ingredients=1 · ?dividers=1 · ?forms=photo)
               Language: German texts from the data file; with inuvet-produkt-slideshow-fr.js loaded
               (window.SLIDESHOW_I18N, see Inuvet-Produkt-Slideshow-Inhaltsstoffe-FR.html) all texts are replaced
               Dosage-form videos play once: the scene lasts exactly as long as the video (no loop)
               ?render=1 – frame-by-frame mode for the MP4 export (inuvet-produkt-slideshow-export.mjs):
               virtual clock, all CSS animations / videos / Lotties are seeked per frame, ends after fade-to-white
   Keys: → / ← next / previous · Space pause · F fullscreen
   ═══════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const speed = Math.max(0.25, parseFloat(params.get('speed')) || 1);
  const catFilter = (params.get('cat') || '').split(',').filter(Boolean);
  // Produktauswahl in fester Reihenfolge (z. B. Big 6): ?products=handle,handle oder <body data-products="…">
  const pickHandles = (params.get('products') || document.body.dataset.products || '').split(',').map((h) => h.trim()).filter(Boolean);
  const withBrand = !catFilter.length && params.get('brand') !== '0';
  // Fassungen: Standard · „inhaltsstoffe“ = zusätzlich Inhaltsstoffe und Praxis-Trenner (URL-Parameter oder <body data-edition>)
  const edition = params.get('edition') || document.body.dataset.edition || '';
  const OPT = {
    ingredients: edition === 'inhaltsstoffe' || params.get('ingredients') === '1',
    dividers: edition === 'inhaltsstoffe' || params.get('dividers') === '1',
    formPhotos: params.get('forms') === 'photo',
  };
  const RENDER = params.get('render') === '1';
  const reducedMotion = !RENDER && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Uhr: live = echte Timer · Render = virtuelle Zeit, die das Export-Skript vorstellt ─── */
  function virtualClock() {
    let now = 0;
    let seq = 0;
    const queue = [];
    return {
      now: () => now,
      setTimeout(fn, ms) { const id = ++seq; queue.push({ id, at: now + Math.max(0, ms || 0), fn }); return id; },
      clearTimeout(id) { const i = queue.findIndex((q) => q.id === id); if (i >= 0) queue.splice(i, 1); },
      // Fällige Timer der Reihe nach ausführen; nach jedem Schritt Zustand einsammeln (onStep)
      async advanceTo(t, onStep) {
        for (;;) {
          queue.sort((a, b) => a.at - b.at || a.id - b.id);
          const q = queue[0];
          if (!q || q.at > t) break;
          queue.shift();
          now = q.at;
          q.fn();
          await onStep(now);
        }
        now = t;
      },
    };
  }
  const clock = RENDER ? virtualClock() : {
    now: () => performance.now(),
    setTimeout: (fn, ms) => window.setTimeout(fn, ms),
    clearTimeout: (id) => window.clearTimeout(id),
  };

  const TIMING = {
    intro: 3600,         // Logo groß auf Weiß
    hero: 7000,          // „Natürlich gesunde Tiere“
    trio: 7600,          // Drei Vorteile / drei Illustrationen
    packshot: 6000,      // Packshot + Kurzbeschreibung
    solo: 7200,          // Packshot, wenn keine Darreichungsform hinterlegt ist
    form: 5500,          // Darreichungsform als Bild
    ingredients: 7200,   // Inhaltsstoffe (Auszug) – plus 5 ms je Zeichen Beschreibungstext …
    ingredientsMax: 12000, // … höchstens
    divider: 5600,       // Praxis-Trenner
    // Darreichungsform als Video: läuft einmal (keine Schleife). Der Übergang beginnt so früh,
    // dass er genau beim letzten Videobild deckt – kein Standbild, kein Schwarz.
    curtain: 620,        // Szenenwechsel: Zeit bis die Fläche deckt
    crossfade: 900,      // weiche Überblendung (Marken-Szenen)
    reveal: 1300,        // Praxis-Trenner: Foto öffnet sich als Band von der Mitte aus
    fadeOut: 1600,       // Ende: Ausblenden auf Weiß, danach beginnt das Intro
  };

  /* ─── Marken-Szenen: Texte wie auf inuvet.com, Animationen aus dem Styleguide ─── */
  const LOTTIE = '../assets/brands/inuvet/lotties/';
  const BRAND = {
    hero: {
      label: 'inuvet',
      lottie: 'Inuvet_Alena_Animation_Produkt-Tierarzt_5x4.json',
      headline: 'Natürlich gesunde Tiere',
      body: 'Tierärztlich entwickelte Nahrungsergänzung mit pflanzlichen Inhaltsstoffen — für Hunde, Katzen und Kleintiere. Entdecke Produkte, die auf den Geschmack deines Tieres optimiert sind.',
    },
    benefits: {
      label: 'Darum inuvet',
      variant: 'icons',
      items: [
        { lottie: 'Inuvet_Icon_Animation_Tierarztpraxis_1x1.json', title: 'Beste Expertise', text: 'inuvet Produkte gibt es exklusiv in deiner Tierarztpraxis' },
        { lottie: 'Inuvet_Icon_Animation_Pfoten_1x1.json', title: 'Für die Langzeitgabe', text: 'Mit natürlichen Inhaltsstoffen, die deinem Tier gut tun' },
        { lottie: 'Inuvet_Icon_Animation_Schild_1x1.json', title: 'Immer gut unterstützt', text: 'Mit Produkten, die auf den Geschmack der Patienten optimiert sind.' },
      ],
    },
    practice: {
      label: 'Für Tierarztpraxen',
      variant: 'illus',
      items: [
        { lottie: 'Inuvet_Alena_Animation_Inhaltsstoffe_1x1.json', title: 'Grüne Pfoten', text: 'Verpackungen mit 85 % Recyclingpapier, kurze Lieferketten und natürliche Inhaltsstoffe.' },
        { lottie: 'Inuvet_Alena_Animation_Tierarzt-Katze-Produkt_1x1.json', title: 'Nur bei euch', text: 'inuvet-Produkte sind nicht im Internet erhältlich, nur in eurer Praxis. Eure Beratung wird entlohnt!' },
        { lottie: 'Inuvet_Alena_Animation_Weltweit_1x1.json', title: 'Verträglich, beliebt und hoch konzentriert', text: 'Studienbasierte Phytotherapie. Bei über 20.000 Tierärzt*innen im Einsatz.' },
      ],
    },
  };
  /* ─── Sprache: Übersetzungsdatei (z. B. inuvet-produkt-slideshow-fr.js) ersetzt die deutschen Texte ─── */
  const I18N = window.SLIDESHOW_I18N || null;
  const UI = Object.assign({
    ingredients: 'Inhaltsstoffe (Auszug)',
    empty: 'Keine Produkte gefunden.',
    pause: 'Pause',
    resume: 'Fortsetzen',
    divider: 'Über 20.000 Tierarztpraxen arbeiten mit inuvet',
  }, I18N ? I18N.ui : {});
  if (I18N) {
    const missing = new Set();
    const pick = (map, de) => {
      if (!de) return de;
      if (map && map[de] != null) return map[de];
      missing.add(de);
      return de;
    };
    Object.entries(I18N.brand || {}).forEach(([key, t]) => {
      const b = BRAND[key];
      if (!b) return;
      Object.assign(b, { ...t, items: b.items });
      (t.items || []).forEach((it, i) => { if (b.items && b.items[i]) Object.assign(b.items[i], it); });
    });
    window.SLIDESHOW_PRODUCTS = (window.SLIDESHOW_PRODUCTS || []).map((p) => {
      const t = (I18N.products || {})[p.handle] || {};
      if (!t.title) missing.add(p.handle);
      return {
        ...p,
        title: t.title || p.title,
        short: t.short || p.short,
        category: pick(I18N.categories, p.category),
        forms: p.forms.map((f) => ({ ...f, name: pick(I18N.forms, f.name), caption: pick(I18N.captions, f.caption) })),
        ingredients: (p.ingredients || []).map((ing) => {
          const it = (I18N.ingredients || {})[ing.name];
          if (!it) missing.add(ing.name);
          const latin = (I18N.latin || {})[ing.latin] || ing.latin;
          return { ...ing, ...(it || {}), latin };
        }),
      };
    });
    if (missing.size) console.warn(`Slideshow (${I18N.lang}): ohne Übersetzung`, [...missing]);
  }

  // Marken-Szenen tragen ein Pseudo-Produkt (Kategorie „brand“ = inuvet-Grün)
  const brandP = (key, label) => ({ handle: `inuvet-${key}`, cat: 'brand', category: label, title: '', forms: [] });

  const allProducts = window.SLIDESHOW_PRODUCTS || [];
  const products = pickHandles.length
    ? pickHandles.map((h) => allProducts.find((p) => p.handle === h)).filter(Boolean)
    : allProducts.filter((p) => !catFilter.length || catFilter.includes(p.cat));
  if (pickHandles.length && products.length !== pickHandles.length) {
    console.warn('Slideshow: unbekannte Produkt-Handles', pickHandles.filter((h) => !allProducts.some((p) => p.handle === h)));
  }

  const scenes = [];
  if (withBrand) {
    // soft: Intro-Slides wechseln per Überblendung, ohne Farbfläche (auch zum ersten Produkt)
    scenes.push({ kind: 'intro', p: brandP('intro', ''), pi: -1, step: 0, soft: true });
    scenes.push({ kind: 'hero', p: brandP('hero', BRAND.hero.label), pi: -2, step: 0, data: BRAND.hero, soft: true });
    scenes.push({ kind: 'trio', p: brandP('vorteile', BRAND.benefits.label), pi: -3, step: 0, data: BRAND.benefits, soft: true });
  }
  // Praxis-Trenner: Foto aus der Praxis, alle DIVIDER_EVERY Produkte (Fotos lokal, nicht im Repo – Personen erkennbar)
  const DIVIDER_EVERY = 3;
  // Freigegebene Praxisfotos (Alex Hagmann), nur Querformat. Reihenfolge = Abfolge in der Slideshow (9 Trenner bei 28 Produkten);
  // weitere Fotos stehen dahinter bereit, falls der Abstand kleiner wird.
  // pos = object-position: Bildausschnitt so, dass der Text unten nicht über Gesichtern liegt
  const DIVIDER_PHOTOS = [
    { file: 'Praxis_Team_BRK08221.jpg', pos: 'center 90%' },
    { file: 'Praxis_Tieraerztin-mit-Kaninchen_image00011.jpg', pos: 'center 35%' },
    { file: 'Praxis_Hund-Behandlung_BRK09200.jpg', pos: 'center 35%' },
    { file: 'Praxis_Tieraerztin-mit-Hund_image00021.jpg', pos: 'center 100%' },
    { file: 'Praxis_Tieraerztin-Portrait_BRK09230.jpg', pos: 'center 40%' },
    { file: 'Praxis_Transportbox_image00009.jpg', pos: 'center 30%' },
    { file: 'Praxis_Team-mit-Hund_BRK09066.jpg', pos: 'center 100%' },
    { file: 'Praxis_Empfang-Schreibtisch_image00017.jpg', pos: 'center 40%' },
    { file: 'Praxis_Katze-Untersuchung_IMG_7569.jpg', pos: 'center 40%' },
    { file: 'Praxis_Tieraerztin-mit-Hund_image00019.jpg', pos: 'center 40%' },
    { file: 'Praxis_Hund-Behandlungstisch_BRK08088.jpg', pos: 'center 40%' },
    { file: 'Praxis_Medikament-Vorbereitung_image00001.jpg', pos: 'center 30%' },
    { file: 'Praxis_Behandlung-Maske_image00005.jpg', pos: 'center 30%' },
    { file: 'Praxis_Empfang-Schreibtisch_image00018.jpg', pos: 'center 40%' },
  ];
  const DIVIDER_TEXT = UI.divider;
  let dividerCount = 0;
  products.forEach((p, pi) => {
    const withIng = OPT.ingredients && (p.ingredients || []).length > 0;
    p.steps = 1 + (withIng ? 1 : 0) + p.forms.length;
    scenes.push({ kind: 'packshot', p, pi, step: 0 });
    if (withIng) scenes.push({ kind: 'ingredients', p, pi, step: 1 });
    const offset = withIng ? 2 : 1;
    p.forms.forEach((f, fi) => scenes.push({ kind: 'form', p, pi, f, fi, step: fi + offset }));
    const last = pi === products.length - 1;
    if (OPT.dividers && !last && (pi + 1) % DIVIDER_EVERY === 0) {
      const photo = DIVIDER_PHOTOS[dividerCount % DIVIDER_PHOTOS.length];
      scenes.push({ kind: 'divider', p: brandP(`trenner-${++dividerCount}`, ''), pi: -10 - dividerCount, step: 0, soft: true, photo });
    }
  });
  if (withBrand) {
    scenes.push({ kind: 'trio', p: brandP('praxis', BRAND.practice.label), pi: -4, step: 0, data: BRAND.practice });
  }

  const $ = (sel) => document.querySelector(sel);
  const body = document.body;
  const stage = $('.show__stage');
  const sceneHost = $('.show__scenes');
  const curtain = $('.show__curtain');
  const barCat = $('[data-bar="cat"]');
  const barCatLabel = $('[data-bar="cat-label"]');
  const barProduct = $('[data-bar="product"]');
  const barCounter = $('[data-bar="counter"]');
  const steps = $('[data-bar="steps"]');
  const progress = $('.show__progress-fill');
  const btnPause = $('[data-action="pause"]');

  if (!scenes.length) {
    sceneHost.textContent = UI.empty;
    return;
  }

  /* ─── Bühne skalieren (1920 × 1080 → Fenster) ─── */
  function fit() {
    const w = stage.offsetWidth;
    const h = stage.offsetHeight;
    const scale = Math.min(window.innerWidth / w, window.innerHeight / h);
    stage.style.setProperty('--stage-scale', scale.toFixed(4));
  }
  window.addEventListener('resize', fit);
  fit();

  /* ─── Hilfen ─── */
  const pad = (n) => String(n).padStart(2, '0');

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function rise(node, i) {
    node.classList.add('show__rise');
    node.style.setProperty('--anim-delay', `${0.35 + i * 0.14}s`);
    return node;
  }

  function preload(scene) {
    if (!scene) return;
    if (scene.kind === 'packshot') new Image().src = scene.p.packshot;
    else if (scene.kind === 'ingredients') scene.p.ingredients.forEach((i) => { if (i.image) new Image().src = i.image; });
    else if (scene.kind === 'divider') new Image().src = `../slideshow-media/praxis/${scene.photo.file}`;
    else if (scene.kind === 'form' && scene.f.video && !OPT.formPhotos) {
      const v = document.createElement('video');
      v.preload = 'auto';
      v.src = scene.f.video;
    }
    else if (scene.kind === 'form') new Image().src = scene.f.image;
  }

  // Bild mit Ersatzquellen: lokale Datei zuerst, sonst Shop-CDN
  function imgWithFallback(srcs, alt) {
    const list = srcs.filter(Boolean);
    const img = el('img');
    img.alt = alt;
    img.addEventListener('error', function onError() {
      list.shift();
      if (list.length) img.src = list[0];
      else img.removeEventListener('error', onError);
    });
    img.src = list[0] || '';
    return img;
  }

  /* ─── Szenen bauen ─── */
  function buildPackshot(s) {
    const { p } = s;
    const scene = el('section', 'show__scene --packshot');
    scene.dataset.cat = p.cat;

    // Kategorie steht in der Leiste oben – hier nur Name, Kurzbeschreibung, Darreichungsformen
    const copy = el('div', 'show__copy flow');
    copy.append(rise(el('h1', 'show__name', p.title), 0));
    if (p.short) copy.append(rise(el('p', 'show__lead', p.short), 1));
    if (p.forms.length) {
      const tags = el('div', 'show__tags');
      p.forms.forEach((f) => tags.append(el('span', 'badge', f.name)));
      copy.append(rise(tags, 2));
    }

    const media = el('figure', 'show__media --still');
    media.append(imgWithFallback([p.packshot, p.packshotFallback], `${p.title} – Packshot`));

    scene.append(copy, media);
    return { scene, duration: p.forms.length ? TIMING.packshot : TIMING.solo };
  }

  function buildForm(s) {
    const { p, f, fi } = s;
    const scene = el('section', 'show__scene --form');
    scene.dataset.cat = p.cat;

    const media = el('figure', 'show__media');
    let video = null;
    if (f.video && !OPT.formPhotos) {
      video = el('video');
      Object.assign(video, { muted: true, loop: false, playsInline: true, preload: 'auto', poster: f.image });
      video.setAttribute('muted', '');
      video.setAttribute('aria-hidden', 'true');
      video.src = f.video;
      // Lokales Video fehlt (z. B. im Web): stattdessen Bild zeigen
      video.addEventListener('error', () => {
        media.classList.add('--animated');
        video.replaceWith(imgWithFallback([f.image, f.imageFallback], `${p.title} ${f.name}`));
      }, { once: true });
      media.append(video);
    } else {
      media.classList.add('--animated');
      media.append(imgWithFallback([f.image, f.imageFallback], `${p.title} ${f.name}`));
    }

    const copy = el('div', 'show__copy flow');
    const eyebrow = el('p', 'label-caps show__eyebrow');
    eyebrow.append(
      el('span', '', f.name),
      el('span', '', `${fi + 1} / ${p.forms.length}`),
    );
    copy.append(rise(eyebrow, 0));
    copy.append(rise(el('h2', 'show__name --sub', p.title), 1));
    if (f.caption) copy.append(rise(el('p', 'show__caption', f.caption), 2));

    scene.append(media, copy);
    // Inhaltliches Ende: manche Dateien haben danach noch ~1 s Schwarz (videoEnd in den Daten)
    if (video && f.videoEnd) {
      video.addEventListener('timeupdate', () => {
        if (!RENDER && video.currentTime >= f.videoEnd - 0.05) { video.pause(); video.currentTime = f.videoEnd - 0.05; }
      });
    }
    return { scene, video, videoEnd: f.videoEnd || 0, duration: TIMING.form };
  }

  // Lottie-Platzhalter: wird nach dem Einhängen der Szene geladen (mount → startLotties).
  // Ohne Einblendung: alle Animationen laufen sofort in Schleife – wie im Shop (custom.js: loop + autoplay).
  // Benefit-Icons = dieselben Dateien wie im Shop (main_icons_animation_tapraxis/pfoten/schield.json).
  function lottieBox(cls, file, loop) {
    const box = el('div', `show__lottie ${cls}`);
    box.setAttribute('aria-hidden', 'true');
    box.dataset.file = file;
    box.dataset.loop = loop ? '1' : '';
    return box;
  }

  function buildIntro() {
    const scene = el('section', 'show__scene --intro');
    scene.dataset.cat = 'brand';
    const logo = el('img', 'show__intro-logo');
    logo.src = '../assets/brands/inuvet/inuvet-logo.svg';
    logo.alt = 'inuvet';
    scene.append(logo);
    return { scene, duration: TIMING.intro, onStage: true };
  }

  function buildHero(s) {
    const d = s.data;
    const scene = el('section', 'show__scene --form --hero');
    scene.dataset.cat = 'brand';

    const media = el('figure', 'show__media --lottie');
    media.append(lottieBox('', d.lottie, true));

    const copy = el('div', 'show__copy flow');
    copy.append(rise(el('h1', 'show__name', d.headline), 0));
    copy.append(rise(el('p', 'show__lead', d.body), 1));

    scene.append(media, copy);
    return { scene, duration: TIMING.hero };
  }

  function buildTrio(s) {
    const d = s.data;
    const scene = el('section', `show__scene --trio --${d.variant}`);
    scene.dataset.cat = 'brand';
    d.items.forEach((item, i) => {
      const col = el('div', 'show__trio-item flow');
      // Animation steht sofort; der Text der Spalten kommt nacheinander
      const delay = 0.35 + i * 0.4;
      col.append(lottieBox('show__trio-media', item.lottie, true));
      const title = rise(el('h2', 'show__trio-title', item.title), 0);
      const text = rise(el('p', 'show__trio-text', item.text), 0);
      title.style.setProperty('--anim-delay', `${delay + 0.15}s`);
      text.style.setProperty('--anim-delay', `${delay + 0.3}s`);
      col.append(title, text);
      scene.append(col);
    });
    return { scene, duration: TIMING.trio };
  }

  // Inhaltsstoffe (Auszug): bis zu drei Hauptinhaltsstoffe mit Bild, Name und lateinischem Namen (Shop-Metaobjekt)
  function buildIngredients(s) {
    const { p } = s;
    const scene = el('section', 'show__scene --ingredients');
    scene.dataset.cat = p.cat;
    const head = el('div', 'show__ing-head flow');
    head.append(rise(el('p', 'label-caps show__eyebrow', UI.ingredients), 0));
    head.append(rise(el('h2', 'show__name --sub', p.title), 1));
    const list = el('div', 'show__ing-list');
    const shown = p.ingredients.slice(0, 4);
    list.style.setProperty('--ing-cols', String(Math.max(3, shown.length)));
    shown.forEach((ing, i) => {
      const item = rise(el('figure', 'show__ing'), 2 + i);
      const media = el('div', 'show__ing-media');
      media.append(imgWithFallback([ing.image], ing.name));
      const cap = el('figcaption', 'flow');
      cap.append(el('p', 'show__ing-name', ing.name));
      if (ing.latin) cap.append(el('p', 'show__ing-latin', ing.latin));
      if (ing.summary) cap.append(el('p', 'show__ing-text', ing.summary));
      item.append(media, cap);
      list.append(item);
    });
    scene.append(head, list);
    // Mit Beschreibungstexten: etwas länger stehen lassen, je nach Textmenge (höchstens TIMING.ingredientsMax)
    const chars = shown.reduce((n, ing) => n + (ing.summary || '').length, 0);
    return { scene, duration: Math.min(TIMING.ingredients + chars * 5, TIMING.ingredientsMax) };
  }

  // Praxis-Trenner: Foto vollflächig über der ganzen Bühne, Logo weiß, Text unten auf Verlauf (Styleguide F.1)
  function buildDivider(s) {
    const scene = el('section', 'show__scene --divider');
    scene.dataset.cat = 'brand';
    const img = el('img', 'show__divider-img');
    img.alt = '';
    img.addEventListener('error', () => scene.classList.add('--no-photo'), { once: true });
    img.style.objectPosition = s.photo.pos;
    img.src = `../slideshow-media/praxis/${s.photo.file}`;
    const logo = el('img', 'show__divider-logo');
    logo.src = '../assets/brands/inuvet/inuvet-logo-weiss.svg';
    logo.alt = 'inuvet';
    const text = rise(el('p', 'show__divider-text', DIVIDER_TEXT), 0);
    text.style.setProperty('--anim-delay', `${TIMING.reveal / 1000 - 0.3}s`); // erst wenn das Foto fast offen ist
    scene.append(img, el('div', 'show__divider-scrim'), logo, text);
    return { scene, duration: TIMING.divider, onStage: true };
  }

  const BUILD = { packshot: buildPackshot, form: buildForm, intro: buildIntro, hero: buildHero, trio: buildTrio, ingredients: buildIngredients, divider: buildDivider };

  /* ─── Lottie ─── */
  function startLotties(built) {
    built.lotties = [];
    if (!window.lottie) return;
    built.scene.querySelectorAll('.show__lottie').forEach((box) => {
      // Eingebettete Daten (funktioniert auch per file://), sonst JSON aus dem Styleguide laden.
      // Kopie, weil lottie-web die Daten beim Laden verändert.
      const embedded = (window.SLIDESHOW_LOTTIES || {})[box.dataset.file];
      const anim = window.lottie.loadAnimation({
        container: box,
        renderer: 'svg',
        loop: !!box.dataset.loop,
        autoplay: false,
        ...(embedded ? { animationData: structuredClone(embedded) } : { path: LOTTIE + box.dataset.file }),
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
      });
      anim.setSpeed(speed);
      const loop = !!box.dataset.loop && !reducedMotion;
      built.lotties.push({ anim, started: loop, loop, t0: clock.now() });
      if (RENDER) return; // Render: Bild wird je Frame gesetzt
      if (loop) {
        if (!paused) anim.play();
      } else {
        // Einmalige Animation: gleich das fertige Bild zeigen
        const showEnd = () => anim.goToAndStop(anim.totalFrames - 1, true);
        if (anim.isLoaded) showEnd();
        else anim.addEventListener('DOMLoaded', showEnd);
      }
    });
  }

  function stopLotties(built) {
    (built.lotties || []).forEach((rec) => { rec.frozen = true; rec.anim.pause(); });
  }

  /* ─── Leiste ─── */
  function swapText(node, text) {
    if (node.textContent === text) return;
    if (!node.textContent) { node.textContent = text; return; }
    node.classList.add('--out');
    clock.setTimeout(() => {
      node.textContent = text;
      node.classList.remove('--out');
    }, 250);
  }

  function updateBar(s) {
    if (s.kind === 'divider') return; // Trenner liegt über der Leiste; sie bleibt beim Produkt davor
    stage.dataset.cat = s.p.cat;
    // Marken-Szenen: keine Leiste, nur das Logo (größer)
    stage.classList.toggle('--brand', s.p.cat === 'brand');
    if (s.kind === 'intro') return; // Intro deckt die Leiste ab
    swapText(barCatLabel, s.p.category);
    swapText(barProduct, s.p.title);
    const isBrand = s.p.cat === 'brand';
    barCounter.hidden = isBrand;
    if (isBrand) { steps.hidden = true; return; }
    barCounter.innerHTML = `${pad(s.pi + 1)} <span>/ ${pad(products.length)}</span>`;

    const total = s.p.steps || s.p.forms.length + 1;
    if (steps.children.length !== total || steps.dataset.product !== s.p.handle) {
      steps.replaceChildren(...Array.from({ length: total }, () => el('span', 'show__step')));
      steps.dataset.product = s.p.handle;
    }
    [...steps.children].forEach((node, i) => {
      node.classList.toggle('--done', i < s.step);
      node.classList.toggle('--active', i === s.step);
    });
    steps.hidden = total < 2;
  }

  function runProgress(ms) {
    progress.classList.remove('--run');
    void progress.offsetWidth; // Animation neu starten
    progress.style.setProperty('--scene-dur', `${ms}ms`);
    progress.classList.add('--run');
  }

  /* ─── Ablauf ─── */
  const live = new Set();   // Szenen im DOM (aktuelle + ausblendende) – für den Render-Modus
  let pending = 0;          // Render: wartet auf Video-Metadaten
  let index = 0;
  let current = null;       // { scene, video }
  let timer = null;
  let remaining = 0;
  let startedAt = 0;
  let paused = false;

  function schedule(ms) {
    clock.clearTimeout(timer);
    remaining = ms;
    startedAt = clock.now();
    if (!paused) timer = clock.setTimeout(next, ms);
  }

  // Wie lange der Übergang zur nächsten Szene braucht, bis er deckt
  function leadFor(i) {
    const n = scenes[i + 1];
    if (!n || n.kind === 'intro') return TIMING.fadeOut;
    if (n.kind === 'divider') return TIMING.reveal;
    if (n.soft) return TIMING.crossfade;
    return TIMING.curtain;
  }

  function mount(i, soft = false) {
    const s = scenes[i];
    const built = BUILD[s.kind](s);
    let duration = built.duration / speed;

    // Alte Szene ausblenden und danach entfernen
    if (current) {
      const old = current;
      old.scene.classList.remove('--entering');
      old.scene.classList.add('--leaving');
      // Überblendung: alte Szene bleibt stehen, bis die neue darüber deckend ist (Intro liegt oben und blendet selbst aus)
      if (soft && !old.onStage) old.scene.classList.add('--hold');
      // Video läuft unter dem Übergang weiter bis zu seinem Ende (kein eingefrorenes Bild)
      stopLotties(old);
      clock.setTimeout(() => {
        old.scene.remove();
        (old.lotties || []).forEach((rec) => { rec.dead = true; rec.anim.destroy(); });
        live.delete(old);
      }, 1200);
    }

    built.scene.style.setProperty('--scene-dur', `${duration}ms`);
    built.scene.classList.add('--entering');
    // Aus dem Intro: das Intro liegt oben und blendet selbst aus – die neue Szene steht schon darunter
    if (soft && !(current && current.onStage)) built.scene.classList.add('--soft');
    // Intro liegt über der ganzen Bühne (auch über der Leiste)
    (built.onStage ? stage : sceneHost).append(built.scene);
    current = built;
    built.t0 = clock.now();
    live.add(built);
    updateBar(s);
    startLotties(built);

    const start = (ms) => {
      runProgress(ms);
      schedule(ms);
    };

    if (built.video) {
      const v = built.video;
      const begin = () => {
        const len = built.videoEnd ? Math.min(v.duration, built.videoEnd) : v.duration;
        const d = (len * 1000) / speed;
        // Übergang vorziehen: deckt genau beim letzten Videobild
        const ms = Number.isFinite(d) && d > 0 ? Math.max(d - leadFor(i) / speed, d * 0.6) : duration;
        built.scene.style.setProperty('--scene-dur', `${ms}ms`);
        start(ms);
      };
      v.currentTime = 0;
      if (!paused && !RENDER) v.play().catch(() => {});
      if (v.readyState >= 1) begin();
      else {
        pending++;
        const done = (fn) => () => { if (built.begun) return; built.begun = true; pending--; fn(); };
        v.addEventListener('loadedmetadata', done(begin), { once: true });
        v.addEventListener('error', done(() => start(duration)), { once: true });
      }
    } else {
      start(duration);
    }

    preload(scenes[(i + 1) % scenes.length]);
  }

  let switching = false;    // Produktwechsel läuft (Fläche deckt gerade)
  let renderDone = false;   // Render: Fade-to-White am Ende ist fertig

  function go(i) {
    if (switching) return;
    const prevScene = scenes[index];
    const wraps = i >= scenes.length;
    index = (i + scenes.length) % scenes.length;
    const nextScene = scenes[index];

    // Szenenwechsel: Fläche deckt, darunter Szene tauschen.
    // Produktwechsel = volle Kategoriefarbe, innerhalb des Produkts = helle Kategoriefarbe.
    // Intro-Slides (soft): keine Fläche, neue Szene blendet über die alte
    // Ende der Schleife: Fade-to-White, darunter startet das Intro (Logo auf Weiß)
    // Render: das Video endet mit dem Fade (auch ohne Marken-Szenen beim Sprung zurück zum Anfang)
    if (current && (nextScene.kind === 'intro' || (RENDER && wraps)) && !reducedMotion) {
      clock.clearTimeout(timer);
      switching = true;
      curtain.classList.remove('--run', '--light');
      curtain.classList.add('--fade');
      clock.setTimeout(() => {
        if (RENDER) { renderDone = true; return; }
        mount(index);
        curtain.classList.remove('--fade');
        switching = false;
      }, TIMING.fadeOut / speed);
    } else if (current && (prevScene.soft || nextScene.soft)) {
      mount(index, !reducedMotion);
    } else if (current && !reducedMotion) {
      clock.clearTimeout(timer);
      switching = true;
      curtain.dataset.cat = nextScene.p.cat;
      curtain.classList.toggle('--light', prevScene.pi === nextScene.pi);
      curtain.classList.remove('--run');
      void curtain.offsetWidth;
      curtain.classList.add('--run');
      clock.setTimeout(() => {
        switching = false;
        mount(index);
      }, TIMING.curtain);
    } else {
      mount(index);
    }
  }

  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  function setPaused(state) {
    paused = state;
    body.classList.toggle('--paused', paused);
    btnPause.textContent = paused ? UI.resume : UI.pause;
    if (paused) {
      clock.clearTimeout(timer);
      remaining -= clock.now() - startedAt;
      if (current && current.video) current.video.pause();
      (current?.lotties || []).forEach(({ anim }) => anim.pause());
    } else {
      startedAt = clock.now();
      timer = clock.setTimeout(next, Math.max(remaining, 300));
      if (current && current.video) current.video.play().catch(() => {});
      (current?.lotties || []).forEach(({ anim, started }) => { if (started) anim.play(); });
    }
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }

  /* ─── Bedienung ─── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === ' ') { e.preventDefault(); setPaused(!paused); }
    else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
  });
  document.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'prev') prev();
    if (action === 'next') next();
    if (action === 'pause') setPaused(!paused);
    if (action === 'fullscreen') toggleFullscreen();
  });

  // Maus/Bedienleiste nach 2,5 s Ruhe ausblenden
  let idleTimer = null;
  const wake = () => {
    body.classList.remove('--idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => body.classList.add('--idle'), 2500);
  };
  if (!RENDER) {
    document.addEventListener('mousemove', wake);
    wake();
  }

  /* ─── Render-Modus: Schnittstelle für das Export-Skript ─── */
  const realWait = (ms) => new Promise((r) => window.setTimeout(r, ms));
  const animStart = new Map();   // laufende Animation → virtuelle Startzeit
  const animKnown = new WeakSet(); // schon erfasst (nie neu starten, auch wenn fertig)

  async function settle(t) {
    void document.body.offsetWidth; // Stil berechnen → neue CSS-Animationen/Transitions entstehen
    for (let i = 0; pending > 0 && i < 500; i++) await realWait(10);
    for (const a of document.getAnimations()) {
      if (!animKnown.has(a)) { animKnown.add(a); animStart.set(a, t); a.pause(); }
    }
  }

  function seekVideo(v, target) {
    if (Math.abs(v.currentTime - target) < 0.5 / 60 && v.readyState >= 2) return Promise.resolve();
    return new Promise((resolve) => {
      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        if (v.requestVideoFrameCallback) {
          let shown = false;
          v.requestVideoFrameCallback(() => { shown = true; resolve(); });
          window.setTimeout(() => { if (!shown) resolve(); }, 250);
        } else resolve();
      };
      v.addEventListener('seeked', done, { once: true });
      window.setTimeout(done, 4000);
      v.currentTime = target;
    });
  }

  async function renderFrame(t) {
    await clock.advanceTo(t, settle);
    await settle(t);
    // CSS-Animationen und -Transitions auf die virtuelle Zeit setzen
    for (const [a, t0] of animStart) {
      const end = a.effect ? a.effect.getComputedTiming().endTime : 0;
      a.currentTime = Math.min(Math.max(0, t - t0), end);
      if (t - t0 >= end) animStart.delete(a); // Endzustand bleibt stehen (fill)
    }
    // Videos und Lotties der Szenen im DOM
    const waits = [];
    for (const b of live) {
      const local = Math.max(0, (t - b.t0) / 1000) * speed;
      if (b.video && !b.frozen && b.video.isConnected && Number.isFinite(b.video.duration) && b.video.duration > 0) {
        // Video läuft einmal und bleibt danach auf dem letzten Bild stehen
        const end = b.videoEnd ? Math.min(b.video.duration, b.videoEnd) : b.video.duration;
        waits.push(seekVideo(b.video, Math.min(local, end - 0.04)));
      }
      for (const rec of b.lotties || []) {
        if (rec.dead || rec.frozen || !rec.anim.isLoaded) continue;
        const total = rec.anim.totalFrames;
        const f = local * rec.anim.frameRate;
        rec.anim.goToAndStop(rec.loop ? f % total : Math.min(f, total - 1), true);
      }
    }
    // Bilder vollständig geladen und dekodiert
    for (const img of document.querySelectorAll('.show__stage img')) {
      if (!img.complete) waits.push(img.decode().catch(() => {}));
    }
    await Promise.all(waits);
    return { done: renderDone, t };
  }

  if (RENDER) {
    body.classList.add('--render');
    window.__render = {
      ready: async () => {
        await document.fonts.ready;
        await settle(0);
        return { scenes: scenes.length, fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family) };
      },
      frame: renderFrame,
    };
  }

  /* ─── Start ─── */
  const startHandle = params.get('start');
  const startIndex = startHandle ? Math.max(0, scenes.findIndex((s) => s.p.handle === startHandle)) : 0;
  barCat.hidden = false;
  index = startIndex;
  mount(startIndex);
})();
