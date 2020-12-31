var db = require("../models");
const menuRoutes = require('./menuRoutes');
// the same switch/case is used many times in the dynamic routes, so it's separated into its own functions
const switchBoard = require('./switchBoard');

module.exports = async function (app) {

  app.post("/api/create/:model", (req, res) => {
    let layout = switchBoard(req.params.model);
    layout.modelType.create(req.body).then(result => {
      res.redirect(`/view/${req.params.model}/${result._id}`)
    }).catch(err => {
      console.log(err)
      res.status(401).json(err);
    });
  });

  app.delete("/confirm/delete/:model/:id/yes", (req, res) => {
    let layout = switchBoard(req.params.model);
    layout.modelType.deleteOne({_id: req.params.id}).then(result => {
      res.redirect(`/`)
    }).catch(err => {
      console.log(err)
      res.status(401).json(err);
    });
  });

};