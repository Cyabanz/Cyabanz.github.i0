// Open About Blank
function openBLANK(url) {
    if (!url) {
        alert("No URL provided!");
        return;
    }

    var win = window.open();

    if (win) {
        var iframe = win.document.createElement('iframe');
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.src = url;

        win.document.body.style.margin = "0px";
        win.document.body.appendChild(iframe);
        win.document.title = "New Tab";
    } else {
        alert("Popup blocked! Please allow popups for this website.");
    }
}

// Share On Socials
function shareOnTwitter() {
    var pageUrl = window.location.href;
    var text = "Yoo play this game from TTGames! " + pageUrl;
    var encodedText = encodeURIComponent(text);
    var twitterShareUrl = "https://twitter.com/intent/tweet?text=" + encodedText;
    window.open(twitterShareUrl, "_blank");
}

function shareOnFacebook() {
    var pageUrl = window.location.href;
    var quote = "I played hundreds of games and watched entertaining animations over at " + pageUrl;
    var encodedUrl = encodeURIComponent(pageUrl);
    var encodedQuote = encodeURIComponent(quote);
    var facebookShareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl + "&quote=" + encodedQuote;
    window.open(facebookShareUrl, "_blank");
}

function shareOnReddit() {
    var pageUrl = window.location.href;
    var title = "Come check out this awesome unblocked gaming Website: TTGames!";
    var encodedUrl = encodeURIComponent(pageUrl);
    var encodedTitle = encodeURIComponent(title);
    var redditShareUrl = "https://www.reddit.com/submit?url=" + encodedUrl + "&title=" + encodedTitle;
    window.open(redditShareUrl, "_blank");
}

function shareOnTikTok() {
    var pageUrl = window.location.href;
    var message = "Check out this awesome page: " + pageUrl;
    var encodedUrl = encodeURIComponent(pageUrl);
    var encodedMessage = encodeURIComponent(message);
    var tiktokShareUrl = "https://www.tiktok.com/upload?source=" + encodedUrl + "&message=" + encodedMessage;
    window.open(tiktokShareUrl, "_blank");
}

// Hide Comments
function openComments() {
    var commentContainer = document.getElementById('Comment-Container');
    if (commentContainer.style.display == 'none') {
        commentContainer.style.display = 'inline-block';
    } else {
        commentContainer.style.display = 'none';
    }
}

// Search Games
function search_game() {
    let input = document.getElementById("Find-Games").value.toLowerCase();
    let x = document.getElementsByClassName("game");

    for (let i = 0; i < x.length; i++) {
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display = "none";
        } else {
            x[i].style.display = "block";
        }
    }
}

// Search Game Category

function search_game_category() {
    var category = document.getElementById("Game-Category").value;
    var images = document.getElementsByClassName("game");
    
    for (var i = 0; i < images.length; i++) {
      if (images[i].getAttribute("data-category") === category || category === "") {
        images[i].style.display = "block";
      } else {
        images[i].style.display = "none";
      }
    }
}