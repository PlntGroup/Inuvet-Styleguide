/* ═══════════════════════════════════════════════════════
   inuvet-produkt-slideshow.js
   Automatic 16:9 product slideshow. Data: inuvet-produkt-slideshow-data.js
   Order: logo intro · brand hero · benefits · products · vet practice trio.
   Per product: 1 packshot scene + 1 scene per dosage form (video or animated image).
   Brand scenes use Lottie animations (lottie-web, svg renderer).
   URL params: ?cat=stress,blase (filter, hides brand scenes) · ?start=hepax-produktfamilie
               ?speed=1.5 · ?brand=0 (products only)
               ?render=1 – frame-by-frame mode for the MP4 export (inuvet-produkt-slideshow-export.mjs):
               virtual clock, all CSS animations / videos / Lotties are seeked per frame, ends after fade-to-white
   Keys: → / ← next / previous · Space pause · F fullscreen
   ═══════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const speed = Math.max(0.25, parseFloat(params.get('speed')) || 1);
  const catFilter = (params.get('cat') || '').split(',').filter(Boolean);
  const withBrand = !catFilter.length && params.get('brand') !== '0';
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
    intro: 4200,         // Logo groß auf Weiß
    hero: 8000,          // „Natürlich gesunde Tiere“
    trio: 9000,          // Drei Vorteile / drei Illustrationen
    packshot: 7000,      // Packshot + Kurzbeschreibung
    solo: 8500,          // Packshot, wenn keine Darreichungsform hinterlegt ist
    form: 6500,          // Darreichungsform als Bild
    formMin: 6000,       // Darreichungsform als Video: mindestens …
    formMax: 11000,      // … höchstens (Video läuft in Schleife)
    curtain: 620,        // Szenenwechsel: Zeit bis die Fläche deckt
    fadeOut: 1600,       // Ende: Ausblenden auf Weiß, danach beginnt das Intro
  };

  /* ─── Marken-Szenen: Texte wie auf inuvet.com, Animationen aus dem Styleguide ─── */
  const LOTTIE = '../assets/brands/inuvet/lotties/';
  const BRAND = {
    hero: {
      label: 'Inuvet',
      lottie: 'Inuvet_Alena_Animation_Produkt-Tierarzt_5x4.json',
      headline: 'Natürlich gesunde Tiere',
      body: 'Tierärztlich entwickelte Nahrungsergänzung mit pflanzlichen Inhaltsstoffen — für Hunde, Katzen und Kleintiere. Entdecke Produkte, die auf den Geschmack deines Tieres optimiert sind.',
    },
    benefits: {
      label: 'Darum Inuvet',
      variant: 'icons',
      items: [
        { lottie: 'Inuvet_Icon_Animation_Tierarztpraxis_1x1.json', title: 'Beste Expertise', text: 'Inuvet Produkte gibt es exklusiv in deiner Tierarztpraxis' },
        { lottie: 'Inuvet_Icon_Animation_Pfoten_1x1.json', title: 'Für die Langzeitgabe', text: 'Mit natürlichen Inhaltsstoffen, die deinem Tier gut tun' },
        { lottie: 'Inuvet_Icon_Animation_Schild_1x1.json', title: 'Immer gut unterstützt', text: 'Mit Produkten, die auf den Geschmack der Patienten optimiert sind.' },
      ],
    },
    practice: {
      label: 'Für Tierarztpraxen',
      variant: 'illus',
      items: [
        { lottie: 'Inuvet_Alena_Animation_Inhaltsstoffe_1x1.json', title: 'Grüne Pfoten', text: 'Verpackungen mit 85 % Recyclingpapier, kurze Lieferketten und natürliche Inhaltsstoffe.' },
        { lottie: 'Inuvet_Alena_Animation_Tierarzt-Katze-Produkt_1x1.json', title: 'Nur bei euch', text: 'Inuvet-Produkte sind nicht im Internet erhältlich, nur in eurer Praxis. Eure Beratung wird entlohnt!' },
        { lottie: 'Inuvet_Alena_Animation_Weltweit_1x1.json', title: 'Verträglich, beliebt und hoch konzentriert', text: 'Studienbasierte Phytotherapie. Bei über 20.000 Tierärzt*innen im Einsatz.' },
      ],
    },
  };
  // Marken-Szenen tragen ein Pseudo-Produkt (Kategorie „brand“ = Inuvet-Grün)
  const brandP = (key, label) => ({ handle: `inuvet-${key}`, cat: 'brand', category: label, title: '', forms: [] });

  const products = (window.SLIDESHOW_PRODUCTS || [])
    .filter((p) => !catFilter.length || catFilter.includes(p.cat));

  const scenes = [];
  if (withBrand) {
    // soft: Intro-Slides wechseln per Überblendung, ohne Farbfläche (auch zum ersten Produkt)
    scenes.push({ kind: 'intro', p: brandP('intro', ''), pi: -1, step: 0, soft: true });
    scenes.push({ kind: 'hero', p: brandP('hero', BRAND.hero.label), pi: -2, step: 0, data: BRAND.hero, soft: true });
    scenes.push({ kind: 'trio', p: brandP('vorteile', BRAND.benefits.label), pi: -3, step: 0, data: BRAND.benefits, soft: true });
  }
  products.forEach((p, pi) => {
    scenes.push({ kind: 'packshot', p, pi, step: 0 });
    p.forms.forEach((f, fi) => scenes.push({ kind: 'form', p, pi, f, fi, step: fi + 1 }));
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
    sceneHost.textContent = 'Keine Produkte gefunden.';
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
    else if (scene.kind === 'form' && scene.f.video) {
      const v = document.createElement('video');
      v.preload = 'auto';
      v.src = scene.f.video;
    }
    else if (scene.kind === 'form' && !scene.f.video) new Image().src = scene.f.image;
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
    if (f.video) {
      video = el('video');
      Object.assign(video, { muted: true, loop: true, playsInline: true, preload: 'auto', poster: f.image });
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
    return { scene, video, duration: TIMING.form };
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

  const BUILD = { packshot: buildPackshot, form: buildForm, intro: buildIntro, hero: buildHero, trio: buildTrio };

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

    const total = s.p.forms.length + 1;
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
      if (old.video) old.video.pause();
      old.frozen = true;
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
        const d = (v.duration * 1000) / speed;
        const ms = Number.isFinite(d)
          ? Math.min(Math.max(d, TIMING.formMin / speed), TIMING.formMax / speed)
          : duration;
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
    btnPause.textContent = paused ? 'Fortsetzen' : 'Pause';
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
        waits.push(seekVideo(b.video, local % b.video.duration));
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
