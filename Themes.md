# Shop-Themes — gemeinsame Regeln

Gilt für alle Shopify-Themes, die auf diesem Styleguide aufbauen. Was nur eine Marke betrifft, steht im jeweiligen Theme (`README.md` für Menschen, `CLAUDE.md` für Agenten).

| Theme-Repo | Marke | Store |
|---|---|---|
| `inuvet-theme` | Inuvet (Shop für Tierarztpraxen) | `2f2346-3c.myshopify.com` |
| `inuvet-campus-theme` | Inuvet Campus | `inucampus.myshopify.com` |
| `planimol-theme` | Planimol | `planimol-shop.myshopify.com` |
| `ManukaLind-theme` | ManukaLind | `manuka-lind.myshopify.com` |
| `vetalita-theme` | Vetalità | `vetalit.myshopify.com` |

Ein Theme = eine Marke. Kein Marken-Umschalter, kein `data-brand` im Theme.

---

## 1. Die CSS-Regel: Der Styleguide gilt

Das wichtigste Prinzip: **Gestaltung kommt aus dem Styleguide.** Themes ergänzen nur, was wirklich nur eine Marke betrifft. So bleibt das CSS schlank und alle Shops sehen gleich sauber aus.

### Drei Dateien, drei Rollen

| Datei | Rolle | Wer ändert sie wo |
|---|---|---|
| `planet-brands.css` | **System**: Tokens, Komponenten, Layout | Nur hier im Styleguide. Im Theme ist sie eine 1:1-Kopie und wird **nie bearbeitet** |
| `brand-{marke}.css` | **Haut**: nur Tokens (Farben, Schrift) auf `:root`, dazu höchstens die Zuordnung der Kategorie-Farben zu `[data-cat]` | Token-Werte kommen aus dem Styleguide (dort unter `html[data-brand]` zur Simulation, mit Overrides). Im Theme keine Komponentenregeln. Inuvet und Vetalità haben keine (Inuvet ist der Standard) |
| `theme-extras.css` | **Erweiterungen**: markenspezifische Bausteine | Nur im Theme-Repo. Klein halten |

Ladereihenfolge im Theme (`layout/theme.liquid`): `critical.css` → `planet-brands.css` → `theme-extras.css` → `brand-{marke}.css`. `critical.css` ist ebenfalls in allen Themes gleich.

**JavaScript ist anders:** `planet-brands.js` im Styleguide ist teils Mockup (z. B. ein Schein-Warenkorb). Im Theme ist `planet-brands.js` ein eigenes Bundle mit der echten Shop-Logik (Cart AJAX API, Suche, Apps). Aus dem Styleguide nur Blöcke mit `[PORTABEL → Theme]` übernehmen, **nie die ganze Datei kopieren** — das legt Warenkorb und Suche lahm. `planet-brands.js` ist markeneigen (§4b); gute Funktionen aus anderen Themes von Hand übernehmen.

### Bevor neues CSS entsteht — in dieser Reihenfolge

1. **Vorhandenes nutzen.** Im Styleguide (`styleguide.html`, `planet-brands.css`) nach einer passenden Klasse oder Komponente suchen. Die meisten Wünsche lassen sich damit lösen.
2. **Generisches in den Styleguide.** Fehlt etwas, das auch andere Marken brauchen könnten: im Styleguide ergänzen und dokumentieren, dann `planet-brands.css` in alle Themes kopieren. Nur mit Zustimmung von Micha (Design).
3. **Nur Markenspezifisches in `theme-extras.css`.** Und nur, wenn es bewusst nicht ins System gehört (z. B. App-Anpassungen wie Reviews.io, markeneigene Galerie-Karten). Auch hier: Zustimmung von Micha.

### Nicht erlaubt

- `planet-brands.css` im Theme bearbeiten — auch keine „kleine Korrektur“. Korrekturen gehören in den Styleguide.
- System-Regeln in `theme-extras.css` kopieren oder überschreiben, um ein anderes Aussehen zu erzwingen.
- Feste Werte (px, rem, Farben, `z-index`-Zahlen). Immer Tokens: `--base`, `--half-module`, `--module`, `--gutter`, `--section-gap`, Farb- und Schrift-Tokens.
- Inline-Styles und Einmal-CSS.

