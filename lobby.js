import {
    database,
    ref,
    get,
    set,
    onValue,
    push,
    remove,
    onDisconnect,
    update
} from "./firebase/firebase.js";


function generateGameCode(){

    return Math.random()
    .toString(36)
    .substring(2,8)
    .toUpperCase();

}


let currentGameCode = "";
let currentPlayerID = "";

let countdownStarted = false;
// ==========================
// DELETE EMPTY GAMES
// ==========================

async function cleanupDeadGames(){

    console.log("Checking for abandoned games...");

    const gamesSnapshot =
    await get(ref(database, "games"));

    if(!gamesSnapshot.exists())
        return;

    const games = gamesSnapshot.val();

    console.log("Games found:", games);

    for(const [gameCode, game] of Object.entries(games)){

        const players =
        Object.values(game.players || {});

        if(players.length === 0){

            await remove(ref(database, "games/" + gameCode));
            continue;

        }

        const connectedPlayers =
        players.filter(player => player.connected === true);

        if(connectedPlayers.length === 0){

            console.log("Deleting abandoned game:", gameCode);

            await remove(ref(database, "games/" + gameCode));

        }

    }

}


// ==========================
// CREATE GAME
// ==========================


window.createGame = async function(){


    let playerName =
    document.getElementById("playerName").value;


    let kingdom =
    document.getElementById("kingdom").value;



    let gameCode =
    generateGameCode();


    currentGameCode = gameCode;



    let playerID =
    push(ref(database,"players")).key;


    currentPlayerID = playerID;


    let player = {

        id: playerID,

        username: playerName,

        kingdom: kingdom,

        ready: false,

        host: true,

        connected: true

    };



    await set(
        ref(database,"games/" + gameCode),
        {
            status: "lobby",

            host: playerID,

            players: {},

            turn: {
                currentPlayer: null,
                currentPhase: "feed",
                round: 1
            }
        }
    );



    await set(
        ref(
            database,
            "games/" + gameCode + "/players/" + playerID
        ),
        player
    );

    const playerRef = ref(
        database,
        "games/" + gameCode + "/players/" + playerID
    );

    await onDisconnect(playerRef).update({
        connected:false
    });

console.log("Lobby disconnect registered");

    savePlayerData();


    document.getElementById("status").innerHTML =
    "Game Created! Code: " + gameCode;



    watchPlayers();

    watchGameStatus();

   


};




// ==========================
// JOIN GAME
// ==========================


window.joinGame = async function(){


    let gameCode =
    document.getElementById("gameCode").value.toUpperCase();



    let playerName =
    document.getElementById("playerName").value;



    let kingdom =
    document.getElementById("kingdom").value;



    let gameSnapshot =
    await get(
        ref(database,"games/"+gameCode)
    );



    if(!gameSnapshot.exists()){


        document.getElementById("status").innerHTML =
        "Game not found.";

        return;

    }



    currentGameCode = gameCode;



    let playerID =
    push(ref(database,"players")).key;


    currentPlayerID = playerID;



    let player = {

        id: playerID,

        username: playerName,

        kingdom: kingdom,

        ready: false,

        host: false,

        connected: true

    };



    await set(
        ref(
            database,
            "games/"+gameCode+"/players/"+playerID
        ),
        player
    );

    const playerRef = ref(
        database,
        "games/"+gameCode+"/players/"+playerID
    );

    await onDisconnect(playerRef).update({
        connected:false
    });

    console.log("Lobby disconnect registered");

    savePlayerData();



    document.getElementById("status").innerHTML =
    "Joined Game!";



    watchPlayers();

    watchGameStatus();



};





function savePlayerData(){


    localStorage.setItem(
        "gameCode",
        currentGameCode
    );


    localStorage.setItem(
        "playerID",
        currentPlayerID
    );


}






// ==========================
// DELETE GAME
// ==========================


