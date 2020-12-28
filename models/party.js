let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let party = new Schema({
    name: { type: String, required: true },
    level: Number,
    sprite: "",
    heroes: []
});

let Party = mongoose.model("Party", party);

module.exports = Party;
