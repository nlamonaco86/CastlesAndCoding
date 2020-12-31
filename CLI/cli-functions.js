const mongoose = require("mongoose");
const db = require("../models");
const { v4: uuidv4 } = require('uuid');
let inquirer = require('inquirer');
let questions = require("./questions");
let ascii = require("./ascii");
const menu = require("./cnc")

mongoose.connect("mongodb://localhost/cncDb", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

let selectedHero;
let selectedHeroes = [];
let selectedParty;
let selectedDungeon;
let partyName;
let selectedNpc;
let browsedItem;
let itemToScrap;

const addHeroToDb = (name, hp, armor, occupation, weapon, critChance, blockChance, spells, lastWords) => {
    db.Hero.create({ name: name, sprite: "URL", hp: hp, armor: armor, xp: 0, level: 1, class: occupation, weapon: weapon, critChance: critChance, blockChance: blockChance, spells: spells, inventory: [], gold: 10, lastWords: lastWords }).then((hero) => {
        let result = { name: hero.name, hp: hero.hp, armor: hero.armor, xp: hero.xp, level: hero.level, class: hero.class, weapon: hero.weapon, critChance: critChance, blockChance: blockChance, spells: hero.spells, gold: hero.gold, inventory: hero.inventory.join(", "), lastWords: hero.lastWords }
        if (hero.class === "Wizard") { console.log(ascii.wizard) }
        if (hero.class === "Warrior") { console.log(ascii.warrior) }
        if (hero.class === "Cleric") { console.log(ascii.cleric) }
        console.table(result);
    });
};

let cli = new function() {
    this.createMonster = () => {
        inquirer.prompt(questions.createMonster).then(answers => {
            // db.Monster.create(answers) could normally be used here, but _id is overriden for other purposes so I can't
            db.Monster.create({
                _id: uuidv4(),
                name: answers.name,
                sprite: "placeholder URL",
                hp: answers.hp,
                xp: Math.floor(Math.random() * 8),
                armor: answers.armor,
                level: answers.level,
                damageLow: answers.damageLow,
                damageHigh: answers.damageHigh,
                critChance: answers.critChance,
                blockChance: answers.blockChance,
                inventory: answers.inventory,
                gold: answers.gold,
                taunt: answers.taunt
            }).then(monster => {
                let result = { name: monster.name, hp: monster.hp, armor: monster.armor, level: monster.level, damage: `${monster.damageLow}-${monster.damageHigh}`, gold: monster.gold, taunt: monster.taunt }
                console.table(result);
                // inquirer.prompt([
                //     {
                //         type: "list",
                //         message: "Create another monster?",
                //         choices: ["Yes", "No"],
                //         name: "another",
                //     }
                // ]).then(answers => {
                process.exit(1);
                // });
            });
        }).catch(error => { console.log(error) })
    },

    this.createHero =  () => {
        inquirer.prompt(questions.createHero).then(answers => {
            // Base stats for all heroes
            let hp = 20;
            let armor = 0;
            let weapon = {};
            let spells = {};
            // modify the stats based on the hero's class
            // generally speaking, the warrior and cleric deal less damage but have more defenses
            // wizard and thief deal more damage, but have less defenses
            if (answers.class === "Warrior") {
                hp += 10; armor += 3;
                weapon = { name: "short sword", damageLow: 3, damageHigh: 6 }; spells = { name: "I don't do magic.", damageLow: 0, damageHigh: 0 };
                addHeroToDb(answers.name, hp, armor, answers.class, weapon, 5, 10, spells, answers.lastWords);
            };
            if (answers.class === "Wizard") {
                weapon = { name: "gnarled staff", damageLow: 1, damageHigh: 3 }; spells = { name: "fireball", damageLow: 8, damageHigh: 12 };
                addHeroToDb(answers.name, hp, armor, answers.class, weapon, 10, 5, spells, answers.lastWords);
            };
            if (answers.class === "Thief") {
                weapon = { name: "iron dagger", damageLow: 8, damageHigh: 12 }; spells = { name: "I don't do magic.", damageLow: 0, damageHigh: 0 };
                addHeroToDb(answers.name, hp, armor, answers.class, weapon, 10, 5, spells, answers.lastWords);
            };
            if (answers.class === "Cleric") {
                hp += 10; armor += 3;
                weapon = { name: "bronze scepter", damageLow: 1, damageHigh: 3 }; spells = { name: "word of power", damageLow: 8, damageHigh: 12 };
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
                    this.createHero();
                }
                else { process.exit(1); }
            })
        }).catch(error => { console.log(error) })
    },

    this.createDungeon = () => {
        inquirer.prompt(questions.createDungeon).then(answers => {
            db.Dungeon.create(answers).then(result => {
                selectedDungeon = result
                console.log("dungeon created");
                inquirer.prompt(questions.createBoss).then(answers => {
                    // is this "callback hell"? 
                    db.Monster.create({
                        _id: uuidv4(),
                        name: answers.name,
                        sprite: "placeholder URL",
                        hp: answers.hp,
                        xp: Math.floor(Math.random() * 320),
                        armor: answers.armor,
                        level: answers.level,
                        damageLow: answers.damageLow,
                        damageHigh: answers.damageHigh,
                        critChance: answers.critChance,
                        blockChance: answers.blockChance,
                        gold: answers.gold,
                        inventory: answers.inventory,
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
    },

    this.createParty = () => {
        db.Hero.find({}).then(heroes => {
            inquirer.prompt([
                {
                    type: "checkbox",
                    message: "Choose Heroes to join the party:",
                    choices: heroes.map(x => `${x.name} - Level ${x.level}`),
                    name: "heroes",
                }]).then(selected => {
                    selectedHeroes = selected.heroes
                    inquirer.prompt([
                        {
                            type: "input",
                            message: "Enter the Party's Name:",
                            name: "name",
                        }]).then(answer => {
                            db.Party.create({ name: answer.name, heroes: selectedHeroes }).then(result => { console.log(result) });
                        });
                });
        });
    }
};

module.exports = cli

