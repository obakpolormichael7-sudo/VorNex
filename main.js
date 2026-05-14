
gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
const cur  = document.getElementById('cur');
const ring = document.getElementById('ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function tickCursor() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  cur.style.left  = mx + 'px';
  cur.style.top   = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(tickCursor);
})();

/* ─────────────────────────────────────────────
   PARTICLE CANVAS
───────────────────────────────────────────── */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

const COLORS = [
  'rgba(157,78,221,',
  'rgba(199,125,255,',
  'rgba(233,30,140,',
  'rgba(0,212,255,',
  'rgba(255,214,10,'
];

function Particle() {
  this.x     = Math.random() * W;
  this.y     = Math.random() * H;
  this.vx    = (Math.random() - 0.5) * 0.6;
  this.vy    = (Math.random() - 0.5) * 0.6;
  this.r     = Math.random() * 2 + 0.5;
  this.col   = COLORS[Math.floor(Math.random() * COLORS.length)];
  this.alpha = Math.random() * 0.6 + 0.2;
  this.pulse = Math.random() * Math.PI * 2;
}

Particle.prototype.update = function () {
  this.x     += this.vx;
  this.y     += this.vy;
  this.pulse += 0.02;
  if (this.x < 0 || this.x > W) this.vx *= -1;
  if (this.y < 0 || this.y > H) this.vy *= -1;
};

Particle.prototype.draw = function () {
  const a = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
  ctx.fillStyle = this.col + a + ')';
  ctx.fill();
};

function initParticles() {
  const count = Math.min(Math.floor(W * H / 8000), 180);
  particles   = Array.from({ length: count }, () => new Particle());
}
initParticles();

let mouseX = W / 2, mouseY = H / 2;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function drawConnections() {
  const maxDist = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < maxDist) {
        const a = (1 - d / maxDist) * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(157,78,221,${a})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
    /* mouse attraction lines */
    const mdx = particles[i].x - mouseX;
    const mdy = particles[i].y - mouseY;
    const md  = Math.sqrt(mdx * mdx + mdy * mdy);
    if (md < 150) {
      const a = (1 - md / 150) * 0.35;
      ctx.beginPath();
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(mouseX, mouseY);
      ctx.strokeStyle = `rgba(199,125,255,${a})`;
      ctx.lineWidth   = 0.7;
      ctx.stroke();
    }
  }
}

function animCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animCanvas);
}
animCanvas();

/* ─────────────────────────────────────────────
   CINEMATIC LOADER
───────────────────────────────────────────── */
gsap.to('.ld-l',  { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, delay: 0.2, ease: 'power4.out' });
gsap.to('.ld-tag',{ opacity: 1, y: 0, duration: 0.6, delay: 0.9, ease: 'power2.out' });

let prog = 0;
const loaderInterval = setInterval(() => {
  prog += Math.random() * 4.5 + 1;
  if (prog >= 100) { prog = 100; clearInterval(loaderInterval); revealSite(); }
  document.getElementById('ldBar').style.width = prog + '%';
  document.getElementById('ldCnt').textContent  = Math.floor(prog) + '%';
}, 55);

function revealSite() {
  gsap.timeline()
    .to('#loader',  { opacity: 0, duration: 0.5, ease: 'power2.in' })
    .set('#loader', { display: 'none' })
    .to('.ct', { y: '-100%', duration: 0.9, ease: 'power4.inOut' })
    .to('.cb', { y:  '100%', duration: 0.9, ease: 'power4.inOut' }, '-=0.9')
    .set('#curtain', { display: 'none' })
    .call(() => { document.body.classList.remove('loading'); initPage(); });
}

/* ─────────────────────────────────────────────
   PAGE ANIMATIONS
───────────────────────────────────────────── */
function initPage() {

  /* Hero text entrance */
  gsap.to('.hero-ey',         { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: 'power3.out' });
  gsap.to('.hero-title .word',{ y: 0, stagger: 0.09, duration: 1.1, delay: 0.25, ease: 'power4.out' });
  gsap.to('.hero-desc',       { opacity: 1, duration: 0.8, delay: 0.9,  ease: 'power2.out' });
  gsap.to('.hero-actions',    { opacity: 1, duration: 0.8, delay: 1.1,  ease: 'power2.out' });
  gsap.to('#scrollHint',      { opacity: 1, duration: 0.7, delay: 1.5,  ease: 'power2.out' });

  /* Scroll-triggered entrance animations */
  gsap.utils.toArray('.gu').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 1, y: 0, duration: 0.9, delay: (i % 4) * 0.07, ease: 'power3.out'
    });
  });

  gsap.utils.toArray('.gl').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 1, x: 0, duration: 0.9, delay: (i % 4) * 0.09, ease: 'power3.out'
    });
  });

  gsap.utils.toArray('.gr').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 1, x: 0, duration: 0.9, delay: (i % 3) * 0.1, ease: 'power3.out'
    });
  });

  gsap.utils.toArray('.gs').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      opacity: 1, scale: 1, duration: 0.9, delay: (i % 3) * 0.1, ease: 'power3.out'
    });
  });

  /* Parallax on large titles */
  gsap.utils.toArray('.st, .intro-hl, .arena-title, .wl-title').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      y: -35, ease: 'none'
    });
  });

  /* Watermark parallax */
  gsap.utils.toArray('.intro-wm, .arena-wm').forEach(wm => {
    gsap.to(wm, {
      scrollTrigger: { trigger: wm, start: 'top bottom', end: 'bottom top', scrub: 2 },
      x: -60, ease: 'none'
    });
  });

  /* 3D card tilt on game vault */
  document.querySelectorAll('.gc').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 16;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 16;
      gsap.to(card, { rotateY: x, rotateX: -y, duration: 0.4, ease: 'power2.out', transformPerspective: 900 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' });
    });
  });

  /* Leaderboard row stagger */
  gsap.utils.toArray('.lbr').forEach((row, i) => {
    gsap.from(row, {
      scrollTrigger: { trigger: row, start: 'top 90%' },
      x: -26, opacity: 0, duration: 0.6, delay: i * 0.09, ease: 'power2.out'
    });
  });

  /* Hero overlay shifts with mouse */
  const overlay = document.querySelector('.hero-overlay');
  document.addEventListener('mousemove', e => {
    const xr = (e.clientX / window.innerWidth  - 0.5) * 2;
    const yr = (e.clientY / window.innerHeight - 0.5) * 2;
    overlay.style.background = `linear-gradient(
      ${135 + xr * 10}deg,
      rgba(5,5,13,${0.88 + yr * 0.04}) 0%,
      rgba(5,5,13,${0.25 + Math.abs(xr) * 0.1}) 50%,
      rgba(5,5,13,${0.72 + yr * 0.05}) 100%
    )`;
  });
}


