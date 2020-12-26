const db = require('../models')
const fn = require('../CLI/functions')
const menuRoutes = require('./menuRoutes')


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
        }
        // generate a menu for that result
        modelType.find({}).then(models => {
            // Generate options based on a map of the result, plus a Main Menu link at the end
            let data = {
                view: 'menu', title: `View ${req.params.Model}`,
                options: { heading: `View ${req.params.Model}`, src: `https://via.placeholder.com/700x350?text=placeholder_${req.params.Model}_image`, alt: 'A mysterious book' },
                menuOptions: models.map(model => ({ option: `${model.name} - Level ${model.level || " "} ${model.class || " "}`, href: `./${req.params.Model}/${model._id}` }))
            }
            data.menuOptions.push({ option: "Main Menu", href: "../" })
            res.render('menu', data);
        });
    });

    // Similar to mapped menus, viewers are also generated conditionally
    app.get('/view/:Model/:id', (req, res) => {
        let modelType;
        let view;
        switch (req.params.Model) {
            case "Monster":
                modelType = db.Monster;
                view = 'monsterViewer'
                break;
            case "Party":
                modelType = db.Party;
                view = 'heroViewer'
                break;
            default:
                modelType = db.Hero;
                view = 'heroViewer'
        }
        modelType.findOne({ _id: req.params.id }).then(result => {
            let title;
            let model = result
            switch (req.params.Model) {
                case "Monster":
                    title = `${model.name} - Level ${model.level}`
                    res.render(view, {
                        view: view, title: title,
                        options: { heading: title, src: `https://via.placeholder.com/300x650?text=${model.name}`, alt: `${model.name}` },
                        menuOptions: [{ option: "Main Menu", href: "http://localhost:8080" }],
                        model: model
                    });
                    break;
                case "Party":
                    title = `${model.name} - Level ${model.level}`
                    db.Party.findOne({ _id: req.params.id }).then(party => {
                        let partyName = party.name
                        db.Hero.find({ '_id': { $in: party.heroes.map(hero => hero._id) } }).then(result => {
                            model = fn.combineModels(result, partyName)
                            console.log(model)
                            res.render(view, {
                                view: view, title: title,
                                options: { heading: title, src: `https://via.placeholder.com/300x650?text=${model.name}`, alt: `${model.name}` },
                                menuOptions: [{ option: "Main Menu", href: "http://localhost:8080" }],
                                model: model
                            });
                        })
                    });
                    break;
                default:
                    title = `${model.name} - Level ${model.level} ${model.class}`
                    res.render(view, {
                        view: view, title: title,
                        options: { heading: title, src: `https://via.placeholder.com/300x650?text=${model.name}`, alt: `${model.name}` },
                        menuOptions: [{ option: "Main Menu", href: "http://localhost:8080" }],
                        model: model
                    });
            }
        });
    });

};