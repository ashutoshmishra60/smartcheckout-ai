import React, { useState } from 'react';
import { X, CreditCard, QrCode, Smartphone, Banknote, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutModal({ isOpen, onClose, cart, totals, onPaymentSuccess }) {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [customerName, setCustomerName] = useState('Alice Johnson');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate real-time gateway handshake
      await new Promise(resolve => setTimeout(resolve, 1000));

      const payload = {
        customer_name: customerName,
        payment_method: paymentMethod,
        items: cart.map(i => ({
          product_id: i.product_id,
          name: i.name,
          quantity: i.quantity,
          unit_price: i.unit_price,
          confidence_avg: i.confidence_avg || 95.0
        })),
        detection_confidence_avg: 95.0
      };

      const res = await onPaymentSuccess(payload);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setIsProcessing(false);
    } catch (err) {
      setError(err.message || 'Payment processing failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Payment Checkout</h3>
              <p className="text-xs text-slate-400">Total Due: ${(totals?.total_amount || 0).toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handlePay} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                  paymentMethod === 'CARD'
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-medium">Card / POS</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                  paymentMethod === 'UPI'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <QrCode className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-medium">UPI / QR Scan</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('APPLE_PAY')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                  paymentMethod === 'APPLE_PAY'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium">Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                  paymentMethod === 'CASH'
                    ? 'border-amber-500 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Banknote className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium">Cash Register</span>
              </button>
            </div>
          </div>

          {/* Conditional Method Visual */}
          {paymentMethod === 'UPI' && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="w-28 h-28 bg-white p-2 rounded-lg mb-2 shadow flex items-center justify-center">
                {/* Simulated QR Code SVG */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M40,10 h10 v10 h-10 z M50,40 h20 v20 h-20 z M70,70 h30 v10 h-30 z M70,90 h10 v10 h-10 z M90,80 h10 v20 h-10 z" />
                </svg>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Scan via Any UPI App / PhonePe / GPay</p>
            </div>
          )}

          {paymentMethod === 'CARD' && (
            <div className="space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>Contactless NFC Tap Enabled</span>
                <span className="text-blue-400 font-mono">•••• 8821</span>
              </div>
              <div className="text-[10px] text-slate-500">Autonomous POS Token: TOK-82914-RETAIL</div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Pay ${(totals?.total_amount || 0).toFixed(2)}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
