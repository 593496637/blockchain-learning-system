#!/bin/bash

echo "🚀 启动区块链学习系统"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js (https://nodejs.org/)"
    echo "💡 安装完成后重新运行此脚本"
    exit 1
fi

echo "✅ Node.js 已安装: $(node --version)"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ 请先安装 npm"
    exit 1
fi

echo "✅ npm 已安装: $(npm --version)"

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📁 工作目录: $(pwd)"

# 检查目录结构
if [ ! -d "backend" ]; then
    echo "❌ 找不到 backend 目录"
    exit 1
fi

if [ ! -d "frontend" ]; then
    echo "❌ 找不到 frontend 目录"
    exit 1
fi

# 启动后端
echo ""
echo "📡 正在启动后端服务..."
cd backend

# 检查package.json是否存在
if [ ! -f "package.json" ]; then
    echo "❌ 后端目录中找不到 package.json"
    exit 1
fi

# 安装后端依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装后端依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 后端依赖安装失败"
        exit 1
    fi
fi

# 启动后端服务
echo "🔄 启动后端开发服务器..."
npm run dev &
BACKEND_PID=$!

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 8

# 检查后端是否成功启动
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ 后端服务启动失败"
    exit 1
fi

echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"

# 启动前端
echo ""
echo "🎨 正在启动前端应用..."
cd ../frontend

# 检查package.json是否存在
if [ ! -f "package.json" ]; then
    echo "❌ 前端目录中找不到 package.json"
    kill $BACKEND_PID
    exit 1
fi

# 安装前端依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 前端依赖安装失败"
        kill $BACKEND_PID
        exit 1
    fi
fi

# 启动前端服务
echo "🔄 启动前端开发服务器..."
npm start &
FRONTEND_PID=$!

# 等待前端启动
echo "⏳ 等待前端服务启动..."
sleep 5

echo ""
echo "✅ 系统启动完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 后端服务: http://localhost:3001"
echo "🎨 前端应用: http://localhost:3000"
echo "🔍 健康检查: http://localhost:3001/api/health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 提示:"
echo "   - 前端界面会自动在浏览器中打开"
echo "   - 按 Ctrl+C 停止所有服务"
echo "   - 如需重启，请重新运行此脚本"
echo ""

# 等待信号并清理进程
trap "echo ''; echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '✅ 所有服务已停止'; exit" INT

# 保持脚本运行
wait
