const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { login, me, getUsers, createUser, getManagers } = require("../controllers/userControllers");

router.post("/login", login);
router.get("/me", protect, me);
router.get("/", protect, getUsers);
router.post("/", protect, authorize("ADMIN"), createUser);
router.get("/managers", protect, authorize("ADMIN"), getManagers);

module.exports = router;