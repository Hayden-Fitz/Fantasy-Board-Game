import {
    database,
    ref,
    set,
    push,
    get,
    onValue,
    update
} from "../firebase/firebase.js";




export async function createWorker(
    gameCode,
    playerID,
    x,
    y
){

    const workerID =
    push(ref(database, "games/" + gameCode + "/workers")).key;

    await set(
        ref(
            database,
            "games/" + gameCode + "/workers/" + workerID
        ),
        {

            id: workerID,

            owner: playerID,

            x: x,

            y: y

        }
    );

}



export async function spawnStartingWorkers(
    gameCode,
    playerID,
    capitalTile,
    map
){

    const directions = [
        [1,0],
        [1,-1],
        [0,-1],
        [-1,0],
        [-1,1],
        [0,1]
    ];

    const workerDirections = [0,2,4];

    for(const index of workerDirections){

        const dir = directions[index];

        const tile =
        map.tiles[
            `${capitalTile.x + dir[0]},${capitalTile.y + dir[1]}`
        ];

        if(!tile)
            continue;

        await createWorker(
            gameCode,
            playerID,
            tile.x,
            tile.y
        );

    }

}




export function watchWorkers(
    gameCode,
    callback
){

    onValue(

        ref(database, "games/" + gameCode + "/workers"),

        (snapshot)=>{

            callback(snapshot.val() || {});

        }

    );

}


// ==========================
// MOVE WORKER
// ==========================

export async function moveWorker(
    gameCode,
    workerID,
    x,
    y
){

    await update(
        ref(
            database,
            `games/${gameCode}/workers/${workerID}`
        ),
        {
            x:x,
            y:y
        }
    );

}
