#!/bin/bash

# 区块链学习系统快速部署脚本
# 使用方法: ./deploy.sh

echo "🚀 开始部署区块链学习系统..."

# 检查Node.js版本
echo "📋 检查系统环境..."
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js，请先安装 Node.js 16+ 版本"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ 错误: Node.js 版本过低，需要 16+ 版本，当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未安装 npm"
    exit 1
fi

echo "✅ npm 版本: $(npm -v)"

# 安装并启动后端
echo ""
echo "🔧 安装后端依赖..."
cd backend
if npm install; then
    echo "✅ 后端依赖安装成功"
else
    echo "❌ 后端依赖安装失败"
    exit 1
fi

echo ""
echo "🏗️ 构建后端..."
if npm run build; then
    echo "✅ 后端构建成功"
else
    echo "❌ 后端构建失败"
    exit 1
fi

echo ""
echo "🚀 启动后端服务..."
# 在后台启动后端
nohup npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"
echo "   日志文件: backend.log"

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 5

# 检查后端是否启动成功
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ 后端服务运行正常"
else
    echo "⚠️ 后端服务可能未完全启动，请检查日志"
fi

# 回到根目录
cd ..

# 安装并启动前端
echo ""
echo "🔧 安装前端依赖..."
cd frontend
if npm install; then
    echo "✅ 前端依赖安装成功"
else
    echo "❌ 前端依赖安装失败"
    exit 1
fi

echo ""
echo "🎨 启动前端开发服务器..."
# 在后台启动前端
nohup npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ 前端服务已启动 (PID: $FRONTEND_PID)"
echo "   日志文件: frontend.log"

# 回到根目录
cd ..

# 保存进程ID
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

echo ""
echo "🎉 部署完成！"
echo ""
echo "📱 访问地址:"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:3001"
echo ""
echo "📋 服务状态:"
echo "   后端进程ID: $BACKEND_PID"
echo "   前端进程ID: $FRONTEND_PID"
echo ""
echo "📝 日志文件:"
echo "   后端日志: backend.log"
echo "   前端日志: frontend.log"
echo ""
echo "🛑 停止服务:"
echo "   运行: ./stop.sh"
echo ""
echo "💡 提示:"
echo "   - 首次启动可能需要1-2分钟"
echo "   - 如果前端未自动打开，请手动访问 http://localhost:3000"
echo "   - 系统会自动处理跨域问题"
echo ""

# 尝试自动打开浏览器
echo "🌐 尝试打开浏览器..."
sleep 10

if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
    open http://localhost:3000
elif command -v start &> /dev/null; then
    start http://localhost:3000
else
    echo "   请手动在浏览器中打开: http://localhost:3000"
fi

echo ""
echo "✨ 区块链学习系统已成功部署并启动！"
echo "   享受你的区块链学习之旅吧！ 🎓"
