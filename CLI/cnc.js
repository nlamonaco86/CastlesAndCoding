let inquirer = require('inquirer');
const mongoose = require("mongoose");
const db = require("../models");
const { v4: uuidv4 } = require('uuid');
const fn = require("./functions")

mongoose.connect("mongodb://localhost/cncDb", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

let selectedHero;

const mainMenu = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Castles & Coding",
            choices: ["Create", "View", "Battle", "Edit", "Escape"],
            name: "option",
        }
    ]).then(menu => {
        switch (menu.option) {
            case "Create":
                inquirer.prompt([
                    {
                        type: "list",
                        message: "What would you like to create?",
                        choices: ["Hero", "Monster"],
                        name: "choice",
                    }
                ]).then(select => {
                    switch (select.choice) {
                        case "Hero":
                            fn.createHero();
                            break;
                        case "Monster":
                            fn.createMonster();
                    }
                })
                break;
            case "View":
                inquirer.prompt([
                    {
                        type: "list",
                        message: "What would you like to View?",
                        choices: ["Heroes", "Monsters"],
                        name: "choice",
                    }
                ]).then(select => {
                    switch (select.choice) {
                        case "Heroes":
                            db.Hero.find({}).then(results => {
                                inquirer.prompt([
                                    {
                                        type: "list",
                                        message: "Select a Hero",
                                        choices: results.map(x => x.name + " - Level " + x.level + " " + x.class),
                                        name: "choice",
                                    }
                                ]).then(result => {
                                    db.Hero.findOne({ name: result.choice.split(" ")[0] }).then(hero => {
                                        let result = {name: hero.name, hp: hero.hp, armor: hero.armor, xp: hero.xp, level: hero.level, class: hero.class, weapon: hero.weapon, spells: hero.spells[0], gold: hero.gold, inventory: hero.inventory.join(", "), lastWords: hero.lastWords}
                                        console.table(result);
                                        mainMenu();
                                    })
                                })
                            })
                            break;
                        case "Monsters":
                            db.Monster.find({}).then(results => {
                                inquirer.prompt([
                                    {
                                        type: "list",
                                        message: "Select a Monster",
                                        choices: results.map(x => x.name + " - Level " + x.level),
                                        name: "choice",
                                    }
                                ]).then(result => {
                                     db.Monster.findOne({ name: result.choice.split(" ")[0] }).then(monster => {
                                        let result = {name: monster.name, hp: monster.hp, armor: monster.armor, level: monster.level, damage: `${monster.damageLow}-${monster.damageHigh}`, gold: monster.gold, taunt: monster.taunt}
                                        console.table(result);
                                    })
                                })
                            })
                    }
                })
                break;
            case "Battle":
                inquirer.prompt([
                    {
                        type: "list",
                        message: "Prepare to Battle!",
                        choices: ["Hero vs. Monster", "Battle Until Defeated"],
                        name: "selected",
                    }
                ]).then(option => {
                    switch (option.selected) {
                        case "Hero vs. Monster":
                            inquirer.prompt([
                                {
                                    type: "list",
                                    message: "Whomst Shall You Battle?",
                                    choices: ["Choose a Foe", "Battle a Random Monster"],
                                    name: "selected",
                                }
                            ]).then(option => {
                                switch (option.selected) {
                                    case "Choose a Foe":
                                        db.Hero.find({}).then(results => {
                                            inquirer.prompt([
                                                {
                                                    type: "list",
                                                    message: "Select a Hero",
                                                    choices: results.map(x => x.name + " - Level " + x.level + " " + x.class),
                                                    name: "choice",
                                                }
                                            ]).then(choice => {
                                                selectedHero = choice
                                                db.Monster.find({}).then(results => {
                                                    inquirer.prompt([
                                                        {
                                                            type: "list",
                                                            message: "Select a Monster",
                                                            choices: results.map(x => `${x.name} - Level ${x.level}`),
                                                            name: "choice",
                                                        }
                                                    ]).then(monster => {
                                                        fn.chooseTwo({ name: selectedHero.choice.split(" ") }, {name: monster.choice.split(" ")});
                                                    });
                                                });
                                            });
                                        });
                                        break;
                                    default:
                                        db.Hero.find({}).then(results => {
                                            inquirer.prompt([
                                                {
                                                    type: "list",
                                                    message: "Select a Hero",
                                                    choices: results.map(x => x.name + " - Level " + x.level + " " + x.class),
                                                    name: "choice",
                                                }
                                            ]).then(result => {
                                                db.Hero.findOne({ name: result.choice.split(" ")[0] }).then(result => {
                                                    fn.chooseTwo({ _id: result._id }, null)
                                                });
                                            });
                                        });
                                }
                            })
                            break;
                        case "Battle Until Defeated":
                            db.Hero.find({}).then(results => {
                                inquirer.prompt([
                                    {
                                        type: "list",
                                        message: "Select a Hero",
                                        choices: results.map(x => x.name + " - Level " + x.level + " " + x.class),
                                        name: "choice",
                                    }
                                ]).then(result => {
                                    db.Hero.findOne({ name: result.choice.split(" ")[0] }).then(result => {
                                        fn.untilYouLose({ _id: result._id })
                                    })
                                })
                            })
                    }
                })
                break;
            case "Edit":
                console.log("This feature is under construction!");
                mainMenu();
                break;
            case "Escape":
                process.exit(1);
        };
    }).catch(error => { console.log(error) })
};

mainMenu();