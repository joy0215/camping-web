import React, { useState, useEffect } from 'react';
import { Star, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function ReviewsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 🌟 真實資料 State
  const [allReviews, setAllReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginating, setIsPaginating] = useState(false);

  useEffect(() => {
    // 一進來就去後端把評價全部抓回來
    axiosClient.get('/reviews')
      .then(({ data }) => {
        if (data && data.length > 0) {
          const formatted = data.map(r => ({
            id: r.id,
            stars: r.rating,
            name: r.user_name,
            country: r.country === 'OTHER' ? '🌍' : r.country,
            avatar: r.user_avatar,
            text: r.comment,
            image: r.photo_url ? `https://camping-tour-api.onrender.com${r.photo_url}` : null
          }));
          setAllReviews(formatted);
        }
      })
      .catch(err => console.error("Fetch reviews failed:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleLoadMore = () => {
    setIsPaginating(true);
    // 模擬網路延遲讓特效流暢
    setTimeout(() => {
      setVisibleCount(prev => prev + 6);
      setIsPaginating(false);
    }, 600);
  };

  const visibleReviews = allReviews.slice(0, visibleCount);
  const hasMore = visibleCount < allReviews.length;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-stone-50"><Loader2 className="animate-spin text-orange-500 w-12 h-12" /></div>;
  }

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">{t('reviews.title', 'Traveler Stories')}</h1>
        <p className="text-stone-500 font-bold tracking-widest uppercase text-sm">{t('reviews.subtitle', 'Real experiences from our global vanlifers')}</p>
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        {allReviews.length === 0 ? (
          <div className="text-center py-20 text-stone-500">No reviews yet. Be the first to share your experience!</div>
        ) : (
          <>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
              {visibleReviews.map((review) => (
                <div key={review.id} className="break-inside-avoid mb-8 bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {review.image && (
                    <div className="w-full h-48 bg-stone-100 rounded-2xl mb-6 overflow-hidden">
                      <img src={review.image} alt="Trip" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex gap-1 text-orange-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} fill={i < review.stars ? "currentColor" : "none"} className={i >= review.stars ? "text-stone-300" : ""} size={18} />
                    ))}
                  </div>
                  <p className="text-stone-600 leading-relaxed mb-8 text-lg">"{review.text}"</p>
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

            <div className="mt-12 text-center">
              {hasMore ? (
                <button onClick={handleLoadMore} disabled={isPaginating} className="bg-stone-900 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 mx-auto hover:-translate-y-1 disabled:opacity-70">
                  {isPaginating ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                  {isPaginating ? 'Loading...' : t('reviews.btnLoadMore', 'Load More Reviews')}
                </button>
              ) : (
                <div className="inline-block bg-stone-200 text-stone-500 px-8 py-4 rounded-full font-bold text-sm">
                  {t('reviews.noMore', "You've reached the end! Time to make your own story.")}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}