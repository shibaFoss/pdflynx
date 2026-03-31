#!/bin/bash

# --- PdfLynx: Automated Deployment Script for Debian ---
# This script installs all system dependencies, builds the app, and starts PM2.

set -e # Exit on error

echo "--------------------------------------------------------"
echo "🚀 Starting PdfLynx Deployment on Debian Linux"
echo "--------------------------------------------------------"

# 1. Check for Sudo / Root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root or using sudo (e.g., sudo ./deploy.sh)"
  exit 1
fi

# 2. Update System and Install Core Packages
echo "🔄 Updating system packages..."
apt update && apt upgrade -y
apt install -y curl git zip build-essential

# 3. Install Node.js (v20 LTS Recommended)
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js v20 via NodeSource..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
else
    echo "✅ Node.js $(node -v) is already installed."
fi

# 4. Install PDF & Image Processing CLI Tools
echo "📚 Installing PDF processing dependencies (qpdf, Ghostscript, Poppler, ImageMagick, LibreOffice)..."
apt install -y qpdf ghostscript poppler-utils imagemagick \
                libreoffice-writer libreoffice-calc libreoffice-impress \
                nginx

# 5. Install global PM2 for process management
if ! command -v pm2 &> /dev/null; then
    echo "⚙️ Installing PM2 globally..."
    npm install -g pm2
fi

# 6. Backend: Install and Build (Root Directory)
echo "🏗️ Building Backend..."
npm install
npm run build

# 7. Frontend: Install and Build
if [ -d "frontend" ]; then
    echo "🏗️ Building Frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
else
    echo "⚠️ Warning: Frontend directory not found. Skipping frontend build."
fi

# 8. Start Services with PM2
echo "📡 Orchestrating services with PM2..."

# Stop existing processes to avoid conflicts if re-deploying
pm2 delete pdflynx-backend pdflynx-frontend 2>/dev/null || true

# Start Backend (Port 5000 by default)
pm2 start dist/server.js --name "pdflynx-backend" --env production

# Start Frontend (Port 3000 by default)
if [ -d "frontend" ]; then
    cd frontend
    pm2 start npm --name "pdflynx-frontend" -- start
    cd ..
fi

# Save PM2 process list for persistence
pm2 save

echo "--------------------------------------------------------"
echo "✅ DEPLOYMENT COMPLETE!"
echo "--------------------------------------------------------"
echo "📊 PM2 Status:"
pm2 status
echo "--------------------------------------------------------"
echo "👉 NEXT STEPS:"
echo "1. Configure Nginx: sudo cp nginx.conf.example /etc/nginx/sites-available/pdflynx"
echo "2. Edit the config: sudo nano /etc/nginx/sites-available/pdflynx (set your domain)"
echo "3. Link config: sudo ln -s /etc/nginx/sites-available/pdflynx /etc/nginx/sites-enabled/"
echo "4. Restart Nginx: sudo systemctl restart nginx"
echo "5. (Optional) Run certbot for SSL: sudo apt install python3-certbot-nginx && sudo certbot --nginx"
