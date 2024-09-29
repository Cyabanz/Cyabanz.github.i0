if (window.location.href.startsWith(window.origin + "/#/play?")) {
  const docbody = document.body;
  document.title = "Classes";
  const iframe = document.createElement("iframe");
  const fusion = document.getElementById("fusion");
  docbody.style.backgroundColor = "#000";
  docbody.style.height = "100%";
  docbody.style.width = "100%";
  docbody.style.position = "absolute";
  docbody.style.margin = "0";
  docbody.style.padding = "0";
  fusion.innerHTML = "";
  iframe.style.border = "0";
  iframe.style.position = "absolute";
  iframe.style.height = "100%";
  iframe.style.width = "100%";
  document.body.prepend(iframe);
  iframe.src = localStorage.getItem("game-embed");
  document.querySelector("link[rel='icon']").href = "/img/class.png";
}
