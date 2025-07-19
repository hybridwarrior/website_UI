// Main Application Entry Point for Oracle Boxing Coach AI

class App {
    constructor() {
        this.initialized = false;
        this.isOnline = navigator.onLine;
        this.retryAttempts = 0;
        this.maxRetryAttempts = 3;
        this.initializationPromise = null;
        
        // Bind methods
        this.handleOnline = this.handleOnline.bind(this);
        this.handleOffline = this.handleOffline.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    }

    // Initialize the application
    async init() {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = this.performInitialization();
        return this.initializationPromise;
    }

    async performInitialization() {
        try {
            console.log('🚀 Oracle Boxing AI - Initializing...');
            
            // Show initial loading
            this.showInitialLoading();

            // Check browser compatibility
            if (!this.checkBrowserCompatibility()) {
                this.showCompatibilityError();
                return false;
            }

            // Initialize core systems in order
            await this.initializeCore();
            await this.initializeAuthentication();
            await this.initializeComponents();
            await this.initializeRouting();
            await this.performHealthCheck();

            // Set up event listeners
            this.attachEventListeners();

            // Hide loading and show app
            this.hideInitialLoading();

            this.initialized = true;
            console.log('✅ Oracle Boxing AI - Initialized successfully');

            // Show welcome message for first-time users
            this.showWelcomeMessage();

            return true;

        } catch (error) {
            console.error('❌ Application initialization failed:', error);
            this.handleInitializationError(error);
            return false;
        }
    }

    // Initialize core utilities
    async initializeCore() {
        console.log('⚙️ Initializing core systems...');
        
        // Utils should already be initialized
        if (typeof utils === 'undefined') {
            throw new Error('Utils system not available');
        }

        // Initialize API client
        if (typeof apiClient === 'undefined') {
            throw new Error('API client not available');
        }

        console.log('✅ Core systems initialized');
    }

    // Initialize authentication
    async initializeAuthentication() {
        console.log('🔐 Initializing authentication...');
        
        if (typeof authManager === 'undefined') {
            throw new Error('Auth manager not available');
        }

        const isAuthenticated = await authManager.init();
        console.log(`✅ Authentication initialized (authenticated: ${isAuthenticated})`);
        
        return isAuthenticated;
    }

    // Initialize components
    async initializeComponents() {
        console.log('🧩 Initializing components...');
        
        if (typeof componentSystem === 'undefined') {
            throw new Error('Component system not available');
        }

        await componentSystem.init();
        console.log('✅ Components initialized');
    }

    // Initialize routing
    async initializeRouting() {
        console.log('🗺️ Initializing routing...');
        
        if (typeof router === 'undefined') {
            throw new Error('Router not available');
        }

        // Router initializes automatically, just verify it's working
        console.log('✅ Routing initialized');
    }

    // Perform application health check
    async performHealthCheck() {
        console.log('🏥 Performing health check...');
        
        try {
            // Check API connectivity
            const healthResult = await apiClient.healthCheck();
            
            if (!healthResult.success) {
                console.warn('⚠️ API health check failed, app will work in offline mode');
                this.showOfflineNotice();
            } else {
                console.log('✅ Health check passed');
            }
        } catch (error) {
            console.warn('⚠️ Health check failed:', error);
            this.showOfflineNotice();
        }
    }

    // Check browser compatibility
    checkBrowserCompatibility() {
        const requirements = {
            fetch: typeof fetch !== 'undefined',
            localStorage: typeof Storage !== 'undefined',
            es6: typeof Map !== 'undefined' && typeof Set !== 'undefined',
            promises: typeof Promise !== 'undefined'
        };

        const unsupported = Object.entries(requirements)
            .filter(([feature, supported]) => !supported)
            .map(([feature]) => feature);

        if (unsupported.length > 0) {
            console.error('❌ Browser compatibility check failed:', unsupported);
            return false;
        }

        console.log('✅ Browser compatibility check passed');
        return true;
    }

    // Attach event listeners
    attachEventListeners() {
        // Network status
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);

        // Page visibility
        document.addEventListener('visibilitychange', this.handleVisibilityChange);

        // Page unload
        window.addEventListener('beforeunload', this.handleBeforeUnload);

        // Global error handling
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

