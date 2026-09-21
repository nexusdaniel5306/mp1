const nav = document.querySelector('.site-nav');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sectionLinks = [...document.querySelectorAll('.nav-menu .nav-link')];
const sections = [...document.querySelectorAll('.section-observer')];

const scrollToSection = (event) => {
    const target = document.querySelector(event.currentTarget.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
};

navLinks.forEach((link) => link.addEventListener('click', scrollToSection));
menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
});

const updateNavigation = () => {
    nav.classList.toggle('is-compact', window.scrollY > 24);
    const marker = nav.offsetHeight + 12;
    let currentId = sections[0].id;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        currentId = sections[sections.length - 1].id;
    } else {
        sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= marker) currentId = section.id;
        });
    }
    sectionLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`));
};

window.addEventListener('scroll', updateNavigation, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();

const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.carousel-dots button')];
let currentSlide = 0;

const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === currentSlide;
        slide.classList.toggle('active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
    });
    dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === currentSlide;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', String(isActive));
    });
};

document.querySelector('.carousel-arrow.previous').addEventListener('click', () => showSlide(currentSlide - 1));
document.querySelector('.carousel-arrow.next').addEventListener('click', () => showSlide(currentSlide + 1));
dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));

const modalContent = {
    pantheon: { title: 'A room shaped like the cosmos', copy: 'The rotunda is organized around a remarkable geometric equality: its interior height and diameter are both approximately 43 meters. The oculus completes the composition, admitting a moving circle of daylight that makes time visible inside the building.', material: 'Roman concrete, brick, granite, marble', idea: 'A sphere held within a cylinder' },
    wall: { title: 'Architecture at territorial scale', copy: 'The Great Wall is not one continuous wall but a vast network built and rebuilt by successive states. Its masonry, rammed earth, towers, and passes adapt to local terrain while serving a common defensive purpose.', material: 'Rammed earth, brick, stone, timber', idea: 'Landscape transformed into infrastructure' },
    angkor: { title: 'A temple as a map of the universe', copy: 'Angkor Wat combines concentric galleries, ascending towers, and a broad moat. Its plan translates sacred cosmology into an architectural journey from the outer world toward a symbolic center.', material: 'Sandstone and laterite', idea: 'Cosmology expressed through procession' },
};

const modal = document.querySelector('.modal');
const modalPanel = document.querySelector('.modal-panel');
const modalClose = document.querySelector('.modal-close');
let lastFocusedElement;

const openModal = (key, trigger) => {
    const content = modalContent[key];
    if (!content) return;
    lastFocusedElement = trigger;
    document.querySelector('#modal-title').textContent = content.title;
    document.querySelector('#modal-copy').textContent = content.copy;
    document.querySelector('#modal-material').textContent = content.material;
    document.querySelector('#modal-idea').textContent = content.idea;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.setTimeout(() => modalClose.focus(), 100);
};

const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocusedElement) lastFocusedElement.focus();
};

document.querySelectorAll('[data-modal]').forEach((button) => button.addEventListener('click', () => openModal(button.dataset.modal, button)));
document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('open')) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'Tab') {
        const focusable = [...modalPanel.querySelectorAll('button, a[href]')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
});

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
