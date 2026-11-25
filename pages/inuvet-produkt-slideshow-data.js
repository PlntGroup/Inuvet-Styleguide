/* inuvet-produkt-slideshow-data.js — Snapshot der Shop-Daten (Inuvet-Store, Admin API).
 * Stand: 2026-11-19. Quelle je Feld:
 *   title = Produkttitel · category = custom.kategorie · cat = Kategorie-Collection (Handle = Farb-Token)
 *   short = custom.short_description (Fallback custom.kurzbeschreibung) · packshot = Hauptbild
 *   forms = Galerie-Bilder „Inuvet_Einzelprodukt_*“ + Bildunterschrift aus custom.pdp_gallery_captions
 *   video = Darreichungs-Animation (mp4), sofern vorhanden; sonst wird das Bild animiert.
 * Lokal (slideshow-media/, nicht im Repo): packshot = Render COL, forms = Darreichungs-MP4 + PNG;
 *   packshotFallback / imageFallback = Shop-CDN, falls die lokalen Dateien fehlen.
 * videoEnd = Sekunde, an der das Video inhaltlich endet (Datei hat danach ~1 s Schwarz/leeren Hintergrund) – dort wird abgeschnitten
 * ingredients = Shop custom.key_ingredients (Metaobjekt ingredient: Name, Latein, Beschreibung, Bild 2048 px)
 * Produktarchiv und Produkte ohne Galerie-Captions sind ausgelassen. */
