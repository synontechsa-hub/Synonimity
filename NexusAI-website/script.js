document.addEventListener('DOMContentLoaded', () => {
    // 1. One-shot Counter Animation
    const stats = document.querySelectorAll('.s-val');

    function animateValue(el, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = progress * (end - start) + start;

            if (el.innerText.includes('M')) {
                el.innerText = current.toFixed(2) + 'M';
            } else if (el.innerText.includes('%')) {
                el.innerText = current.toFixed(1) + '%';
            } else {
                el.innerText = Math.floor(current) + el.innerText.replace(/[0-9.]/g, '');
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    stats.forEach(stat => {
        const text = stat.innerText;
        if (text.includes('M')) {
            const target = parseFloat(text);
            const start = target * 0.85;
            animateValue(stat, start, target, 1500);
        }
    });

    // 2. Refactored Scroll Reveal
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-target').forEach(el => {
        observer.observe(el);
    });

    // 3. Hamburger Menu & Overlay
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    let navOverlay = document.getElementById('nav-overlay');

    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.id = 'nav-overlay';
        document.body.prepend(navOverlay);
    }

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    if (hamburger && navMenu && navOverlay) {
        hamburger.addEventListener('click', toggleMenu);
        navOverlay.addEventListener('click', toggleMenu);

        // Close menu when a link is clicked
        document.querySelectorAll('nav ul a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 4. Demo Modal Logic
    const demoModal = document.getElementById('demo-modal');
    const openDemoBtn = document.getElementById('open-demo');
    const closeBtns = document.querySelectorAll('.modal-close, .modal-close-btn');
    const demoForm = document.getElementById('demo-form');
    const formView = document.getElementById('modal-form-view');
    const successView = document.getElementById('modal-success-view');

    if (openDemoBtn && demoModal) {
        openDemoBtn.addEventListener('click', () => {
            demoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            formView.style.display = 'block';
            successView.style.display = 'none';
        });

        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                demoModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        demoModal.addEventListener('click', (e) => {
            if (e.target === demoModal) {
                demoModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        if (demoForm) {
            demoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                formView.style.display = 'none';
                successView.style.display = 'block';
            });
        }
    }

    // 5. Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-q');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach(i => i.classList.remove('open'));
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });
});
