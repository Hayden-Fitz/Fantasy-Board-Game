// =============================
// BUILDING CARDS
// =============================

const buildingCards = [

    {
        cardID: "master_builders",
        kingdom: "all",
        name: "Master Builders",
        category: "building",
        image: "assets/CardImages/buildingImages/masterBuilders.jpg",

        cost: {
            wood: 2,
            stone: 2
        },

        description:
            "Master Builders reduce the cost of your next building by 50%, letting you construct powerful structures for half their normal resources.",

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
        image: "assets/CardImages/buildingImages/emergencyWorkforce.jpg",

        cost: {
            food: 5,
            gold: 3,
            magic: 2
        },

        description:
            "Summon two Workers onto occupied resource tiles you control, allowing you to expand or gather resources much more quickly.",

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
        image: "assets/CardImages/buildingImages/rapidConstruction.jpg",

        cost: {
            wood: 3,
            stone: 2
        },

        description:
            "Instantly construct up to three Roads without paying their normal building costs, helping your kingdom expand in a single turn.",

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
        image: "assets/CardImages/buildingImages/sabotage.jpg",

        cost: {
            gold: 2,
            magic: 2
        },

        description:
            "Destroy one enemy building to disrupt their economy, defenses, or expansion before they can recover.",

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
        image: "assets/CardImages/buildingImages/forcedMarch.jpg",

        cost: {
            food: 3,
            gold: 2
        },

        description:
            "Push your Workers beyond their limits, allowing each Worker to perform one additional build action during this turn.",

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
        image: "assets/CardImages/buildingImages/reinforcedFoundations.jpg",

        cost: {
            stone: 2,
            metal: 2
        },

        description:
            "Fortify one of your buildings for 5 turns. It cannot be destroyed by card effects while Reinforced Foundations remains active.",

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
        image: "assets/CardImages/buildingImages/supplyDepot.jpg",

        cost: {
            wood: 3,
            gold: 3
        },

        description:
            "Establish a new Supply Depot and immediately summon one Worker at your Capital to help expand your kingdom.",

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
        image: "assets/CardImages/buildingImages/engineeringBreakthrough.jpg",

        cost: {
            magic: 3,
            gold: 2
        },

        description:
            "Complete one building that is currently under construction instantly without paying any additional resources.",

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
        image: "assets/CardImages/buildingImages/royalTreasury.jpg",

        cost: {
            gold: 5,
            magic: 2
        },

        description:
            "Your next building costs only one of each required resource, making even the largest projects much easier to afford.",

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
        image: "assets/CardImages/buildingImages/grandExpansion.jpg",

        cost: {
            wood: 4,
            stone: 4,
            gold: 2
        },

        description:
            "Choose one major construction project: build 2 Roads, 1 Wall, 1 Bridge, or either a Barracks or Workshop instantly.",

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
    },

];

export default buildingCards;