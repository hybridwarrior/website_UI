// Oracle Boxing AI - Landing Page Interactive Features

class LandingPage {
    constructor() {
        this.initializeAnimations();
        this.initializeCounters();
        this.initializeScrollEffects();
        this.initializeInteractiveElements();
        this.initializeVideoModal();
    }
    
    // Initialize scroll-triggered animations
    initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Trigger counters when stats section is visible
                    if (entry.target.classList.contains('stats-section')) {
                        this.startCounters();
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements with reveal animation
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            animationObserver.observe(el);
        });
        
        // Observe feature cards for staggered animation
        document.querySelectorAll('.feature-card').forEach((el, index) => {
            el.style.animationDelay = `${index * 100}ms`;
            animationObserver.observe(el);
        });
    }
    
    // Animated number counters
    initializeCounters() {
        this.counters = [
            { element: 'counter-users', target: 10000, suffix: '+', duration: 2000 },
            { element: 'counter-sessions', target: 500, suffix: 'K+', duration: 2500 },
            { element: 'counter-improvement', target: 98, suffix: '%', duration: 2000 },
            { element: 'counter-rating', target: 4.9, suffix: '/5', duration: 1500, decimals: 1 }
        ];
    }
    
    startCounters() {
        this.counters.forEach(counter => {
            const element = document.getElementById(counter.element);
            if (!element || element.dataset.counted) return;
            
            element.dataset.counted = 'true';
            const startTime = Date.now();
            const endValue = counter.target;
            
            const updateCounter = () => {
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / counter.duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = endValue * easeOutQuart;
                
                if (counter.decimals) {
                    element.textContent = currentValue.toFixed(counter.decimals) + counter.suffix;
                } else {
                    element.textContent = Math.floor(currentValue).toLocaleString() + counter.suffix;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };
            
            updateCounter();
        });
    }
    
    // Scroll effects and progress bar
    initializeScrollEffects() {
        // Scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        // Parallax effect for hero section
        const heroSection = document.querySelector('.hero-section');
        const heroContent = document.querySelector('.hero-content');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            
            // Update progress bar
            const scrollPercent = (scrolled / (docHeight - winHeight)) * 100;
            progressBar.style.transform = `scaleX(${scrollPercent / 100})`;
            
            // Parallax effect
            if (heroSection) {
                const speed = 0.5;
                heroSection.style.transform = `translateY(${scrolled * speed}px)`;
            }
            
            // Fade hero content on scroll
            if (heroContent) {
                const opacity = Math.max(0, 1 - (scrolled / winHeight) * 2);
                heroContent.style.opacity = opacity;
            }
        });
        
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offset = 80; // Account for fixed header
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Interactive elements
    initializeInteractiveElements() {
        // Pricing toggle (if you want to add monthly/yearly toggle)
        const pricingToggle = document.getElementById('pricing-toggle');
        if (pricingToggle) {
            pricingToggle.addEventListener('change', (e) => {
                const isYearly = e.target.checked;
                this.updatePricing(isYearly);
            });
        }
        
        // Coach card hover effects
        document.querySelectorAll('.coach-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.querySelector('.coach-icon').classList.add('animate-pulse');
            });
            
            card.addEventListener('mouseleave', () => {
                card.querySelector('.coach-icon').classList.remove('animate-pulse');
            });
        });
        
        // Feature card click to expand (optional)
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('click', () => {
                // You could add expand functionality here
                card.classList.toggle('expanded');
            });
        });
        
        // Mobile menu improvements
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                }
            });
            
            // Close menu when clicking a link
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });
        }
    }
    
    // Video modal for demo
    initializeVideoModal() {
        const demoBtn = document.getElementById('demo-btn');
        if (!demoBtn) return;
        
        demoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openVideoModal();
        });
    }
    
    openVideoModal() {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div class="p-4 flex justify-between items-center border-b">
                    <h3 class="text-xl font-bold">Oracle Boxing AI Demo</h3>
                    <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <div class="aspect-w-16 aspect-h-9 bg-gray-100">
                    <div class="flex items-center justify-center h-96">
                        <div class="text-center">
                            <i class="fas fa-play-circle text-6xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600">Demo video coming soon!</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Close on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    
    // Update pricing (for monthly/yearly toggle)
    updatePricing(isYearly) {
        const prices = {
            starter: { monthly: 0, yearly: 0 },
            pro: { monthly: 29, yearly: 290 },
            elite: { monthly: 99, yearly: 990 }
        };
        
        Object.keys(prices).forEach(plan => {
            const priceElement = document.getElementById(`price-${plan}`);
            if (priceElement) {
                const price = isYearly ? prices[plan].yearly : prices[plan].monthly;
                const period = isYearly ? '/year' : '/month';
                priceElement.innerHTML = `<span class="text-4xl font-bold">$${price}</span><span class="text-gray-600">${period}</span>`;
                
                // Add savings badge for yearly
                if (isYearly && plan !== 'starter') {
                    const savedAmount = (prices[plan].monthly * 12) - prices[plan].yearly;
                    const badge = document.createElement('span');
                    badge.className = 'ml-2 bg-green-100 text-green-800 text-sm px-2 py-1 rounded';
                    badge.textContent = `Save $${savedAmount}`;
                    priceElement.appendChild(badge);
                }
            }
        });
    }
    
    // Utility function for smooth animations
    animateValue(element, start, end, duration, suffix = '') {
        const startTime = Date.now();
        
        const update = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = start + (end - start) * easeOutQuart;
            
            element.textContent = Math.floor(currentValue).toLocaleString() + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        update();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LandingPage();
    
    // Add initial animations
    setTimeout(() => {
        document.querySelectorAll('.hero-content > *').forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'all 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
});