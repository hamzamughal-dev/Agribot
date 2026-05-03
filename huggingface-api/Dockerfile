FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install PyTorch CPU-only FIRST (avoids downloading massive CUDA build)
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Copy and install remaining dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY main.py .
COPY mobilenet_final_3crop.pth .

# Fix permissions
RUN chmod 644 mobilenet_final_3crop.pth

# Expose port for Hugging Face
EXPOSE 7860

# Fixed: main.py -> main
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]