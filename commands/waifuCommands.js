const apiService = require('../apiService');
const axios = require('axios');
const { downloadImage, getRandomItem } = require('../helpers');
const quizManager = require('../quizManager');

/**
 * Cari waifu berdasarkan nama karakter dan anime
 * Usage: !cariwaifu naruto, naruto
 *        !cariwaifu naruto, naruto shippuden
 */
async function handleCariWaifu(message, params) {
  try {
    // 1. Parse parameters: "naruto, naruto" -> {char: "naruto", anime: "naruto"}
    if (!params || params.trim() === '') {
      return message.reply('❌ Format: !cariwaifu <nama karakter>, <nama anime>\n\nContoh:\n!cariwaifu naruto, naruto\n!cariwaifu sasuke, naruto');
    }
    
    // Split by comma dan trim whitespace
    const parts = params.split(',').map(p => p.trim());
    
    if (parts.length < 2) {
      return message.reply('❌ Harus ada 2 parameter!\nFormat: !cariwaifu <karakter>, <anime>');
    }
    
    const characterName = parts[0].toLowerCase();
    const animeName = parts[1].toLowerCase();
    
    if (!characterName || !animeName) {
      return message.reply('❌ Nama karakter dan anime tidak boleh kosong!');
    }
    
    await message.reply('💕 Mencari waifu kamu...');

    // 2. Fetch data dari API dengan kedua parameter
    const response = await axios.get('https://api.jikan.moe/v4/characters', {
      params: {
        q: characterName,
        limit: 10
      }
    });
    
    if (!response.data.data || response.data.data.length === 0) {
      return message.reply(`❌ Karakter "${characterName}" tidak ditemukan!`);
    }
    
    // 3. Filter hasil berdasarkan anime name
    const character = response.data.data.find(char => {
      if (!char.anime || char.anime.length === 0) return false;
      return char.anime.some(a => 
        a.anime.title.toLowerCase().includes(animeName) ||
        a.anime.title_english?.toLowerCase().includes(animeName)
      );
    });
    
    if (!character) {
      // Jika tidak ketemu sesuai anime, ambil yang paling relevan
      const fallback = response.data.data[0];
      return message.reply(`⚠️ Karakter "${characterName}" ditemukan tapi bukan dari "${animeName}".\n\n${formatCharacterData(fallback)}`);
    }
    
    // 4. Format dan kirim response
    const formattedData = formatCharacterData(character);
    
    // Download dan kirim gambar
    const imageUrl = character.images?.jpg?.image_url;
    if (imageUrl) {
        const media = await downloadImage(imageUrl);
        if (media) {
            await message.reply(media, null, { caption: formattedData });
        } else {
            await message.reply(formattedData);
        }
    } else {
        await message.reply(formattedData);
    }
    
  } catch (error) {
    console.error('cariWaifu error:', error);
    message.reply('❌ Gagal mencari waifu. API mungkin sedang error.');
  }
}

/**
 * Format character data untuk display
 */
const formatCharacterData = (char) => {
  const malId = char.mal_id;
  
  let animeList = 'Tidak ada anime';
  if (char.anime && char.anime.length > 0) {
    animeList = char.anime.slice(0, 3).map(a => `• ${a.anime.title}`).join('\n');
  }
  
  return `
━━━━━━━━━━━━━━━━━━━━━━
✨ ${char.name.toUpperCase()} ✨
━━━━━━━━━━━━━━━━━━━━━━

💬 Kanji: ${char.name_kanji || 'N/A'}

📺 Anime:
${animeList}

📖 About:
${char.about?.substring(0, 200) || 'Tidak ada deskripsi'}...

🔗 Link: https://myanimelist.net/character/${char.mal_id}

━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
};

async function handleRandomWaifu(msg) {
    await msg.reply('💕 Mengambil random waifu...');
    
    const waifuUrl = await apiService.getRandomWaifu();
    
    if (!waifuUrl) {
        return msg.reply('❌ Gagal mengambil waifu!');
    }
    
    const media = await downloadImage(waifuUrl);
    
    if (media) {
        await msg.reply(media, null, { 
            caption: '💕 *Random Waifu*\n\nIni dia waifu random untuk kamu! Suka ga? 😊' 
        });
    } else {
        await msg.reply('❌ Gagal mendownload gambar waifu!');
    }
}

async function handleWaifuQuiz(msg) {
    const chatId = msg.from;
    
    // Cek apakah sudah ada quiz aktif
    if (quizManager.hasActiveSession(chatId)) {
        return msg.reply(
            '⚠️ Kamu masih punya quiz aktif!\n\n' +
            'Selesaikan dulu atau ketik !skipquiz untuk skip.'
        );
    }
    
    const quiz = getRandomItem(waifuQuizData);
    
    // Create quiz session
    quizManager.createSession(
        chatId, 
        'waifu', 
        quiz.clue, 
        quiz.answer,
        quiz.hints
    );
    
    await msg.reply(
        `💕 *WAIFU QUIZ!*\n\n` +
        `🎮 *Tebak waifu dari petunjuk ini:*\n\n` +
        `${quiz.clue}\n\n` +
        `📺 *Anime:* ${quiz.anime}\n` +
        `💡 *Hints:* ${quiz.hints.join(', ')}\n\n` +
        `📝 Balas pesan ini dengan jawabanmu!\n` +
        `⏰ Waktu: 10 menit\n\n` +
        `_Ketik !skipquiz untuk skip_`
    );
}

async function handleOtakudesu(msg) {
    // Rekomendasi anime berdasarkan mood random
    const moods = [
        { mood: '😊 Happy', genres: 'Comedy, Slice of Life' },
        { mood: '😢 Sad', genres: 'Drama, Romance' },
        { mood: '😎 Epic', genres: 'Action, Adventure' },
        { mood: '🤔 Thinking', genres: 'Mystery, Psychological' },
        { mood: '😱 Thrilled', genres: 'Horror, Thriller' },
        { mood: '💕 Romance', genres: 'Romance, Shoujo' }
    ];
    
    const selectedMood = getRandomItem(moods, 'otakudesu_mood');
    
    await msg.reply(
        `🎌 *REKOMENDASI ANIME*\n\n` +
        `Mood kamu hari ini: ${selectedMood.mood}\n\n` +
        `📺 *Genre yang cocok:*\n${selectedMood.genres}\n\n` +
        `💡 Coba search anime dengan genre ini menggunakan !animegenre atau !searchgenre!`
    );
}

module.exports = {
    cariWaifu: handleCariWaifu,
    randomWaifu: handleRandomWaifu,
    waifuQuiz: handleWaifuQuiz,
    otakudesu: handleOtakudesu
};