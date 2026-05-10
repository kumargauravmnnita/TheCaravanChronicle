const User = require("../models/User");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public (anyone can register)

const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, area } = req.body;

  if (!name || !email || !password) {
    res.status(400); // 400 = Bad Request
    throw new Error("Please provide name, email and password");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("A citizen with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    area: area || "General",
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      area: user.area,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @route   POST /api/auth/login
// @desc    Login user and return token
// @access  Public

const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error(
      "Your account has been deactivated. Contact the Ringmaster.",
    );
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    area: user.area,
    token: generateToken(user._id),
  });
});

// @route   GET /api/auth/me
// @desc    Get currently logged-in user's profile
// @access  Private (requires token)

const getMe = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    area: user.area,
    avatar: user.avatar,
    createdAt: user.createdAt,
  });
});

module.exports = { registerUser, loginUser, getMe };
