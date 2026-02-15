import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Instagram, Facebook, MapPin, ArrowRight, 
  ChevronDown, Phone, Mail, Download, ExternalLink, Car, 
  Calendar, CheckCircle, Info, Users, Fuel, Zap, ChevronLeft, ChevronRight, MessageCircle, Plus, Minus, Tent, Utensils, Map, Wind
} from 'lucide-react';

// 🆕 引入路由相關工具
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// 🆕 引入外部頁面元件
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import BookingPage from './pages/BookingPage';
import SignaturePage from './pages/SignaturePage'; // ✅ 新增：簽名頁面

/**
 * CampingTour 車泊輕旅 - 2026 Final Version
 * 完整版：包含所有靜態頁面、Navbar 邏輯、以及預約/簽名路由
 */

// --- 全域資料設定 ---
const CONTACT_INFO = {
  name: "楊哲 Che Yang",
  phone: "0965-720-586",
  email: "cheyang0326@gmail.com",
  fb: "車泊輕旅",
  ig: "freeyoung_campervan",
  igLink: "https://www.instagram.com/freeyoung_campervan?igsh=MW43eXRvajExeXFoeg==",
  fbLink: "https://www.facebook.com/share/1FNT8UW5xz/?mibextid=wwXIfr",
  address: "台北市北投區大度路一段157-2號",
  addressEn: "No. 157-2, Sec. 1, Dadu Rd., Beitou Dist., Taipei City",
  company: {
    name: "悠遊旅行社股份有限公司",
    nameEn: "Yoyo Travel Service Co., Ltd.",
    address: "桃園市蘆竹區光明路二段251號",
    phone: "03-352-8186",
    fax: "03-312-4904",
    email: "f774955@hotmail.com",
    rep: "林繼城",
    taxId: "84293135",
    license: "交觀甲字 5307 號 (License No. 5307)"
  }
};

const IMAGES = {
  logo: "/images/logo-circle.jpg",
  logoStack: "/images/logo-stack.jpg",
  qrLine: "/images/qr-line.jpg",
  qrWhatsapp: "/images/qr-whatsapp.jpg",
  hero: "/images/vibe-drive.jpg",
  drive: "/images/vibe-drive.jpg",
  stand: "/images/vibe-stand.jpg",
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

// --- 子組件：導覽列 (Navbar) ---
const Navbar = ({ isScrolled }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 檢查登入狀態
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]); // 當路由改變時重新檢查

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert('已登出');
    navigate('/');
  };

  const navLinks = [
    { id: '/', label: '首頁 Home' },
    { id: '/plans', label: '車型與方案 Plans' },
    { id: '/booking', label: '預約 Booking' },
    { id: '/guide', label: '攻略 Guide' },
    { id: '/about', label: '關於 About' },
  ];

  const isHome = location.pathname === '/';

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const isLightMode = isScrolled || !isHome;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isLightMode ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 text-stone-800' : 'bg-transparent py-6 text-white'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavClick('/')}>
          <img src={IMAGES.logo} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/50 shadow-sm" />
          <div className="flex flex-col">
            <span className="text-lg font-serif font-bold tracking-wider leading-none">CampingTour</span>
            <span className={`text-[10px] tracking-widest uppercase opacity-80 ${isLightMode ? 'text-orange-600' : 'text-orange-300'}`}>Taiwan Vanlife</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 font-medium text-sm tracking-wide">
          {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => handleNavClick(link.id)} 
                className={`transition-colors relative pb-1 ${
                  location.pathname === link.id 
                    ? 'text-orange-600 font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-600' 
                    : 'hover:text-orange-500'
                }`}
              >
                {link.label}
              </button>
          ))}

          {/* Auth Buttons */}
          {user ? (
            <div className={`flex items-center gap-4 ml-4 pl-4 border-l ${isLightMode ? 'border-stone-300' : 'border-white/30'}`}>
              <span className={`font-bold ${isLightMode ? 'text-orange-600' : 'text-orange-300'}`}>Hi, {user.name}</span>
              <button 
                onClick={handleLogout} 
                className={`px-4 py-2 rounded-full border transition-all text-xs ${isLightMode ? 'border-stone-300 hover:bg-stone-100 text-stone-600' : 'border-white/50 hover:bg-white/20 text-white'}`}
              >
                登出 Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2 ml-4">
               <button 
                onClick={() => handleNavClick('/login')} 
                className={`px-4 py-2 rounded-full transition-all ${isLightMode ? 'text-stone-800 hover:text-orange-600' : 'text-white hover:text-orange-300'}`}
              >
                登入 Login
              </button>
              <button 
                onClick={() => handleNavClick('/register')} 
                className="px-4 py-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 shadow-md transition-all"
              >
                註冊 Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="text-stone-800" /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-6 px-6 flex flex-col space-y-4 border-t border-stone-100 text-stone-800">
          {navLinks.map((link) => (
            <button 
              key={link.id} 
              onClick={() => handleNavClick(link.id)} 
              className={`text-left text-lg font-medium py-2 ${
                location.pathname === link.id ? 'text-orange-600' : 'text-stone-600'
              }`}
            >
              {link.label}
            </button>
          ))}
           
           <div className="border-t pt-4 mt-2">
                {user ? (
                    <>
                        <div className="text-orange-600 font-bold mb-2 text-lg">Hi, {user.name}</div>
                        <button onClick={handleLogout} className="text-stone-500 w-full text-left py-2 hover:text-stone-800">登出 Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => handleNavClick('/login')} className="block w-full text-left mb-4 py-2 font-medium hover:text-orange-600">登入 Login</button>
                        <button onClick={() => handleNavClick('/register')} className="block w-full text-left text-orange-600 font-bold py-2 hover:text-orange-700">註冊 Sign Up</button>
                    </>
                )}
             </div>
        </div>
      )}
    </nav>
  );
};

