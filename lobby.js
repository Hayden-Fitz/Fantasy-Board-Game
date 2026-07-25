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


function watchPublicGames(){


    onValue(
    ref(database,"games"),
    (snapshot)=>{


    let games =
    snapshot.val();


    let list =
    document.getElementById("publicGames");


    list.innerHTML="";


    Object.entries(games || {})
    .forEach(([code,game])=>{


    let players =
    Object.keys(game.players || {}).length;


    let host =
    Object.values(game.players || {})
    .find(player => player.host);


    if(
    game.public &&
    game.status==="lobby" &&
    players < game.maxPlayers
    ){


    list.innerHTML += `

    <div class="public-game">

    <h3>${code}</h3>

    <p>
    Host: ${host ? host.username : "Unknown"}
    </p>

    <p>
    ${players}/${game.maxPlayers} Players
    </p>


    <button onclick="quickJoin('${code}')">
    Join
    </button>


    </div>

    `;

    }


    });


    });


}











window.showJoinScreen = function(){

    document.getElementById("mainMenu").style.display="none";

    document.getElementById("joinScreen").style.display="block";

};


window.returnMainMenu = function(){

    document.getElementById("joinScreen").style.display="none";

    document.getElementById("mainMenu").style.display="block";

};


// ==========================
// CREATE GAME
// ==========================


window.createGame = async function(){

    let publicSetting = false;


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

        connected: true,

        resources: {

            wood: 0,
            stone: 0,
            metal: 0,
            gold: 0,
            magic: 0,
            food: 0

        },

    };

    console.log(
        "Public checkbox:",
        document.getElementById("publicGame").checked
    );

    await set(
        ref(database,"games/" + gameCode),
        {
            status: "lobby",

            host: playerID,

            players:{},

            public: publicSetting,

            maxPlayers:5,

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

    enterLobby();

    document.getElementById("publicGame").onchange = updatePublicSetting;
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


    let game =
    gameSnapshot.val();

    if(game.host === currentPlayerID){

        document.getElementById("status").innerHTML =
        "You are already the host.";

        return;

    }

    let playerCount =
    Object.keys(game.players || {}).length;



    if(playerCount >= game.maxPlayers){

        document.getElementById("status").innerHTML =
        "Game is full.";

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

        connected: true,

        resources: {

            wood: 0,
            stone: 0,
            metal: 0,
            gold: 0,
            magic: 0,
            food: 0

        },

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


    enterLobby();

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


function enterLobby(){


    document.getElementById("mainMenu").style.display="none";


    document.getElementById("joinScreen").style.display="none";


    document.getElementById("lobbyScreen").style.display="flex";


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


    currentGameCode="";
    currentPlayerID="";


    document.getElementById("lobbyScreen").style.display="none";

    document.getElementById("mainMenu").style.display="block";

};






// ==========================
// DISPLAY PLAYERS
// ==========================


function watchPlayers(){

    onValue(

    ref(database,"games/"+currentGameCode+"/players"),

    (snapshot)=>{


        let players=snapshot.val();
        updateKingdomPicker(players || {});

        let list=document.getElementById("playerList");


        list.innerHTML="";


        let hostControls = document.getElementById("hostControls");

        if(hostControls){
            hostControls.style.display="none";
        }



        if(players){


            Object.values(players).forEach(player=>{


                // Show host controls only for host
                if(
                    player.id === currentPlayerID &&
                    player.host
                ){

                    let hostControls = document.getElementById("hostControls");

                    if(hostControls){
                        hostControls.style.display="block";
                    }

                }



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


    let dropdown = document.getElementById("kingdom");

    let kingdom = dropdown.value;


    let game =
    (await get(
        ref(database,"games/"+currentGameCode)
    )).val();



    let taken =
    Object.values(game.players || {})
    .filter(player => player.id !== currentPlayerID)
    .map(player => player.kingdom);



    if(taken.includes(kingdom)){

        alert("That kingdom is already taken.");

        return;

    }



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


function updateKingdomPicker(players){


    let dropdown =
    document.getElementById("kingdom");


    let taken =
    Object.values(players)
    .filter(player=>player.id !== currentPlayerID)
    .map(player=>player.kingdom);



    Array.from(dropdown.options)
    .forEach(option=>{


        option.hidden =
        taken.includes(option.value);


    });


}



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

window.quickJoin = async function(code){

    document.getElementById("gameCode").value = code;

    await window.joinGame();

};





window.updatePublicSetting = async function(){

    let isPublic =
    document.getElementById("publicGame").checked;


    await update(
        ref(database,"games/"+currentGameCode),
        {
            public:isPublic
        }
    );

};



// ==========================
// WATCH GAME STATUS
// ==========================


function watchGameStatus(){


    onValue(

        ref(database,"games/"+currentGameCode+"/status"),

    (snapshot)=>{


        let status=snapshot.val();



        if(status==="starting"){

            window.location.href="game.html";

        }



    });


}










cleanupDeadGames();
watchPublicGames();

setInterval(()=>{
    cleanupDeadGames();
},30000);

window.createGame = createGame;
window.joinGame = joinGame;
window.readyUp = readyUp;
window.deleteGame = deleteGame;
window.checkStartGame = checkStartGame;
window.changeKingdom = changeKingdom;