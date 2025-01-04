async function sendRequest() {
  const API_KEY = "VOTRE_CLE_API"; // Remplacez par votre clé API Gemini
  const userInput = document.getElementById("userInput").value;
  const responseDiv = document.getElementById("response");
  const sendBtn = document.getElementById("sendBtn");

  // Désactiver le bouton pendant le traitement
  sendBtn.disabled = true;
  responseDiv.innerHTML = "<em>Chargement...</em>";

  try {
    // Requête à l'API Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userInput }),
      }
    );

    const data = await response.json();
    responseDiv.innerHTML = `<strong>Gemini :</strong> ${data.candidates?.[0]?.output || "Aucune réponse disponible."}`;
  } catch (error) {
    responseDiv.innerHTML = "<strong>Erreur :</strong> Impossible de se connecter à l'API.";
    console.error("Erreur lors de la requête :", error);
  } finally {
    sendBtn.disabled = false;
  }
}
