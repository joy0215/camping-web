import { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { CreditCard, Eraser, CheckCircle, Lock } from 'lucide-react';

export default function SignaturePage() {
  const sigPad = useRef({});
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // 1. 信用卡號狀態
  const [cardNumber, setCardNumber] = useState('');

  // 2. 從上一頁接收資料
  const { order, user, amount } = location.state || {};

  useEffect(() => {
    if (!order) {
      alert('⚠️ 無效的訂單路徑，請重新預約');
      navigate('/');
    }
  }, [order, navigate]);

  const clearSig = () => {
    sigPad.current.clear();
  };

  const handleSubmit = async () => {
    // A. 驗證是否有簽名
    if (sigPad.current.isEmpty()) {
      alert('❌ 請先簽名 (Please sign first)');
      return;
    }
    // B. 驗證卡號
    if (cardNumber.length < 16) {
      alert('❌ 請輸入完整 16 碼信用卡號');
      return;
    }

    setLoading(true);

    try {
      // C. 取得簽名圖片 (修正重點：改用 getCanvas() 避開套件 Bug)
      // 原本是 getTrimmedCanvas() 會導致 Vite 報錯
      const signatureData = sigPad.current.getCanvas().toDataURL('image/png');

      // 送出 PDF 生成請求給後端
      const response = await axiosClient.post('/pdf/generate', {
        orderId: order.id, // 👈 這一行絕對不能漏掉！！！
        guestName: formData.cardholderName,
        cardNumber: formData.cardNumber,
        amount: amount,
        signature: signatureData
      });

      alert('🎉 簽署成功！\n授權書已傳送至系統，我們將盡快審核您的訂單。');
      navigate('/'); 

    } catch (error) {
      console.error('Signature Error:', error);
      alert('❌ 傳送失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 max-w-lg w-full mx-4">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">信用卡授權簽署</h2>
          <p className="text-stone-500 text-sm">Credit Card Authorization</p>
        </div>

        {/* 訂單摘要 */}
        <div className="bg-stone-50 p-4 rounded-xl mb-6 text-sm text-stone-600 space-y-2 border border-stone-200">
          <div className="flex justify-between"><span>訂單編號：</span><span className="font-bold">#{order.id}</span></div>
          <div className="flex justify-between"><span>承租人：</span><span className="font-bold">{user.name}</span></div>
          <div className="flex justify-between"><span>授權金額：</span><span className="font-bold text-orange-600 text-lg">NT$ {amount.toLocaleString()}</span></div>
        </div>

        {/* 信用卡輸入 */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
            <CreditCard size={18}/> 信用卡號 Card Number
          </label>
          <input 
            type="text" 
            placeholder="0000-0000-0000-0000"
            maxLength="19"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
            className="w-full p-3 border border-stone-300 rounded-xl text-center tracking-widest text-lg outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-xs text-stone-400 mt-2 flex items-center gap-1 justify-center">
            <Lock size={12}/> 資料將直接加密寫入 PDF，不儲存於資料庫
          </p>
        </div>

        {/* 簽名板區域 */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-stone-700 mb-2">請在此簽名 Signature</label>
          <div className="border-2 border-dashed border-stone-300 rounded-xl bg-stone-50 overflow-hidden touch-none relative">
            <SignatureCanvas 
              ref={sigPad}
              penColor="black"
              canvasProps={{
                width: 320, 
                height: 200, 
                className: 'mx-auto' 
              }} 
            />
            <button 
              onClick={clearSig}
              className="absolute top-2 right-2 text-stone-400 hover:text-red-500 bg-white rounded-full p-1 shadow-sm"
              title="Clear"
            >
              <Eraser size={16}/>
            </button>
          </div>
          <p className="text-xs text-stone-400 mt-2 text-center">請使用手指或滑鼠簽名</p>
        </div>

        {/* 送出按鈕 */}
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${loading ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-orange-600'}`}
        >
          {loading ? '處理中 Processing...' : <><CheckCircle size={20}/> 確認簽署並送出</>}
        </button>

      </div>
    </div>
  );
}