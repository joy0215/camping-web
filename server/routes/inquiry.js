const express = require('express');
const router = express.Router();
const db = require('../config/db');
const nodemailer = require('nodemailer');
const authMiddleware = require('../middleware/auth'); // 引入守門員 (驗證 Token)

// 1. 設定寄信通道 (Transporter)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/inquiry - 送出詢價單 (需登入)
router.post('/', authMiddleware, async (req, res) => {
  const { startDate, endDate, addons } = req.body;
  const userId = req.user.id; // 從 Token 解出來的

  try {
    // --- 簡單算錢邏輯 (之後可擴充) ---
    // 假設平日 3700，先寫死成 3 天 = 11100
    const total = 11100;
    const deposit = 5550;

    // --- 寫入資料庫 ---
    const newInquiry = await db.query(
      `INSERT INTO inquiries (user_id, start_date, end_date, total_price, deposit, addons) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, startDate, endDate, total, deposit, JSON.stringify(addons)]
    );

    const order = newInquiry.rows[0];

    // --- 寄信通知老闆 ---
    const mailOptions = {
      from: '"CampingTour 系統" <system@campingtour.com>',
      to: process.env.BOSS_EMAIL,
      subject: `🔥 [新詢價單] #${order.id} - ${startDate}`,
      html: `
        <h2>有一筆新的露營車詢價單！</h2>
        <p><strong>訂單編號：</strong> #${order.id}</p>
        <p><strong>會員 ID：</strong> ${userId}</p>
        <p><strong>日期：</strong> ${startDate} ~ ${endDate}</p>
        <p><strong>總金額：</strong> $${total}</p>
        <hr/>
        <p>請盡快聯絡客戶確認車況！</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent for Order #${order.id}`);

    res.json({ success: true, inquiry: order });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;