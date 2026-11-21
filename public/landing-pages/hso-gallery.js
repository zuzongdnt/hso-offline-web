const gallery = document.querySelector('.hso-gallery');
const slides = [...document.querySelectorAll('.shot[data-gallery]')];
const preview = gallery.querySelector('img');
const caption = gallery.querySelector('p');
let current = 0;

function show(index) {
  current = (index + slides.length) % slides.length;
  const shot = slides[current];
  preview.src = shot.href;
  preview.alt = shot.querySelector('img').alt;
  caption.textContent = `${current + 1} / ${slides.length} · ${preview.alt}`;
}

document.querySelector('.featured').addEventListener('click', (event) => {
  const link = event.target.closest('[data-gallery]');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  event.preventDefault();
  show(slides.indexOf(link.closest('.card').querySelector('.shot')));
  gallery.showModal();
});

gallery.querySelector('[data-back]').addEventListener('click', () => show(current - 1));
gallery.querySelector('[data-next]').addEventListener('click', () => show(current + 1));
gallery.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') show(current - 1);
  if (event.key === 'ArrowRight') show(current + 1);
});
