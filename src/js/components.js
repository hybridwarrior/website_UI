// Component System for Oracle Boxing Coach AI

class ComponentSystem {
    constructor() {
        this.components = new Map();
        this.globalComponents = new Set(['header', 'footer']);
        this.initialized = false;
    }

    // Initialize the component system
    async init() {
        if (this.initialized) return;

        try {
            // Register all components
            this.registerComponents();

            // Initialize global components
            await this.initializeGlobalComponents();

            // Set up authentication listeners
            this.setupAuthListeners();

            this.initialized = true;
            console.log('Component system initialized');

        } catch (error) {
            console.error('Component system initialization failed:', error);
        }
    }

    // Register all available components
    registerComponents() {
        // Authentication components
        this.register('login', {
            component: 'loginComponent',
            dependencies: ['auth', 'router'],
            global: false
        });

        this.register('register', {
            component: 'registerComponent',
            dependencies: ['auth', 'router'],
            global: false
        });

        // Main app components
        this.register('dashboard', {
            component: 'dashboardComponent',
            dependencies: ['auth', 'api'],
            global: false
        });

        this.register('chat', {
            component: 'chatComponent',
            dependencies: ['auth', 'api'],
            global: false
        });

        this.register('tasks', {
            component: 'tasksComponent',
            dependencies: ['auth', 'api'],
            global: false
        });

        // Global components
        this.register('header', {
            component: 'headerComponent',
            dependencies: ['auth', 'router'],
            global: true
        });

        this.register('footer', {
            component: 'footerComponent',
            dependencies: [],
            global: true
        });
    }

    // Register a component
    register(name, config) {
        this.components.set(name, {
            name,
            initialized: false,
            ...config
        });
    }

    // Initialize global components
    async initializeGlobalComponents() {
        for (const componentName of this.globalComponents) {
            await this.initializeComponent(componentName);
        }
    }

    // Initialize a specific component
    async initializeComponent(name) {
        const config = this.components.get(name);
        
        if (!config) {
            console.warn(`Component '${name}' not found`);
            return false;
        }

        if (config.initialized) {
            return true;
        }

        try {
            // Check dependencies
            if (!this.checkDependencies(config.dependencies)) {
                console.warn(`Dependencies not met for component '${name}'`);
                return false;
            }

            // Get component instance
            const component = window[config.component];
            
            if (!component) {
                console.warn(`Component instance '${config.component}' not found`);
                return false;
            }

            // Initialize if needed
            if (typeof component.init === 'function') {
                await component.init();
            }

            config.initialized = true;
            console.log(`Component '${name}' initialized`);
            return true;

        } catch (error) {
            console.error(`Failed to initialize component '${name}':`, error);
            return false;
        }
    }

    // Check if dependencies are available
    checkDependencies(dependencies = []) {
        const dependencyMap = {
            'auth': () => typeof authManager !== 'undefined',
            'router': () => typeof router !== 'undefined',
            'api': () => typeof apiClient !== 'undefined',
            'utils': () => typeof utils !== 'undefined'
        };

        return dependencies.every(dep => {
            const checker = dependencyMap[dep];
            return checker ? checker() : false;
        });
    }

    // Set up authentication state listeners
    setupAuthListeners() {
        if (typeof authManager !== 'undefined') {
            authManager.onAuthChange((isAuthenticated, user) => {
                this.handleAuthChange(isAuthenticated, user);
            });
        }
    }

    // Handle authentication state changes
    handleAuthChange(isAuthenticated, user) {
        // Update header component
        const headerComponent = window.headerComponent;
        if (headerComponent && typeof headerComponent.update === 'function') {
            headerComponent.update(isAuthenticated, user);
        }

        // Update other components that depend on auth state
        this.notifyAuthChange(isAuthenticated, user);
    }

    // Notify all components of auth changes
    notifyAuthChange(isAuthenticated, user) {
        this.components.forEach((config, name) => {
            if (config.initialized && config.dependencies.includes('auth')) {
                const component = window[config.component];
                
                if (component && typeof component.onAuthChange === 'function') {
                    component.onAuthChange(isAuthenticated, user);
                }
            }
        });
    }

    // Get component instance
    getComponent(name) {
        const config = this.components.get(name);
        return config ? window[config.component] : null;
    }

