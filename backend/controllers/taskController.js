const Task = require("../models/Task");
const User = require("../models/User");

const taskController = {
    async createTask(req, res) {
        try {
            const {title, description, assigneeId} = req.body;
            const task = await Task.create({
                title,
                description,
                state: "PENDING",
                creatorId: req.user.id,
                assigneeId,
            });
            res.status(201).json(task);
        } catch (error) {
            console.error("Create task error:", error);
            res.status(500).json({error: "Error creating task"});
        }
    },

    async fetchTasks(req, res) {
        try {
            const {id, role} = req.user;
            let tasks = ""
            if (role === "MANAGER") {
                tasks = await Task.findAll({
                    where : {
                        creatorId: id,
                    },
                    include: [
                        {
                            model: User,
                            as: "assignee",
                            attributes: ["username", "id"],
                        },
                    ],
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
            const {taskId} = req.params;
            const {status} = req.body;
            const task = await Task.findByPk(taskId);
            if (!task) {
                return res.status(404).json({error: "Task not found"});
            }
            task.state = status;
            if (status === "COMPLETED") {
                task.completedAt = new Date();
            }
            await task.save();
            res.status(200).json(task);
        } catch (error) {
            console.error("Update task status error:", error);
            res.status(500).json({error: "Error updating task status"});
        }
    },
};

module.exports = taskController;
