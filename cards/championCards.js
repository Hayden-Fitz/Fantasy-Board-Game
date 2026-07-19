// =============================
// CHAMPION CARDS
// =============================

const championCards = [

    {
        cardID: "heroic_charge",
        kingdom: "all",
        name: "Heroic Charge",
        category: "champion",
        image: "heroic_charge.webp",

        cost: {
            gold: 2,
            food: 2
        },

        description:
            "The first strike belongs to the fearless.",

        effect: {
            type: "movement_buff",
            target: "friendly_champion",
            movementBonus: 2,
            duration: 1
        },

        balanceNotes:
            "Simple mobility card for reaching battles or objectives."
    },

    {
        cardID: "champions_feast",
        kingdom: "all",
        name: "Champion's Feast",
        category: "champion",
        image: "champions_feast.webp",

        cost: {
            food: 4
        },

        description:
            "Even legends require rest.",

        effect: {
            type: "heal",
            target: "friendly_champion",
            healthRestorePercent: 0.40
        },

        balanceNotes:
            "Primary healing card for champions."
    },

    {
        cardID: "unbreakable_resolve",
        kingdom: "all",
        name: "Unbreakable Resolve",
        category: "champion",
        image: "unbreakable_resolve.webp",

        cost: {
            stone: 3,
            gold: 2
        },

        description:
            "Some heroes simply refuse to fall.",

        effect: {
            type: "defense_buff",
            target: "friendly_champion",
            defenseBonus: 0.50,
            duration: 2
        },

        balanceNotes:
            "Excellent defensive card without becoming permanent."
    },

    {
        cardID: "inspire_the_army",
        kingdom: "all",
        name: "Inspire the Army",
        category: "champion",
        image: "inspire_the_army.webp",

        cost: {
            gold: 2,
            magic: 2
        },

        description:
            "Courage spreads faster than fear.",

        effect: {
            type: "area_attack_buff",
            target: "friendly_combat_units",
            range: 2,
            attackBonus: 0.20,
            duration: 1,
            condition: "within_champion_radius"
        },

        balanceNotes:
            "Rewards keeping armies near your champion."
    },

    {
        cardID: "heroic_leap",
        kingdom: "all",
        name: "Heroic Leap",
        category: "champion",
        image: "heroic_leap.webp",

        cost: {
            magic: 3
        },

        description:
            "No obstacle can stop a determined hero.",

        effect: {
            type: "movement_teleport",
            target: "friendly_champion",
            maxDistance: 5,
            restrictions: [
                "controlled_tiles_only"
            ]
        },

        balanceNotes:
            "Allows repositioning without full teleportation."
    },

    {
        cardID: "heroic_leap_advanced",
        kingdom: "all",
        name: "Heroic Leap",
        category: "champion",
        image: "heroic_leap_advanced.webp",

        cost: {
            magic: 3,
            gold: 2
        },

        description:
            "No obstacle can stop a true hero.",

        effect: {
            type: "movement_teleport",
            target: "friendly_champion",
            maxDistance: 5,
            ignore: [
                "terrain",
                "enemy_units",
                "walls",
                "roads",
                "rivers"
            ]
        },

        balanceNotes:
            "Provides powerful mobility without increasing combat strength."
    },

    {
        cardID: "duel_challenge",
        kingdom: "all",
        name: "Duel Challenge",
        category: "champion",
        image: "duel_challenge.webp",

        cost: {
            metal: 3,
            gold: 2
        },

        description:
            "Settle this with steel.",

        effect: {
            type: "damage_bonus",
            target: "enemy_combat_unit",
            attacker: "friendly_champion",
            damageBonus: 0.50,
            duration: 1,
            condition: "chosen_enemy"
        },

        balanceNotes:
            "Useful for eliminating powerful enemy units."
    },

    {
        cardID: "guardians_return",
        kingdom: "all",
        name: "Guardian's Return",
        category: "champion",
        image: "guardians_return.webp",

        cost: {
            gold: 3,
            food: 2
        },

        description:
            "Home still needs its protector.",

        effect: {
            type: "move_to_capital",
            target: "friendly_champion",
            destination: "capital"
        },

        balanceNotes:
            "Emergency escape card when boss threat becomes dangerous."
    },

    {
        cardID: "legendary_strike",
        kingdom: "all",
        name: "Legendary Strike",
        category: "champion",
        image: "legendary_strike.webp",

        cost: {
            metal: 4,
            magic: 3
        },

        description:
            "One perfect blow changes history.",

        effect: {
            type: "damage_multiplier",
            target: "friendly_champion",
            nextAttackMultiplier: 2
        },

        balanceNotes:
            "High-cost finishing move."
    },

    {
        cardID: "rally_the_champion",
        kingdom: "all",
        name: "Rally the Champion",
        category: "champion",
        image: "rally_the_champion.webp",

        cost: {
            food: 2,
            gold: 2
        },

        description:
            "The kingdom stands behind its hero.",

        effect: {
            type: "refresh_champion",
            target: "friendly_champion",
            effects: [
                "restore_actions",
                "allow_move",
                "allow_attack"
            ],
            duration: 1
        },

        balanceNotes:
            "One of the strongest champion cards."
    }

];

export default championCards;