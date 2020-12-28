const db = require('../models');
const fn = require('../CLI/functions');
const menuRoutes = require('./menuRoutes');
// the same switch/case is used many times in the dynamic routes, so it's separated into its own function to avoid repetition
const switchBoard = require('./switchBoard');

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
        let modelType = switchBoard(req.params.Model).modelType
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
        let layout = switchBoard(req.params.Model);
        let title;
        let model;
        await layout.modelType.findOne({ _id: req.params.id }).then(result => {
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
                        res.render(layout.view, {
                            title: title, type: layout.type,
                            options: { heading: title, src: `${model.sprite}`, alt: `${model.name}` },
                            menuOptions: [{ option: "Main Menu", href: "/" }],
                            model: model
                        });
                    });
                });
                break;
            default:
                // hero/monster/dungeon is ready to go as-is
                res.render(layout.view, {
                    title: title, type: layout.type,
                    options: { heading: title, src: `${model.sprite}`, alt: `${model.name}` },
                    menuOptions: [{ option: "Main Menu", href: "/" }],
                    model: model
                });
        };
    });

    app.get('/create/:modelType', (req, res) => {
        switch (req.params.modelType) {
            case "Hero":
                res.render('createHero', { title: `Create Hero` });
                break;
            case "Monster":
                res.render('createMonster', { title: `Create Monster` });
                break;
            case "Party":
                db.Hero.find({}).then(results => {
                    res.render('createParty', { title: `Create Party`, heroes: results });
                })
                break;
            case "Dungeon":
                res.render('createDungeon', { title: `Create Dungeon` });
                break;
        }
    });

    app.get('/confirm/delete/:Model/:id', (req, res) => {
        let layout = switchBoard(req.params.Model);
        layout.modelType.findOne({ _id: req.params.id }).then(result => {
            res.render('confirmDelete', { title: `Delete ${result.name}`, model: result, type: layout.type });
        })
    });

};