// Complete Chat Component Implementation for Oracle Boxing Coach AI

// Extending the existing ChatComponent with full functionality
class ChatComponentExtended extends ChatComponent {
    constructor() {
        super();
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.typingTimeout = null;
        this.sessionStartTime = null;
        this.aiResponseTime = 0;
    }

    // Complete the render method with full chat interface
    renderFullChat() {
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
                                    <div class="w-2 h-2 bg-green-500 rounded-full ${this.isConnected ? '' : 'hidden'}" id="connection-indicator"></div>
                                    <div class="w-2 h-2 bg-red-500 rounded-full ${this.isConnected ? 'hidden' : ''}" id="disconnection-indicator"></div>
                                    <span class="text-sm text-gray-600">${this.currentCoach} • ${this.isConnected ? 'Online' : 'Offline'}</span>
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
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="mt-4 flex flex-wrap gap-2">
                        ${this.renderQuickActions()}
                    </div>
                </div>

                <!-- Messages Container -->
                <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" id="messages-container">
                    ${this.renderMessages()}
                    
                    <!-- Typing Indicator -->
                    <div id="typing-indicator" class="chat-message ai hidden">
                        <div class="chat-bubble ai">
                            <div class="flex items-center space-x-1">
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                                <span class="text-sm text-gray-500 ml-2">${this.currentCoach} is typing...</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Message Input -->
                <div class="chat-input-container">
                    <form id="message-form" class="flex items-end space-x-3">
                        <!-- File Upload -->
                        <button 
                            type="button" 
                            onclick="chatComponent.showAttachmentOptions()" 
                            class="text-gray-500 hover:text-red-600 transition-colors duration-200 p-2"
                            title="Attach file"
                        >
                            <i class="fas fa-paperclip text-lg"></i>
                        </button>

                        <!-- Message Input -->
                        <div class="flex-1">
                            <textarea
                                id="message-input"
                                placeholder="Ask your AI coach anything about boxing..."
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                rows="1"
                                maxlength="1000"
                                onkeydown="chatComponent.handleInputKeydown(event)"
                                oninput="chatComponent.handleInputChange()"
                            ></textarea>
                            <div class="flex justify-between items-center mt-1 px-2">
                                <span class="text-xs text-gray-500" id="char-count">0/1000</span>
                                <div class="flex space-x-2 text-xs text-gray-500">
                                    <span>Press Shift+Enter for new line</span>
                                </div>
                            </div>
                        </div>

                        <!-- Send Button -->
                        <button
                            type="submit"
                            id="send-btn"
                            class="btn-primary p-3 ${this.isLoading ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${this.isLoading ? 'disabled' : ''}
                        >
                            ${this.isLoading ? 
                                '<i class="fas fa-spinner fa-spin"></i>' : 
                                '<i class="fas fa-paper-plane"></i>'
                            }
                        </button>
                    </form>

                    <!-- Voice Input -->
                    <div class="mt-2 flex justify-center">
                        <button 
                            id="voice-btn"
                            onclick="chatComponent.toggleVoiceInput()"
                            class="text-gray-500 hover:text-red-600 transition-colors duration-200 p-2"
                            title="Voice input"
                        >
                            <i class="fas fa-microphone text-lg"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Session Stats Sidebar (hidden by default) -->
            <div id="session-sidebar" class="fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform translate-x-full transition-transform duration-300 z-50">
                ${this.renderSessionStats()}
            </div>

            <!-- Overlay for sidebar -->
            <div id="sidebar-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden" onclick="chatComponent.closeSidebar()"></div>
        `;

        document.getElementById('chat-page').innerHTML = chatHTML;
        this.attachEventListeners();
        this.initializeChat();
    }

    renderQuickActions() {
        const quickActions = [
            { text: "Show me basic punches", icon: "fas fa-fist-raised" },
            { text: "Help with footwork", icon: "fas fa-walking" },
            { text: "Create workout plan", icon: "fas fa-dumbbell" },
            { text: "Analyze my form", icon: "fas fa-search" },
            { text: "Safety tips", icon: "fas fa-shield-alt" }
        ];

        return quickActions.map(action => `
            <button 
                onclick="chatComponent.sendQuickMessage('${action.text}')"
                class="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 text-sm rounded-full transition-colors duration-200"
            >
                <i class="${action.icon} mr-1 text-xs"></i>
                ${action.text}
            </button>
        `).join('');
    }

    renderMessages() {
        if (this.messages.length === 0) {
            return this.renderWelcomeMessage();
        }

        return this.messages.map(message => this.renderMessage(message)).join('');
    }

    renderWelcomeMessage() {
        return `
            <div class="text-center py-8">
                <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-fist-raised text-2xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Welcome to Your AI Boxing Coach!</h3>
                <p class="text-gray-600 mb-4 max-w-md mx-auto">
                    I'm here to help you improve your boxing skills. Ask me about techniques, 
                    training plans, or get personalized coaching advice.
                </p>
                <div class="flex flex-wrap justify-center gap-2 mt-6">
                    <button onclick="chatComponent.sendQuickMessage('Tell me about boxing basics')" class="btn-outline text-sm">
                        Boxing Basics
                    </button>
                    <button onclick="chatComponent.sendQuickMessage('Create a beginner workout')" class="btn-outline text-sm">
                        Beginner Workout
                    </button>
                    <button onclick="chatComponent.sendQuickMessage('Show me proper stance')" class="btn-outline text-sm">
                        Proper Stance
                    </button>
                </div>
            </div>
        `;
    }

    renderMessage(message) {
        const isUser = message.sender === 'user';
        const timestamp = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="chat-message ${isUser ? 'user' : 'ai'}">
                <div class="chat-bubble ${isUser ? 'user' : 'ai'}">
                    ${!isUser ? `<div class="text-xs text-gray-500 mb-1">${message.coach || this.currentCoach}</div>` : ''}
                    <div class="message-content">
                        ${this.formatMessageContent(message.content)}
                    </div>
                    <div class="text-xs text-gray-400 mt-2 flex items-center justify-between">
                        <span>${timestamp}</span>
                        ${!isUser && message.responseTime ? `<span class="text-xs">Response: ${message.responseTime}ms</span>` : ''}
                        <div class="message-actions flex space-x-2">
                            <button onclick="chatComponent.copyMessage('${message.id}')" class="hover:text-red-600" title="Copy">
                                <i class="fas fa-copy text-xs"></i>
                            </button>
                            ${!isUser ? `
                                <button onclick="chatComponent.rateMessage('${message.id}', 'up')" class="hover:text-green-600" title="Helpful">
                                    <i class="fas fa-thumbs-up text-xs"></i>
                                </button>
                                <button onclick="chatComponent.rateMessage('${message.id}', 'down')" class="hover:text-red-600" title="Not helpful">
                                    <i class="fas fa-thumbs-down text-xs"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    formatMessageContent(content) {
        // Format markdown-like content
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```(.*?)```/gs, '<pre class="bg-gray-100 p-2 rounded mt-2 text-sm"><code>$1</code></pre>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
            .replace(/\n/g, '<br>');
    }

    renderSessionStats() {
        return `
            <div class="h-full flex flex-col">
                <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Session Stats</h3>
                    <button onclick="chatComponent.closeSidebar()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="flex-1 p-4 overflow-y-auto">
                    <div class="space-y-4">
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">Current Session</h4>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span>Duration:</span>
                                    <span id="session-duration">00:00</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Messages:</span>
                                    <span>${this.messages.length}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Coach:</span>
                                    <span>${this.currentCoach}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">Performance</h4>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span>Avg Response:</span>
                                    <span>${this.aiResponseTime}ms</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Connection:</span>
                                    <span class="text-green-600">${this.isConnected ? 'Stable' : 'Reconnecting'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Session Actions -->
                        <div class="space-y-2">
                            <button onclick="chatComponent.exportSession()" class="w-full btn-outline text-sm">
                                <i class="fas fa-download mr-2"></i>Export Session
                            </button>
                            <button onclick="chatComponent.shareSession()" class="w-full btn-outline text-sm">
                                <i class="fas fa-share mr-2"></i>Share Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Enhanced event handlers and functionality
    attachEventListeners() {
        const messageForm = document.getElementById('message-form');
        const messageInput = document.getElementById('message-input');

        if (messageForm) {
            messageForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        if (messageInput) {
            messageInput.addEventListener('input', () => this.adjustTextareaHeight());
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        
        if (!message || this.isLoading) return;
        
        await this.sendMessage(message);
        messageInput.value = '';
        this.adjustTextareaHeight();
    }

    async sendMessage(message) {
        if (!message.trim() || this.isLoading) return;

        this.setLoading(true);
        
        // Add user message
        const userMessage = {
            id: utils.generateId('msg'),
            content: message,
            sender: 'user',
            timestamp: new Date().toISOString()
        };
        
        this.addMessage(userMessage);
        this.showTypingIndicator();

        try {
            const startTime = Date.now();
            const response = await apiClient.sendMessage(message, this.currentSession?.id, this.currentCoach);
            const responseTime = Date.now() - startTime;

            // Add AI response
            const aiMessage = {
                id: utils.generateId('msg'),
                content: response.message || response.content,
                sender: 'ai',
                coach: this.currentCoach,
                timestamp: new Date().toISOString(),
                responseTime
            };

            this.addMessage(aiMessage);
            this.aiResponseTime = Math.round((this.aiResponseTime + responseTime) / 2);

        } catch (error) {
            console.error('Failed to send message:', error);
            
            const errorMessage = {
                id: utils.generateId('msg'),
                content: "I'm sorry, I'm having trouble responding right now. Please try again.",
                sender: 'ai',
                coach: this.currentCoach,
                timestamp: new Date().toISOString(),
                isError: true
            };
            
            this.addMessage(errorMessage);
            utils.showToast('Failed to send message', 'error');
        } finally {
            this.hideTypingIndicator();
            this.setLoading(false);
        }
    }

    addMessage(message) {
        this.messages.push(message);
        this.renderNewMessage(message);
        this.scrollToBottom();
        this.updateSessionStats();
    }

    renderNewMessage(message) {
        const messagesContainer = document.getElementById('messages-container');
        const messageHTML = this.renderMessage(message);
        
        // Remove welcome message if it exists
        const welcomeMessage = messagesContainer.querySelector('.text-center.py-8');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    }

    scrollToBottom() {
        const container = document.getElementById('messages-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.classList.remove('hidden');
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
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

    adjustTextareaHeight() {
        const textarea = document.getElementById('message-input');
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }
    }

    // Additional methods for enhanced functionality
    async changeCoach(newCoach) {
        this.currentCoach = newCoach;
        
        // Add system message about coach change
        const systemMessage = {
            id: utils.generateId('msg'),
            content: `Switched to ${newCoach}. How can I help you with your boxing training?`,
            sender: 'ai',
            coach: newCoach,
            timestamp: new Date().toISOString(),
            isSystem: true
        };
        
        this.addMessage(systemMessage);
    }

    sendQuickMessage(message) {
        const messageInput = document.getElementById('message-input');
        if (messageInput) {
            messageInput.value = message;
            this.sendMessage(message);
        }
    }

    handleInputKeydown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.handleSubmit(event);
        }
    }

    handleInputChange() {
        const input = document.getElementById('message-input');
        const charCount = document.getElementById('char-count');
        
        if (input && charCount) {
            charCount.textContent = `${input.value.length}/1000`;
        }
        
        this.adjustTextareaHeight();
    }

    async clearSession() {
        if (confirm('Are you sure you want to clear this chat session?')) {
            this.messages = [];
            this.currentSession = null;
            document.getElementById('messages-container').innerHTML = this.renderWelcomeMessage();
            utils.showToast('Chat cleared', 'info');
        }
    }

    updateSessionStats() {
        const durationElement = document.getElementById('session-duration');
        if (durationElement && this.sessionStartTime) {
            const duration = Date.now() - this.sessionStartTime;
            durationElement.textContent = utils.formatTime(Math.floor(duration / 1000));
        }
    }

    async initializeChat() {
        this.isConnected = true;
        this.sessionStartTime = Date.now();
        
        // Load chat history if available
        try {
            const history = await apiClient.getChatHistory();
            if (history && history.messages) {
                this.messages = history.messages;
                this.renderMessages();
            }
        } catch (error) {
            console.warn('Failed to load chat history:', error);
        }
    }
}

// Replace the existing chat component with the extended version
const chatComponent = new ChatComponentExtended();