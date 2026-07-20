import {
    database,
    ref,
    get,
    update
} from "./firebase/firebase.js";



const phases = [
    "feed",
    "cards",
    "construction",
    "movement"
];



const kingdomOrder = [
    "Crimson Empire",
    "Tide Kingdom",
    "Culinary Kingdom",
    "Viking Kingdom",
    "Shadow Kingdom"
];




// ==========================
// END CURRENT PHASE
// ==========================

export async function endCurrentPhase(gameCode, playerID){

    const gameRef =
        ref(database, `games/${gameCode}`);


    const snapshot =
        await get(gameRef);


    if(!snapshot.exists())
        return;


    const game =
        snapshot.val();



    let turn =
        game.turn;

    // Make sure it is this player's turn

    if(turn.currentPlayer !== playerID){

        console.log("Not your turn.");

        return;

    }

    let currentPhaseIndex =
        phases.indexOf(turn.currentPhase);



    // Move to next phase

    if(currentPhaseIndex < phases.length - 1){


        await update(
            ref(database, `games/${gameCode}/turn`),
            {
                currentPhase:
                    phases[currentPhaseIndex + 1]
            }
        );


        return;

    }



    // Finished movement phase
    // Move to next player

    nextPlayer(gameCode, game);

}


async function nextPlayer(gameCode, game){


    const players =
    Object.values(game.players);


    let currentIndex =
    players.findIndex(
        p => p.id === game.turn.currentPlayer
    );


    let nextIndex =
    currentIndex + 1;



    // End of player list = new round

    let newRound =
    game.turn.round;


    if(nextIndex >= players.length){

        nextIndex = 0;

        newRound++;

    }



    const nextPlayer =
    players[nextIndex];



    await update(
        ref(database,"games/"+gameCode),
        {

            "turn/currentPlayer":
            nextPlayer.id,

            "turn/currentPhase":
            phases[0],

            "turn/round":
            newRound

        }
    );


}


// ==========================
// NEXT PLAYER
// ==========================


async function nextPlayer(gameCode, game){


    const players =
        Object.values(game.players || {});



    const currentPlayer =
        players.find(
            p => p.id === game.turn.currentPlayer
        );



    if(!currentPlayer)
        return;



    let currentKingdomIndex =
        kingdomOrder.indexOf(
            currentPlayer.kingdom
        );



    let nextKingdom =
        null;



    // Find next available kingdom

    for(
        let i = 1;
        i <= kingdomOrder.length;
        i++
    ){

        let kingdom =
            kingdomOrder[
                (currentKingdomIndex + i)
                % kingdomOrder.length
            ];



        let player =
            players.find(
                p => p.kingdom === kingdom
            );


        if(player){

            nextKingdom = player;

            break;

        }

    }



    if(!nextKingdom)
        return;



    let newRound =
        game.turn.round || 1;



    // If we returned to first player

    if(
        nextKingdom.id === players[0].id
    ){

        newRound++;

    }



    await update(
        ref(database, `games/${gameCode}/turn`),
        {

            currentPlayer:
                nextKingdom.id,


            currentPhase:
                "feed",


            round:
                newRound

        }
    );


}