import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Car, Zap, ChevronDown, Star, Edit3, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🌟 匯入 Swiper 核心組件與樣式
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function HomePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

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
      navigate('/dashboard'); // 導向會員中心讓他們去 Reviews tab 寫
    }
  };

  // 🌟 擴充的模擬評價資料 (共 5 筆，讓輪播有感)
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
      image: "/images/vibe-drive.jpg" // 模擬有上傳照片的評價
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

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed transform scale-105 transition-transform duration-[10000ms] ease-out hover:scale-110"
          style={{ backgroundImage: `url(${IMAGES.hero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-900/80"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto mt-10">
          <div className="mb-8 flex justify-center">
            <img 
              src={IMAGES.logoStack} 
              alt="Logo" 
              className="w-28 h-28 rounded-3xl shadow-2xl invert opacity-90 border border-white/20 backdrop-blur-sm"
              onError={(e) => e.target.style.display='none'}
            />
          </div>
          <p className="text-orange-400 font-bold tracking-[0.4em] mb-4 uppercase animate-fade-in text-sm drop-shadow-md">
            {t('home.subtitle')}
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-10 leading-tight drop-shadow-2xl animate-fade-in delay-100">
            {t('home.title')}<br />
            <span className="text-3xl md:text-5xl font-light mt-4 block opacity-90">{t('home.titleEn')}</span>
          </h1>
          
          <div className="flex flex-col md:flex-row gap-5 justify-center animate-fade-in delay-200">
            <button 
              onClick={() => navigate('/booking')} 
              className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-full font-bold transition-all duration-300 shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] flex items-center justify-center gap-2 hover:-translate-y-1.5"
            >
              {t('home.btnBooking')} <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/plans')} 
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white px-10 py-4 rounded-full font-bold transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
            >
              {t('home.btnVehicles')}
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/70 hover:text-white transition-colors cursor-pointer">
          <ChevronDown size={36} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-10 group bg-white rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-stone-100">
              <div className="w-20 h-20 mx-auto bg-orange-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-orange-600 transition-colors duration-500">
                <Car size={36} className="text-orange-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-stone-800">{t('home.feat1Title')}</h3>
              <p className="text-xs font-bold text-stone-400 mb-6 uppercase tracking-widest">{t('home.feat1Sub')}</p>
              <p className="text-stone-600 leading-relaxed font-medium">
                {t('home.feat1Desc1')}<br/>{t('home.feat1Desc2')}
              </p>
            </div>

            <div className="p-10 group bg-white rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-stone-100">
              <div className="w-20 h-20 mx-auto bg-orange-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-orange-600 transition-colors duration-500">
                <MapPin size={36} className="text-orange-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-stone-800">{t('home.feat2Title')}</h3>
              <p className="text-xs font-bold text-stone-400 mb-6 uppercase tracking-widest">{t('home.feat2Sub')}</p>
              <p className="text-stone-600 leading-relaxed font-medium">
                {t('home.feat2Desc1')}<br/>{t('home.feat2Desc2')}
              </p>
            </div>

            <div className="p-10 group bg-white rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-stone-100">
              <div className="w-20 h-20 mx-auto bg-orange-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-orange-600 transition-colors duration-500">
                <Zap size={36} className="text-orange-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-stone-800">{t('home.feat3Title')}</h3>
              <p className="text-xs font-bold text-stone-400 mb-6 uppercase tracking-widest">{t('home.feat3Sub')}</p>
              <p className="text-stone-600 leading-relaxed font-medium">
                {t('home.feat3Desc1')}<br/>{t('home.feat3Desc2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 旅客評價輪播區塊 (Reviews Section) */}
      <section className="py-24 bg-stone-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-orange-400"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          
          {/* 標題與按鈕區塊 */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-serif font-bold mb-3">{t('homeReviewsTitle', 'Traveler Stories')}</h2>
              <p className="text-stone-400 tracking-widest uppercase text-sm font-bold">{t('homeReviewsSub', 'Hear from our global vanlifers')}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              {/* 查看全部按鈕 */}
              <button 
                onClick={() => navigate('/reviews')} 
                className="text-stone-300 hover:text-orange-500 px-4 py-3.5 font-bold transition-colors flex items-center gap-1"
              >
                {t('homeViewAll', 'View All Reviews')} <ArrowUpRight size={18} />
              </button>
              
              {/* 撰寫評價按鈕 */}
              <button 
                onClick={handleWriteReview} 
                className="bg-stone-800 hover:bg-orange-600 border border-stone-700 hover:border-orange-500 text-white px-6 py-3.5 rounded-full font-bold transition-all duration-300 flex items-center gap-2 shadow-lg hover:-translate-y-1"
              >
                <Edit3 size={18} /> {t('feedback.title', '分享您的車泊體驗')}
              </button>
            </div>
          </div>

          {/* 🌟 Swiper 輪播主體 */}
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 }, // 平板顯示 2 則
              1024: { slidesPerView: 3 }, // 電腦顯示 3 則
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="pb-16" // 留空間給底部的 pagination 點點
          >
            {mockReviews.map((review) => (
              <SwiperSlide key={review.id} className="h-auto">
                <div className="bg-stone-800 p-8 rounded-3xl border border-stone-700 h-full flex flex-col hover:-translate-y-2 transition-transform duration-300">
                  
                  {/* 可選：照片預覽 */}
                  {review.image && (
                    <div className="w-full h-40 bg-stone-700 rounded-2xl mb-6 overflow-hidden shrink-0">
                      <img src={review.image} alt="User trip" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                    </div>
                  )}

                  <div className="flex gap-1 text-orange-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} fill={i < review.stars ? "currentColor" : "none"} className={i >= review.stars ? "text-stone-600" : ""} size={20}/>
                    ))}
                  </div>
                  
                  <p className="text-stone-300 italic mb-8 leading-relaxed flex-grow">
                    "{review.text}"
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-white leading-tight">{review.name}</p>
                      <p className="text-xs text-stone-400 mt-1">{review.country}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </section>
    </>
  );
}