import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

// Firebase configuration
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
const provider = new GoogleAuthProvider();

// Game Variables
let deck = [];
let playerHand = [];
let dealerHand = [];

// Initialize Deck
const initializeDeck = () => {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    deck = [];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    deck = shuffle(deck);
};

// Shuffle Deck
const shuffle = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

// Deal Card
const dealCard = (hand) => {
    const card = deck.pop();
    hand.push(card);
    return card;
};

// Calculate Score
const calculateScore = (hand) => {
    let score = 0;
    let aces = 0;

    hand.forEach(card => {
        if (['Jack', 'Queen', 'King'].includes(card.value)) {
            score += 10;
        } else if (card.value === 'Ace') {
            aces++;
            score += 11; // initially count Ace as 11
        } else {
            score += parseInt(card.value);
        }
    });

    while (score > 21 && aces) {
        score -= 10;
        aces--;
    }

    return score;
};

// Display Hand
const displayHand = (hand, element) => {
    element.innerHTML = '';
    hand.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.textContent = `${card.value} of ${card.suit}`;
        element.appendChild(cardElement);
    });
};

// Start New Game
const startNewGame = () => {
    initializeDeck();
    playerHand = [];
    dealerHand = [];
    dealCard(playerHand);
    dealCard(dealerHand);
    dealCard(playerHand);
    dealCard(dealerHand);

    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('newGameBtn').style.display = 'none';
    updateDisplay();
};

// Update Display
const updateDisplay = () => {
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);
    displayHand(playerHand, document.getElementById('playerHand'));
    displayHand(dealerHand, document.getElementById('dealerHand'));

    if (playerScore > 21) {
        document.getElementById('message').textContent = "Bust! You lose.";
        document.getElementById('newGameBtn').style.display = 'block';
    } else if (dealerScore > 21) {
        document.getElementById('message').textContent = "Dealer busts! You win!";
        document.getElementById('newGameBtn').style.display = 'block';
    } else {
        document.getElementById('message').textContent = `Your Score: ${playerScore} | Dealer Score: ${dealerScore}`;
    }
};

// Event Listeners
document.getElementById('loginBtn').addEventListener('click', signInWithGoogle);
document.getElementById('logoutBtn').addEventListener('click', signOutUser);
document.getElementById('newGameBtn').addEventListener('click', startNewGame);

// Sign in with Google
const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("User signed in:", user);
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline';
        startNewGame();
    } catch (error) {
        console.error("Error signing in:", error);
    }
};

// Sign out function
const signOutUser = () => {
    signOut(auth).then(() => {
        console.log("User signed out.");
        document.getElementById('loginBtn').style.display = 'inline';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('gameArea').style.display = 'none';
        document.getElementById('message').textContent = '';
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
};

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in:", user);
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline';
        startNewGame();
    } else {
        console.log("No user is signed in.");
        document.getElementById('loginBtn').style.display = 'inline';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('gameArea').style.display = 'none';
        document.getElementById('message').textContent = '';
    }
});

// Deal Card with Animation
const dealCardWithAnimation = (hand, element) => {
    const card = dealCard(hand);
    const cardElement = document.createElement('div');
    cardElement.className = 'card deal'; // Add 'deal' class for animation
    cardElement.textContent = `${card.value} of ${card.suit}`;
    element.appendChild(cardElement);

    // Trigger reflow to apply the CSS class
    requestAnimationFrame(() => {
        cardElement.classList.remove('deal');
    });
};

// Modify how cards are dealt
const startNewGame = () => {
    initializeDeck();
    playerHand = [];
    dealerHand = [];
    dealCardWithAnimation(playerHand, document.getElementById('playerHand'));
    dealCardWithAnimation(dealerHand, document.getElementById('dealerHand'));
    dealCardWithAnimation(playerHand, document.getElementById('playerHand'));
    dealCardWithAnimation(dealerHand, document.getElementById('dealerHand'));
    updateDisplay();
};