    // Check if component is initialized
    isInitialized(name) {
        const config = this.components.get(name);
        return config ? config.initialized : false;
    }

    // Reinitialize a component
    async reinitialize(name) {
        const config = this.components.get(name);
        if (config) {
            config.initialized = false;
            return await this.initializeComponent(name);
        }
        return false;
    }

    // Refresh all components
    async refreshAll() {
        for (const [name, config] of this.components) {
            if (config.initialized) {
                const component = window[config.component];
                if (component && typeof component.refresh === 'function') {
                    await component.refresh();
                }
            }
        }
    }

    // Cleanup component system
    cleanup() {
        this.components.forEach((config, name) => {
            const component = window[config.component];
            if (component && typeof component.cleanup === 'function') {
                component.cleanup();
            }
        });

        this.components.clear();
        this.initialized = false;
    }
}

// Component Loading Manager
class ComponentLoader {
    constructor() {
        this.loadedComponents = new Set();
        this.loadingPromises = new Map();
    }

    // Dynamically load a component script
    async loadComponent(componentName) {
        if (this.loadedComponents.has(componentName)) {
            return true;
        }

        if (this.loadingPromises.has(componentName)) {
            return await this.loadingPromises.get(componentName);
        }

        const loadPromise = this.loadComponentScript(componentName);
        this.loadingPromises.set(componentName, loadPromise);

        try {
            await loadPromise;
            this.loadedComponents.add(componentName);
            this.loadingPromises.delete(componentName);
            return true;
        } catch (error) {
            this.loadingPromises.delete(componentName);
            throw error;
        }
    }

    // Load component script file
    async loadComponentScript(componentName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `/src/components/${componentName}.js`;
            script.async = true;

            script.onload = () => {
                console.log(`Component '${componentName}' loaded`);
                resolve();
            };

            script.onerror = () => {
                console.error(`Failed to load component '${componentName}'`);
                reject(new Error(`Component load failed: ${componentName}`));
            };

            document.head.appendChild(script);
        });
    }

    // Preload multiple components
    async preloadComponents(componentNames) {
        const loadPromises = componentNames.map(name => this.loadComponent(name));
        
        try {
            await Promise.all(loadPromises);
            console.log('All components preloaded successfully');
        } catch (error) {
            console.warn('Some components failed to preload:', error);
        }
    }

    // Check if component is loaded
    isLoaded(componentName) {
        return this.loadedComponents.has(componentName);
    }
}

// Component State Manager
class ComponentStateManager {
    constructor() {
        this.states = new Map();
        this.subscribers = new Map();
    }

    // Set component state
    setState(componentName, state) {
        const currentState = this.states.get(componentName) || {};
        const newState = { ...currentState, ...state };
        
        this.states.set(componentName, newState);
        this.notifySubscribers(componentName, newState);
    }

    // Get component state
    getState(componentName) {
        return this.states.get(componentName) || {};
    }

    // Subscribe to state changes
    subscribe(componentName, callback) {
        if (!this.subscribers.has(componentName)) {
            this.subscribers.set(componentName, new Set());
        }
        
        this.subscribers.get(componentName).add(callback);
        
        // Return unsubscribe function
        return () => {
            const subs = this.subscribers.get(componentName);
            if (subs) {
                subs.delete(callback);
            }
        };
    }

    // Notify subscribers of state changes
    notifySubscribers(componentName, newState) {
        const subs = this.subscribers.get(componentName);
        if (subs) {
            subs.forEach(callback => {
                try {
                    callback(newState);
                } catch (error) {
                    console.error('State subscriber error:', error);
                }
            });
        }
    }

    // Clear component state
    clearState(componentName) {
        this.states.delete(componentName);
        this.subscribers.delete(componentName);
    }

    // Clear all states
    clearAll() {
        this.states.clear();
        this.subscribers.clear();
    }
}

// Global instances
const componentSystem = new ComponentSystem();
const componentLoader = new ComponentLoader();
const componentStateManager = new ComponentStateManager();

// Initialize component system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        componentSystem.init();
    });
} else {
    componentSystem.init();
}

// Export for use in other modules
window.ComponentSystem = ComponentSystem;
window.ComponentLoader = ComponentLoader;
window.ComponentStateManager = ComponentStateManager;
window.componentSystem = componentSystem;
window.componentLoader = componentLoader;
window.componentStateManager = componentStateManager;