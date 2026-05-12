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

    // --- GITHUB SYNC FOR SYNONTECH CARD ---
    const synonTechStatus = document.querySelector('.lock-tag');

    async function syncStudioRepos() {
        try {
            const response = await fetch('https://api.github.com/users/SynonTechSA-Hub/repos');
            const repos = await response.json();
            const projectCount = repos.filter(repo => !repo.fork && !repo.name.toLowerCase().endsWith('-website')).length;
            if (synonTechStatus) {
                synonTechStatus.textContent = `${projectCount} Studio Projects`;
            }
        } catch (err) {
            console.warn('Github sync failed');
        }
    }
    syncStudioRepos();

    // --- MOBILE MENU ---
    const brand = document.querySelector('.brand');
    const navLinks = document.querySelector('.nav-links');

    // Simple toggle for mobile if we add a hamburger later
});
