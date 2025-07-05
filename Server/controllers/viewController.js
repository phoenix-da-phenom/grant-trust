const Inventory = require("../models/inventory");

const dashView = async(req, res) => {
    try {
        // Check if user is authenticated (middleware should handle this)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized - invalid or missing token"
            });
        }

        // Get the count of all inventory records for THIS USER
        const totalRecords = await Inventory.countDocuments({ user: req.user._id });

        // GET TOTAL NUMBER OF TRANSACTION

        res.status(200).json({
            success: true,
            count: totalRecords, // Moved count to top level
            userId: req.user._id // Optional: include user ID for debugging
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = { dashView };