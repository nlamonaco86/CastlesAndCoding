let createRoutes = [
    { path: '/create/hero', view: 'createHero', title: "Create Hero" },
    { path: "/create/monster", view: 'createMonster', title: "Create Monster" },
    { path: "/create/party", view: 'createParty', title: "Create Party" },
    { path: "/create/dungeon", view: 'createDungeon', title: "Create Dungeon" },
    { path: "/create/npc", view: 'createNpc', title: "Create NPC" }
]

module.exports = createRoutes;