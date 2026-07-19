// =============================
// IMPORT CARD LIBRARIES
// =============================

import combatCards from "./combatCards.js";
import buildingCards from "./buildingCards.js";
import resourceCards from "./resourceCards.js";
import championCards from "./championCards.js";
import specialCards from "./specialCards.js";


// =============================
// CONSTANTS
// =============================

const MAX_HAND_SIZE = 5;

// =============================
// CARD LIBRARY
// =============================

export const cardLibrary = Object.freeze([
    ...combatCards,
    ...buildingCards,
    ...resourceCards,
    ...championCards,
    ...specialCards
]);

// =============================
// CARD LOOKUP
// =============================

export const cardLookup = {};

cardLibrary.forEach(card => {
    cardLookup[card.cardID] = card;
});

// =============================
// PLAYER CARD DATA
// Stores ONLY card IDs.
// Use getCard(cardID) for full card info.
// =============================

let playerDeck = [];
let playerHand = [];
let playerDiscard = [];

// =============================
// INTERNAL HELPERS
// =============================

function shuffle(array) {

    const deck = [...array];

    for (let i = deck.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

// =============================
// DECK CREATION
// =============================

export function createPlayerDeck() {

    playerDeck = shuffle(
        cardLibrary.map(card => card.cardID)
    );

    playerHand = [];
    playerDiscard = [];
}

// =============================
// DRAWING
// =============================

export function drawCard() {

    if (playerDeck.length === 0) return null;

    if (playerHand.length >= MAX_HAND_SIZE) return null;

    const cardID = playerDeck.shift();

    playerHand.push(cardID);

    return cardLookup[cardID];
}

export function drawStartingHand() {

    for (let i = 0; i < MAX_HAND_SIZE; i++) {

        drawCard();
    }

    return playerHand;
}

// =============================
// DISCARD
// =============================

export function sendToDiscard(cardID) {

    const index = playerHand.indexOf(cardID);

    if (index === -1) return false;

    const removedCardID = playerHand.splice(index, 1)[0];

    playerDiscard.push(removedCardID);

    return true;
}

// =============================
// PLAY CARD
// =============================

export function playCard(cardID) {

    const card = getCard(cardID);

    if (!card) return false;

    if (!sendToDiscard(cardID)) return false;

    // TODO:
    // Resolve card.effect here.

    drawCard();

    return card;
}

// =============================
// GETTERS
// =============================

export function getCard(cardID) {

    return cardLookup[cardID];
}

export function getPlayerDeck() {

    return playerDeck;
}

export function getPlayerHand() {

    return playerHand;
}

export function getDiscardPile() {

    return playerDiscard;
}

export function getDeckSize() {

    return playerDeck.length;
}

export function getHandSize() {

    return playerHand.length;
}