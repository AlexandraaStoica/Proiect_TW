const express = require("express");
const router = express.Router();
const {
  createTask,
  fetchTasks,
  updateTaskStatus,
} = require("../controllers/taskController");
const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, authorize("MANAGER"), createTask)
  .get(protect, fetchTasks);
router.route("/:taskId").patch(protect, authorize("MANAGER"), updateTaskStatus);

module.exports = router;
