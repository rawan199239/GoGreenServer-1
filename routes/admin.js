const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");
const User = require("../models/UserModel");
const validator = require("../middlewares/UserMWValidator");

// Admin login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and is an admin
    const admin = await User.findOne({ email, isAdmin: true }).exec();
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate admin's password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token for admin
    const token = jwt.sign({ userId: admin._id, email: admin.email }, config.get("jwtSecret"), {
      expiresIn: "1h" // Token expiration time
    });

    res.status(200).json({ message: "Admin login successful", token });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ message: "Internal Server Error: Failed to login" });
  }
});

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Admin-only routes
router.post("/addUser", verifyAdminToken, validator, async (req, res) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ email: req.body.email }).exec();
    if (user) return res.status(400).send({
      statusMsg: "fail",
      message: "Account Already Exists"
    });

    // Create new user to be added to DB
    let salt = await bcrypt.genSalt(10);
    let hashedPswd = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      email: req.body.email,
      name: req.body.name,
      password: hashedPswd,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      months: req.body.months,
      kind: req.body.kind,
      packages: req.body.packages || [],
      apiConsumption: req.body.apiConsumption || [],
    });

    // Save the new user
    const createdUser = await newUser.save();

    res.status(201).json({ message: "User added successfully", user: createdUser });
  } catch (error) {
    console.error("Error adding user:", error.message);
    res.status(500).json({ message: "Internal Server Error: Failed to add user" });
  }
});

router.delete("/deleteUser/:userId", verifyAdminToken, async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId).exec();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Internal Server Error: Failed to delete user" });
  }
});

router.put("/updateUser/:userId", verifyAdminToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).exec();
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Internal Server Error: Failed to update user" });
  }
});
router.get("/getUser/:userId", verifyAdminToken, async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).exec();
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user:", error.message);
      res.status(500).json({ message: "Internal Server Error: Failed to fetch user" });
    }
  });
  router.get("/getAllUsers", verifyAdminToken, async (req, res) => {
    try {
      const users = await User.find().exec();
      res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching users:", error.message);
      res.status(500).json({ message: "Internal Server Error: Failed to fetch users" });
    }
  });
module.exports = router;