// --- 子組件：頁腳 (Footer) ---
const Footer = () => {
  const navigate = useNavigate();
  const handleLink = (path) => { navigate(path); window.scrollTo(0, 0); };

  return (
    <footer className="bg-stone-900 text-stone-400 py-16 text-sm">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-stone-800 pb-12">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-4">
            <img src={IMAGES.logoStack} alt="Logo" className="w-16 h-16 rounded-xl opacity-90 invert" />
            <div>
              <h3 className="text-white text-2xl font-serif font-bold">CampingTour</h3>
              <p className="text-xs uppercase tracking-widest text-orange-500">Free Young Campervan</p>
            </div>
          </div>
          <p className="max-w-sm leading-relaxed">台灣最專業的露營車租賃服務。<br />Explore Taiwan your way with our fully equipped campervans.</p>
          <div className="flex gap-4 pt-2">
            <a href={CONTACT_INFO.fbLink} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all"><Facebook size={20} /></a>
            <a href={CONTACT_INFO.igLink} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all"><Instagram size={20} /></a>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
          <ul className="space-y-3">
            <li><button onClick={() => handleLink('/plans')} className="hover:text-white transition-colors">方案介紹 Plans</button></li>
            <li><button onClick={() => handleLink('/booking')} className="hover:text-white transition-colors">預約流程 Booking</button></li>
            <li><button onClick={() => handleLink('/guide')} className="hover:text-white transition-colors">旅遊攻略 Guide</button></li>
            <li><button onClick={() => handleLink('/register')} className="hover:text-white transition-colors text-orange-500">會員註冊 Sign Up</button></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3"><Phone size={18} className="mt-1 text-orange-500" /> <div><span className="block text-white font-medium">{CONTACT_INFO.name}</span><span>{CONTACT_INFO.phone}</span></div></li>
            <li className="flex items-start gap-3"><Mail size={18} className="mt-1 text-orange-500" /> <span>{CONTACT_INFO.email}</span></li>
            <li className="flex items-start gap-3"><MapPin size={18} className="mt-1 text-orange-500" /> <span>{CONTACT_INFO.addressEn}</span></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 border-b border-stone-800 pb-8 mb-8">
        <h4 className="text-stone-500 font-bold mb-4 uppercase tracking-widest text-xs">Company Info</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-stone-500">
          <div>
            <span className="block text-stone-400 font-bold">{CONTACT_INFO.company.name}</span>
            <span className="block text-stone-500 mb-1">{CONTACT_INFO.company.nameEn}</span>
            <span className="block text-orange-600 font-bold">{CONTACT_INFO.company.license}</span>
          </div>
          <div>
            <span className="block text-stone-400 font-bold">Address</span>
            <span>{CONTACT_INFO.company.address}</span>
          </div>
          <div>
            <span className="block text-stone-400 font-bold">Details</span>
            <span>統編 (Tax ID): {CONTACT_INFO.company.taxId}</span><br/>
            <span>代表人: {CONTACT_INFO.company.rep}</span>
          </div>
          <div>
            <span className="block text-stone-400 font-bold">Contact</span>
            <span>TEL: {CONTACT_INFO.company.phone}</span><br/>
            <span>FAX: {CONTACT_INFO.company.fax}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 text-center text-xs text-stone-600">
        <p>&copy; 2026 CampingTour Taiwan. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

// --- 頁面 1: 首頁 ---
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0"><img src={IMAGES.hero} alt="Camping Hero" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-stone-900/30"></div></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto mt-10">
          <div className="mb-6 flex justify-center"><img src={IMAGES.logoStack} alt="Logo" className="w-24 h-24 rounded-2xl shadow-2xl invert opacity-90"/></div>
          <p className="text-orange-400 font-medium tracking-[0.3em] mb-4 uppercase">Explore Taiwan Your Way</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight drop-shadow-xl">車泊輕旅<br /><span className="text-3xl md:text-5xl font-light mt-2 block opacity-90">CampingTour Taiwan</span></h1>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/booking')} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg flex items-center justify-center gap-2">立即預約 Booking <ArrowRight size={18} /></button>
            <button onClick={() => navigate('/plans')} className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-full font-medium transition-all">車型介紹 Vehicles</button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/70"><ChevronDown size={32} /></div>
      </section>
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-6"><Car size={40} className="text-orange-600 mx-auto mb-6" /><h3 className="text-xl font-bold mb-2">輕鬆駕駛</h3><p className="text-sm font-bold text-orange-500 mb-4 uppercase tracking-wider">Easy to Drive</p><p className="text-stone-600">自用小客車駕照即可駕駛，車體輕巧靈活。<br/>Standard driver's license accepted.</p></div>
            <div className="p-6"><MapPin size={40} className="text-orange-600 mx-auto mb-6" /><h3 className="text-xl font-bold mb-2">隨停隨宿</h3><p className="text-sm font-bold text-orange-500 mb-4 uppercase tracking-wider">Sleep Anywhere</p><p className="text-stone-600">不用搭帳篷，打開車門就是大自然。<br/>No tent needed, nature is at your door.</p></div>
            <div className="p-6"><Zap size={40} className="text-orange-600 mx-auto mb-6" /><h3 className="text-xl font-bold mb-2">電力充足</h3><p className="text-sm font-bold text-orange-500 mb-4 uppercase tracking-wider">Full Power</p><p className="text-stone-600">配備駐車冷氣與大容量電池，舒適過夜。<br/>AC & large battery included.</p></div>
          </div>
        </div>
      </section>
    </>
  );
};

