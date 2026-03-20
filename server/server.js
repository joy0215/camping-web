const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); 

const app = express();

app.use(cors());

// 👇 讓伺服器看得懂 JSON 格式 (前端預約送過來的)
app.use(express.json({ limit: '10mb' }));

// 🌟 關鍵修復：讓伺服器看得懂 Form 表單格式 (藍新金流 POST 回來的)
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Camping Server is Running! 🚀');
});

// --- 👇 掛載 API 路由 👇 ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inquiry', require('./routes/inquiry'));
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/admin', require('./routes/admin')); 
app.use('/api/payment', require('./routes/payment')); // 金流路由
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