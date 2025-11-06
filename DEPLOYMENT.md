# Production Deployment Guide

This guide covers deploying the e-commerce API to production environments.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Deployment Options](#deployment-options)
5. [Security Checklist](#security-checklist)
6. [Monitoring](#monitoring)

## Prerequisites

- Node.js 14+ installed
- MongoDB instance (local or cloud)
- Domain name (optional, for production)
- SSL certificate (recommended for production)

## Environment Setup

### 1. Clone and Install

```bash
git clone <your-repo>
cd ecommerce-api
npm install
```

### 2. Configure Environment Variables

Create a `.env` file with production values:

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Database - Use MongoDB Atlas for production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT Secret - Generate a strong secret
JWT_SECRET=your-super-strong-secret-key-min-32-characters
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Generate Strong JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## Database Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Cluster**: Choose your cloud provider and region
3. **Create Database User**: Set username and password
4. **Whitelist IP**: Add your server's IP or 0.0.0.0/0 (not recommended for production)
5. **Get Connection String**: Copy the connection string and update `.env`

### Option 2: Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Secure MongoDB
mongo
> use admin
> db.createUser({
    user: "admin",
    pwd: "strongpassword",
    roles: ["root"]
  })
> exit

# Update connection string
MONGODB_URI=mongodb://admin:strongpassword@localhost:27017/ecommerce?authSource=admin
```

## Deployment Options

### Option 1: Traditional VPS (DigitalOcean, AWS EC2, etc.)

#### 1. Install Node.js and PM2

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

#### 2. Deploy Application

```bash
# Clone repository
git clone <your-repo>
cd ecommerce-api

# Install dependencies
npm install --production

# Start with PM2
pm2 start server.js --name ecommerce-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### 3. Configure Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt-get install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ecommerce-api
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ecommerce-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 4. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
```

### Option 2: Heroku

#### 1. Install Heroku CLI

```bash
npm install -g heroku
heroku login
```

#### 2. Create Heroku App

```bash
heroku create your-app-name
```

#### 3. Add MongoDB Add-on

```bash
heroku addons:create mongolab:sandbox
```

#### 4. Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku config:set JWT_EXPIRE=7d
```

#### 5. Deploy

```bash
git push heroku main
```

### Option 3: Docker

#### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

#### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/ecommerce
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

volumes:
  mongo-data:
```

#### 3. Deploy

```bash
docker-compose up -d
```

### Option 4: AWS Elastic Beanstalk

#### 1. Install EB CLI

```bash
pip install awsebcli
```

#### 2. Initialize EB

```bash
eb init -p node.js your-app-name
```

#### 3. Create Environment

```bash
eb create production-env
```

#### 4. Set Environment Variables

```bash
eb setenv NODE_ENV=production JWT_SECRET=your-secret MONGODB_URI=your-mongo-uri
```

#### 5. Deploy

```bash
eb deploy
```

## Security Checklist

### Before Going Live

- [ ] Change default JWT_SECRET to a strong random string
- [ ] Use HTTPS/SSL certificates
- [ ] Set NODE_ENV=production
- [ ] Enable MongoDB authentication
- [ ] Whitelist specific IPs in MongoDB
- [ ] Set up firewall rules (UFW, Security Groups)
- [ ] Enable rate limiting
- [ ] Review and update CORS settings
- [ ] Set secure password policies
- [ ] Enable logging and monitoring
- [ ] Set up automated backups
- [ ] Review all environment variables
- [ ] Remove development dependencies
- [ ] Set up error tracking (Sentry, etc.)

### Firewall Configuration (UFW)

```bash
# Allow SSH
sudo ufw allow 22

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable
```

## Monitoring

### PM2 Monitoring

```bash
# View logs
pm2 logs ecommerce-api

# Monitor resources
pm2 monit

# View status
pm2 status
```

### Log Management

Logs are stored in `logs/` directory:
- `error.log` - Error logs
- `combined.log` - All logs
- `access.log` - HTTP access logs

### Health Checks

Set up monitoring services to check:
- `GET /health` - Server health
- Database connectivity
- Response times
- Error rates

### Recommended Monitoring Tools

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Rollbar
- **Performance**: New Relic, DataDog
- **Logs**: Loggly, Papertrail

## Backup Strategy

### MongoDB Backups

```bash
# Manual backup
mongodump --uri="mongodb://user:pass@host:port/ecommerce" --out=/backup/$(date +%Y%m%d)

# Automated daily backup (crontab)
0 2 * * * mongodump --uri="mongodb://user:pass@host:port/ecommerce" --out=/backup/$(date +\%Y\%m\%d)
```

### Application Backups

```bash
# Backup application files
tar -czf ecommerce-api-$(date +%Y%m%d).tar.gz /path/to/ecommerce-api
```

## Scaling

### Horizontal Scaling

Use PM2 cluster mode:

```bash
pm2 start server.js -i max --name ecommerce-api
```

### Load Balancing

Use Nginx as a load balancer:

```nginx
upstream api_servers {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen 80;
    location / {
        proxy_pass http://api_servers;
    }
}
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string
   - Verify IP whitelist
   - Check credentials

2. **Port Already in Use**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

3. **PM2 Not Starting**
   ```bash
   pm2 delete all
   pm2 start server.js
   ```

4. **High Memory Usage**
   ```bash
   pm2 restart ecommerce-api
   ```

## Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install --production

# Restart application
pm2 restart ecommerce-api
```

### Database Maintenance

```bash
# Compact database
mongo ecommerce --eval "db.runCommand({compact: 'products'})"

# Rebuild indexes
mongo ecommerce --eval "db.products.reIndex()"
```

## Support

For issues and questions:
- Check logs: `pm2 logs ecommerce-api`
- Review documentation
- Open an issue on GitHub

---

**Remember**: Always test in a staging environment before deploying to production!
