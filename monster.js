// Monster constructor
class Monster {
    constructor(name, hp, armor, damageLow, damageHigh, inventory, gold, taunt) {
        this.name = name;
        this.hp = hp;
        this.armor = armor;
        this.damageLow = damageLow;
        this.damageHigh = damageHigh;
        this.inventory = inventory;
        this.gold = gold;
        this.taunt = taunt;
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

module.exports = Monster;