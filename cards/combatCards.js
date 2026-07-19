// =============================
// COMBAT CARDS
// =============================

const combatCards = [

    {
        cardID: "battle_fury",
        kingdom: "all",
        name: "Battle Fury",
        category: "combat",
        image: "battle_fury.webp",

        cost: {
            metal: 2,
            gold: 1
        },

        description:
            "The drums beat louder. The soldiers remember why they fight.",

        effect: {
            type: "attack_buff",
            value: 0.25,
            duration: 1,
            target: "friendly_unit"
        },

        balanceNotes:
            "One encounter only."
    },

    {
        cardID: "emergency_heal",
        kingdom: "all",
        name: "Emergency Heal",
        category: "combat",
        image: "emergency_heal.webp",

        cost: {
            food: 3
        },

        description:
            "Even the strongest armies need time to recover.",

        effect: {
            type: "heal_radius",
            value: 0.15,
            radius: 2,
            target: "friendly_units"
        },

        balanceNotes:
            "Area heal."
    },

    {
        cardID: "defensive_formation",
        kingdom: "all",
        name: "Defensive Formation",
        category: "combat",
        image: "defensive_formation.webp",

        cost: {
            stone: 2
        },

        description:
            "A shield alone breaks. A thousand shields become a fortress.",

        effect: {
            type: "defense_buff",
            value: 0.50,
            duration: 1,
            target: "friendly_unit"
        },

        balanceNotes:
            "Counter to Battle Fury."
    },

    {
        cardID: "battlefield_reinforcements",
        kingdom: "all",
        name: "Battlefield Reinforcements",
        category: "combat",
        image: "battlefield_reinforcements.webp",

        cost: {
            gold: 5,
            food: 2,
            magic: 1
        },

        description:
            "The battle is not over until the last soldier arrives.",

        effect: {
            type: "summon_unit",
            target: "controlled_tile"
        },

        balanceNotes:
            "Summon any troop type onto a controlled tile."
    },

    {
        cardID: "war_drums",
        kingdom: "all",
        name: "War Drums",
        category: "combat",
        image: "war_drums.webp",

        cost: {
            gold: 3
        },

        description:
            "The sound of war can be heard across the entire battlefield.",

        effect: {
            type: "movement_buff",
            value: 2,
            duration: 1,
            target: "friendly_unit"
        },

        balanceNotes:
            "Grants +2 movement this turn."
    },

    {
        cardID: "precision_strike",
        kingdom: "all",
        name: "Precision Strike",
        category: "combat",
        image: "precision_strike.webp",

        cost: {
            metal: 2,
            magic: 2
        },

        description:
            "One perfect shot can change the course of a war.",

        effect: {
            type: "direct_damage",
            value: 0.20,
            target: "enemy_unit"
        },

        balanceNotes:
            "Deals 20% health damage."
    },

    {
        cardID: "rallying_cry",
        kingdom: "all",
        name: "Rallying Cry",
        category: "combat",
        image: "rallying_cry.webp",

        cost: {
            food: 2,
            gold: 1
        },

        description:
            "A true leader does not command armies. They inspire them.",

        effect: {
            type: "mixed_buff",
            attack: 0.20,
            movement: 1,
            duration: 1,
            target: "friendly_unit"
        },

        balanceNotes:
            "Temporary offensive push."
    },

    {
        cardID: "tactical_retreat",
        kingdom: "all",
        name: "Tactical Retreat",
        category: "combat",
        image: "tactical_retreat.webp",

        cost: {
            gold: 2,
            food: 1
        },

        description:
            "A wise commander knows when to fight another day.",

        effect: {
            type: "move_unit",
            range: 3,
            target: "friendly_unit"
        },

        balanceNotes:
            "Move a unit up to 3 tiles."
    },

    {
        cardID: "siege_breaker",
        kingdom: "all",
        name: "Siege Breaker",
        category: "combat",
        image: "siege_breaker.webp",

        cost: {
            metal: 3,
            stone: 2,
            wood: 1
        },

        description:
            "Every fortress has a weakness.",

        effect: {
            type: "siege_bonus",
            multiplier: 2,
            duration: 2,
            targets: [
                "wall",
                "fortress",
                "siege_engine"
            ]
        },

        balanceNotes:
            "Double damage versus structures."
    },

    {
        cardID: "champions_command",
        kingdom: "all",
        name: "Champion's Command",
        category: "combat",
        image: "champions_command.webp",

        cost: {
            gold: 4,
            magic: 4
        },

        description:
            "When champions lead, kingdoms follow.",

        effect: {
            type: "champion_buff",
            attack: 0.50,
            defense: 0.25,
            movement: 1,
            radius: 2,
            duration: 3,
            target: "friendly_unit"
        },

        balanceNotes:
            "Units must be within 2 tiles of your champion."
    }

];

export default combatCards;