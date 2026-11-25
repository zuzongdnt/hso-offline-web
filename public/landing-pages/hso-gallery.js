const gallery = document.querySelector('.hso-gallery');
const preview = gallery.querySelector('img');
const caption = gallery.querySelector('p');
let slides = [];
let current = 0;
let opener = null;

function show(index) {
  if (!slides.length) return;
  current = (index + slides.length) % slides.length;
  const shot = slides[current];
  preview.src = shot.href;
  preview.alt = shot.querySelector('img').alt;
  caption.textContent = `${current + 1} / ${slides.length} · ${preview.alt}`;
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    preview.animate([{ opacity: .4 }, { opacity: 1 }], { duration: 200 });
  }
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('[data-gallery]');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const group = link.closest('[data-gallery-group]');
  if (!group) return;

  event.preventDefault();
  opener = link;
  slides = [...group.querySelectorAll('.shot[data-gallery]')];
  const shot = link.matches('.shot') ? link : link.closest('.card').querySelector('.shot');
  show(slides.indexOf(shot));
  gallery.showModal();
});

gallery.querySelector('[data-back]').addEventListener('click', () => show(current - 1));
gallery.querySelector('[data-next]').addEventListener('click', () => show(current + 1));
gallery.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') show(current - 1);
  if (event.key === 'ArrowRight') show(current + 1);
});

gallery.addEventListener('close', () => opener?.focus({ preventScroll: true }));
gallery.addEventListener('click', (event) => {
  if (event.target !== gallery) return;
  const box = gallery.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) gallery.close();
});

// Keep vertical scrolling and pinch zoom native; only a deliberate horizontal swipe changes images.
preview.style.touchAction = 'pan-y pinch-zoom';
preview.draggable = false;
let start = null;
preview.addEventListener('pointerdown', (event) => {
  if (!event.isPrimary || event.pointerType !== 'touch') return;
  start = { x: event.clientX, y: event.clientY, id: event.pointerId };
  preview.setPointerCapture(event.pointerId);
});
preview.addEventListener('pointerup', (event) => {
  if (!start || event.pointerId !== start.id) return;
  const dx = event.clientX - start.x, dy = event.clientY - start.y;
  if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
  start = null;
});
preview.addEventListener('pointercancel', () => { start = null; });
