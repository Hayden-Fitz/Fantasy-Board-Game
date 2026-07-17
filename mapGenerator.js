import mapSettings from "./data/mapSettings.json" with { type: "json" };
import kingdoms from "./data/kingdoms.json" with { type: "json" };
import resources from "./data/resources.json" with { type: "json" };
import { generateTerrain } from "./terrain.js";





export function generateMap(playerCount){

    let map = {

        settings: structuredClone(mapSettings),
        kingdoms: structuredClone(kingdoms),
        resources: structuredClone(resources),

        tiles:{},

        playerCount:playerCount

    };

generateCenter(map);

generateLand(map);

makeCenterGrass(map);

placeCapitals(map);

expandKingdoms(map);

convertUnusedKingdoms(map)

generateBorderWaters(map);

fillUnusedLandWithWater(map);

removeIsolatedLand(map);

generateTerrain(map);




    return map;

}


// ==========================
// CREATE TILE
// ==========================

function addTile(
    map,
    x,
    y,
    terrain = "grass",
    kingdom = "neutral"
){

    let id = `${x},${y}`;

    map.tiles[id] = {

        x: x,
        y: y,

        terrain: terrain,

        // Original kingdom (never changes)
        kingdom: kingdom,

        // Current owner (changes during the game)
        owner: kingdom,

        resource: null,

        building: null,

        unit: null,

        worker: null

    };

}




// ==========================
// GENERATE NEUTRAL CENTER
// ==========================

function generateCenter(map){

    if(!map.settings.center.enabled)
        return;


    const radius =
    map.settings.center.radius;


    for(let q=-radius; q<=radius; q++){

        for(let r=-radius; r<=radius; r++){

            let s = -q-r;


            let distance = Math.max(
                Math.abs(q),
                Math.abs(r),
                Math.abs(s)
            );


            if(distance <= radius){

                addTile(
                    map,
                    q,
                    r,
                    "grass",
                    "neutral"
                );

            }

        }

    }

}



// ==========================
// GENERATE BORDER waterS
// ==========================

function generateBorderWaters(map){


    const neighbors = [

        [1,0],
        [1,-1],
        [0,-1],
        [-1,0],
        [-1,1],
        [0,1]

    ];


    let waterTiles = new Set();



    // ==========================
    // CENTER WATER RING
    // ==========================

    const centerRadius =
    map.settings.center.radius;


    Object.values(map.tiles).forEach(tile=>{


        let distance = Math.max(
            Math.abs(tile.x),
            Math.abs(tile.y),
            Math.abs(-tile.x-tile.y)
        );


        if(distance === centerRadius + 1){

            waterTiles.add(
                `${tile.x},${tile.y}`
            );

        }


    });





// ==========================
// WATER BETWEEN KINGDOMS
// ==========================

Object.values(map.tiles).forEach(tile=>{


    // Only kingdom land
    if(
        tile.kingdom === "neutral" ||
        tile.kingdom === "unclaimed" ||
        tile.terrain !== "grass"
    )
        return;



    neighbors.forEach(direction=>{


        let neighbor =
        map.tiles[
            `${tile.x + direction[0]},${tile.y + direction[1]}`
        ];



        if(!neighbor)
            return;



        // If next to another kingdom
        if(
            neighbor.kingdom !== tile.kingdom &&
            neighbor.kingdom !== "neutral" &&
            neighbor.kingdom !== "unclaimed" &&
            neighbor.terrain === "grass"
        ){


            waterTiles.add(
                `${tile.x},${tile.y}`
            );


        }


    });


});




    // ==========================
    // APPLY WATER
    // ==========================


    waterTiles.forEach(id=>{


        let tile =
        map.tiles[id];


        if(!tile)
            return;



        // Never destroy capitals

        if(tile.building==="capital")
            return;



        tile.terrain="water";

        tile.kingdom="neutral";

        tile.resource=null;

        tile.building=null;

        tile.unit=null;


    });



    console.log(
        "water tiles:",
        waterTiles.size
    );


}





// ==========================
// GENERATE LAND
// ==========================

function generateLand(map){

    const radius =
    map.settings.world.radius;


    for(let q=-radius; q<=radius; q++){

        for(let r=-radius; r<=radius; r++){

            let s = -q-r;


            let distance = Math.max(
                Math.abs(q),
                Math.abs(r),
                Math.abs(s)
            );


            // Outside the circular world
            if(distance > radius)
                continue;


            let id = `${q},${r}`;


            // Already occupied by center or water
            if(map.tiles[id])
                continue;


            addTile(
                map,
                q,
                r,
                "grass",
                "unclaimed"
            );

        }

    }

}












