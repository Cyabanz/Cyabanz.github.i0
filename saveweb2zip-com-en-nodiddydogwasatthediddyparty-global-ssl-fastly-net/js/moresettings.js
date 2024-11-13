// Define some varibles for later
const origin = localStorage.getItem('instance');
const cdn = localStorage.getItem('cdn');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const onLoadData = urlParams.get('onload');

const base = document.createElement('base');
base.href = location.origin + path.replace(path.split('\\').pop().split('/').pop(), '');
document.head.appendChild(base);

// If we do not have the origin var, we make it
if (!origin) {
  localStorage.setItem('instance', base.href);
  location.reload();
}



const instance = encodeURIComponent(origin.replace(location.origin, ''));

// If we have onLoadData, we run it now
window.onload = () => {
  if (onLoadData) {
    eval(onLoadData);
  }
};

// If we have any errors, we will log it
window.onerror = (e) => {
  throw new Error(e);
};

// Collect Tab Cloak data from local storage
var tab = localStorage.getItem('tab');
if (tab) {
  try {
    // Parse the data, it is in JSON
    var tabData = JSON.parse(tab);
  } catch {
    var tabData = {};
  }
} else {
  var tabData = {};
}

// Set the Tab title if the Tab cloak data is there
if (tabData.title) {
  document.title = tabData.title;
}

// Set the Tab icon if the Tab cloak data is there
if (tabData.icon) {
  document.querySelector('link[rel="icon"]').href = tabData.icon;
}

var tab = localStorage.getItem("tab");

if (tab) {
  try {
    var tabData = JSON.parse(tab);
    if (tabData.theme) {
      var styleTag = document.getElementById("theme-style");
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "theme-style";
        document.body.appendChild(styleTag);
      }
      switch (tabData.theme) {
        case "dark":
          styleTag.innerHTML = "body { background-color: #121212; color: #e0e0e0; }";
          break;
        case "light":
          styleTag.innerHTML = "body { background-color: #ffffff; color: #000000; }";
          break;
        default:
          styleTag.innerHTML = "";
      }


    }
  } catch {
    // Handle or ignore parsing error
  }
}

