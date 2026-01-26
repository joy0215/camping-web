import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Instagram, Facebook, MapPin, Star, ArrowRight, 
  ChevronDown, Phone, Mail, Download, ExternalLink, Car, 
  Calendar, CheckCircle, Info, Users, Fuel, Zap, ChevronLeft, ChevronRight, MessageCircle, Plus, Minus
} from 'lucide-react';

/**
 * CampingTour 車泊輕旅 - 2026 旗艦版
 * Update: Booking Process 增加詳細政策摺疊選單 (Accordion)
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

const IMG_BASE = "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_1/20047068/";

// --- 子組件：圖片輪播 (Image Gallery) ---
const ImageGallery = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-64 md:h-96 group overflow-hidden bg-stone-100">
      <img src={images[currentIndex]} alt={`${alt} ${currentIndex + 1}`} className="w-full h-full object-cover transition-opacity duration-500"/>
      <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-all"><ChevronLeft size={20} /></button>
      <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-all"><ChevronRight size={20} /></button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
};

// --- 子組件：政策摺疊項目 (Accordion Item) ---
const PolicyItem = ({ title, icon: Icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden mb-4 bg-white shadow-sm transition-all hover:shadow-md">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-3 font-bold text-stone-800 text-lg">
          {Icon && <Icon className="text-orange-600" size={24} />}
          {title}
        </div>
        {isOpen ? <Minus size={20} className="text-stone-400" /> : <Plus size={20} className="text-stone-400" />}
      </button>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 pt-0 text-stone-600 leading-relaxed border-t border-stone-100">
          {children}
        </div>
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
          <div className="text-2xl font-serif font-bold tracking-wider">CampingTour <span className="text-orange-600">.</span></div>
          <span className={`text-sm tracking-widest hidden md:block opacity-80 group-hover:opacity-100 transition-opacity`}>車泊輕旅</span>
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
        </ul>
      </div>
    </div>
    <div className="container mx-auto px-6 text-center text-sm text-stone-600">
      <p>&copy; 2026 CampingTour Taiwan. All Rights Reserved.</p>
    </div>
  </footer>
);

// --- 頁面內容組件 ---
const HomePage = ({ setActivePage }) => (
  <>
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0"><img src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" alt="Camping" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-stone-900/40"></div></div>
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

const PlansPage = () => {
  const vehicles = [
    {
      id: 1,
      name: "Veryca Revival Camper",
      nameZh: "經典復古露營車",
      prices: { weekday: "NT$ 3,000", weekend: "NT$ 4,000" },
      desc: "以經典 Mitsubishi Veryca 改裝，擁有復古外型與齊全設備。適合想體驗懷舊風格與簡單車泊樂趣的旅人。",
      specs: [{ icon: Users, label: "適合 1-2 人" }, { icon: Car, label: "自排 / 手排可選" }, { icon: Fuel, label: "95 無鉛汽油" }, { icon: Zap, label: "500Ah 電池" }],
      features: ["駐車冷氣 + 循環扇", "車邊帳", "雙人床鋪", "後尾廚櫃"],
      images: [`${IMG_BASE}931809_419866.jpeg`, `${IMG_BASE}123548_170185.jpeg`, `${IMG_BASE}15333_10888.jpeg`, `${IMG_BASE}957709_856997.jpeg`]
    },
    {
      id: 2,
      name: "A180 Adventure Camper",
      nameZh: "戶外探險露營車",
      prices: { weekday: "NT$ 3,700", weekend: "NT$ 4,700" },
      desc: "為熱愛戶外與未知旅程而生。配備外推窗與升級版電力系統，是您探索台灣秘境的可靠基地。",
      specs: [{ icon: Users, label: "適合 2-3 人" }, { icon: Car, label: "自排變速箱" }, { icon: Fuel, label: "95 無鉛汽油" }, { icon: Zap, label: "280Ah 鋰鐵電池" }],
      features: ["外推窗設計", "駐車冷氣", "高機動性", "110V 插座"],
      images: [`${IMG_BASE}42199_731384.jpeg`, `${IMG_BASE}645575_113678.jpeg`, `${IMG_BASE}940323_906701.jpeg`, `${IMG_BASE}661439_125428.jpeg`]
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16"><h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Our Fleet</h2><p className="text-stone-600 max-w-2xl mx-auto">精選改裝車款，定期保養，確保您的旅途舒適安全。</p></div>
        <div className="space-y-20">
          {vehicles.map((v, idx) => (
            <div key={v.id} className={`bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-100 flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
              <div className="w-full lg:w-1/2"><ImageGallery images={v.images} alt={v.name} /></div>
              <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col">
                <div className="flex justify-between items-start mb-4"><div><h3 className="text-2xl font-bold text-stone-900">{v.name}</h3><h4 className="text-lg text-orange-600 font-medium">{v.nameZh}</h4></div><div className="text-right"><div className="text-sm text-stone-500">平日</div><div className="font-bold text-stone-800">{v.prices.weekday}<span className="text-xs font-normal">/日</span></div><div className="text-sm text-stone-500 mt-1">假日</div><div className="font-bold text-stone-800">{v.prices.weekend}<span className="text-xs font-normal">/日</span></div></div></div>
                <p className="text-stone-600 mb-8 leading-relaxed">{v.desc}</p>
                <div className="grid grid-cols-2 gap-4 mb-8 bg-stone-50 p-4 rounded-xl">{v.specs.map((spec, i) => (<div key={i} className="flex items-center gap-2 text-stone-700"><spec.icon size={18} className="text-stone-400" /><span className="text-sm font-medium">{spec.label}</span></div>))}</div>
                <div className="flex flex-wrap gap-2 mt-auto">{v.features.map(f => (<span key={f} className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full">{f}</span>))}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 預約流程 (Booking Page) 優化版 ---
const BookingPage = () => {
  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Booking Process</h2>
          <p className="text-stone-600">透過 Line@ 輕鬆預約，專人為您服務</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          
          {/* 左側：Line 預約卡片 (Sticky) */}
          <div className="lg:sticky lg:top-28 space-y-8">
            <div className="bg-white p-10 rounded-3xl shadow-xl border-t-4 border-green-500 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">加入 Line 官方帳號</h3>
              <p className="text-stone-500 mb-8">掃描 QR Code 或搜尋 ID，直接與我們聯繫預約</p>
              
              <div className="bg-stone-100 p-4 rounded-xl inline-block mb-6 group cursor-pointer relative">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://line.me/ti/p/~@campingtour" alt="Line QR Code" className="w-48 h-48 mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity"/>
                <div className="mt-2 font-mono text-stone-500 text-sm">ID: @campingtour</div>
              </div>

              <button className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <MessageCircle size={20} /> 打開 Line 預約
              </button>
            </div>

             {/* 簡易流程指示 */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <h4 className="font-bold text-stone-800 mb-4">預約三步驟</h4>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm text-stone-600"><span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">1</span> 確認日期與車型</div>
                  <div className="flex items-center gap-3 text-sm text-stone-600"><span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">2</span> Line 聯繫並支付訂金</div>
                  <div className="flex items-center gap-3 text-sm text-stone-600"><span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">3</span> 桃園高鐵取車出發</div>
                </div>
             </div>
          </div>

          {/* 右側：詳細政策與須知 (Accordions) */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-6">重要政策與須知</h3>

            <PolicyItem title="取消與退款政策 Cancellation Policy" icon={Calendar}>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-bold text-stone-800">出發前 14 天</span>：退還 100% 訂金。</li>
                <li><span className="font-bold text-stone-800">出發前 7-13 天</span>：退還 70% 訂金。</li>
                <li><span className="font-bold text-stone-800">出發前 1-3 天</span>：退還 50% 訂金。</li>
                <li><span className="font-bold text-stone-800">出發當日</span>：退還 20% 訂金。</li>
                <li className="text-sm text-stone-500 pt-2">* 每筆退款將扣除 NT$30 手續費 (國外帳戶另計平台費)。</li>
              </ul>
            </PolicyItem>

            <PolicyItem title="保險與外籍旅客須知 Insurance" icon={CheckCircle}>
              <p className="mb-3">露營車已包含強制第三責任險。但為了您的保障，我們有以下規範：</p>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-bold text-stone-800">外籍旅客 (Foreigners)</span>：<br/>必須自行購買 <span className="text-orange-600 font-bold">Car Hire Excess Insurance (租車自負額保險)</span> 或提供具備同等效力之保險證明。</li>
                <li>若無法提供保險證明，可能需支付最高 <span className="font-bold">NT$80,000</span> 之風險保證金。</li>
                <li>車內設備損壞（如內裝、電池、冷氣）不在一般車險範圍內，需由租用人全額賠償。</li>
              </ul>
            </PolicyItem>

            <PolicyItem title="取還車與押金規範 Pick-up & Return" icon={MapPin}>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-bold">取車/還車地點</span>：桃園高鐵站 1 號出口停車場。</li>
                <li><span className="font-bold">服務時間</span>：09:00-10:00 或 17:30-19:00。<br/><span className="text-sm text-stone-500 pl-5">非上述時間恕不提供服務，遲到將收取延遲費。</span></li>
                <li><span className="font-bold">保證金 (Security Deposit)</span>：取車時需支付 <span className="font-bold text-orange-600">NT$5,000</span> 現金，用於扣抵 ETC、停車費或罰單。餘額將於 30-45 個工作天退還。</li>
              </ul>
            </PolicyItem>

            <PolicyItem title="車輛使用與設備須知 Usage Guidelines" icon={Zap}>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-bold">每日里程限制</span>：300 公里 (超過每公里加收 NT$8)。</li>
                <li><span className="font-bold">車高限制</span>：含車邊帳高度約 <span className="font-bold text-orange-600">210 cm</span>，進入停車場請務必注意。</li>
                <li><span className="font-bold">電力使用</span>：行駛充電效率較慢。若需長時間使用冷氣，強烈建議<span className="font-bold">每 2-3 天進入露營區</span>使用 110V 插座補電。</li>
                <li><span className="font-bold">身高限制</span>：車內空間有限，身高超過 190cm 者可能會感到侷促。</li>
              </ul>
            </PolicyItem>
          </div>

        </div>
      </div>
    </div>
  );
};

