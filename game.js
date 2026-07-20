import {
    database,
    ref,
    get,
    set,
    onValue,
    remove,
    onDisconnect,
    update
} from "./firebase/firebase.js";

import { generateMap, renderMap, setCurrentGame } from "./mapGenerator.js";
import { createUI, updateTurnUI } from "./UI/UI.js";

import {
    createPlayerDeck,
    drawStartingHand,
    getPlayerHand,
    getDiscardPile,
    getDeckSize
} from "./cards/cards.js";

import {
    syncPlayerCards
} from "./firebase/playerCards.js";



// =============================
// TURN PHASES
// =============================

const playablePhases = [

    "feed",
    "cards",
    "construction",
    "movement"

];
function getPhaseName(phase){

    const names = {

        feed: "Feed Troops",

        cards: "Play Cards",

        construction: "Construction",

        movement: "Move & Battle"

    };


    return names[phase] || "Waiting...";

}
function getNextPhase(currentPhase){

    let index =
    playablePhases.indexOf(currentPhase);


    if(index === -1){

        return playablePhases[0];

    }


    index++;


    if(index >= playablePhases.length){

        return "end";

    }


    return playablePhases[index];

}


let gameCode =
localStorage.getItem("gameCode");



let playerID =
localStorage.getItem("playerID");



if(!gameCode || !playerID){

    console.error("No game data found.");

}





async function loadGame(){


    // Get game information

    let gameSnapshot =
    await get(
        ref(database,"games/"+gameCode)
    );


    if(!gameSnapshot.exists()){

        console.error("Game does not exist.");

        return;

    }



    let game =
    gameSnapshot.val();

    let players =
    Object.values(game.players || {});




    let playerCount =
    players.length;



    console.log(
        "Players:",
        players
    );


    console.log(
        "Player Count:",
        playerCount
    );



    // ==========================
    // HOST CREATES MAP
    // ==========================


        let currentPlayer =
        players.find(
            player => player.id === playerID
        );


        if(!currentPlayer){

            console.error(
                "Player not found in game."
            );

            return;

        }


        // ==========================
        // PLAYER CONNECTION
        // ==========================

        const playerRef =
        ref(
            database,
            `games/${gameCode}/players/${playerID}`
        );

        await update(playerRef, {
            connected: true
        });

        await onDisconnect(playerRef).update({
            connected: false
        });

        console.log("Disconnect registered:", playerRef);

        // Only the host watches for empty games
        if (game.host === playerID) {

            const playersRef = ref(database, `games/${gameCode}/players`);

            onValue(playersRef, () => {
                cleanupGame();
            });

        }

        if (game.host === playerID) {

            let map = generateMap(players);

            await set(
                ref(database, "games/" + gameCode + "/map"),
                map
            );


            // ==========================
            // CREATE INITIAL TURN
            // ==========================

            await update(
                ref(database, "games/" + gameCode),
                {

                    turn:{
                        currentPlayer: players[0].id,
                        currentPhase: "feed",
                        round: 1
                    }

                }
            );

        }



    // ==========================
    // EVERYONE LOADS MAP
    // ==========================


    waitForMap(game);


}


async function cleanupGame(){

    const gameRef =
        ref(database, "games/" + gameCode);

    const snapshot =
        await get(gameRef);

    if(!snapshot.exists())
        return;

    const game = snapshot.val();

    const players =
        Object.values(game.players || {});

    const connectedPlayers =
        players.filter(player => player.connected);

    if(connectedPlayers.length === 0){

        console.log("Deleting empty game.");

        await remove(gameRef);

    }

}


function waitForMap(game){


    let mapRef =
    ref(
        database,
        "games/"+gameCode+"/map"
    );


    onValue(
        mapRef,
        (snapshot)=>{

            if(snapshot.exists()){

                let map =
                snapshot.val();


                console.log(
                    "MAP LOADED:",
                    map
                );


                startGame(map, game);

            }

        }
    );

}





async function startGame(map, game){

    renderMap(map);

    setCurrentGame(game);


    // ==========================
    // CREATE PLAYER CARD DECK
    // ==========================

    createPlayerDeck();

    drawStartingHand();


    // Sync cards to Firebase

    try {

        await syncPlayerCards(
            gameCode,
            playerID,
            getPlayerHand(),
            getDiscardPile(),
            getDeckSize()
        );

    }
    catch(error){

        console.error("Card sync failed:", error);

    }

    await update(
        ref(database, "games/" + gameCode + "/turn"),
        {
            currentPlayer: Object.values(game.players)[0].id,
            currentPhase: "feed",
            round: 1
        }
    );

    // Create UI

    createUI({
        ...game,
        map: map,
        hand: getPlayerHand()
    });

    

    const turnRef =
    ref(database, "games/" + gameCode + "/turn");


    onValue(turnRef, snapshot=>{

        if(!snapshot.exists())
            return;


        const turn =
        snapshot.val();


        updateTurnUI(
            turn,
            game.players
        );

    });

}





loadGame();