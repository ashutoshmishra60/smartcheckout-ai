import React from 'react';
import { X, Printer, CheckCircle2, RotateCcw } from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, receipt, onNewCheckout }) {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Actions bar */}
        <div className="bg-slate-100 p-3 px-4 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Receipt Generated
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thermal Receipt Paper Body */}
        <div className="p-6 font-mono text-xs overflow-y-auto space-y-4">
          {/* Store Header */}
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase">
              SMART RETAIL AI STORE
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">3-Tier Autonomous Vision POS</p>
            <p className="text-[10px] text-slate-400">Terminal: TERM-01-YOLO | Bot: CV-409</p>
          </div>

          {/* Transaction Metadata */}
          <div className="space-y-1 text-[11px] text-slate-600 pb-3 border-b border-dashed border-slate-300">
            <div className="flex justify-between">
              <span>Receipt ID:</span>
              <span className="font-bold text-slate-800">{receipt.transaction_uuid}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date(receipt.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{receipt.customer_name || 'Walk-in Customer'}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment:</span>
              <span className="font-semibold text-slate-800">{receipt.payment_method}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2 pb-3 border-b border-dashed border-slate-300">
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400">
              <span>Item Description</span>
              <span>Total</span>
            </div>

            {receipt.items?.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between text-[11px] text-slate-800 font-medium">
                  <span className="truncate pr-2">{item.name}</span>
                  <span>${Number(item.subtotal).toFixed(2)}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {item.quantity} x ${Number(item.unit_price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-1.5 text-[11px] text-slate-700 pb-3 border-b border-dashed border-slate-300">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${Number(receipt.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8.25%):</span>
              <span>${Number(receipt.tax_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Vision Discount:</span>
              <span>-$0.00</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span>TOTAL PAID:</span>
              <span>${Number(receipt.total_amount).toFixed(2)}</span>
            </div>
          </div>

          {/* Simulated Barcode */}
          <div className="text-center pt-2">
            <div className="inline-block py-2 px-3 bg-slate-100 rounded border border-slate-200">
              <div className="text-lg tracking-[6px] font-bold text-slate-800 font-mono select-none">
                ||| | |||| | ||||| ||
              </div>
              <div className="text-[9px] tracking-wider text-slate-500 mt-0.5">
                {receipt.transaction_uuid}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-3 italic">
              Thank you for testing the AI Automated Retail Checkout!
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={() => {
              onClose();
              onNewCheckout();
            }}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Next Checkout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
