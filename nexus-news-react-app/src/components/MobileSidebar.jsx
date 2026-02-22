import React from 'react';
import { CATEGORIES } from '../constants/categories';
import { Search } from 'lucide-react';

export const MobileSidebar = ({ 
  isMenuOpen, 
  activeTab, 
  setActiveTab, 
  setIsMenuOpen, 
  searchQuery, 
  setSearchQuery, 
  handleSearch 
}) => {
  return (
    <div className={`fixed inset-0 z-40 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl transition-all duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-40 h-40 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-linear-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      
      <div className="pt-28 px-6 flex flex-col gap-4 relative z-10 h-full overflow-y-auto">
        {CATEGORIES.map((cat, idx) => (
          <button
            key={cat.id}
            onClick={() => { setActiveTab(cat.id); setIsMenuOpen(false); setSearchQuery(''); }}
            className={`relative group flex items-center gap-4 text-xl font-bold py-4 px-5 rounded-2xl transition-all duration-300 ${
              activeTab === cat.id 
                ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
                : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
            }`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <span className={`transition-transform duration-300 ${activeTab === cat.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {cat.icon}
            </span>
            {cat.label}
            {activeTab === cat.id && (
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-30 -z-10"></div>
            )}
          </button>
        ))}
        
        <form onSubmit={(e) => { handleSearch(e); setIsMenuOpen(false); }} className="relative mt-6 group">
          <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl group-focus-within:opacity-100 opacity-0 transition-opacity"></div>
          <input 
            type="text"
            placeholder="Search breaking news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="relative w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl py-4 px-5 pr-12 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors">
            <Search size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
