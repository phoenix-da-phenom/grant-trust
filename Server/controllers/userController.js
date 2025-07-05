const User = require("../models/user")
const uploadProfilePicture = async(req, res) => {
    try {
        // Check if file exists (using multer's file handling)
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const userId = req.user._id;

        // Process the file (example using Cloudinary)
        // const result = await cloudinary.uploader.upload(req.file.path);

        // Or for local storage:
        const profilePictureUrl = `/uploads/profile/${req.file.filename}`;

        // Update user in database
        const updatedUser = await User.findByIdAndUpdate(
            userId, { profileimage: profilePictureUrl }, { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            profileimageurl: profilePictureUrl,
            user: updatedUser
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during upload",
            error: error.message
        });
    }
};

module.exports = {
    uploadProfilePicture
};