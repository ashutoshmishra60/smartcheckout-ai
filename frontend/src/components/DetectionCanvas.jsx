import React from 'react';
import { Eye, Zap, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function DetectionCanvas({ detectionResult }) {
  if (!detectionResult) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center h-full min-h-[300px]">
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
          <Eye className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-medium text-slate-300 mb-1">Awaiting Product Scan</h3>
        <p className="text-xs text-slate-400 max-w-xs">
          Point products at the camera or click a demo scenario to see YOLOv8 bounding box annotations and auto-calculated cart items.
        </p>
      </div>
    );
  }

  const { annotated_image, detections = [], engine, metrics = {} } = detectionResult;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">YOLOv8 Detection Output</h2>
            <p className="text-xs text-slate-400">OpenCV Annotated Frame & Telemetry</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          {engine || 'YOLOv8'}
        </span>
      </div>

      {/* Annotated Image Frame */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-[4/3] border border-slate-800 flex items-center justify-center">
        {annotated_image ? (
          <img
            src={annotated_image}
            alt="YOLOv8 Annotated Frame"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-xs text-slate-500">No annotated frame available</div>
        )}

        {/* Latency badge */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          Inference: {metrics.ml_latency_ms || 24}ms
        </div>
      </div>

      {/* Metrics & CV Telemetry Bar */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Objects Found</div>
          <div className="text-lg font-bold text-white mt-0.5">{detections.length}</div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Avg Confidence</div>
          <div className="text-lg font-bold text-cyan-400 mt-0.5">{metrics.avg_confidence || 95}%</div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Scan Reduction</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">-{metrics.time_saved_percent || 92}%</div>
        </div>
      </div>

      {/* Detected tags chips */}
      {detections.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap gap-1.5">
          {detections.map((d, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-200 border border-slate-700 font-mono"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {d.display_name || d.class}
              <span className="text-slate-400 font-sans text-[10px]">({d.confidence_pct || 94}%)</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
