# # from flask import Flask, jsonify, request, Response
# from flask import Flask, jsonify, request, render_template, Response
# import firebase_admin
# from firebase_admin import credentials, auth, db
# from flask_mail import Mail, Message
# from flask_cors import CORS
# import cv2
# from ultralytics import YOLO

# # Initialize Firebase
# cred = credentials.Certificate(r"integraguard-525e3-firebase-adminsdk-fbsvc-179e907131.json")
# firebase_admin.initialize_app(cred, {
#     'databaseURL': 'https://integraguard-525e3-default-rtdb.firebaseio.com/'
# })
# # firebase_admin.initialize_app(cred)

# app = Flask(__name__)
# CORS(app)  # Enable CORS for frontend requests

# # Flask-Mail Configuration
# app.config['MAIL_SERVER'] = 'smtp.gmail.com'
# app.config['MAIL_PORT'] = 465
# app.config['MAIL_USE_SSL'] = True
# app.config['MAIL_USERNAME'] = 'mrazaiqbal2002@gmail.com'  # Your email
# app.config['MAIL_PASSWORD'] = 'lnmvcoirjwcqxbkd'  # Your email password or app password
# app.config['MAIL_DEFAULT_SENDER'] = 'mrazaiqbal2002@gmail.com'

# mail = Mail(app)

# # Load YOLOv8 model
# model = YOLO(r'C:\Users\dell\OneDrive\Desktop\New folder (3)\Weapons-and-Knives-Detector-with-YOLOv8\runs\detect\Normal_Compressed\weights\best.pt')

# # Open video source (0 for webcam, or path to video file)
# cap = cv2.VideoCapture(0)

# @app.route('/')
# def home():
#     return "Flask backend with Firebase & YOLOv8 is running!"



# # Firebase Authentication Routes
# @app.route("/get-users", methods=["GET"])
# def get_users():
#     users = auth.list_users().iterate_all()
#     user_list = [{"uid": user.uid, "email": user.email} for user in users]
#     return jsonify(user_list)

# @app.route("/add-user", methods=["POST"])
# def add_user():
#     data = request.json
#     email = data.get("email")
#     password = data.get("password")

#     if not email or not password:
#         return jsonify({"error": "Email and password are required"}), 400

#     try:
#         user = auth.create_user(email=email, password=password)
#         send_confirmation_email(email)

#         return jsonify({"message": "User added successfully", "uid": user.uid})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400
    

    
# def send_confirmation_email(email):
#     confirmation_url = f"http://192.168.10.8:5000/confirm-email?email={email}"
#     msg = Message("Confirm your email", recipients=[email])
#     msg.body = f"Click the button below to confirm your email and register your device.\n\n {confirmation_url}"
#     try:
#         mail.send(msg)
#         print("Email sent successfully!")
#     except Exception as e:
#         print("Error sending email:", e)


# @app.route("/confirm-email", methods=["GET"])
# def confirm_email():
#     email = request.args.get("email")
#     if not email:
#         return "Invalid request", 400

#     return render_template("confirm.html", email=email)

# @app.route("/store-fcm-token", methods=["POST"])
# def store_fcm_token():
#     data = request.json
#     email = data.get("email")
#     fcm_token = data.get("fcm_token")

#     if not email or not fcm_token:
#         return jsonify({"error": "Email and FCM token are required"}), 400

#     try:
#         user_ref = db.reference("/Users").order_by_child("email").equal_to(email).get()

#         if not user_ref:
#             return jsonify({"error": "User not found"}), 404

#         user_id = list(user_ref.keys())[0]  # Get user ID from Firebase
#         db.reference(f"/Users/{user_id}").update({"fcm_token": fcm_token})

#         return jsonify({"message": "FCM token stored successfully"})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500



# @app.route("/delete-user", methods=["POST"])
# def delete_user():
#     data = request.json
#     user_id = data.get("uid")

#     try:
#         auth.delete_user(user_id)
#         return jsonify({"message": "User deleted successfully"})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400

# # YOLOv8 Video Streaming
# def generate_frames():
#     while cap.isOpened():
#         success, frame = cap.read()
#         if not success:
#             break
        
#         # Perform object detection
#         results = model(frame)

