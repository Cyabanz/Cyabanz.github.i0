// Function to display games
function displayGames(games) {
    const container = document.getElementById('games-container');
    container.innerHTML = ''; // Clear previous content

    if (games.length === 0) {
        const noResults = document.createElement('p');
        noResults.textContent = 'No results found';
        noResults.classList.add('no-results');
        container.appendChild(noResults);
        return;
    }

    games.forEach(game => {
        const bannerWrapper = document.createElement('div');
        bannerWrapper.classList.add('banner_wrapper');

        const link = document.createElement('a');
        link.href = game.link; // Set the link URL
        link.target = '_blank'; // Open in a new tab

        const banner = document.createElement('div');
        banner.classList.add('banner');
        const bannerImage = document.createElement('img');
        bannerImage.src = game.banner;
        bannerImage.alt = "Banner Game";
        bannerImage.classList.add('banner__image');
        banner.appendChild(bannerImage);
        bannerWrapper.appendChild(banner);

        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('card__wrapper');

        const card = document.createElement('div');
        card.classList.add('card');

        const cardInfo = document.createElement('div');
        cardInfo.classList.add('card__info');

        const cardAvatar = document.createElement('img');
        cardAvatar.src = game.avatar;
        cardAvatar.alt = "Game Avatar";
        cardAvatar.classList.add('card__avatar');

        // Add click event to the entire card (or you can change this to just the image, title, etc.)
        bannerWrapper.addEventListener('click', () => {
            addGameToRecent(game); // Add to recent games when clicked
        });

        const titleDiv = document.createElement('div');
        const titleSpan = document.createElement('span');
        titleSpan.textContent = game.title;
        const descriptionP = document.createElement('p');
        descriptionP.textContent = game.description;

        titleDiv.appendChild(titleSpan);
        titleDiv.appendChild(descriptionP);
        cardInfo.appendChild(cardAvatar);
        cardInfo.appendChild(titleDiv);
        card.appendChild(cardInfo);
        card.appendChild(document.createElement('button').appendChild(document.createTextNode('Get')));
        cardWrapper.appendChild(card);
        bannerWrapper.appendChild(cardWrapper);
        link.appendChild(bannerWrapper); // Add the bannerWrapper to the link
        container.appendChild(link); // Add the link to the container
    });
}

// Function to add game to recent list in local storage
function addGameToRecent(game) {
    const recentGames = JSON.parse(localStorage.getItem('recentGames')) || [];
    
    // Check for duplicates by title
    if (!recentGames.some(existingGame => existingGame.title === game.title)) {
        recentGames.push(game); // Add unique game
        localStorage.setItem('recentGames', JSON.stringify(recentGames));
    }
}
