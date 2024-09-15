fetch("/js/json/config.json") 
  .then(function (response) {
    return response.json();
  })
  .then(function (config) {
    fetch("/js/json/games.json").then(function (response) {
      response.json().then(function (fusion) {
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
            const pinned = document.getElementById("pinned")
            pinned.prepend(wrapper);
          } else {
            pinlogo.style.color = "#fff";
            const cards = document.getElementById("card-container");
            cards.appendChild(wrapper);
          }

          gameimg.src = game.img;
          card.href = "/#/play?" + game.id;
          card.appendChild(innerdiv);
          card.prepend(gameimg); // puts at top of inside div, append puts at bottom
          innerdiv.appendChild(gametext);
          innerdiv.appendChild(gamedesc);
          wrapper.appendChild(pin);
          pin.setAttribute("id", "pin_game");
          wrapper.prepend(card);
          card.addEventListener("click", function () {
            setgame(game.embed);
          });
          if (game.raw_embed) {
            function setgame(embed) {
              localStorage.setItem("game-embed", embed);
            }
          } else {
            function setgame(embed) {
              localStorage.setItem("game-embed", config.fusion_embed + embed);
            }
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
