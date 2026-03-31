const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load env vars FIRST before requiring any controllers
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoute');
const openaiRoutes = require('./routes/openaiRoute');
const predictionRoutes = require('./routes/predictionRoute');
const vendorRoutes = require('./routes/vendorRoute');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/openai', openaiRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/vendors', vendorRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import axios from 'axios';
// import NodeGeocoder from 'node-geocoder';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// const SERP_API_KEY = process.env.SERP_API_KEY;
// const SERP_URL = process.env.SERP_URL;

// // Initialize geocoder (using OpenStreetMap which is free)
// const options = {
//   provider: 'openstreetmap',
// };
// const geocoder = NodeGeocoder(options);

// /**
//  * Search for vendors near a location
//  * Query params: latitude, longitude, query (search term), radius
//  */
// app.get('/api/vendors', async (req, res) => {
//   try {
//     const { latitude, longitude, query = 'vendors', radius = 15 } = req.query;

//     if (!latitude || !longitude) {
//       return res.status(400).json({
//         error: 'Missing latitude or longitude parameters'
//       });
//     }

//     if (!query || query.trim().length === 0) {
//       return res.status(400).json({
//         error: 'Query parameter is required'
//       });
//     }

//     // Reverse geocode to get city/state for better search results
//     let locationName = '';
//     try {
//       const results = await geocoder.reverse({ lat: latitude, lon: longitude });
//       if (results.length > 0) {
//         const result = results[0];
//         locationName = `${result.city || result.county || ''}, ${result.state || result.country || ''}`.trim();
//       }
//     } catch (geoError) {
//       console.warn('Geocoding error:', geoError.message);
//       // Continue without location name if geocoding fails
//     }

//     // Format coordinates for SerpApi with nearby parameter for better accuracy
//     const ll = `@${latitude},${longitude},${radius}z`;

//     const params = {
//       engine: 'google_maps',
//       q: query.trim(), // Use the custom search query from user
//       ll: ll,
//       nearby: 'true', // Force results closer to specified location
//       type: 'search',
//       num: 50, // Request up to 50 results instead of default 20
//       api_key: SERP_API_KEY
//     };

//     const response = await axios.get(SERP_URL, { params });

//     const vendors = response.data.local_results || [];

//     // Log first vendor to see structure
//     if (vendors.length > 0) {
//       console.log('=== FIRST VENDOR FULL DATA ===');
//       console.log('gps_coordinates:', vendors[0].gps_coordinates);
//       console.log('position:', vendors[0].position);
//       console.log('All keys:', Object.keys(vendors[0]));
//       console.log('=== END ===');
//     }

//     res.json({
//       success: true,
//       count: vendors.length,
//       locationName: locationName,
//       coordinates: {
//         latitude: parseFloat(latitude),
//         longitude: parseFloat(longitude)
//       },
//       rawVendor: vendors.length > 0 ? vendors[0] : null, // Send full raw vendor for debugging
//       vendors: vendors.map((vendor, idx) => {
//         // Try to extract coordinates in multiple ways
//         let lat = null;
//         let lng = null;

//         // Method 1: Direct fields
//         if (vendor.latitude) lat = vendor.latitude;
//         if (vendor.longitude) lng = vendor.longitude;

//         // Method 2: gps_coordinates object
//         if (vendor.gps_coordinates) {
//           if (vendor.gps_coordinates.latitude) lat = vendor.gps_coordinates.latitude;
//           if (vendor.gps_coordinates.longitude) lng = vendor.gps_coordinates.longitude;
//         }

//         // Method 3: position object
//         if (vendor.position) {
//           if (vendor.position.latitude) lat = vendor.position.latitude;
//           if (vendor.position.longitude) lng = vendor.position.longitude;
//         }

//         if (idx === 0) {
//           console.log(`Vendor ${idx}: title="${vendor.title}"`);
//           console.log(`  gps_coordinates:`, vendor.gps_coordinates);
//           console.log(`  Extracted lat:`, lat, `lng:`, lng);
//         }
        
//         return {
//           title: vendor.title || 'Unknown Vendor',
//           address: vendor.address || 'Address not available',
//           rating: vendor.rating,
//           review_count: vendor.reviews || vendor.review_count || 0,
//           phone: vendor.phone,
//           website: vendor.website,
//           type: vendor.type,
//           position: {
//             latitude: lat,
//             longitude: lng
//           }
//         };
//       })
//     });
//   } catch (error) {
//     console.error('Error fetching vendors:', error.message);
//     res.status(500).json({
//       error: 'Failed to fetch vendors',
//       details: error.message
//     });
//   }
// });

// /**
//  * Reverse geocode coordinates to get location name
//  * Query params: latitude, longitude
//  */
// app.get('/api/location', async (req, res) => {
//   try {
//     const { latitude, longitude } = req.query;

//     if (!latitude || !longitude) {
//       return res.status(400).json({
//         error: 'Missing latitude or longitude parameters'
//       });
//     }

//     const results = await geocoder.reverse({ lat: latitude, lon: longitude });

//     if (results.length > 0) {
//       const result = results[0];
//       const locationName = `${result.city || result.county || ''}, ${result.state || result.country || ''}`.trim();

//       res.json({
//         success: true,
//         locationName: locationName,
//         address: result.formattedAddress,
//         coordinates: {
//           latitude: parseFloat(latitude),
//           longitude: parseFloat(longitude)
//         }
//       });
//     } else {
//       res.json({
//         success: false,
//         message: 'Location not found',
//         coordinates: {
//           latitude: parseFloat(latitude),
//           longitude: parseFloat(longitude)
//         }
//       });
//     }
//   } catch (error) {
//     console.error('Error reverse geocoding:', error.message);
//     res.status(500).json({
//       error: 'Failed to reverse geocode',
//       details: error.message
//     });
//   }
// });

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.json({ status: 'ok' });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
