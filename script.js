const COUNT = 400;
const SPEED = 1.4;
const ATTRACT_RADIUS = 160;
const COLORS = [
  "#fff6c2",
  "#ffe066",
  "#ff9f1c",
  "#ff6b6b",
  "#f72585",
  "#b5179e",
  "#7209b7",
  "#4cc9f0",
  "#80ffdb",
  "#90e0ef",
  "#caf0f8",
  "#b5e48c",
  "#f4a261",
  "#e9c46a",
];

const canvas = document.getElementById("sparks");
const ctx = canvas.getContext("2d");
const veil = document.querySelector(".veil");

const mouse = { x: 0, y: 0, active: false };
const particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createParticles() {
  particles.length = 0;
  for (let i = 0; i < COUNT; i += 1) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r: 1.1 + Math.random() * 1.8,
      color: randomColor(),
    });
  }
}

function wrap(p) {
  if (p.x < -8) p.x = canvas.width + 8;
  if (p.x > canvas.width + 8) p.x = -8;
  if (p.y < -8) p.y = canvas.height + 8;
  if (p.y > canvas.height + 8) p.y = -8;
}

let rafId = 0;

function tick() {
  if (document.hidden) {
    rafId = 0;
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    p.vx += (Math.random() - 0.5) * 0.22;
    p.vy += (Math.random() - 0.5) * 0.22;

    let near = 0;
    if (mouse.active) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < ATTRACT_RADIUS && dist > 0.001) {
        near = 1 - dist / ATTRACT_RADIUS;
        p.vx += (dx / dist) * near * 0.55;
        p.vy += (dy / dist) * near * 0.55;
      }
    }

    p.vx *= 0.96;
    p.vy *= 0.96;
    p.x += p.vx;
    p.y += p.vy;
    wrap(p);

    const glow = p.r;
    const alpha = 0.45 + near * 0.55;

    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = alpha;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  rafId = requestAnimationFrame(tick);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(rafId);
    rafId = 0;
    return;
  }
  if (!rafId) rafId = requestAnimationFrame(tick);
});

window.addEventListener("pointermove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.active = true;
  veil.style.setProperty("--mx", `${event.clientX}px`);
  veil.style.setProperty("--my", `${event.clientY}px`);
  veil.classList.add("is-on");
});

window.addEventListener("pointerleave", () => {
  mouse.active = false;
  veil.classList.remove("is-on");
});

window.addEventListener("resize", () => {
  resize();
  createParticles();
});

resize();
createParticles();
rafId = requestAnimationFrame(tick);
