const db = require('../models');
const fn = require('../CLI/functions');
const menuRoutes = require('./menuRoutes');

module.exports = (app) => {
    // There are dozens of menus, but all of the path names, view names, and content are very similar
    // Rather than write repetitive code, map out an array to generate the routes - simplifies the process
    // Use a single menu component to represent dozens with one simple piece of code and conditional rendering
    menuRoutes.map(route => {
        app.get(route.path, (req, res) => {
            res.render(route.view, { title: route.title, options: route.options, menuOptions: route.menuOptions })
        });
    });

    // Nearly all the viewers are identical, so a similar dynamic map is used to create all of the viewer routes as well
    app.get('/view/:Model', (req, res) => {
        // Figure out what kind of Model to use based on req.params
        // this switchboard is redundant and will get turned into a "helper function" that returns the needed values
        let modelType;
        switch (req.params.Model) {
            case "Dungeon":
                modelType = db.Dungeon;
                break;
            case "Monster":
                modelType = db.Monster;
                break;
            case "Party":
                modelType = db.Party;
                break;
            default:
                modelType = db.Hero;
        };
        // generate a menu for that result
        modelType.find({}).then(models => {
            // Generate options based on a map of the result, plus a Main Menu link at the end
            let data = {
                view: 'menu', title: `View ${req.params.Model}`,
                options: { heading: `View ${req.params.Model}`, src: `https://via.placeholder.com/700x350?text=placeholder_${req.params.Model}_image`, alt: 'A mysterious book' },
                menuOptions: models.map(model => ({ option: `${model.name} - Level ${model.level || " "} ${model.class || " "}`, href: `./${req.params.Model}/${model._id}` }))
            };
            data.menuOptions.push({ option: "Main Menu", href: "../" })
            res.render('menu', data);
        });
    });

    // Similar to mapped menus, viewers are also generated conditionally
    app.get('/view/:Model/:id', async function (req, res) {
        let type;
        let modelType;
        let view;
        switch (req.params.Model) {
            case "Monster":
                modelType = db.Monster;
                view = 'monsterViewer';
                type = 'monster';
                break;
            case "Party":
                modelType = db.Party;
                view = 'heroViewer';
                type = 'party';
                break;
            case "Dungeon":
                modelType = db.Dungeon;
                view = 'dungeonViewer';
                type = 'dungeon';
                break;
            default:
                modelType = db.Hero;
                view = 'heroViewer';
                type = 'hero';
        };
        let title;
        let model;
        await modelType.findOne({ _id: req.params.id }).then(result => {
            model = result;
            title = `${model.name} - Level ${model.level}`;
            if (model.class) { title = `${model.name} - Level ${model.level} ${model.class}` }
        })
        switch (req.params.Model) {
            // party needs a little extra prepartion
            case "Party":
                db.Party.findOne({ _id: req.params.id }).then(party => {
                    let partyName = party.name
                    db.Hero.find({ '_id': { $in: party.heroes.map(hero => hero) } }).then(result => {
                        model = fn.combineModels(result, partyName)
                        model.bonusString = "The party gains: " + model.bonusString.join(", ");
                        res.render(view, {
                            view: view, title: title, type: type,
                            options: { heading: title, src: `${model.sprite}`, alt: `${model.name}` },
                            menuOptions: [{ option: "Main Menu", href: "/" }],
                            model: model
                        });
                    });
                });
                break;
            default:
                // hero/monster/dungeon is ready to go as-is
                res.render(view, {
                    view: view, title: title, type: type,
                    options: { heading: title, src: `${model.sprite}`, alt: `${model.name}` },
                    menuOptions: [{ option: "Main Menu", href: "/" }],
                    model: model
                });
        };
    });

    app.get('/create/:modelType', (req, res) => {
        switch (req.params.modelType) {
            case "hero":
                res.render('createHero', { title: `Create Hero` });
                break;
            case "monster":
                res.render('createMonster', { title: `Create Monster` });
                break;
            case "party":
                db.Hero.find({}).then(results => {
                    res.render('createParty', { title: `Create Party`, heroes: results });
                })
                break;
            case "dungeon":
                res.render('createDungeon', { title: `Create Dungeon` });
                break;
        }
    });

    app.get('/confirm/delete/:model/:id', (req, res) => {
        let modelType;
        let type;
        switch (req.params.model) {
            case "monster":
                modelType = db.Monster;
                type = 'monster';
                break;
            case "party":
                modelType = db.Party;
                type = 'party';
                break;
            case "dungeon":
                modelType = db.Dungeon;
                type = 'dungeon';
                break;
            default:
                modelType = db.Hero;
                type = 'hero';
        };
        modelType.findOne({ _id: req.params.id }).then(result => {
            res.render('confirmDelete', { title: `Delete ${result.name}`, model: result, type: type });
        })
    });


};