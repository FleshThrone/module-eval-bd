const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// === Déclarations regroupées ===
const elLangue = $("#langue");
const btnISBN = $("#btn-isbn");
const btnAnalyser = $("#btn-analyser");
const btnBareme = $("#btn-bareme");
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
// === Fin des déclarations ===
// Fonction pour mettre à jour les frais d’envoi
function updateFraisEnvoi() {
  const pays = elPays.value;
  if (tarifsEnvoi[pays] !== undefined) {
    elFrais.value = tarifsEnvoi[pays].toString().replace(".", ",");
  } else {
    elFrais.value = "";
  }
}

// Mets à jour les frais quand on change le pays
elPays.addEventListener("change", updateFraisEnvoi);

// Mets à jour au chargement
updateFraisEnvoi();

function afficherChampsSelonProfil() {
  const profil = document.querySelector('input[name="profil"]:checked')?.value;
  document.querySelectorAll(".acheteur-only").forEach((el) => {
    el.style.display = profil === "acheteur" ? "" : "none";
  });
  document.querySelectorAll(".vendeur-only").forEach((el) => {
    el.style.display = profil === "vendeur" ? "" : "none";
  });
}
// Mets à jour à chaque changement de profil
document.querySelectorAll('input[name="profil"]').forEach(function (el) {
  el.addEventListener("change", afficherChampsSelonProfil);
});
// Mets à jour au chargement
afficherChampsSelonProfil();
function updateChampsProfil() {
  const profil = document.querySelector('input[name="profil"]:checked')?.value;
  const form = document.getElementById("form-agentbd");
  if (!form) return;
  form.classList.remove("profil-acheteur", "profil-vendeur");
  if (profil === "vendeur") form.classList.add("profil-vendeur");
  else form.classList.add("profil-acheteur");
}

document.querySelectorAll('input[name="profil"]').forEach(function (el) {
  el.addEventListener("change", updateChampsProfil);
});
updateChampsProfil();

