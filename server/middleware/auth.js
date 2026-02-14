// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. 從 Header 取得 Token
  const token = req.header('Authorization');

  // 2. 如果沒有 Token，就擋下來
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // 3. 驗證 Token 是否有效
  try {
    // 去掉 "Bearer " 前綴
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded; // 把解密出來的 user_id 塞進請求裡
    next(); // 放行
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};