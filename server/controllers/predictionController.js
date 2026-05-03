const axios = require('axios');
const FormData = require('form-data');
const Prediction = require('../models/predictionModel');

// Disease info for UI
const diseaseInfo = {
  'Apple___Apple_scab': {
    disease: 'Apple Scab',
    description: 'Fungal disease causing dark, scabby lesions on leaves and fruit.',
    severity: 'Moderate',
    symptoms: ['Dark olive-green spots on leaves', 'Scabby lesions on fruit', 'Premature leaf drop'],
    treatments: ['Apply fungicide sprays', 'Remove infected leaves', 'Improve air circulation', 'Prune affected branches'],
    pesticides: ['Captan', 'Mancozeb', 'Sulfur-based fungicides']
  },
  'Apple___Black_rot': {
    disease: 'Apple Black Rot',
    description: 'Fungal infection causing rotting of fruit and leaf spots.',
    severity: 'Severe',
    symptoms: ['Purple spots on leaves', 'Rotting fruit with concentric rings', 'Cankers on branches'],
    treatments: ['Remove infected fruit and branches', 'Apply fungicides', 'Maintain tree health'],
    pesticides: ['Captan', 'Thiophanate-methyl', 'Copper-based fungicides']
  },
  'Apple___Cedar_apple_rust': {
    disease: 'Cedar Apple Rust',
    description: 'Fungal disease causing yellow-orange spots on leaves.',
    severity: 'Moderate',
    symptoms: ['Yellow-orange spots on upper leaf surface', 'Tube-like structures on underside', 'Premature defoliation'],
    treatments: ['Remove nearby cedar trees', 'Apply fungicides in spring', 'Collect and destroy infected leaves'],
    pesticides: ['Myclobutanil', 'Mancozeb', 'Sulfur sprays']
  },
  'Apple___healthy': {
    disease: 'Healthy Apple Plant',
    description: 'Plant appears healthy with no visible disease symptoms.',
    severity: 'None',
    symptoms: ['Green healthy foliage', 'No spots or discoloration'],
    treatments: ['Continue regular care', 'Monitor for changes', 'Maintain proper watering and fertilization'],
    pesticides: []
  },
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {
    disease: 'Corn Cercospora Leaf Spot (Gray Leaf Spot)',
    description: 'Gray leaf spot fungal disease affecting corn.',
    severity: 'Moderate',
    symptoms: ['Gray to tan rectangular lesions', 'Lesions parallel to leaf veins', 'Yellowing of leaves'],
    treatments: ['Crop rotation', 'Apply fungicides', 'Use resistant varieties', 'Remove crop debris'],
    pesticides: ['Azoxystrobin', 'Propiconazole', 'Pyraclostrobin']
  },
  'Corn_(maize)___Common_rust_': {
    disease: 'Corn Common Rust',
    description: 'Fungal disease causing rust-colored pustules on leaves.',
    severity: 'Moderate',
    symptoms: ['Circular to elongated rust-colored pustules', 'Yellowing of leaves', 'Reduced yield'],
    treatments: ['Plant resistant hybrids', 'Apply fungicides if severe', 'Monitor environmental conditions'],
    pesticides: ['Azoxystrobin', 'Propiconazole', 'Triazole fungicides']
  },
  'Corn_(maize)___Northern_Leaf_Blight': {
    disease: 'Corn Northern Leaf Blight',
    description: 'Fungal disease causing long grayish-green lesions on corn leaves.',
    severity: 'Severe',
    symptoms: ['Long cigar-shaped lesions', 'Gray-green to tan coloration', 'Extensive leaf damage'],
    treatments: ['Plant resistant varieties', 'Crop rotation', 'Apply fungicides', 'Timely planting'],
    pesticides: ['Azoxystrobin', 'Propiconazole', 'Strobilurin fungicides']
  },
  'Corn_(maize)___healthy': {
    disease: 'Healthy Corn Plant',
    description: 'Corn plant shows no signs of disease.',
    severity: 'None',
    symptoms: ['Dark green healthy leaves', 'No lesions or spots'],
    treatments: ['Continue normal care', 'Proper fertilization', 'Adequate irrigation'],
    pesticides: []
  },
  'Grape___Black_rot': {
    disease: 'Grape Black Rot',
    description: 'Fungal disease causing fruit rot and leaf spots.',
    severity: 'Severe',
    symptoms: ['Circular brown spots on leaves', 'Fruit turns black and mummifies', 'Sunken lesions'],
    treatments: ['Remove mummified fruit', 'Apply fungicides', 'Prune for air circulation', 'Destroy infected debris'],
    pesticides: ['Mancozeb', 'Captan', 'Myclobutanil']
  },
  'Grape___Esca_(Black_Measles)': {
    disease: 'Grape Esca (Black Measles)',
    description: 'Complex fungal disease affecting grape vines.',
    severity: 'Severe',
    symptoms: ['Tiger-stripe pattern on leaves', 'Black spots on berries', 'Sudden vine dieback'],
    treatments: ['Prune dead wood', 'Maintain vine health', 'Remove infected plants', 'No effective chemical treatment'],
    pesticides: ['Limited effectiveness - focus on prevention']
  },
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
    disease: 'Grape Leaf Blight',
    description: 'Fungal disease causing angular brown spots on grape leaves.',
    severity: 'Moderate',
    symptoms: ['Angular brown spots', 'Yellowing around lesions', 'Premature defoliation'],
    treatments: ['Remove infected leaves', 'Apply fungicides', 'Improve air circulation', 'Reduce humidity'],
    pesticides: ['Copper-based fungicides', 'Mancozeb', 'Chlorothalonil']
  },
  'Grape___healthy': {
    disease: 'Healthy Grape Plant',
    description: 'Grape vine is healthy with no disease symptoms.',
    severity: 'None',
    symptoms: ['Vibrant green leaves', 'No spotting or discoloration'],
    treatments: ['Regular pruning', 'Proper fertilization', 'Monitor for pests'],
    pesticides: []
  }
};

