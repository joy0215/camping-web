const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// 🌟 Use an array to store multiple admin emails
const ADMIN_EMAILS = [
  'cheyang0326@gmail.com',
  'jchenghe06@gmail.com'
];

// Middleware to verify if the logged-in user is an admin
const checkAdmin = async (req, res, next) => {
  try {
    const userResult = await db.query('SELECT email FROM users WHERE id = $1', [req.user.id]);
    
    // 🌟 Check if the user's email exists in the ADMIN_EMAILS array
    if (userResult.rows.length === 0 || !ADMIN_EMAILS.includes(userResult.rows[0].email)) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// ==========================================
// 1. Get all customer orders 
// (Prioritize custom contact info, fallback to user info)
// ==========================================
router.get('/orders', authMiddleware, checkAdmin, async (req, res) => {
  try {
    // 🆕 Use COALESCE: If contact_name has a value, use it; otherwise, fallback to u.name
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
// 2. Update order status
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
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, order: updateResult.rows[0] });
  } catch (err) {
    console.error('Update Order Status Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;