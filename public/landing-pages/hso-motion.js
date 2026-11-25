const motion = matchMedia('(prefers-reduced-motion: reduce)');
const compact = matchMedia('(max-width: 767px), (hover: none)');
const root = document.documentElement;
const hero = document.querySelector('.hso-hero');
const bar = document.querySelector('#topnav .pillbar');
const ease = 'cubic-bezier(.16, 1, .3, 1)';
const running = new Set();

function animate(element, frames, options) {
  if (motion.matches || !element.animate) return;
  const animation = element.animate(frames, { duration: 650, easing: ease, ...options });
  running.add(animation);
  animation.finished.then(() => running.delete(animation), () => running.delete(animation));
}

// Content is visible even when animation or WebGL cannot start.
animate(document.querySelector('.hso-lobby-card'), [
  { clipPath: 'inset(0 100% 0 0)', transform: 'translateY(16px)' },
  { clipPath: 'inset(0)', transform: 'none' },
], { duration: 850 });

const reveal = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const element = entry.target;
    const image = element.matches('.shot');
    animate(element, image ? [
      { clipPath: 'inset(0 0 12% 0)', opacity: .6 },
      { clipPath: 'inset(0)', opacity: 1 },
    ] : [
      { transform: 'translateY(20px)', opacity: .5 },
      { transform: 'none', opacity: 1 },
    ], { delay: Number(element.dataset.revealDelay || 0), duration: compact.matches ? 420 : 650 });
    reveal.unobserve(element);
  }
}, { threshold: .08 });
document.querySelectorAll('.hso-tile, .hso-max-shots .shot, .hso-java-shots .shot, .caps .cap').forEach((element, index) => {
  element.dataset.revealDelay = String((index % (compact.matches ? 2 : 3)) * 55);
  reveal.observe(element);
});
if (compact.matches) {
  document.querySelectorAll('.hero article > .framed, .featured .card, .contact .box, footer .fcard').forEach(element => reveal.observe(element));
}

// Complete the source template's particle treatment across the added HSO sections.
document.querySelectorAll('.hso-max-head h2, .hso-max-head .hso-lead, .hso-support-title').forEach(element => {
  element.setAttribute('data-ps', '');
});
function restoreContent() {
  root.classList.remove('hso-particles');
  document.querySelectorAll('.ps-hidden').forEach(element => element.classList.remove('ps-hidden'));
}
function particles() {
  if (window.__ps) { window.__ps.destroy(); window.__ps = null; }
  restoreContent();
  if (motion.matches || compact.matches || !window.ParticleScroll) return;
  try {
    window.__ps = window.ParticleScroll.mountParticleScroll('[data-ps]', {
      point: .8, band: 230, density: 3, size: 1.4, spread: 140, gravity: .35,
      drift: .9, swirl: 55, stagger: .35, fade: .42, settle: .5, hold: .7,
      smoothing: .26, tintA: [1, .3, 0], tintB: [1, .82, .2],
    });
    if (window.__ps) root.classList.add('hso-particles');
    document.getElementById('ps-output')?.addEventListener('webglcontextlost', restoreContent, { once: true });
  } catch { restoreContent(); }
}
particles();

let scrollFrame = 0;
function updateScroll() {
  scrollFrame = 0;
  const height = root.scrollHeight - innerHeight;
  bar.style.setProperty('--page-progress', String(height > 0 ? scrollY / height : 0));
  const y = motion.matches || compact.matches ? 0 : Math.min(scrollY * .16, innerHeight * .16);
  hero.style.setProperty('--hero-y', `${y.toFixed(1)}px`);
  const links = [...document.querySelectorAll('#topnav .center a')];
  const current = links.filter(link => document.querySelector(link.hash)?.getBoundingClientRect().top <= 130).at(-1) || links[0];
  for (const link of links) {
    link.classList.toggle('active', link === current);
    if (link === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
function queueScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
addEventListener('scroll', queueScroll, { passive: true });
addEventListener('resize', queueScroll, { passive: true });
updateScroll();

// Pixel snow belongs to the lobby and stops as soon as the lobby leaves the screen.
const canvas = document.querySelector('.hso-atmosphere');
const context = canvas.getContext('2d');
let snowFrame = 0, last = 0, visible = true, width = 0, height = 0;
let flakes = [];
function resizeSnow() {
  width = hero.clientWidth; height = hero.clientHeight;
  const ratio = Math.min(devicePixelRatio || 1, compact.matches ? 1 : 1.5);
  canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
  context?.setTransform(ratio, 0, 0, ratio, 0, 0);
  flakes = Array.from({ length: compact.matches ? 28 : 70 }, () => ({
    x: Math.random() * width, y: Math.random() * height,
    size: 1 + Math.random() * 2, speed: 10 + Math.random() * 22, phase: Math.random() * Math.PI * 2,
  }));
}
function snow(now) {
  snowFrame = requestAnimationFrame(snow);
  const elapsed = now - last;
  if (elapsed < 1000 / 30) return;
  const dt = Math.min(elapsed / 1000, .06); last = now;
  context.clearRect(0, 0, width, height);
  for (const flake of flakes) {
    flake.y = (flake.y + flake.speed * dt) % height;
    flake.x = (flake.x + Math.sin(now * .0004 + flake.phase) * dt * 8 + width) % width;
    context.fillStyle = `rgba(225,238,255,${.25 + flake.size * .15})`;
    context.fillRect(Math.round(flake.x), Math.round(flake.y), flake.size, flake.size);
  }
}
function playback() {
  cancelAnimationFrame(snowFrame); snowFrame = 0; last = performance.now();
  if (context && visible && !document.hidden && !motion.matches && !document.body.classList.contains('menu-open') && !document.body.classList.contains('machine')) snowFrame = requestAnimationFrame(snow);
  else context?.clearRect(0, 0, width, height);
  canvas.dataset.animationActive = String(Boolean(snowFrame));
}
// The hero is fixed; the layout's top is the actual boundary of the lobby.
addEventListener('scroll', () => {
  const next = scrollY < hero.clientHeight;
  if (next !== visible) { visible = next; playback(); }
}, { passive: true });
new ResizeObserver(() => { resizeSnow(); playback(); }).observe(hero);
new MutationObserver(playback).observe(document.body, { attributes: true, attributeFilter: ['class'] });
document.addEventListener('visibilitychange', playback);
motion.addEventListener('change', () => {
  for (const animation of running) animation.cancel();
  particles(); playback(); updateScroll();
});
compact.addEventListener('change', () => { particles(); resizeSnow(); playback(); });
resizeSnow(); playback();