        console.log('✅ Event listeners attached');
    }

    // Handle online event
    handleOnline() {
        this.isOnline = true;
        console.log('🌐 App is online');
        
        utils.showToast('Connection restored', 'success', 3000);
        
        // Retry any failed operations
        this.retryFailedOperations();
        
        // Hide offline notice
        this.hideOfflineNotice();
    }

    // Handle offline event
    handleOffline() {
        this.isOnline = false;
        console.log('📴 App is offline');
        
        utils.showToast('You are offline. Some features may be limited.', 'warning', 5000);
        
        // Show offline notice
        this.showOfflineNotice();
    }

    // Handle page visibility changes
    handleVisibilityChange() {
        if (document.hidden) {
            console.log('👁️ App hidden');
            // App is hidden, pause non-essential operations
            this.pauseNonEssentialOperations();
        } else {
            console.log('👁️ App visible');
            // App is visible, resume operations
            this.resumeOperations();
        }
    }

    // Handle page unload
    handleBeforeUnload(event) {
        console.log('🚪 App unloading');
        
        // Cleanup
        this.cleanup();
        
        // Check for unsaved changes
        if (this.hasUnsavedChanges()) {
            event.preventDefault();
            event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            return event.returnValue;
        }
    }

    // Handle global errors
    handleGlobalError(event) {
        console.error('🚨 Global error:', event.error);
        
        utils.showToast('An unexpected error occurred', 'error');
        
        // Log error for debugging
        this.logError('global', event.error);
    }

    // Handle unhandled promise rejections
    handleUnhandledRejection(event) {
        console.error('🚨 Unhandled promise rejection:', event.reason);
        
        utils.showToast('An unexpected error occurred', 'error');
        
        // Prevent the default browser behavior
        event.preventDefault();
        
        // Log error for debugging
        this.logError('promise', event.reason);
    }

    // Handle keyboard shortcuts
    handleKeyboardShortcuts(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'k':
                    event.preventDefault();
                    // Quick search (future feature)
                    utils.showToast('Quick search coming soon!', 'info');
                    break;
                case '/':
                    event.preventDefault();
                    // Show help (future feature)
                    utils.showToast('Help coming soon!', 'info');
                    break;
            }
        }

        // ESC key to close modals, etc.
        if (event.key === 'Escape') {
            this.handleEscapeKey();
        }
    }

    // Handle escape key press
    handleEscapeKey() {
        // Close any open modals, dropdowns, etc.
        const modals = document.querySelectorAll('.modal:not(.hidden)');
        const dropdowns = document.querySelectorAll('.dropdown-menu:not(.hidden)');
        
        modals.forEach(modal => modal.classList.add('hidden'));
        dropdowns.forEach(dropdown => dropdown.classList.add('hidden'));
    }

    // Show initial loading screen
    showInitialLoading() {
        const loadingHTML = `
            <div id="app-loading" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
                <div class="text-center">
                    <div class="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <i class="fas fa-fist-raised text-white text-2xl"></i>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2 font-rajdhani">Oracle Boxing AI</h1>
                    <p class="text-gray-600 mb-6">Loading your training platform...</p>
                    <div class="flex items-center justify-center space-x-2">
                        <div class="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-red-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-2 h-2 bg-red-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
    }

    // Hide initial loading screen
    hideInitialLoading() {
        const loading = document.getElementById('app-loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => loading.remove(), 300);
        }
    }

    // Show compatibility error
    showCompatibilityError() {
        const errorHTML = `
            <div class="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
                <div class="text-center max-w-md">
                    <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-exclamation-triangle text-2xl"></i>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-4">Browser Not Supported</h1>
                    <p class="text-gray-600 mb-6">
                        Your browser doesn't support all the features required for Oracle Boxing AI. 
                        Please update your browser or try a different one.
                    </p>
                    <p class="text-sm text-gray-500">
                        Recommended browsers: Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
                    </p>
                </div>
            </div>
        `;
        
        document.body.innerHTML = errorHTML;
    }

    // Handle initialization errors
    handleInitializationError(error) {
        if (this.retryAttempts < this.maxRetryAttempts) {
            this.retryAttempts++;
            console.log(`🔄 Retrying initialization (attempt ${this.retryAttempts}/${this.maxRetryAttempts})`);
            
            setTimeout(() => {
                this.initializationPromise = null;
                this.performInitialization();
            }, 2000 * this.retryAttempts);
            
            return;
        }

        const errorHTML = `
            <div class="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
                <div class="text-center max-w-md">
                    <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-exclamation-circle text-2xl"></i>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-4">Failed to Load</h1>
                    <p class="text-gray-600 mb-6">
                        Oracle Boxing AI failed to initialize. This might be due to a network issue.
                    </p>
                    <button 
                        onclick="window.location.reload()" 
                        class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                        <i class="fas fa-refresh mr-2"></i>Try Again
                    </button>
                </div>
            </div>
        `;
        
        document.body.innerHTML = errorHTML;
    }

    // Show offline notice
    showOfflineNotice() {
        const existingNotice = document.getElementById('offline-notice');
        if (existingNotice) return;

        const noticeHTML = `
            <div id="offline-notice" class="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 px-4 z-40">
                <i class="fas fa-wifi-slash mr-2"></i>
                You are offline. Some features may be limited.
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', noticeHTML);
        
        // Adjust main content margin
        const app = document.getElementById('app');
        if (app) {
            app.style.marginTop = '40px';
        }
    }

    // Hide offline notice
    hideOfflineNotice() {
        const notice = document.getElementById('offline-notice');
        if (notice) {
            notice.remove();
            
            // Reset main content margin
            const app = document.getElementById('app');
            if (app) {
                app.style.marginTop = '';
            }
        }
    }

    // Show welcome message for first-time users
    showWelcomeMessage() {
        const isFirstVisit = !utils.getStorage('has_visited');
        
        if (isFirstVisit && !authManager.isUserAuthenticated()) {
            utils.setStorage('has_visited', true);
            
            setTimeout(() => {
                utils.showToast('Welcome to Oracle Boxing AI! 🥊', 'success', 5000);
            }, 1000);
        }
    }

    // Pause non-essential operations
    pauseNonEssentialOperations() {
        // Pause animations, timers, etc.
        console.log('⏸️ Pausing non-essential operations');
    }

    // Resume operations
    resumeOperations() {
        // Resume animations, timers, etc.
        console.log('▶️ Resuming operations');
        
        // Refresh data if needed
        if (authManager.isUserAuthenticated()) {
            this.refreshAppData();
        }
    }

    // Retry failed operations
    retryFailedOperations() {
        console.log('🔄 Retrying failed operations');
        
        // Refresh current component if possible
        const currentRoute = router.getCurrentRoute();
        const component = componentSystem.getComponent(currentRoute);
        
        if (component && typeof component.refresh === 'function') {
            component.refresh();
        }
    }

    // Refresh app data
    async refreshAppData() {
        try {
            // Refresh user data
            const user = await authManager.getCurrentUser();
            if (user) {
                // Refresh dashboard data if on dashboard
                if (router.getCurrentRoute() === 'dashboard') {
                    const dashboard = componentSystem.getComponent('dashboard');
                    if (dashboard && typeof dashboard.refresh === 'function') {
                        dashboard.refresh();
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to refresh app data:', error);
        }
    }

    // Check for unsaved changes
    hasUnsavedChanges() {
        // Check if any components have unsaved changes
        // This would be implemented based on specific component logic
        return false;
    }

    // Log errors for debugging
    logError(type, error) {
        const errorLog = {
            type,
            message: error.message || error,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            userId: authManager.getCurrentUser()?.id
        };

        console.error('Error logged:', errorLog);
        
        // In production, you might want to send this to an error tracking service
        // errorTrackingService.log(errorLog);
    }

    // Cleanup when app is destroyed
    cleanup() {
        console.log('🧹 Cleaning up app...');
        
        // Remove event listeners
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);

        // Cleanup components
        if (typeof componentSystem !== 'undefined') {
            componentSystem.cleanup();
        }

        // Cleanup auth manager
        if (typeof authManager !== 'undefined') {
            authManager.cleanup();
        }

        this.initialized = false;
    }

    // Get app info
    getInfo() {
        return {
            name: 'Oracle Boxing Coach AI',
            version: '1.0.0',
            initialized: this.initialized,
            online: this.isOnline,
            authenticated: authManager?.isUserAuthenticated() || false,
            currentRoute: router?.getCurrentRoute() || null
        };
    }
}

// Global app instance
const app = new App();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Export for debugging
window.app = app;

console.log('🚀 Oracle Boxing AI - App module loaded');