// Dashboard Component for Oracle Boxing Coach AI
class DashboardComponent {
    constructor() {
        this.userData = null;
        this.isLoading = true;
        this.stats = {
            totalSessions: 0,
            trainingTime: 0,
            techniquesLearned: 0,
            currentStreak: 0
        };
        this.recentSessions = [];
        this.upcomingGoals = [];
        this.quickActions = [];
    }

    async render() {
        const dashboardHTML = `
            <div class="min-h-screen bg-gray-50">
                <!-- Welcome Hero Section -->
                <div class="hero-boxing text-white">
                    <div class="container mx-auto px-4 py-8">
                        <div class="max-w-4xl">
                            ${this.renderWelcomeSection()}
                        </div>
                    </div>
                </div>

                <!-- Main Dashboard Content -->
                <div class="container mx-auto px-4 py-8 -mt-8 relative z-10">
                    <!-- Stats Overview -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        ${this.renderStatsCards()}
                    </div>

                    <!-- Quick Actions -->
                    <div class="mb-8">
                        <h2 class="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${this.renderQuickActions()}
                        </div>
                    </div>

                    <!-- Main Content Grid -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <!-- Left Column: Recent Activity & Progress -->
                        <div class="lg:col-span-2 space-y-8">
                            <!-- Recent Sessions -->
                            <div class="card p-6">
                                <div class="flex items-center justify-between mb-6">
                                    <h3 class="text-xl font-semibold text-gray-900">Recent Training Sessions</h3>
                                    <a href="#sessions" class="text-red-600 hover:text-red-700 font-medium">View All</a>
                                </div>
                                ${this.renderRecentSessions()}
                            </div>

                            <!-- Progress Chart -->
                            <div class="card p-6">
                                <h3 class="text-xl font-semibold text-gray-900 mb-6">Training Progress</h3>
                                ${this.renderProgressChart()}
                            </div>

                            <!-- Achievement Gallery -->
                            <div class="card p-6">
                                <h3 class="text-xl font-semibold text-gray-900 mb-6">Recent Achievements</h3>
                                ${this.renderAchievements()}
                            </div>
                        </div>

                        <!-- Right Column: Goals & Recommendations -->
                        <div class="space-y-8">
                            <!-- Current Goals -->
                            <div class="card p-6">
                                <h3 class="text-xl font-semibold text-gray-900 mb-6">Current Goals</h3>
                                ${this.renderCurrentGoals()}
                            </div>

                            <!-- AI Recommendations -->
                            <div class="card p-6">
                                <h3 class="text-xl font-semibold text-gray-900 mb-6">AI Recommendations</h3>
                                ${this.renderAIRecommendations()}
                            </div>

                            <!-- Quick Stats -->
                            <div class="card p-6">
                                <h3 class="text-xl font-semibold text-gray-900 mb-6">Weekly Summary</h3>
                                ${this.renderWeeklySummary()}
                            </div>

                            <!-- Motivational Quote -->
                            <div class="card p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                                ${this.renderMotivationalQuote()}
                            </div>
                        </div>
                    </div>

                    <!-- Getting Started Section (for new users) -->
                    ${this.renderGettingStarted()}
                </div>
            </div>
        `;

        document.getElementById('dashboard-page').innerHTML = dashboardHTML;
        await this.loadDashboardData();
        this.attachEventListeners();
    }

    renderWelcomeSection() {
        const userName = this.userData?.name || 'Fighter';
        const timeOfDay = this.getTimeOfDay();
        
        return `
            <div class="flex flex-col md:flex-row items-center justify-between">
                <div class="mb-6 md:mb-0">
                    <h1 class="text-4xl md:text-5xl font-bold mb-2 text-shadow font-rajdhani">
                        ${timeOfDay}, ${userName}! 🥊
                    </h1>
                    <p class="text-xl text-white text-opacity-90 mb-4">
                        Ready to train like a champion today?
                    </p>
                    <div class="flex flex-wrap gap-3">
                        <button 
                            onclick="dashboardComponent.startQuickTraining()" 
                            class="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center"
                        >
                            <i class="fas fa-play mr-2"></i>Start Training
                        </button>
                        <button 
                            onclick="router.navigate('chat')" 
                            class="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors duration-200 flex items-center"
                        >
                            <i class="fas fa-comments mr-2"></i>Ask Coach
                        </button>
                    </div>
                </div>
                
                <!-- Quick Training Timer -->
                <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div class="text-3xl font-bold mb-2" id="training-timer">00:00</div>
                    <div class="text-sm text-white text-opacity-80">Today's Training</div>
                    <div class="text-lg font-semibold mt-2">${this.stats.trainingTime || 0} min total</div>
                </div>
            </div>
        `;
    }