// ... le reste de ton script (fonctions, addEventListener, etc.)
// ========== app.js (inline) ==========
(function () {
  // Elements
  const wrapDialecte = $("#dialecte-wrap");
  elLangue.addEventListener("change", function () {
    if (elLangue.value === "dialecte") {
      wrapDialecte.hidden = false;
    } else {
      wrapDialecte.hidden = true;
    }
  });
  const btnCompare = $("#btn-compare");
  const btnCalcul = $("#btn-calcul");
  const btnExport = $("#btn-export");
  btnBareme = $("#btn-bareme");

  elDedicace.addEventListener("change", function () {
    if (elDedicace.value === "oui") {
      wrapDedicaceDetails.style.display = "";
    } else {
      wrapDedicaceDetails.style.display = "none";
      // Optionnel : désélectionner tous les choix si "Non"
      wrapDedicaceDetails
        .querySelectorAll('input[type="radio"]')
        .forEach((rb) => (rb.checked = false));
    }
  });

  elExlibris.addEventListener("input", function () {
    const val = parseInt(elExlibris.value, 10);

    // Affiche le bloc détails UNIQUEMENT si ex-libris = 1
    if (val === 1) {
      wrapExlibrisDetails.style.display = "";
    } else {
      wrapExlibrisDetails.style.display = "none";
      wrapExlibrisDetails
        .querySelectorAll('input[type="radio"]')
        .forEach((rb) => (rb.checked = false));
    }
  });

  elNumerotation.addEventListener("input", function () {
    // Si le champ est vide, pas d’erreur
    if (!elNumerotation.value) {
      numerotationError.style.display = "none";
      elNumerotation.setCustomValidity("");
      return;
    }
    // Vérifie le format nombre/nombre
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
  // Champs du module Achat et vente

  function remplirMotsCles() {
    // On rassemble toutes les infos utiles
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
    ].filter(Boolean); // On enlève les champs vides
    elMotsCles.value = infos.join(" ");
  }
  // À chaque fois qu'on change un champ, on met à jour les mots-clés
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
  // Mets à jour au chargement
  remplirMotsCles();
  // Liste complète des éditeurs triée par ordre alphabétique
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
    "Félés",
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
    "Seikô",
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
    "Urban Comics Press",
    "Urban Comics",
    "Usa Vagabondages",
    "Vents d'Ouest",
    "Vertige Graphic",
    "Vide Cocagne",
    "Vraoum !",
    "Vraoum",
    "Warum",
    "Wetta",
    "Worldwide",
    "Xiao Pan",
    "Zanpano",
    "Zenda",
    "Zephyr",
    "Ça et Là",
  ];

  // Liste des éditeurs par type (triés)
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
      "Black Box",
      "Booken Manga",
      "Clair de lune",
      "Delcourt",
      "Doki-Doki",
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
      "Paquet",
      "Petit à petit",
      "Pika",
      "Seikô",
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
    const elType = document.querySelector("#type");
    const elEditeur = document.querySelector("#editeur");
    const typeChoisi = elType?.value || "franco-belge";

    let options = "<option>— Choisir —</option>";

    const associés = editeursParType[typeChoisi] || [];
    const triésAssociés = associés
      .slice()
      .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
    const triésTous = allEditeurs
      .slice()
      .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
    const nonIdentifiés = triésTous.filter((e) => !triésAssociés.includes(e));

    // Ajout des éditeurs associés
    triésAssociés.forEach((editeur) => {
      options += `<option>${editeur}</option>`;
    });

    // Séparation visuelle
    if (triésAssociés.length > 0 && nonIdentifiés.length > 0) {
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
  document.querySelector("#type").addEventListener("change", updateEditeurs);
  window.addEventListener("DOMContentLoaded", updateEditeurs);
  // Mets à jour la liste des éditeurs quand le type change
  elType.addEventListener("change", updateEditeurs);

  // Mets à jour la liste au chargement de la page
  updateEditeurs();
  const fbModeWrap = $("#fb-mode-wrap");

  const inputs = {
    prix: $("#prix"),
    frais: $("#frais"),
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
  // Applique l'état visuel + masque/affiche les champs + ordre des résultats + scroll
  {
    const evt = new Event("change");
    if (current) {
      current.dispatchEvent(evt);
    }
  }
  // Profil d'usage — mise en avant visuelle
  $$('input[name="profil"]').forEach((r) =>
    r.addEventListener("change", () => {
      // 1) Mise en avant visuelle (comme avant)
      $$(".result-item").forEach((x) => x.classList.remove("on"));
      if (profil === "acheteur") {
        $(".result-item.acheteur")?.classList.add("on");
      } else {
        $(".result-item.vendeur")?.classList.add("on");
      }

      // 2) Masquer/Afficher les champs "Frais acheteur"
      const hide = profil === "vendeur";
      if (fPct) fPct.hidden = hide;
      if (fFixe) fFixe.hidden = hide;

      // 3) Réordonner la zone "Résultats" (mettre la ligne utile en premier)
      const results = document.querySelector(".results");
      const acheteur = results?.querySelector(".result-item.acheteur");
      const vendeur = results?.querySelector(".result-item.vendeur");
      if (results && acheteur && vendeur) {
        results.prepend(profil === "acheteur" ? acheteur : vendeur);
      }

      // 4) Auto-scroll vers la zone utile
      if (profil === "vendeur") {
        document
          .querySelector('section[aria-labelledby="sec-prix"] .fieldset')
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        document
          .querySelector(".results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    })
  );

  // Dialecte
  elLangue.addEventListener("change", () => {
    wrapDialecte.hidden = elLangue.value !== "dialecte";
  });

  // ISBN (Open Library)
  btnISBN.addEventListener("click", async () => {
    const raw = $("#isbn")
      .value.trim()
      .replace(/[^0-9Xx]/g, "");
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
      // Mappages simples
      $("#serie").value = data.title || $("#serie").value;
      $("#annee").value =
        (data.publish_date || "").match(/\d{4}/)?.[0] || $("#annee").value;
      if (Array.isArray(data.publishers) && data.publishers.length) {
        // Choisir le 1er éditeur si présent dans la liste, sinon laisser texte
        $("#editeur").value = data.publishers[0] || $("#editeur").value;
      }
      // Langue (si fournie sous forme d'objets {key:"/languages/fre"})
      if (Array.isArray(data.languages) && data.languages[0]?.key) {
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
        if (map[k]) $("#langue").value = map[k];
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

  // Barèmes par plateforme (préréglages)
  // NB: Ces valeurs sont des *défauts* éditables. Vérifie toujours les conditions/catégories exactes de la plateforme choisie.
  function applyPlatformPreset() {
    const p = selPlateforme.value;
    // reset FB block
    fbModeWrap.hidden = true;

    // Defaults
    setNumber(inputs.commissionPct, 0);
    setNumber(inputs.commissionFixe, 0);
    setNumber(inputs.buyerPct, 0);
    setNumber(inputs.buyerFixe, 0);

    if (p === "eBay") {
      // Générique post 14/02/2025 : 13.6% (categories variables) + fixe ~0.30 € (ajustable)
      setNumber(inputs.commissionPct, 13.6);
      setNumber(inputs.commissionFixe, 0.3);
      // eBay ne prélève pas un "buyer fee" additionnel (hors taxes/TVA/éventuels frais d’import) → laisser buyer=0.
    } else if (p === "Catawiki") {
      // Vendeur
      setNumber(inputs.commissionPct, 12.5);
      setNumber(inputs.commissionFixe, 0.0);
      // Acheteur (Buyer Protection fee)
      setNumber(inputs.buyerPct, 9.0);
      setNumber(inputs.buyerFixe, 3.0);
    } else if (p === "Delcampe") {
      // Côté vendeur : 0 ; côté acheteur : 10% + 0,30 €
      setNumber(inputs.commissionPct, 0);
      setNumber(inputs.commissionFixe, 0);
      setNumber(inputs.buyerPct, 10.0);
      setNumber(inputs.buyerFixe, 0.3);
    } else if (p === "2ememain.be") {
      // Pas de commission/transaction (options de promotion non incluses)
      setNumber(inputs.commissionPct, 0);
      setNumber(inputs.commissionFixe, 0);
      setNumber(inputs.buyerPct, 0);
      setNumber(inputs.buyerFixe, 0);
    } else if (p === "Facebook Marketplace") {
      // Mode local vs shipping
      fbModeWrap.hidden = false;
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
      // Vinted : pas de commission vendeur, mais frais acheteur (exemple : 5% + 0,70 €)
      setNumber(inputs.commissionPct, 0); // Commission vendeur
      setNumber(inputs.commissionFixe, 0);
      setNumber(inputs.buyerPct, 5.0); // Frais acheteur (%) — à adapter si besoin
      setNumber(inputs.buyerFixe, 0.7); // Frais fixe acheteur (€) — à adapter si besoin
    } else {
      // Autre → rien, l'utilisateur remplit
    }
    // recalc à chaud si des valeurs existent
    calculer();
  }

  btnBareme.addEventListener("click", applyPlatformPreset);
  selPlateforme.addEventListener("change", applyPlatformPreset);
  $$('input[name="fbmode"]').forEach((el) =>
    el.addEventListener("change", applyPlatformPreset)
  );

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
  const tarifsEnvoi = {
    BE: 5.7, // Belgique (exemple : bpost colis standard)
    FR: 13.5, // France
    NL: 13.5, // Pays-Bas
    DE: 13.5, // Allemagne
    LU: 13.5, // Luxembourg
    IT: 13.5, // Italie
    // Ajoute d'autres pays si besoin
  };

  // Calcul principal
  function calculer() {
    const prix = toFloat(inputs.prix.value);
    const frais = toFloat(inputs.frais.value);
    const commissionPct = toFloat(inputs.commissionPct.value) / 100;
    const commissionFixe = toFloat(inputs.commissionFixe.value);
    const taxesPct = toFloat(inputs.taxesPct.value) / 100;

    const buyerPct = toFloat(inputs.buyerPct.value) / 100;
    const buyerFixe = toFloat(inputs.buyerFixe.value);

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

    // Prix juste = prix demandé (déclaratif) ; fourchette ±5%
    const reco = prix,
      low = Math.max(0, prix * 0.95),
      high = prix * 1.05;

    outs.reco.textContent = euro(reco);
    outs.range.textContent = `${euro(low)} — ${euro(high)}`;
    outs.net.textContent = euro(netVendeur);
    outs.buyer.textContent = euro(coutAcheteur);
  }
  btnCalcul.addEventListener("click", calculer);

  // Comparaison multi-sites
  function buildQuery() {
    const parts = [
      $("#motscles").value,
      $("#serie").value,
      $("#editeur").value,
      $("#edition").value,
      $("#annee").value,
      $("#langue").value,
    ].filter(Boolean);
    return parts.join(" ").trim();
  }
  function openIfChecked(id, url) {
    const cb = document.querySelector(id);
    if (cb && cb.checked) window.open(url, "_blank", "noopener,noreferrer");
  }
  btnCompare.addEventListener("click", () => {
    const q = encodeURIComponent(buildQuery());
    openIfChecked("#chk-2ememain", `https://www.2ememain.be/l?q=${q}`);
    openIfChecked(
      "#chk-delcampe",
      `https://www.delcampe.net/fr_BE/collectables/search?searchString=${q}`
    );
    openIfChecked("#chk-catawiki", `https://www.catawiki.com/en/l?search=${q}`);
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

  // Analyse → notes
  btnAnalyser.addEventListener("click", () => {
    const resume = [
      `Type: ${$("#type").value || "—"}`,
      `Éditeur: ${$("#editeur").value || "—"}`,
      `Série/Issue: ${$("#serie").value || "—"}`,
      `Édition: ${$("#edition").value || "—"}`,
      `Année: ${$("#annee").value || "—"}`,
      `Langue: ${$("#langue").value || "—"}${
        $("#langue").value === "dialecte" && $("#dialecte").value
          ? " (" + $("#dialecte").value + ")"
          : ""
      }`,
      `État: ${$("#etat").value || "—"}`,
      `Signature: ${$("#signature").value}`,
      `Ex-libris: ${$("#exlibris").value}`,
      `Numérotation: ${$("#numerotation").value || "—"}`,
      `Plateforme: ${$("#plateforme").value || "—"}`,
      `Prix demandé: ${$("#prix").value || "0"} €`,
      `Frais d’envoi: ${$("#frais").value || "0"} €`,
      `Commission vendeur: ${$("#commissionPct").value || "0"} % + ${
        $("#commissionFixe").value || "0"
      } €`,
      `Taxes: ${$("#taxesPct").value || "0"} %`,
      `Frais acheteur: ${$("#buyerPct").value || "0"} % + ${
        $("#buyerFixe").value || "0"
      } €`,
    ].join("\n");
    const n = $("#notes");
    n.value = (n.value ? n.value + "\n\n" : "") + "— Résumé —\n" + resume;
  });

  // Export HTML autonome
  btnExport.addEventListener("click", () => {
    calculer();
    const data = {
      type: $("#type").value,
      editeur: $("#editeur").value,
      serie: $("#serie").value,
      edition: $("#edition").value,
      annee: $("#annee").value,
      langue: $("#langue").value,
      dialecte: $("#dialecte").value,
      isbn: $("#isbn").value,
      etat: $("#etat").value,
      signature: $("#signature").value,
      dedicace: $("#dedicace").value,
      exlibris: $("#exlibris").value,
      numerotation: $("#numerotation").value,
      motscles: $("#motscles").value,
      plateforme: $("#plateforme").value,
      url: $("#url").value,
      prix: $("#prix").value,
      frais: $("#frais").value,
      commissionPct: $("#commissionPct").value,
      commissionFixe: $("#commissionFixe").value,
      taxesPct: $("#taxesPct").value,
      buyerPct: $("#buyerPct").value,
      buyerFixe: $("#buyerFixe").value,
      reco: outs.reco.textContent,
      range: outs.range.textContent,
      net: outs.net.textContent,
      buyer: outs.buyer.textContent,
      notes: $("#notes").value,
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
      <div><dt>Frais d’envoi</dt><dd>${escapeHtml(
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

  // Initial
  applyPlatformPreset();
  afficherChampsSelonProfil();
  updateChampsProfil();
})();
