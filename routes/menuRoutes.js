// There are dozens of menus, but all of the path names, view names, and content are very similar
// Rather than write repetitive code, line them up in an array and map out the routes to shorten & simplify the process
// Use a single menu component to represent dozens
let menuRoutes = [
    {
        path: '/', view: 'menu', title: "Castles & Coding",
        options: { heading: 'Castles & Coding', src: './assets/dragon.png', alt: 'A fearsome dragon' },
        menuOptions: [{ option: "Create", href: "./create" }, { option: "View", href: "./view" }, { option: "Battle", href: "./battle" }, { option: "Visit Town", href: "./visit" }, { option: "Help", href: "./help" }]
    },
    {
        path: '/create', view: 'menu', title: "Create",
        options: { heading: 'Create', src: 'http://via.placeholder.com/700x350?text=placeholder_create_menu', alt: 'PLACEHOLDER' },
        menuOptions: [{ option: "Hero", href: "./create/hero" }, { option: "Monster", href: "./create/monster" }, { option: 'Party', href: "./create/party" }, { option: "Dungeon", href: "./create/dungeon" }, { option: "NPC", href: "./create/npc" }, { option: "Main Menu", href: "/" }]
    },
    {
        path: '/view', view: 'menu', title: "View",
        options: { heading: 'View', src: './assets/book.png', alt: 'A mysterious book' },
        menuOptions: [{ option: "Hero", href: "./view/hero" }, { option: "Monster", href: "./view/monster" }, { option: 'Party', href: "./view/party" }, { option: "Dungeon", href: "./view/dungeon" }, { option: "Main Menu", href: "/" }]
    },
    {
        path: '/battle', view: 'menu', title: "Battle",
        options: { heading: 'Battle', src: 'https://via.placeholder.com/700x350?text=placeholder_battle_menu', alt: 'PLACEHOLDER' },
        menuOptions: [{ option: "Hero Vs. Monster", href: "./battle/monster" }, { option: "Raid A Dungeon", href: "./battle/dungeon" }, { option: 'Until You Lose', href: "./battle/untilYouLose" }, { option: "Main Menu", href: "/" }]
    },
    {
        path: '/visit', view: 'menu', title: "Visit Town",
        options: { heading: 'Where would you like to go?', src: 'https://via.placeholder.com/700x350?text=a_town', alt: 'PLACEHOLDER' },
        menuOptions: [{ option: "The Blacksmith", href: "./visit/blacksmith" }, { option: "The Inn", href: "./visit/inn" }, { option: 'Town Square', href: "./visit/townSquare" }, { option: "Main Menu", href: "/" }]
    },
    {
        path: '/visit/blacksmith', view: 'menu', title: "The Blacksmith",
        options: { heading: 'What would you like to do?', src: 'https://via.placeholder.com/700x350?text=the_blacksmith', alt: 'PLACEHOLDER' },
        menuOptions: [{ option: "Buy", href: "/visit/blacksmith/buy" }, { option: "Sell", href: "/visit/blacksmith/sell" }, { option: "Talk", href: "/visit/blacksmith/talk" }, { option: "Main Menu", href: "/" }]
    },
    {
        path: '/visit/inn', view: 'menu', title: "The Inn",
        options: { heading: 'Wat would you like to do?', src: 'https://via.placeholder.com/700x350?text=the_inn', alt: 'PLACEHOLDER' },
        menuOptions: [{ option: "Buy", href: "/visit/inn/buy" }, { option: "Sell", href: "/visit/inn/sell" }, { option: "Talk", href: "/visit/inn/talk" }, { option: "Main Menu", href: "/" }]
    },
    {
        path: '/visit/townSquare', view: 'menu', title: "Town Square",
        options: { heading: 'What would you like to do?', src: 'https://via.placeholder.com/700x350?text=the_inn', alt: 'PLACEHOLDER' },
        menuOptions: [{ option: "Talk", href: "/visit/townSquare/talk" }, { option: "Main Menu", href: "/" }]
    },
]

module.exports = menuRoutes