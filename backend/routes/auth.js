const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      const err = new Error("Name is required");
      err.statusCode = 400;
      throw err;
    }
    if (!email || !email.trim()) {
      const err = new Error("Email is required");
      err.statusCode = 400;
      throw err;
    }
    if (!password || password.length < 6) {
      const err = new Error("Password must be at least 6 characters");
      err.statusCode = 400;
      throw err;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      const err = new Error("Email already registered");
      err.statusCode = 409;
      throw err;
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Email and password are required");
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
