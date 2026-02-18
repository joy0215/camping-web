import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Package, Clock, CheckCircle, XCircle, 
  FileText, ChevronRight, User, MapPin, Sparkles, 
  Edit2, Save, Mail, Phone, Home 
} from 'lucide-react';

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // 編輯模式狀態
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '' // 新增地址欄位
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    
    // 初始化表單資料
    setFormData({
      name: userData.name || '',
      phone: userData.phone || '',
      email: userData.email || '',
      address: userData.address || ''
    });

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get('/inquiry/my-orders');
      setOrders(res.data);
    } catch (error) {
      console.error('無法取得訂單', error);
    } finally {
      setLoading(false);
    }
  };

  // 處理輸入變更
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 儲存個人資料
  const handleSaveProfile = async () => {
    try {
      // 呼叫後端 API 更新資料
      const res = await axiosClient.put('/auth/update-profile', formData);
      
      // 更新本地狀態
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setIsEditing(false);
      alert('個人資料已更新！🎉');
    } catch (error) {
      console.error('更新失敗', error);
      alert('更新失敗，請稍後再試');
    }
  };

  // 狀態標籤 (保持不變)
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200"><CheckCircle size={14} /> 已確認 Confirmed</span>;
      case 'cancelled': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200"><XCircle size={14} /> 已取消 Cancelled</span>;
      default: return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200"><Clock size={14} /> 審核中 Pending</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">載入中...</div>;

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* 頁面標題 */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-end">
            <div>
                <h2 className="text-3xl font-serif font-bold text-stone-900">會員中心 Member Center</h2>
                <p className="text-stone-500 mt-2">管理您的個人資料與預約紀錄</p>
            </div>
            <button onClick={() => navigate('/booking')} className="mt-4 md:mt-0 bg-stone-900 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg flex items-center gap-2">
                <Sparkles size={16} className="text-yellow-400"/> 預約新旅程
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- 左側：個人資料卡片 (Profile Card) --- */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 sticky top-28">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                            <User size={20} className="text-orange-600"/> 個人資料
                        </h3>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="text-stone-400 hover:text-orange-600 transition-colors">
                                <Edit2 size={18}/>
                            </button>
                        ) : (
                            <button onClick={handleSaveProfile} className="text-green-600 hover:text-green-700 font-bold flex items-center gap-1 text-sm bg-green-50 px-3 py-1 rounded-full">
                                <Save size={16}/> 儲存
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* 姓名 */}
                        <div>
                            <label className="text-xs text-stone-400 uppercase tracking-wider block mb-1">姓名 Name</label>
                            {isEditing ? (
                                <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:border-orange-500"/>
                            ) : (
                                <div className="font-bold text-lg text-stone-800">{user?.name}</div>
                            )}
                        </div>

                        {/* 電話 */}
                        <div>
                            <label className="text-xs text-stone-400 uppercase tracking-wider block mb-1 flex items-center gap-1"><Phone size={12}/> 電話 Phone</label>
                            {isEditing ? (
                                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:border-orange-500"/>
                            ) : (
                                <div className="text-stone-600">{user?.phone || <span className="text-stone-300 italic">未填寫</span>}</div>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-xs text-stone-400 uppercase tracking-wider block mb-1 flex items-center gap-1"><Mail size={12}/> Email</label>
                            <div className="text-stone-600 break-all">{user?.email}</div> {/* Email 通常不讓改，或者是唯讀 */}
                        </div>

                        {/* 地址 (新增) */}
                        <div>
                            <label className="text-xs text-stone-400 uppercase tracking-wider block mb-1 flex items-center gap-1"><Home size={12}/> 地址 Address</label>
                            {isEditing ? (
                                <textarea name="address" value={formData.address} onChange={handleChange} rows="3" placeholder="請填寫地址以利合約生成" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:border-orange-500 text-sm"/>
                            ) : (
                                <div className="text-stone-600 text-sm leading-relaxed">{user?.address || <span className="text-stone-300 italic">未填寫 (請點擊編輯補上資料)</span>}</div>
                            )}
                        </div>
                    </div>
                    
                    {/* 提示訊息 */}
                    <div className="mt-6 bg-orange-50 p-4 rounded-xl text-xs text-orange-800 leading-relaxed">
                        <InfoIcon /> 完善個人資料可讓系統自動帶入信用卡授權書，節省您的填寫時間。
                    </div>
                </div>
            </div>

            {/* --- 右側：訂單列表 (Order History) --- */}
            <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                    <FileText size={20} className="text-orange-600"/> 歷史預約紀錄
                </h3>

                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-stone-200">
                            <Package size={48} className="mx-auto text-stone-300 mb-4"/>
                            <p className="text-stone-500">尚無預約紀錄</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-stone-100 text-stone-500 px-2 py-1 rounded text-xs font-mono">#{order.id}</span>
                                        {getStatusBadge(order.status)}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-stone-400 uppercase">Total</div>
                                        <div className="text-xl font-bold text-stone-800">NT$ {parseInt(order.total_price).toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-stone-700 mb-4">
                                    <Calendar size={18} className="text-orange-500"/>
                                    <span className="font-bold">{formatDate(order.start_date)}</span>
                                    <span className="text-stone-400">➜</span>
                                    <span className="font-bold">{formatDate(order.end_date)}</span>
                                </div>

                                {order.status === 'pending' && (
                                    <button 
                                        onClick={() => navigate(`/signature/${order.id}`, { state: { order, user, amount: order.total_price } })}
                                        className="w-full bg-stone-900 text-white py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors flex justify-center items-center gap-2"
                                    >
                                        <Edit2 size={14}/> 補簽合約 / View Contract
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 mb-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
)