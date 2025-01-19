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

  async getUsers(req, res) {
    try {
      const { role } = req.user;

      // Dacă utilizatorul este ADMIN, returnează toți managerii
      if (role === "ADMIN") {
        const managers = await User.findAll({
          where: { role: "MANAGER" },
          attributes: ["id", "username", "email", "role"]
        });
        return res.json(managers);
      }

      // Dacă utilizatorul este MANAGER, returnează utilizatorii lui
      if (role === "MANAGER") {
        const managerId = req.user.id;
        const users = await User.findAll({
          include: [{
            model: User,
            as: 'managers',
            where: { id: managerId },
            attributes: [],
            through: { attributes: [] }
          }],
          attributes: ["id", "username", "email", "role"]
        });
        return res.json(users);
      }

      // Pentru alte roluri, returnează array gol
      return res.json([]);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Error getting users" });
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

  async createUser(req, res) {
    try {
      const { email, password, role, managerId } = req.body;
      const username = email.split("@")[0];

      // Creează utilizatorul
      const user = await User.create({
        username,
        email,
        password,
        role,
      });

      // Dacă este user normal și are manager specificat, creează relația
      if (role === "USER" && managerId) {
        await user.addManager(managerId);
      }

      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ error: "Error creating user" });
    }
  }
};

module.exports = userController;