// Mock data for frontend development without backend

export const mockUsers = {
    "pm@dotspeaks.com": {
        id: "user-pm-001",
        email: "pm@dotspeaks.com",
        role: "MANAGER",
        name: "Project Manager"
    },
    "manager@dotspeaks.com": {
        id: "user-mgr-001",
        email: "manager@dotspeaks.com",
        role: "MANAGER",
        name: "Manager"
    },
    "employee@dotspeaks.com": {
        id: "user-emp-001",
        email: "employee@dotspeaks.com",
        role: "OPERATOR",
        name: "Employee"
    }
};

export const mockEmployees = [
    {
        id: "emp-001",
        userId: "user-emp-001",
        name: "John Doe",
        email: "employee@dotspeaks.com",
        roleTitle: "Senior Developer",
        department: "Engineering",
        status: "Active",
        managerId: "user-mgr-001",
        tasksAssigned: 8,
        tasksCompleted: 5,
        completionRate: 62.5,
        avgHoursPerTask: 6.5,
        createdAt: "2024-01-15T00:00:00Z"
    },
    {
        id: "emp-002",
        userId: "user-002",
        name: "Jane Smith",
        email: "jane.smith@dotspeaks.com",
        roleTitle: "UI/UX Designer",
        department: "Design",
        status: "Active",
        managerId: "user-mgr-001",
        tasksAssigned: 6,
        tasksCompleted: 4,
        completionRate: 66.7,
        avgHoursPerTask: 5.2,
        createdAt: "2024-02-01T00:00:00Z"
    },
    {
        id: "emp-003",
        userId: "user-003",
        name: "Mike Johnson",
        email: "mike.johnson@dotspeaks.com",
        roleTitle: "Backend Developer",
        department: "Engineering",
        status: "Active",
        managerId: "user-mgr-001",
        tasksAssigned: 10,
        tasksCompleted: 8,
        completionRate: 80.0,
        avgHoursPerTask: 7.1,
        createdAt: "2024-01-20T00:00:00Z"
    },
    {
        id: "emp-004",
        userId: "user-004",
        name: "Sarah Wilson",
        email: "sarah.wilson@dotspeaks.com",
        roleTitle: "QA Engineer",
        department: "Quality Assurance",
        status: "Active",
        managerId: "user-mgr-001",
        tasksAssigned: 12,
        tasksCompleted: 9,
        completionRate: 75.0,
        avgHoursPerTask: 4.5,
        createdAt: "2024-02-10T00:00:00Z"
    },
    {
        id: "emp-005",
        userId: "user-005",
        name: "David Brown",
        email: "david.brown@dotspeaks.com",
        roleTitle: "Frontend Developer",
        department: "Engineering",
        status: "On Leave",
        managerId: "user-mgr-001",
        tasksAssigned: 5,
        tasksCompleted: 3,
        completionRate: 60.0,
        avgHoursPerTask: 6.0,
        createdAt: "2024-03-01T00:00:00Z"
    }
];

