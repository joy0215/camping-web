import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. 發送登入請求
      const response = await axiosClient.post('/auth/login', formData);
      
      // 2. 登入成功！取得 Token 和 User 資料
      const { token, user } = response.data;

      // 3. ⚠️ 關鍵：把 Token 存到瀏覽器裡 (像蓋章一樣)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      alert(`👋 歡迎回來，${user.name}！`);
      
      // 4. 跳轉回首頁 (並強制重新整理以更新導覽列狀態)
      window.location.href = '/'; 

    } catch (error) {
      console.error('登入失敗:', error);
      alert('❌ 帳號或密碼錯誤');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-stone-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-stone-200">
        <h2 className="text-3xl font-serif font-bold mb-6 text-center text-stone-800">會員登入</h2>
        <p className="text-center text-stone-500 mb-6 text-sm">Welcome Back!</p>
        
        <div className="space-y-4">
          <input 
            type="email" name="email" placeholder="Email" required
            onChange={handleChange}
            className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <input 
            type="password" name="password" placeholder="密碼 Password" required
            onChange={handleChange}
            className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-stone-900 text-white p-3 rounded-lg mt-8 hover:bg-orange-600 transition-colors font-bold"
        >
          登入 Login
        </button>

        <div className="mt-4 text-center">
            <span className="text-stone-500 text-sm">還沒有帳號？ </span>
            <button type="button" onClick={() => navigate('/register')} className="text-orange-600 font-bold text-sm hover:underline">
                去註冊
            </button>
        </div>
      </form>
    </div>
  );
}