import React, { useState } from 'react';
import { Download, ExternalLink, Smartphone, Tent, Info, ChevronDown } from 'lucide-react';

// FAQ 折疊組件
const AccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="border border-stone-200 rounded-2xl overflow-hidden mb-4 bg-white shadow-sm hover:shadow-md transition-all">
      <button className="w-full flex justify-between items-center p-6 text-left focus:outline-none" onClick={onClick}>
        <span className="font-bold text-lg text-stone-800">{title}</span>
        <ChevronDown className={`text-orange-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-6 pt-0 text-stone-600 leading-relaxed border-t border-stone-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function GuidePage() {
  const [openAccordion, setOpenAccordion] = useState(0);

  const LINKS = {
    appStore: "https://apps.apple.com/app/id1668213216", 
    googlePlay: "https://play.google.com/store/apps/details?id=cmsp.bedincar&pcampaignid=web_share",
    article: "https://www.sportytravellers.com/asia/the-perfect-taiwan-road-trip-in-15-days/"
  };

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-3">Travel Guide</h2>
          <p className="text-stone-500">讓您的旅程更智慧、更豐富的必備攻略</p>
        </div>

        {/* 1. APP 推薦保留不變 */}
        <div className="bg-stone-900 rounded-[2.5rem] p-8 md:p-14 mb-16 text-white relative overflow-hidden shadow-2xl group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-[150px] opacity-20 -mr-20 -mt-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-700"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-10 -ml-20 -mb-20 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left max-w-xl flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 text-orange-300 shadow-sm">
                <Smartphone size={14} /> Official App
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                下載 CampingTour <br/>官方 APP
              </h2>
              <p className="text-stone-300 text-lg mb-10 leading-relaxed font-light">
                解鎖更多隱藏泊點、即時車況監控，以及會員專屬優惠。<br className="hidden md:block"/>
                讓您的車泊旅程更智慧、更便利。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href={LINKS.appStore} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white text-stone-900 px-6 py-4 rounded-xl hover:bg-stone-200 transition-all font-bold shadow-lg hover:-translate-y-1 group/btn">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg" alt="Download CampingTour App on Apple App Store" className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase leading-none text-stone-500">Download on the</div>
                    <div className="text-sm leading-none mt-1">App Store</div>
                  </div>
                </a>
                <a href={LINKS.googlePlay} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-stone-800 border border-stone-700 text-white px-6 py-4 rounded-xl hover:bg-stone-700 transition-all font-bold shadow-lg hover:-translate-y-1 group/btn">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Get CampingTour App on Google Play Store" className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase leading-none text-stone-400">Get it on</div>
                    <div className="text-sm leading-none mt-1">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="flex-1 flex justify-center md:justify-end relative">
               <div className="relative bg-stone-800 p-3 rounded-[3rem] border-8 border-stone-800 shadow-2xl transform rotate-[-6deg] hover:rotate-0 transition-transform duration-700 w-[260px] md:w-[280px]">
                  <div className="bg-stone-900 rounded-[2.5rem] h-[480px] flex flex-col items-center justify-center relative overflow-hidden border border-stone-700">
                     <div className="absolute inset-0 bg-gradient-to-b from-stone-800/50 to-stone-900"></div>
                     <div className="relative z-10 flex flex-col items-center gap-5">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center shadow-lg mb-2"><Tent size={48} className="text-white"/></div>
                        <span className="text-2xl font-serif font-bold text-white tracking-wide">BedInCar</span>
                     </div>
                     <div className="absolute bottom-6 w-32 h-1.5 bg-stone-700 rounded-full"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* 2. 露營車使用須知 (完整雙語版 Accordion 區塊) */}
        <div className="mb-16">
          <div className="text-center mb-10">
              <h3 className="text-3xl font-serif font-bold text-stone-900 mb-3 flex items-center justify-center gap-3"><Info className="text-orange-500"/> Campervan Guidelines</h3>
              <p className="text-stone-500">出發前必看的用車注意事項 / Please read before your trip</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* 取還車規定 */}
            <AccordionItem title="📍 取車與還車規定 Pick-up & Drop-off" isOpen={openAccordion === 0} onClick={() => setOpenAccordion(openAccordion === 0 ? -1 : 0)}>
              <ul className="space-y-4">
                <li>
                  <span className="font-bold text-stone-800">時間 Time：</span>09:00-10:00 AM / 17:30-19:00 PM
                  <p className="text-sm text-stone-500 mt-1">⚠️ 非上述時段恕不提供取車或還車服務。取車前請預留 30-60 分鐘做車子的操作教學。</p>
                  <p className="text-sm text-stone-500">Pick-up and drop-off services are not available outside these hours. Please set aside 30-60 minutes for a basic instruction session before pick-up.</p>
                </li>
                <li>
                  <span className="font-bold text-stone-800">地點 Location：</span>北投奇岩捷運站 2 號出口 (抵達後將安排接駁車至車輛所在地)
                  <p className="text-sm text-stone-500 mt-1">Qiyan MRT Station Exit 2. Once you arrive, we will arrange a shuttle to take you to the vehicle location.</p>
                </li>
                <li>
                  <span className="font-bold text-stone-800">逾時政策 Late Policy：</span>若無法準時取車，請於 12 小時前通知。若未通知且遲到超過 30 分鐘，每 30 分鐘收取 NT$200 違約金 (首小時 NT$300 起，最高 NT$1,500)。
                  <p className="text-sm text-stone-500 mt-1">If you are unable to pick up the vehicle at the scheduled time, please notify us at least 12 hours in advance. If no prior notice is given and you are more than 30 minutes late, a late fee of NT$200 will be deducted from the deposit for every 30 minutes of delay (starting at NT$300 for the first hour, max NT$1,500).</p>
                </li>
                <li>
                  <span className="font-bold text-stone-800">延後還車 Overtime Return：</span>延後還車每超過 1 小時需支付 NT$300，超過 6 小時將收取 1 日租金。如欲續租，請在還車時間前 12 小時前告知。
                  <p className="text-sm text-stone-500 mt-1">You will be charged NT$300 for each delayed return of the car for more than 1 hour. If the return time exceeds 6 hours, you will be charged a day's overtime fee. If you want to renew the lease, please inform us 12 hours before the return time.</p>
                </li>
              </ul>
            </AccordionItem>

            {/* 電力與冷氣使用 */}
            <AccordionItem title="⚡ 電力與冷氣使用 Power & A/C Usage Tips" isOpen={openAccordion === 1} onClick={() => setOpenAccordion(openAccordion === 1 ? -1 : 1)}>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-4">
                <span className="font-bold text-orange-800 block">🔋 外接電池請全程保持開啟，車輛在行駛中才能進行充電。</span>
                <span className="text-sm text-orange-700">Keep the external battery switched ON at all times during your trip so the vehicle can charge it while driving.</span>
              </div>
              <ul className="space-y-4">
                <li>
                  <span className="font-bold text-stone-800">冷氣與電量 A/C and Battery Usage：</span>電池滿電時，冷氣設定 27–28°C 並搭配風扇使用，可支撐約 8 小時。
                  <p className="text-sm text-stone-500 mt-1">When fully charged, with the A/C set to 27–28°C (80–82°F) and used with a fan, the battery can last for about 8 hours.</p>
                </li>
                <li>
                  <span className="font-bold text-stone-800">行車充電 Driving Charge：</span>行車充電速率約每小時 4% 電量，等於差不多可再支撐冷氣半小時。僅靠行車充電無法長期維持整晚冷氣。
                  <p className="text-sm text-stone-500 mt-1">Charging while driving: The battery can recover about 4% per hour, which roughly allows the air conditioner to run an additional half hour. Driving alone is not sufficient to fully offset the AC’s energy consumption.</p>
                </li>
                <li>
                  <span className="font-bold text-stone-800">營區補電 Campsite Charging：</span>若每天晚上都想吹整晚冷氣，請務必在出發前將電池充滿，並規劃每 2–3 天進一次有插座的營區補電。若因個人用電習慣導致電池用盡，請自行負責。
                  <p className="text-sm text-stone-500 mt-1">If you plan to run the air conditioner every night, please make sure the battery is fully charged before departure, and plan to recharge at a campsite with power every 2–3 days. If the battery is drained due to your personal usage habits, you will be responsible.</p>
                </li>
              </ul>
            </AccordionItem>

            {/* 車體限制與里程 */}
            <AccordionItem title="🚐 車體限制與里程 Mileage & Vehicle Specs" isOpen={openAccordion === 2} onClick={() => setOpenAccordion(openAccordion === 2 ? -1 : 2)}>
              <ul className="space-y-4">
                <li>
                  <span className="font-bold text-stone-800">車輛總高度限制 Vehicle Height：</span>210 公分 (含車邊帳)。請務必注意地下道與停車場的高度限制，避免碰撞。
                  <p className="text-sm text-stone-500 mt-1">Including side awning: 210 cm. Please pay attention to height restrictions in underpasses and parking structures.</p>
                </li>
                <li>
                  <span className="font-bold text-stone-800">車內空間高度提醒 Interior Height Advisory：</span>由於我們的露營車內部空間有限，若您的身高超過 190 公分，可能會感到駕駛座或車內活動空間較為侷促。
                  <p className="text-sm text-stone-500 mt-1">Due to the limited interior space of our campervan, guests who are taller than 190 cm (6'3") may find the driver’s seat and cabin space tight or less comfortable.</p>
                </li>
                <li>
                  <span className="font-bold text-stone-800">每日行駛里程限制 Daily Mileage Limit：</span>每日 (24H) 限行里程數為 300 公里。超過 300 公里後，每公里將會向您收取 8 元的保養費用。
                  <p className="text-sm text-stone-500 mt-1">The daily (24H) mileage limit is 300 kilometers. For mileage exceeding 300 km per day, a maintenance fee of NT$8 per kilometer will be charged.</p>
                </li>
              </ul>
            </AccordionItem>

            {/* 設備整潔與自然體驗 */}
            <AccordionItem title="🛏️ 設備整潔與自然體驗 Experience & Equipment" isOpen={openAccordion === 3} onClick={() => setOpenAccordion(openAccordion === 3 ? -1 : 3)}>
              <div className="space-y-4 text-stone-600">
                <p>
                  <span className="font-bold text-stone-800 block">貼近自然的露營體驗 Authentic Nature Experience：</span>
                  我們露營車所提供的寢具與相關設備皆為固定之標準配置。如您有個人舒適度需求，建議自行攜帶。本服務不適合對設備細節有高度客製或完美主義期待的旅客。
                  <span className="block text-sm text-stone-500 mt-1">Campervan bedding and equipment are standard and fixed. This service focuses on an authentic, nature-based campervan experience and is not suitable for perfectionists or those expecting highly customized equipment.</span>
                </p>
                <p>
                  <span className="font-bold text-stone-800 block">內裝與設備使用 Interior & Equipment Notice：</span>
                  租用期間請妥善使用車輛及所有設備（含車內裝、座椅、寢具、露營設備、車邊帳等）。歸還時請保持整潔。若車輛或設備髒污、損壞超出正常範圍，將酌收特別清潔或維修費（NT$500–1,500，押金可直接扣除，差額需補足）。
                  <span className="block text-sm text-stone-500 mt-1">During the rental, please properly use all vehicle and equipment. Upon return, ensure that the vehicle and all equipment are clean. If excessively soiled or damaged, a special cleaning or repair fee may apply (NT$500–1,500, deductible from the security deposit).</span>
                </p>
              </div>
            </AccordionItem>
          </div>
        </div>

      </div>
    </div>
  );
}