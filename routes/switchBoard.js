const db = require('../models');

const switchBoard = (input) => {
    let object = {
        modelType: '',
        view: '',
        type: ''
    };
    switch (input) {
        case "Monster":
            object.modelType = db.Monster;
            object.view = 'monsterViewer';
            object.type = 'Monster';
            break;
        case "Party":
            object.modelType = db.Party;
            object.view = 'heroViewer';
            object.type = 'Party';
            break;
        case "Dungeon":
            object.modelType = db.Dungeon;
            object.view = 'dungeonViewer';
            object.type = 'Dungeon';
            break;
        default:
            object.modelType = db.Hero;
            object.view = 'heroViewer';
            object.type = 'Hero';
    };
    return object;
}

module.exports = switchBoard