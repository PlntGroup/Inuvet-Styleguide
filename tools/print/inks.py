"""
inuvet Print — Farbtabelle (Zuordnung RGB → CMYK)

Dies ist die EINZIGE Stelle, an der Druckfarbe definiert wird.
Ein Wert ändern, Pipeline neu laufen lassen — kein Suchen im Layoutcode.

Warum eine Tabelle und kein ICC-Profil:
Eine profilbasierte Umrechnung macht aus reinem Schwarz je nach
Einstellung Vierfarbschwarz. Bei einem Dokument, das auf einer Platte
laufen soll, ist das ein Produktionsfehler. Die Tabelle schreibt die
Farboperatoren im PDF direkt um (rg/g → k, RG/G → K) und hält die
Zuordnung explizit.

Farben ohne Eintrag werden NAMENTLICH GEMELDET und nicht gewandelt.
Das ist das Sicherheitsnetz: eine unbeabsichtigte Farbe fällt sofort
auf, statt als Vierfarbschwarz in den Druck zu gehen.
"""

from __future__ import annotations

from typing import Dict, Optional, Tuple

RGB = Tuple[int, int, int]
CMYK = Tuple[float, float, float, float]


class Ink:
    """Eine Druckfarbe: Bildschirmwert, Druckwert, Rolle."""

    def __init__(
        self,
        token: str,
        rgb: str,
        cmyk: Optional[CMYK],
        role: str,
    ) -> None:
        self.token = token
        self.hex = rgb.upper()
        self.rgb = self._parse(rgb)
        self.cmyk = cmyk
        self.role = role

    @staticmethod
    def _parse(value: str) -> RGB:
        v = value.lstrip("#")
        return (int(v[0:2], 16), int(v[2:4], 16), int(v[4:6], 16))

    @property
    def pending(self) -> bool:
        return self.cmyk is None

    @property
    def coverage(self) -> Optional[float]:
        """Farbauftrag in Prozent. Relevante Kennzahl für die Druckerei:
        reines K100 = 100 %, ein Prozessgrün C60/Y100 = 160 %."""
        if self.cmyk is None:
            return None
        return round(sum(self.cmyk) * 100, 1)

    def __repr__(self) -> str:
        return f"<Ink {self.token} {self.hex} cmyk={self.cmyk}>"


# ═══════════════════════════════════════════════════════════
#  Die Tabelle
# ═══════════════════════════════════════════════════════════
#
#  cmyk=None  → Wert steht noch aus. Die Pipeline bricht ab und nennt
#               den Token. Erst eintragen, wenn der Wert aus dem
#               Corporate Design oder von der Druckerei bestätigt ist.
#
#  Nicht selbst aus RGB umrechnen. Eine RGB-Rückrechnung verfälscht
#  die Marke: aus C60/M0/Y100/K0 wird ein grelles #66FF00.

INKS: Dict[str, Ink] = {
    # ─── Unstrittig: neutrale Werte, keine Markenentscheidung ───
    "--fg": Ink(
        token="--fg",
        rgb="#2E2E2E",
        cmyk=(0.00, 0.00, 0.00, 1.00),
        role="Schrift, Linien — reines K. Bewusst K100 statt einer "
             "Graustufe: Text auf einer Platte, kein Vierfarbschwarz, "
             "keine Passerprobleme an Buchstabenkanten.",
    ),
    "--bg": Ink(
        token="--bg",
        rgb="#FFFFFF",
        cmyk=(0.00, 0.00, 0.00, 0.00),
        role="Papier — keine Farbe.",
    ),

    # ─── AUSSTEHEND: Markenfarben ───
    # Diese Werte müssen aus dem Inuvet Corporate Design kommen.
    # Kandidaten als Quelle: Inuvet_Logo_CMYK.ai / .pdf (Drive),
    # oder die CMYK-Faltschachtel-Reinzeichnungen (VomiSan 56x70).
    "--green": Ink(
        token="--green",
        rgb="#78b41b",
        cmyk=None,
        role="Primärfarbe. AUSSTEHEND — verbindlicher Wert aus dem "
             "Corporate Design. Falls Sonderfarbe (HKS/Pantone): hier "
             "den Prozess-Ersatzwert eintragen und die Sonderfarbe in "
             "der Druckanfrage separat benennen.",
    ),
    "--green-light": Ink(
        token="--green-light",
        rgb="#f0fae6",
        cmyk=None,
        role="Dezente Grünfläche. AUSSTEHEND. Achtung: als Rasterton "
             "des Primärgrüns anlegen (z. B. 8 % davon), nicht als "
             "eigenständige Mischung — sonst driftet der Farbton.",
    ),
    "--fg-muted": Ink(
        token="--fg-muted",
        rgb="#666666",
        cmyk=None,
        role="Sekundärtext. AUSSTEHEND — vorgeschlagen als K-Raster "
             "(K60), nicht als Vierfarbgrau.",
    ),
    "--border": Ink(
        token="--border",
        rgb="#adadad",
        cmyk=None,
        role="Strukturlinien. AUSSTEHEND — als K-Raster anlegen.",
    ),
    "--border-light": Ink(
        token="--border-light",
        rgb="#e0e0e0",
        cmyk=None,
        role="Feine Linien / Tabellen-Rows. AUSSTEHEND — K-Raster. "
             "Vorsicht: unter ~10 % K bricht der Ton im Offsetdruck weg.",
    ),
    "--accent-bg": Ink(
        token="--accent-bg",
        rgb="#f2f2f2",
        cmyk=None,
        role="Flächen für Boxen. AUSSTEHEND — K-Raster.",
    ),
}


def pending_tokens() -> list:
    """Alle Farben, deren CMYK-Wert noch aussteht."""
    return [ink.token for ink in INKS.values() if ink.pending]


def lookup() -> Dict[RGB, CMYK]:
    """RGB→CMYK-Zuordnung für die PDF-Umschreibung.
    Enthält nur Farben mit bestätigtem Wert."""
    return {
        ink.rgb: ink.cmyk
        for ink in INKS.values()
        if ink.cmyk is not None
    }


def describe(rgb: RGB) -> str:
    """Token-Name zu einem RGB-Tripel — für Fehlermeldungen."""
    for ink in INKS.values():
        if ink.rgb == rgb:
            return ink.token
    return "unbekannt (nicht in der Tabelle)"


if __name__ == "__main__":
    print("inuvet Print — Farbtabelle\n")
    for ink in INKS.values():
        if ink.pending:
            state = "AUSSTEHEND"
        else:
            state = f"C{ink.cmyk[0]:.2f} M{ink.cmyk[1]:.2f} " \
                    f"Y{ink.cmyk[2]:.2f} K{ink.cmyk[3]:.2f}  " \
                    f"({ink.coverage} % Auftrag)"
        print(f"  {ink.token:<16} {ink.hex}  {state}")

    missing = pending_tokens()
    if missing:
        print(f"\n{len(missing)} Farbe(n) ohne bestätigten CMYK-Wert:")
        for token in missing:
            print(f"  · {token}")
        print("\nDiese Werte müssen aus dem Corporate Design kommen.")
        print("Solange sie fehlen, verweigert cmyk.py die Umwandlung.")
