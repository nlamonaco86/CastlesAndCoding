const mongoose = require("mongoose");
const db = require("../models");
const { v4: uuidv4 } = require('uuid');
let inquirer = require('inquirer');

mongoose.connect("mongodb://localhost/cncDb", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

let selectedDungeon;


const addHeroToDb = (name, hp, armor, occupation, weapon, critChance, blockChance, spells, lastWords) => {
    db.Hero.create({ name: name, sprite: "URL", hp: hp, armor: armor, xp: 0, level: 1, class: occupation, weapon: weapon, critChance: critChance, blockChance: blockChance, spells: spells, inventory: [], gold: 10, lastWords: lastWords }).then((hero) => {
        let result = { name: hero.name, hp: hero.hp, armor: hero.armor, xp: hero.xp, level: hero.level, class: hero.class, weapon: hero.weapon, critChance: critChance, blockChance: blockChance, spells: hero.spells[0], gold: hero.gold, inventory: hero.inventory.join(", "), lastWords: hero.lastWords }
        console.table(result);
    });
};

let cli = {
    createMonster: () => {
        inquirer.prompt([
            {
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
                message: "Monster's opening message:",
                name: "taunt",
            }
        ]).then(answers => {
            // db.Monster.create(answers) could normally be used here, but _id is overriden for other purposes so I can't
            db.Monster.create({
                _id: uuidv4(),
                name: answers.name,
                sprite: "placeholder URL",
                hp: answers.hp,
                armor: answers.armor,
                level: answers.level,
                damageLow: answers.damageLow,
                damageHigh: answers.damageHigh,
                critChance: answers.critChance,
                blockChance: answers.blockChance,
                gold: answers.gold,
                taunt: answers.taunt
            }).then(monster => {
                let result = { name: monster.name, hp: monster.hp, armor: monster.armor, level: monster.level, damage: `${monster.damageLow}-${monster.damageHigh}`, gold: monster.gold, taunt: monster.taunt }
                console.table(result);
                inquirer.prompt([
                    {
                        type: "list",
                        message: "Create another monster?",
                        choices: ["Yes", "No"],
                        name: "another",
                    }
                ]).then(answers => {
                    if (answers.another === "Yes") {
                        createMonster();
                    }
                    else { process.exit(1); }
                });
            });
        }).catch(error => { console.log(error) })
    },

    createHero: () => {
        inquirer.prompt([
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
        ]).then(answers => {
            // Base stats for all heroes
            let hp = 20
            let armor = 0
            let weapon = {}
            let spells = []
            // modify the stats based on the hero's class
            // generally speaking, the warrior and cleric deal less damage but have more defenses
            // wizard and thief deal more damage, but have less defenses
            if (answers.class === "Warrior") {
                hp += 10; armor += 3; weapon = { name: "short sword", damageLow: 3, damageHigh: 6 };
                addHeroToDb(answers.name, hp, armor, answers.class, weapon, 5, 10, spells, answers.lastWords);
            };
            if (answers.class === "Wizard") {
                weapon = { name: "gnarled staff", damageLow: 1, damageHigh: 3 }; spells = [{ name: "fireball", damageLow: 8, damageHigh: 12 }];
                addHeroToDb(answers.name, hp, armor, answers.class, weapon, 10, 5, spells, answers.lastWords);
            };
            if (answers.class === "Thief") {
                weapon = { name: "iron dagger", damageLow: 8, damageHigh: 12 };
                addHeroToDb(answers.name, hp, armor, answers.class, weapon, 10, 5, spells, answers.lastWords);
            };
            if (answers.class === "Cleric") {
                hp += 10; armor += 3; weapon = { name: "bronze scepter", damageLow: 1, damageHigh: 3 }; spells = [{ name: "word of power", damageLow: 8, damageHigh: 12 }];
                addHeroToDb(answers.name, hp, armor, answers.class, weapon, 5, 10, spells, answers.lastWords);
            };
        }).then(result => {
            inquirer.prompt([
                {
                    type: "list",
                    message: "Create another Hero?",
                    choices: ["Yes", "No"],
                    name: "another",
                }
            ]).then(answers => {
                if (answers.another === "Yes") {
                    createHero();
                }
                else { process.exit(1); }
            })
        }).catch(error => { console.log(error) })
    },

    createDungeon: () => {
        inquirer.prompt([
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
                type: "input",
                message: "What treasure can be found in the dungeon?",
                name: "treasure",
            },
            {
                type: "number",
                message: "How much gold is in the dungeon?",
                name: "gold",
            }
        ]).then(answers => {
            db.Dungeon.create(answers).then(result => {
                selectedDungeon = result
                console.log("dungeon created");
                inquirer.prompt([
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
                        type: "number",
                        message: "Boss's Gold:",
                        name: "gold",
                    },
                    {
                        type: "input",
                        message: "Boss's opening message:",
                        name: "taunt",
                    }
                ]).then(answers => {
                    // is this "callback hell"? 
                    db.Monster.create({
                        _id: uuidv4(),
                        name: answers.name,
                        sprite: "placeholder URL",
                        hp: answers.hp,
                        armor: answers.armor,
                        level: answers.level,
                        damageLow: answers.damageLow,
                        damageHigh: answers.damageHigh,
                        critChance: answers.critChance,
                        blockChance: answers.blockChance,
                        gold: answers.gold,
                        taunt: answers.taunt
                    }).then(result => {
                        db.Dungeon.findOneAndUpdate({ _id: selectedDungeon._id }, { boss: result }, { new: true }).then(result => {
                            db.Monster.find({}).then(results => {
                                inquirer.prompt([
                                    {
                                        type: "checkbox",
                                        message: "Choose Monsters to live in the dungeon:",
                                        choices: results.map(x => `${x.name} - Level ${x.level}`),
                                        name: "monsters",
                                    }]).then(choices => {
                                        db.Dungeon.findOneAndUpdate({ _id: selectedDungeon._id }, { monsters: choices.monsters }, { new: true }).then(result => {
                                            console.log(result)
                                        })
                                    });
                            });
                        });
                    });
                });
            });
        });
    }

}

module.exports = cli