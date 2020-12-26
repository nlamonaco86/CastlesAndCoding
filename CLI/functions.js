const mongoose = require("mongoose");
const db = require("../models");
const { v4: uuidv4 } = require('uuid');
const { clearLine } = require("inquirer/lib/utils/readline");

mongoose.connect("mongodb://localhost/cncDb", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const createModel = (model, modelData) => {
    model.create(modelData).then(result => { console.log(result); });
};

const findAll = (model) => {
    model.find({}).then(results => { console.log(results); });
};

const findAllWhere = (model, where) => {
    model.find(where).then(results => { console.log(results); });
};

const findOne = (model, where) => {
    model.findOne(where).then(result => { console.log(result); });
};

const updateModel = (model, where, query) => {
    model.findOneAndUpdate(where, query, { new: true }).then(result => { console.log(result); });
};

const deleteModel = async function (model, where) {
    model.findOneAndDelete(where).then(result => { console.log(result._id + " was deleted!"); })
};

// Create a monster with random stats, scaled to hero's stats for a more fair fight!
const createRandomMonster = (hero) => {
    monsterData = {
        _id: uuidv4(),
        name: "Wretched Ooze",
        hp: Math.floor(Math.random() * hero.hp * 4),
        xp: Math.floor((Math.random() * hero.level) + 4),
        level: hero.level,
        armor: Math.floor(Math.random() * hero.armor * 2),
        damageLow: Math.floor(Math.random() * hero.weapon.damageLow * 2),
        damageHigh: Math.floor(Math.random() * hero.weapon.damageHigh * 2),
        critChance: Math.floor(Math.random() * hero.critChance * 2),
        blockChance: Math.floor(Math.random() * hero.blockChance * 2),
        inventory: ["disgusting slime", { name: "rusted sword", damageLow: 0, damageHigh: 2 }, "crumpled map"],
        gold: Math.floor(Math.random() * 50),
        taunt: "A shifting blob of mysterious ooze comes forth."
    };
    // Ensure some "quality" among monsters, by preventing strange damage outputs
    // if max damage is higher than min, try again
    if (monsterData.damageHigh < monsterData.damageLow) { createRandomMonster(hero); }
    else { db.Monster.create(monsterData); return monsterData };
};

// Calculate damage to deal
let calcHeroDamage = (model) => {
    // empty array will hold all possible damage outcomes from the weapon/spell
    let possibleDamage = [];
    // Different heroes use different abilities - warrior and thief use their weapon
    // 4 if conditions here, so the four classes can become more unique as development continues
    if (model.class === "Warrior") {
        for (let i = model.weapon.damageLow; i <= model.weapon.damageHigh; i++) {
            possibleDamage.push(i);
        }
    }
    if (model.class === "Thief") {
        for (let i = model.weapon.damageLow; i <= model.weapon.damageHigh; i++) {
            possibleDamage.push(i);
        }
    }
    // cleric and wizard use random spells from their "Spellbook" array
    if (model.class === "Wizard") {
        let chosenSpell = model.spells[Math.floor(Math.random() * model.spells.length)]
        for (let i = chosenSpell.damageLow; i <= chosenSpell.damageHigh; i++) {
            possibleDamage.push(i);
        }
    }
    if (model.class === "Cleric") {
        let chosenSpell = model.spells[Math.floor(Math.random() * model.spells.length)]
        for (let i = chosenSpell.damageLow; i <= chosenSpell.damageHigh; i++) {
            possibleDamage.push(i);
        }
    }
    else {
        // This must be a party of heroes! push all possible weapon & spell damage outcomes to the array
        let chosenSpell = model.spells[Math.floor(Math.random() * model.spells.length)]
        for (let i = chosenSpell.damageLow; i <= chosenSpell.damageHigh; i++) {
            possibleDamage.push(i);
        }
        for (let i = model.weapon.damageLow; i <= model.weapon.damageHigh; i++) {
            possibleDamage.push(i);
        }
    }
    // grab a random number from the array - that's the damage to be dealt
    return possibleDamage[Math.floor(Math.random() * possibleDamage.length)];
}

let calcMonsterDamage = (model) => {
    let possibleDamage = [];
    for (let i = model.damageLow; i <= model.damageHigh; i++) {
        possibleDamage.push(i);
    };
    return possibleDamage[Math.floor(Math.random() * possibleDamage.length)];
}

// calculate critical hit and blocked attack damage outcomes
let takeChance = (dmg, dealer, target) => {
    // Take in the damage dealer's crit chance to build an array based on that number for use in virtual dice-rolling
    let critArray = []
    for (let i = 1; i < 101; i++) {
        critArray.push(i);
    };
    let blockArray = []
    for (let i = 1; i < 101; i++) {
        blockArray.push(i);
    };
    // The arrays will contain numbers 1-100. Taking the value of an index at random position, the number is then compared to see if it's greater
    // than the array's length (100) minus crit/block chance. For example, a character with 10% crit chance will roll a critical hit on 90-100
    let critPick = critArray[Math.round(Math.random() * critArray.length)];
    let blockPick = blockArray[Math.round(Math.random() * blockArray.length)];
    // If the attack is blocked, it returns with 0 damage and a blocked message
    if (blockPick >= blockArray.length - target.blockChance) { return { dmg: 0, msg: `${dealer.name}'s attack was blocked!` } }
    // If the attack is not blocked, roll to see if it's a normal or critical hit
    else {
        //  If return is !10, normal damage. if 10, double damage. 
        if (critPick >= critArray.length - dealer.critChance && (dmg * 2) > 0) { return { dmg: Math.round(dmg * 2), msg: `${dealer.name} has landed a critical hit! ${Math.round(dmg * 2)} damage!` } }
        else { return { dmg: dmg } };
    }
}

// On death functions to generate loot and/or last words 
let heroDeath = (model) => { return model.lastWords };
let monsterDeath = (model) => {
    return model.inventory[Math.floor(Math.random() * model.inventory.length)];
};

// Battle a Hero vs. a Monster
const epicShowdown = (hero, monster) => {
    // If a monster would cause an error, try again with the same hero and another random monster
    if (monster === undefined) { return epicShowdown(hero, createRandomMonster(hero)) }
    // Take in both objects, store their life totals
    let heroLife = hero.hp;
    let monsterLife = monster.hp;
    // Keep track of the status of the battle (it's so exciting...)
    let battleStatus = [];
    // The battle does not end until someone is defeated
    while (1) {
        // take turns dealing damage to each other until someone's HP reaches 0 or less
        // Since the characters can wear armor, it affects the calculations
        // also prevent a character gaining life on negative damage - armor outcomes
        let dmgIn = takeChance(calcMonsterDamage(monster) - hero.armor, monster, hero);
        let dmgOut = takeChance(calcHeroDamage(hero) - monster.armor, hero, monster);

        // Run the critical hit calculation, and if true, alter this turn's results
        // If the resulting damage is not negative, alter the life totals
        if (dmgIn.dmg >= 0) { heroLife = Math.round(heroLife - dmgIn.dmg) }
        if (dmgOut.dmg >= 0) { monsterLife = Math.round(monsterLife - dmgOut.dmg) }
        // Push each "turn" taken to the array, log crit messages and prevent logging "junk" negative crits
        if (dmgIn.msg && dmgIn.dmg >= 0) { battleStatus.push(dmgIn.msg) }
        if (dmgOut.msg && dmgOut.dmg >= 0) { battleStatus.push(dmgOut.msg) }
        battleStatus.push({ heroHP: heroLife, monsterHP: monsterLife });

        // Victory!
        if (monsterLife <= 0) {
            // Choose a random item from the monster's inventory
            let loot = monster.inventory[Math.floor(Math.random() * monster.inventory.length)]
            // Create an object to display in the console
            let heroWins = { hero: hero, monster: monster, announcement: `${hero.name} is battling a ${monster.name}!`, taunt: monster.taunt, combatLog: battleStatus, victory: true, message: `${hero.name} has slain the ${monster.name}!`, loot: loot, gold: monster.gold, xp: monster.xp }
            // If the group is NOT a party 
            if (Array.isArray(hero.class) === false) {
                // create a battle record in the database, run the loot function
                db.Battle.create(heroWins).then(result => {
                });
                lootMonster(hero, monster, loot);
                return heroWins;
            }
            // Loot is not supported for raid battles (yet)
            else {
                db.Battle.create(heroWins).then(result => {
                });
                return heroWins;
            }

        }
        // Defeat :(
        if (heroLife <= 0) {
            let monsterWins = { hero: hero, monster: monster, announcement: `${hero.name} is battling a ${monster.name}!`, taunt: monster.taunt, combatLog: battleStatus, victory: false, message: `${hero.name} has been defeated by the ${monster.name}!`, lastWords: heroDeath(hero) }
            db.Battle.create(monsterWins).then(result => { });
            // Lose 30 gold on death to a monster
            transferItem(monster._id, db.Monster, hero._id, db.Hero, "penalty", 30);
            return monsterWins;
        }
    };
};

// Choose a hero and a monster, battle them one time
const chooseTwo = async function (heroWhere, monsterWhere) {
    let hero = await db.Hero.findOne(heroWhere);
    let monster = await db.Monster.findOne(monsterWhere);
    if (monster === null) {
        monster = createRandomMonster(hero);
        console.log(epicShowdown(hero, monster));
    }
    else {
        console.log(epicShowdown(hero, monster));
    };
};

// battle against randomly generated monsters until the hero loses
const untilYouLose = async function (where) {
    let hero = await db.Hero.findOne(where);
    let monster = createRandomMonster(hero);
    let score = 0;
    while (1) {
        // Battle the hero against a monster until the hero is defeated
        let status = epicShowdown(hero, monster);
        // On win, log the results and continue to another battle
        // generate a different monster for the next battle
        if (status.victory === true) { chronicle(status); monster = createRandomMonster(hero); score = score + 1; }
        // On loss, log the results and stop
        else { return chronicle(status, score); };
    };
};

// Announce a battle
const chronicle = (status, score) => {
    console.log(status.announcement);
    console.log(status.taunt);
    console.log(status.combatLog);
    console.log(status.message);
    if (status.lastWords) { console.log('"' + status.lastWords + '"') };
    if (!Array.isArray(status.hero.class)) {
        if (status.loot || status.gold) { console.log(`${status.monster.name} dropped ${status.loot.name || status.loot} and ${status.gold} gold. ${status.hero.name} gained ${status.xp} xp.`) }
    }
    if (score < 1 || score > 1) { console.log(`${status.hero.name} defeated ` + score + " monsters."); }
    if (score === 1) { console.log(`${status.hero.name} defeated ` + score + " monster."); }
}

// Convert the battle results into an easily readable log with math to show the damage dealt each turn
const combatLog = (where) => {
    db.Battle.findOne(where).then((result) => {
        // Loop over the combat log
        for (let i = 0; i < result.combatLog.length; i++) {
            // if it's a message, log the message
            if (!result.combatLog[i].heroHP) { console.log(result.combatLog[i]) }
            // if the result is a set of hit points, log it as so
            if (result.combatLog[i].heroHP) {
                console.log(`${result.hero} HP: ${result.combatLog[i].heroHP} || ${result.monster} HP: ${result.combatLog[i].monsterHP}`)
                // if there is a previous set of hit points in the log, compare the two to extrapolate damage dealt this turn 
                if (result.combatLog[i - 1]) {
                    console.log(`${result.hero} deals ${result.combatLog[i - 1].monsterHP - result.combatLog[i].monsterHP} damage! || ${result.monster} deals ${result.combatLog[i - 1].heroHP - result.combatLog[i].heroHP} damage!`);
                }
            }
        }
    });
}

// Hero character gains all of the monster's gold and xp, plus a random item from its inventory
// The monster is left unmodified so that it can be re-used
const lootMonster = (hero, monster, loot) => {
    db.Hero.findOneAndUpdate({ _id: hero._id }, { $inc: { gold: monster.gold, xp: monster.xp }, $push: { inventory: loot } }, { new: true }).then(hero => {
        // After a victory over a monster, check to see if the character has reached a certain Xp threshold
        // An exponential increment is desired - going from level 1-2 should be much shorter than lvl 17-18, etc.
        // Update the character's level and provide a 10%? bonus to all stats as a reward
        // for thief/warrior boost their weapon damage, for cleric/wizard boost their spells
        if ( hero.xp >= hero.level * 75 ) {
            if ( hero.class == "Warrior" || hero.class == "Thief") {
            db.Hero.findOneAndUpdate({ _id: hero._id }, { level: Math.floor(hero.xp / 75) , hp: hero.hp * 1.1, armor: hero.armor * 1.1, critChance: hero.critChance * 1.1,
                    blockChance: hero.blockChance * 1.1, weapon: { name: hero.weapon.name, damageLow: hero.weapon.damageLow * 1.2,
                        damageHigh: hero.weapon.damageHigh * 1.1 } }, { new: true }).then(hero => {
                            console.log(`${hero.name} has reached level ${hero.level}!`)
            });
        }
        else {
            db.Hero.findOneAndUpdate({ _id: hero._id }, { level: Math.floor(hero.xp / 75) , hp: hero.hp * 1.1, armor: hero.armor * 1.1, critChance: hero.critChance * 1.1,
                blockChance: hero.blockChance * 1.1, spells: [{name: hero.spells[0].name, damageLow: hero.spells[0].damageLow * 1.2, damageHigh: hero.spells[0].damageHigh * 1.2}] }, { new: true }).then(hero => {
                        console.log(`${hero.name} has reached level ${hero.level}!`)
                    });
        }
        };
    });
};

// Transfer gold or inventory between two characters
// to reuse function in many scenarios, take in the following:
transferItem = async function (receiverId, receiverType, giverId, giverType, transactionType, amount) {
    if (transactionType === "gold") {
        // query the database twice to find both objects
        let receiver = await receiverType.findOne({ _id: receiverId });
        let giver = await giverType.findOne({ _id: giverId });
        // // sometimes, take ALL the gold, like defeating a monster
        if (amount === "all") {
            // subtract the amount from the giver
            giverType.findOneAndUpdate({ _id: giverId }, { gold: 0 }, { new: true }).then(result => { });
            // receiver gains amount of gold equal to what the giver had
            receiverType.findOneAndUpdate({ _id: receiverId }, { gold: receiver.gold + giver.gold }, { new: true }).then(result => { });
        }
        else {
            // but sometimes, only take SOME, like buying an item from another player or NPC
            amount = amount;
            // subtract the amount from the giver
            giverType.findOneAndUpdate({ _id: giverId }, { gold: giver.gold - amount }, { new: true }).then(result => { console.log(giver.name + " now has " + result.gold + " gold."); });
            // receiver gains amount of gold equal to what the giver had
            receiverType.findOneAndUpdate({ _id: receiverId }, { gold: receiver.gold + amount }, { new: true }).then(result => { console.log(receiver.name + " now has " + result.gold + " gold."); });
        };
    };
    // What if a character dies in battle, and we want them to lose some gold as a penalty
    if (transactionType === "penalty") {
        // query the database to find the defeated hero
        let giver = await giverType.findOne({ _id: giverId });
        amount = amount;
        // subtract the amount from the giver
        giverType.findOneAndUpdate({ _id: giverId }, { gold: giver.gold - amount }, { new: true }).then(result => {
            console.log(`${giver.name} dropped ${amount} gold.`);
            // prevent characters from having negative gold, if they would reach a negative amount, set it to zero instead.
            if (result.gold < 0) {
                giverType.findOneAndUpdate({ _id: giverId }, { gold: 0 }, { new: true }).then(result => { })
            }
        });
    };
    if (transactionType === "loot") {
        // search for the receiver's inventory
        giverType.findOne({ _id: giverId }).then(result => {
            result.inventory[Math.floor(Math.random() * result.inventory.length)];
            // pick a random item from it, push it to the receiver's loot (they "picked up" the item)
            receiverType.findOneAndUpdate({ _id: receiverId }, { $push: { inventory: result.inventory } }, { new: true }).then(result => {
            });
        });
    };
};

// search through a character's inventory, find all items that are objects, and return them as an array
// this is to search the inventory for new weapons/spells they gained in battle, to equip them onto the character
// via a db update call, and put the equipped item into the inventory, or to delete an unwanted item 
// "slot" refers to it being called for spells or weapon
const searchInventory = (model, modelWhere, type) => {
    model.findOne(modelWhere).then(result => {
        let possibleItems = [];
        let array;
        if (type === "item") { array = result.inventory; }
        if (type === "spell") { array = result.spells; }
        for (let i = 0; i < array.length; i++) {
            if (typeof array[i] === 'object' && array[i] !== null) {
                possibleItems.push(array[i]);
            };
        };
        console.log(result);
    });
};

// Switch an item between the weapon slot and the inventory
const swapItem = (model, modelWhere, swapIn) => {
    model.findOne(modelWhere).then(result => {
        let incoming = swapIn;
        model.findOneAndUpdate(modelWhere, { $push: { inventory: result.weapon }, weapon: incoming }, { new: true }).then(result => {
            console.log(result);
        });
    });
};

const combineModels = (selectedHeroes, partyName) => {
    let partyOfHeroes = {
        _id: selectedHeroes.map(h => h._id),
        name: partyName,
        heroes: selectedHeroes.map(h => `${" "}${h.name} - Level ${h.level} ${h.class}`),
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
        spells: {
            name: "The Might of Magic",
            damageLow: selectedHeroes.map(h => h.spells.damageLow).reduce((a, b) => { return a + b; }, 0),
            damageHigh: selectedHeroes.map(h => h.spells.damageHigh).reduce((a, b) => { return a + b; }, 0)
        },
        gold: selectedHeroes.map(h => h.gold).reduce((a, b) => { return a + b; }, 0),
        inventory: [],
        bonusString: [],
        lastWords: ""
    };
    // provide incentives for making a diverse group of heroes. A warrior in the party will add extra armor, a thief extra weapon damage, 
    // a cleric, extra hp, and a wizard extra spell damage 
    if (partyOfHeroes.class.includes("Warrior")) {
        // Not really sure why I have to use Math.floor here. 
        // Function returns, for example 3 * 1.1 = 3.3000000000000003 without it. That makes no sense. 
        partyOfHeroes.armor *= Math.floor(1.1); 
        partyOfHeroes.blockChance *= Math.floor(1.1);
        partyOfHeroes.bonusString.push(`${" "}10% armor and block chance`);
    }
    if (partyOfHeroes.class.includes("Wizard")) {
        partyOfHeroes.spells.damageLow *= Math.floor(1.1); 
        partyOfHeroes.spells.damageHigh *= Math.floor(1.1);
        partyOfHeroes.bonusString.push(`${" "}10% spell damage`);
    }
    if (partyOfHeroes.class.includes("Thief")) {
        partyOfHeroes.weapon.damageLow *= Math.floor(1.1); 
        partyOfHeroes.weapon.damageHigh *= Math.floor(1.1);
        partyOfHeroes.bonusString.push(`${" "}10% weapon damage`);
    }
    if (partyOfHeroes.class.includes("Cleric")) {
        partyOfHeroes.hp *= Math.floor(1.1);
        partyOfHeroes.bonusString.push(`${" "}10% hp`);
    }
    // Generate a string depicting the party's bonus
    // insert an "and" aftert he second to last item in the array, however long it is.
    // partyOfHeroes.bonusString.splice(partyOfHeroes.bonusString.length - 1, 0, `and`);
    return partyOfHeroes
}

module.exports = { combineModels, createModel, findAll, findAllWhere, findOne, updateModel, deleteModel, createRandomMonster, calcHeroDamage, calcMonsterDamage, takeChance, heroDeath, monsterDeath, epicShowdown, chooseTwo, untilYouLose, chronicle, combatLog, transferItem, searchInventory, swapItem }