#         # Draw bounding boxes
#         for result in results:
#             for box in result.boxes:
#                 x1, y1, x2, y2 = map(int, box.xyxy[0])  # Bounding box coordinates
#                 label = model.names[int(box.cls[0])]  # Object class
#                 conf = box.conf[0].item()  # Confidence score

#                 # Draw bounding box and label
#                 cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
#                 cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1 - 10), 
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

#         # Encode frame as JPEG
#         _, buffer = cv2.imencode('.jpg', frame)
#         frame_bytes = buffer.tobytes()

#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

# @app.route('/video_feed')
# def video_feed():
#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')



# if __name__ == '__main__':
#     app.run(host="0.0.0.0", port=5000, debug=True)

#         # app.run(debug=True)



from flask import Flask, jsonify, request, render_template, Response, send_from_directory
import firebase_admin
from firebase_admin import credentials, auth, db, messaging
from flask_mail import Mail, Message
from flask_cors import CORS
import cv2
from ultralytics import YOLO
import os
# import datetime
import uuid
# import time
from datetime import datetime
import time
import requests


# Initialize Firebase
try:
    cred = credentials.Certificate("integraguard-525e3-firebase-adminsdk-fbsvc-179e907131.json")
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://integraguard-525e3-default-rtdb.firebaseio.com/'
    })
    print("✅ Firebase initialized successfully")
except Exception as e:
    print(f"❌ Firebase initialization failed: {e}")
    print("Please check your service account key file")
    exit(1)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests
# CORS(app, resources={r"/api/*": {"origins": "*"}})


# Flask-Mail Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'mrazaiqbal2002@gmail.com'  # Your email
app.config['MAIL_PASSWORD'] = 'lnmvcoirjwcqxbkd'  # Your email password or app password
app.config['MAIL_DEFAULT_SENDER'] = 'mrazaiqbal2002@gmail.com'

mail = Mail(app)

# Load YOLOv8 model
try:
    # Try to load the weapon detection model from the backend directory
    model = YOLO('yolov8n.pt')  # Use the model file in the backend directory
    print("✅ YOLO model loaded successfully")
except Exception as e:
    print(f"⚠️ Warning: Could not load YOLO model: {e}")
    print("📝 Model loading failed, detection will be disabled...")
    model = None

# Open video source (0 for webcam, or path to video file)
# cap = cv2.VideoCapture(0)



@app.route('/')
def home():
    return "Flask backend with Firebase & YOLOv8 is running!"

@app.route('/test-users')
def test_users():
    """Simple test endpoint to check if backend is working"""
    return jsonify({
        "message": "Backend is working!",
        "status": "Firebase connection needs to be fixed",
        "timestamp": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    })

# ----------------- 🔹 Firebase Authentication Routes -----------------
# @app.route("/get-users", methods=["GET"])
# def get_users():
#     users = auth.list_users().iterate_all()
#     user_list = [{"uid": user.uid, "email": user.email} for user in users]
#     return jsonify(user_list)
@app.route("/get-users", methods=["GET"])
def get_users():
    users = auth.list_users().iterate_all()
    out = []
    for u in users:
        # pull extra data from DB
        snap = db.reference(f"/Users/{u.uid}").get() or {}
        out.append({
            "uid":   u.uid,
            "name":  snap.get("name", ""),
            "email": snap.get("email", ""),
            "city":  snap.get("city", "")
        })
    return jsonify(out)


@app.route('/firebase-messaging-sw.js')
def service_worker():
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    return send_from_directory(project_root, 'firebase-messaging-sw.js', mimetype='application/javascript')

@app.route("/add-user", methods=["POST"])
def add_user():
    data = request.json
    email = data.get("email")
    name = data.get("name")
    city = data.get("city")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        # Create a new user in Firebase Authentication
        user = auth.create_user(email=email, password=password)

        # Store user details in Firebase Realtime Database
        user_ref = db.reference("/Users")
        user_ref.child(user.uid).set({
            "email": email,
            "name": name,  
            "city": city,  
            "createdAt": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
            "fcmTokens": {}  # Empty FCM token field initially
        })

        send_confirmation_email(email)

        return jsonify({"message": "User added successfully and confirmation email has been sent", "uid": user.uid})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# @app.route("/add-user", methods=["POST"])
# def add_user():
#     data = request.json
#     email = data.get("email")
#     password = data.get("password")