### Abgleich

`planet-brands.css` im Theme muss mit dem Styleguide identisch sein. Prüfen:

```
diff ../Inuvet-Styleguide/planet-brands.css assets/planet-brands.css
```

Ist der Diff nicht leer, ist etwas im Theme gelandet, das in den Styleguide gehört.

### Genehmigte Ausnahmen

- **Campus-Registrierung** (`.campus-registration` in `theme-extras.css`): feste Breite 460 px, Rundung 30 px, ein Grauwert und ein `!important` — ausdrücklich beauftragte Übernahme der Legacy-Form. Kein Vorbild für neue Bausteine.

---

## 2. Arbeitsweise

- **Git:** gearbeitet wird auf `staging`. Der GitHub-Sync lädt `staging` in den unveröffentlichten Entwurf. `master`/`main` nur nach ausdrücklicher Freigabe durch Micha.
- **Entwürfe nie veröffentlichen.**
- **Theme-Editor:** Änderungen im Editor committet Shopify als „Update from Shopify“ nach `staging`. Vor jeder Arbeit `git pull --ff-only origin staging`, vor jedem Push `git fetch` und prüfen, ob dieselben Dateien betroffen sind.
- **Admin-Daten** (Produkte, Metafields, Metaobjects, Menüs, Dateien) gelten sofort auch für Live. Vor jeder Änderung sagen, was sich ändert; erst lesen, dann schreiben.
- **Texte, Preise, Menütitel** gehören in den Admin, nie fest ins Theme.

### Livestellen (staging → master)

Nur, wo das Live-Theme mit `master` verbunden ist (derzeit Planimol), und nur mit ausdrücklicher Freigabe von Micha.

1. **Sicherung:** Live-Theme im Admin duplizieren („Sicherung Live JJJJ-MM-TT …“).
2. **master prüfen:** `git log origin/staging..origin/master` — eigene Commits auf master müssen in `staging` enthalten oder bewusst ersetzt sein.
3. **Code übernehmen:** alles aus `staging` außer `templates/`, `sections/*-group.json` und `config/settings_data.json`. Diese Dateien schreibt der Live-Editor: Unterschiede ansehen, nur gewollte Keys übernehmen, `settings_data.json` von Live behalten. Unklare Werte mit Micha klären.
4. **Umbenannte oder gelöschte Sections** in drei Pushes: neue Dateien neben die alten → Vorlagen auf die neuen Typen → alte Dateien löschen. Shopify lehnt Vorlagen ab, die auf fehlende Sections zeigen. In der Zwischenzeit im Live-Editor nicht speichern.
5. **Nach jedem Push prüfen:** `shopify theme pull --only …` zeigt, was angekommen ist. Live-Seiten immer mit `?preview_theme_id=<Live-ID>` abrufen — ohne ID kann ein Vorschau-Cookie den Entwurf zeigen. Seiten mit Sicherung und Entwurf vergleichen (Liquid-Fehler, Sections).

---

## 3. Goldene Regeln

1. Alles über Tokens (`var(--…)`), keine Magic Numbers.
2. `border-radius: 0` — Ausnahmen nur `.badge.--pill` und Avatare.
3. Kein `!important`. Modifier als `.--modifier`.
4. Abstand Überschrift ↔ Text nur über `.flow`, nie über `gap` oder einzelne Margins.
5. Linien sparsam, Weißraum trennt.
6. Section mit eigenem horizontalen Padding: Schema-`"class"` enthält `shopify-section--own-measure` (sonst doppelter Seitenrand).

---

## 4. Theme-Aufbau (Kurzfassung)

Ausführlich steht jede Komponente mit „Shopify-Mapping“ in `styleguide.html`.

