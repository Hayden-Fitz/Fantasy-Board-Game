import {
    database,
    ref,
    get,
    set,
    onValue,
    remove,
    onDisconnect,
    update
} from "./firebase.js";

import { generateMap, renderMap, setCurrentGame} from "./mapGenerator.js";
import { createUI } from "./UI.js";




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

        await onDisconnect(playerRef).set({
            ...currentPlayer,
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





function startGame(map, game){

    renderMap(map);

    setCurrentGame(game);

    createUI({
        ...game,
        map: map
    });

}


// export function setupTileHighlight(){

//     let display = document.getElementById("mapDisplay");

//     if(!display){
//         console.error("Map display not found");
//         return;
//     }


//     display.addEventListener("mousemove", (e)=>{

//         let hoveredTile = null;

//         document.querySelectorAll(".tile").forEach(tile=>{

//             let rect = tile.getBoundingClientRect();

//             if(
//                 e.clientX >= rect.left &&
//                 e.clientX <= rect.right &&
//                 e.clientY >= rect.top &&
//                 e.clientY <= rect.bottom
//             ){

//                 hoveredTile = tile;

//             }

//         });


//         document.querySelectorAll(".tile.glow")
//         .forEach(tile=>{
//             tile.classList.remove("glow");
//         });


//         if(hoveredTile){

//             hoveredTile.classList.add("glow");

//         }

//     });

// }


loadGame();