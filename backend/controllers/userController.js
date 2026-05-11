const User = require("../models/User");
const expressAsyncHandler = require("express-async-handler");

// @route   GET /api/users
// @desc    Get all users (admin only)

const getAllUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

// @route   GET /api/users/staff
// @desc    Get all staff members (for assignment dropdown)

const getStaffMembers = expressAsyncHandler(async (req, res) => {
  const staff = await User.find({ role: "staff" }).select("name email area");
  res.json(staff);
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (admin only)

const updateUserRole = expressAsyncHandler(async (req, res) => {
  const { role } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = role;
  const updated = await user.save();

  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
  });
});

// @route   PUT /api/users/:id/deactivate
// @desc    Deactivate a user account (admin only)

const deactivateUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.isActive = false;
  await user.save();
  res.json({ message: "User deactivated successfully" });
});

module.exports = {
  getAllUsers,
  getStaffMembers,
  updateUserRole,
  deactivateUser,
};
