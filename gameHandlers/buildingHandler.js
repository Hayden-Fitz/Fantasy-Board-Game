import buildings from "../data/buildings.json" with { type: "json" };
import { getZoomScale } from "../mapGenerator.js";
import {
    database,
    ref,
    update
} from "../firebase/firebase.js";



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

    const terrain =
    tile.resource ? tile.resource : tile.terrain;


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













function removeBuildingPreview(){

    if(buildingPreview){

        buildingPreview.remove();

        buildingPreview = null;

    }


    document.removeEventListener(
        "mousemove",
        moveBuildingPreview
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

}

function moveBuildingPreview(event){

    if(!buildingPreview)
        return;


    previewMouseX = event.clientX;
    previewMouseY = event.clientY;


    updateBuildingPreviewPosition();

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