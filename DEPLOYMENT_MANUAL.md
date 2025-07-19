# Oracle Boxing AI - Production Deployment Manual

## 📦 Deployment Overview

This manual provides step-by-step instructions for deploying the Oracle Boxing AI web application to a production server. The application is a modern single-page application (SPA) with AI-powered boxing coaching capabilities.

## 🏗️ Architecture Summary

- **Frontend**: HTML5, CSS3 (TailwindCSS), JavaScript (ES6+)
- **UI Framework**: Component-based vanilla JavaScript
- **Styling**: TailwindCSS + Custom CSS with boxing theme
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Inter, Rajdhani)
- **Backend API**: RESTful API (requires separate deployment)

## 📋 Pre-Deployment Checklist

### System Requirements
- [ ] Ubuntu 20.04+ or similar Linux distribution
- [ ] Nginx or Apache web server
- [ ] SSL certificate (Let's Encrypt recommended)
- [ ] Node.js 16+ (for build tools if needed)
- [ ] Git for version control
- [ ] 1GB+ free disk space
- [ ] Domain name configured with DNS

### Required Information
- [ ] Production domain name
- [ ] SSL certificate files or Let's Encrypt setup
- [ ] API endpoint URL (if backend is deployed separately)
- [ ] CDN URL (optional)
- [ ] Analytics tracking codes (optional)

## 📁 Directory Structure

```
oracle_boxing_ai/
└── webapp/
    ├── index.html              # Main entry point
    ├── src/
    │   ├── js/                 # Core JavaScript files
    │   │   ├── utils.js        # Utility functions
    │   │   ├── api.js          # API client
    │   │   ├── auth.js         # Authentication manager
    │   │   ├── router.js       # SPA router
    │   │   ├── components.js   # Component system
    │   │   └── app.js          # Main application
    │   ├── components/         # UI components
    │   │   ├── header.js
    │   │   ├── footer.js
    │   │   ├── login.js
    │   │   ├── register.js
    │   │   ├── dashboard.js
    │   │   ├── chat.js
    │   │   ├── chat-complete.js
    │   │   └── tasks.js
    │   └── styles/
    │       └── main.css        # Custom styles
    └── assets/                 # Static assets (if any)
        └── images/
```

## 🚀 Deployment Steps

### Step 1: Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Nginx (if not already installed)
sudo apt install nginx -y

# Install Node.js (for any build processes)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install Git
sudo apt install git -y

# Create application directory
sudo mkdir -p /var/www/oracle-boxing-ai
sudo chown -R $USER:$USER /var/www/oracle-boxing-ai
```

### Step 2: Clone or Upload Application Files

#### Option A: Using Git
```bash
cd /var/www/oracle-boxing-ai
git clone [your-repository-url] .
```

#### Option B: Using SCP/SFTP
```bash
# From your local machine
scp -r /mnt/storagebox/oracle_boxing_ai/webapp/* user@your-server:/var/www/oracle-boxing-ai/
```

#### Option C: Using rsync
```bash
# From your local machine
rsync -avz --exclude 'node_modules' --exclude '.git' \
  /mnt/storagebox/oracle_boxing_ai/webapp/ \
  user@your-server:/var/www/oracle-boxing-ai/
```

### Step 3: Configure API Endpoint

Edit the API configuration in `/var/www/oracle-boxing-ai/src/js/api.js`:

```javascript
// Update the getBaseURL method to point to your production API
getBaseURL() {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000/api';
    } else {
        // UPDATE THIS to your production API URL
        return 'https://api.your-domain.com/api';
    }
}
```

### Step 4: Nginx Configuration

Create Nginx server block:

```bash
sudo nano /etc/nginx/sites-available/oracle-boxing-ai
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/your-domain.crt;
    ssl_certificate_key /etc/ssl/private/your-domain.key;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    
    # Root directory
    root /var/www/oracle-boxing-ai;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|txt|svg|woff|woff2|ttf)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy (if backend is on same server)
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/oracle-boxing-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: SSL Certificate Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is set up automatically
sudo certbot renew --dry-run
```

### Step 6: Set Correct Permissions

```bash
# Set ownership
sudo chown -R www-data:www-data /var/www/oracle-boxing-ai

# Set directory permissions
sudo find /var/www/oracle-boxing-ai -type d -exec chmod 755 {} \;

# Set file permissions
sudo find /var/www/oracle-boxing-ai -type f -exec chmod 644 {} \;
```

### Step 7: Performance Optimization

#### Enable Browser Caching
Already configured in Nginx above.

#### Minify Assets (Optional)
```bash
# Install minification tools
npm install -g terser uglifycss html-minifier

# Create minified versions
cd /var/www/oracle-boxing-ai

# Minify JavaScript
find src -name "*.js" -exec terser {} -o {}.min \;

# Minify CSS
uglifycss src/styles/main.css > src/styles/main.min.css

# Update index.html to use minified versions
```

#### Enable CDN (Optional)
Update index.html to use CDN URLs for static assets:
- TailwindCSS (already using CDN)
- Font Awesome (already using CDN)
- Google Fonts (already using CDN)

### Step 8: Environment-Specific Configuration

Create a production configuration file:

```bash
nano /var/www/oracle-boxing-ai/src/js/config.prod.js
```

```javascript
// Production configuration
window.APP_CONFIG = {
    API_BASE_URL: 'https://api.your-domain.com',
    APP_VERSION: '1.0.0',
    ENVIRONMENT: 'production',
    FEATURES: {
        DEMO_MODE: true,
        ANALYTICS: true,
        ERROR_REPORTING: true
    },
    TIMEOUTS: {
        API_TIMEOUT: 30000,
        SESSION_TIMEOUT: 86400000 // 24 hours
    }
};
```

### Step 9: Monitoring Setup

#### Install monitoring tools
```bash
# Install htop for system monitoring
sudo apt install htop -y

# Install GoAccess for web analytics
sudo apt install goaccess -y

# Configure GoAccess for Nginx logs
sudo goaccess /var/log/nginx/access.log -o /var/www/oracle-boxing-ai/stats.html \
  --log-format=COMBINED --real-time-html
```

#### Setup error logging
```bash
# Create error log directory
sudo mkdir -p /var/log/oracle-boxing-ai
sudo chown www-data:www-data /var/log/oracle-boxing-ai

# Configure JavaScript error logging
# Add to index.html before other scripts:
<script>
window.addEventListener('error', function(e) {
    // Send errors to your logging service
    console.error('Global error:', e);
});
</script>
```

### Step 10: Testing & Validation

#### 1. Test Nginx Configuration
```bash
sudo nginx -t
```

#### 2. Test HTTPS
```bash
curl -I https://your-domain.com
```

#### 3. Test Application Loading
```bash
# Check if main files are accessible
curl -I https://your-domain.com/index.html
curl -I https://your-domain.com/src/js/app.js
curl -I https://your-domain.com/src/styles/main.css
```

#### 4. Browser Testing
- Open https://your-domain.com in multiple browsers
- Test login functionality
- Test navigation between pages
- Check responsive design on mobile
- Verify console for JavaScript errors

### Step 11: Backup Strategy

Create automated backup script:

```bash
sudo nano /usr/local/bin/backup-oracle-boxing.sh
```

```bash
#!/bin/bash
# Backup Oracle Boxing AI

BACKUP_DIR="/backup/oracle-boxing-ai"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/oracle-boxing-ai"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/oracle-boxing-ai-$TIMESTAMP.tar.gz -C $APP_DIR .

# Keep only last 7 days of backups
find $BACKUP_DIR -name "oracle-boxing-ai-*.tar.gz" -mtime +7 -delete

echo "Backup completed: oracle-boxing-ai-$TIMESTAMP.tar.gz"
```

Make it executable and schedule:
```bash
sudo chmod +x /usr/local/bin/backup-oracle-boxing.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /usr/local/bin/backup-oracle-boxing.sh" | sudo crontab -
```

## 🔧 Post-Deployment Configuration

### 1. Update API Endpoints
Ensure all API endpoints in `src/js/api.js` point to production URLs.

### 2. Configure Analytics (Optional)
Add Google Analytics or similar to index.html:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>
```

### 3. Set up Error Monitoring (Optional)
Consider using Sentry or similar:
```html
<script src="https://browser.sentry-cdn.com/VERSION/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: 'YOUR-SENTRY-DSN' });
</script>
```

## 🚨 Troubleshooting

### Common Issues

#### 1. 404 Errors on Routes
- Ensure Nginx `try_files` directive is configured correctly
- Check that all routes fallback to index.html

#### 2. API Connection Failures
- Verify API URL in api.js
- Check CORS settings on API server
- Ensure API server is running

#### 3. SSL Certificate Issues
- Verify certificate files exist and are readable
- Check certificate expiration with `sudo certbot certificates`
- Ensure domain DNS is properly configured

#### 4. Permission Errors
- Re-run permission commands in Step 6
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

#### 5. JavaScript Errors
- Check browser console for errors
- Verify all script files are loading
- Check for mixed content warnings (HTTP resources on HTTPS site)

### Log Locations
- Nginx Access Log: `/var/log/nginx/access.log`
- Nginx Error Log: `/var/log/nginx/error.log`
- Application Logs: Browser console
- System Logs: `/var/log/syslog`

## 📊 Performance Monitoring

### Key Metrics to Monitor
1. **Page Load Time**: Target < 3 seconds
2. **Time to Interactive**: Target < 5 seconds
3. **API Response Time**: Monitor in browser Network tab
4. **Error Rate**: Check browser console and server logs
5. **Server Resources**: CPU, Memory, Disk usage

### Monitoring Commands
```bash
# Check server resources
htop

# Monitor Nginx access logs
tail -f /var/log/nginx/access.log

# Check disk usage
df -h

# Monitor active connections
ss -tunlp
```

## 🔐 Security Checklist

- [ ] SSL certificate installed and auto-renewing
- [ ] Security headers configured in Nginx
- [ ] File permissions set correctly (no write access for web user)
- [ ] Hidden files blocked in Nginx
- [ ] API endpoints use HTTPS
- [ ] Input validation on all forms
- [ ] No sensitive data in client-side code
- [ ] Regular security updates applied

## 🚀 Launch Checklist

Before going live:
- [ ] All tests passing
- [ ] SSL certificate working
- [ ] Domain DNS configured
- [ ] API endpoints connected
- [ ] Error monitoring configured
- [ ] Backup system running
- [ ] Performance acceptable
- [ ] Security scan completed
- [ ] Team trained on system

## 📝 Maintenance Tasks

### Daily
- Monitor error logs
- Check system resources
- Verify backups completed

### Weekly
- Review performance metrics
- Check for security updates
- Test critical user flows

### Monthly
- Update dependencies if needed
- Review and optimize performance
- Security audit
- Clean old logs and backups

## 🆘 Support Resources

### Documentation
- Application README: `/var/www/oracle-boxing-ai/README.md`
- API Documentation: [Your API docs URL]
- Nginx Documentation: https://nginx.org/en/docs/

### Monitoring Tools
- Server Status: https://your-domain.com/stats.html (if GoAccess configured)
- Uptime Monitoring: Configure external service like UptimeRobot
- Performance Testing: Use GTmetrix or PageSpeed Insights

### Emergency Contacts
- System Administrator: [Contact Info]
- Development Team: [Contact Info]
- Hosting Provider: [Support Info]

---

## 🎉 Deployment Complete!

Once all steps are completed, your Oracle Boxing AI web application should be live and accessible at https://your-domain.com

Remember to:
1. Test all functionality thoroughly
2. Monitor logs for the first 24-48 hours
3. Set up alerts for critical errors
4. Document any custom changes made during deployment

Good luck with your launch! 🥊