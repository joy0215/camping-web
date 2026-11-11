import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import translation hook

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize translation
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosClient.post('/auth/register', formData);
      alert('Registration Successful! Please login.');
      navigate('/login'); 
    } catch (error) {
      console.error('Registration failed:', error);
      const msg = error.response?.data?.error || 'Registration failed';
      alert(`${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-16 grid md:grid-cols-2">
      
      <div className="relative hidden md:block">
        <img 
          src="/images/hero-roof.jpg" 
          alt="CampingTour campervan in Taiwan" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 to-transparent p-10 pt-32 text-white">
          <h2 className="font-serif text-3xl">{t('register.imgTitle')}</h2>
          <p className="mt-2 text-stone-200">{t('register.imgSub')}</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-14 md:px-12">
        <div className="w-full max-w-sm">
          <h1 className="font-serif font-medium text-4xl text-stone-900 tracking-tight">{t('register.title')}</h1>
          <p className="mt-2 text-stone-600">{t('register.subtitle')}</p>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-stone-400"><User size={18} strokeWidth={1.75} /></div>
                <input type="text" name="name" placeholder={t('register.namePh')} aria-label={t('register.namePh')} required onChange={handleChange} className="field !ps-11" />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-stone-400"><Mail size={18} strokeWidth={1.75} /></div>
                <input type="email" name="email" placeholder={t('register.emailPh')} aria-label={t('register.emailPh')} required onChange={handleChange} className="field !ps-11" />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-stone-400"><Phone size={18} strokeWidth={1.75} /></div>
                <input type="tel" name="phone" placeholder={t('register.phonePh')} aria-label={t('register.phonePh')} required onChange={handleChange} className="field !ps-11" />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-stone-400"><Lock size={18} strokeWidth={1.75} /></div>
                <input type="password" name="password" placeholder={t('register.passPh')} aria-label={t('register.passPh')} required onChange={handleChange} className="field !ps-11" />
              </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary w-full !py-3.5 !mt-6">
              {isLoading ? t('register.btnLoading') : <>{t('register.btn')} <ArrowRight size={18} className="rtl:rotate-180" /></>}
            </button>
          </form>

          <p className="mt-8 text-stone-600">
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="text-stone-900 font-semibold underline underline-offset-4 decoration-orange-600">
              {t('register.loginLink')}
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
