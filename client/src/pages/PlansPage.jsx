import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Zap, Users, Info, ChevronLeft, ChevronRight, Car, Tent, Wind, ShieldCheck } from 'lucide-react';

export default function PlansPage() {
  const navigate = useNavigate();
  
  const vehicleImages = [
    "/images/exterior-side.jpg",       
    "/images/interior-bed.jpg",        
    "/images/feature-awning-full.jpg", 
    "/images/vibe-drive.jpg",          
    "/images/vibe-stand.jpg",          
    "/images/feature-window.jpg",      
    "/images/vibe-chill.jpg",          
    "/images/feature-awning-close.jpg",
    "/images/vibe-mountain.jpg"        
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 自動輪播特效
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [vehicleImages.length]);

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length);
  };

  // ✅ 新增：合法合規圖示
  const specs = [
    { icon: ShieldCheck, label: "合法特種露營車 Legal Conversion" }, // 🆕 強調重點
    { icon: Car, label: "中華菱利 A180 (New Fleet)" },             // 🆕 強調車型
    { icon: Tent, label: "車邊帳 Car Awning" },
    { icon: Users, label: "雙人床鋪 Double Bed" },
    { icon: Wind, label: "駐車冷氣 AC System" },
    { icon: Zap, label: "300Ah 高容量電池 Battery" },
  ];

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
          <span className="text-orange-600 font-bold tracking-widest uppercase text-xs border border-orange-200 bg-orange-50 px-3 py-1 rounded-full mb-4 inline-block">Our Vehicles</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mt-2 mb-6">頂級車型與方案</h2>
        </div>

        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl max-w-6xl mx-auto border border-stone-100 mb-20 animate-fade-in delay-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* 左側：照片輪播區 (Ken Burns 緩慢放大特效) */}
            <div className="relative h-[450px] lg:h-auto group bg-stone-900 overflow-hidden">
              {vehicleImages.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`CampingTour A180 Campervan exterior and interior view ${idx + 1}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-out ${
                  idx === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
                onError={(e) => e.target.src='/images/vibe-drive.jpg'} 
              />
              ))}
              
              <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest z-10 border border-white/20 shadow-lg">
                Compliant & Safe
              </div>

              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-20 border border-white/30"
              >
                <ChevronLeft size={24}/>
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-20 border border-white/30"
              >
                <ChevronRight size={24}/>
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
                {vehicleImages.map((_, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-500 ${idx === currentImageIndex ? 'bg-white w-8 shadow-[0_0_10px_white]' : 'bg-white/40 hover:bg-white/80'}`} 
                  />
                ))}
              </div>
            </div>
            
            {/* 右側：詳細資訊 */}
            <div className="p-8 lg:p-14 flex flex-col justify-center bg-white">
              <h3 className="text-4xl font-bold text-stone-900 mb-2">Nomad A180</h3>
              <p className="text-xl text-orange-600 font-bold tracking-widest mb-8 uppercase text-sm">合法特種露營車 Legal Campervan</p>
              
              {/* ✅ 修正後的精準中英雙語文案 */}
              <div className="space-y-4 text-stone-600 leading-relaxed mb-10 text-lg font-medium border-l-4 border-orange-100 pl-6">
                <p>
                  CampingTour 堅持採用<span className="text-stone-900 font-bold">全新中華菱利 A180 車輛</span>，依法規<span className="text-green-600 font-bold">合法改裝為特種露營車</span>。從源頭即符合相關安全標準，讓您無需煩惱裝備準備，輕鬆展開安心自在的「車泊」旅程。
                </p>
                <p className="text-sm text-stone-500">
                  Our fleet utilizes <span className="text-stone-800 font-bold">brand-new Zhonghua Veryca A180 vehicles</span>, legally converted into <span className="text-green-600 font-bold">specialized campervans</span> that fully comply with local regulations and safety standards. Enjoy a hassle-free and safe "vanlife" experience.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                {specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-3 text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-100 hover:border-orange-200 hover:bg-orange-50 transition-colors group">
                    <spec.icon size={20} className="text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm">{spec.label}</span>
                  </div>
                ))}
              </div>

              <div className="bg-stone-900 rounded-2xl p-6 mb-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>
                <div className="relative z-10 flex justify-between items-center mb-4 border-b border-stone-700 pb-4">
                  <span className="text-stone-400 font-medium">平日 (Weekday)</span>
                  <span className="font-bold text-2xl">NT$ 3,700<span className="text-sm font-normal text-stone-400">/Day</span></span>
                </div>
                <div className="relative z-10 flex justify-between items-center">
                  <span className="text-stone-400 font-medium">假日 (Weekend)</span>
                  <span className="font-bold text-2xl text-orange-400">NT$ 4,700<span className="text-sm font-normal text-stone-500">/Day</span></span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/booking')}
                className="w-full bg-orange-600 text-white py-4.5 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-[0_4px_14px_0_rgba(234,88,12,0.39)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.23)] hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
              >
                查看可預約日期 Check Availability
              </button>
            </div>
          </div>
        </div>

        {/* 隨車配備區保留 */}
        <div className="mb-20 animate-fade-in delay-200">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-serif font-bold text-stone-900">隨車配備 Included Equipment</h3>
            <p className="text-stone-500 mt-2">免裝備露營，我們都幫您準備好了 / All set for your adventure</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {['睡袋 ×2、枕頭 ×2 (Bedding)', '小瓦斯爐 + 鍋具 (Stove & Pot)', '110V 插座及延長線 (Power)', '摺疊水桶 + 淋浴器 (Shower)', '露營桌椅組 (Table & Chairs)', '露營餐具組 (Kitchenware)', '營燈 ×2、串燈 (Lights)', '烤盤 (Grill Pan)'].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 bg-white p-6 rounded-2xl shadow-sm border border-stone-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all group min-h-[140px] justify-center">
                <CheckCircle size={28} className="text-stone-300 group-hover:text-green-500 transition-colors mb-2 flex-shrink-0"/>
                <span className="font-bold text-stone-800 text-sm leading-dashed">{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 text-sm text-stone-600 bg-stone-100 py-4 rounded-xl max-w-2xl mx-auto font-medium">
            <Info size={18} className="inline mr-2 text-stone-400 mb-0.5"/> 貼心提醒：個人盥洗用具（毛巾、牙刷）基於衛生考量，請旅客自行準備。<br/>
            <span className="text-xs text-stone-500 ml-6">Notice: Please bring your own personal toiletries (towels, toothbrushes) for hygiene reasons.</span>
          </div>
        </div>

      </div>
    </div>
  );
}