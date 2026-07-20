// =============================
// CHAMPION CARDS
// =============================

const championCards = [

    {
        cardID: "heroic_charge",
        kingdom: "all",
        name: "Heroic Charge",
        category: "champion",
        image: "assets/CardImages/championImages/heroicCharge.jpg",

        cost: {
            gold: 2,
            food: 2
        },

        description:
            "Move your Champion up to 2 extra spaces this turn, allowing them to quickly reach battles, objectives, or defend your kingdom.",

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
        image: "assets/CardImages/championImages/championsFeast.jpg",

        cost: {
            food: 4
        },

        description:
            "Restore 40% of your Champion's maximum health, keeping them in the fight without returning to your Capital.",

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
        image: "assets/CardImages/championImages/unbreakableResolve.jpg",

        cost: {
            stone: 3,
            gold: 2
        },

        description:
            "Your Champion gains 50% bonus defense for the next 2 turns, reducing damage taken during future battles.",

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
        image: "assets/CardImages/championImages/inspireTheArmy.jpg",

        cost: {
            gold: 2,
            magic: 2
        },

        description:
            "Friendly combat units within 2 spaces of your Champion gain 20% bonus attack until the end of this turn.",

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
        image: "assets/CardImages/championImages/heroicLeap.jpg",

        cost: {
            magic: 3
        },

        description:
            "Teleport your Champion up to 5 controlled tiles away, ignoring normal movement while remaining inside your territory.",

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
        image: "assets/CardImages/championImages/heroicLeapAdvanced.jpg",

        cost: {
            magic: 3,
            gold: 2
        },

        description:
            "Teleport your Champion up to 5 spaces, ignoring terrain, rivers, roads, walls, and enemy units while moving.",

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
        image: "assets/CardImages/championImages/duelChallenge.jpg",

        cost: {
            metal: 3,
            gold: 2
        },

        description:
            "Choose one enemy combat unit. Your Champion deals 50% extra damage when attacking that unit this turn.",

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
        image: "assets/CardImages/championImages/guardiansReturn.jpg",

        cost: {
            gold: 3,
            food: 2
        },

        description:
            "Instantly move your Champion back to your Capital to defend against threats or safely recover from danger.",

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
        image: "assets/CardImages/championImages/legendaryStrike.jpg",

        cost: {
            metal: 4,
            magic: 3
        },

        description:
            "Your Champion's next attack deals double damage, making it ideal for defeating bosses or elite enemy units.",

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
        image: "assets/CardImages/championImages/rallyTheChampion.jpg",

        cost: {
            food: 2,
            gold: 2
        },

        description:
            "Refresh your Champion so they may move and attack again this turn, even if they have already acted.",

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
    },
];

export default championCards;