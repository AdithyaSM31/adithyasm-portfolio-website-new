export class GooeyNav {
    constructor(container, options = {}) {
        this.container = container;
        this.items = options.items || [];
        this.animationTime = options.animationTime || 600;
        this.particleCount = options.particleCount || 15;
        this.particleDistances = options.particleDistances || [90, 10];
        this.particleR = options.particleR || 100;
        this.timeVariance = options.timeVariance || 300;
        this.colors = options.colors || [1, 2, 3, 1, 2, 3, 1, 4];
        this.initialActiveIndex = options.initialActiveIndex || 0;
        this.activeIndex = this.initialActiveIndex;

        this.init();
    }

    init() {
        this.setupDOM();
        this.setupEventListeners();
        
        // Initial positioning
        requestAnimationFrame(() => {
            const activeLi = this.navRef.querySelectorAll('li')[this.activeIndex];
            if (activeLi) {
                this.updateEffectPosition(activeLi);
                this.textRef.classList.add('active');
            }
        });

        // Resize observer
        this.resizeObserver = new ResizeObserver(() => {
            const currentActiveLi = this.navRef.querySelectorAll('li')[this.activeIndex];
            if (currentActiveLi) {
                this.updateEffectPosition(currentActiveLi);
            }
        });
        this.resizeObserver.observe(this.container);
    }

    setupDOM() {
        this.container.classList.add('gooey-nav-container');
        
        // Create nav structure
        const nav = document.createElement('nav');
        this.navRef = document.createElement('ul');
        
        this.items.forEach((item, index) => {
            const li = document.createElement('li');
            if (index === this.activeIndex) li.classList.add('active');
            
            const a = document.createElement('a');
            a.href = item.href;
            a.textContent = item.label;
            a.dataset.index = index;
            a.className = 'nav-link'; // Add nav-link class for script.js
            a.setAttribute('onclick', 'closeMenu()'); // Add closeMenu for mobile
            
            li.appendChild(a);
            this.navRef.appendChild(li);
        });
        
        nav.appendChild(this.navRef);
        this.container.appendChild(nav);
        
        // Create effects
        this.filterRef = document.createElement('span');
        this.filterRef.className = 'effect filter';
        this.container.appendChild(this.filterRef);
        
        this.textRef = document.createElement('span');
        this.textRef.className = 'effect text';
        this.container.appendChild(this.textRef);
    }

    setupEventListeners() {
        this.navRef.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            e.preventDefault();
            const index = parseInt(link.dataset.index);
            this.handleClick(link.parentElement, index);
            
            // Navigate if needed (optional, since we preventDefault)
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    noise(n = 1) {
        return n / 2 - Math.random() * n;
    }

    getXY(distance, pointIndex, totalPoints) {
        const angle = ((360 + this.noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
        return [distance * Math.cos(angle), distance * Math.sin(angle)];
    }

    createParticle(i, t, d, r) {
        let rotate = this.noise(r / 10);
        return {
            start: this.getXY(d[0], this.particleCount - i, this.particleCount),
            end: this.getXY(d[1] + this.noise(7), this.particleCount - i, this.particleCount),
            time: t,
            scale: 1 + this.noise(0.2),
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
        };
    }

    makeParticles(element) {
        const d = this.particleDistances;
        const r = this.particleR;
        const bubbleTime = this.animationTime * 2 + this.timeVariance;
        element.style.setProperty('--time', `${bubbleTime}ms`);

        for (let i = 0; i < this.particleCount; i++) {
            const t = this.animationTime * 2 + this.noise(this.timeVariance * 2);
            const p = this.createParticle(i, t, d, r);
            element.classList.remove('active');

            setTimeout(() => {
                const particle = document.createElement('span');
                const point = document.createElement('span');
                particle.classList.add('particle');
                particle.style.setProperty('--start-x', `${p.start[0]}px`);
                particle.style.setProperty('--start-y', `${p.start[1]}px`);
                particle.style.setProperty('--end-x', `${p.end[0]}px`);
                particle.style.setProperty('--end-y', `${p.end[1]}px`);
                particle.style.setProperty('--time', `${p.time}ms`);
                particle.style.setProperty('--scale', `${p.scale}`);
                particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
                particle.style.setProperty('--rotate', `${p.rotate}deg`);

                point.classList.add('point');
                particle.appendChild(point);
                element.appendChild(particle);
                
                requestAnimationFrame(() => {
                    element.classList.add('active');
                });
                
                setTimeout(() => {
                    try {
                        if (particle.parentNode === element) {
                            element.removeChild(particle);
                        }
                    } catch (e) {
                        // Ignore
                    }
                }, t);
            }, 30);
        }
    }

    updateEffectPosition(element) {
        const containerRect = this.container.getBoundingClientRect();
        const pos = element.getBoundingClientRect();

        const styles = {
            left: `${pos.x - containerRect.x}px`,
            top: `${pos.y - containerRect.y}px`,
            width: `${pos.width}px`,
            height: `${pos.height}px`
        };
        
        Object.assign(this.filterRef.style, styles);
        Object.assign(this.textRef.style, styles);
        this.textRef.innerText = element.innerText;
    }

    handleClick(liEl, index) {
        if (this.activeIndex === index) return;

        // Update active state in DOM
        const lis = this.navRef.querySelectorAll('li');
        lis[this.activeIndex].classList.remove('active');
        liEl.classList.add('active');

        this.activeIndex = index;
        this.updateEffectPosition(liEl);

        // Clear existing particles
        const particles = this.filterRef.querySelectorAll('.particle');
        particles.forEach(p => this.filterRef.removeChild(p));

        // Reset text animation
        this.textRef.classList.remove('active');
        void this.textRef.offsetWidth; // Trigger reflow
        this.textRef.classList.add('active');

        // Create new particles
        this.makeParticles(this.filterRef);
    }

    destroy() {
        this.resizeObserver.disconnect();
    }
}
