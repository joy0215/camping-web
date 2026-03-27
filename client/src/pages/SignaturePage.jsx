import { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { CreditCard, Eraser, CheckCircle, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // 🌟 引入翻譯

export default function SignaturePage() {
  const sigPad = useRef({});
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(); // 🌟 啟動翻譯
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const { order, user, amount } = location.state || {};

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  const clearSig = () => {
    sigPad.current.clear();
  };

  const handleSubmit = async () => {
    if (sigPad.current.isEmpty()) {
      alert(`❌ ${t('signature.errSign')}`);
      return;
    }
    if (cardNumber.length < 16) {
      alert(`❌ ${t('signature.errCard')}`);
      return;
    }

    setLoading(true);

    try {
      const signatureData = sigPad.current.getCanvas().toDataURL('image/png');

      await axiosClient.post('/pdf/generate', {
        orderId: order.id, 
        guestName: user.name, 
        cardNumber: cardNumber,
        amount: amount,
        signature: signatureData
      });

      alert(`🎉 ${t('signature.success')}`);
      navigate('/dashboard'); 

    } catch (error) {
      console.error('Signature Error:', error);
      alert('❌ Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 max-w-lg w-full mx-4">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">{t('signature.title')}</h2>
          <p className="text-stone-500 text-sm">{t('signature.subtitle')}</p>
        </div>

        <div className="bg-stone-50 p-4 rounded-xl mb-6 text-sm text-stone-600 space-y-2 border border-stone-200">
          <div className="flex justify-between"><span>{t('signature.orderId')}：</span><span className="font-bold">#{order.id}</span></div>
          <div className="flex justify-between"><span>{t('signature.renter')}：</span><span className="font-bold">{user.name}</span></div>
          <div className="flex justify-between"><span>{t('signature.amount')}：</span><span className="font-bold text-orange-600 text-lg">NT$ {amount.toLocaleString()}</span></div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
            <CreditCard size={18}/> {t('signature.cardNum')}
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
            <Lock size={12}/> {t('signature.cardHint')}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-stone-700 mb-2">{t('signature.signTitle')}</label>
          <div className="border-2 border-dashed border-stone-300 rounded-xl bg-stone-50 overflow-hidden touch-none relative">
            <SignatureCanvas 
              ref={sigPad}
              penColor="black"
              canvasProps={{ width: 320, height: 200, className: 'mx-auto' }} 
            />
            <button 
              onClick={clearSig}
              className="absolute top-2 right-2 text-stone-400 hover:text-red-500 bg-white rounded-full p-1 shadow-sm"
            >
              <Eraser size={16}/>
            </button>
          </div>
          <p className="text-xs text-stone-400 mt-2 text-center">{t('signature.signHint')}</p>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${loading ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-orange-600'}`}
        >
          {loading ? t('signature.btnProcessing') : <><CheckCircle size={20}/> {t('signature.btnSubmit')}</>}
        </button>

      </div>
    </div>
  );
}