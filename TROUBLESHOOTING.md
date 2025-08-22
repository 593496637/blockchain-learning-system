# 🛠️ 故障排除指南

## 常见启动问题及解决方案

### 🔧 快速启动方法

**推荐步骤：**

1. **启动后端**（终端1）：
   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```

2. **启动前端**（终端2）：
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **访问系统**：
   - 前端：http://localhost:3000
   - 后端：http://localhost:3001

---

## 📋 常见问题解决

### ❌ 问题1: "webpack dev server allowedHosts 配置错误"

**错误信息**：
```
Invalid options object. Dev Server has been initialized using an options object that does not match the API schema.
- options.allowedHosts[0] should be a non-empty string.
```

**解决方法**：
```bash
# 在 frontend/.env 文件中添加以下配置（已自动修复）：
DANGEROUSLY_DISABLE_HOST_CHECK=true
SKIP_PREFLIGHT_CHECK=true
HOST=localhost
PORT=3000

# 如果问题仍然存在，尝试：
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### ❌ 问题2: "端口被占用"

**错误信息**：
```
Error: listen EADDRINUSE: address already in use :::3000
Error: listen EADDRINUSE: address already in use :::3001
```

**解决方法**：
```bash
# 查看端口占用
lsof -ti:3000
lsof -ti:3001

# 杀掉占用端口的进程
kill -9 $(lsof -ti:3000)
kill -9 $(lsof -ti:3001)

# 或者使用不同端口
PORT=3002 npm start  # 前端
PORT=3003 npm start  # 后端
```

### ❌ 问题3: "依赖安装失败"

**错误信息**：
```
npm ERR! peer dep missing
npm ERR! network timeout
```

**解决方法**：
```bash
# 清理npm缓存
npm cache clean --force

# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install

# 使用yarn替代npm
npm install -g yarn
yarn install
```

### ❌ 问题4: "TypeScript编译错误"

**错误信息**：
```
error TS2307: Cannot find module
error TS2304: Cannot find name
```

**解决方法**：
```bash
# 后端
cd backend
npm install @types/node @types/express @types/cors @types/uuid
npm run build

# 前端
cd frontend
npm install @types/react @types/react-dom
npm start
```

### ❌ 问题5: "API连接失败"

**错误信息**：
```
Network Error
Cannot connect to server
```

**解决方法**：
1. 确保后端服务已启动（http://localhost:3001/api/health）
2. 检查防火墙设置
3. 验证CORS配置：
   ```javascript
   // backend/src/index.ts
   app.use(cors({
     origin: 'http://localhost:3000',
     credentials: true
   }));
   ```

### ❌ 问题6: "React组件报错"

**错误信息**：
```
Module not found: Can't resolve './components/...'
```

**解决方法**：
1. 检查组件文件是否存在
2. 验证import路径
3. 重启开发服务器：
   ```bash
   # 停止服务 (Ctrl+C)
   npm start
   ```

### ❌ 问题7: "浏览器白屏"

**可能原因**：
- 前端编译错误
- 组件渲染异常
- API调用失败

**解决方法**：
1. 打开浏览器开发者工具 (F12)
2. 查看Console标签页的错误信息
3. 检查Network标签页的API请求
4. 重新构建项目：
   ```bash
   cd frontend
   rm -rf build
   npm run build
   npm start
   ```

---

## 🔍 调试步骤

### 1. 检查环境

```bash
# 检查Node.js版本 (需要16+)
node --version

# 检查npm版本
npm --version

# 检查项目目录结构
ls -la
```

### 2. 验证后端

```bash
# 测试后端健康检查
curl http://localhost:3001/api/health

# 预期响应
{
  "success": true,
  "message": "区块链系统运行正常",
  "timestamp": "2025-08-22T01:30:00.000Z"
}
```

### 3. 验证前端

```bash
# 检查前端是否能正常访问
curl http://localhost:3000

# 或在浏览器访问
open http://localhost:3000
```

### 4. 检查日志

```bash
# 后端日志（在后端启动的终端查看）
# 应该看到类似输出：
🚀 区块链学习系统启动成功！
📡 后端服务运行在: http://localhost:3001
✅ 测试数据创建完成！

# 前端日志（在前端启动的终端查看）
# 应该看到类似输出：
webpack compiled successfully
Local: http://localhost:3000
```

---

## 📦 依赖版本要求

### 系统要求
- **Node.js**: 16.0.0 或更高版本
- **npm**: 7.0.0 或更高版本
- **操作系统**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

### 关键依赖版本
```json
// 后端 (backend/package.json)
{
  "express": "^4.18.2",
  "cors": "^2.8.5", 
  "uuid": "^9.0.0",
  "typescript": "^5.0.0"
}

// 前端 (frontend/package.json)
{
  "react": "^18.2.0",
  "antd": "^5.4.0",
  "axios": "^1.3.4",
  "typescript": "^4.9.5"
}
```

---

## 🚨 紧急修复

### 完全重置项目

如果以上方法都无效，尝试完全重置：

```bash
# 1. 备份重要文件（如有修改）
cp backend/src/index.ts backup/
cp frontend/src/App.tsx backup/

# 2. 清理所有构建文件
cd backend && rm -rf node_modules dist package-lock.json
cd ../frontend && rm -rf node_modules build package-lock.json

# 3. 重新安装依赖
cd backend && npm install
cd ../frontend && npm install

# 4. 重新构建并启动
cd backend && npm run build && npm start &
cd ../frontend && npm start
```

### 使用Docker (高级)

如果本地环境问题持续，可以使用Docker：

```dockerfile
# Dockerfile示例
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

---

## 📞 获取帮助

如果问题仍然存在：

1. **查看GitHub Issues**: https://github.com/593496637/blockchain-learning-system/issues
2. **创建新Issue**: 包含错误信息、环境信息和重现步骤
3. **检查文档**: README.md 和 INSTALL.md
4. **联系开发者**: 593496637@qq.com

---

## ✅ 成功启动的标志

当系统正常运行时，你应该看到：

1. **后端终端输出**：
   ```
   🚀 区块链学习系统启动成功！
   📡 后端服务运行在: http://localhost:3001
   ✅ 测试数据创建完成！
   👥 测试用户: Alice (100代币), Bob (50代币)
   ⛏️ 测试矿工: Miner_Alpha, Miner_Beta
   ```

2. **前端终端输出**：
   ```
   webpack compiled successfully
   Local: http://localhost:3000
   On Your Network: http://192.168.x.x:3000
   ```

3. **浏览器显示**：
   - 欢迎页面正常加载
   - 侧边栏菜单可点击
   - 系统状态显示"运行正常"

4. **API测试**：
   ```bash
   curl http://localhost:3001/api/health
   # 返回成功响应
   ```

---

**祝您使用愉快！** 🎉
