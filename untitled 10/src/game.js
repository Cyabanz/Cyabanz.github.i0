window.hit = function() {
    if (!isGameOver) {
        playerHand.push(drawCard());
        if (calculateHandTotal(playerHand) > 21) {
            isGameOver = true;
            document.getElementById("result").innerText = "You bust! Dealer wins.";
            updateBalance(false); // Lose the bet
            updateButtonStates(); // Update button states
        }
        updateUI();
    }
};

window.stand = function() {
    isGameOver = true;
    dealerPlay();
    updateButtonStates(); // Update button states after standing
};

function updateButtonStates() {
    // Disable the Hit and Stand buttons when the game is over
    document.getElementById("hitButton").disabled = isGameOver;
    document.getElementById("standButton").disabled = isGameOver;
}

// Reset game function updated to enable buttons
function resetGame() {
    dealerHand = [];
    playerHand = [];
    isGameOver = false;
    document.getElementById("result").innerText = "";
    document.getElementById("hitButton").style.display = "inline"; // Show Hit button
    document.getElementById("standButton").style.display = "inline"; // Show Stand button
    updateButtonStates(); // Enable buttons
}

// Ensure buttons are enabled on game start
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
