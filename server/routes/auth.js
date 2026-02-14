// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // 引入資料庫連線

// @route   POST /api/auth/register
// @desc    註冊新會員
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password, name, phone } = req.body;

  try {
    // 1. 檢查 Email 是否已經被註冊過
    const userExist = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // 2. 密碼加密 (變成亂碼)
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // 3. 寫入資料庫
    const newUser = await db.query(
      'INSERT INTO users (email, password_hash, name, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
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
    // 1. 找找看有沒有這個人
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    // 2. 比對密碼 (將輸入的密碼加密後跟資料庫的比對)
    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // 3. 發放通行證 (Token)
    const payload = { id: user.rows[0].id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }); // 7天過期

    res.json({
      success: true,
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        phone: user.rows[0].phone
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;