// =============================
// BUILDING CARDS
// =============================

const buildingCards = [

    {
        cardID: "master_builders",
        kingdom: "all",
        name: "Master Builders",
        category: "building",
        image: "master_builders.webp",

        cost: {
            wood: 2,
            stone: 2
        },

        description:
            "Great kingdoms are built by greater hands.",

        effect: {
            type: "building_discount",
            discount: 0.50,
            target: "building",
            amount: 1
        },

        balanceNotes:
            "Build one structure for 50% of its normal resource cost."
    },

    {
        cardID: "emergency_workforce",
        kingdom: "all",
        name: "Emergency Workforce",
        category: "building",
        image: "emergency_workforce.webp",

        cost: {
            food: 5,
            gold: 3,
            magic: 2
        },

        description:
            "When time matters more than cost.",

        effect: {
            type: "spawn_workers",
            amount: 2,
            target: "controlled_resource_tiles",
            requiresOccupiedTile: true
        },

        balanceNotes:
            "Summon two Workers onto occupied resource tiles you control."
    },

    {
        cardID: "rapid_construction",
        kingdom: "all",
        name: "Rapid Construction",
        category: "building",
        image: "rapid_construction.webp",

        cost: {
            wood: 3,
            stone: 2
        },

        description:
            "Every road leads to victory.",

        effect: {
            type: "instant_build",
            building: "road",
            amount: 3,
            requiresResources: false
        },

        balanceNotes:
            "Instantly build up to three Roads."
    },

    {
        cardID: "sabotage",
        kingdom: "all",
        name: "Sabotage",
        category: "building",
        image: "sabotage.webp",

        cost: {
            gold: 2,
            magic: 2
        },

        description:
            "No wall is truly safe.",

        effect: {
            type: "destroy_building",
            target: "enemy_building",
            amount: 1,
            ignoresDefense: false
        },

        balanceNotes:
            "Destroy one enemy building."
    },

    {
        cardID: "forced_march",
        kingdom: "all",
        name: "Forced March",
        category: "building",
        image: "forced_march.webp",

        cost: {
            food: 3,
            gold: 2
        },

        description:
            "Sleep is a luxury.",

        effect: {
            type: "extra_worker_actions",
            bonusActions: 1,
            duration: 1,
            target: "friendly_workers"
        },

        balanceNotes:
            "Workers may perform two normal build actions this turn."
    },

    {
        cardID: "reinforced_foundations",
        kingdom: "all",
        name: "Reinforced Foundations",
        category: "building",
        image: "reinforced_foundations.webp",

        cost: {
            stone: 2,
            metal: 2
        },

        description:
            "What is built well shall never fall.",

        effect: {
            type: "building_protection",
            duration: 5,
            target: "friendly_building",
            protectsFrom: [
                "card_destroy_effects"
            ]
        },

        balanceNotes:
            "Protects one building from destruction cards."
    },

    {
        cardID: "supply_depot",
        kingdom: "all",
        name: "Supply Depot",
        category: "building",
        image: "supply_depot.webp",

        cost: {
            wood: 3,
            gold: 3
        },

        description:
            "Every empire begins with labor.",

        effect: {
            type: "spawn_worker",
            amount: 1,
            target: "capital"
        },

        balanceNotes:
            "Immediately summon one Worker at your Capital."
    },

    {
        cardID: "engineering_breakthrough",
        kingdom: "all",
        name: "Engineering Breakthrough",
        category: "building",
        image: "engineering_breakthrough.webp",

        cost: {
            magic: 3,
            gold: 2
        },

        description:
            "The impossible becomes routine.",

        effect: {
            type: "complete_construction",
            target: "building_under_construction",
            amount: 1,
            keepsResourceCost: true
        },

        balanceNotes:
            "Instantly completes one building under construction."
    },

    {
        cardID: "royal_treasury",
        kingdom: "all",
        name: "Royal Treasury",
        category: "building",
        image: "royal_treasury.webp",

        cost: {
            gold: 5,
            magic: 2
        },

        description:
            "Gold solves many problems.",

        effect: {
            type: "next_build_discount",
            resourceCost: 1,
            duration: 1,
            target: "friendly_building"
        },

        balanceNotes:
            "Next building costs only one of each required resource."
    },

    {
        cardID: "grand_expansion",
        kingdom: "all",
        name: "Grand Expansion",
        category: "building",
        image: "grand_expansion.webp",

        cost: {
            wood: 4,
            stone: 4,
            gold: 2
        },

        description:
            "The future belongs to those who build it.",

        effect: {
            type: "choose_build",
            options: [
                {
                    building: "road",
                    amount: 2
                },
                {
                    building: "wall",
                    amount: 1
                },
                {
                    building: "bridge",
                    amount: 1
                },
                {
                    building: [
                        "barracks",
                        "workshop"
                    ],
                    amount: 1
                }
            ]
        },

        balanceNotes:
            "Massive tempo card that saves time, not resources."
    }

];

export default buildingCards;