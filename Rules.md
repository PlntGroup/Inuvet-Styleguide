# Rules — Inuvet Styleguide

Verbindliche Arbeitsregeln für den Styleguide und `planet-brands`. Spec: [`Spec.md`](./Spec.md). Live: GitHub Pages von `main`.

Neue Regel hier eintragen (Spec in `Spec.md`) und nach `main` pushen.

---

## Git

- Dieses Repo: Push auf **`origin/main`** (GitHub Pages, https://plntgroup.github.io/Inuvet-Styleguide/). Feature-Branches sind nicht live.
- Nach dem Commit: auf `main` mergen, dann `git push origin main`.
- Shopify-Themes: **Design** nur `staging`, danach Pull Request. **IT** gibt frei und darf alle Branches. `staging` und `master`/`main` sind beide mit Shopify verknüpft.

## Sprache

Deutsch für Commits, Doku und Kommunikation. Dateiköpfe in `planet-brands.*`, `brand-*.css`, `sg-only.*` auf Englisch.

## Schichten

1. **System** — `planet-brands.css` / `planet-brands.js` (Inuvet-`:root`). Lebt hier; Themes übernehmen die Datei 1:1 und bearbeiten sie nicht.
2. **Haut** — `brand-{handle}.css`: nur Tokens (Farben, Schrift). Nie Tokens in `planet-brands.css` für eine neue Marke.
3. **Theme-Erweiterungen** — `theme-extras.css`, nur im jeweiligen Theme-Repo, nicht im Guide: markenspezifische Bausteine, die bewusst nicht ins System gehören (z. B. Galerie-Karten, Reviews.io). Nur Tokens und Basis-Styles. Was generisch ist, kommt hierher ins System.
4. **Kühlschrank** — Store-Inhalte. Dateinamen nicht umbenennen.

Ladereihenfolge im Theme: `planet-brands.css` → `theme-extras.css` → `brand-{handle}.css`.

Themes sind markenweise getrennt. Der Guide darf Marken simulieren; ein Theme hat keine `data-brand`-Umschaltung.

## Assets (nur im Guide Ordner)

Shopify-`assets/` ist flach. Dateiname = Theme-Asset.

- `assets/planet/` — markenübergreifend (Material-UI, Social)
- `assets/brands/{handle}/` — Logo, `icons/`, `lotties/`, `images/`

`Inuvet_Icon_*`: Inuvet + Campus (gleiche Akzentfarbe). `Icon_Tier_*`, Lotties, Bilder: Inuvet. Planimol, ManukaLind, Byox, EQX: eigener Ordner.

## Kein neues CSS ohne Design-OK

Zuerst bestehende Klasse in `planet-brands.css`. Fehlt etwas: fragen. Keine neuen Tokens, Utilities oder Komponenten ohne Zustimmung von Micha. Inline-Styles = dasselbe Verbot.

Für die Shop-Themes gilt dasselbe: Gestaltung kommt von hier. Generisches wird hier ergänzt und ins Theme kopiert, nur bewusst Markenspezifisches landet in `theme-extras.css`. Details: [`Themes.md`](./Themes.md) §1.

Text-Rhythmus Überschrift↔Absatz: immer `.flow`.

Weiterentwicklung der Shops: Styleguide und Theme-`Rules.md` gelten immer. Design (Micha) arbeitet parallel im jeweiligen `staging`-Theme weiter.
