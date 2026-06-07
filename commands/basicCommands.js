const config = require('../config');
const { tagAllMembers } = require('../utils/memberManager');

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

async function handleTagAll(msg) {
    try {
        const chat = await msg.getChat();
        
        if (!chat.isGroup) {
            return msg.reply('❌ Command ini hanya bisa digunakan di dalam grup!');
        }
        
        await tagAllMembers(chat);
    } catch (error) {
        console.error('❌ Error in handleTagAll:', error);
        await msg.reply(`❌ Gagal tag semua member: ${error.message}`);
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
├ !tagall - Mention semua member 📢
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

*🎮 FITUR GAMES (18 GAMES!)* 🎌
├ !guesstheanime - Tebak anime
├ !guessthecharacter - Tebak karakter
├ !animevs - Battle karakter
├ !mangaquiz - Quiz manga
├ !openingquiz - Tebak opening
├ !animerate - Rating anime
├ !spainwaifu - Gacha waifu
├ !animetrivia - Trivia anime
├ !waifutournament - Tournament waifu
├ !dailymission - Misi harian
├ !destiny - Pick your destiny
├ !roleplay - Chat karakter
├ !shiritori - Anime shiritori
├ !emojiriddles - Tebak emoji
├ !scramble - Tebak nama acak
├ !guessscene - Tebak adegan
├ !hangman - Anime hangman
└ !waifucompat - Cek kecocokan

*✨ FITUR SPESIAL*
├ !profile - Cek profil
├ !adventure - RPG Adventure
└ !setprofile - Atur profil

*🎭 FITUR TAMBAHAN*
├ !otakudesu - Rekomendasi anime
└ !ai <pertanyaan> - Chat dengan AI 🤖

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
    ping: handlePing,
    menu: handleMenu,
    tagAll: handleTagAll
};