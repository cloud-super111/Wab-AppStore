
import React from 'react';
import { TodayStory } from '../types';
import { Moon, Sun } from 'lucide-react';

interface TodaySectionProps {
  stories: TodayStory[];
  darkMode: boolean;
  toggleDark: () => void;
  lang: 'zh' | 'en';
}

const TodaySection: React.FC<TodaySectionProps> = ({ stories, darkMode, toggleDark, lang }) => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = lang === 'zh' 
    ? `${today.getMonth() + 1}月${today.getDate()}日 ${['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][today.getDay()]}`
    : today.toLocaleDateString('en-US', options).toUpperCase();

  return (
    <div className="p-5 pb-24 max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold tracking-wider">{formattedDate}</p>
        <div className="flex justify-between items-end mt-1">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{lang === 'zh' ? '今天' : 'Today'}</h1>
          <button 
            onClick={toggleDark}
            className="w-10 h-10 rounded-full bg-blue-100 dark:bg-zinc-800 flex items-center justify-center text-blue-500 font-bold text-lg border-2 border-white dark:border-white/10 shadow-sm transition-transform active:scale-90"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl">
          <p className="text-gray-400 text-sm font-medium">{lang === 'zh' ? '暂无故事，请在“管理”页添加内容' : 'No stories yet. Add some in Admin.'}</p>
        </div>
      ) : (
        stories.map((story) => (
          <div 
            key={story.id} 
            className="group relative h-[450px] rounded-3xl overflow-hidden shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          >
            <img 
              src={story.imageUrl || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800'} 
              alt={story.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-between">
              <div>
                <p className="text-white/70 text-sm font-bold uppercase tracking-widest">{story.category}</p>
                <h2 className="text-3xl font-bold text-white mt-2 leading-tight drop-shadow-md">{story.title}</h2>
              </div>
              <p className="text-white/90 text-lg leading-snug line-clamp-2">{story.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TodaySection;
