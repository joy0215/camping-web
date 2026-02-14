import { useState } from 'react';
import axiosClient from '../api/axiosClient'; // 引入我們剛做好的通訊官
import { useNavigate } from 'react-router-dom'; // 用來跳轉頁面

export default function RegisterPage() {
  const navigate = useNavigate();
  
  // 1. 設定表單狀態
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  // 2. 處理輸入框變化
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. 送出表單 (關鍵時刻！)
  const handleSubmit = async (e) => {
    e.preventDefault(); // 防止頁面刷新
    
    try {
      // 呼叫後端 API: POST /api/auth/register
      const response = await axiosClient.post('/auth/register', formData);
      
      console.log('註冊成功:', response.data);
      alert('🎉 註冊成功！請前往登入');
      
      // 成功後跳轉到首頁或登入頁 (這裡先跳首頁)
      navigate('/'); 

    } catch (error) {
      console.error('註冊失敗:', error);
      // 如果後端有回傳錯誤訊息 (例如 Email 重複)，顯示出來
      const msg = error.response?.data?.error || '註冊失敗，請稍後再試';
      alert(`❌ ${msg}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">會員註冊</h2>
        
        <input 
          type="text" name="name" placeholder="姓名" required
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <input 
          type="email" name="email" placeholder="Email" required
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <input 
          type="password" name="password" placeholder="密碼" required
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <input 
          type="tel" name="phone" placeholder="電話" required
          onChange={handleChange}
          className="w-full p-2 mb-6 border rounded"
        />

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          立即註冊
        </button>
      </form>
    </div>
  );
}