#     if not email or not password:
#         return jsonify({"error": "Email and password are required"}), 400

#     try:
#         user = auth.create_user(email=email, password=password)
#         send_confirmation_email(email)

#         return jsonify({"message": "User added successfully. Confirmation email sent!", "uid": user.uid})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400
    

# ----------------- 🔹 Email Confirmation -----------------
def send_confirmation_email(email):
    # confirmation_url = f"https://1ffb-202-163-119-82.ngrok-free.app/confirm-email?email={email}"
    url = f"https://b529-202-163-119-82.ngrok-free.app/confirm-email?email={email}"

    # url = open("ngrok url.txt", "r").read()
    # confirmation_url = f"{url}/confirm-email?email={email}"
    print("CONFIRMATION URL:", url)
    
    msg = Message("Confirm Your Email", recipients=[email])
    msg.html = f"""
    <h2>Email Confirmation</h2>
    <p>Click the button below to confirm your email and register your device.</p>
    <a href="{url}" style="background-color: #008CBA; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 5px;">
        Confirm Email
    </a>
    <p>If you didn't request this, please ignore this email.</p>
    """

    try:
        mail.send(msg)
        print("✅ Email sent successfully!")
    except Exception as e:
        print("❌ Error sending email:", e)

@app.route("/confirm-email", methods=["GET"])
def confirm_email():
    email = request.args.get("email")
    if not email:
        return "Invalid request", 400

    return render_template("confirm.html", email=email)

