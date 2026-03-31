# Deployment Guide: PdfLynx

This guide outlines the system requirements and steps to deploy the PdfLynx suite (Backend + Frontend) on a production Linux server using Nginx as a reverse proxy.

## 1. Required Linux Packages

The following system packages must be installed for PdfLynx to function correctly. These are used for PDF manipulation, conversion, and server management.

### **Core Runtime**
*   **Node.js (v18+) & npm**: Runtime for both the backend and frontend.

### **PDF & Image Processing (CLI Tools)**
*   **qpdf**: Encryption, decryption, merging, splitting, and page counting.
*   **poppler-utils**: Specifically `pdftoppm` for high-quality PDF-to-Image conversion (used for mirroring).
*   **imagemagick**: Specifically `convert` and `mogrify` for image processing and reconstruction into PDFs.
*   **ghostscript**: Advanced PDF manipulation and processing.
*   **libreoffice-headless**: Used for high-fidelity HTML-to-PDF conversion.

### **Web Server & Process Management**
*   **nginx**: High-performance web server and reverse proxy.
*   **pm2**: Node.js process manager to ensure the services stay alive.

#### **Command to Install All Dependencies (Ubuntu/Debian)**
```bash
sudo apt update
sudo apt install -y nodejs npm qpdf ghostscript poppler-utils imagemagick libreoffice-writer libreoffice-calc libreoffice-impress nginx
sudo npm install -g pm2
```

---

## 2. Production Deployment Steps

### **Step 1: Clone and Install**
Navigate to your deployment directory and clone the repository.
```bash
# Clone the repository
git clone <your-repo-url> pdflynx
cd pdflynx

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### **Step 2: Build the Services**
Build the TypeScript backend and the Next.js frontend for production.
```bash
# Build Backend (compiled to /dist)
npm run build

# Build Frontend
cd frontend
npm run build
cd ..
```

### **Step 3: Start Services with PM2**
PM2 will manage the processes and restart them if they crash.
```bash
# Start Backend
pm2 start dist/server.js --name pdflynx-backend --env production

# Start Frontend
cd frontend
pm2 start npm --name pdflynx-frontend -- start
cd ..

# Save the PM2 process list
pm2 save
```

### **Step 4: Configure Nginx**
Create a new Nginx configuration to route traffic to both the frontend (Next.js) and the backend API (Fastify). By proxying from the same domain, we avoid CORS issues and keep the backend private (not directly accessible from the internet).

Edit `/etc/nginx/sites-available/pdflynx`:
```nginx
server {
    listen 80;
    server_name yourdomain.com; # Replace with your domain

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (Fastify)
    location /api/pdf/ {
        proxy_pass http://localhost:5000/api/pdf/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;

        # Important for large file uploads (PDF files)
        client_max_body_size 50M;
    }
}
```

Enable the configuration and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/pdflynx /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### **Step 5: SSL Setup (Highly Recommended)**
Use Certbot (Let's Encrypt) to secure the production site.
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 3. Environment Variables

Ensure you set relevant environment variables in production.

**Backend (.env or system env):**
*   `PORT`: `5000`
*   `HOST`: `127.0.0.1` (Restrict access to localhost only)
*   `NODE_ENV`: `production`

**Frontend (.env.production):**
*   `NEXT_PUBLIC_API_URL`: `/api/pdf` (Proxied via Nginx)
