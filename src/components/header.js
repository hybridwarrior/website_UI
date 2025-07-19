// Header Component for Oracle Boxing Coach AI
class HeaderComponent {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.mobileMenuOpen = false;
    }

    render(isAuthenticated = false, user = null) {
        this.isAuthenticated = isAuthenticated;
        this.currentUser = user;

        const headerHTML = `
            <nav class="bg-white shadow-lg header-shadow sticky top-0 z-40">
                <div class="container mx-auto px-4">
                    <div class="flex justify-between items-center h-16">
                        <!-- Logo and Brand -->
                        <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0">
                                <div class="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg">
                                    <i class="fas fa-fist-raised text-white text-lg"></i>
                                </div>
                            </div>
                            <div class="flex flex-col">
                                <h1 class="text-xl font-bold text-gray-900 font-rajdhani">Oracle Boxing</h1>
                                <span class="text-xs text-gray-500 -mt-1">AI Coach</span>
                            </div>
                        </div>

                        <!-- Desktop Navigation -->
                        <div class="hidden md:flex items-center space-x-6">
                            ${this.renderNavLinks()}
                        </div>

                        <!-- User Menu / Auth Buttons -->
                        <div class="hidden md:flex items-center space-x-4">
                            ${this.renderUserMenu()}
                        </div>

                        <!-- Mobile Menu Button -->
                        <div class="md:hidden">
                            <button 
                                id="mobile-menu-btn" 
                                class="text-gray-700 hover:text-red-600 focus:outline-none transition-colors duration-200"
                                onclick="headerComponent.toggleMobileMenu()"
                            >
                                <i class="fas fa-bars text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Mobile Navigation Menu -->
                    <div id="mobile-menu" class="md:hidden mobile-menu fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50">
                        <div class="flex flex-col h-full">
                            <!-- Mobile Header -->
                            <div class="flex items-center justify-between p-4 border-b border-gray-200">
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-fist-raised text-white text-sm"></i>
                                    </div>
                                    <span class="font-bold text-gray-900 font-rajdhani">Oracle Boxing</span>
                                </div>
                                <button 
                                    onclick="headerComponent.toggleMobileMenu()" 
                                    class="text-gray-500 hover:text-gray-700"
                                >
                                    <i class="fas fa-times text-xl"></i>
                                </button>
                            </div>

                            <!-- Mobile Navigation Links -->
                            <div class="flex-1 py-4">
                                ${this.renderMobileNavLinks()}
                            </div>

                            <!-- Mobile User Menu -->
                            <div class="border-t border-gray-200 p-4">
                                ${this.renderMobileUserMenu()}
                            </div>
                        </div>
                    </div>

                    <!-- Mobile Menu Overlay -->
                    <div 
                        id="mobile-menu-overlay" 
                        class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 hidden"
                        onclick="headerComponent.toggleMobileMenu()"
                    ></div>
                </div>
            </nav>
        `;

        document.getElementById('header-container').innerHTML = headerHTML;
        this.attachEventListeners();
    }

    renderNavLinks() {
        if (!this.isAuthenticated) {
            return `
                <a href="#features" class="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200">
                    Features
                </a>
                <a href="#about" class="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200">
                    About
                </a>
                <a href="#pricing" class="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200">
                    Pricing
                </a>
            `;
        }

        return `
            <a href="#dashboard" onclick="router.navigate('dashboard')" class="nav-link text-gray-700 hover:text-red-600 font-medium transition-colors duration-200">
                <i class="fas fa-home mr-1"></i> Dashboard
            </a>
            <a href="#chat" onclick="router.navigate('chat')" class="nav-link text-gray-700 hover:text-red-600 font-medium transition-colors duration-200">
                <i class="fas fa-comments mr-1"></i> Training
            </a>
            <a href="#tasks" onclick="router.navigate('tasks')" class="nav-link text-gray-700 hover:text-red-600 font-medium transition-colors duration-200">
                <i class="fas fa-tasks mr-1"></i> Tasks
            </a>
            <a href="#progress" onclick="router.navigate('progress')" class="nav-link text-gray-700 hover:text-red-600 font-medium transition-colors duration-200">
                <i class="fas fa-chart-line mr-1"></i> Progress
            </a>
        `;
    }

    renderMobileNavLinks() {
        if (!this.isAuthenticated) {
            return `
                <a href="#features" class="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
                    <i class="fas fa-star mr-3 w-5"></i> Features
                </a>
                <a href="#about" class="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
                    <i class="fas fa-info-circle mr-3 w-5"></i> About
                </a>
                <a href="#pricing" class="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
                    <i class="fas fa-tag mr-3 w-5"></i> Pricing
                </a>
            `;
        }

        return `
            <a href="#dashboard" onclick="router.navigate('dashboard'); headerComponent.closeMobileMenu()" class="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
                <i class="fas fa-home mr-3 w-5"></i> Dashboard
            </a>
            <a href="#chat" onclick="router.navigate('chat'); headerComponent.closeMobileMenu()" class="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
                <i class="fas fa-comments mr-3 w-5"></i> Training
            </a>
            <a href="#tasks" onclick="router.navigate('tasks'); headerComponent.closeMobileMenu()" class="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
                <i class="fas fa-tasks mr-3 w-5"></i> Tasks
            </a>
            <a href="#progress" onclick="router.navigate('progress'); headerComponent.closeMobileMenu()" class="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
                <i class="fas fa-chart-line mr-3 w-5"></i> Progress
            </a>
        `;
    }

    renderUserMenu() {
        if (!this.isAuthenticated) {
            return `
                <button 
                    onclick="router.navigate('login')" 
                    class="btn-ghost text-gray-700 hover:text-red-600"
                >
                    Sign In
                </button>
                <button 
                    onclick="router.navigate('register')" 
                    class="btn-primary"
                >
                    Get Started
                </button>
            `;
        }

        const userName = this.currentUser?.name || 'User';
        const userInitial = userName.charAt(0).toUpperCase();

        return `
            <!-- Notifications -->
            <button class="relative text-gray-700 hover:text-red-600 transition-colors duration-200">
                <i class="fas fa-bell text-lg"></i>
                <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full text-xs text-white flex items-center justify-center">
                    2
                </span>
            </button>

            <!-- User Dropdown -->
            <div class="relative" id="user-dropdown">
                <button 
                    onclick="headerComponent.toggleUserDropdown()" 
                    class="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                    <div class="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        ${userInitial}
                    </div>
                    <span class="font-medium">${userName}</span>
                    <i class="fas fa-chevron-down text-sm"></i>
                </button>

                <div id="user-dropdown-menu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 hidden">
                    <a href="#profile" class="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
                        <i class="fas fa-user mr-2"></i> Profile
                    </a>
                    <a href="#settings" class="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
                        <i class="fas fa-cog mr-2"></i> Settings
                    </a>
                    <a href="#help" class="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
                        <i class="fas fa-question-circle mr-2"></i> Help
                    </a>
                    <hr class="my-2 border-gray-200">
                    <button 
                        onclick="authManager.logout()" 
                        class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                        <i class="fas fa-sign-out-alt mr-2"></i> Sign Out
                    </button>
                </div>
            </div>
        `;
    }

    renderMobileUserMenu() {
        if (!this.isAuthenticated) {
            return `
                <button 
                    onclick="router.navigate('login'); headerComponent.closeMobileMenu()" 
                    class="w-full btn-outline mb-3"
                >
                    Sign In
                </button>
                <button 
                    onclick="router.navigate('register'); headerComponent.closeMobileMenu()" 
                    class="w-full btn-primary"
                >
                    Get Started
                </button>
            `;
        }

        const userName = this.currentUser?.name || 'User';

        return `
            <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold">
                    ${userName.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div class="font-semibold text-gray-900">${userName}</div>
                    <div class="text-sm text-gray-500">${this.currentUser?.email || ''}</div>
                </div>
            </div>
            <div class="space-y-2">
                <a href="#profile" class="block w-full text-left px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200">
                    <i class="fas fa-user mr-2"></i> Profile
                </a>
                <a href="#settings" class="block w-full text-left px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200">
                    <i class="fas fa-cog mr-2"></i> Settings
                </a>
                <button 
                    onclick="authManager.logout()" 
                    class="block w-full text-left px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                >
                    <i class="fas fa-sign-out-alt mr-2"></i> Sign Out
                </button>
            </div>
        `;
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        const menu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        const btn = document.getElementById('mobile-menu-btn');

        if (this.mobileMenuOpen) {
            menu.classList.add('open');
            overlay.classList.remove('hidden');
            btn.innerHTML = '<i class="fas fa-times text-xl"></i>';
            document.body.style.overflow = 'hidden';
        } else {
            menu.classList.remove('open');
            overlay.classList.add('hidden');
            btn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        this.mobileMenuOpen = false;
        const menu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        const btn = document.getElementById('mobile-menu-btn');

        menu.classList.remove('open');
        overlay.classList.add('hidden');
        btn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
        document.body.style.overflow = '';
    }

    toggleUserDropdown() {
        const dropdown = document.getElementById('user-dropdown-menu');
        dropdown.classList.toggle('hidden');
    }

    attachEventListeners() {
        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            const dropdown = document.getElementById('user-dropdown');
            const dropdownMenu = document.getElementById('user-dropdown-menu');
            
            if (dropdown && !dropdown.contains(event.target)) {
                dropdownMenu?.classList.add('hidden');
            }
        });

        // Update active nav link
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const currentRoute = router.getCurrentRoute();
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('text-red-600', 'font-semibold');
            link.classList.add('text-gray-700');
        });

        const activeLink = document.querySelector(`[href="#${currentRoute}"]`);
        if (activeLink && activeLink.classList.contains('nav-link')) {
            activeLink.classList.remove('text-gray-700');
            activeLink.classList.add('text-red-600', 'font-semibold');
        }
    }

    update(isAuthenticated, user) {
        this.render(isAuthenticated, user);
    }
}

// Global header component instance
const headerComponent = new HeaderComponent();