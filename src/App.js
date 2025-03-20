import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";  // Composant du tableau de bord
import Auth from "./Auth"; // Import du composant Auth

const App = () => {
  const [data, setData] = useState([]);
  const [authToken, setAuthToken] = useState(null); // Pour stocker le token de l'utilisateur

  const handleLogin = (token) => {
    setAuthToken(token); // Mettre à jour le token de l'utilisateur
    localStorage.setItem("authToken", token); // Sauvegarder le token dans le localStorage
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken"); // Supprimer le token lors de la déconnexion
  };

  useEffect(() => {
    // Si un token est trouvé dans localStorage, l'utilisateur est authentifié
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    // Si l'utilisateur est authentifié, récupérer les données météorologiques
    if (authToken) {
      const interval = setInterval(() => {
        const newData = {
          time: new Date().toLocaleString(),
          temperature: Math.random() * 40,
          humidity: Math.random() * 100,
          pressure: 900 + Math.random() * 200,
          luminosity: Math.random() * 10000,
        };

        setData((prevData) => [...prevData.slice(-10), newData]);

        fetch("http://localhost:5000/api/ajouter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newData),
        })
          .then((res) => res.json())
          .then((data) => console.log("Donnée envoyée :", data))
          .catch((error) => console.error("Erreur :", error));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [authToken]);

  return (
    <div>
      {!authToken ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <Dashboard data={data} handleLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
