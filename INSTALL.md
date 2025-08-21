# 🛠️ 安装与使用指南 (更新版)

## 📋 环境要求

- **Node.js**: 16.0 或更高版本
- **npm**: 7.0 或更高版本 (或使用 yarn)
- **操作系统**: Windows、macOS、Linux

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/593496637/blockchain-learning-system.git
cd blockchain-learning-system
```

### 2. 启动系统

#### 方式一：使用启动脚本 (推荐，Linux/macOS)

```bash
# 给脚本添加执行权限
chmod +x start.sh

# 运行启动脚本
./start.sh
```

#### 方式二：手动启动 (Windows/全平台)

```bash
# 终端1 - 启动后端
cd backend
npm install
npm run dev

# 终端2 - 启动前端  
cd frontend
npm install
npm start
```

### 3. 访问系统

- **前端界面**: http://localhost:3000
- **后端API**: http://localhost:3001
- **健康检查**: http://localhost:3001/api/health

## 🔧 故障排除

### 问题1: "crypto-js" 模块找不到

**解决方案**: 我们已经修复了这个问题，后端现在使用Node.js内置的 `crypto` 模块。

**如果仍有问题**:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### 问题2: 前端无法启动

**原因**: 缺少必要的前端文件

**解决方案**: 确保以下文件存在：
- `frontend/public/index.html`
- `frontend/src/index.tsx`
- `frontend/src/App.tsx`

**重新安装前端**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### 问题3: start.sh 权限不够

**Linux/macOS**:
```bash
chmod +x start.sh
./start.sh
```

**Windows** (使用Git Bash或WSL):
```bash
bash start.sh
```

### 问题4: 端口被占用

**检查端口占用**:
```bash
# 检查3001端口(后端)
lsof -i :3001

# 检查3000端口(前端)  
lsof -i :3000
```

**终止占用进程**:
```bash
# 终止进程 (替换PID)
kill -9 <PID>
```

### 问题5: npm 安装依赖失败

**清理缓存并重新安装**:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**使用其他镜像源**:
```bash
npm install --registry https://registry.npmmirror.com
```

## 📖 使用教程

### 第一次使用系统

1. **系统启动后**，访问 http://localhost:3000
2. **系统会自动创建**测试用户和矿工：
   - 用户：Alice (100代币), Bob (50代币) 
   - 矿工：Miner_Alpha, Miner_Beta
3. **开始学习**，按照欢迎页面的指引操作

### 完整操作流程

#### 步骤1: 用户管理
- 点击侧边栏"用户管理"
- 创建新用户或查看现有用户
- 查看用户钱包地址和余额

#### 步骤2: 代币管理  
- 点击"代币管理"
- 给用户分配初始代币
- 查看代币分布统计

#### 步骤3: 注册矿工
- 点击"矿工管理"  
- 注册新的矿工账户
- 查看矿工状态和挖矿记录

#### 步骤4: 创建交易
- 点击"交易管理"
- 选择发送方和接收方
- 输入转账金额，创建交易
- 交易会进入交易池等待打包

#### 步骤5: 执行挖矿
- 返回"矿工管理"
- 选择矿工执行挖矿操作
- 矿工会打包交易并生成新区块
- 获得区块奖励和手续费

#### 步骤6: 浏览区块链
- 点击"区块浏览器"
- 查看完整的区块链
- 点击区块查看详细信息
- 搜索特定的交易或区块

## 🔧 系统配置

### 默认配置参数

```typescript
{
  blockReward: 10,        // 挖矿奖励 (代币)
  minFee: 0.1,           // 最小手续费 (代币)  
  difficulty: 4,         // 挖矿难度 (前缀0个数)
  maxTransactionsPerBlock: 10  // 每区块最大交易数
}
```

### 修改配置

要修改系统配置，编辑 `backend/src/blockchain.ts` 中的 `config` 对象：

```typescript
private config: SystemConfig = {
  blockReward: 20,    // 修改挖矿奖励
  minFee: 0.05,      // 修改手续费
  difficulty: 3,     // 修改挖矿难度 (数字越小越容易)
  maxTransactionsPerBlock: 20
};
```

**注意**: 修改配置后需要重启后端服务。

## 🐛 常见错误及解决方案

### 1. EADDRINUSE: address already in use :::3001

**原因**: 端口3001已被占用
**解决**: 终止占用进程或更改端口

### 2. Cannot find module 'crypto-js'

**原因**: 依赖配置错误
**解决**: 重新安装后端依赖

### 3. Module not found: Can't resolve './App'

**原因**: 前端文件缺失
**解决**: 确保所有前端文件都已正确创建

### 4. 前端白屏

**原因**: React应用启动失败
**解决**: 检查浏览器控制台错误，重新安装依赖

## 📱 开发环境配置

### VSCode 推荐插件

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss", 
    "ms-vscode.vscode-json",
    "esbenp.prettier-vscode"
  ]
}
```

### 调试配置

**后端调试** (VSCode):
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "program": "${workspaceFolder}/backend/src/index.ts",
  "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
  "runtimeArgs": ["-r", "ts-node/register"]
}
```

## 🔄 重置系统

如需重置整个区块链系统：

1. 停止前后端服务 (Ctrl+C)
2. 重新启动后端服务
3. 系统会自动重新初始化

## 🌐 部署到生产环境

**⚠️ 警告**: 此系统仅用于学习目的，不应部署到生产环境。

如需部署用于演示:

### 后端构建
```bash
cd backend
npm run build
npm start
```

### 前端构建
```bash
cd frontend
npm run build
# 使用静态文件服务器提供 build 目录
```

## 📚 API文档

### 主要API端点

```bash
# 用户管理
POST /api/users              # 创建用户
GET  /api/users              # 获取用户列表  
GET  /api/users/:address     # 获取用户详情

# 代币管理
POST /api/tokens/allocate    # 分配代币

# 交易管理  
POST /api/transactions       # 创建交易
GET  /api/transactions/pending  # 获取交易池

# 矿工管理
POST /api/miners             # 注册矿工
GET  /api/miners             # 获取矿工列表
POST /api/mining/mine        # 执行挖矿

# 区块链浏览
GET  /api/blockchain/info    # 获取链信息
GET  /api/blockchain/blocks  # 获取所有区块
GET  /api/blockchain/blocks/:index  # 获取指定区块

# 系统健康
GET  /api/health             # 健康检查
```

## 💡 性能优化建议

1. **降低挖矿难度**: 在测试时将 `difficulty` 设为 2-3
2. **减少交易池大小**: 调整 `maxTransactionsPerBlock`
3. **使用生产构建**: 前端使用 `npm run build`

## 🎯 学习目标

通过使用此系统，你将学会：

1. **区块链基础概念**
   - 区块结构和哈希链接
   - 交易验证和数字签名
   - 共识机制和挖矿原理

2. **加密技术应用**  
   - SHA-256哈希算法
   - 公私钥加密体系
   - 随机数生成

3. **系统架构设计**
   - 前后端分离架构
   - RESTful API设计
   - 实时数据同步

4. **实际操作经验**
   - 钱包地址生成
   - 交易创建和广播
   - 挖矿和区块生成
   - 区块链数据查询

## ⚠️ 重要说明

此系统仅用于教育和学习目的：

- ❌ **不要用于生产环境**
- ❌ **不支持真实的资产交易** 
- ❌ **没有网络安全加固**
- ❌ **没有数据持久化**
- ✅ **适合学习区块链原理**
- ✅ **理解系统工作流程**
- ✅ **实验不同的参数配置**

---

如有问题或建议，请在GitHub仓库提交Issue！🤝
