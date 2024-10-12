fetch("/js/json/config.json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(function (config) {
        fetch("/js/json/games.json")
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(function (fusion) {
                fusion.forEach(function (game) {
                    const cards = document.getElementById("card-container");
                    const card = document.createElement("a");
                    const innerdiv = document.createElement("div");
                    card.setAttribute("class", "card");
                    const gametext = document.createElement("h3");
                    const gameimg = document.createElement("img");
                    const gamedesc = document.createElement("p");
                    const wrapper = document.createElement("div");
                    const pin = document.createElement("button");
                    const pinlogo = document.createElement("i");

                    gametext.innerText = game.name;
                    gametext.setAttribute("id", "h3-search");
                    gamedesc.innerText = game.description;
                    gamedesc.setAttribute("class", "card-description");
                    wrapper.setAttribute("class", "card-wrapper");

                    pin.title = "Pin game";
                    pin.appendChild(pinlogo);
                    pinlogo.setAttribute("class", "fa-solid fa-location-pin");
                    pin.style.fontSize = "14px";
                    pin.addEventListener("click", function () {
                        setpin(game.id);
                        window.location.reload();
                    });

                    function setpin(param) {
                        const pins = JSON.parse(localStorage.getItem("pins")) || [];
                        if (pins.includes(param)) {
                            const index = pins.indexOf(param);
                            pins.splice(index, 1);
                        } else {
                            pins.push(param);
                        }
                        localStorage.setItem("pins", JSON.stringify(pins));
                        search();
                    }

                    const pins = JSON.parse(window.localStorage.getItem("pins")) || [];
                    if (pins.includes(game.id)) {
                        pinlogo.style.color = "#ff7558";
                        const pinned = document.getElementById("pinned");
                        pinned.prepend(wrapper);
                    } else {
                        pinlogo.style.color = "#fff";
                        cards.appendChild(wrapper);
                    }

                    gameimg.src = game.img;
                    card.href = "/#/play?" + game.id;
                    card.appendChild(innerdiv);
                    card.prepend(gameimg); // puts at top of inside div
                    innerdiv.appendChild(gametext);
                    innerdiv.appendChild(gamedesc);
                    wrapper.appendChild(pin);
                    pin.setAttribute("id", "pin_game");
                    wrapper.prepend(card);

                    card.addEventListener("click", function () {
                        setgame(game.embed);
                    });

                    function setgame(embed) {
                        const embedURL = game.raw_embed ? embed : config.fusion_embed + embed;
                        localStorage.setItem("game-embed", embedURL);
                    }
                });
            })
            .catch(function (error) {
                console.error("Error fetching games.json:", error);
            });
    })
    .catch(function (error) {
        console.error("Error fetching config.json:", error);
    });

function search() {
    var input = document.getElementById("card-lookup").value.toLowerCase();
    var cards = document.getElementsByClassName("card");

    for (var i = 0; i < cards.length; i++) {
        var h3 = cards[i].querySelector("h3").textContent.toLowerCase();
        if (h3.includes(input)) {
            cards[i].style.display = "flex";
        } else {
            cards[i].style.display = "none";
        }
    }
}

document.getElementById("card-lookup").addEventListener("input", search);
window.addEventListener("load", function () {
    search();
});

document.addEventListener("DOMContentLoaded", function () {
    const likeButtons = document.querySelectorAll('.like-btn');
    const dislikeButtons = document.querySelectorAll('.dislike-btn');

    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gameId = button.getAttribute('data-game-id');
            updateLikeCount(gameId);
        });
    });

    dislikeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gameId = button.getAttribute('data-game-id');
            updateDislikeCount(gameId);
        });
    });
});

function updateLikeCount(gameId) {
    const gameRef = firebase.database().ref('games/' + gameId);
    gameRef.transaction((game) => {
        if (game) {
            game.likes = (game.likes || 0) + 1; // Increment like count
        }
        return game;
    });
}

function updateDislikeCount(gameId) {
    const gameRef = firebase.database().ref('games/' + gameId);
    gameRef.transaction((game) => {
        if (game) {
            game.dislikes = (game.dislikes || 0) + 1; // Increment dislike count
        }
        return game;
    });
}

