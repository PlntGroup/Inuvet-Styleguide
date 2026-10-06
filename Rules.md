# Rules — Inuvet Styleguide

Verbindliche Arbeitsregeln für den Styleguide und das Design-System `planet-brands`. Gilt für alle, unabhängig vom Editor.

Spec (Schichten, Seiten, Goldene Regeln): [`CLAUDE.md`](./CLAUDE.md). Live: GitHub Pages von `main`.

Neue Konvention sofort **hier** (und in `CLAUDE.md`, wenn es Spec ist) eintragen und nach `main` pushen.

---

## Git

- Dieses Repo: Push auf **`origin/main`** (GitHub Pages, https://plntgroup.github.io/Inuvet-Styleguide/). Feature-Branches sind nicht live.
- Nach dem Commit: auf `main` mergen, dann `git push origin main`.
- Shopify-Themes (`inuvet-theme`, `inuvet-campus-theme`, künftige Marken): nur **`origin/staging`**. Nie `main`/`master` im Theme.

## Sprache

Deutsch für Commits, Doku und Kommunikation. Dateiköpfe in `planet-brands.*`, `brand-*.css`, `sg-only.*` auf Englisch.

## Drei Schichten

1. **System** — `planet-brands.css` / `planet-brands.js` (Inuvet-`:root`).
2. **Haut** — `brand-{handle}.css`. Nie Tokens in `planet-brands.css` für eine neue Marke.
3. **Kühlschrank** — Store-Inhalte. Dateinamen nicht umbenennen.

Themes sind markenweise getrennt. Der Guide darf Marken simulieren; ein Theme hat keine `data-brand`-Umschaltung.

## Assets (nur im Guide Ordner)

Shopify-`assets/` ist flach. Dateiname = Theme-Asset.

- `assets/planet/` — markenübergreifend (Material-UI, Social)
- `assets/brands/{handle}/` — Logo, `icons/`, `lotties/`, `images/`

`Inuvet_Icon_*`: Inuvet + Campus (gleiche Akzentfarbe). `Icon_Tier_*`, Lotties, Bilder: Inuvet. Planimol, Byox, EQX: eigener Ordner.

## Kein neues CSS ohne Design-OK

Zuerst bestehende Klasse in `planet-brands.css`. Fehlt etwas: fragen. Keine neuen Tokens, Utilities oder Komponenten ohne Zustimmung von Micha. Inline-Styles = dasselbe Verbot.

Text-Rhythmus Überschrift↔Absatz: immer `.flow`.
