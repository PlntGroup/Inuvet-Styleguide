/* ═══════════════════════════════════════════════════════
   inuvet-produkt-slideshow-export.mjs
   Renders Inuvet-Produkt-Slideshow-Inhaltsstoffe.html frame by frame into an MP4 (deterministic, no dropped frames).
   Headless Google Chrome (DevTools Protocol) → PNG per frame → ffmpeg (libx264 or ProRes).

   Usage (from Inuvet-Styleguide/):
     node pages/inuvet-produkt-slideshow-export.mjs [options]
   Options:
     --url=<page url>        default: file:// path of the slideshow (works without a server)
     --params=<query>        extra slideshow params, e.g. "start=hepax-produktfamilie" or "cat=blase&brand=0"
     --page=inhaltsstoffe    page suffix, default: inhaltsstoffe → Inuvet-Produkt-Slideshow-Inhaltsstoffe.html
                             (ingredients and practice dividers; the short version without them was removed)
     --fps=30                frame rate (30 or 60)
     --width=1920 --height=1080
     --codec=h264|prores     h264: libx264 CRF 14 (default) · prores: ProRes 422 HQ (.mov, master quality)
     --max-seconds=<n>       stop after n seconds (test clips)
     --out=<file>            default: slideshow-media/export/Inuvet-Produkt-Slideshow_Inhaltsstoffe_<w>x<h>_<fps>p.<ext>
   Requires: Google Chrome (/Applications), ffmpeg (Homebrew), Node ≥ 22 (built-in WebSocket).
   Local media (packshots/MP4s) must be in slideshow-media/ – see inuvet-produkt-slideshow-data.js.
   ═══════════════════════════════════════════════════════ */
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, renameSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const arg = (name, def) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : def;
};

const fps = Number(arg('fps', 30));
const width = Number(arg('width', 1920));
const height = Number(arg('height', 1080));
const codec = arg('codec', 'h264');
const maxSeconds = Number(arg('max-seconds', 0));
const extra = arg('params', '');
const page = arg('page', 'inhaltsstoffe');
const base = arg('url', pathToFileURL(path.join(here, `Inuvet-Produkt-Slideshow${page ? `-${page[0].toUpperCase()}${page.slice(1)}` : ''}.html`)).href);
const url = `${base}${base.includes('?') ? '&' : '?'}render=1${extra ? `&${extra}` : ''}`;
const ext = codec === 'prores' ? 'mov' : 'mp4';
const edition = (extra.match(/(?:^|&)edition=([\w-]+)/) || [])[1] || page;
const out = path.resolve(arg('out', path.join(root, 'slideshow-media', 'export',
  `Inuvet-Produkt-Slideshow${edition ? `_${edition[0].toUpperCase()}${edition.slice(1)}` : ''}_${width}x${height}_${fps}p.${ext}`)));
mkdirSync(path.dirname(out), { recursive: true });

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FFMPEG = '/opt/homebrew/bin/ffmpeg';
const PORT = 9300 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(path.join(tmpdir(), 'slideshow-export-'));

const log = (...a) => process.stderr.write(`${a.join(' ')}\n`);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ─── Chrome starten ─── */
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  `--window-size=${width},${height}`, '--hide-scrollbars', '--mute-audio', '--force-device-scale-factor=1',
  '--autoplay-policy=no-user-gesture-required', '--allow-file-access-from-files',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding', 'about:blank',
], { stdio: ['ignore', 'ignore', 'ignore'] });

let target = null;
for (let i = 0; i < 100 && !target; i++) {
  await wait(100);
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    target = list.find((t) => t.type === 'page');
  } catch { /* Chrome startet noch */ }
}
if (!target) throw new Error('Chrome DevTools nicht erreichbar');

/* ─── DevTools-Protokoll ─── */
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
let seq = 0;
const calls = new Map();
const events = [];
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && calls.has(msg.id)) {
    const { resolve, reject } = calls.get(msg.id);
    calls.delete(msg.id);
    if (msg.error) reject(new Error(msg.error.message)); else resolve(msg.result);
  } else if (msg.method) events.push(msg);
};
const cdp = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++seq;
  calls.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const r = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};

await cdp('Page.enable');
await cdp('Runtime.enable');
await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
await cdp('Page.navigate', { url });
for (let i = 0; i < 300; i++) {
  await wait(100);
  if (events.some((e) => e.method === 'Page.loadEventFired')) break;
}
for (let i = 0; i < 100; i++) {
  if (await evaluate('!!window.__render')) break;
  await wait(100);
}
const info = await evaluate('window.__render.ready()');
log(`Seite bereit: ${info.scenes} Szenen · Schriften: ${[...new Set(info.fonts)].join(', ') || '–'}`);
log(`Export → ${out}`);

/* ─── ffmpeg ─── */
const enc = codec === 'prores'
  ? ['-c:v', 'prores_ks', '-profile:v', '3', '-pix_fmt', 'yuv422p10le']
  : ['-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-tune', 'animation', '-movflags', '+faststart'];
// Während des Renderns unter Zwischennamen schreiben: erst am Ende ist die Datei abspielbar (moov-Atom)
const partial = path.join(path.dirname(out), `.${path.basename(out)}.rendering`);
const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
  ...enc, '-r', String(fps), '-f', codec === 'prores' ? 'mov' : 'mp4', partial], { stdio: ['pipe', 'inherit', 'inherit'] });
const ffDone = new Promise((r) => ff.on('close', r));
const write = (buf) => new Promise((r) => (ff.stdin.write(buf) ? r() : ff.stdin.once('drain', r)));

/* ─── Bild für Bild ─── */
const started = Date.now();
let frame = 0;
let doneAt = -1;
const tail = Math.round(fps * 0.5); // nach dem Fade 0,5 s Weiß halten
for (;;) {
  const t = (frame * 1000) / fps;
  const state = await evaluate(`window.__render.frame(${t})`);
  const shot = await cdp('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true, captureBeyondViewport: false });
  await write(Buffer.from(shot.data, 'base64'));
  frame++;
  if (state.done && doneAt < 0) doneAt = frame;
  if (doneAt >= 0 && frame >= doneAt + tail) break;
  if (maxSeconds && t >= maxSeconds * 1000) break;
  if (frame % (fps * 5) === 0) {
    const secs = (Date.now() - started) / 1000;
    log(`${(t / 1000).toFixed(0).padStart(4)} s Video · ${frame} Bilder · ${(frame / secs).toFixed(1)} Bilder/s`);
  }
}
ff.stdin.end();
await ffDone;
renameSync(partial, out);
ws.close();
chrome.kill();
await wait(300);
rmSync(profile, { recursive: true, force: true });
log(`Fertig: ${frame} Bilder (${(frame / fps).toFixed(1)} s) in ${((Date.now() - started) / 60000).toFixed(1)} min → ${out}`);