// Predict disease using Hugging Face API
exports.predictDisease = async (req, res) => {
  try {
    console.log('=== PREDICT ENDPOINT CALLED ===');
    console.log('Authenticated user:', req.user ? req.user._id : 'NO USER');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const hfAPIURL = process.env.HUGGINGFACE_API_URL;
    if (!hfAPIURL) {
      return res.status(500).json({
        success: false,
        message: 'HuggingFace API URL not configured'
      });
    }

    // Create FormData to send to HF API
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Call HuggingFace API
    console.log('🔄 Calling HuggingFace API:', hfAPIURL);
    const hfResponse = await axios.post(`${hfAPIURL}/predict`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000
    });

    const { disease: diseaseName, confidence } = hfResponse.data;
    
    // Get disease info from local database
    const diseaseDetails = diseaseInfo[diseaseName] || {
      disease: diseaseName.replace(/_/g, ' '),
      description: 'Disease information not available',
      severity: 'Unknown',
      symptoms: [],
      treatments: [],
      pesticides: []
    };

    const response = {
      disease: diseaseDetails.disease,
      confidence: confidence,
      severity: diseaseDetails.severity,
      description: diseaseDetails.description,
      symptoms: diseaseDetails.symptoms,
      treatments: diseaseDetails.treatments,
      pesticides: diseaseDetails.pesticides
    };

    // Save prediction to database if user is authenticated
    if (req.user && req.user._id) {
      try {
        const confidenceValue = Math.max(0, Math.min(100, confidence));
        console.log('📸 Saving prediction for user:', req.user._id);
        const savedPrediction = await Prediction.create({
          userId: req.user._id,
          disease: diseaseDetails.disease,
          confidence: confidenceValue,
          severity: diseaseDetails.severity
        });
        console.log('✅ Prediction saved successfully:', savedPrediction._id);
      } catch (dbError) {
        console.error('❌ Error saving prediction:', dbError.message);
      }
    }

    res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Prediction error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error processing image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get model info
exports.getModelInfo = async (req, res) => {
  try {
    const classLabels = [
      'Apple___Apple_scab',
      'Apple___Black_rot', 
      'Apple___Cedar_apple_rust', 
      'Apple___healthy', 
      'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 
      'Corn_(maize)___Common_rust_', 
      'Corn_(maize)___Northern_Leaf_Blight', 
      'Corn_(maize)___healthy', 
      'Grape___Black_rot', 
      'Grape___Esca_(Black_Measles)', 
      'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 
      'Grape___healthy'
    ];

    const supportedClasses = classLabels.map(key => ({
      class: key,
      disease: diseaseInfo[key]?.disease || key
    }));

    res.status(200).json({
      success: true,
      data: {
        modelName: 'MobileNet Plant Disease Classifier',
        inputSize: '224x224',
        totalClasses: supportedClasses.length,
        supportedClasses: supportedClasses
      }
    });
  } catch (error) {
    console.error('Error getting model info:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving model information',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get scans count for today
exports.getScansTodayCount = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Get start and end of today in UTC
    const now = new Date();
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const endOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

    console.log('🔍 Counting scans for user:', req.user._id);
    console.log('📅 Date range:', startOfToday, 'to', endOfToday);

    // Count predictions made today by this user
    const count = await Prediction.countDocuments({
      userId: req.user._id,
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday
      }
    });

    console.log('📊 Scans found:', count);

    res.status(200).json({
      success: true,
      data: { scansToday: count }
    });
  } catch (error) {
    console.error('Error getting scans count:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting scans count',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
