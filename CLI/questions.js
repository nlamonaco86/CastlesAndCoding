let questions = {

    createHero: [
        {
            type: "input",
            message: "Enter your Hero's Name:",
            name: "name",
        },
        {
            type: "list",
            message: "Choose a Class:",
            choices: ["Warrior", "Wizard", "Thief", "Cleric"],
            name: "class",
        },
        {
            type: "input",
            message: "Last words? It's dangerous out there...",
            name: "lastWords",
        }
    ],

    createMonster: [{
        type: "input",
        message: "Enter the Monster's name:",
        name: "name",
    },
    {
        type: "number",
        message: "Monster's HP:",
        name: "hp",
    },
    {
        type: "number",
        message: "Monster's Armor:",
        name: "armor",
    },
    {
        type: "number",
        message: "Monster's level:",
        name: "level",
    },
    {
        type: "number",
        message: "Monster's Minimum damage:",
        name: "damageLow",
    },
    {
        type: "number",
        message: "Monster's Maximum damage:",
        name: "damageHigh",
    },
    {
        type: "number",
        message: "Monster's chance to critically hit (%):",
        name: "critChance",
    },
    {
        type: "number",
        message: "Monster's chance to block an attack (%):",
        name: "blockChance",
    },
    {
        type: "number",
        message: "Monster's Gold:",
        name: "gold",
    },
    {
        type: "input",
        message: "What item can the monster drop?",
        name: "inventory",
    },
    {
        type: "input",
        message: "Monster's opening message:",
        name: "taunt",
    }],

    createDungeon: [
        {
            type: "input",
            message: "Enter the Dungeon's Name:",
            name: "name",
        },
        {
            type: "input",
            message: "Describe the Dungeon",
            name: "description",
        },
        {
            type: "number",
            message: "Dungeon level:",
            name: "level",
        },
        {
            type: "number",
            message: "How much gold is in the dungeon?",
            name: "gold",
        }
    ],

    createBoss: [
        {
            type: "input",
            message: "Enter the Boss's name:",
            name: "name",
        },
        {
            type: "number",
            message: "Boss's HP:",
            name: "hp",
        },
        {
            type: "number",
            message: "Boss's Armor:",
            name: "armor",
        },
        {
            type: "number",
            message: "Boss's level:",
            name: "level",
        },
        {
            type: "number",
            message: "Boss's Minimum damage:",
            name: "damageLow",
        },
        {
            type: "number",
            message: "Boss's Maximum damage:",
            name: "damageHigh",
        },
        {
            type: "number",
            message: "Boss's chance to critically hit (%):",
            name: "critChance",
        },
        {
            type: "number",
            message: "Boss's chance to block (%):",
            name: "blockChance",
        },
        {
            type: "input",
            message: "What treasure does the boss hold?",
            name: "inventory",
        },
        {
            type: "number",
            message: "Boss's Gold:",
            name: "gold",
        },
        {
            type: "input",
            message: "Boss's opening message:",
            name: "taunt",
        }
    ],

}

module.exports = questions;