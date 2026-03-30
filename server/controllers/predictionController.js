const ort = require('onnxruntime-node');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const Prediction = require('../models/predictionModel');

// Load the ONNX model
let session = null;
const modelPath = path.join(__dirname, '../assets/mobilenet_leaf.onnx');

const classLabels = ['Apple___Apple_scab',
    'Apple___Black_rot', 
    'Apple___Cedar_apple_rust', 
    'Apple___healthy', 
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 
    'Corn_(maize)___Common_rust_', 
    'Corn_(maize)___Northern_Leaf_Blight', 
    'Corn_(maize)___healthy', 'Grape___Black_rot', 
    'Grape___Esca_(Black_Measles)', 
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 
    'Grape___healthy'
];

// Disease classes and their information (only for the 12 classes the model supports)
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

// Initialize the ONNX session
async function initializeModel() {
  try {
    if (!session) {
      session = await ort.InferenceSession.create(modelPath);
      console.log('ONNX model loaded successfully');
    }
  } catch (error) {
    console.error('Error loading ONNX model:', error);
    throw new Error('Failed to load ONNX model');
  }
}

// Preprocess image for the model
async function preprocessImage(imageBuffer) {
  try {
    // Resize image to 224x224 (standard input size for MobileNet)
    const processedImage = await sharp(imageBuffer)
      .resize(224, 224)
      .removeAlpha()
      .raw()
      .toBuffer();

    // ImageNet normalization parameters (same as training)
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];

    // Reshape to [1, 3, 224, 224] (NCHW format) and apply normalization
    const rgbData = new Float32Array(1 * 3 * 224 * 224);
    
    for (let c = 0; c < 3; c++) {
      for (let h = 0; h < 224; h++) {
        for (let w = 0; w < 224; w++) {
          // Get pixel value for this channel
          const pixelValue = processedImage[(h * 224 + w) * 3 + c];
          
          // Normalize: (pixel/255.0 - mean) / std
          const normalized = (pixelValue / 255.0 - mean[c]) / std[c];
          
          // Store in NCHW format
          rgbData[c * 224 * 224 + h * 224 + w] = normalized;
        }
      }
    }

    return rgbData;
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw new Error('Failed to preprocess image');
  }
}

// Predict disease from image
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

    // Initialize model if not already loaded
    await initializeModel();

    // Preprocess the image
    const imageData = await preprocessImage(req.file.buffer);

    // Create input tensor
    const inputTensor = new ort.Tensor('float32', imageData, [1, 3, 224, 224]);

    // Run inference
    const feeds = { input: inputTensor };
    const results = await session.run(feeds);

    // Get output tensor
    const outputTensor = results[Object.keys(results)[0]];
    const rawPredictions = Array.from(outputTensor.data);

    // Apply softmax to convert logits to probabilities
    const max = Math.max(...rawPredictions);
    const exp = rawPredictions.map(x => Math.exp(x - max));
    const sumExp = exp.reduce((a, b) => a + b, 0);
    const softmaxPredictions = exp.map(x => x / sumExp);

    // Find top 3 predictions using the fixed class labels array
    const predictionsArray = Array.from(softmaxPredictions).map((prob, index) => ({
      class: classLabels[index] || `Class_${index}`,
      confidence: Math.round(prob * 100 * 100) / 100 // Round to 2 decimal places and convert to percentage
    }));

    predictionsArray.sort((a, b) => b.confidence - a.confidence);
    const topPredictions = predictionsArray.slice(0, 3);

    // Get detailed information for top prediction
    const topClass = topPredictions[0].class;
    const diseaseDetails = diseaseInfo[topClass] || {
      disease: topClass.replace(/_/g, ' '),
      description: 'Disease information not available',
      severity: 'Unknown',
      symptoms: [],
      treatments: [],
      pesticides: []
    };

    const response = {
      disease: diseaseDetails.disease,
      confidence: topPredictions[0].confidence,
      severity: diseaseDetails.severity,
      description: diseaseDetails.description,
      symptoms: diseaseDetails.symptoms,
      treatments: diseaseDetails.treatments,
      pesticides: diseaseDetails.pesticides,
      alternativePredictions: topPredictions.slice(1).map(pred => ({
        disease: diseaseInfo[pred.class]?.disease || pred.class,
        confidence: pred.confidence
      }))
    };

    // Save prediction to database if user is authenticated
    if (req.user && req.user._id) {
      try {
        const confidence = Math.max(0, Math.min(100, topPredictions[0].confidence));
        console.log('📸 Saving prediction for user:', req.user._id);
        console.log('   Confidence value (clamped):', confidence);
        const savedPrediction = await Prediction.create({
          userId: req.user._id,
          disease: diseaseDetails.disease,
          confidence: confidence,
          severity: diseaseDetails.severity
        });
        console.log('✅ Prediction saved successfully:', savedPrediction._id);
      } catch (dbError) {
        console.error('❌ Error saving prediction:', dbError.message);
      }
    } else {
      console.log('⚠️ No user found - req.user:', req.user);
    }

    res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Prediction error:', error);
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
    await initializeModel();
    
    const supportedClasses = classLabels.map(key => ({
      class: key,
      disease: diseaseInfo[key].disease
    }));

    res.status(200).json({
      success: true,
      data: {
        modelName: 'MobileNet Leaf Disease Classifier',
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

    // Debug: Show all predictions for this user
    const allPredictions = await Prediction.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(5);
    console.log('🗂️ Last 5 predictions for user:', allPredictions);

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
