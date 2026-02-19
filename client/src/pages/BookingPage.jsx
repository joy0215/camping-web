import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, MapPin, Zap, Info, MessageCircle, Phone } from 'lucide-react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function BookingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const [blockedDates, setBlockedDates] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const QR_IMAGES = {
    line: "/images/qr-line.jpg",
    whatsapp: "/images/qr-whatsapp.jpg"
  };

  const PRICES = {
    dailyRate: 3700,
    addons: { mattress: 500, blanket: 200, cookware: 200 }
  };

  const [addons, setAddons] = useState({
    mattress: false, blanket: false, cookware: false
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchBlockedDates = async () => {
      try {
        const response = await axiosClient.get('/inquiry/blocked-dates');
        const dates = response.data.map(d => new Date(d));
        setBlockedDates(dates);
      } catch (error) {
        console.error("無法取得滿檔日期", error);
      }
    };
    fetchBlockedDates();
  }, []);

  const formatForBackend = (date) => {
    if (!date) return '';
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  };

  // ✅ 核心修正：監聽日曆點擊事件，阻止跨越滿檔日
  const handleDateChange = (update) => {
    const [newStart, newEnd] = update;

    // 當客人點了第二下 (還車日) 時，立刻檢查整個區間
    if (newStart && newEnd) {
      let isOverlap = false;
      let current = new Date(newStart);
      
      while (current <= newEnd) {
        const formattedCurrent = formatForBackend(current);
        // 檢查每一天有沒有踩到地雷 (blockedDates)
        if (blockedDates.some(bd => formatForBackend(bd) === formattedCurrent)) {
          isOverlap = true; 
          break;
        }
        current.setDate(current.getDate() + 1);
      }

      if (isOverlap) {
        alert("⚠️ 抱歉！您選擇的區間包含了「已滿檔」的日期，無法連續預約。\n請避開灰色日期重新選擇！");
        // 發現撞期，保留取車日，但把還車日彈掉，逼他重選
        setDateRange([newStart, null]);
        return; 
      }
    }

    // 沒撞期才允許設定範圍
    setDateRange(update);
  };

  const handleAddonChange = (e) => {
    setAddons({ ...addons, [e.target.name]: e.target.checked });
  };

  const calculateDaysAndTotal = () => {
    let days = 0;
    let total = 0;
    
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (days > 0) {
        total = days * PRICES.dailyRate;
        if (addons.mattress) total += PRICES.addons.mattress;
        if (addons.blanket) total += PRICES.addons.blanket;
        if (addons.cookware) total += PRICES.addons.cookware;
      }
    }
    return { days, total };
  };

  const { days: totalDays, total: estimatedTotal } = calculateDaysAndTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('🔒 請先登入會員才能預約喔！');
      navigate('/login');
      return;
    }

    if (!startDate || !endDate || estimatedTotal === 0) {
      alert('❌ 請在日曆上選擇完整的「取車」與「還車」日期區間！');
      return;
    }

    try {
      const response = await axiosClient.post('/inquiry', {
        startDate: formatForBackend(startDate),
        endDate: formatForBackend(endDate),
        addons: addons,
        estimatedPrice: estimatedTotal
      });
      
      const orderData = response.data.inquiry;
      alert('✅ 訂單已建立！\n請前往下一步完成「信用卡授權簽署」。');
      navigate(`/signature/${orderData.id}`, { 
        state: { order: orderData, user: user, amount: estimatedTotal } 
      });
    } catch (error) {
      console.error('送單失敗:', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error);
        setDateRange([null, null]);
      } else {
        alert('❌ 送出失敗，請檢查網路或稍後再試');
      }
    }
  };

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">預約詢價 Booking</h2>
          <p className="text-stone-600">選擇日期，開啟您的冒險旅程</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start">
          
          <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-stone-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4">
              <Calendar className="text-orange-600" /> 選擇租車區間
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="flex flex-col items-center bg-stone-50 p-6 rounded-2xl border border-stone-200">
                <p className="text-sm font-bold text-stone-700 mb-4 self-start">請點擊選擇「取車」與「還車」日期 (灰底為滿檔)</p>
                <div className="w-full overflow-x-auto flex justify-center pb-2 custom-datepicker-wrapper">
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleDateChange} // ✅ 套用新的檢查邏輯
                    minDate={new Date()} 
                    excludeDates={blockedDates} 
                    monthsShown={window.innerWidth > 768 ? 2 : 1} 
                    inline 
                    dateFormat="yyyy/MM/dd"
                  />
                </div>
                
                <div className="w-full mt-4 flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <div className="text-center flex-1 border-r border-stone-100">
                    <span className="block text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">取車 Start</span>
                    <span className="font-bold text-stone-800">{startDate ? formatForBackend(startDate) : '尚未選擇'}</span>
                  </div>
                  <div className="text-center flex-1">
                    <span className="block text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">還車 End</span>
                    <span className="font-bold text-orange-600">{endDate ? formatForBackend(endDate) : '尚未選擇'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-4">加購配備 Optional Add-ons</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${addons.mattress ? 'border-orange-500 bg-orange-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                    <input type="checkbox" name="mattress" checked={addons.mattress} onChange={handleAddonChange} className="w-5 h-5 accent-orange-600" />
                    <div className="flex flex-col">
                        <span className="font-bold text-stone-800">雙人充氣睡墊</span>
                        <span className="text-xs text-orange-600 font-bold">+ NT$ 500</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${addons.blanket ? 'border-orange-500 bg-orange-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                    <input type="checkbox" name="blanket" checked={addons.blanket} onChange={handleAddonChange} className="w-5 h-5 accent-orange-600" />
                    <div className="flex flex-col">
                        <span className="font-bold text-stone-800">保暖毛毯</span>
                        <span className="text-xs text-orange-600 font-bold">+ NT$ 200</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${addons.cookware ? 'border-orange-500 bg-orange-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                    <input type="checkbox" name="cookware" checked={addons.cookware} onChange={handleAddonChange} className="w-5 h-5 accent-orange-600" />
                    <div className="flex flex-col">
                        <span className="font-bold text-stone-800">多功能鍋具組</span>
                        <span className="text-xs text-orange-600 font-bold">+ NT$ 200</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-stone-900 p-6 rounded-2xl text-white flex flex-col md:flex-row justify-between items-center shadow-lg">
                <div className="mb-2 md:mb-0">
                    <span className="block text-stone-400 text-sm mb-1">預估租金 Total Estimate ({totalDays} 天)</span>
                    <span className="text-xs text-stone-500">實際金額以專員報價為準</span>
                </div>
                <span className="text-3xl font-bold text-orange-500">NT$ {estimatedTotal.toLocaleString()}</span>
              </div>

              <button 
                type="submit" 
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                {user ? '確認區間並詢價 Submit Inquiry' : '請先登入 Login First'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-xl border-t-4 border-green-500">
              <h3 className="text-xl font-bold text-stone-900 mb-6 text-center">Contact Us 聯繫我們</h3>
              <div className="space-y-6">
                <div className="text-center p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="flex items-center justify-center gap-2 font-bold text-[#06C755] mb-2"><MessageCircle size={20}/> Line@ Official</div>
                  <img src={QR_IMAGES.line} alt="Line QR" className="w-32 h-32 mx-auto mix-blend-multiply mb-3"/>
                  <a href="https://line.me/ti/p/@626twiqy" target="_blank" rel="noreferrer" className="block w-full bg-[#06C755] hover:bg-[#05b34c] text-white text-sm font-bold py-2 rounded-lg transition-colors shadow-md">加入 Line 好友</a>
                </div>
                <div className="text-center p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="flex items-center justify-center gap-2 font-bold text-[#25D366] mb-2"><Phone size={20}/> WhatsApp</div>
                  <img src={QR_IMAGES.whatsapp} alt="WhatsApp QR" className="w-32 h-32 mx-auto mix-blend-multiply mb-3"/>
                  <a href="https://wa.me/886965720586" target="_blank" rel="noreferrer" className="block w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold py-2 rounded-lg transition-colors shadow-md">Open WhatsApp</a>
                </div>
              </div>
            </div>

            <div className="bg-stone-100 text-stone-600 p-6 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-stone-800 text-lg mb-4 flex items-center gap-2"><Info size={20} className="text-stone-500"/> 訂車須知 Note</h4>
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

      <style dangerouslySetInnerHTML={{__html: `
        .custom-datepicker-wrapper .react-datepicker {
          font-family: inherit;
          border: none;
          background-color: transparent;
        }
        .react-datepicker__header {
          background-color: transparent;
          border-bottom: 1px solid #e7e5e4;
          padding-top: 1rem;
        }
        .react-datepicker__current-month {
          font-weight: 700;
          color: #1c1917;
          margin-bottom: 0.5rem;
        }
        .react-datepicker__day-name {
          color: #a8a29e;
          font-weight: bold;
        }
        .react-datepicker__day {
          border-radius: 9999px;
          transition: all 0.2s;
          color: #44403c;
          outline: none;
        }
        .react-datepicker__day:hover:not(.react-datepicker__day--disabled) {
          background-color: #ffedd5;
          color: #ea580c;
        }
        .react-datepicker__day--selected, 
        .react-datepicker__day--in-selecting-range, 
        .react-datepicker__day--in-range {
          background-color: #ea580c !important;
          color: white !important;
          font-weight: bold;
        }
        .react-datepicker__day--keyboard-selected {
          background-color: transparent;
        }
        .react-datepicker__day--disabled {
          color: #d6d3d1;
          background-image: linear-gradient(45deg, transparent 45%, #e7e5e4 45%, #e7e5e4 55%, transparent 55%);
          cursor: not-allowed;
        }
        .react-datepicker__month-container {
          margin: 0 10px;
        }
        .react-datepicker__navigation-icon::before {
          border-color: #a8a29e;
        }
        .react-datepicker__navigation:hover *::before {
          border-color: #ea580c;
        }
      `}} />
    </div>
  );
}