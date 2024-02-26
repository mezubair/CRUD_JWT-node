const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const Revoked=require("../models/revokedTokens");

exports.register = async (req, res) => {
  try {
    const { email, password,role,confirmPassword } = req.body;
    if(confirmPassword!==password){
      res.status(409).json({
        message:"password and confirm password didn't match"
      })
    }
    else{
    const profilePic = req.file ? req.file.filename:null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      profilePic,
      role,
    });
    res.status(201).json({status:"success",message:"User Succesfully registered" });
  }} catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🚀 ~ exports.login= ~ email, password:", email, password)
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id ,role:user.role}, "mynameiszubair");
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
      const message = `Dear user Use below link to reset your password  "${url}" Note: This linkis only valid for 10mins`;
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
  console.log(req.body.password);
  console.log(token);
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
exports.logout = async(req, res) => {

  const token = req.headers['authorization'].split(' ')[1];
  await Revoked.create({
    revTokens:token
  });

  
  res.json({message:"logout out succefully"}); 
};




  