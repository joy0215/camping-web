import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 bg-stone-50 min-h-screen selection:bg-orange-200 selection:text-orange-900">
      
      {/* ✨ 頂部：極簡標題與核心信念 (Typography Hero) */}
      <div className="container mx-auto px-6 max-w-4xl text-center mb-24">
        <p className="text-orange-500 tracking-[0.4em] uppercase text-xs font-bold mb-6">Est. 2021</p>
        <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-stone-900 tracking-tight mb-16">
          CampingTour Taiwan
        </h1>
        
        {/* 核心金句放大，取代圖片成為視覺焦點 */}
        <blockquote className="space-y-8 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-8xl text-stone-200/50 font-serif">"</div>
          <p className="relative z-10 text-2xl md:text-4xl font-serif font-bold text-stone-800 leading-snug">
            最動人的風景，不在終點，<br className="hidden md:block" />而是在每一段旅程之中。
          </p>
          <p className="relative z-10 text-stone-500 text-lg md:text-xl font-light italic px-4">
            We believe the most meaningful moments are not found at the destination,<br className="hidden md:block" /> but throughout every journey along the way.
          </p>
        </blockquote>
      </div>

      {/* 📖 中間：中英雙語對照排版 (乾淨、大留白) */}
      <div className="container mx-auto px-6 max-w-6xl mb-24">
        <div className="bg-white p-10 md:p-20 rounded-[2.5rem] shadow-sm border border-stone-100">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            
            {/* 🇹🇼 中文專欄 */}
            <div className="space-y-8">
              <h2 className="text-xs font-bold tracking-widest text-stone-400 uppercase border-b border-stone-100 pb-4 mb-8">品牌故事</h2>
              <div className="space-y-6 text-stone-800 leading-loose text-lg text-justify font-medium">
                <p>
                  CampingTour 成立於 2021 年，專門改裝客製化露營車輛，我們致力於推廣台灣的 Vanlife 文化。2025 年開始推出露營車租賃服務。
                </p>
                <p>
                  我們採用全新車輛合法打造的中華菱利 A180 特種露營車，從源頭即符合相關法規與使用安全標準，結合數位化預約系統與貼心管家服務，讓每一位旅人都能輕鬆展開「車泊」體驗，無需煩惱裝備與車輛準備。
                </p>
                <p>
                  無論是追逐合歡山的第一道曙光，還是靜聽花東海岸的浪潮聲，CampingTour 都將成為您最安心、最自在的移動城堡。
                </p>
              </div>
            </div>

            {/* 🇺🇸 英文專欄 */}
            <div className="space-y-8">
               <h2 className="text-xs font-bold tracking-widest text-stone-400 uppercase border-b border-stone-100 pb-4 mb-8">Our Story</h2>
               <div className="space-y-6 text-stone-500 leading-relaxed text-base text-justify font-light">
                 <p>
                   CampingTour was founded in 2021, specializing in custom campervan conversions, with a mission to promote Taiwan’s vanlife culture. In 2025, we expanded our services to include campervan rentals.
                 </p>
                 <p>
                   Our fleet is built using brand-new vehicles, legally converted into Zhonghua Veryca A180 specialized campervans, fully compliant with local regulations and safety standards from the ground up. Combined with a digital booking system and personalized concierge service, we make it easy for every traveler to enjoy the campervan experience — without worrying about equipment or vehicle preparation.
                 </p>
                 <p>
                   Whether you’re chasing the first light at Hehuanshan or listening to the waves along Taiwan’s east coast, CampingTour will be your most reliable and comfortable home on the road.
                 </p>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* ☎️ 底部：聯絡與公司資訊 (維持高對比的設計) */}
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-5 gap-8 items-stretch">
          
          {/* 左側：聯絡我們 (佔比 3/5) */}
          <div className="md:col-span-3 bg-stone-900 text-white p-10 md:p-12 rounded-[2rem] shadow-lg space-y-8 flex flex-col justify-center">
            <h3 className="text-xl font-bold">聯絡我們 Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-5 border-b border-white/10 pb-4">
                <Mail size={22} className="text-orange-400 shrink-0"/>
                <div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Email</div>
                  <div className="font-medium tracking-wide">cheyang0326@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center gap-5 border-b border-white/10 pb-4">
                <Phone size={22} className="text-orange-400 shrink-0"/>
                <div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Phone</div>
                  <div className="font-medium tracking-wide">0965-720-586</div>
                </div>
              </div>
              <div className="flex items-center gap-5 pt-2">
                <MapPin size={22} className="text-orange-400 shrink-0"/>
                <div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Location</div>
                  <div className="font-medium tracking-wide leading-relaxed">台北市北投區大度路一段157-2號</div>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：公司資訊 (佔比 2/5) */}
          <div className="md:col-span-2 bg-white p-10 md:p-12 rounded-[2rem] shadow-sm border border-stone-200 flex flex-col justify-between">
             <div>
               <h3 className="text-xl font-bold text-stone-900 mb-8">公司資訊 Info</h3>
               <ul className="space-y-5 text-stone-700 text-sm">
                  <li className="flex flex-col gap-1">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest">Company</span> 
                    <span className="font-medium">悠遊旅行社股份有限公司</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest">Business ID</span> 
                    <span className="font-medium">84293135</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest">Representative</span> 
                    <span className="font-medium">林繼城</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest">License</span> 
                    <span className="font-medium">交觀甲字 5307 號</span>
                  </li>
               </ul>
             </div>
             <div className="pt-10 mt-auto text-[10px] text-stone-400 tracking-wider">
               © 2026 CampingTour Taiwan.
             </div>
          </div>

        </div>
      </div>

    </div>
  );
}