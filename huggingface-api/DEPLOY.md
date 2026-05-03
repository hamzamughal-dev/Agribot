# DEPLOY TO HUGGING FACE - QUICK STEPS

## Files Ready to Upload:
✅ Dockerfile
✅ main.py
✅ requirements.txt
✅ mobilenet_final_3crop.pth
✅ .gitattributes
✅ README.md

## Upload Instructions:

### Option 1: Git Push (Recommended)
```bash
cd d:\FYP-WEB\Agribot\huggingface-api

git init
git config user.email "your_email@example.com"
git config user.name "Your Name"
git add .
git commit -m "Initial commit - Agribot API"
git remote add origin https://huggingface.co/spaces/YOUR_USERNAME/agribot-plant-api
git push -u origin main
```

### Option 2: Web Upload
1. Go to https://huggingface.co/spaces/YOUR_USERNAME/agribot-plant-api
2. Click "Files" tab
3. Click "+ Add file" → "Upload files"
4. Select all files from this directory
5. Commit

## After Upload:
- Wait 5-15 minutes for build
- Check "Logs" tab for build status
- Once done, visit: https://YOUR_USERNAME-agribot-plant-api.hf.space/docs

## Test the API:
- Try uploading a test image
- Should return disease prediction with confidence

## Use in Your React App:
```javascript
const API_URL = 'https://YOUR_USERNAME-agribot-plant-api.hf.space';

const response = await fetch(`${API_URL}/predict`, {
  method: 'POST',
  body: formData
});
```

---
Everything is configured and ready to go! 🚀