export const mockTasks = [
    {
        id: "task-001",
        title: "Implement user authentication",
        notes: "Add OAuth2 authentication with Google and GitHub providers",
        dueDate: "2025-01-15T00:00:00Z",
        priority: "HIGH",
        status: "WORKING",
        assignedHours: 16,
        hoursUsed: 8,
        hoursAllocated: 16,
        createdById: "user-mgr-001",
        assigneeId: "user-emp-001",
        assignee: { name: "John Doe", email: "employee@dotspeaks.com" },
        createdAt: "2025-01-05T00:00:00Z",
        updatedAt: "2025-01-10T00:00:00Z"
    },
    {
        id: "task-002",
        title: "Design dashboard mockups",
        notes: "Create Figma designs for admin and user dashboards",
        dueDate: "2025-01-20T00:00:00Z",
        priority: "HIGH",
        status: "DONE",
        assignedHours: 12,
        hoursUsed: 10,
        hoursAllocated: 12,
        createdById: "user-mgr-001",
        assigneeId: "user-002",
        assignee: { name: "Jane Smith", email: "jane.smith@dotspeaks.com" },
        createdAt: "2025-01-02T00:00:00Z",
        updatedAt: "2025-01-18T00:00:00Z"
    },
    {
        id: "task-003",
        title: "Setup database schema",
        notes: "Design and implement PostgreSQL schema with migrations",
        dueDate: "2025-01-18T00:00:00Z",
        priority: "HIGH",
        status: "DONE",
        assignedHours: 10,
        hoursUsed: 9,
        hoursAllocated: 10,
        createdById: "user-mgr-001",
        assigneeId: "user-003",
        assignee: { name: "Mike Johnson", email: "mike.johnson@dotspeaks.com" },
        createdAt: "2025-01-03T00:00:00Z",
        updatedAt: "2025-01-16T00:00:00Z"
    },
    {
        id: "task-004",
        title: "Write integration tests",
        notes: "Cover API endpoints with comprehensive test suite",
        dueDate: "2025-01-25T00:00:00Z",
        priority: "MEDIUM",
        status: "TODO",
        assignedHours: 20,
        hoursUsed: 0,
        hoursAllocated: 20,
        createdById: "user-mgr-001",
        assigneeId: "user-004",
        assignee: { name: "Sarah Wilson", email: "sarah.wilson@dotspeaks.com" },
        createdAt: "2025-01-08T00:00:00Z",
        updatedAt: "2025-01-08T00:00:00Z"
    },
    {
        id: "task-005",
        title: "Implement responsive navigation",
        notes: "Mobile-first navigation with hamburger menu",
        dueDate: "2025-01-22T00:00:00Z",
        priority: "MEDIUM",
        status: "WORKING",
        assignedHours: 8,
        hoursUsed: 4,
        hoursAllocated: 8,
        createdById: "user-mgr-001",
        assigneeId: "user-005",
        assignee: { name: "David Brown", email: "david.brown@dotspeaks.com" },
        createdAt: "2025-01-09T00:00:00Z",
        updatedAt: "2025-01-12T00:00:00Z"
    },
    {
        id: "task-006",
        title: "API documentation",
        notes: "Complete OpenAPI/Swagger documentation for all endpoints",
        dueDate: "2025-02-01T00:00:00Z",
        priority: "LOW",
        status: "TODO",
        assignedHours: 6,
        hoursUsed: 0,
        hoursAllocated: 6,
        createdById: "user-mgr-001",
        assigneeId: "user-003",
        assignee: { name: "Mike Johnson", email: "mike.johnson@dotspeaks.com" },
        createdAt: "2025-01-11T00:00:00Z",
        updatedAt: "2025-01-11T00:00:00Z"
    },
    {
        id: "task-007",
        title: "Fix critical security bug",
        notes: "Patch SQL injection vulnerability in user search",
        dueDate: "2025-01-13T00:00:00Z",
        priority: "HIGH",
        status: "STUCK",
        assignedHours: 4,
        hoursUsed: 6,
        hoursAllocated: 4,
        createdById: "user-mgr-001",
        assigneeId: "user-003",
        assignee: { name: "Mike Johnson", email: "mike.johnson@dotspeaks.com" },
        createdAt: "2025-01-10T00:00:00Z",
        updatedAt: "2025-01-12T00:00:00Z"
    },
    {
        id: "task-008",
        title: "Performance optimization",
        notes: "Optimize database queries and add caching layer",
        dueDate: "2025-01-30T00:00:00Z",
        priority: "MEDIUM",
        status: "TODO",
        assignedHours: 16,
        hoursUsed: 0,
        hoursAllocated: 16,
        createdById: "user-mgr-001",
        assigneeId: "user-003",
        assignee: { name: "Mike Johnson", email: "mike.johnson@dotspeaks.com" },
        createdAt: "2025-01-07T00:00:00Z",
        updatedAt: "2025-01-07T00:00:00Z"
    }
];

