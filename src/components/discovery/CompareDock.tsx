import React from 'react';
import { Scale, X, ArrowRight, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useDiscovery } from '../../context/DiscoveryContext';

interface CompareDockProps {
  onNavigate: (path: string) => void;
}

export const CompareDock: React.FC<CompareDockProps> = ({ onNavigate }) => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    isCompareDockOpen,
    setIsCompareDockOpen,
  } = useDiscovery();

  if (compareList.length === 0) return null;

  return (
    <aside
      aria-label="Product comparison dock"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl transition-all duration-300 animate-in slide-in-from-bottom-5"
    >
      <div className="rounded-3xl border border-slate-700/80 bg-slate-900/95 text-white shadow-2xl backdrop-blur-xl p-3 sm:p-4">
        {/* Dock Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-black">
              <Scale className="h-3.5 w-3.5" />
            </div>
            <span className="font-extrabold text-white">Compare Dock</span>
            <span className="rounded-full bg-slate-800 text-emerald-400 px-2 py-0.2 text-[10px] font-bold">
              {compareList.length} of 4 Selected
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              <span className="hidden sm:inline">Clear</span>
            </button>
            <button
              onClick={() => setIsCompareDockOpen(!isCompareDockOpen)}
              className="p-1 text-slate-400 hover:text-white"
              title={isCompareDockOpen ? 'Collapse Dock' : 'Expand Dock'}
            >
              {isCompareDockOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Dock Content */}
        {isCompareDockOpen && (
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Thumbnails Row */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {compareList.map((p) => (
                <div
                  key={p.id}
                  className="relative group shrink-0 rounded-2xl border border-slate-700 bg-slate-800/80 p-1 flex items-center gap-2 pr-2.5"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-10 w-10 rounded-xl object-cover bg-slate-950"
                  />
                  <div className="max-w-[110px] truncate text-[11px]">
                    <span className="font-bold text-white block truncate">{p.name}</span>
                    <span className="text-emerald-400 font-extrabold">{p.price}</span>
                  </div>
                  <button
                    onClick={() => removeFromCompare(p.id)}
                    className="rounded-full p-0.5 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    title="Remove item"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {/* Empty placeholder slots up to 4 */}
              {Array.from({ length: 4 - compareList.length }).map((_, idx) => (
                <div
                  key={idx}
                  className="hidden sm:flex h-12 w-28 rounded-2xl border border-dashed border-slate-700 items-center justify-center text-[10px] text-slate-500 font-bold"
                >
                  + Add Item
                </div>
              ))}
            </div>

            {/* Launch Compare Action */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate('/compare')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-5 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-950/50 transition-all"
              >
                <span>Launch Compare</span>
                <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
