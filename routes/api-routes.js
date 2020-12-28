var db = require("../models");
const menuRoutes = require('./menuRoutes');

module.exports = function (app) {

  // this switchboard is redundant and will get turned into a "helper function" that returns the needed values
  app.post("/api/create/:Model", (req, res) => {
    let modelType;
    switch (req.params.Model) {
      case "Hero":
        modelType = db.Hero;
        break;
      case "Monster":
        modelType = db.Monster;
        break;
      case "Dungeon":
        modelType = db.Dungeon;
        break;
      case "Party":
        modelType = db.Party;
        break;
    };
    modelType.create(req.body).then(result => {
      res.redirect(`/view/${req.params.Model}/${result._id}`)
    }).catch(err => {
      console.log(err)
      res.status(401).json(err);
    });
  });

  app.delete("/confirm/delete/:model/:id/yes", (req, res) => {
    let modelType;
    switch (req.params.model) {
      case "hero":
        modelType = db.Hero;
        break;
      case "monster":
        modelType = db.Monster;
        break;
      case "dungeon":
        modelType = db.Dungeon;
        break;
      case "party":
        modelType = db.Party;
        break;
    };
    modelType.deleteOne({_id: req.params.id}).then(result => {
      res.redirect(`/`)
    }).catch(err => {
      console.log(err)
      res.status(401).json(err);
    });
  });

};