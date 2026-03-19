import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* 📖 品牌故事區塊 */}
        <div className="bg-white p-10 md:p-16 rounded-3xl shadow-sm mb-12">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-2">關於 CampingTour</h2>
            <p className="text-stone-400 tracking-widest uppercase text-sm font-medium">Our Story</p>
          </div>

          {/* 雙語排版網格 (手機單欄，大螢幕雙欄) */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            
            {/* 🇹🇼 中文版 */}
            <div className="space-y-6 text-stone-700 leading-relaxed text-lg text-justify">
              <p>
                CampingTour 成立於 2021 年，專門改裝客製化露營車輛，我們致力於推廣台灣的 Vanlife 文化。2025 年開始推出露營車租賃服務。我們相信，最動人的風景，不在終點，而是在每一段旅程之中。
              </p>
              <p>
                我們採用全新車輛合法打造的中華菱利 A180 特種露營車，從源頭即符合相關法規與使用安全標準，結合數位化預約系統與貼心管家服務，讓每一位旅人都能輕鬆展開「車泊」體驗，無需煩惱裝備與車輛準備。
              </p>
              <p>
                無論是追逐合歡山的第一道曙光，還是靜聽花東海岸的浪潮聲，CampingTour 都將成為您最安心、最自在的移動城堡。
              </p>
            </div>

            {/* 🇺🇸 英文版 */}
            <div className="space-y-6 text-stone-500 leading-relaxed text-base text-justify">
              <p>
                CampingTour was founded in 2021, specializing in custom campervan conversions, with a mission to promote Taiwan’s vanlife culture. In 2025, we expanded our services to include campervan rentals.
              </p>
              <p>
                We believe the most meaningful moments are not found at the destination, but throughout every journey along the way.
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

        {/* ☎️ 聯絡與公司資訊 (保留你原本精美的設計) */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* 左側：聯絡我們 */}
          <div className="bg-stone-900 text-white p-10 rounded-3xl">
            <h3 className="text-xl font-bold mb-6">聯絡我們 Contact</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Phone size={22} className="text-orange-400"/>
                </div>
                <div>
                  <div className="text-xs text-stone-400 uppercase tracking-wider mb-1">Phone</div>
                  <div className="font-bold tracking-wide">0965-720-586</div>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Mail size={22} className="text-orange-400"/>
                </div>
                <div>
                  <div className="text-xs text-stone-400 uppercase tracking-wider mb-1">Email</div>
                  <div className="font-bold tracking-wide">cheyang0326@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin size={22} className="text-orange-400"/>
                </div>
                <div>
                  <div className="text-xs text-stone-400 uppercase tracking-wider mb-1">Location</div>
                  <div className="font-bold">台北市北投區大度路一段157-2號</div>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：公司資訊 */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-stone-100 flex flex-col justify-center">
             <h3 className="text-xl font-bold mb-6 text-stone-900">公司資訊 Company Info</h3>
             <ul className="space-y-4 text-stone-600 text-sm md:text-base">
                <li className="flex justify-between border-b border-stone-100 pb-2">
                  <strong className="text-stone-900">公司名稱</strong> 
                  <span>悠遊旅行社股份有限公司</span>
                </li>
                <li className="flex justify-between border-b border-stone-100 pb-2">
                  <strong className="text-stone-900">統一編號</strong> 
                  <span>84293135</span>
                </li>
                <li className="flex justify-between border-b border-stone-100 pb-2">
                  <strong className="text-stone-900">代表人</strong> 
                  <span>林繼城</span>
                </li>
                <li className="flex justify-between border-b border-stone-100 pb-2">
                  <strong className="text-stone-900">執照號碼</strong> 
                  <span>交觀甲字 5307 號</span>
                </li>
                <li className="pt-4 text-xs text-stone-400 text-center">
                  Copyright © 2026 CampingTour Taiwan. All rights reserved.
                </li>
             </ul>
          </div>

        </div>

      </div>
    </div>
  );
}