let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let dungeon = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  level: Number,
  monsters: [],
  boss: {}, 
  treasure: [],
  gold: Number,
});

let Dungeon = mongoose.model("Dungeon", dungeon);

module.exports = Dungeon;
