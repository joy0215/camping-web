import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { FileText, Settings, LogOut, CheckCircle, Clock, MessageSquare, Wrench, XCircle, CreditCard, User, Phone, ChevronDown, ChevronUp } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🆕 紀錄哪一筆訂單被展開看明細
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [profileData, setProfileData] = useState({
    name: '', email: '', phone: '', address: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const ADDON_NAMES = {
    mattress: '雙人充氣睡墊 (Air Mattress)',
    blanket: '保暖毛毯 (Warm Blanket)',
    cookware: '多功能鍋具組 (Cookware Set)'
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
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
        alert('✅ 個人資料更新成功 Profile Updated!');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) setExpandedOrder(null);
    else setExpandedOrder(orderId);
  };

  if (isLoading) return <div className="pt-32 text-center text-stone-500 animate-pulse">載入中 Loading...</div>;

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-900">Member Center</h2>
            <p className="text-stone-500 mt-1 font-medium">歡迎回來 Welcome back, {user?.name}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-stone-500 hover:text-red-500 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-stone-100 font-bold text-sm">
            <LogOut size={16} /> 登出 Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex flex-row md:flex-col">
              <button onClick={() => setActiveTab('orders')} className={`flex-1 md:w-full flex items-center gap-3 px-6 py-4 transition-colors font-bold ${activeTab === 'orders' ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-600' : 'text-stone-600 hover:bg-stone-50 border-l-4 border-transparent'}`}><FileText size={20} /> <span className="hidden sm:inline">歷史訂單 My Orders</span></button>
              <button onClick={() => setActiveTab('profile')} className={`flex-1 md:w-full flex items-center gap-3 px-6 py-4 transition-colors font-bold ${activeTab === 'profile' ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-600' : 'text-stone-600 hover:bg-stone-50 border-l-4 border-transparent'}`}><Settings size={20} /> <span className="hidden sm:inline">帳號設定 Profile</span></button>
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
                    <p className="text-sm">No orders found.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => {
                      const addonsData = typeof order.addons === 'string' ? JSON.parse(order.addons) : order.addons;
                      const hasAddons = addonsData && Object.values(addonsData).some(val => val === true);

                      return (
                      <div key={order.id} className="border border-stone-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white">
                        
                        {/* 訂單頭部 (摘要) */}
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-stone-900 text-lg">Order #{order.id}</span>
                                {order.status === 'confirmed' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> 已付款 Paid</span>}
                                {order.status === 'pending' && <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Clock size={12}/> 待付款 Pending</span>}
                                {order.status === 'cancelled' && <span className="bg-stone-200 text-stone-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><XCircle size={12}/> 已取消 Cancelled</span>}
                            </div>
                            <span className={`text-2xl font-bold ${order.status === 'cancelled' ? 'text-stone-400 line-through' : 'text-stone-900'}`}>NT$ {Number(order.total_price).toLocaleString()}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm text-stone-600 bg-stone-50 p-4 rounded-xl border border-stone-100">
                                <div><span className="block text-stone-400 text-xs uppercase mb-1 font-bold">取車 Start Date</span> <span className="font-bold text-stone-800">{new Date(order.start_date).toLocaleDateString()}</span></div>
                                <div><span className="block text-stone-400 text-xs uppercase mb-1 font-bold">還車 End Date</span> <span className="font-bold text-orange-600">{new Date(order.end_date).toLocaleDateString()}</span></div>
                            </div>
                        </div>

                        {/* 展開明細的內容 */}
                        {expandedOrder === order.id && (
                            <div className="px-6 pb-6 pt-2 border-t border-stone-100 bg-stone-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div>
                                        <h5 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">承租人資訊 Contact Info</h5>
                                        <ul className="text-sm text-stone-700 space-y-2 bg-white p-4 rounded-xl border border-stone-100">
                                            <li className="flex items-center gap-2"><User size={14} className="text-stone-400"/> {order.contact_name || user.name}</li>
                                            <li className="flex items-center gap-2"><Phone size={14} className="text-stone-400"/> {order.contact_phone || user.phone}</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">加購配備 Add-ons</h5>
                                        <ul className="text-sm text-stone-700 space-y-2 bg-white p-4 rounded-xl border border-stone-100 min-h-[76px]">
                                            {hasAddons ? (
                                                Object.entries(addonsData).map(([key, value]) => value && (
                                                    <li key={key} className="flex items-center gap-2 before:content-['+'] before:text-orange-500 before:font-bold">
                                                        {ADDON_NAMES[key]}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-stone-400">無加購項目 None</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 底部按鈕區 */}
                        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex justify-between items-center">
                            <button onClick={() => toggleOrderDetails(order.id)} className="text-sm font-bold text-stone-500 hover:text-orange-600 flex items-center gap-1 transition-colors">
                                {expandedOrder === order.id ? <><ChevronUp size={16}/> 隱藏明細 Hide</> : <><ChevronDown size={16}/> 查看明細 Details</>}
                            </button>
                            
                            {order.status === 'pending' && (
                                <button 
                                    onClick={() => navigate(`/checkout/${order.id}`, { state: { order, user, amount: order.total_price } })} 
                                    className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm"
                                >
                                    <CreditCard size={16} /> 繼續付款 Pay Now
                                </button>
                            )}
                        </div>

                      </div>
                    )})}
                  </div>
                )}
              </div>
            )}

            {/* 帳號設定 */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 animate-fade-in">
                <h3 className="text-2xl font-bold text-stone-900 mb-6 border-b pb-4">個人資料 Profile</h3>
                <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-xl">
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">登入信箱 Email</label><input type="email" value={profileData.email} readOnly className="w-full p-3 border border-stone-200 rounded-xl bg-stone-100 text-stone-500 cursor-not-allowed outline-none" /></div>
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">姓名 Full Name</label><input type="text" name="name" value={profileData.name} onChange={handleProfileChange} required className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" /></div>
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">聯絡電話 Phone Number</label><input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" /></div>
                  <button type="submit" disabled={isSaving} className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md ${isSaving ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-orange-600'}`}>{isSaving ? 'Saving...' : '儲存變更 Save Changes'}</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}