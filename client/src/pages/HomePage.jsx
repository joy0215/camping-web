import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Car, Zap, Star, Edit3, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../api/axiosClient'; // Import your API client

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function HomePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  // State to hold real reviews fetched from the database
  const [reviews, setReviews] = useState([]);

  const IMAGES = {
    hero: "/images/vibe-drive.jpg", 
    logoStack: "/images/logo-stack.jpg"
  };

  const handleWriteReview = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert(isZh ? '請先登入會員，即可撰寫評價喔！' : 'Please login to share your experience.');
      navigate('/login');
    } else {
      // Redirect to dashboard so the user can write a review in the Reviews tab
      navigate('/dashboard'); 
    }
  };

  // Expanded mock reviews (Fallback data if backend is empty or offline)
  const mockReviews = [
    {
      id: 1,
      stars: 5,
      text: "Absolutely amazing experience! The A180 was perfectly equipped for our 7-day trip around Taiwan's east coast. Waking up to the ocean view from the bed was priceless.",
      name: "David & Sarah",
      country: "🇬🇧 United Kingdom",
      avatar: "D",
      image: null
    },
    {
      id: 2,
      stars: 5,
      text: "第一次體驗車泊就愛上了！車子非常好開，冷氣夠冷，營區補電也很方便。老闆交車講解得超級詳細，讓我們整趟旅程非常安心！大推！",
      name: "陳先生一家",
      country: "🇹🇼 Taiwan",
      avatar: "陳",
      image: null
    },
    {
      id: 3,
      stars: 5,
      text: "We had the best time exploring Taroko Gorge. The battery lasted all night for the AC. Smooth booking process and very responsive support on WhatsApp.",
      name: "Liad",
      country: "🇮🇱 Israel",
      avatar: "L",
      image: "/images/vibe-drive.jpg" 
    },
    {
      id: 4,
      stars: 4,
      text: "Very comfortable campervan. The folding table and chairs provided were great for our outdoor dinners. Will definitely rent again next year!",
      name: "Marcus",
      country: "🇩🇪 Germany",
      avatar: "M",
      image: null
    },
    {
      id: 5,
      stars: 5,
      text: "太棒的體驗！車內空間規劃得很用心，裝備齊全到我們幾乎只要帶換洗衣物就能出發。睡墊意外地好睡，大推給想嘗試 Vanlife 的朋友！",
      name: "林小姐",
      country: "🇹🇼 Taiwan",
      avatar: "林",
      image: null
    }
  ];

  // Fetch real reviews when the component mounts
  useEffect(() => {
    axiosClient.get('/reviews')
      .then(({ data }) => {
        if (data && data.length > 0) {
          // Format backend data to match the Swiper component's expected structure
          const formattedReviews = data.map(r => ({
            id: r.id,
            stars: r.rating,
            text: r.comment,
            name: r.user_name,
            country: r.country === 'OTHER' ? '🌍' : r.country, // Simple country display
            avatar: r.user_avatar,
            // Attach backend URL prefix if an image exists
            image: r.photo_url ? `https://camping-tour-api.onrender.com${r.photo_url}` : null 
          }));
          
          // Only take the 5 most recent reviews for the homepage slider
          setReviews(formattedReviews.slice(0, 5));
        } else {
          // Fallback to mock data if the database has no reviews yet
          setReviews(mockReviews);
        }
      })
      .catch(err => {
        console.error("Fetch reviews failed:", err);
        // Fallback to mock data if the API call fails
        setReviews(mockReviews); 
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const features = [
    { icon: Car, title: t('home.feat1Title'), sub: t('home.feat1Sub'), d1: t('home.feat1Desc1'), d2: t('home.feat1Desc2') },
    { icon: MapPin, title: t('home.feat2Title'), sub: t('home.feat2Sub'), d1: t('home.feat2Desc1'), d2: t('home.feat2Desc2') },
    { icon: Zap, title: t('home.feat3Title'), sub: t('home.feat3Sub'), d1: t('home.feat3Desc1'), d2: t('home.feat3Desc2') },
  ];

  const gallery = [
    "/images/hero-roof.jpg",
    "/images/vibe-mountain.jpg",
    "/images/feature-window.jpg",
    "/images/vibe-stand.jpg",
  ];

  return (
    <>
      {/* Hero */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <p className="eyebrow">{t('home.subtitle')}</p>
            <h1 className="mt-4 font-serif font-medium text-5xl md:text-6xl lg:text-7xl text-stone-900 leading-[1.05] tracking-tight">
              {t('home.title')}
              <span className="block mt-3 text-2xl md:text-3xl italic font-normal text-stone-500 tracking-normal">{t('home.titleEn')}</span>
            </h1>
            <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-md">{t('home.lede')}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate('/booking')} className="btn btn-accent">
                {t('home.btnBooking')} <ArrowRight size={18} className="rtl:rotate-180" />
              </button>
              <button onClick={() => navigate('/plans')} className="btn btn-ghost">
                {t('home.btnVehicles')}
              </button>
            </div>

            <dl className="mt-10 pt-6 border-t border-stone-200 flex flex-wrap gap-x-12 gap-y-4">
              <div>
                <dt className="text-sm text-stone-500">{t('plans.weekday')}</dt>
                <dd className="mt-1 font-serif text-2xl text-stone-900" dir="ltr">NT$ 3,700</dd>
              </div>
              <div>
                <dt className="text-sm text-stone-500">{t('plans.weekend')}</dt>
                <dd className="mt-1 font-serif text-2xl text-stone-900" dir="ltr">NT$ 4,700</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-6 relative">
            <img
              src={IMAGES.hero}
              alt="CampingTour A180 campervan on a palm-lined road in Taiwan"
              className="w-full aspect-[4/5] object-cover rounded-md bg-stone-200"
            />
            <img
              src="/images/interior-bed.jpg"
              alt=""
              className="hidden md:block absolute -bottom-8 -start-8 w-52 aspect-[3/2] object-cover rounded-md border-4 border-stone-50 bg-stone-200"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-20 grid md:grid-cols-3 gap-10 md:gap-12">
          {features.map((f) => (
            <div key={f.title}>
              <f.icon size={24} strokeWidth={1.5} className="text-orange-600" />
              <h3 className="mt-4 font-serif text-2xl text-stone-900">{f.title}</h3>
              <p className="mt-1 text-sm text-stone-500">{f.sub}</p>
              <p className="mt-4 text-stone-600 leading-relaxed">{f.d1} {f.d2}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Photos */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-16 md:pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {gallery.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              loading="lazy"
              className={`w-full aspect-[3/4] object-cover rounded-md bg-stone-200 ${i % 2 === 1 ? 'md:mt-8' : ''}`}
            />
          ))}
        </div>
      </section>

      {/* Traveler Reviews */}
      <section className="bg-stone-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="font-serif text-4xl">{t('home.homeReviewsTitle', 'Traveler Stories')}</h2>
              <p className="mt-2 text-stone-400">{t('home.homeReviewsSub', 'Hear from our global vanlifers')}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <button 
                onClick={() => navigate('/reviews')} 
                className="text-stone-300 hover:text-white font-medium flex items-center gap-1 underline underline-offset-4 decoration-stone-600 hover:decoration-white"
              >
                {t('home.homeViewAll', 'View All Reviews')} <ArrowUpRight size={16} className="rtl:-scale-x-100" />
              </button>
              <button 
                onClick={handleWriteReview} 
                className="btn border border-stone-600 text-white hover:border-white"
              >
                <Edit3 size={16} /> {t('feedback.title', 'Share Your Experience')}
              </button>
            </div>
          </div>

          <Swiper
            key={i18n.dir()}
            dir={i18n.dir()}
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="pb-14"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="!h-auto">
                <figure className="h-full flex flex-col border border-stone-700 rounded-md p-6">
                  {review.image && (
                    <img src={review.image} alt="User trip" className="w-full h-40 object-cover rounded mb-5 bg-stone-800" />
                  )}

                  <div className="flex gap-0.5 text-orange-300 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} fill={i < review.stars ? "currentColor" : "none"} className={i >= review.stars ? "text-stone-600" : ""} size={16}/>
                    ))}
                  </div>
                  
                  <blockquote className="font-serif text-lg text-stone-100 leading-relaxed flex-grow">
                    {review.text}
                  </blockquote>
                  
                  <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-stone-800">
                    <div className="w-10 h-10 bg-stone-800 text-stone-200 rounded-full flex items-center justify-center font-medium shrink-0">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-white leading-tight">{review.name}</p>
                      <p className="text-sm text-stone-400 mt-0.5">{review.country}</p>
                    </div>
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </section>
    </>
  );
}
