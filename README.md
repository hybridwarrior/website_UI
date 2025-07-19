# Oracle Boxing AI - Web Interface

A modern, responsive web interface for the Oracle Boxing AI coaching platform. This single-page application provides an intuitive interface for boxers to interact with AI-powered coaching, track their progress, and improve their skills.

## 🥊 Features

- **Professional Landing Page**: Compelling marketing page showcasing all features
- **AI-Powered Coaching**: Multiple AI coach personas for different training aspects
- **Real-time Chat Interface**: Interactive coaching sessions with typing indicators
- **Progress Tracking**: Monitor your boxing journey with detailed analytics
- **Task Management**: Set and track training goals
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Secure Authentication**: JWT-based auth system with session management

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/hybridwarrior/website_UI.git
cd website_UI

# Run the demo server
./demo.sh

# Open http://localhost:8000 in your browser

# View landing page at http://localhost:8000/landing.html
# View app at http://localhost:8000/index.html
```

### Production Deployment

See [DEPLOYMENT_MANUAL.md](DEPLOYMENT_MANUAL.md) for general deployment instructions.

For integration with the Oracle Boxing Coach Flask backend, see [PRODUCTION_DEPLOYMENT_MANUAL.md](PRODUCTION_DEPLOYMENT_MANUAL.md).

## 📁 Project Structure

```
website_UI/
├── index.html              # Main app entry point
├── landing.html            # Marketing landing page
├── src/
│   ├── js/                # Core JavaScript files
│   │   ├── api.js         # API client
│   │   ├── auth.js        # Authentication manager
│   │   ├── router.js      # SPA routing
│   │   ├── landing.js     # Landing page interactions
│   │   └── ...
│   ├── components/        # UI components
│   │   ├── dashboard.js   # Dashboard view
│   │   ├── chat.js        # Chat interface
│   │   └── ...
│   └── styles/            # CSS files
│       ├── main.css       # App styles
│       └── landing.css    # Landing page styles
├── demo.sh                # Local demo launcher
└── test.html             # Test page
```

## 🔧 Configuration

### API Endpoint

Update the API endpoint in `src/js/api.js`:

```javascript
getBaseURL() {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000/api';  // Development
    } else {
        return 'https://your-api-domain.com/api';  // Production
    }
}
```

## 🤖 AI Coach Personas

1. **Technical Master**: Expert in boxing techniques and form
2. **Motivational Coach**: Provides inspiration and mental training
3. **Safety Expert**: Focuses on injury prevention and proper technique
4. **Performance Analyst**: Tracks progress and provides data-driven insights

## 🛡️ Security

- JWT-based authentication
- Secure session management
- Input validation on all forms
- HTTPS enforcement in production

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🎨 Technologies

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: TailwindCSS 2.2.19
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Inter, Rajdhani)

## 📄 License

Copyright © 2024 Oracle Boxing AI. All rights reserved.

## 🆘 Support

For deployment issues, refer to the deployment manuals. For bugs or feature requests, please open an issue on GitHub.

---

Built with ❤️ for the boxing community