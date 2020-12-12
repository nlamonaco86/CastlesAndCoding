// Castles and Coding
// Basic object to represent a player hero
class Hero {
    constructor(name, hp, armor, weapon, inventory, gold, lastWords) {
        this.name = name
        this.hp = hp
        this.armor = armor
        this.weapon = weapon
        // Player inventory & gold, to hold items & money
        this.inventory = inventory
        this.gold = gold
        this.inventory = inventory
        // calculate possible damage outcomes based on the weapon the hero has equipped
        this.calcDamage = () => {
            let possibleDamage = [];
            for (let i = this.weapon.damageLow; i <= this.weapon.damageHigh; i++) {
                possibleDamage.push(i);
            }
            return possibleDamage[Math.floor(Math.random() * possibleDamage.length)];
        },
            this.onDeath = () => { return lastWords }
    };
};


const warrior = new Hero("Sam", 20, 3, { name: "Short Sword", damageLow: 2, damageHigh: 4 }, ["crumpled map", "canteen"], 10, "Avenge Me!!!");
const wizard = new Hero("Merlin", 12, 0, { name: "Strange Staff", damageLow: 10, damageHigh: 15 }, ["spellbook", "quill", "bauble"], 5, "This can't be!");
const rogue = new Hero("Amanda", 16, 1, { name: "Iron Dagger", damageLow: 3, damageHigh: 6 }, ["lock picking kit", "grappling hook", "vial of poison"], 38, "&$*#&% !!!");

const heroes = [warrior, wizard, rogue];

// Monster constructor
class Monster {
    constructor(name, hp, armor, damageLow, damageHigh, inventory, gold, taunt) {
        this.name = name
        this.hp = hp
        this.armor = armor
        this.damageLow = damageLow
        this.damageHigh = damageHigh
        this.inventory = inventory
        this.gold = gold
        this.taunt = taunt
        // calculate possible damage outcomes based on the weapon the monster has equipped
        this.calcDamage = () => {
            let possibleDamage = [];
            for (let i = this.damageLow; i <= this.damageHigh; i++) {
                possibleDamage.push(i);
            }
            return possibleDamage[Math.floor(Math.random() * possibleDamage.length)];
        };
        // "drop" a random item from inventory on death 
        this.onDeath = () => {
            return this.inventory[Math.floor(Math.random() * this.inventory.length)];
        };
    };
};

// Array of monsters

const skeleton = new Monster("Skeleton", 12, 0, 1, 3, ["cloth scraps", "useless bone", "rusty dagger"], 0, "The monster is completely silent");
const ogre = new Monster("Ogre", 24, 0, 3, 6, ["stale bread", "onions"], 0, "U no take onion!");
const dragon = new Monster("Dragon", 240, 10, 14, 28, ["golden sword", "large diamond"], 1000, "The dragon lets out a ferocious, earth-shaking roar");

const monsters = [skeleton, ogre, dragon];

// "Battle" hero vs. a monster
const epicShowdown = (hero, monster) => {
    // Take in both objects, store their life totals
    let heroLife = hero.hp;
    let monsterLife = monster.hp;
    // Announce who is battling
    console.log(`${hero.name} is battling a ${monster.name}!`)
    console.log(monster.taunt)
    // The battle does not end until someone is defeated
    while (1) {
        // take turns dealing damage to each other until someone's HP reaches 0 or less
        // Since the characters can wear armor, it affects the calculations
        // also prevent a character gaining life on negative damage - armor outcomes
        let dmgIn = monster.calcDamage() - hero.armor;
        let dmgOut = hero.calcDamage() - monster.armor;
        if (dmgIn > 0) { heroLife = heroLife - dmgIn }
        if (dmgOut > 0) { monsterLife = monsterLife - dmgOut }
        // Keep track of the status of the battle in the console (it's so exciting...)
        console.log({ heroHP: heroLife, monsterHP: monsterLife })
        // Victory!
        if (monsterLife <= 0) {
            return { victory: true, message: `${hero.name} has slain the ${monster.name}!`, loot: [monster.onDeath(), monster.gold] }
        }
        // Defeat :(
        if (heroLife <= 0) {
            return { victory: false, message: `${hero.name} has been defeated by ${monster.name}!`, lastWords: hero.onDeath() }
        }
    };
};

// Battle a random hero vs. a random monster
console.log(epicShowdown(heroes[Math.floor(Math.random() * heroes.length)], monsters[Math.floor(Math.random() * monsters.length)]));