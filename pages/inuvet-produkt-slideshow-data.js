/* inuvet-produkt-slideshow-data.js — Snapshot der Shop-Daten (Inuvet-Store, Admin API).
 * Stand: 2026-11-19. Quelle je Feld:
 *   title = Produkttitel · category = custom.kategorie · cat = Kategorie-Collection (Handle = Farb-Token)
 *   short = custom.short_description (Fallback custom.kurzbeschreibung) · packshot = Hauptbild
 *   forms = Galerie-Bilder „Inuvet_Einzelprodukt_*“ + Bildunterschrift aus custom.pdp_gallery_captions
 *   video = Darreichungs-Animation (mp4), sofern vorhanden; sonst wird das Bild animiert.
 * Produktarchiv und Produkte ohne Galerie-Captions sind ausgelassen. */
window.SLIDESHOW_PRODUCTS = [
  {
    "handle": "calmin-balance-produktfamilie",
    "title": "Calmin balance",
    "category": "Stress",
    "cat": "stress",
    "short": "Zur Förderung des allgemeinen Wohlbefindens in anspruchsvollen Situationen, wie zum Beispiel bei Autofahrten, einem Umzug oder einer Trennung.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Calmin_Balance_3000px_COL_260810.jpg?v=1794493590&width=1800",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Calmin_Tabletten_1zu1.png?v=1794493581&width=1400",
        "video": "../assets/brands/inuvet/images/Calmin_Packshot_02.mp4"
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Calmin_Pulver_1zu1.png?v=1794493581&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "hepax-produktfamilie",
    "title": "Hepax",
    "category": "Leber",
    "cat": "leber",
    "short": "Unterstützt die Leber. Lange Reichweite dank hoher Dosierung.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Hepax_3000px_COL_260810.jpg?v=1794488787&width=1800",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Hepax_Tabletten_1zu1.png?v=1794488805&width=1400",
        "video": "../assets/brands/inuvet/images/Hepax_Packshot_03.mp4"
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Hepax_Pulver_1zu1.png?v=1794488804&width=1400",
        "video": "../assets/brands/inuvet/images/Hepax_Packshot_02.mp4"
      }
    ]
  },
  {
    "handle": "hypolene-produktfamilie",
    "title": "Hypolene",
    "category": "Gelenke",
    "cat": "gelenke",
    "short": "Unterstützt den Bewegungsapparat. Bei stark beanspruchten Gelenken. Für die Langzeitgabe oder als Kur geeignet.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Hypolene_3000px_COL_260810.jpg?v=1794488658&width=1800",
    "forms": []
  },
  {
    "handle": "neurasyn-pea-pulver",
    "title": "Neurasyn PEA Pulver",
    "category": "Gelenke",
    "cat": "gelenke",
    "short": "Zur Unterstützung des Wohlbefindens bei besonderen körperlichen und nervlichen Belastungen. Mit ultramikronisiertem PEA.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Neurasyn_3000px_COL_260810.jpg?v=1794486661&width=1800",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Neurasyn_Pulver_1zu1.png?v=1794486650&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "cortisan",
    "title": "Cortisan Öl-Komplex",
    "category": "Immunsystem",
    "cat": "immun",
    "short": "Hohe Bioverfügbarkeit durch Solubilisierung.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Cortisan_3000px_COL_260810.jpg?v=1794493278&width=1800",
    "forms": []
  },
  {
    "handle": "power",
    "title": "Power Pulver",
    "category": "Immunsystem",
    "cat": "immun",
    "short": "Für ein starkes Immunsystem. Mit Vitalpilzen und Huminsäure. Allergikergeeignet.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Power_3000px_COL_260810.jpg?v=1794486049&width=1800",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Power_Pulver_1zu1.png?v=1794486019&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "inucardin-produktfamilie",
    "title": "InuCardin",
    "category": "Herz",
    "cat": "herz",
    "short": "Unterstützt das Herz-Kreislauf-System. Für alle Senioren. Auch zur Langzeitgabe.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_InuCardin_3000px_COL_260810.jpg?v=1794488280&width=1800",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Inucardin_Tabletten_1zu1.png?v=1794488269&width=1400",
        "video": null
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Inucardin_Pulver_1zu1.png?v=1794488269&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "enterogast-akut-produktfamilie",
    "title": "EnteroGast akut",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "3 Phasen Wirkung: adstringierend, absorbierend, aufbauend. Lange Reichweite dank hoher Dosierung.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_EnteroGast_Akut_3000px_COL_260810.jpg?v=1794490536&width=1800",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_EnterogastAkut_Tabletten_1zu1.png?v=1794490526&width=1400",
        "video": null
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_EnterogastAkut_Pulver_03_1zu1.png?v=1794490526&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "floracomplex-produktfamilie",
    "title": "FloraComplex",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "Unterstützt den Aufbau der Darmflora. Enthält Sonnenhut-Extrakt (Echinacea). Auch während oder nach der Medikamentengabe.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_FloraComplex_P_T_3000px_COL_261028.jpg?v=1794490100&width=1800",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_FloraComplex_Tabletten_1zu1.png?v=1794489918&width=1400",
        "video": null
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_FloraComplex_Pulver_1zu1.png?v=1794489916&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "floracomplex2",
    "title": "FloraComplex²",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "Unterstützt den Aufbau der Darmflora. Enthält zwei Bakterienstämme probiotischer Kulturen. Allergiker- und diabetikergeeignet.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_FloraComplex2_3000px_COL_260810.jpg?v=1794490022&width=1800",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_FloraComplex2_Pulver_1zu1.png?v=1794489916&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "floracomplex3",
    "title": "FloraComplex³ Pulver",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "Unterstützt den Aufbau der Darmflora. Enthält drei Bakterienstämme probiotischer Kulturen. Allergiker- und diabetikergeeignet.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_FloraComplex3_3000px_COL_260810.jpg?v=1794488935&width=1800",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_FloraComplex_Pulver_1zu1.png?v=1794489916&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "ibedex",
    "title": "Ibedex Pulver",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "Zur Stärkung der Darmfunktionen und des Mikrobioms. Für die perfekte Kotkonsistenz. Allergikergeeignet.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Ibedex_3000px_COL_260810.jpg?v=1794488356&width=1800",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Ibedex_Pulver_1zu1_e86b0619-e9fb-430d-a09d-abcf4c4d4d40.png?v=1794489847&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "kolax",
    "title": "Kolax Öl-Komplex",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "Unterstützt die Magen- und Darmfunktion z.B. nach Narkosen. Schon vor Tierärzt*innen im Stall.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Kolax_3000px_COL_260810.jpg?v=1794487459&width=1800",
    "forms": []
  },
  {
    "handle": "laxin",
    "title": "Laxin Pulver",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "Ideal bei Verstopfung. Unterstützt Verdauung und Entgiftung. Lactulose – ohne Alkohol und Konservierungsstoffe.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Laxin_3000px_COL_260810.jpg?v=1794487368&width=1800",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Laxin_Pulver_1zu1_bacc788c-b8fc-4ed0-bad7-fcfcb7e70c3a.png?v=1794489749&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "vomisan-produktfamilie",
    "title": "VomiSan",
    "category": "Magen & Darm",
    "cat": "magendarm",
    "short": "Legt sich beruhigend auf die Magenschleimhaut. Zu jedem Schmerzmittel und Antibiotikum. Zur Langzeitgabe geeignet.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_VomiSan_3000px_COL_260810.jpg?v=1794481111&width=1800",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Vomisan_Tabletten_1zu1_2767b3c3-248e-4a02-aadf-987da05e3093.png?v=1794489137&width=1400",
        "video": null
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Vomisan_Pulver_02_1zu1_5c2b7f8a-96bd-434a-af6b-82dc48869af8.png?v=1794489183&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "dermin",
    "title": "Dermin Pflege-Emulsion",
    "category": "Haut & Fell",
    "cat": "haut",
    "short": "Beruhigt juckende und gereizte Haut. Mit CBD, Aloe Vera, Ceramiden und PEA.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Dermin_3000px_COL_260810.jpg?v=1794492652&width=1800",
    "forms": []
  },
  {
    "handle": "manukalind-produktfamilie",
    "title": "ManukaLind",
    "category": "Haut & Fell",
    "cat": "haut",
    "short": "Zur Unterstützung der Hautregeneration. Ätherische Öle weisen Insekten ab und reduzieren Ablecken.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_ManukaLind_3000px_COL_260810.jpg?v=1794487199&width=1800",
    "forms": []
  },
  {
    "handle": "respirax-produktfamilie",
    "title": "Respirax",
    "category": "Atemwege",
    "cat": "atemwege",
    "short": "Unterstützt die Atemwege, fördert die Auswurffrequenz.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Respirax_3000px_COL_260810.jpg?v=1794484083&width=1800",
    "forms": []
  },
  {
    "handle": "renax-pulver",
    "title": "Renax Pulver",
    "category": "Niere",
    "cat": "niere",
    "short": "Bindet Phosphate im Darm. Unterstützt die normale Nierenfunktion. Für Allergiker geeignet.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Renax_3000px_COL_260810.jpg?v=1794485466&width=1800",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Renax_Pulver_1zu1_0e34a94a-e859-4817-96fd-0b6d39a14661.png?v=1794489633&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "struvex-produktfamilie",
    "title": "Struvex",
    "category": "Blase",
    "cat": "blase",
    "short": "Zur Absenkung des pH-Wertes im Urin. Zur Auflösung und Ausspülung von Struvit-Kristallen. Für Mehrkatzenhaushalte – als Alternative zur harnsteinauflösenden Diät.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Struvex_3000px_COL_260810.jpg?v=1794483819&width=1800",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Struvex_Tabletten_1zu1.png?v=1794483873&width=1400",
        "video": null
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Struvex_Pulver_1zu1.png?v=1794483872&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "vesica-produktfamilie",
    "title": "Vesica",
    "category": "Blase",
    "cat": "blase",
    "short": "Fördert die Blasen- und Harnwegsfunktionen langfristig. Ergänzend zur blasenfreundlichen Nahrung. Durchspült die ableitenden Harnwege.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Vesica_3000px_COL_260810.jpg?v=1794482603&width=1800",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Vesica_Tabletten_1zu1.png?v=1794481676&width=1400",
        "video": null
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Vesica_Pulver_1zu1.png?v=1794481683&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "vesicat-produktfamilie",
    "title": "Vesicat",
    "category": "Blase",
    "cat": "blase",
    "short": "Unterstützt Harnwege und Blase der Katze. Stärkt die Funktion des Immunsystems.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Vesicat_3000px_COL_260810.jpg?v=1794481621&width=1800",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Vesicat_Tabletten_1zu1.png?v=1794481762&width=1400",
        "video": "https://cdn.shopify.com/videos/c/vp/27896fe13fc1415b94ec81b5906a553f/27896fe13fc1415b94ec81b5906a553f.HD-720p-4.5Mbps-101037245.mp4"
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Vesicat_Pulver_1zu1.png?v=1794481753&width=1400",
        "video": "https://cdn.shopify.com/videos/c/vp/54634251c2eb44f4bd954e32ac45fc98/54634251c2eb44f4bd954e32ac45fc98.HD-720p-4.5Mbps-101037221.mp4"
      }
    ]
  },
  {
    "handle": "diabex-produktfamilie",
    "title": "Diabex",
    "category": "Bauchspeicheldrüse",
    "cat": "bauchspeichel",
    "short": "Unterstützung bei der Regulierung des Blutzuckerspiegels.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Diabex_3000px_COL_260810.jpg?v=1794492412&width=1800",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Diabex_Tabletten_1zu1.png?v=1794492452&width=1400",
        "video": null
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Diabex_Pulver_1zu1.png?v=1794492401&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "inzym-pulver",
    "title": "Inzym Pulver",
    "category": "Bauchspeicheldrüse",
    "cat": "bauchspeichel",
    "short": "Natürliche Enzyme zur Unterstützung der Bauchspeicheldrüse",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Inzym_3000px_COL_260810.jpg?v=1794487764&width=1800",
    "forms": [
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Inzym_Pulver_1zu1.png?v=1794487754&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "o-max",
    "title": "O-max Öl",
    "category": "Fettsäuren",
    "cat": "fettsaeuren",
    "short": "Deckt den Omega-3 Bedarf dauerhaft. Algenöl mit DHA und EPA.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_O-max_3000px_COL_260810.jpg?v=1794486465&width=1800",
    "forms": []
  },
  {
    "handle": "pregnol-produktfamilie",
    "title": "Pregnol",
    "category": "Hormone",
    "cat": "hormone",
    "short": "Unterstützt die Regeneration nach der Läufigkeit, kann Prolaktinbildung vermindern & den Entzündungsstoffwechsel unterstützen",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Pregnol_3000px_COL_260810.jpg?v=1794485702&width=1800",
    "forms": [
      {
        "name": "Tabletten",
        "caption": "Teilbare Tabletten mit hoher Akzeptanz",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Pregnol_Tabletten_1zu1.png?v=1794485720&width=1400",
        "video": null
      },
      {
        "name": "Pulver",
        "caption": "Wohlschmeckendes Pulver – einfache Gabe über das Futter",
        "image": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Einzelprodukt_Pregnol_Pulver_1zu1.png?v=1794485720&width=1400",
        "video": null
      }
    ]
  },
  {
    "handle": "otex",
    "title": "Otex Fluid",
    "category": "Ohren",
    "cat": "ohren",
    "short": "Reinigt Ohren sanft und mildert Juckreiz. Schafft ein unwirtliches Klima für Milben, Pilze und Bakterien.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Otex_3000px_COL_260810.jpg?v=1794486379&width=1800",
    "forms": []
  },
  {
    "handle": "otysan",
    "title": "Otysan Fluid",
    "category": "Ohren",
    "cat": "ohren",
    "short": "Zur Hautregeneration. Einfach zu dosieren, auch in Ohren und Hautfalten. Niedriger pH-Wert (2,8) verhindert das Wachstum von Malassezien.",
    "packshot": "https://cdn.shopify.com/s/files/1/0827/3648/0599/files/Inuvet_Otysan_3000px_COL_260810.jpg?v=1794486209&width=1800",
    "forms": []
  }
];