const GuidePage = () => {
  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16"><h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Travel Guide</h2><p className="text-stone-600">專為車泊旅人打造的路線與工具</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg flex flex-col items-center text-center p-10 border border-stone-100"><div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-orange-200 shadow-xl"><Car className="text-white w-10 h-10" /></div><h3 className="text-2xl font-bold text-stone-900 mb-2">CampingTour App</h3><p className="text-stone-500 mb-8 max-w-xs">下載我們的專屬 App，內建全台車泊地圖、水廁資訊以及私房景點推薦。</p><div className="flex flex-col sm:flex-row gap-4 w-full justify-center"><button className="flex items-center justify-center gap-3 bg-stone-900 text-white px-6 py-3 rounded-xl hover:bg-stone-800 transition-colors w-full sm:w-auto"><Download size={20} /><div className="text-left"><div className="text-[10px] uppercase tracking-wider">Download on the</div><div className="font-bold leading-none">App Store</div></div></button><button className="flex items-center justify-center gap-3 bg-stone-900 text-white px-6 py-3 rounded-xl hover:bg-stone-800 transition-colors w-full sm:w-auto"><Download size={20} /><div className="text-left"><div className="text-[10px] uppercase tracking-wider">Get it on</div><div className="font-bold leading-none">Google Play</div></div></button></div></div>
          <div className="bg-stone-900 rounded-3xl overflow-hidden shadow-lg group relative h-full min-h-[400px]"><img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Taiwan Road Trip" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"/><div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div><div className="relative z-10 p-10 h-full flex flex-col justify-end"><div className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">MUST READ</div><h3 className="text-3xl font-serif font-bold text-white mb-4 leading-tight">The Perfect Taiwan Road Trip in 15 Days</h3><p className="text-stone-300 mb-8 line-clamp-3">Sporty Travellers 推薦！深入探索台灣的最佳路線規劃。</p><a href="https://www.sportytravellers.com/asia/the-perfect-taiwan-road-trip-in-15-days/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white font-bold border-b border-orange-500 pb-1 w-fit hover:text-orange-400 transition-colors">閱讀完整文章 <ExternalLink size={16} /></a></div></div>
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2"><div className="relative"><div className="absolute top-4 -left-4 w-full h-full border-2 border-orange-200 rounded-3xl z-0"></div><img src="https://images.unsplash.com/photo-1533240332313-0db49b459ad6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="About Team" className="relative z-10 rounded-3xl shadow-xl w-full"/></div></div>
          <div className="w-full md:w-1/2 space-y-6"><h2 className="text-4xl font-serif font-bold text-stone-900">不追求完美，<br/>只追求真實的感動。</h2><p className="text-stone-600 leading-relaxed text-lg">露途臺灣 (CampingTour) 提供露營車出租服務，讓你用自己的節奏探索台灣。我們相信，旅程的美好來自當下的感受，而不是設備有多豪華。</p><div className="pt-8 border-t border-stone-100"><h3 className="font-bold text-stone-900 mb-4">Contact Us</h3><ul className="space-y-3 text-stone-600"><li className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Phone size={16} /></div><span className="font-medium text-lg">{CONTACT_INFO.phone} ({CONTACT_INFO.name})</span></li><li className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Mail size={16} /></div><span className="font-medium text-lg">{CONTACT_INFO.email}</span></li></ul></div></div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => { const handleScroll = () => { setIsScrolled(window.scrollY > 50); }; window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);
  const renderContent = () => { switch(activePage) { case 'home': return <HomePage setActivePage={setActivePage} />; case 'plans': return <PlansPage />; case 'booking': return <BookingPage />; case 'guide': return <GuidePage />; case 'about': return <AboutPage />; default: return <HomePage setActivePage={setActivePage} />; } };
  return (<div className="font-sans text-stone-800 bg-stone-50 selection:bg-orange-200 min-h-screen flex flex-col"><Navbar activePage={activePage} setActivePage={setActivePage} isScrolled={isScrolled} /><main className="flex-grow"><div key={activePage} className="animate-fade-in">{renderContent()}</div></main><Footer setActivePage={setActivePage} /></div>);
};

export default App;