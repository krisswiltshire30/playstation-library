const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
  {
    name: String,
    platform: String,
    genre: String,
    release_date: Date,
    player_count: Number,
    publisher: String,
    box_art_url: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);