#!/usr/bin/env python3
"""
inuvet Print — Schritt 2: RGB → CMYK

Schreibt die Farboperatoren im PDF direkt um: rg/g (Füllung) und
RG/G (Kontur) werden zu k/K. Die Zuordnung kommt aus inks.py.

Warum kein ICC-Profil: eine profilbasierte Umrechnung macht aus reinem
Schwarz je nach Einstellung Vierfarbschwarz. Bei einem Dokument, das
auf einer Platte laufen soll, ist das ein Produktionsfehler.

    python3 tools/print/cmyk.py out/dokument.pdf -o out/dokument_cmyk.pdf

Unbekannte Farben werden namentlich gemeldet und NICHT gewandelt.
Das ist Absicht: eine unbeabsichtigte Farbe soll auffallen, statt als
Vierfarbschwarz in den Druck zu gehen.
"""

from __future__ import annotations

import argparse
import sys
from decimal import Decimal
from pathlib import Path
from typing import Dict, List, Set, Tuple

try:
    import pikepdf
    from pikepdf import Name, Operator, Pdf
except ImportError:
    sys.exit(
        "pikepdf fehlt.\n  pip3 install -r tools/print/requirements.txt"
    )

sys.path.insert(0, str(Path(__file__).parent))
import inks  # noqa: E402


RGB = Tuple[int, int, int]

# Farbraum-Operatoren, die wir übersetzen können
FILL_RGB, STROKE_RGB = "rg", "RG"
FILL_GRAY, STROKE_GRAY = "g", "G"
FILL_CMYK, STROKE_CMYK = "k", "K"

# Operatoren, die einen Farbraum über /CS setzen — die können wir nicht
# blind übersetzen, weil die Bedeutung der Operanden vom Farbraum abhängt.
OPAQUE_COLOR_OPS = {"sc", "scn", "SC", "SCN", "cs", "CS"}


def to_255(value) -> int:
    return max(0, min(255, int(round(float(value) * 255))))


class Rewriter:
    def __init__(self, table: Dict[RGB, Tuple[float, float, float, float]]):
        self.table = table
        self.unknown: Dict[RGB, int] = {}
        self.converted = 0
        self.opaque: Set[str] = set()

    def _cmyk_operands(self, rgb: RGB) -> List[Decimal]:
        c, m, y, k = self.table[rgb]
        return [Decimal(str(round(v, 4))) for v in (c, m, y, k)]

    def rewrite(self, instructions) -> Tuple[list, bool]:
        out = []
        changed = False

        for instr in instructions:
            op = str(instr.operator)
            operands = list(instr.operands)

            rgb = None
            target = None

            if op in (FILL_RGB, STROKE_RGB) and len(operands) == 3:
                rgb = tuple(to_255(v) for v in operands)
                target = FILL_CMYK if op == FILL_RGB else STROKE_CMYK

            elif op in (FILL_GRAY, STROKE_GRAY) and len(operands) == 1:
                g = to_255(operands[0])
                rgb = (g, g, g)
                target = FILL_CMYK if op == FILL_GRAY else STROKE_CMYK

            elif op in OPAQUE_COLOR_OPS:
                self.opaque.add(op)

            if rgb is not None:
                if rgb in self.table:
                    out.append(
                        pikepdf.ContentStreamInstruction(
                            self._cmyk_operands(rgb), Operator(target)
                        )
                    )
                    self.converted += 1
                    changed = True
                    continue
                self.unknown[rgb] = self.unknown.get(rgb, 0) + 1

            out.append(instr)

        return out, changed


def process_stream(obj, rw: Rewriter) -> None:
    """Ein Form-XObject umschreiben. Ohne diesen Schritt bleiben Reste
    in RGB — Formulare, Gruppen und Transparenzgruppen liegen dort."""
    try:
        instructions = pikepdf.parse_content_stream(obj)
    except Exception:
        return
    new, changed = rw.rewrite(instructions)
    if changed:
        obj.write(pikepdf.unparse_content_stream(new))


