// === ONIONRING-VARIABLES ===

var sites = [];

fetch('members.json')
    .then(response => response.json())
    .then(data => {
        sites = data.map(member => member.url);

        window.ringMembers = data;
    })

// Ring settings
var ringName = 'Mobring';
var ringID = 'mobring';

var useIndex = true;
var indexPage = 'https://vielleicht.lol/mobring';

var useRandom = false;


//insipred by https://dokode.moe/pokering
