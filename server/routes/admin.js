const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// 🌟 管理員 Email 白名單 (雙主管專用)
const ADMIN_EMAILS = [
  'jchenghe06@gmail.com',
  'cheyang0326@gmail.com'
];

// 中介層：雙重判定 is_admin 旗標或符合白名單信箱
const checkAdmin = async (req, res, next) => {
  try {
    const userResult = await db.query('SELECT email, is_admin FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(403).json({ error: '使用者不存在' });
    }

    const user = userResult.rows[0];
    const isWhiteListed = ADMIN_EMAILS.includes(user.email);

    if (!user.is_admin && !isWhiteListed) {
      return res.status(403).json({ error: '權限不足，您不是管理員！' });
    }
    next();
  } catch (err) {
    console.error('Check Admin Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// ==========================================
// 1. 取得所有客人的訂單
// ==========================================
router.get('/orders', authMiddleware, checkAdmin, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        i.*, 
        COALESCE(i.contact_name, u.name) AS user_name, 
        COALESCE(i.contact_phone, u.phone) AS user_phone, 
        COALESCE(i.contact_email, u.email) AS user_email
      FROM inquiries i
      JOIN users u ON i.user_id = u.id
      ORDER BY i.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Get Admin Orders Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ==========================================
// 2. 更新訂單狀態 (確認/婉拒/取消)
// ==========================================
router.put('/orders/:id/status', authMiddleware, checkAdmin, async (req, res) => {
  const { status } = req.body; 
  const orderId = req.params.id;

  try {
    const updateResult = await db.query(
      'UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, orderId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: '找不到該筆訂單' });
    }

    res.json({ success: true, order: updateResult.rows[0] });
  } catch (err) {
    console.error('Update Order Status Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ==========================================
// 3. 老闆專屬的「快速結帳連結」生成器
// ==========================================
router.post('/quick-order', authMiddleware, checkAdmin, async (req, res) => {
  try {
    const { amount } = req.body;
    const today = new Date().toISOString().split('T')[0]; // 用今天當作預設日期
    
    // 建立一筆快速訂單，把 contact_name 標記為「專屬快速結帳」方便老闆辨識
    const result = await db.query(
      `INSERT INTO inquiries (user_id, start_date, end_date, total_price, addons, contact_name, contact_phone, contact_email, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending') RETURNING id`,
      [req.user.id, today, today, amount, '{}', '專屬快速結帳', '無', '無']
    );
    
    res.json({ success: true, orderId: result.rows[0].id });
  } catch (err) {
    console.error('Quick Order Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ==========================================
// 4. 手動封鎖/關閉特定日期區間 (產生線下鎖定單)
// ==========================================
router.post('/block-dates', authMiddleware, checkAdmin, async (req, res) => {
  const { startDate, endDate, note, vanCount = 3 } = req.body;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: '請提供起始與結束日期' });
  }

  try {
    // 預設鎖定 3 台（庫存全滿），直接連動前台行事曆轉灰無法點選
    const insertPromises = [];
    const count = Math.min(Math.max(Number(vanCount), 1), 3);

    for (let i = 1; i <= count; i++) {
      insertPromises.push(
        db.query(
          `INSERT INTO inquiries (user_id, start_date, end_date, total_price, addons, contact_name, contact_phone, contact_email, status) 
           VALUES ($1, $2, $3, 0, '{}', $4, '無', '無', 'confirmed')`,
          [req.user.id, startDate, endDate, `[線下封鎖/店休] ${note || '人工手動保留'} (#${i})`]
        )
      );
    }

    await Promise.all(insertPromises);
    res.json({ success: true, message: `已成功封鎖 ${startDate} ~ ${endDate}` });
  } catch (err) {
    console.error('Block Dates Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;