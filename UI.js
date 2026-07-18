import bosses from "./data/bosses.json" with { type: "json" };
import buildings from "./data/buildings.json" with { type: "json" };
import cards from "./data/cards.json" with { type: "json" };
import cataclysms from "./data/cataclysms.json" with { type: "json" };
import champions from "./data/champions.json" with { type: "json" };
import gameSettings from "./data/gameSettings.json" with { type: "json" };
import kingdoms from "./data/kingdoms.json" with { type: "json" };
import objectives from "./data/objectives.json" with { type: "json" };
import players from "./data/players.json" with { type: "json" };
import resources from "./data/resources.json" with { type: "json" };
import terrain from "./data/terrain.json" with { type: "json" };
import airUnits from "./data/units/airUnits.json" with { type: "json" };
import landUnits from "./data/units/landUnits.json" with { type: "json" };
import waterUnits from "./data/units/waterUnits.json" with { type: "json" };
import workers from "./data/units/workers.json" with { type: "json" };
import {
    zoomIn,
    zoomOut,
    teleportToCapital
} from "./mapGenerator.js";


// =============================
// CREATE UI
// =============================

export function createUI(gameState){

    createTopBar(gameState);

    createLeftPanel(gameState);

    createRightPanel(gameState);

    // createCardPanel(gameState);

    createInfoPanel(gameState);

    createMapControls(gameState);

}





function createTopBar(game){

    // Remove old UI if it exists
    let oldBar = document.getElementById("top-bar");

    if(oldBar){
        oldBar.remove();
    }


    let topBar = document.createElement("div");

    topBar.id = "top-bar";


    document.body.appendChild(topBar);



    // ==========================
    // RESOURCE SECTION
    // ==========================

    let resourceBar = document.createElement("div");

    resourceBar.id = "resourceBar";


    let resources = [
        "wood",
        "stone",
        "metal",
        "gold",
        "magic",
        "food"
    ];


    resources.forEach(resource=>{

        let box = document.createElement("div");

        box.className = "resource";


        box.innerHTML = `
            <span>${resource}</span>
            <span>x0</span>
        `;


        resourceBar.appendChild(box);

    });



    topBar.appendChild(resourceBar);




    // ==========================
    // OBJECTIVE
    // ==========================

    let objective = document.createElement("div");

    objective.id = "objectiveProgress";


    objective.innerHTML = `

        <span>Objective</span>

        <div class="progressBar">

            <div class="progressFill"></div>

        </div>

        <span>0%</span>

    `;


    topBar.appendChild(objective);





    // ==========================
    // ROUND COUNTER
    // ==========================


    let round = document.createElement("div");

    round.id="roundCounter";


    round.innerHTML = `

        Round:
        ${game.round || 1}

    `;


    topBar.appendChild(round);


}




function createLeftPanel(game){

    let panel = document.createElement("div");

    panel.id = "left-panel";


    panel.innerHTML = `

        <div class="panel-section" id="boss-section">

            <h2>Boss Threat</h2>


            <div class="threat-meter">

                <div 
                class="threat-fill"
                id="threat-fill">
                </div>

            </div>


            <div class="threat-info">

                Threat Level:
                <span id="threat-level">
                    Low
                </span>

                <br>

                Disaster Chance:
                <span id="threat-chance">
                    0%
                </span>

            </div>


        </div>





        <div class="building-slot">

            <span>
                Wall
            </span>

            <button class="build-button">
                +
            </button>

        </div>


        <div class="building-slot">

            <span>
                Road
            </span>

            <button class="build-button">
                +
            </button>

        </div>


        <div class="building-slot">

            <span>
                Bridge
            </span>

            <button class="build-button">
                +
            </button>

        </div>


        <div class="building-slot">

            <span>
                Fortress
            </span>

            <button class="build-button">
                +
            </button>

        </div>


        <div class="building-slot">

            <span>
                Barracks
            </span>

            <button class="build-button">
                +
            </button>

        </div>


        <div class="building-slot">

            <span>
                Workshop
            </span>

            <button class="build-button">
                +
            </button>

        </div>




        <div class="panel-section" id="phase-section">


            <h2>Turn Phase</h2>


            <div id="current-phase">

                Waiting...

            </div>


        </div>


    `;



    document.body.appendChild(panel);


}





function createRightPanel(game){

    const kingdomColors = {

        "Crimson Empire":"#c62828",
        "Tide Kingdom":"#1e88e5",
        "Culinary Kingdom":"#fb8c00",
        "Viking Kingdom":"#fdd835",
        "Shadow Kingdom":"#8e24aa"

    };


    const panel = document.createElement("div");
    panel.id = "right-panel";

    document.body.appendChild(panel);


    Object.values(game.players).forEach(player=>{

        const card = document.createElement("div");
        card.className = "player-card";

        const color =
            kingdomColors[player.kingdom] || "#f5deb3";


        card.innerHTML = `

            <div class="player-name">
                ${player.username}
            </div>

            <div
                class="player-kingdom"
                style="color:${color};"
            >
                ${player.kingdom}
            </div>

            <div class="player-progress">
                <div class="player-progress-fill"></div>
            </div>

        `;

        panel.appendChild(card);

    });

}



function createInfoPanel(game){

    let panel = document.createElement("div");

    panel.id = "info-panel";


    panel.innerHTML = `

        <h2 id="info-title">
            Select something
        </h2>


        <div id="info-content">

            Click a tile, unit, or champion.

        </div>


        <div id="info-actions">

        </div>

    `;


    document.body.appendChild(panel);

}



function createMapControls() {

    const controls = document.createElement("div");
    controls.id = "map-controls";

    controls.innerHTML = `
        <button id="zoomIn">+</button>

        <button id="zoomOut">−</button>

        <button id="centerCapital">
            <img src="assets/capital-removebg-preview.webp" alt="Center Capital">
        </button>
    `;

    document.body.appendChild(controls);

    controls.querySelector("#zoomIn").addEventListener("click", zoomIn);

    controls.querySelector("#zoomOut").addEventListener("click", zoomOut);

    controls.querySelector("#centerCapital").addEventListener("click", teleportToCapital);
}