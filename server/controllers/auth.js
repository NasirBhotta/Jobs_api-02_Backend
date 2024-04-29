const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");
require("../middleware/session");
require("dotenv").config();

const register = async (req, res) => {
  const user = await User.create({
    ...req.body,
  });
  res.status(201).json({ user: { name: user.name } });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("invalid Credentials");
  }

  const checkPass = await user.comparePassword(password);
  if (!checkPass) {
    throw new UnauthenticatedError("invalid Credentials");
  }

  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  try {
    req.session.token = token;
    req.session.createdBy = user._id;
    req.session.save();
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({ user: { name: user.name }, token });
};

const logout = async (req, res) => {
  req.session.token = null;
  if (!req.session.token) {
    res.status(200).json("Logged Out Successfully");
  }
};

module.exports = { register, login, logout };
