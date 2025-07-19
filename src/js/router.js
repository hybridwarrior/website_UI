// Router for Oracle Boxing Coach AI

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.defaultRoute = 'login';
        this.isNavigating = false;
        this.routeHistory = [];
        this.maxHistoryLength = 50;
        
        this.initializeRoutes();
        this.attachEventListeners();
    }

    // Initialize all application routes
    initializeRoutes() {
        // Authentication routes
        this.addRoute('login', {
            component: 'loginComponent',
            requiresAuth: false,
            title: 'Sign In - Oracle Boxing AI'
        });

        this.addRoute('register', {
            component: 'registerComponent',
            requiresAuth: false,
            title: 'Create Account - Oracle Boxing AI'
        });

        // Authenticated routes
        this.addRoute('dashboard', {
            component: 'dashboardComponent',
            requiresAuth: true,
            title: 'Dashboard - Oracle Boxing AI'
        });

        this.addRoute('chat', {
            component: 'chatComponent',
            requiresAuth: true,
            title: 'Training - Oracle Boxing AI'
        });

        this.addRoute('tasks', {
            component: 'tasksComponent',
            requiresAuth: true,
            title: 'Tasks - Oracle Boxing AI'
        });

        // Future routes (placeholders)
        this.addRoute('progress', {
            component: null,
            requiresAuth: true,
            title: 'Progress - Oracle Boxing AI',
            placeholder: true
        });

        this.addRoute('techniques', {
            component: null,
            requiresAuth: true,
            title: 'Techniques - Oracle Boxing AI',
            placeholder: true
        });

        this.addRoute('video-analysis', {
            component: null,
            requiresAuth: true,
            title: 'Video Analysis - Oracle Boxing AI',
            placeholder: true
        });

        this.addRoute('profile', {
            component: null,
            requiresAuth: true,
            title: 'Profile - Oracle Boxing AI',
            placeholder: true
        });

        this.addRoute('settings', {
            component: null,
            requiresAuth: true,
            title: 'Settings - Oracle Boxing AI',
            placeholder: true
        });
    }

    // Add a route to the router
    addRoute(path, config) {
        this.routes.set(path, {
            path,
            ...config
        });
    }

    // Attach event listeners
    attachEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            const route = event.state?.route || this.getRouteFromURL();
            this.navigate(route, false); // Don't push to history
        });

        // Handle initial page load
        window.addEventListener('load', () => {
            this.handleInitialRoute();
        });

        // Handle hash changes (fallback)
        window.addEventListener('hashchange', () => {
            const route = this.getRouteFromHash();
            if (route) {
                this.navigate(route, false);
            }
        });
    }

    // Handle initial route on page load
    handleInitialRoute() {
        const route = this.getRouteFromURL() || this.getRouteFromHash() || this.defaultRoute;
        this.navigate(route, false);
    }

    // Get route from URL path
    getRouteFromURL() {
        const path = window.location.pathname;
        const routes = Array.from(this.routes.keys());
        
        // Check for exact matches
        for (const route of routes) {
            if (path === `/${route}` || path === `/${route}/`) {
                return route;
            }
        }
        
        // Check for root path
        if (path === '/' || path === '') {
            return this.defaultRoute;
        }
        
        return null;
    }

    // Get route from hash (fallback)
    getRouteFromHash() {
        const hash = window.location.hash.slice(1); // Remove #
        return this.routes.has(hash) ? hash : null;
    }

    // Navigate to a route
    async navigate(routeName, pushToHistory = true) {
        if (this.isNavigating) {
            console.warn('Navigation already in progress');
            return;
        }

        if (!this.routes.has(routeName)) {
            console.error(`Route '${routeName}' not found`);
            this.navigate('dashboard');
            return;
        }

        this.isNavigating = true;
        
        try {
            const route = this.routes.get(routeName);
            
            // Check authentication requirements
            if (route.requiresAuth && !authManager.isUserAuthenticated()) {
                this.navigate('login');
                return;
            }
            
            if (!route.requiresAuth && authManager.isUserAuthenticated() && routeName !== 'login') {
                // Redirect authenticated users away from guest pages
                if (routeName === 'register') {
                    this.navigate('dashboard');
                    return;
                }
            }

            // Show loading state
            this.showRouteLoading();

            // Update browser history
            if (pushToHistory) {
                this.updateHistory(routeName);
            }

            // Update page title
            document.title = route.title;

            // Hide all pages
            this.hideAllPages();

            // Handle placeholder routes
            if (route.placeholder) {
                this.showPlaceholderPage(routeName);
            } else {
                // Render the component
                await this.renderRoute(route);
            }

            // Update current route
            this.currentRoute = routeName;

            // Update navigation state
            this.updateNavigation();

            // Add to route history
            this.addToHistory(routeName);

        } catch (error) {
            console.error('Navigation error:', error);
            utils.showToast('Navigation failed', 'error');
        } finally {
            this.isNavigating = false;
            this.hideRouteLoading();
        }
    }

    // Render a route component
    async renderRoute(route) {
        if (!route.component) {
            throw new Error(`No component defined for route: ${route.path}`);
        }

        const component = window[route.component];
        if (!component) {
            throw new Error(`Component '${route.component}' not found`);
        }

        // Reset component state if needed
        if (typeof component.reset === 'function') {
            component.reset();
        }

        // Render the component
        if (typeof component.render === 'function') {
            await component.render();
        }

        // Show the page
        this.showPage(route.path);
    }

    // Show placeholder page for unimplemented routes
    showPlaceholderPage(routeName) {
        const pageElement = document.getElementById(`${routeName}-page`);
        
        if (!pageElement) {
            // Create placeholder page dynamically
            const container = document.getElementById('page-container');
            const placeholderHTML = `
                <div id="${routeName}-page" class="page-content">
                    <div class="min-h-screen flex items-center justify-center bg-gray-50">
                        <div class="text-center">
                            <div class="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i class="fas fa-hammer text-3xl"></i>
                            </div>
                            <h1 class="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h1>
                            <p class="text-lg text-gray-600 mb-8">
                                The ${this.formatRouteName(routeName)} feature is under development.
                            </p>
                            <button 
                                onclick="router.navigate('dashboard')" 
                                class="btn-primary"
                            >
                                <i class="fas fa-arrow-left mr-2"></i>Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', placeholderHTML);
        }
        
        this.showPage(routeName);
    }

    // Format route name for display
    formatRouteName(routeName) {
        return routeName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Update browser history
    updateHistory(routeName) {
        const url = `/${routeName}`;
        const state = { route: routeName, timestamp: Date.now() };
        
        if (window.location.pathname !== url) {
            window.history.pushState(state, '', url);
        }
    }

    // Add route to internal history
    addToHistory(routeName) {
        this.routeHistory.push({
            route: routeName,
            timestamp: Date.now()
        });

        // Limit history size
        if (this.routeHistory.length > this.maxHistoryLength) {
            this.routeHistory.shift();
        }
    }

    // Hide all page elements
    hideAllPages() {
        const pages = document.querySelectorAll('.page-content');
        pages.forEach(page => {
            page.classList.remove('active');
            page.classList.add('hidden');
        });
    }

    // Show specific page
    showPage(routeName) {
        const pageElement = document.getElementById(`${routeName}-page`);
        if (pageElement) {
            pageElement.classList.remove('hidden');
            setTimeout(() => {
                pageElement.classList.add('active');
            }, 50);
        }
    }

    // Update navigation active states
    updateNavigation() {
        // Update header navigation if available
        if (typeof headerComponent !== 'undefined' && headerComponent.updateActiveNavLink) {
            headerComponent.updateActiveNavLink();
        }

        // Update any other navigation elements
        const navLinks = document.querySelectorAll('[data-route]');
        navLinks.forEach(link => {
            const route = link.getAttribute('data-route');
            if (route === this.currentRoute) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Show loading state
    showRouteLoading() {
        const loadingElement = document.getElementById('loading-overlay');
        if (loadingElement) {
            loadingElement.classList.remove('hidden');
        }
    }

    // Hide loading state
    hideRouteLoading() {
        setTimeout(() => {
            const loadingElement = document.getElementById('loading-overlay');
            if (loadingElement) {
                loadingElement.classList.add('hidden');
            }
        }, 100);
    }

    // Get current route
    getCurrentRoute() {
        return this.currentRoute;
    }

    // Get previous route
    getPreviousRoute() {
        if (this.routeHistory.length < 2) return null;
        return this.routeHistory[this.routeHistory.length - 2].route;
    }

    // Go back to previous route
    goBack() {
        const previousRoute = this.getPreviousRoute();
        if (previousRoute) {
            this.navigate(previousRoute);
        } else {
            this.navigate(this.defaultRoute);
        }
    }

    // Replace current route (no history entry)
    replace(routeName) {
        this.navigate(routeName, false);
        
        // Replace current history state
        const url = `/${routeName}`;
        const state = { route: routeName, timestamp: Date.now() };
        window.history.replaceState(state, '', url);
    }

    // Check if route exists
    hasRoute(routeName) {
        return this.routes.has(routeName);
    }

    // Get route configuration
    getRoute(routeName) {
        return this.routes.get(routeName);
    }

    // Get all routes
    getAllRoutes() {
        return Array.from(this.routes.keys());
    }

    // Get authenticated routes
    getAuthenticatedRoutes() {
        return Array.from(this.routes.values())
            .filter(route => route.requiresAuth)
            .map(route => route.path);
    }

    // Get guest routes
    getGuestRoutes() {
        return Array.from(this.routes.values())
            .filter(route => !route.requiresAuth)
            .map(route => route.path);
    }

    // Set default route
    setDefaultRoute(routeName) {
        if (this.routes.has(routeName)) {
            this.defaultRoute = routeName;
        }
    }

    // Middleware support for future enhancement
    beforeNavigate(callback) {
        // Future: Add middleware support
        console.warn('Middleware support not implemented yet');
    }

    afterNavigate(callback) {
        // Future: Add middleware support
        console.warn('Middleware support not implemented yet');
    }

    // Route guards
    addGuard(routeName, guardFunction) {
        const route = this.routes.get(routeName);
        if (route) {
            route.guard = guardFunction;
        }
    }

    // Cleanup
    destroy() {
        window.removeEventListener('popstate', this.handlePopState);
        window.removeEventListener('hashchange', this.handleHashChange);
        this.routes.clear();
        this.routeHistory = [];
    }
}

// Global router instance
const router = new Router();

// Export for use in other modules
window.Router = Router;