# Oracle Boxing AI - Production Deployment Manual
## For Integration with Existing Oracle Boxing Coach Backend

## 📦 Overview

This manual provides step-by-step instructions for deploying the new Oracle Boxing AI web interface to integrate with your existing Flask backend at the Oracle Boxing production environment.

**Integration Architecture**:
- **Frontend**: Modern SPA (Single Page Application) 
- **Backend**: Existing Flask API at production environment
- **Database**: Existing Supabase PostgreSQL
- **AI Services**: Claude 3.5 Sonnet (primary), GPT-4 (fallback)

## 🏗️ Pre-Deployment Requirements

### 1. Access Requirements
- [ ] SSH access to production server
- [ ] Access to `/opt/oracle/` directory
- [ ] Systemd service management permissions
- [ ] Nginx configuration access

### 2. Backend API Verification
Ensure these endpoints are available on your Flask backend:
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/ask
POST /api/update_model
GET  /api/quick-tip
POST /api/analyze-technique
GET  /api/health
```

### 3. Environment Information Needed
- Production API URL (e.g., https://api.your-domain.com)
- Allowed CORS origins for the new UI domain
- Any API rate limits or restrictions

## 📁 Deployment Package Structure

```
oracle_boxing_ai/webapp/
├── index.html                    # Main entry point
├── src/
│   ├── js/                      # Core JavaScript
│   │   ├── utils.js            # Utilities
│   │   ├── api.js              # API client (needs configuration)
│   │   ├── auth.js             # Auth manager
│   │   ├── router.js           # SPA router
│   │   ├── components.js       # Component system
│   │   └── app.js              # Main app
│   ├── components/              # UI components
│   │   ├── header.js
│   │   ├── footer.js
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── dashboard.js
│   │   ├── chat.js
│   │   ├── chat-complete.js
│   │   └── tasks.js
│   └── styles/
│       └── main.css            # Custom styles
└── PRODUCTION_DEPLOYMENT_MANUAL.md
```

## 🔧 Pre-Deployment Configuration

### Step 1: Configure API Client

Edit `/src/js/api.js` to point to your production backend:

```javascript
// Line ~10 in api.js
getBaseURL() {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5001/api';  // Development
    } else {
        // UPDATE THIS to your production API
        return 'https://your-production-domain.com/api';
    }
}
```

### Step 2: Update Authentication Headers

Ensure the API client matches your backend's auth format:

```javascript
// Line ~80 in api.js - Verify this matches your backend
getAuthHeaders() {
    const token = utils.getStorage('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}
```

### Step 3: Configure CORS on Backend

Add the new UI domain to your Flask backend's CORS configuration:

```python
# In your Flask app configuration
from flask_cors import CORS

CORS(app, origins=[
    "https://your-new-ui-domain.com",
    "http://localhost:3000"  # for development
])
```

## 🚀 Deployment Options

### Option A: Separate UI Domain (Recommended)

This keeps the UI separate from your Flask backend, allowing independent scaling and updates.

#### 1. Prepare UI Server

```bash
# Create directory for UI
sudo mkdir -p /var/www/oracle-boxing-ui
sudo chown -R $USER:$USER /var/www/oracle-boxing-ui

# Upload files
rsync -avz --exclude 'node_modules' --exclude '.git' \
  /path/to/oracle_boxing_ai/webapp/ \
  user@ui-server:/var/www/oracle-boxing-ui/
```

#### 2. Configure Nginx for UI

```nginx
server {
    listen 80;
    server_name ui.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ui.your-domain.com;
    
    ssl_certificate /etc/ssl/certs/your-cert.crt;
    ssl_certificate_key /etc/ssl/private/your-key.key;
    
    root /var/www/oracle-boxing-ui;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # CORS headers for API calls
    add_header Access-Control-Allow-Origin "https://api.your-domain.com" always;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Option B: Integrate with Existing Flask App

This deploys the UI as static files served by your Flask application.

#### 1. Copy Files to Flask Static Directory

```bash
# SSH to production server
ssh oracle-production

# Backup current static files
sudo cp -r /opt/oracle/static /opt/oracle/static_backup_$(date +%Y%m%d)

# Create new UI directory structure
sudo mkdir -p /opt/oracle/static/spa
sudo mkdir -p /opt/oracle/templates/spa

# Copy UI files
sudo cp -r webapp/* /opt/oracle/static/spa/
sudo mv /opt/oracle/static/spa/index.html /opt/oracle/templates/spa/
```

#### 2. Add Flask Route for SPA

Create `/opt/oracle/routes/spa_routes.py`:

```python
from flask import Blueprint, render_template, send_from_directory
import os

spa_bp = Blueprint('spa', __name__)

@spa_bp.route('/app')
@spa_bp.route('/app/<path:path>')
def spa_app(path=None):
    """Serve the SPA application"""
    return render_template('spa/index.html')

@spa_bp.route('/spa/static/<path:filename>')
def spa_static(filename):
    """Serve SPA static files"""
    return send_from_directory('static/spa', filename)
```

#### 3. Register Blueprint in app.py

```python
# In /opt/oracle/app.py
from routes.spa_routes import spa_bp
app.register_blueprint(spa_bp)
```

#### 4. Update index.html paths

```html
<!-- Update paths in index.html to use /spa/static/ prefix -->
<link href="/spa/static/src/styles/main.css" rel="stylesheet">
<script src="/spa/static/src/js/utils.js"></script>
<!-- etc. -->
```

## 🔄 Integration Steps

### Step 1: Test API Connection

Before full deployment, test the API connection:

```javascript
// Create test.html in webapp directory
<!DOCTYPE html>
<html>
<head>
    <title>API Test</title>
</head>
<body>
    <h1>API Connection Test</h1>
    <button onclick="testAPI()">Test API</button>
    <div id="result"></div>
    
    <script>
    async function testAPI() {
        try {
            const response = await fetch('https://your-production-api.com/api/health');
            const data = await response.json();
            document.getElementById('result').innerHTML = 'API Status: ' + JSON.stringify(data);
        } catch (error) {
            document.getElementById('result').innerHTML = 'Error: ' + error.message;
        }
    }
    </script>
</body>
</html>
```

### Step 2: Deploy and Test Authentication

1. Deploy the UI files using either Option A or B
2. Test registration flow:
   ```javascript
   // Browser console test
   const testRegister = async () => {
       const response = await fetch('https://your-api.com/api/auth/register', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
               email: 'test@example.com',
               password: 'TestPass123!',
               display_name: 'Test User'
           })
       });
       console.log(await response.json());
   };
   ```

### Step 3: Configure AI Coach Integration

Update the chat component to match your backend's response format:

```javascript
// In src/components/chat.js or chat-complete.js
async sendMessage(message) {
    // ... existing code ...
    
    try {
        const response = await apiClient.sendMessage(message, this.currentSession?.id, this.currentCoach);
        
        // Adjust based on your backend's response structure
        const aiMessage = {
            id: response.assistant_message_id || utils.generateId('msg'),
            content: response.response,  // Adjust field name if needed
            sender: 'ai',
            coach: this.currentCoach,
            timestamp: response.timestamp || new Date().toISOString(),
            model: response.model_used
        };
        
        // ... rest of code ...
    }
}
```

## 🚨 Deployment Execution

### For Option A (Separate Domain):

```bash
# 1. Upload files
rsync -avz webapp/ user@server:/var/www/oracle-boxing-ui/

# 2. Set permissions
ssh user@server
sudo chown -R www-data:www-data /var/www/oracle-boxing-ui
sudo find /var/www/oracle-boxing-ui -type d -exec chmod 755 {} \;
sudo find /var/www/oracle-boxing-ui -type f -exec chmod 644 {} \;

# 3. Configure SSL
sudo certbot --nginx -d ui.your-domain.com

# 4. Restart Nginx
sudo systemctl restart nginx
```

### For Option B (Integrated with Flask):

```bash
# 1. Stop Flask service
sudo systemctl stop oracle-boxing-coach

# 2. Deploy files
cd /opt/oracle
sudo cp -r /path/to/webapp/* /opt/oracle/static/spa/

# 3. Update Flask app with new blueprint
sudo nano /opt/oracle/app.py
# Add: from routes.spa_routes import spa_bp
# Add: app.register_blueprint(spa_bp)

# 4. Restart service
sudo systemctl start oracle-boxing-coach
sudo systemctl status oracle-boxing-coach

# 5. Test
curl https://your-domain.com/app
```

## ✅ Post-Deployment Validation

### 1. Functional Testing

```bash
# Test health endpoint
curl https://your-domain.com/api/health

# Test UI loading
curl -I https://ui.your-domain.com/

# Check for JavaScript errors
# Open browser console and verify no errors
```

### 2. Integration Testing Checklist

- [ ] Login page loads correctly
- [ ] Registration flow completes
- [ ] Login flow works and stores JWT token
- [ ] Dashboard displays after login
- [ ] Chat interface connects to AI coach
- [ ] AI responses appear in chat
- [ ] Coach switching works
- [ ] Logout clears session
- [ ] Mobile responsive design works

### 3. Performance Verification

```bash
# Check load times
curl -w "@curl-format.txt" -o /dev/null https://ui.your-domain.com/

# Monitor Flask logs for API calls
sudo journalctl -u oracle-boxing-coach -f

# Check browser network tab for API response times
```

## 🔧 Troubleshooting

### Common Integration Issues

#### 1. CORS Errors
**Symptom**: "CORS policy" errors in browser console
**Solution**: 
```python
# In Flask backend
from flask_cors import CORS
CORS(app, origins=["https://ui.your-domain.com"], 
     allow_headers=["Content-Type", "Authorization"])
```

#### 2. Authentication Failures
**Symptom**: 401 errors after login
**Solution**: Verify JWT token format matches:
```javascript
// In api.js
headers: { 'Authorization': `Bearer ${token}` }
```

#### 3. API Timeout on AI Requests
**Symptom**: Network timeout on /api/ask
**Solution**: Increase timeout in api.js:
```javascript
// Line ~8 in api.js
this.timeout = 60000; // 60 seconds for AI responses
```

#### 4. 404 on SPA Routes
**Symptom**: Refreshing on /dashboard gives 404
**Solution**: Ensure Nginx try_files is configured:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Debug Commands

```bash
# Check Flask logs
sudo journalctl -u oracle-boxing-coach -n 100

# Test API directly
curl -X POST https://your-api.com/api/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"question":"Test"}'

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Monitor real-time traffic
sudo tcpdump -i any -n port 443
```

## 📊 Performance Optimization

### 1. Enable Compression

```nginx
# In Nginx config
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### 2. Optimize API Calls

```javascript
// Implement caching for repeated requests
class CachedAPIClient extends ApiClient {
    constructor() {
        super();
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }
    
    async get(endpoint, params = {}) {
        const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        
        const data = await super.get(endpoint, params);
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
    }
}
```

### 3. Implement Loading States

```javascript
// Show loading during AI responses
async sendMessage(message) {
    this.showTypingIndicator();
    this.setLoading(true);
    
    try {
        // Add timeout handling
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 30000)
        );
        
        const response = await Promise.race([
            apiClient.sendMessage(message),
            timeoutPromise
        ]);
        
        // Handle response
    } catch (error) {
        if (error.message === 'Request timeout') {
            this.showTimeoutMessage();
        }
    } finally {
        this.hideTypingIndicator();
        this.setLoading(false);
    }
}
```

## 🔐 Security Checklist

- [ ] HTTPS enabled on UI domain
- [ ] API endpoints use HTTPS only
- [ ] CORS properly configured
- [ ] JWT tokens expire appropriately
- [ ] No sensitive data in client-side code
- [ ] API keys not exposed in UI
- [ ] Input validation on all forms
- [ ] XSS protection headers set

## 🚀 Go-Live Checklist

### Pre-Launch
- [ ] All API endpoints tested
- [ ] Authentication flow verified
- [ ] AI coaching responses working
- [ ] Mobile responsiveness confirmed
- [ ] Performance acceptable (<3s load time)
- [ ] Error handling tested
- [ ] SSL certificates valid

### Launch Day
- [ ] Deploy during low-traffic period
- [ ] Monitor logs actively for first hour
- [ ] Test all critical user paths
- [ ] Verify analytics/monitoring working
- [ ] Have rollback plan ready

### Post-Launch
- [ ] Monitor error rates
- [ ] Check API response times
- [ ] Gather user feedback
- [ ] Document any issues found
- [ ] Plan optimization iterations

## 📝 Maintenance Procedures

### Regular Tasks

**Daily**:
- Check error logs for issues
- Monitor API response times
- Verify AI coaching working

**Weekly**:
- Review performance metrics
- Check for security updates
- Test critical user flows

**Monthly**:
- Update dependencies if needed
- Review and optimize slow queries
- Audit security logs

### Update Procedures

```bash
# For UI updates
cd /var/www/oracle-boxing-ui
git pull origin main  # or upload new files
sudo systemctl restart nginx

# For integrated deployment
cd /opt/oracle/static/spa
# Update files
sudo systemctl restart oracle-boxing-coach
```

## 🆘 Emergency Procedures

### UI Rollback
```bash
# If separate domain
cd /var/www/oracle-boxing-ui
git checkout previous-commit-hash
# or restore from backup

# If integrated
cd /opt/oracle
sudo rm -rf static/spa
sudo cp -r static_backup_DATE/spa static/
sudo systemctl restart oracle-boxing-coach
```

### API Connection Issues
1. Verify backend is running: `sudo systemctl status oracle-boxing-coach`
2. Check API health: `curl https://api.domain.com/api/health`
3. Verify CORS headers: Check browser network tab
4. Review Flask logs: `sudo journalctl -u oracle-boxing-coach -n 100`

---

## 🎉 Launch Ready!

Once deployed, your new Oracle Boxing AI interface will provide:
- Modern, responsive UI for boxing training
- Real-time AI coaching with multiple personas
- Comprehensive progress tracking
- Seamless integration with existing backend
- Professional user experience

Remember to monitor closely during the first 24-48 hours and have your rollback procedures ready just in case!

Good luck with your deployment! 🥊