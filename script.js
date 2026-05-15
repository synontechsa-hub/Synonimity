document.addEventListener('DOMContentLoaded', () => {

    // --- ANIMATED COUNTERS ---
    const stats = document.querySelectorAll('.stat-num');

    const animateValue = (el, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);

            // Special handling for CS50x
            if (el.textContent.includes('CS50')) {
                el.textContent = 'CS50x';
            } else {
                el.textContent = current + '+';
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.textContent.includes('20')) animateValue(el, 0, 20, 2000);
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    // --- REVEAL ON SCROLL ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- NAV SCROLL EFFECT ---
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- GITHUB SYNC FOR SYNONTECH CARD ---
    const synonTechStatus = document.querySelector('.lock-tag');

    async function syncStudioRepos() {
        try {
            const response = await fetch('https://api.github.com/users/SynonTechSA-Hub/repos?sort=updated');
            const repos = await response.json();
            
            // Filter out forks and website repos
            const studioRepos = repos.filter(repo => !repo.fork && !repo.name.toLowerCase().endsWith('-website'));
            const projectCount = studioRepos.length;
            
            if (synonTechStatus) {
                // Find the most recently updated repo
                const latestRepo = studioRepos[0];
                const lastUpdated = new Date(latestRepo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                
                synonTechStatus.innerHTML = `<span>${projectCount} Projects</span> • <small>Updated ${lastUpdated}</small>`;
                synonTechStatus.style.background = 'var(--accent)';
            }
        } catch (err) {
            console.warn('Github sync failed');
        }
    }
    syncStudioRepos();

    // --- DYNAMIC YEAR ---
    const yearElements = document.querySelectorAll('.year');
    yearElements.forEach(el => el.textContent = new Date().getFullYear());

    // --- INDUSTRIAL SLIDESHOW ---
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };
        setInterval(nextSlide, 5000); // Change image every 5 seconds
    }

    // --- SUBTLE PARALLAX ---
    document.addEventListener('mousemove', (e) => {
        const amount = 15;
        const x = (e.clientX / window.innerWidth - 0.5) * amount;
        const y = (e.clientY / window.innerHeight - 0.5) * amount;
        
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translate(${x}px, ${y}px)`;
        }
    });

});
