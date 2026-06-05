const config = require('../config');

async function handlePing(msg) {
    try {
        console.log('🏓 handlePing called');
        const start = Date.now();
        
        const sentMsg = await msg.reply('🏓 Pong!');
        console.log('✅ Pong message sent');
        
        const latency = Date.now() - start;
        await msg.reply(`⚡ Latency: ${latency}ms`);
        console.log(`✅ Latency message sent: ${latency}ms`);
        
    } catch (error) {
        console.error('❌ Error in handlePing:', error);
        throw error;
    }
}

async function handleMenu(msg) {
    try {
        console.log('📋 handleMenu called');
        
        const menu = `
╔══════════════════════╗
║  🎌 *ANIME BOT MENU* 🎌  ║
╚══════════════════════╝

*📋 FITUR DASAR*
├ !ping - Cek bot aktif
└ !menu - Menu ini

*🎌 FITUR ANIME*
├ !manga <judul> - Info manga
├ !animechar <nama> - Info karakter
├ !seasonnow - Anime musim ini
├ !topanime - Top 5 anime
└ !topmanga - Top 5 manga

*🎭 FITUR GENRE (BARU!)* ✨
├ !animegenre - Lihat semua genre
├ !searchgenre <genre> - Cari by genre
└ !randomgenre - Genre random

*😂 FITUR ABSURD*
├ !animememe - Meme anime
├ !animefact - Fakta absurd
├ !animeweirdchar - Karakter absurd
├ !guessanime - Tebak anime 🎮
├ !animeemoji - Emoji anime
├ !animevs - Battle absurd
├ !animeghost - Cerita horor
├ !animerandomquote - Quote absurd
├ !animefood - Makanan absurd
├ !animepet - Karakter jadi hewan
└ !skipquiz - Skip quiz aktif

*💕 FITUR WAIFU*
├ !cariwaifu <nama> - Cari waifu
├ !randomwaifu - Waifu random
└ !waifuquiz - Quiz waifu 🎮

*🎭 FITUR TAMBAHAN*
└ !otakudesu - Rekomendasi anime

╔══════════════════════╗
║  🎮 *CARA MAIN QUIZ* 🎮  ║
╚══════════════════════╝

1️⃣ Ketik !guessanime atau !waifuquiz
2️⃣ Baca petunjuk yang diberikan
3️⃣ Jawab dengan mengetik jawaban
4️⃣ Dapatkan hint setelah 2x salah!
5️⃣ Ketik !skipquiz untuk menyerah

╔══════════════════════╗
║  Dibuat dengan ❤️ oleh    ║
║      ${config.botName}         ║
╚══════════════════════╝

_Quiz system dengan auto-detection jawaban!_
        `.trim();
        
        await msg.reply(menu);
        console.log('✅ Menu sent successfully');
        
    } catch (error) {
        console.error('❌ Error in handleMenu:', error);
        throw error;
    }
}

module.exports = {
    handlePing,
    handleMenu
};