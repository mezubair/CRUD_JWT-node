const express = require("express");
const router = express.Router();
const {register,login,forgetPassword,resetPassword,logout} = require("../controllers/authController");
const {upload}=require("../middleware/fileUploadMiddleware")
const authMiddleware = require("../middleware/authMiddleware");

router.use("/register",upload);
router.post("/register", register);


router.post("/login", login);

router.post("/forgetPassword",forgetPassword);
router.patch("/resetPassword/:token",resetPassword);

router.use(authMiddleware.authenticateToken);
router.post("/logout", logout);


module.exports = router;
