import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 bg-watermark min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* 📖 品牌故事區塊 */}
        <div className="bg-white/85 backdrop-blur-md p-8 md:p-16 rounded-[2rem] shadow-sm mb-12 border border-stone-100/50">
          
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3 tracking-tight">關於 CampingTour</h1>
            <p className="text-orange-500 tracking-[0.3em] uppercase text-xs font-bold">Our Story</p>
          </div>

          <div className="space-y-10">
            {/* 第一段 */}
            <div className="space-y-3">
              <p className="text-stone-800 leading-relaxed text-lg text-justify font-medium">
                CampingTour 成立於 2021 年，專門改裝客製化露營車輛，我們致力於推廣台灣的 Vanlife 文化。2025 年開始推出露營車租賃服務。我們相信，最動人的風景，不在終點，而是在每一段旅程之中。
              </p>
              <p className="text-stone-500 leading-relaxed text-sm text-justify">
                CampingTour was founded in 2021, specializing in custom campervan conversions, with a mission to promote Taiwan’s vanlife culture. In 2025, we expanded our services to include campervan rentals. We believe the most meaningful moments are not found at the destination, but throughout every journey along the way.
              </p>
            </div>

            {/* 分隔線 */}
            <div className="w-12 h-[1px] bg-stone-200 mx-auto"></div>

            {/* 第二段 */}
            <div className="space-y-3">
              <p className="text-stone-800 leading-relaxed text-lg text-justify font-medium">
                我們採用全新車輛合法打造的中華菱利 A180 特種露營車，從源頭即符合相關法規與使用安全標準，結合數位化預約系統與貼心管家服務，讓每一位旅人都能輕鬆展開「車泊」體驗，無需煩惱裝備與車輛準備。
              </p>
              <p className="text-stone-500 leading-relaxed text-sm text-justify">
                Our fleet is built using brand-new vehicles, legally converted into Zhonghua Veryca A180 specialized campervans, fully compliant with local regulations and safety standards from the ground up. Combined with a digital booking system and personalized concierge service, we make it easy for every traveler to enjoy the campervan experience — without worrying about equipment or vehicle preparation.
              </p>
            </div>

            {/* 分隔線 */}
            <div className="w-12 h-[1px] bg-stone-200 mx-auto"></div>

            {/* 第三段 */}
            <div className="space-y-3">
              <p className="text-stone-800 leading-relaxed text-lg text-justify font-medium">
                無論是追逐合歡山的第一道曙光，還是靜聽花東海岸的浪潮聲，CampingTour 都將成為您最安心、最自在的移動城堡。
              </p>
              <p className="text-stone-500 leading-relaxed text-sm text-justify">
                Whether you’re chasing the first light at Hehuanshan or listening to the waves along Taiwan’s east coast, CampingTour will be your most reliable and comfortable home on the road.
              </p>
            </div>
          </div>
        </div>

        {/* ☎️ 聯絡與公司資訊 (雙欄設計) */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* 左側：聯絡我們 */}
          <div className="bg-stone-900/95 backdrop-blur-md text-white p-10 rounded-3xl shadow-sm flex flex-col justify-center border border-stone-800">
            <h3 className="text-xl font-bold mb-8 tracking-wide">聯絡我們 Contact</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-orange-400"/>
                </div>
                <div>
                  <div className="text-[11px] text-stone-400 uppercase tracking-widest mb-1">Phone</div>
                  <div className="font-medium tracking-wide">0965-720-586</div>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-orange-400"/>
                </div>
                <div>
                  <div className="text-[11px] text-stone-400 uppercase tracking-widest mb-1">Email</div>
                  <div className="font-medium tracking-wide">cheyang0326@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-orange-400"/>
                </div>
                <div>
                  <div className="text-[11px] text-stone-400 uppercase tracking-widest mb-1">Location</div>
                  <div className="font-medium leading-relaxed">台北市北投區大度路一段157-2號</div>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：公司資訊 */}
          <div className="bg-white/85 backdrop-blur-md p-10 rounded-3xl shadow-sm border border-stone-100/50 flex flex-col justify-between">
             <div>
               <h3 className="text-xl font-bold mb-6 text-stone-900 tracking-wide">公司資訊 Info</h3>
               <ul className="space-y-4 text-stone-600 text-sm">
                  <li className="flex justify-between border-b border-stone-200/50 pb-3">
                    <strong className="text-stone-900">公司名稱</strong> 
                    <span>悠遊旅行社股份有限公司</span>
                  </li>
                  <li className="flex justify-between border-b border-stone-200/50 pb-3">
                    <strong className="text-stone-900">統一編號</strong> 
                    <span>84293135</span>
                  </li>
                  <li className="flex justify-between border-b border-stone-200/50 pb-3">
                    <strong className="text-stone-900">代表人</strong> 
                    <span>林繼城</span>
                  </li>
                  <li className="flex justify-between pb-1">
                    <strong className="text-stone-900">執照號碼</strong> 
                    <span>交觀甲字 5307 號</span>
                  </li>
               </ul>
             </div>
             <div className="pt-6 mt-4 text-[11px] text-stone-400 text-center border-t border-stone-200/50">
               Copyright © 2026 CampingTour Taiwan.
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}