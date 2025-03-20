import React, { useState, useEffect } from "react";
import "./Alertes.css";

const Alertes = () => {
  const [alertes, setAlertes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/historique")
      .then((res) => res.json())
      .then((data) => {
        setAlertes(data);
      })
      .catch((error) => console.error("Erreur de récupération des alertes :", error));
  }, []);

  const seuils = {
    temperature: 20,
    humidity: 80,
    pressure: 1015,
    luminosity: 500,
  };

  const formatDate = (dateString) => {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const formattedDate = new Date(`${year}-${month}-${day}T${timePart}`);
    return formattedDate.toLocaleString();
  };

  const alertesCritiques = alertes.filter(alerte =>
    (alerte.temperature !== undefined && alerte.temperature < seuils.temperature) ||
    (alerte.humidity !== undefined && alerte.humidity > seuils.humidity) ||
    (alerte.pressure !== undefined && alerte.pressure < seuils.pressure) ||
    (alerte.luminosity !== undefined && alerte.luminosity < seuils.luminosity)
  );

  return (
    <div className="alertes">
      <h2>Alertes Critiques</h2>
      <div className="alertes-container">
        {alertesCritiques.length > 0 ? (
          alertesCritiques.map((alerte, index) => {
            const formattedDate = formatDate(alerte.time);

            let typeAlerte = "";
            let valeurActuelle = null;
            let seuilCritique = null;

            if (alerte.temperature !== undefined && alerte.temperature < seuils.temperature) {
              typeAlerte = "Température";
              valeurActuelle = alerte.temperature;
              seuilCritique = seuils.temperature;
            } else if (alerte.humidity !== undefined && alerte.humidity > seuils.humidity) {
              typeAlerte = "Humidité";
              valeurActuelle = alerte.humidity;
              seuilCritique = seuils.humidity;
            } else if (alerte.pressure !== undefined && alerte.pressure < seuils.pressure) {
              typeAlerte = "Pression";
              valeurActuelle = alerte.pressure;
              seuilCritique = seuils.pressure;
            } else if (alerte.luminosity !== undefined && alerte.luminosity < seuils.luminosity) {
              typeAlerte = "Luminosité";
              valeurActuelle = alerte.luminosity;
              seuilCritique = seuils.luminosity;
            }

            return (
              <div key={index} className="alerte critical">
                <div className="alerte-header">
                  <h3>{typeAlerte}</h3>
                  <p>{formattedDate}</p>
                </div>
                <div className="alerte-body">
                  <p><strong>Valeur actuelle :</strong> {valeurActuelle}</p>
                  <p><strong>Seuil critique :</strong> {seuilCritique}</p>
                </div>
                <div className="alerte-footer">
                  <p className="alert-warning">Alerte critique! Les capteurs sont en mode de sécurité.</p>
                </div>
              </div>
            );
          })
        ) : (
          <p>Aucune alerte critique à afficher pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default Alertes;
