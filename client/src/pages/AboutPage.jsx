import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* 品牌故事 */}
        <div className="bg-white p-10 md:p-16 rounded-3xl shadow-sm mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-8 text-center">關於 CampingTour</h2>
          <div className="space-y-6 text-stone-600 leading-relaxed text-lg">
            <p>
              CampingTour 成立於 2026 年，致力於推廣台灣的 Vanlife 文化。我們相信，最美的風景不在終點，而是在路上。
            </p>
            <p>
              我們引進德國原裝 Volkswagen California 頂級露營車，結合數位化的預約體驗與貼心的管家服務，讓每一位旅人都能輕鬆享受「車泊」的樂趣，無須擔心裝備與車輛問題。
            </p>
            <p>
              無論是追逐合歡山的日出，或是聆聽花東海岸的浪濤，CampingTour 都是您最可靠的移動城堡。
            </p>
          </div>
        </div>

        {/* 聯絡資訊 */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-stone-900 text-white p-10 rounded-3xl">
            <h3 className="text-xl font-bold mb-6">聯絡我們 Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Phone size={20} className="text-orange-400"/>
                </div>
                <div>
                  <div className="text-xs text-stone-400 uppercase">Phone</div>
                  <div className="font-bold">0965-720-586</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Mail size={20} className="text-orange-400"/>
                </div>
                <div>
                  <div className="text-xs text-stone-400 uppercase">Email</div>
                  <div className="font-bold">cheyang0326@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin size={20} className="text-orange-400"/>
                </div>
                <div>
                  <div className="text-xs text-stone-400 uppercase">Location</div>
                  <div className="font-bold">台北市北投區大度路一段157-2號</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-sm border border-stone-100 flex flex-col justify-center">
             <h3 className="text-xl font-bold mb-4 text-stone-900">公司資訊</h3>
             <ul className="space-y-3 text-stone-600 text-sm">
                <li><strong className="text-stone-900">公司名稱：</strong> 悠遊旅行社股份有限公司</li>
                <li><strong className="text-stone-900">統一編號：</strong> 84293135</li>
                <li><strong className="text-stone-900">代表人：</strong> 林繼城</li>
                <li><strong className="text-stone-900">執照號碼：</strong> 交觀甲字 5307 號</li>
                <li className="pt-2 text-xs text-stone-400">Copyright © 2026 CampingTour Taiwan. All rights reserved.</li>
             </ul>
          </div>
        </div>

      </div>
    </div>
  );
}