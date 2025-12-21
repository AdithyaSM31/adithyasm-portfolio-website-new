// Fallback script for when external libraries fail to load
console.log('Loading fallback portfolio features...');

// Simple loading animation
function initFallbackLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.loading-progress');
    
    if (!loadingScreen || !progressBar) {
        console.warn('Loading elements not found');
        return;
    }
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
        }
        progressBar.style.width = progress + '%';
    }, 100);
    
    // Force hide after 3 seconds
    setTimeout(() => {
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 3000);
}

// Simple scroll animations
function initFallbackAnimations() {
    // Fade in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease';
        observer.observe(section);
    });
    
    // Observe project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Simple navigation
function initFallbackNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Simple hover effects
function initFallbackHoverEffects() {
    // Project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px)';
            btn.style.transition = 'all 0.3s ease';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });
}

// Simple skill item animation
function initFallbackSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    // Ensure skills are visible by default
    skillItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
        item.style.transition = 'all 0.6s ease';
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 100);
            }
        });
    });
    
    skillItems.forEach(item => {
        // Set initial state for animation
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        observer.observe(item);
    });
    
    // Fallback: ensure all skills are visible after 3 seconds
    setTimeout(() => {
        skillItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        });
    }, 3000);
}

// Simple contact form
function initFallbackContactForm() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
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
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing fallback portfolio...');
    
    initFallbackLoading();
    initFallbackAnimations();
    initFallbackNavigation();
    initFallbackHoverEffects();
    initFallbackSkillBars();
    initFallbackContactForm();
    
    console.log('Fallback portfolio initialized successfully!');
});
