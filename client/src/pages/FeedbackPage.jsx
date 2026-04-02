import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, UploadCloud, CheckCircle, Image as ImageIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../api/axiosClient';

export default function FeedbackPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 🌟 因為有圖片，所以必須用 FormData 格式傳送給後端
      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('rating', rating);
      formData.append('comment', comment);
      if (photo) {
        formData.append('photo', photo);
      }

      // 假設後端接收評價的 API 是 /feedback
      await axiosClient.post('/feedback', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsSuccess(true);
      setTimeout(() => navigate('/'), 3000); // 3秒後導回首頁

    } catch (error) {
      console.error('Feedback submission failed:', error);
      alert(`❌ ${t('feedback.error')}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 pt-24 text-center">
        <CheckCircle size={80} className="text-green-500 mb-6 animate-bounce" />
        <h2 className="text-3xl font-bold text-stone-900 mb-2">{t('feedback.success')}</h2>
        <p className="text-stone-500">Redirecting to homepage...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-stone-100 max-w-xl w-full mx-4">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">{t('feedback.title')}</h2>
          <p className="text-stone-500">{t('feedback.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="bg-stone-50 p-4 rounded-xl text-center border border-stone-200">
            <span className="text-sm font-bold text-stone-500 block mb-1">{t('feedback.orderId')}</span>
            <span className="font-bold text-orange-600 text-lg">#{orderId || 'DEMO-123'}</span>
          </div>

          {/* Star Rating */}
          <div className="text-center">
            <label className="block text-sm font-bold text-stone-700 mb-3">{t('feedback.rating')}</label>
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((star, index) => {
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

          {/* Comment Area */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">{t('feedback.comment')}</label>
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('feedback.commentPh')}
              className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-stone-50 resize-none"
            ></textarea>
          </div>

          {/* Photo Upload Area */}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">{t('feedback.photo')}</label>
            
            {!preview ? (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-stone-300 border-dashed rounded-2xl cursor-pointer bg-stone-50 hover:bg-orange-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud size={40} className="text-orange-500 mb-3" />
                  <p className="text-sm text-stone-600 font-bold mb-1">Click to upload photo</p>
                  <p className="text-xs text-stone-400">{t('feedback.photoHint')}</p>
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            ) : (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-stone-200 shadow-inner">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={clearPhoto}
                  className="absolute top-3 right-3 bg-white text-red-500 p-1.5 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${isSubmitting ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-orange-600 hover:-translate-y-1'}`}
          >
            {isSubmitting ? t('feedback.btnSubmitting') : t('feedback.btnSubmit')}
          </button>
        </form>

      </div>
    </div>
  );
}