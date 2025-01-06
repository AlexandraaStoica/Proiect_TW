const { User, UserManager, Task } = require("../models");

const seedDatabase = async () => {
  try {
    // Create admin user
    const admin = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: "admin123",
      role: "ADMIN",
    });

    // Create manager
    const manager = await User.create({
      username: "manager1",
      email: "manager1@example.com",
      password: "manager123",
      role: "MANAGER",
    });

    // Create regular user
    const user = await User.create({
      username: "john",
      email: "john@example.com",
      password: "user123",
      role: "USER",
    });

    // Assign manager to user
    await UserManager.create({
      userId: user.id,
      managerId: manager.id,
    });

    // Create a sample task
    await Task.create({
      title: "Complete Project Proposal",
      description: "Write and submit the Q1 project proposal document",
      state: "PENDING",
      creatorId: manager.id,
      assigneeId: user.id,
    });

    console.log("Database seeded with test data!");
    console.log("Test accounts:");
    console.log("Admin - username: admin, password: admin123");
    console.log("Manager - username: manager1, password: manager123");
    console.log("User - username: john, password: user123");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
module.exports = seedDatabase;
