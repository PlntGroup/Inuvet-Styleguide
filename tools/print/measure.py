#!/usr/bin/env python3
"""
inuvet Print — Schritt 3: das eigene PDF nachmessen

Nicht ansehen und für gut befinden, sondern das erzeugte PDF wieder
einlesen und mit Zahlen prüfen. Optional gegen eine Referenz.

    python3 tools/print/measure.py out/dokument_cmyk.pdf
    python3 tools/print/measure.py out/dokument_cmyk.pdf --ref referenz.pdf
    python3 tools/print/measure.py out/dokument_cmyk.pdf --png out/vorschau

Messen und Ansehen sind ZWEI Prüfungen, keine ersetzt die andere:
· Der Zahlenvergleich findet Schriftmetrik-Versätze, die das Auge nicht sieht.
· Das Auge findet Kollisionen, die in den Zahlen nicht auftauchen, weil
  die betroffene Spalte nicht mitgemessen wurde.
Deshalb: --png nutzen und tatsächlich hinsehen.
"""

from __future__ import annotations

import argparse
import sys
from collections import Counter
from pathlib import Path
from typing import Dict, List, Optional

try:
    import pdfplumber
except ImportError:
    sys.exit(
        "pdfplumber fehlt.\n  pip3 install -r tools/print/requirements.txt"
    )

PT_TO_MM = 25.4 / 72
TOLERANCE_MM = 0.3  # Zielwert: alle Abweichungen darunter


def mm(pt: float) -> float:
    return round(pt * PT_TO_MM, 2)


class Report:
    def __init__(self) -> None:
        self.problems: List[str] = []
        self.notes: List[str] = []

    def fail(self, msg: str) -> None:
        self.problems.append(msg)

    def note(self, msg: str) -> None:
        self.notes.append(msg)

    @property
    def ok(self) -> bool:
        return not self.problems


def measure_geometry(pdf, rep: Report) -> None:
    print("── Blattgeometrie ──")
    sizes = Counter((mm(p.width), mm(p.height)) for p in pdf.pages)
    for (w, h), count in sizes.items():
        print(f"  {w} × {h} mm  ({count} Seite(n))")

    if len(sizes) > 1:
        rep.fail(
            "Uneinheitliche Blattgröße. Meist skaliert Chromium auf ein "
            "Standardformat — prefer_css_page_size beim Export prüfen."
        )

    # Ganzzahlige mm-Maße sind das Erkennungszeichen eines korrekten
    # Exports. 297,3 statt 297,0 heißt: es wurde skaliert.
    for (w, h) in sizes:
        for value, label in ((w, "Breite"), (h, "Höhe")):
            drift = abs(value - round(value))
            if drift > 0.15:
                rep.fail(
                    f"{label} {value} mm weicht {drift:.2f} mm von einem "
                    f"ganzen Millimeter ab — Hinweis auf Skalierung beim Export."
                )


def measure_fonts(pdf, rep: Report) -> None:
    print("\n── Eingebettete Schriften ──")
    used: Counter = Counter()
    for page in pdf.pages:
        for ch in page.chars:
            used[ch.get("fontname", "?")] += 1

    if not used:
        rep.fail("Keine Textzeichen gefunden — ist das PDF leer?")
        return

    total = sum(used.values())
    for name, count in used.most_common():
        share = 100 * count / total
        print(f"  {name:<44} {count:>7} Zeichen  ({share:.1f} %)")

    fallbacks = [
        n for n in used
        if any(x in n.lower() for x in
               ("helvetica", "arial", "times", "liberation", "dejavu",
                "nimbus", "courier"))
    ]
    if fallbacks:
        rep.fail(
            "Ersatzschrift im PDF eingebettet: " + ", ".join(fallbacks) +
            "\n    Das Dokument sieht auf jedem Rechner gleich falsch aus. "
            "Schrift per\n    fonts.py als Base64 einbetten und neu exportieren."
        )


