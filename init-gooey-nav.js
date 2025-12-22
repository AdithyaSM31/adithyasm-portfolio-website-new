import { GooeyNav } from './gooey-nav.js';

document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('.nav-menu');
    if (!navContainer) return;

    // Get existing items
    const items = Array.from(navContainer.querySelectorAll('li a')).map(a => ({
        label: a.textContent,
        href: a.getAttribute('href')
    }));

    // Clear existing nav content but keep the container
    // We'll replace the UL with our GooeyNav container
    const parent = navContainer.parentElement;
    const gooeyContainer = document.createElement('div');
    // Replace the existing ul.nav-menu with our new container
    navContainer.replaceWith(gooeyContainer);
    
    // Add class for styling if needed, or reuse nav-menu class
    gooeyContainer.className = 'nav-menu-gooey nav-menu';

    // Inject SVG Filter for Gooey Effect
    const svgFilter = document.createElement('div');
    svgFilter.innerHTML = `
        <svg style="position: absolute; width: 0; height: 0; pointer-events: none;">
            <defs>
                <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="gooey" />
                    <feComposite in="SourceGraphic" in2="gooey" operator="atop"/>
                </filter>
            </defs>
        </svg>
    `;
    document.body.appendChild(svgFilter);

    const gooeyNav = new GooeyNav(gooeyContainer, {
        items: items,
        particleCount: 15,
        particleDistances: [90, 10],
        particleR: 20,
        initialActiveIndex: 0,
        animationTime: 600,
        timeVariance: 300,
        colors: [1, 2, 3, 4] // Using CSS variable indices
    });
    
    // Scroll Spy Logic
    let isManualScroll = false;
    let scrollTimeout;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px', // Active when section is near the top
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        if (isManualScroll) return; // Skip updates during manual scroll

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const index = items.findIndex(item => item.href === `#${id}`);
                if (index !== -1) {
                    gooeyNav.setActive(index);
                }
            }
        });
    }, observerOptions);

    // Handle manual scroll clicks
    gooeyContainer.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
            isManualScroll = true;
            clearTimeout(scrollTimeout);
            // Reset flag after scroll animation (approx 1s)
            scrollTimeout = setTimeout(() => {
                isManualScroll = false;
            }, 1000);
        }
    });

    items.forEach(item => {
        const id = item.href.replace('#', '');
        const section = document.getElementById(id);
        if (section) {
            observer.observe(section);
        }
    });

    console.log('GooeyNav initialized');
    // Re-initialize hamburger menu logic since we replaced the DOM
    if (typeof window.initHamburgerMenu === 'function') {
        console.log('Re-initializing hamburger menu for GooeyNav...');
        window.initHamburgerMenu();
    }});
