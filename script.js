function afficherPlanning(data) {
  const div = document.getElementById("planning");
  div.innerHTML = "";

  data.forEach(slot => {
    const slotDiv = document.createElement("div");
    slotDiv.className = "slot";

    // ✅ Sécurisation : si slot.inscrits n'existe pas, on met un tableau vide
    const inscrits = Array.isArray(slot.inscrits) ? slot.inscrits : [];

    const info = document.createElement("span");
    info.textContent = `${slot.heure} — ${inscrits.length}/2 inscrits (${inscrits.join(", ")})`;

    const btn = document.createElement("button");
    btn.textContent = "S'inscrire";
    btn.disabled = inscrits.length >= 2;
    btn.onclick = async () => {
      const nom = prompt("Entrez votre nom :");
      if (!nom) return;
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ heure: slot.heure, nom }),
      });
      const text = await response.text();
      if (text === "OK") {
        alert("Inscription réussie !");
        chargerPlanning();
      } else if (text === "Complet") {
        alert("Désolé, ce créneau est déjà complet !");
        chargerPlanning();
      } else {
        alert("Erreur lors de l'inscription.");
      }
    };

    slotDiv.append(info, btn);
    div.appendChild(slotDiv);
  });
}
