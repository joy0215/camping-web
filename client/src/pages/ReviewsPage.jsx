import React, { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function ReviewsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 真實資料 State
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
    return <div className="min-h-screen flex items-center justify-center bg-stone-50"><Loader2 className="animate-spin text-stone-400 w-8 h-8" /></div>;
  }

  return (
    <div className="pt-24 md:pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <header className="max-w-2xl mb-10 md:mb-14">
          <h1 className="font-serif font-medium text-4xl md:text-5xl text-stone-900 tracking-tight">{t('reviews.title', 'Traveler Stories')}</h1>
          <p className="mt-3 text-lg text-stone-600">{t('reviews.subtitle', 'Real experiences from our global vanlifers')}</p>
        </header>

        {allReviews.length === 0 ? (
          <div className="py-16 border-t border-stone-200 text-stone-500">No reviews yet. Be the first to share your experience!</div>
        ) : (
          <>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
              {visibleReviews.map((review) => (
                <figure key={review.id} className="break-inside-avoid mb-6 bg-white p-6 rounded-md border border-stone-200">
                  {review.image && (
                    <img src={review.image} alt="Trip" className="w-full h-48 object-cover rounded mb-5 bg-stone-100" />
                  )}
                  <div className="flex gap-0.5 text-orange-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} fill={i < review.stars ? "currentColor" : "none"} className={i >= review.stars ? "text-stone-300" : ""} size={16} />
                    ))}
                  </div>
                  <blockquote className="font-serif text-lg text-stone-800 leading-relaxed">{review.text}</blockquote>
                  <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-stone-200">
                    <div className="w-10 h-10 bg-stone-100 text-stone-700 rounded-full flex items-center justify-center font-medium shrink-0">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 leading-tight">{review.name}</p>
                      <p className="text-sm text-stone-500 mt-0.5">{review.country}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-10">
              {hasMore ? (
                <button onClick={handleLoadMore} disabled={isPaginating} className="btn btn-ghost">
                  {isPaginating && <Loader2 size={18} className="animate-spin" />}
                  {isPaginating ? 'Loading...' : t('reviews.btnLoadMore', 'Load More Reviews')}
                </button>
              ) : (
                <p className="text-stone-500">
                  {t('reviews.noMore', "You've reached the end! Time to make your own story.")}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
