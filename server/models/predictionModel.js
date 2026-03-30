const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    disease: {
        type: String,
        required: true
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    severity: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying
predictionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);