window.SLIDESHOW_PRODUCTS = [
  {
    "handle": "calmin-balance-produktfamilie",
    "title": "Calmin balance",
    "category": "Stress",
    "cat": "stress",
    "short": "Zur Förderung des allgemeinen Wohlbefindens in anspruchsvollen Situationen, wie zum Beispiel bei Autofahrten, einem Umzug oder einer Trennung.",
    "packshot": "../slideshow-media/packshots/Inuvet_Calmin_Balance_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Calmin_Tabletten_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Calmin_Tabletten_1zu1.png?v=1794493581&width=1400",
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Calmin_Tabletten_1zu1.mp4"
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Calmin_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Calmin_Pulver_1zu1.png?v=1794493581&width=1400",
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Calmin_Pulver_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Calmin_Balance_3000px_COL_260810.jpg?v=1794493590&width=1800",
    "ingredients": [
      {
        "name": "Passionsblumenextrakt",
        "latin": "Passiflora incarnata",
        "summary": "Passionsblumenextrakt wird traditionell als beruhigendes Kraut verwendet.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-passionsblumenextrakt.jpg?v=1795544944&width=1400"
      },
      {
        "name": "Hopfentinktur",
        "latin": "Humulus lupulus",
        "summary": "Hopfentinktur wird traditionell als beruhigendes Kraut verwendet.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-hopfentinktur.jpg?v=1795544953&width=1400"
      },
      {
        "name": "Milchprotein Hydrolysat Alpha-Casozepin",
        "latin": "",
        "summary": "Milchprotein Hydrolysat Alpha-Casozepin, ein Peptid, das aus Casein gewonnen wird, ist ein natürlicher Bestandteil der Muttermilch bei Säugetieren.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-milchprotein-hydrolysat-alpha-casozepin.jpg?v=1794677740&width=1400"
      }
    ]
  },
  {
    "handle": "hepax-produktfamilie",
    "title": "Hepax",
    "category": "Leber",
    "cat": "leber",
    "short": "Unterstützt die Leber. Lange Reichweite dank hoher Dosierung.",
    "packshot": "../slideshow-media/packshots/Inuvet_Hepax_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Hepax_Tabletten_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Hepax_Tabletten_1zu1.png?v=1794488805&width=1400",
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Hepax_Tabletten_1zu1.mp4"
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Hepax_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Hepax_Pulver_1zu1.png?v=1794488804&width=1400",
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Hepax_Pulver_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Hepax_3000px_COL_260810.jpg?v=1794488787&width=1800",
    "ingredients": [
      {
        "name": "Mariendistel-Extrakt",
        "latin": "Silybum marianum",
        "summary": "Mariendistel-Extrakt wird traditionell zur Unterstützung der normalen Leberfunktion eingesetzt.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-mariendistel-extrakt.jpg?v=1794677724&width=1400"
      },
      {
        "name": "Artischocke-Extrakt",
        "latin": "Cynara scolymus folium",
        "summary": "Artischockenblätter werden traditionell zur Unterstützung der Leberfunktion und des Fettstoffwechsels eingesetzt.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-artischocke-extrakt.jpg?v=1794677723&width=1400"
      },
      {
        "name": "Betain",
        "latin": "",
        "summary": "Betain ist einer der Ausgangsstoffe für die Bildung von Methionin in der Leber. Die Aminosäure Methionin wird durch eine biochemische Reaktion zu S-Adenosylmethionin (SAMe) umgewandelt, das eine wichtige Rolle in verschiedenen Stoffwechselprozessen, wie z. B. Entgiftungsprozessen, spielt und am Fettstoffwechsel beteiligt ist. Betain kann zudem zu einem ausgewogenen Fettstoffwechsel in der Leber beitragen.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-betain.jpg?v=1795545190&width=1400"
      },
      {
        "name": "Reishi gemahlen",
        "latin": "",
        "summary": "Reishi gemahlen wird traditionell als Vitalpilz verwendet. Durch das Shellbroken-Verfahren wird der Pilz besonders fein gemahlen, wodurch die Aufnahme der enthaltenen Nährstoffe optimiert wird.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-reishi-gemahlen-v2.jpg?v=1794678294&width=1400"
      }
    ]
  },
  {
    "handle": "hypolene-produktfamilie",
    "title": "Hypolene",
    "category": "Gelenke",
    "cat": "gelenke",
    "short": "Unterstützt den Bewegungsapparat. Bei stark beanspruchten Gelenken. Für die Langzeitgabe oder als Kur geeignet.",
    "packshot": "../slideshow-media/packshots/Inuvet_Hypolene_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Pellets",
        "caption": "Pellets für Langzeitgabe oder Kur – einmal täglich übers Futter",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Hypolene_Pelets_1zu1.png",
        "imageFallback": null,
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Hypolene_Pelets_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Hypolene_3000px_COL_260810.jpg?v=1794488658&width=1800",
    "ingredients": [
      {
        "name": "Grünlippmuschel",
        "latin": "Gonex-Qualität",
        "summary": "Grünlippmuschel stellt essentielle Bausteine für den Gelenk- und Bindegewebsstoffwechsel (Synovia, Bänder, Sehnen und Knorpel) bereit. So werden Gewebe, Synovia, Knorpel und der darunterliegende Knochen mit Nährstoffen versorgt.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-gruenlippmuschel.jpg?v=1794664741&width=1400"
      },
      {
        "name": "Kurkuma-Extrakt",
        "latin": "Curcuma longa",
        "summary": "Kurkuma, auch Gelbwurz genannt, enthält den natürlichen Pflanzenstoff Curcumin mit antioxidativen Eigenschaften. Durch die Solubilisierung des Inhaltsstoffes wird die Bioverfügbarkeit erhöht.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-kurkuma-extrakt-v3.jpg?v=1795544903&width=1400"
      },
      {
        "name": "Hyaluronsäure",
        "latin": "",
        "summary": "Hyaluronsäure ist ein wichtiger Bestandteil des Bindegewebes und der Synovia. Sie wirkt als Schmiermittel für alle Gelenkbewegungen und haftet durch chemische Wechselwirkungen besonders gut am Knorpel des Gelenks.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-hyaluronsaeure.jpg?v=1794677723&width=1400"
      }
    ]
  },
  {
    "handle": "neurasyn-pea-pulver",
    "title": "Neurasyn PEA Pulver",
    "category": "Gelenke",
    "cat": "gelenke",
    "short": "Zur Unterstützung des Wohlbefindens bei besonderen körperlichen und nervlichen Belastungen. Mit ultramikronisiertem PEA.",
    "packshot": "../slideshow-media/packshots/Inuvet_Neurasyn_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Neurasyn_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Neurasyn_Pulver_1zu1.png?v=1794486650&width=1400",
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Neurasyn_Pulver_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Neurasyn_3000px_COL_260810.jpg?v=1794486661&width=1800",
    "ingredients": [
      {
        "name": "Palmitoylethanolamid (=PEA)",
        "latin": "Palmitamide MEA",
        "summary": "Palmitoylethanolamid (=PEA) ist ein natürlich vorkommendes Fettsäureamid, das zur Pflege beanspruchter und trockener Haut beiträgt.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-pea.jpg?v=1794664762&width=1400"
      },
      {
        "name": "Karottenpulver",
        "latin": "",
        "summary": "Karottenpulver dient als natürlicher Geschmacksverbesserer und liefert Ballaststoffe, die die Verdauung und die Darmbakterien unterstützen.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-karotte-getrocknet-gemahlen.jpg?v=1794664810&width=1400"
      },
      {
        "name": "Vitamin B12",
        "latin": "",
        "summary": "Das Produkt liefert zusätzliches Vitamin B12 zur Unterstützung des allgemeinen Stoffwechsels und der Vitalität.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-vitamin-b12.jpg?v=1794677739&width=1400"
      }
    ]
  },
  {
    "handle": "cortisan",
    "title": "Cortisan Öl-Komplex",
    "category": "Immunsystem",
    "cat": "immun",
    "short": "Hohe Bioverfügbarkeit durch Solubilisierung.",
    "packshot": "../slideshow-media/packshots/Inuvet_Cortisan_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Öl",
        "caption": "Öl-Komplex mit Dosierspritze – direkt ins Maul oder übers Futter",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Cortisan_Öl_1zu1.png",
        "imageFallback": null,
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Cortisan_Öl_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Cortisan_3000px_COL_260810.jpg?v=1794493278&width=1800",
    "ingredients": [
      {
        "name": "Indischer Weihrauch-Extrakt",
        "latin": "Boswellia serrata",
        "summary": "Weihrauch enthält charakteristische Boswelliasäuren und Triterpensäuren und wird traditionell zur Unterstützung des Bewegungsapparates verwendet. Durch die Solubilisierung des Inhaltsstoffes wird die Bioverfügbarkeit erhöht.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-indischer-weihrauch-extrakt.jpg?v=1794677692&width=1400"
      },
      {
        "name": "Kurkuma-Extrakt",
        "latin": "Curcuma longa",
        "summary": "Kurkuma, auch Gelbwurz genannt, enthält den natürlichen Pflanzenstoff Curcumin mit antioxidativen Eigenschaften. Durch die Solubilisierung des Inhaltsstoffes wird die Bioverfügbarkeit erhöht.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-kurkuma-extrakt-v3.jpg?v=1795544903&width=1400"
      },
      {
        "name": "Mikroalgenöl",
        "latin": "aus Schizochytrium sp.",
        "summary": "Schizochytrium sp. ist eine Micromeeresalge mit einem natürlichen hohen Anteil an den essentiellen Omega-3 Fettsäuren DHA und EPA.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-algenoel.jpg?v=1794664724&width=1400"
      }
    ]
  },
  {
    "handle": "power",
    "title": "Power Pulver",
    "category": "Immunsystem",
    "cat": "immun",
    "short": "Für ein starkes Immunsystem. Mit Vitalpilzen und Huminsäure. Allergikergeeignet.",
    "packshot": "../slideshow-media/packshots/Inuvet_Power_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Power_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Power_Pulver_1zu1.png?v=1794486019&width=1400",
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Power_Pulver_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Power_3000px_COL_260810.jpg?v=1794486049&width=1800",
    "ingredients": [
      {
        "name": "Shiitake gemahlen",
        "latin": "",
        "summary": "Der Shiitake-Vitalpilz besitzt eine bemerkenswerte immunologische Aktivität, da er das Immunsystem sowohl stimulieren als auch regulieren kann. Darüber hinaus bietet er eine zusätzliche antioxidative Wirkung, die das Produkt ideal ergänzt.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-shiitake-gemahlen-v2.jpg?v=1794678295&width=1400"
      },
      {
        "name": "Agaricus blazei Murrill gemahlen",
        "latin": "",
        "summary": "Agaricus blazei Murrill gemahlen ist immunologisch aktiv und wirkt immunstimulierend und -modulierend. Zudem kann er die körperliche und geistige Widerstandsfähigkeit erhöhen.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-agaricus-blazei-murrill-gemahlen-v3.jpg?v=1795544856&width=1400"
      },
      {
        "name": "Coriolus versicolor gemahlen",
        "latin": "",
        "summary": "Coriolus versicolor gemahlen ist ein immunologisch aktiver Vitalpilz, der das Immunsystem stimulieren kann.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-coriolus-versicolor-gemahlen-v3.jpg?v=1795544865&width=1400"
      }
    ]
  },
  {
    "handle": "inucardin-produktfamilie",
    "title": "InuCardin",
    "category": "Herz",
    "cat": "herz",
    "short": "Unterstützt das Herz-Kreislauf-System. Für alle Senioren. Auch zur Langzeitgabe.",
    "packshot": "../slideshow-media/packshots/Inuvet_InuCardin_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Inucardin_Tabletten_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Inucardin_Tabletten_1zu1.png?v=1794488269&width=1400",
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Inucardin_Tabletten_1zu1.mp4"
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Inucardin_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Inucardin_Pulver_1zu1.png?v=1794488269&width=1400",
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Inucardin_Pulver_1zu1.mp4",
        "videoEnd": 5.0
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_InuCardin_3000px_COL_260810.jpg?v=1794488280&width=1800",
    "ingredients": [
      {
        "name": "Taurin",
        "latin": "",
        "summary": "Taurin trägt zur normalen Herzfunktion bei.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-taurin.jpg?v=1794677723&width=1400"
      },
      {
        "name": "Ginkgo-Extrakt",
        "latin": "Ginkgo biloba",
        "summary": "Ginkgo-Extrakt wird traditionell verwendet und hat antioxidative Eigenschaften.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-ginkgo-extrakt.jpg?v=1794677724&width=1400"
      },
      {
        "name": "Weißdorn-Tinktur",
        "latin": "Crataegus oxyacantha",
        "summary": "Weißdorn-Tinktur wird traditionell zur Unterstützung der normalen Herzfunktion verwendet.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-weissdorn-tinktur.jpg?v=1794677724&width=1400"
      }
    ]
  },
  {
    "handle": "enterogast-akut-produktfamilie",
    "title": "EnteroGast akut",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "3 Phasen Wirkung: adstringierend, absorbierend, aufbauend. Lange Reichweite dank hoher Dosierung.",
    "packshot": "../slideshow-media/packshots/Inuvet_EnteroGast_Akut_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_EnterogastAkut_Tabletten_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_EnterogastAkut_Tabletten_1zu1.png?v=1794490526&width=1400",
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_EnterogastAkut_Tabletten_1zu1.mp4"
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_EnterogastAkut_Pulver_01_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_EnterogastAkut_Pulver_03_1zu1.png?v=1794490526&width=1400",
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_EnterogastAkut_Pulver_01_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_EnteroGast_Akut_3000px_COL_260810.jpg?v=1794490536&width=1800",
    "ingredients": [
      {
        "name": "Enterococcus faecium",
        "latin": "Probiotische Bakterienkulturen",
        "summary": "Enterococcus-faecium-Kulturen helfen dabei, die Darmflora auf natürliche Weise aufzubauen. Sie siedeln sich im Darm an und unterstützen die Regulation der Darmperistaltik.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-enterococcus-faecium.jpg?v=1794664734&width=1400"
      },
      {
        "name": "Stieleichen-Extrakt",
        "latin": "Quercus robur cortex",
        "summary": "Stieleichen-Extrakt ist reich an diversen Gerbstoffen, die zu einer oberflächlichen Verdichtung (adstringierender Effekt) der Darmschleimhaut führen. Es wird weniger Wasser in den Darm abgegeben und der Darminhalt nimmt wieder eine normalere, festere Form an.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-stieleiche.jpg?v=1794664765&width=1400"
      },
      {
        "name": "Ratanhia-Wurzel gemahlen",
        "latin": "Krameria lappacea radix",
        "summary": "Ähnlich wie die Stieleichenrinde enthält auch die Ratanhiawurzel einen äußerst hohen Anteil an Gerbstoffen (vor allem Catechingerbstoffe und Proanthocyanide).",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-ratanhia-wurzel-gemahlen.jpg?v=1794677692&width=1400"
      }
    ]
  },
  {
    "handle": "floracomplex-produktfamilie",
    "title": "FloraComplex",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "Unterstützt den Aufbau der Darmflora. Enthält Sonnenhut-Extrakt (Echinacea). Auch während oder nach der Medikamentengabe.",
    "packshot": "../slideshow-media/packshots/Inuvet_FloraComplex_2_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_FloraComplex_Tabletten_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_FloraComplex_Tabletten_1zu1.png?v=1794489918&width=1400",
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_FloraComplex_Tabletten_1zu1.mp4"
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_FloraComplex_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_FloraComplex_Pulver_1zu1.png?v=1794489916&width=1400",
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_FloraComplex_Pulver_1zu1.mp4",
        "videoEnd": 5.0
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_FloraComplex_P_T_3000px_COL_261028.jpg?v=1794490100&width=1800",
    "ingredients": [
      {
        "name": "Enterococcus faecium",
        "latin": "Probiotische Bakterienkulturen",
        "summary": "Enterococcus-faecium-Kulturen helfen dabei, die Darmflora auf natürliche Weise aufzubauen. Sie siedeln sich im Darm an und unterstützen die Regulation der Darmperistaltik.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-enterococcus-faecium.jpg?v=1794664734&width=1400"
      },
      {
        "name": "Purpurfarbener Sonnenhut-Extrakt",
        "latin": "Echinacea purpurea herba",
        "summary": "Bei In-vivo-Studien konnte verschiedenen Echinacea-Zubereitungen bei oraler Gabe ein immun-modulierender Effekt zugeordnet werden.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-purpurfarbener-sonnenhut-extrakt.jpg?v=1794677723&width=1400"
      },
      {
        "name": "Inulin",
        "latin": "Präbiotikum",
        "summary": "Inulin gehört zu der Gattung der Präbiotika, die durch körpereigene Enzyme nicht verdaulich sind und damit ein fermentierbares Substrat für die Bakterien der intestinalen Flora darstellen.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-inulin.jpg?v=1794664745&width=1400"
      }
    ]
  },
  {
    "handle": "floracomplex2",
    "title": "FloraComplex²",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "Unterstützt den Aufbau der Darmflora. Enthält zwei Bakterienstämme probiotischer Kulturen. Allergiker- und diabetikergeeignet.",
    "packshot": "../slideshow-media/packshots/Inuvet_FloraComplex2_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_FloraComplex2_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_FloraComplex2_Pulver_1zu1.png?v=1794489916&width=1400",
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_FloraComplex2_Pulver_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_FloraComplex2_3000px_COL_260810.jpg?v=1794490022&width=1800",
    "ingredients": [
      {
        "name": "Inulin",
        "latin": "Präbiotikum",
        "summary": "Inulin gehört zu der Gattung der Präbiotika, die durch körpereigene Enzyme nicht verdaulich sind und damit ein fermentierbares Substrat für die Bakterien der intestinalen Flora darstellen.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-inulin.jpg?v=1794664745&width=1400"
      },
      {
        "name": "Lactobacillus acidophilus",
        "latin": "Probiotische Bakterienkulturen",
        "summary": "Lactobacillus acidophilus ist ein fakultativ anaerobes, grampositives Stäbchenbakterium. Es ist eines der am besten erforschten Probiotika für die Gesundheit von Hund und Katze.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-lactobacillus-acidophilus.jpg?v=1794664758&width=1400"
      },
      {
        "name": "Enterococcus faecium",
        "latin": "Probiotische Bakterienkulturen",
        "summary": "Enterococcus-faecium-Kulturen helfen dabei, die Darmflora auf natürliche Weise aufzubauen. Sie siedeln sich im Darm an und unterstützen die Regulation der Darmperistaltik.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-enterococcus-faecium.jpg?v=1794664734&width=1400"
      }
    ]
  },
  {
    "handle": "floracomplex3",
    "title": "FloraComplex³ Pulver",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "Unterstützt den Aufbau der Darmflora. Enthält drei Bakterienstämme probiotischer Kulturen. Allergiker- und diabetikergeeignet.",
    "packshot": "../slideshow-media/packshots/Inuvet_FloraComplex3_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_FloraComplex_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_FloraComplex_Pulver_1zu1.png?v=1794489916&width=1400",
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_FloraComplex_Pulver_1zu1.mp4",
        "videoEnd": 5.0
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_FloraComplex3_3000px_COL_260810.jpg?v=1794488935&width=1800",
    "ingredients": [
      {
        "name": "Lactobacillus acidophilus",
        "latin": "Probiotische Bakterienkulturen",
        "summary": "Lactobacillus acidophilus ist ein fakultativ anaerobes, grampositives Stäbchenbakterium. Es ist eines der am besten erforschten Probiotika für die Gesundheit von Hund und Katze.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-lactobacillus-acidophilus.jpg?v=1794664758&width=1400"
      },
      {
        "name": "Enterococcus faecium",
        "latin": "Probiotische Bakterienkulturen",
        "summary": "Enterococcus-faecium-Kulturen helfen dabei, die Darmflora auf natürliche Weise aufzubauen. Sie siedeln sich im Darm an und unterstützen die Regulation der Darmperistaltik.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-enterococcus-faecium.jpg?v=1794664734&width=1400"
      },
      {
        "name": "Bacillus velezensis",
        "latin": "Probiotische Bakterienkulturen",
        "summary": "Bacillus velezensis kann durch den Verbrauch von Sauerstoff und die Produktion bestimmter Enzyme eine angenehme Umgebung für nützliche Bakterien im Darm schaffen. Die Sporen überleben den niedrigen pH-Wert im Magen und vermehren sich im Darm.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-bacillus-velezensis.jpg?v=1795545271&width=1400"
      }
    ]
  },
  {
    "handle": "ibedex",
    "title": "Ibedex Pulver",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "Zur Stärkung der Darmfunktionen und des Mikrobioms. Für die perfekte Kotkonsistenz. Allergikergeeignet.",
    "packshot": "../slideshow-media/packshots/Inuvet_Ibedex_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Ibedex_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Ibedex_Pulver_1zu1_e86b0619-e9fb-430d-a09d-abcf4c4d4d40.png?v=1794489847&width=1400",
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Ibedex_Pulver_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Ibedex_3000px_COL_260810.jpg?v=1794488356&width=1800",
    "ingredients": [
      {
        "name": "Inulin",
        "latin": "Präbiotikum",
        "summary": "Inulin gehört zu der Gattung der Präbiotika, die durch körpereigene Enzyme nicht verdaulich sind und damit ein fermentierbares Substrat für die Bakterien der intestinalen Flora darstellen.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-inulin.jpg?v=1794664745&width=1400"
      },
      {
        "name": "Flohsamenschalen",
        "latin": "Plantago ovata",
        "summary": "Die Schale des indischen Flohsamens hat einen starken natürlichen Quelleffekt. Der Samen kann das bis zu 40-fache des eigenen Gewichtes an Wasser aufnehmen. Einmal in Kontakt mit Wasser bilden sie so eine schützende Schleimschicht.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-flohsamenschalen.jpg?v=1794664738&width=1400"
      },
      {
        "name": "Mikrokristalline Cellulose",
        "latin": "",
        "summary": "Mikrokristalline Cellulose wird aus Pflanzenfasern gewonnen und nicht vom Körper absorbiert oder verdaut. Ballaststoffe wie die mikrokristalline Zellulose regeln die Verdauung und fördern eine gesunde Darmflora.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-mikrokristalline-cellulose.jpg?v=1794677692&width=1400"
      }
    ]
  },
  {
    "handle": "kolax",
    "title": "Kolax Öl-Komplex",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "Unterstützt die Magen- und Darmfunktion z.B. nach Narkosen. Schon vor Tierärzt*innen im Stall.",
    "packshot": "../slideshow-media/packshots/Inuvet_Kolax_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Öl",
        "caption": "Wohlriechender Öl-Komplex – per Spritze ins Maul oder übers Futter",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Kolax_Öl_1zu1.png",
        "imageFallback": null,
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Kolax_Öl_1zu1.mp4",
        "videoEnd": 5.0
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Kolax_3000px_COL_260810.jpg?v=1794487459&width=1800",
    "ingredients": [
      {
        "name": "Kalt gepresstes Leinöl",
        "latin": "Linum usitatissimum oleum",
        "summary": "Leinöl ist die Grundlage (Trägerstoff) von Kolax und erweicht den Kot.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-kalt-gepresstes-leinoel.jpg?v=1794677692&width=1400"
      },
      {
        "name": "Ätherische Öle",
        "latin": "",
        "summary": "Anis, Kümmel, Fenchel, Zimtrinde, Kamille, Zitronengras, Angelikawurzel",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-aetherische-oele.jpg?v=1794677692&width=1400"
      }
    ]
  },
  {
    "handle": "laxin",
    "title": "Laxin Pulver",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "Ideal bei Verstopfung. Unterstützt Verdauung und Entgiftung. Lactulose – ohne Alkohol und Konservierungsstoffe.",
    "packshot": "../slideshow-media/packshots/Inuvet_Laxin_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Laxin_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Laxin_Pulver_1zu1_bacc788c-b8fc-4ed0-bad7-fcfcb7e70c3a.png?v=1794489749&width=1400",
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Laxin_Pulver_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Laxin_3000px_COL_260810.jpg?v=1794487368&width=1800",
    "ingredients": [
      {
        "name": "Lactulose",
        "latin": "",
        "summary": "Lactulose ist ein Zweifachzucker, der im Darm von Bakterien abgebaut wird. Dieser Abbauprozess kann eine abführende Reaktion auslösen. Lactulose kann die Kotabgabe unterstützen, indem sie den Wassereinstrom in den Darm erhöht.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-lactulose.jpg?v=1794677692&width=1400"
      }
    ]
  },
  {
    "handle": "vomisan-produktfamilie",
    "title": "VomiSan",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "Legt sich beruhigend auf die Magenschleimhaut. Zu jedem Schmerzmittel und Antibiotikum. Zur Langzeitgabe geeignet.",
    "packshot": "../slideshow-media/packshots/Inuvet_VomiSan_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Vomisan_Tabletten_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Vomisan_Tabletten_1zu1_2767b3c3-248e-4a02-aadf-987da05e3093.png?v=1794489137&width=1400",
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Vomisan_Tabletten_1zu1.mp4"
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Vomisan_Pulver_01_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Vomisan_Pulver_02_1zu1_5c2b7f8a-96bd-434a-af6b-82dc48869af8.png?v=1794489183&width=1400",
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Vomisan_Pulver_01_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_VomiSan_3000px_COL_260810.jpg?v=1794481111&width=1800",
    "ingredients": [
      {
        "name": "Dill-Tinktur",
        "latin": "Anethum graveolens fructus",
        "summary": "Die wichtigste Eigenschaft der Dillfrucht ist die beruhigende Funktion an der glatten Muskulatur des Gastrointestinaltraktes.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-dill-v2.jpg?v=1794678295&width=1400"
      },
      {
        "name": "Flohsamenschalen",
        "latin": "Plantago ovata",
        "summary": "Die Schale des indischen Flohsamens hat einen starken natürlichen Quelleffekt. Der Samen kann das bis zu 40-fache des eigenen Gewichtes an Wasser aufnehmen. Einmal in Kontakt mit Wasser bilden sie so eine schützende Schleimschicht.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-flohsamenschalen.jpg?v=1794664738&width=1400"
      },
      {
        "name": "Kamille-Extrakt",
        "latin": "Matricaria chamomilla flores",
        "summary": "Kamille-Extrakt beruhigt und entspannt die Muskulatur im Magen-Darm-Trakt.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-kamille.jpg?v=1794664749&width=1400"
      }
    ]
  },
  {
    "handle": "dermin",
    "title": "Dermin Pflege-Emulsion",
    "category": "Haut & Fell",
    "cat": "haut",
    "short": "Beruhigt juckende und gereizte Haut. Mit CBD, Aloe Vera, Ceramiden und PEA.",
    "packshot": "../slideshow-media/packshots/Inuvet_Dermin_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Emulsion",
        "caption": "Pflege-Emulsion – zieht schnell ein, mit Ableckschutz",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Dermin_Fluid_01_1zu1.png",
        "imageFallback": null,
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Dermin_Fluid_01_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Dermin_3000px_COL_260810.jpg?v=1794492652&width=1800",
    "ingredients": [
      {
        "name": "Aloe vera",
        "latin": "Aloe barbadensis",
        "summary": "Aloe vera ist für ihre feuchtigkeitsspendenden, beruhigenden und kühlenden Eigenschaften bekannt.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-aloe-vera.jpg?v=1795545182&width=1400"
      },
      {
        "name": "CBD",
        "latin": "",
        "summary": "Im Unterschied zu THC (Tetrahydrocannabinol) hat CBD keine psychoaktive Wirkung. Um sicherzustellen, dass Dermin kein THC enthält, verwenden wir ein speziell aufgereinigtes Nutzhanf-Destillat.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-cbd-v2.jpg?v=1794678295&width=1400"
      },
      {
        "name": "Palmitoylethanolamid (=PEA)",
        "latin": "Palmitamide MEA",
        "summary": "Palmitoylethanolamid (=PEA) ist ein natürlich vorkommendes Fettsäureamid, das zur Pflege beanspruchter und trockener Haut beiträgt.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-pea.jpg?v=1794664762&width=1400"
      },
      {
        "name": "Rosskastanie",
        "latin": "Aesculus hippocastanum",
        "summary": "Rosskastanie wird traditionell in der Hautpflege verwendet.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-rosskastanie.jpg?v=1794677692&width=1400"
      }
    ]
  },
  {
    "handle": "manukalind-produktfamilie",
    "title": "ManukaLind",
    "category": "Haut & Fell",
    "cat": "haut",
    "short": "Zur Unterstützung der Hautregeneration. Ätherische Öle weisen Insekten ab und reduzieren Ablecken.",
    "packshot": "../slideshow-media/packshots/Inuvet_ManukaLind_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Salbe",
        "caption": "Salbe mit verschraubbarer Tülle – knopfkanülengängig",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Manukalind_Salbe_01_1zu1.png",
        "imageFallback": null,
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Manukalind_Salbe_01_1zu1.mp4"
      },
      {
        "name": "Spray",
        "caption": "Spray – sprüht auch über Kopf an schwer erreichbaren Stellen",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Manukalind_Spray_1zu1.png",
        "imageFallback": null,
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Manukalind_Spray_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_ManukaLind_3000px_COL_260810.jpg?v=1794487199&width=1800",
    "ingredients": [
      {
        "name": "Manuka-Honig",
        "latin": "MGO 514+",
        "summary": "Manuka-Honig wird in Neuseeland von Honigbienen aus der Südseemyrte gewonnen und wird dort seit vielen Generationen verwendet.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-manuka-honig.jpg?v=1794677692&width=1400"
      },
      {
        "name": "Beinwell-Extrakt",
        "latin": "Symphytum officinalis",
        "summary": "Beinwell-Extrakt unterstützt in besonderem Maße die Hautregeneration. Die in Wurzel und Kraut des Beinwell enthaltenen Allantoine wirken sich positiv auf das Zellwachstum der Haut aus.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-beinwell-extrakt.jpg?v=1794677724&width=1400"
      },
      {
        "name": "Ätherische Öle",
        "latin": "",
        "summary": "Anis, Kümmel, Fenchel, Zimtrinde, Kamille, Zitronengras, Angelikawurzel",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-aetherische-oele.jpg?v=1794677692&width=1400"
      }
    ]
  },
  {
    "handle": "respirax-produktfamilie",
    "title": "Respirax",
    "category": "Atemwege",
    "cat": "atemwege",
    "short": "Unterstützt die Atemwege, fördert die Auswurffrequenz.",
    "packshot": "../slideshow-media/packshots/Inuvet_Respirax_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Pellets",
        "caption": "Pellets – direkt füttern oder unter das Futter mischen",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Respirax_Pelets_1zu1.png",
        "imageFallback": null,
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Respirax_Pelets_1zu1.mp4"
      },
      {
        "name": "Paste",
        "caption": "Paste mit Dosierapplikator – direkt ins Maul oder übers Futter",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Respirax_Fluid_1zu1.png",
        "imageFallback": null,
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Respirax_Fluid_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Respirax_3000px_COL_260810.jpg?v=1794484083&width=1800",
    "ingredients": [
      {
        "name": "Coriolus versicolor",
        "latin": "gemahlen",
        "summary": "Der Vitalpilz Coriolus versicolor wird unterstützend zur Stärkung des gesamten Organismus eingesetzt.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-coriolus-versicolor-v3.jpg?v=1795544874&width=1400"
      },
      {
        "name": "Chaga",
        "latin": "gemahlen",
        "summary": "Der Vitalpilz Chaga kann das Immunsystem stärken und antioxidativ wirken. Durch das spezielle Herstellungsverfahren, das Shellbroken-Verfahren, wird die Bioverfügbarkeit des Chagas verbessert.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-chaga-v3.jpg?v=1795544894&width=1400"
      },
      {
        "name": "L-Lysin",
        "latin": "",
        "summary": "L-Lysin eine essenzielle Aminosäure, die der Körper nicht selbst produzieren kann, stärkt das Immunsystem und ist wichtig für zahlreiche Körperfunktionen.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-l-lysin.jpg?v=1794677739&width=1400"
      }
    ]
  },
  {
    "handle": "renax-pulver",
    "title": "Renax Pulver",
    "category": "Niere",
    "cat": "niere",
    "short": "Bindet Phosphate im Darm. Unterstützt die normale Nierenfunktion. Für Allergiker geeignet.",
    "packshot": "../slideshow-media/packshots/Inuvet_Renax_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Renax_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Renax_Pulver_1zu1_0e34a94a-e859-4817-96fd-0b6d39a14661.png?v=1794489633&width=1400",
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Renax_Pulver_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Renax_3000px_COL_260810.jpg?v=1794485466&width=1800",
    "ingredients": [
      {
        "name": "Cordyceps sinensis gemahlen",
        "latin": "",
        "summary": "Cordyceps sinensis gemahlen wird traditionell als Vitalpilz verwendet. Durch das Shellbroken-Verfahren wird der Pilz besonders fein gemahlen, wodurch die Aufnahme der enthaltenen Nährstoffe optimiert wird.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-cordyceps-sinensis-gemahlen-v3.jpg?v=1795544884&width=1400"
      },
      {
        "name": "Mariendistel-Extrakt",
        "latin": "Silybum marianum",
        "summary": "Mariendistel-Extrakt wird traditionell zur Unterstützung der normalen Leberfunktion eingesetzt.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-mariendistel-extrakt.jpg?v=1794677724&width=1400"
      },
      {
        "name": "Inulin",
        "latin": "Präbiotikum",
        "summary": "Inulin gehört zu der Gattung der Präbiotika, die durch körpereigene Enzyme nicht verdaulich sind und damit ein fermentierbares Substrat für die Bakterien der intestinalen Flora darstellen.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-inulin.jpg?v=1794664745&width=1400"
      }
    ]
  },
  {
    "handle": "struvex-produktfamilie",
    "title": "Struvex",
    "category": "Blase",
    "cat": "blase",
    "short": "Zur Absenkung des pH-Wertes im Urin. Zur Auflösung und Ausspülung von Struvit-Kristallen. Für Mehrkatzenhaushalte – als Alternative zur harnsteinauflösenden Diät.",
    "packshot": "../slideshow-media/packshots/Inuvet_Struvex_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Struvex_Tabletten_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Struvex_Tabletten_1zu1.png?v=1794483873&width=1400",
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Struvex_Tabletten_1zu1.mp4"
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Struvex_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Struvex_Pulver_1zu1.png?v=1794483872&width=1400",
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Struvex_Pulver_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Struvex_3000px_COL_260810.jpg?v=1794483819&width=1800",
    "ingredients": [
      {
        "name": "Polyporus umbellatus",
        "latin": "",
        "summary": "Der Vitalpilz Polyporus umbellatus wird bei Blasenkristallen empfohlen. Durch das sogenannte Shellbroken-Verfahren wird der Pilz besonders fein gemahlen, wodurch die Zellwände aufgebrochen werden.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-polyporus-umbellatus.jpg?v=1794677724&width=1400"
      },
      {
        "name": "Methionin",
        "latin": "",
        "summary": "Methionin führt zu einer Säuerung des Harns. Durch die Senkung des pH-Wertes in den sauren Bereich kann die Auflösung von Struvit-Steinen gefördert und ihre Bestandteile über den Urin ausgeschieden werden.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-methionin.jpg?v=1794677723&width=1400"
      },
      {
        "name": "Brennnessel-Extrakt",
        "latin": "Urtica diocia",
        "summary": "Die Brennnessel besitzt eine diuretische Wirkung, welche das Abklingen von Entzündungen unterstützt.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-brennnessel-extrakt.jpg?v=1794677723&width=1400"
      }
    ]
  },
  {
    "handle": "vesica-produktfamilie",
    "title": "Vesica",
    "category": "Blase",
    "cat": "blase",
    "short": "Fördert die Blasen- und Harnwegsfunktionen langfristig. Ergänzend zur blasenfreundlichen Nahrung. Durchspült die ableitenden Harnwege.",
    "packshot": "../slideshow-media/packshots/Inuvet_Vesica_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Vesica_Tabletten_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Vesica_Tabletten_1zu1.png?v=1794481676&width=1400",
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Vesica_Tabletten_1zu1.mp4"
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Vesica_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Vesica_Pulver_1zu1.png?v=1794481683&width=1400",
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Vesica_Pulver_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Vesica_3000px_COL_260810.jpg?v=1794482603&width=1800",
    "ingredients": [
      {
        "name": "Preiselbeeren-Extrakt",
        "latin": "Vaccinium vitis-idaea",
        "summary": "Preiselbeeren enthalten Vitamine, Mineralstoffe und ernährungsphysiologisch wertvolle pflanzliche Sekundärstoffe (Flavonoide).",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-preiselbeeren-extrakt.jpg?v=1794677723&width=1400"
      },
      {
        "name": "D-Mannose",
        "latin": "",
        "summary": "D-Mannose ist ein Zucker, der bei Irritationen der Blase eingesetzt wird und die körpereigene Abwehr gegen eindringende und bereits vorhandene Keime unterstützt.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-d-mannose.jpg?v=1794677723&width=1400"
      },
      {
        "name": "Löwenzahn-Extrakt",
        "latin": "Taraxacum officinale",
        "summary": "Dem Löwenzahn und vor allem seiner Wurzel wird eine diuretische Eigenschaft zugeschrieben. Hierfür sind vermutlich die enthaltenen Sesquiterpenlactone und der hohe Kaliumgehalt verantwortlich.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-loewenzahn-extrakt.jpg?v=1794677723&width=1400"
      }
    ]
  },
  {
    "handle": "vesicat-produktfamilie",
    "title": "Vesicat",
    "category": "Blase",
    "cat": "blase",
    "short": "Unterstützt Harnwege und Blase der Katze. Stärkt die Funktion des Immunsystems.",
    "packshot": "../slideshow-media/packshots/Inuvet_Vesicat_2_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Vesicat_Tabletten_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Vesicat_Tabletten_1zu1.png?v=1794481762&width=1400",
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Vesicat_Tabletten_1zu1.mp4"
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Vesicat_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Vesicat_Pulver_1zu1.png?v=1794481753&width=1400",
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Vesicat_Pulver_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Vesicat_3000px_COL_260810.jpg?v=1794481621&width=1800",
    "ingredients": [
      {
        "name": "Polyporus umbellatus",
        "latin": "",
        "summary": "Der Vitalpilz Polyporus umbellatus wird bei Blasenkristallen empfohlen. Durch das sogenannte Shellbroken-Verfahren wird der Pilz besonders fein gemahlen, wodurch die Zellwände aufgebrochen werden.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-polyporus-umbellatus.jpg?v=1794677724&width=1400"
      },
      {
        "name": "N-Acetyl-D-Glucosamin",
        "latin": "",
        "summary": "N-Acetyl-D-Glucosamin ist der Grundbaustein von Glukosaminoglykanen, die einen wesentlichen Bestandteil der Schutzschicht ausmachen, die die Blasenschleimhaut auskleidet, und es gibt Hinweise darauf, dass die orale Einnahme von Glucosamin positive Auswirkungen auf die physiologische Funktion des Uroepithels haben kann.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-n-acetyl-d-glucosamin.jpg?v=1794677739&width=1400"
      },
      {
        "name": "Goldrutenkraut",
        "latin": "Solidago virgaurea",
        "summary": "Goldrutenkraut zeichnet sich durch seine diuretische Wirkung aus, die zur Durchspülung des Harntrakts beiträgt. Goldrutenkraut besitzt krampflösende Eigenschaften.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-goldrutenkraut.jpg?v=1794677740&width=1400"
      }
    ]
  },
  {
    "handle": "diabex-produktfamilie",
    "title": "Diabex",
    "category": "Bauchspeicheldrüse",
    "cat": "bauchspeichel",
    "short": "Unterstützung bei der Regulierung des Blutzuckerspiegels.",
    "packshot": "../slideshow-media/packshots/Inuvet_Diabex_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Diabex_Tabletten_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Diabex_Tabletten_1zu1.png?v=1794492452&width=1400",
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Diabex_Tabletten_1zu1.mp4"
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Diabex_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Diabex_Pulver_1zu1.png?v=1794492401&width=1400",
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Diabex_Pulver_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Diabex_3000px_COL_260810.jpg?v=1794492412&width=1800",
    "ingredients": [
      {
        "name": "Agaricus blazei Murrill gemahlen",
        "latin": "",
        "summary": "Agaricus blazei Murrill gemahlen ist immunologisch aktiv und wirkt immunstimulierend und -modulierend. Zudem kann er die körperliche und geistige Widerstandsfähigkeit erhöhen.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-agaricus-blazei-murrill-gemahlen-v3.jpg?v=1795544856&width=1400"
      },
      {
        "name": "Milchprotein Hydrolysat",
        "latin": "",
        "summary": "Milchprotein Hydrolysat hat einen Einfluss auf die Spaltung von Kohlenhydraten im Darm. Es kann dabei unterstützen, die Kohlendyrataufnahme aus dem Darm zu verringern und führt so dazu, dass der Blutzuckerspiegel nach Mahlzeiten weniger stark ansteigt.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-milchprotein-hydrolysat.jpg?v=1794677692&width=1400"
      },
      {
        "name": "Inulin",
        "latin": "Präbiotikum",
        "summary": "Inulin gehört zu der Gattung der Präbiotika, die durch körpereigene Enzyme nicht verdaulich sind und damit ein fermentierbares Substrat für die Bakterien der intestinalen Flora darstellen.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-inulin.jpg?v=1794664745&width=1400"
      }
    ]
  },
  {
    "handle": "inzym-pulver",
    "title": "Inzym Pulver",
    "category": "Bauchspeicheldrüse",
    "cat": "bauchspeichel",
    "short": "Natürliche Enzyme zur Unterstützung der Bauchspeicheldrüse",
    "packshot": "../slideshow-media/packshots/Inuvet_Inzym_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Inzym_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Inzym_Pulver_1zu1.png?v=1794487754&width=1400",
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Inzym_Pulver_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Inzym_3000px_COL_260810.jpg?v=1794487764&width=1800",
    "ingredients": [
      {
        "name": "Japanische Reispilzerzeugnisse",
        "latin": "",
        "summary": "Fermentierungserzeugnisse der japanischen Reispilze Aspergillus oryzae und Rhizopus oryzae.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-japanische-reispilzerzeugnisse.jpg?v=1794677739&width=1400"
      },
      {
        "name": "Karottenpulver",
        "latin": "",
        "summary": "Karottenpulver dient als natürlicher Geschmacksverbesserer und liefert Ballaststoffe, die die Verdauung und die Darmbakterien unterstützen.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-karotte-getrocknet-gemahlen.jpg?v=1794664810&width=1400"
      },
      {
        "name": "Vitamin B12",
        "latin": "",
        "summary": "Das Produkt liefert zusätzliches Vitamin B12 zur Unterstützung des allgemeinen Stoffwechsels und der Vitalität.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-vitamin-b12.jpg?v=1794677739&width=1400"
      }
    ]
  },
  {
    "handle": "o-max",
    "title": "O-max Öl",
    "category": "Fettsäuren",
    "cat": "fettsaeuren",
    "short": "Deckt den Omega-3 Bedarf dauerhaft. Algenöl mit DHA und EPA.",
    "packshot": "../slideshow-media/packshots/Inuvet_O-max_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Öl",
        "caption": "Geschmacklich optimiertes Algenöl – per Dosierspritze oder übers Futter",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_O-Max_Öl_1zu1.png",
        "imageFallback": null,
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_O-Max_Öl_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_O-max_3000px_COL_260810.jpg?v=1794486465&width=1800",
    "ingredients": [
      {
        "name": "Algenöl",
        "latin": "aus Schizochytrium sp.",
        "summary": "Schizochytrium sp. ist eine Micromeeresalge mit einem natürlichen hohen Anteil an den essentiellen Fettsäuren DHA und EPA.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-algenoel.jpg?v=1794664724&width=1400"
      }
    ]
  },
  {
    "handle": "pregnol-produktfamilie",
    "title": "Pregnol",
    "category": "Hormone",
    "cat": "hormone",
    "short": "Unterstützt die Regeneration nach der Läufigkeit, kann Prolaktinbildung vermindern & den Entzündungsstoffwechsel unterstützen",
    "packshot": "../slideshow-media/packshots/Inuvet_Pregnol_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Pregnol_Tabletten_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Pregnol_Tabletten_1zu1.png?v=1794485720&width=1400",
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Pregnol_Tabletten_1zu1.mp4"
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Pregnol_Pulver_1zu1.png",
        "imageFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Pregnol_Pulver_1zu1.png?v=1794485720&width=1400",
        "video": "../slideshow-media/formen/Neue_Farben/Inuvet_Einzelprodukt_Pregnol_Pulver_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Pregnol_3000px_COL_260810.jpg?v=1794485702&width=1800",
    "ingredients": [
      {
        "name": "Mönchspfeffer",
        "latin": "Vitex agnus-castus",
        "summary": "Mönchspfeffer kann die Prolaktinbildung vermindern und so einer unerwünschten Milchproduktion und damit verbundenen möglichen Schwellung der Milchleiste entgegenwirken.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-moenchspfeffer.jpg?v=1794677724&width=1400"
      },
      {
        "name": "Himbeerblätter",
        "latin": "Rubus idaeus",
        "summary": "Himbeerblätter können bei der Regeneration nach der Läufigkeit unterstützen und die Gebärmutter stärken.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-himbeerblaetter.jpg?v=1794677724&width=1400"
      },
      {
        "name": "Salbeiblätter",
        "latin": "Salvia officinalis",
        "summary": "Der natürliche Rückgang der Milchbildung kann durch Salbeiblätter unterstützt werden und dadurch helfen, Schwellungen der Milchleiste zu reduzieren. Zudem können Salbeiblätter den Entzündungsstoffwechsel unterstützen.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-salbeiblaetter.jpg?v=1794677724&width=1400"
      }
    ]
  },
  {
    "handle": "otex",
    "title": "Otex Fluid",
    "category": "Ohren",
    "cat": "ohren",
    "short": "Reinigt Ohren sanft und mildert Juckreiz. Schafft ein unwirtliches Klima für Milben, Pilze und Bakterien.",
    "packshot": "../slideshow-media/packshots/Inuvet_Otex_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Fluid",
        "caption": "Ohrreiniger – in den Gehörgang geben und sanft einmassieren",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Otex_Fluid_1zu1.png",
        "imageFallback": null,
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Otex_Fluid_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Otex_3000px_COL_260810.jpg?v=1794486379&width=1800",
    "ingredients": [
      {
        "name": "Zaubernuss-Extrakt",
        "latin": "Hamamelis virginiana",
        "summary": "Zaubernuss-Extrakt kann Juckreiz beruhigen.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-zaubernuss-extrakt.jpg?v=1794677692&width=1400"
      },
      {
        "name": "Italienische Strohblume",
        "latin": "",
        "summary": "Die italienische Strohblume, auch Immortelle genannt, hat ausgleichende und hautberuhigende Eigenschaften. Zudem kann sie die Durchblutung anregen und fördert den Lymphabfluss.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-italienische-strohblume.jpg?v=1794677692&width=1400"
      },
      {
        "name": "Zitronensäure",
        "latin": "",
        "summary": "Zitronensäure mindert den Ph-Wert im Ohr und sorgt so für ein unangenehmes Klima für Milben, Pilze und Bakterien.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-zitronensaeure.jpg?v=1794677692&width=1400"
      }
    ]
  },
  {
    "handle": "otysan",
    "title": "Otysan Fluid",
    "category": "Ohren",
    "cat": "ohren",
    "short": "Zur Hautregeneration. Einfach zu dosieren, auch in Ohren und Hautfalten. Niedriger pH-Wert (2,8) verhindert das Wachstum von Malassezien.",
    "packshot": "../slideshow-media/packshots/Inuvet_Otysan_3000px_COL_261117.jpg",
    "forms": [
      {
        "name": "Fluid",
        "caption": "Pumpflasche – einfach zu dosieren, auch in Ohren und Hautfalten",
        "image": "../slideshow-media/formen/Inuvet_Einzelprodukt_Otysan_Fluid_1zu1.png",
        "imageFallback": null,
        "video": "../slideshow-media/formen/Inuvet_Einzelprodukt_Otysan_Fluid_1zu1.mp4"
      }
    ],
    "packshotFallback": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Otysan_3000px_COL_260810.jpg?v=1794486209&width=1800",
    "ingredients": [
      {
        "name": "Manuka-Honig",
        "latin": "MGO 514+",
        "summary": "Manuka-Honig wird in Neuseeland von Honigbienen aus der Südseemyrte gewonnen und wird dort seit vielen Generationen verwendet.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-manuka-honig.jpg?v=1794677692&width=1400"
      },
      {
        "name": "Ringelblumen-Extrakt",
        "latin": "Calendula officinalis flores",
        "summary": "Neben den ausgeprägten pflegenden Eigenschaften kann die Ringelblume gereizte Stellen beruhigen.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-ringelblumen-extrakt.jpg?v=1794677692&width=1400"
      },
      {
        "name": "Milchsäure",
        "latin": "Acidum lacticum, pH-Wert: 2,8",
        "summary": "Die Milchsäure senkt den pH-Wert (pH 2,8) auf ein für Malassezien und auch für Bakterien unwirtliches Milieu.",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/inhaltsstoff-milchsaeure.jpg?v=1794677692&width=1400"
      }
    ]
  }
];