def walk_xobjects(resources, rw: Rewriter, seen: Set[int]) -> None:
    if resources is None or "/XObject" not in resources:
        return
    for _, xobj in resources["/XObject"].items():
        if xobj.objgen in seen:
            continue
        seen.add(xobj.objgen)
        if xobj.get("/Subtype") != Name.Form:
            continue
        process_stream(xobj, rw)
        walk_xobjects(xobj.get("/Resources"), rw, seen)


def convert(src: Path, out: Path) -> int:
    pending = inks.pending_tokens()
    if pending:
        print("ABBRUCH — CMYK-Werte fehlen für:", file=sys.stderr)
        for token in pending:
            ink = inks.INKS[token]
            print(f"  · {token:<16} {ink.hex}", file=sys.stderr)
            print(f"    {ink.role}", file=sys.stderr)
        print(
            "\nDiese Werte müssen aus dem Corporate Design oder von der "
            "Druckerei kommen.\nEintragen in tools/print/inks.py. "
            "Nicht aus RGB umrechnen — das verfälscht die Marke.",
            file=sys.stderr,
        )
        return 2

    table = inks.lookup()
    rw = Rewriter(table)

    with Pdf.open(src) as pdf:
        seen: Set[int] = set()
        for page in pdf.pages:
            instructions = pikepdf.parse_content_stream(page)
            new, changed = rw.rewrite(instructions)
            if changed:
                page.Contents = pdf.make_stream(
                    pikepdf.unparse_content_stream(new)
                )
            walk_xobjects(page.get("/Resources"), rw, seen)

        out.parent.mkdir(parents=True, exist_ok=True)
        pdf.save(out)

    print(f"Umgeschrieben: {rw.converted} Farboperator(en) → CMYK")

    if rw.opaque:
        print(
            "\nHINWEIS — nicht übersetzte Farboperatoren: "
            f"{', '.join(sorted(rw.opaque))}\n"
            "  Diese setzen Farbe über einen benannten Farbraum (/CS). "
            "Ihre Bedeutung\n  hängt vom Farbraum ab, deshalb bleiben sie "
            "unangetastet. Meist stammen\n  sie aus eingebetteten Bildern — "
            "bei reinen Text-/Linien-Dokumenten\n  nachsehen, woher sie kommen."
        )

    if rw.unknown:
        print("\nWARNUNG — Farben ohne Eintrag in inks.py (bleiben RGB):",
              file=sys.stderr)
        for rgb, count in sorted(rw.unknown.items(), key=lambda x: -x[1]):
            hexval = "#%02X%02X%02X" % rgb
            print(f"  {hexval}  ({count}×)  {inks.describe(rgb)}",
                  file=sys.stderr)
        print(
            "\n  Jede dieser Farben ginge als RGB in den Druck. "
            "Entweder in inks.py\n  aufnehmen oder im HTML durch eine "
            "Token-Farbe ersetzen.",
            file=sys.stderr,
        )

    # Farbauftrag — relevante Kennzahl für die Druckerei.
    print("\nFarbauftrag der verwendeten Farben:")
    for ink in inks.INKS.values():
        if ink.cmyk is not None:
            print(f"  {ink.token:<16} {ink.coverage} %")

    print(f"\nGeschrieben: {out}")
    print("Nächster Schritt: tools/print/measure.py")
    return 1 if rw.unknown else 0


def main() -> int:
    ap = argparse.ArgumentParser(description="inuvet Print — RGB → CMYK")
    ap.add_argument("src", type=Path)
    ap.add_argument("-o", "--out", type=Path)
    args = ap.parse_args()
    out = args.out or args.src.with_name(args.src.stem + "_cmyk.pdf")
    return convert(args.src, out)


if __name__ == "__main__":
    raise SystemExit(main())
