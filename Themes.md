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

**JavaScript ist anders:** `planet-brands.js` im Styleguide ist teils Mockup (z. B. ein Schein-Warenkorb). Im Theme ist `planet-brands.js` ein eigenes Bundle mit der echten Shop-Logik (Cart AJAX API, Suche, Apps). Aus dem Styleguide nur Blöcke mit `[PORTABEL → Theme]` übernehmen, **nie die ganze Datei kopieren** — das legt Warenkorb und Suche lahm. Gemeinsames Theme-JS wird wie die Sections synchron gehalten (§4b).

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

- **Git:** nur Branch `staging`. Der GitHub-Sync lädt `staging` in den unveröffentlichten Entwurf. Live (`master`/`main`) nur nach Freigabe durch Micha.
- **Entwürfe nie veröffentlichen.**
- **Theme-Editor:** Änderungen im Editor committet Shopify als „Update from Shopify“ nach `staging`. Vor jeder Arbeit `git pull --ff-only origin staging`, vor jedem Push `git fetch` und prüfen, ob dieselben Dateien betroffen sind.
- **Admin-Daten** (Produkte, Metafields, Metaobjects, Menüs, Dateien) gelten sofort auch für Live. Vor jeder Änderung sagen, was sich ändert; erst lesen, dann schreiben.
- **Texte, Preise, Menütitel** gehören in den Admin, nie fest ins Theme.

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
- **Hero V1–V3** (`section-type*.liquid`, D.3): Bild, Lottie oder Video. V1 Bild + Text, V2 Vollbild mit Box (`--v3`), V3 Text auf Medium (`--v4`). Breite „Satzspiegel“ über `--contained`.
- **Anker und Trenner:** Inhalts-Sections haben `anchor_id`. Trenner `section-divider` (A.6).
- **Collection** (E.3), **Produkt-Collection** (`featured-collection`), **Warenkorb-Drawer und -Seite** (E.4/E.9, Cart AJAX API), **Suche** (E.7), **Blog** (E.8), **Utility-Seiten** (E.9).
- **Kundenkonten** (E.6): je Theme verschieden — klassische Konten (Inuvet) oder Shopify-Kundenkonten. Steht im Theme.
- **PDP** (E.2): Kaufblock mit Typ-Selektor und Größen, Akkordeon, Galerie.
  - Galerie-Captions: Product-Metafield `custom.pdp_gallery_captions` (JSON `[{ "id", "caption", "author" }]`).
  - Tageskosten: nur Variant-Metafields `custom.daily_cost_amount` / `custom.daily_cost_note`.
- **Icons:** Material-SVG-Sprite (`snippets/ui-icon-sprite.liquid`, Snippet `icon`), kein Google-Icon-Font.
- **JS:** Blöcke aus `planet-brands.js` mit `[PORTABEL → Theme]`, kein Inline-Script.
- **Sprache:** Texte nur über Locales (`{{ 'key' | t }}`).

### 4b. Gemeinsame Sections und JS synchron halten

Sections, Snippets und `planet-brands.js`, die es in mehreren Themes gibt (Header, Warenkorb, Suche, PDP, Collection …), sollen gleich bleiben. **Inuvet (`inuvet-theme`) ist die Referenz.**

- Unterschiede zwischen Marken möglichst über **Einstellungen** (Theme-Einstellungen, Section-Settings, Locales, Admin-Daten) lösen, nicht über eigenen Code.
- Eine Korrektur an einer gemeinsamen Section zuerst in Inuvet machen, dann in die anderen Themes übernehmen.
- Bewusste Abzweigungen (z. B. ManukaLind-Heroes, Campus-Webinare) im `CLAUDE.md` des Themes nennen. Dort nicht blind aus Inuvet kopieren.
- Pragmatisch: Wo eine Angleichung mehr kostet als sie bringt, bleibt die Abzweigung — aber dokumentiert.

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
