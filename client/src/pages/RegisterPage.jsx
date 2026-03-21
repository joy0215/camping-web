import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, Map } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosClient.post('/auth/register', formData);
      alert('🎉 註冊成功！請登入您的新帳號');
      navigate('/login'); 
    } catch (error) {
      console.error('註冊失敗:', error);
      const msg = error.response?.data?.error || '註冊失敗，請稍後再試';
      alert(`❌ ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 md:p-8 pt-24">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse">
    
        <div className="md:w-1/2 relative hidden md:block bg-stone-100">
          <img 
            src="/images/logo-stack.jpg" 
            alt="CampingTour Campervan Rental Taiwan Brand Logo" 
            className="absolute inset-0 w-full h-full object-contain p-12"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-12 text-stone-900">
            <h2 className="text-4xl font-serif font-bold mb-2">加入車泊，擁抱大自然</h2>
            <p className="text-stone-600 font-medium">只需一分鐘註冊，開啟您的質感露營體驗。</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-10 sm:p-14 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">建立帳號 Create Account</h2>
            <p className="text-stone-500 mb-8">請填寫以下資訊，成為 CampingTour 的會員。</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400"><User size={20} /></div>
                <input type="text" name="name" placeholder="真實姓名 Full Name" required onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-stone-700" />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400"><Mail size={20} /></div>
                <input type="email" name="email" placeholder="信箱 Email" required onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-stone-700" />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400"><Phone size={20} /></div>
                <input type="tel" name="phone" placeholder="聯絡電話 Phone Number" required onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-stone-700" />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400"><Lock size={20} /></div>
                <input type="password" name="password" placeholder="設定密碼 Password" required onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-stone-700" />
              </div>

              <button 
                type="submit" disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98] mt-6 
                  ${isLoading ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-orange-600 hover:shadow-lg'}`}
              >
                {isLoading ? '處理中...' : <>立即註冊 Register <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="mt-8 text-center text-stone-500">
              已經有帳號了？{' '}
              <Link to="/login" className="text-orange-600 font-bold hover:underline transition-all">
                返回登入
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}