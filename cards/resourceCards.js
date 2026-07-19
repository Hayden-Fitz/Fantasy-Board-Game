// =============================
// RESOURCE CARDS
// =============================

const resourceCards = [

    {
        cardID: "merchant_caravan",
        kingdom: "all",
        name: "Merchant Caravan",
        category: "resource",
        image: "merchant_caravan.webp",

        cost: {
            gold: 2
        },

        description:
            "Trade keeps kingdoms alive.",

        effect: {
            type: "resource_gain",
            target: "player",
            resource: "chosen_resource",
            amount: 6
        },

        balanceNotes:
            "Simple, flexible resource generator."
    },

    {
        cardID: "harvest_season",
        kingdom: "all",
        name: "Harvest Season",
        category: "resource",
        image: "harvest_season.webp",

        cost: {
            gold: 1
        },

        description:
            "The land provides.",

        effect: {
            type: "resource_gain",
            target: "player",
            resource: "food",
            amount: 10
        },

        balanceNotes:
            "Excellent for feeding large armies."
    },

    {
        cardID: "rich_vein",
        kingdom: "all",
        name: "Rich Vein",
        category: "resource",
        image: "rich_vein.webp",

        cost: {
            food: 2
        },

        description:
            "The mountain rewards the patient.",

        effect: {
            type: "resource_gain",
            target: "player",
            resource: "metal",
            amount: 8
        },

        balanceNotes:
            "Supports military production."
    },

    {
        cardID: "ancient_quarry",
        kingdom: "all",
        name: "Ancient Quarry",
        category: "resource",
        image: "ancient_quarry.webp",

        cost: {
            food: 1
        },

        description:
            "Stone outlasts kingdoms.",

        effect: {
            type: "resource_gain",
            target: "player",
            resource: "stone",
            amount: 8
        },

        balanceNotes:
            "Supports defensive building."
    },

    {
        cardID: "enchanted_grove",
        kingdom: "all",
        name: "Enchanted Grove",
        category: "resource",
        image: "enchanted_grove.webp",

        cost: {
            food: 2
        },

        description:
            "The forest whispers its secrets.",

        effect: {
            type: "resource_gain",
            target: "player",
            resource: "wood",
            amount: 8
        },

        balanceNotes:
            "Supports construction."
    },

    {
        cardID: "arcane_surge",
        kingdom: "all",
        name: "Arcane Surge",
        category: "resource",
        image: "arcane_surge.webp",

        cost: {
            gold: 3
        },

        description:
            "The world overflows with power.",

        effect: {
            type: "resource_gain",
            target: "player",
            resource: "magic",
            amount: 6
        },

        balanceNotes:
            "Supports champion and spell cards."
    },

    {
        cardID: "royal_taxes",
        kingdom: "all",
        name: "Royal Taxes",
        category: "resource",
        image: "royal_taxes.webp",

        cost: {
            food: 2
        },

        description:
            "The crown always collects.",

        effect: {
            type: "resource_gain",
            target: "player",
            resource: "gold",
            amount: 10
        },

        balanceNotes:
            "Largest gold burst in the deck."
    },

    {
        cardID: "resource_exchange",
        kingdom: "all",
        name: "Resource Exchange",
        category: "resource",
        image: "resource_exchange.webp",

        cost: {},

        description:
            "Everything has value.",

        effect: {
            type: "resource_conversion",
            target: "player",
            discardResource: "chosen_resource",
            discardAmount: {
                maximum: 5
            },
            gainResource: "chosen_resource",
            gainAmount: "equal_to_discarded_amount"
        },

        balanceNotes:
            "Excellent flexibility without creating resources."
    },

    {
        cardID: "emergency_supplies",
        kingdom: "all",
        name: "Emergency Supplies",
        category: "resource",
        image: "emergency_supplies.webp",

        cost: {
            gold: 2
        },

        description:
            "The kingdom always keeps reserves.",

        effect: {
            type: "resource_gain",
            target: "player",
            resources: [
                {
                    resource: "chosen_resource",
                    amount: 3
                },
                {
                    resource: "chosen_resource",
                    amount: 3
                },
                {
                    resource: "chosen_resource",
                    amount: 3
                }
            ]
        },

        balanceNotes:
            "Versatile recovery card."
    },

    {
        cardID: "kings_blessing",
        kingdom: "all",
        name: "King's Blessing",
        category: "resource",
        image: "kings_blessing.webp",

        cost: {
            gold: 4,
            magic: 2
        },

        description:
            "Prosperity smiles upon the kingdom.",

        effect: {
            type: "resource_gain",
            target: "player",
            resources: {
                wood: 6,
                stone: 6,
                metal: 6,
                food: 6
            }
        },

        balanceNotes:
            "Ultimate economy card."
    }

];

export default resourceCards;