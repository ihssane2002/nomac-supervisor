import React, { useState, useEffect } from "react";
import { Modal, Button, Checkbox, DatePicker, Select } from "antd";
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import moment from "moment";
import _ from "lodash";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Parametres = () => {
  const [visible, setVisible] = useState(false);
  const [selectedParams, setSelectedParams] = useState({
    temperature: true,
    humidity: true,
    pressure: true,
    luminosity: true,
  });
  const [dateRange, setDateRange] = useState([null, null]);
  const [graphTypes, setGraphTypes] = useState({
    temperature: "line",
    humidity: "bar",
    pressure: "area",
    luminosity: "pie",
  });
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/historique")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setFilteredData(filterDataByDate(aggregateDataByTime(data, refreshInterval), dateRange));
      })
      .catch((error) => console.error("Erreur de récupération des données :", error));
  }, [refreshInterval, dateRange]);

  const aggregateDataByTime = (data, interval) => {
    return _.chain(data)
      .map((item) => ({
        ...item,
        time: moment(item.time, "DD/MM/YYYY HH:mm:ss").startOf(interval === 30 ? "minute" : interval === 60 ? "hour" : interval === 300 ? "hour" : interval === 1440 ? "day" : "month").format("YYYY-MM-DD HH:mm"),
      }))
      .groupBy("time")
      .map((group) => {
        const average = (key) => _.meanBy(group, key);
        return {
          time: group[0].time,
          temperature: average("temperature"),
          humidity: average("humidity"),
          pressure: average("pressure"),
          luminosity: average("luminosity"),
        };
      })
      .value();
  };

  const filterDataByDate = (data, dateRange) => {
    if (!dateRange[0] || !dateRange[1]) return data;
    const startDate = moment(dateRange[0]);
    const endDate = moment(dateRange[1]);
    return data.filter(item => {
      const itemDate = moment(item.time);
      return itemDate.isBetween(startDate, endDate, null, '[]'); // inclusif des deux bords
    });
  };

  const handleGraphTypeChange = (param, value) => {
    setGraphTypes({ ...graphTypes, [param]: value });
  };

  const applySettings = () => {
    setFilteredData(filterDataByDate(aggregateDataByTime(data, refreshInterval), dateRange));
    setVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={() => setVisible(true)}>Paramètres</Button>
      <Modal title="Paramètres des graphiques" visible={visible} onCancel={() => setVisible(false)} onOk={applySettings} okText="Appliquer">
        <h3>Sélectionner les paramètres à afficher</h3>
        {Object.keys(selectedParams).map((param) => (
          <Checkbox key={param} checked={selectedParams[param]} onChange={() => setSelectedParams({ ...selectedParams, [param]: !selectedParams[param] })}>
            {param.charAt(0).toUpperCase() + param.slice(1)}
          </Checkbox>
        ))}
        <h3>Plage de dates</h3>
        <RangePicker value={dateRange} onChange={setDateRange} format="YYYY-MM-DD" />
        <h3>Intervalle de mise à jour</h3>
        <Select value={refreshInterval} onChange={setRefreshInterval} style={{ width: "100%" }}>
          <Option value={30}>30 minutes</Option>
          <Option value={60}>1 heure</Option>
          <Option value={300}>5 heures</Option>
          <Option value={1440}>24 heures</Option>
          <Option value={2880}>48 heures</Option>
          <Option value={43200}>1 mois</Option>
        </Select>
        <h3>Choisir le type de graphique pour chaque paramètre</h3>
        {Object.keys(graphTypes).map((param) => (
          <div key={param}>
            <span>{param.charAt(0).toUpperCase() + param.slice(1)} :</span>
            <Select
              value={graphTypes[param]}
              onChange={(value) => handleGraphTypeChange(param, value)}
              style={{ width: "100%", marginBottom: "10px" }}
            >
              <Option value="line">Ligne</Option>
              <Option value="bar">Barres</Option>
              <Option value="area">Aire</Option>
              <Option value="pie">Camembert</Option>
              <Option value="radar">Radar</Option>
            </Select>
          </div>
        ))}
      </Modal>
      <div className="charts">
        {Object.keys(selectedParams).map(
          (param) =>
            selectedParams[param] && (
              <div key={param} className="chart-container">
                <h3>{param.charAt(0).toUpperCase() + param.slice(1)}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  {graphTypes[param] === "line" && (
                    <LineChart data={filteredData}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Line dataKey={param} stroke="#8884d8" />
                    </LineChart>
                  )}
                  {graphTypes[param] === "bar" && (
                    <BarChart data={filteredData}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey={param} fill="#82ca9d" />
                    </BarChart>
                  )}
                  {graphTypes[param] === "area" && (
                    <AreaChart data={filteredData}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Area dataKey={param} fill="#ffc658" />
                    </AreaChart>
                  )}
                  {graphTypes[param] === "pie" && (
                    <PieChart>
                      <Pie data={filteredData} dataKey={param} nameKey="time" cx="50%" cy="50%" outerRadius={80} fill="#ff7300" />
                    </PieChart>
                  )}
                  {graphTypes[param] === "radar" && (
                    <RadarChart outerRadius={90} width={300} height={300} data={filteredData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="time" />
                      <PolarRadiusAxis />
                      <Radar dataKey={param} stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                  )}
                </ResponsiveContainer>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Parametres;
