async function chargerPlanning() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    afficherPlanning(data);
  } catch (err) {
    console.error("Erreur lors du chargement du planning :", err);
    alert("Impossible de charger le planning. Vérifie l'API_URL ou la connexion.");
  }
}

function afficherPlanning(data) {
  const div = document.getElementById("planning");
  div.innerHTML = "";

  data.forEach(slot => {
    const slotDiv = document.createElement("div");
    slotDiv.className = "slot";

    const info = document.createElement("span");
    const nbInscrits = slot.inscrits ? slot.inscrits.length : 0;
    const liste = slot.inscrits && slot.inscrits.length > 0 ? slot.inscrits.join(", ") : "Aucun";
    info.textContent = `${slot.heure} — ${nbInscrits}/2 inscrits (${liste})`;

    const btn = document.createElement("button");
    btn.textContent = "S'inscrire";
    btn.disabled = nbInscrits >= 2;
    btn.onclick = async () => {
      const nom = prompt("Entrez votre nom :");
      if (!nom) return;
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ heure: slot.heure, nom }),
        });
        const text = await response.text();
        if (text.includes("OK")) {
          alert("Inscription réussie !");
        } else if (text.includes("Complet")) {
          alert("Désolé, ce créneau est déjà complet !");
        } else {
          alert("Erreur lors de l'inscription : " + text);
        }
        chargerPlanning();
      } catch (err) {
        alert("Erreur réseau : " + err.message);
      }
    };

    slotDiv.append(info, btn);
    div.appendChild(slotDiv);
  });
}

chargerPlanning();
