document.addEventListener('DOMContentLoaded', () => {
    // Custom cursor elements
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;

    // Mouse move tracking
    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        if (cursor) {
            cursor.style.left = mx + 'px';
            cursor.style.top = my + 'px';
        }
    });

    // Smooth ring animation
    function animateRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        if (ring) {
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
        }
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Interactive elements hover logic
    const interactiveSelectors = 'a, button, .service-item, .process-step, .filter-btn, .project-card';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor && ring) {
                cursor.style.width = '12px';
                cursor.style.height = '12px';
                ring.style.width = '52px';
                ring.style.height = '52px';
                ring.style.borderColor = 'var(--gold2)';
                ring.style.backgroundColor = 'rgba(184,151,90,0.05)';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursor && ring) {
                cursor.style.width = '8px';
                cursor.style.height = '8px';
                ring.style.width = '36px';
                ring.style.height = '36px';
                ring.style.borderColor = 'rgba(184,151,90,0.5)';
                ring.style.backgroundColor = 'transparent';
            }
        });
    });

    // Mobile Hamburger Menu Toggle
    const hamburger = document.getElementById('navHamburger');
    const body = document.body;

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            body.classList.toggle('nav-open');
            hamburger.textContent = body.classList.contains('nav-open') ? '✕' : '☰';
        });
    }

    // Navigation and section tracking
    const sections = document.querySelectorAll('section');
    const dots = document.querySelectorAll('.progress-dot');
    const nav = document.getElementById('mainNav');

    // Smooth scroll for progress dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            if (sections[i]) {
                sections[i].scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Scroll Observer for dots, fade-ups and nav background
    const observerOptions = {
        threshold: [0.1, 0.4]
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            // Update nav background if we leave hero
            if (entry.target.id === 's1') {
                if (entry.intersectionRatio < 0.9) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }

            if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
                // Update active dot
                const idx = Array.from(sections).indexOf(entry.target);
                dots.forEach(d => d.classList.remove('active'));
                if (dots[idx]) dots[idx].classList.add('active');

                // Trigger fade-up animations
                entry.target.querySelectorAll('.fade-up').forEach(el => {
                    el.classList.add('visible');
                });
            }
        });
    }, observerOptions);

    sections.forEach(s => observer.observe(s));

    // Handle scroll for nav background on pages without the ID 's1'
    if (!document.getElementById('s1')) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // Trigger hero animations immediately on load
    const hero = document.getElementById('s1');
    if (hero) {
        hero.querySelectorAll('.fade-up').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), 100 + (i * 100));
        });
    }
});
