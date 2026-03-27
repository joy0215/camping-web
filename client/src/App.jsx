import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Instagram, Facebook, MapPin, Phone, Mail 
} from 'lucide-react';

import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import translation hook

import HomePage from './pages/HomePage';
import PlansPage from './pages/PlansPage';
import GuidePage from './pages/GuidePage';
import AboutPage from './pages/AboutPage';
import BookingPage from './pages/BookingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; 
import AdminDashboard from './pages/AdminDashboard'; 
import CheckoutPage from './pages/CheckoutPage';
import TermsPage from './pages/TermsPage';

const CONTACT_INFO = {
  name: "何錦程 Jace He",
  phone: "0968-823-606",
  email: "jchenghe@gmail.com",
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

const Navbar = ({ isScrolled }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Initialize translation and language state
  const { t, i18n } = useTranslation();

  // Function to toggle between English and Traditional Chinese
  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

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
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location]); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Use translation for logout alert
    alert(t('nav.logout') + ' 👋');
    navigate('/');
  };

  // Base navigation links using i18n keys
  const baseLinks = [
    { id: '/', label: t('nav.home') },
    { id: '/plans', label: t('nav.plans') },
    { id: '/booking', label: t('nav.booking') },
    { id: '/guide', label: t('nav.guide') },
    { id: '/about', label: t('nav.about') },
    { id: '/terms', label: t('nav.terms') }, 
  ];

  // Add Member Center to links if user is logged in
  const navLinks = user 
    ? [...baseLinks, { id: '/dashboard', label: t('nav.member') }]
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
        
        {/* Brand Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavClick('/')}>
          <img src={IMAGES.logo} alt="CampingTour Campervan Rental Taiwan Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/50 shadow-sm object-cover" onError={(e) => e.target.style.display='none'} />
          <div className="flex flex-col">
            <span className="text-lg font-serif font-bold tracking-wider leading-none">CampingTour</span>
            <span className={`text-[10px] tracking-widest uppercase opacity-80 ${isLightMode ? 'text-orange-600' : 'text-orange-300'}`}>Taiwan Vanlife</span>
          </div>
        </div>

        {/* Desktop Navigation */}
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

          {user ? (
            <div className={`flex items-center gap-4 ml-4 pl-4 border-l ${isLightMode ? 'border-stone-300' : 'border-white/30'}`}>
              
              {/* Language Toggle Button (Desktop, Logged In) */}
              <button onClick={toggleLanguage} className="font-bold text-lg hover:scale-110 transition-transform" title="Change Language">
                {i18n.language.startsWith('zh') ? '🇺🇸 EN' : '🇹🇼 中'}
              </button>

              {user.email === 'cheyang0326@gmail.com' && (
                <button 
                  onClick={() => handleNavClick('/admin')}
                  className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
                >
                  👑 {t('nav.admin')}
                </button>
              )}

              <button 
                onClick={() => handleNavClick('/dashboard')}
                className={`font-bold hover:underline cursor-pointer flex items-center gap-1 ${isLightMode ? 'text-orange-600' : 'text-orange-300'}`}
                title="Member Center"
              >
                Hi, {user.name}
              </button>
              
              <button 
                onClick={handleLogout} 
                className={`px-4 py-2 rounded-full border transition-all text-xs ${isLightMode ? 'border-stone-300 hover:bg-stone-100 text-stone-600' : 'border-white/50 hover:bg-white/20 text-white'}`}
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-4">
              {/* Language Toggle Button (Desktop, Logged Out) */}
              <button onClick={toggleLanguage} className="font-bold text-lg mr-2 hover:scale-110 transition-transform" title="Change Language">
                {i18n.language.startsWith('zh') ? '🇺🇸 EN' : '🇹🇼 中'}
              </button>

              <button 
                onClick={() => handleNavClick('/login')} 
                className={`px-4 py-2 rounded-full transition-all ${isLightMode ? 'text-stone-800 hover:text-orange-600' : 'text-white hover:text-orange-300'}`}
              >
                {t('nav.login')}
              </button>
              <button 
                onClick={() => handleNavClick('/register')} 
                className="px-4 py-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 shadow-md transition-all"
              >
                {t('nav.signup')}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle & Language Button */}
        <div className="md:hidden flex items-center gap-4">
          {/* Language Toggle Button (Mobile) */}
          <button onClick={toggleLanguage} className="font-bold text-xl hover:scale-110 transition-transform">
              {i18n.language.startsWith('zh') ? '🇺🇸' : '🇹🇼'}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="text-stone-800" /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
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
                        <div className="text-orange-600 font-bold mb-2 text-lg">Hi, {user.name}</div>
                        
                        {user.email === 'cheyang0326@gmail.com' && (
                          <button onClick={() => handleNavClick('/admin')} className="block w-full text-left py-2 font-bold text-red-600 hover:text-red-700">
                            👑 {t('nav.admin')}
                          </button>
                        )}

                        <button onClick={handleLogout} className="text-stone-500 w-full text-left py-2 hover:text-stone-800">
                          {t('nav.logout')}
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => handleNavClick('/login')} className="block w-full text-left mb-4 py-2 font-medium hover:text-orange-600">
                          {t('nav.login')}
                        </button>
                        <button onClick={() => handleNavClick('/register')} className="block w-full text-left text-orange-600 font-bold py-2 hover:text-orange-700">
                          {t('nav.signup')}
                        </button>
                    </>
                )}
             </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  // 🌟 Initialize translation hook
  const { t, i18n } = useTranslation(); 
  
  const handleLink = (path) => { navigate(path); window.scrollTo(0, 0); };

  // 🌟 Check if current language is Chinese for dynamic info
  const isZh = i18n.language.startsWith('zh');

  return (
    <footer className="bg-stone-900 text-stone-400 py-16 text-sm border-t border-stone-800">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-stone-800 pb-12">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-4">
              <img 
                src={IMAGES.logoStack} 
                alt="CampingTour Taiwan Campervan Rental Official Logo" 
                className="w-28 h-28 rounded-3xl shadow-2xl invert opacity-90 border border-white/20 backdrop-blur-sm"
                onError={(e) => e.target.style.display='none'}
              />
              <div>
              <h3 className="text-white text-2xl font-serif font-bold">CampingTour</h3>
              <p className="text-xs uppercase tracking-widest text-orange-500">Free Young Campervan</p>
            </div>
          </div>
          {/* 🌟 Translate Description */}
          <p className="max-w-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t('footer.desc') }} />
          <div className="flex gap-4 pt-2">
            <a href={CONTACT_INFO.fbLink} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all"><Facebook size={20} /></a>
            <a href={CONTACT_INFO.igLink} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all"><Instagram size={20} /></a>
          </div>
        </div>
        
        <div>
          {/* 🌟 Translate Quick Links */}
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">{t('footer.quickLinks')}</h4>
          <ul className="space-y-3">
            <li><button onClick={() => handleLink('/plans')} className="hover:text-white transition-colors">{t('footer.plans')}</button></li>
            <li><button onClick={() => handleLink('/booking')} className="hover:text-white transition-colors">{t('footer.booking')}</button></li>
            <li><button onClick={() => handleLink('/guide')} className="hover:text-white transition-colors">{t('footer.guide')}</button></li>
            <li><button onClick={() => handleLink('/terms')} className="hover:text-white transition-colors">{t('footer.terms')}</button></li>
            <li><button onClick={() => handleLink('/register')} className="hover:text-white transition-colors text-orange-500">{t('footer.signup')}</button></li>
          </ul>
        </div>
        
        <div>
          {/* 🌟 Translate Contact */}
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">{t('footer.contact')}</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3"><Phone size={18} className="mt-1 text-orange-500" /> <div><span className="block text-white font-medium">{isZh ? CONTACT_INFO.name : 'Jace He'}</span><span>{CONTACT_INFO.phone}</span></div></li>
            <li className="flex items-start gap-3"><Mail size={18} className="mt-1 text-orange-500" /> <span>{CONTACT_INFO.email}</span></li>
            <li className="flex items-start gap-3"><MapPin size={18} className="mt-1 text-orange-500" /> <span>{isZh ? CONTACT_INFO.address : CONTACT_INFO.addressEn}</span></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 border-b border-stone-800 pb-8 mb-8">
        {/* 🌟 Translate Company Info */}
        <h4 className="text-stone-500 font-bold mb-4 uppercase tracking-widest text-xs">{t('footer.companyInfo')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-stone-500">
          <div>
            <span className="block text-stone-400 font-bold">{isZh ? CONTACT_INFO.company.name : CONTACT_INFO.company.nameEn}</span>
            <span className="block text-stone-500 mb-1">{isZh ? CONTACT_INFO.company.nameEn : ''}</span>
            <span className="block text-orange-600 font-bold">{CONTACT_INFO.company.license}</span>
          </div>
          <div>
            <span className="block text-stone-400 font-bold">{t('footer.address')}</span>
            <span>{CONTACT_INFO.company.address}</span>
          </div>
          <div>
            <span className="block text-stone-400 font-bold">{t('footer.details')}</span>
            <span>{t('footer.taxId')}: {CONTACT_INFO.company.taxId}</span><br/>
            <span>{t('footer.rep')}: {CONTACT_INFO.company.rep}</span>
          </div>
          <div>
            <span className="block text-stone-400 font-bold">{t('footer.contact')}</span>
            <span>{t('footer.tel')}: {CONTACT_INFO.company.phone}</span><br/>
            <span>{t('footer.fax')}: {CONTACT_INFO.company.fax}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 text-center text-xs text-stone-600">
        <p>{t('footer.rights')}</p>
      </div>
    </footer>
  );
};

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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/checkout/:id" element={<CheckoutPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;