let aCtx = null, mGain = null, audioMuted = true;
const mbtn = document.getElementById('musicBtn');

function buildAudio() {
  if (aCtx) return;
  aCtx  = new (window.AudioContext || window.webkitAudioContext)();
  mGain = aCtx.createGain();
  mGain.gain.setValueAtTime(0, aCtx.currentTime);
  mGain.connect(aCtx.destination);

  /* Drone oscillators */
  [[55, 0.18, 'sine'], [110, 0.07, 'triangle'], [165, 0.04, 'sine'], [220, 0.03, 'triangle']]
    .forEach(([freq, gain, type]) => {
      const osc = aCtx.createOscillator();
      const gn  = aCtx.createGain();
      osc.type          = type;
      osc.frequency.value = freq;
      gn.gain.value     = gain;
      osc.connect(gn);
      gn.connect(mGain);
      osc.start();
    });

  /* LFO pulsing bass layer */
  const lfo  = aCtx.createOscillator();
  const lfg  = aCtx.createGain();
  const pb   = aCtx.createOscillator();
  const pbg  = aCtx.createGain();
  pb.type    = 'sine';
  pb.frequency.value = 80;
  pbg.gain.setValueAtTime(0, aCtx.currentTime);
  lfo.frequency.value = 0.5;
  lfg.gain.value      = 0.04;
  lfo.connect(lfg);
  lfg.connect(pbg.gain);
  pb.connect(pbg);
  pbg.connect(mGain);
  lfo.start();
  pb.start();

  /* Shimmer hi-freq layer */
  const sh  = aCtx.createOscillator();
  const shg = aCtx.createGain();
  sh.type         = 'sine';
  sh.frequency.value = 880;
  shg.gain.value  = 0.01;
  sh.connect(shg);
  shg.connect(mGain);
  sh.start();
}

mbtn.addEventListener('click', () => {
  if (!aCtx) buildAudio();
  if (aCtx.state === 'suspended') aCtx.resume();

  audioMuted = !audioMuted;
  const now  = aCtx.currentTime;

  if (!audioMuted) {
    mGain.gain.cancelScheduledValues(now);
    mGain.gain.setValueAtTime(mGain.gain.value, now);
    mGain.gain.linearRampToValueAtTime(0.48, now + 1.2);
    mbtn.classList.remove('muted');
  } else {
    mGain.gain.cancelScheduledValues(now);
    mGain.gain.setValueAtTime(mGain.gain.value, now);
    mGain.gain.linearRampToValueAtTime(0, now + 0.8);
    mbtn.classList.add('muted');
  }
});

/* ─────────────────────────────────────────────
   NAV SCROLL EFFECT
───────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 60);
});

/* ─────────────────────────────────────────────
   MOBILE HAMBURGER MENU
───────────────────────────────────────────── */
document.getElementById('menuBtn').addEventListener('click', () => {
  const nl   = document.getElementById('navLinks');
  const open = nl.style.display === 'flex';
  nl.style.cssText = open
    ? 'display:none'
    : 'display:flex;flex-direction:column;position:absolute;top:66px;left:0;right:0;background:rgba(5,5,13,.97);padding:1.4rem 1.5rem;gap:1.2rem;backdrop-filter:blur(22px);border-bottom:1px solid rgba(157,78,221,.1);z-index:499';
});

/* ─────────────────────────────────────────────
   WAITLIST FORM
───────────────────────────────────────────── */
document.getElementById('wlBtn').addEventListener('click', () => {
  const inp = document.getElementById('wlIn');
  const btn = document.getElementById('wlBtn');

  if (inp.value && inp.value.includes('@')) {
    gsap.to(btn, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.inOut' });
    setTimeout(() => {
      inp.value       = '';
      inp.placeholder = "✦ You're on the list!";
      btn.textContent = 'Joined ✓';
      btn.style.background = 'var(--glow)';
    }, 200);
  } else {
    gsap.to(inp, { keyframes: { x: [-8, 8, -5, 5, -2, 2, 0] }, duration: 0.45, ease: 'power2.inOut' });
    inp.style.borderColor = 'var(--red)';
    setTimeout(() => inp.style.borderColor = '', 1500);
  }
});
