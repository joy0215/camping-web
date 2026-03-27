import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Car, Zap, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import translation hook

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize translation

  const IMAGES = {
    hero: "/images/vibe-drive.jpg", 
    logoStack: "/images/logo-stack.jpg"
  };

  return (
    <>
      {/* Hero Section with parallax effect and glassmorphism */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed transform scale-105 transition-transform duration-[10000ms] ease-out hover:scale-110"
          style={{ backgroundImage: `url(${IMAGES.hero})` }}
        >
          {/* Dark gradient overlay to enhance text readability */}
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
            
            {/* Feature 1 */}
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

            {/* Feature 2 */}
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

            {/* Feature 3 */}
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
    </>
  );
}