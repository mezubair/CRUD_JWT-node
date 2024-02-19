const express = require("express");
const router = express.Router();
const {register,login,forgetPassword,resetPassword} = require("../controllers/authController");
const {upload}=require("../middleware/fileUploadMiddleware")

router.use("/register",upload);
router.post("/register", register);


router.post("/login", login);
router.post("/forgetPassword",forgetPassword);
router.patch("/resetPassword/:token",resetPassword);

module.exports = router;
