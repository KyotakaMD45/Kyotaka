async function sendRequest() {
  const API_KEY = "AIzaSyDz13HGa06peRypv6_B-XA9_mXJ9U8ArZk"; // Remplacez par votre clé API Gemini
  const userInput = document.getElementById("userInput").value;
  const responseDiv = document.getElementById("response");
  const sendBtn = document.getElementById("sendBtn");

  // Validation de l'entrée utilisateur
  if (!userInput.trim()) {
    responseDiv.innerHTML = "<strong>Erreur :</strong> Veuillez entrer un texte.";
    return;
  }

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
        body: JSON.stringify({
          prompt: userInput, // Entrée de l'utilisateur
          maxOutputTokens: 100, // Limiter le nombre de tokens dans la réponse
        }),
      }
    );

    // Vérification du statut de la réponse
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    // Traitement de la réponse JSON de l'API
    const data = await response.json();

    // Vérification si la réponse contient des résultats
    if (data && data.candidates && data.candidates.length > 0) {
      const geminiOutput = data.candidates[0].output || "Aucune réponse disponible.";
      responseDiv.innerHTML = `<strong>Gemini :</strong> ${geminiOutput}`;
    } else {
      responseDiv.innerHTML = "<strong>Gemini :</strong> Aucune réponse générée.";
    }

  } catch (error) {
    // Affichage de l'erreur dans la div et dans la console
    responseDiv.innerHTML = "<strong>Erreur :</strong> Impossible de se connecter à l'API. Vérifiez la clé API et la connexion.";
    console.error("Erreur lors de la requête :", error);
  } finally {
    // Réactiver le bouton après le traitement
    sendBtn.disabled = false;
  }
}
