const mongoose = require("mongoose");
const db = require("../models");

mongoose.connect("mongodb://localhost/cncDb", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

let heroSeeds = [
    {
      spells: [ {
        name : "I don't do magic.",
        damageLow : 0,
        damageHigh : 0
    } ],
      inventory: [],
      name: 'Robin',
      sprite: 'URL',
      hp: 20,
      armor: 0,
      xp: 0,
      level: 1,
      class: 'Thief',
      weapon: { name: 'iron dagger', damageLow: 8, damageHigh: 12 },   
      critChance: 10,
      blockChance: 15,
      gold: 0,
      lastWords: 'Ah, but remember faint hearts never won, fair lady.',
    },
    {
      spells: [        {
        name: "fireball",
        damageLow: 8,
        damageHigh: 12
    } ],
      inventory: [],
      name: 'Merlin',
      sprite: 'URL',
      hp: 20,
      armor: 0,
      xp: 0,
      level: 1,
      class: 'Wizard',
      weapon: { name: 'gnarled staff', damageLow: 1, damageHigh: 3 },
      critChance: 10,
      blockChance: 5,
      gold: 10,
      lastWords: 'This...this cannot be!',
    },
    {
      spells: [ {
        name : "I don't do magic.",
        damageLow : 0,
        damageHigh : 0
    } ],
      inventory: [],
      name: 'Arthur',
      sprite: 'URL',
      hp: 30,
      armor: 3,
      xp: 0,
      level: 1,
      class: 'Warrior',
      weapon: { name: 'short sword', damageLow: 3, damageHigh: 6 },
      critChance: 5,
      blockChance: 10,
      gold: 0,
      lastWords: 'A glorious death...for Camelot!',
    },
    {
      spells: [ {
        name: "word of power",
        damageLow: 6,
        damageHigh: 10
    } ],
      inventory: [],
      name: 'Geoffrey',
      sprite: 'URL',
      hp: 30,
      armor: 0,
      xp: 0,
      level: 1,
      class: 'Cleric',
      weapon: { name: 'bronze scepter', damageLow: 1, damageHigh: 3 },
      critChance: 5,
      blockChance: 10,
      gold: 0,
      lastWords: 'With deep sighs and tears, he burst forth into the following complaint...',
    }
  ]

  let monsterSeeds = [
    {
      spells: [],
      inventory: [ {name: "rusted dagger", damageLow: 0, damageHigh: 2 }, 'rotten bone', 'leather belt' ],
      _id: 'd06aa2b9-1d02-46b4-98c2-988b3cc53724',
      name: 'Skeleton',
      sprite: 'placeholder URL',
      hp: 14,
      xp: 2,
      armor: 2,
      level: 2,
      damageLow: 3,
      damageHigh: 6,
      critChance: 4,
      blockChance: 4,
      gold: 2,
      taunt: 'The skeleton shambles forth, silent and followed by the stench of death... ',
    },
    {
      spells: [],
      inventory: [ { name: 'wooden club', damageLow: 8, damageHigh: 12 }, 'cast-iron pan', 'onion' ],
      _id: '9318bf84-1abe-4f7c-bd36-f66dc565e5ae',
      name: 'Ogre',
      sprite: 'placeholder URL',
      hp: 40,
      xp: 6,
      armor: 8,
      level: 6,
      damageLow: 8,
      damageHigh: 12,
      critChance: 5,
      blockChance: 5,
      gold: 0,
      taunt: 'Me..not...like...you....go away!',
    },
    {
      spells: [],
      inventory: [ 'tattered cloth', 'silver bracelet' ],
      _id: '892e0234-0bc1-4ed1-ac73-76baefa39027',
      name: 'Zombie',
      sprite: 'placeholder URL',
      hp: 8,
      xp: 7,
      armor: 0,
      level: 1,
      damageLow: 3,
      damageHigh: 6,
      critChance: 2,
      blockChance: 2,
      gold: 0,
      taunt: 'The zombie groans as it shambles forth.',
    },
    {
      spells: [],
      inventory: [ 'gold necklace', {name: "spiked club", damageLow: 4, damageHigh: 8 } ],
      _id: 'bc86b3bb-9af8-42bc-a6b5-e649e94b159f',
      name: 'Goblin',
      sprite: 'placeholder URL',
      hp: 10,
      xp: 7,
      armor: 0,
      level: 2,
      damageLow: 6,
      damageHigh: 10,
      critChance: 8,
      blockChance: 0,
      gold: 3,
      taunt: 'The goblin is taken by surprise, and immediately attacks you.',
    },
    {
      spells: [],
      inventory: [ 'brimstone pebblees', 'black book', {name: "Sorceror's Dagger", damageLow: 6, damageHigh: 10} ],
      _id: 'dfa76f05-236f-4304-8595-1073c8db894e',
      name: 'Imp',
      sprite: 'placeholder URL',
      hp: 18,
      xp: 2,
      armor: 2,
      level: 2,
      damageLow: 4,
      damageHigh: 8,
      critChance: 20,
      blockChance: 0,
      gold: 12,
      taunt: "The small, immolated creature looks as though it's in pain.",
    },
    {
      spells: [],
      inventory: [ 'copper goblet', 'silk shirt', { name: "golden dagger", damageLow: 12, damageHigh: 24} ],
      _id: '5356731e-7118-4a97-aee1-a659de60d17c',
      name: 'Vampire',
      sprite: 'placeholder URL',
      hp: 8,
      xp: 2,
      armor: 0,
      level: 3,
      damageLow: 12,
      damageHigh: 24,
      critChance: 10,
      blockChance: 5,
      gold: 24,
      taunt: 'The vampire stares at you awkwardly.',
    },
    {
      spells: [],
      inventory: [ 'cracked fang', 'scales', 'drop of venom' ],
      _id: '8b06ec36-b4c5-4813-83d9-e100ce76123d',
      name: 'Giant Viper',
      sprite: 'placeholder URL',
      hp: 30,
      xp: 6,
      armor: 4,
      level: 4,
      damageLow: 2,
      damageHigh: 12,
      critChance: 8,
      blockChance: 0,
      gold: 0,
      taunt: 'Sssss......',
    },
]

let dungeonSeeds = [
    {
      monsters: [
        'Skeleton - Level 2',
        'Vampire - Level 3',
        'Giant Viper - Level 4'
      ],
      treasure: [],
      name: "The Dark Baron's Keep",
      description: 'A once opulent castle now sits, ruined, at the edge of a swamp.',
      level: 5,
      gold: 500,
      boss: {
        spells: [],
        inventory: [Array],
        _id: 'e7acb3ca-48b3-45a1-bba7-ef39a203b91f',
        name: 'The Dark Baron',
        sprite: 'placeholder URL',
        hp: 80,
        xp: 250,
        armor: 10,
        level: 5,
        damageLow: 15,
        damageHigh: 35,
        critChance: 10,
        blockChance: 7,
        gold: 200,
        taunt: 'How dare you enter here unannounced?!?',
      }
    },
    {
      monsters: [ 'Two-Headed Ogre - Level 6', 'Imp - Level 2' ],
      treasure: [],
      name: 'The Molten Pinnacle',
      description: 'A scorched forest valley, with a large cave opening on the other side. ',
      level: 10,
      gold: 10000,
      boss: {
        spells: [],
        inventory: [Array],
        _id: '14356bd9-ac1c-4d45-b8a8-4d96d79ae374',
        name: 'Dragon',
        sprite: 'placeholder URL',
        hp: 340,
        xp: 264,
        armor: 45,
        level: 20,
        damageLow: 35,
        damageHigh: 90,
        critChance: 15,
        blockChance: 10,
        gold: 5000,
        taunt: 'The dragon belches smoke and lets out a terrible roar, as the walls of the cave begin to tremble.',
      }
    },
    {
      monsters: [ 'Skeleton - Level 2' ],
      treasure: [],
      name: 'Fetid Sewer',
      description: 'A disgusting, rat-infested sewer beneath the city streets.',
      level: 1,
      gold: 50,
      boss: {
        spells: [],
        inventory: [Array],
        _id: '5d251238-2f0b-4747-b64b-0b9a69cb66ef',
        name: 'The Rat King',
        sprite: 'placeholder URL',
        hp: 95,
        xp: 24,
        armor: 5,
        level: 3,
        damageLow: 20,
        damageHigh: 25,
        critChance: 20,
        blockChance: 5,
        gold: 0,
        taunt: 'The creature is backed into a corner, and has no choice but to fight you.',
      }
    }
  ];
  
let partySeeds = [
    {
      heroes: [
        'Robin - Level 1',
        'Merlin - Level 1',
        'Arthur - Level 1',
        'Geoffrey - Level 1'
      ],
      name: 'The Merry Band',
    }
  ];

let npcSeeds= [
  {
    name: "Blacksmith",
    sprite: "placeholder URL",
    inventory: [{ name: "Longsword", damageLow: 6, damageHigh: 10, cost: 80}, { name: "Broadsword", damageLow: 8, damageHigh: 14, cost: 120}, { name: "Jeweled Dagger", damageLow: 6, damageHigh: 18, cost: 320 }, { name: "Battle Hammer", damageLow: 2, damageHigh: 24, cost: 220 }],
    gold: 740,
    statements: ["I've got the best equipment you've ever seen!", "Handcrafted, forged with the finest quality...", "We've been doing this for three generations. I know a thing or two about quality!"]
  }
]

db.Npc.insertMany(npcSeeds).then(result=>{console.log(`Npc's inserted`)})
  db.Battle.deleteMany({}).then(resukt=>{console.log("All battles deleted.")})
  db.Hero.deleteMany({})
  .then(() => db.Hero.collection.insertMany(heroSeeds))
  .then(data => {
    console.log(`Inserted ${data.result.n} heroes!`);
  })
  .catch(err => {
    console.error(err);
  });
db.Monster.deleteMany({})
  .then(() => db.Monster.collection.insertMany(monsterSeeds))
  .then(data => {
    console.log(`Inserted ${data.result.n} monsters!`);
  })
  .catch(err => {
    console.error(err);
  });
db.Dungeon.deleteMany({})
  .then(() => db.Dungeon.collection.insertMany(dungeonSeeds))
  .then(data => {
    console.log(`Inserted ${data.result.n} dungeons!`);
  })
  .catch(err => {
    console.error(err);
  });
  db.Party.deleteMany({})
  .then(() => db.Party.collection.insertMany(partySeeds))
  .then(data => {
    console.log(`Inserted ${data.result.n} party!`);
  })
  .catch(err => {
    console.error(err);
  });