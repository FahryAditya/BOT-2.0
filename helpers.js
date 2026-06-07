const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');

// Fungsi untuk download gambar dan convert ke MessageMedia
async function downloadImage(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const mimeType = response.headers['content-type'];
        return new MessageMedia(mimeType, base64);
    } catch (error) {
        console.error('Error downloading image:', error);
        return null;
    }
}

// Fungsi untuk format teks
function formatAnimeInfo(anime) {
    return `🎌 *${anime.title}*\n\n` +
           `📊 Score: ${anime.score || 'N/A'}\n` +
           `📺 Episodes: ${anime.episodes || 'N/A'}\n` +
           `📅 Status: ${anime.status || 'N/A'}\n` +
           `🎭 Genres: ${anime.genres?.map(g => g.name).join(', ') || 'N/A'}\n\n` +
           `📝 Synopsis:\n${anime.synopsis || 'No synopsis available'}`;
}

function formatMangaInfo(manga) {
    return `📖 *${manga.title}*\n\n` +
           `📊 Score: ${manga.score || 'N/A'}\n` +
           `📚 Chapters: ${manga.chapters || 'N/A'}\n` +
           `📅 Status: ${manga.status || 'N/A'}\n` +
           `🎭 Genres: ${manga.genres?.map(g => g.name).join(', ') || 'N/A'}\n\n` +
           `📝 Synopsis:\n${manga.synopsis || 'No synopsis available'}`;
}

function formatCharacterInfo(character) {
    return `👤 *${character.name}*\n\n` +
           `📺 Anime: ${character.anime || 'N/A'}\n` +
           `❤️ Favorites: ${character.favorites || 'N/A'}\n\n` +
           `📝 About:\n${character.about || 'No information available'}`;
}

// Enhanced random selector to avoid immediate repetition
const lastUsedItems = new Map();

function getRandomItem(array, key = 'default') {
    if (array.length <= 1) return array[0];
    
    let item;
    let attempts = 0;
    do {
        item = array[Math.floor(Math.random() * array.length)];
        attempts++;
    } while (item === lastUsedItems.get(key) && attempts < 5);
    
    lastUsedItems.set(key, item);
    return item;
}

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Verify apakah user adalah admin
 */
const isAdmin = (message) => {
    const senderId = message.author || message.from;
    const senderName = message._data?.notifyName || message._data?.pushname || '';
    
    // Log semua pesan untuk memastikan apa yang sedang terjadi
    console.log(`[DEBUG PERMISSIVE] Admin Check:`);
    console.log(` - Sender ID: ${senderId}`);
    console.log(` - Sender Name: "${senderName}"`);

    // LANGSUNG IZINKAN JIKA ID ADALAH 67629091946608@lid (ID Mimin)
    if (senderId === '67629091946608@lid') {
        console.log(`[DEBUG PERMISSIVE] ID Match: true (Mimin bypass)`);
        return true;
    }
    
    // Fallback jika ID lain
    const adminId = process.env.ADMIN_USER_ID || '6281549027145@c.us';
    const idMatch = senderId === adminId;
    console.log(`[DEBUG PERMISSIVE] ID Match: ${idMatch}`);

    return idMatch; 
};

/**
 * Verify secret command code
 */
const verifySecretCode = (providedCode, secretType) => {
    if (secretType === 'char') {
        return providedCode === process.env.ADMIN_SECRET_CHAR;
    }
    if (secretType === 'anime') {
        return providedCode === process.env.ADMIN_SECRET_ANIME;
    }
    return false;
};

module.exports = {
    downloadImage,
    formatAnimeInfo,
    formatMangaInfo,
    formatCharacterInfo,
    getRandomItem,
    sleep,
    isAdmin,
    verifySecretCode
};