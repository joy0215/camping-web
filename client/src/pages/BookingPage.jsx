import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, MapPin, Zap, Info, MessageCircle, Phone } from 'lucide-react';

export default function BookingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 1. 定義圖片路徑
  const QR_IMAGES = {
    line: "/images/qr-line.jpg",
    whatsapp: "/images/qr-whatsapp.jpg"
  };

  // 2. 定義價格常數
  const PRICES = {
    dailyRate: 3700, // 每日租金
    addons: {
      mattress: 500, // 雙人充氣睡墊
      blanket: 200,  // 保暖毛毯
      cookware: 200  // 多功能鍋具組
    }
  };

  // 3. 表單狀態
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    addons: {
      mattress: false,
      blanket: false,
      cookware: false
    }
  });

  // 4. 檢查登入狀態
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 5. 處理輸入變更
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // 處理加購項目
      setFormData(prev => ({
        ...prev,
        addons: { ...prev.addons, [name]: checked }
      }));
    } else {
      // 處理日期
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 6. 計算總金額
  const calculateTotal = () => {
    // A. 算天數
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    // 確保結束日期晚於開始日期
    if (end <= start) return 0;

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    // B. 算租金 (天數 * 3700)
    let total = diffDays * PRICES.dailyRate;

    // C. 算加購 (一次性費用)
    if (formData.addons.mattress) total += PRICES.addons.mattress;
    if (formData.addons.blanket) total += PRICES.addons.blanket;
    if (formData.addons.cookware) total += PRICES.addons.cookware;

    return total;
  };

  const totalDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end <= start) return 0;
    return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
  };

  // 7. 送出表單 (關鍵：跳轉到簽名頁)
  const handleSubmit = async (e) => {
    e.preventDefault(); // 防止頁面刷新

    // 檢查登入
    if (!user) {
      alert('🔒 請先登入會員才能預約喔！');
      navigate('/login');
      return;
    }

    // 檢查日期
    const total = calculateTotal();
    if (total === 0) {
      alert('❌ 請選擇正確的日期範圍');
      return;
    }

    try {
      console.log("正在送出訂單...", formData);

      // 呼叫後端 API 建立訂單
      const response = await axiosClient.post('/inquiry', {
        startDate: formData.startDate,
        endDate: formData.endDate,
        addons: formData.addons,
        estimatedPrice: total
      });

      console.log('訂單成功:', response.data);
      
      // 取得後端回傳的訂單資料 (包含 id)
      const orderData = response.data.inquiry;

      alert('✅ 訂單已建立！\n請前往下一步完成「信用卡授權簽署」。');

      // ⚠️ 關鍵：帶著訂單資料跳轉到 SignaturePage
      navigate(`/signature/${orderData.id}`, { 
        state: { 
          order: orderData,      // 訂單編號
          user: user,            // 使用者資料 (名字)
          amount: total          // 總金額
        } 
      });

    } catch (error) {
      console.error('送單失敗:', error);
      alert('❌ 送出失敗，請檢查網路或稍後再試');
    }
  };

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">預約詢價 Booking</h2>
          <p className="text-stone-600">填寫日期，開啟您的冒險旅程</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start">
          
          {/* 左側 (8/12)：預約表單 */}
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4">
              <Calendar className="text-orange-600" /> 選擇日期與加購配備
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 日期選擇 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">取車日期 Start Date</label>
                  <input 
                    type="date" name="startDate" required
                    onChange={handleChange}
                    className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">還車日期 End Date</label>
                  <input 
                    type="date" name="endDate" required
                    onChange={handleChange}
                    className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50"
                  />
                </div>
              </div>

              {/* 加購選項 */}
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-4">加購配備 Optional Add-ons</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.addons.mattress ? 'border-orange-500 bg-orange-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                    <input type="checkbox" name="mattress" onChange={handleChange} className="w-5 h-5 accent-orange-600" />
                    <div className="flex flex-col">
                        <span className="font-bold text-stone-800">雙人充氣睡墊</span>
                        <span className="text-xs text-orange-600 font-bold">+ NT$ 500</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.addons.blanket ? 'border-orange-500 bg-orange-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                    <input type="checkbox" name="blanket" onChange={handleChange} className="w-5 h-5 accent-orange-600" />
                    <div className="flex flex-col">
                        <span className="font-bold text-stone-800">保暖毛毯</span>
                        <span className="text-xs text-orange-600 font-bold">+ NT$ 200</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.addons.cookware ? 'border-orange-500 bg-orange-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                    <input type="checkbox" name="cookware" onChange={handleChange} className="w-5 h-5 accent-orange-600" />
                    <div className="flex flex-col">
                        <span className="font-bold text-stone-800">多功能鍋具組</span>
                        <span className="text-xs text-orange-600 font-bold">+ NT$ 200</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 預估金額顯示 */}
              <div className="bg-stone-900 p-6 rounded-2xl text-white flex flex-col md:flex-row justify-between items-center shadow-lg">
                <div className="mb-2 md:mb-0">
                    <span className="block text-stone-400 text-sm mb-1">預估租金 Total Estimate ({totalDays()} 天)</span>
                    <span className="text-xs text-stone-500">實際金額以專員報價為準</span>
                </div>
                <span className="text-3xl font-bold text-orange-500">NT$ {calculateTotal().toLocaleString()}</span>
              </div>

              <button 
                type="submit" 
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                {user ? '確認送出詢價 Submit Inquiry' : '請先登入 Login First'}
              </button>
            </form>
          </div>

          {/* 右側 (4/12)：QR Code 與聯絡資訊 */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Line & WhatsApp 區塊 */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border-t-4 border-green-500">
              <h3 className="text-xl font-bold text-stone-900 mb-6 text-center">Contact Us 聯繫我們</h3>
              
              <div className="space-y-6">
                {/* Line */}
                <div className="text-center p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="flex items-center justify-center gap-2 font-bold text-[#06C755] mb-2">
                    <MessageCircle size={20}/> Line@ Official
                  </div>
                  <img src={QR_IMAGES.line} alt="Line QR" className="w-32 h-32 mx-auto mix-blend-multiply mb-3"/>
                  <a href="https://line.me/ti/p/@626twiqy" target="_blank" rel="noreferrer" className="block w-full bg-[#06C755] hover:bg-[#05b34c] text-white text-sm font-bold py-2 rounded-lg transition-colors shadow-md">
                    加入 Line 好友
                  </a>
                </div>
                
                {/* WhatsApp */}
                <div className="text-center p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="flex items-center justify-center gap-2 font-bold text-[#25D366] mb-2">
                    <Phone size={20}/> WhatsApp
                  </div>
                  <img src={QR_IMAGES.whatsapp} alt="WhatsApp QR" className="w-32 h-32 mx-auto mix-blend-multiply mb-3"/>
                  <a href="https://wa.me/886965720586" target="_blank" rel="noreferrer" className="block w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold py-2 rounded-lg transition-colors shadow-md">
                    Open WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* 訂車須知 */}
            <div className="bg-stone-100 text-stone-600 p-6 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-stone-800 text-lg mb-4 flex items-center gap-2">
                <Info size={20} className="text-stone-500"/> 訂車須知 Note
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3"><CheckCircle size={16} className="text-orange-500 shrink-0 mt-0.5" /> <span>送出後專員將與您聯繫確認車況。</span></li>
                <li className="flex gap-3"><CheckCircle size={16} className="text-orange-500 shrink-0 mt-0.5" /> <span>訂金為總金額之 50%。</span></li>
                <li className="flex gap-3"><Zap size={16} className="text-orange-500 shrink-0 mt-0.5" /> <span>包含強制險，外籍旅客需加購額外保險。</span></li>
                <li className="flex gap-3"><MapPin size={16} className="text-orange-500 shrink-0 mt-0.5" /> <span>取車地點：台北市北投區大度路一段157-2號。</span></li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}