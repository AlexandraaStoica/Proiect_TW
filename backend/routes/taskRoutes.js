const express = require("express");
const router = express.Router();
const { createTask, fetchTasks, updateTaskStatus, getManagedUsers, getTasksByUser } = require("../controllers/taskController");
const { protect, authorize } = require("../middleware/authMiddleware");


router.get("/user/:userId", protect, authorize("MANAGER"), getTasksByUser);

router.get("/managed-users", protect, authorize("MANAGER"), getManagedUsers);
router.post("/", protect, authorize("MANAGER"), createTask);
router.get("/", protect, authorize("USER", "MANAGER"), fetchTasks);
router.patch("/:taskId", protect, authorize("USER"), updateTaskStatus);

module.exports = router;