// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDQcJNa_j_PC3-K5er4ms0WvVXQS_CEcuE",
    authDomain: "algebras4-44f23.firebaseapp.com",
    databaseURL: "https://algebras4-44f23-default-rtdb.firebaseio.com",
    projectId: "algebras4-44f23",
    storageBucket: "algebras4-44f23.appspot.com",
    messagingSenderId: "512062724744",
    appId: "1:512062724744:web:653e3c7a504fb7255fdd3d",
    measurementId: "G-4R378XMPSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Initialize user balance
let userBalance = 1000;
let userId = null;

// Update the displayed balance
function updateBalanceDisplay() {
    document.getElementById("balance").textContent = userBalance;
}

// Google login
document.getElementById("googleLogin").addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            userId = result.user.uid;
            userBalance = 1000; // Start balance
            saveBalanceToFirebase(userId);
            updateBalanceDisplay();
            showGameControls();
        })
        .catch((error) => {
            console.error("Error during Google login:", error);
        });
});

// Observe authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid;
        loadBalanceFromFirebase(userId);
        showGameControls();
    } else {
        userBalance = 0; // Reset balance if logged out
        hideGameControls();
    }
});

// Load user balance from Firebase
function loadBalanceFromFirebase(userId) {
    const dbRef = ref(db);
    get(child(dbRef, 'users/' + userId)).then((snapshot) => {
        if (snapshot.exists()) {
            userBalance = snapshot.val().balance;
            updateBalanceDisplay();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error("Error loading balance:", error);
    });
}

// Save balance to Firebase
function saveBalanceToFirebase(userId) {
    set(ref(db, 'users/' + userId), {
        balance: userBalance
    });
}

// Show game controls
function showGameControls() {
    document.getElementById("googleLogin").style.display = "none";
    document.getElementById("placeBet").style.display = "inline-block";
    document.getElementById("playGame").style.display = "inline-block";
    updateBalanceDisplay();
}

// Hide game controls
function hideGameControls() {
    document.getElementById("googleLogin").style.display = "inline-block";
    document.getElementById("placeBet").style.display = "none";
    document.getElementById("playGame").style.display = "none";
    document.getElementById("message").textContent = "Please log in to play the game.";
}

// Handle betting
const betSlider = document.getElementById("betAmount");
const betValueDisplay = document.getElementById("betValue");

betSlider.addEventListener("input", () => {
    betValueDisplay.textContent = betSlider.value;
});

// Place bet button
document.getElementById("placeBet").addEventListener("click", () => {
    if (userId) {
        const betAmount = parseInt(betSlider.value);
        if (betAmount > 0 && betAmount <= userBalance) {
            playGame(betAmount);
        } else {
            displayMessage("Invalid bet amount!");
        }
    } else {
        displayMessage("You must be logged in to place a bet!");
    }
});

// Game logic
function playGame(betAmount) {
    const win = Math.random() < 0.5; // 50% chance to win
    if (win) {
        userBalance += betAmount; // User wins
        displayMessage(`You win! Your new balance is ${userBalance} coins.`);
    } else {
        userBalance -= betAmount; // User loses
        displayMessage(`You lose! Your new balance is ${userBalance} coins.`);
    }
    saveBalanceToFirebase(userId); // Update Firebase
    updateBalanceDisplay();
}

// Display messages
function displayMessage(message) {
    document.getElementById("message").textContent = message;
}

// Initialize balance display
updateBalanceDisplay();
