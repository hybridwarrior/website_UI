// Chat Component for Oracle Boxing Coach AI
class ChatComponent {
    constructor() {
        this.messages = [];
        this.isLoading = false;
        this.currentSession = null;
        this.isTyping = false;
        this.messageHistory = [];
        this.currentCoach = 'Technical Master';
        this.availableCoaches = [
            'Technical Master',
            'Motivational Coach', 
            'Safety Expert',
            'Performance Analyst'
        ];
    }

    render() {
        const chatHTML = `
            <div class="flex flex-col h-full max-h-screen">
                <!-- Chat Header -->
                <div class="bg-white border-b border-gray-200 p-4 flex-shrink-0">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                <i class="fas fa-user-tie text-white"></i>
                            </div>
                            <div>
                                <h2 class="text-lg font-semibold text-gray-900">AI Boxing Coach</h2>
                                <div class="flex items-center space-x-2">
                                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span class="text-sm text-gray-600">${this.currentCoach} • Online</span>
                                </div>
                            </div>
                        </div>

                        <!-- Chat Controls -->
                        <div class="flex items-center space-x-2">
                            <!-- Coach Selector -->
                            <select 
                                id="coach-selector" 
                                class="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                onchange="chatComponent.changeCoach(this.value)"
                            >
                                ${this.availableCoaches.map(coach => 
                                    `<option value="${coach}" ${coach === this.currentCoach ? 'selected' : ''}>${coach}</option>`
                                ).join('')}
                            </select>

                            <!-- Session Controls -->
                            <button 
                                onclick="chatComponent.showSessionHistory()" 
                                class="text-gray-600 hover:text-red-600 transition-colors duration-200"
                                title="Session History"
                            >
                                <i class="fas fa-history text-lg"></i>
                            </button>
                            <button 
                                onclick="chatComponent.clearSession()" 
                                class="text-gray-600 hover:text-red-600 transition-colors duration-200"
                                title="Clear Chat"
                            >
                                <i class="fas fa-trash-alt text-lg"></i>
                            </button>
                            <button 
                                id="session-btn"
                                onclick="chatComponent.toggleSession()"
                                class="btn-primary text-sm px-3 py-1"
                            >
                                ${this.currentSession ? 'End Session' : 'Start Session'}
                            </button>

                            <!-- Menu -->
                            <button class="text-gray-500 hover:text-gray-700 p-2" onclick="chatComponent.showChatMenu()">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Session Status -->
                    ${this.renderSessionStatus()}
                </div>

                <!-- Messages Container -->
                <div class="flex-1 overflow-hidden flex flex-col">
                    <!-- Chat Messages -->
                    <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        ${this.renderMessages()}
                    </div>

                    <!-- Typing Indicator -->
                    <div id="typing-indicator" class="px-4 pb-2 ${this.isTyping ? '' : 'hidden'}">
                        <div class="flex items-center space-x-2 text-gray-500">
                            <div class="flex space-x-1">
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
                            </div>
                            <span class="text-sm">${this.currentCoach} is typing...</span>
                        </div>
                    </div>
                </div>

                <!-- Chat Input -->
                <div class="chat-input-container flex-shrink-0">
                    <form id="chat-form" class="flex items-end space-x-3">
                        <!-- Message Input -->
                        <div class="flex-1">
                            <div class="relative">
                                <textarea
                                    id="message-input"
                                    placeholder="Ask your coach anything... (Press Shift+Enter for new line)"
                                    class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                    rows="1"
                                    maxlength="1000"
                                    ${this.isLoading ? 'disabled' : ''}
                                ></textarea>
                                
                                <!-- Quick Actions -->
                                <div class="absolute right-3 top-3 flex items-center space-x-1">
                                    <button 
                                        type="button"
                                        onclick="chatComponent.showQuickActions()"
                                        class="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        title="Quick Actions"
                                    >
                                        <i class="fas fa-plus text-sm"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Character Count -->
                            <div class="text-xs text-gray-500 mt-1 text-right">
                                <span id="char-count">0</span>/1000
                            </div>
                        </div>

                        <!-- Send Button -->
                        <button
                            type="submit"
                            id="send-btn"
                            class="btn-primary px-4 py-3 flex items-center justify-center ${this.isLoading ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${this.isLoading ? 'disabled' : ''}
                        >
                            ${this.isLoading ? 
                                '<i class="fas fa-spinner fa-spin"></i>' : 
                                '<i class="fas fa-paper-plane"></i>'
                            }
                        </button>
                    </form>

                    <!-- Quick Suggestions -->
                    <div id="quick-suggestions" class="mt-2 flex flex-wrap gap-2">
                        ${this.renderQuickSuggestions()}
                    </div>
                </div>
            </div>

            <!-- Quick Actions Modal -->
            <div id="quick-actions-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center">
                <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div class="grid grid-cols-2 gap-3">
                        ${this.renderQuickActionButtons()}
                    </div>
                    <button 
                        onclick="chatComponent.hideQuickActions()" 
                        class="mt-4 w-full btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        `;

        document.getElementById('chat-page').innerHTML = chatHTML;
        this.attachEventListeners();
        this.loadChatHistory();
        this.checkActiveSession();
    }

