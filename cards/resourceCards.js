// =============================
// RESOURCE CARDS
// =============================

const resourceCards = [

    {
        cardID: "merchant_caravan",
        kingdom: "all",
        name: "Merchant Caravan",
        category: "resource",
        image: "assets/CardImages/resourceImages/merchantCaravan.jpg",

        cost: {
            gold: 2
        },

        description:
            "Gain 6 of any one resource of your choice. Pick the resource you need most and add 6 of it to your supply.",

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
        image: "assets/CardImages/resourceImages/harvestSeason.jpg",

        cost: {
            gold: 1
        },

        description:
            "Collect 10 Food from a season of plentiful crops. Great for feeding large armies or preparing for future turns.",

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
        image: "assets/CardImages/resourceImages/richVein.jpg",

        cost: {
            food: 2
        },

        description:
            "Mine a valuable metal deposit and gain 8 Metal. Use it to recruit stronger troops or construct advanced buildings.",

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
        image: "assets/CardImages/resourceImages/ancientQuarry.jpg",

        cost: {
            food: 1
        },

        description:
            "Extract stone from an ancient quarry and gain 8 Stone. Perfect for constructing walls and defensive structures.",

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
        image: "assets/CardImages/resourceImages/enchantedGrove.jpg",

        cost: {
            food: 2
        },

        description:
            "Gather rare enchanted timber and gain 8 Wood. An excellent source of materials for roads and new buildings.",

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
        image: "assets/CardImages/resourceImages/arcaneSurge.jpg",

        cost: {
            gold: 3
        },

        description:
            "Channel magical energy to gain 6 Magic. This resource is useful for powerful cards and champion abilities.",

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
        image: "assets/CardImages/resourceImages/royalTaxes.jpg",

        cost: {
            food: 2
        },

        description:
            "Collect taxes from across your kingdom and gain 10 Gold. A massive burst of wealth for expensive plays.",

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
        image: "assets/CardImages/resourceImages/resourceExchange.jpg",

        cost: {
            WILD: 5
        },

        description:
            "Trade up to 5 of one resource for an equal amount of another. Convert excess resources into exactly what you need.",

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
        image: "assets/CardImages/resourceImages/emergencySupplies.jpg",

        cost: {
            gold: 2
        },

        description:
            "Choose any three resource rewards. Each choice grants 3 of any resource, for a total of 9 resources however you divide them.",

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
        image: "assets/CardImages/resourceImages/kingsBlessing.jpg",

        cost: {
            gold: 4,
            magic: 2
        },

        description:
            "Receive the King's blessing and gain 6 Wood, 6 Stone, 6 Metal, and 6 Food all at once to strengthen your kingdom.",

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