const mongoose = require("mongoose");
const db = require("./models");
const { create } = require("./models/npc");

mongoose.connect("mongodb://localhost/cncDb", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const createModel = (model, modelData) => {
    model.create(modelData).then(result => { console.log(result); })
};

const findAll = (model) => {
    model.find({}).then(results => { console.log(results); })
};

const findOne = (model, where) => {
    model.findOne(where).then(result => { console.log(result); })
};

const updateModel = (model, where, query) => {
    model.findOneAndUpdate(where, query).then(result => { console.log(result); })
};

const deleteModel = async function (model, where) {
    model.findOneAndDelete(where).then(result => { console.log(result._id + " was deleted!"); })
};

// Create a monster with random stats
const createRandomMonster = () => {
    monsterData = {
        name: "Random",
        hp: Math.floor(Math.random() * 20),
        armor: Math.floor(Math.random() * 5),
        damageLow: Math.floor(Math.random() * 4),
        damageHigh: Math.floor(Math.random() * 12),
        inventory: ["disgusting slime"],
        gold: Math.floor(Math.random() * 50),
        taunt: "A shifting blob of mysterious ooze comes forth"
    }
    // Ensure some "quality" among monsters, by preventing strange damage outputs
    // if max damage is higher than min, try again
    if (monsterData.damageHigh < monsterData.damageLow) { createRandomMonster(); }
    else { return monsterData }
};

// Battle a Hero vs. a Monster
const epicShowdown = (hero, monster) => {
    // If a monster would cause an error, try again with the same hero and another random monster
    if (monster === undefined) { return epicShowdown(hero, createRandomMonster()) }
    // Take in both objects, store their life totals
    let heroLife = hero.hp;
    let monsterLife = monster.hp;
    // Keep track of the status of the battle (it's so exciting...)
    let battleStatus = [];
    // Function to calculate critical hits in combat. If return is false, normal damage. if true, double. Set to 10% chance for now. 
    let critChance = (dmg, dealer) => {
        let chances = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        let crit = chances[Math.round(Math.random() * chances.length)]
        if (crit === 10) { return { dmg: dmg * 2, msg: `${dealer.name} has landed a critical hit! ${dmg * 2} damage!` } }
        else { return { dmg: dmg } }
    }
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
        }
        return possibleDamage[Math.floor(Math.random() * possibleDamage.length)];
    }
    let heroDeath = (model) => { return model.lastWords };
    let monsterDeath = (model) => {
        return model.inventory[Math.floor(Math.random() * model.inventory.length)];
    };
    // The battle does not end until someone is defeated
    while (1) {
        // take turns dealing damage to each other until someone's HP reaches 0 or less
        // Since the characters can wear armor, it affects the calculations
        // also prevent a character gaining life on negative damage - armor outcomes
        let dmgIn = critChance(calcMonsterDamage(monster) - hero.armor, monster);
        let dmgOut = critChance(calcHeroDamage(hero) - monster.armor, hero);
        // Run the critical hit calculation, and if true, alter this turn's results
        // If the resulting damage is not negative, alter the life totals
        if (dmgIn.dmg > 0) { heroLife = heroLife - dmgIn.dmg }
        if (dmgOut.dmg > 0) { monsterLife = monsterLife - dmgOut.dmg }
        // Push each "turn" taken to the array, log crit messages and prevent logging "junk" negative crits
        if (dmgIn.msg && dmgIn.dmg > 0) { battleStatus.push(dmgIn.msg) }
        if (dmgOut.msg && dmgOut.dmg > 0) { battleStatus.push(dmgOut.msg) }
        battleStatus.push({ heroHP: heroLife, monsterHP: monsterLife });

        // Victory!
        if (monsterLife <= 0) {
            return { announcement: `${hero.name} is battling a ${monster.name}!`, taunt: monster.taunt, combatLog: battleStatus, victory: true, message: `${hero.name} has slain the ${monster.name}!`, loot: [monsterDeath(monster), monster.gold] }
        }
        // Defeat :(
        if (heroLife <= 0) {
            return { announcement: `${hero.name} is battling a ${monster.name}!`, taunt: monster.taunt, combatLog: battleStatus, victory: false, message: `${hero.name} has been defeated by the ${monster.name}!`, lastWords: heroDeath(hero) }
        }
    };
};

// Choose a hero and a monster, battle them one time
const chooseTwo = async function (heroWhere, monsterWhere) {
    let hero = await db.Hero.findOne(heroWhere);
    let monster = await db.Monster.findOne(monsterWhere);
    console.log(epicShowdown(hero, monster));
}

// Announce a battle
const chronicle = (status) => {
    console.log(status.announcement);
    console.log(status.taunt);
    console.log(status.combatLog);
    console.log(status.message);
    if (status.lastWords) { console.log(status.lastWords) };
    if (status.loot) { console.log(`The monster dropped ${status.loot[0]} and ${status.loot[1]} gold`) }
}

// battle against randomly generated monsters until the hero loses
const untilYouLose = async function (where) {
    let hero = await db.Hero.findOne(where);
    let monster = createRandomMonster();
    while (1) {
        // Battle the hero against a monster until the hero is defeated
        let status = epicShowdown(hero, monster);
        // On win, log the results and continue to another battle
        // generate a different monster for the next battle
        if (status.victory === true) { chronicle(status); monster = createRandomMonster(); }
        // On loss, log the results and stop
        if (status.victory === false) { return chronicle(status) }
    };
};

untilYouLose({ _id: "5fd692de0ef85127e42ebdee" });