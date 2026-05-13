document.addEventListener('DOMContentLoaded', () => {

    // --- DARK MODE LOGIC ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('vela-theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark');
        themeToggle.textContent = '☀️';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark');
            const isDark = body.classList.contains('dark');
            themeToggle.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('vela-theme', isDark ? 'dark' : 'light');
            if (portfolioChart) updateChartColors(isDark);
        });
    }

    // --- MOBILE NAV ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    if (hamburger && mobileMenu) {
        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        };

        hamburger.addEventListener('click', toggleMenu);
        mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));
    }

    // --- CHART INITIALIZATION ---
    let portfolioChart;
    const chartEl = document.getElementById('portfolioChart');

    const chartDatasets = {
        '1W': {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [120000, 125000, 122000, 135000, 132000, 138000, 142500]
        },
        '1M': {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [108000, 115000, 129000, 142500]
        },
        '1Y': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [72000, 68000, 75000, 80000, 78000, 85000, 91000, 99000, 105000, 118000, 130000, 142500]
        },
        'ALL': {
            labels: ['2022', '2023', '2024'],
            data: [40000, 85000, 142500]
        }
    };

    const updateChartColors = (isDark) => {
        const textColor = isDark ? '#94A3B8' : '#5F738C';
        const gridColor = isDark ? 'rgba(255,255,255,0.05)' : '#E1E6ED';

        portfolioChart.options.scales.x.ticks.color = textColor;
        portfolioChart.options.scales.y.ticks.color = textColor;
        portfolioChart.options.scales.y.grid.color = gridColor;
        portfolioChart.update();
    };

    if (chartEl) {
        const ctx = chartEl.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(19, 48, 190, 0.1)');
        gradient.addColorStop(1, 'rgba(19, 48, 190, 0)');

        portfolioChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartDatasets['1W'].labels,
                datasets: [{
                    label: 'Portfolio Value',
                    data: chartDatasets['1W'].data,
                    borderColor: '#1330BE',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    backgroundColor: gradient,
                    pointRadius: 4,
                    pointBackgroundColor: '#FFFFFF',
                    pointBorderColor: '#1330BE',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: body.classList.contains('dark') ? '#94A3B8' : '#5F738C' } },
                    y: { grid: { color: body.classList.contains('dark') ? 'rgba(255,255,255,0.05)' : '#E1E6ED' }, ticks: { color: body.classList.contains('dark') ? '#94A3B8' : '#5F738C' } }
                }
            }
        });

        const buttons = document.querySelectorAll('.timeframe-selector button');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const timeframe = btn.dataset.timeframe;
                portfolioChart.data.labels = chartDatasets[timeframe].labels;
                portfolioChart.data.datasets[0].data = chartDatasets[timeframe].data;
                portfolioChart.update();
            });
        });
    }

    // --- LIVE PRICE FETCHING & STATUS ---
    const updatePriceStatus = (isLive) => {
        const statusEls = document.querySelectorAll('#price-status');
        statusEls.forEach(el => {
            if (isLive) {
                el.innerHTML = '<span class="status-dot"></span> Live';
                el.style.color = 'var(--success-green)';
            } else {
                el.innerHTML = '<span class="status-dot"></span> Stale';
                el.style.color = '#E74C3C';
            }
        });
    };

    const fetchLivePrices = async () => {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=zar&include_24hr_change=true');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            // Update Index Page
            const btcPriceEl = document.getElementById('price-btc');
            const ethPriceEl = document.getElementById('price-eth');
            if (btcPriceEl) btcPriceEl.textContent = `R ${data.bitcoin.zar.toLocaleString()}`;
            if (ethPriceEl) ethPriceEl.textContent = `R ${data.ethereum.zar.toLocaleString()}`;

            // Update Markets Page
            const mktBtcPrice = document.getElementById('market-price-btc');
            const mktBtcChange = document.getElementById('market-change-btc');
            const mktEthPrice = document.getElementById('market-price-eth');
            const mktEthChange = document.getElementById('market-change-eth');

            if (mktBtcPrice) mktBtcPrice.textContent = `R ${data.bitcoin.zar.toLocaleString()}`;
            if (mktBtcChange) {
                const change = data.bitcoin.zar_24h_change.toFixed(2);
                mktBtcChange.textContent = `${change > 0 ? '+' : ''}${change}%`;
                mktBtcChange.style.color = change > 0 ? 'var(--success-green)' : '#E74C3C';
            }
            if (mktEthPrice) mktEthPrice.textContent = `R ${data.ethereum.zar.toLocaleString()}`;
            if (mktEthChange) {
                const change = data.ethereum.zar_24h_change.toFixed(2);
                mktEthChange.textContent = `${change > 0 ? '+' : ''}${change}%`;
                mktEthChange.style.color = change > 0 ? 'var(--success-green)' : '#E74C3C';
            }
            updatePriceStatus(true);
        } catch (error) {
            console.error('Error fetching prices:', error);
            updatePriceStatus(false);
        }
    };

    fetchLivePrices();
    setInterval(fetchLivePrices, 60000);
});
