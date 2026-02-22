import React from 'react';
import { Newspaper, Search, Menu, X, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';

export const Navigation = ({ 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  isMenuOpen, 
  setIsMenuOpen,
  onLogoClick 
}) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-linear-to-b from-slate-950/95 via-slate-900/90 to-transparent backdrop-blur-xl border-b border-blue-500/20 shadow-2xl shadow-blue-500/10">
      <div className="absolute inset-0 bg-linear-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between relative">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={onLogoClick}>
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-linear-to-br from-blue-600 via-blue-500 to-indigo-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/50">
              <Newspaper className="text-white" size={26} />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black tracking-tighter bg-linear-to-r from-white via-blue-100 to-white bg-clip-text text-transparent uppercase">
              Nexus
            </span>
            <span className="text-2xl font-black tracking-tighter bg-linear-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent uppercase">
              News
            </span>
            <Sparkles className="text-blue-400 ml-1 animate-pulse" size={16} />
          </div>
        </div>

        {/* Scrollable categories for medium to large screens */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl mx-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 px-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveTab(cat.id); setSearchQuery(''); }}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 group/btn whitespace-nowrap ${
                  activeTab === cat.id && !searchQuery 
                    ? 'text-white bg-linear-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 scale-105' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className={`transition-transform duration-300 ${activeTab === cat.id && !searchQuery ? 'scale-110' : 'group-hover/btn:scale-110'}`}>
                  {cat.icon}
                </span>
                {cat.label}
                {activeTab === cat.id && !searchQuery && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-linear-to-r from-transparent via-blue-400 to-transparent"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSearch} className="hidden lg:flex relative w-64 group/search">
          <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-xl group-focus-within/search:opacity-100 opacity-0 transition-opacity"></div>
          <input 
            type="text"
            placeholder="Search breaking news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full relative bg-slate-900/80 border border-slate-700/50 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder:text-slate-500 backdrop-blur-sm"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors">
            <Search size={18} />
          </button>
        </form>

        <button 
          className="md:hidden text-slate-400 p-2.5 hover:bg-slate-800/50 rounded-xl transition-all duration-300 hover:text-white" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};
