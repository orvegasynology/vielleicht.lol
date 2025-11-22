function loadWebring() {
    var tag = document.getElementById(ringID);
    if (!tag) return;

    var thisSite = window.location.href.replace(/\/$/, ''); // remove trailing slash
    var thisIndex = null;

    fetch('https://vielleicht.lol/mobring/ring/members.json')
        .then(res => {
            if (!res.ok) throw new Error("Failed to load member list");
            return res.json();
        })
        .then(data => {
            const sites = data.map(member => member.url.replace(/\/$/, '')); // normalize URLs

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

            let indexLink = useIndex ? `<a href='${indexPage}'>index</a> | ` : '';
            let randomLink = useRandom ? `<a href='javascript:void(0)' onclick='randomSite()'>random</a> | ` : '';

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
                <p>${indexLink}${randomLink}<a href='${indexPage}' target="_top">Psycho Helmet Webring</a></p>
            </div>`;
        })
        .catch(err => {
            console.error("Error loading webring members:", err);
            if (tag) tag.innerHTML = `<p>Failed to load webring data</p>`;
        });
}

// Wait until DOM is loaded
window.addEventListener('DOMContentLoaded', loadWebring);
