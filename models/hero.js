let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let hero = new Schema({
  name: { type: String, required: true },
  sprite: { type: String },
  hp: Number,
  armor: Number,
  xp: Number,
  level: Number,
  class: { type: String },
  weapon: { name: { type: String, required: true }, damageLow: Number, damageHigh: Number, type: { type: String } },
  spells: [],
  inventory: [],
  gold: Number,
  lastWords: String,
});

let Hero = mongoose.model("Hero", hero);

module.exports = Hero;
