var db = require("../models");

module.exports = function (app) {

  app.post("/api/create/hero", (req, res) => {
    db.Hero.create(req.body).then(result => {
      res.redirect(307, "/api/login");
    }).catch(err => {
      console.log(err)
      res.status(401).json(err);
    })
  })

};