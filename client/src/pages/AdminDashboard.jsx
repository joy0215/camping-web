import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, CheckCircle, XCircle, FileText, Phone, Mail, Calendar, Filter, CreditCard } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending'); 

  // Quick checkout states
  const [quickAmount, setQuickAmount] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    // Check isAdmin flag returned from backend
    if (!user || !user.isAdmin) {
      alert('⚠️ Permission denied, returning to home');
      navigate('/');
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axiosClient.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      alert('Data loading failed, please check permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const actionName = newStatus === 'confirmed' ? '✅ Confirm Order' : '❌ Cancel Order';
    if (!window.confirm(`Are you sure you want to ${actionName}?`)) return;

    try {
      await axiosClient.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error("Status update failed", error);
      alert('Update failed');
    }
  };

  // Generate quick checkout link
  const handleGenerateQuickLink = async () => {
    if (!quickAmount || quickAmount <= 0) return alert('Please enter an amount greater than 0!');
    setIsGenerating(true);
    try {
      const res = await axiosClient.post('/admin/quick-order', { amount: quickAmount });
      if (res.data.success) {
        const link = `${window.location.origin}/checkout/${res.data.orderId}`;
        setGeneratedLink(link);
        fetchOrders(); 
      }
    } catch (err) {
      alert('Failed to generate link');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    alert('✅ Checkout link copied! You can send it to the customer now.');
  };

  const filteredOrders = orders.filter(o => o.status === filterStatus);

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        
        {/* Dashboard Header */}
        <div className="bg-stone-900 text-white p-8 md:p-10 rounded-[2rem] shadow-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-4 border-red-500/30">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">老闆戰情室</h1>
              <p className="text-stone-400 text-sm">訂單審核與客戶管理中心</p>
            </div>
          </div>
        </div>

        {/* Quick Checkout Link Generator */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="text-orange-600" />
            <h2 className="text-lg font-bold text-stone-900">建立客製化結帳連結</h2>
          </div>
          <p className="text-sm text-stone-500 mb-4">輸入金額即可產生一組專屬結帳網址。你可以直接把網址丟到 LINE 或 WhatsApp 讓客人付款。</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="number" 
              placeholder="輸入結帳金額 (例如: 1000)" 
              value={quickAmount}
              onChange={(e) => setQuickAmount(e.target.value)}
              className="flex-grow p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50 font-bold"
            />
            <button 
              onClick={handleGenerateQuickLink}
              disabled={isGenerating}
              className="bg-stone-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md shrink-0"
            >
              {isGenerating ? 'Generating...' : '⚡ 產生網址'}
            </button>
          </div>

          {generatedLink && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-between gap-4 animate-fade-in">
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-orange-600 uppercase mb-1">專屬付款網址</p>
                <a href={generatedLink} target="_blank" rel="noreferrer" className="text-sm text-stone-800 hover:underline truncate block">
                  {generatedLink}
                </a>
              </div>
              <button onClick={copyToClipboard} className="bg-white text-orange-600 border border-orange-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-orange-600 hover:text-white transition-colors shrink-0">
                複製網址
              </button>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-stone-100 w-fit">
          <button onClick={() => setFilterStatus('pending')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filterStatus === 'pending' ? 'bg-orange-100 text-orange-700' : 'text-stone-500 hover:bg-stone-50'}`}>
            <Clock size={16}/> 待審核 ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button onClick={() => setFilterStatus('confirmed')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filterStatus === 'confirmed' ? 'bg-green-100 text-green-700' : 'text-stone-500 hover:bg-stone-50'}`}>
            <CheckCircle size={16}/> 已確認出車 ({orders.filter(o => o.status === 'confirmed').length})
          </button>
          <button onClick={() => setFilterStatus('cancelled')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filterStatus === 'cancelled' ? 'bg-red-100 text-red-700' : 'text-stone-500 hover:bg-stone-50'}`}>
            <XCircle size={16}/> 婉拒 / 取消 ({orders.filter(o => o.status === 'cancelled').length})
          </button>
        </div>

        {/* Order List */}
        {isLoading ? (
           <div className="text-center py-20 text-stone-400 font-bold animate-pulse">Loading data...</div>
        ) : filteredOrders.length === 0 ? (
           <div className="bg-white py-20 text-center rounded-3xl border border-stone-100 shadow-sm flex flex-col items-center">
             <Filter size={48} className="text-stone-200 mb-4" />
             <p className="text-stone-400 font-bold">目前沒有 {filterStatus === 'pending' ? '待審核' : filterStatus === 'confirmed' ? '已確認' : '已取消'} 的訂單</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                 <div className={`absolute top-0 left-0 w-1 h-full ${order.status === 'pending' ? 'bg-orange-500' : order.status === 'confirmed' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                 
                 <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] text-stone-400 font-bold tracking-widest uppercase mb-1 block">Order #{order.id}</span>
                      <h3 className="font-bold text-lg text-stone-900 truncate pr-2" title={order.user_name}>{order.user_name}</h3>
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] text-stone-400 font-bold tracking-widest uppercase mb-1 block">Total</span>
                       <span className="font-bold text-orange-600 text-lg">NT$ {order.total_price}</span>
                    </div>
                 </div>

                 <div className="space-y-3 mb-6 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                    <div className="flex items-center gap-3 text-sm text-stone-600">
                      <Calendar size={16} className="text-stone-400 shrink-0"/> 
                      <span className="font-medium">{new Date(order.start_date).toLocaleDateString()} <span className="text-stone-300 mx-1">→</span> {new Date(order.end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-stone-600">
                      <Phone size={16} className="text-stone-400 shrink-0"/> <span className="font-medium select-all">{order.user_phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-stone-600">
                      <Mail size={16} className="text-stone-400 shrink-0"/> <span className="font-medium truncate select-all">{order.user_email}</span>
                    </div>
                 </div>

                 <div className="border-t border-stone-100 pt-4 mt-auto">
                    {order.status === 'confirmed' && order.merchant_order_no ? (
                      <div className="text-center bg-green-50 py-3 rounded-xl border border-green-100">
                        <div className="text-xs font-bold text-green-600 flex justify-center items-center gap-1 mb-0.5"><CheckCircle size={14}/> 藍新金流已立帳</div>
                        <span className="text-[10px] text-blue-500 font-normal select-all">{order.merchant_order_no}</span>
                      </div>
                    ) : (
                      order.status !== 'cancelled' && <div className="text-center text-xs font-bold text-red-500 bg-red-50 py-3 rounded-xl border border-red-100">⚠️ 客人尚未進入結帳畫面</div>
                    )}

                    {order.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button onClick={() => handleStatusChange(order.id, 'confirmed')} className="bg-green-600 text-white font-bold py-2 rounded-xl text-sm hover:bg-green-700 shadow-sm transition-all hover:-translate-y-0.5">✅ 確認接單</button>
                        <button onClick={() => handleStatusChange(order.id, 'cancelled')} className="bg-stone-200 text-stone-600 font-bold py-2 rounded-xl text-sm hover:bg-stone-300 shadow-sm transition-all hover:-translate-y-0.5">❌ 婉拒/滿檔</button>
                      </div>
                    )}
                    {order.status === 'confirmed' && (
                       <button onClick={() => handleStatusChange(order.id, 'cancelled')} className="w-full text-stone-400 font-bold py-2 rounded-xl text-xs hover:text-red-500 mt-2 transition-colors">撤銷並改為作廢</button>
                    )}
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}