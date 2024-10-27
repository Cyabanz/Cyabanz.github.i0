// game.js

// Declare global variables for game logic
let dealerHand = [];
let playerHand = [];
let isGameOver = false;

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
    return cardValue > 10 ? 10 : cardValue; // Face cards are worth 10
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
