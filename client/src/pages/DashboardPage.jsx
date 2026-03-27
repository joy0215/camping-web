import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { FileText, Settings, LogOut, CheckCircle, Clock, XCircle, CreditCard, User, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // 🌟 Import translation hook

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(); // 🌟 Initialize translation
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [profileData, setProfileData] = useState({
    name: '', email: '', phone: '', address: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // 🌟 Make ADDON_NAMES dynamic using translation
  const getAddonName = (key) => {
    const map = {
      mattress: t('dashboard.addonMattress'),
      blanket: t('dashboard.addonBlanket'),
      cookware: t('dashboard.addonCookware')
    };
    return map[key] || key;
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
        console.error("Fetch orders failed:", error);
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
        alert('✅ Profile Updated!');
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

  if (isLoading) return <div className="pt-32 text-center text-stone-500 animate-pulse">Loading...</div>;

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-900">{t('dashboard.title')}</h2>
            <p className="text-stone-500 mt-1 font-medium">{t('dashboard.welcome')}, {user?.name}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-stone-500 hover:text-red-500 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-stone-100 font-bold text-sm">
            <LogOut size={16} /> {t('dashboard.btnLogout')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex flex-row md:flex-col">
              <button onClick={() => setActiveTab('orders')} className={`flex-1 md:w-full flex items-center gap-3 px-6 py-4 transition-colors font-bold ${activeTab === 'orders' ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-600' : 'text-stone-600 hover:bg-stone-50 border-l-4 border-transparent'}`}><FileText size={20} /> <span className="hidden sm:inline">{t('dashboard.tabOrders')}</span></button>
              <button onClick={() => setActiveTab('profile')} className={`flex-1 md:w-full flex items-center gap-3 px-6 py-4 transition-colors font-bold ${activeTab === 'profile' ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-600' : 'text-stone-600 hover:bg-stone-50 border-l-4 border-transparent'}`}><Settings size={20} /> <span className="hidden sm:inline">{t('dashboard.tabProfile')}</span></button>
            </div>
          </div>

          <div className="md:col-span-9">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 animate-fade-in">
                <h3 className="text-2xl font-bold text-stone-900 mb-6 border-b pb-4">{t('dashboard.tabOrders')}</h3>
                
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-stone-400">
                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                    <p>{t('dashboard.noOrders')}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => {
                      const addonsData = typeof order.addons === 'string' ? JSON.parse(order.addons) : order.addons;
                      const hasAddons = addonsData && Object.values(addonsData).some(val => val === true);

                      return (
                      <div key={order.id} className="border border-stone-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white">
                        
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-stone-900 text-lg">Order #{order.id}</span>
                                {order.status === 'confirmed' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> {t('dashboard.paid')}</span>}
                                {order.status === 'pending' && <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Clock size={12}/> {t('dashboard.pending')}</span>}
                                {order.status === 'cancelled' && <span className="bg-stone-200 text-stone-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><XCircle size={12}/> {t('dashboard.cancelled')}</span>}
                            </div>
                            <span className={`text-2xl font-bold ${order.status === 'cancelled' ? 'text-stone-400 line-through' : 'text-stone-900'}`}>NT$ {Number(order.total_price).toLocaleString()}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm text-stone-600 bg-stone-50 p-4 rounded-xl border border-stone-100">
                                <div><span className="block text-stone-400 text-xs uppercase mb-1 font-bold">{t('dashboard.startDate')}</span> <span className="font-bold text-stone-800">{new Date(order.start_date).toLocaleDateString()}</span></div>
                                <div><span className="block text-stone-400 text-xs uppercase mb-1 font-bold">{t('dashboard.endDate')}</span> <span className="font-bold text-orange-600">{new Date(order.end_date).toLocaleDateString()}</span></div>
                            </div>
                        </div>

                        {expandedOrder === order.id && (
                            <div className="px-6 pb-6 pt-2 border-t border-stone-100 bg-stone-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div>
                                        <h5 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">{t('dashboard.contactInfo')}</h5>
                                        <ul className="text-sm text-stone-700 space-y-2 bg-white p-4 rounded-xl border border-stone-100">
                                            <li className="flex items-center gap-2"><User size={14} className="text-stone-400"/> {order.contact_name || user.name}</li>
                                            <li className="flex items-center gap-2"><Phone size={14} className="text-stone-400"/> {order.contact_phone || user.phone}</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">{t('dashboard.addons')}</h5>
                                        <ul className="text-sm text-stone-700 space-y-2 bg-white p-4 rounded-xl border border-stone-100 min-h-[76px]">
                                            {hasAddons ? (
                                                Object.entries(addonsData).map(([key, value]) => value && (
                                                    <li key={key} className="flex items-center gap-2 before:content-['+'] before:text-orange-500 before:font-bold">
                                                        {getAddonName(key)}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-stone-400">{t('dashboard.noAddons')}</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex justify-between items-center">
                            <button onClick={() => toggleOrderDetails(order.id)} className="text-sm font-bold text-stone-500 hover:text-orange-600 flex items-center gap-1 transition-colors">
                                {expandedOrder === order.id ? <><ChevronUp size={16}/> {t('dashboard.btnHide')}</> : <><ChevronDown size={16}/> {t('dashboard.btnShow')}</>}
                            </button>
                            
                            {order.status === 'pending' && (
                                <button 
                                    onClick={() => navigate(`/checkout/${order.id}`, { state: { order, user, amount: order.total_price } })} 
                                    className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm"
                                >
                                    <CreditCard size={16} /> {t('dashboard.btnPay')}
                                </button>
                            )}
                        </div>

                      </div>
                    )})}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 animate-fade-in">
                <h3 className="text-2xl font-bold text-stone-900 mb-6 border-b pb-4">{t('dashboard.profileTitle')}</h3>
                <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-xl">
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">{t('dashboard.email')}</label><input type="email" value={profileData.email} readOnly className="w-full p-3 border border-stone-200 rounded-xl bg-stone-100 text-stone-500 cursor-not-allowed outline-none" /></div>
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">{t('dashboard.name')}</label><input type="text" name="name" value={profileData.name} onChange={handleProfileChange} required className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" /></div>
                  <div><label className="block text-sm font-bold text-stone-700 mb-2">{t('dashboard.phone')}</label><input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" /></div>
                  <button type="submit" disabled={isSaving} className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md ${isSaving ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-orange-600'}`}>{isSaving ? t('dashboard.btnSaving') : t('dashboard.btnSave')}</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}