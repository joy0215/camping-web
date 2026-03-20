const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth'); 

const TOTAL_VANS = 3;

const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};

router.get('/blocked-dates', async (req, res) => {
  try {
    const result = await db.query("SELECT start_date, end_date FROM inquiries WHERE status != 'cancelled'");
    const dateCounts = {};
    result.rows.forEach(order => {
      let current = new Date(order.start_date);
      const end = new Date(order.end_date);
      while (current <= end) {
        const dateStr = formatDate(current);
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        current.setDate(current.getDate() + 1);
      }
    });
    const blockedDates = Object.keys(dateCounts).filter(date => dateCounts[date] >= TOTAL_VANS);
    res.json(blockedDates);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; 
    const result = await db.query(
      'SELECT * FROM inquiries WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows); 
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { startDate, endDate, addons, estimatedPrice, contactInfo } = req.body;
  const userId = req.user.id; 

  try {
    // 1. 防撞檢查
    const allOrders = await db.query("SELECT start_date, end_date FROM inquiries WHERE status != 'cancelled'");
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

    // 2. 直接寫入資料庫
    const newInquiry = await db.query(
      `INSERT INTO inquiries (user_id, start_date, end_date, total_price, addons, contact_name, contact_phone, contact_email) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userId, startDate, endDate, estimatedPrice, JSON.stringify(addons), contactInfo.name, contactInfo.phone, contactInfo.email]
    );
    
    // 3. 直接回傳，不再這裡寄信！
    res.json({ success: true, inquiry: newInquiry.rows[0] });

  } catch (err) {
    console.error('Inquiry Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;