const db = require('../models')

// There are dozens of menus, but all of the path names and view names are very similar
// Rather than write repetitive code, line them up in an array and map out the routes to shorten & simplify the process
menuRoutes = [{path: '/', view: 'mainMenu'}, {path: '/create', view: 'createMenu'}, {path: '/create/hero', view: 'createHero'}, {path: "/create/monster", view: 'createMonster'}, {path: "/create/party", view: 'createParty'}, {path: "/create/dungeon", view: 'createDungeon'}, {path: '/view', view: 'viewMenu'}, {path: '/view/hero', view: 'viewHero'}, {path: "/view/monster", view: 'viewMonster'}, {path: "/view/party", view: 'viewParty'}, {path: "/view/dungeon", view: 'viewDungeon'}]

module.exports = (app) => {

    // map them out rather than write repetitive lines of code 
    menuRoutes.map(route => {
        app.get(route.path, (req, res) => {
            res.render(route.view)
        });
    });

};