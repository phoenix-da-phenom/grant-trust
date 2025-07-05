const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File validation
const fileFilter = (req, file, cb) => {
    const validMimes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];

    if (validMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Only images (JPEG, PNG, GIF) and videos (MP4, MOV) are allowed.`), false);
    }
};

// Configure Multer instance
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 80 * 1024 * 1024, // 80MB
        files: 3 // Maximum 3 files
    }
});

// Define upload middleware with specific fields
const inventoryUpload = upload.fields([
    { name: 'governmentID', maxCount: 1 },
    { name: 'proofofaddress', maxCount: 1 },
    { name: 'photographorvideo', maxCount: 1 }
]);


// Configure storage for profile picture uploads

const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});


const profileFileFilter = (req, file, cb) => {
    const validMimes = ['image/jpeg', 'image/png', 'image/gif'];

    if (validMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Only images (JPEG, PNG, GIF) are allowed.`), false);
    }
};

const profileUpload = multer({
    storage: profileStorage, // Changed from profileStorage to storage
    fileFilter: profileFileFilter, // Changed from profileFileFilter to fileFilter
    limits: {
        fileSize: 15 * 1024 * 1024,
        files: 1
    }
}).single('profilePicture');



// Error handling middleware
const handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res.status(400).json({
            error: 'File upload error',
            details: err.code === 'LIMIT_FILE_SIZE' ?
                'File size exceeds 80MB limit' : err.message
        });
    } else if (err) {
        // Other errors
        return res.status(400).json({
            error: 'Upload failed',
            details: err.message
        });
    }
    next();
};

module.exports = {
    inventoryUpload,
    profileUpload,
    handleUploadErrors
};