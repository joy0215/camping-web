import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, User, ShoppingBag, MapPin, Calendar as CalendarIcon, CheckCircle, Clock, Edit3, ChevronDown, ChevronUp, Star, Camera, Globe, UploadCloud, X, ArrowLeft } from 'lucide-react';
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
  const [previewReviewPhoto, setPreviewReviewPhoto] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setProfileForm({
        name: parsedUser.name || '',
        phone: parsedUser.phone || '',
        address: parsedUser.address || '' // 我們用 address 欄位來存國家
      });
      fetchMyOrders();
    }
  }, [navigate]);

  // 🔌 呼叫 API 獲取真實訂單
  const fetchMyOrders = async () => {
    try {
      const { data } = await axiosClient.get('/inquiry/my-orders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // 🔌 呼叫 API 儲存個人資料
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const { data } = await axiosClient.put('/auth/profile', profileForm);
      if (data.success) {
        const updatedUser = { ...user, ...data.user };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert(isZh ? '個人資料儲存成功！' : 'Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert(isZh ? '儲存失敗' : 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleOrder = (id) => setExpandedOrder(expandedOrder === id ? null : id);

  const handleReviewClick = (orderId) => {
    setReviewOrderId(orderId);
    setRating(5);
    setComment('');
    setPhoto(null);
    setPreviewReviewPhoto(null);
    setReviewSuccess(false);
    setActiveTab('write-review');
  };

  const handleReviewPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewReviewPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearReviewPhoto = () => {
    setPhoto(null);
    setPreviewReviewPhoto(null);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);

    try {
      const formData = new FormData();
      formData.append('orderId', reviewOrderId);
      formData.append('rating', rating);
      formData.append('comment', comment);
      formData.append('userName', user.name || 'Guest');
      formData.append('userAvatar', user.name?.charAt(0).toUpperCase() || 'U');
      formData.append('country', profileForm.address || 'TW'); // 取代碼
      if (photo) formData.append('photo', photo);

      await axiosClient.post('/feedback', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setReviewSuccess(true);
      setTimeout(() => setActiveTab('reviews'), 2000);
    } catch (error) {
      console.error('Submission failed:', error);
      alert(isZh ? '送出失敗，請稍後再試' : 'Submission failed.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!user) return null;

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 左側 Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 text-center mb-6">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full bg-orange-500 rounded-full flex items-center justify-center text-3xl font-bold text-white overflow-hidden shadow-inner">
                  {previewAvatar ? <img src={previewAvatar} alt="Avatar" className="w-full h-full object-cover" /> : user.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h2 className="font-bold text-xl text-stone-900">{user.name}</h2>
              <p className="text-stone-400 text-sm">{user.email}</p>
            </div>

            <nav className="space-y-2">
              <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-stone-600 hover:bg-stone-50'}`}>
                <ShoppingBag size={20} /> {t('dashboard.tabOrders', 'My Orders')}
              </button>
              <button onClick={() => setActiveTab('reviews')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${(activeTab === 'reviews' || activeTab === 'write-review') ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-stone-600 hover:bg-stone-50'}`}>
                <Star size={20} /> {t('dashboard.tabReviews', 'My Reviews')}
              </button>
              <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-stone-600 hover:bg-stone-50'}`}>
                <User size={20} /> {t('dashboard.tabProfile', 'Profile')}
              </button>
                
              {user?.isAdmin && (
                <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all bg-red-600 text-white hover:bg-red-700 shadow-lg mt-4 border-2 border-red-700">
                  <ShieldCheck size={20} /> 🔴 Admin Dashboard
                </button>
              )}
            </nav>

            <button onClick={() => { localStorage.removeItem('user'); localStorage.removeItem('token'); navigate('/login'); }} className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all mt-10">
              <LogOut size={20} /> {t('dashboard.btnLogout', 'Log Out')}
            </button>
          </div>

          {/* 右側主內容區 */}
          <div className="lg:col-span-9">
            
            {/* 1. 我的訂單 (Real Data) */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-2xl font-bold mb-6 text-stone-900">{t('dashboard.tabOrders', 'My Orders')}</h3>
                
                {isLoadingOrders ? (
                   <div className="text-center py-10 text-stone-400">Loading orders...</div>
                ) : orders.length === 0 ? (
                   <div className="text-center py-12 text-stone-400 border-2 border-dashed border-stone-100 rounded-2xl bg-white">
                      <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="font-bold">No orders found.</p>
                      <button onClick={() => navigate('/booking')} className="mt-4 text-orange-600 font-bold hover:underline">Book a campervan now</button>
                   </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-stone-900 text-lg">#{order.merchant_order_no || `CT-${order.id}`}</span>
                            {order.status === 'confirmed' ? (
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={14}/> Paid</span>
                            ) : (
                              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={14}/> {order.status}</span>
                            )}
                          </div>
                          <div className="text-sm text-stone-500 flex items-center gap-2">
                            <CalendarIcon size={16}/> {new Date(order.start_date).toLocaleDateString()} ~ {new Date(order.end_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right w-full md:w-auto">
                          <p className="text-stone-400 text-xs font-bold uppercase mb-1">Total</p>
                          <p className="text-2xl font-bold text-orange-600">NT$ {Number(order.total_price).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="bg-stone-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-t border-stone-100">
                        <button onClick={() => toggleOrder(order.id)} className="text-stone-600 font-bold text-sm flex items-center gap-1 hover:text-orange-600 transition-colors">
                          {expandedOrder === order.id ? <><ChevronUp size={16}/> Hide</> : <><ChevronDown size={16}/> Details</>}
                        </button>
                        
                        <div className="flex gap-3">
                          {order.status === 'confirmed' && (
                            <button 
                              onClick={() => handleReviewClick(order.merchant_order_no || `CT-${order.id}`)}
                              className="bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200 px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                            >
                              <Edit3 size={16} /> Write Review
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {expandedOrder === order.id && (
                        <div className="p-6 border-t border-stone-200 bg-white text-sm text-stone-600">
                          <p><strong>Contact:</strong> {order.contact_name} ({order.contact_phone})</p>
                          <p><strong>Addons:</strong> {order.addons}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 2. 我的評價總覽 & 早鳥通道 */}
            {activeTab === 'reviews' && (
              <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                  <h3 className="text-2xl font-bold">My Reviews</h3>
                  <button 
                    onClick={() => handleReviewClick('EARLY-BIRD')} 
                    className="bg-stone-900 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2"
                  >
                    <Edit3 size={16} /> Write Early Bird Review
                  </button>
                </div>
                <div className="text-center py-12 text-stone-400 border-2 border-dashed border-stone-100 rounded-2xl bg-stone-50">
                   <Star size={48} className="mx-auto mb-4 opacity-20" />
                   <p className="mb-2 font-bold text-stone-500">Share your experience!</p>
                </div>
              </div>
            )}

            {/* 3. 評價填寫表單 */}
            {activeTab === 'write-review' && (
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200 shadow-sm animate-fade-in relative">
                {reviewSuccess ? (
                  <div className="text-center py-16">
                    <CheckCircle size={80} className="text-green-500 mx-auto mb-6 animate-bounce" />
                    <h2 className="text-3xl font-bold text-stone-900 mb-2">Thank you!</h2>
                  </div>
                ) : (
                  <>
                    <button onClick={() => setActiveTab('reviews')} className="flex items-center gap-2 text-stone-500 hover:text-orange-600 font-bold text-sm mb-8 transition-colors">
                      <ArrowLeft size={16} /> Back
                    </button>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Share Your Experience</h2>
                      <p className="text-stone-500 font-bold text-orange-600">Order: {reviewOrderId}</p>
                    </div>
                    <form onSubmit={handleReviewSubmit} className="space-y-6 max-w-xl mx-auto">
                      <div className="text-center">
                        <div className="flex justify-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <button type="button" key={i} className={`transition-all ${i + 1 <= (hover || rating) ? 'text-yellow-400 scale-110' : 'text-stone-300'}`} onClick={() => setRating(i + 1)} onMouseEnter={() => setHover(i + 1)} onMouseLeave={() => setHover(0)}>
                              <Star size={40} fill={i + 1 <= (hover || rating) ? "currentColor" : "none"} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What did you love about the campervan?" className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50 resize-none"></textarea>
                      
                      <div>
                        {!previewReviewPhoto ? (
                          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-stone-300 border-dashed rounded-2xl cursor-pointer bg-stone-50 hover:bg-orange-50 transition-colors">
                            <UploadCloud size={40} className="text-orange-500 mb-3" />
                            <p className="text-sm font-bold">Upload Photo (Max 5MB)</p>
                            <input type="file" accept="image/*" onChange={handleReviewPhotoChange} className="hidden" />
                          </label>
                        ) : (
                          <div className="relative w-full h-48 rounded-2xl overflow-hidden border">
                            <img src={previewReviewPhoto} alt="Preview" className="w-full h-full object-cover" />
                            <button type="button" onClick={clearReviewPhoto} className="absolute top-3 right-3 bg-white text-red-500 p-1.5 rounded-full shadow hover:bg-red-500 hover:text-white"><X size={20} /></button>
                          </div>
                        )}
                      </div>
                      <button type="submit" disabled={isSubmittingReview} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${isSubmittingReview ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-orange-600 hover:-translate-y-1'}`}>
                        {isSubmittingReview ? 'Uploading...' : 'Submit Feedback'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}

            {/* 4. 個人資料設定 (Real API) */}
            {activeTab === 'profile' && (
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200 shadow-sm animate-fade-in">
                <h3 className="text-2xl font-bold mb-8">Profile Settings</h3>
                <form onSubmit={handleProfileSave} className="space-y-8 max-w-2xl">
                  
                  <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-stone-100">
                    <div className="relative group">
                      <div className="w-28 h-28 bg-stone-100 rounded-full overflow-hidden border-4 border-white shadow-md">
                        {previewAvatar ? <img src={previewAvatar} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-stone-300 text-4xl font-bold">{user.name?.charAt(0).toUpperCase()}</div>}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-stone-900 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-orange-600 transition-colors">
                        <Camera size={18} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Name</label>
                      <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Country</label>
                      <div className="relative">
                        <select value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} className="w-full p-4 pl-12 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50 appearance-none cursor-pointer">
                          <option value="">Select Country</option>
                          {countriesData.map(c => (
                            <option key={c.code} value={c.code}>{c.flag} {isZh ? c.zh : c.en}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                          <Globe size={18} />
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