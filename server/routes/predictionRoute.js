const express = require('express');
const multer = require('multer');
const { predictDisease, getModelInfo, getScansTodayCount } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Routes
router.post('/predict', protect, upload.single('image'), predictDisease);
router.get('/model-info', getModelInfo);
router.get('/scans-today', protect, getScansTodayCount);

module.exports = router;
