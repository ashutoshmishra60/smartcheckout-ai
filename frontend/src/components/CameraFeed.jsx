import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Upload, Sparkles, AlertCircle, Play, Square, Crosshair } from 'lucide-react';

export default function CameraFeed({ onCapture, isScanning, onDemoTrigger }) {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [autoScan, setAutoScan] = useState(false);

  // Initialize Webcam
  useEffect(() => {
    let stream = null;
    async function startCamera() {
      try {
        setCameraError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        console.warn('Webcam not accessible:', err);
        setCameraError('Webcam unavailable or permissions denied. You can use Preset Items or Upload Photo.');
        setCameraActive(false);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle Capture snapshot from video element
  const captureFrame = () => {
    if (!videoRef.current || !cameraActive) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg', 0.85);
    onCapture(base64Image);
  };

  // Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onCapture(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Auto-scan interval
  useEffect(() => {
    let interval = null;
    if (autoScan && cameraActive && !isScanning) {
      interval = setInterval(() => {
        captureFrame();
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoScan, cameraActive, isScanning]);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">AI Vision Scanner</h2>
            <p className="text-xs text-slate-400">YOLOv8 Real-Time Item Detection</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            cameraActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            {cameraActive ? 'Camera Live' : 'Simulation Mode'}
          </span>
        </div>
      </div>

      {/* Video Viewport / HUD */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-[4/3] flex items-center justify-center border border-slate-800 group">
        {/* Video feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
        />

        {/* Laser scan line animation */}
        {cameraActive && <div className="laser-line"></div>}

        {/* Crosshair HUD overlays */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
          <Crosshair className="w-20 h-20 text-blue-400/40" />
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-400"></div>
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-400"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-400"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-400"></div>
        </div>

        {/* Scanner Active Banner */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-300 border border-slate-700/60 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          CONFIDENCE &gt; 35% | YOLOv8 COCO
        </div>

        {/* Fallback Display if Webcam is off */}
        {!cameraActive && (
          <div className="p-6 text-center max-w-sm">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
              <Camera className="w-7 h-7" />
            </div>
            <p className="text-sm font-medium text-slate-200 mb-1">Webcam Inactive</p>
            <p className="text-xs text-slate-400 mb-4">
              {cameraError || 'Use the interactive simulation presets below or upload an image to test item checkout.'}
            </p>
          </div>
        )}

        {/* Scanning Overlay */}
        {isScanning && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-sm font-semibold text-white tracking-wide">YOLOv8 Processing Frame...</p>
            <p className="text-xs text-slate-400">Running OpenCV contours & bounding box inference</p>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={captureFrame}
          disabled={!cameraActive || isScanning}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl text-xs transition shadow-lg shadow-blue-500/20 active:scale-[0.98]"
        >
          <Camera className="w-4 h-4" />
          <span>Capture & Scan</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isScanning}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-xs transition border border-slate-700 active:scale-[0.98]"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Quick Test Demo Presets */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            1-Click Demo Scenarios
          </span>
          <span className="text-[10px] text-slate-400">Instant test</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onDemoTrigger(['bottle', 'apple'])}
            disabled={isScanning}
            className="p-2 text-left bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/40 rounded-lg transition group"
          >
            <div className="text-[11px] font-medium text-slate-200 group-hover:text-blue-400">Water + Apple</div>
            <div className="text-[9px] text-slate-400">2 Items • ~$2.98</div>
          </button>

          <button
            onClick={() => onDemoTrigger(['bottle', 'banana', 'cup'])}
            disabled={isScanning}
            className="p-2 text-left bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 rounded-lg transition group"
          >
            <div className="text-[11px] font-medium text-slate-200 group-hover:text-emerald-400">Drink, Fruit & Cup</div>
            <div className="text-[9px] text-slate-400">3 Items • ~$9.57</div>
          </button>

          <button
            onClick={() => onDemoTrigger(['sandwich', 'bottle', 'apple'])}
            disabled={isScanning}
            className="p-2 text-left bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 rounded-lg transition group"
          >
            <div className="text-[11px] font-medium text-slate-200 group-hover:text-amber-400">Lunch Combo</div>
            <div className="text-[9px] text-slate-400">3 Items • ~$8.47</div>
          </button>
        </div>
      </div>
    </div>
  );
}
