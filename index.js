require('dotenv').config();
console.log('[DEBUG] CHANNEL_ID loaded from .env:', process.env.CHANNEL_ID);
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./config');
const { handleMessage } = require('./messageHandler');
const { handleWelcome } = require('./commands/welcomeCommand');
const { setupChannelScheduler } = require('./utils/channelScheduler');
const readline = require('readline');

let isReady = false;
let authenticatedAt = null;
let pairingCodeRequested = false;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

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

const chromePath = getChromePath();

console.log('🚀 Memulai Anime WhatsApp Bot...');
console.log('⚙️  Konfigurasi:');
console.log('   - Bot Name:', config.botName);
console.log('   - Prefix:', config.prefix);
console.log('   - Detected Chrome Path:', chromePath || 'Not found (using bundled)');
console.log('');

// Inisialisasi client
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './session',
        clientId: 'anime-bot'
    }),
    puppeteer: {
        headless: true,
        executablePath: chromePath || undefined,
        handleSIGINT: false,
        handleSIGTERM: false,
        handleSIGHUP: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--disable-gpu',
            '--disable-extensions'
        ]
    }
});

// Event: QR Code generation
client.on('qr', async (qr) => {
    // Jika tidak ada session dan belum request pairing code, tawarkan pilihan
    if (!fs.existsSync('./session/session-anime-bot') && !pairingCodeRequested) {
        console.log('\n');
        console.log('╔════════════════════════════════════════╗');
        console.log('║        📱 PILIH METODE LOGIN           ║');
        console.log('╠════════════════════════════════════════╣');
        console.log('║ 1. QR Code (Scan langsung)             ║');
        console.log('║ 2. Pairing Code (Masukan Kode)         ║');
        console.log('╚════════════════════════════════════════╝');
        console.log('');
        
        const choice = await question('Pilihan kamu (1/2): ');
        
        if (choice === '2') {
            console.log('\n💡 Menggunakan metode Pairing Code...');
            let phoneNumber = await question('Masukkan nomor WhatsApp (contoh: 628123456789): ');
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
            
            if (phoneNumber) {
                try {
                    const code = await client.requestPairingCode(phoneNumber);
                    console.log('\n');
                    console.log('╔════════════════════════════════════════╗');
                    console.log(`║    PAIRING CODE KAMU: ${code}    ║`);
                    console.log('╚════════════════════════════════════════╝');
                    console.log('');
                    console.log('📋 CARA PAKAI:');
                    console.log('   1. Buka WhatsApp di HP kamu');
                    console.log('   2. Tap Menu (3 titik) atau Settings');
                    console.log('   3. Pilih "Linked Devices"');
                    console.log('   4. Tap "Link with phone number instead"');
                    console.log('   5. Masukkan kode di atas');
                    console.log('');
                    pairingCodeRequested = true;
                    return;
                } catch (err) {
                    console.error('❌ Gagal mendapatkan pairing code:', err.message);
                    console.log('🔄 Fallback ke QR Code...');
                }
            } else {
                console.log('⚠️ Nomor tidak valid. Menggunakan QR Code...');
            }
        }
    }

    // Default: Tampilkan QR Code
    if (!pairingCodeRequested) {
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
        console.log('⏰ QR Code akan expired dalam 60 detik!');
        console.log('   Jika expired, bot akan generate QR baru.');
        console.log('');
    }
});

// Event: Authentication
client.on('authenticated', () => {
    authenticatedAt = Date.now();
    if (rl) rl.close();
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
        if (!isReady) {
            console.log('Pesan masuk diabaikan karena client belum ready.');
            return;
        }

        // Ignore status messages
        if (msg.isStatus) return;
        
        // Ignore jika dari bot sendiri
        if (msg.fromMe) {
            // Log jika dari bot sendiri tapi mengandung prefix, bantu user debugging
            if (msg.body && msg.body.startsWith(config.prefix)) {
                console.log(`ℹ️  Pesan "${msg.body}" diabaikan karena dikirim dari nomor bot itu sendiri.`);
            }
            return;
        }

        if (!msg.body || !msg.body.trim()) return;
        
        const chat = await msg.getChat().catch(() => null);
        const chatName = chat?.name || chat?.id?._serialized || msg.from;
        const isGroup = Boolean(chat?.isGroup);

        // Log pesan masuk (simplified)
        const preview = msg.body.length > 50 ? msg.body.substring(0, 50) + '...' : msg.body;
        console.log(`MSG [${new Date().toLocaleTimeString()}] ${isGroup ? 'GROUP' : 'CHAT'} ${chatName}: ${preview}`);
        
        // Handle message
        await handleMessage(msg);
        
    } catch (error) {
        console.error('❌ Error handling message:', error.message);
        try {
            await msg.reply('❌ Terjadi error saat memproses pesan!');
        } catch (replyError) {
            console.error('❌ Error sending error message:', replyError.message);
        }
    }
}

// Event: pesan masuk dari user/grup.
// Gunakan "message_create" agar lebih konsisten menangkap pesan masuk.
client.on('message_create', processIncomingMessage);

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
process.on('SIGINT', async () => {
    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log('║       ⚠️  MENUTUP BOT...              ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    
    try {
        await client.destroy();
        console.log('✅ Bot berhasil ditutup!');
        console.log('');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error saat menutup bot:', error.message);
        process.exit(1);
    }
});

// Initialize client
console.log('🔄 Menginisialisasi WhatsApp client...');
console.log('');

client.initialize().catch(error => {
    console.error('');
    console.error('❌ Error saat inisialisasi:');
    console.error('   ', error.message);
    console.error('');
    process.exit(1);
});

// Watchdog: Jika stuck di loading/auth tapi tidak pernah ready
setInterval(async () => {
    if (authenticatedAt && !isReady && Date.now() - authenticatedAt > 60000) {
        console.warn('⚠️  Bot stuck di inisialisasi lebih dari 60 detik. Mencoba restart...');
        authenticatedAt = Date.now();
        try {
            await client.destroy();
            await sleep(2000);
            await client.initialize();
        } catch (e) {
            console.error('❌ Watchdog restart gagal:', e.message);
        }
    }
}, 30000);

// Health check log setiap 10 menit
setInterval(() => {
    if (isReady) {
        console.log(`📡 [${new Date().toLocaleTimeString()}] Health Check: Bot is ONLINE`);
    }
}, 600000);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { client };
