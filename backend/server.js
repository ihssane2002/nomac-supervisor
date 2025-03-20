const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000; // Utiliser un port libre si 5000 est occupé

// Middleware
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/meteoDB") // Remplace par ton URI si nécessaire
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("❌ Erreur de connexion à MongoDB:", err));

// Définir une route de test pour vérifier si le serveur fonctionne
app.get("/", (req, res) => {
  res.send("Serveur backend fonctionnel !");
});

// Importer les routes
const weatherRoutes = require("./routes");
app.use("/api", weatherRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

