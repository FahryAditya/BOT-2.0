#!/bin/bash

echo "🎌 Starting Anime WhatsApp Bot..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if commands folder exists
if [ ! -d "commands" ]; then
    echo "📁 Creating commands folder..."
    mkdir commands
fi

# Check if session folder exists
if [ ! -d "session" ]; then
    echo "📁 Creating session folder..."
    mkdir session
fi

echo ""
echo "✅ All checks passed!"
echo "🚀 Starting bot..."
echo ""

node index.js