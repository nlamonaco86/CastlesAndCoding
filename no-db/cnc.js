const Hero = require("./hero");
const Monster = require("./monster");
const Npc = require("./npc");

// Castles and Coding

//Array of Heroes
const warrior = new Hero("Sam", 20, 3, { name: "Short Sword", damageLow: 2, damageHigh: 4 }, ["crumpled map", "canteen"], 10, "Avenge Me!!!");
const wizard = new Hero("Merlin", 12, 0, { name: "Strange Staff", damageLow: 10, damageHigh: 15 }, ["spellbook", "quill", "bauble"], 5, "This can't be!");
const rogue = new Hero("Amanda", 16, 1, { name: "Iron Dagger", damageLow: 3, damageHigh: 6 }, ["lock picking kit", "grappling hook", "vial of poison"], 38, "&$*#&% !!!");

const heroes = [warrior, wizard, rogue];

// Array of monsters
const skeleton = new Monster("Skeleton", 12, 0, 1, 3, ["cloth scraps", "useless bone", "rusty dagger"], 0, "The monster is completely silent");
const ogre = new Monster("Ogre", 24, 0, 3, 6, ["stale bread", "onions"], 0, "U no take onion!");
const dragon = new Monster("Dragon", 240, 10, 14, 28, ["golden sword", "large diamond"], 1000, "The dragon lets out a ferocious, earth-shaking roar");

const monsters = [skeleton, ogre, dragon];

const bartender = new Npc("Jim", ["ornate mug", "small towel", "leather belt"], 87, ["What can I get you?", "You look like you need a drink", "Welcome to my tavern!"]);
const blacksmith = new Npc("Griswold", ["ball peen hammer", "leather apron", "bellows"], 124, ["I've got the sharpest blades you've ever seen...", "Four generations of my family have worked in this trade!", "Ever since the dragon came around, business hasn't been so good."]);
const aristocrat = new Npc("Victoria", ["gold necklace", "silk handkerchief"], 1871, ["What are you doing here?", "Be gone with you!", "Leave my presence, or I'll alert the guards!"]); 

// Generate a random monster
const randomMonster = () => {
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
    if (monsterData.damageHigh < monsterData.damageLow) { randomMonster(); }
    else { return new Monster(monsterData.name, monsterData.hp, monsterData.armor, monsterData.damageLow, monsterData.damageHigh, monsterData.inventory, monsterData.gold, monsterData.taunt) }
}

// "Battle" a hero vs. a monster
const epicShowdown = (hero, monster) => {
    // If a monster would cause an error, try again with the same hero and another random monster
    if (monster === undefined) { return epicShowdown(hero, randomMonster()) }
    // Take in both objects, store their life totals
    let heroLife = hero.hp;
    let monsterLife = monster.hp;
    // Keep track of the status of the battle (it's so exciting...)
    let battleStatus = [];
    // Function to calculate critical hits in combat. If return is false, normal damage. if true, double. Set to 10% chance for now. 
    let critChance = (dmg, dealer) => {
        let chances = [1,2,3,4,5,6,7,8,9,10]
        let crit = chances[Math.round(Math.random() * chances.length)]
        if (crit === 10) { return { dmg: dmg * 2, msg: `${dealer.name} has landed a critical hit! ${dmg * 2} damage!`  } }
        else { return { dmg: dmg } }
    }
    // The battle does not end until someone is defeated
    while (1) {
        // take turns dealing damage to each other until someone's HP reaches 0 or less
        // Since the characters can wear armor, it affects the calculations
        // also prevent a character gaining life on negative damage - armor outcomes
        let dmgIn = critChance(monster.calcDamage() - hero.armor, monster);
        let dmgOut = critChance(hero.calcDamage() - monster.armor, hero);
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
            return { announcement: `${hero.name} is battling a ${monster.name}!`, taunt: monster.taunt, combatLog: battleStatus, victory: true, message: `${hero.name} has slain the ${monster.name}!`, loot: [monster.onDeath(), monster.gold] }
        }
        // Defeat :(
        if (heroLife <= 0) {
            return { announcement: `${hero.name} is battling a ${monster.name}!`, taunt: monster.taunt, combatLog: battleStatus, victory: false, message: `${hero.name} has been defeated by the ${monster.name}!`, lastWords: hero.onDeath() }
        }
    };
};

// Announce a battle
const chronicle = (status) => {
    console.log(status.announcement);
    console.log(status.taunt);
    console.log(status.combatLog);
    console.log(status.message);
    if (status.lastWords) { console.log(status.lastWords) };
    if (status.loot) { console.log(`The monster dropped ${status.loot[0]} and ${status.loot[1]} gold`) }
}

// // Battle a random hero vs. a random monster
// console.log(epicShowdown(heroes[Math.floor(Math.random() * heroes.length)], monsters[Math.floor(Math.random() * monsters.length)]) );

// // battle a random hero vs a randomly generated monster
// console.log(epicShowdown(heroes[Math.floor(Math.random() * heroes.length)], randomMonster()) );

// battle until you lose
const untilYouLose = () => {
    while (1) {
        // Battle the hero against a monster until the hero is defeated
        let status = epicShowdown(heroes[Math.floor(Math.random() * heroes.length)], randomMonster());
        // On win, log the results and continue to another battle
        if (status.victory === true) { chronicle(status) }
        // On loss, log the results and stop
        if (status.victory === false) { return chronicle(status) }
    };
};

untilYouLose();