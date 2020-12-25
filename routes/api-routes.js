var db = require("../models");

module.exports = function (app) {
  app.get("/api/view/heroes/all", function (req, res) {
    db.Hero.find({}).then(function (dbImages) {
      res.json(dbImages);
    });
  });
};