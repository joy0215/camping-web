import React, { useState, useEffect } from 'react';
import { ChevronDown, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import translation hook

// FAQ Accordion Component
const AccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="border-b border-stone-200">
      <button className="w-full flex justify-between items-center gap-4 py-5 text-start" onClick={onClick} aria-expanded={isOpen}>
        <span className="font-serif text-xl text-stone-900">{title}</span>
        <ChevronDown size={20} className={`shrink-0 text-stone-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-6 text-stone-600 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

export default function GuidePage() {
  const [openAccordion, setOpenAccordion] = useState(0);
  const { t } = useTranslation(); // Initialize translation

  // 動態載入 Instagram 官方嵌入腳本並解析 Reels
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else {
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = '//www.instagram.com/embed.js';
      script.onload = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  const LINKS = {
    appStore: "https://apps.apple.com/app/id1668213216", 
    googlePlay: "https://play.google.com/store/apps/details?id=cmsp.bedincar&pcampaignid=web_share"
  };

  return (
    <div className="pt-24 md:pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        
        <header className="max-w-2xl mb-10 md:mb-14">
          <h1 className="font-serif font-medium text-4xl md:text-5xl text-stone-900 tracking-tight">{t('guide.title')}</h1>
          <p className="mt-3 text-lg text-stone-600">{t('guide.subtitle')}</p>
        </header>

        {/* 1. App download */}
        <section className="bg-stone-900 text-white rounded-md overflow-hidden grid md:grid-cols-2">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h2 className="font-serif text-3xl md:text-4xl leading-tight" dangerouslySetInnerHTML={{ __html: t('guide.appTitle') }} />
            <p className="mt-4 text-stone-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('guide.appDesc') }} />
            
            <div className="mt-8 flex flex-wrap gap-3" dir="ltr">
              <a href={LINKS.appStore} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white text-stone-900 px-4 py-2.5 rounded-md hover:bg-stone-100 transition-colors">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg" alt="" className="w-6 h-6" />
                <span className="text-left leading-none">
                  <span className="block text-[10px] text-stone-500">Download on the</span>
                  <span className="block text-sm font-semibold mt-1">App Store</span>
                </span>
              </a>
              <a href={LINKS.googlePlay} target="_blank" rel="noreferrer" className="flex items-center gap-3 border border-stone-600 text-white px-4 py-2.5 rounded-md hover:border-white transition-colors">
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="" className="w-6 h-6" />
                <span className="text-left leading-none">
                  <span className="block text-[10px] text-stone-400">Get it on</span>
                  <span className="block text-sm font-semibold mt-1">Google Play</span>
                </span>
              </a>
            </div>
          </div>
          <img
            src="/images/feature-awning-full.jpg"
            alt="Campervan with the awning open at a campsite"
            loading="lazy"
            className="w-full h-64 md:h-full object-cover"
          />
        </section>

        {/* 2. Instagram Reels */}
        <section className="mt-16 md:mt-24 grid lg:grid-cols-12 gap-8 lg:gap-14">
          <div className="lg:col-span-4">
            <p className="eyebrow flex items-center gap-2"><Instagram size={16} /> {t('guide.reelsBadge')}</p>
            <h2 className="mt-3 font-serif text-3xl text-stone-900">{t('guide.reelsTitle')}</h2>
            <p className="mt-3 text-stone-600 leading-relaxed">{t('guide.reelsSub')}</p>
          </div>

          <div className="lg:col-span-8">
            <div className="w-full max-w-[540px]">
              <blockquote
                className="instagram-media"
                data-instgrm-captioned
                data-instgrm-permalink="https://www.instagram.com/reel/DZPt-KgpYvz/?utm_source=ig_embed&amp;utm_campaign=loading"
                data-instgrm-version="14"
                style={{
                  background: '#FFF',
                  border: '1px solid #dfd7ca',
                  borderRadius: '6px',
                  margin: 0,
                  maxWidth: '540px',
                  minWidth: '300px',
                  padding: 0,
                  width: '100%'
                }}
              >
                <div style={{ padding: '16px' }}>
                  <a
                    href="https://www.instagram.com/reel/DZPt-KgpYvz/?utm_source=ig_embed&amp;utm_campaign=loading"
                    style={{ background: '#FFFFFF', lineHeight: 0, padding: '0 0', textAlign: 'center', textDecoration: 'none', width: '100%' }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('guide.reelsLinkText')}
                  </a>
                </div>
              </blockquote>
            </div>
          </div>
        </section>

        {/* 3. Campervan Guidelines */}
        <section className="mt-16 md:mt-24 grid lg:grid-cols-12 gap-8 lg:gap-14">
          <div className="lg:col-span-4">
            <h2 className="font-serif text-3xl text-stone-900">{t('guide.guideTitle')}</h2>
            <p className="mt-3 text-stone-600 leading-relaxed">{t('guide.guideSub')}</p>
          </div>

          <div className="lg:col-span-8 border-t border-stone-200">
            {/* Pick-up & Drop-off */}
            <AccordionItem title={t('guide.acc1Title')} isOpen={openAccordion === 0} onClick={() => setOpenAccordion(openAccordion === 0 ? -1 : 0)}>
              <ul className="space-y-4">
                <li><span className="font-semibold text-stone-900">{t('guide.acc1q1')}</span> {t('guide.acc1a1')}</li>
                <li><span className="font-semibold text-stone-900">{t('guide.acc1q2')}</span> {t('guide.acc1a2')}</li>
                <li><span className="font-semibold text-stone-900">{t('guide.acc1q3')}</span> {t('guide.acc1a3')}</li>
                <li><span className="font-semibold text-stone-900">{t('guide.acc1q4')}</span> {t('guide.acc1a4')}</li>
              </ul>
            </AccordionItem>

            {/* Power & A/C */}
            <AccordionItem title={t('guide.acc2Title')} isOpen={openAccordion === 1} onClick={() => setOpenAccordion(openAccordion === 1 ? -1 : 1)}>
              <p className="border-s-2 border-orange-600 ps-4 mb-5 font-medium text-stone-900">{t('guide.acc2Warning')}</p>
              <ul className="space-y-4">
                <li><span className="font-semibold text-stone-900">{t('guide.acc2q1')}</span> {t('guide.acc2a1')}</li>
                <li><span className="font-semibold text-stone-900">{t('guide.acc2q2')}</span> {t('guide.acc2a2')}</li>
                <li><span className="font-semibold text-stone-900">{t('guide.acc2q3')}</span> {t('guide.acc2a3')}</li>
              </ul>
            </AccordionItem>

            {/* Mileage & Vehicle Specs */}
            <AccordionItem title={t('guide.acc3Title')} isOpen={openAccordion === 2} onClick={() => setOpenAccordion(openAccordion === 2 ? -1 : 2)}>
              <ul className="space-y-4">
                <li><span className="font-semibold text-stone-900">{t('guide.acc3q1')}</span> {t('guide.acc3a1')}</li>
                <li><span className="font-semibold text-stone-900">{t('guide.acc3q2')}</span> {t('guide.acc3a2')}</li>
                <li><span className="font-semibold text-stone-900">{t('guide.acc3q3')}</span> {t('guide.acc3a3')}</li>
              </ul>
            </AccordionItem>

            {/* Experience & Equipment */}
            <AccordionItem title={t('guide.acc4Title')} isOpen={openAccordion === 3} onClick={() => setOpenAccordion(openAccordion === 3 ? -1 : 3)}>
              <div className="space-y-4 text-stone-600">
                <p><span className="font-semibold text-stone-900 block">{t('guide.acc4q1')}</span>{t('guide.acc4a1')}</p>
                <p><span className="font-semibold text-stone-900 block">{t('guide.acc4q2')}</span>{t('guide.acc4a2')}</p>
              </div>
            </AccordionItem>
          </div>
        </section>

      </div>
    </div>
  );
}
