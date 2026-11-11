import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { CreditCard, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next'; 

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Extract order ID from URL params
  const { t } = useTranslation(); 
  
  const [loading, setLoading] = useState(false);
  const [payData, setPayData] = useState(null);
  const formRef = useRef(null);
  
  // Dynamic state: use data passed from booking page if available, else null
  const [orderData, setOrderData] = useState(location.state?.order || null);
  const [orderAmount, setOrderAmount] = useState(location.state?.amount || null);

  useEffect(() => {
    // Core logic: fetch order data from backend if accessed via direct URL (no state)
    if (!orderData && id) {
      axiosClient.get(`/inquiry/${id}`)
        .then(res => {
          setOrderData(res.data);
          setOrderAmount(res.data.total_price);
        })
        .catch(err => {
          alert('Order not found or expired');
          navigate('/');
        });
    }
  }, [id, orderData, navigate]);

  // Automatically submit the hidden form once payData is received from backend
  useEffect(() => {
    if (payData && formRef.current) {
      formRef.current.submit();
    }
  }, [payData]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Fix: Force conversion to integer to avoid NewebPay "numeric format only" error
      const finalAmount = Math.round(Number(orderAmount));

      const response = await axiosClient.post('/payment/create-payment', {
        orderId: orderData.id,
        amount: finalAmount,
        // Provide default email if external guest accesses via URL without login
        email: location.state?.user?.email || 'guest@camping-tour.com' 
      });

      if (response.data.success) {
        setPayData(response.data.payData);
      } else {
        alert('Error creating payment parameters.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Connection failed.');
      setLoading(false);
    }
  };

  // Show loading state while fetching order data from database
  if (!orderData) {
    return <div className="min-h-screen pt-32 text-center text-stone-500">Loading Order Details...</div>;
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 md:pt-28 pb-20 px-4 flex justify-center">
      <div className="w-full max-w-lg">
        
        {/* Header Section */}
        <div className="mb-8">
          <p className="eyebrow mb-3" dir="ltr">Order #{orderData.id}</p>
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-stone-900 tracking-tight">{t('checkout.title', 'Secure Checkout')}</h2>
        </div>

        {/* Amount Summary Card */}
        <div className="bg-white rounded-md p-6 md:p-8 border border-stone-200 mb-6">
          <p className="text-sm font-semibold text-stone-400 mb-2">{t('checkout.amountTitle', 'Total Amount')}</p>
          <p className="text-4xl md:text-5xl font-serif font-medium text-stone-900 mb-8" dir="ltr">
            NT$ {Number(orderAmount).toLocaleString()}
          </p>

          <div className="space-y-4 text-sm text-stone-600 border-t border-stone-200 pt-6">
             <div className="flex justify-between items-center">
                <span className="font-semibold text-stone-400">{t('checkout.method', 'Payment Method')}</span>
                <span className="font-semibold text-stone-800">Credit Card (NewebPay)</span>
             </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="flex gap-4 text-stone-700 p-4 rounded-md mb-8 border border-stone-200">
          <ShieldCheck size={24} className="shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold mb-1">{t('checkout.secureTitle', '100% Secure Payment')}</p>
            <p className="text-stone-500">{t('checkout.secureDesc', 'Your payment is processed securely by NewebPay. We do not store your card details.')}</p>
          </div>
        </div>

        {/* Payment Button */}
        <button 
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-4 rounded-md font-semibold text-white flex items-center justify-center gap-2 transition-all ${loading ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-stone-700'}`}
        >
          {loading ? t('checkout.btnConnecting', 'Connecting...') : <>{t('checkout.btnPay', 'Proceed to Pay')} <ArrowRight size={20} className="rtl:rotate-180"/></>}
        </button>
        
        <p className="text-xs text-stone-400 mt-4 text-center flex items-center justify-center gap-1">
          <Lock size={12}/> Secured by NewebPay
        </p>

        {/* Hidden Form for NewebPay MPG Gateway Redirection */}
        {payData && (
          <form ref={formRef} action="https://core.newebpay.com/MPG/mpg_gateway" method="POST" className="hidden">
            {/* Note: Comment placed inside form to avoid JSX multiple siblings error in conditional block */}
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