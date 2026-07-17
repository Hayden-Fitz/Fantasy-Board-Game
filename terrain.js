import terrain from "./data/terrain.json" with { type: "json" };
import resources from "./data/resources.json" with { type: "json" };
import mapSettings from "./data/mapSettings.json" with { type: "json" };
import kingdoms from "./data/kingdoms.json" with { type: "json" };



export function generateTerrain(map){
    generateResources(map);

    reserveCapitalAreas(map);

    generateConstructionZones(map);

    generateNeutralConstructionZones(map);

    generateBiomes(map);


    return map;

}




function reserveCapitalAreas(map){

    const directions = [

        [1,0],
        [1,-1],
        [0,-1],
        [-1,0],
        [-1,1],
        [0,1]

    ];

    Object.values(map.tiles).forEach(tile=>{

        if(tile.building !== "capital")
            return;

        // Reserve the capital itself
        tile.reserved = true;

        // Reserve every tile within radius 2
        let frontier = [{
            x: tile.x,
            y: tile.y,
            distance: 0
        }];

        let visited = new Set();

        while(frontier.length > 0){

            let current = frontier.shift();

            let id = `${current.x},${current.y}`;

            if(visited.has(id))
                continue;

            visited.add(id);

            let currentTile = map.tiles[id];

            if(currentTile){

                currentTile.reserved = true;

            }

            if(current.distance >= 2)
                continue;

            directions.forEach(direction=>{

                frontier.push({

                    x: current.x + direction[0],
                    y: current.y + direction[1],
                    distance: current.distance + 1

                });

            });

        }

    });

}



function generateConstructionZones(map){

    const neighbors = [

        [1,0],
        [1,-1],
        [0,-1],
        [-1,0],
        [-1,1],
        [0,1]

    ];


    const kingdoms = map.activeKingdoms;



    function hexDistance(a,b){

        return Math.max(
            Math.abs(a.x-b.x),
            Math.abs(a.y-b.y),
            Math.abs(
                (-a.x-a.y)
                -
                (-b.x-b.y)
            )
        );

    }



    function touchesWater(tile){

        return neighbors.some(direction=>{

            let neighbor =
            map.tiles[
                `${tile.x+direction[0]},${tile.y+direction[1]}`
            ];


            return(
                neighbor &&
                neighbor.terrain === "water"
            );

        });

    }




    kingdoms.forEach(kingdom=>{


        let constructionZones=[];



        let kingdomTiles =
        Object.values(map.tiles)
        .filter(tile=>

            tile.kingdom === kingdom &&
            tile.terrain === "grass" &&
            !tile.reserved

        );


        let averageKingdomSize =
        Object.values(map.tiles)
        .filter(tile=>

            tile.kingdom !== "neutral" &&
            tile.kingdom !== "unclaimed"

        ).length
        /
        map.activeKingdoms.length;

        let zoneTarget = Math.max(
            3,
            Math.ceil(kingdomTiles.length / 30)
        );



        let capital =
        Object.values(map.tiles)
        .find(tile=>
            tile.kingdom === kingdom &&
            tile.building === "capital"
        );



        function validTile(tile){


            if(tile.reserved)
                return false;



            // Keep away from capital

            if(capital){

                if(
                    hexDistance(tile,capital) < 3
                )
                    return false;

            }



            // Keep away from other construction zones

            for(let zone of constructionZones){

                if(
                    hexDistance(tile,zone) < 4
                )
                    return false;

            }


            return true;

        }





        // ===================================
        // FIRST CONSTRUCTION ZONE
        // MUST TOUCH WATER
        // ===================================


        let waterCandidates =
        kingdomTiles.filter(tile=>{


            return(
                validTile(tile) &&
                touchesWater(tile)
            );


        });



        if(waterCandidates.length > 0){


            let chosen =
            waterCandidates[
                Math.floor(
                    Math.random()*waterCandidates.length
                )
            ];


            chosen.terrain="construction_zone";

            chosen.building="constructionZone";

            chosen.reserved=true;


            constructionZones.push(chosen);


        }




        // ===================================
        // SECOND AND THIRD ZONES
        // MUST NOT TOUCH WATER
        // ===================================


        while(constructionZones.length < zoneTarget){


            let candidates =
            kingdomTiles.filter(tile=>{


                if(!validTile(tile))
                    return false;



                // No more water touching zones

                if(touchesWater(tile))
                    return false;



                return true;


            });



            if(candidates.length === 0)
                break;



            let chosen =
            candidates[
                Math.floor(
                    Math.random()*candidates.length
                )
            ];



            chosen.terrain="construction_zone";

            chosen.building="constructionZone";

            chosen.reserved=true;


            constructionZones.push(chosen);


        }



        console.log(
            kingdom,
            "construction zones:",
            constructionZones
        );


    });


}



