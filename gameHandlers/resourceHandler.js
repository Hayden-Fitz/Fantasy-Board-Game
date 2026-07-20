import {
    database,
    ref,
    update
} from "../firebase/firebase.js";


export async function produceResources(gameCode, playerID, game){

    let player =
        game.players[playerID];


    let gained =
        collectResources(
            player,
            game.map
        );


    let updates = {};


    for(let resource in gained){

        updates[`resources/${resource}`] =
            (player.resources?.[resource] || 0)
            +
            gained[resource];

    }


    await update(
        ref(
            database,
            `games/${gameCode}/players/${playerID}`
        ),
        updates
    );


    console.log(
        "Resources gained:",
        gained
    );

}

export function collectResources(player, map){
    console.log("MAP OBJECT:", map);
    console.log("MAP KEYS:", Object.keys(map));
    let gainedResources = {};


    Object.values(map.tiles).forEach(tile => {

        const kingdomMap = {
            crimson: "Crimson Empire",
            tide: "Tide Kingdom",
            culinary: "Culinary Kingdom",
            viking: "Viking Kingdom",
            shadow: "Shadow Kingdom"
        };


        if (kingdomMap[tile.kingdom] !== player.kingdom)
            return;

        if (!tile.resource)
            return;

        let resource = tile.resource;

        const foodResources = [
            "bread",
            "meat",
            "fish",
            "fruit",
            "spice",
            "dessert"
        ];

        if (foodResources.includes(resource)) {
            resource = "food";
        }
        let amount = 1;

        if (!gainedResources[resource]) {
            gainedResources[resource] = 0;
        }

        gainedResources[resource] += amount;

    });


    console.log(
        "Resources gained JSON:",
        JSON.stringify(gainedResources, null, 2)
    );
    return gainedResources;

}