// Set random favicon and default title
let originalTitle = document.title;
const newTabTitle = "New Tab";
const favicons = [
  '/assets/icons/Blue.png',
  '/assets/icons/Coral.png',
  '/assets/icons/Green.png',
  '/assets/icons/Orange.png',
  '/assets/icons/Pink.png',
  '/assets/icons/Teal.png',
  '/assets/icons/Yellow.png',
];

const blankFavicon = 'data:image/x-icon;,'; 

const toggleCheckbox = document.getElementById("toggleCheckbox");

const checkboxState = localStorage.getItem("checkboxState");

if (checkboxState === "true") {
  toggleCheckbox.checked = true;
}

toggleCheckbox.addEventListener('change', () => {
  localStorage.setItem("checkboxState", toggleCheckbox.checked);
  handleVisibilityChange();
  paintball();
});

function handleVisibilityChange() {
  const faviconElement = document.querySelector("link[rel='icon']");
  
  const clickoffCloakerOn = toggleCheckbox.checked;
  
  if (clickoffCloakerOn) {
    if (document.hidden) {
      document.title = newTabTitle;
      faviconElement.href = blankFavicon;
    } else {
      document.title = originalTitle;
      faviconElement.href = favicons[Math.floor(Math.random() * favicons.length)];
    }
  }
}

document.addEventListener("visibilitychange", handleVisibilityChange);

window.onload = () => {
  const faviconElement = document.querySelector("link[rel='icon']");
  
  if (!document.hidden) {
    faviconElement.href = favicons[Math.floor(Math.random() * favicons.length)];
  }
};

document.getElementById("page-favicon").addEventListener("input", (event) => {
  const faviconElement = document.querySelector("link[rel='icon']");
  const faviconInput = event.target.value;

  if (faviconInput) {
    faviconElement.href = faviconInput;
  } else {
    faviconElement.href = favicons[Math.floor(Math.random() * favicons.length)];
  }
});

// Custom Cursor
document.addEventListener("DOMContentLoaded", () => {
  const cursorSelect = document.getElementById("custom-cursor");
  const cursors = {
    wand: {
      default: "url('/assets/cursors/Magic/pointer.png'), auto",
      link: "url('/assets/cursors/Magic/link.png'), pointer",
    },
    geo: {
      default: "url('/assets/cursors/Geometry-Dash/pointer.png'), auto",
      link: "url('/assets/cursors/Geometry-Dash/link.png'), pointer",
    },
    halo: {
      default: "url('/assets/cursors/Halo/pointer.png'), auto",
      link: "url('/assets/cursors/Halo/link.png'), pointer",
    },
    tt: {
      default: "url('/assets/cursors/TT/pointer.png'), auto",
      link: "url('/assets/cursors/TT/link.png'), pointer",
    },
    harley: {
      default: "url('/assets/cursors/Harley/pointer.png'), auto",
      link: "url('/assets/cursors/Harley/link.png'), pointer",
    },
  };

  const applyCursor = (cursorType) => {
    let cursorStyle = document.getElementById("dynamic-cursor-style");
    if (!cursorStyle) {
      cursorStyle = document.createElement("style");
      cursorStyle.id = "dynamic-cursor-style";
      document.head.appendChild(cursorStyle);
    }
  
    const { default: defaultCursor, link: linkCursor } = cursors[cursorType] || cursors.wand;
  
    cursorStyle.textContent = `* { cursor: ${defaultCursor} !important; } a, button, img { cursor: ${linkCursor} !important; }`;
  
    if (localStorage.getItem('selectedCursor') !== cursorType && isSFXEnabled()) {
      const sound = new Audio('assets/sfx/dragonvale-vaultofabundance.mp3');
      sound.play();
    }
  };  

  const savedCursor = localStorage.getItem('selectedCursor') || 'wand';
  applyCursor(savedCursor);
  cursorSelect.value = savedCursor;

  cursorSelect.addEventListener("change", (event) => {
    const selectedCursor = event.target.value;
    applyCursor(selectedCursor);
    localStorage.setItem('selectedCursor', selectedCursor);
  });
});

// Sounds

// Save the state of the toggleSFX checkbox
const toggleSFX = document.getElementById("toggleSFX");

// Retrieve the saved state from localStorage
const savedSFXState = localStorage.getItem("sfxState");

if (savedSFXState === "true") {
  toggleSFX.checked = true;
} else {
  toggleSFX.checked = false;
}

// Event listener to save the state when it changes
toggleSFX.addEventListener('change', () => {
  localStorage.setItem("sfxState", toggleSFX.checked.toString());
});

// Function to check if SFX is enabled
function isSFXEnabled() {
  return toggleSFX.checked;
}

// Play sound effect when required
function explode() {
  if (isSFXEnabled()) {
    const audio = new Audio('/assets/sfx/roblox-explosion.mp3');
    audio.play();
  }
}

function start() {
  if (isSFXEnabled()) {
    const audio = new Audio('/assets/sfx/geometry-start.mp3');
    audio.play();
  }
}

function paintball() {
  if (isSFXEnabled()) {
    const audio = new Audio('/assets/sfx/roblox-paintball.mp3');
    audio.play();
  }
}

function bass() {
  if (isSFXEnabled()) {
    const audio = new Audio('/assets/sfx/roblox-bass.mp3');
    audio.play();
  }
}

function badge() {
  if (isSFXEnabled()) {
    const audio = new Audio('/assets/sfx/roblox-badge.mp3');
    audio.play();
  }
}

