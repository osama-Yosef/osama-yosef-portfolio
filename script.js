// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar scroll state
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Typewriter
const roles = [
  'Flutter Developer',
  'Mobile Apps for Business & Industry',
  'Firebase & Real-time Systems',
  'Turning Workflows into Apps'
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
typeLoop();

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

// Al-Fardos gallery auto-rotate + dots
const shots = document.querySelectorAll('#alfardos-gallery .phone-shot');
const dotsWrap = document.getElementById('alfardos-dots');
let activeShot = 0;

shots.forEach((_, i) => {
  const dot = document.createElement('span');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => showShot(i));
  dotsWrap.appendChild(dot);
});

function showShot(i) {
  shots[activeShot].classList.remove('active');
  dotsWrap.children[activeShot].classList.remove('active');
  activeShot = i;
  shots[activeShot].classList.add('active');
  dotsWrap.children[activeShot].classList.add('active');
}

setInterval(() => {
  showShot((activeShot + 1) % shots.length);
}, 3200);

// Mobile burger menu (simple toggle of nav-links visibility)
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger?.addEventListener('click', () => {
  const isOpen = navLinks.style.display === 'flex';
  navLinks.style.display = isOpen ? 'none' : 'flex';
  navLinks.style.cssText += isOpen ? '' : `
    position: fixed; top: 64px; left: 0; right: 0;
    background: rgba(10,14,23,0.98); flex-direction: column;
    padding: 24px; gap: 20px; border-bottom: 1px solid rgba(255,255,255,0.08);
  `;
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 640) navLinks.style.display = 'none';
  });
});
