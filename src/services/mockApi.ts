// Mock API interceptor for frontend development
import axios from 'axios';
import {
    mockUsers,
    mockEmployees,
    mockTasks,
    mockDashboardStats,
    mockComments,
    mockPerformanceData,
    mockNewJoiners
} from './mockData';

const MOCK_ENABLED = import.meta.env.DEV; // Enable mocking in development
const MOCK_DELAY = 300; // Simulate network delay in ms

// Helper to simulate async delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get current user from localStorage
const getCurrentUser = () => {
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (email && mockUsers[email as keyof typeof mockUsers]) {
        return {
            ...mockUsers[email as keyof typeof mockUsers],
            role: role || mockUsers[email as keyof typeof mockUsers].role,
            id: userId || mockUsers[email as keyof typeof mockUsers].id
        };
    }
    return null;
};

// Mock API responses
const mockApiResponses: Record<string, any> = {
    // Auth endpoints
    'GET /api/auth/me': () => {
        const user = getCurrentUser();
        if (user) {
            return { id: user.id, email: user.email, role: user.role };
        }
        throw new Error('Unauthorized');
    },

    // Dashboard endpoints
    'GET /api/tasks/Dashboard': () => {
        const user = getCurrentUser();
        const userRole = user?.role?.toLowerCase();

        if (userRole === 'operator') {
            const userTasks = mockTasks.filter(t => t.assigneeId === user?.id);
            return {
                tasks: userTasks,
                stats: mockDashboardStats.operator
            };
        }

        return {
            tasks: mockTasks,
            stats: mockDashboardStats.operator
        };
    },

    'GET /api/employees/dashboard': () => {
        const user = getCurrentUser();
        return {
            employees: mockEmployees,
            stats: mockDashboardStats.manager,
            tasks: mockTasks,
            recentActivity: [
                { type: 'task_completed', user: 'Mike Johnson', task: 'Setup database schema', time: '2 hours ago' },
                { type: 'task_started', user: 'John Doe', task: 'Implement user authentication', time: '4 hours ago' },
                { type: 'comment_added', user: 'Manager', task: 'Implement user authentication', time: '5 hours ago' }
            ]
        };
    },

    // Task endpoints
    'GET /api/tasks/EmployeeTasks': () => {
        const user = getCurrentUser();
        if (user?.role === 'OPERATOR') {
            return mockTasks.filter(t => t.assigneeId === user.id);
        }
        return mockTasks;
    },

    'GET /api/projectManager/ManagerTasks': () => {
        return mockTasks;
    },

    // Employee endpoints
    'GET /api/employees/employees': () => {
        // Add tasks to each employee
        const employeesWithTasks = mockEmployees.map(emp => ({
            ...emp,
            tasks: mockTasks.filter(t => t.assigneeId === emp.userId)
        }));

        return {
            employees: employeesWithTasks,
            TaskCompletedCount: mockTasks.filter(t => t.status === 'DONE').length
        };
    },

    'GET /api/employees/performance': () => {
        return mockPerformanceData;
    },

    'GET /api/projectManager/Manager_employee_list': () => {
        return mockEmployees;
    },

    'GET /api/projectManager/employee-assign/new-joiners': () => {
        return mockNewJoiners;
    },

    // Comments endpoints
    'GET /api/comments/:id': (params: any) => {
        const taskId = params.id;
        return mockComments.filter(c => c.taskId === taskId);
    },

    // Add completed tasks endpoint
    'GET /api/tasks/:id/completed': (params: any) => {
        const employeeId = params.id;
        const completedTasks = mockTasks.filter(t =>
            t.assigneeId === employeeId && t.status === 'DONE'
        );
        return {
            tasks: completedTasks
        };
    },

    // Employee-specific performance endpoint
    'GET /api/employees/:id/performance': (params: any) => {
        const employeeId = params.id;
        const employee = mockEmployees.find(e => e.id === employeeId || e.userId === employeeId);

        if (!employee) {
            return { employee: null, performance: null };
        }

        // Generate realistic performance data
        const performance = {
            hours: Math.floor(Math.random() * 40) + 120,
            hoursChange: Math.floor(Math.random() * 20) - 10,
            completionRate: Math.floor(Math.random() * 30) + 70,
            completionChange: Math.floor(Math.random() * 10) + 1,
            engagement: Math.floor(Math.random() * 20) + 80,
            engagementChange: Math.floor(Math.random() * 8) + 2,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            ratingChange: Math.floor(Math.random() * 15) + 10,
            weeklyHours: [
                { day: 'Mon', hours: Math.floor(Math.random() * 3) + 6 },
                { day: 'Tue', hours: Math.floor(Math.random() * 3) + 6 },
                { day: 'Wed', hours: Math.floor(Math.random() * 3) + 6 },
                { day: 'Thu', hours: Math.floor(Math.random() * 3) + 6 },
                { day: 'Fri', hours: Math.floor(Math.random() * 3) + 6 }
            ],
            completionTrend: [
                { week: 'Week 1', completion: 65 },
                { week: 'Week 2', completion: 72 },
                { week: 'Week 3', completion: 78 },
                { week: 'Week 4', completion: 85 }
            ],
            radar: [
                { metric: 'Quality', A: 85, fullMark: 100 },
                { metric: 'Speed', A: 78, fullMark: 100 },
                { metric: 'Collaboration', A: 92, fullMark: 100 },
                { metric: 'Innovation', A: 75, fullMark: 100 },
                { metric: 'Reliability', A: 88, fullMark: 100 }
            ],
            skills: [
                { skill: 'React/Frontend', percentage: 92 },
                { skill: 'Node.js/Backend', percentage: 85 },
                { skill: 'Database Design', percentage: 78 },
                { skill: 'API Development', percentage: 88 },
                { skill: 'Testing', percentage: 75 }
            ],
            achievements: [
                { title: 'Top Performer', subtitle: 'Completed 15 tasks this month', icon: 'Trophy' },
                { title: 'Quick Responder', subtitle: 'Average response time: 2 hours', icon: 'Star' },
                { title: 'Team Player', subtitle: 'Helped 5 team members', icon: 'Trophy' }
            ]
        };

        return {
            employee: { ...employee, roleTitle: employee.roleTitle },
            performance
        };
    },

    // Write operations - these just return success for demo purposes
    'POST /api/tasks/create': () => {
        return { success: true, message: 'Task created successfully' };
    },

    'PATCH /api/tasks/:id': () => {
        return { success: true, message: 'Task updated successfully' };
    },

    'DELETE /api/tasks/:id': () => {
        return { success: true, message: 'Task deleted successfully' };
    },

    'POST /api/tasks/:id/transfer': () => {
        return { success: true, message: 'Task transferred successfully' };
    },

    'PATCH /api/tasks/:id/priority': () => {
        return { success: true, message: 'Priority updated successfully' };
    },

    'PATCH /api/tasks/:id/status': () => {
        return { success: true, message: 'Status updated successfully' };
    },

    'POST /api/comments': () => {
        return { success: true, message: 'Comment added successfully' };
    },

    'POST /api/projectManager/employee-assign/assign': () => {
        return { success: true, message: 'Employee assigned successfully' };
    }
};

