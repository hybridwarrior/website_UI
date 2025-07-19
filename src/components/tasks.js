// Tasks Component for Oracle Boxing Coach AI
class TasksComponent {
    constructor() {
        this.tasks = [];
        this.isLoading = false;
        this.filters = {
            status: 'all',
            priority: 'all',
            category: 'all'
        };
        this.sortBy = 'priority'; // priority, dueDate, created
        this.viewMode = 'list'; // list, kanban
        this.selectedTasks = new Set();
    }

    async render() {
        const tasksHTML = `
            <div class="min-h-screen bg-gray-50">
                <!-- Tasks Header -->
                <div class="bg-white border-b border-gray-200">
                    <div class="container mx-auto px-4 py-6">
                        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div class="mb-4 lg:mb-0">
                                <h1 class="text-3xl font-bold text-gray-900 font-rajdhani">Training Tasks</h1>
                                <p class="text-gray-600 mt-1">Track your boxing training progress and goals</p>
                            </div>
                            
                            <!-- Action Buttons -->
                            <div class="flex flex-wrap gap-3">
                                <button 
                                    onclick="tasksComponent.showCreateTaskModal()" 
                                    class="btn-primary"
                                >
                                    <i class="fas fa-plus mr-2"></i>New Task
                                </button>
                                <button 
                                    onclick="tasksComponent.toggleViewMode()" 
                                    class="btn-outline"
                                >
                                    <i class="fas fa-${this.viewMode === 'list' ? 'th-large' : 'list'} mr-2"></i>
                                    ${this.viewMode === 'list' ? 'Board View' : 'List View'}
                                </button>
                                <button 
                                    onclick="tasksComponent.refreshTasks()" 
                                    class="btn-outline"
                                >
                                    <i class="fas fa-sync-alt mr-2"></i>Refresh
                                </button>
                            </div>
                        </div>

                        <!-- Task Filters and Stats -->
                        <div class="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <!-- Quick Stats -->
                            <div class="flex flex-wrap gap-4 mb-4 lg:mb-0">
                                ${this.renderQuickStats()}
                            </div>

                            <!-- Filters -->
                            <div class="flex flex-wrap gap-3">
                                ${this.renderFilters()}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tasks Content -->
                <div class="container mx-auto px-4 py-8">
                    <!-- Bulk Actions (if tasks selected) -->
                    ${this.selectedTasks.size > 0 ? this.renderBulkActions() : ''}

                    <!-- Tasks Display -->
                    <div id="tasks-container">
                        ${this.viewMode === 'list' ? this.renderListView() : this.renderKanbanView()}
                    </div>

                    <!-- Empty State -->
                    ${this.tasks.length === 0 ? this.renderEmptyState() : ''}
                </div>

                <!-- Task Creation/Edit Modal -->
                ${this.renderTaskModal()}
            </div>
        `;

        document.getElementById('tasks-page').innerHTML = tasksHTML;
        await this.loadTasks();
        this.attachEventListeners();
    }

    renderQuickStats() {
        const stats = this.calculateStats();
        
        return `
            <div class="stat-badge text-blue-600 bg-blue-100">
                <i class="fas fa-tasks mr-1"></i>
                <span class="font-semibold">${stats.total}</span> Total
            </div>
            <div class="stat-badge text-green-600 bg-green-100">
                <i class="fas fa-check-circle mr-1"></i>
                <span class="font-semibold">${stats.completed}</span> Done
            </div>
            <div class="stat-badge text-yellow-600 bg-yellow-100">
                <i class="fas fa-clock mr-1"></i>
                <span class="font-semibold">${stats.pending}</span> Pending
            </div>
            <div class="stat-badge text-red-600 bg-red-100">
                <i class="fas fa-exclamation-triangle mr-1"></i>
                <span class="font-semibold">${stats.overdue}</span> Overdue
            </div>
        `;
    }

