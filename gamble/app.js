// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

// Initialize Firebase
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

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

// Select elements
const googleLoginButton = document.getElementById("googleLogin");
const gameControls = document.getElementById("gameControls");
const balanceDisplay = document.getElementById("balance");
const betAmountSlider = document.getElementById("betAmount");
const betValueDisplay = document.getElementById("betValue");
const placeBetButton = document.getElementById("placeBet");
const messageDisplay = document.getElementById("message");

// Set initial balance and default bet value
let balance = 1000;
balanceDisplay.textContent = balance;

// Update displayed bet value
betAmountSlider.addEventListener('input', () => {
    betValueDisplay.textContent = betAmountSlider.value;
});

// Google sign-in function
googleLoginButton.addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // Successful login
            const user = result.user;
            console.log("User logged in:", user);
            gameControls.style.display = "block";
            loadUserBalance(user.uid); // Load the user's balance from the database
        })
        .catch((error) => {
            console.error("Login failed:", error);
            messageDisplay.textContent = "Login failed: " + error.message;
        });
});

// Load user balance from the database
function loadUserBalance(userId) {
    const userRef = ref(database, 'users/' + userId);
    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            balance = snapshot.val().balance;
        } else {
            balance = 1000; // Default balance
            set(userRef, { balance: balance }); // Create user in database
        }
        balanceDisplay.textContent = balance;
    }).catch((error) => {
        console.error("Error loading balance:", error);
    });
}

// Place bet functionality
placeBetButton.addEventListener("click", () => {
    const betAmount = parseInt(betAmountSlider.value);
    if (betAmount > balance) {
        messageDisplay.textContent = "You cannot bet more than your current balance.";
        return;
    }
    const win = Math.random() < 0.5; // Simulating a 50% win rate
    if (win) {
        balance += betAmount; // User wins
        messageDisplay.textContent = "You won! Current Balance: " + balance;
    } else {
        balance -= betAmount; // User loses
        messageDisplay.textContent = "You lost! Current Balance: " + balance;
    }
    balanceDisplay.textContent = balance;
    updateUserBalance(auth.currentUser.uid, balance); // Update balance in database
});

// Update user's balance in the database
function updateUserBalance(userId, newBalance) {
    const userRef = ref(database, 'users/' + userId);
    set(userRef, { balance: newBalance }).catch((error) => {
        console.error("Error updating balance:", error);
    });
}

// Logout function (optional)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log("User is signed in:", user);
        googleLoginButton.style.display = "none"; // Hide login button
    } else {
        // User is signed out
        console.log("No user is signed in.");
        gameControls.style.display = "none"; // Hide game controls
        googleLoginButton.style.display = "block"; // Show login button
    }
});
