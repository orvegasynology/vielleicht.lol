function loadWebring() {
    var tag = document.getElementById(ringID);
    if (!tag) return;

    var thisSite = window.location.href;
    var thisIndex = null;

    fetch('https://vielleicht.lol/mobring/ring/members.json')
        .then(res => {
            if (!res.ok) throw new Error("Failed to load member list");
            return res.json();
        })
        .then(data => {
            sites = Array.isArray(data) ? data : data.sites;

            for (let i = 0; i < sites.length; i++) {
                if (thisSite.startsWith(sites[i])) {
                    thisIndex = i;
                    break;
                }
            }

            function randomSite() {
                let otherSites = sites.slice();
                if (thisIndex !== null) otherSites.splice(thisIndex, 1);
                let randomIndex = Math.floor(Math.random() * otherSites.length);
                location.href = otherSites[randomIndex];
            }

            if (thisIndex === null) {
                tag.innerHTML = `
                <div id="d-w" style="width:90px;text-align:center;">
                    <table id="dimp">
                        <tr>
                            <td class='webring-info'>
                                <a href='${indexPage}' target="_top">
                                    <img src="https://vielleicht.lol/mobring/assets/dimp1.png">
                                </a>
                            </td>
                        </tr>
                    </table>
                    <p>Not yet a member of the Psycho Helmet Webring</p>
                </div>`;
                return;
            }

            let prevIndex = (thisIndex - 1 + sites.length) % sites.length;
            let nextIndex = (thisIndex + 1) % sites.length;

            tag.innerHTML = `
            <div id="d-w" style="width:90px;text-align:center;">
                <table id="dimp">
                    <tr>
                        <td class='webring-prev'>
                            <a href='${sites[prevIndex]}' target="_top">
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
                <p><a href='${indexPage}' target="_top">Psycho Helmet Webring</a></p>
            </div>`;

            if (useRandom) {
                // add random button below the widget
                const randomBtn = document.createElement('button');
                randomBtn.textContent = "Random Site";
                randomBtn.onclick = randomSite;
                tag.appendChild(randomBtn);
            }
        })
        .catch(err => {
            console.error("Error loading webring members:", err);
            if (tag) tag.innerHTML = `<p>Failed to load webring data</p>`;
        });
}

// Automatically load the webring after page load
window.addEventListener('DOMContentLoaded', loadWebring);
