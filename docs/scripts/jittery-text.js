//edit to use a class instead of ID

const header = document.getElementById('header');

header.innerHTML = header.textContent
  .split('')
  .map(char => `<span>${char}</span>`)
  .join('');

const letters = header.querySelectorAll('span');

function jitter() {
  letters.forEach(letter => {
    const x = (Math.random() - 0.5) * 2;
    const y = (Math.random() - 0.5) * 3;
    letter.style.transform = `translate(${x}px, ${y}px)`;
  });
}

setInterval(jitter, 5);