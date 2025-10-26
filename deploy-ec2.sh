#!/bin/bash

# Financial API EC2 Deployment Script
echo "🚀 Deploying Financial API to EC2..."

# Update system
sudo yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Create application directory
sudo mkdir -p /var/www/financial-api
sudo chown ec2-user:ec2-user /var/www/financial-api
cd /var/www/financial-api

# Copy application files (you'll need to upload these)
# scp -i your-key.pem -r ./src ./package.json ./server.js ec2-user@your-instance:/var/www/financial-api/

# Install dependencies
npm install

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'financial-api',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure nginx
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Create nginx config
sudo tee /etc/nginx/conf.d/financial-api.conf << EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Restart nginx
sudo systemctl restart nginx

echo "✅ Deployment complete! Your API is running on port 80"
echo "🌐 Access your API at: http://your-ec2-public-ip"
