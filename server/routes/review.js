const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db'); // 確保這裡的路徑正確對應你的資料庫設定

// 🌟 設定 Multer：將客人上傳的照片存進 uploads/ 資料夾
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'review-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ==========================================
// 1. 新增評價 (POST /api/feedback)
// ==========================================
router.post('/feedback', upload.single('photo'), async (req, res) => {
  try {
    const { orderId, rating, comment, userName, userAvatar, country } = req.body;
    
    // 如果客人有傳照片，組合出圖片路徑；沒有就是 null
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // 🌟 已修正：SQL 欄位順序與底下的陣列參數順序完全對齊！
    // 對應關係：
    // $1 -> orderId
    // $2 -> userName
    // $3 -> userAvatar
    // $4 -> country
    // $5 -> rating
    // $6 -> comment
    // $7 -> photoUrl
    const newReview = await db.query(
      `INSERT INTO reviews (order_id, user_name, user_avatar, country, rating, comment, photo_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        orderId, 
        userName || 'Guest', 
        userAvatar || 'G', 
        country || 'OTHER', 
        rating, 
        comment, 
        photoUrl
      ]
    );

    res.json({ success: true, review: newReview.rows[0] });
  } catch (err) {
    console.error('Save review error:', err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 2. 獲取所有評價 (GET /api/reviews)
// ==========================================
router.get('/reviews', async (req, res) => {
  try {
    // 撈出所有評價，最新的排在最前面
    const allReviews = await db.query('SELECT * FROM reviews ORDER BY created_at DESC');
    res.json(allReviews.rows);
  } catch (err) {
    console.error('Fetch reviews error:', err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;