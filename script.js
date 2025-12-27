// GSAP Plugin Registration (Early registration)
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Three.js Space Environment
class SpaceEnvironment {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.stars = null;
        this.planets = [];
        this.particles = null;
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.init();
        this.createStars();
        this.createPlanets();
        this.createParticleSystem();
        this.animate();
        this.addEventListeners();
    }
    
    init() {
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // Renderer
        const canvas = document.getElementById('space-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Add fog for depth
        this.scene.fog = new THREE.Fog(0x0a0a0f, 1, 100);
    }
    
    createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 2000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // Random positions
            positions[i3] = (Math.random() - 0.5) * 200;
            positions[i3 + 1] = (Math.random() - 0.5) * 200;
            positions[i3 + 2] = (Math.random() - 0.5) * 200;
            
            // Random colors (blue to white)
            const color = new THREE.Color();
            color.setHSL(0.6 + Math.random() * 0.1, 0.3, 0.5 + Math.random() * 0.5);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }
    
    createPlanets() {
        // Create multiple planets with different properties
        const planetData = [
            { size: 0.5, color: 0x4a90e2, position: { x: 8, y: 3, z: -10 }, speed: 0.01 },
            { size: 0.3, color: 0xff6b35, position: { x: -6, y: -2, z: -15 }, speed: 0.015 },
            { size: 0.4, color: 0x9d4edd, position: { x: 12, y: -4, z: -8 }, speed: 0.008 },
            { size: 0.2, color: 0x00d4ff, position: { x: -10, y: 5, z: -12 }, speed: 0.02 }
        ];
        
        planetData.forEach((data, index) => {
            const geometry = new THREE.SphereGeometry(data.size, 32, 32);
            const material = new THREE.MeshPhongMaterial({ 
                color: data.color,
                shininess: 100,
                transparent: true,
                opacity: 0.8
            });
            
            const planet = new THREE.Mesh(geometry, material);
            planet.position.set(data.position.x, data.position.y, data.position.z);
            planet.userData = { speed: data.speed, originalY: data.position.y };
            
            this.planets.push(planet);
            this.scene.add(planet);
        });
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0x00d4ff, 0.8);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
    }
    
    createParticleSystem() {
        const particleCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = (Math.random() - 0.5) * 50;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;
            
            // Random velocities
            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x00d4ff,
            size: 1,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.time += 0.01;
        
        // Rotate stars
        if (this.stars) {
            this.stars.rotation.y += 0.0005;
            this.stars.rotation.x += 0.0002;
        }
        
        // Animate planets
        this.planets.forEach((planet, index) => {
            planet.rotation.y += planet.userData.speed;
            planet.position.y = planet.userData.originalY + Math.sin(this.time + index) * 0.5;
        });
        
        // Animate particles
        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;
            const velocities = this.particles.geometry.attributes.velocity.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];
                
                // Reset particles that go too far
                if (Math.abs(positions[i]) > 25) positions[i] = (Math.random() - 0.5) * 50;
                if (Math.abs(positions[i + 1]) > 25) positions[i + 1] = (Math.random() - 0.5) * 50;
                if (Math.abs(positions[i + 2]) > 25) positions[i + 2] = (Math.random() - 0.5) * 50;
            }
            
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
        
        // Mouse interaction
        this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouse.y * 0.5 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    addEventListeners() {
        // Mouse movement
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// GSAP Animations and Scroll Effects
class AnimationController {
    constructor() {
        this.initScrollAnimations();
        this.initLoadingAnimation();
        this.initNavigation();
        this.initSkillBars();
        this.initFloatingElements();
    }
    
    initScrollAnimations() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        
        // Hero section animations
        gsap.timeline()
            // .from('.hero-title .title-line', {
            //     y: 100,
            //     opacity: 0,
            //     duration: 1,
            //     stagger: 0.2,
            //     ease: 'power3.out'
            // })
            .from('.hero-description', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            }, '-=0.5')
            .from('.hero-buttons', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.3');
        
        // Section animations
        gsap.utils.toArray('.section').forEach((section, index) => {
            gsap.from(section.querySelector('.section-title'), {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
        
        // About section
        gsap.from('.about-content', {
            scrollTrigger: {
                trigger: '#about',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
        
        // Project cards
        gsap.utils.toArray('.project-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power2.out'
            });
        });
        
        // Timeline items
        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                x: index % 2 === 0 ? -50 : 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
    }
    
    initLoadingAnimation() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressBar = document.querySelector('.loading-progress');
        
        if (!loadingScreen || !progressBar) {
            console.warn('Loading elements not found');
            return;
        }
        
        console.log('Starting loading animation');
        
        // Function to hide loading screen
        const hideLoadingScreen = () => {
            if (loadingScreen && loadingScreen.style.display !== 'none') {
                console.log('Hiding loading screen via animation');
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    loadingScreen.classList.add('hidden');
                    console.log('Loading screen hidden');
                }, 500);
            }
        };
        
        // Simulate loading progress
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 20 + 10; // Faster progress
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                
                // Hide loading screen after completion
                setTimeout(hideLoadingScreen, 300);
            }
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
        }, 80); // Faster interval
        
        // Fallback: hide loading screen after 3 seconds regardless
        setTimeout(() => {
            console.log('Loading timeout - forcing hide');
            clearInterval(loadingInterval);
            hideLoadingScreen();
        }, 3000);
    }
    
    initNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!hamburger || !navMenu || !navLinks.length) {
            console.warn('Navigation elements not found');
            return;
        }
        
        console.log('Navigation initialized successfully');
        
        // Mobile menu toggle with enhanced logging
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger clicked!');
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            console.log('Nav menu active state:', navMenu.classList.contains('active'));
        });
        
        // Simple and reliable smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                console.log('Nav link clicked:', link.getAttribute('href'));
                
                // Close mobile menu
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                
                // Get target section
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Use native smooth scroll - most reliable
                    const headerOffset = 80;
                    const elementPosition = targetSection.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
        
        // Navbar background on scroll
        try {
            ScrollTrigger.create({
                start: 'top -80',
                end: 99999,
                toggleClass: {className: 'scrolled', targets: '.navbar'}
            });
        } catch (error) {
            console.warn('ScrollTrigger not available:', error);
        }
    }
    
    initSkillBars() {
        // Ensure skills are visible by default
        const skillItems = document.querySelectorAll('.skill-item');
        
        // Set initial state
        skillItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        });
        
        // Animate skill items on scroll with error handling
        skillItems.forEach((item, index) => {
            try {
                ScrollTrigger.create({
                    trigger: item,
                    start: 'top 85%',
                    onEnter: () => {
                        // Reset and animate
                        gsap.set(item, { x: -50, opacity: 0 });
                        gsap.to(item, {
                            x: 0,
                            opacity: 1,
                            duration: 0.6,
                            delay: index * 0.1,
                            ease: 'power2.out'
                        });
                    }
                });
            } catch (error) {
                console.warn('ScrollTrigger error for skill item:', error);
                // Fallback: ensure item is visible
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }
        });
        
        // Add click effects to skill items with error handling
        skillItems.forEach(item => {
            try {
                item.addEventListener('click', () => {
                    gsap.to(item, {
                        scale: 0.95,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.inOut'
                    });
                });
            } catch (error) {
                console.warn('Click event error for skill item:', error);
            }
        });
        
        // Fallback: ensure all skills are visible after 2 seconds
        setTimeout(() => {
            skillItems.forEach(item => {
                if (item.style.opacity === '0' || item.style.opacity === '') {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }
            });
        }, 2000);
    }
    
    initFloatingElements() {
        gsap.utils.toArray('.floating-object').forEach((element, index) => {
            const speed = parseFloat(element.getAttribute('data-speed')) || 1;
            
            gsap.to(element, {
                y: '+=20',
                rotation: 360,
                duration: 3 / speed,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: index * 0.5
            });
        });
    }
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Simple and reliable native smooth scroll
        const headerOffset = 80;
        const elementPosition = section.offsetTop;
        const offsetPosition = elementPosition - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Form Handling
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return; // Exit if form doesn't exist
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Sending...</span><span class="btn-icon">🚀</span>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message Sent!</span><span class="btn-icon">✅</span>';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                form.reset();
            }, 2000);
        }, 1500);
    });
}

