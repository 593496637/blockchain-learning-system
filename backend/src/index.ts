// backend/src/index.ts

import express from 'express';
import cors from 'cors';
import { Blockchain } from './blockchain';
import { ApiResponse } from './types';

const app = express();
const PORT = 3001;

// 创建区块链实例
const blockchain = new Blockchain();

// 中间件
app.use(cors());
app.use(express.json());

// 日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 用户管理接口
app.post('/api/users', (req, res) => {
  try {
    const { name } = req.body;
    const user = blockchain.createUser(name);
    
    const response: ApiResponse = {
      success: true,
      data: user,
      message: '用户创建成功'
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建用户失败',
      message: error instanceof Error ? error.message : '未知错误'
    });
  }
});

app.get('/api/users', (req, res) => {
  try {
    const users = blockchain.getUsers();
    
    const response: ApiResponse = {
      success: true,
      data: users,
      message: `共找到 ${users.length} 个用户`
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取用户列表失败'
    });
  }
});

app.get('/api/users/:address', (req, res) => {
  try {
    const { address } = req.params;
    const user = blockchain.getUser(address);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }

    const transactions = blockchain.getUserTransactionHistory(address);
    
    const response: ApiResponse = {
      success: true,
      data: {
        user,
        transactions
      }
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '查询用户信息失败'
    });
  }
});

// 代币管理接口
app.post('/api/tokens/allocate', (req, res) => {
  try {
    const { userAddress, amount } = req.body;
    
    if (!userAddress || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: '参数无效'
      });
    }

    const success = blockchain.allocateTokens(userAddress, amount);
    
    if (success) {
      res.json({
        success: true,
        message: `成功向用户分配 ${amount} 个代币`
      });
    } else {
      res.status(400).json({
        success: false,
        error: '分配代币失败'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '分配代币失败'
    });
  }
});

// 交易管理接口
app.post('/api/transactions', (req, res) => {
  try {
    const { from, to, amount } = req.body;
    
    if (!from || !to || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: '交易参数无效'
      });
    }

    const transactionId = blockchain.createTransaction(from, to, amount);
    
    if (transactionId) {
      res.json({
        success: true,
        data: { transactionId },
        message: '交易已创建并加入交易池'
      });
    } else {
      res.status(400).json({
        success: false,
        error: '交易创建失败，请检查余额和账户'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建交易失败'
    });
  }
});

app.get('/api/transactions/pending', (req, res) => {
  try {
    const pendingTransactions = blockchain.getPendingTransactions();
    
    res.json({
      success: true,
      data: pendingTransactions,
      message: `交易池中有 ${pendingTransactions.length} 笔待处理交易`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取交易池失败'
    });
  }
});

// 矿工管理接口
app.post('/api/miners', (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: '矿工名称不能为空'
      });
    }

    const minerAddress = blockchain.registerMiner(name);
    
    res.json({
      success: true,
      data: { minerAddress },
      message: '矿工注册成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '注册矿工失败'
    });
  }
});

app.get('/api/miners', (req, res) => {
  try {
    const miners = blockchain.getMiners();
    
    res.json({
      success: true,
      data: miners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取矿工列表失败'
    });
  }
});

app.post('/api/mining/mine', (req, res) => {
  try {
    const { minerAddress } = req.body;
    
    if (!minerAddress) {
      return res.status(400).json({
        success: false,
        error: '矿工地址不能为空'
      });
    }

    const newBlock = blockchain.mineBlock(minerAddress);
    
    if (newBlock) {
      res.json({
        success: true,
        data: newBlock,
        message: '挖矿成功！新区块已加入区块链'
      });
    } else {
      res.status(400).json({
        success: false,
        error: '挖矿失败，可能是交易池为空或矿工状态异常'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '挖矿失败'
    });
  }
});

// 区块链浏览器接口
app.get('/api/blockchain/info', (req, res) => {
  try {
    const chain = blockchain.getChain();
    const pendingTransactions = blockchain.getPendingTransactions();
    const users = blockchain.getUsers();
    const miners = blockchain.getMiners();
    const config = blockchain.getSystemConfig();
    
    res.json({
      success: true,
      data: {
        blockHeight: chain.length,
        pendingTransactionCount: pendingTransactions.length,
        totalUsers: users.length,
        totalMiners: miners.length,
        config
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取区块链信息失败'
    });
  }
});

app.get('/api/blockchain/blocks', (req, res) => {
  try {
    const chain = blockchain.getChain();
    
    res.json({
      success: true,
      data: chain
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取区块链失败'
    });
  }
});

app.get('/api/blockchain/blocks/:index', (req, res) => {
  try {
    const { index } = req.params;
    const blockIndex = parseInt(index);
    const chain = blockchain.getChain();
    
    if (isNaN(blockIndex) || blockIndex < 0 || blockIndex >= chain.length) {
      return res.status(404).json({
        success: false,
        error: '区块不存在'
      });
    }

    const block = chain[blockIndex];
    
    res.json({
      success: true,
      data: block
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取区块信息失败'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '区块链系统运行正常',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log('🚀 区块链学习系统启动成功！');
  console.log(`📡 后端服务运行在: http://localhost:${PORT}`);
  console.log(`📊 API文档地址: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(50));
  
  // 创建一些测试数据
  console.log('📝 正在创建测试数据...');
  
  // 创建测试用户
  const alice = blockchain.createUser('Alice');
  const bob = blockchain.createUser('Bob');
  
  // 分配初始代币
  blockchain.allocateTokens(alice.address, 100);
  blockchain.allocateTokens(bob.address, 50);
  
  // 注册测试矿工
  const miner1 = blockchain.registerMiner('Miner_Alpha');
  const miner2 = blockchain.registerMiner('Miner_Beta');
  
  console.log('✅ 测试数据创建完成！');
  console.log('👥 测试用户: Alice (100代币), Bob (50代币)');
  console.log('⛏️  测试矿工: Miner_Alpha, Miner_Beta');
});
