#!/bin/bash
set -e

SERVER="root@47.115.207.89"
APP_DIR="/opt/puppy-diary"

echo "=== 1. 构建前端 ==="
cd "$(dirname "$0")/.."
npm run build

echo "=== 2. 创建服务器目录 ==="
ssh $SERVER "mkdir -p $APP_DIR/dist $APP_DIR/server"

echo "=== 3. 上传文件 ==="
ssh $SERVER "rm -rf $APP_DIR/dist/*"
scp -r dist/* $SERVER:$APP_DIR/dist/
scp -r server/*.js server/*.json server/*.conf server/routes $SERVER:$APP_DIR/server/
scp ecosystem.config.cjs $SERVER:$APP_DIR/

echo "=== 4. 安装后端依赖 ==="
ssh $SERVER "cd $APP_DIR/server && npm install --omit=dev"

echo "=== 5. 配置 Nginx ==="
ssh $SERVER "sudo cp $APP_DIR/server/nginx.conf /etc/nginx/sites-available/puppy-diary"
ssh $SERVER "sudo ln -sf /etc/nginx/sites-available/puppy-diary /etc/nginx/sites-enabled/"
ssh $SERVER "sudo rm -f /etc/nginx/sites-enabled/default"
ssh $SERVER "sudo nginx -t && sudo systemctl reload nginx"

echo "=== 6. 启动/重启后端 ==="
ssh $SERVER "cd $APP_DIR && pm2 start ecosystem.config.cjs || pm2 reload ecosystem.config.cjs"
ssh $SERVER "pm2 save"

echo "=== 部署完成 ==="
echo "访问: http://47.115.207.89"
