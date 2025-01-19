const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { login, me, getUsers, createUser } = require("../controllers/userControllers");

router.post("/login", login);
router.get("/me", protect, me);
router.get("/", protect, getUsers);
router.post("/", protect, authorize("ADMIN"), createUser);

module.exports = router;