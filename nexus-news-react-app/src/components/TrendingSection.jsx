import React from 'react';
import { TrendingUp, ExternalLink, Flame } from 'lucide-react';
import { DEFAULT_NEWS_IMAGE } from '../constants/images';

export const TrendingSection = ({ trending }) => {
  return (
    <section className="mb-20 relative">
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-linear-to-br from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      
      <div className="flex items-center gap-3 mb-8 relative">
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-red-500 rounded-xl blur-md opacity-50"></div>
          <div className="relative bg-linear-to-br from-orange-500 to-red-500 p-2.5 rounded-xl animate-glow">
            <TrendingUp className="text-white" size={26} />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent flex items-center gap-2">
            Trending Now
            <Flame className="text-orange-500 animate-pulse" size={24} />
          </h2>
          <p className="text-slate-500 text-sm font-medium">What's hot in the news right now</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {trending.length > 0 ? (
          trending.map((article, idx) => (
            <div 
              key={article.id || idx} 
              className="relative group rounded-3xl overflow-hidden aspect-video shadow-2xl ring-1 ring-white/10 hover:ring-blue-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-blue-500/20"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              
              <img 
                src={article.thumbnail || DEFAULT_NEWS_IMAGE} 
                alt={article.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                onError={(e) => { e.target.src = DEFAULT_NEWS_IMAGE; }}
              />
              
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-red-500 rounded-full blur-md"></div>
                    <span className="relative px-3 py-1 bg-linear-to-r from-orange-500 to-red-500 text-white font-bold text-xs rounded-full tracking-widest uppercase shadow-lg flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      #{idx + 1} Trending
                    </span>
                  </div>
                </div>
                
                <h3 className="text-white text-xl font-bold leading-tight line-clamp-2 mb-4 group-hover:text-blue-300 transition-colors duration-300">
                  {article.title}
                </h3>
                
                <a 
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-fit px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-sm font-semibold rounded-full transition-all duration-300 group/link border border-white/20 hover:border-white/40"
                >
                  Read Full Story 
                  <ExternalLink size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                </a>
              </div>
              
              <div className="absolute top-4 right-4 w-12 h-12 bg-linear-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-full flex items-center justify-center text-white font-black text-lg border border-white/20 z-20">
                {idx + 1}
              </div>
            </div>
          ))
        ) : (
          [1,2,3].map(i => (
            <div key={i} className="aspect-video bg-linear-to-br from-slate-900 to-slate-800 animate-shimmer rounded-3xl ring-1 ring-white/5" />
          ))
        )}
      </div>
    </section>
  );
};
