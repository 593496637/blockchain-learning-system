#!/bin/bash

echo "🚀 启动区块链学习系统"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js"
    exit 1
fi

# 启动后端
echo "📡 启动后端服务..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 安装后端依赖..."
    npm install
fi

npm run dev &
BACKEND_PID=$!

# 等待后端启动
sleep 5

# 启动前端
echo "🎨 启动前端应用..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

npm start &
FRONTEND_PID=$!

echo "✅ 系统启动完成！"
echo "📡 后端服务: http://localhost:3001"
echo "🎨 前端应用: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待信号
trap "echo '停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
