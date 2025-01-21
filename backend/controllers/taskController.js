const Task = require("../models/Task");
const User = require("../models/User");

const taskController = {
    async getTasksByUser(req, res) {
        try {
            const { userId } = req.params;
            const managerId = req.user.id;

            const managedUser = await User.findOne({
                where: { id: userId },
                include: [{
                    model: User,
                    as: 'managers',
                    where: { id: managerId },
                }]
            });

            if (!managedUser) {
                return res.status(403).json({ error: "Not authorized to view this user's tasks" });
            }

            const tasks = await Task.findAll({
                where: {
                    assigneeId: userId
                },
                include: [
                    {
                        model: User,
                        as: "assignee",
                        attributes: ["username", "id"],
                    },
                    {
                        model: User,
                        as: "creator",
                        attributes: ["username", "id"],
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.json(tasks);
        } catch (error) {
            console.error("Get tasks by user error:", error);
            res.status(500).json({ error: "Error fetching user tasks" });
        }
    },

    async getManagedUsers(req, res) {
        try {
            const managerId = req.user.id;
            const users = await User.findAll({
                include: [{
                    model: User,
                    as: 'managers',
                    where: { id: managerId },
                    attributes: []
                }],
                where: { role: "USER" }, 
                attributes: ['id', 'username', 'email']
            });
            res.json(users);
        } catch (error) {
            console.error("Get managed users error:", error);
            res.status(500).json({error: "Error getting managed users"});
        }
    },

    async createTask(req, res) {
        try {
            const {title, description, assigneeId} = req.body;
            const task = await Task.create({
                title,
                description,
                state: assigneeId ? "PENDING" : "OPEN",
                creatorId: req.user.id,
                assigneeId: assigneeId || null,
            });

            const taskWithRelations = await Task.findByPk(task.id, {
                include: [
                    {
                        model: User,
                        as: "assignee",
                        attributes: ["username", "id"],
                    },
                    {
                        model: User,
                        as: "creator",
                        attributes: ["username", "id"],
                    }
                ]
            });

            res.status(201).json(taskWithRelations);
        } catch (error) {
            console.error("Create task error:", error);
            res.status(500).json({error: "Error creating task"});
        }
    },

    async fetchTasks(req, res) {
        try {
            const {id, role} = req.user;
            let tasks;
            
            if (role === "MANAGER") {
                tasks = await Task.findAll({
                    where: {
                        creatorId: id,
                    },
                    include: [
                        {
                            model: User,
                            as: "assignee",
                            attributes: ["username", "id"],
                        },
                        {
                            model: User,
                            as: "creator",
                            attributes: ["username", "id"],
                        }
                    ],
                    order: [['createdAt', 'DESC']],
                });
            } else if (role === "USER") {
                tasks = await Task.findAll({
                    where: {
                        assigneeId: id,
                    },
                    include: [
                        {
                            model: User,
                            as: "assignee",
                            attributes: ["username", "id"],
                        },
                        {
                            model: User,
                            as: "creator",
                            attributes: ["username", "id"],
                        }
                    ],
                    order: [['createdAt', 'DESC']],
                });
            }
            res.status(200).json(tasks);
        } catch (error) {
            console.error("Fetch tasks error:", error);
            res.status(500).json({error: "Error fetching tasks"});
        }
    },

    async updateTaskStatus(req, res) {
        try {
            const { taskId } = req.params;
            const { status } = req.body;
            const task = await Task.findByPk(taskId);
            
            if (!task) {
                return res.status(404).json({ error: "Task not found" });
            }
    
            if (status === 'CLOSED' && req.user.role !== 'MANAGER') {
                return res.status(403).json({ error: "Only managers can close tasks" });
            }
    
            if (status === 'COMPLETED' && req.user.role !== 'USER') {
                return res.status(403).json({ error: "Only users can complete tasks" });
            }
    
            task.state = status;
            if (status === 'COMPLETED') {
                task.completedAt = new Date();
            } else if (status === 'CLOSED') {
                task.closedAt = new Date();
            }
    
            await task.save();

            const updatedTask = await Task.findByPk(taskId, {
                include: [
                    {
                        model: User,
                        as: "assignee",
                        attributes: ["username", "id"],
                    },
                    {
                        model: User,
                        as: "creator",
                        attributes: ["username", "id"],
                    }
                ]
            });
            res.status(200).json(updatedTask);
        } catch (error) {
            console.error("Update task status error:", error);
            res.status(500).json({ error: "Error updating task status" });
        }
    },

    async assignTask(req, res) {
        try {
            const { taskId } = req.params;
            const { assigneeId } = req.body;
            const task = await Task.findByPk(taskId);
            
            if (!task) {
                return res.status(404).json({ error: "Task not found" });
            }

            task.assigneeId = assigneeId;
            task.state = "PENDING";
            await task.save();

            const updatedTask = await Task.findByPk(taskId, {
                include: [
                    {
                        model: User,
                        as: "assignee",
                        attributes: ["username", "id"],
                    },
                    {
                        model: User,
                        as: "creator",
                        attributes: ["username", "id"],
                    }
                ]
            });

            res.status(200).json(updatedTask);
        } catch (error) {
            console.error("Assign task error:", error);
            res.status(500).json({ error: "Error assigning task" });
        }
    }
};

module.exports = taskController;