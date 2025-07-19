// Utility Functions for Oracle Boxing Coach AI

class Utils {
    constructor() {
        this.toastContainer = null;
        this.loadingOverlay = null;
    }

    // Initialize utilities
    init() {
        this.toastContainer = document.getElementById('toast-container');
        this.loadingOverlay = document.getElementById('loading-overlay');
    }

    // Loading overlay methods
    showLoading(message = 'Loading...') {
        if (this.loadingOverlay) {
            const loadingText = this.loadingOverlay.querySelector('span');
            if (loadingText) {
                loadingText.textContent = message;
            }
            this.loadingOverlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('hidden');
        }
    }

    // Toast notification system
    showToast(message, type = 'info', duration = 5000) {
        if (!this.toastContainer) return;

        const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const iconMap = {
            success: 'fas fa-check-circle text-green-600',
            error: 'fas fa-exclamation-circle text-red-600',
            warning: 'fas fa-exclamation-triangle text-yellow-600',
            info: 'fas fa-info-circle text-blue-600'
        };

        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast ${type} opacity-0 translate-x-full`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="${iconMap[type] || iconMap.info} mr-3"></i>
                <div class="flex-1">
                    <p class="font-medium text-gray-900">${message}</p>
                </div>
                <button onclick="utils.dismissToast('${toastId}')" class="ml-3 text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        this.toastContainer.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('opacity-0', 'translate-x-full');
        }, 100);

        // Auto-dismiss
        if (duration > 0) {
            setTimeout(() => {
                this.dismissToast(toastId);
            }, duration);
        }

        return toastId;
    }

    dismissToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.classList.add('opacity-0', 'translate-x-full');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    }

    // Format time helpers
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    formatDuration(minutes) {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }

    formatDate(date) {
        const now = new Date();
        const target = new Date(date);
        const diffMs = now - target;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        
        return target.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: target.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }

    // Form validation helpers
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
    }

    // Storage helpers
    setStorage(key, value, isSession = false) {
        try {
            const storage = isSession ? sessionStorage : localStorage;
            storage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }

    getStorage(key, isSession = false) {
        try {
            const storage = isSession ? sessionStorage : localStorage;
            const item = storage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage error:', error);
            return null;
        }
    }

    removeStorage(key, isSession = false) {
        try {
            const storage = isSession ? sessionStorage : localStorage;
            storage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }

    // Animation helpers
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    fadeOut(element, duration = 300) {
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            element.style.opacity = 1 - progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }

    slideDown(element, duration = 300) {
        element.style.maxHeight = '0px';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        const height = element.scrollHeight;
        let start = null;
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            element.style.maxHeight = `${height * progress}px`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.maxHeight = '';
                element.style.overflow = '';
            }
        };
        
        requestAnimationFrame(animate);
    }

    slideUp(element, duration = 300) {
        const height = element.scrollHeight;
        element.style.maxHeight = `${height}px`;
        element.style.overflow = 'hidden';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            element.style.maxHeight = `${height * (1 - progress)}px`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
                element.style.maxHeight = '';
                element.style.overflow = '';
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Debounce function
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Deep clone helper
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }

    // Random helpers
    generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // URL helpers
    getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }

    setQueryParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url);
    }

    removeQueryParam(key) {
        const url = new URL(window.location);
        url.searchParams.delete(key);
        window.history.pushState({}, '', url);
    }

    // Device detection
    isMobile() {
        return window.innerWidth <= 768;
    }

    isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    // Boxing-specific utilities
    getSkillLevel(score) {
        if (score >= 9) return { level: 'Expert', color: 'purple' };
        if (score >= 8) return { level: 'Advanced', color: 'blue' };
        if (score >= 6) return { level: 'Intermediate', color: 'green' };
        if (score >= 4) return { level: 'Beginner', color: 'yellow' };
        return { level: 'Novice', color: 'gray' };
    }

    formatTrainingType(type) {
        const typeMap = {
            'technique': 'Technique Training',
            'conditioning': 'Conditioning',
            'sparring': 'Sparring Session',
            'mixed': 'Mixed Training',
            'cardio': 'Cardio Training',
            'strength': 'Strength Training'
        };
        return typeMap[type] || type;
    }
}

// Global utils instance
const utils = new Utils();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => utils.init());
} else {
    utils.init();
}