#!/bin/bash

# Start ngrok tunnel for Faberon24

echo "🚀 Starting ngrok tunnel for UserService (port 8080)..."
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok not found. Installing..."
    
    # Download ngrok
    cd /tmp
    curl -s https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-darwin-amd64.zip -o ngrok.zip
    unzip -q ngrok.zip
    chmod +x ngrok
    
    # Move to /usr/local/bin if possible
    if [ -w /usr/local/bin ]; then
        mv ngrok /usr/local/bin/
        echo "✅ ngrok installed to /usr/local/bin"
    else
        echo "⚠️  ngrok installed to /tmp (add to PATH or use full path)"
        NGROK_PATH="/tmp/ngrok"
    fi
fi

# Start ngrok
NGROK_PATH=${NGROK_PATH:-ngrok}

echo "📍 Starting tunnel..."
echo ""
$NGROK_PATH http 8080

echo ""
echo "✅ ngrok is running!"
echo ""
echo "📝 Copy the URL above and use it in setup.html"
echo "   Example: https://abc123-xyz789.ngrok.io"
