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
let playerScore = 0;
let dealerScore = 0;

// Check user authentication state
onAuthStateChanged(auth, (user) => {
    const loginButton = document.getElementById("loginButton");
    if (user) {
        currentUserId = user.uid;
        loginButton.style.display = "none"; // Hide login button
        document.getElementById("loggedInMessage").innerText = "You are logged in as " + user.displayName;
        getUserCoins(); // Fetch user coins from Firebase
        updateLeaderboard(); // Fetch and display leaderboard
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
        resetGame();
        updateLeaderboard(false); // Update leaderboard if player loses
    } else if (dealerScore > 21) {
        alert("Dealer busted! You win!");
        userCoins += betAmount + WIN_REWARD; // Reward the user
        updateUserCoins();
        updateLeaderboard(true); // Update leaderboard if player wins
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
        updateUserCoins();
        updateLeaderboard(true); // Update leaderboard if player wins
    } else if (playerScore < dealerScore) {
        alert("Dealer wins!");
        updateLeaderboard(false); // Update leaderboard if player loses
    } else {
        alert("It's a tie!");
    }
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

// Function to sign in with Google
window.signIn = function() {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("User signed in: ", result.user);
        }).catch((error) => {
            console.error("Error signing in: ", error);
        });
};

// Function to update the leaderboard
function updateLeaderboard(win = null) {
    const leaderboardRef = ref(db, 'leaderboard');
    get(leaderboardRef).then((snapshot) => {
        if (snapshot.exists()) {
            const leaderboardData = snapshot.val();
            const leaderboardArray = Object.entries(leaderboardData).map(([key, value]) => ({
                username: value.username,
                totalWins: value.totalWins || 0,
                gamesPlayed: value.gamesPlayed || 0
            }));

            // Sort leaderboard by total wins
            leaderboardArray.sort((a, b) => b.totalWins - a.totalWins);
            const tbody = document.getElementById("leaderboard").querySelector("tbody");
            tbody.innerHTML = ""; // Clear existing rows
            leaderboardArray.forEach((player, index) => {
                const row = tbody.insertRow();
                row.insertCell(0).innerText = index + 1;
                row.insertCell(1).innerText = player.username;
                row.insertCell(2).innerText = player.totalWins;
                row.insertCell(3).innerText = player.gamesPlayed;
            });

            // Update current user stats
            if (currentUserId && win !== null) {
                const userStats = leaderboardData[currentUserId] || { username: auth.currentUser.displayName, totalWins: 0, gamesPlayed: 0 };
                userStats.gamesPlayed++;
                if (win) userStats.totalWins++;
                set(ref(db, 'leaderboard/' + currentUserId), userStats);
            }
        }
    }).catch((error) => {
        console.error("Error fetching leaderboard: ", error);
    });
}
