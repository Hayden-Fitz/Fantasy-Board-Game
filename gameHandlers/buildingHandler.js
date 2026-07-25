import buildings from "../data/buildings.json" with { type: "json" };
import { getZoomScale } from "../mapGenerator.js";
import {
    database,
    ref,
    update
} from "../firebase/firebase.js";


let previewTile = null;
let previewMouseX = 0;
let previewMouseY = 0;
let selectedBuilding = null;
let buildMode = false;
let buildingPreview = null;


// ==========================
// START BUILDING
// ==========================

export function startBuilding(type, game){

    if(!buildings[type]){
        console.error("Building does not exist:", type);
        return;
    }


    const playerID = localStorage.getItem("playerID");


    // phase check
    if(game.turn.currentPhase !== "construction"){

        console.log("Cannot build. Not construction phase.");
        return;

    }


    // player turn check
    if(game.turn.currentPlayer !== playerID){

        console.log("Cannot build. Not your turn.");
        return;

    }


    selectedBuilding = type;
    buildMode = true;
    console.log("Preview should now be created...");

    console.log("Building selected:", type);


    createBuildingPreview(type);

    console.log("Preview object:", buildingPreview);

}



// ==========================
// CANCEL BUILDING
// ==========================

export function cancelBuilding(){

    selectedBuilding = null;
    buildMode = false;


    document
    .querySelectorAll(".build-button")
    .forEach(button=>{
        button.classList.remove("selected");
    });


    removeBuildingPreview();

    resetBuildPanel();

}



// ==========================
// PLACE BUILDING
// ==========================

export async function placeBuilding(tile, game){

    console.log(
        "BUILD PHASE CHECK:",
        game.turn.currentPhase
    );

    if(!buildMode)
        return;


    if(!selectedBuilding)
        return;


    const playerID =
    localStorage.getItem("playerID");


    if(game.turn.currentPhase !== "construction"){
        console.log("Not construction phase");
        return;
    }


    if(game.turn.currentPlayer !== playerID){
        console.log("Not your turn");
        return;
    }


    const building =
    buildings[selectedBuilding];


    if(!canPlaceBuilding(tile, building, game)){
        console.log("Cannot place building here");
        return;
    }


    if(!hasResources(game, building.cost)){
        console.log("Not enough resources");
        return;
    }


    const buildingObject =
    createBuildingObject(
        selectedBuilding,
        playerID
    );


    // update local tile
    tile.building = buildingObject;


    // remove resources locally
    removeResources(
        game,
        building.cost
    );
    await update(
        ref(
            database,
            `games/${localStorage.getItem("gameCode")}/players/${playerID}/resources`
        ),
        game.players[playerID].resources
    );





    console.log(
        "SAVING BUILDING TO:",
        `map/tiles/${tile.x},${tile.y}`,
        buildingObject
    );
    // update Firebase tile
    await update(
        ref(
            database,
            `games/${localStorage.getItem("gameCode")}/map/tiles/${tile.x},${tile.y}`
        ),
        {
            building: buildingObject,
            lastUpdated: Date.now()
        }
    );

    // update Firebase resources
    await update(
        ref(
            database,
            `games/${localStorage.getItem("gameCode")}/players/${playerID}/resources`
        ),
        game.players[playerID].resources
    );

    // remove preview
    removeBuildingPreview();

    // immediately allow placing another copy
    createBuildingPreview(selectedBuilding);


    

}



// ==========================
// CHECK PLACEMENT
// ==========================