// ==========================
// PLACE CAPITALS
// ==========================
function placeCapitals(map){

    const activeKingdoms =
    Object.keys(map.kingdoms)
    .slice(0,map.playerCount);


    const radius =
    map.settings.world.radius;


    activeKingdoms.forEach((kingdom,index)=>{


        let angle =
        (Math.PI * 2 / activeKingdoms.length)
        * index;



        let found = false;



        for(
            let distance = radius;
            distance > radius - 3 && !found;
            distance--
        ){

            let x =
            Math.cos(angle)*distance*1.3;


            let y =
            Math.sin(angle)*distance*1.3;



            let q =
            Math.round(
                (Math.sqrt(3)/3*x)
                -
                (1/3*y)
            );


            let r =
            Math.round(
                (2/3*y)
            );



            let tile =
            map.tiles[`${q},${r}`];



            if(
                tile &&
                tile.terrain==="grass" &&
                tile.kingdom==="unclaimed" &&
                !tile.reserved
            ){

                tile.kingdom=kingdom;

                tile.terrain="capital";

                tile.building="capital";

                reserveCapitalArea(map,tile);

                tile.reserved=true;


                found=true;

            }

        }


    });

}



function reserveCapitalArea(map, capital){

    const neighbors = [
        [1,0],
        [1,-1],
        [0,-1],
        [-1,0],
        [-1,1],
        [0,1]
    ];


    neighbors.forEach(dir=>{

        let tile =
        map.tiles[
            `${capital.x+dir[0]},${capital.y+dir[1]}`
        ];


        if(tile && tile.terrain==="grass"){

            tile.reserved = true;

        }

    });

}




// ==========================
// EXPAND KINGDOMS
// ==========================
function expandKingdoms(map){

    const neighbors = [

        [1,0],
        [1,-1],
        [0,-1],
        [-1,0],
        [-1,1],
        [0,1]

    ];


    const kingdoms =
    Object.keys(map.kingdoms)
    .slice(0,map.playerCount);

    let frontiers = {};

    let territoryCount = {};



    kingdoms.forEach(k=>{

        frontiers[k]=[];

        territoryCount[k]=0;

    });



    // Find capitals
    Object.values(map.tiles).forEach(tile=>{

        if(tile.building==="capital"){

            frontiers[tile.kingdom].push(tile);

            territoryCount[tile.kingdom]++;

        }

    });



    // Count how much land each kingdom should get

    let usableTiles =
    Object.values(map.tiles)
    .filter(tile=>
        tile.kingdom==="unclaimed" &&
        tile.terrain==="grass"
    ).length;



    let targetPerKingdom =
    Math.floor(
        usableTiles / kingdoms.length
    )
    +
    2;



    let changed=true;



    while(changed){


        changed=false;



        for(let kingdom of kingdoms){


            // Stop this kingdom if it has enough land

            // if(
            //     territoryCount[kingdom]
            //     >=
            //     targetPerKingdom
            // )
            //     continue;



            let options=[];



            frontiers[kingdom].forEach(current=>{


                neighbors.forEach(dir=>{


                    let tile =
                    map.tiles[
                        `${current.x+dir[0]},${current.y+dir[1]}`
                    ];



                    if(!tile)
                        return;



                    if(
                        tile.terrain==="water" ||
                        tile.kingdom!=="unclaimed"
                    )
                        return;


                    // Make sure this tile touches the kingdom
                    let touchesKingdom = false;


                    neighbors.forEach(check=>{

                        let neighbor =
                        map.tiles[
                            `${tile.x+check[0]},${tile.y+check[1]}`
                        ];


                        if(
                            neighbor &&
                            neighbor.kingdom === kingdom
                        ){

                            touchesKingdom = true;

                        }

                    });


                    if(touchesKingdom){

                        options.push(tile);

                    }


                });


            });



            if(options.length===0)
                continue;



            // Prefer connected expansion

// Prefer tiles that continue the kingdom shape

        options.sort((a,b)=>{


            function score(tile){


                let score = 0;


                // Prefer touching more of our own kingdom

                neighbors.forEach(dir=>{

                    let neighbor =
                    map.tiles[
                        `${tile.x+dir[0]},${tile.y+dir[1]}`
                    ];


                    if(
                        neighbor &&
                        neighbor.kingdom === tile.kingdom
                    ){

                        score += 10;

                    }

                });



                // Prefer moving toward center

                let centerDistance =
                Math.max(
                    Math.abs(tile.x),
                    Math.abs(tile.y),
                    Math.abs(-tile.x-tile.y)
                );


                score -= Math.abs(
                    centerDistance -
                    map.settings.center.radius
                );



                // Small randomness

                score += Math.random()*5;


                return score;

            }



            return score(b)-score(a);


        });



        let chosen = options[0];



            chosen.kingdom=kingdom;



            territoryCount[kingdom]++;



            frontiers[kingdom].push(chosen);



            changed=true;


        }


    }



    console.log(
        "Kingdom sizes:",
        territoryCount
    );


}





