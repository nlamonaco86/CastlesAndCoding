let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let battle = new Schema({
  hero: {},
  monster: {},
  combatLog: [],
  victory: { type: Boolean },
  loot: [],
  message: { type: String }
});

let Battle = mongoose.model("Battle", battle);

module.exports = Battle;
