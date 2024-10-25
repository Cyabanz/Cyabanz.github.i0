// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDQcJNa_j_PC3-K5er4ms0WvVXQS_CEcuE",
    authDomain: "algebras4-44f23.firebaseapp.com",
    databaseURL: "https://algebras4-44f23-default-rtdb.firebaseio.com",
    projectId: "algebras4-44f23",
    storageBucket: "algebras4-44f23",
    messagingSenderId: "512062724744",
    appId: "1:512062724744:web:653e3c7a504fb7255fdd3d",
    measurementId: "G-4R378XMPSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let currentUserId = null;
let userCoins = 500; // Initial coins
let betAmount = 0; // Bet amount from slider
const WIN_REWARD = 100; // Reward for winning

// Check user authentication state
onAuthStateChanged(auth, (user) => {
    const loginButton = document.getElementById("loginButton");
    if (user) {
        currentUserId = user.uid;
        loginButton.style.display = "none"; // Hide login button
        document.getElementById("loggedInMessage").innerText = "You are logged in as " + user.displayName;
        getUserCoins(); // Fetch user coins from Firebase
    } else {
        document.getElementById("loggedInMessage").innerText = "";
        loginButton.style.display = "block"; // Show login button
    }
});

// Function to fetch user coins from Firebase
function getUserCoins() {
    const userRef = ref(db, 'users/' + currentUserId);
    get(child(userRef, 'coins')).then((snapshot) => {
        if (snapshot.exists()) {
            userCoins = snapshot.val();
        } else {
            userCoins = 500; // Default if not found
        }
        document.getElementById("userCoins").innerText = userCoins; // Update displayed coins
    }).catch((error) => {
        console.error("Error fetching user coins: ", error);
    });
}

// Function to start the game
window.startGame = function() {
    if (userCoins < betAmount) {
        alert("Sorry, you don't have enough coins to play.");
        return;
    }
    document.getElementById("gameContainer").style.display = "block"; // Show game container
    playerScore = 0;
    dealerScore = 0;
    document.getElementById("playerCards").innerHTML = "";
    document.getElementById("dealerCards").innerHTML = "";
    drawCard(); // Player draws the first card
    drawCard(); // Player draws the second card
    drawCard(true); // Dealer draws one card (face down)
    drawCard(true); // Dealer draws second card (face up)
};

// Function to draw a card
function drawCard(isDealer = false) {
    const cardValue = Math.floor(Math.random() * 11) + 1; // Card value between 1 and 11
    if (isDealer) {
        dealerScore += cardValue;
        document.getElementById("dealerCards").innerHTML += `<div class="card">${cardValue}</div>`;
    } else {
        playerScore += cardValue;
        document.getElementById("playerCards").innerHTML += `<div class="card">${cardValue}</div>`;
    }
    updateScores();
}

// Function to update scores
function updateScores() {
    document.getElementById("playerScore").innerText = playerScore;
    document.getElementById("dealerScore").innerText = dealerScore;

    // Check for busts
    if (playerScore > 21) {
        alert("You busted! Dealer wins.");
        updateLeaderboard(false); // Update leaderboard for loss
        resetGame();
    } else if (dealerScore > 21) {
        alert("Dealer busted! You win!");
        userCoins += betAmount + WIN_REWARD; // Reward the user
        updateLeaderboard(true); // Update leaderboard for win
        updateUserCoins();
        resetGame();
    }
}

// Function to handle "Stand" action
window.stand = function() {
    while (dealerScore < 17) {
        drawCard(true); // Dealer draws a card
    }
    // Determine winner
    if (playerScore > dealerScore) {
        alert("You win!");
        userCoins += betAmount + WIN_REWARD; // Reward the user
        updateLeaderboard(true); // Update leaderboard for win
    } else if (playerScore < dealerScore) {
        alert("Dealer wins!");
        updateLeaderboard(false); // Update leaderboard for loss
    } else {
        alert("It's a tie!");
    }
    updateUserCoins();
    resetGame();
};

// Function to reset the game
function resetGame() {
    document.getElementById("gameContainer").style.display = "none"; // Hide game container
    playerScore = 0;
    dealerScore = 0;
    document.getElementById("playerCards").innerHTML = "";
    document.getElementById("dealerCards").innerHTML = "";
    document.getElementById("betSlider").value = 1; // Reset slider
}

// Function to update displayed coins
function updateUserCoins() {
    document.getElementById("userCoins").innerText = userCoins; // Update coins display
    // Update the user's coin balance in Firebase
    const userRef = ref(db, 'users/' + currentUserId);
    update(userRef, { coins: userCoins })
        .then(() => console.log("User coins updated successfully."))
        .catch((error) => console.error("Error updating user coins:", error));
}

// Function to update leaderboard
function updateLeaderboard(win) {
    const leaderboardRef = ref(db, 'leaderboard/' + currentUserId);

    get(leaderboardRef).then((snapshot) => {
        if (snapshot.exists()) {
            // User exists, update their stats
            const userData = snapshot.val();
            const totalWins = win ? userData.totalWins + 1 : userData.totalWins;
            const gamesPlayed = userData.gamesPlayed + 1;

            update(leaderboardRef, {
                totalWins: totalWins,
                gamesPlayed: gamesPlayed
            });
        } else {
            // User does not exist, create a new entry
            set(leaderboardRef, {
                username: auth.currentUser.displayName, // Get the username
                totalWins: win ? 1 : 0,
                gamesPlayed: 1
            });
        }
    }).catch((error) => {
        console.error("Error updating leaderboard: ", error);
    });
}

// Function to sign in with Google
window.signIn = function() {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("User signed in:", result.user);
            const userRef = ref(db, 'users/' + result.user.uid);
            // Initialize user data if it doesn't exist
            get(userRef).then((snapshot) => {
                if (!snapshot.exists()) {
                    set(userRef, { coins: 500 }); // Initialize with 500 coins
                }
            });
        }).catch((error) => {
            console.error("Error signing in:", error);
        });
};
