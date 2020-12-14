let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let monster = new Schema({
    name: { type: String, required: true },
    sprite: { type: String },
    hp: Number,
    armor: Number,
    level: Number,
    damageLow: Number,
    damageHigh: Number,
    spells: [],
    inventory: [],
    gold: Number,
    taunt: String,
});

let Monster = mongoose.model("Monster", monster);

module.exports = Monster;