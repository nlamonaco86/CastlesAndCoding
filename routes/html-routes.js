const db = require('../models');
const fn = require('./combat-api');
const menuRoutes = require('./menuRoutes');
// the same switch/case is used many times in the dynamic routes, so it's separated into its own function to avoid repetition
const switchBoard = require('./switchBoard');

module.exports = async function (app) {
    // There are dozens of menus, but all of the path names, view names, and content are very similar
    // Rather than write repetitive code, map out an array to generate the routes - simplifies the process
    // Use a single menu component to represent dozens with one simple piece of code and conditional rendering
    menuRoutes.map(route => {
        app.get(route.path, (req, res) => {
            res.render(route.view, { title: route.title, options: route.options, menuOptions: route.menuOptions })
        });
    });

    // Nearly all the viewers are identical, so a similar dynamic map is used to create all of the viewer routes as well
    app.get('/view/:model', (req, res) => {
        // Figure out what kind of Model to use based on req.params
        let modelType = switchBoard(req.params.model).modelType
        // generate a menu for that result
        modelType.find({}).then(models => {
            // Generate options based on a map of the result, plus a Main Menu link at the end
            let data = {
                view: 'menu', title: `View ${req.params.model}`,
                options: { heading: `View ${req.params.model}`, src: `https://via.placeholder.com/700x350?text=placeholder_${req.params.Model}_image`, alt: 'A mysterious book' },
                menuOptions: models.map(model => ({ option: `${model.name} - Level ${model.level || " "} ${model.class || " "}`, href: `./${req.params.model}/${model._id}` })).concat({ option: "Main Menu", href: "/" })
            };
            res.render('menu', data);
        });
    });

    // Similar to mapped menus, viewers are also generated conditionally
    app.get('/view/:model/:id', async function (req, res) {
        let layout = switchBoard(req.params.model);
        let title;
        let model;
        await layout.modelType.findOne({ _id: req.params.id }).then(result => {
            model = result;
            title = `${model.name} - Level ${model.level}`;
            if (model.class) { title = `${model.name} - Level ${model.level} ${model.class}` }
        })
        switch (req.params.model) {
            // party needs a little extra prepartion
            case "party":
                db.Party.findOne({ _id: req.params.id }).then(party => {
                    let partyName = party.name
                    let _id = party._id
                    let sprite = party.sprite
                    db.Hero.find({ '_id': { $in: party.heroes.map(hero => hero) } }).then(result => {
                        model = fn.combineModels(result, partyName, _id, sprite)
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
        let layout = switchBoard(req.params.model);
        layout.modelType.findOne({ _id: req.params.id }).then(result => {
            res.render('confirmDelete', { title: `Delete ${result.name}`, model: result, type: layout.type });
        })
    });

    app.get('/battle/:type', async function (req, res) {
        // link to a menu that has battle type in the URL and displays a menu with a list of heroes or parties to choose
        db.Hero.find({}).then(models => {
            // each hero item will have a link containing a hero ID, monster ID and battle type
            // this link will take you to a battle
            let menuData = {
                view: 'menu', options: { heading: `Select a Hero`, src: `https://via.placeholder.com/700x350?text=placeholder_Select_Hero`, alt: 'A mysterious book' },
                menuOptions: [{ option: "Main Menu", href: "/" }]
            };
            // this is repetitive = break it down
            switch (req.params.type) {
                case "monster":
                    menuData.menuOptions = models.map(model => ({ option: `${model.name} - Level ${model.level || " "} ${model.class || " "}`, href: `./${req.params.type}/${model._id}/chooseMonster` })).concat(menuData.menuOptions)
                    res.render('menu', menuData);
                    break;
                case "dungeon":
                    db.Party.find({}).then(parties => {
                        menuData.options.heading = `Select a Party`
                        menuData.menuOptions = parties.map(model => ({ option: `${model.name} - Level ${model.level || " "} ${model.class || " "}`, href: `./${req.params.type}/${model._id}/chooseDungeon` })).concat(menuData.menuOptions)
                        res.render('menu', menuData);
                    })
                    break;
                case "untilYouLose":
                    menuData.menuOptions = models.map(model => ({ option: `${model.name} - Level ${model.level || " "} ${model.class || " "}`, href: `./${req.params.type}/${model._id}/randomMonster` })).concat(menuData.menuOptions)
                    res.render('menu', menuData);
                    break;
            }

        });
    });

    app.get('/battle/monster/:heroId/chooseMonster', async function (req, res) {
        db.Monster.find({}).then(monsters => {
            let monsterMenuData = {
                view: 'menu', title: `Select a Monster`,
                options: { heading: `Select a Monster`, src: `https://via.placeholder.com/700x350?text=placeholder_Select_Monster`, alt: 'A mysterious book' },
                menuOptions: monsters.map(monster => ({ option: `${monster.name} - Level ${monster.level || " "} ${monster.class || " "}`, href: `./chooseMonster/${monster._id}` }))
            };
            monsterMenuData.menuOptions.push({ option: "Main Menu", href: "/" })
            res.render('menu', monsterMenuData);
        })
    });

    app.get('/battle/monster/:heroId/chooseMonster/:monsterId', async function (req, res) {
        let monster = await db.Monster.findOne({ _id: req.params.monsterId });
        let hero = await db.Hero.findOne({ _id: req.params.heroId });
        let battle = await fn.epicShowdown(hero, monster);
        res.render('battle', battle);
    });

    app.get('/battle/dungeon/:partyId/chooseDungeon', async function (req, res) {
        db.Dungeon.find({}).then(dungeons => {
            let dungeonMenuData = {
                view: 'menu', title: `Select a Dungeon`,
                options: { heading: `Select a Dungeon`, src: `https://via.placeholder.com/700x350?text=placeholder_Select_Dungeon`, alt: 'A mysterious book' },
                menuOptions: dungeons.map(dungeon => ({ option: `${dungeon.name} - Level ${dungeon.level || " "}`, href: `./chooseDungeon/${dungeon._id}` }))
            };
            dungeonMenuData.menuOptions.push({ option: "Main Menu", href: "/" })
            res.render('menu', dungeonMenuData);
        })
    });

    app.get('/battle/dungeon/:partyId/chooseDungeon/:dungeonId', async function (req, res) {
        let dungeon = await db.Dungeon.findOne({ _id: req.params.dungeonId });
        let assembleParty = await db.Party.findOne({ _id: req.params.partyId });
        let partyName = assembleParty.name
        let battle = await fn.epicShowdown(fn.combineModels(await db.Hero.find({ '_id': { $in: assembleParty.heroes.map(hero => hero) } }), partyName, null, assembleParty.sprite), dungeon.boss);
        res.render('battle', battle);
    });

    app.get('/battle/untilYouLose/:heroId/randomMonster', async function (req, res) {
        let hero = await db.Hero.findOne({ _id: req.params.heroId });
        let monster = await fn.createRandomMonster(hero);
        let combatLog = await fn.untilYouLose(hero, monster);
        let result = { hero: hero, monster: monster, combatLog: combatLog.split(','), victory: true }
        res.render('battle', result);
    });

    app.get('/help', async function (req, res) {
        res.render('help');
    });

};