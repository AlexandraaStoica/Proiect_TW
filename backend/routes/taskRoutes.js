const express = require("express");
const router = express.Router();
const {
  createTask,
  fetchTasks,
  updateTaskStatus,
  getUserTasks,
} = require("../controllers/taskController");
const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, authorize("MANAGER"), createTask)
  .get(protect,authorize("USER", "MANAGER"), fetchTasks)

router.route("/:taskId").patch(protect, authorize("USER"), updateTaskStatus);


module.exports = router;
