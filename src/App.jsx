import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Instagram, Facebook, MapPin, Star, ArrowRight, 
  ChevronDown, Phone, Mail, Download, ExternalLink, Car, 
  Calendar, CheckCircle, Info, Users, Fuel
} from 'lucide-react';

/**
 * CampingTour 車泊輕旅 - 全站完整版 (5 Pages)
 * Author: Gemini (Senior Frontend Engineer)
 * Tech Stack: React + Tailwind CSS
 */

// --- 全域資料設定 (Personal Data) ---
const CONTACT_INFO = {
  name: "楊哲",
  phone: "0965-720-586",
  email: "cheyang0326@gmail.com",
  fb: "車泊輕旅",
  ig: "freeyooung_campervan",
  igLink: "https://www.instagram.com/freeyooung_campervan/",
  fbLink: "#"
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
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => setActivePage('home')}
        >
          <div className="text-2xl font-serif font-bold tracking-wider">
            CampingTour <span className="text-orange-600">.</span>
          </div>
          <span className={`text-sm tracking-widest hidden md:block opacity-80 group-hover:opacity-100 transition-opacity`}>
            車泊輕旅
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 font-medium text-sm tracking-wide">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActivePage(link.id)}
              className={`transition-colors relative pb-1 ${
                activePage === link.id 
                  ? 'text-orange-600 font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-600' 
                  : 'hover:text-orange-500'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="text-stone-800" /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-6 px-6 flex flex-col space-y-4 border-t border-stone-100">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActivePage(link.id);
                setIsMobileMenuOpen(false);
              }}
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
        <p className="max-w-sm leading-relaxed">
          台灣最專業的露營車租賃服務。<br />
          讓我們成為你探索台灣山海的移動城堡。<br />
          車泊輕旅，隨心所欲。
        </p>
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
          <li><button onClick={() => setActivePage('about')} className="hover:text-white transition-colors">關於我們 About</button></li>
        </ul>
      </div>
      
      <div>
        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Contact</h4>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <Phone size={18} className="mt-1 text-orange-500" /> 
            <div>
              <span className="block text-white font-medium">{CONTACT_INFO.name}</span>
              <span>{CONTACT_INFO.phone}</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Mail size={18} className="mt-1 text-orange-500" /> 
            <span>{CONTACT_INFO.email}</span>
          </li>
          <li className="flex items-start gap-3">
            <MapPin size={18} className="mt-1 text-orange-500" /> 
            <span>桃園高鐵站 1號出口停車場<br/>(取車地點)</span>
          </li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-stone-600">
      <p>&copy; 2026 CampingTour Taiwan. All Rights Reserved.</p>
      <div className="flex gap-6 mt-4 md:mt-0">
        <span className="hover:text-stone-300 cursor-pointer">隱私權政策</span>
        <span className="hover:text-stone-300 cursor-pointer">服務條款</span>
      </div>
    </div>
  </footer>
);

// --- 頁面 1: 首頁 (Home) ---
const HomePage = ({ setActivePage }) => (
  <>
    {/* Hero Section */}
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
          alt="Camping in Taiwan" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/40"></div>
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto mt-10">
        <p className="text-orange-400 font-medium tracking-[0.3em] mb-4 uppercase">Explore Taiwan Your Way</p>
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight drop-shadow-xl">
          車泊輕旅<br />
          <span className="text-3xl md:text-5xl font-light mt-2 block opacity-90">CampingTour Taiwan</span>
        </h1>
        <p className="text-lg md:text-xl text-stone-100 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
          遠離城市喧囂，擁抱山海秘境。<br/>
          最舒適的露營車租賃體驗，開啟你的公路冒險。
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={() => setActivePage('booking')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2"
          >
            立即預約 Booking <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => setActivePage('plans')}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-full font-medium transition-all"
          >
            車型介紹 Vehicles
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/70">
        <ChevronDown size={32} />
      </div>
    </section>

    {/* Feature Highlights */}
    <section className="py-24 bg-stone-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
              <Car size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-stone-800">輕鬆駕駛</h3>
            <p className="text-stone-600">一般自用小客車駕照即可駕駛，車體輕巧靈活，自在穿梭台灣鄉間小路。</p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-stone-800">隨停隨宿</h3>
            <p className="text-stone-600">不需要搭建帳篷，找個安全的地方停下，打開車門就是大自然。</p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-stone-800">完善裝備</h3>
            <p className="text-stone-600">車內配備冷氣、床鋪與基本露營用品，就算是露營新手也能輕鬆上手。</p>
          </div>
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
      price: "NT$ 2,800 / 日起",
      desc: "以經典 Mitsubishi Veryca 改裝，擁有復古外型與齊全設備，打造舒適的行動露營空間。",
      features: ["手排/自排可選", "適合 2 人", "木質內裝", "基本寢具"],
      image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      name: "A180 Adventure Camper",
      nameZh: "戶外探險露營車",
      price: "NT$ 3,200 / 日起",
      desc: "為熱愛戶外與未知旅程而生，靈活可靠的行動基地。無論是山林露營或海岸停泊都能自在應對。",
      features: ["自排車款", "適合 2-3 人", "冷氣空調", "大容量電池"],
      image: "https://www.camperoadtaiwan.com/blog/a180-adventure-camper-a180"
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Plans & Vehicles</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            我們提供不同風格的露營車款，滿足您的探險需求。
            <br/>所有車輛皆定期保養，確保您的旅途安全無虞。
          </p>
        </div>

        <div className="space-y-16">
          {vehicles.map((v, idx) => (
            <div key={v.id} className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 bg-white rounded-3xl overflow-hidden shadow-lg`}>
              <div className="w-full md:w-1/2 h-64 md:h-auto">
                <img src={v.image} alt={v.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"/>
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full w-fit mb-4">HOT MODEL</div>
                <h3 className="text-2xl md:text-3xl font-bold text-stone-900 mb-1">{v.name}</h3>
                <h4 className="text-xl text-stone-500 mb-6 font-serif">{v.nameZh}</h4>
                <p className="text-stone-600 mb-6 leading-relaxed border-l-4 border-orange-200 pl-4">
                  {v.desc}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {v.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-stone-700">
                      <CheckCircle size={16} className="text-orange-500"/>
                      <span className="text-sm font-medium">{f}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-stone-100">
                  <span className="text-2xl font-bold text-orange-600">{v.price}</span>
                  <button className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
                    查看詳情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 頁面 3: 預約流程 (Booking Process) ---
const BookingPage = () => {
  const steps = [
    { num: "01", title: "詳閱須知", desc: "預約前請務必閱讀相關說明，確認駕照與車型需求。" },
    { num: "02", title: "線上預約", desc: "填寫預訂表單，選擇日期。我們也接受 FB/IG 私訊諮詢。" },
    { num: "03", title: "支付訂金", desc: "確認檔期後，於3日內支付 30% 訂金以保留車輛。" },
    { num: "04", title: "取車出發", desc: "攜帶駕照證件，至桃園高鐵站取車，進行30分鐘操作教學後出發！" },
  ];

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Booking Process</h2>
          <p className="text-stone-600">簡單四步驟，開啟您的車泊輕旅</p>
        </div>

        {/* Timeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {steps.map((step) => (
            <div key={step.num} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 text-9xl font-serif font-bold text-stone-100 group-hover:text-orange-50 transition-colors select-none">
                {step.num}
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-stone-900 mb-4 border-b-2 border-orange-500 inline-block pb-1">{step.title}</h3>
                <p className="text-stone-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Important Info Card */}
        <div className="bg-orange-50 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-orange-100">
          <h3 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
            <Info className="text-orange-600" /> 
            預約與取車重要資訊
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-stone-700">
            <ul className="space-y-3 list-disc list-inside">
              <li>取車地點：<span className="font-bold text-stone-900">桃園高鐵站 1號出口停車場</span></li>
              <li>取車時間：09:00-10:00 AM / 17:30-19:00 PM</li>
              <li>請攜帶：身份證、駕照 (外籍旅客需國際駕照)</li>
            </ul>
            <ul className="space-y-3 list-disc list-inside">
              <li>每日限駛里程：300公里 (超程費 $8/km)</li>
              <li>車內全面禁菸，並請保持清潔</li>
              <li>外籍旅客必須購買 Car Hire Excess Insurance</li>
            </ul>
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
          
          {/* App Download Card */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg flex flex-col items-center text-center p-10 border border-stone-100">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-orange-200 shadow-xl">
              <Car className="text-white w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">CampingTour App</h3>
            <p className="text-stone-500 mb-8 max-w-xs">
              下載我們的專屬 App，內建全台車泊地圖、水廁資訊以及私房景點推薦。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button className="flex items-center justify-center gap-3 bg-stone-900 text-white px-6 py-3 rounded-xl hover:bg-stone-800 transition-colors w-full sm:w-auto">
                <Download size={20} />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider">Download on the</div>
                  <div className="font-bold leading-none">App Store</div>
                </div>
              </button>
              <button className="flex items-center justify-center gap-3 bg-stone-900 text-white px-6 py-3 rounded-xl hover:bg-stone-800 transition-colors w-full sm:w-auto">
                <Download size={20} />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider">Get it on</div>
                  <div className="font-bold leading-none">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* External Article Card */}
          <div className="bg-stone-900 rounded-3xl overflow-hidden shadow-lg group relative h-full min-h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Taiwan Road Trip" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            
            <div className="relative z-10 p-10 h-full flex flex-col justify-end">
              <div className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">MUST READ</div>
              <h3 className="text-3xl font-serif font-bold text-white mb-4 leading-tight">
                The Perfect Taiwan Road Trip in 15 Days
              </h3>
              <p className="text-stone-300 mb-8 line-clamp-3">
                Sporty Travellers 推薦！深入探索台灣的最佳路線規劃，從高山到海洋，體驗最道地的台灣之美。
              </p>
              <a 
                href="https://www.sportytravellers.com/asia/the-perfect-taiwan-road-trip-in-15-days/" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-white font-bold border-b border-orange-500 pb-1 w-fit hover:text-orange-400 transition-colors"
              >
                閱讀完整文章 <ExternalLink size={16} />
              </a>
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
              <img 
                src="https://images.unsplash.com/photo-1533240332313-0db49b459ad6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="About Team" 
                className="relative z-10 rounded-3xl shadow-xl w-full"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-4xl font-serif font-bold text-stone-900">
              不追求完美，<br/>
              只追求真實的感動。
            </h2>
            <p className="text-stone-600 leading-relaxed text-lg">
              露途臺灣 (CampingTour) 提供露營車出租服務，讓你用自己的節奏探索台灣。
              我們相信，旅程的美好來自當下的感受，而不是設備有多豪華。
            </p>
            <p className="text-stone-600 leading-relaxed text-lg">
              如果你喜歡自由、真實、隨性的旅程，能在山裡煮杯咖啡、在車裡聽著雨聲發呆，
              享受生活裡那些不完美卻很美的瞬間，那我們一定很合拍。
            </p>
            
            <div className="pt-8 border-t border-stone-100">
              <h3 className="font-bold text-stone-900 mb-4">Contact Us</h3>
              <ul className="space-y-3 text-stone-600">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Phone size={16} /></div>
                  <span className="font-medium text-lg">{CONTACT_INFO.phone} ({CONTACT_INFO.name})</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Mail size={16} /></div>
                  <span className="font-medium text-lg">{CONTACT_INFO.email}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Facebook size={16} /></div>
                  <span className="font-medium text-lg">{CONTACT_INFO.fb}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Instagram size={16} /></div>
                  <span className="font-medium text-lg">{CONTACT_INFO.ig}</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- 主程式進入點 (App Entry) ---
const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 頁面路由切換
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
      
      {/* Main Content Area */}
      <main className="flex-grow">
        {/* 簡單的頁面切換動畫效果 key */}
        <div key={activePage} className="animate-fade-in">
          {renderContent()}
        </div>
      </main>

      <Footer setActivePage={setActivePage} />
    </div>
  );
};

export default App;