import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Instagram, Facebook, MapPin, ArrowRight, 
  ChevronDown, Phone, Mail, Download, ExternalLink, Car, 
  Calendar, CheckCircle, Info, Users, Fuel, Zap, ChevronLeft, ChevronRight, MessageCircle, Plus, Minus, Wind, Tent, Printer, Utensils
} from 'lucide-react';

/**
 * CampingTour 車泊輕旅 - 2026 旗艦版 (Final)
 * Update: 整合悠遊旅行社資訊、完整配備列表、多樣化價格方案
 */

// --- 全域資料設定 ---
const CONTACT_INFO = {
  name: "楊哲",
  phone: "0965-720-586",
  email: "cheyang0326@gmail.com",
  fb: "車泊輕旅",
  ig: "freeyooung_campervan",
  igLink: "https://www.instagram.com/freeyooung_campervan/",
  fbLink: "#",
  address: "台北市北投區大度路一段157-2號", // 取車地點
  
  // 旅行社公司登記資料
  company: {
    name: "悠遊旅行社股份有限公司",
    address: "桃園市蘆竹區光明路二段251號",
    phone: "03-352-8186",
    fax: "03-312-4904",
    email: "f774955@hotmail.com",
    rep: "林繼城",
    taxId: "84293135"
  }
};

// 圖片路徑 (對應 public/images/)
const IMAGES = {
  hero: "/images/hero-roof.jpg",
  drive: "/images/vibe-drive.jpg",
  stand: "/images/vibe-stand.jpg",      // 新增：女生站車旁
  side: "/images/exterior-side.jpg",
  bed: "/images/interior-bed.jpg",
  awningFull: "/images/feature-awning-full.jpg",
  awningClose: "/images/feature-awning-close.jpg",
  window: "/images/feature-window.jpg",
  chill: "/images/vibe-chill.jpg",
  mountain: "/images/vibe-mountain.jpg"
};

// --- 子組件：圖片輪播 ---
const ImageGallery = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-[300px] md:h-[500px] group overflow-hidden bg-stone-100 rounded-3xl shadow-lg">
      <img src={images[currentIndex]} alt={`${alt} ${currentIndex + 1}`} className="w-full h-full object-cover transition-opacity duration-500"/>
      <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-all"><ChevronLeft size={24} /></button>
      <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-all"><ChevronRight size={24} /></button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
};

// --- 子組件：政策摺疊項目 ---
const PolicyItem = ({ title, icon: Icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden mb-4 bg-white shadow-sm transition-all hover:shadow-md">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-stone-50 transition-colors">
        <div className="flex items-center gap-3 font-bold text-stone-800 text-lg">{Icon && <Icon className="text-orange-600" size={24} />}{title}</div>
        {isOpen ? <Minus size={20} className="text-stone-400" /> : <Plus size={20} className="text-stone-400" />}
      </button>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 pt-0 text-stone-600 leading-relaxed border-t border-stone-100">{children}</div>
      </div>
    </div>
  );
};

// --- 子組件：導覽列 ---
const Navbar = ({ activePage, setActivePage, isScrolled }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks = [
    { id: 'home', label: '首頁 Home' },
    { id: 'plans', label: '車型與方案 Plans' },
    { id: 'booking', label: '預約 Booking' },
    { id: 'guide', label: '攻略 Guide' },
    { id: 'about', label: '關於 About' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || activePage !== 'home' ? 'bg-white/95 backdrop-blur-md shadow-sm py-4 text-stone-800' : 'bg-transparent py-6 text-white'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActivePage('home')}>
          <div className="text-2xl font-serif font-bold tracking-wider">CampingTour <span className="text-orange-600">.</span></div>
        </div>
        <div className="hidden md:flex space-x-8 font-medium text-sm tracking-wide">
          {navLinks.map((link) => (
            <button key={link.id} onClick={() => setActivePage(link.id)} className={`transition-colors relative pb-1 ${activePage === link.id ? 'text-orange-600 font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-600' : 'hover:text-orange-500'}`}>{link.label}</button>
          ))}
        </div>
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X className="text-stone-800" /> : <Menu />}</button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-6 px-6 flex flex-col space-y-4 border-t border-stone-100">
          {navLinks.map((link) => (
            <button key={link.id} onClick={() => { setActivePage(link.id); setIsMobileMenuOpen(false); }} className={`text-left text-lg font-medium py-2 ${activePage === link.id ? 'text-orange-600' : 'text-stone-600'}`}>{link.label}</button>
          ))}
        </div>
      )}
    </nav>
  );
};

