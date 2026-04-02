const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); 

const app = express();

app.use(cors());

// 讓伺服器看得懂 JSON 與 Form 表單格式
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 🌟 關鍵新增：開放 uploads 資料夾，讓前端可以讀取評價的美照
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Camping Server is Running! 🚀');
});

// --- 👇 掛載 API 路由 👇 ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inquiry', require('./routes/inquiry'));
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/admin', require('./routes/admin')); 
app.use('/api/payment', require('./routes/payment'));
app.use('/api', require('./routes/review')); // 🌟 新增這行：掛載評價與回饋系統
// -------------------------------------

db.query('SELECT NOW()')
  .then(res => {
    console.log('✅ PostgreSQL Database Connected Success!');
  })
  .catch(err => {
    console.error('❌ Database Connection Error:', err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));