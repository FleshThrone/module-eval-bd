console.log("Script file is being read!");

// Error handler to catch any loading issues
window.addEventListener("error", function (e) {
  console.error("Error caught:", e.error);
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded!");

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // === Déclarations regroupées ===
  const elLangue = $("#langue");
  const btnISBN = $("#btn-isbn");
  const btnAnalyser = $("#btn-analyser");
  const elAuteur = $("#auteur");
  const elSerie = $("#serie");
  const elEdition = $("#edition");
  const elAnnee = $("#annee");
  const elEtat = $("#etat");
  const elSignature = $("#signature");
  const elMotsCles = $("#motscles");
  const elType = $("#type");
  const elEditeur = $("#editeur");
  const elDedicace = $("#dedicace");
  const wrapDedicaceDetails = $("#dedicace-details-wrap");
  const elExlibris = $("#exlibris");
  const wrapExlibrisDetails = $("#exlibris-details-wrap");
  const exlibrisAlert = $("#exlibris-alert");
  const elNumerotation = $("#numerotation");
  const numerotationError = $("#numerotation-error");
  const elUrl = $("#url");
  const elPlateforme = $("#plateforme");
  const elPrix = $("#prix");
  const elFrais = $("#frais");
  const selPlateforme = $("#plateforme");
  const elPays = $("#pays");
  const wrapDialecte = $("#dialecte-wrap");
  const btnCompare = $("#btn-compare");
  const btnCalcul = $("#btn-calcul");
  const btnExport = $("#btn-export");
  const btnBareme = $("#btn-bareme");
  const fbModeWrap = $("#fb-mode-wrap");

  console.log("All elements declared:", {
    elLangue,
    btnISBN,
    elType,
    elEditeur,
  });

  // Tarifs d'envoi par pays
  const tarifsEnvoi = {
    BE: 5.7,
    FR: 13.5,
    NL: 13.5,
    DE: 13.5,
    LU: 13.5,
    IT: 13.5,
  };

  // Fonction pour mettre à jour les frais d'envoi
  function updateFraisEnvoi() {
    const pays = elPays.value;
    if (tarifsEnvoi[pays] !== undefined) {
      elFrais.value = tarifsEnvoi[pays].toString().replace(".", ",");
    } else {
      elFrais.value = "";
    }
  }

  // Mets à jour les frais quand on change le pays
  if (elPays) {
    elPays.addEventListener("change", updateFraisEnvoi);
    updateFraisEnvoi();
  }

  // Fonction pour afficher les champs selon le profil
  function afficherChampsSelonProfil() {
    const profil = document.querySelector(
      'input[name="profil"]:checked'
    )?.value;

    document.querySelectorAll(".acheteur-only").forEach((el) => {
      el.style.display = profil === "acheteur" ? "" : "none";
    });

    document.querySelectorAll(".vendeur-only").forEach((el) => {
      el.style.display = profil === "vendeur" ? "" : "none";
    });

    // Mise en avant visuelle des résultats
    document
      .querySelectorAll(".result-item")
      .forEach((x) => x.classList.remove("on"));
    if (profil === "acheteur") {
      document.querySelector(".result-item.acheteur")?.classList.add("on");
    } else {
      document.querySelector(".result-item.vendeur")?.classList.add("on");
    }

    // Réordonner la zone "Résultats"
    const results = document.querySelector(".results");
    const acheteur = results?.querySelector(".result-item.acheteur");
    const vendeur = results?.querySelector(".result-item.vendeur");
    if (results && acheteur && vendeur) {
      results.prepend(profil === "acheteur" ? acheteur : vendeur);
    }
  }

  // Mets à jour à chaque changement de profil
  document.querySelectorAll('input[name="profil"]').forEach(function (el) {
    el.addEventListener("change", afficherChampsSelonProfil);
  });

  // Initialiser au chargement
  afficherChampsSelonProfil();

  // Gestion de la langue et dialecte
  if (elLangue && wrapDialecte) {
    elLangue.addEventListener("change", function () {
      wrapDialecte.hidden = elLangue.value !== "dialecte";
    });
  }

  // Gestion de la dédicace
  if (elDedicace && wrapDedicaceDetails) {
    elDedicace.addEventListener("change", function () {
      if (elDedicace.value === "oui") {
        wrapDedicaceDetails.style.display = "";
      } else {
        wrapDedicaceDetails.style.display = "none";
        wrapDedicaceDetails
          .querySelectorAll('input[type="radio"]')
          .forEach((rb) => (rb.checked = false));
      }
    });
  }

  // Gestion des ex-libris
  if (elExlibris && wrapExlibrisDetails) {
    elExlibris.addEventListener("input", function () {
      const val = parseInt(elExlibris.value, 10);

      if (val === 1) {
        wrapExlibrisDetails.style.display = "";
      } else {
        wrapExlibrisDetails.style.display = "none";
        wrapExlibrisDetails
          .querySelectorAll('input[type="radio"]')
          .forEach((rb) => (rb.checked = false));
      }
    });
  }

  // Gestion de la numérotation
  if (elNumerotation && numerotationError) {
    elNumerotation.addEventListener("input", function () {
      if (!elNumerotation.value) {
        numerotationError.style.display = "none";
        elNumerotation.setCustomValidity("");
        return;
      }

      const regex = /^\d+\/\d+$/;
      if (regex.test(elNumerotation.value)) {
        numerotationError.style.display = "none";
        elNumerotation.setCustomValidity("");
      } else {
        numerotationError.style.display = "";
        elNumerotation.setCustomValidity(
          "Format attendu : deux nombres séparés par un slash"
        );
      }
    });
  }

  // Fonction pour remplir les mots-clés automatiquement
  function remplirMotsCles() {
    const infos = [
      elSerie?.value,
      elAuteur?.value,
      elEditeur?.value,
      elEdition?.value,
      elAnnee?.value,
      elLangue?.value,
      elEtat?.value,
      elSignature?.value,
      elDedicace?.value,
      elExlibris?.value,
      elNumerotation?.value,
    ].filter(Boolean);

    if (elMotsCles) {
      elMotsCles.value = infos.join(" ");
    }
  }

  // Attacher les événements pour mettre à jour les mots-clés
  [
    elSerie,
    elAuteur,
    elEditeur,
    elEdition,
    elAnnee,
    elLangue,
    elEtat,
    elSignature,
    elDedicace,
    elExlibris,
    elNumerotation,
  ].forEach(function (el) {
    if (el) el.addEventListener("input", remplirMotsCles);
  });

  remplirMotsCles();

  // Liste complète des éditeurs
  const allEditeurs = [
    "12 Bis",
    "21g",
    "6 pieds sous terre",
    "9e Store",
    "Actes Sud",
    "Akata",
    "Akileos",
    "Albert René",
    "Albin Michel",
    "Allary éditions",
    "Ankama",
    "Apocalypse",
    "Arenes",
    "Art & BD",
    "Atrabile",
    "Bamboo",
    "BD Cul",
    "BD Must",
    "Bigfoot",
    "Bigger Boat",
    "Black & White",
    "Bliss Comics",
    "Booken Manga",
    "Bruno Graff",
    "Cambourakis",
    "Casterman",
    "Cerises & Coquelicots",
    "Charrette",
    "Cinebook",
    "Clair de lune",
    "Comics USA",
    "Comix Buro",
    "Cornélius",
    "Daniel Maghen",
    "Dargaud",
    "Delcourt",
    "Denoël Graphics",
    "Des Ronds Dans l'O",
    "Diabolo",
    "Drakoo",
    "Dupuis",
    "Dynamite",
    "Ego comme X",
    "Eyrolles",
    "Fei",
    "FLBLB",
    "Fleurus",
    "Fluide Glacial",
    "French Eyes",
    "Frimousse",
    "Futuropolis",
    "Fêlés",
    "Gallimard BD",
    "Glénat",
    "Golden Creek Studio",
    "Grand Angle",
    "Graton",
    "Hachette",
    "Hazan",
    "Hexagon Comics",
    "Hors Collection",
    "Hot Manga",
    "Huginn & Muninn",
    "Idées Plus",
    "Imho",
    "J'Ai Lu",
    "Jungle",
    "Jyb Aventures",
    "Kami",
    "Kana",
    "Kantik",
    "Kazé",
    "Kennes Editions",
    "Ki-oon",
    "Komikku",
    "Kotoji",
    "Kramiek",
    "Kurokawa",
    "Kwari",
    "Kymera",
    "L'An 2",
    "L'Association",
    "L'association",
    "L'employé du Moi",
    "L'Employé du Moi",
    "La Boîte à bulles",
    "La Cinquième Couche",
    "La Pastèque",
    "Lapin",
    "Le Cycliste",
    "Le Lombard",
    "Le Lézard Noir",
    "Le Moule A Gaufres",
    "Le Téméraire",
    "Leblon Delienne",
    "Les Deux Royaumes",
    "Les Enfants Rouges",
    "Les Humanoïdes Associés",
    "Les Requins Marteaux",
    "Les Rêveurs",
    "Les Échappés",
    "Les éditions Paquet",
    "Lombard",
    "Long Bec",
    "Loup",
    "Lucky Comics",
    "Lug",
    "Magic Strip",
    "Makaka",
    "Manolosanctis",
    "Marabout",
    "Marsu Productions",
    "Marvel France",
    "Michel LAFON",
    "Milady Graphics",
    "Milan",
    "Misma",
    "Monsieur Pop Corn",
    "Mosquito",
    "Moulinsart",
    "Même pas mal",
    "Nickel",
    "Niffle",
    "Niho Niba",
    "Nobi Nobi",
    "Nobrow",
    "Norma",
    "Novedi",
    "Nuclea",
    "Original Watts",
    "Ototo",
    "P'Tit Glenat",
    "P'Tit Louis",
    "Panini Comics",
    "Petit Pierre & Ieiazel",
    "Petit à petit",
    "Physalis",
    "Pika",
    "Pixi",
    "Plastoy",
    "Pocket",
    "Point Image",
    "Poivre Et Sel",
    "Presque lune",
    "Presse Aventure",
    "Rackham",
    "Rebecca Rils",
    "Rombaldi",
    "Rue De Sèvres",
    "Samji",
    "Sandawe",
    "Sarbacane",
    "Seiko",
    "Semic",
    "Sergio Bonelli Editore",
    "Seuil",
    "Six Pieds Sous Terre",
    "Snorgleux",
    "Société Parisienne D'Édition",
    "Soleil",
    "Steinkis",
    "Tabary",
    "Tabou",
    "Taifu Comics",
    "Tanibis",
    "Tapages Nocturnes",
    "Tartamudo",
    "Theloma",
    "Tonkam",
    "Toth Bd",
    "Triomphe",
    "Urban China",
    "Urban Comics",
    "Urban Comics Press",
    "Usa Vagabondages",
    "Vents d'Ouest",
    "Vertige Graphic",
    "Vide Cocagne",
    "Vraoum",
    "Vraoum !",
    "Warum",
    "Wetta",
    "Worldwide",
    "Xiao Pan",
    "Zanpano",
    "Zenda",
    "Zephyr",
    "Ça et Là",
  ];

  // Éditeurs par type
  const editeursParType = {
    "franco-belge": [
      "Akileos",
      "Akata",
      "Albert René",
      "Albin Michel",
      "Ankama",
      "Atrabile",
      "Bamboo",
      "BD Cul",
      "BD Must",
      "Casterman",
      "Clair de lune",
      "Cornélius",
      "Dargaud",
      "Delcourt",
      "Dupuis",
      "Futuropolis",
      "Gallimard BD",
      "Glénat",
      "Grand Angle",
      "La Boîte à bulles",
      "La Cinquième Couche",
      "La Pastèque",
      "Le Lombard",
      "Les Humanoïdes Associés",
      "Petit à petit",
      "Rue De Sèvres",
      "Soleil",
      "Vents d'Ouest",
      "Vertige Graphic",
      "Vide Cocagne",
    ].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" })),

    mangas: [
      "Akata",
      "Ankama",
      "Booken Manga",
      "Clair de lune",
      "Delcourt",
      "Fei",
      "Glénat",
      "Hot Manga",
      "Imho",
      "Kana",
      "Kazé",
      "Ki-oon",
      "Komikku",
      "Kotoji",
      "Kurokawa",
      "Niho Niba",
      "Nobi Nobi",
      "Ototo",
      "Panini Comics",
      "Petit à petit",
      "Pika",
      "Seiko",
      "Soleil",
      "Taifu Comics",
      "Tonkam",
      "Xiao Pan",
    ].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" })),

    comics: [
      "Akileos",
      "Bliss Comics",
      "Comics USA",
      "Dargaud",
      "Delcourt",
      "Glénat",
      "Les Humanoïdes Associés",
      "Marvel France",
      "Panini Comics",
      "Semic",
      "Urban Comics",
      "Urban Comics Press",
      "Wetta",
      "Worldwide",
      "Zenda",
    ].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" })),
  };

  // Fonction pour mettre à jour la liste des éditeurs
  function updateEditeurs() {
    console.log("updateEditeurs appelé");

    if (!elType || !elEditeur) {
      console.warn("Elements type ou editeur non trouvés");
      return;
    }

    const typeChoisi = elType.value || "franco-belge";
    let options = "<option>— Choisir —</option>";

    const associés = editeursParType[typeChoisi] || [];
    const triésTous = allEditeurs
      .slice()
      .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
    const nonIdentifiés = triésTous.filter((e) => !associés.includes(e));

    // Ajout des éditeurs associés
    associés.forEach((editeur) => {
      options += `<option>${editeur}</option>`;
    });

    // Séparation visuelle
    if (associés.length > 0 && nonIdentifiés.length > 0) {
      options += `<option disabled>──────────────</option>`;
      options += `<option disabled>— Autres éditeurs —</option>`;
      options += `<option disabled>──────────────</option>`;
    }

    // Ajout des éditeurs non identifiés
    nonIdentifiés.forEach((editeur) => {
      options += `<option>${editeur}</option>`;
    });

    elEditeur.innerHTML = options;
  }

  // Attacher l'événement de changement de type
  if (elType) {
    elType.addEventListener("change", updateEditeurs);
  }

  // Initialiser la liste des éditeurs
  updateEditeurs();

  // Gestion du bouton ISBN
  if (btnISBN) {
    btnISBN.addEventListener("click", async () => {
      console.log("ISBN cliqué");
      const isbnField = $("#isbn");
      if (!isbnField) return;

      const raw = isbnField.value.trim().replace(/[^0-9Xx]/g, "");
      if (!raw) {
        alert("Indique un ISBN (ex. 978… )");
        return;
      }

      try {
        const r = await fetch(
          `https://openlibrary.org/isbn/${encodeURIComponent(raw)}.json`,
          { cache: "no-store" }
        );
        if (!r.ok) throw new Error("ISBN non trouvé");
        const data = await r.json();

        if (elSerie && data.title) elSerie.value = data.title;
        if (elAnnee && data.publish_date) {
          const year = data.publish_date.match(/\d{4}/)?.[0];
          if (year) elAnnee.value = year;
        }
        if (
          elEditeur &&
          Array.isArray(data.publishers) &&
          data.publishers.length
        ) {
          elEditeur.value = data.publishers[0];
        }
        if (
          elLangue &&
          Array.isArray(data.languages) &&
          data.languages[0]?.key
        ) {
          const map = {
            "/languages/fre": "français",
            "/languages/dut": "néerlandais",
            "/languages/ger": "allemand",
            "/languages/eng": "anglais",
            "/languages/spa": "espagnol",
            "/languages/ita": "italien",
            "/languages/jpn": "japonais",
            "/languages/kor": "coréen",
            "/languages/por": "portugais",
          };
          const k = data.languages[0].key;
          if (map[k]) elLangue.value = map[k];
        }

        alert(
          "Champs remplis depuis Open Library. Vérifie et complète si besoin."
        );
      } catch (e) {
        alert(
          "Impossible de récupérer l'ISBN via Open Library. Tu peux compléter à la main."
        );
      }
    });
  }

  // Inputs pour le calcul
  const inputs = {
    prix: elPrix,
    frais: elFrais,
    commissionPct: $("#commissionPct"),
    commissionFixe: $("#commissionFixe"),
    taxesPct: $("#taxesPct"),
    buyerPct: $("#buyerPct"),
    buyerFixe: $("#buyerFixe"),
  };

  const outs = {
    reco: $("#out-reco"),
    range: $("#out-range"),
    net: $("#out-net"),
    buyer: $("#out-buyer"),
  };

  // Utilitaires
  const toFloat = (v) => {
    if (typeof v === "number") return v;
    if (!v) return 0;
    v = String(v).replace(/\s/g, "").replace(",", ".");
    const x = parseFloat(v);
    return Number.isFinite(x) ? x : 0;
  };

  const euro = (n) =>
    new Intl.NumberFormat("fr-BE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(n || 0);

  function setNumber(input, n) {
    if (!input) {
      console.warn("Champ non trouvé pour setNumber !");
      return;
    }
    input.value = typeof n === "number" ? n.toString().replace(".", ",") : n;
  }

  // Fonction de calcul principal
  function calculer() {
    console.log("calculer appelé");

    if (!inputs.prix || !inputs.frais) {
      console.warn("Champs prix ou frais non trouvés");
      return;
    }

    const prix = toFloat(inputs.prix.value);
    const frais = toFloat(inputs.frais.value);
    const commissionPct = toFloat(inputs.commissionPct?.value) / 100;
    const commissionFixe = toFloat(inputs.commissionFixe?.value);
    const taxesPct = toFloat(inputs.taxesPct?.value) / 100;
    const buyerPct = toFloat(inputs.buyerPct?.value) / 100;
    const buyerFixe = toFloat(inputs.buyerFixe?.value);

    const commissionMontant = prix * commissionPct;
    const taxesMontant = prix * taxesPct;

    const netVendeur = Math.max(
      0,
      prix - commissionMontant - commissionFixe - taxesMontant
    );

    const coutAcheteur = Math.max(
      0,
      prix + frais + taxesMontant + prix * buyerPct + buyerFixe
    );

    const reco = prix;
    const low = Math.max(0, prix * 0.95);
    const high = prix * 1.05;

    if (outs.reco) outs.reco.textContent = euro(reco);
    if (outs.range) outs.range.textContent = `${euro(low)} — ${euro(high)}`;
    if (outs.net) outs.net.textContent = euro(netVendeur);
    if (outs.buyer) outs.buyer.textContent = euro(coutAcheteur);
  }

  // Barèmes par plateforme
  function applyPlatformPreset() {
    const p = selPlateforme?.value;
    if (!p) return;

    if (fbModeWrap) fbModeWrap.hidden = true;

    // Reset
    setNumber(inputs.commissionPct, 0);
    setNumber(inputs.commissionFixe, 0);
    setNumber(inputs.buyerPct, 0);
    setNumber(inputs.buyerFixe, 0);

    if (p === "eBay") {
      setNumber(inputs.commissionPct, 13.6);
      setNumber(inputs.commissionFixe, 0.3);
    } else if (p === "Catawiki") {
      setNumber(inputs.commissionPct, 12.5);
      setNumber(inputs.commissionFixe, 0.0);
      setNumber(inputs.buyerPct, 9.0);
      setNumber(inputs.buyerFixe, 3.0);
    } else if (p === "Delcampe") {
      setNumber(inputs.commissionPct, 0);
      setNumber(inputs.commissionFixe, 0);
      setNumber(inputs.buyerPct, 10.0);
      setNumber(inputs.buyerFixe, 0.3);
    } else if (p === "2ememain.be") {
      setNumber(inputs.commissionPct, 0);
      setNumber(inputs.commissionFixe, 0);
      setNumber(inputs.buyerPct, 0);
      setNumber(inputs.buyerFixe, 0);
    } else if (p === "Facebook Marketplace") {
      if (fbModeWrap) fbModeWrap.hidden = false;
      const mode = document.querySelector(
        'input[name="fbmode"]:checked'
      )?.value;
      if (mode === "local") {
        setNumber(inputs.commissionPct, 0);
        setNumber(inputs.commissionFixe, 0);
      } else {
        setNumber(inputs.commissionPct, 10.0);
        setNumber(inputs.commissionFixe, 0);
      }
      setNumber(inputs.buyerPct, 0);
      setNumber(inputs.buyerFixe, 0);
    } else if (p === "Vinted") {
      setNumber(inputs.commissionPct, 0);
      setNumber(inputs.commissionFixe, 0);
      setNumber(inputs.buyerPct, 5.0);
      setNumber(inputs.buyerFixe, 0.7);
    }

    calculer();
  }

  // Attacher les événements
  if (btnBareme) btnBareme.addEventListener("click", applyPlatformPreset);
  if (selPlateforme)
    selPlateforme.addEventListener("change", applyPlatformPreset);

  $$('input[name="fbmode"]').forEach((el) =>
    el.addEventListener("change", applyPlatformPreset)
  );

  if (btnCalcul) btnCalcul.addEventListener("click", calculer);

  // Comparaison multi-sites
  function buildQuery() {
    const parts = [
      elMotsCles?.value,
      elSerie?.value,
      elEditeur?.value,
      elEdition?.value,
      elAnnee?.value,
      elLangue?.value,
    ].filter(Boolean);
    return parts.join(" ").trim();
  }

  function openIfChecked(id, url) {
    const cb = document.querySelector(id);
    if (cb && cb.checked) window.open(url, "_blank", "noopener,noreferrer");
  }

  if (btnCompare) {
    btnCompare.addEventListener("click", () => {
      const q = encodeURIComponent(buildQuery());
      openIfChecked("#chk-2ememain", `https://www.2ememain.be/l?q=${q}`);
      openIfChecked(
        "#chk-delcampe",
        `https://www.delcampe.net/fr_BE/collectables/search?searchString=${q}`
      );
      openIfChecked(
        "#chk-catawiki",
        `https://www.catawiki.com/en/l?search=${q}`
      );
      openIfChecked(
        "#chk-ebay",
        `https://www.ebay.be/sch/i.html?_nkw=${q}&LH_Sold=1&LH_Complete=1`
      );
      openIfChecked(
        "#chk-fb",
        `https://www.facebook.com/marketplace/?query=${q}`
      );
      openIfChecked(
        "#chk-vinted",
        `https://www.vinted.be/catalog?search_text=${q}`
      );
    });
  }

  // Analyse → notes
  if (btnAnalyser) {
    btnAnalyser.addEventListener("click", () => {
      const resume = [
        `Type: ${elType?.value || "—"}`,
        `Éditeur: ${elEditeur?.value || "—"}`,
        `Série/Issue: ${elSerie?.value || "—"}`,
        `Édition: ${elEdition?.value || "—"}`,
        `Année: ${elAnnee?.value || "—"}`,
        `Langue: ${elLangue?.value || "—"}${
          elLangue?.value === "dialecte" && $("#dialecte")?.value
            ? " (" + $("#dialecte").value + ")"
            : ""
        }`,
        `État: ${elEtat?.value || "—"}`,
        `Signature: ${elSignature?.value || "—"}`,
        `Ex-libris: ${elExlibris?.value || "—"}`,
        `Numérotation: ${elNumerotation?.value || "—"}`,
        `Plateforme: ${elPlateforme?.value || "—"}`,
        `Prix demandé: ${elPrix?.value || "0"} €`,
        `Frais d'envoi: ${elFrais?.value || "0"} €`,
        `Commission vendeur: ${inputs.commissionPct?.value || "0"} % + ${
          inputs.commissionFixe?.value || "0"
        } €`,
        `Taxes: ${inputs.taxesPct?.value || "0"} %`,
        `Frais acheteur: ${inputs.buyerPct?.value || "0"} % + ${
          inputs.buyerFixe?.value || "0"
        } €`,
      ].join("\n");

      const n = $("#notes");
      if (n) {
        n.value = (n.value ? n.value + "\n\n" : "") + "— Résumé —\n" + resume;
      }
    });
  }

  // Export HTML
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      calculer();

      const data = {
        type: elType?.value || "",
        editeur: elEditeur?.value || "",
        serie: elSerie?.value || "",
        edition: elEdition?.value || "",
        annee: elAnnee?.value || "",
        langue: elLangue?.value || "",
        dialecte: $("#dialecte")?.value || "",
        isbn: $("#isbn")?.value || "",
        etat: elEtat?.value || "",
        signature: elSignature?.value || "",
        dedicace: elDedicace?.value || "",
        exlibris: elExlibris?.value || "",
        numerotation: elNumerotation?.value || "",
        motscles: elMotsCles?.value || "",
        plateforme: elPlateforme?.value || "",
        url: elUrl?.value || "",
        prix: elPrix?.value || "",
        frais: elFrais?.value || "",
        commissionPct: inputs.commissionPct?.value || "",
        commissionFixe: inputs.commissionFixe?.value || "",
        taxesPct: inputs.taxesPct?.value || "",
        buyerPct: inputs.buyerPct?.value || "",
        buyerFixe: inputs.buyerFixe?.value || "",
        reco: outs.reco?.textContent || "",
        range: outs.range?.textContent || "",
        net: outs.net?.textContent || "",
        buyer: outs.buyer?.textContent || "",
        notes: $("#notes")?.value || "",
        profil: $('input[name="profil"]:checked')?.value || "acheteur",
      };

      const html = exportHTML(data);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "fiche-agent-bd.html";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    });
  }

  function exportHTML(data) {
    return `<!doctype html>
<html lang="fr-BE">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fiche Agent BD — ${escapeHtml(data.serie || "sans titre")}</title>
<style>
 body{font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;margin:2rem;}
 h1{margin:.2rem 0 1rem}
 .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
 .card{border:1px solid #ddd;border-radius:10px;padding:12px}
 dt{font-weight:700} dd{margin:0 0 .6rem}
 .results{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;margin-top:8px}
 .pill{border:1px solid #ccc;border-radius:999px;padding:.4rem .7rem;background:#f8f8fb}
 .muted{color:#666}.small{font-size:.9rem}
</style>
</head>
<body>
  <h1>Fiche Agent BD</h1>
<p class="muted small">Profil&nbsp;: ${escapeHtml(
      data.profil || "acheteur"
    )}</p>

  <section class="card">
    <h2>Infos</h2>
    <dl class="grid">
      <div><dt>Type</dt><dd>${escapeHtml(data.type || "—")}</dd></div>
      <div><dt>Éditeur</dt><dd>${escapeHtml(data.editeur || "—")}</dd></div>
      <div><dt>Série / Issue</dt><dd>${escapeHtml(data.serie || "—")}</dd></div>
      <div><dt>Édition</dt><dd>${escapeHtml(data.edition || "—")}</dd></div>
      <div><dt>Année</dt><dd>${escapeHtml(data.annee || "—")}</dd></div>
      <div><dt>Langue</dt><dd>${escapeHtml(
        (data.langue || "—") +
          (data.langue === "dialecte" && data.dialecte
            ? " (" + data.dialecte + ")"
            : "")
      )}</dd></div>
      <div><dt>ISBN</dt><dd>${escapeHtml(data.isbn || "—")}</dd></div>
    </dl>
  </section>

  <section class="card">
    <h2>Caractéristiques & Authenticité</h2>
    <dl>
      <dt>État</dt><dd>${nl2br(escapeHtml(data.etat || "—"))}</dd>
      <dt>Signature / dédicace</dt><dd>${escapeHtml(data.signature || "—")}</dd>
      <dt>Ex‑libris</dt><dd>${escapeHtml(data.exlibris || "—")}</dd>
      <dt>Numérotation</dt><dd>${escapeHtml(data.numerotation || "—")}</dd>
    </dl>
  </section>

  <section class="card">
    <h2>Prix & Vente</h2>
    <dl class="grid">
      <div><dt>Mots‑clés</dt><dd>${escapeHtml(data.motscles || "—")}</dd></div>
      <div><dt>Plateforme</dt><dd>${escapeHtml(
        data.plateforme || "—"
      )}</dd></div>
      <div><dt>URL annonce</dt><dd>${
        data.url
          ? '<a href="' +
            escapeHtml(data.url) +
            '" target="_blank" rel="noopener noreferrer">' +
            escapeHtml(data.url) +
            "</a>"
          : "—"
      }</dd></div>
      <div><dt>Prix demandé</dt><dd>${escapeHtml(data.prix || "—")} €</dd></div>
      <div><dt>Frais d'envoi</dt><dd>${escapeHtml(
        data.frais || "—"
      )} €</dd></div>
      <div><dt>Commission vendeur</dt><dd>${escapeHtml(
        data.commissionPct || "0"
      )} % + ${escapeHtml(data.commissionFixe || "0")} €</dd></div>
      <div><dt>Taxes</dt><dd>${escapeHtml(data.taxesPct || "0")} %</dd></div>
      <div><dt>Frais acheteur</dt><dd>${escapeHtml(
        data.buyerPct || "0"
      )} % + ${escapeHtml(data.buyerFixe || "0")} €</dd></div>
    </dl>
    <div class="results">
      <div class="pill"><strong>Prix juste recommandé</strong>: ${escapeHtml(
        data.reco
      )}</div>
      <div class="pill"><strong>Fourchette</strong>: ${escapeHtml(
        data.range
      )}</div>
      <div class="pill"><strong>Net vendeur</strong>: ${escapeHtml(
        data.net
      )}</div>
      <div class="pill"><strong>Coût total acheteur</strong>: ${escapeHtml(
        data.buyer
      )}</div>
    </div>
  </section>

  <section class="card">
    <h2>Notes</h2>
    <div>${nl2br(escapeHtml(data.notes || "—"))}</div>
  </section>
</body>
</html>`;
  }

  function escapeHtml(str) {
    return String(str).replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m])
    );
  }

  function nl2br(str) {
    return String(str).replace(/\n/g, "<br>");
  }

  // Initialisation finale
  applyPlatformPreset();

  console.log("Script initialization complete!");
});
