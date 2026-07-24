import {
    database,
    ref,
    get,
    update
} from "../firebase/firebase.js";
import { collectResources } from "./resourceHandler.js";
import { produceResources } from "./resourceHandler.js";
import { updateTurnUI } from "../UI/ui.js";

const phases = [
    "feed",
    "cards",
    "movement",
    "construction"
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

        const newPhase =
            phases[currentPhaseIndex + 1];


        console.log(
            "Changing phase:",
            turn.currentPhase,
            "->",
            newPhase
        );


        await update(
            ref(database, `games/${gameCode}/turn`),
            {
                currentPhase: newPhase
            }
        );


        updateTurnUI(
            {
                ...turn,
                currentPhase: newPhase
            },
            game.players
        );


        return;

    }



    // Finished construction phase
    // Move to next player
    
    await update(
        ref(database, `games/${gameCode}/turn`),
        {
            currentPhase: "feed"
        }
    );

    await nextPlayer(gameCode, game);

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
    


    console.log("MAP:", game.map);
    console.log("PLAYER:", nextKingdom);







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


    await produceResources(
        gameCode,
        nextKingdom.id,
        game
    );

    console.log(
        "Resources produced for:",
    nextKingdom.username
);

}