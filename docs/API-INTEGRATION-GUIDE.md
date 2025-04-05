# Sociamatic CRM API 集成指南

本指南将帮助您测试 Sociamatic CRM API 并将其与前端应用程序集成。

## 1. 准备工作

### 环境变量配置

1. 在项目根目录创建 `.env` 文件（基于 `.env.example`）：

```
PORT=3001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

2. 确保填写了所有必要的环境变量，特别是 JWT_SECRET、SUPABASE_URL 和 SUPABASE_KEY。

## 2. 启动 API 服务器

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

或者启动生产服务器：

```bash
npm start
```

服务器将在 http://localhost:3001 上运行（或您在 .env 中指定的端口）。

## 3. 测试 API 端点

您可以使用 Postman、Insomnia 或 curl 等工具测试 API 端点。

### 基本端点测试

1. 检查 API 是否正常运行：

```
GET http://localhost:3001/api/v1
```

应返回欢迎消息。

### 身份验证测试

1. 注册新用户：

```
POST http://localhost:3001/api/v1/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User",
  "role": "customer"
}
```

2. 用户登录：

```
POST http://localhost:3001/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

登录成功后，您将收到访问令牌（accessToken）和刷新令牌（refreshToken）。

3. 使用访问令牌访问受保护的端点：

```
GET http://localhost:3001/api/v1/auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 4. 前端集成

### 配置前端项目

1. 在前端项目中设置 API 基础 URL：

```javascript
// 例如，在 React 项目的 .env 文件中
REACT_APP_API_URL=http://localhost:3001/api/v1

// 或在 Vue 项目的 .env 文件中
VUE_APP_API_URL=http://localhost:3001/api/v1
```

2. 创建 API 服务：

```javascript
// apiService.js 示例 (使用 fetch API)

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

// 获取存储在本地的令牌
const getToken = () => localStorage.getItem('accessToken');

// 创建带有授权头的请求选项
const authHeader = () => ({
  'Authorization': `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

// API 请求函数
export const apiService = {
  // 登录请求
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Login failed');
    }
    
    // 存储令牌
    localStorage.setItem('accessToken', data.data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
    
    return data.data;
  },
  
  // 获取当前用户信息
  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: authHeader(),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get user info');
    }
    
    return data.data;
  },
  
  // 获取工单列表
  getTickets: async (params = {}) => {
    // 构建查询字符串
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/tickets${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: authHeader(),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch tickets');
    }
    
    return data.data;
  },
  
  // 添加更多 API 方法...
};
```

### 处理身份验证和令牌刷新

为了处理令牌过期情况，您可以实现一个拦截器：

```javascript
// 在 axios 中实现拦截器示例
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

// 请求拦截器 - 添加令牌
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 处理令牌刷新
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 如果是 401 错误且不是刷新令牌请求
    if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      originalRequest._retry = true;
      
      try {
        // 尝试刷新令牌
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });
        
        // 存储新令牌
        const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // 重试原始请求
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 刷新令牌失败，需要重新登录
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // 重定向到登录页面
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

## 5. 测试前端集成

1. 实现登录表单并测试登录功能
2. 测试受保护路由和组件
3. 测试 API 数据获取和显示
4. 验证令牌刷新机制是否正常工作

## 6. CORS 问题排查

API 已配置 CORS 支持，允许跨域请求。如果遇到 CORS 问题：

1. 确认前端应用的域名/端口与 API 服务器不同
2. 检查浏览器控制台中的错误消息
3. 如需更精细的 CORS 配置，可以修改 `src/index.js` 中的 CORS 设置：

```javascript
// 更精细的 CORS 配置示例
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

## 7. 常见问题解决

### 身份验证问题

- 确保在请求头中正确设置 `Authorization: Bearer YOUR_TOKEN`
- 验证 JWT_SECRET 环境变量已正确设置
- 检查令牌是否已过期

### 数据库连接问题

- 确认 Supabase 凭据正确
- 检查数据库表是否已正确设置

### API 请求失败

- 检查请求格式和参数
- 查看服务器日志以获取详细错误信息
- 确保遵循 API 文档中的请求格式