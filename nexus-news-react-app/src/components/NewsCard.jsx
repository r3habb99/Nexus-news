import React from 'react';
import { Globe, Clock, ChevronRight, Eye, BookmarkPlus, User } from 'lucide-react';
import { DEFAULT_NEWS_IMAGE } from '../constants/images';

export const NewsCard = ({ article }) => {
  // Use formatted data directly from articleFormatter
  const {
    // id,
    thumbnail,
    title,
    author,
    category,
    description,
    content,
    url,
    country,
    publishedAt,
    source
  } = article;

  return (
    <div className="group relative bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-3xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col h-full hover:scale-[1.02]">
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none z-10"></div>
      
      {/* Image section with enhanced effects */}
      <div className="relative h-52 overflow-hidden rounded-t-3xl">
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent z-10 opacity-60"></div>
        <img 
          src={thumbnail || DEFAULT_NEWS_IMAGE} 
          alt={title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          onError={(e) => { e.target.src = DEFAULT_NEWS_IMAGE; }}
        />
        
        {/* Category badge with gradient */}
        <div className="absolute top-3 left-3 flex gap-2 z-20">
          <div className="relative group/badge">
            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg blur-sm opacity-70"></div>
            <span className="relative block px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg transform group-hover/badge:scale-105 transition-transform">
              {category}
            </span>
          </div>
        </div>
        
        {/* Quick action buttons */}
        <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors border border-white/20" title="Quick view">
            <Eye size={14} className="text-white" />
          </button>
          <button className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors border border-white/20" title="Bookmark">
            <BookmarkPlus size={14} className="text-white" />
          </button>
        </div>
      </div>
      
      <div className="p-6 flex flex-col grow relative z-10">
        {/* Meta information with icons */}
        <div className="flex items-center gap-3 text-slate-400 text-xs mb-4 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-full">
            <Globe size={12} className="text-blue-400" />
            <span className="font-medium">{country || 'Global'}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-full">
            <Clock size={12} className="text-blue-400" />
            <span className="font-medium">
              {publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Recent'}
            </span>
          </div>
          {source && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 rounded-full">
              <span className="font-medium text-blue-400">{source}</span>
            </div>
          )}
        </div>

        {/* Title with gradient on hover */}
        <h3 className="text-lg font-bold text-slate-100 leading-snug mb-3 group-hover:bg-linear-to-r group-hover:from-blue-400 group-hover:to-indigo-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-slate-400 text-sm mb-4 line-clamp-2 italic opacity-90 font-light">
            "{description}"
          </p>
        )}

        <div className="mt-auto space-y-4">
          {/* Content (formatted clean sentence) */}
          {content && (
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-blue-500 to-indigo-500 rounded-full"></div>
              <p className="text-slate-300 text-sm pl-4 py-2 bg-linear-to-r from-slate-800/40 to-transparent rounded-r-xl leading-relaxed line-clamp-3">
                {content}
              </p>
            </div>
          )}
          
          {/* Footer with author and link */}
          <div className="flex items-center justify-between pt-5 border-t border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-tr from-blue-500 to-indigo-600 rounded-full blur-sm opacity-50"></div>
                <div className="relative w-10 h-10 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-lg ring-2 ring-slate-900">
                  {author && author.length > 0 ? author[0].toUpperCase() : <User size={16} />}
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-300 block truncate max-w-30 sm:max-w-37.5" title={author}>
                  {author || 'Unknown Author'}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Author</span>
              </div>
            </div>
            
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group/link"
              title="Read full article"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full blur-sm opacity-0 group-hover/link:opacity-70 transition-opacity"></div>
              <div className="relative flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/30">
                <span className="text-xs font-bold text-white">READ</span>
                <ChevronRight size={16} className="text-white group-hover/link:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
