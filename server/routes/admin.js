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
// 1. 取得所有客人的訂單 (優先抓取自訂的聯絡人資訊，若無則抓會員資訊)
// ==========================================
router.get('/orders', authMiddleware, checkAdmin, async (req, res) => {
  try {
    // 🆕 使用 COALESCE：如果 contact_name 有值就用它，沒有就退回用會員的 u.name
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
      return res.status(404).json({ error: '找不到該訂單' });
    }

    res.json({ success: true, order: updateResult.rows[0] });
  } catch (err) {
    console.error('Update Order Status Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;