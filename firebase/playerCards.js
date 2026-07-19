import {
    database,
    ref,
    set,
    get,
    onValue
} from "./firebase.js";


export async function syncPlayerCards(
    gameCode,
    playerID,
    hand,
    discard,
    deckSize
){

    console.log("SYNCING CARDS:", {
        hand,
        discard,
        deckSize
    });


    const cardsRef = ref(
        database,
        `games/${gameCode}/players/${playerID}/cards`
    );


    await set(cardsRef, {

        hand: [...hand],

        discard: [...discard],

        deckSize: deckSize

    });

}

// =============================
// UPDATE PLAYER HAND
// =============================

export async function updatePlayerHand(gameCode, playerID, hand) {

    await set(
        ref(
            database,
            `games/${gameCode}/players/${playerID}/cards/hand`
        ),
        hand
    );

}

// =============================
// UPDATE DISCARD PILE
// =============================

export async function updateDiscardPile(gameCode, playerID, discard) {

    await set(
        ref(
            database,
            `games/${gameCode}/players/${playerID}/cards/discard`
        ),
        discard
    );

}

// =============================
// UPDATE DECK SIZE
// =============================

export async function updateDeckSize(gameCode, playerID, deckSize) {

    await set(
        ref(
            database,
            `games/${gameCode}/players/${playerID}/cards/deckSize`
        ),
        deckSize
    );

}

// =============================
// READ PLAYER HAND
// =============================

export async function getPlayerHand(gameCode, playerID) {

    const snapshot = await get(
        ref(
            database,
            `games/${gameCode}/players/${playerID}/cards/hand`
        )
    );

    if (!snapshot.exists()) return [];

    return snapshot.val();

}

// =============================
// LISTEN FOR HAND CHANGES
// =============================

export function listenForHandChanges(gameCode, playerID, callback) {

    onValue(

        ref(
            database,
            `games/${gameCode}/players/${playerID}/cards/hand`
        ),

        snapshot => {

            callback(snapshot.val() || []);

        }

    );

}



