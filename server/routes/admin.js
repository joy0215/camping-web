const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// 👑 老闆專屬 Email (寫死在這裡作為最高權限檢查)
const ADMIN_EMAIL = 'cheyang0326@gmail.com';

// 🛡️ 老闆權限檢查 Middleware
const checkAdmin = async (req, res, next) => {
  try {
    const userResult = await db.query('SELECT email FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0 || userResult.rows[0].email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: '權限不足，您不是管理員！' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// ==========================================
// 1. 取得所有客人的訂單 (包含客戶姓名、電話)
// 路徑：GET /api/admin/orders
// ==========================================
router.get('/orders', authMiddleware, checkAdmin, async (req, res) => {
  try {
    // JOIN 語法：把 inquiries (訂單) 和 users (會員) 兩張表合併撈出來
    const result = await db.query(`
      SELECT 
        i.*, 
        u.name AS user_name, 
        u.phone AS user_phone, 
        u.email AS user_email
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
// 2. 修改訂單狀態 (確認 / 取消)
// 路徑：PUT /api/admin/orders/:id/status
// ==========================================
router.put('/orders/:id/status', authMiddleware, checkAdmin, async (req, res) => {
  const { status } = req.body; // 'confirmed', 'cancelled', 'pending'
  const orderId = req.params.id;

  try {
    const updateResult = await db.query(
      'UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, orderId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: '找不到該訂單' });
    }

    res.json({ success: true, order: updateResult.rows[0] });
  } catch (err) {
    console.error('Update Order Status Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;