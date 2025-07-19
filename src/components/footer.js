// Footer Component for Oracle Boxing Coach AI
class FooterComponent {
    constructor() {
        this.currentYear = new Date().getFullYear();
    }

    render() {
        const footerHTML = `
            <footer class="footer-gradient text-white">
                <!-- Main Footer Content -->
                <div class="container mx-auto px-4 py-12">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <!-- Brand Section -->
                        <div class="lg:col-span-1">
                            <div class="flex items-center space-x-3 mb-4">
                                <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <i class="fas fa-fist-raised text-white text-xl"></i>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold font-rajdhani">Oracle Boxing</h3>
                                    <span class="text-sm text-gray-300">AI Coach</span>
                                </div>
                            </div>
                            <p class="text-gray-300 mb-4 leading-relaxed">
                                Professional AI-powered boxing coaching platform designed to help fighters of all levels 
                                improve their technique, fitness, and performance.
                            </p>
                            <div class="flex space-x-4">
                                <a href="#" class="text-gray-300 hover:text-red-400 transition-colors duration-200">
                                    <i class="fab fa-facebook-f text-lg"></i>
                                </a>
                                <a href="#" class="text-gray-300 hover:text-red-400 transition-colors duration-200">
                                    <i class="fab fa-twitter text-lg"></i>
                                </a>
                                <a href="#" class="text-gray-300 hover:text-red-400 transition-colors duration-200">
                                    <i class="fab fa-instagram text-lg"></i>
                                </a>
                                <a href="#" class="text-gray-300 hover:text-red-400 transition-colors duration-200">
                                    <i class="fab fa-youtube text-lg"></i>
                                </a>
                                <a href="#" class="text-gray-300 hover:text-red-400 transition-colors duration-200">
                                    <i class="fab fa-tiktok text-lg"></i>
                                </a>
                            </div>
                        </div>

                        <!-- Quick Links -->
                        <div>
                            <h4 class="text-lg font-semibold mb-4 text-white">Quick Links</h4>
                            <ul class="space-y-3">
                                <li>
                                    <a href="#features" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#pricing" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>Pricing
                                    </a>
                                </li>
                                <li>
                                    <a href="#about" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#blog" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>Boxing Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#testimonials" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>Success Stories
                                    </a>
                                </li>
                                <li>
                                    <a href="#coaches" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>AI Coaches
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <!-- Training Resources -->
                        <div>
                            <h4 class="text-lg font-semibold mb-4 text-white">Training</h4>
                            <ul class="space-y-3">
                                <li>
                                    <a href="#techniques" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>Boxing Techniques
                                    </a>
                                </li>
                                <li>
                                    <a href="#workouts" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>Workout Plans
                                    </a>
                                </li>
                                <li>
                                    <a href="#video-analysis" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>Video Analysis
                                    </a>
                                </li>
                                <li>
                                    <a href="#progress" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>Progress Tracking
                                    </a>
                                </li>
                                <li>
                                    <a href="#safety" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>Safety Guidelines
                                    </a>
                                </li>
                                <li>
                                    <a href="#equipment" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>Equipment Guide
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <!-- Support & Contact -->
                        <div>
                            <h4 class="text-lg font-semibold mb-4 text-white">Support</h4>
                            <ul class="space-y-3 mb-6">
                                <li>
                                    <a href="#help" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#contact" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#faq" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>FAQ
                                    </a>
                                </li>
                                <li>
                                    <a href="#api" class="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center">
                                        <i class="fas fa-chevron-right text-xs mr-2"></i>API Docs
                                    </a>
                                </li>
                            </ul>

                            <!-- Contact Info -->
                            <div class="space-y-2">
                                <div class="flex items-center text-gray-300">
                                    <i class="fas fa-envelope mr-3 text-red-400"></i>
                                    <span class="text-sm">support@oracleboxing.ai</span>
                                </div>
                                <div class="flex items-center text-gray-300">
                                    <i class="fas fa-phone mr-3 text-red-400"></i>
                                    <span class="text-sm">24/7 AI Support</span>
                                </div>
                                <div class="flex items-center text-gray-300">
                                    <i class="fas fa-globe mr-3 text-red-400"></i>
                                    <span class="text-sm">Global Access</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Newsletter Signup -->
                    <div class="border-t border-gray-600 mt-12 pt-8">
                        <div class="max-w-2xl mx-auto text-center">
                            <h4 class="text-xl font-semibold mb-2 text-white">Stay in Fighting Shape</h4>
                            <p class="text-gray-300 mb-6">
                                Get weekly boxing tips, training insights, and exclusive content delivered to your inbox.
                            </p>
                            <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    class="flex-1 px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                <button
                                    type="submit"
                                    class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    <i class="fas fa-paper-plane mr-2"></i>Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Bottom Footer -->
                <div class="border-t border-gray-600">
                    <div class="container mx-auto px-4 py-6">
                        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <!-- Copyright -->
                            <div class="text-gray-400 text-sm text-center md:text-left">
                                <p>&copy; ${this.currentYear} Oracle Boxing Coach AI. All rights reserved.</p>
                                <p class="mt-1">Powered by advanced AI technology and professional boxing expertise.</p>
                            </div>

                            <!-- Legal Links -->
                            <div class="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                                <a href="#privacy" class="text-gray-400 hover:text-red-400 transition-colors duration-200">
                                    Privacy Policy
                                </a>
                                <a href="#terms" class="text-gray-400 hover:text-red-400 transition-colors duration-200">
                                    Terms of Service
                                </a>
                                <a href="#cookies" class="text-gray-400 hover:text-red-400 transition-colors duration-200">
                                    Cookie Policy
                                </a>
                                <a href="#accessibility" class="text-gray-400 hover:text-red-400 transition-colors duration-200">
                                    Accessibility
                                </a>
                            </div>
                        </div>

                        <!-- Technology Credits -->
                        <div class="mt-6 pt-6 border-t border-gray-700 text-center">
                            <div class="flex flex-wrap justify-center items-center space-x-6 text-xs text-gray-500">
                                <div class="flex items-center space-x-2">
                                    <i class="fas fa-robot text-red-400"></i>
                                    <span>Advanced AI Technology</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <i class="fas fa-shield-alt text-green-400"></i>
                                    <span>Enterprise Security</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <i class="fas fa-mobile-alt text-blue-400"></i>
                                    <span>Mobile Optimized</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <i class="fas fa-universal-access text-purple-400"></i>
                                    <span>WCAG 2.1 AA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Scroll to Top Button -->
                <button
                    id="scroll-to-top"
                    class="fixed bottom-6 right-6 w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-30 hidden"
                    onclick="footerComponent.scrollToTop()"
                    aria-label="Scroll to top"
                >
                    <i class="fas fa-chevron-up"></i>
                </button>
            </footer>
        `;

        document.getElementById('footer-container').innerHTML = footerHTML;
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Newsletter subscription
        const newsletterForm = document.querySelector('footer form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }

        // Scroll to top functionality
        window.addEventListener('scroll', () => this.handleScroll());

        // Smooth scrolling for anchor links
        const anchorLinks = document.querySelectorAll('footer a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleAnchorClick(e));
        });
    }

    handleNewsletterSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const email = formData.get('email') || event.target.querySelector('input[type="email"]').value;

        if (!email) {
            utils.showToast('Please enter your email address', 'warning');
            return;
        }

        if (!this.isValidEmail(email)) {
            utils.showToast('Please enter a valid email address', 'error');
            return;
        }

        // Simulate newsletter subscription
        this.subscribeToNewsletter(email);
    }

    async subscribeToNewsletter(email) {
        try {
            // Show loading state
            const button = document.querySelector('footer button[type="submit"]');
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Subscribing...';
            button.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Success
            utils.showToast('Successfully subscribed to our newsletter!', 'success');
            
            // Reset form
            const emailInput = document.querySelector('footer input[type="email"]');
            emailInput.value = '';

            // Reset button
            button.innerHTML = originalHTML;
            button.disabled = false;

        } catch (error) {
            utils.showToast('Subscription failed. Please try again.', 'error');
            
            // Reset button
            const button = document.querySelector('footer button[type="submit"]');
            button.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Subscribe';
            button.disabled = false;
        }
    }

    handleScroll() {
        const scrollButton = document.getElementById('scroll-to-top');
        if (window.pageYOffset > 300) {
            scrollButton.classList.remove('hidden');
        } else {
            scrollButton.classList.add('hidden');
        }
    }

    handleAnchorClick(event) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Get current year for copyright
    getCurrentYear() {
        return new Date().getFullYear();
    }

    // Update footer for authenticated users
    updateForAuthenticatedUser(isAuthenticated) {
        if (isAuthenticated) {
            // Hide newsletter signup for authenticated users
            const newsletter = document.querySelector('footer .border-t.border-gray-600');
            if (newsletter) {
                newsletter.style.display = 'none';
            }
        }
    }
}

// Global footer component instance
const footerComponent = new FooterComponent();