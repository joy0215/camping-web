const express = require('express');
const router = express.Router();
const db = require('../config/db');
const nodemailer = require('nodemailer');
const authMiddleware = require('../middleware/auth'); // 引入守門員

// 設定 Gmail 寄信
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 定義加購項目名稱對照表
const ADDON_NAMES = {
  mattress: '雙人充氣睡墊 ($500)',
  blanket: '保暖毛毯 ($200)',
  cookware: '多功能鍋具組 ($200)'
};

// POST /api/inquiry - 送出詢價單
router.post('/', authMiddleware, async (req, res) => {
  const { startDate, endDate, addons, estimatedPrice } = req.body;
  const userId = req.user.id; // 從 Token 解出來的 ID

  try {
    // 1. 先去資料庫查這位會員是誰 (取得名字、電話、Email)
    const userResult = await db.query('SELECT name, phone, email FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    // 2. 寫入訂單資料庫
    const newInquiry = await db.query(
      `INSERT INTO inquiries (user_id, start_date, end_date, total_price, addons) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, startDate, endDate, estimatedPrice, JSON.stringify(addons)]
    );

    const order = newInquiry.rows[0];

    // 3. 翻譯加購項目 (把 true/false 變成中文清單)
    let addonsHtml = '';
    let hasAddons = false;
    for (const [key, value] of Object.entries(addons)) {
      if (value) { // 如果是 true
        addonsHtml += `<li style="margin-bottom: 4px;">${ADDON_NAMES[key] || key}</li>`;
        hasAddons = true;
      }
    }
    if (!hasAddons) addonsHtml = '<li>無加購項目</li>';

    // 4. 寄送詳細 Email 給老闆
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
          <ul style="padding-left: 20px;">
            ${addonsHtml}
          </ul>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 0.9em;">請盡快聯絡客戶確認車況與訂金事宜。</p>
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