def measure_colorspace(pdf, rep: Report) -> None:
    """RGB-Reste finden. Nach cmyk.py darf keine non_stroking_color mehr
    drei Komponenten haben."""
    print("\n── Farbräume ──")
    kinds: Counter = Counter()

    for page in pdf.pages:
        for obj in list(page.chars) + list(page.rects) + list(page.lines):
            for key in ("non_stroking_color", "stroking_color"):
                color = obj.get(key)
                if not color:
                    continue
                n = len(color) if hasattr(color, "__len__") else 1
                kinds[{1: "Grau (g)", 3: "RGB (rg)", 4: "CMYK (k)"}.get(
                    n, f"{n} Komponenten")] += 1

    for kind, count in kinds.most_common():
        print(f"  {kind:<18} {count:>7} Objekt(e)")

    leftovers = kinds.get("RGB (rg)", 0) + kinds.get("Grau (g)", 0)
    if leftovers:
        rep.fail(
            f"{leftovers} Objekt(e) noch in RGB/Grau. cmyk.py hat sie nicht "
            "erfasst —\n    meist Form-XObjects oder Farben ohne Eintrag in "
            "inks.py."
        )


def measure_rules(pdf, rep: Report) -> None:
    """Linienraster. Messfalle: gepunktete SVG-Linien sind keine `lines`.
    Sie kommen als hunderte kleiner `curves` zurück, ein Objekt pro Strich —
    nach y gruppieren und über die Segmentanzahl filtern, sonst findet man
    sie nicht."""
    print("\n── Linienraster ──")

    for i, page in enumerate(pdf.pages, 1):
        solid = [ln for ln in page.lines if abs(ln["y0"] - ln["y1"]) < 0.5]

        # Gepunktete Linien aus curves rekonstruieren
        bands: Dict[float, int] = {}
        for cv in page.curves:
            y = round(cv["y0"], 1)
            bands[y] = bands.get(y, 0) + 1
        dotted = [y for y, n in bands.items() if n >= 5]

        if not solid and not dotted:
            continue

        rows = sorted({round(ln["y0"], 1) for ln in solid} | set(dotted))
        print(f"  Seite {i}: {len(solid)} durchgezogen, "
              f"{len(dotted)} gepunktet (rekonstruiert), "
              f"{len(rows)} Höhen")

        if len(rows) >= 3:
            gaps = [round(rows[j + 1] - rows[j], 2)
                    for j in range(len(rows) - 1)]
            common = Counter(gaps).most_common(1)[0]
            print(f"           Abstand: {mm(common[0])} mm "
                  f"({common[1]}/{len(gaps)} Abstände gleich)")
            outliers = [
                (j, mm(g)) for j, g in enumerate(gaps)
                if abs(g - common[0]) * PT_TO_MM > TOLERANCE_MM
            ]
            if outliers:
                rep.note(
                    f"Seite {i}: {len(outliers)} Zeilenabstand/-abstände "
                    f"außerhalb {TOLERANCE_MM} mm — "
                    + ", ".join(f"#{j}={v}mm" for j, v in outliers[:6])
                )


def measure_columns(pdf, rep: Report) -> None:
    """Spaltenpositionen über die x0 der ersten Zeichen je Zeile."""
    print("\n── Spaltenpositionen (x0 der Zeilenanfänge) ──")

    for i, page in enumerate(pdf.pages, 1):
        if not page.chars:
            continue
        starts: Counter = Counter()
        by_line: Dict[float, List[dict]] = {}
        for ch in page.chars:
            by_line.setdefault(round(ch["top"], 1), []).append(ch)
        for _, chars in by_line.items():
            starts[round(min(c["x0"] for c in chars), 1)] += 1

        top = [x for x, n in starts.most_common(6)]
        print(f"  Seite {i}: " + " · ".join(f"{mm(x)} mm" for x in sorted(top)))


def measure_rows(pdf) -> None:
    """Zeilen pro Seite = Anzahl eindeutiger top-Werte.

    Messfalle: dem eigenen Filter nicht trauen. Zählwerte immer gegen
    eine bekannte Gesamtzahl gegenprüfen — ein zu enges y-Fenster
    erfindet oder verschluckt Zeilen."""
    print("\n── Zeilen pro Seite ──")
    for i, page in enumerate(pdf.pages, 1):
        tops = {round(ch["top"], 1) for ch in page.chars}
        print(f"  Seite {i}: {len(tops)} Textzeilen "
              f"({len(page.chars)} Zeichen gesamt)")


