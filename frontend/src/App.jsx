import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Camera,
  Layers,
  History,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Server,
  Database,
  Cpu
} from 'lucide-react';
import CameraFeed from './components/CameraFeed';
import DetectionCanvas from './components/DetectionCanvas';
import CartTable from './components/CartTable';
import CheckoutModal from './components/CheckoutModal';
import ReceiptModal from './components/ReceiptModal';
import ProductCatalog from './components/ProductCatalog';
import TransactionHistory from './components/TransactionHistory';
import StatsDashboard from './components/StatsDashboard';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('checkout'); // 'checkout' | 'catalog' | 'history' | 'stats'
  const [isScanning, setIsScanning] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, tax_amount: 0, total_amount: 0 });

  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Data collections
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Initial Data Fetch
  useEffect(() => {
    refreshAllData();
    const interval = setInterval(checkSystemHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  const refreshAllData = async () => {
    checkSystemHealth();
    loadProducts();
    loadTransactions();
    loadStats();
  };

  const checkSystemHealth = async () => {
    try {
      const data = await api.getHealth();
      setHealth(data);
    } catch (err) {
      console.warn('Backend not responding yet:', err);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await api.getProducts();
      if (res.data) setProducts(res.data);
    } catch (err) {
      console.warn('Could not load products:', err);
    }
  };

  const loadTransactions = async () => {
    try {
      const res = await api.getTransactions();
      if (res.data) setTransactions(res.data);
    } catch (err) {
      console.warn('Could not load transactions:', err);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.getDashboardStats();
      if (res.data) setStats(res.data);
    } catch (err) {
      console.warn('Could not load stats:', err);
    }
  };

  // 1-Step Automated Detect-to-Checkout Handler
  const handleFrameCapture = async (imageBase64) => {
    setIsScanning(true);
    try {
      const result = await api.detectProducts(imageBase64);
      setDetectionResult(result);

      if (result.cart && result.cart.length > 0) {
        // Merge or replace cart items
        setCart(prevCart => {
          const map = new Map();
          // Keep existing items
          prevCart.forEach(i => map.set(i.product_id, { ...i }));
          // Add newly detected items
          result.cart.forEach(newItem => {
            if (map.has(newItem.product_id)) {
              const current = map.get(newItem.product_id);
              current.quantity += newItem.quantity;
              current.subtotal = parseFloat((current.quantity * current.unit_price).toFixed(2));
            } else {
              map.set(newItem.product_id, { ...newItem });
            }
          });
          const merged = Array.from(map.values());
          recalculateTotals(merged);
          return merged;
        });

        showToast(`AI detected ${result.detections_count} items with ${result.engine || 'YOLOv8'}!`);
      } else {
        showToast('No recognized retail products in the scanned frame.', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Detection failed', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  // Demo Trigger Simulator
  const handleDemoTrigger = async (presetItems) => {
    setIsScanning(true);
    try {
      // Call backend demo-detect proxy or detect endpoint with demo payload
      const response = await fetch('/api/checkout/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: 'demo-frame',
          triggerManualScan: true
        })
      });
      const result = await response.json();
      setDetectionResult(result);

      if (result.cart && result.cart.length > 0) {
        setCart(result.cart);
        setTotals(result.totals);
        showToast(`Demo items scanned & added to checkout cart!`);
      }
    } catch (err) {
      showToast('Simulation trigger error', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  // Recalculate totals helper
  const recalculateTotals = (items) => {
    const subtotal = parseFloat(items.reduce((acc, i) => acc + (i.quantity * i.unit_price), 0).toFixed(2));
    const tax_amount = parseFloat(((subtotal * 8.25) / 100).toFixed(2));
    const total_amount = parseFloat((subtotal + tax_amount).toFixed(2));
    setTotals({ subtotal, tax_amount, total_amount });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const updated = cart.map(i => {
      if (i.product_id === productId) {
        return { ...i, quantity: newQuantity, subtotal: parseFloat((newQuantity * i.unit_price).toFixed(2)) };
      }
      return i;
    });
    setCart(updated);
    recalculateTotals(updated);
  };

  const handleRemoveItem = (productId) => {
    const updated = cart.filter(i => i.product_id !== productId);
    setCart(updated);
    recalculateTotals(updated);
  };

  const handleClearCart = () => {
    setCart([]);
    setTotals({ subtotal: 0, tax_amount: 0, total_amount: 0 });
    setDetectionResult(null);
  };

  const handleAddToCartFromCatalog = (product) => {
    setCart(prev => {
      const map = new Map(prev.map(i => [i.product_id, { ...i }]));
      if (map.has(product.id)) {
        const item = map.get(product.id);
        item.quantity += 1;
        item.subtotal = parseFloat((item.quantity * item.unit_price).toFixed(2));
      } else {
        map.set(product.id, {
          product_id: product.id,
          sku: product.sku,
          name: product.name,
          category: product.category,
          unit_price: parseFloat(product.price),
          quantity: 1,
          subtotal: parseFloat(product.price),
          yolo_class: product.yolo_class,
          image_url: product.image_url,
          confidence_avg: 98.0
        });
      }
      const updated = Array.from(map.values());
      recalculateTotals(updated);
      return updated;
    });
    showToast(`Added "${product.name}" to cart.`);
  };

  // Payment Execution
  const handlePaymentSuccess = async (paymentPayload) => {
    const res = await api.createTransaction(paymentPayload);
    setActiveReceipt(res.data);
    setIsCheckoutOpen(false);
    setIsReceiptOpen(true);
    // Refresh stats and history
    loadTransactions();
    loadStats();
    loadProducts();
    // Clear active cart
    setCart([]);
    setTotals({ subtotal: 0, tax_amount: 0, total_amount: 0 });
    return res;
  };

  const handleViewReceipt = (txn) => {
    setActiveReceipt({
      ...txn,
      timestamp: txn.created_at,
      store_info: {
        store_name: 'Smart Retail AI Supermarket',
        terminal_id: 'TERM-01-VISION',
        cashier: 'Autonomous AI Checkout Bot'
      }
    });
    setIsReceiptOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div className={`p-3.5 px-4 rounded-xl shadow-2xl border text-xs font-medium flex items-center gap-2.5 backdrop-blur-md ${
            toast.type === 'error'
              ? 'bg-red-500/10 border-red-500/20 text-red-300'
              : toast.type === 'info'
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                ScanSmart AI
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  v1.0 (YOLOv8)
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">AI-Powered Automated Retail Checkout System</p>
            </div>
          </div>

          {/* Service Health Indicators */}
          <div className="hidden lg:flex items-center gap-2.5 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-slate-400">React SPA:</span>
              <span className="text-slate-200">5173</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-slate-400">Express API:</span>
              <span className="text-slate-200">5000</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <span className={`w-1.5 h-1.5 rounded-full ${health?.services?.mlMicroservice?.online ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className="text-slate-400">Flask ML:</span>
              <span className="text-purple-300">5001 ({health?.services?.mlMicroservice?.data?.engine || 'YOLOv8'})</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-slate-400">DB:</span>
              <span className="text-emerald-300">MySQL / Active</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('checkout')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'checkout'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Checkout Terminal</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'catalog'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit History</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'stats'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Architecture & KPIs</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Tab 1: 1-Step Detect-to-Checkout Terminal */}
        {activeTab === 'checkout' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Col: Camera Scanner (5 cols) */}
            <div className="lg:col-span-4">
              <CameraFeed
                onCapture={handleFrameCapture}
                isScanning={isScanning}
                onDemoTrigger={handleDemoTrigger}
              />
            </div>

            {/* Middle Col: YOLOv8 Live Detection Frame & HUD (4 cols) */}
            <div className="lg:col-span-4">
              <DetectionCanvas detectionResult={detectionResult} />
            </div>

            {/* Right Col: Live Itemized Cart & Checkout (4 cols) */}
            <div className="lg:col-span-4">
              <CartTable
                cart={cart}
                totals={totals}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                onProceedToCheckout={() => setIsCheckoutOpen(true)}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Products Catalog */}
        {activeTab === 'catalog' && (
          <ProductCatalog
            products={products}
            onAddToCart={handleAddToCartFromCatalog}
          />
        )}

        {/* Tab 3: Transaction Audit History */}
        {activeTab === 'history' && (
          <TransactionHistory
            transactions={transactions}
            onViewReceipt={handleViewReceipt}
          />
        )}

        {/* Tab 4: System Architecture & KPIs */}
        {activeTab === 'stats' && (
          <StatsDashboard
            stats={stats}
            health={health}
          />
        )}
      </main>

      {/* Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        totals={totals}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receipt={activeReceipt}
        onNewCheckout={() => {
          handleClearCart();
          setActiveTab('checkout');
        }}
      />
    </div>
  );
}
