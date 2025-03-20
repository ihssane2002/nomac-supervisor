const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./User");

const router = express.Router();

// Route pour l'inscription (signup)
router.post("/signup", async (req, res) => {
  const { username, email, password, confirmPassword, phone } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Création de l'utilisateur
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone, // Ajout du numéro de téléphone
    });

    await newUser.save();

    // Génération du token
    const token = jwt.sign({ userId: newUser._id }, "secretkey", { expiresIn: "1h" });

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
      user: { username: newUser.username, email: newUser.email, phone: newUser.phone },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

// Route pour la connexion (signin)
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ userId: user._id }, "secretkey", { expiresIn: "1h" });

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: { username: user.username, email: user.email, phone: user.phone },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

module.exports = router;
