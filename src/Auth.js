 import React, { useState } from "react";
import "./Auth.css"; // Importer le fichier CSS

const Auth = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
    phone: "",
  });

  const [isSignUp, setIsSignUp] = useState(false);

  // Gestion des changements dans les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignUp
      ? "http://localhost:5001/api/auth/signup"
      : "http://localhost:5001/api/auth/signin";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token); // Stocker le token
        localStorage.setItem("user", JSON.stringify(data.user)); // Stocker les infos utilisateur
        onLogin(data.token); // Appeler la fonction onLogin pour mettre à jour l'état du token dans le parent
        // Supprimer l'image de fond après la connexion
        document.body.classList.add("no-background"); // Ajouter la classe pour supprimer le fond
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignUp ? "Inscription" : "Connexion"}</h2>
        <p className="welcome-message">
          Bienvenue à Centrale Noor 1, veuillez vous {isSignUp ? "inscrire" : "connecter"}.
        </p>
        <form onSubmit={handleSubmit}>
          {/* Champs visibles uniquement pour l'inscription */}
          {isSignUp && (
            <>
              <div className="input-group">
                <label>Nom d'utilisateur</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Numéro de téléphone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {/* Champs communs pour la connexion et l'inscription */}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirmation du mot de passe pour l'inscription */}
          {isSignUp && (
            <div className="input-group">
              <label>Confirmation du mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isSignUp ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        {/* Bouton pour basculer entre connexion et inscription */}
        <button onClick={() => setIsSignUp(!isSignUp)} className="switch-btn">
          {isSignUp ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
        </button>
      </div>
    </div>
  );
};

export default Auth; 