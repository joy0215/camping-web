import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Compass } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
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

      alert(`👋 歡迎回來，${user.name}！`);
      window.location.href = '/'; 
    } catch (error) {
      console.error('登入失敗:', error);
      alert('❌ 帳號或密碼錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 md:p-8 pt-24">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* 左側：情境圖片區 (更換為您的照片) */}
        <div className="md:w-1/2 relative hidden md:block">
          <img 
            src="/images/feature-awning-full.jpg" 
            alt="CampingTour Feature" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* 漸層遮罩維持不變，確保文字清晰 */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent flex flex-col justify-end p-12 text-white">
            <Compass size={40} className="mb-4 text-orange-400" />
            <h2 className="text-4xl font-serif font-bold mb-2">出發，沒有盡頭的公路旅行</h2>
            <p className="text-stone-300">登入您的帳號，查看即將到來的完美旅程。</p>
          </div>
        </div>

        {/* 右側：登入表單區 (維持不變) */}
        <div className="w-full md:w-1/2 p-10 sm:p-14 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">歡迎回來 Welcome Back</h2>
            <p className="text-stone-500 mb-8">請輸入您的 Email 與密碼登入系統。</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" name="email" placeholder="信箱 Email" required
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-stone-700"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" name="password" placeholder="密碼 Password" required
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-stone-700"
                />
              </div>

              <button 
                type="submit" disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98] mt-4 
                  ${isLoading ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-orange-600 hover:shadow-lg'}`}
              >
                {isLoading ? '登入中...' : <>登入帳號 Login <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="mt-8 text-center text-stone-500">
              還沒有帳號嗎？{' '}
              <Link to="/register" className="text-orange-600 font-bold hover:underline transition-all">
                立即註冊
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}