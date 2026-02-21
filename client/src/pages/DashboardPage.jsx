import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { FileText, Settings, LogOut, CheckCircle, Clock, PenTool, MessageSquare, Wrench, XCircle } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    name: '', email: '', phone: '', address: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert('請先登入');
        navigate('/login');
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      setProfileData({
        name: parsedUser.name || '', email: parsedUser.email || '',
        phone: parsedUser.phone || '', address: parsedUser.address || ''
      });

      try {
        const response = await axiosClient.get('/inquiry/my-orders');
        setOrders(response.data);
      } catch (error) {
        console.error("無法取得訂單:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await axiosClient.put('/auth/profile', {
        name: profileData.name, phone: profileData.phone, address: profileData.address
      });
      if (response.data.success) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('✅ 個人資料更新成功！');
      }
    } catch (error) {
      alert('❌ 更新失敗，請稍後再試');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('已登出 👋');
    navigate('/');
  };

  if (isLoading) return <div className="pt-32 text-center text-stone-500">載入中 Loading...</div>;

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-900">Member Center</h2>
            <p className="text-stone-500 mt-1">歡迎回來，{user?.name}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-stone-500 hover:text-red-500 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-stone-100">
            <LogOut size={16} /> 登出帳號
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex flex-row md:flex-col">
              <button onClick={() => setActiveTab('orders')} className={`flex-1 md:w-full flex items-center gap-3 px-6 py-4 transition-colors font-bold ${activeTab === 'orders' ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-600' : 'text-stone-600 hover:bg-stone-50 border-l-4 border-transparent'}`}><FileText size={20} /> <span className="hidden sm:inline">歷史訂單</span></button>
              <button onClick={() => setActiveTab('profile')} className={`flex-1 md:w-full flex items-center gap-3 px-6 py-4 transition-colors font-bold ${activeTab === 'profile' ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-600' : 'text-stone-600 hover:bg-stone-50 border-l-4 border-transparent'}`}><Settings size={20} /> <span className="hidden sm:inline">帳號設定</span></button>
              <button onClick={() => setActiveTab('feedback')} className={`flex-1 md:w-full flex items-center gap-3 px-6 py-4 transition-colors font-bold ${activeTab === 'feedback' ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-600' : 'text-stone-600 hover:bg-stone-50 border-l-4 border-transparent'}`}><MessageSquare size={20} /> <span className="hidden sm:inline">旅程反饋</span></button>
            </div>
          </div>

          <div className="md:col-span-9">
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 animate-fade-in">
                <h3 className="text-2xl font-bold text-stone-900 mb-6 border-b pb-4">歷史訂單 My Orders</h3>
                
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-stone-400">
                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                    <p>目前還沒有任何訂單紀錄喔！</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-stone-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-lg">訂單 #{order.id}</span>
                            {/* ✅ 修正重點：加上已取消的標籤 */}
                            {order.status === 'confirmed' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> 已確認</span>}
                            {order.status === 'pending' && <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Clock size={12}/> 處理中</span>}
                            {order.status === 'cancelled' && <span className="bg-stone-200 text-stone-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><XCircle size={12}/> 已取消/婉拒</span>}
                          </div>
                          <span className={`text-2xl font-bold ${order.status === 'cancelled' ? 'text-stone-400 line-through' : 'text-orange-600'}`}>NT$ {Number(order.total_price).toLocaleString()}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-stone-600 mb-4 bg-stone-50 p-4 rounded-xl">
                          <div><span className="block text-stone-400 text-xs uppercase mb-1">取車日期</span> <span className="font-medium text-stone-800">{new Date(order.start_date).toLocaleDateString()}</span></div>
                          <div><span className="block text-stone-400 text-xs uppercase mb-1">還車日期</span> <span className="font-medium text-stone-800">{new Date(order.end_date).toLocaleDateString()}</span></div>
                        </div>

                        {/* ✅ 修正重點：只有「未簽名」且「處理中(pending)」的訂單，才准補簽合約！ */}
                        {!order.signature_url && order.status === 'pending' && (
                          <div className="mt-4 pt-4 border-t border-stone-100 flex justify-end">
                            <button onClick={() => navigate(`/signature/${order.id}`, { state: { order, user, amount: order.total_price } })} className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm">
                              <PenTool size={16} /> 補簽信用卡授權書
                            </button>
                          </div>
                        )}
                        {/* 如果已經簽署，顯示小提示 */}
                        {order.signature_url && order.status !== 'cancelled' && (
                          <div className="mt-4 pt-4 border-t border-stone-100 text-right text-sm text-green-600 font-bold flex items-center justify-end gap-1">
                             <CheckCircle size={16}/> 信用卡授權已完成
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 帳號設定 */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 animate-fade-in">
                <h3 className="text-2xl font-bold text-stone-900 mb-6 border-b pb-4">個人資料 Profile</h3>
                <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-xl">
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">登入信箱 (不可修改)</label><input type="email" value={profileData.email} readOnly className="w-full p-3 border border-stone-200 rounded-xl bg-stone-100 text-stone-500 cursor-not-allowed outline-none" /></div>
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">姓名 Full Name</label><input type="text" name="name" value={profileData.name} onChange={handleProfileChange} required className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" /></div>
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">聯絡電話 Phone Number</label><input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" /></div>
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">聯絡地址 Address</label><input type="text" name="address" value={profileData.address} onChange={handleProfileChange} className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" /></div>
                  <button type="submit" disabled={isSaving} className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md ${isSaving ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-orange-600'}`}>{isSaving ? '儲存中...' : '儲存變更 Save Changes'}</button>
                </form>
              </div>
            )}

            {activeTab === 'feedback' && (
               <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 text-center animate-fade-in flex flex-col items-center justify-center min-h-[400px]">
                 <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-6"><Wrench size={40} /></div>
                 <h3 className="text-2xl font-bold text-stone-900 mb-4">功能開發中 Coming Soon</h3>
                 <p className="text-stone-500">我們正在為您打造專屬的評價系統！</p>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}