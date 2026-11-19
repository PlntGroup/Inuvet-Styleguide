/* ═══════════════════════════════════════════════════════
   inuvet-produkt-slideshow.js
   Automatic 16:9 product slideshow. Data: inuvet-produkt-slideshow-data.js
   Per product: 1 packshot scene + 1 scene per dosage form (video or animated image).
   URL params: ?cat=stress,blase (filter) · ?start=hepax-produktfamilie · ?speed=1.5
   Keys: → / ← next / previous · Space pause · F fullscreen
   ═══════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const speed = Math.max(0.25, parseFloat(params.get('speed')) || 1);
  const catFilter = (params.get('cat') || '').split(',').filter(Boolean);

  const TIMING = {
    packshot: 7000,      // Packshot + Kurzbeschreibung
    solo: 8500,          // Packshot, wenn keine Darreichungsform hinterlegt ist
    form: 6500,          // Darreichungsform als Bild
    formMin: 6000,       // Darreichungsform als Video: mindestens …
    formMax: 11000,      // … höchstens (Video läuft in Schleife)
    curtain: 620,        // Produktwechsel: Zeit bis die Fläche deckt
  };

  const products = (window.SLIDESHOW_PRODUCTS || [])
    .filter((p) => !catFilter.length || catFilter.includes(p.cat));

  const scenes = [];
  products.forEach((p, pi) => {
    scenes.push({ kind: 'packshot', p, pi, step: 0 });
    p.forms.forEach((f, fi) => scenes.push({ kind: 'form', p, pi, f, fi, step: fi + 1 }));
  });

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
    else if (!scene.f.video) new Image().src = scene.f.image;
  }

  /* ─── Szenen bauen ─── */
  function buildPackshot(s) {
    const { p } = s;
    const scene = el('section', 'show__scene --packshot');
    scene.dataset.cat = p.cat;

    const copy = el('div', 'show__copy flow');
    const eyebrow = el('p', 'label-caps show__eyebrow');
    eyebrow.append(el('span', '', p.category));
    copy.append(rise(eyebrow, 0));
    copy.append(rise(el('h1', 'show__name', p.title), 1));
    if (p.short) copy.append(rise(el('p', 'show__lead', p.short), 2));
    if (p.forms.length) {
      const tags = el('div', 'show__tags');
      p.forms.forEach((f) => tags.append(el('span', 'badge', f.name)));
      copy.append(rise(tags, 3));
    }

    const media = el('figure', 'show__media --still');
    const img = el('img');
    img.src = p.packshot;
    img.alt = `${p.title} – Packshot`;
    media.append(img);

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
      media.append(video);
    } else {
      media.classList.add('--animated');
      const img = el('img');
      img.src = f.image;
      img.alt = `${p.title} ${f.name}`;
      media.append(img);
    }

    const copy = el('div', 'show__copy flow');
    const eyebrow = el('p', 'label-caps show__eyebrow');
    eyebrow.append(
      el('span', '', f.name),
      el('span', '', `${fi + 1} / ${p.forms.length}`),
    );
    copy.append(rise(eyebrow, 0));
    copy.append(rise(el('h2', 'show__name --sub', p.title), 1));
    copy.append(rise(el('p', 'show__caption', f.caption), 2));

    scene.append(media, copy);
    return { scene, video, duration: TIMING.form };
  }

  /* ─── Leiste ─── */
  function swapText(node, text) {
    if (node.textContent === text) return;
    if (!node.textContent) { node.textContent = text; return; }
    node.classList.add('--out');
    setTimeout(() => {
      node.textContent = text;
      node.classList.remove('--out');
    }, 250);
  }

  function updateBar(s) {
    stage.dataset.cat = s.p.cat;
    swapText(barCatLabel, s.p.category);
    swapText(barProduct, s.p.title);
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
  let index = 0;
  let current = null;       // { scene, video }
  let timer = null;
  let remaining = 0;
  let startedAt = 0;
  let paused = false;

  function schedule(ms) {
    clearTimeout(timer);
    remaining = ms;
    startedAt = performance.now();
    if (!paused) timer = setTimeout(next, ms);
  }

  function mount(i) {
    const s = scenes[i];
    const built = s.kind === 'packshot' ? buildPackshot(s) : buildForm(s);
    let duration = built.duration / speed;

    // Alte Szene ausblenden und danach entfernen
    if (current) {
      const old = current;
      old.scene.classList.remove('--entering');
      old.scene.classList.add('--leaving');
      if (old.video) old.video.pause();
      setTimeout(() => old.scene.remove(), 1200);
    }

    built.scene.style.setProperty('--scene-dur', `${duration}ms`);
    built.scene.classList.add('--entering');
    sceneHost.append(built.scene);
    current = built;
    updateBar(s);

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
      if (!paused) v.play().catch(() => {});
      if (v.readyState >= 1) begin();
      else {
        v.addEventListener('loadedmetadata', begin, { once: true });
        v.addEventListener('error', () => start(duration), { once: true });
      }
    } else {
      start(duration);
    }

    preload(scenes[(i + 1) % scenes.length]);
  }

  let switching = false;    // Produktwechsel läuft (Fläche deckt gerade)

  function go(i) {
    if (switching) return;
    const prevScene = scenes[index];
    index = (i + scenes.length) % scenes.length;
    const nextScene = scenes[index];

    // Szenenwechsel: Fläche deckt, darunter Szene tauschen.
    // Produktwechsel = volle Kategoriefarbe, innerhalb des Produkts = helle Kategoriefarbe.
    if (current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      clearTimeout(timer);
      switching = true;
      curtain.dataset.cat = nextScene.p.cat;
      curtain.classList.toggle('--light', prevScene.pi === nextScene.pi);
      curtain.classList.remove('--run');
      void curtain.offsetWidth;
      curtain.classList.add('--run');
      setTimeout(() => {
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
      clearTimeout(timer);
      remaining -= performance.now() - startedAt;
      if (current && current.video) current.video.pause();
    } else {
      startedAt = performance.now();
      timer = setTimeout(next, Math.max(remaining, 300));
      if (current && current.video) current.video.play().catch(() => {});
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
  document.addEventListener('mousemove', wake);
  wake();

  /* ─── Start ─── */
  const startHandle = params.get('start');
  const startIndex = startHandle ? Math.max(0, scenes.findIndex((s) => s.p.handle === startHandle)) : 0;
  barCat.hidden = false;
  index = startIndex;
  mount(startIndex);
})();
