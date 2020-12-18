let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let monster = new Schema({
    // Due to some circumstances with our loot system, control what the monster's Id is so we can access it at certain points with less database calls
    _id: { type: String },
    name: { type: String, required: true },
    sprite: { type: String },
    hp: Number,
    xp: Number,
    armor: Number,
    level: Number,
    damageLow: Number,
    damageHigh: Number,
    critChance: Number,
    blockChance: Number, 
    spells: [],
    inventory: [],
    gold: Number,
    taunt: String,
});

let Monster = mongoose.model("Monster", monster);

module.exports = Monster;