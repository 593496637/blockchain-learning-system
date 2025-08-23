# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

这是一个区块链学习系统，包含 React/TypeScript 前端和 Node.js/Express 后端。实现了一个简化的区块链，具有用户管理、代币分配、交易处理、挖矿和区块浏览功能。

## 架构

```
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/   # React 组件（模块化设计）
│   │   ├── api.ts       # Axios API 客户端
│   │   ├── types.ts     # TypeScript 类型定义
│   │   └── App.tsx      # 主应用程序组件
│   └── package.json     # 前端依赖和脚本
└── backend/           # Node.js + Express + TypeScript  
    ├── src/
    │   ├── blockchain.ts  # 核心区块链实现
    │   ├── index.ts      # Express 服务器和 API 路由
    │   └── types.ts      # 共享类型定义
    └── package.json      # 后端依赖和脚本
```

## 开发命令

### 前端（使用 pnpm）
```bash
cd frontend
pnpm install    # 安装依赖
pnpm dev        # 启动开发服务器（端口 3000）
pnpm build      # 生产环境构建
pnpm lint       # 运行 ESLint
pnpm type-check # TypeScript 类型检查
```

### 后端（使用 npm）
```bash
cd backend
npm install     # 安装依赖
npm run dev     # 使用 nodemon 启动开发服务器（端口 3001）
npm run build   # 编译 TypeScript 到 dist/
npm start       # 运行编译版本（需要先构建）
npm run clean   # 删除 dist/ 目录
```

## 关键组件

### 前端组件
- `App.tsx`：主应用程序，具有标签式导航
- `UserManagement.tsx`：用户创建和代币分配
- `TransactionManagement.tsx`：创建交易和查看交易池
- `MinerManagement.tsx`：矿工注册和挖矿操作
- `BlockchainBrowser.tsx`：浏览区块和交易
- `EnhancedSystemStatus.tsx`：实时系统状态显示

### 后端核心
- `blockchain.ts`：核心区块链类，包含挖矿、验证和状态管理
- `index.ts`：Express 服务器和 RESTful API 端点
- 使用内存存储（重启时重置）

## API 端点

### 系统
- `GET /api/health` - 健康检查
- `GET /api/blockchain/info` - 获取区块链统计信息

### 用户和代币
- `GET /api/users` - 列出所有用户
- `POST /api/users` - 创建新用户
- `GET /api/users/:address` - 获取用户详情
- `POST /api/tokens/allocate` - 向用户分配代币

### 交易
- `GET /api/transactions/pending` - 获取交易池
- `POST /api/transactions` - 创建新交易

### 挖矿
- `GET /api/miners` - 列出矿工
- `POST /api/miners` - 注册矿工  
- `POST /api/mining/mine` - 执行挖矿

### 区块链
- `GET /api/blockchain/blocks` - 获取所有区块
- `GET /api/blockchain/blocks/:index` - 获取特定区块

## 代码模式

### 前端
- 使用现代 React hooks（useState、useEffect）
- 使用 axios 的自定义 API 层进行类型安全请求
- 基于组件的架构，分离清晰
- CSS-in-JS 方法，自定义样式（无外部 UI 库）

### 后端  
- 基于类的区块链实现
- Express 中间件用于 CORS 和 JSON 解析
- 全程使用 TypeScript 严格类型
- RESTful API 设计，响应格式一致

## 配置

### 默认设置
- 前端端口：3000
- 后端端口：3001  
- 挖矿难度：4（哈希必须以 4 个零开头）
- 区块奖励：10 代币
- 交易手续费：0.1 代币
- 每个区块最大交易数：10

### ESLint 配置
前端使用现代 ESLint 扁平配置，包含 TypeScript、React hooks 和 React refresh 插件。

## 开发工作流

1. 前端和后端在开发模式下都支持热重载
2. 后端使用 nodemon 和 ts-node 进行开发
3. 前端使用 Vite 进行快速开发和构建
4. 提交更改前务必运行类型检查和代码检查