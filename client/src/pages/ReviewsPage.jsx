import React, { useState } from 'react';
import { Star, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function ReviewsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 🌟 12 筆長短不一的模擬數據，完美展示瀑布流效果
  const allReviews = [
    { id: 1, stars: 5, name: "David & Sarah", country: "🇬🇧 United Kingdom", avatar: "D", text: "Absolutely amazing experience! The A180 was perfectly equipped for our 7-day trip around Taiwan's east coast. Waking up to the ocean view from the bed was priceless.", image: "/images/vibe-drive.jpg" },
    { id: 2, stars: 5, name: "陳先生一家", country: "🇹🇼 Taiwan", avatar: "陳", text: "第一次體驗車泊就愛上了！車子非常好開，冷氣夠冷，營區補電也很方便。老闆交車講解得超級詳細，讓我們整趟旅程非常安心！大推！", image: null },
    { id: 3, stars: 4, name: "Marcus", country: "🇩🇪 Germany", avatar: "M", text: "Very comfortable campervan. The folding table and chairs provided were great for our outdoor dinners. Will definitely rent again next year!", image: null },
    { id: 4, stars: 5, name: "Liad", country: "🇮🇱 Israel", avatar: "L", text: "We had the best time exploring Taroko Gorge. The battery lasted all night for the AC. Smooth booking process and very responsive support on WhatsApp.", image: null },
    { id: 5, stars: 5, name: "林小姐", country: "🇹🇼 Taiwan", avatar: "林", text: "太棒的體驗！車內空間規劃得很用心，裝備齊全到我們幾乎只要帶換洗衣物就能出發。睡墊意外地好睡，大推給想嘗試 Vanlife 的朋友！", image: null },
    { id: 6, stars: 5, name: "Kenji", country: "🇯🇵 Japan", avatar: "健", text: "初めての台湾キャンピングカー旅行でしたが、スタッフのサポートが素晴らしく、安心して楽しめました。車内もとても清潔でした。", image: null },
    { id: 7, stars: 4, name: "Chloe", country: "🇫🇷 France", avatar: "C", text: "Beautiful scenery and a great van. Driving in Taipei traffic was a bit scary, but once we got to the mountains, it was paradise.", image: null },
    { id: 8, stars: 5, name: "黃同學", country: "🇭🇰 Hong Kong", avatar: "黃", text: "同朋友一齊租咗架車去墾丁，真係好正！夜晚開住冷氣瞓覺完全唔熱，車邊帳超實用，我哋夜晚就喺車邊飲啤酒傾偈，超有氣氛！下次一定會再租！", image: "/images/logo-stack.jpg" },
    { id: 9, stars: 5, name: "Emily", country: "🇺🇸 United States", avatar: "E", text: "The perfect way to see Taiwan! We skipped the crowded hotels and woke up in nature every day. The provided cookware made it easy to make coffee and breakfast by the beach.", image: null },
    { id: 10, stars: 5, name: "王先生", country: "🇹🇼 Taiwan", avatar: "王", text: "原本擔心高個子會睡不好，結果床鋪意外的寬敞舒服。大推給想遠離都市塵囂的人。", image: null },
    { id: 11, stars: 4, name: "Siti", country: "🇸🇬 Singapore", avatar: "S", text: "Great vehicle and very clean. The AC was a lifesaver during the humid nights. Checking in and out was a breeze.", image: null },
    { id: 12, stars: 5, name: "Liam", country: "🇦🇺 Australia", avatar: "L", text: "Mate, this is the way to do it. Drove down the east coast, surfed every day, slept right by the break. The battery system is top notch, never ran out of juice. 10/10.", image: null }
  ];

  // 控制顯示數量的 State (初始顯示 6 筆)
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    // 模擬網路延遲 0.8 秒，讓使用者有「載入中」的尊榮感
    setTimeout(() => {
      setVisibleCount(prev => prev + 6);
      setIsLoading(false);
    }, 800);
  };

  const visibleReviews = allReviews.slice(0, visibleCount);
  const hasMore = visibleCount < allReviews.length;

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      
      {/* 標題區塊 */}
      <div className="container mx-auto px-6 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">{t('reviews.title', 'Traveler Stories')}</h1>
        <p className="text-stone-500 font-bold tracking-widest uppercase text-sm">{t('reviews.subtitle', 'Real experiences from our global vanlifers')}</p>
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* 🌟 瀑布流版面核心 (Masonry Layout) 
            重點：columns-1, md:columns-2, lg:columns-3 自動分欄
            裡面的卡片用 break-inside-avoid 避免被切斷 */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
          {visibleReviews.map((review) => (
            <div 
              key={review.id} 
              className="break-inside-avoid mb-8 bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* 照片 (如果有上傳) */}
              {review.image && (
                <div className="w-full h-48 bg-stone-100 rounded-2xl mb-6 overflow-hidden">
                  <img src={review.image} alt="Trip" className="w-full h-full object-cover" />
                </div>
              )}

              {/* 星星評分 */}
              <div className="flex gap-1 text-orange-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} fill={i < review.stars ? "currentColor" : "none"} className={i >= review.stars ? "text-stone-300" : ""} size={18} />
                ))}
              </div>
              
              {/* 評價內容 */}
              <p className="text-stone-600 leading-relaxed mb-8 text-lg">"{review.text}"</p>
              
              {/* 使用者資訊 */}
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-stone-100">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-bold text-stone-900 leading-tight">{review.name}</p>
                  <p className="text-xs text-stone-400 mt-1">{review.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🌟 載入更多按鈕 */}
        <div className="mt-12 text-center">
          {hasMore ? (
            <button 
              onClick={handleLoadMore}
              disabled={isLoading}
              className="bg-stone-900 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 mx-auto disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
              {isLoading ? 'Loading...' : t('reviews.btnLoadMore', 'Load More Reviews')}
            </button>
          ) : (
            <div className="inline-block bg-stone-200 text-stone-500 px-8 py-4 rounded-full font-bold text-sm">
              {t('reviews.noMore', "You've reached the end! Time to make your own story.")}
            </div>
          )}
        </div>

        {/* 導向預約的 CTA */}
        {!hasMore && (
           <div className="mt-16 text-center animate-fade-in">
              <button 
                onClick={() => navigate('/booking')}
                className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] hover:-translate-y-1"
              >
                Start Your Journey Now
              </button>
           </div>
        )}

      </div>
    </div>
  );
}