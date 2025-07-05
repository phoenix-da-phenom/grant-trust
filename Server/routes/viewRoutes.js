const express = require("express");


const { protect } = require("../middlewares/authMiddleware");
const { dashView } = require("../controllers/viewController");
const router = express.Router();

//Add to inventory route
router.get('/overview', protect, dashView);


module.exports = router;