    renderFilters() {
        return `
            <select 
                id="status-filter" 
                class="filter-select"
                onchange="tasksComponent.updateFilter('status', this.value)"
            >
                <option value="all">All Status</option>
                <option value="pending" ${this.filters.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="in_progress" ${this.filters.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                <option value="completed" ${this.filters.status === 'completed' ? 'selected' : ''}>Completed</option>
                <option value="blocked" ${this.filters.status === 'blocked' ? 'selected' : ''}>Blocked</option>
            </select>

            <select 
                id="priority-filter" 
                class="filter-select"
                onchange="tasksComponent.updateFilter('priority', this.value)"
            >
                <option value="all">All Priority</option>
                <option value="high" ${this.filters.priority === 'high' ? 'selected' : ''}>High</option>
                <option value="medium" ${this.filters.priority === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="low" ${this.filters.priority === 'low' ? 'selected' : ''}>Low</option>
            </select>

            <select 
                id="category-filter" 
                class="filter-select"
                onchange="tasksComponent.updateFilter('category', this.value)"
            >
                <option value="all">All Categories</option>
                <option value="technique" ${this.filters.category === 'technique' ? 'selected' : ''}>Technique</option>
                <option value="conditioning" ${this.filters.category === 'conditioning' ? 'selected' : ''}>Conditioning</option>
                <option value="sparring" ${this.filters.category === 'sparring' ? 'selected' : ''}>Sparring</option>
                <option value="mental" ${this.filters.category === 'mental' ? 'selected' : ''}>Mental Training</option>
                <option value="recovery" ${this.filters.category === 'recovery' ? 'selected' : ''}>Recovery</option>
            </select>

            <select 
                id="sort-filter" 
                class="filter-select"
                onchange="tasksComponent.updateSort(this.value)"
            >
                <option value="priority" ${this.sortBy === 'priority' ? 'selected' : ''}>Sort by Priority</option>
                <option value="dueDate" ${this.sortBy === 'dueDate' ? 'selected' : ''}>Sort by Due Date</option>
                <option value="created" ${this.sortBy === 'created' ? 'selected' : ''}>Sort by Created</option>
                <option value="category" ${this.sortBy === 'category' ? 'selected' : ''}>Sort by Category</option>
            </select>
        `;
    }

