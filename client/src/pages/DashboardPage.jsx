import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, User, ShoppingBag, MapPin, Calendar as CalendarIcon, CheckCircle, Clock, Edit3, ChevronDown, ChevronUp, Star, Camera, Globe, UploadCloud, X, ArrowLeft } from 'lucide-react';
import axiosClient from '../api/axiosClient';

// 🌟 匯入全球 240+ 國家資料庫
import { countriesData } from '../data/countries';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  // 評價表單專用的 State
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState(null);
  const [previewReviewPhoto, setPreviewReviewPhoto] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // 模擬假訂單資料 (為了讓版面有東西顯示)
  const [orders, setOrders] = useState([
    {
      id: 'ORDER-1001',
      status: 'paid',
      startDate: '2026-05-10',
      endDate: '2026-05-14',
      total: 14500,
      hasReviewed: false
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

  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleOrder = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

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
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
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
      // 未來替換成真實的 axiosClient.post 請求
      const formData = new FormData();
      formData.append('orderId', reviewOrderId);
      formData.append('rating', rating);
      formData.append('comment', comment);
      if (photo) formData.append('photo', photo);

      // 補上使用者的基本資料
      formData.append('userName', user.nickname || user.name);
      formData.append('userAvatar', user.name?.charAt(0).toUpperCase() || 'U');
      // 如果有其他資料也可以在這裡 append

      // 🚀 呼叫我們剛剛寫好的後端 API
      await axiosClient.post('/feedback', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setReviewSuccess(true);
      
      // 更新訂單狀態為「已評價」
      setOrders(prevOrders => 
        prevOrders.map(o => o.id === reviewOrderId ? { ...o, hasReviewed: true } : o)
      );

      setTimeout(() => {
        setActiveTab('reviews');
      }, 2000);

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
          
          {/* 左側：側邊導覽選單 (Sidebar) */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 text-center mb-6">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full bg-orange-500 rounded-full flex items-center justify-center text-3xl font-bold text-white overflow-hidden shadow-inner">
                  {previewAvatar ? <img src={previewAvatar} alt="Avatar" className="w-full h-full object-cover" /> : user.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h2 className="font-bold text-xl text-stone-900">{user.nickname || user.name}</h2>
              <p className="text-stone-400 text-sm">{user.email}</p>
            </div>

            <nav className="space-y-2">
              <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-stone-600 hover:bg-stone-50'}`}>
                <ShoppingBag size={20} /> {t('dashboard.tabOrders')}
              </button>
              <button onClick={() => setActiveTab('reviews')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${(activeTab === 'reviews' || activeTab === 'write-review') ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-stone-600 hover:bg-stone-50'}`}>
                <Star size={20} /> {t('dashboard.tabReviews')}
              </button>
              <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-stone-600 hover:bg-stone-50'}`}>
                <User size={20} /> {t('dashboard.tabProfile')}
              </button>
            </nav>

            <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all mt-10">
              <LogOut size={20} /> {t('dashboard.btnLogout')}
            </button>
          </div>

          {/* 右側：主內容區 */}
          <div className="lg:col-span-9">
            
            {/* --- 1. 我的訂單列表 --- */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-2xl font-bold mb-6 text-stone-900">{t('dashboard.tabOrders')}</h3>
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-stone-900 text-lg">#{order.id}</span>
                          {order.status === 'paid' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={14}/> {t('dashboard.paid', 'Paid')}</span>}
                          {order.status === 'pending' && <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={14}/> {t('dashboard.pending', 'Pending')}</span>}
                        </div>
                        <div className="text-sm text-stone-500 flex items-center gap-2">
                          <CalendarIcon size={16}/> {order.startDate} ~ {order.endDate}
                        </div>
                      </div>
                      <div className="text-right w-full md:w-auto">
                        <p className="text-stone-400 text-xs font-bold uppercase mb-1">{t('checkout.total', 'TOTAL AMOUNT')}</p>
                        <p className="text-2xl font-bold text-orange-600">NT$ {order.total.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="bg-stone-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-t border-stone-100">
                      <button onClick={() => toggleOrder(order.id)} className="text-stone-600 font-bold text-sm flex items-center gap-1 hover:text-orange-600 transition-colors">
                        {expandedOrder === order.id ? <><ChevronUp size={16}/> {t('dashboard.btnHide', 'Hide')}</> : <><ChevronDown size={16}/> {t('dashboard.btnShow', 'Details')}</>}
                      </button>
                      
                      <div className="flex gap-3">
                        {order.status === 'pending' && (
                          <button className="bg-stone-900 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors">
                            {t('dashboard.btnPay', 'Pay Now')}
                          </button>
                        )}
                        {order.status === 'paid' && (
                          <button 
                            onClick={() => handleReviewClick(order.id)}
                            className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${order.hasReviewed ? 'bg-stone-200 text-stone-700 hover:bg-stone-300' : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200'}`}
                          >
                            <Edit3 size={16} />
                            {order.hasReviewed ? t('dashboard.btnEditReview', 'Edit Review') : t('dashboard.btnReview', 'Write Review')}
                          </button>
                        )}
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="p-6 border-t border-stone-200 bg-white">
                         <p className="text-stone-500 text-sm">Order details placeholder...</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* --- 2. 我的評價總覽 (Reviews Tab) & 早鳥評價入口 --- */}
            {activeTab === 'reviews' && (
              <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                  <h3 className="text-2xl font-bold">{t('dashboard.tabReviews', 'My Reviews')}</h3>
                  {/* 🌟 早鳥評價自由撰寫入口 */}
                  <button 
                    onClick={() => handleReviewClick('EARLY-BIRD-001')} 
                    className="bg-stone-900 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2"
                  >
                    <Edit3 size={16} /> {t('dashboard.btnReview', 'Write Review')}
                  </button>
                </div>
                
                <div className="text-center py-12 text-stone-400 border-2 border-dashed border-stone-100 rounded-2xl bg-stone-50">
                   <Star size={48} className="mx-auto mb-4 opacity-20" />
                   <p className="mb-2 font-bold text-stone-500">{t('dashboard.noReviews', "You haven't written any reviews yet.")}</p>
                   <p className="text-sm">Share your recent camping tour experience with us!</p>
                </div>
              </div>
            )}

            {/* --- 3. 內嵌評價填寫表單 (Write Review) --- */}
            {activeTab === 'write-review' && (
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200 shadow-sm animate-fade-in relative">
                
                {reviewSuccess ? (
                  <div className="text-center py-16">
                    <CheckCircle size={80} className="text-green-500 mx-auto mb-6 animate-bounce" />
                    <h2 className="text-3xl font-bold text-stone-900 mb-2">{t('feedback.success', 'Thank you!')}</h2>
                    <p className="text-stone-500">Redirecting back...</p>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => setActiveTab('reviews')}
                      className="flex items-center gap-2 text-stone-500 hover:text-orange-600 font-bold text-sm mb-8 transition-colors"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>

                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">{t('feedback.title', 'Share Your Experience')}</h2>
                      {/* 🌟 根據訂單號判斷顯示文字 */}
                      {reviewOrderId?.startsWith('EARLY-BIRD') ? (
                         <p className="text-stone-500 font-bold text-orange-600">Early Access Guest</p>
                      ) : (
                         <p className="text-stone-500 font-bold text-orange-600">Order: #{reviewOrderId}</p>
                      )}
                    </div>

                    <form onSubmit={handleReviewSubmit} className="space-y-6 max-w-xl mx-auto">
                      <div className="text-center">
                        <label className="block text-sm font-bold text-stone-700 mb-3">{t('feedback.rating', 'Rate your experience')}</label>
                        <div className="flex justify-center gap-2">
                          {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                              <button
                                type="button"
                                key={ratingValue}
                                className={`transition-all ${ratingValue <= (hover || rating) ? 'text-yellow-400 scale-110' : 'text-stone-300'}`}
                                onClick={() => setRating(ratingValue)}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(0)}
                              >
                                <Star size={40} fill={ratingValue <= (hover || rating) ? "currentColor" : "none"} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">{t('feedback.comment', 'Tell us more')}</label>
                        <textarea
                          rows="4"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder={t('feedback.commentPh', 'What did you love about the campervan?')}
                          className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50 resize-none"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">{t('feedback.photo', 'Upload a Photo')}</label>
                        {!previewReviewPhoto ? (
                          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-stone-300 border-dashed rounded-2xl cursor-pointer bg-stone-50 hover:bg-orange-50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <UploadCloud size={40} className="text-orange-500 mb-3" />
                              <p className="text-sm text-stone-600 font-bold mb-1">Click to upload photo</p>
                              <p className="text-xs text-stone-400">{t('feedback.photoHint', 'Max 5MB')}</p>
                            </div>
                            <input type="file" accept="image/*" onChange={handleReviewPhotoChange} className="hidden" />
                          </label>
                        ) : (
                          <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-stone-200 shadow-inner">
                            <img src={previewReviewPhoto} alt="Preview" className="w-full h-full object-cover" />
                            <button type="button" onClick={clearReviewPhoto} className="absolute top-3 right-3 bg-white text-red-500 p-1.5 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors">
                              <X size={20} />
                            </button>
                          </div>
                        )}
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmittingReview}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${isSubmittingReview ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-orange-600 hover:-translate-y-1'}`}
                      >
                        {isSubmittingReview ? t('feedback.btnSubmitting', 'Uploading...') : t('feedback.btnSubmit', 'Submit Feedback')}
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}

            {/* --- 4. 帳號設定 (Profile Tab) --- */}
            {activeTab === 'profile' && (
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200 shadow-sm animate-fade-in">
                <h3 className="text-2xl font-bold mb-8">{t('dashboard.profileTitle')}</h3>
                <form className="space-y-8 max-w-2xl">
                  
                  <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-stone-100">
                    <div className="relative group">
                      <div className="w-28 h-28 bg-stone-100 rounded-full overflow-hidden border-4 border-white shadow-md">
                        {previewAvatar ? <img src={previewAvatar} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-stone-300"><User size={40}/></div>}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-stone-900 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-orange-600 transition-colors">
                        <Camera size={18} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                      </label>
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-800 mb-1">{t('dashboard.profileAvatar')}</h4>
                      <p className="text-sm text-stone-400">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">{t('dashboard.profileNickname')}</label>
                      <input type="text" placeholder="e.g. Vanlifer David" className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">{t('dashboard.profileCountry')}</label>
                      <div className="relative">
                        <select className="w-full p-4 pl-12 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50 appearance-none cursor-pointer">
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
                      <label className="block text-sm font-bold text-stone-700 mb-2">{t('dashboard.name')}</label>
                      <input type="text" defaultValue={user.name} className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">{t('dashboard.phone')}</label>
                      <input type="tel" defaultValue={user.phone} className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50" />
                    </div>
                  </div>

                  <button type="button" className="bg-stone-900 hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1">
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