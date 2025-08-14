const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    console.log("token",req.headers.authorization.split(" ")[1])
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token using secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Your payload structure: { user: { id: ..., role: ... } }
      const user = await User.findById(decoded.user.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; // attach user to request
      next();
    } catch (err) {
      console.error("❌ Token verification failed:", err.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// Optional admin check
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