    renderSessionStatus() {
        if (!this.currentSession) {
            return `
                <div class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-exclamation-triangle text-yellow-600"></i>
                        <span class="text-sm text-yellow-800">Start a training session to get personalized coaching</span>
                    </div>
                </div>
            `;
        }

        return `
            <div class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-play-circle text-green-600"></i>
                        <span class="text-sm text-green-800">Training Session Active</span>
                    </div>
                    <div class="text-sm text-green-600 font-medium">
                        ${this.getSessionDuration()} • ${this.currentSession.type}
                    </div>
                </div>
            </div>
        `;
    }

    renderMessages() {
        if (this.messages.length === 0) {
            return this.renderWelcomeMessage();
        }

        return this.messages.map(message => {
            return `
                <div class="chat-message ${message.sender}">
                    <div class="chat-bubble ${message.sender}">
                        ${message.sender === 'ai' ? this.renderAIMessage(message) : this.renderUserMessage(message)}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderWelcomeMessage() {
        return `
            <div class="text-center py-8">
                <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-fist-raised text-2xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Welcome to AI Boxing Coach!</h3>
                <p class="text-gray-600 max-w-md mx-auto mb-6">
                    I'm here to help you improve your boxing skills. Ask me about techniques, training, or start a session for personalized coaching.
                </p>
                
                <!-- Welcome Quick Actions -->
                <div class="flex flex-wrap justify-center gap-3">
                    <button 
                        onclick="chatComponent.sendQuickMessage('How do I improve my jab?')"
                        class="btn-outline text-sm"
                    >
                        Improve My Jab
                    </button>
                    <button 
                        onclick="chatComponent.sendQuickMessage('Show me basic boxing stance')"
                        class="btn-outline text-sm"
                    >
                        Basic Stance
                    </button>
                    <button 
                        onclick="chatComponent.sendQuickMessage('Create a training plan for me')"
                        class="btn-outline text-sm"
                    >
                        Training Plan
                    </button>
                </div>
            </div>
        `;
    }

    renderAIMessage(message) {
        return `
            <div class="space-y-3">
                <!-- Coach Info -->
                <div class="flex items-center space-x-2 mb-2">
                    <div class="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <i class="fas fa-user-tie text-white text-xs"></i>
                    </div>
                    <span class="text-xs font-medium text-gray-600">${message.coach || this.currentCoach}</span>
                    <span class="text-xs text-gray-500">${this.formatTime(message.timestamp)}</span>
                </div>

                <!-- Message Content -->
                <div class="prose prose-sm max-w-none">
                    ${this.formatMessageContent(message.content)}
                </div>

                <!-- Message Actions -->
                <div class="flex items-center space-x-3 mt-3 pt-2 border-t border-gray-100">
                    <button 
                        onclick="chatComponent.likeMessage('${message.id}')"
                        class="text-gray-400 hover:text-green-500 transition-colors duration-200"
                        title="Helpful"
                    >
                        <i class="fas fa-thumbs-up text-sm"></i>
                    </button>
                    <button 
                        onclick="chatComponent.dislikeMessage('${message.id}')"
                        class="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        title="Not helpful"
                    >
                        <i class="fas fa-thumbs-down text-sm"></i>
                    </button>
                    <button 
                        onclick="chatComponent.copyMessage('${message.id}')"
                        class="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                        title="Copy"
                    >
                        <i class="fas fa-copy text-sm"></i>
                    </button>
                    ${message.suggestions ? this.renderSuggestions(message.suggestions) : ''}
                </div>
            </div>
        `;
    }

    renderUserMessage(message) {
        return `
            <div class="space-y-2">
                <div class="flex items-center justify-end space-x-2 mb-2">
                    <span class="text-xs text-gray-500">${this.formatTime(message.timestamp)}</span>
                    <span class="text-xs font-medium text-gray-600">You</span>
                </div>
                <div>${this.formatMessageContent(message.content)}</div>
            </div>
        `;
    }

    renderSuggestions(suggestions) {
        if (!suggestions || suggestions.length === 0) return '';

        return `
            <div class="w-full mt-3">
                <div class="text-xs text-gray-500 mb-2">Suggested follow-ups:</div>
                <div class="flex flex-wrap gap-2">
                    ${suggestions.map(suggestion => `
                        <button 
                            onclick="chatComponent.sendQuickMessage('${suggestion}')"
                            class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors duration-200"
                        >
                            ${suggestion}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderQuickSuggestions() {
        const suggestions = [
            'How do I improve my jab?',
            'Show me basic combinations',
            'What should I work on today?',
            'Analyze my training progress'
        ];

        return suggestions.map(suggestion => `
            <button 
                onclick="chatComponent.sendQuickMessage('${suggestion}')"
                class="text-sm bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 px-3 py-2 rounded-lg transition-colors duration-200"
            >
                ${suggestion}
            </button>
        `).join('');
    }

    renderQuickActionButtons() {
        const actions = [
            { icon: 'fas fa-video', text: 'Video Analysis', action: 'requestVideoAnalysis()' },
            { icon: 'fas fa-chart-line', text: 'View Progress', action: 'router.navigate("progress")' },
            { icon: 'fas fa-target', text: 'Set Goal', action: 'showGoalSetting()' },
            { icon: 'fas fa-book', text: 'Technique Library', action: 'router.navigate("techniques")' },
            { icon: 'fas fa-dumbbell', text: 'Workout Plan', action: 'requestWorkoutPlan()' },
            { icon: 'fas fa-history', text: 'Clear Chat', action: 'clearChat()' }
        ];

        return actions.map(action => `
            <button 
                onclick="chatComponent.${action.action}; chatComponent.hideQuickActions()"
                class="flex flex-col items-center p-3 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
            >
                <i class="${action.icon} text-lg mb-2"></i>
                <span class="text-xs font-medium">${action.text}</span>
            </button>
        `).join('');
    }

    attachEventListeners() {
        // Chat form submission
        const chatForm = document.getElementById('chat-form');
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => this.handleSendMessage(e));
        }

        // Message input handling
        const messageInput = document.getElementById('message-input');
        if (messageInput) {
            messageInput.addEventListener('input', () => this.handleInputChange());
            messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }

        // Auto-resize textarea
        this.attachAutoResize();
    }

    attachAutoResize() {
        const textarea = document.getElementById('message-input');
        if (textarea) {
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            });
        }
    }

    handleInputChange() {
        const input = document.getElementById('message-input');
        const charCount = document.getElementById('char-count');
        
        if (input && charCount) {
            charCount.textContent = input.value.length;
        }
    }

    handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.handleSendMessage(event);
        }
    }

    async handleSendMessage(event) {
        event.preventDefault();
        
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        
        if (!message || this.isLoading) return;

        // Add user message to chat
        this.addMessage({
            id: Date.now().toString(),
            sender: 'user',
            content: message,
            timestamp: new Date()
        });

        // Clear input
        messageInput.value = '';
        messageInput.style.height = 'auto';
        this.handleInputChange();

        // Show typing indicator
        this.showTyping();

        try {
            // Send message to API
            const response = await apiClient.sendChatMessage(message, this.currentSession?.id);
            
            // Add AI response
            this.addMessage({
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                content: response.message,
                coach: response.coach || this.currentCoach,
                suggestions: response.suggestions,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage({
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                content: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.',
                coach: 'System',
                timestamp: new Date()
            });
        } finally {
            this.hideTyping();
        }
    }

    addMessage(message) {
        this.messages.push(message);
        this.saveToHistory(message);
        this.updateMessagesDisplay();
        this.scrollToBottom();
    }

    updateMessagesDisplay() {
        const container = document.getElementById('chat-messages');
        if (container) {
            container.innerHTML = this.renderMessages();
        }
    }

    scrollToBottom() {
        const container = document.getElementById('chat-messages');
        if (container) {
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 100);
        }
    }

    showTyping() {
        this.isTyping = true;
        this.setLoading(true);
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.classList.remove('hidden');
        }
    }

    hideTyping() {
        this.isTyping = false;
        this.setLoading(false);
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        const sendBtn = document.getElementById('send-btn');
        const messageInput = document.getElementById('message-input');
        
        if (sendBtn) {
            sendBtn.disabled = loading;
            sendBtn.innerHTML = loading ? 
                '<i class="fas fa-spinner fa-spin"></i>' : 
                '<i class="fas fa-paper-plane"></i>';
        }
        
        if (messageInput) {
            messageInput.disabled = loading;
        }
    }

    async sendQuickMessage(message) {
        const messageInput = document.getElementById('message-input');
        if (messageInput) {
            messageInput.value = message;
            await this.handleSendMessage({ preventDefault: () => {} });
        }
    }

    async toggleSession() {
        try {
            if (this.currentSession) {
                await this.endSession();
            } else {
                await this.startSession();
            }
        } catch (error) {
            utils.showToast('Session operation failed', 'error');
        }
    }

    async startSession() {
        try {
            utils.showLoading();
            const session = await apiClient.startTrainingSession({
                type: 'mixed',
                duration: 60
            });
            
            this.currentSession = session;
            utils.hideLoading();
            utils.showToast('Training session started! 🥊', 'success');
            this.updateSessionDisplay();
            
        } catch (error) {
            utils.hideLoading();
            utils.showToast('Failed to start session', 'error');
        }
    }

    async endSession() {
        try {
            utils.showLoading();
            const summary = await apiClient.endTrainingSession();
            
            this.currentSession = null;
            utils.hideLoading();
            utils.showToast('Session ended successfully', 'success');
            this.updateSessionDisplay();
            
            // Show session summary
            this.showSessionSummary(summary);
            
        } catch (error) {
            utils.hideLoading();
            utils.showToast('Failed to end session', 'error');
        }
    }

    async checkActiveSession() {
        try {
            const session = await apiClient.getCurrentSession();
            this.currentSession = session;
            this.updateSessionDisplay();
        } catch (error) {
            // No active session
            this.currentSession = null;
        }
    }

    updateSessionDisplay() {
        // Re-render header section
        const header = document.querySelector('.bg-white.border-b');
        if (header) {
            // Update session button and status
            this.render();
        }
    }

    changeCoach(coachName) {
        this.currentCoach = coachName;
        utils.showToast(`Switched to ${coachName}`, 'info');
        
        // Add system message
        this.addMessage({
            id: Date.now().toString(),
            sender: 'ai',
            content: `Hello! I'm ${coachName}. I'm here to help you with your boxing training. What would you like to work on?`,
            coach: coachName,
            timestamp: new Date()
        });
    }

    showQuickActions() {
        const modal = document.getElementById('quick-actions-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideQuickActions() {
        const modal = document.getElementById('quick-actions-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showChatMenu() {
        // Implementation for chat menu (export, clear, settings)
        utils.showToast('Chat menu coming soon!', 'info');
    }

    formatMessageContent(content) {
        // Format message content (markdown-like formatting)
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    getSessionDuration() {
        if (!this.currentSession) return '0:00';
        
        const start = new Date(this.currentSession.startTime);
        const now = new Date();
        const duration = Math.floor((now - start) / 1000 / 60);
        
        return `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`;
    }

    likeMessage(messageId) {
        // Implementation for message feedback
        utils.showToast('Thank you for your feedback!', 'success');
    }

    dislikeMessage(messageId) {
        // Implementation for message feedback
        utils.showToast('We\'ll work on improving our responses', 'info');
    }

    copyMessage(messageId) {
        const message = this.messages.find(m => m.id === messageId);
        if (message) {
            navigator.clipboard.writeText(message.content);
            utils.showToast('Message copied to clipboard', 'success');
        }
    }

    clearChat() {
        this.messages = [];
        this.updateMessagesDisplay();
        utils.showToast('Chat cleared', 'info');
    }

    loadChatHistory() {
        // Load chat history from localStorage
        const history = localStorage.getItem('chat_history');
        if (history) {
            this.messageHistory = JSON.parse(history);
            this.messages = this.messageHistory.slice(-50); // Show last 50 messages
            this.updateMessagesDisplay();
        }
    }

    saveToHistory(message) {
        this.messageHistory.push(message);
        // Keep only last 200 messages
        if (this.messageHistory.length > 200) {
            this.messageHistory = this.messageHistory.slice(-200);
        }
        localStorage.setItem('chat_history', JSON.stringify(this.messageHistory));
    }

    requestVideoAnalysis() {
        this.sendQuickMessage('I want to analyze a training video. How do I upload it?');
    }

    requestWorkoutPlan() {
        this.sendQuickMessage('Can you create a personalized workout plan for me?');
    }

    showGoalSetting() {
        this.sendQuickMessage('I want to set a new training goal. Can you help me?');
    }

    showSessionSummary(summary) {
        // Show modal with session summary
        const modal = `
            <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Session Complete! 🎉</h3>
                    <div class="space-y-3 mb-6">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Duration:</span>
                            <span class="font-semibold">${summary.duration_minutes} minutes</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Techniques Practiced:</span>
                            <span class="font-semibold">${summary.techniques_practiced.length}</span>
                        </div>
                        ${summary.achievements.length > 0 ? `
                            <div>
                                <span class="text-gray-600">New Achievements:</span>
                                <div class="mt-1">
                                    ${summary.achievements.map(a => `<span class="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mr-1">${a.name}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="w-full btn-primary">
                        Great!
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
    }
}

// Global chat component instance
const chatComponent = new ChatComponent();