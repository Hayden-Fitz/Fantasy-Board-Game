import buildings from "../data/buildings.json" with { type: "json" };
import { getZoomScale } from "../mapGenerator.js";




let previewMouseX = 0;
let previewMouseY = 0;
let selectedBuilding = null;
let buildMode = false;
let buildingPreview = null;


// ==========================
// START BUILDING
// ==========================

export function startBuilding(type){

    if(!buildings[type]){
        console.error("Building does not exist:", type);
        return;
    }


    selectedBuilding = type;
    buildMode = true;


    console.log("Building selected:", type);


    createBuildingPreview(type);

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

export function placeBuilding(tile, game){


    if(!buildMode)
        return;


    if(!selectedBuilding)
        return;



    let building =
    buildings[selectedBuilding];



    if(!canPlaceBuilding(tile, building, game)){

        console.log(
            "Cannot place building here"
        );

        return;

    }



    const playerID = localStorage.getItem("playerID");

    tile.building = createBuildingObject(
        selectedBuilding,
        playerID
    );



    removeResources(
        game,
        building.cost
    );


    cancelBuilding();


    console.log(
        "Placed:",
        selectedBuilding
    );

}



// ==========================
// CHECK PLACEMENT
// ==========================

function canPlaceBuilding(tile, building, game){


    // Must be construction phase

    if(
        game.turn.currentPhase !== "construction"
    ){

        return false;

    }



    // Terrain check

    if(
        !building.placement.allowedTerrains
        .includes(tile.terrain)
    ){

        return false;

    }



    // Blocked terrain

    if(
        building.placement.blockedTerrains
        .includes(tile.terrain)
    ){

        return false;

    }



    // Ownership

    if(
        building.placement.requiresOwnedTile &&
        tile.owner !== game.currentPlayer
    ){

        return false;

    }



    return true;

}




// ==========================
// RESOURCE COST
// ==========================

function removeResources(game, cost){

    console.log(
        "Need to remove:",
        cost
    );

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