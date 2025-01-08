const express = require("express");
const router = express.Router();
const { login, me } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
//router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
module.exports = router;
