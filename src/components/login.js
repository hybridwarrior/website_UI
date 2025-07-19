// Login Page Component for Oracle Boxing Coach AI
class LoginComponent {
    constructor() {
        this.isLoading = false;
        this.errors = {};
    }

    render() {
        const loginHTML = `
            <div class="auth-container flex items-center justify-center py-12 px-4">
                <div class="auth-card w-full">
                    <!-- Hero Section -->
                    <div class="hero-boxing text-white p-8 text-center">
                        <div class="mb-6">
                            <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                <i class="fas fa-fist-raised text-2xl text-white"></i>
                            </div>
                            <h1 class="text-3xl font-bold font-rajdhani text-shadow">Welcome Back, Fighter!</h1>
                            <p class="text-white text-opacity-90 mt-2">Ready to continue your boxing journey?</p>
                        </div>
                        
                        <!-- Quick Stats -->
                        <div class="grid grid-cols-3 gap-4 text-center">
                            <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3">
                                <div class="text-xl font-bold">1000+</div>
                                <div class="text-xs text-white text-opacity-80">Techniques</div>
                            </div>
                            <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3">
                                <div class="text-xl font-bold">AI</div>
                                <div class="text-xs text-white text-opacity-80">Coaching</div>
                            </div>
                            <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3">
                                <div class="text-xl font-bold">24/7</div>
                                <div class="text-xs text-white text-opacity-80">Available</div>
                            </div>
                        </div>
                    </div>

                    <!-- Login Form -->
                    <div class="auth-form">
                        <div class="auth-header">
                            <h2 class="auth-title">Sign In</h2>
                            <p class="auth-subtitle">Enter your credentials to access your training dashboard</p>
                        </div>

                        <form id="login-form" class="space-y-6">
                            <!-- Email Field -->
                            <div>
                                <label for="email" class="form-label">
                                    <i class="fas fa-envelope mr-2 text-gray-500"></i>Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    class="form-input ${this.errors.email ? 'border-red-500' : ''}"
                                    placeholder="Enter your email address"
                                    required
                                    autocomplete="email"
                                >
                                ${this.errors.email ? `<span class="form-error">${this.errors.email}</span>` : ''}
                            </div>

                            <!-- Password Field -->
                            <div>
                                <label for="password" class="form-label">
                                    <i class="fas fa-lock mr-2 text-gray-500"></i>Password
                                </label>
                                <div class="relative">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        class="form-input pr-12 ${this.errors.password ? 'border-red-500' : ''}"
                                        placeholder="Enter your password"
                                        required
                                        autocomplete="current-password"
                                    >
                                    <button
                                        type="button"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                        onclick="loginComponent.togglePassword()"
                                    >
                                        <i id="password-toggle-icon" class="fas fa-eye"></i>
                                    </button>
                                </div>
                                ${this.errors.password ? `<span class="form-error">${this.errors.password}</span>` : ''}
                            </div>

                            <!-- Remember Me & Forgot Password -->
                            <div class="flex items-center justify-between">
                                <label class="flex items-center">
                                    <input type="checkbox" id="remember" name="remember" class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2">
                                    <span class="ml-2 text-sm text-gray-600">Remember me</span>
                                </label>
                                <a href="#forgot-password" class="text-sm text-red-600 hover:text-red-700 font-medium">
                                    Forgot password?
                                </a>
                            </div>

                            <!-- Submit Button -->
                            <button
                                type="submit"
                                id="login-btn"
                                class="w-full btn-primary flex items-center justify-center space-x-2 ${this.isLoading ? 'opacity-75 cursor-not-allowed' : ''}"
                                ${this.isLoading ? 'disabled' : ''}
                            >
                                ${this.isLoading ? 
                                    '<i class="fas fa-spinner fa-spin mr-2"></i><span>Signing In...</span>' : 
                                    '<i class="fas fa-sign-in-alt mr-2"></i><span>Sign In</span>'
                                }
                            </button>

                            <!-- Demo Login -->
                            <div class="text-center">
                                <div class="text-sm text-gray-500 mb-3">Quick Demo Access</div>
                                <button
                                    type="button"
                                    onclick="loginComponent.demoLogin()"
                                    class="btn-outline w-full"
                                >
                                    <i class="fas fa-play mr-2"></i>Try Demo Account
                                </button>
                            </div>
                        </form>

                        <!-- Social Login -->
                        <div class="mt-8">
                            <div class="relative">
                                <div class="absolute inset-0 flex items-center">
                                    <div class="w-full border-t border-gray-300"></div>
                                </div>
                                <div class="relative flex justify-center text-sm">
                                    <span class="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div class="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <i class="fab fa-google text-red-500 text-lg"></i>
                                    <span class="ml-2">Google</span>
                                </button>
                                <button
                                    type="button"
                                    class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <i class="fab fa-apple text-black text-lg"></i>
                                    <span class="ml-2">Apple</span>
                                </button>
                            </div>
                        </div>

                        <!-- Register Link -->
                        <div class="mt-8 text-center">
                            <p class="text-gray-600">
                                Don't have an account? 
                                <a 
                                    href="#register" 
                                    onclick="router.navigate('register')" 
                                    class="text-red-600 hover:text-red-700 font-semibold"
                                >
                                    Create one now
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Features Preview -->
            <div class="container mx-auto px-4 py-12">
                <div class="text-center mb-8">
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">Why Fighters Choose Oracle Boxing AI</h3>
                    <p class="text-gray-600">Join thousands of athletes improving their skills with AI-powered coaching</p>
                </div>

                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Feature 1 -->
                    <div class="card text-center p-6">
                        <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-brain text-2xl"></i>
                        </div>
                        <h4 class="text-xl font-semibold text-gray-900 mb-2">AI-Powered Coaching</h4>
                        <p class="text-gray-600">Get personalized coaching advice tailored to your skill level and goals.</p>
                    </div>

                    <!-- Feature 2 -->
                    <div class="card text-center p-6">
                        <div class="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-video text-2xl"></i>
                        </div>
                        <h4 class="text-xl font-semibold text-gray-900 mb-2">Video Analysis</h4>
                        <p class="text-gray-600">Upload training videos for detailed technique analysis and improvement tips.</p>
                    </div>

                    <!-- Feature 3 -->
                    <div class="card text-center p-6">
                        <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-chart-line text-2xl"></i>
                        </div>
                        <h4 class="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h4>
                        <p class="text-gray-600">Track your improvement over time with detailed analytics and insights.</p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('login-page').innerHTML = loginHTML;
        this.attachEventListeners();
    }

    attachEventListeners() {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Add input validation
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        emailInput?.addEventListener('blur', () => this.validateEmail());
        passwordInput?.addEventListener('blur', () => this.validatePassword());
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isLoading) return;

        const formData = new FormData(event.target);
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: formData.get('remember') === 'on'
        };

        // Validate form
        if (!this.validateForm(credentials)) {
            this.render(); // Re-render with errors
            return;
        }

        this.setLoading(true);

        try {
            const result = await authManager.login(credentials);
            
            if (result.success) {
                utils.showToast('Welcome back!', 'success');
                router.navigate('dashboard');
            } else {
                this.errors = { general: result.message || 'Login failed. Please try again.' };
                utils.showToast(this.errors.general, 'error');
            }
        } catch (error) {
            this.errors = { general: 'An unexpected error occurred. Please try again.' };
            utils.showToast(this.errors.general, 'error');
        } finally {
            this.setLoading(false);
            this.render();
        }
    }

    async demoLogin() {
        this.setLoading(true);
        
        try {
            const result = await authManager.demoLogin();
            
            if (result.success) {
                utils.showToast('Demo account activated!', 'success');
                router.navigate('dashboard');
            } else {
                utils.showToast('Demo login failed. Please try again.', 'error');
            }
        } catch (error) {
            utils.showToast('An error occurred. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    validateForm(credentials) {
        this.errors = {};

        if (!credentials.email) {
            this.errors.email = 'Email is required';
        } else if (!this.isValidEmail(credentials.email)) {
            this.errors.email = 'Please enter a valid email address';
        }

        if (!credentials.password) {
            this.errors.password = 'Password is required';
        } else if (credentials.password.length < 6) {
            this.errors.password = 'Password must be at least 6 characters long';
        }

        return Object.keys(this.errors).length === 0;
    }

    validateEmail() {
        const email = document.getElementById('email').value;
        const emailError = document.querySelector('[name="email"] + .form-error');
        
        if (email && !this.isValidEmail(email)) {
            this.errors.email = 'Please enter a valid email address';
        } else {
            delete this.errors.email;
        }
    }

    validatePassword() {
        const password = document.getElementById('password').value;
        
        if (password && password.length < 6) {
            this.errors.password = 'Password must be at least 6 characters long';
        } else {
            delete this.errors.password;
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.getElementById('password-toggle-icon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            toggleIcon.className = 'fas fa-eye';
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        const btn = document.getElementById('login-btn');
        
        if (btn) {
            if (loading) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i><span>Signing In...</span>';
                btn.classList.add('opacity-75', 'cursor-not-allowed');
            } else {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i><span>Sign In</span>';
                btn.classList.remove('opacity-75', 'cursor-not-allowed');
            }
        }
    }

    reset() {
        this.isLoading = false;
        this.errors = {};
    }
}

// Global login component instance
const loginComponent = new LoginComponent();