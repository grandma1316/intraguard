# Weapon Detection Guide

## Current Detection Capabilities

### ✅ What Works Now:
1. **Knife Detection**: The default YOLOv8n model can detect knives and will trigger alerts
2. **Baseball Bat Detection**: The default YOLOv8n model can detect baseball bats and will trigger alerts
3. **Test Gun Alerts**: Manual testing of gun alert functionality
4. **Real-time Monitoring**: Live video streaming with detection overlay

### ❌ What Doesn't Work Yet:
1. **Gun Detection**: The default model cannot detect guns, pistols, or rifles
2. **Automatic Firearm Detection**: Requires a custom-trained weapon detection model

## How to Test Weapon Detection

### 1. Test Knife Detection
- Point a knife at your camera during live streaming
- The system will detect it and trigger an alert
- Check the Detections page for logged detections
- Check Notifications for alert messages

### 2. Test Baseball Bat Detection
- Point a baseball bat at your camera during live streaming
- The system will detect it and trigger an alert
- Check the Detections page for logged detections
- Check Notifications for alert messages

### 3. Test Gun Alert System
- Go to the **GoLive** page
- Click the **"🔫 Test Gun Alert"** button
- This will simulate a gun detection and trigger:
  - A detection log entry
  - A push notification
  - An email alert (if configured)

### 4. Test Baseball Bat Alert System
- Go to the **GoLive** page
- Click the **"🏏 Test Baseball Bat Alert"** button
- This will simulate a baseball bat detection and trigger:
  - A detection log entry
  - A push notification
  - An email alert (if configured)

### 5. View Detection History
- Go to the **Detections** page to see all logged detections
- Go to the **Notifications** page to see alert history

## Getting Full Weapon Detection

To enable detection of guns, pistols, and rifles, you need:

### Option 1: Use a Pre-trained Weapon Model
1. Download a weapon detection model (e.g., from Hugging Face)
2. Replace `yolov8n.pt` with the weapon detection model
3. Update the model path in `backend/main.py`

### Option 2: Train Your Own Model
1. Collect weapon images dataset
2. Train YOLOv8 on the dataset
3. Use the trained model file

### Option 3: Use Online APIs
1. Integrate with cloud-based weapon detection APIs
2. Modify the detection logic to use external services

## Current Alert Classes
```python
ALERT_CLASSES = ["knife", "gun", "pistol", "rifle", "weapon", "baseball bat"]
```

## Testing Instructions

1. **Start the backend**: `cd backend && python main.py`
2. **Start the frontend**: `npm start`
3. **Login** with your credentials
4. **Go to GoLive page** and add a camera
5. **Test knife detection** with a real knife
6. **Test gun alerts** using the test button
7. **Test baseball bat alerts** using the test button
8. **Check results** in Detections and Notifications pages

## Troubleshooting

- **Model not loading**: Check if `yolov8n.pt` exists in the backend directory
- **No detections**: Ensure camera is properly connected and streaming
- **Alerts not working**: Check Firebase configuration and FCM tokens
- **Test button not working**: Ensure backend is running on port 5000

## Next Steps

1. **Immediate**: Test the current knife detection functionality
2. **Short-term**: Implement a proper weapon detection model
3. **Long-term**: Add more weapon types and improve accuracy 