// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); 
const authMiddleware = require('../middleware/auth'); 

// @route   POST /api/auth/register
// @desc    註冊新會員
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password, name, phone } = req.body;

  try {
    const userExist = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' }); 
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt); 

    const newUser = await db.query(
      'INSERT INTO users (email, password_hash, name, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone',
      [email, hash, name, phone]
    );

    res.json({ success: true, user: newUser.rows[0] });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    會員登入 (取得 Token)
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }); 

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address 
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// 🆕 功能：更新會員個人資料 (已修正路徑與前端一致)
// @route   PUT /api/auth/profile
// @access  Private (需要登入)
// ==========================================
router.put('/profile', authMiddleware, async (req, res) => {
  const { name, phone, address } = req.body; 
  const userId = req.user.id; 

  try {
    const updateQuery = `
      UPDATE users 
      SET name = $1, phone = $2, address = $3
      WHERE id = $4 
      RETURNING id, name, email, phone, address
    `;
    
    const result = await db.query(updateQuery, [name, phone, address, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user: result.rows[0] });

  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;