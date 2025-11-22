//very. very. modified version of a script from here: https://github.com/orvegasynology/pentumbra + jittery-text.js

const buttons = document.querySelectorAll('.button');
const container = document.getElementById('buttonContainer');

function getRadii() {
    const rect = container.getBoundingClientRect();
    return {
        rx: rect.width * 0.35,   
        ry: rect.height * 0.35  
    };
}

let angle = 5;
const speed = 0.002;
const dragging = new Map();
const hovering = new Map();
const physics = new Map();

let introProgress = 0;
const introDuration = 800;
let introStart = performance.now();
let introJustStarted = true;

buttons.forEach(button => {
    physics.set(button, {
        wobbling: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0
    });

    dragging.set(button, false);
    hovering.set(button, false);

    const originalText = button.textContent.trim();
    button.innerHTML = originalText
        .split("")
        .map(char => `<span class="jitter-letter">${char}</span>`)
        .join("");

    button._letters = button.querySelectorAll(".jitter-letter");
    button._jitterInterval = null;

    function jitterTick() {
        button._letters.forEach(letter => {
            const x = (Math.random() - 0.5) * 1;
            const y = (Math.random() - 0.5) * 1;
            letter.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    function startJitter() {
        if (!button._jitterInterval) {
            button._jitterInterval = setInterval(jitterTick, 30);
        }
    }

    function stopJitter() {
        if (button._jitterInterval) {
            clearInterval(button._jitterInterval);
            button._jitterInterval = null;
        }
        button._letters.forEach(letter => {
            letter.style.transform = "translate(0px, 0px)";
        });
    }

    button.addEventListener("mouseenter", () => {
        hovering.set(button, true);
        startJitter();
    });

    button.addEventListener("mouseleave", () => {
        hovering.set(button, false);
        stopJitter();
        physics.get(button).wobbling = true;
    });

    let offsetX = 0, offsetY = 0;
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let lastTime = performance.now();

    const startDrag = (x, y) => {
        isDragging = true;
        dragging.set(button, true);

        const rect = button.getBoundingClientRect();
        offsetX = x - rect.left;
        offsetY = y - rect.top;

        const p = physics.get(button);
        p.wobbling = false;

        prevX = x - offsetX;
        prevY = y - offsetY;
        lastTime = performance.now();
    };

    const dragMove = (x, y) => {
        if (!isDragging) return;

        const time = performance.now();
        const dt = (time - lastTime) || 16;

        const { rx, ry } = getRadii();

        const containerRect = container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;

        const index = Array.from(buttons).indexOf(button);
        const targetAngle = angle + index * (2 * Math.PI / buttons.length);

        const orbitCenterX = centerX + rx * Math.cos(targetAngle);
        const orbitCenterY = centerY + ry * Math.sin(targetAngle);

        let bx = x - offsetX;
        let by = y - offsetY;

        const rect = button.getBoundingClientRect();
        const halfW = rect.width / 2;
        const halfH = rect.height / 2;

        const orbitX = orbitCenterX - halfW;
        const orbitY = orbitCenterY - halfH;

        const limit = 10;

        const clampedX = Math.min(Math.max(bx, orbitX - limit), orbitX + limit);
        const clampedY = Math.min(Math.max(by, orbitY - limit), orbitY + limit);

        const vx = (clampedX - prevX) / dt * 16;
        const vy = (clampedY - prevY) / dt * 16;

        prevX = clampedX;
        prevY = clampedY;
        lastTime = time;

        const p = physics.get(button);

        p.x = clampedX - containerRect.left;
        p.y = clampedY - containerRect.top;
        p.vx = vx;
        p.vy = vy;

        button.style.left = `${p.x}px`;
        button.style.top = `${p.y}px`;
    };

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        dragging.set(button, false);
        physics.get(button).wobbling = true;
    };

    button.addEventListener('mousedown', e => {
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', e => dragMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', endDrag);
});

function animate(time) {
    if (introProgress < 1) {
        introProgress = Math.min((time - introStart) / introDuration, 1);
        introProgress = 1 - Math.pow(1 - introProgress, 3);
    }

    angle += speed;

    const { rx, ry } = getRadii();
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    const spring = 0.08;
    const damping = 0.85;

    buttons.forEach((button, index) => {
        if (getComputedStyle(button).position !== "absolute") return;

        const p = physics.get(button);
        const targetAngle = angle + index * (2 * Math.PI / buttons.length);

        const finalCenterX = centerX + rx * Math.cos(targetAngle);
        const finalCenterY = centerY + ry * Math.sin(targetAngle);

        const rect = button.getBoundingClientRect();
        const halfW = rect.width / 2;
        const halfH = rect.height / 2;

        const finalLeft = finalCenterX - halfW;
        const finalTop = finalCenterY - halfH;

        if (introJustStarted) {
            buttons.forEach(btn => (btn.style.opacity = "1"));
            introJustStarted = false;
        }

        if (introProgress < 1) {
            const startLeft = centerX - halfW;
            const startTop = centerY - halfH;

            p.x = startLeft + (finalLeft - startLeft) * introProgress;
            p.y = startTop + (finalTop - startTop) * introProgress;

            button.style.left = `${p.x}px`;
            button.style.top = `${p.y}px`;
            return;
        }

        if (dragging.get(button)) return;

        if (p.wobbling) {
            const dx = finalLeft - p.x;
            const dy = finalTop - p.y;

            p.vx += dx * spring;
            p.vy += dy * spring;

            p.vx *= damping;
            p.vy *= damping;

            p.x += p.vx;
            p.y += p.vy;

            button.style.left = `${p.x}px`;
            button.style.top = `${p.y}px`;

            if (
                Math.abs(dx) < 0.2 &&
                Math.abs(dy) < 0.2 &&
                Math.abs(p.vx) < 0.2 &&
                Math.abs(p.vy) < 0.2
            ) p.wobbling = false;
        } else {
            p.x = finalLeft;
            p.y = finalTop;
            button.style.left = `${finalLeft}px`;
            button.style.top = `${finalTop}px`;
        }
    });

    requestAnimationFrame(animate);
}

animate(performance.now());