// ==========================
// TURN UNUSED LAND INTO WATER
// ==========================

function fillUnusedLandWithWater(map){


    Object.values(map.tiles).forEach(tile=>{


        // Keep center neutral area
        if(tile.kingdom === "neutral")
            return;


        // Any tile nobody claimed becomes water
        if(
            tile.kingdom === "unclaimed" &&
            tile.terrain === "grass"
        ){

            tile.terrain = "water";

            tile.kingdom = "neutral";

            tile.resource = null;

            tile.building = null;

            tile.unit = null;

        }


    });


}


// ==========================
// REMOVE ISOLATED LAND TILES
// ==========================

function removeIsolatedLand(map){

    const neighbors = [

        [1,0],
        [1,-1],
        [0,-1],
        [-1,0],
        [-1,1],
        [0,1]

    ];


    let connected = new Set();


    // ==========================
    // FIND ALL CAPITAL CONNECTED LAND
    // ==========================

    Object.values(map.tiles).forEach(tile=>{


        if(tile.building !== "capital")
            return;


        let queue=[tile];


        while(queue.length){


            let current =
            queue.shift();


            let id =
            `${current.x},${current.y}`;


            if(connected.has(id))
                continue;


            connected.add(id);



            neighbors.forEach(dir=>{


                let next =
                map.tiles[
                    `${current.x+dir[0]},${current.y+dir[1]}`
                ];



                if(!next)
                    return;



                // Only follow same kingdom land

                if(
                    next.kingdom === current.kingdom &&
                    next.terrain !== "water"
                ){

                    queue.push(next);

                }


            });


        }


    });




    // ==========================
    // REMOVE DISCONNECTED LAND
    // ==========================


    Object.values(map.tiles).forEach(tile=>{


        if(tile.terrain==="water")
            return;


        let id =
        `${tile.x},${tile.y}`;



        // Keep neutral center

        if(tile.kingdom==="neutral")
            return;



        // Anything not connected to capital becomes water

        if(!connected.has(id)){


            tile.terrain="water";

            tile.kingdom="neutral";

            tile.resource=null;

            tile.building=null;

            tile.unit=null;


        }


    });



    console.log(
        "Removed disconnected kingdom islands"
    );

}


// ==========================
// RENDER HEX MAP
// ==========================

