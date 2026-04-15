// ==================== NAVBAR SCROLL ====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ==================== MOBILE MENU ====================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

// ==================== SCROLL ANIMATIONS ====================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ==================== NUMBER COUNTER ====================
function animateCount(el) {
    const target = parseInt(el.dataset.count);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        if (target >= 1000) {
            el.textContent = current.toLocaleString('es-AR');
        } else {
            el.textContent = current;
        }

        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCount(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.proof-number[data-count]').forEach(el => counterObserver.observe(el));

// ==================== LUCIDE ICONS ====================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// ==================== FORMULARIO DE SOPORTE ====================
const supportForm = document.getElementById('supportForm');
if (supportForm) {
    supportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('soporteSubmit');
        const status = document.getElementById('soporteStatus');
        const data = {
            nombre: document.getElementById('soporteNombre').value.trim(),
            email: document.getElementById('soporteEmail').value.trim(),
            asunto: document.getElementById('soporteAsunto').value.trim(),
            mensaje: document.getElementById('soporteMensaje').value.trim(),
        };

        btn.disabled = true;
        btn.textContent = 'Enviando...';
        status.textContent = '';
        status.className = 'support-status';

        try {
            const resp = await fetch('https://app.stockmatepro.com/api/soporte', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await resp.json();
            if (resp.ok) {
                status.textContent = '✓ Mensaje enviado. Te responderemos pronto.';
                status.className = 'support-status support-status-ok';
                supportForm.reset();
            } else {
                status.textContent = json.error || 'Ocurrio un error. Intentá más tarde.';
                status.className = 'support-status support-status-error';
            }
        } catch (err) {
            status.textContent = 'No pudimos conectar. Escribinos a soporte@stockmatepro.com';
            status.className = 'support-status support-status-error';
        } finally {
            btn.disabled = false;
            btn.textContent = 'Enviar mensaje';
        }
    });
}
