# Agribot Plant Disease API

A FastAPI-based REST API for plant disease detection using deep learning models. Deploy on Hugging Face, AWS, or any server.

## 🚀 Quick Start

### Installation

```bash
pip install -r requirements.txt
```

### Run Locally

```bash
python main.py
```

Server runs at: `http://localhost:8000`

## 📡 API Endpoints

### 1. Health Check
```
GET /
GET /health
```

Response:
```json
{
  "status": "healthy",
  "model": "loaded"
}
```

### 2. Predict Disease (Main Endpoint)
```
POST /predict
Content-Type: multipart/form-data

Body: form data with "file" field containing image
```

**Example with cURL:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@leaf_image.jpg"
```

**Response:**
```json
{
  "success": true,
  "prediction": {
    "disease_class": "Apple___Apple_scab",
    "disease_name": "Apple Scab",
    "confidence": 0.9543,
    "confidence_percentage": 95.43
  },
  "disease_info": {
    "description": "Fungal disease causing dark, scabby lesions on leaves and fruit.",
    "severity": "Moderate",
    "treatments": [
      "Apply fungicide sprays",
      "Remove infected leaves",
      "Improve air circulation"
    ],
    "pesticides": ["Captan", "Mancozeb", "Sulfur-based fungicides"]
  },
  "all_predictions": [
    {
      "class": "Apple___Apple_scab",
      "confidence": 0.9543,
      "percentage": 95.43
    },
    // ... other predictions
  ]
}
```

### 3. Get All Disease Classes
```
GET /classes
```

Response:
```json
{
  "classes": ["Apple___Apple_scab", "Apple___Black_rot", ...],
  "count": 12
}
```

### 4. Get Disease Information
```
GET /disease/{disease_class}
```

Example:
```
GET /disease/Apple___Apple_scab
```

Response:
```json
{
  "class": "Apple___Apple_scab",
  "info": {
    "disease": "Apple Scab",
    "description": "Fungal disease...",
    "severity": "Moderate",
    "treatments": [...],
    "pesticides": [...]
  }
}
```

## 💻 Use in Your Project

### React Frontend

```javascript
// Upload and predict
const predictDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch('http://localhost:8000/predict', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  return result;
};

// Usage
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  const prediction = await predictDisease(file);
  console.log(prediction);
};
```

### Node.js Backend

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function predictDisease(imagePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(imagePath));

  const response = await axios.post(
    'http://localhost:8000/predict',
    form,
    { headers: form.getHeaders() }
  );

  return response.data;
}

// Usage
predictDisease('./leaf.jpg').then(result => {
  console.log(result);
});
```

### Python Backend

```python
import requests

def predict_disease(image_path):
    with open(image_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(
            'http://localhost:8000/predict',
            files=files
        )
    return response.json()

# Usage
result = predict_disease('leaf.jpg')
print(result)
```

## 📁 Project Structure

```
huggingface-api/
├── main.py                          # FastAPI application
├── requirements.txt                 # Python dependencies
├── mobilenet_final_3crop.pth        # Model file (copy here)
└── README.md                        # This file
```

## 🚀 Deploy on Hugging Face Spaces

1. Go to https://huggingface.co/spaces
2. Create new Space → Select "Docker" SDK
3. Create these files in your Space:
   - `Dockerfile`
   - `main.py`
   - `requirements.txt`
   - `mobilenet_final_3crop.pth`

### Dockerfile

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .
COPY mobilenet_final_3crop.pth .

EXPOSE 8000

CMD ["python", "main.py"]
```

4. Push to your Space
5. Your API will be at: `https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME`

## 🔧 Configuration

- **Host**: `0.0.0.0` (accessible from anywhere)
- **Port**: `8000`
- **CORS**: Enabled for all origins (modify for production)

## 📊 Model Information

- **Type**: MobileNetV2 (PyTorch)
- **Input**: 224x224 RGB images
- **Output**: 12 disease class predictions
- **Normalization**: ImageNet standard

## 🎯 Supported Diseases

**Apple**: Apple Scab, Black Rot, Cedar Apple Rust, Healthy
**Corn**: Cercospora Leaf Spot, Common Rust, Northern Leaf Blight, Healthy
**Grape**: Black Rot, Esca, Leaf Blight, Healthy

## 📝 Notes

- GPU support: Automatically uses CUDA if available
- No GPU: Falls back to CPU
- Model loading time: ~2-3 seconds on first request
- Inference time: ~100-200ms per image

## 🆘 Troubleshooting

**Model not found:**
```
FileNotFoundError: Model file not found: mobilenet_final_3crop.pth
```
→ Copy the model file to the same directory as `main.py`

**Port already in use:**
```
Address already in use
```
→ Change port in `main.py` or kill existing process

**CORS errors:**
→ CORS is enabled for all origins. For production, modify `allow_origins` in `main.py`

## 📄 License

Part of the Agribot project.

---

**Built for seamless ML integration** 🌱
