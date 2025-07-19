// Registration Component for Oracle Boxing Coach AI
class RegisterComponent {
    constructor() {
        this.isLoading = false;
        this.errors = {};
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
    }

    render() {
        const registerHTML = `
            <div class="auth-container flex items-center justify-center py-12 px-4">
                <div class="auth-card w-full max-w-2xl">
                    <!-- Progress Header -->
                    <div class="bg-gray-50 p-6 border-b border-gray-200">
                        <div class="text-center mb-4">
                            <h1 class="text-2xl font-bold text-gray-900 font-rajdhani">Join Oracle Boxing AI</h1>
                            <p class="text-gray-600">Start your professional boxing journey today</p>
                        </div>
                        
                        <!-- Progress Indicator -->
                        <div class="flex items-center justify-center space-x-4">
                            ${this.renderProgressSteps()}
                        </div>
                    </div>

                    <!-- Form Container -->
                    <div class="p-8">
                        <!-- Step 1: Basic Information -->
                        <div id="step-1" class="step-content ${this.currentStep === 1 ? 'active' : 'hidden'}">
                            ${this.renderStep1()}
                        </div>

                        <!-- Step 2: Boxing Experience -->
                        <div id="step-2" class="step-content ${this.currentStep === 2 ? 'active' : 'hidden'}">
                            ${this.renderStep2()}
                        </div>

                        <!-- Step 3: Goals & Preferences -->
                        <div id="step-3" class="step-content ${this.currentStep === 3 ? 'active' : 'hidden'}">
                            ${this.renderStep3()}
                        </div>

                        <!-- Navigation Buttons -->
                        <div class="flex justify-between mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onclick="registerComponent.previousStep()"
                                class="btn-secondary ${this.currentStep === 1 ? 'invisible' : ''}"
                            >
                                <i class="fas fa-arrow-left mr-2"></i>Previous
                            </button>
                            
                            <button
                                type="button"
                                onclick="registerComponent.nextStep()"
                                class="btn-primary ${this.currentStep === this.totalSteps ? 'hidden' : ''}"
                            >
                                Next <i class="fas fa-arrow-right ml-2"></i>
                            </button>
                            
                            <button
                                type="submit"
                                id="register-btn"
                                class="btn-primary ${this.currentStep === this.totalSteps ? '' : 'hidden'} ${this.isLoading ? 'opacity-75 cursor-not-allowed' : ''}"
                                ${this.isLoading ? 'disabled' : ''}
                            >
                                ${this.isLoading ? 
                                    '<i class="fas fa-spinner fa-spin mr-2"></i>Creating Account...' : 
                                    '<i class="fas fa-user-plus mr-2"></i>Create Account'
                                }
                            </button>
                        </div>

                        <!-- Login Link -->
                        <div class="text-center mt-6 pt-6 border-t border-gray-200">
                            <p class="text-gray-600">
                                Already have an account? 
                                <a 
                                    href="#login" 
                                    onclick="router.navigate('login')" 
                                    class="text-red-600 hover:text-red-700 font-semibold"
                                >
                                    Sign in here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('register-page').innerHTML = registerHTML;
        this.attachEventListeners();
    }

    renderProgressSteps() {
        const steps = ['Basic Info', 'Experience', 'Goals'];
        
        return steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === this.currentStep;
            const isCompleted = stepNumber < this.currentStep;
            
            return `
                <div class="flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                            ${isCompleted ? 'bg-green-500 text-white' : 
                              isActive ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600'}">
                            ${isCompleted ? '<i class="fas fa-check"></i>' : stepNumber}
                        </div>
                        <span class="ml-2 text-sm font-medium ${isActive ? 'text-red-600' : 'text-gray-600'}">
                            ${step}
                        </span>
                    </div>
                    ${index < steps.length - 1 ? 
                        `<div class="flex-1 h-0.5 mx-4 ${stepNumber < this.currentStep ? 'bg-green-500' : 'bg-gray-300'}"></div>` : ''
                    }
                </div>
            `;
        }).join('');
    }

    renderStep1() {
        return `
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Tell us about yourself</h3>
                    <p class="text-gray-600">Let's start with some basic information</p>
                </div>

                <!-- Name Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="firstName" class="form-label">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            class="form-input"
                            placeholder="Enter your first name"
                            required
                            value="${this.formData.firstName || ''}"
                        >
                    </div>
                    <div>
                        <label for="lastName" class="form-label">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            class="form-input"
                            placeholder="Enter your last name"
                            required
                            value="${this.formData.lastName || ''}"
                        >
                    </div>
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="form-label">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        class="form-input"
                        placeholder="Enter your email address"
                        required
                        value="${this.formData.email || ''}"
                    >
                </div>

                <!-- Password -->
                <div>
                    <label for="password" class="form-label">Password</label>
                    <div class="relative">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            class="form-input pr-12"
                            placeholder="Create a strong password"
                            required
                            minlength="8"
                        >
                        <button
                            type="button"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                            onclick="registerComponent.togglePassword()"
                        >
                            <i id="password-toggle-icon" class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="mt-2 text-sm text-gray-600">
                        Password must be at least 8 characters long
                    </div>
                </div>

                <!-- Confirm Password -->
                <div>
                    <label for="confirmPassword" class="form-label">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        class="form-input"
                        placeholder="Confirm your password"
                        required
                    >
                </div>
            </div>
        `;
    }

    renderStep2() {
        return `
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Boxing Experience</h3>
                    <p class="text-gray-600">Help us personalize your training</p>
                </div>

                <!-- Experience Level -->
                <div>
                    <label class="form-label">What's your boxing experience level?</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        ${['Beginner', 'Intermediate', 'Advanced', 'Professional'].map(level => `
                            <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-red-50 hover:border-red-300">
                                <input
                                    type="radio"
                                    name="experienceLevel"
                                    value="${level.toLowerCase()}"
                                    class="w-4 h-4 text-red-600"
                                    ${this.formData.experienceLevel === level.toLowerCase() ? 'checked' : ''}
                                >
                                <span class="ml-3 text-sm font-medium text-gray-900">${level}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <!-- Training History -->
                <div>
                    <label for="trainingHistory" class="form-label">Years of Training</label>
                    <select id="trainingHistory" name="trainingHistory" class="form-input">
                        <option value="">Select your training history</option>
                        <option value="none" ${this.formData.trainingHistory === 'none' ? 'selected' : ''}>No formal training</option>
                        <option value="0-1" ${this.formData.trainingHistory === '0-1' ? 'selected' : ''}>Less than 1 year</option>
                        <option value="1-3" ${this.formData.trainingHistory === '1-3' ? 'selected' : ''}>1-3 years</option>
                        <option value="3-5" ${this.formData.trainingHistory === '3-5' ? 'selected' : ''}>3-5 years</option>
                        <option value="5+" ${this.formData.trainingHistory === '5+' ? 'selected' : ''}>5+ years</option>
                    </select>
                </div>

                <!-- Training Type -->
                <div>
                    <label class="form-label">What type of training interests you most?</label>
                    <div class="space-y-2 mt-2">
                        ${['Fitness & Conditioning', 'Technique Development', 'Competitive Boxing', 'Self Defense'].map(type => `
                            <label class="flex items-center">
                                <input
                                    type="checkbox"
                                    name="trainingTypes"
                                    value="${type.toLowerCase().replace(/\s+/g, '-')}"
                                    class="w-4 h-4 text-red-600 rounded"
                                >
                                <span class="ml-3 text-sm text-gray-900">${type}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderStep3() {
        return `
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Your Goals</h3>
                    <p class="text-gray-600">What do you want to achieve?</p>
                </div>

                <!-- Primary Goals -->
                <div>
                    <label class="form-label">Primary Training Goals (select up to 3)</label>
                    <div class="space-y-2 mt-2">
                        ${[
                            'Improve overall fitness',
                            'Learn proper boxing technique',
                            'Build confidence and discipline',
                            'Competitive boxing preparation',
                            'Stress relief and mental health',
                            'Weight loss and body composition',
                            'Self-defense skills'
                        ].map(goal => `
                            <label class="flex items-center">
                                <input
                                    type="checkbox"
                                    name="goals"
                                    value="${goal.toLowerCase().replace(/\s+/g, '-')}"
                                    class="w-4 h-4 text-red-600 rounded"
                                >
                                <span class="ml-3 text-sm text-gray-900">${goal}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <!-- Training Frequency -->
                <div>
                    <label for="trainingFrequency" class="form-label">How often do you plan to train?</label>
                    <select id="trainingFrequency" name="trainingFrequency" class="form-input">
                        <option value="">Select training frequency</option>
                        <option value="1-2">1-2 times per week</option>
                        <option value="3-4">3-4 times per week</option>
                        <option value="5-6">5-6 times per week</option>
                        <option value="daily">Daily</option>
                    </select>
                </div>

                <!-- Terms and Conditions -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <label class="flex items-start">
                        <input
                            type="checkbox"
                            name="acceptTerms"
                            required
                            class="w-4 h-4 text-red-600 rounded mt-1"
                        >
                        <span class="ml-3 text-sm text-gray-700">
                            I agree to the <a href="#terms" class="text-red-600 hover:text-red-700">Terms of Service</a> 
                            and <a href="#privacy" class="text-red-600 hover:text-red-700">Privacy Policy</a>
                        </span>
                    </label>
                </div>

                <!-- Newsletter Signup -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <label class="flex items-start">
                        <input
                            type="checkbox"
                            name="newsletter"
                            class="w-4 h-4 text-red-600 rounded mt-1"
                        >
                        <span class="ml-3 text-sm text-gray-700">
                            Send me training tips, updates, and exclusive content via email
                        </span>
                    </label>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Step navigation
        document.addEventListener('change', (e) => {
            if (e.target.closest('#register-page')) {
                this.saveStepData();
            }
        });
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveStepData();
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.render();
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.saveStepData();
            this.currentStep--;
            this.render();
        }
    }

    validateCurrentStep() {
        // Add validation logic for each step
        return true;
    }

    saveStepData() {
        const form = document.querySelector('#register-page form');
        if (form) {
            const formData = new FormData(form);
            for (const [key, value] of formData.entries()) {
                this.formData[key] = value;
            }
        }
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

    async handleSubmit() {
        this.saveStepData();
        
        if (!this.validateForm()) {
            return;
        }

        this.setLoading(true);

        try {
            const result = await authManager.register(this.formData);
            
            if (result.success) {
                utils.showToast('Account created successfully!', 'success');
                router.navigate('dashboard');
            } else {
                utils.showToast(result.message || 'Registration failed', 'error');
            }
        } catch (error) {
            utils.showToast('Registration failed. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    validateForm() {
        // Add comprehensive form validation
        return true;
    }

    setLoading(loading) {
        this.isLoading = loading;
        // Update UI to show loading state
    }

    reset() {
        this.currentStep = 1;
        this.formData = {};
        this.errors = {};
        this.isLoading = false;
                            >
                                <i class="fas fa-arrow-left mr-2"></i>Previous
                            </button>

                            <button
                                type="button"
                                onclick="registerComponent.nextStep()"
                                id="next-btn"
                                class="${this.currentStep === this.totalSteps ? 'btn-primary' : 'btn-primary'} ${this.isLoading ? 'opacity-75 cursor-not-allowed' : ''}"
                                ${this.isLoading ? 'disabled' : ''}
                            >
                                ${this.currentStep === this.totalSteps ? 
                                    (this.isLoading ? '<i class="fas fa-spinner fa-spin mr-2"></i>Creating Account...' : '<i class="fas fa-check mr-2"></i>Create Account') :
                                    'Next<i class="fas fa-arrow-right ml-2"></i>'
                                }
                            </button>
                        </div>
                    </div>

                    <!-- Login Link -->
                    <div class="bg-gray-50 p-6 text-center border-t border-gray-200">
                        <p class="text-gray-600">
                            Already have an account? 
                            <a 
                                href="#login" 
                                onclick="router.navigate('login')" 
                                class="text-red-600 hover:text-red-700 font-semibold"
                            >
                                Sign in here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('register-page').innerHTML = registerHTML;
        this.attachEventListeners();
    }

    renderProgressSteps() {
        const steps = [
            { number: 1, title: 'Account', icon: 'fas fa-user' },
            { number: 2, title: 'Experience', icon: 'fas fa-fist-raised' },
            { number: 3, title: 'Goals', icon: 'fas fa-target' }
        ];

        return steps.map(step => {
            const isActive = step.number === this.currentStep;
            const isCompleted = step.number < this.currentStep;
            
            return `
                <div class="flex items-center ${step.number < steps.length ? 'flex-1' : ''}">
                    <div class="flex flex-col items-center">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 ${
                            isCompleted ? 'bg-green-600 text-white' :
                            isActive ? 'bg-red-600 text-white' :
                            'bg-gray-300 text-gray-600'
                        }">
                            ${isCompleted ? '<i class="fas fa-check"></i>' : step.number}
                        </div>
                        <span class="text-xs font-medium ${
                            isActive ? 'text-red-600' : 
                            isCompleted ? 'text-green-600' : 'text-gray-500'
                        }">${step.title}</span>
                    </div>
                    ${step.number < steps.length ? `
                        <div class="flex-1 h-1 mx-4 ${
                            isCompleted ? 'bg-green-600' : 'bg-gray-300'
                        } rounded"></div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    renderStep1() {
        return `
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-user text-2xl"></i>
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900">Create Your Account</h2>
                    <p class="text-gray-600">Let's start with some basic information</p>
                </div>

                <form id="step-1-form" class="space-y-6">
                    <!-- Name Fields -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="firstName" class="form-label">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                class="form-input ${this.errors.firstName ? 'border-red-500' : ''}"
                                placeholder="Enter your first name"
                                value="${this.formData.firstName || ''}"
                                required
                            >
                            ${this.errors.firstName ? `<span class="form-error">${this.errors.firstName}</span>` : ''}
                        </div>
                        <div>
                            <label for="lastName" class="form-label">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                class="form-input ${this.errors.lastName ? 'border-red-500' : ''}"
                                placeholder="Enter your last name"
                                value="${this.formData.lastName || ''}"
                                required
                            >
                            ${this.errors.lastName ? `<span class="form-error">${this.errors.lastName}</span>` : ''}
                        </div>
                    </div>

                    <!-- Email -->
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
                            value="${this.formData.email || ''}"
                            required
                        >
                        ${this.errors.email ? `<span class="form-error">${this.errors.email}</span>` : ''}
                    </div>

                    <!-- Password -->
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
                                placeholder="Create a strong password"
                                required
                            >
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                onclick="registerComponent.togglePassword('password')"
                            >
                                <i id="password-toggle-icon" class="fas fa-eye"></i>
                            </button>
                        </div>
                        <div class="mt-2 text-sm text-gray-600">
                            Password must be at least 8 characters with letters and numbers
                        </div>
                        ${this.errors.password ? `<span class="form-error">${this.errors.password}</span>` : ''}
                    </div>

                    <!-- Confirm Password -->
                    <div>
                        <label for="confirmPassword" class="form-label">
                            <i class="fas fa-lock mr-2 text-gray-500"></i>Confirm Password
                        </label>
                        <div class="relative">
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                class="form-input pr-12 ${this.errors.confirmPassword ? 'border-red-500' : ''}"
                                placeholder="Confirm your password"
                                required
                            >
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                onclick="registerComponent.togglePassword('confirmPassword')"
                            >
                                <i id="confirmPassword-toggle-icon" class="fas fa-eye"></i>
                            </button>
                        </div>
                        ${this.errors.confirmPassword ? `<span class="form-error">${this.errors.confirmPassword}</span>` : ''}
                    </div>

                    <!-- Terms and Conditions -->
                    <div class="flex items-start">
                        <input
                            type="checkbox"
                            id="terms"
                            name="terms"
                            class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2 mt-1"
                            ${this.formData.terms ? 'checked' : ''}
                            required
                        >
                        <label for="terms" class="ml-3 text-sm text-gray-600">
                            I agree to the 
                            <a href="#terms" class="text-red-600 hover:text-red-700 font-medium">Terms of Service</a> 
                            and 
                            <a href="#privacy" class="text-red-600 hover:text-red-700 font-medium">Privacy Policy</a>
                        </label>
                    </div>
                    ${this.errors.terms ? `<span class="form-error">${this.errors.terms}</span>` : ''}
                </form>
            </div>
        `;
    }

    renderStep2() {
        return `
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-fist-raised text-2xl"></i>
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900">Boxing Experience</h2>
                    <p class="text-gray-600">Help us understand your current skill level</p>
                </div>

                <form id="step-2-form" class="space-y-6">
                    <!-- Experience Level -->
                    <div>
                        <label class="form-label">What's your boxing experience level?</label>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            ${this.renderExperienceOptions()}
                        </div>
                    </div>

                    <!-- Age Group -->
                    <div>
                        <label for="ageGroup" class="form-label">Age Group</label>
                        <select id="ageGroup" name="ageGroup" class="form-input" required>
                            <option value="">Select your age group</option>
                            <option value="youth" ${this.formData.ageGroup === 'youth' ? 'selected' : ''}>Under 18</option>
                            <option value="adult" ${this.formData.ageGroup === 'adult' ? 'selected' : ''}>18-65</option>
                            <option value="senior" ${this.formData.ageGroup === 'senior' ? 'selected' : ''}>Over 65</option>
                        </select>
                    </div>

                    <!-- Training Frequency -->
                    <div>
                        <label class="form-label">How often do you plan to train?</label>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            ${this.renderFrequencyOptions()}
                        </div>
                    </div>

                    <!-- Previous Injuries -->
                    <div>
                        <label class="form-label">Do you have any boxing-related injuries or physical limitations?</label>
                        <textarea
                            id="injuries"
                            name="injuries"
                            class="form-input h-24 resize-none"
                            placeholder="Please describe any injuries or limitations we should know about (optional)"
                        >${this.formData.injuries || ''}</textarea>
                        <div class="mt-2 text-sm text-gray-600">
                            This helps us provide safer, personalized training recommendations
                        </div>
                    </div>
                </form>
            </div>
        `;
    }

    renderStep3() {
        return `
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-target text-2xl"></i>
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900">Your Boxing Goals</h2>
                    <p class="text-gray-600">Let's customize your training experience</p>
                </div>

                <form id="step-3-form" class="space-y-6">
                    <!-- Primary Goals -->
                    <div>
                        <label class="form-label">What are your primary boxing goals? (Select all that apply)</label>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            ${this.renderGoalOptions()}
                        </div>
                    </div>

                    <!-- Training Preferences -->
                    <div>
                        <label class="form-label">Training Preferences</label>
                        <div class="space-y-3 mt-3">
                            ${this.renderPreferenceOptions()}
                        </div>
                    </div>

                    <!-- Notification Preferences -->
                    <div>
                        <label class="form-label">How would you like to stay motivated?</label>
                        <div class="space-y-3 mt-3">
                            <label class="flex items-center">
                                <input type="checkbox" name="notifications[]" value="daily_tips" class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2">
                                <span class="ml-3 text-gray-700">Daily boxing tips and techniques</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="notifications[]" value="workout_reminders" class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2">
                                <span class="ml-3 text-gray-700">Workout reminders</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="notifications[]" value="progress_updates" class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2">
                                <span class="ml-3 text-gray-700">Weekly progress updates</span>
                            </label>
                        </div>
                    </div>

                    <!-- Welcome Message -->
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <i class="fas fa-trophy text-red-600 text-xl"></i>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-lg font-semibold text-red-900">You're Almost Ready!</h3>
                                <p class="text-red-800 mt-1">
                                    Click "Create Account" to join thousands of fighters who are improving their skills with Oracle Boxing AI. 
                                    Your personalized training journey starts today!
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        `;
    }

    renderExperienceOptions() {
        const options = [
            { value: 'beginner', label: 'Beginner', desc: 'New to boxing or less than 6 months', icon: 'fas fa-seedling' },
            { value: 'intermediate', label: 'Intermediate', desc: '6 months to 2 years experience', icon: 'fas fa-chart-line' },
            { value: 'advanced', label: 'Advanced', desc: '2+ years of regular training', icon: 'fas fa-medal' },
            { value: 'pro', label: 'Professional', desc: 'Competitive or professional boxer', icon: 'fas fa-crown' }
        ];

        return options.map(option => `
            <label class="relative">
                <input
                    type="radio"
                    name="experience"
                    value="${option.value}"
                    class="sr-only"
                    ${this.formData.experience === option.value ? 'checked' : ''}
                    onchange="registerComponent.updateFormData('experience', '${option.value}')"
                >
                <div class="border-2 border-gray-300 rounded-lg p-4 cursor-pointer hover:border-red-300 transition-colors duration-200 experience-option">
                    <div class="flex items-center space-x-3">
                        <i class="${option.icon} text-red-600 text-lg"></i>
                        <div>
                            <div class="font-semibold text-gray-900">${option.label}</div>
                            <div class="text-sm text-gray-600">${option.desc}</div>
                        </div>
                    </div>
                </div>
            </label>
        `).join('');
    }

    renderFrequencyOptions() {
        const options = [
            { value: '1-2', label: '1-2 times per week', desc: 'Getting started' },
            { value: '3-4', label: '3-4 times per week', desc: 'Regular training' },
            { value: '5-6', label: '5-6 times per week', desc: 'Serious training' },
            { value: 'daily', label: 'Daily training', desc: 'Professional level' }
        ];

        return options.map(option => `
            <label class="relative">
                <input
                    type="radio"
                    name="frequency"
                    value="${option.value}"
                    class="sr-only"
                    ${this.formData.frequency === option.value ? 'checked' : ''}
                    onchange="registerComponent.updateFormData('frequency', '${option.value}')"
                >
                <div class="border-2 border-gray-300 rounded-lg p-4 cursor-pointer hover:border-red-300 transition-colors duration-200 frequency-option">
                    <div class="font-semibold text-gray-900">${option.label}</div>
                    <div class="text-sm text-gray-600">${option.desc}</div>
                </div>
            </label>
        `).join('');
    }

    renderGoalOptions() {
        const goals = [
            { value: 'fitness', label: 'General Fitness', icon: 'fas fa-heart' },
            { value: 'technique', label: 'Learn Techniques', icon: 'fas fa-fist-raised' },
            { value: 'competition', label: 'Competition Prep', icon: 'fas fa-trophy' },
            { value: 'self_defense', label: 'Self Defense', icon: 'fas fa-shield-alt' },
            { value: 'weight_loss', label: 'Weight Loss', icon: 'fas fa-weight' },
            { value: 'stress_relief', label: 'Stress Relief', icon: 'fas fa-leaf' }
        ];

        return goals.map(goal => `
            <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-red-300 transition-colors duration-200">
                <input
                    type="checkbox"
                    name="goals[]"
                    value="${goal.value}"
                    class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                    ${(this.formData.goals || []).includes(goal.value) ? 'checked' : ''}
                >
                <i class="${goal.icon} text-red-600 text-lg ml-3 mr-3"></i>
                <span class="text-gray-700 font-medium">${goal.label}</span>
            </label>
        `).join('');
    }

    renderPreferenceOptions() {
        const preferences = [
            { name: 'coaching_style', value: 'encouraging', label: 'Encouraging and supportive coaching style' },
            { name: 'coaching_style', value: 'challenging', label: 'Direct and challenging coaching style' },
            { name: 'session_length', value: 'short', label: 'Prefer shorter, intense sessions (15-30 min)' },
            { name: 'session_length', value: 'long', label: 'Prefer longer, comprehensive sessions (45-60 min)' },
            { name: 'focus', value: 'technique', label: 'Focus more on technique than conditioning' },
            { name: 'focus', value: 'conditioning', label: 'Focus more on conditioning than technique' }
        ];

        return preferences.map(pref => `
            <label class="flex items-center">
                <input
                    type="radio"
                    name="${pref.name}"
                    value="${pref.value}"
                    class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
                    ${this.formData[pref.name] === pref.value ? 'checked' : ''}
                >
                <span class="ml-3 text-gray-700">${pref.label}</span>
            </label>
        `).join('');
    }

    attachEventListeners() {
        // Add real-time validation
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('change', () => this.updateFormData(input.name, input.value));
        });

        // Style radio button selections
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                this.updateRadioSelection(e.target);
            }
        });
    }

    updateFormData(field, value) {
        this.formData[field] = value;
    }

    updateRadioSelection(selectedInput) {
        const name = selectedInput.name;
        const options = document.querySelectorAll(`input[name="${name}"]`);
        
        options.forEach(option => {
            const container = option.closest('label').querySelector('div');
            if (container) {
                if (option === selectedInput) {
                    container.classList.remove('border-gray-300');
                    container.classList.add('border-red-500', 'bg-red-50');
                } else {
                    container.classList.remove('border-red-500', 'bg-red-50');
                    container.classList.add('border-gray-300');
                }
            }
        });
    }

    async nextStep() {
        if (this.isLoading) return;

        if (this.currentStep < this.totalSteps) {
            if (await this.validateCurrentStep()) {
                this.currentStep++;
                this.render();
            }
        } else {
            await this.submitForm();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.render();
        }
    }

    async validateCurrentStep() {
        this.errors = {};

        if (this.currentStep === 1) {
            return this.validateStep1();
        } else if (this.currentStep === 2) {
            return this.validateStep2();
        } else if (this.currentStep === 3) {
            return this.validateStep3();
        }

        return true;
    }

    validateStep1() {
        const form = document.getElementById('step-1-form');
        const formData = new FormData(form);

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
        let isValid = true;

        requiredFields.forEach(field => {
            const value = formData.get(field);
            if (!value) {
                this.errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                isValid = false;
            }
        });

        // Email validation
        const email = formData.get('email');
        if (email && !this.isValidEmail(email)) {
            this.errors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Password validation
        const password = formData.get('password');
        if (password && password.length < 8) {
            this.errors.password = 'Password must be at least 8 characters long';
            isValid = false;
        }

        // Confirm password validation
        const confirmPassword = formData.get('confirmPassword');
        if (password && confirmPassword && password !== confirmPassword) {
            this.errors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        // Terms validation
        if (!formData.get('terms')) {
            this.errors.terms = 'You must agree to the terms and conditions';
            isValid = false;
        }

        // Update form data
        Object.assign(this.formData, Object.fromEntries(formData));

        if (!isValid) {
            this.render();
        }

        return isValid;
    }

    validateStep2() {
        const form = document.getElementById('step-2-form');
        const formData = new FormData(form);

        // Update form data
        Object.assign(this.formData, Object.fromEntries(formData));

        // Experience and age group are required
        if (!this.formData.experience) {
            utils.showToast('Please select your boxing experience level', 'warning');
            return false;
        }

        if (!this.formData.ageGroup) {
            utils.showToast('Please select your age group', 'warning');
            return false;
        }

        return true;
    }

    validateStep3() {
        const form = document.getElementById('step-3-form');
        const formData = new FormData(form);

        // Collect goals
        const goals = formData.getAll('goals[]');
        const notifications = formData.getAll('notifications[]');

        this.formData.goals = goals;
        this.formData.notifications = notifications;

        // Update other form data
        Object.assign(this.formData, Object.fromEntries(formData));

        return true;
    }

    async submitForm() {
        this.setLoading(true);

        try {
            const result = await authManager.register(this.formData);

            if (result.success) {
                utils.showToast('Account created successfully! Welcome to Oracle Boxing AI!', 'success');
                router.navigate('dashboard');
            } else {
                utils.showToast(result.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            utils.showToast('An unexpected error occurred. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    validateField(input) {
        // Real-time field validation
        const value = input.value.trim();
        const name = input.name;

        delete this.errors[name];

        if (name === 'email' && value && !this.isValidEmail(value)) {
            this.errors[name] = 'Please enter a valid email address';
        } else if (name === 'password' && value && value.length < 8) {
            this.errors[name] = 'Password must be at least 8 characters long';
        }

        // Update field styling
        if (this.errors[name]) {
            input.classList.add('border-red-500');
        } else {
            input.classList.remove('border-red-500');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    togglePassword(fieldId) {
        const passwordInput = document.getElementById(fieldId);
        const toggleIcon = document.getElementById(`${fieldId}-toggle-icon`);
        
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
        this.render();
    }

    reset() {
        this.isLoading = false;
        this.errors = {};
        this.currentStep = 1;
        this.formData = {};
    }
}

// Global register component instance
const registerComponent = new RegisterComponent();