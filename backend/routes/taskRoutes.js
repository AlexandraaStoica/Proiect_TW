const express = require("express");
const router = express.Router();
const { 
    createTask, 
    fetchTasks, 
    updateTaskStatus, 
    getManagedUsers, 
    getTasksByUser,
    assignTask
} = require("../controllers/taskController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Rute pentru manageri
router.get("/user/:userId", protect, authorize("MANAGER"), getTasksByUser);
router.get("/managed-users", protect, authorize("MANAGER"), getManagedUsers);
router.post("/", protect, authorize("MANAGER"), createTask);
router.patch("/:taskId/assign", protect, authorize("MANAGER"), assignTask);

// Rute comune
router.get("/", protect, authorize("USER", "MANAGER"), fetchTasks);
router.patch("/:taskId/status", protect, authorize("USER", "MANAGER"), updateTaskStatus);

module.exports = router;