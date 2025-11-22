var tag = document.getElementById(ringID);
thisSite = window.location.href;
thisIndex = null;

fetch('https://vielleicht.lol/mobring/ring/members.json')
  .then(response => {
    if (!response.ok) throw new Error("Failed to load member list");
    return response.json();
  })
  .then(data => {
    const sites = data.sites;

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

    if (thisIndex === null) {
      tag.insertAdjacentHTML('afterbegin', `
        <div id="d-w" style="width: 90px;text-align: center;">
          <table id="dimp">
            <tr>
              <td class='webring-info'><a href='${indexPage}' target="_top"><img src="https://vielleicht.lol/mobring/assets/dimp1.png"></a></td>
            </tr>
          </table>
          <p style="margin-top: 0;">Not yet a member of the Psycho Helmet Webring</p>
        </div>
      `);
      return;
    }

    let previousIndex = (thisIndex - 1 < 0) ? sites.length - 1 : thisIndex - 1;
    let nextIndex = (thisIndex + 1 >= sites.length) ? 0 : thisIndex + 1;

    let indexText = useIndex ? `<a href='${indexPage}'>index</a> | ` : '';
    let randomText = useRandom ? `<a href='javascript:void(0)' onclick='randomSite()'>random</a> | ` : '';

    tag.insertAdjacentHTML('afterbegin', `
      <div id="d-w" style="width: 90px;text-align: center;">
        <table id="dimp">
          <tr>
            <td class='webring-prev'><a href='${sites[previousIndex]}' target="_top"><img src="https://vielleicht.lol/mobring/assets/dimp2.png"></a></td>
            <td class='webring-info'><a href='${indexPage}' target="_top"><img src="https://vielleicht.lol/mobring/assets/dimp1.png"></a></td>
            <td class='webring-next'><a href='${sites[nextIndex]}' target="_top"><img src="https://vielleicht.lol/mobring/assets/dimp1.png"></a></td>
          </tr>
        </table>
        <p style="margin-top: 0;">
          <a href='${indexPage}' target="_top">Psycho Helmet Webring</a>
        </p>
      </div>
    `);

  })
  .catch(err => {
    console.error("Error loading webring members:", err);
    tag.innerHTML = `<p>Failed to load webring data</p>`;
  });
