// API Client for Oracle Boxing Coach AI

class ApiClient {
    constructor() {
        this.baseURL = this.getBaseURL();
        this.timeout = 30000; // 30 seconds
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 second
    }

    getBaseURL() {
        // Determine API base URL based on environment
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:8000/api';
        } else if (hostname.includes('ngrok')) {
            return `https://${hostname}/api`;
        } else {
            return '/api'; // Production relative path
        }
    }

    // Core HTTP methods
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...options.headers
            },
            timeout: this.timeout,
            ...options
        };

        // Add body for POST/PUT/PATCH requests
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        let lastError;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);
                
                const response = await fetch(url, {
                    ...config,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new ApiError(
                        errorData.message || `HTTP ${response.status}`,
                        response.status,
                        errorData
                    );
                }
                
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return await response.json();
                }
                
                return await response.text();
                
            } catch (error) {
                lastError = error;
                
                // Don't retry on authentication errors or client errors
                if (error.status >= 400 && error.status < 500) {
                    throw error;
                }
                
                // Don't retry on the last attempt
                if (attempt === this.retryAttempts) {
                    throw error;
                }
                
                // Wait before retrying
                await this.delay(this.retryDelay * attempt);
            }
        }
        
        throw lastError;
    }

    async get(endpoint, params = {}) {
        const queryString = Object.keys(params).length > 0 
            ? '?' + new URLSearchParams(params).toString()
            : '';
        
        return this.request(`${endpoint}${queryString}`);
    }

    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: data
        });
    }

    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data
        });
    }

    async patch(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: data
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    // Authentication helpers
    getAuthHeaders() {
        const token = utils.getStorage('auth_token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    setAuthToken(token) {
        utils.setStorage('auth_token', token);
    }

    clearAuthToken() {
        utils.removeStorage('auth_token');
    }

    // Utility methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Authentication endpoints
    async login(credentials) {
        try {
            const response = await this.post('/auth/login', credentials);
            
            if (response.token) {
                this.setAuthToken(response.token);
            }
            
            return {
                success: true,
                user: response.user,
                token: response.token
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Login failed'
            };
        }
    }

    async register(userData) {
        try {
            const response = await this.post('/auth/register', userData);
            
            if (response.token) {
                this.setAuthToken(response.token);
            }
            
            return {
                success: true,
                user: response.user,
                token: response.token
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Registration failed'
            };
        }
    }

    async logout() {
        try {
            await this.post('/auth/logout');
        } catch (error) {
            console.warn('Logout request failed:', error);
        } finally {
            this.clearAuthToken();
        }
        
        return { success: true };
    }

    async refreshToken() {
        try {
            const response = await this.post('/auth/refresh');
            
            if (response.token) {
                this.setAuthToken(response.token);
                return { success: true, token: response.token };
            }
            
            return { success: false };
        } catch (error) {
            this.clearAuthToken();
            return { success: false, message: error.message };
        }
    }

    async verifyToken() {
        try {
            const response = await this.get('/auth/verify');
            return { success: true, user: response.user };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async demoLogin() {
        try {
            const response = await this.post('/auth/demo');
            
            if (response.token) {
                this.setAuthToken(response.token);
            }
            
            return {
                success: true,
                user: response.user,
                token: response.token
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Demo login failed'
            };
        }
    }

    // User endpoints
    async getUserProfile() {
        return this.get('/user/profile');
    }

    async updateUserProfile(profileData) {
        return this.put('/user/profile', profileData);
    }

    async getUserStats(userId) {
        return this.get(`/user/${userId}/stats`);
    }

    async getRecentSessions(userId, limit = 5) {
        return this.get(`/user/${userId}/sessions/recent`, { limit });
    }

    // Training session endpoints
    async startSession(sessionData) {
        return this.post('/training/sessions', sessionData);
    }

    async endSession(sessionId, sessionResults) {
        return this.put(`/training/sessions/${sessionId}/end`, sessionResults);
    }

    async getSession(sessionId) {
        return this.get(`/training/sessions/${sessionId}`);
    }

    async getSessions(filters = {}) {
        return this.get('/training/sessions', filters);
    }

    // Chat/coaching endpoints
    async sendMessage(message, sessionId = null, coachType = 'Technical Master') {
        const payload = {
            message,
            coach_type: coachType,
            session_id: sessionId,
            timestamp: new Date().toISOString()
        };
        
        return this.post('/chat/message', payload);
    }

    async getChatHistory(sessionId = null, limit = 50) {
        const params = { limit };
        if (sessionId) params.session_id = sessionId;
        
        return this.get('/chat/history', params);
    }

    async getCoachPersonas() {
        return this.get('/chat/personas');
    }

    // Task management endpoints
    async getTasks(filters = {}) {
        return this.get('/tasks', filters);
    }

    async createTask(taskData) {
        return this.post('/tasks', taskData);
    }

    async updateTask(taskId, updates) {
        return this.put(`/tasks/${taskId}`, updates);
    }

    async deleteTask(taskId) {
        return this.delete(`/tasks/${taskId}`);
    }

    async completeTask(taskId, results = {}) {
        return this.patch(`/tasks/${taskId}/complete`, results);
    }

    // Technique library endpoints
    async getTechniques(category = null, difficulty = null) {
        const params = {};
        if (category) params.category = category;
        if (difficulty) params.difficulty = difficulty;
        
        return this.get('/techniques', params);
    }

    async getTechnique(techniqueId) {
        return this.get(`/techniques/${techniqueId}`);
    }

    async logTechniquePractice(techniqueId, practiceData) {
        return this.post(`/techniques/${techniqueId}/practice`, practiceData);
    }

    // Progress tracking endpoints
    async getProgressData(timeframe = '30d') {
        return this.get('/progress', { timeframe });
    }

    async getSkillAssessment() {
        return this.get('/progress/skills');
    }

    async recordProgress(progressData) {
        return this.post('/progress', progressData);
    }

    // Video analysis endpoints
    async uploadVideo(videoFile, metadata = {}) {
        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('metadata', JSON.stringify(metadata));
        
        return this.request('/video/upload', {
            method: 'POST',
            body: formData,
            headers: {
                // Don't set Content-Type for FormData
                ...this.getAuthHeaders()
            }
        });
    }

    async getVideoAnalysis(videoId) {
        return this.get(`/video/${videoId}/analysis`);
    }

    async getVideoFeedback(videoId) {
        return this.get(`/video/${videoId}/feedback`);
    }

    // Health check
    async healthCheck() {
        try {
            const response = await this.get('/health');
            return { success: true, ...response };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Utility method for file uploads with progress
    async uploadWithProgress(endpoint, file, onProgress = null) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('file', file);

            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e) {
                        resolve(xhr.responseText);
                    }
                } else {
                    reject(new ApiError(`HTTP ${xhr.status}`, xhr.status));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed'));
            });

            xhr.open('POST', `${this.baseURL}${endpoint}`);
            
            // Add auth headers
            const authHeaders = this.getAuthHeaders();
            Object.keys(authHeaders).forEach(key => {
                xhr.setRequestHeader(key, authHeaders[key]);
            });

            xhr.send(formData);
        });
    }
}

// Custom error class for API errors
class ApiError extends Error {
    constructor(message, status = 0, data = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// Global API client instance
const apiClient = new ApiClient();

// Export for use in other modules
window.ApiClient = ApiClient;
window.ApiError = ApiError;