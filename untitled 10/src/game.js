// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, ref, set, get, update, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// Your web app's Firebase configuration
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
const provider = new GoogleAuthProvider();

let currentUserId = null;
let currentUserName = null;
let balance = 1000; // Initial balance for the user
let dealerHand = [];
let playerHand = [];
let isGameOver = false;
let wins = 0;

// Check user authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserId = user.uid;
        currentUserName = user.displayName; // Get the user's display name
        document.getElementById("loggedInMessage").innerText = "Welcome, " + currentUserName;
        document.getElementById("loginButton").style.display = "none"; // Hide login button
        document.getElementById("playButton").style.display = "block"; // Show play button
        getUserData();
        loadLeaderboard(); // Load leaderboard on login
    } else {
        currentUserId = null;
        currentUserName = null;
        document.getElementById("loggedInMessage").innerText = "Please log in to play.";
        document.getElementById("loginButton").style.display = "block"; // Show login button
        document.getElementById("playButton").style.display = "none"; // Hide play button
    }
});

// Function to get user data from Firebase
function getUserData() {
    const userRef = ref(db, 'users/' + currentUserId);
    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            balance = snapshot.val().balance || 1000; // Get balance from user data
            wins = snapshot.val().wins || 0; // Get wins from user data
            document.getElementById("balance").innerText = "Your Balance: $" + balance;
        }
    });
}

// Function to sign in with Google
window.signIn = function() {
    signInWithPopup(auth, provider).then((result) => {
        const userRef = ref(db, 'users/' + result.user.uid);
        // Initialize user data if it doesn't exist
        get(userRef).then((snapshot) => {
            if (!snapshot.exists()) {
                set(userRef, { balance: balance, wins: wins, displayName: result.user.displayName }); // Save the user's display name
            }
        });
    }).catch((error) => {
        console.error("Error signing in:", error);
    });
};

// Function to start the Blackjack game
window.startGame = function() {
    if (!currentUserId) {
        alert("Please log in to play.");
        return;
    }

    const betAmount = parseInt(document.getElementById("betAmount").value);
    if (betAmount <= 0 || betAmount > balance) {
        alert("Invalid bet amount. Please choose a valid amount.");
        return;
    }

    resetGame();
    dealInitialCards();
    updateUI();
};

function resetGame() {
    dealerHand = [];
    playerHand = [];
    isGameOver = false;
    document.getElementById("result").innerText = "";
    document.getElementById("hitButton").style.display = "inline"; // Show Hit button
    document.getElementById("standButton").style.display = "inline"; // Show Stand button
}

function dealInitialCards() {
    playerHand.push(drawCard());
    playerHand.push(drawCard());
    dealerHand.push(drawCard());
    dealerHand.push(drawCard());
}

function drawCard() {
    const cardValue = Math.floor(Math.random() * 13) + 1; // 1 to 13
    return cardValue > 10 ? 10 : cardValue; // Face cards are 10
}

function updateUI() {
    document.getElementById("playerHand").innerText = "Your Hand: " + playerHand.join(", ") + " (Total: " + calculateHandTotal(playerHand) + ")";
    document.getElementById("dealerHand").innerText = "Dealer's Hand: " + dealerHand[0] + ", ?";
    document.getElementById("balance").innerText = "Your Balance: $" + balance;
}

function calculateHandTotal(hand) {
    let total = 0;
    let acesCount = 0;
    hand.forEach(card => {
        total += card;
        if (card === 1) acesCount++; // Count Aces
    });
    // Adjust for Aces
    while (total <= 11 && acesCount > 0) {
        total += 10;
        acesCount--;
    }
    return total;
}

window.hit = function() {
    if (!isGameOver) {
        playerHand.push(drawCard());
        if (calculateHandTotal(playerHand) > 21) {
            isGameOver = true;
            document.getElementById("result").innerText = "You bust! Dealer wins.";
            updateBalance(false); // Lose the bet
        }
        updateUI();
    }
};

window.stand = function() {
    isGameOver = true;
    dealerPlay();
};

function dealerPlay() {
    while (calculateHandTotal(dealerHand) < 17) {
        dealerHand.push(drawCard());
    }
    const playerTotal = calculateHandTotal(playerHand);
    const dealerTotal = calculateHandTotal(dealerHand);
    determineWinner(playerTotal, dealerTotal);
}

function determineWinner(playerTotal, dealerTotal) {
    document.getElementById("dealerHand").innerText = "Dealer's Hand: " + dealerHand.join(", ") + " (Total: " + dealerTotal + ")";
    if (dealerTotal > 21 || playerTotal > dealerTotal) {
        document.getElementById("result").innerText = "You win!";
        updateBalance(true); // Win the bet
        updateWins(); // Increment wins
    } else if (playerTotal < dealerTotal) {
        document.getElementById("result").innerText = "Dealer wins.";
        updateBalance(false); // Lose the bet
    } else {
        document.getElementById("result").innerText = "It's a tie!";
    }
}

function updateBalance(win) {
    const betAmount = parseInt(document.getElementById("betAmount").value);
    balance += win ? betAmount : -betAmount; // Update balance
    updateUserBalance();
}

function updateUserBalance() {
    const userRef = ref(db, 'users/' + currentUserId);
    update(userRef, { balance: balance }); // Update balance in Firebase
    document.getElementById("balance").innerText = "Your Balance: $" + balance;
}

function updateWins() {
    wins += 1;
    const userRef = ref(db, 'users/' + currentUserId);
    update(userRef, { wins: wins }); // Update wins in Firebase
    loadLeaderboard(); // Refresh leaderboard
}

// Function to load and display the leaderboard
function loadLeaderboard() {
    const leaderboardRef = query(ref(db, 'users'), orderByChild('wins'), limitToLast(10));
    get(leaderboardRef).then((snapshot) => {
        let leaderboardHTML = '<h3>Leaderboard</h3>';
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                leaderboardHTML += `<p>${userData.displayName || "Anonymous"}: ${userData.wins || 0} Wins</p>`;
            });
        } else {
            leaderboardHTML += '<p>No entries yet.</p>';
        }
        document.getElementById("leaderboard").innerHTML = leaderboardHTML; // Update leaderboard HTML
    });
}
