# Production Deployment Guide: PdfLynx.com

This comprehensive guide outlines the exact, step-by-step procedures to deploy the full PdfLynx suite securely to a production Ubuntu/Debian Linux environment using Nginx, PM2, and Node.js v22.

---

## 1. System Architecture & Security Model

PdfLynx employs a highly secure, two-tier architecture on the single host machine to prevent unauthorized scraping or API abuse:

1.  **The Backend (Port 5000)**: A Fastify server processing heavy PDF operations via a concurrency-limited Job Queue. It is strictly bound to `127.0.0.1` and protected by a hardcoded `X-Internal-Key` middleware. **It is never exposed directly to the internet.**
2.  **The Frontend (Port 3000)**: A Next.js server bound to `127.0.0.1`. It serves the UI and acts as a **Secure Proxy Bridge** (via `/api/pdf/[...slug]/route.ts`), injecting the internal API key and routing traffic to the backend.
3.  **The Reverse Proxy (Nginx)**: Listens on Ports 80 and 443 (SSL) for `pdflynx.com`. It strictly proxies all traffic *only* to the Next.js frontend on Port 3000.

---

## 2. Server Preparation & Dependencies

Ensure you are running as a non-root user with `sudo` privileges.

### Install Linux System Packages
These CLI tools are mandatory for the backend engine to manipulate PDFs and images:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y qpdf ghostscript poppler-utils imagemagick nginx curl
```

### Install Node.js v22 & PM2
PdfLynx utilizes native `--env-file` support, which requires Node.js v22:
```bash
# Install Node.js v22 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation (should be v22+)
node -v

# Install PM2 Process Manager globally
sudo npm install -g pm2
```

---

## 3. Cloning & Building the Application

### 1. Clone the Source
Navigate to your preferred directory (e.g., `/var/www/` or `~/app/`):
```bash
git clone <your-repo-url> pdflynx
cd pdflynx
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Build Production Bundles
```bash
# Compile the Fastify Backend (outputs to /dist)
npm run build

# Compile the Next.js Frontend
cd frontend
npm run build
cd ..
```

---

## 4. Environment Configuration

You must create two environment files containing the same secure 32-character key to bridge the frontend and backend. 

Generate a secure key first:
```bash
openssl rand -hex 32
```

### 1. Configure the Backend
Create `.env` in the root `pdflynx/` directory:
```bash
cat <<EOT > .env
PORT=5000
HOST=127.0.0.1
NODE_ENV=production
X_INTERNAL_KEY=YOUR_GENERATED_32_CHAR_KEY_HERE
EOT
```

### 2. Configure the Frontend
Create `.env` in the `pdflynx/frontend/` directory:
```bash
cat <<EOT > frontend/.env
BACKEND_INTERNAL_URL=http://127.0.0.1:5000
INTERNAL_API_KEY=YOUR_GENERATED_32_CHAR_KEY_HERE
EOT
```

---

## 5. Starting the Services via PM2

We will use PM2 to ensure both the backend and frontend stay alive indefinitely and automatically restart on server reboots.

```bash
# Start the Fastify Backend (using Node 22's env-file flag)
pm2 start "node --env-file=.env dist/server.js" --name "pdflynx-backend"

# Start the Next.js Frontend
cd frontend
pm2 start npm --name "pdflynx-frontend" -- run start
cd ..

# Save the PM2 process list to start reliably on boot
pm2 save
pm2 startup
# (Run the exact sudo command PM2 outputs on your screen)
```

Verify both services are online:
```bash
pm2 status
pm2 logs
```

---

## 6. Nginx Configuration

We will configure Nginx to route all public traffic for `pdflynx.com` directly to the Next.js instance. 

Create a new Nginx block:
```bash
sudo nano /etc/nginx/sites-available/pdflynx.com
```

Paste the following configuration:
```nginx
server {
    listen 80;
    server_name pdflynx.com www.pdflynx.com;

    # Maximum file upload size (Important for large PDFs)
    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Pass real client IPs to Next.js
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the configuration and reboot Nginx:
```bash
# Disable default nginx page
sudo rm /etc/nginx/sites-enabled/default

# Enable PdfLynx
sudo ln -s /etc/nginx/sites-available/pdflynx.com /etc/nginx/sites-enabled/

# Test syntax and reload
sudo nginx -t
sudo systemctl reload nginx
```

---

## 7. Securing with SSL (HTTPS)

Production deployments require SSL. Use Let's Encrypt / Certbot to auto-configure HTTPS for `pdflynx.com`.

```bash
sudo apt install -y certbot python3-certbot-nginx

# Run the automated installer and follow the prompts
sudo certbot --nginx -d pdflynx.com -d www.pdflynx.com
```

Certbot will automatically update your Nginx configuration with the SSL certificates and redirect all HTTP traffic to HTTPS.

---

## 8. Maintenance Commands

If you update the code via `git pull` in the future, follow this sequence to deploy with zero downtime:

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild backend and restart
npm install
npm run build
pm2 restart pdflynx-backend

# 3. Rebuild frontend and restart
cd frontend
npm install
npm run build
pm2 restart pdflynx-frontend
cd ..
```

**Congratulations!** PdfLynx is now running securely in production at `https://pdflynx.com`.