- **Section-Stack (A.7):** jede Inhalts-Section hat `pad_top` (Standard an) / `pad_bottom` (Standard aus) über Snippet `section-stack-class`. Seiten-Mains (Kategorie, Seite, Blog, Suche, Warenkorb, 404) unten ebenfalls an. Hero V2/V3 (Vollbild) nutzen Margin statt Padding.
- **Hero V1–V3** (`hero-v1/v2/v3.liquid`, D.3): Bild, Lottie oder Video. V1 Bild + Text (CSS `--v1`/`--v2`), V2 Vollbild mit Box (CSS `--v3`), V3 Text auf Medium (CSS `--v4`). Die CSS-Klassen und die Schema-Klasse `shopify-section--section-type*` behalten ihre alten Namen. Breite „Satzspiegel“ über `--contained`.
- **Anker und Trenner:** Inhalts-Sections haben `anchor_id`. Trenner `section-divider` (A.6).
- **Collection** (E.3), **Produkt-Collection** (`featured-collection`), **Warenkorb-Drawer und -Seite** (E.4/E.9, Cart AJAX API), **Suche** (E.7), **Blog** (E.8), **Utility-Seiten** (E.9).
- **Kundenkonten** (E.6): je Theme verschieden — klassische Konten (Inuvet) oder Shopify-Kundenkonten. Steht im Theme.
- **PDP** (E.2): Kaufblock mit Typ-Selektor und Größen, Akkordeon, Galerie.
  - Galerie-Captions: Product-Metafield `custom.pdp_gallery_captions` (JSON `[{ "id", "caption", "author" }]`).
  - Tageskosten: nur Variant-Metafields `custom.daily_cost_amount` / `custom.daily_cost_note`.
- **Icons:** Material-SVG-Sprite (`snippets/ui-icon-sprite.liquid`, Snippet `icon`), kein Google-Icon-Font.
- **JS:** Blöcke aus `planet-brands.js` mit `[PORTABEL → Theme]`, kein Inline-Script.
- **Sprache:** Texte nur über Locales (`{{ 'key' | t }}`).

### 4b. Gemeinsamer Kern und markeneigene Dateien

Liquid-Dateien gibt es in zwei Klassen.

**Gemeinsamer Kern — in allen Themes identisch.** Kleine, markenneutrale Bausteine ohne Shop-Sonderlogik (kein B2B, kein Naturalrabatt, kein Bewertungsanbieter). Unterschiede nur über Section-Einstellungen, Locales und Admin-Daten, nie über Code. Eine Verbesserung wird in einem Theme gebaut und dann 1:1 in alle kopiert.

| Art | Dateien |
|---|---|
| Snippets | `icon`, `ui-icon-sprite`, `lottie-player`, `media-video`, `section-type-media`, `section-heading`, `section-anchor-attr`, `section-stack-class`, `pdp-accordion`, `pdp-accordion-table`, `social-proof`, `brand-logo`, `brand-favicon` |
| Sections | `hero-v1`, `hero-v2`, `hero-v3`, `tiles`, `benefits`, `praxis`, `faq`, `pdp-faq`, `featured-collection`, `testimonials`, `animation-slider`, `story-bar`, `key-ingredients`, `section-divider`, `blog`, `article`, `collections`, `page`, `404` |

Dateinamen seit 08.11.2026 (vorher → jetzt): `section-type` → `hero-v1`, `section-type-v3` → `hero-v2`, `section-type-v4` → `hero-v3`, `content-tiles` → `tiles`, `indication-slider` → `animation-slider`, `story-iconslider` → `story-bar`. Editor-Namen: „Hero V1 – Bild + Text“, „Hero V2 – Vollbild + Box“, „Hero V3 – Text auf Bild“, „Kacheln – Inhalt/Produkte/Kategorien“, „FAQ – frei/Produkt“, „Story-Leiste“, „Slideshow mit Animation“ (max. 25 Zeichen, Shopify-Grenze).

Prüfen: `for f in …; do cmp ../inuvet-theme/sections/$f.liquid sections/$f.liquid; done` — Kern-Dateien dürfen nicht abweichen. (Stand 08.11.2026: zusammengeführt, außer `brand-logo`/`brand-favicon` – die folgen, sobald die Logos in allen Themes in den Einstellungen gepflegt sind.)

