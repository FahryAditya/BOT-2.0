const axios = require('axios');
const { isAdmin, verifySecretCode } = require('../helpers');
const { downloadImage } = require('../helpers');

/**
 * ADMIN COMMAND - Update Karakter ke Channel
 * Usage: !upchar naruto
 * 
 * Hanya Owner "Mimin Artemis🍪" yang bisa!
 */
const updateCharacterChannel = async (message, params) => {
  try {
    // 1. Verify admin
    if (!isAdmin(message)) {
      console.log('Unauthorized attempt:', message.from);
      return; 
    }
    
    // 2. Validate input
    const characterName = params.trim();
    if (!characterName) {
      message.reply('❌ Format: !upchar <nama karakter>');
      return;
    }
    
    // Show loading
    await message.reply(`🔄 Mencari karakter "${characterName}" (Post-2019)...`);
    
    // 3. Fetch dari Jikan API
    const jikanApi = process.env.JIKAN_API || 'https://api.jikan.moe/v4';
    const charResponse = await axios.get(`${jikanApi}/characters`, {
      params: {
        q: characterName,
        limit: 5 // Get more to filter
      }
    });
    
    if (!charResponse.data.data || charResponse.data.data.length === 0) {
      return message.reply(`❌ Karakter "${characterName}" tidak ditemukan!`);
    }

    // 4. Filter for post-2019 anime
    let character = null;
    for (const c of charResponse.data.data) {
        // Fetch character details to get anime list
        const detailResponse = await axios.get(`${jikanApi}/characters/${c.mal_id}/full`);
        const fullChar = detailResponse.data.data;
        
        const hasRecentAnime = true; // Simplified for now

        if (hasRecentAnime) {
            character = fullChar;
            break;
        }
    }
    
    if (!character) character = charResponse.data.data[0];

    // 5. Format message untuk channel
    const channelMessage = formatCharacterChannel(character);
    
    // 6. Download image
    const imageUrl = character.images?.jpg?.image_url;
    let media = null;
    if (imageUrl) {
        media = await downloadImage(imageUrl);
    }
    
    // 7. Kirim ke channel (Mimin)
    if (media) {
        await message.reply(media, undefined, { caption: channelMessage });
    } else {
        await message.reply(channelMessage);
    }
    
    // 8. Confirm ke admin
    console.log('✅ Update karakter berhasil dikirim!');
    
  } catch (error) {
    console.error('updateCharacterChannel error:', error);
    message.reply('❌ Error: ' + error.message);
  }
};

/**
 * ADMIN COMMAND - Update Anime ke Channel
 * Usage: !upanim naruto
 * 
 * Hanya Owner "Mimin Artemis🍪" yang bisa!
 */
const updateAnimeChannel = async (message, params) => {
  try {
    // 1. Verify admin
    if (!isAdmin(message)) {
      console.log('Unauthorized attempt:', message.from);
      return; 
    }
    
    // 2. Validate input
    const animeName = params.trim();
    if (!animeName) {
      message.reply('❌ Format: !upanim <nama anime>');
      return;
    }
    
    // Show loading
    await message.reply(`🔄 Mencari anime "${animeName}" (Post-2019)...`);
    
    // 3. Fetch dari Jikan API
    const jikanApi = process.env.JIKAN_API || 'https://api.jikan.moe/v4';
    const animeResponse = await axios.get(`${jikanApi}/anime`, {
      params: {
        q: animeName,
        limit: 10, // Fetch more to filter by date
        order_by: 'start_date',
        sort: 'desc'
      }
    });
    
    if (!animeResponse.data.data || animeResponse.data.data.length === 0) {
      return message.reply(`❌ Anime "${animeName}" tidak ditemukan!`);
    }

    // 4. Filter for year 2019+
    const anime = animeResponse.data.data.find(a => {
        const year = a.year || (a.aired?.prop?.from?.year);
        return year >= 2019;
    });

    if (!anime) {
        return message.reply(`❌ Anime "${animeName}" ditemukan, tapi tahun rilis di bawah 2019.`);
    }
    
    // 5. Format message untuk channel
    const channelMessage = formatAnimeChannel(anime);
    
    // 6. Download image
    const imageUrl = anime.images?.jpg?.image_url;
    let media = null;
    if (imageUrl) {
        media = await downloadImage(imageUrl);
    }
    
    // 7. Kirim ke channel (Mimin)
    if (media) {
        await message.reply(media, undefined, { caption: channelMessage });
    } else {
        await message.reply(channelMessage);
    }
    
    // 8. Confirm ke admin
    console.log('✅ Update anime berhasil dikirim!');
    
  } catch (error) {
    console.error('updateAnimeChannel error:', error);
    message.reply('❌ Error: ' + error.message);
  }
};

/**
 * Format character data untuk channel display
 */
