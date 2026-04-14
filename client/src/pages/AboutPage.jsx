import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // 🌟 Import translation hook

export default function AboutPage() {
  const { t } = useTranslation(); // 🌟 Initialize translation

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      
      {/* Page Content Container */}
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Story Section */}
        <div className="bg-white p-10 md:p-16 rounded-[2rem] shadow-sm mb-12 border border-stone-100 relative overflow-hidden">
          
          <div 
            className="absolute inset-0 z-0 bg-center bg-no-repeat grayscale pointer-events-none opacity-[0.08]"
            style={{ 
              backgroundImage: 'url(/images/logo.jpg)',
              backgroundSize: 'auto 350px' 
            }} 
          />

          <div className="relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3 tracking-tight">{t('about.title')}</h1>
              <p className="text-orange-500 tracking-[0.3em] uppercase text-xs font-bold">{t('about.subtitle')}</p>
            </div>

            {/* 🌟 Single Column Clean Layout for i18n */}
            <div className="max-w-4xl mx-auto space-y-8 text-stone-700 leading-loose text-lg text-justify font-medium">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
              <p>{t('about.p3')}</p>
            </div>
          </div>
        </div>

        {/* Contact and Company Info Section */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Contact Details */}
          <div className="bg-stone-900 text-white p-10 rounded-3xl shadow-sm flex flex-col justify-center border border-stone-800 space-y-7">
            <h3 className="text-xl font-bold mb-6 tracking-wide">{t('about.contact')}</h3>
            
            <div className="flex items-center gap-4 border-b border-white/10 pb-5">
               <Phone size={20} className="text-orange-400 shrink-0"/>
               <div>
                  <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">{t('about.phone')}</span>
                  <span className="font-medium tracking-wide">0963-823-606</span>
               </div>
            </div>
            
            <div className="flex items-center gap-4 border-b border-white/10 pb-5">
               <Mail size={20} className="text-orange-400 shrink-0"/>
               <div>
                  <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">{t('about.email')}</span>
                  <span className="font-medium tracking-wide">jchenghe06@gmail.com</span>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
               <MapPin size={20} className="text-orange-400 shrink-0"/>
               <div>
                  <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">{t('about.location')}</span>
                  <span className="font-medium leading-relaxed">北投奇岩捷運站 2 號出口 (抵達後將安排接駁車至車輛所在地)</span>
               </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-stone-100 flex flex-col justify-between h-full">
             <div className="space-y-6 mb-10">
               <h3 className="text-xl font-bold text-stone-900 tracking-wide">{t('about.info')}</h3>
               <ul className="space-y-4 text-stone-700 text-sm">
                  <li className="flex justify-between border-b border-stone-100 pb-3">
                    <strong className="text-stone-950">{t('about.company')}</strong> 悠遊旅行社股份有限公司
                  </li>
                  <li className="flex justify-between border-b border-stone-100 pb-3">
                    <strong className="text-stone-950">{t('about.taxId')}</strong> 84293135
                  </li>
                  <li className="flex justify-between border-b border-stone-100 pb-3">
                    <strong className="text-stone-950">{t('about.rep')}</strong> 林繼城
                  </li>
                  <li className="flex justify-between pb-1">
                    <strong className="text-stone-950">{t('about.license')}</strong> 交觀甲字 5307 號
                  </li>
               </ul>
             </div>
             
             <div className="pt-6 text-center text-[11px] text-stone-400 border-t border-stone-100">
               {t('about.rights')}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}