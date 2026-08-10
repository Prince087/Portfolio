/**
 * CYBER-GLASS SPATIAL UI PORTFOLIO - JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCustomCursor();
    initScrollReveal();
    initTiltEffect();
    initNavbar();
    initSkillsWindow();
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

    // Hover state — delegated instead of one listener per element.
    // Per-element mouseenter/mouseleave breaks when interactables are
    // nested (e.g. a .project-link button inside a .tilt-card): leaving
    // the inner button fires ITS mouseleave and turns "hovering" off,
    // but nothing turns it back on until the outer card is re-entered
    // from scratch — so a second hover directly on the button does
    // nothing and the click doesn't register. Using bubbling
    // mouseover/mouseout with relatedTarget checks avoids that stuck
    // state regardless of nesting.
    const interactableSelector = 'a, button, .tilt-card, .social-glass';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactableSelector)) {
            document.body.classList.add('hovering');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (!e.target.closest(interactableSelector)) return;
        const movingInto = e.relatedTarget && e.relatedTarget.closest
            ? e.relatedTarget.closest(interactableSelector)
            : null;
        if (!movingInto) {
            document.body.classList.remove('hovering');
        }
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
            // Freeze the tilt while hovering a project link/button so it
            // doesn't keep rotating out from under the cursor mid-click.
            if (e.target.closest('.project-link')) {
                return;
            }

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

/* ===== 6. FLOATING SKILLS WINDOW CONTROLS & DRAG ===== */
function initSkillsWindow() {
    const skillsWindow = document.getElementById('skills-window');
    const windowHeader = document.getElementById('skills-window-header');
    const tabBtns = document.querySelectorAll('.skills-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.skills-tab-content');
    
    const closeBtn = document.getElementById('window-close-btn');
    const minimizeBtn = document.getElementById('window-minimize-btn');
    const expandBtn = document.getElementById('window-expand-btn');
    const restoreBtn = document.getElementById('skills-restore-btn');

    if (!skillsWindow) return;

    // --- Tab Switching Logic ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Toggle buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle contents
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('id') === targetTab) {
                    content.classList.add('active');
                    
                    // Reset progress bar animation on activation
                    const progressBars = content.querySelectorAll('.progress');
                    progressBars.forEach(bar => {
                        const originalWidth = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = originalWidth;
                        }, 50);
                    });
                }
            });
        });
    });

    // Initialize first tab progress bars on load
    const activeProgressBars = document.querySelectorAll('.skills-tab-content.active .progress');
    activeProgressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 300);
    });

    // --- Minimize / Close / Restore Logic ---
    function hideWindow() {
        skillsWindow.style.opacity = '0';
        skillsWindow.style.transform = 'translate3d(0, 50px, 0) scale(0.9)';
        skillsWindow.style.pointerEvents = 'none';
        setTimeout(() => {
            skillsWindow.style.display = 'none';
            if (restoreBtn) restoreBtn.style.display = 'flex';
        }, 300);
    }

    function showWindow() {
        if (restoreBtn) restoreBtn.style.display = 'none';
        skillsWindow.style.display = 'block';
        setTimeout(() => {
            skillsWindow.style.opacity = '1';
            skillsWindow.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) scale(1)`;
            skillsWindow.style.pointerEvents = 'auto';
            
            // Trigger progress animations
            const activeBars = skillsWindow.querySelectorAll('.skills-tab-content.active .progress');
            activeBars.forEach(bar => {
                const w = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = w;
                }, 50);
            });
        }, 50);
    }

    if (closeBtn) closeBtn.addEventListener('click', hideWindow);
    if (minimizeBtn) minimizeBtn.addEventListener('click', hideWindow);
    if (restoreBtn) restoreBtn.addEventListener('click', showWindow);

    // --- Drag and Drop Logic ---
    let isDragging = false;
    let startX, startY;
    let xOffset = 0, yOffset = 0;

    // Reset position logic (Green expand button)
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            xOffset = 0;
            yOffset = 0;
            skillsWindow.style.transform = 'translate3d(0, 0, 0)';
            skillsWindow.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
            setTimeout(() => {
                skillsWindow.style.transition = 'transform 0.1s ease-out, border-color var(--transition), box-shadow var(--transition)';
            }, 500);
        });
    }

    windowHeader.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    windowHeader.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        // Prevent default actions only if we click the header handle
        if (e.target === windowHeader || windowHeader.contains(e.target)) {
            // Ignore if clicking window button
            if (e.target.classList.contains('w-btn')) return;
            
            isDragging = true;
            skillsWindow.classList.add('dragging');
            skillsWindow.style.animation = 'none'; // stop floating drift
            skillsWindow.style.transition = 'none';

            if (e.type === 'touchstart') {
                startX = e.touches[0].clientX - xOffset;
                startY = e.touches[0].clientY - yOffset;
            } else {
                startX = e.clientX - xOffset;
                startY = e.clientY - yOffset;
            }
            e.preventDefault();
        }
    }

    function drag(e) {
        if (!isDragging) return;
        
        let clientX, clientY;
        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        // Screen boundary checking
        const padding = 20;
        const windowWidth = skillsWindow.offsetWidth;
        const windowHeight = skillsWindow.offsetHeight;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let targetX = clientX - startX;
        let targetY = clientY - startY;

        xOffset = targetX;
        yOffset = targetY;

        skillsWindow.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
        e.preventDefault();
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        skillsWindow.classList.remove('dragging');
        skillsWindow.style.transition = 'transform 0.1s ease-out, border-color var(--transition), box-shadow var(--transition)';
        // Resume drift animation after drag
        setTimeout(() => {
            if (!isDragging) {
                skillsWindow.style.animation = 'window-drift 8s infinite alternate ease-in-out';
            }
        }, 1000);
    }

    // Hook to custom cursor hover list
    const cursor = document.getElementById('cursor');
    if (cursor) {
        const elements = [windowHeader, restoreBtn, closeBtn, minimizeBtn, expandBtn, ...tabBtns];
        elements.forEach(el => {
            if (!el) return;
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }
}
