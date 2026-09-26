const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar scroll state
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Typewriter
const roles = [
  'Flutter Developer',
  'Business Systems That Ship',
  'Firebase · Supabase · PostgreSQL',
  'Arabic-first (RTL) Apps',
  'Android · Windows · Web'
];
const twEl = document.getElementById('typewriter-text');
let roleIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIdx];
  if (!deleting) {
    charIdx++;
    twEl.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIdx--;
    twEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
if (reduceMotion) twEl.textContent = roles[0];
else typeLoop();

// Stat counters
const statNums = document.querySelectorAll('.stat-num');
const statIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 30));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current;
      }, 40);
      statIO.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statIO.observe(el));

// Galleries: any [data-gallery] with .slide children auto-rotates while visible.
// Optional data-dots="<id>" renders clickable dots; data-interval sets the pace (ms).
const galleryIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => { entry.target._visible = entry.isIntersecting; });
}, { threshold: 0.3 });

document.querySelectorAll('[data-gallery]').forEach(initGallery);

function initGallery(root) {
  const slides = [...root.querySelectorAll('.slide')];
  root._slides = slides;
  root._index = 0;
  slides.forEach((img, i) => img.addEventListener('click', () => openLightbox(slides, i)));
  if (slides.length < 2) return;

  const dotsWrap = root.dataset.dots && document.getElementById(root.dataset.dots);
  const dots = [];
  if (dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Show screenshot ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => show(i));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
  }

  function show(i) {
    slides[root._index].classList.remove('active');
    dots[root._index]?.classList.remove('active');
    root._index = i;
    slides[i].classList.add('active');
    dots[i]?.classList.add('active');
  }

  let hovering = false;
  root.addEventListener('mouseenter', () => { hovering = true; });
  root.addEventListener('mouseleave', () => { hovering = false; });
  galleryIO.observe(root);

  if (reduceMotion) return;
  setInterval(() => {
    if (hovering || !root._visible || document.hidden) return;
    show((root._index + 1) % slides.length);
  }, parseInt(root.dataset.interval, 10) || 3200);
}

// Lightbox
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCaption = document.getElementById('lightbox-caption');
let lbSlides = [], lbIndex = 0, lbReturnFocus = null;

function openLightbox(slides, i) {
  lbSlides = slides;
  lbReturnFocus = document.activeElement;
  lightbox.classList.toggle('single', slides.length < 2);
  lightbox.hidden = false;
  document.body.classList.add('no-scroll');
  renderLightbox(i);
  lightbox.querySelector('.lb-close').focus();
}

function renderLightbox(i) {
  lbIndex = (i + lbSlides.length) % lbSlides.length;
  const src = lbSlides[lbIndex];
  lbImg.src = src.currentSrc || src.src;
  lbImg.alt = src.alt;
  lbCaption.textContent = lbSlides.length > 1
    ? `${src.alt} · ${lbIndex + 1} / ${lbSlides.length}`
    : src.alt;
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove('no-scroll');
  lbReturnFocus?.focus?.();
}

lightbox.addEventListener('click', (e) => {
  const action = e.target.closest('[data-lb]')?.dataset.lb;
  if (action === 'close' || e.target === lightbox) closeLightbox();
  else if (action === 'prev') renderLightbox(lbIndex - 1);
  else if (action === 'next') renderLightbox(lbIndex + 1);
});

document.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowLeft') renderLightbox(lbIndex - 1);
  else if (e.key === 'ArrowRight') renderLightbox(lbIndex + 1);
});

// Mobile menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');

function setMenu(open) {
  navLinks.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
}

burger.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
window.addEventListener('resize', () => {
  if (window.innerWidth > 640) setMenu(false);
});
