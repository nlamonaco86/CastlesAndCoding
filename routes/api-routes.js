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

  app.post("/api/:transaction/:npc/item/:heroId", (req, res) => {
    if (req.params.npc === "blacksmith") {
      if (req.params.transaction === "purchase") {
        db.Hero.findOneAndUpdate({ _id: req.params.heroId }, { $push: { inventory: req.body }, $inc: { gold: -req.body.cost } }, { new: true }).then(hero => {
          res.redirect(`/view/hero/${hero._id}`);
        }).catch(err => {
          console.log(err)
          res.status(401).json(err);
        })
      }
      if (req.params.transaction === "sell") {
        let saleTotal = 0;
        let itemNames = req.body.map(item => item.name)
        req.body.map(item => saleTotal += item.value);
        db.Hero.findOneAndUpdate({ _id: req.params.heroId }, { $pull: { inventory: { name: { $in: itemNames } } }, $inc: { gold: saleTotal } }, { multi: true, new: true }).then(hero => {
          res.redirect(`/view/hero/${hero._id}`);
        }).catch(err => {
          console.log(err)
          res.status(401).json(err);
        })
      }
    }
    if (req.params.npc === "innkeeper") {
      if (req.params.transaction === "sell") {
        let saleTotal = 4 * req.body.length;
        db.Hero.findOneAndUpdate({ _id: req.params.heroId }, { $pull: { inventory: { $in: req.body } }, $inc: { gold: saleTotal } }, { multi: true, new: true }).then(hero => {
          res.redirect(`/view/hero/${hero._id}`);
        }).catch(err => {
          console.log(err)
          res.status(401).json(err);
        })
      }
    }
  });

  app.delete("/confirm/delete/:model/:id/yes", (req, res) => {
    let layout = switchBoard(req.params.model);
    layout.modelType.deleteOne({ _id: req.params.id }).then(result => {
      res.redirect(`/`)
    }).catch(err => {
      console.log(err)
      res.status(401).json(err);
    });
  });

};