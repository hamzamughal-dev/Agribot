const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

/**
 * GET /api/vendors
 * Search for vendors near a location
 * Query params: latitude, longitude, query (search term), radius
 */
router.get('/', vendorController.searchVendors);

module.exports = router;