**Markeneigen — bewusst verschieden.** Hier unterscheiden sich die Marken wirklich (B2B-Zugang, Kundenkonten, Freigabe, Naturalrabatt, Rabatt-Staffel, Kurszugang, Galerie-Karten, Webinare, Bewertungsanbieter). Jede Marke besitzt ihre Fassung.

| Art | Dateien |
|---|---|
| Sections | `header`, `cart`, `cart-drawer`, `cart-recommendations`, `search`, `search-overlay`, `product`, `main-collection`, Kundenkonto-Sections, Bewertungs-Sections (`testimonials-reviewsio`, `testimonials-judgeme`) und alle Sections, die es nur in einem Theme gibt |
| Snippets | `card-product`, `cart-drawer-item`, `cart-recommendation-item`, `announcement-item`, `customer-access` und alle markeneigenen Snippets |
| JS | `planet-brands.js` (Theme-Bundle) |

- Markeneigene Dateien **nie blind aus einem anderen Theme kopieren**. Gute Lösungen von Hand übernehmen, wenn sie passen.
- Kern-Dateien enthalten keine Marken-Sonderlogik. Braucht eine Marke im Kern etwas Eigenes, wird es eine Section-Einstellung (für alle sinnvoll) — sonst gehört die Datei nicht mehr in den Kern.
- Wiederholt sich derselbe Fehler in einer markeneigenen Datei in mehreren Themes, kann sie später in den Kern wandern (dann mit kleinen theme-eigenen Snippets für die Unterschiede).

---

## 5. Produkt-Modell

| Styleguide | Shopify |
|---|---|
| Produktfamilie | Product |
| Darreichungsform (Tabletten/Pulver) | Variant-Option 1 → `.pdp__type-selector` |
| Größe | Variant-Option 2 → `.choice-box` |
| Tierart je Darreichungsform | Variant-Metafield `custom.geeignet_fuer` |
| Kategorie/Indikation | Collection-Handle = Farb-Token (`data-cat`). Produkt: Tag oder `custom.kategorie` |
| Sale | Vergleichspreis an der Variante → Label `.badge.--sale` (Text aus Locale `products.badge_sale`) |

---

## 6. Inhalte im Admin (markenneutrale Metaobjects)

Gleiche Typen in jedem Store, eigene Einträge je Marke. Storefront-Zugriff `PUBLIC_READ`, merchant-owned anlegen.

| Anzeigename | Typ | Felder | Section |
|---|---|---|---|
| Shop-Benefit | `shop_benefit` | `headline` · `body` · `lottie_file` · `lottie_asset` | `benefits` |
| Praxis-Vorteil | `shop_praxis` | wie Shop-Benefit | `praxis` |
| Testimonial | `brand_testimonial` | `quote` · `name` · `role` · `avatar` | `testimonials` |
| Inhaltsstoff | `ingredient` | `name` · `latin` · `summary` · `image` (5:4) | `key-ingredients` (über `custom.key_ingredients`) |
| FAQ-Eintrag | `faq_item` | `question` · `answer` | `pdp-faq` (über `custom.faq`) |
| Social Proof | `social_proof` | `name` · `count` · `avatar_1` · `avatar_2` | Fallback der PDP |

Lotties liegen unter Inhalt → Dateien; Theme-Assets sind nur Fallback.

---

## 7. Naturalrabatt (nur Inuvet)

Berechnung über eine Shopify Function (Cart Transform), nicht im Theme. Das Theme liefert nur die Anzeige (`.nr-widget`, `.cart-item__tier-hint`, Gratis-Badge), abschaltbar über Theme-Einstellungen. In anderen Marken aus.

---

## 8. Technik

- Commits auf Deutsch, Format `feat:` / `fix:` / `refactor:` / `docs:`.
- Theme Check beachten: Sections brauchen `{% schema %}`, Snippets `{% doc %}`.
- Schema: Padding-Einstellungen (`pad_top`, `pad_bottom`, `section_bg`) immer zuerst.
