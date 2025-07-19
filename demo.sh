#!/bin/bash

# Oracle Boxing AI - Demo Launcher

echo "🥊 Oracle Boxing AI - Demo Launcher"
echo "=================================="
echo ""

# Check for available web servers
if command -v python3 &> /dev/null; then
    echo "✅ Python3 found. Starting server..."
    echo ""
    echo "📌 Server will start at: http://localhost:8000/"
    echo "📌 Press Ctrl+C to stop the server"
    echo ""
    cd "$(dirname "$0")"
    python3 -m http.server 8000
elif command -v php &> /dev/null; then
    echo "✅ PHP found. Starting server..."
    echo ""
    echo "📌 Server will start at: http://localhost:8000/"
    echo "📌 Press Ctrl+C to stop the server"
    echo ""
    cd "$(dirname "$0")"
    php -S localhost:8000
elif command -v node &> /dev/null; then
    echo "✅ Node.js found. Installing http-server..."
    npx http-server -p 8000
else
    echo "❌ No suitable web server found (Python3, PHP, or Node.js)"
    echo ""
    echo "You can install one of these:"
    echo "  - Python3: sudo apt install python3"
    echo "  - PHP: sudo apt install php"
    echo "  - Node.js: sudo apt install nodejs"
    echo ""
    echo "Or open the file directly in your browser:"
    echo "  file://$(pwd)/public/index.html"
fi