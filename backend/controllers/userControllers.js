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
      const { role, id } = req.user;

      if (role === "ADMIN") {
        const users = await User.findAll({
          where: {
            role: ["MANAGER", "USER"],
          },
          attributes: ["id", "username", "email", "role", "createdAt"],
          order: [["createdAt", "DESC"]],
        });
        return res.json(users);
      }

      if (role === "MANAGER") {
        const users = await User.findAll({
          where: { role: "USER" },
          include: [
            {
              model: User,
              as: "managers",
              where: { id: id },
              attributes: [],
            },
          ],
          attributes: ["id", "username", "email", "role", "createdAt"],
          order: [["createdAt", "DESC"]],
        });

        console.log("Users found for manager:", users);
        return res.json(users);
      }

      return res.json([]);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Error getting users" });
    }
  },

  async getManagers(req, res) {
    try {
      const managers = await User.findAll({
        where: { role: "MANAGER" },
        attributes: ["id", "username", "email", "role"],
      });
      return res.json(managers);
    } catch (error) {
      console.error("Get managers error:", error);
      res.status(500).json({ error: "Error getting managers" });
    }
  },

  async me(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ["id", "email", "role", "username"],
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      console.error("Me error:", error);
      res.status(500).json({ error: "Error during me" });
    }
  },

  async createUser(req, res) {
    try {
      const { email, password, role, managerId } = req.body;
      const username = email.split("@")[0];

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const user = await User.create({
        username,
        email,
        password,
        role,
      });

      if (role === "USER" && managerId) {
        const manager = await User.findByPk(managerId);
        if (!manager || manager.role !== "MANAGER") {
          await user.destroy();
          return res.status(400).json({ error: "Invalid manager selected" });
        }
        await user.addManager(managerId);
      }

      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Create user error:", error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ error: "Username or email already exists" });
      }
      res.status(500).json({ error: "Error creating user" });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.role === "ADMIN") {
        return res.status(403).json({ error: "Cannot delete admin user" });
      }

      await user.destroy();

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Error deleting user" });
    }
  },
};

module.exports = userController;
