"""
AI-Powered Automated Retail Checkout System
ML Microservice: Flask REST API for Real-Time Product Detection
"""

import os
import io
import time
import base64
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from detector import ProductDetector, RETAIL_CLASSES

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("MLMicroservice")

app = Flask(__name__)
# Enable CORS for communication from React frontend and Node.js backend
CORS(app)

PORT = int(os.environ.get("PORT", 5001))
MODEL_PATH = os.environ.get("YOLO_MODEL", "yolov8n.pt")
CONF_THRESHOLD = float(os.environ.get("CONF_THRESHOLD", 0.35))

# Initialize the computer vision detector
detector = ProductDetector(model_name=MODEL_PATH, conf_threshold=CONF_THRESHOLD)

@app.route("/health", methods=["GET"])
def health_check():
    """
    Health check endpoint reporting microservice status, active detector engine, and port.
    """
    return jsonify({
        "status": "healthy",
        "service": "Retail ML Microservice",
        "engine": "YOLOv8" if detector.using_yolo else "OpenCV_CV",
        "conf_threshold": detector.conf_threshold,
        "classes_supported": len(RETAIL_CLASSES),
        "port": PORT,
        "timestamp": time.time()
    }), 200

@app.route("/classes", methods=["GET"])
def get_supported_classes():
    """
    Returns the supported retail classification classes and human-readable names.
    """
    return jsonify({
        "success": True,
        "classes": [
            {"key": k, "name": v["name"]}
            for k, v in RETAIL_CLASSES.items()
        ]
    }), 200

@app.route("/detect", methods=["POST"])
def detect_products():
    """
    Primary CV Detection Endpoint.
    Accepts:
      - JSON payload with base64 image: { "image": "data:image/jpeg;base64,..." }
      - OR multipart/form-data with file: "file" or "image"
    Returns:
      JSON containing detected items, confidence scores, bounding boxes, summary,
      and annotated base64 preview frame.
    """
    t_start = time.time()
    image_input = None

    # Handle JSON base64 input
    if request.is_json:
        data = request.get_json(silent=True) or {}
        image_input = data.get("image") or data.get("frame")
    
    # Handle Multipart Form upload
    elif request.files:
        file = request.files.get("file") or request.files.get("image")
        if file:
            image_input = file.read()

    # Handle raw binary payload
    elif request.data:
        image_input = request.data

    if not image_input:
        return jsonify({
            "success": False,
            "error": "No image data provided. Provide base64 'image' in JSON or upload multipart file."
        }), 400

    try:
        results = detector.detect(image_input)
        elapsed_ms = round((time.time() - t_start) * 1000, 2)
        results["latency_ms"] = elapsed_ms
        return jsonify(results), 200
    except Exception as ex:
        logger.exception("Error during detection processing")
        return jsonify({
            "success": False,
            "error": str(ex)
        }), 500

@app.route("/demo-detect", methods=["POST"])
def demo_detect():
    """
    Generates a realistic test detection scenario with synthetic frame
    for testing the 1-step detect-to-checkout flow without a live camera.
    """
    import cv2
    import numpy as np

    payload = request.get_json(silent=True) or {}
    requested_items = payload.get("items", ["bottle", "apple"])

    # Create synthetic checkout counter frame (640x480)
    canvas = np.zeros((480, 640, 3), dtype=np.uint8)
    canvas[:] = (245, 245, 248) # Clean marble checkout tray

    # Draw conveyor border
    cv2.rectangle(canvas, (20, 20), (620, 460), (220, 220, 225), 2)
    cv2.putText(canvas, "AI CHECKOUT SCANNER TRAY", (40, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (120, 120, 130), 2)

    detections = []
    class_summary = {}

    positions = [
        {"bbox": [70, 120, 240, 420], "cls": "bottle"},
        {"bbox": [280, 180, 430, 360], "cls": "apple"},
        {"bbox": [460, 200, 600, 380], "cls": "banana"}
    ]

    for i, item in enumerate(requested_items):
        if i >= len(positions):
            break
        p = positions[i]
        cls_key = item if item in RETAIL_CLASSES else p["cls"]
        meta = RETAIL_CLASSES.get(cls_key, {"name": cls_key.capitalize(), "color": (0, 200, 255)})
        b = p["bbox"]
        
        # Draw simulated item on canvas
        cv2.rectangle(canvas, (b[0] + 15, b[1] + 20), (b[2] - 15, b[3] - 20), (200, 210, 220), -1)
        detector._draw_modern_bbox(canvas, b[0], b[1], b[2], b[3], meta["name"], 0.95, meta["color"])

        detections.append({
            "class": cls_key,
            "display_name": meta["name"],
            "confidence": 0.95,
            "confidence_pct": 95.0,
            "bbox": b
        })
        class_summary[cls_key] = class_summary.get(cls_key, 0) + 1

    b64_out = detector.encode_image_base64(canvas)
    return jsonify({
        "success": True,
        "engine": "Simulated_Test_Feed",
        "frame_dimensions": {"width": 640, "height": 480},
        "count": len(detections),
        "detections": detections,
        "summary": class_summary,
        "annotated_image": b64_out,
        "latency_ms": 12.5
    }), 200

if __name__ == "__main__":
    logger.info(f"Starting ML Microservice on port {PORT}...")
    app.run(host="0.0.0.0", port=PORT, debug=False)
