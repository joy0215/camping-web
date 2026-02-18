// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // 引入資料庫連線
const authMiddleware = require('../middleware/auth'); // 引入守門員 (記得要有這個)

// @route   POST /api/auth/register
// @desc    註冊新會員
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password, name, phone } = req.body;

  try {
    // 1. 檢查 Email 是否已經被註冊過
    const userExist = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' }); // 400 Bad Request
    }

    // 2. 密碼加密 (變成亂碼)
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt); // 這裡要存 hash

    // 3. 寫入資料庫
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
    // 1. 找找看有沒有這個人
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // 2. 比對密碼 (將輸入的密碼加密後跟資料庫的比對)
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // 3. 發放通行證 (Token)
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }); // 7天過期

    // 回傳給前端的資料 (包含 token 和使用者資訊)
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address // 這裡會是 null 如果沒填過
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🆕 新增功能：更新使用者資料 (Dashboard 會員中心用)
// @route   PUT /api/auth/update-profile
// @access  Private (需要登入)
router.put('/update-profile', authMiddleware, async (req, res) => {
  const { name, phone, address } = req.body; // 從前端收到的新資料
  const userId = req.user.id; // 從 Token 解出來的 User ID

  try {
    // 執行 SQL 更新指令
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

    // 回傳更新後的最新資料給前端
    res.json({ success: true, user: result.rows[0] });

  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;