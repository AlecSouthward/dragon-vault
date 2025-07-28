const ITEMS = {
  "healing_potion": {
    name: "Potion of Healing",
    type: "consumable",
    effect: "Restores 2d4 + 2 HP",
    rarity: "common",
    weight: 0.5,
    description: "A small vial of red liquid that magically heals wounds when consumed."
  },
  "longsword": {
    name: "Longsword",
    type: "weapon",
    damage: "1d8 slashing",
    properties: ["versatile (1d10)"],
    rarity: "common",
    weight: 3,
    description: "A versatile steel blade used with one or two hands. A staple of many warriors."
  },
  "cloak_of_invisibility": {
    name: "Cloak of Invisibility",
    type: "wondrous item",
    effect: "Grants invisibility while worn",
    rarity: "legendary",
    weight: 1,
    description: "This enchanted cloak renders the wearer invisible until the magic fades or is disrupted."
  },
  "bag_of_holding": {
    name: "Bag of Holding",
    type: "wondrous item",
    effect: "Holds up to 500 lbs, 64 cubic feet",
    rarity: "uncommon",
    weight: 15,
    description: "A seemingly normal sack that opens into a pocket dimension, used to store vast amounts of gear."
  }
};

export default ITEMS;