def compare(pdf, ref_path: Path, rep: Report) -> None:
    print(f"\n── Vergleich mit Referenz: {ref_path.name} ──")
    with pdfplumber.open(ref_path) as ref:
        if len(ref.pages) != len(pdf.pages):
            rep.note(f"Seitenzahl: {len(pdf.pages)} vs. "
                     f"{len(ref.pages)} in der Referenz")

        for i, (a, b) in enumerate(zip(pdf.pages, ref.pages), 1):
            da, db = (mm(a.width), mm(a.height)), (mm(b.width), mm(b.height))
            if da != db:
                rep.fail(f"Seite {i}: Format {da} vs. Referenz {db}")

            for label, fn in (
                ("Linienhöhen", lambda p: sorted(
                    {round(l["y0"], 1) for l in p.lines})),
                ("Zeilenanfänge", lambda p: sorted(
                    {round(c["x0"], 1) for c in p.chars})[:12]),
            ):
                va, vb = fn(a), fn(b)
                deltas = [
                    abs(x - y) * PT_TO_MM
                    for x, y in zip(va, vb)
                ]
                if deltas:
                    worst = max(deltas)
                    state = "ok" if worst <= TOLERANCE_MM else "ABWEICHUNG"
                    print(f"  Seite {i} {label}: max. "
                          f"{worst:.2f} mm  [{state}]")
                    if worst > TOLERANCE_MM:
                        rep.fail(
                            f"Seite {i} {label}: {worst:.2f} mm Abweichung "
                            f"(Ziel < {TOLERANCE_MM} mm)"
                        )


def render_png(pdf, target: Path) -> None:
    """Zur PNG rendern und hinsehen. Der Zahlenvergleich alleine
    übersieht Kollisionen in Spalten, die nicht gemessen wurden."""
    target.mkdir(parents=True, exist_ok=True)
    print(f"\n── PNG-Vorschau → {target} ──")
    try:
        for i, page in enumerate(pdf.pages, 1):
            out = target / f"seite-{i:02d}.png"
            page.to_image(resolution=110).save(str(out))
            print(f"  {out}")
        print("  Bitte tatsächlich ansehen — nicht nur die Zahlen lesen.")
    except Exception as exc:
        print(f"  Rendering nicht möglich: {exc}")
        print("  (pdfplumber braucht dafür pypdfium2)")


def main() -> int:
    ap = argparse.ArgumentParser(description="inuvet Print — PDF nachmessen")
    ap.add_argument("src", type=Path)
    ap.add_argument("--ref", type=Path, help="Referenz-PDF zum Vergleich")
    ap.add_argument("--png", type=Path, help="Verzeichnis für PNG-Vorschau")
    args = ap.parse_args()

    if not args.src.exists():
        sys.exit(f"Nicht gefunden: {args.src}")

    rep = Report()
    print(f"Prüfe: {args.src}\n")

    with pdfplumber.open(args.src) as pdf:
        measure_geometry(pdf, rep)
        measure_fonts(pdf, rep)
        measure_colorspace(pdf, rep)
        measure_rules(pdf, rep)
        measure_columns(pdf, rep)
        measure_rows(pdf)
        if args.ref:
            compare(pdf, args.ref, rep)
        if args.png:
            render_png(pdf, args.png)

    print("\n" + "═" * 60)
    if rep.notes:
        print("Hinweise:")
        for n in rep.notes:
            print(f"  · {n}")
    if rep.ok:
        print("Alle harten Prüfungen bestanden.")
        print("Nicht enthalten und nur von der Druckerei zu klären:")
        print("  Ausgabeprofil · PDF/X-Konformität · Anschnitt ·")
        print("  Schnittmarken · Überdrucken")
        return 0

    print(f"{len(rep.problems)} Problem(e):")
    for p in rep.problems:
        print(f"  ✗ {p}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
