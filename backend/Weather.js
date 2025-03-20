const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  time: String,
  temperature: Number,
  humidity: Number,
  pressure: Number,
  luminosity: Number
});

module.exports = mongoose.model("Weather", weatherSchema);
