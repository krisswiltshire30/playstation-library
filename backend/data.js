const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
  {
    id: Number,
    name: String,
    platform: String,
    genre: String,
    release_date: String,
    players: Number,
    publisher: String,
    box_art: String,
  }
);

module.exports = mongoose.model("Data", DataSchema);