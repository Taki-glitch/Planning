// URL de ton script Google Apps (⚠️ à remplacer par la tienne)
const API_URL = "https://script.google.com/macros/s/AKfycbxYDp2DOqOg5IbstIwFoJe6wtIxTLQFgwTe0wpVVPLmM-SKtTd5IgX_JmGIbvtgW0iU/exec";

/**
 * Charge le planning depuis l'API Google Apps Script
 */
async function chargerPlanning() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    afficherPlanning(data);
  } catch (err) {
    console.error("Erreur lors du chargement du planning :", err);
    alert("Impossible de charger le planning. Vérifie l'API_URL ou la connexion.");
  }
}

/**
 * Affiche les créneaux du planning dans la page
 * @param {Array} data - Liste des créneaux [{heure, inscrits}]
 */
function afficherPlanning(data) {
  console.log("DATA REÇUE :", data); // 🔍 pour debug
  const div = document.getElementById("planning");
  div.innerHTML = "";

  // Vérifie que data est bien un tableau
  if (!Array.isArray(data)) {
    div.textContent = "Erreur : données invalides reçues depuis le serveur.";
    return;
  }

  // Boucle sur chaque créneau
  data.forEach(slot => {
    const slotDiv = document.createElement("div");
    slotDiv.className = "slot";

    // 🔒 Sécurité : si slot.inscrits n'existe pas, on met un tableau vide
    const inscrits = Array.isArray(slot.inscrits) ? slot.inscrits : [];

    // Info du créneau
    const info = document.createElement("span");
    info.textContent = `${slot.heure} — ${inscrits.length}/2 inscrits (${inscrits.join(", ") || "aucun"})`;

    // Bouton d'inscription
    const btn = document.createElement("button");
    btn.textContent = "S'inscrire";
    btn.disabled = inscrits.length >= 2;
    btn.onclick = async () => {
      const nom = prompt("Entrez votre nom :");
      if (!nom) return;

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          body: JSON.stringify({ heure: slot.heure, nom }),
        });
        const text = await response.text();

        if (text === "OK") {
          alert("✅ Inscription réussie !");
          chargerPlanning();
        } else if (text === "Complet") {
          alert("⚠️ Désolé, ce créneau est déjà complet !");
          chargerPlanning();
        } else {
          alert("❌ Erreur lors de l'inscription.");
        }
      } catch (err) {
        console.error("Erreur lors de l'inscription :", err);
        alert("Erreur de communication avec le serveur.");
      }
    };

    // Ajout des éléments à la page
    slotDiv.append(info, btn);
    div.appendChild(slotDiv);
  });
}

// Lancement automatique au chargement
chargerPlanning();
