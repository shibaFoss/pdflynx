#!/bin/bash

# --- PdfLynx: Nginx Site Configuration Script ---
# Usage: sudo ./setup_nginx.sh yourdomain.com

set -e

# Domain defaults to pdflynx.com if not provided
DOMAIN=${1:-"pdflynx.com"}

if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root or using sudo."
  exit 1
fi

CONF_FILE="/etc/nginx/sites-available/pdflynx"
EXAMPLE_FILE="./nginx.conf.example"

if [ ! -f "$EXAMPLE_FILE" ]; then
    echo "❌ Error: nginx.conf.example not found in current directory."
    exit 1
fi

echo "🚀 Configuring Nginx for domain: $DOMAIN..."

# 1. Copy the example config to sites-available
cp "$EXAMPLE_FILE" "$CONF_FILE"

# 2. Update the server_name inside the config using sed
# Replaces 'example.com' or 'server_name example.com;' with the provided domain
sed -i "s/server_name .*/server_name $DOMAIN;/g" "$CONF_FILE"

# 3. Create a symbolic link to sites-enabled
if [ ! -L "/etc/nginx/sites-enabled/pdflynx" ]; then
    ln -s "$CONF_FILE" "/etc/nginx/sites-enabled/"
    echo "🔗 Created symbolic link: /etc/nginx/sites-enabled/pdflynx"
fi

# 4. Remove default Nginx site if it exists (to avoid conflicts on Port 80)
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    rm "/etc/nginx/sites-enabled/default"
    echo "🗑️ Removed default Nginx site configuration."
fi

# 5. Test Nginx Configuration
echo "🔍 Testing Nginx configuration..."
nginx -t

# 6. Restart Nginx
echo "🔄 Restarting Nginx..."
systemctl restart nginx

echo "--------------------------------------------------------"
echo "✅ Nginx is now configured for $DOMAIN!"
echo "📡 Traffic is being routed to Port 3000 (Frontend) and Port 5000 (Backend)."
echo "--------------------------------------------------------"
echo "👉 RECOMMENDED: Secure your site with SSL using Certbot:"
echo "sudo apt install -y python3-certbot-nginx"
echo "sudo certbot --nginx -d $DOMAIN"
