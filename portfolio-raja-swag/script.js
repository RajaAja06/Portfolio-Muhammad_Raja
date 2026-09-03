const body = document.body;

// Loader
const loader = document.getElementById('loader');
const loaderCount = document.getElementById('loaderCount');
const loaderLine = loader.querySelector('.loader-line span');
let load = 0;
const loadTimer = setInterval(() => {
  load += Math.ceil(Math.random() * 11);
  if (load >= 100) load = 100;
  loaderCount.textContent = String(load).padStart(2, '0');
  loaderLine.style.width = `${load}%`;
  if (load === 100) {
    clearInterval(loadTimer);
    setTimeout(() => loader.classList.add('done'), 180);
  }
}, 45);

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Invert theme
const invertBtn = document.getElementById('invertBtn');
invertBtn.addEventListener('click', () => {
  body.classList.toggle('invert');
  localStorage.setItem('raja-theme', body.classList.contains('invert') ? 'invert' : 'normal');
});
if (localStorage.getItem('raja-theme') === 'invert') body.classList.add('invert');

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const menuClose = document.getElementById('menuClose');
const mobileMenu = document.getElementById('mobileMenu');
function setMenu(open) {
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuBtn.setAttribute('aria-expanded', String(open));
  body.classList.toggle('menu-open', open);
}
menuBtn.addEventListener('click', () => setMenu(true));
menuClose.addEventListener('click', () => setMenu(false));
mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

// Certificate modal
const modal = document.getElementById('certModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
let lastFocused = null;

function openModal(card) {
  lastFocused = document.activeElement;
  modalImage.src = card.dataset.image;
  modalImage.alt = `Sertifikat ${card.dataset.title}`;
  modalTitle.textContent = card.dataset.title;
  modalMeta.textContent = card.dataset.meta;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  body.classList.add('modal-open');
  modal.querySelector('.modal-close').focus();
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  body.classList.remove('modal-open');
  if (lastFocused) lastFocused.focus();
}
document.querySelectorAll('.cert-row').forEach((card) => {
  card.addEventListener('click', () => openModal(card));
  card.querySelector('.cert-open').addEventListener('click', (e) => {
    e.stopPropagation();
    openModal(card);
  });
});
document.querySelectorAll('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal.classList.contains('open')) closeModal();
    if (mobileMenu.classList.contains('open')) setMenu(false);
  }
});

// Custom cursor
if (window.matchMedia('(pointer:fine)').matches) {
  const cursor = document.querySelector('.cursor');
  const dot = document.querySelector('.cursor-dot');
  let mx = -100, my = -100, cx = -100, cy = -100;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`; });
  function animateCursor() {
    cx += (mx - cx) * 0.16;
    cy += (my - cy) * 0.16;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll('a, button, .cert-row').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

// Magnetic micro interaction
if (window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * .13}px, ${y * .13}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

// Hero tilt
const tilt = document.querySelector('[data-tilt]');
if (tilt && window.matchMedia('(pointer:fine)').matches) {
  tilt.addEventListener('mousemove', (e) => {
    const r = tilt.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - .5) * -5;
    const ry = ((e.clientX - r.left) / r.width - .5) * 5;
    tilt.querySelector('.image-frame').style.transform = `rotate(1.2deg) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  tilt.addEventListener('mouseleave', () => {
    tilt.querySelector('.image-frame').style.transform = 'rotate(1.2deg)';
  });
}
