import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { NewsCard } from './NewsCard';

export const NewsGrid = ({ 
  articles, 
  loading, 
  searchQuery, 
  activeTab, 
  onClearFilters 
}) => {
  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-indigo-500 rounded-lg blur-md opacity-50"></div>
            <div className="relative bg-linear-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Sparkles className="text-white" size={20} />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight bg-linear-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
            {searchQuery ? `Results for "${searchQuery}"` : `${activeTab} Headlines`}
          </h2>
        </div>
        <div className="h-px grow mx-8 bg-linear-to-r from-transparent via-slate-700 to-transparent hidden xl:block" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-125 bg-linear-to-br from-slate-900 to-slate-800 animate-shimmer rounded-3xl ring-1 ring-white/5" />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((article, idx) => (
            <div
              key={article._id?.$oid || idx}
              style={{ animationDelay: `${idx * 50}ms` }}
              className="animate-fade-in"
            >
              <NewsCard article={article} />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative text-center py-24 border-2 border-dashed border-slate-700/50 rounded-3xl bg-linear-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5"></div>
          
          <div className="relative z-10">
            <div className="inline-block relative mb-6">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20"></div>
              <div className="relative bg-slate-800/50 p-6 rounded-full backdrop-blur-sm border border-slate-700/50">
                <Search size={56} className="text-slate-600" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold bg-linear-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent mb-3">
              No articles found
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
              We couldn't find any news matching your criteria. Try searching for something else or explore different categories.
            </p>
            
            <button 
              onClick={onClearFilters}
              className="relative group/btn inline-block"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full blur-lg opacity-50 group-hover/btn:opacity-100 transition-opacity"></div>
              <div className="relative px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-bold transition-all duration-300 shadow-xl shadow-blue-500/30">
                Clear Filters & Explore
              </div>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
