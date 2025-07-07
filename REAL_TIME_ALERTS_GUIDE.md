# Real-Time Alert Management System

## 🔄 Complete Alert Flow

### 1. **Detection Phase**
```
Camera Feed → YOLO Model → Object Detection → Alert Classification
```

**Process:**
- **Video Stream**: Real-time camera feed (30 FPS)
- **YOLO Processing**: Each frame analyzed by YOLOv8n model
- **Object Detection**: Bounding boxes drawn around detected objects
- **Alert Check**: Objects compared against `ALERT_CLASSES`

**Alert Classes:**
```python
ALERT_CLASSES = ["knife", "gun", "pistol", "rifle", "weapon", "baseball bat"]
```

### 2. **Alert Triggering Logic**
```
Detection → 3-Second Hold → Single Alert → Reset
```

**Smart Alert System:**
- **3-Second Hold**: Alert must persist for 3 seconds before triggering
- **Single Alert**: Only one alert per detection session (prevents spam)
- **Auto Reset**: Alert resets when weapon is no longer detected

**Code Logic:**
```python
if any_alert:
    if alert_start_time is None:
        alert_start_time = now  # Start timing
    elif (now - alert_start_time) >= 3 and not alert_triggered:
        # Fire alert after 3 seconds
        trigger_alert()
        alert_triggered = True
else:
    # Reset when no alert detected
    alert_start_time = None
    alert_triggered = False
```

### 3. **Alert Processing Pipeline**

#### **Step 1: Log Detection**
```
POST /log-detection
{
    "object_class": "knife",
    "user_id": "user123"
}
```

#### **Step 2: Database Storage**
```json
{
    "detection_id": "uuid-123",
    "userId": "user123",
    "object_class": "knife",
    "timestamp": "2025-07-05 17:30:45"
}
```

#### **Step 3: Push Notification**
```
Firebase Cloud Messaging (FCM) → User Devices
```

### 4. **Notification Delivery System**

#### **FCM Token Management:**
- **Registration**: User devices register for notifications
- **Storage**: FCM tokens stored in Firebase Database
- **Multiple Devices**: Each user can have multiple devices

**Token Storage:**
```json
{
    "Users": {
        "user123": {
            "fcmTokens": {
                "device1": "fcm_token_abc123",
                "device2": "fcm_token_def456"
            }
        }
    }
}
```

#### **Notification Types:**

**1. Push Notifications (Primary)**
- **Title**: "⚠️ Weapon Detected!"
- **Body**: "A KNIFE was detected on camera."
- **Delivery**: Instant to all user devices
- **Platform**: Works on web, mobile, desktop

**2. In-App Notifications**
- **Storage**: Firebase Realtime Database
- **Access**: Via Notifications page
- **History**: Persistent notification log

**3. Email Notifications (Limited)**
- **Purpose**: User registration confirmation only
- **Weapon Alerts**: No email alerts (by design)

### 5. **Frontend Notification Handling**

#### **Service Worker (Background):**
```javascript
// firebase-messaging-sw.js
messaging.onBackgroundMessage(function(payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
```

#### **Foreground Messages:**
```javascript
// React component
onMessage(messaging, (payload) => {
    // Handle foreground notifications
    showInAppNotification(payload);
});
```

### 6. **Alert Management Features**

#### **Real-Time Updates:**
- **Live Detection**: Instant weapon recognition
- **Visual Feedback**: Bounding boxes on video stream
- **Confidence Display**: Detection confidence scores

#### **Alert History:**
- **Detection Log**: All detections stored with timestamps
- **User Filtering**: Each user sees only their detections
- **Search/Filter**: By date, weapon type, camera

#### **Notification Management:**
- **Read/Unread**: Track notification status
- **Dismiss**: Mark notifications as read
- **Archive**: Historical notification storage

### 7. **System Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Camera Feed   │───▶│   YOLO Model    │───▶│ Alert Detection │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  FCM Tokens     │◀───│  Firebase DB    │◀───│  Log Detection  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Push Notifications │    │  In-App Alerts  │    │  Detection Log  │
│ (All Devices)    │    │ (Notifications) │    │ (Detections)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 8. **Alert Configuration**

#### **Alert Classes:**
```python
# Weapons that trigger alerts
ALERT_CLASSES = ["knife", "gun", "pistol", "rifle", "weapon", "baseball bat"]

# Weapons the model can actually detect
DETECTABLE_CLASSES = ["knife", "baseball bat"]
```

#### **Alert Timing:**
- **Hold Duration**: 3 seconds (configurable)
- **Cooldown**: Single alert per detection session
- **Reset**: Automatic when weapon no longer detected

#### **Notification Settings:**
- **Immediate**: Push notifications sent instantly
- **Persistent**: Stored in database for history
- **Multi-device**: Sent to all user devices

### 9. **Testing & Debugging**

#### **Test Endpoints:**
```bash
# Test gun alert
POST /test-gun-alert/{user_id}

# Test baseball bat alert  
POST /test-baseball-bat-alert/{user_id}
```

#### **Monitoring:**
- **Console Logs**: Backend prints alert events
- **Database**: Check Firebase for detections
- **FCM Status**: Delivery confirmation logs

### 10. **Performance & Reliability**

#### **Optimizations:**
- **Frame Rate**: 30 FPS processing
- **Model Efficiency**: YOLOv8n for speed
- **Alert Throttling**: Prevents notification spam
- **Error Handling**: Graceful failure recovery

#### **Reliability Features:**
- **Token Validation**: Verify FCM tokens before sending
- **Retry Logic**: Failed notifications retried
- **Fallback**: Database storage if FCM fails
- **Monitoring**: Track delivery success rates

## 🎯 Key Benefits

1. **Real-Time**: Instant weapon detection and alerts
2. **Smart**: 3-second hold prevents false positives
3. **Multi-Platform**: Works on web, mobile, desktop
4. **Persistent**: Complete detection and notification history
5. **Scalable**: Supports multiple users and devices
6. **Reliable**: Robust error handling and fallbacks 