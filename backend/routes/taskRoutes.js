const express = require("express");
const router = express.Router();
const { createTask, fetchTasks, updateTaskStatus, getManagedUsers } = require("../controllers/taskController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Adaugă această rută ÎNAINTE de celelalte rute
router.get("/managed-users", protect, authorize("MANAGER"), getManagedUsers);

router.post("/", protect, authorize("MANAGER"), createTask);
router.get("/", protect, authorize("USER", "MANAGER"), fetchTasks);
router.patch("/:taskId", protect, authorize("USER"), updateTaskStatus);

module.exports = router;