const express = require("express");
const sequelize = require("./config/database");
const seedDatabase = require("./config/seedData");

require("dotenv").config();

const app = express();

app.use(express.json());

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