function generateNeutralConstructionZones(map){

    const amount =
    map.settings.neutral.constructionZones;


    let candidates =
    Object.values(map.tiles)
    .filter(tile =>

        tile.kingdom === "neutral" &&
        tile.terrain === "grass" &&
        !tile.building &&
        !tile.resource

    );


    for(let i = 0; i < amount; i++){

        if(candidates.length === 0)
            break;


        let index =
        Math.floor(
            Math.random()*candidates.length
        );


        let chosen =
        candidates[index];


        chosen.terrain = null;
        chosen.building = "constructionZone";
        chosen.reserved = true;


        // Remove nearby choices so they don't stack
        candidates =
        candidates.filter(tile=>{

            let distance =
            Math.max(
                Math.abs(tile.x-chosen.x),
                Math.abs(tile.y-chosen.y),
                Math.abs(
                    (-tile.x-tile.y)
                    -
                    (-chosen.x-chosen.y)
                )
            );


            return distance >= 3;

        });


    }


}



function generateResources(map){


    const kingdoms = map.activeKingdoms;


    const normalResources = [

        "wood",
        "stone",
        "metal",
        "gold",
        "magic"

    ];



    const foodResources = [

        "bread",
        "fish",
        "fruit",
        "meat",
        "cake",
        "spice"

    ];




    function placeResource(resource, tiles){


        if(tiles.length === 0)
            return false;



        let index =
        Math.floor(
            Math.random()*tiles.length
        );


        let tile =
        tiles[index];



        tile.resource = resource;

        tile.terrain = null;

        tile.reserved = true;



        tiles.splice(index,1);


        return true;

    }




    // ==========================
    // ASSIGN FOOD TYPES
    // GUARANTEES ALL FOOD APPEARS
    // ==========================


    let shuffledFoods =
    [...foodResources]
    .sort(()=>Math.random()-0.5);



    let foodAssignments = {};



    kingdoms.forEach((kingdom,index)=>{


        foodAssignments[kingdom] = [

            shuffledFoods[index % shuffledFoods.length],

            shuffledFoods[(index+1) % shuffledFoods.length]

        ];


    });





    // ==========================
    // KINGDOM RESOURCES
    // ==========================


    kingdoms.forEach(kingdom=>{


        let specialty =
        map.kingdoms[kingdom].specialtyResource;



        let availableTiles =
        Object.values(map.tiles)
        .filter(tile=>


            (
            tile.kingdom === kingdom 
            
            ) &&

            tile.terrain === "grass" &&

            tile.building === null &&

            tile.resource === null &&

            !tile.reserved


        );



        let kingdomSize = Object.values(map.tiles).filter(
            tile => tile.kingdom === kingdom
        ).length;

        let scale = Math.max(1, Math.ceil(kingdomSize / 50));

        let resourceList = [];




        // ==========================
        // NORMAL RESOURCES
        // ==========================


        normalResources.forEach(resource=>{

            for(let i=0;i<scale;i++){

                resourceList.push(resource);

            }

        });





        // ==========================
        // FOOD RESOURCES
        // ==========================


        foodAssignments[kingdom]
        .forEach(food=>{

            for(let i=0;i<scale;i++){

                resourceList.push(food);

            }

        });





        // ==========================
        // SPECIALTY BONUS
        // ==========================


        for(let i=0;i<2*scale;i++){

            resourceList.push(
                specialty
            );

        }





        // ==========================
        // PLACE RESOURCES
        // ==========================


        resourceList.forEach(resource=>{


            placeResource(
                resource,
                availableTiles
            );


        });



        console.log(

            kingdom,
            "resources placed:",
            resourceList

        );


    });








    // ==========================
    // NEUTRAL ISLAND RESOURCES
    // ==========================


    let neutralTiles =
    Object.values(map.tiles)
    .filter(tile=>


        tile.kingdom === "neutral" &&

        tile.terrain === "grass" &&

        tile.resource === null


    );




    let neutralResources = [

        "wood",
        "stone",
        "metal",
        "gold",
        "magic",

        "bread",
        "fish",
        "fruit",
        "meat",
        "cake",
        "spice"

    ];





    let amount =
    Math.floor(
        Math.random()*5
    )
    +6;



    for(let i=0;i<amount;i++){


        if(neutralTiles.length===0)
            break;



        let resource =
        neutralResources[
            Math.floor(
                Math.random()
                *
                neutralResources.length
            )
        ];



        placeResource(
            resource,
            neutralTiles
        );


    }



    console.log(
        "Neutral resources placed:",
        amount
    );


}



