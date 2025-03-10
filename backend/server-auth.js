const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// Connexion à MongoDB pour l'authentification
mongoose.connect("mongodb://127.0.0.1:27017/authDB")
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur de connexion à MongoDB:", err));

// Importer les routes d'authentification
const authRoutes = require("./authRoutes");

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Serveur d'authentification démarré sur http://localhost:${PORT}`);
});
