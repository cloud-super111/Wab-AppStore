
import React, { useState } from 'react';
import { Plus, Trash2, Layout, BookOpen, Lock, Copy, Check, LogOut, Upload } from 'lucide-react';
import { AppItem, TodayStory } from '../types';

interface AdminSectionProps {
  apps: AppItem[];
  stories: TodayStory[];
  setApps: (apps: AppItem[]) => void;
  setStories: (stories: TodayStory[]) => void;
  lang: 'zh' | 'en';
}

const AdminSection: React.FC<AdminSectionProps> = ({ apps, stories, setApps, setStories, lang }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeMode, setActiveMode] = useState<'apps' | 'stories' | 'sync'>('apps');
  const [copied, setCopied] = useState(false);
  
  // 管理员密码
  const ADMIN_PASSWORD = 'admin888';

  // App Form State
  const [appForm, setAppForm] = useState({
    name: '', subtitle: '', category: '工具', price: '免费', icon: '', description: ''
  });

  // Story Form State
  const [storyForm, setStoryForm] = useState({
    title: '', category: '推荐', imageUrl: '', content: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const addApp = () => {
    if (!appForm.name) return;
    const newApp: AppItem = {
      ...appForm,
      id: Date.now().toString(),
      rating: 5.0,
      reviewsCount: '0',
      // Provide a fallback icon if URL is empty
      screenshots: [appForm.icon || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800'],
      developer: '系统管理员',
      ageRating: '4+',
      userReviews: []
    };
    setApps([...apps, newApp]);
    setAppForm({ name: '', subtitle: '', category: '工具', price: '免费', icon: '', description: '' });
  };

  const addStory = () => {
    if (!storyForm.title) return;
    const newStory: TodayStory = {
      ...storyForm,
      id: Date.now().toString(),
    };
    setStories([...stories, newStory]);
    setStoryForm({ title: '', category: '推荐', imageUrl: '', content: '' });
  };

  const deleteApp = (id: string) => setApps(apps.filter(a => a.id !== id));
  const deleteStory = (id: string) => setStories(stories.filter(s => s.id !== id));

  const exportData = () => {
    const data = JSON.stringify({ apps, stories });
    navigator.clipboard.writeText(data).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const importData = () => {
    const input = prompt(lang === 'zh' ? '请粘贴由本系统导出的 JSON 同步代码：' : 'Paste the exported JSON sync code:');
    if (input) {
      try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed.apps) && Array.isArray(parsed.stories)) {
          setApps(parsed.apps);
          setStories(parsed.stories);
          alert(lang === 'zh' ? '同步成功！内容已更新。' : 'Sync successful! Content updated.');
        } else {
          throw new Error('Format incorrect');
        }
      } catch (e) {
        alert(lang === 'zh' ? '无效的同步代码格式。' : 'Invalid sync code format.');
      }
    }
  };

  const t = lang === 'zh' ? {
    title: '后台管理',
    login: '管理员认证',
    pwdPlh: '请输入后台密码',
    submit: '登录',
    apps: '应用管理',
    stories: '故事管理',
    sync: '同步导出',
    name: '应用名称',
    subtitle: '副标题',
    icon: '图标链接 (URL)',
    desc: '详细描述',
    price: '显示价格 (如: 免费)',
    cat: '分类 (如: 游戏)',
    save: '确认添加',
    logout: '注销登录',
    exportDesc: '点击下方按钮复制数据，然后在其他浏览器中通过导入功能实现同步。',
    importDesc: '如果您在其他浏览器中导出了数据，请在此处点击导入并粘贴代码。',
    copy: '复制同步代码',
    import: '导入同步代码'
  } : {
    title: 'Admin Console',
    login: 'Admin Login',
    pwdPlh: 'Enter password',
    submit: 'Login',
    apps: 'Apps',
    stories: 'Stories',
    sync: 'Sync Data',
    name: 'Name',
    subtitle: 'Subtitle',
    icon: 'Icon URL',
    desc: 'Description',
    price: 'Price (e.g. Free)',
    cat: 'Category',
    save: 'Save Item',
    logout: 'Logout',
    exportDesc: 'Copy the data below and use the import function in other browsers to sync.',
    importDesc: 'If you exported data from another browser, click import and paste the code.',
    copy: 'Copy Sync Code',
    import: 'Import Sync Code'
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 dark:border-white/5 text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl rotate-3">
            <Lock size={44} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t.login}</h2>
            <p className="text-gray-400 text-xs mt-2 font-medium tracking-widest uppercase">Default password: admin888</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.pwdPlh}
              className={`w-full bg-gray-50 dark:bg-zinc-800 rounded-2xl px-5 py-4 outline-none transition-all dark:text-white border-2 text-center text-lg tracking-widest ${loginError ? 'border-red-500 animate-shake' : 'border-transparent focus:border-blue-500'}`}
            />
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl active:scale-95 transition-all shadow-lg shadow-blue-500/30">
              {t.submit}
            </button>
          </form>
        </div>
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="p-5 pb-24 max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t.title}</h1>
        <button 
          onClick={() => setIsLoggedIn(false)} 
          className="bg-gray-200 dark:bg-zinc-800 p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
      
      <div className="flex bg-gray-200/50 dark:bg-zinc-800/50 p-1.5 rounded-2xl backdrop-blur-sm">
        {(['apps', 'stories', 'sync'] as const).map((mode) => (
          <button 
            key={mode}
            onClick={() => setActiveMode(mode)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeMode === mode ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            {mode === 'apps' && <Layout size={14} />}
            {mode === 'stories' && <BookOpen size={14} />}
            {mode === 'sync' && <Copy size={14} />}
            {t[mode as keyof typeof t]}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeMode === 'apps' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 space-y-3">
              <input placeholder={t.name} value={appForm.name} onChange={e => setAppForm({...appForm, name: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              <input placeholder={t.subtitle} value={appForm.subtitle} onChange={e => setAppForm({...appForm, subtitle: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              <input placeholder={t.icon} value={appForm.icon} onChange={e => setAppForm({...appForm, icon: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              <textarea placeholder={t.desc} value={appForm.description} onChange={e => setAppForm({...appForm, description: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white min-h-[100px]" />
              <div className="flex gap-2">
                <input placeholder={t.cat} value={appForm.category} onChange={e => setAppForm({...appForm, category: e.target.value})} className="flex-1 bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                <input placeholder={t.price} value={appForm.price} onChange={e => setAppForm({...appForm, price: e.target.value})} className="flex-1 bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              </div>
              <button onClick={addApp} className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                <Plus size={18} /> {t.save}
              </button>
            </div>
            
            <div className="space-y-2">
              {apps.map(app => (
                <div key={app.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-3 flex items-center justify-between border border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <img src={app.icon || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-sm dark:text-white">{app.name}</h4>
                      <p className="text-[10px] text-gray-400">{app.category}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteApp(app.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMode === 'stories' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 space-y-3">
              <input placeholder={lang === 'zh' ? '故事标题' : 'Story Title'} value={storyForm.title} onChange={e => setStoryForm({...storyForm, title: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              <input placeholder={lang === 'zh' ? '封面图片链接' : 'Image URL'} value={storyForm.imageUrl} onChange={e => setStoryForm({...storyForm, imageUrl: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              <input placeholder={lang === 'zh' ? '分类 (如: 极速先锋)' : 'Category'} value={storyForm.category} onChange={e => setStoryForm({...storyForm, category: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              <textarea placeholder={lang === 'zh' ? '故事正文' : 'Story Content'} value={storyForm.content} onChange={e => setStoryForm({...storyForm, content: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white min-h-[100px]" />
              <button onClick={addStory} className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                <Plus size={18} /> {t.save}
              </button>
            </div>
            
            <div className="space-y-2">
              {stories.map(story => (
                <div key={story.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-3 flex items-center justify-between border border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <img src={story.imageUrl || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <h4 className="font-bold text-sm dark:text-white truncate max-w-[200px]">{story.title}</h4>
                  </div>
                  <button onClick={() => deleteStory(story.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMode === 'sync' && (
          <div className="space-y-6 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm text-center">
            <div className="space-y-2">
              <h3 className="font-bold text-lg dark:text-white">{t.sync}</h3>
              <p className="text-gray-500 text-sm">{t.exportDesc}</p>
            </div>
            <button 
              onClick={exportData}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${copied ? 'bg-green-500 text-white' : 'bg-blue-500 text-white shadow-blue-500/20'}`}
            >
              {copied ? <><Check size={20}/> {lang === 'zh' ? '已复制到剪贴板' : 'Copied!'}</> : <><Copy size={20}/> {t.copy}</>}
            </button>
            <div className="pt-4 border-t border-gray-100 dark:border-white/10">
              <p className="text-gray-500 text-sm mb-4">{t.importDesc}</p>
              <button 
                onClick={importData}
                className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
              >
                <Upload size={20} /> {t.import}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSection;
