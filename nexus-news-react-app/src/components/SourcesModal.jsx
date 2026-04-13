import React, { useEffect } from 'react';
import { X, Loader, AlertCircle } from 'lucide-react';
import { useSources } from '../hooks';

export const SourcesModal = ({ isOpen, onClose, country = null, category = null }) => {
  const {
    sources,
    selectedSources,
    loadingSources,
    sourcesError,
    fetchSources,
    toggleSource,
    clearSelectedSources,
  } = useSources();

  useEffect(() => {
    if (isOpen) {
      fetchSources(country, category);
    }
  }, [isOpen, country, category, fetchSources]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md max-h-[80vh] bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800">
          <h2 className="text-xl font-bold text-white">News Sources</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700/50 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loadingSources ? (
            <div className="flex items-center justify-center h-40">
              <Loader size={24} className="text-blue-500 animate-spin" />
            </div>
          ) : sourcesError ? (
            <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-700/50 rounded-lg text-red-200">
              <AlertCircle size={20} />
              <span>{sourcesError}</span>
            </div>
          ) : sources.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No sources available
            </div>
          ) : (
            <div className="space-y-3">
              {sources.map((source) => (
                <label
                  key={source.id || source.name}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source.id || source.name)}
                    onChange={() => toggleSource(source.id || source.name)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                      {source.name}
                    </p>
                    {source.description && (
                      <p className="text-xs text-slate-400 truncate">
                        {source.description}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-700/50 bg-slate-800/50">
          <button
            onClick={clearSelectedSources}
            className="flex-1 px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg transition-colors"
          >
            Done ({selectedSources.length})
          </button>
        </div>
      </div>
    </div>
  );
};
