import React, { useState } from 'react';
import { Download, ExternalLink, Smartphone, Tent, Info, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // 🌟 Import translation hook

// FAQ Accordion Component
const AccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="border border-stone-200 rounded-2xl overflow-hidden mb-4 bg-white shadow-sm hover:shadow-md transition-all">
      <button className="w-full flex justify-between items-center p-6 text-left focus:outline-none" onClick={onClick}>
        <span className="font-bold text-lg text-stone-800">{title}</span>
        <ChevronDown className={`text-orange-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-6 pt-0 text-stone-600 leading-relaxed border-t border-stone-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function GuidePage() {
  const [openAccordion, setOpenAccordion] = useState(0);
  const { t } = useTranslation(); // 🌟 Initialize translation

  const LINKS = {
    appStore: "https://apps.apple.com/app/id1668213216", 
    googlePlay: "https://play.google.com/store/apps/details?id=cmsp.bedincar&pcampaignid=web_share"
  };

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-3">{t('guide.title')}</h2>
          <p className="text-stone-500">{t('guide.subtitle')}</p>
        </div>

        {/* 1. APP Download Section */}
        <div className="bg-stone-900 rounded-[2.5rem] p-8 md:p-14 mb-16 text-white relative overflow-hidden shadow-2xl group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-[150px] opacity-20 -mr-20 -mt-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-700"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-10 -ml-20 -mb-20 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left max-w-xl flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 text-orange-300 shadow-sm">
                <Smartphone size={14} /> Official App
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: t('guide.appTitle') }} />
              <p className="text-stone-300 text-lg mb-10 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: t('guide.appDesc') }} />
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href={LINKS.appStore} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white text-stone-900 px-6 py-4 rounded-xl hover:bg-stone-200 transition-all font-bold shadow-lg hover:-translate-y-1 group/btn">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg" alt="Download on App Store" className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase leading-none text-stone-500">Download on the</div>
                    <div className="text-sm leading-none mt-1">App Store</div>
                  </div>
                </a>
                <a href={LINKS.googlePlay} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-stone-800 border border-stone-700 text-white px-6 py-4 rounded-xl hover:bg-stone-700 transition-all font-bold shadow-lg hover:-translate-y-1 group/btn">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Get it on Google Play" className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase leading-none text-stone-400">Get it on</div>
                    <div className="text-sm leading-none mt-1">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="flex-1 flex justify-center md:justify-end relative">
               <div className="relative bg-stone-800 p-3 rounded-[3rem] border-8 border-stone-800 shadow-2xl transform rotate-[-6deg] hover:rotate-0 transition-transform duration-700 w-[260px] md:w-[280px]">
                  <div className="bg-stone-900 rounded-[2.5rem] h-[480px] flex flex-col items-center justify-center relative overflow-hidden border border-stone-700">
                     <div className="absolute inset-0 bg-gradient-to-b from-stone-800/50 to-stone-900"></div>
                     <div className="relative z-10 flex flex-col items-center gap-5">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center shadow-lg mb-2"><Tent size={48} className="text-white"/></div>
                        <span className="text-2xl font-serif font-bold text-white tracking-wide">BedInCar</span>
                     </div>
                     <div className="absolute bottom-6 w-32 h-1.5 bg-stone-700 rounded-full"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* 2. Campervan Guidelines (Accordion Section) */}
        <div className="mb-16">
          <div className="text-center mb-10">
              <h3 className="text-3xl font-serif font-bold text-stone-900 mb-3 flex items-center justify-center gap-3"><Info className="text-orange-500"/> {t('guide.guideTitle')}</h3>
              <p className="text-stone-500">{t('guide.guideSub')}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            
            {/* Pick-up & Drop-off */}
            <AccordionItem title={t('guide.acc1Title')} isOpen={openAccordion === 0} onClick={() => setOpenAccordion(openAccordion === 0 ? -1 : 0)}>
              <ul className="space-y-4">
                <li>
                  <span className="font-bold text-stone-800">{t('guide.acc1q1')}</span> {t('guide.acc1a1')}
                </li>
                <li>
                  <span className="font-bold text-stone-800">{t('guide.acc1q2')}</span> {t('guide.acc1a2')}
                </li>
                <li>
                  <span className="font-bold text-stone-800">{t('guide.acc1q3')}</span> {t('guide.acc1a3')}
                </li>
                <li>
                  <span className="font-bold text-stone-800">{t('guide.acc1q4')}</span> {t('guide.acc1a4')}
                </li>
              </ul>
            </AccordionItem>

            {/* Power & A/C */}
            <AccordionItem title={t('guide.acc2Title')} isOpen={openAccordion === 1} onClick={() => setOpenAccordion(openAccordion === 1 ? -1 : 1)}>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-4">
                <span className="font-bold text-orange-800 block">{t('guide.acc2Warning')}</span>
              </div>
              <ul className="space-y-4">
                <li>
                  <span className="font-bold text-stone-800">{t('guide.acc2q1')}</span> {t('guide.acc2a1')}
                </li>
                <li>
                  <span className="font-bold text-stone-800">{t('guide.acc2q2')}</span> {t('guide.acc2a2')}
                </li>
                <li>
                  <span className="font-bold text-stone-800">{t('guide.acc2q3')}</span> {t('guide.acc2a3')}
                </li>
              </ul>
            </AccordionItem>

            {/* Mileage & Vehicle Specs */}
            <AccordionItem title={t('guide.acc3Title')} isOpen={openAccordion === 2} onClick={() => setOpenAccordion(openAccordion === 2 ? -1 : 2)}>
              <ul className="space-y-4">
                <li>
                  <span className="font-bold text-stone-800">{t('guide.acc3q1')}</span> {t('guide.acc3a1')}
                </li>
                <li>
                  <span className="font-bold text-stone-800">{t('guide.acc3q2')}</span> {t('guide.acc3a2')}
                </li>
                <li>
                  <span className="font-bold text-stone-800">{t('guide.acc3q3')}</span> {t('guide.acc3a3')}
                </li>
              </ul>
            </AccordionItem>

            {/* Experience & Equipment */}
            <AccordionItem title={t('guide.acc4Title')} isOpen={openAccordion === 3} onClick={() => setOpenAccordion(openAccordion === 3 ? -1 : 3)}>
              <div className="space-y-4 text-stone-600">
                <p>
                  <span className="font-bold text-stone-800 block">{t('guide.acc4q1')}</span>
                  {t('guide.acc4a1')}
                </p>
                <p>
                  <span className="font-bold text-stone-800 block">{t('guide.acc4q2')}</span>
                  {t('guide.acc4a2')}
                </p>
              </div>
            </AccordionItem>

          </div>
        </div>

      </div>
    </div>
  );
}