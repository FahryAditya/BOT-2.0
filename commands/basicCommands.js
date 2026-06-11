const config = require('../config');
const { tagAllMembers } = require('../utils/memberManager');

async function handlePing(msg) {
    try {
        // Calculate latency based on message timestamp (when user sent it)
        // message.timestamp is in seconds, Date.now() is in milliseconds
        const msgTime = msg.timestamp * 1000;
        const latency = Date.now() - msgTime;
        
        let status = '🟢 Sangat Cepat';
        if (latency > 500) status = '🟡 Normal';
        if (latency > 1500) status = '🔴 Lambat';

        await msg.reply(
            `🏓 *PONG!*\n\n` +
            `⚡ *Latensi:* ${latency}ms\n` +
            `📊 *Status:* ${status}\n` +
            `🤖 *Bot:* Online & Siap!`
        );
    } catch (error) {
        console.error('❌ Error in handlePing:', error);
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

async function handleMenu(msg, args) {
    try {
        const page = args[0] || '1';
        let menu = '';

        if (page === '1') {
            menu = `
╔═════════════════════=═══╗
║  🎌 *Anthropic MENU (1)* 🎌 ║
╚═════════════════════=═══╝

*📋 FITUR DASAR*
├ !ping - Cek bot aktif
├ !tagall - Mention semua 📢
├ !sticker [nama] - Buat stiker 🖼️
├ !gif [teks] - Video ke GIF 🎬
└ !menu - Menu ini

*🎌 FITUR ANIME*
├ !manga <judul> - Info manga
├ !animechar <nama> - Info karakter
├ !seasonnow - Anime musim ini
├ !topanime - Top 5 anime
└ !topmanga - Top 5 manga

*🎭 FITUR GENRE*
├ !animegenre - Semua genre
├ !searchgenre <genre> - Cari
└ !randomgenre - Genre random

*🎲 GAMES MUDAH*
├ !tebakangka - Tebak angka
├ !tebakgambar - Kuis emoji
├ !suwit [pilihan] - G/B/K
├ !dadu - Lempar dadu
├ !flipcoin - Lempar koin
├ !hitung - Kuis matematika
└ !katabijak - Motivasi

[ 🔘 *LAINNYA* ] ➡ Ketik *!menu 2*
            `.trim();
        } else if (page === '2') {
            menu = `
╔═══════════════════════╗
║  🎌 *Anthropic MENU (2)* 🎌 ║
╚═══════════════════════╝

*🎮 FITUR GAMES (18+)*
├ !guesstheanime - Tebak anime
├ !guessthecharacter - Karakter
├ !animevs - Battle karakter
├ !mangaquiz - Quiz manga
├ !openingquiz - Tebak opening
├ !animerate - Rating anime
├ !spainwaifu - Gacha waifu
├ !animetrivia - Trivia anime
├ !dailymission - Misi harian
├ !destiny - Pick destiny
├ !shiritori - Anime shiritori
├ !emojiriddles - Tebak emoji
├ !scramble - Tebak nama acak
├ !guessscene - Tebak adegan
├ !hangman - Anime hangman
└ !waifucompat - Cek kecocokan

*✨ FITUR EKONOMI*
├ !rank - Cek level/poin
├ !inventory - Koleksi item
├ !daily - Hadiah harian
├ !work - Kerja dapat poin
├ !bank - Cek bank poin
└ !shop - Toko item

[ ⬅ *KEMBALI* ] Ketik *!menu 1*
[ 🔘 *LAINNYA* ] ➡ Ketik *!menu 3*
            `.trim();
        } else if (page === '3') {
            menu = `
╔═══════════════════════╗
║  🎌 *Anthropic MENU (3)* 🎌 ║
╚═══════════════════════╝

*💍 FITUR SOSIAL*
├ !marry <target> - Menikah
├ !divorce - Bercerai
├ !marrylist - Daftar nikah
├ !steal <target> - Curi poin
├ !duel <target> - Duel poin
├ !give <target> <jml> - Transfer
└ !leaderboardglobal - Top global

*🐾 PET SYSTEM*
├ !pet - Status pet
├ !feed - Beri makan pet
├ !setpetname <nama> - Ganti nama
└ !waifusafari - Berburu waifu 🏹

*🛠️ UTILITY & AI*
├ !afk <alasan> - Set AFK 💤
├ !profile - Cek profil
├ !detectanime - Cari judul via gambar 🔍
├ !animenews - Berita anime 📰
├ !tracker - Episode Tracker
├ !heal - Pulihkan HP
├ !upgrade <item> - Upgrade
└ !wish - Gacha keberuntungan

[ ⬅ *KEMBALI* ] Ketik *!menu 2*
            `.trim();
        }

        await msg.reply(menu);
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