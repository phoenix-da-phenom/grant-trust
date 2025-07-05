const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile, logOut } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

//Auth Routes
router.post("/register", registerUser); //Register user (sign up)
router.post("/login", loginUser); //Login User
router.get("/profile", protect, getUserProfile); // Get User Profile
router.put("/profile", protect, updateUserProfile);
router.get("/logout", logOut);


module.exports = router;