function generateBiomes(map){

    const neighbors = [

        [1,0],
        [1,-1],
        [0,-1],
        [-1,0],
        [-1,1],
        [0,1]

    ];



    const kingdoms = map.activeKingdoms;



    function canChange(tile){

        return (
            tile &&
            tile.terrain === "grass" &&
            !tile.resource &&
            !tile.building
        );

    }



    function growBiome(seed,type,size){


        let frontier=[seed];

        let visited=new Set();



        while(frontier.length && size>0){


            let current =
            frontier.shift();


            let id =
            `${current.x},${current.y}`;


            if(visited.has(id))
                continue;


            visited.add(id);



            if(canChange(current)){


                current.terrain=type;

                size--;

            }



            neighbors.forEach(dir=>{


                let next =
                map.tiles[
                    `${current.x+dir[0]},${current.y+dir[1]}`
                ];



                if(
                    canChange(next) &&
                    !visited.has(
                        `${next.x},${next.y}`
                    )
                ){


                    // keeps clusters natural
                    if(Math.random()<0.75){

                        frontier.push(next);

                    }

                }


            });


        }


    }




    // ==========================
    // GENERATE PER KINGDOM
    // ==========================

    kingdoms.forEach(kingdom=>{


        let kingdomTiles =
        Object.values(map.tiles)
        .filter(tile=>
            (
                tile.kingdom===kingdom
            ) &&
            canChange(tile)
        );

        let scale = Math.max(
            1,
            Math.ceil(kingdomTiles.length / 35)
        );



        if(kingdomTiles.length===0)
            return;



        // Forest patches

        let forestSeeds =
        8 - map.activeKingdoms.length;


        for(let i=0;i<forestSeeds;i++){


            let seed =
            kingdomTiles[
                Math.floor(
                    Math.random()*kingdomTiles.length
                )
            ];


            growBiome(
                seed,
                "forest",
                Math.max(
                    5,
                    Math.floor(Math.random() * 5) + 6
                )
            );


        }




        // Mountain ranges

        let mountainSeeds =
        7 - map.activeKingdoms.length;


        for(let i=0;i<mountainSeeds;i++){


            let seed =
            kingdomTiles[
                Math.floor(
                    Math.random()*kingdomTiles.length
                )
            ];


            growBiome(
                seed,
                "mountain",
                Math.max(
                    3,
                    Math.floor(Math.random() * 3) + 3
                )
            );


        }



    });




    // ==========================
    // NEUTRAL CENTER BIOMES
    // ==========================

    let centerTiles =
    Object.values(map.tiles)
    .filter(tile=>
        tile.kingdom==="neutral" &&
        canChange(tile)
    );


    // small forest/mountain variety

    for(let i=0;i<2;i++){

        if(centerTiles.length===0)
            break;


        growBiome(
            centerTiles[
                Math.floor(
                    Math.random()*centerTiles.length
                )
            ],
            "forest",
            3
        );

    }


    console.log("Biome generation complete");

}