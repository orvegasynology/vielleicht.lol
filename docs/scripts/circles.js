const buttons = document.querySelectorAll('.button');
const container = document.getElementById('buttonContainer');
const radius = 200;
let angle = 5;
const speed = 0.002;

const dragging = new Map();
const hovering = new Map();
const physics = new Map();
let isMobile = window.innerWidth <= 768;

function updateLayoutMode() {
    isMobile = window.innerWidth <= 768;
    if(isMobile){
        container.classList.add('flex');
        // Keep current positions for dragging inertia
        buttons.forEach(button=>{
            const p = physics.get(button);
            p.x = button.offsetLeft;
            p.y = button.offsetTop;
        });
    } else {
        container.classList.remove('flex');
    }
}

window.addEventListener('resize', updateLayoutMode);
updateLayoutMode();

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

    // Hover tracking for desktop
    button.addEventListener('mouseenter', () => hovering.set(button, true));
    button.addEventListener('mouseleave', () => hovering.set(button, false));

    // Dragging
    let offsetX=0, offsetY=0;
    let isDragging=false;
    let prevX=0, prevY=0;
    let lastTime=performance.now();

    const startDrag = (x,y)=>{
        isDragging=true;
        dragging.set(button,true);
        const rect = button.getBoundingClientRect();
        offsetX = x - rect.left;
        offsetY = y - rect.top;

        const p = physics.get(button);
        p.wobbling=false;

        prevX = x - offsetX;
        prevY = y - offsetY;
        lastTime = performance.now();
    };

    const dragMove = (x,y)=>{
        if(!isDragging) return;
        const time = performance.now();
        const dt = (time - lastTime) || 16;

        const bx = x - offsetX;
        const by = y - offsetY;

        const vx = (bx - prevX)/dt*16;
        const vy = (by - prevY)/dt*16;

        prevX=bx;
        prevY=by;
        lastTime=time;

        const p = physics.get(button);
        p.x = bx;
        p.y = by;
        p.vx = vx;
        p.vy = vy;

        button.style.left = `${bx}px`;
        button.style.top = `${by}px`;
    };

    const endDrag = ()=>{
        if(!isDragging) return;
        isDragging=false;
        dragging.set(button,false);
        physics.get(button).wobbling=true;
    };

    // Mouse
    button.addEventListener('mousedown', e=>{ e.preventDefault(); startDrag(e.clientX,e.clientY); });
    window.addEventListener('mousemove', e=>dragMove(e.clientX,e.clientY));
    window.addEventListener('mouseup', endDrag);

    // Touch
    button.addEventListener('touchstart', e=>{
        const touch = e.touches[0];
        e.preventDefault();
        startDrag(touch.clientX,touch.clientY);
    }, {passive:false});

    window.addEventListener('touchmove', e=>{
        if(!isDragging) return;
        const touch=e.touches[0];
        dragMove(touch.clientX,touch.clientY);
    }, {passive:false});

    window.addEventListener('touchend', endDrag);
});

function animate(){
    if(!isMobile) angle+=speed;

    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width/2;
    const centerY = containerRect.height/2;

    const spring = 0.08;
    const damping = 0.85;

    buttons.forEach((button,index)=>{
        const p = physics.get(button);

        if(isMobile){
            // Flex mode, no orbit, but still apply inertia
            if(dragging.get(button)) return;
            if(!p.wobbling) return;

            p.vx *= damping;
            p.vy *= damping;
            p.x += p.vx;
            p.y += p.vy;

            button.style.left = `${p.x}px`;
            button.style.top = `${p.y}px`;

            if(Math.abs(p.vx)<0.2 && Math.abs(p.vy)<0.2) p.wobbling=false;
            return;
        }

        // Desktop orbiting
        const targetAngle = angle + index*(2*Math.PI/buttons.length);
        const orbitCenterX = centerX + radius*Math.cos(targetAngle);
        const orbitCenterY = centerY + radius*Math.sin(targetAngle);

        const rect = button.getBoundingClientRect();
        const halfW = rect.width/2;
        const halfH = rect.height/2;
        const orbitX = orbitCenterX - halfW;
        const orbitY = orbitCenterY - halfH;

        if(dragging.get(button) || hovering.get(button)) return;

        if(p.wobbling){
            const dx = orbitX - p.x;
            const dy = orbitY - p.y;

            p.vx += dx*spring;
            p.vy += dy*spring;

            p.vx *= damping;
            p.vy *= damping;

            p.x += p.vx;
            p.y += p.vy;

            button.style.left = `${p.x}px`;
            button.style.top = `${p.y}px`;

            if(Math.abs(dx)<0.2 && Math.abs(dy)<0.2 && Math.abs(p.vx)<0.2 && Math.abs(p.vy)<0.2) p.wobbling=false;
        } else {
            p.x = orbitX;
            p.y = orbitY;
            button.style.left = `${orbitX}px`;
            button.style.top = `${orbitY}px`;
        }
    });

    requestAnimationFrame(animate);
}

animate();