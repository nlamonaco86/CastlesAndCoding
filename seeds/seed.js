const mongoose = require("mongoose");
const db = require("../models");

mongoose.connect("mongodb://localhost/cncDb", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

let heroSeeds = [
  {
    spells: {
      name: "I don't do magic.",
      damageLow: 0,
      damageHigh: 0
    },
    inventory: [],
    name: 'Robin',
    _id:  new mongoose.Types.ObjectId("5fee423eb8215e20d84797e5"),
    sprite: '/assets/thief.png',
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
    spells: {
      name: "fireball",
      damageLow: 8,
      damageHigh: 12
    },
    inventory: [],
    name: 'Merlin',
    _id:  new mongoose.Types.ObjectId("5fee423eb8215e20d84797e6"),
    sprite: '/assets/wizard.png',
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
    spells: {
      name: "I don't do magic.",
      damageLow: 0,
      damageHigh: 0
    },
    inventory: [],
    name: 'Arthur',
    _id:  new mongoose.Types.ObjectId("5fee423eb8215e20d84797e7"),
    sprite: '/assets/warrior.png',
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
    spells: {
      name: "word of power",
      damageLow: 6,
      damageHigh: 10
    },
    inventory: [],
    name: 'Geoffrey',
    _id:  new mongoose.Types.ObjectId("5fee423eb8215e20d84797e8"),
    sprite: '/assets/cleric.png',
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
    inventory: [{ name: "rusted dagger", damageLow: 0, damageHigh: 2 }, 'rotten bone', 'leather belt'],
    name: 'Skeleton',
    sprite:"https://via.placeholder.com/300x450?text=Skeleton",
    hp: 14,
    xp: 2,
    armor: 2,
    level: 2,
    damageLow: 3,
    damageHigh: 6,
    critChance: 4,
    blockChance: 4,
    gold: 2,
    taunt: 'The skeleton relentlessly shambles forth, silent and followed by the stench of death... ',
  },
  {
    spells: [],
    inventory: [{ name: 'wooden club', damageLow: 8, damageHigh: 12 }, 'cast-iron pan', 'onion'],
    name: 'Giant Ogre',
    sprite:"https://via.placeholder.com/300x450?text=Giant Ogre",
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
    inventory: ['tattered cloth', 'silver bracelet'],
    name: 'Zombie',
    sprite:"https://via.placeholder.com/300x450?text=Zombie",
    hp: 8,
    xp: 7,
    armor: 0,
    level: 1,
    damageLow: 3,
    damageHigh: 6,
    critChance: 2,
    blockChance: 2,
    gold: 0,
    taunt: 'The zombie groans as it turns to face you.',
  },
  {
    spells: [],
    inventory: ['gold necklace', { name: "spiked club", damageLow: 4, damageHigh: 8 }],
    name: 'Goblin',
    sprite:"https://via.placeholder.com/300x450?text=Goblin",
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
    inventory: ['brimstone pebblees', 'black book', { name: "Sorceror's Dagger", damageLow: 6, damageHigh: 10 }],
    name: 'Imp',
    sprite:"https://via.placeholder.com/300x450?text=Imp",
    hp: 18,
    xp: 2,
    armor: 2,
    level: 2,
    damageLow: 4,
    damageHigh: 8,
    critChance: 20,
    blockChance: 0,
    gold: 12,
    taunt: "The small, immolated creature looks as though it's in terrible pain.",
  },
  {
    spells: [],
    inventory: ['copper goblet', 'silk shirt', { name: "golden dagger", damageLow: 12, damageHigh: 24 }],
    name: 'Vampire',
    sprite:"https://via.placeholder.com/300x450?text=Vampire",
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
    inventory: ['cracked fang', 'scales', 'drop of venom'],
    name: 'Giant Viper',
    sprite:"https://via.placeholder.com/300x450?text=Giant Viper",
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
    sprite:"https://via.placeholder.com/550x300?text=The Dark Keep",
    description: 'A once opulent castle now sits, ruined, at the edge of a swamp. Travelers through the area report hearing the sounds of banquets and large audiences - but withotu a soul in sight.',
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
    monsters: ['Two-Headed Ogre - Level 6', 'Imp - Level 2'],
    treasure: [],
    name: 'The Molten Pinnacle',
    sprite:"https://via.placeholder.com/550x300?text=The Molten Pinnacle",
    description: 'A scorched forest valley, with a large cave opening on the other side. Legends tell of an ancient dragon that has slept inside the cave for centuries, but none have ever dared to enter before.',
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
      taunt: 'The dragon belches smoke and lets out a terrible roar, as the walls of the cave begin to tremble. It will not give up its treasure.',
    }
  },
  {
    monsters: ['Skeleton - Level 2'],
    treasure: [],
    name: 'Fetid Sewer',
    sprite:"https://via.placeholder.com/550x300?text=Fetid Sewer",
    description: 'A disgusting, rat-infested sewer beneath the city streets. The work crews sent to investigate the source of the trouble have not returned, and the townsfolk fear they are dead.',
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
      taunt: `The poor, wretched creature is backed into a corner, and has no choice but to fight you. It's too dangerous to be left alive.`,
    }
  },
  {
    monsters: [],
    treasure: [
      "The Golden Duckling"
    ],
    name: "The Archives",
    sprite:"https://via.placeholder.com/550x300?text=The Archives",
    level: 20,
    gold: 3200,
    description: "A pile of books sits against the far wall of a dark, underground dungeon. Written within are thousands of lines of mysterious glyphs. The townsfolk say everything was just fine, until The Bug found its way in.",
    boss: {
      name: "The Bug",
      hp: "1",
      armor: "0",
      damageLow: "35",
      damageHigh: "90",
      critChance: "10",
      blockChance: "99",
      gold: "1400",
      xp: "10000",
      level: "20",
      taunt: "The monster is weak and easily vanquished if confronted with the powers of arcane knowledge. It is elusive, and countless others have lost their sanity in trying to do so."
    }
  }
];

let partySeeds = [
  {
    heroes : [ 
      "5fee423eb8215e20d84797e5", 
      "5fee423eb8215e20d84797e6", 
      "5fee423eb8215e20d84797e7", 
      "5fee423eb8215e20d84797e8"
  ],
  name: "The Merry Band",
  level: 1,
  sprite: "http://via.placeholder.com/600x350?text=party_of_heroes",
  }
];

let npcSeeds = [
  {
    name: "Blacksmith",
    sprite: "placeholder URL",
    inventory: [{ name: "Longsword", damageLow: 6, damageHigh: 10, cost: 80 }, { name: "Broadsword", damageLow: 8, damageHigh: 14, cost: 120 }, { name: "Jeweled Dagger", damageLow: 6, damageHigh: 18, cost: 320 }, { name: "Battle Hammer", damageLow: 2, damageHigh: 24, cost: 220 }],
    gold: 740,
    statements: ["I've got the best equipment you've ever seen!", "Handcrafted, forged with the finest quality...", "We've been doing this for three generations. I know a thing or two about quality!"]
  }
]

db.Npc.insertMany(npcSeeds).then(result => { console.log(`Npc's inserted`) })
db.Battle.deleteMany({}).then(resukt => { console.log("All battles deleted.") })
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