# ----------------- 🔹 Store FCM Token -----------------
@app.route("/store-fcm-token", methods=["POST"])
def store_fcm_token():
    data = request.json
    email = data.get("email")
    fcm_token = data.get("fcm_token")

    if not email or not fcm_token:
        return jsonify({"error": "Email and FCM token are required"}), 400

    try:
        user_ref = db.reference("/Users").order_by_child("email").equal_to(email).get()

        if not user_ref:
            return jsonify({"error": "User not found"}), 404

        user_id = list(user_ref.keys())[0]  # Get user ID from Firebase
        db.reference(f"/Users/{user_id}/fcmTokens").push(fcm_token)  # Store multiple tokens

        return jsonify({"message": "FCM token stored successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------- 🔹 Delete User -----------------
@app.route("/delete-user", methods=["POST"])
def delete_user():
    data = request.json
    user_id = data.get("uid")

    try:
        auth.delete_user(user_id)
        return jsonify({"message": "User deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# inside your main.py, before generate_frames
alert_start_time = None
alert_triggered = False

# # ----------------- 🔹 YOLOv8 Video Streaming -----------------
# def generate_frames():
#     while cap.isOpened():
#         success, frame = cap.read()
#         if not success:
#             break
        
#         # Perform object detection
#         results = model(frame)

#         for result in results:
#             if hasattr(result, "boxes"):  # Ensure boxes exist
#                 for box in result.boxes:
#                     x1, y1, x2, y2 = map(int, box.xyxy[0])  # Bounding box coordinates
#                     label = model.names[int(box.cls[0])]  # Object class
#                     conf = box.conf[0].item()  # Confidence score

#                     # Draw bounding box and label
#                     cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
#                     cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1 - 10), 
#                                 cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

#         # Encode frame as JPEG
#         _, buffer = cv2.imencode('.jpg', frame)
#         frame_bytes = buffer.tobytes()

#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        
# @app.route('/video_feed')
# def video_feed():
#     # Get device index from query param (?device=0)
#     device_index = int(request.args.get('device', 0))  # default = 0
#     return Response(generate_frames(device_index),
#                     mimetype='multipart/x-mixed-replace; boundary=frame')

# def generate_frames(device=0, user_id=None):
#     global alert_start_time, alert_triggered, stop_capture, cap
#     stop_capture = False
#     cap = cv2.VideoCapture(device)         # re-open camera

#     # reset between streams
#     alert_start_time = None
#     alert_triggered = False

#     while cap.isOpened() and not stop_capture:
#         ret, frame = cap.read()
#         if not ret:
#             break

#         # run YOLO
#         results = model(frame, verbose=False)

#         # draw boxes
#         any_alert = False
#         alert_label = None
#         for result in results:
#             if hasattr(result, "boxes"):
#                 for box in result.boxes:
#                     x1, y1, x2, y2 = map(int, box.xyxy[0])
#                     label = model.names[int(box.cls[0])]
#                     conf  = box.conf[0].item()
#                     # draw
#                     cv2.rectangle(frame, (x1, y1), (x2, y2), (0,255,0), 2)
#                     cv2.putText(frame, f"{label} {conf:.2f}", (x1,y1-10),
#                                 cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 2)

#                     # check if this is an alert class
#                     if label.lower() in ALERT_CLASSES:
#                         # print("ALERT:", label)
#                         any_alert = True
#                         alert_label = label


#         # ---- alert‐detection logic ----
#         now = time.time()
#         if any_alert:
#             if alert_start_time is None:
#                 # first frame with an alert
#                 alert_start_time = now
#             elif (now - alert_start_time) >= 1 and not alert_triggered:
#                 # held for 5s → fire log endpoint once
#                 try:
#                     print("Firing log-detection...")
#                     requests.post(
#                         "http://127.0.0.1:5000/log-detection",
#                         json={ "object_class": alert_label , "user_id": user_id},
#                         timeout=2
#                     )
#                     alert_triggered = True
#                 except Exception as e:
#                     print("Failed to fire log-detection:", e)
#         else:
#             # no alert this frame → reset
#             alert_start_time = None
#             alert_triggered = False
#         # --------------------------------

#         # stream the frame
#         _, buffer = cv2.imencode('.jpg', frame)
#         frame_bytes = buffer.tobytes()
#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
#     cap.release()



# @app.route('/video_feed')
# def video_feed():
#     device_index = request.args.get('device', default=0, type=int)
#     user_id      = request.args.get('user_id', type=str)
#     return Response(
#       generate_frames(device_index, user_id),
#       mimetype='multipart/x-mixed-replace; boundary=frame'
#     )



def push_notification(user_id, type_, title, message, data=None):
    try:
        notif_ref = db.reference("Notifications").child(str(uuid.uuid4()))
        notif_ref.set({
            "userId":    user_id,
            "type":      type_,
            "title":     title,
            "message":   message,
            "timestamp": int(datetime.utcnow().timestamp() * 1000),
            "data":      data or {}
        })
        print(f"✅ Notification sent: {title}")
    except Exception as e:
        print(f"❌ Error sending notification: {e}")
        # Don't fail the entire request if notification fails
# @app.route("/log-detection", methods=["POST"])
# def log_detection():
#     data = request.json
#     object_class = data.get("object_class")

#     if not object_class:
#         return jsonify({"error": "Missing object_class"}), 400

#     try:
#         detection_id = str(uuid.uuid4())  # Unique ID

#         detection_ref = db.reference("/Detections")
#         detection_ref.child(detection_id).set({
#             "timestamp": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
#             "object_class": object_class
#         })

#         return jsonify({"message": "Detection logged successfully"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
    
# import json

# remove any module-level cap = cv2.VideoCapture(0)
# Alert classes for weapon detection
# Note: The default YOLOv8n model only detects "knife" from weapon classes
# For full weapon detection, you need a custom trained model
ALERT_CLASSES = ["knife", "gun", "pistol", "rifle", "weapon", "baseball bat"]  # All weapon types for alerts

# Classes that the current model can actually detect
DETECTABLE_CLASSES = ["knife", "baseball bat"]  # Both knife and baseball bat are detected by default YOLOv8n model

def generate_frames(device=0, user_id=None):
    global alert_start_time, alert_triggered, stop_capture
    stop_capture = False
    cap = cv2.VideoCapture(device)

    # reset between streams
    alert_start_time = None
    alert_triggered = False

    while cap.isOpened() and not stop_capture:
        ret, frame = cap.read()
        if not ret:
            break

        # run YOLO
        if model:
            results = model(frame, verbose=False)
        else:
            # If no model available, just return the frame without detection
            results = []

        any_alert = False
        alert_label = None
        for result in results:
            for box in getattr(result, "boxes", []):
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                label = model.names[int(box.cls[0])]
                conf  = box.conf[0].item()

                cv2.rectangle(frame, (x1,y1),(x2,y2),(0,255,0),2)
                cv2.putText(frame, f"{label} {conf:.2f}", (x1,y1-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 2)

                # Check if this is a weapon class
                if label.lower() in ALERT_CLASSES:
                    any_alert = True
                    alert_label = label
                    
                # For testing: simulate gun detection when person is detected (for demo purposes)
                # This is a workaround since the default model doesn't detect guns
                if label.lower() == "person" and user_id:
                    import random
                    # Simulate occasional gun detection for testing (1% chance per frame)
                    if random.random() < 0.01:  # 1% chance
                        any_alert = True
                        alert_label = "gun"  # Simulate gun detection (baseball bat is already detected by model)

        # alert‐detection logic (fires once per stream)
        now = time.time()
        if any_alert:
            if alert_start_time is None:
                alert_start_time = now
            elif (now - alert_start_time) >= 3 and not alert_triggered:
                try:
                    requests.post(
                        "http://127.0.0.1:5000/log-detection",
                        json={ "object_class": alert_label,
                               "user_id":       user_id },
                        timeout=2
                    )
                    alert_triggered = True
                except Exception as e:
                    print("Failed to fire log-detection:", e)
        else:
            alert_start_time = None
            alert_triggered = False

        # encode & yield
        _, buf = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buf.tobytes() + b'\r\n')

    cap.release()



@app.route('/video_feed')
def video_feed():
    # grab both device index and user_id from the query string
    device_index = request.args.get('device', default=0, type=int)
    user_id      = request.args.get('user_id', default=None, type=str)
    return Response(
        generate_frames(device_index, user_id),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

import json
# ----------------- 🔹 Log Detection -----------------s
@app.route("/log-detection", methods=["POST"])
def log_detection():
    print('entered log detection')
    # 1️⃣ Read raw body
    raw_body = request.get_data()
    app.logger.debug(f"RAW BODY: {raw_body!r}")

    # 2️⃣ Try to parse JSON
    try:
        data = json.loads(raw_body)
    except Exception as e:
        app.logger.debug(f"JSON parse error: {e}")
        data = {}

    app.logger.debug(f"PARSED DATA: {data!r} (type={type(data)})")

    # 3️⃣ Extract and validate
    user_id      = data.get("user_id")
    object_class = data.get("object_class")
    print("USER ID:", user_id)
    print("OBJECT CLASS:", object_class)

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400
    if not object_class:
        return jsonify({"error": "Missing object_class"}), 400

    try:
        # 4️⃣ Build and write detection record
        detection_id = str(uuid.uuid4())
        detection_data = {
            "userId":       user_id,
            "object_class": object_class,
            "timestamp":    datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        }
        db.reference("/Detections").child(detection_id).set(detection_data)

        # 5️⃣ If critical, send FCM alerts
        if object_class.lower() in ALERT_CLASSES:
            send_alert_notification(object_class, user_id)

        return jsonify({"message": "Detection logged successfully"}), 200

    except Exception as e:
        app.logger.exception("Error in log_detection")
        return jsonify({"error": str(e)}), 500
    
def send_alert_notification(object_class, user_id):
    # Look up only the one user

    user_ref = db.reference(f"/Users/{user_id}")
    user_data = user_ref.get() or {}
    print(user_data)
    fcm_tokens = user_data.get("fcmTokens", {})

    for device_id, token in fcm_tokens.items():
        message = messaging.Message(
            notification=messaging.Notification(
                title="⚠️ Weapon Detected!",
                body=f"A {object_class.upper()} was detected on camera.",
            ),
            token=token
        )
        try:
            response = messaging.send(message)
            print(f"✅ FCM sent to {user_data.get('email')} ({device_id}): {response}")
        except Exception as e:
            print(f"❌ Error sending FCM to {user_data.get('email')} ({device_id}): {e}")
        
# def send_alert_notification(object_class):
#     # Fetch all users and their FCM tokens
#     users_ref = db.reference("/Users")
#     all_users = users_ref.get()

#     if not all_users:
#         print("❌ No users found.")
#         return

#     for user_data in all_users.items():
#         fcm_tokens = user_data.get("fcmTokens", {})
        
#         for device_id, token in fcm_tokens.items():
#             message = messaging.Message(
#                 notification=messaging.Notification(
#                     title="⚠️ Weapon Detected!",
#                     body=f"A {object_class.upper()} was detected on camera.",
#                 ),
#                 token=token
#             )

#             try:
#                 response = messaging.send(message)
#                 print(f"✅ FCM sent to {user_data.get('email')} ({device_id}): {response}")
#             except Exception as e:
#                 print(f"❌ Error sending FCM to {user_data.get('email')} ({device_id}): {e}")


@app.route("/api/users/<user_id>", methods=["PUT"])
def edit_user(user_id):
    data = request.get_json() or {}

    # Extract updatable fields
    email    = data.get("email")
    password = data.get("password")
    name     = data.get("name")
    city     = data.get("city")

    # 1️⃣ Update Firebase Auth (email/password) if present
    auth_updates = {}
    if email:
        auth_updates["email"] = email
    if password:
        auth_updates["password"] = password

    try:
        if auth_updates:
            auth.update_user(user_id, **auth_updates)
    except auth.UserNotFoundError:
        return jsonify({"error": "User not found in Auth"}), 404
    except Exception as e:
        return jsonify({"error": f"Auth update failed: {e}"}), 400

    # 2️⃣ Update Realtime Database profile
    profile_updates = {}
    if name is not None:
        profile_updates["name"] = name
    if city is not None:
        profile_updates["city"] = city
    if email is not None:
        # keep email in your `/Users/<uid>` node in sync, if you like
        profile_updates["email"] = email

    if profile_updates:
        try:
            user_ref = db.reference(f"/Users/{user_id}")
            user_ref.update(profile_updates)
        except Exception as e:
            return jsonify({"error": f"DB update failed: {e}"}), 500

    return jsonify({"message": "User updated successfully"}), 200

# GET  /api/cameras/<user_id>
@app.route('/api/cameras/<user_id>', methods=['GET'])
def get_user_cameras(user_id):
    try:
        cams_ref = db.reference("cameras")
        # query for only those entries whose "uid" matches
        all_cams = cams_ref.order_by_child("uid").equal_to(user_id).get() or {}
        return jsonify(all_cams), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# POST /api/cameras/<user_id>
@app.route('/api/cameras/<user_id>', methods=['POST'])
def add_camera(user_id):
    try:
        payload   = request.get_json()
        name      = payload.get("name")
        webcam_id = payload.get("webcamId")

        if not name or not webcam_id:
            return jsonify({"error": "Both 'name' and 'webcamId' are required"}), 400

        # generate camera_id and timestamp
        camera_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')

        new_camera = {
            "name":      name,
            "webcam":    webcam_id,
            "timestamp": timestamp,
            "uid":       user_id
        }

        # write under /cameras/<camera_id>
        db.reference(f"cameras/{camera_id}").set(new_camera)

        try:
            push_notification(
                user_id,
                type_   = "camera_added",
                title   = "Camera Added",
                message = f"You've added camera '{name}'.",
                data    = { "cameraId": camera_id }
            )
        except Exception as notif_error:
            print(f"⚠️ Notification failed but camera was added: {notif_error}")

        return jsonify({
            "message":  "Camera added successfully",
            "cameraId": camera_id
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route("/stop-capture", methods=["POST"])
def stop_capture_route():
    global stop_capture
    stop_capture = True
    return "", 200

# from flask import request, jsonify

# @app.route('/api/cameras/<camera_id>', methods=['DELETE'])
# def delete_camera(camera_id):
#     try:
#         # Point directly at /cameras/<camera_id>
#         camera_ref = db.reference(f"cameras/{camera_id}")
        
#         # Check existence
#         if camera_ref.get() is None:
#             return jsonify({"error": "Camera not found"}), 404
        
#         # Delete that node
#         camera_ref.delete()

        
#         return jsonify({"message": "Camera deleted successfully"}), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@app.route('/api/cameras/<camera_id>', methods=['DELETE'])
def delete_camera(camera_id):
    try:
        camera_ref  = db.reference(f"cameras/{camera_id}")
        camera_data = camera_ref.get()
        if not camera_data:
            return jsonify({"error": "Camera not found"}), 404

        owner_uid   = camera_data.get("uid")
        camera_name = camera_data.get("name", "Unnamed camera")

        # 1) delete the camera
        camera_ref.delete()

        # 2) notify the owner
        push_notification(
            owner_uid,
            type_   = "camera_deleted",
            title   = "Camera Removed",
            message = f"Your camera '{camera_name}' was deleted.",
            data    = {"cameraId": camera_id}
        )

        return jsonify({"message": "Camera deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- 1️⃣ Get a user's profile (read-only) ---
@app.route("/api/user/<user_id>", methods=["GET"])
def get_user_profile(user_id):
    try:
        user_ref = db.reference(f"/Users/{user_id}")
        user = user_ref.get()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Only expose name, email, city
        profile = {
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "city": user.get("city", "")
        }
        return jsonify(profile), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- 2️⃣ Get a user's detection logs ---
@app.route("/api/detections/<user_id>", methods=["GET"])
def get_user_detections(user_id):
    try:
        det_ref = db.reference("/Detections")
        all_dets = det_ref.get() or {}

        # Filter only those with matching userId
        user_dets = {}
        for det_id, det in all_dets.items():
            if det.get("userId") == user_id:
                user_dets[det_id] = {
                    "timestamp": det.get("timestamp"),
                    "object_class": det.get("object_class")
                }

        return jsonify(user_dets), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta

scheduler = BackgroundScheduler()

def send_daily_summary():
    cutoff = datetime.utcnow() - timedelta(days=1)
    dets = db.reference("Detections").get() or {}
    # collect counts per user
    per_user = {}
    for det in dets.values():
        ts = datetime.strptime(det["timestamp"], "%Y-%m-%d %H:%M:%S")
        if ts < cutoff: continue
        user = det["userId"]
        cls  = det["object_class"].lower()
        per_user.setdefault(user, {}).setdefault(cls, 0)
        per_user[user][cls] += 1

    for user_id, counts in per_user.items():
        total = sum(counts.values())
        msg   = ", ".join(f"{v} {k}" for k,v in counts.items())
        push_notification(
          user_id,
          type_   = "daily_summary",
          title   = f"Yesterday's Summary – {total} detections",
          message = msg,
          data    = { "counts": counts }
        )

# schedule to run every day at 00:05 UTC
scheduler.add_job(send_daily_summary, 'cron', hour=0, minute=5)
scheduler.start()

# @app.route("/run-daily-summary", methods=["POST"])
# def run_daily_summary_now():
#     try:
#         send_daily_summary()
#         return jsonify({"message": "Daily summary sent"}), 200
#     except Exception as e:
#         app.logger.exception("Error running daily summary")
#         return jsonify({"error": str(e)}), 500


@app.route("/test-gun-alert/<user_id>", methods=["POST"])
def test_gun_alert(user_id):
    """Manual endpoint to test gun alert functionality"""
    try:
        # Simulate a gun detection
        detection_id = str(uuid.uuid4())
        detection_data = {
            "userId": user_id,
            "object_class": "gun",
            "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            "test": True  # Mark as test detection
        }
        db.reference("/Detections").child(detection_id).set(detection_data)
        
        # Send alert notification
        send_alert_notification("gun", user_id)
        
        return jsonify({"message": "Test gun alert triggered successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/test-baseball-bat-alert/<user_id>", methods=["POST"])
def test_baseball_bat_alert(user_id):
    """Manual endpoint to test baseball bat alert functionality"""
    try:
        # Simulate a baseball bat detection
        detection_id = str(uuid.uuid4())
        detection_data = {
            "userId": user_id,
            "object_class": "baseball bat",
            "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            "test": True  # Mark as test detection
        }
        db.reference("/Detections").child(detection_id).set(detection_data)
        
        # Send alert notification
        send_alert_notification("baseball bat", user_id)
        
        return jsonify({"message": "Test baseball bat alert triggered successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/notifications/<user_id>', methods=['GET'])
def get_notifications(user_id):
    all_notifs = db.reference("Notifications") \
                   .order_by_child("userId") \
                   .equal_to(user_id) \
                   .get() or {}
    # you may want to sort by timestamp desc:
    sorted_list = sorted(
      all_notifs.items(),
      key=lambda kv: kv[1]["timestamp"],
      reverse=True
    )
    # return as { notifId: {…}, … }
    return jsonify({ k:v for k,v in sorted_list }), 200



# ----------------- 🔹 Run Flask App -----------------
if __name__ == '__main__':
    app.run(debug=True)