// Authentication Manager for Oracle Boxing Coach AI

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.tokenCheckInterval = null;
        this.sessionCheckInterval = 5 * 60 * 1000; // 5 minutes
        this.authCallbacks = new Set();
    }

    // Initialize authentication
    async init() {
        // Check for existing session
        await this.checkAuthStatus();
        
        // Start periodic session validation
        this.startSessionCheck();
        
        // Listen for storage changes (multi-tab support)
        window.addEventListener('storage', (e) => {
            if (e.key === 'auth_token') {
                this.handleTokenChange(e.newValue);
            }
        });

        return this.isAuthenticated;
    }

    // Check current authentication status
    async checkAuthStatus() {
        const token = utils.getStorage('auth_token');
        
        if (!token) {
            this.clearSession();
            return false;
        }

        try {
            const result = await apiClient.verifyToken();
            
            if (result.success) {
                this.setSession(result.user, token);
                return true;
            } else {
                this.clearSession();
                return false;
            }
        } catch (error) {
            console.warn('Token verification failed:', error);
            this.clearSession();
            return false;
        }
    }

    // Login with credentials
    async login(credentials) {
        try {
            utils.showLoading('Signing in...');
            
            const result = await apiClient.login(credentials);
            
            if (result.success) {
                this.setSession(result.user, result.token);
                this.notifyAuthChange(true);
                
                // Store remember me preference
                if (credentials.remember) {
                    utils.setStorage('remember_me', true);
                }
                
                return { success: true };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.message || 'Login failed' 
            };
        } finally {
            utils.hideLoading();
        }
    }

    // Register new user
    async register(userData) {
        try {
            utils.showLoading('Creating account...');
            
            const result = await apiClient.register(userData);
            
            if (result.success) {
                this.setSession(result.user, result.token);
                this.notifyAuthChange(true);
                
                return { success: true };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.message || 'Registration failed' 
            };
        } finally {
            utils.hideLoading();
        }
    }

    // Demo login
    async demoLogin() {
        try {
            utils.showLoading('Loading demo...');
            
            const result = await apiClient.demoLogin();
            
            if (result.success) {
                this.setSession(result.user, result.token);
                this.notifyAuthChange(true);
                
                // Mark as demo session
                utils.setStorage('demo_session', true, true);
                
                return { success: true };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.message || 'Demo login failed' 
            };
        } finally {
            utils.hideLoading();
        }
    }

    // Logout
    async logout() {
        try {
            // Notify server (don't wait for response)
            apiClient.logout().catch(err => console.warn('Logout request failed:', err));
            
            this.clearSession();
            this.notifyAuthChange(false);
            
            // Redirect to login page
            router.navigate('login');
            
            utils.showToast('You have been signed out', 'info');
            
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // Refresh authentication token
    async refreshToken() {
        try {
            const result = await apiClient.refreshToken();
            
            if (result.success) {
                // Token is automatically stored by apiClient
                return true;
            } else {
                this.clearSession();
                this.notifyAuthChange(false);
                return false;
            }
        } catch (error) {
            console.warn('Token refresh failed:', error);
            this.clearSession();
            this.notifyAuthChange(false);
            return false;
        }
    }

    // Set authentication session
    setSession(user, token) {
        this.currentUser = user;
        this.isAuthenticated = true;
        
        // Store user data
        utils.setStorage('current_user', user);
        
        // Token is stored by apiClient
        if (token) {
            apiClient.setAuthToken(token);
        }
    }

    // Clear authentication session
    clearSession() {
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Clear stored data
        utils.removeStorage('current_user');
        utils.removeStorage('auth_token');
        utils.removeStorage('demo_session', true);
        
        apiClient.clearAuthToken();
    }

    // Get current user
    getCurrentUser() {
        if (!this.currentUser) {
            this.currentUser = utils.getStorage('current_user');
        }
        return this.currentUser;
    }

    // Check if user is authenticated
    isUserAuthenticated() {
        return this.isAuthenticated && this.currentUser !== null;
    }

    // Check if current session is demo
    isDemoSession() {
        return utils.getStorage('demo_session', true) === true;
    }

    // Update user profile
    async updateProfile(profileData) {
        try {
            const result = await apiClient.updateUserProfile(profileData);
            
            if (result.success) {
                // Update stored user data
                this.currentUser = { ...this.currentUser, ...result.user };
                utils.setStorage('current_user', this.currentUser);
                
                this.notifyAuthChange(true);
                return { success: true };
            }
            
            return { success: false, message: result.message };
        } catch (error) {
            return { 
                success: false, 
                message: error.message || 'Profile update failed' 
            };
        }
    }

    // Handle token changes (multi-tab support)
    handleTokenChange(newToken) {
        if (!newToken) {
            // Token was removed in another tab
            this.clearSession();
            this.notifyAuthChange(false);
            router.navigate('login');
        } else {
            // Token was updated in another tab
            this.checkAuthStatus();
        }
    }

    // Start periodic session check
    startSessionCheck() {
        if (this.tokenCheckInterval) {
            clearInterval(this.tokenCheckInterval);
        }
        
        this.tokenCheckInterval = setInterval(async () => {
            if (this.isAuthenticated) {
                const isValid = await this.checkAuthStatus();
                if (!isValid) {
                    utils.showToast('Session expired. Please sign in again.', 'warning');
                    router.navigate('login');
                }
            }
        }, this.sessionCheckInterval);
    }

    // Stop session check
    stopSessionCheck() {
        if (this.tokenCheckInterval) {
            clearInterval(this.tokenCheckInterval);
            this.tokenCheckInterval = null;
        }
    }

    // Subscribe to authentication changes
    onAuthChange(callback) {
        this.authCallbacks.add(callback);
        
        // Return unsubscribe function
        return () => {
            this.authCallbacks.delete(callback);
        };
    }

    // Notify subscribers of authentication changes
    notifyAuthChange(isAuthenticated) {
        this.authCallbacks.forEach(callback => {
            try {
                callback(isAuthenticated, this.currentUser);
            } catch (error) {
                console.error('Auth callback error:', error);
            }
        });
    }

    // Route guards
    requireAuth(callback) {
        if (this.isUserAuthenticated()) {
            callback();
        } else {
            router.navigate('login');
            utils.showToast('Please sign in to continue', 'info');
        }
    }

    requireGuest(callback) {
        if (!this.isUserAuthenticated()) {
            callback();
        } else {
            router.navigate('dashboard');
        }
    }

    // Password strength checker
    checkPasswordStrength(password) {
        const checks = utils.validatePassword(password);
        const score = Object.values(checks).filter(Boolean).length;
        
        let strength = 'weak';
        let color = 'red';
        
        if (score >= 4) {
            strength = 'strong';
            color = 'green';
        } else if (score >= 3) {
            strength = 'medium';
            color = 'yellow';
        }
        
        return {
            score,
            strength,
            color,
            checks,
            feedback: this.getPasswordFeedback(checks)
        };
    }

    getPasswordFeedback(checks) {
        const feedback = [];
        
        if (!checks.length) feedback.push('Use at least 8 characters');
        if (!checks.uppercase) feedback.push('Add uppercase letters');
        if (!checks.lowercase) feedback.push('Add lowercase letters');
        if (!checks.number) feedback.push('Add numbers');
        if (!checks.special) feedback.push('Add special characters');
        
        return feedback;
    }

    // Social login methods (placeholder for future implementation)
    async loginWithGoogle() {
        utils.showToast('Google login coming soon!', 'info');
        return { success: false, message: 'Not implemented yet' };
    }

    async loginWithApple() {
        utils.showToast('Apple login coming soon!', 'info');
        return { success: false, message: 'Not implemented yet' };
    }

    // Reset password
    async requestPasswordReset(email) {
        try {
            const result = await apiClient.post('/auth/reset-password', { email });
            return { success: true, message: 'Reset link sent to your email' };
        } catch (error) {
            return { 
                success: false, 
                message: error.message || 'Reset request failed' 
            };
        }
    }

    async resetPassword(token, newPassword) {
        try {
            const result = await apiClient.post('/auth/reset-password/confirm', {
                token,
                password: newPassword
            });
            
            return { success: true, message: 'Password reset successfully' };
        } catch (error) {
            return { 
                success: false, 
                message: error.message || 'Password reset failed' 
            };
        }
    }

    // Cleanup on page unload
    cleanup() {
        this.stopSessionCheck();
        this.authCallbacks.clear();
    }
}

// Global auth manager instance
const authManager = new AuthManager();

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => authManager.init());
} else {
    authManager.init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => authManager.cleanup());

// Export for use in other modules
window.AuthManager = AuthManager;