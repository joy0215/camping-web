require('dotenv').config();
const db = require('./config/db'); 

const addColumn = async () => {
  try {
    console.log('⏳ 正在為 inquiries 資料表新增 signature_url 欄位...');
    
    // 執行新增欄位的 SQL 指令
    await db.query('ALTER TABLE inquiries ADD COLUMN signature_url VARCHAR(255);');
    
    console.log('✅ 新增成功！您的訂單資料庫已經有 signature_url 欄位了。');
  } catch (error) {
    console.error('❌ 發生錯誤 (或欄位可能已經存在)：', error.message);
  } finally {
    process.exit(); 
  }
};

addColumn();