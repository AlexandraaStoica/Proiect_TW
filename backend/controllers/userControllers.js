const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("../config/database");

const userController = {
  async login(req, res) {
    try {
      console.log(req.body);
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Invalid email" });
      }

      // Validate password
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token with both id and role
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      // Respond with user details and token
      res.json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Error during login" });
    }
  },

  async me(req, res) {
    try {
      res.json({
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
        },
      });
    } catch (error) {
      console.error("Me error:", error);
      res.status(500).json({ error: "Error during me" });
    }
  },
};

module.exports = userController;
