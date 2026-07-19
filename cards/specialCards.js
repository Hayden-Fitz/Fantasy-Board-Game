// =============================
// SPECIAL CARDS
// =============================

const specialCards = [

    {
        cardID: "cataclysm_ritual",
        kingdom: "all",
        name: "Cataclysm Ritual",
        category: "special",
        image: "cataclysm_ritual.webp",

        cost: {
            magic: 6,
            gold: 6
        },

        description:
            "The world itself trembles.",

        effect: {
            type: "trigger_cataclysm",
            target: "all_opponents",
            cataclysmCount: 1,
            affectsCaster: false
        },

        balanceNotes:
            "Devastating multiplayer card."
    },

    {
        cardID: "peace_treaty",
        kingdom: "all",
        name: "Peace Treaty",
        category: "special",
        image: "peace_treaty.webp",

        cost: {
            gold: 4
        },

        description:
            "Even enemies need time to breathe.",

        effect: {
            type: "attack_prevention",
            target: "chosen_opponent",
            duration: 1,
            restrictions: [
                "cannot_attack_each_other"
            ]
        },

        balanceNotes:
            "Buys time."
    },

    {
        cardID: "spy_network",
        kingdom: "all",
        name: "Spy Network",
        category: "special",
        image: "spy_network.webp",

        cost: {
            gold: 3,
            magic: 2
        },

        description:
            "Secrets win wars.",

        effect: {
            type: "hand_disruption",
            target: "chosen_opponent",
            viewHand: true,
            discardCount: 1
        },

        balanceNotes:
            "Strong disruption."
    },

    {
        cardID: "resource_convoy",
        kingdom: "all",
        name: "Resource Convoy",
        category: "special",
        image: "resource_convoy.webp",

        cost: {
            gold: 3,
            food: 2
        },

        description:
            "When the kingdom calls, the wagons always arrive.",

        effect: {
            type: "resource_gain",
            target: "player",
            resource: "chosen_resource",
            amount: 6
        },

        balanceNotes:
            "Flexible economy."
    },

    {
        cardID: "smugglers_market",
        kingdom: "all",
        name: "Smuggler's Market",
        category: "special",
        image: "smugglers_market.webp",

        cost: {
            wood: 2,
            stone: 2,
            metal: 2,
            gold: 2,
            magic: 2
        },

        description:
            "Everything has a price.",

        effect: {
            type: "free_card_play",
            target: "self",
            duration: 1,
            resourceCostMultiplier: 0
        },

        balanceNotes:
            "Makes your next card free."
    },

    {
        cardID: "kingdom_mobilization",
        kingdom: "all",
        name: "Kingdom Mobilization",
        category: "special",
        image: "kingdom_mobilization.webp",

        cost: {
            food: 4,
            gold: 2
        },

        description:
            "The entire kingdom answers the call.",

        effect: {
            type: "summon_units",
            target: "owned_construction_zones",
            unit: "basic_troop",
            amountPerZone: 1
        },

        balanceNotes:
            "Late-game reinforcement."
    },

    {
        cardID: "industrial_revolution",
        kingdom: "all",
        name: "Industrial Revolution",
        category: "special",
        image: "industrial_revolution.webp",

        cost: {
            wood: 4,
            stone: 4,
            gold: 2
        },

        description:
            "The kingdom enters a new age.",

        effect: {
            type: "resource_multiplier",
            target: "friendly_workers",
            resourceGainMultiplier: 2,
            duration: 3
        },

        balanceNotes:
            "Doubles worker production."
    },

    {
        cardID: "overtime",
        kingdom: "all",
        name: "Overtime",
        category: "special",
        image: "overtime.webp",

        cost: {
            food: 3,
            gold: 2
        },

        description:
            "One more shift.",

        effect: {
            type: "extra_worker_action",
            target: "friendly_workers",
            additionalGatherActions: 1,
            duration: 1
        },

        balanceNotes:
            "Powerful one-turn economy burst."
    },

    {
        cardID: "kingdom_census",
        kingdom: "all",
        name: "Kingdom Census",
        category: "special",
        image: "kingdom_census.webp",

        cost: {
            food: 4,
            gold: 3
        },

        description:
            "Every pair of hands strengthens the kingdom.",

        effect: {
            type: "summon_workers",
            target: "capital",
            amount: 3
        },

        balanceNotes:
            "Creates three workers."
    },

    {
        cardID: "divine_intervention",
        kingdom: "all",
        name: "Divine Intervention",
        category: "special",
        image: "divine_intervention.webp",

        cost: {
            magic: 6
        },

        description:
            "When all hope is lost...",

        effect: {
            type: "choose_recovery",
            options: [
                {
                    type: "heal",
                    target: "friendly_champion",
                    amount: "full"
                },
                {
                    type: "heal",
                    target: "friendly_combat_units",
                    amount: "full",
                    maxTargets: 3
                },
                {
                    type: "remove_status_effects",
                    target: "all_friendly_units"
                }
            ]
        },

        balanceNotes:
            "Expensive emergency recovery card."
    }

];

export default specialCards;