window.deleteGame = async function(){


    if(currentGameCode==="")
        return;



    await remove(
        ref(database,"games/"+currentGameCode)
    );



    document.getElementById("status").innerHTML =
    "Game deleted.";



    currentGameCode="";

};






// ==========================
// DISPLAY PLAYERS
// ==========================


function watchPlayers(){


onValue(

ref(database,"games/"+currentGameCode+"/players"),

(snapshot)=>{


let players=snapshot.val();


let list=document.getElementById("playerList");


list.innerHTML="";



if(players){


Object.values(players).forEach(player=>{


list.innerHTML += `

<div class="player-card">

<b>${player.username}</b>

<br>

Kingdom:
${player.kingdom}

<br>

${
player.ready
?
"<span class='ready'>READY</span>"
:
"<span class='not-ready'>Not Ready</span>"
}

${player.host ? "<br>HOST" : ""}


</div>


`;


});


}



});


}






// ==========================
// READY
// ==========================


window.readyUp = async function(){


await set(

ref(
database,
"games/"+currentGameCode+
"/players/"+currentPlayerID+
"/ready"

),

true

);



};






// ==========================
// CHANGE KINGDOM
// ==========================


window.changeKingdom = async function(){


let kingdom =
document.getElementById("kingdom").value;



await set(

ref(
database,
"games/"+currentGameCode+
"/players/"+currentPlayerID+
"/kingdom"

),

kingdom

);


};






// ==========================
// START GAME CHECK
// ==========================


window.checkStartGame = async function(){



    let game =
    (await get(
        ref(database,"games/"+currentGameCode)
    )).val();



    if(game.host !== currentPlayerID){


        document.getElementById("status").innerHTML =
        "Only the host can start.";

        return;


    }



    let players =
    game.players;



    const turnOrder = [
        "Crimson Empire",
        "Tide Kingdom",
        "Culinary Kingdom",
        "Viking Kingdom",
        "Shadow Kingdom"
    ];

    // Find the first kingdom that is actually in the game
    let firstPlayerID = null;

    for(const kingdom of turnOrder){

        const player = Object.values(players).find(
            p => p.kingdom === kingdom
        );

        if(player){
            firstPlayerID = player.id;
            break;
        }

    }



    let allReady =
    Object.values(players).every(
        player=>player.ready
    );



    if(allReady){

        await update(
            ref(database, "games/" + currentGameCode + "/turn"),
            {
                currentPlayer: firstPlayerID,
                currentPhase: "feed",
                round: 1
            }
        );

        await set(

        ref(database,"games/"+currentGameCode+"/status"),

            "starting"

        );


    }

    else{


        document.getElementById("status").innerHTML =
        "Not everyone is ready.";

    }



};






// ==========================
// COUNTDOWN
// ==========================


function startCountdown(){

    if(countdownStarted)
        return;


    countdownStarted=true;


    // Hide everything else
    document.body.innerHTML = `
    
    <div id="loadingScreen">

        <h1>Starting Game</h1>

        <h1 id="countdown">5</h1>

    </div>

    `;



    let time = 5;


    let countdown =
    document.getElementById("countdown");


    countdown.innerHTML=time;



    let timer=setInterval(()=>{


        time--;


        countdown.innerHTML=time;



        if(time<=0){
            clearInterval(timer);
            window.location.href="game.html";
        }


    },1000);


}






// ==========================
// WATCH GAME STATUS
// ==========================


function watchGameStatus(){


onValue(

ref(database,"games/"+currentGameCode+"/status"),

(snapshot)=>{


let status=snapshot.val();



if(status==="starting"){


startCountdown();


}



});


}










setInterval(()=>{
    cleanupDeadGames();
},30000);

cleanupDeadGames();

window.createGame = createGame;
window.joinGame = joinGame;
window.readyUp = readyUp;
window.deleteGame = deleteGame;
window.checkStartGame = checkStartGame;
window.changeKingdom = changeKingdom;