fetch("/js/json/config.json") // Assuming that your config.json file is in the "js/json" directory
  .then(function (response) {
    return response.json(); // Parse the JSON data
  })
  .then(function (config) {
    fetch("/js/json/games.json").then(function (response) {
      response.json().then(function (fusion) {
        fusion.forEach(function (game) {
          const cards = document.getElementById("card-container");
          const card = document.createElement("div");
          const innerdiv = document.createElement("div");
          card.setAttribute("class", "card");
          const gametext = document.createElement("h3");
          const gameimg = document.createElement("img");
          const gamedesc = document.createElement("p");
          const wrapper = document.createElement("a");
          gametext.innerText = game.name;
          gametext.setAttribute("id", "h3-search");

          const limitdesc =
            game.description.slice(0, 83) +
            (game.description.length > 83 ? "..." : "");
          gamedesc.innerText = limitdesc;

          gamedesc.setAttribute("class", "card-description");
          const pin = document.createElement("i");
          pin.setAttribute("class", "fa-solid fa-location-pin");
          wrapper.href = game.href;
          pin.style.fontSize = "14px";
          gameimg.src = game.img;
          cards.appendChild(wrapper);
          wrapper.appendChild(card);
          wrapper.style.textDecoration = "none"; // remove the stupid underline since its a link
          card.appendChild(innerdiv);
          card.prepend(gameimg); // puts at top of inside div, append puts at bottom
          innerdiv.appendChild(gametext);
          innerdiv.appendChild(gamedesc);
          card.appendChild(pin);
          wrapper.addEventListener("click", function () {
            setgame(game.embed);
          });
          function setgame(embed) {
            localStorage.setItem("game-embed", config.fusion_embed + embed);
          }
        });
      });
    });
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
