const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const version = require("./version.json"); // Fichier version pour la gestion des versions
const changelog = require("./changelog.json"); // Fichier changelog pour l'historique

const app = express();
const PORT = 3000;

// Votre clé API Gemini
const API_KEY = "VOTRE_CLE_API"; // Remplacez par votre clé API Gemini

app.use(bodyParser.json());
app.use(express.static("public")); // Servir les fichiers frontend

// Route pour obtenir la version actuelle
app.get("/api/version", (req, res) => {
  res.json(version);
});

// Route pour obtenir le changelog
app.get("/api/changelog", (req, res) => {
  res.json(changelog);
});

// Route pour interagir avec l'API Gemini
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
      { prompt }
    );

    res.json({ reply: response.data.candidates[0].output || "Réponse vide." });
  } catch (error) {
    console.error("Erreur API Gemini :", error.response?.data || error.message);
    res.status(500).json({ reply: "Erreur avec l'API Gemini." });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
