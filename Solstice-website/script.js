document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL CART COUNT UPDATE ---
    const updateAllCartCounts = () => {
        const cart = JSON.parse(localStorage.getItem('solstice-cart')) || [];
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-trigger').forEach(trigger => {
            const baseText = trigger.classList.contains('mobile-link') ? 'Cart' : 'Cart';
            trigger.textContent = `${baseText} (${count})`;
        });
    };
    updateAllCartCounts();

    // Intersection Observer for reveal animations
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            if (!document.body.classList.contains('shop-page')) {
                header.classList.remove('scrolled');
            }
        }
    });

    // Simple "Smooth" parallax for hero image
    const heroImage = document.querySelector('.image-inner img');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const speed = 0.2;
            const yPos = -(window.scrollY * speed);
            heroImage.style.transform = `translateY(${yPos}px) scale(1.1)`;
        });
    }

    // --- MOBILE NAVIGATION ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (hamburger && mobileMenu) {
        const toggleMobileMenu = () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        };

        hamburger.addEventListener('click', toggleMobileMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!link.classList.contains('cart-trigger')) {
                    toggleMobileMenu();
                }
            });
        });
    }

    // --- CART FUNCTIONALITY ---
    let cart = JSON.parse(localStorage.getItem('solstice-cart')) || [];
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalValue = document.getElementById('cartTotalValue');
    const cartTriggers = document.querySelectorAll('.cart-trigger');
    const closeCartBtn = document.querySelector('.close-cart');
    const quickAddBtns = document.querySelectorAll('.quick-add');

    // Update cart UI count
    const updateCartCount = () => {
        updateAllCartCounts();
    };

    // Save cart to localStorage
    const saveCart = () => {
        localStorage.setItem('solstice-cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    };

    // Render cart items
    const renderCart = () => {
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
            cartTotalValue.textContent = 'R 0.00';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const itemEl = document.createElement('div');
            itemEl.classList.add('cart-item');
            itemEl.innerHTML = `
                <img class="cart-item-img" src="${item.imgSrc}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R ${item.price.toLocaleString()}.00 × ${item.quantity}</p>
                    <button class="remove-item" data-index="${index}" style="background:none; border:none; color: #999; cursor:pointer; font-size: 0.7rem; text-decoration: underline; padding: 0; margin-top: 0.5rem;">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        cartTotalValue.textContent = `R ${total.toLocaleString()}.00`;

        // Add remove listeners
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                cart.splice(index, 1);
                saveCart();
            });
        });
    };

    // Toggle Cart
    const toggleCart = () => {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.toggle('active');
            cartOverlay.classList.toggle('active');

            // Close mobile menu if it's open
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = cartDrawer.classList.contains('active') ? 'hidden' : '';
            } else {
                document.body.style.overflow = cartDrawer.classList.contains('active') ? 'hidden' : '';
            }
        }
    };

    cartTriggers.forEach(trigger => trigger.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart();
    }));

    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Quick Add
    quickAddBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id;
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);
            const imgSrc = btn.dataset.img;

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1, imgSrc });
            }

            saveCart();
            toggleCart(); // Open cart to show addition
        });
    });

    // Initial render
    renderCart();

    // Newsletter form interaction
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterConfirmation = document.querySelector('.newsletter-confirmation');
    if (newsletterForm && newsletterConfirmation) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            newsletterForm.style.display = 'none';
            newsletterConfirmation.style.display = 'flex';
            newsletterConfirmation.style.opacity = '0';
            setTimeout(() => {
                newsletterConfirmation.style.transition = 'opacity 0.5s ease';
                newsletterConfirmation.style.opacity = '1';
            }, 10);
        });
    }

    // --- SHOP CATEGORY FILTERING ---
    const filterLinks = document.querySelectorAll('.category-filters a');
    const productCards = document.querySelectorAll('.product-card');

    if (filterLinks.length > 0) {
        filterLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Update active class
                filterLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                const filter = link.dataset.filter;

                productCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

});
