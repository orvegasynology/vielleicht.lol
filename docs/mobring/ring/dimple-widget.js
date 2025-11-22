var tag = document.getElementById(ringID); // find the widget on the page

if (tag) {
    let thisSite = window.location.href; // get the url of the site we're currently on
    let thisIndex = null;

    // go through the site list to see if this site is on it
    for (let i = 0; i < sites.length; i++) {
        if (thisSite.startsWith(sites[i])) {
            thisIndex = i;
            break;
        }
    }

    function randomSite() {
        let otherSites = sites.slice();
        otherSites.splice(thisIndex, 1);
        let randomIndex = Math.floor(Math.random() * otherSites.length);
        location.href = otherSites[randomIndex];
    }

    if (thisIndex == null) {
        tag.insertAdjacentHTML('afterbegin', `
            <div id="d-w" style="width: 90px;text-align: center;">
                <table id="dimp">
                    <tr>
                        <td class='webring-info'>
                            <a href='${indexPage}' target="_top">
                                <img src="https://vielleicht.lol/mobring/assets/dimp1.png">
                            </a>
                        </td>
                    </tr>
                </table>
                <p style="margin-top: 0;">
                    Not yet a member of the Psycho Helmet Webring
                </p>
            </div>
        `);
    } else {
        let previousIndex = (thisIndex - 1 < 0) ? sites.length - 1 : thisIndex - 1;
        let nextIndex = (thisIndex + 1 >= sites.length) ? 0 : thisIndex + 1;

        let indexText = "";
        if (useIndex) {
            indexText = `<a href='${indexPage}'>index</a> | `;
        }

        let randomText = "";
        if (useRandom) {
            randomText = `<a href='javascript:void(0)' onclick='randomSite()'>random</a> | `;
        }

        tag.insertAdjacentHTML('afterbegin', `
            <div id="d-w" style="width: 90px;text-align: center;">
                <table id="dimp">
                    <tr>
                        <td class='webring-prev'>
                            <a href='${sites[previousIndex]}' target="_top">
                                <img src="https://vielleicht.lol/mobring/assets/dimp2.png">
                            </a>
                        </td>
                        <td class='webring-info'>
                            <a href='${indexPage}' target="_top">
                                <img src="https://vielleicht.lol/mobring/assets/dimp1.png">
                            </a>
                        </td>
                        <td class='webring-next'>
                            <a href='${sites[nextIndex]}' target="_top">
                                <img src="https://vielleicht.lol/mobring/assets/dimp1.png">
                            </a>
                        </td>
                    </tr>
                </table>
                <p style="margin-top: 0;">
                    <a href='${indexPage}' target="_top">Psycho Helmet Webring</a>
                </p>
            </div>
        `);
    }
}
