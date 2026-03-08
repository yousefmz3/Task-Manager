/* ============================================================
   NexCore Enterprise Error Page — script.js
   Effects: Particles, Typing, Clock, Glitch, Uptime
   ============================================================ */

'use strict';

/* ─── Utility ─────────────────────────────────────────────── */
const $ = (id) => document.getElementById(id);

/* ─── Incident ID Generator ────────────────────────────────── */
function generateIncidentId() {
  const hex = () => Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  return `INC-${hex()}-${hex()}`;
}
$('incident-id').textContent = generateIncidentId();

/* ─── Live Clock ───────────────────────────────────────────── */
function updateClock() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  $('live-clock').textContent =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} UTC`;
}
updateClock();
setInterval(updateClock, 1000);

/* ─── Uptime Counter ──────────────────────────────────────── */
let uptimeSeconds = 0;
function updateUptime() {
  uptimeSeconds++;
  const h = String(Math.floor(uptimeSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((uptimeSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(uptimeSeconds % 60).padStart(2, '0');
  $('uptime-counter').textContent = `${h}:${m}:${s}`;
}
setInterval(updateUptime, 1000);

/* ─── Particle Canvas ─────────────────────────────────────── */
const canvas = $('particles-canvas');
const ctx    = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 80;

const COLORS = [
  'rgba(0, 212, 255,',    // cyan
  'rgba(79, 138, 255,',   // blue
  'rgba(168, 85, 247,',   // purple
  'rgba(255, 45, 85,',    // red accent
];

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x     = Math.random() * canvas.width;
    this.y     = initial ? Math.random() * canvas.height : canvas.height + 10;
    this.size  = Math.random() * 1.8 + 0.4;
    this.speed = Math.random() * 0.4 + 0.1;
    this.drift = (Math.random() - 0.5) * 0.3;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.6 + 0.1;
    this.decay = Math.random() * 0.002 + 0.0005;
    this.pulse = Math.random() * Math.PI * 2;
  }

  update() {
    this.y     -= this.speed;
    this.x     += this.drift;
    this.pulse += 0.02;
    const pulsedAlpha = this.alpha * (0.75 + 0.25 * Math.sin(this.pulse));
    this.currentAlpha = Math.max(0, pulsedAlpha);
    if (this.y < -10) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `${this.color}${this.currentAlpha})`;
    ctx.shadowBlur  = 8;
    ctx.shadowColor = `${this.color}0.8)`;
    ctx.fill();
    ctx.shadowBlur  = 0;
  }
}

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initParticles() {
  resizeCanvas();
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  // Reposition out-of-bound particles
  particles.forEach((p) => {
    if (p.x > canvas.width)  p.x = Math.random() * canvas.width;
    if (p.y > canvas.height) p.reset();
  });
});

initParticles();
animateParticles();

/* ─── Terminal Typing Animation ───────────────────────────── */
const terminalOutput = $('terminal-output');

const TERMINAL_LINES = [
  '> Initializing system diagnostics...',
  '> Checking route table... [FAILED]',
  '> Route /undefined — no matching endpoint',
  '> HTTP Status: 404 Not Found',
  '> Fetching error context from edge node...',
  '> Edge node: us-east-01 ✓ reachable',
  '> Incident logged → ops-channel #alerts',
  '> Attempting automatic recovery... [ABORTED]',
  '> Manual intervention required.',
  '> Session preserved. Awaiting action.',
];

let lineIndex  = 0;
let charIndex  = 0;
let fullText   = '';
const CHAR_DELAY = 28;   // ms per character
const LINE_PAUSE = 600;  // ms pause between lines

function typeLine() {
  if (lineIndex >= TERMINAL_LINES.length) return;

  const line    = TERMINAL_LINES[lineIndex];
  const current = line[charIndex];

  if (current !== undefined) {
    fullText += current;
    terminalOutput.textContent = fullText;
    charIndex++;
    setTimeout(typeLine, CHAR_DELAY + Math.random() * 18);
  } else {
    // End of line
    fullText   += '\n';
    terminalOutput.textContent = fullText;
    charIndex   = 0;
    lineIndex++;
    setTimeout(typeLine, LINE_PAUSE);
  }
}

// Begin typing after the page fade-in (≈1.1s)
setTimeout(typeLine, 1200);

/* ─── Glitch Flicker ──────────────────────────────────────── */
const errorCode = $('error-code');

function triggerGlitch() {
  errorCode.classList.add('glitching');

  // Apply inline clip-path jitter for extra chaos
  const jitters = [
    { transform: 'skewX(1.5deg)', filter: 'hue-rotate(20deg) saturate(2)' },
    { transform: 'skewX(-1deg)',  filter: 'hue-rotate(-15deg) saturate(1.5)' },
    { transform: 'skewX(0)',      filter: 'none' },
  ];

  let step = 0;
  const run = () => {
    if (step < jitters.length) {
      Object.assign(errorCode.style, jitters[step]);
      step++;
      setTimeout(run, 80);
    } else {
      // Reset
      errorCode.style.transform = '';
      errorCode.style.filter    = '';
      errorCode.classList.remove('glitching');
    }
  };
  run();
}

// Random glitch every 4–9 seconds
function scheduleGlitch() {
  const delay = 4000 + Math.random() * 5000;
  setTimeout(() => {
    triggerGlitch();
    scheduleGlitch();
  }, delay);
}
scheduleGlitch();

/* ─── Button interactions ─────────────────────────────────── */
$('dashboard-btn').addEventListener('click', (e) => {
  e.preventDefault();
  // Simulate navigation — replace with actual URL in production
  const btn = e.currentTarget;
  btn.textContent = 'Redirecting…';
  btn.style.pointerEvents = 'none';
  setTimeout(() => { window.location.href = '/'; }, 800);
});

$('report-btn').addEventListener('click', (e) => {
  e.preventDefault();
  const incidentId = $('incident-id').textContent;
  alert(`Incident ${incidentId} has been detected`);
});

/* ─── Status pulse colour ─────────────────────────────────── */
// Every 7s flip to "MONITORING" state briefly for realism
setInterval(() => {
  const dot   = $('status-dot');
  const label = $('status-label');
  dot.style.background   = 'var(--clr-cyan)';
  dot.style.boxShadow    = 'var(--glow-cyan)';
  label.style.color      = 'var(--clr-cyan)';
  label.textContent      = 'SYSTEM STATUS: MONITORING';

  setTimeout(() => {
    dot.style.background   = '';
    dot.style.boxShadow    = '';
    label.style.color      = '';
    label.textContent      = 'SYSTEM STATUS: CRITICAL';
  }, 1800);
}, 7000);
