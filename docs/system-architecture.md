# Sociamatic CRM 系统架构文档

## 1. 系统概述

Sociamatic CRM 是一个现代化的客户关系管理系统，采用 Next.js 框架构建，提供完整的工单管理、客户管理、自动化工作流等功能。

## 2. 技术栈

- **前端框架**：Next.js
- **UI 框架**：Tailwind CSS
- **状态管理**：React Context
- **API 通信**：Axios
- **类型系统**：TypeScript

## 3. 系统架构

### 3.1 前端架构

#### 核心模块

- **认证模块**
  - 登录/注册表单组件
  - 认证上下文管理（AuthContext）
  - 令牌管理和自动刷新机制

- **工单管理模块**
  - 工单列表和详情视图
  - 工单创建和编辑界面
  - SLA 管理和监控

- **客户管理模块**
  - 客户信息管理
  - 组织管理
  - 客户互动历史

- **自动化模块**
  - 工作流触发器
  - 批量操作
  - 宏命令管理

#### 组件结构

```
components/
  ├── common/         # 通用组件
  ├── layout/         # 布局组件
  ├── tickets/        # 工单相关组件
  ├── automation/     # 自动化相关组件
  └── technical/      # 技术审查组件
```

### 3.2 服务层架构

#### API 服务

```
services/api/
  ├── apiClient.ts           # API 客户端配置
  ├── authService.ts         # 认证服务
  ├── ticketService.ts       # 工单服务
  ├── customerService.ts     # 客户服务
  ├── organizationService.ts # 组织服务
  └── slaService.ts         # SLA 服务
```

#### API 客户端特性

- 统一的错误处理
- 令牌自动刷新机制
- 请求/响应拦截器
- 网络错误智能提示

### 3.3 页面结构

```
pages/
  ├── dashboard.tsx          # 仪表板
  ├── tickets/               # 工单管理
  ├── customers/             # 客户管理
  ├── organizations/         # 组织管理
  ├── automation/            # 自动化配置
  ├── sla/                   # SLA 管理
  └── settings/              # 系统设置
```

## 4. 核心功能流程

### 4.1 认证流程

1. 用户登录/注册
2. 获取访问令牌和刷新令牌
3. 令牌存储在 localStorage
4. API 请求自动附加令牌
5. 令牌过期自动刷新

### 4.2 工单处理流程

1. 创建/接收工单
2. SLA 规则应用
3. 自动分配处理人
4. 状态流转和更新
5. 触发相关自动化规则

## 5. 数据流

### 5.1 状态管理

- 使用 React Context 进行全局状态管理
- 认证状态集中在 AuthContext
- 组件级状态使用 useState/useReducer

### 5.2 API 通信

- 统一的 API 客户端配置
- RESTful API 设计
- 请求响应拦截处理
- 错误统一处理机制

## 6. 安全机制

- JWT 基于令牌的认证
- 自动令牌刷新
- API 请求加密
- 用户权限控制

## 7. 扩展性设计

- 模块化的组件结构
- 可配置的自动化规则
- 插件化的功能扩展
- 自定义工作流支持

## 8. 部署架构

- Next.js 应用部署
- API 服务独立部署
- 静态资源 CDN 分发
- 数据库集群部署