// --- 子組件：頁腳 (已更新旅行社資訊) ---
const Footer = ({ setActivePage }) => (
  <footer className="bg-stone-900 text-stone-400 py-16 text-sm">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-stone-800 pb-12">
      {/* 品牌區 */}
      <div className="col-span-1 md:col-span-2 space-y-4">
        <h3 className="text-white text-3xl font-serif font-bold">CampingTour .</h3>
        <p className="max-w-sm leading-relaxed">台灣最專業的露營車租賃服務。<br />隨心所欲，探索山海。</p>
        <div className="flex gap-4 pt-4">
          <a href={CONTACT_INFO.fbLink} className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all"><Facebook size={20} /></a>
          <a href={CONTACT_INFO.igLink} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all"><Instagram size={20} /></a>
        </div>
      </div>
      
      {/* 快速連結 */}
      <div>
        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
        <ul className="space-y-3">
          <li><button onClick={() => setActivePage('plans')} className="hover:text-white transition-colors">方案介紹 Plans</button></li>
          <li><button onClick={() => setActivePage('booking')} className="hover:text-white transition-colors">預約流程 Booking</button></li>
          <li><button onClick={() => setActivePage('guide')} className="hover:text-white transition-colors">旅遊攻略 Guide</button></li>
        </ul>
      </div>
      
      {/* 聯絡資訊 (楊哲) */}
      <div>
        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact</h4>
        <ul className="space-y-4">
          <li className="flex items-start gap-3"><Phone size={18} className="mt-1 text-orange-500" /> <div><span className="block text-white font-medium">{CONTACT_INFO.name}</span><span>{CONTACT_INFO.phone}</span></div></li>
          <li className="flex items-start gap-3"><Mail size={18} className="mt-1 text-orange-500" /> <span>{CONTACT_INFO.email}</span></li>
          <li className="flex items-start gap-3"><MapPin size={18} className="mt-1 text-orange-500" /> <span>{CONTACT_INFO.address}</span></li>
        </ul>
      </div>
    </div>

    {/* 公司登記資料 (新增) */}
    <div className="container mx-auto px-6 border-b border-stone-800 pb-8 mb-8">
      <h4 className="text-stone-500 font-bold mb-4 uppercase tracking-widest text-xs">Company Info</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-stone-500">
        <div>
          <span className="block text-stone-400 font-bold">{CONTACT_INFO.company.name}</span>
          <span>統編: {CONTACT_INFO.company.taxId}</span><br/>
          <span>代表人: {CONTACT_INFO.company.rep}</span>
        </div>
        <div>
          <span className="block text-stone-400 font-bold">Address</span>
          <span>{CONTACT_INFO.company.address}</span>
        </div>
        <div>
          <span className="block text-stone-400 font-bold">Contact</span>
          <span>TEL: {CONTACT_INFO.company.phone}</span><br/>
          <span>FAX: {CONTACT_INFO.company.fax}</span>
        </div>
        <div>
          <span className="block text-stone-400 font-bold">Email</span>
          <span>{CONTACT_INFO.company.email}</span>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-6 text-center text-xs text-stone-600">
      <p>&copy; 2026 CampingTour Taiwan. All Rights Reserved.</p>
    </div>
  </footer>
);

