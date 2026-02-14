const { Pool } = require('pg');
require('dotenv').config();

// 建立連線池 (Connection Pool)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 監聽連線事件 (確認有沒有連成功)
pool.on('connect', () => {
  console.log('✅ PostgreSQL Database Connected!');
});

pool.on('error', (err) => {
  console.error('❌ Database Connection Error:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};