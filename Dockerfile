# Gunakan Node.js resmi sebagai base image
FROM node:18-slim

# Install dependensi sistem untuk Puppeteer dan Chrome
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    apt-transport-https \
    lsb-release \
    curl \
    --no-install-recommends

# Install Google Chrome Stable
RUN curl -fSsL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor | tee /usr/share/keyrings/google-chrome.gpg >> /dev/null \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Set environment variable untuk Puppeteer agar menggunakan Chrome yang diinstall
ENV CHROME_PATH=/usr/bin/google-chrome-stable

# Jalankan bot
CMD ["node", "index.js"]
