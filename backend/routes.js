const express = require("express");
const Weather = require("./Weather"); // Assurez-vous que ce fichier contient le modèle Mongoose

const router = express.Router();

// Récupérer toutes les données météo
router.get("/historique", async (req, res) => {
  try {
    const data = await Weather.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
});

// Ajouter une nouvelle donnée météo
router.post("/ajouter", async (req, res) => {
  const { time, temperature, humidity, pressure, luminosity } = req.body;

  try {
    const newData = new Weather({ time, temperature, humidity, pressure, luminosity });
    await newData.save();
    res.status(201).json({ message: "Donnée ajoutée avec succès", newData });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout", error: err });
  }
});

module.exports = router;
