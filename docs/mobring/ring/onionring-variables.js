// onionring.js is made up of four files - onionring-widget.js, onionring-index.js, onionring-variables.js, and onionring.css
// licensed under the cooperative non-violent license (CNPL) v4+ (https://thufie.lain.haus/NPL.html)
// originally made by joey + mord of allium, last updated 2020-11-24

// === ONIONRING-VARIABLES ===

// full URLs of all sites in the ring
var sites = [
    'https://vielleicht.lol/' 
];

// detailed metadata for each site
var siteData = [
    {
        "url": "https://vielleicht.lol/",
        "websiteName": "Vielleicht",
        "name": "Leicht",
        "favs": "Tome, Reigen. join the webring pls",
        "buttonUrl": "assets/buttons/nobutton.png",
        "date": "2025-11-22"
    }
];

// name of the webring
var ringName = 'Mobring';

// unique ID of the widget
var ringID = 'mobring';

// should the widget include a link to an index page?
var useIndex = true;
var indexPage = 'https://vielleicht.lol/mobring';

// should the widget include a random button?
var useRandom = false;
