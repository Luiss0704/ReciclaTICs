const observerOptions = { threshold: 0.15 };

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observa todas las variantes de animación en el sitio
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger-1, .reveal-stagger-2, .reveal-stagger-3').forEach(element => {
    observer.observe(element);
});

// Menú desplegable en vista móvil
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const menuText = menuToggle ? menuToggle.querySelector('.menu-text') : null;
const menuIcon = menuToggle ? menuToggle.querySelector('.menu-icon') : null;

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isOpen = navMenu.classList.contains('active');

        if (menuText) menuText.textContent = isOpen ? 'Cerrar' : 'Menú';
        if (menuIcon) menuIcon.textContent = isOpen ? '✕' : '☰';
    });
}