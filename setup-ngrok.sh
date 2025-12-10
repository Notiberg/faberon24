#!/bin/bash

# Setup ngrok for Vercel integration
# This script creates ngrok tunnels for all backend services

echo "🚀 Setting up ngrok tunnels..."

# Download ngrok if not exists
if [ ! -f "/tmp/ngrok" ]; then
    echo "📥 Downloading ngrok..."
    cd /tmp
    curl -s https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-darwin-amd64.zip -o ngrok.zip
    unzip -q ngrok.zip
    chmod +x ngrok
fi

# Start ngrok tunnels
echo "🔗 Starting ngrok tunnels..."

# UserService tunnel
/tmp/ngrok http 8080 --log=stdout > /tmp/ngrok-userservice.log 2>&1 &
NGROK_PID_1=$!
echo "UserService tunnel PID: $NGROK_PID_1"

sleep 2

# SellerService tunnel
/tmp/ngrok http 8081 --log=stdout > /tmp/ngrok-sellerservice.log 2>&1 &
NGROK_PID_2=$!
echo "SellerService tunnel PID: $NGROK_PID_2"

sleep 2

# PriceService tunnel
/tmp/ngrok http 8082 --log=stdout > /tmp/ngrok-priceservice.log 2>&1 &
NGROK_PID_3=$!
echo "PriceService tunnel PID: $NGROK_PID_3"

sleep 3

# Get ngrok URLs
echo ""
echo "📍 ngrok URLs:"
echo "===================="

# Try to get URLs from ngrok API
curl -s http://localhost:4040/api/tunnels 2>/dev/null | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for tunnel in data.get('tunnels', []):
        print(f\"{tunnel['name']}: {tunnel['public_url']}\")
except:
    print('Could not retrieve tunnel URLs. Please check ngrok dashboard at http://localhost:4040')
" || echo "Check ngrok dashboard at http://localhost:4040"

echo ""
echo "✅ ngrok tunnels are running!"
echo ""
echo "📝 Update Vercel Environment Variables with these URLs:"
echo "API_BASE_URL = <UserService URL>"
echo "SELLER_API_BASE = <SellerService URL>/api/v1"
echo "PRICE_API_BASE = <PriceService URL>/api/v1"
echo ""
echo "To stop tunnels, run: kill $NGROK_PID_1 $NGROK_PID_2 $NGROK_PID_3"
