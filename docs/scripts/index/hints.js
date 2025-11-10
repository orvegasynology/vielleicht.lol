var hint = [
  "Vielleicht is mobile friendly. You can view on the go!",
  "Various easter eggs can be found throughout the site, be sure to hover over EVERYTHING!",
  "Vielleicht is best viewed on a PC."
];

document.getElementById("hint").innerHTML =
  hint[Math.floor(Math.random() * hint.length)];