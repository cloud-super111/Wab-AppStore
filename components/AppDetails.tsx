
import React, { useState, useEffect } from 'react';
import { Star, Share, ChevronLeft, Send, AlertCircle } from 'lucide-react';
import { AppItem, Review } from '../types';
import { getAppGeniusInsight } from '../services/geminiService';

interface AppDetailsProps {
  app: AppItem;
  onClose: () => void;
  lang: 'zh' | 'en';
}

const AppDetails: React.FC<AppDetailsProps> = ({ app, onClose, lang }) => {
  const [insight, setInsight] = useState<string>(lang === 'zh' ? "正在加载 AI 洞察..." : "Loading AI insights...");
  const [reviews, setReviews] = useState<Review[]>(app.userReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAppGeniusInsight(app.name).then(setInsight);
  }, [app.name]);

  const t = {
    back: lang === 'zh' ? '返回' : 'Back',
    get: (price: string) => (price === 'Free' || price === '免费' ? (lang === 'zh' ? '获取' : 'GET') : price),
    rating: lang === 'zh' ? '评分' : 'Rating',
    age: lang === 'zh' ? '年龄' : 'Age',
    chart: lang === 'zh' ? '排行榜' : 'Chart',
    dev: lang === 'zh' ? '开发者' : 'Developer',
    new: lang === 'zh' ? '新功能' : "What's New",
    aiLabel: lang === 'zh' ? '星云 AI 洞察' : 'Nebula AI Insight',
    desc: lang === 'zh' ? '描述' : 'Description',
    revHeader: lang === 'zh' ? '评分与评论' : 'Ratings & Reviews',
    outOf: lang === 'zh' ? '满分 5 分' : 'out of 5',
    writeRev: lang === 'zh' ? '撰写评论' : 'Write a Review',
    ratePrompt: lang === 'zh' ? '评价您的体验' : 'Rate your experience',
    titlePlh: lang === 'zh' ? '标题' : 'Title',
    commentPlh: lang === 'zh' ? '评论' : 'Comment',
    submit: lang === 'zh' ? '提交' : 'Submit',
    submitting: lang === 'zh' ? '正在提交...' : 'Submitting...',
    noRev: lang === 'zh' ? '暂无评论。快来抢首评吧！' : 'No reviews yet. Be the first to rate!',
    pending: lang === 'zh' ? '等待审核' : 'Pending Moderation',
    years: lang === 'zh' ? '岁' : 'Years Old'
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0 || !newComment || !newTitle) return;
    
    setSubmitting(true);
    setTimeout(() => {
      const review: Review = {
        id: Date.now().toString(),
        user: lang === 'zh' ? "您" : "You",
        rating: newRating,
        date: lang === 'zh' ? "刚刚" : "Just now",
        title: newTitle,
        comment: newComment,
        isModerated: false
      };
      setReviews([review, ...reviews]);
      setNewRating(0);
      setNewComment("");
      setNewTitle("");
      setShowReviewForm(false);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-black z-[100] overflow-y-auto animate-in slide-in-from-bottom duration-300">
      <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-10 px-4 py-3 flex justify-between items-center border-b border-gray-100 dark:border-white/10">
        <button onClick={onClose} className="text-blue-500 flex items-center font-medium">
          <ChevronLeft size={24} />
          <span>{t.back}</span>
        </button>
        <button className="bg-blue-500 text-white font-bold px-6 py-1 rounded-full text-sm">
          {t.get(app.price)}
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="flex gap-4">
          <img src={app.icon} alt={app.name} className="w-28 h-28 rounded-3xl shadow-xl object-cover" />
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{app.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{app.subtitle}</p>
            <div className="flex items-center gap-2 mt-4">
              <button className="bg-blue-500 text-white font-bold px-8 py-1.5 rounded-full text-sm">{t.get('Free')}</button>
              <button className="p-2 text-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-full"><Share size={18} /></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 border-y border-gray-100 dark:border-white/10 py-4 text-center">
          <div className="flex flex-col border-r border-gray-100 dark:border-white/10 last:border-0">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.rating}</span>
            <span className="text-lg font-bold text-gray-700 dark:text-gray-200 flex items-center justify-center gap-0.5">{app.rating}<Star size={12} className="fill-current" /></span>
            <span className="text-[10px] text-gray-400">{app.reviewsCount} {lang === 'zh' ? '条评分' : 'Ratings'}</span>
          </div>
          <div className="flex flex-col border-r border-gray-100 dark:border-white/10 last:border-0">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.age}</span>
            <span className="text-lg font-bold text-gray-700 dark:text-gray-200">{app.ageRating}</span>
            <span className="text-[10px] text-gray-400">{t.years}</span>
          </div>
          <div className="flex flex-col border-r border-gray-100 dark:border-white/10 last:border-0">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.chart}</span>
            <span className="text-lg font-bold text-gray-700 dark:text-gray-200">#1</span>
            <span className="text-[10px] text-gray-400 truncate">{app.category}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.dev}</span>
            <span className="text-lg font-bold text-gray-700 dark:text-gray-200 truncate px-1">{lang === 'zh' ? '厂商' : 'Dev'}</span>
            <span className="text-[10px] text-gray-400 truncate">{app.developer}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold dark:text-white">{t.new}</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {app.screenshots.map((src, i) => (
              <img key={i} src={src} className="h-96 rounded-2xl shadow-sm" alt="Screenshot" />
            ))}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30">
           <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-500 rounded-full p-1 text-white">
                <Star size={12} />
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t.aiLabel}</span>
           </div>
           <p className="text-gray-700 dark:text-gray-300 text-sm italic font-medium">"{insight}"</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold dark:text-white">{t.desc}</h2>
          <p className="text-gray-700 dark:text-gray-400 leading-relaxed text-sm">{app.description}</p>
        </div>

        <div className="space-y-6 pt-4">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xl font-bold dark:text-white">{t.revHeader}</h2>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-extrabold text-gray-800 dark:text-white">{app.rating}</span>
                <div className="text-gray-400 text-xs font-bold uppercase">{t.outOf}</div>
              </div>
            </div>
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="text-blue-500 font-medium text-sm">{t.writeRev}</button>
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-4 border border-gray-200 dark:border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="font-bold text-sm mb-3 dark:text-white">{t.ratePrompt}</h3>
              <div className="flex gap-2 mb-4">
                {[1,2,3,4,5].map(i => (
                  <button type="button" key={i} onClick={() => setNewRating(i)}>
                    <Star size={24} className={i <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-zinc-700'} />
                  </button>
                ))}
              </div>
              <input type="text" placeholder={t.titlePlh} value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm mb-2 outline-none focus:border-blue-500 dark:text-white" />
              <textarea placeholder={t.commentPlh} value={newComment} onChange={e => setNewComment(e.target.value)} className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-blue-500 min-h-[80px] dark:text-white" />
              <button disabled={submitting || newRating === 0} className="w-full bg-blue-500 text-white font-bold py-2 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting ? t.submitting : <><Send size={16}/> {t.submit}</>}
              </button>
            </form>
          )}

          <div className="space-y-4 pb-20">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t.noRev}</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-4 space-y-2 relative border border-transparent dark:border-white/5">
                  {!review.isModerated && (
                    <div className="absolute top-2 right-4 flex items-center gap-1 text-[10px] text-orange-500 font-bold uppercase">
                      <AlertCircle size={10} /> {t.pending}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex text-yellow-400">
                      {Array.from({length: 5}).map((_, i) => (
                        <Star key={i} size={10} className={i < review.rating ? 'fill-current' : 'text-gray-200 dark:text-zinc-800'} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{review.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{review.title}</h4>
                    <span className="text-xs text-gray-500">{review.user}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-400 leading-snug">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetails;
