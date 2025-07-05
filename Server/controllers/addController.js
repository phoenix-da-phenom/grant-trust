const Inventory = require("../models/inventory");

const addNewInventory = async (req, res) => {
  try {
    // Get authenticated user
    const authUser = req.user;

    // Extract text fields
    const { 
      firstname,
      lastname,
      email,
      phone,
     category,
      country,
      state,
      trackno,
      dateofbirth,
      inventorylist,
      weightandpurity,
      estimatedvalue,
      serialnumber,
      durationofstorage,
      insuracecoverage: insuarancecoverage // Fix typo
    } = req.body;

    // Handle files (Multer stores them in req.files)
    const files = req.files;
    if (!files) {
  return res.status(400).json({
    error: 'No files were uploaded'
  });
}
    
    // Validate required files exist
    const requiredFiles = ['governmentID', 'proofofaddress', 'photographorvideo'];
    const missingFiles = requiredFiles.filter(field => !files[field]);
    
    if (missingFiles.length > 0) {
      return res.status(400).json({
        error: 'Missing required files',
        missing: missingFiles
      });
    }

    // Check for duplicate tracking number
    const existingTrack = await Inventory.findOne({ trackno });
    if (existingTrack) {
      return res.status(409).json({
        error: 'Duplicate tracking number',
        solution: 'Please provide a unique tracking number'
      });
    }

    // Determine media type
    const mediaType = files.photographorvideo[0].mimetype.startsWith('image/') 
      ? 'photo' 
      : 'video';

    // Create new inventory
    const newInventory = new Inventory({
      user: authUser._id,
      firstname,
      lastname,
      email,
      phone,
      category,
      country,
      state,
      trackno,
      dateofbirth,
      governmentID: files.governmentID[0].path,
      proofofaddress: files.proofofaddress[0].path,
      inventorylist,
      weightandpurity,
      photographorvideo: files.photographorvideo[0].path,
      estimatedvalue,
      serialnumber,
      durationofstorage,
      insuarancecoverage,
      mediaType
    });

    await newInventory.save();

    // Success response
    res.status(201).json({
      success: true,
      inventory: {
        id: newInventory._id,
        trackno: newInventory.trackno,
        status: 'created'
      }
    });

  } catch (error) {
    console.error('Inventory creation error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        error: 'Duplicate value',
        field,
        value: error.keyValue[field]
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    // Generic server error
    res.status(500).json({
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Please try again later'
    });
  }
};
module.exports = {
  addNewInventory
};