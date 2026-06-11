require('dotenv').config();
console.log('[DEBUG] CHANNEL_ID loaded from .env:', process.env.CHANNEL_ID);
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./config');
const { handleMessage } = require('./messageHandler');
const { handleWelcome } = require('./commands/welcomeCommand');
const { setupChannelScheduler } = require('./utils/channelScheduler');
const { initializeDatabase } = require('./utils/neonDB');

let isReady = false;
let authenticatedAt = null;

// Initialize Database
initializeDatabase().then(success => {
    if (success) {
        console.log('✅ Database Neon terhubung!');
    } else {
        console.error('❌ Gagal menghubungkan database Neon. Cek DATABASE_URL!');
    }
});

const fs = require('fs');

// Fungsi untuk mendeteksi path Chrome di Linux/Railway
function getChromePath() {
    if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
    
    const commonPaths = [
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/app/.apt/usr/bin/google-chrome-stable',
        '/nix/store/*/bin/google-chrome-stable'
    ];

    for (const path of commonPaths) {
        if (fs.existsSync(path)) return path;
    }
    return null;
}

// Fungsi untuk membersihkan lock file browser
function cleanupBrowserLock() {
    const lockFiles = [
        './session/session-anime-bot/SingletonLock',
        './session/session-anime-bot/SingletonCookie',
        './session/session-anime-bot/SingletonSocket'
    ];

    lockFiles.forEach(file => {
        const fullPath = path.resolve(file);
        if (fs.existsSync(fullPath)) {
            try {
                fs.unlinkSync(fullPath);
                console.log(`🧹 Cleaned up lock file: ${file}`);
            } catch (err) {
                console.warn(`⚠️  Gagal menghapus lock file ${file}:`, err.message);
            }
        }
    });
}

const chromePath = getChromePath();
const http = require('http');
const path = require('path');

// Run cleanup before initialization
cleanupBrowserLock();

// Simple HTTP Server to keep the process alive
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!\n');
});

const PORT = process.env.PORT || 8080;

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.warn(`⚠️  Port ${PORT} sudah digunakan. Mencoba port lain...`);
        setTimeout(() => {
            server.close();
            server.listen(0, () => {
                const newPort = server.address().port;
                console.log(`📡 Keep-alive server fallback to port ${newPort}`);
            });
        }, 1000);
    } else {
        console.error('❌ Server error:', e.message);
    }
});

server.listen(PORT, () => {
    console.log(`📡 Keep-alive server listening on port ${PORT}`);
});

console.log('🚀 Memulai Anime WhatsApp Bot...');
console.log('⚙️  Konfigurasi:');
console.log('   - Bot Name:', config.botName);
console.log('   - Prefix:', config.prefix);
console.log('   - Detected Chrome Path:', chromePath || 'Not found (using bundled)');
console.log('');

// Puppeteer args optimized for low-memory environments
const puppeteerArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu',
    '--disable-extensions',
    '--mute-audio',
    '--disable-canvas-aa',
    '--disable-2d-canvas-clip-aa',
    '--disable-gl-drawing-for-tests',
    '--safebrowsing-disable-auto-update',
    '--ignore-certificate-errors',
    '--disable-features=IsolateOrigins,site-per-process',
    '--disable-ipc-flooding-protection',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-background-networking',
    '--disable-breakpad',
    '--disable-component-extensions-with-background-pages',
    '--disable-domain-reliability',
    '--disable-hang-monitor',
    '--disable-infobars',
    '--disable-notifications',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-speech-api',
    '--disable-sync',
    '--metrics-recording-only',
    '--no-default-browser-check',
    '--password-store=basic',
    '--use-mock-keychain',
    '--window-size=400,400', // Smaller window
    '--blink-settings=imagesEnabled=false', // Disable images to save RAM
    '--disable-remote-fonts'
];

// Inisialisasi client
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './session',
        clientId: 'anime-bot'
    }),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    },
    takeoverOnConflict: true,
    puppeteer: {
        headless: true,
        executablePath: chromePath || undefined,
        handleSIGINT: false,
        handleSIGTERM: false,
        handleSIGHUP: false,
        args: puppeteerArgs
    }
});

