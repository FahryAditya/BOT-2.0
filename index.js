const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./config');
const { handleMessage } = require('./messageHandler');

let isReady = false;
let authenticatedAt = null;

console.log('🚀 Memulai Anime WhatsApp Bot...');
console.log('⚙️  Konfigurasi:');
console.log('   - Bot Name:', config.botName);
console.log('   - Prefix:', config.prefix);
console.log('');

// Inisialisasi client
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './session',
        clientId: 'anime-bot'
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

// Event: QR Code generation
client.on('qr', (qr) => {
    console.log('\n');
    console.log('╔════════════════════════════════════════╗');
    console.log('║     📱 SCAN QR CODE INI SEKARANG!     ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    
    // Generate QR code di terminal
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
client.on('group_join', async (notification) => {
    try {
        console.log('👋 Ada member baru di grup!');
        
        const chat = await notification.getChat();
        const contact = await notification.getContact();
        
        // Format welcome message
        const welcomeMsg = config.welcomeMessage(contact.number);
        
        try {
            // Ambil foto profile
            const profilePicUrl = await contact.getProfilePicUrl();
            
            if (profilePicUrl) {
                const media = await MessageMedia.fromUrl(profilePicUrl);
                await chat.sendMessage(media, {
                    caption: welcomeMsg,
                    mentions: [contact]
                });
            } else {
                // Jika tidak ada foto profile, kirim teks saja
                await chat.sendMessage(welcomeMsg, {
                    mentions: [contact]
                });
            }
        } catch (picError) {
            console.error('⚠️ Gagal mengambil foto profil:', picError.message);
            // Fallback ke pesan teks saja
            await chat.sendMessage(welcomeMsg, {
                mentions: [contact]
            });
        }
        
        console.log(`✅ Welcome message terkirim untuk ${contact.pushname || contact.number}`);
        
    } catch (error) {
        console.error('❌ Error sending welcome message:', error.message);
    }
});

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
