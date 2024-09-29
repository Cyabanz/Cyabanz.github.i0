// Theme switcher
document.addEventListener('DOMContentLoaded', function() {
  function theme(name) {
      let root = document.querySelector(':root');
      root.className = name === 'default' ? '' : name;
      localStorage.setItem('theme', name);
  }  
  
  let savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    theme(savedTheme);
  }
  
  const select = document.getElementById('standard-select');
  select.addEventListener('change', function() {
    const option = select.options[select.selectedIndex];
    const themeName = option.getAttribute('data-theme');
    theme(themeName);
    localStorage.setItem('option', select.value);
  });

  const savedOption = localStorage.getItem('option');
  if (savedOption) {
    select.value = savedOption;
    const selectedOption = select.options[select.selectedIndex];
    const themeName = selectedOption.getAttribute('data-theme');
    theme(themeName);
  }
});

// Tab title and icon cloak function
function cloak(icon, title) {
  var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = icon;
  document.title = title;
  document.getElementsByTagName('head')[0].appendChild(link);
  
  localStorage.setItem('icon', icon);
  localStorage.setItem('title', title);
}

var savedIcon = localStorage.getItem('icon');
var savedTitle = localStorage.getItem('title');
if (savedIcon && savedTitle) {
  cloak(savedIcon, savedTitle);
} 

// Anti Close function
let savedAntiClose = localStorage.getItem('antiClose');
if (savedAntiClose === 'true') {
  document.getElementById('anti-close-checkbox').checked = true;
  antiClose();
}

document.getElementById('anti-close-checkbox').addEventListener('change', function() {
  if (this.checked) {
    localStorage.setItem('antiClose', 'true');
    antiClose();
  } else {
    localStorage.removeItem('antiClose');
  }
});

function antiClose() {
  if (document.getElementById('anti-close-checkbox').checked) {
    window.top.addEventListener('beforeunload', function(e) {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave?';
    });
  }
}

// About Blank function
let firstAboutBlank = localStorage.getItem('aboutBlank');
if (firstAboutBlank === 'true') {
  document.getElementById('about-blank').checked = true;
  aboutBlank();
}

document.getElementById('about-blank').addEventListener('change', function() {
  if (this.checked) {
    localStorage.setItem('aboutBlank', 'true');
    aboutBlank();
  } else {
    localStorage.removeItem('aboutBlank');
  }
});

function aboutBlank() {
  if (document.getElementById('about-blank').checked) {
    var windowUrl = window.location.href;
    var newWindow = window.open("about:blank", "_blank");
    if (newWindow != null) {
      var newContent = document.createElement("iframe");
      newContent.src = windowUrl;
      newContent.style.width = "100vw";
      newContent.style.height = "100vh";
      newContent.style.border = "none";
      newContent.style.position = "absolute";
      newContent.style.top = "0";
      newContent.style.left = "0";
      newWindow.document.body.appendChild(newContent);
      setTimeout(function() {
        window.location.replace("https://classroom.google.com/u/0/h");
      }, 100);
    }
  } else {
    localStorage.removeItem('aboutBlank');
    window.close();
  }
}
