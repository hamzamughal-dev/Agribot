import os
import io

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Agribot Plant Disease API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

CLASS_LABELS = [
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
]

model = None

def load_model():
    global model
    if model is not None:
        return
    try:
        import torch
        import torch.nn as nn
        from torchvision import models

        device = torch.device("cpu")
        model = models.mobilenet_v2(weights=None)
        model.classifier[-1] = nn.Linear(1280, len(CLASS_LABELS))

        checkpoint = torch.load("mobilenet_final_3crop.pth", map_location=device)
        if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
            model.load_state_dict(checkpoint['model_state_dict'])
        else:
            model.load_state_dict(checkpoint)

        model.eval()
        print("✅ Model loaded!")
    except Exception as e:
        print(f"❌ Model load error: {e}")
        import traceback
        traceback.print_exc()


# Load model at startup so first request isn't slow
@app.on_event("startup")
async def startup_event():
    load_model()


@app.get("/")
async def root():
    return {"status": "ok", "message": "Agribot API is running 🌱"}


@app.get("/health")
async def health():
    return {"model_loaded": model is not None}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    import torch
    import numpy as np
    from PIL import Image

    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg", "image/webp"]:
        raise HTTPException(status_code=400, detail="Only JPG/PNG images are supported")

    load_model()
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded. Check server logs.")

    try:
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        image = image.resize((224, 224))

        # Convert to numpy array and normalize to [0, 1]
        image_array = np.array(image).astype(np.float32) / 255.0
        
        # Apply ImageNet normalization
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        image_array = (image_array - mean) / std
        
        # Convert to tensor (C, H, W) format
        image_tensor = torch.from_numpy(
            image_array.transpose(2, 0, 1)
        ).unsqueeze(0).float()

        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)

        predictions = probabilities.numpy()[0]
        idx = int(np.argmax(predictions))
        conf = round(float(predictions[idx]) * 100, 2)

        return {
            "disease": CLASS_LABELS[idx],
            "confidence": conf
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))