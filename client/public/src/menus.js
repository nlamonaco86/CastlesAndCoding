const menus = [
    {
      path: "/",
      img: { src: 'http://placehold.it/700x350&text=Dragon_Goes_Here', alt: "A fearsome dragon" },
      title: "CASTLES & CODING",
      options: [{ title: "CREATE", href: "./create" }, { title: "VIEW", href: "./view" }, { title: "BATTLE", href: "./battle" }, { title: "VISIT TOWN", href: "./town" }]
    },
    {
      path: "/create",
      img: { src: 'http://placehold.it/700x350&text=Characters_Standing_Around', alt: "Characters Standing Around" },
      title: "CREATE",
      options: [{ title: "HERO", href: "./create/hero" }, { title: "MONSTER", href: "./create/monster" }, { title: "PARTY", href: "./create/party" }, { title: "DUNGEON", href: "./create/dungeon" }, { title: "MAIN MENU", href: "./" }]
    },
    {
      path: "/view",
      img: { src: 'http://placehold.it/700x350&text=Characters_Standing_Around', alt: "Characters Standing Around" },
      title: "VIEW",
      options: [{ title: "HERO", href: "./view/hero" }, { title: "MONSTER", href: "./view/monster" }, { title: "PARTY", href: "./view/party" }, { title: "DUNGEON", href: "./view/dungeon" }, { title: "MAIN MENU", href: "./" }]
    },
    {
      path: "/view/hero",
      img: { src: 'http://placehold.it/700x350&text=Characters_Standing_Around', alt: "Characters Standing Around" },
      title: "VIEW",
      options: [{ title: "HERO", href: "./view/hero" }, { title: "MONSTER", href: "./view/monster" }, { title: "PARTY", href: "./view/party" }, { title: "DUNGEON", href: "./view/dungeon" }, { title: "MAIN MENU", href: "./" }]
    },
    {
      path: "/battle", 
      img: { src: 'http://placehold.it/700x350&text=Characters_Battling_Monsters', alt: "Characters Battling Monsters" },
      title: "BATTLE",
      options: [{ title: "HERO vs. MONSTER", href: "./battle/vs" }, { title: "RAID A DUNGEON", href: "./battle/raid" }, { title: "UNTIL YOU LOSE", href: "./vs/untilYouLose" }, { title: "MAIN MENU", href: "./" }]
    },
    {
      path: "/town",
      img: { src: 'http://placehold.it/700x350&text=Ye_Olde_Towne', alt: "Peasants suffering under the yoke of feudalism" },
      title: "WHERE WOULD YOU LIKE TO GO?",
      options: [{ title: "BLACKSMITH", href: "./town/blacksmith" }, { title: "TAVERN", href: "./town/tavern" }, { title: "MARKETPLACE", href: "./town/marketplace" }, { title: "MAIN MENU", href: "./" }]
    }
  
  ]

  export default menus;