# 🛠️ 安装与使用指南

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

#### 方式一：使用启动脚本 (推荐)

```bash
# 给脚本添加执行权限 (Linux/macOS)
chmod +x start.sh

# 运行启动脚本
./start.sh
```

#### 方式二：手动启动

```bash
# 启动后端 (终端1)
cd backend
npm install
npm run dev

# 启动前端 (终端2)
cd frontend  
npm install
npm start
```

### 3. 访问系统

- **前端界面**: http://localhost:3000
- **后端API**: http://localhost:3001
- **健康检查**: http://localhost:3001/api/health

## 📖 使用教程

### 第一次使用系统

1. **系统启动后**，访问 http://localhost:3000
2. **系统会自动创建**测试用户和矿工：
   - 用户：Alice (100代币), Bob (50代币) 
   - 矿工：Miner_Alpha, Miner_Beta

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
  difficulty: 3,     // 修改挖矿难度
  maxTransactionsPerBlock: 20
};
```

## 🐛 常见问题

### Q: 无法连接到后端服务

**A**: 检查以下几点：
1. 后端是否正常启动 (端口3001)
2. 防火墙是否阻止了端口访问
3. 查看后端控制台是否有错误信息

### Q: 前端页面空白

**A**: 检查：
1. 前端是否正常启动 (端口3000)
2. 浏览器控制台是否有错误
3. 确认后端API正常响应

### Q: 挖矿一直不成功

**A**: 可能原因：
1. 交易池为空 - 先创建一些交易
2. 矿工状态异常 - 重新注册矿工
3. 挖矿难度过高 - 降低difficulty参数

### Q: 交易创建失败

**A**: 检查：
1. 发送方余额是否足够 (金额+手续费)
2. 发送方和接收方地址是否正确
3. 金额是否为正数

## 🔄 重置系统

如需重置整个区块链系统：

1. 停止前后端服务 (Ctrl+C)
2. 重新启动后端服务
3. 系统会自动重新初始化

## 📚 API文档

### 主要API端点

```
用户管理:
- POST /api/users              创建用户
- GET  /api/users              获取用户列表  
- GET  /api/users/:address     获取用户详情

代币管理:
- POST /api/tokens/allocate    分配代币

交易管理:  
- POST /api/transactions       创建交易
- GET  /api/transactions/pending  获取交易池

矿工管理:
- POST /api/miners             注册矿工
- GET  /api/miners             获取矿工列表
- POST /api/mining/mine        执行挖矿

区块链浏览:
- GET  /api/blockchain/info    获取链信息
- GET  /api/blockchain/blocks  获取所有区块
- GET  /api/blockchain/blocks/:index  获取指定区块
```

### API响应格式

```typescript
{
  success: boolean,    // 请求是否成功
  data?: any,         // 返回数据
  message?: string,   // 成功消息  
  error?: string      // 错误信息
}
```

## 🎯 学习目标

通过使用此系统，你将学会：

1. **区块链基础概念**
   - 区块结构和哈希链接
   - 交易验证和数字签名
   - 共识机制和挖矿原理

2. **加密技术应用**  
   - SHA-256哈希算法
   - 公私钥加密体系
   - 默克尔树数据结构

3. **系统架构设计**
   - 前后端分离架构
   - RESTful API设计
   - 实时数据同步

4. **实际操作经验**
   - 钱包地址生成
   - 交易创建和广播
   - 挖矿和区块生成
   - 区块链数据查询

## 🔗 相关资源

- [区块链技术指南](https://github.com/yeasy/blockchain_guide)
- [比特币白皮书](https://bitcoin.org/bitcoin.pdf)  
- [以太坊开发文档](https://ethereum.org/zh/developers/docs/)
- [Node.js官方文档](https://nodejs.org/docs/)
- [React官方文档](https://react.dev/)

## ⚠️ 重要说明

此系统仅用于教育和学习目的：

- ❌ **不要用于生产环境**
- ❌ **不支持真实的资产交易** 
- ❌ **没有网络安全加固**
- ✅ **适合学习区块链原理**
- ✅ **理解系统工作流程**
- ✅ **实验不同的参数配置**

---

如有问题或建议，请在GitHub仓库提交Issue！🤝