    renderBulkActions() {
        return `
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <span class="text-blue-800 font-medium">
                            ${this.selectedTasks.size} task${this.selectedTasks.size !== 1 ? 's' : ''} selected
                        </span>
                        <button 
                            onclick="tasksComponent.clearSelection()" 
                            class="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Clear selection
                        </button>
                    </div>
                    <div class="flex space-x-2">
                        <button 
                            onclick="tasksComponent.bulkUpdateStatus('completed')" 
                            class="btn-sm bg-green-600 hover:bg-green-700 text-white"
                        >
                            Mark Complete
                        </button>
                        <button 
                            onclick="tasksComponent.bulkUpdatePriority('high')" 
                            class="btn-sm bg-red-600 hover:bg-red-700 text-white"
                        >
                            High Priority
                        </button>
                        <button 
                            onclick="tasksComponent.bulkDelete()" 
                            class="btn-sm bg-gray-600 hover:bg-gray-700 text-white"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderListView() {
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            return `
                <div class="text-center py-12">
                    <i class="fas fa-filter text-gray-300 text-4xl mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-600 mb-2">No tasks match your filters</h3>
                    <p class="text-gray-500">Try adjusting your filter criteria or create a new task</p>
                </div>
            `;
        }

        return `
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <!-- Table Header -->
                <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <div class="flex items-center">
                        <div class="flex items-center mr-4">
                            <input 
                                type="checkbox" 
                                id="select-all"
                                class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                                onchange="tasksComponent.toggleSelectAll(this.checked)"
                            >
                        </div>
                        <div class="grid grid-cols-12 gap-4 w-full text-sm font-medium text-gray-700">
                            <div class="col-span-4">Task</div>
                            <div class="col-span-2">Category</div>
                            <div class="col-span-2">Priority</div>
                            <div class="col-span-2">Due Date</div>
                            <div class="col-span-1">Status</div>
                            <div class="col-span-1">Actions</div>
                        </div>
                    </div>
                </div>

                <!-- Task Rows -->
                <div class="divide-y divide-gray-200">
                    ${filteredTasks.map(task => this.renderTaskRow(task)).join('')}
                </div>
            </div>
        `;
    }

    renderTaskRow(task) {
        const isSelected = this.selectedTasks.has(task.id);
        const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
        
        return `
            <div class="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 ${isSelected ? 'bg-blue-50' : ''}">
                <div class="flex items-center">
                    <div class="flex items-center mr-4">
                        <input 
                            type="checkbox" 
                            class="task-checkbox w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                            data-task-id="${task.id}"
                            ${isSelected ? 'checked' : ''}
                            onchange="tasksComponent.toggleTaskSelection('${task.id}', this.checked)"
                        >
                    </div>
                    <div class="grid grid-cols-12 gap-4 w-full items-center">
                        <!-- Task Title & Description -->
                        <div class="col-span-4">
                            <div class="flex items-start space-x-3">
                                <div class="w-8 h-8 bg-${this.getCategoryColor(task.category)}-100 text-${this.getCategoryColor(task.category)}-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <i class="${this.getCategoryIcon(task.category)} text-sm"></i>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-gray-900 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}">${task.title}</h4>
                                    <p class="text-sm text-gray-600 mt-1">${task.description}</p>
                                    ${task.subtasks && task.subtasks.length > 0 ? `
                                        <div class="text-xs text-gray-500 mt-1">
                                            ${task.subtasks.filter(st => st.completed).length}/${task.subtasks.length} subtasks completed
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>

                        <!-- Category -->
                        <div class="col-span-2">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${this.getCategoryColor(task.category)}-100 text-${this.getCategoryColor(task.category)}-800">
                                ${task.category}
                            </span>
                        </div>

                        <!-- Priority -->
                        <div class="col-span-2">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${this.getPriorityStyle(task.priority)}">
                                <i class="fas fa-${this.getPriorityIcon(task.priority)} mr-1"></i>
                                ${task.priority}
                            </span>
                        </div>

                        <!-- Due Date -->
                        <div class="col-span-2">
                            <div class="text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}">
                                ${task.dueDate ? this.formatDate(task.dueDate) : 'No due date'}
                                ${isOverdue ? '<i class="fas fa-exclamation-triangle ml-1"></i>' : ''}
                            </div>
                        </div>

                        <!-- Status -->
                        <div class="col-span-1">
                            <button 
                                onclick="tasksComponent.toggleTaskStatus('${task.id}')"
                                class="status-badge ${this.getStatusStyle(task.status)}"
                                title="Click to change status"
                            >
                                <i class="fas fa-${this.getStatusIcon(task.status)} mr-1"></i>
                                ${this.getStatusLabel(task.status)}
                            </button>
                        </div>

                        <!-- Actions -->
                        <div class="col-span-1">
                            <div class="flex items-center space-x-2">
                                <button 
                                    onclick="tasksComponent.editTask('${task.id}')"
                                    class="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                                    title="Edit task"
                                >
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button 
                                    onclick="tasksComponent.deleteTask('${task.id}')"
                                    class="text-gray-400 hover:text-red-600 transition-colors duration-200"
                                    title="Delete task"
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderKanbanView() {
        const statusColumns = [
            { key: 'pending', title: 'To Do', icon: 'fas fa-circle', color: 'gray' },
            { key: 'in_progress', title: 'In Progress', icon: 'fas fa-play-circle', color: 'blue' },
            { key: 'completed', title: 'Completed', icon: 'fas fa-check-circle', color: 'green' },
            { key: 'blocked', title: 'Blocked', icon: 'fas fa-pause-circle', color: 'red' }
        ];

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${statusColumns.map(column => this.renderKanbanColumn(column)).join('')}
            </div>
        `;
    }

    renderKanbanColumn(column) {
        const tasks = this.getFilteredTasks().filter(task => task.status === column.key);
        
        return `
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <!-- Column Header -->
                <div class="bg-${column.color}-50 px-4 py-3 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <i class="${column.icon} text-${column.color}-600"></i>
                            <h3 class="font-semibold text-gray-900">${column.title}</h3>
                            <span class="bg-${column.color}-100 text-${column.color}-800 text-xs font-medium px-2 py-1 rounded-full">
                                ${tasks.length}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Tasks in Column -->
                <div class="p-4 space-y-3 min-h-[400px]" data-status="${column.key}">
                    ${tasks.map(task => this.renderKanbanCard(task)).join('')}
                    ${tasks.length === 0 ? `
                        <div class="text-center py-8 text-gray-400">
                            <i class="fas fa-plus-circle text-2xl mb-2"></i>
                            <p class="text-sm">No ${column.title.toLowerCase()} tasks</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderKanbanCard(task) {
        const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
        
        return `
            <div 
                class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                draggable="true"
                data-task-id="${task.id}"
                onclick="tasksComponent.editTask('${task.id}')"
            >
                <!-- Task Header -->
                <div class="flex items-start justify-between mb-3">
                    <h4 class="font-semibold text-gray-900 text-sm leading-tight ${task.status === 'completed' ? 'line-through text-gray-500' : ''}">${task.title}</h4>
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${this.getPriorityStyle(task.priority)} ml-2 flex-shrink-0">
                        ${task.priority}
                    </span>
                </div>

                <!-- Task Description -->
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${task.description}</p>

                <!-- Task Metadata -->
                <div class="flex items-center justify-between text-xs text-gray-500">
                    <div class="flex items-center space-x-2">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-${this.getCategoryColor(task.category)}-100 text-${this.getCategoryColor(task.category)}-800">
                            <i class="${this.getCategoryIcon(task.category)} mr-1"></i>
                            ${task.category}
                        </span>
                    </div>
                    
                    ${task.dueDate ? `
                        <div class="flex items-center ${isOverdue ? 'text-red-600' : 'text-gray-500'}">
                            <i class="fas fa-calendar mr-1"></i>
                            ${this.formatDate(task.dueDate)}
                        </div>
                    ` : ''}
                </div>

                <!-- Subtasks Progress -->
                ${task.subtasks && task.subtasks.length > 0 ? `
                    <div class="mt-3 pt-3 border-t border-gray-100">
                        <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Subtasks</span>
                            <span>${task.subtasks.filter(st => st.completed).length}/${task.subtasks.length}</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                                class="bg-green-600 h-1.5 rounded-full transition-all duration-300" 
                                style="width: ${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%"
                            ></div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="text-center py-16">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-tasks text-gray-400 text-3xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No training tasks yet</h3>
                <p class="text-gray-600 max-w-md mx-auto mb-8">
                    Create your first training task to start organizing your boxing journey. 
                    Set goals, track techniques, and monitor your progress.
                </p>
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                        onclick="tasksComponent.showCreateTaskModal()" 
                        class="btn-primary"
                    >
                        <i class="fas fa-plus mr-2"></i>Create Your First Task
                    </button>
                    <button 
                        onclick="tasksComponent.loadSampleTasks()" 
                        class="btn-outline"
                    >
                        <i class="fas fa-lightbulb mr-2"></i>Load Sample Tasks
                    </button>
                </div>
            </div>
        `;
    }

    renderTaskModal() {
        return `
            <div id="task-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <!-- Modal Header -->
                    <div class="flex items-center justify-between p-6 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900" id="modal-title">Create New Task</h3>
                        <button 
                            onclick="tasksComponent.hideTaskModal()" 
                            class="text-gray-400 hover:text-gray-600"
                        >
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <form id="task-form" class="p-6 space-y-6">
                        <input type="hidden" id="task-id" name="id">
                        
                        <!-- Task Title -->
                        <div>
                            <label for="task-title" class="form-label">Task Title</label>
                            <input
                                type="text"
                                id="task-title"
                                name="title"
                                class="form-input"
                                placeholder="Enter task title..."
                                required
                            >
                        </div>

                        <!-- Task Description -->
                        <div>
                            <label for="task-description" class="form-label">Description</label>
                            <textarea
                                id="task-description"
                                name="description"
                                class="form-input h-24 resize-none"
                                placeholder="Describe what needs to be accomplished..."
                            ></textarea>
                        </div>

                        <!-- Category & Priority -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="task-category" class="form-label">Category</label>
                                <select id="task-category" name="category" class="form-input" required>
                                    <option value="">Select category</option>
                                    <option value="technique">Technique Training</option>
                                    <option value="conditioning">Conditioning</option>
                                    <option value="sparring">Sparring Practice</option>
                                    <option value="mental">Mental Training</option>
                                    <option value="recovery">Recovery & Rest</option>
                                </select>
                            </div>
                            <div>
                                <label for="task-priority" class="form-label">Priority</label>
                                <select id="task-priority" name="priority" class="form-input" required>
                                    <option value="">Select priority</option>
                                    <option value="high">High Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="low">Low Priority</option>
                                </select>
                            </div>
                        </div>

                        <!-- Due Date & Status -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="task-due-date" class="form-label">Due Date</label>
                                <input
                                    type="date"
                                    id="task-due-date"
                                    name="dueDate"
                                    class="form-input"
                                >
                            </div>
                            <div>
                                <label for="task-status" class="form-label">Status</label>
                                <select id="task-status" name="status" class="form-input">
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="blocked">Blocked</option>
                                </select>
                            </div>
                        </div>

                        <!-- Subtasks -->
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <label class="form-label">Subtasks</label>
                                <button 
                                    type="button" 
                                    onclick="tasksComponent.addSubtask()" 
                                    class="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    <i class="fas fa-plus mr-1"></i>Add Subtask
                                </button>
                            </div>
                            <div id="subtasks-container" class="space-y-2">
                                <!-- Subtasks will be added here -->
                            </div>
                        </div>

                        <!-- Notes -->
                        <div>
                            <label for="task-notes" class="form-label">Notes</label>
                            <textarea
                                id="task-notes"
                                name="notes"
                                class="form-input h-20 resize-none"
                                placeholder="Additional notes or instructions..."
                            ></textarea>
                        </div>
                    </form>

                    <!-- Modal Footer -->
                    <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                        <button 
                            onclick="tasksComponent.hideTaskModal()" 
                            class="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button 
                            onclick="tasksComponent.saveTask()" 
                            class="btn-primary"
                            id="save-task-btn"
                        >
                            <i class="fas fa-save mr-2"></i>Save Task
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async loadTasks() {
        try {
            this.isLoading = true;
            
            // Load tasks from API or localStorage
            const savedTasks = localStorage.getItem('boxing_tasks');
            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
            } else {
                // Load sample data if no saved tasks
                this.tasks = this.getSampleTasks();
            }
            
            this.isLoading = false;
            this.updateDisplay();
            
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.isLoading = false;
            utils.showToast('Failed to load tasks', 'error');
        }
    }

    getSampleTasks() {
        return [
            {
                id: 'task_1',
                title: 'Master the Basic Jab',
                description: 'Practice proper jab technique focusing on form, speed, and accuracy',
                category: 'technique',
                priority: 'high',
                status: 'in_progress',
                dueDate: '2025-07-25',
                created: new Date().toISOString(),
                subtasks: [
                    { id: 'sub_1', title: 'Practice stance and guard position', completed: true },
                    { id: 'sub_2', title: 'Work on straight punch mechanics', completed: true },
                    { id: 'sub_3', title: 'Focus on quick retraction', completed: false },
                    { id: 'sub_4', title: 'Practice on heavy bag (100 jabs)', completed: false }
                ],
                notes: 'Focus on keeping the shoulder relaxed and snapping the punch back quickly'
            },
            {
                id: 'task_2',
                title: 'Improve Cardiovascular Endurance',
                description: 'Build stamina for longer training sessions and better performance',
                category: 'conditioning',
                priority: 'medium',
                status: 'pending',
                dueDate: '2025-08-01',
                created: new Date().toISOString(),
                subtasks: [
                    { id: 'sub_5', title: '3 rounds shadowboxing', completed: false },
                    { id: 'sub_6', title: '10 minutes jump rope', completed: false },
                    { id: 'sub_7', title: '5 rounds heavy bag work', completed: false }
                ],
                notes: 'Gradually increase intensity and duration over time'
            },
            {
                id: 'task_3',
                title: 'Learn Defensive Head Movement',
                description: 'Practice slipping, ducking, and weaving to avoid punches',
                category: 'technique',
                priority: 'high',
                status: 'pending',
                dueDate: '2025-07-30',
                created: new Date().toISOString(),
                subtasks: [
                    { id: 'sub_8', title: 'Practice slip left and right', completed: false },
                    { id: 'sub_9', title: 'Work on ducking under hooks', completed: false },
                    { id: 'sub_10', title: 'Combine with counter punches', completed: false }
                ],
                notes: 'Start slow and focus on proper mechanics before adding speed'
            }
        ];
    }

    attachEventListeners() {
        // Modal event listeners will be attached when modal is shown
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'n':
                        e.preventDefault();
                        this.showCreateTaskModal();
                        break;
                    case 'f':
                        e.preventDefault();
                        document.getElementById('status-filter').focus();
                        break;
                }
            }
        });
    }

    // Task management methods
    showCreateTaskModal() {
        document.getElementById('modal-title').textContent = 'Create New Task';
        document.getElementById('task-form').reset();
        document.getElementById('task-id').value = '';
        document.getElementById('subtasks-container').innerHTML = '';
        document.getElementById('task-modal').classList.remove('hidden');
    }

    hideTaskModal() {
        document.getElementById('task-modal').classList.add('hidden');
    }

    async saveTask() {
        const form = document.getElementById('task-form');
        const formData = new FormData(form);
        const taskId = formData.get('id');
        
        const taskData = {
            id: taskId || 'task_' + Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            priority: formData.get('priority'),
            status: formData.get('status') || 'pending',
            dueDate: formData.get('dueDate'),
            notes: formData.get('notes'),
            created: taskId ? this.tasks.find(t => t.id === taskId)?.created : new Date().toISOString(),
            updated: new Date().toISOString(),
            subtasks: this.collectSubtasks()
        };

        if (taskId) {
            // Update existing task
            const index = this.tasks.findIndex(t => t.id === taskId);
            this.tasks[index] = { ...this.tasks[index], ...taskData };
            utils.showToast('Task updated successfully', 'success');
        } else {
            // Create new task
            this.tasks.unshift(taskData);
            utils.showToast('Task created successfully', 'success');
        }

        this.saveTasks();
        this.updateDisplay();
        this.hideTaskModal();
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        document.getElementById('modal-title').textContent = 'Edit Task';
        document.getElementById('task-id').value = task.id;
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description || '';
        document.getElementById('task-category').value = task.category;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-status').value = task.status;
        document.getElementById('task-due-date').value = task.dueDate || '';
        document.getElementById('task-notes').value = task.notes || '';

        // Load subtasks
        const container = document.getElementById('subtasks-container');
        container.innerHTML = '';
        if (task.subtasks) {
            task.subtasks.forEach(subtask => {
                this.addSubtask(subtask);
            });
        }

        document.getElementById('task-modal').classList.remove('hidden');
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.updateDisplay();
            utils.showToast('Task deleted successfully', 'success');
        }
    }

    toggleTaskStatus(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const statusOrder = ['pending', 'in_progress', 'completed', 'blocked'];
        const currentIndex = statusOrder.indexOf(task.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        
        task.status = statusOrder[nextIndex];
        task.updated = new Date().toISOString();
        
        this.saveTasks();
        this.updateDisplay();
        utils.showToast(`Task marked as ${task.status.replace('_', ' ')}`, 'success');
    }

    addSubtask(existingSubtask = null) {
        const container = document.getElementById('subtasks-container');
        const subtaskId = existingSubtask?.id || 'sub_' + Date.now();
        
        const subtaskHTML = `
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg subtask-item" data-subtask-id="${subtaskId}">
                <input 
                    type="checkbox" 
                    class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                    ${existingSubtask?.completed ? 'checked' : ''}
                >
                <input 
                    type="text" 
                    class="flex-1 bg-transparent border-none focus:ring-0 text-sm"
                    placeholder="Enter subtask..."
                    value="${existingSubtask?.title || ''}"
                >
                <button 
                    type="button" 
                    onclick="this.closest('.subtask-item').remove()" 
                    class="text-gray-400 hover:text-red-600"
                >
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', subtaskHTML);
    }

    collectSubtasks() {
        const subtaskItems = document.querySelectorAll('.subtask-item');
        return Array.from(subtaskItems).map(item => ({
            id: item.dataset.subtaskId,
            title: item.querySelector('input[type="text"]').value,
            completed: item.querySelector('input[type="checkbox"]').checked
        })).filter(subtask => subtask.title.trim());
    }

    // Filter and sort methods
    updateFilter(filterType, value) {
        this.filters[filterType] = value;
        this.updateDisplay();
    }

    updateSort(sortBy) {
        this.sortBy = sortBy;
        this.updateDisplay();
    }

    getFilteredTasks() {
        let filtered = [...this.tasks];

        // Apply filters
        if (this.filters.status !== 'all') {
            filtered = filtered.filter(task => task.status === this.filters.status);
        }
        if (this.filters.priority !== 'all') {
            filtered = filtered.filter(task => task.priority === this.filters.priority);
        }
        if (this.filters.category !== 'all') {
            filtered = filtered.filter(task => task.category === this.filters.category);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'created':
                    return new Date(b.created) - new Date(a.created);
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });

        return filtered;
    }

    // View mode methods
    toggleViewMode() {
        this.viewMode = this.viewMode === 'list' ? 'kanban' : 'list';
        this.updateDisplay();
    }

    // Selection methods
    toggleTaskSelection(taskId, selected) {
        if (selected) {
            this.selectedTasks.add(taskId);
        } else {
            this.selectedTasks.delete(taskId);
        }
        this.updateDisplay();
    }

    toggleSelectAll(selectAll) {
        const visibleTasks = this.getFilteredTasks();
        if (selectAll) {
            visibleTasks.forEach(task => this.selectedTasks.add(task.id));
        } else {
            this.selectedTasks.clear();
        }
        this.updateDisplay();
    }

    clearSelection() {
        this.selectedTasks.clear();
        this.updateDisplay();
    }

    // Bulk operations
    bulkUpdateStatus(newStatus) {
        let updatedCount = 0;
        this.selectedTasks.forEach(taskId => {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                task.status = newStatus;
                task.updated = new Date().toISOString();
                updatedCount++;
            }
        });
        
        this.saveTasks();
        this.clearSelection();
        this.updateDisplay();
        utils.showToast(`${updatedCount} tasks updated`, 'success');
    }

    bulkUpdatePriority(newPriority) {
        let updatedCount = 0;
        this.selectedTasks.forEach(taskId => {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                task.priority = newPriority;
                task.updated = new Date().toISOString();
                updatedCount++;
            }
        });
        
        this.saveTasks();
        this.clearSelection();
        this.updateDisplay();
        utils.showToast(`${updatedCount} tasks updated`, 'success');
    }

    bulkDelete() {
        if (confirm(`Are you sure you want to delete ${this.selectedTasks.size} tasks?`)) {
            const deletedCount = this.selectedTasks.size;
            this.tasks = this.tasks.filter(task => !this.selectedTasks.has(task.id));
            this.clearSelection();
            this.saveTasks();
            this.updateDisplay();
            utils.showToast(`${deletedCount} tasks deleted`, 'success');
        }
    }

    // Utility methods
    calculateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.status === 'completed').length;
        const pending = this.tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
        const overdue = this.tasks.filter(t => 
            t.dueDate && 
            new Date(t.dueDate) < new Date() && 
            t.status !== 'completed'
        ).length;

        return { total, completed, pending, overdue };
    }

    updateDisplay() {
        const container = document.getElementById('tasks-container');
        if (container) {
            container.innerHTML = this.viewMode === 'list' ? this.renderListView() : this.renderKanbanView();
        }

        // Update stats
        const statsContainer = container?.closest('.container')?.querySelector('.flex.flex-wrap.gap-4');
        if (statsContainer) {
            statsContainer.innerHTML = this.renderQuickStats();
        }

        // Update bulk actions
        const bulkContainer = container?.previousElementSibling;
        if (bulkContainer?.classList.contains('bg-blue-50')) {
            if (this.selectedTasks.size === 0) {
                bulkContainer.remove();
            } else {
                bulkContainer.innerHTML = this.renderBulkActions().replace(/.*?<div class="bg-blue-50.*?>(.*?)<\/div>.*/s, '$1');
            }
        } else if (this.selectedTasks.size > 0) {
            container.insertAdjacentHTML('beforebegin', this.renderBulkActions());
        }
    }

    saveTasks() {
        localStorage.setItem('boxing_tasks', JSON.stringify(this.tasks));
    }

    loadSampleTasks() {
        this.tasks = this.getSampleTasks();
        this.saveTasks();
        this.updateDisplay();
        utils.showToast('Sample tasks loaded successfully', 'success');
    }

    refreshTasks() {
        this.loadTasks();
        utils.showToast('Tasks refreshed', 'success');
    }

    // Helper methods for styling
    getCategoryColor(category) {
        const colors = {
            technique: 'blue',
            conditioning: 'green',
            sparring: 'red',
            mental: 'purple',
            recovery: 'yellow'
        };
        return colors[category] || 'gray';
    }

    getCategoryIcon(category) {
        const icons = {
            technique: 'fas fa-fist-raised',
            conditioning: 'fas fa-heart',
            sparring: 'fas fa-fire',
            mental: 'fas fa-brain',
            recovery: 'fas fa-bed'
        };
        return icons[category] || 'fas fa-tasks';
    }

    getPriorityStyle(priority) {
        const styles = {
            high: 'bg-red-100 text-red-800',
            medium: 'bg-yellow-100 text-yellow-800',
            low: 'bg-green-100 text-green-800'
        };
        return styles[priority] || 'bg-gray-100 text-gray-800';
    }

    getPriorityIcon(priority) {
        const icons = {
            high: 'exclamation-triangle',
            medium: 'minus-circle',
            low: 'check-circle'
        };
        return icons[priority] || 'circle';
    }

    getStatusStyle(status) {
        const styles = {
            pending: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
            in_progress: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
            completed: 'bg-green-100 text-green-800 hover:bg-green-200',
            blocked: 'bg-red-100 text-red-800 hover:bg-red-200'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    }

    getStatusIcon(status) {
        const icons = {
            pending: 'circle',
            in_progress: 'play-circle',
            completed: 'check-circle',
            blocked: 'pause-circle'
        };
        return icons[status] || 'circle';
    }

    getStatusLabel(status) {
        const labels = {
            pending: 'Pending',
            in_progress: 'In Progress',
            completed: 'Done',
            blocked: 'Blocked'
        };
        return labels[status] || status;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays === -1) return 'Yesterday';
        if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
        if (diffDays < 7) return `In ${diffDays} days`;
        
        return date.toLocaleDateString();
    }
}

// Global tasks component instance
const tasksComponent = new TasksComponent();