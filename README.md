# Zendesk 智能自助服务门户

## 项目概述

在传统 Zendesk 系统管理中，管理员需要频繁地手动处理配置变更、工单管理、用户请求以及自动化流程的调整。这不仅耗时，还容易出错。本项目旨在构建一个自助式管理门户，通过集成 Zendesk API、AI Agent 技术与自动化规则引擎，实现低代码/零代码的 Zendesk 管理体验，提升运维效率和客户支持水平。

## 核心功能

1. **工单管理界面**：展示多种工单视图，支持筛选和详情查看
2. **技术审查模块**：一键扫描 Zendesk 实例配置，检测问题并提供修复
3. **自动化操作中心**：支持用户添加/移除、计划升级/降级等一键操作
4. **仪表盘中心**：展示工单状态、响应时间、自动化执行次数和账单费用
5. **AI Agent 中心**：集成 AI 回答助手，用于工单分类、FAQ 回答和处理建议
6. **用户授权与集成**：支持通过 OAuth 授权绑定 Zendesk 实例

## 技术栈

- 前端：Next.js + Tailwind CSS + Zustand + Chart.js
- 后端：Node.js + Express + Supabase
- AI 服务：OpenAI GPT-4 / 自定义向量库
- Zendesk 集成：Zendesk REST API + OAuth2 授权机制

## 开发指南

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 项目结构

```
/
├── components/       # React 组件
├── pages/            # Next.js 页面
├── public/           # 静态资源
├── styles/           # 全局样式
├── lib/              # 工具函数和 API 客户端
├── store/            # Zustand 状态管理
└── types/            # TypeScript 类型定义
```