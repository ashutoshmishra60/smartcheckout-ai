import React, { useState } from 'react';
import { Package, Search, Plus, AlertTriangle, CheckCircle, Tag } from 'lucide-react';

export default function ProductCatalog({ products, onAddToCart }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.sku.toLowerCase().includes(search.toLowerCase()) ||
                          p.yolo_class.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-5">
      {/* Search and Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, SKU, or YOLO class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((prod) => {
          const isLowStock = prod.stock_quantity <= prod.reorder_level;
          return (
            <div
              key={prod.id}
              className="glass-card rounded-2xl p-4 border border-slate-800/80 hover:border-blue-500/30 transition flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-800">
                  <img
                    src={prod.image_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300'}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {/* Category Badge */}
                  <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-slate-300 border border-slate-700/60 font-medium">
                    {prod.category}
                  </span>

                  {/* YOLO Class Badge */}
                  <span className="absolute bottom-2 right-2 bg-blue-500/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-white font-mono font-medium">
                    YOLO: {prod.yolo_class}
                  </span>
                </div>

                {/* Details */}
                <div className="flex items-baseline justify-between gap-1 mb-1">
                  <h3 className="text-xs font-semibold text-slate-100 line-clamp-1">{prod.name}</h3>
                </div>
                <div className="text-[10px] font-mono text-slate-400 mb-2">{prod.sku}</div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                  {prod.description}
                </p>
              </div>

              {/* Price & Action */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-white font-mono">
                    ${Number(prod.price).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {isLowStock ? (
                      <span className="text-[10px] text-amber-400 flex items-center gap-0.5 font-medium">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Stock: {prod.stock_quantity}
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle className="w-2.5 h-2.5" />
                        In Stock ({prod.stock_quantity})
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart(prod)}
                  className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition shadow-md shadow-blue-600/20 active:scale-95 flex items-center gap-1 text-xs font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
