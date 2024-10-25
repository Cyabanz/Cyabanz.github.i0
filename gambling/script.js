// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get, update } from "firebase/database";

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
const auth = getAuth();
const db = getDatabase();

const provider = new GoogleAuthProvider();
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const usernameDisplay = document.getElementById('usernameDisplay');
const coinsDisplay = document.getElementById('coinsDisplay');
const gameDiv = document.getElementById('gameDiv');
const betAmount = document.getElementById('betAmount');
const betAmountDisplay = document.getElementById('betAmountDisplay');
const playGameBtn = document.getElementById('playGameBtn');
const gameResult = document.getElementById('gameResult');
const animationDiv = document.getElementById('animationDiv');

// Initialize coins
let coins = 1000;

// Login function
loginBtn.onclick = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            usernameDisplay.innerText = user.displayName;
            loginBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
            userInfo.classList.remove('hidden');
            gameDiv.classList.remove('hidden');
            loadUserData(user.uid);
        })
        .catch((error) => {
            console.error("Login failed:", error);
        });
};

// Logout function
logoutBtn.onclick = () => {
    signOut(auth).then(() => {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        userInfo.classList.add('hidden');
        gameDiv.classList.add('hidden');
        coinsDisplay.innerText = "0";
    });
};

// Load user data
function loadUserData(userId) {
    const userRef = ref(db, 'users/' + userId);
    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            coins = snapshot.val().coins;
        } else {
            set(userRef, { coins: coins });
        }
        coinsDisplay.innerText = coins;
    });
}

// Update user data
function updateUserCoins(userId) {
    const userRef = ref(db, 'users/' + userId);
    update(userRef, { coins: coins });
}

// Handle bet amount change
betAmount.oninput = () => {
    betAmountDisplay.innerText = betAmount.value;
};

// Play game function
playGameBtn.onclick = () => {
    const bet = parseInt(betAmount.value);
    if (coins < bet) {
        alert("You don't have enough coins!");
        return;
    }
    
    const result = Math.random() < 0.5 ? 'win' : 'lose'; // Simple win/lose logic
    if (result === 'win') {
        coins += bet;
        showResult(true);
    } else {
        coins -= bet;
        showResult(false);
    }
    
    updateUserCoins(auth.currentUser.uid);
};

// Show result with animation
function showResult(isWin) {
    gameResult.innerText = isWin ? "You Win!" : "You Lose!";
    gameResult.classList.remove('hidden');
    const animation = document.createElement('div');
    animation.classList.add('animation', isWin ? 'win' : 'lose', 'show');
    animation.innerText = isWin ? "🎉 You Win! 🎉" : "💔 You Lose! 💔";
    animationDiv.appendChild(animation);
    animation.classList.add('show');

    // Remove animation after 2 seconds
    setTimeout(() => {
        animation.classList.remove('show');
        setTimeout(() => {
            animationDiv.removeChild(animation);
        }, 500);
    }, 2000);
}

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        usernameDisplay.innerText = user.displayName;
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userInfo.classList.remove('hidden');
        gameDiv.classList.remove('hidden');
        loadUserData(user.uid);
    } else {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        userInfo.classList.add('hidden');
        gameDiv.classList.add('hidden');
        coinsDisplay.innerText = "0";
    }
});
