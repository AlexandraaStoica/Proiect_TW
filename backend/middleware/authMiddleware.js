const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        console.log(token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);

        req.user = {
          id: decoded.id,
          role: user.role,
        };

        next();
      } catch (error) {
        console.error(error);
        res.status(401).json({ error: "Not authorized, token expired" });
      }
    }

    if (!token) {
      res.status(401).json({ error: "Not authorized, no token" });
    }
  } catch (error) {
    next(error); // Pass errors to Express error handler
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error("Not authorized to access this route");
    }
    next();
  };
};

module.exports = { protect, authorize };
