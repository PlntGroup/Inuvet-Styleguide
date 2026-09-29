#!/usr/bin/env python3
"""
inuvet Print — Schritt 0: Schrift einbetten und vermessen

Drei Wege, die Hausschrift in ein Print-HTML zu bekommen — zwei scheitern:

  Typekit / Google Fonts per <link>   scheitert bei file://; Webfont-
                                      Projekte sind domaingebunden
  src: local('PostScriptName')        funktioniert nur dort, wo die
                                      Schrift installiert ist
  base64 im Dokument                  funktioniert überall, reproduzierbar

Dieses Skript geht den dritten Weg: Schrift auf die gebrauchten Zeichen
reduzieren, nach WOFF2 wandeln, base64 in eine fonts.css schreiben.

    python3 tools/print/fonts.py schnebel-regular.otf schnebel-bold.otf \\
        -o assets/print/fonts.css

Es misst außerdem die Zeilenhöhe — die unauffälligste Fehlerquelle im
Print-PDF (siehe --lh-metric-fix in print.css).

LIZENZ: Einbetten in HTML ist Webfont-Nutzung, nicht Desktop-Nutzung.
Das fsType-Flag im Font regelt nur die PDF-Einbettung und sagt dazu
nichts. Vor dem Einsatz von einer Fachstelle prüfen lassen — das kann
dieses Skript nicht beurteilen und tut es auch nicht.
"""

from __future__ import annotations

import argparse
import base64
import sys
from pathlib import Path
from typing import List, Optional, Tuple

try:
    from fontTools.ttLib import TTFont
    from fontTools.subset import Options, Subsetter
except ImportError:
    sys.exit(
        "fontTools fehlt.\n  pip3 install -r tools/print/requirements.txt"
    )


# Zeichenvorrat für europäische Sprachen.
UNICODE_RANGES = [
    (0x0020, 0x007E),  # Basic Latin
    (0x00A0, 0x00FF),  # Latin-1 Supplement
    (0x0100, 0x017F),  # Latin Extended-A
]

# Zeichen, die in Inuvet-Dokumenten tatsächlich vorkommen und gerne
# fehlen. Vorher prüfen, ob die Schrift sie hat — ein fehlendes Zeichen
# lässt einen Produktnamen sichtbar auf eine Ersatzschrift zurückfallen.
REQUIRED_EXTRAS = {
    0x2013: "– Halbgeviertstrich (Seitentitel: „Shopify – inuvet\")",
    0x2014: "— Geviertstrich",
    0x201E: "„ Anführung unten",
    0x201C: "“ Anführung oben",
    0x00B7: "· Mittelpunkt (Trenner in Varianten, Footer)",
    0x00A0: "geschütztes Leerzeichen (49 €, 10 kg)",
    0x20AC: "€ Euro",
    0x00D7: "× Multiplikationszeichen (Formatangaben 56×70)",
    0x00BD: "½ (Dosierung „½–1 Tablette\")",
    0x207A: "⁺ hochgestelltes Plus (Produktnamen)",
    0x2011: "‑ geschützter Bindestrich",
    0x2022: "• Bullet",
}


def charset() -> set:
    chars = set()
    for start, end in UNICODE_RANGES:
        chars.update(range(start, end + 1))
    chars.update(REQUIRED_EXTRAS)
    return chars


def font_metrics(font: TTFont) -> dict:
    """Vertikale Metriken auslesen und die korrekte Zeilenhöhe berechnen.

    line-height: 1 setzt die Glyphe NICHT an die CSS-Oberkante. Chromium
    zentriert den Textkörper in der Zeilenbox; ist der Textkörper höher
    als 1 em, wandert der Text nach oben. Setzt man line-height auf die
    Textkörperhöhe, fällt die Zentrierung weg und der Versatz mit ihr.
    """
    upm = font["head"].unitsPerEm
    hhea = font["hhea"]
    ascent, descent = hhea.ascender, hhea.descender
    body_height = (ascent - descent) / upm

    metrics = {
        "upm": upm,
        "hhea_ascent": ascent,
        "hhea_descent": descent,
        "line_height": round(body_height, 4),
    }

    if "OS/2" in font:
        os2 = font["OS/2"]
        metrics["typo_ascent"] = getattr(os2, "sTypoAscender", None)
        metrics["typo_descent"] = getattr(os2, "sTypoDescender", None)
        metrics["win_ascent"] = getattr(os2, "usWinAscent", None)
        metrics["win_descent"] = getattr(os2, "usWinDescent", None)
        metrics["fs_type"] = getattr(os2, "fsType", None)

    return metrics


def missing_glyphs(font: TTFont) -> List[Tuple[int, str]]:
    cmap = font.getBestCmap()
    return [(cp, desc) for cp, desc in REQUIRED_EXTRAS.items()
            if cp not in cmap]


def family_and_weight(font: TTFont, path: Path) -> Tuple[str, int, str]:
    name = font["name"]

    def get(nid: int) -> Optional[str]:
        rec = name.getDebugName(nid)
        return rec if rec else None

    family = get(16) or get(1) or path.stem
    subfamily = (get(17) or get(2) or "").lower()

    weight = 400
    if "OS/2" in font:
        weight = getattr(font["OS/2"], "usWeightClass", 400) or 400
    if "bold" in subfamily and weight < 600:
        weight = 700

    style = "italic" if "italic" in subfamily or "oblique" in subfamily \
        else "normal"
    return family, weight, style