export const mockDashboardStats = {
    operator: {
        totalTasks: 8,
        completedTasks: 5,
        inProgressTasks: 2,
        pendingTasks: 0,
        stuckTasks: 1,
        completionRate: 62.5,
        completionTrend: [
            { week: "Week 1", rate: 50 },
            { week: "Week 2", rate: 55 },
            { week: "Week 3", rate: 60 },
            { week: "Week 4", rate: 62.5 }
        ]
    },
    manager: {
        totalEmployees: 5,
        activeEmployees: 4,
        totalTasks: 41,
        completedTasks: 29,
        inProgressTasks: 8,
        pendingTasks: 2,
        stuckTasks: 2,
        completionRate: 70.7,
        avgCompletionTime: 6.1,
        teamPerformance: [
            { name: "John Doe", tasks: 8, completed: 5, rate: 62.5 },
            { name: "Jane Smith", tasks: 6, completed: 4, rate: 66.7 },
            { name: "Mike Johnson", tasks: 10, completed: 8, rate: 80.0 },
            { name: "Sarah Wilson", tasks: 12, completed: 9, rate: 75.0 },
            { name: "David Brown", tasks: 5, completed: 3, rate: 60.0 }
        ],
        weeklyProgress: [
            { week: "Week 1", completed: 5 },
            { week: "Week 2", completed: 7 },
            { week: "Week 3", completed: 9 },
            { week: "Week 4", completed: 8 }
        ]
    }
};

export const mockComments = [
    {
        id: "comment-001",
        taskId: "task-001",
        authorId: "user-emp-001",
        author: { name: "John Doe", email: "employee@dotspeaks.com" },
        content: "Started working on OAuth integration. Google provider is almost done.",
        seenByAssignee: true,
        seenByManager: true,
        createdAt: "2025-01-10T10:30:00Z",
        updatedAt: "2025-01-10T10:30:00Z"
    },
    {
        id: "comment-002",
        taskId: "task-001",
        authorId: "user-mgr-001",
        author: { name: "Manager", email: "manager@dotspeaks.com" },
        content: "Great progress! Make sure to handle error cases properly.",
        seenByAssignee: true,
        seenByManager: true,
        createdAt: "2025-01-10T14:15:00Z",
        updatedAt: "2025-01-10T14:15:00Z"
    },
    {
        id: "comment-003",
        taskId: "task-007",
        authorId: "user-003",
        author: { name: "Mike Johnson", email: "mike.johnson@dotspeaks.com" },
        content: "Need help with this one. The vulnerability is deeper than expected.",
        seenByAssignee: true,
        seenByManager: false,
        createdAt: "2025-01-12T09:00:00Z",
        updatedAt: "2025-01-12T09:00:00Z"
    }
];

export const mockPerformanceData = {
    employees: mockEmployees.map(emp => ({
        ...emp,
        performance: {
            completedTasks: emp.tasksCompleted,
            totalTasks: emp.tasksAssigned,
            completionRate: emp.completionRate,
            avgResponseTime: Math.floor(Math.random() * 24) + 1,
            onTimeDelivery: Math.floor(Math.random() * 30) + 70
        }
    }))
};

export const mockNewJoiners = [
    {
        id: "emp-006",
        name: "Emma Davis",
        email: "emma.davis@dotspeaks.com",
        roleTitle: "Junior Developer",
        department: "Engineering",
        joinDate: "2025-01-20T00:00:00Z",
        status: "Unassigned"
    },
    {
        id: "emp-007",
        name: "Tom Anderson",
        email: "tom.anderson@dotspeaks.com",
        roleTitle: "Data Analyst",
        department: "Analytics",
        joinDate: "2025-01-22T00:00:00Z",
        status: "Unassigned"
    }
];
