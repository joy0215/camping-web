import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Car, Zap, ChevronDown } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  // 為了確保圖片路徑正確，建議直接寫死或引入
  const IMAGES = {
    hero: "/images/vibe-drive.jpg", // 您的首頁大圖
    logoStack: "/images/logo-stack.jpg"
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={IMAGES.hero} 
            alt="Camping Hero" 
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            onError={(e) => e.target.src='https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80'}
          />
          <div className="absolute inset-0 bg-stone-900/30"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto mt-10">
          <div className="mb-6 flex justify-center">
            <img 
              src={IMAGES.logoStack} 
              alt="Logo" 
              className="w-24 h-24 rounded-2xl shadow-2xl invert opacity-90"
              onError={(e) => e.target.style.display='none'}
            />
          </div>
          <p className="text-orange-400 font-medium tracking-[0.3em] mb-4 uppercase animate-fade-in">
            Explore Taiwan Your Way
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight drop-shadow-xl animate-fade-in delay-100">
            車泊輕旅<br />
            <span className="text-3xl md:text-5xl font-light mt-2 block opacity-90">CampingTour Taiwan</span>
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in delay-200">
            <button 
              onClick={() => navigate('/booking')} 
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg flex items-center justify-center gap-2 hover:-translate-y-1"
            >
              立即預約 Booking <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => navigate('/plans')} 
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-full font-medium transition-all hover:-translate-y-1"
            >
              車型介紹 Vehicles
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/70">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            
            <div className="p-6 group hover:bg-white rounded-3xl transition-colors hover:shadow-lg">
              <Car size={40} className="text-orange-600 mx-auto mb-6 transform group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2 text-stone-800">輕鬆駕駛</h3>
              <p className="text-sm font-bold text-orange-500 mb-4 uppercase tracking-wider">Easy to Drive</p>
              <p className="text-stone-600 leading-relaxed">
                自用小客車駕照即可駕駛，車體輕巧靈活。<br/>
                Standard driver's license accepted.
              </p>
            </div>

            <div className="p-6 group hover:bg-white rounded-3xl transition-colors hover:shadow-lg">
              <MapPin size={40} className="text-orange-600 mx-auto mb-6 transform group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2 text-stone-800">隨停隨宿</h3>
              <p className="text-sm font-bold text-orange-500 mb-4 uppercase tracking-wider">Sleep Anywhere</p>
              <p className="text-stone-600 leading-relaxed">
                不用搭帳篷，打開車門就是大自然。<br/>
                No tent needed, nature is at your door.
              </p>
            </div>

            <div className="p-6 group hover:bg-white rounded-3xl transition-colors hover:shadow-lg">
              <Zap size={40} className="text-orange-600 mx-auto mb-6 transform group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2 text-stone-800">電力充足</h3>
              <p className="text-sm font-bold text-orange-500 mb-4 uppercase tracking-wider">Full Power</p>
              <p className="text-stone-600 leading-relaxed">
                配備駐車冷氣與大容量電池，舒適過夜。<br/>
                AC & large battery included.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}