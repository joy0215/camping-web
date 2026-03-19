import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      
      {/* Page Content Container */}
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Story Section: Watermark is isolated to this container */}
        <div className="bg-white p-10 md:p-16 rounded-[2rem] shadow-sm mb-12 border border-stone-100 relative overflow-hidden">
          
          {/* Watermark background layer for this container */}
          {/* References image in public/images/logo.jpg */}
          {/* Fixed: Opacity increased for visibility, explicit size cap prevents clipping */}
          <div 
            className="absolute inset-0 z-0 bg-center bg-no-repeat grayscale pointer-events-none opacity-[0.08]" // Increased opacity to 8%
            style={{ 
              backgroundImage: 'url(/images/logo.jpg)',
              // Fixed size cap: Intrinsic width is automatic, but intrinsic height is capped to fit section without clipping
              backgroundSize: 'auto 350px' 
            }} 
          />

          {/* Content Layer inside this section, positioned above watermark */}
          <div className="relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3 tracking-tight">關於 CampingTour</h1>
              <p className="text-orange-500 tracking-[0.3em] uppercase text-xs font-bold">Our Story</p>
            </div>

            {/* Side-by-Side Content Layout */}
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 items-start">
              
              {/* Left Column: Traditional Chinese */}
              <div className="space-y-6 text-stone-800 leading-loose text-lg text-justify font-medium">
                <p>
                  CampingTour 成立於 2021 年，專門改裝客製化露營車輛，我們致力於推廣台灣的 Vanlife 文化。2025 年開始推出露營車租賃服務。
                </p>
                <p>
                  我們採用全新車輛合法打造的中華菱利 A180 特種露營車，從源頭即符合相關法規與使用安全標準，結合數位化預約系統與貼心管家服務，讓每一位旅人都能輕鬆展開「車泊」體驗，無需煩惱裝備與車輛準備。
                </p>
                <p>
                  我們相信，最動人的風景，不在終點，而是在每一段旅程之中。無論是追逐合歡山的第一道曙光，還是靜聽花東海岸的浪潮聲，CampingTour 都將成為您最安心、最自在的移動城堡。
                </p>
              </div>

              {/* Right Column: English */}
              <div className="space-y-6 text-stone-500 leading-relaxed text-base text-justify font-light">
                <p>
                  CampingTour was founded in 2021, specializing in custom campervan conversions, with a mission to promote Taiwan’s vanlife culture. In 2025, we expanded our services to include campervan rentals.
                </p>
                <p>
                  Our fleet is built using brand-new vehicles, legally converted into Zhonghua Veryca A180 specialized campervans, fully compliant with local regulations and safety standards from the ground up. Combined with a digital booking system and personalized concierge service, we make it easy for every traveler to enjoy the campervan experience.
                </p>
                <p>
                  We believe the most meaningful moments are not found at the destination, but throughout every journey along the way. Whether you’re chasing the first light at Hehuanshan or listening to the waves along Taiwan’s east coast, CampingTour will be your most reliable and comfortable home on the road.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact and Company Info Section */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Contact Details */}
          <div className="bg-stone-900 text-white p-10 rounded-3xl shadow-sm flex flex-col justify-center border border-stone-800 space-y-7">
            <h3 className="text-xl font-bold mb-6 tracking-wide">聯絡我們 Contact</h3>
            
            <div className="flex items-center gap-4 border-b border-white/10 pb-5">
               <Phone size={20} className="text-orange-400 shrink-0"/>
               <div>
                  <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">Phone 電話</span>
                  <span className="font-medium tracking-wide">0965-720-586</span>
               </div>
            </div>
            
            <div className="flex items-center gap-4 border-b border-white/10 pb-5">
               <Mail size={20} className="text-orange-400 shrink-0"/>
               <div>
                  <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">Email 信箱</span>
                  <span className="font-medium tracking-wide">cheyang0326@gmail.com</span>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
               <MapPin size={20} className="text-orange-400 shrink-0"/>
               <div>
                  <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">Location 取車地點</span>
                  <span className="font-medium leading-relaxed">台北市北投區大度路一段157-2號</span>
               </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-stone-100 flex flex-col justify-between h-full">
             <div className="space-y-6 mb-10">
               <h3 className="text-xl font-bold text-stone-900 tracking-wide">公司資訊 Info</h3>
               <ul className="space-y-4 text-stone-700 text-sm">
                  <li className="flex justify-between border-b border-stone-100 pb-3">
                    <strong className="text-stone-950">公司名稱 Company</strong> 悠遊旅行社股份有限公司
                  </li>
                  <li className="flex justify-between border-b border-stone-100 pb-3">
                    <strong className="text-stone-950">統一編號 Business ID</strong> 84293135
                  </li>
                  <li className="flex justify-between border-b border-stone-100 pb-3">
                    <strong className="text-stone-950">代表人 Representative</strong> 林繼城
                  </li>
                  <li className="flex justify-between pb-1">
                    <strong className="text-stone-950">執照號碼 License</strong> 交觀甲字 5307 號
                  </li>
               </ul>
             </div>
             
             <div className="pt-6 text-center text-[11px] text-stone-400 border-t border-stone-100">
               Copyright © 2026 CampingTour Taiwan. All rights reserved.
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}