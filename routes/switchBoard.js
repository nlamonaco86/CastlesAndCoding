const db = require('../models');

// takes in req.params.Model and returns an object with the 3 pieces of info needed for rendering
const switchBoard = (input) => {
    let object = {
        modelType: '',
        view: '',
        type: ''
    };
    switch (input) {
        case "monster":
            object.modelType = db.Monster;
            object.view = 'monsterViewer';
            object.type = 'monster';
            break;
        case "party":
            object.modelType = db.Party;
            object.view = 'heroViewer';
            object.type = 'party';
            break;
        case "dungeon":
            object.modelType = db.Dungeon;
            object.view = 'dungeonViewer';
            object.type = 'dungeon';
            break;
        default:
            object.modelType = db.Hero;
            object.view = 'heroViewer';
            object.type = 'hero';
    };
    return object;
}

module.exports = switchBoard