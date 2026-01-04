
import React from 'react';
import { AppItem } from '../types';

interface AppCardProps {
  app: AppItem;
  onClick: (app: AppItem) => void;
  variant?: 'list' | 'large';
  lang?: 'zh' | 'en';
}

const AppCard: React.FC<AppCardProps> = ({ app, onClick, variant = 'list', lang = 'en' }) => {
  const getBtnLabel = (price: string) => {
    if (price === 'Free' || price === '免费') return lang === 'zh' ? '获取' : 'GET';
    return price;
  };

  if (variant === 'large') {
    return (
      <div 
        onClick={() => onClick(app)}
        className="relative flex-shrink-0 w-80 h-56 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform active:scale-95 transition-transform"
      >
        <img src={app.screenshots[0]} alt={app.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
          <div className="flex items-center gap-3">
            <img src={app.icon} alt={app.name} className="w-12 h-12 rounded-xl border border-white/20" />
            <div className="text-white">
              <h3 className="font-bold text-lg leading-tight">{app.name}</h3>
              <p className="text-xs text-white/80 line-clamp-1">{app.subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onClick(app)}
      className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-white/5 last:border-0 active:bg-gray-50 dark:active:bg-white/5 transition-colors cursor-pointer"
    >
      <img src={app.icon} alt={app.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">{app.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{app.subtitle}</p>
      </div>
      <div className="flex flex-col items-center">
        <button className="bg-gray-100 dark:bg-zinc-800 text-blue-500 font-bold px-5 py-1.5 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
          {getBtnLabel(app.price)}
        </button>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{lang === 'zh' ? 'App 内购买' : 'In-App Purchases'}</span>
      </div>
    </div>
  );
};

export default AppCard;