def process(path: Path, keep: set) -> dict:
    if not path.exists():
        sys.exit(f"Nicht gefunden: {path}")

    font = TTFont(str(path))
    family, weight, style = family_and_weight(font, path)
    metrics = font_metrics(font)
    missing = missing_glyphs(font)
    before = path.stat().st_size

    available = set(font.getBestCmap()) & keep

    options = Options()
    options.flavor = "woff2"
    options.layout_features = ["kern", "liga", "tnum", "onum", "frac"]
    options.desubroutinize = True
    options.drop_tables = []
    options.notdef_outline = True

    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=available)
    subsetter.subset(font)

    out = path.with_suffix(".subset.woff2")
    font.flavor = "woff2"
    font.save(str(out))
    after = out.stat().st_size

    data = base64.b64encode(out.read_bytes()).decode("ascii")
    out.unlink()

    return {
        "path": path,
        "family": family,
        "weight": weight,
        "style": style,
        "metrics": metrics,
        "missing": missing,
        "glyphs": len(available),
        "before": before,
        "after": after,
        "b64": data,
    }


def write_css(results: List[dict], out: Path) -> None:
    lines = [
        "/* ═══════════════════════════════════════════════════════════",
        "   inuvet Print — eingebettete Schriften",
        "   Erzeugt von tools/print/fonts.py — nicht von Hand bearbeiten.",
        "",
        "   Subsettet auf Latin + Latin-1 + Latin Extended-A und die in",
        "   Inuvet-Dokumenten benötigten Sonderzeichen. Base64, damit das",
        "   Dokument auch bei file:// und in Container-Umgebungen richtig",
        "   rendert.",
        "",
        "   LIZENZ: Webfont-Nutzung. Vor externem Einsatz prüfen lassen.",
        "   ═══════════════════════════════════════════════════════════ */",
        "",
    ]

    for r in results:
        lines += [
            f"/* {r['path'].name} — {r['glyphs']} Glyphen, "
            f"{r['before'] // 1024} KB → {r['after'] // 1024} KB */",
            "@font-face {",
            f"  font-family: \"{r['family']}\";",
            f"  font-weight: {r['weight']};",
            f"  font-style: {r['style']};",
            "  font-display: block;",
            f"  src: url(data:font/woff2;base64,{r['b64']}) format(\"woff2\");",
            "}",
            "",
        ]

    # Die gemessene Zeilenhöhe als Token ausgeben — pro Schrift.
    heights = {r["metrics"]["line_height"] for r in results}
    lines += [
        "/* ─── Gemessene Zeilenhöhe ───",
        "   Textkörperhöhe = (hhea.ascender − hhea.descender) / unitsPerEm.",
        "   Auf diesen Wert gesetzt, entfällt Chromiums Zentrierung des",
        "   Textkörpers in der Zeilenbox — und damit der vertikale Versatz.",
        "",
        "   NICHT auf Elemente mit anderer Schrift vererben. Ein Icon-Font",
        "   mit abweichenden Metriken wird davon nach unten gedrückt und",
        "   ragt in die Zeile darunter. Jede Schrift braucht ihre eigene",
        "   Zeilenhöhe. */",
        ":root {",
    ]
    for r in results:
        lines.append(
            f"  /* {r['family']} {r['weight']}: "
            f"{r['metrics']['line_height']} */"
        )
    lines += [
        f"  --lh-metric-fix: {sorted(heights)[0]};",
        "}",
        "",
    ]

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(
        description="inuvet Print — Schrift subsetten, einbetten, vermessen"
    )
    ap.add_argument("fonts", type=Path, nargs="+",
                    help="OTF/TTF/WOFF2-Dateien")
    ap.add_argument("-o", "--out", type=Path,
                    default=Path("assets/print/fonts.css"))
    args = ap.parse_args()

    keep = charset()
    print(f"Zeichenvorrat: {len(keep)} Codepoints\n")

    results = []
    problems = 0

    for path in args.fonts:
        r = process(path, keep)
        results.append(r)

        print(f"── {path.name} ──")
        print(f"  Familie:      {r['family']} · {r['weight']} · {r['style']}")
        print(f"  Glyphen:      {r['glyphs']}")
        print(f"  Größe:        {r['before'] // 1024} KB → "
              f"{r['after'] // 1024} KB")

        m = r["metrics"]
        print(f"  unitsPerEm:   {m['upm']}")
        print(f"  hhea:         asc {m['hhea_ascent']} / "
              f"desc {m['hhea_descent']}")
        print(f"  Zeilenhöhe:   {m['line_height']}  ← "
              f"--lh-metric-fix für diese Schrift")

        fs = m.get("fs_type")
        if fs is not None:
            print(f"  fsType:       {fs}  (regelt nur PDF-Einbettung, "
                  "nicht die Webfont-Lizenz)")

        if r["missing"]:
            problems += len(r["missing"])
            print(f"  FEHLENDE ZEICHEN ({len(r['missing'])}):")
            for cp, desc in r["missing"]:
                print(f"    U+{cp:04X}  {desc}")
        else:
            print("  Sonderzeichen: alle vorhanden")
        print()

    write_css(results, args.out)
    print(f"Geschrieben: {args.out}  "
          f"({args.out.stat().st_size // 1024} KB)")
    print("\nEinbinden — VOR print.css, damit die Schrift zuerst steht:")
    print(f'  <link rel="stylesheet" href="{args.out}">')

    if problems:
        print(f"\n{problems} fehlende(s) Zeichen. Das ist keine rein "
              "technische Frage:")
        print("  ein fehlendes Zeichen in einem Produktnamen fällt sichtbar "
              "auf eine")
        print("  Ersatzschrift zurück. Entweder Zeichen ersetzen oder "
              "Schriftschnitt")
        print("  mit vollem Vorrat besorgen.")
        return 1

    print("\nHinweis: --lh-metric-fix in print.css auf den gemessenen Wert "
          "setzen.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
