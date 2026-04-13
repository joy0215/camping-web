import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { CreditCard, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // 🌟 引入翻譯

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(); // 🌟 啟動翻譯
  const [loading, setLoading] = useState(false);
  const [payData, setPayData] = useState(null);
  const formRef = useRef(null);
  
  const { order, user, amount } = location.state || {};

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  useEffect(() => {
    if (payData && formRef.current) {
      formRef.current.submit();
    }
  }, [payData]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/payment/create-payment', {
        orderId: order.id,
        amount: amount,
        email: user.email
      });

      if (response.data.success) {
        setPayData(response.data.payData);
      } else {
        alert('❌ Error creating payment parameters.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('❌ Connection Error.');
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-stone-100 max-w-lg w-full mx-4 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>

        <div className="text-center mb-8 mt-2">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
            <CreditCard size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">{t('checkout.title')}</h2>
          <p className="text-stone-500 text-sm">{t('checkout.subtitle')}</p>
        </div>

        <div className="bg-stone-50 p-6 rounded-2xl mb-8 text-stone-700 space-y-4 border border-stone-200">
          <div className="flex justify-between items-center pb-4 border-b border-stone-200">
            <span className="text-sm font-bold text-stone-500">{t('checkout.orderId')}</span>
            <span className="font-bold text-stone-900">#{order.id}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-stone-200">
            <span className="text-sm font-bold text-stone-500">{t('checkout.guest')}</span>
            <span className="font-bold text-stone-900">{user.name}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-bold text-stone-500">{t('checkout.total')}</span>
            <span className="font-bold text-orange-600 text-2xl">NT$ {amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-green-50 text-green-700 p-4 rounded-xl mb-8 border border-green-100">
          <ShieldCheck size={24} className="shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold mb-1">{t('checkout.secureTitle')}</p>
            <p className="text-green-600">{t('checkout.secureDesc')}</p>
          </div>
        </div>

        <button 
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${loading ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-orange-600 hover:-translate-y-1 hover:shadow-xl'}`}
        >
          {loading ? t('checkout.btnConnecting') : <>{t('checkout.btnPay')} <ArrowRight size={20}/></>}
        </button>
        
        <p className="text-xs text-stone-400 mt-4 text-center flex items-center justify-center gap-1">
          <Lock size={12}/> Secured by NewebPay
        </p>

        {payData && (
          <form ref={formRef} action="https://core.newebpay.com/MPG/mpg_gateway" method="POST" className="hidden">
            <input type="hidden" name="MerchantID" value={payData.MerchantID} />
            <input type="hidden" name="TradeInfo" value={payData.TradeInfo} />
            <input type="hidden" name="TradeSha" value={payData.TradeSha} />
            <input type="hidden" name="Version" value={payData.Version} />
          </form>
        )}

      </div>
    </div>
  );
}