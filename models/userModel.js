const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic:{type:String},
  resetPasswordToken:{type:String},
  resetPasswordTokenExp:{type:Date},
  passwordChangedAt:{type:Date},
  role:{
    type:String,
    enum:["user","admin"],
    default:"user"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
