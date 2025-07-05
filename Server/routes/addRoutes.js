const express = require("express");
const router = express.Router();


// Now import properly
const { addNewInventory } = require("../controllers/addController");
const { inventoryUpload, handleUploadErrors } = require('../middlewares/uploadMiddle');
const { protect } = require("../middlewares/authMiddleware");

// Route definition remains the same
router.post(
    '/enter-inventory',
    protect,
    (req, res, next) => {
        inventoryUpload(req, res, (err) => {
            if (err) return handleUploadErrors(err, req, res, next);
            next();
        });
    },
    addNewInventory
);

module.exports = router;