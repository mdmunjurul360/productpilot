# ProductPilot Deployment Guide

## 1. Server Requirements
- **Hosting Type:** Virtual Private Server (VPS) (e.g., DigitalOcean Droplet, AWS EC2, Hetzner Cloud, Linode).
- **Reason:** ProductPilot uses a high-performance in-memory JSON database (`data/productpilot_db.json`) for persistence. Serverless environments like Vercel or Railway use ephemeral filesystems which will wipe your database on every deploy. A persistent VPS is **required**.
- **OS:** Ubuntu 22.04 LTS or Debian 11+ recommended.
- **RAM:** Minimum 1GB (2GB recommended).

## 2. Node.js Version
- **Required Version:** Node.js v18.x or v20.x LTS.
- Verify installation: `node -v`

## 3. Environment Variables
Create a `.env` file in the project root by copying `.env.example`:
```bash
cp .env.example .env
```
Populate it with the following:
*   `PORT=5000` — The internal port the Node server binds to.
*   `NODE_ENV=production` — Triggers Vite production mode and disables debug logging.
*   `BASE_URL=https://yourdomain.com` — Used for Sitemap, Canonical tags, and absolute URLs.
*   `JWT_SECRET=your_secure_random_string` — Secures the Admin Panel sessions.
*   `ADMIN_EMAIL=admin@yourdomain.com` — Login email for the Admin Dashboard.
*   `ADMIN_PASSWORD_HASH=$2b$10$...` — The bcrypt hash of your admin password (e.g., hash of 'pilot').

## 4. Installation & Build Steps
SSH into your VPS and run:
```bash
# 1. Clone repository
git clone https://github.com/your-username/productpilot.git
cd productpilot

# 2. Install dependencies
npm install

# 3. Create .env file and populate it (see step 3)
nano .env 

# 4. Run the production build
npm run build
```

## 5. PM2 Setup (Process Manager)
PM2 keeps the Node application running in the background and restarts it if it crashes.
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start npm --name "productpilot" -- start

# Save the PM2 list so it restarts on server reboot
pm2 save
pm2 startup
```

## 6. Nginx Reverse Proxy & SSL (Let's Encrypt)
To serve your application on port 80/443, use Nginx.

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

**Nginx Configuration (`/etc/nginx/sites-available/productpilot`):**
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and fetch the SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/productpilot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 7. Backup Strategy
Because data is stored locally in `data/productpilot_db.json`, simply setup a cron job to backup this file.
```bash
crontab -e
```
Add the following line to backup the DB every night at 3 AM:
```bash
0 3 * * * cp /path/to/productpilot/data/productpilot_db.json /path/to/productpilot/data/backups/db_$(date +\%F).json
```

## 8. Update Process
When you push new code to your repository, pull and restart via PM2:
```bash
git pull origin main
npm install
npm run build
pm2 restart productpilot
```
