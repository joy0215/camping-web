import axios from 'axios';

// 建立一個 axios 實例
const axiosClient = axios.create({
  // 👇 關鍵修改：換成您的 Render 雲端網址，並且保留結尾的 /api
  baseURL: 'https://camping-tour-api.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- 攔截器 (Interceptors) ---
// 每次發送請求前，自動把 Token 帶上
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 從瀏覽器把 Token 拿出來
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 貼在 Header 上
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;