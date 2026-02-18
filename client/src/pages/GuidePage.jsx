import React from 'react';
import { Download, ExternalLink, Smartphone, Tent, Star, Quote, MapPin } from 'lucide-react';

export default function GuidePage() {
  
  // ✅ 已更新為您提供的正確連結
  const LINKS = {
    appStore: "https://apps.apple.com/app/id1668213216", 
    googlePlay: "https://play.google.com/store/apps/details?id=cmsp.bedincar&pcampaignid=web_share",
    article: "https://www.sportytravellers.com/asia/the-perfect-taiwan-road-trip-in-15-days/"
  };

  // 💬 用戶反饋假資料 (之後可接後端)
  const feedbacks = [
    {
      name: "Sarah & Mike",
      role: "來自 德國 Germany",
      rating: 5,
      comment: "Absolutely amazing experience! The van was clean and the booking process was super smooth. Taiwan is beautiful!",
      date: "2025.12"
    },
    {
      name: "田中 健一",
      role: "來自 日本 Japan",
      rating: 5,
      comment: "初めての台湾キャンプでしたが、アプリの地図機能がとても便利でした。車も運転しやすかったです。",
      date: "2026.01"
    },
    {
      name: "Emily Chen",
      role: "來自 台北 Taipei",
      rating: 5,
      comment: "臨時決定要來一趟說走就走的旅行，還好有 CampingTour！客服回覆很快，車況也很新，大推！",
      date: "2026.02"
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* --- 頁面標題 --- */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-3">Travel Guide</h2>
          <p className="text-stone-500">讓您的旅程更智慧、更豐富的必備工具</p>
        </div>

        {/* --- 區塊 1: 官方 APP (黑色質感大卡片 - 已更新連結) --- */}
        <div className="bg-stone-900 rounded-[2.5rem] p-8 md:p-14 mb-16 text-white relative overflow-hidden shadow-2xl group">
          {/* 背景光暈 */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-[150px] opacity-20 -mr-20 -mt-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-700"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-10 -ml-20 -mb-20 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* 左側：文字與下載按鈕 */}
            <div className="text-center md:text-left max-w-xl flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 text-orange-300 shadow-sm">
                <Smartphone size={14} /> Official App
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                下載 CampingTour <br/>官方 APP
              </h2>
              <p className="text-stone-300 text-lg mb-10 leading-relaxed font-light">
                解鎖更多隱藏泊點、即時車況監控，以及會員專屬優惠。<br className="hidden md:block"/>
                讓您的車泊旅程更智慧、更便利。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                {/* iOS Button */}
                <a href={LINKS.appStore} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white text-stone-900 px-6 py-4 rounded-xl hover:bg-stone-200 transition-all font-bold shadow-lg hover:-translate-y-1 group/btn">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg" alt="App Store" className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase leading-none text-stone-500 font-bold tracking-wider">Download on the</div>
                    <div className="text-sm leading-none mt-1 font-bold">App Store</div>
                  </div>
                </a>
                {/* Android Button */}
                <a href={LINKS.googlePlay} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-stone-800 border border-stone-700 text-white px-6 py-4 rounded-xl hover:bg-stone-700 transition-all font-bold shadow-lg hover:-translate-y-1 group/btn">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Google Play" className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase leading-none text-stone-400 font-bold tracking-wider">Get it on</div>
                    <div className="text-sm leading-none mt-1 font-bold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* 右側：手機示意圖 */}
            <div className="flex-1 flex justify-center md:justify-end relative">
               <div className="relative bg-stone-800 p-3 rounded-[3rem] border-8 border-stone-800 shadow-2xl transform rotate-[-6deg] hover:rotate-0 transition-transform duration-700 w-[260px] md:w-[280px]">
                  <div className="bg-stone-900 rounded-[2.5rem] h-[480px] flex flex-col items-center justify-center relative overflow-hidden border border-stone-700">
                     <div className="absolute inset-0 bg-gradient-to-b from-stone-800/50 to-stone-900"></div>
                     <div className="relative z-10 flex flex-col items-center gap-5">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center shadow-lg mb-2">
                            <Tent size={48} className="text-white"/>
                        </div>
                        <span className="text-2xl font-serif font-bold text-white tracking-wide">BedInCar</span>
                     </div>
                     <div className="absolute bottom-6 w-32 h-1.5 bg-stone-700 rounded-full"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* --- 區塊 2: 推薦閱讀 (單欄滿版設計) --- */}
        <div className="mb-20">
             <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-100 flex flex-col md:flex-row items-center gap-10 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group relative overflow-hidden">
                {/* 裝飾背景 */}
                <div className="absolute right-0 top-0 w-1/2 h-full bg-orange-50 skew-x-[-20deg] translate-x-20 group-hover:translate-x-10 transition-transform duration-700"></div>
                
                {/* 左側圖標與文字 */}
                <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                            <ExternalLink size={28} />
                        </div>
                        <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Must Read</span>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-stone-900 mb-4 group-hover:text-orange-600 transition-colors">The Perfect Taiwan Road Trip</h3>
                    <p className="text-stone-500 text-lg leading-relaxed mb-8">
                        Sporty Travellers 真心推薦！外國旅人眼中的台灣秘境。<br/>
                        深入探索台灣的最佳路線規劃 (15 Days Guide)，從山林到海洋，發現不一樣的福爾摩沙。
                    </p>

                    {/* 長條形按鈕 */}
                    <a 
                        href={LINKS.article} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="block w-full md:w-auto md:inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-center"
                    >
                        閱讀完整文章 (Read Article) <ExternalLink size={18}/>
                    </a>
                </div>

                {/* 右側圖片 */}
                <div className="relative z-10 w-full md:w-1/3 h-64 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 hidden md:block">
                     <img 
                        src="/images/vibe-mountain.jpg" 
                        alt="Article Cover" 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => e.target.src='https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80'}
                     />
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>
            </div>
        </div>

        {/* --- 區塊 3: 用戶反饋 (待開發區域) --- */}
        <div>
            <div className="text-center mb-10">
                <h3 className="text-3xl font-serif font-bold text-stone-900 mb-3">Traveller Stories</h3>
                <p className="text-stone-500">聽聽來自世界各地的旅人怎麼說</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {feedbacks.map((item, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow flex flex-col relative">
                        <Quote size={40} className="text-orange-100 absolute top-6 right-6" />
                        
                        <div className="flex gap-1 text-orange-400 mb-4">
                            {[...Array(item.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        
                        <p className="text-stone-600 mb-6 flex-grow italic leading-relaxed">"{item.comment}"</p>
                        
                        <div className="border-t border-stone-100 pt-4 mt-auto">
                            <div className="font-bold text-stone-900">{item.name}</div>
                            <div className="text-xs text-stone-400 flex justify-between mt-1">
                                <span>{item.role}</span>
                                <span>{item.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 待開發標示 */}
            <div className="mt-12 text-center opacity-60 hover:opacity-100 transition-opacity cursor-help" title="此區域功能尚在開發中">
                <div className="inline-flex items-center gap-2 bg-stone-100 text-stone-500 text-xs px-4 py-2 rounded-full border border-stone-200 border-dashed">
                    {/* 🚧 To-Do: User Feedback API Integration} */}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}