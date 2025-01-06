const express = require("express");
const sequelize = require("./config/database");
const seedDatabase = require("./config/seedData");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).json({ ok: "Da" });
});

sequelize
  .sync({ force: true })
  .then(() => seedDatabase())
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
      );
    });
  });