// Intercept axios requests
export const initMockApi = () => {
    if (!MOCK_ENABLED) return;

    console.log('🎭 Mock API initialized - all requests will return dummy data');

    // Axios interceptor
    axios.interceptors.request.use(
        async (config) => {
            const url = config.url || '';
            const method = config.method?.toUpperCase() || 'GET';

            // Check if this is an API call
            if (url.includes('/api/')) {
                // Extract path after /api
                const path = url.substring(url.indexOf('/api'));
                const key = `${method} ${path.split('?')[0]}`;

                // Check for dynamic routes (e.g., /api/comments/:id)
                let mockResponse = mockApiResponses[key];

                if (!mockResponse) {
                    // Try to match dynamic routes
                    for (const [route, handler] of Object.entries(mockApiResponses)) {
                        const routeParts = route.split(' ');
                        if (routeParts[0] !== method) continue;

                        const routePath = routeParts[1];
                        const pathParts = path.split('/');
                        const routePathParts = routePath.split('/');

                        if (pathParts.length === routePathParts.length) {
                            let match = true;
                            const params: any = {};

                            for (let i = 0; i < routePathParts.length; i++) {
                                if (routePathParts[i].startsWith(':')) {
                                    params[routePathParts[i].substring(1)] = pathParts[i];
                                } else if (routePathParts[i] !== pathParts[i]) {
                                    match = false;
                                    break;
                                }
                            }

                            if (match) {
                                mockResponse = () => handler(params);
                                break;
                            }
                        }
                    }
                }

                if (mockResponse) {
                    console.log(`🎭 Mocking ${method} ${path}`);

                    // Simulate network delay
                    await delay(MOCK_DELAY);

                    try {
                        const data = typeof mockResponse === 'function' ? mockResponse() : mockResponse;

                        // Cancel the request and return mock data
                        config.adapter = () => {
                            return Promise.resolve({
                                data,
                                status: 200,
                                statusText: 'OK',
                                headers: {},
                                config
                            });
                        };
                    } catch (error: any) {
                        // Handle mock errors
                        config.adapter = () => {
                            return Promise.reject({
                                response: {
                                    data: { error: error.message },
                                    status: 401,
                                    statusText: 'Unauthorized'
                                }
                            });
                        };
                    }
                }
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (input, init?) => {
        const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : String(input));
        const method = init?.method?.toUpperCase() || 'GET';

        if (url.includes('/api/')) {
            const path = url.substring(url.indexOf('/api'));
            const key = `${method} ${path.split('?')[0]}`;

            let mockResponse = mockApiResponses[key];

            if (!mockResponse) {
                // Try to match dynamic routes
                for (const [route, handler] of Object.entries(mockApiResponses)) {
                    const routeParts = route.split(' ');
                    if (routeParts[0] !== method) continue;

                    const routePath = routeParts[1];
                    const pathParts = path.split('/');
                    const routePathParts = routePath.split('/');

                    if (pathParts.length === routePathParts.length) {
                        let match = true;
                        const params: any = {};

                        for (let i = 0; i < routePathParts.length; i++) {
                            if (routePathParts[i].startsWith(':')) {
                                params[routePathParts[i].substring(1)] = pathParts[i];
                            } else if (routePathParts[i] !== pathParts[i]) {
                                match = false;
                                break;
                            }
                        }

                        if (match) {
                            mockResponse = () => handler(params);
                            break;
                        }
                    }
                }
            }

            if (mockResponse) {
                console.log(`🎭 Mocking ${method} ${path}`);

                // Simulate network delay
                await delay(MOCK_DELAY);

                try {
                    const data = typeof mockResponse === 'function' ? mockResponse() : mockResponse;

                    return new Response(JSON.stringify(data), {
                        status: 200,
                        statusText: 'OK',
                        headers: { 'Content-Type': 'application/json' }
                    });
                } catch (error: any) {
                    return new Response(JSON.stringify({ error: error.message }), {
                        status: 401,
                        statusText: 'Unauthorized',
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }
        }

        // If no mock found, use original fetch
        return originalFetch(input, init);
    };
};
