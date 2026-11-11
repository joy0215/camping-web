import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Instagram, Facebook, MapPin, Phone, Mail, Globe, ChevronDown, Check 
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
import FeedbackPage from './pages/FeedbackPage';
import ReviewsPage from './pages/ReviewsPage';

const ADMIN_EMAILS = [
  'jchenghe06@gmail.com',
  'cheyang0326@gmail.com'
];

const CONTACT_INFO = {
  name: "何錦程 Jace He",
  phone: "0963-823-606",
  email: "jchenghe06@gmail.com",
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

const LANGUAGES = [
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'zh', short: '中文', label: '繁體中文' },
  { code: 'de', short: 'DE', label: 'Deutsch' },
  { code: 'he', short: 'עב', label: 'עברית' },
];

const LanguageMenu = ({ align = 'end' }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find((l) => (i18n.language || 'en').startsWith(l.code)) || LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        className="flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-stone-700 hover:text-stone-900"
      >
        <Globe size={16} strokeWidth={1.75} />
        <span>{current.short}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className={`absolute top-full mt-1 w-40 bg-white border border-stone-200 rounded-md shadow-lg py-1 z-50 ${align === 'end' ? 'end-0' : 'start-0'}`}
        >
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === current.code}
                onClick={() => { i18n.changeLanguage(l.code); setOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm text-start hover:bg-stone-50 ${l.code === current.code ? 'text-stone-900 font-semibold' : 'text-stone-600'}`}
              >
                <span lang={l.code}>{l.label}</span>
                {l.code === current.code && <Check size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Navbar = ({ isScrolled }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  const { t } = useTranslation();

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
    alert(t('nav.logout'));
    navigate('/');
  };

  const baseLinks = [
    { id: '/', label: t('nav.home') },
    { id: '/plans', label: t('nav.plans') },
    { id: '/booking', label: t('nav.booking') },
    { id: '/guide', label: t('nav.guide') },
    { id: '/about', label: t('nav.about') },
    { id: '/terms', label: t('nav.terms') }, 
  ];

  const navLinks = user 
    ? [...baseLinks, { id: '/dashboard', label: t('nav.member') }]
    : baseLinks;

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // 判定是否為管理員或符合主管 Email 白名單
  const isManager = user && (user.isAdmin || ADMIN_EMAILS.includes(user.email));

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 bg-stone-50 border-b transition-colors ${isScrolled || isMobileMenuOpen ? 'border-stone-200' : 'border-transparent'}`}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex justify-between items-center gap-6">
        
        {/* Brand */}
        <button type="button" className="flex items-center gap-2.5 shrink-0" onClick={() => handleNavClick('/')}>
          <img src={IMAGES.logo} alt="CampingTour Campervan Rental Taiwan Logo" className="w-9 h-9 rounded-full object-cover" onError={(e) => e.target.style.display='none'} />
          <span className="text-lg font-serif font-semibold text-stone-900 leading-none">CampingTour</span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 text-sm min-w-0">
          {navLinks.map((link) => (
            <button 
              key={link.id} 
              onClick={() => handleNavClick(link.id)} 
              aria-current={location.pathname === link.id ? 'page' : undefined}
              className={`whitespace-nowrap py-1 border-b transition-colors ${
                location.pathname === link.id 
                  ? 'text-stone-900 font-semibold border-orange-600' 
                  : 'text-stone-600 border-transparent hover:text-stone-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3 text-sm shrink-0">
          <LanguageMenu />

          {user ? (
            <>
              {/* 雙主管均可看見老闆後台按鈕 */}
              {isManager && (
                <button 
                  onClick={() => handleNavClick('/admin')}
                  className="px-3 py-1.5 rounded-md border border-stone-300 text-stone-800 font-medium hover:border-stone-900 whitespace-nowrap"
                >
                  {t('nav.admin')}
                </button>
              )}

              <button 
                onClick={() => handleNavClick('/dashboard')}
                className="font-medium text-stone-900 hover:underline underline-offset-4 max-w-[10rem] truncate"
                title="Member Center"
              >
                {user.name}
              </button>
              
              <button onClick={handleLogout} className="text-stone-500 hover:text-stone-900 whitespace-nowrap">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleNavClick('/login')} className="px-2 py-2 font-medium text-stone-700 hover:text-stone-900 whitespace-nowrap">
                {t('nav.login')}
              </button>
              <button onClick={() => handleNavClick('/register')} className="btn btn-primary !py-2 !px-4 !text-sm whitespace-nowrap">
                {t('nav.signup')}
              </button>
            </>
          )}
        </div>

        {/* Mobile: language + menu toggle */}
        <div className="lg:hidden flex items-center gap-1">
          <LanguageMenu />
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
            className="p-2 text-stone-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full inset-x-0 bg-stone-50 border-t border-stone-200 px-5 pb-10 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex flex-col divide-y divide-stone-200">
            {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => handleNavClick(link.id)} 
                className={`text-start text-lg font-serif py-4 ${
                  location.pathname === link.id ? 'text-orange-600' : 'text-stone-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
           
          <div className="mt-8 flex flex-col gap-3">
            {user ? (
              <>
                <p className="text-sm text-stone-500">{user.name}</p>
                {isManager && (
                  <button onClick={() => handleNavClick('/admin')} className="btn btn-ghost w-full">
                    {t('nav.admin')}
                  </button>
                )}
                <button onClick={handleLogout} className="btn btn-ghost w-full">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavClick('/register')} className="btn btn-primary w-full">
                  {t('nav.signup')}
                </button>
                <button onClick={() => handleNavClick('/login')} className="btn btn-ghost w-full">
                  {t('nav.login')}
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
  const { t, i18n } = useTranslation(); 
  
  const handleLink = (path) => { navigate(path); window.scrollTo(0, 0); };
  const isZh = i18n.language.startsWith('zh');

  return (
    <footer className="bg-stone-900 text-stone-300 text-sm">
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-5">
            <img 
              src={IMAGES.logoStack} 
              alt="CampingTour Taiwan Campervan Rental Official Logo" 
              className="w-24 h-24 object-contain invert mix-blend-screen -ms-2"
              onError={(e) => e.target.style.display='none'}
            />
            <p className="mt-4 max-w-sm leading-relaxed text-stone-400" dangerouslySetInnerHTML={{ __html: t('footer.desc') }} />
            <div className="flex gap-5 mt-6">
              <a href={CONTACT_INFO.fbLink} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-stone-400 hover:text-white transition-colors"><Facebook size={20} strokeWidth={1.75} /></a>
              <a href={CONTACT_INFO.igLink} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-stone-400 hover:text-white transition-colors"><Instagram size={20} strokeWidth={1.75} /></a>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => handleLink('/plans')} className="hover:text-white transition-colors">{t('footer.plans')}</button></li>
              <li><button onClick={() => handleLink('/booking')} className="hover:text-white transition-colors">{t('footer.booking')}</button></li>
              <li><button onClick={() => handleLink('/guide')} className="hover:text-white transition-colors">{t('footer.guide')}</button></li>
              <li><button onClick={() => handleLink('/terms')} className="hover:text-white transition-colors">{t('footer.terms')}</button></li>
              <li><button onClick={() => handleLink('/register')} className="hover:text-white transition-colors">{t('footer.signup')}</button></li>
            </ul>
          </div>
          
          <div className="lg:col-span-4">
            <h4 className="text-white font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3"><Phone size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-stone-500" /> <span>{isZh ? CONTACT_INFO.name : 'Jace He'} · <span dir="ltr">{CONTACT_INFO.phone}</span></span></li>
              <li className="flex items-start gap-3"><Mail size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-stone-500" /> <span className="break-all">{CONTACT_INFO.email}</span></li>
              <li className="flex items-start gap-3"><MapPin size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-stone-500" /> <span>{isZh ? CONTACT_INFO.address : CONTACT_INFO.addressEn}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800 text-xs text-stone-400">
          <h4 className="text-stone-300 font-semibold mb-4">{t('footer.companyInfo')}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 leading-relaxed">
            <div>
              <span className="block text-stone-200">{isZh ? CONTACT_INFO.company.name : CONTACT_INFO.company.nameEn}</span>
              {isZh && <span className="block">{CONTACT_INFO.company.nameEn}</span>}
              <span className="block mt-1">{CONTACT_INFO.company.license}</span>
            </div>
            <div>
              <span className="block text-stone-200">{t('footer.address')}</span>
              <span>{CONTACT_INFO.company.address}</span>
            </div>
            <div>
              <span className="block text-stone-200">{t('footer.details')}</span>
              <span>{t('footer.taxId')}: {CONTACT_INFO.company.taxId}</span><br/>
              <span>{t('footer.rep')}: {CONTACT_INFO.company.rep}</span>
            </div>
            <div>
              <span className="block text-stone-200">{t('footer.contact')}</span>
              <span>{t('footer.tel')}: <span dir="ltr">{CONTACT_INFO.company.phone}</span></span><br/>
              <span>{t('footer.fax')}: <span dir="ltr">{CONTACT_INFO.company.fax}</span></span>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-stone-500">{t('footer.rights')}</p>
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
    const handleScroll = () => { setIsScrolled(window.scrollY > 8); }; 
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
          <Route path="/feedback/:orderId" element={<FeedbackPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;