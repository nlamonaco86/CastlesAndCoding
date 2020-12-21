let inquirer = require('inquirer');
const mongoose = require("mongoose");
const db = require("../models");
const { v4: uuidv4 } = require('uuid');
const cli = require("./cli-functions");
const fn = require("./functions");
const ascii = require("./ascii");

mongoose.connect("mongodb://localhost/cncDb", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

// Empty variables to hold temp data between CLI menus
let selectedHero;
let selectedHeroes = [];
let selectedParty;
let selectedDungeon;
let partyName

const mainMenu = () => {
    console.log(ascii.main)
    inquirer.prompt([
        {
            type: "list",
            message: "Main Menu",
            choices: ["Create", "View", "Battle", "Escape"],
            name: "option",
        }
    ]).then(menu => {
        switch (menu.option) {
            case "Create":
                inquirer.prompt([
                    {
                        type: "list",
                        message: "What would you like to create?",
                        choices: ["Hero", "Monster", "Dungeon", "Party", "Go Back"],
                        name: "choice",
                    }
                ]).then(select => {
                    switch (select.choice) {
                        case "Hero":
                            cli.createHero();
                            break;
                        case "Monster":
                            cli.createMonster();
                            break;
                        case "Dungeon":
                            cli.createDungeon();
                            break;
                        case "Party":
                            cli.createParty();
                        case "Go Back":
                            mainMenu();

                    };
                });
                break;
            case "View":
                inquirer.prompt([
                    {
                        type: "list",
                        message: "What would you like to View?",
                        choices: ["Heroes", "Monsters", "Parties", "Go Back"],
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
                                        selectedHero = hero
                                        let result = { name: hero.name, hp: hero.hp, armor: hero.armor, xp: hero.xp, level: hero.level, class: hero.class, weapon: hero.weapon, spells: hero.spells[0], gold: hero.gold, lastWords: hero.lastWords }
                                        if (hero.class === "Wizard") { console.log(ascii.wizard) }
                                        if (hero.class === "Warrior") { console.log(ascii.warrior) }
                                        if (hero.class === "Cleric") { console.log(ascii.cleric) }
                                        console.table(result);
                                        console.log(`Inventory: ${hero.inventory.join(", ")}`)
                                        inquirer.prompt([
                                            {
                                                type: "list",
                                                message: "What would you like to do?",
                                                choices: ["Switch Weapons", "Main Menu"],
                                                name: "choice",
                                            }
                                        ]).then(result => {
                                            switch (result.choice) {
                                                case "Switch Weapons":
                                                    // search through a character's inventory, find all items that are objects, and return them as a stringified array
                                                    // this is to search the inventory for new weapons they gained in battle, to equip them onto the character
                                                    // via a db update call, and put the equipped item into the inventory
                                                    db.Hero.findOne({ _id: selectedHero._id }).then(result => {
                                                        let possibleItems = [];
                                                        for (let i = 0; i < result.inventory.length; i++) {
                                                            if (typeof result.inventory[i] === 'object' && result.inventory[i] !== null) {
                                                                // JSON.stringify the object to display it as a choice with inquirer and retain all properties
                                                                possibleItems.push(JSON.stringify(result.inventory[i]));
                                                            };
                                                        };
                                                        inquirer.prompt([
                                                            {
                                                                type: "list",
                                                                message: "Choose an item to equip",
                                                                choices: possibleItems,
                                                                name: "toEquip",
                                                            }
                                                        ]).then(item => {
                                                            db.Hero.findOneAndUpdate({ _id: selectedHero._id }, { $push: { inventory: selectedHero.weapon }, weapon: JSON.parse(item.toEquip) }, { new: true }).then(hero => {
                                                                let result = { name: hero.name, hp: hero.hp, armor: hero.armor, xp: hero.xp, level: hero.level, class: hero.class, weapon: hero.weapon, spells: hero.spells[0], gold: hero.gold, lastWords: hero.lastWords }
                                                                console.table(result);
                                                                mainMenu();
                                                            });
                                                        })

                                                    });
                                                    break;
                                                case "Main Menu":
                                                    mainMenu();
                                            }
                                        })
                                    });
                                });
                            });
                            break;
                        case "Parties":
                            db.Party.find({}).then(results => {
                                inquirer.prompt([
                                    {
                                        type: "list",
                                        message: "Choose a Party",
                                        choices: results.map(x => x.name),
                                        name: "party",
                                    }
                                ]).then(chosen => {
                                    db.Party.findOne({ name: chosen.party }).then(party => {
                                        console.log(party.name)
                                        party.heroes.forEach(hero => {
                                            // Party name contains an array of strings like this : "Name - Level Number"
                                            // split each string in the array into an array after the first space, then use that first index (the name) and level (the fourth) 
                                            // of each to run a database call for a hero that matches, and console.table it 
                                            // this works well as long as each name/level combo is unique, need validation on model creation
                                            db.Hero.findOne({ name: hero.split(" ")[0], level: hero.split(" ")[3] }).then(hero => {
                                                let result = { name: hero.name, hp: hero.hp, armor: hero.armor, xp: hero.xp, level: hero.level, class: hero.class, weapon: hero.weapon, spells: hero.spells[0], gold: hero.gold, lastWords: hero.lastWords }
                                                console.table(result);
                                                console.log(`Inventory: ${hero.inventory.join(", ")}`)
                                            })
                                        });
                                        mainMenu();
                                    });
                                });
                            });
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
                                        let result = { name: monster.name, hp: monster.hp, armor: monster.armor, level: monster.level, damage: `${monster.damageLow}-${monster.damageHigh}`, gold: monster.gold, taunt: monster.taunt }
                                        console.table(result);
                                        mainMenu();
                                    });
                                });
                            });
                            break;
                        case "Go Back":
                            mainMenu();
                            break;
                    };
                });
                break;
            case "Battle":
                inquirer.prompt([
                    {
                        type: "list",
                        message: "Prepare to Battle!",
                        choices: ["Raid a Dungeon", "Battle Until Defeated", "Hero vs. Monster", "Go Back"],
                        name: "selected",
                    }
                ]).then(option => {
                    switch (option.selected) {
                        case "Hero vs. Monster":
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
                                            fn.chooseTwo({ name: selectedHero.choice.split(" ") }, { name: monster.choice.split(" ") });
                                            mainMenu();
                                        });
                                    });
                                });
                            });
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
                                        mainMenu();
                                    });
                                });
                            });
                            break;
                        case "Raid a Dungeon":
                            console.log(ascii.dungeon);
                            db.Party.find({}).then(parties => {
                                inquirer.prompt([
                                    {
                                        type: "list",
                                        message: "Choose a Party",
                                        choices: parties.map(x => x.name),
                                        name: "choice",
                                    }
                                ]).then(result => {
                                    db.Party.findOne({ name: result.choice }).then(party => {
                                        partyName = party.name
                                        party.heroes.forEach(hero => {
                                            // find each hero in the party, and push it to the temp array
                                            db.Hero.findOne({ name: hero.split(" ")[0], level: hero.split(" ")[3] }).then(hero => {
                                                selectedHeroes.push(hero)
                                            })
                                        });
                                        db.Dungeon.find({}).then(dungeons => {
                                            inquirer.prompt([
                                                {
                                                    type: "list",
                                                    message: "Choose a Dungeon",
                                                    choices: dungeons.map(x => x.name),
                                                    name: "choice",
                                                }
                                            ]).then(result => {
                                                db.Dungeon.findOne({ name: result.choice }).then(result => {
                                                    selectedDungeon = result
                                                    // extract the boss object & combine all heroes in the party into one character
                                                    // apply various if conditions for bonuses as a party, then battle the party vs. the boss monster
                                                    // combine map and reduce, to return an array of all the items in each object's particular key and then combine them here
                                                    let partyOfHeroes = {
                                                        _id: selectedHeroes.map(h => h._id),
                                                        name: partyName,
                                                        hp: selectedHeroes.map(h => h.hp).reduce((a, b) => { return a + b; }, 0),
                                                        xp: selectedHeroes.map(h => h.xp).reduce((a, b) => { return a + b; }, 0),
                                                        armor: selectedHeroes.map(h => h.armor).reduce((a, b) => { return a + b; }, 0),
                                                        class: selectedHeroes.map(h => h.class),
                                                        // for crit/block, use the average of all the characters' chances
                                                        critChance: Math.floor(selectedHeroes.map(h => h.critChance).reduce((a, b) => { return a + b; }, 0) / selectedHeroes.length),
                                                        blockChance: Math.floor(selectedHeroes.map(h => h.blockChance).reduce((a, b) => { return a + b; }, 0) / selectedHeroes.length),
                                                        // create a weapon that's the combination of all heroe' weapons
                                                        weapon: {
                                                            name: "The Party's Blade",
                                                            damageLow: selectedHeroes.map(h => h.weapon.damageLow).reduce((a, b) => { return a + b; }, 0),
                                                            damageHigh: selectedHeroes.map(h => h.weapon.damageHigh).reduce((a, b) => { return a + b; }, 0)
                                                        },
                                                        // for spells, create a spell much like the weapon
                                                        spells: [{
                                                            name: "The Might of Magic",
                                                            damageLow: selectedHeroes.map(h => h.spells[0].damageLow).reduce((a, b) => { return a + b; }, 0),
                                                            damageHigh: selectedHeroes.map(h => h.spells[0].damageHigh).reduce((a, b) => { return a + b; }, 0)
                                                        }],
                                                        gold: selectedHeroes.map(h => h.gold).reduce((a, b) => { return a + b; }, 0),
                                                        inventory: [],
                                                        lastWords: ""
                                                    };
                                                    // provide incentives for making a diverse group of heroes. A warrior in the party will add extra armor, a thief extra weapon damage, 
                                                    // a cleric, extra hp, and a wizard extra spell damage 
                                                    let bonusString = [];
                                                    if (partyOfHeroes.class.includes("Warrior")) {
                                                        partyOfHeroes.armor *= 1.1; partyOfHeroes.blockChance *= 1.1;
                                                        bonusString.push(`10% armor and block chance`);
                                                    }
                                                    if (partyOfHeroes.class.includes("Wizard")) {
                                                        partyOfHeroes.spells[0].damageLow *= 1.1; partyOfHeroes.spells[0].damageHigh *= 1.1;
                                                        bonusString.push(`10% spell damage`);
                                                    }
                                                    if (partyOfHeroes.class.includes("Thief")) {
                                                        partyOfHeroes.weapon.damageLow *= 1.1; partyOfHeroes.weapon.damageHigh *= 1.1;
                                                        bonusString.push(`10% weapon damage`);
                                                    }
                                                    if (partyOfHeroes.class.includes("Cleric")) {
                                                        partyOfHeroes.hp *= 1.1;
                                                        bonusString.push(`10% hp`);
                                                    }
                                                    // Generate a string depicting the party's bonus
                                                    // insert an "and" aftert he second to last item in the array, however long it is.
                                                    bonusString.splice(bonusString.length - 1, 0, `and`);
                                                    console.log(`${partyOfHeroes.name} gains ` + bonusString.join(", ") + `!`);
                                                    fn.chronicle(fn.epicShowdown(partyOfHeroes, selectedDungeon.boss));
                                                    mainMenu();
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                            break;
                        case "Go Back":
                            mainMenu();
                            break;
                    };
                });
                break;
            // case "Edit":
            //     console.log("This feature is under construction!");
            //     mainMenu();
            //     break;
            case "Escape":
                console.log("Farewell!");
                process.exit(1);
        };
    }).catch(error => { console.log(error) })
};

mainMenu();