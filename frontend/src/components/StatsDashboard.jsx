import React from 'react';
import { DollarSign, ShoppingBag, Zap, Clock, ShieldCheck, Activity, Server, Database, Cpu } from 'lucide-react';

export default function StatsDashboard({ stats, health }) {
  const d = stats || {
    total_revenue: 24.35,
    total_transactions: 3,
    total_items_scanned: 10,
    avg_accuracy: 94.2,
    avg_checkout_time_sec: 1.2,
    manual_baseline_time_sec: 14.5,
    efficiency_gain_pct: 92,
    low_stock_alerts: 0,
    active_catalog_size: 10
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Sales Revenue</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono">${d.total_revenue?.toFixed(2)}</div>
          <p className="text-[11px] text-emerald-400/90 mt-1 flex items-center gap-1 font-medium">
            <span>+100% automated settlement</span>
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Completed Checkouts</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{d.total_transactions} orders</div>
          <p className="text-[11px] text-slate-400 mt-1">
            {d.total_items_scanned} total retail units
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">YOLOv8 Detection Accuracy</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-400 font-mono">{d.avg_accuracy}%</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Real-time confidence scoring
          </p>
        </div>

        {/* Card 4 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Speed Improvement</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">+{d.efficiency_gain_pct}% Faster</div>
          <p className="text-[11px] text-slate-400 mt-1">
            1-step automated vs 2-step manual
          </p>
        </div>
      </div>

      {/* 3-Tier Architecture Technical Blueprint */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          3-Tier System Architecture Topology
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Live inter-service communication telemetry across Presentation, Application, and ML layers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1 */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Tier 1: Frontend SPA</h4>
                <p className="text-[10px] text-slate-400">React.js + Tailwind CSS</p>
              </div>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Port:</span>
                <span className="text-slate-200">5173</span>
              </div>
              <div className="flex justify-between">
                <span>Capability:</span>
                <span className="text-slate-200">Webcam Feed & POS Cart</span>
              </div>
              <div className="flex justify-between">
                <span>Protocol:</span>
                <span className="text-slate-200">Vite HMR / REST JSON</span>
              </div>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Tier 2: Application API</h4>
                <p className="text-[10px] text-slate-400">Node.js + Express.js</p>
              </div>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Port:</span>
                <span className="text-slate-200">5000</span>
              </div>
              <div className="flex justify-between">
                <span>Database:</span>
                <span className="text-emerald-400">MySQL / Relational</span>
              </div>
              <div className="flex justify-between">
                <span>Role:</span>
                <span className="text-slate-200">Cart & Transaction Sync</span>
              </div>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Tier 3: ML Microservice</h4>
                <p className="text-[10px] text-slate-400">Python + Flask + YOLOv8</p>
              </div>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Port:</span>
                <span className="text-slate-200">5001</span>
              </div>
              <div className="flex justify-between">
                <span>CV Engine:</span>
                <span className="text-purple-400">OpenCV + YOLOv8n</span>
              </div>
              <div className="flex justify-between">
                <span>Inference:</span>
                <span className="text-slate-200">&lt; 350ms Latency</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
