import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  // 🇺🇸 英文版字典
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "plans": "Plans & Vehicles",
        "booking": "Booking",
        "guide": "Guide",
        "about": "About Us",
        "terms": "Terms",
        "member": "Member",
        "login": "Login",
        "signup": "Sign Up",
        "logout": "Logout",
        "admin": "Admin Panel"
      },
      "footer": {
        "desc": "Taiwan's premier campervan rental service. Explore Taiwan your way with our fully equipped campervans.",
        "quickLinks": "Quick Links",
        "plans": "Plans",
        "booking": "Booking",
        "guide": "Guide",
        "terms": "Terms",
        "signup": "Sign Up",
        "contact": "Contact",
        "companyInfo": "Company Info",
        "address": "Address",
        "details": "Details",
        "taxId": "Tax ID",
        "rep": "Representative",
        "tel": "TEL",
        "fax": "FAX",
        "rights": "© 2026 CampingTour Taiwan. All Rights Reserved."
      },
      "home": {
        "subtitle": "EXPLORE TAIWAN YOUR WAY",
        "title": "CampingTour",
        "titleEn": "Taiwan Vanlife",
        "btnBooking": "Book Now",
        "btnVehicles": "Our Vehicles",
        "feat1Title": "Easy to Drive",
        "feat1Sub": "Standard License",
        "feat1Desc1": "Drive with a standard car license.",
        "feat1Desc2": "Compact and agile for hidden gems.",
        "feat2Title": "Sleep Anywhere",
        "feat2Sub": "Free Camping",
        "feat2Desc1": "No tedious tent setup required.",
        "feat2Desc2": "Open the door and nature is right there.",
        "feat3Title": "Full Power",
        "feat3Sub": "Off-Grid Ready",
        "feat3Desc1": "Equipped with A/C and high-capacity battery.",
        "feat3Desc2": "For the most comfortable night experience."
      },
      // 🌟 新增：PlansPage 翻譯
      "plans": {
        "badge": "Our Vehicles",
        "title": "Premium Fleet & Plans",
        "model": "Nomad A180",
        "legal": "Legal Campervan",
        "desc": "Our fleet utilizes <strong>brand-new Zhonghua Veryca A180 vehicles</strong>, legally converted into <strong>specialized campervans</strong> that fully comply with local regulations and safety standards. Enjoy a hassle-free and safe vanlife experience.",
        "spec1": "Legal Conversion",
        "spec2": "New Fleet (A180)",
        "spec3": "Car Awning",
        "spec4": "Double Bed",
        "spec5": "AC System",
        "spec6": "300Ah Battery",
        "weekday": "Weekday",
        "weekend": "Weekend",
        "btnCheck": "Check Availability",
        "equipTitle": "Included Equipment",
        "equipSub": "All set for your adventure",
        "equip1": "Bedding (Sleeping Bags x2, Pillows x2)",
        "equip2": "Stove & Pot",
        "equip3": "Power (110V Outlet & Extension Cord)",
        "equip4": "Shower (Folding Bucket & Portable Shower)",
        "equip5": "Table & Chairs",
        "equip6": "Kitchenware",
        "equip7": "Lights (Camp Lights x2, String Lights)",
        "equip8": "Grill Pan",
        "noticeTitle": "Notice",
        "noticeDesc": "Please bring your own personal toiletries (towels, toothbrushes) for hygiene reasons."
      },
      // 🌟 新增：AboutPage 翻譯
      "about": {
        "title": "About CampingTour",
        "subtitle": "OUR STORY",
        "p1": "CampingTour was founded in 2021, specializing in custom campervan conversions, with a mission to promote Taiwan’s vanlife culture. In 2025, we expanded our services to include campervan rentals.",
        "p2": "Our fleet is built using brand-new vehicles, legally converted into Zhonghua Veryca A180 specialized campervans, fully compliant with local regulations and safety standards from the ground up. Combined with a digital booking system and personalized concierge service, we make it easy for every traveler to enjoy the campervan experience.",
        "p3": "We believe the most meaningful moments are not found at the destination, but throughout every journey along the way. Whether you’re chasing the first light at Hehuanshan or listening to the waves along Taiwan’s east coast, CampingTour will be your most reliable and comfortable home on the road.",
        "contact": "Contact Us",
        "phone": "Phone",
        "email": "Email",
        "location": "Location",
        "info": "Company Info",
        "company": "Company",
        "taxId": "Business ID",
        "rep": "Representative",
        "license": "License"
      }
    }
  },
  // 🇹🇼 繁體中文版字典
  zh: {
    translation: {
      "nav": {
        "home": "首頁",
        "plans": "車型與方案",
        "booking": "立即預約",
        "guide": "旅遊攻略",
        "about": "關於我們",
        "terms": "服務條款",
        "member": "會員中心",
        "login": "登入",
        "signup": "註冊",
        "logout": "登出",
        "admin": "老闆後台"
      },
      "footer": {
        "desc": "台灣最專業的露營車租賃服務。<br/>Explore Taiwan your way with our fully equipped campervans.",
        "quickLinks": "快速連結 Quick Links",
        "plans": "方案介紹 Plans",
        "booking": "預約流程 Booking",
        "guide": "旅遊攻略 Guide",
        "terms": "服務條款 Terms",
        "signup": "會員註冊 Sign Up",
        "contact": "聯絡我們 Contact",
        "companyInfo": "公司資訊 Company Info",
        "address": "地址 Address",
        "details": "詳細資訊 Details",
        "taxId": "統編 (Tax ID)",
        "rep": "代表人 (Rep)",
        "tel": "電話 (TEL)",
        "fax": "傳真 (FAX)",
        "rights": "© 2026 CampingTour Taiwan. All Rights Reserved."
      },
      "home": {
        "subtitle": "Explore Taiwan Your Way",
        "title": "車泊輕旅",
        "titleEn": "CampingTour Taiwan",
        "btnBooking": "立即預約 Booking",
        "btnVehicles": "車型介紹 Vehicles",
        "feat1Title": "輕鬆駕駛",
        "feat1Sub": "Easy to Drive",
        "feat1Desc1": "自用小客車駕照即可駕駛",
        "feat1Desc2": "車體輕巧靈活穿梭秘境",
        "feat2Title": "隨停隨宿",
        "feat2Sub": "Sleep Anywhere",
        "feat2Desc1": "免去繁瑣的搭帳篷步驟",
        "feat2Desc2": "打開車門大自然就在眼前",
        "feat3Title": "電力充足",
        "feat3Sub": "Full Power",
        "feat3Desc1": "配備駐車冷氣與大容量電池",
        "feat3Desc2": "給您最舒適的過夜體驗"
      },
      // 🌟 新增：PlansPage 翻譯
      "plans": {
        "badge": "Our Vehicles",
        "title": "頂級車型與方案",
        "model": "Nomad A180",
        "legal": "合法特種露營車",
        "desc": "CampingTour 堅持採用<strong>全新中華菱利 A180 車輛</strong>，依法規<strong>合法改裝為特種露營車</strong>。從源頭即符合相關安全標準，讓您無需煩惱裝備準備，輕鬆展開安心自在的「車泊」旅程。",
        "spec1": "合法特種露營車",
        "spec2": "中華菱利 A180",
        "spec3": "車邊帳",
        "spec4": "雙人床鋪",
        "spec5": "駐車冷氣",
        "spec6": "300Ah 高容量電池",
        "weekday": "平日",
        "weekend": "假日",
        "btnCheck": "查看可預約日期",
        "equipTitle": "隨車配備",
        "equipSub": "免裝備露營，我們都幫您準備好了",
        "equip1": "睡袋 ×2、枕頭 ×2",
        "equip2": "小瓦斯爐 + 鍋具",
        "equip3": "110V 插座及延長線",
        "equip4": "摺疊水桶 + 淋浴器",
        "equip5": "露營桌椅組",
        "equip6": "露營餐具組",
        "equip7": "營燈 ×2、串燈",
        "equip8": "烤盤",
        "noticeTitle": "貼心提醒",
        "noticeDesc": "個人盥洗用具（毛巾、牙刷）基於衛生考量，請旅客自行準備。"
      },
      // 🌟 新增：AboutPage 翻譯
      "about": {
        "title": "關於 CampingTour",
        "subtitle": "Our Story",
        "p1": "CampingTour 成立於 2021 年，專門改裝客製化露營車輛，我們致力於推廣台灣的 Vanlife 文化。2025 年開始推出露營車租賃服務。",
        "p2": "我們採用全新車輛合法打造的中華菱利 A180 特種露營車，從源頭即符合相關法規與使用安全標準，結合數位化預約系統與貼心管家服務，讓每一位旅人都能輕鬆展開「車泊」體驗，無需煩惱裝備與車輛準備。",
        "p3": "我們相信，最動人的風景，不在終點，而是在每一段旅程之中。無論是追逐合歡山的第一道曙光，還是靜聽花東海岸的浪潮聲，CampingTour 都將成為您最安心、最自在的移動城堡。",
        "contact": "聯絡我們",
        "phone": "電話",
        "email": "信箱",
        "location": "取車地點",
        "info": "公司資訊",
        "company": "公司名稱",
        "taxId": "統一編號",
        "rep": "代表人",
        "license": "執照號碼"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;