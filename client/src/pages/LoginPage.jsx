import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import translation hook

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize translation
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosClient.post('/auth/login', formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      alert(`${t('dashboard.welcome')}, ${user.name}!`); // Translated welcome
      window.location.href = '/'; 
    } catch (error) {
      console.error('登入失敗:', error);
      alert('Login Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-16 grid md:grid-cols-2">
      
      <div className="relative hidden md:block">
        <img 
          src="/images/feature-awning-full.jpg" 
          alt="CampingTour campervan with fully extended side awning in Taiwan nature" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 to-transparent p-10 pt-32 text-white">
          <h2 className="font-serif text-3xl">{t('login.imgTitle')}</h2>
          <p className="mt-2 text-stone-200">{t('login.imgSub')}</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-14 md:px-12">
        <div className="w-full max-w-sm">
          <h1 className="font-serif font-medium text-4xl text-stone-900 tracking-tight">{t('login.title')}</h1>
          <p className="mt-2 text-stone-600">{t('login.subtitle')}</p>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-stone-400"><Mail size={18} strokeWidth={1.75} /></div>
                <input type="email" name="email" placeholder={t('login.emailPh')} aria-label={t('login.emailPh')} required onChange={handleChange} className="field !ps-11" />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-stone-400"><Lock size={18} strokeWidth={1.75} /></div>
                <input type="password" name="password" placeholder={t('login.passPh')} aria-label={t('login.passPh')} required onChange={handleChange} className="field !ps-11" />
              </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary w-full !py-3.5 !mt-6">
              {isLoading ? t('login.btnLoading') : <>{t('login.btn')} <ArrowRight size={18} className="rtl:rotate-180" /></>}
            </button>
          </form>

          <p className="mt-8 text-stone-600">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="text-stone-900 font-semibold underline underline-offset-4 decoration-orange-600">
              {t('login.registerLink')}
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
