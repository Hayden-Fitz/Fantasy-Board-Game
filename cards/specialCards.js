// =============================
// SPECIAL CARDS
// =============================

const specialCards = [

    {
        cardID: "cataclysm_ritual",
        kingdom: "all",
        name: "Cataclysm Ritual",
        category: "special",
        image: "assets/cardImages/specialImages/cataclysmRitual.jpg",

        cost: {
            magic: 6,
            gold: 6
        },

        description:
            "Trigger a Cataclysm card against every opponent. You are not affected, making this a devastating multiplayer attack.",

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
        image: "assets/cardImages/specialImages/peaceTreaty.jpg",

        cost: {
            gold: 4
        },

        description:
            "Choose one opponent. Neither of you may attack each other until the end of the turn, giving both kingdoms time to recover.",

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
        image: "assets/cardImages/specialImages/spyNetwork.jpg",

        cost: {
            gold: 3,
            magic: 2
        },

        description:
            "Look at a chosen opponent's hand, then force them to discard one card of your choice before they can use it.",

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
        image: "assets/cardImages/specialImages/resourceConvoy.jpg",

        cost: {
            gold: 3,
            food: 2
        },

        description:
            "A convoy arrives carrying supplies. Gain 6 of any one resource you choose to strengthen your economy immediately.",

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
        image: "assets/cardImages/specialImages/smugglersMarket.jpg",

        cost: {
            wood: 2,
            stone: 2,
            metal: 2,
            gold: 2,
            magic: 2
        },

        description:
            "Your next card ignores all resource costs this turn. Play any card from your hand completely free of charge.",

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
        image: "assets/cardImages/specialImages/kingdomMobilization.jpg",

        cost: {
            food: 4,
            gold: 2
        },

        description:
            "Every Construction Zone you control recruits one Basic Troop, quickly reinforcing your kingdom for the coming battles.",

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
        image: "assets/cardImages/specialImages/industrialRevolution.jpg",

        cost: {
            wood: 4,
            stone: 4,
            gold: 2
        },

        description:
            "For the next 3 turns, all of your Workers gather double the normal amount of resources from every resource tile.",

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
        image: "assets/cardImages/specialImages/overtime.jpg",

        cost: {
            food: 3,
            gold: 2
        },

        description:
            "Your Workers may gather resources one additional time this turn, creating a powerful one-turn economy boost.",

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
        image: "assets/cardImages/specialImages/kingdomCensus.jpg",

        cost: {
            food: 4,
            gold: 3
        },

        description:
            "Recruit new citizens into service. Summon 3 Workers directly at your Capital to expand your workforce immediately.",

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
        image: "assets/cardImages/specialImages/divineIntervention.jpg",

        cost: {
            magic: 6
        },

        description:
            "Choose one blessing: fully heal your Champion, fully heal up to 3 friendly units, or remove all status effects from your army.",

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