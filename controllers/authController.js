const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const profilePic = req.file ? req.file.filename:null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      profilePic,
    });
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, "mynameiszubair");
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    } else {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetPasswordTokenExp = Date.now() + 10 * 60 * 1000;

      user.resetPasswordToken = resetToken;
      user.resetPasswordTokenExp = resetPasswordTokenExp;

      await user.save();
      const url = `${req.protocol}://${req.get(
        "host"
      )}/auth/resetPassword/${resetToken}`;
      const message = `use below link to reset your password${url}`;
      console.log("Reset token:", resetToken);
      await sendEmail({
        email: user.email,
        message: message,
      });
      return res.status(200).json({
        status: "success",
        message: "check your mail",
      });
    }
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid reset token",
      });
    } else if (user.resetPasswordTokenExp < Date.now()) {
      return res.status(400).json({
        status: "failed",
        message: "Expired reset token",
      });
    } else {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExp = undefined;
      user.passwordChangedAt = Date.now();
      await user.save();
      return res.status(200).json({
        status: "success",
        message: "Password changed successfully",
      });
    }
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
