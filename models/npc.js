let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let npc = new Schema({
    name: { type: String, required: true },
    sprite: { type: String },
    type: { type: String },
    inventory: [],
    gold: Number,
    statements: [],
});

let Npc = mongoose.model("Npc", npc);

module.exports = Npc;
