import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DatePicker } from "antd";
import moment from "moment";
import "./Historique.css";

const Historique = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/historique")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setFilteredData(filterByInterval(data, 30)); // Filtrage initial par 30 min
      })
      .catch((error) => console.error("Erreur de récupération des données :", error));
  }, []);

  // Fonction pour filtrer les données en fonction d'un intervalle (30 min par défaut)
  const filterByInterval = (data, intervalMinutes) => {
    const filtered = [];
    let lastTimestamp = null;

    data.forEach((item) => {
      const itemTime = moment(item.time, "DD/MM/YYYY HH:mm:ss");
      if (!lastTimestamp || itemTime.diff(lastTimestamp, "minutes") >= intervalMinutes) {
        filtered.push(item);
        lastTimestamp = itemTime;
      }
    });

    return filtered;
  };

  // Gestion du changement de date
  const handleDateChange = (date, dateString) => {
    if (!date) {
      setFilteredData(filterByInterval(data, 30));
    } else {
      const filtered = data.filter((item) =>
        moment(item.time, "DD/MM/YYYY HH:mm:ss").isSame(dateString, "day")
      );
      setFilteredData(filterByInterval(filtered, 30));
    }
  };

  return (
    <div className="historique">
      <h2>Historique des Données Météo</h2>
      <DatePicker onChange={handleDateChange} />

      {/* Conteneur des graphiques */}
      <div className="charts">
        <div className="chart-container">
          <h3>Température (°C)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#FF5733" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Humidité (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="humidity" stroke="#4CAF50" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Pression (hPa)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pressure" stroke="#2196F3" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Luminosité (lux)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="luminosity" stroke="#FFEB3B" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Historique;
