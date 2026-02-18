import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Instagram, Facebook, MapPin, Phone, Mail 
} from 'lucide-react';

// 引入路由核心
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// 引入所有頁面 (請確保這些檔案在 src/pages/ 資料夾中都存在)
import HomePage from './pages/HomePage';
import PlansPage from './pages/PlansPage';
import GuidePage from './pages/GuidePage';
import AboutPage from './pages/AboutPage';
import BookingPage from './pages/BookingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import SignaturePage from './pages/SignaturePage';
import DashboardPage from './pages/DashboardPage'; // ✅ 會員中心

/**
 * CampingTour 車泊輕旅 - App Root
 * 負責路由設定與全域佈局
 */

// 全域資料設定
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
  logoStack: "/images/logo-stack.jpg"
};

// --- 子組件：導覽列 (Navbar) ---
const Navbar = ({ isScrolled }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // 監聽路由與 LocalStorage 變化，即時更新使用者狀態
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();
    // 監聽 storage 事件 (雖在同一頁面不一定觸發，但保留作為保險)
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location]); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert('已登出 👋');
    navigate('/');
  };

  // 基本導覽連結
  const baseLinks = [
    { id: '/', label: '首頁 Home' },
    { id: '/plans', label: '車型與方案 Plans' },
    { id: '/booking', label: '預約 Booking' },
    { id: '/guide', label: '攻略 Guide' },
    { id: '/about', label: '關於 About' },
  ];

  // 如果有登入，選單多加一個 Dashboard (手機版選單用)
  const navLinks = user 
    ? [...baseLinks, { id: '/dashboard', label: '會員中心 Member' }]
    : baseLinks;

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const isHome = location.pathname === '/';
  const isLightMode = isScrolled || !isHome;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isLightMode ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 text-stone-800' : 'bg-transparent py-6 text-white'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavClick('/')}>
          <img src={IMAGES.logo} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/50 shadow-sm object-cover" onError={(e) => e.target.style.display='none'} />
          <div className="flex flex-col">
            <span className="text-lg font-serif font-bold tracking-wider leading-none">CampingTour</span>
            <span className={`text-[10px] tracking-widest uppercase opacity-80 ${isLightMode ? 'text-orange-600' : 'text-orange-300'}`}>Taiwan Vanlife</span>
          </div>
        </div>

        {/* Desktop Menu (電腦版選單) */}
        <div className="hidden md:flex items-center space-x-8 font-medium text-sm tracking-wide">
          {baseLinks.map((link) => (
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

          {/* 會員狀態區塊 */}
          {user ? (
            <div className={`flex items-center gap-4 ml-4 pl-4 border-l ${isLightMode ? 'border-stone-300' : 'border-white/30'}`}>
              {/* ✅ 會員中心按鈕 */}
              <button 
                onClick={() => handleNavClick('/dashboard')}
                className={`font-bold hover:underline cursor-pointer flex items-center gap-1 ${isLightMode ? 'text-orange-600' : 'text-orange-300'}`}
                title="進入會員中心"
              >
                Hi, {user.name}
              </button>
              
              <button 
                onClick={handleLogout} 
                className={`px-4 py-2 rounded-full border transition-all text-xs ${isLightMode ? 'border-stone-300 hover:bg-stone-100 text-stone-600' : 'border-white/50 hover:bg-white/20 text-white'}`}
              >
                登出
              </button>
            </div>
          ) : (
            // 未登入狀態
            <div className="flex gap-2 ml-4">
               <button 
                onClick={() => handleNavClick('/login')} 
                className={`px-4 py-2 rounded-full transition-all ${isLightMode ? 'text-stone-800 hover:text-orange-600' : 'text-white hover:text-orange-300'}`}
              >
                登入
              </button>
              <button 
                onClick={() => handleNavClick('/register')} 
                className="px-4 py-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 shadow-md transition-all"
              >
                註冊
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button (手機版漢堡按鈕) */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="text-stone-800" /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Content (手機版選單內容) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-6 px-6 flex flex-col space-y-4 border-t border-stone-100 text-stone-800 h-screen">
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
                         {/* 手機版登出 */}
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
    <footer className="bg-stone-900 text-stone-400 py-16 text-sm border-t border-stone-800">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-stone-800 pb-12">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-4">
            <img src={IMAGES.logoStack} alt="Logo" className="w-16 h-16 rounded-xl opacity-90 invert object-cover" onError={(e) => e.target.style.display='none'} />
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

// --- 主版面 Layout ---
const Layout = ({ children, isScrolled }) => {
  return (
    <div className="font-sans text-stone-800 bg-stone-50 selection:bg-orange-200 min-h-screen flex flex-col">
      <Navbar isScrolled={isScrolled} />
      <main className="flex-grow animate-fade-in">
        {children}
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
          <Route path="/signature/:id" element={<SignaturePage />} />
          
          {/* ✅ Dashboard 路由 */}
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;