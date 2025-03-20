import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./Dashboard.css"; // Fichier CSS pour le style
import Historique from './Historique';
import Parametres from "./Parametres";
import Alertes from "./Alertes";

const Dashboard = ({ data, handleLogout }) => {
  const [activeMenu, setActiveMenu] = useState("accueil"); // Gérer l'élément actif
  const latestData = data.length > 0 ? data[data.length - 1] : { temperature: 0, humidity: 0, pressure: 0, luminosity: 0 };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <div className="dashboard">
      {/* Barre de menu latérale */}
      <aside className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li onClick={() => handleMenuClick("accueil")} className={activeMenu === "accueil" ? "active" : ""}>🏠 Accueil</li>
          <li onClick={() => handleMenuClick("historique")} className={activeMenu === "historique" ? "active" : ""}>📊 Historique</li>
          <li onClick={() => handleMenuClick("parametres")} className={activeMenu === "parametres" ? "active" : ""}>⚙️ Paramètres</li>
          <li onClick={() => handleMenuClick("alertes")} className={activeMenu === "alertes" ? "active" : ""}>🔔 Alertes</li>
          <li onClick={handleLogout} className="logout">🚪 Déconnexion</li> {/* Bouton de déconnexion */}
        </ul>
      </aside>

      {/* Contenu principal */}
      <main className="content">
        <h1>📡 Supervision des données météo</h1>

        {/* Affichage dynamique en fonction du menu sélectionné */}
        {activeMenu === "accueil" && (
          <div>
            {/* Cartes de données */}
            <div className="cards">
              <div className="card temperature">🌡️ Température: {latestData.temperature} °C</div>
              <div className="card humidity">💧 Humidité: {latestData.humidity} %</div>
              <div className="card pressure">⚡ Pression: {latestData.pressure} hPa</div>
              <div className="card luminosity">☀️ Luminosité: {latestData.luminosity} lux</div>
            </div>

            {/* Graphiques */}
            <div className="charts">
              {/* Température */}
              <div className="chart-container">
                <h3>Variation de la Température</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="#FF5733" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Humidité */}
              <div className="chart-container">
                <h3>Variation de l'Humidité</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="humidity" stroke="#3385FF" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Pression */}
              <div className="chart-container">
                <h3>Variation de la Pression</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pressure" stroke="#FF33E3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Luminosité */}
              <div className="chart-container">
                <h3>Variation de la Luminosité</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="luminosity" stroke="#FFD700" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Historique */}
        {activeMenu === "historique" && (
          <Historique data={data} />
        )}

        {/* Paramètres */}
        {activeMenu === "parametres" && (
          <div>
            <h2>Paramètres</h2>
            <Parametres onSettingsChange={(settings) => {
              console.log(settings);
            }} />
          </div>
        )}

        {/* Alertes */}
        {activeMenu === "alertes" && (
          <div>
            <h2>Alertes</h2>
            <Alertes />
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