function canPlaceBuilding(tile, building, game){

    // ==========================
    // PHASE CHECK
    // ==========================

    if(tile.building){
        console.log("Tile already has a building");
        return false;
    }

    if(game.turn.currentPhase !== "construction"){

        console.log("Not construction phase");
        return false;

    }





    // ==========================
    // TERRAIN CHECK
    // ==========================

    let terrain =
    tile.resource ? tile.resource : tile.terrain;


    // Convert resource categories
    const foodResources = [
        "bread",
        "fish",
        "fruit",
        "meat",
        "cake",
        "spice"
    ];


    if(foodResources.includes(terrain)){
        terrain = "food";
    }


    const allowed =
    building.placement.allowedTerrains;


    const blocked =
    building.placement.blockedTerrains;



    if(!allowed.includes(terrain)){

        console.log(
            "Terrain not allowed:",
            terrain
        );

        return false;

    }



    if(blocked.includes(terrain)){

        console.log(
            "Terrain blocked:",
            terrain
        );

        return false;

    }

    // ==========================
    // WATER ADJACENCY CHECK
    // ==========================

    if(building.placement.requiresWaterAdjacent){

        const adjacentWater =
            getAdjacentTiles(tile)
            .some(t =>
                t.terrain === "water"
            );


        if(!adjacentWater){

            console.log(
                "Building requires adjacent water"
            );

            return false;

        }

    }



    // ==========================
    // OWNERSHIP CHECK
    // ==========================
    console.log("TILE KINGDOM:", tile.kingdom);
    console.log(
        "PLAYER DATA:",
        Object.values(game.players)
    );


    if(building.placement.requiresOwnedTile){

        const playerID =
        localStorage.getItem("playerID");


        const kingdomOwnerEntry =
        Object.entries(game.players)
        .find(
            ([id, player]) =>
                player.kingdom
                .toLowerCase()
                .startsWith(tile.kingdom.toLowerCase())
        );


        if(!kingdomOwnerEntry){

            console.log("No player owns this kingdom");
            return false;

        }


        const kingdomOwnerID =
        kingdomOwnerEntry[0];


        if(kingdomOwnerID !== playerID){

            console.log("You do not own this kingdom");
            return false;

        }

    }



    return true;

}




// ==========================
// RESOURCE COST
// ==========================

function removeResources(game, cost){

    const playerID =
    localStorage.getItem("playerID");


    const player =
    game.players[playerID];


    for(const resource in cost){

        player.resources[resource] -= cost[resource];

    }

}
function hasResources(game, cost){

    const playerID =
    localStorage.getItem("playerID");


    const player =
    game.players[playerID];


    if(!player){

        console.log(
            "Player not found:",
            playerID
        );

        return false;

    }


    console.log(
        "CURRENT PLAYER RESOURCES:",
        player.resources
    );


    for(const resource in cost){

        if(
            (player.resources?.[resource] || 0)
            < cost[resource]
        ){

            console.log(
                "Not enough",
                resource
            );

            return false;

        }

    }


    return true;

}














// ==========================
// BUILD MODE
// ==========================

export function isBuildingMode(){

    return buildMode;

}

export function getSelectedBuilding(){

    return selectedBuilding;

}



function createBuildingObject(buildingName, owner){

    const building =
        buildings[buildingName];

    return {

        type: buildingName,

        owner: owner,

        hp: building.health,

        maxHp: building.health,

        defense: building.defense

    };

}




export function changeBuildPanelToCancel(){


    const buildingSection =
    document.getElementById("building-section");

    let cancel =
    document.getElementById("cancel-build");

    if(cancel)
        return;

    cancel =
    document.createElement("button");

    cancel.id = "cancel-build";

    cancel.textContent = "Cancel Building";

    cancel.addEventListener(
        "click",
        cancelBuilding
    );

    buildingSection.appendChild(cancel);

}

function resetBuildPanel(){

    document
        .querySelectorAll(".build-button")
        .forEach(button=>{

            button.disabled = false;

        });

    const cancel =
    document.getElementById("cancel-build");

    if(cancel){

        cancel.remove();

    }

}










function getAdjacentTiles(tile){

    const tiles =
        Object.values(window.currentGame.map.tiles);


    return tiles.filter(t=>{


        const dx =
            Math.abs(t.x - tile.x);

        const dy =
            Math.abs(t.y - tile.y);


        return (
            dx <= 1 &&
            dy <= 1 &&
            !(dx === 0 && dy === 0)
        );


    });

}

