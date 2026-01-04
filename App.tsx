
import React, { useState, useMemo, useEffect } from 'react';
import { Tab, AppItem, TodayStory } from './types';
import NavBar from './components/NavBar';
import TodaySection from './components/TodaySection';
import SearchSection from './components/SearchSection';
import AppCard from './components/AppCard';
import AppDetails from './components/AppDetails';
import AdminSection from './components/AdminSection';
import { Moon, Sun } from 'lucide-react';

const ProfileHeader: React.FC<{ title: string; darkMode: boolean; toggleDark: () => void }> = ({ title, darkMode, toggleDark }) => (
  <header className="flex justify-between items-end">
    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{title}</h1>
    <button 
      onClick={toggleDark}
      className="w-10 h-10 rounded-full bg-blue-100 dark:bg-zinc-800 flex items-center justify-center text-blue-500 font-bold text-lg border-2 border-white dark:border-white/10 shadow-sm transition-transform active:scale-90"
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  </header>
);

const GenericGrid: React.FC<{ 
  title: string; 
  apps: AppItem[]; 
  onAppClick: (app: AppItem) => void;
  darkMode: boolean;
  toggleDark: () => void;
  lang: 'zh' | 'en';
}> = ({ title, apps, onAppClick, darkMode, toggleDark, lang }) => {
  const [activeCategory, setActiveCategory] = useState(lang === 'zh' ? '全部' : 'All');
  
  const categories = useMemo(() => {
    const cats = [lang === 'zh' ? '全部' : 'All', ...new Set(apps.map(a => a.category))];
    return cats;
  }, [apps, lang]);

  const filteredApps = useMemo(() => {
    if (activeCategory === 'All' || activeCategory === '全部') return apps;
    return apps.filter(a => a.category === activeCategory);
  }, [apps, activeCategory]);

  return (
    <div className="p-5 pb-24 max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <ProfileHeader title={title} darkMode={darkMode} toggleDark={toggleDark} />

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {lang === 'zh' ? '精选内容' : 'Featured'}
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {filteredApps.map(app => (
              <AppCard key={app.id} app={app} onClick={onAppClick} variant="large" lang={lang} />
            ))}
            {filteredApps.length === 0 && (
              <div className="w-full flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl">
                <p className="text-gray-400 text-sm">{lang === 'zh' ? '暂无应用，请在“管理”页添加' : 'No apps available.'}</p>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{lang === 'zh' ? '所有库' : 'Library'}</h2>
          </div>
          <div className="space-y-0.5 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden px-4 py-1 shadow-sm border border-gray-100 dark:border-white/5">
            {filteredApps.map(app => (
              <AppCard key={app.id} app={app} onClick={onAppClick} lang={lang} />
            ))}
            {filteredApps.length === 0 && <p className="text-gray-400 py-10 text-center">{lang === 'zh' ? '空空如也' : 'Nothing here'}</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Today');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  
  // 持久化内容状态
  const [apps, setApps] = useState<AppItem[]>(() => {
    const saved = localStorage.getItem('user_apps');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [stories, setStories] = useState<TodayStory[]>(() => {
    const saved = localStorage.getItem('user_stories');
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
       return document.documentElement.classList.contains('dark') || 
              window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('user_apps', JSON.stringify(apps));
  }, [apps]);

  useEffect(() => {
    localStorage.setItem('user_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    const userLang = navigator.language.toLowerCase();
    if (userLang.includes('zh')) setLang('zh');
    else setLang('en');
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const toggleDark = () => setDarkMode(!darkMode);

  const labels = {
    zh: { Games: '游戏', Apps: '应用' },
    en: { Games: 'Games', Apps: 'Apps' }
  }[lang];

  const renderContent = () => {
    switch (activeTab) {
      case 'Today':
        return <TodaySection stories={stories} darkMode={darkMode} toggleDark={toggleDark} lang={lang} />;
      case 'Games':
        return <GenericGrid title={labels.Games} apps={apps.filter(a => a.category === '游戏' || a.category === 'Games')} onAppClick={setSelectedApp} darkMode={darkMode} toggleDark={toggleDark} lang={lang} />;
      case 'Apps':
        return <GenericGrid title={labels.Apps} apps={apps.filter(a => a.category !== '游戏' && a.category !== 'Games')} onAppClick={setSelectedApp} darkMode={darkMode} toggleDark={toggleDark} lang={lang} />;
      case 'Search':
        return <SearchSection apps={apps} darkMode={darkMode} toggleDark={toggleDark} lang={lang} />;
      case 'Admin':
        return <AdminSection apps={apps} stories={stories} setApps={setApps} setStories={setStories} lang={lang} />;
      default:
        return <TodaySection stories={stories} darkMode={darkMode} toggleDark={toggleDark} lang={lang} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f7] dark:bg-black transition-colors duration-300">
      {renderContent()}
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} />
      {selectedApp && <AppDetails app={selectedApp} onClose={() => setSelectedApp(null)} lang={lang} />}
    </div>
  );
};

export default App;