// Intersection Observer for scroll animations
function initScrollObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
}

// Performance optimization
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Handle resize
        }, 250);
    });
}

// Force show all skills function
function forceShowSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
        item.style.visibility = 'visible';
    });
}

// 3D Card Init
function init3DCard() {
    const card = document.querySelector('.card-3d');
    if (!card) return;

    const inner = card.querySelector('.card-3d__inner');
    const layers = Array.from(card.querySelectorAll('.card-3d__layer'));

    const bounds = card.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;

    function handleMove(e) {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const rotateX = (-y * 12).toFixed(2);
        const rotateY = (x * 12).toFixed(2);

        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;

        layers.forEach(layer => {
            const z = parseFloat(layer.dataset.z || 0);
            const tx = x * (z / 20);
            const ty = y * (z / 30);
            layer.style.transform = `translateX(${ -50 + tx }%) translateY(${20 + ty}px) translateZ(${z}px)`;
        });

        // Shine
        const shine = card.querySelector('.card-3d__shine');
        if (shine) {
            const px = (x + 0.5) * 100;
            const py = (y + 0.5) * 100;
            shine.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.12), rgba(255,255,255,0.0) 30%)`;
        }
    }

    function reset() {
        inner.style.transform = '';
        layers.forEach(layer => layer.style.transform = '');
        const shine = card.querySelector('.card-3d__shine');
        if (shine) shine.style.background = '';
    }

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', reset);
    card.addEventListener('focus', () => { card.addEventListener('mousemove', handleMove); });
    card.addEventListener('blur', reset);
}


// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Three.js check removed as we are using DarkVeil
        
        // Initialize Three.js space environment
        // const spaceEnv = new SpaceEnvironment();
        console.log('SpaceEnvironment disabled, using DarkVeil instead');
        
        // Initialize animations
        const animationController = new AnimationController();
        
        // Initialize other features
        initContactForm();
        initScrollObserver();
        optimizePerformance();
        
        // Add some interactive effects
        addInteractiveEffects();

        // Initialize 3D profile card (if present)
        if (typeof init3DCard === 'function') init3DCard();
        
        // Ensure skills are visible after everything loads
        setTimeout(forceShowSkills, 1000);
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            // if (spaceEnv && spaceEnv.destroy) {
            //     spaceEnv.destroy();
            // }
        });
        
    } catch (error) {
        console.error('Error initializing portfolio:', error);
        // Fallback: initialize basic features without 3D
        initBasicFeatures();
        // Force show skills in case of errors
        setTimeout(forceShowSkills, 500);
    }
});

// Fallback function for when Three.js fails to load
function initBasicFeatures() {
    console.log('Initializing basic portfolio features...');
    
    // Initialize basic animations
    const animationController = new AnimationController();
    
    // Initialize other features
    initContactForm();
    initScrollObserver();
    optimizePerformance();
    
    // Add basic interactive effects
    addBasicInteractiveEffects();
}

// Interactive Effects
function addInteractiveEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-visual');
        const speed = scrolled * 0.5;
        
        if (parallax) {
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // Cursor trail effect
    let mouseTrail = [];
    const trailLength = 20;
    
    document.addEventListener('mousemove', (e) => {
        mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        if (mouseTrail.length > trailLength) {
            mouseTrail.shift();
        }
        
        // Create trail particles
        if (Math.random() < 0.3) {
            createTrailParticle(e.clientX, e.clientY);
        }
    });
    
    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#00d4ff';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.opacity = '0.8';
        
        document.body.appendChild(particle);
        
        gsap.to(particle, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                document.body.removeChild(particle);
            }
        });
    }
    
    // Add hover effects to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Add typing effect to hero title - REMOVED
    // const titleLines = document.querySelectorAll('.title-line');
    // titleLines.forEach((line, index) => {
    //     const text = line.textContent;
    //     line.textContent = '';
    //     
    //     setTimeout(() => {
    //         let i = 0;
    //         const typeInterval = setInterval(() => {
    //             line.textContent += text[i];
    //             i++;
    //             if (i >= text.length) {
    //                 clearInterval(typeInterval);
    //             }
    //         }, 100);
    //     }, index * 200);
    // });
}

// Basic interactive effects (fallback when Three.js is not available)
function addBasicInteractiveEffects() {
    console.log('Adding basic interactive effects...');
    
    // Add hover effects to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add basic button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px)';
            btn.style.transition = 'all 0.3s ease';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });
    
    // Basic scroll animations
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-visual');
        
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Basic typing effect for hero title - REMOVED
    // const titleLines = document.querySelectorAll('.title-line');
    // titleLines.forEach((line, index) => {
    //     const text = line.textContent;
    //     line.textContent = '';
    //     line.style.opacity = '1';
    //     
    //     setTimeout(() => {
    //         let i = 0;
    //         const typeInterval = setInterval(() => {
    //             line.textContent += text[i];
    //             i++;
    //             if (i >= text.length) {
    //                 clearInterval(typeInterval);
    //             }
    //         }, 100);
    //     }, index * 200);
    // });
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SpaceEnvironment, AnimationController };
}

// Backup Navigation System - Simple and Reliable
function initBackupNavigation() {
    console.log('Initializing backup navigation...');
    
    // Wait a bit for DOM to be ready
    setTimeout(() => {
        const navLinks = document.querySelectorAll('.nav-link');
        console.log('Found nav links:', navLinks.length);
        
        navLinks.forEach((link, index) => {
            console.log(`Setting up link ${index}:`, link.getAttribute('href'));
            
            // Remove any existing listeners and add new one
            link.replaceWith(link.cloneNode(true));
            const newLink = document.querySelectorAll('.nav-link')[index];
            
            newLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Navigation clicked:', newLink.getAttribute('href'));
                
                const targetId = newLink.getAttribute('href').substring(1); // Remove #
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    console.log('Scrolling to:', targetId);
                    const headerOffset = 80;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    console.log('Target element not found:', targetId);
                }
            });
        });
        
        // Ensure we're at the home section
        ensureHomePosition();
    }, 1000);
}

// Function to ensure page starts at home section
function ensureHomePosition() {
    // Disable scroll restoration
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
    });
    
    console.log('Ensured position is at home section');
}

// Standalone Hamburger Menu Initialization - Always works!
function initHamburgerMenu() {
    console.log('=== HAMBURGER MENU INITIALIZATION ===');
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    console.log('Hamburger element:', hamburger);
    console.log('Nav menu element:', navMenu);
    console.log('Nav links count:', navLinks.length);
    
    if (!hamburger) {
        console.error('HAMBURGER NOT FOUND!');
        return;
    }
    
    if (!navMenu) {
        console.error('NAV MENU NOT FOUND!');
        return;
    }
    
    // Remove any existing event listeners by cloning
    const newHamburger = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newHamburger, hamburger);
    
    // Add click event to hamburger
    newHamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🍔 HAMBURGER CLICKED!');
        
        const isActive = navMenu.classList.contains('active');
        console.log('Current state - Active:', isActive);
        
        if (isActive) {
            navMenu.classList.remove('active');
            newHamburger.classList.remove('active');
            console.log('✅ Menu CLOSED');
        } else {
            navMenu.classList.add('active');
            newHamburger.classList.add('active');
            console.log('✅ Menu OPENED');
        }
    });
    
    // Close menu when clicking nav links
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            console.log('Nav link clicked - closing menu');
            navMenu.classList.remove('active');
            newHamburger.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!newHamburger.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                console.log('Clicked outside - closing menu');
                navMenu.classList.remove('active');
                newHamburger.classList.remove('active');
            }
        }
    });
    
    console.log('✅ HAMBURGER MENU INITIALIZED SUCCESSFULLY!');
}

// Initialize backup navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        ensureHomePosition();
        initBackupNavigation();
        // Initialize hamburger menu separately
        setTimeout(initHamburgerMenu, 500);
    });
} else {
    ensureHomePosition();
    initBackupNavigation();
    // Initialize hamburger menu separately
    setTimeout(initHamburgerMenu, 500);
}

// EMERGENCY FALLBACK - Initialize hamburger immediately when script loads
console.log('⚡ EMERGENCY: Attempting immediate hamburger initialization');
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('⚡ Document ready, initializing now');
    setTimeout(initHamburgerMenu, 100);
}

// Also try after window fully loads
window.addEventListener('load', function() {
    console.log('⚡ Window loaded, ensuring hamburger is initialized');
    setTimeout(initHamburgerMenu, 200);
});