function chime() {
  if (isSFXEnabled()) {
    const audio = new Audio('/assets/sfx/roblox-chime.mp3');
    audio.play();
  }
}

// Additional Sound Effects with SFX toggle check
function playWarzoneKill() {
  if (isSFXEnabled()) {
    const audio = new Audio('/assets/sfx/warzone-kill.mp3');
    audio.play();
  }
}

function playFNFKoshort() {
  if (isSFXEnabled()) {
    const audio = new Audio('/assets/sfx/fnf-koshort.mp3');
    audio.play();
  }
}

// Cloaked Tab

const toggleButton = document.getElementById("cloakTab");
let newTab = null;

toggleButton.addEventListener("click", () => {
  if (newTab && !newTab.closed) {
    newTab.close();
    newTab = null;
  } else {
    newTab = window.open("about:blank", "_blank");
    const iframeContent = 
      `<style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        iframe { width: 100%; height: 100%; border: none; }
      </style>
      <iframe src="${window.location.href}"></iframe>`;
    newTab.document.write(iframeContent);
  }
});

// Panic Button

// Panic Button Logic
const form = document.querySelector('form');
const websiteInput = document.querySelector('#panic-site');
const keySelect = document.querySelector('#panic-key');
const clickSound = new Audio('/assets/sfx/fnf-koshort.mp3');

const savedWebsiteUrl = localStorage.getItem('websiteUrl');
const savedKey = localStorage.getItem('key');
let currentKeyListener = null;

// Load saved settings on page load
if (savedWebsiteUrl && savedKey) {
  websiteInput.value = savedWebsiteUrl;
  keySelect.value = savedKey;

  currentKeyListener = function(event) {
    if (event.key === savedKey) {
      window.open("https://" + savedWebsiteUrl, '_blank');
      playWarzoneKill(); // Play panic sound
    }
  };
  window.addEventListener('keydown', currentKeyListener);
}

// Save changes to localStorage and update the key listener
document.addEventListener('change', function(event) {
  if (event.target === keySelect || event.target === websiteInput) {
    const websiteUrl = websiteInput.value.trim();
    const key = keySelect.value.trim();

    if (websiteUrl && key) {
      // Remove previous key listener if it exists
      if (currentKeyListener) {
        window.removeEventListener('keydown', currentKeyListener);
      }

      // Save new values to localStorage
      localStorage.setItem('websiteUrl', websiteUrl);
      localStorage.setItem('key', key);

      // Set new key listener
      currentKeyListener = function(event) {
        if (event.key === key) {
          window.open("https://" + websiteUrl, '_blank');
        }
      };
      window.addEventListener('keydown', currentKeyListener);

      playFNFKoshort(); // Play sound when settings are saved
    }
  }
});

// Themes

const buttonClickSound = new Audio('/assets/sfx/warzone-kill.mp3');

function playButtonClickSound() {
  if (isSFXEnabled()) {
    buttonClickSound.play();
  }
}

function setTheme(theme) {
  playButtonClickSound();
  document.body.setAttribute("theme", theme);
  document.body.style = '';
  localStorage.setItem('selectedTheme', theme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme) {
    document.body.setAttribute("theme", savedTheme);
  }
}

document.querySelectorAll('.themesbtn').forEach(button => {
  button.addEventListener('click', () => {
    const theme = button.getAttribute('data-theme');
    setTheme(theme);
  });
});

loadTheme();

// Tab Title Cloaker

document.addEventListener("DOMContentLoaded", () => {
  const inputBox = document.getElementById("page-title");

  // Fetch the initial title from the <head> section
  const defaultTitle = document.title;

  // Add event listener to update tab name dynamically
  inputBox.addEventListener("input", () => {
      const newTitle = inputBox.value.trim();
      document.title = newTitle || defaultTitle;
  });
});

function toggleFullscreen() {
  let elem = document.querySelector("#game-frame");
  
  if (!document.fullscreenElement) {
  elem.requestFullscreen().catch((err) => {
  alert(
    `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
  );
  });
  } else {
  document.exitFullscreen();
  }
  }

  function togglePopup() {
    var popup = document.getElementById('popup');
    if (popup.style.display === 'none' || popup.style.display === '') {
      popup.style.display = 'block'; // Make it visible
      popup.classList.add('slide-in'); // Add the slide-in animation
      document.getElementById('loginwindow').style.display = 'none';
      bass();
    } else {
      popup.style.display = 'none'; // Hide the popup
      explode();
    }
  }  

function togglePopupLOGIN() {
  var popup = document.getElementById('loginwindow');
  if (popup.style.display === 'none' || popup.style.display === '') {
    popup.style.display = 'block'; // Make it visible
    popup.classList.add('slide-in'); // Add the slide-in animation
    document.getElementById('popup').style.display = 'none';
    badge();
  } else {
    popup.style.display = 'none'; // Hide the popup
    explode();
  }
}

let currentSlideIndex = 0;
const slides = document.getElementsByClassName('slide');
const totalSlides = slides.length;

document
  .querySelector('.next-button')
  .addEventListener('click', showNextSlide);

document
  .querySelector('.prev-button')
  .addEventListener('click', showPrevSlide);

function updateSlideVisibility() {
  for (const slide of slides) {
    slide.classList.remove('slide--visible');
    slide.classList.add('slide--hidden');
  }
  slides[currentSlideIndex].classList.add('slide--visible');
}

function showNextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
  updateSlideVisibility();
}

function showPrevSlide() {
  currentSlideIndex =
    (currentSlideIndex - 1 + totalSlides) % totalSlides;
  updateSlideVisibility();
}