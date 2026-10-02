#!/usr/bin/env python3
"""
inuvet Print — Schritt 1: HTML → PDF

Exportiert ein Print-HTML (auf Basis von print.css) als PDF mit exakter
Blattgeometrie. Prüft vorher zwei Dinge, die sonst still schiefgehen:
Schriftladung und Seitenüberlauf.

    python3 tools/print/build.py dokument.html -o out/dokument.pdf

Danach:
    tools/print/cmyk.py     → Farben nach CMYK umschreiben
    tools/print/measure.py  → Ergebnis nachmessen
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit(
        "playwright fehlt.\n"
        "  pip3 install -r tools/print/requirements.txt\n"
        "  python3 -m playwright install chromium"
    )


# Überlauf-Wächter. Läuft im Browser, bevor exportiert wird.
# overflow: hidden kaschiert Überlauf lautlos — deshalb messen wir den
# Content-Bereich, nicht die Seite, und melden jede zu volle Seite.
OVERFLOW_PROBE = """
() => {
  const findings = [];
  document.querySelectorAll('.page').forEach((page, i) => {
    const body = page.querySelector('.page-body');
    if (!body) return;
    // 1mm Toleranz gegen Rundung im Layout-Engine
    const slack = 1 * 96 / 25.4;
    if (body.scrollHeight > body.clientHeight + slack) {
      findings.push({
        page: i + 1,
        overflow_mm: +(((body.scrollHeight - body.clientHeight) * 25.4 / 96)).toFixed(1)
      });
    }
  });
  return findings;
}
"""

# Welche Schriftfamilien wurden tatsächlich gerendert? Fällt ein
# Dokument auf eine Ersatzschrift zurück, sieht es auf jedem Rechner
# gleich falsch aus — und das PDF bettet die Ersatzschrift ein.
FONT_PROBE = """
() => {
  const families = new Set();
  document.querySelectorAll('.page *').forEach(el => {
    const f = getComputedStyle(el).fontFamily;
    if (f) families.add(f.split(',')[0].replace(/["']/g, '').trim());
  });
  return [...families];
}
"""

PAGE_PROBE = """
() => {
  const p = document.querySelector('.page');
  if (!p) return null;
  const r = p.getBoundingClientRect();
  return {
    w_mm: +(r.width * 25.4 / 96).toFixed(2),
    h_mm: +(r.height * 25.4 / 96).toFixed(2),
    count: document.querySelectorAll('.page').length
  };
}
"""


def build(src: Path, out: Path, strict: bool = True) -> int:
    if not src.exists():
        sys.exit(f"Nicht gefunden: {src}")

    out.parent.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page()
        page.goto(src.resolve().as_uri(), wait_until="load")

        # Vor dem Export auf die Schriften warten. Sonst wird die
        # Ersatzschrift eingebettet.
        page.evaluate("() => document.fonts.ready")

        geometry = page.evaluate(PAGE_PROBE)
        if geometry is None:
            sys.exit("Keine .page im Dokument gefunden — ist print.css eingebunden?")

        print(f"Seiten:   {geometry['count']}")
        print(f"Blatt:    {geometry['w_mm']} × {geometry['h_mm']} mm")

        fonts = page.evaluate(FONT_PROBE)
        print(f"Schriften im Layout: {', '.join(sorted(fonts))}")
        if not any("schnebel" in f.lower() for f in fonts):
            msg = (
                "schnebel-sans-me wurde NICHT verwendet — das Dokument "
                "rendert mit einer Ersatzschrift.\n"
                "  Ursache: Typekit ist domaingebunden und greift bei "
                "file:// nicht.\n"
                "  Lösung:  Schrift per fonts.py als Base64 einbetten."
            )
            if strict:
                sys.exit(f"ABBRUCH — {msg}")
            print(f"WARNUNG — {msg}")

        overflow = page.evaluate(OVERFLOW_PROBE)
        if overflow:
            lines = "\n".join(
                f"  Seite {f['page']}: {f['overflow_mm']} mm zu viel"
                for f in overflow
            )
            msg = f"{len(overflow)} Seite(n) laufen über:\n{lines}"
            if strict:
                sys.exit(
                    f"ABBRUCH — {msg}\n"
                    "  Inhalt kürzen oder auf eine weitere .page aufteilen.\n"
                    "  Mit --allow-overflow trotzdem exportieren."
                )
            print(f"WARNUNG — {msg}")
        else:
            print("Überlauf:  keiner")

        # Beide Flags sind Pflicht:
        # prefer_css_page_size — sonst skaliert Chromium auf ein
        #   Standardformat (messbar als 297,3 statt 297,0 mm).
        # print_background   — sonst fehlen alle Flächen.
        page.pdf(
            path=str(out),
            prefer_css_page_size=True,
            print_background=True,
        )
        browser.close()

    print(f"\nGeschrieben: {out}  ({out.stat().st_size / 1024:.0f} KB)")
    print("Nächster Schritt: tools/print/cmyk.py")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="inuvet Print — HTML → PDF")
    ap.add_argument("src", type=Path, help="Print-HTML")
    ap.add_argument("-o", "--out", type=Path, help="Ziel-PDF")
    ap.add_argument(
        "--allow-overflow",
        action="store_true",
        help="Trotz Überlauf/Ersatzschrift exportieren (nur für Zwischenstände)",
    )
    args = ap.parse_args()

    out = args.out or args.src.with_suffix(".pdf")
    return build(args.src, out, strict=not args.allow_overflow)


if __name__ == "__main__":
    raise SystemExit(main())
