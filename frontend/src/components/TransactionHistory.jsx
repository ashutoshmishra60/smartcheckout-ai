import React from 'react';
import { History, Receipt, CreditCard, QrCode, Smartphone, Banknote, Calendar, CheckCircle2 } from 'lucide-react';

export default function TransactionHistory({ transactions, onViewReceipt }) {
  const getMethodIcon = (method) => {
    switch (method) {
      case 'UPI': return <QrCode className="w-3.5 h-3.5 text-indigo-400" />;
      case 'APPLE_PAY': return <Smartphone className="w-3.5 h-3.5 text-emerald-400" />;
      case 'CASH': return <Banknote className="w-3.5 h-3.5 text-amber-400" />;
      default: return <CreditCard className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Transaction Audit Log</h2>
            <p className="text-xs text-slate-400">Relational MySQL Order History & Receipts</p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Total Logs: {transactions.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="pb-3 font-semibold">UUID / Receipt</th>
              <th className="pb-3 font-semibold">Customer</th>
              <th className="pb-3 font-semibold">Date & Time</th>
              <th className="pb-3 font-semibold">Payment</th>
              <th className="pb-3 font-semibold">Items</th>
              <th className="pb-3 font-semibold">AI Conf</th>
              <th className="pb-3 font-semibold">Total Paid</th>
              <th className="pb-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-800/30 transition group">
                <td className="py-3 font-bold text-blue-400">
                  {txn.transaction_uuid}
                </td>
                <td className="py-3 font-sans text-slate-300">
                  {txn.customer_name || 'Walk-in Customer'}
                </td>
                <td className="py-3 text-slate-400 text-[11px]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{new Date(txn.created_at).toLocaleString()}</span>
                  </div>
                </td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                    {getMethodIcon(txn.payment_method)}
                    <span>{txn.payment_method}</span>
                  </span>
                </td>
                <td className="py-3 text-slate-300 font-sans">
                  {txn.items_count} items
                </td>
                <td className="py-3 text-emerald-400">
                  {txn.detection_confidence_avg || 95}%
                </td>
                <td className="py-3 text-white font-bold text-sm">
                  ${Number(txn.total_amount).toFixed(2)}
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onViewReceipt(txn)}
                    className="p-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition text-xs font-sans flex items-center gap-1 ml-auto"
                  >
                    <Receipt className="w-3.5 h-3.5 text-blue-400" />
                    <span>Receipt</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
