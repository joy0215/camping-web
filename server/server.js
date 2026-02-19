const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // 引入資料庫設定

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 測試路由 (確認伺服器活著)
app.get('/', (req, res) => {
  res.send('Camping Server is Running! 🚀');
});

// --- 👇 掛載 API 路由 👇 ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inquiry', require('./routes/inquiry'));
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/admin', require('./routes/admin')); // 👑 🆕 啟用老闆 API
// -------------------------------------

// 資料庫連線測試 (保留這段讓你確認連線狀態)
db.query('SELECT NOW()')
  .then(res => {
    console.log('✅ PostgreSQL Database Connected Success!');
    console.log('🕒 Database Time:', res.rows[0].now);
  })
  .catch(err => {
    console.error('❌ Database Connection Error:', err.message);
    console.error('💡 提示：請檢查您的 .env 檔案中的 DATABASE_URL 是否正確，或 PostgreSQL 是否已啟動。');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));