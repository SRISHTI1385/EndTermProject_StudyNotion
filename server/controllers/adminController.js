const User = require("../models/User"); // Assuming you have a User model

// Controller to get all users
const getAllUsers = async (req, res) => {
  try {
    console.log("dhbdhhdh");
    console.log("vgggvgvgvgvg");
    // console.log("Fetching all users..."); // Add this
    const users = await User.find(); // Fetch all users from the database
    console.log(users);
    res.status(200).json({ users });
  } catch (error) {
    // console.error("Error fetching users:", error); // Add this
    res.status(500).json({ message: "Something went wrong." });
  }
};

// Controller to delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("dxdxdxddf");
    await User.findByIdAndDelete(id); // Delete the user with the given ID
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user." });
  }
};

// Corrected controller for role change
const changeUserRole = async (req, res) => {
  const { userId, role } = req.body;

  try {
    const user = await User.findById(userId); // Ensure User is correctly required
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.accountType = role; // ✅ Must be 'accountType' not 'role'
    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error changing user role:", error);
    res.status(500).json({ message: "Failed to change role." });
  }
};


module.exports = { getAllUsers, deleteUser, changeUserRole };