import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, CheckCircle, XCircle, FileText, Phone, Mail, Calendar, Filter, CreditCard } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending'); 

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    // ✅ 檢查後端回傳的 isAdmin 標記（而不是檢查 email）
    if (!user || !user.isAdmin) {
      alert('⚠️ 權限不足，即將返回首頁');
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
      console.error("無法取得訂單", error);
      alert('資料讀取失敗，請確認權限。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const actionName = newStatus === 'confirmed' ? '✅ 確認接單' : '❌ 婉拒/取消訂單';
    if (!window.confirm(`您確定要 ${actionName} 嗎？`)) return;

    try {
      await axiosClient.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders(); 
    } catch (error) {
      alert('更新失敗，請稍後再試。');
    }
  };

  if (isLoading) return <div className="pt-32 text-center text-stone-500 font-bold animate-pulse">連線至戰情室中...</div>;

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length;

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  return (
    <div className="pt-28 pb-20 bg-stone-100 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 flex items-center gap-3">
              <ShieldCheck className="text-red-600" size={36} />
              老闆專屬戰情室 (Admin Panel)
            </h2>
            <p className="text-stone-500 mt-2">在這裡管理您的所有訂單與藍新金流對帳。</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-orange-100 border border-orange-200 px-6 py-3 rounded-xl text-center shadow-sm">
              <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">待審核 新訂單</div>
              <div className="text-2xl font-bold text-orange-700">{pendingCount} 筆</div>
            </div>
            <div className="bg-green-100 border border-green-200 px-6 py-3 rounded-xl text-center shadow-sm">
              <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">已確認 出車</div>
              <div className="text-2xl font-bold text-green-700">{confirmedCount} 趟</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilterStatus('pending')} className={`px-5 py-2 rounded-full font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${filterStatus === 'pending' ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 hover:bg-stone-200'}`}><Filter size={16}/> 待處理 ({pendingCount})</button>
          <button onClick={() => setFilterStatus('confirmed')} className={`px-5 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${filterStatus === 'confirmed' ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 hover:bg-stone-200'}`}>✅ 已確認接單</button>
          <button onClick={() => setFilterStatus('cancelled')} className={`px-5 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${filterStatus === 'cancelled' ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 hover:bg-stone-200'}`}>❌ 已取消/婉拒</button>
          <button onClick={() => setFilterStatus('all')} className={`px-5 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${filterStatus === 'all' ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 hover:bg-stone-200'}`}>全部顯示</button>
        </div>

        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20 text-stone-400 bg-white rounded-2xl shadow-sm border border-stone-200">
              <FileText size={48} className="mx-auto mb-4 opacity-20" />
              <p>這個分類目前沒有任何訂單喔！</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${order.status === 'cancelled' ? 'border-stone-200 opacity-75' : 'border-stone-200'}`}>
                
                <div className={`px-6 py-3 flex justify-between items-center text-white ${
                  order.status === 'pending' ? 'bg-orange-500' : 
                  order.status === 'confirmed' ? 'bg-green-600' : 'bg-stone-400'
                }`}>
                  <div className="font-bold tracking-wider">訂單編號 #{order.id}</div>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {order.status === 'pending' && <><Clock size={16}/> 等待確認與金流付款</>}
                    {order.status === 'confirmed' && <><CheckCircle size={16}/> 已確認出車</>}
                    {order.status === 'cancelled' && <><XCircle size={16}/> 此訂單已作廢</>}
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  <div className="md:col-span-4 border-r border-stone-100 pr-6">
                    <h4 className="text-xl font-bold text-stone-900 mb-4">{order.user_name}</h4>
                    <div className="space-y-3 text-stone-600 text-sm">
                      <a href={`tel:${order.user_phone}`} className="flex items-center gap-3 hover:text-orange-600 transition-colors bg-stone-50 p-2 rounded-lg"><Phone size={16} className="text-orange-500"/> {order.user_phone}</a>
                      <a href={`mailto:${order.user_email}`} className="flex items-center gap-3 hover:text-orange-600 transition-colors bg-stone-50 p-2 rounded-lg"><Mail size={16} className="text-orange-500"/> {order.user_email}</a>
                    </div>
                  </div>

                  <div className="md:col-span-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
                        <span className="block text-xs text-stone-400 font-bold mb-1">取車日</span>
                        <span className="font-bold text-stone-800">{new Date(order.start_date).toLocaleDateString()}</span>
                      </div>
                      <Calendar className="text-stone-300" />
                      <div className="flex-1 bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
                        <span className="block text-xs text-stone-400 font-bold mb-1">還車日</span>
                        <span className="font-bold text-stone-800">{new Date(order.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right text-stone-500 text-sm">應收總額：<span className={`text-2xl font-bold ${order.status === 'cancelled' ? 'text-stone-400 line-through' : 'text-orange-600'}`}>NT$ {Number(order.total_price).toLocaleString()}</span></div>
                  </div>

                  <div className="md:col-span-3 flex flex-col gap-3">
                    
                    {/* ✅ 全新金流狀態判定 */}
                    {order.merchant_order_no ? (
                      <div className="bg-blue-50 text-blue-700 font-bold py-2 px-3 rounded-xl flex flex-col items-center justify-center gap-1 text-sm border border-blue-200 text-center">
                        <div className="flex items-center gap-1"><CreditCard size={16}/> 藍新金流已立帳</div>
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
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}