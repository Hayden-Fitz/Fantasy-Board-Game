import bosses from "../data/bosses.json" with { type: "json" };
import buildings from "../data/buildings.json" with { type: "json" };
import cards from "../data/cards.json" with { type: "json" };
import cataclysms from "../data/cataclysms.json" with { type: "json" };
import champions from "../data/champions.json" with { type: "json" };
import gameSettings from "../data/gameSettings.json" with { type: "json" };
import kingdoms from "../data/kingdoms.json" with { type: "json" };
import objectives from "../data/objectives.json" with { type: "json" };
import players from "../data/players.json" with { type: "json" };
import resources from "../data/resources.json" with { type: "json" };
import terrain from "../data/terrain.json" with { type: "json" };
import airUnits from "../data/units/airUnits.json" with { type: "json" };
import landUnits from "../data/units/landUnits.json" with { type: "json" };
import waterUnits from "../data/units/waterUnits.json" with { type: "json" };
import workers from "../data/units/workers.json" with { type: "json" };
import { zoomIn, zoomOut, teleportToCapital } from "../mapGenerator.js";
import { cardLookup, getPlayerHand, getCard } from "../cards/cards.js";


// =============================
// CREATE UI
// =============================

export function createUI(gameState){

    createTopBar(gameState);

    createLeftPanel(gameState);

    createRightPanel(gameState);

    createCardPanel(gameState);

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

        <!-- ==========================
             BOSS SECTION
        =========================== -->

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




        <!-- ==========================
             BUILDING SECTION
        =========================== -->


        <div class="panel-section" id="building-section">


            <h2>Buildings</h2>


            <div id="building-list">


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



                <div class="building-slot">

                    <span>
                        Seaport
                    </span>

                    <button class="build-button">
                        +
                    </button>

                </div>



                <div class="building-slot">

                    <span>
                        Town
                    </span>

                    <button class="build-button">
                        +
                    </button>

                </div>


            </div>


        </div>




        <!-- ==========================
             TURN PHASE SECTION
        =========================== -->


        <div class="panel-section" id="phase-section">


            <h2>
                Turn Phase
            </h2>


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


    Object.values(game.players || {}).forEach(player=>{

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
            <img src="assets/tiles/capital-removebg-preview.png" alt="Center Capital">
        </button>
    `;

    document.body.appendChild(controls);

    controls.querySelector("#zoomIn").addEventListener("click", zoomIn);

    controls.querySelector("#zoomOut").addEventListener("click", zoomOut);

    controls.querySelector("#centerCapital").addEventListener("click", teleportToCapital);
}



// ==========================
// CARD HAND PANEL
// ==========================

function createCardPanel(gameState){

    // Remove old card panel if it exists
    let oldPanel = document.getElementById("card-hand");

    if(oldPanel){
        oldPanel.remove();
    }


    const panel = document.createElement("div");

    panel.id = "card-hand";


    /*
        The player's hand is stored as card IDs.
        Example:
        [
            "battle_fury",
            "peace_treaty"
        ]

        The full card data comes from cardLookup.
    */


    const hand = getPlayerHand();


    hand.forEach(cardID => {


        const card = getCard(cardID);


        if(!card)
            return;



        const cardElement =
        document.createElement("div");


        cardElement.className = "card";



        cardElement.innerHTML = `

            <div class="card-title">

                ${card.name}

            </div>


            <div class="card-image-frame">

                <img
                    class="card-image"
                    src="${card.image}"
                    alt="${card.name}"
                >

            </div>



            <div class="card-info">


                <div class="card-cost-box">

                    <span class="card-cost-label">
                        Cost
                    </span>

                    <span class="card-cost">

                        ${
                            Object.entries(card.cost || {})
                            .map(([resource, amount]) => `${amount} ${resource}`)
                            .join(", ")

                        }

                    </span>

                </div>


                <div class="card-description">

                    ${card.description}

                </div>


            </div>


        `;



        const container = document.createElement("div");

        container.className = "card-container";


        container.appendChild(cardElement);


        panel.appendChild(container);


    });



    document.body.appendChild(panel);


}




// ==========================
// CARD EFFECT TEXT
// ==========================

function formatCardEffect(effect){


    if(!effect)
        return "No effect";



    let text = "";



    switch(effect.type){


        case "attack_buff":

            text =
            `Increase attack by ${effect.value * 100}%`;

            break;



        case "heal":

            text =
            `Restore ${effect.healthRestorePercent * 100}% health`;

            break;



        case "movement_buff":

            text =
            `+${effect.movementBonus} movement`;

            break;



        case "defense_buff":

            text =
            `Increase defense by ${effect.defenseBonus * 100}%`;

            break;



        case "summon_unit":

            text =
            "Summon a unit";

            break;



        case "trigger_cataclysm":

            text =
            "Trigger a Cataclysm";

            break;



        default:

            text =
            effect.type.replaceAll("_"," ");

    }



    return text;

}