export function removeBuildingPreview(){

    if(buildingPreview){

        buildingPreview.remove();

        buildingPreview = null;

    }


    document.removeEventListener(
        "mousemove",
        moveBuildingPreview
    );

    document.removeEventListener(
        "mouseover",
        hidePreviewOverUI
    );

}

function createBuildingPreview(type){

    removeBuildingPreview();


    const building =
    buildings[type];


    buildingPreview =
    document.createElement("img");


    buildingPreview.id =
    "building-preview";


    buildingPreview.src =
    building.image;


    buildingPreview.style.position =
    "fixed";


    const size =
        40 *
        getZoomScale() *
        (building.previewScale || 1);

    buildingPreview.style.width = `${size}px`;
    buildingPreview.style.height = `${size}px`;

    buildingPreview.style.opacity =
    "0.75";


    buildingPreview.style.pointerEvents =
    "none";


    buildingPreview.style.zIndex =
    "10000";


    document.body.appendChild(
        buildingPreview
    );


    document.addEventListener(
        "mousemove",
        moveBuildingPreview
    );

    document.addEventListener(
        "mousemove",
        hidePreviewOverUI
    );

}

function hidePreviewOverUI(event){

    if(!buildingPreview)
        return;


    const target =
    event.target;


    // If mouse is over UI, hide preview
    if(
        target.closest("#left-panel") ||
        target.closest("#right-panel") ||
        target.closest("#top-bar") ||
        target.closest("#info-panel") ||
        target.closest("#map-controls") ||
        target.closest("#card-hand")
    ){

        buildingPreview.style.display = "none";

    }
    else{

        buildingPreview.style.display = "block";

    }

}

function moveBuildingPreview(event){

    if(!buildingPreview)
        return;


    previewTile =
        getClosestTile(
            event.clientX,
            event.clientY
        );


    if(!previewTile)
        return;


    const rect =
        previewTile
        .querySelector(".hexCenter")
        .getBoundingClientRect();


    previewMouseX =
        rect.left + rect.width / 2;


    previewMouseY =
        rect.top + rect.height / 2;


    updateBuildingPreviewPosition();


    updatePreviewValidity();

}

function getClosestTile(mouseX, mouseY){

    let closestTile = null;

    let closestDistance = Infinity;


    document
    .querySelectorAll(".tile")
    .forEach(tile=>{


        const hex =
        tile.querySelector(".hexCenter");


        if(!hex)
            return;


        const rect =
        hex.getBoundingClientRect();


        const centerX =
        rect.left + rect.width / 2;


        const centerY =
        rect.top + rect.height / 2;


        const distance =
        Math.hypot(
            mouseX - centerX,
            mouseY - centerY
        );


        if(distance < closestDistance){

            closestDistance = distance;

            closestTile = tile;

        }


    });


    return closestTile;

}

function updatePreviewValidity(){

    if(!previewTile || !buildingPreview)
        return;


    const game =
        window.currentGame;


    const building =
        buildings[selectedBuilding];


    if(
        canPlaceBuilding(
            previewTile.__tileData,
            building,
            game
        )
    ){

        buildingPreview.style.filter =
        "none";

    }
    else{

        buildingPreview.style.filter =
        "brightness(0) saturate(100%) invert(20%) sepia(100%) saturate(5000%) hue-rotate(350deg)";

    }

}

function updateBuildingPreviewPosition(){

    if(!buildingPreview)
        return;


    const size =
        40 *
        getZoomScale() *
        (buildings[selectedBuilding].previewScale || 1);


    buildingPreview.style.left =
    `${previewMouseX - size / 2}px`;


    buildingPreview.style.top =
    `${previewMouseY - size / 2}px`;

}

export function updateBuildingPreviewScale(){

    if(!buildingPreview)
        return;


    const size =
        40 *
        getZoomScale() *
        (buildings[selectedBuilding].previewScale || 1);


    buildingPreview.style.width =
        `${size}px`;

    buildingPreview.style.height =
        `${size}px`;


    updateBuildingPreviewPosition();

}