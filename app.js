// Charger la version du bot
async function loadVersion() {
  const versionElement = document.getElementById('version');

  try {
    const response = await fetch('http://localhost:3000/api/version');
    const data = await response.json();
    versionElement.textContent = `Version : ${data.version} - ${data.description}`;
  } catch (error) {
    versionElement.textContent = "Version : Impossible de récupérer la version.";
    console.error("Erreur lors du chargement de la version :", error);
  }
}

// Charger l'historique des versions
async function loadChangelog() {
  const changelogList = document.getElementById('changelog-list');

  try {
    const response = await fetch('http://localhost:3000/api/changelog');
    const data = await response.json();

    changelogList.innerHTML = data
      .map(
        (entry) => `
        <li>
          <strong>Version ${entry.version} (${entry.date})</strong><br>
          ${entry.description}
        </li>
      `
      )
      .join('');
  } catch (error) {
    changelogList.innerHTML = "<li>Impossible de récupérer l'historique des versions.</li>";
    console.error("Erreur lors du chargement du changelog :", error);
  }
}

// Envoyer une requête à l'API Gemini
async function sendRequest() {
  const userInput = document.getElementById('userInput').value;
  const responseDiv = document.getElementById('response');
  const sendBtn = document.getElementById('sendBtn');

  // Désactiver le bouton pendant le traitement
  sendBtn.disabled = true;
  responseDiv.innerHTML = "<em>Chargement...</em>";

  try {
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userInput })
    });

    const data = await response.json();
    responseDiv.innerHTML = `<strong>Gemini :</strong> ${data.reply || "Erreur dans la réponse."}`;
  } catch (error) {
    responseDiv.innerHTML = "<strong>Erreur :</strong> Impossible de se connecter au serveur.";
    console.error("Erreur lors de la génération :", error);
  } finally {
    sendBtn.disabled = false; // Réactiver le bouton
  }
}

// Charger les données lors du chargement de la page
window.onload = () => {
  loadVersion();
  loadChangelog();
};
