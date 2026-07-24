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
import { endCurrentPhase } from "../gameHandlers/turnHandler.js";
import { database, ref, onValue } from "../firebase/firebase.js";
import { 
    startBuilding, 
    cancelBuilding, 
    isBuildingMode, 
    getSelectedBuilding
} from "../gameHandlers/buildingHandler.js";
// =============================
// CREATE UI
// =============================

export function createUI(gameState){

    window.currentGame = gameState;

    createTopBar(gameState);

    createLeftPanel(gameState);

    createRightPanel(gameState);

    createCardPanel(gameState);

    createInfoPanel(gameState);

    createMapControls(gameState);

    updateCurrentPlayer(
        getCurrentPlayerName(gameState)
    );

    updateCurrentPhase(
        gameState.turn?.currentPhase
    );

    updateRound(
        gameState.turn?.round || 1
    );

}





function createLeftPanel(game){


    // Remove old panel if it exists
    const oldPanel = document.getElementById("left-panel");

    if(oldPanel){
        oldPanel.remove();
    }

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

                    <button 
                        class="build-button"
                        data-building="wall">
                        +
                    </button>

                </div>



                <div class="building-slot">

                    <span>
                        Road
                    </span>

                    <button 
                        class="build-button"
                        data-building="road">
                        +
                    </button>

                </div>



                <div class="building-slot">

                    <span>
                        Bridge
                    </span>

                    <button 
                        class="build-button"
                        data-building="bridge">
                        +
                    </button>

                </div>



                <div class="building-slot">

                    <span>
                        Fortress
                    </span>

                    <button 
                        class="build-button"
                        data-building="fortress">
                        +
                    </button>
                </div>



                <div class="building-slot">

                    <span>
                        Barracks
                    </span>

                    <button 
                        class="build-button"
                        data-building="barracks">
                        +
                    </button>

                </div>



                <div class="building-slot">

                    <span>
                        Workshop
                    </span>

                    <button 
                        class="build-button"
                        data-building="workshop">
                        +
                    </button>

                </div>



                <div class="building-slot">

                    <span>
                        Seaport
                    </span>

                    <button 
                        class="build-button"
                        data-building="seaport">
                        +
                    </button>

                </div>



                <div class="building-slot">

                    <span>
                        Town
                    </span>

                    <button 
                        class="build-button"
                        data-building="town">
                        +
                    </button>

                </div>


            </div>


        </div>




        <!-- ==========================
            TURN SECTION
        =========================== -->

        <div class="panel-section" id="phase-section">

            <div id="current-player">
                Current Player
                <br>
                <strong id="current-player-name">Waiting...</strong>
            </div>

            <hr>

            <div id="current-phase">
                Waiting...
            </div>
            <button id="phase-button">
                End Phase
            </button>

        </div>


    `;



    document.body.appendChild(panel);


    const phaseButton =
    document.getElementById("phase-button");


    if(phaseButton){

        phaseButton.addEventListener("click", ()=>{

            endCurrentPhase(
                localStorage.getItem("gameCode"),
                localStorage.getItem("playerID")
            );

        });

    }

    const buildButtons =
    document.querySelectorAll(".build-button");

    buildButtons.forEach(button=>{

        button.addEventListener("click", ()=>{

            const currentPhase =
                window.currentGame?.turn?.currentPhase;

            const playerID =
                localStorage.getItem("playerID");

            const currentPlayer =
                window.currentGame?.turn?.currentPlayer;


            if(currentPhase !== "construction"){

                console.log("Not construction phase");
                return;

            }


            if(playerID !== currentPlayer){

                console.log("Not your turn");
                return;

            }



            const building =
            button.dataset.building;


            buildButtons.forEach(btn=>{
                btn.classList.remove("selected");
            });


            if(
                isBuildingMode() &&
                getSelectedBuilding() === building
            ){

                cancelBuilding();

            }
            else{

                startBuilding(building, window.currentGame);

                button.classList.add("selected");

            }

        });

    });

}







function updateCurrentPlayer(name){

    const element =
        document.getElementById("current-player-name");

    if(element){

        element.textContent = name;

    }

}
function updateCurrentPhase(phase){

    const element =
        document.getElementById("current-phase");

    if(!element)
        return;

    const names = {

        feed: "Feed Troops",
        cards: "Play Cards",
        construction: "Construction",
        movement: "Move & Battle"

    };

    element.textContent =
        names[phase] || "Waiting...";


    updatePhaseButton(phase);

}
function getCurrentPlayerName(gameState){

    const currentPlayerID =
        gameState.turn?.currentPlayer;


    if(!currentPlayerID)
        return "Waiting...";


    const player =
        Object.values(gameState.players || {})
        .find(
            player => player.id === currentPlayerID
        );


    return player?.username || "Waiting...";

}
function updateRound(round){

    const element =
        document.getElementById("roundCounter");

    if(element){

        element.textContent =
            `Round: ${round}`;

    }

}
function updatePhaseButton(phase){

    const button =
    document.getElementById("phase-button");


    if(!button)
        return;


    if(phase === "construction"){

        button.textContent = "End Turn";

    }
    else{

        button.textContent = "End Phase";

    }

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
        box.id = `resource-${resource}`;


        box.innerHTML = `
            <span>${resource}</span>
            <span id="resource-count-${resource}">
                x0
            </span>
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
        ${game.turn?.round || 1}

    `;


    topBar.appendChild(round);


}





function createRightPanel(game){
    const oldPanel =
    document.getElementById("right-panel");

    if(oldPanel){
        oldPanel.remove();
    }
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
    const oldPanel =
    document.getElementById("info-panel");

    if(oldPanel){
        oldPanel.remove();
    }
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
    const oldControls =
    document.getElementById("map-controls");

    if(oldControls){
        oldControls.remove();
    }
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


    const hand = getPlayerHand(
        localStorage.getItem("playerID")
    );


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



















export function updateTurnUI(turn, players){

    updateCurrentPlayer(
        getCurrentPlayerName({
            turn: turn,
            players: players
        })
    );


    updateCurrentPhase(
        turn.currentPhase
    );


    updateRound(
        turn.round
    );

}

export function updateResourceBar(resources){

    Object.entries(resources).forEach(
        ([resource, amount])=>{

            const element =
                document.getElementById(
                    `resource-count-${resource}`
                );


            if(element){

                element.textContent =
                    `x${amount}`;

            }

        }
    );

}