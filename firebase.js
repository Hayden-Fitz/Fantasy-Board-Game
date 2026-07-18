import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    get,
    child,
    push,
    onValue,
    remove,
    update,
    onDisconnect
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {

apiKey: "AIzaSyD9jy9Z0trQxWJBV2rL57PuVY4_xeceHD0",

authDomain: "fantasy-board-game.firebaseapp.com",

databaseURL: "https://fantasy-board-game-default-rtdb.firebaseio.com/",

projectId: "fantasy-board-game",

storageBucket: "fantasy-board-game.firebasestorage.app",

messagingSenderId: "736842439460",

appId: "1:736842439460:web:f2d388c78013246f4a71b1"

};


const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);


export {
    ref,
    set,
    get,
    child,
    push,
    onValue,
    remove,
    update,
    onDisconnect
};