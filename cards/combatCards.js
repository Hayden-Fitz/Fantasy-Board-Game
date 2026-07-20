// =============================
// COMBAT CARDS
// =============================

const combatCards = [

    {
        cardID: "battle_fury",
        kingdom: "all",
        name: "Battle Fury",
        category: "combat",
        image: "assets/CardImages/combatImages/battleFury.jpg",

        cost: {
            metal: 2,
            gold: 1
        },

        description:
            "The drums beat louder as soldiers charge without fear. One friendly unit gains 25% more attack power for its next battle this turn.",

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
        image: "assets/CardImages/combatImages/emergencyHeal.jpg",

        cost: {
            food: 3
        },

        description:
            "Fresh supplies restore wounded troops before they fall. Heal all friendly units within 2 tiles for 15% of their maximum health.",

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
        image: "assets/CardImages/combatImages/defensiveFormation.jpg",

        cost: {
            stone: 2
        },

        description:
            "Locked shields turn an army into an unbreakable wall. One friendly unit gains 50% extra defense during its next combat this turn.",

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
        cardID: "Reinforcements",
        kingdom: "all",
        name: "Reinforcements",
        category: "combat",
        image: "assets/CardImages/combatImages/reinforcements.jpg",

        cost: {
            gold: 5,
            food: 2,
            magic: 1
        },

        description:
            "Fresh soldiers rush onto the battlefield when hope seems lost. Summon any troop type onto a tile you currently control.",

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
        image: "assets/CardImages/combatImages/warDrums.jpg",

        cost: {
            gold: 3
        },

        description:
            "The thunder of war echoes across the battlefield. One friendly unit gains +2 movement for the remainder of this turn.",

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
        image: "assets/CardImages/combatImages/precisionStrike.jpg",

        cost: {
            metal: 2,
            magic: 2
        },

        description:
            "Target one enemy unit and deal direct damage of 20% its max health. A perfect attack for weakening powerful enemies before the main battle begins.",

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
        image: "assets/CardImages/combatImages/rallyingCry.jpg",

        cost: {
            food: 2,
            gold: 1
        },

        description:
            "Your troops gain +20% attack and +1 movement for this turn. Use it to push farther into enemy territory while increasing your army's damage output.",

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
        image: "assets/CardImages/combatImages/tacticalRetreat.jpg",

        cost: {
            gold: 2,
            food: 1
        },

        description:
            "Move one friendly unit up to 3 tiles without fighting. Perfect for escaping danger, repositioning forces, or capturing an important objective before your opponent.",

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
        image: "assets/CardImages/combatImages/siegeBreaker.jpg",

        cost: {
            metal: 3,
            stone: 2,
            wood: 1
        },

        description:
            "For the next 2 turns, one friendly siege force deals double damage against walls, fortresses, and siege engines. Ideal for breaking through heavy defenses quickly.",

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
        image: "assets/CardImages/combatImages/championsCommand.jpg",

        cost: {
            gold: 4,
            magic: 4
        },

        description:
            "All friendly units within 2 tiles of your Champion gain +50% attack, +25% defense, and +1 movement for 3 turns. Keep your army close to maximize the effect.",

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