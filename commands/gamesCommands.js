/**
 * Command handler for 18 Anime Games
 */
const axios = require('axios');
const { updateScore, getLeaderboard } = require('../utils/dataStore');
const apiService = require('../apiService');
const quizManager = require('../quizManager');

/**
 * SPIN WAIFU - Gacha random waifu
 */
const spinWaifu = async (message) => {
  try {
    await message.reply('🎰 *Spinning the waifu wheel...*');
    
    // 1. Fetch random character
    const response = await axios.get('https://api.jikan.moe/v4/random/characters');
    
    if (!response.data.data) {
      return message.reply('❌ Gagal fetch waifu random.');
    }
    
    const character = response.data.data;
    const imageUrl = character.images?.jpg?.image_url;
    
    // 2. Build message dengan format menarik
    const spinMessage = `
╔════════════════════════╗
║  🎰 SPIN THE WAIFU 🎰  ║
╚════════════════════════╝

*Spinning...*
⏳⏳⏳⏳⏳

🎌 ✨ RESULT ✨ 🎌

✨ *${character.name}* ✨

📸 Image: ${imageUrl || 'No image'}

${character.about ? character.about.substring(0, 150) + '...' : 'Mysterious character...'}

🌟 Raritas: ${Math.floor(Math.random() * 5) + 1}⭐

🔗 ${character.url}

💬 "Sekarang dia adalah waifu-mu!" 🖤

━━━━━━━━━━━━━━━━━━━━━━
Type !spainwaifu again untuk spin lagi!
  `.trim();
    
    message.reply(spinMessage);
    
  } catch (error) {
    console.error('spinWaifu error:', error);
    message.reply('❌ Spin gagal! Coba lagi nanti.');
  }
};

const guessTheCharacter = async (msg) => {
    const questions = [
        { q: "Mata Sharingan, Tinggal di Konoha, Punya kakak bernama Itachi...", a: "Sasuke" },
        { q: "Punya topi jerami, suka makan daging, ingin jadi Raja Bajak Laut...", a: "Luffy" },
        { q: "Rambut kuning, suka ramen, punya rubah di dalam perutnya...", a: "Naruto" }
    ];
    const item = questions[Math.floor(Math.random() * questions.length)];
    const question = `😱 *Guess The Character*\n\n"${item.q}"`;
    quizManager.createSession(msg.from, 'guessthecharacter', question, item.a, [`Huruf pertama: ${item.a[0]}`]);
    await msg.reply(question);
};

const mangaQuiz = async (msg) => {
    const questions = [
        { q: "Siapa pengarang One Piece?", a: "Eiichiro Oda" },
        { q: "Siapa pengarang Naruto?", a: "Masashi Kishimoto" },
        { q: "Siapa pengarang Dragon Ball?", a: "Akira Toriyama" }
    ];
    const item = questions[Math.floor(Math.random() * questions.length)];
    const question = `📖 *Manga Quiz*\n\n${item.q}`;
    quizManager.createSession(msg.from, 'mangaquiz', question, item.a, [`Inisial: ${item.a.split(' ').map(n => n[0]).join('')}`]);
    await msg.reply(question);
};

const openingQuiz = async (msg) => {
// ... existing openingQuiz logic ...
    try {
        await msg.reply('🔍 *Mencari data opening anime (2020+)...*');
        
        // Pilih tahun acak 2020 - sekarang
        const currentYear = new Date().getFullYear();
        const year = Math.floor(Math.random() * (currentYear - 2020 + 1)) + 2020;
        
        const anime = await apiService.getRandomAnimeFromYear(year);
        if (!anime) return msg.reply('❌ Gagal mendapatkan data anime. Coba lagi!');

        const themes = await apiService.getAnimeThemes(anime.mal_id);
        if (!themes || !themes.openings || themes.openings.length === 0) {
            return msg.reply(`❌ Anime *${anime.title}* tidak memiliki data opening di database. Silakan coba lagi!`);
        }

        // Ambil opening pertama (OP1)
        const opRaw = themes.openings[0];
        
        // Extract song title
        let songTitle = opRaw;
        const titleMatch = opRaw.match(/"([^"]+)"/);
        if (titleMatch) {
            songTitle = titleMatch[1];
        } else {
            songTitle = opRaw.replace(/^\d+:\s+/, '').split(' by ')[0].replace(/"/g, '');
        }

        const question = `🎵 *Opening Quiz (Anime 2020+)* 🎵\n\nApa judul opening pertama dari anime:\n*${anime.title}*?\n\n(Tahun: ${year})`;
        
        // Simpan ke quizManager
        quizManager.createSession(msg.from, 'opening', question, songTitle, [
            `Artis: ${opRaw.split(' by ')[1] || 'Tidak diketahui'}`,
            `Huruf pertama: ${songTitle[0]}`
        ]);

        await msg.reply(question);

    } catch (error) {
        console.error('Error in openingQuiz:', error);
        await msg.reply('❌ Terjadi kesalahan saat memproses Opening Quiz.');
    }
};

const animateRate = async (msg, params) => {
    if (!params) return msg.reply('❌ Format: !animerate <judul anime>');
    const rating = Math.floor(Math.random() * 10) + 1;
    await msg.reply(`⭐ *Anime Rate:* ${params}\nRating: ${rating}/10`);
};

const animeTrivia = async (msg) => {
    await msg.reply('🤔 *Anime Trivia:* Apa arti kata "Anime"?');
};

const waifuTournament = async (msg) => {
    await msg.reply('🏆 *Waifu Tournament:* Memulai tournament waifu baru...');
};

const dailyMission = async (msg) => {
    await msg.reply('📅 *Daily Mission:* Tonton 1 episode anime hari ini untuk 50 points!');
};

const pickDestiny = async (msg) => {
    const destinies = ['Menjadi Hokage', 'Menemukan One Piece', 'Menjadi Hunter', 'Masuk Isekai'];
    const destiny = destinies[Math.floor(Math.random() * destinies.length)];
    await msg.reply(`✨ *Your Destiny:* ${destiny}`);
};

const rolePlay = async (msg) => {
    await msg.reply('🎭 *Roleplay:* Kamu sekarang berada di dunia Isekai. Apa yang kamu lakukan?');
};

const leaderboard = async (msg) => {
    const lb = getLeaderboard();
    await msg.reply('🏆 *Leaderboard:*\n' + JSON.stringify(lb, null, 2));
};

module.exports = {
  guessthecharacter: guessTheCharacter,
  mangaquiz: mangaQuiz,
  openingquiz: openingQuiz,
  animerate: animateRate,
  spinwaifu: spinWaifu,
  spainwaifu: spinWaifu,
  animetrivia: animeTrivia,
  waifutournament: waifuTournament,
  dailymission: dailyMission,
  destiny: pickDestiny,
  roleplay: rolePlay,
  leaderboard
};