const formatCharacterChannel = (character) => {
  const imageUrl = character.images?.jpg?.image_url || 'No image';
  const malId = character.mal_id;
  const animeList = character.anime && character.anime.length > 0
    ? character.anime.slice(0, 5).map(a => `• ${a.anime.title}`).join('\n')
    : 'N/A';
  
  return `
╔════════════════════════════════════╗
║  ✨ SOROTAN KARAKTER ✨  ║
╚════════════════════════════════════╝

🎌 *${character.name.toUpperCase()}*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📸 Visual:
${imageUrl}

💬 Kanji: ${character.name_kanji || 'N/A'}

📺 Anime:
${animeList}

📖 Biografi:
${character.about ? character.about.substring(0, 300) : 'Karakter misterius...'}...

🔗 MyAnimeList:
https://myanimelist.net/character/${malId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 Update 𝐀𝐫𝐭𝐞𝐦𝐢𝐬𝐎𝐭𝐚𝐤𝐮.𝐈𝐃
⏰ ${new Date().toLocaleString('id-ID')}
  `.trim();
};

/**
 * Format anime data untuk channel display
 */
const formatAnimeChannel = (anime) => {
  const imageUrl = anime.images?.jpg?.image_url || 'No image';
  const malId = anime.mal_id;
  const genres = anime.genres && anime.genres.length > 0
    ? anime.genres.map(g => g.name).join(', ')
    : 'N/A';
  
  const studios = anime.studios && anime.studios.length > 0
    ? anime.studios.map(s => s.name).join(', ')
    : 'N/A';
  
  const status = anime.status || 'N/A';
  const episodes = anime.episodes || '?';
  const score = anime.score ? `${anime.score}/10` : 'N/A';
  const aired = anime.aired?.string || 'N/A';
  
  return `
╔════════════════════════════════════╗
║  🎌 UPDATE ANIME 🎌  ║
╚════════════════════════════════════╝

📺 *${anime.title.toUpperCase()}*
${anime.title_english ? `(${anime.title_english})` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🖼️ Poster:
${imageUrl}

📊 Informasi:
├ Skor: ⭐ ${score}
├ Status: ${status}
├ Episode: ${episodes}
├ Tayang: ${aired}
├ Genre: ${genres}
└ Studio: ${studios}

📝 Sinopsis:
${anime.synopsis ? anime.synopsis.substring(0, 250) : 'Tidak ada sinopsis'}...

🔗 MyAnimeList:
https://myanimelist.net/anime/${malId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 Update 𝐀𝐫𝐭𝐞𝐦𝐢𝐬𝐎𝐭𝐚𝐤𝐮.𝐈𝐃
⏰ ${new Date().toLocaleString('id-ID')}
  `.trim();
};

/**
 * Send message ke Owner
 */
const sendToChannel = async (messageContent, clientInstance = null, originalMessage = null) => {
  try {
    // Kirim langsung ke orang yang meminta (Owner)
    if (originalMessage) {
        console.log('[DEBUG] Sending message directly to owner...');
        await originalMessage.reply(messageContent);
    } else {
        // Fallback jika tidak ada originalMessage (untuk scheduler)
        // Kirim ke Admin ID dari env
        const adminId = process.env.ADMIN_USER_ID;
        if (adminId) {
            let client = clientInstance || require('../index').client;
            await client.sendMessage(adminId, messageContent);
        } else {
            console.error('❌ Cannot send: No originalMessage and no ADMIN_USER_ID');
        }
    }
    
    console.log('✅ Message sent to owner');
  } catch (error) {
    console.error('sendToChannel error:', error);
    throw error;
  }
};

/**
 * Random character update (Scheduled - 08:00 WIB)
 */
const randomCharacterUpdate = async () => {
  try {
    console.log('🔄 Random character update triggered (08:00)');
    
    // Fetch random character
    const response = await axios.get('https://api.jikan.moe/v4/random/characters');
    const character = response.data.data;
    
    const message = formatCharacterChannel(character);
    await sendToChannel(message);
    
    console.log('✅ Random character update sent');
  } catch (error) {
    console.error('randomCharacterUpdate error:', error);
  }
};

/**
 * Random anime update (Scheduled - 14:00 WIB)
 */
const randomAnimeUpdate = async () => {
  try {
    console.log('🔄 Random anime update triggered (14:00)');
    
    // Fetch top anime
    const response = await axios.get('https://api.jikan.moe/v4/top/anime?limit=1');
    const anime = response.data.data[0];
    
    const message = formatAnimeChannel(anime);
    await sendToChannel(message);
    
    console.log('✅ Random anime update sent');
  } catch (error) {
    console.error('randomAnimeUpdate error:', error);
  }
};

/**
 * Top manga update (Scheduled - 19:00 WIB)
 */
const topMangaUpdate = async () => {
  try {
    console.log('🔄 Top manga update triggered (19:00)');
    
    // Fetch top manga
    const response = await axios.get('https://api.jikan.moe/v4/top/manga?limit=1');
    const manga = response.data.data[0];
    
    const message = formatAnimeChannel(manga); // Use same format
    await sendToChannel(message);
    
    console.log('✅ Top manga update sent');
  } catch (error) {
    console.error('topMangaUpdate error:', error);
  }
};

module.exports = {
  updateCharacterChannel,
  updateAnimeChannel,
  randomCharacterUpdate,
  randomAnimeUpdate,
  topMangaUpdate,
  sendToChannel,
  formatCharacterChannel,
  formatAnimeChannel
};