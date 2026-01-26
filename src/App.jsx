import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Instagram, Facebook, MapPin, Star, ArrowRight, 
  ChevronDown, Phone, Mail, Download, ExternalLink, Car, 
  Calendar, CheckCircle, Info, Users, Fuel, Zap, ChevronLeft, ChevronRight, MessageCircle
} from 'lucide-react';

/**
 * CampingTour 車泊輕旅 - 2026 旗艦版
 * Update: 整合詳細車型數據、多圖輪播、Line@ 預約流程
 */

// --- 全域資料設定 ---
const CONTACT_INFO = {
  name: "楊哲",
  phone: "0965-720-586",
  email: "cheyang0326@gmail.com",
  fb: "車泊輕旅",
  ig: "freeyooung_campervan",
  igLink: "https://www.instagram.com/freeyooung_campervan/",
  fbLink: "#"
};

// 圖片 CDN 基礎路徑 (來自原網站)
const IMG_BASE = "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_1/20047068/";

// --- 子組件：圖片輪播 (Image Gallery) ---
const ImageGallery = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-64 md:h-96 group overflow-hidden bg-stone-100">
      <img 
        src={images[currentIndex]} 
        alt={`${alt} ${currentIndex + 1}`} 
        className="w-full h-full object-cover transition-opacity duration-500"
      />
      
      {/* 左右切換按鈕 (Hover 時顯示) */}
      <button 
        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronRight size={20} />
      </button>

      {/* 底部指示點 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <div 
            key={idx} 
            className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

// --- 子組件：導覽列 (Navbar) ---
const Navbar = ({ activePage, setActivePage, isScrolled }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { id: 'home', label: '首頁 Home' },
    { id: 'plans', label: '方案介紹 Plans' },
    { id: 'booking', label: '預約流程 Booking' },
    { id: 'guide', label: '旅遊攻略 Guide' },
    { id: 'about', label: '關於我們 About' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || activePage !== 'home' ? 'bg-white/95 backdrop-blur-md shadow-sm py-4 text-stone-800' : 'bg-transparent py-6 text-white'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActivePage('home')}>
          <div className="text-2xl font-serif font-bold tracking-wider">
            CampingTour <span className="text-orange-600">.</span>
          </div>
          <span className={`text-sm tracking-widest hidden md:block opacity-80 group-hover:opacity-100 transition-opacity`}>車泊輕旅</span>
        </div>

        <div className="hidden md:flex space-x-8 font-medium text-sm tracking-wide">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActivePage(link.id)}
              className={`transition-colors relative pb-1 ${activePage === link.id ? 'text-orange-600 font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-600' : 'hover:text-orange-500'}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="text-stone-800" /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-6 px-6 flex flex-col space-y-4 border-t border-stone-100">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { setActivePage(link.id); setIsMobileMenuOpen(false); }}
              className={`text-left text-lg font-medium py-2 ${activePage === link.id ? 'text-orange-600' : 'text-stone-600'}`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

// --- 子組件：頁腳 (Footer) ---
const Footer = ({ setActivePage }) => (
  <footer className="bg-stone-900 text-stone-400 py-16">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-stone-800 pb-12">
      <div className="col-span-1 md:col-span-2 space-y-4">
        <h3 className="text-white text-3xl font-serif font-bold">CampingTour .</h3>
        <p className="max-w-sm leading-relaxed">台灣最專業的露營車租賃服務。<br />隨心所欲，探索山海。</p>
        <div className="flex gap-4 pt-4">
          <a href={CONTACT_INFO.fbLink} className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all"><Facebook size={20} /></a>
          <a href={CONTACT_INFO.igLink} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all"><Instagram size={20} /></a>
        </div>
      </div>
      
      <div>
        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Quick Links</h4>
        <ul className="space-y-3">
          <li><button onClick={() => setActivePage('plans')} className="hover:text-white transition-colors">方案介紹 Plans</button></li>
          <li><button onClick={() => setActivePage('booking')} className="hover:text-white transition-colors">預約流程 Booking</button></li>
          <li><button onClick={() => setActivePage('guide')} className="hover:text-white transition-colors">旅遊攻略 Guide</button></li>
        </ul>
      </div>
      
      <div>
        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Contact</h4>
        <ul className="space-y-4">
          <li className="flex items-start gap-3"><Phone size={18} className="mt-1 text-orange-500" /> <div><span className="block text-white font-medium">{CONTACT_INFO.name}</span><span>{CONTACT_INFO.phone}</span></div></li>
          <li className="flex items-start gap-3"><Mail size={18} className="mt-1 text-orange-500" /> <span>{CONTACT_INFO.email}</span></li>
          <li className="flex items-start gap-3"><MapPin size={18} className="mt-1 text-orange-500" /> <span>桃園高鐵站 1號出口停車場</span></li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto px-6 text-center text-sm text-stone-600">
      <p>&copy; 2026 CampingTour Taiwan. All Rights Reserved.</p>
    </div>
  </footer>
);

// --- 頁面 1: 首頁 (Home) ---
const HomePage = ({ setActivePage }) => (
  <>
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" alt="Camping" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-stone-900/40"></div>
      </div>
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto mt-10">
        <p className="text-orange-400 font-medium tracking-[0.3em] mb-4 uppercase">Explore Taiwan Your Way</p>
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight drop-shadow-xl">車泊輕旅<br /><span className="text-3xl md:text-5xl font-light mt-2 block opacity-90">CampingTour Taiwan</span></h1>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button onClick={() => setActivePage('booking')} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg flex items-center justify-center gap-2">立即預約 Booking <ArrowRight size={18} /></button>
          <button onClick={() => setActivePage('plans')} className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-full font-medium transition-all">車型介紹 Vehicles</button>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/70"><ChevronDown size={32} /></div>
    </section>

    <section className="py-24 bg-stone-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-6"><Car size={40} className="text-orange-600 mx-auto mb-6" /><h3 className="text-xl font-bold mb-4">輕鬆駕駛</h3><p className="text-stone-600">自用小客車駕照即可駕駛，車體輕巧靈活。</p></div>
          <div className="p-6"><MapPin size={40} className="text-orange-600 mx-auto mb-6" /><h3 className="text-xl font-bold mb-4">隨停隨宿</h3><p className="text-stone-600">不用搭帳篷，打開車門就是大自然。</p></div>
          <div className="p-6"><Zap size={40} className="text-orange-600 mx-auto mb-6" /><h3 className="text-xl font-bold mb-4">電力充足</h3><p className="text-stone-600">配備駐車冷氣與大容量電池，舒適過夜。</p></div>
        </div>
      </div>
    </section>
  </>
);

// --- 頁面 2: 方案＆車輛介紹 (Plans & Vehicles) ---
const PlansPage = () => {
  const vehicles = [
    {
      id: 1,
      name: "Veryca Revival Camper",
      nameZh: "經典復古露營車",
      prices: { weekday: "NT$ 3,000", weekend: "NT$ 4,000" },
      desc: "以經典 Mitsubishi Veryca 改裝，擁有復古外型與齊全設備。適合想體驗懷舊風格與簡單車泊樂趣的旅人。",
      specs: [
        { icon: Users, label: "適合 1-2 人" },
        { icon: Car, label: "自排 / 手排可選" },
        { icon: Fuel, label: "95 無鉛汽油" },
        { icon: Zap, label: "500Ah 電池" },
      ],
      features: ["駐車冷氣 + 循環扇", "車邊帳", "雙人床鋪", "後尾廚櫃"],
      // 使用您提供的 Veryca 照片 (第一張重複使用)
      images: [
        `${IMG_BASE}931809_419866.jpeg`, // Main
        `${IMG_BASE}123548_170185.jpeg`,
        `${IMG_BASE}15333_10888.jpeg`,
        `${IMG_BASE}957709_856997.jpeg`
      ]
    },
    {
      id: 2,
      name: "A180 Adventure Camper",
      nameZh: "戶外探險露營車",
      prices: { weekday: "NT$ 3,700", weekend: "NT$ 4,700" },
      desc: "為熱愛戶外與未知旅程而生。配備外推窗與升級版電力系統，是您探索台灣秘境的可靠基地。",
      specs: [
        { icon: Users, label: "適合 2-3 人" },
        { icon: Car, label: "自排變速箱" },
        { icon: Fuel, label: "95 無鉛汽油" },
        { icon: Zap, label: "280Ah 鋰鐵電池" },
      ],
      features: ["外推窗設計", "駐車冷氣", "高機動性", "110V 插座"],
      // 使用您提供的 A180 照片 (第一張重複使用)
      images: [
        `${IMG_BASE}42199_731384.jpeg`, // Main
        `${IMG_BASE}645575_113678.jpeg`,
        `${IMG_BASE}940323_906701.jpeg`,
        `${IMG_BASE}661439_125428.jpeg`
      ]
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Our Fleet</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">精選改裝車款，定期保養，確保您的旅途舒適安全。</p>
        </div>

        <div className="space-y-20">
          {vehicles.map((v, idx) => (
            <div key={v.id} className={`bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-100 flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
              
              {/* 左側：圖片輪播 */}
              <div className="w-full lg:w-1/2">
                <ImageGallery images={v.images} alt={v.name} />
              </div>

              {/* 右側：詳細資訊 */}
              <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-stone-900">{v.name}</h3>
                    <h4 className="text-lg text-orange-600 font-medium">{v.nameZh}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-stone-500">平日</div>
                    <div className="font-bold text-stone-800">{v.prices.weekday}<span className="text-xs font-normal">/日</span></div>
                    <div className="text-sm text-stone-500 mt-1">假日</div>
                    <div className="font-bold text-stone-800">{v.prices.weekend}<span className="text-xs font-normal">/日</span></div>
                  </div>
                </div>

                <p className="text-stone-600 mb-8 leading-relaxed">{v.desc}</p>

                {/* 規格 Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8 bg-stone-50 p-4 rounded-xl">
                  {v.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-stone-700">
                      <spec.icon size={18} className="text-stone-400" />
                      <span className="text-sm font-medium">{spec.label}</span>
                    </div>
                  ))}
                </div>

                {/* 特色列表 */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {v.features.map(f => (
                    <span key={f} className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 頁面 3: 預約流程 (Booking Process) - 全新改版 ---
const BookingPage = () => {
  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Booking Process</h2>
          <p className="text-stone-600">透過 Line@ 輕鬆預約，專人為您服務</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          
          {/* 左側：Line 預約卡片 */}
          <div className="bg-white p-10 rounded-3xl shadow-xl border-t-4 border-green-500 text-center sticky top-28">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={40} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">加入 Line 官方帳號</h3>
            <p className="text-stone-500 mb-8">掃描 QR Code 或搜尋 ID，直接與我們聯繫預約</p>
            
            {/* 假 QR Code 區域 */}
            <div className="bg-stone-100 p-4 rounded-xl inline-block mb-6 group cursor-pointer relative">
              {/* 使用 API 生成一個 "Line Contact" 的 QR Code */}
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://line.me/ti/p/~@campingtour" 
                alt="Line QR Code" 
                className="w-48 h-48 mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="mt-2 font-mono text-stone-500 text-sm">ID: @campingtour</div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 rounded-xl">
                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">點擊加入</span>
              </div>
            </div>

            <button className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              <MessageCircle size={20} />
              打開 Line 預約
            </button>
          </div>

          {/* 右側：詳細步驟與須知 */}
          <div className="space-y-8">
            {/* 步驟 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold text-xl font-serif">1</div>
              <div>
                <h4 className="text-xl font-bold text-stone-900 mb-2">確認行程與車款</h4>
                <p className="text-stone-600 leading-relaxed">
                  請先確認您的出發日期、天數以及人數。
                  <br/><span className="text-orange-600 text-sm">*建議提前 2-4 週預約，以免向隅。</span>
                </p>
              </div>
            </div>

            {/* 步驟 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold text-xl font-serif">2</div>
              <div>
                <h4 className="text-xl font-bold text-stone-900 mb-2">聯繫與支付訂金</h4>
                <p className="text-stone-600 leading-relaxed">
                  透過 Line 告知需求，確認檔期後，請於 3 日內支付 <span className="font-bold text-stone-900">30% 訂金</span> 以保留車輛。
                  <br/>尾款請於取車前 14 天付清。
                </p>
              </div>
            </div>

            {/* 步驟 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold text-xl font-serif">3</div>
              <div>
                <h4 className="text-xl font-bold text-stone-900 mb-2">取車出發</h4>
                <p className="text-stone-600 leading-relaxed">
                  攜帶駕照與身分證件，至 <span className="font-bold">桃園高鐵站 1 號出口</span> 取車。
                  我們將進行約 30 分鐘的車輛操作教學。
                </p>
              </div>
            </div>

            {/* 重要須知卡片 */}
            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 mt-8">
              <h5 className="font-bold text-stone-900 flex items-center gap-2 mb-3">
                <Info size={18} className="text-orange-600" /> 重要須知
              </h5>
              <ul className="space-y-2 text-sm text-stone-700 list-disc list-inside">
                <li><span className="font-bold">外籍旅客</span>：必須購買額外的租車險 (Car Hire Excess Insurance)。</li>
                <li><span className="font-bold">每日里程</span>：限制 300 公里，超程費用 NT$8/km。</li>
                <li><span className="font-bold">取消政策</span>：出發前 14 天取消可全額退款 (扣除手續費)。</li>
                <li><span className="font-bold">保證金</span>：取車時需支付 NT$5,000 保證金 (還車無誤後退還)。</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- 頁面 4: 旅遊攻略 (Travel Guide) ---
const GuidePage = () => {
  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Travel Guide</h2>
          <p className="text-stone-600">專為車泊旅人打造的路線與工具</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg flex flex-col items-center text-center p-10 border border-stone-100">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-orange-200 shadow-xl"><Car className="text-white w-10 h-10" /></div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">CampingTour App</h3>
            <p className="text-stone-500 mb-8 max-w-xs">下載我們的專屬 App，內建全台車泊地圖、水廁資訊以及私房景點推薦。</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button className="flex items-center justify-center gap-3 bg-stone-900 text-white px-6 py-3 rounded-xl hover:bg-stone-800 transition-colors w-full sm:w-auto"><Download size={20} /><div className="text-left"><div className="text-[10px] uppercase tracking-wider">Download on the</div><div className="font-bold leading-none">App Store</div></div></button>
              <button className="flex items-center justify-center gap-3 bg-stone-900 text-white px-6 py-3 rounded-xl hover:bg-stone-800 transition-colors w-full sm:w-auto"><Download size={20} /><div className="text-left"><div className="text-[10px] uppercase tracking-wider">Get it on</div><div className="font-bold leading-none">Google Play</div></div></button>
            </div>
          </div>
          <div className="bg-stone-900 rounded-3xl overflow-hidden shadow-lg group relative h-full min-h-[400px]">
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Taiwan Road Trip" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="relative z-10 p-10 h-full flex flex-col justify-end">
              <div className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">MUST READ</div>
              <h3 className="text-3xl font-serif font-bold text-white mb-4 leading-tight">The Perfect Taiwan Road Trip in 15 Days</h3>
              <p className="text-stone-300 mb-8 line-clamp-3">Sporty Travellers 推薦！深入探索台灣的最佳路線規劃。</p>
              <a href="https://www.sportytravellers.com/asia/the-perfect-taiwan-road-trip-in-15-days/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white font-bold border-b border-orange-500 pb-1 w-fit hover:text-orange-400 transition-colors">閱讀完整文章 <ExternalLink size={16} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 頁面 5: 關於我們 (About Us) ---
const AboutPage = () => {
  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="absolute top-4 -left-4 w-full h-full border-2 border-orange-200 rounded-3xl z-0"></div>
              <img src="https://images.unsplash.com/photo-1533240332313-0db49b459ad6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="About Team" className="relative z-10 rounded-3xl shadow-xl w-full"/>
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-4xl font-serif font-bold text-stone-900">不追求完美，<br/>只追求真實的感動。</h2>
            <p className="text-stone-600 leading-relaxed text-lg">露途臺灣 (CampingTour) 提供露營車出租服務，讓你用自己的節奏探索台灣。我們相信，旅程的美好來自當下的感受，而不是設備有多豪華。</p>
            <div className="pt-8 border-t border-stone-100">
              <h3 className="font-bold text-stone-900 mb-4">Contact Us</h3>
              <ul className="space-y-3 text-stone-600">
                <li className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Phone size={16} /></div><span className="font-medium text-lg">{CONTACT_INFO.phone} ({CONTACT_INFO.name})</span></li>
                <li className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Mail size={16} /></div><span className="font-medium text-lg">{CONTACT_INFO.email}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 主程式進入點 ---
const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 50); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderContent = () => {
    switch(activePage) {
      case 'home': return <HomePage setActivePage={setActivePage} />;
      case 'plans': return <PlansPage />;
      case 'booking': return <BookingPage />;
      case 'guide': return <GuidePage />;
      case 'about': return <AboutPage />;
      default: return <HomePage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="font-sans text-stone-800 bg-stone-50 selection:bg-orange-200 min-h-screen flex flex-col">
      <Navbar activePage={activePage} setActivePage={setActivePage} isScrolled={isScrolled} />
      <main className="flex-grow"><div key={activePage} className="animate-fade-in">{renderContent()}</div></main>
      <Footer setActivePage={setActivePage} />
    </div>
  );
};

export default App;