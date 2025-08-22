#!/bin/bash

# 区块链学习系统服务停止脚本
# 使用方法: ./stop.sh

echo "🛑 正在停止区块链学习系统..."

# 检查进程ID文件是否存在
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    echo "📋 发现后端进程 ID: $BACKEND_PID"
    
    # 检查进程是否还在运行
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "🔄 正在停止后端服务..."
        kill $BACKEND_PID
        
        # 等待进程结束
        sleep 2
        
        # 如果进程还在运行，强制停止
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            echo "🔨 强制停止后端服务..."
            kill -9 $BACKEND_PID
        fi
        
        echo "✅ 后端服务已停止"
    else
        echo "ℹ️ 后端服务未运行"
    fi
    
    # 删除PID文件
    rm .backend.pid
else
    echo "ℹ️ 未找到后端进程文件"
fi

if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    echo "📋 发现前端进程 ID: $FRONTEND_PID"
    
    # 检查进程是否还在运行
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "🔄 正在停止前端服务..."
        kill $FRONTEND_PID
        
        # 等待进程结束
        sleep 2
        
        # 如果进程还在运行，强制停止
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            echo "🔨 强制停止前端服务..."
            kill -9 $FRONTEND_PID
        fi
        
        echo "✅ 前端服务已停止"
    else
        echo "ℹ️ 前端服务未运行"
    fi
    
    # 删除PID文件
    rm .frontend.pid
else
    echo "ℹ️ 未找到前端进程文件"
fi

# 尝试停止所有相关的Node.js进程
echo ""
echo "🔍 查找其他相关进程..."

# 查找并停止可能残留的进程
BACKEND_PROCESSES=$(ps aux | grep "blockchain-learning-backend\|ts-node.*index.ts" | grep -v grep | awk '{print $2}')
if [ ! -z "$BACKEND_PROCESSES" ]; then
    echo "🔄 停止残留的后端进程..."
    echo $BACKEND_PROCESSES | xargs kill 2>/dev/null
fi

FRONTEND_PROCESSES=$(ps aux | grep "react-scripts start" | grep -v grep | awk '{print $2}')
if [ ! -z "$FRONTEND_PROCESSES" ]; then
    echo "🔄 停止残留的前端进程..."
    echo $FRONTEND_PROCESSES | xargs kill 2>/dev/null
fi

# 检查端口占用
echo ""
echo "🔍 检查端口占用情况..."

if command -v lsof &> /dev/null; then
    # 检查3001端口（后端）
    BACKEND_PORT_PROCESS=$(lsof -ti:3001)
    if [ ! -z "$BACKEND_PORT_PROCESS" ]; then
        echo "⚠️ 端口3001仍被占用，进程ID: $BACKEND_PORT_PROCESS"
        echo "🔨 停止占用端口3001的进程..."
        kill -9 $BACKEND_PORT_PROCESS 2>/dev/null
    fi
    
    # 检查3000端口（前端）
    FRONTEND_PORT_PROCESS=$(lsof -ti:3000)
    if [ ! -z "$FRONTEND_PORT_PROCESS" ]; then
        echo "⚠️ 端口3000仍被占用，进程ID: $FRONTEND_PORT_PROCESS"
        echo "🔨 停止占用端口3000的进程..."
        kill -9 $FRONTEND_PORT_PROCESS 2>/dev/null
    fi
fi

# 清理日志文件（可选）
echo ""
echo "🧹 清理选项..."
read -p "是否要清理日志文件? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "backend.log" ]; then
        rm backend.log
        echo "✅ 已删除 backend.log"
    fi
    
    if [ -f "frontend.log" ]; then
        rm frontend.log
        echo "✅ 已删除 frontend.log"
    fi
    
    echo "✅ 日志文件清理完成"
else
    echo "ℹ️ 保留日志文件"
fi

echo ""
echo "✅ 区块链学习系统已完全停止"
echo ""
echo "💡 下次启动系统:"
echo "   运行: ./deploy.sh 或 ./start.sh"
echo ""
echo "📝 如需查看日志:"
echo "   后端日志: cat backend.log"
echo "   前端日志: cat frontend.log"
