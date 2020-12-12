// NPC constructor
class Npc {
    constructor(name, inventory, gold, statements) {
        this.name = name;
        this.inventory = inventory;
        this.gold = gold;
        this.statements = statements;
        this.converse = () => {
            return this.statements[Math.floor(Math.random() * this.statements.length)];
        }
        // "drop" a random item from inventory on death 
        this.onDeath = () => {
            return this.inventory[Math.floor(Math.random() * this.inventory.length)];
        };
    };
};

module.exports = Npc;