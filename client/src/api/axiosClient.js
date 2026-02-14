import axios from 'axios';

// 建立一個 axios 實例
const axiosClient = axios.create({
  baseURL: '/api', // 因為我們設定了 Proxy，所以直接用 /api 開頭即可
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