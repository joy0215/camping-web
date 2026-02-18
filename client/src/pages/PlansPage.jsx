import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Zap, Fuel, Users, Info, ChevronLeft, ChevronRight, Car, Tent, Wind, Utensils } from 'lucide-react';

export default function PlansPage() {
  const navigate = useNavigate();
  
  // --- 📸 1. 設定完整的圖片清單 (還原原本的 gallery) ---
  const vehicleImages = [
    "/images/exterior-side.jpg",       // 車身側邊
    "/images/interior-bed.jpg",        // 車內床鋪
    "/images/feature-awning-full.jpg", // 車邊帳全開
    "/images/vibe-drive.jpg",          // 行駛氛圍
    "/images/vibe-stand.jpg",          // 駐車氛圍
    "/images/feature-window.jpg",      // 外推窗特寫
    "/images/vibe-chill.jpg",          // 露營休閒
    "/images/feature-awning-close.jpg",// 車邊帳收合
    "/images/vibe-mountain.jpg"        // 山景
  ];

  // --- 📸 2. 輪播邏輯 ---
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length);
  };

  // 規格表 (Specs)
  const specs = [
    { icon: Car, label: "自動變速 Auto Transmission" },
    { icon: Tent, label: "車邊帳 Car Awning" },
    { icon: Users, label: "雙人床鋪 Double Bed (1-2 pax)" },
    { icon: Wind, label: "外推窗 Awning Window" },
    { icon: Wind, label: "駐車冷氣 AC System" },
    { icon: Zap, label: "300Ah 高容量電池 Battery" },
  ];

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        
        {/* 標題區 */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-orange-600 font-bold tracking-widest uppercase text-sm">Our Vehicles</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mt-3 mb-6">頂級車型與方案</h2>
          <p className="text-stone-500 text-lg">我們選用 Volkswagen T6.1 California Ocean 頂級露營車，為您提供最安全、舒適的移動體驗。</p>
        </div>

        {/* --- 車輛展示卡片 (含輪播功能) --- */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl max-w-6xl mx-auto border border-stone-100 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* 左側：照片輪播區 */}
            <div className="relative h-[400px] lg:h-auto group bg-stone-200 overflow-hidden">
              <img 
                src={vehicleImages[currentImageIndex]} 
                alt={`Vehicle view ${currentImageIndex + 1}`} 
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                onError={(e) => e.target.src='/images/vibe-drive.jpg'} 
              />
              
              {/* 標籤 */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10">
                Premium Series
              </div>

              {/* 左右按鈕 */}
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-20"
              >
                <ChevronLeft size={24}/>
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-20"
              >
                <ChevronRight size={24}/>
              </button>

              {/* 下方圓點 */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {vehicleImages.map((_, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all shadow-sm ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`} 
                  />
                ))}
              </div>
            </div>
            
            {/* 右側：詳細資訊 */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-stone-900 mb-2">Nomad A180 Camper</h3>
              <p className="text-xl text-orange-600 font-medium tracking-wide mb-6">戶外探險號</p>
              
              <p className="text-stone-600 leading-relaxed mb-8 text-lg">
                為熱愛戶外與未知旅程而生。這不僅是一輛車，更是您在山林與海邊的移動城堡。配備外推窗、舒適床鋪與完善電力系統，讓您在任何地方都能睡得安穩。
              </p>
              
              {/* 規格圖示 */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-3 text-stone-700 bg-stone-50 p-3 rounded-lg">
                    <spec.icon size={20} className="text-stone-400 flex-shrink-0" />
                    <span className="font-medium text-sm">{spec.label}</span>
                  </div>
                ))}
              </div>

              {/* 價格區塊 */}
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-stone-600">平日 (Weekday)</span>
                  <span className="font-bold text-xl text-stone-800">NT$ 3,700<span className="text-sm font-normal">/Day</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">假日 (Weekend)</span>
                  <span className="font-bold text-xl text-stone-800">NT$ 4,700<span className="text-sm font-normal">/Day</span></span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/booking')}
                className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg"
              >
                查看可預約日期 (Check Availability)
              </button>
            </div>
          </div>
        </div>

        {/* 隨車配備區 */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-serif font-bold text-stone-900">隨車配備 Included Equipment</h3>
            <p className="text-stone-500 mt-2">免裝備露營，我們都幫您準備好了</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {['睡袋 ×2、枕頭 ×2', '小瓦斯爐 + 鍋具', '110V 插座及延長線', '摺疊水桶 + 淋浴器', '露營桌椅組', '露營餐具組 (4人)', '營燈 ×2、串燈', '烤盤'].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 bg-white p-6 rounded-xl shadow-sm border border-stone-100 text-center hover:shadow-md transition-shadow">
                <CheckCircle size={24} className="text-green-500 mb-2"/>
                <span className="font-bold text-stone-800">{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-6 text-sm text-stone-500 bg-green-50 py-3 rounded-lg border border-green-100 max-w-2xl mx-auto">
            <Info size={16} className="inline mr-1 mb-0.5"/> 貼心提醒：個人盥洗用具（毛巾、牙刷）基於衛生考量，請旅客自行準備。
          </div>
        </div>

      </div>
    </div>
  );
}