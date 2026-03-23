/**
 * CYBER-GLASS SPATIAL UI PORTFOLIO - JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCustomCursor();
    initScrollReveal();
    initTiltEffect();
    initNavbar();
});

/* ===== 0. THEME TOGGLE ===== */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

/* ===== 2. CUSTOM CURSOR ===== */
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const cursorBlur = document.getElementById('cursor-blur');
    
    // Fallback if cursor elements don't exist
    if (!cursor || !cursorBlur) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Follow mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
        
        // Blur follows with slight lag for cool effect
        cursorBlur.style.left = `${mouseX}px`;
        cursorBlur.style.top = `${mouseY}px`;
    });

    // Hover state
    const interactables = document.querySelectorAll('a, button, .tilt-card, .social-glass');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });
}

/* ===== 3. SCROLL REVEAL ===== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    function checkReveal() {
        for (let i = 0; i < reveals.length; i++) {
            const elementTop = reveals[i].getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('visible');
            }
        }
    }

    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Trigger once on load
}

/* ===== 4. 3D TILT EFFECT ===== */
function initTiltEffect() {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation. Range is roughly -10deg to 10deg.
            const xRotation = -((y - rect.height / 2) / rect.height) * 15;
            const yRotation = ((x - rect.width / 2) / rect.width) * 15;

            // Define the inner card that actually tilts
            const inner = card.querySelector('.glass-panel');
            if(inner) {
                inner.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            const inner = card.querySelector('.glass-panel');
            if(inner) {
                inner.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                inner.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            }
        });

        card.addEventListener('mouseenter', () => {
            const inner = card.querySelector('.glass-panel');
            if(inner) {
                inner.style.transition = 'none';
            }
        });
    });
}

/* ===== 5. NAVBAR BLUR ON SCROLL ===== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll offset for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Adjust for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });
}
