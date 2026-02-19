const express = require('express');
const router = express.Router();
const db = require('../config/db');
const nodemailer = require('nodemailer');
const authMiddleware = require('../middleware/auth'); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const ADDON_NAMES = {
  mattress: '雙人充氣睡墊 ($500)',
  blanket: '保暖毛毯 ($200)',
  cookware: '多功能鍋具組 ($200)'
};

// 🚐 車輛總數 (未來買新車改這裡就好)
const TOTAL_VANS = 3;

// 輔助函數：將日期格式化為 YYYY-MM-DD，避免時區問題
const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};

// ==========================================
// 🆕 功能 0：取得「滿檔無法預約」的日期清單
// 路徑：GET /api/inquiry/blocked-dates
// ==========================================
router.get('/blocked-dates', async (req, res) => {
  try {
    // 撈出所有訂單 (未來如果有取消功能，這裡可以加上 WHERE status != 'cancelled')
    const result = await db.query('SELECT start_date, end_date FROM inquiries');
    
    const dateCounts = {};

    // 攤開每一筆訂單，計算每一天被借走了幾台
    result.rows.forEach(order => {
      let current = new Date(order.start_date);
      const end = new Date(order.end_date);

      while (current <= end) {
        const dateStr = formatDate(current);
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        current.setDate(current.getDate() + 1);
      }
    });

    // 篩選出「借出數量 >= 總車輛數」的日期，這天就是滿檔！
    const blockedDates = Object.keys(dateCounts).filter(date => dateCounts[date] >= TOTAL_VANS);

    res.json(blockedDates);
  } catch (err) {
    console.error('Get Blocked Dates Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ==========================================
// 功能 1：取得會員自己的訂單列表
// 路徑：GET /api/inquiry/my-orders
// ==========================================
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; 
    const result = await db.query(
      'SELECT * FROM inquiries WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows); 
  } catch (err) {
    console.error('Get Orders Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ==========================================
// 功能 2：送出詢價單 (加入防撞雙重驗證)
// 路徑：POST /api/inquiry
// ==========================================
router.post('/', authMiddleware, async (req, res) => {
  const { startDate, endDate, addons, estimatedPrice } = req.body;
  const userId = req.user.id; 

  try {
    // 🛡️ [防撞終極防線]：寫入資料庫前，最後算一次有沒有滿檔
    const allOrders = await db.query('SELECT start_date, end_date FROM inquiries');
    const dateCounts = {};
    allOrders.rows.forEach(order => {
      let current = new Date(order.start_date);
      const end = new Date(order.end_date);
      while (current <= end) {
        const dateStr = formatDate(current);
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        current.setDate(current.getDate() + 1);
      }
    });

    // 檢查客人選的這段期間，有沒有哪一天已經 >= 3台了
    let isOverlap = false;
    let checkCurrent = new Date(startDate);
    const checkEnd = new Date(endDate);
    
    while (checkCurrent <= checkEnd) {
      const dateStr = formatDate(checkCurrent);
      if (dateCounts[dateStr] && dateCounts[dateStr] >= TOTAL_VANS) {
        isOverlap = true;
        break;
      }
      checkCurrent.setDate(checkCurrent.getDate() + 1);
    }

    if (isOverlap) {
      return res.status(400).json({ error: '抱歉，您選擇的區間內有日期已滿檔，請重新選擇！' });
    }
    // 🛡️ 防撞檢查結束

    // 1. 查會員資料
    const userResult = await db.query('SELECT name, phone, email FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    // 2. 寫入訂單
    const newInquiry = await db.query(
      `INSERT INTO inquiries (user_id, start_date, end_date, total_price, addons) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, startDate, endDate, estimatedPrice, JSON.stringify(addons)]
    );
    const order = newInquiry.rows[0];

    // 3. 準備 Email
    let addonsHtml = '';
    let hasAddons = false;
    for (const [key, value] of Object.entries(addons)) {
      if (value) { 
        addonsHtml += `<li style="margin-bottom: 4px;">${ADDON_NAMES[key] || key}</li>`;
        hasAddons = true;
      }
    }
    if (!hasAddons) addonsHtml = '<li>無加購項目</li>';

    // 4. 寄 Email
    const mailOptions = {
      from: '"CampingTour 系統" <system@campingtour.com>',
      to: process.env.BOSS_EMAIL,
      subject: `🔥 [新詢價單] #${order.id} - ${user.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #d94e18;">🚐 有一筆新的露營車詢價單！</h2>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <h3 style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">👤 客戶資料</h3>
          <p><strong>姓名：</strong> ${user.name}</p>
          <p><strong>電話：</strong> <a href="tel:${user.phone}">${user.phone}</a></p>
          <p><strong>Email：</strong> ${user.email}</p>
          <h3 style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; margin-top: 20px;">📅 行程內容</h3>
          <p><strong>訂單編號：</strong> #${order.id}</p>
          <p><strong>取車日期：</strong> ${startDate}</p>
          <p><strong>還車日期：</strong> ${endDate}</p>
          <p><strong>預估總金額：</strong> <span style="font-size: 1.2em; color: #d94e18; font-weight: bold;">NT$ ${estimatedPrice.toLocaleString()}</span></p>
          <h3 style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; margin-top: 20px;">🎒 加購配備</h3>
          <ul style="padding-left: 20px;">${addonsHtml}</ul>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ 詳細詢價單 Email 已寄出 (Order #${order.id})`);

    res.json({ success: true, inquiry: order });

  } catch (err) {
    console.error('Inquiry Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;