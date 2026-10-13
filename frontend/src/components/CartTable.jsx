import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Tag, Percent } from 'lucide-react';

export default function CartTable({
  cart,
  totals,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) {
  const hasItems = cart && cart.length > 0;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Live Checkout Cart</h2>
            <p className="text-xs text-slate-400">
              {hasItems ? `${cart.reduce((a, c) => a + c.quantity, 0)} items identified` : 'Cart is empty'}
            </p>
          </div>
        </div>

        {hasItems && (
          <button
            onClick={onClearCart}
            className="text-xs text-slate-400 hover:text-red-400 transition flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[380px]">
        {!hasItems ? (
          <div className="h-56 flex flex-col items-center justify-center text-center text-slate-500">
            <ShoppingCart className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm font-medium text-slate-400">No Items In Cart</p>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Trigger camera detection or use 1-Click Demo Scenarios to auto-populate scanned retail products.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.product_id}
              className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition flex items-center gap-3"
            >
              {/* Product Thumbnail */}
              <img
                src={item.image_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100'}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover bg-slate-950 border border-slate-800"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-semibold text-slate-100 truncate">{item.name}</h4>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {item.yolo_class}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>${Number(item.unit_price).toFixed(2)} ea</span>
                  <span>•</span>
                  <span className="text-emerald-400/90 font-mono text-[10px]">AI Conf: {item.confidence_avg || 95}%</span>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                  className="p-1 text-slate-400 hover:text-white transition"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-mono font-semibold text-white px-1 w-4 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                  className="p-1 text-slate-400 hover:text-white transition"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right min-w-[55px]">
                <div className="text-xs font-bold text-white font-mono">
                  ${(item.quantity * item.unit_price).toFixed(2)}
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={() => onRemoveItem(item.product_id)}
                className="p-1 text-slate-400 hover:text-red-400 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Financial Breakdown & Summary */}
      <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Subtotal</span>
          <span className="font-mono text-slate-200">${(totals?.subtotal || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span>Sales Tax (8.25%)</span>
          </span>
          <span className="font-mono text-slate-200">${(totals?.tax_amount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-emerald-400 font-medium">
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            AI Autonomous Checkout Discount
          </span>
          <span className="font-mono">-$0.00</span>
        </div>

        {/* Total Bill */}
        <div className="pt-2 border-t border-slate-800/80 flex justify-between items-baseline">
          <span className="text-sm font-semibold text-white">Estimated Total</span>
          <span className="text-xl font-extrabold text-white font-mono text-emerald-400">
            ${(totals?.total_amount || 0).toFixed(2)}
          </span>
        </div>

        {/* Checkout Button */}
        <button
          onClick={onProceedToCheckout}
          disabled={!hasItems}
          className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span>Pay & Complete Checkout (${(totals?.total_amount || 0).toFixed(2)})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
