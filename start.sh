#!/bin/bash

# 区块链学习系统启动脚本
# 使用方法: ./start.sh

echo "🚀 启动区块链学习系统..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js"
    echo "请访问 https://nodejs.org 下载安装 Node.js 16+ 版本"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未安装 npm"
    exit 1
fi

echo "✅ npm 版本: $(npm -v)"

echo ""
echo "📋 请按照以下步骤手动启动系统："
echo ""
echo "1️⃣ 启动后端服务："
echo "   cd backend"
echo "   npm install"
echo "   npm run build"
echo "   npm start"
echo ""
echo "2️⃣ 新开终端窗口，启动前端服务："
echo "   cd frontend"
echo "   npm install"
echo "   npm start"
echo ""
echo "3️⃣ 访问地址："
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:3001"
echo ""
echo "💡 提示："
echo "   - 确保两个服务都成功启动"
echo "   - 前端会自动代理到后端API"
echo "   - 如遇问题，请检查端口是否被占用"
echo ""

# 询问是否自动启动后端
read -p "是否要自动启动后端服务? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔧 正在启动后端..."
    cd backend
    
    if [ ! -d "node_modules" ]; then
        echo "📦 安装后端依赖..."
        npm install
    fi
    
    echo "🏗️ 构建后端..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "🚀 启动后端服务..."
        echo "   后端日志将显示在当前窗口"
        echo "   按 Ctrl+C 停止服务"
        echo "   请在新终端窗口启动前端服务"
        echo ""
        npm start
    else
        echo "❌ 后端构建失败"
        exit 1
    fi
else
    echo "ℹ️ 请手动执行上述步骤启动系统"
fi
