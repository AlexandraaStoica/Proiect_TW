const {User, UserManager, Task} = require("../models");

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

        const user2 = await User.create({
            username: "jane",
            email: "jane@example.com",
            password: "user123",
            role: "USER",
        });

        // Assign manager to user
        await UserManager.create({
            userId: user.id,
            managerId: manager.id,
        });
        await UserManager.create({
            userId: user2.id,
            managerId: manager.id,
        });
        // Create a sample task

        await Task.create({
            title: "Complete Project Proposal",
            description: "Write and submit the Q1 project proposal document",
            state: "PENDING",
            creatorId: manager.id,
            assigneeId: user2.id,
        })

        await Task.create({
            title: "Complete Project Proposal",
            description: "Write and submit the Q1 project proposal document",
            state: "PENDING",
            creatorId: manager.id,
            assigneeId: user.id,
        });

        await Task.create({
            title: "Review Code Changes",
            description:
                "Review and provide feedback on the latest pull request for the authentication module",
            state: "PENDING",
            creatorId: manager.id,
            assigneeId: user.id,
        });

        await Task.create({
            title: "Update Documentation",
            description:
                "Update API documentation with new endpoints and response formats",
            state: "PENDING",
            creatorId: manager.id,
            assigneeId: user.id,
        });

        await Task.create({
            title: "Client Meeting Preparation",
            description:
                "Prepare presentation slides and demo for the upcoming client meeting on Thursday",
            state: "PENDING",
            creatorId: manager.id,
            assigneeId: user.id,
        });

        await Task.create({
            title: "Bug Fix: Login Error",
            description:
                "Investigate and fix the intermittent login error reported by users",
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
