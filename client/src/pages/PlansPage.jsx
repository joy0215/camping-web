import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Users, Info, ChevronLeft, ChevronRight, Car, Tent, Wind, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import translation hook

export default function PlansPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize translation
  
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

  // Translated Specs
  const specs = [
    { icon: ShieldCheck, label: t('plans.spec1') }, 
    { icon: Car, label: t('plans.spec2') },             
    { icon: Tent, label: t('plans.spec3') },
    { icon: Users, label: t('plans.spec4') },
    { icon: Wind, label: t('plans.spec5') },
    { icon: Zap, label: t('plans.spec6') },
  ];

  // Translated Equipment List
  const equipGroups = t('plans.equipGroups', { returnObjects: true });
  const equipmentGroups = Array.isArray(equipGroups) ? equipGroups : [];

  return (
    <div className="pt-24 md:pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        
        <header className="max-w-2xl mb-10 md:mb-14">
          <p className="eyebrow">{t('plans.badge')}</p>
          <h1 className="mt-3 font-serif font-medium text-4xl md:text-5xl text-stone-900 tracking-tight">{t('plans.title')}</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Gallery */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] max-h-[640px] w-full rounded-md overflow-hidden bg-stone-200 group">
              {vehicleImages.map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`CampingTour A180 Campervan view ${idx + 1}`} 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  onError={(e) => e.target.src='/images/vibe-drive.jpg'} 
                />
              ))}

              <button 
                onClick={prevImage}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-900 p-2 rounded-full z-20 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
              >
                <ChevronLeft size={20}/>
              </button>
              <button 
                onClick={nextImage}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-900 p-2 rounded-full z-20 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
              >
                <ChevronRight size={20}/>
              </button>

              <span className="absolute bottom-3 end-3 z-10 bg-stone-900/70 text-white text-xs px-2 py-1 rounded" dir="ltr">
                {currentImageIndex + 1} / {vehicleImages.length}
              </span>
            </div>

            <div className="mt-2 grid grid-cols-9 gap-1.5" dir="ltr">
              {vehicleImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentImageIndex(idx)}
                  aria-label={`Photo ${idx + 1}`}
                  className={`aspect-square rounded overflow-hidden bg-stone-200 transition-opacity ${idx === currentImageIndex ? 'ring-2 ring-stone-900 ring-offset-2 ring-offset-stone-50' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Details */}
          <div className="lg:col-span-6">
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900">{t('plans.model')}</h2>
            <p className="mt-2 text-sm font-semibold text-orange-600">{t('plans.legal')}</p>
            
            <p className="mt-6 text-lg text-stone-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('plans.desc') }} />
            
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 border-t border-stone-200">
              {specs.map((spec, i) => (
                <li key={i} className="flex items-center gap-3 py-3.5 border-b border-stone-200 text-stone-800">
                  <spec.icon size={18} strokeWidth={1.5} className="text-stone-500 shrink-0" />
                  <span className="text-sm font-medium">{spec.label}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-8 bg-white border border-stone-200 rounded-md divide-y divide-stone-200">
              <div className="flex justify-between items-baseline gap-4 px-5 py-4">
                <dt className="text-stone-600">{t('plans.weekday')}</dt>
                <dd className="font-serif text-2xl text-stone-900 whitespace-nowrap"><span dir="ltr">NT$ 3,700</span> <span className="font-sans text-sm text-stone-500">{t('plans.perDay', '/ day')}</span></dd>
              </div>
              <div className="flex justify-between items-baseline gap-4 px-5 py-4">
                <dt className="text-stone-600">{t('plans.weekend')}</dt>
                <dd className="font-serif text-2xl text-stone-900 whitespace-nowrap"><span dir="ltr">NT$ 4,700</span> <span className="font-sans text-sm text-stone-500">{t('plans.perDay', '/ day')}</span></dd>
              </div>
            </dl>
            
            <button onClick={() => navigate('/booking')} className="btn btn-accent w-full mt-6 !py-4 !text-base">
              {t('plans.btnCheck')}
            </button>
          </div>
        </div>

        {/* Included Equipment */}
        <section className="mt-20 md:mt-28 grid lg:grid-cols-12 gap-8 lg:gap-14">
          <div className="lg:col-span-4">
            <h2 className="font-serif text-3xl text-stone-900">{t('plans.equipTitle')}</h2>
            <p className="mt-3 text-stone-600 leading-relaxed">{t('plans.equipSub')}</p>
          </div>
          <div className="lg:col-span-8">
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-10">
              {equipmentGroups.map((group, gi) => (
                <div key={gi} className={gi === 0 ? 'sm:col-span-2' : ''}>
                  <h3 className="eyebrow mb-3">{group.title}</h3>
                  <ul className={`border-t border-stone-200 ${gi === 0 ? 'grid sm:grid-cols-2 gap-x-10' : ''}`}>
                    {(group.items || []).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 py-3 border-b border-stone-200 text-stone-800">
                        <Check size={18} className="mt-0.5 text-orange-600 shrink-0"/>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-6 flex items-start gap-2.5 text-sm text-stone-600 leading-relaxed">
              <Info size={16} className="mt-0.5 shrink-0 text-stone-400"/> 
              <span><strong className="text-stone-800">{t('plans.noticeTitle')}</strong> — {t('plans.noticeDesc')}</span>
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
