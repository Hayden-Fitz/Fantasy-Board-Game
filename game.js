import { 
    database,
    ref,
    get,
    set,
    onValue
} from "./firebase.js";

import { generateMap, renderMap } from "./mapGenerator.js";




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


        if (game.host === playerID) {

            let map = generateMap(playerCount);

            await set(
                ref(database, "games/" + gameCode + "/map"),
                map
            );
        }



    // ==========================
    // EVERYONE LOADS MAP
    // ==========================


    waitForMap();


}





function waitForMap(){


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

                startGame(map);

            }

        }
    );



}





function startGame(map){
    renderMap(map);
}





loadGame();