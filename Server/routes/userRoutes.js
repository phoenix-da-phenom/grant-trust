const express = require("express");

const { protect } = require("../middlewares/authMiddleware");
const { uploadProfilePicture } = require("../controllers/userController");
const { profileUpload } = require("../middlewares/uploadMiddle");
const router = express.Router();

//Auth Routes
// Update user profile picture

router.post(
    "/update-profile-picture",
    protect,
    profileUpload, // Directly use the middleware
    uploadProfilePicture
);
module.exports = router;