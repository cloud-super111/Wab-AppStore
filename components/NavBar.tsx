
import React from 'react';
import { LayoutGrid, Gamepad2, Layers, Search, Calendar, Settings } from 'lucide-react';
import { Tab } from '../types';

interface NavBarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  lang: 'zh' | 'en';
}

const NavBar: React.FC<NavBarProps> = ({ activeTab, setActiveTab, lang }) => {
  const labels = {
    zh: { Today: '今天', Games: '游戏', Apps: '应用', Arcade: 'Arcade', Search: '搜索', Admin: '管理' },
    en: { Today: 'Today', Games: 'Games', Apps: 'Apps', Arcade: 'Arcade', Search: 'Search', Admin: 'Admin' }
  }[lang];

  const tabs = [
    { id: 'Today', icon: Calendar, label: labels.Today },
    { id: 'Games', icon: Gamepad2, label: labels.Games },
    { id: 'Apps', icon: LayoutGrid, label: labels.Apps },
    { id: 'Search', icon: Search, label: labels.Search },
    { id: 'Admin', icon: Settings, label: labels.Admin },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-gray-200 dark:border-white/10 safe-area-pb z-50 transition-colors duration-300">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <tab.icon size={22} className={activeTab === tab.id ? 'fill-current' : ''} />
            <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
