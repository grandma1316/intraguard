from firebase_admin import db
from datetime import datetime
import time

def add_user(userId: str, name: str, email: str, role: str):
    """ Adds a new user to Firebase Realtime Database. """
    users_ref = db.reference("/Users")

    # Generate current timestamp
    timestamp = int(time.time())  # Unix format
    formatted_date = datetime.utcfromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')

    users_ref.child(userId).set({
        "name": name,
        "email": email,
        "role": role,
        "createdAt": formatted_date,
        "fcmTokens": {}  # Empty dictionary for storing device tokens
    })

def store_fcm_token(userId: str, deviceId: str, fcmToken: str):
    """ Stores or updates an FCM token for a user. """
    users_ref = db.reference(f"/Users/{userId}/fcmTokens")

    users_ref.child(deviceId).set(fcmToken)  # Store FCM token for the device

def get_user_fcm_tokens(userId: str):
    """ Retrieves all FCM tokens for a given user. """
    users_ref = db.reference(f"/Users/{userId}/fcmTokens")

    tokens = users_ref.get()
    return tokens if tokens else {}

def remove_fcm_token(userId: str, deviceId: str):
    """ Removes a specific FCM token when a user logs out or stops using a device. """
    users_ref = db.reference(f"/Users/{userId}/fcmTokens/{deviceId}")
    users_ref.delete()

def log_detection(detection_id: str ,object_class: str):
    """Logs a detected object with timestamp and class into Firebase."""
    timestamp = int(time.time())  # Unix format
    formatted_date = datetime.utcfromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')

    detection_ref = db.reference("/Detections")

    detection_ref.child(detection_id).set({
        "timestamp": formatted_date,
        "object_class": object_class
    })

    