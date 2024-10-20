// Function to load recent game from localStorage
function loadRecentGame() {
    const recentGame = JSON.parse(localStorage.getItem('recentGame'));
    const container = document.getElementById('recent-container');
    container.innerHTML = ''; // Clear previous content

    if (!recentGame) {
        const noGames = document.createElement('p');
        noGames.textContent = 'No games found';
        container.appendChild(noGames);
        return;
    }

    const gameDiv = document.createElement('div');
    gameDiv.classList.add('recent-game');

    const gameBanner = document.createElement('img');
    gameBanner.src = recentGame.banner;
    gameBanner.alt = recentGame.title + " Banner";
    gameDiv.appendChild(gameBanner);

    const gameTitle = document.createElement('h2');
    gameTitle.textContent = recentGame.title;
    gameDiv.appendChild(gameTitle);

    const gameDescription = document.createElement('p');
    gameDescription.textContent = recentGame.description;
    gameDiv.appendChild(gameDescription);

    container.appendChild(gameDiv);
}

// Function to clear recent game from localStorage
function clearRecentGame() {
    localStorage.removeItem('recentGame');
    loadRecentGame(); // Reload to show "No games found"
}

document.getElementById('clear-button').addEventListener('click', clearRecentGame);

// Load recent game on page load
window.onload = loadRecentGame;
