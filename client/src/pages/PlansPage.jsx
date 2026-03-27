import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Zap, Users, Info, ChevronLeft, ChevronRight, Car, Tent, Wind, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // 🌟 Import translation hook

export default function PlansPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(); // 🌟 Initialize translation
  
  const vehicleImages = [
    "/images/exterior-side.jpg",       
    "/images/interior-bed.jpg",        
    "/images/feature-awning-full.jpg", 
    "/images/vibe-drive.jpg",          
    "/images/vibe-stand.jpg",          
    "/images/feature-window.jpg",      
    "/images/vibe-chill.jpg",          
    "/images/feature-awning-close.jpg",
    "/images/vibe-mountain.jpg"        
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [vehicleImages.length]);

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length);
  };

  // 🌟 Translated Specs
  const specs = [
    { icon: ShieldCheck, label: t('plans.spec1') }, 
    { icon: Car, label: t('plans.spec2') },             
    { icon: Tent, label: t('plans.spec3') },
    { icon: Users, label: t('plans.spec4') },
    { icon: Wind, label: t('plans.spec5') },
    { icon: Zap, label: t('plans.spec6') },
  ];

  // 🌟 Translated Equipment List
  const equipmentList = [
    t('plans.equip1'), t('plans.equip2'), t('plans.equip3'), t('plans.equip4'),
    t('plans.equip5'), t('plans.equip6'), t('plans.equip7'), t('plans.equip8')
  ];

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
          <span className="text-orange-600 font-bold tracking-widest uppercase text-xs border border-orange-200 bg-orange-50 px-3 py-1 rounded-full mb-4 inline-block">{t('plans.badge')}</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mt-2 mb-6">{t('plans.title')}</h2>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl max-w-6xl mx-auto border border-stone-100 mb-20 animate-fade-in delay-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Image Carousel */}
            <div className="relative h-[450px] lg:h-auto group bg-stone-900 overflow-hidden">
              {vehicleImages.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`CampingTour A180 Campervan view ${idx + 1}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-out ${
                  idx === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
                onError={(e) => e.target.src='/images/vibe-drive.jpg'} 
              />
              ))}
              
              <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest z-10 border border-white/20 shadow-lg">
                Compliant & Safe
              </div>

              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-20 border border-white/30"
              >
                <ChevronLeft size={24}/>
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-20 border border-white/30"
              >
                <ChevronRight size={24}/>
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
                {vehicleImages.map((_, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-500 ${idx === currentImageIndex ? 'bg-white w-8 shadow-[0_0_10px_white]' : 'bg-white/40 hover:bg-white/80'}`} 
                  />
                ))}
              </div>
            </div>
            
            {/* Right: Vehicle Details */}
            <div className="p-8 lg:p-14 flex flex-col justify-center bg-white">
              <h3 className="text-4xl font-bold text-stone-900 mb-2">{t('plans.model')}</h3>
              <p className="text-xl text-orange-600 font-bold tracking-widest mb-8 uppercase text-sm">{t('plans.legal')}</p>
              
              <div className="space-y-4 text-stone-600 leading-relaxed mb-10 text-lg font-medium border-l-4 border-orange-100 pl-6">
                <p dangerouslySetInnerHTML={{ __html: t('plans.desc') }} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                {specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-3 text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-100 hover:border-orange-200 hover:bg-orange-50 transition-colors group">
                    <spec.icon size={20} className="text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm">{spec.label}</span>
                  </div>
                ))}
              </div>

              <div className="bg-stone-900 rounded-2xl p-6 mb-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>
                <div className="relative z-10 flex justify-between items-center mb-4 border-b border-stone-700 pb-4">
                  <span className="text-stone-400 font-medium">{t('plans.weekday')}</span>
                  <span className="font-bold text-2xl">NT$ 3,700<span className="text-sm font-normal text-stone-400">/Day</span></span>
                </div>
                <div className="relative z-10 flex justify-between items-center">
                  <span className="text-stone-400 font-medium">{t('plans.weekend')}</span>
                  <span className="font-bold text-2xl text-orange-400">NT$ 4,700<span className="text-sm font-normal text-stone-500">/Day</span></span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/booking')}
                className="w-full bg-orange-600 text-white py-4.5 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-[0_4px_14px_0_rgba(234,88,12,0.39)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.23)] hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
              >
                {t('plans.btnCheck')}
              </button>
            </div>
          </div>
        </div>

        {/* Included Equipment Section */}
        <div className="mb-20 animate-fade-in delay-200">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-serif font-bold text-stone-900">{t('plans.equipTitle')}</h3>
            <p className="text-stone-500 mt-2">{t('plans.equipSub')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {equipmentList.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 bg-white p-6 rounded-2xl shadow-sm border border-stone-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all group min-h-[140px] justify-center">
                <CheckCircle size={28} className="text-stone-300 group-hover:text-green-500 transition-colors mb-2 flex-shrink-0"/>
                <span className="font-bold text-stone-800 text-sm leading-dashed">{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 text-sm text-stone-600 bg-stone-100 py-4 rounded-xl max-w-2xl mx-auto font-medium">
            <Info size={18} className="inline mr-2 text-stone-400 mb-0.5"/> 
            {t('plans.noticeTitle')}：{t('plans.noticeDesc')}
          </div>
        </div>

      </div>
    </div>
  );
}