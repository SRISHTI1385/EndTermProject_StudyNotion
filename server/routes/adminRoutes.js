const express = require("express");
const router = express.Router();

// Import the controllers for the admin actions
const { getAllUsers, deleteUser, changeUserRole } = require("../controllers/adminController");

// Import the middleware to ensure only authenticated admins can access these routes
const { auth, isAdmin } = require("../middlewares/auth");

// Admin Routes

// Route to get all users
router.get("/all-users", auth, isAdmin, getAllUsers);

// Route to delete a user by ID
router.delete("/delete-user/:id", auth, isAdmin, deleteUser);

// Route to change a user's role (admin or user)
router.put("/change-role", auth, isAdmin, changeUserRole);

module.exports = router;