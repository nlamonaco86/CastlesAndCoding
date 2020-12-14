// Basic object to represent a player hero
class Hero {
    constructor(name, hp, armor, weapon, inventory, gold, lastWords) {
        this.name = name;
        this.hp = hp;
        this.armor = armor;
        this.weapon = weapon;
        // Player inventory & gold, to hold items & money
        this.inventory = inventory;
        this.gold = gold;
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

module.exports = Hero;