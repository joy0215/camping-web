import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// 🌟 已修正：補上 Mail 圖示的引用
import { 
  LogOut, User, ShoppingBag, MapPin, Calendar as CalendarIcon, 
  CheckCircle, Clock, Edit3, ChevronDown, ChevronUp, Star, 
  Camera, Globe, UploadCloud, X, ArrowLeft, Mail 
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { countriesData } from '../data/countries';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  // 🌟 真實訂單與狀態
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // 🌟 個人資料表單
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // 評價表單專用
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    setProfileForm({
      name: userData.name || '',
      phone: userData.phone || '',
      address: userData.address || ''
    });
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axiosClient.get('/inquiry/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Fetch orders error:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const response = await axiosClient.put('/auth/profile', profileForm);
      if (response.data.success) {
        const updatedUser = { ...user, ...response.data.user };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('✅ Profile updated successfully!');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      alert('❌ Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    
    const formData = new FormData();
    formData.append('orderId', reviewOrderId);
    formData.append('rating', rating);
    formData.append('comment', comment);
    formData.append('userName', user.name);
    formData.append('userAvatar', user.name.charAt(0).toUpperCase());
    formData.append('country', 'TW'); 
    if (photo) formData.append('photo', photo);

    try {
      const response = await axiosClient.post('/feedback', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        alert('🎉 Thank you for your review!');
        setReviewOrderId(null);
        setRating(5);
        setComment('');
        setPhoto(null);
        setPhotoPreview(null);
      }
    } catch (error) {
      console.error('Review error:', error);
      alert('❌ Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // 🌟 輔助函數：解析並翻譯加購品物件
  const formatAddons = (addonsData) => {
    if (!addonsData) return t('dashboard.noAddons');
    
    let parsed = addonsData;
    if (typeof addonsData === 'string') {
      try { 
        parsed = JSON.parse(addonsData); 
      } catch (e) { 
        return addonsData; 
      }
    }

    if (typeof parsed === 'object' && parsed !== null) {
      const selected = [];
      if (parsed.mattress) selected.push(t('dashboard.addonMattress'));
      if (parsed.blanket) selected.push(t('dashboard.addonBlanket'));
      if (parsed.cookware) selected.push(t('dashboard.addonCookware'));
      
      return selected.length > 0 ? selected.join('、') : t('dashboard.noAddons');
    }
    
    return String(parsed);
  };

  if (!user) return null;

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header Section */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-stone-100">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-orange-50 shadow-inner">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900 leading-tight">{t('dashboard.welcome')}, {user.name}</h1>
              <p className="text-stone-400 text-sm flex items-center gap-1 mt-1"><Mail size={14}/> {user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-100 text-stone-600 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm">
            <LogOut size={18} /> {t('dashboard.btnLogout')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-2">
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-500 hover:bg-stone-100'}`}>
              <ShoppingBag size={20} /> {t('dashboard.tabOrders')}
            </button>
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-500 hover:bg-stone-100'}`}>
              <User size={20} /> {t('dashboard.tabProfile')}
            </button>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' ? (
              <div className="space-y-4">
                {isLoadingOrders ? (
                  <div className="bg-white p-12 rounded-3xl text-center text-stone-400 border border-stone-100">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl text-center text-stone-400 border border-stone-100">{t('dashboard.noOrders')}</div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Order ID: #{order.id}</span>
                            <h3 className="text-xl font-bold text-stone-900">Nomad A180</h3>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                            order.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {order.status === 'confirmed' ? t('dashboard.paid') : order.status === 'cancelled' ? t('dashboard.cancelled') : t('dashboard.pending')}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <div className="flex items-center gap-3 text-stone-600 bg-stone-50 p-4 rounded-2xl">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm"><CalendarIcon size={20}/></div>
                            <div>
                              <p className="text-[10px] uppercase font-bold text-stone-400">{t('dashboard.startDate')}</p>
                              <p className="font-bold text-stone-800">{new Date(order.start_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-stone-600 bg-stone-50 p-4 rounded-2xl">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm"><CalendarIcon size={20}/></div>
                            <div>
                              <p className="text-[10px] uppercase font-bold text-stone-400">{t('dashboard.endDate')}</p>
                              <p className="font-bold text-stone-800">{new Date(order.end_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-stone-100">
                          <div className="flex items-center gap-2">
                             <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} className="flex items-center gap-1 text-sm font-bold text-stone-400 hover:text-stone-900 transition-colors">
                               {expandedOrder === order.id ? <><ChevronUp size={16}/> {t('dashboard.btnHide')}</> : <><ChevronDown size={16}/> {t('dashboard.btnShow')}</>}
                             </button>
                          </div>
                          <div className="flex items-center gap-3">
                            {order.status === 'pending' && (
                               <button onClick={() => navigate(`/checkout/${order.id}`, { state: { order, user, amount: order.total_price } })} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all">
                                 {t('dashboard.btnPay')}
                               </button>
                            )}
                            {order.status === 'confirmed' && (
                               <button onClick={() => setReviewOrderId(order.id)} className="flex items-center gap-1 bg-stone-900 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all">
                                 <Edit3 size={16}/> {t('dashboard.btnReview')}
                               </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {expandedOrder === order.id && (
                        <div className="p-6 border-t border-stone-200 bg-white text-sm text-stone-600 leading-relaxed animate-fade-in">
                          <p className="mb-1">
                            <strong className="text-stone-800">{t('dashboard.contactInfo')}: </strong> 
                            {order.contact_name} ({order.contact_phone})
                          </p>
                          <p>
                            <strong className="text-stone-800">{t('dashboard.addons')}: </strong> 
                            {formatAddons(order.addons)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}

                {/* 評價彈窗 */}
                {reviewOrderId && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-stone-900">Share Your Experience</h2>
                        <button onClick={() => setReviewOrderId(null)} className="p-2 hover:bg-stone-100 rounded-full"><X/></button>
                      </div>
                      <form onSubmit={handleReviewSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-stone-700 mb-2">Rating</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}>
                                <Star size={32} fill={(hover || rating) >= star ? "#ea580c" : "none"} className={(hover || rating) >= star ? "text-orange-600" : "text-stone-300"} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-stone-700 mb-2">Comment</label>
                          <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full p-4 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 min-h-[120px]" placeholder="Tell us about your trip..." required />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-stone-700 mb-2">Photo</label>
                          <div className="flex items-center gap-4">
                            <label className="cursor-pointer flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-200 font-bold transition-all text-sm">
                              <Camera size={18}/> {photo ? 'Change Photo' : 'Upload Photo'}
                              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </label>
                            {photoPreview && <img src={photoPreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border-2 border-orange-100"/>}
                          </div>
                        </div>
                        <button type="submit" disabled={isSubmittingReview} className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${isSubmittingReview ? 'bg-stone-400' : 'bg-stone-900 hover:bg-orange-600'}`}>
                          {isSubmittingReview ? 'Uploading...' : 'Submit Review'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-stone-100">
                <h2 className="text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
                   <User className="text-orange-600" /> {t('dashboard.profileTitle')}
                </h2>
                
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">{t('dashboard.name')}</label>
                        <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" required />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">Address</label>
                        <div className="relative">
                          <input type="text" value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} className="w-full pl-12 pr-4 py-4 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" />
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                            <MapPin size={18} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">Country / Region</label>
                        <div className="relative">
                          <select className="w-full pl-12 pr-4 py-4 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50 appearance-none">
                            <option value="TW">Taiwan 🇹🇼</option>
                            {countriesData.map(c => <option key={c.code} value={c.code}>{isZh ? c.zh : c.en} {c.flag}</option>)}
                          </select>
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                            <Globe size={18} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Phone</label>
                      <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Email (Read Only)</label>
                      <input type="email" value={user.email} disabled className="w-full p-4 border border-stone-200 rounded-xl outline-none bg-stone-100 text-stone-500 cursor-not-allowed" />
                    </div>
                  </div>

                  <button type="submit" disabled={isSavingProfile} className={`px-10 py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:-translate-y-1 ${isSavingProfile ? 'bg-stone-400' : 'bg-stone-900 hover:bg-orange-600'}`}>
                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
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