    renderStatsCards() {
        const statsData = [
            {
                title: 'Total Sessions',
                value: this.stats.totalSessions,
                icon: 'fas fa-dumbbell',
                color: 'red',
                change: '+12%',
                changeType: 'positive'
            },
            {
                title: 'Training Time',
                value: `${this.stats.trainingTime}min`,
                icon: 'fas fa-clock',
                color: 'blue',
                change: '+8 min',
                changeType: 'positive'
            },
            {
                title: 'Techniques Learned',
                value: this.stats.techniquesLearned,
                icon: 'fas fa-fist-raised',
                color: 'green',
                change: '+3',
                changeType: 'positive'
            },
            {
                title: 'Current Streak',
                value: `${this.stats.currentStreak} days`,
                icon: 'fas fa-fire',
                color: 'yellow',
                change: this.stats.currentStreak > 0 ? 'Active!' : 'Start today',
                changeType: this.stats.currentStreak > 0 ? 'positive' : 'neutral'
            }
        ];

        return statsData.map(stat => `
            <div class="stat-card">
                <div class="flex items-start justify-between">
                    <div>
                        <p class="text-gray-600 text-sm font-medium">${stat.title}</p>
                        <p class="text-3xl font-bold text-gray-900 mt-1">${stat.value}</p>
                        <div class="flex items-center mt-2">
                            <span class="text-sm font-medium ${
                                stat.changeType === 'positive' ? 'text-green-600' :
                                stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                            }">
                                ${stat.changeType === 'positive' ? '↗' : stat.changeType === 'negative' ? '↘' : '→'} ${stat.change}
                            </span>
                            <span class="text-gray-500 text-sm ml-1">this week</span>
                        </div>
                    </div>
                    <div class="stat-icon bg-${stat.color}-100 text-${stat.color}-600">
                        <i class="${stat.icon}"></i>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderQuickActions() {
        const actions = [
            {
                title: 'Start Training',
                description: 'Begin a new training session',
                icon: 'fas fa-play',
                color: 'red',
                action: 'startQuickTraining()'
            },
            {
                title: 'Technique Library',
                description: 'Browse boxing techniques',
                icon: 'fas fa-book',
                color: 'blue',
                action: 'router.navigate("techniques")'
            },
            {
                title: 'Progress Review',
                description: 'Check your improvements',
                icon: 'fas fa-chart-line',
                color: 'green',
                action: 'router.navigate("progress")'
            },
            {
                title: 'Set New Goal',
                description: 'Define training objectives',
                icon: 'fas fa-target',
                color: 'purple',
                action: 'showGoalModal()'
            },
            {
                title: 'Video Analysis',
                description: 'Upload training video',
                icon: 'fas fa-video',
                color: 'indigo',
                action: 'router.navigate("video-analysis")'
            },
            {
                title: 'Coach Chat',
                description: 'Ask the AI coach anything',
                icon: 'fas fa-comments',
                color: 'yellow',
                action: 'router.navigate("chat")'
            }
        ];

        return actions.map(action => `
            <button 
                onclick="dashboardComponent.${action.action}"
                class="card p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 text-left group"
            >
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-${action.color}-100 text-${action.color}-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <i class="${action.icon} text-lg"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900 group-hover:text-${action.color}-600 transition-colors duration-200">
                            ${action.title}
                        </h4>
                        <p class="text-sm text-gray-600">${action.description}</p>
                    </div>
                </div>
            </button>
        `).join('');
    }

    renderRecentSessions() {
        if (this.recentSessions.length === 0) {
            return `
                <div class="text-center py-8">
                    <i class="fas fa-dumbbell text-gray-300 text-4xl mb-4"></i>
                    <h4 class="text-lg font-semibold text-gray-600 mb-2">No training sessions yet</h4>
                    <p class="text-gray-500 mb-4">Start your first training session to see your progress here</p>
                    <button 
                        onclick="dashboardComponent.startQuickTraining()" 
                        class="btn-primary"
                    >
                        <i class="fas fa-play mr-2"></i>Start First Session
                    </button>
                </div>
            `;
        }

        return this.recentSessions.map(session => `
            <div class="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                        <i class="fas fa-${this.getSessionIcon(session.type)}"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900">${session.type} Training</h4>
                        <p class="text-sm text-gray-600">${session.duration} min • ${session.date}</p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-sm font-semibold text-green-600">${session.score}/10</div>
                    <div class="text-xs text-gray-500">Performance</div>
                </div>
            </div>
        `).join('');
    }

    renderProgressChart() {
        return `
            <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h4 class="font-semibold text-gray-900">Weekly Progress</h4>
                        <p class="text-sm text-gray-600">Training consistency this week</p>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-green-600">85%</div>
                        <div class="text-xs text-gray-500">Completion Rate</div>
                    </div>
                </div>
                
                <!-- Progress Bar -->
                <div class="space-y-3">
                    ${this.renderWeeklyProgressBars()}
                </div>
                
                <!-- Mini Chart Placeholder -->
                <div class="mt-6 h-32 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                    <div class="text-center text-gray-500">
                        <i class="fas fa-chart-area text-2xl mb-2"></i>
                        <p class="text-sm">Progress chart will appear here</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderWeeklyProgressBars() {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const progress = [100, 80, 100, 60, 100, 40, 20]; // Sample data
        
        return days.map((day, index) => `
            <div class="flex items-center space-x-3">
                <div class="w-8 text-xs font-medium text-gray-600">${day}</div>
                <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                        class="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500" 
                        style="width: ${progress[index]}%"
                    ></div>
                </div>
                <div class="w-8 text-xs text-gray-500">${progress[index]}%</div>
            </div>
        `).join('');
    }

    renderAchievements() {
        const achievements = [
            { name: 'First Session', icon: 'fas fa-medal', color: 'yellow', date: '2 days ago' },
            { name: 'Perfect Form', icon: 'fas fa-star', color: 'blue', date: '1 week ago' },
            { name: 'Consistency King', icon: 'fas fa-crown', color: 'purple', date: '2 weeks ago' }
        ];

        if (achievements.length === 0) {
            return `
                <div class="text-center py-6">
                    <i class="fas fa-trophy text-gray-300 text-3xl mb-3"></i>
                    <p class="text-gray-500">Achievements will appear here as you progress</p>
                </div>
            `;
        }

        return `
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                ${achievements.map(achievement => `
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <div class="w-12 h-12 bg-${achievement.color}-100 text-${achievement.color}-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <i class="${achievement.icon}"></i>
                        </div>
                        <h4 class="font-semibold text-gray-900 text-sm">${achievement.name}</h4>
                        <p class="text-xs text-gray-500 mt-1">${achievement.date}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderCurrentGoals() {
        const goals = [
            { 
                name: 'Master the Jab', 
                progress: 75, 
                target: '100 perfect jabs',
                current: '75 jabs',
                dueDate: '5 days left'
            },
            { 
                name: 'Improve Footwork', 
                progress: 45, 
                target: '30 min daily',
                current: '13.5 min avg',
                dueDate: '2 weeks left'
            },
            { 
                name: 'Build Endurance', 
                progress: 60, 
                target: '10 rounds',
                current: '6 rounds',
                dueDate: '1 month left'
            }
        ];

        return goals.map(goal => `
            <div class="mb-6 last:mb-0">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-gray-900">${goal.name}</h4>
                    <span class="text-sm text-gray-500">${goal.progress}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                        class="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500" 
                        style="width: ${goal.progress}%"
                    ></div>
                </div>
                <div class="flex justify-between text-xs text-gray-600">
                    <span>${goal.current} / ${goal.target}</span>
                    <span>${goal.dueDate}</span>
                </div>
            </div>
        `).join('');
    }

    renderAIRecommendations() {
        const recommendations = [
            {
                type: 'technique',
                title: 'Focus on Jab Technique',
                description: 'Your jab accuracy has improved 15%. Practice snap-back timing.',
                priority: 'high',
                icon: 'fas fa-fist-raised'
            },
            {
                type: 'conditioning',
                title: 'Add Cardio Work',
                description: 'Include 2 more rounds of shadowboxing for endurance.',
                priority: 'medium',
                icon: 'fas fa-heart'
            },
            {
                type: 'recovery',
                title: 'Rest Day Recommended',
                description: 'You\'ve trained 5 days straight. Take a recovery day.',
                priority: 'high',
                icon: 'fas fa-bed'
            }
        ];

        return recommendations.map(rec => `
            <div class="mb-4 last:mb-0 p-4 bg-gray-50 rounded-lg">
                <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <i class="${rec.icon} text-sm"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                            <h4 class="font-semibold text-gray-900 text-sm">${rec.title}</h4>
                            <span class="px-2 py-1 text-xs rounded-full ${
                                rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                                rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-green-100 text-green-600'
                            }">
                                ${rec.priority}
                            </span>
                        </div>
                        <p class="text-xs text-gray-600">${rec.description}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderWeeklySummary() {
        return `
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-600">Sessions Completed</span>
                    <span class="text-sm font-semibold text-gray-900">5/7</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-600">Total Training Time</span>
                    <span class="text-sm font-semibold text-gray-900">145 min</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-600">Techniques Practiced</span>
                    <span class="text-sm font-semibold text-gray-900">12</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-600">Average Performance</span>
                    <span class="text-sm font-semibold text-green-600">8.2/10</span>
                </div>
                
                <div class="pt-4 border-t border-gray-200">
                    <div class="text-center">
                        <div class="text-lg font-bold text-green-600">Great Week!</div>
                        <div class="text-xs text-gray-600">Keep up the momentum</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderMotivationalQuote() {
        const quotes = [
            {
                text: "Champions are made from something deep inside them - a desire, a dream, a vision.",
                author: "Muhammad Ali"
            },
            {
                text: "The fight is won or lost far away from witnesses.",
                author: "Muhammad Ali"
            },
            {
                text: "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.'",
                author: "Muhammad Ali"
            }
        ];

        const quote = quotes[Math.floor(Math.random() * quotes.length)];

        return `
            <div class="text-center">
                <i class="fas fa-quote-left text-red-400 text-2xl mb-4"></i>
                <blockquote class="text-gray-800 italic mb-4 leading-relaxed">
                    "${quote.text}"
                </blockquote>
                <cite class="text-sm font-semibold text-red-600">— ${quote.author}</cite>
            </div>
        `;
    }

    renderGettingStarted() {
        if (this.stats.totalSessions > 0) return '';

        return `
            <!-- Getting Started for New Users -->
            <div class="mt-12 card p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-rocket text-2xl"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome to Oracle Boxing AI!</h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">
                        You're about to embark on an incredible boxing journey. Let's get you started with your first training session.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="text-center">
                        <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span class="font-bold">1</span>
                        </div>
                        <h3 class="font-semibold text-gray-900 mb-2">Start Training</h3>
                        <p class="text-sm text-gray-600">Begin with basic techniques and build your foundation</p>
                    </div>
                    <div class="text-center">
                        <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span class="font-bold">2</span>
                        </div>
                        <h3 class="font-semibold text-gray-900 mb-2">Get AI Coaching</h3>
                        <p class="text-sm text-gray-600">Receive personalized feedback and technique corrections</p>
                    </div>
                    <div class="text-center">
                        <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span class="font-bold">3</span>
                        </div>
                        <h3 class="font-semibold text-gray-900 mb-2">Track Progress</h3>
                        <p class="text-sm text-gray-600">Monitor your improvement and celebrate achievements</p>
                    </div>
                </div>

                <div class="text-center">
                    <button 
                        onclick="dashboardComponent.startOnboarding()" 
                        class="btn-primary mr-4"
                    >
                        <i class="fas fa-play mr-2"></i>Start Your Journey
                    </button>
                    <button 
                        onclick="router.navigate('techniques')" 
                        class="btn-outline"
                    >
                        <i class="fas fa-book mr-2"></i>Browse Techniques
                    </button>
                </div>
            </div>
        `;
    }

    async loadDashboardData() {
        try {
            this.isLoading = true;
            
            // Load user data
            this.userData = authManager.getCurrentUser();
            
            // Load stats from API
            if (this.userData) {
                const stats = await apiClient.getUserStats(this.userData.id);
                this.stats = { ...this.stats, ...stats };
                
                // Load recent sessions
                this.recentSessions = await apiClient.getRecentSessions(this.userData.id, 5);
            }
            
            this.isLoading = false;
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.isLoading = false;
        }
    }

    attachEventListeners() {
        // Auto-refresh timer
        this.startTrainingTimer();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 't':
                        e.preventDefault();
                        this.startQuickTraining();
                        break;
                    case 'c':
                        e.preventDefault();
                        router.navigate('chat');
                        break;
                }
            }
        });
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    }

    getSessionIcon(type) {
        const icons = {
            'technique': 'fist-raised',
            'conditioning': 'heart',
            'sparring': 'fire',
            'mixed': 'dumbbell'
        };
        return icons[type] || 'dumbbell';
    }

    startTrainingTimer() {
        const timer = document.getElementById('training-timer');
        if (!timer) return;

        let seconds = 0;
        setInterval(() => {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timer.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            seconds++;
        }, 1000);
    }

    async startQuickTraining() {
        try {
            utils.showLoading();
            
            // Start a training session via API
            const session = await apiClient.startSession({
                type: 'mixed',
                duration: 30
            });
            
            utils.hideLoading();
            utils.showToast('Training session started! 🥊', 'success');
            router.navigate('chat');
            
        } catch (error) {
            utils.hideLoading();
            utils.showToast('Failed to start training session', 'error');
        }
    }

    async startOnboarding() {
        // Show onboarding modal or redirect to guided tutorial
        utils.showToast('Welcome! Let\'s start your boxing journey!', 'success');
        router.navigate('chat');
    }

    showGoalModal() {
        // Implementation for goal setting modal
        utils.showToast('Goal setting feature coming soon!', 'info');
    }

    refresh() {
        this.loadDashboardData().then(() => {
            // Re-render updated sections
            this.render();
        });
    }
}

// Global dashboard component instance
const dashboardComponent = new DashboardComponent();