// Import Firebase functions (same as before)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, ref, set, get, update, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// Your web app's Firebase configuration (same as before)
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
let currentUserName = null; // New variable to store the user's display name
let balance = 1000; // Initial balance for the user
let dealerHand = [];
let playerHand = [];
let isGameOver = false;
let wins = 0; // Count player wins

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
        currentUserName = null; // Reset on logout
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

// Function to start the Blackjack game (same as before)
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

// Other game functions (resetGame, dealInitialCards, etc.) remain unchanged...

// Load the leaderboard
function loadLeaderboard() {
    const leaderboardRef = query(ref(db, 'users'), orderByChild('wins'), limitToLast(10));
    get(leaderboardRef).then((snapshot) => {
        const leaderboard = document.getElementById("leaderboard");
        leaderboard.innerHTML = "<h3>Leaderboard</h3>";
        if (snapshot.exists()) {
            const users = Object.entries(snapshot.val()).reverse(); // Get top 10
            users.forEach(([id, userData]) => {
                leaderboard.innerHTML += `<p>${userData.displayName || id}: ${userData.wins} Wins</p>`; // Use display name
            });
        } else {
            leaderboard.innerHTML += "<p>No entries yet.</p>";
        }
    });
}
