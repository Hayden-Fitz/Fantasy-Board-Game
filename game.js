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
import { createUI } from "./UI/UI.js";

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


    // Create UI

    createUI({
        ...game,
        map: map,
        hand: getPlayerHand()
    });

}





loadGame();