// --- 頁面 1: 首頁 ---
const HomePage = ({ setActivePage }) => (
  <>
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0"><img src={IMAGES.hero} alt="Camping Hero" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-stone-900/30"></div></div>
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

// --- 頁面 2: 方案＆車輛介紹 (已更新完整價格表與配備) ---
const PlansPage = () => {
  const vehicle = {
    name: "Nomad A180 Camper",
    nameZh: "戶外探險號",
    desc: "為熱愛戶外與未知旅程而生。配備外推窗、舒適床鋪與完善電力系統，讓您在任何地方都能睡得安穩。",
    specs: [
      { icon: Users, label: "適合 2 人" },
      { icon: Car, label: "自排車款" },
      { icon: Fuel, label: "95 無鉛汽油" },
      { icon: Zap, label: "280Ah 鋰鐵電池" },
      { icon: Wind, label: "駐車冷氣" },
      { icon: Tent, label: "車邊帳" }
    ],
    // 完整 9 張圖
    gallery: [
      IMAGES.side, IMAGES.bed, IMAGES.awningFull, IMAGES.drive, 
      IMAGES.stand, IMAGES.window, IMAGES.chill, IMAGES.awningClose, IMAGES.mountain
    ]
  };

  // 完整配備清單
  const equipments = [
    { name: "睡袋 ×2、枕頭 ×2", en: "Sleeping bags & Pillows (Disposable covers)", icon: Tent },
    { name: "小瓦斯爐 + 露營鍋具", en: "Gas stove & Cooking set", icon: Utensils },
    { name: "110V 插座及延長線", en: "110V Outlet & Extension cord", icon: Zap },
    { name: "摺疊水桶 + 淋浴器", en: "Folding bucket & Shower", icon: Info },
    { name: "露營桌 ×1、椅子 ×2", en: "Camping table & Chairs", icon: Tent },
    { name: "露營餐具組 (4人份)", en: "Cutlery set (Bowls, Cups, Fork/Spoon)", icon: Utensils },
    { name: "營燈 ×2、串燈 ×1", en: "Lanterns & String lights", icon: Zap },
    { name: "烤盤", en: "BBQ grill pan", icon: Utensils }
  ];

  // 價格方案 (Pricing Plans)
  const pricingPlans = [
    {
      title: "3 日快閃行",
      subtitle: "3-Day Escape (Weekday)",
      price: "NT$ 9,000",
      tag: "平日限定",
      color: "bg-blue-50 border-blue-200 text-blue-900",
      desc: "適合短暫逃離城市的輕旅行"
    },
    {
      title: "3 日標準方案",
      subtitle: "3-Day Standard Plan",
      price: "NT$ 10,500",
      tag: "熱門",
      color: "bg-orange-50 border-orange-200 text-orange-900",
      desc: "含假日，最受歡迎的選擇"
    },
    {
      title: "5 日無差價方案",
      subtitle: "5-Day Flat-Rate Plan",
      price: "NT$ 16,800",
      tag: "週末適用",
      color: "bg-green-50 border-green-200 text-green-900",
      desc: "跨週末不加價，划算之選"
    },
    {
      title: "7 日冒險週",
      subtitle: "7-Day Adventure",
      price: "NT$ 21,700",
      tag: "深度旅遊",
      color: "bg-stone-100 border-stone-200 text-stone-900",
      desc: "完整一週的環島體驗"
    },
    {
      title: "14 日深度漫遊",
      subtitle: "14-Day Slow Travel",
      price: "NT$ 41,300",
      tag: "長租優惠",
      color: "bg-white border-stone-200 text-stone-600",
      desc: "半個月的慢活時光"
    },
    {
      title: "21 日生活提案",
      subtitle: "21-Day Living",
      price: "NT$ 57,200",
      tag: "長租優惠",
      color: "bg-white border-stone-200 text-stone-600",
      desc: "體驗真正的車泊生活"
    },
    {
      title: "30 日遊牧人生",
      subtitle: "30-Day Nomadic Life",
      price: "NT$ 76,500",
      tag: "月租超值",
      color: "bg-stone-800 border-stone-800 text-white",
      desc: "一個月的遊牧人生"
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        
        {/* 車型展示區 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">{vehicle.name}</h2>
          <p className="text-xl text-orange-600 font-medium tracking-wide">{vehicle.nameZh}</p>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-4 lg:p-6"><ImageGallery images={vehicle.gallery} alt={vehicle.name} /></div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-6 text-stone-800">關於這台車</h3>
              <p className="text-stone-600 leading-relaxed mb-8 text-lg">{vehicle.desc}</p>
              
              <h4 className="font-bold text-stone-900 mb-4 flex items-center gap-2"><CheckCircle size={18} className="text-orange-500"/> 車輛規格 Spec</h4>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {vehicle.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-3 text-stone-700 bg-stone-50 p-3 rounded-lg">
                    <spec.icon size={20} className="text-stone-400" /><span className="font-medium">{spec.label}</span>
                  </div>
                ))}
              </div>

              {/* 基本價格顯示 */}
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-stone-600">平日 (Weekday)</span>
                  <span className="font-bold text-xl text-stone-800">NT$ 3,700<span className="text-sm font-normal">/日</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">假日 (Weekend)</span>
                  <span className="font-bold text-xl text-stone-800">NT$ 4,700<span className="text-sm font-normal">/日</span></span>
                </div>
                <div className="mt-4 pt-4 border-t border-orange-200 text-center">
                  <span className="inline-block bg-orange-600 text-white text-xs px-2 py-1 rounded">學生優惠 Student Discount</span>
                  <span className="ml-2 text-sm text-orange-800 font-bold">憑證 9 折 (10% OFF)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 配備清單區 (Equipment) */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-serif font-bold text-stone-900">隨車配備 Included Equipment</h3>
            <p className="text-stone-500 mt-2">免裝備露營，我們都幫您準備好了</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipments.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-600">
                  <item.icon size={24} />
                </div>
                <h4 className="font-bold text-stone-800 mb-1">{item.name}</h4>
                <p className="text-xs text-stone-500">{item.en}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6 text-sm text-stone-500 bg-green-50 py-3 rounded-lg border border-green-100 inline-block w-full">
            ♻️ 為響應環保，不提供一次性餐具。 Disposable items not provided (eco-friendly).
          </div>
        </div>

        {/* 價格方案區 (Pricing Plans) */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-serif font-bold text-stone-900">Special Plans</h3>
          <p className="text-stone-500 mt-2">多天數優惠方案，玩越久越划算</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan, idx) => (
            <div key={idx} className={`relative rounded-2xl p-6 border transition-transform hover:-translate-y-1 ${plan.color} ${idx === pricingPlans.length - 1 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70 border border-current px-2 py-0.5 rounded">{plan.tag}</span>
              </div>
              <h4 className="text-xl font-bold mb-1">{plan.title}</h4>
              <p className="text-xs opacity-70 mb-4 uppercase">{plan.subtitle}</p>
              <div className="text-3xl font-bold mb-2">{plan.price}</div>
              <p className="text-sm opacity-80 border-t border-current/20 pt-3">{plan.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// --- 頁面 3: 預約流程 ---
const BookingPage = () => {
  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Booking Process</h2>
          <p className="text-stone-600">透過 Line@ 輕鬆預約，專人為您服務</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          <div className="lg:sticky lg:top-28 space-y-8">
            <div className="bg-white p-10 rounded-3xl shadow-xl border-t-4 border-green-500 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><MessageCircle size={40} className="text-green-600" /></div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">加入 Line 官方帳號</h3>
              <p className="text-stone-500 mb-8">掃描 QR Code 或搜尋 ID，直接與我們聯繫預約</p>
              <div className="bg-stone-100 p-4 rounded-xl inline-block mb-6 group cursor-pointer relative">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://line.me/ti/p/~@campingtour" alt="Line QR Code" className="w-48 h-48 mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity"/>
                <div className="mt-2 font-mono text-stone-500 text-sm">ID: @campingtour</div>
              </div>
              <button className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"><MessageCircle size={20} /> 打開 Line 預約</button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-6">重要政策與須知</h3>
            <PolicyItem title="取消與退款政策 Cancellation Policy" icon={Calendar}>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-bold text-stone-800">出發前 14 天</span>：退還 100% 訂金。</li>
                <li><span className="font-bold text-stone-800">出發前 7-13 天</span>：退還 70% 訂金。</li>
                <li><span className="font-bold text-stone-800">出發前 1-3 天</span>：退還 50% 訂金。</li>
                <li><span className="font-bold text-stone-800">出發當日</span>：退還 20% 訂金。</li>
                <li className="text-sm text-stone-500 pt-2">* 每筆退款將扣除 NT$30 手續費。</li>
              </ul>
            </PolicyItem>
            <PolicyItem title="保險與外籍旅客須知 Insurance" icon={CheckCircle}>
              <p className="mb-3">露營車已包含強制第三責任險。但為了您的保障，我們有以下規範：</p>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-bold text-stone-800">外籍旅客 (Foreigners)</span>：<br/>必須自行購買 <span className="text-orange-600 font-bold">Car Hire Excess Insurance</span> 或提供具備同等效力之保險證明。</li>
                <li>若無法提供保險證明，可能需支付風險保證金。</li>
              </ul>
            </PolicyItem>
            <PolicyItem title="取還車與押金規範 Pick-up & Return" icon={MapPin}>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-bold">取車/還車地點</span>：台北市北投區大度路一段157-2號。</li>
                <li><span className="font-bold">保證金 (Security Deposit)</span>：取車時需支付 <span className="font-bold text-orange-600">NT$5,000</span> 現金，還車檢查無誤後退還。</li>
              </ul>
            </PolicyItem>
            <PolicyItem title="車輛使用與設備須知 Usage Guidelines" icon={Zap}>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-bold">每日里程限制</span>：300 公里 (超過每公里加收費用)。</li>
                <li><span className="font-bold">車高限制</span>：含車邊帳高度約 <span className="font-bold text-orange-600">210 cm</span>，請留意限高。</li>
              </ul>
            </PolicyItem>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 頁面 4: 攻略 & 5: 關於 (保持不變) ---
const GuidePage = () => (<div className="pt-24 pb-20 bg-stone-50 min-h-screen"><div className="container mx-auto px-6 text-center"><h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Travel Guide</h2><p className="text-stone-600">更多路線攻略即將上線...</p></div></div>);
const AboutPage = () => (<div className="pt-24 pb-20 bg-white min-h-screen"><div className="container mx-auto px-6"><div className="flex flex-col md:flex-row gap-16 items-center"><div className="w-full md:w-1/2"><img src={IMAGES.chill} alt="Team" className="rounded-3xl shadow-xl w-full"/></div><div className="w-full md:w-1/2 space-y-6"><h2 className="text-4xl font-serif font-bold text-stone-900">不追求完美，<br/>只追求真實的感動。</h2><p className="text-stone-600 leading-relaxed text-lg">露途臺灣 (CampingTour) 提供露營車出租服務，讓你用自己的節奏探索台灣。</p></div></div></div></div>);

// --- App ---
const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => { const handleScroll = () => { setIsScrolled(window.scrollY > 50); }; window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);
  const renderContent = () => { switch(activePage) { case 'home': return <HomePage setActivePage={setActivePage} />; case 'plans': return <PlansPage />; case 'booking': return <BookingPage />; case 'guide': return <GuidePage />; case 'about': return <AboutPage />; default: return <HomePage setActivePage={setActivePage} />; } };
  return (<div className="font-sans text-stone-800 bg-stone-50 selection:bg-orange-200 min-h-screen flex flex-col"><Navbar activePage={activePage} setActivePage={setActivePage} isScrolled={isScrolled} /><main className="flex-grow"><div key={activePage} className="animate-fade-in">{renderContent()}</div></main><Footer setActivePage={setActivePage} /></div>);
};

export default App;