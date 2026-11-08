// ===== Design 1: Monochrome =====

// 1. Header shrinks when you scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// 2. Mobile menu
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
});
// close menu after clicking a link
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  });
});

// 3. Fade-in elements when they scroll into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 4. Reviews slider
const slider = document.getElementById('slider');
const track = slider.querySelector('.slider__track');
const slides = slider.querySelectorAll('.slide');
const dotsBox = slider.querySelector('.slider__dots');
let current = 0;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', `Go to review ${i + 1}`);
  dot.addEventListener('click', () => goTo(i));
  dotsBox.appendChild(dot);
});

function goTo(index) {
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dotsBox.querySelectorAll('button').forEach((d, i) => d.classList.toggle('active', i === current));
}

slider.querySelectorAll('.slider__btn').forEach(btn => {
  btn.addEventListener('click', () => goTo(current + Number(btn.dataset.dir)));
});

let autoplay = setInterval(() => goTo(current + 1), 6000);
slider.addEventListener('mouseenter', () => clearInterval(autoplay));
slider.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo(current + 1), 6000); });
goTo(0);

// 5. Contact form (front-end check only; connect to Formspree / backend later)
const form = document.getElementById('form');
const msg = document.getElementById('formMsg');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  form.querySelectorAll('[required]').forEach(field => {
    const empty = !field.value.trim();
    const badEmail = field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value);
    const bad = empty || badEmail;
    field.classList.toggle('invalid', bad);
    if (bad) valid = false;
  });

  if (!valid) {
    msg.textContent = 'Please fill in your name, a valid email and your main goal.';
    msg.className = 'form__msg err';
    return;
  }

  msg.textContent = `Thanks ${form.name.value.split(' ')[0]}! I'll be in touch within 24 hours.`;
  msg.className = 'form__msg ok';
  form.reset();
});

// 6. Footer year
document.getElementById('year').textContent = new Date().getFullYear();
