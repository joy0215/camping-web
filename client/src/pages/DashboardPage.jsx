import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, User, ShoppingBag, MapPin, Calendar as CalendarIcon, CheckCircle, Clock, Edit3, ChevronDown, ChevronUp } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('orders');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [user, setUser] = useState(null);

  // 模擬假訂單資料 (未來這裡會用 axios 從後端抓取)
  const [orders, setOrders] = useState([
    {
      id: 'ORDER-1001',
      status: 'paid', // paid, pending, cancelled
      startDate: '2026-05-10',
      endDate: '2026-05-14',
      total: 14500,
      hasReviewed: false // 標記是否已經寫過評價
    },
    {
      id: 'ORDER-0982',
      status: 'pending',
      startDate: '2026-06-01',
      endDate: '2026-06-03',
      total: 10500,
      hasReviewed: false
    }
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleOrder = (id) => {
    if (expandedOrder === id) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(id);
    }
  };

  const handleReviewClick = (orderId, hasReviewed) => {
    // 帶著 orderId 導向到我們剛做好的 Feedback 頁面
    navigate(`/feedback/${orderId}`);
  };

  if (!user) return null;

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* 歡迎區塊 */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-stone-900 text-white p-8 rounded-3xl shadow-xl mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-2xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="text-stone-400 text-sm mb-1">{t('dashboard.welcome')}</p>
              <h2 className="text-2xl font-bold">{user.name}</h2>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-stone-800 hover:bg-red-500 border border-stone-700 hover:border-red-500 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
          >
            <LogOut size={18} /> {t('dashboard.btnLogout')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* 左側選單 */}
          <div className="md:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-colors ${activeTab === 'orders' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-100'}`}
            >
              <ShoppingBag size={20} /> {t('dashboard.tabOrders')}
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-colors ${activeTab === 'profile' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-100'}`}
            >
              <User size={20} /> {t('dashboard.tabProfile')}
            </button>
          </div>

          {/* 右側內容區塊 */}
          <div className="md:col-span-3">
            
            {/* 訂單分頁 */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                {orders.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl text-center border border-stone-100 shadow-sm">
                    <ShoppingBag size={48} className="text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-500 font-bold">{t('dashboard.noOrders')}</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      
                      {/* 訂單標題列 */}
                      <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-stone-900 text-lg">#{order.id}</span>
                            {order.status === 'paid' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={14}/> {t('dashboard.paid')}</span>}
                            {order.status === 'pending' && <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={14}/> {t('dashboard.pending')}</span>}
                          </div>
                          <div className="text-sm text-stone-500 flex items-center gap-2">
                            <CalendarIcon size={16}/> {order.startDate} ~ {order.endDate}
                          </div>
                        </div>
                        <div className="text-right w-full md:w-auto">
                          <p className="text-stone-400 text-xs font-bold uppercase mb-1">{t('checkout.total')}</p>
                          <p className="text-2xl font-bold text-orange-600">NT$ {order.total.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* 🌟 操作按鈕列 */}
                      <div className="bg-stone-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-t border-stone-100">
                        <button 
                          onClick={() => toggleOrder(order.id)}
                          className="text-stone-600 font-bold text-sm flex items-center gap-1 hover:text-orange-600 transition-colors"
                        >
                          {expandedOrder === order.id ? <><ChevronUp size={16}/> {t('dashboard.btnHide')}</> : <><ChevronDown size={16}/> {t('dashboard.btnShow')}</>}
                        </button>
                        
                        <div className="flex gap-3">
                          {/* 如果未付款，顯示付款按鈕 */}
                          {order.status === 'pending' && (
                            <button className="bg-stone-900 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors">
                              {t('dashboard.btnPay')}
                            </button>
                          )}
                          
                          {/* 🌟 如果已付款/完成，顯示評價按鈕 */}
                          {order.status === 'paid' && (
                            <button 
                              onClick={() => handleReviewClick(order.id, order.hasReviewed)}
                              className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${order.hasReviewed ? 'bg-stone-200 text-stone-700 hover:bg-stone-300' : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200'}`}
                            >
                              <Edit3 size={16} />
                              {order.hasReviewed ? t('dashboard.btnEditReview') : t('dashboard.btnReview')}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 訂單明細展開 */}
                      {expandedOrder === order.id && (
                        <div className="p-6 border-t border-stone-200 bg-white">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                              <div>
                                <h4 className="font-bold text-stone-800 mb-3 border-b pb-2">{t('dashboard.contactInfo')}</h4>
                                <p className="text-stone-600 mb-1">{t('dashboard.name')}: {user.name}</p>
                                <p className="text-stone-600 mb-1">{t('dashboard.email')}: {user.email}</p>
                                <p className="text-stone-600">{t('dashboard.phone')}: {user.phone || 'N/A'}</p>
                              </div>
                              <div>
                                <h4 className="font-bold text-stone-800 mb-3 border-b pb-2">{t('dashboard.addons')}</h4>
                                <p className="text-stone-600 flex items-center gap-2"><CheckCircle size={14} className="text-orange-500"/> {t('dashboard.addonMattress')}</p>
                                <p className="text-stone-600 flex items-center gap-2"><CheckCircle size={14} className="text-orange-500"/> {t('dashboard.addonCookware')}</p>
                              </div>
                           </div>
                        </div>
                      )}

                    </div>
                  ))
                )}
              </div>
            )}

            {/* 帳號設定分頁 */}
            {activeTab === 'profile' && (
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200 shadow-sm">
                <h3 className="text-2xl font-bold text-stone-900 mb-8">{t('dashboard.profileTitle')}</h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">{t('dashboard.name')}</label>
                    <input type="text" defaultValue={user.name} className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">{t('dashboard.email')} (唯讀)</label>
                    <input type="email" defaultValue={user.email} disabled className="w-full p-4 border border-stone-200 rounded-xl outline-none bg-stone-100 text-stone-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">{t('dashboard.phone')}</label>
                    <input type="tel" defaultValue={user.phone} className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" />
                  </div>
                  <button type="button" className="bg-stone-900 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition-colors w-full md:w-auto">
                    {t('dashboard.btnSave')}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}