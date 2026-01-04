
import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, Star, Box, Moon, Sun } from 'lucide-react';
import AppCard from './AppCard';
import { AppItem } from '../types';
import AppDetails from './AppDetails';

interface SearchSectionProps {
  apps: AppItem[];
  darkMode: boolean;
  toggleDark: () => void;
  lang: 'zh' | 'en';
}

const SearchSection: React.FC<SearchSectionProps> = ({ apps, darkMode, toggleDark, lang }) => {
  const [query, setQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);

  const t = {
    header: lang === 'zh' ? '搜索' : 'Search',
    plh: lang === 'zh' ? '搜索您的应用...' : 'Search your apps...',
    storeResults: lang === 'zh' ? '结果' : 'Results',
    empty: lang === 'zh' ? '输入名称开始搜索' : 'Type to start searching',
    noMatch: lang === 'zh' ? '未找到匹配的应用' : 'No matching apps found'
  };

  const localResults = useMemo(() => {
    if (!query.trim()) return [];
    return apps.filter(app => 
      app.name.toLowerCase().includes(query.toLowerCase()) ||
      app.category.toLowerCase().includes(query.toLowerCase()) ||
      (app.subtitle && app.subtitle.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, apps]);

  return (
    <div className="p-5 pb-24 max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t.header}</h1>
        <button 
          onClick={toggleDark}
          className="w-10 h-10 rounded-full bg-blue-100 dark:bg-zinc-800 flex items-center justify-center text-blue-500 font-bold text-lg border-2 border-white dark:border-white/10 shadow-sm transition-transform active:scale-90"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.plh}
          className="w-full bg-gray-200/80 dark:bg-zinc-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-gray-900 dark:text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
      </div>

      <div className="space-y-8">
        {localResults.length > 0 ? (
          <section className="space-y-4">
             <div className="flex items-center gap-2 text-gray-500">
              <Box size={18} />
              <span className="text-sm font-bold uppercase tracking-wider">{t.storeResults}</span>
            </div>
            <div className="space-y-1">
              {localResults.map(app => (
                <AppCard key={app.id} app={app} onClick={setSelectedApp} lang={lang} />
              ))}
            </div>
          </section>
        ) : query.trim() !== '' ? (
          <div className="text-center py-20 text-gray-400 font-medium">{t.noMatch}</div>
        ) : (
          <div className="text-center py-20 text-gray-400 font-medium">{t.empty}</div>
        )}
      </div>

      {selectedApp && (
        <AppDetails app={selectedApp} onClose={() => setSelectedApp(null)} lang={lang} />
      )}
    </div>
  );
};

export default SearchSection;
