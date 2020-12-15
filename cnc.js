const mongoose = require("mongoose");
const db = require("./models");

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
        _id: Math.floor(Math.random() * 99999999),
        name: "Wretched Ooze",
        hp: Math.floor(Math.random() * hero.hp * 2),
        armor: Math.floor(Math.random() * hero.armor * 2),
        damageLow: Math.floor(Math.random() * hero.weapon.damageLow * 1.5),
        damageHigh: Math.floor(Math.random() * hero.weapon.damageHigh * 1.5),
        inventory: ["disgusting slime"],
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
    let possibleDamage = [];
    for (let i = model.weapon.damageLow; i <= model.weapon.damageHigh; i++) {
        possibleDamage.push(i);
    }
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
let takeChance = (dmg, dealer) => {
    // static 10% block and crit chances for now, can eventually scale by character stats
    let chances = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let critPick = chances[Math.round(Math.random() * chances.length)];
    let blockPick = chances[Math.round(Math.random() * chances.length)];
    // If the attack is blocked, it returns with 0 damage and a blocked message
    if (blockPick === 10) { return { dmg: 0, msg: `${dealer.name}'s attack was blocked!` } }
    // If the attack is not blocked, roll to see if it's a normal or critical hit
    else {
        //  If return is !10, normal damage. if 10, double damage. 
        if (critPick === 10) { return { dmg: dmg * 2, msg: `${dealer.name} has landed a critical hit! ${dmg * 2} damage!` } }
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
        let dmgIn = takeChance(calcMonsterDamage(monster) - hero.armor, monster);
        let dmgOut = takeChance(calcHeroDamage(hero) - monster.armor, hero);
        // Run the critical hit calculation, and if true, alter this turn's results
        // If the resulting damage is not negative, alter the life totals
        if (dmgIn.dmg >= 0) { heroLife = heroLife - dmgIn.dmg }
        if (dmgOut.dmg >= 0) { monsterLife = monsterLife - dmgOut.dmg }
        // Push each "turn" taken to the array, log crit messages and prevent logging "junk" negative crits
        if (dmgIn.msg && dmgIn.dmg >= 0) { battleStatus.push(dmgIn.msg) }
        if (dmgOut.msg && dmgOut.dmg >= 0) { battleStatus.push(dmgOut.msg) }
        battleStatus.push({ heroHP: heroLife, monsterHP: monsterLife });

        // Victory!
        if (monsterLife <= 0) {
            // Create an object to display in the console
            let heroWins = { hero: hero, monster: monster, announcement: `${hero.name} is battling a ${monster.name}!`, taunt: monster.taunt, combatLog: battleStatus, victory: true, message: `${hero.name} has slain the ${monster.name}!`, loot: [monsterDeath(monster), monster.gold] }
            // Also use that object to populate the database 
            db.Battle.create(heroWins).then(result => {  });
            // The hero gains all of the monster's gold
            transferItem(hero._id, db.Hero, monster._id, db.Monster, "gold", "all");
            return heroWins
        }
        // Defeat :(
        if (heroLife <= 0) {
            let monsterWins = { hero: hero, monster: monster, announcement: `${hero.name} is battling a ${monster.name}!`, taunt: monster.taunt, combatLog: battleStatus, victory: false, message: `${hero.name} has been defeated by the ${monster.name}! ${hero.name} lost 30 gold.`, lastWords: heroDeath(hero) }
            db.Battle.create(monsterWins).then(result => {  });
            // Lose 30 gold on death to a monster
            transferItem(monster._id, db.Monster, hero._id, db.Hero, "penalty", 30);
            return monsterWins
        }
    };
};

// Choose a hero and a monster, battle them one time
const chooseTwo = async function (heroWhere, monsterWhere) {
    let hero = await db.Hero.findOne(heroWhere);
    let monster = await db.Monster.findOne(monsterWhere);
    if (monster === null) { 
        console.log("no monster")
        monster = createRandomMonster(hero);
        console.log(epicShowdown(hero, monster));
    }
    else { 
        console.log(epicShowdown(hero, monster));
    }
}

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
        if (status.victory === true) { chronicle(status); monster = createRandomMonster(hero); score = score + 1 }
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
    if (status.loot) { console.log(`The monster dropped ${status.loot[0]} and ${status.loot[1]} gold`) }
    if (score < 1 || score > 1) { console.log("You defeated " + score + " monsters."); }
    if (score === 1) { console.log("You defeated " + score + " monster."); }
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
                    console.log(`${result.hero} deals ${result.combatLog[i - 1].monsterHP - result.combatLog[i].monsterHP} damage! || ${result.monster} deals ${result.combatLog[i - 1].heroHP - result.combatLog[i].heroHP} damage!`)
                }
            }
        }
    });
}

// Transfer gold or inventory between two characters
// to reuse function in many scenarios, take in the following:
transferItem = async function (receiverId, receiverType, giverId, giverType, transactionType, amount) {
    if (transactionType === "gold") {
        // query the database twice to find both objects
        let receiver = await receiverType.findOne({ _id: receiverId })
        let giver = await giverType.findOne({ _id: giverId })
        // // sometimes, take ALL the gold, like defeating a monster
        if (amount === "all") {
            // subtract the amount from the giver
            giverType.findOneAndUpdate({ _id: giverId }, { gold: 0 }, { new: true }).then(result => { console.log(giver.name + " now has " + result.gold + " gold.");
             })
            // receiver gains amount of gold equal to what the giver had
            receiverType.findOneAndUpdate({ _id: receiverId }, { gold: receiver.gold + giver.gold }, { new: true }).then(result => { console.log(receiver.name + " now has " + result.gold + " gold."); 
            })
        }
        else {
            // but sometimes, only take SOME, like buying an item from another player or NPC
            amount = amount
            // subtract the amount from the giver
            giverType.findOneAndUpdate({ _id: giverId }, { gold: giver.gold - amount }, { new: true }).then(result => { console.log(giver.name + " now has " + result.gold + " gold."); })
            // receiver gains amount of gold equal to what the giver had
            receiverType.findOneAndUpdate({ _id: receiverId }, { gold: receiver.gold + amount }, { new: true }).then(result => { console.log(receiver.name + " now has " + result.gold + " gold."); })
        }
    }
    // What if a character dies in battle, and we want them to lose some gold as a penalty
    if (transactionType === "penalty") {
        // query the database to find the defeated hero
        let giver = await giverType.findOne({ _id: giverId })
        amount = amount
        // subtract the amount from the giver
        giverType.findOneAndUpdate({ _id: giverId }, { gold: giver.gold - amount }, { new: true }).then(result => { console.log(giver.name + " dropped " + amount + " gold."); })
    }
}