function renderMap(map){

    

    const tileImages = {
        grass: "assets/grass-removebg-preview.png",
        forest: "assets/forest-removebg-preview.png",
        mountain: "assets/mountain-removebg-preview.png",
        water: "assets/water-removebg-preview.png",

        capital: "assets/capital-removebg-preview.png",
        constructionZone: "assets/construction-removebg-preview.png",

        wood: "assets/wood-removebg-preview.png",
        stone: "assets/stone-removebg-preview.png",
        metal: "assets/metal-removebg-preview.png",
        gold: "assets/gold-removebg-preview.png",
        magic: "assets/magic-removebg-preview.png",

        bread: "assets/bread-removebg-preview.png",
        fish: "assets/fish-removebg-preview.png",
        fruit: "assets/fruit-removebg-preview.png",
        meat: "assets/meat-removebg-preview.png",
        cake: "assets/cake-removebg-preview.png",
        spice: "assets/spice-removebg-preview.png"
    };



    let display =
    document.getElementById("mapDisplay");


    display.innerHTML = "";


    let board =
    document.createElement("div");


    board.id = "board";


    display.appendChild(board);



    const hexSize = 20;

    // outer base hex
    const hexWidth = Math.sqrt(3) * hexSize;
    const hexHeight = hexSize * 2;

    // smaller image hex
    const imageSize = hexSize - 3;
    const imageWidth = Math.sqrt(3) * imageSize;
    const imageHeight = imageSize * 2;


    const colors = {

        crimson:"#ff0000",
        tide:"#1565C0",
        culinary:"#EF6C00",
        viking:"#FDD835",
        shadow:"#7B1FA2",

        neutral:"#777777",

        water:"#003b66",

        unclaimed:"#4caf50"

    };



    Object.values(map.tiles)
    .forEach(tile=>{


    let element = document.createElement("div");

    element.className = "tile";



    // -------------------------
    // COLORS
    // -------------------------

    const kingdomBorder = {

        crimson:"#c50303",
        tide:"#0818aa",
        culinary:"#a33400",
        viking:"#fffb00",
        shadow:"#7B1FA2",
        //neutral:"#777777",
        //unclaimed:"#444444"

    };


    const terrainColors = {

        grass:"#7CB342",

        forest:"#2E7D32",

        mountain:"#757575",

        water:"#1565C0",



        construction_zone:"#8D6E63",

        capital:"#FFD700"

    };



    // -------------------------
    // IMAGE
    // -------------------------

    let image;

    if(tile.building === "capital"){

        image = tileImages.capital;

    }
    else if(tile.building === "constructionZone"){

        image = tileImages.constructionZone;

    }
    else if(tile.resource){

        image = tileImages[tile.resource];

    }
    else{

        image = tileImages[tile.terrain];

    }



    // Border uses kingdom color

    let borderColor = kingdomBorder[tile.kingdom];



    // Display text

    let label = tile.terrain;

    if(tile.resource){

        label = tile.resource;

    }

    if(tile.building){

        label = tile.building;

    }



    // -------------------------
    // TILE APPEARANCE
    // -------------------------

element.innerHTML = `

<div class="hexBackground"></div>

<div 
class="hexBorder"
style="
background:${borderColor};
">
</div>


<div 
class="hexCenter ${tile.building || tile.resource || tile.terrain}"
style="
background-image:url('${image}');
">
</div>

`;



    // -------------------------
    // POSITION
    // -------------------------

    let x =
    Math.sqrt(3) *
    hexSize *
    (tile.x + tile.y / 2);

    let y =
    1.5 *
    hexSize *
    tile.y;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;

    board.appendChild(element);


    });



    // =====================
    // CAMERA CONTROLS
    // =====================


    let offsetX=0;
    let offsetY=0;

    let scale=1;


    let dragging=false;

    let startX;
    let startY;



    display.onmousedown=(e)=>{

        dragging=true;

        startX=e.clientX-offsetX;
        startY=e.clientY-offsetY;

    };


    display.onmouseup=()=>{

        dragging=false;

    };


    display.onmouseleave=()=>{

        dragging=false;

    };


display.onmousemove=(e)=>{

    if(!dragging)
        return;


    offsetX=e.clientX-startX;
    offsetY=e.clientY-startY;


    updateZoom();

};


display.onwheel=(e)=>{

    e.preventDefault();


    scale +=
    e.deltaY < 0
    ? 0.1
    : -0.1;


    scale=Math.max(
        0.3,
        Math.min(scale,5)
    );


    board.style.transform =
    `
    translate(${offsetX}px,${offsetY}px)
    scale(${scale})
    `;

};


function updateZoom(){

    board.style.transform =
    `
    translate(${offsetX}px,${offsetY}px)
    scale(${scale})
    `;

}



document.getElementById("zoomIn").onclick = ()=>{


    scale += 0.1;


    scale = Math.min(
        scale,
        5
    );


    updateZoom();

};



document.getElementById("zoomOut").onclick = ()=>{


    scale -= 0.1;


    scale = Math.max(
        scale,
        0.3
    );


    updateZoom();

};


}






// ==========================
// CENTER GRASS
// ==========================

function makeCenterGrass(map){

    Object.values(map.tiles).forEach(tile=>{

        if(tile.kingdom==="neutral"){

            tile.terrain="grass";

        }

    });

}




function convertUnusedKingdoms(map){

    const activeKingdoms =
    Object.keys(map.kingdoms)
    .slice(0,map.playerCount);



    Object.values(map.tiles)
    .forEach(tile=>{


        if(
            tile.kingdom === "neutral" ||
            tile.kingdom === "unclaimed"
        )
            return;



        if(
            !activeKingdoms.includes(tile.kingdom)
        ){

            tile.kingdom = "unclaimed";

            tile.owner = "unclaimed";

            tile.building = null;

            if(tile.terrain==="capital"){
                tile.terrain="grass";
            }


        }


    });


}


export { renderMap };