// Event: QR Code generation
client.on('qr', async (qr) => {
    console.log('\n');
    console.log('╔════════════════════════════════════════╗');
    console.log('║     📱 SCAN QR CODE INI SEKARANG!     ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    
    qrcode.generate(qr, { small: true });
    
    console.log('');
    console.log('📋 CARA SCAN:');
    console.log('   1. Buka WhatsApp di HP kamu');
    console.log('   2. Tap Menu (3 titik) atau Settings');
    console.log('   3. Pilih "Linked Devices"');
    console.log('   4. Tap "Link a Device"');
    console.log('   5. Scan QR code di atas');
    console.log('');
});

// Event: Authentication
client.on('authenticated', () => {
    authenticatedAt = Date.now();
    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log('║      🔐 AUTENTIKASI BERHASIL! ✅       ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
});

// Event: Loading screen
client.on('loading_screen', (percent, message) => {
    if (percent < 100) {
        process.stdout.write(`\r⏳ Loading: ${percent}% - ${message}`);
    } else {
        console.log('\n');
    }
});

// Event: Client ready
client.on('ready', () => {
    isReady = true;
    authenticatedAt = null; // Reset authenticated timer
    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log('║        ✅ BOT SUDAH SIAP! 🎌          ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    console.log('📱 Bot Name:', config.botName);
    console.log('⚙️  Prefix:', config.prefix);
    console.log('🎯 Status: ONLINE');
    console.log('');
    console.log('💡 Bot siap menerima command!');
    console.log('   Test dengan kirim pesan: !ping');
    console.log('');
    
    // Setup channel scheduler
    setupChannelScheduler();

    console.log('📋 Logs:');
    console.log('─────────────────────────────────────────');
});

// Event: Authentication failure
client.on('auth_failure', (msg) => {
    isReady = false;
    console.error('');
    console.error('╔════════════════════════════════════════╗');
    console.error('║      ❌ AUTENTIKASI GAGAL!            ║');
    console.error('╚════════════════════════════════════════╝');
    console.error('');
    console.error('Alasan:', msg);
    console.error('');
    console.error('💡 Solusi:');
    console.error('   1. Jalankan perintah: npm run clear');
    console.error('   2. Scan QR code baru');
    console.error('');
});

// Event: Client disconnected
client.on('disconnected', (reason) => {
    isReady = false;
    console.log('');
    console.log('⚠️  Client terputus!');
    console.log('   Alasan:', reason);
    console.log('🔄 Mencoba menghubungkan ulang dalam 5 detik...');
    console.log('');
    
    setTimeout(() => {
        client.initialize().catch(err => {
            console.error('❌ Gagal inisialisasi ulang:', err.message);
        });
    }, 5000);
});

async function processIncomingMessage(msg) {
    try {
        if (!isReady) return;

        // Ignore status messages
        if (msg.isStatus) return;
        
        // Ignore jika dari bot sendiri
        if (msg.fromMe) return;

        if (!msg.body || !msg.body.trim()) return;
        
        const chatId = msg.from;
        const isGroup = chatId.endsWith('@g.us');

        // Log pesan masuk (simplified)
        const preview = msg.body.length > 50 ? msg.body.substring(0, 50) + '...' : msg.body;
        console.log(`MSG [${new Date().toLocaleTimeString()}] ${isGroup ? 'GROUP' : 'CHAT'} ${chatId}: ${preview}`);
        
        // Handle message
        await handleMessage(msg);
        
    } catch (error) {
        console.error('❌ Error handling message:', error.message);
    }
}

// Event: pesan masuk dari user/grup.
client.on('message_create', (msg) => {
    // Gunakan setImmediate agar tidak memblokir event loop WhatsApp
    setImmediate(() => processIncomingMessage(msg));
});

// Event: Group join
client.on('group_join', handleWelcome);

// Error handling
process.on('unhandledRejection', (error) => {
    console.error('');
    console.error('❌ Unhandled Promise Rejection:');
    console.error('   ', error.message);
    console.error('');
});

process.on('uncaughtException', (error) => {
    console.error('');
    console.error('❌ Uncaught Exception:');
    console.error('   ', error.message);
    console.error('');
});

// Graceful shutdown
const shutdown = async (signal) => {
    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log(`║       ⚠️  MENUTUP BOT (${signal})...     ║`);
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    
    try {
        if (client) {
            await client.destroy();
        }
        console.log('✅ Bot berhasil ditutup!');
        console.log('');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error saat menutup bot:', error.message);
        process.exit(1);
    }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Initialize client
console.log('🔄 Menginisialisasi WhatsApp client...');
console.log('');

client.initialize().catch(error => {
    console.error('');
    console.error('❌ Error saat inisialisasi:');
    console.error('   ', error.message);
    console.error('');
    // Don't exit immediately, try to let the watchdog handle it or restart
    setTimeout(() => {
        console.log('🔄 Mencoba inisialisasi ulang...');
        client.initialize().catch(() => {});
    }, 10000);
});

// Watchdog: Cek status client secara berkala (Optimized for Efficiency)
setInterval(async () => {
    // 1. Jika stuck di loading/auth
    if (authenticatedAt && !isReady && Date.now() - authenticatedAt > 90000) {
        console.warn('⚠️  Bot stuck in initialization. Restarting...');
        authenticatedAt = Date.now();
        try {
            await client.destroy();
            await sleep(2000);
            await client.initialize();
        } catch (e) {}
    }

    // 2. Cek koneksi hanya jika perlu
    if (isReady) {
        try {
            // getState is relatively expensive, so we check infrequently
            const state = await client.getState();
            if (state !== 'CONNECTED') {
                isReady = false;
                client.initialize().catch(() => {});
            }
        } catch (e) {
            isReady = false;
        }
    }
}, 300000); // Check every 5 minutes instead of 1

// Health check log every 30 minutes
setInterval(async () => {
    if (isReady) {
        console.log(`📡 [${new Date().toLocaleTimeString()}] System: Standby (Ready)`);
    }
}, 1800000);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { client };
