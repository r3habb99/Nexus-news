import React from 'react';
import { Newspaper, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative border-t border-slate-800/50 py-12 bg-linear-to-br from-slate-950 to-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-linear-to-br from-indigo-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Brand section */}
          <div>
            <div className="flex items-center justify-center gap-3 mb-4 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-linear-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Newspaper className="text-white" size={28} />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-3xl font-black tracking-tighter bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent uppercase">
                  Nexus
                </span>
                <span className="text-3xl font-black tracking-tighter bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent uppercase">
                  News
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
              Your trusted source for real-time news across technology, business, and entertainment.
            </p>
          </div>
          
          {/* Bottom section */}
          <div className="pt-6 border-t border-slate-800/50 w-full flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-xs flex items-center gap-2">
              © 2026 Nexus News. 
              <span className="flex items-center gap-1">
                Made with <Heart size={12} className="text-red-500 animate-pulse" /> using NewsAPI
              </span>
            </p>
            <div className="flex gap-8 text-xs font-semibold text-slate-500">
              <button className="hover:text-white transition-colors uppercase tracking-widest hover:scale-105 transform duration-200">Privacy Policy</button>
              <button className="hover:text-white transition-colors uppercase tracking-widest hover:scale-105 transform duration-200">Terms of Service</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
