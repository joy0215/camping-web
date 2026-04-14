const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

const checkAdmin = async (req, res, next) => {
  try {
    const userResult = await db.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0 || !userResult.rows[0].is_admin) {
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
// 🆕 新增：老闆專屬的「快速結帳連結」生成器
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

module.exports = router;