// --- 頁面 2: 方案＆車輛介紹 ---
const PlansPage = () => {
  const vehicle = {
    name: "Nomad A180 Camper",
    nameZh: "戶外探險號",
    desc: "為熱愛戶外與未知旅程而生。這不僅是一輛車，更是您在山林與海邊的移動城堡。配備外推窗、舒適床鋪與完善電力系統，讓您在任何地方都能睡得安穩。\nDesigned for the unknown. This is your mobile castle in the mountains and by the sea.",
    specs: [
      { icon: Car, label: "自動變速 Auto Transmission" },
      { icon: Tent, label: "車邊帳 Car Awning" },
      { icon: Users, label: "雙人床鋪 Double Bed (1-2 pax)" },
      { icon: Wind, label: "外推窗 Awning Window" },
      { icon: Wind, label: "駐車冷氣 AC System" },
      { icon: Zap, label: "300Ah 高容量電池 Battery" },
    ],
    gallery: [
      IMAGES.side, IMAGES.bed, IMAGES.awningFull, IMAGES.drive, 
      IMAGES.stand, IMAGES.window, IMAGES.chill, IMAGES.awningClose, IMAGES.mountain
    ]
  };

  const equipments = [
    { name: "睡袋 ×2、枕頭 ×2", en: "Sleeping bags & Pillows", icon: Tent },
    { name: "小瓦斯爐 + 露營鍋具", en: "Gas stove & Cooking set", icon: Utensils },
    { name: "110V 插座及延長線", en: "110V Outlet & Cord", icon: Zap },
    { name: "摺疊水桶 + 淋浴器", en: "Folding bucket & Shower", icon: Info },
    { name: "露營桌 ×1、椅子 ×2", en: "Camping table & Chairs", icon: Tent },
    { name: "露營餐具組 (4人份)", en: "Cutlery set (4 pax)", icon: Utensils },
    { name: "營燈 ×2、串燈 ×1", en: "Lanterns & Lights", icon: Zap },
    { name: "烤盤", en: "BBQ grill pan", icon: Utensils }
  ];

  const pricingPlans = [
    { title: "3 日快閃行", subtitle: "3-Day Escape (Weekday)", price: "NT$ 9,000", tag: "平日限定 Weekday", color: "bg-blue-50 border-blue-200 text-blue-900", desc: "Short trip escape" },
    { title: "3 日標準方案", subtitle: "3-Day Standard Plan", price: "NT$ 10,500", tag: "熱門 Popular", color: "bg-orange-50 border-orange-200 text-orange-900", desc: "Best for weekend" },
    { title: "5 日無差價方案", subtitle: "5-Day Flat-Rate Plan", price: "NT$ 16,800", tag: "週末適用 Any Day", color: "bg-green-50 border-green-200 text-green-900", desc: "Includes weekend" },
    { title: "7 日冒險週", subtitle: "7-Day Adventure", price: "NT$ 21,700", tag: "深度旅遊 Deep Travel", color: "bg-stone-100 border-stone-200 text-stone-900", desc: "Full week journey" },
    { title: "14 日深度漫遊", subtitle: "14-Day Slow Travel", price: "NT$ 41,300", tag: "長租優惠 Long Term", color: "bg-white border-stone-200 text-stone-600", desc: "Slow travel discount" },
    { title: "21 日生活提案", subtitle: "21-Day Living", price: "NT$ 57,200", tag: "長租優惠 Long Term", color: "bg-white border-stone-200 text-stone-600", desc: "Vanlife experience" },
    { title: "30 日遊牧人生", subtitle: "30-Day Nomadic Life", price: "NT$ 76,500", tag: "月租超值 Monthly", color: "bg-stone-800 border-stone-800 text-white", desc: "Full month rental" }
  ];

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12"><h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">{vehicle.name}</h2><p className="text-xl text-orange-600 font-medium tracking-wide">{vehicle.nameZh}</p></div>
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-4 lg:p-6"><ImageGallery images={vehicle.gallery} alt={vehicle.name} /></div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-6 text-stone-800">關於這台車 About</h3>
              <p className="text-stone-600 leading-relaxed mb-8 text-lg whitespace-pre-line">{vehicle.desc}</p>
              <h4 className="font-bold text-stone-900 mb-4 flex items-center gap-2"><CheckCircle size={18} className="text-orange-500"/> 車輛特色 Key Features</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {vehicle.specs.map((spec, i) => (<div key={i} className="flex items-center gap-3 text-stone-700 bg-stone-50 p-3 rounded-lg"><spec.icon size={20} className="text-stone-400 flex-shrink-0" /><span className="font-medium text-sm">{spec.label}</span></div>))}
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex justify-between items-center mb-2"><span className="text-stone-600">平日 (Weekday)</span><span className="font-bold text-xl text-stone-800">NT$ 3,700<span className="text-sm font-normal">/Day</span></span></div>
                <div className="flex justify-between items-center"><span className="text-stone-600">假日 (Weekend)</span><span className="font-bold text-xl text-stone-800">NT$ 4,700<span className="text-sm font-normal">/Day</span></span></div>
                <div className="mt-4 pt-4 border-t border-orange-200 text-center"><span className="inline-block bg-orange-600 text-white text-xs px-2 py-1 rounded">學生優惠 Student Discount</span><span className="ml-2 text-sm text-orange-800 font-bold">憑證 9 折 (10% OFF with ID)</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center mb-10"><h3 className="text-3xl font-serif font-bold text-stone-900">隨車配備 Included Equipment</h3><p className="text-stone-500 mt-2">免裝備露營，我們都幫您準備好了</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipments.map((item, idx) => (<div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"><div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-600"><item.icon size={24} /></div><h4 className="font-bold text-stone-800 mb-1">{item.name}</h4><p className="text-xs text-stone-500">{item.en}</p></div>))}
          </div>
          <div className="text-center mt-6 text-sm text-stone-500 bg-green-50 py-3 rounded-lg border border-green-100 inline-block w-full">♻️ 為響應環保，不提供一次性餐具。 Disposable items not provided (eco-friendly).</div>
        </div>

        <div className="text-center mb-12"><h3 className="text-3xl font-serif font-bold text-stone-900">Special Plans</h3><p className="text-stone-500 mt-2">多天數優惠方案，玩越久越划算</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan, idx) => (
            <div key={idx} className={`relative rounded-2xl p-6 border transition-transform hover:-translate-y-1 ${plan.color} ${idx === pricingPlans.length - 1 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
              <div className="flex justify-between items-start mb-4"><span className="text-xs font-bold uppercase tracking-wider opacity-70 border border-current px-2 py-0.5 rounded">{plan.tag}</span></div>
              <h4 className="text-xl font-bold mb-1">{plan.title}</h4><p className="text-xs opacity-70 mb-4 uppercase">{plan.subtitle}</p><div className="text-3xl font-bold mb-2">{plan.price}</div><p className="text-sm opacity-80 border-t border-current/20 pt-3">{plan.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 頁面 4: 旅遊攻略 ---
const GuidePage = () => {
  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Travel Guide</h2>
          <p className="text-stone-600">Resources for your road trip in Taiwan</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg flex flex-col items-center text-center p-10 border border-stone-100">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-emerald-200 shadow-xl">
              <Map className="text-white w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">車床天地 (BedInCar)</h3>
            <p className="text-stone-500 mb-8 max-w-xs">
              The ultimate map for vanlifers in Taiwan. Find parking spots, showers, and campsites easily.<br/>
              <span className="text-xs text-stone-400">台灣車泊露營必備 App，輕鬆搜尋泊點、澡點與露營區。</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <a href="https://apps.apple.com/app/id1668213216" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-stone-900 text-white px-6 py-3 rounded-xl hover:bg-stone-800 transition-colors w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <Download size={20} />
                <div className="text-left"><div className="text-[10px] uppercase tracking-wider">Download on the</div><div className="font-bold leading-none">App Store</div></div>
              </a>
              <a href="https://play.google.com/store/apps/details?id=cmsp.bedincar&hl=zh_TW" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-stone-900 text-white px-6 py-3 rounded-xl hover:bg-stone-800 transition-colors w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <Download size={20} />
                <div className="text-left"><div className="text-[10px] uppercase tracking-wider">Get it on</div><div className="font-bold leading-none">Google Play</div></div>
              </a>
            </div>
          </div>

          <div className="bg-stone-900 rounded-3xl overflow-hidden shadow-lg group relative h-full min-h-[400px]">
            <img src={IMAGES.mountain} alt="Taiwan Road Trip" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="relative z-10 p-10 h-full flex flex-col justify-end">
              <div className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">MUST READ</div>
              <h3 className="text-3xl font-serif font-bold text-white mb-4 leading-tight">The Perfect Taiwan Road Trip</h3>
              <p className="text-stone-300 mb-8 line-clamp-3">
                Sporty Travellers 推薦！深入探索台灣的最佳路線規劃。<br/>
                Discover the best routes and hidden spots in Taiwan.
              </p>
              <a href="https://www.sportytravellers.com/asia/the-perfect-taiwan-road-trip-in-15-days/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white font-bold border-b border-orange-500 pb-1 w-fit hover:text-orange-400 transition-colors">
                Read Article <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 頁面 5: 關於我們 ---
const AboutPage = () => (<div className="pt-24 pb-20 bg-white min-h-screen"><div className="container mx-auto px-6"><div className="flex flex-col md:flex-row gap-16 items-center"><div className="w-full md:w-1/2"><img src={IMAGES.chill} alt="Team" className="rounded-3xl shadow-xl w-full"/></div><div className="w-full md:w-1/2 space-y-6"><h2 className="text-4xl font-serif font-bold text-stone-900">不追求完美，<br/>只追求真實的感動。</h2><p className="text-stone-600 leading-relaxed text-lg">CampingTour Taiwan provides campervan rental services, allowing you to explore the island at your own pace.<br/><br/>露途臺灣提供露營車出租服務，讓你用自己的節奏探索台灣。我們相信，旅程的美好來自當下的感受。</p></div></div></div></div>);

// --- 主程式：Main Layout ---
const Layout = ({ children, isScrolled }) => {
  return (
    <div className="font-sans text-stone-800 bg-stone-50 selection:bg-orange-200 min-h-screen flex flex-col">
      <Navbar isScrolled={isScrolled} />
      <main className="flex-grow">
        <div className="animate-fade-in">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

// --- App Root Component ---
const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => { 
    const handleScroll = () => { setIsScrolled(window.scrollY > 50); }; 
    window.addEventListener('scroll', handleScroll); 
    return () => window.removeEventListener('scroll', handleScroll); 
  }, []);

  return (
    <Router>
      <Layout isScrolled={isScrolled}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signature/:id" element={<SignaturePage />} /> {/* ✅ 簽名頁路由 */}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;